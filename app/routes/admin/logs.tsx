import { data, Link, useRevalidator, useSearchParams } from "react-router";

import type { Route } from "./+types/logs";
import { requireUser } from "~/lib/auth.server";
import { recentLogs, type LogEntry } from "~/lib/logbuffer.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin · Logs — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = await requireUser(request, ["system_admin"]);
  const level = new URL(request.url).searchParams.get("level") as
    | LogEntry["level"]
    | null;
  return data(
    { logs: recentLogs({ level: level ?? undefined }) },
    { headers },
  );
}

const LEVEL_STYLES: Record<string, string> = {
  info: "text-muted",
  warn: "text-amber-600",
  error: "text-red-600",
};

export default function Logs({ loaderData }: Route.ComponentProps) {
  const { logs } = loaderData;
  const [params] = useSearchParams();
  const revalidator = useRevalidator();
  const level = params.get("level") ?? "";

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["", "warn", "error"].map((l) => (
            <Link
              key={l || "all"}
              to={l ? `?level=${l}` : "?"}
              className={`rounded-full border px-3.5 py-1 text-xs transition-colors ${
                level === l
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {l || "all"}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => revalidator.revalidate()}
          className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
        >
          {revalidator.state === "loading" ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <p className="annotation mt-4">
        Last {logs.length} requests (in-memory ring buffer — durable logs
        live in the host's stdout stream)
      </p>

      <div className="mt-3 overflow-x-auto rounded-sm border border-line bg-surface p-4 font-mono text-xs leading-6">
        {logs.map((l, i) => (
          <div key={i} className={LEVEL_STYLES[l.level]}>
            {l.time.slice(11, 19)} {l.level.toUpperCase().padEnd(5)}{" "}
            {l.status ?? ""} {l.method?.padEnd(4)} {l.url}{" "}
            {l.durationMs != null ? `${l.durationMs}ms` : ""}
          </div>
        ))}
        {logs.length === 0 && <p className="text-muted">No entries yet.</p>}
      </div>
    </main>
  );
}
