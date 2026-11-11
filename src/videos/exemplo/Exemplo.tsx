// Vídeo de exemplo do Estúdio 3D Explicado (cerca de 10 s, fala fictícia).
// Mostra o jeito de montar um vídeo: um mundo só, câmera que nunca para, tudo disparado por quando().
import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Celular, Moeda, Onda, Palco, Particulas, Pilhas, Placa, Predio, cinematizar, enquadrar, focarEm, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Barra} from '../../base/graficos';
import {Chip, Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, type Faixa} from '../../base/som';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {criarQuando, duracaoFala, entra, rampa, sai, sumir} from '../../base/tempo';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {PALAVRAS} from './palavras';

export const FPS = 30;
export const QUADROS = Math.round((duracaoFala(PALAVRAS) + 0.9) * FPS);
const W = 1080;
const H = 1920;
const quando = criarQuando(PALAVRAS);

const T = {
  estudio: quando('Estúdio'),
  cada: quando('Cada peça'),
  hora: quando('na hora'),
  predio: quando('prédio'),
  pessoa: quando('pessoa'),
  celular: quando('celular'),
  dinheiro: quando('dinheiro'),
  barra: quando('barra'),
  importa: quando('importa'),
  cor: quando('cor'),
};

const ESTADOS: [number, string][] = [
  [0, 'EXEMPLO'],
  [T.cada, 'NA PALAVRA'],
  [T.dinheiro, 'O DINHEIRO'],
  [T.importa, 'O QUE IMPORTA'],
];

/** Sons do vídeo: mesma lista na prévia e no render final (prop `faixas`). */
export const FAIXAS: Faixa[] = [efeito('whoosh', T.cada - 0.1, 0.25), efeito('pop', T.predio, 0.3), efeito('pop', T.pessoa, 0.3), efeito('pop', T.celular, 0.3), efeito('subida', T.barra, 0.25), efeito('ding', T.importa, 0.35)];

/** Segundos sugeridos para os quadros de revisão (scripts/quadros.mjs). */
export const REVISAO: number[] = [0.4, T.estudio + 0.6, T.predio + 0.4, T.pessoa + 0.4, T.celular + 0.5, T.barra + 0.6, T.importa + 0.5, QUADROS / FPS - 0.5];

// ---------- Mapa do mundo ----------
const PREDIO: V3 = [-2.4, 0, -1.6];
const VOCE: V3 = [0, 0, 0.4];
const BARRA: V3 = [2.2, 0, 0.2];
const PILHA: V3 = [2.2, 0, 1.3];
const PLACA: V3 = [0.2, 2.95, -2.2];

// ---------- Mundo ----------
export const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const predio = entra(t, T.predio, 0.6);
  const voce = entra(t, T.pessoa, 0.5);
  const cel = entra(t, T.celular, 0.4);
  const barra = rampa(t, T.barra - 0.1, T.barra + 0.9, sai);
  const acende = rampa(t, T.importa, T.importa + 0.5);
  const placa = entra(t, T.estudio, 0.6);
  // moedas caem na pilha a partir de "dinheiro"
  const moedasCaindo = [0, 1, 2, 3].map((i) => rampa(t, T.dinheiro + i * 0.18, T.dinheiro + i * 0.18 + 0.5, Easing.in(Easing.quad)));
  const naPilha = moedasCaindo.filter((k) => k >= 1).length;
  const olhar = rampa(t, T.celular, T.celular + 0.5);
  return (
    <>
      <Particulas t={t} centro={[0, 2.2, 0]} raio={8} n={50} />
      <group position={PREDIO} scale={0.38 * predio}>
        <Predio tema={tema} pos={[0, 0, 0]} aceso={0.2 + 0.8 * acende} />
      </group>
      {placa > 0.02 ? (
        <group position={PLACA} scale={placa}>
          <Caixa args={[3.1, 0.95, 0.12]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0, -0.07]} />
          <Placa tema={tema} pos={[0, 0, 0.001]} larg={2.9} alt={0.8} linhas={[{t: 'ESTÚDIO 3D', tam: 190, cor: tema.objetoClaro, peso: 850}, {t: 'EXPLICADO', tam: 120, cor: mistura(tema.objetoClaro, tema.acento, acende), peso: 700, mono: true}]} fundo={tema.objetoEscuro} />
          {[-1.1, 1.1].map((x) => (
            <Caixa key={x} args={[0.08, 2.5, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[x, -1.7, -0.08]} />
          ))}
        </group>
      ) : null}
      <Boneco tema={tema} pos={VOCE} rotY={-0.25} escala={0.95 * voce} cor={mistura(tema.corpo, tema.acento, acende)} pose={{ombroD: [-0.75 * olhar, 0, 0.07], cotoveloD: -0.12 - 1.13 * olhar, cabeca: [0.35 * olhar, 0, 0]}}>
        {cel > 0.02 ? (
          <group position={[0.27, 1.17, 0.42]} rotation={[0.45 - 0.45 * (1 - olhar), Math.PI, 0]} scale={1.7 * cel}>
            <Celular tema={tema} pos={[0, 0, 0]} brilho={0.4 + 0.8 * olhar} />
          </group>
        ) : null}
      </Boneco>
      <Barra pos={BARRA} alt={2.0 * barra} larg={0.7} cor={mistura(tema.objeto, tema.acento, acende)} emissivo={0.3 * acende} />
      <Pilhas tema={tema} pos={PILHA} alturas={[3, 5 + naPilha]} r={0.22} destaque={acende > 0.5 ? 1 : undefined} />
      {moedasCaindo.map((k, i) =>
        k > 0 && k < 1 ? <Moeda key={i} tema={tema} pos={[PILHA[0] + 0.26, 4 - (4 - 0.3 - (5 + i) * 0.06) * k, PILHA[2]]} rot={[k * 5 + i, 0, k * 2]} r={0.22} /> : null,
      )}
      <Onda pos={VOCE} k={rampa(t, T.importa, T.importa + 1.2, Easing.linear)} cor={tema.acento} raio={1.8} />
      <Onda pos={PILHA} k={rampa(t, T.dinheiro + 0.6, T.dinheiro + 1.6, Easing.linear)} cor={tema.objetoClaro} raio={1.0} />
    </>
  );
};

