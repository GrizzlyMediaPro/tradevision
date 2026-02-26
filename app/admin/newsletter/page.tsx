'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaEnvelope, FaUserCheck } from 'react-icons/fa';

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  source?: string;
};

const MOCK_SUBSCRIBERS: Subscriber[] = [
  {
    id: '1',
    email: 'andrei@example.com',
    subscribedAt: '2026-02-10 09:15',
    source: 'Curs Trading',
  },
  {
    id: '2',
    email: 'maria@example.com',
    subscribedAt: '2026-02-12 18:20',
    source: 'Homepage CTA',
  },
  {
    id: '3',
    email: 'alex.trader@example.com',
    subscribedAt: '2026-02-15 13:05',
    source: 'Contact Form',
  },
  {
    id: '4',
    email: 'ioana@example.com',
    subscribedAt: '2026-02-20 08:40',
    source: 'Curs Trading',
  },
];

export default function AdminNewsletterPage() {
  const [subscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const allSelected =
    subscribers.length > 0 &&
    subscribers.every((s) => selectedIds.has(s.id));

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (subscribers.length === 0) return new Set();
      const allSelectedNow =
        subscribers.length > 0 &&
        subscribers.every((s) => prev.has(s.id));
      if (allSelectedNow) {
        return new Set();
      }
      return new Set(subscribers.map((s) => s.id));
    });
  };

  const handleSendEmail = () => {
    if (selectedIds.size === 0) return;
    if (!subject.trim() && !body.trim()) return;
    const selectedEmails = subscribers
      .filter((s) => selectedIds.has(s.id))
      .map((s) => s.email);
    // Doar UI deocamdată – aici vom conecta ulterior trimiterea reală de email
    // eslint-disable-next-line no-console
    console.log('Trimite email către:', selectedEmails, {
      subject,
      body,
    });
    alert(
      `Simulare trimitere email cu subiect:\n"${subject}"\n\nCătre:\n${selectedEmails.join(
        '\n',
      )}`,
    );
  };

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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400/15 border border-orange-300/40">
            <FaUserCheck className="h-5 w-5 text-orange-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Newsletter
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Gestionează abonații la newsletter și pregătește campanii de email
          direct din panoul de administrare.
        </p>
      </div>

      {/* Toolbar: counts + send button */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-4 md:px-7 md:py-5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <div className="inline-flex items-center gap-2">
              <span className="uppercase tracking-[0.18em] text-white/40">
                Abonați
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/85">
                {subscribers.length} total
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300 border border-emerald-400/30">
                {selectedIds.size} selectați
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
            >
              <input
                type="checkbox"
                readOnly
                checked={allSelected}
                className="h-3.5 w-3.5 rounded border-white/40 bg-black/40 accent-emerald-400"
              />
              <span>
                {allSelected ? 'Deselectează toți' : 'Selectează toți'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={selectedIds.size === 0 || (!subject.trim() && !body.trim())}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition cursor-pointer ${
                selectedIds.size === 0 || (!subject.trim() && !body.trim())
                  ? 'border border-white/15 bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 text-slate-900 shadow-[0_12px_30px_rgba(251,191,36,0.45)] hover:brightness-110'
              }`}
            >
              <FaEnvelope className="h-4 w-4" />
              <span>Trimite email</span>
            </button>
          </div>
        </div>
      </section>

      {/* Email composer */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_14px_35px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white">
              Conținut email
            </h2>
            <p className="mt-1 text-[11px] text-white/45 max-w-md">
              Scrie subiectul și mesajul pe care vrei să îl trimiți
              abonaților selectați. Momentan este doar o simulare (nu se
              trimit emailuri reale).
            </p>
          </div>
          <div className="text-[11px] text-white/40">
            <span className="font-semibold text-yellow-300">
              {selectedIds.size}
            </span>{' '}
            destinatari selectați
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              Subiect
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Noutăți Trade Vision & sesiuni live"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-300/70 focus:bg-white/8 focus:ring-1 focus:ring-orange-300/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              Mesaj
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Scrie aici conținutul emailului..."
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-300/70 focus:bg-white/8 focus:ring-1 focus:ring-orange-300/40 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Subscribers list */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        {subscribers.length === 0 ? (
          <p className="text-sm text-white/45">
            Nu există abonați încă. Când utilizatorii se vor înscrie din
            site, vor apărea aici.
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[auto_2.5fr_2fr] gap-4 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/45 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    checked={allSelected}
                    onClick={toggleAll}
                    className="h-3.5 w-3.5 rounded border-white/40 bg-black/40 accent-emerald-400 cursor-pointer"
                  />
                  <span>Select</span>
                </div>
                <span>Email</span>
                <span>Dată &amp; Sursă</span>
              </div>

              <div className="mt-2 flex flex-col divide-y divide-white/5">
                {subscribers.map((sub) => {
                  const checked = selectedIds.has(sub.id);
                  return (
                    <div
                      key={sub.id}
                      className="grid grid-cols-[auto_2.5fr_2fr] gap-4 px-2 py-2.5 items-center"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(sub.id)}
                          className="h-3.5 w-3.5 rounded border-white/40 bg-black/40 accent-emerald-400 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-white/90 break-all">
                          {sub.email}
                        </span>
                      </div>
                      <div className="flex flex-col text-[11px] text-white/60">
                        <span>{sub.subscribedAt}</span>
                        {sub.source && (
                          <span className="text-white/40">
                            Sursă: {sub.source}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3">
              {subscribers.map((sub) => {
                const checked = selectedIds.has(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleOne(sub.id)}
                    className={`flex flex-col gap-2 rounded-2xl border px-3 py-3 text-left transition ${
                      checked
                        ? 'border-emerald-400/50 bg-emerald-500/10'
                        : 'border-white/12 bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="h-4 w-4 rounded border-white/40 bg-black/40 accent-emerald-400"
                        />
                        <span className="font-mono text-[11px] text-white/90 break-all">
                          {sub.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/60">
                      <span>
                        <span className="text-white/40">Dată: </span>
                        {sub.subscribedAt}
                      </span>
                      {sub.source && (
                        <span>
                          <span className="text-white/40">Sursă: </span>
                          {sub.source}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

