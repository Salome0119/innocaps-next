'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   HERO — Inicio (re-estilizado sobre la referencia Bio & WiBio)
   Estructura Bio: lockup logo + divider + wordmark bicolor + tagline,
   lead con highlight, badges outline teal, pilares en círculos y CTA
   sólido. Contenedores translúcidos: la escena NanoBackground se ve
   de fondo sin bloques sólidos. Textos y CTAs del Inicio intactos.
   Estilos en globals.css (.home-hero-*), paleta #03100e / #2dd4bf
   ═══════════════════════════════════════════════════════════════════ */

const taglineWords = 'Sostenibilidad | Tecnología | Innovación'
  .split('|')
  .map((word) => word.trim());

function StaggeredTagline({ baseDelay = 0.7, className = '' }) {
  return (
    <span
      className={`inline-flex flex-wrap items-center gap-x-2 ${className}`}
      aria-label="Sostenibilidad, Tecnología, Innovación"
    >
      {taglineWords.map((word, i) => (
        <Fragment key={word}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: baseDelay + i * 0.15, duration: 0.45, ease: 'easeOut' }}
            className="home-tagline-word"
          >
            {word}
          </motion.span>
          {i < taglineWords.length - 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + i * 0.15 + 0.08, duration: 0.45 }}
              className="home-tagline-sep"
              aria-hidden="true"
            >
              |
            </motion.span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DATOS DEL HERO (contenido original del Inicio — no alterar)
   ═══════════════════════════════════════════════════════════════════ */

const BADGES = [
  {
    id: 'startup',
    texto: 'Startup científica',
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
    texto: 'B2B · Ingredientes',
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
    id: 'bioprospeccion',
    label: 'Bioprospección',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
        <path d="M8.5 12.5c1.5-2.5 3-4 5.5-5.5" />
      </svg>
    ),
  },
  {
    id: 'fermentacion',
    label: 'Fermentación',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3h4" />
        <path d="M11 3v5l-5 9a3 3 0 0 0 2.6 4.5h6.8A3 3 0 0 0 18 17l-5-9V3" />
        <path d="M8 15h8" />
      </svg>
    ),
  },
  {
    id: 'microencapsulacion',
    label: 'Microencapsulación',
    icono: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION — Layout Bio: lockup + lead + badges + pilares + CTA
   ═══════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  return (
    <section className="home-hero" aria-label="Inicio InnoCaps">
      {/* ── Glows radiales teal (esquinas) — translúcidos ── */}
      <div className="home-hero-glow home-hero-glow--tl" aria-hidden="true" />
      <div className="home-hero-glow home-hero-glow--br" aria-hidden="true" />

      {/* ── Anillos concéntricos decorativos tras la escena ── */}
      <div className="home-hero-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="home-hero-inner">
        {/* ── COLUMNA IZQUIERDA — Lockup + texto ── */}
        <motion.div
          className="home-hero-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* 1 ▸ Lockup: logo + divider + wordmark bicolor + tagline */}
          <div className="home-lockup">
            <img src="/logo.svg" alt="" className="home-mark" />
            <span className="home-lockup-divider" aria-hidden="true" />
            <div>
              <h1 className="home-wordmark" aria-label="InnoCaps">
                <span className="wm-light">Inno</span>
                <span className="wm-accent">Caps</span>
              </h1>
              <p className="home-tagline">
                <span className="tagline-light">Plataforma biotecnológica y de encapsulación</span>
              </p>
            </div>
          </div>

          {/* Tagline animada: Sostenibilidad | Tecnología | Innovación */}
          <div className="home-tagline-row">
            <StaggeredTagline baseDelay={0.7} className="home-tagline-stagger" />
          </div>

          {/* 2 ▸ Lead con highlight (texto original intacto) */}
          <p className="home-lead">
            Desarrollamos ingredientes funcionales y aditivos biotecnológicos nanoencapsulados
            que transforman tus materias primas. Como tu partner estratégico, ofrecemos
            soluciones de innovación accesibles y escalables para potenciar la capacidad
            científica y competitividad de tu empresa.
          </p>

          {/* 3 ▸ Badges outline teal (iconos vectoriales) */}
          <ul className="home-badges">
            {BADGES.map((badge, i) => (
              <motion.li
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                className="home-badge"
              >
                {badge.icono}
                {badge.texto}
              </motion.li>
            ))}
          </ul>

          {/* 4 ▸ Rejilla de pilares: círculos con icono + etiqueta */}
          <div
            className="home-pillars"
            aria-label="Pilares: Bioprospección, Fermentación, Microencapsulación"
          >
            {PILARES.map((pilar, i) => (
              <div key={pilar.id} className="contents">
                {i > 0 && <span className="home-pillar-divider" aria-hidden="true" />}
                <div className="home-pillar">
                  <span className="home-pillar-circle">{pilar.icono}</span>
                  <span className="home-pillar-label">{pilar.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 5 ▸ CTA principal (texto original: "Descubre más") */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            <a href="/lab" className="home-cta">
              Descubre más <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ── COLUMNA DERECHA — escena nanotech (NanoBackground)
            ocupa toda la ventana; aquí solo vive el indicador de
            interacción y los anillos decorativos */}
        <motion.div
          className="home-hero-model"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="home-drag-hint"
          >
            <motion.span
              animate={{ x: [0, 4, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
            <span>Arrastra para explorar</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
