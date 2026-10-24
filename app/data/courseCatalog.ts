export type CourseCatalogItem = {
  slug: string;
  title: string;
  subtitle: string;
  defaultPriceAmount: number;
  priceCurrency: string;
  adminPath?: string;
};

export const COURSE_CATALOG: CourseCatalogItem[] = [
  {
    slug: "curs-futures",
    title: "Curs Futures",
    subtitle: "Bootcamp intensiv pentru futures",
    defaultPriceAmount: 599,
    priceCurrency: "EUR",
    adminPath: "/curs-futures",
  },
];

export const PRACTICAL_COURSE_SLUG = "curs-futures";
export const LEGACY_PRACTICAL_COURSE_SLUG = "curs-practic";

export function getCourseCatalogItem(slug: string): CourseCatalogItem | undefined {
  return COURSE_CATALOG.find((item) => item.slug === slug);
}
