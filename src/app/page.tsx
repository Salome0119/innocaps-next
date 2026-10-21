import type { Metadata } from "next";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AlliesMarquee from "@/components/AlliesMarquee";
import SelectorUnidades from "@/components/SelectorUnidades";
import NanoBackground from "@/components/NanoBackground";

export const metadata: Metadata = {
  title: "Innocaps Lab — Nanoencapsulación y Biotecnología",
  description:
    "Hub corporativo B2B de Innocaps: quiénes somos, nanoencapsulación, fermentación de precisión y escalamiento industrial a través de las unidades InnoCaps Lab e InnoCaps Bio.",
};

/* ═══════════════════════════════════════════════════════════════════
   HUB PRINCIPAL — Inicio: hero + selector dual + Aliados
   "Nosotros" vive en su propia ruta: /nosotros
   ═══════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* 0 ▸ Capa de presentación: canvas nanotech + barra de progreso */}
      <NanoBackground />

      {/* 1 ▸ Experiencia de entrada con visor 3D */}
      <Header />
      <HeroSection />

      {/* 2 ▸ Contenido principal con overflow-hidden para aislar canvas */}
      <div className="overflow-hidden">
        {/* 2 ▸ Selector dual: Lab / Bio */}
        <SelectorUnidades />

        {/* 3 ▸ Carrusel infinito de aliados */}
        <AlliesMarquee />
      </div>
    </main>
  );
}
