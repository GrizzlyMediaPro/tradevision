const FBQ_POLL_MS = 80;
/** GTM + next/script pot întârzia `fbq` cu mult peste primul frame; PageView poate apărea după ce renunțam la retry-uri scurte. */
const FBQ_MAX_WAIT_MS = 20_000;

type FbqFn = (...args: unknown[]) => void;

function getFbq(): FbqFn | undefined {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as Window & { fbq?: unknown }).fbq;
  return typeof fbq === "function" ? (fbq as FbqFn) : undefined;
}

function runWhenFbqReady(run: (fbq: FbqFn) => void): void {
  if (typeof window === "undefined") return;
  const start = Date.now();
  const tick = () => {
    const fbq = getFbq();
    if (fbq) {
      run(fbq);
      return;
    }
    if (Date.now() - start >= FBQ_MAX_WAIT_MS) return;
    window.setTimeout(tick, FBQ_POLL_MS);
  };
  tick();
}

/** Trimite un eveniment standard Meta Pixel; așteaptă până la `fbq` e disponibil (script / GTM). */
export function trackMetaPixelEvent(eventName: string): void {
  runWhenFbqReady((fbq) => {
    fbq("track", eventName);
  });
}

/** Eveniment custom Meta Pixel (`fbq('trackCustom', ...)`). */
export function trackMetaPixelCustomEvent(customEventName: string): void {
  runWhenFbqReady((fbq) => {
    fbq("trackCustom", customEventName);
  });
}
