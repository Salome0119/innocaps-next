'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, memo } from 'react';
import { processSteps } from '../data/sectionsData';

// Componente de animación molecular — CSS animations (no framer-motion per-particle)
const VisualState = memo(function VisualState({ state }) {
  
// Estado 1: Nanoencapsulación (Estilo Oval/Elíptico)
if (state === 'nanoencapsulation') {
  const radiusX = 120;
  const radiusY = 190;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <div className="relative w-[400px] h-[500px] flex items-center justify-center">
        {/* === NÚCLEO CENTRAL (SOL) === */}
        <div className="absolute z-10" style={{ animation: 'pulse-scale 4s ease-in-out infinite' }}>
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-600 rounded-full shadow-[0_0_60px_rgba(251,146,60,0.6)]" />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent rounded-full"
              style={{ animation: 'spin-slow 8s linear infinite' }}
            />
          </div>
        </div>

        {/* === GLOW PULSANTE === */}
        <div
          className="absolute w-48 h-48 rounded-full z-0"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        />

        {/* === ANILLOS ELÍPTICOS === */}
        {[0.5, 0.75, 1].map((scale, i) => (
          <div
            key={`ring-${i}`}
            className="absolute rounded-[50%]"
            style={{
              width: `${radiusX * 2 * scale}px`,
              height: `${radiusY * 2 * scale}px`,
              border: `2px solid rgba(20, 184, 166, ${i === 2 ? 0.8 : 0.3})`,
              boxShadow: i === 2 ? '0 0 15px rgba(20, 184, 166, 0.4)' : 'none',
              animation: `ring-breathe ${8 + i * 3}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* === PARTÍCULAS ORBITALES (reduced 8→6, CSS keyframes) === */}
        {[0, 60, 120, 180, 240, 300].map((startAngle, i) => {
          const r = radiusX * 0.88;
          const rY = radiusY * 0.88;
          const cx = r * Math.cos((startAngle * Math.PI) / 180);
          const cy = rY * Math.sin((startAngle * Math.PI) / 180);
          return (
            <div
              key={`orbiter-${i}`}
              className="absolute rounded-full"
              style={{
                top: '50%',
                left: '50%',
                width: i % 2 === 0 ? '2px' : '1.5px',
                height: i % 2 === 0 ? '2px' : '1.5px',
                backgroundColor: i % 2 === 0 ? 'rgb(94, 234, 212)' : 'rgb(34, 211, 238)',
                boxShadow: `0 0 ${i % 2 === 0 ? 8 : 5}px rgba(20, 184, 166, 0.8)`,
                transform: `translate(${cx}px, ${cy}px)`,
                animation: `indicator-pulse ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          );
        })}

        {/* === MOLÉCULAS PERÍMETRO (reduced 20→10, CSS) === */}
        {Array.from({ length: 10 }, (_, i) => {
          const angleDeg = (i * 360) / 10;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = radiusX * Math.cos(angleRad);
          const y = radiusY * Math.sin(angleRad);
          const rotation = angleDeg + 90;

          return (
            <div
              key={`lipid-${i}`}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                marginLeft: '-4px',
                marginTop: '-10px',
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              }}
            >
              <div
                className="flex flex-col items-center"
                style={{ animation: `breathe-lipid 3s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }}
              >
                <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />
                <div className="w-0.5 h-3 bg-teal-500/60" />
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
              </div>
            </div>
          );
        })}

        {/* === ETIQUETA FLOTANTE === */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/30"
          style={{ animation: 'float-y 3s ease-in-out infinite' }}
        >
          <p className="text-teal-300 font-bold text-sm uppercase tracking-wider whitespace-nowrap">
            Protección Molecular
          </p>
        </div>
      </div>
    </div>
  );
}

  // Estado 2: Biotecnología Aplicada (fermentación y biorreactor)
  if (state === 'biotech') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-96 h-96">
          {/* Biorreactor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative w-72 h-80 rounded-3xl border-4 border-cyan-500/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 40px rgba(6, 182, 212, 0.1)' }}
            >
              {/* Líquido de cultivo */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/40 via-teal-500/30 to-transparent"
                style={{ animation: 'liquid-fill 8s ease-in-out infinite' }}
              >
                {/* Burbujas (reduced 15→6) */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={`bubble-${i}`}
                    className="absolute w-3 h-3 bg-cyan-300/60 rounded-full"
                    style={{
                      left: `${10 + i * 15}%`,
                      bottom: '5%',
                      animation: `bubble-rise ${3 + (i % 3) * 0.7}s ease-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              {/* Microorganismos (reduced 20→8) */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`cell-${i}`}
                  className="absolute w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"
                  style={{
                    left: `${10 + (i * 10) % 80}%`,
                    top: `${20 + (i * 8) % 60}%`,
                    boxShadow: '0 0 10px rgba(52, 211, 153, 0.6)',
                    '--dx': `${((i % 3) - 1) * 20}px`,
                    '--dy': `${((i % 2) - 0.5) * 30}px`,
                    animation: `cell-drift ${4 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}

              {/* Agitador central */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-b from-slate-600 to-transparent"
                style={{ animation: 'spin-slow 3s linear infinite', transformOrigin: 'center 10%' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-32 bg-slate-600" />
              </div>

              {/* Indicadores */}
              <div className="absolute top-4 left-4 space-y-2">
                {['pH', 'T°', 'O₂'].map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-2"
                    style={{ animation: `indicator-pulse 2s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs text-cyan-300 font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flujo de entrada */}
          <div className="absolute top-10 right-0 flex items-center gap-2" style={{ animation: 'indicator-pulse 2s ease-in-out infinite' }}>
            <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-transparent" />
            <div className="text-xs text-teal-300">Input</div>
          </div>

          {/* Flujo de salida */}
          <div className="absolute bottom-10 left-0 flex items-center gap-2" style={{ animation: 'indicator-pulse 2s ease-in-out infinite', animationDelay: '1s' }}>
            <div className="text-xs text-cyan-300">Output</div>
            <div className="w-20 h-1 bg-gradient-to-l from-cyan-500 to-transparent" />
          </div>

          {/* Etiqueta */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-cyan-500/10 backdrop-blur-md rounded-full border border-cyan-500/30"
            style={{ animation: 'float-y 2s ease-in-out infinite' }}
          >
            <p className="text-cyan-300 font-bold text-sm uppercase tracking-wider whitespace-nowrap">
              Fermentación de Precisión
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado 3: Secado Emergente (spray drying)
  if (state === 'drying') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-96 h-96">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Atomizador */}
            <div className="relative">
              <div className="w-16 h-8 bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-full border-2 border-slate-500" />
              
              {/* Spray drops (reduced 30→10) */}
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={`drop-${i}`}
                  className="absolute top-8 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
                  style={{
                    left: `${50 + ((i % 5) - 2) * 20}%`,
                    '--dx-start': `${((i % 3) - 1) * 15}px`,
                    '--dx-end': `${((i % 5) - 2) * 30}px`,
                    animation: `drop-fall 2.5s ease-in infinite`,
                    animationDelay: `${i * 0.25}s`,
                  }}
                />
              ))}
            </div>

            {/* Cámara de secado */}
            <div
              className="relative w-64 h-80 mt-2 rounded-3xl border-4 border-blue-500/40 bg-gradient-to-b from-slate-800/60 to-slate-900/80 backdrop-blur-sm overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(59, 130, 246, 0.2), inset 0 0 60px rgba(59, 130, 246, 0.05)' }}
            >
              {/* Heat waves (reduced 5→3) */}
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={`heat-${i}`}
                  className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent blur-sm"
                  style={{
                    top: `${25 + i * 20}%`,
                    animation: `heat-wave 2s linear infinite`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              ))}

              {/* Drying particles (reduced 40→12) */}
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${20 + (i * 5) % 60}%`,
                    top: '20%',
                    boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                    animation: `particle-fall 3s linear infinite`,
                    animationDelay: `${i * 0.25}s`,
                  }}
                />
              ))}

              {/* Polvo acumulándose */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/40 via-slate-200/20 to-transparent rounded-b-3xl"
                style={{ animation: 'powder-fill 10s ease-in-out infinite' }}
              >
                {/* Powder texture (reduced 50→15) */}
                <div className="absolute inset-0 opacity-60">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      key={`powder-${i}`}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${(i * 7) % 100}%`,
                        bottom: `${(i * 13) % 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Temperatura */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="flex items-center gap-2" style={{ animation: 'indicator-pulse 1.5s ease-in-out infinite' }}>
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-xs text-orange-300 font-mono">180°C</span>
                </div>
              </div>
            </div>

            {/* Salida de polvo */}
            <div className="w-20 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-full border-2 border-slate-500 mt-2 relative overflow-hidden">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-white to-slate-300"
                style={{ animation: 'indicator-pulse 2s ease-in-out infinite' }}
              />
            </div>
          </div>

          {/* Cristales (reduced 8→4) */}
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`crystal-${i}`}
              className="absolute"
              style={{
                top: `${25 + (i * 15) % 55}%`,
                left: `${15 + (i * 20) % 70}%`,
                animation: `crystal-spin 3s ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L10 18M2 10L18 10M5 5L15 15M15 5L5 15" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="1.5" />
              </svg>
            </div>
          ))}

          {/* Etiqueta */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-500/10 backdrop-blur-md rounded-full border border-blue-500/30"
            style={{ animation: 'float-y 2s ease-in-out infinite' }}
          >
            <p className="text-blue-300 font-bold text-sm uppercase tracking-wider whitespace-nowrap">
              Secado Avanzado
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = processSteps[activeIndex] ?? processSteps[0];

  const getStateForIndex = (index) => {
    if (index === 0) return 'nanoencapsulation';
    if (index === 1) return 'biotech';
    return 'drying';
  };

  return (
    <section className="relative bg-slate-950 light:bg-slate-100 py-20 md:py-32 overflow-hidden transition-colors duration-300">
      {/* ── FONDOS (estilo hero) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <img
          src="/bg2.webp"
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', objectFit: 'cover', opacity: 0.4 }}
          loading="lazy"
        />
        <img
          src="/bg3.webp"
          alt=""
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', objectFit: 'cover', opacity: 0.4 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/80" />
      </div>

      {/* Degradado superior */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 light:from-slate-100 to-transparent z-20 pointer-events-none"></div>
      
      {/* Degradado inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 light:from-slate-100 to-transparent z-20 pointer-events-none"></div>
      
      {/* Fondo decorativo — hidden on mobile for perf */}
      <div className="hidden md:block absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto relative z-10 px-5 md:px-2 md:max-w-[98%] lg:max-w-7xl sm:px-4 lg:px-6">
        {/* Título de sección */}
        <div className="text-center mb-10 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-bold text-white mb-4 text-3xl md:text-5xl lg:text-7xl md:mb-6"
          >
            Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">Tecnología</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-3xl mx-auto text-base leading-[1.5] md:text-xl"
          >
            Tres pilares tecnológicos que transforman bioactivos en ingredientes funcionales superiores
          </motion.p>
        </div>

        {/* ── SELECTOR DE PESTAÑAS (Glassmorphism cian neón) ── */}
        <div
          className="mb-10 md:mb-14 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          role="tablist"
          aria-label="Pilares tecnológicos"
        >
          {processSteps.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`relative flex items-center gap-2.5 rounded-full px-5 py-3 md:px-7 md:py-3.5 text-sm md:text-base font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00f5d4] to-cyan-400 text-[#030d14] shadow-[0_0_28px_rgba(0,245,212,0.45)]'
                    : 'border border-[#00f5d4]/25 bg-[#030d14]/70 text-slate-300 backdrop-blur-xl hover:border-[#00f5d4]/50 hover:text-white hover:shadow-[0_0_18px_rgba(0,245,212,0.18)]'
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="text-lg leading-none">{step.icon}</span>
                <span>{step.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* ── PANEL ÚNICO A TODO EL ANCHO (contenido activo) ── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#00f5d4]/20 bg-[#030d14]/80 shadow-[0_24px_70px_rgba(2,6,23,0.55),0_0_60px_-30px_rgba(0,245,212,0.35)] backdrop-blur-xl"
          >
            {/* Línea neón superior */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00f5d4] via-cyan-400 to-blue-400" />

            {/* Grid de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-0">
              {/* ── Columna izquierda: visualización 3D / gráfica ── */}
              <div className="relative flex items-center justify-center overflow-hidden border-b border-[#00f5d4]/10 p-4 md:p-6 lg:border-b-0 lg:border-r lg:min-h-[560px]">
                {/* Textura de rejilla técnica */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0,245,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.5) 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                  }}
                />
                {/* Halo radial de fondo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,245,212,0.10) 0%, transparent 70%)',
                  }}
                />

                <div className="relative w-full h-[320px] sm:h-[400px] lg:h-full flex items-center justify-center">
                  <VisualState state={getStateForIndex(activeIndex)} />
                </div>

                {/* Etiqueta técnica de la etapa */}
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-[#00f5d4]/30 bg-[#030d14]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#00f5d4] backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                  {activeStep.stage}
                </span>
              </div>

              {/* ── Columna derecha: información técnica ── */}
              <div className="flex flex-col justify-center gap-5 p-6 md:p-8 lg:p-10">
                {/* Encabezado: icono + paso + título */}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00f5d4] to-cyan-400 text-2xl shadow-[0_0_24px_rgba(0,245,212,0.4)]">
                    {activeStep.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#00f5d4]">
                      Paso {activeStep.id}
                    </p>
                    <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>

                {/* Subtítulo con gradiente */}
                <h4 className="text-lg font-semibold bg-gradient-to-r from-[#00f5d4] to-cyan-400 bg-clip-text text-transparent md:text-xl">
                  {activeStep.subtitle}
                </h4>

                {/* Descripción */}
                <p className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {activeStep.description}
                </p>

                {/* Badges de estado TRL */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00f5d4]/35 bg-[#00f5d4]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#00f5d4]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00f5d4]" />
                    {activeStep.trl}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    {activeStep.status}
                  </span>
                </div>

                {/* Parámetros técnicos */}
                {activeStep.specs && (
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {activeStep.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-xl border border-[#00f5d4]/12 bg-[#00f5d4]/[0.04] px-3.5 py-2.5"
                      >
                        <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-[#00f5d4]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Beneficios */}
                {activeStep.benefits && (
                  <ul className="space-y-2.5 border-t border-[#00f5d4]/12 pt-5">
                    {activeStep.benefits.map((benefit) => (
                      <li key={benefit.label} className="flex items-start gap-3">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f5d4]"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#5eead4]">{benefit.label}</p>
                          <p className="text-xs leading-[1.5] text-slate-400">{benefit.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
