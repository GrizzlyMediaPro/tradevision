import { LegalPage, LegalSection } from "@/app/components/LegalPage";
import { SITE_OPERATOR, operatorMessageVars } from "@/app/data/siteOperator";
import { getLocale, getT } from "@/lib/i18n/get-t";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("legal.terms.metaTitle"),
    description: t("legal.terms.metaDescription", operatorMessageVars()),
  };
}

function formatLegalDate(iso: string, locale: "en" | "ro") {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

function Clause({ text }: { text: string }) {
  const match = text.match(/^(\d+\.\d+\.)\s+([\s\S]*)$/);
  if (!match) return <p>{text}</p>;
  return (
    <p>
      <strong>{match[1]}</strong> {match[2]}
    </p>
  );
}

export default async function TermeniConditiiPage() {
  const t = await getT();
  const locale = await getLocale();

  return (
    <LegalPage title={t("legal.terms.title")} description={t("legal.terms.description")}>
      <p className="text-sm text-white/55">
        {t("legal.updated")}
        <time dateTime="2026-06-22">{formatLegalDate("2026-06-22", locale)}</time>
      </p>

      <p>{t("legal.terms.intro")}</p>
      <p>
        <strong>{SITE_OPERATOR.legalName}</strong>
        <br />
        CUI: <strong>{SITE_OPERATOR.cui}</strong>
        <br />
        {t("legal.company.register")}: <strong>{SITE_OPERATOR.tradeRegister}</strong>
        <br />
        {t("legal.terms.named")}
      </p>
      <p>{t("legal.terms.acceptIntro")}</p>

      <LegalSection title={t("legal.terms.s1.title")}>
        <Clause text={t("legal.terms.s1.p1")} />
        <Clause text={t("legal.terms.s1.p2")} />
        <ul>
          <li>{t("legal.terms.s1.li1")}</li>
          <li>{t("legal.terms.s1.li2")}</li>
          <li>{t("legal.terms.s1.li3")}</li>
          <li>{t("legal.terms.s1.li4")}</li>
          <li>{t("legal.terms.s1.li5")}</li>
          <li>{t("legal.terms.s1.li6")}</li>
        </ul>
        <Clause text={t("legal.terms.s1.p3")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s2.title")}>
        <Clause text={t("legal.terms.s2.p1")} />
        <Clause text={t("legal.terms.s2.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s3.title")}>
        <Clause text={t("legal.terms.s3.p1")} />
        <Clause text={t("legal.terms.s3.p2")} />
        <Clause text={t("legal.terms.s3.p3")} />
        <Clause text={t("legal.terms.s3.p4")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s4.title")}>
        <Clause text={t("legal.terms.s4.p1")} />
        <Clause text={t("legal.terms.s4.p2")} />
        <Clause text={t("legal.terms.s4.p3")} />
        <Clause text={t("legal.terms.s4.p4")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s5.title")}>
        <Clause text={t("legal.terms.s5.p1")} />
        <Clause text={t("legal.terms.s5.p2")} />
        <ul>
          <li>{t("legal.terms.s5.li1")}</li>
          <li>{t("legal.terms.s5.li2")}</li>
          <li>{t("legal.terms.s5.li3")}</li>
          <li>{t("legal.terms.s5.li4")}</li>
          <li>{t("legal.terms.s5.li5")}</li>
          <li>{t("legal.terms.s5.li6")}</li>
        </ul>
        <p>{t("legal.terms.s5.p3")}</p>
        <Clause text={t("legal.terms.s5.p4")} />
        <Clause text={t("legal.terms.s5.p5")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s6.title")}>
        <Clause text={t("legal.terms.s6.p1")} />
        <Clause text={t("legal.terms.s6.p2")} />
        <ul>
          <li>{t("legal.terms.s6.li1")}</li>
          <li>{t("legal.terms.s6.li2")}</li>
          <li>{t("legal.terms.s6.li3")}</li>
          <li>{t("legal.terms.s6.li4")}</li>
        </ul>
        <Clause text={t("legal.terms.s6.p3")} />
        <Clause text={t("legal.terms.s6.p4")} />
        <ul>
          <li>{t("legal.terms.s6.li5")}</li>
          <li>{t("legal.terms.s6.li6")}</li>
          <li>{t("legal.terms.s6.li7")}</li>
          <li>{t("legal.terms.s6.li8")}</li>
          <li>{t("legal.terms.s6.li9")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("legal.terms.s7.title")}>
        <Clause text={t("legal.terms.s7.p1")} />
        <ul>
          <li>{t("legal.terms.s7.li1")}</li>
          <li>{t("legal.terms.s7.li2")}</li>
          <li>{t("legal.terms.s7.li3")}</li>
          <li>{t("legal.terms.s7.li4")}</li>
        </ul>
        <Clause text={t("legal.terms.s7.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s8.title")}>
        <Clause text={t("legal.terms.s8.p1")} />
        <ul>
          <li>{t("legal.terms.s8.li1")}</li>
          <li>{t("legal.terms.s8.li2")}</li>
          <li>{t("legal.terms.s8.li3")}</li>
          <li>{t("legal.terms.s8.li4")}</li>
          <li>{t("legal.terms.s8.li5")}</li>
        </ul>
        <Clause text={t("legal.terms.s8.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s9.title")}>
        <Clause text={t("legal.terms.s9.p1")} />
        <Clause text={t("legal.terms.s9.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s10.title")}>
        <Clause text={t("legal.terms.s10.p1")} />
        <Clause text={t("legal.terms.s10.p2")} />
        <ul>
          <li>{t("legal.terms.s10.li1")}</li>
          <li>{t("legal.terms.s10.li2")}</li>
          <li>{t("legal.terms.s10.li3")}</li>
          <li>{t("legal.terms.s10.li4")}</li>
        </ul>
        <Clause text={t("legal.terms.s10.p3")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s11.title")}>
        <Clause text={t("legal.terms.s11.p1")} />
        <Clause text={t("legal.terms.s11.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s12.title")}>
        <Clause text={t("legal.terms.s12.p1")} />
        <Clause text={t("legal.terms.s12.p2")} />
      </LegalSection>

      <LegalSection title={t("legal.terms.s13.title")}>
        <p>
          <strong>{SITE_OPERATOR.legalName}</strong>
          <br />
          CUI: <strong>{SITE_OPERATOR.cui}</strong>
          <br />
          {t("legal.company.register")}: <strong>{SITE_OPERATOR.tradeRegister}</strong>
          <br />
          <a href={`mailto:${SITE_OPERATOR.email}`}>{SITE_OPERATOR.email}</a>
        </p>
        <p>{t("legal.terms.s13.p1")}</p>
      </LegalSection>

      <p>{t("legal.terms.closing")}</p>
    </LegalPage>
  );
}
