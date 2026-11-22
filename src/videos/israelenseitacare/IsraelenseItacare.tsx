import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, BalancaJustica, CalendarioGrande, CameraTV, Casinha, CelularMao, DocumentoGrande, Lojinha, Lupa, Mar, MarcoAno, Megafone, OrgaoPublico, PilhaMoedas, Sobrado, Sol} from '../../pecas';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 148. israelenses em itacaré (perfil @eumagnoleite, série Magno Explica). Vídeo regional, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/148.../mapas/israelenses.mp4, composição IsraelensesItacare do kit: 5 trechos).
// Tom informativo: denúncia, ocorrência e investigação, nada de crime provado; o outro lado com fala própria;
// a posição do Magno só no fim, como opinião, e contra culpar um povo inteiro. Bonecos genéricos, sem rosto,
// sem símbolo religioso ou nacional; turistas e moradores com cores neutras.
// Fontes: projetos/148. israelenses em itacaré/audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 134.15;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '148. israelenses em itacaré';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  noticia: quando('virou notícia'),
  praia: quando('E não foi'),
  moradores: quando('Moradores denunciam'),
  agem: quando('e agem como'),
  fui: quando('Eu fui atrás'),
  vem: quando('Vem comigo'),
  quem: quando('Primeiro, quem'),
  serie: quando('Uma série'),
  malabi: quando('Malabi'),
  gravada: quando('gravada em'),
  agora: quando('Agora, as denúncias'),
  uma: quando('Uma por uma'),
  marco: quando('Março deste'),
  homem: quando('Um homem tomou'),
  jogou: quando('jogou no'),
  nariz: quando('Ela teve'),
  virou: quando('Virou ocorrência'),
  dia14: quando('Dia 14'),
  pro: quando('um ato pró-Palestina'),
  favor: quando('um ato a favor'),
  xinga: quando('Teve xingamento'),
  tres: quando('Três homens'),
  liberados: quando('e liberados'),
  out30: quando('30 de outubro'),
  pintou: quando('Um grupo pintou'),
  bahia: quando('"A Bahia'),
  rio: quando('"Do rio'),
  noite: quando('À noite'),
  tirar: quando('tentar tirar'),
  praca: quando('Quem estava'),
  vaia: quando('saíram sob'),
  outroLado: quando('Agora o outro'),
  conib: quando('A Confederação'),
  condenou: quando('condenou dano'),
  mas: quando('Mas disse'),
  defender: quando('E que defender'),
  dono: quando('O dono'),
  apagar: quando('mandou apagar'),
  ibi: quando('E o Instituto'),
  maioria: quando('a maioria apoia'),
  enchem: quando('que enchem'),
  mau: quando('Mau comportamento'),
  soDe: quando('não é só'),
  pref: quando('A prefeitura'),
  assunto: quando('e que Israel'),
  repudiou: quando('Repudiou'),
  repara: quando('Agora repara'),
  governo: quando('O governo'),
  ninguem: quando('Ninguém foi'),
  entao: quando('Então, minha'),
  lado: quando('eu fico do'),
  turista: quando('Turista é'),
  respeita: quando('Mas quem chega'),
  culpar: quando('E culpar'),
  errou: quando('quem errou'),
  prova: quando('com prova'),
  voce: quando('E você'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'ITACARÉ'],
  [T.quem, 'QUEM SÃO'],
  [T.agora, 'AS DENÚNCIAS'],
  [T.outroLado, 'O OUTRO LADO'],
  [T.pref, 'A PREFEITURA'],
  [T.repara, 'O GOVERNO'],
  [T.entao, 'MINHA POSIÇÃO'],
];

// ---------- Os trechos de mapa (Kit Mapas): mesmos tempos do roteiro.ts do kit ----------
const q = (s: number) => Math.round(s * FPS);
const TR: [number, number][] = [
  [9.44, 19.62],
  [22.6, 35.98],
  [38.38, 43.3],
  [59.02, 62.3],
  [106.6, 113.16],
];
const MAPAS = TR.map(([a, b], i) => ({de: q(a), ate: q(b), origem: TR.slice(0, i).reduce((s, [x, y]) => s + q(y) - q(x), 0)}));
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

// ---------- Mapa do mundo ----------
const VILA: V3 = [0, 0, 0];
const SER: V3 = [12, 0, 0];
const DEN: V3 = [22, 0, 0];
const PIT: V3 = [32, 0, 0];
const ATO: V3 = [42, 0, 0];
const CAS: V3 = [53, 0, 0];
const CON: V3 = [64, 0, 0];
const IBI: V3 = [74, 0, 0];
const PREF: V3 = [84, 0, 0];
const FATO: V3 = [94, 0, 0];

const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

