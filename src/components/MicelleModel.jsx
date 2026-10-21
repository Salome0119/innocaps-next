'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   MICELLE MODEL — Modelo procedural de micela para fondo 3D
   Núcleo emisivo + cáscara translúcida + partículas orbitando
   Tier-aware + prefers-reduced-motion
   ════════════════════════════════════════════════════════════════ */

function createMicelleMaterials(tier) {
  const glowSize = tier === 'low' ? 64 : 128;
  
  // Textura de glow procedural
  const canvas = document.createElement('canvas');
  canvas.width = glowSize;
  canvas.height = glowSize;
  const ctx = canvas.getContext('2d');
  const c = glowSize / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(0,245,212,0.6)');
  gradient.addColorStop(0.5, 'rgba(0,210,180,0.2)');
  gradient.addColorStop(1, 'rgba(0,245,212,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, glowSize, glowSize);
  const glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;

  return {
    // Núcleo central emisivo
    core: new THREE.MeshBasicMaterial({
      color: '#00f5d4',
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    }),
    
    // Cáscara translúcida con fresnel
    shell: new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00f5d4') },
        uColorOuter: { value: new THREE.Color('#00d2b4') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uColorOuter;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float facing = dot(vNormal, vViewDir);
          float fresnel = pow(1.0 - facing, 2.5);
          float pulse = 0.5 + 0.5 * sin(uTime * 1.2);
          vec3 color = mix(uColor, uColorOuter, fresnel * pulse);
          float alpha = 0.15 + fresnel * 0.45 + pulse * 0.15;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    }),
    
    // Halo exterior
    halo: new THREE.SpriteMaterial({
      map: glowTexture,
      color: new THREE.Color('#00f5d4'),
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    
    // Partículas orbitando
    particle: new THREE.SpriteMaterial({
      map: glowTexture,
      color: new THREE.Color('#5eead4'),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    
    glowTexture,
  };
}

// Generador pseudoaleatorio determinista para posiciones estables
function makeRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function MicelleCore({ materials, reduced }) {
  const coreRef = useRef();
  const shellRef = useRef();
  const haloRef = useRef();
  const particlesRef = useRef();
  const materialsRef = useRef(materials);
  
  // Actualizar ref cuando cambien materials
  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);
  
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const mats = materialsRef.current;
    
    if (coreRef.current) {
      // Pulso sutil del núcleo
      const pulse = reduced ? 1 : 1 + Math.sin(t * 1.5) * 0.08;
      coreRef.current.scale.setScalar(pulse);
    }
    
    if (shellRef.current) {
      // Rotación lenta de la cáscara
      if (!reduced) {
        shellRef.current.rotation.y += dt * 0.05;
        shellRef.current.rotation.x += dt * 0.02;
      }
      mats.shell.uniforms.uTime.value = t;
    }
    
    if (haloRef.current) {
      // Halo pulsante
      const haloPulse = reduced ? 1 : 1 + Math.sin(t * 0.8) * 0.15;
      haloRef.current.scale.setScalar(haloPulse * 2.5);
      mats.halo.opacity = reduced ? 0.2 : 0.15 + Math.sin(t * 0.8) * 0.1;
    }
    
    if (particlesRef.current && !reduced) {
      particlesRef.current.rotation.y += dt * 0.03;
      particlesRef.current.rotation.x += dt * 0.01;
    }
  });
  
  // Partículas orbitando (creadas una sola vez con posiciones deterministas)
  const particles = useMemo(() => {
    const group = new THREE.Group();
    const count = 12;
    const rnd = makeRandom(20261021); // Seed fija para consistencia
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8 + rnd() * 0.5;
      const height = (rnd() - 0.5) * 1.2;
      const sprite = new THREE.Sprite(materials.particle);
      sprite.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      sprite.scale.setScalar(0.08 + rnd() * 0.06);
      group.add(sprite);
    }
    return group;
  }, [materials.particle]);
  
  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <primitive object={materials.core} attach="material" />
      </mesh>
      
      <mesh ref={shellRef}>
        <sphereGeometry args={[1.4, 48, 48]} />
        <primitive object={materials.shell} attach="material" />
      </mesh>
      
      <sprite ref={haloRef} scale={2.5}>
        <primitive object={materials.halo} attach="material" />
      </sprite>
      
      <group ref={particlesRef}>
        {particles.children.map((child, i) => (
          <primitive key={i} object={child} />
        ))}
      </group>
    </group>
  );
}

export default function MicelleModel({ tier, reduced }) {
  const materials = useMemo(() => createMicelleMaterials(tier), [tier]);
  
  useEffect(() => {
    return () => {
      Object.values(materials).forEach(m => {
        if (m?.dispose) m.dispose();
        if (m?.map?.dispose) m.map.dispose();
        if (m?.uniforms) Object.values(m.uniforms).forEach(u => u.value?.dispose?.());
      });
    };
  }, [materials]);
  
  return <MicelleCore materials={materials} reduced={reduced} />;
}