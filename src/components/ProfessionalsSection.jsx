'use client';

import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

const professionals = [
  {
    id: 1,
    name: "Elkin Dario Castellon",
    title: "Director Científico Fundador",
    description: "Químico, Magíster en Química Analítica y Doctor en Agroquímica.",
    placeholder: "https://ui-avatars.com/api/?name=Elkin+Castellon&size=400&background=14b8a6&color=fff&bold=true"
  },
  {
    id: 2,
    name: "Nathalia Marín",
    title: "Doctora en Ciencia e Ingeniería de Materiales",
    description: "Especialista en nanomateriales y caracterización avanzada.",
    placeholder: "https://ui-avatars.com/api/?name=Nathalia+Marin&size=400&background=22d3ee&color=fff&bold=true"
  },
  {
    id: 3,
    name: "Carolina Chegwin Angarita",
    title: "Doctora en Ciencias Química",
    description: "Química, magister y Doctora en Ciencias Química.",
    placeholder: "https://ui-avatars.com/api/?name=Carolina+Chegwin&size=400&background=06b6d4&color=fff&bold=true"
  },
  {
    id: 4,
    name: "Sandra Navarro",
    title: "Doctora en Biotecnología",
    description: "Experta en procesos biotecnológicos y fermentación.",
    placeholder: "https://ui-avatars.com/api/?name=Sandra+Navarro&size=400&background=0891b2&color=fff&bold=true"
  },
  {
    id: 5,
    name: "Diego F. Villanueva Mejía",
    title: "Doctor en Biotecnología",
    description: "Investigador en bioprocesos y optimización.",
    placeholder: "https://ui-avatars.com/api/?name=Diego+Villanueva&size=400&background=0e7490&color=fff&bold=true"
  },
  {
    id: 6,
    name: "María Alejandra Arango",
    title: "Biotecnóloga y Magister en Ingeniería",
    description: "Énfasis en procesos biotecnológicos.",
    placeholder: "https://ui-avatars.com/api/?name=Maria+Arango&size=400&background=155e75&color=fff&bold=true"
  },
  {
    id: 7,
    name: "Carlos Salazar",
    title: "Ingeniero Electrónico y Matemático",
    description: "Especialista en modelado computacional y automatización.",
    placeholder: "https://ui-avatars.com/api/?name=Carlos+Salazar&size=400&background=164e63&color=fff&bold=true"
  }
];

export default function ProfessionalsSection() {
  const isMobile = useIsMobile();

  return (
    <section className={`relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 light:from-slate-200 light:via-slate-100 light:to-slate-200 overflow-hidden transition-colors duration-300 ${isMobile ? 'py-20' : 'py-32'}`}>
      {/* Degradado superior */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 light:from-slate-200 to-transparent z-10 pointer-events-none"></div>
      
      {/* Degradado inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 light:from-slate-200 to-transparent z-10 pointer-events-none"></div>
      
      {/* Efectos de fondo — reduced on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      )}

      <div className={`container mx-auto relative z-10 ${isMobile ? 'px-5' : 'px-6'}`}>
        {/* Header */}
        <motion.div 
          className={`text-center ${isMobile ? 'mb-10' : 'mb-20'}`}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`font-bold text-white mb-4 ${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl mb-6'}`}>
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">Profesionales y Aliados</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto mb-4 md:mb-6"></div>
          <p className={`text-slate-400 max-w-3xl mx-auto ${isMobile ? 'text-base leading-[1.5]' : 'text-xl'}`}>
            Un equipo multidisciplinario de expertos comprometidos con la excelencia científica y la innovación
          </p>
        </motion.div>

        {/* Grid de profesionales */}
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isMobile ? 'gap-4' : 'gap-8'}`}>
          {professionals.map((person, index) => (
            <motion.div
              key={person.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: isMobile ? index * 0.05 : index * 0.1 }}
            >
              {/* Tarjeta */}
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full transition-all duration-500 hover:border-teal-500/50 active:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 active:shadow-lg">
                {/* Glow effect en hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-500"></div>
                
                <div className="relative space-y-4">
                  {/* Foto placeholder */}
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-teal-500 transition-colors duration-500">
                      <img 
                        src={person.placeholder} 
                        alt={person.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    {/* Badge número */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-slate-900 font-bold text-sm">{person.id}</span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                      {person.name}
                    </h3>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
                    
                    <p className="text-sm font-semibold text-teal-400">
                      {person.title}
                    </p>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {person.description}
                    </p>
                  </div>

                  {/* Indicador hover inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-b-2xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA opcional */}
        <motion.div 
          className={`text-center ${isMobile ? 'mt-12' : 'mt-20'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className={`text-slate-400 mb-6 ${isMobile ? 'text-base' : 'text-lg'}`}>¿Quieres formar parte de nuestro equipo?</p>
          <button className={`bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:from-teal-400 active:to-cyan-400 text-slate-900 font-bold rounded-full transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 ${isMobile ? 'w-full py-4 text-base' : 'px-10 py-4 text-lg'}`}>
            Contáctanos
          </button>
        </motion.div>
      </div>
    </section>
  );
}
