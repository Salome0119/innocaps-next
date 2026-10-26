import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import ContactForm from "./ContactForm";
import ContactTabs from "./ContactTabs";
import NanoBackground from "@/components/NanoBackground";

export const metadata: Metadata = {
  title: "Contacto B2B — Innocaps Lab",
  description:
    "Contacto corporativo de InnoCaps: consultas comerciales para InnoCaps Lab (I+D+i, formulación y transferencia tecnológica), InnoCaps Bio & WiBio (ingredientes funcionales y suministro B2B) y acuerdos de licensing.",
};

/* ─────────────────────────────────────────────
   Fallback accesible mientras se resuelve
   la ruta con ?type= (límite Suspense)
   ───────────────────────────────────────────── */
function ContactSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando formulario de contacto"
      className="section-glass relative z-10 w-full rounded-2xl border border-teal-500/30 bg-[#031417]/85 backdrop-blur-[16px] p-6 sm:p-8"
    >
      <div className="mb-6 h-3 w-32 animate-pulse rounded-full bg-slate-800/50" />
      <div className="mb-6 grid grid-cols-3 gap-2">
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
      </div>
      <div className="mb-5 h-11 animate-pulse rounded-xl bg-slate-800/50" />
      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800/50" />
      </div>
      <div className="mb-6 h-36 animate-pulse rounded-xl bg-slate-800/50" />
      <div className="h-12 w-56 animate-pulse rounded-full bg-slate-800/50" />
      <span className="sr-only">Cargando formulario de contacto…</span>
    </div>
  );
}

const PASOS_CONTACTO = [
  {
    numero: "01",
    titulo: "Envío de consulta",
    detalle: "Definís la vía (Lab, Bio o Licensing) y el alcance del proyecto.",
  },
  {
    numero: "02",
    titulo: "Evaluación técnica",
    detalle: "Nuestro equipo revisa viabilidad, materia prima y etapa TRL.",
  },
  {
    numero: "03",
    titulo: "Propuesta y alcance",
    detalle: "Acordamos objetivos, cronograma y condiciones comerciales.",
  },
  {
    numero: "04",
    titulo: "Piloto o suministro",
    detalle: "Se ejecuta el desarrollo a escala de laboratorio o producción.",
  },
];

const UNIDADES = [
  {
    nombre: "InnoCaps Lab",
    alcance: "Investigación, formulación, caracterización y transferencia tecnológica.",
  },
  {
    nombre: "InnoCaps Bio & WiBio",
    alcance: "Estandarización, escalamiento y suministro B2B de ingredientes funcionales.",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <NanoBackground variant="background" />
      <main className="relative min-h-screen overflow-hidden">
        {/* ── Encabezado Hero Contacto (glassmorphism centrado) ── */}
        <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 md:pt-36">
          <div className="section-glass relative z-10 mx-auto max-w-3xl text-center rounded-2xl border border-teal-500/20 bg-[#031417]/80 backdrop-blur-[12px] px-6 py-10 md:px-10 md:py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-teal-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Contacto · B2B
            </span>

            <h1 className="mt-6 text-3xl font-light leading-tight tracking-wider text-white sm:text-4xl md:text-5xl">
              Conversemos sobre
              <span className="text-cyan-400"> tu proyecto</span>
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-base leading-relaxed text-slate-300 sm:text-lg">
              Trabajamos con empresas de alimentación, nutracéutica, cosmética,
              agroindustria y farma en esquemas B2B: desde I+D+i y formulación
              hasta el suministro industrial de ingredientes nanoencapsulados.
            </p>
          </div>

          {/* ── Selector de dos vías: formulario B2B o redes sociales ── */}
          <div className="mt-12">
            <ContactTabs>
              {/* ── Grid: contexto estático + formulario (Suspense) ── */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 overflow-hidden">
                {/* Columna izquierda — tarjetas glassmorphic independientes */}
                <div className="space-y-6">
                  <div className="section-glass relative z-10 rounded-2xl border border-teal-500/20 bg-[#031417]/80 backdrop-blur-[12px] p-6 sm:p-8">
                    <h2 className="text-lg font-light tracking-wider text-white">
                      Cómo trabajamos
                    </h2>

                    <ol className="mt-6 space-y-5">
                      {PASOS_CONTACTO.map((paso) => (
                        <li key={paso.numero} className="flex gap-4">
                          <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-lime-500/15 border border-lime-500/30 text-teal-400 text-sm font-mono tabular-nums text-lg w-10 h-10">
                            {paso.numero}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {paso.titulo}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-400">
                              {paso.detalle}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="section-glass relative z-10 rounded-2xl border border-teal-500/20 bg-[#031417]/80 backdrop-blur-[12px] p-6 sm:p-8">
                    <h2 className="text-lg font-light tracking-wider text-white">
                      Dos unidades, una compañía
                    </h2>

                    <dl className="mt-6 space-y-5">
                      {UNIDADES.map((unidad) => (
                        <div key={unidad.nombre}>
                          <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            {unidad.nombre}
                          </dt>
                          <dd className="ml-6 mt-1.5 text-sm leading-relaxed text-slate-400">
                            {unidad.alcance}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-6 border-t border-teal-500/10 pt-5 text-xs leading-relaxed text-slate-500">
                      Usá el selector de vía del formulario para dirigir tu consulta
                      a la unidad correspondiente: la preselección también responde
                      a <span className="font-mono text-teal-400">?type=lab</span>,{" "}
                      <span className="font-mono text-teal-400">?type=bio</span> y{" "}
                      <span className="font-mono text-teal-400">?type=licensing</span>.
                    </p>
                  </div>
                </div>

                {/* Columna derecha — formulario aislado en Suspense */}
                <div className="lg:pt-2">
                  <Suspense fallback={<ContactSkeleton />}>
                    <ContactForm />
                  </Suspense>
                </div>
              </div>
            </ContactTabs>
          </div>
        </section>
      </main>
    </>
  );
}
