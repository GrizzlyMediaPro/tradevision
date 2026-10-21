"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaLock,
  FaPlay,
} from "react-icons/fa";

export type CourseLessonView = {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  order: number;
  status: string;
  durationSeconds: number | null;
  hasVideo: boolean;
};

export type CourseChapterView = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: CourseLessonView[];
};

export type LessonProgressView = {
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
};

type Props = {
  courseTitle: string;
  courseDescription: string | null;
  chapters: CourseChapterView[];
  progress: LessonProgressView[];
  initialLessonId: string | null;
};

type PlaybackPayload = {
  playbackId: string;
  tokens: { playback: string; thumbnail: string };
  durationSeconds: number | null;
};

export function PrivateCoursePlayer({
  courseTitle,
  courseDescription,
  chapters,
  progress: initialProgress,
  initialLessonId,
}: Props) {
  const flatLessons = useMemo(
    () => chapters.flatMap((ch) => ch.lessons),
    [chapters],
  );

  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    initialLessonId ?? flatLessons[0]?.id ?? null,
  );
  const [progressMap, setProgressMap] = useState<
    Record<string, LessonProgressView>
  >(() =>
    Object.fromEntries(initialProgress.map((p) => [p.lessonId, p])),
  );
  const [playback, setPlayback] = useState<PlaybackPayload | null>(null);
  const [loadingPlayback, setLoadingPlayback] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const lastSavedRef = useRef(0);

  const activeLesson =
    flatLessons.find((l) => l.id === activeLessonId) ?? flatLessons[0] ?? null;
  const activeIndex = activeLesson
    ? flatLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;

  const readyLessons = flatLessons.filter((l) => l.hasVideo);
  const completedCount = readyLessons.filter(
    (l) => progressMap[l.id]?.completed,
  ).length;
  const progressPct =
    readyLessons.length === 0
      ? 0
      : Math.round((completedCount / readyLessons.length) * 100);

  const loadPlayback = useCallback(async (lessonId: string) => {
    setLoadingPlayback(true);
    setPlaybackError(null);
    setPlayback(null);
    try {
      const res = await fetch(
        `/api/private-course/playback?lessonId=${encodeURIComponent(lessonId)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Nu pot încărca video-ul");
      setPlayback(data as PlaybackPayload);
    } catch (err) {
      setPlaybackError(
        err instanceof Error ? err.message : "Eroare la încărcare",
      );
    } finally {
      setLoadingPlayback(false);
    }
  }, []);

  useEffect(() => {
    if (!activeLesson?.hasVideo) {
      setPlayback(null);
      setPlaybackError(
        activeLesson ? "Video-ul nu este încă disponibil." : null,
      );
      return;
    }
    void loadPlayback(activeLesson.id);
  }, [activeLesson, loadPlayback]);

  const saveProgress = useCallback(
    async (
      lessonId: string,
      watchedSeconds: number,
      durationSeconds?: number,
      completed?: boolean,
    ) => {
      try {
        const res = await fetch("/api/private-course/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            watchedSeconds,
            durationSeconds,
            completed,
          }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          completed?: boolean;
          watchedSeconds?: number;
        };
        setProgressMap((prev) => ({
          ...prev,
          [lessonId]: {
            lessonId,
            watchedSeconds: data.watchedSeconds ?? watchedSeconds,
            completed: Boolean(data.completed ?? completed),
          },
        }));
      } catch {
        // silent — progress is best-effort
      }
    },
    [],
  );

  const startTime = activeLesson
    ? progressMap[activeLesson.id]?.watchedSeconds ?? 0
    : 0;

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-8 md:pt-12 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          {courseTitle}
        </h1>
        {courseDescription && (
          <p className="mt-2 text-sm text-white/55 max-w-2xl">
            {courseDescription}
          </p>
        )}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/55 mb-1.5">
            <span>Progres curs</span>
            <span>
              {completedCount}/{readyLessons.length} lecții · {progressPct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 max-h-[70vh] overflow-y-auto order-2 lg:order-1">
          {chapters.map((chapter, chIdx) => (
            <div key={chapter.id} className="mb-4 last:mb-0">
              <p className="px-2 mb-1.5 text-[11px] uppercase tracking-wide text-yellow-300/80">
                Capitol {chIdx + 1}
              </p>
              <p className="px-2 mb-2 text-sm font-semibold text-white">
                {chapter.title}
              </p>
              <ul className="space-y-1">
                {chapter.lessons.map((lesson) => {
                  const done = progressMap[lesson.id]?.completed;
                  const active = lesson.id === activeLesson?.id;
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full flex items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition cursor-pointer ${
                          active
                            ? "bg-yellow-400/15 text-yellow-100 border border-yellow-400/30"
                            : "text-white/70 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <FaCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          ) : lesson.hasVideo ? (
                            <FaPlay className="h-3 w-3 text-white/40" />
                          ) : (
                            <FaLock className="h-3 w-3 text-white/30" />
                          )}
                        </span>
                        <span className="leading-snug">{lesson.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {chapters.length === 0 && (
            <p className="p-3 text-sm text-white/45">
              Conținutul cursului nu a fost încă publicat.
            </p>
          )}
        </aside>

        <section className="order-1 lg:order-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center">
              {loadingPlayback && (
                <p className="text-sm text-white/50">Se încarcă video-ul…</p>
              )}
              {!loadingPlayback && playbackError && (
                <p className="text-sm text-white/55 px-6 text-center">
                  {playbackError}
                </p>
              )}
              {!loadingPlayback && playback && (
                <MuxPlayer
                  key={playback.playbackId + String(startTime)}
                  playbackId={playback.playbackId}
                  tokens={{
                    playback: playback.tokens.playback,
                    thumbnail: playback.tokens.thumbnail,
                  }}
                  streamType="on-demand"
                  startTime={startTime > 5 ? startTime : 0}
                  playbackRates={[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}
                  accentColor="#facc15"
                  className="w-full h-full"
                  metadata={{
                    video_title: activeLesson?.title ?? courseTitle,
                  }}
                  onTimeUpdate={(e) => {
                    const el = e.target as HTMLVideoElement;
                    const now = Date.now();
                    if (now - lastSavedRef.current < 8000) return;
                    lastSavedRef.current = now;
                    if (!activeLesson) return;
                    void saveProgress(
                      activeLesson.id,
                      el.currentTime,
                      el.duration || playback.durationSeconds || undefined,
                    );
                  }}
                  onEnded={() => {
                    if (!activeLesson) return;
                    void saveProgress(
                      activeLesson.id,
                      playback.durationSeconds ?? 0,
                      playback.durationSeconds ?? undefined,
                      true,
                    );
                  }}
                />
              )}
            </div>
          </div>

          {activeLesson && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {activeLesson.title}
                </h2>
                {activeLesson.description && (
                  <p className="mt-1 text-sm text-white/55">
                    {activeLesson.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={activeIndex <= 0}
                  onClick={() =>
                    setActiveLessonId(flatLessons[activeIndex - 1]?.id ?? null)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/70 hover:bg-white/5 disabled:opacity-35 cursor-pointer"
                >
                  <FaChevronLeft className="h-3 w-3" />
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={
                    activeIndex < 0 || activeIndex >= flatLessons.length - 1
                  }
                  onClick={() =>
                    setActiveLessonId(flatLessons[activeIndex + 1]?.id ?? null)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/70 hover:bg-white/5 disabled:opacity-35 cursor-pointer"
                >
                  Următor
                  <FaChevronRight className="h-3 w-3" />
                </button>
                {!progressMap[activeLesson.id]?.completed && (
                  <button
                    type="button"
                    onClick={() =>
                      void saveProgress(
                        activeLesson.id,
                        progressMap[activeLesson.id]?.watchedSeconds ?? 0,
                        activeLesson.durationSeconds ?? undefined,
                        true,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-300 cursor-pointer"
                  >
                    <FaCheckCircle className="h-3.5 w-3.5" />
                    Marchează complet
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function PrivateCourseLocked({
  signedIn,
}: {
  signedIn: boolean;
}) {
  return (
    <main className="w-full max-w-[720px] mx-auto px-4 pt-16 md:pt-24 pb-20 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-400/10 mb-5">
        <FaLock className="h-5 w-5 text-yellow-300" />
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold text-white">
        Curs Mentorat 1-on-1
      </h1>
      <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed">
        Accesul la acest curs se acordă manual după plata și programarea
        mentoratului 1-on-1. Dacă ai deja acces, autentifică-te cu același
        cont.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {!signedIn ? (
          <Link
            href="/sign-in?redirect_url=/curs-mentorat"
            className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 transition"
          >
            Autentificare
          </Link>
        ) : (
          <Link
            href="/contact"
            className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 transition"
          >
            Contactează-ne
          </Link>
        )}
        <Link
          href="/"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5 transition"
        >
          Înapoi acasă
        </Link>
      </div>
    </main>
  );
}
