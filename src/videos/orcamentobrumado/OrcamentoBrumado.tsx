import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, Cone, RoloCompactador} from '../../pecas';
import {
  BancoDivida,
  BaseDefesaCivil,
  CamaraVereadores,
  CopoPiso,
  EstacaoSaneamento,
  PredioAssistencia,
  TeatroMini,
  Escola,
  MesaMaquete,
  PilhasDinheiro,
  PostoSaude,
  PredioTCM,
  Prefeitura,
  ReguaLimite,
  RuaServicos,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from '../orcamentoitabuna/pecas';
import {SerraSertao} from './pecas';
import {PALAVRAS} from './palavras';

// 026. orçamento de brumado (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda da série (cofre da prefeitura no meio, pilhas de dinheiro;
// aqui 1 pilha = R$ 5 MILHÕES, 80 pilhas; serra e morros do sertão na borda) e encaixa os dois trechos
// de mapa do Kit Mapas (projetos/026.../mapas/brumado.mp4, composição OrcamentoBrumado do kit).
// SÓ DADOS DE BRUMADO: todo número vem dos relatórios publicados no Diário Oficial de Brumado
// (audio/fontes.md, com página). Neutro: sem nome de prefeito nem partido.
// Plano: projetos/026. orçamento de brumado/plano.md.

export const FPS = 30;
const AUDIO_SEG = 148.56;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '026. orçamento de brumado';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bi: quando('gastou 398'),
  primeiro: quando('Primeiro'),
  federal: quando('governo federal'),
  paraOnde: quando('para onde vai'),
  maiorFatia: quando('A maior fatia'),
  n162: quando('162'),
  quatro10: quando('4 de cada 10 reais'),
  em2024: quando('Em 2024'),
  n133: quando('133'),
  quase8: quando('quase 8'),
  fundamental: quando('ensino fundamental'),
  saude: quando('Depois vem a saude'),
  n123: quando('123'),
  doisDe3: quando('2 de cada 3'),
  transp: quando('O transporte nas'),
  n13: quando('13 milhoes'),
  dobroPrev: quando('Quase o dobro do previsto'),
  cultura: quando('a cultura gastou'),
  n7: quando('7 milhoes'),
  triplo: quando('Mais que o triplo'),
  assist: quando('Ja a assistencia'),
  n106: quando('Tinha 10,6'),
  gastou33: quando('Gastou 3,3'),
  terco: quando('Menos de 1 terco'),
  zero: quando('ficou no zero'),
  ambiente: quando('Meio ambiente'),
  habit: quando('habitacao e'),
  saneam: quando('e saneamento'),
  nada: quando('Nao gastaram'),
  repara: quando('Agora repara'),
  seg: quando('A seguranca publica'),
  n34: quando('custou 3,4'),
  guarda: quando('guarda municipal'),
  policia: quando('A policia'),
  defesa: quando('E a defesa civil tinha'),
  zeroDef: quando('Gastou zero'),
  camara: quando('a Camara de Vereadores'),
  n109: quando('custou 10,9'),
  tres: quando('Mais de 3 vezes'),
  adm: quando('toda a administracao'),
  n128: quando('com 12,8'),
  parte: quando('E tem a parte'),
  salarios: quando('para salarios'),
  n155: quando('155'),
  obras: quando('Ja obras'),
  n18: quando('18 milhoes'),
  previstos: quando('Estavam previstos 35'),
  divida: quando('a divida levou'),
  n18b: quando('18 milhoes', 2),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  estaEm: quando('Brumado esta em'),
  alerta: quando('limite de alerta'),
  pisos: quando('E os pisos'),
  saudeP: quando('A saude precisa'),
  rec1: quando('Recebeu 33,4'),
  dobroMin: quando('Mais que o dobro do minimo'),
  eduP: quando('A educacao precisa'),
  rec2: quando('Recebeu 28,5'),
  tribunal: quando('Tribunal de Contas'),
  fimAno: quando('no fim do ano'),
  n34s: quando('em 34 milhoes'),
  seu: quando('O dinheiro e seu'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'BRUMADO 2025'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.maiorFatia, 'EDUCAÇÃO'],
  [T.saude, 'SAÚDE'],
  [T.transp, 'ACIMA DO PREVISTO'],
  [T.assist, 'ABAIXO DO PREVISTO'],
  [T.zero, 'NO ZERO'],
  [T.repara, 'SEGURANÇA × CÂMARA'],
  [T.parte, 'SALÁRIOS × OBRAS'],
  [T.lei, 'O TETO'],
  [T.pisos, 'OS PISOS'],
  [T.fimAno, 'A SOBRA'],
  [T.seu, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-7.1, 0, -0.9];
const PILHAS_EDU: V3 = [-4.6, 0, -3.2];
const HOSP: V3 = [-0.4, 0, -6.0];
const PILHAS_SAU: V3 = [-0.4, 0, -3.8];
const RUA: V3 = [-3.6, 0, 4.7];
const PILHAS_TR: V3 = [-3.9, 0, 3.0];
const TEATRO: V3 = [-6.6, 0, 2.3];
const PILHAS_CUL: V3 = [-5.2, 0, 1.2];
const ASSIST: V3 = [6.7, 0, 2.6];
const PILHAS_ASS: V3 = [5.1, 0, 2.2];
const PILHAS_ZERO: V3[] = [
  [-0.9, 0, 3.4],
  [0.3, 0, 3.4],
  [1.5, 0, 3.4],
];
const SANEAM: V3 = [2.0, 0, 5.4];
const PREF: V3 = [5.4, 0, -3.9];
const PILHAS_ADM: V3 = [3.9, 0, -2.4];
const CAMARA: V3 = [-3.6, 0, -6.5];
const PILHAS_CAM: V3 = [-2.6, 0, -5.2];
const DEFESA: V3 = [-6.4, 0, -4.9];
const PILHAS_SEG: V3 = [-5.4, 0, -3.6];
const PILHAS_DEF: V3 = [-4.6, 0, -3.6];
const OBRA: V3 = [-1.6, 0, 3.6];
const PILHAS_OBR: V3 = [0.2, 0, 3.6];
const BANCO: V3 = [5.7, 0, 5.0];
const PILHAS_DIV: V3 = [3.9, 0, 3.6];
const REGUA: V3 = [0, 0, 0];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.7];
const CASAS: [V3, number][] = [
  [[-6.0, 0, -6.4], 0.6],
  [[3.4, 0, -7.6], -0.3],
  [[7.6, 0, -2.0], -1.2],
  [[-8.1, 0, 0.4], 1.4],
];
const ARVORES: V3[] = [
  [-7.4, 0, 4.0],
  [-5.8, 0, 6.6],
  [7.6, 0, -0.6],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 5 milhões) ----------
