import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { incrementDiscountUsage } from "@/lib/practicalCourseDiscount";
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
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.practicalCourseOrder.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          paidAt: new Date(),
        },
      });

      if (order.discountCode) {
        await incrementDiscountUsage(order.discountCode);
      }
    }
  }

  return NextResponse.json({ received: true });
}
