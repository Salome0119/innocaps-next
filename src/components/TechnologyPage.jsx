'use client';

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

/* Lazy-load heavy 3D/animation sections — only downloaded when scrolled near */
const NanoArsenal = lazy(() => import('./NanoArsenal'));
const BiotechDeepDive = lazy(() => import('./BiotechDeepDive'));
const SprayDryingSection = lazy(() => import('./SprayDryingSection'));
const DisruptiveInnovation = lazy(() => import('./DisruptiveInnovation'));

/* Minimal loading placeholder */
function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <span className="text-[10px] font-mono text-slate-600 tracking-[0.25em] uppercase animate-pulse">cargando sección</span>
    </div>
  );
}

/* ──────────────────────────────
   Animación helpers
   ────────────────────────────── */
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

/* ──────────────────────────────
   HERO
   ────────────────────────────── */
function TechHero() {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 0 : 6;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-32 pb-20">
      {/* Radial gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-teal-500/10 rounded-full blur-[180px]" />
        {!isMobile && (
          <>
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-blue-500/8 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* Grid pattern */}
      {!isMobile && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {/* Floating particles — desktop only */}
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-teal-400 rounded-full"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div {...stagger(0)}>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.25em] uppercase text-teal-400 border border-teal-500/30 rounded-full bg-teal-500/5">
            Plataforma Tecnológica
          </span>
        </motion.div>

        <motion.h1
          {...stagger(0.15)}
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
        >
          Ingeniería de lo{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
            Invisible
          </span>
        </motion.h1>

        <motion.p
          {...stagger(0.3)}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          Desde nanopartículas lipídicas hasta fermentación no destructiva y vitrificación
          instantánea. Dominamos cada escala para transformar bioactivos en productos
          de máximo rendimiento.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          {...stagger(0.6)}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-slate-600 tracking-[0.3em] uppercase">
            Scroll para explorar
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-teal-500/60 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

/* ──────────────────────────────
   MAIN EXPORT
   ────────────────────────────── */
export default function TechnologyPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <TechHero />
      <Suspense fallback={<SectionFallback />}>
        <NanoArsenal />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BiotechDeepDive />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SprayDryingSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DisruptiveInnovation />
      </Suspense>
    </div>
  );
}
