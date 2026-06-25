"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  getBillingEmail,
  getClientDisplayName,
} from "@/lib/practicalCourseValidation";
import { normalizeDiscountCode } from "@/lib/practicalCourseDiscount";
import { formatPriceEur, getOrderFinalAmountEur } from "@/lib/practicalCoursePricing";
import { reconcilePracticalCourseOrder } from "@/lib/practicalCoursePayment";
import { getStripeClient } from "@/lib/stripe";
import { requireAdmin } from "@/lib/adminAuth";

export async function getDiscountCodes() {
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
  await prisma.courseDiscountCode.delete({ where: { id } });
  revalidatePath("/admin/curs-futures/reduceri");
}

export async function getPaidCourseClients() {
  await requireAdmin();
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

export async function getStuckCourseOrders() {
  await requireAdmin();
  const rows = await prisma.practicalCourseOrder.findMany({
    where: { status: "pending_payment" },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      clientName: getClientDisplayName(row.personType, row.billingData),
      email: getBillingEmail(row.personType, row.billingData),
      amountRon: row.finalAmountRon,
      stripeSessionId: row.stripeSessionId,
      updatedAt: row.updatedAt.toISOString(),
      paidAmount: formatPriceEur(await getOrderFinalAmountEur(row)),
    })),
  );
}

export async function reconcileStuckCourseOrder(orderId: string) {
  await requireAdmin();
  const result = await reconcilePracticalCourseOrder(orderId);
  revalidatePath("/admin/curs-futures/clienti");
  return result;
}

export async function deleteStuckCourseOrder(orderId: string) {
  await requireAdmin();

  const order = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
  });
  if (!order) {
    revalidatePath("/admin/curs-futures/clienti");
    return { deleted: true, alreadyGone: true };
  }
  if (order.status === "paid") {
    throw new Error("Nu poți șterge o comandă deja plătită.");
  }

  if (order.stripeSessionId) {
    const stripe = getStripeClient();
    if (stripe) {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      if (session.payment_status === "paid") {
        throw new Error(
          "Plata există în Stripe. Folosește Reconciliază, nu ștergerea.",
        );
      }
    }
  }

  await prisma.practicalCourseOrder.delete({ where: { id: orderId } });
  revalidatePath("/admin/curs-futures/clienti");
  return { deleted: true, alreadyGone: false };
}
