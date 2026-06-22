"use client";

import type { BillingDataPF } from "@/lib/practicalCourseValidation";
import { BirthDateField } from "./BirthDateField";
import { BillingField } from "./BillingField";

type BillingFormPFProps = {
  value: BillingDataPF;
  onChange: (value: BillingDataPF) => void;
};

export function BillingFormPF({ value, onChange }: BillingFormPFProps) {
  const set = (key: keyof BillingDataPF, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BillingField
        label="Nume"
        name="family-name"
        autoComplete="billing family-name"
        value={value.lastName}
        onChange={(val) => set("lastName", val)}
      />
      <BillingField
        label="Prenume"
        name="given-name"
        autoComplete="billing given-name"
        value={value.firstName}
        onChange={(val) => set("firstName", val)}
      />
      <BillingField
        label="CNP"
        name="cnp"
        autoComplete="off"
        value={value.cnp}
        onChange={(val) => set("cnp", val)}
        inputMode="numeric"
      />
      <BirthDateField
        value={value.birthDate}
        onChange={(val) => set("birthDate", val)}
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
        label="Stradă"
        name="address-line1"
        autoComplete="billing address-line1"
        value={value.street}
        onChange={(val) => set("street", val)}
      />
      <BillingField
        label="Număr"
        name="address-line2"
        autoComplete="billing address-line2"
        value={value.streetNumber}
        onChange={(val) => set("streetNumber", val)}
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
        className="sm:col-span-2"
      />
    </div>
  );
}

export const emptyBillingPF: BillingDataPF = {
  firstName: "",
  lastName: "",
  cnp: "",
  birthDate: "",
  email: "",
  phone: "",
  street: "",
  streetNumber: "",
  city: "",
  county: "",
  postalCode: "",
};
