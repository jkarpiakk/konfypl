import type { Event, Source, ScanLog, Specialization, EventTag } from "@shared/schema";

export type { Event, Source, ScanLog, Specialization, EventTag };

export interface EventFilters {
  search: string;
  specializations: Specialization[];
  eventType: "all" | "online" | "onsite";
  priceType: ("free" | "paid" | "unknown")[];
  hasPoints: boolean | null;
  tags: EventTag[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
}