const anel = (desloca = 0): V3[] => {
  const s: V3[] = [];
  (
    [
      [1.5, 20],
      [1.9, 26],
      [2.3, 34],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r + desloca;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
};
// fase 1: o gasto por área. As pilhas voam do anel para cada área, na palavra do número.
const ANEL: V3[] = anel();
// fase 2 ("a parte que quase ninguém vê"): o dinheiro todo de novo no anel, agora separado em salários, obras e dívida
const ANEL2: V3[] = anel(0.07);

type Faixa2 = {de: number; ate: number; a: number; tom: 'aceso' | 'claro'};
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; cena?: number; faixas?: Faixa2[]; passo?: number};
const VOOS: Voo[] = [
  {n: 32.322, t: T.n162, centro: PILHAS_EDU, cols: 6, slots: 36, fim: T.quase8, cena: T.saude, faixas: [{de: 0, ate: 25.084, a: T.quase8, tom: 'aceso'}]},
  {n: 24.677, t: T.n123, centro: PILHAS_SAU, cols: 6, slots: 30, fim: T.doisDe3, cena: T.transp, faixas: [{de: 0, ate: 16.439, a: T.doisDe3, tom: 'aceso'}]},
  {n: 2.669, t: T.n13, centro: PILHAS_TR, cols: 3, slots: 3, fim: T.assist},
  {n: 1.443, t: T.n7, centro: PILHAS_CUL, cols: 2, slots: 2, fim: T.assist},
  {n: 0.659, t: T.gastou33, centro: PILHAS_ASS, cols: 3, slots: 3, fim: T.zero},
  {n: 0.683, t: T.n34, centro: PILHAS_SEG, cols: 1, slots: 1, fim: T.parte},
  {n: 2.185, t: T.n109, centro: PILHAS_CAM, cols: 3, slots: 3, fim: T.parte},
  {n: 2.566, t: T.n128, centro: PILHAS_ADM, cols: 3, slots: 3, fim: T.parte},
];
const rotas = (base: V3[], voos: Voo[]) => {
  const livres = base.map((_, i) => i);
  return voos.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(base[a][0] - dest[j][0], base[a][2] - dest[j][2]) - Math.hypot(base[b][0] - dest[j][0], base[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
};
const ROTAS = rotas(ANEL, VOOS);
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));
// fase 2: obras (6,7 pilhas) e dívida (7,8 pilhas) voam do anel; 71,3 pilhas (salários) acendem no anel
const VOOS2: Voo[] = [
  {n: 3.64, t: T.n18, centro: PILHAS_OBR, cols: 4, slots: 8, fim: T.divida},
  {n: 3.556, t: T.n18b, centro: PILHAS_DIV, cols: 2, slots: 4, fim: T.lei},
];
const ROTAS2 = rotas(ANEL2, VOOS2);
const DO_VOO2: number[] = ANEL2.map(() => -1);
ROTAS2.forEach((r, v) => r.de.forEach((i) => (DO_VOO2[i] = v)));
const SALARIO2 = (() => {
  const livres = ANEL2.map((_, i) => i).filter((i) => DO_VOO2[i] < 0);
  return new Set(livres.slice(0, 31));
})();

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.lei - 0.2, T.lei + 0.7)) + rampa(t, T.fimAno - 0.4, T.fimAno + 0.5) * (1 - rampa(t, T.seu + 0.6, T.seu + 1.4));

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  // fase 1: as pilhas das áreas afundam na "parte que quase ninguém vê" e voltam no fim
  const afunda = 0.9 * rampa(t, T.parte - 0.2, T.parte + 0.8) * (1 - rampa(t, T.seu, T.seu + 1.2));
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.006, T.paraOnde + 0.5 + i * 0.006);
      const v = DO_VOO[i];
      let corP = ouro;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.03;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
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
      // as pilhas que ficam no anel afundam com o cofre na "parte que quase ninguém vê"
      const fora = rampa(t, T.parte - 0.4, T.parte + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: n0(nasce) * (1 - fora), cor: corP});
    });
  }
  // educação: em 2024 foram 133 milhões (26,6 pilhas transparentes ao lado)
  const someEdu = 1 - rampa(t, T.quase8 - 0.2, T.quase8 + 0.4);
  if (t >= T.em2024 - 0.1 && someEdu > 0.01) fantasmas.push(...encher(grade(soma(PILHAS_EDU, [0, 0, 3.0]), 27, 9), 26.55 * rampa(t, T.em2024, T.em2024 + 0.8) * someEdu, ouro));
  // o previsto em pilhas transparentes: transporte (1,5), cultura (0,44), assistência (2,1)
  const someAcima = 1 - rampa(t, T.assist - 0.2, T.assist + 0.4);
  if (t >= T.dobroPrev - 0.1 && someAcima > 0.01) fantasmas.push(...encher(grade(soma(PILHAS_TR, [0, 0, 0.8]), 2, 2), 1.49 * rampa(t, T.dobroPrev, T.dobroPrev + 0.6) * someAcima, ouro));
  if (t >= T.triplo - 0.1 && someAcima > 0.01) fantasmas.push(...encher(grade(soma(PILHAS_CUL, [0, 0, 0.8]), 1, 1), 0.439 * rampa(t, T.triplo, T.triplo + 0.6) * someAcima, ouro));
  const someAss = 1 - rampa(t, T.zero - 0.2, T.zero + 0.4);
  if (t >= T.n106 - 0.1 && someAss > 0.01) fantasmas.push(...encher(grade(PILHAS_ASS, 3, 3), 2.126 * rampa(t, T.n106, T.n106 + 0.6) * someAss, ouro));
  // no zero: meio ambiente (0,31), habitação (0,18) e saneamento (0,05) só no previsto
  const someZero = 1 - rampa(t, T.repara - 0.2, T.repara + 0.5);
  [
    [T.ambiente, 0.308],
    [T.habit, 0.184],
    [T.saneam, 0.048],
  ].forEach(([a0, n], i) => {
    if (t >= a0 - 0.1 && someZero > 0.01) fantasmas.push({p: PILHAS_ZERO[i], n: Math.max(0.06, n) * rampa(t, a0, a0 + 0.5) * someZero, cor: ouro});
  });
  // defesa civil: 1,6 milhão previsto (transparente), gasto zero
  const someDef = 1 - rampa(t, T.parte - 0.2, T.parte + 0.5);
  if (t >= T.defesa && someDef > 0.01) fantasmas.push({p: PILHAS_DEF, n: 0.317 * rampa(t, T.defesa, T.defesa + 0.5) * someDef, cor: ouro});
  // fase 2: o dinheiro todo de volta no anel; quase metade (salários) acende; obras e dívida voam
  const k2 = rampa(t, T.parte + 0.2, T.parte + 1.0) * (1 - rampa(t, T.lei - 0.2, T.lei + 0.7));
  if (k2 > 0.01) {
    ANEL2.forEach((p, i) => {
      const nasce = k2 * rampa(t, T.parte + 0.2 + i * 0.004, T.parte + 0.6 + i * 0.004);
      const v = DO_VOO2[i];
      if (v >= 0) {
        const voo = VOOS2[v];
        const j = ROTAS2[v].de.indexOf(i);
        const a = voo.t + j * 0.05;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS2[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = janela(t, voo.t, voo.fim, 0.4);
        solidas.push({p: pos, n, cor: k > 0.01 ? aceso(k) : ouro});
        return;
      }
      const sal = SALARIO2.has(i) ? janela(t, T.salarios, T.obras, 0.5) : 0;
      solidas.push({p, n: nasce, cor: sal > 0.01 ? aceso(sal) : ouro});
    });
    // obras e equipamentos previstos: 35 milhões (7 pilhas transparentes)
    if (t >= T.previstos) fantasmas.push(...encher(grade(PILHAS_OBR, 8, 4), 6.994 * rampa(t, T.previstos, T.previstos + 0.9) * k2, ouro));
  }
  // a sobra do fim do ano: 6,9 pilhas na frente do cofre
  const sobraK = rampa(t, T.n34s - 0.2, T.n34s + 0.6) * (1 - rampa(t, T.seu + 0.6, T.seu + 1.4));
  if (sobraK > 0.01) solidas.push(...encher(grade(PILHAS_SOBRA, 8, 4), 6.885 * sobraK, aceso(janela(t, T.n34s, T.seu + 0.6, 0.4))));
  return {solidas, fantasmas};
};
const n0 = (x: number) => x;

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam um pouco na "parte que quase ninguém vê" e voltam no fim
  const fora = 0.25 * rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.seu, T.seu + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.seu + 0.6 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const obraK = vis(t, T.obras - 0.1, T.lei);
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.pisos, T.pisos + 0.8));
  const nivel = 45.38 * rampa(t, T.estaEm - 0.2, T.estaEm + 1.4);
  const coposK = rampa(t, T.pisos + 0.2, T.pisos + 1.0) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  const nivelSau = 30 * rampa(t, T.rec1 - 0.3, T.rec1 + 0.9);
  const nivelEdu = 28.48 * rampa(t, T.rec2 - 0.3, T.rec2 + 0.9);
  const tcmK = rampa(t, T.tribunal - 0.3, T.tribunal + 0.7) * (1 - rampa(t, T.fimAno, T.fimAno + 0.5));

  return (
    <group>
      <MesaMaquete tema={tema} />
      <SerraSertao tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < T.lei ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n34s, T.n34s + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.maiorFatia + 0.6), janela(t, T.n34s, T.seu, 0.5))} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1200} />
      <PilhasDinheiro pilhas={fantasmas} max={500} opacidade={0.3} largura={1.12} />

      {/* educação e saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.35} escala={0.85} sobe={predio(T.maiorFatia)} aceso={Math.max(janela(t, T.maiorFatia, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.05} escala={1.1} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.transp, 0.5), fim(1))} />

      {/* transporte nas estradas e cultura: acima do previsto */}
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={predio(T.transp)} luz={Math.max(janela(t, T.transp, T.assist, 0.5), fim(2))} caminhaoX={2.4 - 4.6 * rampa(t, T.transp, T.transp + 5)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.transp))} />
      <TeatroMini tema={tema} pos={TEATRO} rotY={1.2} escala={0.8} sobe={predio(T.cultura)} aceso={Math.max(janela(t, T.cultura, T.assist, 0.5), fim(3))} />

      {/* assistência social: abaixo do previsto */}
      <PredioAssistencia tema={tema} pos={ASSIST} rotY={-1.3} escala={0.8} sobe={predio(T.assist)} aceso={Math.max(janela(t, T.assist, T.zero, 0.5), fim(4))} />

      {/* no zero: o saneamento aparece como estação apagada */}
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={0.2} escala={0.5} sobe={predio(T.saneam)} aceso={Math.max(0.15 * janela(t, T.saneam, T.repara, 0.5), fim(5))} />

      {/* administração (comparada com a Câmara) */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.7} escala={0.85} sobe={predio(T.adm - 0.8)} aceso={Math.max(janela(t, T.adm, T.parte, 0.5), fim(6))} />

      {/* segurança (defesa civil) e Câmara */}
      <BaseDefesaCivil tema={tema} pos={DEFESA} rotY={0.9} escala={0.75} sobe={predio(T.seg)} aceso={Math.max(janela(t, T.seg, T.camara, 0.5), fim(7))} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={0.35} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(8))} />

      {/* obras e equipamentos */}
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK) * 0.8}>
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} raio={0.03} cor={mistura(C.alerta, C.areia, 0.4)} position={[0, 0.17 + i * 0.22, 0]} />
          ))}
          {[0, 1].map((i) => (
            <Caixa key={i} args={[1.3, 0.06, 0.18]} raio={0.02} cor={C.madeira} position={[0.2, 0.1 + i * 0.07, 0.6 + i * 0.05]} rotation={[0, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[OBRA[0] - 0.7, 0.06, OBRA[2] - 0.6]} k={0.7 * obraK} />
      <RoloCompactador tema={tema} pos={[OBRA[0] - 1.0, 0.06, OBRA[2] + 0.5]} rotY={0.6} escala={0.3 * obraK} giro={t * 0.8} />

      {/* dívida */}
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.7} escala={0.85} sobe={predio(T.divida)} aceso={Math.max(janela(t, T.divida, T.lei, 0.5), fim(9))} />

      {/* a régua do teto: 45,4% (alerta 48,6, máximo 54) */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={rampa(t, T.alerta, T.alerta + 0.5)} maximo={rampa(t, T.n54, T.n54 + 0.5)} />

      {/* os copos dos pisos e o Tribunal de Contas dos Municípios */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.saudeP, T.saudeP + 0.5)} nivel={nivelSau} acima={rampa(t, T.rec1 + 0.6, T.rec1 + 1.1)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduP, T.eduP + 0.5)} nivel={nivelEdu} acima={rampa(t, T.rec2 + 0.6, T.rec2 + 1.1)} />
      <PredioTCM tema={tema} pos={[0, 0, -3.4]} sobe={tcmK} aceso={janela(t, T.tribunal, T.fimAno, 0.5)} escala={0.9} />
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
      [T.maiorFatia - 0.1, E([0, 0, 0], 15, 9.8, [0.05, 1.2, 1])],
    ],
  },
  {
    ini: T.maiorFatia + 0.3,
    arco: 0.04,
    chaves: [
      [T.maiorFatia + 0.3, E([-4.8, 0.8, -2.2], 7.2, 5.2, [0.5, 0.95, 1])],
      [T.saude - 0.3, E([-4.8, 0.8, -2.1], 6.8, 5.0, [0.7, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-0.4, 0.9, -4.6], 6.6, 4.6, [0.25, 0.92, 1])],
      [T.transp - 0.3, E([-0.4, 0.9, -4.5], 6.2, 4.4, [0.1, 0.92, 1])],
    ],
  },
  {
    ini: T.transp - 0.1,
    arco: 0.04,
    chaves: [
      [T.transp - 0.1, E([-3.8, 0.7, 3.6], 6.0, 4.4, [0.2, 0.85, 1])],
      [T.cultura, E([-5.2, 0.8, 2.0], 6.0, 4.4, [0.5, 0.85, 1])],
      [T.assist - 0.3, E([-5.2, 0.8, 2.0], 5.6, 4.2, [0.6, 0.85, 1])],
    ],
  },
  {
    ini: T.assist - 0.1,
    arco: 0.04,
    chaves: [
      [T.assist - 0.1, E([5.6, 0.8, 2.4], 5.4, 4.0, [-0.55, 0.85, 1])],
      [T.zero - 0.3, E([5.6, 0.8, 2.4], 5.0, 3.8, [-0.4, 0.85, 1])],
    ],
  },
  {
    ini: T.zero - 0.1,
    arco: 0.04,
    chaves: [
      [T.zero - 0.1, E([0.4, 0.5, 4.0], 5.6, 4.0, [0, 0.85, 1])],
      [T.repara - 0.3, E([0.6, 0.5, 4.2], 5.2, 3.8, [0.1, 0.85, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([-5.0, 0.9, -4.6], 6.6, 4.6, [0.4, 0.95, 1])],
      [T.camara, E([-3.4, 0.9, -5.4], 6.6, 4.6, [0.3, 0.95, 1])],
      [T.adm - 0.2, E([0.8, 0.9, -4.2], 11.0, 7.0, [0, 1.05, 1])],
      [T.parte - 0.3, E([0.8, 0.9, -4.2], 10.6, 6.8, [0.05, 1.05, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0, 0.4, 0.6], 8.6, 5.8, [0, 1.05, 1])],
      [T.obras + 0.2, E([0.6, 0.5, 2.4], 8.0, 5.4, [0, 0.95, 1])],
      [T.divida + 0.2, E([2.0, 0.5, 2.8], 8.0, 5.4, [-0.15, 0.95, 1])],
      [T.lei - 0.3, E([2.0, 0.5, 2.8], 7.6, 5.2, [-0.25, 0.95, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 1.2, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.alerta, E([0, 3.4, 0], 3.0, 6.0, [0.05, 0.28, 1])],
      [T.pisos - 0.2, E([0, 3.4, 0], 3.0, 5.8, [0.1, 0.28, 1])],
    ],
  },
  {
    ini: T.pisos - 0.1,
    arco: 0.04,
    chaves: [
      [T.pisos - 0.1, E([0, 1.9, 0], 6.4, 5.0, [0, 0.4, 1])],
      [T.tribunal - 0.3, E([0, 1.9, -0.6], 7.4, 5.4, [0.05, 0.5, 1])],
      [T.fimAno - 0.3, E([0, 1.9, -0.6], 7.0, 5.2, [0.08, 0.5, 1])],
    ],
  },
  {
    ini: T.fimAno - 0.1,
    arco: 0.04,
    chaves: [
      [T.fimAno - 0.1, E([0, 0.8, 0.8], 5.4, 4.0, [0, 0.7, 1])],
      [T.seu - 0.2, E([0, 0.8, 0.9], 5.0, 3.8, [0.1, 0.7, 1])],
    ],
  },
  {
    ini: T.seu,
    chaves: [
      [T.seu, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
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
  {a: T.paraOnde + 0.3, b: T.maiorFatia, texto: 'GASTOS DE 2025: R$ 398 MILHÕES'},
  {a: T.maiorFatia, b: T.quatro10, texto: 'A MAIOR FATIA'},
  {a: T.quatro10, b: T.em2024, texto: '4 DE CADA 10 REAIS', destaque: true},
  {a: T.em2024, b: T.quase8, texto: 'EM 2024: 133 MILHÕES'},
  {a: T.quase8, b: T.saude, texto: 'QUASE 8 DE CADA 10: ENSINO FUNDAMENTAL', destaque: true},
  {a: T.doisDe3, b: T.transp, texto: '2 DE CADA 3: HOSPITAIS E ESPECIALIZADO', destaque: true},
  {a: T.transp, b: T.dobroPrev, texto: 'TRANSPORTE NAS ESTRADAS'},
  {a: T.dobroPrev, b: T.cultura, texto: 'QUASE O DOBRO DO PREVISTO', destaque: true},
  {a: T.triplo, b: T.assist, texto: 'MAIS QUE O TRIPLO DO PREVISTO', destaque: true},
  {a: T.assist, b: T.terco, texto: 'ASSISTÊNCIA SOCIAL: PREVISTO × GASTO'},
  {a: T.terco, b: T.zero, texto: 'MENOS DE 1 TERÇO', destaque: true},
  {a: T.zero, b: T.nada, texto: 'TEM ÁREA QUE FICOU NO ZERO'},
  {a: T.nada, b: T.repara, texto: 'PREVISTO NO ORÇAMENTO · GASTO: ZERO', destaque: true},
  {a: T.repara, b: T.seg, texto: 'AGORA REPARA'},
  {a: T.guarda, b: T.policia, texto: 'NO MUNICÍPIO: GUARDA E DEFESA CIVIL'},
  {a: T.policia, b: T.defesa, texto: 'A POLÍCIA É DO ESTADO'},
  {a: T.zeroDef, b: T.camara, texto: 'DEFESA CIVIL: GASTO ZERO', destaque: true},
  {a: T.tres, b: T.adm, texto: 'MAIS DE 3 VEZES A SEGURANÇA', destaque: true},
  {a: T.adm, b: T.parte, texto: 'CÂMARA 10,9 MI · ADMINISTRAÇÃO 12,8 MI'},
  {a: T.parte, b: T.salarios, texto: 'O DINHEIRO TODO: R$ 398 MILHÕES'},
  {a: T.salarios, b: T.obras, texto: '4 DE CADA 10: SALÁRIOS E ENCARGOS', destaque: true},
  {a: T.previstos, b: T.divida, texto: 'PREVISTO × GASTO'},
  {a: T.divida, b: T.lei, texto: 'DÍVIDA: QUASE O MESMO QUE AS OBRAS', destaque: true},
  {a: T.lei, b: T.estaEm, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.alerta, b: T.pisos, texto: 'ABAIXO DO LIMITE DE ALERTA (48,6%)', destaque: true},
  {a: T.pisos, b: T.saudeP, texto: 'OS PISOS DA LEI'},
  {a: T.dobroMin, b: T.eduP, texto: 'SAÚDE: MAIS QUE O DOBRO DO MÍNIMO', destaque: true},
  {a: T.tribunal, b: T.fimAno, texto: 'QUEM ANALISA: TCM DA BAHIA'},
  {a: T.fimAno, b: T.seu, texto: 'RECEITAS − DESPESAS'},
];
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.maiorFatia, texto: 'FONTE: RREO DEZ/2025 · DIÁRIO OFICIAL DE BRUMADO (29/01/2026) · P. 7'},
  {a: T.maiorFatia, b: T.transp, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 8 (2024: DOM 30/01/2025 · P. 7)'},
  {a: T.transp, b: T.assist, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 9'},
  {a: T.assist, b: T.zero, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 8'},
  {a: T.zero, b: T.repara, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 9'},
  {a: T.repara, b: T.parte, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 8'},
  {a: T.parte, b: T.lei, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 7 (PESSOAL, OBRAS E DÍVIDA)'},
  {a: T.lei, b: T.pisos, texto: 'FONTE: RGF DEZ/2025 · DOM 29/01/2026 · P. 30 · LRF, ART. 20 E 59'},
  {a: T.pisos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 29 (ANEXO 14)'},
  {a: T.fimAno, b: T.seu, texto: 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 7 (SUPERÁVIT)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n162, b: T.em2024, p: soma(PILHAS_EDU, [0, 1.1, 0.6]), valor: '162 MI', sub: 'R$ 161,61 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.n133, b: T.quase8, p: soma(PILHAS_EDU, [0, 0.9, 3.0]), valor: '2024: 133 MI', sub: 'R$ 132,75 MI'},
  {a: T.quase8, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.6]), valor: '125 MI', sub: 'ENSINO FUNDAMENTAL · 78%', cor: 'acento'},
  {a: T.n123, b: T.doisDe3, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '123 MI', sub: 'R$ 123,38 MI · SAÚDE', cor: 'acento'},
  {a: T.doisDe3, b: T.transp, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '82 MI', sub: 'HOSPITAIS E ATENDIMENTO ESPECIALIZADO', cor: 'acento'},
  {a: T.n13, b: T.assist, p: soma(PILHAS_TR, [0, 1.0, 0]), valor: '13 MI', sub: 'R$ 13,35 MI · TRANSPORTE', cor: 'acento'},
  {a: T.dobroPrev, b: T.cultura, p: soma(PILHAS_TR, [0, 0.8, 0.8]), valor: 'PREVISTO: 7,5 MI', sub: 'TRANSPORTE', dy: 120},
  {a: T.n7, b: T.assist, p: soma(PILHAS_CUL, [0, 1.0, 0]), valor: '7 MI', sub: 'R$ 7,21 MI · CULTURA', cor: 'acento'},
  {a: T.triplo, b: T.assist, p: soma(PILHAS_CUL, [0, 0.8, 0.8]), valor: 'PREVISTO: 2,2 MI', sub: 'CULTURA', dy: 120},
  {a: T.n106, b: T.zero, p: soma(PILHAS_ASS, [0, 1.0, 0]), valor: 'PREVISTO: 10,6 MI', sub: 'ASSISTÊNCIA SOCIAL'},
  {a: T.gastou33, b: T.zero, p: soma(PILHAS_ASS, [0, 0.8, 0.5]), valor: '3,3 MI', sub: 'R$ 3,29 MI · GASTO', cor: 'acento', dy: 120},
  {a: T.ambiente, b: T.repara, p: soma(PILHAS_ZERO[0], [0, 0.6, 0]), valor: 'R$ 0', sub: 'MEIO AMBIENTE', cor: 'alerta'},
  {a: T.habit, b: T.repara, p: soma(PILHAS_ZERO[1], [0, 0.6, 0]), valor: 'R$ 0', sub: 'HABITAÇÃO', cor: 'alerta'},
  {a: T.saneam, b: T.repara, p: soma(PILHAS_ZERO[2], [0, 0.6, 0]), valor: 'R$ 0', sub: 'SANEAMENTO', cor: 'alerta'},
  {a: T.n34, b: T.parte, p: soma(PILHAS_SEG, [0, 0.7, 0]), valor: '3,4 MI', sub: 'R$ 3,41 MI · SEGURANÇA', cor: 'acento'},
  {a: T.defesa, b: T.camara, p: soma(PILHAS_DEF, [0, 0.6, 0]), valor: 'PREVISTO: 1,6 MI', sub: 'DEFESA CIVIL · GASTO ZERO', dy: 120},
  {a: T.n109, b: T.parte, p: soma(PILHAS_CAM, [0, 1.0, 0]), valor: '10,9 MI', sub: 'R$ 10,93 MI · CÂMARA', cor: 'acento'},
  {a: T.n128, b: T.parte, p: soma(PILHAS_ADM, [0, 1.0, 0]), valor: '12,8 MI', sub: 'R$ 12,83 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.n155, b: T.obras, p: [-2.6, 0.4, 1.4], valor: '155 MI', sub: 'SALÁRIOS E ENCARGOS · 39%', cor: 'acento'},
  {a: T.n18, b: T.divida, p: soma(PILHAS_OBR, [0, 1.0, -0.2]), valor: '18 MI', sub: 'R$ 18,20 MI · OBRAS E EQUIPAMENTOS', cor: 'acento'},
  {a: T.previstos, b: T.divida, p: soma(PILHAS_OBR, [0, 0.9, 0.4]), valor: 'PREVISTO: 35 MI', sub: 'R$ 34,97 MI', dy: 120},
  {a: T.n18b, b: T.lei, p: soma(PILHAS_DIV, [0, 1.0, 0]), valor: '18 MI', sub: 'JUROS R$ 8,89 + PARCELAS R$ 8,88 MI', cor: 'acento'},
  {a: T.n54, b: T.pisos - 0.2, p: [-0.9, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.rec1, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(30) + 0.3, 0.6]), valor: '33,4%', sub: 'SAÚDE · MÍNIMO 15%', cor: 'acento'},
  {a: T.rec2, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(28.5) + 0.3, 0.6]), valor: '28,5%', sub: 'EDUCAÇÃO · MÍNIMO 25%', cor: 'acento'},
  {a: T.n34s, b: T.seu + 0.6, p: soma(PILHAS_SOBRA, [0, 1.0, 0]), valor: '34 MI', sub: 'R$ 34,43 MI · RECEITAS − DESPESAS', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.lei);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 66 ? 14 : seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 5 MILHÕES</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.primeiro ? 'FONTE: RREO DEZ/2025 · DIÁRIO OFICIAL DE BRUMADO (29/01/2026) · P. 7' : 'FONTE: RREO DEZ/2025 · DOM 29/01/2026 · P. 6 (RECEITAS)';
    const k = Math.min(entra(t, T.bi, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloMapa.length > 66 ? 14 : 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
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
  const n454K = entra(t, T.estaEm + 0.3, 0.5) * (1 - rampa(t, T.pisos - 0.3, T.pisos));
  const comentaK = vis(t, T.emQual, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
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
      {numeroGrande('45,4%', 'PESSOAL · RGF 2025', n454K, tema.acento)}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/brumado.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  // mapa
  s.push({t: quando('398'), f: 'pop', v: 0.22});
  [quando('433'), quando('pouco mais de 1'), quando('192')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: quando('Quase 4 vezes'), f: 'ding', v: 0.16});
  // pilhas que deslizam: pop baixinho
  [...VOOS, ...VOOS2].forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 3) s.push({t: v.t + j * 0.03 + 0.6, f: 'pop', v: 0.06});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n162, T.quase8, T.n123, T.doisDe3, T.n13, T.n7, T.gastou33, T.n34, T.n109, T.n128, T.n155, T.n18, T.n18b].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.em2024, f: 'subida', v: 0.12});
  s.push({t: T.dobroPrev, f: 'ding', v: 0.16});
  s.push({t: T.triplo, f: 'ding', v: 0.16});
  s.push({t: T.terco, f: 'baque', v: 0.2});
  s.push({t: T.nada + 0.2, f: 'baque', v: 0.24});
  s.push({t: T.zeroDef + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.tres, f: 'baque', v: 0.18});
  s.push({t: T.parte + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.previstos, f: 'subida', v: 0.14});
  // teto e pisos
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.estaEm, f: 'subida', v: 0.22});
  s.push({t: T.alerta, f: 'ding', v: 0.18});
  s.push({t: T.pisos + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.rec1 + 0.6, f: 'ding', v: 0.18});
  s.push({t: T.rec2 + 0.6, f: 'ding', v: 0.18});
  s.push({t: T.tribunal, f: 'subida', v: 0.14});
  // sobra e fim
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n34s, f: 'pop', v: 0.24});
  for (let i = 0; i < 9; i++) s.push({t: T.seu + 0.6 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 5.0, 10.0, 15.0, 18.5, 21.5, 26.0, 29.0, 31.5, T.paraOnde + 0.8, T.n162 + 1.0, T.n133 + 0.6, T.quase8 + 0.8, T.n123 + 1.0, T.doisDe3 + 0.8, T.n13 + 0.6, T.dobroPrev + 0.6,
  T.n7 + 0.4, T.triplo + 0.6, T.n106 + 0.6, T.terco + 0.4, T.habit + 0.3, T.nada + 0.4, T.n34 + 0.6, T.policia + 0.3, T.zeroDef + 0.3, T.n109 + 0.6, T.tres + 0.4, T.n128 + 0.3,
  T.parte + 1.2, T.n155 + 0.6, T.n18 + 0.6, T.previstos + 0.6, T.n18b + 0.6, T.n54 + 0.6, T.estaEm + 1.0, T.alerta + 0.6,
  T.rec1 + 0.6, T.rec2 + 0.6, T.tribunal + 0.6, T.n34s + 0.6, T.seu + 1.5, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoBrumado: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Brumado" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['398 milhões.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoBrumado: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE BRUMADO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
