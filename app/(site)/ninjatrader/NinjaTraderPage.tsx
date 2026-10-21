// Rută oprită: redenumește acest fișier în page.tsx ca să reapară /ninjatrader.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  NINJATRADER_ASSETS,
  NINJATRADER_LANDING,
  NINJATRADER_MEDIA_KIT_URL,
} from "@/app/data/ninjaTrader";
import { getT } from "@/lib/i18n/get-t";

const PLATFORM_BENEFITS = [
  "nt.platform.benefit.futures",
  "nt.platform.benefit.charting",
  "nt.platform.benefit.simulator",
  "nt.platform.benefit.strategy",
] as const;

const PLATFORM_LINK_IDS = {
  platform: "nt.platform.link.platform",
  download: "nt.platform.link.download",
  simulator: "nt.platform.link.simulator",
} as const;

const KINETICK_LINK_IDS = {
  data: "nt.kinetick.link.data",
  historical: "nt.kinetick.link.historical",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("nt.meta.title"),
    description: t("nt.meta.description"),
  };
}

function LandingLinks({
  links,
}: {
  links: readonly { label: string; href: string }[];
}) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
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

export default async function NinjaTraderPage() {
  const t = await getT();
  const { platform, kinetick } = NINJATRADER_LANDING;
  const platformLinks = platform.links.map((link) => ({
    label: t(PLATFORM_LINK_IDS[link.id]),
    href: link.href,
  }));
  const kinetickLinks = kinetick.links.map((link) => ({
    label: t(KINETICK_LINK_IDS[link.id]),
    href: link.href,
  }));

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
                  alt={t("nt.wordmarkAlt")}
                  width={2376}
                  height={300}
                  className="h-8 md:h-10 w-auto max-w-[240px] md:max-w-[280px] object-contain object-left"
                  priority
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                    {t("nt.platform.eyebrow")}
                  </h1>
                  <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full" />
                </div>
              </header>

              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {t("nt.platform.intro")}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PLATFORM_BENEFITS.map((id) => (
                  <li
                    key={id}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                    {t(id)}
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  {t("nt.platform.body1")}
                </p>
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  {t("nt.platform.body2")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
                <LandingLinks links={platformLinks} />
                <a
                  href={platform.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black hover:bg-yellow-300 transition"
                >
                  {t("nt.platform.cta")}
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <Image
                src={NINJATRADER_ASSETS.monitor}
                alt={t("nt.platform.imageAlt")}
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
                  alt={t("nt.kinetick.alt")}
                  width={800}
                  height={280}
                  className="h-14 md:h-16 w-auto max-w-[220px] md:max-w-[260px] object-contain object-left"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
                    {t("nt.kinetick.eyebrow")}
                  </h2>
                  <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-sky-400 via-sky-300 to-sky-500 rounded-full" />
                </div>
              </header>

              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {t("nt.kinetick.intro")}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
                <LandingLinks links={kinetickLinks} />
                <a
                  href={kinetick.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500/15 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-sky-200 hover:bg-sky-500/25 transition"
                >
                  {t("nt.kinetick.cta")}
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Image
                src={NINJATRADER_ASSETS.kinetickBadge}
                alt={t("nt.kinetick.badgeAlt")}
                width={200}
                height={200}
                className="h-24 md:h-28 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </section>

        <p className="text-center text-[11px] md:text-xs text-white/40 leading-relaxed">
          {t("nt.footer.before")}
          <a
            href={NINJATRADER_MEDIA_KIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 underline underline-offset-2 hover:text-white/75 transition"
          >
            {t("nt.footer.guidelines")}
          </a>
          {t("nt.footer.middle")}
          <Link href="/" className="text-purple-300 hover:text-purple-200 transition">
            {t("nt.footer.home")}
          </Link>
          {t("nt.footer.after")}
        </p>
      </div>
    </main>
  );
}
