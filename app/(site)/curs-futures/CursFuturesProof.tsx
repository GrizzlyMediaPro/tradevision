"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import {
  payoutImageSrc,
  previousEditionPayouts,
  previousEditionProfitCents,
  previousEditionReviews,
  type PreviousEditionPayout,
  type PreviousEditionReview,
} from "@/app/data/previousEditionResults";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/locale";

function formatUsd(cents: number, locale: Locale) {
  const hasCents = cents % 100 !== 0;
  const formatted = new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return locale === "ro" ? `${formatted} $` : `$${formatted}`;
}

function formatDate(iso: string, locale: Locale) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function ReviewCard({
  review,
  author,
  onOpen,
}: {
  review: PreviousEditionReview;
  author: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      lang="ro"
      className="edition-review flex h-56 w-[min(20rem,78vw)] shrink-0 cursor-pointer flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-5 py-5 text-left shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition hover:border-yellow-300/40"
    >
      <p className="line-clamp-6 text-sm leading-relaxed text-white/75">{review.text}</p>
      <span className="mt-auto pt-4 text-sm font-semibold text-yellow-300">{author}</span>
    </button>
  );
}

export function CursFuturesProof() {
  const { t, locale } = useI18n();
  const railRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [openReview, setOpenReview] = useState<PreviousEditionReview | null>(null);
  const dialogOpen = active !== null || openReview !== null;

  useEffect(() => {
    if (!dialogOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        setOpenReview(null);
      }
      if (active === null) return;
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? current : (current + 1) % previousEditionPayouts.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + previousEditionPayouts.length) % previousEditionPayouts.length,
        );
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, dialogOpen]);

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if (direction > 0 && rail.scrollLeft >= max - 4) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && rail.scrollLeft <= 4) {
      rail.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    const next = Math.min(Math.max(rail.scrollLeft + direction * rail.clientWidth, 0), max);
    rail.scrollTo({ left: next, behavior: "smooth" });
  }

  function shiftCertificate(direction: -1 | 1) {
    setActive((current) =>
      current === null
        ? current
        : (current + direction + previousEditionPayouts.length) % previousEditionPayouts.length,
    );
  }

  const openPayout = active === null ? null : previousEditionPayouts[active];

  return (
    <section className="mx-auto w-full max-w-[1250px] px-4 pb-16 pt-10">
      <div className="text-center">
        <h2 className="mx-auto max-w-3xl text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
          {t("course.proof.title")}
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
        <p className="mx-auto mt-5 max-w-xl text-sm text-white/55 md:text-base">{t("course.proof.subtitle")}</p>
      </div>

      <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-4 py-5 text-center shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
        <p className="text-2xl font-bold text-yellow-300 lg:text-[1.65rem]">
          {formatUsd(previousEditionProfitCents, locale)}
        </p>
        <p className="mt-1 text-xs text-white/55 lg:text-[0.8rem]">{t("course.proof.stat.share")}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
          {t("course.proof.results")}
        </h3>
        <div className="relative mt-5 px-11">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label={t("course.proof.prev")}
            className="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg"
          >
            <FaChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label={t("course.proof.next")}
            className="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg"
          >
            <FaChevronRight className="h-3.5 w-3.5" />
          </button>

          <div
            ref={railRef}
            className="edition-rail flex snap-x snap-mandatory overflow-x-auto"
          >
            {previousEditionPayouts.map((payout, index) => (
              <div key={payout.id} className="w-full shrink-0 snap-start px-1 lg:w-1/3 lg:px-2">
                <PayoutCard
                  payout={payout}
                  locale={locale}
                  lifetimeLabel={t("course.proof.lifetime")}
                  openLabel={t("course.proof.enlarge", { name: payout.name })}
                  onOpen={() => setActive(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
          {t("course.proof.reviews")}
        </h3>
        <div className="edition-marquee-viewport mt-5" aria-label={t("course.proof.reviews")}>
          <div className="edition-marquee">
            <ReviewGroup
              reviews={previousEditionReviews}
              anonymous={t("course.proof.anonymous")}
              onOpen={setOpenReview}
            />
            <ReviewGroup
              reviews={previousEditionReviews}
              anonymous={t("course.proof.anonymous")}
              onOpen={setOpenReview}
              copy
            />
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="mx-auto max-w-3xl text-[10px] leading-relaxed text-white/45 md:text-[11px]">
          {t("disclosure.testimonial")}
        </p>
        <Link
          href={PRACTICAL_COURSE.checkoutPath}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110"
        >
          {t("course.proof.cta")}
        </Link>
      </div>

      {openPayout && active !== null ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openPayout.name}
          onClick={() => setActive(null)}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setActive(null)}
            aria-label={t("course.proof.close")}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white"
          >
            <FaTimes className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("course.proof.prev")}
            onClick={(event) => {
              event.stopPropagation();
              shiftCertificate(-1);
            }}
            className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white sm:left-6"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("course.proof.next")}
            onClick={(event) => {
              event.stopPropagation();
              shiftCertificate(1);
            }}
            className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white sm:right-6"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
          <figure className="max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={payoutImageSrc(openPayout.file)}
              alt={`${openPayout.name}, ${formatUsd(openPayout.amountCents, locale)}, ${openPayout.firm}`}
              className="max-h-[78vh] w-auto max-w-[92vw] rounded-xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {openPayout.name}
              {" · "}
              {formatUsd(openPayout.amountCents, locale)}
              {" · "}
              {openPayout.firm}
              {openPayout.lifetime ? ` · ${t("course.proof.lifetime")}` : ""}
              <span className="mt-1 block text-xs text-white/45">
                {active + 1} / {previousEditionPayouts.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}

      {openReview ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openReview.author ?? t("course.proof.anonymous")}
          onClick={() => setOpenReview(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1020] px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p lang="ro" className="text-sm leading-relaxed text-white/80">
              {openReview.text}
            </p>
            <p className="mt-5 text-sm font-semibold text-yellow-300">
              {openReview.author ?? t("course.proof.anonymous")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpenReview(null)}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
            >
              {t("course.proof.close")}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PayoutCard({
  payout,
  locale,
  lifetimeLabel,
  openLabel,
  onOpen,
}: {
  payout: PreviousEditionPayout;
  locale: Locale;
  lifetimeLabel: string;
  openLabel: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={openLabel}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#041018] text-left shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition hover:border-yellow-300/40"
    >
      <span className="relative block aspect-4/3">
        <img
          src={payoutImageSrc(payout.file)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </span>
      <span className="block px-4 py-3">
        <span className="block font-semibold text-white">{payout.name}</span>
        <span className="mt-1 block text-sm font-semibold text-yellow-300">
          {formatUsd(payout.amountCents, locale)}
        </span>
        <span className="mt-0.5 block text-xs text-white/45">
          {payout.firm}
          {" · "}
          {formatDate(payout.date, locale)}
          {payout.lifetime ? ` · ${lifetimeLabel}` : ""}
        </span>
      </span>
    </button>
  );
}

function ReviewGroup({
  reviews,
  anonymous,
  onOpen,
  copy = false,
}: {
  reviews: PreviousEditionReview[];
  anonymous: string;
  onOpen: (review: PreviousEditionReview) => void;
  copy?: boolean;
}) {
  return (
    <div className={copy ? "edition-marquee-group edition-marquee-copy" : "edition-marquee-group"} aria-hidden={copy}>
      {reviews.map((review) => (
        <ReviewCard
          key={`${review.id}-${copy ? "copy" : "main"}`}
          review={review}
          author={review.author ?? anonymous}
          onOpen={() => onOpen(review)}
        />
      ))}
    </div>
  );
}
