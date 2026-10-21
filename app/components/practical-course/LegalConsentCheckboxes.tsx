"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

type LegalConsentCheckboxesProps = {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  onChange: (values: {
    acceptedTerms: boolean;
    acceptedPrivacy: boolean;
  }) => void;
};

export function LegalConsentCheckboxes({
  acceptedTerms,
  acceptedPrivacy,
  onChange,
}: LegalConsentCheckboxesProps) {
  const t = useT();
  return (
    <div className="space-y-3">
      <ConsentRow
        checked={acceptedPrivacy}
        onChange={(checked) =>
          onChange({ acceptedTerms, acceptedPrivacy: checked })
        }
        required
      >
        {t("course.consent.privacy.before")}
        <Link
          href="/politica-confidentialitate"
          target="_blank"
          className="underline decoration-white/40 underline-offset-2 hover:text-yellow-300"
        >
          {t("course.consent.privacy.link")}
        </Link>
        {t("course.consent.privacy.after")}
      </ConsentRow>
      <ConsentRow
        checked={acceptedTerms}
        onChange={(checked) =>
          onChange({ acceptedTerms: checked, acceptedPrivacy })
        }
        required
      >
        {t("course.consent.terms.before")}
        <Link
          href="/termeni-conditii"
          target="_blank"
          className="underline decoration-white/40 underline-offset-2 hover:text-yellow-300"
        >
          {t("course.consent.terms.link")}
        </Link>
        {t("course.consent.terms.after")}
      </ConsentRow>
    </div>
  );
}

function ConsentRow({
  checked,
  onChange,
  children,
  required,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 transition hover:border-white/20">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/5 transition peer-checked:border-yellow-300 peer-checked:bg-yellow-400/20">
        {checked ? (
          <svg
            className="h-3 w-3 text-yellow-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
      </span>
      <span className="text-xs leading-relaxed text-white/70 sm:text-sm">
        {children}
        {required ? <span className="text-yellow-300"> *</span> : null}
      </span>
    </label>
  );
}
