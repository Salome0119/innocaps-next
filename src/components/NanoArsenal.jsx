'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import GlossaryTooltip from './GlossaryTooltip';

/* ═══════════════════════════════════════════
   DEVICE TIER (shared pattern)
   ═══════════════════════════════════════════ */
function getDeviceTier() {
  if (typeof window === 'undefined') return 'low';
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 2;
  if (isMobile || cores <= 4 || memory <= 4) return 'low';
  if (cores <= 8 && memory <= 8) return 'mid';
  return 'high';
}

const TIER = getDeviceTier();
const IS_LOW = TIER === 'low';

/* Intersection Observer hook — lazy-load Canvas */
function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const molecules = [
  {
    id: 'liposoma',
    name: 'LIPOSOMAS',
    tag: '01',
    headline: 'Biocompatibilidad Absoluta.',
    subtitle: 'La Mímica Biológica',
    description:
      'Vesículas esféricas compuestas por bicapas de fosfolípidos que imitan la membrana celular. La solución maestra para cargas duales.',
    specs: [
      { label: 'Núcleo', value: 'Acuoso (para activos hidrofílicos)' },
      { label: 'Bicapa', value: 'Lipídica (para activos hidrofóbicos)' },
      { label: 'Método', value: 'Hidratación de película lipídica' },
      {
        label: 'Ventaja Competitiva',
        value: 'Escalabilidad industrial probada con máxima absorción celular',
      },
    ],
    color: '#14b8a6',
    accent: '#5eead4',
    gradient: 'from-teal-500 to-cyan-500',
    bgGlow: 'teal',
    glossaryTerms: ['Fosfolípidos', 'Bicapa Lipídica', 'Hidratación de película lipídica'],
  },
  {
    id: 'niosoma',
    name: 'NIOSOMAS',
    tag: '02',
    headline: 'Estabilidad Oxidativa Superior.',
    subtitle: 'La Evolución Sintética',
    description:
      'Análogos a los liposomas pero construidos con tensioactivos no iónicos y colesterol. Diseñados para resistir donde los lípidos tradicionales fallan.',
    specs: [
      { label: 'Composición', value: 'Span 60 / Tween 60' },
      {
        label: 'Factor Económico',
        value: 'Materias primas de menor costo que los fosfolípidos',
      },
      { label: 'Resistencia', value: 'Menor sensibilidad a la oxidación química' },
    ],
    color: '#06b6d4',
    accent: '#67e8f9',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'cyan',
    glossaryTerms: ['Tensioactivos no iónicos'],
  },
  {
    id: 'sln',
    name: 'SLNs',
    tag: '03',
    headline: 'Matriz Sólida Cristalina.',
    subtitle: 'La Fortaleza',
    description:
      'Partículas submicrónicas (50-1000 nm) compuestas de lípidos que permanecen sólidos a temperatura corporal. Una "caja fuerte" molecular.',
    specs: [
      { label: 'Estructura', value: 'Matriz ordenada sin solventes orgánicos' },
      { label: 'Proceso', value: 'Homogeneización a Alta Presión en Caliente (HPH) a 500-1500 bar' },
      {
        label: 'Función',
        value: 'Liberación controlada sostenida y protección extrema contra degradación química',
      },
    ],
    color: '#8b5cf6',
    accent: '#c4b5fd',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'violet',
    glossaryTerms: ['HPH'],
    comparison: true,
  },
  {
    id: 'nlc',
    name: 'NLCs',
    tag: '04',
    headline: 'Imperfección Estratégica.',
    subtitle: 'La Carga Máxima',
    description:
      'Una matriz híbrida de lípidos sólidos y aceites líquidos. Creamos una estructura "desordenada" intencionalmente para evitar la expulsión del activo.',
    specs: [
      {
        label: 'Diferencial',
        value: 'Mayor capacidad de carga (High Payload) que las SLNs tradicionales',
      },
      {
        label: 'Estabilidad',
        value: 'Minimiza la expulsión del activo durante el almacenamiento prolongado',
      },
    ],
    color: '#f59e0b',
    accent: '#fcd34d',
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'amber',
    glossaryTerms: [],
    comparison: true,
  },
];

