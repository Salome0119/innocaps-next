# Tasks

## 1. Header multi-nivel

- [x] 1.1 Extraer `getDeviceTier()` a `src/lib/deviceTier.js` y actualizar `ModelViewer.jsx` para importarlo — verificación: `npm run build` compila y el visor existente se comporta igual
- [x] 1.2 Reestructurar el nav desktop de `Header.jsx`: tabs estables `[Lab | Bio & WiBio | Pipeline | Nosotros | Contacto]` con estado activo por ruta y estilo heredado (hover + teal-400) — verificación: las cinco pestañas visibles en `/`, `/bio`, `/lab` y `/nosotros`
- [x] 1.3 Implementar el segundo nivel desplegable (hover/clic, retardo de cierre, `Esc`, `aria-expanded`/`aria-controls`): Lab → Tecnología/Soluciones/Proceso; Bio & WiBio → Tecnología/Escalamiento/Soluciones B2B/Cómo Trabajamos/Aplicaciones — verificación: apertura y recorrido con teclado funcionan y el foco vuelve al disparador con `Esc`
- [x] 1.4 Añadir la pestaña "Pipeline" apuntando a `/lab#pipeline` con scroll suave, y poner `id="pipeline"` + `scroll-margin-top` en `BiotechPipeline.tsx`; verificar navegación desde `/bio` y scroll interno desde `/lab` sin tapado por el header
- [x] 1.5 Extender el menú móvil con acordeón de segundo nivel (Lab y Bio & WiBio) manteniendo el CTA Contactar y el toggle de tema — verificación: a 375 px las entradas y sub-entradas se despliegan/cierran con targets ≥ 44 px

## 2. /bio dirigido por URL

- [x] 2.1 Derivar `activeTab` de `?seccion=` en `BioWiBioSection.jsx` (default `tecnologia`) y eliminar la barra de pestañas flotante interna — verificación: `/bio?seccion=soluciones` renderiza Soluciones B2B en el primer paint y el botón atrás restaura la vista anterior
- [x] 2.2 Envolver Header + BioWiBioSection en `<Suspense>` dentro de `src/app/bio/page.tsx` y enlazar el segundo nivel de Bio a `/bio?seccion=…` — verificación: `npm run build` no falla por `useSearchParams` y cambiar de sub-vista desde el navbar no recarga la página
- [x] 2.3 Crear `src/components/BioEscalamiento.jsx` (narrativa piloto → industrial, TRL, capacidades B2B sin repetir copy de Lab) y registrarla como quinta sub-vista — verificación: el enlace "Escalamiento" del navbar muestra la nueva vista con su contenido

## 3. Portafolio WiBio ampliado

- [x] 3.1 Añadir a `BioSoluciones.jsx` las5 series (GutAcid Balance®, KelaPhy®, CurNova®, Microbiome Series, Science Series) como tarjetas de vidrio con badge TRL (verde bio sólo en el badge, con remapeo `.light`) y detalle expandible — verificación: las cinco series se muestran con su TRL y el detalle abre/cierra por teclado
- [x] 3.2 Añadir el selector de3 modelos de negocio (01 Ingredientes funcionales · 02 Desarrollo tecnológico · 03 Licensing) con descripciones diferenciadas y los chips de6 verticales — verificación: activar cada modelo muestra su copy propio y las verticales se listan sin solapes a 375 px
- [x] 3.3 Revisar el copy nuevo con `<GlossaryTooltip>` en términos técnicos y sin claims médicos — verificación: lectura del texto de las tarjetas conforme al tono de la skill innocaps-brand

## 4. Escenas 3D

- [x] 4.1 Crear `src/components/MicrocapsuleCore.jsx` (núcleo emisivo, cáscara con `transmission` desactivado en tier low, ~24 partículas instanciadas en órbita, OrbitControls sin zoom, hover con lerp de emisivo, pausa fuera de viewport) y montarlo con `next/dynamic` (`ssr: false`) en la sub-vista Soluciones B2B — verificación: arrastrar rota la microcápsula, el hover intensifica el núcleo y en móvil no hay tirones ni errores de consola
- [x] 4.2 Crear `src/components/BioreactorScene.jsx` (vasija translúcida, fluido animado, burbujas instanciadas, tuberías, luces esmeralda/cian, mismo device tier) y montarlo con `next/dynamic` en `BioEscalamiento` — verificación: burbujas y fluido animados, rotación por arrastre y contenido HTML visible antes de que cargue el canvas
- [x] 4.3 Verificar `prefers-reduced-motion` en ambas escenas (sin auto-rotación/bucles intensos) y que el modo `.light` no deje canvases ilegibles — verificación: con la preferencia activada y con el toggle de tema, la sección sigue siendo usable

## 5. Verificación de integración

- [x] 5.1 Ejecutar `npm run build` y confirmar que compila sin errores y no genera `./out/`
- [x] 5.2 Ejecutar `npx eslint src/components/Header.jsx src/components/BioWiBioSection.jsx src/components/BioSoluciones.jsx src/components/BioEscalamiento.jsx src/components/MicrocapsuleCore.jsx src/components/BioreactorScene.jsx src/components/BiotechPipeline.tsx src/lib/deviceTier.js` sin añadir avisos nuevos al baseline
- [x] 5.3 Recorrer en `npm run dev` los escenarios de las dos specs: header estable + dropdowns + teclado, `/lab#pipeline` desde varias rutas, conmutación por `?seccion=` con atrás/adelante, contenido WiBio completo y ambas escenas 3D en dark/light y a 375 px
