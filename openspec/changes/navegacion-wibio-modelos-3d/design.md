# Design

## Context

- `Header.jsx` hoy cambia el set de links por pathname (`getNavItems`: simple / home / lab) y no tiene segundo nivel ni anclas; el menú móvil replica la lista plana.
- `/bio` renderiza `BioHero` (visor 3D GLB con `ModelViewer`) + `BioWiBioSection` con 4 sub-vistas conmutadas por `useState` interno y una barra de pestañas flotante en el centro de la página.
- `BioSoluciones.jsx` sólo cubre formatos de entrega (saco/cuñete/lote); faltan series de producto, modelos de negocio y verticales.
- `BiotechPipeline.tsx` se renderiza en `/lab` sin `id` ancla.
- Deps ya presentes: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`. `ModelViewer.jsx` ya implementa `getDeviceTier()` (reutilizable) y OrbitControls sin zoom.

Decisiones de alcance ya tomadas con el usuario: nav principal `[Lab | Bio & WiBio | Pipeline | Nosotros | Contacto]`; Pipeline → `/lab#pipeline`; la sub-nav de Bio se conmuta desde el navbar (no scroll de anclas dentro de `/bio`); paleta de marca Innocaps (no la paleta literal del brief).

## Goals / Non-Goals

**Goals:**

- Header con tabs estables + segundo nivel accesible y ancla `/lab#pipeline`.
- `/bio` con 5 sub-vistas dirigidas por `?seccion=`, contenido WiBio completo y 2 escenas 3D procedurales.
- Rendimiento: canvas 3D con `next/dynamic` (`ssr: false`), device tier y pausa fuera de viewport.

**Non-Goals:**

- Nuevas dependencias, rutas o cambios de CMS; migrar el resto de `<img>` a `next/image`.
- Reescribir `ModelViewer` (GLB de la micela) o el contenido de las sub-vistas Tecnología/Colaboración/Aplicaciones más allá de lo necesario para convivir con la nueva navegación.
- Tocar el cambio pendiente `experiencia-nosotros-bioluminiscente`.

## Decisions

**D1 — Estado de sub-vista en el URL (`?seccion=`) vía `useSearchParams`.**
`BioWiBioSection` deriva `activeTab` del search param (default `tecnologia`); el segundo nivel del header enlaza a `/bio?seccion=<id>` (soft nav de Next, sin reload) y el botón atrás funciona gratis.
*Alternativa descartada*: Context compartido Header↔Bio — exige un provider envolviendo ambas ramas en todas las páginas y pierde deep-links/back-forward.

**D2 — `useSearchParams` dentro de un `<Suspense>` en `src/app/bio/page.tsx`.**
Next 16 falla en build si `useSearchParams` se usa sin límite de suspense en un Client Component de página; se envuelve el par Header+BioWiBioSection. *Alternativa*: `history.replaceState` manual → sin integración con el router y más código.

**D3 — Dropdowns como `details`-buttons controlados con estado, no librería.**
Botón con `aria-expanded`/`aria-controls`, apertura en hover (desktop, con retardo) y clic, cierre con `Esc`/blur/fuera; el menú móvil usa acordeón de segundo nivel dentro del overlay existente. *Alternativa descartada*: Radix/popover (dependencia nueva) — el header actual ya resuelve su UI con estado propio.

**D4 — Escenas 3D procedurales con r3f, sin assets GLB nuevos.**
`MicrocapsuleCore.jsx`: `Sphere` núcleo (`MeshStandardMaterial` emisivo cian/teal) + cáscara `MeshPhysicalMaterial` con `transmission` (0 en tier low) + `InstancedMesh` de ~24 partículas en órbita (`useFrame`), OrbitControls (sin zoom/pan) y hover que eleva `emissiveIntensity` con lerp.
`BioreactorScene.jsx`: cilindro translúcido + `Liquid` (cilindro animado en escala Y) + burbujas instanciadas ascendentes + tuberías `Torus`/`CylinderGeometry` + luz esmeralda/cian, misma capa `getDeviceTier()` (extraída a `src/lib/deviceTier.js` para compartirla con `ModelViewer`).
Ambos se cargan con `next/dynamic` desde sus secciones (`ssr: false`) y se pausan con `frameloop` condicional cuando el canvas sale del viewport (IntersectionObserver).

**D5 — Cinco sub-vistas de Bio, con "Escalamiento" nueva.**
`BioEscalamiento.jsx` (nuevo): narrativa Unidad 02 (piloto → industrial, TRL, ventas B2B) + `BioreactorScene`. El segundo nivel de Bio queda `Tecnología · Escalamiento · Soluciones B2B · Cómo Trabajamos · Aplicaciones`; la barra flotante interna de `BioWiBioSection` se elimina.

**D6 — Contenido WiBio ampliado dentro de `BioSoluciones.jsx`.**
Se conservan los formatos de entrega como bloque de especificaciones y se añaden: (a)5 series con badge TRL y detalle expandible; (b)3 modelos de negocio como selector 01/02/03; (c) chips de6 verticales. `MicrocapsuleCore` se ancla al inicio de la sub-vista como demo de la doble capa (GutAcid Balance®). Copy en español, sin claims médicos (biodisponibilidad/estabilidad/protección), términos técnicos con `GlossaryTooltip` cuando aplique.

**D7 — Pipeline como ancla**: `id="pipeline"` + `className="scroll-margin-top-28"` en `BiotechPipeline`; `scroll-behavior: smooth` global salvo `prefers-reduced-motion`.

**D8 — Paleta y modo claro**: acentos `teal-400`/`cyan-400` y fondo `#03100e` ya existentes en Bio; el verde bio (`#2ECC71`) sólo como acento puntual en badges TRL de WiBio, con su remapeo `.light` agregado en `globals.css` (siguiendo la regla de la skill de marca).

## Risks / Trade-offs

- [Build falla por `useSearchParams` sin Suspense] → D2, límite de suspense explícito en la página.
- [Pesos de JS en /bio por dos canvases] → D1/D4: `dynamic` + device tier + instancing; sólo una escena visible a la vez (sub-vista conmutada), lo que limita el costo concurrente.
- [Header roto en móvil por la nueva jerarquía] → se mantiene el overlay fullscreen actual, con acordeón de segundo nivel y el mismo CTA Contactar.
- [Regresión a11y en dropdowns] → escenarios de teclado en la spec; verificación manual con Tab/Enter/Esc.
- [Repetir copy de Lab] → el contenido nuevo (series/modelos/verticales/escalamiento) se redacta desde la perspectiva industrial/comercial, no de R&D.
- [Baseline de lint] → `npx eslint` sobre los archivos tocados antes de cerrar.

## Migration Plan

Cambio de UI sin datos ni rutas nuevas: se aplica en una pasada (header + /bio + ancla + globals). Los enlaces legacy a `/bio` sin query siguen funcionando (default `tecnologia`). Rollback = `git revert`; no hay migración de datos.

## Open Questions

- Ninguna: nav principal (con Nosotros), destino de Pipeline y modelo de conmutación de sub-vistas fueron confirmados por el usuario.
