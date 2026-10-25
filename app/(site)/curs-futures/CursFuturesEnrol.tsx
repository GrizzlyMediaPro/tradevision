import Link from "next/link";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { getT } from "@/lib/i18n/get-t";

const steps = ["1", "2", "3"] as const;

export async function CursFuturesSteps() {
  const t = await getT();

  return (
    <section className="mx-auto w-full max-w-[1250px] px-4 pt-16 pb-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
          {t("course.steps.title")}
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
        <p className="mx-auto mt-5 max-w-lg text-sm text-white/55 md:text-base">
          {t("course.steps.subtitle")}
        </p>
      </div>

      <div className="relative mt-12">
        <div
          aria-hidden
          className="absolute top-5 right-[16.66%] left-[16.66%] hidden h-px bg-linear-to-r from-purple-500/50 via-purple-400/40 to-purple-500/50 md:block"
        />
        <ol className="relative grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)]">
                {step}
              </span>
              <div className="md:mt-5">
                <h3 className="text-base font-semibold text-white">{t(`course.steps.${step}.title`)}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55 md:mx-auto">
                  {t(`course.steps.${step}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function CursFuturesFinalCta() {
  const t = await getT();

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1250px] flex-col items-center gap-6 px-4 pt-20 pb-24 text-center">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            {t("course.final.title")}
          </h2>
          <p className="text-sm font-medium text-white/80 md:text-base">
            {t("course.final.tagline")}
          </p>
        </div>
        <Link
          href={PRACTICAL_COURSE.checkoutPath}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110"
        >
          {t("course.intro.cta")}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
