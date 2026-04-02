'use client';

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import Link from 'next/link';
import {
  FaChevronLeft,
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUsers,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';
import { type CourseChapter } from '../../data/courseChapters';
import {
  getCourseChapters,
  createCourseChapter,
  updateCourseChapter,
  deleteCourseChapter,
  getCourseEnrollments,
  deleteCourseEnrollment,
  type CourseEnrollmentData,
} from '../actions/course';

type FormMode = 'create' | 'edit';

type ChapterFormState = {
  mode: FormMode;
  editingIndex: number | null;
  title: string;
  description: string;
  youtubeUrl: string;
  lessonLabel: string;
};

function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Direct video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get('v');
    if (v) return v;

    const parts = url.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  } catch {
    // not a valid URL, fall back
  }

  return trimmed;
}

export default function AdminCursPage() {
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ChapterFormState>({
    mode: 'create',
    editingIndex: null,
    title: '',
    description: '',
    youtubeUrl: '',
    lessonLabel: '',
  });

  useEffect(() => {
    getCourseChapters().then((list) => {
      setChapters(list);
    }).finally(() => setLoading(false));

    getCourseEnrollments().then((list) => {
      setEnrollments(list);
    }).finally(() => setLoadingEnrollments(false));
  }, []);

  const resetForm = () => {
    setForm({
      mode: 'create',
      editingIndex: null,
      title: '',
      description: '',
      youtubeUrl: '',
      lessonLabel: '',
    });
  };

  const handleFieldChange =
    (key: keyof ChapterFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();
    const videoId = extractYouTubeId(form.youtubeUrl);

    if (!title || !videoId) {
      return;
    }

    const lessonLabel = form.lessonLabel.trim();

    const newChapter: CourseChapter = {
      title,
      description,
      videoId,
      lessonLabel: lessonLabel || undefined,
    };

    setSaving(true);
    try {
      if (form.mode === 'create') {
        await createCourseChapter(newChapter);
      } else if (
        form.mode === 'edit' &&
        form.editingIndex !== null &&
        form.editingIndex >= 0 &&
        form.editingIndex < chapters.length
      ) {
        await updateCourseChapter(form.editingIndex, newChapter);
      }
      const list = await getCourseChapters();
      setChapters(list);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index: number) => {
    const ch = chapters[index];
    setForm({
      mode: 'edit',
      editingIndex: index,
      title: ch.title,
      description: ch.description,
      youtubeUrl: `https://www.youtube.com/watch?v=${ch.videoId}`,
      lessonLabel: ch.lessonLabel || '',
    });
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteEnrollment = async (id: string) => {
    try {
      await deleteCourseEnrollment(id);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // error
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      await deleteCourseChapter(index);
      const list = await getCourseChapters();
      setChapters(list);
      if (form.mode === 'edit' && form.editingIndex === index) {
        resetForm();
      }
    } catch {
      // error
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
          <span>Înapoi la Admin</span>
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/30">
            <FaBookOpen className="h-5 w-5 text-purple-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Admin Curs Trading
        </h1>
        <div className="mt-3 h-[2px] w-[130px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Creează, editează sau șterge lecțiile cursului și setează link-urile
          YouTube care vor fi redate pe pagina de curs.
        </p>
      </div>

      {/* Layout: left = form, right = chapters list */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6 md:gap-8 items-stretch">
        {/* Form card */}
        <section className="rounded-3xl border border-white/10 bg-linear-to-b from-white/7 to-white/2 px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <span>
                  {form.mode === 'create'
                    ? 'Adaugă lecție'
                    : 'Editează lecție'}
                </span>
              </h2>
              <p className="mt-1 text-xs text-white/45">
                Setează titlul, descrierea, numărul lecției și link-ul YouTube.
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Lesson label + Title */}
            <div className="grid grid-cols-[160px_1fr] gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Etichetă
                </label>
                <input
                  type="text"
                  value={form.lessonLabel}
                  onChange={handleFieldChange('lessonLabel')}
                  placeholder="Ex: Lecția 2.1"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
                />
                <p className="text-[11px] text-white/40">
                  Gol = Lecția N
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Titlu lecție
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleFieldChange('title')}
                  placeholder="Ex: Introducere în Trading"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Descriere lecție
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={handleFieldChange('description')}
                placeholder="Descriere scurtă a conținutului lecției..."
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30 resize-none"
              />
            </div>

            {/* YouTube URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Link YouTube (embed)
              </label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={handleFieldChange('youtubeUrl')}
                placeholder="https://www.youtube.com/watch?v=..."
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:bg-white/8 focus:ring-1 focus:ring-purple-400/30"
              />
              <p className="text-[11px] text-white/40">
                Poți lipi atât link complet YouTube, cât și doar ID-ul
                video-ului.
              </p>
            </div>

            {/* Submit */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-white/40 max-w-xs">
                Modificările sunt salvate în baza de date și folosite pe pagina <code>/curs</code>.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {form.mode === 'create' ? (
                  <>
                    <FaPlus className="h-4 w-4" />
                    <span>Adaugă lecție</span>
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

        {/* Chapters list */}
        <section className="flex flex-col rounded-3xl border border-white/10 bg-linear-to-b from-white/5 to-white/2 px-6 py-6 md:px-7 md:py-7 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm md:text-base font-semibold text-white">
              Lecții curs ({chapters.length})
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-white/45">Se încarcă...</p>
          ) : chapters.length === 0 ? (
            <p className="text-sm text-white/45">
              Nu există încă nicio lecție. Adaugă una din formularul din
              stânga.
            </p>
          ) : (
            <div className="mt-1 flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
              {chapters.map((ch, idx) => (
                <div
                  key={`${ch.title}-${idx}`}
                  className="flex items-start gap-4 rounded-2xl border border-white/12 bg-linear-to-r from-white/5 to-white/2 px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/15 border border-purple-400/40 text-xs font-semibold text-purple-200">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {ch.lessonLabel || `Lecția ${idx + 1}`}: {ch.title}
                    </p>
                    {ch.description && (
                      <p className="mt-1 text-[11px] text-white/55 line-clamp-2">
                        {ch.description}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-white/40">
                      Video ID:{' '}
                      <span className="font-mono text-white/70">
                        {ch.videoId}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(idx)}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/85 hover:bg-white/10 transition cursor-pointer"
                    >
                      <FaEdit className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
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

      {/* Persoane Înscrise section */}
      <section className="mt-8 md:mt-10 rounded-3xl border border-white/10 bg-linear-to-b from-white/5 to-white/2 px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <FaUsers className="h-4 w-4 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Persoane înscrise ({enrollments.length})
            </h2>
            <p className="mt-0.5 text-xs text-white/45">
              Persoanele care și-au completat datele pentru a accesa cursul gratuit.
            </p>
          </div>
        </div>

        {loadingEnrollments ? (
          <p className="text-sm text-white/45">Se încarcă...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-white/45">
            Nu există încă nicio persoană înscrisă.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">#</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">Nume</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">Prenume</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">Email</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">Telefon</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/50">Data</th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/50"></th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, idx) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-white/5 hover:bg-white/3 transition"
                  >
                    <td className="py-3 pr-4 text-white/40 text-xs">{idx + 1}</td>
                    <td className="py-3 pr-4 text-white font-medium">{enrollment.lastName}</td>
                    <td className="py-3 pr-4 text-white font-medium">{enrollment.firstName}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-white/70">
                        <FaEnvelope className="h-3 w-3 text-white/30" />
                        {enrollment.email}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-white/70">
                        <FaPhone className="h-3 w-3 text-white/30" />
                        {enrollment.phone}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/50 text-xs whitespace-nowrap">
                      {new Date(enrollment.createdAt).toLocaleDateString('ro-RO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3">
                      {confirmDeleteId === enrollment.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteEnrollment(enrollment.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-red-500/50 bg-red-500/20 px-3 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/30 transition cursor-pointer"
                          >
                            Confirmă
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60 hover:bg-white/10 transition cursor-pointer"
                          >
                            Anulează
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(enrollment.id)}
                          className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

