import { Firms } from "../components/Firms";
import { getFirms } from "../admin/actions/firms";
import { getLinkWidget } from "../admin/actions/linkwidget";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FirmsPage() {
  const [firms, linkWidget] = await Promise.all([getFirms(), getLinkWidget()]);

  return (
    <div className="page-gradient min-h-screen">
      <Firms firms={firms} linkWidget={linkWidget} />
    </div>
  );
}

