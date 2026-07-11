import express from "express";

import { aiRouter } from "./ai";
import { paymentsRouter } from "./payments";
import { uploadsRouter } from "./uploads";

export const apiRouter = express.Router();

// The Razorpay webhook needs the raw body for signature checks — mount it
// before the JSON parser.
apiRouter.use("/payments", paymentsRouter);

apiRouter.use(express.json({ limit: "1mb" }));

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/uploads", uploadsRouter);
apiRouter.use("/ai", aiRouter);
