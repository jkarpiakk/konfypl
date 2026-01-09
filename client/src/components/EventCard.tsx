import { useState } from "react";
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
  Share2,
  Crown,
  Star,
  Zap,
  Bell,
  Mail
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from "@/lib/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Event, Specialization, EventTag, PromotionTier } from "@/lib/types";
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
}

const TAG_LABELS: Record<string, string> = {
  congress: "Kongres",
  conference: "Konferencja",
  webinar: "Webinar",
  workshop: "Warsztaty",
  course: "Kurs",
  symposium: "Sympozjum",
};

const getPromotionStyles = (tier: PromotionTier) => {
  switch (tier) {
    case "basic":
      return {
        cardClass: "border-[#2ED3B7] border-2 shadow-md",
        badge: { label: "Promowane", icon: Star, bgClass: "bg-[#E6FAF7] text-[#0F766E] border-[#99F6E4]" },
        banner: null,
      };
    case "pro":
      return {
        cardClass: "border-transparent ring-2 ring-[#2ED3B7] shadow-lg relative before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-[#2ED3B7] before:via-[#0EA5E9] before:to-[#2ED3B7] before:-z-10",
        badge: { label: "Wyróżniony Partner", icon: Crown, bgClass: "bg-gradient-to-r from-[#2ED3B7] to-[#0EA5E9] text-white border-0" },
        banner: { bgClass: "bg-gradient-to-r from-[#2ED3B7] to-[#0EA5E9]", label: "Wyróżniony Partner" },
      };
    case "max":
      return {
        cardClass: "border-transparent ring-2 ring-[#FFD700]/50 shadow-xl relative overflow-visible before:absolute before:inset-[-4px] before:rounded-2xl before:bg-gradient-to-r before:from-[#FFD700] before:via-[#FF8C00] before:to-[#FFD700] before:-z-10 before:blur-sm before:opacity-60 animate-pulse-subtle",
        badge: { label: "Premium Partner", icon: Zap, bgClass: "bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#0F172A] border-0 font-semibold" },
        banner: { bgClass: "bg-gradient-to-r from-[#FFD700] via-[#FF8C00] to-[#FFD700]", label: "Premium Partner" },
      };
    default:
      return {
        cardClass: "border-[#E2E8F0] hover:border-[#2ED3B7]",
        badge: null,
        banner: null,
      };
  }
};

const isPromotionActive = (event: Event): boolean => {
  if (!event.promotionTier || event.promotionTier === "none") return false;
  const now = new Date();
  const start = event.promotionStart ? new Date(event.promotionStart) : null;
  const end = event.promotionEnd ? new Date(event.promotionEnd) : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
};

export function EventCard({ event, compact = false }: EventCardProps) {
  const { toast } = useToast();
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderLoading, setReminderLoading] = useState(false);

  const handleReminderSubmit = async () => {
    if (!reminderEmail || !reminderEmail.includes("@")) {
      toast({ title: "Błąd", description: "Podaj poprawny adres email", variant: "destructive" });
      return;
    }
    
    setReminderLoading(true);
    try {
      await apiRequest("POST", "/api/leads", {
        email: reminderEmail,
        eventId: event.id,
        type: "reminder",
        eventTitle: event.title,
        eventDate: event.startDate,
        eventWebsite: event.sourceUrl,
        organizerName: event.organizer,
      });
      
      toast({ 
        title: "Zapisano przypomnienie", 
        description: `Wyślemy Ci email przed wydarzeniem na ${reminderEmail}` 
      });
      setReminderDialogOpen(false);
      setReminderEmail("");
      trackEvent("reminder_signup");
    } catch {
      toast({ title: "Błąd", description: "Nie udało się zapisać przypomnienia", variant: "destructive" });
    } finally {
      setReminderLoading(false);
    }
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
  const isPromoted = isPromotionActive(event);
  const promotionStyles = isPromoted ? getPromotionStyles(event.promotionTier as PromotionTier) : getPromotionStyles("none");
  const PromoBadgeIcon = promotionStyles.badge?.icon;

  return (
    <Card 
      className={cn(
        "bg-white border rounded-2xl card-hover-optimized hover:shadow-card-hover",
        promotionStyles.cardClass
      )}
      data-testid={`card-event-${event.id}`}
    >
      {promotionStyles.banner && (
        <div className={cn(
          "text-white text-xs font-medium px-3 py-1.5 rounded-t-2xl flex items-center gap-1.5",
          promotionStyles.banner.bgClass
        )}>
          {event.promotionTier === "max" ? (
            <Zap className="w-3 h-3" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {promotionStyles.banner.label}
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
          <div className="flex items-center gap-1.5 shrink-0">
            {isPromoted && promotionStyles.badge && !promotionStyles.banner && PromoBadgeIcon && (
              <Badge className={cn("gap-1 text-xs border", promotionStyles.badge.bgClass)}>
                <PromoBadgeIcon className="w-3 h-3" />
                {promotionStyles.badge.label}
              </Badge>
            )}
            {event.isAiAdded && (
              <Badge variant="outline" className="gap-1 text-xs border-[#2ED3B7] text-[#2ED3B7] bg-[#E6FAF7]">
                <Sparkles className="w-3 h-3" />
                AI
              </Badge>
            )}
          </div>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#64748B] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
              data-testid={`button-share-${event.id}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-[#E2E8F0] shadow-lg rounded-lg">
            <DropdownMenuItem 
              onClick={() => {
                const url = encodeURIComponent(`${window.location.origin}/event/${event.id}?utm_source=facebook`);
                const text = encodeURIComponent(event.title);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank", "width=600,height=400");
                trackEvent("share");
              }}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                const url = encodeURIComponent(`${window.location.origin}/event/${event.id}?utm_source=twitter`);
                const text = encodeURIComponent(`${event.title} - ${window.location.origin}/event/${event.id}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "width=600,height=400");
                trackEvent("share");
              }}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              X (Twitter)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                const url = encodeURIComponent(`${window.location.origin}/event/${event.id}?utm_source=linkedin`);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "width=600,height=400");
                trackEvent("share");
              }}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleShare}
              className="cursor-pointer hover:bg-[#F1F5F9]"
            >
              Kopiuj link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setReminderDialogOpen(true)}
              className="cursor-pointer hover:bg-[#F1F5F9] text-[#2ED3B7]"
              data-testid={`button-email-reminder-${event.id}`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Przypomnienie email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#2ED3B7]" />
                Przypomnienie o wydarzeniu
              </DialogTitle>
              <DialogDescription>
                Wyślemy Ci email przed rozpoczęciem wydarzenia "{event.title}".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-email">Adres email</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="reminder-email"
                      type="email"
                      placeholder="twoj@email.pl"
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      className="pl-10"
                      data-testid="input-reminder-email"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#64748B]">
                Przypomnienie zostanie wysłane 24h przed wydarzeniem. Twój email nie zostanie udostępniony osobom trzecim.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
                Anuluj
              </Button>
              <Button 
                onClick={handleReminderSubmit}
                disabled={reminderLoading}
                className="bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                data-testid="button-submit-reminder"
              >
                {reminderLoading ? "Zapisywanie..." : "Zapisz przypomnienie"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
