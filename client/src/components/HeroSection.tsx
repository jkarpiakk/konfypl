import { Search, Calendar, GraduationCap, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KonfyLogo } from "@/components/KonfyLogo";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  eventCount?: number;
}

export function HeroSection({ searchQuery, onSearchChange, onSearch, eventCount }: HeroSectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E6FAF7] via-[#F8FAFC] to-[#F8FAFC]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <KonfyLogo size="xl" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[#0F172A]" data-testid="text-hero-title">
            Wszystkie wydarzenia medyczne
            <span className="block text-[#2ED3B7] mt-1">w jednym miejscu</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#475569] mb-8 max-w-2xl mx-auto leading-relaxed">
            Konferencje, kongresy, webinary i szkolenia dla lekarzy w Polsce. 
            Znajdź wydarzenia z punktami edukacyjnymi i eksportuj do kalendarza jednym kliknięciem.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <Input
                type="search"
                placeholder="Szukaj wydarzeń, specjalizacji..."
                className="pl-12 h-14 text-base bg-white border-[#E2E8F0] rounded-full shadow-sm focus:border-[#2ED3B7] focus:ring-[#2ED3B7]"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-hero-search"
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A] font-semibold rounded-full shadow-md transition-all duration-150" 
              data-testid="button-hero-search"
            >
              Szukaj
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#475569]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#E6FAF7]">
                <Calendar className="w-5 h-5 text-[#2ED3B7]" />
              </div>
              <span className="font-medium">{eventCount ? `${eventCount} wydarzeń` : "Setki wydarzeń"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#E6FAF7]">
                <GraduationCap className="w-5 h-5 text-[#2ED3B7]" />
              </div>
              <span className="font-medium">Punkty edukacyjne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#E6FAF7]">
                <Bell className="w-5 h-5 text-[#2ED3B7]" />
              </div>
              <span className="font-medium">Automatyczne aktualizacje</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