// a vila de praia: areia, mar ao fundo, casinhas, coqueiros e sol
const VilaPraia: React.FC<{tema: Tema; pos: V3; k: number; t: number}> = ({tema, pos, k, t}) => {
  if (k < 0.02) return null;
  const festa = tema.festa!;
  return (
    <group position={pos}>
      <Caixa args={[13, 0.04, 4.2]} raio={0.02} cor={mistura(festa.loiro, tema.chao, 0.45)} position={[0, 0.02, -2.6]} sombra={false} />
      <Caixa args={[18, 0.02, 10]} raio={0.005} cor={mistura(festa.azul, tema.fundo, 0.3)} position={[0, 0.01, -9.6]} sombra={false} />
      <Mar tema={tema} x0={-8} x1={8} z0={-14} z1={-4.6} t={t} />
      <Sol tema={tema} pos={[4.5, 5.2, -13]} escala={0.9 * k} />
      {[-4.6, -3.2, 3.2, 4.6].map((x, i) => (
        <Casinha key={i} tema={tema} pos={[x, 0, -0.6 - 0.5 * (i % 2)]} cor={i % 2 ? tema.objetoClaro : mistura(festa.turquesa, tema.objeto, 0.55)} escala={0.8 * k} />
      ))}
      {[-5.6, -2.0, 2.0, 5.6].map((x, i) => (
        <ArvoreRedonda key={`a${i}`} tema={tema} pos={[x, 0, -3.4 - 0.3 * (i % 2)]} r={0.45} cresce={k} />
      ))}
    </group>
  );
};

