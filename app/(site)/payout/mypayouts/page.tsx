import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getT } from "@/lib/i18n/get-t";
import { redirect } from "next/navigation";
import { MyPayoutsClient } from "./MyPayoutsClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("payout.history.metaTitle"),
    description: t("payout.history.metaDescription"),
  };
}

export default async function MyPayoutsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <MyPayoutsClient />;
}
