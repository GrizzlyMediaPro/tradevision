import { MultumimPageClient } from "./MultumimPageClient";
import { getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("course.thanks.metaTitle"),
    description: t("course.thanks.metaDescription"),
  };
}

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function MultumimPage({ searchParams }: PageProps) {
  const { session_id: stripeSessionId } = await searchParams;
  return <MultumimPageClient stripeSessionId={stripeSessionId ?? null} />;
}
