"use client";

import type { BillingDataPJ } from "@/lib/practicalCourseValidation";
import { BillingField } from "./BillingField";

type BillingFormPJProps = {
  value: BillingDataPJ;
  onChange: (value: BillingDataPJ) => void;
};

export function BillingFormPJ({ value, onChange }: BillingFormPJProps) {
  const set = (key: keyof BillingDataPJ, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BillingField
        label="Denumire firmă"
        name="organization"
        autoComplete="billing organization"
        value={value.companyName}
        onChange={(val) => set("companyName", val)}
        className="sm:col-span-2"
      />
      <BillingField
        label="CUI"
        name="cui"
        autoComplete="off"
        value={value.cui}
        onChange={(val) => set("cui", val)}
      />
      <BillingField
        label="Nr. Reg. Com."
        name="registration-number"
        autoComplete="off"
        value={value.registrationNumber}
        onChange={(val) => set("registrationNumber", val)}
      />
      <BillingField
        label="Reprezentant legal"
        name="legal-representative"
        autoComplete="name"
        value={value.legalRepresentative}
        onChange={(val) => set("legalRepresentative", val)}
        className="sm:col-span-2"
      />
      <BillingField
        label="Email"
        name="email"
        type="email"
        autoComplete="billing email"
        value={value.email}
        onChange={(val) => set("email", val)}
      />
      <BillingField
        label="Telefon"
        name="tel"
        type="tel"
        autoComplete="billing tel"
        value={value.phone}
        onChange={(val) => set("phone", val)}
      />
      <BillingField
        label="Stradă sediu"
        name="address-line1"
        autoComplete="billing address-line1"
        value={value.street}
        onChange={(val) => set("street", val)}
      />
      <BillingField
        label="Localitate"
        name="address-level2"
        autoComplete="billing address-level2"
        value={value.city}
        onChange={(val) => set("city", val)}
      />
      <BillingField
        label="Județ"
        name="address-level1"
        autoComplete="billing address-level1"
        value={value.county}
        onChange={(val) => set("county", val)}
      />
      <BillingField
        label="Cod poștal"
        name="postal-code"
        autoComplete="billing postal-code"
        value={value.postalCode}
        onChange={(val) => set("postalCode", val)}
      />
      <BillingField
        label="IBAN (opțional)"
        name="iban"
        autoComplete="off"
        value={value.iban ?? ""}
        onChange={(val) => set("iban", val)}
        className="sm:col-span-2"
      />
    </div>
  );
}

export const emptyBillingPJ: BillingDataPJ = {
  companyName: "",
  cui: "",
  registrationNumber: "",
  street: "",
  city: "",
  county: "",
  postalCode: "",
  legalRepresentative: "",
  email: "",
  phone: "",
  iban: "",
};
