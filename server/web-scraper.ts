import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchWebpageContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KonfyBot/1.0; +https://konfy.pl)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl,en;q=0.5",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    $("script, style, nav, footer, header, aside, .cookie, .banner, .advertisement").remove();

    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    
    const mainContent = $("main, article, .content, .events, [class*='event'], [class*='conference']")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const content = `
Title: ${title}
Description: ${metaDescription}
Main Content: ${mainContent || bodyText}
    `.slice(0, 15000);

    return content;
  } catch (error) {
    console.error("Web scraping error:", error);
    throw error;
  }
}
