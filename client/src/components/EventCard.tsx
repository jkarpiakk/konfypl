import { useRef } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Globe, 
  GraduationCap, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Share2
} from "lucide-react";
import { SiGooglecalendar, SiApple } from "react-icons/si";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from "@/lib/calendar";
import { useToast } from "@/hooks/use-toast";
import type { Event, Specialization, EventTag } from "@/lib/types";
import { Link } from "wouter";

const addUtmParams = (url: string, eventId: number): string => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("utm_source", "konfy.pl");
    urlObj.searchParams.set("utm_medium", "referral");
    urlObj.searchParams.set("utm_campaign", `event-${eventId}`);
    return urlObj.toString();
  } catch {
    return url;
  }
};

interface EventCardProps {
  event: Event;
  compact?: boolean;
  isSponsored?: boolean;
}

const TAG_LABELS: Record<string, string> = {
  congress: "Kongres",
  conference: "Konferencja",
  webinar: "Webinar",
  workshop: "Warsztaty",
  course: "Kurs",
  symposium: "Sympozjum",
};

export function EventCard({ event, compact = false, isSponsored = false }: EventCardProps) {
  const { toast } = useToast();
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardRef.current.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
    cardRef.current.style.transition = "transform 0.3s ease-out";
  };

  const trackEvent = (action: string) => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id, action }),
    }).catch(() => {});
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/event/${event.id}`;
    try {
      await navigator.clipboard.writeText(eventUrl);
      trackEvent("share");
      toast({
        title: "Link skopiowany",
        description: "Link do wydarzenia zostal skopiowany do schowka",
      });
    } catch {
      toast({
        title: "Blad",
        description: "Nie udalo sie skopiowac linku",
        variant: "destructive",
      });
    }
  };

  const handleRegistrationClick = () => {
    if (event.sourceUrl) {
      trackEvent("registration_click");
      window.open(addUtmParams(event.sourceUrl, event.id), "_blank");
    }
  };

  const handleCalendarAdd = (type: string, callback: () => void) => {
    trackEvent("calendar_add");
    callback();
  };

  const formatEventDate = () => {
    const start = format(startDate, "d MMM yyyy", { locale: pl });
    if (endDate && event.endDate !== event.startDate) {
      const end = format(endDate, "d MMM yyyy", { locale: pl });
      return `${start} - ${end}`;
    }
    return start;
  };

  const getPriceLabel = () => {
    switch (event.price) {
      case "free":
        return { label: "Bezpłatne", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "paid":
        return { label: "Płatne", className: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: "Cena nieznana", className: "bg-slate-100 text-slate-600 border-slate-200" };
    }
  };

  const priceInfo = getPriceLabel();

  return (
    <Card 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white border rounded-2xl shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        isSponsored 
          ? "border-[#2ED3B7] ring-2 ring-[#2ED3B7]/20 hover:border-[#25B9A1]" 
          : "border-[#E2E8F0] hover:border-[#2ED3B7]"
      )}
      data-testid={`card-event-${event.id}`}
    >
      {isSponsored && (
        <div className="bg-gradient-to-r from-[#2ED3B7] to-[#25B9A1] text-white text-xs font-medium px-3 py-1 rounded-t-2xl flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Promowane
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/event/${event.id}`} className="flex-1 min-w-0">
            <h3 
              className="font-heading font-semibold text-lg leading-tight line-clamp-2 text-[#0F172A] hover:text-[#2ED3B7] transition-colors cursor-pointer"
              data-testid={`text-event-title-${event.id}`}
            >
              {event.title}
            </h3>
          </Link>
          {event.isAiAdded && (
            <Badge variant="outline" className="shrink-0 gap-1 text-xs border-[#2ED3B7] text-[#2ED3B7] bg-[#E6FAF7]">
              <Sparkles className="w-3 h-3" />
              AI
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-[#475569]">
            <Calendar className="w-4 h-4 text-[#2ED3B7]" />
            <span data-testid={`text-event-date-${event.id}`}>{formatEventDate()}</span>
          </div>
          
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs border",
              event.isOnline 
                ? "bg-teal-50 text-teal-700 border-teal-200" 
                : "bg-slate-100 text-slate-600 border-slate-200"
            )}
          >
            {event.isOnline ? (
              <>
                <Globe className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 mr-1" />
                {event.location || "Lokalizacja"}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0 pb-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.specializations.slice(0, 3).map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="text-xs bg-[#E6FAF7] text-[#0F766E] border border-[#99F6E4]"
              >
                {SPECIALIZATION_LABELS[spec as Specialization] || spec}
              </Badge>
            ))}
            {event.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs text-[#64748B] border-[#E2E8F0]">
                +{event.specializations.length - 3}
              </Badge>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed" data-testid={`text-event-desc-${event.id}`}>
              {event.description}
            </p>
          )}
        </CardContent>
      )}

      <CardFooter className="pt-0 flex flex-wrap items-center gap-2">
        {event.hasEducationalPoints && (
          <Badge variant="secondary" className="gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
            <GraduationCap className="w-3 h-3" />
            {event.educationalPoints 
              ? `${event.educationalPoints} pkt` 
              : "Punkty edukacyjne"
            }
          </Badge>
        )}
        
        <Badge variant="secondary" className={cn("text-xs border", priceInfo.className)}>
          {priceInfo.label}
        </Badge>

        {event.tags?.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs text-[#64748B] border-[#E2E8F0]">
            {TAG_LABELS[tag as EventTag] || tag}
          </Badge>
        ))}

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          className="text-[#64748B] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
          onClick={handleShare}
          data-testid={`button-share-${event.id}`}
        >
          <Share2 className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 rounded-full border-[#E2E8F0] text-[#475569] hover:border-[#2ED3B7] hover:text-[#2ED3B7]" 
              data-testid={`button-add-calendar-${event.id}`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Kalendarz</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-[#E2E8F0] shadow-lg rounded-lg">
            <DropdownMenuItem 
              onClick={() => handleCalendarAdd("google", () => window.open(getGoogleCalendarUrl(event), "_blank"))}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              <SiGooglecalendar className="w-4 h-4 mr-2" />
              Google Calendar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleCalendarAdd("outlook", () => window.open(getOutlookCalendarUrl(event), "_blank"))}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Outlook
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleCalendarAdd("ics", () => downloadICSFile(event))}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              <SiApple className="w-4 h-4 mr-2" />
              Apple Calendar (.ics)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {event.sourceUrl && (
          <Button 
            size="sm"
            className="gap-1 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
            onClick={handleRegistrationClick}
            data-testid={`button-registration-${event.id}`}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Strona wydarzenia</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
