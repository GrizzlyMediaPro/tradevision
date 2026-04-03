import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum prelucrăm datele cu caracter personal în cadrul Trade Vision România — TRADE VISION HUB TRADING SRL.",
};

export default function PoliticaConfidentialitatePage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      description="Informații despre prelucrarea datelor cu caracter personal conform GDPR și legislației române."
    >
      <p className="text-sm text-white/55">
        Ultima actualizare: <time dateTime="2026-04-03">3 aprilie 2026</time>
      </p>

      <LegalSection title="1. Operatorul de date">
        <p>
          <strong>Operator:</strong> TRADE VISION HUB TRADING SRL, CUI{" "}
          <strong>54265198</strong>.
        </p>
        <p>
          <strong>Contact:</strong>{" "}
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>
        </p>
        <p>
          Prezentul document descrie modul în care prelucrăm datele cu caracter
          personal în legătură cu site-ul și serviciile{" "}
          <strong>Trade Vision România</strong>. Documentul completează{" "}
          <Link href="/termeni-conditii">Termenii și condițiile</Link> și{" "}
          <Link href="/politica-cookies">Politica de cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection title="2. Principii și temeiuri legale">
        <p>
          Prelucrăm datele în conformitate cu{" "}
          <strong>Regulamentul (UE) 2016/679 (GDPR)</strong> și legislația
          română aplicabilă. Temeiurile pot include: executarea unui contract
          sau a unor măsuri precontractuale, interes legitim (ex.: securitate,
          îmbunătățirea serviciilor, măsurători agregate unde este cazul),
          obligație legală și, acolo unde este necesar,{" "}
          <strong>consimțământul</strong> dumneavoastră (ex.: newsletter,
          anumite module de marketing).
        </p>
      </LegalSection>

      <LegalSection title="3. Ce categorii de date colectăm?">
        <p>
          <strong>Date furnizate direct de dumneavoastră</strong>, de exemplu:
        </p>
        <ul>
          <li>
            prin <strong>formularul de contact</strong>: nume (dacă îl
            furnizați), adresă de e-mail, telefon (dacă îl furnizați), conținutul
            mesajului;
          </li>
          <li>
            prin <strong>newsletter / abonare la comunicări</strong>: adresă
            de e-mail și, după caz, preferințe;
          </li>
          <li>
            prin <strong>cont de utilizator</strong> (dacă este disponibil, inclusiv
            prin furnizori terți de autentificare): identificatori de cont,
            adresă de e-mail, nume afișat, în funcție de configurare.
          </li>
        </ul>
        <p>
          <strong>Date tehnice și de utilizare</strong> (inclusiv prin cookie-uri
          și instrumente de analiză / marketing, după caz): adresă IP, tip de
          browser, dispozitiv, pagini vizitate, evenimente de navigare, sursa
          traficului, identificatori anonimi sau pseudonimi legați de
          campanii.
        </p>
        <p>
          <strong>Date stocate local pe dispozitiv</strong> (ex.:{" "}
          <strong>localStorage</strong> pentru progres la cursuri gratuite): le
          folosim doar dacă ați ales în bannerul de cookie-uri opțiunea{" "}
          <strong>Doar necesare</strong> sau <strong>Acceptă tot</strong>, nu
          dacă ați ales <strong>Deloc</strong>. Aceste date rămân în browser;
          nu sunt trimise automat serverelor noastre, cu excepția cazului în
          care folosiți și formulare sau cont (date transmise separat).
        </p>
      </LegalSection>

      <LegalSection title="4. În ce scopuri utilizăm datele?">
        <ul>
          <li>răspuns la solicitările trimise prin formulare sau e-mail;</li>
          <li>trimiterea de newsletter și comunicări de marketing (cu acord);</li>
          <li>
            administrarea contului și a funcționalităților Site-ului (dacă
            există autentificare);
          </li>
          <li>
            măsurarea traficului, îmbunătățirea conținutului și a experienței
            utilizatorului;
          </li>
          <li>prevenirea abuzurilor și securitatea IT;</li>
          <li>îndeplinirea obligațiilor legale (ex.: evidențe fiscale, dacă e cazul).</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Destinatari și împuterniciți">
        <p>
          Putem împărtăși date cu furnizori care ne prestează servicii strict
          necesare (ex.: <strong>găzduire</strong>, <strong>e-mail
          tranzacțional</strong>, <strong>autentificare</strong>,{" "}
          <strong>analiză și publicitate</strong> — precum Google și Meta, în
          măsura în care aceste instrumente sunt activate pe Site), numai în
          limitele contractuale și legale.
        </p>
        <p>
          Nu vindem datele dumneavoastră personale. Transferurile în afara SEE
          pot avea loc pe baza unor garanții adecvate (ex.: clauze contractuale
          tip), acolo unde furnizorii sunt situați în astfel de jurisdicții.
        </p>
      </LegalSection>

      <LegalSection title="6. Durata păstrării">
        <p>
          Păstrăm datele atât timp cât este necesar pentru scopurile pentru
          care au fost colectate, inclusiv pentru respectarea termenelor
          legale de arhivare. Mesajele de contact și datele de newsletter sunt
          păstrate conform politicilor interne și până la retragerea
          consimțământului sau ștergerea contului, după caz.
        </p>
      </LegalSection>

      <LegalSection title="7. Drepturile dumneavoastră">
        <p>
          În condițiile GDPR aveți dreptul la informare, acces, rectificare,
          ștergere, restricționare, opoziție (inclusiv la marketing), portabilitate
          (unde este aplicabil) și dreptul de a vă retrage consimțământul
          fără a afecta legalitatea prelucrării anterioare.
        </p>
        <p>
          Vă puteți exercita drepturile prin e-mail la{" "}
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>.
          De asemenea, aveți dreptul de a depune o plângere la{" "}
          <strong>
            Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
            Caracter Personal (ANSPDCP)
          </strong>
          , București —{" "}
          <a
            href="https://www.dataprotection.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.dataprotection.ro
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Securitate">
        <p>
          Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja
          datele. Nicio transmisie pe internet nu este complet sigură;
          vă rugăm să protejați și dumneavoastră credențialele și dispozitivele.
        </p>
      </LegalSection>

      <LegalSection title="9. Modificări">
        <p>
          Putem actualiza această politică. În cazul unor modificări esențiale,
          putem notifica prin Site sau prin alte canale adecvate.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
