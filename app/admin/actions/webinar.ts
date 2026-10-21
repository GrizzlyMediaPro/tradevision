"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { getT } from "@/lib/i18n/get-t";
import { getDefaultWebinarCountdownTarget } from "@/app/lib/webinarCountdown";

export type WebinarSettingsState = {
  webinarAt: string;
};

export type WebinarRegistrationRow = {
  id: string;
  firstName: string;
  email: string;
  phone: string;
  acceptedTerms: boolean;
  createdAt: string;
};

function getDefaultWebinarDateIso() {
  return new Date(getDefaultWebinarCountdownTarget()).toISOString();
}

export async function getWebinarSettings(): Promise<WebinarSettingsState> {
  const row = await prisma.webinarSettings.findFirst();

  if (!row) {
    return { webinarAt: getDefaultWebinarDateIso() };
  }

  return { webinarAt: row.webinarAt.toISOString() };
}

export async function saveWebinarSettings(payload: WebinarSettingsState) {
  await requireAdmin();

  const t = await getT();
  const parsedDate = new Date(payload.webinarAt);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(t("admin.webinar.error.date"));
  }

  const existing = await prisma.webinarSettings.findFirst();

  if (existing) {
    await prisma.webinarSettings.update({
      where: { id: existing.id },
      data: { webinarAt: parsedDate },
    });
  } else {
    await prisma.webinarSettings.create({
      data: { webinarAt: parsedDate },
    });
  }

  revalidatePath("/admin/webinar");
  revalidatePath("/webinar");
}

export async function getWebinarRegistrations(): Promise<WebinarRegistrationRow[]> {
  await requireAdmin();

  const rows = await prisma.webinarRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    firstName: r.firstName,
    email: r.email,
    phone: r.phone,
    acceptedTerms: r.acceptedTerms,
    createdAt: r.createdAt.toISOString(),
  }));
}
