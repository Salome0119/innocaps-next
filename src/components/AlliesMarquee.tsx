

// Nuestros Aliados - Infinite Marquee
const allies = [
  { name: 'AI', logo: '/allies/ai.png' },
  { name: 'Biotecno', logo: '/allies/Biotecno-1.png' },
  { name: 'Cecoltec', logo: '/allies/cecoltec.webp' },
  { name: 'Ingeniería de Alimentos', logo: '/allies/ingenieriadealimentos.png' },
  { name: 'Química Hongos', logo: '/allies/quimicahongos.jpg' },
  { name: 'Red TP', logo: '/allies/red-tp.png' },
];

export default function AlliesMarquee() {
  return (
<section className="relative bg-slate-950 py-24 overflow-hidden transition-colors duration-300">
  {/* Degradado superior */}
  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
  
  {/* Degradado inferior */}
  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>

  {/* Fondo decorativo sutil */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-teal-500 rounded-full blur-[180px]"></div>
  </div>

  {/* Grid de fondo */}
  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

  {/* Título — panel glassmorphism (legibilidad sobre NanoBackground) */}
  <div className="container mx-auto px-6 relative z-10 mb-16">
    <div className="section-glass mx-auto max-w-3xl text-center rounded-2xl border border-teal-500/20 bg-[#031417]/80 backdrop-blur-[12px] px-6 py-9 md:px-10">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">Aliados</span>
      </h2>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Colaboramos con líderes de la industria para impulsar la innovación biotecnológica
      </p>
    </div>
  </div>

  {/* Marquee Container */}
  <div className="relative z-10">
    {/* Fade edges */}
    <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none"></div>
    <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none"></div>

    {/* Track (duplicated for seamless loop) */}
    <div className="marquee-track flex gap-12 md:gap-16">
      {/* Primera copia */}
      {allies.map((ally) => (
        <div key={`a-${ally.name}`} className="marquee-item flex-shrink-0 w-48 md:w-56 h-24 md:h-28 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-6 transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 group">
          <img src={ally.logo} alt={ally.name} className="max-h-16 max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
        </div>
      ))}
      {/* Segunda copia (para el loop continuo) */}
      {allies.map((ally) => (
        <div key={`b-${ally.name}`} className="marquee-item flex-shrink-0 w-48 md:w-56 h-24 md:h-28 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-6 transition-all duration-300 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 group">
          <img src={ally.logo} alt={ally.name} className="max-h-16 max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
        </div>
      ))}
    </div>
  </div>

  {/* Línea decorativa inferior */}
  <div className="container mx-auto px-6 mt-16 relative z-10">
    <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
  </div>
</section>
  );
}
