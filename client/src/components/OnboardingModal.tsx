import { useState, useEffect } from "react";
import { Stethoscope, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Specialization } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  isOnboardingComplete, 
  markOnboardingComplete, 
  setStoredPreferences 
} from "@/lib/preferences";

interface OnboardingModalProps {
  onComplete: (selectedSpecs: Specialization[]) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<Specialization[]>([]);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Sync with database preferences if logged in
  const savePreferencesMutation = useMutation({
    mutationFn: async (specializations: Specialization[]) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", { specializations });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences"] });
    },
  });

  useEffect(() => {
    if (!isOnboardingComplete()) {
      setOpen(true);
    }
  }, []);

  const toggleSpec = (spec: Specialization) => {
    setSelectedSpecs((prev) => {
      if (prev.includes(spec)) {
        return prev.filter((s) => s !== spec);
      }
      return [...prev, spec];
    });
  };

  const handleComplete = () => {
    setStoredPreferences(selectedSpecs);
    markOnboardingComplete();
    
    // If authenticated, sync to database
    if (isAuthenticated) {
      savePreferencesMutation.mutate(selectedSpecs);
    }
    
    setOpen(false);
    onComplete(selectedSpecs);
  };

  const handleSkip = () => {
    setStoredPreferences([]);
    markOnboardingComplete();
    
    // If authenticated, sync to database
    if (isAuthenticated) {
      savePreferencesMutation.mutate([]);
    }
    
    setOpen(false);
    onComplete([]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleSkip(); }}>
      <DialogContent className="max-w-lg bg-white border-[#E2E8F0] rounded-2xl p-0 overflow-hidden" aria-describedby={undefined}>
        <div className="bg-gradient-to-br from-[#2ED3B7] to-[#25B9A1] p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-heading text-2xl text-white">
              Witaj w MedEvents.pl
            </DialogTitle>
            <DialogDescription className="text-white/90 text-base">
              Wybierz swoje specjalizacje, aby zobaczyc najbardziej interesujace Cie wydarzenia
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#64748B] mb-4">
            Mozesz wybrac dowolna liczbe specjalizacji. Mozesz to pozniej zmienic w ustawieniach.
          </p>
          
          <ScrollArea className="h-64 pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = selectedSpecs.includes(spec);
                return (
                  <button
                    type="button"
                    key={spec}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border transition-all text-left w-full
                      ${isSelected 
                        ? "border-[#2ED3B7] bg-[#E6FAF7]" 
                        : "border-[#E2E8F0] hover:border-[#CBD5E1] bg-white"
                      }
                    `}
                    onClick={() => toggleSpec(spec)}
                    data-testid={`onboarding-spec-${spec}`}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                      ${isSelected 
                        ? "bg-[#2ED3B7] border-[#2ED3B7]" 
                        : "border-[#CBD5E1] bg-white"
                      }
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-[#0F172A]">
                      {SPECIALIZATION_LABELS[spec]}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#E2E8F0]">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-[#64748B] hover:text-[#0F172A]"
              data-testid="button-skip-onboarding"
            >
              Pomin
            </Button>
            <Button
              onClick={handleComplete}
              className="bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A] rounded-full px-6 gap-2"
              data-testid="button-complete-onboarding"
            >
              {selectedSpecs.length > 0 
                ? `Kontynuuj (${selectedSpecs.length})` 
                : "Pokaz wszystkie wydarzenia"
              }
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
