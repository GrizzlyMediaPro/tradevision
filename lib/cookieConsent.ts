/** Preferință cookie / stocare browser, salvată după alegerea utilizatorului. */
export const COOKIE_CONSENT_STORAGE_KEY = "tradevision-cookie-consent-v1";

/** Progres curs gratuit — stocat doar dacă utilizatorul a ales „necesare” sau „acceptă tot”. */
export const FREE_COURSE_STORAGE_KEY = "tradevision-free-course-v1";

export type StoredConsent = "none" | "essential" | "all";

export function readConsentFromStorage(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (v === "all" || v === "essential" || v === "none") return v;
  } catch {
    /* private mode / quota */
  }
  return null;
}

/** GTM, Meta Pixel și evenimente de tracking. */
export function allowsAnalytics(consent: StoredConsent | null): boolean {
  return consent === "all";
}

/** localStorage pentru progres curs și alte funcții non-esențiale pe dispozitiv. */
export function allowsFunctionalLocalStorage(
  consent: StoredConsent | null
): boolean {
  return consent === "essential" || consent === "all";
}

/** Elimină datele funcționale din browser (ex. progres curs). */
export function clearFunctionalLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FREE_COURSE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
