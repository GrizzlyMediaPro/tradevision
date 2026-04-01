"use client";

import { useState } from "react";
import { FaPlay } from "react-icons/fa";

const testimonials = [
  { videoId: "rouZMXnAUnU" },
  { videoId: "WqdyFD0Uoi0" },
  { videoId: "JkgdPLh_2xI" },
  { videoId: "7w8Ytkka9JI" },
];

function TestimonialCard({ item }: { item: (typeof testimonials)[number] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 shadow-[0_8px_18px_rgba(0,0,0,0.45)] overflow-hidden">
      <div className="relative w-full aspect-9/16">
        <iframe
          src={`https://www.youtube.com/embed/${item.videoId}${playing ? "?autoplay=1" : ""}`}
          title={`Testimonial video comunitate (${item.videoId})`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Redă testimonial video"
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 cursor-pointer transition hover:bg-black/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 via-amber-300 to-yellow-500 shadow-[0_12px_30px_rgba(250,204,21,0.4)] hover:brightness-110 transition">
              <FaPlay className="h-6 w-6 text-slate-900 ml-0.5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Oameni reali, rezultate reale
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-5 text-sm md:text-base text-white/55 max-w-lg mx-auto">
            Testimoniale video de la membrii comunității care au parcurs cursul
            și au început tradingul.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <TestimonialCard key={item.videoId} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
