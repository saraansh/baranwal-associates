import { PgBoss } from "pg-boss";

import { trackEvent } from "./telemetry.server";

/**
 * pg-boss background jobs — the queue lives inside the existing Postgres,
 * no extra infrastructure. Started lazily from the Express app; skipped
 * entirely when DATABASE_URL is unset.
 */

let boss: PgBoss | null = null;
let starting: Promise<PgBoss | null> | null = null;

export const JOB_QUEUES = ["supabase-keepalive", "cleanup-old-events"] as const;

export function getBoss(): PgBoss | null {
  return boss;
}

export async function startJobs(): Promise<PgBoss | null> {
  if (boss) return boss;
  if (starting) return starting;
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  starting = (async () => {
    try {
      const b = new PgBoss({ connectionString: url, schema: "pgboss" });
      b.on("error", (e: Error) => console.error("pg-boss error:", e));
      await b.start();

      for (const queue of JOB_QUEUES) {
        await b.createQueue(queue).catch(() => {});
      }

      // Touch the database on a schedule: proves the job system end-to-end
      // and keeps the free-tier Supabase project from pausing for
      // inactivity.
      await b.schedule("supabase-keepalive", "*/30 * * * *");
      await b.work("supabase-keepalive", async () => {
        trackEvent("job.keepalive", { at: new Date().toISOString() });
      });

      await b.schedule("cleanup-old-events", "0 3 * * *");
      await b.work("cleanup-old-events", async () => {
        const { createClient } = await import("@supabase/supabase-js");
        const svc = createClient(
          process.env.SUPABASE_URL ?? "",
          process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const cutoff = new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000,
        ).toISOString();
        await svc.from("events").delete().lt("created_at", cutoff);
      });

      boss = b;
      console.log("pg-boss started");
      return b;
    } catch (e) {
      console.error("pg-boss failed to start:", e);
      return null;
    }
  })();
  return starting;
}

export interface QueueStat {
  name: string;
  queued: number;
  active: number;
  failed: number;
  total: number;
}

export async function queueStats(): Promise<QueueStat[]> {
  const b = boss;
  if (!b) return [];
  try {
    const queues = await b.getQueues([...JOB_QUEUES]);
    return queues.map((q: (typeof queues)[number]) => ({
      name: q.name,
      queued: q.queuedCount,
      active: q.activeCount,
      failed: q.failedCount,
      total: q.totalCount,
    }));
  } catch (e) {
    console.error("queueStats failed:", e);
    return [];
  }
}
