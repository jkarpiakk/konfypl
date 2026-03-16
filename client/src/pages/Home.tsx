import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { EventList } from "@/components/EventList";
import { FiltersPanel } from "@/components/FiltersPanel";
import { SEOFooter } from "@/components/SEOFooter";
import { SEOHead, EventListSchema } from "@/components/SEOHead";
import { OrganizerCTABlock } from "@/components/OrganizerCTABlock";
import { NewsletterModal } from "@/components/NewsletterModal";
import { getStoredPreferences } from "@/lib/preferences";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, CalendarDays, Bell } from "lucide-react";
import { CalendarView } from "@/components/CalendarView";
import type { Event, EventFilters, Specialization, PromotionTier } from "@/lib/types";

const isPromotionActive = (event: Event): boolean => {
  if (!event.promotionTier || event.promotionTier === "none") return false;
  const now = new Date();
  const start = event.promotionStart ? new Date(event.promotionStart) : null;
  const end = event.promotionEnd ? new Date(event.promotionEnd) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
};

const getTierPriority = (tier: PromotionTier): number => {
  switch (tier) {
    case "max": return 3;
    case "pro": return 2;
    case "basic": return 1;
    default: return 0;
  }
};

const defaultFilters: EventFilters = {
  search: "",
  specializations: [],
  eventType: "all",
  priceType: [],
  hasPoints: null,
  tags: [],
  dateFrom: null,
  dateTo: null,
  city: null,
  voivodeship: null,
};

export default function Home() {
  const [filters, setFilters] = useState<EventFilters>(() => {
    const storedSpecs = getStoredPreferences();
    return {
      ...defaultFilters,
      specializations: storedSpecs,
    };
  });
  const [view, setView] = useState<"list" | "calendar">("list");
  const [heroSearch, setHeroSearch] = useState("");
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "published", upcoming: "true", limit: "50" }],
  });

  const { data: eventCountData } = useQuery<{ count: number }>({
    queryKey: ["/api/events/count"],
  });

  const { data: sponsoredEventIds = [] } = useQuery<number[]>({
    queryKey: ["/api/sponsored-placements"],
  });

  const handleSpecsChange = (selectedSpecs: Specialization[]) => {
    setFilters((prev) => ({
      ...prev,
      specializations: selectedSpecs,
    }));
  };

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

      if (filters.city && event.city !== filters.city) return false;
      
      if (filters.voivodeship && event.voivodeship !== filters.voivodeship) return false;

      return true;
    }).sort((a, b) => {
      const aActive = isPromotionActive(a);
      const bActive = isPromotionActive(b);
      
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      
      if (aActive && bActive) {
        const aPriority = getTierPriority(a.promotionTier as PromotionTier);
        const bPriority = getTierPriority(b.promotionTier as PromotionTier);
        if (aPriority !== bPriority) return bPriority - aPriority;
      }
      
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
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
    (filters.dateTo ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.voivodeship ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="Konfy.pl - Konferencje, Kongresy i Szkolenia Medyczne w Polsce 2025/2026"
        description="Znajdź konferencje medyczne, kongresy, webinary i szkolenia dla lekarzy w Polsce. Agregator wydarzeń z eksportem do kalendarza. Ponad 40 specjalizacji medycznych."
        canonical="/"
        keywords={[
          "konferencje medyczne",
          "kongresy lekarskie",
          "szkolenia medyczne",
          "webinary dla lekarzy",
          "punkty edukacyjne",
          "wydarzenia medyczne Polska"
        ]}
      />
      {events.length > 0 && (
        <EventListSchema events={events.slice(0, 20)} listName="Nadchodzące wydarzenia medyczne w Polsce" />
      )}
      
      <Navigation onSearch={handleNavSearch} searchQuery={filters.search} />
      
      <HeroSection
        searchQuery={heroSearch}
        onSearchChange={setHeroSearch}
        onSearch={handleHeroSearch}
        eventCount={eventCountData?.count}
        selectedSpecs={filters.specializations}
        onSpecsChange={handleSpecsChange}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-[#0F172A]">Nadchodzące wydarzenia</h2>
            <p className="text-[#64748B] text-sm">
              {filteredEvents.length} {filteredEvents.length === 1 ? "wydarzenie" : "wydarzeń"}
            </p>
          </div>
          
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
            <TabsList className="bg-[#F1F5F9] border border-[#E2E8F0]">
              <TabsTrigger 
                value="list" 
                className="gap-2 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-[#64748B]" 
                data-testid="tab-list-view"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="gap-2 data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-[#64748B]" 
                data-testid="tab-calendar-view"
              >
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
            <OrganizerCTABlock />
            
            <div className="mb-6 p-4 bg-gradient-to-r from-[#E6FAF7] to-[#F8FAFC] border border-[#99F6E4] rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#2ED3B7]/20">
                  <Bell className="w-5 h-5 text-[#2ED3B7]" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-[#0F172A]">
                    Daj znać o nowych wydarzeniach w Twojej specjalizacji
                  </p>
                  <p className="text-sm text-[#64748B]">
                    Zapisz się i otrzymuj powiadomienia o wydarzeniach dopasowanych do Ciebie.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setNewsletterOpen(true)}
                className="px-6 py-2 bg-[#2ED3B7] text-[#0F172A] font-semibold rounded-full hover:bg-[#25B9A1] transition-colors whitespace-nowrap" 
                data-testid="button-newsletter-cta"
              >
                Zapisz się
              </button>
            </div>

            <NewsletterModal 
              open={newsletterOpen} 
              onOpenChange={setNewsletterOpen} 
              mode="newsletter"
            />

            {view === "list" ? (
              <EventList
                events={filteredEvents}
                isLoading={isLoading}
                onClearFilters={clearFilters}
                showClearFilters={activeFiltersCount > 0 || !!filters.search}
                sponsoredEventIds={sponsoredEventIds}
              />
            ) : (
              <CalendarView events={filteredEvents} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>
      
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#2ED3B7] text-[#0F172A] rounded-full shadow-lg hover:bg-[#25B9A1] transition-all duration-200 hover:scale-110"
          aria-label="Wróć na górę"
          data-testid="button-back-to-top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      )}

      <SEOFooter />
    </div>
  );
}
