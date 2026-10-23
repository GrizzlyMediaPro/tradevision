"use client";

import Image from "next/image";
import Link from "next/link";
import { NinjaTraderDisclosures } from "@/app/components/NinjaTraderDisclosures";
import { SITE_OPERATOR } from "@/app/data/siteOperator";
import { FaTelegramPlane, FaInstagram, FaHeart } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-white/10">
      {/* Top row: logo, menu, social icons */}
      <div className="w-full max-w-[1250px] mx-auto px-4 py-8 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center">
          <Image
            src="/logo1.png"
            alt={t("footer.logoAlt")}
            width={200}
            height={60}
            className="h-10 w-auto md:h-12"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold uppercase text-zinc-200">
          <Link href="/" className="hover:text-white transition">
            {t("nav.home")}
          </Link>
          <Link href="/firme" className="hover:text-white transition">
            {t("nav.firms")}
          </Link>
          <Link href="/curs" className="hover:text-white transition">
            {t("nav.course")}
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            {t("nav.contact")}
          </Link>
          <a
            href="https://www.instagram.com/tradevisionro/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("footer.instagram")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md shadow-pink-500/30 hover:opacity-90 transition"
          >
            <FaInstagram className="h-4 w-4" />
          </a>
          <a
            href="https://t.me/tradevisionromania"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("footer.telegram")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/40 hover:bg-sky-600 transition"
          >
            <FaTelegramPlane className="h-4 w-4" />
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] md:text-xs text-white/70">
          <Link href="/termeni-conditii" className="hover:text-white transition">
            {t("footer.terms")}
          </Link>
          <Link href="/politica-cookies" className="hover:text-white transition">
            {t("footer.cookies")}
          </Link>
          <Link
            href="/declaratie-risc"
            className="hover:text-white transition"
          >
            {t("footer.risk")}
          </Link>
          <Link
            href="/politica-confidentialitate"
            className="hover:text-white transition"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>

      <NinjaTraderDisclosures />

      {/* Bottom strip: copyright + made by */}
      <div className="w-full bg-black/60 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-[1250px] mx-auto px-4 py-3 flex flex-col items-center gap-2">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] md:text-xs text-white/55"
            aria-label={t("footer.legalNav")}
          >
            <Link
              href="/termeni-conditii"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              {t("footer.termsShort")}
            </Link>
            <Link
              href="/politica-cookies"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              {t("footer.cookiesShort")}
            </Link>
            <Link
              href="/declaratie-risc"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              {t("footer.risk")}
            </Link>
            <Link
              href="/politica-confidentialitate"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              {t("footer.privacyShort")}
            </Link>
          </nav>
          <p className="text-center text-[11px] text-white/45">
            {SITE_OPERATOR.legalName} · CUI {SITE_OPERATOR.cui} · {SITE_OPERATOR.tradeRegister}
          </p>
          <div className="text-center text-[11px] md:text-xs text-white/70 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3">
            <span>{t("footer.copyright")}</span>
            <span className="hidden md:inline-block">|</span>
            <div className="inline-flex items-center gap-1.5">
              <span>{t("footer.madeWith")}</span>
              <FaHeart className="h-3 w-3 text-red-500" aria-hidden="true" />
              <span>{t("footer.madeBy")}</span>
              <a
                href="https://www.grizzlymediapro.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-yellow-300 hover:text-yellow-200 transition underline-offset-2 hover:underline"
              >
                GrizzlyMediaPro
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

