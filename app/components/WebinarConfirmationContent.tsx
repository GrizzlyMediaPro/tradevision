"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { trackMetaPixelCustomEvent } from "@/lib/metaPixel";

/** Link invitație grup WhatsApp după înscriere webinar */
export const WEBINAR_WHATSAPP_INVITE_URL =
  "https://chat.whatsapp.com/CvqMTOoXVnyESciYMtdQra";

/** ID YouTube pentru mesajul video post-înscriere */
export const WEBINAR_CONFIRMATION_YOUTUBE_ID = "ktyLHWVnFUY";

type WebinarConfirmationContentProps = {
  firstName: string;
};

export function WebinarConfirmationContent({
  firstName,
}: WebinarConfirmationContentProps) {
  const greeting = firstName ? `, ${firstName}` : "";

  return (
    <div className="flex flex-col items-center">
      <p className="max-w-2xl text-center text-base font-semibold text-white sm:text-lg md:text-xl">
        Ca să primești reminder-ele și materialele promise{greeting}, intră
        acum în grupul nostru de WhatsApp.
      </p>

      <div className="relative mt-8 w-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(168,85,247,0.14), transparent 40%), radial-gradient(circle at 88% 12%, rgba(251,191,36,0.10), transparent 40%)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <h1 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Felicitări! Ești la un pas de a înțelege cum gândesc traderii
            profitabili.
          </h1>

          <div className="mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />

          <div className="mt-8 w-full">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-2 shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
              <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${WEBINAR_CONFIRMATION_YOUTUBE_ID}?autoplay=1&playsinline=1&rel=0`}
                  title="Felicitări pentru înscriere"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <span className="mt-10 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Ultimul pas
          </span>

          <a
            href={WEBINAR_WHATSAPP_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMetaPixelCustomEvent("whatsapp_click")}
            className="mt-4 inline-flex w-full max-w-md items-center justify-center gap-3 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-4 text-sm font-bold uppercase tracking-wider text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 sm:text-base"
          >
            <FaWhatsapp className="h-5 w-5" />
            Hai în grupul de WhatsApp
          </a>

          <p className="mt-6 max-w-lg text-[11px] font-semibold uppercase tracking-wider text-white/45 sm:text-xs">
            Dacă butonul nu merge, verifică să fii logat(ă) în WhatsApp pe
            acest dispozitiv.
          </p>

          <p className="mt-8 text-center text-xs text-white/50">
            <Link
              href="/webinar"
              className="text-white/70 underline decoration-white/30 underline-offset-2 transition hover:text-yellow-300"
            >
              Înapoi la pagina webinar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
