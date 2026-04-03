import { Hero } from "@/app/components/Hero";
import { StatsBar } from "@/app/components/StatsBar";
import { ProblemSection } from "@/app/components/ProblemSection";
import { BenefitsSection } from "@/app/components/BenefitsSection";
import { CurriculumSection } from "@/app/components/CurriculumSection";
import { FoundersSection } from "@/app/components/FoundersSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { ScreenshotCarousel } from "@/app/components/ScreenshotCarousel";
import { BonusesSection } from "@/app/components/BonusesSection";
import { FaqSection } from "@/app/components/FaqSection";
import { FinalCta } from "@/app/components/FinalCta";
import { TelegramCtaAndLive } from "@/app/components/TelegramCtaAndLive";

const ourResults = [
  "/WhatsApp Image 2026-03-30 at 20.04.54.jpeg",
  "/WhatsApp Image 2026-03-30 at 20.04.54 (1).jpeg",
  "/WhatsApp Image 2026-03-30 at 20.04.54 (2).jpeg",
  "/WhatsApp Image 2026-03-30 at 20.04.54 (3).jpeg",
  "/WhatsApp Image 2026-03-30 at 20.04.54 (4).jpeg",
  "/WhatsApp Image 2026-03-30 at 20.04.55.jpeg",
  "/WhatsApp Image 2026-03-30 at 20.05.24.jpeg",
];

const communityResults = [
  "/poza1.jpeg",
  "/poza2.jpeg",
  "/poza3.jpeg",
  "/poza4.jpeg",
  "/poza5.jpeg",
  "/poza6.jpeg",
  "/poza7.jpeg",
  "/poza8.jpeg",
  "/poza9.jpeg",
  "/poza10.jpeg",
  "/poza11.jpeg",
  "/poza12.jpeg",
  "/poza13.jpeg",
  "/poza14.jpeg",
  "/poza15.jpeg",
  "/poza16.jpeg",
];
import { getLinkWidget } from "@/app/admin/actions/linkwidget";

export default async function Home() {
  const linkWidget = await getLinkWidget();

  return (
    <div className="page-gradient min-h-screen">
      <Hero />

      <StatsBar />

      <ProblemSection />

      <BenefitsSection />

      <CurriculumSection />

      <FoundersSection />

      <ScreenshotCarousel
        title="Rezultatele noastre"
        subtitle="Rezultate reale din conturile noastre de trading, documentate transparent."
        images={ourResults}
      />

      <TestimonialsSection />

      

      <ScreenshotCarousel
        title="Rezultate din comunitate"
        subtitle="Screenshot-uri trimise de membrii comunității Trade Vision care au aplicat ce au învățat."
        images={communityResults}
      />

      <BonusesSection />

      <FaqSection />

      <FinalCta />

      <section className="w-full max-w-[1250px] mx-auto px-4 py-16">
        <TelegramCtaAndLive linkWidget={linkWidget} />
      </section>
    </div>
  );
}
