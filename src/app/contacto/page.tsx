import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import ContactForm from "./ContactForm";

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
      className="relative w-full rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8"
    >
      <div className="mb-6 h-3 w-32 animate-pulse rounded-full bg-slate-800" />
      <div className="mb-6 grid grid-cols-3 gap-2">
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
      </div>
      <div className="mb-5 h-11 animate-pulse rounded-xl bg-slate-800" />
      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-800" />
      </div>
      <div className="mb-6 h-36 animate-pulse rounded-xl bg-slate-800" />
      <div className="h-12 w-56 animate-pulse rounded-full bg-slate-800" />
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
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        {/* ── Resplandores ambientales ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-[130px]" />
          <div className="absolute top-1/3 -right-40 h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[130px]" />
        </div>

        <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
          {/* ── Encabezado de sección ── */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-teal-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Contacto · B2B
            </span>

            <h1 className="mt-6 text-3xl font-light leading-tight tracking-wider text-white sm:text-4xl md:text-5xl">
              Conversemos sobre
              <span className="text-cyan-400"> tu proyecto</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Trabajamos con empresas de alimentación, nutracéutica, cosmética,
              agroindustria y farma en esquemas B2B: desde I+D+i y formulación
              hasta el suministro industrial de ingredientes nanoencapsulados.
            </p>
          </div>

          {/* ── Grid: contexto estático + formulario (Suspense) ── */}
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Columna izquierda — contenido del servidor */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="text-lg font-light tracking-wider text-white">
                  Cómo trabajamos
                </h2>

                <ol className="mt-6 space-y-5">
                  {PASOS_CONTACTO.map((paso) => (
                    <li key={paso.numero} className="flex gap-4">
                      <span className="font-mono text-sm tabular-nums text-teal-400">
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

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="text-lg font-light tracking-wider text-white">
                  Dos unidades, una compañía
                </h2>

                <dl className="mt-6 space-y-5">
                  {UNIDADES.map((unidad) => (
                    <div key={unidad.nombre}>
                      <dt className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
                        {unidad.nombre}
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-slate-400">
                        {unidad.alcance}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 border-t border-slate-800 pt-5 text-xs leading-relaxed text-slate-500">
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
        </section>
      </main>
    </>
  );
}
