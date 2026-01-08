import { useState, useEffect } from "react";
import { Check, Stethoscope, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Specialization } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  getStoredPreferences, 
  setStoredPreferences,
  markOnboardingComplete 
} from "@/lib/preferences";

interface SpecializationPickerProps {
  selectedSpecs: Specialization[];
  onSpecsChange: (specs: Specialization[]) => void;
}

export function SpecializationPicker({ selectedSpecs, onSpecsChange }: SpecializationPickerProps) {
  const [open, setOpen] = useState(false);
  const [localSpecs, setLocalSpecs] = useState<Specialization[]>(selectedSpecs);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalSpecs(selectedSpecs);
  }, [selectedSpecs]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (specializations: Specialization[]) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", { specializations });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences"] });
    },
  });

  const toggleSpec = (spec: Specialization) => {
    setLocalSpecs((prev) => {
      if (prev.includes(spec)) {
        return prev.filter((s) => s !== spec);
      }
      return [...prev, spec];
    });
  };

  const handleApply = () => {
    setStoredPreferences(localSpecs);
    markOnboardingComplete();
    
    if (isAuthenticated) {
      savePreferencesMutation.mutate(localSpecs);
    }
    
    onSpecsChange(localSpecs);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalSpecs([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-14 px-4 bg-white border-[#E2E8F0] rounded-full shadow-sm hover:border-[#2ED3B7] gap-2 min-w-[180px] justify-between"
          data-testid="button-specialization-picker"
        >
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#2ED3B7]" />
            <span className="text-[#475569] font-normal">
              {selectedSpecs.length > 0 
                ? `${selectedSpecs.length} ${selectedSpecs.length === 1 ? 'specjalizacja' : 'specjalizacje'}`
                : 'Specjalizacje'
              }
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#64748B]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-white border-[#E2E8F0] shadow-xl rounded-2xl" 
        align="start"
      >
        <div className="p-4 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-[#0F172A]">
              Wybierz specjalizacje
            </h3>
            {localSpecs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-[#64748B] hover:text-[#2ED3B7] text-xs"
              >
                Wyczysc
              </Button>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Pokaz tylko wydarzenia dla wybranych specjalizacji
          </p>
        </div>
        
        <ScrollArea className="h-72">
          <div className="p-2 space-y-1">
            {SPECIALIZATIONS.map((spec) => {
              const isSelected = localSpecs.includes(spec);
              return (
                <button
                  type="button"
                  key={spec}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all
                    ${isSelected 
                      ? "bg-[#E6FAF7]" 
                      : "hover:bg-[#F8FAFC]"
                    }
                  `}
                  onClick={() => toggleSpec(spec)}
                  data-testid={`spec-option-${spec}`}
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
                  <span className={`text-sm ${isSelected ? "font-medium text-[#0F172A]" : "text-[#475569]"}`}>
                    {SPECIALIZATION_LABELS[spec]}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#E2E8F0] flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-[#64748B]"
          >
            Anuluj
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A] rounded-full px-6"
            data-testid="button-apply-specs"
          >
            Zastosuj
            {localSpecs.length > 0 && (
              <Badge className="ml-2 bg-white/20 text-[#0F172A] border-0">
                {localSpecs.length}
              </Badge>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
