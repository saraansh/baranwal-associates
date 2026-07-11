import { createClient } from "@supabase/supabase-js";
import express from "express";
import { z } from "zod";

import { requireApiUser } from "./auth";
import { presignDownload, presignUpload } from "./storage";

export const aiRouter = express.Router();
aiRouter.use(requireApiUser);

function admin() {
  return createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function settings(keys: string[]) {
  const { data } = await admin()
    .from("system_settings")
    .select("key, value")
    .in("key", keys);
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}

const PRESET_LABELS: Record<string, string> = {
  style: "interior style",
  lighting_mood: "lighting mood",
  flooring: "flooring",
  wall_finish: "wall finish",
  furniture_density: "furniture density",
  color_scheme: "colour scheme",
};

const generateSchema = z.object({
  threadId: z.guid().optional(),
  imageKey: z.string().max(500).optional(),
  presets: z.record(z.string(), z.string()).default({}),
  prompt: z.string().max(2000).default(""),
});

/**
 * One generation = one credit (admin-tunable), with the first N free after
 * login. Credit spend is atomic via record_generation(). Without an OpenAI
 * key outside production, a mock generator keeps local dev and e2e running.
 */
aiRouter.post("/generate", async (req, res) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message });
    return;
  }
  const { threadId, imageKey, presets, prompt } = parsed.data;
  const user = req.user!;
  const svc = admin();

  const cfg = await settings([
    "ai.model",
    "ai.trial_generations",
    "ai.credits_per_generation",
    "ai.max_output_tokens",
  ]);
  const trialLimit = Number(cfg["ai.trial_generations"] ?? 2);
  const creditsPer = Number(cfg["ai.credits_per_generation"] ?? 1);
  const model = String(cfg["ai.model"] ?? "gpt-4o").replace(/"/g, "");

  // Trial or paid?
  const { data: trialUsed } = await svc.rpc("trial_generations_used", {
    p_user: user.id,
  });
  const isTrial = (trialUsed ?? 0) < trialLimit;

  if (!isTrial) {
    const { data: balance } = await svc.rpc("credit_balance", {
      p_user: user.id,
    });
    if ((balance ?? 0) < creditsPer) {
      res.status(402).json({
        error: "You're out of credits — buy a pack to keep generating.",
        code: "insufficient_credits",
      });
      return;
    }
  }

  // Ensure a thread exists (owned by the user, kind ai_chat).
  let thread = threadId;
  if (thread) {
    const { data: existing } = await svc
      .from("threads")
      .select("id, kind, created_by")
      .eq("id", thread)
      .maybeSingle();
    if (
      !existing ||
      existing.kind !== "ai_chat" ||
      existing.created_by !== user.id
    ) {
      res.status(404).json({ error: "Thread not found" });
      return;
    }
  }
  if (!thread) {
    const { data: t, error } = await svc
      .from("threads")
      .insert({
        kind: "ai_chat",
        title: "Interior visualizer",
        created_by: user.id,
      })
      .select("id")
      .single();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    thread = t.id;
  }

  // Record the user's turn before generating.
  const userBody =
    prompt ||
    (Object.keys(presets).length
      ? "Generate with the selected presets."
      : "Generate.");
  const { data: userMessage } = await svc
    .from("messages")
    .insert({ thread_id: thread, sender_id: user.id, body: userBody })
    .select("id")
    .single();
  if (userMessage?.id && imageKey) {
    await svc.from("message_attachments").insert({
      message_id: userMessage.id,
      storage_key: imageKey,
      filename: "room-photo",
      mime_type: "image/*",
    });
  }

  const presetText = Object.entries(presets)
    .filter(([, v]) => v)
    .map(([k, v]) => `${PRESET_LABELS[k] ?? k}: ${v.replace(/-/g, " ")}`)
    .join(", ");
  const fullPrompt = [
    "Photorealistic interior redesign of the provided room photo.",
    presetText && `Apply — ${presetText}.`,
    prompt,
    "Keep the room's architecture (walls, windows, doors) intact.",
  ]
    .filter(Boolean)
    .join(" ");

  let outputKey: string;
  let usedModel = model;

  if (!process.env.OPENAI_API_KEY && process.env.NODE_ENV !== "production") {
    // Mock generator: 1x1 PNG so the full flow works without a key.
    usedModel = "mock";
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPsqPlfDwAFiQJ0DPLmDAAAAABJRU5ErkJggg==",
      "base64",
    );
    outputKey = `ai/${user.id}/${Date.now().toString(36)}-mock.png`;
    const url = await presignUpload(outputKey, "image/png");
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: png,
    });
  } else if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: "AI generation is not configured yet." });
    return;
  } else {
    try {
      // Fetch the input image (if any) and call OpenAI's image API.
      const form = new FormData();
      form.set("model", "gpt-image-1");
      form.set("prompt", fullPrompt);
      form.set("size", "1024x1024");
      let endpoint = "https://api.openai.com/v1/images/generations";
      if (imageKey) {
        const inputUrl = await presignDownload(imageKey);
        const input = await fetch(inputUrl);
        form.set(
          "image",
          new File([await input.arrayBuffer()], "room.png", {
            type: input.headers.get("content-type") ?? "image/png",
          }),
        );
        endpoint = "https://api.openai.com/v1/images/edits";
      }
      const ai = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: form,
      });
      if (!ai.ok) {
        const detail = await ai.text();
        console.error("OpenAI error:", detail.slice(0, 500));
        res.status(502).json({ error: "The AI service had a problem — you were not charged." });
        return;
      }
      const payload = (await ai.json()) as { data: { b64_json: string }[] };
      const image = Buffer.from(payload.data[0]!.b64_json, "base64");
      usedModel = "gpt-image-1";
      outputKey = `ai/${user.id}/${Date.now().toString(36)}.png`;
      const url = await presignUpload(outputKey, "image/png");
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "image/png" },
        body: image,
      });
    } catch (e) {
      console.error("Generation failed:", e);
      res.status(502).json({ error: "The AI service had a problem — you were not charged." });
      return;
    }
  }

  // Persist the assistant message + atomic credit spend.
  const summary = presetText
    ? `Applied — ${presetText}.${prompt ? ` Notes: ${prompt}` : ""}`
    : prompt || "Generated a redesign of your room.";
  const { data: message } = await svc
    .from("messages")
    .insert({
      thread_id: thread,
      sender_id: null,
      is_ai: true,
      body: `✨ ${summary}`,
    })
    .select("id")
    .single();

  const { data: generationId, error: genError } = await svc.rpc(
    "record_generation",
    {
      p_user: user.id,
      p_thread: thread,
      p_message: message?.id ?? null,
      p_input_keys: imageKey ? [imageKey] : [],
      p_presets: presets,
      p_output_key: outputKey,
      p_model: usedModel,
      p_is_trial: isTrial,
      p_credits: creditsPer,
    },
  );
  if (genError) {
    const insufficient = genError.message.includes("insufficient_credits");
    res.status(insufficient ? 402 : 500).json({
      error: insufficient
        ? "You're out of credits — buy a pack to keep generating."
        : genError.message,
    });
    return;
  }
  if (message?.id) {
    await svc.from("message_attachments").insert({
      message_id: message.id,
      storage_key: outputKey,
      filename: "redesign.png",
      mime_type: "image/png",
    });
  }

  const { trackEvent } = await import("~/lib/telemetry.server");
  trackEvent(
    "ai.generation",
    { model: usedModel, isTrial, presets: Object.keys(presets) },
    user.id,
  );

  const { data: balanceAfter } = await svc.rpc("credit_balance", {
    p_user: user.id,
  });
  const { data: trialAfter } = await svc.rpc("trial_generations_used", {
    p_user: user.id,
  });

  res.json({
    generationId,
    threadId: thread,
    outputKey,
    outputUrl: await presignDownload(outputKey),
    isTrial,
    trialRemaining: Math.max(0, trialLimit - (trialAfter ?? 0)),
    credits: balanceAfter ?? 0,
  });
});
