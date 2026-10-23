import { messages } from "@/lib/i18n/messages/catalog";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { translate } from "@/lib/i18n/translate";

export const SITE_OPERATOR = {
  legalName: "TRADE VISION HUB TRADING S.R.L.",
  brandName: "Trade Vision România",
  shortBrandName: "Trade Vision",
  cui: "54265198",
  tradeRegister: "J2026017529008",
  email: "tradevisionro@gmail.com",
} as const;

export function operatorMessageVars() {
  return {
    legalName: SITE_OPERATOR.legalName,
    cui: SITE_OPERATOR.cui,
    register: SITE_OPERATOR.tradeRegister,
    email: SITE_OPERATOR.email,
    brand: SITE_OPERATOR.brandName,
  };
}

/** Identitate juridică — aliniată cu termenii și condițiile site-ului. */
export function formatOperatorIdentity(locale: Locale = DEFAULT_LOCALE): string {
  return translate(messages[locale], "operator.identity", operatorMessageVars());
}

export function formatOperatorLegalLine(): string {
  return `${SITE_OPERATOR.legalName}, CUI ${SITE_OPERATOR.cui}, ${SITE_OPERATOR.tradeRegister}`;
}

export function formatOperatorContactBlock(locale: Locale = DEFAULT_LOCALE): string {
  return translate(messages[locale], "operator.contactBlock", operatorMessageVars());
}
