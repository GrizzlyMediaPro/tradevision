import { prisma } from "@/lib/db";
import {
  getBillingEmail,
  getClientDisplayName,
  type BillingData,
  type PersonType,
} from "@/lib/practicalCourseValidation";
import { getOrderPaymentAmounts } from "@/lib/practicalCoursePricing";
import {
  sendPracticalCourseInvoiceEmail,
  sendPracticalCourseThankYouEmail,
} from "@/lib/practicalCourseThankYouEmail";
import { downloadStripeInvoice, invoiceIdFromSession } from "@/lib/stripeInvoice";
import { getStripeClient } from "@/lib/stripe";
import { messages } from "@/lib/i18n/messages/catalog";
import { DEFAULT_LOCALE, parseLocale, type Locale } from "@/lib/i18n/locale";
import { translate } from "@/lib/i18n/translate";

function readOrderLocale(billingData: unknown): Locale {
  if (!billingData || typeof billingData !== "object") return DEFAULT_LOCALE;
  const value = (billingData as { locale?: unknown }).locale;
  return parseLocale(typeof value === "string" ? value : undefined);
}

export type FulfillmentResult = {
  emailSent: boolean;
  invoiceIssued: boolean;
  smartbillError?: string;
};

function parseSmartBillError(err: unknown, locale: Locale): string {
  if (!(err instanceof Error)) {
    return translate(messages[locale], "course.invoice.unknownError");
  }
  const match = err.message.match(/\{.*\}/);
  if (!match) return err.message;
  try {
    const parsed = JSON.parse(match[0]) as { errorText?: string };
    return parsed.errorText?.trim() || err.message;
  } catch {
    return err.message;
  }
}

async function issueStripeInvoice(input: {
  orderId: string;
  stripeSessionId: string | null;
  existingInvoiceId: string | null;
  locale: Locale;
}): Promise<{
  invoiceNumber: string | null;
  invoicePdf: Buffer | null;
  error?: string;
}> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { invoiceNumber: null, invoicePdf: null };
  }

  let invoiceId = input.existingInvoiceId;
  try {
    if (!invoiceId && input.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(input.stripeSessionId);
      invoiceId = invoiceIdFromSession(session);
      if (invoiceId) {
        await prisma.practicalCourseOrder.update({
          where: { id: input.orderId },
          data: { stripeInvoiceId: invoiceId },
        });
      }
    }

    if (!invoiceId) {
      return {
        invoiceNumber: null,
        invoicePdf: null,
        error: translate(messages[input.locale], "course.invoice.notReady"),
      };
    }

    const invoice = await downloadStripeInvoice(invoiceId);
    await prisma.practicalCourseOrder.update({
      where: { id: input.orderId },
      data: {
        stripeInvoiceId: invoice.id,
        stripeInvoiceNumber: invoice.number,
      },
    });

    return { invoiceNumber: invoice.number, invoicePdf: invoice.pdf };
  } catch (err) {
    const error = parseSmartBillError(err, input.locale);
    console.error(`Stripe invoice failed for order ${input.orderId}`, err);
    return {
      invoiceNumber: null,
      invoicePdf: null,
      error,
    };
  }
}

export async function fulfillPaidPracticalCourseOrder(
  orderId: string,
): Promise<FulfillmentResult> {
  const order = await prisma.practicalCourseOrder.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== "paid") {
    return { emailSent: false, invoiceIssued: false };
  }

  const personType = order.personType as PersonType | null;
  const billingData = order.billingData as BillingData | null;
  const locale = readOrderLocale(billingData);
  const recipientEmail = getBillingEmail(personType, billingData);
  const recipientName = getClientDisplayName(personType, billingData);

  if (!recipientEmail) {
    throw new Error(
      `Comanda ${orderId} nu are adresă de email pentru facturare.`,
    );
  }

  if (!personType || !billingData) {
    throw new Error(`Comanda ${orderId} nu are date complete de facturare.`);
  }

  const paymentAmounts = await getOrderPaymentAmounts(order);
  const alreadyEmailed = Boolean(order.fulfillmentEmailSentAt);
  const alreadyInvoiced = Boolean(
    order.stripeInvoiceNumber ||
      (order.smartbillInvoiceSeries && order.smartbillInvoiceNumber),
  );

  if (alreadyEmailed && alreadyInvoiced) {
    return { emailSent: true, invoiceIssued: true };
  }

  const invoiceResult = await issueStripeInvoice({
    orderId,
    stripeSessionId: order.stripeSessionId,
    existingInvoiceId: order.stripeInvoiceId,
    locale,
  });

  const invoiceIssued = Boolean(
    invoiceResult.invoicePdf &&
      invoiceResult.invoicePdf.length > 0 &&
      invoiceResult.invoiceNumber,
  );

  if (!alreadyEmailed) {
    await sendPracticalCourseThankYouEmail({
      recipientEmail,
      recipientName,
      finalAmountEur: paymentAmounts.finalAmountEur,
      invoicePdf: invoiceResult.invoicePdf,
      invoiceNumber: invoiceResult.invoiceNumber,
      locale,
    });

    await prisma.practicalCourseOrder.update({
      where: { id: orderId },
      data: { fulfillmentEmailSentAt: new Date() },
    });
  } else if (invoiceIssued && invoiceResult.invoicePdf && invoiceResult.invoiceNumber) {
    await sendPracticalCourseInvoiceEmail({
      recipientEmail,
      recipientName,
      invoicePdf: invoiceResult.invoicePdf,
      invoiceNumber: invoiceResult.invoiceNumber,
      locale,
    });
  }

  return {
    emailSent: alreadyEmailed || true,
    invoiceIssued,
    smartbillError: invoiceIssued ? undefined : invoiceResult.error,
  };
}