const Grupo: React.FC<{tema: Tema; pos: V3; n: number; k: number; cor: string; rotY?: number; anda?: number; t: number; abre?: number}> = ({tema, pos, n, k, cor, rotY = 0, anda = 0, t, abre = 0.55}) =>
  k < 0.02 ? null : (
    <group position={pos}>
      {Array.from({length: n}, (_, i) => (
        <Boneco key={i} tema={tema} pos={[(i - (n - 1) / 2) * abre, 0, 0.35 * (i % 2)]} rotY={rotY + 0.08 * ((i % 3) - 1)} escala={0.55 * k} cor={i % 3 === 1 ? mistura(cor, tema.objetoClaro, 0.25) : cor} pose={{passo: anda ? Math.sin(t * 8 + i) * anda : 0}} />
      ))}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const morador = tema.pessoa;
  const turista = tema.objetoClaro;

  // ----- Cena 1: a vila, moradores e turistas -----
  const vilaK = entra(t, 0, 0.6) * (1 - rampa(t, T.quem, T.quem + 0.4)) + entra(t, T.entao - 0.3, 0.6);
  const abertura = t < T.quem + 0.5;
  const chegam = rampa(t, T.moradores - 0.4, T.agem + 0.6);
  const lupaK = entra(t, T.fui, 0.45) * (1 - rampa(t, T.quem, T.quem + 0.3));

  // ----- Cena 2: a série de TV de 2013 -----
  const serK = vis(t, T.serie - 0.3, T.gravada + 0.2);

  // ----- Cena 3: as três denúncias numa linha do tempo -----
  const denK = vis(t, T.agora - 0.3, T.marco);
  const marcos = [0, 1, 2].map((i) => entra(t, T.uma + 0.15 * i - 0.2, 0.4));

  // ----- Cena 4: Rua da Pituba -----
  const pitK = vis(t, T.homem - 0.3, T.dia14);
  const voa = rampa(t, T.jogou - 0.1, T.jogou + 0.5);
  const ocoK = entra(t, T.virou - 0.1, 0.45);

  // ----- Cena 5: 14 de março, os dois atos -----
  const atoK = vis(t, T.dia14 - 0.3, T.out30);
  const proK = entra(t, T.pro - 0.1, 0.45);
  const favK = entra(t, T.favor - 0.1, 0.45);
  const polK = entra(t, T.tres - 0.2, 0.5);

  // ----- Cena 6: o Casarão Azul e o mural -----
  const casK = vis(t, T.pintou - 0.4, T.conib) + vis(t, T.dono - 0.3, T.ibi);
  const muralK = entra(t, T.pintou, 0.5) * (1 - rampa(t, T.apagar, T.apagar + 1.2));
  const noite = rampa(t, T.noite - 0.2, T.noite + 0.6) * (1 - rampa(t, T.outroLado - 0.2, T.outroLado + 0.2));
  const vem = rampa(t, T.noite, T.tirar + 0.4);
  const recua = rampa(t, T.vaia - 0.2, T.vaia + 1.2);
  const pracaK = entra(t, T.praca - 0.2, 0.5) * (1 - rampa(t, T.outroLado - 0.3, T.outroLado));
  const tur7 = entra(t, T.noite - 0.1, 0.5) * (1 - rampa(t, T.outroLado - 0.3, T.outroLado));

  // ----- Cena 7: CONIB -----
  const conK = vis(t, T.outroLado - 0.3, T.dono);
  const orgCon = entra(t, T.conib - 0.2, 0.6);
  const balCon = entra(t, T.defender - 0.2, 0.5);

  // ----- Cena 8: comércio (Instituto Brasil-Israel) -----
  const ibiK = vis(t, T.ibi - 0.3, T.pref);
  const lojaK = entra(t, T.maioria - 0.3, 0.5);
  const moedas = rampa(t, T.enchem - 0.2, T.mau);

  // ----- Cena 9: prefeitura -----
  const prefK = vis(t, T.pref - 0.3, T.governo);

  // ----- Cena 10: o status -----
  const fatoK = vis(t, T.ninguem - 0.3, T.entao);

  // ----- Cena 11: minha posição (volta à vila) -----
  const fimK = entra(t, T.entao - 0.3, 0.6);
  const balFim = entra(t, T.errou - 0.2, 0.5);

  return (
    <group>
      <Caixa args={[110, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[47, 0.02, 3.8]} sombra={false} />

      {/* Cena 1 e 11: a vila */}
      <VilaPraia tema={tema} pos={VILA} k={Math.min(1, vilaK)} t={t} />
      {abertura ? (
        <>
          <Grupo tema={tema} pos={soma(VILA, [-1.6, 0, 1.0])} n={4} k={entra(t, T.moradores - 0.3, 0.5)} cor={morador} rotY={0.5} t={t} />
          <Grupo tema={tema} pos={soma(VILA, [1.4 + 3.0 * (1 - chegam), 0, 1.2])} n={3} k={entra(t, T.praia, 0.5)} cor={turista} rotY={-0.6 - (chegam < 1 ? 0.9 : 0)} anda={chegam > 0 && chegam < 1 ? 1 : 0} t={t} />
          <Megafone tema={tema} pos={soma(VILA, [-1.6, 1.5, 1.6])} rot={[0, 0.4, 0.3]} escala={0.5 * entra(t, T.moradores, 0.4) * (1 - rampa(t, T.fui, T.fui + 0.3))} />
          <Lupa tema={tema} pos={soma(VILA, [0.2 + 0.3 * Math.sin(t * 1.6), 1.4, 2.0])} rot={[0.4, 0, 0.3]} escala={0.7 * lupaK} />
        </>
      ) : null}
      {t > T.entao - 0.5 ? (
        <>
          <Grupo tema={tema} pos={soma(VILA, [-1.7, 0, 1.0])} n={4} k={fimK} cor={morador} rotY={0.45} t={t} />
          <Grupo tema={tema} pos={soma(VILA, [1.7, 0, 1.0])} n={3} k={fimK * entra(t, T.turista - 0.3, 0.5)} cor={turista} rotY={-0.45} t={t} />
          <BalancaJustica tema={tema} pos={soma(VILA, [0, 0, -0.4])} escala={0.85 * balFim} inclina={0} brilhoEsq={pulso(t, T.prova, 1.2)} brilhoDir={pulso(t, T.prova, 1.2)} />
        </>
      ) : null}

      {/* Cena 2: a série */}
      {serK > 0.02 ? (
        <group>
          <CameraTV tema={tema} pos={soma(SER, [-1.6, 0, 0.6])} rotY={0.6} escala={0.9 * serK} />
          <CalendarioGrande tema={tema} pos={soma(SER, [1.2, 0, 0.4])} texto="2013" sub="SÉRIE DE TV" folha={serK} escala={0.75 * serK} destaque={pulso(t, T.malabi, 1.0)} />
        </group>
      ) : null}

      {/* Cena 3: as três denúncias */}
      {['MARÇO', '14 DE MARÇO', '30 DE OUTUBRO'].map((n, i) => (
        <MarcoAno key={n} tema={tema} pos={soma(DEN, [-2.4 + 2.4 * i, 0, 1.0])} ano={n} k={denK * marcos[i]} aceso={pulso(t, T.uma + 0.15 * i, 1.0)} />
      ))}
      {denK > 0.02 ? <Caixa args={[5.2 * rampa(t, T.uma - 0.2, T.uma + 0.6), 0.05, 0.16]} raio={0.02} cor={tema.acento} emissivo={0.35} position={soma(DEN, [-2.4 + 2.6 * rampa(t, T.uma - 0.2, T.uma + 0.6), 0.04, 1.0])} sombra={false} /> : null}

      {/* Cena 4: Rua da Pituba */}
      {pitK > 0.02 ? (
        <group>
          {[-2.6, -1.9, -1.2].map((x, i) => (
            <group key={i} position={soma(PIT, [x, 0, -0.6])} scale={pitK}>
              <Caixa args={[0.45, 0.4 * (1 - 0.6 * rampa(t, T.homem - 1.2 + 0.2 * i, T.homem - 0.8 + 0.2 * i)), 0.45]} raio={0.06} cor={mistura(festa.loiro, tema.objetoEscuro, 0.4)} position={[0, 0.2, 0]} />
              <ArvoreRedonda tema={tema} pos={[0, 0.3, 0]} r={0.22} cresce={1 - rampa(t, T.homem - 1.2 + 0.2 * i, T.homem - 0.8 + 0.2 * i)} />
            </group>
          ))}
          <Boneco tema={tema} pos={soma(PIT, [0.2, 0, 0.8])} rotY={-0.5} escala={0.75 * pitK} cor={morador} pose={{ombroD: [-1.4, 0, 0.1], cotoveloD: -0.6}} />
          <Boneco tema={tema} pos={soma(PIT, [1.8, 0, 0.6])} rotY={-1.2} escala={0.75 * pitK * entra(t, T.homem - 0.1, 0.4)} cor={turista} />
          <CelularMao tema={tema} pos={soma(PIT, [0.2 + 1.4 * (1 - voa) * rampa(t, T.homem + 0.3, T.jogou - 0.1), 1.25 - 0.1 * voa, 1.05])} rot={[0, -0.5, 6 * voa]} cor={festa.azul} brilho={0.6} />
          <Caixa args={[1.5, 0.5, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(PIT, [-1.6, 0.25, 1.6])} scale={[ocoK * pitK, ocoK * pitK, ocoK * pitK]} />
          <DocumentoGrande tema={tema} pos={soma(PIT, [-1.6, 0.55, 1.6])} rot={[-0.9, 0.2, 0]} escala={0.7 * ocoK * pitK} />
        </group>
      ) : null}

      {/* Cena 5: 14 de março */}
      <CalendarioGrande tema={tema} pos={soma(ATO, [0, 0, -1.2])} texto="14" sub="MARÇO 2026" folha={atoK} escala={0.75 * atoK} destaque={pulso(t, T.dia14, 1.0)} />
      <Grupo tema={tema} pos={soma(ATO, [-2.4, 0, 0.8])} n={4} k={atoK * proK} cor={morador} rotY={0.6} t={t} />
      <Grupo tema={tema} pos={soma(ATO, [2.4, 0, 0.8])} n={4} k={atoK * favK} cor={turista} rotY={-0.6} t={t} />
      <OrgaoPublico tema={tema} pos={soma(ATO, [3.6, 0, -2.4])} escala={0.5} sobe={polK * atoK} letreiro={polK * atoK} porta={rampa(t, T.liberados, T.liberados + 0.8)} texto="POLÍCIA" />

      {/* Cena 6: o casarão */}
      {casK > 0.02 ? (
        <group>
          <Sobrado tema={tema} pos={soma(CAS, [0, 0, -1.6])} larg={4.4} alt={2.8} prof={2.0} sobe={Math.min(1, casK)} luz={0.6 * noite} cor={mistura(festa.azul, tema.objetoEscuro, 0.15 + 0.35 * noite)} />
          {muralK > 0.02 ? (
            <Placa tema={tema} pos={soma(CAS, [0, 1.3, -0.3])} larg={3.9 * muralK} alt={1.15} linhas={[{t: '"A BAHIA É DOS BRASILEIROS"', tam: 74, cor: tema.objetoClaro, peso: 900}, {t: '"DO RIO AO MAR"', tam: 96, cor: festa.loiro, peso: 900}]} fundo={mistura(festa.azul, tema.objetoEscuro, 0.45)} brilho={0.25} />
          ) : null}
          <Grupo tema={tema} pos={soma(CAS, [2.2 + 3.2 * (1 - vem) + 3.6 * recua, 0, 0.6])} n={7} k={tur7} cor={turista} rotY={recua > 0 && recua < 1 ? Math.PI / 2 : -Math.PI / 2 + 0.3} anda={(vem > 0 && vem < 1) || (recua > 0 && recua < 1) ? 1 : 0} t={t} abre={0.42} />
          <Grupo tema={tema} pos={soma(CAS, [-2.4, 0, 1.4])} n={6} k={pracaK} cor={morador} rotY={0.7} t={t} abre={0.45} />
        </group>
      ) : null}

      {/* Cena 7: CONIB */}
      <OrgaoPublico tema={tema} pos={soma(CON, [0, 0, -1.8])} escala={0.75} sobe={orgCon * conK} letreiro={orgCon * conK} texto="CONIB" />
      <BalancaJustica tema={tema} pos={soma(CON, [0, 0, 1.0])} escala={0.75 * balCon * conK} inclina={0.18 * Math.sin(t * 1.2)} brilhoEsq={pulso(t, T.defender + 0.4, 1.2)} brilhoDir={pulso(t, T.defender + 0.4, 1.2)} />

      {/* Cena 8: o comércio */}
      {ibiK > 0.02 ? (
        <group>
          <Lojinha tema={tema} pos={soma(IBI, [-1.8, 0, -0.8])} escala={0.9 * lojaK * ibiK} toldo={lojaK} />
          <Sobrado tema={tema} pos={soma(IBI, [1.8, 0, -1.4])} larg={2.4} alt={2.0} prof={1.6} sobe={lojaK * ibiK} luz={0.4} cor={mistura(festa.turquesa, tema.objeto, 0.5)} />
          {[0, 1, 2].map((i) => (
            <PilhaMoedas key={i} tema={tema} pos={soma(IBI, [-0.6 + 0.6 * i, 0, 1.4])} n={Math.max(1, Math.round(9 * moedas * (0.6 + 0.2 * i)))} cor={festa.dourado} r={0.22} escala={ibiK} />
          ))}
          <Grupo tema={tema} pos={soma(IBI, [2.6, 0, 1.2])} n={3} k={ibiK * entra(t, T.enchem, 0.5)} cor={turista} rotY={-0.8} t={t} />
        </group>
      ) : null}

      {/* Cena 9: prefeitura */}
      <OrgaoPublico tema={tema} pos={soma(PREF, [0, 0, -1.4])} escala={0.85} sobe={prefK} letreiro={prefK} porta={rampa(t, T.repudiou, T.repudiou + 0.8)} texto="ITACARÉ" />

      {/* Cena 10: o status */}
      {['OCORRÊNCIA', 'INVESTIGAÇÃO', 'CONDENAÇÃO'].map((n, i) => (
        <MarcoAno key={n} tema={tema} pos={soma(FATO, [-2.2 + 2.2 * i, 0, 1.2])} ano={n} k={fatoK * entra(t, T.ninguem - 0.3 + 0.12 * i, 0.4)} aceso={i < 2 ? 1 : 0} />
      ))}
      <BalancaJustica tema={tema} pos={soma(FATO, [0, 0, -1.4])} escala={0.9 * fatoK} inclina={0} brilhoEsq={0} brilhoDir={0} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const parado = (ini: number, fim: number, c: Cam): Cena => ({ini, chaves: [[ini, c], [fim, c]]});
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(VILA, [0, 0.6, -4.0]), 13.0, 9.0, [0, 0.62, 1])], [T.moradores, E(soma(VILA, [0, 0.9, 0]), 8.4, 6.0, [0.08, 0.5, 1])], [T.fui, E(soma(VILA, [0, 1.0, 1.0]), 6.4, 4.8, [0.02, 0.42, 1])], [T.quem - 0.1, E(soma(VILA, [0.2, 1.0, 1.4]), 5.0, 4.0, [-0.04, 0.4, 1])]]},
  parado(T.quem, T.serie, E(soma(VILA, [0.2, 1.1, 1.6]), 5.0, 4.0, [-0.04, 0.34, 1])),
  {ini: T.serie, chaves: [[T.serie, E(soma(SER, [-0.2, 1.2, 0.4]), 6.4, 4.6, [0.12, 0.28, 1])], [T.gravada, E(soma(SER, [0.4, 1.1, 0.4]), 5.4, 4.2, [0.02, 0.3, 1])]]},
  parado(T.gravada, T.agora, E(soma(SER, [0.4, 1.1, 0.4]), 5.4, 4.2, [0.02, 0.3, 1])),
  {ini: T.agora, chaves: [[T.agora, E(soma(DEN, [0, 1.2, 1.0]), 8.6, 5.2, [0.08, 0.3, 1])], [T.marco - 0.1, E(soma(DEN, [0, 1.2, 1.0]), 7.6, 4.8, [-0.04, 0.3, 1])]]},
  parado(T.marco, T.homem, E(soma(DEN, [0, 1.2, 1.0]), 7.6, 4.8, [-0.04, 0.3, 1])),
  {ini: T.homem, chaves: [[T.homem, E(soma(PIT, [0.6, 1.2, 0.6]), 6.0, 4.4, [0.12, 0.28, 1])], [T.jogou, E(soma(PIT, [0.4, 1.2, 0.8]), 4.6, 3.8, [0.04, 0.28, 1])], [T.virou, E(soma(PIT, [-0.6, 1.1, 1.2]), 6.4, 4.4, [-0.04, 0.32, 1])], [T.dia14 - 0.1, E(soma(PIT, [-0.8, 1.1, 1.2]), 6.2, 4.4, [-0.08, 0.32, 1])]]},
  {ini: T.dia14, chaves: [[T.dia14, E(soma(ATO, [0, 1.4, -0.8]), 5.6, 4.4, [0.08, 0.28, 1])], [T.pro, E(soma(ATO, [-1.0, 1.2, 0.4]), 7.8, 5.0, [0.06, 0.28, 1])], [T.favor, E(soma(ATO, [0, 1.2, 0.4]), 9.0, 5.4, [0, 0.28, 1])], [T.tres, E(soma(ATO, [1.8, 1.4, -0.6]), 7.4, 5.0, [-0.05, 0.28, 1])], [T.out30 - 0.1, E(soma(ATO, [2.2, 1.4, -0.8]), 6.8, 4.8, [-0.08, 0.28, 1])]]},
  parado(T.out30, T.pintou, E(soma(ATO, [2.2, 1.4, -0.8]), 6.8, 4.8, [-0.08, 0.28, 1])),
  {ini: T.pintou, chaves: [[T.pintou, E(soma(CAS, [0, 1.6, -0.6]), 6.0, 4.6, [0.1, 0.22, 1])], [T.bahia, E(soma(CAS, [0, 1.4, -0.6]), 4.6, 3.8, [0.02, 0.2, 1])], [T.noite, E(soma(CAS, [0.6, 1.3, 0]), 8.0, 5.2, [-0.04, 0.26, 1])], [T.praca, E(soma(CAS, [-0.2, 1.3, 0.4]), 9.4, 5.6, [0.05, 0.28, 1])], [T.outroLado - 0.1, E(soma(CAS, [1.0, 1.3, 0.4]), 9.6, 5.6, [-0.05, 0.28, 1])]]},
  {ini: T.outroLado, chaves: [[T.outroLado, E(soma(CON, [0, 1.6, -0.8]), 7.4, 5.2, [0.08, 0.28, 1])], [T.conib, E(soma(CON, [0, 1.5, -1.2]), 6.0, 4.8, [0.04, 0.26, 1])], [T.mas, E(soma(CON, [0, 1.3, -0.4]), 6.4, 4.8, [0, 0.28, 1])], [T.defender, E(soma(CON, [0, 1.1, 0.8]), 5.0, 4.2, [-0.03, 0.3, 1])], [T.dono - 0.1, E(soma(CON, [0, 1.1, 0.8]), 4.8, 4.0, [-0.06, 0.3, 1])]]},
  {ini: T.dono, chaves: [[T.dono, E(soma(CAS, [0, 1.5, -0.6]), 6.0, 4.6, [0.08, 0.22, 1])], [T.apagar, E(soma(CAS, [0, 1.4, -0.6]), 4.8, 3.9, [0, 0.2, 1])], [T.ibi - 0.1, E(soma(CAS, [0, 1.4, -0.6]), 4.6, 3.8, [-0.04, 0.2, 1])]]},
  {ini: T.ibi, chaves: [[T.ibi, E(soma(IBI, [0, 1.3, -0.4]), 8.0, 5.2, [0.1, 0.28, 1])], [T.enchem, E(soma(IBI, [0, 1.1, 0.6]), 6.6, 4.6, [0.03, 0.3, 1])], [T.mau, E(soma(IBI, [0.4, 1.2, 0.4]), 7.4, 5.0, [-0.04, 0.3, 1])], [T.pref - 0.1, E(soma(IBI, [0.4, 1.2, 0.4]), 7.2, 5.0, [-0.07, 0.3, 1])]]},
  {ini: T.pref, chaves: [[T.pref, E(soma(PREF, [0, 1.7, -1.2]), 6.6, 5.2, [0.08, 0.26, 1])], [T.repudiou, E(soma(PREF, [0, 1.5, -0.8]), 5.8, 4.8, [0, 0.26, 1])], [T.governo - 0.1, E(soma(PREF, [0, 1.5, -0.8]), 5.6, 4.6, [-0.05, 0.26, 1])]]},
  parado(T.governo, T.ninguem, E(soma(PREF, [0, 1.5, -0.8]), 5.6, 4.6, [-0.05, 0.26, 1])),
  {ini: T.ninguem, chaves: [[T.ninguem, E(soma(FATO, [0, 1.3, 0]), 8.0, 5.2, [0.06, 0.3, 1])], [T.entao - 0.1, E(soma(FATO, [0, 1.3, 0.4]), 7.4, 5.0, [-0.04, 0.3, 1])]]},
  {ini: T.entao, chaves: [[T.entao, E(soma(VILA, [0, 0.6, -4.0]), 13.0, 9.0, [0, 0.62, 1])], [T.lado, E(soma(VILA, [-1.4, 1.0, 0.6]), 6.4, 4.8, [0.1, 0.42, 1])], [T.turista, E(soma(VILA, [0.4, 1.0, 0.8]), 7.8, 5.4, [0, 0.42, 1])], [T.errou, E(soma(VILA, [0, 1.0, 0.4]), 6.4, 4.8, [0, 0.4, 1])], [T.voce, E(soma(VILA, [0, 0.8, -2.0]), 11.0, 7.6, [0, 0.55, 1])], [FIM, E(soma(VILA, [0, 0.6, -3.0]), 12.6, 8.6, [0, 0.6, 1])]]},
];
const cenaEm = (t: number) => {
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (CENAS[k].ini <= t) i = k;
  return i;
};
const camEm = (t: number): Cam => {
  const i = cenaEm(t);
  const c = CENAS[i];
  const fim = i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM;
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.08, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.fui, b: T.quem, texto: 'CADA CASO, COM FONTE', destaque: true},
  {a: T.agora, b: T.marco, texto: 'AS DENÚNCIAS, UMA POR UMA'},
  {a: T.virou, b: T.dia14, texto: 'LESÃO CORPORAL E INJÚRIA · REGISTRO NA POLÍCIA CIVIL'},
  {a: T.tres, b: T.out30, texto: '3 LEVADOS POR DESACATO · LIBERADOS'},
  {a: T.outroLado, b: T.conib, texto: 'AGORA, O OUTRO LADO', destaque: true},
  {a: T.dono, b: T.ibi, texto: 'DONO DO CASARÃO: SÓ AUTORIZOU PINTURA SEM POLÍTICA'},
  {a: T.repara, b: T.governo, texto: 'AGORA REPARA', destaque: true},
  {a: T.ninguem, b: T.entao, texto: 'NINGUÉM CONDENADO ATÉ AGORA', destaque: true},
  {a: T.entao, b: T.turista, texto: 'MINHA OPINIÃO', destaque: true},
  {a: T.errou, b: T.voce, texto: 'QUEM ERROU RESPONDE · COM NOME E COM PROVA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.serie, b: T.agora, texto: 'FONTE: CARTACAPITAL, DCM E BAHIA NOTÍCIAS · 11/2026'},
  {a: T.homem, b: T.dia14, texto: 'FONTE: POLÍCIA CIVIL, VIA BRASIL DE FATO · 09/11/2026'},
  {a: T.dia14, b: T.out30, texto: 'FONTE: POLÍCIA CIVIL, VIA BAHIA.BA · BAHIA NOTÍCIAS'},
  {a: T.pintou, b: T.outroLado, texto: 'FONTE: CORREIO, BAHIA NOTÍCIAS E BRASIL DE FATO'},
  {a: T.conib, b: T.dono, texto: 'FONTE: NOTA DA CONIB, VIA METRÓPOLES · 09/11/2026'},
  {a: T.dono, b: T.ibi, texto: 'FONTE: VÍDEO DO PROPRIETÁRIO, VIA BAHIA.BA · 07/11/2026'},
  {a: T.ibi, b: T.pref, texto: 'FONTE: INSTITUTO BRASIL-ISRAEL, VIA JORNAL GRANDE BAHIA · 03/2026'},
  {a: T.pref, b: T.repara, texto: 'FONTE: NOTA DA PREFEITURA DE ITACARÉ · 05/11/2026'},
  {a: T.governo, b: T.entao, texto: 'FONTE: SECRETARIA DE JUSTIÇA DA BAHIA · 07/11/2026'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.moradores, b: T.fui, p: soma(VILA, [-1.6, 2.4, 1.0]), texto: 'MORADORES DENUNCIAM', acento: true},
  {a: T.agem, b: T.fui, p: soma(VILA, [2.0, 2.0, 1.2]), texto: 'TURISTAS'},
  {a: T.malabi, b: T.agora, p: soma(SER, [-1.0, 2.6, 0.6]), texto: 'MALABI EXPRESS · SÉRIE ISRAELENSE', acento: true},
  {a: T.gravada, b: T.agora, p: soma(SER, [1.2, 2.1, 0.4]), texto: 'GRAVADA EM MORRO DE SÃO PAULO'},
  {a: T.uma, b: T.marco, p: soma(DEN, [-2.4, 2.4, 1.0]), texto: 'RUA DA PITUBA'},
  {a: T.uma + 0.15, b: T.marco, p: soma(DEN, [0, 2.4, 1.0]), texto: 'OS DOIS ATOS'},
  {a: T.uma + 0.3, b: T.marco, p: soma(DEN, [2.4, 2.4, 1.0]), texto: 'O MURAL'},
  {a: T.homem - 0.6, b: T.jogou, p: soma(PIT, [-1.9, 1.4, -0.6]), texto: 'VASOS QUEBRADOS'},
  {a: T.homem, b: T.nariz, p: soma(PIT, [0.2, 2.2, 0.8]), texto: 'ELA FILMAVA'},
  {a: T.jogou, b: T.virou, p: soma(PIT, [1.0, 1.9, 0.9]), texto: 'CELULAR JOGADO NO ROSTO', acento: true},
  {a: T.nariz, b: T.dia14, p: soma(PIT, [0.2, 2.4, 0.8]), texto: 'NARIZ FRATURADO', acento: true},
  {a: T.pro, b: T.out30, p: soma(ATO, [-2.4, 2.2, 0.8]), texto: 'ATO PRÓ-PALESTINA'},
  {a: T.favor, b: T.out30, p: soma(ATO, [2.4, 2.2, 0.8]), texto: 'ATO A FAVOR DOS TURISTAS'},
  {a: T.xinga, b: T.tres, p: soma(ATO, [0, 1.6, 1.2]), texto: 'XINGAMENTO E CHUTE', acento: true},
  {a: T.pintou, b: T.noite, p: soma(CAS, [0, 3.4, -1.0]), texto: 'CASARÃO AZUL · DURANTE A FLICARÉ'},
  {a: T.tirar, b: T.praca, p: soma(CAS, [2.4, 2.0, 0.6]), texto: 'TENTARAM TIRAR A PINTURA', acento: true},
  {a: T.praca, b: T.outroLado, p: soma(CAS, [-2.4, 2.0, 1.4]), texto: 'QUEM ESTAVA NA PRAÇA REAGIU'},
  {a: T.vaia, b: T.outroLado, p: soma(CAS, [3.6, 2.0, 0.6]), texto: 'SAÍRAM SOB VAIA', acento: true},
  {a: T.condenou, b: T.mas, p: soma(CON, [0, 3.2, -1.8]), texto: 'CONDENOU DANO AO PATRIMÔNIO'},
  {a: T.mas, b: T.defender, p: soma(CON, [0, 2.6, -0.4]), texto: '"DO RIO AO MAR" SOA COMO AMEAÇA, DIZ A CONIB', acento: true},
  {a: T.defender, b: T.dono, p: soma(CON, [0, 2.2, 1.0]), texto: 'PALESTINOS E ISRAELENSES: NÃO SÃO LADOS OPOSTOS'},
  {a: T.apagar, b: T.ibi, p: soma(CAS, [0, 3.2, -1.0]), texto: 'MANDOU APAGAR TUDO', acento: true},
  {a: T.maioria, b: T.mau, p: soma(IBI, [-1.6, 2.6, -0.8]), texto: 'COMERCIANTES: A MAIORIA APOIA', acento: true},
  {a: T.enchem, b: T.mau, p: soma(IBI, [0.2, 1.6, 1.4]), texto: 'POUSADA E RESTAURANTE CHEIOS'},
  {a: T.mau, b: T.pref, p: soma(IBI, [0.6, 2.4, 0.6]), texto: 'MAU COMPORTAMENTO "NÃO É SÓ DE ISRAELENSE"'},
  {a: T.pref + 0.4, b: T.assunto, p: soma(PREF, [0, 3.4, -1.4]), texto: 'NÃO HÁ CONFLITO COM A COMUNIDADE'},
  {a: T.assunto, b: T.repudiou, p: soma(PREF, [0, 3.4, -1.4]), texto: 'ISRAEL X PALESTINA: NÃO É ASSUNTO DO MUNICÍPIO'},
  {a: T.repudiou, b: T.governo, p: soma(PREF, [0, 3.4, -1.4]), texto: 'REPUDIOU VIOLÊNCIA E DISCRIMINAÇÃO', acento: true},
  {a: T.lado, b: T.turista, p: soma(VILA, [-1.7, 2.4, 1.0]), texto: 'DO LADO DE QUEM MORA', acento: true},
  {a: T.turista, b: T.respeita, p: soma(VILA, [1.7, 2.4, 1.0]), texto: 'TURISTA É BEM-VINDO'},
  {a: T.respeita, b: T.culpar, p: soma(VILA, [0, 2.2, 1.4]), texto: 'QUEM CHEGA RESPEITA QUEM ESTÁ', acento: true},
  {a: T.culpar, b: T.errou, p: soma(VILA, [0, 2.2, 1.4]), texto: 'CULPAR UM POVO INTEIRO NÃO É JUSTO'},
];

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

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 16 : 21, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 19 : chip.texto.length > 30 ? 22 : 30} />
    </div>
  ) : null;
  const fimK = rampa(t, T.segue, T.segue + 0.4);
  const fimEl =
    t > T.segue - 0.05 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: fimK, transform: `translateY(${(1 - fimK) * 20}px)`}}>
        <div style={{padding: '24px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE</div>
          <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>FATO, FONTE E OS DOIS LADOS</div>
        </div>
      </div>
    ) : null;
  if (noMapa(t)) return <>{selo ? seloDe(selo) : null}</>;
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 230, Math.min(SEGURO.botoesX - 230, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 34 ? 17 : txt.length > 26 ? 20 : 25, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y, k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  visRot.sort((a, b) => a.i - b.i);
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 460 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y + 58;
  return (
    <>
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {fimEl}
    </>
  );
};

const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/israelenses.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.quem, T.serie, T.gravada, T.agora, T.marco, T.homem, T.dia14, T.out30, T.pintou, T.outroLado, T.dono, T.ibi, T.pref, T.governo, T.ninguem, T.entao].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.moradores, f: 'pop', v: 0.14});
  s.push({t: T.fui, f: 'tique', v: 0.14});
  s.push({t: T.malabi, f: 'pop', v: 0.14});
  [0, 1, 2].forEach((i) => s.push({t: T.uma + 0.15 * i, f: 'tique', v: 0.14}));
  s.push({t: T.jogou + 0.4, f: 'baque', v: 0.16});
  s.push({t: T.virou, f: 'ding', v: 0.14});
  s.push({t: T.xinga, f: 'pop', v: 0.14});
  s.push({t: T.tres, f: 'tique', v: 0.14});
  s.push({t: T.bahia, f: 'pop', v: 0.12});
  s.push({t: T.tirar, f: 'tique', v: 0.14});
  s.push({t: T.vaia, f: 'pop', v: 0.14});
  s.push({t: T.mas, f: 'tique', v: 0.14});
  s.push({t: T.apagar, f: 'whoosh', v: 0.14});
  s.push({t: T.enchem, f: 'subida', v: 0.14});
  s.push({t: T.repudiou, f: 'tique', v: 0.14});
  s.push({t: T.ninguem, f: 'ding', v: 0.16});
  s.push({t: T.lado, f: 'pop', v: 0.16});
  s.push({t: T.prova, f: 'ding', v: 0.16});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, 2.6, T.moradores + 1.0, T.fui + 0.8, 12.5, 16.5, T.malabi + 0.4, T.gravada + 1.0, 28.6, 33.8, T.uma + 0.6, 40.2,
  T.homem + 0.6, T.jogou + 0.6, T.nariz + 0.6, T.virou + 1.0, T.pro + 0.8, T.favor + 1.0, T.xinga + 0.6, T.tres + 1.2, 60.8,
  T.bahia + 0.8, T.rio + 0.6, T.tirar + 0.6, T.praca + 0.6, T.vaia + 0.8, T.conib + 0.8, T.mas + 1.2, T.defender + 1.2,
  T.dono + 1.0, T.apagar + 0.9, T.maioria + 0.6, T.enchem + 1.0, T.mau + 1.2, T.pref + 1.0, T.assunto + 0.8, T.repudiou + 0.8,
  T.repara + 0.3, 108.5, 112.0, T.ninguem + 0.8, T.entao + 0.6, T.lado + 0.8, T.turista + 1.0, T.respeita + 0.8, T.culpar + 1.2,
  T.errou + 1.4, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const IsraelenseItacare: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
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
      {MAPAS.map((m, k) => (
        <Sequence key={k} from={m.de} durationInFrames={m.ate - m.de} layout="none">
          <TrechoMapa {...m} />
        </Sequence>
      ))}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Itacaré" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const TITULO_CAPA = ['Itacaré', 'é de quem?', 'De quem', 'mora aqui.'];
export const CapaIsraelenseItacare: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.some((l) => l.length > 12) ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITACARÉ`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap', marginTop: k === 2 ? 28 : 0}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
