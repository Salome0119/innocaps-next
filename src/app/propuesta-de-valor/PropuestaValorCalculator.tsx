'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   CALCULADORA DE PROPUESTA DE VALOR — ROI INTERACTIVA
   Layout limpio 2-columnas: Entradas (izq) | Resultados (der)
   Tema minimalista: fondo #030d14, tarjetas #071722/80, acentos #00f5d4
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: 'lab', label: 'I+D+i (Lab)', icon: '🔬' },
  { id: 'bio', label: 'Formulación (Bio)', icon: '🏭' },
] as const;

type TabId = 'lab' | 'bio';

/* ──────────────────────────────────────────────
   HELPERS DE FORMATO — Precisión y consistencia
   ────────────────────────────────────────────── */

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

function formatCurrencyCompact(val: number): string {
  const rounded = round2(val);
  const absVal = Math.abs(rounded);
  const sign = rounded < 0 ? '-' : '';
  const absStr = absVal >= 1_000_000_000
    ? `${(absVal / 1_000_000_000).toFixed(1)}B`
    : absVal >= 1_000_000
      ? `${(absVal / 1_000_000).toFixed(1)}M`
      : absVal >= 1_000
        ? `${(absVal / 1_000).toFixed(0)}k`
        : `${absVal}`;
  return `${sign}$${absStr} COP`;
}

function formatNumber(val: number): string {
  return Math.round(val).toLocaleString('es-CO');
}

function formatPercent(val: number): string {
  return `${round2(val).toFixed(1)}%`;
}

/* ──────────────────────────────────────────────
   COMPONENTES DE UI
   ────────────────────────────────────────────── */

