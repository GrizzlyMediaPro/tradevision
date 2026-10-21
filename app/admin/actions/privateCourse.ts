"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import {
  ensurePrivateCourse,
  PRIVATE_COURSE_SLUG,
} from "@/lib/privateCourseAccess";
import {
  createDirectUpload,
  isMuxConfigured,
  retrieveAsset,
  retrieveUpload,
} from "@/lib/mux";

export type PrivateChapterDTO = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: PrivateLessonDTO[];
};

export type PrivateLessonDTO = {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  order: number;
  muxPlaybackId: string | null;
  muxAssetId: string | null;
  muxUploadId: string | null;
  durationSeconds: number | null;
  status: string;
};

export type EntitlementDTO = {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  grantedAt: string;
  grantedByAdminId: string;
  notes: string | null;
  revokedAt: string | null;
  completedLessons: number;
  totalLessons: number;
};

function revalidatePrivateCoursePaths() {
  revalidatePath("/admin/curs-mentorat");
  revalidatePath("/curs-mentorat");
}

export async function getPrivateCourseAdminData() {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  const chapters = await prisma.privateCourseChapter.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
  });
  const lessons = await prisma.privateCourseLesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: "asc" },
  });

  const chapterDTOs: PrivateChapterDTO[] = chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    description: ch.description,
    order: ch.order,
    lessons: lessons
      .filter((l) => l.chapterId === ch.id)
      .map((l) => ({
        id: l.id,
        chapterId: l.chapterId,
        title: l.title,
        description: l.description,
        order: l.order,
        muxPlaybackId: l.muxPlaybackId,
        muxAssetId: l.muxAssetId,
        muxUploadId: l.muxUploadId,
        durationSeconds: l.durationSeconds,
        status: l.status,
      })),
  }));

  return {
    course: {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      status: course.status,
    },
    chapters: chapterDTOs,
    muxConfigured: isMuxConfigured(),
  };
}

export async function updatePrivateCourseMeta(data: {
  title: string;
  description: string;
}) {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  await prisma.privateCourse.update({
    where: { id: course.id },
    data: {
      title: data.title.trim(),
      description: data.description.trim() || null,
    },
  });
  revalidatePrivateCoursePaths();
}

export async function createPrivateChapter(data: {
  title: string;
  description?: string;
}) {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  const count = await prisma.privateCourseChapter.count({
    where: { courseId: course.id },
  });
  await prisma.privateCourseChapter.create({
    data: {
      courseId: course.id,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      order: count,
    },
  });
  revalidatePrivateCoursePaths();
}

export async function updatePrivateChapter(
  chapterId: string,
  data: { title: string; description?: string },
) {
  await requireAdmin();
  await prisma.privateCourseChapter.update({
    where: { id: chapterId },
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
    },
  });
  revalidatePrivateCoursePaths();
}

export async function deletePrivateChapter(chapterId: string) {
  await requireAdmin();
  await prisma.privateCourseLesson.deleteMany({ where: { chapterId } });
  await prisma.privateCourseChapter.delete({ where: { id: chapterId } });
  revalidatePrivateCoursePaths();
}

export async function createPrivateLesson(data: {
  chapterId: string;
  title: string;
  description?: string;
}) {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  const chapter = await prisma.privateCourseChapter.findUnique({
    where: { id: data.chapterId },
  });
  if (!chapter || chapter.courseId !== course.id) {
    throw new Error("Capitol invalid");
  }
  const count = await prisma.privateCourseLesson.count({
    where: { chapterId: data.chapterId },
  });
  await prisma.privateCourseLesson.create({
    data: {
      courseId: course.id,
      chapterId: data.chapterId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      order: count,
      status: "pending",
    },
  });
  revalidatePrivateCoursePaths();
}

export async function updatePrivateLesson(
  lessonId: string,
  data: { title: string; description?: string },
) {
  await requireAdmin();
  await prisma.privateCourseLesson.update({
    where: { id: lessonId },
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
    },
  });
  revalidatePrivateCoursePaths();
}

export async function deletePrivateLesson(lessonId: string) {
  await requireAdmin();
  await prisma.lessonProgress.deleteMany({ where: { lessonId } });
  await prisma.privateCourseLesson.delete({ where: { id: lessonId } });
  revalidatePrivateCoursePaths();
}

export async function createMuxUploadForLesson(lessonId: string) {
  await requireAdmin();
  if (!isMuxConfigured()) {
    throw new Error("Mux nu este configurat");
  }

  const lesson = await prisma.privateCourseLesson.findUnique({
    where: { id: lessonId },
  });
  if (!lesson) throw new Error("Lecție inexistentă");

  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const upload = await createDirectUpload(origin);
  await prisma.privateCourseLesson.update({
    where: { id: lessonId },
    data: {
      muxUploadId: upload.id,
      muxAssetId: null,
      muxPlaybackId: null,
      status: "pending",
      durationSeconds: null,
    },
  });
  revalidatePrivateCoursePaths();

  return { uploadUrl: upload.url, uploadId: upload.id };
}

