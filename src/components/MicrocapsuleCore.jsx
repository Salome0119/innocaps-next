'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { getDeviceTier, prefersReducedMotion } from '../lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════
   ESCENA PROCEDURAL — MICROCÁPSULA DOBLE CAPA (NÚCLEO + CÁSCARA)
   Núcleo emisivo + cáscara con transmission + partículas en órbita.
   Tier-aware, reduced-motion, hover intensifica emisivo.
   ═══════════════════════════════════════════════════════════════ */

// Geometrías compartidas
const GEOMETRIES = {
  core: new THREE.SphereGeometry(0.45, 32, 32),
  shell: new THREE.SphereGeometry(0.75, 32, 32),
  particle: new THREE.SphereGeometry(0.025, 8, 8),
};

/* ═══════════════════════════════════════════════════════════════
   SUBCOMPONENTES — nivel de módulo
   ═══════════════════════════════════════════════════════════════ */

function MicrocapsuleLights({ tier }) {
  if (tier === 'low') {
    return (
      <>
        <ambientLight intensity={2} color="#0F4C3A" />
        <directionalLight position={[3, 3, 4]} intensity={2} color="#ffffff" />
      </>
    );
  }
  return (
    <>
      <ambientLight intensity={1} color="#0F4C3A" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#e9fffd" />
      <pointLight position={[-3, 2, -3]} intensity={2} color="#00f5d4" distance={15} />
      <Environment preset="city" />
    </>
  );
}

function Shell({ materials }) {
  return <mesh geometry={GEOMETRIES.shell} material={materials.shell} />;
}

function Core({ materials, hovered }) {
  const coreRef = useRef();
  const [emissiveIntensity, setEmissiveIntensity] = useState(0.8);

  useEffect(() => {
    if (!coreRef.current) return;
    const target = hovered ? 1.8 : 0.8;
    function animate() {
      if (!coreRef.current) return;
      const current = coreRef.current.material.emissiveIntensity;
      coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(current, target, 0.1);
      if (Math.abs(coreRef.current.material.emissiveIntensity - target) > 0.01) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }, [hovered]);

  return (
    <mesh ref={coreRef} geometry={GEOMETRIES.core} material={materials.core} />
  );
}

function OrbitingParticles({ materials, tier, reducedMotion }) {
  const ref = useRef();
  const dummy = useRef(new THREE.Object3D());
  const PARTICLE_COUNT = tier === 'low' ? 16 : 32;

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (!ref.current) return;

    const time = Date.now() * 0.0005;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 0.95 + (i % 3) * 0.15;
      const phi = (i / PARTICLE_COUNT) * Math.PI * 2 + time * (0.3 + (i % 5) * 0.1);
      const theta = Math.PI / 2 + Math.sin(i + time) * 0.3;

      dummy.current.position.set(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.cos(theta),
        radius * Math.sin(theta) * Math.sin(phi)
      );
      dummy.current.updateMatrix();
      ref.current.setMatrixAt(i, dummy.current.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[GEOMETRIES.particle, materials.particle, PARTICLE_COUNT]} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   ESCENA INTERNA
   ═══════════════════════════════════════════════════════════════ */

function MicrocapsuleSceneInner({ hovered, tier, reducedMotion, materials }) {
  return (
    <>
      <MicrocapsuleLights tier={tier} />
      <Float speed={0.25} rotationIntensity={0.1} floatIntensity={tier === 'low' ? 0 : 0.3}>
        <Center>
          <Shell materials={materials} />
          <Core materials={materials} hovered={hovered} />
          <OrbitingParticles materials={materials} tier={tier} reducedMotion={reducedMotion} />
        </Center>
      </Float>

      {tier !== 'low' && (
        <ContactShadows position={[0, -1.2, 0]} opacity={0.2} scale={4} blur={2} far={2} />
      )}

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATERIALES
   ══════════════════════════════════════════════════════════════ */

const MATERIALS_FACTORY = {
  core: () => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f5d4'),
    emissive: new THREE.Color('#00d2b4'),
    emissiveIntensity: 0.8,
    metalness: 0.1,
    roughness: 0.2,
  }),
  shell: (tier) => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#00d2b4'),
    metalness: 0.05,
    roughness: 0.08,
    transmission: tier === 'low' ? 0 : 0.7,
    thickness: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.35,
  }),
  particle: () => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f5d4'),
    emissive: new THREE.Color('#00d2b4'),
    emissiveIntensity: 0.6,
    metalness: 0.2,
    roughness: 0.3,
  }),
};

/* ═══════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

export default function MicrocapsuleCore() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const DEVICE_TIER = getDeviceTier();
  const REDUCED_MOTION = prefersReducedMotion();

  const materials = useMemo(() => ({
    core: MATERIALS_FACTORY.core(),
    shell: MATERIALS_FACTORY.shell(DEVICE_TIER),
    particle: MATERIALS_FACTORY.particle(),
  }), [DEVICE_TIER]);

  const canvasConfig = useMemo(() => ({
    dpr: DEVICE_TIER === 'low' ? [1, 1] : [1, 1.5],
    antialias: DEVICE_TIER !== 'low',
  }), [DEVICE_TIER]);

  return (
    <div className="relative w-full h-full"
         onPointerOver={() => setHovered(true)}
         onPointerOut={() => setHovered(false)}>
      {!hiding && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none">
          <span className="font-mono font-extralight tabular-nums leading-none" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#00f5d4', letterSpacing: '-0.02em' }}>
            {progress}%
          </span>
          <div className="w-20 h-px mt-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,245,212,0.15)' }}>
            <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: `${progress}%`, background: '#00f5d4' }} />
          </div>
        </div>
      )}

      <Canvas
        dpr={canvasConfig.dpr}
        camera={{ position: [0, 0, 2.5], fov: 35 }}
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
        frameloop={REDUCED_MOTION ? 'demand' : 'always'}
        className="bg-transparent"
      >
        <MicrocapsuleSceneInner hovered={hovered} tier={DEVICE_TIER} reducedMotion={REDUCED_MOTION} materials={materials} />
      </Canvas>
    </div>
  );
}