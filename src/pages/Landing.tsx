import { Shell } from "@/components/layout/Shell";
import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { IntakeSystem } from "@/components/marketing/IntakeSystem";
import { EvidenceTimeline } from "@/components/marketing/EvidenceTimeline";
import { LiveDocket } from "@/components/marketing/LiveDocket";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { Foundation } from "@/components/marketing/Foundation";
import { FinalAction } from "@/components/marketing/FinalAction";
import { Footer } from "@/components/marketing/Footer";

/**
 * Public landing page. Renders the nine spec sections in order inside the
 * shared shell with atmospheric background layers.
 */
export function Landing() {
  return (
    <Shell>
      <Hero />
      <Problem />
      <IntakeSystem />
      <EvidenceTimeline />
      <LiveDocket />
      <BeforeAfter />
      <Foundation />
      <FinalAction />
      <Footer />
    </Shell>
  );
}
