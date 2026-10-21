'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { getDeviceTier, prefersReducedMotion } from '../lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════════════
   MICELA / MICROCÁPSULA CORE-SHELL
   Visor 3D de /bio?seccion=tecnologia
   · Capa exterior: esfera vítrea translúcida (membrana)
   · Núcleo interior: red molecular ball-and-stick (principios activos)
   · Dispersión radial del núcleo por zoom-out / movimiento del cursor
   · Iluminación bioluminiscente cian + azul suave
   ═══════════════════════════════════════════════════════════════════════ */

const SHELL_RADIUS = 1.62;
const CORE_SCALE = 0.78;
/* Radio de la nube liberada: debe caber en el encuadre de la cámara */
const RELEASE_RADIUS = 2.1;

/* Red molecular del núcleo: nodos (esferas) + enlaces (varillas) */
const CORE_NODES = [
  { id: 'core', p: [0.0, 0.0, 0.0], r: 0.3, tint: '#22d3ee' },
  { id: 'n1', p: [0.62, 0.55, 0.16], r: 0.23, tint: '#3b82f6' },
  { id: 'n2', p: [-0.58, 0.66, -0.24], r: 0.21, tint: '#38bdf8' },
  { id: 'n3', p: [1.18, 0.18, -0.38], r: 0.17, tint: '#60a5fa' },
  { id: 'n4', p: [-1.0, 0.06, 0.44], r: 0.18, tint: '#0ea5e9' },
  { id: 'n5', p: [0.32, -0.64, 0.48], r: 0.22, tint: '#3b82f6' },
  { id: 'n6', p: [-0.44, -0.6, -0.32], r: 0.19, tint: '#22d3ee' },
  { id: 'n7', p: [0.98, -0.78, -0.22], r: 0.15, tint: '#67e8f9' },
  { id: 'n8', p: [-0.92, -0.98, 0.28], r: 0.16, tint: '#7dd3fc' },
  { id: 'n9', p: [0.14, 1.08, -0.32], r: 0.19, tint: '#38bdf8' },
  { id: 'n10', p: [1.58, 0.74, 0.32], r: 0.14, tint: '#60a5fa' },
  { id: 'n11', p: [-1.4, 0.88, 0.14], r: 0.14, tint: '#0ea5e9' },
];

const CORE_BONDS = [
  ['core', 'n1'],
  ['core', 'n2'],
  ['core', 'n5'],
  ['core', 'n6'],
  ['n1', 'n3'],
  ['n1', 'n9'],
  ['n1', 'n10'],
  ['n2', 'n4'],
  ['n2', 'n11'],
  ['n5', 'n7'],
  ['n5', 'n8'],
  ['n6', 'n4'],
];

/* Anclaje de cada hotspot a un nodo del núcleo */
const HOTSPOT_NODE = {
  microencapsulacion: 'n1',
  ingredientes: 'n4',
  ciencia: 'n7',
};

function buildCore() {
  const nodes = CORE_NODES.map((n, i) => {
    const base = new THREE.Vector3(...n.p).multiplyScalar(CORE_SCALE);

    /* Dirección radial del nodo (el nodo central usa un eje fijo) */
    const radial =
      base.length() > 1e-4
        ? base.clone().normalize()
        : new THREE.Vector3(0, 1, 0);

    /* Deriva determinista: reparte la nube liberada sin solapamientos */
    const jitter = new THREE.Vector3(
      Math.sin(i * 12.9898),
      Math.cos(i * 78.233),
      Math.sin(i * 39.425)
    ).normalize();

    const spreadDir = radial.multiplyScalar(0.68).add(jitter.multiplyScalar(0.32)).normalize();
    const out = spreadDir.multiplyScalar(RELEASE_RADIUS);

    return { ...n, index: i, base, out };
  });

  const indexById = {};
  nodes.forEach((n) => {
    indexById[n.id] = n.index;
  });

  const bonds = CORE_BONDS.map(([a, b]) => [indexById[a], indexById[b]]);
  return { nodes, bonds };
}

const CORE = buildCore();

