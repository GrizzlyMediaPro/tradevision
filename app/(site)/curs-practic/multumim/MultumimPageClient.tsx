"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { PracticalCourseShell } from "@/app/components/practical-course/PracticalCourseShell";
import {
  formatPriceEur,
  getBasePriceEur,
} from "@/lib/practicalCoursePricing";

type OrderSummaryData = {
  status: string;
  finalAmountEur: number | null;
  discountCode: string | null;
  baseAmountEur: number;
};

export function MultumimPageClient() {
  const [order, setOrder] = useState<OrderSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/curs-practic/order");
        if (!res.ok) return;
        const data = (await res.json()) as OrderSummaryData;
        if (!cancelled) setOrder(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finalAmount =
    order?.finalAmountEur ?? order?.baseAmountEur ?? getBasePriceEur();

  return (
    <PracticalCourseShell
      title="Mulțumim!"
      subtitle="Plata ta a fost înregistrată cu succes."
    >
      <div className="flex flex-col items-center gap-5 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
          <FaCheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-white/70">
          Ai finalizat achiziția pentru{" "}
          <strong className="text-white">{PRACTICAL_COURSE.title}</strong>.
          {loading
            ? " Se încarcă detaliile comenzii..."
            : ` Suma plătită: ${formatPriceEur(finalAmount)}.`}
          {order?.discountCode
            ? ` Cod discount aplicat: ${order.discountCode}.`
            : ""}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Înapoi acasă
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-900 transition hover:brightness-110"
          >
            Contactează-ne
          </Link>
        </div>
      </div>
    </PracticalCourseShell>
  );
}
