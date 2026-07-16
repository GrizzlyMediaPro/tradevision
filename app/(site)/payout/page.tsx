import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTrackerPartners } from "@/app/admin/actions/trackerPartners";
import { isValidSnapshotDate } from "@/lib/payoutTracker/validation";
import { TrackingClient } from "./TrackingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payout Tracker",
  description:
    "Urmărește-ți conturile de prop firm: balanțe, profit actual, profit necesar pentru payout și zile profitabile rămase — totul într-un singur loc.",
};

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
