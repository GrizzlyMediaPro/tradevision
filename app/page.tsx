import { Deals } from "./components/Deals";
import { Firms } from "./components/Firms";
import { getFirms } from "./admin/actions/firms";
import { getDeals } from "./admin/actions/deals";
import { getLinkWidget } from "./admin/actions/linkwidget";

export default async function Home() {
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
