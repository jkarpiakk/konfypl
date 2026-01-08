import Parser from "rss-parser";
import type { InsertEvent } from "@shared/schema";

const parser = new Parser({
  customFields: {
    item: [
      ["dc:date", "dcDate"],
      ["pubDate", "pubDate"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  dcDate?: string;
  content?: string;
  contentEncoded?: string;
  contentSnippet?: string;
  description?: string;
}

export async function parseRSSFeed(url: string): Promise<Partial<InsertEvent>[]> {
  try {
    const feed = await parser.parseURL(url);
    
    const events: Partial<InsertEvent>[] = [];
    
    for (const item of feed.items || []) {
      const rssItem = item as RSSItem;
      
      const dateStr = rssItem.pubDate || rssItem.dcDate;
      let startDate: string | undefined;
      
      if (dateStr) {
        try {
          const date = new Date(dateStr);
          startDate = date.toISOString().split("T")[0];
        } catch {
          startDate = new Date().toISOString().split("T")[0];
        }
      }

      if (rssItem.title && startDate) {
        events.push({
          title: rssItem.title,
          description: rssItem.contentSnippet || rssItem.description || "",
          specializations: ["interdisciplinary"],
          tags: [],
          startDate,
          sourceUrl: rssItem.link,
          status: "pending",
          isAiAdded: true,
          aiConfidence: 50,
          price: "unknown",
          isOnline: false,
          hasEducationalPoints: false,
        });
      }
    }

    return events;
  } catch (error) {
    console.error("RSS parsing error:", error);
    return [];
  }
}
