import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Bengala, CofreFGTS, Lupa, Onibus, Quepe} from '../../pecas';
import {PontoOnibus} from '../onibusilheus/pecas';
import {MesaMaquete} from '../orcamentoilheus/pecas';
import {CamaraVereadores, CopoPiso, Escola, PilhasDinheiro, PostoGuarda, PostoSaude, Prefeitura, ReguaLimite, RuaServicos, coresOI, grade, yCopo, yRegua, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioPrevidencia, TorresSP} from '../orcamentosp/pecas';
import {PALAVRAS} from './palavras';

// 023. orçamento de salvador (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda da série (014, 017, 020: cofre da prefeitura no meio; aqui
// 1 pilha = R$ 100 MILHÕES; o mar ao fundo e um horizonte de prédios) e encaixa os dois trechos de mapa
// do Kit Mapas (projetos/023.../mapas/salvador.mp4, composição OrcamentoSalvador do kit), com o MESMO relógio.
// SÓ DADOS DE SALVADOR: todo número vem dos PDFs do Portal da Transparência de Salvador (audio/fontes.md).
// Neutro: sem nome de prefeito nem partido.
// Plano: projetos/023. orçamento de salvador/plano.md.

export const FPS = 30;
const AUDIO_SEG = 147.18;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '023. orçamento de salvador';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras (quando() tira vírgula e %: "2,4" vira "24") ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bi: quando('gastou 11,9'),
  primeiro: quando('Primeiro de onde'),
  federal: quando('governo federal'),
  paraOnde: quando('para onde vai'),
  saude: quando('e a saude'),
  n29: quando('2,9 bilhoes'),
  metade: quando('Metade foi'),
  hospitais: quando('para hospitais'),
  educ: quando('vem a educacao'),
  n24: quando('2,4 bilhoes'),
  em2024: quando('Em 2024 tinham'),
  n25: quando('sido 2,5'),
  caiu: quando('Caiu 76'),
  ruas: quando('As ruas'),
  n2: quando('com 2 bilhoes'),
  ruas2024: quando('Em 2024 2,6'),
  aposent: quando('As aposentadorias'),
  n798: quando('798'),
  adm: quando('a administracao'),
  n555: quando('555'),
  maisQue: quando('Mais que assistencia'),
  transp: quando('O transporte'),
  n617: quando('617'),
  gastou201: quando('Gastou 201'),
  onibus: quando('nos onibus'),
  n491: quando('491'),
  sairam128: quando('Sairam 128'),
  repara: quando('Agora repara'),
  seg: quando('A seguranca publica'),
  n125: quando('125'),
  guarda: quando('guarda municipal'),
  camara: quando('a Camara de Vereadores'),
  n284: quando('284'),
  dobro: quando('Mais que o dobro'),
  parte: quando('E tem a parte'),
  de10: quando('De cada 10'),
  tres: quando('reais 3 foram'),
  n37: quando('3,7 bilhoes'),
  obras: quando('Ja obras'),
  n930: quando('930'),
  oito: quando('8 reais em cada'),
  previstos16: quando('previstos 1,6'),
  teve: quando('E teve area'),
  esporte: quando('Esporte e lazer'),
  n29e: quando('previstos 29'),
  sairam91: quando('Sairam 91'),
  triplo: quando('o triplo'),
  agric: quando('a agricultura'),
  n86: quando('86 mil'),
  centavos: quando('3 centavos'),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  n295: quando('em 29,5'),
  abaixo: quando('Bem abaixo'),
  pisos: quando('os pisos'),
  saudeP: quando('A saude precisa'),
  rec232: quando('Recebeu 23,2'),
  eduP: quando('A educacao precisa'),
  rec257: quando('Recebeu 25,7'),
  tribunal: quando('Quem analisa'),
  fimAno: quando('no fim do ano'),
  n486: quando('486'),
  dinheiro: quando('O dinheiro e seu'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'SALVADOR 2025'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.saude, 'SAÚDE'],
  [T.educ, 'EDUCAÇÃO'],
  [T.ruas, 'RUAS E SERVIÇOS'],
  [T.aposent, 'PREVIDÊNCIA E ADMINISTRAÇÃO'],
  [T.transp, 'TRANSPORTE'],
  [T.repara, 'SEGURANÇA × CÂMARA'],
  [T.parte, 'SALÁRIOS × OBRAS'],
  [T.teve, 'ESPORTE E AGRICULTURA'],
  [T.lei, 'O TETO'],
  [T.pisos, 'OS PISOS'],
  [T.fimAno, 'A SOBRA'],
  [T.emQual, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa de 9 m; frente da câmera é z+; o mar fica no fundo à direita) ----------
