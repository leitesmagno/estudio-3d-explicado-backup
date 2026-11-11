// Estúdio 3D Explicado · base/tempo
// Tudo no vídeo acontece "na palavra". O tempo é SEMPRE em SEGUNDOS (t = frame / fps).
// palavras.ts (gerado por tools/alinhar_roteiro.py) traz a lista {w, s, e} da narração.

import {Easing, interpolate} from 'remotion';

/** Uma palavra falada: texto como está no roteiro, início (s) e fim (e) em segundos. */
export type Palavra = {w: string; s: number; e: number};
/** Lista de palavras da narração. */
export type Palavras = Palavra[];
/** Mesmo que Palavras (nome antigo, mantido por compatibilidade). */
export type PALAVRAS = Palavras;

/** Normaliza para comparar: minúsculas, sem acento, só letras e números. "Constituição," vira "constituicao". */
export const normalizar = (w: string): string =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

const separar = (trecho: string) => trecho.split(/\s+/).map(normalizar).filter((x) => x.length > 0);

/**
 * Procura a n-ésima ocorrência de um trecho na fala e devolve o tempo em SEGUNDOS.
 * - `fim = false`: início da primeira palavra do trecho.
 * - `fim = true`: fim da última palavra do trecho.
 * Lança erro claro se o trecho não existir (assim o vídeo não sai com gatilho errado).
 */
export const quandoEm = (palavras: Palavras, trecho: string, n = 1, fim = false): number => {
  const norm = palavras.map((p) => normalizar(p.w));
  const alvo = separar(trecho);
  if (alvo.length === 0) throw new Error(`quando(): trecho vazio.`);
  let achou = 0;
  for (let i = 0; i <= norm.length - alvo.length; i++) {
    let igual = true;
    for (let k = 0; k < alvo.length; k++) {
      if (norm[i + k] !== alvo[k]) {
        igual = false;
        break;
      }
    }
    if (igual) {
      achou++;
      if (achou === n) return fim ? palavras[i + alvo.length - 1].e : palavras[i].s;
    }
  }
  const dica = achou > 0 ? `só existem ${achou} ocorrência(s)` : 'nenhuma ocorrência';
  throw new Error(`quando(): trecho "${trecho}" (ocorrência ${n}) não encontrado na narração: ${dica}. Confira a grafia em palavras.ts.`);
};

/**
 * Cria o quando() do vídeo, já preso às palavras dele:
 *   const quando = criarQuando(PALAVRAS);
 *   quando('Constituição')      // segundos do início da 1ª vez
 *   quando('seis dias', 2)      // 2ª vez
 *   quando('seis dias', 2, true) // fim da 2ª vez
 */
export const criarQuando = (palavras: Palavras) => (trecho: string, n = 1, fim = false): number => quandoEm(palavras, trecho, n, fim);

/** Segundos para quadros (arredonda). */
export const emQuadros = (segundos: number, fps = 30) => Math.round(segundos * fps);
/** Quadros para segundos. */
export const emSegundos = (quadros: number, fps = 30) => quadros / fps;
/** Duração da narração (fim da última palavra), em segundos. */
export const duracaoFala = (palavras: Palavras) => (palavras.length ? palavras[palavras.length - 1].e : 0);

// ---------- Curvas de animação ----------
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** Entra e sai suave (padrão). */
export const suave = Easing.bezier(0.45, 0, 0.2, 1);
/** Desacelera no fim. */
export const sai = Easing.out(Easing.cubic);
/** Passa um pouco e volta (para "nascer"). */
export const mola = Easing.out(Easing.back(1.8));
/** Acelera (queda). */
export const cai = Easing.in(Easing.quad);

/** 0 antes de a, 1 depois de b, curva no meio. */
export const rampa = (t: number, a: number, b: number, easing: (x: number) => number = suave) =>
  b <= a ? (t >= a ? 1 : 0) : interpolate(t, [a, b], [0, 1], {...clamp, easing});
/** Nasce com mola a partir de a, em d segundos. */
export const entra = (t: number, a: number, d = 0.45) => rampa(t, a, a + d, mola);
/** Some a partir de a, em d segundos (1 → 0). */
export const sumir = (t: number, a: number, d = 0.4) => 1 - rampa(t, a, a + d, sai);
/** Sobe e desce uma vez (0 → 1 → 0) entre a e a + dur. Suave, nunca pisca. */
export const pulso = (t: number, a: number, dur = 0.9) => (t < a || t > a + dur ? 0 : Math.sin((Math.PI * (t - a)) / dur));
/** Limita entre 0 e 1. */
export const k01 = (x: number) => Math.max(0, Math.min(1, x));
