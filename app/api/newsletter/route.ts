import { NextResponse } from "next/server";
import { subscribeNewsletterAndSendWelcome } from "@/app/admin/actions/newsletter";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`newsletter:${ip}`, { maxRequests: 5, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: "Prea multe cereri. Încearcă din nou într-un minut." },
        { status: 429 },
      );
    }

    const { email, source } = (await req.json()) as {
      email?: string;
      source?: string;
    };

    const trimmed = email?.trim().toLowerCase();
    if (!trimmed) {
      return NextResponse.json({ error: "Email lipsă" }, { status: 400 });
    }

    await subscribeNewsletterAndSendWelcome(trimmed, source);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la API newsletter", err);
    return NextResponse.json(
      { error: "Eroare internă la abonare newsletter" },
      { status: 500 },
    );
  }
}
