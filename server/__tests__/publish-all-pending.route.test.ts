import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import express, { type Express } from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import request from "supertest";

import { storage } from "../storage";
import { registerRoutes } from "../routes";

const ADMIN_EMAIL = "admin@test.local";
const ADMIN_PASSWORD = "test-password-123";

let app: Express;
let httpServer: Server;
let publishSpy: ReturnType<typeof vi.spyOn>;

beforeAll(async () => {
  process.env.ADMIN_EMAIL = ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;

  app = express();
  app.use(express.json());
  app.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: false,
    }),
  );

  httpServer = createServer(app);
  await registerRoutes(httpServer, app);
});

afterAll(() => {
  httpServer?.close();
});

beforeEach(() => {
  vi.restoreAllMocks();
  publishSpy = vi
    .spyOn(storage, "publishAllPendingEvents")
    .mockResolvedValue(3);
});

async function loginAsAdmin() {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/admin/login")
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  expect(res.status).toBe(200);
  return agent;
}

describe("POST /api/events/publish-all-pending", () => {
  it("rejects unauthenticated callers with 401 and does not touch storage", async () => {
    const res = await request(app).post("/api/events/publish-all-pending");
    expect(res.status).toBe(401);
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it("publishes pending events for an admin and returns the count", async () => {
    const agent = await loginAsAdmin();
    const res = await agent.post("/api/events/publish-all-pending");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 3 });
    expect(publishSpy).toHaveBeenCalledTimes(1);
  });

  it("returns 0 when there are no pending events", async () => {
    publishSpy.mockResolvedValue(0);
    const agent = await loginAsAdmin();
    const res = await agent.post("/api/events/publish-all-pending");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 0 });
  });

  it("returns 500 when storage throws", async () => {
    publishSpy.mockRejectedValue(new Error("db down"));
    const agent = await loginAsAdmin();
    const res = await agent.post("/api/events/publish-all-pending");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
