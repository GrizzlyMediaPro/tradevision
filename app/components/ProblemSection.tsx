"use client";

import { FaYoutube, FaExclamationTriangle, FaDice, FaBan } from "react-icons/fa";

const problems = [
  {
    icon: FaYoutube,
    iconColor: "text-purple-400",
    title: "50 de canale YouTube, zero sistem",
    description:
      "Fiecare cu altă strategie. Amesteci totul, nu ai un proces coerent și ajungi mai confuz ca la început.",
  },
  {
    icon: FaExclamationTriangle,
    iconColor: "text-yellow-400",
    title: "Direct pe bani reali, fără antrenament",
    description:
      'Deschizi cont live, depui bani și „înveți din mers". Piața e un profesor scump dacă nu vii pregătit.',
  },
  {
    icon: FaDice,
    iconColor: "text-purple-300",
    title: "Tranzacții pe feeling, nu pe date",
    description:
      "Fără un sistem testat și management al riscului, fiecare trade e un pariu. Și la pariuri, casa câștigă mereu.",
  },
  {
    icon: FaBan,
    iconColor: "text-red-400",
    title: "Cursuri scumpe, rezultate zero",
    description:
      "Plătești mii de euro pe programe care promit luna de pe cer. Și tot nu ai o strategie clară pe care s-o aplici.",
  },
];

export function ProblemSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        {/* Header — site style */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            De ce pierd bani 90% dintre traderii noi?
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            Nu pentru că piața ar fi imposibilă. Ci pentru că încep fără un plan
            clar și fără o fundație solidă.
          </p>
        </div>

        {/* Cards grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((item) => (
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

        {/* Bottom CTA */}
        <div className="w-full rounded-3xl border border-yellow-300/40 bg-linear-to-r from-yellow-400/15 via-yellow-300/8 to-transparent px-6 py-8 md:px-10 md:py-10">
          <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto leading-relaxed text-center">
            Cursul Trade Vision e construit exact pentru asta:{" "}
            <span className="font-semibold text-yellow-300 underline underline-offset-2 decoration-yellow-300/50">
              să îți dea fundația corectă
            </span>
            , în ordinea potrivită, cu exemple din piața reală. Gratuit, fără
            condiții ascunse.
          </p>
        </div>
      </div>
    </section>
  );
}
