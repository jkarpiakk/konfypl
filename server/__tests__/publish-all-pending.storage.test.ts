import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

// Run every storage call inside a single dedicated DB connection wrapped in a
// transaction that we roll back at the end, so the test never mutates real data.
vi.mock("../db", async () => {
  const pg = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const schema = await import("@shared/schema");
  const client = new pg.default.Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client, { schema });
  return { db, pool: client, __client: client };
});

import { db } from "../db";
import { storage } from "../storage";
import { events } from "@shared/schema";
import { eq } from "drizzle-orm";

let client: any;

const baseEvent = {
  specializations: ["cardiology"],
  startDate: "2030-01-01",
};

beforeAll(async () => {
  const mod: any = await import("../db");
  client = mod.__client;
  await client.query("BEGIN");
});

afterAll(async () => {
  await client.query("ROLLBACK");
  await client.end();
});

describe("storage.publishAllPendingEvents", () => {
  it("flips only pending events to published and returns how many changed", async () => {
    // Clear the table inside the transaction so we control the full dataset.
    await db.delete(events);

    const [pendingA] = await db
      .insert(events)
      .values({ ...baseEvent, title: "Pending A", status: "pending" })
      .returning();
    const [pendingB] = await db
      .insert(events)
      .values({ ...baseEvent, title: "Pending B", status: "pending" })
      .returning();
    const [publishedExisting] = await db
      .insert(events)
      .values({ ...baseEvent, title: "Already Published", status: "published" })
      .returning();
    const [draft] = await db
      .insert(events)
      .values({ ...baseEvent, title: "Draft", status: "draft" })
      .returning();

    const count = await storage.publishAllPendingEvents();

    expect(count).toBe(2);

    const rows = await db.select().from(events);
    const byId = new Map(rows.map((r) => [r.id, r.status]));

    expect(byId.get(pendingA.id)).toBe("published");
    expect(byId.get(pendingB.id)).toBe("published");
    expect(byId.get(publishedExisting.id)).toBe("published");
    expect(byId.get(draft.id)).toBe("draft");
  });

  it("returns 0 when there are no pending events", async () => {
    await db.delete(events);
    await db
      .insert(events)
      .values({ ...baseEvent, title: "Only Published", status: "published" });

    const count = await storage.publishAllPendingEvents();

    expect(count).toBe(0);
    const [row] = await db
      .select()
      .from(events)
      .where(eq(events.title, "Only Published"));
    expect(row.status).toBe("published");
  });
});
