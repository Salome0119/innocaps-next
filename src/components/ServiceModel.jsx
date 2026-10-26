'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════
   SECTION 4 — I+D AS A SERVICE
   "Tu Socio de Co-Innovación"
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

/* ── Phase data ── */
const phases = [
  {
    number: '01',
    title: 'Diseño Molecular',
    description:
      'Planificación de un plan de I+D a medida que maximice tus recursos. Analizamos tu problema, mapeamos las rutas de encapsulación y definimos los KPIs de éxito antes de entrar al laboratorio.',
    color: '#14b8a6',
    accent: '#5eead4',
    gradient: 'from-teal-500 to-cyan-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-teal-400">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0-4h18" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Red de Expertos',
    description:
      'Acceso directo a PhDs en Química, Materiales y Biotecnología. Nuestro equipo interdisciplinario incluye especialistas como Elkin Castellón, Nathalia Marín y otros investigadores de primer nivel.',
    color: '#8b5cf6',
    accent: '#c4b5fd',
    gradient: 'from-violet-500 to-purple-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-violet-400">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Validación & Escalado',
    description:
      'Pruebas de concepto rigurosas seguidas de escalado industrial. Desde el benchtop hasta la planta piloto, llevamos tu formulación de laboratorio a producción comercial.',
    color: '#f59e0b',
    accent: '#fcd34d',
    gradient: 'from-amber-500 to-orange-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-amber-400">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

/* ── Connecting line between phases ── */
function PhaseConnector({ color }) {
  return (
    <div className="hidden lg:flex items-center justify-center py-0">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-px h-12 origin-top"
        style={{ backgroundColor: color + '30' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════ */
export default function ServiceModel() {
  /* Desplazamiento suave hacia la sección "Tu Ecosistema" */
  const handleExploreEcosystems = useCallback(() => {
    document.getElementById('ecosistema')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative bg-slate-950 py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[200px]" />
      </div>

      {/* Diagonal line pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="serviceGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0 L0 60" stroke="rgba(139,92,246,0.5)" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#serviceGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Header ── */}
        <motion.div {...fadeUp} className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-violet-400 border border-violet-500/20 rounded-full bg-violet-500/5 mb-8">
            Modelo de Servicio
          </span>
        </motion.div>

        <motion.h2
          {...stagger(0.1)}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center"
        >
          Tu Socio de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
            Co-Innovación
          </span>
        </motion.h2>

        <motion.p
          {...stagger(0.2)}
          className="text-lg text-slate-400 max-w-2xl mx-auto text-center mb-20 leading-relaxed"
        >
          No solo entregamos el polvo. Entregamos la ciencia detrás de él.
        </motion.p>

        {/* ── Phases ── */}
        <div className="max-w-3xl mx-auto">
          {phases.map((phase, i) => (
            <div key={phase.number}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                className="group"
              >
                <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm p-8 lg:p-10 overflow-hidden transition-all duration-400 hover:bg-slate-900/50 hover:border-slate-700/50">
                  {/* Top gradient line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${phase.gradient} opacity-30`}
                  />

                  {/* Large number watermark */}
                  <span
                    className="absolute -top-4 -right-2 text-[120px] font-bold font-mono leading-none opacity-[0.03] select-none pointer-events-none"
                    style={{ color: phase.color }}
                  >
                    {phase.number}
                  </span>

                  <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                    {/* Icon container */}
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300"
                      style={{
                        backgroundColor: phase.color + '10',
                        borderColor: phase.color + '25',
                      }}
                    >
                      {phase.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-mono font-bold"
                          style={{ color: phase.accent }}
                        >
                          FASE {phase.number}
                        </span>
                        <div
                          className="h-px flex-1 max-w-16"
                          style={{ backgroundColor: phase.color + '25' }}
                        />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">{phase.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{phase.description}</p>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${phase.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                  />
                </div>
              </motion.div>

              {/* Connector between phases */}
              {i < phases.length - 1 && <PhaseConnector color={phase.color} />}
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
            >
              <span>Iniciar Co-Innovación</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="text-slate-600 text-sm">o</span>
            <button
              type="button"
              onClick={handleExploreEcosystems}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700/50 bg-slate-900/30 text-slate-400 hover:text-white hover:border-slate-600 font-medium text-sm transition-all duration-300"
            >
              Explorar ecosistemas
            </button>
          </div>
        </motion.div>

        {/* ── Closing statement ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-24 text-center"
        >
          <p className="text-xl md:text-2xl font-bold text-white/60">
            De la molécula al mercado.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">
              Juntos.
            </span>
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
