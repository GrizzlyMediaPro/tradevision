"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCopy } from "react-icons/fa";

const FALLBACK_PARTNERS = [
  {
    name: "Lucid Trading",
    logo: "/partnersmock/My-Funded-Futures-1.webp",
    discount: "50% Off",
    rating: "4.7/5",
    code: "MIKE",
    fundingUrl: "https://lucidtrading.com",
  },
  {
    name: "Take Profit Trader",
    logo: "/partnersmock/My-Funded-Futures-4.webp",
    discount: "40% Off",
    rating: "4.4/5",
    code: "PFM",
    fundingUrl: "https://takeprofittrader.com",
  },
  {
    name: "Apex Trader Funding",
    logo: "/partnersmock/My-Funded-Futures-8.webp",
    discount: "90% Off",
    rating: "4.4/5",
    code: "MIKE",
    fundingUrl: "https://apextraderfunding.com",
  },
];

type DealItem = {
  name: string;
  logo: string;
  discount: string;
  rating: string;
  code: string;
  fundingUrl?: string;
};

const GAP = 32;

type DealsProps = {
  deals?: {
    id: string;
    logo: string;
    name: string;
    rating: number;
    discount: string;
    code: string;
    fundingUrl?: string;
  }[];
};

function formatDiscount(raw: string): string {
  if (!raw) return "";
  const numeric = Number(raw.toString().replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return raw;
  return `${numeric}% DISCOUNT`;
}

function normalizeUrl(raw?: string | null): string {
  if (!raw) return "#";
  const trimmed = raw.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function Deals({ deals: rawDeals }: DealsProps) {
  const partners: DealItem[] = useMemo(() => {
    if (rawDeals && rawDeals.length > 0) {
      return rawDeals.map((d) => ({
        name: d.name,
        logo: d.logo,
        discount: d.discount,
        rating: `${d.rating.toFixed(1)}/5`,
        code: d.code,
        fundingUrl: d.fundingUrl,
      }));
    }
    return FALLBACK_PARTNERS;
  }, [rawDeals]);

  const TOTAL = partners.length;
  const isCarousel = TOTAL >= 3;
  const extended = useMemo(
    () => (TOTAL > 0 ? (isCarousel ? [...partners, ...partners, ...partners] : partners) : []),
    [partners, TOTAL, isCarousel],
  );
  const [currentIndex, setCurrentIndex] = useState(isCarousel ? TOTAL : 0);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [copied, setCopied] = useState(false);

  // Measure card width based on full container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const viewport =
          typeof window !== "undefined" ? window.innerWidth : 1024;

        // On mobile, show a single full-width card per view.
        if (viewport < 768) {
          setCardWidth(w);
        } else {
          // On tablet/desktop, show three cards per view.
          setCardWidth((w - 2 * GAP) / 3);
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleCopy = useCallback((code: string) => {
    navigator?.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

  // Navigate to a specific partner by dot index (0, 1, 2)
  const handleDot = useCallback(
    (dotIdx: number) => {
      if (!isCarousel) return;
      setIsAnimating(true);
      // Jump to the middle set position for that dot
      setCurrentIndex(TOTAL + dotIdx);
    },
    [TOTAL, isCarousel],
  );

  // Auto-advance every 5s
  useEffect(() => {
    if (!isCarousel) return;
    const id = setInterval(handleNext, 10000);
    return () => clearInterval(id);
  }, [handleNext, isCarousel]);

  // Snap back for infinite loop after transition ends
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

  // Active dot index (which partner is first visible)
  const activeDot = TOTAL > 0 ? ((currentIndex % TOTAL) + TOTAL) % TOTAL : 0;

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-12 overflow-visible">
      {copied && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-black/80 px-4 py-1.5 text-xs font-medium text-emerald-200 shadow-lg">
          Codul a fost copiat
        </div>
      )}
      <div className="w-full flex flex-col items-center text-center gap-10 overflow-visible">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Cele mai bune oferte și comparații de prop firms
          </h2>
          <div className="mt-3 h-[2px] w-[100px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        {isCarousel ? (
          <>
            {/* Carousel container — full width, padding so shadow is not clipped */}
            <div
              ref={containerRef}
              className="w-full overflow-hidden pb-10 -mb-10"
            >
              <div
                className="flex"
                style={{
                  gap: `${GAP}px`,
                  transform: `translateX(${translateX}px)`,
                  transition: isAnimating ? "transform 0.5s ease" : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extended.map((partner, idx) => (
                  <article
                    key={idx}
                    className="shrink-0 rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                    style={{
                      width:
                        cardWidth > 0
                          ? `${cardWidth}px`
                          : "calc((100% - 64px) / 3)",
                    }}
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black/40">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={80}
                          height={80}
                          className="h-16 w-16 object-contain"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                          {partner.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-sm text-yellow-300">
                          <span className="text-lg">★★★★★</span>
                          <span className="text-yellow-200/80">
                            {partner.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-3xl font-semibold text-white">
                        {formatDiscount(partner.discount)}
                      </p>

                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleCopy(partner.code)}
                          className="flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90 cursor-pointer"
                        >
                          <FaCopy className="h-4 w-4" />
                          <span>{partner.code}</span>
                        </button>
                        <span className="text-[11px] text-white/60">
                          Copiază codul
                        </span>
                      </div>

                      <a
                        href={normalizeUrl(partner.fundingUrl)}
                        target={partner.fundingUrl ? "_blank" : undefined}
                        rel={partner.fundingUrl ? "noopener noreferrer" : undefined}
                        className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 via-purple-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.7)] transition hover:brightness-110 cursor-pointer"
                      >
                        Obține finanțare
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Navigation: Arrow left — Dots — Arrow right */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label="Previous deals"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {partners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDot(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeDot
                        ? "w-7 bg-purple-500"
                        : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Go to deal ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label="Next deals"
              >
                ›
              </button>
            </div>
          </>
        ) : (
          // Static layout when we have fewer than 3 deals
          <div className="w-full flex flex-wrap justify-center gap-6">
            {partners.map((partner, idx) => (
              <article
                key={idx}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black/40">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={80}
                      height={80}
                      className="h-16 w-16 object-contain"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      {partner.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-yellow-300">
                      <span className="text-lg">★★★★★</span>
                      <span className="text-yellow-200/80">
                        {partner.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-3xl font-semibold text-white">
                    {formatDiscount(partner.discount)}
                  </p>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleCopy(partner.code)}
                      className="flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90 cursor-pointer"
                    >
                      <FaCopy className="h-4 w-4" />
                      <span>{partner.code}</span>
                    </button>
                    <span className="text-[11px] text-white/60">
                      Copiază codul
                    </span>
                  </div>

                  <a
                    href={normalizeUrl(partner.fundingUrl)}
                    target={partner.fundingUrl ? "_blank" : undefined}
                    rel={partner.fundingUrl ? "noopener noreferrer" : undefined}
                    className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 via-purple-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.7)] transition hover:brightness-110 cursor-pointer"
                  >
                    Obține finanțare
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
