import cron from "node-cron";
import { storage } from "./storage";
import { parseRSSFeed } from "./rss-parser";
import { fetchWebpageContent } from "./web-scraper";
import { extractEventsFromContent } from "./ai-extractor";
import type { Source, InsertEvent } from "@shared/schema";

async function scanSource(source: Source): Promise<{ added: number; found: number }> {
  console.log(`Scanning source: ${source.name} (${source.url})`);
  
  const log = await storage.createScanLog({
    sourceId: source.id,
    status: "running",
    eventsFound: 0,
    eventsAdded: 0,
  });

  try {
    let extractedEvents: Partial<InsertEvent>[] = [];

    if (source.type === "rss") {
      extractedEvents = await parseRSSFeed(source.url);
    } else {
      const content = await fetchWebpageContent(source.url);
      const result = await extractEventsFromContent(content, source.url);
      extractedEvents = result.events;
    }

    let addedCount = 0;

    for (const eventData of extractedEvents) {
      if (!eventData.title || !eventData.startDate) continue;

      const duplicate = await storage.findDuplicateEvent(
        eventData.title,
        eventData.startDate
      );

      if (!duplicate) {
        await storage.createEvent({
          title: eventData.title,
          description: eventData.description || null,
          specializations: eventData.specializations || ["interdisciplinary"],
          tags: eventData.tags || [],
          startDate: eventData.startDate,
          endDate: eventData.endDate || null,
          location: eventData.location || null,
          isOnline: eventData.isOnline || false,
          organizer: eventData.organizer || null,
          hasEducationalPoints: eventData.hasEducationalPoints || false,
          educationalPoints: eventData.educationalPoints || null,
          price: eventData.price || "unknown",
          sourceUrl: eventData.sourceUrl || source.url,
          sourceId: source.id,
          status: "pending",
          isAiAdded: true,
          aiConfidence: eventData.aiConfidence || 50,
        });
        addedCount++;
      }
    }

    await storage.updateSource(source.id, {
      lastChecked: new Date(),
      eventsFound: source.eventsFound + addedCount,
    });

    await storage.updateScanLog(log.id, {
      status: "completed",
      eventsFound: extractedEvents.length,
      eventsAdded: addedCount,
      completedAt: new Date(),
    });

    console.log(`Source ${source.name}: Found ${extractedEvents.length}, Added ${addedCount}`);
    return { found: extractedEvents.length, added: addedCount };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error scanning ${source.name}:`, errorMessage);

    await storage.updateScanLog(log.id, {
      status: "error",
      errorMessage,
      completedAt: new Date(),
    });

    return { found: 0, added: 0 };
  }
}

export async function runScheduledScans(): Promise<void> {
  console.log("Running scheduled source scans...");
  
  const sources = await storage.getSourcesDueForScan();
  console.log(`Found ${sources.length} sources due for scanning`);

  for (const source of sources) {
    await scanSource(source);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

export async function scanSingleSource(sourceId: number): Promise<{ found: number; added: number }> {
  const source = await storage.getSource(sourceId);
  if (!source) {
    throw new Error("Source not found");
  }
  return scanSource(source);
}

export function startScheduler(): void {
  cron.schedule("0 */6 * * *", async () => {
    console.log("Cron job triggered: checking sources");
    await runScheduledScans();
  });

  console.log("Scheduler started - checking sources every 6 hours");
}
