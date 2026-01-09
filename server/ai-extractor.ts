import OpenAI from "openai";
import { SPECIALIZATIONS, EVENT_TAGS } from "@shared/schema";
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
  eventUrl?: string;
  extractionQuality: {
    hasTitle: boolean;
    hasDate: boolean;
    hasSpecialization: boolean;
    hasDescription: boolean;
    hasOrganizer: boolean;
    hasPrice: boolean;
    hasLocation: boolean;
  };
}

interface ExtractionResult {
  events: ExtractedEvent[];
  confidence: number;
  extractionNotes?: string;
}

const SPECIALIZATION_KEYWORDS: Record<string, string[]> = {
  cardiology: ["kardiolog", "serce", "cardiac", "arytmi", "zawał", "niewydolność serca", "echokardiografi", "ptk", "ekg", "holter"],
  family_medicine: ["rodzinn", "poz", "podstawow", "pierwszego kontaktu", "lekarz rodzinny", "medycyna rodzinna"],
  internal_medicine: ["intern", "wewnętrzn", "choroby wewnętrzne", "internist"],
  anesthesiology: ["anestezjolog", "intensywn", "znieczulen", "oit", "reanimac", "sedacj"],
  surgery: ["chirurg", "operacj", "zabieg", "laparoskop", "endoskop"],
  orthopedics: ["ortoped", "traumatolog", "kości", "staw", "kręgosłup", "endoprotez"],
  gynecology: ["ginekolog", "położnic", "ciąż", "poród", "kobiec", "macic"],
  pediatrics: ["pediatr", "dziec", "niemowl", "noworod", "młodzież"],
  neurology: ["neurolog", "mózg", "nerwow", "udar", "padaczk", "stwardnieni"],
  psychiatry: ["psychiatr", "psycholog", "depresj", "lęk", "zaburzeni", "psychoz"],
  radiology: ["radiolog", "obrazow", "tomografi", "rezonans", "rtg", "usg", "mri", "ct"],
  emergency_medicine: ["ratunk", "nagł", "sor", "emergenc", "resuscytacj"],
  laboratory_diagnostics: ["laborator", "diagnostyk", "analityk", "badania krwi", "morfologi"],
  interdisciplinary: ["interdyscyplinarn", "wielospecjalist", "holistyczn"]
};

const TAG_DETECTION_RULES: Record<string, (text: string) => boolean> = {
  webinar: (text) => /webinar|online.*szkoleni|szkoleni.*online|transmisj/i.test(text),
  congress: (text) => /kongres|zjazd/i.test(text),
  conference: (text) => /konferencj|sympozj|forum/i.test(text),
  symposium: (text) => /sympozj/i.test(text),
  workshop: (text) => /warsztat|praktyczn.*zajęc|ćwiczeni|hands.?on/i.test(text),
  points: (text) => /punkt.*edukacyjn|pkt.*edu|punkty.*szkoleniow|kredyty/i.test(text),
  free: (text) => /bezpłatn|darmow|wstęp.*woln|free/i.test(text),
  paid: (text) => /płatn|odpłatn|opłat|cena|koszt.*\d/i.test(text),
  residents: (text) => /rezydent|młod.*lekar|staż|specjalizuj/i.test(text),
  online: (text) => /online|zdaln|internet|streaming|transmisj/i.test(text),
  hybrid: (text) => /hybryd|stacjonarn.*online|online.*stacjonarn/i.test(text),
  advanced: (text) => /zaawansowan|eksperck|specjalistyczn|dla specjalist/i.test(text),
  basic_level: (text) => /podstaw|wprowadz|dla początkuj|wstęp do/i.test(text),
  practical: (text) => /praktyczn|warsztaty|ćwiczeni|demonstracj/i.test(text),
  certification: (text) => /certyfikat|dyplom|zaświadczeni|akredytacj/i.test(text),
  hands_on: (text) => /hands.?on|na fantom|symulacj|ćwiczeni.*praktyczn/i.test(text),
  case_studies: (text) => /case.*stud|przypadk.*kliniczn|omówieni.*przypadk/i.test(text),
  live_surgery: (text) => /live.*surgery|transmisj.*operacj|zabieg.*na żywo/i.test(text),
  networking: (text) => /network|spotkani.*towarzysk|gala|bankiet|integracj/i.test(text),
};

function detectSpecializations(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detected: string[] = [];
  
  for (const [spec, keywords] of Object.entries(SPECIALIZATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!detected.includes(spec)) {
          detected.push(spec);
        }
        break;
      }
    }
  }
  
  return detected.length > 0 ? detected : ["interdisciplinary"];
}

function detectTags(text: string): string[] {
  const detected: string[] = [];
  
  for (const [tag, detector] of Object.entries(TAG_DETECTION_RULES)) {
    if (detector(text)) {
      detected.push(tag);
    }
  }
  
  return detected;
}

