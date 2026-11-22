import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CABECALHO, SEGURO} from '../../base/reels';
import {clamp, entra, rampa, sai, sumir} from '../../base/tempo';
import {FONTE, type Tema} from '../../base/tema';
import {LogoTinho} from '../bielatinho/Logo';

// Peças 2D comuns da série "cada peça explicada" da Tinho Auto Peças (157 em diante):
// título grande, destaque em vermelho, balão de fala, estalo (TOC!), checklist, cabeçalho com a logo,
// e o fecho: trecho do Kit Mapas (Brasil → Nova Iguaçu) com chips das peças e a logo grande.

const W = 1080;
const H = 1920;

export const Titulo: React.FC<{t: number; a: number; b: number; children: React.ReactNode; top?: number; tam?: number}> = ({t, a, b, children, top = 390, tam = 62}) => {
  const e = interpolate(t, [a, a + 0.3], [0, 1], {...clamp, easing: sai});
  const s = interpolate(t, [b - 0.25, b], [0, 1], clamp);
  const op = e * (1 - s);
  if (op <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.dir + 10, top, textAlign: 'center', opacity: op, transform: `translateY(${(1 - e) * 24}px) scale(${0.96 + 0.04 * e})`}}>
      <div style={{fontFamily: FONTE, fontWeight: 900, fontSize: tam, lineHeight: 1.05, letterSpacing: -1, color: '#FFFFFF', textTransform: 'uppercase', textShadow: '0 6px 0 rgba(5,8,30,0.85)'}}>{children}</div>
    </div>
  );
};

export const V: React.FC<{tema: Tema; children: React.ReactNode}> = ({tema, children}) => <span style={{color: tema.acento}}>{children}</span>;

export const Balao: React.FC<{tema: Tema; x: number; y: number; texto: string; k: number; cor?: string}> = ({tema, x, y, texto, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{position: 'absolute', left: Math.min(x, 700), top: Math.max(y, 560), transform: `translate(-10%, -100%) scale(${k})`, transformOrigin: '10% 100%'}}>
      <div style={{background: '#FFFFFF', borderRadius: 26, padding: '14px 28px', border: `5px solid ${tema.tinta}`, fontFamily: FONTE, fontWeight: 900, fontSize: 44, color: cor ?? tema.acento, whiteSpace: 'nowrap'}}>{texto}</div>
      <div style={{position: 'absolute', left: 30, bottom: -26, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `28px solid ${tema.tinta}`}} />
    </div>
  );

export const Estalo: React.FC<{x: number; y: number; texto: string; k: number; rot: number; cor: string; tam?: number}> = ({x, y, texto, k, rot, cor, tam = 84}) =>
  k <= 0.01 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k})`, fontFamily: FONTE, fontWeight: 900, fontSize: tam, color: cor, WebkitTextStroke: '10px #05081E', paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{texto}</div>
  );

export const Check: React.FC<{tema: Tema; texto: React.ReactNode; k: number; tam?: number}> = ({texto, k, tam = 50}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14, opacity: k, transform: `translateX(${(1 - k) * -40}px)`}}>
    <div style={{width: 56, height: 56, flex: '0 0 56px', borderRadius: 28, background: '#2FB36B', color: '#05081E', fontFamily: FONTE, fontWeight: 900, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
    <div style={{fontFamily: FONTE, fontWeight: 900, fontSize: tam, color: '#FFFFFF', textTransform: 'uppercase'}}>{texto}</div>
  </div>
);

export const Lista: React.FC<{t: number; a: number; b: number; children: React.ReactNode}> = ({t, a, b, children}) =>
  t >= a && t < b ? <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 390, opacity: 1 - rampa(t, b - 0.3, b)}}>{children}</div> : null;

export const Cabecalho: React.FC<{tema: Tema; op: number}> = ({tema, op}) =>
  op <= 0.01 ? null : (
    <div style={{position: 'absolute', top: CABECALHO.marca - 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 22px 6px 8px', borderRadius: 40, background: 'rgba(10,16,51,0.7)', border: `2px solid ${tema.acento}`}}>
        <LogoTinho tam={56} />
        <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: '#FFFFFF'}}>TINHO AUTO PEÇAS</div>
      </div>
    </div>
  );

/** Fundo do fecho: o vídeo do Kit Mapas (Brasil → Nova Iguaçu), 7,2 s. Use dentro de <Sequence from={mapa}>. */
export const TrechoMapa: React.FC<{pasta: string; dur: number}> = ({pasta, dur}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${pasta}/mapas/nova-iguacu.mp4`)} muted style={{width: W, height: H}} endAt={dur} />
    </AbsoluteFill>
  );
};

/** Chips das peças sobre o mapa e a logo grande na palavra "Chama". */
export const Fecho: React.FC<{t: number; tema: Tema; chips: [string, number][]; chama: number}> = ({t, tema, chips, chama}) => {
  const kLogo = entra(t, chama, 0.6);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.85) 0%, rgba(10,16,51,0.35) 36%, rgba(10,16,51,0) 50%, rgba(10,16,51,0) 72%, rgba(10,16,51,0.7) 100%)'}} />
      <div style={{position: 'absolute', top: 520, left: SEGURO.esq, right: W - SEGURO.dir, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
        {chips.map(([txt, a]) => {
          const k = entra(t, a, 0.35) * sumir(t, chama - 0.1, 0.3);
          return k <= 0.01 ? null : (
            <div key={txt} style={{transform: `scale(${k})`, background: tema.acento, color: '#FFFFFF', fontFamily: FONTE, fontWeight: 900, fontSize: 40, padding: '14px 26px', borderRadius: 18, textTransform: 'uppercase'}}>
              {txt}
            </div>
          );
        })}
      </div>
      {kLogo > 0.01 ? (
        <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${kLogo})`}}>
          <div style={{borderRadius: '50%', boxShadow: '0 0 60px rgba(227,38,46,0.55), 0 18px 40px rgba(0,0,0,0.6)'}}>
            <LogoTinho tam={470} />
          </div>
          <div style={{marginTop: 22, fontFamily: FONTE, fontWeight: 800, fontSize: 38, color: '#FFFFFF', background: 'rgba(10,16,51,0.8)', padding: '8px 26px', borderRadius: 14, opacity: rampa(t, chama + 0.6, chama + 1.0)}}>
            Peças para o seu carro
          </div>
        </div>
      ) : null}
    </>
  );
};

/** Capa padrão da série: logo, 4 linhas de título (a última no vermelho) e o quadro limpo embaixo. */
export const CapaSerie: React.FC<{tema: Tema; fundo: string; linhas: [string, string, string, string]; desce?: number}> = ({tema, fundo, linhas, desce = 380}) => (
  <AbsoluteFill style={{backgroundColor: tema.fundo}}>
    <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.95) 0%, rgba(10,16,51,0.6) 30%, rgba(10,16,51,0) 50%, rgba(10,16,51,0.75) 100%)'}} />
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <LogoTinho tam={170} />
    </div>
    <div style={{position: 'absolute', top: 490, left: SEGURO.esq, right: W - SEGURO.dir, textAlign: 'center', fontFamily: FONTE, fontWeight: 900, fontSize: 108, lineHeight: 1.0, color: '#FFFFFF', textShadow: '0 8px 0 rgba(5,8,30,0.9)'}}>
      {linhas[0]}
      <br />
      {linhas[1]}
      <br />
      {linhas[2]}
      <br />
      <span style={{color: tema.acento}}>{linhas[3]}</span>
    </div>
  </AbsoluteFill>
);
