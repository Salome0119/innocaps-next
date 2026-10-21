# Proposal

## Why

La sección Nosotros (`/nosotros`, `AboutPage.jsx`) sigue siendo una página estática de bloques apilados con fondos negros planos que cortan la continuidad visual, mientras que el resto del sitio (home, Lab) ya evolucionó hacia un lenguaje bioluminiscente (fondo esmeralda `#03100e`, glows cian/violeta, tarjetas con `backdrop-blur` y bordes cian translúcidos). Para que "Nosotros" comunique la misma tecnología que vende, debe pasar de scroll lineal a una experiencia con sub-navegación por pestañas y microinteracciones, tomando la sección Lab como patrón de referencia.

## What Changes

- **Fondo unificado**: eliminar los `bg-black` / `bg-slate-950` alternos de cada bloque y reemplazarlos por un único lienzo `#03100e` con glows cian (izquierda) y violeta (derecha) que recorre toda la sección sin cortes horizontales.
- **Sub-navegación por pestañas (sub-SPA)** en Nosotros, patrón idéntico a las tabs de `ProcessSection.jsx` (Lab): 4 pestañas que alternan vistas dinámicas sin salir de la página.
- **Sub-vista 1 — Filosofía**: los 3 bloques estáticos pasan a un selector horizontal de pestañas (`Pilar 1: Aprovechamiento Integral`, `Pilar 2: Ingeniería de Estabilidad`, `Pilar 3: Arquitectura Molecular`); al activar una, se muestra su ícono con glow cian y su copy con fade-in.
- **Sub-vista 2 — Modelo Lab+Bio**: las 2 tarjetas desconectadas se reemplazan por un componente de fusión con nodo de conexión cian pulsante al centro; hover sobre Lab o Bio ilumina el nodo y despliega la información de ese lado con efecto de luz.
- **Sub-vista 3 — Equipo Científico**: tarjetas con fondo `#03100e/70`, `backdrop-blur-md` y borde `#00ffff/20`; en hover la foto se "ilumina" (sale de grayscale + glow) y el texto gana brillo.
- **Sub-vista 4 — Modelo B2B**: la lista `Conectamos … →` se reemplaza por un diagrama de flujo animado (Investigación → Desarrollo → Validación → Escalado) con líneas de datos animadas; al pulsar cada punto se abre un panel lateral con detalles. El resumen "Ofrecemos certeza técnica…" parpadea en cian.
- **Fuera del alcance de pestañas**: el Hero y el CTA final permanecen como secciones fijas arriba/abajo; Aliados Estratégicos se mantiene como sección propia debajo de las pestañas (no se elimina contenido).

## Capabilities

### New Capabilities
- `seccion-nosotros`: experiencia interactiva de la sección Nosotros — lienzo bioluminiscente unificado, navegación por pestañas con las 4 sub-vistas (filosofía, modelo Lab+Bio, equipo, plataforma B2B) y sus microinteracciones.

### Modified Capabilities

<!-- ninguna capability existente cambia de requisitos -->

## Impact

- **Código**: `src/components/AboutPage.jsx` (reescritura parcial de los bloques 2–6 y del export principal); posibles añadidos de keyframes/utilidades en `src/app/globals.css` (glow pulsante, parpadeo cian, líneas de datos) respetando los overrides de modo `.light`.
- **Sin cambios de enrutado ni datos**: `/nosotros` sigue siendo un Server Component fino con `metadata`; no se toca `next.config.ts`, ni API routes, ni dependencias nuevas (`framer-motion` y `lucide-react` ya están en `package.json`).
- **Accesibilidad/UX**: teclado y `aria-*` en las pestañas, `prefers-reduced-motion` para las animaciones continuas, comportamiento mobile apilado (tabs con scroll horizontal, diagrama vertical).
- **Verificación**: `npm run build` + `npm run lint` antes de dar por completado (baseline de lint con errores preexistentes intacto).
