'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA — APLICACIONES ("¿Dónde encaja tu empresa?")
   Grilla de 6 industrias seleccionables con brillo cian; al elegir
   una, se despliega su ficha de beneficios clave.
   Estilo homologado a /lab: glassmorphism, gradientes, animaciones Framer Motion
   ═══════════════════════════════════════════════════════════════════ */

const SECTORES = [
  {
    id: 'nutricion',
    nombre: 'Nutrición Funcional & Suplementos',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21c-4.5 0-7-3-7-7 0-5 4-8.5 7-11 3 2.5 7 6 7 11 0 4-2.5 7-7 7Z" />
        <path d="M12 21V9" />
      </svg>
    ),
    beneficios: [
      'Estabilidad de vitaminas y ácidos grasos sensibles en premix',
      'Enmascaramiento de sabores y olores en formatos finales',
      'Liberación controlada que preserva la potencia hasta el consumo',
    ],
  },
  {
    id: 'salud',
    nombre: 'Salud y Bienestar / OTC',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 4v16M4 12h16" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    beneficios: [
      'Dosificación uniforme y consistente entre lotes productivos',
      'Ensayos de estabilidad acelerada para dossier regulatorio',
      'Soporte documental de calidad y trazabilidad por lote',
    ],
  },
  {
    id: 'alimentos',
    nombre: 'Alimentos y Bebidas',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12l-1 7a5 5 0 0 1-10 0L6 3Z" />
        <path d="M12 15v6M8.5 21h7" />
      </svg>
    ),
    beneficios: [
      'Resistencia al procesamiento térmico y a medios acuosos',
      'Solubilidad y dispersión controladas en bebida instantánea',
      'Opciones de formulación compatibles con clean label',
    ],
  },
  {
    id: 'cosmetica',
    nombre: 'Cosmética y Cuidado Personal',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3h6v4l2 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10l2-3V3Z" />
        <path d="M7 14h10" />
      </svg>
    ),
    beneficios: [
      'Protección de activos sensibles frente a luz y oxígeno',
      'Liberación prolongada en formulaciones tópicas y hair care',
      'Estabilidad en medios acuosos sin afectar la textura',
    ],
  },
  {
    id: 'animal',
    nombre: 'Salud Animal y Veterinaria',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7" cy="8" r="2" />
        <circle cx="17" cy="8" r="2" />
        <circle cx="5" cy="13" r="1.7" />
        <circle cx="19" cy="13" r="1.7" />
        <path d="M12 12c-3 0-5.5 2.5-5.5 5a2.5 2.5 0 0 0 2.5 2.5c1 0 1.9-.5 3-.5s2 .5 3 .5a2.5 2.5 0 0 0 2.5-2.5c0-2.5-2.5-5-5.5-5Z" />
      </svg>
    ),
    beneficios: [
      'Resistencia al procesamiento térmico de pienso',
      'Dosificación estable en agua de bebida',
      'Estabilidad en condiciones de campo y almacenamiento',
    ],
  },
  {
    id: 'agro',
    nombre: 'Agronegocios y Biotecnología',
    icono: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21V10" />
        <path d="M12 10C12 6 9 3 5 3c0 4 3 7 7 7Z" />
        <path d="M12 13c0-3.5 2.7-6 6.5-6 0 3.5-2.7 6-6.5 6Z" />
      </svg>
    ),
    beneficios: [
      'Protección de cepas y metabolitos durante el almacenamiento',
      'Liberación en el entorno agronómico de destino',
      'Compatibilidad con formulaciones de bioestimulación',
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

export default function BioAplicaciones() {
  const [activeId, setActiveId] = useState(SECTORES[0].id);
  const active = SECTORES.find((s) => s.id === activeId) || SECTORES[0];

  return (
    <div id="bio-tab-aplicaciones" role="tabpanel" aria-label="Sectores e industrias">
      {/* ── Encabezado de sub-vista (estilo Lab) ── */}
      <motion.div
        {...stagger(0)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-6 text-center md:p-8 md:mb-12 backdrop-blur-xl max-w-3xl mx-auto"
      >
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Sectores e Industrias <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">Target</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Desarrollos a la medida para múltiples mercados globales.
        </p>
      </motion.div>

      {/* ── Grilla interactiva de 6 tarjetas (estilo Lab) ── */}
      <motion.div
        {...stagger(0.1)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        role="tablist"
        aria-label="Industrias objetivo"
      >
        {SECTORES.map((s) => {
          const isActive = s.id === activeId;
          return (
            <motion.button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(s.id)}
              className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                isActive
                  ? 'border-teal-500/50 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                  : 'border-slate-700/50 bg-slate-900/60 backdrop-blur-md hover:border-teal-500/40'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500'}`}
              >
                {s.icono}
              </span>
              <span className={`text-sm font-medium leading-snug transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {s.nombre}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Ficha de beneficios del sector elegido (glassmorphism estilo Lab) ── */}
      <motion.div
        {...stagger(0.15)}
        className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-8 backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-teal-400">{active.icono}</span>
              <h4 className="text-xl font-semibold text-white">{active.nombre}</h4>
            </div>

            <span className="block text-xs uppercase tracking-[0.15em] text-teal-400/80 mb-4">
              Beneficios clave
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
              {active.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}