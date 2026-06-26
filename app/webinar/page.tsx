import { WebinarHero } from "../components/WebinarHero";
import { WebinarNextSection } from "../components/WebinarNextSection";
import { WebinarValueSection } from "../components/WebinarValueSection";
import { WebinarTransformationSection } from "../components/WebinarTransformationSection";
import { WebinarAudienceSection } from "../components/WebinarAudienceSection";
import { WebinarNotForYouSection } from "../components/WebinarNotForYouSection";
import { FoundersSection } from "../components/FoundersSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { WebinarFaqSection } from "../components/WebinarFaqSection";
import { WebinarFinalCtaSection } from "../components/WebinarFinalCtaSection";
import { Footer } from "../components/Footer";
import { getWebinarSettings } from "../admin/actions/webinar";
import { getWebinarCountdownTarget } from "../lib/webinarCountdown";

export default async function WebinarPage() {
  const settings = await getWebinarSettings();
  const targetTimestamp = getWebinarCountdownTarget(settings.webinarAt);

  return (
    <main className="w-full">
      <WebinarHero targetTimestamp={targetTimestamp} />
      <WebinarNextSection targetTimestamp={targetTimestamp} />
      <WebinarValueSection targetTimestamp={targetTimestamp} />
      <WebinarTransformationSection />
      <WebinarAudienceSection />
      <WebinarNotForYouSection />
      <FoundersSection />

      <TestimonialsSection />

      <WebinarFaqSection />
      <WebinarFinalCtaSection targetTimestamp={targetTimestamp} />
      <Footer />
    </main>
  );
}
