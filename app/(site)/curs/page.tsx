"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FaLock,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPlay,
  FaTelegramPlane,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { type CourseChapter, defaultCourseChapters } from "@/app/data/courseChapters";
import { getCourseChapters } from "@/app/admin/actions/course";
import { trackMetaPixelEvent } from "@/lib/metaPixel";
import {
  FREE_COURSE_STORAGE_KEY,
  allowsAnalytics,
  allowsFunctionalLocalStorage,
  readConsentFromStorage,
} from "@/lib/cookieConsent";

type FreeCourseStored = {
  v: 1;
  isUnlocked: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentChapter: number;
  watchedChapters: number[];
};

function readFreeCourseFromStorage(): FreeCourseStored | null {
  if (typeof window === "undefined") return null;
  if (!allowsFunctionalLocalStorage(readConsentFromStorage())) return null;
  try {
    const raw = localStorage.getItem(FREE_COURSE_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<FreeCourseStored>;
    if (data.v !== 1 || !data.isUnlocked) return null;
    return {
      v: 1,
      isUnlocked: true,
      firstName: typeof data.firstName === "string" ? data.firstName : "",
      lastName: typeof data.lastName === "string" ? data.lastName : "",
      email: typeof data.email === "string" ? data.email : "",
      phone: typeof data.phone === "string" ? data.phone : "",
      currentChapter:
        typeof data.currentChapter === "number" && Number.isFinite(data.currentChapter)
          ? data.currentChapter
          : 0,
      watchedChapters: Array.isArray(data.watchedChapters)
        ? data.watchedChapters.filter(
            (n): n is number =>
              typeof n === "number" && Number.isInteger(n) && n >= 0
          )
        : [],
    };
  } catch {
    return null;
  }
}

function clampCourseStateToChapters(
  stored: FreeCourseStored,
  chapterCount: number
): {
  currentChapter: number;
  watchedChapters: Set<number>;
} {
  if (chapterCount <= 0) {
    return { currentChapter: 0, watchedChapters: new Set() };
  }
  const maxIdx = chapterCount - 1;
  const watched = new Set(
    stored.watchedChapters.filter((i) => i >= 0 && i <= maxIdx)
  );
  if (watched.size === 0) watched.add(0);
  const current = Math.max(
    0,
    Math.min(
      Number.isFinite(stored.currentChapter) ? stored.currentChapter : 0,
      maxIdx
    )
  );
  return { currentChapter: current, watchedChapters: watched };
}

type UnlockCourseFormProps = {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  unlockError: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

function UnlockCourseForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  unlockError,
  onSubmit,
}: UnlockCourseFormProps) {
  return (
    <div className="w-full rounded-2xl border border-yellow-300/30 bg-linear-to-b from-[#0d0f1a]/95 to-[#0a0c16]/95 px-6 py-8 md:px-8 md:py-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-300/30">
          <FaLock className="h-6 w-6 text-yellow-300" />
        </div>

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">
            Deblochează cursul gratuit
          </h3>
          <p className="mt-2 text-sm text-white/55 max-w-xs mx-auto">
            Completează datele tale pentru a accesa toate lecțiile cursului de
            trading.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-3 mt-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nume"
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
              />
            </div>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenume"
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
              />
            </div>
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplu.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
            />
          </div>
          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-yellow-300/60 focus:bg-white/8 focus:ring-1 focus:ring-yellow-300/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer"
          >
            Deblochează cursul
          </button>
        </form>

        {unlockError && (
          <p className="text-xs text-red-400 mt-1">
            A apărut o eroare. Încearcă din nou.
          </p>
        )}

        <p className="text-[11px] text-white/35 mt-1">
          Prin înscriere, vei fi adăugat în newsletter. Nu trimitem spam.
        </p>
      </div>
    </div>
  );
}