/* ═══════════════════════════════════════════
   3D SCENE HELPERS
   ═══════════════════════════════════════════ */
/* Particle counts scale with device tier */
const PARTICLE_SCALE = IS_LOW ? 0.3 : TIER === 'mid' ? 0.6 : 1;
const SPHERE_DETAIL = IS_LOW ? 24 : TIER === 'mid' ? 40 : 64;

function ParticleField({ positions, color, size = 0.02, opacity = 0.5 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // On low-end, use fewer positions
    const count = Math.floor(positions.length / 3 * PARTICLE_SCALE) * 3;
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions.slice(0, count), 3));
    return g;
  }, [positions]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function spherePoints(radius, count) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pts[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pts[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pts[i * 3 + 2] = radius * Math.cos(phi);
  }
  return pts;
}

function randomVolumePoints(radius, count) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pts[i * 3 + 2] = r * Math.cos(phi);
  }
  return pts;
}

function orderedLatticePoints(spacing, radius) {
  const pts = [];
  for (let x = -radius; x <= radius; x += spacing) {
    for (let y = -radius; y <= radius; y += spacing) {
      for (let z = -radius; z <= radius; z += spacing) {
        if (Math.sqrt(x * x + y * y + z * z) <= radius) {
          pts.push(x, y, z);
        }
      }
    }
  }
  return new Float32Array(pts);
}

/* ═══════════════════════════════════════════
   3D MOLECULE COMPONENTS
   ═══════════════════════════════════════════ */
function useMoleculeAnim(ref, active, decomposed, offsets) {
  const scale = useRef(0);
  const layers = useRef(offsets.map(() => 0));

  useFrame((_, delta) => {
    if (!ref.current) return;

    scale.current = THREE.MathUtils.lerp(scale.current, active ? 1 : 0, 0.07);
    ref.current.scale.setScalar(Math.max(scale.current, 0.001));
    ref.current.visible = scale.current > 0.01;

    if (active) ref.current.rotation.y += delta * 0.15;

    offsets.forEach((offset, i) => {
      const target = decomposed ? offset : 0;
      layers.current[i] = THREE.MathUtils.lerp(layers.current[i], target, 0.05);
      if (ref.current.children[i]) {
        ref.current.children[i].position.y = layers.current[i];
      }
    });
  });
}

/* Liposome — concentric spheres */
function LiposomeMesh({ active, decomposed }) {
  const group = useRef();
  useMoleculeAnim(group, active, decomposed, [2.0, 0.2, -1.6]);

  const surfacePts = useMemo(() => spherePoints(1.52, 400), []);
  const midPts = useMemo(() => spherePoints(1.12, 200), []);

  return (
    <group ref={group}>
      {/* --- outer bilayer shell --- */}
      <group>
        <mesh>
          <sphereGeometry args={[1.5, SPHERE_DETAIL, SPHERE_DETAIL]} />
          <meshPhysicalMaterial
            color="#14b8a6"
            transparent
            opacity={0.15}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0}
            side={THREE.DoubleSide}
            envMapIntensity={2}
          />
        </mesh>
        <ParticleField positions={surfacePts} color="#5eead4" size={0.018} opacity={0.7} />
      </group>

      {/* --- mid layer (wireframe) --- */}
      <group>
        <mesh>
          <sphereGeometry args={[1.1, Math.round(SPHERE_DETAIL * 0.75), Math.round(SPHERE_DETAIL * 0.75)]} />
          <meshBasicMaterial color="#0d9488" wireframe transparent opacity={0.08} />
        </mesh>
        <ParticleField positions={midPts} color="#99f6e4" size={0.012} opacity={0.4} />
      </group>

      {/* --- aqueous core --- */}
      <group>
        <mesh>
          <sphereGeometry args={[0.6, Math.round(SPHERE_DETAIL * 0.5), Math.round(SPHERE_DETAIL * 0.5)]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            roughness={0.15}
            metalness={0.3}
            clearcoat={0.8}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>
    </group>
  );
}

