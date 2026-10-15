'use client';

import { useRef, useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Float, Center } from '@react-three/drei';

/* ═══════════════════════════════════════════════════════════════
   Detección de capacidad del dispositivo
   ═══════════════════════════════════════════════════════════════ */
function getDeviceTier() {
  if (typeof window === 'undefined') return 'low';

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;

  // hardwareConcurrency: núcleos lógicos de CPU
  const cores = navigator.hardwareConcurrency || 2;
  // deviceMemory: GB de RAM (solo Chromium)
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
   Modelo 3D — con control de framerate adaptativo
   ═══════════════════════════════════════════════════════════════ */
function Model({ onLoaded }) {
  const ref = useRef();
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => { onLoaded?.(); }, [scene]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

/* ═══════════════════════════════════════════════════════════════
   Iluminación reducida — basada en tier
   ═══════════════════════════════════════════════════════════════ */
function AdaptiveLights() {
  if (DEVICE_TIER === 'low') {
    // Solo 2 luces en dispositivos bajos
    return (
      <>
        <ambientLight intensity={4} />
        <directionalLight position={[3, 3, 4]} intensity={4} color="#ffffff" />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={6} color="#2dd4bf" distance={30} />
      <spotLight position={[5, 5, -5]} intensity={5} color="#a855f7" angle={0.5} />
      <pointLight position={[5, 5, 5]} intensity={4} color="#ffffff" distance={25} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Loader overlay
   ═══════════════════════════════════════════════════════════════ */
function LoaderOverlay({ progress, visible }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
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

  /* Configuración adaptativa */
  const canvasConfig = useMemo(() => ({
    dpr: DEVICE_TIER === 'low' ? [1, 1] : [1, 1.5],
    antialias: DEVICE_TIER !== 'low',
  }), []);

  /* Progreso simulado — throttled to reduce re-renders */
  useEffect(() => {
    if (loaded) return;
    let current = 0;
    const interval = setInterval(() => {
      const target = 85;
      current += (target - current) * 0.08;
      const rounded = Math.min(Math.round(current), 99);
      setProgress(rounded);
      if (rounded >= 99) clearInterval(interval);
    }, 100); // 10fps instead of 60fps
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
          speed={0.3}
          rotationIntensity={0}
          floatIntensity={DEVICE_TIER === 'low' ? 0 : 0.5}
        >
          <Center>
            <Suspense fallback={null}>
              <Model scale={10} onLoaded={handleLoaded} />
            </Suspense>
          </Center>
        </Float>

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