'use client';

import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════
   SECTION 1 — MANIFESTO
   "No vendemos ingredientes. Diseñamos resultados."
   ═══════════════════════════════════════════ */

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

/* Kinetic title — word by word */
const words = ['NO', 'VENDEMOS', 'INGREDIENTES.', 'DISEÑAMOS', 'RESULTADOS.'];

export default function SolutionsManifesto({ onCTAClick }) {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-32 pb-24">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-teal-500/[0.06] rounded-full blur-[220px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-purple-500/[0.04] rounded-full blur-[150px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,184,166,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.4) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`mp-${i}`}
          className="absolute w-1 h-1 bg-teal-400 rounded-full"
          style={{
            top: `${12 + Math.random() * 76}%`,
            left: `${8 + Math.random() * 84}%`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Tag */}
        <motion.div {...stagger(0)}>
          <span className="inline-block px-5 py-1.5 mb-10 text-[10px] font-bold tracking-[0.35em] uppercase text-teal-400 border border-teal-500/25 rounded-full bg-teal-500/5">
            Ecosistema de Soluciones
          </span>
        </motion.div>

        {/* Kinetic H1 */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-10">
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 60, rotateX: 40 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.8,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none ${
                word === 'DISEÑAMOS'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400'
                  : word === 'RESULTADOS.'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'
                  : 'text-white'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          {...stagger(0.7)}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Intervenimos la materia a escala nanométrica para resolver los problemas
          macroscópicos de cuatro industrias globales.
        </motion.p>

        {/* CTA */}
        <motion.div {...stagger(0.9)}>
          <button
            onClick={onCTAClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-950 border border-teal-500/30 hover:border-teal-500 font-bold text-sm tracking-wide transition-all duration-300"
          >
            <span>Selecciona tu ecosistema</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </button>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          {...stagger(1.1)}
          className="mt-16 mx-auto w-px h-20 bg-gradient-to-b from-teal-500/50 to-transparent"
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
