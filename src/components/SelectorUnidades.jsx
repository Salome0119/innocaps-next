import { AnimatedBackground } from './AnimatedBackground';

/* ═══════════════════════════════════════════════════════════════════
   SELECTOR DE UNIDADES — "¿Por dónde empezamos?"
   Empalme continuo con el HeroSection: mismo base bg-slate-950,
   blobs cian/violeta (AnimatedBackground) desplazados hacia abajo y
   degradado de costura (from-slate-950 → transparente) que disuelve
   el corte horizontal. Textura Agrupar.svg + tarjetas con borde cian
   translúcido + backdrop-blur-md. Acentos #00ffff / #2dd4bf.
   ═══════════════════════════════════════════════════════════════════ */

export default function SelectorUnidades() {
  return (
    <section className="selector-unidades relative w-full min-h-screen bg-slate-950 text-[#f0f0f0] flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
      {/* Resplandores cian (izquierda) y violeta (derecha), iniciando
          por debajo de la costura para que el glow emerja con suavidad */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: '140px' }}>
        <AnimatedBackground />
      </div>

      {/* Textura de líneas radiales (mismo asset que el hero) */}
      <img
        src="/Agrupar.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 pointer-events-none"
      />

      {/* Fondo ambiental sutil (halo central cian) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Costura con el hero: degradado que disuelve base, textura y
          resplandores en un solo lienzo continuo (remapea en .light) */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />

      {/* Encabezado — panel glassmorphism (legibilidad sobre NanoBackground) */}
      <div className="section-glass relative z-10 max-w-4xl text-center mb-16 rounded-2xl border border-teal-500/20 bg-[#031417]/80 backdrop-blur-[12px] px-6 py-9 md:px-10">
        <span className="text-xs uppercase tracking-[0.2em] txt-grad font-semibold mb-3 block">
          Dos unidades, una compañía
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ¿Por dónde <span className="txt-grad">empezamos</span>?
        </h2>
        <p className="text-[#b0b0b0] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Elige la unidad que corresponde a tu momento: si necesitas desarrollar o validar
          una formulación, entra por Lab; si buscas un ingrediente estandarizado y volúmenes
          industriales, entra por Bio.
        </p>
      </div>

      {/* Contenedor de tarjetas interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full relative z-10">
        {/* TARJETA 01: LAB */}
        <div className="group relative bg-[#041915]/80 backdrop-blur-md border border-[#00ffff]/30 hover:border-[#00ffff]/60 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,255,255,0.1)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffff]/5 rounded-full blur-2xl group-hover:bg-[#00ffff]/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/20">
                <span className="txt-grad">Unidad 01 · Investigación</span>
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#00ffff] transition-colors">
              InnoCaps Lab
            </h3>

            <p className="text-[#b0b0b0] text-sm leading-relaxed mb-6">
              El núcleo científico de la compañía: investigamos, formulamos y validamos
              sistemas de encapsulación, generamos evidencia experimental y documentamos el
              proceso listo para escalar.
            </p>

            <ul className="space-y-2 mb-8 text-sm text-[#d1d8d6]">
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Formulación y caracterización
              </li>
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Escalado piloto
              </li>
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Licenciamiento y transferencia
                tecnológica
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-[#00ffff]/15">
            <a
              href="/lab"
              className="flex-1 text-center bg-[#00ffff] text-[#03100e] font-semibold py-3 px-6 rounded-lg transition-all hover:bg-[#00cccc] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            >
              Explorar InnoCaps Lab →
            </a>
            <a
              href="/contacto?type=lab"
              className="px-4 py-3 text-center border border-[#00ffff]/25 hover:border-[#00ffff]/50 text-[#f0f0f0] rounded-lg text-sm transition-all hover:bg-white/5"
            >
              Solicitar desarrollo
            </a>
          </div>
        </div>

        {/* TARJETA 02: BIO & WIBIO */}
        <div className="group relative bg-[#041915]/80 backdrop-blur-md border border-[#00ffff]/30 hover:border-[#00ffff]/60 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,255,255,0.1)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffff]/5 rounded-full blur-2xl group-hover:bg-[#00ffff]/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/20">
                <span className="txt-grad">Unidad 02 · Industrial</span>
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#00ffff] transition-colors">
              InnoCaps Bio &amp; WiBio
            </h3>

            <p className="text-[#b0b0b0] text-sm leading-relaxed mb-6">
              La cara industrial de la compañía: convertimos los procesos validados en
              ingredientes funcionales estandarizados, con capacidad de producción y soporte
              técnico para su integración en planta.
            </p>

            <ul className="space-y-2 mb-8 text-sm text-[#d1d8d6]">
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Portafolio de ingredientes
              </li>
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Estandarización por lote
              </li>
              <li className="flex items-center gap-2">
                <span className="txt-grad">→</span> Suministro B2B
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-[#00ffff]/15">
            <a
              href="/bio"
              className="flex-1 text-center bg-[#00ffff] text-[#03100e] font-semibold py-3 px-6 rounded-lg transition-all hover:bg-[#00cccc] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            >
              Explorar InnoCaps Bio →
            </a>
            <a
              href="/contacto?type=bio"
              className="px-4 py-3 text-center border border-[#00ffff]/25 hover:border-[#00ffff]/50 text-[#f0f0f0] rounded-lg text-sm transition-all hover:bg-white/5"
            >
              Solicitar suministro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
