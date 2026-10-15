'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════
   KINETIC TEXT ANIMATION
   ═══════════════════════════════════ */
const titleWords = ['TECNOLOGÍA', 'MICELAR', 'DE', 'ALTO', 'IMPACTO'];

function KineticTitle() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-12">
      {titleWords.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 45 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.8,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none ${
            word === 'MICELAR'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400'
              : word === 'IMPACTO'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400'
              : 'text-white'
          }`}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   IMPACT ITEMS
   ═══════════════════════════════════ */
const impacts = [
  {
    number: '01',
    title: 'Reducción de Dosis Terapéuticas',
    description: 'Menos activo, mismo efecto. La encapsulación micelar permite alcanzar concentraciones terapéuticas con una fracción de la dosis convencional.',
    gradient: 'from-teal-500 to-cyan-500',
    color: '#14b8a6',
    accent: '#5eead4',
  },
  {
    number: '02',
    title: 'Menor Impacto Ambiental',
    description: 'Menos residuos químicos excretados al medio ambiente. La mayor absorción significa menor carga contaminante en aguas residuales.',
    gradient: 'from-emerald-500 to-teal-500',
    color: '#10b981',
    accent: '#6ee7b7',
  },
  {
    number: '03',
    title: 'Nanoemulsiones Estables',
    description: (
      <>
        Sistemas translúcidos (20-200 nm) termodinámicamente estables que no se separan con el
        tiempo, a diferencia de las{' '}
        <GlossaryTooltip term="Nanoemulsiones">emulsiones lechosas tradicionales</GlossaryTooltip>.
      </>
    ),
    gradient: 'from-blue-500 to-violet-500',
    color: '#3b82f6',
    accent: '#93c5fd',
  },
];

/* ═══════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════ */
function AnimatedStat({ value, label, suffix = '', color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.span
        className="text-4xl md:text-5xl font-bold font-mono"
        style={{ color }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {value}
        {suffix}
      </motion.span>
      <p className="text-xs text-slate-500 mt-2 font-mono tracking-wider uppercase">{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════ */
export default function DisruptiveInnovation() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-950 py-32 lg:py-44 overflow-hidden"
    >
      {/* ── Background ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-teal-500/[0.04] rounded-full blur-[250px]" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[200px]" />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Tag ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400 border border-amber-500/20 rounded-full bg-amber-500/5">
            Bloque 4 — Cierre de Sección
          </span>
        </motion.div>

        {/* ── Kinetic Title ── */}
        <KineticTitle />

        {/* ── Intro copy ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            Hemos introducido una tecnología que optimiza la{' '}
            <GlossaryTooltip term="Biodisponibilidad">biodisponibilidad</GlossaryTooltip> de
            moléculas críticas, permitiendo avances sin precedentes en eficacia y sostenibilidad.
          </p>
        </motion.div>

        {/* ── Impact Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {impacts.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: 'easeOut' }}
              className="group"
            >
              <div className="relative h-full rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-8 lg:p-10 overflow-hidden transition-all duration-400 hover:bg-slate-900/60 hover:border-slate-700/50">
                {/* Top gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${item.gradient} opacity-40`}
                />

                {/* Corner glow */}
                <div
                  className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-[0.04] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity duration-500`}
                />

                {/* Number */}
                <span
                  className="text-6xl lg:text-7xl font-bold font-mono opacity-[0.07] absolute top-4 right-6 select-none"
                  style={{ color: item.color }}
                >
                  {item.number}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className="w-8 h-1 rounded-full mb-6"
                    style={{ background: `linear-gradient(to right, ${item.color}, ${item.accent})` }}
                  />
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>

                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-2xl border border-slate-800/40 bg-slate-900/20 p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <AnimatedStat value="20-200" suffix=" nm" label="Tamano de partícula" color="#14b8a6" />
            <AnimatedStat value="10x" label="Biodisponibilidad" color="#06b6d4" />
            <AnimatedStat value="<0.1%" label="Residuos excretados" color="#10b981" />
            <AnimatedStat value="100%" label="Estabilidad termodinámica" color="#8b5cf6" />
          </div>
        </motion.div>

        {/* ── Closing statement ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-block">
            <motion.p
              className="text-2xl md:text-3xl font-bold text-white/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Lo invisible define lo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                extraordinario
              </span>
              .
            </motion.p>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            className="mt-8 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
