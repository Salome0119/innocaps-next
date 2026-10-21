# Proposal

## Why

La home actual carece de una identidad visual nanotecnológica inmersiva acorde al posicionamiento de Innocaps Lab: el hero depende solo del visor GLB y el resto de la página es estático sobre fondo opaco. El rediseño de referencia (bundle estático `achury2000/innocaps`) demuestra una escena WebGL procedural con bloom como capa de fondo que refuerza la narrativa de nanoencapsulación sin alterar la arquitectura de rutas ni el contenido institucional.

## What Changes

- Nuevo componente cliente `NanoBackground` que renderiza un canvas WebGL fijo a pantalla completa con `EffectComposer` + `UnrealBloomPass` + `OutputPass` (three.js puro, sin dependencias nuevas) como capa de fondo de la home.
- Escena procedural: partículas instanciadas tipo icosaedro con shader propio (ensamblado↔disperso, latido ~128 BPM, paleta teal/lima), núcleo aditivo, burbujas, anillo de partículas y anillos finos; parallax de puntero, inercia de scroll y keyframes por zonas de la home (hero → selector → aliados).
- Barra de progreso de scroll (gradiente teal→lima, 3 px) fija en la parte superior de la home.
- Efecto reveal-on-scroll sutil (fade/translate) para los bloques de la home, sin convertir server components a cliente.
- Estilos nuevos en `globals.css` (bloque prefijado `NANO-BG`): canvas `#nano-gl` (`fixed`, `pointer-events:none`, `mix-blend-mode:screen`), capas z-index del contenido, fondos translúcidos de las secciones de la home vía override CSS (clases del JSX intactas), fallback de modo claro (`.light` oculta el canvas y restaura fondos sólidos) y `prefers-reduced-motion`.
- **NO** se modifica: markup de `HeroSection`, `SelectorUnidades`, `AlliesMarquee`, `Header`, `ModelViewer`, textos, rutas, datos, formularios ni navegación. El orden de secciones de la home se conserva (Header → Hero → Selector → Aliados).

## Capabilities

### New Capabilities

- `experiencia-visual-home`: capa de presentación inmersiva de la home (`/`) — canvas WebGL de fondo con bloom, progreso de scroll, reveals y sus reglas de degradación (device-tier, reduced-motion, modo claro).

### Modified Capabilities

<!-- ninguna: no existen specs base en openspec/specs/ todavía -->

## Impact

- **Código**: `src/components/NanoBackground.jsx` (nuevo), `src/app/page.tsx` (1 línea), `src/app/globals.css` (bloque final nuevo).
- **Dependencias**: ninguna nueva (`three ^0.182` ya incluye `three/examples/jsm/postprocessing/*`).
- **Rendimiento**: segundo canvas WebGL simultáneo al `ModelViewer` del hero — mitigado con cap de devicePixelRatio, bloom a 512², degradación por `DEVICE_TIER`, pausa con `document.hidden` y `dispose` al desmontar.
- **Compatibilidad**: modo `.light` oculta el canvas; `prefers-reduced-motion` elimina animación; sin impacto en `/lab`, `/nosotros`, `/contacto` ni en specs activos `separar-estrategias-lab-bio` (orden intacto) y `navegacion-wibio-modelos-3d` (ModelViewer/Header no se reescriben).
