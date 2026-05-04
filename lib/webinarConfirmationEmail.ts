import { resend, resendFrom } from "@/lib/resend";
import {
  escapeHtml,
  renderEmailLayout,
  renderPlainTextBody,
  renderSimpleBodyAsHtml,
} from "@/lib/emailTemplates";
import { generateUnsubscribeToken } from "@/lib/unsubscribe";
import { WEBINAR_WHATSAPP_INVITE_URL } from "@/lib/webinarWhatsAppInvite";

const SITE_URL = "https://trade-vision.ro";

export async function sendWebinarRegistrationConfirmationEmail(
  firstName: string,
  email: string,
) {
  if (!resend) return;

  const trimmed = email.trim().toLowerCase();
  const name = firstName.trim();
  const subject = "Înscrierea ta la webinarul Trade Vision este confirmată";

  const lines = [
    name ? `Salut ${name},` : "Salut,",
    "",
    "Îți confirmăm înscrierea la webinarul Trade Vision.",
    "Vei primi pe acest email reminder-uri și materiale utile înainte de eveniment.",
    "",
    "Ca să primești reminder-urile și materialele promise, intră acum în comunitatea noastră de WhatsApp:",
    WEBINAR_WHATSAPP_INVITE_URL,
    "",
    `Te-am adăugat și la newsletterul nostru, ca să primești noutăți și conținut educativ despre trading. Poți oricând să te dezabonezi din orice email.`,
    "",
    `Pagina webinar: ${SITE_URL}/webinar`,
    "",
    "Ne vedem la live!",
  ];

  const text = renderPlainTextBody(lines.join("\n"));

  const waIdx = lines.indexOf(WEBINAR_WHATSAPP_INVITE_URL);
  const introHtml = renderSimpleBodyAsHtml(
    lines.slice(0, waIdx).join("\n\n"),
  );
  const waHref = escapeHtml(WEBINAR_WHATSAPP_INVITE_URL);
  const waParagraph = `<p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: #000000;"><a href="${waHref}" target="_blank" rel="noopener noreferrer" style="color: #783dff; font-weight: 600; word-break: break-all;">${waHref}</a></p>`;
  const tailHtml = renderSimpleBodyAsHtml(
    lines.slice(waIdx + 1).join("\n\n"),
  );
  const contentHtml = introHtml + waParagraph + tailHtml;

  try {
    await resend.emails.send({
      from: resendFrom,
      to: trimmed,
      subject,
      text,
      html: renderEmailLayout({
        title: subject,
        previewText:
          "Înscrierea la webinar este confirmată. Intră în grupul de WhatsApp pentru reminder-uri și materiale.",
        contentHtml,
        recipientEmail: trimmed,
        unsubscribeToken: generateUnsubscribeToken(trimmed),
      }),
    });
  } catch (err) {
    console.error("Failed to send webinar confirmation email", err);
  }
}
