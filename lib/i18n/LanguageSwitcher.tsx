"use client";

import { useI18n } from "./I18nProvider";
import type { Locale } from "./locale";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "ro", label: "RO" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("lang.switcher")}
      className={`inline-flex items-center rounded-full border border-white/20 bg-black/40 p-0.5 ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <button
            key={option.locale}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(option.locale)}
            className={`min-w-10 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition cursor-pointer md:min-w-11 md:px-3.5 md:text-sm ${
              active
                ? "bg-yellow-400 text-slate-900"
                : "text-white/70 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
