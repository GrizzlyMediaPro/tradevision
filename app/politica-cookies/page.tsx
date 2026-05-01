import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Cookies | Trade Vision",
  description: "Informații despre cookie-urile utilizate de Trade Vision.",
};

export default function PoliticaCookiesPage() {
  const content = `Politica de Cookies

Această politică reglementează utilizarea cookie-urilor și stabilește temeiul legal al companiei TRADING INSTITUTIONAL S.R.L. pentru utilizarea cookie-urilor și tehnologiilor similare pe website-ul www.tradinginstitutional.ro sau pe sisteme care au legătură cu acesta.

Această politică de cookie-uri este valabilă începând cu data de 24.01.2023.

Modulele de cookie „esențiale” sunt plasate automat pe calculator, laptop sau orice dispozitiv ce poate accesa sau acționa pe site-ul companiei. Informații adiționale despre cookie-urile esențiale se găsesc în secțiunea de mai jos intitulată „Despre cookie-uri”.

Informații despre modul în care este oferit consimțământul pentru cookie-uri non-esențiale și despre modul cum se poate retrage acest consimțământ se găsesc în secțiunea intitulată „Cum se acceptă sau se resping cookie-urile”.

Cuprins:
– Despre cookie-uri
– Tipurile de cookie-uri utilizate
– Cookie-uri esențiale
– Cookie-uri non-esențiale
– Cum se acceptă sau se resping cookie-urile

Despre cookie-uri

Ce sunt cookie-urile?

Fișierele cookie sunt fișiere text mici trimise de serverul unui site web către un browser (ex: Chrome, Firefox, Safari, Opera), apoi stocate în memoria RAM sau pe unitatea de hard disk.

Acestea pot fi utilizate cu scopuri diferite, cum ar fi:
– personalizarea site-ului web în funcție de nevoile utilizatorului;
– ajutarea unui utilizator să navigheze mai ușor pe site;
– îmbunătățirea calității site-ului;
– stocarea preferințelor și informațiilor de conectare.

Cookie-uri esențiale și neesențiale

Cookie-urile pot fi clasificate drept „esențiale” sau „neesențiale”.

Cookie-uri esențiale:
Prezintă una dintre următoarele două caracteristici:
1. Sunt utilizate exclusiv pentru efectuarea sau facilitarea comunicării într-o rețea.
2. Sunt strict necesare pentru furnizarea unui serviciu online (de exemplu, site-ul nostru sau un serviciu de pe acesta) solicitat de către dumneavoastră.

Cookie-uri neesențiale:
Acestea nu se încadrează în definiția cookie-urilor esențiale, deoarece nu sunt strict necesare pentru funcționarea site-ului. Exemple:
– cookie-uri utilizate pentru analizarea comportamentului pe site (cookie-uri „analitice”);
– cookie-uri utilizate pentru afișarea de reclame.

Cookie-uri de sesiune și persistente

Cookie-urile pot fi de două tipuri: „de sesiune” și „persistente”, în funcție de perioada de stocare după plasarea lor în browser.

Cookie-urile de sesiune: rămân pe dispozitiv atâta timp cât browserul este deschis și expiră odată cu închiderea acestuia.

Cookie-urile persistente: expiră la o dată fixă sau când sunt șterse manual din browser.

Cum se acceptă sau se resping cookie-urile

Vă puteți gestiona setările de cookie din browserul pe care îl utilizați. Urmați instrucțiunile furnizate de browser pentru a accepta, elimina sau respinge cookie-urile.

Vă rugăm să rețineți că cookie-urile noastre joacă un rol important în funcționarea serviciilor. Dacă decideți să nu le acceptați, acest lucru ar putea afecta disponibilitatea și funcționalitatea anumitor funcții care fac platforma noastră ușor de utilizat și atractivă.

De exemplu, atunci când dezactivați cookie-urile, este posibil să fie nevoie să vă conectați manual la fiecare vizită.

Puteți accepta sau respinge unele sau toate modulele cookie (de exemplu, blocând cookie-urile terților), ajustând setările browserului. Instrucțiunile pentru cele mai populare browsere se găsesc aici:

– Google Chrome: https://support.google.com/chrome/answer/95647?hl=ro

– Mozilla Firefox: https://support.mozilla.org/en-US/kb/delete-browsing-search-download-history-firefox`;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Politica de Cookies</h1>
      <pre className="mt-8 whitespace-pre-wrap text-sm leading-7 text-white/85 sm:text-base">
        {content}
      </pre>
    </main>
  );
}
