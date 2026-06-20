"use client";

import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import {
  formatPriceEur,
  getBasePriceEur,
  type AppliedDiscount,
} from "@/lib/practicalCoursePricing";

type OrderSummaryProps = {
  discountCodeInput: string;
  onDiscountCodeInputChange: (value: string) => void;
  appliedDiscount: AppliedDiscount | null;
  onApplyDiscount: () => void;
  onRemoveDiscount: () => void;
  discountLoading: boolean;
  discountError: string | null;
};

export function OrderSummary({
  discountCodeInput,
  onDiscountCodeInputChange,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
  discountLoading,
  discountError,
}: OrderSummaryProps) {
  const basePrice = getBasePriceEur();
  const finalPrice = appliedDiscount?.finalAmountEur ?? basePrice;
  const discountAmount = appliedDiscount?.discountAmountEur ?? 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
      <h2 className="text-lg font-semibold text-white">Detalii comandă</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <span className="text-white/65">Curs</span>
          <span className="text-right font-medium text-white">
            {PRACTICAL_COURSE.title}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/65">Preț listă</span>
          <span className="font-medium text-white">{formatPriceEur(basePrice)}</span>
        </div>
        {appliedDiscount ? (
          <div className="flex items-center justify-between gap-4 text-emerald-300">
            <span>
              Reducere ({appliedDiscount.code})
            </span>
            <span>-{formatPriceEur(discountAmount)}</span>
          </div>
        ) : null}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-4">
          <span className="font-semibold text-white">Total de plată</span>
          <span className="text-xl font-bold text-yellow-300">
            {formatPriceEur(finalPrice)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            Cod discount
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={discountCodeInput}
              onChange={(e) => onDiscountCodeInputChange(e.target.value)}
              placeholder="Introdu codul"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/50"
            />
            <button
              type="button"
              onClick={onApplyDiscount}
              disabled={discountLoading || !discountCodeInput.trim()}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-400/10 px-5 py-3 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {discountLoading ? "Se verifică..." : "Aplică"}
            </button>
          </div>
        </label>
        {appliedDiscount ? (
          <button
            type="button"
            onClick={onRemoveDiscount}
            className="text-xs text-white/50 underline underline-offset-2 transition hover:text-white"
          >
            Elimină codul aplicat
          </button>
        ) : null}
        {discountError ? (
          <p className="text-xs text-red-400">{discountError}</p>
        ) : null}
      </div>
    </div>
  );
}
