import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  buildOrderCookie,
  createOrderWithCookie,
  getOrderCookieOrderId,
} from "@/lib/practicalCourseOrder";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";
import { getEurRonQuote } from "@/lib/eurRonExchange";
import { getT } from "@/lib/i18n/get-t";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  const t = await getT();
  try {
    const orderId = await getOrderCookieOrderId();
    if (!orderId) {
      return NextResponse.json({ error: t("course.api.notFound") }, { status: 404 });
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        finalAmountEur: true,
        finalAmountRon: true,
        eurRonRate: true,
        eurRonRateDate: true,
        eurRonRateSource: true,
        discountCode: true,
        discountAmountEur: true,
        paidAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: t("course.api.notFound") }, { status: 404 });
    }

    const eurRonQuote = await getEurRonQuote();

    return NextResponse.json({
      ...order,
      baseAmountEur: await getBasePriceEur(),
      eurRonQuote,
    });
  } catch (err) {
    console.error("Eroare la citirea comenzii", err);
    return NextResponse.json({ error: t("course.api.internal") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const t = await getT();
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`practical-course-order:${ip}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!success) {
      return NextResponse.json(
        { error: t("course.api.rateLimit") },
        { status: 429 },
      );
    }

    const { order, token } = await createOrderWithCookie();
    const res = NextResponse.json({ orderId: order.id });
    res.cookies.set(buildOrderCookie(order.id, token));
    return res;
  } catch (err) {
    console.error("Eroare la crearea comenzii curs practic", err);
    return NextResponse.json(
      { error: t("course.api.internalRetry") },
      { status: 500 },
    );
  }
}
