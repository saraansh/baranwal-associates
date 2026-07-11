import { createHmac, timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import express from "express";
import { z } from "zod";

import { requireApiUser } from "./auth";

export const paymentsRouter = express.Router();

function admin() {
  return createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function razorpayConfigured() {
  return Boolean(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );
}

/** Dev/e2e fallback when Razorpay keys are absent outside production. */
function mockMode() {
  return !razorpayConfigured() && process.env.NODE_ENV !== "production";
}

async function inrPerCredit(): Promise<number> {
  const { data } = await admin()
    .from("system_settings")
    .select("value")
    .eq("key", "credits.inr_per_credit")
    .maybeSingle();
  return Number(data?.value ?? 99);
}

const orderSchema = z.object({
  credits: z.coerce.number().int().min(1).max(1000),
});

/** Creates a Razorpay order (or a mock one) for a credit pack. */
paymentsRouter.post(
  "/razorpay/order",
  express.json(),
  requireApiUser,
  async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credit amount" });
    return;
  }
  const credits = parsed.data.credits;
  const amountInr = credits * (await inrPerCredit());
  const svc = admin();

  const { data: payment, error } = await svc
    .from("payments")
    .insert({
      user_id: req.user!.id,
      amount_inr: amountInr,
      method: "razorpay",
      status: "created",
      notes: `AI visualizer credit pack (${credits} credits)`,
    })
    .select("id")
    .single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (mockMode()) {
    res.json({
      mock: true,
      paymentId: payment.id,
      credits,
      amountInr,
    });
    return;
  }
  if (!razorpayConfigured()) {
    res.status(503).json({ error: "Payments are not configured yet." });
    return;
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");
  const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amountInr * 100), // paise
      currency: "INR",
      receipt: payment.id,
      notes: { payment_id: payment.id, credits: String(credits) },
    }),
  });
  if (!orderRes.ok) {
    console.error("Razorpay order failed:", await orderRes.text());
    res.status(502).json({ error: "Could not start the payment." });
    return;
  }
  const order = (await orderRes.json()) as { id: string };
  await svc
    .from("payments")
    .update({ razorpay_order_id: order.id })
    .eq("id", payment.id);

    res.json({
      mock: false,
      paymentId: payment.id,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      credits,
      amountInr,
    });
  },
);

const verifySchema = z.object({
  paymentId: z.guid(),
  credits: z.coerce.number().int().min(1).max(1000),
  razorpay_order_id: z.string().optional(),
  razorpay_payment_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

/** Client-side success callback: verify signature, mark paid, grant credits. */
paymentsRouter.post(
  "/razorpay/verify",
  express.json(),
  requireApiUser,
  async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid verification payload" });
    return;
  }
  const input = parsed.data;
  const svc = admin();

  const { data: payment } = await svc
    .from("payments")
    .select("id, user_id, status, razorpay_order_id")
    .eq("id", input.paymentId)
    .maybeSingle();
  if (!payment || payment.user_id !== req.user!.id) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  if (mockMode()) {
    await svc
      .from("payments")
      .update({ status: "paid", razorpay_payment_id: "pay_mock" })
      .eq("id", payment.id);
  } else {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      input;
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      razorpay_order_id !== payment.razorpay_order_id
    ) {
      res.status(400).json({ error: "Signature verification failed" });
      return;
    }
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(razorpay_signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      res.status(400).json({ error: "Signature verification failed" });
      return;
    }
    await svc
      .from("payments")
      .update({ status: "paid", razorpay_payment_id })
      .eq("id", payment.id);
  }

  await svc.rpc("grant_credits_for_payment", {
    p_payment: payment.id,
    p_credits: input.credits,
  });
    const { data: balance } = await svc.rpc("credit_balance", {
      p_user: req.user!.id,
    });
    res.json({ ok: true, credits: balance ?? 0 });
  },
);

/**
 * Razorpay webhook — server-to-server redundancy for missed callbacks.
 * Signature is HMAC-SHA256 of the raw body with the webhook secret;
 * grant_credits_for_payment is idempotent so double delivery is safe.
 */
paymentsRouter.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      res.status(503).end();
      return;
    }
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body as Buffer;
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    if (
      typeof signature !== "string" ||
      signature.length !== expected.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    ) {
      res.status(400).end();
      return;
    }

    const event = JSON.parse(body.toString());
    if (event.event === "payment.captured") {
      const entity = event.payload?.payment?.entity;
      const paymentId = entity?.notes?.payment_id;
      const credits = Number(entity?.notes?.credits ?? 0);
      if (paymentId && credits > 0) {
        const svc = admin();
        await svc
          .from("payments")
          .update({ status: "paid", razorpay_payment_id: entity.id })
          .eq("id", paymentId);
        await svc.rpc("grant_credits_for_payment", {
          p_payment: paymentId,
          p_credits: credits,
        });
      }
    }
    res.json({ ok: true });
  },
);
