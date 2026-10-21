<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# innocaps-next

Spanish-language marketing site for Innocaps Lab (nanoencapsulation / biotech). Migrated from Astro — `MIGRACION.md` documents the Astro→Next equivalences and open gotchas; read it before touching migrated code.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · framer-motion · react-three-fiber/drei. npm is the package manager (`package-lock.json`); don't introduce pnpm/yarn lockfiles.

## Environment: dynamic SSR (Node.js Runtime)

As of the dynamic transition, `next.config.ts` has no `output: "export"`, no `trailingSlash`, and no `images.unoptimized` — `npm run build` compiles to `.next/` and `npm run start` serves in SSR mode. API routes, server actions, middleware, ISR and dynamic RSC are allowed; the image optimizer is active (code still uses plain `<img>` by convention — migrating to `next/image` is optional per component). Target: Payload CMS + PostgreSQL integration later. See the `next-dynamic` skill in `.opencode/skills/`.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — compiles to `.next/` (must NOT produce `./out/` anymore); also runs TypeScript checking. No separate typecheck script exists (`npx tsc --noEmit` works if needed standalone).
- `npm run start` — production server (SSR); run `npm run build` first.
- `npm run lint` — ESLint 9 flat config; `npx eslint src/path/to/file` for a focused check.
- **No test suite exists.** Don't add one without asking.

**Lint baseline:** `npm run lint` currently exits 1 with ~36 pre-existing errors (react-hooks purity / set-state-in-effect / immutability, unescaped entities) and ~25 `<img>` / unused-var warnings, mostly in the Astro-migrated components. CI does not run lint, so this doesn't block deploys. Don't mass-fix these as a side effect of unrelated work; just don't add new violations.

## Deploy

**Automatic deploy is disabled**: the FTP workflow no longer publishes (static `./out/` no longer exists). `.github/workflows/deploy.yml` only runs a manual build check (`workflow_dispatch`). A dynamic deploy strategy (VPS / Docker / Railway / Vercel with `npm run build` + `npm run start`) is pending — documented in `MIGRACION.md` and the `innocaps-deploy` skill. Pushes to `main` do not publish anything.

## Layout & conventions

- `src/app/<route>/page.tsx` — thin pages that set `metadata` (add one when creating a page); real content lives in `src/components/*`.
- `@/*` path alias → `src/*`.
- Components are mixed `.jsx`/`.tsx`. Every component is a client component (`'use client'`) except `AlliesMarquee.tsx` (server component). New heavy below-the-fold sections can use `next/dynamic` (see MIGRACION.md on home-page JS weight).
- Tailwind v4 is loaded via the `turbopack.rules` entry in `next.config.ts` — do **not** add a PostCSS or Tailwind config file. Global styles and utility overrides live in `src/app/globals.css`; legacy Astro `<style>` blocks were appended at its end.
- Dark by default; light mode is a `.light` class on `<html>` that overrides Tailwind utility classes by name (see top of `globals.css`, toggled in `Header.jsx`).
- UI copy and code comments are in Spanish; `lang="es"` in the root layout.

# Directivas y Skills del Proyecto — Innocaps Lab

> **INSTRUCCIÓN PRIORITARIA PARA EL AGENTE DE IA:**
> Antes de realizar cualquier lectura, análisis o modificación en este repositorio, **DEBES leer, cargar y aplicar estrictamente** las skills y reglas definidas en la carpeta `.opencode/skills/` y las especificaciones activas en `openspec/`.
> 
> Si alguna sugerencia o instrucción entra en conflicto con las directivas de las skills activas, las reglas de este archivo y las skills tienen la máxima prioridad.

---

## Skills Activas y Reglas Obligatorias

Asegúrate de consultar las siguientes skills para cada tarea relevante:

1. **`innocaps-brand`** (`.opencode/skills/innocaps-brand/SKILL.md`)
   - **Identidad & UI:** Aplicar siempre el diseño *dark-first* (`bg-slate-900`, `slate-950`), acentos `teal-400` y `cyan-400`.
   - **Compatibilidad Light:** Al modificar o crear componentes, mantener la compatibilidad con la clase `.light` definida en `globals.css`.
   - **Glosario & Copy:** Usar `<GlossaryTooltip>` para términos técnicos y mantener el tono biotecnológico/científico en español.

2. **`next-dynamic`** (`.opencode/skills/next-dynamic/SKILL.md`)
   - **Arquitectura:** Proyecto basado en **Next.js App Router (SSR / Node.js Runtime)**.
   - **Prohibición de Exportación Estática:** **PROHIBIDO** incluir `output: "export"` en `next.config.ts`.
   - **Capacidades Habilitadas:** Permitir explícitamente API Routes (`/api`), Server Actions, Middleware y React Server Components (RSC).
   - **Preparación CMS:** Toda la estructura debe estar optimizada para la futura integración de **Payload CMS** y **PostgreSQL (Neon)**.

3. **`innocaps-deploy`** (`.opencode/skills/innocaps-deploy/SKILL.md`)
   - **Flujo de Despliegue:** Integración continua mediante GitHub Actions `.github/workflows/deploy.yml` orientada a servidor/runtime Node.js (se elimina el flujo FTP estático anterior).
   - **Verificación:** Ejecutar y reportar siempre `npm run build` local antes de dar por completado un cambio.

4. **Flujo de Trabajo OpenSpec (`openspec-*`)** (`.opencode/skills/openspec-*/SKILL.md`)
   - **Metodología:** Spec-Driven Development obligatorio.
   - **Comandos & Flujos:** Usar `openspec-explore` para investigación y arquitectura (sin modificar código), `openspec-apply-change` para ejecutar tareas de cambios activos, y `openspec-archive-change` para cerrar cambios y actualizar las especificaciones base.