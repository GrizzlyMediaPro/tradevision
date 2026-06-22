import Image from "next/image";
import Link from "next/link";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { FaTelegramPlane, FaInstagram, FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      {/* Top row: logo, menu, social icons */}
      <div className="w-full max-w-[1250px] mx-auto px-4 py-8 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center">
          <Image
            src="/logo1.png"
            alt="Trade Vision logo"
            width={200}
            height={60}
            className="h-10 w-auto md:h-12"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold uppercase text-zinc-200">
          <Link href="/" className="hover:text-white transition">
            Acasă
          </Link>
          <Link href="/firme" className="hover:text-white transition">
            Firme
          </Link>
          <Link href="/curs" className="hover:text-white transition">
            Curs
          </Link>
          <Link href={PRACTICAL_COURSE.path} className="hover:text-white transition">
            Curs Futures
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
          <a
            href="https://www.instagram.com/tradevisionro/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram — Trade Vision"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md shadow-pink-500/30 hover:opacity-90 transition"
          >
            <FaInstagram className="h-4 w-4" />
          </a>
          <a
            href="https://t.me/tradevisionromania"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/40 hover:bg-sky-600 transition"
          >
            <FaTelegramPlane className="h-4 w-4" />
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] md:text-xs text-white/70">
          <Link href="/termeni-conditii" className="hover:text-white transition">
            Termeni și Condiții
          </Link>
          <Link href="/politica-cookies" className="hover:text-white transition">
            Politică de Cookies
          </Link>
          <Link
            href="/politica-confidentialitate"
            className="hover:text-white transition"
          >
            Politică de Confidențialitate
          </Link>
        </div>
      </div>

      {/* Bottom strip: copyright + made by */}
      <div className="w-full bg-black/60 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-[1250px] mx-auto px-4 py-3 flex flex-col items-center gap-2">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] md:text-xs text-white/55"
            aria-label="Legal"
          >
            <Link
              href="/termeni-conditii"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              Termeni și condiții
            </Link>
            <Link
              href="/politica-cookies"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              Politica de cookies
            </Link>
            <Link
              href="/politica-confidentialitate"
              className="hover:text-white/90 transition underline-offset-2 hover:underline"
            >
              Confidențialitate
            </Link>
          </nav>
          <div className="text-center text-[11px] md:text-xs text-white/70 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3">
            <span>© 2026 TradeVision. All Rights Reserved.</span>
            <span className="hidden md:inline-block">|</span>
            <div className="inline-flex items-center gap-1.5">
              <span>Făcut cu</span>
              <FaHeart className="h-3 w-3 text-red-500" aria-hidden="true" />
              <span>de</span>
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

