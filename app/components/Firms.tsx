"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FaCopy, FaStar, FaChevronDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { TelegramCtaAndLive } from "./TelegramCtaAndLive";
import { firms, platformImages } from "../data/firms";

type SortKey = "name" | "country" | "trustScore" | "maxAccounts";
type SortDir = "asc" | "desc";

/* ── Stars ── */
function Stars({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={`h-3 w-3 ${i < Math.round(score) ? "text-yellow-400" : "text-white/20"}`} />
      ))}
    </span>
  );
}

const filterButtons = [
  { label: "Account Size", extraClass: "min-w-[130px]" },
  { label: "Drawdown Type", extraClass: "min-w-[145px]" },
  { label: "Min Days to Payout", extraClass: "min-w-[170px]" },
  { label: "Platforms", extraClass: "min-w-[120px]" },
  { label: "Profit Splits", extraClass: "min-w-[135px]" },
  { label: "Consistency Rule", extraClass: "min-w-[165px]" },
];

export function Firms() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleCopy = useCallback((code: string) => {
    navigator?.clipboard?.writeText(code).catch(() => {});
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedFirms = [...firms].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal: string | number = a[sortKey];
    let bVal: string | number = b[sortKey];
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <FaSort className="h-3 w-3 text-white/40" />;
    return sortDir === "asc" ? (
      <FaSortUp className="h-3 w-3 text-purple-400" />
    ) : (
      <FaSortDown className="h-3 w-3 text-purple-400" />
    );
  }

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-6 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Firms
          </h2>
          <div className="mt-3 h-[2px] w-[70px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        {/* ── Filters row ── */}
        <div className="w-full flex flex-wrap justify-center gap-3">
          {filterButtons.map(({ label, extraClass }) => (
              <button
                key={label}
                className={`inline-flex items-center justify-between gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/10 transition cursor-pointer whitespace-nowrap ${extraClass}`}
              >
                <span>{label}</span>
                <FaChevronDown className="h-2.5 w-2.5 text-white/50" />
              </button>
          ))}
          <button className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer whitespace-nowrap">
            Compare
          </button>
          <button className="inline-flex min-w-[90px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/10 transition cursor-pointer whitespace-nowrap">
            Reset
          </button>
        </div>

        {/* ── Table ── */}
        <div className="w-full overflow-x-auto">
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-[2fr_1fr_1.3fr_1.3fr_0.8fr_1.2fr_1.2fr] gap-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/60">
            <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 cursor-pointer">
              Firm Name <SortIcon column="name" />
            </button>
            <button onClick={() => handleSort("country")} className="flex items-center gap-1.5 cursor-pointer justify-center">
              Country <SortIcon column="country" />
            </button>
            <span className="text-center">Platforms</span>
            <button onClick={() => handleSort("trustScore")} className="flex items-center gap-1.5 cursor-pointer justify-center">
              Trust Score <SortIcon column="trustScore" />
            </button>
            <button onClick={() => handleSort("maxAccounts")} className="flex items-center gap-1.5 cursor-pointer justify-center">
              Max Accts <SortIcon column="maxAccounts" />
            </button>
            <span className="text-center">Disc Code</span>
            <span className="text-center">Action</span>
          </div>

          {/* Rows */}
          <div className="mt-3 flex flex-col gap-3">
            {sortedFirms.map((firm) => (
              <div
                key={firm.name}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.3fr_1.3fr_0.8fr_1.2fr_1.2fr] gap-4 items-center px-6 py-5 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-white/[0.02]"
              >
                {/* Firm Name + Logo + Payout */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-black/40">
                    <Image src={firm.logo} alt={firm.name} width={48} height={48} className="h-10 w-10 object-contain" />
                  </div>
                  <div className="flex flex-col items-start">
                    <Link
                      href={`/firme/${firm.slug}`}
                      className="text-sm font-semibold text-white hover:text-purple-300 transition cursor-pointer"
                    >
                      {firm.name}
                    </Link>
                    <span className="mt-1 inline-block rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-medium text-purple-300">
                      {firm.payout}
                    </span>
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-white/50 md:hidden">Country</span>
                  <Image src={firm.flag} alt={firm.country} width={20} height={14} className="h-3.5 w-5 object-cover rounded-[2px]" />
                  <span className="text-sm font-medium text-white">{firm.country}</span>
                </div>

                {/* Platforms */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {firm.platforms.map((p) => (
                    <div key={p} className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10" title={p}>
                      <Image src={platformImages[p]} alt={p} width={20} height={20} className="h-4 w-4 object-contain" />
                    </div>
                  ))}
                </div>

                {/* Trust Score */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <Stars score={firm.trustScore} />
                    <span className="text-xs font-medium text-white/80">{firm.trustScore}/5</span>
                  </div>
                  <span className="text-[10px] text-white/40">Active: {firm.activeYears} Years</span>
                </div>

                {/* Max Accounts */}
                <div className="flex justify-center">
                  <span className="text-xl font-semibold text-white">{firm.maxAccounts}</span>
                </div>

                {/* Disc Code */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleCopy(firm.code)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-medium text-white/90 cursor-pointer hover:bg-white/10 transition"
                  >
                    <FaCopy className="h-3 w-3" />
                    <span>{firm.code}</span>
                  </button>
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Copy Code</span>
                </div>

                {/* Action */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-400">{firm.discount}</span>
                  <button className="w-full max-w-[130px] rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 cursor-pointer">
                    Get Funded
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 w-full">
          <TelegramCtaAndLive />
        </div>
      </div>
    </section>
  );
}
