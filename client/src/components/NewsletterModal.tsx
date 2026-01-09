import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bell, Mail, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: number;
  eventTitle?: string;
  mode?: "newsletter" | "reminder";
}

export function NewsletterModal({ 
  open, 
  onOpenChange, 
  eventId, 
  eventTitle,
  mode = "newsletter" 
}: NewsletterModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const subscribe = useMutation({
    mutationFn: () => 
      apiRequest("POST", "/api/newsletter/subscribe", {
        email,
        eventId,
        eventTitle,
      }),
    onSuccess: () => {
      setSuccess(true);
      toast({
        title: mode === "reminder" ? "Zapisano przypomnienie!" : "Zapisano do newslettera!",
        description: mode === "reminder" 
          ? `Wyślemy Ci przypomnienie o wydarzeniu na ${email}`
          : "Będziesz otrzymywać informacje o nowych wydarzeniach medycznych.",
      });
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setEmail("");
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Błąd",
        description: "Podaj poprawny adres email",
        variant: "destructive",
      });
      return;
    }
    subscribe.mutate();
  };

  const isReminder = mode === "reminder";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#0F172A]">
            {isReminder ? (
              <>
                <Bell className="w-5 h-5 text-[#2ED3B7]" />
                Przypomnij mi o wydarzeniu
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 text-[#2ED3B7]" />
                Zapisz się do newslettera
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
            {isReminder ? (
              <>Wyślemy Ci przypomnienie przed wydarzeniem <strong className="text-[#0F172A]">{eventTitle}</strong></>
            ) : (
              "Otrzymuj powiadomienia o nowych konferencjach, webinarach i szkoleniach medycznych."
            )}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle className="w-16 h-16 text-[#2ED3B7]" />
            <p className="text-lg font-semibold text-[#0F172A]">Gotowe!</p>
            <p className="text-sm text-[#64748B] text-center">
              {isReminder 
                ? "Wyślemy Ci przypomnienie przed wydarzeniem."
                : "Będziesz otrzymywać powiadomienia o nowych wydarzeniach."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="newsletter-email" className="text-[#0F172A]">
                Adres email
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#E2E8F0] focus:border-[#2ED3B7] focus:ring-[#2ED3B7]"
                data-testid="input-newsletter-email"
                disabled={subscribe.isPending}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-[#E2E8F0]"
                disabled={subscribe.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A]"
                disabled={subscribe.isPending}
                data-testid="button-newsletter-submit"
              >
                {subscribe.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isReminder ? (
                  "Przypomnij mi"
                ) : (
                  "Zapisz się"
                )}
              </Button>
            </div>

            <p className="text-xs text-[#94A3B8] text-center">
              Zapisując się, akceptujesz naszą{" "}
              <a href="/polityka-prywatnosci" className="text-[#2ED3B7] hover:underline">
                politykę prywatności
              </a>
              . Możesz zrezygnować w każdej chwili.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
