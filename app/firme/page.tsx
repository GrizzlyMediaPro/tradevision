import { Deals } from "../components/Deals";
import { Firms } from "../components/Firms";
import { getDeals } from "../admin/actions/deals";
import { getFirms } from "../admin/actions/firms";
import { getLinkWidget } from "../admin/actions/linkwidget";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FirmsPage() {
  const [firms, deals, linkWidget] = await Promise.all([
    getFirms(),
    getDeals(),
    getLinkWidget(),
  ]);

  return (
    <div className="page-gradient min-h-screen">
      <Deals deals={deals} />
      <Firms firms={firms} linkWidget={linkWidget} />
    </div>
  );
}

