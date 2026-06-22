export type PersonType = "PF" | "PJ";

export type BillingDataPF = {
  firstName: string;
  lastName: string;
  cnp: string;
  birthDate: string;
  email: string;
  phone: string;
  street: string;
  streetNumber: string;
  city: string;
  county: string;
  postalCode: string;
};

export type BillingDataPJ = {
  companyName: string;
  cui: string;
  registrationNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  legalRepresentative: string;
  email: string;
  phone: string;
  iban?: string;
};

export type BillingData = BillingDataPF | BillingDataPJ;

export type BillingPayload = {
  personType: PersonType;
  billingData: BillingData;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

export function isValidCnp(value: string) {
  return /^\d{13}$/.test(value.replace(/\s/g, ""));
}

export function isValidCui(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 2 && digits.length <= 10;
}

export function getClientDisplayName(
  personType: PersonType | string | null | undefined,
  billingData: unknown,
): string {
  if (!billingData || typeof billingData !== "object") return "Client";
  const data = billingData as Record<string, string>;
  if (personType === "PJ") {
    return data.legalRepresentative?.trim() || data.companyName?.trim() || "Client";
  }
  const first = data.firstName?.trim() ?? "";
  const last = data.lastName?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  return full || "Client";
}

export function getBillingEmail(
  personType: PersonType | string | null | undefined,
  billingData: unknown,
): string {
  if (!billingData || typeof billingData !== "object") return "";
  return String((billingData as Record<string, string>).email ?? "").trim();
}

export function validateBillingPayload(body: BillingPayload): string | null {
  if (body.personType !== "PF" && body.personType !== "PJ") {
    return "Tipul de persoană nu este valid.";
  }
  if (!body.acceptedTerms) {
    return "Trebuie să accepți termenii și condițiile.";
  }
  if (!body.acceptedPrivacy) {
    return "Trebuie să accepți politica de confidențialitate.";
  }

  const data = body.billingData;
  if (body.personType === "PF") {
    const pf = data as BillingDataPF;
    if (!pf.firstName?.trim() || pf.firstName.trim().length < 2) {
      return "Prenumele trebuie să aibă cel puțin 2 caractere.";
    }
    if (!pf.lastName?.trim() || pf.lastName.trim().length < 2) {
      return "Numele trebuie să aibă cel puțin 2 caractere.";
    }
    if (!isValidCnp(pf.cnp ?? "")) {
      return "CNP-ul nu este valid.";
    }
    if (!pf.birthDate?.trim()) {
      return "Data nașterii este obligatorie.";
    }
  } else {
    const pj = data as BillingDataPJ;
    if (!pj.companyName?.trim()) {
      return "Denumirea firmei este obligatorie.";
    }
    if (!isValidCui(pj.cui ?? "")) {
      return "CUI-ul nu este valid.";
    }
    if (!pj.registrationNumber?.trim()) {
      return "Numărul Reg. Com. este obligatoriu.";
    }
    if (!pj.legalRepresentative?.trim()) {
      return "Reprezentantul legal este obligatoriu.";
    }
  }

  const email = (data as { email?: string }).email?.trim() ?? "";
  const phone = (data as { phone?: string }).phone?.trim() ?? "";
  if (!email || !isValidEmail(email)) {
    return "Adresa de email nu este validă.";
  }
  if (!phone || !isValidPhone(phone)) {
    return "Numărul de telefon nu este valid.";
  }

  const street = (data as { street?: string }).street?.trim() ?? "";
  const city = (data as { city?: string }).city?.trim() ?? "";
  const county = (data as { county?: string }).county?.trim() ?? "";
  const postalCode = (data as { postalCode?: string }).postalCode?.trim() ?? "";

  if (!street) return "Strada este obligatorie.";
  if (body.personType === "PF") {
    const pf = data as BillingDataPF;
    if (!pf.streetNumber?.trim()) return "Numărul străzii este obligatoriu.";
  }
  if (!city) return "Localitatea este obligatorie.";
  if (!county) return "Județul este obligatoriu.";
  if (!postalCode) return "Codul poștal este obligatoriu.";

  return null;
}
