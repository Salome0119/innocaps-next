# Design

## Context

`src/components/AboutPage.jsx` (≈614 líneas, `'use client'`) renderiza `/nosotros` como siete secciones apiladas con fondos alternos (`bg-black`, `bg-slate-950`) que producen cortes horizontales visibles. Los bloques 2–6 son estáticos: 3 tarjetas de filosofía, 2 tarjetas Lab+Bio desconectadas, 1 tarjeta de director + 3 aliados, y una lista `Conectamos … →`.

Patrones ya disponibles en el repo y reutilizables:

- **Tabs tipo Lab**: `ProcessSection.jsx:490-509` — fila de `motion.button` con estado activo en gradiente `from-teal-500 to-cyan-500`, hover scale, contenido condicional con `framer-motion`.
- **Lienzo bioluminiscente**: `AnimatedBackground.jsx` (blobs cian/violeta, `mix-blend-screen`, keyframes `blob-1`/`blob-2` en `globals.css:233-243`) y `SelectorUnidades.jsx` (tarjetas `bg-[#041915]/80 backdrop-blur-md border-[#00ffff]/30`, costura con degradado).
- **Transiciones de vista**: `FadeInSection`/`useFadeIn` (IntersectionObserver) ya existen dentro de `AboutPage.jsx`.
- **Modo claro**: `globals.css:4-61` remapea utilidades Tailwind bajo `.light` **por nombre de clase** — las clases arbitrarias (`bg-[#03100e]`) no están cubiertas.
- **Deps disponibles**: `framer-motion` 12 y `lucide-react` en `package.json` (sin instalar nada).

Restricciones: `npm run build` debe pasar; el baseline de lint (~36 errores preexistentes) no debe empeorar; sin `output: "export"` (SSR activo); copy en español.

## Goals / Non-Goals

**Goals:**

- Un solo lienzo `#03100e` con glows cian/violeta continuos para toda la sección, sin cortes.
- Sub-SPA por pestañas con las 4 sub-vistas (Filosofía, Lab+Bio, Equipo, B2B) y sus microinteracciones.
- Mantener Hero, Aliados y CTA fuera de las pestañas, con el mismo fondo unificado.
- Compatibilidad con modo `.light`, teclado/screen-reader y `prefers-reduced-motion`.

**Non-Goals:**

- Cambios de enrutado, `next.config.ts`, metadata de la página, CMS o nuevas dependencias.
- Migrar `<img>` → `next/image` en la sección.
- Eliminar o reescribir el contenido de Aliados/CTA/Hero.
- Arreglar el baseline de lint preexistente.

## Decisions

**D1 — Lienzo unificado por variables CSS en vez de remapeo por utilidad.**
Se envuelve toda la página en un contenedor `.about-canvas` que declara `--about-bg`, `--about-glow-cyan`, `--about-glow-violet`, `--about-card`, `--about-border` (defaults dark) y se sobreescriben en `.light .about-canvas`. Las secciones hijas pierden sus clases de fondo y consumen `bg-[var(--about-bg)]`.
*Alternativa descartada*: añadir `.light .bg-[#03100e] { @apply … }` al bloque de remapeo de `globals.css` — el remapeo actual es por nombre de utilidad y no cubre valores arbitrarios, y añadiríamos reglas frágiles una por color.

**D2 — Los resplandores viven en una capa absoluta única dentro del wrapper, no por sección.**
Dos `div` absolutos (radial cian anclado a la izquierda, radial violeta a la derecha) con `pointer-events-none` y `z-0`, más un `Agrupar.svg` en `mix-blend-overlay` opcional; el contenido va en `relative z-10`. Así no hay cortes entre bloques.
*Alternativa descartada*: repetir `AnimatedBackground` por sección — recrea el problema de costuras que queremos eliminar.

**D3 — Shell de pestañas en `AboutPage.jsx` + un archivo plano por sub-vista.**
`AboutPage.jsx` conserva hero, shell de tabs (`useState` + `role="tablist"` + `AnimatePresence`), aliados y CTA. Cada sub-vista se extrae a su propio archivo plano PascalCase en `src/components/`: `PhilosophyTabs.jsx`, `LabBioFusion.jsx`, `TeamGlowCards.jsx`, `B2BFlowDiagram.jsx`.
*Alternativa descartada*: meterlo todo en `AboutPage.jsx` (~1.200 líneas, ilegible) o crear `src/components/about/` (rompe la convención flat del directorio).

