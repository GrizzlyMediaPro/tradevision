"use client";

import { FaTelegramPlane, FaYoutube, FaTag } from "react-icons/fa";
import Link from "next/link";

const bonuses = [
  {
    icon: FaTelegramPlane,
    iconColor: "text-sky-400",
    title: "Grup Telegram privat",
    description:
      "Alerte zilnice, discuții despre piață, suport de la comunitate și de la Cristi direct.",
  },
  {
    icon: FaYoutube,
    iconColor: "text-red-400",
    title: "Sesiuni live pe YouTube",
    description:
      "Tradezi alături de Cristi în timp real. Vezi cum analizează și cum ia decizii pe piața live.",
  },
  {
    icon: FaTag,
    iconColor: "text-yellow-300",
    title: "Discounturi exclusive",
    description:
      "60% OFF la Top One, 30% OFF la Tradeify. Economisești sute de dolari la finanțare.",
    cta: { label: "Economii reale", href: "/firme" },
  },
];

export function BonusesSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Nu doar un curs. Un ecosistem complet.
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonuses.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-center flex flex-col items-center gap-5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40">
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                {item.description}
              </p>
              {item.cta && (
                <Link
                  href={item.cta.href}
                  className="mt-auto inline-flex items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-yellow-300 hover:bg-yellow-400/20 transition cursor-pointer"
                >
                  {item.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
