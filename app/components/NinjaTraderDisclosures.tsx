"use client";

import Link from "next/link";
import { TRADE_VISION_RISK_DISCLOSURE_PATH } from "@/app/data/ninjaTrader";
import { useT } from "@/lib/i18n/I18nProvider";

export function NinjaTraderDisclosures() {
  const t = useT();

  return (
    <div className="w-full border-t border-white/10 bg-black/40">
      <div className="max-w-[1250px] mx-auto px-4 py-6 space-y-4">
        <p className="text-[10px] md:text-[11px] leading-relaxed text-white/45 text-center">
          {t("disclosure.futures")}{" "}
          <Link
            href={TRADE_VISION_RISK_DISCLOSURE_PATH}
            className="text-white/60 underline underline-offset-2 hover:text-white/80 transition"
          >
            {t("footer.riskLink")}
          </Link>
        </p>
        <p className="text-[10px] md:text-[11px] leading-relaxed text-white/45 text-center">
          {t("disclosure.cftc")}
        </p>
      </div>
    </div>
  );
}
