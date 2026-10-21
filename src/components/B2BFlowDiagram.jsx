'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   SUB-VISTA 4 — MODELO B2B (Diagrama de flujo animado)
   Nodos + conectores SVG con flujo de datos + panel lateral de detalle
   ═══════════════════════════════════════════════════════════════════ */

const NODES = [
  {
    id: 'investigacion',
    label: 'Investigación',
    icon: '🔬',
    descripcion: 'I+D aplicada y descubrimiento de nuevos sistemas de encapsulación. Validación experimental de matrices y activos.',
    detalles: [
      'Screening de bioactivos y carriers',
      'Diseño de formulación (DoE)',
      'Caracterización fisicoquímica',
      'Estabilidad acelerada (ICH)',
    ],
  },
  {
    id: 'desarrollo',
    label: 'Desarrollo',
    icon: '⚙️',
    descripcion: 'Optimización de proceso y escalado piloto. Definición de parámetros críticos (CPP/CQA) y validación de método analítico.',
    detalles: [
      'Escalado geométrico y cinético',
      'Optimización de spray drying',
      'Validación de proceso piloto',
      'Definición de espacio de diseño',
    ],
  },
  {
    id: 'validacion',
    label: 'Validación',
    icon: '✅',
    descripcion: 'Validación de proceso a escala industrial (PPQ). Tres lotes consecutivos exitosos. Calificación de equipos (IQ/OQ/PQ).',
    detalles: [
      'PPQ: 3 lotes consecutivos',
      'Calificación IQ/OQ/PQ',
      'Validación de limpieza',
      'Validación de método analítico',
    ],
  },
  {
    id: 'escalado',
    label: 'Escalado',
    icon: '📦',
    descripcion: 'Producción comercial rutinaria con control estadístico (SPC). Suministro B2B multi-formato con trazabilidad completa.',
    detalles: [
      'Producción >5000 L rutinaria',
      'SPC y control de tendencias',
      'CoA por lote + trazabilidad',
      'Soporte técnico en planta cliente',
    ],
  },
];

const NODE_COLORS = {
  investigacion: 'cyan',
  desarrollo: 'teal',
  validacion: 'emerald',
  escalado: 'violet',
};

/* Estilos del popover por color con clases literales: el escáner de
   Tailwind v4 no detecta interpolaciones (`bg-${color}-500/15`), por lo
   que deben escribirse completas para existir en el CSS generado. */
const NODE_THEME = {
  investigacion: {
    icon: 'bg-cyan-500/15 text-cyan-400',
    chip: 'border-cyan-400/30 bg-cyan-500/15 text-cyan-400',
    dot: 'bg-cyan-400',
    node: 'from-cyan-500 to-cyan-400',
    nodeIdle: 'border-cyan-400/30',
    nodeLabel: 'text-cyan-400',
  },
  desarrollo: {
    icon: 'bg-teal-500/15 text-teal-400',
    chip: 'border-teal-400/30 bg-teal-500/15 text-teal-400',
    dot: 'bg-teal-400',
    node: 'from-teal-500 to-teal-400',
    nodeIdle: 'border-teal-400/30',
    nodeLabel: 'text-teal-400',
  },
  validacion: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    chip: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-400',
    dot: 'bg-emerald-400',
    node: 'from-emerald-500 to-emerald-400',
    nodeIdle: 'border-emerald-400/30',
    nodeLabel: 'text-emerald-400',
  },
  escalado: {
    icon: 'bg-violet-500/15 text-violet-400',
    chip: 'border-violet-400/30 bg-violet-500/15 text-violet-400',
    dot: 'bg-violet-400',
    node: 'from-violet-500 to-violet-400',
    nodeIdle: 'border-violet-400/30',
    nodeLabel: 'text-violet-400',
  },
};

