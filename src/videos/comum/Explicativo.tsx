import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, type Faixa} from '../../base/som';
import {clamp, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {SERIE, temaPorId} from '../../estilo';
import {SeloArroba, SeloFixo} from './SeloArroba';

// Base comum dos vídeos explicativos nacionais do @eumagnoleite (162 a 165), copiada do molde 152
// (renda básica): mesma moldura, chips, selos de fonte, rótulos presos aos objetos, marca d'água
// quicando, selo do arroba e fecho "SEGUE @eumagnoleite". Cada vídeo só entrega o mundo e os dados.

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export type Txt = {a: number; b: number; texto: string; destaque?: boolean};
export type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
export type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};

export const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
export const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
export const parado = (ini: number, fim: number, c: Cam): Cena => ({ini, chaves: [[ini, c], [fim, c]]});

export const cenaEm = (cenas: Cena[], t: number) => {
  let i = 0;
  for (let k = 0; k < cenas.length; k++) if (cenas[k].ini <= t) i = k;
  return i;
};
export const camEm = (cenas: Cena[], fim: number, t: number): Cam => {
  const i = cenaEm(cenas, t);
  const c = cenas[i];
  const f = i + 1 < cenas.length ? cenas[i + 1].ini : fim;
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (f - c.ini), {arco: c.arco ?? 0.08, grua: 0.025});
};

// trechos de mapa (Kit Mapas): [início, fim] em segundos da narração, todos num único mp4 emendado
export type Trecho = {de: number; ate: number; origem: number};
export const trechos = (tr: [number, number][]): Trecho[] => {
  const q = (s: number) => Math.round(s * FPS);
  return tr.map(([a, b], i) => ({de: q(a), ate: q(b), origem: tr.slice(0, i).reduce((s, [x, y]) => s + q(y) - q(x), 0)}));
};

const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const MARCA_W = 250;
const MARCA_H = 36;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
const MarcaDagua: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const x = 24 + vaiVolta(t / 11.3) * (W - MARCA_W - 48);
  const y = 24 + vaiVolta(t / 15.7) * (H - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MARCA_W, height: MARCA_H, fontFamily: FONTE, fontSize: 30, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.16, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
      @eumagnoleite
    </div>
  );
};

type DadosInterface = {chips: Txt[]; selos: Txt[]; rotulos: Rot[]; segue: number; arroba: number; noMapa: (t: number) => boolean; fecho?: string; semFecho?: boolean; rotuloEscala?: number};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam; d: DadosInterface}> = ({tema, t, cam, d}) => {
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 16 : 21, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = d.selos.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const chip = d.chips.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 19 : chip.texto.length > 30 ? 22 : 30} />
    </div>
  ) : null;
  const fimK = rampa(t, d.segue, d.segue + 0.4);
  const fimEl =
    !d.semFecho && t > d.segue - 0.05 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: fimK, transform: `translateY(${(1 - fimK) * 20}px)`}}>
        <div style={{padding: '24px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE</div>
          <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, d.arroba, d.arroba + 0.4)}}>@eumagnoleite</div>
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>{d.fecho ?? 'FATO, FONTE E OS DOIS LADOS'}</div>
        </div>
      </div>
    ) : null;
  if (d.noMapa(t)) return <>{selo ? seloDe(selo) : null}</>;
  const esc = d.rotuloEscala ?? 1;
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => {
    const base = txt.length > 34 ? 17 : txt.length > 26 ? 20 : 25;
    const fonte = Math.min(base * esc, 820 / (txt.length * 0.62 + 1));
    const meia = Math.min(430, (txt.length * 0.62 * fonte + 36) / 2);
    return (
      <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + meia, Math.min(SEGURO.botoesX - meia, x)), top: Math.min(1560, y), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
        <div style={{padding: `${6 * esc}px ${14 * esc}px ${7 * esc}px`, borderRadius: 12 * esc, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: fonte, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
      </div>
    );
  };
  const visRot = d.rotulos
    .map((r, i) => {
      const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel) return null;
      return {i, x: pj.x, y: Math.max(640, Math.min(1300, pj.y)), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  visRot.sort((a, b) => a.i - b.i);
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 460 * esc && Math.abs(visRot[a].y - visRot[b].y) < 56 * esc) visRot[a].y = visRot[b].y + 58 * esc;
  return (
    <>
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {fimEl}
    </>
  );
};

const TrechoMapa: React.FC<{de: number; ate: number; origem: number; src: string}> = ({de, ate, origem, src}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(src)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

export type Config = {
  pasta: string; // pasta do projeto em projetos/
  assunto: string;
  palavras: {w: string; s: number; e: number}[] | any;
  cenas: Cena[];
  fim: number;
  estados: [number, string][];
  mapas: Trecho[];
  mapaArquivo?: string; // relativo à pasta do projeto
  interface: DadosInterface;
  Mundo: React.FC<{t: number; tema: Tema}>;
  frase?: string;
  arrobaFixo?: boolean; // @ pequeno no topo o vídeo todo e o selo grande de volta no fim (232, pedido do Magno 18/11/2026)
  semMarca?: boolean; // vídeo sem nenhuma marca do perfil: sem série, @, selo, marca d'água nem fecho SEGUE (234, pedido de 19/11/2026)
  serie?: string; // texto do cabeçalho no lugar da série quando semMarca
};

export type PropsVideo = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};

export const VideoExplicativo: React.FC<PropsVideo & {c: Config}> = ({guia, semInterface, estilo, faixas = [], c}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(c.cenas, t);
  const ini = c.cenas[i].ini;
  let e = 0;
  for (let k = 0; k < c.estados.length; k++) if (c.estados[k][0] <= t) e = k;
  const cam = camEm(c.cenas, c.fim, t);
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const Mundo = c.Mundo;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={220} sombraArea={24} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {c.mapas.map((m, k) => (
        <Sequence key={k} from={m.de} durationInFrames={m.ate - m.de} layout="none">
          <TrechoMapa {...m} src={`${c.pasta}/${c.mapaArquivo ?? 'mapas/mapa.mp4'}`} />
        </Sequence>
      ))}
      <Interface t={t} tema={tema} cam={cam} d={c.arrobaFixo || c.semMarca ? {...c.interface, semFecho: true} : c.interface} />
      {c.semMarca ? (c.serie ? <Marca tema={tema} serie={c.serie} /> : null) : <Marca tema={tema} serie={SERIE} assunto={c.assunto} />}
      <Pilula tema={tema} estado={c.estados[e][1]} t={t} troca={c.estados[e][0]} />
      <Legenda t={t} palavras={c.palavras} tema={tema} />
      {c.semMarca ? null : <SeloArroba t={t} frase={c.frase ?? 'siga para entender a notícia'} y={600} />}
      {c.arrobaFixo && !c.semMarca ? (
        <>
          <SeloFixo t={t} ini={4.4} ate={c.interface.segue} />
          <SeloArroba t={t} ini={c.interface.segue} fim={c.fim + 5} frase={c.frase ?? 'siga para entender a notícia'} y={600} />
        </>
      ) : null}
      {c.semMarca ? null : <MarcaDagua tema={tema} t={t} />}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const CapaExplicativa: React.FC<{estilo?: string; linhas: string[]; fundo: string; desce?: number; pilula: string; acentoDe?: number; semMarca?: boolean}> = ({estilo, linhas, fundo, desce = 470, pilula, acentoDe = 2, semMarca}) => {
  const tema = temaPorId(estilo);
  const tam = 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={semMarca ? pilula : `${SERIE} · ${pilula}`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k >= acentoDe ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
