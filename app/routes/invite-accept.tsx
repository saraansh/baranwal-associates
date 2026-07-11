import { data, Link, redirect } from "react-router";

import type { Route } from "./+types/invite-accept";
import { requireUser } from "~/lib/auth.server";
import { createSupabaseAdminClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Accept invite — Baranwal Associates" }];
}

/**
 * Invite acceptance: requires login first, then validates the token via the
 * service-role client (invitee can't read invites under RLS), matches the
 * email, applies the role and project membership, and marks it accepted.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  const { user, profile, headers } = await requireUser(request);
  const admin = createSupabaseAdminClient();

  const { data: invite } = await admin
    .from("invites")
    .select("*")
    .eq("token", params.token)
    .maybeSingle();

  if (!invite) {
    return data({ status: "invalid" as const }, { headers });
  }
  if (invite.accepted_at) {
    return redirect("/portal", { headers });
  }
  if (new Date(invite.expires_at) < new Date()) {
    return data({ status: "expired" as const }, { headers });
  }
  if (invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return data(
      { status: "wrong-account" as const, invitedEmail: invite.email },
      { headers },
    );
  }

  // Apply the invite: role upgrade + optional project membership.
  const updates: PromiseLike<unknown>[] = [
    admin
      .from("profiles")
      .update({ role: invite.role })
      .eq("id", profile.id)
      .then(),
    admin
      .from("invites")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invite.id)
      .then(),
  ];
  if (invite.project_id) {
    updates.push(
      admin
        .from("project_members")
        .upsert({
          project_id: invite.project_id,
          user_id: profile.id,
          member_role:
            invite.role === "collaborator" ? "structural_engineer" : "member",
          added_by: invite.invited_by,
        })
        .then(),
    );
  }
  await Promise.all(updates);

  return redirect("/portal?welcome=1", { headers });
}

export default function InviteAccept({ loaderData }: Route.ComponentProps) {
  const status = "status" in loaderData ? loaderData.status : "invalid";
  const copy = {
    invalid: {
      title: "This invite link isn't valid",
      body: "The link may have been mistyped or withdrawn. Ask the studio to send a fresh one.",
    },
    expired: {
      title: "This invite has expired",
      body: "Invite links are valid for 14 days. Ask the studio to send a fresh one.",
    },
    "wrong-account": {
      title: "Signed in with a different account",
      body: `This invite was sent to ${"invitedEmail" in loaderData ? loaderData.invitedEmail : "another email"}. Sign out, then sign in with that Google account and open the link again.`,
    },
  }[status];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="annotation mb-4">Baranwal Associates</p>
      <h1 className="font-display text-4xl font-light">{copy.title}</h1>
      <p className="mt-4 max-w-md text-muted">{copy.body}</p>
      <Link
        to="/portal"
        className="mt-8 rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
      >
        Go to portal
      </Link>
    </main>
  );
}
