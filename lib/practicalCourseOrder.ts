import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  createPracticalCourseOrderToken,
  PRACTICAL_COURSE_ORDER_COOKIE_NAME,
  PRACTICAL_COURSE_ORDER_MAX_AGE_SEC,
  verifyPracticalCourseOrderToken,
} from "@/lib/practicalCourseOrderCookie";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";

export async function getOrderCookieOrderId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRACTICAL_COURSE_ORDER_COOKIE_NAME)?.value;
  const verified = await verifyPracticalCourseOrderToken(token);
  return verified?.orderId ?? null;
}

export async function assertOrderAccess(orderId: string): Promise<boolean> {
  const cookieOrderId = await getOrderCookieOrderId();
  return cookieOrderId === orderId;
}

export function buildOrderCookie(orderId: string, token: string) {
  return {
    name: PRACTICAL_COURSE_ORDER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: PRACTICAL_COURSE_ORDER_MAX_AGE_SEC,
  };
}

export async function createOrderWithCookie() {
  const order = await prisma.practicalCourseOrder.create({
    data: {
      status: "draft",
      finalAmountEur: await getBasePriceEur(),
    },
  });
  const token = await createPracticalCourseOrderToken(order.id);
  return { order, token };
}

export type OrderStatus = "draft" | "pending_payment" | "paid";

export function isOrderReadyForCheckout(status: string): boolean {
  return status === "draft" || status === "pending_payment";
}

export function isOrderPaid(status: string): boolean {
  return status === "paid";
}
