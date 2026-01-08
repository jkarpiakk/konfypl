import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { EventList } from "@/components/EventList";
import { FiltersPanel } from "@/components/FiltersPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, CalendarDays } from "lucide-react";
import { CalendarView } from "@/components/CalendarView";
import type { Event, EventFilters, Specialization } from "@/lib/types";

const defaultFilters: EventFilters = {
  search: "",
  specializations: [],
  eventType: "all",
  priceType: [],
  hasPoints: null,
  tags: [],
  dateFrom: null,
  dateTo: null,
};

export default function Home() {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [heroSearch, setHeroSearch] = useState("");

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "published" }],
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchLower);
        const matchesDesc = event.description?.toLowerCase().includes(searchLower);
        const matchesOrg = event.organizer?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc && !matchesOrg) return false;
      }

      if (filters.specializations.length > 0) {
        const hasSpec = filters.specializations.some((spec) =>
          event.specializations.includes(spec)
        );
        if (!hasSpec) return false;
      }

      if (filters.eventType === "online" && !event.isOnline) return false;
      if (filters.eventType === "onsite" && event.isOnline) return false;

      if (filters.priceType.length > 0 && !filters.priceType.includes(event.price as "free" | "paid" | "unknown")) {
        return false;
      }

      if (filters.hasPoints === true && !event.hasEducationalPoints) return false;

      if (filters.tags.length > 0) {
        const hasTags = filters.tags.some((tag) => event.tags?.includes(tag));
        if (!hasTags) return false;
      }

      if (filters.dateFrom) {
        const eventDate = new Date(event.startDate);
        if (eventDate < filters.dateFrom) return false;
      }

      if (filters.dateTo) {
        const eventDate = new Date(event.startDate);
        if (eventDate > filters.dateTo) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, filters]);

  const handleHeroSearch = () => {
    setFilters((prev) => ({ ...prev, search: heroSearch }));
  };

  const handleNavSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setHeroSearch("");
  };

  const activeFiltersCount =
    filters.specializations.length +
    filters.tags.length +
    filters.priceType.length +
    (filters.eventType !== "all" ? 1 : 0) +
    (filters.hasPoints !== null ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSearch={handleNavSearch} searchQuery={filters.search} />
      
      <HeroSection
        searchQuery={heroSearch}
        onSearchChange={setHeroSearch}
        onSearch={handleHeroSearch}
        eventCount={events.length}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Nadchodzące wydarzenia</h2>
            <p className="text-muted-foreground text-sm">
              {filteredEvents.length} {filteredEvents.length === 1 ? "wydarzenie" : "wydarzeń"}
            </p>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list" className="gap-2" data-testid="tab-list-view">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2" data-testid="tab-calendar-view">
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Kalendarz</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex gap-6">
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            activeCount={activeFiltersCount}
          />

          <div className="flex-1 min-w-0">
            {view === "list" ? (
              <EventList
                events={filteredEvents}
                isLoading={isLoading}
                onClearFilters={clearFilters}
                showClearFilters={activeFiltersCount > 0 || !!filters.search}
              />
            ) : (
              <CalendarView events={filteredEvents} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
