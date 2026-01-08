import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { CalendarView } from "@/components/CalendarView";
import type { Event } from "@/lib/types";

export default function CalendarPage() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "published" }],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Kalendarz wydarzeń</h1>
          <p className="text-muted-foreground">
            Przeglądaj wydarzenia medyczne w widoku kalendarza
          </p>
        </div>

        <CalendarView events={events} isLoading={isLoading} />
      </main>
    </div>
  );
}
