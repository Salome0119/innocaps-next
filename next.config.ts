import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Entorno dinámico (SSR + Node.js Runtime): sin output "export".
  // Preparado para Payload CMS + PostgreSQL (API routes, server actions, RSC).
  // Equivalente al `allowedHosts` de ngrok que tenías en astro.config.mjs
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.io"],
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
