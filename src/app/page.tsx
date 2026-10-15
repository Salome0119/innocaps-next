import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import BiotechPipeline from "@/components/BiotechPipeline";
import SectorsAccordion from "@/components/SectorsAccordion";
import ProfessionalsSection from "@/components/ProfessionalsSection";
import AlliesMarquee from "@/components/AlliesMarquee";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <ProcessSection />
      <BiotechPipeline />
      <SectorsAccordion />
      <ProfessionalsSection />
      <AlliesMarquee />
    </main>
  );
}
