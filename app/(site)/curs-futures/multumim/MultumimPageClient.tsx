"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { useT } from "@/lib/i18n/I18nProvider";
import { PracticalCourseShell } from "@/app/components/practical-course/PracticalCourseShell";

type ConfirmPaymentResponse = {
  status?: string;
  fulfillmentSent?: boolean;
  invoiceIssued?: boolean;
  email?: string | null;
  smartbillError?: string;
  error?: string;
};

type MultumimPageClientProps = {
  stripeSessionId: string | null;
};

export function MultumimPageClient({ stripeSessionId }: MultumimPageClientProps) {
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [invoiceIssued, setInvoiceIssued] = useState(false);
  const [smartbillError, setSmartbillError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const confirmRes = await fetch(`${PRACTICAL_COURSE.apiPath}/order/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            stripeSessionId ? { sessionId: stripeSessionId } : {},
          ),
        });
        const confirmData = (await confirmRes.json().catch(() => ({}))) as ConfirmPaymentResponse;

        if (!cancelled) {
          if (!confirmRes.ok) {
            setConfirmError(
              confirmData.error || t("course.thanks.confirmDelayed"),
            );
          } else if (confirmData.fulfillmentSent && confirmData.email) {
            setEmailSentTo(confirmData.email);
            setInvoiceIssued(Boolean(confirmData.invoiceIssued));
            if (confirmData.smartbillError) {
              setSmartbillError(confirmData.smartbillError);
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [stripeSessionId, t]);

  return (
    <PracticalCourseShell
      title={t("course.thanks.title")}
      subtitle={t("course.thanks.subtitle")}
    >
      <div className="flex flex-col items-center gap-5 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
          <FaCheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-white/70">
          {t("course.thanks.body", { title: t("futures.title") })}
          {loading ? t("course.thanks.confirming") : t("course.thanks.soon")}
        </p>
        {emailSentTo ? (
          <p className="max-w-lg text-sm text-emerald-300">
            {invoiceIssued
              ? t("course.thanks.sentInvoice", { email: emailSentTo })
              : t("course.thanks.sentEmail", { email: emailSentTo })}
          </p>
        ) : null}
        {smartbillError ? (
          <p className="max-w-lg text-sm text-amber-300">
            {t("course.thanks.invoiceError", { error: smartbillError })} 
          </p>
        ) : null}
        {confirmError ? (
          <p className="max-w-lg text-sm text-amber-300">{confirmError}</p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            {t("course.thanks.home")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-900 transition hover:brightness-110"
          >
            {t("course.thanks.contact")}
          </Link>
        </div>
      </div>
    </PracticalCourseShell>
  );
}