function CustomSlider({
  value,
  min,
  max,
  step,
  onChange,
  label,
  unit,
  formatValue,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  label: string;
  unit: string;
  formatValue: (v: number) => string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-item">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-lg font-bold text-white tabular-nums font-mono truncate">
          {formatValue(value)} <span className="text-sm font-normal text-slate-500">{unit}</span>
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none bg-white/5 rounded-full cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#00f5d4]/50 focus:ring-offset-2 focus:ring-offset-[#030d14]
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#00f5d4]
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,245,212,0.6)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_16px_rgba(0,245,212,0.8)]
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#00f5d4]
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(0,245,212,0.6)]
            [&::-moz-range-track]:bg-white/5
            [&::-moz-range-track]:rounded-full"
          aria-label={label}
        />
        <div
          className="absolute top-1/2 left-0 h-full -translate-y-1/2 rounded-full bg-gradient-to-r from-[#00f5d4]/50 to-[#00f5d4]/10 pointer-events-none"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function ResultCard({
  title,
  value,
  unit = '',
  highlight = false,
  compact = false,
  isNegative = false,
}: {
  title: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  compact?: boolean;
  isNegative?: boolean;
}) {
  const valueColor = highlight
    ? isNegative
      ? 'text-rose-400'
      : 'text-[#00f5d4]'
    : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative rounded-2xl p-4 border transition-all duration-300 w-full overflow-hidden flex flex-col justify-between ${
        highlight
          ? 'border-[#00f5d4]/30 bg-gradient-to-br from-[#00f5d4]/5 to-transparent'
          : 'border-white/5 bg-white/5'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500 mb-2 truncate">
        {title}
      </p>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className={`font-bold tabular-nums font-mono ${valueColor} ${compact ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'} truncate whitespace-nowrap`}>
          {value}
        </span>
        {unit && <span className="text-sm text-slate-500 whitespace-nowrap shrink-0">{unit}</span>}
      </div>
      {highlight && !compact && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-slate-500">
          <span className={isNegative ? 'text-rose-400' : 'text-[#10b981]'}>{isNegative ? '▲' : '▼'}</span>
          <span>{isNegative ? 'Excede costo actual' : 'vs. escenario actual'}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   CALCULADORA LAB
   ────────────────────────────────────────────── */

function LabCalculator() {
  const [teamCost, setTeamCost] = useState(59_000_000);
  const [infraCost, setInfraCost] = useState(25_000_000);
  const [projectsYear, setProjectsYear] = useState(320_000_000);
  const [franchiseFee, setFranchiseFee] = useState(12_000_000);

  const currentMonthly = useMemo(() => round2(teamCost + infraCost + projectsYear / 12), [teamCost, infraCost, projectsYear]);
  const withInnoCapsMonthly = useMemo(() => franchiseFee, [franchiseFee]);
  const monthlySavings = useMemo(() => round2(currentMonthly - withInnoCapsMonthly), [currentMonthly, withInnoCapsMonthly]);
  const annualSavings = useMemo(() => round2(monthlySavings * 12), [monthlySavings]);
  const savingsPercent = useMemo(() => currentMonthly > 0 ? round2((monthlySavings / currentMonthly) * 100) : 0, [currentMonthly, monthlySavings]);
  const isNegativeSavings = monthlySavings < 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
      {/* Panel de Entradas */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8 h-fit">
        <h3 className="text-lg font-light tracking-wide text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f5d4]" />
          Parámetros de entrada
        </h3>
        <div className="space-y-6">
          <CustomSlider value={teamCost} min={10_000_000} max={150_000_000} step={1_000_000} onChange={setTeamCost} label="Costo mensual equipo I+D" unit="COP/mes" formatValue={formatCurrencyCompact} />
          <CustomSlider value={infraCost} min={0} max={80_000_000} step={1_000_000} onChange={setInfraCost} label="Infraestructura + equipos (eq. mensual)" unit="COP/mes" formatValue={formatCurrencyCompact} />
          <CustomSlider value={projectsYear} min={0} max={800_000_000} step={10_000_000} onChange={setProjectsYear} label="Proyectos I+D / año" unit="COP/año" formatValue={formatCurrencyCompact} />
          <CustomSlider value={franchiseFee} min={8_000_000} max={25_000_000} step={1_000_000} onChange={setFranchiseFee} label="Franquicia InnoCaps-Lab" unit="COP/mes" formatValue={formatCurrencyCompact} />
        </div>
      </div>

      {/* Panel de Resultados */}
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ResultCard title="Costo Actual / Mes" value={formatCurrencyCompact(currentMonthly)} unit="COP" compact />
          <ResultCard title="Con InnoCaps / Mes" value={formatCurrencyCompact(withInnoCapsMonthly)} unit="COP" compact />
          <ResultCard title="Ahorro Mensual" value={formatCurrencyCompact(monthlySavings)} unit="COP" highlight isNegative={isNegativeSavings} />
          <ResultCard title="Ahorro Anual" value={formatCurrencyCompact(annualSavings)} unit="COP" highlight isNegative={isNegativeSavings} />
        </div>

        {/* Resumen destacado */}
        <div className="rounded-2xl border border-[#00f5d4]/20 bg-gradient-to-r from-[#00f5d4]/3 via-transparent to-transparent p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-[#00f5d4]/80 mb-1">
                Reducción estimada de costos operativos
              </p>
              <p className="text-4xl md:text-5xl font-bold tabular-nums font-mono" style={{ color: isNegativeSavings ? '#f43f5e' : '#00f5d4' }}>
                {formatPercent(savingsPercent)}
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-3 text-sm text-slate-400" role="list">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" /> Franquicia fija predecible</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Elimina capex infraestructura</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" /> Acceso a pipeline validado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   CALCULADORA BIO
   ────────────────────────────────────────────── */

function BioCalculator() {
  const [monthlyProduction, setMonthlyProduction] = useState(10_000);
  const [currentCostPerKg, setCurrentCostPerKg] = useState(8500);
  const [doseReduction, setDoseReduction] = useState(30);
  const [priceFactor, setPriceFactor] = useState(1.5);

  const currentMonthly = useMemo(() => round2(monthlyProduction * currentCostPerKg), [monthlyProduction, currentCostPerKg]);
  const withInnoCapsMonthly = useMemo(() => {
    const reducedKg = monthlyProduction * (1 - doseReduction / 100);
    const newCostPerKg = currentCostPerKg * priceFactor;
    return round2(reducedKg * newCostPerKg);
  }, [monthlyProduction, currentCostPerKg, doseReduction, priceFactor]);
  const monthlySavings = useMemo(() => round2(currentMonthly - withInnoCapsMonthly), [currentMonthly, withInnoCapsMonthly]);
  const annualSavings = useMemo(() => round2(monthlySavings * 12), [monthlySavings]);
  const savingsPercent = useMemo(() => currentMonthly > 0 ? round2((monthlySavings / currentMonthly) * 100) : 0, [currentMonthly, monthlySavings]);
  const effectiveCostPerKg = useMemo(() => monthlyProduction > 0 ? round2(withInnoCapsMonthly / monthlyProduction) : 0, [withInnoCapsMonthly, monthlyProduction]);
  const isNegativeSavings = monthlySavings < 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
      {/* Panel de Entradas */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 md:p-8 h-fit">
        <h3 className="text-lg font-light tracking-wide text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f5d4]" />
          Parámetros de entrada
        </h3>
        <div className="space-y-6">
          <CustomSlider value={monthlyProduction} min={1_000} max={100_000} step={1_000} onChange={setMonthlyProduction} label="Producción mensual" unit="kg" formatValue={formatNumber} />
          <CustomSlider value={currentCostPerKg} min={3_000} max={20_000} step={100} onChange={setCurrentCostPerKg} label="Costo actual formulación" unit="COP/kg" formatValue={formatCurrencyCompact} />
          <CustomSlider value={doseReduction} min={0} max={60} step={5} onChange={setDoseReduction} label="Reducción de dosis con WiBio" unit="%" formatValue={(v) => `${v}`} />
          <CustomSlider value={priceFactor * 100} min={100} max={250} step={5} onChange={(v) => setPriceFactor(v / 100)} label="Precio WiBio vs. convencional" unit="x" formatValue={(v) => (v / 100).toFixed(1)} />
        </div>
      </div>

      {/* Panel de Resultados */}
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ResultCard title="Costo Actual / Mes" value={formatCurrencyCompact(currentMonthly)} unit="COP" compact />
          <ResultCard title="Con InnoCaps / Mes" value={formatCurrencyCompact(withInnoCapsMonthly)} unit="COP" compact />
          <ResultCard title="Ahorro Mensual" value={formatCurrencyCompact(monthlySavings)} unit="COP" highlight isNegative={isNegativeSavings} />
          <ResultCard title="Ahorro Anual" value={formatCurrencyCompact(annualSavings)} unit="COP" highlight isNegative={isNegativeSavings} />
        </div>

        {/* Métricas adicionales */}
        <div className="grid gap-4 md:grid-cols-3">
          <ResultCard title="Costo efectivo con WiBio" value={formatCurrencyCompact(effectiveCostPerKg)} unit="COP/kg" compact />
          <ResultCard title="Reducción de dosis aplicada" value={`${doseReduction}`} unit="%" compact />
          <ResultCard title="Factor precio WiBio" value={`${priceFactor.toFixed(1)}`} unit="x" compact />
        </div>

        {/* Resumen destacado */}
        <div className="rounded-2xl border border-[#00f5d4]/20 bg-gradient-to-r from-[#00f5d4]/3 via-transparent to-transparent p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.1em] text-[#00f5d4]/80 mb-1">
                Reducción estimada de costos de formulación
              </p>
              <p className="text-4xl md:text-5xl font-bold tabular-nums font-mono" style={{ color: isNegativeSavings ? '#f43f5e' : '#00f5d4' }}>
                {formatPercent(savingsPercent)}
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-3 text-sm text-slate-400" role="list">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" /> Menos materia prima por kg</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Mayor rendimiento encapsulado</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" /> Estabilidad y vida útil superior</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   TABS
   ────────────────────────────────────────────── */

function TabButton({ tab, isActive, onActivate }: { tab: (typeof TABS)[number]; isActive: boolean; onActivate: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      id={`tab-${tab.id}`}
      onClick={onActivate}
      className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f5d4] focus-visible:ring-offset-2 focus:ring-offset-[#030d14] ${
        isActive
          ? 'text-[#00f5d4] bg-white/5 border border-white/10'
          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
      }`}
    >
      <span className="text-lg">{tab.icon}</span>
      <span>{tab.label}</span>
    </button>
  );
}

/* ──────────────────────────────────────────────
   EXPORT
   ────────────────────────────────────────────── */

export default function PropuestaValorCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('lab');

  return (
    <div id="propuesta-valor" className="relative" role="tabpanel" aria-label="Calculadora de Propuesta de Valor">
      {/* Selector de Pestañas */}
      <div className="mb-10">
        <div className="flex justify-center">
          <div className="inline-flex flex-nowrap gap-1.5 rounded-full border border-white/5 bg-white/5 p-1">
            {TABS.map((tab) => (
              <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onActivate={() => setActiveTab(tab.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'lab' ? <LabCalculator /> : <BioCalculator />}
        </motion.div>
      </AnimatePresence>

      {/* Nota metodológica */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-12 rounded-2xl border border-white/5 bg-white/5 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <svg className="flex-shrink-0 w-5 h-5 text-[#00f5d4]/70 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-white">Metodología de cálculo</p>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Los cálculos son estimaciones basadas en parámetros de referencia de mercado.
                <strong className="text-slate-300"> InnoCaps-Lab </strong> sustituye costos fijos de I+D+i por una franquicia mensual predecible.
                <strong className="text-slate-300"> WiBio </strong> reduce la dosis efectiva mediante nanoencapsulación, disminuyendo kg requeridos aunque el precio unitario sea superior.
                Los resultados no constituyen oferta vinculante; solicite análisis con datos reales para validación técnica y comercial.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-[0.1em]">
            <span className="w-2 h-2 rounded-full bg-[#00f5d4]" />
            Modelo orientativo
          </div>
        </div>
      </motion.div>
    </div>
  );
}