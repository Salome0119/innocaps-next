'use client';

import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Sparkles, ArrowUpRight } from 'lucide-react';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════════════════════════════════════
   ENFOQUE "CERO ADITIVOS" — Unidad 02
   Dos casos de proceso ("Micelio como Cápsula Natural" y
   "Auto-Ensamblaje Molecular") homologados al sistema glassmorphism
   nanotecnológico: tarjetas flotantes translúcidas, íconos
   resplandecientes en verde lima y cian, badges técnicos y tipografía
   limpia. Se apoya en el canvas de partículas de NanoBackground.
   ═══════════════════════════════════════════════════════════════════ */

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const stagger = (d = 0) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: d },
});

const CASES = [
  {
    id: 'micelio',
    icon: Leaf,
    tag: 'Caso Hongos Macromicetos',
    title: 'Micelio como Cápsula Natural',
    accent: 'lime',
    metric: 'Matriz encapsulante · EPS',
    description: (
      <>
        Utilizamos el propio <GlossaryTooltip term="Micelio">micelio</GlossaryTooltip> y los{' '}
        <GlossaryTooltip term="Exopolisacáridos">exopolisacáridos (EPS)</GlossaryTooltip> generados
        durante la fermentación como la matriz encapsulante natural. No añadimos polímeros
        externos; la naturaleza construye la cápsula.
      </>
    ),
  },
  {
    id: 'autoensamblaje',
    icon: FlaskConical,
    tag: 'Caso Biosurfactantes',
    title: 'Auto-Ensamblaje Molecular',
    accent: 'cyan',
    metric: 'Auto-ensamblaje · pH + T',
    description: (
      <>
        Promovemos el auto-ensamblaje de micelas y vesículas ajustando el pH y la temperatura del{' '}
        <GlossaryTooltip term="Caldo fermentado">caldo fermentado</GlossaryTooltip> antes del
        secado. Sin aditivos, sin procesos adicionales.
      </>
    ),
  },
];

const Icono = ({ Caso, accent }) => {
  const color = accent === 'lime' ? '#9bdc3c' : '#00f5d4';
  return (
    <span
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
      style={{
        color,
        background:
          accent === 'lime'
            ? 'rgba(155, 220, 60, 0.08)'
            : 'rgba(0, 245, 212, 0.08)',
        border: `1px solid ${accent === 'lime' ? 'rgba(155, 220, 60, 0.32)' : 'rgba(0, 245, 212, 0.32)'}`,
        boxShadow: `0 0 24px -6px ${accent === 'lime' ? 'rgba(155, 220, 60, 0.45)' : 'rgba(0, 245, 212, 0.45)'}`,
      }}
    >
      <Caso size={22} strokeWidth={1.6} aria-hidden="true" />
    </span>
  );
};

export default function BioCeroAditivos() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="El enfoque cero aditivos"
    >
      {/* Halos ambientales (el fondo real es el canvas de partículas) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 18% 30%, rgba(155,220,60,0.07), transparent 68%), radial-gradient(ellipse 55% 45% at 82% 70%, rgba(34,211,238,0.07), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl" style={{ zIndex: 10 }}>
        {/* ── Encabezado del módulo ── */}
        <motion.div {...fadeUp} className="bio-glass mx-auto mb-12 max-w-3xl p-7 text-center md:p-9">
          <span className="bio-tech-badge">
            <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
            Zero Additives Strategy
          </span>
          <h2 className="mt-5 text-3xl font-light tracking-wide text-white md:text-5xl">
            El Enfoque <span className="bio-accent-lime font-semibold">&ldquo;Cero Aditivos&rdquo;</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            La plataforma encapsulante nace del propio proceso fermentativo: la biología aporta la
            estructura y nosotros ajustamos las variables de proceso para fijar su comportamiento.
          </p>
        </motion.div>

        {/* ── Tarjetas de caso ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {CASES.map((caso, index) => (
            <motion.article
              key={caso.id}
              {...stagger(index * 0.12)}
              className={`bio-glass group relative overflow-hidden p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-8 ${
                caso.accent === 'lime' ? 'bio-glass--lime' : 'bio-glass--cyan'
              }`}
            >
              {/* Halo del ícono */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    caso.accent === 'lime'
                      ? 'radial-gradient(circle, rgba(155,220,60,0.22), transparent 70%)'
                      : 'radial-gradient(circle, rgba(34,211,238,0.22), transparent 70%)',
                }}
              />

              <div className="relative flex items-start gap-4">
                <Icono Caso={caso.icon} accent={caso.accent} />

                <div className="min-w-0 flex-1">
                  <span
                    className={`bio-tech-badge ${
                      caso.accent === 'lime' ? 'bio-tech-badge--lime' : 'bio-tech-badge--cyan'
                    }`}
                  >
                    {caso.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                    {caso.title}
                  </h3>
                </div>
              </div>

              <div className="relative my-5 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

              <p className="relative text-sm leading-relaxed text-slate-300">{caso.description}</p>

              <div className="relative mt-6 flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {caso.metric}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                    caso.accent === 'lime' ? 'bio-accent-lime' : 'bio-accent-cyan'
                  }`}
                >
                  Detalle
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
