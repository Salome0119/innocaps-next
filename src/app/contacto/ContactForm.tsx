"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type Via = "lab" | "bio" | "licensing";
type EstadoEnvio = "listo" | "enviando" | "recibido";

const ASUNTO_POR_TIPO: Record<Via, string> = {
  lab: "InnoCaps Lab — I+D+i, formulación y caracterización",
  bio: "InnoCaps Bio & WiBio — ingredientes funcionales y suministro B2B",
  licensing: "Licensing y alianzas tecnológicas",
};

const VIAS: { id: Via; etiqueta: string }[] = [
  { id: "lab", etiqueta: "Lab" },
  { id: "bio", etiqueta: "Bio" },
  { id: "licensing", etiqueta: "Licensing" },
];

const SECTORES: string[] = [
  "Nutrición Animal",
  "Nutrición Humana (alimentos y suplementos)",
  "Cosmética & Dermofarmacia",
  "Agroindustria & Bioinsumos",
  "Farmacéutica",
  "Química fina y materiales",
  "Otro",
];

const CAMPOS_INICIALES = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  sector: "",
  mensaje: "",
};

const claseCampo =
  "w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

const claseEtiqueta =
  "block mb-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400";

function esVia(valor: string | null): valor is Via {
  return valor === "lab" || valor === "bio" || valor === "licensing";
}

export default function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tipoEnUrl = searchParams.get("type");
  const viaPreseleccionada: Via | null = esVia(tipoEnUrl) ? tipoEnUrl : null;

  // El asunto visible se deriva del estado local y de la URL:
  // así reacciona a cambios de ?type= sin efectos de sincronización.
  const [asuntoSel, setAsuntoSel] = useState<Via | null>(null);
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [estado, setEstado] = useState<EstadoEnvio>("listo");

  const asunto = asuntoSel ?? viaPreseleccionada;

  function seleccionarVia(via: Via) {
    setAsuntoSel(via);
    router.push(`/contacto?type=${via}`, { scroll: false });
  }

  function cambiarAsunto(evento: ChangeEvent<HTMLSelectElement>) {
    const valor = evento.target.value;
    setAsuntoSel(esVia(valor) ? valor : null);
    router.replace(
      esVia(valor) ? `/contacto?type=${valor}` : "/contacto",
      { scroll: false }
    );
  }

  function actualizarCampo(
    evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = evento.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    // Envío simulado: se reemplazará por Server Action / API al integrar el CMS.
    await new Promise((resolver) => setTimeout(resolver, 900));
    setEstado("recibido");
  }

  function reiniciar() {
    setCampos(CAMPOS_INICIALES);
    setEstado("listo");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="relative rounded-2xl border border-slate-700 bg-slate-900 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(34,211,238,0.18)] overflow-hidden">
        {/* Capa glass decorativa */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"
        />

        {estado === "recibido" ? (
          <div
            role="status"
            aria-live="polite"
            className="relative z-10 flex flex-col items-center justify-center gap-4 py-10 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-teal-500/50 bg-teal-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <h2 className="text-xl sm:text-2xl font-light tracking-wider text-white">
              Solicitud registrada
            </h2>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              Recibimos tu consulta
              {asunto ? (
                <>
                  {" "}
                  sobre <span className="text-teal-400">{ASUNTO_POR_TIPO[asunto]}</span>
                </>
              ) : null}
              . Nuestro equipo técnico revisa cada solicitud de forma individual.
            </p>
            <button
              type="button"
              onClick={reiniciar}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/10 px-6 py-3 text-sm font-bold text-teal-400 transition-all hover:bg-teal-500 hover:text-slate-950"
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            aria-label="Formulario de contacto B2B"
            className="relative z-10 space-y-6"
          >
            {/* ── Selector de vía comercial ── */}
            <fieldset>
              <legend className={claseEtiqueta}>Vía de contacto</legend>
              <div className="grid grid-cols-3 gap-2">
                {VIAS.map((via) => {
                  const activa = asunto === via.id;
                  return (
                    <button
                      key={via.id}
                      type="button"
                      onClick={() => seleccionarVia(via.id)}
                      aria-pressed={activa}
                      className={`rounded-xl border px-3 py-3 text-xs sm:text-sm font-bold transition-all ${
                        activa
                          ? "border-teal-500 bg-teal-500 text-slate-950 shadow-[0_0_20px_-6px_rgba(20,184,166,0.6)]"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-teal-500/60 hover:text-teal-400"
                      }`}
                    >
                      {via.etiqueta}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* ── Asunto preseleccionado desde ?type= ── */}
            <div>
              <label htmlFor="asunto" className={claseEtiqueta}>
                Asunto
              </label>
              <select
                id="asunto"
                name="asunto"
                value={asunto ?? ""}
                onChange={cambiarAsunto}
                className={claseCampo}
                required
              >
                <option value="" disabled>
                  Selecciona el asunto de tu consulta
                </option>
                <option value="lab">{ASUNTO_POR_TIPO.lab}</option>
                <option value="bio">{ASUNTO_POR_TIPO.bio}</option>
                <option value="licensing">{ASUNTO_POR_TIPO.licensing}</option>
              </select>
            </div>

            {/* ── Datos de contacto ── */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className={claseEtiqueta}>
                  Nombre y apellido
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Nombre completo"
                  value={campos.nombre}
                  onChange={actualizarCampo}
                  className={claseCampo}
                />
              </div>

              <div>
                <label htmlFor="empresa" className={claseEtiqueta}>
                  Empresa
                </label>
                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  autoComplete="organization"
                  required
                  placeholder="Organización"
                  value={campos.empresa}
                  onChange={actualizarCampo}
                  className={claseCampo}
                />
              </div>

              <div>
                <label htmlFor="email" className={claseEtiqueta}>
                  Email corporativo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nombre@empresa.com"
                  value={campos.email}
                  onChange={actualizarCampo}
                  className={claseCampo}
                />
              </div>

              <div>
                <label htmlFor="telefono" className={claseEtiqueta}>
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+00 000 000 000"
                  value={campos.telefono}
                  onChange={actualizarCampo}
                  className={claseCampo}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="sector" className={claseEtiqueta}>
                  Sector industrial
                </label>
                <select
                  id="sector"
                  name="sector"
                  value={campos.sector}
                  onChange={actualizarCampo}
                  className={claseCampo}
                  required
                >
                  <option value="" disabled>
                    Selecciona tu sector
                  </option>
                  {SECTORES.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Consulta ── */}
            <div>
              <label htmlFor="mensaje" className={claseEtiqueta}>
                Consulta
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                required
                placeholder="Describí tu proyecto: producto, volumen estimado, etapa de desarrollo y plazos."
                value={campos.mensaje}
                onChange={actualizarCampo}
                className={`${claseCampo} resize-y leading-relaxed`}
              />
            </div>

            <p aria-live="polite" className="sr-only">
              {estado === "enviando" ? "Enviando solicitud…" : ""}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {estado === "enviando" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
                    />
                    Enviando…
                  </>
                ) : (
                  "Enviar consulta B2B"
                )}
              </button>

              <span className="text-center text-[11px] font-mono text-slate-500 sm:text-right">
                INNOCAPS LAB · CONFIDENCIAL
              </span>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
