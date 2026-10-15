'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionLink = motion.create(Link);

const NAV_ITEMS = [
  { label: 'Tecnología', href: '/tecnologia' },
  { label: 'Soluciones', href: '/soluciones' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Proceso', href: '/proceso' },
];

/* ─────────────────────────────────────────────
   FULLSCREEN MOBILE MENU
   ───────────────────────────────────────────── */

function MobileMenu({ isOpen, onClose, isDark, toggleTheme }) {
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
          className="fixed inset-0 z-[60] bg-slate-950/98 backdrop-blur-xl flex flex-col"
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

          {/* Nav — giant typography */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
            {NAV_ITEMS.map((item, i) => (
              <MotionLink
                key={item.label}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.05 + i * 0.07, duration: 0.4 }}
                className="text-4xl font-bold text-white active:text-teal-400 transition-colors py-3 tracking-tight"
              >
                {item.label}
              </MotionLink>
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
              {isDark ? (
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

/* ─────────────────────────────────────────────
   HEADER COMPONENT
   ───────────────────────────────────────────── */

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newTheme);
  };

  return (
    <>
      {/* ══════════ MOBILE HEADER (visible < md) ══════════ */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
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
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={toggleTheme} />

      {/* ══════════ DESKTOP HEADER (visible >= md) ══════════ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-4' : 'py-6'
        }`}
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
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* --- BOTONES DE ACCIÓN --- */}
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-teal-500/50 transition-all group"
                aria-label="Cambiar tema"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400 group-hover:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <Link href="/contacto" className="px-5 py-2 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-slate-900 border border-teal-500/50 hover:border-teal-500 rounded-full text-sm font-bold transition-all">
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}