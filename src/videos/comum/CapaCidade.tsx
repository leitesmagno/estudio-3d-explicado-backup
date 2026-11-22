import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONTE, MONO} from '../../base/tema';
import {SERIE, temaPorId} from '../../estilo';

// Capa nova (17/11/2026): o NOME DO MUNICÍPIO é o destaque, dentro da área
// que o Instagram mostra na grade do perfil (recorte 3:4 = y 240 a 1680).
// Variantes: 'topo' (cidade enorme em cima, números embaixo) e
// 'meio' (números em cima, cidade numa faixa verde no meio da maquete).

const W = 1080;
const H = 1920;
const ESQ = 70;
const LARG = W - ESQ * 2;

type Par = {rotulo: string; valor: string};

export type CapaCidadeProps = {
  estilo?: string;
  cidade: string;
  uf?: string;
  ano?: string; // não aparece mais na capa: o vídeo cobre 2024 a 2026 (pedido do Magno, 17/11)
  pares: Par[];
  fundo: string;
  variante?: 'topo' | 'meio' | 'faixa';
  mapa?: string; // svg do estado com o município (scripts/mapa_capa.py)
};

// Quebra nomes longos em 2 linhas equilibradas e acha o maior tamanho que cabe.
const linhasCidade = (nome: string): string[] => {
  const n = nome.toUpperCase();
  if (n.length <= 11 || !n.includes(' ')) return [n];
  const p = n.split(' ');
  let melhor = [n];
  let dif = Infinity;
  for (let i = 1; i < p.length; i++) {
    const a = p.slice(0, i).join(' ');
    const b = p.slice(i).join(' ');
    const d = Math.abs(a.length - b.length);
    if (d < dif) {
      dif = d;
      melhor = [a, b];
    }
  }
  return melhor;
};
const tamanho = (linhas: string[], max: number, larg = LARG) => {
  const maior = Math.max(...linhas.map((l) => l.length));
  return Math.min(max, Math.floor(larg / (maior * 0.78)));
};

const Pino: React.FC<{cor: string; s: number}> = ({cor, s}) => (
  <svg width={s} height={s * 1.3} viewBox="0 0 20 26" style={{display: 'block'}}>
    <path d="M10 0C4.5 0 0 4.4 0 9.8 0 17 10 26 10 26s10-9 10-16.2C20 4.4 15.5 0 10 0z" fill={cor} />
    <circle cx="10" cy="9.8" r="3.8" fill="#16151A" />
  </svg>
);

export const CapaCidade: React.FC<CapaCidadeProps> = ({estilo, cidade, uf = 'BAHIA', ano, pares, fundo, variante = 'topo', mapa}) => {
  const tema = temaPorId(estilo);
  const linhas = linhasCidade(cidade);
  const meio = variante === 'meio';
  const faixa = variante === 'faixa';
  const fs = tamanho(linhas, faixa ? 190 : meio ? 210 : 230, faixa ? LARG - 330 : meio ? LARG - 140 : LARG);
  const desce = meio || faixa ? 520 : 760;

  const Mapa = (lado: number) =>
    mapa ? (
      <div style={{width: lado, background: 'rgba(12,11,15,0.94)', borderRadius: 20, padding: 14, boxShadow: '0 18px 50px rgba(0,0,0,0.55)', border: '3px solid rgba(255,255,255,0.10)'}}>
        <div style={{fontFamily: MONO, fontSize: 30, fontWeight: 800, letterSpacing: 5, color: tema.acento, textAlign: 'center'}}>{uf}</div>
        <Img src={staticFile(mapa)} style={{width: lado - 28, height: lado - 28, display: 'block'}} />
      </div>
    ) : null;

  const Etiqueta = (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 34, fontWeight: 700, letterSpacing: 3, color: tema.texto, opacity: 0.85}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: tema.acento}} />
      {SERIE.toUpperCase()} · CONTAS DA PREFEITURA
    </div>
  );

  const Local = (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, background: 'transparent'}}>
      <Pino cor={tema.acento} s={40} />
      <span style={{fontFamily: FONTE, fontSize: 46, fontWeight: 800, letterSpacing: 6, color: tema.acento}}>MUNICÍPIO DE:</span>
    </div>
  );

  const Nome = (cor: string) => (
    <div>
      {linhas.map((l, k) => (
        <div key={k} style={{fontFamily: FONTE, fontSize: fs, fontWeight: 900, letterSpacing: -fs * 0.04, lineHeight: 0.92, color: cor, whiteSpace: 'nowrap'}}>
          {l}
        </div>
      ))}
    </div>
  );

  const maiorPar = Math.max(...pares.map((p) => (p.rotulo + ' ' + p.valor).trim().length));
  const fsNum = Math.min(80, Math.floor(LARG / (maiorPar * 0.56)));
  const Numeros = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {pares.map((p, k) => (
        <div key={k} style={{fontFamily: FONTE, fontSize: fsNum, fontWeight: 850, letterSpacing: -3, lineHeight: 1.05, whiteSpace: 'nowrap'}}>
          <span style={{color: tema.texto}}>{p.rotulo} </span>
          <span style={{color: tema.acento}}>{p.valor}</span>
        </div>
      ))}
    </div>
  );

  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 320}px)`}} />
      {meio || faixa ? (
        <div style={{position: 'absolute', left: ESQ, top: 290, display: 'flex', flexDirection: 'column', gap: 34}}>
          {Etiqueta}
          {Numeros}
        </div>
      ) : null}
      {meio ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
            <div style={{background: 'rgba(12,11,15,0.94)', padding: '30px 50px 34px', borderRadius: 22, borderLeft: `14px solid ${tema.acento}`, boxShadow: '0 24px 70px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: 18}}>
              {Local}
              {Nome('#FFFFFF')}
              <div style={{alignSelf: 'stretch', height: 16, background: tema.acento, borderRadius: 8}} />
            </div>
            {Mapa(linhas.length > 1 ? 440 : 470)}
          </div>
        </>
      ) : faixa ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 790, background: 'rgba(12,11,15,0.95)', borderTop: `12px solid ${tema.acento}`, borderBottom: `12px solid ${tema.acento}`, boxShadow: '0 24px 70px rgba(0,0,0,0.6)', padding: '34px 0', display: 'flex', alignItems: 'center', gap: 40, paddingLeft: ESQ}}>
          {Mapa(290)}
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {Local}
            {Nome('#FFFFFF')}
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: ESQ, right: ESQ, top: 290, display: 'flex', flexDirection: 'column', gap: 26}}>
          {Etiqueta}
          {Local}
          <div>
            {Nome('#FFFFFF')}
            <div style={{height: 16, background: tema.acento, borderRadius: 8, marginTop: 18, width: 'fit-content', minWidth: '100%'}} />
          </div>
          <div style={{marginTop: 14}}>{Numeros}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
