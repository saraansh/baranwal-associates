import express from "express";

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: "1mb" }));

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
