import { NextResponse } from "next/server";
import { subscribeNewsletterAndSendWelcome } from "@/app/admin/actions/newsletter";

export async function POST(req: Request) {
  try {
    const { email, source } = (await req.json()) as {
      email?: string;
      source?: string;
    };

    const trimmed = email?.trim().toLowerCase();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Email lipsă" },
        { status: 400 }
      );
    }

    await subscribeNewsletterAndSendWelcome(trimmed, source);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la API newsletter", err);
    return NextResponse.json(
      { error: "Eroare internă la abonare newsletter" },
      { status: 500 }
    );
  }
}

