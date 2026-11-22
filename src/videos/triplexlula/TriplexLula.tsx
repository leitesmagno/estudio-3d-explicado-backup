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
import {Ampulheta, ArvoreRedonda, BalancaJustica, Cadeado, DocumentoGrande, Grades, MarcoAno, Martelo, Mar, OrgaoPublico, PilhaMoedas, PredioColunas, Sol, Urna} from '../../pecas';
import {Carimbo3D} from '../../pecas/intimacao';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 149. triplex de lula (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/149.../mapas/triplex.mp4, composição TriplexLula do kit: 3 trechos).
// Neutro: acusação e defesa, decisões com o placar e o status exato; "prescrição não é absolvição";
// os dois lados no fim com o mesmo espaço. Pessoas só como bonecos genéricos com etiqueta, sem rosto.
// Fontes: projetos/149. triplex de lula/audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 146.09;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '149. triplex de lula';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  leilao: quando('Oito anos'),
  mandou: quando('mandou entregar'),
  naoLula: quando('E não foi'),
  oas: quando('Foi para a OAS'),
  vou: quando('Vou te'),
  apto: quando('O apartamento é'),
  cartorio: quando('No cartório'),
  construtora: quando('construtora OAS'),
  set16: quando('Em setembro'),
  mpf: quando('Ministério Público Federal'),
  acusou: quando('acusou Lula'),
  tese: quando('A tese'),
  reformado: quando('reformado o'),
  troca: quando('em troca'),
  petrobras: quando('Petrobras'),
  defesa: quando('A defesa'),
  nunca: quando('nunca foi dele'),
  morou: quando('ninguém da família'),
  jul17: quando('12 de julho'),
  moro: quando('O juiz Sergio'),
  nove: quando('nove anos e meio'),
  corrupcao: quando('por corrupção'),
  jan18: quando('Em janeiro de 2018'),
  doze: quando('para 12 anos'),
  unanime: quando('por unanimidade'),
  abr18: quando('7 de abril'),
  mesmoAno: quando('No mesmo ano'),
  leilao2: quando('foi a leilão'),
  milhoes22: quando('saiu por'),
  guardado: quando('O dinheiro ficou'),
  stj: quando('Em 2019'),
  oito: quando('oito anos e dez'),
  nov19: quando('Em novembro, o Supremo'),
  recursos: quando('antes de acabarem'),
  saiu: quando('Lula saiu'),
  dias: quando('580 dias'),
  virada: quando('Agora a virada'),
  mar21: quando('Março de 2021'),
  fachin: quando('O ministro Edson'),
  lugar: quando('não era o lugar'),
  anulou: quando('e anulou'),
  plenario: quando('O plenário do'),
  depois: quando('Depois, o Supremo'),
  parcial: quando('foi parcial'),
  tresDois: quando('três a dois'),
  seteQuatro: quando('sete a quatro'),
  processo: quando('O processo foi'),
  comoLula: quando('Como Lula tem'),
  metade: quando('cai pela metade'),
  pediu: quando('pediu o arquivamento'),
  jan22: quando('em janeiro de 2022'),
  arquivou: quando('arquivou o caso'),
  repara: quando('Agora repara'),
  absolvicao: quando('não é absolvição'),
  ninguem: quando('Ninguém julgou'),
  sobrou: quando('não sobrou'),
  eleicao: quando('Foi assim que'),
  reeleito: quando('e foi reeleito'),
  dinheiro: quando('E o dinheiro'),
  vara: quando('Neste mês'),
  liberar: quando('mandou liberar'),
  dona: quando('que é a dona'),
  concordou: quando('Público concordou'),
  lados: quando('Os dois lados'),
  pt: quando('Para o PT'),
  criticos: quando('Para os críticos'),
  fato: quando('O fato é'),
  papel: quando('no papel'),
  semCond: quando('e ele não tem'),
  voce: quando('E você'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'TRIPLEX DO GUARUJÁ'],
  [T.apto, 'O IMÓVEL'],
  [T.set16, 'A ACUSAÇÃO'],
  [T.jul17, 'AS CONDENAÇÕES'],
  [T.abr18, 'PRISÃO E LEILÃO'],
  [T.virada, 'A VIRADA'],
  [T.processo, 'A PRESCRIÇÃO'],
  [T.repara, 'O QUE ISSO SIGNIFICA'],
  [T.dinheiro, 'O DINHEIRO'],
  [T.lados, 'OS DOIS LADOS'],
];

// ---------- Os trechos de mapa (Kit Mapas): mesmos tempos do roteiro.ts do kit ----------
const q = (s: number) => Math.round(s * FPS);
const TR: [number, number][] = [
  [8.16, 16.42],
  [48.86, 53.34],
  [90.84, 93.58],
];
const MAPAS = TR.map(([a, b], i) => ({de: q(a), ate: q(b), origem: TR.slice(0, i).reduce((s, [x, y]) => s + q(y) - q(x), 0)}));
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

// ---------- Mapa do mundo ----------
const PRAIA: V3 = [0, 0, 0];
const CART: V3 = [12, 0, 0];
const ACUS: V3 = [24, 0, 0];
const COND: V3 = [36, 0, 0];
const LEIL: V3 = [48, 0, 0];
const PRIS: V3 = [60, 0, 0];
const STF: V3 = [72, 0, 0];
const PRESC: V3 = [84, 0, 0];
const SIGN: V3 = [96, 0, 0];
const DIN: V3 = [108, 0, 0];
const LADOS: V3 = [120, 0, 0];

const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

