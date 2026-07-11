import { data, Link } from "react-router";

import type { Route } from "./+types/dashboard";
import { isStaff, requireUser } from "~/lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const staff = isStaff(profile);

  // Staff see everything; everyone else sees projects they own or belong
  // to. (RLS also exposes is_public portfolio rows, which don't belong on
  // a personal dashboard — hence the explicit filter.)
  let projectsQuery = supabase
    .from("projects")
    .select("id, slug, name, location, status, progress, cover_image_url")
    .order("updated_at", { ascending: false })
    .limit(12);

  if (!staff) {
    const { data: memberships } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", profile.id);
    const ids = (memberships ?? []).map((m) => m.project_id);
    projectsQuery = projectsQuery.or(
      `client_id.eq.${profile.id}${ids.length ? `,id.in.(${ids.join(",")})` : ""}`,
    );
  }

  const [{ data: projects }, { data: balanceRows }, enquiries] =
    await Promise.all([
      projectsQuery,
      supabase.from("credits_ledger").select("delta").eq("user_id", profile.id),
      staff
        ? supabase
            .from("contact_enquiries")
            .select("id, name, email, message, status, created_at")
            .order("created_at", { ascending: false })
            .limit(6)
        : Promise.resolve({ data: null }),
    ]);

  const credits = (balanceRows ?? []).reduce((sum, r) => sum + r.delta, 0);

  return data(
    {
      profile,
      staff,
      projects: projects ?? [],
      credits,
      enquiries: enquiries.data ?? [],
    },
    { headers },
  );
}

const STATUS_LABELS: Record<string, string> = {
  enquiry: "Enquiry",
  onboarded: "Onboarded",
  design: "In design",
  construction: "Under construction",
  completed: "Completed",
  on_hold: "On hold",
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { profile, staff, projects, credits, enquiries } = loaderData;

  return (
    <main>
      <p className="annotation">Dashboard</p>
      <h1 className="mt-2 font-display text-4xl font-light">
        Namaste, {profile.full_name.split(" ")[0]}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="flex items-baseline justify-between">
            <h2 className="annotation">
              {staff ? "All projects" : "Your projects"}
            </h2>
          </div>
          {projects.length === 0 ? (
            <p className="mt-6 rounded-sm border border-line p-8 text-sm text-muted">
              No projects yet. Once your project is onboarded it will appear
              here with drawings, progress and messages.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/portal/projects/${p.id}`}
                    className="group flex items-center gap-5 py-4"
                  >
                    {p.cover_image_url && (
                      <img
                        src={p.cover_image_url}
                        alt=""
                        className="h-14 w-20 rounded-sm object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg font-light transition-colors group-hover:text-accent">
                        {p.name}
                      </p>
                      <p className="annotation mt-0.5">
                        {p.location} — {STATUS_LABELS[p.status] ?? p.status}
                      </p>
                    </div>
                    <div className="w-32 shrink-0">
                      <div className="h-1 overflow-hidden rounded bg-surface">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <p className="annotation mt-1.5 text-right">
                        {p.progress}%
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-8 lg:col-span-4">
          <div className="rounded-sm border border-line p-6">
            <p className="annotation">Visualizer credits</p>
            <p className="mt-2 font-display text-5xl font-light text-accent">
              {credits}
            </p>
            <Link
              to="/portal/visualizer"
              className="annotation mt-4 inline-block !text-accent underline-offset-4 hover:underline"
            >
              Open the visualizer →
            </Link>
          </div>

          {staff && (
            <div className="rounded-sm border border-line p-6">
              <p className="annotation">Recent enquiries</p>
              {enquiries.length === 0 ? (
                <p className="mt-3 text-sm text-muted">No enquiries yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {enquiries.map((e) => (
                    <li key={e.id} className="border-b border-line pb-3">
                      <p className="text-sm font-medium">
                        {e.name}{" "}
                        <span className="annotation">— {e.status}</span>
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {e.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
