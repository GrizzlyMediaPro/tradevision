'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaChevronLeft,
  FaBuilding,
  FaPlus,
  FaTrash,
  FaEdit,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import {
  type FirmDetail,
  type Challenge,
  type PayoutStep,
  type RuleTab,
  platformImages,
} from '../../data/firms';
import { getFirms, createOrUpdateFirm, deleteFirm } from '../actions/firms';
import { UploadButton } from '@/lib/uploadthing';
import Flag from 'react-world-flags';
import { useT } from '@/lib/i18n/I18nProvider';

const PAYMENT_LABELS: Record<string, string> = {
  'Credit Card': 'admin.firms.pay.card',
  'Debit Card': 'admin.firms.pay.debit',
  Crypto: 'admin.firms.pay.crypto',
  'Bank Transfer': 'admin.firms.pay.bank',
  PayPal: 'admin.firms.pay.paypal',
};

/* ─── constants ─── */

const AVAILABLE_PLATFORMS = Object.keys(platformImages);
const COMMON_PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Crypto',
  'Bank Transfer',
  'PayPal',
];

/* ─── helpers ─── */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const emptyChallenge: Challenge = {
  accountType: '',
  accountColor: 'purple',
  size: '',
  activation: '$0',
  fee: '',
  trueCost: '',
  target: '',
  drawdown: '',
  type: 'Rapid',
};

const emptyPayoutStep: PayoutStep = { title: '', description: '' };

const emptyFeature = { label: '', value: 'YES', enabled: true };

/* ─── section toggle helper ─── */
type SectionId =
  | 'basic'
  | 'details'
  | 'platforms'
  | 'features'
  | 'challenges'
  | 'payout'
  | 'countries';

