"use client";

import { useState, useCallback } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

export function ContactForm() {
  const t = useT();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name")?.toString() ?? "",
          email: formData.get("email")?.toString() ?? "",
          phone: formData.get("phone")?.toString() ?? "",
          message: formData.get("message")?.toString() ?? "",
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }, []);

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 px-6 py-8 md:px-10 md:py-12 shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/30">
          <FaEnvelope className="h-4 w-4 text-yellow-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{t("contact.formTitle")}</h2>
          <p className="text-xs text-white/50">{t("contact.formSubtitle")}</p>
        </div>
      </div>

      {status === "done" ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <FaCheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{t("contact.successTitle")}</h3>
          <p className="text-sm text-white/50 max-w-sm text-center">
            {t("contact.successBody")}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            {t("contact.sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t("contact.name")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
                placeholder={t("contact.namePlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t("contact.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
                placeholder={t("contact.emailPlaceholder")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-white/60">
              {t("contact.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
              placeholder={t("contact.phonePlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-white/60">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30 resize-none"
              placeholder={t("contact.messagePlaceholder")}
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-red-400">
              {t("contact.error")}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 w-full md:w-auto md:self-end inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-500 via-purple-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer uppercase tracking-wide disabled:opacity-60"
          >
            {status === "loading" ? t("contact.sending") : t("contact.submit")}
          </button>
        </form>
      )}
    </section>
  );
}
