import { Link, useLocation } from "wouter";
import { Calendar, Home, Settings, Search, Menu, X, LogIn, LogOut, Megaphone, Plus, BarChart3, PenLine } from "lucide-react";
import { KonfyLogo, KonfyIcon } from "@/components/KonfyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Navigation({ onSearch, searchQuery = "" }: NavigationProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    return "U";
  };

  const navLinks = [
    { href: "/", label: "Wydarzenia", icon: Home },
    { href: "/calendar", label: "Kalendarz", icon: Calendar },
    { href: "/blog", label: "Blog", icon: PenLine },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-[#E2E8F0]">
              <KonfyIcon size={24} />
            </div>
            <div className="hidden sm:block">
              <KonfyLogo size="md" />
            </div>
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

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/promuj">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-[#2ED3B7] text-[#2ED3B7] hover:bg-[#2ED3B7]/10"
                data-testid="button-promote-event"
              >
                <Megaphone className="w-4 h-4" />
                Promuj wydarzenie
              </Button>
            </Link>
            <Link href="/dodaj-wydarzenie">
              <Button
                size="sm"
                className="gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                data-testid="button-add-event"
              >
                <Plus className="w-4 h-4" />
                Dodaj wydarzenie
              </Button>
            </Link>
          </div>

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
            {user?.isAdmin && (
              <>
                <Link href="/analytics">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex gap-2 rounded-full border-[#E2E8F0] text-[#475569] hover:border-[#2ED3B7] hover:text-[#2ED3B7]" 
                    data-testid="link-analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Statystyki
                  </Button>
                </Link>
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
              </>
            )}
            
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-[#F1F5F9] animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "Profil"} />
                      <AvatarFallback className="bg-[#2ED3B7] text-[#0F172A] text-sm font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-[#0F172A]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="text-[#EF4444] focus:text-[#EF4444]"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Wyloguj
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="/api/login">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="hidden sm:flex gap-2 rounded-full bg-[#2ED3B7] text-[#0F172A] hover:bg-[#25B9A1]"
                  data-testid="button-login"
                >
                  <LogIn className="w-4 h-4" />
                  Zaloguj
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="sm:hidden text-[#475569]"
                  data-testid="button-login-mobile"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              </a>
            )}
            
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
              {user?.isAdmin && (
                <>
                  <Link href="/analytics">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-[#475569]"
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="link-analytics-mobile"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Statystyki
                    </Button>
                  </Link>
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
                </>
              )}

              <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
                <Link href="/promuj">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-lg border-[#2ED3B7] text-[#2ED3B7]"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-promote-event-mobile"
                  >
                    <Megaphone className="w-4 h-4" />
                    Promuj wydarzenie
                  </Button>
                </Link>
                <Link href="/dodaj-wydarzenie">
                  <Button
                    className="w-full justify-start gap-2 rounded-lg bg-[#2ED3B7] text-[#0F172A]"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-add-event-mobile"
                  >
                    <Plus className="w-4 h-4" />
                    Dodaj wydarzenie
                  </Button>
                </Link>
              </div>
              
              {!isAuthenticated && !isLoading && (
                <a href="/api/login">
                  <Button
                    variant="default"
                    className="w-full justify-start gap-2 rounded-lg bg-[#2ED3B7] text-[#0F172A]"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-login-mobile-menu"
                  >
                    <LogIn className="w-4 h-4" />
                    Zaloguj
                  </Button>
                </a>
              )}
              
              {isAuthenticated && user && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-[#EF4444]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  data-testid="button-logout-mobile"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
