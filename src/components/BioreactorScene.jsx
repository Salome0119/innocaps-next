'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { getDeviceTier, prefersReducedMotion } from '../lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════
   SUBCOMPONENTES — reciben geometrías y materiales como props
   ═══════════════════════════════════════════════════════════════ */

function BioreactorLights({ tier }) {
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
      <ambientLight intensity={1.5} color="#0F4C3A" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#e9fffd" />
      <pointLight position={[-4, 2, -4]} intensity={3} color="#00f5d4" distance={20} />
      <pointLight position={[4, 1, 4]} intensity={2} color="#2dd4bf" distance={15} />
      <Environment preset="city" />
    </>
  );
}

function Impeller({ reducedMotion, geometries, materials }) {
  const ref = useRef();
  useFrame(() => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += 0.02;
  });
  if (!geometries?.impeller || !geometries?.blade) return <group />;
  return (
    <group ref={ref} position={[0, -0.2, 0]}>
      <mesh geometry={geometries.impeller} material={materials.impeller} />
      <mesh geometry={geometries.blade} material={materials.impeller} rotation={[0, Math.PI / 6, 0]} />
      <mesh geometry={geometries.blade} material={materials.impeller} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometries.blade} material={materials.impeller} rotation={[0, (5 * Math.PI) / 6, 0]} />
    </group>
  );
}

function Pipes({ geometries, materials }) {
  if (!geometries?.pipe) return <group />;
  const samplingGeometry = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12), []);
  const sightGlassGeometry = useMemo(() => new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16, 1, true), []);
  return (
    <group>
      <mesh geometry={geometries.pipe} material={materials.pipe} position={[-1.3, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} />
      <mesh geometry={geometries.pipe} material={materials.pipe} position={[-1.8, 1.2, 0]} rotation={[0, 0, 0]} />
      <mesh geometry={geometries.pipe} material={materials.pipe} position={[1.3, 1.2, 0]} rotation={[0, 0, -Math.PI / 2]} />
      <mesh geometry={geometries.pipe} material={materials.pipe} position={[1.8, 1.2, 0]} rotation={[0, 0, 0]} />
      <mesh geometry={samplingGeometry} material={materials.pipe} position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={sightGlassGeometry} material={materials.glass} position={[0, -0.2, 1.05]} />
    </group>
  );
}

