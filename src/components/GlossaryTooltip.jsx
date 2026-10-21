'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const glossary = {
  'Bicapa Lipídica':
    'Doble capa de moléculas de fosfolípidos que forma la membrana de los liposomas, imitando las membranas celulares naturales.',
  'Exopolisacáridos':
    'Polímeros de azúcares (EPS) secretados por microorganismos al medio de cultivo. En InnoCaps actúan como la propia matriz encapsulante natural.',
  Fosfolípidos:
    'Moléculas anfifílicas con cabeza hidrofílica y colas hidrofóbicas que forman las bicapas de liposomas.',
  'Tensioactivos no iónicos':
    'Surfactantes sin carga eléctrica (Span 60, Tween 60) que forman vesículas niosomales estables y de menor costo.',
  'Hidratación de película lipídica':
    'Técnica de producción de liposomas donde los lípidos se depositan como película fina y se hidratan para formar vesículas.',
  HPH: 'Homogeneización a Alta Presión en Caliente (500-1500 bar). Proceso industrial para producir nanopartículas lipídicas sólidas.',
  Vitrificación:
    'Transición ultrarrápida al estado vítreo que inmoviliza células y bioactivos en animación suspendida, protegiéndolos del oxígeno y la humedad.',
  Maltodextrina:
    'Polisacárido del almidón usado como agente de vitrificación en spray drying para crear matrices protectoras.',
  'Goma arábiga':
    'Polímero natural usado como material de pared en microencapsulación por spray drying, formando matrices vítreas protectoras.',
  Nanoemulsiones:
    'Sistemas translúcidos de 20-200 nm termodinámicamente estables que no se separan con el tiempo.',
  Biodisponibilidad:
    'Fracción de un activo que alcanza la circulación sistémica y está disponible para ejercer su efecto biológico.',
  Micelio:
    'Red de filamentos fúngicos que en fermentación sumergida puede actuar como agente encapsulante natural junto con los EPS.',
  'Caldo fermentado':
    'Medio de cultivo completo tras la fermentación, conteniendo biomasa, metabolitos y medio residual, usado directamente como formulación.',
};

export default function GlossaryTooltip({ term, children }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState('top');
  const triggerRef = useRef(null);
  const definition = glossary[term] || '';

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition(rect.top < 220 ? 'bottom' : 'top');
    }
  }, [show]);

  if (!definition) return <span>{children || term}</span>;

  return (
    <span
      ref={triggerRef}
      className="relative inline"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dashed border-teal-500/40 cursor-help text-teal-300 hover:text-teal-200 transition-colors">
        {children || term}
      </span>
      <AnimatePresence>
        {show && (
          /* El tooltip se construye con <span> (contenido de phrasing)
             para poder convivir dentro de etiquetas <p> sin generar HTML
             inválido ni errores de hidratación. Al ser `absolute`, el
             navegador lo convierte a bloque; los hijos internos usan
             `block` para conservar la maquetación. */
          <motion.span
            initial={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-[100] left-1/2 -translate-x-1/2 block w-72 p-4 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-teal-500/20 shadow-2xl shadow-black/50 pointer-events-none ${
              position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
            }`}
          >
            <span className="block text-[10px] font-bold text-teal-400 mb-1.5 uppercase tracking-[0.2em]">
              {term}
            </span>
            <span className="block text-[13px] text-slate-300 leading-relaxed">{definition}</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 block w-2 h-2 bg-slate-800/95 rotate-45 border-teal-500/20 ${
                position === 'top'
                  ? 'top-full -mt-1 border-r border-b'
                  : 'bottom-full -mb-1 border-l border-t'
              }`}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
