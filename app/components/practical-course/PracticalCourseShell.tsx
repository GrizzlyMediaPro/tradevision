"use client";

import Image from "next/image";
import Link from "next/link";

type PracticalCourseShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
  embedded?: boolean;
};

export function PracticalCourseShell({
  title,
  subtitle,
  children,
  id,
  embedded = false,
}: PracticalCourseShellProps) {
  const Heading = embedded ? "h2" : "h1";
  const content = (
    <>
      {embedded ? null : (
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
      )}

      <div
        className={`relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-6 ${
          embedded ? "pb-16 pt-6" : "py-10 sm:py-12"
        }`}
      >
        <div className="mb-8">
          <Heading className="text-2xl font-bold sm:text-3xl">{title}</Heading>
          {subtitle ? (
            <p className="mt-2 text-sm text-white/60">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </>
  );

  if (embedded) {
    return (
      <section id={id} className="scroll-mt-24 text-white">
        {content}
      </section>
    );
  }

  return (
    <main
      id={id}
      className="relative isolate min-h-screen w-full overflow-hidden bg-[#020312] text-white"
    >
      {content}
    </main>
  );
}
