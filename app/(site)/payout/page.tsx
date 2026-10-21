import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getT } from "@/lib/i18n/get-t";
import { redirect } from "next/navigation";
import { getTrackerPartners } from "@/app/admin/actions/trackerPartners";
import { isValidSnapshotDate } from "@/lib/payoutTracker/validation";
import { TrackingClient } from "./TrackingClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("payout.metaTitle"),
    description: t("payout.metaDescription"),
  };
}

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [{ date }, partners] = await Promise.all([
    searchParams,
    getTrackerPartners(),
  ]);
  const initialDate = isValidSnapshotDate(date) ? date : undefined;

  return <TrackingClient initialDate={initialDate} partnerLinks={partners} />;
}
