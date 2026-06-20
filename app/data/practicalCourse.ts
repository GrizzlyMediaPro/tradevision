import { SITE_OPERATOR } from "@/app/data/siteOperator";

export { SITE_OPERATOR, formatOperatorContactBlock, formatOperatorIdentity, formatOperatorLegalLine } from "@/app/data/siteOperator";

/** Date prestator folosite în documentele cursului practic. */
export const PRACTICAL_COURSE_OPERATOR = SITE_OPERATOR;

export const PRACTICAL_COURSE = {
  slug: "curs-practic",
  title: "Curs Practic Trade Vision",
  subtitle: "Program intensiv de training practic pentru piețele financiare",
  description:
    "Program complet de training practic cu acces la materiale de studiu, sesiuni live și comunitate dedicată.",
  priceDisplay: "599 EUR",
  priceAmount: 599,
  priceCurrency: "EUR",
  duration: "8 săptămâni",
  format: "Online live + materiale video",
  stripePriceId: process.env.PRACTICAL_COURSE_STRIPE_PRICE_ID ?? "",
} as const;

export function getPracticalCourseStripePriceId(): string {
  return process.env.PRACTICAL_COURSE_STRIPE_PRICE_ID?.trim() ?? "";
}
