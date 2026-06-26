import Image from "next/image";
import Link from "next/link";
import { NINJATRADER_HOME_LOGOS } from "@/app/data/ninjaTrader";

export function NinjaTraderHomeSection() {
  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center gap-8">
        <div>
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-purple-300/90">
            Platformă recomandată
          </p>
          <h2 className="mt-2 text-xl md:text-2xl font-semibold text-white tracking-wide uppercase">
            Începe cu NinjaTrader
          </h2>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 max-w-2xl text-xs md:text-sm text-white/55 leading-relaxed">
            NinjaTrader este gratuit pentru charting, simulare și multe altele.
            Clienții pot accesa date futures, valutar și la închidere de zi fără costuri suplimentare.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          {Object.entries(NINJATRADER_HOME_LOGOS).map(([key, logo]) => (
            <a
              key={key}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 hover:border-yellow-300/30 hover:bg-white/8 transition"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={
                  key === "ninjaTrader"
                    ? "h-8 md:h-9 w-auto max-w-[200px] mx-auto object-contain"
                    : "h-14 md:h-16 w-auto max-w-[220px] mx-auto object-contain"
                }
              />
            </a>
          ))}
        </div>

        <Link
          href="/ninjatrader"
          className="inline-flex items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-yellow-300 hover:bg-yellow-400/20 transition"
        >
          Află mai multe despre NinjaTrader
        </Link>
      </div>
    </section>
  );
}
