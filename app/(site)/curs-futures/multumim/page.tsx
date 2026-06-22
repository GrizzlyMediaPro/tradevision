import { MultumimPageClient } from "./MultumimPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plată confirmată",
  description: "Plata pentru Curs Futures a fost înregistrată cu succes.",
};

export default function MultumimPage() {
  return <MultumimPageClient />;
}
