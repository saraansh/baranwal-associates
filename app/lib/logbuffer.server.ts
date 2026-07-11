/**
 * In-memory ring buffer of recent structured log lines, shared between the
 * Express pipeline and the admin console loaders (same module instance in
 * both dev SSR and the production bundle). Stdout remains the durable sink
 * (captured by Render); this powers the live in-app view.
 */

export interface LogEntry {
  time: string;
  level: "info" | "warn" | "error";
  msg: string;
  method?: string;
  url?: string;
  status?: number;
  durationMs?: number;
}

const MAX = 500;
const buffer: LogEntry[] = [];

export function pushLog(entry: LogEntry) {
  buffer.push(entry);
  if (buffer.length > MAX) buffer.splice(0, buffer.length - MAX);
}

export function recentLogs(opts?: {
  level?: LogEntry["level"];
  limit?: number;
}): LogEntry[] {
  let logs = buffer;
  if (opts?.level) {
    const order = { info: 0, warn: 1, error: 2 };
    logs = logs.filter((l) => order[l.level] >= order[opts.level!]);
  }
  return logs.slice(-(opts?.limit ?? 200)).reverse();
}
