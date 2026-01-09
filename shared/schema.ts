import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/chat";
export * from "./models/auth";
import { users } from "./models/auth";

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
  "conference",
  "symposium",
  "online",
  "hybrid",
  "advanced",
  "basic_level",
  "practical",
  "certification",
  "hands_on",
  "case_studies",
  "live_surgery",
  "networking"
] as const;

export const TAG_LABELS: Record<typeof EVENT_TAGS[number], string> = {
  webinar: "Webinar",
  points: "Punkty edukacyjne",
  free: "Bezpłatne",
  paid: "Płatne",
  residents: "Dla rezydentów",
  workshop: "Warsztaty",
  congress: "Kongres",
  conference: "Konferencja",
  symposium: "Sympozjum",
  online: "Online",
  hybrid: "Hybrydowe",
  advanced: "Zaawansowane",
  basic_level: "Podstawowe",
  practical: "Praktyczne",
  certification: "Z certyfikatem",
  hands_on: "Hands-on",
  case_studies: "Case studies",
  live_surgery: "Live surgery",
  networking: "Networking"
};

// Note: users table is defined in ./models/auth.ts

export const PROMOTION_TIERS = ["none", "basic", "pro", "max"] as const;

export const PROMOTION_TIER_LABELS: Record<typeof PROMOTION_TIERS[number], string> = {
  none: "Brak",
  basic: "Basic",
  pro: "Pro",
  max: "Max"
};

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
  promotionTier: text("promotion_tier").default("none").notNull(),
  promotionStart: date("promotion_start"),
  promotionEnd: date("promotion_end"),
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

// Monetization tables

export const PLACEMENT_TYPES = [
  "pinned",
  "featured_strip",
  "inline",
  "calendar_featured",
  "detail_related"
] as const;

export const PLACEMENT_TYPE_LABELS: Record<typeof PLACEMENT_TYPES[number], string> = {
  pinned: "Przypięte na górze",
  featured_strip: "Wyróżniony pasek",
  inline: "W treści listy",
  calendar_featured: "Wyróżnione w kalendarzu",
  detail_related: "Powiązane na stronie wydarzenia"
};

export const organizers = pgTable("organizers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  description: text("description"),
  logoUrl: text("logo_url"),
  isVerified: boolean("is_verified").default(false).notNull(),
  tier: text("tier").default("free").notNull(),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const sponsoredPlacements = pgTable("sponsored_placements", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  organizerId: integer("organizer_id"),
  placementType: text("placement_type").notNull(),
  position: integer("position").default(0).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  priceAmount: integer("price_amount"),
  priceCurrency: text("price_currency").default("PLN"),
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const eventMetrics = pgTable("event_metrics", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  date: date("date").notNull(),
  pageViews: integer("page_views").default(0).notNull(),
  registrationClicks: integer("registration_clicks").default(0).notNull(),
  calendarAdds: integer("calendar_adds").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  reportedErrors: integer("reported_errors").default(0).notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  eventId: integer("event_id"),
  organizerId: integer("organizer_id"),
  type: text("type").default("general").notNull(),
  name: text("name"),
  message: text("message"),
  eventTitle: text("event_title"),
  eventDate: text("event_date"),
  eventWebsite: text("event_website"),
  organizerName: text("organizer_name"),
  specializations: text("specializations").array().default(sql`'{}'::text[]`),
  city: text("city"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const organizersRelations = relations(organizers, ({ many, one }) => ({
  sponsoredPlacements: many(sponsoredPlacements),
  leads: many(leads),
  user: one(users, {
    fields: [organizers.userId],
    references: [users.id],
  }),
}));

export const sponsoredPlacementsRelations = relations(sponsoredPlacements, ({ one }) => ({
  event: one(events, {
    fields: [sponsoredPlacements.eventId],
    references: [events.id],
  }),
  organizer: one(organizers, {
    fields: [sponsoredPlacements.organizerId],
    references: [organizers.id],
  }),
}));

export const eventMetricsRelations = relations(eventMetrics, ({ one }) => ({
  event: one(events, {
    fields: [eventMetrics.eventId],
    references: [events.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  event: one(events, {
    fields: [leads.eventId],
    references: [events.id],
  }),
  organizer: one(organizers, {
    fields: [leads.organizerId],
    references: [organizers.id],
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

export const insertOrganizerSchema = createInsertSchema(organizers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSponsoredPlacementSchema = createInsertSchema(sponsoredPlacements).omit({
  id: true,
  createdAt: true,
});

export const insertEventMetricSchema = createInsertSchema(eventMetrics).omit({
  id: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type Specialization = typeof SPECIALIZATIONS[number];
export type EventTag = typeof EVENT_TAGS[number];
export type PlacementType = typeof PLACEMENT_TYPES[number];
export type PromotionTier = typeof PROMOTION_TIERS[number];
// Note: User and InsertUser types are exported from ./models/auth.ts
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;
export type InsertScanLog = z.infer<typeof insertScanLogSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;
export type InsertOrganizer = z.infer<typeof insertOrganizerSchema>;
export type Organizer = typeof organizers.$inferSelect;
export type InsertSponsoredPlacement = z.infer<typeof insertSponsoredPlacementSchema>;
export type SponsoredPlacement = typeof sponsoredPlacements.$inferSelect;
export type InsertEventMetric = z.infer<typeof insertEventMetricSchema>;
export type EventMetric = typeof eventMetrics.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
