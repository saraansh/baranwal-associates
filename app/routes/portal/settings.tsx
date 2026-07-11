import { useEffect, useState } from "react";
import { data, Form, useRouteLoaderData } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/settings";
import { requireUser } from "~/lib/auth.server";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import type { loader as rootLoader } from "~/root";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Settings — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { profile, headers } = await requireUser(request);
  return data({ profile }, { headers });
}

const profileSchema = z.object({
  full_name: z.string().trim().min(2),
  phone: z.string().trim().optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const parsed = profileSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );
  if (!parsed.success) {
    return data({ error: "Invalid input" }, { status: 400, headers });
  }
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
    })
    .eq("id", profile.id);
  if (error) return data({ error: error.message }, { status: 500, headers });
  return data({ ok: true }, { headers });
}

export default function Settings({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { profile } = loaderData;
  const saved = actionData && "ok" in actionData;

  return (
    <main className="mx-auto max-w-2xl">
      <p className="annotation">Settings</p>
      <h1 className="mt-2 font-display text-4xl font-light">Your account</h1>

      <section className="mt-10 rounded-sm border border-line p-6">
        <p className="annotation">Profile</p>
        <Form method="post" className="mt-4 space-y-5">
          <div>
            <label htmlFor="full_name" className="annotation mb-1 block">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name}
              required
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="phone" className="annotation mb-1 block">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={profile.phone ?? ""}
              className="field-input"
              placeholder="+91"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              Save
            </button>
            {saved && <p className="annotation !text-accent">Saved ✓</p>}
          </div>
        </Form>
      </section>

      <MfaSection />
    </main>
  );
}

/**
 * TOTP two-factor enrollment — recommended, never required. Runs fully
 * client-side against Supabase Auth with the user's session.
 */
function MfaSection() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [factors, setFactors] = useState<
    { id: string; status: string; friendly_name?: string | null }[] | null
  >(null);
  const [enroll, setEnroll] = useState<{
    factorId: string;
    qr: string;
    secret: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  // Browser client only exists after mount — createBrowserClient is not
  // SSR-safe.
  const [supabase, setSupabase] = useState<ReturnType<
    typeof getSupabaseBrowserClient
  > | null>(null);

  useEffect(() => {
    if (!rootData?.env) return;
    const client = getSupabaseBrowserClient(rootData.env);
    setSupabase(client);
    client.auth.mfa.listFactors().then(({ data }) => {
      setFactors(data?.totp ?? []);
    });
  }, [rootData?.env]);

  const verified = (factors ?? []).filter((f) => f.status === "verified");

  async function startEnroll() {
    if (!supabase) return;
    setMessage(null);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator app",
    });
    if (error) return setMessage(error.message);
    setEnroll({
      factorId: data.id,
      qr: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function verifyEnroll() {
    if (!enroll) return;
    setMessage(null);
    const { data: challenge, error: challengeError } =
      await supabase!.auth.mfa.challenge({ factorId: enroll.factorId });
    if (challengeError) return setMessage(challengeError.message);
    const { error } = await supabase!.auth.mfa.verify({
      factorId: enroll.factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (error) return setMessage(error.message);
    setEnroll(null);
    setCode("");
    setMessage("Two-factor authentication is on. ✓");
    const { data } = await supabase!.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }

  async function removeFactor(id: string) {
    setMessage(null);
    const { error } = await supabase!.auth.mfa.unenroll({ factorId: id });
    if (error) return setMessage(error.message);
    const { data } = await supabase!.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }

  return (
    <section className="mt-8 rounded-sm border border-line p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="annotation">Two-factor authentication</p>
        {verified.length === 0 && (
          <span className="annotation !text-accent">recommended</span>
        )}
      </div>

      {verified.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm">
            ✓ Enabled with an authenticator app
            {verified[0].friendly_name
              ? ` (${verified[0].friendly_name})`
              : ""}
            .
          </p>
          <button
            type="button"
            onClick={() => removeFactor(verified[0].id)}
            className="mt-4 rounded-full border border-line px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Turn off 2FA
          </button>
        </div>
      ) : enroll ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted">
            Scan with Google Authenticator, Authy or any TOTP app, then enter
            the 6-digit code.
          </p>
          <img
            src={enroll.qr}
            alt="TOTP enrollment QR code"
            className="h-40 w-40 rounded-sm border border-line bg-white p-2"
          />
          <p className="select-all font-mono text-xs text-muted">
            {enroll.secret}
          </p>
          <div className="flex items-center gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="field-input w-28 text-center font-mono"
            />
            <button
              type="button"
              onClick={verifyEnroll}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => setEnroll(null)}
              className="text-sm text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-muted">
            Add an authenticator app so signing in needs both your Google
            account and a one-time code. Optional, but we recommend it —
            your project drawings and payments live here.
          </p>
          <button
            type="button"
            onClick={startEnroll}
            disabled={!supabase}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-60"
          >
            Set up 2FA
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-accent">{message}</p>}
    </section>
  );
}
