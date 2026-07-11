import { data, Form, useSearchParams } from "react-router";

import type { Route } from "./+types/events";
import { requireUser } from "~/lib/auth.server";
import { createSupabaseAdminClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin · Events — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { headers } = await requireUser(request, ["system_admin"]);
  const svc = createSupabaseAdminClient();
  const url = new URL(request.url);
  const name = url.searchParams.get("name")?.trim();

  let query = svc
    .from("events")
    .select("id, name, props, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (name) query = query.ilike("name", `%${name}%`);
  const { data: events } = await query;

  const { data: names } = await svc
    .from("events")
    .select("name")
    .order("created_at", { ascending: false })
    .limit(1000);
  const counts: Record<string, number> = {};
  for (const e of names ?? []) counts[e.name] = (counts[e.name] ?? 0) + 1;

  return data({ events: events ?? [], counts }, { headers });
}

export default function Events({ loaderData }: Route.ComponentProps) {
  const { events, counts } = loaderData;
  const [params] = useSearchParams();

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(counts).map(([name, count]) => (
            <a
              key={name}
              href={`?name=${encodeURIComponent(name)}`}
              className="rounded-full border border-line px-3 py-1 text-xs transition-colors hover:border-accent hover:text-accent"
            >
              {name} · {count}
            </a>
          ))}
        </div>
        <Form method="get" className="flex items-end gap-2">
          <input
            name="name"
            defaultValue={params.get("name") ?? ""}
            placeholder="Filter by event name…"
            className="field-input w-56"
          />
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
          >
            Filter
          </button>
        </Form>
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {["Time", "Event", "Properties", "User"].map((h) => (
              <th key={h} className="annotation py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {events.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap py-2.5 pr-4 text-muted">
                {new Date(e.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="py-2.5 pr-4 font-medium">{e.name}</td>
              <td className="max-w-md truncate py-2.5 pr-4 font-mono text-xs text-muted">
                {JSON.stringify(e.props)}
              </td>
              <td className="py-2.5 font-mono text-xs text-muted">
                {e.user_id?.slice(0, 8) ?? "—"}
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-muted">
                No events recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
