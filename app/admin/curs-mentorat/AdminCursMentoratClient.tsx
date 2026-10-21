"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import MuxUploader from "@mux/mux-uploader-react";
import {
  FaChevronLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUsers,
  FaSync,
  FaBookOpen,
  FaVideo,
} from "react-icons/fa";
import {
  getPrivateCourseAdminData,
  createPrivateChapter,
  updatePrivateChapter,
  deletePrivateChapter,
  createPrivateLesson,
  updatePrivateLesson,
  deletePrivateLesson,
  updatePrivateCourseMeta,
  syncLessonFromMux,
  grantCourseAccess,
  revokeCourseAccess,
  getCourseEntitlements,
  type PrivateChapterDTO,
  type EntitlementDTO,
} from "@/app/admin/actions/privateCourse";

type Tab = "content" | "access";

export default function AdminCursMentoratClient() {
  const [tab, setTab] = useState<Tab>("content");
  const [loading, setLoading] = useState(true);
  const [muxConfigured, setMuxConfigured] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [chapters, setChapters] = useState<PrivateChapterDTO[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementDTO[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonDrafts, setLessonDrafts] = useState<Record<string, string>>({});
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [uploadForLessonId, setUploadForLessonId] = useState<string | null>(
    null,
  );
  const [uploadEndpoint, setUploadEndpoint] = useState<string | null>(null);

  const [grantEmail, setGrantEmail] = useState("");
  const [grantNotes, setGrantNotes] = useState("");

  const reload = useCallback(async () => {
    const data = await getPrivateCourseAdminData();
    setCourseTitle(data.course.title);
    setCourseDescription(data.course.description ?? "");
    setChapters(data.chapters);
    setMuxConfigured(data.muxConfigured);
    const ents = await getCourseEntitlements();
    setEntitlements(ents);
  }, []);

  useEffect(() => {
    reload()
      .catch((err) =>
        setMessage(err instanceof Error ? err.message : "Eroare la încărcare"),
      )
      .finally(() => setLoading(false));
  }, [reload]);

  const run = (fn: () => Promise<void>) => {
    setMessage(null);
    startTransition(async () => {
      try {
        await fn();
        await reload();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Operație eșuată");
      }
    });
  };

  const startUpload = async (lessonId: string) => {
    setMessage(null);
    try {
      const res = await fetch("/api/private-course/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload eșuat");
      setUploadForLessonId(lessonId);
      setUploadEndpoint(data.uploadUrl);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload eșuat");
    }
  };

  if (loading) {
    return (
      <main className="w-full max-w-[1100px] mx-auto px-4 pt-12 pb-16 text-white/70">
        Se încarcă…
      </main>
    );
  }

  return (
    <main className="w-full max-w-[1100px] mx-auto px-4 pt-10 md:pt-16 pb-16">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-6"
      >
        <FaChevronLeft className="h-3 w-3" />
        Înapoi la Admin
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Curs Mentorat 1-on-1
        </h1>
        <p className="mt-2 text-sm text-white/55 max-w-2xl">
          Capitole, upload video Mux, acces manual după plata 1-on-1.
        </p>
        {!muxConfigured && (
          <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
            Mux nu e configurat. Adaugă MUX_TOKEN_ID, MUX_TOKEN_SECRET,
            MUX_SIGNING_KEY și MUX_PRIVATE_KEY în environment.
          </p>
        )}
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          {message}
        </p>
      )}

      <div className="flex gap-2 mb-6">
        {(
          [
            ["content", "Conținut", FaBookOpen],
            ["access", "Acces useri", FaUsers],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
              tab === id
                ? "bg-yellow-400 text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-white mb-3">
              Detalii curs
            </h2>
            <div className="grid gap-3">
              <input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50"
                placeholder="Titlu curs"
              />
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                rows={2}
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50"
                placeholder="Descriere"
              />
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  run(async () => {
                    await updatePrivateCourseMeta({
                      title: courseTitle,
                      description: courseDescription,
                    });
                    setMessage("Curs actualizat.");
                  })
                }
                className="justify-self-start rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 cursor-pointer"
              >
                Salvează
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-white mb-3">
              Adaugă capitol
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50"
                placeholder="Titlu capitol"
              />
              <button
                type="button"
                disabled={isPending || !chapterTitle.trim()}
                onClick={() =>
                  run(async () => {
                    await createPrivateChapter({ title: chapterTitle });
                    setChapterTitle("");
                    setMessage("Capitol adăugat.");
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 cursor-pointer"
              >
                <FaPlus className="h-3 w-3" />
                Capitol
              </button>
            </div>
          </section>

          <div className="space-y-4">
            {chapters.length === 0 && (
              <p className="text-sm text-white/50">Niciun capitol încă.</p>
            )}
            {chapters.map((chapter, chIdx) => (
              <section
                key={chapter.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  {editingChapterId === chapter.id ? (
                    <div className="flex flex-1 flex-col sm:flex-row gap-2">
                      <input
                        value={editingChapterTitle}
                        onChange={(e) => setEditingChapterTitle(e.target.value)}
                        className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                      />
                      <button
                        type="button"
                        className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-black cursor-pointer"
                        onClick={() =>
                          run(async () => {
                            await updatePrivateChapter(chapter.id, {
                              title: editingChapterTitle,
                            });
                            setEditingChapterId(null);
                          })
                        }
                      >
                        Salvează
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-yellow-300/80">
                        Capitol {chIdx + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-white">
                        {chapter.title}
                      </h3>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-white/15 p-2 text-white/70 hover:bg-white/10 cursor-pointer"
                      onClick={() => {
                        setEditingChapterId(chapter.id);
                        setEditingChapterTitle(chapter.title);
                      }}
                      aria-label="Editează capitol"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-500/10 cursor-pointer"
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Ștergi capitolul „${chapter.title}” și lecțiile aferente?`,
                          )
                        )
                          return;
                        run(async () => {
                          await deletePrivateChapter(chapter.id);
                        });
                      }}
                      aria-label="Șterge capitol"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {chapter.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="rounded-xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {editingLessonId === lesson.id ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                value={editingLessonTitle}
                                onChange={(e) =>
                                  setEditingLessonTitle(e.target.value)
                                }
                                className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white outline-none"
                              />
                              <button
                                type="button"
                                className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-black cursor-pointer"
                                onClick={() =>
                                  run(async () => {
                                    await updatePrivateLesson(lesson.id, {
                                      title: editingLessonTitle,
                                    });
                                    setEditingLessonId(null);
                                  })
                                }
                              >
                                Salvează
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-white">
                                {lIdx + 1}. {lesson.title}
                              </p>
                              <p className="mt-1 text-xs text-white/45">
                                Status:{" "}
                                <span className="text-white/70">
                                  {lesson.status}
                                </span>
                                {lesson.durationSeconds
                                  ? ` · ${Math.round(lesson.durationSeconds / 60)} min`
                                  : ""}
                                {lesson.muxPlaybackId
                                  ? " · playback OK"
                                  : " · fără video"}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                            onClick={() => {
                              setEditingLessonId(lesson.id);
                              setEditingLessonTitle(lesson.title);
                            }}
                          >
                            <FaEdit className="inline h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={!muxConfigured}
                            className="rounded-lg border border-sky-400/30 px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-500/10 disabled:opacity-40 cursor-pointer"
                            onClick={() => startUpload(lesson.id)}
                          >
                            <FaVideo className="inline h-3 w-3 mr-1" />
                            Upload
                          </button>
                          <button
                            type="button"
                            disabled={!muxConfigured}
                            className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                            onClick={() =>
                              run(async () => {
                                const r = await syncLessonFromMux(lesson.id);
                                setMessage(
                                  r.status === "ready"
                                    ? "Video gata de playback."
                                    : "Video încă se procesează.",
                                );
                              })
                            }
                          >
                            <FaSync className="inline h-3 w-3 mr-1" />
                            Sync
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/10 cursor-pointer"
                            onClick={() => {
                              if (!window.confirm("Ștergi lecția?")) return;
                              run(async () => {
                                await deletePrivateLesson(lesson.id);
                              });
                            }}
                          >
                            <FaTrash className="inline h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {uploadForLessonId === lesson.id && uploadEndpoint && (
                        <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                          <p className="mb-2 text-xs text-white/55">
                            Selectează fișierul video. După upload, apasă Sync
                            sau așteaptă webhook-ul Mux.
                          </p>
                          <MuxUploader
                            endpoint={uploadEndpoint}
                            onSuccess={() => {
                              setMessage(
                                "Upload finalizat. Se procesează encoding-ul…",
                              );
                              setUploadForLessonId(null);
                              setUploadEndpoint(null);
                              run(async () => {
                                await syncLessonFromMux(lesson.id);
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={lessonDrafts[chapter.id] ?? ""}
                    onChange={(e) =>
                      setLessonDrafts((prev) => ({
                        ...prev,
                        [chapter.id]: e.target.value,
                      }))
                    }
                    className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                    placeholder="Titlu lecție nouă"
                  />
                  <button
                    type="button"
                    disabled={
                      isPending || !(lessonDrafts[chapter.id] ?? "").trim()
                    }
                    onClick={() =>
                      run(async () => {
                        await createPrivateLesson({
                          chapterId: chapter.id,
                          title: lessonDrafts[chapter.id] ?? "",
                        });
                        setLessonDrafts((prev) => ({
                          ...prev,
                          [chapter.id]: "",
                        }));
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50 cursor-pointer"
                  >
                    <FaPlus className="h-3 w-3" />
                    Lecție
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === "access" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-white mb-3">
              Acordă acces
            </h2>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none"
                placeholder="Email sau Clerk user ID"
              />
              <input
                value={grantNotes}
                onChange={(e) => setGrantNotes(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none"
                placeholder="Note (opțional)"
              />
              <button
                type="button"
                disabled={isPending || !grantEmail.trim()}
                onClick={() =>
                  run(async () => {
                    await grantCourseAccess({
                      emailOrUserId: grantEmail,
                      notes: grantNotes,
                    });
                    setGrantEmail("");
                    setGrantNotes("");
                    setMessage("Acces acordat.");
                  })
                }
                className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50 cursor-pointer"
              >
                Grant
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-white/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Progres</th>
                    <th className="px-4 py-3 font-medium">Acordat</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {entitlements.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-white/45"
                      >
                        Niciun user cu acces.
                      </td>
                    </tr>
                  )}
                  {entitlements.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-white/10 text-white/80"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {`${row.firstName} ${row.lastName}`.trim() || "—"}
                        </div>
                        <div className="text-xs text-white/45">{row.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {row.completedLessons}/{row.totalLessons}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(row.grantedAt).toLocaleDateString("ro-RO")}
                      </td>
                      <td className="px-4 py-3 text-white/55">
                        {row.notes || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 cursor-pointer"
                          onClick={() => {
                            if (!window.confirm("Revoci accesul?")) return;
                            run(async () => {
                              await revokeCourseAccess(row.clerkUserId);
                              setMessage("Acces revocat.");
                            });
                          }}
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
