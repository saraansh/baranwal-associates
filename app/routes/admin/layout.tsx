import { data, Link, NavLink, Outlet } from "react-router";

import type { Route } from "./+types/layout";
import { requireUser } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = await requireUser(request, ["system_admin"]);
  return data({ ok: true }, { headers });
}

const TABS = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/events", label: "Events", end: false },
  { to: "/admin/logs", label: "Logs", end: false },
  { to: "/admin/jobs", label: "Jobs", end: false },
  { to: "/admin/settings", label: "Settings", end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-4 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/portal" className="annotation hover:text-accent">
                ← Portal
              </Link>
              <h1 className="mt-1 font-display text-2xl font-light">
                System <span className="italic text-accent">console</span>
              </h1>
            </div>
            <span className="annotation">system_admin only</span>
          </div>
          <nav className="mt-4 flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-t-sm px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-paper text-accent"
                      : "text-muted hover:text-ink"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <Outlet />
      </div>
    </div>
  );
}
