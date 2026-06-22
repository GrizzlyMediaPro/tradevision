import { prisma } from "@/lib/db";
import {
  COURSE_CATALOG,
  getCourseCatalogItem,
  LEGACY_PRACTICAL_COURSE_SLUG,
  PRACTICAL_COURSE_SLUG,
  type CourseCatalogItem,
} from "@/app/data/courseCatalog";

export type CoursePriceRow = {
  slug: string;
  title: string;
  subtitle: string;
  priceAmount: number;
  priceCurrency: string;
  defaultPriceAmount: number;
  adminPath?: string;
  updatedAt: string | null;
};

export async function getCoursePriceAmount(slug: string): Promise<number> {
  const catalogItem = getCourseCatalogItem(slug);
  if (!catalogItem) {
    throw new Error(`Cursul "${slug}" nu există în catalog.`);
  }

  const row =
    (await prisma.courseProductPrice.findUnique({
      where: { slug },
      select: { priceAmount: true },
    })) ??
    (slug === PRACTICAL_COURSE_SLUG
      ? await prisma.courseProductPrice.findUnique({
          where: { slug: LEGACY_PRACTICAL_COURSE_SLUG },
          select: { priceAmount: true },
        })
      : null);

  return row?.priceAmount ?? catalogItem.defaultPriceAmount;
}

export async function getBasePriceEur(): Promise<number> {
  const { PRACTICAL_COURSE_SLUG } = await import("@/app/data/courseCatalog");
  return getCoursePriceAmount(PRACTICAL_COURSE_SLUG);
}

export async function getCoursePricesForAdmin(): Promise<CoursePriceRow[]> {
  const rows = await prisma.courseProductPrice.findMany();
  const bySlug = new Map(rows.map((row) => [row.slug, row]));

  return COURSE_CATALOG.map((item) => {
    const stored =
      bySlug.get(item.slug) ??
      (item.slug === PRACTICAL_COURSE_SLUG
        ? bySlug.get(LEGACY_PRACTICAL_COURSE_SLUG)
        : undefined);
    return {
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      priceAmount: stored?.priceAmount ?? item.defaultPriceAmount,
      priceCurrency: stored?.priceCurrency ?? item.priceCurrency,
      defaultPriceAmount: item.defaultPriceAmount,
      adminPath: item.adminPath,
      updatedAt: stored?.updatedAt.toISOString() ?? null,
    };
  });
}

export function formatCoursePrice(
  amount: number,
  currency = "EUR",
): string {
  const formatted = amount.toFixed(2).replace(/\.00$/, "");
  return `${formatted} ${currency}`;
}

export function getCatalogFallback(item: CourseCatalogItem): CoursePriceRow {
  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle,
    priceAmount: item.defaultPriceAmount,
    priceCurrency: item.priceCurrency,
    defaultPriceAmount: item.defaultPriceAmount,
    adminPath: item.adminPath,
    updatedAt: null,
  };
}
