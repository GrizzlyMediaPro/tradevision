"use client";

import Image from "next/image";
import Flag from "react-world-flags";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FaCopy, FaStar, FaChevronDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { TelegramCtaAndLive } from "./TelegramCtaAndLive";
import { firms as defaultFirms, platformImages } from "../data/firms";
import type { FirmDetail, Challenge, ChallengeType } from "../data/firms";
import type { LinkWidgetState } from "../admin/actions/linkwidget";

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

type FirmsProps = { firms?: FirmDetail[]; linkWidget?: LinkWidgetState };

type CompareSlot = { firmSlug: string; challengeIndex: number } | null;
type CompareDraftSlot =
  | { firmSlug: string; type: ChallengeType | ""; challengeIndex: number | null }
  | null;

function formatDiscount(raw: string): string {
  if (!raw) return "";
  const numeric = Number(raw.toString().replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return raw;
  return `${numeric}% DISCOUNT`;
}

function formatDollar(value: string): string {
  if (!value) return value;
  const trimmed = value.toString().trim();
  if (trimmed.startsWith("$")) return trimmed;
  return `$${trimmed}`;
}

function normalizeUrl(raw?: string | null): string {
  if (!raw) return "#";
  const trimmed = raw.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function Firms({ firms: firmsProp, linkWidget }: FirmsProps) {
  const firms = useMemo(() => firmsProp && firmsProp.length > 0 ? firmsProp : defaultFirms, [firmsProp]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [drawdownFilter, setDrawdownFilter] = useState<string>("all");
  const [payoutFilter, setPayoutFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [profitSplitFilter, setProfitSplitFilter] = useState<string>("all");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const emptySlots: CompareSlot[] = [null, null];
  const emptyDraftSlots: CompareDraftSlot[] = [null, null];
  const [compareSelections, setCompareSelections] =
    useState<CompareSlot[]>(emptySlots);
  const [compareDraft, setCompareDraft] =
    useState<CompareDraftSlot[]>(emptyDraftSlots);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((code: string) => {
    navigator?.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const comparedItems = useMemo(() => {
    return compareSelections
      .map((slot) => {
        if (!slot) return null;
        const { firmSlug, challengeIndex } = slot;
        const firm = firms.find((f) => f.slug === firmSlug);
        const challenge = firm?.challenges[challengeIndex];
        if (!firm || !challenge) return null;
        return { firm, challenge, challengeIndex };
      })
      .filter(
        (item): item is {
          firm: FirmDetail;
          challenge: Challenge;
          challengeIndex: number;
        } => item !== null,
      );
  }, [compareSelections, firms]);

  const filteredFirms = useMemo(() => {
    return firms.filter((firm) => {
      // Account Size: firm has at least one challenge matching selected size
      if (sizeFilter !== "all") {
        const target = Number(sizeFilter.replace(/[^0-9]/g, "")) || 0;
        const hasSize = firm.challenges.some((ch) => {
          const num = Number(ch.size.replace(/[^0-9]/g, ""));
          return !Number.isNaN(num) && num === target;
        });
        if (!hasSize) return false;
      }

      // Drawdown Type: infer from description/rules
      if (drawdownFilter !== "all") {
        const text = (
          firm.description +
          " " +
          JSON.stringify(firm.rules ?? []) +
          " " +
          JSON.stringify(firm.challenges)
        ).toLowerCase();
        const hasEod = text.includes("end-of-day") || text.includes("eod");
        const hasTrailing = text.includes("trailing");
        let type: "both" | "eod" | "trailing" | "static" = "static";
        if (hasEod && hasTrailing) type = "both";
        else if (hasEod) type = "eod";
        else if (hasTrailing) type = "trailing";

        if (drawdownFilter === "both" && type !== "both") return false;
        if (drawdownFilter === "eod" && type !== "eod" && type !== "both")
          return false;
        if (
          drawdownFilter === "trailing" &&
          type !== "trailing" &&
          type !== "both"
        )
          return false;
        if (drawdownFilter === "static" && type !== "static") return false;
      }

      // Min Days to Payout
      if (payoutFilter !== "all") {
        const payoutStr = firm.payout.toLowerCase();
        let days: number | null = null;
        if (payoutStr.includes("daily")) {
          days = 1;
        } else {
          const num = Number(payoutStr.replace(/[^0-9]/g, ""));
          days = Number.isNaN(num) ? null : num;
        }
        if (days != null) {
          if (payoutFilter === "1" && days > 1) return false;
          if (payoutFilter === "3" && days > 3) return false;
          if (payoutFilter === "5" && days > 5) return false;
          if (payoutFilter === "8" && days > 8) return false;
          if (payoutFilter === "11+" && days <= 8) return false;
        }
      }

      // Platforms
      if (platformFilter !== "all") {
        if (!firm.platforms.includes(platformFilter)) return false;
      }

      // Profit Splits
      if (profitSplitFilter !== "all") {
        const text = JSON.stringify(firm.rules ?? []).toLowerCase();
        if (profitSplitFilter === "80") {
          if (!text.includes("80/20")) return false;
        } else if (profitSplitFilter === "90") {
          if (!text.includes("90/10")) return false;
        }
      }

      return true;
    });
  }, [
    firms,
    sizeFilter,
    drawdownFilter,
    payoutFilter,
    platformFilter,
    profitSplitFilter,
  ]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedFirms = useMemo(() => {
    const base = [...filteredFirms];
    if (!sortKey) return base;
    base.sort((a, b) => {
      let aVal: string | number = a[sortKey!];
      let bVal: string | number = b[sortKey!];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return base;
  }, [filteredFirms, sortKey, sortDir]);

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
      {copied && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-black/80 px-4 py-1.5 text-xs font-medium text-emerald-200 shadow-lg">
          Codul a fost copiat
        </div>
      )}
      <div className="w-full flex flex-col items-center text-center gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Firme
          </h2>
          <div className="mt-3 h-[2px] w-[70px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        {/* ── Filters row ── */}
        <div className="w-full flex flex-wrap justify-center gap-3">
          {/* Account Size */}
          <div className="relative">
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40"
            >
              <option value="all">Mărime cont</option>
              <option value="25000">$25K</option>
              <option value="50000">$50K</option>
              <option value="75000">$75K</option>
              <option value="100000">$100K</option>
              <option value="150000">$150K</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          {/* Drawdown Type */}
          <div className="relative">
            <select
              value={drawdownFilter}
              onChange={(e) => setDrawdownFilter(e.target.value)}
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40"
            >
              <option value="all">Tip drawdown</option>
              <option value="both">Both</option>
              <option value="eod">EOD</option>
              <option value="static">Static</option>
              <option value="trailing">Trailing</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          {/* Min Days to Payout */}
          <div className="relative">
            <select
              value={payoutFilter}
              onChange={(e) => setPayoutFilter(e.target.value)}
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40"
            >
              <option value="all">Zile payout</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="5">5 Days</option>
              <option value="8">8 Days</option>
              <option value="11+">11+ Days</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          {/* Platforms */}
          <div className="relative">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40"
            >
              <option value="all">Platforme</option>
              <option value="NinjaTrader">NinjaTrader</option>
              <option value="Quantower">Quantower</option>
              <option value="Rithmic">Rithmic</option>
              <option value="Sierra Chart">Sierra Chart</option>
              <option value="TradingView">TradingView</option>
              <option value="Tradovate">Tradovate</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          {/* Profit Splits */}
          <div className="relative">
            <select
              value={profitSplitFilter}
              onChange={(e) => setProfitSplitFilter(e.target.value)}
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40"
            >
              <option value="all">Profit</option>
              <option value="80">80%</option>
              <option value="90">90%</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>
          <button
            className="inline-flex min-w-[110px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer whitespace-nowrap"
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
          >
            Compară
            {comparedItems.length > 0 && (
              <span className="ml-1 text-[10px] text-white/60">
                ({comparedItems.length})
              </span>
            )}
          </button>
          <button
            className="inline-flex min-w-[80px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/10 transition cursor-pointer whitespace-nowrap"
            onClick={() => {
              setSizeFilter("all");
              setDrawdownFilter("all");
              setPayoutFilter("all");
              setPlatformFilter("all");
              setProfitSplitFilter("all");
              setSortKey(null);
              setSortDir("asc");
              setCompareSelections(emptySlots);
              setCompareDraft(emptyDraftSlots);
              setIsCompareModalOpen(false);
            }}
          >
            Reset
          </button>
        </div>

        {/* ── Main content: either firms table or comparison matrix ── */}
        {comparedItems.length === 0 ? (
          <div className="w-full overflow-x-auto">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1.3fr_1.3fr_0.8fr_1.2fr_1.2fr] gap-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/60">
              <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 cursor-pointer">
                Firmă <SortIcon column="name" />
              </button>
              <button onClick={() => handleSort("country")} className="flex items-center gap-1.5 cursor-pointer justify-center">
                Țară <SortIcon column="country" />
              </button>
              <span className="text-center">Platforme</span>
              <button onClick={() => handleSort("trustScore")} className="flex items-center gap-1.5 cursor-pointer justify-center">
                Scor <SortIcon column="trustScore" />
              </button>
              <button onClick={() => handleSort("maxAccounts")} className="flex items-center gap-1.5 cursor-pointer justify-center">
                Max conturi <SortIcon column="maxAccounts" />
              </button>
              <span className="text-center">Discount</span>
              <span className="text-center">Acțiuni</span>
            </div>

            {/* Rows */}
            <div className="mt-3 flex flex-col gap-3">
              {sortedFirms.map((firm) => (
                <div
                  key={firm.name}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.3fr_1.3fr_0.8fr_1.2fr_1.2fr] gap-4 items-center px-6 py-5 rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-white/2"
                >
                  {/* Firm Name + Logo + Payout */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/40">
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
                    <span className="text-xs text-white/50 md:hidden">Țară</span>
                    {firm.country && firm.country.trim().length === 2 && (
                      <Flag
                        code={firm.country.trim().toUpperCase()}
                        style={{ width: 20, height: 14, borderRadius: 2 }}
                      />
                    )}
                    <span className="text-sm font-medium text-white">
                      {firm.country}
                    </span>
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
                    <span className="text-[10px] text-white/40">Activă de {firm.activeYears} ani</span>
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
                    <span className="text-sm font-semibold text-emerald-400">
                      {formatDiscount(firm.discount)}
                    </span>
                    <a
                      href={normalizeUrl(firm.fundingUrl || firm.website)}
                      target={firm.fundingUrl || firm.website ? "_blank" : undefined}
                      rel={firm.fundingUrl || firm.website ? "noopener noreferrer" : undefined}
                      className="w-full max-w-[130px] inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 cursor-pointer"
                    >
                      Obține finanțare
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
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
                  {comparedItems.map(({ firm }, idx) => (
                    <th
                      key={`${firm.slug}-${idx}`}
                      className="py-2 px-3 text-white font-semibold text-left align-bottom"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] uppercase tracking-wide text-white/50">
                          {firm.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Firmă", get: ({ firm }: any) => firm.name },
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

        <div className="mt-10 w-full">
          <TelegramCtaAndLive linkWidget={linkWidget} />
        </div>

        {/* Compare Modal */}
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
                  ? firms.find((f) => f.slug === slot.firmSlug)
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
                              const firm = firms.find(
                                (f) => f.slug === firmSlug,
                              );
                          const hasChallenges =
                            firm && firm.challenges.length > 0;
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
                          {firms.map((f) => (
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
      </div>
    </section>
  );
}