const COFRE: V3 = [0, 0, 0];
const HOSP: V3 = [-2.2, 0, -5.6];
const PILHAS_SAU: V3 = [-1.6, 0, -3.4];
const ESCOLA: V3 = [-6.2, 0, -2.0];
const PILHAS_EDU: V3 = [-4.3, 0, -0.6];
const PREV: V3 = [1.0, 0, -6.0];
const PILHAS_PREV: V3 = [1.6, 0, -3.9];
const IDOSOS: V3[] = [
  [0.0, 0, -4.9],
  [0.5, 0, -4.7],
  [2.1, 0, -4.8],
];
const PREF: V3 = [6.2, 0, -2.6];
const PILHAS_ADM: V3 = [4.6, 0, -2.7];
const PILHAS_CMP: V3 = [4.6, 0, -1.5];
const RUA: V3 = [-3.6, 0, 4.7];
const PILHAS_RUA: V3 = [-4.0, 0, 3.1];
const PONTO: V3 = [1.0, 0, 5.05];
const RUA_BUS_Z = 6.0;
const PILHAS_BUS: V3 = [1.8, 0, 3.6];
const GUARDA: V3 = [6.6, 0, 0.4];
const BONECO_G: V3 = [5.7, 0, 1.0];
const PILHAS_SEG: V3 = [5.0, 0, 0.3];
const CAMARA: V3 = [6.2, 0, 3.0];
const PILHAS_CAM: V3 = [4.6, 0, 2.2];
const MOEDAS10_Z = 1.5;
const PILHAS_OBR: V3 = [0, 0, 3.0];
const PILHAS_ESP: V3 = [-1.8, 0, 0.2];
const PILHAS_AGR: V3 = [1.8, 0, 0.2];
const REGUA: V3 = [0, 0, 0];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.7];
const ARVORES: V3[] = [
  [-7.8, 0, 3.8],
  [-6.4, 0, 6.2],
  [-1.6, 0, 8.2],
  [7.8, 0, 1.6],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 100 milhões) ----------
// 119 pilhas no anel em volta do cofre (11,9 bilhões). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 30],
      [2.3, 32],
      [2.7, 31],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
type Faixa2 = {ate: number; de: number; a: number; tom: 'aceso' | 'claro'};
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; cena?: number; faixas?: Faixa2[]};
const VOOS: Voo[] = [
  {n: 28.814, t: T.n29, centro: PILHAS_SAU, cols: 6, slots: 30, fim: T.metade, cena: T.educ, faixas: [{de: 0, ate: 14.865, a: T.metade, tom: 'aceso'}]},
  {n: 24.386, t: T.n24, centro: PILHAS_EDU, cols: 6, slots: 26, fim: T.ruas},
  {n: 19.553, t: T.n2, centro: PILHAS_RUA, cols: 7, slots: 27, fim: T.aposent},
  {n: 7.982, t: T.n798, centro: PILHAS_PREV, cols: 4, slots: 8, fim: T.adm},
  {n: 5.553, t: T.n555, centro: PILHAS_ADM, cols: 3, slots: 6, fim: T.transp},
  {n: 2.015, t: T.gastou201, centro: PILHAS_BUS, cols: 4, slots: 7, fim: T.onibus, cena: T.repara, faixas: [{de: 0, ate: 1.283, a: T.sairam128, tom: 'aceso'}]},
  {n: 1.249, t: T.n125, centro: PILHAS_SEG, cols: 2, slots: 2, fim: T.camara, cena: T.parte},
  {n: 2.839, t: T.n284, centro: PILHAS_CAM, cols: 3, slots: 3, fim: T.parte},
];
const ROTAS = (() => {
  const livres = ANEL.map((_, i) => i);
  return VOOS.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(ANEL[a][0] - dest[j][0], ANEL[a][2] - dest[j][2]) - Math.hypot(ANEL[b][0] - dest[j][0], ANEL[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
})();
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));

const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

