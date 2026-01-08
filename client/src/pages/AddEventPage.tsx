import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar,
  MapPin,
  Globe,
  Building2,
  Mail,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AddEventPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email as string,
          type: "event_submission",
          eventTitle: data.title as string,
          eventDate: data.startDate as string,
          eventWebsite: data.website as string,
          organizerName: data.organizerName as string,
          message: data.description as string,
          utmSource: "add-event-page",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast({
        title: "Dziekujemy za zgloszenie!",
        description: "Skontaktujemy sie z Toba w ciagu 24 godzin.",
      });

      (e.target as HTMLFormElement).reset();
    } catch {
      toast({
        title: "Wystapil blad",
        description: "Sprobuj ponownie pozniej lub napisz na hello@konfy.pl",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Dodaj wydarzenie medyczne
          </h1>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            Wypelnij formularz, a my dodamy Twoje wydarzenie do bazy Konfy.pl. 
            Dodanie wydarzenia jest bezplatne.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informacje o wydarzeniu</CardTitle>
                <CardDescription>
                  Podaj szczegoly wydarzenia, ktore chcesz dodac
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nazwa wydarzenia *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="np. X Kongres Kardiologiczny 2026"
                      required
                      data-testid="input-event-title"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data rozpoczecia *</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        required
                        data-testid="input-event-start-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data zakonczenia</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        data-testid="input-event-end-date"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lokalizacja</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="Miasto lub 'Online'"
                        className="pl-10"
                        data-testid="input-event-location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Strona wydarzenia *</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://..."
                        className="pl-10"
                        required
                        data-testid="input-event-website"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Opis wydarzenia</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Krotki opis wydarzenia, glowne tematy, prelegenci..."
                      rows={4}
                      data-testid="textarea-event-description"
                    />
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-6">
                    <h3 className="font-semibold text-[#0F172A] mb-4">Dane kontaktowe organizatora</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organizerName">Nazwa organizatora *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                          <Input
                            id="organizerName"
                            name="organizerName"
                            placeholder="Nazwa firmy / towarzystwa"
                            className="pl-10"
                            required
                            data-testid="input-organizer-name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email kontaktowy *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email@organizator.pl"
                            className="pl-10"
                            required
                            data-testid="input-organizer-email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                    disabled={isSubmitting}
                    data-testid="button-submit-event"
                  >
                    {isSubmitting ? "Wysylanie..." : "Wyslij zgloszenie"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#E6FAF7] border-[#2ED3B7]/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#0F172A] mb-4">Co dalej?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#2ED3B7] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569]">
                      Weryfikujemy zgloszenie w ciagu 24h
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#2ED3B7] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569]">
                      Dodajemy wydarzenie do bazy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#2ED3B7] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569]">
                      Wydarzenie widoczne dla lekarzy
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#0F172A] mb-2">Chcesz wyrozniac wydarzenie?</h3>
                <p className="text-sm text-[#64748B] mb-4">
                  Sprawdz nasze pakiety promocji i zwieksz widocznosc swojego wydarzenia.
                </p>
                <Button variant="outline" className="w-full rounded-full border-[#2ED3B7] text-[#2ED3B7]" asChild>
                  <a href="/promuj">Zobacz pakiety</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SEOFooter />
    </div>
  );
}
