export const LOCALES = ["en", "ro"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";

export const LOCALE_COOKIE = "tv_locale";

export function parseLocale(value: string | undefined | null): Locale {
  if (value === "en" || value === "ro") return value;
  return DEFAULT_LOCALE;
}
