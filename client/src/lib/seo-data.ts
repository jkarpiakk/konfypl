import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@shared/schema";

export const SPECIALIZATION_SLUGS: Record<typeof SPECIALIZATIONS[number], string> = {
  cardiology: "kardiologia",
  family_medicine: "medycyna-rodzinna",
  internal_medicine: "interna",
  anesthesiology: "anestezjologia",
  surgery: "chirurgia",
  orthopedics: "ortopedia",
  gynecology: "ginekologia",
  pediatrics: "pediatria",
  neurology: "neurologia",
  psychiatry: "psychiatria",
  radiology: "radiologia",
  emergency_medicine: "medycyna-ratunkowa",
  laboratory_diagnostics: "diagnostyka-laboratoryjna",
  interdisciplinary: "interdyscyplinarne",
  dentistry: "stomatologia",
  dermatology: "dermatologia",
  ophthalmology: "okulistyka",
  oncology: "onkologia",
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
  cardiology: {
    slug: "kardiologia",
    name: "Kardiologia",
    metaTitle: "Konferencje Kardiologiczne 2025/2026 | Szkolenia dla Kardiologów | Konfy.pl",
    metaDescription: "Konferencje kardiologiczne w Polsce. Zjazdy PTK, ESC Congress, webinary z punktami edukacyjnymi. Znajdź szkolenia z niewydolności serca, arytmii, kardiologii interwencyjnej.",
    h1: "Konferencje i Szkolenia Kardiologiczne",
    intro: "Kardiologia to dziedzina medycyny zajmująca się diagnostyką i leczeniem chorób serca i układu krążenia. Lekarze kardiolodzy muszą stale aktualizować wiedzę o nowych wytycznych ESC, PTK oraz najnowszych metodach leczenia niewydolności serca, arytmii i choroby wieńcowej.",
    topics: ["Niewydolność serca", "Arytmie i elektrofizjologia", "Kardiologia interwencyjna", "Choroba wieńcowa", "Wady zastawkowe", "Nadciśnienie tętnicze", "Echokardiografia", "Prewencja chorób sercowo-naczyniowych"],
    faqs: [
      { question: "Ile punktów edukacyjnych potrzebuję jako kardiolog?", answer: "Kardiolodzy w Polsce muszą zdobyć 200 punktów edukacyjnych w 4-letnim okresie rozliczeniowym. Konferencje PTK i ESC oferują od 10 do 30 punktów." },
      { question: "Które konferencje kardiologiczne są najważniejsze?", answer: "Najważniejsze to Kongres PTK, ESC Congress, EHRA Congress oraz liczne sympozja regionalne. Warto też śledzić webinary z nowymi wytycznymi." },
      { question: "Czy webinary kardiologiczne dają punkty edukacyjne?", answer: "Tak, akredytowane webinary organizowane przez PTK i inne towarzystwa naukowe przyznają punkty edukacyjne potwierdzone certyfikatem." }
    ],
    societies: ["Polskie Towarzystwo Kardiologiczne (PTK)", "European Society of Cardiology (ESC)", "Heart Failure Association (HFA)"],
    keywords: ["konferencje kardiologiczne", "szkolenia kardiologia", "kongres PTK", "ESC Congress", "punkty edukacyjne kardiologia"]
  },
  family_medicine: {
    slug: "medycyna-rodzinna",
    name: "Medycyna Rodzinna",
    metaTitle: "Konferencje Medycyny Rodzinnej 2025/2026 | Szkolenia POZ | Konfy.pl",
    metaDescription: "Konferencje i szkolenia dla lekarzy rodzinnych. Webinary POZ z punktami edukacyjnymi. Aktualne wytyczne, diagnostyka, farmakoterapia w medycynie rodzinnej.",
    h1: "Konferencje i Szkolenia Medycyny Rodzinnej",
    intro: "Medycyna rodzinna to podstawowa opieka zdrowotna obejmująca całościowe podejście do pacjenta. Lekarze rodzinni zajmują się profilaktyką, diagnostyką i leczeniem najczęstszych chorób, koordynują opiekę i kierują do specjalistów.",
    topics: ["Diagnostyka w POZ", "Farmakoterapia", "Profilaktyka", "Choroby przewlekłe", "Pediatria w POZ", "Geriatria", "USG w gabinecie", "Telemedycyna"],
    faqs: [
      { question: "Jakie szkolenia są obowiązkowe dla lekarza POZ?", answer: "Lekarze POZ muszą zdobywać punkty edukacyjne jak każdy specjalista. Polecane są szkolenia z diagnostyki, farmakoterapii i nowych wytycznych." },
      { question: "Czy są bezpłatne webinary dla lekarzy rodzinnych?", answer: "Tak, wiele towarzystw i firm farmaceutycznych organizuje bezpłatne webinary z punktami edukacyjnymi dla lekarzy POZ." }
    ],
    societies: ["Kolegium Lekarzy Rodzinnych w Polsce", "Polskie Towarzystwo Medycyny Rodzinnej"],
    keywords: ["konferencje medycyna rodzinna", "szkolenia POZ", "webinary dla lekarzy rodzinnych", "punkty edukacyjne POZ"]
  },
  internal_medicine: {
    slug: "interna",
    name: "Interna",
    metaTitle: "Konferencje Internistyczne 2025/2026 | Szkolenia Interna | Konfy.pl",
    metaDescription: "Konferencje i szkolenia z interny. Kongresy PTIM, webinary internistyczne z punktami. Diagnostyka różnicowa, choroby wewnętrzne, farmakoterapia.",
    h1: "Konferencje i Szkolenia Internistyczne",
    intro: "Interna (choroby wewnętrzne) to szeroka dziedzina obejmująca diagnostykę i leczenie chorób narządów wewnętrznych. Interniści specjalizują się w kompleksowym podejściu do pacjenta z wielochorobowością.",
    topics: ["Diagnostyka różnicowa", "Wielochorobowość", "Farmakoterapia", "Choroby metaboliczne", "Choroby autoimmunologiczne", "Infekcje", "Ostra interna"],
    faqs: [
      { question: "Czym różni się interna od medycyny rodzinnej?", answer: "Interna koncentruje się na diagnostyce i leczeniu chorób wewnętrznych, często w warunkach szpitalnych, podczas gdy medycyna rodzinna obejmuje całościową opiekę ambulatoryjną." }
    ],
    societies: ["Polskie Towarzystwo Internistów (PTIM)", "European Federation of Internal Medicine"],
    keywords: ["konferencje internistyczne", "szkolenia interna", "kongres PTIM", "choroby wewnętrzne"]
  },
  anesthesiology: {
    slug: "anestezjologia",
    name: "Anestezjologia i Intensywna Terapia",
    metaTitle: "Konferencje Anestezjologiczne 2025/2026 | Szkolenia AIT | Konfy.pl",
    metaDescription: "Konferencje anestezjologiczne w Polsce. Zjazdy PTAiIT, szkolenia z intensywnej terapii, znieczulenia regionalnego, sedacji proceduralnej.",
    h1: "Konferencje Anestezjologii i Intensywnej Terapii",
    intro: "Anestezjologia i intensywna terapia to specjalność zajmująca się znieczuleniem, leczeniem bólu oraz opieką nad pacjentami w stanie krytycznym. Dynamiczny rozwój wymaga ciągłego kształcenia.",
    topics: ["Znieczulenie ogólne", "Anestezja regionalna", "Intensywna terapia", "Sedacja proceduralna", "Leczenie bólu", "Wentylacja mechaniczna", "Monitorowanie hemodynamiczne"],
    faqs: [
      { question: "Jakie kursy są wymagane w specjalizacji z anestezjologii?", answer: "Program specjalizacji wymaga kursów z resuscytacji (ALS), znieczulenia regionalnego, intensywnej terapii i leczenia bólu." }
    ],
    societies: ["Polskie Towarzystwo Anestezjologii i Intensywnej Terapii (PTAiIT)", "European Society of Anaesthesiology (ESA)"],
    keywords: ["konferencje anestezjologiczne", "szkolenia AIT", "intensywna terapia", "znieczulenie regionalne"]
  },
  surgery: {
    slug: "chirurgia",
    name: "Chirurgia",
    metaTitle: "Konferencje Chirurgiczne 2025/2026 | Szkolenia dla Chirurgów | Konfy.pl",
    metaDescription: "Konferencje chirurgiczne w Polsce. Kongresy TCzP, ESCP, warsztaty laparoskopowe, szkolenia z chirurgii onkologicznej i minimalnie inwazyjnej.",
    h1: "Konferencje i Szkolenia Chirurgiczne",
    intro: "Chirurgia ogólna obejmuje operacyjne leczenie chorób jamy brzusznej, gruczołów, naczyń i tkanek miękkich. Rozwój technik minimalnie inwazyjnych wymaga ciągłego doskonalenia umiejętności.",
    topics: ["Chirurgia laparoskopowa", "Chirurgia onkologiczna", "Chirurgia bariatryczna", "Chirurgia naczyniowa", "Chirurgia endokrynologiczna", "Chirurgia jednego dnia"],
    faqs: [
      { question: "Gdzie odbywają się warsztaty laparoskopowe?", answer: "Warsztaty laparoskopowe organizowane są przez centra szkoleniowe w Warszawie, Krakowie, Poznaniu i innych miastach, często przy kongresach chirurgicznych." }
    ],
    societies: ["Towarzystwo Chirurgów Polskich (TChP)", "European Society of Coloproctology (ESCP)"],
    keywords: ["konferencje chirurgiczne", "szkolenia chirurgia", "warsztaty laparoskopowe", "kongres chirurgów"]
  },
  orthopedics: {
    slug: "ortopedia",
    name: "Ortopedia",
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
    name: "Ginekologia i Położnictwo",
    metaTitle: "Konferencje Ginekologiczne 2025/2026 | Szkolenia Położnictwo | Konfy.pl",
    metaDescription: "Konferencje ginekologiczne i położnicze. Zjazdy PTG, szkolenia z USG położniczego, ginekologii onkologicznej, endokrynologii ginekologicznej.",
    h1: "Konferencje Ginekologii i Położnictwa",
    intro: "Ginekologia i położnictwo obejmuje opiekę nad kobietą w ciąży i połogu oraz diagnostykę i leczenie chorób układu rozrodczego. Specjalność wymaga wiedzy z onkologii, endokrynologii i perinatologii.",
    topics: ["USG położnicze", "Ginekologia onkologiczna", "Endokrynologia ginekologiczna", "Perinatologia", "Uroginekologia", "Rozrodczość"],
    faqs: [
      { question: "Które certyfikaty USG są wymagane w ginekologii?", answer: "Certyfikaty FMF, PTG oraz kursy USG położniczego I, II i III trymestru są standardem w specjalizacji." }
    ],
    societies: ["Polskie Towarzystwo Ginekologów i Położników (PTGiP)", "ISUOG"],
    keywords: ["konferencje ginekologiczne", "szkolenia położnictwo", "USG położnicze", "ginekologia onkologiczna"]
  },
  pediatrics: {
    slug: "pediatria",
    name: "Pediatria",
    metaTitle: "Konferencje Pediatryczne 2025/2026 | Szkolenia dla Pediatrów | Konfy.pl",
    metaDescription: "Konferencje pediatryczne w Polsce. Zjazdy PTP, szkolenia z neonatologii, alergologii dziecięcej, gastroenterologii pediatrycznej.",
    h1: "Konferencje i Szkolenia Pediatryczne",
    intro: "Pediatria zajmuje się zdrowiem dzieci od urodzenia do dorosłości. Obejmuje profilaktykę, diagnostykę i leczenie chorób wieku dziecięcego oraz nadzór nad rozwojem.",
    topics: ["Neonatologia", "Pediatria ogólna", "Alergologia dziecięca", "Gastroenterologia pediatryczna", "Kardiologia dziecięca", "Szczepienia"],
    faqs: [
      { question: "Jakie są najważniejsze konferencje pediatryczne?", answer: "Kongres PTP, konferencje regionalne oraz szkolenia subspecjalistyczne z neonatologii, alergologii i gastroenterologii dziecięcej." }
    ],
    societies: ["Polskie Towarzystwo Pediatryczne (PTP)", "European Academy of Paediatrics"],
    keywords: ["konferencje pediatryczne", "szkolenia pediatria", "neonatologia", "alergologia dziecięca"]
  },
  neurology: {
    slug: "neurologia",
    name: "Neurologia",
    metaTitle: "Konferencje Neurologiczne 2025/2026 | Szkolenia Neurologia | Konfy.pl",
    metaDescription: "Konferencje neurologiczne w Polsce. Zjazdy PTN, szkolenia z udarów, stwardnienia rozsianego, padaczki, bólów głowy.",
    h1: "Konferencje i Szkolenia Neurologiczne",
    intro: "Neurologia zajmuje się diagnostyką i leczeniem chorób układu nerwowego - mózgu, rdzenia kręgowego i nerwów obwodowych. Obejmuje udary, SM, padaczkę i choroby neurodegeneracyjne.",
    topics: ["Udary mózgu", "Stwardnienie rozsiane", "Padaczka", "Bóle głowy", "Choroby neurodegeneracyjne", "Neuroimmunologia"],
    faqs: [
      { question: "Jakie nowe terapie w neurologii warto poznać?", answer: "Terapie biologiczne w SM, trombektomia w udarach, nowe leki w migrenie (anty-CGRP) - to tematy najczęściej omawiane na konferencjach." }
    ],
    societies: ["Polskie Towarzystwo Neurologiczne (PTN)", "European Academy of Neurology (EAN)"],
    keywords: ["konferencje neurologiczne", "szkolenia neurologia", "udary mózgu", "stwardnienie rozsiane"]
  },
  psychiatry: {
    slug: "psychiatria",
    name: "Psychiatria",
    metaTitle: "Konferencje Psychiatryczne 2025/2026 | Szkolenia Psychiatria | Konfy.pl",
    metaDescription: "Konferencje psychiatryczne w Polsce. Zjazdy PTP, szkolenia z psychofarmakologii, psychiatrii dzieci i młodzieży, leczenia uzależnień.",
    h1: "Konferencje i Szkolenia Psychiatryczne",
    intro: "Psychiatria zajmuje się diagnostyką i leczeniem zaburzeń psychicznych - od depresji i lęku po schizofrenię i zaburzenia osobowości. Obejmuje psychofarmakologię i psychoterapię.",
    topics: ["Psychofarmakologia", "Depresja", "Schizofrenia", "Zaburzenia lękowe", "Psychiatria dzieci i młodzieży", "Uzależnienia"],
    faqs: [
      { question: "Gdzie szkolić się z psychoterapii?", answer: "Szkolenia psychoterapeutyczne prowadzą ośrodki akredytowane przez PTP, trwają kilka lat i obejmują teorię, superwizję i praktykę." }
    ],
    societies: ["Polskie Towarzystwo Psychiatryczne (PTP)", "European Psychiatric Association (EPA)"],
    keywords: ["konferencje psychiatryczne", "szkolenia psychiatria", "psychofarmakologia", "psychiatria dziecięca"]
  },
  radiology: {
    slug: "radiologia",
    name: "Radiologia",
    metaTitle: "Konferencje Radiologiczne 2025/2026 | Szkolenia Radiologia | Konfy.pl",
    metaDescription: "Konferencje radiologiczne i diagnostyki obrazowej. Zjazdy PLTR, szkolenia z TK, MRI, USG, radiologii interwencyjnej.",
    h1: "Konferencje Radiologii i Diagnostyki Obrazowej",
    intro: "Radiologia i diagnostyka obrazowa obejmuje RTG, TK, MRI, USG i diagnostykę obrazową w różnych specjalnościach. Rozwój AI w radiologii wymaga ciągłego kształcenia.",
    topics: ["Tomografia komputerowa", "Rezonans magnetyczny", "Ultrasonografia", "Radiologia interwencyjna", "AI w radiologii"],
    faqs: [
      { question: "Jak zdobyć certyfikat z USG?", answer: "Certyfikaty USG wydają towarzystwa naukowe (PTU, PLTR) po ukończeniu kursów i zdaniu egzaminu praktycznego." }
    ],
    societies: ["Polskie Lekarskie Towarzystwo Radiologiczne (PLTR)", "European Society of Radiology (ESR)"],
    keywords: ["konferencje radiologiczne", "szkolenia radiologia", "TK MRI", "diagnostyka obrazowa"]
  },
  emergency_medicine: {
    slug: "medycyna-ratunkowa",
    name: "Medycyna Ratunkowa",
    metaTitle: "Konferencje Medycyny Ratunkowej 2025/2026 | Szkolenia SOR | Konfy.pl",
    metaDescription: "Konferencje medycyny ratunkowej. Szkolenia ALS, ATLS, kursy USG w stanach nagłych, symulacje medyczne.",
    h1: "Konferencje Medycyny Ratunkowej",
    intro: "Medycyna ratunkowa zajmuje się diagnozą i leczeniem stanów nagłych zagrażających życiu. Obejmuje resuscytację, traumatologię i intensywną terapię przedszpitalną.",
    topics: ["Resuscytacja (ALS/BLS)", "Trauma (ATLS)", "USG w stanach nagłych", "Toksykologia", "Symulacja medyczna"],
    faqs: [
      { question: "Jakie kursy są obowiązkowe na SOR?", answer: "ALS (Advanced Life Support), ATLS (Advanced Trauma Life Support) to podstawowe kursy. Rekomendowane są też POCUS i symulacje." }
    ],
    societies: ["Polska Rada Resuscytacji", "European Society for Emergency Medicine (EUSEM)"],
    keywords: ["konferencje medycyna ratunkowa", "szkolenia SOR", "kurs ALS", "ATLS"]
  },
  laboratory_diagnostics: {
    slug: "diagnostyka-laboratoryjna",
    name: "Diagnostyka Laboratoryjna",
    metaTitle: "Konferencje Diagnostyki Laboratoryjnej 2025/2026 | Konfy.pl",
    metaDescription: "Konferencje diagnostyki laboratoryjnej. Zjazdy PTDL, szkolenia z biochemii, hematologii laboratoryjnej, mikrobiologii.",
    h1: "Konferencje Diagnostyki Laboratoryjnej",
    intro: "Diagnostyka laboratoryjna obejmuje badania biochemiczne, hematologiczne, mikrobiologiczne i molekularne. Dynamiczny rozwój technologii wymaga ciągłego kształcenia.",
    topics: ["Biochemia kliniczna", "Hematologia laboratoryjna", "Mikrobiologia", "Diagnostyka molekularna", "Automatyzacja laboratoriów"],
    faqs: [
      { question: "Jakie certyfikaty są potrzebne diagnoście laboratoryjnemu?", answer: "Certyfikaty jakości laboratoriów (ISO 15189), szkolenia z nowych technologii i aktualizacje wiedzy specjalistycznej." }
    ],
    societies: ["Polskie Towarzystwo Diagnostyki Laboratoryjnej (PTDL)"],
    keywords: ["konferencje diagnostyka laboratoryjna", "szkolenia laboratorium", "biochemia kliniczna"]
  },
  interdisciplinary: {
    slug: "interdyscyplinarne",
    name: "Interdyscyplinarne",
    metaTitle: "Konferencje Interdyscyplinarne 2025/2026 | Szkolenia Medyczne | Konfy.pl",
    metaDescription: "Konferencje interdyscyplinarne dla wszystkich specjalności medycznych. Szkolenia z komunikacji, prawa medycznego, zarządzania.",
    h1: "Konferencje Interdyscyplinarne",
    intro: "Szkolenia interdyscyplinarne obejmują tematy wspólne dla wszystkich specjalności: komunikację z pacjentem, prawo medyczne, zarządzanie, etykę i nowe technologie w medycynie.",
    topics: ["Komunikacja lekarz-pacjent", "Prawo medyczne", "Zarządzanie w ochronie zdrowia", "E-zdrowie i telemedycyna", "Etyka medyczna"],
    faqs: [
      { question: "Czy szkolenia miękkie dają punkty edukacyjne?", answer: "Tak, akredytowane szkolenia z komunikacji, prawa medycznego i zarządzania przyznają punkty edukacyjne." }
    ],
    societies: ["Naczelna Izba Lekarska", "Polskie Towarzystwo Medycyny Rodzinnej"],
    keywords: ["konferencje interdyscyplinarne", "szkolenia lekarskie", "prawo medyczne", "komunikacja"]
  },
  dentistry: {
    slug: "stomatologia",
    name: "Stomatologia",
    metaTitle: "Konferencje Stomatologiczne 2025/2026 | Szkolenia dla Dentystów | Konfy.pl",
    metaDescription: "Konferencje stomatologiczne w Polsce. Zjazdy PTS, szkolenia z implantologii, endodoncji, ortodoncji, stomatologii estetycznej.",
    h1: "Konferencje i Szkolenia Stomatologiczne",
    intro: "Stomatologia obejmuje diagnostykę i leczenie chorób jamy ustnej, zębów i przyzębia. Dynamiczny rozwój implantologii, endodoncji i stomatologii estetycznej wymaga ciągłego kształcenia.",
    topics: ["Implantologia", "Endodoncja", "Ortodoncja", "Stomatologia estetyczna", "Periodontologia", "Protetyka stomatologiczna", "Chirurgia stomatologiczna"],
    faqs: [
      { question: "Jakie kursy są najważniejsze dla stomatologa?", answer: "Szkolenia z implantologii, endodoncji mikroskopowej, stomatologii cyfrowej CAD/CAM oraz periodontologii cieszą się największą popularnością." },
      { question: "Czy dentyści muszą zdobywać punkty edukacyjne?", answer: "Tak, lekarze dentyści podlegają obowiązkowi kształcenia ustawicznego i muszą zdobywać punkty edukacyjne jak lekarze innych specjalności." }
    ],
    societies: ["Polskie Towarzystwo Stomatologiczne (PTS)", "European Federation of Periodontology (EFP)", "Polish Society of Implantology"],
    keywords: ["konferencje stomatologiczne", "szkolenia dentystyczne", "implantologia", "endodoncja", "ortodoncja"]
  },
  dermatology: {
    slug: "dermatologia",
    name: "Dermatologia",
    metaTitle: "Konferencje Dermatologiczne 2025/2026 | Szkolenia Dermatologia | Konfy.pl",
    metaDescription: "Konferencje dermatologiczne w Polsce. Zjazdy PTD, szkolenia z dermatoskopii, dermatologii estetycznej, chorób autoimmunologicznych skóry.",
    h1: "Konferencje i Szkolenia Dermatologiczne",
    intro: "Dermatologia zajmuje się diagnostyką i leczeniem chorób skóry, włosów i paznokci. Obejmuje dermatoskopię, leczenie łuszczycy, AZS, chorób autoimmunologicznych oraz dermatologię estetyczną.",
    topics: ["Dermatoskopia", "Łuszczyca", "Atopowe zapalenie skóry", "Dermatologia estetyczna", "Choroby autoimmunologiczne skóry", "Dermatochirurgia", "Dermatoonkologia"],
    faqs: [
      { question: "Jakie certyfikaty są ważne w dermatologii?", answer: "Certyfikat dermatoskopii, szkolenia z medycyny estetycznej oraz kursy z terapii biologicznych w chorobach zapalnych skóry." },
      { question: "Gdzie szkolić się z dermatoskopii?", answer: "Kursy dermatoskopii organizują PTD, międzynarodowe towarzystwa oraz prywatne centra szkoleniowe z certyfikatem." }
    ],
    societies: ["Polskie Towarzystwo Dermatologiczne (PTD)", "European Academy of Dermatology and Venereology (EADV)"],
    keywords: ["konferencje dermatologiczne", "szkolenia dermatologia", "dermatoskopia", "dermatologia estetyczna"]
  },
  ophthalmology: {
    slug: "okulistyka",
    name: "Okulistyka",
    metaTitle: "Konferencje Okulistyczne 2025/2026 | Szkolenia Oftalmologia | Konfy.pl",
    metaDescription: "Konferencje okulistyczne w Polsce. Zjazdy PTO, szkolenia z chirurgii zaćmy, siatkówki, jaskry, refrakcji laserowej.",
    h1: "Konferencje i Szkolenia Okulistyczne",
    intro: "Okulistyka (oftalmologia) zajmuje się diagnostyką i leczeniem chorób oczu. Obejmuje chirurgię zaćmy, leczenie jaskry, chorób siatkówki oraz korekcję wad wzroku.",
    topics: ["Chirurgia zaćmy", "Jaskra", "Choroby siatkówki", "AMD", "Chirurgia refrakcyjna", "Okulistyka dziecięca", "OCT i diagnostyka obrazowa"],
    faqs: [
      { question: "Jakie kursy chirurgiczne są dostępne dla okulistów?", answer: "Kursy wet-lab z fakoemulsyfikacji, witrektomii, implantacji soczewek premium oraz chirurgii refrakcyjnej." },
      { question: "Które konferencje okulistyczne są najważniejsze?", answer: "Kongres PTO, ESCRS, EURETINA oraz regionalne sympozja z najnowszymi technikami operacyjnymi." }
    ],
    societies: ["Polskie Towarzystwo Okulistyczne (PTO)", "European Society of Cataract and Refractive Surgeons (ESCRS)", "EURETINA"],
    keywords: ["konferencje okulistyczne", "szkolenia oftalmologia", "chirurgia zaćmy", "jaskra", "siatkówka"]
  },
  oncology: {
    slug: "onkologia",
    name: "Onkologia",
    metaTitle: "Konferencje Onkologiczne 2025/2026 | Szkolenia Onkologia | Konfy.pl",
    metaDescription: "Konferencje onkologiczne w Polsce. Zjazdy PTO, ESMO, szkolenia z immunoterapii, terapii celowanych, onkologii klinicznej.",
    h1: "Konferencje i Szkolenia Onkologiczne",
    intro: "Onkologia zajmuje się diagnostyką i leczeniem nowotworów. Dynamiczny rozwój immunoterapii, terapii celowanych i medycyny personalizowanej wymaga ciągłego śledzenia najnowszych badań i wytycznych.",
    topics: ["Immunoterapia", "Terapie celowane", "Onkologia kliniczna", "Radioterapia", "Hematoonkologia", "Opieka paliatywna", "Badania kliniczne"],
    faqs: [
      { question: "Jakie są najważniejsze konferencje onkologiczne?", answer: "ASCO, ESMO Congress, Kongres PTO, ESTRO oraz liczne sympozja subspecjalistyczne z poszczególnych typów nowotworów." },
      { question: "Gdzie szkolić się z immunoterapii?", answer: "Szkolenia z immunoonkologii organizują PTO, ESMO oraz producenci leków w ramach programów edukacyjnych." }
    ],
    societies: ["Polskie Towarzystwo Onkologiczne (PTO)", "European Society for Medical Oncology (ESMO)", "ASCO"],
    keywords: ["konferencje onkologiczne", "szkolenia onkologia", "immunoterapia", "terapie celowane", "ESMO"]
  }
};

