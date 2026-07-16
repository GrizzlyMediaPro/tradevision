import { Hero } from "@/app/components/Hero";
import { StatsBar } from "@/app/components/StatsBar";
import { TrackerAnnouncement } from "@/app/components/TrackerAnnouncement";
import { ProblemSection } from "@/app/components/ProblemSection";
import { BenefitsSection } from "@/app/components/BenefitsSection";
import { CurriculumSection } from "@/app/components/CurriculumSection";
import { FoundersSection } from "@/app/components/FoundersSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { BonusesSection } from "@/app/components/BonusesSection";
import { FaqSection } from "@/app/components/FaqSection";
import { NinjaTraderHomeSection } from "@/app/components/NinjaTraderHomeSection";
import { FinalCta } from "@/app/components/FinalCta";
import { TelegramCtaAndLive } from "@/app/components/TelegramCtaAndLive";
import { getLinkWidget } from "@/app/admin/actions/linkwidget";

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

      <TestimonialsSection />

      <BonusesSection />

      <NinjaTraderHomeSection />

      <FaqSection />

      <FinalCta />

      <section className="w-full max-w-[1250px] mx-auto px-4 py-16">
        <TelegramCtaAndLive linkWidget={linkWidget} />
      </section>
    </div>
  );
}
