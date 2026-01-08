import { db } from "./db";
import { events, sources } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existingEvents = await db.select().from(events).limit(1);
  
  if (existingEvents.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database with sample data...");

  const sampleSources = [
    {
      name: "Polskie Towarzystwo Kardiologiczne",
      url: "https://www.ptkardio.pl/wydarzenia",
      type: "website",
      checkFrequencyHours: 48,
      status: "active",
    },
    {
      name: "Medycyna Praktyczna",
      url: "https://www.mp.pl/rss/wydarzenia.xml",
      type: "rss",
      checkFrequencyHours: 24,
      status: "active",
    },
  ];

  await db.insert(sources).values(sampleSources);

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const in2Weeks = new Date(today);
  in2Weeks.setDate(today.getDate() + 14);
  const in3Weeks = new Date(today);
  in3Weeks.setDate(today.getDate() + 21);
  const in2Months = new Date(today);
  in2Months.setMonth(today.getMonth() + 2);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const sampleEvents = [
    {
      title: "XXIII Kongres Polskiego Towarzystwa Kardiologicznego",
      description: "Najważniejsze wydarzenie kardiologiczne roku. Prezentacje najnowszych badań, sesje eksperckie, warsztaty praktyczne. Ponad 3000 uczestników z całego kraju.",
      specializations: ["cardiology", "internal_medicine"],
      tags: ["congress", "points"],
      startDate: formatDate(nextMonth),
      endDate: formatDate(new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000)),
      location: "Warszawa",
      isOnline: false,
      organizer: "Polskie Towarzystwo Kardiologiczne",
      hasEducationalPoints: true,
      educationalPoints: 24,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Webinar: Nowoczesne leczenie niewydolności serca",
      description: "Interaktywny webinar poświęcony najnowszym wytycznym leczenia niewydolności serca. Prowadzenie: prof. dr hab. n. med. Jan Kowalski.",
      specializations: ["cardiology"],
      tags: ["webinar", "free", "points"],
      startDate: formatDate(nextWeek),
      location: null,
      isOnline: true,
      organizer: "Akademia Medyczna Online",
      hasEducationalPoints: true,
      educationalPoints: 2,
      price: "free",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Konferencja Medycyny Rodzinnej 2026",
      description: "Coroczna konferencja dla lekarzy pierwszego kontaktu. Tematyka: profilaktyka, diagnostyka, leczenie chorób przewlekłych w POZ.",
      specializations: ["family_medicine", "internal_medicine"],
      tags: ["conference", "points"],
      startDate: formatDate(in2Weeks),
      endDate: formatDate(new Date(in2Weeks.getTime() + 2 * 24 * 60 * 60 * 1000)),
      location: "Kraków",
      isOnline: false,
      organizer: "Kolegium Lekarzy Rodzinnych",
      hasEducationalPoints: true,
      educationalPoints: 16,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Warsztaty ultrasonograficzne dla internistów",
      description: "Praktyczne warsztaty z podstaw ultrasonografii w gabinecie internisty. Ćwiczenia na fantomach i pacjentach symulowanych.",
      specializations: ["internal_medicine", "family_medicine"],
      tags: ["workshop", "points"],
      startDate: formatDate(in3Weeks),
      location: "Poznań",
      isOnline: false,
      organizer: "Centrum Szkoleniowe USG",
      hasEducationalPoints: true,
      educationalPoints: 8,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Sympozjum Neurologiczne: Choroby demielinizacyjne",
      description: "Sympozjum poświęcone diagnostyce i leczeniu stwardnienia rozsianego oraz innych chorób demielinizacyjnych ośrodkowego układu nerwowego.",
      specializations: ["neurology"],
      tags: ["conference", "points"],
      startDate: formatDate(in2Months),
      location: "Gdańsk",
      isOnline: false,
      organizer: "Polskie Towarzystwo Neurologiczne",
      hasEducationalPoints: true,
      educationalPoints: 12,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Webinar: Podstawy anestezjologii dziecięcej",
      description: "Szkolenie online z zakresu anestezjologii pediatrycznej. Omówienie specyfiki znieczulenia u dzieci w różnych grupach wiekowych.",
      specializations: ["anesthesiology", "pediatrics"],
      tags: ["webinar", "residents", "points"],
      startDate: formatDate(nextWeek),
      location: null,
      isOnline: true,
      organizer: "Towarzystwo Anestezjologów",
      hasEducationalPoints: true,
      educationalPoints: 3,
      price: "free",
      status: "published",
      isAiAdded: true,
      aiConfidence: 85,
    },
    {
      title: "Kongres Ginekologii i Położnictwa",
      description: "Międzynarodowy kongres z udziałem ekspertów z Europy. Najnowsze doniesienia z zakresu perinatologii, endokrynologii ginekologicznej i onkologii.",
      specializations: ["gynecology"],
      tags: ["congress", "points"],
      startDate: formatDate(in2Months),
      endDate: formatDate(new Date(in2Months.getTime() + 4 * 24 * 60 * 60 * 1000)),
      location: "Wrocław",
      isOnline: false,
      organizer: "PTGiP",
      hasEducationalPoints: true,
      educationalPoints: 28,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Szkolenie: Radiologia jamy brzusznej - od podstaw do zaawansowanej diagnostyki",
      description: "Kompleksowe szkolenie z interpretacji badań obrazowych jamy brzusznej. TK, MRI, USG w praktyce klinicznej.",
      specializations: ["radiology", "surgery"],
      tags: ["workshop", "points"],
      startDate: formatDate(nextMonth),
      location: "Łódź",
      isOnline: false,
      organizer: "Akademia Radiologii",
      hasEducationalPoints: true,
      educationalPoints: 10,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Webinar: Nowości w psychiatrii dzieci i młodzieży",
      description: "Omówienie aktualnych wyzwań w psychiatrii dziecięcej. Zaburzenia lękowe, depresja, ADHD - współczesne podejście terapeutyczne.",
      specializations: ["psychiatry", "pediatrics"],
      tags: ["webinar", "free"],
      startDate: formatDate(in2Weeks),
      location: null,
      isOnline: true,
      organizer: "Fundacja Zdrowie Psychiczne",
      hasEducationalPoints: false,
      price: "free",
      status: "published",
      isAiAdded: true,
      aiConfidence: 92,
    },
    {
      title: "Konferencja Ortopedyczna: Leczenie urazów sportowych",
      description: "Konferencja dla ortopedów i traumatologów. Nowoczesne metody leczenia urazów u sportowców, rehabilitacja, powrót do aktywności.",
      specializations: ["orthopedics", "surgery"],
      tags: ["conference", "points"],
      startDate: formatDate(in3Weeks),
      location: "Katowice",
      isOnline: false,
      organizer: "PTO",
      hasEducationalPoints: true,
      educationalPoints: 14,
      price: "paid",
      status: "published",
      isAiAdded: false,
    },
    {
      title: "Nowe wydarzenie z PTK - oczekujące na zatwierdzenie",
      description: "Wydarzenie wykryte automatycznie przez system AI, oczekujące na weryfikację administratora.",
      specializations: ["cardiology"],
      tags: ["conference"],
      startDate: formatDate(in2Months),
      location: "Warszawa",
      isOnline: false,
      organizer: "PTK",
      hasEducationalPoints: false,
      price: "unknown",
      status: "pending",
      isAiAdded: true,
      aiConfidence: 72,
    },
    {
      title: "Webinar pediatryczny - do zatwierdzenia",
      description: "Automatycznie wykryty webinar z zakresu pediatrii. Wymaga weryfikacji danych.",
      specializations: ["pediatrics"],
      tags: ["webinar"],
      startDate: formatDate(nextMonth),
      location: null,
      isOnline: true,
      organizer: "Nieznany organizator",
      hasEducationalPoints: false,
      price: "unknown",
      status: "pending",
      isAiAdded: true,
      aiConfidence: 65,
    },
  ];

  await db.insert(events).values(sampleEvents);

  console.log(`Seeded ${sampleEvents.length} events and ${sampleSources.length} sources`);
}
