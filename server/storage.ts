import { 
  users, events, sources, scanLogs,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type Source, type InsertSource,
  type ScanLog, type InsertScanLog 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEvents(filters?: { status?: string }): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<void>;
  findDuplicateEvent(title: string, startDate: string): Promise<Event | undefined>;

  getSources(): Promise<Source[]>;
  getSource(id: number): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;
  updateSource(id: number, source: Partial<InsertSource>): Promise<Source | undefined>;
  deleteSource(id: number): Promise<void>;
  getSourcesDueForScan(): Promise<Source[]>;

  createScanLog(log: InsertScanLog): Promise<ScanLog>;
  updateScanLog(id: number, log: Partial<InsertScanLog>): Promise<ScanLog | undefined>;
  getRecentScanLogs(limit?: number): Promise<ScanLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getEvents(filters?: { status?: string }): Promise<Event[]> {
    if (filters?.status) {
      return db.select().from(events).where(eq(events.status, filters.status)).orderBy(desc(events.startDate));
    }
    return db.select().from(events).orderBy(desc(events.startDate));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db
      .update(events)
      .set({ ...event, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async findDuplicateEvent(title: string, startDate: string): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.title, title), eq(events.startDate, startDate)));
    return event;
  }

  async getSources(): Promise<Source[]> {
    return db.select().from(sources).orderBy(desc(sources.createdAt));
  }

  async getSource(id: number): Promise<Source | undefined> {
    const [source] = await db.select().from(sources).where(eq(sources.id, id));
    return source;
  }

  async createSource(source: InsertSource): Promise<Source> {
    const [created] = await db.insert(sources).values(source).returning();
    return created;
  }

  async updateSource(id: number, source: Partial<InsertSource>): Promise<Source | undefined> {
    const [updated] = await db.update(sources).set(source).where(eq(sources.id, id)).returning();
    return updated;
  }

  async deleteSource(id: number): Promise<void> {
    await db.delete(sources).where(eq(sources.id, id));
  }

  async getSourcesDueForScan(): Promise<Source[]> {
    return db
      .select()
      .from(sources)
      .where(
        and(
          eq(sources.status, "active"),
          sql`(${sources.lastChecked} IS NULL OR ${sources.lastChecked} < NOW() - INTERVAL '1 hour' * ${sources.checkFrequencyHours})`
        )
      );
  }

  async createScanLog(log: InsertScanLog): Promise<ScanLog> {
    const [created] = await db.insert(scanLogs).values(log).returning();
    return created;
  }

  async updateScanLog(id: number, log: Partial<InsertScanLog>): Promise<ScanLog | undefined> {
    const [updated] = await db.update(scanLogs).set(log).where(eq(scanLogs.id, id)).returning();
    return updated;
  }

  async getRecentScanLogs(limit: number = 20): Promise<ScanLog[]> {
    return db.select().from(scanLogs).orderBy(desc(scanLogs.startedAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
