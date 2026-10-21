# Spec Delta

## Purpose

Define la arquitectura de rutas, la composición de páginas y la navegación contextual de las dos estrategias corporativas de InnoCaps (Lab y Bio & WiBio), garantizando separación estricta del contenido y compatibilidad SEO de las URLs legacy.

## ADDED Requirements

### Requirement: Home como hub de marca con orden definido
La página principal `/` SHALL mostrar el Header, el HeroSection con visor 3D, la sección "¿Por dónde empezamos?" (SelectorUnidades) inmediatamente después del hero y a continuación AlliesMarquee, en ese orden; AboutPage (la sección "Nosotros") SHALL vivir en la ruta propia `/nosotros`, no en la home.

#### Scenario: Composición y orden de la home
- **WHEN** el usuario accede a `/`
- **THEN** el HTML presenta en este orden el hero con el visor 3D, las tarjetas "Explorar InnoCaps Lab" (→ `/lab`) y "Explorar InnoCaps Bio" (→ `/bio`) y el carrusel de aliados, y no contiene textos de AboutPage, ProcessSection, BiotechPipeline, SectorsAccordion ni ProfessionalsSection.

#### Scenario: CTAs hacia contacto
- **WHEN** el usuario activa "Solicitar desarrollo" o "Solicitar suministro" en la home
- **THEN** la navegación llega al formulario en `/contacto`.

### Requirement: Vista propia de Nosotros bajo /nosotros
La ruta `/nosotros` SHALL servir la página completa de AboutPage (propósito, filosofía, equipo, aliados y plataforma) con su propio título y metadata, respondiendo directamente sin redirecciones.

#### Scenario: Contenido completo de Nosotros
- **WHEN** el usuario accede a `/nosotros`
- **THEN** la respuesta es 200 con el hero "Sobre Nosotros" y el resto de secciones de AboutPage, y no redirige a otra ruta.

### Requirement: Estrategia InnoCaps Lab bajo /lab
La ruta `/lab` SHALL componerse únicamente de ProcessSection, BiotechPipeline y SectorsAccordion, y el contenido heredado de las páginas especializadas SHALL vivir bajo `/lab/tecnologia`, `/lab/soluciones` y `/lab/proceso`.

#### Scenario: Página de estrategia Lab
- **WHEN** el usuario accede a `/lab`
- **THEN** se renderizan los tres componentes listados con su metadata propia, y no se renderiza ningún componente de Bio & WiBio ni AboutPage, AlliesMarquee o ProfessionalsSection.

#### Scenario: Páginas especializadas preservadas
- **WHEN** el usuario accede a `/lab/tecnologia`, `/lab/soluciones` o `/lab/proceso`
- **THEN** se sirven respectivamente TechnologyPage completa, SolutionsPage completa y ProcessTimeline, con sus metadatos.

### Requirement: Estrategia InnoCaps Bio & WiBio mínima
La ruta `/bio` SHALL servir una página mínima con el título "InnoCaps Bio & WiBio" y un aviso de contenido próximamente, sin importar ningún componente del contenido original.

#### Scenario: Contenido mínimo de Bio
- **WHEN** el usuario accede a `/bio`
- **THEN** el HTML muestra el título de la unidad y el aviso de contenido próximamente, y no contiene textos de los componentes del contenido original (p. ej. SprayDryingSection, SolutionsPillars, SectorsAccordion, ProcessSection).

### Requirement: Header contextual por estrategia
El Header SHALL adaptar su navegación según la ruta: en `/` y fuera de `/lab/*` muestra "Lab" y "Bio & WiBio"; dentro de `/lab/*` muestra "Tecnología", "Soluciones" y "Proceso" con prefijo `/lab`. En `/` el menú SHALL incluir además "Nosotros", enlazado a la ruta `/nosotros`. El logo SHALL enlazar siempre a `/` y el CTA a `/contacto` se mantiene en todos los contextos.

#### Scenario: Navegación en la home y en Bio
- **WHEN** el Header se renderiza en `/` o `/bio`
- **THEN** el menú muestra los enlaces a `/lab` y `/bio` (y en `/` además "Nosotros" → `/nosotros`), el toggle de tema y el CTA "Contactar".

#### Scenario: Navegación dentro de la estrategia Lab
- **WHEN** el Header se renderiza en cualquier ruta bajo `/lab/`
- **THEN** el menú muestra Tecnología (`/lab/tecnologia`), Soluciones (`/lab/soluciones`) y Proceso (`/lab/proceso`), el toggle de tema, el CTA "Contactar" y el logo enlazando a `/`.

#### Scenario: Navegación a la vista Nosotros
- **WHEN** el usuario pulsa "Nosotros" en el menú de la home
- **THEN** la navegación llega a `/nosotros`, que sirve AboutPage a pantalla completa.

### Requirement: Compatibilidad SEO de URLs legacy
Las rutas heredadas `/tecnologia`, `/soluciones` y `/proceso` SHALL redirigir con redirección permanente a sus equivalentes bajo `/lab`, y `/lab/nosotros` SHALL redirigir con redirección permanente a `/nosotros`. `/nosotros` SHALL responder directamente sin redirección.

#### Scenario: Redirección permanente
- **WHEN** un usuario o buscador solicita `/tecnologia`, `/soluciones`, `/proceso` o `/lab/nosotros`
- **THEN** la respuesta es una redirección permanente (308) hacia `/lab/tecnologia`, `/lab/soluciones`, `/lab/proceso` o `/nosotros` respectivamente, sin servir 404.

#### Scenario: Respuesta directa de /nosotros
- **WHEN** un usuario o buscador solicita `/nosotros`
- **THEN** la respuesta es 200 con el contenido de AboutPage, sin redirección.

#### Scenario: Separación estricta de contenido por ruta
- **WHEN** se compara el HTML servido de `/`, `/nosotros`, `/bio` y cada ruta `/lab/*`
- **THEN** cada texto único de los componentes del contenido original aparece únicamente en su ruta asignada y no en las demás.
