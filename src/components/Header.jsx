'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { resolverVista } from '../lib/vistaBio';

/* ═══════════════════════════════════════════════════════════════════
   NAV PRINCIPAL ESTABLE + SEGUNDO NIVEL (Dropdowns)
   ═══════════════════════════════════════════════════════════════════ */

const MAIN_NAV = [
  {
    label: 'Lab',
    href: '/lab',
    prefix: '/lab',
    children: [
      { label: 'Tecnología', href: '/lab/tecnologia' },
      { label: 'Soluciones', href: '/lab/soluciones' },
      { label: 'Proceso', href: '/lab/proceso' },
    ],
  },
  {
    label: 'Bio & WiBio',
    href: '/bio',
    prefix: '/bio',
    children: [
      { label: 'Tecnología y Escalamiento', href: '/bio?seccion=tecnologia' },
      { label: 'Soluciones B2B', href: '/bio?seccion=soluciones' },
      { label: 'Proceso y Aplicaciones', href: '/bio?seccion=proceso' },
    ],
  },
  {
    label: 'Pipeline',
    href: '/lab#pipeline',
    prefix: '/lab',
    isAnchor: true,
    isPipeline: true,
  },
  {
    label: 'Nosotros',
    href: '/nosotros',
    prefix: '/nosotros',
  },
  {
    label: 'Propuesta de Valor',
    href: '/propuesta-de-valor',
    prefix: '/propuesta-de-valor',
  },
  {
    label: 'Contacto',
    href: '/contacto',
    prefix: '/contacto',
    isCta: true,
  },
];

function isActive(pathname, hash, item) {
  if (item.isPipeline) {
    return pathname === '/lab' && hash === '#pipeline';
  }
  return pathname === item.href || pathname.startsWith(item.prefix);
}

/* ═══════════════════════════════════════════════════════════════════
   DROPDOWN COMPONENT (escritorio)
   ═══════════════════════════════════════════════════════════════════ */

function handleEsc(e, onClose) {
  if (e.key === 'Escape') onClose();
}

