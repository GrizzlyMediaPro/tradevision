"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GAP = 32;

type ScreenshotCarouselProps = {
  title: string;
  subtitle: string;
  images: string[];
};

export function ScreenshotCarousel({ title, subtitle, images }: ScreenshotCarouselProps) {
  const TOTAL = images.length;
  const [isMobile, setIsMobile] = useState(false);
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
                      <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-black/30">
                        <Image
                          src={src}
                          alt={`Screenshot ${(idx % TOTAL) + 1}`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-4/3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center">
                        <span className="text-xs text-white/20">Screenshot</span>
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
                aria-label="Previous"
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
                    aria-label={`Go to screenshot ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label="Next"
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
                  <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-black/30">
                    <Image
                      src={src}
                      alt={`Screenshot ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-4/3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center">
                    <span className="text-xs text-white/20">Screenshot</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
