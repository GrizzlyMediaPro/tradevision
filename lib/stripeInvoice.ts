import { SITE_OPERATOR } from "@/app/data/siteOperator";
import type { PersonType } from "@/lib/practicalCourseValidation";
import { getStripeClient } from "@/lib/stripe";
import type Stripe from "stripe";

export function buildCheckoutCustomer(input: {
  personType: PersonType;
  billing: Record<string, string>;
  orderId: string;
}): Stripe.CustomerCreateParams {
  const billing = input.billing;
  const isCompany = input.personType === "PJ";
  const name = isCompany
    ? billing.companyName?.trim()
    : `${billing.firstName ?? ""} ${billing.lastName ?? ""}`.trim();
  const line1 = isCompany
    ? billing.street?.trim()
    : `${billing.street ?? ""} ${billing.streetNumber ?? ""}`.trim();

  return {
    email: billing.email?.trim() || undefined,
    name: name || undefined,
    phone: billing.phone?.trim() || undefined,
    address: {
      line1: line1 || undefined,
      city: billing.city?.trim() || undefined,
      state: billing.county?.trim() || undefined,
      postal_code: billing.postalCode?.trim() || undefined,
      country: "RO",
    },
    metadata: { orderId: input.orderId },
  };
}

export function buildInvoiceCreation(input: {
  orderId: string;
  personType: PersonType;
  billing: Record<string, string>;
  description: string;
}): Stripe.Checkout.SessionCreateParams.InvoiceCreation {
  const customFields: Stripe.Checkout.SessionCreateParams.InvoiceCreation.InvoiceData.CustomField[] =
    [];
  if (input.personType === "PJ") {
    const cui = input.billing.cui?.trim();
    const registration = input.billing.registrationNumber?.trim();
    if (cui) customFields.push({ name: "CUI", value: cui.slice(0, 140) });
    if (registration) {
      customFields.push({
        name: "Nr. înregistrare",
        value: registration.slice(0, 140),
      });
    }
  }

  return {
    enabled: true,
    invoice_data: {
      description: input.description,
      metadata: { orderId: input.orderId },
      footer: `${SITE_OPERATOR.legalName}, CUI ${SITE_OPERATOR.cui}, ${SITE_OPERATOR.tradeRegister}`,
      ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
    },
  };
}

export function invoiceIdFromSession(
  session: Stripe.Checkout.Session,
): string | null {
  if (!session.invoice) return null;
  return typeof session.invoice === "string" ? session.invoice : session.invoice.id;
}

export async function downloadStripeInvoice(invoiceId: string): Promise<{
  id: string;
  number: string;
  pdf: Buffer;
}> {
  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error("Stripe nu este configurat.");
  }

  const invoice = await stripe.invoices.retrieve(invoiceId);
  if (!invoice.invoice_pdf || !invoice.number) {
    throw new Error("Factura Stripe nu este încă disponibilă.");
  }

  const response = await fetch(invoice.invoice_pdf);
  if (!response.ok) {
    throw new Error(`Nu am putut descărca factura Stripe (${response.status}).`);
  }

  const pdf = Buffer.from(await response.arrayBuffer());
  if (pdf.length === 0) {
    throw new Error("Factura Stripe este goală.");
  }

  return { id: invoice.id, number: invoice.number, pdf };
}
