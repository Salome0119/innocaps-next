import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Suspense } from "react";
import PropuestaValorCalculator from "./PropuestaValorCalculator";

export const metadata: Metadata = {
  title: "Propuesta de Valor — Innocaps Lab",
  description:
    "Calculadora interactiva de ROI: descubre cuánto le cuesta realmente innovar con InnoCaps Lab (I+D+i) e InnoCaps Bio (formulación WiBio). Ahorro estimado, reducción de costos y escalamiento eficiente.",
};

function CalculatorSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando calculadora de propuesta de valor"
      className="relative z-10 w-full rounded-2xl border border-white/10 bg-[#071722]/80 p-6 sm:p-8"
    >
      <div className="mb-6 h-3 w-48 animate-pulse rounded-full bg-white/5" />
      <div className="mb-6 grid grid-cols-2 gap-2">
        <div className="h-11 animate-pulse rounded-xl bg-white/5" />
        <div className="h-11 animate-pulse rounded-xl bg-white/5" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-6 h-12 w-64 animate-pulse rounded-full bg-white/5" />
      <span className="sr-only">Cargando calculadora…</span>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#030d14] relative">
        {/* Fondo estático con resplandores sutiles en esquinas */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(7,36,46,0.6)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(0,245,212,0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.03)_0%,transparent_50%)]" />

        <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          {/* ── Encabezado Hero ── */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-slate-400">
              Propuesta de Valor · ROI
            </span>

            <h1 className="mt-6 text-3xl font-light leading-tight tracking-wider text-white sm:text-4xl md:text-5xl lg:text-6xl">
              ¿Cuánto le cuesta realmente
              <span className="text-[#00f5d4]"> innovar</span>?
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-base leading-relaxed text-slate-400 sm:text-lg">
              Compara tu estructura de costos actual frente al modelo InnoCaps.
              Ajusta los parámetros y visualiza el ahorro estimado en tiempo real.
            </p>
          </div>

          {/* ── Calculadora ── */}
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<CalculatorSkeleton />}>
              <PropuestaValorCalculator />
            </Suspense>
          </div>

          {/* ── CTA Final ── */}
          <div className="mt-16 text-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#00f5d4] to-[#00d2b4] px-10 py-4 text-base font-bold text-[#030d14] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,212,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030d14]"
            >
              Solicitar análisis con datos reales
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p className="mt-4 text-sm text-slate-500">
              Nuestro equipo validará tus números y te entregará un reporte personalizado sin compromiso.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}