// o anel e as pilhas das áreas saem de cena em "a parte que quase ninguém vê" (o centro vira palco); o cofre volta na sobra
const SAI_CENTRO = T.parte;
const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, SAI_CENTRO - 0.3, SAI_CENTRO + 0.6)) + rampa(t, T.fimAno - 0.4, T.fimAno + 0.5) * (1 - rampa(t, T.emQual + 0.6, T.emQual + 1.4));

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const afunda = 0.9 * rampa(t, SAI_CENTRO - 0.3, SAI_CENTRO + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 1.2));
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.008, T.paraOnde + 0.5 + i * 0.008);
      const v = DO_VOO[i];
      let pos: V3 = p;
      let n = nasce;
      let corP = ouro;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.03;
        const kv = rampa(t, a, a + 0.7);
        pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        let k = janela(t, voo.t, voo.fim, 0.4);
        (voo.faixas ?? []).forEach((f) => {
          if (j >= f.de - 0.001 && j < f.ate) {
            const sep = janela(t, f.a, voo.cena ?? voo.fim, 0.5);
            if (sep > 0.01) {
              corP = f.tom === 'aceso' ? aceso(sep) : claro(sep);
              k = 0;
            }
          }
        });
        if (k > 0) corP = aceso(k);
        solidas.push({p: desce(pos), n, cor: corP});
        return;
      }
      const fora = rampa(t, SAI_CENTRO - 0.4, SAI_CENTRO + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: n * (1 - fora), cor: corP});
    });
  }
  const afundaF = (a: number) => 1 - rampa(t, a - 0.2, a + 0.5);
  // educação: 2024 tinha 25,15 pilhas; a diferença (0,76) fica marsala e afunda
  const someE = afundaF(T.ruas);
  if (t >= T.em2024 && someE > 0.01) {
    const pos = grade(PILHAS_EDU, 26, 6);
    fantasmas.push(...encher(pos, 25.147 * rampa(t, T.em2024, T.n25 + 0.4) * someE, ouro));
    if (t >= T.caiu) {
      const d = 0.75 * rampa(t, T.caiu + 0.3, T.caiu + 1.4);
      solidas.push({p: [pos[24][0], 0.6 * 0.386 - d, pos[24][2]], n: (1 - 0.386) * someE, cor: C.alerta});
      solidas.push({p: [pos[25][0], -d, pos[25][2]], n: 0.147 * someE, cor: C.alerta});
    }
  }
  // ruas: 2024 tinha 26,29 pilhas
  const someR = afundaF(T.aposent);
  if (t >= T.ruas2024 && someR > 0.01) fantasmas.push(...encher(grade(PILHAS_RUA, 27, 7), 26.291 * rampa(t, T.ruas2024, T.ruas2024 + 0.8) * someR, ouro));
  // administração × assistência + cultura + meio ambiente (4,24 pilhas, em tom claro, ao lado)
  const someC = afundaF(T.transp);
  if (t >= T.maisQue && someC > 0.01) solidas.push(...encher(grade(PILHAS_CMP, 5, 3), 4.244 * rampa(t, T.maisQue, T.maisQue + 0.8) * someC, claro(1)));
  // transporte: previstos 6,17 (transparentes); ônibus 4,91 previstos
  const someT = afundaF(T.repara);
  if (t >= T.n617 && someT > 0.01) fantasmas.push(...encher(grade(PILHAS_BUS, 7, 4), 6.166 * rampa(t, T.n617, T.n617 + 0.8) * someT, ouro));
  // o centro vira palco: obras (previstos 15,99, transparentes; saíram 9,30)
  const someO = afundaF(T.teve);
  if (t >= T.n930 && someO > 0.01) {
    const pos = grade(PILHAS_OBR, 16, 6);
    solidas.push(...encher(pos, 9.304 * rampa(t, T.n930, T.n930 + 0.7) * someO, aceso(janela(t, T.n930, T.teve, 0.4))));
    if (t >= T.previstos16) fantasmas.push(...encher(pos, 15.989 * rampa(t, T.previstos16, T.previstos16 + 0.8) * someO, ouro));
  }
  // esporte: previstos 0,29; saíram 0,915 (mais que o triplo); agricultura: 0,00086 (um fio)
  const someEA = afundaF(T.lei);
  if (t >= T.n29e && someEA > 0.01) fantasmas.push({p: soma(PILHAS_ESP, [-0.5, 0, 0]), n: 0.288 * rampa(t, T.n29e, T.n29e + 0.5) * someEA, cor: ouro});
  if (t >= T.sairam91 && someEA > 0.01) solidas.push({p: soma(PILHAS_ESP, [0.3, 0, 0]), n: 0.915 * rampa(t, T.sairam91, T.sairam91 + 0.6) * someEA, cor: aceso(janela(t, T.sairam91, T.agric, 0.4))});
  if (t >= T.n86 && someEA > 0.01) solidas.push({p: PILHAS_AGR, n: 0.004 * rampa(t, T.n86, T.n86 + 0.4) * someEA, cor: aceso(1)});
  // a sobra do fim do ano: 4,86 pilhas na frente do cofre
  const sobraK = rampa(t, T.n486 - 0.2, T.n486 + 0.6) * (1 - rampa(t, T.emQual + 0.6, T.emQual + 1.4));
  if (sobraK > 0.01) solidas.push(...encher(grade(PILHAS_SOBRA, 5, 5), 4.862 * sobraK, aceso(janela(t, T.n486, T.emQual + 0.6, 0.4))));
  return {solidas, fantasmas};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  const fora = 0.25 * rampa(t, SAI_CENTRO - 0.3, SAI_CENTRO + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.emQual + 0.6 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const busK = vis(t, T.transp - 0.2, SAI_CENTRO);
  const busX = 4.6 - 3.0 * rampa(t, T.transp - 0.2, T.onibus + 0.6, sai);
  const pontoK = predio(T.transp);
  const guardaK = vis(t, T.guarda - 0.3, SAI_CENTRO);
  const idososK = vis(t, T.aposent, SAI_CENTRO);
  const m10K = vis(t, T.de10 - 0.1, T.obras + 0.4);
  const lupaK = vis(t, T.n86, T.lei);
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.pisos, T.pisos + 0.8));
  const nivel = 29.48 * rampa(t, T.n295 - 0.6, T.n295 + 0.4);
  const coposK = rampa(t, T.pisos + 0.3, T.pisos + 1.1) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  const nivelSau = 23.21 * rampa(t, T.saudeP + 0.4, T.rec232 + 0.4);
  const nivelEdu = 25.73 * rampa(t, T.eduP + 0.4, T.rec257 + 0.4);

  return (
    <group>
      <MesaMaquete tema={tema} />
      <group rotation={[0, 0.6, 0]}>
        <TorresSP tema={tema} luz={0.6 + 0.4 * rampa(t, T.paraOnde, T.paraOnde + 1)} />
      </group>
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < SAI_CENTRO ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n486, T.n486 + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.saude + 0.6), janela(t, T.n486, T.emQual, 0.5))} /> : null}

      <PilhasDinheiro pilhas={solidas} max={1500} />
      <PilhasDinheiro pilhas={fantasmas} max={700} opacidade={0.3} largura={1.12} />

      <PostoSaude tema={tema} pos={HOSP} rotY={0.25} escala={1.15} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.educ, 0.5), fim(0))} />
      <Escola tema={tema} pos={ESCOLA} rotY={1.26} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.ruas, 0.5), fim(1))} />
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={predio(T.ruas)} luz={Math.max(janela(t, T.ruas, T.aposent, 0.5), fim(2))} caminhaoX={2.4 - 4.6 * rampa(t, T.ruas, T.ruas + 4.0)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.ruas))} />
      <PredioPrevidencia tema={tema} pos={PREV} rotY={0} escala={0.85} sobe={predio(T.aposent)} aceso={Math.max(janela(t, T.aposent, T.adm, 0.5), fim(3))} />
      {idososK > 0.02
        ? IDOSOS.map((p, i) => {
            const k = entra(t, T.aposent + 0.3 + i * 0.12, 0.45) * idososK;
            return k > 0.02 ? (
              <Boneco key={i} tema={tema} pos={p} rotY={0.1 - i * 0.15} escala={0.45 * Math.min(1, k)} cor={[tema.objeto, tema.objetoClaro, tema.pessoa][i]}>
                <Bengala tema={tema} k={1} />
              </Boneco>
            ) : null;
          })
        : null}
      <Prefeitura tema={tema} pos={PREF} rotY={-1.1} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.transp, 0.5), fim(4))} />
      {pontoK > 0.02 ? (
        <group position={PONTO} rotation={[0, Math.PI / 2, 0]} scale={0.5}>
          <PontoOnibus tema={tema} pos={[0, 0, 0]} sobe={pontoK} aceso={Math.max(janela(t, T.onibus, T.repara, 0.5), fim(5))} />
        </group>
      ) : null}
      {pontoK > 0.02 ? <Caixa args={[4.8, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[1.6, 0.1 - 0.2 * (1 - pontoK), RUA_BUS_Z]} sombra={false} /> : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}
      <PostoGuarda tema={tema} pos={GUARDA} rotY={-1.4} escala={0.85} sobe={predio(T.seg)} aceso={Math.max(janela(t, T.seg, T.camara, 0.5), janela(t, T.dobro, T.parte, 0.4), fim(6))} />
      {guardaK > 0.02 ? (
        <Boneco tema={tema} pos={BONECO_G} rotY={-1.0} escala={0.5 * Math.min(1, guardaK)} cor={tema.objeto}>
          <Quepe tema={tema} />
        </Boneco>
      ) : null}
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={-1.2} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(7))} />

      {/* "a parte que quase ninguém vê": 10 moedas grandes, 3 acendem (salários) */}
      {m10K > 0.02
        ? Array.from({length: 10}).map((_, i) => {
            const k = entra(t, T.de10 + i * 0.06, 0.4) * m10K;
            const acesa = i < 3 ? rampa(t, T.tres + 0.2 + i * 0.12, T.tres + 0.6 + i * 0.12) : 0;
            return <Moeda key={i} tema={tema} pos={[-2.7 + i * 0.6, 0.42 + 0.08 * acesa, MOEDAS10_Z]} rot={[Math.PI / 2, 0, 0]} r={0.27} escala={k} cor={mistura(tema.objeto, C.ouro, acesa)} brilho={0.3 * acesa} />;
          })
        : null}
      {lupaK > 0.02 ? <Lupa tema={tema} pos={soma(PILHAS_AGR, [0, 0.75, 0.25])} rot={[-0.9, 0, 0]} escala={0.45 * lupaK} /> : null}

      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.saudeP + 0.2, T.saudeP + 0.7)} nivel={nivelSau} acima={rampa(t, T.rec232, T.rec232 + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduP + 0.2, T.eduP + 0.7)} nivel={nivelEdu} acima={rampa(t, T.rec257, T.rec257 + 0.6)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0.4], 18.5, 11.5, [0, 1.43, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.paraOnde - 0.3,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.3, E([0, 0, 0.2], 16, 10.5, [0, 1.25, 1])],
      [T.saude - 0.1, E([0, 0, 0], 14.5, 9.5, [0.05, 1.2, 1])],
      [T.n29, E([-1.7, 0.9, -4.2], 6.8, 4.8, [0.25, 0.92, 1])],
      [T.educ - 0.3, E([-1.7, 0.9, -4.1], 6.4, 4.6, [0.1, 0.92, 1])],
    ],
  },
  {
    ini: T.educ - 0.1,
    arco: 0.04,
    chaves: [
      [T.educ - 0.1, E([-4.9, 0.8, -1.0], 6.6, 4.6, [0.55, 0.95, 1])],
      [T.ruas - 0.3, E([-4.8, 0.8, -0.9], 6.2, 4.4, [0.7, 0.95, 1])],
    ],
  },
  {
    ini: T.ruas - 0.1,
    arco: 0.04,
    chaves: [
      [T.ruas - 0.1, E([-3.8, 0.8, 3.6], 6.8, 4.6, [0.15, 0.85, 1])],
      [T.aposent - 0.3, E([-3.6, 0.8, 3.7], 6.4, 4.4, [0.3, 0.85, 1])],
    ],
  },
  {
    ini: T.aposent - 0.1,
    arco: 0.04,
    chaves: [
      [T.aposent - 0.1, E([1.2, 0.9, -4.8], 6.4, 4.6, [0, 0.9, 1])],
      [T.adm - 0.3, E([1.3, 0.9, -4.7], 6.0, 4.4, [-0.15, 0.9, 1])],
      [T.adm + 0.4, E([5.0, 0.9, -2.2], 6.4, 4.6, [-0.55, 0.9, 1])],
      [T.transp - 0.3, E([5.0, 0.9, -2.1], 6.0, 4.4, [-0.7, 0.9, 1])],
    ],
  },
  {
    ini: T.transp - 0.1,
    arco: 0.04,
    chaves: [
      [T.transp - 0.1, E([1.5, 0.6, 4.6], 5.6, 4.2, [0.1, 0.85, 1])],
      [T.repara - 0.3, E([1.6, 0.6, 4.7], 5.2, 4.0, [0.25, 0.85, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([5.4, 0.9, 1.3], 6.8, 4.8, [-0.6, 0.9, 1])],
      [T.parte - 0.3, E([5.4, 0.9, 1.4], 6.4, 4.6, [-0.75, 0.9, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0, 0.6, 1.8], 7.0, 5.0, [0, 0.85, 1])],
      [T.obras + 0.2, E([0, 0.6, 2.6], 6.2, 4.4, [0.05, 0.9, 1])],
      [T.teve - 0.3, E([0, 0.6, 2.6], 5.8, 4.2, [0.15, 0.9, 1])],
    ],
  },
  {
    ini: T.teve - 0.1,
    arco: 0.04,
    chaves: [
      [T.teve - 0.1, E([-1.6, 0.6, 0.2], 3.8, 3.2, [0.2, 0.75, 1])],
      [T.agric - 0.2, E([-1.4, 0.6, 0.2], 3.6, 3.0, [0.1, 0.75, 1])],
      [T.agric + 0.4, E([1.8, 0.5, 0.2], 2.6, 2.4, [-0.2, 0.7, 1])],
      [T.lei - 0.3, E([1.8, 0.5, 0.2], 2.4, 2.2, [-0.3, 0.7, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 0.8, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.n295, E([0, 3.0, 0], 3.2, 7.2, [0.05, 0.28, 1])],
      [T.pisos - 0.2, E([0, 3.0, 0], 3.2, 7.0, [0.1, 0.28, 1])],
    ],
  },
  {
    ini: T.pisos - 0.1,
    arco: 0.04,
    chaves: [
      [T.pisos - 0.1, E([0, 1.9, 0], 6.4, 5.0, [0, 0.4, 1])],
      [T.fimAno - 0.3, E([0, 1.9, 0], 6.0, 4.8, [0.08, 0.4, 1])],
    ],
  },
  {
    ini: T.fimAno - 0.1,
    arco: 0.04,
    chaves: [
      [T.fimAno - 0.1, E([0, 0.8, 0.8], 5.4, 4.0, [0, 0.7, 1])],
      [T.emQual - 0.2, E([0, 0.8, 0.9], 5.0, 3.8, [0.1, 0.7, 1])],
    ],
  },
  {
    ini: T.emQual,
    chaves: [
      [T.emQual, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
      [FIM, E([0, 0, 0], 19, 11.5, [0.3, 1.35, 1])],
    ],
  },
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.paraOnde + 0.3, b: T.saude, texto: 'PARA ONDE VAI'},
  {a: T.saude, b: T.metade, texto: 'A MAIOR FATIA: SAÚDE'},
  {a: T.metade, b: T.educ, texto: 'METADE PARA HOSPITAIS E ATENDIMENTO ESPECIALIZADO', destaque: true},
  {a: T.caiu, b: T.ruas, texto: 'CAIU 76 MILHÕES', destaque: true},
  {a: T.ruas, b: T.aposent, texto: 'RUAS E SERVIÇOS DA CIDADE'},
  {a: T.aposent, b: T.adm, texto: 'APOSENTADORIAS E PENSÕES DOS SERVIDORES'},
  {a: T.adm, b: T.maisQue, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.maisQue, b: T.transp, texto: 'MAIS QUE ASSISTÊNCIA + CULTURA + MEIO AMBIENTE', destaque: true},
  {a: T.transp, b: T.onibus, texto: 'TRANSPORTE: PREVISTO × GASTO'},
  {a: T.onibus, b: T.repara, texto: 'ÔNIBUS: 491 MI PREVISTOS × 128 MI', destaque: true},
  {a: T.repara, b: T.guarda, texto: 'AGORA REPARA'},
  {a: T.guarda, b: T.camara, texto: 'GUARDA MUNICIPAL E DEFESA CIVIL · A POLÍCIA É DO ESTADO'},
  {a: T.camara, b: T.dobro, texto: 'CÂMARA DE VEREADORES'},
  {a: T.dobro, b: T.parte, texto: 'MAIS QUE O DOBRO DA SEGURANÇA', destaque: true},
  {a: T.parte, b: T.de10, texto: 'A PARTE QUE QUASE NINGUÉM VÊ'},
  {a: T.de10, b: T.obras, texto: '3 DE CADA 10 REAIS: SALÁRIOS E ENCARGOS', destaque: true},
  {a: T.obras, b: T.previstos16, texto: 'OBRAS E EQUIPAMENTOS: 8 EM CADA 100'},
  {a: T.previstos16, b: T.teve, texto: 'PREVISTOS: 1,6 BILHÃO'},
  {a: T.teve, b: T.triplo, texto: 'GASTOU BEM MAIS QUE O PREVISTO'},
  {a: T.triplo, b: T.agric, texto: 'MAIS QUE O TRIPLO', destaque: true},
  {a: T.centavos, b: T.lei, texto: '3 CENTAVOS POR MORADOR', destaque: true},
  {a: T.lei, b: T.n295, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.abaixo, b: T.pisos, texto: 'BEM ABAIXO DO TETO', destaque: true},
  {a: T.pisos, b: T.tribunal, texto: 'OS PISOS DA LEI'},
  {a: T.tribunal, b: T.fimAno, texto: 'QUEM ANALISA: TRIBUNAL DE CONTAS DOS MUNICÍPIOS'},
  {a: T.fimAno, b: T.dinheiro, texto: 'RECEITAS − DESPESAS'},
  {a: T.dinheiro, b: T.emQual, texto: 'CONFIRA NO PORTAL DA TRANSPARÊNCIA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.educ, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE SALVADOR · ANEXO 2 · P. 1'},
  {a: T.educ, b: T.ruas, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 2 (2024: RREO DEZ/2024 · ANEXO 2 · P. 2)'},
  {a: T.ruas, b: T.aposent, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 2 (2024: RREO DEZ/2024 · P. 2)'},
  {a: T.aposent, b: T.maisQue, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1'},
  {a: T.maisQue, b: T.transp, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1 E 2'},
  {a: T.transp, b: T.repara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 2 (PREVISTO × GASTO)'},
  {a: T.repara, b: T.parte, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1'},
  {a: T.parte, b: T.teve, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (PESSOAL E INVESTIMENTOS)'},
  {a: T.teve, b: T.centavos, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 2'},
  {a: T.centavos, b: T.lei, texto: 'CONTA DO VÍDEO: R$ 85.760 ÷ 2.610.987 MORADORES = R$ 0,03', destaque: true},
  {a: T.lei, b: T.pisos, texto: 'FONTE: RGF DEZ/2025 · ANEXO 1 · P. 1'},
  {a: T.pisos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · ANEXO 14 · P. 2 E 3'},
  {a: T.fimAno, b: T.emQual, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (SUPERÁVIT)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n29, b: T.metade, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '2,9 BI', sub: 'R$ 2,88 BI · SAÚDE', cor: 'acento'},
  {a: T.metade, b: T.educ, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '1,5 BI', sub: 'HOSPITAIS E ATENDIMENTO ESPECIALIZADO', cor: 'acento'},
  {a: T.n24, b: T.em2024, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '2,4 BI', sub: 'R$ 2,44 BI · EDUCAÇÃO', cor: 'acento'},
  {a: T.em2024, b: T.ruas, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '2024: 2,5 BI', sub: 'R$ 2,51 BI'},
  {a: T.caiu, b: T.ruas, p: soma(PILHAS_EDU, [1.0, 0.3, 0.6]), valor: '−76 MI', cor: 'alerta', dy: -40},
  {a: T.n2, b: T.ruas2024, p: soma(PILHAS_RUA, [0, 1.1, 0]), valor: '2 BI', sub: 'R$ 1,96 BI · URBANISMO', cor: 'acento'},
  {a: T.ruas2024, b: T.aposent, p: soma(PILHAS_RUA, [0, 1.1, 0]), valor: '2024: 2,6 BI', sub: 'R$ 2,63 BI'},
  {a: T.n798, b: T.adm, p: soma(PILHAS_PREV, [0, 1.1, 0.2]), valor: '798 MI', sub: 'APOSENTADORIAS E PENSÕES', cor: 'acento'},
  {a: T.n555, b: T.transp, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '555 MI', sub: 'R$ 555,3 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.maisQue + 0.4, b: T.transp, p: soma(PILHAS_CMP, [0, 0.9, 0.2]), valor: '424 MI', sub: 'ASSISTÊNCIA 304 + CULTURA 82 + MEIO AMBIENTE 38', dy: -110},
  {a: T.n617, b: T.gastou201, p: soma(PILHAS_BUS, [0, 1.1, 0]), valor: 'PREVISTO: 617 MI', sub: 'TRANSPORTE'},
  {a: T.gastou201, b: T.onibus, p: soma(PILHAS_BUS, [0, 1.1, 0]), valor: '201 MI', sub: 'R$ 201,5 MI · GASTO', cor: 'acento'},
  {a: T.sairam128, b: T.repara, p: soma(PILHAS_BUS, [0, 1.1, 0]), valor: '128 MI', sub: 'ÔNIBUS · PREVISTOS 491 MI', cor: 'acento'},
  {a: T.n125, b: T.parte, p: soma(PILHAS_SEG, [0, 1.0, 0]), valor: '125 MI', sub: 'SEGURANÇA PÚBLICA'},
  {a: T.n284, b: T.parte, p: soma(PILHAS_CAM, [0, 1.1, 0]), valor: '284 MI', sub: 'CÂMARA DE VEREADORES', cor: 'acento'},
  {a: T.n37, b: T.obras, p: [-1.8, 1.0, MOEDAS10_Z], valor: '3,7 BI', sub: 'R$ 3,74 BI · SALÁRIOS E ENCARGOS', cor: 'acento'},
  {a: T.n930, b: T.teve, p: soma(PILHAS_OBR, [0, 1.1, 0.2]), valor: '930 MI', sub: 'OBRAS E EQUIPAMENTOS · GASTO', cor: 'acento'},
  {a: T.previstos16 + 0.3, b: T.teve, p: soma(PILHAS_OBR, [0, 1.1, 0.2]), valor: 'PREVISTO: 1,6 BI', sub: 'R$ 1,60 BI'},
  {a: T.n29e, b: T.agric, p: soma(PILHAS_ESP, [-0.5, 0.6, 0]), valor: 'PREVISTO: 29 MI', sub: 'ESPORTE E LAZER', dy: 40},
  {a: T.sairam91, b: T.agric, p: soma(PILHAS_ESP, [0.3, 0.6, 0]), valor: '91 MI', sub: 'R$ 91,5 MI · GASTO', cor: 'acento', dy: -150},
  {a: T.n86, b: T.lei, p: soma(PILHAS_AGR, [0, 0.35, 0]), valor: '86 MIL', sub: 'R$ 85.760 · AGRICULTURA', cor: 'acento'},
  {a: T.n54, b: T.pisos - 0.2, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.rec232, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(23.2) + 0.3, 0.6]), valor: '23,2%', sub: 'SAÚDE · MÍNIMO 15%', cor: 'acento'},
  {a: T.rec257, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(25.7) + 0.3, 0.6]), valor: '25,7%', sub: 'EDUCAÇÃO · MÍNIMO 25%', cor: 'acento'},
  {a: T.n486, b: T.emQual + 0.6, p: soma(PILHAS_SOBRA, [0, 1.0, 0]), valor: '486 MI', sub: 'R$ 486,2 MI · RECEITAS − DESPESAS', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.parte);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${seloAtual.destaque ? tema.acento : tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 64 ? 14 : seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21, fontWeight: 700, letterSpacing: 1.2, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 100 MILHÕES</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.primeiro ? 'FONTE: RREO DEZ/2025 · PREFEITURA DE SALVADOR · ANEXO 1 · P. 2' : t < T.federal - 0.8 ? 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 E 2 (RECEITAS)' : 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 (TRANSFERÊNCIAS)';
    const k = Math.min(entra(t, T.bi, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 210, Math.min(SEGURO.botoesX - 210, pj.x)), y: Math.max(640, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n295K = entra(t, T.n295, 0.5) * (1 - rampa(t, T.pisos - 0.3, T.pisos));
  const comentaK = vis(t, T.emQual, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 44 ? 18 : chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {numeroGrande('29,5%', 'SALÁRIOS · TETO 54%', n295K, tema.acento)}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>QUAL ÁREA PRECISA DE MAIS?</div>
            <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: rampa(t, T.comentarios, T.comentarios + 0.4)}}>COMENTA AQUI</div>
            {t >= T.segue ? <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 900, letterSpacing: -1, color: tema.acento, marginTop: 10, opacity: rampa(t, T.segue + 0.4, T.segue + 0.9)}}>@eumagnoleite</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/salvador.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.bi + 0.6, f: 'pop', v: 0.22});
  [quando('12,4 bilhoes'), quando('Pouco mais de 1'), quando('3,3 bilhoes')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.03 + 0.6, f: 'pop', v: 0.07});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n29, T.n24, T.n2, T.n798, T.n555, T.gastou201, T.sairam128, T.n125, T.n284, T.n37, T.n930, T.sairam91, T.n86].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.em2024, f: 'subida', v: 0.14});
  s.push({t: T.caiu + 0.3, f: 'baque', v: 0.22});
  s.push({t: T.ruas2024, f: 'subida', v: 0.14});
  s.push({t: T.maisQue, f: 'subida', v: 0.14});
  s.push({t: T.n617, f: 'subida', v: 0.14});
  s.push({t: T.dobro, f: 'baque', v: 0.18});
  for (let i = 0; i < 10; i++) s.push({t: T.de10 + i * 0.06, f: 'pop', v: 0.06});
  s.push({t: T.previstos16, f: 'subida', v: 0.14});
  s.push({t: T.triplo, f: 'ding', v: 0.18});
  s.push({t: T.centavos, f: 'baque', v: 0.2});
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.n295 - 0.4, f: 'subida', v: 0.2});
  s.push({t: T.abaixo, f: 'ding', v: 0.18});
  s.push({t: T.pisos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.rec232, f: 'ding', v: 0.18});
  s.push({t: T.rec257, f: 'ding', v: 0.18});
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n486, f: 'pop', v: 0.24});
  for (let i = 0; i < 8; i++) s.push({t: T.emQual + 0.6 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 5.0, 9.0, 16.0, 20.5, 23.0, 25.8, 27.5, 30.0, T.paraOnde + 0.8, T.n29 + 1.0, T.metade + 1.0, T.n24 + 0.8, T.n25 + 0.6, T.caiu + 1.0, T.n2 + 0.8, T.ruas2024 + 0.8,
  T.n798 + 0.8, T.n555 + 0.6, T.maisQue + 1.2, T.n617 + 0.8, T.gastou201 + 0.6, T.sairam128 + 0.6, T.n125 + 0.6, T.guarda + 0.6, T.n284 + 0.6, T.dobro + 0.3,
  T.tres + 0.8, T.n37 + 0.6, T.n930 + 0.6, T.previstos16 + 0.8, T.n29e + 0.6, T.sairam91 + 0.6, T.n86 + 0.6, T.centavos + 0.4, T.n54 + 0.4, T.n295 + 0.6, T.abaixo + 0.4,
  T.rec232 + 0.6, T.rec257 + 0.6, T.tribunal + 1.0, T.fimAno + 1.0, T.n486 + 0.6, T.dinheiro + 0.4, T.emQual + 1.2, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoSalvador: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = soMapa(t) ? null : (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={12} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
    </ThreeCanvas>
  );
  const mapas = (
    <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
      <TrechoMapa {...MAPA} />
    </Sequence>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Salvador" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['11,9 bi.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoSalvador: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE SALVADOR`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
