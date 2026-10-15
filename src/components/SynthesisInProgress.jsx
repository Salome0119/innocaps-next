'use client';

import Link from 'next/link';
import { useRef, useMemo, useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy-load the entire R3F Canvas tree — avoids loading Three.js until needed
const LazyParticleCanvas = lazy(() => import('./SynthesisCanvas.jsx'));

/* ─────────────────────────────────────────────
   COPY VARIATIONS (Nanotechnology tone)
   ───────────────────────────────────────────── */

const COPY_VARIANTS = [
  {
    headline: 'SECCIÓN EN DESARROLLO',
    subtitle:
      'Esta área de nuestra plataforma se encuentra actualmente en fase de implementación. Nuestro equipo trabaja para habilitar este contenido a la brevedad.',
    status: 'ESTADO: EN DESARROLLO',
    statusDetail: 'Disponible próximamente',
  },
  {
    headline: 'CONTENIDO EN PREPARACIÓN',
    subtitle:
      'Estamos construyendo esta sección para ofrecerte la mejor experiencia. Pronto estará disponible con toda la información que necesitas.',
    status: 'ESTADO: EN CONSTRUCCIÓN',
    statusDetail: 'Implementación en curso',
  },
  {
    headline: 'PÁGINA NO ENCONTRADA',
    subtitle:
      'La dirección solicitada no existe o ha sido reubicada. Verifica la URL o regresa a la página principal para continuar navegando.',
    status: 'ERROR 404',
    statusDetail: 'Recurso no disponible',
  },
];

/* ─────────────────────────────────────────────
   CANVAS BACKGROUND  —  Neural Network Grid (optimized)
   Reduced particles, pauses off-screen via IntersectionObserver
   ───────────────────────────────────────────── */

function NeuralBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Reduced particle count by ~40%
    const PARTICLE_N = Math.min(50, Math.floor((w * h) / 25000));
    const CONNECTION_DIST = 140;

    particlesRef.current = Array.from({ length: PARTICLE_N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisibleRef.current) return;

      ctx.clearRect(0, 0, w, h);
      const pts = particlesRef.current;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.fill();
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────
   CONSTRUCTION BADGE
   ───────────────────────────────────────────── */

function ConstructionBadge() {
  return (
    <div className="flex items-center justify-center gap-3 mt-6 py-3 px-5 rounded-xl bg-slate-800/40 border border-slate-700/30 mx-auto w-fit">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-cyan-400/80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ originX: '0.85', originY: '0.15' }}
      >
        {/* Wrench / tool icon */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </motion.svg>
      <span className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-wide">
        EN CONSTRUCCIÓN
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEX ROTATING ICON
   ───────────────────────────────────────────── */

function MoleculeIcon() {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
      className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Hexagonal molecule shape */}
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" strokeDasharray="4 2" />
      <circle cx="32" cy="4" r="3" fill="currentColor" />
      <circle cx="56" cy="18" r="3" fill="currentColor" />
      <circle cx="56" cy="46" r="3" fill="currentColor" />
      <circle cx="32" cy="60" r="3" fill="currentColor" />
      <circle cx="8" cy="46" r="3" fill="currentColor" />
      <circle cx="8" cy="18" r="3" fill="currentColor" />
      <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.3" />
      <line x1="32" y1="4" x2="32" y2="32" strokeDasharray="2 3" />
      <line x1="56" y1="46" x2="32" y2="32" strokeDasharray="2 3" />
      <line x1="8" y1="46" x2="32" y2="32" strokeDasharray="2 3" />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function SynthesisInProgress({ variant = 0, is404 = false }) {
  const copy = COPY_VARIANTS[variant % COPY_VARIANTS.length];
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* ── Neural-network particle background ── */}
      <NeuralBackground />

      {/* ── Ambient glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Content ── */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-12"
          >
            {/* ── Error code (404 only) ── */}
            {is404 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="synthesis-glitch font-mono text-6xl sm:text-8xl font-black text-cyan-500/10 select-none tracking-widest" data-text="404">
                  404
                </span>
              </motion.div>
            )}

            {/* ── Two-column: THREE.js sphere + Glass card ── */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full">
              {/* Left — R3F Particle Sphere */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0"
              >
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>}>
                  <LazyParticleCanvas />
                </Suspense>
              </motion.div>

              {/* Right — Glassmorphism Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative flex-1 min-w-0 w-full max-w-xl"
              >
                {/* Glass card */}
                <div className="relative rounded-2xl border border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(34,211,238,0.15)] p-6 sm:p-8 overflow-hidden">
                  {/* Scan line */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    />
                  </div>

                  {/* Molecule icon */}
                  <MoleculeIcon />

                  {/* Status badge */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase">
                      {copy.status}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="synthesis-glitch text-xl sm:text-2xl md:text-3xl font-black text-center text-white tracking-tight leading-tight mb-3" data-text={copy.headline}>
                    {copy.headline}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base text-slate-400 text-center leading-relaxed mb-2 max-w-md mx-auto">
                    {copy.subtitle}
                  </p>

                  {/* Status detail */}
                  <p className="text-[10px] sm:text-xs font-mono text-teal-500/60 text-center mb-2">
                    {copy.statusDetail}
                  </p>

                  {/* Construction badge */}
                  <ConstructionBadge />

                  {/* Metadata grid */}
                  <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                    {[
                      { label: 'PLATAFORMA', value: 'ACTIVA' },
                      { label: 'VERSIÓN', value: 'v2.4' },
                      { label: 'ESTADO', value: 'PEND.' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-slate-800/50 rounded-lg py-2 px-1 border border-slate-700/30"
                      >
                        <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 tracking-wide">
                          {item.label}
                        </div>
                        <div className="text-xs sm:text-sm font-mono text-cyan-400 mt-0.5">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                    <Link
                      href="/"
                      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-slate-950 font-bold text-sm transition-all duration-300 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Footer label ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 text-center"
            >
              <p className="text-[10px] sm:text-xs font-mono text-slate-600 tracking-widest">
                INNOCAPS LAB &middot; NANOENCAPSULACIÓN Y BIOTECNOLOGÍA
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
