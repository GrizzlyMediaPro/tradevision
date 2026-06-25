import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import {
  assertOrderAccess,
  isOrderPaid,
  isOrderReadyForCheckout,
} from "@/lib/practicalCourseOrder";
import {
  getBasePriceEur,
  getOrderFinalAmountEur,
} from "@/lib/practicalCoursePricing";
import {
  convertEurToRon,
  getEurRonQuote,
  ronToStripeBani,
} from "@/lib/eurRonExchange";
import { getSiteUrl, getStripeClient } from "@/lib/stripe";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Plata online nu este configurată momentan." },
        { status: 503 },
      );
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id },
    });
    if (!order) {
      return NextResponse.json({ error: "Comanda nu a fost găsită." }, { status: 404 });
    }
    if (isOrderPaid(order.status)) {
      return NextResponse.json({ error: "Comanda este deja plătită." }, { status: 400 });
    }
    if (!isOrderReadyForCheckout(order.status)) {
      return NextResponse.json(
        { error: "Completează formularul înainte de plată." },
        { status: 400 },
      );
    }
    if (!order.acceptedTerms || !order.acceptedPrivacy || !order.billingData) {
      return NextResponse.json(
        { error: "Completează toate câmpurile și acordurile obligatorii." },
        { status: 400 },
      );
    }

    const billing = order.billingData as Record<string, string>;
    const customerEmail = billing.email?.trim();
    const finalAmountEur = await getOrderFinalAmountEur(order);
    const eurRonQuote = await getEurRonQuote();
    const finalAmountRon = convertEurToRon(finalAmountEur, eurRonQuote.rate);
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "ron",
            unit_amount: ronToStripeBani(finalAmountRon),
            product_data: {
              name: PRACTICAL_COURSE.title,
              description: `${PRACTICAL_COURSE.subtitle} (preț contractual ${finalAmountEur} EUR)`,
            },
          },
        },
      ],
      success_url: `${siteUrl}${PRACTICAL_COURSE.thanksPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${PRACTICAL_COURSE.path}?cancelled=1`,
      metadata: {
        orderId: id,
        discountCode: order.discountCode ?? "",
        finalAmountEur: String(finalAmountEur),
        finalAmountRon: String(finalAmountRon),
        eurRonRate: String(eurRonQuote.rate),
        eurRonRateSource: eurRonQuote.source,
      },
    });

    await prisma.practicalCourseOrder.update({
      where: { id },
      data: {
        stripeSessionId: session.id,
        status: "pending_payment",
        finalAmountEur,
        finalAmountRon,
        eurRonRate: eurRonQuote.rate,
        eurRonRateDate: eurRonQuote.publishedAt,
        eurRonRateSource: eurRonQuote.source,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Eroare la crearea sesiunii Stripe", err);
    return NextResponse.json(
      { error: "Eroare internă. Te rugăm să încerci din nou." },
      { status: 500 },
    );
  }
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!(await assertOrderAccess(id))) {
      return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
    }

    const order = await prisma.practicalCourseOrder.findUnique({
      where: { id },
      select: {
        status: true,
        finalAmountEur: true,
        discountCode: true,
        paidAt: true,
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Comanda nu a fost găsită." }, { status: 404 });
    }

    return NextResponse.json({
      ...order,
      baseAmountEur: await getBasePriceEur(),
    });
  } catch (err) {
    console.error("Eroare la citirea stării comenzii", err);
    return NextResponse.json({ error: "Eroare internă." }, { status: 500 });
  }
}
