'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 2 — MODELO LAB + BIO (Fusión interactiva)
   Núcleo central Glass & Neon Nexus — diseño glassmorphic/futurista
   ═══════════════════════════════════════════════════════════════════ */

const LAB_SIDE = {
  id: 'lab',
  label: 'InnoCaps Lab',
  subtitle: 'Investigación',
  icon: '🔬',
  color: 'cyan',
  descripcion: 'Es el corazón científico y creativo. Aquí investigamos, diseñamos y validamos sistemas de encapsulación. Generamos evidencia experimental, optimizamos formulaciones y construimos el soporte técnico que respalda cada desarrollo.',
  capacidades: [
    'Formulación y caracterización de nano/microcápsulas',
    'Escalado piloto (10–500 L) en biorreactores',
    'Licenciamiento y transferencia tecnológica',
  ],
};

const BIO_SIDE = {
  id: 'bio',
  label: 'InnoCaps Bio',
  subtitle: 'Industrial',
  icon: '🏭',
  color: 'emerald',
  descripcion: 'Es la conexión con la industria. Transformamos el desarrollo de laboratorio en procesos escalables, robustos y reproducibles. Integramos ingeniería de proceso, control de calidad y acompañamiento en transferencia tecnológica para llevar el producto a nivel industrial.',
  capacidades: [
    'Producción industrial (>5000 L) con trazabilidad por lote',
    'Estandarización y certificación (CoA por lote)',
    'Suministro B2B: saco, cuñete, IBC/granel',
  ],
};

