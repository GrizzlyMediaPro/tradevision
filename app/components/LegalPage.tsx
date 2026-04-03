import type { ReactNode } from "react";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="w-full max-w-[800px] mx-auto px-4 pt-12 md:pt-24 pb-20">
      <header className="mb-10 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          {title}
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        {description ? (
          <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>
      <div className="legal-doc space-y-8 text-sm md:text-base text-white/75 leading-relaxed">
        {children}
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg md:text-xl font-semibold text-white">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-white/95 [&_a]:text-purple-400 [&_a]:underline-offset-2 hover:[&_a]:underline">
        {children}
      </div>
    </section>
  );
}
