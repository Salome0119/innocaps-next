import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { processSteps } from "@/data/sectionsData";

const SprayDryingSection = dynamic(() => import("@/components/SprayDryingSection"), {
  loading: () => <SeccionCarga />,
});
const SolutionsPillars = dynamic(() => import("@/components/SolutionsPillars"), {
  loading: () => <SeccionCarga />,
});
const SectorsAccordion = dynamic(() => import("@/components/SectorsAccordion"), {
  loading: () => <SeccionCarga />,
});

export const metadata: Metadata = {
  title: "InnoCaps Bio y WiBio — Escalamiento y suministro industrial",
  description:
    "Unidad 02 de InnoCaps: estandarización, producción y suministro B2B de ingredientes funcionales nanoencapsulados para sectores industriales.",
};

interface ServicioBio {
  titulo: string;
  texto: string;
}

const SERVICIOS_BIO: ServicioBio[] = [
  {
    titulo: "Portafolio de ingredientes",
    texto:
      "Activos nanoencapsulados con especificación técnica definida: tamaño de partícula, vehículo de spray-drying, pureza y condiciones de almacenamiento.",
  },
  {
    titulo: "Estandarización por lote",
    texto:
      "Protocolos de proceso y control analítico para que el ingrediente se comporte de forma consistente en cada entrega.",
  },
  {
    titulo: "Producción escalada",
    texto:
      "Capacidad industrial construida sobre los procesos validados por InnoCaps Lab, con ventanas de operación definidas.",
  },
  {
    titulo: "Soporte de formulación",
    texto:
      "Acompañamiento técnico para integrar el ingrediente en tu matriz final: alimento, suplemento, cosmético o bioinsumo.",
  },
];

function SeccionCarga() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] items-center justify-center bg-slate-950"
    >
      <span className="sr-only">Cargando sección interactiva</span>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500/30 border-t-teal-500" />
    </div>
  );
}

export default function BioPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />

      <section className="relative overflow-hidden bg-slate-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-0 h-[460px] w-[460px] rounded-full bg-teal-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-20 pt-32 md:pt-40 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-400">
              Unidad 02 · InnoCaps Bio y WiBio
            </p>
            <h1 className="mt-4 text-4xl font-light tracking-wider text-white md:text-6xl">
              Escalamiento, estandarización y{" "}
              <span className="text-teal-400">suministro B2B</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              InnoCaps Bio toma los procesos validados en laboratorio y los convierte en
              ingredientes funcionales nanoencapsulados, estandarizados y listos para
              incorporarse a líneas de producción industriales.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto?type=bio"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-teal-400"
              >
                Solicitar suministro <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center justify-center rounded-xl border border-teal-500/50 bg-teal-500/10 px-6 py-3.5 text-sm font-bold text-teal-400 transition-colors hover:bg-teal-500 hover:text-slate-900"
              >
                Ver InnoCaps Lab
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-800 pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Enfoque
                </dt>
                <dd className="mt-1 text-sm text-white">Producción estandarizada</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Formato
                </dt>
                <dd className="mt-1 text-sm text-white">Polvo funcional listo</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Destino
                </dt>
                <dd className="mt-1 text-sm text-white">Sectores industriales</dd>
              </div>
            </dl>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"
            />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400">
                Cadena de producción
              </p>
              <h2 className="mt-3 text-xl font-light tracking-wider text-white">
                De la molécula al ingrediente funcional
              </h2>

              <ol className="mt-6 space-y-5">
                {processSteps.map((paso) => (
                  <li
                    key={paso.id}
                    className="flex gap-4 border-t border-slate-800 pt-5 first:border-t-0 first:pt-0"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {paso.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium tracking-wide text-white">
                        {paso.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-teal-400">
                        {paso.subtitle}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {paso.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-slate-800 bg-slate-950 py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-400">
              Suministro industrial
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-wider text-white md:text-4xl">
              Lo que necesita tu línea de producción
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              El trabajo de escalamiento se traduce en un ingrediente con especificación,
              trazabilidad y soporte técnico para su integración.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SERVICIOS_BIO.map((servicio) => (
              <article
                key={servicio.titulo}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-teal-500/40"
              >
                <h3 className="text-base font-light tracking-wider text-white">
                  {servicio.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {servicio.texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SprayDryingSection />
      <SolutionsPillars />
      <SectorsAccordion />

      <section className="relative border-t border-slate-800 bg-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
              Contacto directo
            </p>
            <h2 className="mt-3 text-2xl font-light tracking-wider text-white md:text-3xl">
              ¿Necesitas suministro o volúmenes industriales?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Indica el ingrediente, el sector de aplicación y el volumen estimado. El
              equipo de InnoCaps Bio responde con especificaciones y condiciones de
              suministro.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacto?type=bio"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-teal-400"
            >
              Abrir formulario <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Conocer InnoCaps Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
