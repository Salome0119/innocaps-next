'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import GlossaryTooltip from './GlossaryTooltip';

const MicrocapsuleCore = dynamic(() => import('./MicrocapsuleCore'), { ssr: false, loading: () => null });

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 3 — SOLUCIONES B2B / PORTAFOLIO WIBIO
   Microcápsula 3D + Series de producto + Modelos de negocio + Verticales + Formatos
   ═══════════════════════════════════════════════════════════════════ */

// 5 SERIES DE PRODUCTO
const SERIES = [
  {
    id: 'gutacid',
    nombre: 'GutAcid Balance®',
    descriptor: 'Protección gástrica de doble capa con liberación intestinal dirigida',
    trl: 'TRL 7',
    trlColor: 'emerald',
    detalle: [
      { label: 'Tecnología', valor: 'Microencapsulación de doble capa (núcleo + cáscara entérica)' },
      { label: 'Mecanismo', valor: 'Cáscara exterior resistente a pH gástrico; liberación en intestino delgado' },
      { label: 'Activos', valor: 'Probióticos, ácidos orgánicos, enzimas sensibles al pH' },
      { label: 'Aplicación', valor: (
        <>
          <GlossaryTooltip term="Nutracéuticos">Nutracéuticos</GlossaryTooltip>
          {', alimentos funcionales, salud animal'}
        </>
      )},
      { label: 'Estabilidad', valor: '24 meses a 25 °C / 60 % HR' },
    ],
  },
  {
    id: 'kelaphy',
    nombre: 'KelaPhy®',
    descriptor: 'Sistema molecular de fitoactivos bioencapsulados con estabilidad máxima',
    trl: 'TRL 6',
    trlColor: 'cyan',
    detalle: [
      { label: 'Tecnología', valor: 'Bioencapsulación en matriz polimérica de alta pureza' },
      { label: 'Mecanismo', valor: 'Protección frente a oxidación, luz y temperatura' },
      { label: 'Activos', valor: 'Curcuminoides, quercetina, resveratrol, EGCG' },
      { label: 'Aplicación', valor: (
        <>
          Suplementos premium, cosmética activa,{' '}
          <GlossaryTooltip term="Nutracéuticos">nutracéuticos</GlossaryTooltip>
        </>
      )},
      { label: 'Estabilidad', valor: '18 meses a 25 °C / 60 % HR' },
    ],
  },
  {
    id: 'curnova',
    nombre: 'CurNova®',
    descriptor: 'Curcumino fitosomal de ultra-alta biodisponibilidad y poder antioxidante',
    trl: 'TRL 8',
    trlColor: 'teal',
    detalle: [
      { label: 'Tecnología', valor: 'Fitosomal (complejo fosfolípido-curcumina)' },
      { label: 'Mecanismo', valor: 'Absorción linfática que evita metabolismo hepático de primer paso' },
      { label: 'Activos', valor: 'Curcumina + fosfolípidos de girasol' },
      { label: 'Aplicación', valor: (
        <>
          Salud articular, cognitiva, cardiovascular,{' '}
          <GlossaryTooltip term="Biodisponibilidad">biodisponibilidad</GlossaryTooltip>
          {' 29× vs. curcumina libre'}
        </>
      )},
      { label: 'Estabilidad', valor: '24 meses a 25 °C / 60 % HR' },
    ],
  },
  {
    id: 'microbiome',
    nombre: 'Microbiome Series',
    descriptor: 'Pre/Pro/Postbióticos y consorcios microbianos — I+D temprana',
    trl: 'TRL 2–4',
    trlColor: 'amber',
    detalle: [
      { label: 'Enfoque', valor: (
        <>
          Consorcios definidos + matriz protectora propia (EPS +{' '}
          <GlossaryTooltip term="Vitrificación">vitrificación</GlossaryTooltip>
          )
        </>
      )},
      { label: 'Candidatos', valor: 'Lactiplantibacillus, Bifidobacterium, Akkermansia, consorcios sintéticos' },
      { label: 'Mecanismo', valor: 'Viabilidad gástrica + colonización intestinal + producción de metabolitos' },
      { label: 'Aplicación', valor: (
        <>
          Salud digestiva, inmunidad, eje intestino-cerebro,{' '}
          <GlossaryTooltip term="Salud animal">salud animal</GlossaryTooltip>
        </>
      )},
      { label: 'Estado', valor: 'Validación in vitro / modelos animales; escalado piloto en curso' },
    ],
  },
  {
    id: 'science',
    nombre: 'Science Series',
    descriptor: 'Curcuminoides, nitratos cardiovasculares, antioxidantes hepatoprotectores — listos para mercado',
    trl: 'TRL 6+',
    trlColor: 'violet',
    detalle: [
      { label: 'Líneas', valor: 'Curcuminoides alta pureza, Nitratos de remolacha estandarizados, Silimarina fitosomal, CoQ10 microencapsulada' },
      { label: 'Mecanismo', valor: 'Entrega dirigida + estabilidad oxidativa + evidencia clínica de soporte' },
      { label: 'Aplicación', valor: (
        <>
          <GlossaryTooltip term="Pharma/OTC">Pharma/OTC</GlossaryTooltip>
          {', suplementos clínicos, nutrición médica'}
        </>
      )},
      { label: 'Validación', valor: 'Estudios de estabilidad ICH, perfiles de liberación, seguridad' },
      { label: 'Estabilidad', valor: '24–36 meses según activo' },
    ],
  },
];

