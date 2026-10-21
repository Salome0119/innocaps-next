'use client';

import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Sparkles, ArrowUpRight } from 'lucide-react';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════════════════════════════════════
   ENFOQUE "CERO ADITIVOS" — Unidad 02
   Dos casos de proceso homologados al estilo /lab:
   glassmorphism, gradientes teal/cyan, badges técnicos, tipografía limpia
   ═══════════════════════════════════════════════════════════════════ */

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

const Icono = ({ Caso, accent }) => {
  const isLime = accent === 'lime';
  const color = isLime ? '#9bdc3c' : '#00f5d4';
  return (
    <span
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
      style={{
        color,
        background: isLime
          ? 'rgba(155, 220, 60, 0.08)'
          : 'rgba(0, 245, 212, 0.08)',
        border: `1px solid ${isLime ? 'rgba(155, 220, 60, 0.32)' : 'rgba(0, 245, 212, 0.32)'}`,
        boxShadow: `0 0 24px -6px ${isLime ? 'rgba(155, 220, 60, 0.45)' : 'rgba(0, 245, 212, 0.45)'}`,
      }}
    >
      <Caso size={22} strokeWidth={1.6} aria-hidden="true" />
    </span>
  );
};

export default function BioCeroAditivos() {
  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 py-16 md:py-24"
      aria-label="El enfoque cero aditivos"
    >
      {/* Halos ambientales (estilo Lab) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 18% 30%, rgba(155,220,60,0.07), transparent 68%), radial-gradient(ellipse 55% 45% at 82% 70%, rgba(34,211,238,0.07), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6" style={{ zIndex: 10 }}>
        {/* ── Encabezado del módulo (estilo Lab) ── */}
        <motion.div
          {...stagger(0)}
          className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 mx-auto mb-12 max-w-3xl p-7 text-center md:p-9 backdrop-blur-xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.25em] uppercase text-teal-400 border border-teal-500/30 rounded-full bg-teal-500/5">
            <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
            Zero Additives Strategy
          </span>
          <h2 className="mt-5 text-3xl font-light tracking-wide text-white md:text-5xl">
            El Enfoque <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 font-semibold">&ldquo;Cero Aditivos&rdquo;</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            La plataforma encapsulante nace del propio proceso fermentativo: la biología aporta la
            estructura y nosotros ajustamos las variables de proceso para fijar su comportamiento.
          </p>
        </motion.div>

        {/* ── Tarjetas de caso (glassmorphism estilo Lab) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {CASES.map((caso, index) => (
            <motion.article
              key={caso.id}
              {...stagger(index * 0.12 + 0.2)}
              className={`relative rounded-3xl bg-slate-900/60 border border-slate-700/50 p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-8 backdrop-blur-xl group ${
                caso.accent === 'lime'
                  ? 'hover:border-lime-500/40 hover:shadow-[0_0_20px_rgba(155,220,60,0.15)]'
                  : 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
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
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase ${
                      caso.accent === 'lime'
                        ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {caso.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                    {caso.title}
                  </h3>
                </div>
              </div>

              <div className="relative my-5 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

              <p className="relative text-sm leading-relaxed text-slate-400">{caso.description}</p>

              <div className="relative mt-6 flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  {caso.metric}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                    caso.accent === 'lime' ? 'text-lime-400' : 'text-cyan-400'
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