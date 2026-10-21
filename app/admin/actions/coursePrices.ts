"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { getT } from "@/lib/i18n/get-t";
import {
  getCourseCatalogItem,
  LEGACY_PRACTICAL_COURSE_SLUG,
  PRACTICAL_COURSE_SLUG,
  type CourseCatalogItem,
} from "@/app/data/courseCatalog";
import {
  getCoursePricesForAdmin,
  type CoursePriceRow,
} from "@/lib/courseProductPricing";

export async function fetchCoursePrices(): Promise<CoursePriceRow[]> {
  await requireAdmin();
  return getCoursePricesForAdmin();
}

export async function saveCoursePrice(input: {
  slug: string;
  priceAmount: number;
}) {
  await requireAdmin();

  const t = await getT();
  const catalogItem = getCourseCatalogItem(input.slug);
  if (!catalogItem) {
    throw new Error(t("admin.prices.error.missing"));
  }

  if (!Number.isFinite(input.priceAmount) || input.priceAmount <= 0) {
    throw new Error(t("admin.prices.error.positive"));
  }

  if (input.priceAmount > 100_000) {
    throw new Error(t("admin.prices.error.tooHigh"));
  }

  const roundedPrice = Math.round(input.priceAmount * 100) / 100;

  await prisma.courseProductPrice.upsert({
    where: { slug: input.slug },
    create: {
      slug: input.slug,
      priceAmount: roundedPrice,
      priceCurrency: catalogItem.priceCurrency,
    },
    update: {
      priceAmount: roundedPrice,
      priceCurrency: catalogItem.priceCurrency,
    },
  });

  if (input.slug === PRACTICAL_COURSE_SLUG) {
    await prisma.courseProductPrice.deleteMany({
      where: { slug: LEGACY_PRACTICAL_COURSE_SLUG },
    });
  }

  revalidateCoursePricePaths(catalogItem);
}

export async function resetCoursePrice(slug: string) {
  await requireAdmin();

  const t = await getT();
  const catalogItem = getCourseCatalogItem(slug);
  if (!catalogItem) {
    throw new Error(t("admin.prices.error.missing"));
  }

  await prisma.courseProductPrice.deleteMany({
    where: {
      slug: {
        in:
          slug === PRACTICAL_COURSE_SLUG
            ? [slug, LEGACY_PRACTICAL_COURSE_SLUG]
            : [slug],
      },
    },
  });

  revalidateCoursePricePaths(catalogItem);
}

function revalidateCoursePricePaths(catalogItem: CourseCatalogItem) {
  revalidatePath("/admin/cursuri/preturi");
  if (catalogItem.adminPath) {
    revalidatePath(catalogItem.adminPath);
  }
}
