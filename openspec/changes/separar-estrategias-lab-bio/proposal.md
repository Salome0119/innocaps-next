# Proposal — separar-estrategias-lab-bio

## Why

La plataforma mezcla hoy la información de las dos unidades de negocio en el hub principal y en `/lab` y `/bio`: la home acumula brechas, flujo biotecnológico y contacto además del selector dual, y `/bio` contiene una landing completa que duplica contenido que debe vivir solo en la estrategia Lab. Se necesita una separación estricta: el sitio pasa a dos estrategias navegables (InnoCaps Lab e InnoCaps Bio & WiBio) con árboles de rutas independientes, para que Lab absorba todo el contenido de estrategia y Bio quede en mínimo hasta que se llene; la home conserva únicamente contenido de marca (hero, selector y Aliados) y "Nosotros" vive en su propia ruta `/nosotros`.

## What Changes

- **BREAKING** — La home (`/`) se compone en este orden: Header + HeroSection + sección "¿Por dónde empezamos?" (SelectorUnidades, inmediatamente después del hero) + AlliesMarquee; se eliminan de su render las brechas, el flujo de 4 etapas, ProcessSection, AboutPage y el bloque de contacto.
- `/lab` pasa a renderizar únicamente ProcessSection, BiotechPipeline y SectorsAccordion con metadata propia; ProfessionalsSection y AlliesMarquee salen de su render (los archivos permanecen intactos).
- El contenido heredado se muda bajo `/lab/*` mediante `git mv`: `/tecnologia` → `/lab/tecnologia`, `/soluciones` → `/lab/soluciones`, `/proceso` → `/lab/proceso`. AboutPage (antigua `/nosotros`) se restaura como ruta propia en `src/app/nosotros/page.tsx` (Header + AboutPage + metadata) y la ruta `/lab/nosotros` se retira (su `page.tsx` se borra; `NucleoEscena.tsx` se conserva sin uso).
- `/bio` se sustituye por una página mínima nueva ("InnoCaps Bio & WiBio" + aviso de contenido próximamente); no importa ningún componente del contenido original.
- Redirecciones permanentes en `next.config.ts`: `/tecnologia`, `/soluciones`, `/proceso` → sus equivalentes `/lab/...`; `/lab/nosotros` → `/nosotros`. `/nosotros` se sirve directamente (sin redirect).
- Header contextual con `usePathname`: en `/` y `/bio` (y rutas no-Lab) muestra "Lab" y "Bio & WiBio"; dentro de `/lab/*` muestra Tecnología, Soluciones y Proceso con prefijo `/lab`; en la home el menú añade "Nosotros" → `/nosotros`; el logo siempre enlaza a `/`.
- Actualización de enlaces internos a las rutas nuevas (`ServiceModel` → `/lab/soluciones`, CTA del hero → `/lab`, etc.).
- Actualización de la línea de navegación en `.opencode/skills/innocaps-brand/SKILL.md`.
- `/contacto` y `not-found.tsx` permanecen sin cambios (el enlace `/nosotros` del 404 resuelve a la ruta propia).

## Capabilities

### New Capabilities
- `estrategias-lab-bio`: Arquitectura de rutas y navegación de las dos estrategias corporativas (Lab / Bio & WiBio): composición de páginas, separación estricta de contenido, header contextual y redirecciones legacy.

### Modified Capabilities
<!-- ninguna: no existen specs base archivadas; el cambio anterior sigue in-progress -->

## Impact

- Archivos: `src/app/page.tsx` (orden hero → selector → Aliados), `src/app/nosotros/page.tsx` (ruta restaurada), `src/app/lab/page.tsx`, `src/app/bio/page.tsx`, `src/app/{tecnologia,soluciones,proceso}` (movidos a `src/app/lab/...`), `src/app/lab/nosotros` (retirado), `src/components/AboutPage.jsx` (raíz `main` → `div`), `src/components/Header.jsx`, `src/components/ServiceModel.jsx`, `src/components/HeroSection.jsx`, `next.config.ts`, `.opencode/skills/innocaps-brand/SKILL.md`.
- Sin cambios de copy ni de estilos; los componentes no renderizados siguen íntegros en `src/components` (regla de no eliminación).
- SEO: `/tecnologia`, `/soluciones` y `/proceso` redirigen 308 a `/lab/*`; `/lab/nosotros` redirige 308 a `/nosotros`; `/nosotros` responde 200 directamente.
- No se afecta compatibilidad `.light`.
