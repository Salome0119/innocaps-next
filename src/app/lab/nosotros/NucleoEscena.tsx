"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════
   NUCLEO ESCENA — Contenedor cliente del Canvas de react-three-fiber.
   Recibe la malla de OrganicNucleus (componente cliente) como children
   para que el visor pueda renderizarse desde un Server Component.
   ═══════════════════════════════════════════════════════════════════ */

export default function NucleoEscena({ children }: { children: ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.7} color="#2dd4bf" />
      {children}
    </Canvas>
  );
}
