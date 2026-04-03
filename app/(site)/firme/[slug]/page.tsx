import Link from "next/link";
import { notFound } from "next/navigation";
import { getFirmBySlug, getFirms } from "@/app/admin/actions/firms";
import { FirmPageClient } from "./FirmPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export default async function FirmPage({ params }: Props) {
  const { slug } = await params;
  const [firm, firms] = await Promise.all([
    getFirmBySlug(slug),
    getFirms(),
  ]);
  if (!firm) {
    notFound();
  }
  return <FirmPageClient firm={firm} firms={firms} />;
}
