// Estúdio 3D Explicado · som (narração, trilha e efeitos)
// O som do vídeo é uma LISTA de faixas. A mesma lista serve para:
//  1. tocar na prévia (Remotion Studio), com <Sons faixas={...} />;
//  2. ser mixada com ffmpeg pelo scripts/render.mjs no fim (o navegador não faz o áudio do vídeo final).
// Para isso, passe a lista também como prop `faixas` da composição (veja Root.tsx).
import React from 'react';
import {Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';

/**
 * Uma faixa de som. Caminhos relativos à pasta projetos/ (que é a pasta pública do Remotion).
 * - arquivo: ex. "001. escala 6x1/audio/narracao-norm.wav" ou "_estudio/sons/pop.wav".
 * - inicio: segundo do vídeo em que começa (padrão 0).
 * - volume: 0 a 1 (padrão 1). entrada / saida: segundos de fade no começo e no fim (padrão 0).
 * - ate: segundo do VÍDEO em que a faixa termina (corta e aplica a saída). Sem `ate`, toca até acabar ou até o fim do vídeo.
 */
export type Faixa = {arquivo: string; inicio?: number; volume?: number; entrada?: number; saida?: number; ate?: number};

/** Efeitos que vêm com o Estúdio (projetos/_estudio/sons/). Suaves, sem estalo. */
export const SONS_ESTUDIO = ['pop', 'tique', 'whoosh', 'ding', 'baque', 'subida', 'impacto', 'bip'] as const;
export type SomEstudio = (typeof SONS_ESTUDIO)[number];

/** Atalho para um efeito do Estúdio: efeito('pop', quando('44'), 0.3). */
export const efeito = (nome: SomEstudio, inicio: number, volume = 0.3): Faixa => ({arquivo: `_estudio/sons/${nome}.wav`, inicio, volume});

/** Atalho para a narração do projeto: narracao("001. escala 6x1"). Fade de saída no fim do vídeo. */
export const narracao = (pastaProjeto: string, volume = 1): Faixa => ({arquivo: `${pastaProjeto}/audio/narracao-norm.wav`, inicio: 0, volume});

/** Toca as faixas na prévia. Coloque uma vez na composição, fora do ThreeCanvas. */
export const Sons: React.FC<{faixas: Faixa[]}> = ({faixas}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <>
      {faixas.map((f, i) => {
        const de = Math.max(0, Math.round((f.inicio ?? 0) * fps));
        if (de >= durationInFrames) return null;
        const ate = f.ate !== undefined ? Math.min(durationInFrames, Math.round(f.ate * fps)) : durationInFrames;
        const dur = Math.max(1, ate - de);
        const v = f.volume ?? 1;
        const ent = (f.entrada ?? 0) * fps;
        const sai = (f.saida ?? 0) * fps;
        return (
          <Sequence key={i} from={de} durationInFrames={dur} layout="none">
            <Audio
              src={staticFile(f.arquivo)}
              volume={(q) => {
                let k = v;
                if (ent > 0) k *= interpolate(q, [0, ent], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                if (sai > 0) k *= interpolate(q, [dur - sai, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                return k;
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};
