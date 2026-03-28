"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export type LinkWidgetState = {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  thumbnail: string;
  youtubeUrl?: string;
};

const DEFAULTS: LinkWidgetState = {
  badge: "Live Trading",
  title: "Watch Us Trade Live on YouTube",
  description:
    "Alătură-te live-urilor Trade Vision pentru sesiuni de day trading, Q&A și analiză de piață în timp real.",
  buttonText: "Watch Stream",
  thumbnail: "/thumbnail.png",
};

export async function getLinkWidget(): Promise<LinkWidgetState> {
  const row = await prisma.linkWidget.findFirst();
  if (!row)
    return DEFAULTS;
  return {
    badge: row.badge,
    title: row.title,
    description: row.description ?? "",
    buttonText: row.buttonText,
    thumbnail: row.thumbnail ?? DEFAULTS.thumbnail,
    youtubeUrl: row.youtubeUrl ?? undefined,
  };
}

export async function saveLinkWidget(data: LinkWidgetState) {
  await requireAdmin();
  const existing = await prisma.linkWidget.findFirst();
  const payload = {
    badge: data.badge,
    title: data.title,
    description: data.description || null,
    buttonText: data.buttonText,
    thumbnail: data.thumbnail || null,
    youtubeUrl: data.youtubeUrl ?? null,
  };
  if (existing) {
    await prisma.linkWidget.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    await prisma.linkWidget.create({ data: payload });
  }
  revalidatePath("/admin/linkwidget");
  revalidatePath("/");
  revalidatePath("/contact");
}
