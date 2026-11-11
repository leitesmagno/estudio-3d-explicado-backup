// Estúdio 3D Explicado · legenda palavra por palavra
// Agrupa a fala em blocos curtos (até `max` palavras, quebrando em pontuação) e acende cada
// palavra na hora em que é dita. Fica dentro da área segura, com a base em LEGENDA_BAIXO.
import React, {useMemo} from 'react';
import {Easing, interpolate} from 'remotion';
import type {Tema} from './tema';
import {FONTE} from './tema';
import {LEGENDA_BAIXO, SEGURO} from './reels';
import type {Palavras} from './tempo';

export type BlocoLegenda = {palavras: {w: string; s: number; e: number}[]; ini: number; fim: number};

// palavras que não devem terminar um bloco (ficam com a palavra seguinte)
const FRACAS = new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'pro', 'pra', 'no', 'na', 'nos', 'nas', 'em', 'e', 'que', 'se', 'seu', 'sua', 'com', 'por', 'pelo', 'pela', 'ao', 'à', 'num', 'numa', 'mais', 'não', 'é', 'só', 'r$', 'para', 'até', 'mas', 'ou']);

/** Divide a fala em blocos de legenda. Pontuação final (. ? !) sempre fecha o bloco. */
export const montarBlocos = (palavras: Palavras, max = 6): BlocoLegenda[] => {
  const out: BlocoLegenda[] = [];
  let cur: Palavras = [];
  const fechar = (lista: Palavras) => {
    if (lista.length) out.push({palavras: lista, ini: lista[0].s, fim: lista[lista.length - 1].e});
  };
  palavras.forEach((p, i) => {
    cur.push(p);
    const ultima = i === palavras.length - 1;
    const fimFrase = /[.?!…]["”']?$/.test(p.w);
    const virgula = /[,;:]$/.test(p.w);
    if (ultima || fimFrase || (virgula && cur.length >= 3)) {
      fechar(cur);
      cur = [];
    } else if (cur.length >= max) {
      let corte = cur.length;
      while (corte > 2 && FRACAS.has(cur[corte - 1].w.toLowerCase())) corte--;
      fechar(cur.slice(0, corte));
      cur = cur.slice(corte);
    }
  });
  return out;
};

/**
 * Legenda do vídeo. Coloque por cima de tudo (fora do ThreeCanvas).
 * - t: tempo atual em segundos. palavras: a lista do palavras.ts. tema: estilo.
 * - tam: tamanho da letra (padrão 56). max: palavras por bloco (padrão 6).
 * - baixo: y da base da legenda (padrão LEGENDA_BAIXO). somePausa: some em pausas maiores que isso (s, padrão 1.2).
 * A palavra dita fica na cor tema.legendaAceso e dá um pulinho curto; as que faltam ficam tema.legendaApagado.
 */
export const Legenda: React.FC<{t: number; palavras: Palavras; tema: Tema; tam?: number; max?: number; baixo?: number; somePausa?: number}> = ({t, palavras, tema, tam = 56, max = 6, baixo = LEGENDA_BAIXO, somePausa = 1.2}) => {
  const blocos = useMemo(() => montarBlocos(palavras, max), [palavras, max]);
  let i = -1;
  for (let k = 0; k < blocos.length; k++) if (blocos[k].ini <= t + 0.02) i = k;
  if (i < 0) return null;
  const b = blocos[i];
  const prox = blocos[i + 1];
  // em pausa longa (sem próximo bloco logo), a legenda sai suave
  const pausa = prox ? prox.ini - b.fim : 99;
  const saida = pausa > somePausa ? interpolate(t, [b.fim + 0.5, b.fim + 0.8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  if (saida <= 0) return null;
  const ent = interpolate(t - b.ini, [0, 0.14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: SEGURO.esq, right: 1080 - SEGURO.botoesX - 14, bottom: 1920 - baixo, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - ent) * 14}px)`, opacity: (0.4 + 0.6 * ent) * saida}}>
      <div style={{maxWidth: SEGURO.botoesX + 14 - SEGURO.esq, padding: '18px 30px', borderRadius: 18, background: tema.legendaFundo, fontFamily: tema.fonte ?? FONTE, fontSize: tam, fontWeight: 700, letterSpacing: -2.9, lineHeight: 1.18, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
        {b.palavras.map((p, k) => {
          const dt = t - p.s;
          const pulo = dt >= 0 && dt < 0.18 ? Math.sin((Math.PI * dt) / 0.18) * 6 : 0;
          return (
            <React.Fragment key={k}>
              <span style={{display: 'inline-block', transform: `translateY(${-pulo}px)`, color: t >= p.s ? tema.legendaAceso : tema.legendaApagado}}>{p.w}</span>
              {k < b.palavras.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
