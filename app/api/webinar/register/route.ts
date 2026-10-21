import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import {
  createWebinarConfirmToken,
  WEBINAR_CONFIRM_COOKIE_NAME,
  WEBINAR_CONFIRM_MAX_AGE_SEC,
} from "@/lib/webinarConfirmCookie";
import { sendWebinarRegistrationConfirmationEmail } from "@/lib/webinarConfirmationEmail";
import { getLocale, getT } from "@/lib/i18n/get-t";
import {
  isWebinarJamConfigured,
  registerAttendeeWithWebinarJam,
} from "@/lib/webinarJam";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

export async function POST(req: Request) {
  const t = await getT();
  const locale = await getLocale();
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`webinar-register:${ip}`, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!success) {
      return NextResponse.json(
        { error: t("api.rateLimit") },
        { status: 429 },
      );
    }

    const body = (await req.json()) as {
      firstName?: string;
      email?: string;
      phone?: string;
      acceptedTerms?: boolean;
    };

    const firstName = body.firstName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const phone = body.phone?.trim() ?? "";
    const acceptedTerms = body.acceptedTerms === true;

    if (firstName.length < 2) {
      return NextResponse.json(
        { error: t("webinar.api.firstName") },
        { status: 400 },
      );
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: t("webinar.api.email") },
        { status: 400 },
      );
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: t("webinar.api.phone") },
        { status: 400 },
      );
    }
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: t("webinar.api.terms") },
        { status: 400 },
      );
    }

    const existing = await prisma.webinarRegistration.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: t("webinar.api.duplicate"),
        },
        { status: 409 },
      );
    }

    if (isWebinarJamConfigured()) {
      const wj = await registerAttendeeWithWebinarJam({
        firstName,
        email,
        phone,
        clientIp: ip !== "unknown" ? ip : undefined,
      });
      if (!wj.ok) {
        if (wj.logDetail) {
          console.error("WebinarJam register:", wj.logDetail);
        }
        return NextResponse.json(
          { error: t(wj.userMessage, wj.userMessageVars) },
          { status: wj.alreadyRegistered ? 409 : 502 },
        );
      }
    }

    try {
      await prisma.webinarRegistration.create({
        data: {
          firstName,
          email,
          phone,
          acceptedTerms: true,
        },
      });
    } catch (createErr) {
      if (
        createErr instanceof Prisma.PrismaClientKnownRequestError &&
        createErr.code === "P2002"
      ) {
        return NextResponse.json(
          {
            error: t("webinar.api.duplicate"),
          },
          { status: 409 },
        );
      }
      throw createErr;
    }

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email, source: "webinar" },
        update: {},
      });
    } catch (newsErr) {
      console.error("Newsletter subscribe after webinar signup", newsErr);
    }

    await sendWebinarRegistrationConfirmationEmail(firstName, email, locale);

    revalidatePath("/admin/webinar");
    revalidatePath("/admin/newsletter");

    const token = await createWebinarConfirmToken(firstName);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(WEBINAR_CONFIRM_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: WEBINAR_CONFIRM_MAX_AGE_SEC,
    });
    return res;
  } catch (err) {
    console.error("Eroare la înscrierea webinar", err);
    return NextResponse.json(
      { error: t("webinar.api.internal") },
      { status: 500 },
    );
  }
}
