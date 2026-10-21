'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 1 — FILOSOFÍA (Tabs de pilares)
   Selector horizontal accesible con fade-in del contenido
   ═══════════════════════════════════════════════════════════════════ */

const PILARES = [
  {
    id: 'integral',
    num: '01',
    icon: '🌱',
    titulo: 'Aprovechamiento Integral',
    descripcion: 'Creemos en una ciencia eficiente y sostenible. Integramos matrices biológicas completas cuando es técnicamente viable, reduciendo procesos innecesarios y optimizando recursos. Trabajamos bajo el principio de que cada componente puede aportar funcionalidad si se entiende y se diseña correctamente.',
  },
  {
    id: 'estabilidad',
    num: '02',
    icon: '🔬',
    titulo: 'Ingeniería de Estabilidad',
    descripcion: 'Dominamos tecnologías como el secado por aspersión (spray drying) y la vitrificación controlada para generar matrices protectoras que preservan la viabilidad y funcionalidad de los activos sensibles.',
  },
  {
    id: 'arquitectura',
    num: '03',
    icon: '🧬',
    titulo: 'Arquitectura Molecular a Medida',
    descripcion: 'Diseñamos sistemas como micelas, niosomas, dendrímeros, liposomas, nanopartículas lipídicas sólidas y matrices poliméricas según las propiedades fisicoquímicas del activo. Cada formulación responde a una estrategia: estabilidad, liberación controlada, biodisponibilidad o protección frente a condiciones ambientales.',
  },
];

function PillarTab({ pillar, isActive, onActivate }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`philosophy-panel-${pillar.id}`}
      id={`philosophy-tab-${pillar.id}`}
      onClick={() => onActivate(pillar.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate(pillar.id);
        }
      }}
      className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive
          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
          : 'text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>{pillar.icon}</span>
        <span className="hidden sm:inline">{pillar.titulo}</span>
      </span>
      {isActive && (
        <motion.span
          layoutId="philosophy-tab-indicator"
          className="absolute inset-0 rounded-full border border-cyan-400/40 bg-cyan-400/10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default function PhilosophyTabs() {
  const [activeId, setActiveId] = useState(PILARES[0].id);

  const activePillar = PILARES.find(p => p.id === activeId) || PILARES[0];

  return (
    <div id="philosophy-tabs" role="tabpanel" aria-label="Filosofía científica">
      {/* ── Encabezado ── */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Ciencia aplicada con <span className="txt-grad font-semibold">propósito</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Tres pilares que guían cada decisión de I+D y cada formulación que diseñamos.
        </p>
      </div>

      {/* ── Selector de pilares (tablist) ── */}
      <div className="flex justify-center mb-12 overflow-x-auto px-4 -mx-4" role="tablist" aria-label="Pilares de la filosofía InnoCaps">
        <div className="inline-flex flex-nowrap gap-2 rounded-full border border-cyan-400/20 bg-slate-900/50 p-1.5 backdrop-blur-md">
          {PILARES.map((pillar) => (
            <PillarTab
              key={pillar.id}
              pillar={pillar}
              isActive={activeId === pillar.id}
              onActivate={setActiveId}
            />
          ))}
        </div>
      </div>

      {/* ── Contenido del pilar activo ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          id={`philosophy-panel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`philosophy-tab-${activeId}`}
          className="relative"
        >
          <div className="max-w-3xl mx-auto">
            {/* Tarjeta del pilar — fondo sólido translúcido + blur fuerte
                para que el texto no compita con las partículas */}
            <div className="relative rounded-3xl border border-cyan-400/20 bg-slate-950/75 backdrop-blur-xl p-8 md:p-10 overflow-hidden">
              {/* Glow de fondo del ícono */}
              <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                {/* Ícono con glow */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 300 }}
                  className="relative flex-shrink-0"
                >
                  <span className="relative inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/30">
                    <span className="text-5xl md:text-6xl relative z-10">{activePillar.icon}</span>
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl opacity-50 animate-pulse" aria-hidden="true" />
                  </span>
                </motion.div>

                {/* Texto */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs tabular-nums text-cyan-400/70 tracking-[0.2em] uppercase">{activePillar.num}</span>
                    <h4 className="text-2xl md:text-3xl font-semibold text-white">{activePillar.titulo}</h4>
                  </div>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">{activePillar.descripcion}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}