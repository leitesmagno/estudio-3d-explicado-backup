// Estúdio 3D Explicado · Placa (texto fixo em 3D, desenhado numa textura)
import React, {useMemo} from 'react';
import * as THREE from 'three';
import type {Tema} from '../tema';
import {FONTE, MONO} from '../tema';
import {useFontesProntas} from '../fontes';
import type {Linha, V3} from './tipos';
import {useDescartar} from './geometria';

const LARG_TEX = 1024;

const desenhar = (larg: number, alt: number, linhas: Linha[], fundo: string | undefined, padrao: string): THREE.CanvasTexture => {
  const w = LARG_TEX;
  const h = Math.max(16, Math.min(2048, Math.round((LARG_TEX * alt) / Math.max(larg, 1e-4))));
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d')!;
  if (fundo) {
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, w, h);
  } else ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // mede e encolhe o que não cabe (92% da largura e da altura)
  const fonte = (l: Linha, tam: number) => `${l.peso ?? 800} ${tam}px ${l.mono ? MONO : FONTE}`;
  const tams = linhas.map((l) => {
    ctx.font = fonte(l, l.tam);
    const largura = ctx.measureText(l.t).width;
    return largura > w * 0.92 ? (l.tam * w * 0.92) / largura : l.tam;
  });
  const vao = (i: number) => (i === 0 ? 0 : 0.22 * Math.max(tams[i], tams[i - 1]));
  let total = tams.reduce((s, tm, i) => s + tm + vao(i), 0);
  const fator = total > h * 0.92 ? (h * 0.92) / total : 1;
  total *= fator;
  let y = h / 2 - total / 2;
  linhas.forEach((l, i) => {
    const tm = tams[i] * fator;
    y += vao(i) * fator;
    ctx.font = fonte(l, tm);
    ctx.fillStyle = l.cor ?? padrao;
    ctx.fillText(l.t, w / 2, y + tm / 2 + tm * 0.04);
    y += tm;
  });
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
};

/**
 * Placa plana com texto (letreiro, tela, etiqueta física). Frente em z+.
 * - tema, pos, rot ([x, y, z] em radianos), larg × alt (unidades do mundo).
 * - linhas: lista de Linha {t, tam, cor, peso?, mono?}. tam é medido numa textura de 1024 px de largura:
 *   na placa inteira cabem cerca de 1024 / (0,6 × tam) letras por linha. Texto grande demais encolhe sozinho.
 * - fundo: cor de fundo (sem fundo, só as letras aparecem). brilho: 0 a 1, faz a placa emitir luz (telas).
 * Texto fixo por cena: se o texto mudar a cada quadro, a textura é refeita a cada quadro (evite).
 */
export const Placa: React.FC<{tema: Tema; pos: V3; rot?: V3; larg: number; alt: number; linhas: Linha[]; fundo?: string; brilho?: number; dupla?: boolean}> = ({tema, pos, rot = [0, 0, 0], larg, alt, linhas, fundo, brilho = 0.18, dupla}) => {
  const prontas = useFontesProntas();
  const chave = JSON.stringify([larg.toFixed(3), alt.toFixed(3), linhas, fundo ?? '', prontas]);
  const tex = useMemo(
    () => desenhar(larg, alt, linhas, fundo, tema.tinta),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chave, tema.tinta],
  );
  useDescartar(tex);
  return (
    <mesh position={pos} rotation={rot} scale={[larg, alt, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={brilho} roughness={0.85} metalness={0} transparent={!fundo} alphaTest={fundo ? 0 : 0.02} side={dupla ? 2 : 0} />
    </mesh>
  );
};
