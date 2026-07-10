import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { env } from "./env.server";

/**
 * Per-request Supabase client bound to the user's auth cookies.
 * Merge the returned `headers` into every loader/action response so
 * refreshed tokens reach the browser.
 */
export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();
  const e = env();

  const supabase = createServerClient(e.SUPABASE_URL, e.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" }),
        );
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          );
        }
      },
    },
  });

  return { supabase, headers };
}

/**
 * Service-role client for trusted server-side work (credit deduction,
 * telemetry, webhooks). Bypasses RLS — never expose to loaders that
 * return user-controlled queries.
 */
export function createSupabaseAdminClient() {
  const e = env();
  if (!e.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(e.SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Loads the signed-in user's profile (or null). */
export async function getUserProfile(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, supabase, headers };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile, supabase, headers };
}
