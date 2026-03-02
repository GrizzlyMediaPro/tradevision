'use client';

import { useMemo, useState, useEffect, type FormEvent, type DragEvent } from 'react';
import Link from 'next/link';
import { firms } from '../../data/firms';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaTags,
  FaClock,
  FaToggleOn,
  FaToggleOff,
  FaChevronLeft,
} from 'react-icons/fa';
import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  getCarouselSettings,
  setCarouselSettings,
} from '../actions/deals';
import { getFirms } from '../actions/firms';

type Deal = {
  id: string;
  firmSlug?: string;
  logo: string;
  name: string;
  rating: number;
  discount: string;
  code: string;
  fundingUrl?: string;
};

type FormState = {
  mode: 'create' | 'edit';
  editingId: string | null;
  selectedFirmSlug: string | 'manual' | '';
  logo: string;
  name: string;
  rating: string;
  discount: string;
  code: string;
  fundingUrl: string;
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [firmsFromDb, setFirmsFromDb] = useState<{ name: string; slug: string; logo: string; trustScore: number; discount: string; code: string; fundingUrl?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
    mode: 'create',
    editingId: null,
    selectedFirmSlug: '',
    logo: '',
    name: '',
    rating: '4.5',
    discount: '50% Off',
    code: '',
    fundingUrl: '',
  });

  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState(10000);

  useEffect(() => {
    getDeals().then(setDeals).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getFirms().then((list) =>
      setFirmsFromDb(
        list.map((f) => ({
          name: f.name,
          slug: f.slug,
          logo: f.logo,
          trustScore: f.trustScore,
          discount: f.discount,
          code: f.code,
          fundingUrl: f.fundingUrl,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    getCarouselSettings().then((s) => {
      setAutoPlayEnabled(s.autoPlayEnabled);
      setAutoPlayInterval(s.autoPlayInterval);
    });
  }, []);

  const sortedFirms = useMemo(
    () => firmsFromDb.length > 0 ? [...firmsFromDb].sort((a, b) => a.name.localeCompare(b.name)) : [...firms].sort((a, b) => a.name.localeCompare(b.name)),
    [firmsFromDb],
  );

  const resetForm = () => {
    setForm({
      mode: 'create',
      editingId: null,
      selectedFirmSlug: '',
      logo: '',
      name: '',
      rating: '4.5',
      discount: '50% Off',
      code: '',
      fundingUrl: '',
    });
  };

  const handleSelectFirm = (slug: string | 'manual' | '') => {
    const firm = sortedFirms.find((f) => f.slug === slug);
    setForm((prev) => ({
      ...prev,
      selectedFirmSlug: slug,
      logo: firm ? firm.logo : slug === 'manual' ? prev.logo : '',
      name: firm ? firm.name : slug === 'manual' ? prev.name : '',
      rating: firm ? String(firm.trustScore.toFixed(1)) : prev.rating,
      discount: firm ? firm.discount : prev.discount,
      code: firm ? firm.code : prev.code,
      fundingUrl: firm?.fundingUrl ?? prev.fundingUrl,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ratingNum = Math.max(
      0,
      Math.min(5, Number.parseFloat(form.rating || '0')),
    );

    if (!form.name.trim() || !form.logo.trim() || !form.code.trim()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firmSlug:
          form.selectedFirmSlug && form.selectedFirmSlug !== 'manual'
            ? form.selectedFirmSlug
            : undefined,
        logo: form.logo.trim(),
        name: form.name.trim(),
        rating: ratingNum || 0,
        discount: form.discount.trim() || '0% Off',
        code: form.code.trim(),
        fundingUrl: form.fundingUrl.trim() || undefined,
      };
      if (form.mode === 'create') {
        await createDeal(payload);
      } else if (form.mode === 'edit' && form.editingId) {
        await updateDeal(form.editingId, payload);
      }
      const list = await getDeals();
      setDeals(list);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (deal: Deal) => {
    setForm({
      mode: 'edit',
      editingId: deal.id,
      selectedFirmSlug: deal.firmSlug || 'manual',
      logo: deal.logo,
      name: deal.name,
      rating: String(deal.rating.toFixed(1)),
      discount: deal.discount,
      code: deal.code,
      fundingUrl: deal.fundingUrl || '',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeal(id);
      setDeals((prev) => prev.filter((deal) => deal.id !== id));
      if (form.mode === 'edit' && form.editingId === id) {
        resetForm();
      }
    } catch {
      // error
    }
  };

  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      logo: url,
    }));
  };

  const handleIntervalChange = (value: string) => {
    const n = Number.parseInt(value || '0', 10);
    if (Number.isNaN(n) || n <= 0) {
      setAutoPlayInterval(0);
    } else {
      setAutoPlayInterval(n * 1000);
    }
  };

  const handleSaveCarouselSettings = () => {
    setCarouselSettings(autoPlayEnabled, autoPlayInterval);
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/30">
            <FaTags className="h-5 w-5 text-purple-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Deals Carousel
        </h1>
        <div className="mt-3 h-[2px] w-[110px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Creează, editează sau șterge cardurile afișate în deals carousel și
          controlează viteza de auto-slide.
        </p>
      </div>

      {/* Layout: left = form, right = list */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6 md:gap-8 items-stretch">
        {/* Form card */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <span>
                  {form.mode === 'create' ? 'Adaugă deal' : 'Editează deal'}
                </span>
              </h2>
              <p className="mt-1 text-xs text-white/45">
                Poți selecta o firmă existentă sau poți introduce manual datele.
              </p>
            </div>
            {form.mode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaTimes className="h-3 w-3" />
                <span>Renunță editarea</span>
              </button>
            )}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Select firm */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Firmă
              </label>
              <select
                value={form.selectedFirmSlug}
                onChange={(e) =>
                  handleSelectFirm(e.target.value as 'manual' | '' | string)
                }
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40"
              >
                <option value="">Alege o opțiune</option>
                <option value="manual">Introdu manual</option>
                {sortedFirms.map((firm) => (
                  <option key={firm.slug} value={firm.slug}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Logo firmă
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleLogoDrop}
                  className="group rounded-xl border border-dashed border-white/20 bg-black/30 px-4 py-5 text-xs text-white/60 hover:border-purple-400/60 hover:bg-white/5 transition cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="font-medium text-white/70">
                      Drag & drop imaginea aici
                    </span>
                    <span className="text-[11px] text-white/40">
                      (doar UI, upload-ul va fi conectat ulterior)
                    </span>
                    {form.logo && (
                      <div className="mt-3 flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-black/60 overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.logo}
                            alt="Preview logo"
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                        <span className="text-[11px] text-white/45">
                          Imagine selectată
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Nume firmă
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Lucid Trading"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg:white/8 focus:ring-1 focus:ring-purple-400/30"
                  required
                />
              </div>
            </div>

            {/* Rating & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Rating (0 - 5 stele)
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, rating: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg:white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg:white/8 focus:ring-1 focus:ring-purple-400/30"
                />
              </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Discount
                </label>
                <input
                  type="text"
                  value={form.discount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, discount: e.target.value }))
                  }
                  placeholder="Ex: 50% Off"
                  className="rounded-xl border border-white/15 bg:white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg:white/8 focus:ring-1 focus:ring-purple-400/30"
                />
              </div>
            </div>

            {/* Funding URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Link Obține finanțare
              </label>
              <input
                type="text"
                value={form.fundingUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fundingUrl: e.target.value }))
                }
                placeholder="https://link-afiliat..."
                className="rounded-xl border border-white/15 bg:white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg:white/8 focus:ring-1 focus:ring-purple-400/30"
              />
            </div>

            {/* Code */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Cod reducere
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="Ex: MIKE"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg:white/8 focus:ring-1 focus:ring-purple-400/30"
                required
              />
            </div>

            {/* Submit */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-white/40 max-w-xs">
                Modificările sunt doar la nivel de interfață în acest moment.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {form.mode === 'create' ? (
                  <>
                    <FaPlus className="h-4 w-4" />
                    <span>Adaugă deal</span>
                  </>
                ) : (
                  <>
                    <FaEdit className="h-4 w-4" />
                    <span>Salvează modificările</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Right column: existing deals list */}
        <div className="flex flex-col gap-5 md:gap-6">
          {/* Existing deals list */}
          <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-6 py-6 md:px-7 md:py-7 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-sm md:text-base font-semibold text-white">
                Deals existente ({deals.length})
              </h2>
            </div>

            {loading ? (
              <p className="text-sm text-white/45">Se încarcă...</p>
            ) : deals.length === 0 ? (
              <p className="text-sm text-white/45">
                Nu există încă niciun deal. Adaugă unul din formularul din
                stânga.
              </p>
            ) : (
              <div className="mt-1 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/12 bg-gradient-to-r from-white/[0.05] to-white/[0.02] px-4 py-3"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-black/40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={deal.logo}
                        alt={deal.name}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {deal.name}
                        </p>
                        <span className="text-xs font-semibold text-emerald-300 whitespace-nowrap">
                          {deal.discount}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                        <span>{deal.rating.toFixed(1)} / 5★</span>
                        <span className="h-1 w-1 rounded-full bg-white/25" />
                        <span>Cod: {deal.code}</span>
                        {deal.firmSlug && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-white/25" />
                            <span className="uppercase tracking-wide text-white/40">
                              {deal.firmSlug}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(deal)}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/85 hover:bg-white/10 transition cursor-pointer"
                      >
                        <FaEdit className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(deal.id)}
                        className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Autoplay settings - full width under both columns */}
      <section className="mt-6 md:mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-6 md:px-8 md:py-7 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/30">
              <FaClock className="h-4 w-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-white">
                Setări auto-slide carousel
              </h2>
              <p className="text-[11px] text-white/45">
                Controlează viteza sau dezactivează auto-play pentru deals carousel.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutoPlayEnabled((v) => !v)}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
          >
            {autoPlayEnabled ? (
              <>
                <FaToggleOn className="h-4 w-4 text-emerald-400" />
                <span>Auto-play ON</span>
              </>
            ) : (
              <>
                <FaToggleOff className="h-4 w-4 text-white/40" />
                <span>Auto-play OFF</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-white/60">
              Interval auto-slide (secunde)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={autoPlayInterval ? autoPlayInterval / 1000 : ''}
              onChange={(e) => handleIntervalChange(e.target.value)}
              disabled={!autoPlayEnabled}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30 disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col items-start gap-1 text-[11px] text-white/40">
            <p>
              Valoarea actuală:{' '}
              <span className="font-semibold text-yellow-300">
                {autoPlayEnabled
                  ? `${autoPlayInterval / 1000}s`
                  : 'dezactivat'}
              </span>
            </p>
            <button
              type="button"
              onClick={handleSaveCarouselSettings}
              className="mt-2 rounded-full border border-yellow-400/40 bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-200 hover:bg-yellow-500/30"
            >
              Salvează setări carousel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

