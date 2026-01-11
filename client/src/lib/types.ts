import type { Event, Source, ScanLog, Specialization, EventTag, PromotionTier } from "@shared/schema";

export type { Event, Source, ScanLog, Specialization, EventTag, PromotionTier };

export interface EventFilters {
  search: string;
  specializations: Specialization[];
  eventType: "all" | "online" | "onsite";
  priceType: ("free" | "paid" | "unknown")[];
  hasPoints: boolean | null;
  tags: EventTag[];
  dateFrom: Date | null;
  dateTo: Date | null;
  city: string | null;
  voivodeship: string | null;
}

export interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
}
