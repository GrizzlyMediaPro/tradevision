import { NextResponse } from "next/server";
import { assertOrderAccess, isOrderReadyForCheckout } from "@/lib/practicalCourseOrder";
import {
  applyDiscountToOrder,
  clearOrderDiscount,
  validateDiscountCode,
} from "@/lib/practicalCourseDiscount";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n/get-t";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  const t = await getT();
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: t("course.api.unauthorized") }, { status: 403 });
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id },
    });
    if (!order || !isOrderReadyForCheckout(order.status)) {
      return NextResponse.json(
        { error: t("course.api.discountRejected") },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { code?: string };
    const result = await validateDiscountCode(body.code ?? "");
    if (!result.ok) {
      return NextResponse.json({ error: t(result.error) }, { status: 400 });
    }

    await applyDiscountToOrder(id, result.discount);
    return NextResponse.json({ ok: true, discount: result.discount });
  } catch (err) {
    console.error("Eroare la aplicarea discountului", err);
    return NextResponse.json({ error: t("course.api.internal") }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const t = await getT();
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: t("course.api.unauthorized") }, { status: 403 });
    }

    await clearOrderDiscount(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la eliminarea discountului", err);
    return NextResponse.json({ error: t("course.api.internal") }, { status: 500 });
  }
}
