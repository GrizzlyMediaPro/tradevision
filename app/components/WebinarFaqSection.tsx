"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "Chiar e gratuit? Care e treabă?",
    answer:
      "Da, participarea la webinar este gratuită. Ne concentrăm pe valoare practică și pe claritate, ca să înțelegi exact dacă abordarea noastră ți se potrivește.",
  },
  {
    question: "Am nevoie de experiență anterioară?",
    answer:
      "Nu. Webinarul este construit astfel încât să fie util și pentru începători, dar și pentru cei care au încercat deja trading și nu au încă rezultate constante.",
  },
  {
    question: "Cât durează webinarul?",
    answer:
      "Webinarul durează aproximativ 2 ore, plus o sesiune scurtă de întrebări la final. Primești structură clară, exemple practice și pași concreți de aplicare.",
  },
  {
    question: "O să îmi vinzi ceva după?",
    answer:
      "La final îți prezentăm opțiunile pentru cei care vor să continue mai avansat, dar webinarul în sine livrează valoare de sine stătătoare. Decizia îți aparține.",
  },
  {
    question: "Tradingul nu e riscant?",
    answer:
      "Ba da, tradingul implică risc real. Tocmai de aceea insistăm pe managementul riscului, disciplină și execuția unui plan, nu pe promisiuni nerealiste.",
  },
  {
    question: "Ce piețe acoperiți?",
    answer:
      "În webinar ne uităm în principal la piețe de indici (ex. Nasdaq), dar principiile de structură, execuție și managementul riscului se aplică și în alte piețe.",
  },
];

function FaqItem({ item }: { item: (typeof faqs)[number] }) {
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
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Ai întrebări? E normal.
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full max-w-[1250px] flex flex-col gap-3">
          {faqs.map((item) => (
            <FaqItem key={item.question} item={item} />
          ))}
        </div>

        <div className="w-full max-w-[1250px] rounded-2xl border border-white/8 bg-white/2 px-6 py-5 md:px-8 md:py-6">
          <p className="text-[11px] md:text-xs text-white/35 leading-relaxed text-center">
            Tradingul implică riscuri semnificative și nu este potrivit pentru
            toți investitorii. Performanțele trecute nu garantează rezultate
            viitoare. Conținutul oferit are caracter educațional și nu constituie
            sfat financiar personalizat. Tranzacționează doar cu bani pe care îți
            permiți să îi pierzi.
          </p>
        </div>
      </div>
    </section>
  );
}
