"use client";

import Image from "next/image";
import { FaChartLine, FaYoutube, FaUsers } from "react-icons/fa";
import { TbTrendingUp } from "react-icons/tb";
import { useT } from "@/lib/i18n/I18nProvider";

const founderStats = [
  { valueId: "founders.stat.daily", labelId: "founders.stat.dailyLabel", icon: FaChartLine },
  { valueId: "founders.stat.live", labelId: "founders.stat.liveLabel", icon: FaYoutube },
  { valueId: "founders.stat.community", labelId: "founders.stat.communityLabel", icon: FaUsers },
];

const founders = [
  {
    name: "Cristi Pașatu",
    photoSrc: "/poza-cristi-pasatu.jpeg",
    bioIds: ["founders.pasatu.bio1", "founders.pasatu.bio2", "founders.pasatu.bio3"],
  },
  {
    name: "Cristi Barbu",
    photoSrc: "/poza-cristi-barbu.jpeg",
    bioIds: ["founders.barbu.bio1", "founders.barbu.bio2", "founders.barbu.bio3"],
  },
];

export function FoundersSection() {
  const t = useT();

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("founders.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            {t("founders.subtitle")}
          </p>
        </div>

        <div className="w-full flex flex-col gap-8">
          {founders.map((founder) => (
            <div
              key={founder.bioIds[0]}
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
                    {t("founders.role")}
                  </p>
                  {founder.bioIds.map((bioId, index) => (
                    <p
                      key={bioId}
                      className={
                        index === 0
                          ? "mt-5 text-sm md:text-base text-white/55 leading-relaxed"
                          : "mt-3 text-sm md:text-base text-white/55 leading-relaxed"
                      }
                    >
                      {t(bioId)}
                    </p>
                  ))}

                  {/* Mini stats */}
                  <div className="mt-8 flex gap-10">
                    {founderStats.map((stat) => (
                      <div key={stat.labelId} className="text-left">
                        <p className="text-lg md:text-xl font-bold text-yellow-300">
                          {t(stat.valueId)}
                        </p>
                        <p className="text-[11px] md:text-xs text-white/40">
                          {t(stat.labelId)}
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
