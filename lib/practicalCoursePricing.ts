import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";

export type DiscountType = "percent" | "fixed";

export type AppliedDiscount = {
  code: string;
  type: DiscountType;
  value: number;
  discountAmountEur: number;
  finalAmountEur: number;
};

export { getBasePriceEur, formatCoursePrice as formatPriceEur } from "@/lib/courseProductPricing";

export function calculatePricing(
  basePriceEur: number,
  discount?: { type: DiscountType; value: number } | null,
): AppliedDiscount | null {
  if (!discount) return null;

  let discountAmountEur = 0;
  if (discount.type === "percent") {
    discountAmountEur = Math.round(basePriceEur * (discount.value / 100) * 100) / 100;
  } else {
    discountAmountEur = Math.min(basePriceEur, discount.value);
  }

  const finalAmountEur = Math.max(
    0,
    Math.round((basePriceEur - discountAmountEur) * 100) / 100,
  );

  return {
    code: "",
    type: discount.type,
    value: discount.value,
    discountAmountEur,
    finalAmountEur,
  };
}

export async function getOrderFinalAmountEur(order: {
  finalAmountEur?: number | null;
}): Promise<number> {
  if (typeof order.finalAmountEur === "number" && Number.isFinite(order.finalAmountEur)) {
    return order.finalAmountEur;
  }
  const { getBasePriceEur } = await import("@/lib/courseProductPricing");
  return getBasePriceEur();
}

export function eurToStripeCents(amountEur: number): number {
  return Math.round(amountEur * 100);
}

export { formatPriceRon, formatEurRonRate, formatRonPaymentLine, convertEurToRon } from "@/lib/eurRonExchange";

export async function getOrderPaymentAmounts(order: {
  finalAmountEur?: number | null;
  finalAmountRon?: number | null;
  eurRonRate?: number | null;
  eurRonRateDate?: string | null;
  eurRonRateSource?: string | null;
}): Promise<{
  finalAmountEur: number;
  finalAmountRon: number;
  eurRonRate: number;
  eurRonRateDate: string;
  eurRonRateSource: "bnr" | "env";
}> {
  const finalAmountEur = await getOrderFinalAmountEur(order);

  if (
    typeof order.finalAmountRon === "number" &&
    Number.isFinite(order.finalAmountRon) &&
    typeof order.eurRonRate === "number" &&
    Number.isFinite(order.eurRonRate)
  ) {
    const source =
      order.eurRonRateSource === "env" ? "env" : ("bnr" as const);
    return {
      finalAmountEur,
      finalAmountRon: order.finalAmountRon,
      eurRonRate: order.eurRonRate,
      eurRonRateDate: order.eurRonRateDate ?? new Date().toISOString().slice(0, 10),
      eurRonRateSource: source,
    };
  }

  const { convertEurToRon, getEurRonQuote } = await import("@/lib/eurRonExchange");
  const quote = await getEurRonQuote();

  return {
    finalAmountEur,
    finalAmountRon: convertEurToRon(finalAmountEur, quote.rate),
    eurRonRate: quote.rate,
    eurRonRateDate: quote.publishedAt,
    eurRonRateSource: quote.source,
  };
}

/** @deprecated Folosește prețul din baza de date prin getBasePriceEur(). */
export function getStaticCatalogPriceEur(): number {
  return PRACTICAL_COURSE.priceAmount;
}
