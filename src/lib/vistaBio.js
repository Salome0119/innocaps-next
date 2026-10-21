/* ═══════════════════════════════════════════════════════════════════
   VISTAS DE /BIO (?seccion=)
   Resolución compartida entre el servidor (page.tsx, que decide si el
   héroe se renderiza) y el cliente (BioWiBioSection, que conmuta las
   vistas; Header, que marca el enlace activo). Una única fuente de
   verdad evita que servidor y cliente interpreten el mismo parámetro
   de forma distinta.
   ═══════════════════════════════════════════════════════════════════ */

/* Alias canónicos (clave de ?seccion= → vista) */
export const VISTAS = {
  tecnologia: 'tecnologia',
  soluciones: 'soluciones',
  proceso: 'proceso',
};

/* Los ?seccion= antiguos (y los nombres largos) siguen apuntando a su
   vista equivalente */
export const VISTAS_LEGACY = {
  escalamiento: 'tecnologia',
  'tecnologia-escalamiento': 'tecnologia',
  'tecnologia-y-escalamiento': 'tecnologia',
  colaboracion: 'proceso',
  aplicaciones: 'proceso',
  'proceso-aplicaciones': 'proceso',
  'soluciones-b2b': 'soluciones',
};

/* Vista por defecto: Tecnología y Escalamiento */
export const VISTA_POR_DEFECTO = 'tecnologia';

/* Resuelve el valor de ?seccion= a una vista válida */
export function resolverVista(seccion) {
  const clave = Array.isArray(seccion) ? seccion[0] : seccion;
  if (!clave) return VISTA_POR_DEFECTO;
  return VISTAS[clave] || VISTAS_LEGACY[clave] || VISTA_POR_DEFECTO;
}

/* El héroe de /bio es exclusivo de la vista de Tecnología y Escalamiento */
export function esVistaTecnologia(seccion) {
  return resolverVista(seccion) === 'tecnologia';
}