/* Niosome — dodecahedron shells */
function NiosomeMesh({ active, decomposed }) {
  const group = useRef();
  useMoleculeAnim(group, active, decomposed, [1.8, -1.4]);

  const surfacePts = useMemo(() => spherePoints(1.56, 300), []);

  return (
    <group ref={group}>
      {/* outer geometric shell */}
      <group>
        <mesh>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            transparent
            opacity={0.18}
            roughness={0.05}
            clearcoat={1}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>
        <mesh>
          <dodecahedronGeometry args={[1.53, 1]} />
          <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.12} />
        </mesh>
        <ParticleField positions={surfacePts} color="#67e8f9" size={0.02} opacity={0.6} />
      </group>

      {/* inner core */}
      <group>
        <mesh>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshPhysicalMaterial
            color="#0891b2"
            roughness={0.2}
            metalness={0.4}
            clearcoat={0.6}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

/* SLN — icosahedron with ordered lattice */
function SLNMesh({ active, decomposed }) {
  const group = useRef();
  useMoleculeAnim(group, active, decomposed, [1.8, -1.2]);

  const latticePts = useMemo(() => orderedLatticePoints(0.28, 0.85), []);

  return (
    <group ref={group}>
      {/* crystalline outer shell */}
      <group>
        <mesh>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            transparent
            opacity={0.22}
            roughness={0}
            metalness={0.6}
            clearcoat={1}
            flatShading
            envMapIntensity={2}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.0, 1]} />
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.15} />
        </mesh>
      </group>

      {/* ordered lattice core */}
      <group>
        <mesh>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color="#7c3aed"
            roughness={0.1}
            metalness={0.7}
            clearcoat={1}
            flatShading
          />
        </mesh>
        <ParticleField positions={latticePts} color="#c4b5fd" size={0.035} opacity={0.8} />
      </group>
    </group>
  );
}

/* NLC — organic blob with oil droplets */
function OilDroplets({ count, radius }) {
  const spheres = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius * 0.75;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        s: 0.06 + Math.random() * 0.1,
      });
    }
    return arr;
  }, [count, radius]);

  return (
    <>
      {spheres.map((d, i) => (
        <mesh key={i} position={d.pos}>
          <sphereGeometry args={[d.s, 10, 10]} />
          <meshPhysicalMaterial color="#f59e0b" roughness={0.2} metalness={0.2} clearcoat={0.5} />
        </mesh>
      ))}
    </>
  );
}

