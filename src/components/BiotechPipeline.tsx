'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { biotechPipeline } from '@/data/sectionsData';

/* Visor 3D del pipeline: solo se hidrata en cliente (Three.js fuera del SSR) */
const PipelineScene3D = dynamic(() => import('@/components/PipelineScene3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] sm:h-[400px] md:h-[460px] w-full rounded-3xl border border-slate-800 bg-[#031417] flex flex-col items-center justify-center gap-4">
      <span className="font-mono text-xs uppercase tracking-[0.35em] text-teal-400/80 animate-pulse">
        Inicializando visor 3D
      </span>
      <div className="w-40 h-px rounded-full bg-teal-500/15 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-teal-400 animate-pulse" />
      </div>
    </div>
  ),
});

export default function BiotechPipeline() {
  const [active, setActive] = useState(0);

  return (
  <section id="pipeline" className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-32 overflow-hidden scroll-mt-28">
  {/* Degradado superior */}
  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
  
  {/* Degradado inferior */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
  
  {/* Grid de fondo */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Header */}
    <div className="text-center mb-12 md:mb-24">
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
        Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">Proceso</span>
      </h2>
      <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-[1.5]">
        Un enfoque estructurado que garantiza resultados excepcionales en cada proyecto
      </p>
    </div>

    {/* Pipeline con imágenes */}
    <div className="max-w-7xl mx-auto">
      {/* Flujo 3D interactivo: nodos bioluminiscentes + haces de luz */}
      <div className="relative mb-8 md:mb-12">
        <PipelineScene3D
          stages={biotechPipeline}
          active={active}
          onSelect={setActive}
          onHover={setActive}
        />
      </div>

      {/* Selector de etapas sincronizado con el visor 3D */}
      <div
        className="mb-14 md:mb-16 flex flex-wrap items-center justify-center gap-2 md:gap-3"
        role="group"
        aria-label="Etapas del pipeline"
      >
        {biotechPipeline.map((stage, index) => {
          const isActive = active === index;
          return (
            <button
              key={stage.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 shadow-lg shadow-teal-500/30 scale-105'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-teal-500/40 hover:text-teal-300'
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest md:text-xs">{index + 1}</span>
              <span>{stage.stage}</span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 md:mt-20 text-center">
        <p className="text-slate-400 mb-6 text-base md:text-lg">¿Listo para transformar tu proyecto?</p>
        <button className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:from-teal-400 active:to-cyan-400 text-slate-900 font-bold rounded-full transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 text-lg">
          Comienza Tu Consulta
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
