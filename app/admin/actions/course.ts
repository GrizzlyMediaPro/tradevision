"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
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
  const rows = await prisma.courseChapter.findMany({
    orderBy: { order: "asc" },
  });
  const row = rows[index];
  if (!row) return;
  await prisma.courseChapter.delete({ where: { id: row.id } });
  revalidatePath("/admin/curs");
  revalidatePath("/curs");
}
