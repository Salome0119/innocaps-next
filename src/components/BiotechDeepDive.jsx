'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, FlaskConical } from 'lucide-react';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════ */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const stagger = (d = 0) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: d },
});

/* ═══════════════════════════════════
   CASE DATA
   ═══════════════════════════════════ */
const cases = [
  {
    icon: Leaf,
    tag: 'Caso Hongos Macromicetos',
    title: 'Micelio como Cápsula Natural',
    gradient: 'from-emerald-500 to-teal-500',
    color: '#10b981',
    description: (
      <>
        Utilizamos el propio <GlossaryTooltip term="Micelio">micelio</GlossaryTooltip> y los{' '}
        <GlossaryTooltip term="Exopolisacáridos">exopolisacáridos (EPS)</GlossaryTooltip> generados
        durante la fermentación como la matriz encapsulante natural. No añadimos polímeros externos;
        la naturaleza construye la cápsula.
      </>
    ),
  },
  {
    icon: FlaskConical,
    tag: 'Caso Biosurfactantes',
    title: 'Auto-Ensamblaje Molecular',
    gradient: 'from-cyan-500 to-blue-500',
    color: '#06b6d4',
    description: (
      <>
        Promovemos el auto-ensamblaje de micelas y vesículas ajustando el pH y la temperatura del{' '}
        <GlossaryTooltip term="Caldo fermentado">caldo fermentado</GlossaryTooltip> antes del
        secado. Sin aditivos, sin procesos adicionales.
      </>
    ),
  },
];

/* ═══════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════ */
export default function BiotechDeepDive() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Scroll-linked background transition: black → organic green-tint */
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.06, 0.06, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1.2]);

  return (
    <section ref={sectionRef} className="relative bg-slate-950 py-28 lg:py-36 overflow-hidden">
      {/* ── Background transitions (black → organic fluid) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-teal-950/40 to-slate-950/0" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/[0.04] rounded-full blur-[200px] pointer-events-none"
        style={{ scale: glowScale }}
      />

      {/* Organic dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Tag + Title ── */}
        <motion.div {...fadeUp} className="mb-6">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400 border border-emerald-500/20 rounded-full bg-emerald-500/5 mb-8">
            Bloque 2 — Deep Dive
          </span>
        </motion.div>

        <motion.h2
          {...stagger(0.1)}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl"
        >
          Biotecnología de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Precisión
          </span>
        </motion.h2>

        <motion.div {...stagger(0.15)} className="mb-16 max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Fermentación No Destructiva
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            En la industria tradicional, el medio de cultivo es un desecho. En InnoCaps, es la base
            de la formulación.
          </p>
        </motion.div>

        {/* ── Blockquote ── */}
        <motion.div {...stagger(0.25)} className="mb-20">
          <blockquote className="relative max-w-4xl rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-8 lg:p-10">
            {/* Quote mark */}
            <div className="absolute -top-4 left-8 text-6xl font-serif text-emerald-500/20 leading-none select-none">
              &ldquo;
            </div>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed italic pl-4 border-l-2 border-emerald-500/30">
              Tratamos el{' '}
              <GlossaryTooltip term="Caldo fermentado">
                caldo fermentado (medio + biomasa + metabolitos)
              </GlossaryTooltip>{' '}
              no como un producto a purificar, sino como una formulación lista para encapsular.
            </p>
          </blockquote>
        </motion.div>

        {/* ── Zero Additives Strategy ── */}
        <motion.div {...stagger(0.3)} className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              El Enfoque{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                &ldquo;Cero Aditivos&rdquo;
              </span>
            </h3>
          </div>
          <p className="text-slate-500 text-sm font-mono tracking-wider uppercase mb-8">
            Zero Additives Strategy
          </p>
        </motion.div>

        {/* ── Case Study Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cases.map((c, index) => (
            <motion.div key={c.tag} {...stagger(0.35 + index * 0.15)} className="group">
              <div className="relative h-full rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-8 lg:p-10 overflow-hidden transition-all duration-400 hover:border-slate-700/60 hover:bg-slate-900/60">
                {/* Corner gradient */}
                <div
                  className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${c.gradient} opacity-[0.04] rounded-bl-[100px]`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  style={{ boxShadow: `0 8px 30px ${c.color}20` }}
                >
                  <c.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                {/* Tag */}
                <span
                  className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                  style={{ color: c.color }}
                >
                  {c.tag}
                </span>

                {/* Title */}
                <h4 className="text-xl lg:text-2xl font-bold text-white mb-4">{c.title}</h4>

                {/* Description with glossary tooltips */}
                <p className="text-slate-400 leading-relaxed">{c.description}</p>

                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${c.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom separator */}
      <div className="container mx-auto px-6 mt-24">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-800/30 to-transparent" />
      </div>
    </section>
  );
}
