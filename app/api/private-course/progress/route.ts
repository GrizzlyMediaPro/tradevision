import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCourseAccess } from "@/lib/privateCourseAccess";

const COMPLETE_THRESHOLD = 0.9;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      lessonId?: string;
      watchedSeconds?: number;
      durationSeconds?: number;
      completed?: boolean;
    };

    if (!body.lessonId || typeof body.watchedSeconds !== "number") {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const lesson = await prisma.privateCourseLesson.findUnique({
      where: { id: body.lessonId },
    });
    if (!lesson) {
      return NextResponse.json({ error: "Lecție inexistentă" }, { status: 404 });
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
    const message = err instanceof Error ? err.message : "Eroare";
    const status = message.startsWith("Unauthorized")
      ? 401
      : message.startsWith("Forbidden")
        ? 403
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
