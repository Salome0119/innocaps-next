# ==========================================
# CHANGE PROPOSAL
# PROYECTO: innocaps-next
# CAMBIO: reestructuracion-flujo-b2b
# TÍTULO: Reestructuración de la Plataforma a B2B con Dualidad Corporativa y Experiencia Dinámica
# ==========================================

## 1. RESUMEN EJECUTIVO Y JUSTIFICACIÓN
La aplicación actual de `innocaps-next` requiere una evolución estructural para pasar de un sitio de presentación estático a una **plataforma corporativa B2B de alto rendimiento**. Esta propuesta formaliza el modelo de negocio "Dos Unidades, Una Compañía" (**InnoCaps Lab** e **InnoCaps Bio & WiBio**), reorganizando la navegación bajo un flujo biotecnológico estricto de 4 etapas (*Bioprospección → Encapsulación → Fermentación → Escalamiento*) y asegurando una vía de conversión comercial directa a través de un formulario dinámico de contacto.

## 2. CAMBIOS ARQUITECTÓNICOS PROPUESTOS
- **Migración a App Router Estructurado:** Establecer las rutas principales en `src/app/`:
  - `/` (Hub de marca, 4 brechas de mercado, flujo de 4 etapas y selector dual Lab/Bio).
  - `/lab` (Unidad de I+D+i, servicios a medida, pipeline TRL y licenciamiento).
  - `/bio` (Unidad de escalamiento, portafolio de ingredientes WiBio y sectores industriales).
  - `/nosotros` (Propósito corporativo, historia y equipo).
  - `/contacto` (Formulario B2B con soporte de parámetros dinámicos por URL).
  - `not-found.tsx` (Pantalla de error personalizada con estética biotecnológica).
- **Adaptación de Interfaces:** Actualización del `Header` y `Footer` para reflejar la nueva navegación y llamadas a la acción (CTA) comerciales (`Solicitar Cotización / Muestra`).

## 3. GUARDRAILS Y REGLAS DE PRESERVACIÓN
- **Cero Eliminación de Código:** Todos los componentes existentes (`NanoArsenal`, `BiotechPipeline`, `SolutionsPillars`, `SprayDryingSection`, `SynthesisCanvas`, `OrganicNucleus`, `ModelViewer`, etc.) y las estructuras de datos de `sectionsData.js` se preservarán intactos y se reasignarán a las nuevas rutas.
- **Identidad Visual (`innocaps-brand`):** Respeto estricto por la paleta de colores (`slate`, `teal`, `cyan`), efectos de *glassmorphism* y animaciones existentes definidas en `globals.css`.

## 4. IMPACTO Y BENEFICIOS
- **Conversión Comercial:** Canalización clara de leads B2B hacia los servicios de laboratorio o suministro industrial.
- **Claridad Narrativa:** Alineación exacta entre la propuesta científica de InnoCaps y las necesidades de los clientes corporativos globales.
- **Mantenibilidad:** Arquitectura limpia bajo Next.js 16 / React 19 respaldada por la fuente única de verdad (`spec.md`).

## 5. PLAN DE VALIDACIÓN Y PRUEBAS
- Verificación de compilación limpia (Next.js Build).
- Comprobación de la preselección de asuntos en `/contacto` mediante parámetros de URL (`?type=lab`, `?type=bio`, `?type=licensing`).
- Pruebas de responsividad móvil y correcta hidratación de componentes cliente (`use client`).