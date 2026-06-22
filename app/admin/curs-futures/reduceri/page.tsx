import Link from "next/link";
import { getDiscountCodes } from "@/app/admin/actions/practicalCourse";
import { AdminDiscountsClient } from "./AdminDiscountsClient";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const codes = await getDiscountCodes();

  return (
    <main className="min-h-screen bg-[#020312] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-white/50 hover:text-white">
            ← Admin
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Reduceri Curs Futures</h1>
          <p className="mt-2 text-sm text-white/60">
            Gestionează codurile de discount pentru achiziția Curs Futures.
          </p>
        </div>
        <AdminDiscountsClient initialCodes={codes} />
      </div>
    </main>
  );
}
