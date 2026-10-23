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
import {
  communityResultsScreenshots,
  ourResultsScreenshots,
} from "@/app/lib/screenshotResultsImages";
import { getT } from "@/lib/i18n/get-t";

export default async function Home() {
  const t = await getT();

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
        title={t("results.ours.title")}
        subtitle={t("results.ours.subtitle")}
        images={ourResultsScreenshots}
        fit="contain"
      />

      <TestimonialsSection />

      <ScreenshotCarousel
        title={t("results.community.title")}
        subtitle={t("results.community.subtitle")}
        images={communityResultsScreenshots}
      />

      <BonusesSection />

      <FaqSection />

      <FinalCta />

      <section className="w-full max-w-[1250px] mx-auto px-4 py-16">
        <TelegramCtaAndLive />
      </section>
    </div>
  );
}
