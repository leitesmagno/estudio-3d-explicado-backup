import React from 'react';
import {Easing, Img, interpolate, staticFile} from 'remotion';
import {CABECALHO, SEGURO} from '../../base/reels';
import {MONO} from '../../base/tema';
import type {Tema} from '../../base/tema';

// VARIAÇÃO SÓ DO 094 (Paratinga 2018-2024, parceria com o @eugeniodmr; pedido do Magno em 09/11/2026).
// Igual ao src/videos/comum/CabecalhoCidade.tsx, mas com DOIS selos empilhados (@eumagnoleite em cima,
// @eugeniodmr embaixo), cada um com a sua foto à esquerda e o @ à direita, os dois do mesmo tamanho:
// - abertura: os dois GRANDES juntos no meio, com "Siga para ver a sua cidade" embaixo dos dois;
// - depois de ~3,5 s os dois diminuem e vão juntos para o lado da pílula da cidade, empilhados;
// - final ("Sigam o @eumagnoleite e o @eugeniodmr"): saem do cabeçalho e crescem de volta para o meio.
// NÃO usar em outros vídeos (o comum continua com um selo só).

const ANEL = 'linear-gradient(45deg, rgb(254,218,117) 0%, rgb(250,126,30) 25%, rgb(214,41,118) 50%, rgb(150,47,191) 75%, rgb(79,91,213) 100%)';
const FUNDO = 'rgba(14,20,17,0.9)';
const FRASE = 'Siga para ver a sua cidade';
const PERFIS = [
  {foto: '_arte-arroba/foto-perfil.jpg', arroba: '@eumagnoleite'},
  {foto: '_arte-arroba/eugeniodmr.jpg', arroba: '@eugeniodmr'},
] as const;
const H = 70; // altura da pílula
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const arrasta = Easing.bezier(0.55, 0, 0.25, 1);
const mola = Easing.bezier(0.34, 1.4, 0.64, 1);

const larguraPilula = (cidade: string) => 15 + 40 + 18 + 12 + 18 + cidade.length * 22.8 + 32;

// selo GRANDE: altura 120, largura fixa (os dois do mesmo tamanho)
const ALT_G = 120;
const LARG_G = 560;
const VAO_G = 18; // espaço entre os dois selos grandes
const ESCALA_P = 0.42; // no cabeçalho: 120 x 0,42 = ~50 px de altura cada
const VAO_P = 6 / ESCALA_P; // ~6 px entre os dois pequenos (na escala do grupo)

const Selo: React.FC<{foto: string; arroba: string}> = ({foto, arroba}) => {
  const D = 88;
  const R = D + 14;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, width: LARG_G, height: ALT_G, boxSizing: 'border-box', padding: '0 30px 0 9px', borderRadius: ALT_G / 2, background: FUNDO, boxShadow: '0 10px 36px rgba(0,0,0,0.55)', border: '3px solid rgba(255,255,255,0.08)'}}>
      <div style={{width: R, height: R, borderRadius: R / 2, background: ANEL, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
        <div style={{width: R - 10, height: R - 10, borderRadius: (R - 10) / 2, background: 'rgb(14,20,17)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile(foto)} style={{width: D, height: D, borderRadius: D / 2, objectFit: 'cover'}} />
        </div>
      </div>
      <div style={{flex: 1, textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 48, fontWeight: 800, color: '#FFFFFF', lineHeight: 1, whiteSpace: 'nowrap'}}>{arroba}</div>
    </div>
  );
};

// grupo: dois selos empilhados + frase (que some quando o grupo diminui)
const Grupo: React.FC<{frase: number}> = ({frase}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: LARG_G}}>
    <Selo {...PERFIS[0]} />
    <div style={{height: VAO_G + (VAO_P - VAO_G) * (1 - frase)}} />
    <Selo {...PERFIS[1]} />
    <div style={{height: 18 * frase}} />
    <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 34 * frase, fontWeight: 700, color: 'rgb(150,220,180)', lineHeight: 1, whiteSpace: 'nowrap', opacity: frase, height: 38 * frase, overflow: 'hidden', textShadow: '0 2px 10px rgba(0,0,0,0.7)', padding: '0 18px', borderRadius: 19, background: `rgba(14,20,17,${0.75 * frase})`, display: 'flex', alignItems: 'center'}}>{FRASE}</div>
  </div>
);

