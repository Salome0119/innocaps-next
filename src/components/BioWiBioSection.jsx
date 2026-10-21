'use client';

import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import BioTecnologia from './BioTecnologia';
import BioEscalamiento from './BioEscalamiento';
import BioSoluciones from './BioSoluciones';
import BioColaboracion from './BioColaboracion';
import BioAplicaciones from './BioAplicaciones';
import BioCeroAditivos from './BioCeroAditivos';
import { resolverVista } from '../lib/vistaBio';

/* ═══════════════════════════════════════════════════════════════════
   MÓDULO — InnoCaps Bio & WiBio (Unidad 02 · Escalamiento e Industria)
   Tres vistas conmutadas por ?seccion= (sin barra de pestañas interna):
     1. tecnología   → Tecnología + Escalamiento (scroll continuo)
     2. soluciones   → Soluciones B2B (vista propia)
     3. proceso      → Cómo trabajamos + Aplicaciones (scroll continuo)
   La resolución de ?seccion= vive en ../lib/vistaBio (compartida con
   el servidor, que decide si el héroe de la página se renderiza).
   ════════════════════════════════════════════════════════════════════ */

/* Tarjeta héroe del módulo: solo encabeza la vista de Tecnología */
function TarjetaModulo() {
  return (
    <motion.div
      className="bio-glass mb-10 p-7 text-center md:p-10"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <span className="bio-tech-badge">Unidad 02 · Escalamiento e Industria</span>
      <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-wide text-white">
        InnoCaps <span className="txt-grad font-semibold">Bio &amp; WiBio</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
        Del lote de fermentación al ingrediente funcional estandarizado: escalamiento
        industrial, control de lote y suministro B2B con soporte técnico en planta.
      </p>
    </motion.div>
  );
}

/* ── VISTA 1 — Tecnología + Escalamiento (página continua) ── */
function VistaTecnologia() {
  return (
    <>
      <TarjetaModulo />
      <BioTecnologia />
      <div id="bio-escalamiento" className="scroll-mt-32 pt-16 md:pt-24">
        <BioEscalamiento />
      </div>
    </>
  );
}

/* ── VISTA 3 — Cómo trabajamos + Aplicaciones (página continua) ── */
function VistaProceso() {
  return (
    <>
      <BioColaboracion />
      <div id="bio-aplicaciones" className="scroll-mt-32 pt-16 md:pt-24">
        <BioAplicaciones />
      </div>
      {/* Enfoque "Cero Aditivos": exclusivo de esta vista */}
      <div id="bio-cero-aditivos" className="scroll-mt-32 pt-16 md:pt-24">
        <BioCeroAditivos />
      </div>
    </>
  );
}

const TAB_COMPONENTS = {
  tecnologia: VistaTecnologia,
  soluciones: BioSoluciones,
  proceso: VistaProceso,
};

export default function BioWiBioSection() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const searchParams = useSearchParams();
  const validTab = resolverVista(searchParams.get('seccion'));
  const ActiveComponent = TAB_COMPONENTS[validTab] || VistaTecnologia;

  /* Al cambiar de vista se desplaza suavemente al inicio del contenido,
     saltando la tarjeta héroe de la página */
  const primeraRender = useRef(true);
  useEffect(() => {
    if (primeraRender.current) {
      primeraRender.current = false;
      return undefined;
    }
    const timer = setTimeout(() => {
      const destino = document.getElementById('bio-vista');
      if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320);
    return () => clearTimeout(timer);
  }, [validTab]);

  if (!isMounted) {
    return (
      <section className="bio-wiweb relative w-full text-[#f0f0f0] py-16 md:py-24 px-6 overflow-hidden">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-6xl" style={{ zIndex: 10 }}>
          <div className="bio-glass p-8 md:p-12 text-center">
            <span className="bio-tech-badge">Unidad 02 · Escalamiento e Industria</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-light tracking-wide text-white">
              InnoCaps <span className="txt-grad font-semibold">Bio &amp; WiBio</span>
            </h2>
            <div className="mt-8 h-96 animate-pulse rounded-3xl border border-teal-500/20 bg-teal-500/5" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bio-wiweb relative w-full text-[#f0f0f0] py-16 md:py-24 px-6 overflow-hidden">
      {/* ── Fondo: blobs cian/violeta + textura (sin capas sólidas) ── */}
      <AnimatedBackground />

      {/* Textura de líneas radiales (mismo asset que hero/home) */}
      <img
        src="/Agrupar.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 pointer-events-none"
      />

      {/* Halo ambiental central sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div id="bio-vista" className="relative mx-auto max-w-6xl scroll-mt-28" style={{ zIndex: 10 }}>
        {/* ── Vistas: fade in/out de 300 ms sin recargar ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={validTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
