"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { clerkUserButtonAppearance } from "@/lib/clerkAppearance";
import { useT } from "@/lib/i18n/I18nProvider";
import { LanguageSwitcher } from "@/lib/i18n/LanguageSwitcher";
import {
  FaTelegramPlane,
  FaInstagram,
  FaBars,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();
  const overlaysHero = pathname === "/curs-futures";

  return (
    <>
      {/* Announcement bar — sticky la scroll */}
      <Link
        href="/payout"
        className="sticky top-0 z-[60] block w-full bg-purple-600 hover:bg-purple-500 transition"
      >
        <div className="w-full max-w-[1250px] mx-auto flex items-center justify-center gap-2 px-4 py-2 text-[11px] sm:text-xs font-medium text-white">
          <span className="text-center leading-snug sm:whitespace-nowrap">
            {t("nav.announcement")}
          </span>
          <FaArrowRight className="h-3 w-3 shrink-0" />
        </div>
      </Link>

    <nav
      className={`${
        overlaysHero ? "absolute inset-x-0" : "relative"
      } w-full border-b border-transparent bg-transparent z-40`}
    >
      <div className="mx-auto flex w-full max-w-[1250px] items-center justify-between gap-2 px-3 py-3 md:gap-7 md:px-4 md:py-4">
        {/* Stânga - Logo */}
        <Link href="/" className="flex min-w-0 items-center">
          <Image
            src="/logo1.png"
            alt="Tradevision logo"
            width={220}
            height={68}
            className="h-[clamp(2.25rem,calc((100vw-9.5rem)*0.185),2.75rem)] w-auto md:h-[3.4rem]"
            priority
          />
        </Link>

        {/* Mijloc - Linkuri */}
        <div className="hidden flex-1 justify-center gap-8 text-sm md:text-base font-semibold uppercase md:flex">
          <Link
            href="/"
            className={`whitespace-nowrap hover:text-white transition ${
              pathname === "/" ? "text-yellow-300" : "text-zinc-200"
            }`}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/firme"
            className={`whitespace-nowrap hover:text-white transition ${
              pathname === "/firme" ? "text-yellow-300" : "text-zinc-200"
            }`}
          >
            {t("nav.firms")}
          </Link>
          <Link
            href="/payout"
            className={`whitespace-nowrap hover:text-white transition ${
              pathname.startsWith("/payout") ? "text-yellow-300" : "text-zinc-200"
            }`}
          >
            {t("nav.payout")}
          </Link>
          <Link
            href="/contact"
            className={`whitespace-nowrap hover:text-white transition ${
              pathname === "/contact" ? "text-yellow-300" : "text-zinc-200"
            }`}
          >
            {t("nav.contact")}
          </Link>
        </div>

        {/* Dreapta - Mobile Telegram + hamburger, Desktop CTA */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/* Mobile only */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Instagram icon */}
            <a
              href="https://www.instagram.com/tradevisionro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md shadow-pink-500/30 hover:opacity-90 transition cursor-pointer"
              aria-label={t("nav.instagram")}
            >
              <FaInstagram className="h-3.5 w-3.5" />
            </a>
            {/* Telegram icon */}
            <a
              href="https://t.me/tradevisionromania"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/40 hover:bg-sky-600 transition cursor-pointer"
              aria-label={t("nav.telegram")}
            >
              <FaTelegramPlane className="h-3.5 w-3.5" />
            </a>
            {/* Hamburger */}
            <button
              className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white hover:bg-white/10 transition cursor-pointer overflow-hidden"
              aria-label={t("nav.openMenu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                  menuOpen
                    ? "opacity-0 -rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              >
                <FaBars className="h-4 w-4" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                  menuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-75"
                }`}
              >
                <FaTimes className="h-4 w-4" />
              </span>
            </button>
          </div>

          {/* Desktop: Instagram + Telegram */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://www.instagram.com/tradevisionro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md shadow-pink-500/30 hover:opacity-90 transition cursor-pointer"
              aria-label={t("nav.instagram")}
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://t.me/tradevisionromania"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-sky-500 px-5 py-2.5 text-sm md:text-base font-semibold text-white shadow-md shadow-sky-500/40 transition hover:bg-sky-600 cursor-pointer"
            >
              <FaTelegramPlane className="h-5 w-5 md:h-5 md:w-5" />
              <span className="uppercase">{t("nav.joinCommunity")}</span>
            </a>
            {/* Avatar Clerk (doar autentificat) */}
            <SignedIn>
              <div className="navbar-user-button inline-flex size-9 shrink-0 items-center justify-center md:size-11">
                <UserButton appearance={clerkUserButtonAppearance} />
              </div>
            </SignedIn>
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher className="shrink-0" />
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu (positioned below entire nav) */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full border-t border-white/10 bg-black/80 backdrop-blur-md transform origin-top transition-all duration-200 z-50 ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-[1250px] flex-col gap-2 px-4 py-4 text-sm font-semibold uppercase text-zinc-200">
          <Link
            href="/"
            className="py-2 border-b border-white/5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/firme"
            className="py-2 border-b border-white/5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.firms")}
          </Link>
          <Link
            href="/payout"
            className="py-2 border-b border-white/5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.payout")}
          </Link>
          <Link
            href="/contact"
            className="py-2 border-b border-white/5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.contact")}
          </Link>
          <SignedIn>
            <div className="flex items-center justify-between border-b border-white/5 py-2">
              <span className="text-xs tracking-wide text-zinc-400">
                {t("nav.account")}
              </span>
              <div className="navbar-user-button inline-flex size-9 shrink-0 items-center justify-center">
                <UserButton appearance={clerkUserButtonAppearance} />
              </div>
            </div>
          </SignedIn>
          <div className="flex items-center justify-between py-2">
            <span>{t("lang.switcher")}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

