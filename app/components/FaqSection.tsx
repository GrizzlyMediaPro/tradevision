"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const faqs = [
  { q: "faq.free.q", a: "faq.free.a" },
  { q: "faq.experience.q", a: "faq.experience.a" },
  { q: "faq.duration.q", a: "faq.duration.a" },
  { q: "faq.upsell.q", a: "faq.upsell.a" },
  { q: "faq.risk.q", a: "faq.risk.a" },
  { q: "faq.markets.q", a: "faq.markets.a" },
];

function FaqItem({ item }: { item: (typeof faqs)[number] }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const answer = t(item.a);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open, answer]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden transition-colors hover:border-white/15">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-sm md:text-base font-semibold text-white">
          {t(item.q)}
        </span>
        <FaChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : "0px" }}
      >
        <div ref={contentRef} className="px-6 pb-5">
          <p className="text-xs md:text-sm text-white/50 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const t = useT();

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("faq.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full max-w-[1250px] flex flex-col gap-3">
          {faqs.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="w-full max-w-[1250px] rounded-2xl border border-white/8 bg-white/2 px-6 py-5 md:px-8 md:py-6">
          <p className="text-[11px] md:text-xs text-white/35 leading-relaxed text-center">
            {t("faq.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
