import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { sendWebinarRegistrationConfirmationEmail } from "@/lib/webinarConfirmationEmail";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`webinar-register:${ip}`, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!success) {
      return NextResponse.json(
        { error: "Prea multe cereri. Încearcă din nou într-un minut." },
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
        { error: "Prenumele trebuie să aibă cel puțin 2 caractere." },
        { status: 400 },
      );
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Adresa de email nu este validă." },
        { status: 400 },
      );
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Numărul de telefon nu este valid." },
        { status: 400 },
      );
    }
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "Trebuie să accepți termenii pentru a continua." },
        { status: 400 },
      );
    }

    await prisma.webinarRegistration.create({
      data: {
        firstName,
        email,
        phone,
        acceptedTerms: true,
      },
    });

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email, source: "webinar" },
        update: {},
      });
    } catch (newsErr) {
      console.error("Newsletter subscribe after webinar signup", newsErr);
    }

    await sendWebinarRegistrationConfirmationEmail(firstName, email);

    revalidatePath("/admin/webinar");
    revalidatePath("/admin/newsletter");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la înscrierea webinar", err);
    return NextResponse.json(
      { error: "Eroare internă la înscriere. Te rugăm să încerci din nou." },
      { status: 500 },
    );
  }
}
