import Link from "next/link";
import { getCoursePricesForAdmin } from "@/lib/courseProductPricing";
import { AdminCoursePricesClient } from "./AdminCoursePricesClient";

export const dynamic = "force-dynamic";

export default async function AdminCoursePricesPage() {
  const courses = await getCoursePricesForAdmin();

  return (
    <main className="min-h-screen bg-[#020312] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-white/50 hover:text-white">
            ← Admin
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Prețuri cursuri</h1>
          <p className="mt-2 text-sm text-white/60">
            Modifică prețurile cursurilor plătite afișate pe site.
          </p>
        </div>
        <AdminCoursePricesClient initialCourses={courses} />
      </div>
    </main>
  );
}
