import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, Settings, X } from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "konfy_cookie_consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const acceptNecessary = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
        <Card className="max-w-4xl mx-auto p-6 bg-white shadow-lg border-[#E2E8F0] pointer-events-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-3 flex-1">
              <Cookie className="w-6 h-6 text-[#2ED3B7] shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-sm text-[#475569]">
                  Uzywamy plikow cookies, aby zapewnic najlepsza jakosc korzystania z naszej strony. 
                  Niektore cookies sa niezbedne do dzialania serwisu, inne pomagaja nam analizowac ruch 
                  i personalizowac tresci.{" "}
                  <Link href="/polityka-prywatnosci" className="text-[#2ED3B7] underline">
                    Dowiedz sie wiecej
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="rounded-full gap-1"
                data-testid="button-cookie-settings"
              >
                <Settings className="w-4 h-4" />
                Ustawienia
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="rounded-full"
                data-testid="button-cookie-reject"
              >
                Tylko niezbedne
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                data-testid="button-cookie-accept"
              >
                Akceptuj wszystkie
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#2ED3B7]" />
              Ustawienia cookies
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-md">
                <div className="space-y-1">
                  <Label className="font-medium">Niezbedne</Label>
                  <p className="text-xs text-[#64748B]">
                    Wymagane do dzialania strony. Nie mozna ich wylaczyc.
                  </p>
                </div>
                <Switch checked disabled className="data-[state=checked]:bg-[#2ED3B7]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-md">
                <div className="space-y-1">
                  <Label className="font-medium">Analityczne</Label>
                  <p className="text-xs text-[#64748B]">
                    Pomagaja nam zrozumiec, jak uzytkownicy korzystaja ze strony.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences((p) => ({ ...p, analytics: checked }))
                  }
                  className="data-[state=checked]:bg-[#2ED3B7]"
                  data-testid="switch-analytics"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-md">
                <div className="space-y-1">
                  <Label className="font-medium">Marketingowe</Label>
                  <p className="text-xs text-[#64748B]">
                    Uzywane do personalizacji reklam i mierzenia ich skutecznosci.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences((p) => ({ ...p, marketing: checked }))
                  }
                  className="data-[state=checked]:bg-[#2ED3B7]"
                  data-testid="switch-marketing"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={acceptNecessary}
                className="rounded-full"
              >
                Tylko niezbedne
              </Button>
              <Button
                onClick={saveCustom}
                className="rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                data-testid="button-save-cookie-settings"
              >
                Zapisz ustawienia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
