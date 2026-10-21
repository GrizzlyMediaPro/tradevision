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
import {
  createCourseInvoice,
  downloadInvoicePdf,
  getSmartBillConfig,
  type CourseInvoiceDiscount,
} from "@/lib/smartbill";
import { convertEurToRon } from "@/lib/eurRonExchange";
import { messages } from "@/lib/i18n/messages/catalog";
import { parseLocale, type Locale } from "@/lib/i18n/locale";
import { translate } from "@/lib/i18n/translate";

function readOrderLocale(billingData: unknown): Locale {
  if (!billingData || typeof billingData !== "object") return "en";
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

async function issueSmartBillInvoice(input: {
  orderId: string;
  personType: PersonType;
  billingData: BillingData;
  finalAmountRon: number;
  listAmountRon: number;
  discount: CourseInvoiceDiscount | null;
  paidAt: Date | null;
  existingSeries: string | null;
  existingNumber: string | null;
  locale: Locale;
}): Promise<{
  invoiceSeries: string | null;
  invoiceNumber: string | null;
  invoicePdf: Buffer | null;
  error?: string;
}> {
  const smartBillConfig = getSmartBillConfig();
  if (!smartBillConfig) {
    return {
      invoiceSeries: null,
      invoiceNumber: null,
      invoicePdf: null,
    };
  }

  let invoiceSeries = input.existingSeries;
  let invoiceNumber = input.existingNumber;

  try {
    if (!invoiceSeries || !invoiceNumber) {
      const invoice = await createCourseInvoice({
        personType: input.personType,
        billingData: input.billingData,
        amount: input.finalAmountRon,
        listAmountRon: input.listAmountRon,
        discount: input.discount,
        currency: "RON",
        paidAt: input.paidAt,
      });
      invoiceSeries = invoice.series;
      invoiceNumber = invoice.number;

      await prisma.practicalCourseOrder.update({
        where: { id: input.orderId },
        data: {
          smartbillInvoiceSeries: invoiceSeries,
          smartbillInvoiceNumber: invoiceNumber,
        },
      });
    }

    const invoicePdf = await downloadInvoicePdf({
      series: invoiceSeries,
      number: invoiceNumber,
    });

    return { invoiceSeries, invoiceNumber, invoicePdf };
  } catch (err) {
    const error = parseSmartBillError(err, input.locale);
    console.error(`SmartBill failed for order ${input.orderId}`, err);
    return {
      invoiceSeries: invoiceSeries ?? null,
      invoiceNumber: invoiceNumber ?? null,
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
    order.smartbillInvoiceSeries && order.smartbillInvoiceNumber,
  );

  if (alreadyEmailed && alreadyInvoiced) {
    return { emailSent: true, invoiceIssued: true };
  }

  let invoiceDiscount: CourseInvoiceDiscount | null = null;
  let listAmountRon = paymentAmounts.finalAmountRon;

  if (
    order.discountCode &&
    order.discountType &&
    typeof order.discountAmountEur === "number" &&
    order.discountAmountEur > 0
  ) {
    const discountAmountRon = convertEurToRon(
      order.discountAmountEur,
      paymentAmounts.eurRonRate,
    );
    listAmountRon = convertEurToRon(
      paymentAmounts.finalAmountEur + order.discountAmountEur,
      paymentAmounts.eurRonRate,
    );

    invoiceDiscount = {
      code: order.discountCode,
      type: order.discountType as "percent" | "fixed",
      value: order.discountValue ?? 0,
      amountRon: discountAmountRon,
    };
  }

  const invoiceResult = await issueSmartBillInvoice({
    orderId,
    personType,
    billingData,
    finalAmountRon: paymentAmounts.finalAmountRon,
    listAmountRon,
    discount: invoiceDiscount,
    paidAt: order.paidAt,
    existingSeries: order.smartbillInvoiceSeries,
    existingNumber: order.smartbillInvoiceNumber,
    locale,
  });

  const invoiceIssued = Boolean(
    invoiceResult.invoicePdf &&
      invoiceResult.invoicePdf.length > 0 &&
      invoiceResult.invoiceSeries &&
      invoiceResult.invoiceNumber,
  );

  if (!alreadyEmailed) {
    await sendPracticalCourseThankYouEmail({
      recipientEmail,
      recipientName,
      finalAmountEur: paymentAmounts.finalAmountEur,
      invoicePdf: invoiceResult.invoicePdf,
      invoiceSeries: invoiceResult.invoiceSeries,
      invoiceNumber: invoiceResult.invoiceNumber,
      locale,
    });

    await prisma.practicalCourseOrder.update({
      where: { id: orderId },
      data: { fulfillmentEmailSentAt: new Date() },
    });
  } else if (invoiceIssued) {
    await sendPracticalCourseInvoiceEmail({
      recipientEmail,
      recipientName,
      invoicePdf: invoiceResult.invoicePdf!,
      invoiceSeries: invoiceResult.invoiceSeries!,
      invoiceNumber: invoiceResult.invoiceNumber!,
      locale,
    });
  }

  return {
    emailSent: alreadyEmailed || true,
    invoiceIssued,
    smartbillError: invoiceIssued ? undefined : invoiceResult.error,
  };
}
