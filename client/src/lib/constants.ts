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
  "conference"
] as const;

export const TAG_LABELS: Record<typeof EVENT_TAGS[number], string> = {
  webinar: "Webinar",
  points: "Punkty edukacyjne",
  free: "Bezpłatne",
  paid: "Płatne",
  residents: "Dla rezydentów",
  workshop: "Warsztaty",
  congress: "Kongres",
  conference: "Konferencja"
};

export const SPECIALIZATION_COLORS: Record<typeof SPECIALIZATIONS[number], string> = {
  cardiology: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  family_medicine: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  internal_medicine: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  anesthesiology: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  surgery: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  orthopedics: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  gynecology: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  pediatrics: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  neurology: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  psychiatry: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  radiology: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  emergency_medicine: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  laboratory_diagnostics: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  interdisciplinary: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
};
