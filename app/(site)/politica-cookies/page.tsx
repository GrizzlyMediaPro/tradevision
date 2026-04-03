import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description:
    "Modul în care Trade Vision România utilizează cookie-uri și tehnologii similare pe site.",
};

export default function PoliticaCookiesPage() {
  return (
    <LegalPage
      title="Politica de cookies"
      description="Informații despre cookie-uri și tehnologii similare utilizate pe site-ul operat de TRADE VISION HUB TRADING SRL."
    >
      <p className="text-sm text-white/55">
        Ultima actualizare: <time dateTime="2026-04-03">3 aprilie 2026</time>
      </p>

      <LegalSection title="1. Operator">
        <p>
          Prezenta politică este emisă de{" "}
          <strong>TRADE VISION HUB TRADING SRL</strong>, CUI{" "}
          <strong>54265198</strong> (în continuare „Operatorul”), în legătură
          cu site-ul <strong>Trade Vision România</strong> și serviciile
          aferente.
        </p>
        <p>
          Pentru prelucrarea datelor cu caracter personal, consultați și{" "}
          <Link href="/politica-confidentialitate">
            Politica de confidențialitate
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Ce sunt cookie-urile?">
        <p>
          Cookie-urile sunt fișiere text de mici dimensiuni stocate pe
          dispozitivul dumneavoastră de către browser atunci când vizitați un
          site. Ele pot fi folosite pentru funcționarea site-ului, pentru
          securitate, pentru memorarea preferințelor sau pentru măsurarea
          audienței și publicitate.
        </p>
        <p>
          Tehnologii similare (ex.: stocare locală, pixeli de urmărire) pot
          avea roluri asemănătoare; în această politică le tratăm împreună cu
          „cookie-urile” acolo unde este relevant pentru transparență.
        </p>
      </LegalSection>

      <LegalSection title="3. Tipuri de cookie-uri">
        <p>
          <strong>Cookie-uri esențiale</strong> — necesare pentru funcții de
          bază (ex.: securitate, încărcarea corectă a paginilor, gestionarea
          sesiunii acolo unde există). Fără ele, unele părți ale site-ului ar
          putea să nu funcționeze.
        </p>
        <p>
          <strong>Cookie-uri neesențiale</strong> — nu sunt strict necesare
          pentru funcționarea de bază; includ de regulă module pentru
          analiză, publicitate sau personalizare. Acestea pot fi plasate doar
          în măsura în care legea și setările dumneavoastră permit (inclusiv
          prin mecanisme de consimțământ unde este cazul).
        </p>
        <p>
          Cookie-urile pot fi de <strong>sesiune</strong> (șterse la închiderea
          browserului) sau <strong>persistente</strong> (rămân până la expirare
          sau ștergere manuală).
        </p>
      </LegalSection>

      <LegalSection title="4. Ce folosim pe acest site?">
        <p>
          În funcție de configurația tehnică activă, Site-ul poate include:
        </p>
        <ul>
          <li>
            <strong>Google Tag Manager / Google Analytics</strong> (sau
            servicii echivalente administrate prin GTM) — pentru măsurarea
            traficului și îmbunătățirea experienței;
          </li>
          <li>
            <strong>Meta (Facebook) Pixel</strong> — pentru măsurarea
            eficienței campaniilor și, după caz, pentru publicitate
            personalizată pe platformele Meta.
          </li>
        </ul>
        <p>
          Furnizorii terți pot seta propriile cookie-uri și pot prelucra date
          conform politicilor lor. Vă încurajăm să consultați documentația
          Google și Meta pentru detalii suplimentare.
        </p>
        <p>
          <strong>Stocare în browser (localStorage)</strong> folosită pentru
          funcții precum progres la cursuri pe dispozitivul dumneavoastră nu
          este în toate cazurile un „cookie” clasic, dar poate stoca informații
          local; detalii despre datele personale transmise serverelor noastre
          se regăsesc în{" "}
          <Link href="/politica-confidentialitate">
            Politica de confidențialitate
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Cum vă puteți gestiona preferințele">
        <p>
          Puteți controla sau șterge cookie-urile din setările browserului.
          Dezactivarea anumitor cookie-uri poate afecta funcționalitatea
          Site-ului.
        </p>
        <p>Instrucțiuni pentru browsere frecvent utilizate:</p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647?hl=ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/ro/kb/cookies-informatii-site-urile-stocheaza-pe-calculatorul-dvs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari (Apple)
            </a>
          </li>
        </ul>
        <p>
          Pentru publicitate personalizată, puteți consulta și instrumentele
          oferite de terți (ex.: setări Google și Meta pentru reclame).
        </p>
      </LegalSection>

      <LegalSection title="6. Modificări">
        <p>
          Putem actualiza această politică pentru a reflecta schimbări
          tehnice sau legale. Data ultimei actualizări este indicată la
          începutul paginii.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>
        </p>
        <p>
          <strong>TRADE VISION HUB TRADING SRL</strong> · CUI 54265198
        </p>
      </LegalSection>
    </LegalPage>
  );
}
