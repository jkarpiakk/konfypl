import type { Specialization } from "@/lib/types";

const ONBOARDING_KEY = "medevents_onboarding_complete";
const PREFERENCES_KEY = "medevents_user_preferences";

export function getStoredPreferences(): Specialization[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(PREFERENCES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function setStoredPreferences(specs: Specialization[]) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(specs));
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_KEY, "true");
}
