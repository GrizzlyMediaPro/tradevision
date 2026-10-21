import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import { getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("legal.risk.metaTitle"),
    description: t("legal.risk.metaDescription"),
  };
}

export default async function DeclaratieRiscPage() {
  const t = await getT();

  return (
    <LegalPage title={t("legal.risk.title")} description={t("legal.risk.description")}>
      <LegalSection title={t("legal.risk.s1.title")}>
        <p>{t("disclosure.futures")}</p>
      </LegalSection>

      <LegalSection title={t("legal.risk.s2.title")}>
        <p>{t("disclosure.cftc")}</p>
      </LegalSection>

      <LegalSection title={t("legal.risk.s3.title")}>
        <p>{t("disclosure.testimonial")}</p>
      </LegalSection>

      <LegalSection title={t("legal.risk.s4.title")}>
        <p>{t("disclosure.liveRoom")}</p>
      </LegalSection>

      <p className="text-xs text-white/45">{t("legal.risk.note")}</p>
    </LegalPage>
  );
}
