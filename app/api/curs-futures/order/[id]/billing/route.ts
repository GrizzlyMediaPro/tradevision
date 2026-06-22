import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertOrderAccess, isOrderReadyForCheckout } from "@/lib/practicalCourseOrder";
import {
  validateBillingPayload,
  type BillingPayload,
} from "@/lib/practicalCourseValidation";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id },
    });
    if (!order) {
      return NextResponse.json({ error: "Comanda nu a fost găsită." }, { status: 404 });
    }
    if (!isOrderReadyForCheckout(order.status)) {
      return NextResponse.json(
        { error: "Comanda nu mai poate fi modificată." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as BillingPayload;
    const validationError = validateBillingPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const basePriceEur = await getBasePriceEur();
    const updated = await prisma.practicalCourseOrder.update({
      where: { id },
      data: {
        personType: body.personType,
        billingData: body.billingData,
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
      { error: "Eroare internă. Te rugăm să încerci din nou." },
      { status: 500 },
    );
  }
}
