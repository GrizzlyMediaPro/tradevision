"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { resend, resendFrom } from "@/lib/resend";
import {
  renderEmailLayout,
  renderPlainTextBody,
  renderSimpleBodyAsHtml,
} from "@/lib/emailTemplates";

export type SubscriberRow = {
  id: string;
  email: string;
  subscribedAt: Date;
  source?: string;
};

export async function getNewsletterSubscribers(): Promise<SubscriberRow[]> {
  const rows = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    subscribedAt: r.subscribedAt,
    source: r.source ?? undefined,
  }));
}

export async function deleteNewsletterSubscriber(id: string) {
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

// Pentru formularul public de newsletter (abonare)
export async function subscribeNewsletter(email: string, source?: string) {
  await prisma.newsletterSubscriber.upsert({
    where: { email: email.trim().toLowerCase() },
    create: {
      email: email.trim().toLowerCase(),
      source: source ?? null,
    },
    update: {},
  });
  revalidatePath("/admin/newsletter");
}

export async function subscribeNewsletterAndSendWelcome(
  email: string,
  source?: string,
) {
  const trimmedEmail = email.trim().toLowerCase();

  // Check if already subscribed — if so, just upsert (no-op) and skip the email
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: trimmedEmail },
  });

  await subscribeNewsletter(email, source);

  if (existing) return; // already subscribed, don't email again
  if (!resend) return;

  try {
    const subject = "Bine ai venit în newsletterul Trade Vision";

    const text = renderPlainTextBody(
      [
        "Salut,",
        "",
        "Mulțumim că te-ai abonat la newsletterul Trade Vision.",
        "Vei primi periodic conținut educativ și noutăți despre trading.",
        "",
        "Dacă nu tu ai făcut această înscriere, poți ignora acest email.",
      ].join("\n"),
    );

    const contentHtml = renderSimpleBodyAsHtml(
      [
        "Salut,",
        "",
        "Mulțumim că te-ai abonat la newsletterul Trade Vision.",
        "Vei primi periodic conținut educativ și noutăți despre trading.",
        "",
        "Dacă nu tu ai făcut această înscriere, poți ignora acest email.",
      ].join("\n\n"),
    );

    await resend.emails.send({
      from: resendFrom,
      to: trimmedEmail,
      subject,
      text,
      html: renderEmailLayout({
        title: subject,
        previewText:
          "Mulțumim că te-ai abonat la newsletterul Trade Vision. Vei primi periodic conținut educativ și noutăți despre trading.",
        contentHtml,
      }),
    });
  } catch (err) {
    console.error("Failed to send newsletter welcome email", err);
  }
}

export async function sendNewsletterToSubscribers(
  emails: string[],
  subject: string,
  body: string,
) {
  const cleanedEmails = emails
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!cleanedEmails.length) return;

  if (!resend) {
    console.error("Resend client is not configured (missing RESEND or RESEND_API_KEY).");
    return;
  }

  const trimmedSubject = subject.trim() || "Trade Vision Newsletter";
  const trimmedBody = body.trim();

  try {
    const text = renderPlainTextBody(trimmedBody);
    const contentHtml = renderSimpleBodyAsHtml(
      trimmedBody || " ",
    );

    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: cleanedEmails,
      subject: trimmedSubject,
      text,
      html: renderEmailLayout({
        title: trimmedSubject,
        previewText: trimmedBody.slice(0, 140),
        contentHtml,
      }),
    });

    if (error) {
      console.error("Resend newsletter error:", error);
      throw new Error(error.message ?? "Unknown newsletter error");
    }

    console.log("Resend newsletter sent:", data);
  } catch (err) {
    console.error("Failed to send newsletter campaign", err);
    throw err;
  }
}
