import { EventCard } from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Event } from "@/lib/types";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
  sponsoredEventIds?: number[];
}

function EventCardSkeleton() {
  return (
    <Card className="bg-white border border-[#E2E8F0] rounded-2xl">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-[#F1F5F9]" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 bg-[#F1F5F9]" />
          <Skeleton className="h-5 w-16 bg-[#F1F5F9]" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20 bg-[#F1F5F9]" />
          <Skeleton className="h-5 w-24 bg-[#F1F5F9]" />
          <Skeleton className="h-5 w-16 bg-[#F1F5F9]" />
        </div>
        <Skeleton className="h-10 w-full bg-[#F1F5F9]" />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 bg-[#F1F5F9]" />
            <Skeleton className="h-6 w-20 bg-[#F1F5F9]" />
          </div>
          <Skeleton className="h-8 w-24 bg-[#F1F5F9]" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EventList({ events, isLoading, onClearFilters, showClearFilters, sponsoredEventIds = [] }: EventListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="border-dashed border-[#E2E8F0] bg-white rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#E6FAF7] flex items-center justify-center mb-4">
            {showClearFilters ? (
              <Search className="w-6 h-6 text-[#2ED3B7]" />
            ) : (
              <CalendarX className="w-6 h-6 text-[#2ED3B7]" />
            )}
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2 text-[#0F172A]" data-testid="text-empty-state">
            {showClearFilters 
              ? "Brak wyników dla wybranych filtrów" 
              : "Brak nadchodzących wydarzeń"
            }
          </h3>
          <p className="text-[#64748B] text-sm max-w-sm leading-relaxed">
            {showClearFilters
              ? "Spróbuj zmienić lub wyczyścić filtry, aby zobaczyć więcej wydarzeń."
              : "Nowe wydarzenia pojawią się tutaj wkrótce. Sprawdź ponownie później."
            }
          </p>
          {showClearFilters && onClearFilters && (
            <Button 
              variant="outline" 
              className="mt-4 rounded-full border-[#2ED3B7] text-[#2ED3B7] hover:bg-[#E6FAF7]"
              onClick={onClearFilters}
              data-testid="button-clear-filters-empty"
            >
              Wyczyść filtry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const sponsoredSet = new Set(sponsoredEventIds);
  const sponsoredEvents = events.filter(e => sponsoredSet.has(e.id));
  const regularEvents = events.filter(e => !sponsoredSet.has(e.id));

  return (
    <div className="space-y-4" data-testid="event-list">
      {sponsoredEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <EventCard event={event} isSponsored />
        </motion.div>
      ))}
      {regularEvents.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: (sponsoredEvents.length + index) * 0.08 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  );
}
