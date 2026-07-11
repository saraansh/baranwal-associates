import { data, Form } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/invites";
import { requireUser } from "~/lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Invites — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = await requireUser(request, [
    "system_admin",
    "employee",
    "accountant",
  ]);

  const [{ data: invites }, { data: projects }] = await Promise.all([
    supabase
      .from("invites")
      .select("id, email, role, token, expires_at, accepted_at, created_at, projects(name)")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("projects").select("id, name").order("name"),
  ]);

  return data(
    { invites: invites ?? [], projects: projects ?? [], origin: new URL(request.url).origin },
    { headers },
  );
}

const inviteSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["client", "collaborator", "employee", "accountant"]),
  project_id: z.guid().optional().or(z.literal("")),
});

export async function action({ request }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request, [
    "system_admin",
    "employee",
  ]);
  const parsed = inviteSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );
  if (!parsed.success) {
    return data({ error: "Invalid input" }, { status: 400, headers });
  }
  // Only the admin can invite staff.
  if (
    ["employee", "accountant"].includes(parsed.data.role) &&
    profile.role !== "system_admin"
  ) {
    return data(
      { error: "Only the system admin can invite staff" },
      { status: 403, headers },
    );
  }

  const { error } = await supabase.from("invites").insert({
    email: parsed.data.email.toLowerCase(),
    role: parsed.data.role,
    project_id: parsed.data.project_id || null,
    invited_by: profile.id,
  });
  if (error) return data({ error: error.message }, { status: 500, headers });
  return data({ ok: true }, { headers });
}

export default function Invites({ loaderData, actionData }: Route.ComponentProps) {
  const { invites, projects, origin } = loaderData;
  const error = actionData && "error" in actionData ? actionData.error : undefined;

  return (
    <main>
      <p className="annotation">Team & clients</p>
      <h1 className="mt-2 font-display text-4xl font-light">Invites</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {invites.map((inv) => {
              const expired =
                !inv.accepted_at && new Date(inv.expires_at) < new Date();
              return (
                <li key={inv.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{inv.email}</p>
                    <span className="annotation">
                      {inv.role}
                      {(inv.projects as { name?: string })?.name
                        ? ` — ${(inv.projects as { name?: string }).name}`
                        : ""}
                    </span>
                  </div>
                  <p className="annotation mt-1">
                    {inv.accepted_at
                      ? `accepted ${new Date(inv.accepted_at).toLocaleDateString("en-IN")}`
                      : expired
                        ? "expired"
                        : `pending — expires ${new Date(inv.expires_at).toLocaleDateString("en-IN")}`}
                  </p>
                  {!inv.accepted_at && !expired && (
                    <p className="mt-2 select-all break-all rounded-sm bg-surface px-3 py-2 font-mono text-xs text-muted">
                      {origin}/invite/{inv.token}
                    </p>
                  )}
                </li>
              );
            })}
            {invites.length === 0 && (
              <li className="py-8 text-sm text-muted">No invites yet.</li>
            )}
          </ul>
        </section>

        <aside className="lg:col-span-5">
          <div className="rounded-sm border border-line p-6">
            <p className="annotation">Send an invite</p>
            <Form method="post" className="mt-4 space-y-5">
              <div>
                <label htmlFor="email" className="annotation mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="field-input"
                  placeholder="person@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="annotation mb-1 block">
                    Role
                  </label>
                  <select id="role" name="role" className="field-input">
                    <option value="client">Client</option>
                    <option value="collaborator">Collaborator (engineer)</option>
                    <option value="employee">Employee</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project_id" className="annotation mb-1 block">
                    Project (optional)
                  </label>
                  <select id="project_id" name="project_id" className="field-input">
                    <option value="">—</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && <p className="text-sm text-accent">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                Create invite link
              </button>
              <p className="annotation">
                Share the generated link — it's valid for 14 days and only
                works for the invited email.
              </p>
            </Form>
          </div>
        </aside>
      </div>
    </main>
  );
}
