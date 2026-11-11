// Estúdio 3D Explicado · geometria arredondada e limpeza de memória
import {useEffect, useMemo} from 'react';
import * as THREE from 'three';

type Descartavel = {dispose: () => void} | null | undefined;

/**
 * Libera da GPU geometrias, texturas ou materiais criados com useMemo quando o componente sai
 * ou quando o objeto muda. Use sempre que você criar `new THREE.Algo()` dentro de um componente.
 *   const tex = useMemo(() => new THREE.CanvasTexture(cv), [texto]);
 *   useDescartar(tex);
 */
export const useDescartar = (...objetos: Descartavel[]) => {
  useEffect(
    () => () => {
      for (const o of objetos) o?.dispose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    objetos,
  );
};

// ---------- Caixa arredondada (construção própria) ----------
// Parte de uma caixa subdividida, redistribui os vértices de cada eixo (mais densos perto das quinas)
// e "empurra" cada vértice para a superfície arredondada: ponto mais próximo da caixa interna + raio.
const construir = (w: number, h: number, d: number, r: number, gomos: number): THREE.BufferGeometry => {
  const meia = [w / 2, h / 2, d / 2];
  const rr = Math.max(0, Math.min(r, meia[0] * 0.999, meia[1] * 0.999, meia[2] * 0.999));
  if (rr < 1e-4) return new THREE.BoxGeometry(w, h, d);
  const seg = gomos * 2 + 1;
  const g = new THREE.BoxGeometry(1, 1, 1, seg, seg, seg);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nor = g.attributes.normal as THREE.BufferAttribute;
  const dentro = meia.map((m) => m - rr);
  // posição de cada índice da grade ao longo de um eixo
  const remap = (u: number, eixo: number) => {
    const i = Math.round((u + 0.5) * seg);
    if (i <= gomos) return -dentro[eixo] - rr * Math.cos(((i / gomos) * Math.PI) / 2);
    const j = seg - i;
    return dentro[eixo] + rr * Math.cos(((j / gomos) * Math.PI) / 2);
  };
  const p = new THREE.Vector3();
  const q = new THREE.Vector3();
  for (let v = 0; v < pos.count; v++) {
    p.set(remap(pos.getX(v), 0), remap(pos.getY(v), 1), remap(pos.getZ(v), 2));
    // força o vértice a ficar na face (a coordenada da face vai para o máximo)
    const fx = Math.abs(nor.getX(v)) > 0.5;
    const fy = Math.abs(nor.getY(v)) > 0.5;
    const fz = Math.abs(nor.getZ(v)) > 0.5;
    if (fx) p.x = Math.sign(nor.getX(v)) * meia[0];
    if (fy) p.y = Math.sign(nor.getY(v)) * meia[1];
    if (fz) p.z = Math.sign(nor.getZ(v)) * meia[2];
    q.set(THREE.MathUtils.clamp(p.x, -dentro[0], dentro[0]), THREE.MathUtils.clamp(p.y, -dentro[1], dentro[1]), THREE.MathUtils.clamp(p.z, -dentro[2], dentro[2]));
    const dir = p.clone().sub(q);
    const len = dir.length();
    if (len > 1e-6) {
      dir.multiplyScalar(1 / len);
      p.copy(q).addScaledVector(dir, rr);
      nor.setXYZ(v, dir.x, dir.y, dir.z);
    }
    pos.setXYZ(v, p.x, p.y, p.z);
  }
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
};

// Cache com contagem de uso: a mesma medida reaproveita a mesma geometria.
type Entrada = {g: THREE.BufferGeometry; usos: number; fixa: boolean};
const CACHE = new Map<string, Entrada>();
const chave = (w: number, h: number, d: number, r: number, gomos: number) => `${w.toFixed(4)}|${h.toFixed(4)}|${d.toFixed(4)}|${r.toFixed(4)}|${gomos}`;
const gomosPara = (w: number, h: number, d: number, r: number) => (r < 0.012 * Math.max(w, h, d) ? 2 : 4);

/**
 * Geometria de caixa arredondada (largura, altura, profundidade, raio da quina).
 * Fica guardada para sempre (ideal para constantes no topo do arquivo: `const G = geoCaixa(1, 1, 1, 0.05)`).
 * Não descarte a geometria que geoCaixa devolve.
 */
export const geoCaixa = (w: number, h: number, d: number, raio = 0.05, gomos?: number): THREE.BufferGeometry => {
  const gm = gomos ?? gomosPara(w, h, d, raio);
  const k = chave(w, h, d, raio, gm);
  let e = CACHE.get(k);
  if (!e) {
    e = {g: construir(w, h, d, raio, gm), usos: 0, fixa: true};
    CACHE.set(k, e);
  }
  e.fixa = true;
  return e.g;
};

/** Versão em hook (usada pela Caixa): devolve a geometria e a libera quando ninguém mais usa. */
export const useGeoCaixa = (w: number, h: number, d: number, raio: number): THREE.BufferGeometry => {
  const W = Math.max(1e-4, Math.abs(w));
  const H = Math.max(1e-4, Math.abs(h));
  const D = Math.max(1e-4, Math.abs(d));
  const gm = gomosPara(W, H, D, raio);
  const k = chave(W, H, D, raio, gm);
  const g = useMemo(() => {
    let e = CACHE.get(k);
    if (!e) {
      e = {g: construir(W, H, D, raio, gm), usos: 0, fixa: false};
      CACHE.set(k, e);
    }
    e.usos++;
    return e.g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  useEffect(
    () => () => {
      const e = CACHE.get(k);
      if (!e) return;
      e.usos--;
      if (e.usos <= 0 && !e.fixa) {
        e.g.dispose();
        CACHE.delete(k);
      }
    },
    [k],
  );
  return g;
};

// Geometrias unitárias compartilhadas (nunca descartar).
export const G = {
  esfera: new THREE.SphereGeometry(1, 32, 20),
  esferaBaixa: new THREE.SphereGeometry(1, 14, 10),
  cilindro: new THREE.CylinderGeometry(1, 1, 1, 40),
  anel: new THREE.RingGeometry(0.92, 1, 96),
  disco: new THREE.CircleGeometry(1, 64),
  plano: new THREE.PlaneGeometry(1, 1),
};
