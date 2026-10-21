'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 2 — MODELO LAB + BIO (Fusión interactiva)
   Nodo central pulsante + hover por lado con efecto de luz
   ═══════════════════════════════════════════════════════════════════ */

const LAB_SIDE = {
  id: 'lab',
  label: 'InnoCaps Lab',
  subtitle: 'Investigación',
  icon: '🔬',
  color: 'cyan',
  descripcion: 'Es el corazón científico y creativo. Aquí investigamos, diseñamos y validamos sistemas de encapsulación. Generamos evidencia experimental, optimizamos formulaciones y construimos el soporte técnico que respalda cada desarrollo.',
  capacidades: [
    'Formulación y caracterización de nano/microcápsulas',
    'Escalado piloto (10–500 L) en biorreactores',
    'Licenciamiento y transferencia tecnológica',
  ],
};

const BIO_SIDE = {
  id: 'bio',
  label: 'InnoCaps Bio',
  subtitle: 'Industrial',
  icon: '🏭',
  color: 'emerald',
  descripcion: 'Es la conexión con la industria. Transformamos el desarrollo de laboratorio en procesos escalables, robustos y reproducibles. Integramos ingeniería de proceso, control de calidad y acompañamiento en transferencia tecnológica para llevar el producto a nivel industrial.',
  capacidades: [
    'Producción industrial (>5000 L) con trazabilidad por lote',
    'Estandarización y certificación (CoA por lote)',
    'Suministro B2B: saco, cuñete, IBC/granel',
  ],
};

function SidePanel({ side, isActive, onClick }) {
  const glowColor = side.color === 'cyan' ? 'rgba(0, 255, 255,' : 'rgba(16, 185, 129,';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: side.id === 'lab' ? -40 : 40 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex-1 min-w-0 p-6 md:p-8 relative ${isActive ? 'z-20' : 'z-10'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
    >
      <div className={`relative rounded-3xl border p-6 md:p-8 h-full transition-all duration-500 group cursor-pointer ${isActive
          ? `border-${side.color}-400/50 bg-gradient-to-br from-${side.color}-500/10 to-transparent shadow-[0_0_30px_${glowColor}0.3)]`
          : 'border-slate-800/50 bg-slate-900/50 hover:border-cyan-400/30 hover:bg-cyan-500/5'
      }`}>
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
              isActive ? `bg-${side.color}-500/20 border-${side.color}-400/40` : 'bg-slate-800/50 border-slate-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30'
            }`}>
            {side.icon}
          </motion.div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400/70 mb-1">{side.subtitle}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{side.label}</h3>
          </div>
        </div>

        <p className="text-slate-300 text-base leading-relaxed mb-6">{side.descripcion}</p>

        <div className="border-t border-slate-800/50 pt-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400/70 mb-3">Capacidades clave</p>
          <ul className="space-y-2">
            {side.capacidades.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-${side.color}-400`} />
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function CentralNode({ activeSide }) {
  const pulseColor = activeSide === 'lab' ? 'cyan' : activeSide === 'bio' ? 'emerald' : 'cyan';
  const glowRgba = pulseColor === 'cyan' ? '0, 255, 255' : '16, 185, 129';
  
  return (
    <motion.div
      className="relative flex-shrink-0 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center"
      animate={{
        scale: [1, 1.08, 1],
        boxShadow: [
          `0 0 30px rgba(${glowRgba}, 0.4)`,
          `0 0 50px rgba(${glowRgba}, 0.7), 0 0 100px rgba(139, 92, 246, 0.3)`,
          `0 0 30px rgba(${glowRgba}, 0.4)`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* Anillo externo pulsante */}
      <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" aria-hidden="true" />
      
      {/* Núcleo central */}
      <div className={`relative w-full h-full rounded-full bg-gradient-to-r from-cyan-500 to-${pulseColor === 'emerald' ? 'emerald-500' : 'cyan-500'} flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.5)]`}>
        <span className="text-3xl md:text-4xl">⚛</span>
        {/* Halo interno */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-30 blur-xl" aria-hidden="true" />
      </div>
      
      {/* Etiqueta dinámica */}
      <AnimatePresence mode="wait">
        {activeSide && (
          <motion.div
            key={activeSide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider bg-slate-900/90 backdrop-blur-sm border ${
              activeSide === 'lab' ? 'border-cyan-400/50 text-cyan-400' : 'border-emerald-400/50 text-emerald-400'
            }`}>
              {activeSide === 'lab' ? 'Modo Lab' : 'Modo Bio'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LabBioFusion() {
  const [activeSide, setActiveSide] = useState(null); // 'lab' | 'bio' | null

  return (
    <div id="lab-bio-fusion" role="tabpanel" aria-label="Modelo Lab + Bio">
      {/* ── Encabezado ── */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Nuestro Modelo: <span className="txt-grad font-semibold">Lab + Bio</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Dos unidades, una ciencia continua. El laboratorio crea, la industria escala.
        </p>
      </div>

      {/* ── Fusión interactiva ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start">
        {/* ── Lado Lab ── */}
        <SidePanel
          side={LAB_SIDE}
          isActive={activeSide === 'lab'}
          onClick={() => setActiveSide(activeSide === 'lab' ? null : 'lab')}
        />

        {/* ── Nodo central ── */}
        <div className="relative flex items-center justify-center min-h-[280px] lg:min-h-[360px]">
          <CentralNode activeSide={activeSide} />
          
          {/* Instrucción sutil */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500/60 pointer-events-none max-w-xs">
            Haz hover o click en cada lado para activar
          </p>
        </div>

        {/* ── Lado Bio ── */}
        <SidePanel
          side={BIO_SIDE}
          isActive={activeSide === 'bio'}
          onClick={() => setActiveSide(activeSide === 'bio' ? null : 'bio')}
        />
      </div>

      {/* ── Mensaje de integración ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 md:mt-16 text-center"
      >
        <p className="text-cyan-400 font-bold text-lg md:text-xl mb-2">
          Lab crea. Bio escala.
        </p>
        <p className="text-slate-400 text-base md:text-lg">
          Juntos convertimos ciencia en producto.
        </p>
      </motion.div>
    </div>
  );
}