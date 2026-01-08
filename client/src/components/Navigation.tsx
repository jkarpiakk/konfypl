import { Link, useLocation } from "wouter";
import { Calendar, Home, Settings, Search, Menu, X, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Navigation({ onSearch, searchQuery = "" }: NavigationProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const navLinks = [
    { href: "/", label: "Wydarzenia", icon: Home },
    { href: "/calendar", label: "Kalendarz", icon: Calendar },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2ED3B7] text-[#0F172A]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl text-[#0F172A] hidden sm:block" data-testid="text-logo">
              MedEvents.pl
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-full",
                    location === link.href 
                      ? "bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]" 
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                  )}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden sm:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                type="search"
                placeholder="Szukaj wydarzeń..."
                className="pl-10 w-full bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2ED3B7] focus:ring-[#2ED3B7]"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex gap-2 rounded-full border-[#E2E8F0] text-[#475569] hover:border-[#2ED3B7] hover:text-[#2ED3B7]" 
                data-testid="link-admin"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#475569]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E2E8F0]">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input
                  type="search"
                  placeholder="Szukaj wydarzeń..."
                  className="pl-10 w-full bg-[#F8FAFC] border-[#E2E8F0]"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  data-testid="input-search-mobile"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 rounded-lg",
                      location === link.href 
                        ? "bg-[#2ED3B7] text-[#0F172A]" 
                        : "text-[#475569]"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-nav-mobile-${link.label.toLowerCase()}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-[#475569]"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-admin-mobile"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
