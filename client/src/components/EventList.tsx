import { EventCard } from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
}

function EventCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EventList({ events, isLoading, onClearFilters, showClearFilters }: EventListProps) {
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
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            {showClearFilters ? (
              <Search className="w-6 h-6 text-muted-foreground" />
            ) : (
              <CalendarX className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <h3 className="font-semibold text-lg mb-2" data-testid="text-empty-state">
            {showClearFilters 
              ? "Brak wyników dla wybranych filtrów" 
              : "Brak nadchodzących wydarzeń"
            }
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {showClearFilters
              ? "Spróbuj zmienić lub wyczyścić filtry, aby zobaczyć więcej wydarzeń."
              : "Nowe wydarzenia pojawią się tutaj wkrótce. Sprawdź ponownie później."
            }
          </p>
          {showClearFilters && onClearFilters && (
            <Button 
              variant="outline" 
              className="mt-4"
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

  return (
    <div className="space-y-4" data-testid="event-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
