import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Entorno dinámico (SSR + Node.js Runtime): sin output "export".
  // Preparado para Payload CMS + PostgreSQL (API routes, server actions, RSC).
  // Equivalente al `allowedHosts` de ngrok que tenías en astro.config.mjs
  output: "standalone", // <-- Añadido para empaquetado eficiente en Docker
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.io"],
  transpilePackages: ["@payloadcms/richtext-lexical", "payload"],
  serverExternalPackages: ["@payloadcms/db-postgres", "esbuild", "@esbuild/win32-x64"],
  // Redirecciones permanentes: URLs legacy → destino vigente
  async redirects() {
    return [
      { source: "/tecnologia", destination: "/lab/tecnologia", permanent: true },
      { source: "/soluciones", destination: "/lab/soluciones", permanent: true },
      { source: "/proceso", destination: "/lab/proceso", permanent: true },
      // "Nosotros" tiene ruta propia; el viejo /lab/nosotros apunta a ella
      { source: "/lab/nosotros", destination: "/nosotros", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;