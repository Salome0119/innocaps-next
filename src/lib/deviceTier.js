/* ═══════════════════════════════════════════════════════════════════
   DETECCIÓN DE CAPACIDAD DEL DISPOSITIVO
   Compartida por ModelViewer, MicrocapsuleCore y BioreactorScene para
   degradar materiales, DPR y sombras en gama baja.
   ═══════════════════════════════════════════════════════════════════ */

export function getDeviceTier() {
  if (typeof window === 'undefined') return 'low';

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;

  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 2;

  if (isMobile || cores <= 4 || memory <= 4) return 'low';
  if (cores <= 8 && memory <= 8) return 'mid';
  return 'high';
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
