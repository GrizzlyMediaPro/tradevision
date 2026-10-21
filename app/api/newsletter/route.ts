import { NextResponse } from "next/server";
import { subscribeNewsletterAndSendWelcome } from "@/app/admin/actions/newsletter";
import { getT } from "@/lib/i18n/get-t";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const t = await getT();
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`newsletter:${ip}`, { maxRequests: 5, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: t("api.rateLimit") },
        { status: 429 },
      );
    }

    const { email, source } = (await req.json()) as {
      email?: string;
      source?: string;
    };

    const trimmed = email?.trim().toLowerCase();
    if (!trimmed) {
      return NextResponse.json({ error: t("api.newsletter.missing") }, { status: 400 });
    }

    await subscribeNewsletterAndSendWelcome(trimmed, source);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la API newsletter", err);
    return NextResponse.json(
      { error: t("api.newsletter.internal") },
      { status: 500 },
    );
  }
}
