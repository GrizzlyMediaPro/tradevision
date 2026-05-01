import { TelegramCtaAndLive } from "@/app/components/TelegramCtaAndLive";
import { getLinkWidget } from "@/app/admin/actions/linkwidget";
import { ContactForm } from "./ContactForm";

export default async function ContactPage() {
  const linkWidget = await getLinkWidget();

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Contact
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-md mx-auto">
          Ai o întrebare sau vrei să colaborăm? Trimite-ne un mesaj și îți vom răspunde cât mai curând.
        </p>
      </div>

      <ContactForm />

      {/* CTA sections */}
      <div className="mt-10">
        <TelegramCtaAndLive linkWidget={linkWidget} />
      </div>
    </main>
  );
}
