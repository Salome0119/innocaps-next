# Tasks

## 1. Lienzo bioluminiscente unificado

- [x] 1.1 Envolver la página de `/nosotros` en el contenedor `.about-canvas` con `--about-bg: #03100e` y glows cian (izquierda) / violeta (derecha) en una capa absoluta `pointer-events-none`, y quitar los fondos alternos (`bg-black`, `bg-slate-950`) de las secciones hijas — verificación: al recorrer `/nosotros` en `npm run dev` no hay cortes horizontales de color entre hero, pestañas, aliados y CTA
- [x] 1.2 Añadir los overrides `.light .about-canvas` en `src/app/globals.css` y verificar con el toggle de `Header.jsx` que la variante clara mantiene contraste de texto y legibilidad de las tarjetas
- [x] 1.3 Añadir los keyframes nuevos (`about-node-pulse`, `about-data-flow`, `about-blink`) y el bloque `@media (prefers-reduced-motion: reduce)` que anula animaciones dentro de `.about-canvas` — verificación: con `prefers-reduced-motion` activado en DevTools, no corre ninguna animación infinita de la sección

## 2. Shell de navegación por pestañas

- [x] 2.1 Crear el shell de pestañas en `AboutPage.jsx` con `useState` (activa por defecto `filosofia`), `role="tablist"`/`role="tab"`/`role="tabpanel"`, `aria-selected`, `aria-controls` y `focus-visible:ring-cyan-400`, con pills de estilo Lab (activo = gradiente cian) — verificación: cambiar de pestaña alterna las 4 vistas sin recarga y el estado inicial en SSR y cliente coincide
- [x] 2.2 Implementar el teclado de las pestañas (`ArrowLeft/ArrowRight/Home/End`, foco roving) y verificar con teclado que se recorren en orden y se anuncia la pestaña activa en el árbol de accesibilidad de DevTools
- [x] 2.3 Envolver los cambios de vista en `AnimatePresence mode="wait"` (fade + `y` corto) y comprobar en 375 px que la fila de pestañas es desplazable horizontalmente con targets ≥ 44 px

## 3. Sub-vista 1 — Filosofía (tabs de pilares)

- [x] 3.1 Crear `src/components/PhilosophyTabs.jsx` con los 3 pilares (Aprovechamiento Integral, Ingeniería de Estabilidad, Arquitectura Molecular) y selector horizontal accesible — verificación: Pilar 1 activo por defecto y cambio de pilar con clic/teclado
- [x] 3.2 Añadir el glow cian al ícono del pilar activo y el fade-in del copy al cambiar — verificación: cada activación muestra ícono + texto con fundido, sin parpadeos ni estados intermedios

## 4. Sub-vista 2 — Modelo Lab+Bio (fusión)

- [x] 4.1 Crear `src/components/LabBioFusion.jsx` con InnoCaps Lab a la izquierda, InnoCaps Bio a la derecha y nodo central cian con pulso (`about-node-pulse`) — verificación: el nodo late de forma continua y neutra en reposo
- [x] 4.2 Implementar la interacción de hover/focus/tap por lado: el nodo intensifica el glow hacia el lado activo, su información se despliega con efecto de luz y el lado opuesto queda atenuado — verificación: con ratón, teclado y en DevTools modo táctil se obtiene el mismo resultado

## 5. Sub-vista 3 — Equipo Científico (glow & blur)

- [x] 5.1 Crear `src/components/TeamGlowCards.jsx` con las tarjetas (director + aliados movidos aquí) usando `bg-[#03100e]/70 backdrop-blur-md border-[#00ffff]/20` — verificación: en reposo las tarjetas tienen fondo translúcido, blur y borde cian al 20 %
- [x] 5.2 Añadir el hover de iluminación (foto sale de grayscale con glow cian y el texto gana brillo) — verificación: al pasar el cursor la foto y el texto se iluminan; al salir vuelven al estado de reposo

## 6. Sub-vista 4 — Modelo B2B (diagrama animado)

- [x] 6.1 Crear `src/components/B2BFlowDiagram.jsx` con los 4 nodos (Investigación, Desarrollo, Validación, Escalado), conectores SVG con flujo de datos animado (`about-data-flow`) en fila desktop y columna móvil — verificación: las líneas animan el flujo en desktop y el diagrama se apila sin solapes a 375 px
- [x] 6.2 Implementar el panel lateral de detalle al pulsar un nodo (aside en desktop, bloque desplegable en móvil, cierre y cambio de nodo) — verificación: pulsar "Validación" abre su detalle, pulsar otro nodo lo sustituye y el control de cierre lo cierra sin bloquear la vista
- [x] 6.3 Sustituir la lista `Conectamos … →` por el diagrama y aplicar el parpadeo cian (`about-blink`) al resumen "Ofrecemos certeza técnica…" — verificación: ya no queda la lista de flechas de texto y el resumen late en cian (quieto con `prefers-reduced-motion`)

## 7. Verificación de integración

- [x] 7.1 Ejecutar `npm run build` y confirmar que compila sin errores y no genera `./out/`
- [x] 7.2 Ejecutar `npx eslint src/components/AboutPage.jsx src/components/PhilosophyTabs.jsx src/components/LabBioFusion.jsx src/components/TeamGlowCards.jsx src/components/B2BFlowDiagram.jsx` y confirmar que no se añaden avisos/errores nuevos al baseline (~36 errores / ~25 avisos preexistentes)
- [x] 7.3 Revisar manualmente en `npm run dev` los 7 escenarios críticos de `specs/seccion-nosotros/spec.md`: fondo continuo, cambio de pestañas, pilar con fade-in, fusión Lab+Bio, tarjetas de equipo, diagrama B2B con panel y parpadeo del resumen, en dark y light
