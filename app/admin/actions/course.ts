"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import type { CourseChapter } from "@/app/data/courseChapters";

export async function getCourseChapters(): Promise<CourseChapter[]> {
  const rows = await prisma.courseChapter.findMany({
    orderBy: { order: "asc" },
  });
  return rows.map((r) => ({
    title: r.title,
    description: r.description ?? "",
    videoId: r.videoId,
  }));
}

export async function createCourseChapter(data: CourseChapter) {
  await requireAdmin();
  const count = await prisma.courseChapter.count();
  await prisma.courseChapter.create({
    data: {
      title: data.title,
      description: data.description || null,
      videoId: data.videoId,
      order: count,
    },
  });
  revalidatePath("/admin/curs");
  revalidatePath("/curs");
}

export async function updateCourseChapter(
  index: number,
  data: CourseChapter,
) {
  await requireAdmin();
  const rows = await prisma.courseChapter.findMany({
    orderBy: { order: "asc" },
  });
  const row = rows[index];
  if (!row) return;
  await prisma.courseChapter.update({
    where: { id: row.id },
    data: {
      title: data.title,
      description: data.description || null,
      videoId: data.videoId,
    },
  });
  revalidatePath("/admin/curs");
  revalidatePath("/curs");
}

export async function deleteCourseChapter(index: number) {
  await requireAdmin();
  const rows = await prisma.courseChapter.findMany({
    orderBy: { order: "asc" },
  });
  const row = rows[index];
  if (!row) return;
  await prisma.courseChapter.delete({ where: { id: row.id } });
  revalidatePath("/admin/curs");
  revalidatePath("/curs");
}
