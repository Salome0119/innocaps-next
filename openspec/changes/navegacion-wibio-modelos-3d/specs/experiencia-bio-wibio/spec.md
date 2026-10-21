# Spec Delta

## Purpose

Define la experiencia de `/bio` (InnoCaps Bio & WiBio): sub-vistas conmutadas desde el navbar mediante URL, contenido comercial del portafolio WiBio (series, modelos de negocio, verticales) y escenas 3D interactivas de microcápsula y bioreactor con degradación por dispositivo.

## ADDED Requirements

### Requirement: Sub-vistas conmutadas por URL
`/bio` SHALL renderizar cinco sub-vistas (Tecnología, Escalamiento, Soluciones B2B, Cómo Trabajamos, Aplicaciones) cuyo estado activo se deriva del query param `seccion` (por defecto `tecnologia`). El segundo nivel del navbar SHALL cambiar la vista sin recarga de página, y la URL SHALL permitir enlaces directos y el uso del botón atrás/adelante del navegador.

#### Scenario: Conmutación desde el navbar
- **WHEN** el usuario elige "Soluciones B2B" en el desplegable de Bio & WiBio
- **THEN** la URL pasa a `/bio?seccion=soluciones` y la vista activa cambia con un fundido, sin recarga completa

#### Scenario: Enlace directo
- **WHEN** el usuario abre `https://…/bio?seccion=escalamiento`
- **THEN** la sub-vista Escalamiento aparece activa desde el primer render

#### Scenario: Botón atrás
- **WHEN** el usuario cambia de sub-vista y pulsa atrás
- **THEN** la sub-vista vuelve a la anterior y la URL se actualiza en consecuencia

### Requirement: Portafolio WiBio con series de producto
La sub-vista Soluciones B2B SHALL presentar las series GutAcid Balance® (protección gástrica de doble capa y liberación intestinal dirigida), KelaPhy® (sistema molecular de fitoactivos bioencapsulados), CurNova® (curcumino fitosomal), Microbiome Series (pre/pro/postbióticos, TRL 2-4) y Science Series (curcuminoides, nitratos cardiovasculares, antioxidantes hepatoprotectores, TRL 6+), cada una con su TRL visible.

#### Scenario: Visualización de una serie
- **WHEN** el usuario revisa el portafolio
- **THEN** las cinco series aparecen como tarjetas de vidrio con nombre, descriptor y badge de TRL, sin repetir el contenido de R&D/spray drying de Lab

### Requirement: Modelos de negocio y verticales B2B
La sub-vista Soluciones B2B SHALL incluir los tres modelos de negocio (01 Ingredientes funcionales, 02 Desarrollo tecnológico/co-desarrollo por contrato, 03 Licensing de IP, patentes de proceso y plataforma) y las seis verticales objetivo (alimentos funcionales, nutracéuticos y suplementos, cuidado personal y cosmética, salud animal, agroindustria, pharma/OTC).

#### Scenario: Selección de modelo de negocio
- **WHEN** el usuario activa "02 Desarrollo tecnológico"
- **THEN** se muestra su descripción diferenciada (co-desarrollo y R&D por contrato para terceros), distinta de ingredientes listos y de licensing

### Requirement: UVP de Unidad 02 (escalamiento)
La sub-vista Escalamiento SHALL comunicar la propuesta de valor de InnoCaps Bio —puente entre el descubrimiento en laboratorio y la manufactura a escala comercial— cubriendo producción piloto, prototipos, escalado industrial y ventas B2B, con narrativa de TRL/paso de escala.

#### Scenario: Relato Lab → Industria
- **WHEN** el usuario revisa la sub-vista Escalamiento
- **THEN** se muestran las etapas piloto → industrial con su traducción a capacidades B2B, sin repetir el contenido tecnológico de Lab

### Requirement: Escena 3D de microcápsula de doble capa
La zona WiBio SHALL incluir una escena 3D procedural con núcleo emisivo, cáscara semitransparente y partículas bioactivas en órbita, con rotación por arrastre (y sin zoom), efecto hover que intensifica el resplandor del núcleo y pausa fuera del viewport.

#### Scenario: Interacción con la microcápsula
- **WHEN** el usuario arrastra sobre el canvas
- **THEN** la microcápsula rota siguiendo el puntero, y al soltar mantiene la orientación (sin rebotes)

#### Scenario: Hover
- **WHEN** el puntero entra al canvas
- **THEN** el núcleo aumenta su emisivo/glow de forma suave y se atenúa al salir

### Requirement: Escena 3D de bioreactor
La sub-vista Escalamiento SHALL incluir una escena 3D estilizada de vasija de bioreactor (cuerpo translúcido, fluido, burbujas ascendentes y tuberías) representando la transición Lab → escala industrial, con rotación por arrastre.

#### Scenario: Visualización del bioreactor
- **WHEN** la sub-vista Escalamiento está activa
- **THEN** el bioreactor se muestra animado (burbujas/fluido) y es rotable con el puntero

### Requirement: Degradación por dispositivo y reduced-motion
Ambas escenas 3D SHALL respetar el nivel de dispositivo (móvil/gama baja: sin transmisión de vidrio, DPR 1, sin sombras) y `prefers-reduced-motion` (sin auto-rotación ni bucles intensos), sin bloquear el render del contenido HTML circundante.

#### Scenario: Móvil de gama baja
- **WHEN** la página se carga en un móvil
- **THEN** el canvas 3D usa calidad reducida y el contenido (texto, tarjetas) se renderiza de inmediato sin esperar al modelo
