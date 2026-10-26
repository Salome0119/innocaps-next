'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import OrganicNucleus from './OrganicNucleus';
import NanoCapsule from './NanoCapsule';

/* ═══════════════════════════════════════════
   SECTION 2 — THE 4 PILLARS OF IMPACT
   Interactive ecosystem selector with central
   3D organic shape that morphs per industry
   ═══════════════════════════════════════════ */

/* ── animation helpers ── */
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

/* ── Content data ── */
const pillars = [
  {
    id: 'animal',
    tag: '01',
    label: 'Nutrición Animal',
    shortLabel: 'Animal',
    headline: 'Menos Antibióticos, Más Rendimiento.',
    effectNote: 'El núcleo se transforma en una estructura celular robusta.',
    problem:
      'La industria necesita reducir la carga química y evitar el descarte de animales por enfermedad.',
    solutions: [
      {
        title: 'Reemplazo de Antibióticos',
        detail:
          'Uso de Péptidos Bioactivos y Probióticos (Bacillus spp.) encapsulados para resistir el tránsito gástrico y colonizar el intestino eficazmente.',
      },
      {
        title: 'Optimización Enzimática',
        detail:
          'Fitasas y Xilanasas protegidas que hidrolizan macronutrientes para una conversión alimenticia superior.',
      },
      {
        title: 'Inmuno-Nutrición',
        detail:
          'Ácidos grasos Omega-3 (EPA/DHA) para modular la inflamación y mejorar la fertilidad.',
      },
    ],
    color: '#f97316',
    accent: '#fb923c',
    gradient: 'from-orange-500 to-amber-500',
    bgGlow: 'orange',
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z',
    // Simple paw-like SVG
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 21c-1.5-1.5-6-5.5-6-10A6 6 0 0 1 18 11c0 4.5-4.5 8.5-6 10z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: 'cosmetic',
    tag: '02',
    label: 'Cosmética & Dermofarmacia',
    shortLabel: 'Cosmética',
    headline: 'Biohacking Celular y Anti-Aging.',
    effectNote: 'El núcleo se vuelve líquido, brillante, viscoso (textura de serum).',
    problem: null,
    solutions: [
      {
        title: 'Retinol Sin Irritación',
        detail:
          'Vitamina A sintetizada y encapsulada para liberar su poder anti-aging sin los efectos secundarios clásicos (rojeces).',
      },
      {
        title: 'La Alternativa Natural',
        detail:
          'Bakuchiol (extraído de Psoralea corylifolia) para un efecto "Retinol-like" en cosmética verde.',
      },
      {
        title: 'Arquitectura de la Piel',
        detail:
          'Péptidos biomiméticos y Ceramidas que restauran físicamente la barrera cutánea y estimulan el colágeno desde adentro.',
      },
    ],
    color: '#c084fc',
    accent: '#e879f9',
    gradient: 'from-purple-400 to-pink-500',
    bgGlow: 'purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l2-2M17 19l2-2" />
      </svg>
    ),
  },
  {
    id: 'human',
    tag: '03',
    label: 'Salud Humana',
    shortLabel: 'Humana',
    headline: 'Biodisponibilidad de Precisión.',
    effectNote: 'Cápsula tri-compartimentada de biodisponibilidad con mitocondria, matriz prebiótica y anticuerpos iluminados.',
    problem: null,
    solutions: [
      {
        title: 'Metabolismo Energético',
        detail:
          'Coenzima Q10 (Ubiquinona-10) altamente lipofílica, hecha soluble para potenciar la producción de ATP mitocondrial.',
      },
      {
        title: 'Salud Intestinal',
        detail:
          'Fibra prebiótica (Inulina, FOS, GOS) que estimula selectivamente la microbiota beneficiosa.',
      },
      {
        title: 'Terapias Avanzadas',
        detail:
          'Anticuerpos Monoclonales (mAbs) y Semaglutida (análogo de GLP-1) para el manejo de enfermedades crónicas como diabetes y obesidad.',
      },
    ],
    color: '#14b8a6',
    accent: '#5eead4',
    gradient: 'from-teal-500 to-cyan-500',
    bgGlow: 'teal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: 'agro',
    tag: '04',
    label: 'Agroindustria & Bioinsumos',
    shortLabel: 'Agro',
    headline: 'Renacimiento del Suelo.',
    effectNote: 'Raíces digitales creciendo y partículas de tierra flotando.',
    problem: null,
    solutions: [
      {
        title: 'Biofertilizantes Vivos',
        detail:
          'Insumos biológicos encapsulados que sobreviven al almacenamiento y se activan solo al contacto con el suelo.',
      },
      {
        title: 'Estrategia "Cero Residuos"',
        detail:
          'Transformamos subproductos de fermentación en bioactivos funcionales, cerrando el ciclo productivo.',
      },
    ],
    color: '#22c55e',
    accent: '#86efac',
    gradient: 'from-green-500 to-lime-500',
    bgGlow: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M7 20h10M12 20V10M17 5c-2.5 0-5 2-5 5 0-3-2.5-5-5-5" />
        <path d="M12 10c0-3 2.5-5 5-5M12 10c0-3-2.5-5-5-5" />
      </svg>
    ),
  },
];

/* ── Ambient floating particles for canvas ── */
function FloatingParticles({ color }) {
  const ref = useRef();
  const positions = useRef(
    new Float32Array(
      Array.from({ length: 300 }, () => [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]).flat()
    )
  ).current;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={100}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color || '#14b8a6'} size={0.015} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── 3D Scene wrapper ── */
