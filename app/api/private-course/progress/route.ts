import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCourseAccess } from "@/lib/privateCourseAccess";
import { getT } from "@/lib/i18n/get-t";

function accessStatus(message: string) {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  if (message.startsWith("Course not found")) return 404;
  return 500;
}

const COMPLETE_THRESHOLD = 0.9;

export async function POST(req: Request) {
  const t = await getT();
  try {
    const body = (await req.json()) as {
      lessonId?: string;
      watchedSeconds?: number;
      durationSeconds?: number;
      completed?: boolean;
    };

    if (!body.lessonId || typeof body.watchedSeconds !== "number") {
      return NextResponse.json({ error: t("private.api.invalidData") }, { status: 400 });
    }

    const lesson = await prisma.privateCourseLesson.findUnique({
      where: { id: body.lessonId },
    });
    if (!lesson) {
      return NextResponse.json({ error: t("private.api.lessonMissing") }, { status: 404 });
    }

    const { userId } = await requireCourseAccess(lesson.courseId);

    const duration =
      body.durationSeconds ?? lesson.durationSeconds ?? undefined;
    const watchedSeconds = Math.max(0, body.watchedSeconds);
    const autoCompleted =
      typeof duration === "number" &&
      duration > 0 &&
      watchedSeconds / duration >= COMPLETE_THRESHOLD;
    const completed = Boolean(body.completed) || autoCompleted;

    const existing = await prisma.lessonProgress.findUnique({
      where: {
        clerkUserId_lessonId: {
          clerkUserId: userId,
          lessonId: lesson.id,
        },
      },
    });

    const nextWatched = Math.max(
      watchedSeconds,
      existing?.watchedSeconds ?? 0,
    );
    const nextCompleted = Boolean(existing?.completed) || completed;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        clerkUserId_lessonId: {
          clerkUserId: userId,
          lessonId: lesson.id,
        },
      },
      create: {
        clerkUserId: userId,
        lessonId: lesson.id,
        courseId: lesson.courseId,
        watchedSeconds: nextWatched,
        completed: nextCompleted,
        lastWatchedAt: new Date(),
      },
      update: {
        watchedSeconds: nextWatched,
        completed: nextCompleted,
        lastWatchedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      completed: progress.completed,
      watchedSeconds: progress.watchedSeconds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const status = accessStatus(message);
    const error =
      status === 401
        ? t("private.api.unauthorized")
        : status === 403
          ? t("private.api.forbidden")
          : status === 404
            ? t("private.api.courseNotFound")
            : t("private.api.generic");
    return NextResponse.json({ error }, { status });
  }
}
