import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, GraduationCap, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/EventCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead, FAQSchema, EventListSchema } from "@/components/SEOHead";
import { SEOFooter } from "@/components/SEOFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SLUG_TO_SPECIALIZATION, SPECIALIZATION_SEO, PILLAR_PAGES } from "@/lib/seo-data";
import type { Event } from "@/lib/types";

export default function SpecializationHub() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  
  const specializationKey = SLUG_TO_SPECIALIZATION[slug];
  const seoData = specializationKey ? SPECIALIZATION_SEO[specializationKey] : null;

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "published", specialization: specializationKey }],
    queryFn: async () => {
      const res = await fetch(`/api/events?status=published`);
      const allEvents = await res.json();
      return specializationKey 
        ? allEvents.filter((e: Event) => e.specializations?.includes(specializationKey))
        : allEvents;
    },
    enabled: !!specializationKey,
  });

  if (!seoData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-[#0F172A]">Specjalizacja nie znaleziona</h1>
          <Link href="/">
            <Button className="mt-4">Wróć do strony głównej</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shouldNoindex = events.length < 3;
  
  const upcomingEvents = events
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const webinars = events.filter(e => e.tags?.includes("webinar"));
  const conferences = events.filter(e => e.tags?.includes("conference") || e.tags?.includes("congress"));
  const withPoints = events.filter(e => e.hasEducationalPoints);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead 
        title={seoData.metaTitle}
        description={seoData.metaDescription}
        canonical={`/${seoData.slug}`}
        noindex={shouldNoindex}
      />
      <FAQSchema faqs={seoData.faqs} />
      {events.length > 0 && <EventListSchema events={upcomingEvents.slice(0, 10)} listName={`Konferencje ${seoData.name}`} />}
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Breadcrumb items={[
          { name: "Konferencje medyczne", url: `/${PILLAR_PAGES.conferences.slug}` },
          { name: seoData.name, url: `/${seoData.slug}` }
        ]} />

        <header className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" data-testid="text-hub-title">
            {seoData.h1}
          </h1>
          <p className="text-lg text-[#475569] max-w-3xl leading-relaxed">
            {seoData.intro}
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-[#2ED3B7]">{events.length}</div>
              <div className="text-sm text-[#64748B]">Wydarzeń</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-[#2ED3B7]">{upcomingEvents.length}</div>
              <div className="text-sm text-[#64748B]">Nadchodzących</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-[#2ED3B7]">{webinars.length}</div>
              <div className="text-sm text-[#64748B]">Webinarów</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-[#2ED3B7]">{withPoints.length}</div>
              <div className="text-sm text-[#64748B]">Z punktami</div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">
            Popularne tematy w {seoData.name.toLowerCase()}
          </h2>
          <div className="flex flex-wrap gap-2">
            {seoData.topics.map(topic => (
              <Badge key={topic} variant="secondary" className="bg-[#E6FAF7] text-[#0F172A] border-[#2ED3B7]/30">
                {topic}
              </Badge>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-[#0F172A]">
              Nadchodzące wydarzenia
            </h2>
            <Link href={`/kalendarz-konferencji-medycznych?spec=${specializationKey}`}>
              <Button variant="outline" size="sm" className="gap-1">
                Kalendarz <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => (
                <Card key={i} className="animate-pulse bg-white border-[#E2E8F0]">
                  <CardContent className="p-6 h-48" />
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.slice(0, 6).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="bg-white border-[#E2E8F0]">
              <CardContent className="p-8 text-center text-[#64748B]">
                Brak nadchodzących wydarzeń w tej specjalizacji. Sprawdź inne kategorie.
              </CardContent>
            </Card>
          )}

          {upcomingEvents.length > 6 && (
            <div className="text-center mt-6">
              <Link href={`/?spec=${specializationKey}`}>
                <Button className="bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A]">
                  Zobacz wszystkie ({upcomingEvents.length})
                </Button>
              </Link>
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">
            Towarzystwa naukowe
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {seoData.societies.map(society => (
              <Card key={society} className="bg-white border-[#E2E8F0]">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6FAF7] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#2ED3B7]" />
                  </div>
                  <span className="font-medium text-[#0F172A]">{society}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-6">
            Najczęściej zadawane pytania
          </h2>
          <div className="space-y-4">
            {seoData.faqs.map((faq, index) => (
              <Card key={index} className="bg-white border-[#E2E8F0]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-[#0F172A]">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-[#475569]">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">
            Powiązane kategorie
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${PILLAR_PAGES.conferences.slug}`}>
              <Button variant="outline" size="sm">Konferencje medyczne</Button>
            </Link>
            <Link href={`/${PILLAR_PAGES.webinars.slug}`}>
              <Button variant="outline" size="sm">Webinary medyczne</Button>
            </Link>
            <Link href={`/${PILLAR_PAGES.trainings.slug}`}>
              <Button variant="outline" size="sm">Szkolenia i warsztaty</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <SEOFooter />
    </div>
  );
}
