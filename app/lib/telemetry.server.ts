import { createClient } from "@supabase/supabase-js";

/** Fire-and-forget product telemetry into the events table. */
export function trackEvent(
  name: string,
  props: Record<string, unknown> = {},
  userId?: string | null,
) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  const svc = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  void svc
    .from("events")
    .insert({ name, props, user_id: userId ?? null })
    .then(({ error }) => {
      if (error) console.error("trackEvent failed:", error.message);
    });
}
