'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getDeviceTier, prefersReducedMotion } from '../lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════
   PIPELINE 3D — Secuencia biotecnológica interactiva
   Nodos (microesferas bioluminiscentes) unidos por haces de luz
   con shaders aditivos y pulsos; bloom por capas de halo, foco de
   cámara sobre la etapa activa y navegación por arrastre horizontal.
   Tier-aware + prefers-reduced-motion. Todo procedural, cero assets.
   ═══════════════════════════════════════════════════════════════ */

const SPACING = 3.0;
const CAM_DIST = 6.5;
const CAM_FOV = 45;
const WORLD_H = 2 * Math.tan((CAM_FOV * Math.PI) / 360) * CAM_DIST;

const Y_PATTERN = [0.15, 0.6, 0, -0.5, 0.22];
const Z_PATTERN = [0, -0.35, 0.25, -0.2, 0.1];
const COLOR_PATTERN = ['#10b981', '#14b8a6', '#2dd4bf', '#22d3ee', '#67e8f9'];

function nodePosition(i, cache) {
  if (!cache[i]) {
    cache[i] = new THREE.Vector3(
      i * SPACING,
      Y_PATTERN[i % Y_PATTERN.length],
      Z_PATTERN[i % Z_PATTERN.length]
    );
  }
  return cache[i];
}

function nodeColor(i) {
  return COLOR_PATTERN[i % COLOR_PATTERN.length];
}

function makeRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ── Texturas procedurales (solo cliente) ─────────────────────── */