// 3 MODELOS DE NEGOCIO
const BUSINESS_MODELS = [
  {
    id: 'ingredientes',
    num: '01',
    titulo: 'Ingredientes Funcionales',
    subtitulo: 'Listos para formular',
    descripcion: 'Portafolio de ingredientes microencapsulados estandarizados (GutAcid Balance®, KelaPhy®, CurNova®, Science Series) con ficha técnica, CoA por lote y validación de estabilidad. Entrega en saco, cuñete o IBC/granel según necesidad.',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
  },
  {
    id: 'desarrollo',
    num: '02',
    titulo: 'Desarrollo Tecnológico',
    subtitulo: 'Co-desarrollo y R&D por contrato',
    descripcion: 'Diseñamos y validamos sistemas de encapsulación a medida para tus activos. Desde la formulación hasta el escalado piloto, con propiedad intelectual compartida o transferida. Modelo de hitos y regalías o fee-for-service.',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    ),
  },
  {
    id: 'licensing',
    num: '03',
    titulo: 'Licensing',
    subtitulo: 'Transferencia de IP y plataforma',
    descripcion: 'Licenciamos nuestra tecnología de encapsulación (patentes de proceso, know-how, plataforma de microencapsulación) para que la operes en tus instalaciones. Incluye transferencia tecnológica, calificación de equipos y soporte continuo.',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z" />
        <path d="M4.5 20.5c3.5-5.5 7.5-8.5 11.5-10.5" />
      </svg>
    ),
  },
];

// 6 VERTICALES B2B
const VERTICALES = [
  { id: 'alimentos', label: 'Alimentos Funcionales', icon: '🥛' },
  { id: 'nutra', label: 'Nutracéuticos y Suplementos', icon: '💊' },
  { id: 'cosmetica', label: 'Cuidado Personal y Cosmética', icon: '🧴' },
  { id: 'animal', label: 'Salud Animal', icon: '🐄' },
  { id: 'agro', label: 'Agroindustria', icon: '🌱' },
  { id: 'pharma', label: 'Pharma / OTC', icon: '🏥' },
];

// FORMATOS DE ENTREGA (existente, mantenido)
const FORMATOS = [
  {
    id: 'saco',
    nombre: 'Saco B2B',
    resumen: 'Polvo funcional de alta fluidez para mezclas secas.',
    icono: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 4h8l-1.2 3.2a3 3 0 0 0-.3 1.3V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V8.5a3 3 0 0 0-.3-1.3L8 4Z" />
        <path d="M8.5 11h7" />
      </svg>
    ),
    specs: [
      { label: 'Almacenamiento', valor: 'Lugar fresco y seco, 15–25 °C, envase cerrado' },
      { label: 'Vida útil', valor: '24 meses' },
      { label: 'Dosificación', valor: 'Líneas de mezclado seco, premix y blend' },
      { label: 'Presentación', valor: 'Saco multilámina 25 kg' },
    ],
  },
  {
    id: 'cunete',
    nombre: 'Cuñete / Caneca',
    resumen: 'Emulsiones y concentrados líquidos listos para dosificar.',
    icono: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="2.6" />
        <path d="M5 6v11.5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
        <path d="M5 10.5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
      </svg>
    ),
    specs: [
      { label: 'Almacenamiento', valor: '4–25 °C, protegido de la congelación' },
      { label: 'Vida útil', valor: '9–12 meses' },
      { label: 'Dosificación', valor: 'Dosis volumétrica en línea húmeda' },
      { label: 'Presentación', valor: 'Cuñete 200 L / bombona' },
    ],
  },
  {
    id: 'lote',
    nombre: 'Lote Industrial / Estiba',
    resumen: 'Suministro a granel de alta capacidad para plantas de producción.',
    icono: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
      </svg>
    ),
    specs: [
      { label: 'Almacenamiento', valor: 'Según ficha técnica del activo' },
      { label: 'Vida útil', valor: '18–24 meses' },
      { label: 'Dosificación', valor: 'Sistemas a granel: tolva, IBC o transferencia' },
      { label: 'Presentación', valor: 'IBC 1000 L · granel a granel' },
    ],
  },
];

