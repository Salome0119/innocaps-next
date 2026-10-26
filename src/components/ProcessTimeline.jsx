'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import { useIsMobile } from '../hooks/useIsMobile';

/* ═══════════════════════════════════════════════════════════════════
   PROCESS STEPS DATA — "The Molecular Journey"
   Hard data highlighted with accent color (#2dd4bf / teal-400)
   ═══════════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    id: '01',
    title: 'CONOCIMIENTO DEL RETO',
    tagline: 'Diagnóstico Molecular',
    copy: 'Todo comienza analizando las propiedades fisicoquímicas y la fragilidad de tu activo. ¿Es sensible al pH? ¿Se oxida con la luz? Definimos el "Dolor Biológico" y seleccionamos la arquitectura de encapsulación ideal.',
    highlights: ['Micelas', 'Liposoma', 'Niosoma', 'SLN', 'Dendrímeros', 'Ciclodextrinas'],
    visual: 'diagnose',
    image: '/proceso/paso-01.webp',
    imageAlt: 'Investigadores analizando datos de nanoencapsulación en laboratorio',
  },
  {
    id: '02',
    title: 'DISEÑO DE LA PROPUESTA',
    tagline: 'Arquitectura de Matriz',
    copy: 'Rompemos el estándar de la industria. En lugar de añadir polímeros sintéticos no viables, evaluamos el uso de matrices intrínsecas para maximizar tus recursos.',
    bullets: [
      { label: 'Vía Bacteriana', detail: 'Inducimos el auto-ensamblaje de biosurfactantes.' },
    ],
    quote: 'Maximizamos tus recursos convirtiendo el medio de cultivo en parte de la solución.',
    visual: 'matrix',
    image: '/proceso/paso-02.webp',
    imageAlt: 'Diseño de la propuesta',
  },
  {
    id: '03',
    title: 'FORJA NANOMÉTRICA',
    tagline: 'Síntesis de Alta Presión',
    copy: 'Trabajamos la formulación considerando sus variables termodinámicas llegando al límite físico para garantizar estabilidad.',
    bullets: [
      { label: 'Homogeneización', detail: 'Sometemos la mezcla a diferentes procesos de homogeneización, garantizando el proceso de escalado. Consecuentemente, se crean estructuras ordenadas, estables y perfectas para su función específica.' },
      { label: 'Resultado', detail: 'Nano o microemulsiones termodinámicamente estables de 20-900 nm.' },
    ],
    dataHighlights: ['20-900 nm'],
    visual: 'pressure',
    image: '/proceso/paso-03.webp',
    imageAlt: 'Forja Nanométrica',
  },
  {
    id: '04',
    title: 'EL "PUNTO DULCE" TÉRMICO',
    tagline: 'Vitrificación Térmica',
    copy: 'El momento crítico. Convertimos prebióticos, probióticos y posbióticos en polvos estables mediante procesos de secado de precisión.',
    bullets: [
      { label: 'Vitrificación', detail: 'Logramos un estado vítreo de la matriz sin desnaturalizar proteínas ni eliminar la viabilidad biológica de microorganismos probióticos.' },
    ],
    dataHighlights: ['Vitrificación térmica'],
    visual: 'drying',
    image: '/proceso/paso-04.webp',
    imageAlt: 'Vitrificación Térmica',
  },
  {
    id: '05',
    title: 'EVIDENCIA VISUAL',
    tagline: 'Validación & Escalado',
    copy: 'La ciencia no es una promesa, es un dato.',
    bullets: [
      { label: 'Visualización Científica', detail: 'Se proporcionan imágenes y datos que prueben las características del producto final.' },
      { label: 'Resultado', detail: 'Tu fórmula queda lista para producción industrial masiva o para evolucionar mediante nuestro modelo de suscripción de I+D.' },
    ],
    visual: 'validate',
    image: '/proceso/paso-05.webp',
    imageAlt: 'Evidencia Visual',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — fade-in on viewport entry (mobile perf)
   ═══════════════════════════════════════════════════════════════════ */

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin: '0px 0px -30px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function FadeIn({ children, className = '', delay = 0 }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP VISUAL PLACEHOLDER — gradients ready for <video> / <Lottie>
   ═══════════════════════════════════════════════════════════════════ */

