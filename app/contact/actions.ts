 "use server";

import { resend, resendFrom } from "@/lib/resend";
import { submitContactMessage } from "../admin/actions/contact";
import {
  escapeHtml,
  renderEmailLayout,
  renderPlainTextFromLines,
} from "@/lib/emailTemplates";

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
    console.error(
      "Resend client is not configured (missing RESEND or RESEND_API_KEY).",
    );
    return;
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.error("CONTACT_TO_EMAIL is not set in environment.");
    return;
  }

  const subjectBase = name
    ? `Formular contact de la ${name}`
    : "Mesaj nou din formularul de contact";

  const text = renderPlainTextFromLines([
    name && `Nume: ${name}`,
    `Email: ${email}`,
    phone && `Telefon: ${phone}`,
    "",
    "Mesaj:",
    message,
  ]);

  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const contentHtml = `
    <p style="margin:0 0 12px;line-height:1.6;font-size:14px;color:#e5e7eb;">
      Ai primit un mesaj nou din formularul de contact de pe
      <strong style="color:#fbbf24;">TradeVision România</strong>.
    </p>
    <table role="presentation" cellPadding="0" cellSpacing="0" style="margin:16px 0 18px;width:100%;border-collapse:collapse;">
      <tbody>
        ${
          name
            ? `<tr>
                <td style="padding:4px 0;font-size:13px;color:#9ca3af;width:110px;">Nume</td>
                <td style="padding:4px 0;font-size:13px;color:#e5e7eb;">${escapeHtml(name)}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#9ca3af;width:110px;">Email</td>
          <td style="padding:4px 0;font-size:13px;color:#e5e7eb;">${escapeHtml(email)}</td>
        </tr>
        ${
          phone
            ? `<tr>
                <td style="padding:4px 0;font-size:13px;color:#9ca3af;width:110px;">Telefon</td>
                <td style="padding:4px 0;font-size:13px;color:#e5e7eb;">${escapeHtml(phone)}</td>
              </tr>`
            : ""
        }
      </tbody>
    </table>
    <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;">Mesaj:</p>
    <div style="margin:0 0 4px;padding:12px 14px;border-radius:12px;border:1px solid rgba(148,163,184,0.4);background:rgba(15,23,42,0.85);font-size:13px;line-height:1.7;color:#e5e7eb;white-space:pre-wrap;">
      ${safeMessage}
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: resendFrom,
    to,
    replyTo: email || undefined,
    subject: subjectBase,
    text,
    html: renderEmailLayout({
      title: subjectBase,
      previewText: message.slice(0, 140),
      contentHtml,
    }),
  });

  if (error) {
    console.error("Resend email error (contact):", error);
    throw new Error(
      `Resend contact form failed: ${error.message ?? "Unknown error"}`,
    );
  }

  console.log("Resend contact email sent:", data);
}

