"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaChartLine,
  FaChevronLeft,
  FaSearch,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaUsers,
} from "react-icons/fa";
import {
  getUsersOverview,
  type AdminUserWithStats,
  type AdminUsersOverviewStats,
} from "../actions/users";
import { useI18n, useT } from "@/lib/i18n/I18nProvider";

type SortKey =
  | "name"
  | "email"
  | "createdAt"
  | "lastSignInAt"
  | "investitii"
  | "payouts"
  | "profit";
type SortDir = "asc" | "desc";
type Filter =
  | "all"
  | "admin"
  | "verified"
  | "unverified"
  | "banned"
  | "tracker"
  | "no-tracker";

const FILTERS: { value: Filter; labelKey: string }[] = [
  { value: "all", labelKey: "admin.users.filter.all" },
  { value: "admin", labelKey: "admin.users.filter.admin" },
  { value: "verified", labelKey: "admin.users.filter.verified" },
  { value: "unverified", labelKey: "admin.users.filter.unverified" },
  { value: "banned", labelKey: "admin.users.filter.banned" },
  { value: "tracker", labelKey: "admin.users.filter.tracker" },
  { value: "no-tracker", labelKey: "admin.users.filter.noTracker" },
];

const EMPTY_STATS: AdminUsersOverviewStats = {
  withTracker: 0,
  investitii: 0,
  payouts: 0,
  profit: 0,
};

function fullName(user: AdminUserWithStats): string {
  return `${user.firstName} ${user.lastName}`.trim() || "—";
}

