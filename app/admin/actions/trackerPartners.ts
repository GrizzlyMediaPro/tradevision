"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export type TrackerPartner = {
  id: string;
  name: string;
  url: string;
};

export async function getTrackerPartners(): Promise<TrackerPartner[]> {
  const rows = await prisma.trackerPartnerLink.findMany({
    orderBy: { order: "asc" },
  });
  return rows.map((row) => ({ id: row.id, name: row.name, url: row.url }));
}

export async function createTrackerPartner(data: {
  name: string;
  url: string;
}) {
  await requireAdmin();
  const name = data.name.trim();
  const url = data.url.trim();
  if (!name || !url) throw new Error("Numele și link-ul sunt obligatorii.");

  const count = await prisma.trackerPartnerLink.count();
  await prisma.trackerPartnerLink.create({
    data: { name, url, order: count },
  });
  revalidatePath("/admin/tracking-firms");
  revalidatePath("/payout");
}

export async function updateTrackerPartner(
  id: string,
  data: { name: string; url: string }
) {
  await requireAdmin();
  const name = data.name.trim();
  const url = data.url.trim();
  if (!name || !url) throw new Error("Numele și link-ul sunt obligatorii.");

  await prisma.trackerPartnerLink.update({
    where: { id },
    data: { name, url },
  });
  revalidatePath("/admin/tracking-firms");
  revalidatePath("/payout");
}

export async function deleteTrackerPartner(id: string) {
  await requireAdmin();
  await prisma.trackerPartnerLink.delete({ where: { id } });
  revalidatePath("/admin/tracking-firms");
  revalidatePath("/payout");
}
