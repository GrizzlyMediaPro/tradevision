"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const FAQ_IDS = ["1", "2", "3", "4", "5", "6"] as const;

function FaqItem({ item }: { item: { id: string; question: string; answer: string } }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden transition-colors hover:border-white/15">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-sm md:text-base font-semibold text-white">
          {item.question}
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
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WebinarFaqSection() {
  const t = useT();
  const faqs = FAQ_IDS.map((id) => ({
    id,
    question: t(`webinar.faq.q${id}`),
    answer: t(`webinar.faq.a${id}`),
  }));

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("webinar.faq.title")}
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full max-w-[1250px] flex flex-col gap-3">
            {faqs.map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </div>

        <div className="w-full max-w-[1250px] rounded-2xl border border-white/8 bg-white/2 px-6 py-5 md:px-8 md:py-6">
          <p className="text-[11px] md:text-xs text-white/35 leading-relaxed text-center">
            {t("webinar.faq.disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
