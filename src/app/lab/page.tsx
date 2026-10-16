import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import ModelViewer from "@/components/ModelViewer";
import BiotechPipeline from "@/components/BiotechPipeline";
import { technologies } from "@/data/sectionsData";

const NanoArsenal = dynamic(() => import("@/components/NanoArsenal"), {
  loading: () => <SeccionCarga />,
});

export const metadata: Metadata = {
  title: "InnoCaps Lab — I+D+i, formulación y caracterización",
  description:
    "Unidad 01 de InnoCaps: investigación y desarrollo de nanoencapsulación, pruebas de concepto, caracterización, escalado piloto y transferencia tecnológica.",
};

interface ServicioLab {
  trl: string;
  titulo: string;
  texto: string;
}

const SERVICIOS_LAB: ServicioLab[] = [
  {
    trl: "TRL 1-3",
    titulo: "Exploración y pruebas de concepto",
    texto:
      "Evaluamos la viabilidad de la molécula activa, la vía de obtención —incluida la fermentación de precisión— y el vehículo de encapsulación más adecuado.",
  },
  {
    trl: "TRL 3-4",
    titulo: "Formulación y prototipado",
    texto:
      "Diseñamos la arquitectura de encapsulación (emulsiones múltiples, liposomas, microcápsulas sólidas o nanoestructuras) y ajustamos la receta al activo.",
  },
  {
    trl: "TRL 4-5",
    titulo: "Caracterización y estabilidad",
    texto:
      "Medimos distribución de tamaño, rendimiento de encapsulación y comportamiento frente a luz, calor y oxígeno, además de la liberación controlada del activo.",
  },
  {
    trl: "TRL 5-6",
    titulo: "Escalado piloto",
    texto:
      "Trasladamos el proceso a equipo piloto con control de los parámetros críticos para asegurar reproducibilidad entre lotes antes de la producción.",
  },
  {
    trl: "TRL 7-9",
    titulo: "Transferencia tecnológica",
    texto:
      "Documentamos proceso y especificaciones, y acompañamos la puesta en marcha productiva junto con la unidad InnoCaps Bio.",
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

export default function LabPage() {
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
              Unidad 01 · InnoCaps Lab
            </p>
            <h1 className="mt-4 text-4xl font-light tracking-wider text-white md:text-6xl">
              Investigación, formulación y{" "}
              <span className="text-teal-400">caracterización</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              Convertimos una materia prima o una molécula activa en un sistema de
              nanoencapsulación validado: arquitectura de encapsulación, datos de
              estabilidad y un proceso documentado listo para escalar.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contacto?type=lab"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-teal-400"
              >
                Solicitar desarrollo <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/bio"
                className="inline-flex items-center justify-center rounded-xl border border-teal-500/50 bg-teal-500/10 px-6 py-3.5 text-sm font-bold text-teal-400 transition-colors hover:bg-teal-500 hover:text-slate-900"
              >
                Ver InnoCaps Bio
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-800 pt-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Ámbito
                </dt>
                <dd className="mt-1 text-sm text-white">I+D+i aplicada</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Escala
                </dt>
                <dd className="mt-1 text-sm text-white">Laboratorio a piloto</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Entrega
                </dt>
                <dd className="mt-1 text-sm text-white">Formulación documentada</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-[-15%] rounded-full bg-teal-500/10 blur-3xl"
            />
            <div className="relative h-full w-full">
              <ModelViewer />
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-slate-800 bg-slate-950 py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-400">
              Plataformas tecnológicas
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-wider text-white md:text-4xl">
              Arquitecturas de encapsulación disponibles
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Cada activo exige una arquitectura distinta. Estas son las plataformas
              sobre las que construimos la formulación de tu proyecto.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((tecnologia) => (
              <article
                key={tecnologia.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-teal-500/40"
              >
                <span className="text-2xl" aria-hidden="true">
                  {tecnologia.icon}
                </span>
                <h3 className="mt-4 text-base font-light tracking-wider text-white">
                  {tecnologia.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {tecnologia.description}
                </p>
                <p className="mt-4 border-t border-slate-800 pt-4 text-xs leading-relaxed text-teal-400">
                  {tecnologia.application}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-slate-800 bg-slate-950 py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-400">
              Servicios de I+D+i
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-wider text-white md:text-4xl">
              Trabajamos por nivel de madurez tecnológica
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Entras en el punto que necesites: desde la exploración de una molécula
              hasta la documentación lista para producción industrial.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS_LAB.map((servicio) => (
              <li
                key={servicio.trl}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <span className="inline-block rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-teal-400">
                  {servicio.trl}
                </span>
                <h3 className="mt-4 text-base font-light tracking-wider text-white">
                  {servicio.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {servicio.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NanoArsenal />
      <BiotechPipeline />

      <section className="relative border-t border-slate-800 bg-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
              Contacto directo
            </p>
            <h2 className="mt-3 text-2xl font-light tracking-wider text-white md:text-3xl">
              ¿Tienes una molécula que proteger?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Describe el activo, el volumen estimado y el estado actual del proyecto.
              El equipo de InnoCaps Lab revisa la solicitud y propone el siguiente paso.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacto?type=lab"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-teal-400"
            >
              Abrir formulario <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/bio"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Conocer InnoCaps Bio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
