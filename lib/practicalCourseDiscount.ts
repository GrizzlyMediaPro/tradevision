import { prisma } from "@/lib/db";
import {
  calculatePricing,
  getBasePriceEur,
  type AppliedDiscount,
  type DiscountType,
} from "@/lib/practicalCoursePricing";

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

export async function validateDiscountCode(
  rawCode: string,
): Promise<{ ok: true; discount: AppliedDiscount } | { ok: false; error: string }> {
  const code = normalizeDiscountCode(rawCode);
  if (!code) {
    return { ok: false, error: "course.discount.empty" };
  }

  const record = await prisma.courseDiscountCode.findUnique({
    where: { code },
  });

  if (!record || !record.active) {
    return { ok: false, error: "course.discount.invalid" };
  }

  if (record.expiresAt && record.expiresAt < new Date()) {
    return { ok: false, error: "course.discount.expired" };
  }

  if (
    typeof record.maxUses === "number" &&
    record.usedCount >= record.maxUses
  ) {
    return { ok: false, error: "course.discount.limit" };
  }

  if (record.type !== "percent" && record.type !== "fixed") {
    return { ok: false, error: "course.discount.misconfigured" };
  }

  const basePriceEur = await getBasePriceEur();
  const pricing = calculatePricing(basePriceEur, {
    type: record.type as DiscountType,
    value: record.value,
  });

  if (!pricing) {
    return { ok: false, error: "course.discount.calc" };
  }

  return {
    ok: true,
    discount: {
      ...pricing,
      code: record.code,
    },
  };
}

export async function clearOrderDiscount(orderId: string) {
  await prisma.practicalCourseOrder.update({
    where: { id: orderId },
    data: {
      discountCode: null,
      discountType: null,
      discountValue: null,
      discountAmountEur: null,
      finalAmountEur: await getBasePriceEur(),
    },
  });
}

export async function applyDiscountToOrder(
  orderId: string,
  discount: AppliedDiscount,
) {
  await prisma.practicalCourseOrder.update({
    where: { id: orderId },
    data: {
      discountCode: discount.code,
      discountType: discount.type,
      discountValue: discount.value,
      discountAmountEur: discount.discountAmountEur,
      finalAmountEur: discount.finalAmountEur,
    },
  });
}

export async function incrementDiscountUsage(code: string) {
  const normalized = normalizeDiscountCode(code);
  await prisma.courseDiscountCode.updateMany({
    where: { code: normalized },
    data: { usedCount: { increment: 1 } },
  });
}
