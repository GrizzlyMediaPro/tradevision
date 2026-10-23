import { TelegramCtaAndLive } from "@/app/components/TelegramCtaAndLive";
import { getT } from "@/lib/i18n/get-t";
import { ContactForm } from "./ContactForm";

export default async function ContactPage() {
  const t = await getT();

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          {t("contact.title")}
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-md mx-auto">
          {t("contact.subtitle")}
        </p>
      </div>

      <ContactForm />

      {/* CTA sections */}
      <div className="mt-10">
        <TelegramCtaAndLive />
      </div>
    </main>
  );
}
