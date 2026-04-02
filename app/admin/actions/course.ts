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
    lessonLabel: r.lessonLabel ?? undefined,
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
      lessonLabel: data.lessonLabel || null,
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
      lessonLabel: data.lessonLabel || null,
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

// —— Persoane înscrise la curs ——

export type CourseEnrollmentData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
};

export async function getCourseEnrollments(): Promise<CourseEnrollmentData[]> {
  await requireAdmin();
  const rows = await prisma.courseEnrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    phone: r.phone,
    createdAt: r.createdAt,
  }));
}

export async function deleteCourseEnrollment(id: string) {
  await requireAdmin();
  await prisma.courseEnrollment.delete({ where: { id } });
  revalidatePath("/admin/curs");
}
