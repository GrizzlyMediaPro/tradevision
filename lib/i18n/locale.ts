export const LOCALES = ["en", "ro"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "tv_locale";

export function parseLocale(value: string | undefined | null): Locale {
  return value === "ro" ? "ro" : DEFAULT_LOCALE;
}