/* Material Fresnel para el borde neón de la membrana */
function createRimMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#00f5d4') },
      uIntensity: { value: 0.85 },
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
        gl_FragColor = vec4(uColor * (1.0 + fres * 1.7), fres * uIntensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

/* ── Controlador de dispersión: zoom de cámara + movimiento del cursor ── */
function DispersionController({ dispersionRef, onDisperseChange, reduced }) {
  const { camera, pointer } = useThree();
  const lastPointer = useRef(new THREE.Vector2(0, 0));
  const kick = useRef(0);
  const smoothed = useRef(0);
  const wasDispersed = useRef(false);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const distance = camera.position.length();
    const zoomTarget = THREE.MathUtils.clamp((distance - 7.0) / 2.0, 0, 1);

    const moved = pointer.distanceTo(lastPointer.current);
    lastPointer.current.copy(pointer);
    if (!reduced && moved > 0.004) {
      kick.current = Math.min(kick.current + Math.min(moved * 4, 0.2), 1);
    }
    kick.current = Math.max(0, kick.current - dt * 0.6);

    const target = Math.min(1, Math.max(zoomTarget, kick.current * 0.85));
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 3.2, dt);
    dispersionRef.current = smoothed.current;

    const dispersed = smoothed.current > 0.35;
    if (dispersed !== wasDispersed.current) {
      wasDispersed.current = dispersed;
      onDisperseChange(dispersed);
    }
  });

  return null;
}

