"use client";

import { FaCheck, FaTimes } from "react-icons/fa";

const before = [
  "Crezi că tradingul profitabil este rezervat celor cu „noroc” sau „intuiție” și că nu poate fi învățat pas cu pas.",
  "Încerci să găsești o strategie care funcționează, dar ești copleșit de prea multe informații și păreri contradictorii.",
  "Ai rezultate fluctuante, nu ai un plan clar și te bazezi pe emoții sau impulsuri atunci când intri în piață.",
  "Nu știi exact cât să riști, unde să pui stop loss-ul sau când să ieși dintr-o tranzacție.",
  "Simți că pierzi timp și bani, iar lipsa unui sistem clar te face să te îndoiești de tine ca trader.",
];

const after = [
  "Înțelegi cum o strategie mecanică, simplă și clară, poate elimina emoțiile și incertitudinea din trading.",
  "Ai un proces pas cu pas pe care îl poți urma zilnic, indiferent de starea pieței sau de experiența ta actuală.",
  "Înveți cum să analizezi corect trendul, să identifici zone logice de intrare și să aplici un raport risc-reward realist.",
  "Înțelegi cum să aplici disciplina mentală în decizii și cum să gestionezi corect pierderile și câștigurile.",
  "Simți clar diferența dintre „ghicit” și „execuția unui plan” – iar asta îți oferă mai multă încredere și control în fiecare tranzacție.",
];

export function WebinarTransformationSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16">
      <div className="w-full flex flex-col items-center text-center gap-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Cum ți se poate schimba complet abordarea în trading
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_18px_rgba(0,0,0,0.45)] text-left">
            <h3 className="text-base md:text-lg font-semibold text-white mb-5">
              Înainte de workshop
            </h3>
            <ul className="flex flex-col gap-4">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 border border-red-400/30">
                    <FaTimes className="h-2.5 w-2.5 text-red-400" />
                  </span>
                  <p className="text-xs md:text-sm text-white/65 leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl border border-yellow-300/40 bg-linear-to-b from-yellow-400/8 to-white/3 px-6 py-8 md:px-8 md:py-10 shadow-[0_8px_22px_rgba(250,204,21,0.18)] text-left">
            <h3 className="text-base md:text-lg font-semibold text-white mb-5">
              După workshop
            </h3>
            <ul className="flex flex-col gap-4">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/40">
                    <FaCheck className="h-2.5 w-2.5 text-yellow-300" />
                  </span>
                  <p className="text-xs md:text-sm text-white/75 leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
