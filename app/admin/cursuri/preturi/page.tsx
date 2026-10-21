import Link from "next/link";
import { getT } from "@/lib/i18n/get-t";
import { getCoursePricesForAdmin } from "@/lib/courseProductPricing";
import { AdminCoursePricesClient } from "./AdminCoursePricesClient";

export const dynamic = "force-dynamic";

export default async function AdminCoursePricesPage() {
  const t = await getT();
  const courses = await getCoursePricesForAdmin();

  return (
    <main className="min-h-screen bg-[#020312] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-white/50 hover:text-white">
            {t("admin.common.backArrow")}
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{t("admin.prices.title")}</h1>
          <p className="mt-2 text-sm text-white/60">
            {t("admin.prices.subtitle")}
          </p>
        </div>
        <AdminCoursePricesClient initialCourses={courses} />
      </div>
    </main>
  );
}