function SidePanel({ side, isActive, onClick }) {
  const glowColor = side.color === 'cyan' ? 'rgba(0, 255, 255,' : 'rgba(16, 185, 129,';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: side.id === 'lab' ? -40 : 40 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex-1 min-w-0 p-6 md:p-8 relative ${isActive ? 'z-20' : 'z-10'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
    >
      <div className={`relative rounded-3xl border p-6 md:p-8 h-full transition-all duration-500 group cursor-pointer ${isActive
          ? `border-${side.color}-400/50 bg-gradient-to-br from-${side.color}-500/10 to-transparent shadow-[0_0_30px_${glowColor}0.3)]`
          : 'border-slate-800/50 bg-slate-900/50 hover:border-cyan-400/30 hover:bg-cyan-500/5'
      }`}>
        <div className="flex items-start gap-4 mb-6">
          <motion.div
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
              isActive ? `bg-${side.color}-500/20 border-${side.color}-400/40` : 'bg-slate-800/50 border-slate-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30'
            }`}>
            {side.icon}
          </motion.div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400/70 mb-1">{side.subtitle}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">{side.label}</h3>
          </div>
        </div>

        <p className="text-slate-300 text-base leading-relaxed mb-6">{side.descripcion}</p>

        <div className="border-t border-slate-800/50 pt-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400/70 mb-3">Capacidades clave</p>
          <ul className="space-y-2">
            {side.capacidades.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-${side.color}-400`} />
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function CentralNode({ activeSide, isHovered }) {
  const pulseColor = activeSide === 'lab' ? 'cyan' : activeSide === 'bio' ? 'emerald' : 'cyan';
  const glowRgba = pulseColor === 'cyan' ? '0, 245, 212' : '16, 185, 129';
  const cyanRgba = '0, 245, 212';
  
  return (
    <motion.div
      className={`
        relative flex-shrink-0 w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36
        flex items-center justify-center
        rounded-full
        bg-[#030d14]/70 backdrop-blur-md
        border border-[#00f5d4]/30
        shadow-[0_0_30px_rgba(0,245,212,0.25)]
        transition-all duration-300 ease-out
        ${isHovered 
          ? 'shadow-[0_0_45px_rgba(0,245,212,0.5)] border-[#00f5d4]/70' 
          : ''
        }
        ${activeSide ? 'ring-1 ring-inset' : ''}
        ${activeSide === 'lab' ? 'ring-[#00f5d4]/40' : activeSide === 'bio' ? 'ring-[#10b981]/40' : 'ring-[#00f5d4]/20'}
      `}
      animate={{
        scale: isHovered ? 1.03 : 1,
        boxShadow: isHovered 
          ? `0 0 45px rgba(${cyanRgba}, 0.5), 0 0 80px rgba(${cyanRgba}, 0.2)`
          : activeSide
            ? `0 0 30px rgba(${glowRgba}, 0.4), 0 0 60px rgba(${glowRgba}, 0.15)`
            : `0 0 30px rgba(${cyanRgba}, 0.25), 0 0 50px rgba(${cyanRgba}, 0.1)`,
      }}
      transition={{ duration: isHovered ? 0.2 : 2, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' }}
      style={{ willChange: 'transform, box-shadow, border-color' }}
      role="img"
      aria-label={`Núcleo de integración ${activeSide === 'lab' ? 'Lab' : activeSide === 'bio' ? 'Bio' : 'neutro'}`}
    >
      {/* Anillo externo concéntrico tenue */}
      <div className="absolute inset-[-2px] rounded-full border border-[#00f5d4]/10 opacity-50" aria-hidden="true" />
      
      {/* Anillo interno sutil */}
      <div className="absolute inset-[4px] rounded-full border border-[#00f5d4]/10 opacity-30" aria-hidden="true" />
      
      {/* Halo de resplandor suave detrás del icono */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-r from-[#00f5d4]/20 via-transparent to-[#10b981]/20
        blur-2xl opacity-60
        ${activeSide === 'lab' ? 'from-[#00f5d4]/30 to-transparent' : activeSide === 'bio' ? 'from-transparent via-[#10b981]/30 to-transparent' : ''}
      `} aria-hidden="true" />
      
      {/* Núcleo central glassmorphic con icono */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Isotipo InnoCaps (logo.svg) en tono cian brillante */}
        <img
          src="/logo.svg"
          alt="InnoCaps"
          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-[#00f5d4] drop-shadow-[0_0_15px_rgba(0,245,212,0.6)] transition-all duration-300"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(0,245,212,0.6)) brightness(1.2)'
          }}
          aria-hidden="true"
        />
        
        {/* Pulso interno sutil cuando está activo */}
        {activeSide && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00f5d4]/10 to-transparent opacity-50 blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Etiqueta dinámica de modo (solo cuando hay side activo) */}
      <AnimatePresence mode="wait">
        {activeSide && (
          <motion.div
            key={activeSide}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className={`
              px-4 py-1.5 rounded-full text-xs font-mono tracking-wider
              bg-[#030d14]/80 backdrop-blur-md border
              ${activeSide === 'lab' 
                ? 'border-[#00f5d4]/50 text-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.3)]' 
                : 'border-[#10b981]/50 text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              }
            `}>
              {activeSide === 'lab' ? 'Modo Lab' : 'Modo Bio'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConnectorLines({ activeSide }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Línea conectora izquierda (Lab) */}
      <div className={`
        absolute left-0 right-1/2 top-1/2 h-[1px] -translate-y-1/2
        bg-gradient-to-r from-transparent via-[#00f5d4]/20 to-[#00f5d4]/40
        opacity-60 transition-opacity duration-500
        ${activeSide === 'lab' ? 'opacity-100' : ''}
      `} />
      
      {/* Línea conectora derecha (Bio) */}
      <div className={`
        absolute right-0 left-1/2 top-1/2 h-[1px] -translate-y-1/2
        bg-gradient-to-l from-transparent via-[#10b981]/20 to-[#10b981]/40
        opacity-60 transition-opacity duration-500
        ${activeSide === 'bio' ? 'opacity-100' : ''}
      `} />
      
      {/* Gradiente central de fusión */}
      <div className={`
        absolute left-1/2 top-1/2 w-[2px] h-full -translate-x-1/2 -translate-y-1/2
        bg-gradient-to-b from-[#00f5d4]/30 via-transparent to-[#10b981]/30
        opacity-40
      `} />
      
      {/* Partículas de conexión animadas cuando hay side activo */}
      {(activeSide === 'lab' || activeSide === 'bio') && (
        <>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={`particle-lab-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#00f5d4]/70 blur-sm"
              style={{
                left: activeSide === 'lab' ? '10%' : '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                x: activeSide === 'lab' ? ['0%', '80%', '0%'] : ['0%', '-20%', '0%'],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
          ))}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={`particle-bio-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#10b981]/70 blur-sm"
              style={{
                right: activeSide === 'bio' ? '10%' : '50%',
                top: '50%',
                transform: 'translate(50%, -50%)',
              }}
              animate={{
                x: activeSide === 'bio' ? ['0%', '-80%', '0%'] : ['0%', '20%', '0%'],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3 + 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-hidden="true"
            />
          ))}
        </>
      )}
    </div>
  );
}

export default function LabBioFusion() {
  const [activeSide, setActiveSide] = useState(null);
  const [centralHovered, setCentralHovered] = useState(false);
  const centralRef = useRef(null);
  
  // Detectar hover en el área central completa
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!centralRef.current) return;
      const rect = centralRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const radius = rect.width / 2 + 40; // área de detección extendida
      setCentralHovered(distance < radius);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="lab-bio-fusion" role="tabpanel" aria-label="Modelo Lab + Bio">
      {/* ── Encabezado ── */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Nuestro Modelo: <span className="txt-grad font-semibold">Lab + Bio</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Dos unidades, una ciencia continua. El laboratorio crea, la industria escala.
        </p>
      </div>

      {/* ── Fusión interactiva ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start relative">
        {/* ── Lado Lab ── */}
        <SidePanel
          side={LAB_SIDE}
          isActive={activeSide === 'lab'}
          onClick={() => setActiveSide(activeSide === 'lab' ? null : 'lab')}
        />

        {/* ── Nodo central + Conectores ── */}
        <div 
          ref={centralRef}
          className="relative flex items-center justify-center min-h-[280px] lg:min-h-[360px] z-10"
          onMouseEnter={() => setCentralHovered(true)}
          onMouseLeave={() => setCentralHovered(false)}
        >
          <ConnectorLines activeSide={activeSide} />
          <CentralNode activeSide={activeSide} isHovered={centralHovered} />
          
          {/* Instrucción sutil rediseñada - solo visible en estado neutro */}
          <AnimatePresence mode="wait">
            {!activeSide && (
              <motion.p
                key="instruction"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500/50 pointer-events-none max-w-xs"
              >
                Hover o click en cada lado para activar
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── Lado Bio ── */}
        <SidePanel
          side={BIO_SIDE}
          isActive={activeSide === 'bio'}
          onClick={() => setActiveSide(activeSide === 'bio' ? null : 'bio')}
        />
      </div>

      {/* ── Mensaje de integración ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 md:mt-16 text-center"
      >
        <p className="text-cyan-400 font-bold text-lg md:text-xl mb-2">
          Lab crea. Bio escala.
        </p>
        <p className="text-slate-400 text-base md:text-lg">
          Juntos convertimos ciencia en producto.
        </p>
      </motion.div>
    </div>
  );
}