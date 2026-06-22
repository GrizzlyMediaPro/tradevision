export const SITE_OPERATOR = {
  legalName: "TRADE VISION HUB TRADING SRL",
  brandName: "Trade Vision România",
  shortBrandName: "Trade Vision",
  cui: "54265198",
  email: "tradevisionro@gmail.com",
} as const;

/** Identitate juridică — aliniată cu termenii și condițiile site-ului. */
export function formatOperatorIdentity(): string {
  return `${SITE_OPERATOR.legalName}, CUI ${SITE_OPERATOR.cui}, e-mail: ${SITE_OPERATOR.email}, operând sub marca ${SITE_OPERATOR.brandName}`;
}

export function formatOperatorLegalLine(): string {
  return `${SITE_OPERATOR.legalName}, CUI ${SITE_OPERATOR.cui}`;
}

export function formatOperatorContactBlock(): string {
  return `Email: ${SITE_OPERATOR.email}
Operator: ${SITE_OPERATOR.legalName} · CUI ${SITE_OPERATOR.cui}`;
}
