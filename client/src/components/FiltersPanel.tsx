import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS, EVENT_TAGS, TAG_LABELS } from "@/lib/constants";
import type { EventFilters, Specialization, EventTag } from "@/lib/types";

interface FiltersPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  activeCount?: number;
}

function FilterContent({ filters, onFiltersChange }: FiltersPanelProps) {
  const [specOpen, setSpecOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);

  const handleSpecChange = (spec: Specialization, checked: boolean) => {
    const newSpecs = checked
      ? [...filters.specializations, spec]
      : filters.specializations.filter((s) => s !== spec);
    onFiltersChange({ ...filters, specializations: newSpecs });
  };

  const handleTagChange = (tag: EventTag, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter((t) => t !== tag);
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handlePriceChange = (price: "free" | "paid" | "unknown", checked: boolean) => {
    const newPrices = checked
      ? [...filters.priceType, price]
      : filters.priceType.filter((p) => p !== price);
    onFiltersChange({ ...filters, priceType: newPrices });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      specializations: [],
      eventType: "all",
      priceType: [],
      hasPoints: null,
      tags: [],
      dateFrom: null,
      dateTo: null,
    });
  };

  const activeFiltersCount =
    filters.specializations.length +
    filters.tags.length +
    filters.priceType.length +
    (filters.eventType !== "all" ? 1 : 0) +
    (filters.hasPoints !== null ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#64748B]" />
          <h2 className="font-heading font-semibold text-[#0F172A]">Filtry</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-[#E6FAF7] text-[#0F766E] border border-[#99F6E4]">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-[#64748B] hover:text-[#2ED3B7]"
            data-testid="button-clear-filters"
          >
            Wyczyść
          </Button>
        )}
      </div>

      <Separator className="bg-[#E2E8F0]" />

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#0F172A]">Zakres dat</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 text-left font-normal border-[#E2E8F0] text-[#475569] hover:border-[#2ED3B7]" 
                data-testid="button-date-from"
              >
                <CalendarIcon className="w-4 h-4" />
                {filters.dateFrom
                  ? format(filters.dateFrom, "d MMM", { locale: pl })
                  : "Od"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-[#E2E8F0]" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom || undefined}
                onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date || null })}
                locale={pl}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 text-left font-normal border-[#E2E8F0] text-[#475569] hover:border-[#2ED3B7]" 
                data-testid="button-date-to"
              >
                <CalendarIcon className="w-4 h-4" />
                {filters.dateTo
                  ? format(filters.dateTo, "d MMM", { locale: pl })
                  : "Do"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-[#E2E8F0]" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo || undefined}
                onSelect={(date) => onFiltersChange({ ...filters, dateTo: date || null })}
                locale={pl}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#475569] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date(today);
              nextWeek.setDate(today.getDate() + 7);
              onFiltersChange({ ...filters, dateFrom: today, dateTo: nextWeek });
            }}
          >
            Ten tydzień
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#475569] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
            onClick={() => {
              const today = new Date();
              const nextMonth = new Date(today);
              nextMonth.setMonth(today.getMonth() + 1);
              onFiltersChange({ ...filters, dateFrom: today, dateTo: nextMonth });
            }}
          >
            Ten miesiąc
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#475569] hover:text-[#2ED3B7] hover:bg-[#E6FAF7]"
            onClick={() => {
              const today = new Date();
              const next3Months = new Date(today);
              next3Months.setMonth(today.getMonth() + 3);
              onFiltersChange({ ...filters, dateFrom: today, dateTo: next3Months });
            }}
          >
            3 miesiące
          </Button>
        </div>
      </div>

      <Separator className="bg-[#E2E8F0]" />

      <Collapsible open={specOpen} onOpenChange={setSpecOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-[#0F172A] hover:text-[#2ED3B7]">
            <span>Specjalizacja</span>
            {specOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec} className="flex items-center gap-2">
                  <Checkbox
                    id={`spec-${spec}`}
                    checked={filters.specializations.includes(spec)}
                    onCheckedChange={(checked) => handleSpecChange(spec, !!checked)}
                    className="border-[#E2E8F0] data-[state=checked]:bg-[#2ED3B7] data-[state=checked]:border-[#2ED3B7]"
                    data-testid={`checkbox-spec-${spec}`}
                  />
                  <Label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer flex-1 text-[#475569]">
                    {SPECIALIZATION_LABELS[spec]}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="bg-[#E2E8F0]" />

      <div className="space-y-3">
        <Label className="text-sm font-medium text-[#0F172A]">Typ wydarzenia</Label>
        <RadioGroup
          value={filters.eventType}
          onValueChange={(value) => onFiltersChange({ ...filters, eventType: value as EventFilters["eventType"] })}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="type-all" className="border-[#E2E8F0] text-[#2ED3B7]" data-testid="radio-type-all" />
            <Label htmlFor="type-all" className="text-sm cursor-pointer text-[#475569]">Wszystkie</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="onsite" id="type-onsite" className="border-[#E2E8F0] text-[#2ED3B7]" data-testid="radio-type-onsite" />
            <Label htmlFor="type-onsite" className="text-sm cursor-pointer text-[#475569]">Stacjonarne</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="online" id="type-online" className="border-[#E2E8F0] text-[#2ED3B7]" data-testid="radio-type-online" />
            <Label htmlFor="type-online" className="text-sm cursor-pointer text-[#475569]">Online</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator className="bg-[#E2E8F0]" />

      <div className="space-y-3">
        <Label className="text-sm font-medium text-[#0F172A]">Cena</Label>
        <div className="space-y-2">
          {[
            { value: "free" as const, label: "Bezpłatne" },
            { value: "paid" as const, label: "Płatne" },
            { value: "unknown" as const, label: "Cena nieznana" },
          ].map((price) => (
            <div key={price.value} className="flex items-center gap-2">
              <Checkbox
                id={`price-${price.value}`}
                checked={filters.priceType.includes(price.value)}
                onCheckedChange={(checked) => handlePriceChange(price.value, !!checked)}
                className="border-[#E2E8F0] data-[state=checked]:bg-[#2ED3B7] data-[state=checked]:border-[#2ED3B7]"
                data-testid={`checkbox-price-${price.value}`}
              />
              <Label htmlFor={`price-${price.value}`} className="text-sm cursor-pointer text-[#475569]">
                {price.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#E2E8F0]" />

      <div className="flex items-center justify-between">
        <Label htmlFor="points-switch" className="text-sm font-medium cursor-pointer text-[#0F172A]">
          Punkty edukacyjne
        </Label>
        <Switch
          id="points-switch"
          checked={filters.hasPoints === true}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, hasPoints: checked ? true : null })}
          className="data-[state=checked]:bg-[#2ED3B7]"
          data-testid="switch-has-points"
        />
      </div>

      <Separator className="bg-[#E2E8F0]" />

      <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-[#0F172A] hover:text-[#2ED3B7]">
            <span>Tagi</span>
            {tagsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {EVENT_TAGS.filter((t) => !["free", "paid", "points"].includes(t)).map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                  className="border-[#E2E8F0] data-[state=checked]:bg-[#2ED3B7] data-[state=checked]:border-[#2ED3B7]"
                  data-testid={`checkbox-tag-${tag}`}
                />
                <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer text-[#475569]">
                  {TAG_LABELS[tag]}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function FiltersPanel({ filters, onFiltersChange, activeCount = 0 }: FiltersPanelProps) {
  return (
    <>
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-white/80 backdrop-blur-xl border border-[#E2E8F0]/50 rounded-2xl p-5 shadow-lg">
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="gap-2 shadow-lg bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A] rounded-full" 
              data-testid="button-filters-mobile"
            >
              <Filter className="w-5 h-5" />
              Filtry
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20 text-[#0F172A]">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 sm:w-96 bg-white border-[#E2E8F0]">
            <SheetHeader>
              <SheetTitle className="font-heading text-[#0F172A]">Filtry</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-6rem)] mt-4">
              <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