// o prédio com o triplex no alto (as três últimas lajes na cor de destaque)
const Triplex: React.FC<{tema: Tema; pos: V3; k: number; destaque: number; escala?: number}> = ({tema, pos, k, destaque, escala = 1}) => {
  if (k < 0.02) return null;
  const andares = 7;
  const h = 0.42;
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: andares}, (_, i) => {
        const topo = i >= andares - 3;
        const cor = topo ? mistura(tema.objetoClaro, tema.acento, 0.25 + 0.6 * destaque) : mistura(tema.objeto, tema.objetoClaro, 0.25);
        const larg = topo ? 2.0 - 0.18 * (i - (andares - 3)) : 2.2;
        const sobe = clamp01((k * (andares + 2) - i) / 2);
        if (sobe < 0.02) return null;
        return (
          <group key={i}>
            <Caixa args={[larg, h * 0.92 * sobe, 1.8]} raio={0.04} cor={cor} emissivo={topo ? 0.25 * destaque : 0} position={[0, i * h + (h * 0.92 * sobe) / 2, 0]} />
            {[-0.6, 0, 0.6].map((x) => (
              <Caixa key={x} args={[0.32, h * 0.45 * sobe, 0.02]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} position={[x * (larg / 2.2), i * h + h * 0.48, 0.91]} sombra={false} />
            ))}
          </group>
        );
      })}
    </group>
  );
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const Grupo: React.FC<{tema: Tema; pos: V3; n: number; k: number; cor: string; rotY?: number; t: number; abre?: number}> = ({tema, pos, n, k, cor, rotY = 0, t, abre = 0.55}) =>
  k < 0.02 ? null : (
    <group position={pos}>
      {Array.from({length: n}, (_, i) => (
        <Boneco key={i} tema={tema} pos={[(i - (n - 1) / 2) * abre, 0, 0.35 * (i % 2)]} rotY={rotY + 0.08 * ((i % 3) - 1)} escala={0.55 * k} cor={i % 3 === 1 ? mistura(cor, tema.objetoClaro, 0.25) : cor} pose={{passo: 0.15 * Math.sin(t * 2 + i)}} />
      ))}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const lula = mistura(tema.pessoa, tema.objetoClaro, 0.1);
  const dourado = festa.dourado;

  // ----- Cena 1: abertura (prédio, martelo, dinheiro vai para a OAS) e fecho -----
  const praiaK = entra(t, 0, 0.6) * (1 - rampa(t, T.apto - 0.3, T.apto)) + entra(t, T.fato - 0.3, 0.6);
  const abertura = t < T.apto + 0.2;
  const batida = pulso(t, T.leilao + 0.7, 0.5);
  const vaiOas = rampa(t, T.oas - 0.4, T.oas + 0.8);

  // ----- Cena 2: o cartório -----
  const cartK = vis(t, T.cartorio - 0.3, T.set16);
  const carimba = rampa(t, T.construtora - 0.2, T.construtora + 0.3);

  // ----- Cena 3: a acusação e a defesa -----
  const acuK = vis(t, T.set16 - 0.3, T.jul17);
  const mpfK = entra(t, T.mpf - 0.2, 0.6);
  const teseK = entra(t, T.tese - 0.2, 0.5);
  const defK = entra(t, T.defesa - 0.2, 0.5);

  // ----- Cena 4: as condenações -----
  const conK = vis(t, T.jul17 - 0.3, T.abr18);
  const bate17 = rampa(t, T.nove - 0.3, T.nove) * (1 - rampa(t, T.nove + 0.2, T.nove + 0.6));
  const bate18 = rampa(t, T.doze - 0.3, T.doze) * (1 - rampa(t, T.doze + 0.2, T.doze + 0.6));

  // ----- Cena 5: o leilão -----
  const leiK = vis(t, T.mesmoAno - 0.3, T.stj);
  const batLei = rampa(t, T.milhoes22 - 0.3, T.milhoes22) * (1 - rampa(t, T.milhoes22 + 0.2, T.milhoes22 + 0.6));
  const guarda = rampa(t, T.guardado - 0.2, T.guardado + 1.0);

  // ----- Cena 6: STJ e a soltura -----
  const priK = vis(t, T.stj - 0.3, T.virada);
  const abre = rampa(t, T.saiu - 0.2, T.saiu + 0.8);

  // ----- Cena 7: a virada no Supremo -----
  const stfK = vis(t, T.virada - 0.3, T.processo);
  const anula = rampa(t, T.anulou - 0.1, T.anulou + 0.8);

  // ----- Cena 8: a prescrição -----
  const preK = vis(t, T.comoLula - 0.3, T.repara);
  const areia = 1 - rampa(t, T.metade - 0.4, T.pediu);
  const arquiva = rampa(t, T.arquivou - 0.2, T.arquivou + 0.6);

  // ----- Cena 9: o que significa -----
  const sigK = vis(t, T.repara - 0.3, T.dinheiro);
  const urnaK = entra(t, T.eleicao - 0.2, 0.5);

  // ----- Cena 10: o dinheiro -----
  const dinK = vis(t, T.dinheiro - 0.3, T.lados);
  const vai = rampa(t, T.liberar, T.dona + 0.2);

  // ----- Cena 11: os dois lados -----
  const ladK = vis(t, T.lados - 0.3, T.fato);
  const ptK = entra(t, T.pt - 0.2, 0.5);
  const criK = entra(t, T.criticos - 0.2, 0.5);

  const fimK = entra(t, T.fato - 0.3, 0.6);

  return (
    <group>
      <Caixa args={[140, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[60, 0.02, 3.8]} sombra={false} />

      {/* Cena 1 e 12: o prédio à beira-mar */}
      {praiaK > 0.02 ? (
        <group>
          <Caixa args={[16, 0.04, 4.2]} raio={0.02} cor={mistura(festa.loiro, tema.chao, 0.45)} position={soma(PRAIA, [0, 0.02, -3.2])} sombra={false} />
          <Mar tema={tema} x0={-9} x1={9} z0={-15} z1={-5.2} t={t} />
          <Sol tema={tema} pos={[5, 5.4, -13]} escala={0.9 * Math.min(1, praiaK)} />
          {[-4.8, -3.4, 3.4, 4.8].map((x, i) => (
            <ArvoreRedonda key={i} tema={tema} pos={soma(PRAIA, [x, 0, -2.2 - 0.3 * (i % 2)])} r={0.45} cresce={Math.min(1, praiaK)} />
          ))}
          <Triplex tema={tema} pos={soma(PRAIA, [0, 0, -1.6])} k={Math.min(1, praiaK)} destaque={abertura ? pulso(t, T.leilao + 0.2, 1.4) : fimK} />
        </group>
      ) : null}
      {abertura ? (
        <group>
          <Martelo tema={tema} pos={soma(PRAIA, [-2.2, 0, 0.8])} escala={0.9 * entra(t, T.leilao, 0.4)} bate={batida} rotY={0.5} />
          <OrgaoPublico tema={tema} pos={soma(PRAIA, [3.4, 0, 0.2])} escala={0.42} sobe={entra(t, T.naoLula, 0.5)} letreiro={entra(t, T.oas - 0.2, 0.4)} texto="OAS" />
          <PilhaMoedas tema={tema} pos={soma(PRAIA, [-0.6 + 3.2 * vaiOas, 0.02 + 0.6 * Math.sin(Math.PI * vaiOas), 1.4])} n={6} cor={dourado} r={0.22} escala={entra(t, T.mandou, 0.4)} brilho={pulso(t, T.oas + 0.8, 1.0)} />
          <Boneco tema={tema} pos={soma(PRAIA, [-1.0, 0, 1.6])} rotY={0.3} escala={0.6 * entra(t, T.naoLula - 0.2, 0.4)} cor={lula} />
        </group>
      ) : null}
      {t > T.fato - 0.5 ? (
        <group>
          <DocumentoGrande tema={tema} pos={soma(PRAIA, [-2.0, 0.05, 1.2])} rot={[-1.2, 0.3, 0]} escala={0.8 * entra(t, T.papel - 0.2, 0.4)} carimbo={rampa(t, T.papel, T.papel + 0.4)} />
          <BalancaJustica tema={tema} pos={soma(PRAIA, [2.2, 0, 1.0])} escala={0.75 * entra(t, T.semCond - 0.2, 0.5)} inclina={0} brilhoEsq={0} brilhoDir={0} />
        </group>
      ) : null}

      {/* Cena 2: o cartório */}
      {cartK > 0.02 ? (
        <group>
          <Caixa args={[3.0, 0.9, 1.6]} raio={0.06} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={soma(CART, [0, 0.45, 0])} />
          <DocumentoGrande tema={tema} pos={soma(CART, [0, 0.96, 0.1])} rot={[-Math.PI / 2 + 0.05, 0, 0.08]} escala={1.0 * cartK} carimbo={carimba} />
          <Carimbo3D tema={tema} pos={soma(CART, [0.9, 0.95 + 0.6 * (1 - carimba), 0.2])} escala={0.9 * cartK} />
        </group>
      ) : null}

      {/* Cena 3: acusação e defesa */}
      {acuK > 0.02 ? (
        <group>
          <OrgaoPublico tema={tema} pos={soma(ACUS, [-2.4, 0, -1.8])} escala={0.55} sobe={mpfK * acuK} letreiro={mpfK * acuK} texto="MPF" />
          <Triplex tema={tema} pos={soma(ACUS, [2.4, 0, -1.8])} k={acuK * teseK} destaque={pulso(t, T.reformado, 1.2)} escala={0.75} />
          <DocumentoGrande tema={tema} pos={soma(ACUS, [-1.0, 0.9, 0.6])} rot={[0.2, 0.3, 0]} escala={0.6 * acuK * entra(t, T.acusou - 0.1, 0.4)} />
          <Boneco tema={tema} pos={soma(ACUS, [0.4, 0, 1.2])} rotY={-0.2} escala={0.65 * acuK * entra(t, T.acusou - 0.2, 0.4)} cor={lula} />
          <BalancaJustica tema={tema} pos={soma(ACUS, [0.4, 0, -0.6])} escala={0.7 * acuK * defK} inclina={0.2 * Math.sin(t * 1.3)} brilhoEsq={pulso(t, T.tese, 1.2)} brilhoDir={pulso(t, T.defesa, 1.2)} />
        </group>
      ) : null}

      {/* Cena 4: as condenações */}
      {conK > 0.02 ? (
        <group>
          {['2017', '2018'].map((ano, i) => (
            <MarcoAno key={ano} tema={tema} pos={soma(COND, [-2.2 + 3.0 * i, 0, 1.2])} ano={ano} k={conK * entra(t, i ? T.jan18 - 0.2 : T.jul17 - 0.2, 0.4)} aceso={i ? pulso(t, T.doze, 1.2) : pulso(t, T.nove, 1.2)} />
          ))}
          <Martelo tema={tema} pos={soma(COND, [-1.8, 0, -1.0])} escala={0.9 * conK * entra(t, T.moro - 0.2, 0.4)} bate={bate17} rotY={0.4} />
          <OrgaoPublico tema={tema} pos={soma(COND, [2.4, 0, -2.8])} escala={0.5} sobe={conK * entra(t, T.jan18 - 0.2, 0.5)} letreiro={conK * entra(t, T.jan18, 0.4)} texto="TRF4" />
          <Martelo tema={tema} pos={soma(COND, [2.6, 0, -0.6])} escala={0.7 * conK * entra(t, T.jan18, 0.4)} bate={bate18} rotY={-0.4} />
        </group>
      ) : null}

      {/* Cena 5: o leilão e o dinheiro guardado */}
      {leiK > 0.02 ? (
        <group>
          <Triplex tema={tema} pos={soma(LEIL, [-2.0, 0, -1.6])} k={leiK} destaque={pulso(t, T.leilao2, 1.2)} escala={0.8} />
          <Martelo tema={tema} pos={soma(LEIL, [0.4, 0, 0.4])} escala={0.85 * leiK} bate={batLei} rotY={0.2} />
          <PilhaMoedas tema={tema} pos={soma(LEIL, [1.0 + 1.2 * guarda, 0.02, 1.2 - 1.8 * guarda])} n={7} cor={dourado} r={0.24} escala={leiK * entra(t, T.milhoes22, 0.4)} brilho={pulso(t, T.milhoes22 + 0.5, 1.0)} />
          <Caixa args={[1.4, 1.1, 1.2]} raio={0.08} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={soma(LEIL, [2.6, 0.55, -1.0])} scale={[leiK, leiK, leiK]} />
          <Cadeado tema={tema} pos={soma(LEIL, [2.6, 1.15, -0.38])} k={0.9 * leiK * entra(t, T.guardado, 0.4)} fecha={rampa(t, T.guardado + 0.8, T.guardado + 1.4)} />
        </group>
      ) : null}

      {/* Cena 6: STJ e a soltura */}
      {priK > 0.02 ? (
        <group>
          <MarcoAno tema={tema} pos={soma(PRIS, [-2.6, 0, 1.2])} ano="2019" k={priK} aceso={pulso(t, T.oito, 1.2)} />
          <Boneco tema={tema} pos={soma(PRIS, [0.4 + 1.6 * rampa(t, T.saiu, T.dias + 0.4), 0, -0.2 + 1.6 * rampa(t, T.saiu, T.dias + 0.4)])} rotY={abre > 0.1 ? 0.6 : 0} escala={0.7 * priK} cor={lula} pose={{passo: abre > 0 && abre < 1 ? Math.sin(t * 8) : 0}} />
          <Grades tema={tema} pos={soma(PRIS, [0.4, 0, 0.6])} larg={2.0} alt={1.6} desce={priK * (1 - abre)} />
          <PredioColunas tema={tema} pos={soma(PRIS, [2.8, 0, -2.0])} aceso={pulso(t, T.nov19, 1.4)} escala={0.5 * priK * entra(t, T.nov19 - 0.2, 0.5)} />
        </group>
      ) : null}

      {/* Cena 7: a virada no Supremo */}
      {stfK > 0.02 ? (
        <group>
          <PredioColunas tema={tema} pos={soma(STF, [0, 0, -2.2])} aceso={0.4 + 0.6 * pulso(t, T.plenario, 1.4)} escala={0.75 * stfK} />
          {[-1.6, 0, 1.6].map((x, i) => (
            <DocumentoGrande key={i} tema={tema} pos={soma(STF, [x, 0.6 - 0.55 * anula, 0.8])} rot={[-0.3 - 1.2 * anula, 0.15 * (i - 1), 0.2 * anula * (i - 1)]} escala={0.5 * stfK * (1 - 0.35 * anula)} />
          ))}
          <Martelo tema={tema} pos={soma(STF, [2.6, 0, 0.6])} escala={0.7 * stfK * entra(t, T.depois - 0.2, 0.4)} bate={rampa(t, T.parcial - 0.3, T.parcial) * (1 - rampa(t, T.parcial + 0.2, T.parcial + 0.6))} rotY={-0.4} />
        </group>
      ) : null}

      {/* Cena 8: a prescrição */}
      {preK > 0.02 ? (
        <group>
          <Ampulheta tema={tema} pos={soma(PRESC, [-1.4, 0, 0.4])} escala={3.2 * preK} areia={areia} fio={areia > 0.02 && areia < 0.98} />
          <Caixa args={[1.6, 1.3, 1.2]} raio={0.06} cor={mistura(tema.objeto, tema.objetoEscuro, 0.35)} position={soma(PRESC, [1.6, 0.65, -0.4])} scale={[preK, preK, preK]} />
          <DocumentoGrande tema={tema} pos={soma(PRESC, [1.6, 1.4 + 0.9 * (1 - arquiva), -0.4])} rot={[-Math.PI / 2, 0, 0.1]} escala={0.55 * preK * entra(t, T.pediu - 0.2, 0.4)} />
          <Cadeado tema={tema} pos={soma(PRESC, [1.6, 0.9, 0.22])} k={0.8 * preK * entra(t, T.arquivou, 0.4)} fecha={rampa(t, T.arquivou + 0.4, T.arquivou + 1.0)} />
        </group>
      ) : null}

      {/* Cena 9: o que significa */}
      {sigK > 0.02 ? (
        <group>
          <BalancaJustica tema={tema} pos={soma(SIGN, [-0.6, 0, -2.4])} escala={0.75 * sigK} inclina={0} brilhoEsq={0} brilhoDir={0} />
          {['CRIME?', 'CONDENAÇÃO'].map((n, i) => (
            <MarcoAno key={n} tema={tema} pos={soma(SIGN, [-2.0 + 2.2 * i, 0, 1.2])} ano={n} k={sigK * entra(t, i ? T.sobrou - 0.2 : T.ninguem - 0.2, 0.4)} aceso={0} />
          ))}
          <Urna tema={tema} pos={soma(SIGN, [2.2, 0, -0.2])} escala={0.9 * sigK * urnaK} />
          <Boneco tema={tema} pos={soma(SIGN, [2.2, 0, 1.0])} rotY={-0.3} escala={0.65 * sigK * urnaK} cor={lula} />
        </group>
      ) : null}

      {/* Cena 10: o dinheiro vai para a OAS */}
      {dinK > 0.02 ? (
        <group>
          <OrgaoPublico tema={tema} pos={soma(DIN, [-2.6, 0, -1.8])} escala={0.5} sobe={dinK} letreiro={dinK * entra(t, T.vara, 0.4)} texto="JUSTIÇA" />
          <OrgaoPublico tema={tema} pos={soma(DIN, [2.6, 0, -1.8])} escala={0.5} sobe={dinK * entra(t, T.liberar - 0.3, 0.5)} letreiro={dinK * entra(t, T.liberar, 0.4)} texto="OAS" />
          <PilhaMoedas tema={tema} pos={soma(DIN, [-2.0 + 4.0 * vai, 0.02 + 0.8 * Math.sin(Math.PI * vai), 0.8])} n={8} cor={dourado} r={0.24} escala={dinK} brilho={pulso(t, T.dona, 1.2)} />
          <Cadeado tema={tema} pos={soma(DIN, [-2.0, 0.02, 1.6])} k={0.7 * dinK * (1 - rampa(t, T.liberar, T.liberar + 0.6))} fecha={1 - rampa(t, T.liberar - 0.4, T.liberar)} />
        </group>
      ) : null}

      {/* Cena 11: os dois lados */}
      {ladK > 0.02 ? (
        <group>
          <Grupo tema={tema} pos={soma(LADOS, [-2.0, 0, 0.6])} n={4} k={ladK * ptK} cor={mistura(festa.rosa, tema.objeto, 0.5)} rotY={0.5} t={t} />
          <Grupo tema={tema} pos={soma(LADOS, [2.0, 0, 0.6])} n={4} k={ladK * criK} cor={mistura(festa.azul, tema.objeto, 0.4)} rotY={-0.5} t={t} />
          <BalancaJustica tema={tema} pos={soma(LADOS, [0, 0, -1.2])} escala={0.85 * ladK} inclina={0.15 * Math.sin(t * 1.1)} brilhoEsq={pulso(t, T.pt, 1.2)} brilhoDir={pulso(t, T.criticos, 1.2)} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const parado = (ini: number, fim: number, c: Cam): Cena => ({ini, chaves: [[ini, c], [fim, c]]});
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(PRAIA, [0, 1.6, -1.6]), 9.0, 7.0, [0.1, 0.4, 1])], [T.naoLula, E(soma(PRAIA, [0.4, 1.2, 0.2]), 8.4, 6.0, [0.06, 0.38, 1])], [T.vou, E(soma(PRAIA, [0.6, 1.2, 0.4]), 7.6, 5.6, [-0.04, 0.36, 1])], [T.apto, E(soma(PRAIA, [0.6, 1.2, 0.4]), 7.4, 5.4, [-0.06, 0.36, 1])]]},
  {ini: T.cartorio, chaves: [[T.cartorio, E(soma(CART, [0, 1.0, 0.2]), 4.6, 3.6, [0.1, 0.9, 0.6])], [T.set16 - 0.1, E(soma(CART, [0.2, 1.0, 0.2]), 3.8, 3.2, [0.02, 0.9, 0.6])]]},
  {ini: T.set16, chaves: [[T.set16, E(soma(ACUS, [-1.8, 1.4, -1.4]), 7.6, 5.6, [0.12, 0.28, 1])], [T.acusou, E(soma(ACUS, [-1.4, 1.4, -1.0]), 7.6, 5.6, [0.08, 0.28, 1])], [T.tese, E(soma(ACUS, [1.4, 1.4, -1.0]), 6.0, 4.8, [-0.04, 0.28, 1])], [T.defesa, E(soma(ACUS, [0.4, 1.2, 0.2]), 7.6, 5.2, [0.02, 0.3, 1])], [T.jul17 - 0.1, E(soma(ACUS, [0.4, 1.2, 0.4]), 7.0, 5.0, [-0.04, 0.3, 1])]]},
  {ini: T.jul17, chaves: [[T.jul17, E(soma(COND, [-1.6, 1.0, 0]), 5.4, 4.4, [0.12, 0.3, 1])], [T.nove, E(soma(COND, [-1.4, 1.0, 0]), 4.8, 4.0, [0.04, 0.3, 1])], [T.jan18, E(soma(COND, [1.6, 1.3, -0.8]), 6.6, 5.0, [-0.04, 0.3, 1])], [T.abr18 - 0.1, E(soma(COND, [0.2, 1.2, -0.4]), 8.0, 5.4, [-0.06, 0.3, 1])]]},
  {ini: T.mesmoAno, chaves: [[T.mesmoAno, E(soma(LEIL, [-1.2, 1.4, -0.8]), 6.4, 5.0, [0.1, 0.3, 1])], [T.milhoes22, E(soma(LEIL, [0.4, 1.0, 0.2]), 6.4, 4.6, [0.02, 0.32, 1])], [T.guardado, E(soma(LEIL, [1.8, 1.0, -0.4]), 5.0, 4.0, [-0.04, 0.32, 1])], [T.stj - 0.1, E(soma(LEIL, [2.0, 1.0, -0.4]), 4.8, 4.0, [-0.07, 0.32, 1])]]},
  {ini: T.stj, chaves: [[T.stj, E(soma(PRIS, [-1.2, 1.0, 0.6]), 6.0, 4.6, [0.1, 0.3, 1])], [T.nov19, E(soma(PRIS, [1.4, 1.2, -0.8]), 6.6, 5.0, [0, 0.3, 1])], [T.saiu, E(soma(PRIS, [1.0, 1.0, 0.6]), 5.6, 4.4, [-0.02, 0.3, 1])], [T.virada - 0.1, E(soma(PRIS, [1.4, 1.0, 0.8]), 5.4, 4.2, [-0.06, 0.3, 1])]]},
  {ini: T.virada, chaves: [[T.virada, E(soma(STF, [0, 1.8, -1.6]), 7.0, 5.6, [0.08, 0.26, 1])], [T.anulou, E(soma(STF, [0, 1.0, 0.4]), 6.0, 4.6, [0.02, 0.32, 1])], [T.plenario, E(soma(STF, [0, 1.6, -1.0]), 7.0, 5.4, [-0.02, 0.28, 1])], [T.parcial, E(soma(STF, [1.2, 1.2, -0.2]), 6.4, 5.0, [-0.05, 0.28, 1])], [T.processo - 0.1, E(soma(STF, [0.6, 1.4, -0.6]), 7.4, 5.4, [-0.07, 0.28, 1])]]},
  {ini: T.comoLula, chaves: [[T.comoLula, E(soma(PRESC, [-1.2, 1.2, 0.4]), 4.2, 3.6, [0.1, 0.28, 1])], [T.pediu, E(soma(PRESC, [0.4, 1.3, 0]), 6.4, 4.8, [0.02, 0.3, 1])], [T.arquivou, E(soma(PRESC, [1.4, 1.2, 0]), 5.0, 4.2, [-0.04, 0.3, 1])], [T.repara - 0.1, E(soma(PRESC, [1.2, 1.2, 0]), 5.0, 4.2, [-0.07, 0.3, 1])]]},
  {ini: T.repara, chaves: [[T.repara, E(soma(SIGN, [-0.6, 1.4, -1.8]), 5.4, 4.4, [0.08, 0.3, 1])], [T.ninguem, E(soma(SIGN, [-0.9, 1.0, 0.8]), 6.4, 4.8, [0.03, 0.32, 1])], [T.sobrou + 0.6, E(soma(SIGN, [-0.8, 1.0, 0.8]), 6.4, 4.8, [0.0, 0.32, 1])], [T.eleicao, E(soma(SIGN, [1.4, 1.1, 0.2]), 6.4, 4.8, [-0.04, 0.3, 1])], [T.dinheiro - 0.1, E(soma(SIGN, [1.6, 1.1, 0.2]), 6.0, 4.6, [-0.07, 0.3, 1])]]},
  {ini: T.dinheiro, chaves: [[T.dinheiro, E(soma(DIN, [-1.8, 1.4, -0.8]), 6.0, 4.8, [0.1, 0.3, 1])], [T.liberar, E(soma(DIN, [0, 1.3, -0.4]), 8.4, 5.6, [0.02, 0.3, 1])], [T.dona, E(soma(DIN, [1.8, 1.4, -0.6]), 6.4, 5.0, [-0.04, 0.3, 1])], [T.lados - 0.1, E(soma(DIN, [1.8, 1.4, -0.6]), 6.0, 4.8, [-0.07, 0.3, 1])]]},
  {ini: T.lados, chaves: [[T.lados, E(soma(LADOS, [0, 1.3, -0.2]), 8.4, 5.6, [0.06, 0.32, 1])], [T.pt, E(soma(LADOS, [-1.6, 1.0, 0.6]), 5.6, 4.4, [0.08, 0.3, 1])], [T.criticos, E(soma(LADOS, [1.6, 1.0, 0.6]), 5.6, 4.4, [-0.08, 0.3, 1])], [T.fato - 0.1, E(soma(LADOS, [0, 1.2, 0]), 8.6, 5.8, [0, 0.32, 1])]]},
  {ini: T.fato, chaves: [[T.fato, E(soma(PRAIA, [0, 1.8, -1.6]), 9.6, 7.0, [0, 0.42, 1])], [T.papel, E(soma(PRAIA, [0, 1.4, -0.2]), 7.4, 5.6, [0.04, 0.38, 1])], [T.voce, E(soma(PRAIA, [0, 1.6, -1.0]), 9.0, 6.8, [0, 0.42, 1])], [FIM, E(soma(PRAIA, [0, 1.8, -1.6]), 10.0, 7.4, [0, 0.45, 1])]]},
];
// durante os mapas a câmera fica parada (o mapa cobre a tela)
CENAS.splice(1, 0, parado(T.apto, T.cartorio, E(soma(PRAIA, [0.6, 1.2, 0.4]), 7.4, 5.4, [-0.06, 0.36, 1])));
CENAS.splice(5, 0, parado(T.abr18, T.mesmoAno, E(soma(LEIL, [-1.2, 1.4, -0.8]), 6.4, 5.0, [0.1, 0.3, 1])));
CENAS.splice(9, 0, parado(T.processo, T.comoLula, E(soma(PRESC, [-1.2, 1.2, 0.4]), 4.2, 3.6, [0.1, 0.28, 1])));
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
  {a: T.vou, b: T.apto, texto: 'DO COMEÇO AO FIM, COM FONTE', destaque: true},
  {a: T.cartorio, b: T.set16, texto: 'NO CARTÓRIO: OAS EMPREENDIMENTOS', destaque: true},
  {a: T.set16, b: T.tese, texto: 'SETEMBRO DE 2016 · DENÚNCIA DO MPF'},
  {a: T.jul17, b: T.jan18, texto: '1ª INSTÂNCIA · 9 ANOS E 6 MESES'},
  {a: T.jan18, b: T.abr18, texto: 'TRF4 · 12 ANOS E 1 MÊS · 3 A 0'},
  {a: T.guardado, b: T.stj, texto: 'DINHEIRO EM CONTA JUDICIAL', destaque: true},
  {a: T.stj, b: T.nov19, texto: 'STJ · 8 ANOS, 10 MESES E 20 DIAS'},
  {a: T.dias, b: T.virada, texto: '580 DIAS PRESO', destaque: true},
  {a: T.virada, b: T.fachin, texto: 'AGORA, A VIRADA', destaque: true},
  {a: T.lugar, b: T.depois, texto: 'CURITIBA NÃO ERA O LUGAR CERTO · 8 A 3 NO PLENÁRIO'},
  {a: T.tresDois, b: T.processo, texto: 'MORO PARCIAL · 3 A 2 NA TURMA · 7 A 4 NO PLENÁRIO'},
  {a: T.metade, b: T.pediu, texto: 'MAIS DE 70 ANOS: PRAZO PELA METADE'},
  {a: T.arquivou, b: T.repara, texto: 'ARQUIVADO POR PRESCRIÇÃO · 01/2022', destaque: true},
  {a: T.absolvicao, b: T.ninguem, texto: 'PRESCRIÇÃO NÃO É ABSOLVIÇÃO', destaque: true},
  {a: T.eleicao, b: T.dinheiro, texto: 'ELEITO EM 2022 · REELEITO EM 2026'},
  {a: T.liberar, b: T.lados, texto: '≈ R$ 2,4 MILHÕES PARA A OAS · MPF CONCORDOU', destaque: true},
  {a: T.fato, b: T.voce, texto: 'NO PAPEL, NÃO É DE LULA · SEM CONDENAÇÃO NESSE CASO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.leilao, b: T.vou, texto: 'FONTE: CONJUR E SBT NEWS · 11/11/2026'},
  {a: T.cartorio, b: T.set16, texto: 'FONTE: MATRÍCULA CITADA NA DECISÃO · CONJUR'},
  {a: T.tese, b: T.jul17, texto: 'FONTE: JOVEM PAN · ACUSAÇÃO E DEFESA'},
  {a: T.jul17, b: T.abr18, texto: 'FONTE: SENTENÇA E ACÓRDÃO, VIA IMPRENSA · 2017-2018'},
  {a: T.mesmoAno, b: T.stj, texto: 'FONTE: SBT NEWS · LEILÃO DE MAIO/2018'},
  {a: T.stj, b: T.virada, texto: 'FONTE: CONGRESSO EM FOCO E BRASIL DE FATO'},
  {a: T.fachin, b: T.processo, texto: 'FONTE: STF · HC 193.726 E NOTÍCIAS DO STF · 2021'},
  {a: T.comoLula, b: T.repara, texto: 'FONTE: MPF E 12ª VARA FEDERAL DO DF · 2021-2022'},
  {a: T.eleicao, b: T.dinheiro, texto: 'FONTE: TSE · 2º TURNO 25/10/2026'},
  {a: T.vara, b: T.lados, texto: 'FONTE: DECISÃO 1070306-59.2021.4.01.3400 · CONJUR'},
  {a: T.pt, b: T.fato, texto: 'FONTE: NOTA DO PT (SBT NEWS) · EDITORIAL GAZETA DO POVO'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.leilao + 0.3, b: T.naoLula, p: soma(PRAIA, [0, 3.4, -1.6]), texto: 'TRIPLEX DO GUARUJÁ', acento: true},
  {a: T.naoLula, b: T.vou, p: soma(PRAIA, [-1.0, 1.6, 1.6]), texto: 'LULA'},
  {a: T.oas, b: T.apto, p: soma(PRAIA, [3.4, 2.4, 0.2]), texto: 'O DINHEIRO VAI PARA A OAS', acento: true},
  {a: T.mpf, b: T.tese, p: soma(ACUS, [-2.4, 2.8, -1.8]), texto: 'MINISTÉRIO PÚBLICO FEDERAL'},
  {a: T.acusou, b: T.tese, p: soma(ACUS, [0.4, 1.6, 1.2]), texto: 'LULA'},
  {a: T.tese, b: T.defesa, p: soma(ACUS, [2.4, 3.6, -1.8]), texto: 'ACUSAÇÃO: RESERVADO E REFORMADO PELA OAS', acento: true},
  {a: T.troca, b: T.defesa, p: soma(ACUS, [2.4, 3.0, -1.8]), texto: 'EM TROCA DE CONTRATOS DA PETROBRAS'},
  {a: T.defesa, b: T.jul17, p: soma(ACUS, [0.4, 2.6, -0.6]), texto: 'DEFESA: NUNCA FOI DELE', acento: true},
  {a: T.morou, b: T.jul17, p: soma(ACUS, [0.4, 2.1, -0.6]), texto: 'NINGUÉM DA FAMÍLIA MOROU LÁ'},
  {a: T.moro, b: T.jan18, p: soma(COND, [-1.8, 2.2, -1.0]), texto: 'JUIZ SERGIO MORO · CURITIBA'},
  {a: T.corrupcao, b: T.jan18, p: soma(COND, [-2.2, 1.9, 1.2]), texto: 'CORRUPÇÃO PASSIVA E LAVAGEM', acento: true},
  {a: T.doze, b: T.abr18, p: soma(COND, [0.8, 1.9, 1.2]), texto: '12 ANOS E 1 MÊS', acento: true},
  {a: T.milhoes22, b: T.stj, p: soma(LEIL, [1.0, 1.6, 1.2]), texto: 'R$ 2,2 MILHÕES', acento: true},
  {a: T.oito, b: T.nov19, p: soma(PRIS, [-2.6, 1.8, 1.2]), texto: 'PENA: 8 ANOS E 10 MESES'},
  {a: T.nov19, b: T.saiu, p: soma(PRIS, [2.8, 2.6, -2.0]), texto: 'STF: PRISÃO SÓ DEPOIS DOS RECURSOS'},
  {a: T.saiu, b: T.virada, p: soma(PRIS, [1.6, 2.0, 1.0]), texto: 'NOVEMBRO DE 2019 · SOLTO', acento: true},
  {a: T.fachin, b: T.anulou, p: soma(STF, [0, 3.4, -2.2]), texto: 'MINISTRO EDSON FACHIN · MARÇO DE 2021'},
  {a: T.anulou, b: T.plenario, p: soma(STF, [0, 1.6, 0.8]), texto: 'CONDENAÇÕES ANULADAS', acento: true},
  {a: T.plenario, b: T.depois, p: soma(STF, [0, 3.4, -2.2]), texto: 'PLENÁRIO CONFIRMOU'},
  {a: T.parcial, b: T.processo, p: soma(STF, [0, 3.4, -2.2]), texto: 'MORO PARCIAL NO CASO TRIPLEX', acento: true},
  {a: T.comoLula, b: T.pediu, p: soma(PRESC, [-1.4, 2.6, 0.4]), texto: 'PRAZO PARA PUNIR', acento: true},
  {a: T.pediu, b: T.arquivou, p: soma(PRESC, [1.6, 2.6, -0.4]), texto: 'MPF PEDIU O ARQUIVAMENTO'},
  {a: T.arquivou, b: T.repara, p: soma(PRESC, [1.6, 2.2, -0.4]), texto: 'JANEIRO DE 2022 · ARQUIVADO', acento: true},
  {a: T.ninguem, b: T.eleicao, p: soma(SIGN, [-2.0, 1.9, 1.2]), texto: 'NÃO JULGADO DE NOVO'},
  {a: T.sobrou, b: T.eleicao, p: soma(SIGN, [0.2, 1.9, 1.2]), texto: 'NENHUMA', acento: true},
  {a: T.vara, b: T.liberar, p: soma(DIN, [-2.6, 2.8, -1.8]), texto: '12ª VARA FEDERAL CRIMINAL DE BRASÍLIA'},
  {a: T.dona, b: T.lados, p: soma(DIN, [2.6, 2.8, -1.8]), texto: 'DONA NO CARTÓRIO', acento: true},
  {a: T.pt, b: T.fato, p: soma(LADOS, [-2.0, 2.0, 0.6]), texto: 'PT: NUNCA FOI DE LULA', acento: true},
  {a: T.criticos, b: T.fato, p: soma(LADOS, [2.0, 2.0, 0.6]), texto: 'CRÍTICOS: CAIU POR PRAZO E PROCESSO'},
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
      <OffthreadVideo src={staticFile(`${P}/mapas/triplex.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.apto, T.cartorio, T.set16, T.jul17, T.abr18, T.mesmoAno, T.stj, T.virada, T.processo, T.comoLula, T.repara, T.dinheiro, T.lados, T.fato].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.leilao + 0.75, f: 'baque', v: 0.16});
  s.push({t: T.oas + 0.8, f: 'ding', v: 0.14});
  s.push({t: T.construtora + 0.3, f: 'baque', v: 0.14});
  s.push({t: T.nove, f: 'baque', v: 0.16});
  s.push({t: T.doze, f: 'baque', v: 0.16});
  s.push({t: T.milhoes22, f: 'baque', v: 0.14});
  s.push({t: T.guardado + 1.2, f: 'tique', v: 0.14});
  s.push({t: T.saiu, f: 'subida', v: 0.14});
  s.push({t: T.anulou, f: 'whoosh', v: 0.14});
  s.push({t: T.parcial, f: 'baque', v: 0.14});
  s.push({t: T.arquivou + 0.8, f: 'tique', v: 0.14});
  s.push({t: T.absolvicao, f: 'ding', v: 0.16});
  s.push({t: T.liberar, f: 'subida', v: 0.14});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, 2.6, T.naoLula + 0.6, T.oas + 0.9, T.vou + 0.8, 10.5, 14.5, T.cartorio + 0.6, T.construtora + 0.6,
  T.mpf + 0.6, T.tese + 0.8, T.troca + 0.6, T.defesa + 0.8, T.morou + 0.4, T.moro + 0.6, T.nove + 0.4, T.corrupcao + 0.6,
  T.jan18 + 0.8, T.doze + 0.6, 50.5, T.mesmoAno + 0.6, T.milhoes22 + 0.6, T.guardado + 1.4, T.stj + 0.8, T.nov19 + 1.0,
  T.saiu + 0.6, T.dias + 0.4, T.virada + 0.4, T.fachin + 0.8, T.anulou + 0.6, T.plenario + 0.6, T.parcial + 0.6, T.seteQuatro + 0.6,
  92.2, T.comoLula + 0.6, T.metade + 0.6, T.pediu + 0.6, T.arquivou + 1.0, T.repara + 0.6, T.absolvicao + 0.6, T.ninguem + 0.6,
  T.sobrou + 0.6, T.eleicao + 0.8, T.reeleito + 0.6, T.dinheiro + 0.4, T.vara + 1.0, T.liberar + 0.8, T.dona + 0.6, T.concordou + 0.6,
  T.lados + 0.6, T.pt + 1.0, T.criticos + 1.2, T.fato + 0.6, T.papel + 0.8, T.semCond + 0.8, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const TriplexLula: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Triplex" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const TITULO_CAPA = ['O triplex', 'ficou com', 'quem?'];
export const CapaTriplexLula: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · TRIPLEX`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
