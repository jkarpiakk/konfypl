import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EventCard } from "./EventCard";
import type { Event, PromotionTier } from "@/lib/types";

const isPromotionActive = (event: Event): boolean => {
  if (!event.promotionTier || event.promotionTier === "none") return false;
  const now = new Date();
  const start = event.promotionStart ? new Date(event.promotionStart) : null;
  const end = event.promotionEnd ? new Date(event.promotionEnd) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
};

const getHighestPromoTier = (events: Event[]): PromotionTier => {
  const tiers: PromotionTier[] = ["none", "basic", "pro", "max"];
  let highest: PromotionTier = "none";
  for (const event of events) {
    if (isPromotionActive(event)) {
      const tier = event.promotionTier as PromotionTier;
      if (tiers.indexOf(tier) > tiers.indexOf(highest)) {
        highest = tier;
      }
    }
  }
  return highest;
};

const getDotColor = (tier: PromotionTier): string => {
  switch (tier) {
    case "max": return "bg-gradient-to-r from-[#FFD700] to-[#FF8C00]";
    case "pro": return "bg-gradient-to-r from-[#2ED3B7] to-[#0EA5E9]";
    case "basic": return "bg-[#2ED3B7]";
    default: return "bg-[#94A3B8]";
  }
};

interface CalendarViewProps {
  events: Event[];
  isLoading?: boolean;
}

export function CalendarView({ events, isLoading }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const dateKey = event.startDate;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  const getEventsForDate = (date: Date): Event[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return eventsByDate.get(dateKey) || [];
  };

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedDate(date);
      setDialogOpen(true);
    }
  };

  const today = new Date();
  const weekDays = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

  return (
    <>
      <Card className="bg-white border border-[#E2E8F0] rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-[#475569] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] capitalize" data-testid="text-current-month">
              {format(currentMonth, "LLLL yyyy", { locale: pl })}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-[#475569] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
              data-testid="button-next-month"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-[#64748B] py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square p-1 border border-[#E2E8F0] rounded-lg animate-pulse bg-[#F1F5F9]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, today);
                const hasEvents = dayEvents.length > 0;
                const highestTier = getHighestPromoTier(dayEvents);
                const hasPromo = highestTier !== "none";

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    disabled={!hasEvents}
                    className={cn(
                      "aspect-square p-1 border rounded-lg transition-all duration-150 relative",
                      isCurrentMonth 
                        ? "bg-white border-[#E2E8F0]" 
                        : "bg-[#F1F5F9] border-transparent text-[#64748B]",
                      isToday && "ring-2 ring-[#2ED3B7] ring-offset-1",
                      hasEvents && "cursor-pointer hover:border-[#2ED3B7] hover:shadow-sm",
                      !hasEvents && "cursor-default",
                      hasPromo && highestTier === "max" && "bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] border-[#FFD700]",
                      hasPromo && highestTier === "pro" && "bg-gradient-to-br from-[#E6FAF7] to-[#E0F7FA] border-[#2ED3B7]",
                      hasPromo && highestTier === "basic" && "bg-[#F0FDF9] border-[#99F6E4]"
                    )}
                    data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                  >
                    {hasPromo && highestTier === "max" && (
                      <Zap className="absolute top-0.5 right-0.5 w-3 h-3 text-[#FF8C00]" />
                    )}
                    {hasPromo && highestTier === "pro" && (
                      <Crown className="absolute top-0.5 right-0.5 w-3 h-3 text-[#0EA5E9]" />
                    )}
                    {hasPromo && highestTier === "basic" && (
                      <Star className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-[#2ED3B7]" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        isToday && "font-bold text-[#2ED3B7]",
                        !isToday && isCurrentMonth && "text-[#0F172A]"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.length <= 3 ? (
                          dayEvents.map((event, i) => {
                            const tier = isPromotionActive(event) ? event.promotionTier as PromotionTier : "none";
                            return (
                              <div
                                key={i}
                                className={cn("w-1.5 h-1.5 rounded-full", getDotColor(tier))}
                              />
                            );
                          })
                        ) : (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] px-1 py-0 h-4",
                              hasPromo ? "bg-[#2ED3B7] text-white" : "bg-[#E6FAF7] text-[#0F766E]"
                            )}
                          >
                            {dayEvents.length}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-[#E2E8F0]">
          <DialogHeader>
            <DialogTitle className="font-heading text-[#0F172A]">
              {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: pl })}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {selectedDate && getEventsForDate(selectedDate).map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
