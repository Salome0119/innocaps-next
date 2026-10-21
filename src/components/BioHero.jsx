'use client';

import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';

/* ═══════════════════════════════════════════════════════════════════
   HERO — InnoCaps Bio & WiBio (Unidad 02)
   Estructura referencial: lockup "InnoCaps" bicolor + tagline en
   mayúsculas, lead con highlight, badges outline y pilares en círculos.
   Estilos en globals.css (.bio-*), paleta #03100e / #2dd4bf / #f0f0f0
   ═══════════════════════════════════════════════════════════════════ */

const BADGES = [
  {
    id: 'funcionales',
    texto: 'Ingredientes funcionales',
    icono: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
  },
  {
    id: 'b2b',
    texto: 'B2B · Suministro',
    icono: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z" />
        <path d="M4.5 20.5c3.5-5.5 7.5-8.5 11.5-10.5" />
      </svg>
    ),
  },
  {
    id: 'sectores',
    texto: 'Nutrición · Salud · Cosmética',
    icono: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
      </svg>
    ),
  },
];

const PILARES = [
  {
    id: 'escalamiento',
    label: 'Escalamiento',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17l6-6 4 4 7-7" />
        <path d="M14 8h6v6" />
      </svg>
    ),
  },
  {
    id: 'estandarizacion',
    label: 'Estandarización',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    ),
  },
  {
    id: 'suministro',
    label: 'Suministro B2B',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-3" />
        <circle cx="7" cy="18.5" r="1.8" />
        <circle cx="17" cy="18.5" r="1.8" />
      </svg>
    ),
  },
];

export default function BioHero() {
  return (
    <section className="bio-hero" aria-label="InnoCaps Bio y WiBio">
      {/* Anillos concéntricos decorativos tras el visor */}
      <div className="bio-hero-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="bio-hero-inner">
        {/* ── COLUMNA IZQUIERDA — Lockup + texto ── */}
        <motion.div
          className="bio-hero-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="bio-tech-badge">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00f5d4] animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00f5d4]" />
            </span>
            Unidad 02 · Escala Industrial
          </span>

          <div className="bio-lockup">
            <img src="/logo.svg" alt="" className="bio-mark" />
            <span className="bio-lockup-divider" aria-hidden="true" />
            <div>
              <h1 className="bio-wordmark" aria-label="InnoCaps Bio y WiBio">
                <span className="wm-light">Inno</span>
                <span className="wm-accent">Caps</span>
              </h1>
              <p className="bio-tagline">
                <span className="tagline-light">Bio &amp; WiBio · Ingredientes funcionales</span>
                <span className="tagline-accent">Escalamiento y suministro B2B</span>
              </p>
            </div>
          </div>

          <p className="bio-lead">
            Llevamos la ciencia validada en el laboratorio a{' '}
            <span className="bio-lead-accent">
              ingredientes funcionales estandarizados para la industria global
            </span>
            , con trazabilidad por lote y soporte técnico en planta.
          </p>

          <ul className="bio-badges">
            {BADGES.map((badge) => (
              <li key={badge.id} className="bio-badge">
                {badge.icono}
                {badge.texto}
              </li>
            ))}
          </ul>

          <div className="bio-pillars" aria-label="Pilares: Escalamiento, Estandarización, Suministro B2B">
            {PILARES.map((pilar, i) => (
              <div key={pilar.id} className="contents">
                {i > 0 && <span className="bio-pillar-divider" aria-hidden="true" />}
                <div className="bio-pillar">
                  <span className="bio-pillar-circle">{pilar.icono}</span>
                  <span className="bio-pillar-label">{pilar.label}</span>
                </div>
              </div>
            ))}
          </div>

          <a href="/contacto?type=bio" className="bio-cta">
            Solicitar suministro <span aria-hidden="true">→</span>
          </a>
        </motion.div>

        {/* ── COLUMNA DERECHA — Visor 3D ── */}
        <motion.div
          className="bio-hero-model"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          {/* Órbitas y destellos de la nanoesfera (paleta cian/turquesa) */}
          <div className="bio-hero-orbits" aria-hidden="true">
            <span className="bio-orbit bio-orbit--1" />
            <span className="bio-orbit bio-orbit--2" />
            <span className="bio-orbit bio-orbit--3" />
            <span className="bio-spark" style={{ top: '28%', left: '68%' }} />
            <span className="bio-spark bio-spark--2" style={{ top: '62%', left: '30%' }} />
            <span className="bio-spark bio-spark--3" style={{ top: '46%', left: '78%' }} />
          </div>

          <ModelViewer />

          {/* Etiqueta técnica del modelo */}
          <span className="bio-tech-badge bio-tech-badge--cyan pointer-events-none absolute bottom-4 right-4 z-10">
            Micela · Modelo 3D
          </span>
        </motion.div>
      </div>
    </section>
  );
}
