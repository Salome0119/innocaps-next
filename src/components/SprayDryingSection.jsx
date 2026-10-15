'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlossaryTooltip from './GlossaryTooltip';
import { useIsMobile } from '../hooks/useIsMobile';

/* ═══════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   SPRAY DRYER DIAGRAM (SVG)
   ═══════════════════════════════════ */
function SprayDryerDiagram({ progress, particleCount = 20 }) {
  // Inlet temp interpolation: 160°C → 120°C as scroll progresses (showing range)
  const inletTemp = Math.round(160 - progress * 40);
  // Outlet temp: starts hidden, appears at ~50-65°C range
  const outletTemp = Math.round(50 + (1 - progress) * 15);
  const particlesFrozen = progress > 0.65;

  /* Clamp to avoid unnecessary re-renders */
  const effectiveParticles = Math.min(particleCount, 12);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 300 420" className="w-full h-auto" fill="none">
        {/* Dryer body — cone shape */}
        <defs>
          <linearGradient id="dryerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="inletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="outletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Top chamber (cylinder) */}
        <rect
          x="60"
          y="50"
          width="180"
          height="140"
          rx="12"
          fill="url(#dryerGrad)"
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="1"
        />

        {/* Cone section */}
        <path
          d="M60 190 L120 340 L180 340 L240 190"
          fill="url(#dryerGrad)"
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="1"
        />

        {/* Inlet nozzle */}
        <rect x="135" y="20" width="30" height="35" rx="4" fill="url(#inletGrad)" />
        <line x1="150" y1="55" x2="150" y2="90" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3" />

        {/* Spray pattern */}
        <path
          d="M150 90 Q120 130 90 160 M150 90 Q150 130 150 160 M150 90 Q180 130 210 160"
          stroke="#f9731650"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />

        {/* Outlet pipe */}
        <rect x="135" y="340" width="30" height="40" rx="4" fill="url(#outletGrad)" />

        {/* Collection base */}
        <ellipse cx="150" cy="395" rx="50" ry="12" fill="#14b8a6" opacity="0.1" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Inlet temperature label */}
        <g transform="translate(250, 30)">
          <rect x="0" y="0" width="45" height="28" rx="6" fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.3" />
          <text x="22" y="18" textAnchor="middle" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">
            {inletTemp}°C
          </text>
        </g>
        <line x1="245" y1="44" x2="165" y2="35" stroke="#f9731640" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Outlet temperature label */}
        <g transform="translate(190, 355)">
          <rect x="0" y="0" width="45" height="28" rx="6" fill="#14b8a6" fillOpacity="0.15" stroke="#14b8a6" strokeWidth="0.5" strokeOpacity="0.3" />
          <text x="22" y="18" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="monospace" fontWeight="bold">
            {outletTemp}°C
          </text>
        </g>

        {/* Labels */}
        <text x="150" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace" letterSpacing="2">
          INLET
        </text>
        <text x="150" y="415" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace" letterSpacing="2">
          POLVO SECO
        </text>
      </svg>

      {/* Animated particles inside dryer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: effectiveParticles }).map((_, i) => {
          const left = 30 + Math.random() * 40; // percentage
          const delay = Math.random() * 3;
          const duration = 2 + Math.random() * 2;
          const size = 2 + Math.random() * 3;

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: '18%',
                width: size,
                height: size,
                backgroundColor: particlesFrozen ? '#14b8a6' : '#f97316',
              }}
              animate={
                particlesFrozen
                  ? {
                      y: [0, 200 + Math.random() * 80],
                      opacity: [0.8, 0.6],
                      scale: [1, 0.8],
                    }
                  : {
                      y: [0, 250 + Math.random() * 50],
                      x: [0, (Math.random() - 0.5) * 40],
                      opacity: [0, 0.8, 0.5, 0],
                      scale: [0.5, 1, 0.8, 0.3],
                    }
              }
              transition={{
                duration: particlesFrozen ? duration * 1.5 : duration,
                repeat: Infinity,
                delay,
                ease: particlesFrozen ? 'easeOut' : 'easeInOut',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   TEMPERATURE GAUGE
   ═══════════════════════════════════ */
function TempGauge({ temp, maxTemp, color, label }) {
  const percentage = (temp / maxTemp) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════
   CONTROL POINTS
   ═══════════════════════════════════ */
const controlPoints = [
  {
    number: '01',
    label: 'La Entrada (Inlet)',
    temp: '120-160°C',
    color: '#f97316',
    gradient: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/5',
    action: 'Evaporación de choque para secado rápido.',
    detail: 'El líquido se atomiza en microgotas que pierden el agua en milisegundos al contactar el aire caliente.',
  },
  {
    number: '02',
    label: 'La Salida (Outlet)',
    temp: '50-65°C',
    badge: 'EL SECRETO',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-500/20',
    bgColor: 'bg-teal-500/5',
    action:
      'Temperatura suficientemente baja para no desnaturalizar proteínas ni matar probióticos.',
    detail:
      'Pero suficiente para lograr un polvo seco estable. El punto crítico que define la diferencia entre un activo vivo y uno muerto.',
  },
  {
    number: '03',
    label: 'La Matriz Vítrea',
    temp: 'RESULTADO',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-500',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/5',
    action: (
      <>
        Para probióticos (<em>Lactobacillus</em>, <em>Bacillus</em>), usamos matrices de{' '}
        <GlossaryTooltip term="Maltodextrina">maltodextrina</GlossaryTooltip> o{' '}
        <GlossaryTooltip term="Goma arábiga">goma arábiga</GlossaryTooltip>.
      </>
    ),
    detail: (
      <>
        Estas matrices se{' '}
        <GlossaryTooltip term="Vitrificación">&ldquo;vitrifican&rdquo;</GlossaryTooltip>{' '}
        (se vuelven vidrio microscópico), inmovilizando la célula en un estado de animación
        suspendida protegida del oxígeno y la humedad.
      </>
    ),
  },
];

/* ═══════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════ */
export default function SprayDryingSection() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const progress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section ref={sectionRef} className={`relative bg-slate-950 overflow-hidden ${isMobile ? 'py-20' : 'py-28 lg:py-36'}`}>
      {/* Background accents — reduced on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[180px]" />
        </div>
      )}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className={`container mx-auto relative z-10 ${isMobile ? 'px-5' : 'px-4 sm:px-6'}`}>
        {/* ── Header ── */}
        <motion.div {...fadeUp} className="mb-6">
          <span className={`inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-orange-400 border border-orange-500/20 rounded-full bg-orange-500/5 ${isMobile ? 'mb-5' : 'mb-8'}`}>
            Bloque 3 — Animación de Proceso
          </span>
        </motion.div>

        <motion.h2
          {...stagger(0.1)}
          className={`font-bold text-white mb-4 max-w-4xl ${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl lg:text-7xl'}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-teal-400">
            Vitrificación
          </span>{' '}
          Instantánea
        </motion.h2>

        <motion.p {...stagger(0.2)} className={`text-slate-400 max-w-3xl mb-6 leading-[1.5] ${isMobile ? 'text-base' : 'text-lg leading-relaxed'}`}>
          Convertimos líquidos vivos en polvos estables sin matar la bioactividad. El secreto está
          en el control térmico de milisegundos.
        </motion.p>

        <motion.p {...stagger(0.25)} className={`text-slate-600 text-sm font-mono tracking-wider uppercase ${isMobile ? 'mb-10' : 'mb-16'}`}>
          Termodinámica del Secado por Spray Drying
        </motion.p>

        {/* ── Main layout: Diagram + Control Points ── */}
        <div className={`grid gap-10 items-start ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 lg:grid-cols-2 lg:gap-16'}`}>
          {/* Spray Dryer Diagram — fewer particles on mobile */}
          <motion.div {...stagger(0.3)}>
            <SprayDryerDiagram progress={0.5} particleCount={isMobile ? 5 : 14} />
          </motion.div>

          {/* Control Points */}
          <div className="space-y-6">
            {controlPoints.map((cp, i) => (
              <motion.div
                key={cp.number}
                {...stagger(0.35 + i * 0.12)}
                className="group"
              >
                <div
                  className={`relative rounded-2xl border ${cp.borderColor} ${cp.bgColor} overflow-hidden transition-all duration-300 hover:bg-opacity-10 ${isMobile ? 'p-5' : 'p-6 lg:p-7'}`}
                >
                  {/* Number badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold"
                      style={{
                        backgroundColor: cp.color + '15',
                        color: cp.color,
                        border: `1px solid ${cp.color}30`,
                      }}
                    >
                      {cp.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>{cp.label}</h4>
                        {cp.badge && (
                          <span
                            className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-full"
                            style={{
                              backgroundColor: cp.color + '15',
                              color: cp.color,
                              border: `1px solid ${cp.color}30`,
                            }}
                          >
                            {cp.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-mono font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}
                        style={{ color: cp.color }}
                      >
                        {cp.temp}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-[1.6] mb-2">{cp.action}</p>
                  <p className="text-slate-500 text-sm leading-[1.6]">{cp.detail}</p>

                  {/* Temp gauge for inlet/outlet */}
                  {cp.number !== '03' && (
                    <div className="mt-4">
                      <TempGauge
                        temp={cp.number === '01' ? 140 : 57}
                        maxTemp={200}
                        color={cp.color}
                        label={cp.number === '01' ? 'Alta energía' : 'Punto crítico'}
                      />
                    </div>
                  )}

                  {/* Hover glow — desktop only */}
                  {!isMobile && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${cp.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── WebGL Particle Behavior Note ── */}
        <motion.div {...stagger(0.6)} className={isMobile ? 'mt-12' : 'mt-20'}>
          <div className={`relative rounded-2xl border border-slate-800/40 bg-slate-900/30 overflow-hidden ${isMobile ? 'p-5' : 'p-8 lg:p-10'}`}>
            <div className={`flex gap-6 ${isMobile ? 'flex-col' : 'flex-col md:flex-row md:items-center md:gap-10'}`}>
              {/* Fluid → Frozen visual */}
              <div className="flex items-center gap-6 flex-shrink-0 justify-center">
                {/* Fluid state */}
                <div className="relative w-20 h-20 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-center overflow-hidden">
                  {[...Array(isMobile ? 3 : 8)].map((_, i) => (
                    <motion.div
                      key={`fluid-${i}`}
                      className="absolute w-1.5 h-1.5 rounded-full bg-orange-400"
                      animate={{
                        x: [0, (Math.random() - 0.5) * 30],
                        y: [0, (Math.random() - 0.5) * 30],
                      }}
                      transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.15,
                      }}
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                    />
                  ))}
                  <span className="text-[8px] font-mono text-orange-400/60 absolute bottom-1">FLUIDO</span>
                </div>

                {/* Arrow */}
                <div className="text-slate-600 text-xl">&rarr;</div>

                {/* Frozen state */}
                <div className="relative w-20 h-20 rounded-xl border border-teal-500/20 bg-teal-500/5 flex items-center justify-center overflow-hidden">
                  {[...Array(isMobile ? 3 : 8)].map((_, i) => (
                    <div
                      key={`frozen-${i}`}
                      className="absolute w-1.5 h-1.5 rounded-full bg-teal-400"
                      style={{
                        left: `${15 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 25}%`,
                      }}
                    />
                  ))}
                  <span className="text-[8px] font-mono text-teal-400/60 absolute bottom-1">VITRIFICADO</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className={`text-slate-400 leading-[1.6] ${isMobile ? 'text-sm text-center' : 'text-sm'}`}>
                  Las partículas se comportan como fluido al principio y se &ldquo;congelan&rdquo;
                  en el aire al llegar a la temperatura de salida de 50°C. La transición de
                  líquido a sólido vítreo ocurre en milisegundos, preservando la estructura
                  molecular y la viabilidad celular.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className={`container mx-auto px-6 ${isMobile ? 'mt-16' : 'mt-24'}`}>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>
    </section>
  );
}
