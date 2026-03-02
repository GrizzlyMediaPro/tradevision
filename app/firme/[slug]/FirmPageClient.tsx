"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
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
import type {
  FirmDetail,
  ChallengeType,
  Challenge,
} from "../../data/firms";

function formatDollar(value: string): string {
  if (!value) return value;
  const trimmed = value.toString().trim();
  if (trimmed.startsWith("$")) return trimmed;
  return `$${trimmed}`;
}

function formatDiscount(raw: string): string {
  if (!raw) return "";
  const numeric = Number(raw.toString().replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return raw;
  return `${numeric}% DISCOUNT`;
}

function normalizeUrl(raw?: string | null): string {
  if (!raw) return "#";
  const trimmed = raw.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

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

function translateYesNo(value: string): string {
  const lower = value.trim().toLowerCase();
  if (lower === "yes" || lower === "y" || lower === "da") return "Da";
  if (lower === "no" || lower === "n" || lower === "nu") return "Nu";
  return value;
}

type CompareSlot = { firmSlug: string; challengeIndex: number } | null;
type CompareDraftSlot =
  | {
      firmSlug: string;
      type: ChallengeType | "";
      challengeIndex: number | null;
    }
  | null;

export function FirmPageClient({
  firm,
  firms,
}: {
  firm: FirmDetail;
  firms: FirmDetail[];
}) {
  const [activeChallengeType, setActiveChallengeType] =
    useState<ChallengeType>("Rapid");
  const filteredChallenges = firm.challenges.filter((ch) => {
    const type = ch.type ?? "Rapid";
    return type === activeChallengeType;
  });
  const [openChallenge, setOpenChallenge] = useState<Challenge | null>(null);
  const [activeRuleIdx, setActiveRuleIdx] = useState(0);
  const emptySlots: CompareSlot[] = [null, null];
  const emptyDraftSlots: CompareDraftSlot[] = [null, null];
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareSelections, setCompareSelections] =
    useState<CompareSlot[]>(emptySlots);
  const [compareDraft, setCompareDraft] =
    useState<CompareDraftSlot[]>(emptyDraftSlots);
  const [copied, setCopied] = useState(false);

  const allFirms = useMemo(
    () => (firms && firms.length > 0 ? firms : [firm]),
    [firms, firm],
  );

  const comparedItems = useMemo(
    () =>
      compareSelections
        .map((slot) => {
          if (!slot) return null;
          const { firmSlug, challengeIndex } = slot;
          const foundFirm = allFirms.find((f) => f.slug === firmSlug);
          const challenge = foundFirm?.challenges[challengeIndex];
          if (!foundFirm || !challenge) return null;
          return { firm: foundFirm, challenge, challengeIndex };
        })
        .filter(
          (
            item,
          ): item is {
            firm: FirmDetail;
            challenge: Challenge;
            challengeIndex: number;
          } => item !== null,
        ),
    [compareSelections, allFirms],
  );

  const handleCopy = useCallback((code: string) => {
    navigator?.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-20 pb-16">
      {copied && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-black/80 px-4 py-1.5 text-xs font-medium text-emerald-200 shadow-lg">
          Codul a fost copiat
        </div>
      )}
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
                {firm.country && (
                  <Flag
                    code={firm.country.toUpperCase()}
                    style={{ width: 20, height: 14, borderRadius: 2 }}
                  />
                )}
                <span className="text-sm text-white/70">{firm.country}</span>
              </div>
                <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                  {firm.payout}
                </span>
                {firm.website && (
                  <a
                    href={normalizeUrl(firm.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    Vezi site-ul <FaExternalLinkAlt className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Stars score={firm.trustScore} />
                <span className="text-sm font-medium text-white/80">{firm.trustScore}/5</span>
              </div>
              <span className="text-xs text-white/40">Activă de {firm.activeYears} ani</span>
            </div>
          </div>

          <p className="mt-6 text-sm md:text-base text-white/65 leading-relaxed max-w-2xl">
            {firm.description}
          </p>
        </div>

        <div className="w-full md:w-72 rounded-2xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 px-6 py-6 flex flex-col items-center gap-4">
          <span className="text-2xl font-bold text-emerald-400">
            {formatDiscount(firm.discount)}
          </span>
          <div className="w-full h-px bg-white/10" />
          <button
            onClick={() => handleCopy(firm.code)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white/90 cursor-pointer hover:bg-white/10 transition"
          >
            <FaCopy className="h-3.5 w-3.5" />
            <span>{firm.code}</span>
          </button>
          <span className="text-[11px] text-white/50">Copiază codul</span>
          <a
            href={normalizeUrl(firm.fundingUrl || firm.website)}
            target={firm.fundingUrl || firm.website ? "_blank" : undefined}
            rel={firm.fundingUrl || firm.website ? "noopener noreferrer" : undefined}
            className="w-full inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer"
          >
            Obține finanțare
          </a>
        </div>
      </div>

      {/* ── Overview ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Prezentare generală
          <div className="flex-1 h-px bg-linear-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <span>📊</span> Platforme de tranzacționare
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

          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
              <FaCreditCard className="h-3.5 w-3.5" /> Metode de plată
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
          <FaKey className="h-3 w-3" /> Caracteristici cheie
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {firm.keyFeatures.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/10 bg-white/3 px-3 py-4 flex flex-col items-center gap-2 text-center"
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
                  {translateYesNo(f.value)}
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
          <div className="flex-1 h-px bg-linear-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <p className="mt-3 text-xs text-white/60">
          Ca să vezi regulile pentru un challenge, apasă pe titlul lui din tabel.
        </p>

        {/* Tip de challenge + Compare */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Tip de challenge
            </span>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-1 py-1">
              {(["Rapid", "Legacy", "Bolt"] as ChallengeType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveChallengeType(type)}
                  className={`px-4 py-1.5 text-[11px] font-semibold rounded-full transition cursor-pointer ${
                    activeChallengeType === type
                      ? "bg-purple-500 text-white shadow-[0_8px_18px_rgba(147,51,234,0.45)]"
                      : "bg-transparent text-white/70 hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCompareDraft(
                compareSelections.map((slot) =>
                  slot
                    ? {
                        firmSlug: slot.firmSlug,
                        type: "",
                        challengeIndex: slot.challengeIndex,
                      }
                    : null,
                ),
              );
              setIsCompareModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/85 hover:bg-white/10 cursor-pointer"
          >
            Compara conturi
          </button>
        </div>

        {/* Challenges table or comparison view */}
        {comparedItems.length === 0 ? (
          <div className="mt-6 flex flex-col gap-3">
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              <span>Cont</span>
              <span className="text-center">Mărime</span>
              <span className="text-center">Activare</span>
              <span className="text-center">Taxă</span>
              <span className="text-center">Cost real</span>
              <span className="text-center">Țintă</span>
              <span className="text-center">Drawdown</span>
              <span className="text-center">Acțiune</span>
            </div>

            {filteredChallenges.map((ch, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] gap-3 items-center px-5 py-4 rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-white/2"
              >
                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                    <Image src={firm.logo} alt={firm.name} width={32} height={32} className="h-7 w-7 object-contain" />
                  </div>
                  <div className="flex flex-col items-start">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenChallenge(ch);
                        setActiveRuleIdx(0);
                      }}
                      className="text-xs font-semibold text-white hover:text-purple-300 transition cursor-pointer text-left"
                    >
                      {firm.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenChallenge(ch);
                        setActiveRuleIdx(0);
                      }}
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${accountColors[ch.accountColor] || "bg-purple-500/20 text-purple-300"} cursor-pointer hover:brightness-110`}
                    >
                      {ch.accountType || "Challenge"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 md:hidden">Mărime</span>
                  <span className="text-sm font-semibold text-white">
                    {formatDollar(ch.size)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 md:hidden">Activare</span>
                  <span className="text-sm text-white/70">
                    {formatDollar(ch.activation)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 md:hidden">Taxă</span>
                  <span className="text-sm text-white/70">
                    {formatDollar(ch.fee)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 md:hidden">Cost real</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {formatDollar(ch.trueCost)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 md:hidden">Țintă</span>
                  <span className="text-sm text-white/70">
                    {formatDollar(ch.target)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 md:hidden">Drawdown</span>
                  <span className="text-sm text-white/70">
                    {formatDollar(ch.drawdown)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 col-span-2 md:col-span-1">
                  <button
                    onClick={() => handleCopy(firm.code)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                  >
                    <FaCopy className="h-2.5 w-2.5" /> {firm.code}
                  </button>
                  <a
                    href={normalizeUrl(firm.fundingUrl || firm.website)}
                    target={firm.fundingUrl || firm.website ? "_blank" : undefined}
                    rel={firm.fundingUrl || firm.website ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-4 py-1.5 text-[11px] font-semibold text-white hover:brightness-110 transition cursor-pointer"
                  >
                    Obține finanțare
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 w-full overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm md:text-base font-semibold text-white">
                Comparație conturi selectate
              </h3>
              <button
                type="button"
                onClick={() => setCompareSelections(emptySlots)}
                className="text-[11px] md:text-xs rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10 cursor-pointer"
              >
                Renunță la comparație
              </button>
            </div>
            <table className="w-full text-xs md:text-sm text-white/80 border-collapse">
              <thead>
                <tr>
                  <th className="py-2 pr-3 text-white/60 font-semibold text-left">
                    Criteriu
                  </th>
                  {comparedItems.map(({ firm: colFirm, challenge }, idx) => (
                    <th
                      key={idx}
                      className="py-2 px-3 text-white font-semibold text-left align-bottom"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] uppercase tracking-wide text-white/50">
                          {colFirm.name}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {challenge.accountType || "Account"}{" "}
                          {challenge.size && (
                            <span className="text-[10px] text-white/70">
                              ({challenge.size})
                            </span>
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Cont",
                    get: ({ challenge }: any) =>
                      challenge.accountType || "Account",
                  },
                  {
                    label: "Tip challenge",
                    get: ({ challenge }: any) => challenge.type ?? "Rapid",
                  },
                  {
                    label: "Mărime cont",
                    get: ({ challenge }: any) => formatDollar(challenge.size),
                  },
                  {
                    label: "Activare",
                    get: ({ challenge }: any) =>
                      formatDollar(challenge.activation),
                  },
                  {
                    label: "Taxă",
                    get: ({ challenge }: any) => formatDollar(challenge.fee),
                  },
                  {
                    label: "Cost real",
                    get: ({ challenge }: any) =>
                      formatDollar(challenge.trueCost),
                  },
                  {
                    label: "Țintă",
                    get: ({ challenge }: any) => formatDollar(challenge.target),
                  },
                  {
                    label: "Drawdown",
                    get: ({ challenge }: any) =>
                      formatDollar(challenge.drawdown),
                  },
                  {
                    label: "Discount",
                    get: ({ firm }: any) => formatDiscount(firm.discount),
                  },
                  {
                    label: "Payout",
                    get: ({ firm }: any) => firm.payout,
                  },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-white/10 last:border-b-0"
                  >
                    <td className="py-2 pr-3 font-semibold text-white/70 align-top">
                      {row.label}
                    </td>
                    {comparedItems.map((item, idx) => (
                      <td key={idx} className="py-2 px-3 align-top">
                        {row.get(item) || (
                          <span className="text-white/30">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Payout Timeline ── */}
      <div className="mt-14">
        <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
          Calendar payout
          <div className="flex-1 h-px bg-linear-to-r from-yellow-400/50 to-transparent" />
        </h2>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {firm.payoutTimeline.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/3 px-5 py-6 flex flex-col items-center text-center gap-3"
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

      {firm.excludedCountries.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
            Țări excluse
            <div className="flex-1 h-px bg-linear-to-r from-yellow-400/50 to-transparent" />
          </h2>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 px-6 py-6">
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

      {/* Modal reguli per challenge */}
      {openChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 px-6 py-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpenChallenge(null)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/5 p-1.5 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-white mb-1">
              Reguli - {openChallenge.accountType || "Challenge"}
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Reguli specifice pentru acest tip de challenge.
            </p>
            {openChallenge.rules && openChallenge.rules.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {openChallenge.rules.map((tab, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveRuleIdx(idx)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
                        idx === activeRuleIdx
                          ? "bg-purple-500 text-white shadow-[0_8px_18px_rgba(147,51,234,0.45)]"
                          : "border border-white/20 bg-black/40 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span>📊</span>
                      {tab.label || `Tab ${idx + 1}`}
                    </button>
                  ))}
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                  {openChallenge.rules[activeRuleIdx] && (
                    <div>
                      <h4 className="text-sm font-semibold text-purple-300 mb-2">
                        {openChallenge.rules[activeRuleIdx].label}
                      </h4>
                      <div className="space-y-1.5">
                        {openChallenge.rules[activeRuleIdx].content.map(
                          (line, lineIdx) => {
                            if (line === "") {
                              return <div key={lineIdx} className="h-3" />;
                            }
                            if (line.startsWith("•")) {
                              return (
                                <p
                                  key={lineIdx}
                                  className="text-sm text-white/70 pl-4"
                                >
                                  {line}
                                </p>
                              );
                            }
                            return (
                              <p
                                key={lineIdx}
                                className="text-sm text-white/80 font-medium"
                              >
                                {line}
                              </p>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-white/60">
                Nu există reguli configurate pentru acest challenge încă.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal comparație conturi */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 px-6 py-6 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/5 p-1.5 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-white mb-1">
              Selectează 2 conturi pentru comparație
            </h3>
            <p className="text-xs text-white/55 mb-4">
              Alege firma și apoi contul (challenge) pe care vrei să îl
              compari.
            </p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {compareDraft.map((slot, idx) => {
                const selectedFirm = slot
                  ? allFirms.find((f) => f.slug === slot.firmSlug)
                  : undefined;
                const selectedType = slot?.type ?? "";
                const availableTypes = selectedFirm
                  ? Array.from(
                      new Set(
                        selectedFirm.challenges.map(
                          (ch) => (ch.type ?? "Rapid") as ChallengeType,
                        ),
                      ),
                    )
                  : [];
                const availableChallenges =
                  selectedFirm?.challenges.filter((ch) =>
                    selectedType
                      ? (ch.type ?? "Rapid") === selectedType
                      : true,
                  ) ?? [];
                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2.5"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 md:w-16">
                      Slot {idx + 1}
                    </span>
                    <div className="flex-1 flex flex-col md:flex-row gap-2">
                      <select
                        value={slot?.firmSlug ?? ""}
                        onChange={(e) => {
                          const firmSlug = e.target.value;
                          setCompareDraft((prev) => {
                            const next = [...prev];
                            if (!firmSlug) {
                              next[idx] = null;
                              return next;
                            }
                            const foundFirm = allFirms.find(
                              (f) => f.slug === firmSlug,
                            );
                            const hasChallenges =
                              foundFirm && foundFirm.challenges.length > 0;
                            next[idx] =
                              hasChallenges
                                ? {
                                    firmSlug,
                                    type: "",
                                    challengeIndex: null,
                                  }
                                : null;
                            return next;
                          });
                        }}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400/60 cursor-pointer [&>option]:bg-zinc-900"
                      >
                        <option value="">Alege firmă</option>
                        {allFirms.map((f) => (
                          <option key={f.slug} value={f.slug}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedType}
                        onChange={(e) => {
                          const val = e.target.value as ChallengeType | "";
                          setCompareDraft((prev) => {
                            const next = [...prev];
                            const current = next[idx];
                            if (!current) return next;
                            next[idx] = {
                              ...current,
                              type: val,
                              challengeIndex: null,
                            };
                            return next;
                          });
                        }}
                        disabled={!selectedFirm}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400/60 cursor-pointer [&>option]:bg-zinc-900 disabled:opacity-40"
                      >
                        <option value="">
                          {selectedFirm
                            ? "Tip challenge (toate)"
                            : "Alege mai întâi firma"}
                        </option>
                        {availableTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <select
                        value={
                          slot && slot.challengeIndex !== null
                            ? String(slot.challengeIndex)
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setCompareDraft((prev) => {
                            const next = [...prev];
                            const current = next[idx];
                            if (!current || !selectedFirm) return next;
                            if (!val) {
                              next[idx] = null;
                              return next;
                            }
                            next[idx] = {
                              ...current,
                              challengeIndex: Number(val),
                            };
                            return next;
                          });
                        }}
                        disabled={!selectedFirm}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400/60 cursor-pointer [&>option]:bg-zinc-900 disabled:opacity-40"
                      >
                        <option value="">
                          {selectedFirm
                            ? "Alege cont"
                            : "Alege mai întâi firma"}
                        </option>
                        {availableChallenges.map((ch, cIdx) => {
                          const globalIndex =
                            selectedFirm?.challenges.indexOf(ch) ?? -1;
                          if (globalIndex < 0) return null;
                          return (
                            <option key={cIdx} value={globalIndex}>
                              {ch.accountType || "Account"}{" "}
                              {ch.size && `(${ch.size})`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {slot && (
                      <button
                        type="button"
                        onClick={() =>
                          setCompareDraft((prev) => {
                            const next = [...prev];
                            next[idx] = null;
                            return next;
                          })
                        }
                        className="self-start md:self-center text-[11px] text-red-300 hover:text-red-200 cursor-pointer"
                      >
                        Golește
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[11px] text-white/45">
                Sloturi selectate:{" "}
                {compareDraft.filter((slot) => slot !== null).length} / 2
              </span>
              <button
                type="button"
                disabled={
                  compareDraft.filter((slot) => slot !== null).length === 0
                }
                onClick={() => {
                  setCompareSelections(
                    compareDraft.map((slot) =>
                      slot && slot.challengeIndex !== null
                        ? {
                            firmSlug: slot.firmSlug,
                            challengeIndex: slot.challengeIndex,
                          }
                        : null,
                    ),
                  );
                  setIsCompareModalOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-sky-600 px-6 py-2 text-xs md:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,165,233,0.4)] hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Compara
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
