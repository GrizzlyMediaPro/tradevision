"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type {
  AdminUserPayoutSnapshot,
  AdminUserPayoutTracker,
} from "@/app/admin/actions/users";
import type { PayoutTrackerData } from "@/lib/payoutTracker/types";
import { useI18n, useT } from "@/lib/i18n/I18nProvider";

function fmt(n: number, dateLocale: string): string {
  return (Number(n) || 0).toLocaleString(dateLocale);
}

function fullName(user: AdminUserPayoutTracker["user"]): string {
  return `${user.firstName} ${user.lastName}`.trim() || "—";
}

function snapshotTotals(data: PayoutTrackerData) {
  let investitii = 0;
  let payouts = 0;
  let accounts = 0;
  for (const firm of data.firms) {
    investitii += Number(firm.investitii) || 0;
    payouts += Number(firm.payouts) || 0;
    accounts += firm.accounts.length;
  }
  return { investitii, payouts, profit: payouts - investitii, accounts };
}

function formatDayLabel(
  date: string,
  monthName: string,
): string {
  const day = Number(date.slice(8, 10));
  return `${day} ${monthName.toLowerCase()} ${date.slice(0, 4)}`;
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

function SnapshotDetail({ data }: { data: PayoutTrackerData }) {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";

  if (data.firms.length === 0) {
    return (
      <p className="px-1 py-3 text-xs text-white/40">
        {t("admin.payout.noFirms")}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-3 border-t border-white/5 pt-3">
      {data.firms.map((firm) => (
        <div
          key={`${firm.name}-${firm.luna}`}
          className="rounded-xl border border-white/8 bg-black/25 px-4 py-3"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-white">{firm.name}</p>
              <p className="text-[11px] text-white/40">
                {t("admin.payout.monthLabel", { month: firm.luna })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] tabular-nums text-white/55">
              <span>
                {t("admin.payout.investmentsValue", {
                  amount: fmt(Number(firm.investitii) || 0, dateLocale),
                })}
              </span>
              <span>
                {t("admin.payout.payoutsValue", {
                  amount: fmt(Number(firm.payouts) || 0, dateLocale),
                })}
              </span>
            </div>
          </div>

          {firm.accounts.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[11px]">
                <thead>
                  <tr className="text-white/40 uppercase tracking-wider">
                    <th className="pb-2 font-medium">{t("admin.payout.account")}</th>
                    <th className="pb-2 font-medium">{t("admin.payout.balance")}</th>
                    <th className="pb-2 font-medium">{t("admin.payout.current")}</th>
                    <th className="pb-2 font-medium">{t("admin.payout.target")}</th>
                    <th className="pb-2 font-medium">{t("admin.payout.days")}</th>
                    <th className="pb-2 font-medium">{t("admin.payout.payout")}</th>
                  </tr>
                </thead>
                <tbody>
                  {firm.accounts.map((acc) => (
                    <tr
                      key={acc.name}
                      className="border-t border-white/5 text-white/75"
                    >
                      <td className="py-1.5 pr-2 font-medium text-white/90">
                        {acc.name}
                        {acc.gata ? (
                          <span className="ml-1.5 text-[10px] text-emerald-400">
                            {t("admin.payout.ready")}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-1.5 tabular-nums">
                        {fmt(acc.balanta, dateLocale)} $
                      </td>
                      <td className="py-1.5 tabular-nums">
                        {fmt(acc.actual, dateLocale)} $
                      </td>
                      <td className="py-1.5 tabular-nums">
                        {fmt(acc.target, dateLocale)} $
                      </td>
                      <td className="py-1.5 tabular-nums">{acc.zile}</td>
                      <td className="py-1.5 tabular-nums">
                        {acc.payout
                          ? `${fmt(Number(acc.payoutSuma) || 0, dateLocale)} $`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SnapshotRow({ item }: { item: AdminUserPayoutSnapshot }) {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const [open, setOpen] = useState(false);
  const totals = snapshotTotals(item.data);
  const monthName = t(`admin.month.${Number(item.date.slice(5, 7))}`);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full flex-wrap items-center gap-x-5 gap-y-1.5 px-1 py-3 text-left transition hover:bg-white/3 cursor-pointer"
      >
        <span className="w-[140px] text-sm font-medium text-white">
          {formatDayLabel(item.date, monthName)}
        </span>
        <span className="text-xs tabular-nums text-white/50">
          {t("admin.payout.investmentsValue", {
            amount: fmt(totals.investitii, dateLocale),
          })}
        </span>
        <span className="text-xs tabular-nums text-white/50">
          {t("admin.payout.payoutsValue", {
            amount: fmt(totals.payouts, dateLocale),
          })}
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
          {t("admin.payout.profitValue", {
            amount: fmt(totals.profit, dateLocale),
          })}
        </span>
        <span className="text-[11px] text-white/35">
          {t("admin.payout.summary", {
            accounts: totals.accounts,
            firms: item.data.firms.length,
          })}
        </span>
        {open ? (
          <FaChevronDown className="ml-auto h-2.5 w-2.5 text-white/50" />
        ) : (
          <FaChevronRight className="ml-auto h-2.5 w-2.5 text-white/25 transition group-hover:text-white/60" />
        )}
      </button>

      {open && (
        <div className="px-1 pb-4">
          <SnapshotDetail data={item.data} />
        </div>
      )}
    </div>
  );
}

export function AdminUserPayoutClient({
  payload,
}: {
  payload: AdminUserPayoutTracker;
}) {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const { user, snapshots } = payload;
  const [year, setYear] = useState(() => {
    const latest = snapshots[0]?.date.slice(0, 4);
    return latest ?? String(new Date().getFullYear());
  });
  const [month, setMonth] = useState("all");

  const years = useMemo(() => {
    const values = new Set(snapshots.map((item) => item.date.slice(0, 4)));
    values.add(String(new Date().getFullYear()));
    return Array.from(values).sort((a, b) => b.localeCompare(a));
  }, [snapshots]);

  const monthsInYear = useMemo(
    () =>
      Array.from(
        new Set(
          snapshots
            .filter((item) => item.date.startsWith(`${year}-`))
            .map((item) => item.date.slice(5, 7)),
        ),
      ).sort((a, b) => b.localeCompare(a)),
    [snapshots, year],
  );

  const filtered = useMemo(
    () =>
      snapshots.filter((item) => {
        if (!item.date.startsWith(`${year}-`)) return false;
        if (month !== "all" && item.date.slice(5, 7) !== month) return false;
        return true;
      }),
    [month, snapshots, year],
  );

  const stats = useMemo(() => {
    const latestPerMonth = new Map<string, AdminUserPayoutSnapshot>();
    for (const item of filtered) {
      const key = item.date.slice(0, 7);
      const current = latestPerMonth.get(key);
      if (!current || item.date > current.date) {
        latestPerMonth.set(key, item);
      }
    }
    const totals = { investitii: 0, payouts: 0, profit: 0 };
    for (const item of latestPerMonth.values()) {
      const t = snapshotTotals(item.data);
      totals.investitii += t.investitii;
      totals.payouts += t.payouts;
      totals.profit += t.profit;
    }
    return totals;
  }, [filtered]);

  const selectClass =
    "rounded-full border border-white/20 bg-black/70 px-4 py-2 pr-8 text-xs font-medium text-white/85 outline-none cursor-pointer appearance-none shadow-sm shadow-black/40 [&>option]:bg-zinc-900";

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      <div className="mb-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>{t("admin.common.backUsers")}</span>
        </Link>
      </div>

      <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14">
        <Image
          src={user.imageUrl}
          alt={fullName(user)}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover bg-black/40 ring-2 ring-white/15"
          unoptimized
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Payout Tracker
          </h1>
          <div className="mt-3 h-[2px] w-[90px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-sm md:text-base text-white/80">
            {fullName(user)}
          </p>
          <p className="mt-1 text-xs text-white/45">{user.email || "—"}</p>
          <p className="mt-1 text-[10px] text-white/30">{user.id}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
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
            <option value="all">{t("admin.payout.allMonths")}</option>
            {monthsInYear.map((value) => (
              <option key={value} value={value}>
                {t(`admin.month.${Number(value)}`)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/60">
            ▼
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label={t("admin.payout.investments")}
          value={`${fmt(stats.investitii, dateLocale)} $`}
        />
        <StatCard
          label={t("admin.payout.payouts")}
          value={`${fmt(stats.payouts, dateLocale)} $`}
        />
        <StatCard
          label={t("admin.payout.profit")}
          value={`${fmt(stats.profit, dateLocale)} $`}
          tone={
            stats.profit > 0
              ? "positive"
              : stats.profit < 0
                ? "negative"
                : "neutral"
          }
        />
        <StatCard
          label={t("admin.payout.savedDays")}
          value={String(filtered.length)}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/3 px-5 py-5 md:px-6">
        <h2 className="text-sm md:text-base font-semibold text-white">
          {t("admin.payout.history")}
        </h2>

        {snapshots.length === 0 ? (
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            {t("admin.payout.empty")}
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            {t("admin.payout.noneInRange")}
          </p>
        ) : (
          <div className="mt-4 flex flex-col">
            {filtered.map((item) => (
              <SnapshotRow key={item.date} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
