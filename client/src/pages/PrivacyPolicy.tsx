import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-8">
          Polityka Prywatnosci
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-[#64748B] mb-6">
              Ostatnia aktualizacja: Styczen 2026
            </p>
            <p className="text-[#475569]">
              Niniejsza Polityka Prywatnosci okresla zasady przetwarzania i ochrony danych osobowych 
              uzytkownikow serwisu Konfy.pl (dalej: "Serwis").
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              1. Administrator danych
            </h2>
            <p className="text-[#475569]">
              Administratorem danych osobowych jest wlasciciel serwisu Konfy.pl. 
              Kontakt: hello@konfy.pl
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              2. Rodzaje zbieranych danych
            </h2>
            <p className="text-[#475569] mb-3">Zbieramy nastepujace dane:</p>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li>Adres e-mail (przy rejestracji i zapisie na newsletter)</li>
              <li>Wybrane specjalizacje medyczne</li>
              <li>Dane dotyczace korzystania z Serwisu (anonimowe statystyki)</li>
              <li>Dane techniczne (adres IP, typ przegladarki)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              3. Cele przetwarzania danych
            </h2>
            <p className="text-[#475569] mb-3">Dane przetwarzamy w celu:</p>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li>Swiadczenia uslug agregacji wydarzen medycznych</li>
              <li>Personalizacji tresci na podstawie wybranych specjalizacji</li>
              <li>Wysylki newslettera (za zgoda uzytkownika)</li>
              <li>Analizy statystycznej i doskonalenia Serwisu</li>
              <li>Realizacji obowiazkow prawnych</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              4. Podstawa prawna przetwarzania
            </h2>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li>Art. 6 ust. 1 lit. a RODO - zgoda uzytkownika</li>
              <li>Art. 6 ust. 1 lit. b RODO - wykonanie umowy</li>
              <li>Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes administratora</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              5. Pliki cookies
            </h2>
            <p className="text-[#475569] mb-3">Serwis wykorzystuje pliki cookies:</p>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li><strong>Niezbedne</strong> - wymagane do dzialania Serwisu</li>
              <li><strong>Analityczne</strong> - pomagaja zrozumiec, jak uzytkownicy korzystaja z Serwisu</li>
              <li><strong>Marketingowe</strong> - uzywane do personalizacji reklam</li>
            </ul>
            <p className="text-[#475569] mt-3">
              Mozesz zarzadzac ustawieniami cookies poprzez baner wyswietlany przy pierwszej wizycie 
              lub ustawienia przegladarki.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              6. Prawa uzytkownika
            </h2>
            <p className="text-[#475569] mb-3">Masz prawo do:</p>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li>Dostepu do swoich danych osobowych</li>
              <li>Sprostowania nieprawidlowych danych</li>
              <li>Usuniecia danych ("prawo do bycia zapomnianym")</li>
              <li>Ograniczenia przetwarzania</li>
              <li>Przenoszenia danych</li>
              <li>Wniesienia sprzeciwu wobec przetwarzania</li>
              <li>Cofniecia zgody w dowolnym momencie</li>
              <li>Wniesienia skargi do UODO</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              7. Okres przechowywania danych
            </h2>
            <p className="text-[#475569]">
              Dane przechowujemy przez okres niezbedny do realizacji celow przetwarzania, 
              nie dluzej niz do momentu cofniecia zgody lub wniesienia skutecznego sprzeciwu. 
              Dane zwiazane z umowa przechowujemy przez okres jej trwania oraz okres przedawnienia roszczen.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              8. Odbiorcy danych
            </h2>
            <p className="text-[#475569] mb-3">Dane moga byc udostepniane:</p>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li>Dostawcom uslug hostingowych</li>
              <li>Dostawcom uslug analitycznych</li>
              <li>Dostawcom uslug platniczych (Stripe)</li>
              <li>Organom publicznym (na podstawie przepisow prawa)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              9. Bezpieczenstwo danych
            </h2>
            <p className="text-[#475569]">
              Stosujemy odpowiednie srodki techniczne i organizacyjne, aby chronic dane przed 
              nieuprawnionym dostepem, utrata lub zniszczeniem. Wszystkie polaczenia sa szyfrowane 
              protokolem SSL/TLS.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              10. Kontakt
            </h2>
            <p className="text-[#475569]">
              W sprawach zwiazanych z ochrona danych osobowych prosimy o kontakt: hello@konfy.pl
            </p>
          </section>
        </div>
      </main>

      <SEOFooter />
    </div>
  );
}
