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

// Replace these with real screenshot paths when available
const ourResults = [
  "", // /rezultate/rezultat-1.png
  "", // /rezultate/rezultat-2.png
  "", // /rezultate/rezultat-3.png
  "", // /rezultate/rezultat-4.png
  "", // /rezultate/rezultat-5.png
];

const communityResults = [
  "", // /comunitate/rezultat-1.png
  "", // /comunitate/rezultat-2.png
  "", // /comunitate/rezultat-3.png
  "", // /comunitate/rezultat-4.png
  "", // /comunitate/rezultat-5.png
];
import { getLinkWidget } from "./admin/actions/linkwidget";

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

      <TestimonialsSection />

      <ScreenshotCarousel
        title="Rezultatele noastre"
        subtitle="Rezultate reale din conturile noastre de trading, documentate transparent."
        images={ourResults}
      />

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
