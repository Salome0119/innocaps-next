# Tasks — Reestructuración Flujo B2B (InnoCaps)

## 1. Configuración de Rutas y Estructura App Router
- [ ] Crear la estructura de directorios para `/lab`, `/bio`, `/nosotros` y `/contacto` dentro de `src/app/`.
- [ ] Configurar el archivo `not-found.tsx` con el diseño corporativo de InnoCaps.
- [ ] Actualizar el componente principal `src/app/page.tsx` para incorporar el Hero 3D (`ModelViewer`) y el flujo biotecnológico de 4 etapas.

## 2. Re-mapeo y Reutilización de Componentes Legados
- [ ] Importar y ubicar `NanoArsenal` y `BiotechPipeline` en la página de la unidad `/lab`.
- [ ] Importar y ubicar `SprayDryingSection` en la página de la unidad `/bio`.
- [ ] Integrar `SynthesisCanvas` y `OrganicNucleus` en la sección `/nosotros`.
- [ ] Validar que todas las importaciones de componentes y datos (`sectionsData.js`) funcionen sin errores de compilación ni pérdida de código previo.

## 3. Implementación de Suspense y Formulario B2B
- [ ] Crear el componente cliente dedicado `ContactForm.tsx` con soporte para lectura de `useSearchParams()`.
- [ ] Aislar y envolver `ContactForm` dentro de un límite `<Suspense>` con un fallback accesible en `/contacto/page.tsx`.
- [ ] Implementar la preselección dinámica de parámetros URL (`?type=lab`, `?type=bio`, `?type=licensing`).

## 4. Validación Final y Compilación Estática
- [ ] Ejecutar `next build` para confirmar que no existen errores de generación estática (`bailout to static generation`) relacionados con `useSearchParams`.
- [ ] Comprobar la correcta visualización de la identidad visual (`slate`, acentos `teal`/`cyan`, glassmorphism).
- [ ] Ejecutar `npx openspec status --change reestructuracion-flujo-b2b` para verificar que todos los artefactos estén en verde.