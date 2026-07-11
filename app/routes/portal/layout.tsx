import { data, Form, Link, NavLink, Outlet } from "react-router";

import type { Route } from "./+types/layout";
import { ThemeToggle } from "~/components/theme-toggle";
import { requireUser } from "~/lib/auth.server";
import { isStaff } from "~/lib/roles";
import { themeFromRequest } from "~/lib/theme";

export async function loader({ request }: Route.LoaderArgs) {
  const { profile, headers } = await requireUser(request);
  return data({ profile, theme: themeFromRequest(request) }, { headers });
}

const ROLE_LABELS: Record<string, string> = {
  system_admin: "System Admin",
  employee: "Architect",
  accountant: "Accounts",
  collaborator: "Collaborator",
  client: "Client",
};

export default function PortalLayout({ loaderData }: Route.ComponentProps) {
  const { profile, theme } = loaderData;
  const staff = isStaff(profile);

  const links = [
    { to: "/portal", label: "Dashboard", end: true },
    ...(staff || profile.role === "collaborator"
      ? []
      : [{ to: "/portal/visualizer", label: "Visualizer", end: false }]),
    ...(staff
      ? [{ to: "/portal/invites", label: "Invites", end: false }]
      : []),
    ...(profile.role === "system_admin" || profile.role === "accountant"
      ? [{ to: "/portal/payments", label: "Payments", end: false }]
      : []),
    { to: "/portal/settings", label: "Settings", end: false },
    ...(profile.role === "system_admin"
      ? [{ to: "/admin", label: "Admin Console", end: false }]
      : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 lg:px-10">
          <Link to="/" className="font-display text-base font-medium">
            Baranwal<span className="text-accent">&nbsp;Associates</span>
            <span className="annotation ml-3 hidden sm:inline">portal</span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors ${
                    isActive
                      ? "bg-surface text-accent"
                      : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span className="annotation hidden md:inline">
              {profile.full_name.split(" ")[0]} — {ROLE_LABELS[profile.role]}
            </span>
            <ThemeToggle theme={theme} />
            <Form method="post" action="/auth/logout">
              <button
                type="submit"
                className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Sign out
              </button>
            </Form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:px-10">
        <Outlet />
      </div>
    </div>
  );
}
