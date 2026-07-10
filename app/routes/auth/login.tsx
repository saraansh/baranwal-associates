import { Form, redirect } from "react-router";

import type { Route } from "./+types/login";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign in — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) throw redirect("/portal");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const origin = new URL(request.url).origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    throw new Response(error?.message ?? "OAuth initialisation failed", {
      status: 500,
    });
  }

  return redirect(data.url, { headers });
}

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm opacity-70">
          Access your projects, drawings and the interior visualizer.
        </p>
        <Form method="post">
          <button
            type="submit"
            className="w-full rounded-md border px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
          >
            Continue with Google
          </button>
        </Form>
      </div>
    </main>
  );
}
