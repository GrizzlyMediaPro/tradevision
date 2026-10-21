import type { Locale } from "../locale";
import { admin } from "./bundles/admin";
import { chrome } from "./bundles/chrome";
import { commerce } from "./bundles/commerce";
import { home } from "./bundles/home";
import { markets } from "./bundles/markets";

const bundles = [chrome, home, admin, markets, commerce] as const;

function merge(locale: Locale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const bundle of bundles) {
    Object.assign(out, bundle[locale]);
  }
  return out;
}

export const messages: Record<Locale, Record<string, string>> = {
  en: merge("en"),
  ro: merge("ro"),
};

export type MessageId = string;
