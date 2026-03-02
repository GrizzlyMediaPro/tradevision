"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { FirmDetail } from "@/app/data/firms";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getFirms(): Promise<FirmDetail[]> {
  const rows = await prisma.firm.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({
    name: r.name,
    slug: r.slug,
    logo: r.logo,
    payout: r.payout ?? "",
    country: r.country ?? "",
    flag: r.flag ?? "",
    platforms: r.platforms,
    trustScore: r.trustScore,
    activeYears: r.activeYears,
    maxAccounts: r.maxAccounts ?? "",
    code: r.code ?? "",
    discount: r.discount ?? "",
    website: r.website ?? "",
    fundingUrl: r.fundingUrl ?? "",
    description: r.description ?? "",
    paymentMethods: r.paymentMethods,
    keyFeatures: r.keyFeatures as unknown as FirmDetail["keyFeatures"],
    challenges: r.challenges as unknown as FirmDetail["challenges"],
    payoutTimeline: r.payoutTimeline as unknown as FirmDetail["payoutTimeline"],
    rules: r.rules as unknown as FirmDetail["rules"],
    excludedCountries: r.excludedCountries,
  }));
}

export async function createOrUpdateFirm(
  data: FirmDetail,
  existingSlug: string | null,
) {
  const slug = existingSlug ?? slugify(data.name);
  const payload = {
    name: data.name,
    slug,
    logo: data.logo,
    website: data.website || null,
    description: data.description || null,
    payout: data.payout || null,
    country: data.country || null,
    flag: data.flag || null,
    trustScore: data.trustScore,
    activeYears: data.activeYears,
    maxAccounts: data.maxAccounts || null,
    code: data.code || null,
    discount: data.discount || null,
    platforms: data.platforms,
    paymentMethods: data.paymentMethods,
    keyFeatures: data.keyFeatures as object,
    challenges: data.challenges as object[],
    payoutTimeline: data.payoutTimeline as object[],
    excludedCountries: data.excludedCountries,
    // câmp necesar în Prisma, chiar dacă nu mai folosim reguli la nivel de firmă
    rules: (data.rules as object[] | undefined) ?? [],
  };

  if (existingSlug) {
    await prisma.firm.update({
      where: { slug: existingSlug },
      data: payload,
    });
  } else {
    await prisma.firm.create({ data: payload });
  }
  revalidatePath("/admin/firme");
  revalidatePath("/");
  return { slug };
}

export async function deleteFirm(slug: string) {
  await prisma.firm.delete({ where: { slug } });
  revalidatePath("/admin/firme");
  revalidatePath("/");
}

export async function getFirmBySlug(slug: string): Promise<FirmDetail | null> {
  const r = await prisma.firm.findUnique({ where: { slug } });
  if (!r) return null;
  return {
    name: r.name,
    slug: r.slug,
    logo: r.logo,
    payout: r.payout ?? "",
    country: r.country ?? "",
    flag: r.flag ?? "",
    platforms: r.platforms,
    trustScore: r.trustScore,
    activeYears: r.activeYears,
    maxAccounts: r.maxAccounts ?? "",
    code: r.code ?? "",
    discount: r.discount ?? "",
    website: r.website ?? "",
    fundingUrl: r.fundingUrl ?? "",
    description: r.description ?? "",
    paymentMethods: r.paymentMethods,
    keyFeatures: r.keyFeatures as unknown as FirmDetail["keyFeatures"],
    challenges: r.challenges as unknown as FirmDetail["challenges"],
    payoutTimeline: r.payoutTimeline as unknown as FirmDetail["payoutTimeline"],
    rules: r.rules as unknown as FirmDetail["rules"],
    excludedCountries: r.excludedCountries,
  };
}
