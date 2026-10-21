'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA — CÓMO TRABAJAMOS (Niveles de colaboración B2B)
   Selector de 3 niveles con detalle dinámico y CTA "Solicitar reunión".
   Estilo homologado a /lab: glassmorphism, gradientes, animaciones Framer Motion
   ═══════════════════════════════════════════════════════════════════ */

const NIVELES = [
  {
    id: 'piloto',
    num: 'Nivel 1',
    nombre: 'Proyecto Piloto',
    resumen: 'Desarrollo conjunto y prueba de concepto inicial.',
    entregable: 'Producto piloto validado con evidencia.',
    puntos: [
      'Definición conjunta del activo y la matriz encapsulante',
      'Producción de lote piloto y ajuste de proceso',
      'Informe de validación con datos de estabilidad iniciales',
    ],
  },
  {
    id: 'alianza',
    num: 'Nivel 2',
    nombre: 'Alianza Tecnológica',
    resumen: 'Co-desarrollo en I+D+i para formulaciones exclusivas.',
    entregable: 'Producto optimizado listo para escala.',
    puntos: [
      'Formulación exclusiva bajo acuerdo de desarrollo',
      'Iteración analítica y pruebas en condiciones de proceso',
      'Paquete tecnológico preparado para escalamiento industrial',
    ],
  },
  {
    id: 'suministro',
    num: 'Nivel 3',
    nombre: 'Suministro WiBio',
    resumen: 'Abastecimiento continuo y soporte técnico.',
    entregable: 'Lotes industriales con trazabilidad y calidad garantizada.',
    puntos: [
      'Programación de volúmenes y calendario de entregas',
      'Soporte técnico en planta durante la integración',
      'Trazabilidad y documentación de calidad por lote',
    ],
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

export default function BioColaboracion() {
  const [activeId, setActiveId] = useState(NIVELES[0].id);
  const active = NIVELES.find((n) => n.id === activeId) || NIVELES[0];

  return (
    <div id="bio-tab-colaboracion" role="tabpanel" aria-label="Niveles de relación B2B">
      {/* ── Encabezado de sub-vista (estilo Lab) ── */}
      <motion.div
        {...stagger(0)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-6 text-center md:p-8 md:mb-12 backdrop-blur-xl max-w-3xl mx-auto"
      >
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Tres Niveles de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">Relación B2B</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Modelos flexibles adaptados al estado de desarrollo de tu empresa.
        </p>
      </motion.div>

      {/* ── Selector de niveles (estilo Lab) ── */}
      <motion.div
        {...stagger(0.1)}
        className="flex flex-wrap justify-center gap-3 mb-8"
        role="tablist"
        aria-label="Niveles de colaboración"
      >
        {NIVELES.map((n) => {
          const isActive = n.id === activeId;
          return (
            <motion.button
              key={n.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(n.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                  : 'border-slate-700/50 bg-slate-900/60 text-slate-400 backdrop-blur-md hover:border-teal-500/40 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-mono tabular-nums text-xs mr-2 opacity-70">{n.num}</span>
              {n.nombre}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Detalle del nivel seleccionado (glassmorphism estilo Lab) ── */}
      <motion.div
        {...stagger(0.15)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-8 md:p-10 backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center"
          >
            <div>
              <span className="font-mono text-xs tabular-nums text-teal-400/70 tracking-[0.2em] uppercase">
                {active.num}
              </span>
              <h4 className="text-2xl font-semibold text-white mt-2 mb-2">{active.nombre}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{active.resumen}</p>

              <ul className="space-y-2.5">
                {active.puntos.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:min-w-[240px] lg:border-l lg:border-slate-700/50 lg:pl-8">
              <span className="block text-xs uppercase tracking-[0.15em] text-teal-400/80 mb-2">
                Entregable
              </span>
              <p className="text-white font-medium text-sm leading-relaxed mb-6">
                {active.entregable}
              </p>
              <a
                href="/contacto?type=bio"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:scale-105"
              >
                Solicitar reunión <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}