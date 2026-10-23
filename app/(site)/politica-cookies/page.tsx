import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import { SITE_OPERATOR, operatorMessageVars } from "@/app/data/siteOperator";
import { getLocale, getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("legal.cookies.metaTitle"),
    description: t("legal.cookies.metaDescription", operatorMessageVars()),
  };
}

function formatLegalDate(iso: string, locale: "en" | "ro") {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

export default async function PoliticaCookiesPage() {
  const t = await getT();
  const locale = await getLocale();

  return (
    <LegalPage
      title={t("legal.cookies.title")}
      description={t("legal.cookies.description", operatorMessageVars())}
    >
      <p className="text-sm text-white/55">
        {t("legal.updated")}
        <time dateTime="2026-04-03">{formatLegalDate("2026-04-03", locale)}</time>
      </p>

      <LegalSection title={t("legal.cookies.s1.title")}>
        <p>{t("legal.cookies.s1.p1", operatorMessageVars())}</p>
        <p>
          {t("legal.cookies.s1.before")}
          <Link href="/politica-confidentialitate">{t("legal.cookies.s1.link")}</Link>
          {t("legal.cookies.s1.after")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s2.title")}>
        <p>{t("legal.cookies.s2.p1")}</p>
        <p>{t("legal.cookies.s2.p2")}</p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s3.title")}>
        <p>
          <strong>{t("legal.cookies.s3.essentialLabel")}</strong>
          {t("legal.cookies.s3.essentialRest")}
        </p>
        <p>
          <strong>{t("legal.cookies.s3.optionalLabel")}</strong>
          {t("legal.cookies.s3.optionalRest")}
        </p>
        <p>
          {t("legal.cookies.s3.durationBefore")}
          <strong>{t("legal.cookies.s3.sessionLabel")}</strong>
          {t("legal.cookies.s3.durationMid")}
          <strong>{t("legal.cookies.s3.persistentLabel")}</strong>
          {t("legal.cookies.s3.durationAfter")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s4.title")}>
        <p>{t("legal.cookies.s4.intro")}</p>
        <ul>
          <li>
            <strong>{t("legal.cookies.s4.gtmLabel")}</strong>
            {t("legal.cookies.s4.gtmRest")}
          </li>
          <li>
            <strong>{t("legal.cookies.s4.metaLabel")}</strong>
            {t("legal.cookies.s4.metaRest")}
          </li>
        </ul>
        <p>{t("legal.cookies.s4.p2")}</p>
        <p>
          <strong>{t("legal.cookies.s4.storageLabel")}</strong>
          {t("legal.cookies.s4.storageBefore")}
          <Link href="/politica-confidentialitate">{t("legal.cookies.s4.link")}</Link>
          {t("legal.cookies.s4.after")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s5.title")}>
        <p>
          {t("legal.cookies.s5.before")}
          <strong>{t("legal.cookies.s5.none")}</strong>
          {t("legal.cookies.s5.noneRest")}
          <strong>{t("legal.cookies.s5.essential")}</strong>
          {t("legal.cookies.s5.essentialRest")}
          <strong>{t("legal.cookies.s5.all")}</strong>
          {t("legal.cookies.s5.allRest")}
        </p>
        <p>{t("legal.cookies.s5.p2")}</p>
        <p>{t("legal.cookies.s5.browsers")}</p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647?hl=ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/ro/kb/cookies-informatii-site-urile-stocheaza-pe-calculatorul-dvs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari (Apple)
            </a>
          </li>
        </ul>
        <p>{t("legal.cookies.s5.ads")}</p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s6.title")}>
        <p>{t("legal.cookies.s6.p1")}</p>
      </LegalSection>

      <LegalSection title={t("legal.cookies.s7.title")}>
        <p>
          <a href={`mailto:${SITE_OPERATOR.email}`}>{SITE_OPERATOR.email}</a>
        </p>
        <p>
          <strong>{SITE_OPERATOR.legalName}</strong>
          {" · "}
          CUI {SITE_OPERATOR.cui}
          {" · "}
          {t("legal.company.register")} {SITE_OPERATOR.tradeRegister}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
