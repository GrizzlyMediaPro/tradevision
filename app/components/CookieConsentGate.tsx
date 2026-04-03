"use client";

import Script from "next/script";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaCookie } from "react-icons/fa";

export const COOKIE_CONSENT_STORAGE_KEY = "tradevision-cookie-consent-v1";

type ConsentMode = "pending" | "all" | "essential";

function readStoredConsent(): ConsentMode {
  if (typeof window === "undefined") return "pending";
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (v === "all") return "all";
    if (v === "essential") return "essential";
  } catch {
    /* private mode / quota */
  }
  return "pending";
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-T3LZD5RX";
const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1222795692957799";

export function CookieConsentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<ConsentMode>("pending");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || consent !== "pending") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ready, consent]);

  const acceptAll = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "all");
    } catch {
      /* ignore */
    }
    setConsent("all");
  }, []);

  const essentialOnly = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "essential");
    } catch {
      /* ignore */
    }
    setConsent("essential");
  }, []);

  return (
    <>
      {consent === "all" && GTM_ID ? (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gt.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height={0}
              width={0}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}
      {consent === "all" && META_PIXEL_ID ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
          </Script>
          <noscript>
            <img
              height={1}
              width={1}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
              style={{ display: "none" }}
            />
          </noscript>
        </>
      ) : null}

      {children}

      {ready && consent === "pending" ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 pb-6 sm:items-center sm:p-6 bg-black/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-linear-to-b from-[#12152a]/98 to-[#0a0c16]/98 px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.75)] sm:px-7 sm:py-8">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 border border-amber-300/25">
                <FaCookie className="h-6 w-6 text-amber-200" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="cookie-consent-title"
                  className="text-base font-semibold text-white sm:text-lg"
                >
                  Cookie-uri și confidențialitate
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="mt-2 text-sm text-white/65 leading-relaxed"
                >
                  Folosim cookie-uri esențiale pentru funcționarea site-ului și,
                  dacă ești de acord, cookie-uri pentru analiză și marketing
                  (Google Tag Manager, Meta Pixel). Poți alege doar cele
                  esențiale sau poți accepta toate. Detalii în{" "}
                  <Link
                    href="/politica-cookies"
                    className="text-purple-400 underline-offset-2 hover:underline"
                  >
                    Politica de cookies
                  </Link>{" "}
                  și{" "}
                  <Link
                    href="/politica-confidentialitate"
                    className="text-purple-400 underline-offset-2 hover:underline"
                  >
                    Politica de confidențialitate
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={essentialOnly}
                className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 cursor-pointer"
              >
                Doar esențiale
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="w-full sm:w-auto rounded-xl bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_28px_rgba(250,204,21,0.35)] transition hover:brightness-110 cursor-pointer"
              >
                Acceptă toate
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
