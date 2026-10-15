'use client';

import { useRef, useCallback, lazy, Suspense } from 'react';
import SolutionsManifesto from './SolutionsManifesto';

// Lazy-load heavy sections (SolutionsPillars has a 3D Canvas)
const SolutionsPillars = lazy(() => import('./SolutionsPillars'));
const ServiceModel = lazy(() => import('./ServiceModel'));

/* ═══════════════════════════════════════════
   SOLUTIONS PAGE — Main orchestrator
   Assembles all sections:
    1. Manifesto (hero intro)
    2. 4 Pillars of Impact (interactive 3D)
    3. Service Model (I+D as a Service)
   ═══════════════════════════════════════════ */

const SectionFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
  </div>
);

export default function SolutionsPage() {
  const ecosistemaRef = useRef(null);

  const scrollToEcosistema = useCallback(() => {
    const el = document.getElementById('ecosistema');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SolutionsManifesto onCTAClick={scrollToEcosistema} />
      <Suspense fallback={<SectionFallback />}>
        <SolutionsPillars />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ServiceModel />
      </Suspense>
    </div>
  );
}
