'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelViewer from './ModelViewer';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 1 — TECNOLOGÍA (Bio & WiBio)
   Visor 3D de la microcápsula sinérgica con 3 hotspots flotantes
   clickeables que actualizan la tarjeta técnica lateral.
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
    /* Posición del marcador sobre el visor (esquinas libres del canvas) */
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

export default function BioTecnologia() {
  const [activeId, setActiveId] = useState(HOTSPOTS[0].id);
  const active = HOTSPOTS.find((h) => h.id === activeId) || HOTSPOTS[0];

  return (
    <div id="bio-tab-tecnologia" role="tabpanel" aria-label="Nuestra tecnología">
      {/* ── Encabezado de sub-vista ── */}
      <div className="bio-subhead max-w-2xl mx-auto text-center mb-12">
        <span className="bio-tech-badge">Micela · Modelo 3D</span>
        <h3 className="mt-4 text-3xl md:text-4xl font-light tracking-wide mb-3 text-white">
          Nuestra <span className="txt-grad font-semibold">Tecnología</span>
        </h3>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Tres pilares tecnológicos que transforman bioactivos en ingredientes funcionales
          superiores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
        {/* ── Visor 3D con hotspots flotantes ── */}
        <div className="bio-glass bio-glass--cyan relative h-[400px] sm:h-[460px] lg:h-[540px] overflow-hidden">
          <ModelViewer />

          {HOTSPOTS.map((h) => {
            const isActive = h.id === activeId;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveId(h.id)}
                onMouseEnter={() => setActiveId(h.id)}
                onFocus={() => setActiveId(h.id)}
                aria-pressed={isActive}
                aria-label={h.title}
                className={`bio-chip absolute z-10 ${isActive ? 'bio-chip--active' : ''} ${h.pos}`}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#00f5d4]/60 animate-ping" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f5d4]" />
                </span>
                <span className="font-mono tabular-nums">{h.num}</span>
                <span className="hidden sm:inline">{h.short}</span>
              </button>
            );
          })}

          {/* Pista de interacción */}
          <span className="absolute bottom-4 right-5 z-10 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400/70 pointer-events-none">
            drag to rotate
          </span>
        </div>

        {/* ── Tarjeta técnica lateral ── */}
        <div className="bio-glass p-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <span className="font-mono text-xs tabular-nums bio-accent-cyan tracking-[0.2em]">
                HOTSPOT {active.num}
              </span>
              <h4 className="text-2xl font-semibold mt-2 mb-3 text-white">{active.title}</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{active.resumen}</p>

              <dl className="space-y-0">
                {active.detalles.map((d) => (
                  <div
                    key={d.label}
                    className="grid grid-cols-[96px_1fr] gap-3 py-3 border-t border-teal-500/15 text-sm"
                  >
                    <dt className="bio-accent-teal font-medium">{d.label}</dt>
                    <dd className="text-slate-200 leading-relaxed">{d.valor}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