function Dropdown({ item, isOpen, onToggle, onClose, activeChild }) {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => handleEsc(e, onClose));
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', (e) => handleEsc(e, onClose));
    };
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        onMouseEnter={() => onToggle(true)}
        onFocus={() => onToggle(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${item.label} ${isOpen ? 'abierto' : 'cerrado'}`}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isOpen || activeChild
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900'
            : 'text-slate-300 hover:text-teal-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
        }`}
      >
        {item.label}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[60] min-w-[200px]"
          >
            <div className="bg-[#04121a]/90 backdrop-blur-md border border-[#00f5d4]/20 rounded-2xl shadow-[0_24px_60px_-18px_rgba(0,245,212,0.28)] overflow-hidden p-1.5">
              {item.children?.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  onClick={onClose}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeChild === child.href
                      ? 'bg-[#00f5d4]/12 text-[#00f5d4]'
                      : 'text-slate-300 hover:bg-[#00f5d4]/10 hover:text-[#00f5d4]'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MENÚ MÓVIL CON ACORDEÓN DE SEGUNDO NIVEL
   ═══════════════════════════════════════════════════════════════════ */

function MobileMenu({ isOpen, onClose, isDark, toggleTheme, mounted }) {
  const [expandedMain, setExpandedMain] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] bg-slate-950/98 backdrop-blur-xl flex flex-col"
        >
          {/* Close */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-slate-700/60 text-white active:bg-slate-800"
              aria-label="Cerrar menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav con acordeón */}
          <nav className="flex-1 flex flex-col items-start justify-center gap-1 px-6 py-4 overflow-y-auto">
            {MAIN_NAV.map((item) => (
              <div key={item.label} className="w-full">
                <button
                  type="button"
                  onClick={() => setExpandedMain(expandedMain === item.label ? null : item.label)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left text-2xl font-bold transition-colors ${
                    item.isCta ? 'text-teal-400' : 'text-white'
                  }`}
                  aria-expanded={expandedMain === item.label}
                >
                  {item.label}
                  {item.children && (
                    <svg className={`w-6 h-6 transition-transform ${expandedMain === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                <AnimatePresence>
                  {expandedMain === item.label && item.children && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-8 pb-2 w-full"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={onClose}
                          className="block px-4 py-3 text-lg font-medium text-slate-300 hover:text-teal-400 transition-colors rounded-xl hover:bg-slate-800/50"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Separador excepto el último */}
                {MAIN_NAV.indexOf(item) < MAIN_NAV.length - 1 && (
                  <div className="w-full h-px bg-slate-800/50 my-2" aria-hidden="true" />
                )}
              </div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="px-6 pb-10 space-y-4">
            <Link
              href="/contacto"
              onClick={onClose}
              className="block w-full text-center py-4 bg-teal-500 active:bg-teal-400 text-slate-900 font-bold rounded-2xl text-base transition-colors"
            >
              Contactar
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-700/60 text-slate-300 active:bg-slate-800 text-sm"
            >
              {!mounted ? (
                <span className="h-5 w-5 opacity-0" aria-hidden="true" />
              ) : isDark ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Modo claro
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  Modo oscuro
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HEADER COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

function getInitialTheme() {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('theme');
  return saved ? saved === 'dark' : true;
}

function getInitialHash() {
  if (typeof window === 'undefined') return '';
  return window.location.hash;
}

/* La vista activa de /bio viaja en el query (?seccion=). Se lee del
   historial con useSyncExternalStore (sin setState en efectos) */
function subscribeToLocation(onStoreChange) {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
}

function getLocationSearch() {
  return window.location.search;
}

function getServerSearch() {
  return '';
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hash, setHash] = useState(getInitialHash);
  const search = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerSearch);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('light', !newTheme);
      return newTheme;
    });
  }, []);

  const handleDropdownToggle = useCallback((label, forceOpen) => {
    setOpenDropdown(prev => (forceOpen === false || prev === label ? null : label));
  }, []);

  const closeDropdowns = useCallback(() => setOpenDropdown(null), []);

  return (
    <>
      {/* ══════════ MOBILE HEADER (visible < md) ══════════ */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="px-4">
          <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-slate-900/85 backdrop-blur-lg border border-slate-700/40 shadow-lg' : 'bg-transparent'}`}>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-slate-800 text-white" aria-label="Abrir menú">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Centered Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.svg" alt="InnocapsLab" className="w-9 h-9" />
            </Link>
            {/* CTA */}
            <Link href="/contacto" className="px-4 py-2 bg-teal-500/15 active:bg-teal-500 text-teal-400 active:text-slate-900 border border-teal-500/40 rounded-xl text-xs font-bold transition-colors">
              Contactar
            </Link>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu overlay */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={toggleTheme} mounted={mounted} />

      {/* ══════════ DESKTOP HEADER (visible >= md) ══════════ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}
      >
        <div className="container mx-auto px-6">
          <div 
            className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
              scrolled 
                ? 'bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-lg' 
                : 'bg-transparent border border-transparent'
            }`}
          >
            {/* --- LOGO --- */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="InnocapsLab Logo" className="w-10 h-10" />
            </Link>

            {/* --- MENÚ DE ESCRITORIO --- */}
            <nav className="flex items-center gap-2">
              {MAIN_NAV.map((item) => {
                const active = isActive(pathname, hash, item);
                const activeChild = item.children ? item.children.find((c) => {
                  if (c.href.includes('?')) {
                    if (pathname !== item.prefix) return false;
                    /* La vista activa se resuelve con el mismo criterio
                       que /bio (alias incluidos) */
                    const current = resolverVista(new URLSearchParams(search).get('seccion'));
                    const target = resolverVista(new URLSearchParams(c.href.split('?')[1]).get('seccion'));
                    return current === target;
                  }
                  return pathname === c.href || pathname.startsWith(c.href);
                }) : null;
                
                if (item.children) {
                  return (
                    <Dropdown
                      key={item.label}
                      item={item}
                      isOpen={openDropdown === item.label}
                      onToggle={(open) => handleDropdownToggle(item.label, open)}
                      onClose={closeDropdowns}
                      activeChild={activeChild?.href}
                    />
                  );
                }

                if (item.isPipeline) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        if (pathname === '/lab') {
                          e.preventDefault();
                          const el = document.getElementById('pipeline');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            history.pushState(null, '', '#pipeline');
                          }
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        mounted && active
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900'
                          : 'text-slate-300 hover:text-teal-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                if (item.isCta) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        mounted && active
                          ? 'bg-teal-500 text-slate-900'
                          : 'bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-900 border border-teal-500/50 hover:border-teal-500'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      mounted && active
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900'
                        : 'text-slate-300 hover:text-teal-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* --- BOTONES DE ACCIÓN (tema) --- */}
            <div className="flex items-center gap-3 ml-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-teal-500/50 transition-all group"
                aria-label="Cambiar tema"
              >
                {!mounted ? (
                  <span className="h-5 w-5 opacity-0" aria-hidden="true" />
                ) : isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 group-hover:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}