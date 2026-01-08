import { Navigation } from "@/components/Navigation";
import { SEOFooter } from "@/components/SEOFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0F172A] mb-8">
          Regulamin serwisu Konfy.pl
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-[#64748B] mb-6">
              Ostatnia aktualizacja: Styczen 2026
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              1. Postanowienia ogolne
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Niniejszy Regulamin okresla zasady korzystania z serwisu internetowego Konfy.pl (dalej: "Serwis").</li>
              <li>Wlascicielem i operatorem Serwisu jest podmiot kontaktowy pod adresem: hello@konfy.pl</li>
              <li>Korzystanie z Serwisu oznacza akceptacje niniejszego Regulaminu.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              2. Definicje
            </h2>
            <ul className="list-disc pl-6 text-[#475569] space-y-2">
              <li><strong>Uzytkownik</strong> - osoba korzystajaca z Serwisu</li>
              <li><strong>Wydarzenie</strong> - konferencja, kongres, webinar lub inne wydarzenie medyczne agregowane w Serwisie</li>
              <li><strong>Organizator</strong> - podmiot organizujacy Wydarzenie</li>
              <li><strong>Konto</strong> - indywidualne konto Uzytkownika w Serwisie</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              3. Zakres uslug
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Serwis agreguje informacje o wydarzeniach medycznych z roznych zrodel publicznych.</li>
              <li>Serwis umozliwia filtrowanie wydarzen wedlug specjalizacji, typu, daty i innych kryteriow.</li>
              <li>Serwis umozliwia eksport wydarzen do kalendarza.</li>
              <li>Serwis nie jest organizatorem Wydarzen i nie ponosi odpowiedzialnosci za ich przebieg.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              4. Konto uzytkownika
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Rejestracja w Serwisie jest bezplatna i dobrowolna.</li>
              <li>Uzytkownik zobowiazuje sie do podania prawdziwych danych.</li>
              <li>Uzytkownik jest odpowiedzialny za zachowanie poufnosci danych logowania.</li>
              <li>Konto moze zostac usuniete na zadanie Uzytkownika.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              5. Uslugi platne
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Serwis oferuje platne uslugi promocji Wydarzen dla Organizatorow.</li>
              <li>Cennik uslug dostepny jest na stronie /promuj.</li>
              <li>Platnosci realizowane sa za posrednictwem operatora Stripe.</li>
              <li>Organizator ma prawo do rezygnacji w ciagu 14 dni od zakupu, o ile usluga nie zostala jeszcze aktywowana.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              6. Odpowiedzialnosc
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Serwis doklada starannosci, aby informacje o Wydarzeniach byly aktualne i prawidlowe.</li>
              <li>Serwis nie ponosi odpowiedzialnosci za tresc stron zewnetrznych, do ktorych linkuje.</li>
              <li>Serwis nie ponosi odpowiedzialnosci za decyzje podjete na podstawie informacji z Serwisu.</li>
              <li>Uzytkownik korzysta z Serwisu na wlasna odpowiedzialnosc.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              7. Prawa autorskie
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Tresc Serwisu (teksty, grafiki, logo) stanowi wlasnosc operatora lub podmiotow trzecich.</li>
              <li>Kopiowanie tresci bez zgody jest zabronione.</li>
              <li>Informacje o Wydarzeniach pochodza ze zrodel publicznych i sa agregowane zgodnie z prawem.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              8. Reklamacje
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Reklamacje nalezy zglaszac na adres: hello@konfy.pl</li>
              <li>Reklamacja powinna zawierac opis problemu i dane kontaktowe.</li>
              <li>Odpowiedz na reklamacje zostanie udzielona w ciagu 14 dni roboczych.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              9. Zmiany Regulaminu
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>Operator zastrzega sobie prawo do zmiany Regulaminu.</li>
              <li>Zmiany wchodza w zycie po ich opublikowaniu w Serwisie.</li>
              <li>Dalsze korzystanie z Serwisu po zmianie Regulaminu oznacza jego akceptacje.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-[#0F172A] mb-4">
              10. Postanowienia koncowe
            </h2>
            <ol className="list-decimal pl-6 text-[#475569] space-y-2">
              <li>W sprawach nieuregulowanych stosuje sie przepisy prawa polskiego.</li>
              <li>Spory rozstrzygane beda przez sad wlasciwy dla siedziby operatora.</li>
              <li>Kontakt: hello@konfy.pl</li>
            </ol>
          </section>
        </div>
      </main>

      <SEOFooter />
    </div>
  );
}
