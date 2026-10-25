import { getImageProps } from "next/image";
import Link from "next/link";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { getT } from "@/lib/i18n/get-t";

const included = ["live", "group", "deepchart"] as const;

const { props: desktopHero } = getImageProps({
  src: "/webinarhero.png",
  alt: "",
  width: 1774,
  height: 887,
  sizes: "100vw",
});

const { props: mobileHero } = getImageProps({
  src: "/webinarhero-mobile.webp",
  alt: "",
  width: 960,
  height: 1575,
  sizes: "100vw",
  priority: true,
});

export async function CursFuturesIntro() {
  const t = await getT();
  const heroTitleParts = t("futures.subtitle").split(/(futures)/i);
  const stats = [
    { value: "8", label: t("course.intro.stat.sessions") },
    { value: "Live", label: t("course.intro.stat.live") },
    { value: t("course.intro.stat.group"), label: t("course.intro.stat.dedicated") },
  ];

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-2.875rem)] w-full overflow-hidden sm:min-h-screen">
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopHero.srcSet} sizes={desktopHero.sizes} />
          <img
            {...mobileHero}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[40%_top] sm:object-center"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.8)_80%,rgba(0,0,0,1)_100%)] backdrop-blur-[3px] sm:backdrop-blur-[6px] sm:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.86)_20%,rgba(0,0,0,1)_100%)]" />

        <div className="relative z-10 flex min-h-[calc(100svh-2.875rem)] items-center sm:min-h-screen justify-center pt-24 pb-14 md:pt-28 md:pb-16">
          <div className="flex w-full max-w-[1100px] flex-col items-center px-4 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-yellow-300 sm:text-xs">
              {t("course.intro.badge")}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {heroTitleParts.map((part, index) =>
                part.toLowerCase() === "futures" ? (
                  <span
                    key={index}
                    className="bg-linear-to-r from-purple-300 via-purple-200 to-yellow-300 bg-clip-text text-transparent"
                  >
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </h1>
            <Link
              href={PRACTICAL_COURSE.checkoutPath}
              className="mt-8 inline-flex w-full max-w-[340px] items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 sm:px-8 sm:py-3.5 md:w-auto md:max-w-none md:px-10 md:py-4 md:text-base"
            >
              {t("course.intro.cta")}
            </Link>

            <div className="mt-10 grid w-full max-w-[460px] grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-3 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                >
                  <p className="text-center text-2xl font-bold leading-none text-white md:text-3xl">{stat.value}</p>
                  <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-1 left-1/2 z-20 -translate-x-1/2 animate-bounce text-white/70">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
              {t("webinar.hero.scroll")}
            </span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_10px_rgba(250,204,21,0.25)]">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.9)_15%,rgba(0,0,0,0.7)_35%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.06)_90%,transparent_100%)] sm:h-96" />
        <div className="relative mx-auto w-full max-w-[1250px] px-4 pt-16 pb-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
              {t("course.included.title")}
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
            <p className="mx-auto mt-5 max-w-lg text-sm text-white/55 md:text-base">
              {t("course.included.subtitle")}
            </p>
          </div>

          <ol className="mt-10 grid list-none overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 p-0 shadow-[0_8px_18px_rgba(0,0,0,0.45)] md:grid-cols-3">
            {included.map((id, index) => (
              <li
                key={id}
                className="border-white/10 px-6 py-8 text-left not-first:border-t md:px-8 md:py-10 md:not-first:border-t-0 md:not-first:border-l"
              >
                <span className="text-sm font-bold tabular-nums text-purple-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-white md:text-lg">
                  {t(`course.included.${id}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {t(`course.included.${id}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
