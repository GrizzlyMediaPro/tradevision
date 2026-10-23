import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { fulfillPaidPracticalCourseOrder } from "@/lib/practicalCourseFulfillment";
import { completePaidPracticalCourseOrder } from "@/lib/practicalCoursePayment";
import { getStripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook neconfigurat." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Semnătură lipsă." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature error", err);
    return NextResponse.json({ error: "Semnătură invalidă." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId?.trim();
    if (!orderId) {
      console.error(
        "Stripe webhook: checkout.session.completed fără orderId",
        session.id,
      );
    } else {
      try {
        await completePaidPracticalCourseOrder(orderId, session);
      } catch (err) {
        console.error("Practical course fulfillment failed", orderId, err);
        return NextResponse.json(
          { error: "Fulfillment eșuat." },
          { status: 500 },
        );
      }
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const orderId = invoice.metadata?.orderId?.trim();
    if (orderId) {
      try {
        await prisma.practicalCourseOrder.update({
          where: { id: orderId },
          data: { stripeInvoiceId: invoice.id },
        });
        const order = await prisma.practicalCourseOrder.findUnique({
          where: { id: orderId },
          select: { status: true },
        });
        if (order?.status === "paid") {
          await fulfillPaidPracticalCourseOrder(orderId);
        }
      } catch (err) {
        console.error("Stripe invoice fulfillment failed", orderId, err);
        return NextResponse.json(
          { error: "Fulfillment eșuat." },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
