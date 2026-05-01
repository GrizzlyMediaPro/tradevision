"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  formatCountdownUnit,
} from "../lib/webinarCountdown";

type WebinarHeroProps = {
  targetTimestamp: number;
};

export function WebinarHero({ targetTimestamp }: WebinarHeroProps) {
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
    <section className="relative isolate w-full min-h-screen overflow-hidden">
      <Image
        src="/webinarhero.png"
        alt="Banner webinar Trade Vision"
        width={1920}
        height={1080}
        priority
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[6px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.86)_20%,rgba(0,0,0,1)_100%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center py-10 sm:py-14 md:py-16">
        <div className="flex w-full max-w-[1100px] flex-col items-center px-4 text-center sm:px-6">
        <Image
          src="/logo.png"
          alt="TradeVision"
          width={520}
          height={520}
          className="h-auto w-[280px] sm:w-[330px] md:w-[380px] lg:w-[460px]"
          priority
        />
          <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-semibold text-yellow-300 tracking-wide sm:mt-4 sm:text-xs">
            Webinar LIVE gratuit
          </div>
          <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
            Pentru începători și traderi
            <span className="bg-linear-to-r from-purple-300 via-purple-200 to-yellow-300 bg-clip-text text-transparent">
              {" "}
              neprofitabili
            </span>
          </h1>
          <p className="mt-3 max-w-3xl px-2 text-sm text-white/80 sm:mt-4 sm:text-base md:text-xl">
            Îți vom arăta o strategie simplă, aplicată cu disciplină zi de zi.
          </p>
          <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <div className="flex -space-x-3">
              <Image
                src="/avatar1herowebinar.jpeg"
                alt="Participant 1"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-white/70 object-cover"
              />
              <Image
                src="/avatar2herowebinar.JPG"
                alt="Participant 2"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-white/70 object-cover"
              />
              <Image
                src="/avatar3herowebinar.JPG"
                alt="Participant 3"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border-2 border-white/70 object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-base text-yellow-300 sm:text-lg">
              <span>★★★★★</span>
              <span className="text-sm font-semibold text-white">4.8</span>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-white/85 sm:text-sm md:text-base">
            Peste 100 de participanți în ultimii 2 ani
          </p>
          <Link
            href="/webinar/formular"
            className="mt-6 inline-flex w-full max-w-[340px] items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 sm:px-8 sm:py-3.5 md:max-w-none md:w-auto md:px-10 md:py-4 md:text-base"
          >
            REZERVĂ LOCUL GRATUIT!
          </Link>
          <div className="mt-10 w-full max-w-[520px]">
            <div className="grid grid-cols-4 gap-3">
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
      </div>
      <div className="pointer-events-none absolute bottom-1 left-1/2 z-20 -translate-x-1/2 animate-bounce text-white/70">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
            Scroll
          </span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_10px_rgba(250,204,21,0.25)]"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
