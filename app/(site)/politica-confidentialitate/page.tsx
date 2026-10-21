import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import { getLocale, getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("legal.privacy.metaTitle"),
    description: t("legal.privacy.metaDescription"),
  };
}

function formatLegalDate(iso: string, locale: "en" | "ro") {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

export default async function PoliticaConfidentialitatePage() {
  const t = await getT();
  const locale = await getLocale();

  return (
    <LegalPage
      title={t("legal.privacy.title")}
      description={t("legal.privacy.description")}
    >
      <p className="text-sm text-white/55">
        {t("legal.updated")}
        <time dateTime="2026-04-03">{formatLegalDate("2026-04-03", locale)}</time>
      </p>

      <LegalSection title={t("legal.privacy.s1.title")}>
        <p>
          <strong>{t("legal.privacy.s1.operatorLabel")}</strong> TRADE VISION HUB
          TRADING SRL, CUI <strong>54265198</strong>.
        </p>
        <p>
          <strong>{t("legal.privacy.s1.contactLabel")}</strong>{" "}
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>
        </p>
        <p>
          {t("legal.privacy.s1.before")}
          <strong>{t("legal.privacy.s1.brand")}</strong>
          {t("legal.privacy.s1.mid")}
          <Link href="/termeni-conditii">{t("legal.privacy.s1.terms")}</Link>
          {t("legal.privacy.s1.and")}
          <Link href="/politica-cookies">{t("legal.privacy.s1.cookies")}</Link>
          {t("legal.privacy.s1.after")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s2.title")}>
        <p>
          {t("legal.privacy.s2.p1.before")}
          <strong>{t("legal.privacy.s2.gdpr")}</strong>
          {t("legal.privacy.s2.p1.after")}
          <strong>{t("legal.privacy.s2.consent")}</strong>
          {t("legal.privacy.s2.p1.end")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s3.title")}>
        <p>
          <strong>{t("legal.privacy.s3.direct")}</strong>
          {t("legal.privacy.s3.directRest")}
        </p>
        <ul>
          <li>
            {t("legal.privacy.s3.liPrefix")}
            <strong>{t("legal.privacy.s3.contactLabel")}</strong>
            {t("legal.privacy.s3.contactRest")}
          </li>
          <li>
            {t("legal.privacy.s3.liPrefix")}
            <strong>{t("legal.privacy.s3.newsLabel")}</strong>
            {t("legal.privacy.s3.newsRest")}
          </li>
          <li>
            {t("legal.privacy.s3.liPrefix")}
            <strong>{t("legal.privacy.s3.accountLabel")}</strong>
            {t("legal.privacy.s3.accountRest")}
          </li>
        </ul>
        <p>
          <strong>{t("legal.privacy.s3.technical")}</strong>
          {t("legal.privacy.s3.technicalRest")}
        </p>
        <p>
          <strong>{t("legal.privacy.s3.local")}</strong>
          {t("legal.privacy.s3.localMid")}
          <strong>{t("legal.privacy.s3.localStorage")}</strong>
          {t("legal.privacy.s3.localRest")}
          <strong>{t("legal.privacy.s3.essential")}</strong>
          {t("legal.privacy.s3.or")}
          <strong>{t("legal.privacy.s3.all")}</strong>
          {t("legal.privacy.s3.localEnd")}
          <strong>{t("legal.privacy.s3.none")}</strong>
          {t("legal.privacy.s3.localTail")}
        </p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s4.title")}>
        <ul>
          <li>{t("legal.privacy.s4.li1")}</li>
          <li>{t("legal.privacy.s4.li2")}</li>
          <li>{t("legal.privacy.s4.li3")}</li>
          <li>{t("legal.privacy.s4.li4")}</li>
          <li>{t("legal.privacy.s4.li5")}</li>
          <li>{t("legal.privacy.s4.li6")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s5.title")}>
        <p>
          {t("legal.privacy.s5.p1.before")}
          <strong>{t("legal.privacy.s5.hosting")}</strong>
          {t("legal.privacy.s5.p1.a")}
          <strong>{t("legal.privacy.s5.email")}</strong>
          {t("legal.privacy.s5.p1.b")}
          <strong>{t("legal.privacy.s5.auth")}</strong>
          {t("legal.privacy.s5.p1.c")}
          <strong>{t("legal.privacy.s5.ads")}</strong>
          {t("legal.privacy.s5.p1.after")}
        </p>
        <p>{t("legal.privacy.s5.p2")}</p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s6.title")}>
        <p>{t("legal.privacy.s6.p1")}</p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s7.title")}>
        <p>{t("legal.privacy.s7.p1")}</p>
        <p>
          {t("legal.privacy.s7.before")}
          <a href="mailto:tradevisionro@gmail.com">tradevisionro@gmail.com</a>
          {t("legal.privacy.s7.mid")}
          <strong>{t("legal.privacy.s7.authority")}</strong>
          {t("legal.privacy.s7.after")}
          <a
            href="https://www.dataprotection.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.dataprotection.ro
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s8.title")}>
        <p>{t("legal.privacy.s8.p1")}</p>
      </LegalSection>

      <LegalSection title={t("legal.privacy.s9.title")}>
        <p>{t("legal.privacy.s9.p1")}</p>
      </LegalSection>
    </LegalPage>
  );
}