function NLCMesh({ active, decomposed }) {
  const group = useRef();
  useMoleculeAnim(group, active, decomposed, [1.6, -1.2]);

  const surfacePts = useMemo(() => spherePoints(1.44, 250), []);
  const volPts = useMemo(() => randomVolumePoints(1.0, 300), []);

  return (
    <group ref={group}>
      {/* irregular outer shell */}
      <group>
        <mesh>
          <sphereGeometry args={[1.4, 20, 20]} />
          <meshPhysicalMaterial
            color="#f59e0b"
            transparent
            opacity={0.18}
            roughness={0.1}
            metalness={0.3}
            clearcoat={1}
            envMapIntensity={1.5}
          />
        </mesh>
        <ParticleField positions={surfacePts} color="#fcd34d" size={0.02} opacity={0.5} />
      </group>

      {/* disordered interior */}
      <group>
        <OilDroplets count={14} radius={1.0} />
        <ParticleField positions={volPts} color="#fcd34d" size={0.025} opacity={0.4} />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════
   AMBIENT PARTICLES
   ═══════════════════════════════════════════ */
function AmbientParticles() {
  const ref = useRef();
  const count = IS_LOW ? 100 : TIER === 'mid' ? 300 : 600;
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 12;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <group ref={ref}>
      <ParticleField positions={positions} color="#14b8a6" size={0.012} opacity={0.3} />
    </group>
  );
}

/* ═══════════════════════════════════════════
   COMPLETE 3D SCENE
   ═══════════════════════════════════════════ */
const MoleculeComponents = [LiposomeMesh, NiosomeMesh, SLNMesh, NLCMesh];

function MoleculeScene({ activeIndex, decomposed }) {
  /* Only mount the ACTIVE molecule — saves 75% GPU work */
  const ActiveMolecule = MoleculeComponents[activeIndex];

  return (
    <>
      {IS_LOW ? (
        /* Low-end: 2 lights only */
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 4, 4]} intensity={1.2} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} />
          <pointLight position={[-4, -2, 4]} intensity={0.5} color="#14b8a6" />
          <pointLight position={[4, 3, -3]} intensity={0.35} color="#8b5cf6" />
        </>
      )}

      <Float
        speed={IS_LOW ? 0 : 1.2}
        rotationIntensity={IS_LOW ? 0 : 0.12}
        floatIntensity={IS_LOW ? 0 : 0.25}
      >
        <ActiveMolecule active decomposed={decomposed} />
      </Float>

      {!IS_LOW && <AmbientParticles />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      {!IS_LOW && <Environment preset="night" />}
    </>
  );
}

/* ═══════════════════════════════════════════
   SLN vs NLC COMPARISON (Developer Note 1)
   ═══════════════════════════════════════════ */
function MatrixComparison({ visible }) {
  const orderedDots = useMemo(() => {
    const dots = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        dots.push({ x: c * 14 + 4, y: r * 14 + 4 });
      }
    }
    return dots;
  }, []);

  const disorderedDots = useMemo(() => {
    const dots = [];
    for (let i = 0; i < 45; i++) {
      dots.push({
        x: Math.random() * 90 + 4,
        y: Math.random() * 62 + 4,
        size: 3 + Math.random() * 5,
      });
    }
    return dots;
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="mt-6 overflow-hidden"
        >
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-3">
            Comparativa de Matrices
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* SLN - Ordered */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-xs font-bold text-violet-400 mb-2">SLN — Matriz Ordenada</p>
              <svg viewBox="0 0 100 74" className="w-full h-auto">
                {orderedDots.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={4} fill="#8b5cf6" opacity={0.6} />
                ))}
              </svg>
              <p className="text-[10px] text-slate-500 mt-2">
                Estructura cristalina con menor capacidad de carga
              </p>
            </div>

            {/* NLC - Disordered */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-bold text-amber-400 mb-2">NLC — Matriz Imperfecta</p>
              <svg viewBox="0 0 100 74" className="w-full h-auto">
                {disorderedDots.map((d, i) => (
                  <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.size || 4}
                    fill="#f59e0b"
                    opacity={0.5}
                  />
                ))}
              </svg>
              <p className="text-[10px] text-slate-500 mt-2">
                Desorden intencional = mayor capacidad de carga
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */
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

const panelVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.45, ease: 'easeInOut' },
};

/* ═══════════════════════════════════════════
   MAIN EXPORT — NanoArsenal
   ═══════════════════════════════════════════ */
