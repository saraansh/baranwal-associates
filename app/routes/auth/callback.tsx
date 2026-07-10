import { redirect } from "react-router";

import type { Route } from "./+types/callback";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/portal";

  if (!code) return redirect("/auth/login");

  const { supabase, headers } = createSupabaseServerClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback failed:", error.message);
    return redirect("/auth/login?error=oauth", { headers });
  }

  return redirect(next, { headers });
}
