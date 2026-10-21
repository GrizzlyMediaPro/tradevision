import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { createDirectUpload, isMuxConfigured } from "@/lib/mux";
import { getT } from "@/lib/i18n/get-t";

export async function POST(req: Request) {
  const t = await getT();
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: t("private.api.unauthorized") }, { status: 401 });
  }

  if (!isMuxConfigured()) {
    return NextResponse.json(
      { error: t("private.api.muxOff") },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { lessonId?: string };
  if (!body.lessonId) {
    return NextResponse.json({ error: t("private.api.missingLesson") }, { status: 400 });
  }

  const lesson = await prisma.privateCourseLesson.findUnique({
    where: { id: body.lessonId },
  });
  if (!lesson) {
    return NextResponse.json({ error: t("private.api.lessonMissing") }, { status: 404 });
  }

  const originHeader = req.headers.get("origin");
  const origin = (
    originHeader ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  try {
    const upload = await createDirectUpload(origin);
    await prisma.privateCourseLesson.update({
      where: { id: lesson.id },
      data: {
        muxUploadId: upload.id,
        muxAssetId: null,
        muxPlaybackId: null,
        status: "pending",
        durationSeconds: null,
      },
    });

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (err) {
    console.error("Private course upload failed", err);
    return NextResponse.json({ error: t("private.api.uploadFailed") }, { status: 500 });
  }
}