/* ── Núcleo molecular: se expande radialmente al dispersarse ── */
function CoreMolecule({ coreState, dispersionRef, reduced, tier }) {
  const nodeMeshes = useRef([]);
  const bondMeshes = useRef([]);
  const segments = tier === 'low' ? 20 : tier === 'mid' ? 28 : 40;

  const nodeMaterials = useMemo(
    () =>
      CORE.nodes.map(
        (n) =>
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(n.tint),
            emissive: new THREE.Color(n.tint).multiplyScalar(0.45),
            emissiveIntensity: 0.4,
            roughness: 0.22,
            metalness: 0.08,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.94,
          })
      ),
    []
  );

  const bondMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#93c5fd',
        emissive: new THREE.Color('#1d4ed8'),
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.05,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  useEffect(
    () => () => {
      nodeMaterials.forEach((m) => m.dispose());
      bondMaterial.dispose();
    },
    [nodeMaterials, bondMaterial]
  );

  /* Espejos locales: el frame loop muta a través de refs (patrón del repo) */
  const positionsRef = useRef(coreState.current.positions);
  const matsMirror = useRef(nodeMaterials);
  const bondMirror = useRef(bondMaterial);

  useEffect(() => {
    positionsRef.current = coreState.current.positions;
    matsMirror.current = nodeMaterials;
    bondMirror.current = bondMaterial;
  }, [coreState, nodeMaterials, bondMaterial]);

  const scratch = useMemo(
    () => ({
      mid: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const d = dispersionRef.current;
    const positions = positionsRef.current;
    const mats = matsMirror.current;
    const bondMat = bondMirror.current;

    for (let i = 0; i < CORE.nodes.length; i++) {
      const node = CORE.nodes[i];
      const p = positions[i];
      p.lerpVectors(node.base, node.out, d);

      if (!reduced) {
        p.x += Math.sin(t * 0.6 + i * 1.7) * 0.012;
        p.y += Math.cos(t * 0.7 + i * 2.3) * 0.012;
      }

      const mesh = nodeMeshes.current[i];
      if (mesh) mesh.position.copy(p);

      const mat = mats[i];
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        d > 0.02 ? 0.75 : 0.4,
        dt * 4
      );
    }

    for (let i = 0; i < CORE.bonds.length; i++) {
      const mesh = bondMeshes.current[i];
      if (!mesh) continue;
      const [ai, bi] = CORE.bonds[i];
      const a = positions[ai];
      const b = positions[bi];

      scratch.mid.addVectors(a, b).multiplyScalar(0.5);
      scratch.dir.subVectors(b, a);
      const len = scratch.dir.length();
      if (len < 1e-5) continue;

      mesh.position.copy(scratch.mid);
      mesh.quaternion.setFromUnitVectors(scratch.up, scratch.dir.normalize());
      mesh.scale.set(1, len, 1);
    }

    bondMat.opacity = THREE.MathUtils.lerp(
      bondMat.opacity,
      d > 0.35 ? 0.3 : 0.85,
      dt * 4
    );
  });

  return (
    <group>
      {CORE.nodes.map((node, i) => (
        <mesh
          key={node.id}
          ref={(el) => {
            nodeMeshes.current[i] = el;
          }}
          position={node.base}
          castShadow
        >
          <sphereGeometry args={[node.r, segments, segments]} />
          <primitive object={nodeMaterials[i]} attach="material" />
        </mesh>
      ))}

      {CORE.bonds.map(([ai, bi], i) => (
        <mesh
          key={`${ai}-${bi}`}
          ref={(el) => {
            bondMeshes.current[i] = el;
          }}
        >
          <cylinderGeometry args={[0.022, 0.022, 1, 10, 1, true]} />
          <primitive object={bondMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* ── Membrana: esfera vítrea translúcida + borde neón ── */
function MicelleShell({ dispersionRef, reduced, tier }) {
  const shellRef = useRef();
  const rimRef = useRef();
  const bandRef = useRef();
  const shellMaterialRef = useRef();
  const rimMaterial = useMemo(() => createRimMaterial(), []);
  const segments = tier === 'low' ? 32 : 64;

  useEffect(() => () => rimMaterial.dispose(), [rimMaterial]);

  /* Espejo local: el frame loop muta el material del rim a través de un ref */
  const rimMirror = useRef(rimMaterial);
  useEffect(() => {
    rimMirror.current = rimMaterial;
  }, [rimMaterial]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const d = dispersionRef.current;
    const rim = rimMirror.current;

    if (shellRef.current) {
      const breathe = reduced ? 0 : Math.sin(t * 0.8) * 0.012;
      shellRef.current.scale.setScalar(1 + d * 0.1 + breathe);
    }
    if (rimRef.current) {
      rimRef.current.scale.setScalar(1.015 + d * 0.08);
    }
    if (bandRef.current && !reduced) {
      bandRef.current.rotation.z = t * 0.15;
      bandRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity = THREE.MathUtils.lerp(
        shellMaterialRef.current.opacity,
        0.4 - d * 0.12,
        dt * 4
      );
    }
    rim.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      rim.uniforms.uIntensity.value,
      0.85 + d * 0.7,
      dt * 4
    );
  });

  return (
    <group>
      <mesh ref={shellRef}>
        <sphereGeometry args={[SHELL_RADIUS, segments, segments]} />
        <meshPhysicalMaterial
          ref={shellMaterialRef}
          transmission={0.7}
          thickness={1.6}
          roughness={0.1}
          metalness={0}
          ior={1.45}
          color="#00f5d4"
          transparent
          opacity={0.4}
          clearcoat={1}
          clearcoatRoughness={0.08}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={rimRef}>
        <sphereGeometry args={[SHELL_RADIUS, 48, 48]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>

      <mesh ref={bandRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[SHELL_RADIUS * 0.99, 0.012, 8, 96]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Partículas de bioactivo liberadas en el medio ── */
function ReleasedParticles({ dispersionRef, reduced, tier }) {
  const pointsRef = useRef();
  const count = tier === 'low' ? 60 : 140;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const dirs = [];
    for (let i = 0; i < count; i++) {
      const theta = (i * 2.399963) % (Math.PI * 2);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      dirs.push(dir);
      positions[i * 3] = dir.x * SHELL_RADIUS * 1.05;
      positions[i * 3 + 1] = dir.y * SHELL_RADIUS * 1.05;
      positions[i * 3 + 2] = dir.z * SHELL_RADIUS * 1.05;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.userData.dirs = dirs;
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  /* Espejo local: el frame loop muta los buffers a través de un ref */
  const geoMirror = useRef(geometry);
  useEffect(() => {
    geoMirror.current = geometry;
  }, [geometry]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const d = dispersionRef.current;
    const geo = geoMirror.current;
    const positions = geo.attributes.position.array;
    const dirs = geo.userData.dirs;

    for (let i = 0; i < count; i++) {
      const dir = dirs[i];
      const spread = SHELL_RADIUS * (1.05 + d * 1.25);
      const wobble = reduced ? 0 : Math.sin(t * 0.8 + i) * 0.06 * d;
      positions[i * 3] = dir.x * spread + wobble;
      positions[i * 3 + 1] = dir.y * spread + wobble;
      positions[i * 3 + 2] = dir.z * spread + wobble;
    }
    geo.attributes.position.needsUpdate = true;
    points.material.opacity = 0.12 + d * 0.5;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#67e8f9"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Hotspot 3D: ancla al nodo y proyecta su posición al overlay DOM ── */
function HotspotAnchor({ nodeIndex, coreState, buttonRefs, dotRefs, hotspotIndex }) {
  const anchorRef = useRef();
  const projected = useMemo(() => new THREE.Vector3(), []);
  const shellPoint = useMemo(() => new THREE.Vector3(), []);
  const centerPoint = useMemo(() => new THREE.Vector3(), []);
  const labelSizes = useRef([]);

  /* Espejos locales: el frame loop muta el overlay a través de refs */
  const buttonsMirror = useRef(buttonRefs);
  const dotsMirror = useRef(dotRefs);
  useEffect(() => {
    buttonsMirror.current = buttonRefs;
    dotsMirror.current = dotRefs;
  }, [buttonRefs, dotRefs]);

  useFrame(({ camera, size }) => {
    const p = coreState.current.positions[nodeIndex];
    if (!p || !anchorRef.current) return;

    anchorRef.current.position.copy(p);
    anchorRef.current.getWorldPosition(projected);
    projected.project(camera);

    const button = buttonsMirror.current.current[hotspotIndex];
    const dot = dotsMirror.current.current[hotspotIndex];
    if (!button || !dot) return;

    const nodeX = (projected.x * 0.5 + 0.5) * size.width;
    const nodeY = (-projected.y * 0.5 + 0.5) * size.height;

    /* Punto sobre la membrana en la dirección del nodo: ancla exterior */
    shellPoint
      .copy(anchorRef.current.position)
      .normalize()
      .multiplyScalar(SHELL_RADIUS * 1.04);
    anchorRef.current.localToWorld(shellPoint);
    shellPoint.project(camera);

    centerPoint.set(0, 0, 0);
    anchorRef.current.localToWorld(centerPoint);
    centerPoint.project(camera);

    const shellX = (shellPoint.x * 0.5 + 0.5) * size.width;
    const shellY = (-shellPoint.y * 0.5 + 0.5) * size.height;
    const cX = (centerPoint.x * 0.5 + 0.5) * size.width;
    const cY = (-centerPoint.y * 0.5 + 0.5) * size.height;

    /* Empuja la etiqueta hacia afuera de la esfera para que no tape el modelo */
    let outX = shellX - cX;
    let outY = shellY - cY;
    const len = Math.hypot(outX, outY) || 1;
    outX /= len;
    outY /= len;

    const labelX = shellX + outX * 22;
    const labelY = shellY + outY * 22;

    /* Mantiene la etiqueta dentro del lienzo (evita recortes en el borde) */
    if (!labelSizes.current[hotspotIndex]) {
      labelSizes.current[hotspotIndex] = {
        w: button.offsetWidth || 180,
        h: button.offsetHeight || 38,
      };
    }
    const { w, h } = labelSizes.current[hotspotIndex];
    const clampedX = Math.min(Math.max(labelX, w / 2 + 8), size.width - w / 2 - 8);
    const clampedY = Math.min(Math.max(labelY, h / 2 + 8), size.height - h / 2 - 8);

    dot.style.transform = `translate3d(${nodeX.toFixed(1)}px, ${nodeY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    dot.style.opacity = projected.z > 1 ? '0' : '1';

    button.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    button.style.opacity = projected.z > 1 ? '0' : '1';
    button.style.pointerEvents = projected.z > 1 ? 'none' : 'auto';
  });

  return <group ref={anchorRef} />;
}

/* ── Rig común: núcleo + hotspots comparten el mismo espacio local ── */
function MicelleRig({ children, reduced }) {
  const rigRef = useRef();

  useFrame((state) => {
    if (!rigRef.current || reduced) return;
    const t = state.clock.elapsedTime;
    rigRef.current.rotation.y = t * 0.12;
    rigRef.current.position.y = Math.sin(t * 0.5) * 0.05;
  });

  return <group ref={rigRef}>{children}</group>;
}

/* ── Escena completa ── */
function MicelleScene({
  hotspots,
  dispersionRef,
  onDisperseChange,
  reduced,
  tier,
  buttonRefs,
  dotRefs,
}) {
  const coreState = useRef({
    positions: CORE.nodes.map((n) => n.base.clone()),
  });

  return (
    <group>
      <DispersionController
        dispersionRef={dispersionRef}
        onDisperseChange={onDisperseChange}
        reduced={reduced}
      />

      <ReleasedParticles dispersionRef={dispersionRef} reduced={reduced} tier={tier} />

      <MicelleShell dispersionRef={dispersionRef} reduced={reduced} tier={tier} />

      <MicelleRig reduced={reduced}>
        <CoreMolecule
          coreState={coreState}
          dispersionRef={dispersionRef}
          reduced={reduced}
          tier={tier}
        />

        {hotspots.map((h, i) => {
          const nodeId = HOTSPOT_NODE[h.id];
          const node = CORE.nodes.find((n) => n.id === nodeId);
          if (!node) return null;
          return (
            <HotspotAnchor
              key={h.id}
              nodeIndex={node.index}
              coreState={coreState}
              buttonRefs={buttonRefs}
              dotRefs={dotRefs}
              hotspotIndex={i}
            />
          );
        })}
      </MicelleRig>
    </group>
  );
}

/* ── Componente principal ── */
export default function MolecularStructure({ activeHotspot, onHotspotSelect, hotspots }) {
  const [isDispersed, setIsDispersed] = useState(false);
  const dispersionRef = useRef(0);
  const buttonRefs = useRef([]);
  const dotRefs = useRef([]);

  const tier = useMemo(() => getDeviceTier(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  return (
    <div className="relative w-full h-full" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0.4, 6.6], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
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
        }}
        frameloop="always"
        className="bg-transparent"
        dpr={tier === 'low' ? 1 : [1, 1.75]}
      >
        {/* Iluminación base */}
        <ambientLight intensity={0.35} color="#0b2b31" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -4, -5]} intensity={0.5} color="#00f5d4" />

        {/* Luces puntuales cian y azul suave: brillo bioluminiscente */}
        <pointLight position={[0, 3.2, 0]} intensity={22} color="#00f5d4" distance={12} decay={2} />
        <pointLight position={[0, -2.4, 0]} intensity={14} color="#22d3ee" distance={10} decay={2} />
        <pointLight position={[3.2, 0.6, 2.4]} intensity={12} color="#3b82f6" distance={10} decay={2} />
        <pointLight position={[-3.2, -0.6, -2.4]} intensity={9} color="#67e8f9" distance={9} decay={2} />

        {tier !== 'low' && (
          <Environment resolution={128} background={false}>
            <group rotation={[-Math.PI / 4, 0, 0]}>
              <Lightformer
                form="rect"
                intensity={3}
                color="#00f5d4"
                scale={[12, 12, 1]}
                position={[0, 6, -10]}
              />
              <Lightformer
                form="rect"
                intensity={2}
                color="#3b82f6"
                scale={[10, 10, 1]}
                position={[-8, 2, -2]}
                rotation-y={Math.PI / 2}
              />
              <Lightformer
                form="circle"
                intensity={1.5}
                color="#22d3ee"
                scale={4}
                position={[0, -4, 0]}
                rotation-x={Math.PI / 2}
              />
            </group>
          </Environment>
        )}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enableZoom
          enablePan={false}
          minDistance={3.4}
          maxDistance={9.5}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI - 0.2}
          autoRotate={false}
          autoRotateSpeed={0.3}
        />

        <MicelleScene
          hotspots={hotspots}
          dispersionRef={dispersionRef}
          onDisperseChange={setIsDispersed}
          reduced={reduced}
          tier={tier}
          buttonRefs={buttonRefs}
          dotRefs={dotRefs}
        />
      </Canvas>

      {/* Overlay de hotspots: se posiciona por proyección 3D→2D (sin portal) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hotspots.map((h, i) => {
          const isActive = activeHotspot === h.id;
          return (
            <span key={`dot-${h.id}`}>
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                aria-hidden="true"
                className={`absolute left-0 top-0 block h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                  isActive
                    ? 'border-teal-300 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.9)]'
                    : 'border-teal-200/70 bg-teal-400/50'
                }`}
                style={{ transform: 'translate3d(-9999px,-9999px,0)', opacity: 0 }}
              />
              <button
                type="button"
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                onClick={() => onHotspotSelect(h.id)}
                onMouseEnter={() => onHotspotSelect(h.id)}
                aria-pressed={isActive}
                aria-label={h.title}
                className={`absolute left-0 top-0 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap backdrop-blur-sm transition-colors duration-300 pointer-events-auto ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-700/50 hover:border-teal-500/40 hover:text-teal-300'
                }`}
                style={{ transform: 'translate3d(-9999px,-9999px,0)', opacity: 0 }}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-teal-400/60 animate-ping" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                </span>
                <span className="font-mono tabular-nums">{h.num}</span>
                <span className="hidden sm:inline">{h.short}</span>
              </button>
            </span>
          );
        })}
      </div>

      {/* Indicador de dispersión */}
      <div className="pointer-events-none absolute top-4 left-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-500 ${
            isDispersed
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-teal-500/10 text-teal-400/60 border border-teal-500/20'
          }`}
        >
          {isDispersed ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Micela dispersa — Acércate para re-ensamblar
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Micela compacta — Aleja para liberar bioactivos
            </>
          )}
        </div>
      </div>
    </div>
  );
}
