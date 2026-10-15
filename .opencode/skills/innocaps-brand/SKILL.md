---
name: innocaps-brand
description: Guía de marca, diseño y copy de Innocaps Lab — paleta oscura slate con acentos teal/cyan, modo claro .light, tipografía ligera, tono biotech en español y glosario técnico (GlossaryTooltip). Úsalo al crear o editar UI, colores, secciones, textos o metadata del sitio.
---

# Marca y diseño — Innocaps Lab

**Identidad**: Innocaps Lab — nanoencapsulación y biotecnología. Título por defecto: "Innocaps Lab - Nanoencapsulación y Biotecnología" (`src/app/layout.tsx`). Todo el copy en **español** (`lang="es"`), comentarios de código en español.

Fuentes de verdad: `src/app/globals.css` (tokens + modo claro), `src/components/Header.jsx` (nav + toggle de tema), `src/data/sectionsData.js` (copy de secciones), `src/components/GlossaryTooltip.jsx` (glosario).

## Paleta

| Uso | Token | Notas |
|---|---|---|
| Fondo base | `bg-slate-900` (body), `bg-slate-950`, `bg-slate-800` | Dark-first: el sitio arranca oscuro |
| Texto principal | `text-white` | — |
| Texto secundario | `text-slate-300`, `text-slate-400` | `slate-500` para captions/notas |
| Bordes | `border-slate-800`, `border-slate-700` | — |
| **Acento primario** | `teal-400` = `#2dd4bf` | Datos destacados, links, glitch, chips de highlights |
| **Acento secundario** | `cyan-400` = `#22d3ee` | Capa de efecto glitch (`.synthesis-glitch::before`) |
| CTA / botones | `bg-teal-500/10..15`, `text-teal-400`, `border-teal-500/40..50`; hover: `bg-teal-500 text-slate-900` | Patrón presente en Header y CTA del sitio |
| Gradientes de sección | `from-slate-950 via-slate-950 to-slate-900` (y variantes) | |

Regla de highlights: **cifras y términos duros** (ej. `20-900 nm`) se pintan en `teal-400` — ver `ProcessTimeline.jsx` (`dataHighlights`).

### Modo claro

- Dark es el default; light es la clase `.light` en `<html>`, toggleada en `Header.jsx` (persiste en `localStorage('theme')`).
- `globals.css` remapea utilidades Tailwind bajo `.light` (`.light .bg-slate-900 → bg-slate-100`, etc.).
- **Al añadir un color Tailwind nuevo a una sección, añadir su equivalente `.light` en `globals.css`** o el modo claro queda roto en ese componente. También existen variantes `light:` inline en algunas secciones (`ProcessSection`, `ProfessionalsSection`) — imitar el patrón del componente vecino.

## Tipografía

- Títulos y hero: `font-light` + `tracking-wider` (aire tecnológico, no bold pesado).
- Datos/números tabulares: `font-mono tabular-nums` (ver `ModelViewer.jsx`).
- Escala hero: `text-base` (mobile) → `text-xl lg:text-2xl` (desktop) en subtítulos.
- Móvil: `line-height: 1.6` en `p/li` y targets táctiles ≥ 44px (reglas globales en `globals.css`).

## Patrones de UI

- Íconos de secciones de datos: **emoji** en `sectionsData.js` (🔬 🧬 ❄️ 💧 🫧 …), no iconos SVG, para textos de proceso/tecnología.
- Términos técnicos envueltos en `<GlossaryTooltip term="...">text</GlossaryTooltip>`.
- Efecto firma: glitch de texto en pantallas de síntesis/404 (`.synthesis-glitch`).
- Navegación principal: `/`, `/soluciones`, `/tecnologia`, `/proceso`, `/nosotros`, `/contacto` — CTA siempre a `/contacto`.

## Tono de voz

- Profesional-científico, divulgativo: explicar mecanismos (fermentación, spray-drying, liberación controlada) sin relleno de marketing vacío.
- Cuidado con claims: no prometer beneficios médicos; hablar de "biodisponibilidad", "estabilidad", "protección" en términos técnicos.
- Registro: tuteo en microcopy de producto ("tus ingredientes") y tratamiento formal en textos comerciales (copy de `sectionsData.js`); respetar el registro ya usado en la sección que se edite.

## Glosario (existentes en el sitio)

Términos ya presentados con `GlossaryTooltip` — reutilizarlos y no reinventar definiciones:

- **Micelio** — red de hifas; en BiotechDeepDive como vector de exopolisacáridos.
- **Exopolisacáridos (EPS)** — polímeros microbianos con actividad funcional.
- **Caldo fermentado** — medio de fermentación con metabolitos de interés.
- **Nanoemulsiones** — dispersión submicrónica; contraste con "emulsiones lechosas tradicionales".
- **Biodisponibilidad** — fracción del compuesto efectivamente absorbida/utilizada.
- **Maltodextrina** y **Goma arábiga** — vehículos/carriers de spray-drying.
- **Vitrificación** — pasaje a estado vítreo en el secado.

Del contenido general (`sectionsData.js`): nanoencapsulación, bioactivos, fermentación de precisión, liberación controlada, emulsiones múltiples (W/O/W), liposomas, microcápsulas sólidas, nano-estructuras, spray-drying, ultra-pureza.

Al añadir un término nuevo al sitio: añadir su tooltip con la definición en una frase, sustantivo-primer, sin jerga innecesaria.
