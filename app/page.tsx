import { Hero } from "./components/Hero";
import { StatsBar } from "./components/StatsBar";
import { ProblemSection } from "./components/ProblemSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { CurriculumSection } from "./components/CurriculumSection";
import { FoundersSection } from "./components/FoundersSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ScreenshotCarousel } from "./components/ScreenshotCarousel";
import { BonusesSection } from "./components/BonusesSection";
import { FaqSection } from "./components/FaqSection";
import { FinalCta } from "./components/FinalCta";
import { TelegramCtaAndLive } from "./components/TelegramCtaAndLive";
import { getLinkWidget } from "./admin/actions/linkwidget";
import {
  communityResultsScreenshots,
  ourResultsScreenshots,
} from "./lib/screenshotResultsImages";

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
