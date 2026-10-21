"use client";

import { useEffect, useRef, useState, useCallback } from "react";

function useCountUp(end: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);

  return value;
}

type StatItem = { value: number; suffix: string; label: string };

const stats: StatItem[] = [
  { value: 15, suffix: "", label: "Lecții video structurate" },
  { value: 500, suffix: "+", label: "Cursanți înscriși" },
  { value: 0, suffix: " lei", label: "Costul cursului" },
];

function AnimatedStat({ item, started }: { item: StatItem; started: boolean }) {
  const count = useCountUp(item.value, item.value > 100 ? 1800 : 1200, started);
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-yellow-300">
        {count}
        {item.suffix}
      </p>
      <p className="mt-1 text-xs md:text-sm text-white/50">{item.label}</p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) setStarted(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onIntersect]);

  return (
    <section className="w-full border-y border-white/6 bg-white/2">
      <div
        ref={ref}
        className="w-full max-w-[1250px] mx-auto px-4 py-10 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center"
      >
        {stats.map((item, i) => (
          <div key={item.label} className="contents">
            {i > 0 && (
              <div className="h-12 w-px bg-linear-to-b from-transparent via-white/20 to-transparent justify-self-center" />
            )}
            <AnimatedStat item={item} started={started} />
          </div>
        ))}
      </div>
    </section>
  );
}