export default function CursPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [unlockError, setUnlockError] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [watchedChapters, setWatchedChapters] = useState<Set<number>>(
    new Set()
  );
  const [chapters, setChapters] = useState<CourseChapter[]>(defaultCourseChapters);
  const [showUnlockToast, setShowUnlockToast] = useState(false);

  useEffect(() => {
    getCourseChapters().then((list) => {
      if (list.length > 0) setChapters(list);
    });
  }, []);

  // Reîncarcă deblocarea și progresul din localStorage (inclusiv după ce lista de capitole își stabilește lungimea reală).
  useEffect(() => {
    if (chapters.length === 0) return;
    const stored = readFreeCourseFromStorage();
    if (!stored) return;
    const { currentChapter: nextChapter, watchedChapters: nextWatched } =
      clampCourseStateToChapters(stored, chapters.length);
    setIsUnlocked(true);
    setFirstName(stored.firstName);
    setLastName(stored.lastName);
    setEmail(stored.email);
    setPhone(stored.phone);
    setCurrentChapter(nextChapter);
    setWatchedChapters(nextWatched);
  }, [chapters.length]);

  // Persistă deblocarea și progresul pe dispozitiv doar dacă utilizatorul a acceptat stocarea funcțională.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isUnlocked) return;
    if (!allowsFunctionalLocalStorage(readConsentFromStorage())) return;
    try {
      const payload: FreeCourseStored = {
        v: 1,
        isUnlocked: true,
        firstName,
        lastName,
        email,
        phone,
        currentChapter,
        watchedChapters: [...watchedChapters].sort((a, b) => a - b),
      };
      localStorage.setItem(FREE_COURSE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / private mode */
    }
  }, [isUnlocked, firstName, lastName, email, phone, currentChapter, watchedChapters]);

  useEffect(() => {
    if (!showUnlockToast) return;
    const t = window.setTimeout(() => setShowUnlockToast(false), 4500);
    return () => window.clearTimeout(t);
  }, [showUnlockToast]);

  const handleUnlock = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedEmail = email.trim();
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const trimmedPhone = phone.trim();
      if (!trimmedEmail || !trimmedFirst || !trimmedLast || !trimmedPhone) return;

      setUnlockError(false);
      try {
        const res = await fetch("/api/course-enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: trimmedFirst,
            lastName: trimmedLast,
            email: trimmedEmail,
            phone: trimmedPhone,
          }),
        });

        if (!res.ok) {
          setUnlockError(true);
          return;
        }

        setIsUnlocked(true);
        setWatchedChapters(new Set([0]));
        setShowUnlockToast(true);
        if (allowsAnalytics(readConsentFromStorage())) {
          trackMetaPixelEvent("SubmitApplication");
        }
      } catch {
        setUnlockError(true);
      }
    },
    [email, firstName, lastName, phone]
  );

  const handleChapterNav = useCallback(
    (index: number) => {
      if (!isUnlocked) return;
      // Can only navigate to watched chapters or the next unwatched one
      const maxAccessible = Math.max(...Array.from(watchedChapters)) + 1;
      if (index <= maxAccessible && index >= 0 && index < chapters.length) {
        setCurrentChapter(index);
        setWatchedChapters((prev) => new Set([...prev, index]));
      }
    },
    [isUnlocked, watchedChapters]
  );

  const handlePrev = useCallback(() => {
    if (currentChapter > 0) {
      handleChapterNav(currentChapter - 1);
    }
  }, [currentChapter, handleChapterNav]);

  const handleNext = useCallback(() => {
    if (currentChapter < chapters.length - 1) {
      handleChapterNav(currentChapter + 1);
    }
  }, [currentChapter, handleChapterNav]);

  const chapter = chapters[currentChapter];
  const maxAccessible = isUnlocked
    ? Math.max(...Array.from(watchedChapters)) + 1
    : -1;

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      {showUnlockToast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-400/40 bg-black/80 px-5 py-2 text-xs font-medium text-emerald-200 shadow-lg flex items-center gap-2">
          <FaCheckCircle className="h-3.5 w-3.5 shrink-0" />
          Cursul a fost deblocat cu succes!
        </div>
      )}
      {/* Heading */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Curs Trading
        </h1>
        <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-lg mx-auto">
          Învață trading de la zero cu cursul nostru gratuit. Parcurge fiecare
          lecție în ordine și construiește-ți fundația de care ai nevoie pentru
          a deveni un trader consistent.
        </p>
      </div>

      {/* Chapter selector pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {chapters.map((ch, idx) => {
          const isWatched = watchedChapters.has(idx);
          const isAccessible = idx <= maxAccessible;
          const isActive = idx === currentChapter;

          return (
            <button
              key={idx}
              onClick={() => handleChapterNav(idx)}
              disabled={!isAccessible}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition cursor-pointer whitespace-nowrap
                ${
                  isActive
                    ? "bg-purple-500 text-white shadow-[0_8px_20px_rgba(147,51,234,0.4)]"
                    : isWatched
                    ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    : isAccessible
                    ? "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                    : "border border-white/10 bg-white/3 text-white/30 cursor-not-allowed"
                }
              `}
            >
              {isWatched && !isActive ? (
                <FaCheckCircle className="h-3 w-3" />
              ) : !isAccessible ? (
                <FaLock className="h-3 w-3" />
              ) : null}
              <span>{ch.lessonLabel || `Lecția ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile: form in page flow so it’s fully visible; pills stay above */}
      {!isUnlocked && (
        <div className="relative z-20 mx-auto mb-8 w-full max-w-md px-2 md:hidden">
          <UnlockCourseForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            unlockError={unlockError}
            onSubmit={handleUnlock}
          />
        </div>
      )}

      {/* Chapter card with blur overlay (desktop overlay only) */}
      <div className="relative w-full">
        {/* The actual chapter content */}
        <div
          className={`w-full rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 px-6 py-8 md:px-10 md:py-12 shadow-[0_18px_45px_rgba(0,0,0,0.5)] transition-all duration-500 ${
            !isUnlocked ? "blur-md select-none pointer-events-none" : ""
          }`}
        >
          {/* Chapter header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                <FaPlay className="h-2.5 w-2.5" />
                {chapter.lessonLabel || `Lecția ${currentChapter + 1}`} din {chapters.length}
              </span>
              {watchedChapters.has(currentChapter) && isUnlocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                  <FaCheckCircle className="h-2.5 w-2.5" />
                  Deblocat
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {chapter.title}
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/65 max-w-3xl">
              {chapter.description}
            </p>
          </div>

          {/* YouTube embed */}
          <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            {isUnlocked ? (
              <iframe
                src={`https://www.youtube.com/embed/${chapter.videoId}`}
                title={chapter.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <FaPlay className="h-12 w-12 text-white/20" />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentChapter === 0}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer
                ${
                  currentChapter === 0
                    ? "border border-white/10 bg-white/3 text-white/30 cursor-not-allowed"
                    : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                }
              `}
            >
              <FaChevronLeft className="h-3 w-3" />
              <span>Lecția anterioară</span>
            </button>

            <span className="text-xs text-white/40 hidden md:block">
              {currentChapter + 1} / {chapters.length}
            </span>

            <button
              onClick={handleNext}
              disabled={
                currentChapter === chapters.length - 1 ||
                currentChapter + 1 > maxAccessible
              }
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer
                ${
                  currentChapter === chapters.length - 1 ||
                  currentChapter + 1 > maxAccessible
                    ? "border border-white/10 bg-white/3 text-white/30 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(147,51,234,0.35)] hover:brightness-110"
                }
              `}
            >
              <span>Lecția următoare</span>
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Telegram CTA */}
          {isUnlocked && (
            <div className="mt-8 flex flex-col items-center gap-3 pt-6 border-t border-white/10">
              <p className="text-sm md:text-base text-white/70 text-center">
                Afla mai multe pe grupul nostru de Telegram
              </p>
              <a
                href="https://t.me/tradevisionromania"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.45)] hover:brightness-110 transition cursor-pointer"
              >
                <FaTelegramPlane className="h-4 w-4" />
                <span>Alătură-te pe Telegram</span>
              </a>
            </div>
          )}
        </div>

        {/* Desktop: centered overlay on the blurred card */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 hidden items-center justify-center rounded-3xl bg-black/40 p-6 backdrop-blur-sm md:flex">
            <div className="w-full max-w-md">
              <UnlockCourseForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                unlockError={unlockError}
                onSubmit={handleUnlock}
              />
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isUnlocked && (
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/50">
              Progres curs
            </span>
            <span className="text-xs font-semibold text-yellow-300">
              {watchedChapters.size} / {chapters.length} lecții
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 transition-all duration-500"
              style={{
                width: `${(watchedChapters.size / chapters.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
