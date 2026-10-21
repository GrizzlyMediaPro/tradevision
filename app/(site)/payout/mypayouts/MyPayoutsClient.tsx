"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n, useT } from "@/lib/i18n/I18nProvider";
import { FaArrowLeft, FaChevronRight, FaDownload } from "react-icons/fa";
import type { PayoutTrackerData } from "@/lib/payoutTracker/types";
import { isValidTrackerData } from "@/lib/payoutTracker/validation";

type Snapshot = {
  date: string;
  updatedAt: string;
  data: PayoutTrackerData;
};

function fmt(n: number, numberLocale: string): string {
  return (Number(n) || 0).toLocaleString(numberLocale);
}

/** Investiții, payouts și profit agregat dintr-un snapshot. */
function snapshotTotals(data: PayoutTrackerData) {
  let investitii = 0;
  let payouts = 0;
  let payoutSume = 0;
  for (const firm of data.firms) {
    investitii += Number(firm.investitii) || 0;
    payouts += Number(firm.payouts) || 0;
    for (const acc of firm.accounts) {
      if (acc.payout) payoutSume += Number(acc.payoutSuma) || 0;
    }
  }
  return { investitii, payouts, profit: payouts - investitii, payoutSume };
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 px-5 py-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p
        className={`mt-1.5 text-xl md:text-2xl font-semibold tabular-nums ${
          tone === "positive"
            ? "text-emerald-400"
            : tone === "negative"
              ? "text-red-300"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function MyPayoutsClient() {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const monthName = (monthIndex: number) =>
    new Date(2026, monthIndex, 1).toLocaleDateString(dateLocale, { month: "long" });
  const [snapshots, setSnapshots] = useState<Snapshot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [month, setMonth] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/payout/history?full=1", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          snapshots?: { date: string; updatedAt: string; data?: unknown }[];
          error?: string;
        };
        if (!response.ok || !Array.isArray(result.snapshots)) {
          throw new Error(result.error || t("payout.error.history"));
        }
        if (cancelled) return;
        setSnapshots(
          result.snapshots.flatMap((item) =>
            isValidTrackerData(item.data)
              ? [{ date: item.date, updatedAt: item.updatedAt, data: item.data }]
              : [],
          ),
        );
      } catch (loadError) {
        if (cancelled) return;
        setSnapshots([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : t("payout.error.history"),
        );
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const years = useMemo(() => {
    const values = new Set(
      (snapshots ?? []).map((item) => item.date.slice(0, 4)),
    );
    values.add(String(new Date().getFullYear()));
    return Array.from(values).sort((a, b) => b.localeCompare(a));
  }, [snapshots]);

  const monthsInYear = useMemo(
    () =>
      Array.from(
        new Set(
          (snapshots ?? [])
            .filter((item) => item.date.startsWith(`${year}-`))
            .map((item) => item.date.slice(5, 7)),
        ),
      ).sort((a, b) => b.localeCompare(a)),
    [snapshots, year],
  );

  const filtered = useMemo(
    () =>
      (snapshots ?? []).filter((item) => {
        if (!item.date.startsWith(`${year}-`)) return false;
        if (month !== "all" && item.date.slice(5, 7) !== month) return false;
        return true;
      }),
    [month, snapshots, year],
  );

  // Statisticile folosesc cel mai recent snapshot din fiecare lună a selecției
  // (un snapshot e starea completă a zilei, nu o tranzacție — nu le putem aduna).
  const stats = useMemo(() => {
    const latestPerMonth = new Map<string, Snapshot>();
    for (const item of filtered) {
      const key = item.date.slice(0, 7);
      const current = latestPerMonth.get(key);
      if (!current || item.date > current.date) {
        latestPerMonth.set(key, item);
      }
    }
    const totals = { investitii: 0, payouts: 0, profit: 0, payoutSume: 0 };
    for (const item of latestPerMonth.values()) {
      const t = snapshotTotals(item.data);
      totals.investitii += t.investitii;
      totals.payouts += t.payouts;
      totals.profit += t.profit;
      totals.payoutSume += t.payoutSume;
    }
    return totals;
  }, [filtered]);

  const handleExportCsv = useCallback(() => {
    if (filtered.length === 0) return;

    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows: string[] = [t("payout.history.csvHeader")];
    for (const item of filtered) {
      for (const firm of item.data.firms) {
        const investitii = Number(firm.investitii) || 0;
        const payouts = Number(firm.payouts) || 0;
        rows.push(
          [
            item.date,
            escape(firm.name),
            firm.luna,
            investitii,
            payouts,
            payouts - investitii,
          ].join(","),
        );
      }
    }

    // BOM pentru diacritice corecte în Excel
    const blob = new Blob(["\uFEFF" + rows.join("\r\n")], {
      type: "text/csv;charset=utf-8",
    });
    const suffix = month === "all" ? year : `${year}-${month}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = t("payout.history.csvFile", { suffix });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, [filtered, month, t, year]);

  const selectClass =
    "rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40 [&>option]:bg-zinc-900";

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-16 pb-16">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("payout.history.title")}
          </h1>
          <div className="mt-3 h-[2px] w-[90px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-xs md:text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
            {t("payout.history.subtitle")}
          </p>
        </div>

        {/* Filtre + back */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/payout"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
          >
            <FaArrowLeft className="h-2.5 w-2.5" />
            {t("payout.history.back")}
          </Link>

          <div className="relative">
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setMonth("all");
              }}
              className={selectClass}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={selectClass}
            >
              <option value="all">{t("payout.history.allMonths")}</option>
              {monthsInYear.map((value) => (
                <option key={value} value={value}>
                  {monthName(Number(value) - 1)}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
              ▼
            </span>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            title={t("payout.history.exportTitle")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaDownload className="h-2.5 w-2.5" />
            {t("payout.history.export")}
          </button>
        </div>

        {error && (
          <div className="w-full rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-4">
            <p className="text-center text-xs leading-relaxed text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Statistici */}
        <div className="w-full grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label={t("payout.history.investments")} value={`${fmt(stats.investitii, dateLocale)} $`} />
          <StatCard label={t("payout.history.payouts")} value={`${fmt(stats.payouts, dateLocale)} $`} />
          <StatCard
            label={t("payout.history.profit")}
            value={`${fmt(stats.profit, dateLocale)} $`}
            tone={
              stats.profit > 0
                ? "positive"
                : stats.profit < 0
                  ? "negative"
                  : "neutral"
            }
          />
          <StatCard label={t("payout.history.days")} value={String(filtered.length)} />
        </div>

        {/* Istoric */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/3 px-5 py-5 md:px-6">
          <h2 className="text-sm md:text-base font-semibold text-white">
            {t("payout.history.heading")}
          </h2>

          {snapshots === null ? (
            <p className="mt-4 text-xs text-white/40">{t("payout.history.loading")}</p>
          ) : filtered.length === 0 ? (
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              {t("payout.history.empty")}
            </p>
          ) : (
            <div className="mt-4 flex flex-col">
              {filtered.map((item) => {
                const totals = snapshotTotals(item.data);
                const day = Number(item.date.slice(8, 10));
                const savedMonth = monthName(Number(item.date.slice(5, 7)) - 1);
                return (
                  <Link
                    key={item.date}
                    href={`/payout?date=${item.date}`}
                    className="group flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b border-white/5 px-1 py-3 last:border-b-0 transition hover:bg-white/3"
                  >
                    <span className="w-[120px] text-sm font-medium text-white">
                      {day} {savedMonth.toLocaleLowerCase(dateLocale)} {item.date.slice(0, 4)}
                    </span>
                    <span className="text-xs tabular-nums text-white/50">
                      {t("payout.history.rowInvestments", { amount: fmt(totals.investitii, dateLocale) })}
                    </span>
                    <span className="text-xs tabular-nums text-white/50">
                      {t("payout.history.rowPayouts", { amount: fmt(totals.payouts, dateLocale) })}
                    </span>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        totals.profit > 0
                          ? "text-emerald-400"
                          : totals.profit < 0
                            ? "text-red-300"
                            : "text-white/60"
                      }`}
                    >
                      {t("payout.history.rowProfit", { amount: fmt(totals.profit, dateLocale) })}
                    </span>
                    <FaChevronRight className="ml-auto h-2.5 w-2.5 text-white/25 transition group-hover:text-white/60" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
