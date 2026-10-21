'use client';

import { useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { getDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';
import dynamic from 'next/dynamic';

/* ═══════════════════════════════════════════════════════════════
   BIO 3D BACKGROUND — Micela fija en el fondo (fixed inset-0 -z-10)
   Versión simplificada sin interacción, solo visual ambiental.
   Tier-aware + prefers-reduced-motion. Todo procedural, cero assets.
   ═══════════════════════════════════════════════════════════════ */

// Micela procedural simple - solo cliente
const MicelleModel = dynamic(() => import('./MicelleModel'), { ssr: false, loading: () => null });

function BioBackgroundCanvas({ className = '' }) {
  const containerRef = useRef(null);
  const tier = useMemo(() => getDeviceTier(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
      }
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas
        dpr={tier === 'low' ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 50 }}
        gl={{
          alpha: true,
          antialias: tier !== 'low',
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} color="#00f5d4" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#00d2b4" />
        
        <MicelleModel tier={tier} reduced={reduced} />
      </Canvas>
    </div>
  );
}

export default function BioBackground3D() {
  return (
    <div
      id="bio-3d-background"
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(0, 245, 212, 0.03) 0%, transparent 70%)',
      }}
    >
      <BioBackgroundCanvas />
    </div>
  );
}