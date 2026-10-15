import { biotechPipeline } from '@/data/sectionsData';


export default function BiotechPipeline() {
  return (
<section className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-32 overflow-hidden">
  {/* Degradado superior */}
  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none"></div>
  
  {/* Degradado inferior */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
  
  {/* Grid de fondo */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
  </div>

  <div className="container mx-auto px-6 relative z-10">
    {/* Header */}
    <div className="text-center mb-12 md:mb-24">
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
        Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">Proceso</span>
      </h2>
      <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-[1.5]">
        Un enfoque estructurado que garantiza resultados excepcionales en cada proyecto
      </p>
    </div>

    {/* Pipeline con imágenes */}
    <div className="max-w-7xl mx-auto">
      {/* Path SVG conectando los pasos */}
      <div className="relative mb-16">
        <svg 
          viewBox="0 0 1200 200" 
          className="w-full h-auto hidden md:block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'rgb(20, 184, 166)', stopOpacity: '0.8' }} />
              <stop offset="50%" style={{ stopColor: 'rgb(34, 211, 238)', stopOpacity: '0.8' }} />
              <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: '0.8' }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            id="mainPath"
            d="M 60 100 L 180 100 L 240 50 L 300 50 L 420 50 L 480 100 L 600 100 L 660 150 L 720 150 L 840 150 L 900 100 L 1020 100 L 1080 100 L 1140 100"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            filter="url(#glow)"
            className="pipeline-path"
          />

          {biotechPipeline.map((_, index) => {
            const positions = [
              { x: 60, y: 100 },
              { x: 300, y: 50 },
              { x: 600, y: 100 },
              { x: 840, y: 150 },
              { x: 1140, y: 100 }
            ];
            const pos = positions[index];
            return (
              <g key={index} className="pipeline-node" style={{ animationDelay: `${index * 0.2}s` }}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="rgb(20, 184, 166)"
                  className="node-pulse"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="15"
                  fill="rgb(15, 23, 42)"
                  stroke="rgb(20, 184, 166)"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  fill="rgb(20, 184, 166)"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Grid de tarjetas con imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {biotechPipeline.map((stage, index) => (
          <div 
            key={index}
            className="process-card group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/50 active:border-teal-500/50 transition-all duration-500 hover:shadow-2xl active:shadow-lg hover:shadow-teal-500/20 hover:scale-105 active:scale-[1.02]"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Imagen de fondo */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={stage.image} 
                alt={stage.stage}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
              
              {/* Número del paso */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-lg">{index + 1}</span>
              </div>

              {/* Ícono */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-teal-500/30">
                <span className="text-2xl">{stage.icon}</span>
              </div>
            </div>

            {/* Contenido */}
            <div className="relative bg-slate-900/95 backdrop-blur-sm p-6 space-y-3">
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                {stage.stage}
              </h3>
              
              <p className="text-sm text-teal-400 font-medium">
                {stage.description}
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {stage.details}
              </p>

              {/* Indicador hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 md:mt-20 text-center">
        <p className="text-slate-400 mb-6 text-base md:text-lg">¿Listo para transformar tu proyecto?</p>
        <button className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:from-teal-400 active:to-cyan-400 text-slate-900 font-bold rounded-full transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 text-lg">
          Comienza Tu Consulta
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
