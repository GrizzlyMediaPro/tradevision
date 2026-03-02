import { TelegramCtaAndLive } from "../components/TelegramCtaAndLive";
import { FaEnvelope } from "react-icons/fa";
import { getLinkWidget } from "../admin/actions/linkwidget";
import { sendContactEmail } from "./actions";

export default async function ContactPage() {
  const linkWidget = await getLinkWidget();

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Contact
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-md mx-auto">
          Ai o întrebare sau vrei să colaborăm? Trimite-ne un mesaj și îți vom răspunde cât mai curând.
        </p>
      </div>

      {/* Form card */}
      <section className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-8 md:px-10 md:py-12 shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/30">
            <FaEnvelope className="h-4 w-4 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Trimite un mesaj</h2>
            <p className="text-xs text-white/50">Completează formularul de mai jos</p>
          </div>
        </div>

        <form action={sendContactEmail} className="flex flex-col gap-5">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-white/60">
                Nume
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
                placeholder="Numele tău"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-white/60">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
                placeholder="email@exemplu.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-white/60">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
              placeholder="+40 7XX XXX XXX"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-white/60">
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30 resize-none"
              placeholder="Spune-ne cu ce te putem ajuta..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full md:w-auto md:self-end inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-purple-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer uppercase tracking-wide"
          >
            Trimite mesajul
          </button>
        </form>
      </section>

      {/* CTA sections */}
      <div className="mt-10">
        <TelegramCtaAndLive linkWidget={linkWidget} />
      </div>
    </main>
  );
}
