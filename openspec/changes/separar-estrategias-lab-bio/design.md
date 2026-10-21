# Design

## Context

Ver proposal.md (Why). El App Router ya sirve todas las rutas en SSR estático/estático-prerrenderizado; los componentes del contenido original viven en `src/components` y no deben moverse ni borrarse. Las páginas delgadas actuales (`/tecnologia`, `/soluciones`, `/proceso`) ya son wrappers con metadata y se reubican con `git mv`; AboutPage se sirve en la ruta propia `/nosotros` (restaurada en `src/app/nosotros/`) y su paso por `/lab/nosotros` se retira. El proyecto no tiene `output: "export"` (entorno dinámico), por lo que `redirects()` de `next.config.ts` funciona en `next start`.

## Goals / Non-Goals

**Goals:**
- Separación estricta de contenido por estrategia: Lab acumula el contenido de estrategia, la home conserva solo contenido de marca (hero, selector, Aliados), Nosotros vive en `/nosotros` y Bio queda mínimo.
- Reubicación de rutas bajo `/lab/*` conservando historial git y metadata.
- Header contextual con `usePathname` y redirecciones 308 para SEO.

**Non-Goals:**
- Rediseño de copy, estilos o comportamiento de los componentes del contenido original.
- Eliminar o refactorizar componentes, datos o assets.
- Ampliar el contenido de `/bio` (se llenará en un cambio futuro).

## Decisions

1. **`git mv` de las páginas delgadas** en lugar de recrear archivos: conserva historial; `NucleoEscena.tsx` (no trackeado) se mueve con `Move-Item`.
2. **Header contextual con `usePathname`** dentro del propio `Header.jsx` (ya es componente cliente): `pathname.startsWith("/lab")` selecciona el nav Lab; `pathname === "/"` usa el patrón de home (Lab, Bio & WiBio, Nosotros → `/nosotros`); el resto usa el patrón simple Lab/Bio & WiBio. Alternativa descartada: dos headers por página (duplicaría copy y mantenimiento).
3. **`redirects()` en `next.config.ts`** (fuente de verdad del servidor) en lugar de rutas `page.tsx` intermedias: menos archivos y comportamiento 308 nativo verificable con `curl -I`.
4. **Home con orden hero → selector → Aliados**: `page.tsx` renderiza Header + HeroSection + SelectorUnidades ("¿Por dónde empezamos?") inmediatamente después del hero y a continuación AlliesMarquee; se elimina del render brechas, flujo de 4 etapas, ProcessSection, AboutPage y bloque de contacto; el CTA del hero (`#tecnologia`, cuyo ancla desaparece) se reenlaza a `/lab`.
5. **AboutPage vive en la ruta propia `/nosotros`**: se restaura `src/app/nosotros/page.tsx` (Header + AboutPage + metadata; la home no lo renderiza) y la ruta `/lab/nosotros` se retira (su `page.tsx` se borra; `NucleoEscena.tsx` queda sin uso y no se borra). ProfessionalsSection sale del render de `/lab`; los archivos permanecen en el repo (regla de no eliminación). La raíz de `AboutPage.jsx` pasa de `main` a `div` (se conserva `id="nosotros"` como identificador de la sección).
6. **Contacto y 404 intactos**: `/nosotros` responde 200 directamente (el enlace del 404 resuelve a la ruta) y `/lab/nosotros` redirige 308 a `/nosotros`.

## Risks / Trade-offs

- [Contenido "se pierde" del render de home/lab/bio viejo] → Es intencional y ordenado por el usuario; los componentes/archivos permanecen en `src/components` y se re-renderizan en `/nosotros` o bajo `/lab/*` según su asignación.
- [Enlaces internos rotos tras la mudanza] → Auditoría previa identificó todos (`Header`, `ServiceModel`, hero `#tecnologia`); se actualizan y se verifica con curl.
- [`usePathname` en SSR/prerender] → Next lo resuelve en el cliente para componentes cliente; el Header ya es `'use client'` con estados, sin riesgo de bailout.
- [Borrado accidental de archivos] → Restricción explícita: nada se borra de `src/components`, `src/data` ni `public`.

## Migration Plan

1. `git mv` de páginas + rewrite de `/`, `/lab`, `/bio` y restauración de `/nosotros`.
2. Header contextual + fixes de enlaces + redirects + skill.
3. Verificación: `npm run build` (sin `./out/`), `npm run start` + curl de separación y orden de contenido y `curl -I` de redirects (`/nosotros` 200 directo; `/lab/nosotros` → `/nosotros`).
4. Rollback: revert de los archivos tocados (no hay migración de datos).

## Open Questions

- Ninguno bloqueante: el contenido futuro de `/bio` se aborda en otro change.
