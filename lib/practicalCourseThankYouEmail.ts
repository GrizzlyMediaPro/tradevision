import { resend, resendFrom } from "@/lib/resend";
import {
  escapeHtml,
  renderEmailLayout,
  renderPlainTextBody,
  renderSimpleBodyAsHtml,
} from "@/lib/emailTemplates";
import { generateUnsubscribeToken } from "@/lib/unsubscribe";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { formatPriceEur } from "@/lib/practicalCoursePricing";
import type { Locale } from "@/lib/i18n/locale";
import { messages } from "@/lib/i18n/messages/catalog";
import { translate, type Vars } from "@/lib/i18n/translate";

export async function sendPracticalCourseThankYouEmail(input: {
  recipientEmail: string;
  recipientName: string;
  finalAmountEur: number;
  invoicePdf?: Buffer | null;
  invoiceSeries?: string | null;
  invoiceNumber?: string | null;
  locale?: Locale;
}) {
  if (!resend) {
    console.warn("Resend nu este configurat; emailul de mulțumire nu a fost trimis.");
    return;
  }

  const locale = input.locale ?? "en";
  const t = (id: string, vars?: Vars) => translate(messages[locale], id, vars);
  const title = t("futures.title");
  const email = input.recipientEmail.trim().toLowerCase();
  const name = input.recipientName.trim() || t("email.course.fallbackName");
  const subject = t("email.course.subject", { title });

  const invoiceLine = input.invoiceNumber
    ? t("email.course.invoiceAttached", {
        number: input.invoiceNumber,
      })
    : t("email.course.invoiceLater");

  const telegramUrl = PRACTICAL_COURSE.telegramGroupUrl;

  const lines = [
    t("email.course.greeting", { name }),
    "",
    t("email.course.thanks", { title }),
    "",
    t("email.course.purchased", { title }),
    "",
    t("email.course.paid", { amount: formatPriceEur(input.finalAmountEur) }),
    "",
    invoiceLine,
    "",
    t("email.course.group"),
    "",
    telegramUrl,
    "",
    t("email.course.questions"),
    "",
    t("email.course.success"),
  ];

  const text = renderPlainTextBody(
    [...lines, "", t("email.respect"), "Trade Vision România"].join("\n"),
  );

  const telegramIdx = lines.indexOf(telegramUrl);
  const introHtml = renderSimpleBodyAsHtml(
    lines.slice(0, telegramIdx).join("\n\n"),
  );
  const telegramHref = escapeHtml(telegramUrl);
  const telegramParagraph = `<p style="margin: 0 0 12px; line-height: 1.6; font-size: 14px; color: #000000;"><a href="${telegramHref}" target="_blank" rel="noopener noreferrer" style="color: #783dff; font-weight: 600; word-break: break-all;">${telegramHref}</a></p>`;
  const tailHtml = renderSimpleBodyAsHtml(
    lines.slice(telegramIdx + 1).join("\n\n"),
  );
  const contentHtml = introHtml + telegramParagraph + tailHtml;

  const attachments =
    input.invoicePdf && input.invoicePdf.length > 0
      ? [
          {
            filename: input.invoiceNumber
              ? t("email.course.invoiceFilename", {
                  number: input.invoiceNumber,
                })
              : t("email.course.invoiceFilenameFallback"),
            content: input.invoicePdf,
          },
        ]
      : undefined;

  try {
    await resend.emails.send({
      from: resendFrom,
      to: email,
      subject,
      text,
      html: renderEmailLayout({
        title: subject,
        previewText: t("email.course.preview"),
        contentHtml,
        locale,
        recipientEmail: email,
        unsubscribeToken: generateUnsubscribeToken(email),
      }),
      attachments,
    });
  } catch (err) {
    console.error("Failed to send practical course thank-you email", err);
    throw err;
  }
}

export async function sendPracticalCourseInvoiceEmail(input: {
  recipientEmail: string;
  recipientName: string;
  invoicePdf: Buffer;
  invoiceNumber: string;
  locale?: Locale;
}) {
  if (!resend) {
    console.warn("Resend nu este configurat; factura nu a fost trimisă.");
    return;
  }

  const locale = input.locale ?? "en";
  const t = (id: string, vars?: Vars) => translate(messages[locale], id, vars);
  const title = t("futures.title");
  const email = input.recipientEmail.trim().toLowerCase();
  const name = input.recipientName.trim() || t("email.course.fallbackName");
  const subject = t("email.invoice.subject", { title });

  const lines = [
    t("email.course.greeting", { name }),
    "",
    t("email.invoice.body", { title }),
    t("email.invoice.number", {
      number: input.invoiceNumber,
    }),
    "",
    t("email.invoice.attached"),
  ];

  const text = renderPlainTextBody(lines.join("\n"));
  const contentHtml = renderSimpleBodyAsHtml(lines.join("\n\n"));

  await resend.emails.send({
    from: resendFrom,
    to: email,
    subject,
    text,
    html: renderEmailLayout({
      title: subject,
      previewText: t("email.invoice.preview"),
      contentHtml,
      locale,
      recipientEmail: email,
      unsubscribeToken: generateUnsubscribeToken(email),
    }),
    attachments: [
      {
        filename: t("email.course.invoiceFilename", {
          number: input.invoiceNumber,
        }),
        content: input.invoicePdf,
      },
    ],
  });
}