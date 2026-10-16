# Spec Delta

## Purpose
Establece la reestructuración completa de la plataforma innocaps-next hacia un modelo corporativo B2B integrado por dos unidades de negocio (Lab y Bio), organizando la navegación en App Router bajo un flujo biotecnológico de 4 etapas y garantizando la preservación total de los componentes e identidad visual existentes.

---

## 1. OBJETIVO, ALCANCE Y PRINCIPIOS FUNDAMENTALES

### 1.1. Objetivo general
Transformar la aplicación `innocaps-next` en una plataforma corporativa B2B que represente formalmente la arquitectura de InnoCaps como una compañía integrada por dos unidades de negocio:
- **InnoCaps Lab:** investigación, desarrollo, innovación, formulación, caracterización y transferencia tecnológica.
- **InnoCaps Bio & WiBio:** escalamiento, estandarización, comercialización y suministro B2B de ingredientes funcionales.

### 1.2. Principios de preservación y calidad
- **Regla de Cero Eliminación:** Ningún componente existente (`NanoArsenal`, `BiotechPipeline`, `SolutionsPillars`, `SprayDryingSection`, `SynthesisCanvas`, `OrganicNucleus`, `ModelViewer`, etc.) ni estructuras de datos (`sectionsData.js`) pueden ser borrados; deben ser remapeados y reutilizados.
- **Identidad Visual Corporativa:** Uso estricto de la paleta `slate`, acentos `teal`/`cyan`, glassmorphism y animaciones con `framer-motion`.

---

## ADDED Requirements

### Requirement: Arquitectura de Rutas y Navegación B2B
La aplicación SHALL transformar su estructura en un esquema App Router de Next.js orientado a conversión comercial B2B, reflejando el modelo "Dos Unidades, Una Compañía".

#### Scenario: Mapa de rutas públicas y componentes base
- **WHEN** el usuario navega por la plataforma
- **THEN** el sistema expone las rutas `/` (Hub Principal), `/lab` (Unidad 01 I+D+i), `/bio` (Unidad 02 Escalamiento y WiBio), `/nosotros` (Propósito Corporativo), `/contacto` (Formulario B2B) y `not-found.tsx`, manteniendo un Header con navegación y CTA corporativo, y un Footer institucional.

---

### Requirement: Reglas Inmutables y Preservación de Código
El sistema SHALL prohibir estrictamente la eliminación de componentes y datos existentes en el repositorio bajo la política de cero pérdida de código.

#### Scenario: Re-mapeo y reutilización de componentes legados
- **WHEN** se implementa la nueva arquitectura de rutas
- **THEN** se conservan, importan y reutilizan intactos los componentes `NanoArsenal`, `BiotechPipeline`, `SolutionsPillars`, `SprayDryingSection`, `SynthesisCanvas`, `OrganicNucleus`, `ModelViewer`, `BiotechDeepDive`, `ProcessTimeline`, `AlliesMarquee`, `ProfessionalsSection` y las estructuras de datos de `sectionsData.js`.

#### Scenario: Coherencia de identidad visual (innocaps-brand)
- **WHEN** se renderizan los elementos de la interfaz
- **THEN** se aplica exclusivamente la paleta `slate` (`slate-950`, `slate-900`, `slate-800`), acentos `teal-500`/`teal-400` y `cyan-500`/`cyan-400`, efectos de glassmorphism y animaciones fluidas (`framer-motion`).

---

### Requirement: Hub de Marca y Páginas Especializadas de Unidades
La plataforma SHALL estructurar su narrativa científica en cuatro etapas biotecnológicas oficiales y separar de forma clara las dos unidades de negocio.

#### Scenario: Página de Inicio e Inicio Biotecnológico
- **WHEN** el usuario accede a `/`
- **THen** visualiza el Hero con visor 3D (`ModelViewer.tsx`), las 4 brechas del mercado, el flujo estricto (*1. Bioprospección → 2. Encapsulación → 3. Fermentación → 4. Escalamiento*) y el selector dual hacia Lab y Bio.

#### Scenario: Páginas de Unidad Lab y Unidad Bio
- **WHEN** el usuario navega a `/lab` o `/bio`
- **THEN** `/lab` expone servicios de I+D+i, formulación y TRL, mientras que `/bio` presenta el portafolio de ingredientes industriales y la matriz de aplicación en 7 sectores industriales.

---

### Requirement: Manejo Robusto de Parámetros URL con Suspense
El sistema SHALL aislar el uso de `useSearchParams()` en componentes cliente dedicados envueltos en límites de React `<Suspense>` para garantizar la compatibilidad con el renderizado estático de Next.js App Router.

#### Scenario: Carga y preselección segura en formulario de contacto
- **WHEN** el usuario navega a `/contacto?type=lab`, `?type=bio` o `?type=licensing`
- **THEN** la página de contacto utiliza un componente cliente secundario (`ContactForm`) protegido por un límite `<Suspense>` con fallback accesible, preseleccionando el asunto comercial de forma dinámica sin romper la compilación estática (`next build`).