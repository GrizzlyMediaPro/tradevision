"use client";

import { FaTimes } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const ITEM_IDS = ["1", "2", "3", "4", "5"] as const;

export function WebinarNotForYouSection() {
  const t = useT();
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
        <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("webinar.notForYou.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
            {t("webinar.notForYou.intro")}
            <span className="text-white/80">{t("webinar.notForYou.highlight")}</span>
          </p>
        </div>

          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-10 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-left">
            <ul className="flex flex-col gap-4">
              {ITEM_IDS.map((id) => (
                <li key={id} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 border border-red-400/30">
                    <FaTimes className="h-2.5 w-2.5 text-red-400" />
                  </span>
                  <p className="text-xs md:text-sm text-white/65 leading-relaxed">
                    {t(`webinar.notForYou.${id}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
