# Spec Delta

## Purpose

Define el comportamiento del header global de Innocaps: pestañas principales estables (Lab, Bio & WiBio, Pipeline, Nosotros, Contacto), segundo nivel desplegable accesible, anclas con scroll suave y menú móvil equivalente.

## ADDED Requirements

### Requirement: Pestañas principales estables del header
El header SHALL mostrar de forma permanente las pestañas principales "Lab", "Bio & WiBio", "Pipeline", "Nosotros" y "Contacto" en escritorio, sin cambiar su composición según la ruta visitada. El conjunto SHALL mantenerse accesible en el menú móvil.

#### Scenario: Header en cualquier ruta
- **WHEN** el usuario visita `/`, `/bio`, `/lab/proceso` o `/nosotros`
- **THEN** las cinco pestañas principales permanecen visibles en el mismo orden y el estado activo refleja la sección actual

#### Scenario: Equivalente móvil
- **WHEN** el usuario abre el menú móvil en cualquier ruta
- **THEN** aparecen las mismas cinco entradas y las sub-entradas de Lab y Bio & WiBio

### Requirement: Segundo nivel desplegable
"Lab" y "Bio & WiBio" SHALL desplegar un segundo nivel al hacer hover (escritorio), clic o foco+Enter: Lab con Tecnología, Soluciones y Proceso (`/lab/*`); Bio & WiBio con Tecnología, Escalamiento, Soluciones B2B, Cómo Trabajamos y Aplicaciones (conmutadores de vista de `/bio`). El desplegable SHALL ser operable con teclado y anunciar su estado.

#### Scenario: Apertura y cierre por teclado
- **WHEN** el usuario enfoca "Bio & WiBio" y pulsa Enter o flecha abajo
- **THEN** el segundo nivel se despliega, el foco puede recorrer sus enlaces y `Esc` lo cierra devolviendo el foco al disparador

#### Scenario: Estado ARIA
- **WHEN** el desplegable está abierto
- **THEN** el botón expone `aria-expanded="true"` y el panel está asociado mediante `aria-controls`

### Requirement: Pipeline como ancla con scroll suave
La pestaña "Pipeline" SHALL llevar a la sección `#pipeline` de `/lab` (bloque BiotechPipeline) con scroll suave, compensando la altura del header fijo y sin recargar la página cuando ya se está en `/lab`.

#### Scenario: Navegación desde otra página
- **WHEN** el usuario pulsa "Pipeline" estando en `/bio`
- **THEN** navega a `/lab#pipeline` y la sección queda visible por debajo del header, sin tapado por el elemento fijo

#### Scenario: Navegación dentro de /lab
- **WHEN** el usuario pulsa "Pipeline" estando en `/lab`
- **THEN** hace scroll suave hasta `#pipeline` sin recarga completa de la página

### Requirement: Estados activos y hover consistentes
Cada pestaña SHALL mostrar un estado activo (acento teal/cian del sistema de marca) coherente con la ruta actual, y hover con subrayado o glow sutil heredado del patrón actual del header.

#### Scenario: Ruta activa
- **WHEN** el usuario está en `/contacto`
- **THEN** "Contacto" aparece en estado activo y el resto en reposo
