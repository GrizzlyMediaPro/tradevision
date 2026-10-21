import { PracticalCourseCheckoutClient } from "../PracticalCourseCheckoutClient";
import { getOrderCookieOrderId } from "@/lib/practicalCourseOrder";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";
import { getEurRonQuote } from "@/lib/eurRonExchange";
import { getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("course.checkout.metaTitle", { title: t("futures.title") }),
    description: t("course.checkout.metaDescription"),
  };
}

type PageProps = {
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function PracticalCourseCheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = await getOrderCookieOrderId();
  const [basePriceEur, eurRonQuote] = await Promise.all([
    getBasePriceEur(),
    getEurRonQuote(),
  ]);

  return (
    <PracticalCourseCheckoutClient
      initialOrderId={orderId}
      cancelled={params.cancelled === "1"}
      basePriceEur={basePriceEur}
      eurRonQuote={eurRonQuote}
    />
  );
}
