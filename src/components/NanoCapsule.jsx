'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════
   NANOCAPSULE — CÁPSULA TRI-COMPARTIMENTAL DE BIODISPONIBILIDAD
   Cápsula horizontal de vidrio semitransparente (transmission) con
   3 compartimentos verticales:
   · Izq (rosa): mitocondria + esferas doradas flotantes (CoQ10 / ATP)
   · Centro (verde): cadenas moleculares y fibras prebióticas
   · Der (azul/violeta): anticuerpos Y (mAbs) + cadenas de semaglutida
   ═══════════════════════════════════════════════════════════════════ */

/* ── Esferas doradas (CoQ10 / ATP): [x, y, z, radio] ── */
const GOLD_INSIDE = [
  [-0.6, 0.26, 0.14, 0.05],
  [-0.7, -0.28, -0.12, 0.045],
  [-1.0, 0.28, -0.15, 0.048],
  [-1.06, -0.22, 0.18, 0.042],
  [-0.85, 0.4, 0.0, 0.05],
  [-0.88, -0.4, -0.04, 0.046],
  [-0.56, 0.08, -0.24, 0.044],
  [-1.12, 0.08, 0.06, 0.05],
  [-0.75, 0.05, 0.3, 0.04],
  [-0.95, -0.05, -0.3, 0.045],
];

const GOLD_OUTSIDE = [
  [-1.7, 0.28, 0.1, 0.075],
  [-1.8, -0.12, -0.06, 0.085],
  [-1.58, -0.32, 0.16, 0.065],
  [-1.74, 0.1, -0.2, 0.07],
];

/* ── Matriz prebiótica: hexágono, pentágono, cadenas ── */
const HEX_NODES = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
  return [Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0];
});
const HEX_BONDS = Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6]);

const PENT_NODES = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0];
});
const PENT_BONDS = Array.from({ length: 5 }, (_, i) => [i, (i + 1) % 5]);

const FIBER_NODES = [
  [-0.4, 0.2, 0.06],
  [-0.29, 0.27, 0.04],
  [-0.18, 0.19, 0.02],
  [-0.06, 0.26, 0.0],
  [0.06, 0.18, -0.03],
  [0.18, 0.25, -0.05],
  [0.3, 0.17, -0.08],
  [0.4, 0.24, -0.1],
];
const FIBER_BONDS = FIBER_NODES.slice(0, -1).map((_, i) => [i, i + 1]);

const BRANCH_NODES = [
  [-0.4, -0.22, 0.1],
  [-0.3, -0.29, 0.06],
  [-0.2, -0.22, 0.02],
];
const BRANCH_BONDS = [
  [0, 1],
  [1, 2],
];

const OLIVE_COLORS = ['#9aa84b', '#b08a4a', '#7f9c3f', '#8a7a3c'];

/* ── Enlace molecular (cilindro entre dos nodos) ── */
function Bond({ from, to, color, radius = 0.013 }) {
  const { position, rotation, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    const e = new THREE.Euler().setFromQuaternion(q);
    return { position: [mid.x, mid.y, mid.z], rotation: [e.x, e.y, e.z], length: len };
  }, [from, to]);

  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}

