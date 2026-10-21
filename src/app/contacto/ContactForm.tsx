"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { submitContacto } from "@/app/actions/contacto";

type Via = "lab" | "bio" | "licensing";
type EstadoEnvio = "listo" | "enviando" | "recibido" | "error";

const ASUNTO_POR_TIPO: Record<Via, string> = {
  lab: "InnoCaps Lab — I+D+i, formulación y caracterización",
  bio: "InnoCaps Bio & WiBio — ingredientes funcionales y suministro B2B",
  licensing: "Licensing y alianzas tecnológicas",
};

const VIAS: { id: Via; etiqueta: string; icono: React.ReactNode }[] = [
  {
    id: "lab",
    etiqueta: "Lab",
    icono: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3h6" />
        <path d="M10 3v6.5L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
  },
  {
    id: "bio",
    etiqueta: "Bio",
    icono: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 4 13c0-6 7-9 16-9 0 9-3 16-9 16z" />
        <path d="M4.5 20.5c3.5-5.5 7.5-8.5 11.5-10.5" />
      </svg>
    ),
  },
  {
    id: "licensing",
    etiqueta: "Licensing",
    icono: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
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
  "w-full rounded-xl bg-[#051e22]/60 border border-slate-700/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:bg-[#051e22]/80";

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
    
    const formData = {
      via: asunto!,
      asunto: ASUNTO_POR_TIPO[asunto!],
      nombre: campos.nombre,
      empresa: campos.empresa,
      email: campos.email,
      telefono: campos.telefono,
      sector: campos.sector,
      consulta: campos.mensaje,
    };

    const result = await submitContacto(formData);
    
    if (result.success) {
      setEstado("recibido");
    } else {
      setEstado("error");
      // Keep error state for a moment then allow retry
      setTimeout(() => setEstado("listo"), 3000);
    }
  }

  function reiniciar() {
    setCampos(CAMPOS_INICIALES);
    setEstado("listo");
  }

  const isSubmitting = estado === "enviando";
  const isError = estado === "error";
  const isDisabled = isSubmitting || isError;
  const ariaLiveText = isSubmitting ? "Enviando solicitud…" : isError ? "Error al enviar" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="section-glass relative z-10 rounded-2xl border border-teal-500/30 bg-[#031417]/85 backdrop-blur-[16px] p-6 sm:p-8 shadow-[0_0_80px_-20px_rgba(45,212,191,0.25),0_0_40px_-10px_rgba(20,184,166,0.15)] overflow-hidden">
        {/* Capa glass decorativa superior */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-lime-500/5"
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
        ) : estado === "error" ? (
          <div
            role="alert"
            aria-live="assertive"
            className="relative z-10 flex flex-col items-center justify-center gap-4 py-10 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/50 bg-red-500/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <h2 className="text-xl sm:text-2xl font-light tracking-wider text-white">
              Error al enviar
            </h2>
            <p className="max-w-md text-sm text-slate-300 leading-relaxed">
              No se pudo registrar tu consulta. Por favor, inténtalo de nuevo en unos instantes.
            </p>
            <button
              type="button"
              onClick={() => setEstado("listo")}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/10 px-6 py-3 text-sm font-bold text-teal-400 transition-all hover:bg-teal-500 hover:text-slate-950"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            aria-label="Formulario de contacto B2B"
            className="relative z-10 space-y-6"
          >
            {/* ── Selector de vía comercial (cápsulas brillantes) ── */}
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
                      className={`relative flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold transition-all overflow-hidden ${
                        activa
                          ? "border-teal-500 bg-gradient-to-br from-teal-500/30 to-teal-500/10 text-white shadow-[0_0_20px_-4px_rgba(20,184,166,0.7)]"
                          : "border-slate-700/50 bg-[#051e22]/60 text-slate-300 hover:border-teal-500/60 hover:text-teal-400 hover:bg-[#051e22]/80"
                      }`}
                    >
                      <span className={`relative transition-transform ${activa ? "text-white" : "text-slate-300"}`}>
                        {via.icono}
                      </span>
                      <span className="relative">{via.etiqueta}</span>
                      {activa && (
                        <span className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-lime-500/10 animate-pulse pointer-events-none" />
                      )}
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
              {ariaLiveText}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isDisabled}
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all hover:from-teal-400 hover:via-cyan-400 hover:to-lime-400 hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.8)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
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
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-lime-500/30 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
                  aria-hidden="true"
                />
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