"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { WebinarConfirmationContent } from "../../components/WebinarConfirmationContent";
import { useT } from "@/lib/i18n/I18nProvider";
import { trackMetaPixelEvent } from "@/lib/metaPixel";

type Props = {
  firstName: string;
};

export function WebinarConfirmareShell({ firstName }: Props) {
  const t = useT();
  useEffect(() => {
    trackMetaPixelEvent("CompleteRegistration");
  }, []);

  return (
    <main className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-[#020312] text-white">
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
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(168,85,247,0.16), transparent 45%), radial-gradient(circle at 88% 10%, rgba(251,191,36,0.10), transparent 40%)",
        }}
      />

      <header className="relative z-10 flex w-full items-center justify-between px-4 pt-6 sm:px-8 sm:pt-8">
        <Link
          href="/webinar"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/60 transition hover:text-white"
        >
          <FaArrowLeft className="h-3 w-3" />
          {t("webinar.shell.back")}
        </Link>

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt={t("webinar.shell.logoAlt")}
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="w-[60px]" />
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-10 sm:px-6">
        <div className="w-full max-w-3xl">
          <WebinarConfirmationContent firstName={firstName} />
        </div>
      </section>
    </main>
  );
}
