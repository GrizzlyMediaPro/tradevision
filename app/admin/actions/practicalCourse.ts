"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  getBillingEmail,
  getClientDisplayName,
} from "@/lib/practicalCourseValidation";
import { normalizeDiscountCode } from "@/lib/practicalCourseDiscount";
import { formatPriceEur, getOrderFinalAmountEur } from "@/lib/practicalCoursePricing";

export async function getDiscountCodes() {
  return prisma.courseDiscountCode.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export type DiscountCodeInput = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  maxUses?: number | null;
  expiresAt?: string | null;
};

export async function createDiscountCode(input: DiscountCodeInput) {
  const code = normalizeDiscountCode(input.code);
  if (!code) throw new Error("Codul este obligatoriu.");
  if (input.type !== "percent" && input.type !== "fixed") {
    throw new Error("Tipul de discount nu este valid.");
  }
  if (!Number.isFinite(input.value) || input.value <= 0) {
    throw new Error("Valoarea discountului trebuie să fie pozitivă.");
  }
  if (input.type === "percent" && input.value > 100) {
    throw new Error("Procentul nu poate depăși 100.");
  }

  await prisma.courseDiscountCode.create({
    data: {
      code,
      type: input.type,
      value: input.value,
      active: input.active,
      maxUses: input.maxUses ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });

  revalidatePath("/admin/curs-futures/reduceri");
}

export async function updateDiscountCode(id: string, input: DiscountCodeInput) {
  const code = normalizeDiscountCode(input.code);
  if (!code) throw new Error("Codul este obligatoriu.");

  await prisma.courseDiscountCode.update({
    where: { id },
    data: {
      code,
      type: input.type,
      value: input.value,
      active: input.active,
      maxUses: input.maxUses ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });

  revalidatePath("/admin/curs-futures/reduceri");
}

export async function deleteDiscountCode(id: string) {
  await prisma.courseDiscountCode.delete({ where: { id } });
  revalidatePath("/admin/curs-futures/reduceri");
}

export async function getPaidCourseClients() {
  const rows = await prisma.practicalCourseOrder.findMany({
    where: { status: "paid" },
    orderBy: { paidAt: "desc" },
    take: 500,
  });

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      clientName: getClientDisplayName(row.personType, row.billingData),
      email: getBillingEmail(row.personType, row.billingData),
      personType: row.personType,
      discountCode: row.discountCode,
      paidAmount: formatPriceEur(await getOrderFinalAmountEur(row)),
      paidAt: row.paidAt?.toISOString() ?? row.updatedAt.toISOString(),
    })),
  );
}
