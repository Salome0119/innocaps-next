'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { getDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';

/* ═══════════════════════════════════════════════════════════════════
   NANO BACKGROUND — capa de presentación de la home (/) y /nosotros
   Canvas WebGL fijo a pantalla completa con EffectComposer +
   UnrealBloomPass (three.js puro, sin dependencias nuevas), detrás
   del contenido (z-index 1). Escena procedural:
   instancias icosaédricas con shader propio (ensamblado↔disperso,
   latido ~128 BPM, Fresnel teal/lima), núcleo aditivo, burbujas,
   anillo de partículas y anillos finos. Interactividad: parallax de
   puntero + arrastre libre en X/Y con inercia (ratón y táctil) sin
   capturar enlaces, botones ni selección de texto. Gestiona también
   la barra de progreso de scroll y los reveals sutiles (solo donde
   hay secciones hijos directas de <main>, p. ej. la home).
   Degradación: DEVICE_TIER, prefers-reduced-motion, document.hidden.
   Spec: openspec/changes/diseno-nanotech-bloom-home
   ═══════════════════════════════════════════════════════════════════ */

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 aShell;
  attribute vec3 aScat;
  attribute float aSeed;
  attribute float aCol;
  attribute float aSize;
  uniform float uA;
  uniform float uT;
  uniform float uPulse;
  uniform float uScat;
  varying float vCol;
  varying float vSeed;
  varying float vScat;
  varying vec3 vNormalView;
  varying vec3 vViewDir;

  mat3 rotY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotX(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  void main() {
    float k = clamp(uA * 1.35 - aSeed * 0.35, 0.0, 1.0);
    float s = 1.0 - smoothstep(0.0, 1.0, k);
    /* Tope de separación: los módulos dispersos se quedan cerca de la
       esfera (radio comprimido a 0.6) en lugar de invadir la página */
    vec3 free = aScat * mix(1.0, 0.6, uScat);
    vec3 inst = mix(free, aShell, s);
    vec3 radial = normalize(inst + 0.0001);
    inst += radial * sin(uT * 1.6 + aSeed * 40.0) * 0.012;
    inst *= 1.0 + uPulse * 0.06;

    /* Dispersión al final del scroll: deriva radial discreta + tumble
       lento e independiente por instancia (cada módulo se "desengancha") */
    inst += radial * uScat * (0.08 + aSeed * 0.22);
    float tumble = uScat * (uT * (0.15 + aSeed * 0.35) + aSeed * 6.2831853);
    mat3 spin = rotX(tumble) * rotY(tumble * (0.55 + aSeed));

    vec3 transformed = spin * (position * aSize) + inst;
    vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
    vNormalView = normalize(normalMatrix * (spin * normal));
    vViewDir = normalize(-mv.xyz);
    vCol = aCol;
    vSeed = aSeed;
    vScat = uScat;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uMix;
  uniform float uPulse;
  uniform float uDim;
  varying float vCol;
  varying float vSeed;
  varying float vScat;
  varying vec3 vNormalView;
  varying vec3 vViewDir;

  void main() {
    vec3 teal = vec3(0.10, 0.72, 0.62);
    vec3 lime = vec3(0.58, 0.88, 0.24);
    vec3 deep = vec3(0.04, 0.30, 0.34);
    vec3 energy = vec3(0.45, 0.96, 0.92);

    vec3 n = normalize(vNormalView);
    vec3 v = normalize(vViewDir);
    vec3 base = mix(teal, lime, clamp(vCol * 0.55 + uMix * 0.45, 0.0, 1.0));
    float fres = pow(1.0 - abs(dot(n, v)), 2.4);
    float spec = pow(max(dot(reflect(-v, n), normalize(vec3(0.4, 0.7, 0.6))), 0.0), 22.0);

    vec3 col = base * (0.35 + fres * 1.25) * (0.85 + vSeed * 0.3);
    col += vec3(0.9, 1.0, 0.95) * spec * 0.65;
    col += base * uPulse * 0.5;
    col = mix(deep, col, 0.5 + fres * 0.5);

    /* Módulos independientes: ganan un toque de energía cian, sin
       saturar el bloom sobre las secciones inferiores */
    col = mix(col, energy * (0.55 + fres * 1.1), vScat * 0.3);
    col += energy * vScat * 0.1;

    /* Atenuación global (uDim): la home la deja en 1; el campo de
       /nosotros usa su propio shader. El canvas aplica
       mix-blend-mode: screen, así que bajar el color atenúa el brillo
       sin tocar el alfa */
    gl_FragColor = vec4(col * uDim, 1.0);
  }
`;

/* ── /nosotros: campo de partículas flotantes (polvo estelar
   bioluminiscente) — sustituye a la esfera densa de la home.
   Deriva orbital acotada por partícula, pulsos de brillo y una onda
   de luz que sigue al cursor. */
const FIELD_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aDir;
  attribute float aSeed;
  attribute vec3 aCol;
  attribute float aSize;
  uniform float uT;
  uniform float uPointScale;
  uniform vec2 uMouse; /* NDC suavizado del cursor */
  uniform vec2 uHalf; /* semitamaño del campo en unidades de mundo */
  varying vec3 vCol;
  varying float vGlow;

  void main() {
    /* Posición base repartida por todo el volumen del viewport (el eje
       Y lleva margen extra para que la deriva con scroll no deje
       huecos en los bordes superior/inferior) */
    vec3 p = position * vec3(uHalf.x, uHalf.y * 1.4, 1.6);

    /* Deriva orbital acotada: cada mota flota en su propia dirección
       aleatoria, sin envoltorios ni saltos visibles */
    float sp = 0.14 + aSeed * 0.3;
    p += aDir * vec3(
      sin(uT * sp + aSeed * 20.0),
      cos(uT * sp * 0.83 + aSeed * 13.0),
      sin(uT * sp * 0.61 + aSeed * 7.0)
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    /* Onda de luz biotecnológica que reacciona al cursor: las motas
       cercanas al puntero brillan y laten con un anillo en movimiento */
    vec2 ndc = clip.xy / max(clip.w, 0.0001);
    vec2 ar = vec2(uHalf.x / max(uHalf.y, 0.0001), 1.0);
    float md = distance(ndc * ar, uMouse * ar);
    float wave = smoothstep(0.8, 0.0, md);
    float pulse = 0.55 + 0.45 * sin(uT * (0.7 + aSeed * 1.8) + aSeed * 40.0);
    vGlow = pulse + wave * (0.9 + 0.5 * sin(uT * 2.6 - md * 9.0));
    vCol = aCol;

    /* Tamaño con pulsación de brillo y realce suave cerca del cursor */
    gl_PointSize = aSize * (0.75 + 0.5 * pulse) * (1.0 + wave * 0.6) *
      (uPointScale / max(-mv.z, 0.1));
    gl_Position = clip;
  }
`;

const FIELD_FRAGMENT_SHADER = /* glsl */ `
  uniform float uDim;
  varying vec3 vCol;
  varying float vGlow;

  void main() {
    /* Mota circular suave con núcleo brillante (polvo estelar) */
    float d = length(gl_PointCoord - 0.5);
    float disk = smoothstep(0.5, 0.08, d);
    float core = pow(smoothstep(0.3, 0.0, d), 2.0);
    vec3 col = vCol * (0.55 + vGlow * 0.95) + vec3(0.85, 1.0, 0.97) * core * 0.4;
    gl_FragColor = vec4(col * uDim, disk * (0.32 + min(vGlow, 1.7) * 0.34));
  }
`;

/* Gradiente de progreso de scroll a partir del cual la esfera empieza a dispersarse
   (el tramo final, ~último 35% de la página, hasta 1.0 = total) */
const DISPERSION_START = 0.75;
/* Tope de intensidad de la dispersión: muy conservador para que la
   escena "respire" al final del scroll sin invadir tarjetas de contenido */
const DISPERSION_AMP = 0.35;
const SCATTER_SPIN = 0.08;
const SCATTER_SCALE = 0.015;
const SCATTER_CORE = 0.15;
const SCATTER_RING = 0.1;
const SCATTER_TORI = 0.1;
const SCATTER_FADE = 0.5;

/* Gradiente ambiental (plano a pantalla completa): solo reenvía uv al
   fragment shader, que dibuja las manchas de luz y el halo del cursor */
const FIELD_AMBIENT_VERT = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FIELD_AMBIENT_FRAG = /* glsl */ `
  uniform float uT;
  uniform vec2 uMouse; /* uv 0..1 del cursor */
  uniform float uAspect;
  uniform float uDim;
  varying vec2 vUv;

  void main() {
    vec3 deep = vec3(0.02, 0.1, 0.18); /* azul profundo */
    vec3 cyan = vec3(0.176, 0.831, 0.749); /* #2dd4bf */
    vec3 lime = vec3(0.608, 0.863, 0.235); /* #9bdc3c */

    vec2 ar = vec2(uAspect, 1.0);

    /* Manchas que derivan con ondas suaves de luz */
    vec2 c1 = vec2(0.22 + 0.1 * sin(uT * 0.11), 0.3 + 0.08 * cos(uT * 0.09));
    vec2 c2 = vec2(0.78 + 0.09 * cos(uT * 0.07), 0.68 + 0.1 * sin(uT * 0.13));
    float g1 = smoothstep(0.75, 0.0, distance(vUv * ar, c1 * ar));
    float g2 = smoothstep(0.7, 0.0, distance(vUv * ar, c2 * ar));

    /* Halo que sigue al cursor con onda concéntrica sutil */
    float md = distance(vUv * ar, uMouse * ar);
    float halo = smoothstep(0.5, 0.0, md);
    float ring = (0.5 + 0.5 * sin(md * 22.0 - uT * 1.6)) * halo;

    vec3 col = deep * 0.5
      + cyan * g1 * 0.2
      + lime * g2 * 0.13
      + cyan * halo * 0.22
      + mix(cyan, lime, 0.5) * ring * 0.07;

    gl_FragColor = vec4(col * uDim, 1.0);
  }
`;

/* Paleta bioluminiscente del campo de /nosotros */
const FIELD_COLORS = ['#2dd4bf', '#9bdc3c', '#0f4c81']; /* cian, lima, azul profundo */

const KEYFRAMES = [
  { x: 0.38, y: 0.0, s: 1.0, asm: 0.0, mix: 0.0, core: 1.0, bub: 0.0, ring: 1.0 },
  { x: 0.0, y: -0.05, s: 0.8, asm: 0.4, mix: 0.5, core: 0.85, bub: 1.0, ring: 0.9 },
  { x: 0.0, y: 0.12, s: 0.65, asm: 0.8, mix: 1.0, core: 0.6, bub: 1.0, ring: 0.6 },
];

const smoothstep = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Índice de respuesta del parallax de puntero: mayor = más sensible */
const PARALLAX_LERP = 7.5;
const PARALLAX_SPIN_Y = 0.62;
const PARALLAX_SPIN_X = 0.34;

/* Arrastre de la escena (ratón + táctil) */
const TAU = Math.PI * 2;
const DRAG_SENS = 0.008; /* radianes por píxel arrastrado */
const DRAG_SMOOTH = 20; /* lerp de seguimiento del arrastre */
const DRAG_FRICTION = 2.4; /* decaimiento de la inercia al soltar */
const DRAG_LOCK_PX = 12; /* umbral de fijación de eje en táctil */

/* Objetos que nunca inician arrastre: navegación, controles y selección */
const DRAG_BLOCKERS =
  'a, button, input, textarea, select, label, summary, details, [role="button"], [role="link"], [role="menuitem"], [role="tab"], [contenteditable="true"], [draggable="true"]';
const DRAG_TEXT =
  'p, h1, h2, h3, h4, h5, h6, li, dt, dd, blockquote, pre, code, kbd, samp, span, strong, em, small, figcaption, caption, legend, .sr-only';
const lerpState = (a, b, t) => {
  const out = {};
  for (const key of Object.keys(a)) out[key] = lerp(a[key], b[key], t);
  return out;
};

function buildInstanceGeometry(count) {
  const base = new THREE.IcosahedronGeometry(1, 1);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.attributes.position);
  geo.setAttribute('normal', base.attributes.normal);
  geo.instanceCount = count;

  const axis = new THREE.Vector3(0.25, 0.12, 1).normalize();
  const dir = new THREE.Vector3();
  const shells = [];
  let i = 0;
  while (shells.length < count) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    i += 1;
    dir.set(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi)
    );
    if (dir.dot(axis) > 0.8) continue;
    shells.push(dir.clone().multiplyScalar(1.55));
  }

  const aShell = new Float32Array(count * 3);
  const aScat = new Float32Array(count * 3);
  const aSeed = new Float32Array(count);
  const aCol = new Float32Array(count);
  const aSize = new Float32Array(count);
  const scatter = new THREE.Vector3();

  for (let j = 0; j < count; j += 1) {
    aShell[j * 3] = shells[j].x;
    aShell[j * 3 + 1] = shells[j].y;
    aShell[j * 3 + 2] = shells[j].z;
    scatter.randomDirection().multiplyScalar(2.6 + Math.random() * 3.2);
    aScat[j * 3] = scatter.x;
    aScat[j * 3 + 1] = scatter.y;
    aScat[j * 3 + 2] = scatter.z;
    aSeed[j] = Math.random();
    aCol[j] = Math.random();
    aSize[j] = 0.045 + Math.random() * 0.03;
  }

  geo.setAttribute('aShell', new THREE.InstancedBufferAttribute(aShell, 3));
  geo.setAttribute('aScat', new THREE.InstancedBufferAttribute(aScat, 3));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  geo.setAttribute('aCol', new THREE.InstancedBufferAttribute(aCol, 1));
  geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(aSize, 1));
  base.dispose();
  return geo;
}

