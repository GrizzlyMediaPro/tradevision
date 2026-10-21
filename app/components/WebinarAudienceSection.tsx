"use client";

import { FaUser, FaChartBar, FaArrowUp, FaShieldAlt } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const audience = [
  { id: "1", icon: FaUser, iconColor: "text-purple-400" },
  { id: "2", icon: FaChartBar, iconColor: "text-yellow-300" },
  { id: "3", icon: FaArrowUp, iconColor: "text-purple-300" },
  { id: "4", icon: FaShieldAlt, iconColor: "text-yellow-400" },
] as const;

export function WebinarAudienceSection() {
  const t = useT();
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("webinar.audience.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {audience.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 mb-5">
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                {t(`webinar.audience.${item.id}.title`)}
              </h3>
              <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                {t(`webinar.audience.${item.id}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
