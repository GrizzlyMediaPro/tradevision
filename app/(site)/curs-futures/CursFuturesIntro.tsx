import Link from "next/link";
import { FaClock, FaUsers, FaVideo } from "react-icons/fa";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { getT } from "@/lib/i18n/get-t";

export async function CursFuturesIntro() {
  const t = await getT();
  const highlights = [
    {
      icon: FaClock,
      title: t("course.intro.highlight1.title", { duration: t("course.duration") }),
      text: t("course.intro.highlight1.text"),
    },
    {
      icon: FaVideo,
      title: t("course.intro.highlight2.title"),
      text: t("course.intro.highlight2.text"),
    },
    {
      icon: FaUsers,
      title: t("course.intro.highlight3.title"),
      text: t("course.intro.highlight3.text"),
    },
  ];
  return (
    <section className="relative w-full overflow-hidden pb-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center px-4 pb-4 pt-12 text-center md:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-yellow-300">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          {t("course.intro.badge", { duration: t("course.duration") })}
        </span>

        <h1 className="mt-5 text-4xl font-bold leading-[1.15] text-white md:text-5xl">
          {t("futures.title")}
        </h1>
        <p className="mt-3 max-w-2xl bg-linear-to-r from-purple-300 via-purple-200 to-yellow-300 bg-clip-text text-lg font-semibold text-transparent md:text-2xl">
          {t("futures.subtitle")}
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
          {t("course.description")}
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-4 py-4 text-left shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
            >
              <item.icon className="h-4 w-4 text-yellow-300" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{item.text}</p>
            </div>
          ))}
        </div>

        <Link
          href={PRACTICAL_COURSE.checkoutPath}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110"
        >
          {t("course.intro.cta")}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
