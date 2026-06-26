"use client";

import { useState, useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed) return;
      setStatus("loading");
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, source: "final-cta" }),
        });
        if (!res.ok) {
          setStatus("error");
          return;
        }
        setStatus("done");
      } catch {
        setStatus("error");
      }
    },
    [email],
  );

  return (
    <section className="relative w-full overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[1250px] mx-auto px-4 pt-20 pb-16 flex flex-col items-center text-center gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
          Gata să faci primii pași în tranzacționare?
        </h2>
        <p className="text-sm md:text-base text-white/55 max-w-lg">
          Abonează-te și primești noutăți despre tranzacționare, alerte de piață și
          conținut educativ direct pe email.
        </p>

        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
              <FaCheckCircle className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="text-base font-semibold text-emerald-400">
              Te-ai înscris cu succes!
            </p>
            <p className="text-xs text-white/45">
              O să primești pe acest email noutăți legate de tranzacționare și conținut educativ.
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="mt-2 w-full max-w-md flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Emailul tău"
                className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/35 outline-none transition focus:border-yellow-300/50 focus:ring-1 focus:ring-yellow-300/30"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {status === "loading" ? "Se trimite..." : "Abonează-te gratuit"}
                {status !== "loading" && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            {status === "error" && (
              <p className="text-xs text-red-400">A apărut o eroare. Încearcă din nou.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
