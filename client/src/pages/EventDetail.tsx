import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Globe,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Building,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { SiGooglecalendar, SiApple } from "react-icons/si";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SPECIALIZATION_LABELS, SPECIALIZATION_COLORS, TAG_LABELS } from "@/lib/constants";
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from "@/lib/calendar";
import type { Event, Specialization, EventTag } from "@/lib/types";

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="font-semibold text-lg mb-2">Nie znaleziono wydarzenia</h3>
              <p className="text-muted-foreground text-sm mb-4">
                To wydarzenie mogło zostać usunięte lub nie istnieje.
              </p>
              <Link href="/">
                <Button variant="outline">Wróć do listy wydarzeń</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formatEventDate = () => {
    const start = format(startDate, "d MMMM yyyy", { locale: pl });
    if (endDate && event.endDate !== event.startDate) {
      const end = format(endDate, "d MMMM yyyy", { locale: pl });
      return `${start} - ${end}`;
    }
    return start;
  };

  const getPriceLabel = () => {
    switch (event.price) {
      case "free":
        return "Bezpłatne";
      case "paid":
        return "Płatne";
      default:
        return "Cena nieznana";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">
            Strona główna
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/" className="hover:text-foreground transition-colors">
            Wydarzenia
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate max-w-xs">{event.title}</span>
        </nav>

        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Powrót do listy
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold flex-1" data-testid="text-event-detail-title">
                  {event.title}
                </h1>
                {event.isAiAdded && (
                  <Badge variant="outline" className="gap-1 shrink-0">
                    <Sparkles className="w-3 h-3" />
                    Wykryte przez AI
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {event.specializations.map((spec) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className={SPECIALIZATION_COLORS[spec as Specialization]}
                  >
                    {SPECIALIZATION_LABELS[spec as Specialization] || spec}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {event.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {TAG_LABELS[tag as EventTag] || tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-3">Opis</h2>
              <div className="max-w-none" data-testid="text-event-description">
                {event.description ? (
                  <p className="whitespace-pre-wrap text-[#334155] leading-relaxed">{event.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Brak opisu dla tego wydarzenia.
                  </p>
                )}
              </div>
            </div>

            {event.organizer && (
              <>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold mb-3">Organizator</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <Building className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium" data-testid="text-organizer">{event.organizer}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Szczegóły</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium" data-testid="text-detail-date">{formatEventDate()}</p>
                    <p className="text-sm text-muted-foreground">Data wydarzenia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {event.isOnline ? (
                    <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium" data-testid="text-detail-location">
                      {event.isOnline ? "Online" : (event.location || "Lokalizacja nieznana")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.isOnline ? "Wydarzenie wirtualne" : "Miejsce"}
                    </p>
                  </div>
                </div>

                {event.hasEducationalPoints && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium" data-testid="text-detail-points">
                        {event.educationalPoints
                          ? `${event.educationalPoints} punktów`
                          : "Punkty edukacyjne"
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">Punkty edukacyjne</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium" data-testid="text-detail-price">{getPriceLabel()}</p>
                    <p className="text-sm text-muted-foreground">Cena</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={event.sourceUrl ? "border-[#2ED3B7] bg-[#E6FAF7]/30" : ""}>
              <CardContent className="pt-6 space-y-3">
                {event.sourceUrl ? (
                  <Button
                    className="w-full gap-2 bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A] font-semibold"
                    onClick={() => window.open(event.sourceUrl!, "_blank")}
                    data-testid="button-event-website"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Przejdz do strony wydarzenia
                  </Button>
                ) : (
                  <div className="text-center py-2 text-muted-foreground text-sm">
                    Brak linku do strony wydarzenia
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full gap-2" data-testid="button-add-to-calendar">
                      <Calendar className="w-4 h-4" />
                      Dodaj do kalendarza
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => window.open(getGoogleCalendarUrl(event), "_blank")}>
                      <SiGooglecalendar className="w-4 h-4 mr-2" />
                      Google Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(getOutlookCalendarUrl(event), "_blank")}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Outlook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadICSFile(event)}>
                      <SiApple className="w-4 h-4 mr-2" />
                      Apple Calendar (.ics)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {event.sourceUrl && (
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Zrodlo informacji:
                </p>
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#2ED3B7] hover:underline inline-flex items-center gap-1"
                  data-testid="link-event-source"
                >
                  {new URL(event.sourceUrl).hostname}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
