"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  formatCountdownUnit,
  getWebinarCountdownTarget,
} from "../lib/webinarCountdown";

export function WebinarNextSection() {
  const targetDate = useMemo(() => getWebinarCountdownTarget(), []);
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(targetDate - Date.now(), 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black to-transparent sm:h-32" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
        <div className="w-full flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-yellow-300">
            Următorul webinar live
          </span>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
              Live luni, 4 Mai la ora 19:00
            </h2>
            <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
            <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
              Workshop live pentru traderii care vor un sistem clar și rezultate
              consistente, lună de lună.
            </p>
          </div>

          <Link
            href="/webinar/formular"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer"
          >
            ÎNSCRIE-TE ACUM
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <div className="grid grid-cols-4 gap-3 w-full max-w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              <p className="text-center text-2xl md:text-3xl font-bold leading-none text-white">
                {formatCountdownUnit(days)}
              </p>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/55">
                zile
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              <p className="text-center text-2xl md:text-3xl font-bold leading-none text-white">
                {formatCountdownUnit(hours)}
              </p>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/55">
                ore
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              <p className="text-center text-2xl md:text-3xl font-bold leading-none text-white">
                {formatCountdownUnit(minutes)}
              </p>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/55">
                minute
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              <p className="text-center text-2xl md:text-3xl font-bold leading-none text-white">
                {formatCountdownUnit(seconds)}
              </p>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/55">
                secunde
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
