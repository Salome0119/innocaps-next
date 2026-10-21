'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 3 — CÓMO TRABAJAMOS (Niveles de colaboración B2B)
   Selector de 3 niveles con detalle dinámico y CTA "Solicitar reunión".
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

export default function BioColaboracion() {
  const [activeId, setActiveId] = useState(NIVELES[0].id);
  const active = NIVELES.find((n) => n.id === activeId) || NIVELES[0];

  return (
    <div id="bio-tab-colaboracion" role="tabpanel" aria-label="Niveles de relación B2B">
      {/* ── Encabezado de sub-vista ── */}
      <div className="bio-subhead max-w-2xl mx-auto text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Tres Niveles de <span className="txt-grad font-semibold">Relación B2B</span>
        </h3>
        <p className="text-[#b0b0b0] text-sm md:text-base leading-relaxed">
          Modelos flexibles adaptados al estado de desarrollo de tu empresa.
        </p>
      </div>

      {/* ── Selector de niveles ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-8" role="tablist" aria-label="Niveles de colaboración">
        {NIVELES.map((n) => {
          const isActive = n.id === activeId;
          return (
            <button
              key={n.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(n.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'border-[#00ffff]/60 bg-[#00ffff]/10 text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                  : 'border-[#00ffff]/20 bg-[#041915]/60 text-[#b0b0b0] backdrop-blur-md hover:border-[#00ffff]/40 hover:text-[#f0f0f0]'
              }`}
            >
              <span className="font-mono tabular-nums text-xs mr-2 opacity-70">{n.num}</span>
              {n.nombre}
            </button>
          );
        })}
      </div>

      {/* ── Detalle del nivel seleccionado ── */}
        <div className="bio-glass p-8 md:p-10">
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
              <span className="font-mono text-xs tabular-nums text-[#00ffff]/70 tracking-[0.2em] uppercase">
                {active.num}
              </span>
              <h4 className="text-2xl font-semibold text-[#f0f0f0] mt-2 mb-2">{active.nombre}</h4>
              <p className="text-[#b0b0b0] text-sm leading-relaxed mb-5">{active.resumen}</p>

              <ul className="space-y-2.5">
                {active.puntos.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-[#d1d8d6] leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00ffff]/70" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:min-w-[240px] lg:border-l lg:border-[#00ffff]/10 lg:pl-8">
              <span className="block text-xs uppercase tracking-[0.15em] text-[#00ffff]/80 mb-2">
                Entregable
              </span>
              <p className="text-[#f0f0f0] font-medium text-sm leading-relaxed mb-6">
                {active.entregable}
              </p>
              <a
                href="/contacto?type=bio"
                className="inline-flex items-center gap-2 rounded-lg bg-[#00ffff] px-5 py-3 text-sm font-semibold text-[#03100e] transition-all hover:bg-[#00e6eb] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
              >
                Solicitar reunión <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
