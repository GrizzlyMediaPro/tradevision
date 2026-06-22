import type {
  BillingData,
  BillingDataPF,
  BillingDataPJ,
  PersonType,
} from "@/lib/practicalCourseValidation";

export type SmartBillConfig = {
  enabled: boolean;
  email: string;
  token: string;
  companyVatCode: string;
  apiUrl: string;
  invoiceSeries: string;
  productName: string;
  productCode: string;
  measuringUnit: string;
  taxName: string;
  taxPercentage: number;
  currency: string;
  paymentType: string;
  language: string;
};

export type SmartBillInvoiceResult = {
  series: string;
  number: string;
};

type SmartBillClientInput = {
  name: string;
  vatCode?: string;
  isTaxPayer: boolean;
  address: string;
  city: string;
  county: string;
  country: string;
  email: string;
  phone?: string;
  saveToDb: boolean;
};

type SmartBillProductInput = {
  name?: string;
  code?: string;
  measuringUnitName: string;
  currency: string;
  quantity?: number;
  price?: number;
  isTaxIncluded: boolean;
  taxName: string;
  taxPercentage: number;
  isService?: boolean;
  saveToDb: boolean;
  isDiscount?: boolean;
  numberOfItems?: number;
  discountType?: 1 | 2;
  discountValue?: number;
  discountPercentage?: number;
};

export type CourseInvoiceDiscount = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  amountRon: number;
};

function trimEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function parseNumberEnv(key: string, fallback: number): number {
  const raw = trimEnv(key);
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function getSmartBillConfig(): SmartBillConfig | null {
  const email = trimEnv("SMARTBILL_EMAIL");
  const token = trimEnv("SMARTBILL_TOKEN");
  const companyVatCode = trimEnv("SMARTBILL_COMPANY_VAT_CODE");
  const invoiceSeries = trimEnv("SMARTBILL_INVOICE_SERIES");

  const explicitlyDisabled = trimEnv("SMARTBILL_ENABLED").toLowerCase() === "false";
  if (explicitlyDisabled) return null;

  if (!email || !token || !companyVatCode || !invoiceSeries) {
    return null;
  }

  return {
    enabled: true,
    email,
    token,
    companyVatCode,
    apiUrl:
      trimEnv("SMARTBILL_API_URL") || "https://ws.smartbill.ro/SBORO/api",
    invoiceSeries,
    productName:
      trimEnv("SMARTBILL_PRODUCT_NAME") ||
      "Curs Futures",
    productCode: trimEnv("SMARTBILL_PRODUCT_CODE") || "CURS-PRACTIC",
    measuringUnit: trimEnv("SMARTBILL_MEASURING_UNIT") || "buc",
    taxName: trimEnv("SMARTBILL_TAX_NAME") || "Normala",
    taxPercentage: parseNumberEnv("SMARTBILL_TAX_PERCENTAGE", 21),
    currency: trimEnv("SMARTBILL_CURRENCY") || "RON",
    paymentType: trimEnv("SMARTBILL_PAYMENT_TYPE") || "Card",
    language: trimEnv("SMARTBILL_LANGUAGE") || "RO",
  };
}

function getAuthHeader(email: string, token: string): string {
  return `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
}

function formatIssueDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildClientAddress(
  personType: PersonType,
  billingData: BillingData,
): string {
  if (personType === "PF") {
    const pf = billingData as BillingDataPF;
    return `${pf.street} ${pf.streetNumber}`.trim();
  }
  return (billingData as BillingDataPJ).street.trim();
}

function buildSmartBillClient(
  personType: PersonType,
  billingData: BillingData,
): SmartBillClientInput {
  if (personType === "PF") {
    const pf = billingData as BillingDataPF;
    return {
      name: `${pf.firstName} ${pf.lastName}`.trim(),
      isTaxPayer: false,
      address: buildClientAddress(personType, billingData),
      city: pf.city.trim(),
      county: pf.county.trim(),
      country: "Romania",
      email: pf.email.trim(),
      phone: pf.phone.trim(),
      saveToDb: true,
    };
  }

  const pj = billingData as BillingDataPJ;
  const cui = pj.cui.replace(/\D/g, "");
  return {
    name: pj.companyName.trim(),
    vatCode: cui,
    isTaxPayer: true,
    address: buildClientAddress(personType, billingData),
    city: pj.city.trim(),
    county: pj.county.trim(),
    country: "Romania",
    email: pj.email.trim(),
    phone: pj.phone.trim(),
    saveToDb: true,
  };
}

async function smartBillRequest<T>(
  config: SmartBillConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: getAuthHeader(config.email, config.token),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `SmartBill API error (${response.status})${body ? `: ${body}` : ""}`,
    );
  }

  if (init?.method === "GET" && path.includes("/invoice/pdf")) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer as T;
  }

  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

function buildInvoiceProducts(
  config: SmartBillConfig,
  currency: string,
  input: {
    listAmountRon: number;
    finalAmountRon: number;
    discount?: CourseInvoiceDiscount | null;
  },
): SmartBillProductInput[] {
  const productLine: SmartBillProductInput = {
    name: config.productName,
    code: config.productCode,
    measuringUnitName: config.measuringUnit,
    currency,
    quantity: 1,
    price: input.discount ? input.listAmountRon : input.finalAmountRon,
    isTaxIncluded: true,
    taxName: config.taxName,
    taxPercentage: config.taxPercentage,
    isService: true,
    saveToDb: false,
    isDiscount: false,
  };

  if (!input.discount) {
    return [productLine];
  }

  const discountName =
    input.discount.type === "percent"
      ? `Reducere ${input.discount.code} (${input.discount.value}%)`
      : `Reducere ${input.discount.code}`;

  const discountLine: SmartBillProductInput = {
    name: discountName,
    isDiscount: true,
    numberOfItems: 1,
    measuringUnitName: config.measuringUnit,
    currency,
    isTaxIncluded: true,
    taxName: config.taxName,
    taxPercentage: config.taxPercentage,
    saveToDb: false,
    ...(input.discount.type === "percent"
      ? {
          discountType: 2 as const,
          discountPercentage: input.discount.value,
        }
      : {
          discountType: 1 as const,
          discountValue: -input.discount.amountRon,
        }),
  };

  return [productLine, discountLine];
}

export async function createCourseInvoice(input: {
  personType: PersonType;
  billingData: BillingData;
  amount: number;
  listAmountRon?: number;
  discount?: CourseInvoiceDiscount | null;
  currency?: string;
  paidAt?: Date | null;
}): Promise<SmartBillInvoiceResult> {
  const config = getSmartBillConfig();
  if (!config) {
    throw new Error("SmartBill nu este configurat.");
  }

  const currency = input.currency?.trim() || config.currency;
  const issueDate = formatIssueDate(input.paidAt ?? new Date());
  const client = buildSmartBillClient(input.personType, input.billingData);
  const products = buildInvoiceProducts(config, currency, {
    listAmountRon: input.listAmountRon ?? input.amount,
    finalAmountRon: input.amount,
    discount: input.discount,
  });

  const payload = {
    companyVatCode: config.companyVatCode,
    client,
    isDraft: false,
    issueDate,
    dueDate: issueDate,
    seriesName: config.invoiceSeries,
    currency,
    language: config.language,
    precision: 2,
    products,
    payment: {
      value: input.amount,
      type: config.paymentType,
      isCash: false,
    },
  };

  const result = await smartBillRequest<{
    series?: string;
    number?: string;
    errorText?: string;
    message?: string;
  }>(config, "/invoice", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (result.errorText?.trim()) {
    throw new Error(result.errorText.trim());
  }

  const series = result.series?.trim() || config.invoiceSeries;
  const number = result.number?.trim();
  if (!number) {
    throw new Error(
      result.message?.trim() || "SmartBill nu a returnat numărul facturii.",
    );
  }

  return { series, number };
}

export async function downloadInvoicePdf(input: {
  series: string;
  number: string;
}): Promise<Buffer> {
  const config = getSmartBillConfig();
  if (!config) {
    throw new Error("SmartBill nu este configurat.");
  }

  const params = new URLSearchParams({
    cif: config.companyVatCode,
    seriesname: input.series,
    number: input.number,
  });

  return smartBillRequest<Buffer>(
    config,
    `/invoice/pdf?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/octet-stream",
      },
    },
  );
}
