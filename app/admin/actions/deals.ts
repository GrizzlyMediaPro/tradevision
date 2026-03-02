"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type DealForm = {
  id?: string;
  firmSlug?: string;
  logo: string;
  name: string;
  rating: number;
  discount: string;
  code: string;
};

export async function getDeals() {
  const rows = await prisma.deal.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    firmSlug: r.firmSlug ?? undefined,
    logo: r.logo,
    name: r.name,
    rating: r.rating,
    discount: r.discount,
    code: r.code,
  }));
}

export async function createDeal(data: Omit<DealForm, "id">) {
  const count = await prisma.deal.count();
  await prisma.deal.create({
    data: {
      firmSlug: data.firmSlug ?? null,
      logo: data.logo,
      name: data.name,
      rating: data.rating,
      discount: data.discount,
      code: data.code,
      order: count,
    },
  });
  revalidatePath("/admin/deals");
  revalidatePath("/");
}

export async function updateDeal(id: string, data: Omit<DealForm, "id">) {
  await prisma.deal.update({
    where: { id },
    data: {
      firmSlug: data.firmSlug ?? null,
      logo: data.logo,
      name: data.name,
      rating: data.rating,
      discount: data.discount,
      code: data.code,
    },
  });
  revalidatePath("/admin/deals");
  revalidatePath("/");
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({ where: { id } });
  revalidatePath("/admin/deals");
  revalidatePath("/");
}

export async function getCarouselSettings() {
  const row = await prisma.dealCarouselSettings.findFirst();
  if (row)
    return {
      autoPlayEnabled: row.autoPlayEnabled,
      autoPlayInterval: row.autoPlayInterval,
    };
  return { autoPlayEnabled: true, autoPlayInterval: 10000 };
}

export async function setCarouselSettings(
  autoPlayEnabled: boolean,
  autoPlayInterval: number,
) {
  const existing = await prisma.dealCarouselSettings.findFirst();
  if (existing) {
    await prisma.dealCarouselSettings.update({
      where: { id: existing.id },
      data: { autoPlayEnabled, autoPlayInterval },
    });
  } else {
    await prisma.dealCarouselSettings.create({
      data: { autoPlayEnabled, autoPlayInterval },
    });
  }
  revalidatePath("/admin/deals");
  revalidatePath("/");
}
