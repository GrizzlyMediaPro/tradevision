"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BillingFormPF,
  emptyBillingPF,
} from "@/app/components/practical-course/BillingFormPF";
import {
  BillingFormPJ,
  emptyBillingPJ,
} from "@/app/components/practical-course/BillingFormPJ";
import { LegalConsentCheckboxes } from "@/app/components/practical-course/LegalConsentCheckboxes";
import { OrderSummary } from "@/app/components/practical-course/OrderSummary";
import { PersonTypeToggle } from "@/app/components/practical-course/PersonTypeToggle";
import { PracticalCourseShell } from "@/app/components/practical-course/PracticalCourseShell";
import { useBillingAutofillSync } from "@/app/components/practical-course/useBillingAutofillSync";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import type { EurRonQuote } from "@/lib/eurRonExchange";
import type { AppliedDiscount } from "@/lib/practicalCoursePricing";
import {
  validateBillingPayload,
  type BillingPayload,
  type PersonType,
} from "@/lib/practicalCourseValidation";

type PracticalCourseCheckoutClientProps = {
  initialOrderId?: string | null;
  cancelled?: boolean;
  basePriceEur: number;
  eurRonQuote: EurRonQuote;
};

export function PracticalCourseCheckoutClient({
  initialOrderId = null,
  cancelled = false,
  basePriceEur,
  eurRonQuote,
}: PracticalCourseCheckoutClientProps) {
  const [orderId, setOrderId] = useState<string | null>(initialOrderId);
  const [bootLoading, setBootLoading] = useState(!initialOrderId);
  const [personType, setPersonType] = useState<PersonType>("PF");
  const [billingPF, setBillingPF] = useState(emptyBillingPF);
  const [billingPJ, setBillingPJ] = useState(emptyBillingPJ);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(
    null,
  );
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formRevision, setFormRevision] = useState(0);

  const { formRef, syncFromDom, getMergedPayload } = useBillingAutofillSync(
    personType,
    billingPF,
    billingPJ,
    acceptedTerms,
    acceptedPrivacy,
    setBillingPF,
    setBillingPJ,
    () => setFormRevision((value) => value + 1),
  );

  useEffect(() => {
    let cancelled = false;

    const ensureOrder = async () => {
      if (initialOrderId) {
        try {
          const res = await fetch(`${PRACTICAL_COURSE.apiPath}/order`);
          if (res.ok) {
            const data = (await res.json()) as { status?: string };
            if (data.status !== "paid") {
              if (!cancelled) {
                setOrderId(initialOrderId);
                setBootLoading(false);
              }
              return;
            }
          }
        } catch {
          // fall through to create a fresh order
        }
      }

      try {
        const res = await fetch(`${PRACTICAL_COURSE.apiPath}/order`, { method: "POST" });
        const data = (await res.json().catch(() => ({}))) as {
          orderId?: string;
        };
        if (!cancelled && res.ok && data.orderId) {
          setOrderId(data.orderId);
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    };

    void ensureOrder();
    return () => {
      cancelled = true;
    };
  }, [initialOrderId]);

  const payload = useMemo<BillingPayload>(() => getMergedPayload(), [
    personType,
    billingPF,
    billingPJ,
    acceptedTerms,
    acceptedPrivacy,
    formRevision,
    getMergedPayload,
  ]);

  const validationError = useMemo(
    () => validateBillingPayload(payload),
    [payload],
  );
  const canPay =
    validationError === null && Boolean(orderId) && acceptedTerms && acceptedPrivacy;

  const handleApplyDiscount = useCallback(async () => {
    if (!orderId || discountLoading) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const res = await fetch(`${PRACTICAL_COURSE.apiPath}/order/${orderId}/discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCodeInput }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        discount?: AppliedDiscount;
        error?: string;
      };
      if (!res.ok || !data.discount) {
        setDiscountError(data.error || "Codul nu a putut fi aplicat.");
        return;
      }
      setAppliedDiscount(data.discount);
      setDiscountCodeInput(data.discount.code);
    } catch {
      setDiscountError("Eroare de conexiune. Încearcă din nou.");
    } finally {
      setDiscountLoading(false);
    }
  }, [orderId, discountCodeInput, discountLoading]);

  const handleRemoveDiscount = useCallback(async () => {
    if (!orderId) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      await fetch(`${PRACTICAL_COURSE.apiPath}/order/${orderId}/discount`, {
        method: "DELETE",
      });
      setAppliedDiscount(null);
      setDiscountCodeInput("");
    } catch {
      setDiscountError("Nu am putut elimina codul.");
    } finally {
      setDiscountLoading(false);
    }
  }, [orderId]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      syncFromDom();
      const currentPayload = getMergedPayload();
      const submitValidationError = validateBillingPayload(currentPayload);

      if (submitValidationError || !orderId || status === "loading") {
        if (submitValidationError) {
          setSubmitError(submitValidationError);
          setStatus("error");
        }
        return;
      }

      setStatus("loading");
      setSubmitError(null);
      try {
        const billingRes = await fetch(
          `${PRACTICAL_COURSE.apiPath}/order/${orderId}/billing`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentPayload),
          },
        );
        const billingData = (await billingRes.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!billingRes.ok) {
          setSubmitError(billingData.error || "Nu am putut salva datele.");
          setStatus("error");
          return;
        }

        const checkoutRes = await fetch(
          `${PRACTICAL_COURSE.apiPath}/order/${orderId}/checkout`,
          { method: "POST" },
        );
        const checkoutData = (await checkoutRes.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!checkoutRes.ok || !checkoutData.url) {
          setSubmitError(
            checkoutData.error || "Plata nu a putut fi inițiată.",
          );
          setStatus("error");
          return;
        }
        window.location.href = checkoutData.url;
      } catch {
        setSubmitError("Eroare de conexiune. Încearcă din nou.");
        setStatus("error");
      }
    },
    [getMergedPayload, orderId, status, syncFromDom],
  );

  if (bootLoading) {
    return (
      <PracticalCourseShell
        title="Achiziție Curs Futures"
        subtitle="Se pregătește formularul..."
      >
        <p className="text-sm text-white/60">Un moment...</p>
      </PracticalCourseShell>
    );
  }

  return (
    <PracticalCourseShell
      title="Achiziție Curs Futures"
      subtitle="Completează datele de facturare, acceptă acordurile legale și finalizează plata."
    >
      {cancelled ? (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Plata a fost anulată. Poți completa din nou formularul și încerca
          din nou.
        </div>
      ) : null}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        autoComplete="on"
        className="space-y-8"
      >
        <PersonTypeToggle value={personType} onChange={setPersonType} />
        {personType === "PF" ? (
          <BillingFormPF value={billingPF} onChange={setBillingPF} />
        ) : (
          <BillingFormPJ value={billingPJ} onChange={setBillingPJ} />
        )}

        <LegalConsentCheckboxes
          acceptedTerms={acceptedTerms}
          acceptedPrivacy={acceptedPrivacy}
          onChange={({ acceptedTerms: t, acceptedPrivacy: p }) => {
            setAcceptedTerms(t);
            setAcceptedPrivacy(p);
          }}
        />

        <OrderSummary
          basePriceEur={basePriceEur}
          eurRonQuote={eurRonQuote}
          discountCodeInput={discountCodeInput}
          onDiscountCodeInputChange={setDiscountCodeInput}
          appliedDiscount={appliedDiscount}
          onApplyDiscount={handleApplyDiscount}
          onRemoveDiscount={handleRemoveDiscount}
          discountLoading={discountLoading}
          discountError={discountError}
        />

        {status === "error" && submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : !canPay && acceptedTerms && acceptedPrivacy && validationError ? (
          <p className="text-sm text-amber-300">{validationError}</p>
        ) : null}

        <button
          type="submit"
          onMouseDown={syncFromDom}
          disabled={
            !orderId || !acceptedTerms || !acceptedPrivacy || status === "loading"
          }
          className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {status === "loading" ? "Se deschide plata..." : "Plătește acum"}
        </button>
      </form>
    </PracticalCourseShell>
  );
}
