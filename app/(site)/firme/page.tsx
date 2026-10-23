import { Deals } from "@/app/components/Deals";
import { Firms } from "@/app/components/Firms";
import { getDeals } from "@/app/admin/actions/deals";
import { getFirms } from "@/app/admin/actions/firms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FirmsPage() {
  const [firms, deals] = await Promise.all([getFirms(), getDeals()]);

  return (
    <div className="page-gradient min-h-screen">
      <Deals deals={deals} />
      <Firms firms={firms} />
    </div>
  );
}

