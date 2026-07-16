"use client";

import Link from "next/link";
import { FaChartLine, FaCloudUploadAlt, FaHistory } from "react-icons/fa";

const features = [
  {
    icon: FaChartLine,
    iconColor: "text-yellow-300",
    title: "Vezi clar unde ești",
    description:
      "Balanță, profit actual și cât mai ai nevoie până la payout — calculat automat pentru fiecare cont.",
  },
  {
    icon: FaCloudUploadAlt,
    iconColor: "text-purple-300",
    title: "Salvat în contul tău",
    description:
      "Datele se salvează în siguranță în contul tău și le regăsești de pe orice dispozitiv.",
  },
  {
    icon: FaHistory,
    iconColor: "text-sky-300",
    title: "Istoric pe zile",
    description:
      "My Payouts îți arată evoluția pe luni și zile, cu statistici și export CSV.",
  },
];

export function TrackerAnnouncement() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 px-6 py-10 md:px-12 md:py-12 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        {/* Glow decorativ */}
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-yellow-400/8 blur-3xl" />

        <div className="relative flex flex-col items-center text-center gap-8">
          {/* Badge NOU */}
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            Nou pe Trade Vision
          </span>

          {/* Heading — site style */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
              Payout Tracker
            </h2>
            <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
            <p className="mt-5 text-sm md:text-base text-white/55 max-w-xl mx-auto leading-relaxed">
              Ține evidența conturilor tale de la firmele de prop trading:
              urmărește profitul, vezi cât mai ai până la payout și păstrează
              istoricul zilnic — totul gratuit, direct pe site.
            </p>
          </div>

          {/* Features */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-black/25 px-6 py-7 text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 mb-4">
                  <item.icon className={`h-4.5 w-4.5 ${item.iconColor}`} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                  {item.description}
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
              Încearcă Payout Tracker
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
              Gratuit — ai nevoie doar de un cont Trade Vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
