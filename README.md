
# 🧬 InnoCaps - Plataforma Biotecnológica e Industrial

Bienvenido al repositorio de **InnoCaps**, una plataforma web de alto rendimiento orientada a la presentación e interacción con soluciones de nanoencapsulación, biotecnología aplicada y escalamiento industrial.

El proyecto combina un diseño vanguardista estilo **Glassmorphic Cyan/Neon** con visualizaciones 3D interactivas aisladas y un panel de gestión de contenidos relacional.

---

## 🛠️ Tech Stack & Arquitectura

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & React 19)
* **CMS Headless:** [Payload CMS v3](https://payloadcms.com/)
* **Base de Datos:** PostgreSQL en [Neon](https://neon.tech/) (`@payloadcms/db-postgres`)
* **Estilos:** Tailwind CSS v4 & Glassmorphism (`backdrop-blur-xl`)
* **Animaciones & 3D:** Framer Motion, Three.js y React Three Fiber / Drei

---

## ⚙️ Requisitos Previos

Antes de iniciar, asegúrate de contar con:

* **Node.js:** v18.x o superior
* **Gestor de paquetes:** `npm` o `pnpm`
* Una cuenta activa en **Neon PostgreSQL** (o una instancia local de PostgreSQL)

---

## 🚀 Guía de Inicio Rápido

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/TU_USUARIO/innocaps-next.git
cd innocaps-next
npm install

```

### 2. Ejecutar Migraciones de Base de Datos

Para levantar automáticamente el esquema de tablas en tu instancia de Neon:

```bash
npx payload migrate

```

---

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev

```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma en funcionamiento.

---

## 🗄️ Gestión de Base de Datos y CMS

* **Panel Administrativo:** Accede a `http://localhost:3000/admin` para gestionar las colecciones (`Users`, `Companies`, `Contactos`).
* **Migraciones:** La carpeta `src/migrations/` almacena el historial de migraciones en código TypeScript (`20261021_142554`), garantizando la portabilidad del esquema sin depender de backups pesados de PostgreSQL.
* **Documentación Completa:** Revisa el archivo [`DATABASE.md`](https://www.google.com/search?q=./DATABASE.md) para más detalles sobre la persistencia y arquitectura de datos.

---

## 🎨 Componentes Visuales y 3D (Reglas de Desarrollo)

Para mantener el rendimiento y la calidad de la UI:

1. **Aislamiento de Módulos 3D:** Los visores interactivos (como *Gutacid Balance* o el biorreactor de *Escalamiento Industrial*) deben permanecer en componentes aislados sin interferir con la navegación global ni con la ruta `#pipeline`.
2. **Estética Glassmorphism:** Fondo base `#030d14`, desenfoques `backdrop-blur-xl` y acentos neón `#00f5d4`.

---

## 💡 Recomendaciones para Futuros Desarrolladores

1. **Gestión de Ramas (Git Workflow):**
* Mantén la rama `main` protegida y realiza todos los avances o correcciones en ramas dedicadas (ej. `feature/nueva-vista`, `fix/modelo-3d`).
* Sube los cambios con Pull Requests descriptivos.


2. **Generación de claves en nuevos entornos:**
* Si levantas el proyecto desde cero, puedes generar un `PAYLOAD_SECRET` seguro usando en la terminal:
```bash
openssl rand -hex 32

```




3. **Optimización de Assets 3D:**
* Al incorporar modelos GLTF/GLB, asegúrate de optimizar las mallas y texturas previamente para no penalizar el tiempo de carga de la página.



---

## 📜 Licencia y Uso

Proyecto desarrollado para la plataforma **InnoCaps**. Todos los derechos reservados.

---

