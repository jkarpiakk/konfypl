import OpenAI from "openai";
import { SPECIALIZATIONS, EVENT_TAGS } from "@shared/schema";
import type { InsertEvent } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
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
  // Chirurgiczne
  general_surgery: ["chirurg", "operacj", "zabieg", "laparoskop", "endoskop", "tchp", "chirurgii ogólnej"],
  orthopedics: ["ortoped", "traumatolog", "kości", "staw", "kręgosłup", "endoprotez", "artroskop", "ptoitr"],
  gynecology: ["ginekolog", "położnic", "ciąż", "poród", "kobiec", "macic", "ptgip"],
  urology: ["urolog", "pęcherz", "prostata", "nerki", "moczow", "ptu", "endourolog"],
  neurosurgery: ["neurochirurg", "mózgu operac", "kręgosłupa operac", "guz mózgu", "ptnch"],
  vascular_surgery: ["naczyniow", "tętniak", "żylak", "endowaskular", "angiolog"],
  cardiac_surgery: ["kardiochirurg", "cabg", "zastawka operac", "bypass", "pomostow", "tavi chirurg"],
  pediatric_surgery: ["chirurg dziec", "wad wrodzonych", "chirurgii dziecięcej"],
  plastic_surgery: ["plastyczn", "estetyczn chirurg", "rekonstrukcj", "mikrochirurg", "oparzeni"],
  maxillofacial_surgery: ["szczękowo", "twarzow", "twarzoczaszk", "ortognatyczn"],
  ophthalmology: ["okulista", "okulistyk", "oftalmolog", "oczu", "siatkówk", "jaskr", "zaćm", "soczewk", "laserowa korekcj", "optometr", "pto"],
  otolaryngology: ["laryngolog", "otolaryngolog", "orl", "ucho", "gardł", "krtań", "audiolog", "foniatra", "ptorl", "fess"],
  thoracic_surgery: ["torakochirurg", "klatki piersiowej", "płuca operac", "vats", "śródpiersie"],
  // Zachowawcze
  internal_medicine: ["intern", "wewnętrzn", "choroby wewnętrzne", "internist", "ptim"],
  pediatrics: ["pediatr", "dziec", "niemowl", "noworod", "młodzież", "ptp"],
  family_medicine: ["rodzinn", "poz", "podstawow", "pierwszego kontaktu", "lekarz rodzinny", "medycyna rodzinna"],
  cardiology: ["kardiolog", "serce", "cardiac", "arytmi", "zawał", "niewydolność serca", "echokardiografi", "ptk", "ekg", "holter"],
  neurology: ["neurolog", "mózg", "nerwow", "udar", "padaczk", "stwardnieni", "ptn"],
  gastroenterology: ["gastroenterolog", "gastrolog", "przewód pokarmow", "endoskop", "kolonoskop", "wątrob", "trzustk", "ibd", "ptge"],
  pulmonology: ["pulmonolog", "pneumonolog", "płuc", "pochp", "astma", "bronchoskop", "oddechow", "ptchp"],
  endocrinology: ["endokrynolog", "hormon", "tarczyc", "przysadka", "nadnercz", "pte"],
  nephrology: ["nefrolog", "nerek", "dializ", "przeszczep nerki", "kłębuszkow", "ptn nefrolog"],
  rheumatology: ["reumatolog", "rzs", "toczeń", "autoimmunolog", "zapalenie stawów", "ptr"],
  hematology: ["hematolog", "krew", "białaczk", "chłoniak", "szpiczak", "krwiotwór", "pthit"],
  oncology: ["onkolog", "nowotw", "rak", "chemioter", "radioter", "przerzut", "guz", "pto", "esmo"],
  diabetology: ["diabetolog", "cukrzyc", "insulin", "glukoz", "cgm", "pomp insulinow", "ptd"],
  geriatrics: ["geriatr", "starszych", "starość", "wielochorobow", "zespoły geriatryczn"],
  emergency_medicine: ["ratunk", "nagł", "sor", "emergenc", "resuscytacj", "als", "atls"],
  anesthesiology: ["anestezjolog", "intensywn", "znieczulen", "oit", "reanimac", "sedacj", "ptaiit"],
  // Psychiatryczne
  psychiatry: ["psychiatr", "psycholog", "depresj", "lęk", "zaburzeni", "psychoz", "ptp psychiatr"],
  child_psychiatry: ["psychiatr dziec", "adhd", "autyzm", "zaburzenia u dzieci", "młodzieży psychiatr"],
  sexology: ["seksuolog", "dysfunkcj seksual", "seksualn", "terapia par"],
  // Diagnostyczne
  radiology: ["radiolog", "obrazow", "tomografi", "rezonans", "rtg", "usg", "mri", "ct", "pltr"],
  laboratory_medicine: ["laborator", "diagnostyk lab", "analityk", "badania krwi", "morfologi", "ptdl"],
  pathology: ["patomorfolog", "histopatolog", "cytolog", "immunohistochem", "biopsj"],
  nuclear_medicine: ["nuklearn", "pet-ct", "scyntygrafi", "radioizotop", "teranostyk"],
  // Inne specjalizacje
  dermatology: ["dermatolog", "skór", "dermatozy", "łuszczyc", "egzem", "trądzik", "atopow", "melanom", "dermatoskop", "wenerol", "ptd dermatolog"],
  allergology: ["alergolog", "alergii", "astma alergiczna", "immunoterapi", "anafilaksj", "pta"],
  infectious_diseases: ["zakaźn", "infekcj", "antybiotyk", "hiv", "wirusow zapalen", "szczepieni"],
  occupational_medicine: ["pracy medycyn", "profilaktyczn", "zawodow choroby", "orzecznictw"],
  sports_medicine: ["sporto", "wydolność", "urazy sportow", "antydoping", "sportowców"],
  palliative_medicine: ["paliatywn", "hospicyjn", "terminaln", "bólu leczeni", "schyłku życia"],
  rehabilitation: ["rehabilitacj", "fizjoterap", "kinezyterapia", "ndt bobath", "pnf"],
  // Kategoria ogólna
  interdisciplinary: ["interdyscyplinarn", "wielospecjalist", "holistyczn"]
};

