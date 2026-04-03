const DELAYS_MS = [0, 50, 150, 400];

function getFbq():
  | ((cmd: string, event: string, params?: Record<string, unknown>) => void)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as Window & { fbq?: unknown }).fbq;
  return typeof fbq === "function"
    ? (fbq as (cmd: string, event: string, params?: Record<string, unknown>) => void)
    : undefined;
}

/** Trimite un eveniment standard Meta Pixel; reîncearcă dacă `fbq` nu e încă injectat. */
export function trackMetaPixelEvent(eventName: string): void {
  if (typeof window === "undefined") return;

  let i = 0;
  const schedule = () => {
    const fbq = getFbq();
    if (fbq) {
      fbq("track", eventName);
      return;
    }
    if (i >= DELAYS_MS.length) return;
    const delay = DELAYS_MS[i]!;
    i += 1;
    window.setTimeout(schedule, delay);
  };
  schedule();
}
