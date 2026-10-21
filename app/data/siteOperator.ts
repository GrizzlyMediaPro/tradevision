import { messages } from "@/lib/i18n/messages/catalog";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { translate } from "@/lib/i18n/translate";

export const SITE_OPERATOR = {
  legalName: "TRADE VISION HUB TRADING SRL",
  brandName: "Trade Vision România",
  shortBrandName: "Trade Vision",
  cui: "54265198",
  email: "tradevisionro@gmail.com",
} as const;

/** Identitate juridică — aliniată cu termenii și condițiile site-ului. */
export function formatOperatorIdentity(locale: Locale = DEFAULT_LOCALE): string {
  return translate(messages[locale], "operator.identity", {
    legalName: SITE_OPERATOR.legalName,
    cui: SITE_OPERATOR.cui,
    email: SITE_OPERATOR.email,
    brand: SITE_OPERATOR.brandName,
  });
}

export function formatOperatorLegalLine(): string {
  return `${SITE_OPERATOR.legalName}, CUI ${SITE_OPERATOR.cui}`;
}

export function formatOperatorContactBlock(locale: Locale = DEFAULT_LOCALE): string {
  return translate(messages[locale], "operator.contactBlock", {
    email: SITE_OPERATOR.email,
    legalName: SITE_OPERATOR.legalName,
    cui: SITE_OPERATOR.cui,
  });
}
