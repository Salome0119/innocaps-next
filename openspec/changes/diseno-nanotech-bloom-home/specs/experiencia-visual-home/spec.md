# Spec Delta

## Purpose

Capa de presentación inmersiva de la home (`/`) de Innocaps: canvas WebGL de fondo con efecto bloom, indicador de progreso de scroll y reveals sutiles, con degradación por dispositivo, accesibilidad y modo claro, sin alterar contenido, orden de secciones ni navegación.

## ADDED Requirements

### Requirement: Canvas de fondo nanotech en la home
La home SHALL renderizar una escena WebGL fija a pantalla completa como capa de fondo, con efecto de bloom (postprocesado), que no intercepte eventos de puntero ni interfiera con la navegación, el texto seleccionable, los enlaces CTA ni el acceso a `/contacto`. La escena SHALL ser procedural (partículas instanciadas, núcleo, burbujas y anillos) con estética teal/lima coherente con la marca.

#### Scenario: El canvas no interfiere con la interacción
- **WHEN** el usuario hace clic, arrastre o teclea sobre cualquier elemento de la home (enlaces, botones, tarjetas del selector, menú del header)
- **THEN** el evento se resuelve en el elemento de la interfaz sin ser consumido por el canvas de fondo

#### Scenario: El canvas acompaña el scroll de la home
- **WHEN** el usuario desplaza la página desde el hero hasta la sección de aliados
- **THEN** la escena interpola su estado (posición, escala, grado de ensamblado) entre las zonas de la página de forma continua

#### Scenario: Presencia del canvas en primera carga
- **WHEN** se carga `/` en un navegador con WebGL habilitado y `prefers-reduced-motion` sin restricción
- **THEN** el canvas de fondo está visible detrás del contenido de las tres zonas de la home (hero, selector de unidades, aliados), las cuales tienen fondos translúcidos que permiten percibirlo

### Requirement: Indicador de progreso de scroll
La home SHALL mostrar una barra de progreso fija en el borde superior cuyo ancho representa el porcentaje de scroll recorrido, con gradiente teal→lima, sin cubrir ni desplazar el contenido.

#### Scenario: Barra durante el desplazamiento
- **WHEN** el usuario desplaza la página hacia abajo
- **THEN** la barra crece proporcionalmente al progreso del scroll y vuelve a 0 al llegar al inicio

### Requirement: Reveals sutiles al entrar en viewport
Los bloques de contenido de la home SHALL aparecer con una transición sutil de opacidad/desplazamiento al entrar en el viewport (una sola vez por carga), sin alterar el layout ni el texto original.

#### Scenario: Bloque entra en viewport
- **WHEN** un bloque de la home cruza el umbral inferior del viewport
- **THEN** transiciona a su estado visible y no vuelve a ocultarse

### Requirement: Degradación por dispositivo y rendimiento
La escena SHALL degradarse según la capacidad del dispositivo (menos instancias y/o bloom desactivado en gama baja), pausar el render cuando la pestaña no está visible y liberar todos los recursos GPU/listeners al desmontar. La home SHALL seguir siendo usable si WebGL falla (sin canvas, contenido intacto).

#### Scenario: Gama baja de dispositivo
- **WHEN** la home se carga en un dispositivo clasificado como de gama baja por la utilidad de device-tier existente
- **THEN** la escena usa menos partículas y el bloom se omite o se reduce, sin bloquear el render del HTML

#### Scenario: Pestaña en segundo plano
- **WHEN** la pestaña del navegador pierde el foco visible
- **THEN** el bucle de render se pausa y se reanuda al volver

### Requirement: Compatibilidad con modo claro y reduced-motion
En modo claro (clase `.light` en `<html>`) el canvas de fondo SHALL ocultarse y las secciones de la home recuperan fondos sólidos legibles. Con `prefers-reduced-motion: reduce` la escena SHALL mostrarse estática (sin animación continua) y los reveals SHALL mostrarse sin transición.

#### Scenario: Usuario activa el modo claro
- **WHEN** el usuario alterna al tema claro desde el header
- **THEN** el canvas de fondo desaparece y el contraste del texto de la home se mantiene sobre fondos sólidos

#### Scenario: Reduced-motion activo
- **WHEN** el sistema operativo declara `prefers-reduced-motion: reduce`
- **THEN** no hay animación continua de la escena ni desplazamiento animado de los reveals

### Requirement: Integridad del contenido y rutas de la home
El rediseño SHALL limitarse a la capa de presentación de `/`: el orden de secciones (Header → Hero con visor 3D → SelectorUnidades → AlliesMarquee), los textos institucionales, clases e IDs del markup, la navegación, los CTA a `/contacto` y el `ModelViewer` del hero permanecen intactos. Ninguna otra ruta (`/lab`, `/nosotros`, `/contacto`) se ve afectada.

#### Scenario: Estructura de la home preservada
- **WHEN** se compara el DOM de `/` antes y después del rediseño
- **THEN** desaparece solo la marcación nueva mínima del canvas/barra y no cambian texto, orden, ids ni enlaces de las secciones existentes

#### Scenario: Otras rutas sin cambios
- **WHEN** se navega a `/lab`, `/nosotros` o `/contacto`
- **THEN** su presentación y funcionamiento son idénticos a los previos al rediseño
