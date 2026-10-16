'use client';

import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Float, Center, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   Detección de capacidad del dispositivo
  ═══════════════════════════════════════════════════════════════ */
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

const MODEL_PATHS = {
  low:  '/micela-mobile.glb',
  mid:  '/micela-optimized.glb',
  high: '/micela-optimized.glb',
};

const DEVICE_TIER = getDeviceTier();
const MODEL_PATH  = MODEL_PATHS[DEVICE_TIER];

/* ═══════════════════════════════════════════════════════════════
   Modelo 3D con mejora estética de materiales
  ═══════════════════════════════════════════════════════════════ */
function Model({ onLoaded }) {
  const ref = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  // Recorremos la escena al cargar para mejorar los materiales automáticamente
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Transformamos el material a un estilo físico translúcido/biotecnológico
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#06b6d4'),          // Tono Cyan InnoCaps
          emissive: new THREE.Color('#0f766e'),     // Tono Teal sutil interno
          emissiveIntensity: 0.15,
          roughness: 0.15,                          // Superficie muy pulida
          metalness: 0.2,                           // Leve toque metálico
          transmission: DEVICE_TIER === 'low' ? 0 : 0.6, // Efecto vidrio/cristal (desactivado en low para rendimiento)
          thickness: 1.2,                           // Profundidad de refracción
          clearcoat: 1.0,                           // Brillo exterior tipo cubierta médica
          clearcoatRoughness: 0.1,
          transparent: true,
          opacity: 0.95,
        });
      }
    });
    onLoaded?.();
  }, [scene, onLoaded]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

/* ═══════════════════════════════════════════════════════════════
   Iluminación profesional y ambiental
  ═══════════════════════════════════════════════════════════════ */
function AdaptiveLights() {
  if (DEVICE_TIER === 'low') {
    return (
      <>
        <ambientLight intensity={3} />
        <directionalLight position={[3, 3, 4]} intensity={3} color="#ffffff" />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      {/* Luz de acento Cyan corporativa */}
      <pointLight position={[-5, -5, -5]} intensity={4} color="#2dd4bf" distance={30} />
      {/* Luz de contra Violeta/Teal para profundidad */}
      <spotLight position={[5, 5, -5]} intensity={3} color="#14b8a6" angle={0.5} />
      {/* Entorno preconfigurado para reflejos realistas sobre los materiales */}
      <Environment preset="city" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Loader overlay
  ═══════════════════════════════════════════════════════════════ */
function LoaderOverlay({ progress, visible }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <span
        className="font-mono font-extralight tabular-nums leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          color: '#2dd4bf',
          letterSpacing: '-0.02em',
        }}
      >
        {progress}%
      </span>

      <div className="w-24 h-px mt-3 rounded-full overflow-hidden" style={{ background: 'rgba(45,212,191,0.15)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: '#2dd4bf',
          }}
        />
      </div>

      <span
        className="mt-2.5 text-[10px] font-mono tracking-[0.25em] uppercase"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        cargando
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Componente principal — Canvas adaptativo
  ═══════════════════════════════════════════════════════════════ */
export default function ModelViewer() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hiding, setHiding] = useState(false);

  const canvasConfig = useMemo(() => ({
    dpr: DEVICE_TIER === 'low' ? [1, 1] : [1, 1.5],
    antialias: DEVICE_TIER !== 'low',
  }), []);

  useEffect(() => {
    if (loaded) return;
    let current = 0;
    const interval = setInterval(() => {
      const target = 85;
      current += (target - current) * 0.08;
      const rounded = Math.min(Math.round(current), 99);
      setProgress(rounded);
      if (rounded >= 99) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [loaded]);

  const handleLoaded = () => {
    setProgress(100);
    setLoaded(true);
    setTimeout(() => setHiding(true), 400);
  };

  return (
    <div className="relative w-full h-full">
      <LoaderOverlay progress={progress} visible={!hiding} />

      <Canvas
        dpr={canvasConfig.dpr}
        camera={{ position: [0, 0, 1.5], fov: 45 }}
        gl={{
          alpha: true,
          antialias: canvasConfig.antialias,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        frameloop="always"
        className="bg-transparent"
      >
        <AdaptiveLights />

        <Float
          speed={0.4}
          rotationIntensity={0.2}
          floatIntensity={DEVICE_TIER === 'low' ? 0 : 0.6}
        >
          <Center>
            <Suspense fallback={null}>
              <Model scale={10} onLoaded={handleLoaded} />
            </Suspense>
          </Center>
        </Float>

        {/* Sombra suave de contacto para que el modelo no flote en el vacío */}
        {DEVICE_TIER !== 'low' && (
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={6}
            blur={2.5}
            far={2}
          />
        )}

        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}