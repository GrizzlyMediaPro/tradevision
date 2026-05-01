"use client";

import Image from "next/image";
import { FaChartLine, FaYoutube, FaUsers } from "react-icons/fa";
import { TbTrendingUp } from "react-icons/tb";

const founders = [
  {
    name: "Cristi Pașatu",
    photoSrc: "/poza-cristi-pasatu.jpeg",
    role: "Co-Founder TradeVision",
    bio: "Sunt Cristi Pasatu, cu 8 ani experiență în trading și 5 ani în prop trading. Am testat sute de strategii și am învățat să tratez acest domeniu ca pe un business, nu ca pe un joc de noroc.",
    bio2: "În 2025 am retras peste 200.000$ din conturi de prop firm, folosind un sistem clar de risk management și execuție bazată pe order flow.",
    bio3: "Prin Trade Vision, ajut traderii să abordeze piața structurat și să devină profitabili și disciplinați.",
    stats: [
      { value: "Zilnic", label: "Trading activ", icon: FaChartLine },
      { value: "Live", label: "Sesiuni YouTube", icon: FaYoutube },
      { value: "500+", label: "Comunitate", icon: FaUsers },
    ],
  },
  {
    name: "Cristi Barbu",
    photoSrc: "/poza-cristi-barbu.jpeg",
    role: "Co-Founder TradeVision",
    bio: "Am descoperit trading-ul acum 2 ani și am decis să îl aprofundez serios, pentru a înțelege cum funcționează piețele financiare. Un moment cheie a fost participarea la cursul lui Cristi Pașatu, care mi-a schimbat perspectiva asupra acestui domeniu.",
    bio2: "După sute de ore de studiu și practică, în 2025 am retras peste 150.000$ din conturi de prop firm, demonstrând că trading-ul poate deveni profitabil atunci când este abordat structurat.",
    bio3: "Prin Trade Vision, îmi propun să ajut traderii la început de drum să își găsească direcția și să abordeze piața cu mai multă claritate, disciplină și încredere.",
    stats: [
      { value: "Zilnic", label: "Trading activ", icon: FaChartLine },
      { value: "Live", label: "Sesiuni YouTube", icon: FaYoutube },
      { value: "500+", label: "Comunitate", icon: FaUsers },
    ],
  },
];

export function FoundersSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Cine suntem
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            Traderi activi, nu teoreticieni. Tranzacționăm zilnic și arătăm tot
            — inclusiv greșelile.
          </p>
        </div>

        <div className="w-full flex flex-col gap-8">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 shadow-[0_8px_18px_rgba(0,0,0,0.45)] overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Photo */}
                <div className="md:w-[280px] shrink-0 flex items-center justify-center p-8 md:p-10">
                  <div className="relative h-44 w-44 md:h-52 md:w-52 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <Image
                      src={founder.photoSrc}
                      alt={founder.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 208px, 176px"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center px-6 pb-8 md:py-10 md:pr-10 md:pl-0 text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {founder.name}
                  </h3>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-purple-300">
                    <TbTrendingUp className="h-4 w-4" />
                    {founder.role}
                  </p>
                  <p className="mt-5 text-sm md:text-base text-white/55 leading-relaxed">
                    {founder.bio}
                  </p>
                  <p className="mt-3 text-sm md:text-base text-white/55 leading-relaxed">
                    {founder.bio2}
                  </p>
                  <p className="mt-3 text-sm md:text-base text-white/55 leading-relaxed">
                    {founder.bio3}
                  </p>

                  {/* Mini stats */}
                  <div className="mt-8 flex gap-10">
                    {founder.stats.map((stat) => (
                      <div key={stat.label} className="text-left">
                        <p className="text-lg md:text-xl font-bold text-yellow-300">
                          {stat.value}
                        </p>
                        <p className="text-[11px] md:text-xs text-white/40">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
