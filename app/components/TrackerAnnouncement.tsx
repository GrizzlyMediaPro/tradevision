"use client";

import Link from "next/link";
import { FaChartLine, FaCloudUploadAlt, FaHistory } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const features = [
  {
    id: "tracker.clarity",
    icon: FaChartLine,
    iconColor: "text-yellow-300",
  },
  {
    id: "tracker.saved",
    icon: FaCloudUploadAlt,
    iconColor: "text-purple-300",
  },
  {
    id: "tracker.history",
    icon: FaHistory,
    iconColor: "text-sky-300",
  },
];

export function TrackerAnnouncement() {
  const t = useT();

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20">
      <div className="relative md:overflow-hidden md:rounded-3xl md:border md:border-white/10 md:bg-linear-to-b md:from-white/6 md:to-white/2 md:px-12 md:py-12 md:shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        {/* Glow decorativ — doar pe desktop, în interiorul cardului */}
        <div className="pointer-events-none absolute -top-24 right-0 hidden h-64 w-64 rounded-full bg-purple-500/15 blur-3xl md:block" />
        <div className="pointer-events-none absolute -bottom-24 left-0 hidden h-64 w-64 rounded-full bg-yellow-400/8 blur-3xl md:block" />

        <div className="relative flex flex-col items-center text-center gap-8">
          {/* Badge NOU */}
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            {t("tracker.badge")}
          </span>

          {/* Heading — site style */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
              {t("tracker.title")}
            </h2>
            <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
            <p className="mt-5 text-sm md:text-base text-white/55 max-w-xl mx-auto leading-relaxed">
              {t("tracker.subtitle")}
            </p>
          </div>

          {/* Features */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((item) => (
              <div
                key={`${item.id}.title`}
                className="rounded-3xl border border-white/10 bg-black/25 px-6 py-7 text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 mb-4">
                  <item.icon className={`h-4.5 w-4.5 ${item.iconColor}`} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-white mb-1.5">
                  {t(`${item.id}.title`)}
                </h3>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                  {t(`${item.id}.body`)}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/payout"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer"
            >
              {t("tracker.cta")}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-xs text-white/40">
              {t("tracker.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
