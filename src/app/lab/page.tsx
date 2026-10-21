import type { Metadata } from "next";
import { Header } from "@/components/Header";
import ProcessSection from "@/components/ProcessSection";
import BiotechPipeline from "@/components/BiotechPipeline";
import SectorsAccordion from "@/components/SectorsAccordion";

export const metadata: Metadata = {
  title: "InnoCaps Lab — Estrategia de investigación y desarrollo",
  description:
    "Estrategia InnoCaps Lab: tecnología de nanoencapsulación, proceso biotecnológico y sectores de impacto.",
};

/* ═══════════════════════════════════════════════════════════════════
   LAB — Página de estrategia (Unidad 01)
   Únicamente módulos de I+D+i. "Nosotros" y "Aliados" viven en la home.
   ═══════════════════════════════════════════════════════════════════ */

export default function LabPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <ProcessSection />
      <BiotechPipeline />
      <SectorsAccordion />
    </main>
  );
}
