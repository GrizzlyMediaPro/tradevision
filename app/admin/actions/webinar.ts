"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { getDefaultWebinarCountdownTarget } from "@/app/lib/webinarCountdown";

export type WebinarSettingsState = {
  webinarAt: string;
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

  const parsedDate = new Date(payload.webinarAt);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Data webinar invalida");
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
