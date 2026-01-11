import { 
  users, events, sources, scanLogs,
  type User, type UpsertUser,
  type Event, type InsertEvent,
  type Source, type InsertSource,
  type ScanLog, type InsertScanLog 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql, gte, ne, lte, or, isNull } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  getEvents(filters?: { status?: string; limit?: number; upcoming?: boolean; city?: string; voivodeship?: string; specialization?: string }): Promise<Event[]>;
  getEventCount(filters?: { status?: string; upcoming?: boolean }): Promise<number>;
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
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getEvents(filters?: { status?: string; limit?: number; upcoming?: boolean; city?: string; voivodeship?: string; specialization?: string }): Promise<Event[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(events.status, filters.status));
    }
    
    if (filters?.upcoming) {
      const today = new Date().toISOString().split('T')[0];
      conditions.push(gte(events.startDate, today));
    }
    
    if (filters?.city) {
      conditions.push(eq(events.city, filters.city));
    }
    
    if (filters?.voivodeship) {
      conditions.push(eq(events.voivodeship, filters.voivodeship));
    }
    
    if (filters?.specialization) {
      conditions.push(sql`${filters.specialization} = ANY(${events.specializations})`);
    }
    
    let query = db.select().from(events);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    const now = new Date();
    const isPromotedActive = sql`CASE 
      WHEN ${events.promotionTier} != 'none' 
        AND ${events.promotionStart} IS NOT NULL 
        AND ${events.promotionEnd} IS NOT NULL 
        AND ${events.promotionStart} <= ${now} 
        AND ${events.promotionEnd} >= ${now} 
      THEN 0 ELSE 1 END`;
    
    if (filters?.upcoming) {
      query = query.orderBy(isPromotedActive, asc(events.promotionOrder), asc(events.startDate)) as typeof query;
    } else {
      query = query.orderBy(isPromotedActive, asc(events.promotionOrder), desc(events.startDate)) as typeof query;
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit) as typeof query;
    }
    
    return query;
  }

  async getEventCount(filters?: { status?: string; upcoming?: boolean }): Promise<number> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(events.status, filters.status));
    }
    
    if (filters?.upcoming) {
      const today = new Date().toISOString().split('T')[0];
      conditions.push(gte(events.startDate, today));
    }
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    return Number(result[0]?.count || 0);
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