function NucleusScene({ activePreset }) {
  const pillar = pillars.find((p) => p.id === activePreset) || pillars[2];
  const isHuman = activePreset === 'human';
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-4, -2, 4]} intensity={0.4} color={pillar.color} />
      <pointLight position={[3, 4, -3]} intensity={0.3} color={pillar.accent} />

      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.3}>
        {isHuman ? (
          <NanoCapsule />
        ) : (
          <OrganicNucleus activePreset={activePreset} />
        )}
      </Float>

      <FloatingParticles color={pillar.color} />
      <Environment preset="night" />

      {isHuman && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={(4 * Math.PI) / 5}
          rotateSpeed={0.55}
        />
      )}
    </>
  );
}

/* ── Panel transition variants ── */
const panelVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.45, ease: 'easeInOut' },
};

/* ═══════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════ */
export default function SolutionsPillars() {
  const [activeIndex, setActiveIndex] = useState(2); // default: human
  const sectionRef = useRef(null);
  const active = pillars[activeIndex];

  const handleSelect = useCallback((i) => {
    if (i !== activeIndex) setActiveIndex(i);
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="ecosistema"
      className="relative bg-slate-950 py-24 lg:py-32 overflow-hidden scroll-mt-24"
    >
      {/* ── Background glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          key={active.id + '-glow'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: active.color + '08' }}
        />
      </div>

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.4) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section header ── */}
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-teal-400 border border-teal-500/20 rounded-full bg-teal-500/5 mb-6">
            Los 4 Pilares de Impacto
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
              Ecosistema
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Selecciona una industria y observa cómo el núcleo muta en tiempo real.
          </p>
        </motion.div>

        {/* ── Industry selector tabs ── */}
        <motion.div {...stagger(0.15)} className="flex flex-wrap justify-center gap-3 mb-12">
          {pillars.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(i)}
                className={`group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 border ${
                  isActive
                    ? 'border-opacity-50 bg-opacity-15 text-white'
                    : 'border-slate-800/50 bg-slate-900/30 text-slate-500 hover:text-slate-300 hover:border-slate-700/60 hover:bg-slate-900/50'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: p.color + '50',
                        backgroundColor: p.color + '12',
                        color: p.accent,
                      }
                    : undefined
                }
              >
                {/* Icon */}
                <span
                  className="flex-shrink-0"
                  style={isActive ? { color: p.accent } : undefined}
                >
                  {p.icon}
                </span>
                <span className="hidden sm:inline">{p.label}</span>
                <span className="sm:hidden">{p.shortLabel}</span>

                {/* active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="pillar-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Main content: 3D + Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[540px]">
          {/* ── 3D Canvas ── */}
          <motion.div {...stagger(0.2)} className="relative h-[400px] sm:h-[480px] lg:h-[560px] order-1 lg:order-1">
            <div className="absolute inset-0 rounded-3xl border border-slate-800/40 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 42 }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
              >
                <Suspense fallback={null}>
                  <NucleusScene activePreset={active.id} />
                </Suspense>
              </Canvas>

              {/* Overlay effect note */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + '-note'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-5 left-5 right-5"
                >
                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed bg-slate-950/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-slate-800/30">
                    <span className="text-slate-400 mr-1">FX:</span> {active.effectNote}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Index tag */}
              <div className="absolute top-5 left-5">
                <span
                  className="text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border"
                  style={{
                    color: active.accent,
                    borderColor: active.color + '30',
                    backgroundColor: active.color + '10',
                  }}
                >
                  {active.tag} / 04
                </span>
              </div>

              {/* Drag hint */}
              <div className="absolute top-5 right-5 text-[10px] text-slate-600 font-mono tracking-wider">
                DRAG TO ROTATE
              </div>
            </div>
          </motion.div>

          {/* ── Info Panel ── */}
          <div className="order-2 lg:order-2 relative min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                {...panelVariants}
                className="space-y-6"
              >
                {/* Tag + Label */}
                <span
                  className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full border"
                  style={{
                    color: active.accent,
                    borderColor: active.color + '30',
                    backgroundColor: active.color + '08',
                  }}
                >
                  {active.label}
                </span>

                {/* Headline */}
                <h3
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r ${active.gradient} bg-clip-text text-transparent`}
                >
                  {active.headline}
                </h3>

                {/* Problem context (only animal has it explicit) */}
                {active.problem && (
                  <div className="rounded-xl border border-slate-800/40 bg-slate-900/30 p-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">
                      El Problema
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">{active.problem}</p>
                  </div>
                )}

                {/* Solutions */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">
                    Nuestra Solución
                  </p>
                  <div className="space-y-4">
                    {active.solutions.map((sol, si) => (
                      <motion.div
                        key={sol.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + si * 0.1 }}
                        className="group/sol flex items-start gap-4"
                      >
                        {/* Dot */}
                        <div
                          className="mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2"
                          style={{
                            backgroundColor: active.color + '30',
                            ringColor: active.color + '40',
                            borderColor: active.color,
                          }}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: active.color }}
                          />
                        </div>

                        <div>
                          <p className="text-white font-semibold text-sm mb-1">{sol.title}</p>
                          <p className="text-slate-500 text-sm leading-relaxed">{sol.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="container mx-auto px-6 mt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>
    </section>
  );
}