export const PILLAR_PAGES = {
  conferences: {
    slug: "konferencje-medyczne",
    metaTitle: "Konferencje Medyczne w Polsce 2025/2026 | Kalendarz Kongresów | Konfy.pl",
    metaDescription: "Wszystkie konferencje medyczne w Polsce. Kongresy, zjazdy towarzystw naukowych, sympozja z punktami edukacyjnymi. Aktualizowany kalendarz wydarzeń dla lekarzy.",
    h1: "Konferencje Medyczne w Polsce",
    eventType: "conference"
  },
  webinars: {
    slug: "webinary-medyczne",
    metaTitle: "Webinary Medyczne z Punktami Edukacyjnymi 2025/2026 | Konfy.pl",
    metaDescription: "Webinary medyczne online dla lekarzy. Szkolenia z punktami edukacyjnymi, wykłady ekspertów, transmisje z kongresów. Aktualna lista webinarów.",
    h1: "Webinary Medyczne",
    eventType: "webinar"
  },
  trainings: {
    slug: "szkolenia-medyczne",
    metaTitle: "Szkolenia Medyczne i Warsztaty 2025/2026 | Kursy dla Lekarzy | Konfy.pl",
    metaDescription: "Szkolenia medyczne i warsztaty praktyczne dla lekarzy. Kursy specjalistyczne, szkolenia USG, symulacje, warsztaty proceduralne.",
    h1: "Szkolenia Medyczne i Warsztaty",
    eventType: "workshop"
  },
  calendar: {
    slug: "kalendarz-konferencji-medycznych",
    metaTitle: "Kalendarz Konferencji Medycznych 2025/2026 | Terminarz Wydarzeń | Konfy.pl",
    metaDescription: "Kalendarz wszystkich konferencji medycznych w Polsce. Planuj udział w wydarzeniach, eksportuj do kalendarza, śledź terminy rejestracji.",
    h1: "Kalendarz Konferencji Medycznych"
  }
};
