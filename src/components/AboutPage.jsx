'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useIsMobile } from '../hooks/useIsMobile';
import PhilosophyTabs from './PhilosophyTabs';
import LabBioFusion from './LabBioFusion';
import TeamGlowCards from './TeamGlowCards';
import B2BFlowDiagram from './B2BFlowDiagram';

/* ══════════════════════════════════════════════════════════════════
   ALIADOS (se mantiene como sección fija fuera de las pestañas)
   ═══════════════════════════════════════════════════════════════════ */

const ALLIES_MEMBERS = [
  {
    id: 'nathalia',
    alias: 'La Arquitecta de Materiales',
    nombre: 'Nathalia Marín',
    rol: 'Ciencia e Ingeniería de Materiales',
    credentials: 'Doctora en Ciencia e Ingeniería de Materiales.',
    photo: '/team/nathalia.webp',
  },
  {
    id: 'carolina',
    alias: 'Química Pura',
    nombre: 'Carolina Chegwin',
    rol: 'Ciencias Químicas',
    credentials: 'Doctora en Ciencias Químicas.',
    photo: '/team/carolina.webp',
  },
  {
    id: 'carlos',
    alias: 'El Matemático',
    nombre: 'Carlos Salazar',
    rol: 'Modelado Computacional e Ingeniero Electrónico',
    credentials: 'Especialista en modelado computacional e ingeniería electrónica aplicada a procesos de encapsulación.',
    photo: '/team/carlos.webp',
  },
];

function AllyMember({ member, isMobile, index }) {
  const [expanded, setExpanded] = useState(false);

  if (isMobile) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-4 py-4 border-b border-slate-800/60 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
          aria-expanded={expanded}
        >
          <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-slate-800">
            <img
              src={member.photo}
              alt={member.nombre}
              width="56"
              height="56"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover grayscale contrast-125"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{member.nombre}</p>
            <p className="text-teal-400 text-xs">{member.alias}</p>
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: expanded ? '200px' : '0', opacity: expanded ? 1 : 0 }}
        >
          <div className="py-3 pl-[4.5rem] pr-4">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{member.rol}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{member.credentials}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-teal-500/30">
      <div className="aspect-[3/4] overflow-hidden bg-slate-800">
        <img
          src={member.photo}
          alt={member.nombre}
          width="300"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
      <div className="p-4">
        <p className="text-teal-400 text-xs font-mono tracking-wider uppercase mb-1">{member.alias}</p>
        <h3 className="text-base font-bold text-white mb-1">{member.nombre}</h3>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">{member.rol}</p>
        <p className="text-slate-400 text-xs leading-relaxed">{member.credentials}</p>
      </div>
    </div>
  );
}

