import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertSourceSchema, insertLeadSchema, SPECIALIZATIONS, VOIVODESHIPS, VOIVODESHIP_LABELS, MAJOR_CITIES, CITY_LABELS, SPECIALIZATION_LABELS } from "@shared/schema";
import { scanSingleSource, runScheduledScans } from "./scheduler";
import { z } from "zod";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { addSubscriber } from "./mailerlite";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});
import bcrypt from "bcrypt";
import { isAuthenticated, authStorage } from "./replit_integrations/auth";
import { users } from "@shared/models/auth";
import { leads, eventMetrics, sponsoredPlacements, events } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, sql, desc, count, sum } from "drizzle-orm";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

const updatePreferencesSchema = z.object({
  specializations: z.array(z.enum(SPECIALIZATIONS)).default([]),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

import type { RequestHandler } from "express";

const isAdmin: RequestHandler = async (req: any, res, next) => {
  if (req.session?.adminAuthenticated) {
    return next();
  }
  
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const userId = req.user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = await authStorage.getUser(userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/admin/login", async (req: any, res) => {
    try {
      const parseResult = adminLoginSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid credentials format" });
      }
      
      const { email, password } = parseResult.data;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        console.error("Admin credentials not configured");
        return res.status(500).json({ error: "Admin login not configured" });
      }
      
      if (email.toLowerCase() !== adminEmail.toLowerCase()) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      req.session.adminAuthenticated = true;
      req.session.adminEmail = email;
      
      res.json({ success: true, email });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  app.post("/api/admin/logout", async (req: any, res) => {
    req.session.adminAuthenticated = false;
    req.session.adminEmail = null;
    res.json({ success: true });
  });
  
  app.get("/api/admin/session", async (req: any, res) => {
    if (req.session?.adminAuthenticated) {
      return res.json({ 
        authenticated: true, 
        email: req.session.adminEmail,
        isAdmin: true 
      });
    }
    
    if (req.isAuthenticated && req.isAuthenticated()) {
      const userId = req.user?.claims?.sub;
      if (userId) {
        const user = await authStorage.getUser(userId);
        if (user?.isAdmin) {
          return res.json({ 
            authenticated: true, 
            email: user.email || user.firstName,
            isAdmin: true 
          });
        }
      }
    }
    
    res.json({ authenticated: false, isAdmin: false });
  });

  app.get("/api/metadata", async (req, res) => {
    res.json({
      specializations: SPECIALIZATIONS.map(s => ({ id: s, label: SPECIALIZATION_LABELS[s] })),
      voivodeships: VOIVODESHIPS.map(v => ({ id: v, label: VOIVODESHIP_LABELS[v] })),
      cities: MAJOR_CITIES.map(c => ({ id: c, label: CITY_LABELS[c] })),
    });
  });

  app.get("/api/events", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const upcoming = req.query.upcoming === "true";
      const city = req.query.city as string | undefined;
      const voivodeship = req.query.voivodeship as string | undefined;
      const specialization = req.query.specialization as string | undefined;
      
      const filters: { status?: string; limit?: number; upcoming?: boolean; city?: string; voivodeship?: string; specialization?: string } = {};
      if (status) filters.status = status;
      if (limit && !isNaN(limit)) filters.limit = limit;
      if (upcoming) filters.upcoming = true;
      if (city) filters.city = city;
      if (voivodeship) filters.voivodeship = voivodeship;
      if (specialization) filters.specialization = specialization;
      
      const events = await storage.getEvents(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/count", async (_req, res) => {
    try {
      const total = await storage.getEventCount({ status: "published", upcoming: true });
      res.json({ count: total });
    } catch (error) {
      console.error("Error fetching event count:", error);
      res.status(500).json({ error: "Failed to fetch event count" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAdmin, async (req, res) => {
    try {
      const parseResult = insertEventSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid event data", details: parseResult.error.errors });
      }
      const event = await storage.createEvent(parseResult.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.patch("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      const event = await storage.updateEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      await storage.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  const setPromotionSchema = z.object({
    tier: z.enum(["none", "basic", "pro", "max"]),
    hours: z.number().min(1).max(8760).optional(),
  });

  app.post("/api/events/:id/promotion", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const parsed = setPromotionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid promotion data", details: parsed.error.errors });
      }
      
      const { tier, hours } = parsed.data;
      
      let updateData: any = { promotionTier: tier };
      
      if (tier === "none") {
        updateData.promotionStart = null;
        updateData.promotionEnd = null;
        updateData.promotionHours = null;
        updateData.promotionOrder = 0;
      } else if (hours) {
        const now = new Date();
        const end = new Date(now.getTime() + hours * 60 * 60 * 1000);
        updateData.promotionStart = now;
        updateData.promotionEnd = end;
        updateData.promotionHours = hours;
      }
      
      const event = await storage.updateEvent(id, updateData);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error setting promotion:", error);
      res.status(500).json({ error: "Failed to set promotion" });
    }
  });

  const reorderPromotionsSchema = z.object({
    orderedIds: z.array(z.number()),
  });

  app.post("/api/events/promotions/reorder", isAdmin, async (req, res) => {
    try {
      const parsed = reorderPromotionsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid reorder data", details: parsed.error.errors });
      }
      
      const { orderedIds } = parsed.data;
      
      for (let i = 0; i < orderedIds.length; i++) {
        await storage.updateEvent(orderedIds[i], { promotionOrder: i });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering promotions:", error);
      res.status(500).json({ error: "Failed to reorder promotions" });
    }
  });

  app.get("/api/events/promoted", async (req, res) => {
    try {
      const allEvents = await storage.getEvents({ status: "published" });
      const now = new Date();
      const promotedEvents = allEvents.filter(e => 
        e.promotionTier !== "none" && 
        e.promotionStart && 
        e.promotionEnd && 
        new Date(e.promotionStart) <= now && 
        new Date(e.promotionEnd) >= now
      );
      res.json(promotedEvents);
    } catch (error) {
      console.error("Error fetching promoted events:", error);
      res.status(500).json({ error: "Failed to fetch promoted events" });
    }
  });

  app.post("/api/events/:id/social-copy", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const eventDate = event.startDate ? new Date(event.startDate).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : '';

      const specs = event.specializations?.map((s: string) => 
        SPECIALIZATION_LABELS[s as keyof typeof SPECIALIZATION_LABELS] || s
      ).join(', ') || '';

      const location = event.isOnline ? 'Online' : (event.location || event.city || '');
      
      const prompt = `Jesteś ekspertem od social media w branży medycznej. Wygeneruj angażujący tekst posta i hashtagi dla polskiego wydarzenia medycznego.

DANE WYDARZENIA:
Tytuł: ${event.title}
Data: ${eventDate}
Lokalizacja: ${location}
Specjalizacje: ${specs}
Organizator: ${event.organizer || 'Nie podano'}
Punkty edukacyjne: ${event.hasEducationalPoints ? (event.educationalPoints || 'Tak') : 'Brak'}
Cena: ${event.price === 'free' ? 'Bezpłatne' : event.price === 'paid' ? 'Płatne' : 'Do ustalenia'}
Opis: ${event.description || 'Brak opisu'}

WYMAGANIA:
1. Tekst posta (max 280 znaków) - angażujący, profesjonalny, informacyjny, zakończony CTA "Zapisz się już dziś!" NIE używaj emoji.
2. Krótki opis (max 100 znaków) - do stories/szybkich postów, NIE używaj emoji
3. Hashtagi (10-15) - polskie i angielskie, specjalistyczne dla danej dziedziny medycyny

ODPOWIEDŹ W JSON:
{
  "postText": "tekst główny posta",
  "shortText": "krótki tekst do stories",
  "hashtags": ["#hashtag1", "#hashtag2", ...]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to generate content" });
      }

      const parsed = JSON.parse(content);
      res.json({
        postText: parsed.postText || '',
        shortText: parsed.shortText || '',
        hashtags: parsed.hashtags || [],
        event: {
          id: event.id,
          title: event.title,
          date: eventDate,
          location,
          specs,
          organizer: event.organizer,
          promotionTier: event.promotionTier
        }
      });
    } catch (error) {
      console.error("Error generating social copy:", error);
      res.status(500).json({ error: "Failed to generate social copy" });
    }
  });

  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const usersList = await storage.getAllUsers();
      res.json(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const updateUserSchema = z.object({
    isAdmin: z.boolean(),
  });

  app.patch("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", details: parsed.error.errors });
      }
      
      await db.update(users).set({ isAdmin: parsed.data.isAdmin }).where(eq(users.id, id));
      
      const updatedUser = await storage.getUser(id);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/sources", isAdmin, async (req, res) => {
    try {
      const sources = await storage.getSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching sources:", error);
      res.status(500).json({ error: "Failed to fetch sources" });
    }
  });

  app.get("/api/sources/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid source ID" });
      }
      const source = await storage.getSource(id);
      if (!source) {
        return res.status(404).json({ error: "Source not found" });
      }
      res.json(source);
    } catch (error) {
      console.error("Error fetching source:", error);
      res.status(500).json({ error: "Failed to fetch source" });
    }
  });

  app.post("/api/sources", isAdmin, async (req, res) => {
    try {
      const parseResult = insertSourceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid source data", details: parseResult.error.errors });
      }
      const source = await storage.createSource(parseResult.data);
      res.status(201).json(source);
    } catch (error) {
      console.error("Error creating source:", error);
      res.status(500).json({ error: "Failed to create source" });
    }
  });

  app.patch("/api/sources/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid source ID" });
      }
      const source = await storage.updateSource(id, req.body);
      if (!source) {
        return res.status(404).json({ error: "Source not found" });
      }
      res.json(source);
    } catch (error) {
      console.error("Error updating source:", error);
      res.status(500).json({ error: "Failed to update source" });
    }
  });

  app.delete("/api/sources/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid source ID" });
      }
      await storage.deleteSource(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting source:", error);
      res.status(500).json({ error: "Failed to delete source" });
    }
  });

  // Scan ALL sources at once
  app.post("/api/sources/scan-all", isAdmin, async (req, res) => {
    try {
      const allSources = await storage.getSources();
      const activeSources = allSources.filter(s => s.status === "active");
      
      res.json({ 
        message: "Scanning all sources started", 
        totalSources: activeSources.length 
      });
      
      // Run scans in background
      (async () => {
        console.log(`Starting scan of ${activeSources.length} sources...`);
        let totalFound = 0;
        let totalAdded = 0;
        
        for (const source of activeSources) {
          try {
            const result = await scanSingleSource(source.id);
            totalFound += result.found;
            totalAdded += result.added;
            // Small delay between sources to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            console.error(`Error scanning source ${source.name}:`, error);
          }
        }
        
        console.log(`Scan complete. Total found: ${totalFound}, Total added: ${totalAdded}`);
      })();
    } catch (error) {
      console.error("Error starting scan all:", error);
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  app.post("/api/sources/:id/scan", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid source ID" });
      }
      
      res.json({ message: "Scan started", sourceId: id });
      
      scanSingleSource(id).catch((error) => {
        console.error("Background scan error:", error);
      });
    } catch (error) {
      console.error("Error starting scan:", error);
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  // Bulk import sources from CSV
  app.post("/api/sources/import", isAdmin, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const csvContent = req.file.buffer.toString("utf-8");
      
      let records: any[];
      try {
        records = parse(csvContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
        });
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid CSV format" });
      }

      if (records.length === 0) {
        return res.status(400).json({ error: "CSV file is empty" });
      }

      // Get existing sources for deduplication
      const existingSources = await storage.getSources();
      const existingUrls = new Set(existingSources.map(s => s.url.toLowerCase()));

      const results = {
        inserted: 0,
        duplicates: 0,
        errors: [] as { row: number; error: string }[],
      };

      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rowNum = i + 2; // +2 for header row and 0-indexing

        // Validate required fields
        const name = row.name || row.nazwa;
        const url = row.url || row.URL;
        const type = (row.type || row.typ || "website").toLowerCase();
        const frequency = parseInt(row.checkFrequencyHours || row.frequency || row.częstotliwość || "48");

        if (!name || !name.trim()) {
          results.errors.push({ row: rowNum, error: "Brak nazwy" });
          continue;
        }

        if (!url || !url.trim()) {
          results.errors.push({ row: rowNum, error: "Brak URL" });
          continue;
        }

        // Validate URL format
        try {
          const parsedUrl = new URL(url);
          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            results.errors.push({ row: rowNum, error: "URL musi używać http/https" });
            continue;
          }
        } catch {
          results.errors.push({ row: rowNum, error: "Nieprawidłowy format URL" });
          continue;
        }

        // Validate type
        if (!["website", "rss"].includes(type)) {
          results.errors.push({ row: rowNum, error: "Typ musi być 'website' lub 'rss'" });
          continue;
        }

        // Validate frequency
        if (isNaN(frequency) || frequency < 1 || frequency > 168) {
          results.errors.push({ row: rowNum, error: "Częstotliwość musi być między 1 a 168 godzin" });
          continue;
        }

        // Check for duplicates
        if (existingUrls.has(url.toLowerCase())) {
          results.duplicates++;
          continue;
        }

        // Create source
        try {
          await storage.createSource({
            name: name.trim(),
            url: url.trim(),
            type,
            checkFrequencyHours: frequency,
            status: "active",
          });
          existingUrls.add(url.toLowerCase());
          results.inserted++;
        } catch (createError: any) {
          if (createError.message?.includes("duplicate") || createError.code === "23505") {
            results.duplicates++;
          } else {
            results.errors.push({ row: rowNum, error: "Błąd zapisu do bazy" });
          }
        }
      }

      res.json({
        message: `Import zakończony: ${results.inserted} dodanych, ${results.duplicates} duplikatów`,
        inserted: results.inserted,
        duplicates: results.duplicates,
        errors: results.errors,
        totalProcessed: records.length,
      });
    } catch (error) {
      console.error("Error importing sources:", error);
      res.status(500).json({ error: "Failed to import sources" });
    }
  });

  app.post("/api/admin/run-scans", isAdmin, async (req, res) => {
    try {
      res.json({ message: "Scheduled scans started" });
      
      runScheduledScans().catch((error) => {
        console.error("Background scans error:", error);
      });
    } catch (error) {
      console.error("Error running scans:", error);
      res.status(500).json({ error: "Failed to run scans" });
    }
  });

  app.get("/api/scan-logs", isAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const logs = await storage.getRecentScanLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching scan logs:", error);
      res.status(500).json({ error: "Failed to fetch scan logs" });
    }
  });

  // User preferences endpoints
  app.get("/api/user/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        specializations: user.specializations || [],
      });
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.patch("/api/user/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parseResult = updatePreferencesSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid preferences data", 
          details: parseResult.error.errors 
        });
      }
      
      const { specializations } = parseResult.data;
      
      const [updatedUser] = await db
        .update(users)
        .set({ 
          specializations: specializations,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId))
        .returning();
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        specializations: updatedUser.specializations || [],
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  app.get("/api/sponsored-placements", async (req, res) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const placements = await db
        .select({ eventId: sponsoredPlacements.eventId })
        .from(sponsoredPlacements)
        .where(
          and(
            eq(sponsoredPlacements.status, "active"),
            lte(sponsoredPlacements.startDate, today),
            gte(sponsoredPlacements.endDate, today)
          )
        );
      res.json(placements.map(p => p.eventId).filter(Boolean));
    } catch (error) {
      console.error("Error fetching sponsored placements:", error);
      res.json([]);
    }
  });

  app.post("/api/track", async (req, res) => {
    try {
      const { eventId, action } = req.body;
      if (!eventId || !action) {
        return res.status(400).json({ error: "Missing eventId or action" });
      }
      
      const today = new Date().toISOString().split("T")[0];
      const existingMetric = await db
        .select()
        .from(eventMetrics)
        .where(and(eq(eventMetrics.eventId, eventId), eq(eventMetrics.date, today)))
        .limit(1);

      if (existingMetric.length > 0) {
        const updateField = 
          action === "view" ? { pageViews: sql`${eventMetrics.pageViews} + 1` } :
          action === "registration_click" ? { registrationClicks: sql`${eventMetrics.registrationClicks} + 1` } :
          action === "calendar_add" ? { calendarAdds: sql`${eventMetrics.calendarAdds} + 1` } :
          action === "share" ? { shares: sql`${eventMetrics.shares} + 1` } :
          null;
        
        if (updateField) {
          await db.update(eventMetrics).set(updateField).where(eq(eventMetrics.id, existingMetric[0].id));
        }
      } else {
        const initial = {
          eventId,
          date: today,
          pageViews: action === "view" ? 1 : 0,
          registrationClicks: action === "registration_click" ? 1 : 0,
          calendarAdds: action === "calendar_add" ? 1 : 0,
          shares: action === "share" ? 1 : 0,
          reportedErrors: 0,
        };
        await db.insert(eventMetrics).values(initial);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, name, specializations, eventId, eventTitle } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      
      const fields: Record<string, string> = {};
      if (name) fields.name = name;
      if (specializations && specializations.length > 0) {
        fields.specializations = specializations.join(", ");
      }
      if (eventId) fields.event_id = String(eventId);
      if (eventTitle) fields.event_title = eventTitle;
      fields.source = "newsletter";
      
      const success = await addSubscriber({ email, fields });
      
      // Also save to leads table for backup
      await db.insert(leads).values({
        email,
        type: eventId ? "reminder" : "newsletter",
        eventId: eventId || null,
        eventTitle: eventTitle || null,
      }).catch(() => {});
      
      if (success) {
        res.json({ success: true, message: "Zapisano do newslettera" });
      } else {
        // Even if MailerLite fails, we saved to leads
        res.json({ success: true, message: "Zapisano do newslettera" });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const parseResult = insertLeadSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid lead data", details: parseResult.error.errors });
      }
      
      const [lead] = await db.insert(leads).values(parseResult.data).returning();
      
      if (lead.email) {
        const fields: Record<string, string> = {};
        if (lead.eventTitle) fields.event_title = lead.eventTitle;
        if (lead.eventDate) fields.event_date = lead.eventDate;
        if (lead.organizerName) fields.organizer = lead.organizerName;
        if (lead.type) fields.lead_type = lead.type;
        
        addSubscriber({
          email: lead.email,
          fields,
        }).catch(err => console.error("MailerLite sync failed:", err));
      }
      
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  app.get("/api/calendar/:eventId.ics", async (req, res) => {
    try {
      const id = parseInt(req.params.eventId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };

      const escapeText = (text: string) => {
        return text
          .replace(/\\/g, "\\\\")
          .replace(/;/g, "\\;")
          .replace(/,/g, "\\,")
          .replace(/\n/g, "\\n");
      };

      const uid = `event-${event.id}@konfy.pl`;
      const dtstamp = formatDate(new Date().toISOString());
      const dtstart = event.startDate.replace(/-/g, "");
      const dtend = (event.endDate || event.startDate).replace(/-/g, "");

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Konfy.pl//Medical Events//PL",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${escapeText(event.title)}`,
        `DESCRIPTION:${escapeText(event.description || "")}`,
        `LOCATION:${escapeText(event.isOnline ? "Online" : (event.location || ""))}`,
        event.sourceUrl ? `URL:${event.sourceUrl}` : "",
        "END:VEVENT",
        "END:VCALENDAR"
      ].filter(Boolean).join("\r\n");

      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics"`);
      res.send(icsContent);
    } catch (error) {
      console.error("Error generating ICS:", error);
      res.status(500).json({ error: "Failed to generate calendar file" });
    }
  });

  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error) {
      console.error("Error getting Stripe key:", error);
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  app.get("/api/stripe/products", async (req, res) => {
    try {
      const products = await stripeService.listProductsWithPrices();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    try {
      const { priceId, email, eventId, packageName } = req.body;
      if (!priceId || !email) {
        return res.status(400).json({ error: "Missing priceId or email" });
      }

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || req.get('host')}`;
      
      const session = await stripeService.createCheckoutSession({
        customerEmail: email,
        priceId,
        successUrl: `${baseUrl}/promuj?success=true`,
        cancelUrl: `${baseUrl}/promuj?canceled=true`,
        metadata: {
          eventId: eventId?.toString() || '',
          packageName: packageName || '',
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Analytics Dashboard API (Admin only)
  app.get("/api/analytics/overview", isAdmin, async (req, res) => {
    try {
      const allEvents = await storage.getEvents();
      const publishedEvents = allEvents.filter(e => e.status === "published");
      const today = new Date();
      const upcomingEvents = publishedEvents.filter(e => new Date(e.startDate) >= today);
      
      // Get total metrics
      const metricsData = await db.select({
        totalPageViews: sum(eventMetrics.pageViews),
        totalClicks: sum(eventMetrics.registrationClicks),
        totalCalendarAdds: sum(eventMetrics.calendarAdds),
        totalShares: sum(eventMetrics.shares),
      }).from(eventMetrics);
      
      // Get user count
      const userCount = await db.select({ count: count() }).from(users);
      
      res.json({
        totalEvents: publishedEvents.length,
        upcomingEvents: upcomingEvents.length,
        totalUsers: userCount[0]?.count || 0,
        totalPageViews: Number(metricsData[0]?.totalPageViews) || 0,
        totalClicks: Number(metricsData[0]?.totalClicks) || 0,
        totalCalendarAdds: Number(metricsData[0]?.totalCalendarAdds) || 0,
        totalShares: Number(metricsData[0]?.totalShares) || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/specializations", isAdmin, async (req, res) => {
    try {
      const allEvents = await storage.getEvents();
      const publishedEvents = allEvents.filter(e => e.status === "published");
      
      // Count events by specialization
      const specCounts: Record<string, number> = {};
      publishedEvents.forEach(event => {
        event.specializations.forEach(spec => {
          specCounts[spec] = (specCounts[spec] || 0) + 1;
        });
      });
      
      // Sort by count descending
      const sortedSpecs = Object.entries(specCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      res.json(sortedSpecs);
    } catch (error) {
      console.error("Error fetching specialization stats:", error);
      res.status(500).json({ error: "Failed to fetch specialization stats" });
    }
  });

  app.get("/api/analytics/event-types", isAdmin, async (req, res) => {
    try {
      const allEvents = await storage.getEvents();
      const publishedEvents = allEvents.filter(e => e.status === "published");
      
      const online = publishedEvents.filter(e => e.isOnline).length;
      const onsite = publishedEvents.filter(e => !e.isOnline).length;
      const free = publishedEvents.filter(e => e.price === "free").length;
      const paid = publishedEvents.filter(e => e.price === "paid").length;
      const withPoints = publishedEvents.filter(e => e.hasEducationalPoints).length;
      
      res.json({
        byFormat: [
          { name: "Online", value: online },
          { name: "Stacjonarne", value: onsite },
        ],
        byPrice: [
          { name: "Bezplatne", value: free },
          { name: "Platne", value: paid },
        ],
        withEducationalPoints: withPoints,
      });
    } catch (error) {
      console.error("Error fetching event type stats:", error);
      res.status(500).json({ error: "Failed to fetch event type stats" });
    }
  });

  app.get("/api/analytics/engagement", isAdmin, async (req, res) => {
    try {
      // Get daily metrics for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateStr = thirtyDaysAgo.toISOString().split("T")[0];
      
      const dailyMetrics = await db
        .select({
          date: eventMetrics.date,
          pageViews: sum(eventMetrics.pageViews),
          clicks: sum(eventMetrics.registrationClicks),
          calendarAdds: sum(eventMetrics.calendarAdds),
        })
        .from(eventMetrics)
        .where(gte(eventMetrics.date, dateStr))
        .groupBy(eventMetrics.date)
        .orderBy(eventMetrics.date);
      
      res.json(dailyMetrics.map(m => ({
        date: m.date,
        pageViews: Number(m.pageViews) || 0,
        clicks: Number(m.clicks) || 0,
        calendarAdds: Number(m.calendarAdds) || 0,
      })));
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
      res.status(500).json({ error: "Failed to fetch engagement stats" });
    }
  });

  app.get("/api/analytics/top-events", isAdmin, async (req, res) => {
    try {
      const topEvents = await db
        .select({
          eventId: eventMetrics.eventId,
          totalViews: sum(eventMetrics.pageViews),
          totalClicks: sum(eventMetrics.registrationClicks),
        })
        .from(eventMetrics)
        .groupBy(eventMetrics.eventId)
        .orderBy(desc(sum(eventMetrics.pageViews)))
        .limit(10);
      
      // Get event details
      const allEvents = await storage.getEvents();
      const enrichedEvents = topEvents.map(m => {
        const event = allEvents.find(e => e.id === m.eventId);
        return {
          id: m.eventId,
          title: event?.title || "Nieznane wydarzenie",
          pageViews: Number(m.totalViews) || 0,
          clicks: Number(m.totalClicks) || 0,
        };
      });
      
      res.json(enrichedEvents);
    } catch (error) {
      console.error("Error fetching top events:", error);
      res.status(500).json({ error: "Failed to fetch top events" });
    }
  });

  return httpServer;
}
