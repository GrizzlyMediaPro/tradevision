'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaEnvelope, FaUserCheck } from 'react-icons/fa';
import {
  getNewsletterSubscribers,
  type SubscriberRow,
  sendNewsletterToSubscribers,
} from '../actions/newsletter';
import NewsletterRichEditor from './NewsletterRichEditor';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';

function formatDate(d: Date, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(d));
}

export default function AdminNewsletterPage() {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === 'ro' ? 'ro-RO' : 'en-GB';
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getNewsletterSubscribers().then(setSubscribers).finally(() => setLoading(false));
  }, []);

  const allSelected =
    subscribers.length > 0 &&
    subscribers.every((s) => selectedIds.has(s.id));

  const filteredSubscribers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(query));
  }, [subscribers, searchTerm]);

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

  const handleSendEmail = async () => {
    if (selectedIds.size === 0) return;
    if (!subject.trim() && !bodyText.trim()) return;
    const selectedEmails = subscribers
      .filter((s) => selectedIds.has(s.id))
      .map((s) => s.email);
    try {
      setSending(true);
      await sendNewsletterToSubscribers(selectedEmails, subject, bodyHtml);
      alert(t('admin.newsletter.sent'));
    } catch (err) {
      console.error(err);
      alert(t('admin.newsletter.error.send'));
    } finally {
      setSending(false);
    }
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
          <span>{t('admin.common.back')}</span>
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
          {t('admin.newsletter.title')}
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          {t('admin.newsletter.subtitle')}
        </p>
      </div>

      {/* Toolbar: counts + send button */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-4 md:px-7 md:py-5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <div className="inline-flex items-center gap-2">
              <span className="uppercase tracking-[0.18em] text-white/40">
                {t('admin.newsletter.subscribers')}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/85">
                {t('admin.newsletter.total', { count: subscribers.length })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300 border border-emerald-400/30">
                {t('admin.newsletter.selected', { count: selectedIds.size })}
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
                {allSelected
                  ? t('admin.newsletter.deselectAll')
                  : t('admin.newsletter.selectAll')}
              </span>
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={
                sending || selectedIds.size === 0 || (!subject.trim() && !bodyText.trim())
              }
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition cursor-pointer ${
                sending || selectedIds.size === 0 || (!subject.trim() && !bodyText.trim())
                  ? 'border border-white/15 bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 text-slate-900 shadow-[0_12px_30px_rgba(251,191,36,0.45)] hover:brightness-110'
              }`}
            >
              <FaEnvelope className="h-4 w-4" />
              <span>
                {sending ? t('common.sending') : t('admin.newsletter.send')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Email composer */}
      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_14px_35px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white">
              {t('admin.newsletter.content')}
            </h2>
            <p className="mt-1 text-[11px] text-white/45 max-w-md">
              {t('admin.newsletter.contentHelp')}
            </p>
          </div>
          <div className="text-[11px] text-white/40">
            <span className="font-semibold text-yellow-300">
              {selectedIds.size}
            </span>{' '}
            {t('admin.newsletter.recipients')}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              {t('admin.newsletter.subject')}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('admin.newsletter.subjectPlaceholder')}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-300/70 focus:bg-white/8 focus:ring-1 focus:ring-orange-300/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              {t('admin.newsletter.message')}
            </label>
            <NewsletterRichEditor
              value={bodyHtml}
              onChange={(nextHtml, nextText) => {
                setBodyHtml(nextHtml);
                setBodyText(nextText);
              }}
            />
            <p className="text-[11px] text-white/40">
              {t('admin.newsletter.editorHelp')}
            </p>
          </div>
        </div>
      </section>

      {/* Subscribers list */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-5 md:px-7 md:py-6 shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
            {t('admin.newsletter.search')}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('admin.newsletter.searchPlaceholder')}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-300/70 focus:bg-white/8 focus:ring-1 focus:ring-orange-300/40"
          />
        </div>
        {loading ? (
          <p className="text-sm text-white/45">{t('admin.common.loading')}</p>
        ) : subscribers.length === 0 ? (
          <p className="text-sm text-white/45">
            {t('admin.newsletter.empty')}
          </p>
        ) : filteredSubscribers.length === 0 ? (
          <p className="text-sm text-white/45">
            {t('admin.newsletter.noResults')}
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
                  <span>{t('admin.newsletter.select')}</span>
                </div>
                <span>{t('admin.common.email')}</span>
                <span>{t('admin.newsletter.dateSource')}</span>
              </div>

              <div className="mt-2 flex flex-col divide-y divide-white/5">
                {filteredSubscribers.map((sub) => {
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
                        <span>{formatDate(sub.subscribedAt, dateLocale)}</span>
                        {sub.source && (
                          <span className="text-white/40">
                            {t('admin.newsletter.source', { source: sub.source })}
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
              {filteredSubscribers.map((sub) => {
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
                        <span className="text-white/40">
                          {t('admin.newsletter.dateLabel')}{' '}
                        </span>
                        {formatDate(sub.subscribedAt, dateLocale)}
                      </span>
                      {sub.source && (
                        <span>
                          <span className="text-white/40">
                            {t('admin.newsletter.sourceLabel')}{' '}
                          </span>
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

