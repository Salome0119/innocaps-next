# Proposal

## Why

La navegación secundaria de InnoCaps Bio (Tecnología · Soluciones B2B · Cómo Trabajamos · Aplicaciones) vive como pestañas flotantes dentro de la página, lejos del header, y el header principal no expone Pipeline ni un segundo nivel accesible; además el portafolio WiBio carece de contenido comercial completo (series de producto, modelos de negocio, verticales) y de los modelos 3D que sustentan el pitch (microcápsula doble capa y bioreactor de escalamiento). Para que `/bio` convierta como landing B2B, la navegación debe ser jerárquica desde el navbar y el contenido, completo e interactivo.

## What Changes

- **Header multi-nivel**: navbar principal flotante con `[Lab | Bio & WiBio | Pipeline | Nosotros | Contacto]`; "Lab" y "Bio & WiBio" despliegan un segundo nivel (dropdown accesible: teclado, `Esc`, `aria-expanded`). **BREAKING** para el menú contextual actual: desaparece el cambio ciego de items por pathname a favor de items estables + dropdowns.
- **Pipeline como ancla**: "Pipeline" enlaza a `/lab#pipeline` (se añade `id="pipeline"` + `scroll-margin` al bloque `BiotechPipeline`) con scroll suave y compensación del header fijo.
- **Bio con vistas conmutadas desde el navbar**: el estado de sub-vista de `/bio` pasa al URL (`/bio?seccion=…`); el segundo nivel del header conmuta la vista sin recarga (soft navigation de Next) y la barra de pestañas flotante interna de `BioWiBioSection` se elimina.
- **Quinta sub-vista "Escalamiento"**: nueva sección Unidad 02 (piloto → industrial, TRL) con narrativa de escalamiento y modelo 3D de bioreactor; se añade al segundo nivel del navbar (`Tecnología · Escalamiento · Soluciones B2B · Cómo Trabajamos · Aplicaciones`).
- **Portafolio WiBio ampliado** en Soluciones B2B: series GutAcid Balance®, KelaPhy®, CurNova®, Microbiome Series y Science Series (con TRL), 3 modelos de negocio (Ingredientes funcionales, Desarrollo tecnológico, Licensing) y 6 verticales B2B, sin repetir contenido de Lab (R&D/spray drying).
- **Modelo 3D de microcápsula**: nueva escena procedural (núcleo emisivo + cáscara translúcida + partículas en órbita) con rotación arrastrable y efecto hover, integrada en la zona WiBio.
- **Modelo 3D de bioreactor**: nueva escena procedural estilizada (vasija, líquido, burbujas, tuberías) en la sub-vista Escalamiento.
- **Estilo**: paleta de marca Innocaps (slate/teal-400/cyan-400 sobre `#03100e`, verde bio solo como acento puntual de WiBio con su equivalente en `.light`), glassmorphism y tipografía del sitio; sin dependencias nuevas (r3f/drei/three ya existen).

## Capabilities

### New Capabilities
- `navegacion-global`: comportamiento del header (tabs principales, segundo nivel desplegable, anclas con scroll suave, menú móvil, estados por ruta).
- `experiencia-bio-wibio`: experiencia de `/bio` — sub-vistas conmutadas por URL, contenido comercial WiBio y escenas 3D interactivas con degradación por dispositivo.

### Modified Capabilities

<!-- ninguna capability existente en openspec/specs/ cambia de requisitos -->

## Impact

- **Código**: `src/components/Header.jsx` (reestructuración del nav desktop y del menú móvil), `src/components/BioWiBioSection.jsx` (estado desde URL, +sub-vista), `src/components/BioSoluciones.jsx` (contenido WiBio ampliado), nuevos `MicrocapsuleCore.jsx`, `BioEscalamiento.jsx`, `BioreactorScene.jsx`; ajustes en `src/app/bio/page.tsx`, `src/components/BiotechPipeline.tsx` (ancla) y `src/app/globals.css` (scroll suave, `scroll-margin-top`, acentos `.light`).
- **Sin dependencias nuevas**: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion` ya están en `package.json`; los canvas 3D se cargan con `next/dynamic` (`ssr: false`) para no penalizar el primer render.
- **Accesibilidad/rendimiento**: dropdowns con teclado y `aria-*`, escenas 3D con `dpr` acotado, pausa fuera de viewport y respaldo `prefers-reduced-motion`; `npm run build` + eslint sin regresar al baseline.
