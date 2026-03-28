"use client";

import { useEffect, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";

const lessons = [
  {
    title: "Introducere în trading",
    description:
      "Ce e tradingul, cum funcționează piețele, ce instrumente se tranzacționează și de ce majoritatea pierd bani.",
    duration: "~20 min",
  },
  {
    title: "Cum citești un grafic",
    description:
      "Lumânările japoneze, timeframe-uri și cum interpretezi mișcarea prețului fără indicatori complicați.",
    duration: "~25 min",
  },
  {
    title: "Structura pieței și trend-uri",
    description:
      "Cum identifici dacă piața urcă, coboară sau merge lateral. Higher highs, lower lows și ce contează.",
    duration: "~25 min",
  },
  {
    title: "Lichidități și zone de interes",
    description:
      "Unde se acumulează ordinele mari, ce sunt lichiditățile și cum le folosești în avantajul tău.",
    duration: "~30 min",
  },
  {
    title: "Managementul riscului",
    description:
      "Cât riști per tranzacție, cum calculezi lot size-ul, stop loss și take profit. Regula nr. 1: protejează-ți capitalul.",
    duration: "~25 min",
  },
  {
    title: "Platforme și instrumente",
    description:
      "Setup TradingView, cum configurezi graficele, platforma de cont demo și platforma de finanțare.",
    duration: "~20 min",
  },
  {
    title: "Psihologia traderului",
    description:
      "De ce iei decizii proaste sub presiune, cum gestionezi pierderile și ce înseamnă disciplina reală în trading.",
    duration: "~20 min",
  },
  {
    title: "Prop firms: cum obții finanțare",
    description:
      "Ce sunt firmele de finanțare, cum funcționează testele, cum alegi firma potrivită și cum crești capital fără bani proprii.",
    duration: "~30 min",
  },
];

function LessonCard({
  index,
  lesson,
}: {
  index: number;
  lesson: (typeof lessons)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex gap-5 md:gap-8">
      {/* Timeline line + number */}
      <div className="flex flex-col items-center">
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)] transition-all duration-700 ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {index < lessons.length - 1 && (
          <div className="w-px flex-1 bg-linear-to-b from-purple-500/40 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 pb-10 transition-all duration-700 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <h3 className="text-sm md:text-base font-semibold text-white">
          {lesson.title}
        </h3>
        <p className="mt-2 text-xs md:text-sm text-white/50 leading-relaxed">
          {lesson.description}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-white/35">
          <FaClock className="h-3 w-3" />
          {lesson.duration}
        </span>
      </div>
    </div>
  );
}

export function CurriculumSection() {
  return (
    <section className="relative w-full overflow-hidden">
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

      <div className="relative w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            8 lecții. Un singur obiectiv: să înțelegi piața.
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            Parcurge-le în ordine. La final, o să te uiți la un grafic și o să
            știi exact ce vezi.
          </p>
        </div>

        <div className="w-full mt-12">
          {lessons.map((lesson, i) => (
            <LessonCard key={lesson.title} index={i} lesson={lesson} />
          ))}
        </div>
      </div>
    </section>
  );
}
