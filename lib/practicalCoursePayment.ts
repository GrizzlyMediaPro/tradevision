import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { incrementDiscountUsage } from "@/lib/practicalCourseDiscount";
import { fulfillPaidPracticalCourseOrder, type FulfillmentResult } from "@/lib/practicalCourseFulfillment";
import { getStripeClient } from "@/lib/stripe";

function getPaymentIntentId(
  session: Stripe.Checkout.Session,
): string | null {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }
  return session.payment_intent?.id ?? null;
}

function getBillingEmailFromOrder(billingData: unknown): string | null {
  if (!billingData || typeof billingData !== "object") return null;
  return String((billingData as { email?: string }).email ?? "").trim() || null;
}

function parseStripeSessionRetrieveError(
  err: unknown,
  stripeSessionId: string,
): Error {
  const isLiveSession = stripeSessionId.startsWith("cs_live_");
  const isTestKey = !process.env.STRIPE_SECRET_KEY?.trim().startsWith("sk_live_");
  const isMissing =
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: string }).code === "resource_missing";

  if (isMissing && isLiveSession && isTestKey) {
    return new Error(
      "Plata este în Stripe live, dar serverul folosește chei de test. Reconciliază din producție (trade-vision.ro) sau setează STRIPE_SECRET_KEY live în .env.",
    );
  }

  if (err instanceof Error) return err;
  return new Error("Nu am putut citi sesiunea Stripe.");
}

async function buildConfirmResult(orderId: string): Promise<{
  status: "paid";
  fulfillmentSent: boolean;
  invoiceIssued: boolean;
  email: string | null;
  smartbillError?: string;
}> {
  const refreshed = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
    select: {
      fulfillmentEmailSentAt: true,
      billingData: true,
      smartbillInvoiceSeries: true,
      smartbillInvoiceNumber: true,
      stripeInvoiceNumber: true,
    },
  });

  return {
    status: "paid",
    fulfillmentSent: Boolean(refreshed?.fulfillmentEmailSentAt),
    invoiceIssued: Boolean(
      refreshed?.stripeInvoiceNumber ||
        (refreshed?.smartbillInvoiceSeries && refreshed?.smartbillInvoiceNumber),
    ),
    email: getBillingEmailFromOrder(refreshed?.billingData),
  };
}

export async function completePaidPracticalCourseOrder(
  orderId: string,
  session: Stripe.Checkout.Session,
): Promise<FulfillmentResult> {
  const existing = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
  });
  if (!existing) {
    console.error(
      "completePaidPracticalCourseOrder: comanda nu există",
      orderId,
      session.id,
    );
    return { emailSent: false, invoiceIssued: false };
  }

  const wasAlreadyPaid = existing.status === "paid";

  const order = await prisma.practicalCourseOrder.update({
    where: { id: orderId },
    data: {
      status: "paid",
      stripeSessionId: session.id,
      stripePaymentIntentId: getPaymentIntentId(session),
      stripeInvoiceId:
        (typeof session.invoice === "string"
          ? session.invoice
          : session.invoice?.id) ?? existing.stripeInvoiceId,
      paidAt: existing.paidAt ?? new Date(),
    },
  });

  if (!wasAlreadyPaid && order.discountCode) {
    await incrementDiscountUsage(order.discountCode);
  }

  return fulfillPaidPracticalCourseOrder(orderId);
}

export type ConfirmPaymentResult = {
  status: "paid" | "pending" | "not_found";
  fulfillmentSent: boolean;
  invoiceIssued?: boolean;
  email?: string | null;
  smartbillError?: string;
};

export async function confirmPracticalCoursePaymentBySession(
  stripeSessionId: string,
): Promise<ConfirmPaymentResult> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  const session = await stripe.checkout.sessions
    .retrieve(stripeSessionId)
    .catch((err) => {
      throw parseStripeSessionRetrieveError(err, stripeSessionId);
    });
  const orderId = session.metadata?.orderId?.trim();
  if (!orderId) {
    return { status: "not_found", fulfillmentSent: false, invoiceIssued: false };
  }

  if (session.payment_status !== "paid") {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  const fulfillment = await completePaidPracticalCourseOrder(orderId, session);
  const result = await buildConfirmResult(orderId);

  return {
    ...result,
    smartbillError: fulfillment.smartbillError,
    invoiceIssued: fulfillment.invoiceIssued,
  };
}

export async function reconcilePracticalCourseOrder(
  orderId: string,
): Promise<ConfirmPaymentResult> {
  const order = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { status: "not_found", fulfillmentSent: false, invoiceIssued: false };
  }

  if (order.status === "paid") {
    const fulfillment = await fulfillPaidPracticalCourseOrder(orderId);
    const result = await buildConfirmResult(orderId);
    return {
      ...result,
      smartbillError: fulfillment.smartbillError,
      invoiceIssued: fulfillment.invoiceIssued,
    };
  }

  if (!order.stripeSessionId) {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  return confirmPracticalCoursePaymentBySession(order.stripeSessionId);
}

export async function confirmPracticalCoursePayment(
  orderId: string,
): Promise<ConfirmPaymentResult> {
  const order = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { status: "not_found", fulfillmentSent: false, invoiceIssued: false };
  }

  if (order.status === "paid") {
    const fulfillment = await fulfillPaidPracticalCourseOrder(orderId);
    const result = await buildConfirmResult(orderId);

    return {
      ...result,
      smartbillError: fulfillment.smartbillError,
      invoiceIssued: fulfillment.invoiceIssued,
    };
  }

  if (!order.stripeSessionId) {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

  if (session.payment_status !== "paid") {
    return { status: "pending", fulfillmentSent: false, invoiceIssued: false };
  }

  const fulfillment = await completePaidPracticalCourseOrder(orderId, session);
  const result = await buildConfirmResult(orderId);

  return {
    ...result,
    smartbillError: fulfillment.smartbillError,
    invoiceIssued: fulfillment.invoiceIssued,
  };
}
