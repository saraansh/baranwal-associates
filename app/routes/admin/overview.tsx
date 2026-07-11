import { data } from "react-router";

import type { Route } from "./+types/overview";
import { requireUser } from "~/lib/auth.server";
import { createSupabaseAdminClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin · Overview — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = await requireUser(request, ["system_admin"]);
  const svc = createSupabaseAdminClient();

  const started = Date.now();
  const { error: dbError } = await svc
    .from("system_settings")
    .select("key", { head: true, count: "exact" });
  const dbLatencyMs = Date.now() - started;

  const count = (table: string, filter?: (q: unknown) => unknown) => {
    let q = svc.from(table).select("*", { head: true, count: "exact" });
    if (filter) q = filter(q) as typeof q;
    return q.then((r) => r.count ?? 0);
  };

  const [
    profiles,
    projects,
    enquiriesNew,
    drawings,
    versions,
    messages,
    generations,
    paymentsPaid,
    { data: storageRows },
    { data: roles },
  ] = await Promise.all([
    count("profiles"),
    count("projects"),
    svc
      .from("contact_enquiries")
      .select("*", { head: true, count: "exact" })
      .eq("status", "new")
      .then((r) => r.count ?? 0),
    count("drawings"),
    count("drawing_versions"),
    count("messages"),
    count("ai_generations"),
    svc
      .from("payments")
      .select("amount_inr")
      .eq("status", "paid")
      .then((r) => r.data ?? []),
    svc.from("drawing_versions").select("original_size_bytes"),
    svc.from("profiles").select("role"),
  ]);

  const storageBytes = (storageRows ?? []).reduce(
    (sum, r) => sum + (r.original_size_bytes ?? 0),
    0,
  );
  const revenue = (paymentsPaid as { amount_inr: number }[]).reduce(
    (sum, p) => sum + Number(p.amount_inr),
    0,
  );
  const roleCounts: Record<string, number> = {};
  for (const r of roles ?? []) {
    roleCounts[r.role] = (roleCounts[r.role] ?? 0) + 1;
  }

  return data(
    {
      health: {
        db: dbError ? "down" : "ok",
        dbLatencyMs,
        uptimeSec: Math.round(process.uptime()),
        node: process.version,
      },
      stats: {
        profiles,
        projects,
        enquiriesNew,
        drawings,
        versions,
        messages,
        generations,
        revenue,
        storageBytes,
      },
      roleCounts,
    },
    { headers },
  );
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatBytes(n: number) {
  if (n > 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n > 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${Math.round(n / 1024)} KB`;
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const { health, stats, roleCounts } = loaderData;

  const cards = [
    { label: "Users", value: stats.profiles },
    { label: "Projects", value: stats.projects },
    { label: "New enquiries", value: stats.enquiriesNew },
    { label: "Drawings / versions", value: `${stats.drawings} / ${stats.versions}` },
    { label: "Messages", value: stats.messages },
    { label: "AI generations", value: stats.generations },
    { label: "Revenue recorded", value: inr.format(stats.revenue) },
    { label: "Drawing storage", value: formatBytes(stats.storageBytes) },
  ];

  return (
    <main>
      <section className="grid gap-4 sm:grid-cols-3">
        <HealthCard
          label="Database"
          ok={health.db === "ok"}
          detail={`${health.dbLatencyMs} ms`}
        />
        <HealthCard
          label="App server"
          ok
          detail={`up ${Math.floor(health.uptimeSec / 60)} min · ${health.node}`}
        />
        <HealthCard
          label="Roles"
          ok
          detail={Object.entries(roleCounts)
            .map(([r, c]) => `${c} ${r.replace("_", " ")}`)
            .join(" · ")}
        />
      </section>

      <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-line p-5">
            <p className="font-display text-3xl font-light text-accent">
              {c.value}
            </p>
            <p className="annotation mt-1">{c.label}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

function HealthCard({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="rounded-sm border border-line p-5">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-green-600" : "bg-red-600"}`}
      />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="annotation mt-2">{detail}</p>
    </div>
  );
}
