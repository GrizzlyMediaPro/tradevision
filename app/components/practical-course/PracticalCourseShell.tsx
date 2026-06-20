"use client";

import Image from "next/image";
import Link from "next/link";

type PracticalCourseShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function PracticalCourseShell({
  title,
  subtitle,
  children,
}: PracticalCourseShellProps) {
  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-[#020312] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      <section className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-white/60">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </section>
    </main>
  );
}
