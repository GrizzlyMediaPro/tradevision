import { MultumimPageClient } from "./MultumimPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plată confirmată",
  description: "Plata pentru Curs Futures a fost înregistrată cu succes.",
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function MultumimPage({ searchParams }: PageProps) {
  const { session_id: stripeSessionId } = await searchParams;
  return <MultumimPageClient stripeSessionId={stripeSessionId ?? null} />;
}