/* ─── component ─── */
export default function AdminFirmePage() {
  const t = useT();
  /* ── firms state ── */
  const [firmsList, setFirmsList] = useState<FirmDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  /* ── form state ── */
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [fundingUrl, setFundingUrl] = useState('');
  const [description, setDescription] = useState('');
  const [payout, setPayout] = useState('');
  const [country, setCountry] = useState('');
  const [flag, setFlag] = useState('');
  const [trustScore, setTrustScore] = useState('4.5');
  const [activeYears, setActiveYears] = useState('1');
  const [maxAccounts, setMaxAccounts] = useState('5');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [keyFeatures, setKeyFeatures] = useState<
    { label: string; value: string; enabled: boolean }[]
  >([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeTypes, setChallengeTypes] = useState<string[]>([]);
  const [newChallengeType, setNewChallengeType] = useState('');
  const [payoutTimeline, setPayoutTimeline] = useState<PayoutStep[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [excludedInput, setExcludedInput] = useState('');

  /* ── section toggles ── */
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    basic: true,
    details: true,
    platforms: false,
    features: false,
    challenges: false,
    payout: false,
    countries: false,
  });

  const toggleSection = (id: SectionId) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ── load firms from DB ── */
  useEffect(() => {
    let cancelled = false;
    getFirms()
      .then((list) => {
        if (!cancelled) setFirmsList(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── reset form ── */
  const resetForm = () => {
    setEditingSlug(null);
    setName('');
    setLogo('');
    setWebsite('');
    setFundingUrl('');
    setDescription('');
    setPayout('');
    setCountry('');
    setFlag('');
    setTrustScore('4.5');
    setActiveYears('1');
    setMaxAccounts('5');
    setCode('');
    setDiscount('');
    setPlatforms([]);
    setPaymentMethods([]);
    setKeyFeatures([]);
    setChallenges([]);
    setChallengeTypes([]);
    setNewChallengeType('');
    setPayoutTimeline([]);
    setExcludedCountries([]);
    setExcludedInput('');
  };

  /* ── load firm into form ── */
  const loadFirmIntoForm = (firm: FirmDetail) => {
    setEditingSlug(firm.slug);
    setName(firm.name);
    setLogo(firm.logo);
    setWebsite(firm.website);
    setFundingUrl(firm.fundingUrl || '');
    setDescription(firm.description);
    setPayout(firm.payout);
    setCountry(firm.country);
    setFlag(firm.flag);
    setTrustScore(String(firm.trustScore));
    setActiveYears(String(firm.activeYears));
    setMaxAccounts(firm.maxAccounts);
    setCode(firm.code);
    setDiscount(firm.discount);
    setPlatforms([...firm.platforms]);
    setPaymentMethods([...firm.paymentMethods]);
    setKeyFeatures(firm.keyFeatures.map((f) => ({ ...f })));
    setChallenges(firm.challenges.map((c) => ({ ...c })));
    const typesFromChallenges = Array.from(
      new Set(
        firm.challenges
          .map((c) => (c.type ?? 'Rapid').trim())
          .filter((t) => t.length > 0),
      ),
    );
    setChallengeTypes(typesFromChallenges);
    setNewChallengeType('');
    setPayoutTimeline(firm.payoutTimeline.map((p) => ({ ...p })));
    setExcludedCountries([...firm.excludedCountries]);
    setExcludedInput('');
    // Open all sections when editing
    setOpenSections({
      basic: true,
      details: true,
      platforms: true,
      features: true,
      challenges: true,
      payout: true,
      countries: true,
    });
  };

  /* ── submit ── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

  const countryCode = country.trim().toUpperCase();

    const firm: FirmDetail = {
      name: trimmedName,
      slug: editingSlug || slugify(trimmedName),
      logo,
      payout: payout.trim(),
      country: countryCode,
      flag: countryCode,
      platforms,
      trustScore: parseFloat(trustScore) || 0,
      activeYears: parseInt(activeYears) || 0,
      maxAccounts: maxAccounts.trim(),
      code: code.trim(),
      discount: discount.trim(),
      website: website.trim(),
      fundingUrl: fundingUrl.trim(),
      description: description.trim(),
      paymentMethods,
      keyFeatures,
      challenges,
    payoutTimeline,
      excludedCountries,
    };

    setSaving(true);
    try {
      await createOrUpdateFirm(firm, editingSlug);
      const list = await getFirms();
      setFirmsList(list);
      resetForm();
    } catch {
      // error could be shown in UI
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ── */
  const handleDelete = async (slug: string) => {
    try {
      await deleteFirm(slug);
      setFirmsList((prev) => prev.filter((f) => f.slug !== slug));
      if (editingSlug === slug) resetForm();
    } catch {
      // error could be shown in UI
    }
  };

  /* ── platform toggle ── */
  const togglePlatform = (p: string) =>
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  /* ── payment toggle ── */
  const togglePayment = (m: string) =>
    setPaymentMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  /* ── excluded countries ── */
  const addExcludedCountry = () => {
    const trimmed = excludedInput.trim().toUpperCase();
    if (trimmed && !excludedCountries.includes(trimmed)) {
      setExcludedCountries((prev) => [...prev, trimmed]);
    }
    setExcludedInput('');
  };

  /* ── challenge types helpers ── */
  const addChallengeType = () => {
    const trimmed = newChallengeType.trim();
    if (!trimmed) return;
    setChallengeTypes((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });
    setNewChallengeType('');
  };


  /* ─── Section Header Component ─── */
  function SectionHeader({
    id,
    title,
    count,
  }: {
    id: SectionId;
    title: string;
    count?: number;
  }) {
    return (
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:bg-white/8 transition cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-[10px] font-medium text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        {openSections[id] ? (
          <FaChevronUp className="h-3 w-3" />
        ) : (
          <FaChevronDown className="h-3 w-3" />
        )}
      </button>
    );
  }

  /* ─── input class ─── */
  const inputCls =
    'rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-sky-400/60 focus:bg-white/8 focus:ring-1 focus:ring-sky-400/30';
  const labelCls = 'text-xs font-medium uppercase tracking-wider text-white/60';

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {/* Back */}
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/15 border border-sky-400/30">
            <FaBuilding className="h-5 w-5 text-sky-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          {t('admin.firms.title')}
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          {t('admin.firms.subtitle')}
        </p>
      </div>

      {/* Grid: form | firms list */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 md:gap-8 items-start">
        {/* ── FORM ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-linear-to-b from-white/7 to-white/2 px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm flex flex-col gap-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                {editingSlug ? t('admin.firms.edit') : t('admin.firms.add')}
              </h2>
              <p className="mt-1 text-xs text-white/45">
                {t('admin.firms.formHelp')}
              </p>
            </div>
            {editingSlug && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaTimes className="h-3 w-3" /> {t('admin.firms.cancelEdit')}
              </button>
            )}
          </div>

          {/* ── 1. Basic Info ── */}
          <SectionHeader id="basic" title={t('admin.firms.section.basic')} />
          {openSections.basic && (
            <div className="flex flex-col gap-4 pl-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('admin.firms.namePlaceholder')}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.website')}</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.funding')}</label>
                  <input
                    type="text"
                    value={fundingUrl}
                    onChange={(e) => setFundingUrl(e.target.value)}
                    placeholder={t('admin.firms.fundingPlaceholder')}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Logo upload */}
              <div className="flex flex-col gap-2">
                <label className={labelCls}>{t('admin.firms.logo')}</label>
                <div
                  className="group relative flex h-28 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 text-xs text-white/60 hover:border-sky-400/60 hover:bg-white/5 transition cursor-pointer"
                >
                  {!logo ? (
                    <div className="flex flex-col items-center gap-2">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          const url =
                            res?.[0]?.serverData?.url ??
                            res?.[0]?.ufsUrl ??
                            res?.[0]?.url;
                          if (url && typeof url === 'string') {
                            setLogo(url);
                          }
                        }}
                        onUploadError={() => {
                          // optional: show error toast
                        }}
                        appearance={{
                          button:
                            'inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-110 transition',
                          container: 'flex flex-col items-center gap-2',
                          allowedContent:
                            'text-[11px] text-white/40 mt-1 text-center',
                        }}
                      />
                      <span className="text-[11px] text-white/45 text-center">
                        {t('admin.firms.uploadHint')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-14 w-14 rounded-md bg-black/60 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo}
                          alt={t('admin.firms.logoAlt')}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogo('')}
                        className="text-[10px] text-red-300 hover:text-red-200 transition"
                      >
                        {t('admin.firms.remove')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className={labelCls}>{t('admin.firms.description')}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('admin.firms.descriptionPlaceholder')}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          )}

          {/* ── 2. Details ── */}
          <SectionHeader id="details" title={t('admin.firms.section.details')} />
          {openSections.details && (
            <div className="flex flex-col gap-4 pl-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.country')}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="US"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.payout')}</label>
                  <input
                    type="text"
                    value={payout}
                    onChange={(e) => setPayout(e.target.value)}
                    placeholder={t('admin.firms.payoutPlaceholder')}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.trust')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={trustScore}
                    onChange={(e) => setTrustScore(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.years')}</label>
                  <input
                    type="number"
                    min="0"
                    value={activeYears}
                    onChange={(e) => setActiveYears(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.maxAccounts')}</label>
                  <input
                    type="text"
                    value={maxAccounts}
                    onChange={(e) => setMaxAccounts(e.target.value)}
                    placeholder="5"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.discount')}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="40"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.discountCode')}</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MIKE"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>{t('admin.firms.flag')}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/30 px-3 py-2.5 text-xs text-white/60">
                    {country.trim().length === 2 ? (
                      <>
                        <Flag
                          code={country.trim().toUpperCase()}
                          style={{ width: 32, height: 20, borderRadius: 4 }}
                        />
                        <span className="text-[10px] text-white/45">
                          {t('admin.firms.flagAuto')}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-white/45">
                        {t('admin.firms.flagHint')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 3. Platforms & Payment ── */}
          <SectionHeader
            id="platforms"
            title={t('admin.firms.section.platforms')}
          />
          {openSections.platforms && (
            <div className="flex flex-col gap-4 pl-1">
              <div className="flex flex-col gap-2">
                <label className={labelCls}>{t('admin.firms.platforms')}</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer border ${
                        platforms.includes(p)
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                          : 'bg-white/5 text-white/60 border-white/15 hover:bg-white/10'
                      }`}
                    >
                      {platformImages[p] && (
                        <Image
                          src={platformImages[p]}
                          alt={p}
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5 object-contain"
                          unoptimized
                        />
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelCls}>{t('admin.firms.payments')}</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => togglePayment(m)}
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer border ${
                        paymentMethods.includes(m)
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                          : 'bg-white/5 text-white/60 border-white/15 hover:bg-white/10'
                      }`}
                    >
                      {t(PAYMENT_LABELS[m] ?? m)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 4. Key Features ── */}
          <SectionHeader
            id="features"
            title={t('admin.firms.section.features')}
            count={keyFeatures.length}
          />
          {openSections.features && (
            <div className="flex flex-col gap-3 pl-1">
              {keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2.5"
                >
                  <input
                    type="text"
                    value={feat.label}
                    onChange={(e) => {
                      const updated = [...keyFeatures];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setKeyFeatures(updated);
                    }}
                    placeholder={t('admin.firms.featurePlaceholder')}
                    className="flex-1 min-w-[120px] rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...keyFeatures];
                      updated[idx] = {
                        ...updated[idx],
                        enabled: !updated[idx].enabled,
                        value: !updated[idx].enabled ? 'YES' : 'NO',
                      };
                      setKeyFeatures(updated);
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition cursor-pointer ${
                      feat.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-red-500/20 text-red-300 border border-red-400/40'
                    }`}
                  >
                    {feat.enabled ? (
                      <FaCheckCircle className="h-2.5 w-2.5" />
                    ) : (
                      <FaTimesCircle className="h-2.5 w-2.5" />
                    )}
                    {feat.enabled
                      ? t('admin.common.yesToken')
                      : t('admin.common.noToken')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setKeyFeatures((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="rounded-full border border-red-500/40 bg-red-500/10 p-1.5 text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                  >
                    <FaTrash className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setKeyFeatures((prev) => [...prev, { ...emptyFeature }])
                }
                className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaPlus className="h-2.5 w-2.5" /> {t('admin.firms.addFeature')}
              </button>
            </div>
          )}

          {/* ── 5. Challenges ── */}
          <SectionHeader
            id="challenges"
            title={t('admin.firms.section.challenges')}
            count={challenges.length}
          />
          {openSections.challenges && (
            <div className="flex flex-col gap-4 pl-1">
              {/* Add challenge type */}
              <div className="flex flex-col gap-2 rounded-xl border border-dashed border-white/20 bg-black/30 px-3 py-3">
                <label className={labelCls}>{t('admin.firms.addType')}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newChallengeType}
                    onChange={(e) => setNewChallengeType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChallengeType();
                      }
                    }}
                    placeholder={t('admin.firms.typePlaceholder')}
                    className={`${inputCls} sm:flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addChallengeType}
                    disabled={!newChallengeType.trim()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <FaPlus className="h-2.5 w-2.5" /> {t('admin.firms.addTypeButton')}
                  </button>
                </div>
                <p className="text-[10px] text-white/40">
                  {t('admin.firms.typeHelp')}
                </p>
              </div>

              {/* No types yet */}
              {challengeTypes.length === 0 && (
                <p className="text-xs text-white/45">
                  {t('admin.firms.noTypes')}
                </p>
              )}

              {/* Types with their challenges */}
              {challengeTypes.map((typeName, typeIdx) => {
                const challengesForType = challenges
                  .map((ch, idx) => ({ ch, idx }))
                  .filter(
                    ({ ch }) => (ch.type ?? 'Rapid') === typeName,
                  );

                return (
                  <div
                    key={typeName || typeIdx}
                    className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-white/3 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                          {t('admin.firms.typeLabel')}
                        </span>
                        <input
                          type="text"
                          value={typeName}
                          onChange={(e) => {
                            const value = e.target.value;
                            const oldName = typeName;
                            setChallengeTypes((prev) => {
                              const next = [...prev];
                              next[typeIdx] = value;
                              return next;
                            });
                            const trimmed = value.trim();
                            if (!trimmed) return;
                            setChallenges((prev) =>
                              prev.map((ch) =>
                                (ch.type ?? 'Rapid') === oldName
                                  ? { ...ch, type: trimmed }
                                  : ch,
                              ),
                            );
                          }}
                          placeholder={t('admin.firms.typeExample')}
                          className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                        />
                        <span className="text-[10px] text-white/40">
                          {t('admin.firms.accountCount', {
                            count: challengesForType.length,
                          })}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nameToRemove = typeName;
                          setChallengeTypes((prev) =>
                            prev.filter((_, i) => i !== typeIdx),
                          );
                          setChallenges((prev) =>
                            prev.filter(
                              (ch) => (ch.type ?? 'Rapid') !== nameToRemove,
                            ),
                          );
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                      >
                        <FaTrash className="h-2.5 w-2.5" />
                        {t('admin.firms.deleteType')}
                      </button>
                    </div>

                    {challengesForType.length === 0 && (
                      <p className="text-[11px] text-white/45">
                        {t('admin.firms.noAccounts')}
                      </p>
                    )}

                    {challengesForType.map(({ ch, idx }) => {
                      const rulesForChallenge = ch.rules ?? [];
                      return (
                        <div
                          key={idx}
                          className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                              {t('admin.firms.challengeNumber', { n: idx + 1 })}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setChallenges((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                              className="rounded-full border border-red-500/40 bg-red-500/10 p-1 text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                            >
                              <FaTrash className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <input
                              type="text"
                              value={ch.accountType}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  accountType: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.accountType')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <select
                              value={ch.accountColor}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  accountColor: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-sky-400/50 cursor-pointer [&>option]:bg-zinc-900"
                            >
                              <option value="purple">{t('admin.firms.color.purple')}</option>
                              <option value="emerald">{t('admin.firms.color.emerald')}</option>
                              <option value="sky">{t('admin.firms.color.sky')}</option>
                              <option value="yellow">{t('admin.firms.color.yellow')}</option>
                            </select>
                            <input
                              type="text"
                              value={ch.size}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  size: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.size')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <input
                              type="text"
                              value={ch.activation}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  activation: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.activation')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <input
                              type="text"
                              value={ch.fee}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  fee: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.fee')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <input
                              type="text"
                              value={ch.trueCost}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  trueCost: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.trueCost')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <input
                              type="text"
                              value={ch.target}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  target: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.target')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                            <input
                              type="text"
                              value={ch.drawdown}
                              onChange={(e) => {
                                const updated = [...challenges];
                                updated[idx] = {
                                  ...updated[idx],
                                  drawdown: e.target.value,
                                };
                                setChallenges(updated);
                              }}
                              placeholder={t('admin.firms.drawdown')}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                            />
                          </div>

                          {/* Rules per challenge */}
                          <div className="mt-2 flex flex-col gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                              {t('admin.firms.rules')}
                            </span>
                            {rulesForChallenge.map((rule, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={rule.label}
                                    onChange={(e) => {
                                      const updated = [...challenges];
                                      const current = { ...updated[idx] };
                                      const innerRules = [
                                        ...(current.rules ?? []),
                                      ];
                                      innerRules[rIdx] = {
                                        ...innerRules[rIdx],
                                        label: e.target.value,
                                      };
                                      current.rules = innerRules;
                                      updated[idx] = current;
                                      setChallenges(updated);
                                    }}
                                    placeholder={t('admin.firms.ruleTitle')}
                                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...challenges];
                                      const current = { ...updated[idx] };
                                      const innerRules = [
                                        ...(current.rules ?? []),
                                      ];
                                      current.rules = innerRules.filter(
                                        (_, i) => i !== rIdx,
                                      );
                                      updated[idx] = current;
                                      setChallenges(updated);
                                    }}
                                    className="rounded-full border border-red-500/40 bg-red-500/10 p-1.5 text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                                  >
                                    <FaTrash className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                                <textarea
                                  rows={3}
                                  value={rule.content.join('\n')}
                                  onChange={(e) => {
                                    const updated = [...challenges];
                                    const current = { ...updated[idx] };
                                    const innerRules = [
                                      ...(current.rules ?? []),
                                    ];
                                    innerRules[rIdx] = {
                                      ...innerRules[rIdx],
                                      content: e.target.value.split('\n'),
                                    };
                                    current.rules = innerRules;
                                    updated[idx] = current;
                                    setChallenges(updated);
                                  }}
                                  placeholder={t('admin.firms.ruleContent')}
                                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] text-white placeholder-white/30 outline-none focus:border-sky-400/50 resize-none font-mono"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...challenges];
                                const current = { ...updated[idx] };
                                const innerRules = [...(current.rules ?? [])];
                                innerRules.push({ label: '', content: [] });
                                current.rules = innerRules;
                                updated[idx] = current;
                                setChallenges(updated);
                              }}
                              className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                            >
                              <FaPlus className="h-2.5 w-2.5" /> {t('admin.firms.addRule')}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setChallenges((prev) => [
                          ...prev,
                          { ...emptyChallenge, type: typeName },
                        ])
                      }
                      className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                    >
                      <FaPlus className="h-2.5 w-2.5" /> {t('admin.firms.addChallenge')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── 6. Payout Timeline ── */}
          <SectionHeader
            id="payout"
            title={t('admin.firms.section.payout')}
            count={payoutTimeline.length}
          />
          {openSections.payout && (
            <div className="flex flex-col gap-3 pl-1">
              {payoutTimeline.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2.5"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 border border-sky-400/30 text-[10px] font-bold text-sky-300 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...payoutTimeline];
                        updated[idx] = {
                          ...updated[idx],
                          title: e.target.value,
                        };
                        setPayoutTimeline(updated);
                      }}
                      placeholder={t('admin.firms.stepTitle')}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                    />
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => {
                        const updated = [...payoutTimeline];
                        updated[idx] = {
                          ...updated[idx],
                          description: e.target.value,
                        };
                        setPayoutTimeline(updated);
                      }}
                      placeholder={t('admin.firms.stepDescription')}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPayoutTimeline((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="mt-1 rounded-full border border-red-500/40 bg-red-500/10 p-1.5 text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                  >
                    <FaTrash className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPayoutTimeline((prev) => [
                    ...prev,
                    { ...emptyPayoutStep },
                  ])
                }
                className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaPlus className="h-2.5 w-2.5" /> {t('admin.firms.addStep')}
              </button>
            </div>
          )}

          {/* ── 7. Excluded Countries ── */}
          <SectionHeader
            id="countries"
            title={t('admin.firms.section.countries')}
            count={excludedCountries.length}
          />
          {openSections.countries && (
            <div className="flex flex-col gap-3 pl-1">
              <div className="flex flex-wrap gap-1.5">
                {excludedCountries.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-medium text-white/60"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() =>
                        setExcludedCountries((prev) =>
                          prev.filter((x) => x !== c),
                        )
                      }
                      className="text-red-300 hover:text-red-200 transition cursor-pointer ml-0.5"
                    >
                      <FaTimes className="h-2 w-2" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={excludedInput}
                  onChange={(e) => setExcludedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addExcludedCountry();
                    }
                  }}
                  placeholder={t('admin.firms.countryPlaceholder')}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-sky-400/50 w-36"
                />
                <button
                  type="button"
                  onClick={addExcludedCountry}
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                >
                  <FaPlus className="h-2.5 w-2.5" /> {t('admin.common.add')}
                </button>
              </div>
              <p className="text-[10px] text-white/40">
                {t('admin.firms.countryHelp')}
              </p>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <p className="text-[11px] text-white/40 max-w-xs">
              {t('admin.firms.savedNote')}
            </p>
            <button
              type="submit"
              disabled={!name.trim() || saving}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {editingSlug ? (
                <>
                  <FaEdit className="h-4 w-4" />
                  <span>{t('admin.firms.save')}</span>
                </>
              ) : (
                <>
                  <FaPlus className="h-4 w-4" />
                  <span>{t('admin.firms.add')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── FIRMS LIST ── */}
        <section className="flex flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/5 to-white/2 px-6 py-6 md:px-7 md:py-7 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm md:text-base font-semibold text-white">
              {t('admin.firms.existing', { count: firmsList.length })}
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-white/45">{t('admin.common.loading')}</p>
          ) : firmsList.length === 0 ? (
            <p className="text-sm text-white/45">
              {t('admin.firms.empty')}
            </p>
          ) : (
            <div className="mt-1 flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1">
              {firmsList.map((firm) => (
                <div
                  key={firm.slug}
                  className={`flex items-start gap-4 rounded-2xl border bg-linear-to-r from-white/5 to-white/2 px-4 py-3 transition ${
                    editingSlug === firm.slug
                      ? 'border-sky-400/50 ring-1 ring-sky-400/20'
                      : 'border-white/12'
                  }`}
                >
                  {/* Logo */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/40">
                    {firm.logo ? (
                      firm.logo.startsWith('blob:') ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={firm.logo}
                          alt={firm.name}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <Image
                          src={firm.logo}
                          alt={firm.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                          unoptimized
                        />
                      )
                    ) : (
                      <FaBuilding className="h-5 w-5 text-white/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {firm.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < Math.round(firm.trustScore)
                                ? 'text-yellow-400'
                                : 'text-white/20'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-[10px] text-white/50">
                          {firm.trustScore}
                        </span>
                      </span>
                      <span className="text-[10px] text-white/40">|</span>
                      <span className="text-[10px] text-white/50">
                        {firm.country}
                      </span>
                      <span className="text-[10px] text-white/40">|</span>
                      <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
                        {firm.discount}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="text-[9px] text-white/40">
                        {t('admin.firms.challengesCount', {
                          count: firm.challenges.length,
                        })}
                      </span>
                      <span className="text-[9px] text-white/30">·</span>
                      <span className="text-[9px] text-white/40">
                        {t('admin.firms.platformsCount', {
                          count: firm.platforms.length,
                        })}
                      </span>
                      <span className="text-[9px] text-white/30">·</span>
                      <span className="text-[9px] text-white/40">
                        {t('admin.firms.ruleTabs', {
                          count: firm.challenges.reduce(
                            (sum, ch) => sum + (ch.rules?.length ?? 0),
                            0,
                          ),
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadFirmIntoForm(firm)}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/85 hover:bg-white/10 transition cursor-pointer"
                    >
                      <FaEdit className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(firm.slug)}
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
    </main>
  );
}
