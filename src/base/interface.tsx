// Estúdio 3D Explicado · interface 2D por cima do 3D (rótulos, pílula, chips, contador, marca)
// Tudo em px do quadro 1080 × 1920. Nada pisca: só entra e sai com movimento suave.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import type {Tema} from './tema';
import {FONTE, MONO} from './tema';
import {CABECALHO, SEGURO} from './reels';
import {mistura} from './cores';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sai = Easing.out(Easing.cubic);
const k01 = (x: number) => Math.max(0, Math.min(1, x));
const fonteDe = (tema: Tema) => tema.fonte ?? FONTE;
const monoDe = (tema: Tema) => tema.fonteMono ?? MONO;

/**
 * Rótulo com linha guia: um cartão em (x, y) e uma linha fina até o ponto `alvo` (vindo de projetar()).
 * - x, y: canto de cima à esquerda do cartão (px). alvo: {x, y} em px.
 * - titulo: texto grande. sub: linha mono pequena embaixo (opcional, use MAIÚSCULAS).
 * - aparece: 0 a 1 (0 = escondido). destaque: borda, marcador e linha na cor do acento (o fundo continua o do cartão).
 * - largura: largura máxima do cartão (padrão: até a margem direita da área segura).
 */
export const Etiqueta: React.FC<{tema: Tema; x: number; y: number; alvo: {x: number; y: number}; titulo: string; sub?: string; aparece: number; destaque?: boolean; largura?: number}> = ({tema, x, y, alvo, titulo, sub, aparece, destaque, largura}) => {
  if (aparece <= 0) return null;
  const k = k01(aparece);
  const linhaK = k01(aparece * 1.6 - 0.3);
  const maxL = largura ?? Math.max(220, SEGURO.dir - x);
  const altCartao = sub ? 102 : 70;
  // ponto de saída da linha: em cima ou embaixo do cartão, perto da quina esquerda; ou na lateral mais perto do alvo
  const acimaOuAbaixo = alvo.y > y + altCartao || alvo.y < y;
  const sx = acimaOuAbaixo ? Math.max(x + 30, Math.min(alvo.x, x + 130)) : alvo.x < x ? x : x + Math.min(maxL, 360);
  const sy = alvo.y > y + altCartao ? y + altCartao : alvo.y < y ? y : y + altCartao / 2;
  const ex = sx + (alvo.x - sx) * linhaK;
  const ey = sy + (alvo.y - sy) * linhaK;
  const corLinha = destaque ? tema.acento : mistura(tema.textoSuave, tema.texto, 0.35);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity: k}}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={corLinha} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
        {linhaK > 0.95 ? <circle cx={alvo.x} cy={alvo.y} r={4} fill={corLinha} /> : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          maxWidth: maxL,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          padding: sub ? '14px 26px 16px 22px' : '14px 26px 14px 22px',
          borderRadius: 12,
          background: tema.cartao,
          border: `2px solid ${destaque ? tema.acento : tema.cartaoBorda}`,
          boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
          opacity: k,
          transform: `translateY(${(1 - k) * 18}px) scale(${0.94 + 0.06 * k})`,
          transformOrigin: 'left top',
        }}
      >
        <div style={{flex: 'none', width: 12, height: 12, borderRadius: 6, marginTop: 13, boxSizing: 'border-box', border: `2.5px solid ${destaque ? tema.acento : tema.texto}`}} />
        <div>
          <div style={{fontFamily: fonteDe(tema), fontSize: 34, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.12, color: tema.texto}}>{titulo}</div>
          {sub ? <div style={{fontFamily: monoDe(tema), fontSize: 20, fontWeight: 500, letterSpacing: 3.5, marginTop: 6, color: tema.textoSuave}}>{sub}</div> : null}
        </div>
      </div>
    </>
  );
};

/**
 * Pílula de estado no topo (em que parte do vídeo estamos). Troca de texto com um assentar suave.
 * - estado: texto (MAIÚSCULAS). t: tempo atual (s). troca: tempo (s) em que este estado começou.
 * - y: topo da pílula (padrão CABECALHO.pilula). x: esquerda (padrão SEGURO.esq).
 */
