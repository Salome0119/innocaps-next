'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center, ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { getDeviceTier, prefersReducedMotion } from '../lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════
   GUTACID BALANCE® — MICROCAPSULE CLUSTER PREMIUM CINEMÁTICO
   Núcleo: 5 microesferas aglomeradas con materiales fotorrealistas
   Membrana: refracción realista + dispersión
   Partículas orbitales orgánicas + pulso interactivo
   Iluminación 3-puntos + OrbitControls cinematográfico
   ════════════════════════════════════════════════════════════════ */

function createClusterSpheres() {
  const basePositions = [
    [0.00, 0.00, 0.00],
    [0.58, -0.18, 0.12],
    [-0.48, 0.32, -0.18],
    [0.18, 0.62, 0.25],
    [-0.28, -0.52, -0.08],
  ];

  return basePositions.map((pos, i) => ({
    id: `sphere-${i}`,
    position: pos,
    radius: i === 0 ? 0.35 : 0.25 + (i % 2) * 0.04,
    isCore: i === 0,
  }));
}

const CLUSTER_SPHERES = createClusterSpheres();

/* Radio de la membrana translúcida dedicada: envuelve SOLO el conglomerado
   de esferas (activo + poros), dejando las partículas orbitales por fuera. */
const MEMBRANE_RADIUS = 1.35;

const GEOMETRIES = {
  sphere: new THREE.SphereGeometry(1, 48, 48),
  membrane: new THREE.SphereGeometry(MEMBRANE_RADIUS, 48, 48),
  pore: new THREE.SphereGeometry(0.006, 8, 8),
  particle: new THREE.SphereGeometry(0.022, 10, 10),
};

/* ═══════════════════════════════════════════════════════════════
   SUBCOMPONENTES PREMIUM
   ═══════════════════════════════════════════════════════════════ */

function ClusterLights({ tier, hovered }) {
  if (tier === 'low') {
    return (
      <>
        <ambientLight intensity={0.6} color="#083028" />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      </>
    );
  }

  const pulseIntensity = hovered ? 1.3 : 1.0;

  return (
    <>
      <ambientLight intensity={0.4} color="#062820" />

      <pointLight
        position={[0, 2.5, 3.5]}
        intensity={2.2 * pulseIntensity}
        color="#00f5d4"
        distance={15}
        decay={2}
      />

      <pointLight
        position={[0, -2.5, -4]}
        intensity={1.8 * pulseIntensity}
        color="#3b82f6"
        distance={15}
        decay={2}
      />

      <pointLight
        position={[-3.5, 1.5, 1.5]}
        intensity={1.2 * pulseIntensity}
        color="#22d3ee"
        distance={12}
        decay={2}
      />

      <pointLight
        position={[0, 5, 0]}
        intensity={0.8}
        color="#67e8f9"
        distance={20}
        decay={2}
      />

      <Environment resolution={256} background={false}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer
            form="rect"
            intensity={4}
            color="#00f5d4"
            scale={[14, 14, 1]}
            position={[0, 8, -12]}
          />
          <Lightformer
            form="circle"
            intensity={2}
            color="#3b82f6"
            scale={6}
            position={[0, -5, 0]}
            rotation-x={Math.PI / 2}
          />
        </group>
      </Environment>
    </>
  );
}