const VISUAL_MAP = {
  diagnose: {
    gradient: 'from-cyan-900/40 via-slate-900 to-teal-900/30',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 text-teal-400 opacity-60" aria-hidden="true">
        <circle cx="34" cy="34" r="22" stroke="currentColor" strokeWidth="2" />
        <path d="M50 50l18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 28l12 12M40 28L28 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  matrix: {
    gradient: 'from-emerald-900/40 via-slate-900 to-cyan-900/30',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 text-teal-400 opacity-60" aria-hidden="true">
        <rect x="10" y="10" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="28" cy="28" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="52" cy="28" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="40" cy="52" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M33 30l7 18M47 30l-7 18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  pressure: {
    gradient: 'from-sky-900/40 via-slate-900 to-indigo-900/30',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 text-teal-400 opacity-60" aria-hidden="true">
        <path d="M20 16v48M60 16v48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 40h40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
        <path d="M28 26l12 14-12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 26L40 40l12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  drying: {
    gradient: 'from-amber-900/30 via-slate-900 to-orange-900/20',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 text-teal-400 opacity-60" aria-hidden="true">
        <path d="M40 12C40 12 56 32 56 46a16 16 0 11-32 0c0-14 16-34 16-34z" stroke="currentColor" strokeWidth="2" />
        <path d="M34 44a6 6 0 006 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M30 66l4-6M40 68v-8M50 66l-4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </svg>
    ),
  },
  validate: {
    gradient: 'from-teal-900/40 via-slate-900 to-emerald-900/30',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 text-teal-400 opacity-60" aria-hidden="true">
        <rect x="12" y="14" width="56" height="42" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M20 42l10-10 8 6 14-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 64h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M40 56v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
};

const StepVisual = memo(function StepVisual({ visual, image, imageAlt }) {
  const v = VISUAL_MAP[visual] || VISUAL_MAP.diagnose;
  return (
    <div
      className={`relative w-full h-full min-h-[200px] md:min-h-[320px] rounded-2xl bg-gradient-to-br ${v.gradient} border border-slate-800/50 flex items-center justify-center overflow-hidden`}
      style={{ aspectRatio: '4/3' }}
    >
      {/* Subtle animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-32 h-32 rounded-full bg-teal-500/5 -top-8 -right-8"
          style={{ animation: 'process-blob-float 6s ease-in-out infinite' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full bg-cyan-500/5 -bottom-6 -left-6"
          style={{ animation: 'process-blob-float 8s ease-in-out infinite reverse' }}
        />
      </div>
      {image ? (
        <Image
          src={image}
          alt={imageAlt || ''}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        v.icon
      )}
      {/* Ready for <video> or <Lottie> overlay */}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   HIGHLIGHT RENDERER — teal-accented data values
   ═══════════════════════════════════════════════════════════════════ */

function highlightText(text, highlights = []) {
  if (!highlights.length) return text;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className="text-teal-400 font-bold">{part}</span>
    ) : (
      part
    ),
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCROLL PROGRESS — drives the SVG center line on desktop
   ═══════════════════════════════════════════════════════════════════ */

function useScrollProgress(containerRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const total = rect.height;
        // progress 0→1 as section scrolls through
        const scrolled = Math.max(0, viewH - rect.top);
        const p = Math.min(1, Math.max(0, scrolled / (total + viewH * 0.3)));
        setProgress(p);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return progress;
}

/* ═══════════════════════════════════════════════════════════════════
   DESKTOP CENTER LINE — SVG that "lights up" on scroll
   ═══════════════════════════════════════════════════════════════════ */

function CenterLine({ totalSteps, progress, containerHeight }) {
  const lineHeight = containerHeight || 1000;
  const dashLen = lineHeight;

  return (
    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px pointer-events-none z-10 hidden lg:block">
      <svg
        width="2"
        height={lineHeight}
        viewBox={`0 0 2 ${lineHeight}`}
        className="absolute top-0 left-0"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Background track */}
        <line x1="1" y1="0" x2="1" y2={lineHeight} stroke="rgba(148,163,184,0.12)" strokeWidth="2" />
        {/* Illuminated portion */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2={lineHeight}
          stroke="#2dd4bf"
          strokeWidth="2"
          strokeDasharray={dashLen}
          strokeDashoffset={dashLen - dashLen * progress}
          style={{ transition: 'stroke-dashoffset 0.12s linear', filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.5))' }}
        />
      </svg>

      {/* Step dots */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const y = ((i + 0.5) / totalSteps) * 100;
        const active = progress >= (i + 0.3) / totalSteps;
        return (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300"
            style={{
              top: `${y}%`,
              borderColor: active ? '#2dd4bf' : 'rgba(148,163,184,0.25)',
              backgroundColor: active ? '#2dd4bf' : '#0f172a',
              boxShadow: active ? '0 0 12px rgba(45,212,191,0.6)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP CARD — renders copy, bullets, highlights
   ═══════════════════════════════════════════════════════════════════ */

function StepContent({ step }) {
  const allHighlights = [
    ...(step.highlights || []),
    ...(step.dataHighlights || []),
  ];

  return (
    <div className="space-y-4">
      {/* Tagline */}
      <p className="text-teal-400 text-xs font-mono tracking-[0.2em] uppercase">{step.tagline}</p>

      {/* Title */}
      <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
        <span className="text-teal-400 mr-2">{step.id}.</span>
        {step.title}
      </h3>

      {/* Copy */}
      <p className="text-sm md:text-base text-slate-400 leading-relaxed">
        {highlightText(step.copy, allHighlights)}
      </p>

      {/* Highlights chips */}
      {step.highlights && (
        <div className="flex flex-wrap gap-2">
          {step.highlights.map((h) => (
            <span key={h} className="px-3 py-1 rounded-full text-xs font-semibold border border-teal-500/30 text-teal-400 bg-teal-500/5">
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Bullets */}
      {step.bullets && (
        <div className="space-y-3 pt-1">
          {step.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
              <div>
                <p className="text-teal-300 font-semibold text-sm">{b.label}</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {highlightText(b.detail, allHighlights)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote */}
      {step.quote && (
        <blockquote className="border-l-2 border-teal-500/50 pl-4 mt-4">
          <p className="text-teal-300/80 text-sm italic leading-relaxed">"{step.quote}"</p>
        </blockquote>
      )}

      {/* Data highlights callout */}
      {step.dataHighlights && (
        <div className="flex flex-wrap gap-3 pt-2">
          {step.dataHighlights.map((d) => (
            <span key={d} className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-sm font-mono">
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DESKTOP STEP — zig-zag layout (odd left text, even right text)
   ═══════════════════════════════════════════════════════════════════ */

function DesktopStep({ step, index }) {
  const isOdd = index % 2 === 0; // steps 1,3,5 → text left, visual right
  const { ref, visible } = useFadeIn(0.1);

  return (
    <article
      ref={ref}
      className="relative grid grid-cols-[1fr_64px_1fr] gap-6 items-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(40px)`,
        transition: `opacity 0.7s ease ${index * 0.05}s, transform 0.7s ease ${index * 0.05}s`,
      }}
    >
      {/* Left column */}
      <div className={isOdd ? '' : 'order-3'}>
        {isOdd ? <StepContent step={step} /> : <StepVisual visual={step.visual} image={step.image} imageAlt={step.imageAlt} />}
      </div>

      {/* Center spacer (line lives behind in CenterLine) */}
      <div className="order-2" />

      {/* Right column */}
      <div className={isOdd ? 'order-3' : ''}>
        {isOdd ? <StepVisual visual={step.visual} image={step.image} imageAlt={step.imageAlt} /> : <StepContent step={step} />}
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE STEP — vertical timeline, left line
   ═══════════════════════════════════════════════════════════════════ */

function MobileStep({ step, index, total }) {
  return (
    <FadeIn delay={0}>
      <article className="relative pl-10 pb-12 last:pb-0">
        {/* Timeline line */}
        {index < total - 1 && (
          <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-800" />
        )}

        {/* Dot */}
        <div
          className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-teal-500/60 bg-slate-950 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-teal-400" />
        </div>

        {/* Number */}
        <p className="text-teal-400 text-xs font-mono tracking-[0.2em] uppercase mb-1">{step.tagline}</p>

        {/* Title — 24px per spec */}
        <h3 className="text-2xl font-bold text-white leading-tight mb-1">
          <span className="text-teal-400 mr-1">{step.id}.</span>
          {step.title}
        </h3>

        {/* Visual placeholder */}
        <div className="my-4">
          <StepVisual visual={step.visual} image={step.image} imageAlt={step.imageAlt} />
        </div>

        {/* Content — 16px per spec */}
        <StepContent step={step} />
      </article>
    </FadeIn>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT — ProcessTimeline
   ═══════════════════════════════════════════════════════════════════ */

export default function ProcessTimeline() {
  const isMobile = useIsMobile(1023); // breakpoint matches lg
  const containerRef = useRef(null);
  const [containerH, setContainerH] = useState(1000);
  const progress = useScrollProgress(containerRef);

  // Measure container height for SVG line
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="process" className="relative bg-slate-950 py-20 md:py-32 overflow-hidden" aria-labelledby="process-title">
      {/* ── HEADER ── */}
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center mb-16 md:mb-24">
        <FadeIn>
          <p className="text-teal-400 text-sm font-mono tracking-widest uppercase mb-3">El Viaje Molecular</p>
          <h2 id="process-title" className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            EL MÉTODO{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">INNOCAPS</span>.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-4 font-light">
            Diseñamos, ejecutamos y validamos.
          </p>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Transformar una idea en un ingrediente funcional requiere más que mezcla; requiere ingeniería de precisión. Este es nuestro protocolo de co-creación científica.
          </p>
        </FadeIn>
      </div>

      {/* ── STEPS ── */}
      <div ref={containerRef} className="relative max-w-6xl mx-auto px-5 md:px-8">
        {/* Desktop center line */}
        {!isMobile && (
          <CenterLine totalSteps={STEPS.length} progress={progress} containerHeight={containerH} />
        )}

        {isMobile ? (
          /* ── MOBILE: vertical timeline ── */
          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <MobileStep key={step.id} step={step} index={i} total={STEPS.length} />
            ))}
          </div>
        ) : (
          /* ── DESKTOP: zig-zag layout ── */
          <div className="space-y-24 lg:space-y-32">
            {STEPS.map((step, i) => (
              <DesktopStep key={step.id} step={step} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
