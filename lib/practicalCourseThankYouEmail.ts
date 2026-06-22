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

export async function sendPracticalCourseThankYouEmail(input: {
  recipientEmail: string;
  recipientName: string;
  finalAmountEur: number;
  invoicePdf?: Buffer | null;
  invoiceSeries?: string | null;
  invoiceNumber?: string | null;
}) {
  if (!resend) {
    console.warn("Resend nu este configurat; emailul de mulțumire nu a fost trimis.");
    return;
  }

  const email = input.recipientEmail.trim().toLowerCase();
  const name = input.recipientName.trim() || "participant";
  const subject = `Mulțumim pentru achiziția ${PRACTICAL_COURSE.title}`;

  const invoiceLine =
    input.invoiceSeries && input.invoiceNumber
      ? `Factura fiscală ${input.invoiceSeries} ${input.invoiceNumber} este atașată la acest email.`
      : "Factura fiscală îți va fi trimisă separat, dacă este cazul.";

  const telegramUrl = PRACTICAL_COURSE.telegramGroupUrl;

  const lines = [
    `Salut ${name},`,
    "",
    `Îți mulțumim pentru achiziția ${PRACTICAL_COURSE.title}.`,
    "",
    `Ai achiziționat: ${PRACTICAL_COURSE.title}.`,
    "",
    `Suma plătită: ${formatPriceEur(input.finalAmountEur)}.`,
    "",
    invoiceLine,
    "",
    "Mai jos ai link-ul pentru acces în grupul de curs, acolo unde sunt materiale și acces la ședințele live.",
    "",
    telegramUrl,
    "",
    "Dacă ai întrebări, ne poți contacta prin canalele oficiale de pe site.",
    "",
    "Îți dorim mult succes în parcursul tău de învățare!",
  ];

  const text = renderPlainTextBody(
    [...lines, "", "Cu respect,", "Trade Vision România"].join("\n"),
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
            filename:
              input.invoiceSeries && input.invoiceNumber
                ? `Factura_${input.invoiceSeries}_${input.invoiceNumber}.pdf`
                : "Factura.pdf",
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
        previewText:
          "Plata cursului a fost confirmată. Găsești linkul către grupul de curs în acest email.",
        contentHtml,
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
  invoiceSeries: string;
  invoiceNumber: string;
}) {
  if (!resend) {
    console.warn("Resend nu este configurat; factura nu a fost trimisă.");
    return;
  }

  const email = input.recipientEmail.trim().toLowerCase();
  const name = input.recipientName.trim() || "participant";
  const subject = `Factura ta ${PRACTICAL_COURSE.title}`;

  const lines = [
    `Salut ${name},`,
    "",
    `Îți trimitem factura fiscală pentru achiziția ${PRACTICAL_COURSE.title}.`,
    `Număr factură: ${input.invoiceSeries} ${input.invoiceNumber}.`,
    "",
    "Documentul PDF este atașat la acest email.",
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
      previewText: "Factura fiscală pentru Curs Futures este atașată.",
      contentHtml,
      recipientEmail: email,
      unsubscribeToken: generateUnsubscribeToken(email),
    }),
    attachments: [
      {
        filename: `Factura_${input.invoiceSeries}_${input.invoiceNumber}.pdf`,
        content: input.invoicePdf,
      },
    ],
  });
}