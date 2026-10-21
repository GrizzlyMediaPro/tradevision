"use client";

import { FaYoutube, FaExclamationTriangle, FaDice, FaBan } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const problems = [
  {
    id: "problem.youtube",
    icon: FaYoutube,
    iconColor: "text-purple-400",
  },
  {
    id: "problem.live",
    icon: FaExclamationTriangle,
    iconColor: "text-yellow-400",
  },
  {
    id: "problem.feeling",
    icon: FaDice,
    iconColor: "text-purple-300",
  },
  {
    id: "problem.expensive",
    icon: FaBan,
    iconColor: "text-red-400",
  },
];

export function ProblemSection() {
  const t = useT();

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        {/* Header — site style */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("problem.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            {t("problem.subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((item) => (
            <div
              key={`${item.id}.title`}
              className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 mb-5">
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                {t(`${item.id}.title`)}
              </h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                {t(`${item.id}.body`)}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="w-full rounded-3xl border border-yellow-300/40 bg-linear-to-r from-yellow-400/15 via-yellow-300/8 to-transparent px-6 py-8 md:px-10 md:py-10">
          <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto leading-relaxed text-center">
            {t("problem.cta.before")}
            <span className="font-semibold text-yellow-300 underline underline-offset-2 decoration-yellow-300/50">
              {t("problem.cta.highlight")}
            </span>
            {t("problem.cta.after")}
          </p>
        </div>
      </div>
    </section>
  );
}
