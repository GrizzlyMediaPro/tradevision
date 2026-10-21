'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaPen } from 'react-icons/fa';
import { getLinkWidget, saveLinkWidget } from '../actions/linkwidget';
import { UploadDropzone } from '@/lib/uploadthing';
import { useT } from '@/lib/i18n/I18nProvider';

type LinkWidgetState = {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  thumbnail: string;
  youtubeUrl?: string;
};

const DEFAULT_STATE: LinkWidgetState = {
  badge: 'Live Trading',
  title: 'Watch Us Trade Live on YouTube',
  description:
    'Alătură-te live-urilor Trade Vision pentru sesiuni de day trading, Q&A și analiză de piață în timp real.',
  buttonText: 'Watch Stream',
  thumbnail: '/thumbnail.png',
};

export default function AdminLinkWidgetPage() {
  const t = useT();
  const [values, setValues] = useState<LinkWidgetState>(DEFAULT_STATE);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    DEFAULT_STATE.thumbnail,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLinkWidget().then((data) => {
      setValues(data);
      // Nu salva URL-uri blob în DB – nu funcționează pe homepage; folosim default dacă e blob
      const thumb = data.thumbnail || DEFAULT_STATE.thumbnail;
      setThumbnailPreview(
        thumb.startsWith('blob:') ? DEFAULT_STATE.thumbnail : thumb,
      );
    }).finally(() => setLoading(false));
  }, []);

  const handleChange =
    (key: keyof LinkWidgetState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [key]: e.target.value };
      setValues(next);
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Trimite doar URL-uri reale (nu blob:) ca pe homepage să se vadă thumbnail-ul
      const thumbnailToSave = thumbnailPreview.startsWith('blob:')
        ? DEFAULT_STATE.thumbnail
        : thumbnailPreview;
      await saveLinkWidget({ ...values, thumbnail: thumbnailToSave });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues(DEFAULT_STATE);
    setThumbnailPreview(DEFAULT_STATE.thumbnail);
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/30">
            <FaPen className="h-5 w-5 text-purple-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          {t('admin.link.title')}
        </h1>
        <div className="mt-3 h-[2px] w-[130px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          {t('admin.link.subtitle')}
        </p>
      </div>

      {/* Layout: left = form, right = live preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6 md:gap-8 items-start">
        {/* Form card */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.07] to-white/2 px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <span>{t('admin.link.configTitle')}</span>
              </h2>
              <p className="mt-1 text-xs text-white/45">
                {t('admin.link.configHelp')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
            >
              {t('admin.link.resetDefault')}
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Badge + Button text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  {t('admin.link.badge')}
                </label>
                <input
                  type="text"
                  value={values.badge}
                  onChange={handleChange('badge')}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  {t('admin.link.buttonText')}
                </label>
                <input
                  type="text"
                  value={values.buttonText}
                  onChange={handleChange('buttonText')}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
                />
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t('admin.link.heading')}
              </label>
              <input
                type="text"
                value={values.title}
                onChange={handleChange('title')}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t('admin.link.description')}
              </label>
              <textarea
                rows={4}
                value={values.description}
                onChange={handleChange('description')}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30 resize-none"
              />
            </div>

            {/* YouTube URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t('admin.link.youtube')}
              </label>
              <input
                type="url"
                value={values.youtubeUrl ?? ''}
                onChange={handleChange('youtubeUrl')}
                placeholder="https://www.youtube.com/watch?v=..."
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
              />
              <p className="text-[11px] text-white/40">
                {t('admin.link.youtubeHelp')}
              </p>
            </div>

            {/* Thumbnail upload (UploadThing – URL permanent, nu blob) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                {t('admin.link.thumbnail')}
              </label>
              {thumbnailPreview && !thumbnailPreview.startsWith('blob:') ? (
                <div className="flex flex-col gap-3">
                  <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl border border-white/15 bg-black/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
                      alt={t('admin.link.thumbnailAlt')}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const url =
                        res?.[0]?.serverData?.url ??
                        res?.[0]?.ufsUrl ??
                        (res?.[0] as { url?: string })?.url;
                      if (url && typeof url === 'string') {
                        setThumbnailPreview(url);
                      }
                    }}
                    onUploadError={() => {}}
                    appearance={{
                      container:
                        'rounded-2xl border border-dashed border-white/20 bg-black/30 ut-uploading:border-purple-400/60',
                      label: 'text-white/80',
                      allowedContent: 'text-white/40 text-[11px]',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailPreview(DEFAULT_STATE.thumbnail)}
                    className="text-[11px] text-white/50 hover:text-white/80"
                  >
                    {t('admin.link.resetThumbnail')}
                  </button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url =
                      res?.[0]?.serverData?.url ??
                      res?.[0]?.ufsUrl ??
                      (res?.[0] as { url?: string })?.url;
                    if (url && typeof url === 'string') {
                      setThumbnailPreview(url);
                    }
                  }}
                  onUploadError={() => {}}
                  appearance={{
                    container:
                      'rounded-2xl border border-dashed border-white/20 bg-black/30 flex flex-col items-center justify-center gap-3 py-6 px-4 ut-uploading:border-purple-400/60',
                    label: 'text-white/80',
                    allowedContent: 'text-white/40 text-[11px]',
                  }}
                />
              )}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex items-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? t('admin.common.saving') : t('admin.common.save')}
              </button>
            </div>
          </form>
        </section>

        {/* Live preview card */}
        <section className="flex flex-col rounded-3xl border border-white/10 bg-linear-to-r from-white/4 to-white/2 px-6 py-6 md:px-10 md:py-8 shadow-[0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <div className="md:w-full flex flex-col md:flex-row items-stretch gap-8">
            <div className="md:w-1/2 flex flex-col items-start justify-center text-left gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-300">
                {values.badge}
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {values.title}
              </h3>
              <p className="text-sm md:text-base text-white/70 max-w-md">
                {values.description}
              </p>
              {/* Desktop button */}
              <a
                href={values.youtubeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 hidden md:inline-flex items-center rounded-full border border-purple-400/70 bg-transparent px-6 py-2.5 text-xs md:text-sm font-semibold text-purple-200 hover:bg-purple-500/15 transition cursor-pointer"
              >
                {values.buttonText}
              </a>
            </div>
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="relative w-full max-w-xl aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailPreview}
                  alt={t('admin.link.widgetAlt')}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* Mobile button */}
          <div className="w-full md:hidden mt-4 flex justify-center">
            <a
              href={values.youtubeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-purple-400/70 bg-transparent px-6 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-500/15 transition cursor-pointer"
            >
              {values.buttonText}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

