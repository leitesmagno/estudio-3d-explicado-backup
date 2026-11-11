// Estúdio 3D Explicado · gráficos 3D
import React from 'react';
import type {V3} from './pecas/tipos';
import {Caixa} from './pecas/caixa';
import {mistura} from './cores';
import type {Tema} from './tema';

/**
 * Barra de gráfico que cresce do chão para cima (base em `pos`).
 * - alt: altura (0 some). larg: largura. prof: profundidade (padrão = larg).
 * - cor: hex. emissivo: 0 a 1. raio: quina (padrão 6% da largura).
 */
export const Barra: React.FC<{pos: V3; alt: number; larg: number; cor: string; prof?: number; emissivo?: number; raio?: number}> = ({pos, alt, larg, cor, prof, emissivo = 0, raio}) => {
  if (alt <= 0.005) return null;
  const p = prof ?? larg;
  const r = Math.min(raio ?? larg * 0.06, alt / 2);
  const h = Math.round(alt * 200) / 200; // 0,005 de passo: reaproveita geometria entre quadros
  return <Caixa args={[larg, h, p]} raio={r} cor={cor} emissivo={emissivo} position={[pos[0], pos[1] + h / 2, pos[2]]} />;
};

/**
 * Gráfico de barras pronto: lado a lado, centrado em `pos`, com chão de apoio.
 * - valores: alturas no mundo. destaque: índice que vai no acento (os outros em tema.objeto).
 * - k: 0 a 1 faz as barras crescerem em sequência. larg / espaco: medidas da barra.
 */
export const Barras: React.FC<{tema: Tema; pos: V3; valores: number[]; destaque?: number; k?: number; larg?: number; espaco?: number}> = ({tema, pos, valores, destaque, k = 1, larg = 0.6, espaco = 0.85}) => {
  const n = valores.length;
  return (
    <group position={pos}>
      <Caixa args={[n * espaco + 0.3, 0.08, larg + 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      {valores.map((v, i) => {
        const kk = Math.max(0, Math.min(1, k * n - i * 0.6));
        const cor = destaque === i ? tema.acento : mistura(tema.objeto, tema.objetoClaro, 0.15);
        return <Barra key={i} pos={[(i - (n - 1) / 2) * espaco, 0.08, 0]} alt={v * kk} larg={larg} cor={cor} emissivo={destaque === i ? 0.25 : 0} />;
      })}
    </group>
  );
};
