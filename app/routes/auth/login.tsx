import { data, Form, Link, redirect, useSearchParams } from "react-router";

import type { Route } from "./+types/login";
import { env } from "~/lib/env.server";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign in — Baranwal Associates" }];
}

function passwordLoginAllowed() {
  return env().NODE_ENV !== "production";
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) throw redirect("/portal");
  return { devLogin: passwordLoginAllowed() };
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/portal";
  const form = await request.formData();

  // Dev-only email/password sign-in for localhost and e2e tests.
  if (form.get("intent") === "password" && passwordLoginAllowed()) {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email")?.toString() ?? "",
      password: form.get("password")?.toString() ?? "",
    });
    if (error) {
      return data({ error: error.message }, { status: 401, headers });
    }
    return redirect(next, { headers });
  }

  const { data: oauth, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error || !oauth.url) {
    return data(
      { error: error?.message ?? "OAuth initialisation failed" },
      { status: 500, headers },
    );
  }
  return redirect(oauth.url, { headers });
}

export default function Login({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [params] = useSearchParams();
  const error =
    (actionData && "error" in actionData && actionData.error) ||
    (params.get("error") === "oauth"
      ? "Google sign-in didn't complete — please try again."
      : null);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="annotation hover:text-accent">
          ← baranwalassociates.com
        </Link>
        <h1 className="mt-6 font-display text-3xl font-light">
          Client <span className="italic text-accent">portal</span>
        </h1>
        <p className="mt-3 text-sm text-muted">
          Your projects, drawings, conversations and the interior visualizer —
          all in one place.
        </p>

        <Form method="post" className="mt-8">
          <button
            type="submit"
            className="w-full rounded-full border border-ink px-4 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent hover:text-paper"
          >
            Continue with Google
          </button>
        </Form>

        {loaderData.devLogin && (
          <Form
            method="post"
            className="mt-8 space-y-4 rounded-sm border border-dashed border-line p-5"
          >
            <p className="annotation">dev sign-in (local only)</p>
            <input type="hidden" name="intent" value="password" />
            <input
              name="email"
              type="email"
              required
              placeholder="email"
              className="field-input"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="password"
              className="field-input"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-surface px-4 py-2 text-sm transition-colors hover:text-accent"
            >
              Sign in
            </button>
          </Form>
        )}

        {error && <p className="mt-5 text-sm text-accent">{error}</p>}

        <p className="annotation mt-8">
          2FA via authenticator app is recommended — set it up under Settings
          after signing in.
        </p>
      </div>
    </main>
  );
}
