import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertOrderAccess, isOrderReadyForCheckout } from "@/lib/practicalCourseOrder";
import {
  validateBillingPayload,
  type BillingPayload,
} from "@/lib/practicalCourseValidation";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";
import { getLocale, getT } from "@/lib/i18n/get-t";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const t = await getT();
  const locale = await getLocale();
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: t("course.api.unauthorized") }, { status: 403 });
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id },
    });
    if (!order) {
      return NextResponse.json({ error: t("course.api.notFound") }, { status: 404 });
    }
    if (!isOrderReadyForCheckout(order.status)) {
      return NextResponse.json(
        { error: t("course.api.locked") },
        { status: 400 },
      );
    }

    const body = (await req.json()) as BillingPayload;
    const validationError = validateBillingPayload(body);
    if (validationError) {
      return NextResponse.json({ error: t(validationError) }, { status: 400 });
    }

    const basePriceEur = await getBasePriceEur();
    const updated = await prisma.practicalCourseOrder.update({
      where: { id },
      data: {
        personType: body.personType,
        billingData: { ...body.billingData, locale },
        acceptedTerms: body.acceptedTerms,
        acceptedPrivacy: body.acceptedPrivacy,
        status: "pending_payment",
        finalAmountEur: order.finalAmountEur ?? basePriceEur,
      },
    });

    return NextResponse.json({
      ok: true,
      finalAmountEur: updated.finalAmountEur ?? basePriceEur,
    });
  } catch (err) {
    console.error("Eroare la salvarea facturării curs practic", err);
    return NextResponse.json(
      { error: t("course.api.internalRetry") },
      { status: 500 },
    );
  }
}
