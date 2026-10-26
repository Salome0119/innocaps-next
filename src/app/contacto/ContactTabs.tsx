"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REDES_SOCIALES } from "@/data/redesSociales";

type Vista = "formulario" | "redes";

const ORDEN_VISTAS: Vista[] = ["formulario", "redes"];

/* ─────────────────────────────────────────────
   Iconografía de las dos pestañas
   ───────────────────────────────────────────── */
const IconoFormulario = (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4.5" width="18" height="15" rx="3" />
    <path d="M4 9h16" />
    <path d="M8 13h5" />
    <path d="M8 16h3" />
  </svg>
);

const IconoRedes = (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="6" cy="12" r="2.8" />
    <circle cx="17.8" cy="6.2" r="2.8" />
    <circle cx="17.8" cy="17.8" r="2.8" />
    <path d="M8.5 10.8 15.3 7.4" />
    <path d="M8.5 13.2 15.3 16.6" />
  </svg>
);

/* ─────────────────────────────────────────────
   Marcas de red social (glifos propios)
   ───────────────────────────────────────────── */
function IconoSocial({ id }: { id: string }) {
  if (id === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.06c.52-.95 1.82-1.95 3.75-1.95 4 0 4.74 2.5 4.74 5.74V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.55-2.3 3.1V21h-4V9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.25-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.19-.57-.34M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.74.99 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.005c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41" />
    </svg>
  );
}

const FlechaSaliente = (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

/* ─────────────────────────────────────────────
   Panel de redes sociales
   ───────────────────────────────────────────── */
function PanelRedes() {
  return (
    <div className="space-y-8">
      <div className="section-glass relative z-10 mx-auto max-w-3xl rounded-2xl border border-teal-500/20 bg-[#031417]/80 px-6 py-8 text-center backdrop-blur-xl sm:px-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          Canales directos
        </span>

        <h2 className="mt-6 text-2xl font-light tracking-wider text-white sm:text-3xl">
          Hablá con el equipo
          <span className="text-[color:var(--acento-neon)]"> donde estés</span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Seguinos el día a día del laboratorio o escribinos directo para
          consultas rápidas. Para proyectos de I+D+i, escalamiento o licensing,
          el formulario B2B es la vía más precisa: cada solicitud se revisa de
          forma individual.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REDES_SOCIALES.map((red) => (
          <a
            key={red.id}
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            className="section-glass group relative flex flex-col gap-4 rounded-2xl border border-teal-500/20 bg-[#031417]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--acento-neon-borde)] hover:shadow-[0_0_45px_-18px_var(--acento-neon-halo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--acento-neon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030d14]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-500/30 bg-[#051e22]/70 text-teal-400 transition-colors duration-300 group-hover:border-[color:var(--acento-neon-borde)] group-hover:text-[color:var(--acento-neon)]">
              <IconoSocial id={red.id} />
            </span>

            <span className="flex flex-col">
              <span className="text-lg font-light tracking-wider text-white">
                {red.nombre}
              </span>
              <span className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                {red.handle}
              </span>
            </span>

            <span className="text-sm leading-relaxed text-slate-400">
              {red.descripcion}
            </span>

            <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--acento-neon)]">
              {red.accion}
              {FlechaSaliente}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Selector de dos vías de contacto
   ───────────────────────────────────────────── */
export default function ContactTabs({ children }: { children: ReactNode }) {
  const [vista, setVista] = useState<Vista>("formulario");
  const botonesRef = useRef<Record<string, HTMLButtonElement | null>>({});

  function moverFoco(evento: KeyboardEvent<HTMLButtonElement>, id: Vista) {
    const indice = ORDEN_VISTAS.indexOf(id);
    let destino: Vista | null = null;

    if (evento.key === "ArrowRight" || evento.key === "ArrowDown") {
      destino = ORDEN_VISTAS[(indice + 1) % ORDEN_VISTAS.length];
    } else if (evento.key === "ArrowLeft" || evento.key === "ArrowUp") {
      destino = ORDEN_VISTAS[(indice - 1 + ORDEN_VISTAS.length) % ORDEN_VISTAS.length];
    } else if (evento.key === "Home") {
      destino = ORDEN_VISTAS[0];
    } else if (evento.key === "End") {
      destino = ORDEN_VISTAS[ORDEN_VISTAS.length - 1];
    }

    if (!destino) return;

    evento.preventDefault();
    setVista(destino);
    botonesRef.current[destino]?.focus();
  }

  const pestanas = [
    {
      id: "formulario" as Vista,
      titulo: "Formulario & Gestión",
      descripcion: "Cómo trabajamos y envío de consultas B2B",
      icono: IconoFormulario,
    },
    {
      id: "redes" as Vista,
      titulo: "Redes Sociales",
      descripcion: "Instagram, LinkedIn y WhatsApp directo",
      icono: IconoRedes,
    },
  ];

  return (
    <div className="contacto-tabs">
      {/* ── Botones principales (dos vías de contacto) ── */}
      <div
        role="tablist"
        aria-label="Vías de contacto"
        className="grid gap-4 sm:grid-cols-2"
      >
        {pestanas.map((pestana) => {
          const activa = vista === pestana.id;

          return (
            <button
              key={pestana.id}
              ref={(el) => {
                botonesRef.current[pestana.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${pestana.id}`}
              aria-selected={activa}
              aria-controls={`panel-${pestana.id}`}
              tabIndex={activa ? 0 : -1}
              onClick={() => setVista(pestana.id)}
              onKeyDown={(evento) => moverFoco(evento, pestana.id)}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--acento-neon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030d14] sm:p-6 ${
                activa
                  ? "border-[color:var(--acento-neon-borde)] bg-[color:var(--acento-neon-tenue)] shadow-[0_0_50px_-18px_var(--acento-neon-halo)]"
                  : "border-teal-500/20 bg-[#031417]/70 hover:border-[color:var(--acento-neon-borde)] hover:bg-[color:var(--acento-neon-tenue)]"
              }`}
            >
              {/* Marco neón que se desliza entre pestañas */}
              {activa && (
                <motion.span
                  layoutId="contacto-marco-neon"
                  className="pointer-events-none absolute inset-0 rounded-2xl border border-[color:var(--acento-neon-borde)] bg-[color:var(--acento-neon-tenue)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              )}

              <span
                className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                  activa
                    ? "border-[color:var(--acento-neon-borde)] bg-[color:var(--acento-neon-tenue)] text-[color:var(--acento-neon)]"
                    : "border-teal-500/30 bg-[#051e22]/60 text-slate-300 group-hover:text-[color:var(--acento-neon)]"
                }`}
              >
                {pestana.icono}
              </span>

              <span className="relative min-w-0 flex-1">
                <span
                  className={`block text-sm font-bold tracking-wide sm:text-base ${
                    activa ? "text-white" : "text-slate-200"
                  }`}
                >
                  {pestana.titulo}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                  {pestana.descripcion}
                </span>
              </span>

              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`relative hidden h-5 w-5 flex-shrink-0 transition-all duration-300 sm:block ${
                  activa
                    ? "text-[color:var(--acento-neon)]"
                    : "text-slate-500 group-hover:text-[color:var(--acento-neon)]"
                }`}
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* ── Panel activo (transición fluida entre ambas opciones) ── */}
      <div className="mt-10">
        <AnimatePresence mode="wait" initial={false}>
          {vista === "formulario" ? (
            <motion.div
              key="formulario"
              id="panel-formulario"
              role="tabpanel"
              aria-labelledby="tab-formulario"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="redes"
              id="panel-redes"
              role="tabpanel"
              aria-labelledby="tab-redes"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PanelRedes />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
