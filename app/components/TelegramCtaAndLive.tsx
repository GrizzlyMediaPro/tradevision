"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";

export function TelegramCtaAndLive() {
  const t = useT();
  return (
    <div className="flex flex-col gap-10">
      {/* Telegram CTA card (copied from Firms) */}
      <div className="w-full rounded-3xl border border-yellow-300/40 bg-linear-to-r from-yellow-400/15 via-yellow-300/8 to-transparent px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
        <div className="md:w-2/3 flex flex-col items-start text-left gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300/90">
            {t("telegram.eyebrow")}
          </p>
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            {t("telegram.title")}
          </h3>
          <p className="text-sm md:text-base text-white/75 max-w-xl">
            {t("telegram.body")}
          </p>
          {/* Desktop button (alături de text) */}
          <a
            href="https://t.me/tradevisionromania"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 hidden md:inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-5 py-2.5 text-xs md:text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.45)] hover:brightness-110 transition cursor-pointer"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M9.036 15.804 8.91 19.09c.299 0 .429-.128.584-.282l1.398-1.355 2.9 2.129c.532.294.908.14 1.052-.492l1.905-8.94c.195-.884-.319-1.23-.864-1.012L4.74 12.02c-.857.333-.844.813-.146 1.03l3.237 1.01 7.51-4.727c.354-.216.678-.1.412.138" />
              </svg>
            </span>
            <span>{t("telegram.cta")}</span>
          </a>
        </div>
        <div className="md:w-1/3 flex items-center justify-center">
          <div className="h-24 w-40 md:h-28 md:w-48 rounded-2xl bg-black/40 border border-yellow-300/40 flex items-center justify-center px-4">
            <Image
              src="/logo1.png"
              alt={t("telegram.logoAlt")}
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
        {/* Mobile button sub logo */}
        <div className="w-full md:hidden mt-4 flex justify-center">
          <a
            href="https://t.me/tradevisionromania"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-2.5 text-xs font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.45)] hover:brightness-110 transition cursor-pointer"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M9.036 15.804 8.91 19.09c.299 0 .429-.128.584-.282l1.398-1.355 2.9 2.129c.532.294.908.14 1.052-.492l1.905-8.94c.195-.884-.319-1.23-.864-1.012L4.74 12.02c-.857.333-.844.813-.146 1.03l3.237 1.01 7.51-4.727c.354-.216.678-.1.412.138" />
              </svg>
            </span>
            <span>{t("telegram.cta")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

