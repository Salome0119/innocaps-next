# Design Document — Reestructuración Flujo B2B (InnoCaps)

## Contexto y Decisiones Arquitectónicas

La reestructuración transforma `innocaps-next` en una plataforma corporativa B2B bajo el modelo **"Dos Unidades, Una Compañía"**:
1. **InnoCaps Lab:** I+D+i, formulación, TRL y transferencia tecnológica.
2. **InnoCaps Bio & WiBio:** Escalamiento industrial, estandarización y portafolio de ingredientes funcionales.

---

## 1. Arquitectura de Navegación y Rutas (App Router)

### 1.1. Estructura de Directorios objetivo

```text
src/app/
├── layout.tsx                # Base Layout ÚNICO (Header global, Footer, Providers)
├── page.tsx                  # Hub Principal (Hero 3D, 4 brechas, Flujo 4 etapas, Dualidad)
├── lab/
│   └── page.tsx              # /lab (InnoCaps Lab - I+D+i, NanoArsenal, TRL)
├── bio/
│   └── page.tsx              # /bio (InnoCaps Bio - Ingredientes, Matriz de Aplicación)
├── nosotros/
│   └── page.tsx              # /nosotros (Propósito, Manifiesto, Equipo)
├── contacto/
│   ├── page.tsx              # /contacto (Página principal envuelta en Suspense)
│   └── ContactForm.tsx       # Componente cliente dedicado para useSearchParams
└── not-found.tsx             # 404 personalizado corporativo