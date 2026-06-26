import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import {
  CFTC_HYPOTHETICAL_DISCLOSURE,
  FUTURES_RISK_DISCLOSURE,
  LIVE_TRADE_ROOM_DISCLOSURE,
  TESTIMONIAL_DISCLOSURE,
} from "@/app/data/ninjaTrader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declarație de risc",
  description:
    "Divulgări de risc pentru trading futures, forex și opțiuni, performanță ipotetică, testimoniale și sesiuni live Trade Vision.",
};

export default function DeclaratieRiscPage() {
  return (
    <LegalPage
      title="Declarație de risc"
      description="Informații importante despre riscurile asociate tradingului și limitările conținutului educațional prezentat pe acest site."
    >
      <LegalSection title="Declarație generală de risc">
        <p>{FUTURES_RISK_DISCLOSURE}</p>
      </LegalSection>

      <LegalSection title="Declarație privind performanța ipotetică">
        <p>{CFTC_HYPOTHETICAL_DISCLOSURE}</p>
      </LegalSection>

      <LegalSection title="Declarație privind testimonialele">
        <p>{TESTIMONIAL_DISCLOSURE}</p>
      </LegalSection>

      <LegalSection title="Declarație pentru sala de tranzacționare live">
        <p>{LIVE_TRADE_ROOM_DISCLOSURE}</p>
      </LegalSection>

      <p className="text-xs text-white/45">
        Aceste divulgări sunt incluse în conformitate cu cerințele NinjaTrader
        Ecosystem Vendor Guidelines. Nu constituie consultanță juridică sau de
        investiții.
      </p>
    </LegalPage>
  );
}
