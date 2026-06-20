"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { BillingDataPF, BillingDataPJ } from "@/lib/practicalCourseValidation";

const PF_FIELD_MAP: Record<string, keyof BillingDataPF> = {
  "given-name": "firstName",
  "family-name": "lastName",
  cnp: "cnp",
  bday: "birthDate",
  email: "email",
  tel: "phone",
  "address-line1": "street",
  "address-line2": "streetNumber",
  "address-level2": "city",
  "address-level1": "county",
  "postal-code": "postalCode",
};

const PJ_FIELD_MAP: Record<string, keyof BillingDataPJ> = {
  organization: "companyName",
  cui: "cui",
  "registration-number": "registrationNumber",
  "legal-representative": "legalRepresentative",
  email: "email",
  tel: "phone",
  "address-line1": "street",
  "address-level2": "city",
  "address-level1": "county",
  "postal-code": "postalCode",
  iban: "iban",
};

function readFormValues(form: HTMLFormElement): Record<string, string> {
  const values: Record<string, string> = {};
  form.querySelectorAll<HTMLInputElement>("input[name]").forEach((input) => {
    if (input.name) values[input.name] = input.value;
  });
  return values;
}

export function useBillingAutofillSync(
  personType: "PF" | "PJ",
  setBillingPF: Dispatch<SetStateAction<BillingDataPF>>,
  setBillingPJ: Dispatch<SetStateAction<BillingDataPJ>>,
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const personTypeRef = useRef(personType);
  personTypeRef.current = personType;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const syncFromDom = () => {
      const values = readFormValues(form);

      if (personTypeRef.current === "PF") {
        setBillingPF((prev) => {
          const next = { ...prev };
          let changed = false;
          for (const [name, key] of Object.entries(PF_FIELD_MAP)) {
            const domValue = values[name];
            if (domValue !== undefined && domValue !== prev[key]) {
              next[key] = domValue;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
        return;
      }

      setBillingPJ((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const [name, key] of Object.entries(PJ_FIELD_MAP)) {
          const domValue = values[name];
          if (domValue !== undefined && domValue !== prev[key]) {
            next[key] = domValue;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    const handleAutofillAnimation = (event: AnimationEvent) => {
      if (event.animationName === "billingAutofillStart") {
        syncFromDom();
      }
    };

    form.addEventListener("animationstart", handleAutofillAnimation);
    const interval = window.setInterval(syncFromDom, 400);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 4000);

    return () => {
      form.removeEventListener("animationstart", handleAutofillAnimation);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [personType, setBillingPF, setBillingPJ]);

  return formRef;
}
