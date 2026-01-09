import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Megaphone, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2,
  Star,
  ArrowRight,
  Zap,
  Loader2
} from "lucide-react";
import { Link, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";

const packages = [
  {
    name: "Basic",
    price: "199",
    priceId: "",
    period: "tydzien",
    description: "Idealne na poczatek",
    features: [
      "Wyroznienie w liscie wydarzen",
      "Badge \"Wyrozniione\"",
      "Podstawowe statystyki",
      "Link do strony wydarzenia",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "499",
    priceId: "",
    period: "tydzien",
    description: "Najczesciej wybierane",
    features: [
      "Wszystko z Basic",
      "Pozycja #1 w liscie",
      "Wyroznienie w kalendarzu",
      "Szczegolowe statystyki",
      "Logo organizatora",
      "Priorytetowe wsparcie",
    ],
    highlighted: true,
  },
  {
    name: "Max",
    price: "999",
    priceId: "",
    period: "tydzien",
    description: "Maksymalna widocznosc",
    features: [
      "Wszystko z Pro",
      "Baner na stronie glownej",
      "Newsletter do uzytkownikow",
      "Dedykowany Account Manager",
      "Raport ROI",
    ],
    highlighted: false,
  },
];

const stats = [
  { value: "5,000+", label: "Lekarzy miesiecznie" },
  { value: "14", label: "Specjalizacji" },
  { value: "85%", label: "Wskaznik powrotu" },
];

export default function PromotePage() {
  const { toast } = useToast();
  const searchParams = useSearch();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.includes("success=true")) {
      toast({
        title: "Platnosc zakonczona pomyslnie!",
        description: "Skontaktujemy sie z Toba w ciagu 24 godzin, aby aktywowac promocje.",
      });
    } else if (searchParams.includes("canceled=true")) {
      toast({
        title: "Platnosc anulowana",
        description: "Mozesz sprobowac ponownie w dowolnym momencie.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setIsCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!email || !selectedPackage) return;
    
    setIsLoading(true);
    try {
      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: selectedPackage.priceId,
          email,
          packageName: selectedPackage.name,
        }),
      });

      if (checkoutResponse.ok) {
        const { url } = await checkoutResponse.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "promotion_purchase",
          message: `Pakiet: ${selectedPackage.name} - ${selectedPackage.price} PLN`,
          utmSource: "promote-page",
        }),
      });

      toast({
        title: "Dziekujemy za zainteresowanie!",
        description: "Skontaktujemy sie z Toba w ciagu 24 godzin z informacjami o platnosci.",
      });
      setIsCheckoutOpen(false);
      setEmail("");
    } catch {
      toast({
        title: "Wystapil blad",
        description: "Sprobuj ponownie lub napisz na hello@konfy.pl",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      
      <section className="bg-gradient-to-br from-[#2ED3B7]/10 via-white to-[#2ED3B7]/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#2ED3B7]/10 text-[#0F766E] border-[#2ED3B7]/20">
              Dla organizatorow
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
              Promuj swoje wydarzenie medyczne
            </h1>
            <p className="text-lg text-[#64748B] mb-8">
              Dotrzyj do tysiecy lekarzy szukajacych wartosciowych szkolen. 
              Zwieksz liczbe rejestracji dzieki wyroznieniu na Konfy.pl.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dodaj-wydarzenie">
                <Button size="lg" className="gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]">
                  Dodaj wydarzenie za darmo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="mailto:hello@konfy.pl">
                <Button size="lg" variant="outline" className="gap-2 rounded-full border-[#2ED3B7] text-[#2ED3B7]">
                  Porozmawiaj z nami
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-[#2ED3B7]">{stat.value}</p>
                <p className="text-sm text-[#64748B] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-4">
              Wybierz pakiet promocji
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Elastyczne pakiety dopasowane do Twoich potrzeb. Plac tylko za widocznosc.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card 
                key={pkg.name}
                className={`relative ${pkg.highlighted ? 'border-[#2ED3B7] border-2 shadow-lg' : 'border-[#E2E8F0]'}`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#2ED3B7] text-[#0F172A]">
                      <Star className="w-3 h-3 mr-1" />
                      Popularne
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#0F172A]">{pkg.price}</span>
                    <span className="text-[#64748B]"> PLN / {pkg.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#2ED3B7] shrink-0 mt-0.5" />
                        <span className="text-sm text-[#475569]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full rounded-full ${pkg.highlighted ? 'bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]' : ''}`}
                    variant={pkg.highlighted ? "default" : "outline"}
                    onClick={() => handleSelectPackage(pkg)}
                    data-testid={`button-select-${pkg.name.toLowerCase()}`}
                  >
                    Zapytaj o {pkg.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#2ED3B7]/20 flex items-center justify-center shrink-0">
                <Megaphone className="w-6 h-6 text-[#2ED3B7]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Dotrzyj do lekarzy</h3>
                <p className="text-[#94A3B8] text-sm">
                  Twoje wydarzenie zobacza lekarze szukajacy szkolen w danej specjalizacji.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#2ED3B7]/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-[#2ED3B7]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Zwieksz rejestracje</h3>
                <p className="text-[#94A3B8] text-sm">
                  Wyroznienie przyciaga uwage i zwieksza liczbe klikniec w Twoje wydarzenie.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#2ED3B7]/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 text-[#2ED3B7]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Mierz efekty</h3>
                <p className="text-[#94A3B8] text-sm">
                  Szczegolowe statystyki pokazuja ile osob zobaczyla i kliknela Twoje wydarzenie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2ED3B7]/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-[#2ED3B7]" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#0F172A] mb-4">
            Chcesz dodac wydarzenie za darmo?
          </h2>
          <p className="text-[#64748B] mb-8">
            Kazdy moze dodac wydarzenie medyczne do naszej bazy. Wyroznienie to opcjonalna 
            usluga dla organizatorow chcacych zwiekszyc widocznosc.
          </p>
          <Link href="/dodaj-wydarzenie">
            <Button size="lg" className="gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]">
              Dodaj wydarzenie za darmo
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <SEOFooter />

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selectedPackage ? `Zapytaj o pakiet ${selectedPackage.name}` : 'Zapytaj o promocje'}
            </DialogTitle>
            <DialogDescription>
              {selectedPackage && `Cena: ${selectedPackage.price} PLN / ${selectedPackage.period}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-email">Adres email</Label>
              <Input
                id="checkout-email"
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-checkout-email"
              />
            </div>
            <p className="text-sm text-[#64748B]">
              Zostaw swoj email, a skontaktujemy sie z Toba w ciagu 24 godzin, 
              aby omowic szczegoly promocji i ustalić warunki wspolpracy.
            </p>
            <Button
              className="w-full rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
              onClick={handleCheckout}
              disabled={!email || isLoading}
              data-testid="button-confirm-checkout"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wysylanie...
                </>
              ) : (
                'Wyslij zgloszenie'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
