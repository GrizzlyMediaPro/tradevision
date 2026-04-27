"use client";

import { FaUser, FaChartBar, FaArrowUp, FaShieldAlt } from "react-icons/fa";

const audience = [
  {
    icon: FaUser,
    iconColor: "text-purple-400",
    title: "Traderi la început de drum",
    description:
      "Dacă ești nou în trading și vrei să înțelegi cum funcționează cu adevărat piața, fără să te pierzi în indicatori sau strategii complicate.",
  },
  {
    icon: FaChartBar,
    iconColor: "text-yellow-300",
    title: "Traderi care încă nu sunt profitabili",
    description:
      "Dacă ai testat mai multe metode dar încă nu ai rezultate constante sau simți că lipsește o structură clară în procesul tău.",
  },
  {
    icon: FaArrowUp,
    iconColor: "text-purple-300",
    title: "Traderi care vor să devină disciplinați",
    description:
      "Dacă știi că psihologia te sabotează în decizii și ai nevoie de o strategie mecanică care să elimine emoțiile și incertitudinea.",
  },
  {
    icon: FaShieldAlt,
    iconColor: "text-yellow-400",
    title: "Traderi care vor să treacă evaluări pentru conturi finanțate",
    description:
      "Dacă vrei să fii finanțat și să tranzacționezi bani reali, dar ai nevoie de o abordare eficientă, cu risc bine gestionat și reguli clare.",
  },
];

export function WebinarAudienceSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Cine beneficiază cel mai mult de pe urma acestui workshop?
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {audience.map((item) => (
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
              <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