export const CabecalhoDuplo: React.FC<{
  tema: Tema;
  cidade: string;
  t: number;
  aberturaIni?: number;
  aberturaFim?: number;
  final?: number;
  yAbertura?: number; // topo do grupo grande na abertura
  yFinal?: number; // topo do grupo grande no final
}> = ({tema, cidade, t, aberturaIni = 0.15, aberturaFim = 3.6, final = 1e9, yAbertura = 470, yFinal = 560}) => {
  const VIAGEM = 0.8;
  const xPil = SEGURO.esq;
  const yPil = CABECALHO.pilula;
  // grupo pequeno: à direita da pílula, centrado na altura dela
  const altP = (2 * ALT_G + VAO_P) * ESCALA_P;
  const xMini = xPil + larguraPilula(cidade) + 16;
  const yMini = yPil + H / 2 - altP / 2;
  const xGrande = (1080 - LARG_G) / 2;

  let p = 1;
  let yG = yAbertura;
  let aparece = 1;
  if (t < aberturaFim + VIAGEM) {
    aparece = interpolate(t, [aberturaIni, aberturaIni + 0.55], [0, 1], {...clamp, easing: mola});
    p = interpolate(t, [aberturaFim, aberturaFim + VIAGEM], [0, 1], {...clamp, easing: arrasta});
  }
  if (t >= final) {
    p = 1 - interpolate(t, [final, final + VIAGEM], [0, 1], {...clamp, easing: arrasta});
    yG = yFinal;
    aparece = 1;
  }
  const s = ESCALA_P + (1 - ESCALA_P) * (1 - p);
  const x = xGrande + (xMini - xGrande) * p;
  const y = yG + (yMini - yG) * p - Math.sin(Math.PI * p) * 40;
  const frase = 1 - Math.min(1, p * 1.6);
  // Magno (09/11/2026): selos GRANDES (abertura e "Sigam") 100% opacos; PEQUENOS no cabeçalho com 15% de transparência.
  // A transparência acompanha a viagem (p de 0 a 1), sem troca brusca.
  const op = Math.min(1, aparece * 1.4) * (1 - 0.15 * p);

  return (
    <>
      <div style={{position: 'absolute', left: xPil, top: yPil, pointerEvents: 'none'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, height: H, boxSizing: 'border-box', padding: '0 32px 0 15px', borderRadius: 999, background: tema.pilulaFundo, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 31, fontWeight: 800, letterSpacing: 4, color: tema.pilulaTexto, whiteSpace: 'nowrap'}}>
          <div style={{width: 40, height: 40, borderRadius: 20, background: tema.pilulaTexto, flex: 'none'}} />
          <div style={{width: 12, height: 12, borderRadius: 6, background: tema.acento, flex: 'none'}} />
          <div>{cidade}</div>
        </div>
      </div>
      {op > 0.01 && (
        <div style={{position: 'absolute', left: x, top: y, transformOrigin: '0 0', transform: `scale(${s * (0.75 + 0.25 * aparece)})`, opacity: op, pointerEvents: 'none'}}>
          <Grupo frase={frase} />
        </div>
      )}
    </>
  );
};

// Marca d'água quicando com os dois @ juntos (variação só do 094), pequena e sutil
const MARCA_W = 440;
const MARCA_H = 32;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
export const MarcaDaguaDupla: React.FC<{tema: Tema; t: number; W?: number; Hh?: number}> = ({tema, t, W = 1080, Hh = 1920}) => {
  const x = 24 + vaiVolta(t / 11.3) * (W - MARCA_W - 48);
  const y = 24 + vaiVolta(t / 15.7) * (Hh - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MARCA_W, height: MARCA_H, fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.16, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
      @eumagnoleite · @eugeniodmr
    </div>
  );
};
