'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaEnvelopeOpenText,
  FaFilter,
  FaCheck,
  FaEnvelope,
} from 'react-icons/fa';
import {
  getContactMessages,
  toggleContactMessageRead,
  type ContactMessageRow,
} from '../actions/contact';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';

type Filter = 'all' | 'read' | 'unread';

function formatDate(d: Date, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(d));
}

export default function AdminFormularPage() {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === 'ro' ? 'ro-RO' : 'en-GB';
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    getContactMessages().then(setMessages).finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id: string) => {
    await toggleContactMessageRead(id);
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
          <span>{t('admin.common.back')}</span>
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
          {t('admin.contact.title')}
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          {t('admin.contact.subtitle.before')}{' '}
          <span className="text-emerald-300 font-semibold">
            {t('admin.contact.readWord')}
          </span>{' '}
          {t('admin.contact.or')}{' '}
          <span className="text-yellow-300 font-semibold">
            {t('admin.contact.unreadWord')}
          </span>
          .
        </p>
      </div>

      {/* Filters */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-4 md:px-7 md:py-5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <FaFilter className="h-3.5 w-3.5 text-white/50" />
            <span className="uppercase tracking-[0.18em]">
              {t('admin.contact.filter')}
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
              {t('admin.contact.all')}
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
              {t('admin.contact.unread')}
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
              {t('admin.contact.read')}
              <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
                {messages.filter((m) => m.read).length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Messages list */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        {loading ? (
          <p className="text-sm text-white/45">{t('admin.common.loading')}</p>
        ) : filteredMessages.length === 0 ? (
          <p className="text-sm text-white/45">
            {t('admin.contact.empty')}
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
                          {t('admin.common.name')}
                        </span>
                        <h2 className="text-sm md:text-base font-semibold text-white">
                          {msg.name}
                        </h2>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-3 gap-y-1 text-[11px]">
                        <div className="flex items-center gap-1 text-white/60">
                          <span className="uppercase tracking-wide text-white/40">
                            {t('admin.common.email')}:
                          </span>
                          <span className="font-mono text-white/75 break-all">
                            {msg.email}
                          </span>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1 text-white/60">
                            <span className="uppercase tracking-wide text-white/40">
                              {t('admin.common.phone')}:
                            </span>
                            <span>{msg.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-white/50">
                          <span className="uppercase tracking-wide text-white/40">
                            {t('admin.contact.dateLabel')}
                          </span>
                          <span>{formatDate(msg.createdAt, dateLocale)}</span>
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
                      {msg.read
                        ? t('admin.contact.readBadge')
                        : t('admin.contact.unreadBadge')}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRead(msg.id)}
                      className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
                    >
                      {msg.read
                        ? t('admin.contact.markUnread')
                        : t('admin.contact.markRead')}
                    </button>
                  </div>
                </div>

                {/* Message body */}
                <div className="mt-1 rounded-2xl bg-black/30 border border-white/5 px-3 py-2.5">
                  <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {t('admin.contact.message')}
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

