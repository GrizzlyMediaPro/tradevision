import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signPlaybackTokens, isMuxSigningConfigured } from "@/lib/mux";
import { requireCourseAccess } from "@/lib/privateCourseAccess";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId lipsă" }, { status: 400 });
  }

  try {
    const lesson = await prisma.privateCourseLesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson || !lesson.muxPlaybackId || lesson.status !== "ready") {
      return NextResponse.json(
        { error: "Video indisponibil" },
        { status: 404 },
      );
    }

    await requireCourseAccess(lesson.courseId);

    if (!isMuxSigningConfigured()) {
      return NextResponse.json(
        { error: "Mux signing keys lipsesc" },
        { status: 503 },
      );
    }

    const tokens = await signPlaybackTokens(lesson.muxPlaybackId);
    return NextResponse.json({
      playbackId: lesson.muxPlaybackId,
      tokens,
      durationSeconds: lesson.durationSeconds,
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
