# Design

## Context

La home (`src/app/page.tsx`) renderiza `Header → HeroSection (ModelViewer GLB) → SelectorUnidades → AlliesMarquee`. No existe CSS propio de la home salvo `.marquee-track`, `.txt-grad` y overrides del selector al final de `globals.css`. El proyecto ya depende de `three ^0.182` (incluye `three/examples/jsm/postprocessing/*`), `@react-three/fiber` y `drei`; existe `src/lib/deviceTier.js` (`getDeviceTier()`, `prefersReducedMotion()`) usado por `ModelViewer`. Los specs activos imponen: orden de secciones de la home intacto (`separar-estrategias-lab-bio`) y no reescribir ModelViewer ni la composición del Header (`navegacion-wibio-modelos-3d`). El diseño de referencia es el bundle estático `achury2000/innocaps` (escena procedural + bloom, analizado en fase de planificación). Ver proposal.md para la motivación y specs/experiencia-visual-home para los requisitos.

## Goals / Non-Goals

**Goals:**
- Canvas WebGL fijo de fondo en `/` con `EffectComposer` + `UnrealBloomPass` + `OutputPass` (three.js puro).
- Escena procedural fiel al espíritu del bundle: instancias icosaédricas + shader custom (ensamblado↔disperso, latido ~128 BPM, Fresnel, paleta teal/lima), núcleo aditivo, burbujas, anillo de partículas, anillos finos, parallax, inercia de scroll.
- Barra de progreso de scroll y reveals sutiles vía IntersectionObserver + CSS.
- Cero dependencias nuevas; cero cambios de markup en secciones existentes.

**Non-Goals:**
- Reescribir `ModelViewer`, `HeroSection`, `Header` o el formulario de `/contacto`.
- Añadir loader de entrada o cursor personalizado (descartado por el usuario).
- Extender el canvas a otras rutas o al layout raíz.
- Migrar secciones de la home a React Server Components/cliente para framer-motion.

## Decisions

1. **Three.js puro en cliente vs R3F + @react-three/postprocessing.** Se elige three.js puro (mismos imports que la referencia) montado en un `useEffect`: el loop propio con `requestAnimationFrame`, cero dependencias nuevas y separación total del árbol R3F del `ModelViewer` (evita conflictos de renderer/contexto y el overhead de dos providers). Alternativa descartada: `@react-three/postprocessing` añade dependencia y exige tomar el loop con prioridad sobre el Canvas de R3F.
2. **Componente único `NanoBackground.jsx` ('use client') con init en `useEffect`, montado desde `page.tsx`.** El componente emite solo el `<canvas id="nano-gl">` (SSR neutro, sin riesgo de window en servidor). La hidratación coincide porque el markup inicial es idéntico. `next/dynamic` no aporta: three ya entra en el bundle de la home vía `ModelViewer`.
3. **Fondos translúcidos de secciones vía override CSS en `globals.css` (bloque prefijado `/* ═══ NANO-BG ═══ */`), sin tocar clases del JSX.** Cumple la regla de mantener intactas las clases originales. `z-index` de `.selector-unidades`, `.hero` y la sección del marquee se eleva a capa 2 con `position:relative` desde CSS.
4. **Keyframes de scroll por zonas** (hero → selector → aliados) interpolando un estado `{x, y, s, asm, mix, core, bub, ring}` con smoothstep entre los centros de cada sección, en vez de atributos `data-cap` en el markup (evita tocar el JSX). El estado base en hero coloca la escena desplazada a la derecha (x≈0.38 de media anchura de cámara) para no competir con el texto.
5. **Sin drag ni listeners capturando puntero.** Solo `pointermove` en `window` (passive) para parallax y `scroll` (passive) para inercia/barra; el canvas es `pointer-events:none`. Cumple el requisito de no interferir con nav/formularios.
6. **Modo claro**: `display:none` del canvas + se restauran fondos sólidos bajo `.light` (más predecible que `mix-blend-mode:normal` sobre paleta clara). `prefers-reduced-motion`: un único render estático sin bucle y reveals sin transición (además del CSS global ya existente).
7. **Degradación**: `getDeviceTier()` → `low`: 900 instancias, sin bloom, dpr 1.5, sin antialias; `mid`: 1200 instancias, bloom, dpr 1.75; `high`: 1500 instancias, bloom, dpr 2. Pausa con `visibilitychange`. `try/catch` + guardia `WebGLRenderingContext` para degradar a HTML-only.

## Risks / Trade-offs

- [Doble canvas (ModelViewer + NanoBackground) en el hero] → dpr capado, bloom 512² con strength 0.22–0.32, pausa con `document.hidden`, menos instancias en móvil, sin antialias en móvil.
- [Legibilidad del texto sobre el canvas] → fondos de sección en rgba muy opacos (≈0.55–0.7), bloom de strength baja, escena desplazada en el hero, `mix-blend-mode:screen` solo en tema oscuro.
- [Residuo de contexto WebGL al navegar fuera de la home] → `dispose()` de geometrías, materiales, passes, composer y renderer + `cancelAnimationFrame` + remoción de listeners en el cleanup del effect.
- [Coste de CPU con rAF continuo] → pausa con `visibilitychange`; en `low` se reduce trabajo (menos instancias, sin bloom).
- [Conflicto con specs OpenSpec activos] → no se toca markup de secciones ni orden; el canvas no es "contenido" nuevo visible con texto.

## Migration Plan

Despliegue atómico en un solo commit (3 ficheros). Rollback: revertir el commit (el cambio es aditivo; no hay datos ni contratos).

## Open Questions

Ninguna bloqueante: paleta lima confinada a la escena 3D y ocultado del canvas en `.light` ya fueron decididos con el usuario en la fase de planificación.
