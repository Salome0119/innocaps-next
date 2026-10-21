import type { Metadata } from "next";
import { Suspense } from 'react';
import { Header } from "@/components/Header";
import BioHero from "@/components/BioHero";
import BioWiBioSection from "@/components/BioWiBioSection";
import BioBackground3D from "@/components/BioBackground3D";
import { esVistaTecnologia } from "@/lib/vistaBio";

export const metadata: Metadata = {
  title: "InnoCaps Bio & WiBio — Escalamiento y comercialización",
  description:
    "Estrategia InnoCaps Bio & WiBio: escalamiento industrial, portafolio de ingredientes funcionales y suministro B2B con soporte técnico en planta.",
};

/* ═══════════════════════════════════════════════════════════════════
   BIO — Unidad 02 (estrategia Bio & WiBio)
   Hero corporativa propia (.bio-* en globals.css) + visor 3D de la
   micela, seguido del módulo con sub-vistas conmutadas por ?seccion=
   (cada vista compone sus propios módulos; el bloque "Cero Aditivos"
   vive exclusivamente dentro de la vista de Proceso y Aplicaciones)

   El héroe ("Unidad 02 · Escala Industrial") es exclusivo de la vista
   de Tecnología y Escalamiento: se resuelve ?seccion= en el servidor
   para no emitirlo en las vistas de Soluciones B2B ni de Proceso y
   Aplicaciones.
   ═══════════════════════════════════════════════════════════════════ */

export default async function BioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const mostrarHero = esVistaTecnologia(params?.seccion);

return (
    <main className="relative min-h-screen bg-slate-950">
      {/* Fondo 3D: micela fija anclada al viewport (estilo Lab) */}
      <BioBackground3D />
      
      <Header />
      {mostrarHero && <BioHero />}
      <Suspense fallback={
        <div className="relative z-10 w-full px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="bio-glass p-8 md:p-12">
              <span className="bio-tech-badge">Unidad 02 · Escalamiento e Industria</span>
              <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-wide text-white">
                InnoCaps <span className="txt-grad font-semibold">Bio & WiBio</span>
              </h2>
              <div className="mt-8 h-96 animate-pulse rounded-3xl border border-teal-500/20 bg-teal-500/5" />
            </div>
          </div>
        </div>
      }>
        <BioWiBioSection />
      </Suspense>
    </main>
  );
}
