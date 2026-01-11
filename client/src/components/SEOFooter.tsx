import { Link } from "wouter";
import { KonfyLogo } from "./KonfyLogo";
import { SPECIALIZATION_SEO, PILLAR_PAGES } from "@/lib/seo-data";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@shared/schema";
import { SiFacebook, SiInstagram } from "react-icons/si";

export function SEOFooter() {
  const topSpecializations = SPECIALIZATIONS.slice(0, 8);

  return (
    <footer className="bg-[#0F172A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Link href="/" className="inline-block">
                <div className="flex items-baseline">
                  <span className="font-heading font-semibold text-xl text-white tracking-tight">konfy</span>
                  <span className="font-heading font-semibold text-xl text-[#2ED3B7] tracking-tight">.pl</span>
                </div>
              </Link>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">
              Agregator konferencji i szkoleń medycznych w Polsce. Automatycznie aktualizowana baza wydarzeń dla lekarzy wszystkich specjalizacji.
            </p>
            <div className="flex items-center gap-3 mb-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61586301957716" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors"
                data-testid="link-facebook"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/konfy.pl/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors"
                data-testid="link-instagram"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#1E293B] text-[#2ED3B7] rounded-full text-xs font-medium">
                Punkty edukacyjne
              </span>
              <span className="px-3 py-1.5 bg-[#1E293B] text-[#2ED3B7] rounded-full text-xs font-medium">
                Automatyczne aktualizacje
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#94A3B8]">
              Kategorie
            </h3>
            <ul className="space-y-2">
              {Object.values(PILLAR_PAGES).map(page => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="text-[#CBD5E1] hover:text-[#2ED3B7] transition-colors text-sm">
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#94A3B8]">
              Specjalizacje
            </h3>
            <ul className="space-y-2">
              {topSpecializations.map(spec => {
                const seoData = SPECIALIZATION_SEO[spec];
                if (!seoData) return null;
                return (
                  <li key={spec}>
                    <Link 
                      href={`/${seoData.slug}`} 
                      className="text-[#CBD5E1] hover:text-[#2ED3B7] transition-colors text-sm"
                    >
                      {SPECIALIZATION_LABELS[spec]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#94A3B8]">
              Więcej specjalizacji
            </h3>
            <ul className="space-y-2">
              {SPECIALIZATIONS.slice(8, 16).map(spec => {
                const seoData = SPECIALIZATION_SEO[spec];
                if (!seoData) return null;
                return (
                  <li key={spec}>
                    <Link 
                      href={`/${seoData.slug}`} 
                      className="text-[#CBD5E1] hover:text-[#2ED3B7] transition-colors text-sm"
                    >
                      {SPECIALIZATION_LABELS[spec]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#1E293B]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-sm text-[#64748B]">
              <p>Konfy.pl - Wszystkie konferencje medyczne w jednym miejscu</p>
              <p className="mt-1">Automatycznie aktualizowane co 48h. Dane pochodza ze zrodel publicznych.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/polityka-prywatnosci" className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors">
                Polityka Prywatnosci
              </Link>
              <Link href="/regulamin" className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors">
                Regulamin
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("konfy_cookie_consent");
                  window.location.reload();
                }}
                className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors"
                data-testid="button-cookie-settings-footer"
              >
                Ustawienia cookies
              </button>
              <a href="mailto:hello@konfy.pl" className="text-[#94A3B8] hover:text-[#2ED3B7] transition-colors">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
