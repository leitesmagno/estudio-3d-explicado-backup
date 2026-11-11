// Estúdio 3D Explicado · base/cores
import * as THREE from 'three';

const A = new THREE.Color();
const B = new THREE.Color();

/** Mistura duas cores hex: k = 0 dá `a`, k = 1 dá `b`. Devolve "#rrggbb". */
export const mistura = (a: string, b: string, k: number): string => {
  A.set(a);
  B.set(b);
  return '#' + A.lerp(B, Math.max(0, Math.min(1, k))).getHexString();
};

/** Clareia (k > 0) ou escurece (k < 0) uma cor hex. */
export const tom = (cor: string, k: number): string => (k >= 0 ? mistura(cor, '#ffffff', k) : mistura(cor, '#000000', -k));
