# Tasks

## 1. Reubicación de rutas bajo /lab

- [x] 1.1 `git mv` de `src/app/{tecnologia,soluciones,proceso,nosotros}/page.tsx` a `src/app/lab/...` (y mover `NucleoEscena.tsx` no trackeado); `nosotros` se retira después (ver 1.5) y se restaura en `/nosotros` (ver 1.6)
- [x] 1.2 Reescribir `src/app/lab/page.tsx` para renderizar Header + ProcessSection + BiotechPipeline + SectorsAccordion con metadata propia (sin ProfessionalsSection ni AlliesMarquee); verificar imports
- [x] 1.3 Reescribir `src/app/bio/page.tsx` como página mínima (título "InnoCaps Bio & WiBio" + aviso próximamente, estilo de marca) sin importar componentes del contenido original; verificar metadata
- [x] 1.4 Reescribir `src/app/page.tsx` con el orden Header + HeroSection + SelectorUnidades ("¿Por dónde empezamos?", inmediatamente después del hero) + AlliesMarquee (sin brechas/flujo/ProcessSection/AboutPage/contacto); verificar que los CTAs enlazan a /lab, /bio y /contacto
- [x] 1.5 Retirar `src/app/lab/nosotros/page.tsx` (`NucleoEscena.tsx` se conserva sin uso) y cambiar la raíz de `AboutPage.jsx` de `main` a `div` para evitar `main` anidado
- [x] 1.6 Restaurar `src/app/nosotros/page.tsx` (Header + AboutPage + metadata propia) para que "Nosotros" sea ruta independiente; AboutPage fuera del flujo de la home

## 2. Navegación y enlaces

- [x] 2.1 Header contextual con `usePathname` en `src/components/Header.jsx` (nav simple en / y fuera de /lab/*; nav Lab {Tecnología, Soluciones, Proceso} con prefijo /lab dentro de /lab/*, sin Nosotros; logo → /) y verificar ambos patrones
- [x] 2.2 Actualizar enlaces internos rotos: `ServiceModel.jsx` `/soluciones` → `/lab/soluciones`; `HeroSection.jsx` CTA `#tecnologia` → `/lab`; verificar grep sin referencias antiguas fuera de redirecciones
- [x] 2.3 Actualizar la línea "Navegación principal" de `.opencode/skills/innocaps-brand/SKILL.md` a la estructura nueva
- [x] 2.4 Añadir "Nosotros" al nav de la home en `Header.jsx` apuntando a la ruta `/nosotros` (solo `pathname === '/'`); verificar en runtime que el menú de `/lab` y `/bio` no lo muestra

## 3. Redirecciones legacy

- [x] 3.1 `redirects()` en `next.config.ts`: `/tecnologia`, `/soluciones` y `/proceso` hacia `/lab/*`, y `/lab/nosotros` hacia `/nosotros`, con status permanente; `/nosotros` sin redirect (ruta propia); verificar con curl -I 308 y 200

## 4. Verificación integrada

- [x] 4.1 `npm run build` sin errores y sin generar `./out/`
- [x] 4.2 `npm run start` + curl: textos únicos de cada ruta presentes en su ruta y ausentes en las demás (/, /nosotros, /bio, /lab, /lab/tecnologia, /lab/soluciones, /lab/proceso)
- [x] 4.3 `npm run start` + curl: home con orden hero < selector < Aliados y sin texto de AboutPage; `/nosotros` responde 200 con AboutPage; 308 en `/lab/nosotros` (→ `/nosotros`) y `/tecnologia` (→ `/lab/tecnologia`)
