import { notFound } from "next/navigation";
import { getUserPayoutTracker } from "@/app/admin/actions/users";
import { AdminUserPayoutClient } from "./AdminUserPayoutClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserPayoutPage({ params }: PageProps) {
  const { userId } = await params;

  let payload;
  try {
    payload = await getUserPayoutTracker(userId);
  } catch {
    notFound();
  }

  return <AdminUserPayoutClient payload={payload} />;
}