function formatDate(timestamp: number | null, dateLocale: string): string {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(n: number, dateLocale: string): string {
  return `${(Number(n) || 0).toLocaleString(dateLocale)} $`;
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

export default function AdminUsersPage() {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const [users, setUsers] = useState<AdminUserWithStats[]>([]);
  const [stats, setStats] = useState<AdminUsersOverviewStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    getUsersOverview()
      .then((overview) => {
        setUsers(overview.users);
        setStats(overview.stats);
      })
      .catch(() => setError(t("admin.users.error.load")))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "email" ? "asc" : "desc");
    }
  };

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = users.filter((user) => {
      if (filter === "admin" && !user.isAdmin) return false;
      if (filter === "verified" && !user.emailVerified) return false;
      if (filter === "unverified" && user.emailVerified) return false;
      if (filter === "banned" && !user.banned) return false;
      if (filter === "tracker" && user.snapshotCount === 0) return false;
      if (filter === "no-tracker" && user.snapshotCount > 0) return false;

      if (!query) return true;
      return (
        fullName(user).toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    });

    const dir = sortDir === "asc" ? 1 : -1;
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = fullName(a).localeCompare(fullName(b), locale);
      } else if (sortKey === "email") {
        cmp = a.email.localeCompare(b.email);
      } else if (sortKey === "createdAt") {
        cmp = a.createdAt - b.createdAt;
      } else if (sortKey === "lastSignInAt") {
        cmp = (a.lastSignInAt ?? 0) - (b.lastSignInAt ?? 0);
      } else if (sortKey === "investitii") {
        cmp = a.investitii - b.investitii;
      } else if (sortKey === "payouts") {
        cmp = a.payouts - b.payouts;
      } else {
        cmp = a.profit - b.profit;
      }
      return cmp * dir;
    });

    return filtered;
  }, [filter, locale, search, sortDir, sortKey, users]);

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <FaSort className="h-3 w-3 text-white/40" />;
    return sortDir === "asc" ? (
      <FaSortUp className="h-3 w-3 text-purple-400" />
    ) : (
      <FaSortDown className="h-3 w-3 text-purple-400" />
    );
  }

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>{t("admin.common.back")}</span>
        </Link>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500/15 border border-teal-400/30">
            <FaUsers className="h-5 w-5 text-teal-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          {t("admin.users.title")}
        </h1>
        <div className="mt-3 h-[2px] w-[90px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          {t("admin.users.subtitle")}
        </p>
      </div>

      {!loading && !error && (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label={t("admin.users.withTracker")}
            value={String(stats.withTracker)}
          />
          <StatCard
            label={t("admin.users.totalInvested")}
            value={formatMoney(stats.investitii, dateLocale)}
          />
          <StatCard
            label={t("admin.users.totalPayouts")}
            value={formatMoney(stats.payouts, dateLocale)}
          />
          <StatCard
            label={t("admin.users.totalProfit")}
            value={formatMoney(stats.profit, dateLocale)}
            tone={
              stats.profit > 0
                ? "positive"
                : stats.profit < 0
                  ? "negative"
                  : "neutral"
            }
          />
        </div>
      )}

      {/* Search + filtre */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <div className="relative w-full sm:w-[320px]">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.users.search")}
            className="w-full rounded-full border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400/60"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition cursor-pointer ${
                filter === item.value
                  ? "border-purple-400/60 bg-purple-500/20 text-purple-200"
                  : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-4">
          <p className="text-center text-xs text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-white/40">
          {t("admin.users.loading")}
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1180px]">
            {/* Header */}
            <div className="grid grid-cols-[1.8fr_1.6fr_1.1fr_1.1fr_0.9fr_0.9fr_0.9fr_0.85fr_0.7fr] gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.user")} <SortIcon column="name" />
              </button>
              <button
                onClick={() => handleSort("email")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.common.email")} <SortIcon column="email" />
              </button>
              <button
                onClick={() => handleSort("createdAt")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.registered")} <SortIcon column="createdAt" />
              </button>
              <button
                onClick={() => handleSort("lastSignInAt")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.lastLogin")} <SortIcon column="lastSignInAt" />
              </button>
              <button
                onClick={() => handleSort("investitii")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.investments")} <SortIcon column="investitii" />
              </button>
              <button
                onClick={() => handleSort("payouts")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.payouts")} <SortIcon column="payouts" />
              </button>
              <button
                onClick={() => handleSort("profit")}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                {t("admin.users.col.profit")} <SortIcon column="profit" />
              </button>
              <span>{t("admin.users.col.status")}</span>
              <span>{t("admin.users.col.tracker")}</span>
            </div>

            {/* Rows */}
            <div className="mt-3 flex flex-col gap-2">
              {visible.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/40">
                  {t("admin.users.empty")}
                </p>
              ) : (
                visible.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1.8fr_1.6fr_1.1fr_1.1fr_0.9fr_0.9fr_0.9fr_0.85fr_0.7fr] gap-3 items-center px-5 py-3.5 rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-white/2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Image
                        src={user.imageUrl}
                        alt={fullName(user)}
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 rounded-full object-cover bg-black/40"
                        unoptimized
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {fullName(user)}
                        </p>
                        <p className="truncate text-[10px] text-white/35">
                          {user.id}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm text-white/85">
                        {user.email || "—"}
                      </p>
                      <p
                        className={`text-[10px] ${
                          user.emailVerified
                            ? "text-emerald-400/80"
                            : "text-white/35"
                        }`}
                      >
                        {user.emailVerified
                          ? t("admin.users.verified")
                          : t("admin.users.unverified")}
                      </p>
                    </div>

                    <span className="text-xs text-white/60 tabular-nums">
                      {formatDate(user.createdAt, dateLocale)}
                    </span>

                    <div className="min-w-0">
                      <span className="block text-xs text-white/60 tabular-nums">
                        {formatDate(user.lastSignInAt, dateLocale)}
                      </span>
                      {user.lastActiveAt ? (
                        <span className="block text-[10px] text-white/30 tabular-nums">
                          {t("admin.users.activeAt", {
                            date: formatDate(user.lastActiveAt, dateLocale),
                          })}
                        </span>
                      ) : null}
                    </div>

                    <span className="text-xs tabular-nums text-white/70">
                      {user.snapshotCount > 0
                        ? formatMoney(user.investitii, dateLocale)
                        : "—"}
                    </span>

                    <span className="text-xs tabular-nums text-white/70">
                      {user.snapshotCount > 0
                        ? formatMoney(user.payouts, dateLocale)
                        : "—"}
                    </span>

                    <span
                      className={`text-xs font-medium tabular-nums ${
                        user.snapshotCount === 0
                          ? "text-white/35"
                          : user.profit > 0
                            ? "text-emerald-400"
                            : user.profit < 0
                              ? "text-red-300"
                              : "text-white/60"
                      }`}
                    >
                      {user.snapshotCount > 0
                        ? formatMoney(user.profit, dateLocale)
                        : "—"}
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {user.isAdmin && (
                        <span className="rounded-full bg-yellow-400/15 border border-yellow-300/30 px-2.5 py-0.5 text-[10px] font-medium text-yellow-300">
                          {t("admin.users.adminBadge")}
                        </span>
                      )}
                      {user.banned ? (
                        <span className="rounded-full bg-red-400/15 border border-red-400/30 px-2.5 py-0.5 text-[10px] font-medium text-red-300">
                          {t("admin.users.banned")}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                          {t("admin.users.active")}
                        </span>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/admin/users/${user.id}/payout`}
                        title={t("admin.users.viewTracker")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1.5 text-[11px] font-medium text-teal-200 hover:bg-teal-500/20 transition cursor-pointer"
                      >
                        <FaChartLine className="h-3 w-3" />
                        {user.snapshotCount > 0
                          ? t("admin.users.days", { count: user.snapshotCount })
                          : t("admin.users.view")}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="mt-4 text-center text-[11px] text-white/35">
              {t("admin.users.count", {
                shown: visible.length,
                total: users.length,
              })}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