export const Pilula: React.FC<{tema: Tema; estado: string; t: number; troca: number; y?: number; x?: number}> = ({tema, estado, t, troca, y = CABECALHO.pilula, x = SEGURO.esq}) => {
  const k = interpolate(t - troca, [0, 0.35], [0, 1], {...clamp, easing: sai});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '13px 32px 13px 15px',
        borderRadius: 999,
        background: tema.pilulaFundo,
        border: `2px solid ${tema.cartaoBorda}`,
        fontFamily: monoDe(tema),
        fontSize: 31,
        fontWeight: 800,
        letterSpacing: 4,
        color: tema.pilulaTexto,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{width: 40, height: 40, borderRadius: 20, background: tema.pilulaTexto, flex: 'none'}} />
      <div style={{width: 12, height: 12, borderRadius: 6, background: tema.acento, flex: 'none'}} />
      <div style={{opacity: 0.35 + 0.65 * k, transform: `translateY(${(1 - k) * 10}px)`}}>{estado}</div>
    </div>
  );
};

/**
 * Chip: etiqueta curta em mono, em linha. Use para frases-resumo ("MESMO SALÁRIO").
 * - texto, k: 0 a 1 (entrada; aceita passar de 1 com mola). destaque: fundo no acento.
 * - tam: tamanho da letra (padrão 34). risco: 0 a 1 risca o texto. apagado: 0 a 1 esmaece.
 */
export const Chip: React.FC<{tema: Tema; texto: string; k: number; destaque?: boolean; tam?: number; risco?: number; apagado?: number}> = ({tema, texto, k, destaque, tam = 34, risco = 0, apagado = 0}) =>
  k <= 0 ? null : (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '14px 26px',
        borderRadius: 999,
        background: destaque ? tema.acento : tema.pilulaFundo,
        border: destaque ? 'none' : `2px solid ${tema.cartaoBorda}`,
        color: destaque ? tema.texto : tema.pilulaTexto,
        fontFamily: monoDe(tema),
        fontWeight: 700,
        fontSize: tam,
        letterSpacing: 3,
        opacity: Math.min(1, k * 1.5) * (1 - 0.6 * apagado),
        transform: `scale(${0.6 + 0.4 * Math.min(k, 1.2)})`,
        transformOrigin: 'left center',
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
      {risco > 0 ? <div style={{position: 'absolute', left: 18, top: '50%', height: 5, borderRadius: 3, width: `calc(${risco * 100}% - 36px)`, background: tema.acento}} /> : null}
    </div>
  );

/**
 * Número grande num cartão, centrado (contadores, valores).
 * - valor: texto grande ("44 H"). rotulo: linha mono embaixo. k: entrada 0 a 1. y: topo (padrão 430).
 */
export const Contador: React.FC<{tema: Tema; valor: string; rotulo?: string; k: number; y?: number; destaque?: boolean}> = ({tema, valor, rotulo, k, y = 430, destaque}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: SEGURO.esq, right: 1080 - SEGURO.dir, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`}}>
      <div style={{padding: '18px 40px 22px', borderRadius: 26, background: tema.cartao, border: `2px solid ${destaque ? tema.acento : tema.cartaoBorda}`, textAlign: 'center'}}>
        <div style={{fontFamily: fonteDe(tema), fontSize: 110, fontWeight: 850, letterSpacing: -4, lineHeight: 1, color: destaque ? tema.acento : tema.texto}}>{valor}</div>
        {rotulo ? <div style={{fontFamily: monoDe(tema), fontSize: 24, letterSpacing: 4, color: tema.textoSuave, marginTop: 10}}>{rotulo}</div> : null}
      </div>
    </div>
  );

/** Marca d'água da série no topo à esquerda: "EXPLICANDO DIREITO · ESCALA 6x1". */
export const Marca: React.FC<{tema: Tema; serie: string; assunto?: string; y?: number}> = ({tema, serie, assunto, y = CABECALHO.marca}) => (
  <div style={{position: 'absolute', top: y, left: SEGURO.esq + 4, fontFamily: monoDe(tema), fontSize: 24, letterSpacing: 6, color: tema.marca, whiteSpace: 'nowrap'}}>
    {serie.toUpperCase()}
    {assunto ? ` · ${assunto.toUpperCase()}` : ''}
  </div>
);
