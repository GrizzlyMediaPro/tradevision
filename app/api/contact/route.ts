import { NextResponse } from "next/server";
import { sendContactEmail } from "@/app/(site)/contact/actions";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`contact:${ip}`, { maxRequests: 3, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: "Prea multe cereri. Încearcă din nou într-un minut." },
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
      return NextResponse.json({ error: "Email și mesaj obligatorii" }, { status: 400 });
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
    return NextResponse.json({ error: "Eroare internă" }, { status: 500 });
  }
}
