import { WebinarHero } from "../components/WebinarHero";
import { WebinarNextSection } from "../components/WebinarNextSection";
import { WebinarValueSection } from "../components/WebinarValueSection";
import { WebinarTransformationSection } from "../components/WebinarTransformationSection";
import { WebinarAudienceSection } from "../components/WebinarAudienceSection";
import { WebinarNotForYouSection } from "../components/WebinarNotForYouSection";
import { FoundersSection } from "../components/FoundersSection";
import { ScreenshotCarousel } from "../components/ScreenshotCarousel";
import { WebinarFaqSection } from "../components/WebinarFaqSection";
import { WebinarFinalCtaSection } from "../components/WebinarFinalCtaSection";
import { Footer } from "../components/Footer";
import { getWebinarSettings } from "../admin/actions/webinar";
import { getWebinarCountdownTarget } from "../lib/webinarCountdown";
import {
  communityResultsScreenshots,
  ourResultsScreenshots,
} from "../lib/screenshotResultsImages";

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

      <ScreenshotCarousel
        title="Rezultatele noastre"
        subtitle="Rezultate reale din conturile noastre de trading, documentate transparent."
        images={ourResultsScreenshots}
      />

      <ScreenshotCarousel
        title="Rezultate din comunitate"
        subtitle="Screenshot-uri trimise de membrii comunității Trade Vision care au aplicat ce au învățat."
        images={communityResultsScreenshots}
      />

      <WebinarFaqSection />
      <WebinarFinalCtaSection targetTimestamp={targetTimestamp} />
      <Footer />
    </main>
  );
}
