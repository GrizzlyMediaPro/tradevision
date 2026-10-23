"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
const DRAW_MS = 2800;
const RAIL_INSET = 8;
const CORNER = 16;

type Point = { x: number; y: number };

function stepCell(index: number) {
  const row = Math.floor(index / COLUMNS);
  const pos = index % COLUMNS;
  const col = row % 2 === 0 ? pos : COLUMNS - 1 - pos;
  return { row, col };
}

function buildRoadmapPath(centers: Point[], width: number) {
  const arrival = [0];
  let length = 0;
  let cursor = centers[0];
  let d = `M ${cursor.x} ${cursor.y}`;

  const lineTo = (to: Point) => {
    length += Math.hypot(to.x - cursor.x, to.y - cursor.y);
    d += ` L ${to.x} ${to.y}`;
    cursor = to;
  };

  const quarterTo = (corner: Point, to: Point) => {
    length += (Math.PI * CORNER) / 2;
    d += ` Q ${corner.x} ${corner.y} ${to.x} ${to.y}`;
    cursor = to;
  };

  for (let i = 0; i < centers.length - 1; i++) {
    const next = centers[i + 1];
    const sameRow = Math.floor(i / COLUMNS) === Math.floor((i + 1) / COLUMNS);
    if (sameRow) {
      lineTo(next);
    } else {
      const goRight = Math.floor(i / COLUMNS) % 2 === 0;
      const railX = goRight ? width - RAIL_INSET : RAIL_INSET;
      const dir = goRight ? 1 : -1;
      if (next.y - cursor.y < CORNER * 2 + 4) {
        lineTo({ x: railX, y: cursor.y });
        lineTo({ x: railX, y: next.y });
        lineTo(next);
      } else {
        lineTo({ x: railX - dir * CORNER, y: cursor.y });
        quarterTo({ x: railX, y: cursor.y }, { x: railX, y: cursor.y + CORNER });
        lineTo({ x: railX, y: next.y - CORNER });
        quarterTo({ x: railX, y: next.y }, { x: railX - dir * CORNER, y: next.y });
        lineTo(next);
      }
    }
    arrival.push(length);
  }

  return { d, arrival, total: length };
}

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

function DesktopRoadmap() {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const drawn = useRef(false);
  const [geom, setGeom] = useState<{ d: string; arrival: number[]; total: number } | null>(null);
  const [pathLen, setPathLen] = useState(0);
  const [draw, setDraw] = useState(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      if (getComputedStyle(wrap).display === "none") return;
      const wrapBox = wrap.getBoundingClientRect();
      if (wrapBox.width < 100) return;
      const centers: Point[] = [];
      for (let i = 0; i < lessons.length; i++) {
        const el = circleRefs.current[i];
        if (!el) return;
        const box = el.getBoundingClientRect();
        centers.push({
          x: box.left + box.width / 2 - wrapBox.left,
          y: box.top + box.height / 2 - wrapBox.top,
        });
      }
      const next = buildRoadmapPath(centers, wrapBox.width);
      setGeom((prev) => (prev?.d === next.d ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    const fonts = document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      void fonts;
    };
  }, []);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !geom) return;
    const len = path.getTotalLength();
    setPathLen((prev) => (Math.abs(prev - len) < 0.5 ? prev : len));
  }, [geom]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || pathLen <= 0 || drawn.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      drawn.current = true;
      setDraw(true);
      return;
    }

    let frame = 0;
    const start = () => {
      if (drawn.current) return;
      drawn.current = true;
      frame = requestAnimationFrame(() => setDraw(true));
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.18 },
    );
    observer.observe(wrap);
    return () => {
      observer.disconnect();
      if (!drawn.current) cancelAnimationFrame(frame);
    };
  }, [pathLen]);

  const delayFor = (index: number) => {
    if (!geom || geom.total <= 0) return 0;
    return Math.max(0, (geom.arrival[index] / geom.total) * DRAW_MS - 180);
  };

  return (
    <div ref={wrapRef} className="relative z-0 mt-14 hidden px-8 md:block">
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
        aria-hidden
      >
        {geom && (
          <>
            <path
              d={geom.d}
              className="fill-none stroke-purple-400/25"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={pathRef}
              d={geom.d}
              className="fill-none stroke-purple-300"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLen || geom.total,
                strokeDashoffset: draw ? 0 : pathLen || geom.total,
                transition: draw ? `stroke-dashoffset ${DRAW_MS}ms linear` : "none",
              }}
            />
          </>
        )}
      </svg>

      <ol className="relative z-10 grid list-none grid-cols-3 gap-x-8 gap-y-14 p-0">
        {lessons.map((lessonId, index) => {
          const { row, col } = stepCell(index);
          const delay = delayFor(index);
          return (
            <li
              key={lessonId}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
              className="flex flex-col items-center text-center"
            >
              <div
                ref={(el) => {
                  circleRefs.current[index] = el;
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-purple-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)] transition-all duration-500 ${
                  draw ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
                style={{ transitionDelay: draw ? `${delay}ms` : "0ms" }}
              >
                {lessonId}
              </div>
              <div
                className={`mt-4 px-1 transition-all duration-500 ${
                  draw ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: draw ? `${delay + 60}ms` : "0ms" }}
              >
                <h3 className="text-sm font-semibold text-white md:text-base">
                  {t(`curriculum.${lessonId}.title`)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50 md:text-sm">
                  {t(`curriculum.${lessonId}.body`)}
                </p>
                <span className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] text-white/35">
                  <FaClock className="h-3 w-3" />
                  {t(`curriculum.${lessonId}.duration`)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
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

        <DesktopRoadmap />

        <div className="mx-auto mt-12 w-full max-w-2xl md:hidden">
          <MobileLessonCarousel />
        </div>
      </div>
    </section>
  );
}
