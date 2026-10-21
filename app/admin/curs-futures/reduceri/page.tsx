import Link from "next/link";
import { getT } from "@/lib/i18n/get-t";
import { getDiscountCodes } from "@/app/admin/actions/practicalCourse";
import { AdminDiscountsClient } from "./AdminDiscountsClient";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const t = await getT();
  const codes = await getDiscountCodes();

  return (
    <main className="min-h-screen bg-[#020312] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-white/50 hover:text-white">
            {t("admin.common.backArrow")}
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{t("admin.discounts.title")}</h1>
          <p className="mt-2 text-sm text-white/60">
            {t("admin.discounts.subtitle")}
          </p>
        </div>
        <AdminDiscountsClient initialCodes={codes} />
      </div>
    </main>
  );
}
