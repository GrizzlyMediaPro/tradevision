import { PracticalCourseCheckoutClient } from "./PracticalCourseCheckoutClient";
import { getOrderCookieOrderId } from "@/lib/practicalCourseOrder";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { getBasePriceEur } from "@/lib/practicalCoursePricing";
import { getEurRonQuote } from "@/lib/eurRonExchange";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Achiziție ${PRACTICAL_COURSE.title}`,
  description: PRACTICAL_COURSE.description,
};

type PageProps = {
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function PracticalCoursePage({ searchParams }: PageProps) {
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