**D4 — Pestañas accesibles con patrón ARIA de tabs + flechas.**
`role="tablist"`, `role="tab"` con `aria-selected` y `aria-controls`, `role="tabpanel"` en la vista activa, `aria-labelledby` recíproco, foco visible (`focus-visible:ring-cyan-400`) y `ArrowLeft/ArrowRight/Home/End` para mover la selección. El estilo visual imita las pills de `ProcessSection.jsx` (activo = gradiente cian, inactivo = borde translúcido).
*Alternativa descartada*: menú de anclas con scroll (no sería una sub-vista dinámica y perdería el patrón Lab pedido).

**D5 — Cambios de vista con `AnimatePresence mode="wait"` de `framer-motion`** (fade + `y` corto, 0.25–0.35 s), sin persistir scroll. `PhilosophyTabs` maneja su propio estado interno de pilar con fade-in; `LabBioFusion` maneja `hoverSide | null` (con fallback táctil por `onClick`/`onFocus`); `TeamGlowCards` usa CSS puro en hover; `B2BFlowDiagram` maneja `activeNode | null`.

**D6 — Diagrama B2B en SVG + HTML superpuesto, no librería de grafos.**
4 nodos posicionados con CSS (fila en desktop, columna en móvil) y conectores SVG `path` con `stroke-dasharray` animado (`about-data-flow`) para el flujo de datos; el panel de detalle es un aside a la derecha en desktop y bloque desplegable debajo en móvil (`AnimatePresence`). *Alternativa descartada*: `react-flow`/similar → dependencia nueva sin justificación para 4 nodos.

**D7 — Animaciones continuas como keyframes nuevos en `globals.css`** (`about-node-pulse`, `about-data-flow`, `about-blink`) + un bloque único `@media (prefers-reduced-motion: reduce)` que pone `animation: none` sobre `.about-canvas *`. *Alternativa descartada*: `framer-motion` `useReducedMotion` por componente → más código repartido para el mismo efecto.

**D8 — Peso de JS**: se mantiene todo en el bundle del cliente de `/nosotros` (ya es una página client-heavy). No se añaden dependencias; `lucide-react` sólo si aporta íconos SVG ligeros en el diagrama.

## Risks / Trade-offs

- [Modo claro roto por hex arbitrarios] → D1 con variables CSS y una regla `.light .about-canvas`; verificar visualmente ambas variantes.
- [Archivo de pestañas con más de mil líneas si no se extrae] → D3, un archivo por sub-vista con límites claros.
- [Flicker/montaje doble al cambiar de pestaña con SSR] → estado inicial `filosofia` idéntico en servidor y cliente; sin `localStorage` ni `window` en el primer render.
- [Accesibilidad de tabs incompleta (foco atrapado, sin flechas)] → D4 con teclado y ARIA verificados a mano en `npm run dev`.
- [Animaciones continuas causan mareo o consumo de batería] → `prefers-reduced-motion` global (D7) + glows estáticos fuera de pantalla.
- [Empeorar el baseline de lint] → `npx eslint` sobre los archivos tocados antes de cerrar; no se corrigen errores preexistentes ajenos.
- [Romper `npm run build` por JSX inválido en archivos nuevos] → `npm run build` obligatorio antes de declarar terminado (skill `innocaps-deploy`).

## Migration Plan

Cambio de una sola página, sin datos ni rutas: se aplica en una pasada sobre `src/components/AboutPage.jsx` + 4 archivos nuevos + `globals.css`. Despliegue cuando haya estrategia dinámica (`npm run build` + `npm run start`); rollback = `git revert` del commit, sin migraciones ni datos que restaurar.

## Open Questions

- Ninguna abierta: el alcance (4 pestañas; Hero, Aliados y CTA fuera) fue confirmado por el usuario en la fase de propuesta.
