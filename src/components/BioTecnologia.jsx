'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MolecularStructure from './MolecularStructure';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 1 — TECNOLOGÍA (Bio & WiBio)
   Visor 3D de la microcápsula sinérgica con 3 hotspots flotantes
   clickeables que actualizan la tarjeta técnica lateral.
   Estilo homologado a /lab: glassmorphism, gradientes, animaciones
   ═══════════════════════════════════════════════════════════════════ */

const HOTSPOTS = [
  {
    id: 'microencapsulacion',
    num: '01',
    short: 'Microencapsulación',
    title: 'Microencapsulación Sinérgica',
    resumen: 'Protege, estabiliza y libera principios activos de forma controlada.',
    detalles: [
      {
        label: 'Matriz',
        valor: (
          <>
            <GlossaryTooltip term="Maltodextrina">Maltodextrina</GlossaryTooltip> y{' '}
            <GlossaryTooltip term="Goma arábiga">goma arábiga</GlossaryTooltip> como carriers de la
            matriz vítrea.
          </>
        ),
      },
      {
        label: 'Mecanismo',
        valor: 'Inmovilización del activo en matriz vítrea tras el secado por aspersión.',
      },
      {
        label: 'Protección',
        valor: 'Barrera frente a oxígeno, luz y humedad durante el almacenamiento.',
      },
      {
        label: 'Liberación',
        valor: 'Liberación controlada en la ruta de proceso o de consumo.',
      },
    ],
    pos: 'top-[8%] left-[4%]',
  },
  {
    id: 'ingredientes',
    num: '02',
    short: 'Ingredientes',
    title: 'Ingredientes Funcionales',
    resumen: 'Bioactivos y nutrientes de origen natural con estándares de alta pureza.',
    detalles: [
      {
        label: 'Origen',
        valor: 'Activos de fuentes naturales seleccionados por estabilidad y rendimiento.',
      },
      {
        label: 'Estandarización',
        valor: 'Cada lote se libera contra especificaciones de potencia y pureza.',
      },
      {
        label: 'Formatos',
        valor: 'Polvos, emulsiones y concentrados según la ruta de integración industrial.',
      },
      {
        label: 'Trazabilidad',
        valor: 'Documentación técnica y certificados de análisis por lote.',
      },
    ],
    pos: 'top-[42%] right-[3%]',
  },
  {
    id: 'ciencia',
    num: '03',
    short: 'Ciencia Aplicada',
    title: 'Ciencia Aplicada',
    resumen: 'Formulaciones desarrolladas con evidencia científica y pruebas de estabilidad.',
    detalles: [
      {
        label: 'Desarrollo',
        valor: 'Diseño de formulación apoyado en datos de compatibilidad y estabilidad.',
      },
      {
        label: 'Estabilidad',
        valor: 'Ensayos de estabilidad acelerada y condiciones reales de almacenamiento.',
      },
      {
        label: 'Caracterización',
        valor: 'Tamaño de partícula, morfología y perfil de liberación.',
      },
      {
        label: 'Soporte',
        valor: 'Fichas técnicas y acompañamiento en planta durante la integración.',
      },
    ],
    pos: 'bottom-[10%] left-[8%]',
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

export default function BioTecnologia() {
  const [activeId, setActiveId] = useState(HOTSPOTS[0].id);
  const active = HOTSPOTS.find((h) => h.id === activeId) || HOTSPOTS[0];

  return (
    <div id="bio-tab-tecnologia" role="tabpanel" aria-label="Nuestra tecnología">
      {/* ── Encabezado de sub-vista (estilo Lab) ── */}
      <motion.div
        {...stagger(0)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-6 text-center md:p-8 md:mb-12 backdrop-blur-xl max-w-3xl mx-auto"
      >
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.25em] uppercase text-teal-400 border border-teal-500/30 rounded-full bg-teal-500/5">
          Micela · Modelo 3D
        </span>
        <h3 className="mt-4 text-3xl md:text-4xl font-light tracking-wide mb-3 text-white">
          Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">Tecnología</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Tres pilares tecnológicos que transforman bioactivos en ingredientes funcionales
          superiores.
        </p>
      </motion.div>

      <motion.div
        {...stagger(0.15)}
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch"
      >
        {/* ── Visor 3D molecular interactivo con hotspots ── */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 overflow-hidden backdrop-blur-xl h-[400px] sm:h-[460px] lg:h-[540px]">
          <MolecularStructure
            activeHotspot={activeId}
            onHotspotSelect={setActiveId}
            hotspots={HOTSPOTS}
          />

          {/* Pista de interacción */}
          <span className="absolute bottom-4 right-5 z-10 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 pointer-events-none">
            arrastra para rotar · zoom para dispersar/reconstruir
          </span>
        </div>

        {/* ── Tarjeta técnica lateral (glassmorphism estilo Lab) ── */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-8 flex flex-col justify-center backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <span className="font-mono text-xs tabular-nums text-teal-400 tracking-[0.2em]">
                HOTSPOT {active.num}
              </span>
              <h4 className="text-2xl font-semibold mt-2 mb-3 text-white">{active.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{active.resumen}</p>

              <dl className="space-y-0">
                {active.detalles.map((d) => (
                  <div
                    key={d.label}
                    className="grid grid-cols-[96px_1fr] gap-3 py-3 border-t border-slate-700/50 text-sm"
                  >
                    <dt className="text-teal-400 font-medium">{d.label}</dt>
                    <dd className="text-slate-300 leading-relaxed">{d.valor}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}