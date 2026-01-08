import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/chat";
export * from "./models/auth";

export const SPECIALIZATIONS = [
  "cardiology",
  "family_medicine",
  "internal_medicine",
  "anesthesiology",
  "surgery",
  "orthopedics",
  "gynecology",
  "pediatrics",
  "neurology",
  "psychiatry",
  "radiology",
  "emergency_medicine",
  "laboratory_diagnostics",
  "interdisciplinary"
] as const;

export const SPECIALIZATION_LABELS: Record<typeof SPECIALIZATIONS[number], string> = {
  cardiology: "Kardiologia",
  family_medicine: "Medycyna Rodzinna",
  internal_medicine: "Interna",
  anesthesiology: "Anestezjologia i Intensywna Terapia",
  surgery: "Chirurgia",
  orthopedics: "Ortopedia",
  gynecology: "Ginekologia i Położnictwo",
  pediatrics: "Pediatria",
  neurology: "Neurologia",
  psychiatry: "Psychiatria",
  radiology: "Radiologia",
  emergency_medicine: "Medycyna Ratunkowa",
  laboratory_diagnostics: "Diagnostyka Laboratoryjna",
  interdisciplinary: "Interdyscyplinarne / Inne"
};

export const EVENT_TAGS = [
  "webinar",
  "points",
  "free",
  "paid",
  "residents",
  "workshop",
  "congress",
  "conference"
] as const;

export const TAG_LABELS: Record<typeof EVENT_TAGS[number], string> = {
  webinar: "Webinar",
  points: "Punkty edukacyjne",
  free: "Bezpłatne",
  paid: "Płatne",
  residents: "Dla rezydentów",
  workshop: "Warsztaty",
  congress: "Kongres",
  conference: "Konferencja"
};

// Note: users table is defined in ./models/auth.ts

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  specializations: text("specializations").array().notNull(),
  tags: text("tags").array().default(sql`'{}'::text[]`).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  location: text("location"),
  isOnline: boolean("is_online").default(false).notNull(),
  organizer: text("organizer"),
  educationalPoints: integer("educational_points"),
  hasEducationalPoints: boolean("has_educational_points").default(false).notNull(),
  price: text("price").default("unknown").notNull(),
  sourceUrl: text("source_url"),
  sourceId: integer("source_id"),
  lastCheckedDate: timestamp("last_checked_date"),
  status: text("status").default("pending").notNull(),
  isAiAdded: boolean("is_ai_added").default(false).notNull(),
  aiConfidence: integer("ai_confidence"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  type: text("type").notNull(),
  checkFrequencyHours: integer("check_frequency_hours").default(48).notNull(),
  lastChecked: timestamp("last_checked"),
  status: text("status").default("active").notNull(),
  eventsFound: integer("events_found").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const scanLogs = pgTable("scan_logs", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").notNull(),
  startedAt: timestamp("started_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").default("running").notNull(),
  eventsFound: integer("events_found").default(0).notNull(),
  eventsAdded: integer("events_added").default(0).notNull(),
  errorMessage: text("error_message"),
});

export const eventsRelations = relations(events, ({ one }) => ({
  source: one(sources, {
    fields: [events.sourceId],
    references: [sources.id],
  }),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  events: many(events),
  scanLogs: many(scanLogs),
}));

export const scanLogsRelations = relations(scanLogs, ({ one }) => ({
  source: one(sources, {
    fields: [scanLogs.sourceId],
    references: [sources.id],
  }),
}));

// Note: insertUserSchema and User types are in ./models/auth.ts

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSourceSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
  lastChecked: true,
  eventsFound: true,
});

export const insertScanLogSchema = createInsertSchema(scanLogs).omit({
  id: true,
  startedAt: true,
});

export type Specialization = typeof SPECIALIZATIONS[number];
export type EventTag = typeof EVENT_TAGS[number];
// Note: User and InsertUser types are exported from ./models/auth.ts
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;
export type InsertScanLog = z.infer<typeof insertScanLogSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;