const EXCLUSIVE_KEYWORDS: Record<string, string[]> = {
  ophthalmology: ["oczu", "okulistyk", "oftalmolog", "siatkówk", "jaskr", "zaćm", "optometr"],
  dermatology: ["skór", "dermatolog", "łuszczyc", "egzem", "dermatozy"],
  otolaryngology: ["laryngolog", "otolaryngolog", "orl", "ucho", "gardł", "krtań"],
  urology: ["urolog", "pęcherz", "prostata", "moczow"],
  nephrology: ["nefrolog", "dializ", "kłębuszkow"],
  rheumatology: ["reumatolog", "rzs", "toczeń", "autoimmunolog"],
  allergology: ["alergolog", "alergii", "immunoterapi swoista"],
  sexology: ["seksuolog", "dysfunkcj seksual"]
};

function hasExclusiveKeywords(text: string, spec: string): boolean {
  const keywords = EXCLUSIVE_KEYWORDS[spec];
  if (!keywords) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
}

function validateSpecializations(text: string, aiSpecs: string[]): string[] {
  const lowerText = text.toLowerCase();
  
  for (const [exclusiveSpec, keywords] of Object.entries(EXCLUSIVE_KEYWORDS)) {
    const hasExclusive = keywords.some(kw => lowerText.includes(kw.toLowerCase()));
    
    if (hasExclusive) {
      const invalidSpecs = aiSpecs.filter(s => {
        if (s === exclusiveSpec || s === "interdisciplinary") return false;
        if (s === "surgery" && (lowerText.includes("chirurgia stomatolog") || lowerText.includes("chirurgii stomatolog"))) return true;
        const hasOwnKeywords = EXCLUSIVE_KEYWORDS[s]?.some(kw => lowerText.includes(kw.toLowerCase()));
        return !hasOwnKeywords;
      });
      
      if (invalidSpecs.length > 0) {
        console.log(`AI validation: Removing invalid specs ${invalidSpecs.join(", ")} for ${exclusiveSpec} event`);
        aiSpecs = aiSpecs.filter(s => !invalidSpecs.includes(s));
      }
      
      if (!aiSpecs.includes(exclusiveSpec)) {
        console.log(`AI validation: Adding missing ${exclusiveSpec} specialization`);
        aiSpecs.push(exclusiveSpec);
      }
    }
  }
  
  return aiSpecs.length > 0 ? aiSpecs : ["interdisciplinary"];
}

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