function SphereWithPores({ sphere, materials, hovered, index }) {
  const meshRef = useRef();
  const [emissiveBoost, setEmissiveBoost] = useState(0);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 0.8 : 0;
    setEmissiveBoost(prev => THREE.MathUtils.lerp(prev, target, 0.08));
  });

  const porePositions = useMemo(() => {
    const pores = [];
    const count = sphere.isCore ? 60 : 35;
    const seed = 12345 + index * 100;
    let s = seed >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * rnd() - 1);
      const theta = rnd() * Math.PI * 2;
      const r = sphere.radius * (0.98 + rnd() * 0.04);
      pores.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ]);
    }
    return pores;
  }, [sphere.radius, sphere.isCore, index]);

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={GEOMETRIES.sphere}
        material={materials.sphere}
        scale={[sphere.radius, sphere.radius, sphere.radius]}
        position={sphere.position}
        castShadow
        receiveShadow
        onPointerOver={() => setEmissiveBoost(0.8)}
        onPointerOut={() => setEmissiveBoost(0)}
      >
        <meshPhysicalMaterial
          attach="material"
          color="#00f5d4"
          metalness={0.1}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive="#003b36"
          emissiveIntensity={0.4 + emissiveBoost}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
      {porePositions.map((pos, i) => (
        <mesh
          key={i}
          geometry={GEOMETRIES.pore}
          position={pos}
        >
          <meshStandardMaterial
            color="#00f5d4"
            emissive="#00d2b4"
            emissiveIntensity={1.8 + emissiveBoost}
            metalness={0.4}
            roughness={0.1}
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ConnectingBridges({ materials }) {
  const bridgesRef = useRef([]);
  
  const connections = [
    { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
    { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 1, to: 4 },
  ];

  useFrame((state, delta) => {
    if (!bridgesRef.current.length) return;
    const elapsed = state.clock.elapsedTime;
    bridgesRef.current.forEach((bridge, i) => {
      const s1 = CLUSTER_SPHERES[connections[i].from];
      const s2 = CLUSTER_SPHERES[connections[i].to];
      const p1 = new THREE.Vector3(...s1.position).multiplyScalar(0.7);
      const p2 = new THREE.Vector3(...s2.position).multiplyScalar(0.7);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      
      bridge.position.copy(mid);
      bridge.lookAt(p2);
      bridge.scale.set(1, 1, dist * 0.85);
      bridge.rotation.x = -Math.PI / 2;
      
      if (bridge.material) {
        const pulse = 0.2 + Math.sin(elapsed * 1.5 + i) * 0.08;
        bridge.material.opacity = THREE.MathUtils.lerp(bridge.material.opacity, pulse, delta * 4);
        bridge.material.emissiveIntensity = THREE.MathUtils.lerp(
          bridge.material.emissiveIntensity, 
          0.6 + Math.sin(elapsed * 2 + i) * 0.2, 
          delta * 3
        );
      }
    });
  });

  return (
    <group>
      {connections.map((conn, i) => {
        const s1 = CLUSTER_SPHERES[conn.from];
        const s2 = CLUSTER_SPHERES[conn.to];
        const p1 = new THREE.Vector3(...s1.position).multiplyScalar(0.7);
        const p2 = new THREE.Vector3(...s2.position).multiplyScalar(0.7);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);
        
        return (
          <mesh
            key={i}
            ref={(el) => { bridgesRef.current[i] = el; }}
            geometry={new THREE.CylinderGeometry(0.028, 0.028, 1, 10, 1, true)}
            material={materials.bridge}
            position={mid}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[1, 1, dist * 0.85]}
          />
        );
      })}
    </group>
  );
}

function OrbitingParticles({ materials, tier, reducedMotion }) {
  const ref = useRef();
  const dummy = useRef(new THREE.Object3D());
  const PARTICLE_COUNT = tier === 'low' ? 25 : 50;

  useFrame((state) => {
    if (reducedMotion) return;
    if (!ref.current) return;
    const elapsed = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      /* Órbita trazada alrededor de la membrana translúcida */
      const baseRadius = MEMBRANE_RADIUS * 1.18 + (i % 5) * 0.13;
      const speed = 0.15 + (i % 7) * 0.03;
      const phi = (i / PARTICLE_COUNT) * Math.PI * 2 + elapsed * speed;
      const theta = Math.PI / 2 + Math.sin(i * 1.3 + elapsed * 0.6) * 0.35;
      const radiusVariation = Math.sin(elapsed * 0.8 + i * 2.1) * 0.08;

      dummy.current.position.set(
        (baseRadius + radiusVariation) * Math.sin(theta) * Math.cos(phi),
        (baseRadius + radiusVariation) * Math.cos(theta) + Math.sin(elapsed * 0.7 + i) * 0.05,
        (baseRadius + radiusVariation) * Math.sin(theta) * Math.sin(phi)
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

/* ── Membrana translúcida dedicada (envoltura de vidrio biológica) ──
   Envuelve únicamente el conglomerado de esferas. No se comparte con
   ningún otro modelo de la aplicación (Pipeline, Tecnología, etc.). */
function TranslucentMembrane({ hovered }) {
  const membraneRef = useRef();
  const rimRef = useRef();

  /* Material Fresnel: capa aditiva que dibuja el canto neón del vidrio */
  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#00f5d4') },
          uIntensity: { value: 0.9 },
        },
        vertexShader: `
          varying vec3 vNormalV;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormalV = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec3 vNormalV;
          varying vec3 vView;
          void main() {
            float facing = clamp(dot(normalize(vNormalV), normalize(vView)), 0.0, 1.0);
            float fres = pow(1.0 - facing, 3.0);
            gl_FragColor = vec4(uColor * (1.0 + fres * 1.8), fres * uIntensity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    []
  );

  useEffect(() => () => rimMaterial.dispose(), [rimMaterial]);

  useFrame((state) => {
    if (!membraneRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const target = hovered ? 0.16 : 0.25;
    const next = THREE.MathUtils.lerp(membraneRef.current.material.opacity, target, 0.06);
    membraneRef.current.material.opacity = next;

    const breathe = Math.sin(elapsed * 1.2) * 0.006;
    membraneRef.current.scale.setScalar(1 + breathe);
    if (rimRef.current) rimRef.current.scale.setScalar(1.012 + breathe);
  });

  return (
    <group>
      <mesh ref={membraneRef} geometry={GEOMETRIES.membrane} castShadow receiveShadow>
        <meshPhysicalMaterial
          attach="material"
          color="#00f5d4"
          metalness={0}
          roughness={0.1}
          transmission={0.85}
          thickness={1.2}
          ior={1.4}
          transparent
          opacity={0.25}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={rimRef} geometry={GEOMETRIES.membrane}>
        <primitive object={rimMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function ClusterSceneInner({ hovered, tier, reducedMotion, materials }) {
  return (
    <>
      <ClusterLights tier={tier} hovered={hovered} />
      
      <Float speed={0.15} rotationIntensity={0.06} floatIntensity={tier === 'low' ? 0 : 0.2}>
        <Center>
          <TranslucentMembrane hovered={hovered} />
          <ConnectingBridges materials={materials} />
          {CLUSTER_SPHERES.map((sphere, i) => (
            <SphereWithPores
              key={sphere.id}
              sphere={sphere}
              materials={materials}
              hovered={hovered}
              index={i}
            />
          ))}
          <OrbitingParticles materials={materials} tier={tier} reducedMotion={reducedMotion} />
        </Center>
      </Float>

      {tier !== 'low' && (
        <ContactShadows position={[0, -1.1, 0]} opacity={0.25} scale={6} blur={3} far={3} />
      )}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        minDistance={1.6}
        maxDistance={12}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={false}
        autoRotateSpeed={0.15}
        target={[0, 0, 0]}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   MATERIALES FOTORREALISTAS PREMIUM
   ═══════════════════════════════════════════════════════════════ */

const MATERIALS_FACTORY = {
  sphere: (tier) => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#00f5d4'),
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color('#003b36'),
    emissiveIntensity: 0.4,
    transmission: tier === 'low' ? 0 : 0.3,
    thickness: 0.5,
    ior: 1.4,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  }),
  pore: () => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f5d4'),
    emissive: new THREE.Color('#00d2b4'),
    emissiveIntensity: 2.0,
    metalness: 0.5,
    roughness: 0.05,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  }),
  bridge: (tier) => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#00f5d4'),
    emissive: new THREE.Color('#00d2b4'),
    emissiveIntensity: 0.5,
    transmission: tier === 'low' ? 0 : 0.6,
    thickness: 0.5,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  }),
  /* Estrellas orbitales: emisivo brillante para el rastro/halo estelar */
  particle: () => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f5d4'),
    emissive: new THREE.Color('#00f5d4'),
    emissiveIntensity: 2,
    metalness: 0.2,
    roughness: 0.3,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  }),
};

/* ═══════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

export default function MicrocapsuleCore() {
  const [hovered, setHovered] = useState(false);

  const DEVICE_TIER = getDeviceTier();
  const REDUCED_MOTION = prefersReducedMotion();

  const materials = useMemo(() => ({
    sphere: MATERIALS_FACTORY.sphere(DEVICE_TIER),
    pore: MATERIALS_FACTORY.pore(),
    bridge: MATERIALS_FACTORY.bridge(DEVICE_TIER),
    particle: MATERIALS_FACTORY.particle(),
  }), [DEVICE_TIER]);

  const canvasConfig = useMemo(() => ({
    dpr: DEVICE_TIER === 'low' ? [1, 1] : [1, 1.75],
    antialias: DEVICE_TIER !== 'low',
  }), [DEVICE_TIER]);

  return (
    <div className="relative w-full h-full"
         onPointerOver={() => setHovered(true)}
         onPointerOut={() => setHovered(false)}>
      <Canvas
        dpr={canvasConfig.dpr}
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        gl={{
          alpha: true,
          antialias: canvasConfig.antialias,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.physicallyCorrectLights = true;
        }}
        frameloop={REDUCED_MOTION ? 'demand' : 'always'}
        className="bg-transparent"
      >
        {/* Escala del conjunto: la membrana (1.35) + estrellas orbitales
            (~2.1) encuadran con aire dentro de la tarjeta del visor. */}
        <group scale={0.85}>
          <ClusterSceneInner 
            hovered={hovered} 
            tier={DEVICE_TIER} 
            reducedMotion={REDUCED_MOTION} 
            materials={materials} 
          />
        </group>
      </Canvas>
    </div>
  );
}