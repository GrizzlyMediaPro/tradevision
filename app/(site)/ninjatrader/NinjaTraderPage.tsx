// Rută oprită: redenumește acest fișier în page.tsx ca să reapară /ninjatrader.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  NINJATRADER_ASSETS,
  NINJATRADER_LANDING,
  NINJATRADER_MEDIA_KIT_URL,
} from "@/app/data/ninjaTrader";

export const metadata: Metadata = {
  title: "NinjaTrader & Kinetick — Platformă și date de piață",
  description:
    "Platforma noastră recomandată NinjaTrader și feed-ul de date Kinetick. Charting gratuit, simulator, date futures, forex și EOD.",
};

function LandingLinks({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-300 hover:text-sky-200 underline underline-offset-2 transition"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function NinjaTraderPage() {
  const { platform, kinetick } = NINJATRADER_LANDING;

  return (
    <main className="page-gradient min-h-screen">
      <div className="w-full max-w-[1250px] mx-auto px-4 pt-16 md:pt-24 pb-20 space-y-16 md:space-y-20">
        {/* NinjaTrader section */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-6 md:p-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <header className="space-y-4">
                <Image
                  src={NINJATRADER_ASSETS.wordmark}
                  alt="NinjaTrader"
                  width={2376}
                  height={300}
                  className="h-8 md:h-10 w-auto max-w-[240px] md:max-w-[280px] object-contain object-left"
                  priority
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                    {platform.eyebrow}
                  </h1>
                  <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full" />
                </div>
              </header>

              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {platform.intro}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {platform.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                {platform.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm md:text-base text-white/65 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
                <LandingLinks links={platform.links} />
                <a
                  href={platform.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-yellow-300 transition"
                >
                  {platform.cta.label}
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <Image
                src={NINJATRADER_ASSETS.monitor}
                alt="NinjaTrader trading platform"
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Kinetick section */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-6 md:p-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <header className="space-y-4">
                <Image
                  src={NINJATRADER_ASSETS.kinetickLogo}
                  alt="Kinetick"
                  width={800}
                  height={280}
                  className="h-14 md:h-16 w-auto max-w-[220px] md:max-w-[260px] object-contain object-left"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                    {kinetick.eyebrow}
                  </h2>
                  <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-sky-400 via-sky-300 to-sky-500 rounded-full" />
                </div>
              </header>

              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {kinetick.intro}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
                <LandingLinks links={kinetick.links} />
                <a
                  href={kinetick.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500/15 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-sky-200 hover:bg-sky-500/25 transition"
                >
                  {kinetick.cta.label}
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src={NINJATRADER_ASSETS.kinetickBadge}
                alt="Kinetick badge"
                width={200}
                height={200}
                className="h-24 md:h-28 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </section>

        <p className="text-center text-[11px] md:text-xs text-white/40 leading-relaxed">
          Content provided in accordance with{" "}
          <a
            href={NINJATRADER_MEDIA_KIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 underline underline-offset-2 hover:text-white/75 transition"
          >
            NinjaTrader Vendor Guidelines
          </a>
          . Back to{" "}
          <Link href="/" className="text-purple-300 hover:text-purple-200 transition">
            homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
