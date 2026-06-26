import Link from "next/link";
import {
  CFTC_HYPOTHETICAL_DISCLOSURE,
  FUTURES_RISK_DISCLOSURE,
  TRADE_VISION_RISK_DISCLOSURE_PATH,
} from "@/app/data/ninjaTrader";

export function NinjaTraderDisclosures() {
  return (
    <div className="w-full border-t border-white/10 bg-black/40">
      <div className="max-w-[1250px] mx-auto px-4 py-6 space-y-4">
        <p className="text-[10px] md:text-[11px] leading-relaxed text-white/45 text-center">
          {FUTURES_RISK_DISCLOSURE}{" "}
          <Link
            href={TRADE_VISION_RISK_DISCLOSURE_PATH}
            className="text-white/60 underline underline-offset-2 hover:text-white/80 transition"
          >
            Vezi declarația completă de risc
          </Link>
        </p>
        <p className="text-[10px] md:text-[11px] leading-relaxed text-white/45 text-center">
          {CFTC_HYPOTHETICAL_DISCLOSURE}
        </p>
      </div>
    </div>
  );
}
