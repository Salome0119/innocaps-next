'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const BioreactorScene = dynamic(() => import('./BioreactorScene'), { ssr: false, loading: () => null });

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA — ESCALAMIENTO (Bio & WiBio)
   Narrativa: piloto → industrial, TRL, capacidades B2B + Bioreactor 3D
   Estilo homologado a /lab: glassmorphism, gradientes, animaciones Framer Motion
   ════════════════════════════════════════════════════════════════════ */

const ESCALAMIENTO_STAGES = [
  {
    id: 'piloto',
    num: '01',
    title: 'Producción Piloto',
    icon: '🧪',
    description: 'Lotes piloto (10-500 L) en biorreactores de precisión para validar parámetros críticos antes del escalado.',
    trl: 'TRL 4-5',
    capabilities: ['Optimización de medios', 'Control de pH/DO automatizado', 'Muestreo en tiempo real'],
  },
  {
    id: 'prototipos',
    num: '02',
    title: 'Prototipos Industriales',
    icon: '⚙️',
    description: 'Corridas de validación en escala pre-comercial (500-2000 L) replicando condiciones de planta final.',
    trl: 'TRL 6-7',
    capabilities: ['Escalado geométrico/dinámico', 'Estabilidad de lote a lote', 'Calificación de equipos'],
  },
  {
    id: 'industrial',
    num: '03',
    title: 'Escalado Industrial',
    icon: '🏭',
    description: 'Producción a escala comercial (>5000 L) con trazabilidad completa y certificación por lote.',
    trl: 'TRL 8-9',
    capabilities: ['Manufactura GMP', 'Control estadístico de proceso (SPC)', 'Cadenas de suministro validadas'],
  },
  {
    id: 'b2b',
    num: '04',
    title: 'Suministro B2B',
    icon: '📦',
    description: 'Entrega de ingredientes funcionales estandarizados con soporte técnico en planta del cliente.',
    trl: 'Comercial',
    capabilities: ['Formatos: saco, cuñete, IBC/granel', 'Fichas técnicas + CoA por lote', 'Acompañamiento en integración'],
  },
];

/* Animación helpers (estilo Lab) */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const stagger = (delay = 0) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay },
});

export default function BioEscalamiento() {
  const [isMounted, setIsMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional for SSR hydration
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  return (
    <div id="bio-tab-escalamiento" role="tabpanel" aria-label="Escalamiento industrial">
      {/* ── Encabezado de sub-vista (estilo Lab) ── */}
      <motion.div
        {...stagger(0)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-6 text-center md:p-8 md:mb-12 backdrop-blur-xl max-w-3xl mx-auto"
      >
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
          Escalamiento <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">Industrial</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Convertimos el desarrollo de laboratorio en procesos escalables, robustos y reproducibles.
          Puente entre el descubrimiento científico y la manufactura comercial.
        </p>
      </motion.div>

      {/* ── Grid: Bioreactor 3D + Etapas ── */}
      <motion.div
        {...stagger(0.15)}
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start"
      >
        {/* ── Bioreactor 3D (glassmorphism estilo Lab) ── */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-xl h-[400px] sm:h-[460px] lg:h-[540px]">
          <BioreactorScene />
          <span className="absolute bottom-4 right-5 z-10 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
            drag to rotate
          </span>
        </div>

        {/* ── Timeline de escalamiento ── */}
        <div className="space-y-6">
          {ESCALAMIENTO_STAGES.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              className="relative pl-4 pb-8 border-l border-slate-700/50 last:border-0 last:pb-0"
            >
              {/* Marcador TRL (estilo Lab) */}
              <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-slate-950 shadow-lg">
                {stage.num}
              </div>

              {/* Conector vertical */}
              <div className="absolute -left-[5px] top-8 bottom-0 w-px bg-gradient-to-b from-teal-500/60 to-transparent" aria-hidden="true" />

              {/* Tarjeta glassmorphism (estilo Lab) */}
              <div className="relative rounded-2xl bg-slate-900/60 border border-slate-700/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl mt-1">{stage.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-semibold text-white">{stage.title}</h4>
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        {stage.trl}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{stage.description}</p>
                  </div>
                </div>

                {/* Capacidades */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-slate-700/50">
                  {stage.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {cap}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Puente Lab → Bio (estilo Lab) ── */}
      <motion.div
        {...stagger(0.3)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 mt-16 md:mt-24 p-8 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-2xl md:text-3xl font-light tracking-wide mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">Lab crea.</span> Bio escala.
          </h4>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            InnoCaps Lab genera la evidencia experimental y la formulación validada.
            InnoCaps Bio la transforma en ingredientes funcionales con trazabilidad,
            certificación y soporte técnico para su integración en tu planta.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              I+D validada
            </span>
            <span className="text-teal-500/40">→</span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Piloto
            </span>
            <span className="text-teal-500/40">→</span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Industrial
            </span>
            <span className="text-teal-500/40">→</span>
            <span className="flex items-center gap-1 text-teal-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              B2B Ready
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}