WSKAZÓWKI DO KATEGORYZACJI (BARDZO WAŻNE - PRZYPISUJ POPRAWNIE!):
CHIRURGICZNE:
- general_surgery: chirurgia ogólna, laparoskopia, TChP
- orthopedics: ortopedia, traumatologia, endoprotezy, artroskopia
- gynecology: ginekologia, położnictwo, ciąża, poród
- urology: urologia, pęcherz, prostata, endourologia
- neurosurgery: neurochirurgia, operacje mózgu/kręgosłupa
- vascular_surgery: chirurgia naczyniowa, tętniaki, żylaki
- cardiac_surgery: kardiochirurgia, CABG, zastawki
- pediatric_surgery: chirurgia dziecięca, wady wrodzone
- plastic_surgery: chirurgia plastyczna, rekonstrukcyjna
- maxillofacial_surgery: chirurgia szczękowo-twarzowa
- ophthalmology: okulistyka, oczy, siatkówka, jaskra, zaćma
- otolaryngology: laryngologia, ORL, ucho, gardło, krtań, FESS
- thoracic_surgery: torakochirurgia, płuca, VATS

ZACHOWAWCZE:
- internal_medicine: interna, choroby wewnętrzne
- pediatrics: pediatria, dzieci, noworodki
- family_medicine: medycyna rodzinna, POZ
- cardiology: kardiologia, serce, EKG, echo
- neurology: neurologia, udar, padaczka, SM
- gastroenterology: gastroenterologia, endoskopia, IBD
- pulmonology: pulmonologia, POChP, astma, płuca
- endocrinology: endokrynologia, tarczyca, hormony
- nephrology: nefrologia, nerki, dializa
- rheumatology: reumatologia, RZS, toczeń
- hematology: hematologia, białaczka, chłoniaki
- oncology: onkologia, nowotwory, chemioterapia
- diabetology: diabetologia, cukrzyca, insulina
- geriatrics: geriatria, osoby starsze
- emergency_medicine: medycyna ratunkowa, SOR, ALS
- anesthesiology: anestezjologia, OIT, znieczulenie

PSYCHIATRYCZNE:
- psychiatry: psychiatria, depresja, psychozy
- child_psychiatry: psychiatria dziecięca, ADHD, autyzm
- sexology: seksuologia, dysfunkcje seksualne

DIAGNOSTYCZNE:
- radiology: radiologia, RTG, MRI, TK, USG
- laboratory_medicine: diagnostyka laboratoryjna
- pathology: patomorfologia, histopatologia
- nuclear_medicine: medycyna nuklearna, PET-CT

INNE:
- dermatology: dermatologia, skóra, łuszczyca
- allergology: alergologia, alergie, immunoterapia
- infectious_diseases: choroby zakaźne, antybiotyki
- occupational_medicine: medycyna pracy
- sports_medicine: medycyna sportowa
- palliative_medicine: medycyna paliatywna, hospicjum
- rehabilitation: rehabilitacja, fizjoterapia
- interdisciplinary: interdyscyplinarne, ogólne

KRYTYCZNE ZASADY:
1. Wybieraj NAJBARDZIEJ SPECYFICZNĄ kategorię
2. Unikaj ogólnych kategorii jeśli istnieje specyficzna
3. Przy wątpliwościach sprawdź organizatora i tematykę

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
      model: "gpt-4.1-mini",
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
      
      const eventText = `${e.title} ${e.description || ""}`;
      let validSpecs = rawSpecs.filter((s: string) => SPECIALIZATIONS.includes(s as any));
      validSpecs = validateSpecializations(eventText, validSpecs);
      
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