export default function NanoArsenal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [decomposed, setDecomposed] = useState(false);
  const mol = molecules[activeIndex];

  /* Lazy-load the 3D Canvas when section enters viewport */
  const canvasWrapRef = useRef(null);
  const canvasReady = useInView(canvasWrapRef, '300px');

  const handleNav = (i) => {
    if (i === activeIndex) return;
    setActiveIndex(i);
    setDecomposed(false);
  };

  return (
    <section className="relative bg-slate-950 py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/[0.06] rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section heading */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase text-teal-400 border border-teal-500/20 rounded-full bg-teal-500/5 mb-6">
            Bloque 1 — Interactivo 3D
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            El Arsenal{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
              Nanométrico
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Rota, explora y descompone cada molécula para descubrir su arquitectura interna.
          </p>
        </motion.div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-[560px]">
          {/* ── 3D CANVAS ── */}
          <motion.div {...stagger(0.1)} className="relative h-[420px] sm:h-[500px] lg:h-[580px]" ref={canvasWrapRef}>
            <div className="absolute inset-0 rounded-3xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
              {canvasReady ? (
                <Canvas
                  camera={{ position: [0, 0, 4.5], fov: 45 }}
                  dpr={IS_LOW ? [1, 1] : TIER === 'mid' ? [1, 1.5] : [1, 2]}
                  gl={{
                    alpha: true,
                    antialias: !IS_LOW,
                    powerPreference: 'high-performance',
                    stencil: false,
                  }}
                  style={{ background: 'transparent' }}
                >
                  <MoleculeScene activeIndex={activeIndex} decomposed={decomposed} />
                </Canvas>
              ) : (
                /* Placeholder while Canvas lazy-loads */
                <div className="flex items-center justify-center h-full">
                  <span className="text-[10px] font-mono text-slate-600 tracking-[0.25em] uppercase">cargando escena 3d</span>
                </div>
              )}

              {/* Decompose button */}
              <button
                onClick={() => setDecomposed((d) => !d)}
                className={`absolute bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl border transition-all duration-300 ${
                  decomposed
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                    : 'bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500/20'
                }`}
              >
                {decomposed ? 'Recomponer' : 'Descomponer Capas'}
              </button>

              {/* Molecule number badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span
                  className="text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border"
                  style={{
                    color: mol.accent,
                    borderColor: mol.color + '30',
                    backgroundColor: mol.color + '10',
                  }}
                >
                  {mol.tag} / 04
                </span>
              </div>

              {/* Rotate hint */}
              <div className="absolute top-5 right-5 text-[10px] text-slate-600 font-mono tracking-wider">
                DRAG TO ROTATE
              </div>
            </div>
          </motion.div>

          {/* ── INFO PANEL ── */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={mol.id}
                {...panelVariants}
                className="space-y-6"
              >
                {/* Subtitle tag */}
                <span
                  className={`inline-block px-3 py-1 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full border`}
                  style={{
                    color: mol.accent,
                    borderColor: mol.color + '30',
                    backgroundColor: mol.color + '08',
                  }}
                >
                  {mol.subtitle}
                </span>

                {/* Name */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {mol.name}
                </h3>

                {/* Headline */}
                <p
                  className={`text-lg font-semibold bg-gradient-to-r ${mol.gradient} bg-clip-text text-transparent`}
                >
                  {mol.headline}
                </p>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed">{mol.description}</p>

                {/* Tech Specs */}
                <div className="space-y-0 rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800/60">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500">
                      Tech Specs — Data Overlay
                    </p>
                  </div>
                  {mol.specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 ${
                        i < mol.specs.length - 1 ? 'border-b border-slate-800/40' : ''
                      }`}
                    >
                      <span
                        className="text-xs font-mono font-bold tracking-wide shrink-0 sm:w-32"
                        style={{ color: mol.accent }}
                      >
                        {spec.label}
                      </span>
                      <span className="text-sm text-slate-400">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* SLN vs NLC comparison (Dev Note 1) */}
                <MatrixComparison visible={mol.comparison || false} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="flex items-center gap-3 mt-10">
              {molecules.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => handleNav(i)}
                  className="group relative flex items-center gap-2"
                >
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-10' : 'w-2.5 group-hover:w-5'
                    }`}
                    style={{
                      backgroundColor:
                        i === activeIndex ? m.color : 'rgb(51, 65, 85)',
                    }}
                  />
                  {i === activeIndex && (
                    <span
                      className="text-[10px] font-mono font-bold tracking-wider"
                      style={{ color: m.accent }}
                    >
                      {m.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
