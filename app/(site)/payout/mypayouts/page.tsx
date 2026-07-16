import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MyPayoutsClient } from "./MyPayoutsClient";

export const metadata: Metadata = {
  title: "My Payouts",
  description:
    "Statistici și istoricul salvărilor tale din Payout Tracker: investiții, payouts și profit pe fiecare lună.",
};

export default async function MyPayoutsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <MyPayoutsClient />;
}
