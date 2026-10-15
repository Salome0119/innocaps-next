---
name: next-dynamic
description: Guía de desarrollo dinámico de innocaps-next (SSR/Node.js Runtime) — permite API routes, server actions, middleware, RSC con datos dinámicos e imágenes optimizadas. Úsalo cuando se toque enrutado, data fetching, imágenes, next.config.ts o al integrar Payload CMS/PostgreSQL, o cuando aparezcan "API route", "SSR", "server action", "middleware", "revalidate" o "build falla".
---

# Desarrollo dinámico — innocaps-next

Este es un Next.js con servidor (App Router, Node.js Runtime). La exportación estática (`output: "export"`) fue eliminada: `npm run build` genera la compilación en `.next/` y `npm run start` la sirve en modo SSR. El objetivo es integrar Payload CMS + PostgreSQL en pasos posteriores.

## Qué está permitido

- **API routes**: `src/app/api/**/route.ts` (o `route.js`).
- **Server Actions**: `"use server"`, `useActionState`, mutaciones con revalidación.
- **Middleware**: `middleware.ts` a nivel de proyecto.
- **ISR / dinámico**: `revalidate`, `dynamic = "force-dynamic"`, `fetch` con `cache: "no-store"`, `searchParams`/`params` asincrónicos.
- **Cookies/headers en render**: `cookies()`, `headers()` en server components.
- **React Server Components**: `await` de datos en el servidor (fetch, ORM, Payload).
- **Optimizador de imágenes**: activo; usar `next/image` con `remotePatterns` para dominios del CMS cuando aplique.

## Convenciones

- TypeScript estricto: no introducir `any` innecesario; los tipos de Payload/DB se generan (no editar a mano los generados).
- `trailingSlash` ya no está forzado: los links internos usan rutas sin barra final (`/contacto`), como ya hace el código actual con `next/link`.
- Los datos estáticos de secciones siguen viviendo en `src/data/*.js` hasta que el CMS los sustituya; migrar contenido al CMS por secciones, no de golpe.
- Componentes de UI siguen siendo mayoritariamente cliente (`'use client'`); mantener la lógica de servidor en `page.tsx`/route handlers y bajar a cliente solo interactividad.

## Verificación obligatoria

Antes de dar un cambio por terminado, ejecutar y reportar el resultado:

```bash
npm run build
```

- Éxito = compila a `.next/` sin generar `./out/` (si aparece `./out/`, queda `output: "export"` en `next.config.ts`).
- Validación complementaria del runtime: `npm run start` y comprobar que la ruta afectada responde.

Lint (`npm run lint`) tiene errores preexistentes documentados en `MIGRACION.md`; no bloquean, pero no añadir violations nuevas.

## Al integrar Payload CMS + PostgreSQL

- Configuración de conexión por variables de entorno (`.env`, no commitear secrets); revisar `.gitignore` (`.env*` ya ignorado).
- Payload requiere Node runtime y escritura en disco — incompatible con cualquier reintento de export estático; si alguien propone volver a `output: "export"`, avisar que rompe Payload.
- Las rutas de contenido que dependan de la base de datos deben declarar `dynamic` explícito o usar `searchParams`/cookies para forzar render por petición.

## Archivos clave

- `next.config.ts` — fuente de verdad del entorno (sin export estático).
- `MIGRACION.md` — equivalencias Astro→Next, pendientes y estrategia de despliegue dinámica.
- `AGENTS.md` — bloque de reglas de Next 16 (no quitarlo; `next dev` lo regenera).
