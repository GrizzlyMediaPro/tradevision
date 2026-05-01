import { resend, resendFrom } from "@/lib/resend";
import {
  renderEmailLayout,
  renderPlainTextBody,
  renderSimpleBodyAsHtml,
} from "@/lib/emailTemplates";
import { generateUnsubscribeToken } from "@/lib/unsubscribe";

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
    `Te-am adăugat și la newsletterul nostru, ca să primești noutăți și conținut educativ despre trading. Poți oricând să te dezabonezi din orice email.`,
    "",
    `Pagina webinar: ${SITE_URL}/webinar`,
    "",
    "Ne vedem la live!",
  ];

  const text = renderPlainTextBody(lines.join("\n"));
  const contentHtml = renderSimpleBodyAsHtml(lines.join("\n\n"));

  try {
    await resend.emails.send({
      from: resendFrom,
      to: trimmed,
      subject,
      text,
      html: renderEmailLayout({
        title: subject,
        previewText:
          "Înscrierea la webinar este confirmată. Vei primi reminder-uri pe email.",
        contentHtml,
        recipientEmail: trimmed,
        unsubscribeToken: generateUnsubscribeToken(trimmed),
      }),
    });
  } catch (err) {
    console.error("Failed to send webinar confirmation email", err);
  }
}
