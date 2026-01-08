import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertSourceSchema, SPECIALIZATIONS } from "@shared/schema";
import { scanSingleSource, runScheduledScans } from "./scheduler";
import { z } from "zod";
import bcrypt from "bcrypt";
import { isAuthenticated, authStorage } from "./replit_integrations/auth";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

  app.get("/api/events", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const events = await storage.getEvents(status ? { status } : undefined);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
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

      const uid = `event-${event.id}@medevents.pl`;
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

  return httpServer;
}
