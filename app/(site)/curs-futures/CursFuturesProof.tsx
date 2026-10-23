"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChartLine, FaPlay, FaUsers, FaYoutube } from "react-icons/fa";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { useT } from "@/lib/i18n/I18nProvider";

const COMMUNITY_VIDEO_ID = "rouZMXnAUnU";

export function CursFuturesProof() {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const proofs = [
    { icon: FaUsers, value: "2000+", label: t("course.proof.students") },
    {
      icon: FaChartLine,
      value: t("course.proof.experienceValue"),
      label: t("course.proof.experience"),
    },
    { icon: FaYoutube, value: "Live", label: t("course.proof.youtube") },
  ];

  return (
    <section className="mx-auto w-full max-w-[1250px] px-4 pb-16 pt-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
          {t("course.proof.title")}
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-[80px] rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
        <p className="mx-auto mt-5 max-w-lg text-sm text-white/55 md:text-base">
          {t("course.proof.subtitle")}
        </p>
      </div>

      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="mx-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 shadow-[0_8px_18px_rgba(0,0,0,0.45)] lg:max-w-[280px]">
          <div className="relative aspect-9/16 w-full">
            <iframe
              src={`https://www.youtube.com/embed/${COMMUNITY_VIDEO_ID}${playing ? "?autoplay=1" : ""}`}
              title={t("course.proof.videoTitle")}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {!playing ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={t("course.proof.play")}
                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 transition hover:bg-black/40"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 via-amber-300 to-yellow-500 shadow-[0_12px_30px_rgba(250,204,21,0.4)] transition hover:brightness-110">
                  <FaPlay className="ml-0.5 h-6 w-6 text-slate-900" />
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex h-full flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {proofs.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-4 py-5 text-center shadow-[0_8px_18px_rgba(0,0,0,0.35)] lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-5 lg:py-7"
              >
                <item.icon className="mx-auto h-5 w-5 text-yellow-300" aria-hidden />
                <p className="mt-3 text-2xl font-bold text-yellow-300 lg:text-[1.65rem]">{item.value}</p>
                <p className="mt-1 text-xs text-white/55 lg:text-[0.8rem]">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-6 text-left shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
            <p className="text-sm leading-relaxed text-white/70 md:text-base lg:text-lg lg:leading-7">
              {t("course.proof.body")}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/40 lg:text-sm lg:leading-6">{t("disclosure.testimonial")}</p>
            <Link
              href={PRACTICAL_COURSE.checkoutPath}
              className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] transition hover:brightness-110 lg:mt-auto"
            >
              {t("course.proof.cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
