"use server";

import { resend } from "@/lib/resend";
import { submitContactMessage } from "../admin/actions/contact";

export async function sendContactEmail(formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();

  if (!email || !message) {
    return;
  }

  // 1) Salvăm mesajul în baza de date pentru pagina de admin
  await submitContactMessage({
    name,
    email,
    phone: phone || undefined,
    message,
  });

  // 2) Trimitem emailul prin Resend
  if (!resend) {
    console.error("Resend client is not configured (missing RESEND or RESEND_API_KEY).");
    return;
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.error("CONTACT_TO_EMAIL is not set in environment.");
    return;
  }

  const subjectBase = name ? `Formular contact de la ${name}` : "Mesaj nou din formularul de contact";

  const { data, error } = await resend.emails.send({
    from: "Trade Vision <onboarding@resend.dev>",
    to,
    replyTo: email || undefined,
    subject: subjectBase,
    text: [
      name && `Nume: ${name}`,
      `Email: ${email}`,
      phone && `Telefon: ${phone}`,
      "",
      "Mesaj:",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("Resend email error (contact):", error);
    throw new Error(`Resend contact form failed: ${error.message ?? "Unknown error"}`);
  }

  console.log("Resend contact email sent:", data);
}

