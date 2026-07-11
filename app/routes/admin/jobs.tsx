import { data, useRevalidator } from "react-router";

import type { Route } from "./+types/jobs";
import { requireUser } from "~/lib/auth.server";
import { getBoss, queueStats } from "~/lib/jobs.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin · Jobs — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = await requireUser(request, ["system_admin"]);
  return data(
    { running: Boolean(getBoss()), queues: await queueStats() },
    { headers },
  );
}

export default function Jobs({ loaderData }: Route.ComponentProps) {
  const { running, queues } = loaderData;
  const revalidator = useRevalidator();

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${running ? "bg-green-600" : "bg-red-600"}`}
          />
          <p className="text-sm">
            pg-boss {running ? "running" : "not running"}
            {!running && (
              <span className="text-muted">
                {" "}
                — set DATABASE_URL to enable background jobs
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => revalidator.revalidate()}
          className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
        >
          Refresh
        </button>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {["Queue", "Queued", "Active", "Failed", "Total"].map((h) => (
              <th key={h} className="annotation py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {queues.map((q) => (
            <tr key={q.name}>
              <td className="py-3 font-medium">{q.name}</td>
              <td className="py-3">{q.queued}</td>
              <td className="py-3">{q.active}</td>
              <td className={`py-3 ${q.failed > 0 ? "text-red-600" : ""}`}>
                {q.failed}
              </td>
              <td className="py-3 text-muted">{q.total}</td>
            </tr>
          ))}
          {queues.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-muted">
                No queues registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="annotation mt-6">
        Scheduled: supabase-keepalive every 30 min · cleanup-old-events daily
        at 03:00
      </p>
    </main>
  );
}
