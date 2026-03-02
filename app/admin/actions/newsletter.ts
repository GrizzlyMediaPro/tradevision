"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";

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
  await subscribeNewsletter(email, source);

  if (!resend) return;

  try {
    await resend.emails.send({
      from: "Trade Vision <onboarding@resend.dev>",
      to: email.trim().toLowerCase(),
      subject: "Bine ai venit în newsletterul Trade Vision",
      text: [
        "Salut,",
        "",
        "Mulțumim că te-ai abonat la newsletterul Trade Vision.",
        "Vei primi periodic conținut educativ și noutăți despre trading.",
        "",
        "Dacă nu tu ai făcut această înscriere, poți ignora acest email.",
      ].join("\n"),
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
    const { data, error } = await resend.emails.send({
      from: "Trade Vision <onboarding@resend.dev>",
      to: cleanedEmails,
      subject: trimmedSubject,
      text: trimmedBody || " ",
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
