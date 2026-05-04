'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FaChevronLeft, FaClock, FaSearch, FaUsers } from 'react-icons/fa';
import {
  getWebinarSettings,
  saveWebinarSettings,
  getWebinarRegistrations,
  type WebinarRegistrationRow,
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

type AdminTab = 'settings' | 'registrations';

const INTERNAL_EMAIL_FRAGMENTS = ['rizon', 'grizzlymediapro', 'platinum'] as const;

/** Înscrieri numărate pentru statistici: fără „test” în câmpuri și fără emailuri interne. */
function isWebinarRegistrationCounted(row: WebinarRegistrationRow): boolean {
  const emailLower = row.email.toLowerCase();
  if (
    INTERNAL_EMAIL_FRAGMENTS.some((frag) => emailLower.includes(frag))
  ) {
    return false;
  }
  const haystack =
    `${row.firstName} ${row.email} ${row.phone}`.toLowerCase();
  if (haystack.includes('test')) {
    return false;
  }
  return true;
}

function rowMatchesRegistrationSearch(
  row: WebinarRegistrationRow,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blob = [row.firstName, row.email, row.phone, row.createdAt]
    .join(' ')
    .toLowerCase();
  return blob.includes(q);
}

export default function AdminWebinarPage() {
  const [tab, setTab] = useState<AdminTab>('settings');
  const [webinarAtInput, setWebinarAtInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [regRows, setRegRows] = useState<WebinarRegistrationRow[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regSearch, setRegSearch] = useState('');

  useEffect(() => {
    getWebinarSettings()
      .then((settings) => {
        setWebinarAtInput(toLocalDateTimeInputValue(settings.webinarAt));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== 'registrations') return;
    setRegLoading(true);
    getWebinarRegistrations()
      .then(setRegRows)
      .catch(() => setRegRows([]))
      .finally(() => setRegLoading(false));
  }, [tab]);

  const countedRegistrations = useMemo(
    () => regRows.filter(isWebinarRegistrationCounted),
    [regRows],
  );

  const filteredRegRows = useMemo(
    () => regRows.filter((row) => rowMatchesRegistrationSearch(row, regSearch)),
    [regRows, regSearch],
  );

  const countedInSearch = useMemo(
    () => filteredRegRows.filter(isWebinarRegistrationCounted).length,
    [filteredRegRows],
  );

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
    <main className="w-full max-w-[1280px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>Inapoi la Admin</span>
        </Link>
      </div>

      <div className="text-center mb-8 md:mb-10">
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
          Setări pentru data webinarului live și lista persoanelor înscrise din
          formularul public.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setTab('settings')}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            tab === 'settings'
              ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-[0_10px_28px_rgba(147,51,234,0.35)]'
              : 'border border-white/15 bg-black/40 text-white/70 hover:border-white/25 hover:text-white'
          }`}
        >
          <FaClock className="h-3.5 w-3.5" />
          Setări
        </button>
        <button
          type="button"
          onClick={() => setTab('registrations')}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            tab === 'registrations'
              ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-[0_10px_28px_rgba(147,51,234,0.35)]'
              : 'border border-white/15 bg-black/40 text-white/70 hover:border-white/25 hover:text-white'
          }`}
        >
          <FaUsers className="h-3.5 w-3.5" />
          Înscriși
        </button>
      </div>

      {tab === 'settings' ? (
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

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-white/45">
                Countdown-ul va expira exact la data selectata.
              </p>
              <button
                type="submit"
                disabled={saving || loading || !webinarAtInput}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Se salveaza...' : 'Salveaza setari'}
              </button>
            </div>

            {savedMessage ? (
              <p className="text-xs text-emerald-300">{savedMessage}</p>
            ) : null}
          </form>
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.07] to-white/[0.02] px-4 py-6 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="min-w-0 flex-1">
              {!regLoading && regRows.length > 0 ? (
                <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                        Persoane înscrise
                      </h2>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                        Numărătoare fără „test” în câmpuri și fără emailuri care
                        conțin rizon, grizzlymediapro sau platinum.
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-stretch gap-3 sm:gap-4">
                      <div className="flex min-w-0 flex-1 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/25 sm:flex-initial">
                        <div className="flex min-w-[5.5rem] flex-1 flex-col justify-center px-4 py-2.5 sm:flex-initial sm:min-w-[6.25rem]">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                            Numărate
                          </span>
                          <span className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
                            {regSearch.trim() ? countedInSearch : countedRegistrations.length}
                          </span>
                        </div>
                        <div className="flex min-w-[5.5rem] flex-1 flex-col justify-center px-4 py-2.5 sm:flex-initial sm:min-w-[6.25rem]">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                            {regSearch.trim() ? 'Rezultate' : 'În listă'}
                          </span>
                          <span className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-white/75 sm:text-2xl">
                            {regSearch.trim() ? filteredRegRows.length : regRows.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <FaSearch
                      className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35"
                      aria-hidden
                    />
                    <input
                      type="search"
                      value={regSearch}
                      onChange={(e) => setRegSearch(e.target.value)}
                      placeholder="Caută după prenume, email, telefon sau dată..."
                      className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-purple-400/45 focus:bg-black/40 focus:ring-1 focus:ring-purple-400/25"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
              ) : (
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
                  Persoane înscrise
                </h2>
              )}

              {regLoading ? (
                <p className="text-sm text-white/50">Se încarcă...</p>
              ) : regRows.length === 0 ? (
                <p className="text-sm text-white/50">
                  Nu există înscrieri momentan.
                </p>
              ) : filteredRegRows.length === 0 ? (
                <p className="text-sm text-white/50">
                  Nicio înscriere nu se potrivește căutării. Încearcă alt termen
                  sau șterge filtrul.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[640px] text-left text-xs text-white/90">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-3 py-3 font-semibold text-white/70">
                          Data
                        </th>
                        <th className="px-3 py-3 font-semibold text-white/70">
                          Prenume
                        </th>
                        <th className="px-3 py-3 font-semibold text-white/70">
                          Email
                        </th>
                        <th className="px-3 py-3 font-semibold text-white/70">
                          Telefon
                        </th>
                        <th className="px-3 py-3 font-semibold text-white/70">
                          Termeni
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                        >
                          <td className="px-3 py-3 whitespace-nowrap text-white/65">
                            {new Date(row.createdAt).toLocaleString('ro-RO', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-3 py-3">{row.firstName}</td>
                          <td className="px-3 py-3 break-all">{row.email}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.phone}</td>
                          <td className="px-3 py-3">
                            {row.acceptedTerms ? 'Da' : 'Nu'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <aside className="w-full shrink-0 lg:max-w-[420px] lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  Înscriere manuală
                </h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                  Formular WebinarJam: adaugă participanți direct la seminar;
                  lista din stânga reflectă înscrierile din site.
                </p>
                <div
                  className="wj-embed-wrapper mt-4 min-h-[200px] rounded-xl bg-white p-2"
                  data-webinar-hash="8wgl3muy"
                >
                  <Script
                    src="https://event.webinarjam.com/register/8wgl3muy/embed-form?formButtonText=Register&formAccentColor=%2329b6f6&formAccentOpacity=0.95&formBgColor=%23ffffff&formBgOpacity=1"
                    strategy="afterInteractive"
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
