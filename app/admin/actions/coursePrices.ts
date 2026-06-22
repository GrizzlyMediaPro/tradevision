"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
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

  const catalogItem = getCourseCatalogItem(input.slug);
  if (!catalogItem) {
    throw new Error("Cursul selectat nu există.");
  }

  if (!Number.isFinite(input.priceAmount) || input.priceAmount <= 0) {
    throw new Error("Prețul trebuie să fie un număr pozitiv.");
  }

  if (input.priceAmount > 100_000) {
    throw new Error("Prețul pare prea mare. Verifică valoarea introdusă.");
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

  const catalogItem = getCourseCatalogItem(slug);
  if (!catalogItem) {
    throw new Error("Cursul selectat nu există.");
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
