import { redirect } from "react-router";

import type { AppRole, Profile } from "./roles";
import { getUserProfile } from "./supabase.server";

export { isStaff, STAFF_ROLES } from "./roles";
export type { AppRole, Profile } from "./roles";

/**
 * Loads the signed-in user or redirects to login. Pass `roles` to also
 * enforce authorization (404s rather than 403s to avoid leaking routes).
 */
export async function requireUser(request: Request, roles?: AppRole[]) {
  const { user, profile, supabase, headers } = await getUserProfile(request);

  if (!user || !profile) {
    const next = new URL(request.url).pathname;
    throw redirect(`/auth/login?next=${encodeURIComponent(next)}`, {
      headers,
    });
  }
  if (!profile.is_active) {
    throw new Response("Account disabled", { status: 403 });
  }
  if (roles && !roles.includes(profile.role as AppRole)) {
    throw new Response("Not Found", { status: 404 });
  }

  return { user, profile: profile as Profile, supabase, headers };
}
