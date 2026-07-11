import { RouterContextProvider } from "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";

import { valueFromExpressContext } from "~/context";
import { startJobs } from "~/lib/jobs.server";
import { pushLog } from "~/lib/logbuffer.server";
import { apiRouter } from "./api/index";

export const app = express();

// Background jobs (no-op without DATABASE_URL).
void startJobs();

// Request log ring buffer feeding the admin console; stdout stays the
// durable sink via morgan/pino in server.js.
app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    if (req.originalUrl.startsWith("/assets")) return;
    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    pushLog({
      time: new Date().toISOString(),
      level,
      msg: "http",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - started,
    });
  });
  next();
});

app.use("/api", apiRouter);

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      const context = new RouterContextProvider();
      context.set(valueFromExpressContext, "Hello from Express");
      return context;
    },
  }),
);
