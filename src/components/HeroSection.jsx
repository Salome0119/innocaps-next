'use client';

import { AnimatedBackground } from './AnimatedBackground';
import { motion } from 'framer-motion';
import ModelViewer from './ModelViewer';
import { useIsMobile } from '../hooks/useIsMobile';

/* ═══════════════════════════════════════════════════════════════════
   TAGLINE — Staggered word reveal ("Typewriter feel" premium)
   ═══════════════════════════════════════════════════════════════════ */
const taglineWords = 'Sostenibilidad | Tecnologia | Innovación'.split(' - ');

function StaggeredTagline({ baseDelay = 0.7, className = '' }) {
  return (
    <span className={`inline-flex flex-wrap gap-x-2 ${className}`} aria-label="Redefiniendo la materia prima">
      {taglineWords.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: baseDelay + i * 0.1, duration: 0.45, ease: 'easeOut' }}
          className="text-teal-400"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION — Mobile-first, jerarquía: Título → Esfera → CTA
   ═══════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden bg-slate-950 transition-colors duration-300">

      {/* ── Degradado inferior (fade a siguiente sección) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />

      {/* ── FONDOS ── */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.5 }}
      >
        <img
          src="/background.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <img
          src="/Agrupar.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-950/30" />
      </motion.div>

      {/* Blobs animados (solo desktop) */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <AnimatedBackground />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
           CONTENIDO — MOBILE FIRST (flex-col)
           Orden DOM: 1) Título  2) Esfera  3) CTA
           ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 container mx-auto h-full flex items-center px-5 md:px-6">

        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden flex flex-col items-center w-full gap-6 pt-20 pb-10">

          {/* 1 ▸ MARCA / TÍTULO (lo primero que lee el ojo) */}
          <div className="text-center space-y-3 w-full order-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            >
              <img src="/logotipo.svg" alt="InnocapsLab" className="w-56 mx-auto" />
            </motion.div>

            <div className="flex justify-center">
              <StaggeredTagline
                baseDelay={0.7}
                className="text-base font-light tracking-wider justify-center"
              />
            </div>
          </div>

          {/* 2 ▸ MODELO 3D (Canvas WebGL) */}
          <motion.div
            className="relative w-[80vw] max-w-[320px] aspect-square order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            {/* Glow halo */}
            <div className="absolute inset-[-20%] bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <ModelViewer />
          </motion.div>

          {/* 3 ▸ DESCRIPCIÓN + CTA */}
          <div className="text-center space-y-5 w-full order-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-sm text-slate-400 leading-[1.7] px-2 max-w-xs mx-auto"
            >
              Ingredientes funcionales nanoencapsulados que transforman tus materias primas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <button className="w-full max-w-xs py-4 bg-teal-500 active:bg-teal-400 text-slate-900 font-bold rounded-2xl text-base transition-colors shadow-lg shadow-teal-500/25">
                Descubre más
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (2 columnas) ── */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* COLUMNA IZQUIERDA — Texto */}
          <div className="text-left space-y-7 pl-8 lg:pl-16">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              <img src="/logotipo.svg" alt="InnocapsLab" className="w-125 mb-4 mt-12" />
            </motion.div>

            <StaggeredTagline
              baseDelay={0.7}
              className="text-xl lg:text-2xl font-light tracking-wider"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="text-lg text-slate-300 w-full lg:w-125 leading-relaxed"
            >
              Desarrollamos ingredientes funcionales y aditivos biotecnológicos
              nanoencapsulados que transforman tus materias primas. Como tu
              partner estratégico, ofrecemos soluciones de innovación accesibles
              y escalables para potenciar la capacidad científica y
              competitividad de tu empresa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-full transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105">
                Descubre más
              </button>
            </motion.div>
          </div>

          {/* COLUMNA DERECHA — Esfera */}
          <div className="flex justify-center lg:justify-end items-center relative h-full min-h-[450px] lg:min-h-[600px]">
            {/* Glow halo */}
            <div className="absolute w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-3xl -z-10" />

            <motion.div
              className="relative w-full max-w-[280px] md:max-w-lg lg:max-w-2xl xl:max-w-3xl aspect-square z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <ModelViewer />
            </motion.div>

            {/* Indicador de interacción */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500 text-xs select-none pointer-events-none z-20"
            >
              <motion.span
                animate={{ x: [0, 4, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✦
              </motion.span>
              <span>Arrastra para rotar</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}