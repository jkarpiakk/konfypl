import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@shared/schema";

export const SPECIALIZATION_SLUGS: Record<typeof SPECIALIZATIONS[number], string> = {
  // Chirurgiczne
  general_surgery: "chirurgia-ogolna",
  orthopedics: "ortopedia",
  gynecology: "ginekologia",
  urology: "urologia",
  neurosurgery: "neurochirurgia",
  vascular_surgery: "chirurgia-naczyniowa",
  cardiac_surgery: "kardiochirurgia",
  pediatric_surgery: "chirurgia-dziecieca",
  plastic_surgery: "chirurgia-plastyczna",
  maxillofacial_surgery: "chirurgia-szczekowo-twarzowa",
  ophthalmology: "okulistyka",
  otolaryngology: "laryngologia",
  thoracic_surgery: "torakochirurgia",
  // Zachowawcze
  internal_medicine: "interna",
  pediatrics: "pediatria",
  family_medicine: "medycyna-rodzinna",
  cardiology: "kardiologia",
  neurology: "neurologia",
  gastroenterology: "gastroenterologia",
  pulmonology: "pulmonologia",
  endocrinology: "endokrynologia",
  nephrology: "nefrologia",
  rheumatology: "reumatologia",
  hematology: "hematologia",
  oncology: "onkologia",
  diabetology: "diabetologia",
  geriatrics: "geriatria",
  emergency_medicine: "medycyna-ratunkowa",
  anesthesiology: "anestezjologia",
  // Psychiatryczne
  psychiatry: "psychiatria",
  child_psychiatry: "psychiatria-dziecieca",
  sexology: "seksuologia",
  // Diagnostyczne
  radiology: "radiologia",
  laboratory_medicine: "diagnostyka-laboratoryjna",
  pathology: "patomorfologia",
  nuclear_medicine: "medycyna-nuklearna",
  // Inne
  dermatology: "dermatologia",
  allergology: "alergologia",
  infectious_diseases: "choroby-zakazne",
  occupational_medicine: "medycyna-pracy",
  sports_medicine: "medycyna-sportowa",
  palliative_medicine: "medycyna-paliatywna",
  rehabilitation: "rehabilitacja",
  // Ogólne
  interdisciplinary: "interdyscyplinarne"
};

export const SLUG_TO_SPECIALIZATION: Record<string, typeof SPECIALIZATIONS[number]> = 
  Object.fromEntries(
    Object.entries(SPECIALIZATION_SLUGS).map(([key, value]) => [value, key as typeof SPECIALIZATIONS[number]])
  );

export interface SpecializationSEOData {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  topics: string[];
  faqs: Array<{ question: string; answer: string }>;
  societies: string[];
  keywords: string[];
}