// ---------- Câmera ----------
const camEm = (t: number): Cam => {
  const longe = enquadrar([0, 1.3, -0.4], 7.2, 5.2, [0.25, 0.55, 1]);
  const meio = enquadrar([0, 1.1, 0], 5.8, 3.8, [-0.35, 0.35, 1]);
  const perto = enquadrar([0.4, 1.1, 0.4], 3.6, 2.6, [0.3, 0.3, 1]);
  const fim = enquadrar([0.3, 1.2, 0], 6.4, 4.4, [0, 0.5, 1]);
  const c = trilhoCam(t, [
    [0, longe],
    [T.pessoa, meio],
    [T.dinheiro, perto],
    [T.importa, perto],
    [QUADROS / FPS, fim],
  ]);
  return cinematizar(c, t / (QUADROS / FPS), {arco: 0.25, grua: 0.05});
};

// ---------- Interface ----------
const Interface: React.FC<{t: number; cam: Cam; tema: Tema}> = ({t, cam, tema}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const ap = (a: number) => rampa(t, a - 0.05, a + 0.45, Easing.linear);
  const fora = (a: number) => 1 - rampa(t, a - 0.3, a, Easing.linear);
  const X = SEGURO.esq + 20;
  return (
    <>
      <div style={{opacity: fora(T.dinheiro)}}>
        <Etiqueta tema={tema} x={X} y={430} alvo={pj([PREDIO[0] + 0.3, 2.4, PREDIO[2]])} titulo="Prédio" sub="PEÇA PRONTA DA BASE" aparece={ap(T.predio)} />
        <Etiqueta tema={tema} x={X + 430} y={560} alvo={pj([VOCE[0], 1.75, VOCE[2]])} titulo="Você" sub="BONECO COM POSE" destaque aparece={ap(T.pessoa)} />
      </div>
      <Etiqueta tema={tema} x={X + 300} y={440} alvo={pj([BARRA[0], 2.1, BARRA[2]])} titulo="+ 40%" sub="BARRA QUE CRESCE" aparece={ap(T.barra)} destaque={t > T.importa} />
      <div style={{position: 'absolute', left: X, top: 1170, display: 'flex', gap: 14, opacity: sumir(t, T.dinheiro - 0.3, 0.3)}}>
        <Chip tema={tema} texto="NA HORA DA PALAVRA" k={entra(t, T.hora)} tam={30} />
      </div>
      <div style={{position: 'absolute', left: X, top: 1170}}>
        <Chip tema={tema} texto="O QUE IMPORTA GANHA COR" k={entra(t, T.importa)} destaque tam={30} />
      </div>
    </>
  );
};

export const Exemplo: React.FC<{guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]}> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  const foco = focarEm(cam, [VOCE[0], 1.1, VOCE[2]], 2.2, 3.5);
  const preto = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={120} sombraArea={9} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema foco={foco} raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      {mundo}
      <Interface t={t} cam={cam} tema={tema} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Exemplo" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

/** Capa (still 1080 × 1920): o mundo num instante bonito e o título grande. */
export const CapaExemplo: React.FC<{estilo?: string; titulo?: string; linha2?: string}> = ({estilo, titulo = 'COMO NASCE', linha2 = 'UM VÍDEO 3D'}) => {
  const tema = temaPorId(estilo);
  const t = T.importa + 0.8;
  const cam = cinematizar(enquadrar([0.4, 1.0, 0.4], 4.4, 3.2, [0.3, 0.35, 1], 1.1, 30, -40), 0.5);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
        <Palco tema={tema} alcance={120} sombraArea={9} />
        <Camera {...cam} />
        <Mundo t={t} tema={tema} />
        <AcabamentoCinema foco={focarEm(cam, [VOCE[0], 1.1, VOCE[2]], 2.5, 3)} raioAO={0.5} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}00 45%, ${tema.fundo}EE 78%)`}} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: 1080 - SEGURO.dir, top: 1180, textAlign: 'left'}}>
        <div style={{fontFamily: FONTE, fontSize: 118, fontWeight: 900, letterSpacing: -4, lineHeight: 0.98, color: tema.texto}}>{titulo}</div>
        <div style={{fontFamily: FONTE, fontSize: 118, fontWeight: 900, letterSpacing: -4, lineHeight: 0.98, color: tema.acento}}>{linha2}</div>
        <div style={{fontFamily: MONO, fontSize: 28, letterSpacing: 6, color: tema.textoSuave, marginTop: 26}}>{SERIE.toUpperCase()}</div>
      </div>
    </AbsoluteFill>
  );
};