function createGlowTexture(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.22, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.14)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createNumberTexture(label, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const r = size * 0.42;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(3,20,23,0.9)';
  ctx.fill();
  ctx.lineWidth = size * 0.05;
  ctx.strokeStyle = '#2dd4bf';
  ctx.stroke();
  ctx.fillStyle = '#e6fffb';
  ctx.font = `bold ${Math.round(size * 0.44)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(label), c, c + size * 0.02);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ── Shader del haz de luz (trazo continuo + pulsos viajeros) ── */

function createBeamMaterial(colorA, colorB, strength) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMotion: { value: 1 },
      uStrength: { value: strength },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uProgress;
      uniform float uMotion;
      uniform float uStrength;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;

      void main() {
        float t = vUv.x;
        vec3 color = mix(uColorA, uColorB, t);
        float lit = 1.0 - smoothstep(uProgress - 0.02, uProgress + 0.07, t);
        float wave = 0.5 + 0.5 * sin(t * 42.0 - uTime * 2.6);
        float head = fract(uTime * 0.14);
        float dist = abs(t - head);
        dist = min(dist, 1.0 - dist);
        float pulse = exp(-dist * dist * 900.0);
        float alpha = (0.13 + wave * 0.06 * uMotion + pulse * 0.9 * uMotion + lit * 0.45) * uStrength;
        vec3 glow = color * (1.0 + pulse * 1.8 * uMotion + lit * 0.6);
        gl_FragColor = vec4(glow, clamp(alpha, 0.0, 1.0));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

/* ── Shader de la cáscara del nodo (fresnel + foco activo) ───── */

function createShellMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uActive: { value: 0 },
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
      uniform float uActive;
      varying vec3 vNormalV;
      varying vec3 vView;
      void main() {
        float facing = clamp(dot(normalize(vNormalV), normalize(vView)), 0.0, 1.0);
        float fresnel = pow(1.0 - facing, 2.2);
        float glow = fresnel * (0.4 + uActive * 1.0);
        vec3 color = mix(uColor, vec3(1.0), uActive * 0.35);
        gl_FragColor = vec4(color * (1.0 + uActive), glow);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/* ── Nodo bioluminiscente ────────────────────────────────────── */

function PipelineNode({
  index,
  position,
  color,
  isActive,
  onSelect,
  onNodeOver,
  onNodeOut,
  glowTexture,
  numberTexture,
  reduced,
  dragState,
}) {
  const floatRef = useRef();
  const ringRef = useRef();
  const coreRef = useRef();
  const haloRef = useRef();
  const wideRef = useRef();
  const burstRef = useRef();
  const focus = useRef(0);
  const timeRef = useRef(0);
  const burstStart = useRef(-10);

  const materials = useMemo(() => {
    const tint = new THREE.Color(color);
    return {
      shell: createShellMaterial(color),
      core: new THREE.MeshBasicMaterial({ color: tint, toneMapped: false }),
      halo: new THREE.SpriteMaterial({
        map: glowTexture,
        color: tint,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      wide: new THREE.SpriteMaterial({
        map: glowTexture,
        color: tint,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      number: new THREE.SpriteMaterial({
        map: numberTexture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
      ring: new THREE.MeshBasicMaterial({
        color: tint,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      burst: new THREE.MeshBasicMaterial({
        color: tint,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      hit: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      }),
    };
  }, [color, glowTexture, numberTexture]);

  /* Espejo local: las animaciones de frame mutan a través de este ref */
  const mats = useRef(materials);
  useEffect(() => {
    mats.current = materials;
  }, [materials]);

  useEffect(() => {
    const m = materials;
    return () => {
      m.shell.dispose();
      m.core.dispose();
      m.halo.dispose();
      m.wide.dispose();
      m.number.dispose();
      m.ring.dispose();
      m.burst.dispose();
      m.hit.dispose();
    };
  }, [materials]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const current = mats.current;
    timeRef.current = t;

    focus.current = THREE.MathUtils.damp(focus.current, isActive ? 1 : 0, 6, dt);
    current.shell.uniforms.uActive.value = focus.current;

    const breathe = reduced ? 0 : Math.sin(t * 1.5 + index * 1.3);
    const pulse = 1 + breathe * 0.05;
    const boost = 1 + focus.current * 0.7;

    if (floatRef.current) {
      floatRef.current.position.y = reduced ? 0 : Math.sin(t * 0.9 + index * 1.7) * 0.07;
      floatRef.current.scale.setScalar(1 + focus.current * 0.12 + (reduced ? 0 : breathe * 0.02));
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1.3 * pulse * boost);
      current.halo.opacity = 0.35 + focus.current * 0.45;
    }
    if (wideRef.current) {
      wideRef.current.scale.setScalar(3.1 * pulse * (1 + focus.current * 0.55));
      current.wide.opacity = 0.11 + focus.current * 0.16;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + focus.current * 0.3 + (reduced ? 0 : breathe * 0.06));
    }
    if (ringRef.current) {
      if (!reduced) {
        ringRef.current.rotation.z += dt * 0.35;
        ringRef.current.rotation.x = Math.sin(t * 0.6 + index) * 0.35;
      }
      current.ring.opacity = 0.18 + focus.current * 0.55;
    }

    const age = t - burstStart.current;
    if (burstRef.current) {
      if (!reduced && age >= 0 && age < 1.1) {
        burstRef.current.visible = true;
        burstRef.current.scale.setScalar(1 + age * 2.6);
        burstRef.current.rotation.z = age * 1.2;
        current.burst.opacity = 0.85 * (1 - age / 1.1);
      } else {
        burstRef.current.visible = false;
        current.burst.opacity = 0;
      }
    }
  });

  const handleOver = (event) => {
    event.stopPropagation();
    onNodeOver(index);
  };

  const handleOut = () => {
    onNodeOut();
  };

  const handleSelect = (event) => {
    event.stopPropagation();
    if (dragState.current.moved) return;
    burstStart.current = timeRef.current;
    onSelect(index);
  };

  return (
    <group position={position}>
      <group ref={floatRef}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.14, 24, 24]} />
          <primitive object={materials.core} attach="material" />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.34, 32, 32]} />
          <primitive object={materials.shell} attach="material" />
        </mesh>

        <mesh ref={ringRef}>
          <torusGeometry args={[0.52, 0.008, 6, 72]} />
          <primitive object={materials.ring} attach="material" />
        </mesh>

        <mesh ref={burstRef} visible={false} rotation={[Math.PI / 2.6, 0, 0]}>
          <ringGeometry args={[0.5, 0.58, 56]} />
          <primitive object={materials.burst} attach="material" />
        </mesh>

        <sprite ref={haloRef}>
          <primitive object={materials.halo} attach="material" />
        </sprite>

        <sprite ref={wideRef}>
          <primitive object={materials.wide} attach="material" />
        </sprite>

        <sprite position={[0, 0.85, 0]} scale={[0.5, 0.5, 1]}>
          <primitive object={materials.number} attach="material" />
        </sprite>

        <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleSelect}>
          <sphereGeometry args={[0.62, 16, 16]} />
          <primitive object={materials.hit} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/* ── Polvo nanotecnológico de fondo ──────────────────────────── */

function NanoDust({ count, spanX, reduced }) {
  const geometry = useMemo(() => {
    const rnd = makeRandom(20261020);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -3 + rnd() * spanX;
      positions[i * 3 + 1] = (rnd() - 0.5) * 4.8;
      positions[i * 3 + 2] = (rnd() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, spanX]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const pointsRef = useRef();

  useFrame((state) => {
    if (reduced || !pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.position.y = Math.sin(t * 0.25) * 0.16;
    pointsRef.current.position.z = Math.sin(t * 0.18) * 0.12;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#2dd4bf"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Secuencia completa dentro del grupo desplazable ─────────── */

function PipelineSequence({
  stages,
  active,
  onSelect,
  onNodeOver,
  onNodeOut,
  dragState,
  onDecay,
  tier,
  reduced,
}) {
  const groupRef = useRef();
  const camRef = useRef(null);
  const pointerRef = useRef(null);
  const timeRef = useRef(0);
  const count = stages.length;
  const last = Math.max(count - 1, 1);
  const positionCache = useMemo(() => ({}), []);

  const textures = useMemo(() => {
    const glowSize = tier === 'low' ? 64 : 128;
    const numberSize = tier === 'low' ? 64 : 128;
    return {
      glow: createGlowTexture(glowSize),
      numbers: stages.map((_, i) => createNumberTexture(i + 1, numberSize)),
    };
  }, [stages, tier]);

  const beams = useMemo(() => {
    const points = stages.map((_, i) => nodePosition(i, positionCache).clone());
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.4);
    return {
      line: new THREE.TubeGeometry(curve, 240, 0.022, 8, false),
      beam: new THREE.TubeGeometry(curve, 200, 0.13, 8, false),
      materials: {
        line: createBeamMaterial('#2dd4bf', '#22d3ee', 1),
        beam: createBeamMaterial('#14b8a6', '#0891b2', 0.5),
      },
    };
  }, [stages, positionCache]);

  /* Espejo local: los uniforms se animan a través de este ref */
  const beamState = useRef(beams);
  useEffect(() => {
    beamState.current = beams;
  }, [beams]);

  useEffect(() => {
    const { line, beam, materials } = beams;
    return () => {
      line.dispose();
      beam.dispose();
      materials.line.dispose();
      materials.beam.dispose();
    };
  }, [beams]);

  useEffect(() => {
    const tex = textures;
    return () => {
      tex.glow.dispose();
      tex.numbers.forEach((t) => t.dispose());
    };
  }, [textures]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const motion = reduced ? 0 : 1;
    if (motion) timeRef.current += dt;
    const t = timeRef.current;
    const current = beamState.current;
    const lineMat = current.materials.line;
    const beamMat = current.materials.beam;

    lineMat.uniforms.uTime.value = t;
    beamMat.uniforms.uTime.value = t;
    lineMat.uniforms.uMotion.value = motion;
    beamMat.uniforms.uMotion.value = motion;
    const progress = active / last;
    lineMat.uniforms.uProgress.value = progress;
    beamMat.uniforms.uProgress.value = progress;

    onDecay(dt);

    const drag = dragState.current;
    const base = drag.dragging ? -drag.startIndex * SPACING : -active * SPACING;
    const goal = base + drag.offset;

    if (groupRef.current) {
      groupRef.current.position.x = reduced
        ? goal
        : THREE.MathUtils.damp(groupRef.current.position.x, goal, 7, dt);
    }

    if (!reduced) {
      camRef.current = state.camera;
      pointerRef.current = state.pointer;
      camRef.current.position.x = THREE.MathUtils.damp(
        camRef.current.position.x,
        pointerRef.current.x * 0.4,
        3,
        dt
      );
      camRef.current.position.y = THREE.MathUtils.damp(
        camRef.current.position.y,
        pointerRef.current.y * 0.25,
        3,
        dt
      );
    }
  });

  const dustCount = tier === 'low' ? 90 : 220;

  return (
    <group ref={groupRef}>
      <mesh geometry={beams.beam} material={beams.materials.beam} />
      <mesh geometry={beams.line} material={beams.materials.line} />

      {stages.map((stage, index) => (
        <PipelineNode
          key={stage.id ?? index}
          index={index}
          position={nodePosition(index, positionCache)}
          color={nodeColor(index)}
          isActive={active === index}
          onSelect={onSelect}
          onNodeOver={onNodeOver}
          onNodeOut={onNodeOut}
          glowTexture={textures.glow}
          numberTexture={textures.numbers[index]}
          reduced={reduced}
          dragState={dragState}
        />
      ))}

      <NanoDust count={dustCount} spanX={(count - 1) * SPACING + 6} reduced={reduced} />
    </group>
  );
}

/* Iconos SVG lineales por etapa (estética tech); fallback al emoji del dato */
function StageIcon({ index, fallback }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  if (index === 0) {
    /* Consulta — burbuja de mensaje */
    return (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (index === 1) {
    /* Planificación — documento */
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  }
  if (index === 2) {
    /* Especialistas — red de usuarios */
    return (
      <svg {...common}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (index === 3) {
    /* Desarrollo — engranaje */
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  if (index === 4) {
    /* Entrega — check circular */
    return (
      <svg {...common}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m22 4-10 10.01-3-3" />
      </svg>
    );
  }
  return (
    <span className="text-lg leading-none" aria-hidden="true">
      {fallback}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL — visor + HUD (DOM accesible) + drag horizontal
   ═══════════════════════════════════════════════════════════════ */

export default function PipelineScene3D({ stages, active, onSelect, onHover }) {
  const containerRef = useRef(null);
  const sizeRef = useRef({ height: 460 });
  const dragState = useRef({ dragging: false, startIndex: 0, offset: 0, moved: false });
  const activeRef = useRef(active);
  const axisRef = useRef(null);
  const originRef = useRef(null);

  const tier = useMemo(() => getDeviceTier(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const stage = stages[active] ?? stages[0];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) sizeRef.current.height = h;
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const worldPerPx = () => WORLD_H / (sizeRef.current.height || 460);

  const clampIndex = (value) => Math.min(stages.length - 1, Math.max(0, value));

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    originRef.current = { x: event.clientX, y: event.clientY };
    axisRef.current = null;
    const drag = dragState.current;
    drag.dragging = false;
    drag.moved = false;
    drag.startIndex = activeRef.current;
    drag.offset = 0;
  };

  const handlePointerMove = (event) => {
    if (!originRef.current) return;
    const dx = event.clientX - originRef.current.x;
    const dy = event.clientY - originRef.current.y;

    if (!axisRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axisRef.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      if (axisRef.current === 'x') {
        const drag = dragState.current;
        drag.dragging = true;
        drag.moved = true;
        drag.startIndex = activeRef.current;
        drag.offset = 0;
      }
    }
    if (axisRef.current !== 'x') return;

    const drag = dragState.current;
    const offset = dx * worldPerPx();
    drag.offset = offset;
    const next = clampIndex(Math.round(drag.startIndex - offset / SPACING));
    if (next !== activeRef.current) {
      activeRef.current = next;
      onSelect(next);
    }
  };

  const handlePointerEnd = () => {
    const drag = dragState.current;
    if (drag.dragging) {
      const offset = drag.offset;
      const next = clampIndex(Math.round(drag.startIndex - offset / SPACING));
      drag.offset = offset + (next - drag.startIndex) * SPACING;
      drag.dragging = false;
      activeRef.current = next;
      onSelect(next);
    }
    axisRef.current = null;
    originRef.current = null;
  };

  const decayOffset = useCallback((dt) => {
    const drag = dragState.current;
    if (!drag.dragging && Math.abs(drag.offset) > 0.0001) {
      drag.offset = THREE.MathUtils.damp(drag.offset, 0, 5, dt);
    }
  }, []);

  const endRef = useRef(handlePointerEnd);
  useEffect(() => {
    endRef.current = handlePointerEnd;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onGlobalEnd = () => endRef.current();
    window.addEventListener('pointerup', onGlobalEnd);
    window.addEventListener('pointercancel', onGlobalEnd);
    return () => {
      window.removeEventListener('pointerup', onGlobalEnd);
      window.removeEventListener('pointercancel', onGlobalEnd);
    };
  }, []);

  const handleNodeOver = useCallback(
    (index) => {
      onHover(index);
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';
    },
    [onHover]
  );

  const handleNodeOut = useCallback(() => {
    if (containerRef.current) containerRef.current.style.cursor = '';
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[340px] sm:h-[400px] md:h-[460px] w-full select-none overflow-hidden rounded-3xl border border-slate-800 bg-[#031417] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      role="group"
      aria-label="Visualización 3D del pipeline: arrastra horizontalmente o selecciona una etapa"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(45,212,191,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.08) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(3,20,23,0) 30%, rgba(3,20,23,0.92) 100%)',
        }}
      />

      <Canvas
        dpr={tier === 'low' ? 1 : [1, 1.75]}
        camera={{ position: [0, 0, CAM_DIST], fov: CAM_FOV, near: 0.1, far: 40 }}
        gl={{
          alpha: true,
          antialias: tier !== 'low',
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <PipelineSequence
          stages={stages}
          active={active}
          onSelect={onSelect}
          onNodeOver={handleNodeOver}
          onNodeOut={handleNodeOut}
          dragState={dragState}
          onDecay={decayOffset}
          tier={tier}
          reduced={reduced}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-4 md:p-6">
        {/* Dots de progreso */}
        <div className="flex items-start justify-end" aria-hidden="true">
          <div className="flex items-center gap-1.5">
            {stages.map((item, index) => (
              <span
                key={item.id ?? index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active ? 'w-6 bg-[#2dd4bf]' : 'w-1.5 bg-[#2dd4bf]/25'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tarjeta HUD centrada, unida al nodo activo por un conector luminoso
            (el foco de cámara centra el nodo activo, así la línea lo apunta) */}
        <div className="mt-auto flex flex-col items-center" aria-live="polite">
          <div
            key={`beacon-${active}`}
            aria-hidden="true"
            className="relative h-8 w-4 md:h-10"
            style={{ animation: 'fadeInUp 0.4s ease-out both' }}
          >
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#2dd4bf] via-[#2dd4bf]/40 to-transparent" />
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5eead4] shadow-[0_0_12px_rgba(45,212,191,0.9)]" />
            <span
              className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-[#2dd4bf]/60"
              style={{ animation: 'hudBeacon 1.8s ease-out infinite' }}
            />
          </div>

          <div
            key={active}
            className="pointer-events-auto w-[min(100%,26rem)] rounded-2xl border border-[#2dd4bf]/30 bg-[#031417]/85 p-3.5 backdrop-blur-md md:p-4"
            style={{
              animation: 'hudCardIn 0.4s ease-out both',
              boxShadow:
                '0 10px 40px rgba(0,0,0,0.45), 0 0 30px rgba(45,212,191,0.10), inset 0 1px 0 rgba(45,212,191,0.15)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#2dd4bf] shadow-[0_0_18px_rgba(45,212,191,0.25)]">
                <StageIcon index={active} fallback={stage.icon} />
              </span>
              <span className="rounded-md border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5eead4]">
                {String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
              </span>
            </div>

            <h3 className="mt-2.5 text-sm font-bold leading-snug text-[#f8fafc] md:text-base">
              {stage.stage}
            </h3>
            <p className="mt-1 text-xs font-semibold text-[#2dd4bf] md:text-sm">
              {stage.description}
            </p>

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-[#2dd4bf]/35 to-transparent" />

            <p className="text-[11px] leading-relaxed text-[#94a3b8] md:text-xs">
              {stage.details}
            </p>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <Link
                href="/lab/proceso"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5eead4]/80 underline-offset-4 transition-colors duration-300 hover:text-[#5eead4] hover:underline"
              >
                Saber más
              </Link>
              {active < stages.length - 1 ? (
                <button
                  type="button"
                  onClick={() => onSelect(active + 1)}
                  className="group font-mono text-[10px] uppercase tracking-[0.2em] text-[#f8fafc]/70 transition-colors duration-300 hover:text-[#f8fafc]"
                >
                  Siguiente etapa{' '}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748b]">
                  Etapa final
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hint de drag */}
        <span className="pointer-events-none absolute bottom-4 right-6 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[#64748b] lg:block">
          arrastra para navegar
        </span>
      </div>
    </div>
  );
}
