import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { PublicEnv } from "./env.server";

let client: SupabaseClient | undefined;

/** Browser-side Supabase client (Realtime subscriptions, OAuth redirects). */
export function getSupabaseBrowserClient(env: PublicEnv) {
  client ??= createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  return client;
}
