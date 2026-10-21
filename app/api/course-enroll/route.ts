import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subscribeNewsletterAndSendWelcome } from "@/app/admin/actions/newsletter";
import { getT } from "@/lib/i18n/get-t";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const t = await getT();
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`course-enroll:${ip}`, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!success) {
      return NextResponse.json(
        { error: t("api.rateLimit") },
        { status: 429 },
      );
    }

    const { firstName, lastName, email, phone } = (await req.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };

    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedFirst = firstName?.trim();
    const trimmedLast = lastName?.trim();
    const trimmedPhone = phone?.trim();

    if (!trimmedEmail || !trimmedFirst || !trimmedLast || !trimmedPhone) {
      return NextResponse.json(
        { error: t("api.enroll.required") },
        { status: 400 },
      );
    }

    await prisma.courseEnrollment.create({
      data: {
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        phone: trimmedPhone,
      },
    });

    await subscribeNewsletterAndSendWelcome(trimmedEmail, "curs-gratuit");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la înscriere curs", err);
    return NextResponse.json(
      { error: t("api.enroll.internal") },
      { status: 500 },
    );
  }
}
