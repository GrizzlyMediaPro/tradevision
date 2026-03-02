import { Firms } from "../components/Firms";
import { getFirms } from "../admin/actions/firms";
import { getLinkWidget } from "../admin/actions/linkwidget";

export default async function FirmsPage() {
  const [firms, linkWidget] = await Promise.all([getFirms(), getLinkWidget()]);

  return (
    <div className="page-gradient min-h-screen">
      <Firms firms={firms} linkWidget={linkWidget} />
    </div>
  );
}