function FlowConnector({ isVertical, animated, reducedMotion }) {
  const pathRef = useRef();

  useEffect(() => {
    if (!reducedMotion && animated && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = length;
      pathRef.current.style.strokeDashoffset = length;
      pathRef.current.style.transition = 'stroke-dashoffset 2s linear infinite';
      requestAnimationFrame(() => {
        pathRef.current.style.strokeDashoffset = 0;
      });
    }
  }, [animated, reducedMotion]);

  if (isVertical) {
    return (
      <svg viewBox="0 0 20 120" className="w-5 h-full mx-auto" aria-hidden="true">
        <path
          ref={pathRef}
          d="M10 0 L10 120"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="10 10"
        />
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 20" className="h-5 w-full my-2" aria-hidden="true">
      <path
        ref={pathRef}
        d="M0 10 L200 10"
        stroke="url(#flowGradientH)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="10 10"
      />
      <defs>
        <linearGradient id="flowGradientH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FlowNode({ node, isActive, isHovered, isPinned, onActivate, onHoverChange, onUnpin, index, isVertical, reducedMotion }) {
  const color = NODE_COLORS[node.id];
  const theme = NODE_THEME[node.id] || NODE_THEME.investigacion;
  const glowRgba = color === 'cyan' ? '0, 255, 255' : color === 'teal' ? '20, 184, 166' : color === 'emerald' ? '16, 185, 129' : '139, 92, 246';

  /* Despliegue por hover: el popover se abre al entrar el cursor en el
     nodo y se cierra al salirlo. `isDismissed` permite cerrarlo con la
     X sin que vuelva a abrirse hasta que el cursor abandone el nodo. */
  const [isHover, setIsHover] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isPopoverOpen = (isHover && !isDismissed) || isPinned;

  return (
    <div className={`relative flex flex-col ${isVertical ? 'items-center' : 'flex-1'} group`}>
      {/* Área sensible al cursor (nodo + etiqueta). El popover es
          descendiente de esta área, de modo que mover el puntero hacia
          él no dispara la salida. */}
      <div
        className="relative flex flex-col"
        onMouseEnter={() => {
          setIsHover(true);
          onHoverChange?.(node.id);
        }}
        onMouseLeave={() => {
          setIsHover(false);
          setIsDismissed(false);
          onHoverChange?.(null);
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls={`b2b-panel-${node.id}`}
          id={`b2b-tab-${node.id}`}
          onClick={() => onActivate(node.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onActivate(node.id);
            }
          }}
          /* El foco de teclado mantiene el resplandor del nodo */
          onFocus={() => onHoverChange?.(node.id)}
          onBlur={() => onHoverChange?.(null)}
          className={`relative flex flex-col ${isVertical ? 'items-center' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
        >
          {/* Nodo circular */}
          <motion.div
            whileHover={{ scale: isActive ? 1.15 : 1.08 }}
            animate={{
              scale: isActive ? 1.15 : 1,
              boxShadow: isActive
                ? `0 0 30px rgba(${glowRgba}, 0.6), 0 0 60px rgba(${glowRgba}, 0.3)`
                : isHovered
                  ? `0 0 18px rgba(${glowRgba}, 0.35)`
                  : 'none',
            }}
            transition={{ duration: 0.3 }}
            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center flex-shrink-0 ${
              isActive ? `bg-gradient-to-br ${theme.node}` : `bg-slate-800/50 border ${theme.nodeIdle}`
            }`}>
            <span className="text-3xl md:text-4xl relative z-10">{node.icon}</span>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden="true"
              />
            )}
          </motion.div>

          {/* Etiqueta */}
          <motion.div
            initial={{ opacity: 0, y: isVertical ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
            className={`mt-3 ${isVertical ? 'text-center' : ''}`}
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400/70 mb-1">{index + 1}</p>
            <h4 className={`font-semibold text-white ${isActive ? theme.nodeLabel : ''}`}>{node.label}</h4>
          </motion.div>
        </button>

        {/* Popover de detalle: posicionado de forma relativa justo
            debajo del nodo (top-full) */}
        <DetailPanel
          node={node}
          isOpen={isPopoverOpen}
          onClose={() => {
            setIsDismissed(true);
            onUnpin?.(node.id);
          }}
          align={index === NODES.length - 1 ? 'right' : 'center'}
        />
      </div>

      {/* Conector animado (excepto el último) */}
      {index < NODES.length - 1 && (
        <FlowConnector
          isVertical={isVertical}
          animated={!reducedMotion}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  );
}

/* Popover de detalle: se despliega justo debajo del nodo (posicionamiento
   relativo `absolute top-full`), con apertura por hover o fijado por clic.
   El contenedor de posicionamiento es estático —framer-motion aplica su
   propio `transform` inline, que competiría con las clases de
   centrado— y el `AnimatePresence` interior mantiene la tarjeta durante
   la animación de salida. */
function DetailPanel({ node, isOpen, onClose, align = 'center' }) {
  /* Sin nodo no hay nada que mostrar: se evita leer propiedades de
     `undefined` (NODE_COLORS[node.id]) */
  if (!node) return null;

  const theme = NODE_THEME[node.id] || NODE_THEME.investigacion;

  return (
    <div
      className={`pointer-events-none absolute top-full z-50 pt-3 ${
        align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
      }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={node.id}
            id={`b2b-panel-${node.id}`}
            data-b2b-popover="true"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-teal-500/30 bg-[#031417]/80 backdrop-blur-md backdrop-saturate-150 shadow-2xl shadow-teal-950/40"
            role="dialog"
            aria-labelledby={`b2b-detail-title-${node.id}`}
          >
          {/* Encabezado compacto: ícono, título, badge de paso y cierre */}
          <div className="flex items-start gap-2.5 border-b border-teal-500/20 px-4 py-3">
            <span className={`grid h-9 w-9 flex-none place-items-center rounded-xl text-lg leading-none ${theme.icon}`}>
              {node.icon}
            </span>
            <div className="min-w-0 flex-1">
              <h5 id={`b2b-detail-title-${node.id}`} className="truncate text-sm font-semibold text-white">
                {node.label}
              </h5>
              <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${theme.chip}`}>
                Paso {NODES.findIndex(n => n.id === node.id) + 1}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-slate-800/40 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Cerrar panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Contenido compacto: resumen + detalles clave */}
          <div className="max-h-[46vh] overflow-y-auto px-4 py-3.5">
            <p className="text-xs leading-relaxed text-slate-300">{node.descripcion}</p>

            <div className="mt-3.5 border-t border-teal-500/15 pt-3">
              <h6 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/70">
                Detalles clave
              </h6>
              <ul className="space-y-1.5">
                {node.detalles.map((detalle, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-snug text-slate-400">
                    <span className={`mt-1.5 h-1 w-1 flex-none rounded-full ${theme.dot}`} />
                    <span>{detalle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function B2BFlowDiagram() {
  /* El popover se abre por hover; el clic permite "fijarlo" para que
     permanence abierto al retirar el cursor. */
  const [pinnedNodeId, setPinnedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduced motion
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Clic en el nodo: fija o desfija el popover */
  const handleNodeActivate = useCallback((id) => {
    setPinnedNodeId(prev => (prev === id ? null : id));
  }, []);

  const unpinNode = useCallback((id) => {
    setPinnedNodeId(prev => (prev === id ? null : prev));
  }, []);

  /* Al pasar el cursor a otro nodo se libera el que estuviera fijado:
     nunca hay dos popovers desplegados a la vez. */
  const handleHoverChange = useCallback((id) => {
    setHoveredNodeId(id);
    if (id) setPinnedNodeId(prev => (prev && prev !== id ? null : prev));
  }, []);

  // Cerrar el popover fijado con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setPinnedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Desfijar al hacer click fuera (desktop): ni sobre un nodo ni dentro
  // de un popover desplegado
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMobile && pinnedNodeId) {
        const nodeElements = document.querySelectorAll('[id^="b2b-tab-"]');
        let clickedOnNode = false;
        nodeElements.forEach(el => { if (el.contains(e.target)) clickedOnNode = true; });
        const clickedOnPopover = !!e.target.closest?.('[data-b2b-popover]');
        if (!clickedOnNode && !clickedOnPopover) setPinnedNodeId(null);
      }
    };
    if (!isMobile && pinnedNodeId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pinnedNodeId, isMobile]);

  return (
    <div id="b2b-flow" role="tabpanel" aria-label="Modelo B2B de I+D+i">
      {/* ── Encabezado ── */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-3">
          Plataforma B2B de <span className="txt-grad font-semibold">I+D+i</span>
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Conectamos ciencia y mercado a través de un proceso validado y trazable.
        </p>
      </div>

      {/* ── Diagrama de flujo ── */}
      <div className={`relative ${isMobile ? 'flex flex-col' : 'flex flex-row'} items-center justify-center gap-4 md:gap-8 mb-12`} role="tablist" aria-label="Etapas del modelo B2B">
        {NODES.map((node, index) => (
          <FlowNode
            key={node.id}
            node={node}
            isActive={pinnedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            isPinned={pinnedNodeId === node.id}
            onActivate={handleNodeActivate}
            onHoverChange={handleHoverChange}
            onUnpin={unpinNode}
            index={index}
            isVertical={isMobile}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* ── Resumen final con parpadeo ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-10 md:mt-16"
      >
        <div className="rounded-3xl border border-slate-800/60 bg-slate-950/75 backdrop-blur-xl p-6 md:p-8 max-w-3xl mx-auto">
          <p className="text-white text-center text-base md:text-lg leading-relaxed">
            No vendemos únicamente un ingrediente encapsulado.
            <br />
            <span className={`txt-grad font-bold relative inline-block ${!reducedMotion ? 'animate-about-blink' : ''}`}>
              Ofrecemos certeza técnica, respaldo científico y acompañamiento estratégico.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default B2BFlowDiagram;