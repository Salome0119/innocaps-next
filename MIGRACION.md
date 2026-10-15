# Migración Astro → Next.js (innocaps)

## Cómo probar
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compila a .next/ (desde la transición dinámica; antes generaba ./out)
npm run start    # sirve la app en modo SSR con Node
```

## Equivalencias aplicadas
| Astro | Next |
|---|---|
| `src/layouts/Layout.astro` | `src/app/layout.tsx` + `metadata` por página |
| `src/pages/*.astro` | `src/app/<ruta>/page.tsx` |
| `404.astro` | `src/app/not-found.tsx` → 404 dinámico del servidor |
| `AlliesMarquee.astro`, `BiotechPipeline.astro` | `.tsx` (server components) |
| `<style>` de esos `.astro` | al final de `src/app/globals.css` |
| `client:load/idle/visible` | todos los `.jsx` llevan `'use client'` |
| `<a href="/x">` internos | `next/link` |
| `astro.config.mjs` | `next.config.ts` (dinámico: sin `output: "export"`, sin `trailingSlash`, imágenes optimizadas) |
| deploy `./dist/` | deploy dinámico pendiente (ver abajo; el workflow FTP quedó desactivado) |

## Transición a entorno dinámico (SSR / Node.js Runtime)

El sitio dejó de ser un export estático. Estado de los cambios:

- **`next.config.ts`**: eliminados `output: "export"`, `trailingSlash: true` e `images: { unoptimized: true }`. El build genera `.next/` y `npm run start` sirve en SSR; API routes, server actions, middleware, ISR y RSC dinámicos están habilitados.
- **Imágenes**: el optimizador nativo de Next está activo; el código aún usa `<img>` plano (migrar a `next/image` opcional, por componente).
- **Skills**: la skill `static-export` fue eliminada y sustituida por `next-dynamic` (`.opencode/skills/`).
- **Despliegue**: el workflow FTP (`.github/workflows/deploy.yml`) quedó **desactivado** — subir `./out/` por FTP ya no aplica. Pendiente implementar estrategia dinámica (VPS / Docker / Railway / Vercel) que ejecute `npm ci && npm run build && npm run start`, y documentarla aquí y en la skill `innocaps-deploy`.
- **Roadmap**: preparar integración de Payload CMS + PostgreSQL (variables de entorno para la conexión; no commitear secrets).

## Pendientes / notas
- `Footer.astro` estaba vacío (0 bytes), se omitió.
- `TechGrid.astro` no se usaba en ninguna página, no se migró.
- `client:visible`/`client:idle` no tienen equivalente: ahora todo hidrata al cargar. Si el peso del JS en la home importa, usar `next/dynamic` en ProcessSection / SectorsAccordion / ProfessionalsSection.
- `manualChunks` de Vite se quitó; Next maneja los chunks.
- `AboutPage.jsx` referencia `/team/*.webp` pero esa carpeta no existía en `public/` del proyecto Astro.
- `npx eslint src` (reglas de React 19) reporta avisos que ya existían en el código original (`Math.random()` en render, setState en effects).
