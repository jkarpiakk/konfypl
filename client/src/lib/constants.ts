export const SPECIALIZATIONS = [
  "cardiology",
  "family_medicine",
  "internal_medicine",
  "anesthesiology",
  "surgery",
  "orthopedics",
  "gynecology",
  "pediatrics",
  "neurology",
  "psychiatry",
  "radiology",
  "emergency_medicine",
  "laboratory_diagnostics",
  "interdisciplinary"
] as const;

export const SPECIALIZATION_LABELS: Record<typeof SPECIALIZATIONS[number], string> = {
  cardiology: "Kardiologia",
  family_medicine: "Medycyna Rodzinna",
  internal_medicine: "Interna",
  anesthesiology: "Anestezjologia i Intensywna Terapia",
  surgery: "Chirurgia",
  orthopedics: "Ortopedia",
  gynecology: "Ginekologia i Położnictwo",
  pediatrics: "Pediatria",
  neurology: "Neurologia",
  psychiatry: "Psychiatria",
  radiology: "Radiologia",
  emergency_medicine: "Medycyna Ratunkowa",
  laboratory_diagnostics: "Diagnostyka Laboratoryjna",
  interdisciplinary: "Interdyscyplinarne / Inne"
};

export const EVENT_TAGS = [
  "webinar",
  "points",
  "free",
  "paid",
  "residents",
  "workshop",
  "congress",
  "conference",
  "symposium",
  "online",
  "hybrid",
  "advanced",
  "basic_level",
  "practical",
  "certification",
  "hands_on",
  "case_studies",
  "live_surgery",
  "networking"
] as const;

export const TAG_LABELS: Record<typeof EVENT_TAGS[number], string> = {
  webinar: "Webinar",
  points: "Punkty edukacyjne",
  free: "Bezpłatne",
  paid: "Płatne",
  residents: "Dla rezydentów",
  workshop: "Warsztaty",
  congress: "Kongres",
  conference: "Konferencja",
  symposium: "Sympozjum",
  online: "Online",
  hybrid: "Hybrydowe",
  advanced: "Zaawansowane",
  basic_level: "Podstawowe",
  practical: "Praktyczne",
  certification: "Z certyfikatem",
  hands_on: "Hands-on",
  case_studies: "Case studies",
  live_surgery: "Live surgery",
  networking: "Networking"
};

export const SPECIALIZATION_COLORS: Record<typeof SPECIALIZATIONS[number], string> = {
  cardiology: "!bg-red-100 !text-red-700 border border-red-200",
  family_medicine: "!bg-green-100 !text-green-700 border border-green-200",
  internal_medicine: "!bg-blue-100 !text-blue-700 border border-blue-200",
  anesthesiology: "!bg-purple-100 !text-purple-700 border border-purple-200",
  surgery: "!bg-orange-100 !text-orange-700 border border-orange-200",
  orthopedics: "!bg-amber-100 !text-amber-700 border border-amber-200",
  gynecology: "!bg-pink-100 !text-pink-700 border border-pink-200",
  pediatrics: "!bg-cyan-100 !text-cyan-700 border border-cyan-200",
  neurology: "!bg-indigo-100 !text-indigo-700 border border-indigo-200",
  psychiatry: "!bg-violet-100 !text-violet-700 border border-violet-200",
  radiology: "!bg-slate-200 !text-slate-700 border border-slate-300",
  emergency_medicine: "!bg-rose-100 !text-rose-700 border border-rose-200",
  laboratory_diagnostics: "!bg-teal-100 !text-teal-700 border border-teal-200",
  interdisciplinary: "!bg-gray-200 !text-gray-700 border border-gray-300"
};