function extractEducationalPoints(text: string): { hasPoints: boolean; points: number | null } {
  const patterns = [
    /(\d+)\s*(?:punkt|pkt).*edukacyjn/i,
    /punkt.*edukacyjn.*?(\d+)/i,
    /(\d+)\s*pkt\s*edu/i,
    /kredyt.*?(\d+)/i,
    /(\d+)\s*kredyt/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const points = parseInt(match[1], 10);
      if (points > 0 && points <= 100) {
        return { hasPoints: true, points };
      }
    }
  }
  
  if (/punkt.*edukacyjn|pkt.*edu|kredyty/i.test(text)) {
    return { hasPoints: true, points: null };
  }
  
  return { hasPoints: false, points: null };
}

function calculateConfidence(event: ExtractedEvent): number {
  let score = 50;
  
  if (event.extractionQuality.hasTitle) score += 10;
  if (event.extractionQuality.hasDate) score += 15;
  if (event.extractionQuality.hasSpecialization) score += 10;
  if (event.extractionQuality.hasDescription) score += 5;
  if (event.extractionQuality.hasOrganizer) score += 5;
  if (event.extractionQuality.hasPrice) score += 3;
  if (event.extractionQuality.hasLocation || event.isOnline) score += 2;
  
  return Math.min(score, 100);
}

