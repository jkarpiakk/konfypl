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
    const baseUrl = new URL(url);

    $("script, style, nav, footer, header, aside, .cookie, .banner, .advertisement").remove();

    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    
    const eventLinks: string[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();
      if (href && text && text.length > 10) {
        let fullUrl = href;
        if (href.startsWith("/")) {
          fullUrl = `${baseUrl.origin}${href}`;
        } else if (!href.startsWith("http")) {
          fullUrl = `${baseUrl.origin}/${href}`;
        }
        if (!fullUrl.includes(baseUrl.hostname) || fullUrl.includes("rejestracja") || fullUrl.includes("event") || fullUrl.includes("konferencja")) {
          eventLinks.push(`[LINK: ${text.slice(0, 100)} -> ${fullUrl}]`);
        }
      }
    });

    const mainContent = $("main, article, .content, .events, [class*='event'], [class*='conference']")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const linksSection = eventLinks.length > 0 
      ? `\n\nZnalezione linki do wydarzeń:\n${eventLinks.slice(0, 50).join("\n")}`
      : "";

    const content = `
Źródło: ${url}
Title: ${title}
Description: ${metaDescription}
Main Content: ${mainContent || bodyText}
${linksSection}
    `.slice(0, 18000);

    return content;
  } catch (error) {
    console.error("Web scraping error:", error);
    throw error;
  }
}
