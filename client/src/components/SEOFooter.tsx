import { Link } from "wouter";
import { KonfyLogo } from "./KonfyLogo";
import { SPECIALIZATION_SEO, PILLAR_PAGES } from "@/lib/seo-data";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@shared/schema";

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
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Agregator konferencji i szkoleń medycznych w Polsce. Automatycznie aktualizowana baza wydarzeń dla lekarzy wszystkich specjalizacji.
            </p>
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
              {topSpecializations.map(spec => (
                <li key={spec}>
                  <Link 
                    href={`/${SPECIALIZATION_SEO[spec].slug}`} 
                    className="text-[#CBD5E1] hover:text-[#2ED3B7] transition-colors text-sm"
                  >
                    {SPECIALIZATION_LABELS[spec]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-[#94A3B8]">
              Więcej specjalizacji
            </h3>
            <ul className="space-y-2">
              {SPECIALIZATIONS.slice(8).map(spec => (
                <li key={spec}>
                  <Link 
                    href={`/${SPECIALIZATION_SEO[spec].slug}`} 
                    className="text-[#CBD5E1] hover:text-[#2ED3B7] transition-colors text-sm"
                  >
                    {SPECIALIZATION_LABELS[spec]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#1E293B] text-center text-sm text-[#64748B]">
          <p>Konfy.pl - Wszystkie konferencje medyczne w jednym miejscu</p>
          <p className="mt-2">Automatycznie aktualizowane co 48h. Dane pochodzą ze źródeł publicznych.</p>
        </div>
      </div>
    </footer>
  );
}