export async function extractEventsFromContent(
  content: string,
  sourceUrl: string
): Promise<{ events: Partial<InsertEvent>[]; confidence: number }> {
  try {
    const sourceHost = new URL(sourceUrl).hostname;
    
    const preDetectedSpecs = detectSpecializations(content);
    const preDetectedTags = detectTags(content);
    const eduPoints = extractEducationalPoints(content);
    
    const systemPrompt = `Jesteś ekspertem w ekstrakcji danych o wydarzeniach medycznych z tekstu polskich stron internetowych.

TWOJE ZADANIE:
Znajdź WSZYSTKIE konferencje, kongresy, webinary, szkolenia, sympozja i warsztaty medyczne w podanym tekście.

KRYTERIA JAKOŚCI EKSTRAKCJI:
1. Tytuł (WYMAGANY): Pełny, oficjalny tytuł wydarzenia
2. Data (WYMAGANA): Format YYYY-MM-DD, wyodrębnij z tekstu polskie daty (np. "15 stycznia 2026" -> "2026-01-15")
3. Specjalizacje: Dopasuj do jednej lub więcej z listy poniżej
4. Opis: Krótki, informacyjny (max 250 znaków)
5. Organizator: Nazwa instytucji/towarzystwa organizującego
6. Cena: Określ jako "free", "paid" lub "unknown"
7. Lokalizacja: Miasto lub "online" jeśli zdalne

BARDZO WAŻNE - LINKI:
- Szukaj ORYGINALNYCH linków do stron wydarzeń (eventUrl)
- NIE używaj linków do agregatora (${sourceHost})
- Preferuj linki do oficjalnych stron: organizatorów, rejestracji, konferencji
- Jeśli brak zewnętrznego linku, ustaw eventUrl na null

DOSTĘPNE SPECJALIZACJE (użyj tylko tych ID):
${SPECIALIZATIONS.join(", ")}

WSKAZÓWKI DO KATEGORYZACJI:
- Kardiologia: PTK, serce, arytmie, zawał, EKG, echo
- Interna: choroby wewnętrzne, internista
- Medycyna rodzinna: POZ, lekarz rodzinny, podstawowa opieka
- Pediatria: dzieci, niemowlęta, noworodki
- Chirurgia: operacje, zabiegi, laparoskopia
- Neurologia: mózg, udar, stwardnienie, padaczka
- Psychiatria: depresja, zaburzenia, psychozy
- Anestezjologia: znieczulenie, OIT, intensywna terapia
- Ginekologia: ciąża, poród, kobiece
- Ortopedia: kości, stawy, endoprotezy
- Radiologia: obrazowanie, RTG, MRI, USG, TK
- Ratunkowa: SOR, nagłe, resuscytacja
- Laboratoryjna: diagnostyka, analityka
- Interdyscyplinarne: wielospecjalistyczne, ogólnomedyczne

DOSTĘPNE TAGI (wybierz wszystkie pasujące):
${EVENT_TAGS.join(", ")}

LOGIKA TAGOWANIA:
- webinar/online: szkolenie przez internet, streaming
- congress: duże, prestiżowe wydarzenie (kongres, zjazd)
- conference: konferencja naukowa, forum
- symposium: sympozjum tematyczne
- workshop: warsztaty praktyczne, ćwiczenia
- points: wydarzenie daje punkty edukacyjne
- free/paid: cena uczestnictwa
- residents: skierowane do rezydentów/młodych lekarzy
- advanced: poziom zaawansowany/ekspercki
- basic_level: poziom podstawowy/wprowadzający
- practical: zawiera elementy praktyczne
- certification: daje certyfikat/dyplom
- hands_on: ćwiczenia na fantomach/symulatorach
- case_studies: omówienia przypadków klinicznych
- live_surgery: transmisja zabiegów
- networking: elementy towarzyskie/integracyjne
- hybrid: część online + część stacjonarna

WSTĘPNA ANALIZA TEKSTU WYKRYŁA:
- Prawdopodobne specjalizacje: ${preDetectedSpecs.join(", ")}
- Prawdopodobne tagi: ${preDetectedTags.join(", ")}
- Punkty edukacyjne: ${eduPoints.hasPoints ? (eduPoints.points ? `${eduPoints.points} pkt` : "tak, ilość nieznana") : "nie wykryto"}

Wykorzystaj te wskazówki, ale zweryfikuj i uzupełnij na podstawie pełnej analizy.

FORMAT ODPOWIEDZI (JSON):
{
  "events": [
    {
      "title": "...",
      "description": "...",
      "specializations": ["...", "..."],
      "tags": ["...", "..."],
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD lub null",
      "location": "miasto lub null jeśli online",
      "isOnline": true/false,
      "organizer": "...",
      "hasEducationalPoints": true/false,
      "educationalPoints": liczba lub null,
      "price": "free" | "paid" | "unknown",
      "eventUrl": "oryginalny link lub null",
      "extractionQuality": {
        "hasTitle": true/false,
        "hasDate": true/false,
        "hasSpecialization": true/false,
        "hasDescription": true/false,
        "hasOrganizer": true/false,
        "hasPrice": true/false,
        "hasLocation": true/false
      }
    }
  ],
  "confidence": 0-100,
  "extractionNotes": "krótka notatka o jakości źródła"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Przeanalizuj tekst i wyodrębnij wszystkie wydarzenia medyczne:\n\n${content.slice(0, 12000)}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 6000,
    });

    const result: ExtractionResult = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    const extractedEvents: Partial<InsertEvent>[] = (result.events || []).map((e: ExtractedEvent) => {
      let finalUrl = e.eventUrl || null;
      
      if (finalUrl) {
        try {
          const eventHost = new URL(finalUrl).hostname;
          if (eventHost === sourceHost || eventHost.includes("termedia") || eventHost.includes("mp.pl")) {
            finalUrl = null;
          }
        } catch {
          finalUrl = null;
        }
      }
      
      const rawSpecs = Array.isArray(e.specializations) ? e.specializations : [];
      const rawTags = Array.isArray(e.tags) ? e.tags : [];
      
      const validSpecs = rawSpecs.filter((s: string) => SPECIALIZATIONS.includes(s as any));
      const validTags = rawTags.filter((t: string) => EVENT_TAGS.includes(t as any));
      
      if (e.isOnline && !validTags.includes("online")) {
        validTags.push("online");
      }
      if (e.hasEducationalPoints && !validTags.includes("points")) {
        validTags.push("points");
      }
      
      const eventConfidence = e.extractionQuality ? calculateConfidence(e) : (result.confidence || 70);
      
      return {
        title: e.title || "Wydarzenie medyczne",
        description: e.description || null,
        specializations: validSpecs.length > 0 ? validSpecs : ["interdisciplinary"],
        tags: validTags,
        startDate: e.startDate,
        endDate: e.endDate || null,
        location: e.location || null,
        isOnline: e.isOnline || false,
        organizer: e.organizer || null,
        hasEducationalPoints: e.hasEducationalPoints || false,
        educationalPoints: e.educationalPoints || null,
        price: e.price || "unknown",
        sourceUrl: finalUrl,
        status: "pending",
        isAiAdded: true,
        aiConfidence: eventConfidence,
      };
    });

    console.log(`AI Extraction: Found ${extractedEvents.length} events, confidence: ${result.confidence}%`);
    if (result.extractionNotes) {
      console.log(`AI Notes: ${result.extractionNotes}`);
    }

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
          content: "Jesteś ekspertem w skracaniu opisów wydarzeń medycznych. Stwórz krótkie, informacyjne podsumowanie (max 150 znaków) zachowując: temat, grupę docelową i najważniejszą korzyść dla uczestnika."
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

export async function suggestEventImprovements(event: {
  title: string;
  description?: string;
  specializations: string[];
  tags: string[];
}): Promise<{
  suggestedSpecializations: string[];
  suggestedTags: string[];
  descriptionSuggestion?: string;
}> {
  try {
    const fullText = `${event.title} ${event.description || ""}`;
    
    const detectedSpecs = detectSpecializations(fullText);
    const detectedTags = detectTags(fullText);
    
    const newSpecs = detectedSpecs.filter(s => !event.specializations.includes(s));
    const newTags = detectedTags.filter(t => !event.tags.includes(t));
    
    return {
      suggestedSpecializations: newSpecs,
      suggestedTags: newTags,
    };
  } catch (error) {
    console.error("Suggestion error:", error);
    return { suggestedSpecializations: [], suggestedTags: [] };
  }
}
