import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  Calendar, 
  MapPin, 
  Globe, 
  GraduationCap, 
  ExternalLink,
  ChevronDown,
  Sparkles
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
import { SPECIALIZATION_LABELS, SPECIALIZATION_COLORS, TAG_LABELS } from "@/lib/constants";
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from "@/lib/calendar";
import type { Event, Specialization, EventTag } from "@/lib/types";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

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
        return { label: "Bezpłatne", variant: "default" as const };
      case "paid":
        return { label: "Płatne", variant: "secondary" as const };
      default:
        return { label: "Cena nieznana", variant: "outline" as const };
    }
  };

  const priceInfo = getPriceLabel();

  return (
    <Card className="hover-elevate transition-all duration-150" data-testid={`card-event-${event.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/event/${event.id}`} className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer"
              data-testid={`text-event-title-${event.id}`}
            >
              {event.title}
            </h3>
          </Link>
          {event.isAiAdded && (
            <Badge variant="outline" className="shrink-0 gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              AI
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-event-date-${event.id}`}>{formatEventDate()}</span>
          </div>
          
          <Badge variant={event.isOnline ? "default" : "secondary"} className="text-xs">
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
                className={cn(
                  "text-xs",
                  SPECIALIZATION_COLORS[spec as Specialization]
                )}
              >
                {SPECIALIZATION_LABELS[spec as Specialization] || spec}
              </Badge>
            ))}
            {event.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{event.specializations.length - 3}
              </Badge>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-event-desc-${event.id}`}>
              {event.description}
            </p>
          )}
        </CardContent>
      )}

      <CardFooter className="pt-0 flex flex-wrap items-center gap-2">
        {event.hasEducationalPoints && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <GraduationCap className="w-3 h-3" />
            {event.educationalPoints 
              ? `${event.educationalPoints} pkt` 
              : "Punkty edukacyjne"
            }
          </Badge>
        )}
        
        <Badge variant={priceInfo.variant} size="sm">
          {priceInfo.label}
        </Badge>

        {event.tags?.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {TAG_LABELS[tag as EventTag] || tag}
          </Badge>
        ))}

        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1" data-testid={`button-add-calendar-${event.id}`}>
              <Calendar className="w-4 h-4" />
              Kalendarz
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        {event.sourceUrl && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(event.sourceUrl!, "_blank")}
            data-testid={`link-event-source-${event.id}`}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
