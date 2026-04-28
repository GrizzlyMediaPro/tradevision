'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaClock } from 'react-icons/fa';
import {
  getWebinarSettings,
  saveWebinarSettings,
} from '../actions/webinar';

function toLocalDateTimeInputValue(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - timezoneOffsetMs);
  return localDate.toISOString().slice(0, 16);
}

function toIsoDate(localDateTime: string) {
  return new Date(localDateTime).toISOString();
}

export default function AdminWebinarPage() {
  const [webinarAtInput, setWebinarAtInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    getWebinarSettings()
      .then((settings) => {
        setWebinarAtInput(toLocalDateTimeInputValue(settings.webinarAt));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!webinarAtInput) return;

    setSaving(true);
    setSavedMessage('');
    try {
      await saveWebinarSettings({ webinarAt: toIsoDate(webinarAtInput) });
      setSavedMessage('Setarile webinarului au fost salvate.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full max-w-[900px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>Inapoi la Admin</span>
        </Link>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/30">
            <FaClock className="h-5 w-5 text-purple-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Webinar
        </h1>
        <div className="mt-3 h-[2px] w-[120px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Seteaza data si ora webinarului live. Toate countdown-urile de pe
          pagina webinar vor folosi automat aceasta valoare.
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.07] to-white/[0.02] px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-xs font-medium uppercase tracking-wider text-white/60">
            Data si ora webinar (ora locala)
          </label>
          <input
            type="datetime-local"
            value={webinarAtInput}
            onChange={(e) => setWebinarAtInput(e.target.value)}
            disabled={loading}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
            required
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] text-white/45">
              Countdown-ul va expira exact la data selectata.
            </p>
            <button
              type="submit"
              disabled={saving || loading || !webinarAtInput}
              className="inline-flex items-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Se salveaza...' : 'Salveaza setari'}
            </button>
          </div>

          {savedMessage ? (
            <p className="text-xs text-emerald-300">{savedMessage}</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
