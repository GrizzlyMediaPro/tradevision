import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const PRIVATE_COURSE_SLUG = "curs-mentorat";

export async function ensurePrivateCourse() {
  const existing = await prisma.privateCourse.findUnique({
    where: { slug: PRIVATE_COURSE_SLUG },
  });
  if (existing) return existing;

  return prisma.privateCourse.create({
    data: {
      title: "Curs Mentorat 1-on-1",
      slug: PRIVATE_COURSE_SLUG,
      description:
        "Curs video structurat pe capitole, disponibil după mentoratul 1-on-1.",
      status: "published",
    },
  });
}

export async function hasActiveEntitlement(
  clerkUserId: string,
  courseId: string,
): Promise<boolean> {
  const entitlement = await prisma.courseEntitlement.findUnique({
    where: {
      clerkUserId_courseId: { clerkUserId, courseId },
    },
  });
  return Boolean(entitlement && !entitlement.revokedAt);
}

export async function requireAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: not logged in");
  }
  return userId;
}

export async function requireCourseAccess(courseId?: string) {
  const userId = await requireAuthUserId();
  const course = courseId
    ? await prisma.privateCourse.findUnique({ where: { id: courseId } })
    : await ensurePrivateCourse();

  if (!course) {
    throw new Error("Course not found");
  }

  const allowed = await hasActiveEntitlement(userId, course.id);
  if (!allowed) {
    throw new Error("Forbidden: no course access");
  }

  return { userId, course };
}

export async function getCourseAccessForCurrentUser() {
  const user = await currentUser();
  if (!user) {
    return { user: null, course: null, hasAccess: false as const };
  }

  const course = await ensurePrivateCourse();
  const hasAccess = await hasActiveEntitlement(user.id, course.id);
  return { user, course, hasAccess };
}
