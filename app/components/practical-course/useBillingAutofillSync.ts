"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  BillingDataPF,
  BillingDataPJ,
  BillingPayload,
  PersonType,
} from "@/lib/practicalCourseValidation";

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

function mergePfState(
  state: BillingDataPF,
  values: Record<string, string>,
): BillingDataPF {
  const next = { ...state };
  for (const [name, key] of Object.entries(PF_FIELD_MAP)) {
    const domValue = values[name];
    if (domValue !== undefined && domValue !== "") {
      next[key] = domValue;
    }
  }
  return next;
}

function mergePjState(
  state: BillingDataPJ,
  values: Record<string, string>,
): BillingDataPJ {
  const next = { ...state };
  for (const [name, key] of Object.entries(PJ_FIELD_MAP)) {
    const domValue = values[name];
    if (domValue !== undefined && domValue !== "") {
      next[key] = domValue;
    }
  }
  return next;
}

export function useBillingAutofillSync(
  personType: PersonType,
  billingPF: BillingDataPF,
  billingPJ: BillingDataPJ,
  acceptedTerms: boolean,
  acceptedPrivacy: boolean,
  setBillingPF: Dispatch<SetStateAction<BillingDataPF>>,
  setBillingPJ: Dispatch<SetStateAction<BillingDataPJ>>,
  onDomChange?: () => void,
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const personTypeRef = useRef(personType);
  const billingPFRef = useRef(billingPF);
  const billingPJRef = useRef(billingPJ);
  const onDomChangeRef = useRef(onDomChange);

  personTypeRef.current = personType;
  billingPFRef.current = billingPF;
  billingPJRef.current = billingPJ;
  onDomChangeRef.current = onDomChange;

  const syncFromDom = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const values = readFormValues(form);

    if (personTypeRef.current === "PF") {
      const merged = mergePfState(billingPFRef.current, values);
      const changed = Object.keys(merged).some(
        (key) =>
          merged[key as keyof BillingDataPF] !==
          billingPFRef.current[key as keyof BillingDataPF],
      );
      if (changed) {
        setBillingPF(merged);
        onDomChangeRef.current?.();
      }
      return;
    }

    const merged = mergePjState(billingPJRef.current, values);
    const changed = Object.keys(merged).some(
      (key) =>
        merged[key as keyof BillingDataPJ] !==
        billingPJRef.current[key as keyof BillingDataPJ],
    );
    if (changed) {
      setBillingPJ(merged);
      onDomChangeRef.current?.();
    }
  }, [setBillingPF, setBillingPJ]);

  const getMergedPayload = useCallback((): BillingPayload => {
    const form = formRef.current;
    const values = form ? readFormValues(form) : {};

    if (personType === "PF") {
      return {
        personType,
        acceptedTerms,
        acceptedPrivacy,
        billingData: form
          ? mergePfState(billingPFRef.current, values)
          : billingPFRef.current,
      };
    }

    return {
      personType,
      acceptedTerms,
      acceptedPrivacy,
      billingData: form
        ? mergePjState(billingPJRef.current, values)
        : billingPJRef.current,
    };
  }, [personType, acceptedTerms, acceptedPrivacy]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleAutofillAnimation = (event: AnimationEvent) => {
      if (event.animationName === "billingAutofillStart") {
        syncFromDom();
      }
    };

    form.addEventListener("animationstart", handleAutofillAnimation);
    form.addEventListener("input", syncFromDom, true);
    form.addEventListener("change", syncFromDom, true);
    form.addEventListener("focusin", syncFromDom, true);

    const interval = window.setInterval(syncFromDom, 500);

    return () => {
      form.removeEventListener("animationstart", handleAutofillAnimation);
      form.removeEventListener("input", syncFromDom, true);
      form.removeEventListener("change", syncFromDom, true);
      form.removeEventListener("focusin", syncFromDom, true);
      window.clearInterval(interval);
    };
  }, [personType, syncFromDom]);

  useLayoutEffect(() => {
    syncFromDom();
  }, [acceptedTerms, acceptedPrivacy, personType, syncFromDom]);

  return { formRef, syncFromDom, getMergedPayload };
}
