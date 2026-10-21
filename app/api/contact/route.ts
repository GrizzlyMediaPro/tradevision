import { NextResponse } from "next/server";
import { sendContactEmail } from "@/app/(site)/contact/actions";
import { getT } from "@/lib/i18n/get-t";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const t = await getT();
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`contact:${ip}`, { maxRequests: 3, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: t("api.rateLimit") },
        { status: 429 },
      );
    }

    const { name, email, phone, message } = (await req.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    if (!email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: t("api.contact.required") }, { status: 400 });
    }

    const formData = new FormData();
    formData.set("name", name ?? "");
    formData.set("email", email ?? "");
    formData.set("phone", phone ?? "");
    formData.set("message", message ?? "");

    await sendContactEmail(formData);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Eroare la API contact", err);
    return NextResponse.json({ error: t("api.contact.internal") }, { status: 500 });
  }
}
