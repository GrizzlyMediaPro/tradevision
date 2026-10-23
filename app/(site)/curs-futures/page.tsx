import { redirect } from "next/navigation";
import { PRACTICAL_COURSE } from "@/app/data/practicalCourse";
import { CursFuturesIntro } from "./CursFuturesIntro";
import { CursFuturesProof } from "./CursFuturesProof";
import { CursFuturesFinalCta, CursFuturesSteps } from "./CursFuturesEnrol";
import { getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("futures.title"),
    description: t("course.metaDescription", {
      subtitle: t("futures.subtitle"),
      description: t("course.description"),
    }),
  };
}

type PageProps = {
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function PracticalCoursePage({ searchParams }: PageProps) {
  const params = await searchParams;
  if (params.cancelled === "1") {
    redirect(`${PRACTICAL_COURSE.checkoutPath}?cancelled=1`);
  }

  return (
    <div>
      <CursFuturesIntro />
      <CursFuturesProof />
      <CursFuturesSteps />
      <CursFuturesFinalCta />
    </div>
  );
}
