import { WebinarHero } from "../components/WebinarHero";
import { WebinarNextSection } from "../components/WebinarNextSection";
import { WebinarValueSection } from "../components/WebinarValueSection";
import { WebinarTransformationSection } from "../components/WebinarTransformationSection";
import { WebinarAudienceSection } from "../components/WebinarAudienceSection";
import { WebinarNotForYouSection } from "../components/WebinarNotForYouSection";
import { FoundersSection } from "../components/FoundersSection";
import { WebinarFaqSection } from "../components/WebinarFaqSection";
import { WebinarFinalCtaSection } from "../components/WebinarFinalCtaSection";
import { Footer } from "../components/Footer";

export default function WebinarPage() {
  return (
    <main className="w-full">
      <WebinarHero />
      <WebinarNextSection />
      <WebinarValueSection />
      <WebinarTransformationSection />
      <WebinarAudienceSection />
      <WebinarNotForYouSection />
      <FoundersSection />
      <WebinarFaqSection />
      <WebinarFinalCtaSection />
      <Footer />
    </main>
  );
}
