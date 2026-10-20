import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import SynthesisInProgress from "@/components/SynthesisInProgress";

export const metadata: Metadata = {
  title: "404 — Síntesis en Proceso | Innocaps Lab",
};

const ACCESOS = [
  { href: "/", etiqueta: "Hub principal" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/contacto", etiqueta: "Contacto B2B" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <SynthesisInProgress is404={true} variant={2} />

      {/* ── Barra corporativa de recuperación (complementa el CTA del 404) ── */}
      <section
        aria-label="Accesos de la plataforma"
        className="relative z-10 border-t border-slate-800 bg-slate-950 px-4 py-8 sm:px-6"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              Error 404 · Recurso no disponible
            </p>
            <p className="mt-2 text-sm text-slate-400">
              La plataforma sigue operativa: continuá desde uno de los accesos
              institucionales.
            </p>
          </div>

          <nav aria-label="Accesos institucionales" className="flex flex-wrap items-center justify-center gap-3">
            {ACCESOS.map((acceso) => (
              <Link
                key={acceso.href}
                href={acceso.href}
                className="rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-xs font-bold text-teal-400 transition-all hover:bg-teal-500 hover:text-slate-950"
              >
                {acceso.etiqueta}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
