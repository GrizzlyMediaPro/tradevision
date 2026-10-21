import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  ensurePrivateCourse,
  getCourseAccessForCurrentUser,
} from "@/lib/privateCourseAccess";
import { getT } from "@/lib/i18n/get-t";
import {
  PrivateCourseLocked,
  PrivateCoursePlayer,
  type CourseChapterView,
  type LessonProgressView,
} from "./PrivateCoursePlayer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("mentor.title"),
    robots: { index: false, follow: false },
  };
}

export default async function CursMentoratPage() {
  const { user, course, hasAccess } = await getCourseAccessForCurrentUser();

  if (!user || !hasAccess || !course) {
    return <PrivateCourseLocked signedIn={Boolean(user)} />;
  }

  const ensured = course ?? (await ensurePrivateCourse());
  const chaptersRaw = await prisma.privateCourseChapter.findMany({
    where: { courseId: ensured.id },
    orderBy: { order: "asc" },
  });
  const lessonsRaw = await prisma.privateCourseLesson.findMany({
    where: { courseId: ensured.id },
    orderBy: { order: "asc" },
  });
  const progressRaw = await prisma.lessonProgress.findMany({
    where: { clerkUserId: user.id, courseId: ensured.id },
  });

  const chapters: CourseChapterView[] = chaptersRaw.map((ch) => ({
    id: ch.id,
    title: ch.title,
    description: ch.description,
    order: ch.order,
    lessons: lessonsRaw
      .filter((l) => l.chapterId === ch.id)
      .map((l) => ({
        id: l.id,
        chapterId: l.chapterId,
        title: l.title,
        description: l.description,
        order: l.order,
        status: l.status,
        durationSeconds: l.durationSeconds,
        hasVideo: Boolean(l.muxPlaybackId && l.status === "ready"),
      })),
  }));

  const progress: LessonProgressView[] = progressRaw.map((p) => ({
    lessonId: p.lessonId,
    watchedSeconds: p.watchedSeconds,
    completed: p.completed,
  }));

  const flat = chapters.flatMap((c) => c.lessons);
  const resume =
    [...progress]
      .filter((p) => !p.completed && p.watchedSeconds > 0)
      .sort((a, b) => b.watchedSeconds - a.watchedSeconds)[0]?.lessonId ??
    progress.find((p) => !p.completed)?.lessonId ??
    flat.find((l) => l.hasVideo && !progress.find((p) => p.lessonId === l.id && p.completed))
      ?.id ??
    flat[0]?.id ??
    null;

  // Prefer last watched by lastWatchedAt
  const lastWatched = [...progressRaw].sort(
    (a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime(),
  )[0];
  const initialLessonId =
    lastWatched && !lastWatched.completed
      ? lastWatched.lessonId
      : resume;

  return (
    <PrivateCoursePlayer
      courseTitle={ensured.title}
      courseDescription={ensured.description}
      chapters={chapters}
      progress={progress}
      initialLessonId={initialLessonId}
    />
  );
}