/* ── Molécula estilizada: nodos + enlaces ── */
function Molecule({ nodes, bonds, colors, nodeR = 0.034, bondColor = '#8a8446' }) {
  return (
    <group>
      {bonds.map(([a, b], i) => (
        <Bond key={`b${i}`} from={nodes[a]} to={nodes[b]} color={bondColor} />
      ))}
      {nodes.map((n, i) => (
        <mesh key={`n${i}`} position={n}>
          <sphereGeometry args={[nodeR, 16, 12]} />
          <meshStandardMaterial color={colors[i % colors.length]} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Cadena de cuentas (semaglutida) ── */
function BeadChain({ fromX, toX, count, y, z, colors, r = 0.036 }) {
  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const t = count > 1 ? i / (count - 1) : 0.5;
        return [fromX + (toX - fromX) * t, y + Math.sin(t * Math.PI * 2) * 0.02, z];
      }),
    [fromX, toX, count, y, z]
  );
  const bonds = useMemo(
    () => Array.from({ length: Math.max(0, count - 1) }, (_, i) => [i, i + 1]),
    [count]
  );

  return <Molecule nodes={nodes} bonds={bonds} colors={colors} nodeR={r} bondColor="#8fa3c8" />;
}

/* ── Anticuerpo monoclonal en forma de Y ── */
function Antibody({ color, position, rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Tallo */}
      <mesh position={[0, -0.085, 0]}>
        <capsuleGeometry args={[0.025, 0.13, 4, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Brazo izquierdo */}
      <mesh position={[-0.066, 0.075, 0]} rotation={[0, 0, Math.PI / 3.6]}>
        <capsuleGeometry args={[0.025, 0.12, 4, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Brazo derecho */}
      <mesh position={[0.066, 0.075, 0]} rotation={[0, 0, -Math.PI / 3.6]}>
        <capsuleGeometry args={[0.025, 0.12, 4, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Mitocondria estilizada con crestas ── */
function Mitochondrion({ position }) {
  const cristaeCurve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      pts.push(
        new THREE.Vector3((t - 0.5) * 0.34, Math.sin(t * Math.PI * 4.5) * 0.05, 0.16)
      );
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group position={position} rotation={[0, 0, -0.35]}>
      <mesh scale={[1.5, 1, 0.85]}>
        <sphereGeometry args={[0.17, 32, 24]} />
        <meshStandardMaterial
          color="#d95a46"
          roughness={0.45}
          emissive="#4a120b"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh>
        <tubeGeometry args={[cristaeCurve, 64, 0.017, 8, false]} />
        <meshStandardMaterial color="#fde8d8" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Enjambre de esferas doradas con flotación ── */
function GoldSwarm({ data }) {
  const refs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < data.length; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const [x, y, z] = data[i];
      m.position.set(
        x,
        y + Math.sin(t * 1.2 + i * 1.9) * 0.03,
        z + Math.cos(t * 1.0 + i * 2.4) * 0.028
      );
    }
  });

  return (
    <group>
      {data.map(([x, y, z, r], i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[x, y, z]}
        >
          <sphereGeometry args={[r, 20, 16]} />
          <meshStandardMaterial
            color="#f5c542"
            metalness={0.7}
            roughness={0.22}
            emissive="#7a5a00"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Compartimento interior (cilindro translúcido a lo largo de X) ── */
function Section({ position, length, color, opacity }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.6, 0.6, length, 48]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════════ */
export default function NanoCapsule() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.y = t * 0.1;
    g.rotation.x = Math.sin(t * 0.15) * 0.12;
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* ── Iluminación interna focalizada: oro, cian, azul ── */}
      <pointLight position={[-0.85, 0.15, 0.35]} color="#ffd27f" intensity={1.8} distance={2.6} />
      <pointLight position={[0, 0.15, 0.35]} color="#67e8f9" intensity={1.5} distance={2.6} />
      <pointLight position={[0.85, 0.15, 0.35]} color="#7aa2ff" intensity={1.5} distance={2.6} />
      <spotLight
        position={[1.4, 2.6, 2.2]}
        angle={0.5}
        penumbra={0.9}
        intensity={30}
        distance={14}
        color="#a5f3fc"
      />

      {/* ── Compartimentos: rosa | verde | azul/violeta ── */}
      <Section position={[-0.85, 0, 0]} length={0.66} color="#f4a9a0" opacity={0.32} />
      <Section position={[0, 0, 0]} length={0.92} color="#9fd8a8" opacity={0.3} />
      <Section position={[0.85, 0, 0]} length={0.66} color="#9db8f0" opacity={0.32} />

      {/* ── Compartimiento izquierdo: mitocondria + CoQ10 dorado ── */}
      <Mitochondrion position={[-0.86, -0.02, 0.02]} />
      <GoldSwarm data={GOLD_INSIDE} />

      {/* ── Compartimiento central: cadenas moleculares prebióticas ── */}
      <group position={[-0.17, -0.13, 0.06]}>
        <Molecule nodes={HEX_NODES} bonds={HEX_BONDS} colors={OLIVE_COLORS} />
      </group>
      <group position={[0.17, -0.17, -0.06]}>
        <Molecule nodes={PENT_NODES} bonds={PENT_BONDS} colors={OLIVE_COLORS} />
      </group>
      <Molecule nodes={FIBER_NODES} bonds={FIBER_BONDS} colors={OLIVE_COLORS} nodeR={0.032} />
      <Molecule nodes={BRANCH_NODES} bonds={BRANCH_BONDS} colors={OLIVE_COLORS} nodeR={0.03} />

      {/* ── Compartimiento derecho: anticuerpos Y (mAbs) + semaglutida ── */}
      <Antibody color="#6aa8e8" position={[0.72, 0.18, 0.06]} rotation={[0, 0, 0.15]} scale={1.15} />
      <Antibody color="#9b87e0" position={[1.0, 0.16, -0.04]} rotation={[0, 0, -0.12]} scale={1.0} />
      <BeadChain
        fromX={0.62}
        toX={1.12}
        count={7}
        y={-0.16}
        z={0.06}
        colors={['#5eead4', '#60a5fa', '#a5b4fc', '#5eead4', '#38bdf8', '#93c5fd', '#a78bfa']}
      />
      <BeadChain
        fromX={0.66}
        toX={1.1}
        count={6}
        y={-0.33}
        z={-0.04}
        colors={['#38bdf8', '#5eead4', '#93c5fd', '#818cf8', '#5eead4', '#60a5fa']}
        r={0.033}
      />

      {/* ── Esferas doradas flotando fuera de la cápsula (izquierda) ── */}
      <GoldSwarm data={GOLD_OUTSIDE} />

      {/* ── Cámara exterior: vitrina de vidrio horizontal ── */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.8, 1.4, 24, 48]} />
        <meshPhysicalMaterial
          transmission={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.06}
          thickness={0.6}
          ior={1.45}
          color="#e6f6fa"
          metalness={0}
          envMapIntensity={1.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
