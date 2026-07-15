import { Hero } from "@/app/components/Hero";
import { StatsBar } from "@/app/components/StatsBar";
import { TrackerAnnouncement } from "@/app/components/TrackerAnnouncement";
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
import { getLinkWidget } from "@/app/admin/actions/linkwidget";
import {
  communityResultsScreenshots,
  ourResultsScreenshots,
} from "@/app/lib/screenshotResultsImages";

export default async function Home() {
  const linkWidget = await getLinkWidget();

  return (
    <div className="page-gradient min-h-screen">
      <Hero />

      <StatsBar />

      <TrackerAnnouncement />

      <ProblemSection />

      <BenefitsSection />

      <CurriculumSection />

      <FoundersSection />

      <ScreenshotCarousel
        title="Rezultatele noastre"
        subtitle="Rezultate reale din conturile noastre de trading, documentate transparent."
        images={ourResultsScreenshots}
      />

      <TestimonialsSection />

      

      <ScreenshotCarousel
        title="Rezultate din comunitate"
        subtitle="Screenshot-uri trimise de membrii comunității Trade Vision care au aplicat ce au învățat."
        images={communityResultsScreenshots}
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
