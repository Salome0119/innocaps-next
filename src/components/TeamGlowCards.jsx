'use client';

import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 3 — EQUIPO CIENTÍFICO (Tarjetas glow & blur)
   Director + aliados con hover de iluminación
   ═══════════════════════════════════════════════════════════════════ */

const TEAM = [
  {
    id: 'elkin',
    nombre: 'Elkin Dario Castellón Castrillón',
    rol: 'Director Científico & Fundador',
    credenciales: 'PhD en Agroquímica. Químico y Magíster en Química Analítica. Especialista en sistemas coloidales y plataformas de encapsulación aplicadas.',
    foto: '/team/elkin.webp',
    intro: 'InnoCaps está liderado por una visión científica con enfoque práctico: desarrollar tecnología que funcione en condiciones reales de mercado.',
    esDirector: true,
  },
  {
    id: 'nathalia',
    alias: 'La Arquitecta de Materiales',
    nombre: 'Nathalia Marín',
    rol: 'Ciencia e Ingeniería de Materiales',
    credenciales: 'Doctora en Ciencia e Ingeniería de Materiales.',
    foto: '/team/nathalia.webp',
    esDirector: false,
  },
  {
    id: 'carolina',
    alias: 'Química Pura',
    nombre: 'Carolina Chegwin',
    rol: 'Ciencias Químicas',
    credenciales: 'Doctora en Ciencias Químicas.',
    foto: '/team/carolina.webp',
    esDirector: false,
  },
  {
    id: 'carlos',
    alias: 'El Matemático',
    nombre: 'Carlos Salazar',
    rol: 'Modelado Computacional e Ingeniero Electrónico',
    credenciales: 'Especialista en modelado computacional e ingeniería electrónica aplicada a procesos de encapsulación.',
    foto: '/team/carlos.webp',
    esDirector: false,
  },
];

function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group"
    >
      <div className="group relative bg-[#03100e]/88 backdrop-blur-xl border border-cyan-400/20 rounded-3xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
        {/* Foto con hover de iluminación */}
        <div className="aspect-[3/4] overflow-hidden bg-slate-800 relative">
          <img
            src={member.foto}
            alt={member.nombre}
            width="400"
            height="533"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-110 group-hover:saturate-125"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Overlay de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Info ── */}
        <div className="p-6 md:p-8">
          {member.esDirector ? (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{member.nombre}</h3>
              <p className="text-cyan-400 text-sm font-mono tracking-wider uppercase mb-3">{member.rol}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{member.credenciales}</p>
              <div className="border-t border-slate-800/50 pt-4">
                <p className="text-slate-500 text-sm italic">{member.intro}</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">{member.alias}</p>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{member.nombre}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">{member.rol}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{member.credenciales}</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamGlowCards() {
  return (
    <div id="team-glow" role="tabpanel" aria-label="Equipo científico">
      {/* ── Encabezado ── */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Ciencia hecha por <span className="txt-grad font-semibold">científicos</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Un equipo multidisciplinar unido por la obsesión de proteger y transformar bioactivos.
        </p>
      </div>

      {/* ── Grid de tarjetas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((member, index) => (
          <TeamCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </div>
  );
}