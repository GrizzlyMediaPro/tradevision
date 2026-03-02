"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  FaStar,
  FaCopy,
  FaExternalLinkAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaKey,
} from "react-icons/fa";
import Flag from "react-world-flags";
import { platformImages } from "../../data/firms";
import type { FirmDetail } from "../../data/firms";

function Stars({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`h-4 w-4 ${i < Math.round(score) ? "text-yellow-400" : "text-white/20"}`}
        />
      ))}
    </span>
  );
}

const accountColors: Record<string, string> = {
  purple: "bg-purple-500/20 text-purple-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  sky: "bg-sky-500/20 text-sky-300",
  yellow: "bg-yellow-500/20 text-yellow-300",
};

export function FirmPageClient({ firm }: { firm: FirmDetail }) {
  const [activeRule, setActiveRule] = useState(0);

  const handleCopy = useCallback((code: string) => {
    navigator?.clipboard?.writeText(code).catch(() => {});
  }, []);

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-20 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition mb-8"
      >
        <FaChevronLeft className="h-3 w-3" />
        <span>Înapoi la firme</span>
      </Link>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="flex-1">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-black/50 border border-white/10">
              <Image
                src={firm.logo}
                alt={firm.name}
                width={80}
                height={80}
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-white">{firm.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Image src={firm.flag} alt={firm.country} width={20} height={14} className="h-3.5 w-5 object-cover rounded-[2px]" />
                  <span className="text-sm text-white/70">{firm.country}</span>
                </div>
                <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                  {firm.payout}
                </span>
                {firm.website && (
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    Visit Website <FaExternalLinkAlt className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Stars score={firm.trustScore} />
                <span className="text-sm font-medium text-white/80">{firm.trustScore}/5</span>
              </div>
              <span className="text-xs text-white/40">Active: {firm.activeYears} Years</span>
            </div>
          </div>

          <p className="mt-6 text-sm md:text-base text-white/65 leading-relaxed max-w-2xl">
            {firm.description}
          </p>
        </div>

        <div className="w-full md:w-72 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-6 flex flex-col items-center gap-4">
          <span className="text-2xl font-bold text-emerald-400">{firm.discount}</span>
          <div className="w-full h-px bg-white/10" />
          <button
            onClick={() => handleCopy(firm.code)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white/90 cursor-pointer hover:bg-white/10 transition"
          >
            <FaCopy className="h-3.5 w-3.5" />
            <span>{firm.code}</span>
          </button>
          <span className="text-[11px] text-white/50">Copy Code</span>
          <button className="w-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer">
            Get Funded
          </button>
        </div>
      </div>

      {/* ── Overview ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Overview
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <span>📊</span> Trading Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {firm.platforms.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  {platformImages[p] && (
                    <Image src={platformImages[p]} alt={p} width={16} height={16} className="h-4 w-4 object-contain" />
                  )}
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <FaCreditCard className="h-3.5 w-3.5" /> Payment Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {firm.paymentMethods.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Features ── */}
      <div className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 text-center mb-5 flex items-center gap-2 justify-center">
          <FaKey className="h-3 w-3" /> Key Features
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {firm.keyFeatures.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 flex flex-col items-center gap-2 text-center"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                {f.label}
              </span>
              <div className="flex items-center gap-1">
                {f.enabled ? (
                  <FaCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <FaTimesCircle className="h-3.5 w-3.5 text-red-400" />
                )}
                <span className={`text-xs font-semibold ${f.enabled ? "text-emerald-300" : "text-red-300"}`}>
                  {f.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Challenges ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Challenges
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 flex flex-col gap-3">
          <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/50">
            <span>Account</span>
            <span className="text-center">Size</span>
            <span className="text-center">Activation</span>
            <span className="text-center">Fee</span>
            <span className="text-center">True Cost</span>
            <span className="text-center">Target</span>
            <span className="text-center">Drawdown</span>
            <span className="text-center">Action</span>
          </div>

          {firm.challenges.map((ch, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-3 items-center px-5 py-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-white/[0.02]"
            >
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                  <Image src={firm.logo} alt={firm.name} width={32} height={32} className="h-7 w-7 object-contain" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-white">{firm.name}</span>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${accountColors[ch.accountColor] || "bg-purple-500/20 text-purple-300"}`}>
                    {ch.accountType}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Size</span>
                <span className="text-sm font-semibold text-white">{ch.size}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Activation</span>
                <span className="text-sm text-white/70">{ch.activation}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Fee</span>
                <span className="text-sm text-white/70">{ch.fee}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">True Cost</span>
                <span className="text-sm font-semibold text-emerald-400">{ch.trueCost}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Target</span>
                <span className="text-sm text-white/70">{ch.target}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Drawdown</span>
                <span className="text-sm text-white/70">{ch.drawdown}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 col-span-2 md:col-span-1">
                <button
                  onClick={() => handleCopy(firm.code)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                >
                  <FaCopy className="h-2.5 w-2.5" /> {firm.code}
                </button>
                <button className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-1.5 text-[11px] font-semibold text-white hover:brightness-110 transition cursor-pointer">
                  Get Funded
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payout Timeline ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Payout Timeline
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {firm.payoutTimeline.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 flex flex-col items-center text-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-lg font-bold">
                {idx + 1}
              </div>
              <h4 className="text-sm font-semibold text-purple-300">{step.title}</h4>
              <p className="text-xs text-white/55 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rules ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Rules
          <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {firm.rules.map((rule, idx) => (
            <button
              key={idx}
              onClick={() => setActiveRule(idx)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition cursor-pointer ${
                idx === activeRule
                  ? "bg-purple-500 text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)]"
                  : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <span>📊</span> {rule.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 md:px-10 md:py-10">
          <h3 className="text-lg font-semibold text-purple-300 mb-5">
            {firm.rules[activeRule].label}
          </h3>
          <div className="space-y-2">
            {firm.rules[activeRule].content.map((line, idx) => {
              if (line === "") return <div key={idx} className="h-3" />;
              if (line.startsWith("•")) {
                return (
                  <p key={idx} className="text-sm text-white/70 pl-4">
                    {line}
                  </p>
                );
              }
              return (
                <p key={idx} className="text-sm text-white/80 font-medium">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {firm.excludedCountries.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
            Excluded Countries
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
          </h2>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6">
            <div className="flex flex-wrap gap-3">
              {firm.excludedCountries.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-white/60"
                >
                  <Flag code={code} style={{ width: 18, height: 12, borderRadius: 2 }} />
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
