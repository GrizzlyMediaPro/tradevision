"use client";

import { FaClock } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const lessons = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
] as const;

function LessonCard({
  index,
  lessonId,
}: {
  index: number;
  lessonId: (typeof lessons)[number];
}) {
  const t = useT();

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-4 py-5 text-left shadow-[0_8px_18px_rgba(0,0,0,0.45)] md:px-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-xs font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)]">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white md:text-base">{t(`curriculum.${lessonId}.title`)}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-white/50 md:text-sm">
        {t(`curriculum.${lessonId}.body`)}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-white/35">
        <FaClock className="h-3 w-3" />
        {t(`curriculum.${lessonId}.duration`)}
      </span>
    </article>
  );
}

export function CurriculumSection() {
  const t = useT();

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1250px] px-4 pt-20 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
            {t("curriculum.title")}
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
          <p className="mx-auto mt-5 max-w-lg text-sm text-white/55 md:text-base">
            {t("curriculum.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {lessons.map((lessonId, index) => (
            <LessonCard key={`curriculum.${lessonId}.title`} index={index} lessonId={lessonId} />
          ))}
        </div>
      </div>
    </section>
  );
}
