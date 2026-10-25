import { resend, resendFrom } from "@/lib/resend";
import {
  escapeHtml,
  renderEmailLayout,
  renderPlainTextBody,
  renderSimpleBodyAsHtml,
} from "@/lib/emailTemplates";
import { generateUnsubscribeToken } from "@/lib/unsubscribe";
import { WEBINAR_WHATSAPP_INVITE_URL } from "@/lib/webinarWhatsAppInvite";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { messages } from "@/lib/i18n/messages/catalog";
import { translate } from "@/lib/i18n/translate";

const SITE_URL = "https://trade-vision.ro";

export async function sendWebinarRegistrationConfirmationEmail(
  firstName: string,
  email: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  if (!resend) return;

  const t = (id: string, vars?: Record<string, string | number>) =>
    translate(messages[locale], id, vars);
  const trimmed = email.trim().toLowerCase();
  const name = firstName.trim();
  const subject = t("email.webinar.subject");

  const lines = [
    name ? t("email.webinar.greetingNamed", { name }) : t("email.webinar.greeting"),
    "",
    t("email.webinar.confirmed"),
    t("email.webinar.reminders"),
    "",
    t("email.webinar.whatsapp"),
    WEBINAR_WHATSAPP_INVITE_URL,
    "",
    t("email.webinar.newsletter"),
    "",
    t("email.webinar.page", { url: `${SITE_URL}/webinar` }),
    "",
    t("email.webinar.signoff"),
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
        previewText: t("email.webinar.preview"),
        contentHtml,
        locale,
        recipientEmail: trimmed,
        unsubscribeToken: generateUnsubscribeToken(trimmed),
      }),
    });
  } catch (err) {
    console.error("Failed to send webinar confirmation email", err);
  }
}
