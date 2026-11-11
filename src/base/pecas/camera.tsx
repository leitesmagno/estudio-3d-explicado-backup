// Estúdio 3D Explicado · câmera: dados, projeção e movimento de cinema
import React, {useLayoutEffect} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {interpolate, Easing} from 'remotion';
import type {Cam, Foco, V3} from './tipos';

const ASPECTO = 1080 / 1920;
const tmpCam = new THREE.PerspectiveCamera(30, ASPECTO, 0.05, 5000);
const tmpV = new THREE.Vector3();

const aplicar = (cam: THREE.PerspectiveCamera, c: Cam, largura: number, altura: number) => {
  cam.position.set(c.pos[0], c.pos[1], c.pos[2]);
  cam.up.set(0, 1, 0);
  cam.lookAt(c.alvo[0], c.alvo[1], c.alvo[2]);
  if (c.rolo) cam.rotateZ(c.rolo);
  cam.fov = c.fov;
  cam.aspect = largura / altura;
  const dist = Math.hypot(c.pos[0] - c.alvo[0], c.pos[1] - c.alvo[1], c.pos[2] - c.alvo[2]);
  cam.near = Math.max(0.02, dist * 0.01);
  cam.far = Math.max(600, dist * 40);
  const sobe = c.sobe ?? 0;
  if (Math.abs(sobe) > 0.01) cam.setViewOffset(largura, altura, 0, sobe * (altura / 1920), largura, altura);
  else cam.clearViewOffset();
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
};

/**
 * Leva um ponto 3D para a tela (pixels do quadro). Use para prender rótulos 2D a objetos 3D.
 * Devolve {x, y} em px (origem no canto de cima à esquerda), z = distância à frente da câmera
 * (negativo = atrás) e visivel = está dentro do quadro e na frente.
 */
export const projetar = (p: V3, cam: Cam, W = 1080, H = 1920): {x: number; y: number; z: number; visivel: boolean} => {
  aplicar(tmpCam, {...cam, sobe: 0}, W, H);
  tmpV.set(p[0], p[1], p[2]);
  const z = -tmpV.clone().applyMatrix4(tmpCam.matrixWorldInverse).z;
  tmpV.project(tmpCam);
  const x = ((tmpV.x + 1) / 2) * W;
  const y = ((1 - tmpV.y) / 2) * H - (cam.sobe ?? 0) * (H / 1920);
  return {x, y, z, visivel: z > 0 && x >= 0 && x <= W && y >= 0 && y <= H};
};

/** Põe a câmera da cena no lugar descrito por `Cam`. Use dentro do ThreeCanvas: <Camera {...cam} />. */
export const Camera: React.FC<Cam> = (c) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    aplicar(camera, c, size.width, size.height);
  });
  return null;
};

const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** Mistura duas câmeras (k = 0 dá a, k = 1 dá b). */
export const misturarCam = (a: Cam, b: Cam, k: number): Cam => ({
  pos: lerp3(a.pos, b.pos, k),
  alvo: lerp3(a.alvo, b.alvo, k),
  fov: a.fov + (b.fov - a.fov) * k,
  sobe: (a.sobe ?? 0) + ((b.sobe ?? 0) - (a.sobe ?? 0)) * k,
  rolo: (a.rolo ?? 0) + ((b.rolo ?? 0) - (a.rolo ?? 0)) * k,
});

const suave = Easing.bezier(0.45, 0, 0.2, 1);

/** Passa por câmeras-chave [tempo, Cam] com aceleração suave entre elas. */
export const trilhoCam = (t: number, chaves: [number, Cam][]): Cam => {
  if (t <= chaves[0][0]) return chaves[0][1];
  for (let i = 0; i < chaves.length - 1; i++) {
    const [ta, a] = chaves[i];
    const [tb, b] = chaves[i + 1];
    if (t <= tb) return misturarCam(a, b, interpolate(t, [ta, tb], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave}));
  }
  return chaves[chaves.length - 1][1];
};

/**
 * Enquadra uma caixa imaginária (larg × alt, em unidades do mundo) em volta do alvo,
 * olhando da direção `dir`. O objeto ocupa a faixa útil do Reels (acima da legenda).
 */
export const enquadrar = (alvo: V3, larg: number, alt: number, dir: V3 = [0, 0.35, 1], folga = 1.1, fov = 30, sobe = 60): Cam => {
  const altVisivel = Math.max(alt / 0.46, larg / (0.86 * ASPECTO)) * folga;
  const d = altVisivel / (2 * Math.tan((fov * Math.PI) / 360));
  const n = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  return {pos: [alvo[0] + (dir[0] / n) * d, alvo[1] + (dir[1] / n) * d, alvo[2] + (dir[2] / n) * d], alvo, fov, sobe};
};

export type OpcoesCinema = {
  /** Aproximação de lente ao longo da cena (0 desliga, 1 = padrão, cerca de 3,5% de zoom). */
  lente?: number;
  /** Arco em volta do alvo, em radianos, na cena inteira (padrão 0.08). */
  arco?: number;
  /** Subida da câmera, em fração da distância (padrão 0.025). */
  grua?: number;
  /** 1 gira para um lado, -1 para o outro. */
  sentido?: number;
};

/**
 * "A câmera nunca para": acrescenta um arco lento, uma leve subida e uma aproximação de lente.
 * k vai de 0 (início da cena) a 1 (fim). No meio da cena (k = 0.5) a câmera é exatamente a original.
 */
export const cinematizar = (c: Cam, k: number, op: OpcoesCinema = {}): Cam => {
  const {lente = 1, arco = 0.08, grua = 0.025, sentido = 1} = op;
  const m = Math.max(0, Math.min(1, k)) - 0.5;
  const dx = c.pos[0] - c.alvo[0];
  const dy = c.pos[1] - c.alvo[1];
  const dz = c.pos[2] - c.alvo[2];
  const dist = Math.hypot(dx, dy, dz);
  const a = sentido * arco * m;
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  const nx = dx * cs + dz * sn;
  const nz = -dx * sn + dz * cs;
  const ny = dy + grua * dist * m * 2;
  return {...c, pos: [c.alvo[0] + nx, c.alvo[1] + ny, c.alvo[2] + nz], fov: c.fov * (1 - 0.035 * lente * m * 2)};
};

/** Distância entre dois pontos. */
export const distancia = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Foco no alvo da câmera: faixa nítida = fração da distância. */
export const focoAuto = (cam: Cam, faixa = 0.3, bokeh = 4): Foco => {
  const d = distancia(cam.pos, cam.alvo);
  return {dist: d, faixa: Math.max(0.3, d * faixa), bokeh};
};

/** Foco num ponto qualquer do mundo. */
export const focarEm = (cam: Cam, p: V3, faixa: number, bokeh = 4.5): Foco => ({dist: distancia(cam.pos, p), faixa, bokeh});
