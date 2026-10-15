'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, IcosahedronGeometry, ShaderMaterial, DoubleSide } from 'three';

/* ═══════════════════════════════════════════
   ORGANIC NUCLEUS — "El Prisma de la Evolución"
   GPU-driven vertex displacement with GLSL noise.
   Subdivision 5 (~5K verts) instead of 64 (~40K).
   All noise + normals computed on GPU.
   ═══════════════════════════════════════════ */

/* ---------- Morph presets per industry ---------- */
const PRESETS = {
  animal: {
    frequency: 2.2, amplitude: 0.38, speed: 0.35, baseRadius: 1.55,
    color1: [0.976, 0.451, 0.086], emissive: [0.486, 0.176, 0.071],
    roughness: 0.55, metalness: 0.15,
  },
  cosmetic: {
    frequency: 1.3, amplitude: 0.22, speed: 0.2, baseRadius: 1.5,
    color1: [0.910, 0.475, 0.976], emissive: [0.345, 0.110, 0.529],
    roughness: 0.05, metalness: 0.85,
  },
  human: {
    frequency: 1.8, amplitude: 0.3, speed: 0.25, baseRadius: 1.5,
    color1: [0.078, 0.722, 0.651], emissive: [0.059, 0.463, 0.431],
    roughness: 0.2, metalness: 0.5,
  },
  agro: {
    frequency: 2.5, amplitude: 0.35, speed: 0.3, baseRadius: 1.45,
    color1: [0.133, 0.773, 0.369], emissive: [0.078, 0.325, 0.176],
    roughness: 0.45, metalness: 0.1,
  },
};

function lerp(a, b, t) { return a + (b - a) * t; }

/* ---------- GLSL Shaders ---------- */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uSpeed;
  uniform float uBaseRadius;

  varying vec3 vNormal;
  varying vec3 vViewPos;

  // Layered sin-based FBM (matches original look)
  float fbm(vec3 p, float t) {
    float v = 0.0;
    v += 0.5    * sin(p.x * 1.2 + t * 0.7 + p.y * 0.8);
    v += 0.25   * sin(p.y * 2.3 - t * 0.5 + p.z * 1.5);
    v += 0.125  * sin(p.z * 3.1 + t * 0.9 + p.x * 1.8);
    v += 0.0625 * sin((p.x + p.y + p.z) * 4.0 - t * 1.2);
    return v;
  }

  void main() {
    vec3 dir = normalize(position);
    float t = uTime * uSpeed;
    float noise = fbm(dir * uFrequency, t);
    float r = uBaseRadius + noise * uAmplitude;
    vec3 displaced = dir * r;

    // Compute normal via finite differences on GPU
    float eps = 0.001;
    vec3 tangent1 = normalize(cross(dir, vec3(0.0, 1.0, 0.0)));
    if (length(cross(dir, vec3(0.0, 1.0, 0.0))) < 0.001) {
      tangent1 = normalize(cross(dir, vec3(1.0, 0.0, 0.0)));
    }
    vec3 tangent2 = normalize(cross(dir, tangent1));

    vec3 d1 = normalize(dir + tangent1 * eps);
    float r1 = uBaseRadius + fbm(d1 * uFrequency, t) * uAmplitude;
    vec3 p1 = d1 * r1;

    vec3 d2 = normalize(dir + tangent2 * eps);
    float r2 = uBaseRadius + fbm(d2 * uFrequency, t) * uAmplitude;
    vec3 p2 = d2 * r2;

    vNormal = normalize(cross(p1 - displaced, p2 - displaced));
    vNormal = normalMatrix * vNormal;

    vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEmissive;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vViewPos);

    // Simple PBR-like shading
    vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Fresnel for clearcoat-like effect
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    // Specular
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), mix(8.0, 128.0, 1.0 - uRoughness));
    
    vec3 ambient = uColor * 0.15;
    vec3 diffuse = uColor * diff * 0.7;
    vec3 specular = mix(vec3(0.04), uColor, uMetalness) * spec * 0.8;
    vec3 emissiveContrib = uEmissive * 0.35;
    
    vec3 finalColor = ambient + diffuse + specular + emissiveContrib + fresnel * 0.15;
    
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

/* ---------- MAIN MESH ---------- */
export default function OrganicNucleus({ activePreset = 'human' }) {
  const meshRef = useRef();

  const state = useRef({
    frequency: PRESETS.human.frequency,
    amplitude: PRESETS.human.amplitude,
    speed: PRESETS.human.speed,
    baseRadius: PRESETS.human.baseRadius,
    roughness: PRESETS.human.roughness,
    metalness: PRESETS.human.metalness,
    color: [...PRESETS.human.color1],
    emissive: [...PRESETS.human.emissive],
  });

  // Subdivision 5 (~5K verts) — plenty smooth, 8x fewer than before
  const geo = useMemo(() => new IcosahedronGeometry(1.5, 5), []);

  const material = useMemo(() => new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uFrequency: { value: PRESETS.human.frequency },
      uAmplitude: { value: PRESETS.human.amplitude },
      uSpeed: { value: PRESETS.human.speed },
      uBaseRadius: { value: PRESETS.human.baseRadius },
      uColor: { value: new Color(...PRESETS.human.color1) },
      uEmissive: { value: new Color(...PRESETS.human.emissive) },
      uRoughness: { value: PRESETS.human.roughness },
      uMetalness: { value: PRESETS.human.metalness },
      uOpacity: { value: 0.92 },
    },
    transparent: true,
    side: DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const t = clock.elapsedTime;
    const s = state.current;
    const preset = PRESETS[activePreset] || PRESETS.human;
    const lt = 0.04;

    // Lerp scalar params
    s.frequency = lerp(s.frequency, preset.frequency, lt);
    s.amplitude = lerp(s.amplitude, preset.amplitude, lt);
    s.speed = lerp(s.speed, preset.speed, lt);
    s.baseRadius = lerp(s.baseRadius, preset.baseRadius, lt);
    s.roughness = lerp(s.roughness, preset.roughness, lt);
    s.metalness = lerp(s.metalness, preset.metalness, lt);

    // Lerp colors
    for (let i = 0; i < 3; i++) {
      s.color[i] = lerp(s.color[i], preset.color1[i], lt);
      s.emissive[i] = lerp(s.emissive[i], preset.emissive[i], lt);
    }

    // Update uniforms (GPU-only, no CPU vertex work)
    const u = material.uniforms;
    u.uTime.value = t;
    u.uFrequency.value = s.frequency;
    u.uAmplitude.value = s.amplitude;
    u.uSpeed.value = s.speed;
    u.uBaseRadius.value = s.baseRadius;
    u.uRoughness.value = s.roughness;
    u.uMetalness.value = s.metalness;
    u.uColor.value.setRGB(s.color[0], s.color[1], s.color[2]);
    u.uEmissive.value.setRGB(s.emissive[0], s.emissive[1], s.emissive[2]);

    // Slow rotation
    mesh.rotation.y = t * 0.08;
    mesh.rotation.x = Math.sin(t * 0.12) * 0.15;
  });

  return (
    <mesh ref={meshRef} geometry={geo} material={material} />
  );
}
