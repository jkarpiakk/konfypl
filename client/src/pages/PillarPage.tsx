import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, GraduationCap, MapPin, Video, ChevronRight, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/EventCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead, EventListSchema, FAQSchema } from "@/components/SEOHead";
import { SEOFooter } from "@/components/SEOFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPECIALIZATION_SEO, PILLAR_PAGES } from "@/lib/seo-data";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@shared/schema";
import type { Event } from "@/lib/types";

interface PillarPageProps {
  pageType: "conferences" | "webinars" | "trainings" | "calendar";
}

export default function PillarPage({ pageType }: PillarPageProps) {
  const pageData = PILLAR_PAGES[pageType];
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "published" }],
  });

  const filteredEvents = events.filter(event => {
    if (pageType === "webinars") return event.tags?.includes("webinar") || event.isOnline;
    if (pageType === "trainings") return event.tags?.includes("workshop");
    if (pageType === "conferences") return event.tags?.includes("conference") || event.tags?.includes("congress");
    return true;
  });

  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const shouldNoindex = filteredEvents.length < 3;

  const pillarFaqs = {
    conferences: [
      { question: "Jak znaleźć konferencje medyczne w mojej specjalizacji?", answer: "Użyj filtrów specjalizacji na naszej stronie lub przejdź do dedykowanej strony swojej dziedziny medycyny. Każda specjalizacja ma własny hub z aktualnymi wydarzeniami." },
      { question: "Czy konferencje medyczne dają punkty edukacyjne?", answer: "Tak, większość konferencji akredytowanych przez towarzystwa naukowe przyznaje punkty edukacyjne. Sprawdź oznaczenie 'Punkty edukacyjne' przy wydarzeniu." },
      { question: "Jak dodać konferencję do mojego kalendarza?", answer: "Przy każdym wydarzeniu znajdziesz przyciski eksportu do Google Calendar, Outlook lub pobrania pliku ICS." }
    ],
    webinars: [
      { question: "Czy webinary medyczne są bezpłatne?", answer: "Wiele webinarów jest bezpłatnych, szczególnie te organizowane przez towarzystwa naukowe. Sprawdź oznaczenie 'Bezpłatne' przy wydarzeniu." },
      { question: "Jak zdobyć punkty edukacyjne za webinary?", answer: "Uczestnictwo w akredytowanych webinarach jest potwierdzone certyfikatem z liczbą przyznanych punktów edukacyjnych." },
      { question: "Czy mogę obejrzeć webinar po terminie?", answer: "Wiele webinarów jest nagrywanych i dostępnych do późniejszego odtworzenia. Sprawdź na stronie organizatora." }
    ],
    trainings: [
      { question: "Jakie szkolenia praktyczne są dostępne dla lekarzy?", answer: "Dostępne są warsztaty USG, symulacje medyczne, szkolenia laparoskopowe, kursy ALS/ATLS i wiele innych praktycznych form kształcenia." },
      { question: "Czy szkolenia są akredytowane?", answer: "Większość szkoleń jest akredytowana i przyznaje punkty edukacyjne. Zawsze sprawdzaj informację o akredytacji przed rejestracją." }
    ],
    calendar: [
      { question: "Jak eksportować kalendarz konferencji?", answer: "Możesz eksportować pojedyncze wydarzenia do swojego kalendarza (Google, Outlook, ICS) lub śledzić kalendarz całej specjalizacji." },
      { question: "Jak często aktualizowany jest kalendarz?", answer: "Kalendarz jest aktualizowany automatycznie co 48 godzin dzięki skanowaniu źródeł i AI-powered ekstrakcji wydarzeń." }
    ]
  };

  const specializationCounts = SPECIALIZATIONS.reduce((acc, spec) => {
    acc[spec] = events.filter(e => e.specializations?.includes(spec)).length;
    return acc;
  }, {} as Record<string, number>);

  const topSpecializations = SPECIALIZATIONS
    .filter(s => specializationCounts[s] > 0)
    .sort((a, b) => specializationCounts[b] - specializationCounts[a])
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead 
        title={pageData.metaTitle}
        description={pageData.metaDescription}
        canonical={`/${pageData.slug}`}
        noindex={shouldNoindex}
      />
      <FAQSchema faqs={pillarFaqs[pageType]} />
      {upcomingEvents.length > 0 && <EventListSchema events={upcomingEvents.slice(0, 10)} listName={pageData.h1} />}
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Breadcrumb items={[{ name: pageData.h1, url: `/${pageData.slug}` }]} />

        <header className="mb-8 pb-8 border-b border-[#E2E8F0]">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" data-testid="text-pillar-title">
            {pageData.h1}
          </h1>
          <p className="text-lg text-[#475569] max-w-3xl leading-relaxed mb-6">
            {pageType === "conferences" && "Kompletna baza konferencji medycznych w Polsce. Kongresy, zjazdy towarzystw naukowych, sympozja i spotkania eksperckie z wszystkich dziedzin medycyny. Znajdź wydarzenia z punktami edukacyjnymi i zapisz się już dziś."}
            {pageType === "webinars" && "Webinary i szkolenia online dla lekarzy wszystkich specjalizacji. Wykłady ekspertów, transmisje z kongresów, interaktywne sesje z możliwością zdobycia punktów edukacyjnych bez wychodzenia z domu."}
            {pageType === "trainings" && "Praktyczne szkolenia medyczne i warsztaty dla lekarzy. Kursy USG, symulacje, szkolenia proceduralne na fantomach. Rozwijaj umiejętności praktyczne pod okiem ekspertów."}
            {pageType === "calendar" && "Interaktywny kalendarz wszystkich wydarzeń medycznych w Polsce. Planuj swój rozwój zawodowy, śledź terminy rejestracji i eksportuj wydarzenia do swojego kalendarza."}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white border-[#E2E8F0]">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-[#2ED3B7]">{filteredEvents.length}</div>
                <div className="text-sm text-[#64748B]">Wydarzeń w bazie</div>
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
                <div className="text-3xl font-bold text-[#2ED3B7]">{filteredEvents.filter(e => e.hasEducationalPoints).length}</div>
                <div className="text-sm text-[#64748B]">Z punktami</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#E2E8F0]">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-[#2ED3B7]">{filteredEvents.filter(e => e.price === "free").length}</div>
                <div className="text-sm text-[#64748B]">Bezpłatnych</div>
              </CardContent>
            </Card>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">
            Przeglądaj według specjalizacji
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topSpecializations.map(spec => {
              const seoData = SPECIALIZATION_SEO[spec];
              return (
                <Link key={spec} href={`/${seoData.slug}`}>
                  <Card className="bg-white border-[#E2E8F0] hover:border-[#2ED3B7] transition-colors cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#0F172A]">{SPECIALIZATION_LABELS[spec]}</span>
                        <Badge variant="secondary" className="bg-[#E6FAF7] text-[#0F172A]">
                          {specializationCounts[spec]}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <Link href="/">
              <Button variant="outline">Zobacz wszystkie specjalizacje</Button>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold text-[#0F172A]">
              Najbliższe wydarzenia
            </h2>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1">
                Wszystkie <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i} className="animate-pulse bg-white border-[#E2E8F0]">
                  <CardContent className="p-6 h-48" />
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.slice(0, 9).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="bg-white border-[#E2E8F0]">
              <CardContent className="p-8 text-center text-[#64748B]">
                Brak nadchodzących wydarzeń w tej kategorii.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-4">
            Powiązane kategorie
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(PILLAR_PAGES).filter(([key]) => key !== pageType).map(([key, data]) => (
              <Link key={key} href={`/${data.slug}`}>
                <Card className="bg-white border-[#E2E8F0] hover:border-[#2ED3B7] transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E6FAF7] flex items-center justify-center">
                      {key === "conferences" && <Users className="w-5 h-5 text-[#2ED3B7]" />}
                      {key === "webinars" && <Video className="w-5 h-5 text-[#2ED3B7]" />}
                      {key === "trainings" && <GraduationCap className="w-5 h-5 text-[#2ED3B7]" />}
                      {key === "calendar" && <Calendar className="w-5 h-5 text-[#2ED3B7]" />}
                    </div>
                    <span className="font-medium text-[#0F172A]">{data.h1}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-[#0F172A] mb-6">
            Najczęściej zadawane pytania
          </h2>
          <div className="space-y-4">
            {pillarFaqs[pageType].map((faq, index) => (
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
      </main>
      
      <SEOFooter />
    </div>
  );
}
