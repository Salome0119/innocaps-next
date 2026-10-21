import type { Metadata } from "next";
import { Header } from "@/components/Header";
import AboutPage from "@/components/AboutPage";
import NanoBackground from "@/components/NanoBackground";

export const metadata: Metadata = {
  title: "Nosotros — Innocaps Lab",
  description:
    "Quiénes somos: propósito, filosofía, equipo científico, alianzas estratégicas y plataforma corporativa de Innocaps Lab.",
};

/* ═══════════════════════════════════════════════════════════════════
   NOSOTROS — vista propia con el contenido AboutPage completo
   + capa nanotech de fondo (NanoBackground), coherente con la home
   ═══════════════════════════════════════════════════════════════════ */

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Capa de presentación: canvas nanotech + barra de progreso */}
      <NanoBackground />

      <Header />
      <div className="overflow-hidden">
        <AboutPage />
      </div>
    </main>
  );
}