function Bubbles({ tier, reducedMotion, geometries, materials }) {
  const ref = useRef();
  const BUBBLE_COUNT = tier === 'low' ? 40 : 80;
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !ref.current) return;
    const mesh = ref.current;
    if (!mesh.instanceMatrix || !mesh.instanceMatrix.array) return;
    /* La matriz de instancias se actualiza en cada frame: se marca como
       dinámica (usar un <bufferAttribute attach="instanceMatrix"> lo
       dejaría vacío y rompería el cálculo de bounds de three.js) */
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const matrixArray = mesh.instanceMatrix.array;
    const initialMatrix = new THREE.Matrix4();
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      initialMatrix.makeTranslation(
        (Math.random() - 0.5) * 1.5,
        -1.3 + Math.random() * 2.8,
        (Math.random() - 0.5) * 1.5
      );
      matrixArray.set(initialMatrix.elements, i * 16);
    }
    mesh.instanceMatrix.needsUpdate = true;
    initialized.current = true;
  }, [BUBBLE_COUNT]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (!ref.current) return;

    const positions = ref.current.instanceMatrix.array;
    if (!positions) return;
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const y = positions[i * 16 + 13];
      const speed = 0.15 + (i % 5) * 0.05;
      positions[i * 16 + 13] = y + speed * delta;
      if (positions[i * 16 + 13] > 1.5) {
        positions[i * 16 + 13] = -1.3;
        positions[i * 16 + 12] = (Math.random() - 0.5) * 1.5;
        positions[i * 16 + 14] = (Math.random() - 0.5) * 1.5;
      }
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!geometries?.bubble) return <group />;
  return (
    <instancedMesh
      ref={ref}
      args={[geometries.bubble, materials.bubble, BUBBLE_COUNT]}
      frustumCulled={false}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE INTERNO — escena completa
   ═══════════════════════════════════════════════════════════════ */

function BioreactorSceneInner({ tier, reducedMotion, geometries, materials }) {
  if (!geometries || !geometries.vessel) {
    return <group />;
  }

  return (
    <>
      <BioreactorLights tier={tier} />
      <Float speed={0.3} rotationIntensity={0.15} floatIntensity={tier === 'low' ? 0 : 0.4}>
        <Center>
          <mesh geometry={geometries.vessel} material={materials.vessel} position={[0, 0, 0]} />
          <mesh geometry={geometries.liquid} material={materials.liquid} position={[0, -0.6, 0]} />
          <Impeller reducedMotion={reducedMotion} geometries={geometries} materials={materials} />
          <Bubbles tier={tier} reducedMotion={reducedMotion} geometries={geometries} materials={materials} />
          <Pipes geometries={geometries} materials={materials} />
        </Center>
      </Float>

      {tier !== 'low' && (
        <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={8} blur={3} far={3} />
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
   EXPORT PRINCIPAL — TODO dentro del componente, cero globals
   ═══════════════════════════════════════════════════════════════ */

export default function BioreactorScene() {
  const [isMounted, setIsMounted] = useState(false);

  // Strict mount guard — runs only on client after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Device tier & motion preference (safe to call during render)
  const DEVICE_TIER = getDeviceTier();
  const REDUCED_MOTION = prefersReducedMotion();

  // Geometrías creadas SOLO en cliente via useMemo con dependencia isMounted
  const geometries = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return null;
    return {
      vessel: new THREE.CylinderGeometry(1, 1, 3, 32, 1, true),
      liquid: new THREE.CylinderGeometry(0.9, 0.9, 1.8, 32),
      bubble: new THREE.SphereGeometry(0.05, 8, 8),
      pipe: new THREE.CylinderGeometry(0.12, 0.12, 1, 12),
      impeller: new THREE.CylinderGeometry(0.3, 0.3, 0.1, 6),
      blade: new THREE.BoxGeometry(0.5, 0.04, 0.1),
    };
  }, [isMounted]);

  // Materiales creados SOLO en cliente via useMemo con dependencia isMounted
  const materials = useMemo(() => {
    if (!isMounted) return null;
    return {
      vessel: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0f766e'),
        metalness: 0.1,
        roughness: 0.1,
        transmission: DEVICE_TIER === 'low' ? 0 : 0.85,
        thickness: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      }),
      liquid: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#064e3b'),
        metalness: 0,
        roughness: 0.3,
        transmission: DEVICE_TIER === 'low' ? 0 : 0.6,
        thickness: 2,
        transparent: true,
        opacity: 0.7,
      }),
      bubble: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#2dd4bf'),
        metalness: 0,
        roughness: 0.1,
        transmission: DEVICE_TIER === 'low' ? 0 : 0.9,
        thickness: 0.3,
        transparent: true,
        opacity: 0.6,
      }),
      pipe: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e3a5f'),
        metalness: 0.3,
        roughness: 0.4,
      }),
      impeller: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        metalness: 0.5,
        roughness: 0.3,
      }),
      blade: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        metalness: 0.5,
        roughness: 0.3,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0f766e'),
        transmission: DEVICE_TIER === 'low' ? 0 : 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
      }),
    };
  }, [isMounted, DEVICE_TIER]);

  const canvasConfig = useMemo(() => {
    const isLow = DEVICE_TIER === 'low';
    return {
      dpr: isLow ? 1 : 1.5,
      antialias: !isLow,
    };
  }, [DEVICE_TIER]);

  // SSR / pre-mount: placeholder seguro — Three.js NO se ejecuta.
  // Sin etiquetas numéricas: el visor queda limpio, solo líquido y estructura.
  if (!isMounted || !geometries || !materials) {
    return <div className="w-full h-[400px] min-h-[400px] bg-[#03100e] relative" />;
  }

  // Cliente montado + recursos listos → render Canvas
  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={canvasConfig.dpr}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
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
        <BioreactorSceneInner tier={DEVICE_TIER} reducedMotion={REDUCED_MOTION} geometries={geometries} materials={materials} />
      </Canvas>
    </div>
  );
}