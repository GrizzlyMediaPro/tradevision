import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a site-ului Trade Vision România, operate de TRADE VISION HUB TRADING SRL.",
};

export default function TermeniConditiiPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      description="Reguli pentru utilizarea site-ului și a serviciilor puse la dispoziție de TRADE VISION HUB TRADING SRL."
    >
      <p className="text-sm text-white/55">
        Ultima actualizare: <time dateTime="2026-04-03">3 aprilie 2026</time>
      </p>

      <LegalSection title="1. Dispoziții generale">
        <p>
          Acești termeni și condiții se aplică utilizării site-ului și
          serviciilor conexe puse la dispoziție sub marca{" "}
          <strong>Trade Vision România</strong> (în continuare „Site-ul”),
          operate de <strong>TRADE VISION HUB TRADING SRL</strong>, CUI{" "}
          <strong>54265198</strong> (în continuare „Operatorul”).
        </p>
        <p>
          Vă rugăm să citiți cu atenție acest document înainte de a utiliza
          Site-ul. Prin accesare și utilizare acceptați să respectați acești
          termeni, împreună cu{" "}
          <Link href="/politica-confidentialitate">
            Politica de confidențialitate
          </Link>{" "}
          și{" "}
          <Link href="/politica-cookies">Politica de cookies</Link>, care fac
          parte integrantă din înțelegerea dintre dumneavoastră și Operator.
        </p>
      </LegalSection>

      <LegalSection title="2. Acceptarea termenilor">
        <p>
          Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați
          Site-ul. Continuarea navigării, trimiterea de mesaje prin
          formulare, abonarea la newsletter sau crearea unui cont (dacă este
          disponibilă) reprezintă acceptarea condițiilor în forma actuală.
        </p>
        <p>
          Operatorul își poate actualiza periodic acești termeni. Versiunea
          în vigoare este publicată pe Site; utilizarea ulterioară după
          modificări constituie acceptarea noilor condiții, în măsura permisă
          de lege.
        </p>
      </LegalSection>

      <LegalSection title="3. Descrierea serviciilor">
        <p>
          Site-ul oferă conținut informativ și educațional despre piețe
          financiare, prop firms, cursuri și resurse pentru traderi, precum și
          funcții tehnice (ex.: salvarea progresului la cursuri gratuite în
          browser, formulare de contact, newsletter).
        </p>
        <p>
          Conținutul are caracter general și nu constituie sfat financiar,
          recomandare personalizată de investiții sau ofertă de a cumpăra sau de a
          vinde instrumente financiare.
        </p>
      </LegalSection>

      <LegalSection title="4. Eligibilitate și utilizare corectă">
        <ul>
          <li>
            Utilizarea Site-ul este destinată persoanelor cu vârsta de cel
            puțin <strong>18 ani</strong>.
          </li>
          <li>
            Vă angajați să furnizați informații adevărate acolo unde vi se
            solicită (ex.: formulare, cont utilizator).
          </li>
          <li>
            Este interzisă utilizarea Site-ului în scopuri ilegale, pentru a
            perturba funcționarea platformei, pentru scraping abuziv sau pentru
            a încălca drepturile terților.
          </li>
        </ul>
        <p>
          Operatorul își rezervă dreptul de a restricționa sau încheia accesul
          în caz de încălcare gravă a acestor reguli.
        </p>
      </LegalSection>

      <LegalSection title="5. Stocare locală în browser (localStorage)">
        <p>
          Pentru progres la cursuri gratuite, Site-ul poate salva date în{" "}
          <strong>localStorage</strong> doar dacă ați selectat în bannerul de
          cookie-uri <strong>Doar necesare</strong> sau{" "}
          <strong>Acceptă tot</strong>. Dacă alegeți <strong>Deloc</strong>, nu
          stocăm aceste date în browser; progresul nu va fi păstrat după
          închiderea sesiunii sau reîncărcarea paginii.
        </p>
        <p>
          Aceste informații rămân pe dispozitiv și nu sunt transmise automat
          către serverele Operatorului, în afara cazurilor prevăzute în{" "}
          <Link href="/politica-confidentialitate">
            Politica de confidențialitate
          </Link>
          .
        </p>
        <p>
          Puteți șterge datele din setările browserului; unele funcții s-ar
          putea reseta sau deveni indisponibile.
        </p>
      </LegalSection>

      <LegalSection title="6. Cont de utilizator">
        <p>
          Dacă Site-ul permite autentificare prin terți (ex.: furnizor de
          identitate), relația privind contul este guvernată și de termenii
          acelui furnizor. Sunteți responsabil pentru confidențialitatea
          datelor de acces.
        </p>
      </LegalSection>

      <LegalSection title="7. Proprietate intelectuală">
        <p>
          Materialele de pe Site (texte, imagini, structură, logo-uri) sunt
          protejate de legislația aplicabilă. Este interzisă copierea,
          distribuirea sau exploatarea comercială fără acordul prealabil scris
          al Operatorului, în limitele legii.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitarea răspunderii">
        <p>
          Informațiile de pe Site sunt furnizate „ca atare”. Operatorul nu
          garantează că serviciile vor fi neîntrerupte sau fără erori.
        </p>
        <p>
          <strong>Tranzacționarea</strong> implică riscuri semnificative,
          inclusiv pierderea capitalului. Nimic de pe Site nu trebuie
          interpretat ca promisiune de profit. Performanțele trecute nu
          garantează rezultate viitoare. Vă recomandăm consultarea unui
          consilier financiar autorizat înainte de decizii de investiții.
        </p>
        <p>
          În măsura permisă de lege, Operatorul nu răspunde pentru pierderi
          rezultate din utilizarea sau incapacitatea de a utiliza Site-ul sau
          conținutul acestuia.
        </p>
      </LegalSection>

      <LegalSection title="9. Linkuri către terți">
        <p>
          Site-ul poate conține linkuri către site-uri terțe. Operatorul nu
          controlează conținutul acestora și nu își asumă răspunderea pentru
          politicile sau practicile lor.
        </p>
      </LegalSection>

      <LegalSection title="10. Forță majoră">
        <p>
          Părțile nu răspund pentru neîndeplinirea obligațiilor cauzată de
          evenimente independente de voința lor rezonabilă (forță majoră), în
          limitele prevăzute de lege.
        </p>
      </LegalSection>

      <LegalSection title="11. Lege aplicabilă și litigii">
        <p>
          Acești termeni sunt guvernați de <strong>legea română</strong>.
          Litigiile vor fi soluționate de instanțele competente din România.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Pentru întrebări legate de acești termeni:{" "}
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>
          .
        </p>
        <p>
          <strong>TRADE VISION HUB TRADING SRL</strong> · CUI 54265198
        </p>
      </LegalSection>
    </LegalPage>
  );
}
