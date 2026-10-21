"use client";

import { useI18n, useT } from "@/lib/i18n/I18nProvider";
import {
  convertEurToRon,
  formatPriceEur,
  formatPriceRon,
  type AppliedDiscount,
} from "@/lib/practicalCoursePricing";
import type { EurRonQuote } from "@/lib/eurRonExchange";

type OrderSummaryProps = {
  basePriceEur: number;
  eurRonQuote: EurRonQuote;
  discountCodeInput: string;
  onDiscountCodeInputChange: (value: string) => void;
  appliedDiscount: AppliedDiscount | null;
  onApplyDiscount: () => void;
  onRemoveDiscount: () => void;
  discountLoading: boolean;
  discountError: string | null;
};

function formatRateSource(
  quote: EurRonQuote,
  t: (id: string, vars?: { date: string }) => string,
  dateLocale: string,
): string {
  if (quote.source === "bnr") {
    const [year, month, day] = quote.publishedAt.split("-").map(Number);
    const dateLabel =
      year && month && day
        ? new Date(year, month - 1, day).toLocaleDateString(dateLocale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : quote.publishedAt;
    return t("course.summary.rateBnr", { date: dateLabel });
  }
  return t("course.summary.rateConfigured");
}

export function OrderSummary({
  basePriceEur,
  eurRonQuote,
  discountCodeInput,
  onDiscountCodeInputChange,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  discountLoading,
  discountError,
}: OrderSummaryProps) {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const basePrice = basePriceEur;
  const finalPriceEur = appliedDiscount?.finalAmountEur ?? basePrice;
  const discountAmount = appliedDiscount?.discountAmountEur ?? 0;
  const finalPriceRon = convertEurToRon(finalPriceEur, eurRonQuote.rate);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
      <h2 className="text-lg font-semibold text-white">{t("course.summary.title")}</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <span className="text-white/65">{t("course.summary.course")}</span>
          <span className="text-right font-medium text-white">
            {t("futures.title")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/65">{t("course.summary.listPrice")}</span>
          <span className="font-medium text-white">{formatPriceEur(basePrice)}</span>
        </div>
        {appliedDiscount ? (
          <div className="flex items-center justify-between gap-4 text-emerald-300">
            <span>
              {t("course.summary.discount", { code: appliedDiscount.code })}
            </span>
            <span>-{formatPriceEur(discountAmount)}</span>
          </div>
        ) : null}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-4">
          <span className="font-semibold text-white">{t("course.summary.contractTotal")}</span>
          <span className="text-xl font-bold text-yellow-300">
            {formatPriceEur(finalPriceEur)}
          </span>
        </div>
        <div className="rounded-2xl border border-yellow-300/15 bg-yellow-400/5 px-4 py-3 text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-yellow-200/80">
            {t("course.summary.ronLabel")}
          </p>
          <p className="mt-1 text-lg font-bold text-yellow-200">
            {formatPriceRon(finalPriceRon)}
          </p>
          <p className="mt-1 text-xs text-white/50">
            {t("course.summary.rate", {
              source: formatRateSource(eurRonQuote, t, dateLocale),
              rate: eurRonQuote.rate.toLocaleString(dateLocale, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              }),
            })}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            {t("course.summary.discountLabel")}
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={discountCodeInput}
              onChange={(e) => onDiscountCodeInputChange(e.target.value)}
              placeholder={t("course.summary.discountPlaceholder")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/50"
            />
            <button
              type="button"
              onClick={onApplyDiscount}
              disabled={discountLoading || !discountCodeInput.trim()}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-400/10 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {discountLoading ? t("course.summary.checking") : t("course.summary.apply")}
            </button>
          </div>
        </label>
        {appliedDiscount ? (
          <button
            type="button"
            onClick={onRemoveDiscount}
            className="text-xs text-white/50 underline underline-offset-2 transition hover:text-white"
          >
            {t("course.summary.remove")}
          </button>
        ) : null}
        {discountError ? (
          <p className="text-xs text-red-400">{discountError}</p>
        ) : null}
      </div>
    </div>
  );
}