export const SPECIALIZATION_SEO: Record<typeof SPECIALIZATIONS[number], SpecializationSEOData> = {
  // === CHIRURGICZNE ===
  general_surgery: {
    slug: "chirurgia-ogolna",
    name: "Chirurgia ogólna",
    metaTitle: "Konferencje Chirurgiczne 2025/2026 | Szkolenia dla Chirurgów | Konfy.pl",
    metaDescription: "Konferencje chirurgiczne w Polsce. Kongresy TChP, ESCP, warsztaty laparoskopowe, szkolenia z chirurgii onkologicznej i minimalnie inwazyjnej.",
    h1: "Konferencje i Szkolenia Chirurgiczne",
    intro: "Chirurgia ogólna obejmuje operacyjne leczenie chorób jamy brzusznej, gruczołów, naczyń i tkanek miękkich. Rozwój technik minimalnie inwazyjnych wymaga ciągłego doskonalenia umiejętności.",
    topics: ["Chirurgia laparoskopowa", "Chirurgia onkologiczna", "Chirurgia bariatryczna", "Chirurgia endokrynologiczna", "Chirurgia jednego dnia", "Techniki minimalnie inwazyjne"],
    faqs: [
      { question: "Gdzie odbywają się warsztaty laparoskopowe?", answer: "Warsztaty laparoskopowe organizowane są przez centra szkoleniowe w Warszawie, Krakowie, Poznaniu i innych miastach, często przy kongresach chirurgicznych." }
    ],
    societies: ["Towarzystwo Chirurgów Polskich (TChP)", "European Society of Coloproctology (ESCP)"],
    keywords: ["konferencje chirurgiczne", "szkolenia chirurgia", "warsztaty laparoskopowe", "kongres chirurgów"]
  },
  orthopedics: {
    slug: "ortopedia",
    name: "Ortopedia i traumatologia",
    metaTitle: "Konferencje Ortopedyczne 2025/2026 | Szkolenia Ortopedia | Konfy.pl",
    metaDescription: "Konferencje ortopedyczne i traumatologiczne. Zjazdy PTOiTr, szkolenia z artroskopii, endoprotezoplastyki, chirurgii kręgosłupa.",
    h1: "Konferencje i Szkolenia Ortopedyczne",
    intro: "Ortopedia i traumatologia narządu ruchu zajmuje się leczeniem urazów i chorób układu kostno-stawowego. Obejmuje endoprotezoplastykę, artroskopię i chirurgię kręgosłupa.",
    topics: ["Endoprotezoplastyka", "Artroskopia", "Chirurgia kręgosłupa", "Traumatologia", "Ortopedia dziecięca", "Medycyna sportowa"],
    faqs: [
      { question: "Jakie szkolenia praktyczne są dostępne dla ortopedów?", answer: "Dostępne są warsztaty z artroskopii, endoprotezoplastyki, technik ostesyntezy na fantomach i preparatach kadawerycznych." }
    ],
    societies: ["Polskie Towarzystwo Ortopedyczne i Traumatologiczne (PTOiTr)", "EFORT"],
    keywords: ["konferencje ortopedyczne", "szkolenia ortopedia", "artroskopia", "endoprotezoplastyka"]
  },
  gynecology: {
    slug: "ginekologia",
    name: "Położnictwo i ginekologia",
    metaTitle: "Konferencje Ginekologiczne 2025/2026 | Szkolenia Położnictwo | Konfy.pl",
    metaDescription: "Konferencje ginekologiczne i położnicze. Zjazdy PTGiP, szkolenia z USG położniczego, ginekologii onkologicznej, endokrynologii ginekologicznej.",
    h1: "Konferencje Ginekologii i Położnictwa",
    intro: "Położnictwo i ginekologia obejmuje opiekę nad kobietą w ciąży i połogu oraz diagnostykę i leczenie chorób układu rozrodczego.",
    topics: ["USG położnicze", "Ginekologia onkologiczna", "Endokrynologia ginekologiczna", "Perinatologia", "Uroginekologia", "Rozrodczość"],
    faqs: [
      { question: "Które certyfikaty USG są wymagane w ginekologii?", answer: "Certyfikaty FMF, PTGiP oraz kursy USG położniczego I, II i III trymestru są standardem w specjalizacji." }
    ],
    societies: ["Polskie Towarzystwo Ginekologów i Położników (PTGiP)", "ISUOG"],
    keywords: ["konferencje ginekologiczne", "szkolenia położnictwo", "USG położnicze", "ginekologia onkologiczna"]
  },
  urology: {
    slug: "urologia",
    name: "Urologia",
    metaTitle: "Konferencje Urologiczne 2025/2026 | Szkolenia Urologia | Konfy.pl",
    metaDescription: "Konferencje urologiczne w Polsce. Zjazdy PTU, szkolenia z endourologii, uroonkologii, andrologii i chirurgii robotycznej.",
    h1: "Konferencje i Szkolenia Urologiczne",
    intro: "Urologia zajmuje się diagnostyką i leczeniem chorób układu moczowego oraz męskiego układu płciowego. Dynamiczny rozwój technik minimalnie inwazyjnych i robotycznych.",
    topics: ["Endourologia", "Uroonkologia", "Andrologia", "Chirurgia robotyczna", "Kamica moczowa", "Neurourologia"],
    faqs: [
      { question: "Jakie szkolenia robotyczne są dostępne dla urologów?", answer: "Szkolenia z chirurgii robotycznej da Vinci organizują centra referencyjne oraz producent systemu w ramach certyfikacji." }
    ],
    societies: ["Polskie Towarzystwo Urologiczne (PTU)", "European Association of Urology (EAU)"],
    keywords: ["konferencje urologiczne", "szkolenia urologia", "endourologia", "chirurgia robotyczna"]
  },
  neurosurgery: {
    slug: "neurochirurgia",
    name: "Neurochirurgia",
    metaTitle: "Konferencje Neurochirurgiczne 2025/2026 | Szkolenia Neurochirurgia | Konfy.pl",
    metaDescription: "Konferencje neurochirurgiczne w Polsce. Zjazdy PTNCH, szkolenia z chirurgii kręgosłupa, guzów mózgu, neurochirurgii naczyniowej.",
    h1: "Konferencje i Szkolenia Neurochirurgiczne",
    intro: "Neurochirurgia zajmuje się operacyjnym leczeniem chorób ośrodkowego i obwodowego układu nerwowego, w tym guzów mózgu, urazów i chorób kręgosłupa.",
    topics: ["Chirurgia guzów mózgu", "Chirurgia kręgosłupa", "Neurochirurgia naczyniowa", "Neurochirurgia czynnościowa", "Neurotraumatologia"],
    faqs: [
      { question: "Jakie kursy praktyczne są dostępne dla neurochirurgów?", answer: "Kursy kadaweryczne, symulacje mikrochirurgiczne oraz szkolenia z neuronavigacji i technik endoskopowych." }
    ],
    societies: ["Polskie Towarzystwo Neurochirurgów (PTNCH)", "EANS"],
    keywords: ["konferencje neurochirurgiczne", "szkolenia neurochirurgia", "chirurgia kręgosłupa", "guzy mózgu"]
  },
  vascular_surgery: {
    slug: "chirurgia-naczyniowa",
    name: "Chirurgia naczyniowa",
    metaTitle: "Konferencje Chirurgii Naczyniowej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje chirurgii naczyniowej w Polsce. Szkolenia z leczenia tętniaków, chorób tętnic obwodowych, żylaków.",
    h1: "Konferencje Chirurgii Naczyniowej",
    intro: "Chirurgia naczyniowa obejmuje leczenie operacyjne i wewnątrznaczyniowe chorób tętnic, żył i naczyń limfatycznych.",
    topics: ["Tętniaki aorty", "Choroby tętnic obwodowych", "Żylaki kończyn dolnych", "Zabiegi endowaskularne", "Dializa dostępy"],
    faqs: [
      { question: "Jakie techniki endowaskularne są szkolone?", answer: "Stentgrafty, angioplastyka, embolizacja oraz hybrydowe techniki naczyniowe." }
    ],
    societies: ["Polskie Towarzystwo Chirurgii Naczyniowej", "ESVS"],
    keywords: ["chirurgia naczyniowa", "konferencje naczyniowe", "tętniaki", "zabiegi endowaskularne"]
  },
  cardiac_surgery: {
    slug: "kardiochirurgia",
    name: "Kardiochirurgia",
    metaTitle: "Konferencje Kardiochirurgiczne 2025/2026 | Szkolenia Kardiochirurgia | Konfy.pl",
    metaDescription: "Konferencje kardiochirurgiczne w Polsce. Szkolenia z CABG, chirurgii zastawkowej, TAVI, transplantologii serca.",
    h1: "Konferencje i Szkolenia Kardiochirurgiczne",
    intro: "Kardiochirurgia zajmuje się operacyjnym leczeniem chorób serca i dużych naczyń, w tym pomostowaniem aortalno-wieńcowym i wymianą zastawek.",
    topics: ["Pomostowanie (CABG)", "Chirurgia zastawkowa", "TAVI", "Transplantacja serca", "ECMO", "Chirurgia minimalnie inwazyjna"],
    faqs: [
      { question: "Gdzie szkolić się z technik TAVI?", answer: "Szkolenia TAVI prowadzą centra referencyjne oraz producenci zastawek w ramach programów certyfikacyjnych." }
    ],
    societies: ["Polskie Towarzystwo Kardio-Torakochirurgów", "EACTS"],
    keywords: ["kardiochirurgia", "konferencje kardiochirurgiczne", "CABG", "chirurgia zastawkowa"]
  },
  pediatric_surgery: {
    slug: "chirurgia-dziecieca",
    name: "Chirurgia dziecięca",
    metaTitle: "Konferencje Chirurgii Dziecięcej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje chirurgii dziecięcej w Polsce. Szkolenia z wad wrodzonych, chirurgii noworodka, onkologii dziecięcej.",
    h1: "Konferencje Chirurgii Dziecięcej",
    intro: "Chirurgia dziecięca zajmuje się leczeniem operacyjnym wad wrodzonych i nabytych u dzieci od okresu noworodkowego do adolescencji.",
    topics: ["Wady wrodzone", "Chirurgia noworodka", "Onkologia dziecięca", "Urologia dziecięca", "Laparoskopia dziecięca"],
    faqs: [
      { question: "Jakie specyficzne szkolenia są dla chirurgów dziecięcych?", answer: "Szkolenia z chirurgii wad wrodzonych, technik minimalnie inwazyjnych u dzieci oraz opieki okołooperacyjnej noworodka." }
    ],
    societies: ["Polskie Towarzystwo Chirurgów Dziecięcych", "EUPSA"],
    keywords: ["chirurgia dziecięca", "wady wrodzone", "chirurgia noworodka"]
  },
  plastic_surgery: {
    slug: "chirurgia-plastyczna",
    name: "Chirurgia plastyczna",
    metaTitle: "Konferencje Chirurgii Plastycznej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje chirurgii plastycznej i rekonstrukcyjnej. Szkolenia z chirurgii estetycznej, rekonstrukcji piersi, chirurgii ręki.",
    h1: "Konferencje Chirurgii Plastycznej",
    intro: "Chirurgia plastyczna obejmuje zabiegi rekonstrukcyjne i estetyczne, leczenie oparzeń oraz mikrochirurgię.",
    topics: ["Chirurgia estetyczna", "Rekonstrukcja piersi", "Chirurgia ręki", "Leczenie oparzeń", "Mikrochirurgia", "Medycyna estetyczna"],
    faqs: [
      { question: "Jakie certyfikaty są potrzebne w chirurgii plastycznej?", answer: "Certyfikaty towarzystw naukowych, szkolenia z medycyny estetycznej oraz kursy mikrochirurgiczne." }
    ],
    societies: ["Polskie Towarzystwo Chirurgii Plastycznej", "ISAPS", "ESPRAS"],
    keywords: ["chirurgia plastyczna", "chirurgia estetyczna", "rekonstrukcja", "mikrochirurgia"]
  },
  maxillofacial_surgery: {
    slug: "chirurgia-szczekowo-twarzowa",
    name: "Chirurgia szczękowo-twarzowa",
    metaTitle: "Konferencje Chirurgii Szczękowo-Twarzowej 2025/2026 | Konfy.pl",
    metaDescription: "Konferencje chirurgii szczękowo-twarzowej. Szkolenia z traumatologii twarzy, onkologii głowy i szyi, chirurgii ortognatycznej.",
    h1: "Konferencje Chirurgii Szczękowo-Twarzowej",
    intro: "Chirurgia szczękowo-twarzowa zajmuje się leczeniem urazów, wad wrodzonych i nabytych oraz nowotworów w obrębie twarzy i jamy ustnej.",
    topics: ["Traumatologia twarzoczaszki", "Chirurgia ortognatyczna", "Onkologia głowy i szyi", "Implantologia", "Rekonstrukcja twarzy"],
    faqs: [
      { question: "Jakie szkolenia są najważniejsze w tej specjalizacji?", answer: "Kursy z osteotomii, planowania 3D, implantologii oraz leczenia złamań twarzoczaszki." }
    ],
    societies: ["Polskie Towarzystwo Chirurgii Szczękowo-Twarzowej", "EACMFS"],
    keywords: ["chirurgia szczękowo-twarzowa", "traumatologia twarzy", "chirurgia ortognatyczna"]
  },
  ophthalmology: {
    slug: "okulistyka",
    name: "Okulistyka",
    metaTitle: "Konferencje Okulistyczne 2025/2026 | Szkolenia Oftalmologia | Konfy.pl",
    metaDescription: "Konferencje okulistyczne w Polsce. Zjazdy PTO, szkolenia z chirurgii zaćmy, siatkówki, jaskry, refrakcji laserowej.",
    h1: "Konferencje i Szkolenia Okulistyczne",
    intro: "Okulistyka zajmuje się diagnostyką i leczeniem chorób oczu. Obejmuje chirurgię zaćmy, leczenie jaskry, chorób siatkówki oraz korekcję wad wzroku.",
    topics: ["Chirurgia zaćmy", "Jaskra", "Choroby siatkówki", "AMD", "Chirurgia refrakcyjna", "Okulistyka dziecięca", "OCT"],
    faqs: [
      { question: "Jakie kursy chirurgiczne są dostępne dla okulistów?", answer: "Kursy wet-lab z fakoemulsyfikacji, witrektomii, implantacji soczewek premium oraz chirurgii refrakcyjnej." }
    ],
    societies: ["Polskie Towarzystwo Okulistyczne (PTO)", "ESCRS", "EURETINA"],
    keywords: ["konferencje okulistyczne", "szkolenia oftalmologia", "chirurgia zaćmy", "jaskra"]
  },
  otolaryngology: {
    slug: "laryngologia",
    name: "Otorynolaryngologia",
    metaTitle: "Konferencje Laryngologiczne 2025/2026 | Szkolenia ORL | Konfy.pl",
    metaDescription: "Konferencje otolaryngologiczne w Polsce. Zjazdy PTORL, szkolenia z audiologii, rynologii, foniatrii, onkologii głowy i szyi.",
    h1: "Konferencje Otorynolaryngologii",
    intro: "Otorynolaryngologia (laryngologia) zajmuje się diagnostyką i leczeniem chorób ucha, nosa, gardła i krtani.",
    topics: ["Audiologia", "Rynologia", "Onkologia głowy i szyi", "Foniatria", "Implanty słuchowe", "FESS"],
    faqs: [
      { question: "Jakie kursy praktyczne są dostępne?", answer: "Kursy FESS (chirurgii endoskopowej zatok), audiologii, implantów ślimakowych oraz chirurgii onkologicznej." }
    ],
    societies: ["Polskie Towarzystwo Otorynolaryngologów (PTORL)", "ERS"],
    keywords: ["laryngologia", "otorynolaryngologia", "audiologia", "FESS", "onkologia głowy i szyi"]
  },
  thoracic_surgery: {
    slug: "torakochirurgia",
    name: "Torakochirurgia",
    metaTitle: "Konferencje Torakochirurgiczne 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje torakochirurgiczne w Polsce. Szkolenia z chirurgii płuc, nowotworów klatki piersiowej, VATS.",
    h1: "Konferencje Torakochirurgiczne",
    intro: "Torakochirurgia zajmuje się operacyjnym leczeniem chorób płuc, opłucnej, śródpiersia i ściany klatki piersiowej.",
    topics: ["Chirurgia raka płuca", "VATS", "Nowotwory śródpiersia", "Chirurgia opłucnej", "Transplantacja płuc"],
    faqs: [
      { question: "Jakie techniki minimalnie inwazyjne są szkolone?", answer: "VATS (wideotorakoskopia), techniki robotyczne oraz subksyfoidalne podejścia endoskopowe." }
    ],
    societies: ["Polskie Towarzystwo Kardio-Torakochirurgów", "ESTS"],
    keywords: ["torakochirurgia", "chirurgia płuc", "VATS", "rak płuca"]
  },

  // === ZACHOWAWCZE ===
  internal_medicine: {
    slug: "interna",
    name: "Choroby wewnętrzne",
    metaTitle: "Konferencje Internistyczne 2025/2026 | Szkolenia Interna | Konfy.pl",
    metaDescription: "Konferencje i szkolenia z interny. Kongresy PTIM, webinary internistyczne z punktami. Diagnostyka różnicowa, choroby wewnętrzne.",
    h1: "Konferencje i Szkolenia Internistyczne",
    intro: "Choroby wewnętrzne to szeroka dziedzina obejmująca diagnostykę i leczenie chorób narządów wewnętrznych. Interniści specjalizują się w kompleksowym podejściu do pacjenta z wielochorobowością.",
    topics: ["Diagnostyka różnicowa", "Wielochorobowość", "Farmakoterapia", "Choroby metaboliczne", "Choroby autoimmunologiczne", "Ostra interna"],
    faqs: [
      { question: "Czym różni się interna od medycyny rodzinnej?", answer: "Interna koncentruje się na diagnostyce i leczeniu chorób wewnętrznych, często w warunkach szpitalnych." }
    ],
    societies: ["Polskie Towarzystwo Internistów (PTIM)", "EFIM"],
    keywords: ["konferencje internistyczne", "szkolenia interna", "kongres PTIM", "choroby wewnętrzne"]
  },
  pediatrics: {
    slug: "pediatria",
    name: "Pediatria",
    metaTitle: "Konferencje Pediatryczne 2025/2026 | Szkolenia dla Pediatrów | Konfy.pl",
    metaDescription: "Konferencje pediatryczne w Polsce. Zjazdy PTP, szkolenia z neonatologii, alergologii dziecięcej, gastroenterologii pediatrycznej.",
    h1: "Konferencje i Szkolenia Pediatryczne",
    intro: "Pediatria zajmuje się zdrowiem dzieci od urodzenia do dorosłości. Obejmuje profilaktykę, diagnostykę i leczenie chorób wieku dziecięcego.",
    topics: ["Neonatologia", "Pediatria ogólna", "Alergologia dziecięca", "Gastroenterologia pediatryczna", "Kardiologia dziecięca", "Szczepienia"],
    faqs: [
      { question: "Jakie są najważniejsze konferencje pediatryczne?", answer: "Kongres PTP, konferencje regionalne oraz szkolenia subspecjalistyczne z neonatologii, alergologii." }
    ],
    societies: ["Polskie Towarzystwo Pediatryczne (PTP)", "EAP"],
    keywords: ["konferencje pediatryczne", "szkolenia pediatria", "neonatologia", "szczepienia"]
  },
  family_medicine: {
    slug: "medycyna-rodzinna",
    name: "Medycyna rodzinna",
    metaTitle: "Konferencje Medycyny Rodzinnej 2025/2026 | Szkolenia POZ | Konfy.pl",
    metaDescription: "Konferencje i szkolenia dla lekarzy rodzinnych. Webinary POZ z punktami edukacyjnymi. Aktualne wytyczne, diagnostyka w POZ.",
    h1: "Konferencje i Szkolenia Medycyny Rodzinnej",
    intro: "Medycyna rodzinna to podstawowa opieka zdrowotna obejmująca całościowe podejście do pacjenta. Lekarze rodzinni zajmują się profilaktyką, diagnostyką i leczeniem najczęstszych chorób.",
    topics: ["Diagnostyka w POZ", "Farmakoterapia", "Profilaktyka", "Choroby przewlekłe", "Pediatria w POZ", "Geriatria", "USG w gabinecie"],
    faqs: [
      { question: "Czy są bezpłatne webinary dla lekarzy rodzinnych?", answer: "Tak, wiele towarzystw organizuje bezpłatne webinary z punktami edukacyjnymi dla lekarzy POZ." }
    ],
    societies: ["Kolegium Lekarzy Rodzinnych w Polsce", "Polskie Towarzystwo Medycyny Rodzinnej"],
    keywords: ["konferencje medycyna rodzinna", "szkolenia POZ", "webinary dla lekarzy rodzinnych"]
  },
  cardiology: {
    slug: "kardiologia",
    name: "Kardiologia",
    metaTitle: "Konferencje Kardiologiczne 2025/2026 | Szkolenia dla Kardiologów | Konfy.pl",
    metaDescription: "Konferencje kardiologiczne w Polsce. Zjazdy PTK, ESC Congress, webinary z punktami edukacyjnymi. Szkolenia z niewydolności serca, arytmii.",
    h1: "Konferencje i Szkolenia Kardiologiczne",
    intro: "Kardiologia to dziedzina medycyny zajmująca się diagnostyką i leczeniem chorób serca i układu krążenia.",
    topics: ["Niewydolność serca", "Arytmie i elektrofizjologia", "Kardiologia interwencyjna", "Choroba wieńcowa", "Wady zastawkowe", "Nadciśnienie tętnicze", "Echokardiografia"],
    faqs: [
      { question: "Ile punktów edukacyjnych potrzebuję jako kardiolog?", answer: "Kardiolodzy muszą zdobyć 200 punktów edukacyjnych w 4-letnim okresie rozliczeniowym." }
    ],
    societies: ["Polskie Towarzystwo Kardiologiczne (PTK)", "European Society of Cardiology (ESC)"],
    keywords: ["konferencje kardiologiczne", "szkolenia kardiologia", "kongres PTK", "ESC Congress"]
  },
  neurology: {
    slug: "neurologia",
    name: "Neurologia",
    metaTitle: "Konferencje Neurologiczne 2025/2026 | Szkolenia Neurologia | Konfy.pl",
    metaDescription: "Konferencje neurologiczne w Polsce. Zjazdy PTN, szkolenia z udarów, stwardnienia rozsianego, padaczki, bólów głowy.",
    h1: "Konferencje i Szkolenia Neurologiczne",
    intro: "Neurologia zajmuje się diagnostyką i leczeniem chorób układu nerwowego - mózgu, rdzenia kręgowego i nerwów obwodowych.",
    topics: ["Udary mózgu", "Stwardnienie rozsiane", "Padaczka", "Bóle głowy", "Choroby neurodegeneracyjne", "Neuroimmunologia"],
    faqs: [
      { question: "Jakie nowe terapie w neurologii warto poznać?", answer: "Terapie biologiczne w SM, trombektomia w udarach, nowe leki w migrenie (anty-CGRP)." }
    ],
    societies: ["Polskie Towarzystwo Neurologiczne (PTN)", "European Academy of Neurology (EAN)"],
    keywords: ["konferencje neurologiczne", "szkolenia neurologia", "udary mózgu", "stwardnienie rozsiane"]
  },
  gastroenterology: {
    slug: "gastroenterologia",
    name: "Gastroenterologia",
    metaTitle: "Konferencje Gastroenterologiczne 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje gastroenterologiczne w Polsce. Zjazdy PTG-E, szkolenia z endoskopii, IBD, hepatologii, pankreatologii.",
    h1: "Konferencje Gastroenterologiczne",
    intro: "Gastroenterologia zajmuje się diagnostyką i leczeniem chorób przewodu pokarmowego, wątroby, dróg żółciowych i trzustki.",
    topics: ["Endoskopia diagnostyczna i terapeutyczna", "IBD", "Hepatologia", "Pankreatologia", "Choroby refluksowe", "Nowotwory przewodu pokarmowego"],
    faqs: [
      { question: "Jakie kursy endoskopowe są dostępne?", answer: "Kursy gastroskopii, kolonoskopii, ECPW, EUS oraz technik terapeutycznych." }
    ],
    societies: ["Polskie Towarzystwo Gastroenterologii (PTG-E)", "UEG"],
    keywords: ["gastroenterologia", "endoskopia", "IBD", "hepatologia"]
  },
  pulmonology: {
    slug: "pulmonologia",
    name: "Pulmonologia",
    metaTitle: "Konferencje Pulmonologiczne 2025/2026 | Szkolenia Pneumonologia | Konfy.pl",
    metaDescription: "Konferencje pulmonologiczne w Polsce. Zjazdy PTChP, szkolenia z POChP, astmy, śródmiąższowych chorób płuc.",
    h1: "Konferencje Pulmonologiczne",
    intro: "Pulmonologia zajmuje się diagnostyką i leczeniem chorób układu oddechowego, w tym POChP, astmy i nowotworów płuc.",
    topics: ["POChP", "Astma", "Śródmiąższowe choroby płuc", "Rak płuca", "Gruźlica", "Bronchoskopia", "Spirometria"],
    faqs: [
      { question: "Jakie badania czynnościowe są szkolone?", answer: "Spirometria, pletyzmografia, dyfuzja gazów, testy wysiłkowe oraz polisomnografia." }
    ],
    societies: ["Polskie Towarzystwo Chorób Płuc (PTChP)", "ERS"],
    keywords: ["pulmonologia", "pneumonologia", "POChP", "astma", "bronchoskopia"]
  },
  endocrinology: {
    slug: "endokrynologia",
    name: "Endokrynologia",
    metaTitle: "Konferencje Endokrynologiczne 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje endokrynologiczne w Polsce. Zjazdy PTE, szkolenia z chorób tarczycy, cukrzycy, otyłości, osteoporozy.",
    h1: "Konferencje Endokrynologiczne",
    intro: "Endokrynologia zajmuje się diagnostyką i leczeniem chorób gruczołów wydzielania wewnętrznego i zaburzeń metabolicznych.",
    topics: ["Choroby tarczycy", "Cukrzyca", "Otyłość", "Osteoporoza", "Guzy przysadki", "Nadnercza", "Endokrynologia pediatryczna"],
    faqs: [
      { question: "Jakie są główne tematy konferencji endokrynologicznych?", answer: "Choroby tarczycy, nowe leki w cukrzycy, leczenie otyłości, terapia hormonalna." }
    ],
    societies: ["Polskie Towarzystwo Endokrynologiczne (PTE)", "ESE"],
    keywords: ["endokrynologia", "tarczyca", "cukrzyca", "otyłość"]
  },
  nephrology: {
    slug: "nefrologia",
    name: "Nefrologia",
    metaTitle: "Konferencje Nefrologiczne 2025/2026 | Szkolenia Nefrologia | Konfy.pl",
    metaDescription: "Konferencje nefrologiczne w Polsce. Zjazdy PTN, szkolenia z dializoterapii, transplantologii nerek, kłębuszkowych zapaleń.",
    h1: "Konferencje Nefrologiczne",
    intro: "Nefrologia zajmuje się diagnostyką i leczeniem chorób nerek, w tym przewlekłą chorobą nerek, dializoterapią i transplantacją.",
    topics: ["Przewlekła choroba nerek", "Dializoterapia", "Transplantacja nerek", "Kłębuszkowe zapalenia", "Ostra niewydolność nerek", "Nadciśnienie nerkowe"],
    faqs: [
      { question: "Jakie szkolenia z dializ są dostępne?", answer: "Kursy z hemodializy, dializy otrzewnowej, dostępów naczyniowych oraz opieki nad pacjentem dializowanym." }
    ],
    societies: ["Polskie Towarzystwo Nefrologiczne (PTN)", "ERA"],
    keywords: ["nefrologia", "dializy", "transplantacja nerek", "przewlekła choroba nerek"]
  },
  rheumatology: {
    slug: "reumatologia",
    name: "Reumatologia",
    metaTitle: "Konferencje Reumatologiczne 2025/2026 | Szkolenia Reumatologia | Konfy.pl",
    metaDescription: "Konferencje reumatologiczne w Polsce. Zjazdy PTR, szkolenia z RZS, tocznia, łuszczycowego zapalenia stawów, terapii biologicznych.",
    h1: "Konferencje Reumatologiczne",
    intro: "Reumatologia zajmuje się diagnostyką i leczeniem chorób układu ruchu o podłożu zapalnym, autoimmunologicznym i degeneracyjnym.",
    topics: ["RZS", "Toczeń rumieniowaty", "Łuszczycowe zapalenie stawów", "ZZSK", "Terapie biologiczne", "USG w reumatologii"],
    faqs: [
      { question: "Jakie nowe leki są omawiane na konferencjach?", answer: "Inhibitory JAK, leki biologiczne, biosymilary oraz terapie celowane." }
    ],
    societies: ["Polskie Towarzystwo Reumatologiczne (PTR)", "EULAR"],
    keywords: ["reumatologia", "RZS", "terapie biologiczne", "choroby autoimmunologiczne"]
  },
  hematology: {
    slug: "hematologia",
    name: "Hematologia",
    metaTitle: "Konferencje Hematologiczne 2025/2026 | Szkolenia Hematologia | Konfy.pl",
    metaDescription: "Konferencje hematologiczne w Polsce. Zjazdy PTHiT, szkolenia z białaczek, chłoniaków, szpiczaka, transplantologii.",
    h1: "Konferencje Hematologiczne",
    intro: "Hematologia zajmuje się diagnostyką i leczeniem chorób krwi i układu krwiotwórczego, w tym nowotworów hematologicznych.",
    topics: ["Białaczki", "Chłoniaki", "Szpiczak plazmocytowy", "Transplantacja szpiku", "Zaburzenia krzepnięcia", "Niedokrwistości"],
    faqs: [
      { question: "Jakie nowe terapie są prezentowane?", answer: "CAR-T, przeciwciała bispecyficzne, inhibitory kinaz, immunoterapia." }
    ],
    societies: ["Polskie Towarzystwo Hematologów i Transfuzjologów (PTHiT)", "EHA"],
    keywords: ["hematologia", "białaczki", "chłoniaki", "transplantacja szpiku"]
  },
  oncology: {
    slug: "onkologia",
    name: "Onkologia kliniczna",
    metaTitle: "Konferencje Onkologiczne 2025/2026 | Szkolenia Onkologia | Konfy.pl",
    metaDescription: "Konferencje onkologiczne w Polsce. Zjazdy PTO, ESMO, szkolenia z immunoterapii, terapii celowanych, onkologii klinicznej.",
    h1: "Konferencje i Szkolenia Onkologiczne",
    intro: "Onkologia kliniczna zajmuje się diagnostyką i systemowym leczeniem nowotworów. Dynamiczny rozwój immunoterapii i terapii celowanych.",
    topics: ["Immunoterapia", "Terapie celowane", "Chemioterapia", "Rak płuca", "Rak piersi", "Badania kliniczne", "Opieka paliatywna"],
    faqs: [
      { question: "Jakie są najważniejsze konferencje onkologiczne?", answer: "ASCO, ESMO Congress, Kongres PTO oraz sympozja subspecjalistyczne." }
    ],
    societies: ["Polskie Towarzystwo Onkologiczne (PTO)", "ESMO", "ASCO"],
    keywords: ["konferencje onkologiczne", "szkolenia onkologia", "immunoterapia", "ESMO"]
  },
  diabetology: {
    slug: "diabetologia",
    name: "Diabetologia",
    metaTitle: "Konferencje Diabetologiczne 2025/2026 | Szkolenia Diabetologia | Konfy.pl",
    metaDescription: "Konferencje diabetologiczne w Polsce. Zjazdy PTD, szkolenia z insulinoterapii, pomp insulinowych, CGM, powikłań cukrzycy.",
    h1: "Konferencje Diabetologiczne",
    intro: "Diabetologia zajmuje się diagnostyką i leczeniem cukrzycy oraz jej powikłań. Obejmuje nowoczesne technologie monitorowania i leczenia.",
    topics: ["Insulinoterapia", "Pompy insulinowe", "Systemy CGM", "Cukrzyca typu 2", "Powikłania cukrzycy", "Stopa cukrzycowa"],
    faqs: [
      { question: "Jakie nowe technologie są omawiane?", answer: "Systemy zamkniętej pętli, CGM, pompy hybrydowe oraz nowe leki inkretynowe." }
    ],
    societies: ["Polskie Towarzystwo Diabetologiczne (PTD)", "EASD"],
    keywords: ["diabetologia", "cukrzyca", "pompy insulinowe", "CGM"]
  },
  geriatrics: {
    slug: "geriatria",
    name: "Geriatria",
    metaTitle: "Konferencje Geriatryczne 2025/2026 | Szkolenia Geriatria | Konfy.pl",
    metaDescription: "Konferencje geriatryczne w Polsce. Szkolenia z wielochorobowości, zespołów geriatrycznych, opieki nad osobami starszymi.",
    h1: "Konferencje Geriatryczne",
    intro: "Geriatria zajmuje się kompleksową opieką nad osobami starszymi, uwzględniając wielochorobowość i zespoły geriatryczne.",
    topics: ["Wielochorobowość", "Zespoły geriatryczne", "Otępienia", "Upadki", "Polipragmazja", "Opieka długoterminowa"],
    faqs: [
      { question: "Jakie narzędzia oceny geriatrycznej są szkolone?", answer: "Całościowa ocena geriatryczna (COG), skale funkcjonalne, ocena ryzyka upadków." }
    ],
    societies: ["Polskie Towarzystwo Gerontologiczne", "EUGMS"],
    keywords: ["geriatria", "osoby starsze", "wielochorobowość", "zespoły geriatryczne"]
  },
  emergency_medicine: {
    slug: "medycyna-ratunkowa",
    name: "Medycyna ratunkowa",
    metaTitle: "Konferencje Medycyny Ratunkowej 2025/2026 | Szkolenia SOR | Konfy.pl",
    metaDescription: "Konferencje medycyny ratunkowej. Szkolenia ALS, ATLS, kursy USG w stanach nagłych, symulacje medyczne.",
    h1: "Konferencje Medycyny Ratunkowej",
    intro: "Medycyna ratunkowa zajmuje się diagnozą i leczeniem stanów nagłych zagrażających życiu. Obejmuje resuscytację, traumatologię i intensywną terapię.",
    topics: ["Resuscytacja (ALS/BLS)", "Trauma (ATLS)", "USG w stanach nagłych", "Toksykologia", "Symulacja medyczna"],
    faqs: [
      { question: "Jakie kursy są obowiązkowe na SOR?", answer: "ALS, ATLS to podstawowe kursy. Rekomendowane są też POCUS i symulacje." }
    ],
    societies: ["Polska Rada Resuscytacji", "EUSEM"],
    keywords: ["konferencje medycyna ratunkowa", "szkolenia SOR", "kurs ALS", "ATLS"]
  },
  anesthesiology: {
    slug: "anestezjologia",
    name: "Anestezjologia i intensywna terapia",
    metaTitle: "Konferencje Anestezjologiczne 2025/2026 | Szkolenia AIT | Konfy.pl",
    metaDescription: "Konferencje anestezjologiczne w Polsce. Zjazdy PTAiIT, szkolenia z intensywnej terapii, znieczulenia regionalnego, sedacji.",
    h1: "Konferencje Anestezjologii i Intensywnej Terapii",
    intro: "Anestezjologia i intensywna terapia zajmuje się znieczuleniem, leczeniem bólu oraz opieką nad pacjentami w stanie krytycznym.",
    topics: ["Znieczulenie ogólne", "Anestezja regionalna", "Intensywna terapia", "Sedacja proceduralna", "Leczenie bólu", "Wentylacja mechaniczna"],
    faqs: [
      { question: "Jakie kursy są wymagane w specjalizacji?", answer: "Kursy z resuscytacji (ALS), znieczulenia regionalnego, intensywnej terapii i leczenia bólu." }
    ],
    societies: ["PTAiIT", "ESA"],
    keywords: ["konferencje anestezjologiczne", "szkolenia AIT", "intensywna terapia", "znieczulenie regionalne"]
  },

  // === PSYCHIATRYCZNE ===
  psychiatry: {
    slug: "psychiatria",
    name: "Psychiatria",
    metaTitle: "Konferencje Psychiatryczne 2025/2026 | Szkolenia Psychiatria | Konfy.pl",
    metaDescription: "Konferencje psychiatryczne w Polsce. Zjazdy PTP, szkolenia z psychofarmakologii, leczenia depresji, schizofrenii.",
    h1: "Konferencje i Szkolenia Psychiatryczne",
    intro: "Psychiatria zajmuje się diagnostyką i leczeniem zaburzeń psychicznych - od depresji i lęku po schizofrenię i zaburzenia osobowości.",
    topics: ["Psychofarmakologia", "Depresja", "Schizofrenia", "Zaburzenia lękowe", "Zaburzenia osobowości", "Uzależnienia"],
    faqs: [
      { question: "Gdzie szkolić się z psychoterapii?", answer: "Szkolenia psychoterapeutyczne prowadzą ośrodki akredytowane przez PTP." }
    ],
    societies: ["Polskie Towarzystwo Psychiatryczne (PTP)", "EPA"],
    keywords: ["konferencje psychiatryczne", "szkolenia psychiatria", "psychofarmakologia", "depresja"]
  },
  child_psychiatry: {
    slug: "psychiatria-dziecieca",
    name: "Psychiatria dzieci i młodzieży",
    metaTitle: "Konferencje Psychiatrii Dziecięcej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje psychiatrii dzieci i młodzieży. Szkolenia z ADHD, autyzmu, zaburzeń lękowych u dzieci, depresji młodzieńczej.",
    h1: "Konferencje Psychiatrii Dzieci i Młodzieży",
    intro: "Psychiatria dzieci i młodzieży zajmuje się diagnostyką i leczeniem zaburzeń psychicznych od niemowlęctwa do dorosłości.",
    topics: ["ADHD", "Autyzm", "Zaburzenia lękowe u dzieci", "Depresja młodzieńcza", "Zaburzenia odżywiania", "Samookaleczenia"],
    faqs: [
      { question: "Jakie są najważniejsze szkolenia?", answer: "Diagnostyka i leczenie ADHD, spektrum autyzmu, terapia poznawczo-behawioralna dla dzieci." }
    ],
    societies: ["Sekcja Psychiatrii Dzieci i Młodzieży PTP", "ESCAP"],
    keywords: ["psychiatria dziecięca", "ADHD", "autyzm", "zaburzenia u dzieci"]
  },
  sexology: {
    slug: "seksuologia",
    name: "Seksuologia",
    metaTitle: "Konferencje Seksuologiczne 2025/2026 | Szkolenia Seksuologia | Konfy.pl",
    metaDescription: "Konferencje seksuologiczne w Polsce. Szkolenia z dysfunkcji seksualnych, terapii par, zaburzeń identyfikacji płciowej.",
    h1: "Konferencje Seksuologiczne",
    intro: "Seksuologia zajmuje się diagnostyką i leczeniem zaburzeń seksualnych oraz terapią par.",
    topics: ["Dysfunkcje seksualne", "Terapia par", "Zaburzenia identyfikacji płciowej", "Seksuologia sądowa", "Antykoncepcja"],
    faqs: [
      { question: "Jak zdobyć kwalifikacje seksuologa?", answer: "Poprzez specjalizację lub studia podyplomowe z seksuologii klinicznej." }
    ],
    societies: ["Polskie Towarzystwo Seksuologiczne (PTS)", "EFS"],
    keywords: ["seksuologia", "dysfunkcje seksualne", "terapia par"]
  },

  // === DIAGNOSTYCZNE ===
  radiology: {
    slug: "radiologia",
    name: "Radiologia i diagnostyka obrazowa",
    metaTitle: "Konferencje Radiologiczne 2025/2026 | Szkolenia Radiologia | Konfy.pl",
    metaDescription: "Konferencje radiologiczne i diagnostyki obrazowej. Zjazdy PLTR, szkolenia z TK, MRI, USG, radiologii interwencyjnej.",
    h1: "Konferencje Radiologii i Diagnostyki Obrazowej",
    intro: "Radiologia i diagnostyka obrazowa obejmuje RTG, TK, MRI, USG i diagnostykę obrazową. Rozwój AI w radiologii wymaga ciągłego kształcenia.",
    topics: ["Tomografia komputerowa", "Rezonans magnetyczny", "Ultrasonografia", "Radiologia interwencyjna", "AI w radiologii"],
    faqs: [
      { question: "Jak zdobyć certyfikat z USG?", answer: "Certyfikaty USG wydają towarzystwa naukowe po ukończeniu kursów i zdaniu egzaminu." }
    ],
    societies: ["PLTR", "ESR"],
    keywords: ["konferencje radiologiczne", "szkolenia radiologia", "TK MRI", "diagnostyka obrazowa"]
  },
  laboratory_medicine: {
    slug: "diagnostyka-laboratoryjna",
    name: "Medycyna laboratoryjna",
    metaTitle: "Konferencje Diagnostyki Laboratoryjnej 2025/2026 | Konfy.pl",
    metaDescription: "Konferencje diagnostyki laboratoryjnej. Zjazdy PTDL, szkolenia z biochemii, hematologii laboratoryjnej, mikrobiologii.",
    h1: "Konferencje Diagnostyki Laboratoryjnej",
    intro: "Medycyna laboratoryjna obejmuje badania biochemiczne, hematologiczne, mikrobiologiczne i molekularne.",
    topics: ["Biochemia kliniczna", "Hematologia laboratoryjna", "Mikrobiologia", "Diagnostyka molekularna", "Automatyzacja laboratoriów"],
    faqs: [
      { question: "Jakie certyfikaty są potrzebne?", answer: "Certyfikaty jakości laboratoriów (ISO 15189), szkolenia z nowych technologii." }
    ],
    societies: ["PTDL"],
    keywords: ["konferencje diagnostyka laboratoryjna", "szkolenia laboratorium", "biochemia kliniczna"]
  },
  pathology: {
    slug: "patomorfologia",
    name: "Patomorfologia",
    metaTitle: "Konferencje Patomorfologiczne 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje patomorfologiczne w Polsce. Szkolenia z histopatologii, cytologii, immunohistochemii, patologii molekularnej.",
    h1: "Konferencje Patomorfologiczne",
    intro: "Patomorfologia zajmuje się diagnostyką chorób na podstawie badania tkanek i komórek. Obejmuje histopatologię, cytologię i patologię molekularną.",
    topics: ["Histopatologia", "Cytologia", "Immunohistochemia", "Patologia molekularna", "Cyfrowa patologia", "Onkopatologia"],
    faqs: [
      { question: "Jakie nowe technologie są szkolone?", answer: "Cyfrowa patologia, sztuczna inteligencja w diagnostyce, sekwencjonowanie NGS." }
    ],
    societies: ["Polskie Towarzystwo Patologów", "ESP"],
    keywords: ["patomorfologia", "histopatologia", "patologia molekularna"]
  },
  nuclear_medicine: {
    slug: "medycyna-nuklearna",
    name: "Medycyna nuklearna",
    metaTitle: "Konferencje Medycyny Nuklearnej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje medycyny nuklearnej. Szkolenia z PET-CT, scyntygrafii, terapii radioizotopowej, teranostyki.",
    h1: "Konferencje Medycyny Nuklearnej",
    intro: "Medycyna nuklearna wykorzystuje radioizotopy do diagnostyki i leczenia. Obejmuje PET-CT, scyntygrafię i terapię radioizotopową.",
    topics: ["PET-CT", "Scyntygrafia", "Terapia radioizotopowa", "Teranostyka", "Radiofarmaceutyki"],
    faqs: [
      { question: "Jakie szkolenia z PET są dostępne?", answer: "Kursy interpretacji PET-CT w onkologii, kardiologii i neurologii." }
    ],
    societies: ["Polskie Towarzystwo Medycyny Nuklearnej", "EANM"],
    keywords: ["medycyna nuklearna", "PET-CT", "scyntygrafia", "terapia radioizotopowa"]
  },

  // === INNE SPECJALIZACJE ===
  dermatology: {
    slug: "dermatologia",
    name: "Dermatologia i wenerologia",
    metaTitle: "Konferencje Dermatologiczne 2025/2026 | Szkolenia Dermatologia | Konfy.pl",
    metaDescription: "Konferencje dermatologiczne w Polsce. Zjazdy PTD, szkolenia z dermatoskopii, chorób autoimmunologicznych skóry.",
    h1: "Konferencje i Szkolenia Dermatologiczne",
    intro: "Dermatologia i wenerologia zajmuje się diagnostyką i leczeniem chorób skóry, włosów, paznokci oraz chorób przenoszonych drogą płciową.",
    topics: ["Dermatoskopia", "Łuszczyca", "AZS", "Dermatologia estetyczna", "Choroby autoimmunologiczne skóry", "Dermatoonkologia", "Wenerologia"],
    faqs: [
      { question: "Jakie certyfikaty są ważne?", answer: "Certyfikat dermatoskopii, szkolenia z medycyny estetycznej, terapie biologiczne." }
    ],
    societies: ["PTD", "EADV"],
    keywords: ["konferencje dermatologiczne", "szkolenia dermatologia", "dermatoskopia"]
  },
  allergology: {
    slug: "alergologia",
    name: "Alergologia",
    metaTitle: "Konferencje Alergologiczne 2025/2026 | Szkolenia Alergologia | Konfy.pl",
    metaDescription: "Konferencje alergologiczne w Polsce. Zjazdy PTA, szkolenia z astmy alergicznej, immunoterapii, alergii pokarmowych.",
    h1: "Konferencje Alergologiczne",
    intro: "Alergologia zajmuje się diagnostyką i leczeniem chorób alergicznych, w tym astmy, alergicznego nieżytu nosa i alergii pokarmowych.",
    topics: ["Astma alergiczna", "Alergiczny nieżyt nosa", "Alergie pokarmowe", "Immunoterapia swoista", "Atopowe zapalenie skóry", "Anafilaksja"],
    faqs: [
      { question: "Jakie testy alergiczne są szkolone?", answer: "Testy skórne, testy prowokacyjne, diagnostyka molekularna alergii." }
    ],
    societies: ["Polskie Towarzystwo Alergologiczne (PTA)", "EAACI"],
    keywords: ["alergologia", "astma alergiczna", "immunoterapia", "alergie pokarmowe"]
  },
  infectious_diseases: {
    slug: "choroby-zakazne",
    name: "Choroby zakaźne",
    metaTitle: "Konferencje Chorób Zakaźnych 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje chorób zakaźnych w Polsce. Szkolenia z antybiotykoterapii, HIV, wirusowych zapaleń wątroby, infekcji szpitalnych.",
    h1: "Konferencje Chorób Zakaźnych",
    intro: "Choroby zakaźne to specjalność zajmująca się diagnostyką i leczeniem infekcji bakteryjnych, wirusowych, grzybiczych i pasożytniczych.",
    topics: ["Antybiotykoterapia", "HIV/AIDS", "Wirusowe zapalenia wątroby", "Infekcje szpitalne", "Szczepienia", "Choroby tropikalne"],
    faqs: [
      { question: "Jakie są najważniejsze szkolenia?", answer: "Antybiotykoterapia empiryczna, leczenie HIV, profilaktyka zakażeń szpitalnych." }
    ],
    societies: ["Polskie Towarzystwo Epidemiologów i Lekarzy Chorób Zakaźnych", "ESCMID"],
    keywords: ["choroby zakaźne", "antybiotykoterapia", "HIV", "infekcje szpitalne"]
  },
  occupational_medicine: {
    slug: "medycyna-pracy",
    name: "Medycyna pracy",
    metaTitle: "Konferencje Medycyny Pracy 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje medycyny pracy w Polsce. Szkolenia z badań profilaktycznych, orzecznictwa, chorób zawodowych.",
    h1: "Konferencje Medycyny Pracy",
    intro: "Medycyna pracy zajmuje się ochroną zdrowia pracowników, badaniami profilaktycznymi i orzecznictwem o zdolności do pracy.",
    topics: ["Badania profilaktyczne", "Choroby zawodowe", "Orzecznictwo", "Ergonomia", "Czynniki szkodliwe", "Psychologia pracy"],
    faqs: [
      { question: "Jakie uprawnienia są potrzebne?", answer: "Specjalizacja z medycyny pracy lub kursy kwalifikacyjne dla lekarzy uprawnionych." }
    ],
    societies: ["Polskie Towarzystwo Medycyny Pracy", "EASOM"],
    keywords: ["medycyna pracy", "badania profilaktyczne", "choroby zawodowe"]
  },
  sports_medicine: {
    slug: "medycyna-sportowa",
    name: "Medycyna sportowa",
    metaTitle: "Konferencje Medycyny Sportowej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje medycyny sportowej w Polsce. Szkolenia z urazów sportowych, wydolności, doping, żywienie sportowców.",
    h1: "Konferencje Medycyny Sportowej",
    intro: "Medycyna sportowa zajmuje się zdrowiem sportowców, profilaktyką i leczeniem urazów oraz optymalizacją wydolności.",
    topics: ["Urazy sportowe", "Wydolność fizyczna", "Kardiologia sportowa", "Antydoping", "Żywienie sportowców", "Rehabilitacja sportowa"],
    faqs: [
      { question: "Jakie certyfikaty są przydatne?", answer: "Orzecznictwo sportowo-lekarskie, kursy USG układu ruchu, fizjoterapia sportowa." }
    ],
    societies: ["Polskie Towarzystwo Medycyny Sportowej", "FIMS"],
    keywords: ["medycyna sportowa", "urazy sportowe", "wydolność", "sport"]
  },
  palliative_medicine: {
    slug: "medycyna-paliatywna",
    name: "Medycyna paliatywna",
    metaTitle: "Konferencje Medycyny Paliatywnej 2025/2026 | Szkolenia | Konfy.pl",
    metaDescription: "Konferencje medycyny paliatywnej w Polsce. Szkolenia z leczenia bólu, opieki u schyłku życia, komunikacji z rodziną.",
    h1: "Konferencje Medycyny Paliatywnej",
    intro: "Medycyna paliatywna zajmuje się kompleksową opieką nad pacjentami z nieuleczalnymi chorobami, leczeniem bólu i wsparciem psychologicznym.",
    topics: ["Leczenie bólu", "Opieka u schyłku życia", "Wsparcie psychologiczne", "Komunikacja z rodziną", "Opieka hospicyjna", "Sedacja paliatywna"],
    faqs: [
      { question: "Jakie szkolenia są wymagane?", answer: "Kursy z leczenia bólu, komunikacji z pacjentem i rodziną, aspekty prawne i etyczne." }
    ],
    societies: ["Polskie Towarzystwo Medycyny Paliatywnej", "EAPC"],
    keywords: ["medycyna paliatywna", "leczenie bólu", "opieka hospicyjna"]
  },
  rehabilitation: {
    slug: "rehabilitacja",
    name: "Rehabilitacja medyczna",
    metaTitle: "Konferencje Rehabilitacyjne 2025/2026 | Szkolenia Rehabilitacja | Konfy.pl",
    metaDescription: "Konferencje rehabilitacji medycznej w Polsce. Szkolenia z rehabilitacji neurologicznej, kardiologicznej, ortopedycznej.",
    h1: "Konferencje Rehabilitacji Medycznej",
    intro: "Rehabilitacja medyczna zajmuje się przywracaniem sprawności funkcjonalnej pacjentom po urazach, operacjach i chorobach.",
    topics: ["Rehabilitacja neurologiczna", "Rehabilitacja kardiologiczna", "Rehabilitacja ortopedyczna", "Rehabilitacja pulmonologiczna", "Fizykoterapia", "Zaopatrzenie ortopedyczne"],
    faqs: [
      { question: "Jakie kursy praktyczne są dostępne?", answer: "Metody NDT-Bobath, PNF, terapia manualna, rehabilitacja oddechowa." }
    ],
    societies: ["Polskie Towarzystwo Rehabilitacji", "UEMS-PRM"],
    keywords: ["rehabilitacja medyczna", "fizjoterapia", "rehabilitacja neurologiczna"]
  },

  // === KATEGORIA OGÓLNA ===
  interdisciplinary: {
    slug: "interdyscyplinarne",
    name: "Interdyscyplinarne",
    metaTitle: "Konferencje Interdyscyplinarne 2025/2026 | Szkolenia Medyczne | Konfy.pl",
    metaDescription: "Konferencje interdyscyplinarne dla wszystkich specjalności medycznych. Szkolenia z komunikacji, prawa medycznego, zarządzania.",
    h1: "Konferencje Interdyscyplinarne",
    intro: "Szkolenia interdyscyplinarne obejmują tematy wspólne dla wszystkich specjalności: komunikację, prawo medyczne, zarządzanie, etykę i nowe technologie.",
    topics: ["Komunikacja lekarz-pacjent", "Prawo medyczne", "Zarządzanie w ochronie zdrowia", "E-zdrowie", "Etyka medyczna", "AI w medycynie"],
    faqs: [
      { question: "Czy szkolenia miękkie dają punkty edukacyjne?", answer: "Tak, akredytowane szkolenia z komunikacji, prawa i zarządzania przyznają punkty edukacyjne." }
    ],
    societies: ["Naczelna Izba Lekarska"],
    keywords: ["konferencje interdyscyplinarne", "szkolenia lekarskie", "prawo medyczne", "komunikacja"]
  }
};

