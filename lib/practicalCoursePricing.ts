import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";

export type DiscountType = "percent" | "fixed";

export type AppliedDiscount = {
  code: string;
  type: DiscountType;
  value: number;
  discountAmountEur: number;
  finalAmountEur: number;
};

export function getBasePriceEur(): number {
  return PRACTICAL_COURSE.priceAmount;
}

export function formatPriceEur(amount: number): string {
  return `${amount.toFixed(2).replace(/\.00$/, "")} EUR`;
}

export function calculatePricing(
  discount?: { type: DiscountType; value: number } | null,
): AppliedDiscount | null {
  const base = getBasePriceEur();
  if (!discount) return null;

  let discountAmountEur = 0;
  if (discount.type === "percent") {
    discountAmountEur = Math.round(base * (discount.value / 100) * 100) / 100;
  } else {
    discountAmountEur = Math.min(base, discount.value);
  }

  const finalAmountEur = Math.max(0, Math.round((base - discountAmountEur) * 100) / 100);

  return {
    code: "",
    type: discount.type,
    value: discount.value,
    discountAmountEur,
    finalAmountEur,
  };
}

export function getOrderFinalAmountEur(order: {
  finalAmountEur?: number | null;
}): number {
  if (typeof order.finalAmountEur === "number" && Number.isFinite(order.finalAmountEur)) {
    return order.finalAmountEur;
  }
  return getBasePriceEur();
}

export function eurToStripeCents(amountEur: number): number {
  return Math.round(amountEur * 100);
}
