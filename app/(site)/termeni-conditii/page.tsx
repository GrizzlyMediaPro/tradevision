import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de participare la cursul de inițiere în tranzacționarea contractelor futures, organizat de TRADERS HUB S.R.L.",
};

export default function TermeniConditiiPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      description="Curs Futures"
    >
      <p className="text-sm text-white/55">
        Ultima actualizare:{" "}
        <time dateTime="2026-06-22">22 iunie 2026</time>
      </p>

      <p>
        Acest document stabilește termenii și condițiile de participare la cursul
        de inițiere în tranzacționarea contractelor futures organizat de:
      </p>
      <p>
        <strong>TRADERS HUB S.R.L.</strong>
        <br />
        CUI: <strong>54885858</strong>
        <br />
        Denumită în continuare „Organizatorul”.
      </p>
      <p>
        Prin achiziționarea și participarea la curs, participantul declară că a
        citit, înțeles și acceptat în totalitate prezentul document.
      </p>

      <LegalSection title="1. Obiectul cursului">
        <p>
          <strong>1.1.</strong> Cursul are scop exclusiv educațional și
          informativ.
        </p>
        <p>
          <strong>1.2.</strong> În cadrul cursului sunt prezentate informații
          referitoare la:
        </p>
        <ul>
          <li>funcționarea pieței futures;</li>
          <li>platforme și instrumente de tranzacționare;</li>
          <li>managementul riscului;</li>
          <li>structură de piață;</li>
          <li>strategii de tranzacționare;</li>
          <li>utilizarea conturilor de evaluare oferite de prop firms.</li>
        </ul>
        <p>
          <strong>1.3.</strong> Participarea la curs nu garantează obținerea de
          profituri, promovarea evaluărilor oferite de prop firms sau obținerea
          de payout-uri.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibilitate">
        <p>
          <strong>2.1.</strong> Participarea este permisă persoanelor care au
          împlinit vârsta de 18 ani.
        </p>
        <p>
          <strong>2.2.</strong> Participantul este responsabil pentru
          exactitatea informațiilor furnizate la înscriere.
        </p>
      </LegalSection>

      <LegalSection title="3. Preț și plată">
        <p>
          <strong>3.1.</strong> Prețul cursului este afișat pe pagina de
          prezentare și poate fi modificat de Organizator fără notificare
          prealabilă pentru înscrierile viitoare.
        </p>
        <p>
          <strong>3.2.</strong> Accesul la curs este acordat numai după
          confirmarea integrală a plății.
        </p>
        <p>
          <strong>3.3.</strong> Plata este procesată prin intermediul
          procesatorilor de plăți utilizați de Organizator.
        </p>
        <p>
          <strong>3.4.</strong> Organizatorul își rezervă dreptul de a refuza
          accesul la curs în cazul unor suspiciuni de fraudă sau chargeback.
        </p>
      </LegalSection>

      <LegalSection title="4. Politica de rambursare">
        <p>
          <strong>4.1.</strong> Având în vedere natura digitală și educațională a
          serviciului furnizat, participantul este de acord ca accesul la curs
          să înceapă imediat după confirmarea plății.
        </p>
        <p>
          <strong>4.2.</strong> Prin efectuarea plății și accesarea
          materialelor, participantul își exprimă acordul expres pentru
          începerea executării serviciului.
        </p>
        <p>
          <strong>4.3.</strong> După acordarea accesului la curs, rambursările
          nu se acordă, cu excepția situațiilor în care legea impune altfel.
        </p>
        <p>
          <strong>4.4.</strong> În cazul unor probleme tehnice imputabile
          Organizatorului care împiedică accesul la curs pentru o perioadă
          semnificativă, Organizatorul poate decide, la discreția sa, acordarea
          unei rambursări totale sau parțiale.
        </p>
      </LegalSection>

      <LegalSection title="5. Proprietate intelectuală">
        <p>
          <strong>5.1.</strong> Toate materialele furnizate în cadrul cursului
          reprezintă proprietatea intelectuală exclusivă a Organizatorului.
        </p>
        <p>
          <strong>5.2.</strong> Este strict interzisă:
        </p>
        <ul>
          <li>copierea;</li>
          <li>distribuirea;</li>
          <li>revânzarea;</li>
          <li>înregistrarea;</li>
          <li>republicarea;</li>
          <li>transmiterea către terți</li>
        </ul>
        <p>
          a materialelor, sesiunilor live sau înregistrărilor aferente cursului
          fără acordul scris al Organizatorului.
        </p>
        <p>
          <strong>5.3.</strong> Accesul la curs este personal și
          netransmisibil.
        </p>
        <p>
          <strong>5.4.</strong> Partajarea contului sau a materialelor poate
          conduce la suspendarea imediată a accesului fără drept de
          rambursare.
        </p>
      </LegalSection>

      <LegalSection title="6. Declarație privind riscurile">
        <p>
          <strong>6.1.</strong> Tranzacționarea instrumentelor financiare
          implică riscuri semnificative și poate conduce la pierderea integrală
          a capitalului utilizat.
        </p>
        <p>
          <strong>6.2.</strong> Informațiile prezentate în cadrul cursului nu
          reprezintă:
        </p>
        <ul>
          <li>consultanță financiară;</li>
          <li>consultanță de investiții;</li>
          <li>recomandări personalizate de investiții;</li>
          <li>sfaturi fiscale sau juridice.</li>
        </ul>
        <p>
          <strong>6.3.</strong> Participanții iau propriile decizii de
          tranzacționare și își asumă integral responsabilitatea pentru acestea.
        </p>
        <p>
          <strong>6.4.</strong> Organizatorul nu garantează:
        </p>
        <ul>
          <li>profituri;</li>
          <li>randamente;</li>
          <li>promovarea evaluărilor prop firms;</li>
          <li>obținerea de finanțări;</li>
          <li>obținerea de payout-uri.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Limitarea răspunderii">
        <p>
          <strong>7.1.</strong> Organizatorul nu răspunde pentru:
        </p>
        <ul>
          <li>pierderi financiare;</li>
          <li>pierderi de oportunitate;</li>
          <li>pierderi de profit;</li>
          <li>decizii de tranzacționare luate de participanți.</li>
        </ul>
        <p>
          <strong>7.2.</strong> Participanții înțeleg că rezultatele prezentate
          în exemple, studii de caz sau materiale promoționale reprezintă
          rezultate individuale și nu garantează obținerea unor rezultate
          similare.
        </p>
      </LegalSection>

      <LegalSection title="8. Conduită și acces">
        <p>
          <strong>8.1.</strong> Organizatorul își rezervă dreptul de a elimina
          din curs sau din comunitățile asociate orice participant care:
        </p>
        <ul>
          <li>manifestă comportament abuziv;</li>
          <li>distribuie materiale protejate;</li>
          <li>perturbă activitatea grupului;</li>
          <li>utilizează limbaj ofensator;</li>
          <li>promovează servicii concurente.</li>
        </ul>
        <p>
          <strong>8.2.</strong> În astfel de situații, accesul poate fi retras
          fără rambursarea sumelor achitate.
        </p>
      </LegalSection>

      <LegalSection title="9. Comunitatea privată">
        <p>
          <strong>9.1.</strong> Accesul la grupurile private de suport este
          oferit exclusiv participanților eligibili.
        </p>
        <p>
          <strong>9.2.</strong> Organizatorul poate modifica structura,
          platformele utilizate sau regulile comunității fără notificare
          prealabilă.
        </p>
      </LegalSection>

      <LegalSection title="10. Protecția datelor">
        <p>
          <strong>10.1.</strong> Organizatorul prelucrează datele cu caracter
          personal conform legislației aplicabile.
        </p>
        <p>
          <strong>10.2.</strong> Datele colectate sunt utilizate exclusiv
          pentru:
        </p>
        <ul>
          <li>procesarea înscrierii;</li>
          <li>furnizarea accesului la curs;</li>
          <li>comunicări administrative;</li>
          <li>emiterea documentelor fiscale.</li>
        </ul>
        <p>
          <strong>10.3.</strong> Datele nu vor fi vândute către terți.
        </p>
      </LegalSection>

      <LegalSection title="11. Modificarea termenilor">
        <p>
          <strong>11.1.</strong> Organizatorul poate modifica prezentul document
          în orice moment.
        </p>
        <p>
          <strong>11.2.</strong> Versiunea actualizată va fi publicată pe
          site-ul oficial sau comunicată participanților prin canalele
          utilizate de Organizator.
        </p>
      </LegalSection>

      <LegalSection title="12. Legea aplicabilă">
        <p>
          <strong>12.1.</strong> Prezentul document este guvernat de legislația
          din România.
        </p>
        <p>
          <strong>12.2.</strong> Orice litigiu va fi soluționat pe cale
          amiabilă, iar în cazul în care acest lucru nu este posibil,
          competența revine instanțelor române competente.
        </p>
      </LegalSection>

      <LegalSection title="13. Date de contact">
        <p>
          <strong>TRADERS HUB S.R.L.</strong>
          <br />
          CUI: <strong>54885858</strong>
        </p>
        <p>
          Pentru întrebări referitoare la curs sau la prezentul document,
          participanții pot contacta Organizatorul prin canalele oficiale de
          comunicare indicate pe website-ul companiei.
        </p>
      </LegalSection>

      <p>
        Prin efectuarea plății și accesarea cursului, participantul confirmă că
        a citit și acceptat integral acești Termeni și Condiții.
      </p>
    </LegalPage>
  );
}