export async function syncLessonFromMux(lessonId: string) {
  await requireAdmin();
  if (!isMuxConfigured()) {
    throw new Error("Mux nu este configurat");
  }

  const lesson = await prisma.privateCourseLesson.findUnique({
    where: { id: lessonId },
  });
  if (!lesson) throw new Error("Lecție inexistentă");

  let assetId = lesson.muxAssetId;

  if (!assetId && lesson.muxUploadId) {
    const upload = await retrieveUpload(lesson.muxUploadId);
    assetId = upload.asset_id ?? null;
    if (!assetId) {
      await prisma.privateCourseLesson.update({
        where: { id: lessonId },
        data: { status: "processing" },
      });
      revalidatePrivateCoursePaths();
      return { status: "processing" as const };
    }
  }

  if (!assetId) {
    throw new Error("Nu există asset Mux pentru această lecție");
  }

  const asset = await retrieveAsset(assetId);
  const playbackId =
    asset.playback_ids?.find((p) => p.policy === "signed")?.id ??
    asset.playback_ids?.[0]?.id ??
    null;

  const ready = asset.status === "ready";
  await prisma.privateCourseLesson.update({
    where: { id: lessonId },
    data: {
      muxAssetId: assetId,
      muxPlaybackId: playbackId,
      durationSeconds: asset.duration ?? null,
      status: ready ? "ready" : asset.status === "errored" ? "error" : "processing",
    },
  });
  revalidatePrivateCoursePaths();
  return { status: ready ? ("ready" as const) : ("processing" as const) };
}

export async function grantCourseAccess(input: {
  emailOrUserId: string;
  notes?: string;
}) {
  const admin = await requireAdmin();
  const course = await ensurePrivateCourse();
  const query = input.emailOrUserId.trim();
  if (!query) throw new Error("Email sau user ID obligatoriu");

  const client = await clerkClient();
  let clerkUserId: string | null = null;

  if (query.startsWith("user_")) {
    try {
      const user = await client.users.getUser(query);
      clerkUserId = user.id;
    } catch {
      clerkUserId = null;
    }
  }

  if (!clerkUserId) {
    const list = await client.users.getUserList({
      emailAddress: [query.toLowerCase()],
      limit: 1,
    });
    clerkUserId = list.data[0]?.id ?? null;
  }

  if (!clerkUserId) {
    throw new Error("Utilizatorul nu a fost găsit în Clerk");
  }

  await prisma.courseEntitlement.upsert({
    where: {
      clerkUserId_courseId: { clerkUserId, courseId: course.id },
    },
    create: {
      clerkUserId,
      courseId: course.id,
      grantedByAdminId: admin.id,
      notes: input.notes?.trim() || null,
      revokedAt: null,
      grantedAt: new Date(),
    },
    update: {
      grantedByAdminId: admin.id,
      notes: input.notes?.trim() || null,
      revokedAt: null,
      grantedAt: new Date(),
    },
  });

  revalidatePrivateCoursePaths();
  return { clerkUserId };
}

export async function revokeCourseAccess(clerkUserId: string) {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  await prisma.courseEntitlement.updateMany({
    where: { clerkUserId, courseId: course.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  revalidatePrivateCoursePaths();
}

export async function getCourseEntitlements(): Promise<EntitlementDTO[]> {
  await requireAdmin();
  const course = await ensurePrivateCourse();
  const rows = await prisma.courseEntitlement.findMany({
    where: { courseId: course.id, revokedAt: null },
    orderBy: { grantedAt: "desc" },
  });

  const totalLessons = await prisma.privateCourseLesson.count({
    where: { courseId: course.id, status: "ready" },
  });

  const client = await clerkClient();
  const results: EntitlementDTO[] = [];

  for (const row of rows) {
    let email = "";
    let firstName = "";
    let lastName = "";
    let imageUrl = "";
    try {
      const user = await client.users.getUser(row.clerkUserId);
      email = user.emailAddresses[0]?.emailAddress ?? "";
      firstName = user.firstName ?? "";
      lastName = user.lastName ?? "";
      imageUrl = user.imageUrl ?? "";
    } catch {
      email = row.clerkUserId;
    }

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        clerkUserId: row.clerkUserId,
        courseId: course.id,
        completed: true,
      },
    });

    results.push({
      id: row.id,
      clerkUserId: row.clerkUserId,
      email,
      firstName,
      lastName,
      imageUrl,
      grantedAt: row.grantedAt.toISOString(),
      grantedByAdminId: row.grantedByAdminId,
      notes: row.notes,
      revokedAt: row.revokedAt?.toISOString() ?? null,
      completedLessons,
      totalLessons,
    });
  }

  return results;
}

export async function getPrivateCourseSlug() {
  return PRIVATE_COURSE_SLUG;
}
