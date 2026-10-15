'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, memo } from 'react';
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

        {/* ── MOBILE: Vertical timeline with full cards ── */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/60 via-cyan-500/40 to-blue-500/20" />

            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Timeline node */}
                  <div className="absolute left-3 top-5 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
                    <span className="text-slate-900 text-xs font-bold">{step.id}</span>
                  </div>

                  {/* Card */}
                  <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-5 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <p className="text-[10px] text-teal-400 font-bold tracking-widest uppercase">Paso {step.id}</p>
                        <h3 className="text-lg font-bold text-white leading-tight">{step.title}</h3>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <h4 className="text-sm font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                      {step.subtitle}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-[1.6]">{step.description}</p>

                    {/* Benefits */}
                    {step.benefits && (
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {step.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2.5 bg-slate-800/50 rounded-xl p-3">
                            <div className="w-1.5 h-1.5 mt-1.5 bg-teal-400 rounded-full flex-shrink-0" />
                            <div>
                              <p className="text-teal-300 font-semibold text-xs">{benefit.label}</p>
                              <p className="text-slate-400 text-xs leading-[1.5]">{benefit.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP: Original accordion ── */}
        <div className="hidden md:block">
          <>
            {/* Tabs de navegación */}
            <div className="flex justify-center gap-4 mb-16">
              {processSteps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveIndex(index)}
                  className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 shadow-lg shadow-teal-500/50'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{step.icon}</span>
                    <span className="hidden md:inline">{step.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Acordeón horizontal de 3 columnas */}
            <div className="flex flex-col md:flex-row gap-4 md:h-auto lg:h-[700px]">
              {processSteps.map((step, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <motion.div
                    key={step.id}
                    initial={false}
                    animate={{ flex: isActive ? 2 : 0.5 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className={`relative cursor-pointer overflow-hidden rounded-3xl ${
                      isActive ? 'min-h-[550px] md:min-h-[600px] lg:min-h-0' : 'min-h-[80px] md:min-h-0'
                    }`}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className={`relative w-full h-full border-2 rounded-3xl transition-all duration-300 ${
                      isActive 
                        ? 'border-teal-500/50 shadow-2xl shadow-teal-500/20' 
                        : 'border-slate-700/50 hover:border-slate-600'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-sm" />
                      
                      {isActive ? (
                        <div className="absolute inset-0 flex flex-col lg:flex-row items-center gap-4 lg:gap-8 p-5 lg:p-8">
                          <motion.div 
                            className="w-full lg:w-2/5 h-[40%] lg:h-full flex items-center justify-center shrink-0"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <VisualState state={getStateForIndex(index)} />
                          </motion.div>
                          <motion.div 
                            className="w-full lg:flex-1 h-[60%] lg:h-full flex flex-col justify-start lg:justify-center space-y-3 lg:space-y-6 pr-0 lg:pr-4 overflow-y-auto"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl shadow-lg shadow-teal-500/40">
                                {step.icon}
                              </div>
                              <div>
                                <p className="text-xs text-teal-400 font-bold tracking-widest uppercase mb-1">Paso {step.id}</p>
                                <h3 className="text-xl lg:text-3xl font-bold text-white">{step.title}</h3>
                              </div>
                            </div>
                            <h4 className="text-lg lg:text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{step.subtitle}</h4>
                            <p className="text-sm lg:text-base text-slate-300 leading-relaxed">{step.description}</p>
                            {step.benefits && (
                              <div className="space-y-3 pt-2">
                                {step.benefits.map((benefit, i) => (
                                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 bg-teal-400 rounded-full flex-shrink-0" />
                                    <div>
                                      <p className="text-teal-300 font-semibold text-sm">{benefit.label}</p>
                                      <p className="text-slate-400 text-xs">{benefit.detail}</p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg">{step.icon}</div>
                          <h3 className="text-2xl font-bold text-white text-center mb-2" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{step.title}</h3>
                          <p className="text-sm text-teal-400 font-semibold tracking-wider uppercase">Paso {step.id}</p>
                        </div>
                      )}

                      {isActive && (
                        <motion.div layoutId="activeIndicator" className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        </div>
      </div>
    </section>
  );
}
