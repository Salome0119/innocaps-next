# Tasks — Reestructuración Flujo B2B (InnoCaps)

## 1. Configuración de Rutas, Layout Único y Redirecciones
- [ ] Configurar redirecciones permanentes en `next.config.ts` para rutas legacy (`/tecnologia` → `/lab`, `/soluciones` → `/bio`, `/proceso` → `/lab`).
- [ ] Verificar que el `<Header/>` global y el `<Footer/>` institucional residan exclusivamente en `src/app/layout.tsx` para evitar duplicaciones y conflictos con el estado de tema.
- [ ] Crear la estructura de directorios App Router para `/lab`, `/bio`, `/nosotros` y `/contacto` dentro de `src/app/`.
- [ ] Configurar el archivo `not-found.tsx` con el diseño corporativo de InnoCaps.

## 2. Hub Principal y Narrativa de Unidades (`/`, `/lab`, `/bio`, `/nosotros`)
- [ ] Actualizar `src/app/page.tsx` para integrar el Hero 3D (`ModelViewer.jsx`), las 4 brechas del mercado, el flujo estricto de 4 etapas (*1. Bioprospección → 2. Encapsulación → 3. Fermentación → 4. Escalamiento*) y el selector dual hacia Lab y Bio.
- [ ] Crear `src/app/lab/page.tsx` incorporando los componentes legados `NanoArsenal.jsx`, `BiotechPipeline.jsx` y los servicios de I+D+i enfocados en niveles TRL.
- [ ] Crear `src/app/bio/page.tsx` incorporando `SprayDryingSection.jsx`, `SolutionsPillars.jsx` y la matriz detallada de aplicación en los 7 sectores industriales de Biología.
- [ ] Crear `src/app/nosotros/page.tsx` integrando `SynthesisCanvas`, `OrganicNucleus` y el manifiesto corporativo.

## 3. Implementación de Suspense y Formulario B2B
- [ ] Crear el componente cliente dedicado `ContactForm.tsx` con soporte para lectura de `useSearchParams()`.
- [ ] Aislar y envolver `ContactForm` dentro de un límite `<Suspense>` con un fallback accesible en `/contacto/page.tsx`.
- [ ] Implementar la preselección dinámica de parámetros URL (`?type=lab`, `?type=bio`, `?type=licensing`).

## 4. Validación Final, Estilos y Compilación
- [ ] Validar la correcta aplicación de la identidad visual con la paleta estricta `slate`, acentos `teal`/`cyan` y efectos de glassmorphism en todos los componentes adaptados.
- [ ] Ejecutar `npm run build` para confirmar que no existen errores de generación estática (`bailout to static generation`) relacionados con `useSearchParams`.
- [ ] Ejecutar `openspec status --change reestructuracion-flujo-b2b` para verificar que todos los artefactos de planificación estén completamente en verde.