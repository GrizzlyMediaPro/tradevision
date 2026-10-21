"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCompress, FaSearchPlus } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const GAP = 32;

type ScreenshotCarouselProps = {
  title: string;
  subtitle: string;
  images: string[];
};

export function ScreenshotCarousel({ title, subtitle, images }: ScreenshotCarouselProps) {
  const t = useT();
  const TOTAL = images.length;
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const isCarousel = useMemo(() => (isMobile ? TOTAL >= 2 : TOTAL >= 3), [isMobile, TOTAL]);
  const extended = useMemo(
    () => (TOTAL > 0 ? (isCarousel ? [...images, ...images, ...images] : images) : []),
    [images, TOTAL, isCarousel],
  );
  const [currentIndex, setCurrentIndex] = useState(isCarousel ? TOTAL : 0);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    setCurrentIndex(isCarousel ? TOTAL : 0);
  }, [isCarousel, TOTAL]);

  useEffect(() => {
    const measure = () => {
      const viewport = typeof window !== "undefined" ? window.innerWidth : 1024;
      const mobile = viewport < 768;
      setIsMobile(mobile);
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setCardWidth(mobile ? w : (w - 2 * GAP) / 3);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleNext = useCallback(() => {
    if (!isCarousel) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isCarousel]);

  const handlePrev = useCallback(() => {
    if (!isCarousel) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isCarousel]);

  const handleDot = useCallback(
    (dotIdx: number) => {
      if (!isCarousel) return;
      setIsAnimating(true);
      setCurrentIndex(TOTAL + dotIdx);
    },
    [TOTAL, isCarousel],
  );

  useEffect(() => {
    if (!isCarousel) return;
    const id = setInterval(handleNext, 10000);
    return () => clearInterval(id);
  }, [handleNext, isCarousel]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    setLightboxZoom(false);
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + TOTAL) % TOTAL,
        );
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % TOTAL,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, TOTAL]);

  const handleTransitionEnd = useCallback(() => {
    if (!isCarousel) return;
    if (currentIndex >= TOTAL * 2) {
      setIsAnimating(false);
      setCurrentIndex((prev) => prev - TOTAL);
    } else if (currentIndex < TOTAL) {
      setIsAnimating(false);
      setCurrentIndex((prev) => prev + TOTAL);
    }
  }, [currentIndex, TOTAL, isCarousel]);

  const translateX = isCarousel ? -(currentIndex * (cardWidth + GAP)) : 0;
  const activeDot = TOTAL > 0 ? ((currentIndex % TOTAL) + TOTAL) % TOTAL : 0;

  if (TOTAL === 0) return null;

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-12 overflow-visible">
      <div className="w-full flex flex-col items-center text-center gap-10 overflow-visible">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {title}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>

        {isCarousel ? (
          <>
            <div ref={containerRef} className="w-full overflow-hidden pb-10 -mb-10">
              <div
                className="flex"
                style={{
                  gap: `${GAP}px`,
                  transform: `translateX(${translateX}px)`,
                  transition: isAnimating ? "transform 0.5s ease" : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extended.map((src, idx) => (
                  <article
                    key={idx}
                    className="shrink-0 rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-3 shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                    style={{
                      width: cardWidth > 0 ? `${cardWidth}px` : "calc((100% - 64px) / 3)",
                    }}
                  >
                    {src ? (
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx % TOTAL)}
                        className="relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-black/30 cursor-zoom-in"
                        aria-label={t("carousel.zoom", { n: (idx % TOTAL) + 1 })}
                      >
                        <Image
                          src={src}
                          alt={t("carousel.alt", { n: (idx % TOTAL) + 1 })}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </button>
                    ) : (
                      <div className="w-full aspect-4/3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center">
                        <span className="text-xs text-white/20">{t("carousel.empty")}</span>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label={t("carousel.previous")}
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDot(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeDot
                        ? "w-7 bg-purple-500"
                        : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={t("carousel.goto", { n: idx + 1 })}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label={t("carousel.next")}
              >
                ›
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-wrap justify-center gap-6">
            {images.map((src, idx) => (
              <article
                key={idx}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 p-3 shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
              >
                {src ? (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-black/30 cursor-zoom-in"
                    aria-label={t("carousel.zoom", { n: idx + 1 })}
                  >
                    <Image
                      src={src}
                      alt={t("carousel.alt", { n: idx + 1 })}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </button>
                ) : (
                  <div className="w-full aspect-4/3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center">
                    <span className="text-xs text-white/20">{t("carousel.empty")}</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label={t("carousel.dialog")}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 md:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className={`relative transition-transform duration-300 ease-out ${
                lightboxZoom ? "scale-[2] cursor-default" : "scale-100"
              }`}
              style={{
                width: "min(92vw, 72rem)",
                height: "min(78vh, calc(min(92vw, 72rem) * 0.75))",
                maxHeight: "85vh",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={t("carousel.altZoom", { n: lightboxIndex + 1 })}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div
            className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-white/10 px-3 py-3 md:px-5 md:py-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxZoom((z) => !z)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 text-sm font-medium text-white hover:bg-white/15 transition cursor-pointer"
              aria-pressed={lightboxZoom}
              aria-label={lightboxZoom ? t("carousel.fit") : t("carousel.enlarge")}
            >
              {lightboxZoom ? (
                <FaCompress className="h-4 w-4" />
              ) : (
                <FaSearchPlus className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {lightboxZoom ? t("carousel.fitShort") : t("carousel.zoomShort")}
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((i) =>
                  i === null ? null : (i - 1 + TOTAL) % TOTAL,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white/90 hover:bg-white/10 transition cursor-pointer"
              aria-label={t("carousel.prevImage")}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((i) =>
                  i === null ? null : (i + 1) % TOTAL,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white/90 hover:bg-white/10 transition cursor-pointer"
              aria-label={t("carousel.nextImage")}
            >
              ›
            </button>
            <span className="text-xs text-white/45 tabular-nums">
              {t("carousel.counter", { current: lightboxIndex + 1, total: TOTAL })}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-xl text-white/90 hover:bg-white/10 transition cursor-pointer"
              aria-label={t("carousel.close")}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