export const PILLAR_PAGES = {
  conferences: {
    slug: "konferencje-medyczne",
    metaTitle: "Konferencje Medyczne w Polsce 2025/2026 | Kalendarz Kongresów | Konfy.pl",
    metaDescription: "Wszystkie konferencje medyczne w Polsce. Kongresy, zjazdy towarzystw naukowych, sympozja z punktami edukacyjnymi.",
    h1: "Konferencje Medyczne w Polsce",
    eventType: "conference"
  },
  webinars: {
    slug: "webinary-medyczne",
    metaTitle: "Webinary Medyczne z Punktami Edukacyjnymi 2025/2026 | Konfy.pl",
    metaDescription: "Webinary medyczne online dla lekarzy. Szkolenia z punktami edukacyjnymi, wykłady ekspertów.",
    h1: "Webinary Medyczne",
    eventType: "webinar"
  },
  trainings: {
    slug: "szkolenia-medyczne",
    metaTitle: "Szkolenia Medyczne i Warsztaty 2025/2026 | Kursy dla Lekarzy | Konfy.pl",
    metaDescription: "Szkolenia medyczne i warsztaty praktyczne dla lekarzy. Kursy specjalistyczne, szkolenia USG, symulacje.",
    h1: "Szkolenia Medyczne i Warsztaty",
    eventType: "workshop"
  },
  calendar: {
    slug: "kalendarz-konferencji-medycznych",
    metaTitle: "Kalendarz Konferencji Medycznych 2025/2026 | Terminarz Wydarzeń | Konfy.pl",
    metaDescription: "Kalendarz konferencji medycznych w Polsce. Terminarz kongresów, zjazdów i szkoleń dla lekarzy wszystkich specjalności.",
    h1: "Kalendarz Konferencji Medycznych 2025/2026",
    eventType: null
  }
};
