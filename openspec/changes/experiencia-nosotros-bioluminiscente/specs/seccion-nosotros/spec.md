# Spec Delta

## Purpose

Define el comportamiento observable de la sección Nosotros (`/nosotros`) como experiencia bioluminiscente interactiva: lienzo visual continuo, navegación por pestañas con cuatro sub-vistas dinámicas y sus microinteracciones, manteniendo hero, aliados y CTA como secciones externas a las pestañas.

## ADDED Requirements

### Requirement: Lienzo bioluminiscente unificado
La sección Nosotros SHALL presentar un fondo continuo esmeralda ultra oscuro (`#03100e`) con resplandores cian hacia la izquierda y violeta hacia la derecha, sin cortes horizontales de color entre bloques. La navegación completa por la sección SHALL sentirse como un solo lienzo fluido.

#### Scenario: Sin cortes de color al hacer scroll
- **WHEN** el usuario recorre la sección de arriba a abajo (hero → pestañas → aliados → CTA)
- **THEN** no existen transiciones bruscas de fondo negro a esmeralda ni bandas planas de color; el resplandor cian/violeta permanece visible de forma continua

#### Scenario: Respeto del modo claro
- **WHEN** el `<html>` tiene la clase `.light`
- **THEN** el fondo y los resplandores de la sección se remapean a la paleta clara definida en `globals.css` sin romper la legibilidad del texto

### Requirement: Navegación por pestañas de la sección
La sección SHALL incluir una sub-navegación por pestañas con exactamente cuatro opciones: Filosofía, Modelo Lab+Bio, Equipo Científico y Modelo B2B. Seleccionar una pestaña SHALL cambiar la vista mostrada de forma dinámica, sin navegación de página ni recarga, manteniendo el scroll de la sección.

#### Scenario: Cambio de pestaña
- **WHEN** el usuario pulsa la pestaña "Modelo B2B"
- **THEN** la vista activa pasa a ser el diagrama B2B, las demás vistas dejan de renderizarse y la pestaña activa muestra un estado visual diferenciado (fondo/acentos cian)

#### Scenario: Acceso por teclado y lectores de pantalla
- **WHEN** el usuario navega con Tab/Shift+Tab y activa con Enter o Espacio
- **THEN** cada pestaña es enfocable, se anuncia como pestaña con `aria-selected`/`role="tab"` y el panel activo queda asociado a ella

#### Scenario: Pestaña activa por defecto
- **WHEN** la sección se monta por primera vez
- **THEN** la pestaña "Filosofía" aparece activa por defecto

### Requirement: Sub-vista de Filosofía con selector de pilares
La sub-vista de Filosofía SHALL mostrar un selector de pestañas horizontal con los pilares "Aprovechamiento Integral", "Ingeniería de Estabilidad" y "Arquitectura Molecular". Al activar un pilar, SHALL mostrarse su ícono con resplandor cian junto a su texto descriptivo mediante un fundido (fade-in) suave.

#### Scenario: Selección de un pilar
- **WHEN** el usuario activa "Pilar 3: Arquitectura Molecular"
- **THEN** se muestra el ícono 🧬 con glow cian y el copy de ese pilar, con un fade-in, reemplazando al pilar anterior

#### Scenario: Estado inicial del selector
- **WHEN** se entra a la sub-vista de Filosofía
- **THEN** el Pilar 1 (Aprovechamiento Integral) aparece seleccionado y su contenido es el visible

### Requirement: Sub-vista de Modelo Lab+Bio con nodo de fusión
La sub-vista del modelo SHALL mostrar InnoCaps Lab a la izquierda, InnoCaps Bio a la derecha y un nodo de conexión cian brillante al centro que palpite. Al pasar el cursor sobre Lab o Bio, el nodo central SHALL reaccionar visualmente y la información del lado activo SHALL desplegarse con un sutil efecto de luz.

#### Scenario: Hover sobre Lab
- **WHEN** el usuario pasa el cursor sobre el bloque de InnoCaps Lab
- **THEN** el nodo central intensifica su pulso/glow hacia el lado de Lab y la información de Lab se despliega con un efecto de luz, mientras Bio queda atenuada

#### Scenario: Sin interacción
- **WHEN** el cursor no está sobre ninguno de los dos lados
- **THEN** el nodo central pulsa de forma neutra y ambos lados muestran su información base sin atenuación

#### Scenario: Interacción táctil
- **WHEN** el usuario toca Lab o Bio en un dispositivo táctil
- **THEN** el lado tocado queda seleccionado y muestra su información iluminada (equivalente al hover)

### Requirement: Sub-vista de Equipo con tarjetas de glow y blur
Las tarjetas de la sub-vista Equipo SHALL usar fondo `#03100e/70`, `backdrop-blur-md` y borde translúcido cian (`#00ffff/20`). Al hacer hover, la foto del científico SHALL "iluminarse" y el texto SHALL ganar brillo.

#### Scenario: Hover sobre una tarjeta de equipo
- **WHEN** el usuario pasa el cursor sobre la tarjeta de un científico
- **THEN** la foto sale del tratamiento en escala de grises y recibe un resplandor, el borde de la tarjeta sube de opacidad hacia cian y el texto pasa a un tono más brillante

#### Scenario: Reposo de la tarjeta
- **WHEN** la tarjeta no está en hover
- **THEN** conserva fondo `#03100e/70`, `backdrop-blur-md`, borde cian al 20 % de opacidad y la foto en escala de grises

### Requirement: Sub-vista de Modelo B2B con diagrama de flujo animado
La sub-vista B2B SHALL mostrar un diagrama de flujo interactivo con los puntos Investigación, Desarrollo, Validación y Escalado unidos por líneas de datos animadas, en lugar de una lista con flechas de texto. Al pulsar un punto SHALL abrirse un panel lateral con más detalles de ese punto.

#### Scenario: Activación de un punto del diagrama
- **WHEN** el usuario pulsa el nodo "Validación"
- **THEN** se abre un panel lateral con el detalle de Validación y el nodo queda marcado como activo

#### Scenario: Cierre del panel
- **WHEN** el usuario pulsa otro nodo o el control de cierre del panel
- **THEN** el panel muestra el nuevo detalle o se cierra, sin bloquear la interacción con el resto de la sub-vista

#### Scenario: Movimiento continuo de datos
- **WHEN** la sub-vista está visible
- **THEN** las líneas entre nodos animan un flujo de datos continuo y dicha animación se detiene cuando el sistema reporta `prefers-reduced-motion`

### Requirement: Resumen de certeza técnica con destello cian
El cierre de la sub-vista B2B SHALL mostrar el mensaje "Ofrecemos certeza técnica, respaldo científico y acompañamiento estratégico" con un efecto de parpadeo/resplandor en cian, respetando `prefers-reduced-motion`.

#### Scenario: Parpadeo del resumen
- **WHEN** la sub-vista B2B está visible sin restricciones de movimiento
- **THEN** el texto del resumen emite un pulso cian periódico

### Requirement: Comportamiento responsive de la sección
En pantallas móviles la navegación por pestañas SHALL ser desplazable horizontalmente y las sub-vistas SHALL apilarse verticalmente, conservando objetivos táctiles de al menos 44 px y sin texto cortado.

#### Scenario: Vista en móvil
- **WHEN** la sección se renderiza a 375 px de ancho
- **THEN** las pestañas se desplazan horizontalmente, las sub-vistas se muestran en columna y cada control mantiene un área táctil ≥ 44 px
