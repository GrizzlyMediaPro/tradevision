"use client";

import {
  FaPlayCircle,
  FaChartBar,
  FaTelegramPlane,
  FaYoutube,
  FaPercentage,
  FaRoute,
} from "react-icons/fa";

const benefits = [
  {
    icon: FaPlayCircle,
    iconColor: "text-purple-400",
    title: "8 lecții video pas cu pas",
    description:
      "De la bazele pieței la primele tale analize tehnice. Fiecare lecție construiește pe lecția anterioară.",
  },
  {
    icon: FaChartBar,
    iconColor: "text-yellow-400",
    title: "Analize pe grafice reale",
    description:
      "Fiecare concept e arătat direct pe graficele pe care tranzacționează Cristi zilnic. Nu teorie din cărți.",
  },
  {
    icon: FaTelegramPlane,
    iconColor: "text-sky-400",
    title: "Comunitate Telegram activă",
    description:
      "Alerte de sesiuni live, discuții despre piață și suport de la alți traderi care parcurg aceeași cale.",
  },
  {
    icon: FaYoutube,
    iconColor: "text-red-400",
    title: "Sesiuni live de tranzacționare",
    description:
      "Cristi tranzacționează live pe YouTube. Vezi cum ia decizii, cum gestionează riscul și cum reacționează la mișcări.",
  },
  {
    icon: FaPercentage,
    iconColor: "text-yellow-300",
    title: "Ghid firme de finanțare + reduceri",
    description:
      "Comparații obiective între firmele de finanțare. Coduri exclusive: 60% reducere la Top One, 30% reducere la Tradeify.",
  },
  {
    icon: FaRoute,
    iconColor: "text-purple-300",
    title: "Plan clar de parcurs",
    description:
      "Știi exact ce vine după fiecare lecție. Un drum logic de la zero la primele analize pe cont demo.",
  },
];

export function BenefitsSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Tot ce ai nevoie ca să faci primii pași corect
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            Fiecare lecție vine cu explicații pe grafic, exemple concrete și pași
            clari. Nu doar teorie.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 mb-5">
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
