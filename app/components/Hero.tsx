"use client";

import { FaShieldAlt, FaUsers } from "react-icons/fa";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

export function Hero() {
  const t = useT();

  return (
    <section className="relative w-full min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[1250px] mx-auto px-4 py-14 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left column */}
        <div className="flex-1 flex flex-col items-start gap-6 text-left">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-300 tracking-wide">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            {t("hero.badge")}
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-white">
            {t("hero.title.start")}{" "}
            <span className="bg-linear-to-r from-purple-400 via-purple-300 to-yellow-300 bg-clip-text text-transparent">
              {t("hero.title.highlight")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/60 max-w-lg leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* CTA button */}
          <Link
            href="/curs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer mt-1"
          >
            {t("hero.cta")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-5 mt-1 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <FaShieldAlt className="h-3.5 w-3.5 text-yellow-400/70" />
              {t("hero.noCard")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaUsers className="h-3.5 w-3.5 text-purple-400/70" />
              {t("hero.students")}
            </span>
          </div>
        </div>

        {/* Right column — YouTube embed */}
        <div className="w-full lg:w-[480px] shrink-0">
          <div className="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/EfMrp8MdvDw"
                title={t("hero.videoTitle")}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Badge below video */}
            <div className="mt-3 mb-1 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-3.5 py-1.5 text-[11px] font-semibold text-yellow-300">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                {t("hero.liveBadge")}
              </span>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-px rounded-3xl bg-linear-to-b from-purple-500/20 via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