export default function NanoBackground({ variant = 'interactive' }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  /* 'interactive': escena arrastrable con efecto de scroll (home).
     'background': capa fija de fondo, sin puntero y sin deriva por scroll. */
  const variantRef = useRef(variant);

  useEffect(() => {
    const docEl = document.documentElement;
    const isBackground = variantRef.current === 'background';

    /* ── Barra de progreso de scroll (siempre, aunque falle WebGL) ── */
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let scrollP = 0;
    /* En reduced-motion no hay bucle: este gancho repinta un solo frame
       al interactuar (scroll o arrastre) para que la escena siga
       respondiendo al usuario sin animación continua */
    let repaintStatic = null;
    const onScrollProgress = () => {
      const max = docEl.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollP = max > 0 ? clamp01(window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
      scrollVel = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (repaintStatic) repaintStatic();
    };
    window.addEventListener('scroll', onScrollProgress, { passive: true });
    onScrollProgress();

    /* ── Reveals sutiles (enhancement progresivo: sin JS no ocultan nada) ── */
    docEl.classList.add('nano-js');
    /* Los reveals se inyectan DESPUÉS de la hidratación: si una sección
       vive dentro de un <Suspense> (p.ej. /bio), su subárbol hidrata más
       tarde y tocar sus atributos antes provoca un aviso de hydration
       mismatch en React. */
    let revealTargets = [];
    let revealObserver = null;
    const revealTimer = setTimeout(() => {
      revealTargets = Array.from(
        document.querySelectorAll(
          'main > section:not(:first-of-type) > div[class*="z-10"]'
        )
      );
      revealTargets.forEach((el, idx) => {
        el.classList.add('nano-rv');
        el.style.transitionDelay = `${(idx % 3) * 0.12}s`;
      });
      revealObserver =
        'IntersectionObserver' in window
          ? new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.18 }
            )
          : null;
      revealTargets.forEach((el) =>
        revealObserver ? revealObserver.observe(el) : el.classList.add('in')
      );
    }, 600);

    /* ── Escena WebGL (degradable) ── */
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      if (typeof window.WebGLRenderingContext === 'undefined') return undefined;
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: getDeviceTier() !== 'low',
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    const tier = getDeviceTier();
    const reduced = prefersReducedMotion();
    const isMobileViewport = () => window.innerWidth <= 900;
    const instanceCount = tier === 'high' ? 1500 : tier === 'mid' ? 1200 : 900;
    const ringCount = isMobileViewport() || tier === 'low' ? 260 : 520;

    /* ── Perfil de escena por ruta ──
       /nosotros no usa la esfera densa: en su lugar se monta un campo
       de partículas flotantes (polvo estelar bioluminiscente), brillante
       y reactivo al cursor. La legibilidad la sostienen los paneles
       .nano-glass del contenido. La home conserva su esfera. */
    const isAbout = Boolean(document.getElementById('nosotros'));
    const SCENE_DIM = isAbout ? 0.85 : 1; /* brillo del campo/escena */
    const BLOOM_MUL = isAbout ? 1.35 : 1; /* bloom resplandeciente */

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'low' ? 1.5 : 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    camera.position.set(0, 0, 8);

    /* ── Luces (intensidad atenuada en /nosotros: SCENE_DIM) ── */
    scene.add(new THREE.AmbientLight(0x6fd8c8, 0.55 * SCENE_DIM));
    const keyLight = new THREE.PointLight(0xffffff, 2.2 * SCENE_DIM);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const tealLight = new THREE.PointLight(0x2dd4bf, 40, 12);
    tealLight.position.set(-3, -1, 3);
    scene.add(tealLight);
    const coreLight = new THREE.PointLight(0x4fffc8, 8, 5);
    scene.add(coreLight);

    /* ── Grupo de escena (posición/escala/rotación por keyframes) ── */
    const group = new THREE.Group();
    scene.add(group);

    /* ── /nosotros: campo de partículas flotantes (polvo estelar
       bioluminiscente) — reemplaza a la esfera densa de la home ── */
    let fieldMat = null;
    let ambientMat = null;
    let aboutAmbient = null;
    if (isAbout) {
      const fieldCount = tier === 'high' ? 1900 : tier === 'mid' ? 1500 : 1000;
      const fPos = new Float32Array(fieldCount * 3);
      const fDir = new Float32Array(fieldCount * 3);
      const fSeed = new Float32Array(fieldCount);
      const fCol = new Float32Array(fieldCount * 3);
      const fSize = new Float32Array(fieldCount);
      const tmpColor = new THREE.Color();
      for (let i2 = 0; i2 < fieldCount; i2 += 1) {
        /* Posición normalizada: el shader la escala al viewport */
        fPos[i2 * 3] = (Math.random() - 0.5) * 2;
        fPos[i2 * 3 + 1] = (Math.random() - 0.5) * 2;
        fPos[i2 * 3 + 2] = (Math.random() - 0.5) * 2;
        /* Dirección/magnitud de flotación aleatoria por eje */
        fDir[i2 * 3] = 0.35 + Math.random() * 0.85;
        fDir[i2 * 3 + 1] = 0.35 + Math.random() * 0.85;
        fDir[i2 * 3 + 2] = 0.2 + Math.random() * 0.5;
        fSeed[i2] = Math.random();
        /* Paleta bioluminiscente: cian, lima y azul profundo */
        const roll = Math.random();
        tmpColor.set(FIELD_COLORS[roll < 0.46 ? 0 : roll < 0.8 ? 1 : 2]);
        tmpColor.offsetHSL((Math.random() - 0.5) * 0.04, 0, (Math.random() - 0.5) * 0.1);
        fCol[i2 * 3] = tmpColor.r;
        fCol[i2 * 3 + 1] = tmpColor.g;
        fCol[i2 * 3 + 2] = tmpColor.b;
        /* Tamaños variados: grano fino con alguna mota mayor */
        fSize[i2] = 0.012 + Math.pow(Math.random(), 2.4) * 0.05;
      }
      const fieldGeo = new THREE.BufferGeometry();
      fieldGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
      fieldGeo.setAttribute('aDir', new THREE.BufferAttribute(fDir, 3));
      fieldGeo.setAttribute('aSeed', new THREE.BufferAttribute(fSeed, 1));
      fieldGeo.setAttribute('aCol', new THREE.BufferAttribute(fCol, 3));
      fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(fSize, 1));
      fieldMat = new THREE.ShaderMaterial({
        vertexShader: FIELD_VERTEX_SHADER,
        fragmentShader: FIELD_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uT: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uHalf: { value: new THREE.Vector2(1, 1) },
          uPointScale: { value: 1 },
          uDim: { value: SCENE_DIM },
        },
      });
      const field = new THREE.Points(fieldGeo, fieldMat);
      field.frustumCulled = false;
      group.add(field);

      /* Gradiente ambiental: manchas de luz + halo que sigue al cursor */
      ambientMat = new THREE.ShaderMaterial({
        vertexShader: FIELD_AMBIENT_VERT,
        fragmentShader: FIELD_AMBIENT_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uT: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: 1 },
          uDim: { value: SCENE_DIM },
        },
      });
      aboutAmbient = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ambientMat);
      aboutAmbient.position.z = -5.5;
      aboutAmbient.renderOrder = -1;
      aboutAmbient.frustumCulled = false;
      scene.add(aboutAmbient);
    }

    /* Objetos de la escena home: se declaran aquí (y se asignan dentro
       del bloque) para que applyFrame, que vive fuera, pueda usarlos */
    let particleMat = null;
    let core = null;
    let heartMat = null;
    let bubbleGeo = null;
    let bubbleSpeed = null;
    let bubbleCount = 0;
    let bubbleMat = null;
    let ringGeo = null;
    let ringAngle = null;
    let ringSpeed = null;
    let ringRadius = null;
    let ringMat = null;
    let tori = [];

    if (!isAbout) {
      /* Instancias icosaédricas con shader custom */
      const particleGeo = buildInstanceGeometry(instanceCount);
      particleMat = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uA: { value: 0 },
          uT: { value: 0 },
          uMix: { value: 0 },
          uPulse: { value: 0 },
          uScat: { value: 0 },
          uDim: { value: SCENE_DIM },
        },
      });
      const particles = new THREE.Mesh(particleGeo, particleMat);
      particles.frustumCulled = false;
      group.add(particles);

      /* Núcleo: capas achatadas + moradas + esfera aditiva central */
      core = new THREE.Group();
      const plateGeo = new THREE.IcosahedronGeometry(0.5, 2);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x4fbf3a,
        emissive: 0x2d5a12,
        emissiveIntensity: 0.55,
        roughness: 0.45,
        metalness: 0.1,
      });
      for (let p = 0; p < 9; p += 1) {
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.scale.set(1, 0.09, 0.42);
        plate.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        plate.position.y = (p - 4) * 0.055;
        core.add(plate);
      }
      const beadGeo = new THREE.IcosahedronGeometry(1, 2);
      const beadMat = new THREE.MeshStandardMaterial({
        color: 0x3b1f66,
        emissive: 0x1a0b3a,
        emissiveIntensity: 0.8,
        roughness: 0.25,
        metalness: 0.3,
      });
      for (let b = 0; b < 14; b += 1) {
        const bead = new THREE.Mesh(beadGeo, beadMat);
        const r = 0.09 + Math.random() * 0.07;
        bead.scale.setScalar(r);
        bead.position.set(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 0.9,
          (Math.random() - 0.5) * 1.6
        );
        core.add(bead);
      }
      const heartGeo = new THREE.IcosahedronGeometry(0.34, 4);
      heartMat = new THREE.MeshBasicMaterial({
        color: 0x5ff0c0,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const heart = new THREE.Mesh(heartGeo, heartMat);
      core.add(heart);
      group.add(core);

      /* Burbujas ascendentes */
      bubbleCount = tier === 'low' ? 120 : 220;
      const bubblePos = new Float32Array(bubbleCount * 3);
      bubbleSpeed = new Float32Array(bubbleCount);
      for (let u = 0; u < bubbleCount; u += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.8;
        bubblePos[u * 3] = Math.cos(angle) * radius;
        bubblePos[u * 3 + 1] = (Math.random() - 0.5) * 2.8;
        bubblePos[u * 3 + 2] = Math.sin(angle) * radius;
        bubbleSpeed[u] = 0.08 + Math.random() * 0.25;
      }
      bubbleGeo = new THREE.BufferGeometry();
      bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePos, 3));
      bubbleMat = new THREE.PointsMaterial({
        color: 0xc8ff7a,
        size: 0.07,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
      bubbles.frustumCulled = false;
      group.add(bubbles);

      /* Anillo de partículas en órbita */
      const ringPos = new Float32Array(ringCount * 3);
      ringRadius = new Float32Array(ringCount);
      ringAngle = new Float32Array(ringCount);
      ringSpeed = new Float32Array(ringCount);
      for (let r = 0; r < ringCount; r += 1) {
        ringRadius[r] = 2.2 + Math.random() * 1.8;
        ringAngle[r] = Math.random() * Math.PI * 2;
        ringSpeed[r] = 0.06 + (r % 5) * 0.012;
      }
      ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
      ringMat = new THREE.PointsMaterial({
        color: 0x5ff0d8,
        size: 0.045,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ringParticles = new THREE.Points(ringGeo, ringMat);
      ringParticles.frustumCulled = false;
      group.add(ringParticles);

      /* Tres anillos finos */
      const torusRadii = [2.25, 2.7, 3.15];
      const torusColors = [0x2dd4bf, 0x9bdc3c, 0x2dd4bf];
      tori = torusRadii.map((radius, idx) => {
        const geo = new THREE.TorusGeometry(radius, 0.008, 8, 160);
        const mat = new THREE.MeshBasicMaterial({
          color: torusColors[idx],
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2 + (idx - 1) * 0.18;
        mesh.rotation.y = (idx - 1) * 0.22;
        group.add(mesh);
        return mesh;
      });
    } /* fin escena home (!isAbout) */

    /* ── Postprocesado: bloom ── */
    let composer = null;
    let bloomPass = null;
    const useBloom = tier !== 'low';
    if (useBloom) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(512, 512),
        (isMobileViewport() ? 0.22 : 0.32) * BLOOM_MUL,
        0.5,
        0.62
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    /* ── Medición de zonas por scroll ──
       La home usa secciones hijos directas de <main>; /nosotros las
       anida dentro de AboutPage (main > div > section). Se toman las
       secciones visibles de cualquier profundidad y se calculan sus
       centros en coordenadas de documento. */
    let zones = [0, 0, 0];
    const measureZones = () => {
      const all = Array.from(document.querySelectorAll('main section')).filter(
        (el) => el.offsetHeight > 200
      );
      if (all.length >= 3) {
        const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;
        const first = all[0];
        const middle = all[Math.floor(all.length / 2)];
        const last = all[all.length - 1];
        zones = [
          docTop(first) + first.offsetHeight / 2,
          docTop(middle) + middle.offsetHeight / 2,
          docTop(last) + last.offsetHeight / 2,
        ];
      } else {
        const max = Math.max(docEl.scrollHeight - window.innerHeight, 1);
        zones = [0, max * 0.5, max];
      }
    };
    const stateAt = (scrollMid) => {
      if (scrollMid <= zones[0]) return KEYFRAMES[0];
      if (scrollMid <= zones[1]) {
        const t = smoothstep((scrollMid - zones[0]) / Math.max(zones[1] - zones[0], 1));
        return lerpState(KEYFRAMES[0], KEYFRAMES[1], t);
      }
      const t = smoothstep((scrollMid - zones[1]) / Math.max(zones[2] - zones[1], 1));
      return lerpState(KEYFRAMES[1], KEYFRAMES[2], Math.min(t, 1));
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (composer) composer.setSize(w, h);
      if (bloomPass) bloomPass.strength = (isMobileViewport() ? 0.22 : 0.32) * BLOOM_MUL;
      /* Campo de /nosotros: límites del volumen, tamaño de punto y
         escala del gradiente ambiental al tamaño del viewport */
      if (fieldMat && ambientMat && aboutAmbient) {
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        fieldMat.uniforms.uHalf.value.set(
          tanHalf * camera.position.z * camera.aspect * 1.06,
          tanHalf * camera.position.z * 1.06
        );
        fieldMat.uniforms.uPointScale.value =
          (h * renderer.getPixelRatio()) / (2 * tanHalf);
        ambientMat.uniforms.uAspect.value = camera.aspect;
        const ambientDist = camera.position.z - aboutAmbient.position.z;
        const ambientHalf = tanHalf * ambientDist * 1.06;
        aboutAmbient.scale.set(ambientHalf * camera.aspect, ambientHalf, 1);
      }
      measureZones();
      onScrollProgress();
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Parallax de puntero (passive, sin capturar eventos) ── */
    let px = 0;
    let py = 0;
    let targetPx = 0;
    let targetPy = 0;
    const onPointerMove = (event) => {
      targetPx = (event.clientX / window.innerWidth) * 2 - 1;
      targetPy = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    /* ── Estado interpolado + bucle ── */
    const current = { ...KEYFRAMES[0] };
    let scatter = 0;
    let scrollInertia = 0;
    let rafId = 0;
    let running = !reduced;
    let hidden = false;
    const clock = new THREE.Clock();

    /* ── Arrastre de la escena (ratón + táctil) ──
       El gesto se escucha en window y el canvas solo se declara
       arrastrable cuando el puntero cae sobre él o sobre zonas libres:
       enlaces, botones, formularios, texto seleccionable y otros
       visores 3D quedan fuera. `dragTarget*` es el valor deseado
       (arrastre o inercia) y `dragRot*` lo sigue con lerp. */
    let dragging = false;
    let dragPointerId = null;
    let dragAxis = null; /* null = sin fijar | 'free' = gira | 'scroll' = página */
    let dragLastX = 0;
    let dragLastY = 0;
    let dragLastT = 0;
    let dragRotX = 0;
    let dragRotY = 0;
    let dragTargetX = 0;
    let dragTargetY = 0;
    let dragVelX = 0;
    let dragVelY = 0;

    const canStartDrag = (target) => {
      if (!target || typeof target.closest !== 'function') return false;
      if (target.id === 'nano-gl') return true;
      if (target.closest('canvas')) return false; /* visor 3D (ModelViewer) */
      if (target.closest(DRAG_BLOCKERS)) return false; /* enlaces y controles */
      if (target.closest(DRAG_TEXT)) return false; /* selección de texto */
      return true;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      dragPointerId = null;
      dragAxis = null;
      if (reduced) {
        dragVelX = 0;
        dragVelY = 0;
        if (repaintStatic) repaintStatic();
      }
      docEl.classList.remove('nano-drag');
    };

    const onDragPointerDown = (event) => {
      if (dragging || docEl.classList.contains('light')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (!canStartDrag(event.target)) return;
      dragging = true;
      dragPointerId = event.pointerId;
      dragAxis =
        event.pointerType === 'mouse' ? 'free' : null; /* táctil: fijar eje al mover */
      dragLastX = event.clientX;
      dragLastY = event.clientY;
      dragLastT = performance.now();
      dragVelX = 0;
      dragVelY = 0;
      docEl.classList.add('nano-drag');
    };

    const onDragPointerMove = (event) => {
      if (!dragging || event.pointerId !== dragPointerId) return;

      const dx = event.clientX - dragLastX;
      const dy = event.clientY - dragLastY;

      if (dragAxis === null) {
        if (Math.abs(dx) + Math.abs(dy) < DRAG_LOCK_PX) return;
        /* Táctil: un gesto vertical sigue siendo scroll de página */
        dragAxis = Math.abs(dx) >= Math.abs(dy) ? 'free' : 'scroll';
        if (dragAxis === 'scroll') {
          endDrag();
          return;
        }
      }

      const now = performance.now();
      const moveDt = Math.min(Math.max((now - dragLastT) / 1000, 1 / 240), 0.1);
      dragLastX = event.clientX;
      dragLastY = event.clientY;
      dragLastT = now;

      const stepY = dx * DRAG_SENS;
      const stepX = dy * DRAG_SENS;
      dragTargetY += stepY;
      dragTargetX += stepX;
      dragVelY = lerp(dragVelY, stepY / moveDt, 0.5);
      dragVelX = lerp(dragVelX, stepX / moveDt, 0.5);

      if (repaintStatic) repaintStatic();
    };

    /* El desplazamiento táctil solo se cancela cuando el gesto ya está
       fijado como arrastre: así el scroll de la página queda intacto */
    const onTouchMove = (event) => {
      if (!dragging || dragAxis !== 'free') return;
      if (event.cancelable) event.preventDefault();
    };

    window.addEventListener('pointerdown', onDragPointerDown, { capture: true });
    window.addEventListener('pointermove', onDragPointerMove, { passive: true });
    window.addEventListener('pointerup', endDrag, { passive: true });
    window.addEventListener('pointercancel', endDrag, { passive: true });
    window.addEventListener('blur', endDrag);
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    /* La rotación es periódica: se reescala en [-2π, 2π] para que un
       arrastre prolongado no degrade la precisión de los ángulos */
    const wrapAngle = (rot, target) => {
      if (Math.abs(rot) <= TAU) return null;
      const shift = Math.trunc(rot / TAU) * TAU;
      return [rot - shift, target - shift];
    };

    const trackDrag = (dt) => {
      if (!dragging && !reduced) {
        dragTargetX += dragVelX * dt;
        dragTargetY += dragVelY * dt;
        const decay = Math.exp(-dt * DRAG_FRICTION);
        dragVelX *= decay;
        dragVelY *= decay;
        if (Math.abs(dragVelX) < 0.02) dragVelX = 0;
        if (Math.abs(dragVelY) < 0.02) dragVelY = 0;
      }
      const dk = 1 - Math.exp(-dt * DRAG_SMOOTH);
      dragRotX = lerp(dragRotX, dragTargetX, dk);
      dragRotY = lerp(dragRotY, dragTargetY, dk);
      const wrappedX = wrapAngle(dragRotX, dragTargetX);
      if (wrappedX) {
        dragRotX = wrappedX[0];
        dragTargetX = wrappedX[1];
      }
      const wrappedY = wrapAngle(dragRotY, dragTargetY);
      if (wrappedY) {
        dragRotY = wrappedY[0];
        dragTargetY = wrappedY[1];
      }
    };

    const applyFrame = (t, dt) => {
      /* Parallax de puntero: respuesta rápida y fluida (compartido) */
      const pk = 1 - Math.exp(-dt * PARALLAX_LERP);
      px = lerp(px, targetPx, pk);
      py = lerp(py, targetPy, pk);

      /* Inercia del arrastre al soltar + amortiguación del seguimiento */
      trackDrag(dt);

      if (isAbout) {
        /* /nosotros: campo de partículas flotantes + gradiente ambiental
           con ondas que siguen al cursor (sin esfera ni keyframes) */
        group.position.y = -scrollP * (isBackground ? 0.15 : 1.1); /* deriva suave con el scroll */
        group.rotation.y = t * 0.03 + dragRotY * 0.35;
        group.rotation.x = dragRotX * 0.22;
        group.rotation.z = Math.sin(t * 0.08) * 0.02;
        fieldMat.uniforms.uT.value = t;
        fieldMat.uniforms.uMouse.value.set(px, -py);
        ambientMat.uniforms.uT.value = t;
        ambientMat.uniforms.uMouse.value.set((px + 1) / 2, (1 - py) / 2);
        return;
      }

      const k = 1 - Math.exp(-dt * 3.2);
      const target = stateAt(window.scrollY + window.innerHeight / 2);
      for (const key of Object.keys(current)) {
        current[key] = lerp(current[key], target[key], k);
      }
      scrollInertia *= Math.exp(-dt * 1.2);

      /* Dispersión al final del scroll: gradual según el progreso,
         reversible (se rearma al volver a subir) y con amplitud
         limitada por DISPERSION_AMP. En la variante 'background' la
         amplitud es 0: la estructura 3D no se disuelve ni se desvanece
         al bajar por la página. */
      const rawScat = clamp01(
        (scrollP - DISPERSION_START) / Math.max(1 - DISPERSION_START, 0.0001)
      );
      const dispersionAmp = isBackground ? 0 : DISPERSION_AMP;
      scatter = lerp(
        scatter,
        smoothstep(rawScat) * dispersionAmp,
        1 - Math.exp(-dt * 4.5)
      );

      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const worldH = halfH * 2;
      const mobile = window.innerWidth < 768;
      group.position.x = mobile ? 0 : current.x * halfH * camera.aspect;
      group.position.y = current.y * halfH;
      const baseScale = current.s * (mobile ? 0.62 : 1) * (worldH / 5.5) * (1 + scatter * SCATTER_SCALE);
      group.scale.setScalar(Math.min(baseScale, 1.12));
      group.rotation.y =
        t * 0.18 + px * PARALLAX_SPIN_Y + scrollInertia + scatter * SCATTER_SPIN + dragRotY;
      group.rotation.x = Math.sin(t * 0.3) * 0.12 + py * PARALLAX_SPIN_X + dragRotX;
      group.rotation.z = Math.sin(t * 0.2) * 0.06;

      /* Latido ~128 BPM + inercia de scroll */
      const beat = Math.sin(t * Math.PI * (128 / 60)) * 0.5 + 0.5;
      const pulse = Math.pow(beat, 3) * 0.6 + Math.min(Math.abs(scrollVel) * 0.02, 0.4);
      scrollVel *= 0.9;

      /* uA → 1.0 en el fondo de página: módulos independientes, pero el
         shader comprime su radio para que no invadan el contenido */
      particleMat.uniforms.uA.value = lerp(current.asm, 1, scatter);
      particleMat.uniforms.uT.value = t;
      particleMat.uniforms.uMix.value = current.mix;
      particleMat.uniforms.uPulse.value = pulse;
      particleMat.uniforms.uScat.value = scatter;

      core.scale.setScalar((0.25 + current.core + pulse * 0.05) * (1 + scatter * SCATTER_CORE));
      heartMat.opacity =
        (0.35 + 0.25 * Math.sin(t * 2) + pulse * 0.3) *
        (1 - scatter * SCATTER_FADE) *
        SCENE_DIM;
      coreLight.intensity =
        (6 + pulse * 10) * (1 - scatter * SCATTER_FADE * 0.75) * SCENE_DIM;
      tealLight.intensity = (30 + pulse * 40) * SCENE_DIM;

      bubbleMat.opacity =
        current.bub * 0.7 * (1 - scatter * SCATTER_FADE * 0.9) * SCENE_DIM;
      const bPos = bubbleGeo.attributes.position.array;
      for (let u = 0; u < bubbleCount; u += 1) {
        bPos[u * 3 + 1] += bubbleSpeed[u] * dt;
        if (bPos[u * 3 + 1] > 1.4) bPos[u * 3 + 1] = -1.4;
      }
      bubbleGeo.attributes.position.needsUpdate = true;

      const ringSpread = 1 + scatter * SCATTER_RING;
      const rPos = ringGeo.attributes.position.array;
      for (let r = 0; r < ringCount; r += 1) {
        ringAngle[r] += ringSpeed[r] * dt;
        rPos[r * 3] = Math.cos(ringAngle[r]) * ringRadius[r] * ringSpread;
        rPos[r * 3 + 1] = Math.sin(ringAngle[r] * 0.7) * 0.35;
        rPos[r * 3 + 2] = Math.sin(ringAngle[r]) * ringRadius[r] * ringSpread;
      }
      ringGeo.attributes.position.needsUpdate = true;
      ringMat.opacity = 0.8 * current.ring * (1 - scatter * SCATTER_FADE) * SCENE_DIM;

      tori.forEach((mesh, idx) => {
        mesh.material.opacity =
          (0.12 + current.ring * 0.28 + Math.sin(t * 1.4 + idx) * 0.06 + pulse * 0.08) *
          (1 - scatter * SCATTER_FADE) *
          SCENE_DIM;
        mesh.scale.setScalar(1 + scatter * SCATTER_TORI);
        mesh.rotation.z += dt * 0.04 * (idx % 2 === 0 ? 1 : -1);
      });
    };

    const renderFrame = () => {
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!running || hidden) return;
      if (docEl.classList.contains('light')) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      applyFrame(clock.elapsedTime, dt);
      renderFrame();
    };

    if (reduced) {
      applyFrame(0, 0.016);
      if (!docEl.classList.contains('light')) renderFrame();
      repaintStatic = () => {
        applyFrame(0, 0.016);
        if (!docEl.classList.contains('light')) renderFrame();
      };
    } else {
      rafId = requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      hidden = document.visibilityState !== 'visible';
      if (!hidden) clock.getDelta();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(revealTimer);
      /* Sin repaint: el desmontaje no vuelve a dibujar la escena */
      dragging = false;
      repaintStatic = null;
      docEl.classList.remove('nano-drag');
      window.removeEventListener('scroll', onScrollProgress);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onDragPointerDown, { capture: true });
      window.removeEventListener('pointermove', onDragPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      window.removeEventListener('blur', endDrag);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('visibilitychange', onVisibility);
      revealObserver?.disconnect();
      docEl.classList.remove('nano-js');
      revealTargets.forEach((el) => {
        el.classList.remove('nano-rv', 'in');
        el.style.transitionDelay = '';
      });
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      if (composer) composer.dispose();
      renderer.dispose();
    };
  }, []);

  /* Variante 'background' (p. ej. /contacto): el canvas vive en una capa
     fija a pantalla completa, detrás del contenido (-z-10) y sin
     interceptar el puntero, para que el modelo 3D quede siempre
     anclado al viewport sin moverse al hacer scroll. */
  if (variant === 'background') {
    return (
      <div className="fixed inset-0 w-full h-screen pointer-events-none -z-10">
        <canvas ref={canvasRef} id="nano-gl" className="nano-gl--background" aria-hidden="true" />
        <div ref={progressRef} className="nano-progress" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} id="nano-gl" aria-hidden="true" />
      <div ref={progressRef} className="nano-progress" aria-hidden="true" />
    </>
  );
}
