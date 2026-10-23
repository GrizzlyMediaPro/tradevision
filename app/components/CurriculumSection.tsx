"use client";

import { useEffect, useRef, useState } from "react";
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

const COLUMNS = 3;
const PAGE_SIZE = 5;

function LessonStep({
  index,
  lessonId,
  isLast,
}: {
  index: number;
  lessonId: (typeof lessons)[number];
  isLast: boolean;
}) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex h-full gap-4 md:gap-5">
      <div className="flex flex-col items-center">
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)] transition-all duration-700 ${
            visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-linear-to-b from-purple-500/40 to-transparent" />
        )}
      </div>

      <div
        data-step-body
        className={`min-w-0 flex-1 transition-all duration-700 ${
          isLast ? "pb-0" : "pb-8"
        } ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        style={{ transitionDelay: "100ms" }}
      >
        <h3 className="text-sm font-semibold text-white md:text-base">
          {t(`curriculum.${lessonId}.title`)}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-white/50 md:text-sm">
          {t(`curriculum.${lessonId}.body`)}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-white/35">
          <FaClock className="h-3 w-3" />
          {t(`curriculum.${lessonId}.duration`)}
        </span>
      </div>
    </div>
  );
}

function DesktopLessons() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const sync = () => {
      if (getComputedStyle(grid).display === "none") return;
      const steps = [...grid.children] as HTMLElement[];
      const heights = steps.map((step) => {
        const body = step.querySelector("[data-step-body]");
        if (!(body instanceof HTMLElement)) return 0;
        return body.getBoundingClientRect().height;
      });
      const max = Math.ceil(Math.max(0, ...heights));
      if (max <= 0) return;
      const next = `${max}px`;
      steps.forEach((step) => {
        if (step.style.minHeight !== next) step.style.minHeight = next;
      });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className="mt-12 hidden gap-x-10 md:grid md:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }, (_, step) =>
        Array.from({ length: COLUMNS }, (_, column) => {
          const index = column * PAGE_SIZE + step;
          const lessonId = lessons[index];
          return (
            <LessonStep
              key={lessonId}
              index={index}
              lessonId={lessonId}
              isLast={step === PAGE_SIZE - 1}
            />
          );
        }),
      )}
    </div>
  );
}

function MobileLessonCarousel() {
  const t = useT();
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(lessons.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = lessons.slice(start, start + PAGE_SIZE);

  const goTo = (next: number) => {
    setPage((next + pageCount) % pageCount);
  };

  return (
    <div className="md:hidden">
      {visible.map((lessonId, offset) => (
        <LessonStep
          key={`${page}-${lessonId}`}
          index={start + offset}
          lessonId={lessonId}
          isLast={offset === visible.length - 1}
        />
      ))}

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label={t("curriculum.prev")}
        >
          ‹
        </button>
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => {
            const from = index * PAGE_SIZE + 1;
            const to = Math.min((index + 1) * PAGE_SIZE, lessons.length);
            return (
              <button
                key={from}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 cursor-pointer rounded-full transition-all ${
                  index === page
                    ? "w-7 bg-purple-500"
                    : "w-2.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={t("curriculum.page", { from, to })}
                aria-current={index === page ? "true" : undefined}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label={t("curriculum.next")}
        >
          ›
        </button>
      </div>
    </div>
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

        <DesktopLessons />

        <div className="mx-auto mt-12 w-full max-w-2xl md:hidden">
          <MobileLessonCarousel />
        </div>
      </div>
    </section>
  );
}
