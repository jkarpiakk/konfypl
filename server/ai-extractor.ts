import OpenAI from "openai";
import { SPECIALIZATIONS } from "@shared/schema";
import type { InsertEvent } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface ExtractedEvent {
  title: string;
  description?: string;
  specializations: string[];
  tags: string[];
  startDate: string;
  endDate?: string;
  location?: string;
  isOnline: boolean;
  organizer?: string;
  hasEducationalPoints: boolean;
  educationalPoints?: number;
  price: "free" | "paid" | "unknown";
  sourceUrl?: string;
}

export async function extractEventsFromContent(
  content: string,
  sourceUrl: string
): Promise<{ events: Partial<InsertEvent>[]; confidence: number }> {
  try {
    const systemPrompt = `Jesteś ekspertem w ekstrakcji danych o wydarzeniach medycznych z tekstu.

Twoim zadaniem jest znaleźć wszystkie konferencje, kongresy, webinary, szkolenia i warsztaty medyczne.

Dostępne specjalizacje (użyj tylko tych wartości):
${SPECIALIZATIONS.join(", ")}

Dostępne tagi: webinar, points, free, paid, residents, workshop, congress, conference

Dla każdego wydarzenia wyodrębnij:
- title: tytuł wydarzenia
- description: krótki opis (max 200 znaków)
- specializations: tablica specjalizacji (użyj ID z listy powyżej)
- tags: tablica tagów
- startDate: data w formacie YYYY-MM-DD
- endDate: data zakończenia w formacie YYYY-MM-DD (opcjonalne)
- location: miasto lub lokalizacja (jeśli stacjonarne)
- isOnline: true/false
- organizer: nazwa organizatora
- hasEducationalPoints: true/false
- educationalPoints: liczba punktów (jeśli podano)
- price: "free", "paid", lub "unknown"

Odpowiedz w JSON:
{
  "events": [...],
  "confidence": 0-100
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Przeanalizuj poniższy tekst i wyodrębnij wydarzenia medyczne:\n\n${content.slice(0, 8000)}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    const extractedEvents: Partial<InsertEvent>[] = (result.events || []).map((e: ExtractedEvent) => ({
      title: e.title,
      description: e.description,
      specializations: e.specializations.filter((s: string) => SPECIALIZATIONS.includes(s as any)),
      tags: e.tags || [],
      startDate: e.startDate,
      endDate: e.endDate || null,
      location: e.location || null,
      isOnline: e.isOnline || false,
      organizer: e.organizer || null,
      hasEducationalPoints: e.hasEducationalPoints || false,
      educationalPoints: e.educationalPoints || null,
      price: e.price || "unknown",
      sourceUrl: sourceUrl,
      status: "pending",
      isAiAdded: true,
      aiConfidence: result.confidence || 70,
    }));

    return {
      events: extractedEvents,
      confidence: result.confidence || 70,
    };
  } catch (error) {
    console.error("AI extraction error:", error);
    return { events: [], confidence: 0 };
  }
}

export async function generateEventSummary(description: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { 
          role: "system", 
          content: "Jesteś ekspertem w skracaniu opisów wydarzeń medycznych. Stwórz krótkie podsumowanie (max 150 znaków) zachowując najważniejsze informacje."
        },
        { role: "user", content: description }
      ],
      max_completion_tokens: 256,
    });

    return response.choices[0]?.message?.content || description.slice(0, 150);
  } catch (error) {
    console.error("Summary generation error:", error);
    return description.slice(0, 150);
  }
}
