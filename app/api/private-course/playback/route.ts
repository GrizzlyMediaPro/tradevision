import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signPlaybackTokens, isMuxSigningConfigured } from "@/lib/mux";
import { requireCourseAccess } from "@/lib/privateCourseAccess";
import { getT } from "@/lib/i18n/get-t";

function accessStatus(message: string) {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  if (message.startsWith("Course not found")) return 404;
  return 500;
}

export async function GET(req: Request) {
  const t = await getT();
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: t("private.api.missingLesson") }, { status: 400 });
  }

  try {
    const lesson = await prisma.privateCourseLesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson || !lesson.muxPlaybackId || lesson.status !== "ready") {
      return NextResponse.json(
        { error: t("private.api.videoUnavailable") },
        { status: 404 },
      );
    }

    await requireCourseAccess(lesson.courseId);

    if (!isMuxSigningConfigured()) {
      return NextResponse.json(
        { error: t("private.api.muxKeys") },
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
