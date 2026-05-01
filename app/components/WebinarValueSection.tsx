"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  formatCountdownUnit,
} from "../lib/webinarCountdown";

type WebinarValueSectionProps = {
  targetTimestamp: number;
};

export function WebinarValueSection({ targetTimestamp }: WebinarValueSectionProps) {
  const targetDate = useMemo(() => targetTimestamp, [targetTimestamp]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setTimeLeft(Math.max(targetDate - Date.now(), 0));

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
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(168,85,247,0.14), transparent 40%), radial-gradient(circle at 88% 12%, rgba(251,191,36,0.10), transparent 40%)",
          }}
        />

        <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-10 md:grid-cols-2 md:gap-10 md:p-12">
          <div className="flex flex-col items-start justify-center gap-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-yellow-300">
              Bonus pentru participanți
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
              După 2 ore...
            </h2>

            <div className="h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />

            <p className="max-w-lg text-sm md:text-base text-white/65 leading-relaxed">
              Vei primi acces la un{" "}
              <span className="font-semibold text-white">curs gratuit</span>{" "}
              cu tot ce ai nevoie pentru a face primul payout.
            </p>

            <Link
              href="/webinar/formular"
              className="mt-1 inline-flex w-full max-w-[340px] flex-col items-center justify-center rounded-2xl bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 sm:max-w-none sm:w-auto sm:px-8 sm:py-3.5"
            >
              <span className="text-sm font-bold tracking-wide sm:text-base">
                ÎNSCRIE-TE ACUM
              </span>
              <span className="text-[11px] font-medium text-slate-900/80 sm:text-xs">
                Înscriere la webinar live
              </span>
            </Link>

            <div className="mt-2 grid w-full max-w-[420px] grid-cols-4 gap-2 sm:gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5 sm:px-3">
                <p className="text-center text-xl font-bold leading-none text-white sm:text-2xl">
                  {formatCountdownUnit(days)}
                </p>
                <p className="mt-1 text-center text-[11px] font-medium text-white/65">
                  zile
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5 sm:px-3">
                <p className="text-center text-xl font-bold leading-none text-white sm:text-2xl">
                  {formatCountdownUnit(hours)}
                </p>
                <p className="mt-1 text-center text-[11px] font-medium text-white/65">
                  ore
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5 sm:px-3">
                <p className="text-center text-xl font-bold leading-none text-white sm:text-2xl">
                  {formatCountdownUnit(minutes)}
                </p>
                <p className="mt-1 text-center text-[11px] font-medium text-white/65">
                  minute
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5 sm:px-3">
                <p className="text-center text-xl font-bold leading-none text-white sm:text-2xl">
                  {formatCountdownUnit(seconds)}
                </p>
                <p className="mt-1 text-center text-[11px] font-medium text-white/65">
                  secunde
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center md:justify-end">
            <div className="relative w-full max-w-[520px]">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-2xl sm:max-w-[240px] md:max-w-[260px]">
                  <Image
                    src="/ChatGPT Image May 1, 2026, 01_20_56 PM.png"
                    alt="Participanți la sesiune Trade Vision"
                    fill
                    className="object-cover object-center"
                    sizes="260px"
                  />
                </div>
                <div className="mb-1 mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-3.5 py-1.5 text-[11px] font-semibold text-yellow-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
                    Sesiuni live săptămânale
                  </span>
                </div>
                <div className="pointer-events-none absolute -inset-px rounded-3xl bg-linear-to-b from-purple-500/20 via-transparent to-transparent opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
