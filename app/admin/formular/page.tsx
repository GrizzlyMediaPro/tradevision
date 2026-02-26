'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaEnvelopeOpenText,
  FaFilter,
  FaCheck,
  FaEnvelope,
} from 'react-icons/fa';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type Filter = 'all' | 'read' | 'unread';

const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: '1',
    name: 'Andrei Popescu',
    email: 'andrei@example.com',
    phone: '+40 712 345 678',
    message:
      'Salut! Aș vrea mai multe detalii despre cursul de trading și cum se desfășoară sesiunile live.',
    createdAt: '2026-02-20 10:15',
    read: false,
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    email: 'maria@example.com',
    phone: '+40 745 123 456',
    message:
      'Bună! Sunt interesată de colaborare pentru un webinar comun despre psihologia trading-ului.',
    createdAt: '2026-02-18 16:42',
    read: true,
  },
  {
    id: '3',
    name: 'Alex Dumitrescu',
    email: 'alex@example.com',
    message:
      'Salut! Am o întrebare legată de firmele de prop recomandate pe site.',
    createdAt: '2026-02-15 09:05',
    read: false,
  },
];

export default function AdminFormularPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(MOCK_MESSAGES);
  const [filter, setFilter] = useState<Filter>('all');

  const toggleRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, read: !msg.read } : msg,
      ),
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'read') return msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Back to admin */}
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>Înapoi la Admin</span>
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <FaEnvelopeOpenText className="h-5 w-5 text-emerald-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Formular Contact
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Vezi mesajele primite din formularul de contact și marchează-le ca{' '}
          <span className="text-emerald-300 font-semibold">Citite</span> sau{' '}
          <span className="text-yellow-300 font-semibold">Necitite</span>.
        </p>
      </div>

      {/* Filters */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-4 md:px-7 md:py-5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <FaFilter className="h-3.5 w-3.5 text-white/50" />
            <span className="uppercase tracking-[0.18em]">
              Filtru mesaje
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900'
                  : 'border border-white/20 bg-white/5 text-white/75 hover:bg-white/10'
              }`}
            >
              Toate
              <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
                {messages.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === 'unread'
                  ? 'bg-yellow-400 text-slate-900'
                  : 'border border-yellow-300/40 bg-yellow-400/10 text-yellow-200 hover:bg-yellow-400/20'
              }`}
            >
              Necitite
              <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
                {messages.filter((m) => !m.read).length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('read')}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === 'read'
                  ? 'bg-emerald-400 text-slate-900'
                  : 'border border-emerald-300/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
              }`}
            >
              Citite
              <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
                {messages.filter((m) => m.read).length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Messages list */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        {filteredMessages.length === 0 ? (
          <p className="text-sm text-white/45">
            Nu există mesaje pentru filtrul selectat.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMessages.map((msg) => (
              <article
                key={msg.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-gradient-to-r from-white/[0.04] to-white/[0.02] px-4 py-3 md:px-5 md:py-4"
              >
                {/* Top row: icon + basic info + status */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/40">
                      {msg.read ? (
                        <FaCheck className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <FaEnvelope className="h-4 w-4 text-yellow-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                          Nume
                        </span>
                        <h2 className="text-sm md:text-base font-semibold text-white">
                          {msg.name}
                        </h2>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-3 gap-y-1 text-[11px]">
                        <div className="flex items-center gap-1 text-white/60">
                          <span className="uppercase tracking-wide text-white/40">
                            Email:
                          </span>
                          <span className="font-mono text-white/75 break-all">
                            {msg.email}
                          </span>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1 text-white/60">
                            <span className="uppercase tracking-wide text-white/40">
                              Telefon:
                            </span>
                            <span>{msg.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-white/50">
                          <span className="uppercase tracking-wide text-white/40">
                            Dată:
                          </span>
                          <span>{msg.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:self-start">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        msg.read
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/40'
                          : 'bg-yellow-400/15 text-yellow-300 border border-yellow-300/60'
                      }`}
                    >
                      {msg.read ? 'Citit' : 'Necitit'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRead(msg.id)}
                      className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
                    >
                      {msg.read ? 'Marchează necitit' : 'Marchează citit'}
                    </button>
                  </div>
                </div>

                {/* Message body */}
                <div className="mt-1 rounded-2xl bg-black/30 border border-white/5 px-3 py-2.5">
                  <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-white/40">
                    Mesaj
                  </span>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

