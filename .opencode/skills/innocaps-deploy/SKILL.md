---
name: innocaps-deploy
description: Flujo de despliegue dinámico de innocaps-next mediante GitHub Actions (.github/workflows/deploy.yml → npm ci → npm run build → Despliegue en Node.js Runtime/VPS/Railway). Úsalo antes de hacer push a main, al revisar el workflow de CI/CD, o cuando se mencione "deploy", "subir a producción" o fallos del pipeline de integración.
---

# Despliegue Dinámico (SSR / Node.js) — innocaps-next

## Cómo se despliega

Un push a la rama `main` dispara `.github/workflows/deploy.yml`:

1. `actions/checkout@v4`
2. Node.js **20** (`actions/setup-node@v4`)
3. `npm ci` — instala dependencias exactas de `package-lock.json`
4. `npm run build` — genera la compilación dinámica nativa en `.next/`
5. **Paso de Despliegue:** Sincronización con el servidor Node.js (vía Docker, SSH rsync, Vercel o Webhook de Railway/Coolify) y reinicio del proceso (`npm run start` / `pm2 restart`).

Secrets requeridos (GitHub → Settings → Secrets → Actions):
- Credenciales del servidor o API Token del proveedor de hosting.
- `DATABASE_URI` (PostgreSQL / Neon) y variables de entorno de producción.

## Checklist pre-push

Ejecutar/verificar antes de hacer push a `main`:

1. **Build local limpio**: `npm run build` termina sin errores de TypeScript ni errores en Server Components / Server Actions.
2. **Variables de entorno**: Verificar que las nuevas variables de conexión (ej. `DATABASE_URI`) estén configuradas tanto en local (`.env.local`) como en el servidor de producción.
3. **Assets referenciados existen**: Archivos en `public/` accesibles y correctamente vinculados.
4. **Diff revisado**: No commitear `.next/`, `node_modules/`, `.env` ni archivos de compilación temporal.
5. **Sin ramas largas**: Solo `main` dispara el despliegue automático a producción.

## Diagnóstico de fallos

| Paso fallido | Causa típica | Acción |
|---|---|---|
| Install / `npm ci` | `package-lock.json` desincronizado de `package.json` | Regenerar lock con `npm install` local y commitearlo |
| Build Project | Error de TypeScript, imports incorrectos o fallos en Server Components | Reproducir con `npm run build` local |
| Conexión a Base de Datos | `DATABASE_URI` incorrecta o IP no autorizada | Verificar secrets y reglas de firewall en Neon / PostgreSQL |
| Error 500 en Producción | Excepción no capturada en Server Actions o API Routes | Revisar los logs del servidor Node.js en producción |

## Verificación post-deploy

- Abrir la URL del sitio y validar la carga de páginas dinámicas (SSR).
- Verificar que las llamadas a APIs, Server Actions o el panel de control responda sin fallos de conexión.