const TRL_COLORS = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export default function BioSoluciones() {
  const [activeFormat, setActiveFormat] = useState(FORMATOS[0].id);
  const [activeSeries, setActiveSeries] = useState(SERIES[0].id);
  const [activeModel, setActiveModel] = useState(BUSINESS_MODELS[0].id);
  const format = FORMATOS.find(f => f.id === activeFormat) || FORMATOS[0];
  const series = SERIES.find(s => s.id === activeSeries) || SERIES[0];
  const model = BUSINESS_MODELS.find(m => m.id === activeModel) || BUSINESS_MODELS[0];

  return (
    <div id="bio-tab-soluciones" role="tabpanel" aria-label="Portafolio WiBio y soluciones industriales">
      {/* ── Encabezado ── */}
      <div className="bio-subhead max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Portafolio <span className="txt-grad font-semibold">WiBio</span> & Soluciones Industriales
        </h3>
        <p className="text-[#b0b0b0] text-sm md:text-base leading-relaxed">
          Ingredientes microencapsulados, desarrollo a medida y licensing — listos para tu mercado.
        </p>
      </div>

      {/* ── 1. MICROCÁPSULA 3D (Demo GutAcid Balance®) ── */}
      <div className="mb-10 md:mb-12">
        <div className="bio-glass bio-glass--cyan relative h-[320px] sm:h-[380px] overflow-hidden">
          <MicrocapsuleCore />
          <div className="absolute inset-0 flex items-end p-6 pointer-events-none">
            <div className="max-w-xs text-right">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00ffff]/70 block mb-1">
                Demo interactiva: GutAcid Balance®
              </span>
              <p className="text-xs text-[#b0b0b0]">
                Núcleo emisivo (activo) + cáscara translúcida (protección gástrica) + partículas en órbita (bioactivos).
                Arrastra para rotar; haz hover para intensificar el núcleo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SERIES DE PRODUCTO ── */}
      <section className="mb-12 md:mb-16" aria-labelledby="series-title">
        <h4 id="series-title" className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="txt-grad">Series de Producto</span>
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#00ffff]/70">5 series</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" role="tablist" aria-label="Series de producto WiBio">
          {SERIES.map((s) => {
            const isActive = s.id === activeSeries;
            const trlClass = TRL_COLORS[s.trlColor] || TRL_COLORS.emerald;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSeries(s.id)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 h-full flex flex-col ${
                  isActive
                    ? 'border-[#00ffff]/60 bg-[#00ffff]/5 shadow-[0_0_20px_rgba(0,255,255,0.15)]'
                    : 'border-[#00ffff]/20 bg-[#041915]/60 backdrop-blur-md hover:border-[#00ffff]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h5 className={`font-semibold text-sm sm:text-base ${isActive ? 'text-[#00ffff]' : 'text-[#f0f0f0]'}`}>
                    {s.nombre}
                  </h5>
                  <span className={`text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border ${trlClass} flex-shrink-0`}>
                    {s.trl}
                  </span>
                </div>
                <p className="text-xs text-[#b0b0b0] leading-relaxed flex-1">{s.descriptor}</p>
              </button>
            );
          })}
        </div>

        {/* Detalle de la serie activa */}
        <div className="bio-glass p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={series.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                <h5 className="text-xl md:text-2xl font-semibold text-[#f0f0f0]">{series.nombre}</h5>
                <span className={`text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border ${TRL_COLORS[series.trlColor]}`}>
                  {series.trl}
                </span>
              </div>
              <p className="text-[#b0b0b0] text-sm md:text-base leading-relaxed mb-6">{series.descriptor}</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {series.detalle.map((d, idx) => (
                  <div key={idx} className="py-3 border-t border-[#00ffff]/10">
                    <dt className="text-xs uppercase tracking-[0.15em] text-[#00ffff]/80 mb-1.5">
                      {d.label}
                    </dt>
                    <dd className="text-sm text-[#d1d8d6] leading-relaxed">{d.valor}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 3. MODELOS DE NEGOCIO ── */}
      <section className="mb-12 md:mb-16" aria-labelledby="models-title">
        <h4 id="models-title" className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="txt-grad">Modelos de Negocio</span>
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#00ffff]/70">3 streams</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" role="tablist" aria-label="Modelos de negocio">
          {BUSINESS_MODELS.map((m) => {
            const isActive = m.id === activeModel;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveModel(m.id)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 h-full flex flex-col ${
                  isActive
                    ? 'border-[#00ffff]/60 bg-[#00ffff]/5 shadow-[0_0_20px_rgba(0,255,255,0.15)]'
                    : 'border-[#00ffff]/20 bg-[#041915]/60 backdrop-blur-md hover:border-[#00ffff]/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#00ffff]/15' : 'bg-[#03100e] border border-[#00ffff]/20'} text-[#00ffff]`}>
                    {m.icono}
                  </span>
                  <div>
                    <span className={`font-mono text-xs tabular-nums ${isActive ? 'text-[#00ffff]' : 'text-[#b0b0b0]'}`}>{m.num}</span>
                    <h5 className={`block font-semibold ${isActive ? 'text-[#00ffff]' : 'text-[#f0f0f0]'}`}>{m.titulo}</h5>
                    <span className="text-xs text-[#b0b0b0]">{m.subtitulo}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bio-glass p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-xl bg-[#00ffff]/15 flex items-center justify-center text-[#00ffff]">{model.icono}</span>
                <div>
                  <span className="font-mono text-xs tabular-nums text-[#00ffff]/70">{model.num}</span>
                  <h5 className="block text-xl font-semibold text-[#f0f0f0] mt-1">{model.titulo}</h5>
                  <span className="text-sm text-teal-400">{model.subtitulo}</span>
                </div>
              </div>
              <p className="text-[#b0b0b0] text-base leading-relaxed">{model.descripcion}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. VERTICALES B2B ── */}
      <section className="mb-12 md:mb-16" aria-labelledby="verticals-title">
        <h4 id="verticals-title" className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="txt-grad">Verticales Objetivo</span>
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#00ffff]/70">6 sectores</span>
        </h4>

        <div className="flex flex-wrap gap-3" role="list" aria-label="Verticales B2B">
          {VERTICALES.map((v) => (
            <span key={v.id} role="listitem" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ffff]/20 bg-[#041915]/60 backdrop-blur-md text-sm text-[#d1d8d6] hover:border-[#00ffff]/40 hover:bg-[#00ffff]/5 transition-colors">
              <span aria-hidden="true">{v.icon}</span>
              {v.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── 5. FORMATOS DE ENTREGA (existente) ── */}
      <section aria-labelledby="formatos-title">
        <h4 id="formatos-title" className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="txt-grad">Formatos de Entrega</span>
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#00ffff]/70">3 presentaciones</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" role="tablist" aria-label="Formatos de entrega">
          {FORMATOS.map((f) => {
            const isActive = f.id === activeFormat;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormat(f.id)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 h-full flex flex-col ${
                  isActive
                    ? 'border-[#00ffff]/60 bg-[#00ffff]/5 shadow-[0_0_20px_rgba(0,255,255,0.15)]'
                    : 'border-[#00ffff]/20 bg-[#041915]/60 backdrop-blur-md hover:border-[#00ffff]/40'
                }`}
              >
                <span className={`block mb-3 transition-colors ${isActive ? 'text-[#00ffff]' : 'text-[#b0b0b0]'}`}>
                  {f.icono}
                </span>
                <span className="block text-[#f0f0f0] font-semibold text-sm mb-1">{f.nombre}</span>
                <span className="block text-[#b0b0b0] text-xs leading-relaxed flex-1">{f.resumen}</span>
              </button>
            );
          })}
        </div>

        <div className="bio-glass p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={format.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                <h5 className="text-xl font-semibold text-[#f0f0f0]">{format.nombre}</h5>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00ffff]/70">especificaciones</span>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                {format.specs.map((s) => (
                  <div key={s.label} className="py-4 border-t border-[#00ffff]/10">
                    <dt className="text-xs uppercase tracking-[0.15em] text-[#00ffff]/80 mb-1.5">{s.label}</dt>
                    <dd className="text-sm text-[#d1d8d6] leading-relaxed">{s.valor}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}