function AlliesSection({ isMobile }) {
  return (
    <section className="relative py-20 md:py-32 bg-black" aria-labelledby="aliados-title">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-teal-400 text-sm font-mono tracking-widest uppercase mb-3">Colaboradores</p>
          <h2 id="aliados-title" className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Aliados Estratégicos y <span className="text-teal-400">Colaboradores</span>
          </h2>
        </div>

        {isMobile ? (
          <div className="space-y-0">
            {ALLIES_MEMBERS.map((m, i) => (
              <AllyMember key={m.id} member={m} isMobile={true} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {ALLIES_MEMBERS.map((m, i) => (
              <AllyMember key={m.id} member={m} isMobile={false} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CTA FOOTER
   ═══════════════════════════════════════════════════════════════════ */

function CTASection({ isMobile }) {
  return (
    <section className="relative py-24 md:py-40 bg-black" aria-label="Llamada a acción final">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
          ¿Listos para desarrollar el <span className="text-teal-400">siguiente nivel</span> de tu producto?
        </h2>
        <p className="text-base md:text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Hablemos de cómo nuestra plataforma Lab + Bio puede transformar tu proyecto en una solución validada y escalable.
        </p>
        <Link
          href="/contacto"
          className={`inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 ${
            isMobile
              ? 'w-full py-4 text-base bg-teal-500 active:bg-teal-400 text-slate-900'
              : 'px-10 py-4 text-base bg-teal-500 hover:bg-teal-400 hover:scale-105 text-slate-900'
          }`}
        >
          Contactar
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TABS SHELL — Sub-navegación por pestañas (estilo Lab)
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: 'filosofia', label: 'Filosofía', icon: '🧭' },
  { id: 'modelo', label: 'Modelo Lab+Bio', icon: '⚛' },
  { id: 'equipo', label: 'Equipo', icon: '👥' },
  { id: 'b2b', label: 'Modelo B2B', icon: '📊' },
];

function TabButton({ tab, isActive, onActivate, index, onKeyDown }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`about-panel-${tab.id}`}
      id={`about-tab-${tab.id}`}
      onClick={() => onActivate(tab.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate(tab.id);
        }
        onKeyDown?.(e, index);
      }}
      className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive
          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
          : 'text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
      }`}
    >
      <span className="text-lg">{tab.icon}</span>
      <span className="hidden sm:inline">{tab.label}</span>
      {isActive && (
        <motion.span
          layoutId="about-tab-indicator"
          className="absolute inset-0 rounded-full border border-cyan-400/40 bg-cyan-400/10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

function TabsShell({ activeTab, onTabChange, onKeyDown }) {
  return (
    <div className="relative mb-12">
      <div className="flex justify-center overflow-x-auto px-4 -mx-4" role="tablist" aria-label="Secciones de Nosotros">
        <div className="inline-flex flex-nowrap gap-2 rounded-full border border-cyan-400/20 bg-slate-900/70 p-1.5 backdrop-blur-xl">
          {TABS.map((tab, index) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onActivate={onTabChange}
              index={index}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN ABOUT PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('filosofia');

  // Navegación por teclado entre pestañas (ArrowLeft/Right/Home/End)
  const handleTabKeyDown = useCallback((e) => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    let newIndex = currentIndex;
    if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') newIndex = 0;
    else if (e.key === 'End') newIndex = TABS.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(TABS[newIndex].id);
  }, [activeTab]);

  return (
    <div id="nosotros" className="about-canvas min-h-screen">
      {/* Fondo bioluminiscente unificado (via CSS ::before/::after en .about-canvas) */}
      
      {/* Textura Agrupar.svg */}
      <img
        src="/Agrupar.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 pointer-events-none"
      />

      {/* Halo ambiental central */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Tarjeta 1 · Hero de Nosotros ──
          Módulo independiente: esquinas muy redondeadas, borde definido
          y fondo oscuro translúcido (.about-card). El padding-top deja
          libre la navbar fija para que no tape el título. */}
      <section className="about-card about-card--hero relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-6 md:px-10 pt-28 pb-16" aria-label="InnoCaps: Ciencia que protege y transforma">
        {/* El texto flota sobre el campo de partículas dentro de la
            tarjeta; el contraste lo aporta .about-hero-copy */}
        <div className="about-hero-copy relative z-10 max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6"
          >
            <p className="text-teal-400 text-xs md:text-sm font-mono tracking-widest uppercase">
              Sobre Nosotros
            </p>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white mb-6"
          >
            Ciencia que <span className="text-teal-400">protege</span> y <span className="text-teal-400">transforma</span>
          </motion.h1>

          {/* Mission */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            En InnoCaps diseñamos soluciones de micro y nanoencapsulación con enfoque científico, sostenible y escalable. Convertimos conocimiento en plataformas tecnológicas que protegen biomoléculas, optimizan su desempeño y facilitan su llegada al mercado.
          </motion.p>

          {/* Key point */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="border-t border-slate-800/60 pt-8"
          >
            <p className="text-sm md:text-base text-slate-500 font-light italic">
              No solo desarrollamos formulaciones. Desarrollamos soluciones con fundamento científico y visión de producto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Tarjeta 2 · Ciencia aplicada con propósito ──
          Módulo independiente separado por un hueco libre (solo margen:
          sin divisores, bordes ni sombras descendentes). El campo de
          partículas fluye continuo por el hueco y alrededor de ambas
          tarjetas. */}
      <section className="about-card about-card--tabs relative z-10 py-14 md:py-20 px-6 md:px-10" aria-label="Ciencia aplicada con propósito">
        <h3 className="text-center text-2xl md:text-3xl font-light tracking-wide mb-8 md:mb-10">
          Ciencia aplicada con <span className="txt-grad font-semibold">propósito</span>
        </h3>

        <TabsShell activeTab={activeTab} onTabChange={setActiveTab} onKeyDown={handleTabKeyDown} />

        {/* Sub-tarjeta interna más oscura (.about-panel) con el
            contenido de la pestaña activa */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="about-panel max-w-6xl mx-auto"
          >
            {activeTab === 'filosofia' && <PhilosophyTabs />}
            {activeTab === 'modelo' && <LabBioFusion />}
            {activeTab === 'equipo' && <TeamGlowCards />}
            {activeTab === 'b2b' && <B2BFlowDiagram />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Aliados (fijo, fuera de tabs) ── */}
      <AlliesSection isMobile={isMobile} />

      {/* ── CTA Footer ── */}
      <CTASection isMobile={isMobile} />
    </div>
  );
}