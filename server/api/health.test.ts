import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { apiRouter } from "./index";

describe("GET /api/health", () => {
  it("returns ok with uptime", async () => {
    const app = express().use("/api", apiRouter);
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
  });
});
