import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS, OrgaoPublico, Posto} from '../../pecas';
import {Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioTCM, RuaServicos, coresOI, grade, type Pilha} from '../orcamentoitabuna/pecas';
import {PALAVRAS} from './palavras';

// 033. orçamento de inhambupé (perfil @eumagnoleite, série Magno Explica). MOLDE: 032 (Belmonte v2), pedido da pessoa.
// O Kit Mapas abre (voo até Inhambupe e "de onde vem" de 2024: projetos/033.../mapas/inhambupe.mp4, composição
// OrcamentoInhambupe do kit) e o Estúdio 3D monta a maquete redonda com o cofre no meio e as pilhas em volta
// (1 pilha = R$ 1 MILHÃO). Um anel por ano. No miolo, o pedido da pessoa: combustível, aluguel de carros e limpeza,
// com 2024 × 2026 lado a lado (ali 1 pilha = R$ 500 MIL, avisado no placar).
// SÓ DADOS DE INHAMBUPE, todos do TCM-BA: audio/fontes.md. Plano: projetos/033. orçamento de inhambupé/plano.md.

export const FPS = 30;
const AUDIO_SEG = 141.91; // versão 2 (bloco setor a setor), narração acelerada 1,15x, igual a Belmonte v2
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '033. orçamento de inhambupé';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  abri: quando('Eu abri'),
  ano24: quando('2024 gestao'),
  entrou24: quando('Arrecadou 190'),
  saiu24: quando('Saiu 154'),
  sobra: quando('Sobraram 36'),
  ano25: quando('2025 gestao'),
  entrou25: quando('Arrecadou 190 milhoes de novo'),
  saiu25: quando('Saiu 192'),
  falt: quando('Faltaram 2'),
  ano26: quando('2026 ate'),
  entrou26: quando('Arrecadou 177'),
  saiu26: quando('Saiu a prefeitura'),
  comp: quando('ja comprometeu'),
  n27: quando('13 a mais'),
  setor: quando('Agora setor a setor'),
  tresN: quando('sao tres numeros'),
  edu: quando('Educacao 73'),
  ed24: quando('73 95'),
  ed25: quando('95 e 92'),
  ed26: quando('92 milhoes'),
  sau: quando('Saude 31'),
  s24: quando('31 36'),
  s25: quando('36 e quase 39'),
  s26: quando('quase 39'),
  urb: quando('Limpeza ruas'),
  ur24: quando('15 21'),
  ur25: quando('21 e quase'),
  ur26: quando('quase 25'),
  ass: quando('Assistencia social'),
  as24: quando('5 e meio 5'),
  as25: quando('5 e 400 e 8'),
  as26: quando('8 milhoes'),
  cul: quando('Cultura e eventos'),
  c24x: quando('2 e meio quase'),
  c25x: quando('quase 5 e so'),
  c26x: quando('5 e 400 Ja'),
  passouC: quando('Ja passou o ano inteiro de 2025'),
  repara: quando('Agora repara'),
  jan: quando('janeiro a setembro'),
  comb: quando('Combustivel em'),
  c24: quando('2 milhoes e 100'),
  c26: quando('5 milhoes e meio'),
  vezes: quando('Duas vezes e meia'),
  posto: quando('mesmo posto'),
  n286: quando('286 mil'),
  n732: quando('732 mil'),
  alug: quando('Aluguel de carros e maquinas'),
  a24: quando('2 milhoes e 800'),
  a26: quando('4 milhoes e 800'),
  mudou: quando('empresa mudou'),
  n680: quando('680 mil'),
  antigas: quando('dobro das duas antigas'),
  limp: quando('Limpeza publica'),
  l24: quando('de 4 milhoes e 100'),
  l26: quando('6 milhoes e 400'),
  trocou: quando('trocou de empresa'),
  consorcio: quando('consorcio aberto'),
  somando: quando('Somando os tres'),
  s9: quando('de 9 milhoes'),
  s17: quando('quase 17'),
  dobro: quando('Quase o dobro'),
  ninguem: quando('quase ninguem ve'),
  comb26: quando('o combustivel de 2026'),
  inteiro: quando('ano inteiro de 2025', 2),
  tribunal: quando('No Tribunal'),
  seis: quando('seis processos'),
  unico: quando('unico ja julgado'),
  improc: quando('improcedente'),
  gastar: quando('Gastar mais'),
  crime: quando('nao e crime'),
  frota: quando('a frota dobrou'),
  limpa: quando('duas vezes mais limpa'),
  segue: quando('Segue o'),
};

const ESTADOS: [number, string][] = [
  [0, 'INHAMBUPE 2024 → 2026'],
  [T.entrou24, '2024 · ARRECADOU'],
  [T.saiu24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025'],
  [T.entrou25, '2025 · ARRECADOU'],
  [T.saiu25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.entrou26, '2026 · ARRECADOU'],
  [T.saiu26, '2026 · COMPROMETEU'],
  [T.setor, 'SETOR A SETOR'],
  [T.edu, 'EDUCAÇÃO'],
  [T.sau, 'SAÚDE'],
  [T.urb, 'LIMPEZA, RUAS E OBRAS'],
  [T.ass, 'ASSISTÊNCIA SOCIAL'],
  [T.cul, 'CULTURA E EVENTOS'],
  [T.repara, 'O QUE DOBROU'],
  [T.comb, 'COMBUSTÍVEL'],
  [T.alug, 'ALUGUEL DE CARROS'],
  [T.limp, 'LIMPEZA PÚBLICA'],
  [T.somando, 'SOMANDO OS TRÊS'],
  [T.ninguem, 'O QUE QUASE NINGUÉM VÊ'],
  [T.tribunal, 'O TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.saiu24) + 6};
const noMapa = (t: number) => t < T.saiu24;
const soMapa = (t: number) => t < T.saiu24 - 0.3;

// ---------- Mapa do mundo (mesa redonda, raio 9,4; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-7.6, 0, -2.0];
const HOSP: V3 = [0.4, 0, -7.9];
const TCM: V3 = [7.4, 0, -2.4];
// os três lugares que dobraram, na frente da mesa (z+)
const POSTO: V3 = [-6.0, 0, 3.0];
const PILHAS_COMB: V3 = [-4.5, 0, 5.2];
const GARAGEM: V3 = [0, 0, 6.2];
const PILHAS_ALUG: V3 = [3.5, 0, 6.2];
const RUA: V3 = [5.8, 0, 3.4];
const PILHAS_LIMP: V3 = [4.2, 0, 5.6];
const CASAS: [V3, number][] = [
  [[3.0, 0, -8.4], -0.3],
  [[8.4, 0, 0.4], -1.2],
  [[-8.6, 0, 0.6], 1.4],
  [[-3.2, 0, -8.4], 0.2],
  [[8.0, 0, -4.8], -0.8],
];
const ARVORES: V3[] = [
  [-8.2, 0, 3.6],
  [-2.8, 0, 8.6],
  [3.0, 0, 8.4],
  [8.4, 0, 3.0],
  [-8.6, 0, -4.4],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 1 milhão) ----------
// anel de 224 lugares em volta do cofre, ordenado pelo ângulo: as cores de origem viram fatias de pizza
const ANEL: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.5, 20],
      [1.9, 24],
      [2.3, 28],
      [2.7, 32],
      [3.1, 36],
      [3.5, 40],
      [3.9, 44],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.37;
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: (a + Math.PI * 8) % (Math.PI * 2)});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();

type Voo = {n: number; t: number; centro: V3; cols: number; slots: number};
type Ano = {
  a: number; // nasce
  b: number; // some
  n: number; // pilhas no anel
  extra?: {t: number; n: number; sobra?: boolean}; // 2024: o que sobrou (dourado claro); 2025/2026: o que passou do que entrou (vermelho)
  origem?: {u: [number, number]; e: [number, number]; m: [number, number]; fim: number}; // [tempo, pilhas]
  voos: Voo[];
};
const ANOS: Ano[] = [
  {
    a: T.saiu24 + 0.1,
    b: T.ano25,
    n: 153.68,
    extra: {t: T.sobra, n: 36.43, sobra: true},
    voos: [],
  },
  {
    a: T.ano25 + 0.4,
    b: T.ano26,
    n: 189.66,
    extra: {t: T.falt, n: 2.16},
    voos: [],
  },
  {
    a: T.ano26 + 0.4,
    b: T.setor,
    n: 177.07,
    extra: {t: T.comp, n: 13.3},
    voos: [],
  },
];
const totalAno = (y: Ano) => y.n + (y.extra?.n ?? 0);
// para cada ano, quais lugares do anel voam para onde (os mais perto do destino)
const ROTAS = ANOS.map((y) => {
  const tot = Math.ceil(totalAno(y));
  const livres = ANEL.slice(0, tot).map((_, i) => i);
  const rotas = y.voos.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(ANEL[a][0] - dest[j][0], ANEL[a][2] - dest[j][2]) - Math.hypot(ANEL[b][0] - dest[j][0], ANEL[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
  const doVoo = ANEL.map(() => -1);
  rotas.forEach((r, v) => r.de.forEach((i) => (doVoo[i] = v)));
  return {rotas, doVoo};
});

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

const coresOrigem = (tema: Tema) => {
  const F = tema.festa!;
  return {u: mistura(F.azul, tema.branco, 0.12), e: mistura(F.roxo, tema.branco, 0.15), m: tema.acento};
};

// ---------- Torres de pilhas: cada torre é um bloco de lado×lado pilhas por andar, empilhado (sem misturar) ----------
const ANDAR = 0.75; // altura de uma pilha (10 moedas)
const PASSO_T = 0.4;
const torre = (c: V3, n: number, lado: number, cor: string): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * PASSO_T, c[1] + andar * ANDAR, c[2] + z * PASSO_T], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;

// ---------- Setor a setor: três torres (2024 | 2025 | 2026 jan–set), 1 pilha = R$ 1 milhão ----------
type Setor = {ini: number; fim: number; v: [number, number, number]; t: [number, number, number]; nome: string};
const SETORES: Setor[] = [
  {ini: T.edu, fim: T.sau, v: [72.76, 94.77, 91.82], t: [T.ed24, T.ed25, T.ed26], nome: 'EDUCAÇÃO'},
  {ini: T.sau, fim: T.urb, v: [31.01, 36.07, 38.64], t: [T.s24, T.s25, T.s26], nome: 'SAÚDE'},
  {ini: T.urb, fim: T.ass, v: [14.8, 20.66, 24.56], t: [T.ur24, T.ur25, T.ur26], nome: 'LIMPEZA, RUAS E OBRAS'},
  {ini: T.ass, fim: T.cul, v: [5.62, 5.38, 8.24], t: [T.as24, T.as25, T.as26], nome: 'ASSISTÊNCIA SOCIAL'},
  {ini: T.cul, fim: T.repara, v: [2.48, 4.91, 5.42], t: [T.c24x, T.c25x, T.c26x], nome: 'CULTURA E EVENTOS'},
];
const LADO_SETOR = 4;
const X_SETOR = [-2.25, 0, 2.25];
const Z_SETOR = 1.4;
const baseSetor = (i: number): V3 => [X_SETOR[i], 0, Z_SETOR];
const torresSetor = (t: number, tema: Tema): Pilha[] => {
  const C = coresOI(tema);
  const cores = [mistura(C.ouro, tema.objetoEscuro, 0.55), C.ouro, mistura(C.ouro, tema.branco, 0.3)];
  const out: Pilha[] = [];
  SETORES.forEach((x) => {
    const k = rampa(t, x.ini - 0.1, x.ini + 0.3) * (1 - rampa(t, x.fim - 0.25, x.fim + 0.1));
    if (k <= 0.01) return;
    x.v.forEach((v, i) => out.push(...torre(baseSetor(i), v * rampa(t, x.t[i] - 0.1, x.t[i] + 0.7) * k, LADO_SETOR, cores[i])));
  });
  return out;
};

// ---------- Os três temas: 2024 × 2026 em torres lado a lado (1 pilha = R$ 500 mil) ----------
type Tema3 = {centro: V3; v24: number; v26: number; t24: number; t26: number; ini: number; fim: number};
const MEIO = 0.5; // R$ 500 mil por pilha
const TEMAS: Tema3[] = [
  {centro: PILHAS_COMB, v24: 2.101, v26: 5.457, t24: T.c24, t26: T.c26, ini: T.comb, fim: T.alug},
  {centro: PILHAS_ALUG, v24: 2.766, v26: 4.824, t24: T.a24, t26: T.a26, ini: T.alug, fim: T.limp},
  {centro: PILHAS_LIMP, v24: 4.087, v26: 6.434, t24: T.l24, t26: T.l26, ini: T.limp, fim: T.somando},
];
const LADO = 0.75; // meia distância entre as duas torres
const LADO_TEMA = 2;
const pilhasTemas = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]} => {
  const C = coresOI(tema);
  const cinza = mistura(C.ouro, tema.objetoEscuro, 0.55);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const somem = 1 - rampa(t, T.somando - 0.2, T.somando + 0.5);
  const voltam = janela(t, T.ninguem, T.tribunal, 0.5); // o combustível volta no "quase ninguém vê"
  TEMAS.forEach((x, i) => {
    const naCena = rampa(t, x.ini - 0.2, x.ini + 0.3) * (1 - rampa(t, x.fim - 0.2, x.fim + 0.3));
    const k = Math.max(i === 0 ? voltam : 0, naCena * somem);
    if (k <= 0.01) return;
    const n24 = (x.v24 / MEIO) * rampa(t, x.t24, x.t24 + 0.9) * k;
    const n26 = (x.v26 / MEIO) * rampa(t, x.t26, x.t26 + 1.4) * k;
    const acesa = mistura(C.ouro, tema.branco, 0.25 * janela(t, x.t26 + 1.0, x.fim, 0.5));
    solidas.push(...torre(soma(x.centro, [-LADO, 0, 0]), n24, LADO_TEMA, cinza));
    solidas.push(...torre(soma(x.centro, [LADO, 0, 0]), n26, LADO_TEMA, acesa));
  });
  // o ano inteiro de 2025 (4,65 mi) em torre transparente, à direita do combustível de 2026
  const kf = rampa(t, T.inteiro, T.inteiro + 0.8) * (1 - rampa(t, T.tribunal, T.tribunal + 0.5));
  if (kf > 0.01) fantasmas.push(...torre(soma(PILHAS_COMB, [LADO + 1.15, 0, 0]), (4.653 / MEIO) * kf, LADO_TEMA, C.ouro));
  // somando os três: no meio da mesa, 2024 (8,95) × 2026 (16,72)
  const ks = janela(t, T.somando + 0.2, T.ninguem, 0.6);
  if (ks > 0.01) {
    solidas.push(...torre([-1.0, 0, 1.4], (8.954 / MEIO) * rampa(t, T.s9, T.s9 + 0.9) * ks, 3, cinza));
    solidas.push(...torre([1.0, 0, 1.4], (16.715 / MEIO) * rampa(t, T.s17, T.s17 + 1.3) * ks, 3, mistura(C.ouro, tema.branco, 0.25 * rampa(t, T.dobro, T.dobro + 0.5))));
  }
  solidas.push(...torresSetor(t, tema));
  return {solidas, fantasmas};
};

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const O = coresOrigem(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const sobraCor = mistura(ouro, tema.branco, 0.45);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  ANOS.forEach((y, yi) => {
    if (t < y.a - 0.05 || t > y.b + 0.6) return;
    const someK = rampa(t, y.b - 0.4, y.b + 0.3);
    const R = ROTAS[yi];
    const tot = Math.ceil(totalAno(y));
    for (let i = 0; i < tot; i++) {
      const p = ANEL[i];
      const ehExtra = y.extra !== undefined && i >= Math.floor(y.n) && i >= y.n - 0.001;
      let n = ehExtra
        ? rampa(t, y.extra!.t + (i - y.n) * 0.03, y.extra!.t + 0.5 + (i - y.n) * 0.03)
        : rampa(t, y.a + i * 0.003, y.a + 0.4 + i * 0.003);
      if (ehExtra && y.extra!.sobra) n = 1; // 2024: as que sobraram já estão lá, só mudam de cor
      if (!ehExtra && i === Math.floor(y.n) && !y.extra) n *= y.n - Math.floor(y.n);
      if (ehExtra && i === tot - 1) n *= totalAno(y) - Math.floor(totalAno(y));
      n *= 1 - someK;
      if (n <= 0.0005) continue;
      let cor = ehExtra ? (y.extra!.sobra ? mistura(ouro, sobraCor, rampa(t, y.extra!.t, y.extra!.t + 0.6)) : C.alerta) : ouro;
      if (y.origem && !ehExtra) {
        const o = y.origem;
        const corDe = (lim0: number, lim1: number, tt: number, c: string) => (i >= lim0 && i < lim1 ? mistura(ouro, c, janela(t, tt, o.fim, 0.5)) : null);
        cor = corDe(0, o.u[1], o.u[0], O.u) ?? corDe(o.u[1], o.u[1] + o.e[1], o.e[0], O.e) ?? corDe(o.u[1] + o.e[1], 999, o.m[0], O.m) ?? ouro;
      }
      const v = R.doVoo[i];
      if (v >= 0) {
        const voo = y.voos[v];
        const j = R.rotas[v].de.indexOf(i);
        const a = voo.t + j * 0.018;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, R.rotas[v].dest[j], 1.0, kv);
        if (j === Math.ceil(voo.n) - 1) n *= 1 + (voo.n - Math.floor(voo.n) - 1) * kv;
        const prox = y.voos[v + 1]?.t ?? voo.t + 4;
        const k = janela(t, voo.t, prox, 0.4);
        solidas.push({p: pos, n, cor: kv > 0.05 ? (k > 0.01 ? aceso(k) : ouro) : cor});
        continue;
      }
      solidas.push({p, n, cor});
    }
  });
  const tm = pilhasTemas(t, tema);
  return {solidas: [...solidas, ...tm.solidas], fantasmas: [...fantasmas, ...tm.fantasmas]};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas} = pilhasEm(t, tema);
  const predio = (a: number) => rampa(t, a - 0.2, a + 0.6);
  const ck = rampa(t, T.saiu24 - 0.1, T.saiu24 + 0.5) * (1 - rampa(t, T.setor - 0.2, T.setor + 0.5) * (1 - rampa(t, T.gastar - 0.2, T.gastar + 0.6)));
  const abre = Math.max(janela(t, T.saiu24 + 0.3, T.ano25, 0.6), janela(t, T.ano25 + 0.3, T.ano26, 0.6), janela(t, T.ano26 + 0.3, T.setor, 0.6));
  const tres = rampa(t, T.repara - 0.1, T.repara + 0.8);
  const postoK = tres * (1 + 0.06 * janela(t, T.comb, T.alug, 0.5));
  const garagemK = rampa(t, T.repara + 0.2, T.repara + 1.0);
  const ruaK = rampa(t, T.repara + 0.5, T.repara + 1.3);
  const carro = (i: number) => rampa(t, T.repara + 0.4 + i * 0.15, T.repara + 1.0 + i * 0.15);
  const farolFrota = janela(t, T.frota, FIM + 1, 0.5);
  return (
    <group>
      <MesaMaquete tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura (sai no "Agora repara" e volta na pergunta final) */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - Math.min(1, ck)), COFRE[2]]} escala={0.75} abre={abre} trava={0} brilho={0.3 * janela(t, T.saiu24 + 0.3, T.sobra)} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={4200} />
      <PilhasDinheiro pilhas={fantasmas} max={600} opacidade={0.3} largura={1.12} />

      {/* educação e saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.35} escala={0.85} sobe={predio(T.edu)} aceso={janela(t, T.edu, T.sau, 0.5)} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.05} escala={1.1} sobe={predio(T.sau)} aceso={janela(t, T.sau, T.urb, 0.5)} />

      {/* combustível: o posto (o mesmo nos dois anos) */}
      {postoK > 0.02 ? <Posto tema={tema} pos={POSTO} rotY={0.9} escala={0.42 * Math.min(1.06, postoK)} preco="6,29" visora={janela(t, T.comb, T.alug, 0.5)} /> : null}

      {/* aluguel de carros: a garagem da locadora com a frota na frente */}
      <OrgaoPublico tema={tema} pos={GARAGEM} escala={0.62} sobe={garagemK} letreiro={Math.max(0.4, janela(t, T.alug, T.limp, 0.5), farolFrota)} texto="LOCAÇÃO" />
      {[-1.5, 0, 1.5].map((x, i) => (
        <CarroRua key={i} tema={tema} pos={[GARAGEM[0] + x, 0, GARAGEM[2] + 1.0]} rotY={0} escala={0.34 * carro(i)} farol={0.3 + 0.6 * Math.max(janela(t, T.alug, T.limp, 0.5), farolFrota)} />
      ))}

      {/* limpeza pública: a rua com o caminhão de lixo e o gari */}
      <RuaServicos tema={tema} pos={RUA} rotY={-0.5} sobe={ruaK} luz={Math.max(janela(t, T.limp + 0.4, T.somando, 0.5), janela(t, T.limpa, FIM + 1, 0.5))} caminhaoX={2.0 - 4.0 * rampa(t, T.limp, T.limp + 7)} gariX={-1.8 + 0.2 * Math.min(8, Math.max(0, t - T.limp))} />


      {/* o Tribunal de Contas, na borda da mesa */}
      <PredioTCM tema={tema} pos={TCM} escala={0.75} sobe={predio(T.tribunal)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const ANEL_CIMA = (dx: number) => E([0, 0, -0.4], 10.5, 11.5, [dx, 2.0, 1]);
const FRENTE = E([0, 0, 4.2], 15.5, 8.5, [0, 1.2, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 0, 0.4], 18.5, 11.5, [0, 1.43, 1])]]},
  // 2024
  {ini: T.saiu24 - 0.3, arco: 0.08, chaves: [[T.saiu24 - 0.3, E([0, 0, 0.2], 12.5, 8.6, [0, 1.35, 1])], [T.sobra - 0.3, E([0, 0, -0.2], 11, 9, [0.15, 1.6, 1])]]},
  {ini: T.sobra - 0.1, arco: 0.08, chaves: [[T.sobra - 0.1, ANEL_CIMA(0)], [T.ano25 - 0.3, E([0, 0, -0.3], 10, 11, [0.25, 2.0, 1])]]},
  // 2025
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, ANEL_CIMA(0)], [T.entrou25 + 1.2, E([0, 0, -0.2], 9.6, 10.8, [0.15, 2.0, 1])], [T.saiu25 - 0.3, E([0, 0, -0.2], 9.2, 10.4, [0.4, 1.9, 1])]]},
  {ini: T.saiu25 - 0.1, arco: 0.08, chaves: [[T.saiu25 - 0.1, E([0, 0, 0], 12, 9.4, [0.05, 1.5, 1])], [T.falt - 0.3, E([0, 0, -0.2], 11, 9, [0.2, 1.6, 1])]]},
  {ini: T.falt - 0.1, arco: 0.08, chaves: [[T.falt - 0.1, ANEL_CIMA(-0.1)], [T.ano26 - 0.3, E([0, 0, -0.3], 10, 11, [-0.3, 2.0, 1])]]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, ANEL_CIMA(0.1)], [T.entrou26 + 1.2, E([0, 0, -0.2], 9.6, 10.8, [-0.1, 2.0, 1])], [T.saiu26 - 0.3, E([0, 0, -0.2], 9.2, 10.4, [-0.35, 1.9, 1])]]},
  {ini: T.saiu26 - 0.1, arco: 0.08, chaves: [[T.saiu26 - 0.1, E([0, 0, 0], 12.5, 10, [0, 1.6, 1])], [T.setor - 0.3, E([0, 0, 0], 12, 9.6, [0.2, 1.55, 1])]]},
  // setor a setor: as três torres sempre inteiras (a altura do enquadramento segue a torre mais alta do setor)
  ...SETORES.map((x, i): Cena => {
    const h = altTorre(Math.max(...x.v), LADO_SETOR);
    const alt = Math.max(3.6, h + 1.4);
    const quadro = (k: number): Cam => E([0, h / 2, Z_SETOR], 8.2, alt * k, [0.12 * (i % 2 ? -1 : 1), 0.42, 1]);
    return {ini: (i === 0 ? T.setor : x.ini) - 0.1, arco: 0.05, chaves: [[(i === 0 ? T.setor : x.ini) - 0.1, quadro(1.06)], [x.fim - 0.3, quadro(1.0)]]};
  }),
  // o que dobrou: os três lugares sobem na frente da mesa
  {ini: T.repara - 0.1, arco: 0.06, chaves: [[T.repara - 0.1, E([0, 0, 2.6], 14, 8.4, [0, 1.3, 1])], [T.comb - 0.3, FRENTE]]},
  // combustível
  {ini: T.comb - 0.1, arco: 0.08, chaves: [[T.comb - 0.1, E([-4.9, 0.6, 4.4], 6.6, 4.8, [0.35, 0.8, 1])], [T.posto - 0.2, E([-4.7, 0.6, 4.6], 6.2, 4.6, [0.2, 0.8, 1])], [T.alug - 0.3, E([-4.8, 0.6, 4.5], 6.6, 4.8, [0.05, 0.8, 1])]]},
  // aluguel de carros
  {ini: T.alug - 0.1, arco: 0.08, chaves: [[T.alug - 0.1, E([1.7, 0.7, 5.9], 7.8, 4.8, [0.15, 0.75, 1])], [T.limp - 0.3, E([1.7, 0.7, 5.9], 7.4, 4.6, [-0.05, 0.75, 1])]]},
  // limpeza
  {ini: T.limp - 0.1, arco: 0.08, chaves: [[T.limp - 0.1, E([4.8, 0.6, 4.6], 6.8, 4.8, [-0.3, 0.8, 1])], [T.somando - 0.3, E([4.8, 0.6, 4.7], 6.4, 4.6, [-0.15, 0.8, 1])]]},
  // somando
  {ini: T.somando - 0.1, arco: 0.06, chaves: [[T.somando - 0.1, E([0, 0, 2.2], 12, 7.6, [0, 1.0, 1])], [T.ninguem - 0.3, E([0, 0, 1.4], 8.4, 6.0, [0.15, 1.0, 1])]]},
  // ninguém vê: o combustível de novo, depois a guarda vazia
  {ini: T.ninguem - 0.1, arco: 0.08, chaves: [[T.ninguem - 0.1, E([-4.4, 0.6, 4.4], 6.6, 5.0, [0.3, 0.85, 1])], [T.tribunal - 0.3, E([-4.3, 0.6, 4.3], 6.4, 4.8, [0.15, 0.85, 1])]]},
  // o Tribunal
  {ini: T.tribunal - 0.1, arco: 0.08, chaves: [[T.tribunal - 0.1, E([7.0, 1.2, -2.2], 6.0, 4.8, [-0.6, 0.8, 1])], [T.gastar - 0.3, E([6.8, 1.2, -2.0], 5.8, 4.6, [-0.8, 0.8, 1])]]},
  // a pergunta e o fim
  {ini: T.gastar - 0.1, chaves: [[T.gastar - 0.1, E([0, 0, 1.0], 15, 9.6, [0, 1.3, 1])], [T.frota - 0.2, E([0, 0, 3.8], 11, 7.4, [0.1, 1.05, 1])], [FIM, E([0, 0, 1.4], 15.5, 10, [0.3, 1.3, 1])]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.08, grua: 0.045});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
// as plaquinhas de comparação do topo (uma por número dito)
const CHIPS: Txt[] = [
  {a: T.saiu24 + 0.3, b: T.sobra, texto: 'SAIU EM 2024: R$ 154 MILHÕES'},
  {a: T.sobra, b: T.ano25, texto: 'SOBROU 1 DE CADA 5 REAIS ARRECADADOS', destaque: true},
  {a: T.ano25, b: T.entrou25, texto: '2025 · GESTÃO HUGO DE LEÔNIDAS'},
  {a: T.entrou25, b: T.saiu25, texto: 'ARRECADOU EM 2025: R$ 189,7 MI · IGUAL A 2024'},
  {a: T.saiu25, b: T.falt, texto: 'SAIU: R$ 38 MILHÕES A MAIS QUE EM 2024', destaque: true},
  {a: T.falt, b: T.ano26, texto: 'DE SOBRA EM 2024 PARA FALTA EM 2025', destaque: true},
  {a: T.ano26, b: T.entrou26, texto: '2026 · JANEIRO A SETEMBRO'},
  {a: T.entrou26, b: T.saiu26, texto: 'ARRECADOU EM 2026: R$ 177,1 MI · JAN–SET'},
  {a: T.comp, b: T.n27, texto: 'JÁ COMPROMETEU R$ 190,4 MILHÕES'},
  {a: T.n27, b: T.setor, texto: 'R$ 13 MI A MAIS DO QUE ARRECADOU · EM 9 MESES', destaque: true},
  {a: T.setor, b: T.edu, texto: 'SETOR A SETOR · 2024 | 2025 | 2026 ATÉ SET'},
  {a: T.edu, b: T.ed25, texto: 'EDUCAÇÃO'},
  {a: T.ed25, b: T.ed26, texto: 'EDUCAÇÃO: +30% DE 2024 PARA 2025', destaque: true},
  {a: T.ed26, b: T.sau, texto: '2026: EM 9 MESES, QUASE O ANO TODO DE 2025', destaque: true},
  {a: T.sau, b: T.s26, texto: 'SAÚDE'},
  {a: T.s26, b: T.urb, texto: 'SAÚDE 2026: JÁ PASSOU 2025 EM 9 MESES', destaque: true},
  {a: T.urb, b: T.ur26, texto: 'LIMPEZA, RUAS E OBRAS'},
  {a: T.ur26, b: T.ass, texto: '+66% SOBRE 2024 · JÁ PASSOU 2025', destaque: true},
  {a: T.ass, b: T.as26, texto: 'ASSISTÊNCIA SOCIAL'},
  {a: T.as26, b: T.cul, texto: '+53% SOBRE 2025, EM 9 MESES', destaque: true},
  {a: T.cul, b: T.c26x, texto: 'CULTURA E EVENTOS'},
  {a: T.c26x, b: T.passouC, texto: 'MAIS QUE O DOBRO DE 2024', destaque: true},
  {a: T.passouC, b: T.repara, texto: 'JÁ PASSOU O ANO INTEIRO DE 2025', destaque: true},
  {a: T.repara, b: T.comb, texto: 'COMBUSTÍVEL · ALUGUEL · LIMPEZA'},
  {a: T.comb, b: T.c26, texto: 'COMBUSTÍVEL · JAN–SET'},
  {a: T.c26, b: T.vezes, texto: 'DE 2,1 PARA 5,5 MILHÕES'},
  {a: T.vezes, b: T.posto, texto: '2,6 VEZES O DE 2024', destaque: true},
  {a: T.posto, b: T.n732, texto: 'O MESMO POSTO NOS DOIS ANOS'},
  {a: T.n732, b: T.alug, texto: 'NO MESMO MÊS: 2,6 VEZES MAIS', destaque: true},
  {a: T.alug, b: T.a26, texto: 'ALUGUEL DE CARROS E MÁQUINAS · JAN–SET'},
  {a: T.a26, b: T.mudou, texto: '+74% DE 2024 PARA 2026', destaque: true},
  {a: T.mudou, b: T.antigas, texto: 'TROCOU DE EMPRESA'},
  {a: T.antigas, b: T.limp, texto: 'NO MESMO MÊS: 2,2 VEZES AS DUAS ANTIGAS', destaque: true},
  {a: T.limp, b: T.l26, texto: 'LIMPEZA PÚBLICA · JAN–SET'},
  {a: T.l26, b: T.trocou, texto: '+57% DE 2024 PARA 2026', destaque: true},
  {a: T.trocou, b: T.consorcio, texto: 'TAMBÉM TROCOU DE EMPRESA'},
  {a: T.consorcio, b: T.somando, texto: 'CONSÓRCIO ABERTO EM 09/06/2025', destaque: true},
  {a: T.somando, b: T.dobro, texto: 'OS TRÊS JUNTOS · JAN–SET'},
  {a: T.dobro, b: T.ninguem, texto: 'QUASE O DOBRO', destaque: true},
  {a: T.ninguem, b: T.inteiro, texto: 'COMBUSTÍVEL 2026 · SÓ ATÉ SETEMBRO'},
  {a: T.inteiro, b: T.tribunal, texto: 'JÁ PASSOU O ANO INTEIRO DE 2025', destaque: true},
  {a: T.tribunal, b: T.seis, texto: 'TRIBUNAL DE CONTAS DOS MUNICÍPIOS'},
  {a: T.seis, b: T.unico, texto: '6 PROCESSOS SEM JULGAMENTO', destaque: true},
  {a: T.unico, b: T.gastar, texto: 'O ÚNICO JULGADO: IMPROCEDENTE'},
  {a: T.gastar, b: T.frota, texto: 'GASTAR MAIS NÃO É CRIME'},
  {a: T.frota, b: T.limpa, texto: 'A FROTA DOBROU?', destaque: true},
  {a: T.limpa, b: T.segue, texto: 'A CIDADE FICOU 2X MAIS LIMPA?', destaque: true},
  {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.saiu24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA · ANEXOS 9 E 12'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · PROC. 10095E26'},
  {a: T.ano26, b: T.setor, texto: 'FONTE: DEMONSTRATIVOS SIGA SET/2026 · TCM-BA'},
  {a: T.setor, b: T.repara, texto: 'FONTE: TCM-BA · ANEXO 9 DE 2024 E 2025 · SIGA SET/2026 (POR FUNÇÃO)'},
  {a: T.repara, b: T.ninguem, texto: 'FONTE: TCM-BA · PCMGE015 JAN–SET 2024/2026 · PCMGE056 SET/2024 E SET/2026'},
  {a: T.ninguem, b: T.tribunal, texto: 'FONTE: TCM-BA · PCMGE015 DE 12/2025 E 09/2026'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · CONSULTA DE 06/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta' | 'uniao' | 'estado'; dy?: number; preso?: boolean};
// centro de cada fatia de origem no anel (para prender a plaquinha na cor certa)
const fatia = (i0: number, i1: number): V3 => {
  const pts = ANEL.slice(Math.floor(i0), Math.ceil(i1));
  const m = pts.reduce((a, p) => [a[0] + p[0], 0, a[2] + p[2]] as V3, [0, 0, 0] as V3);
  return [m[0] / pts.length, 0.9, m[2] / pts.length];
};
const ROTULOS: Rot[] = [
  {a: T.sobra + 0.2, b: T.ano25, p: fatia(153.68, 190.11), valor: '36,4 MI', sub: 'SOBROU EM 2024', cor: 'acento'},
  {a: T.falt + 0.2, b: T.ano26, p: fatia(189.66, 191.83), valor: '2,2 MI', sub: 'DÉFICIT DE 2025', cor: 'alerta'},
  {a: T.n27, b: T.setor, p: fatia(177.07, 190.36), valor: '13,3 MI', sub: 'A MAIS DO QUE ARRECADOU', cor: 'alerta'},
  // setor a setor: o valor em cima de cada torre e o ano embaixo
  ...SETORES.flatMap((x): Rot[] => {
    const fmt = (v: number) => (v >= 10 ? v.toFixed(1) : v.toFixed(2)).replace('.', ',').replace(/,0$/, '');
    const anos = ['2024', '2025', '2026 · JAN–SET'];
    return x.v.map((v, i) => ({a: x.t[i] + 0.4, b: x.fim, p: soma(baseSetor(i), [0, altTorre(v, LADO_SETOR) + 0.35, 0]), valor: `${fmt(v)} MI`, sub: anos[i], cor: i === 2 ? 'acento' : undefined, preso: true}));
  }),
  // combustível
  {a: T.c24 + 0.3, b: T.alug, p: soma(PILHAS_COMB, [-LADO, altTorre(4.2, 2) + 0.3, 0]), valor: '2,1 MI', sub: 'R$ 2,10 MI · 2024'},
  {a: T.c26 + 0.5, b: T.alug, p: soma(PILHAS_COMB, [LADO, altTorre(10.9, 2) + 0.3, 0]), valor: '5,5 MI', sub: 'R$ 5,46 MI · 2026', cor: 'acento'},
  {a: T.posto, b: T.alug, p: soma(POSTO, [0, 1.9, 0]), valor: 'VIEIRA & PINHEIRO', sub: 'O POSTO · NOS DOIS ANOS'},
  {a: T.n286, b: T.alug, p: soma(POSTO, [0, 0.6, 1.4]), valor: 'SET/24: 286 MIL', sub: 'PAGO NO MÊS'},
  {a: T.n732, b: T.alug, p: soma(POSTO, [0, 0.6, 1.4]), valor: 'SET/26: 732 MIL', sub: 'PAGO NO MÊS', cor: 'acento'},
  // aluguel
  {a: T.a24 + 0.3, b: T.limp, p: soma(PILHAS_ALUG, [-LADO, altTorre(5.5, 2) + 0.3, 0]), valor: '2,8 MI', sub: 'R$ 2,77 MI · 2024'},
  {a: T.a26 + 0.5, b: T.limp, p: soma(PILHAS_ALUG, [LADO, altTorre(9.6, 2) + 0.3, 0]), valor: '4,8 MI', sub: 'R$ 4,82 MI · 2026', cor: 'acento'},
  {a: T.mudou, b: T.n680, p: soma(GARAGEM, [0, 2.2, 0]), valor: 'SAÍRAM: TJ TRANSPORTES + RIBEIRO E ANJOS', sub: 'SET/24: R$ 312 MIL AS DUAS'},
  {a: T.n680, b: T.limp, p: soma(GARAGEM, [0, 2.2, 0]), valor: 'ENTROU: YDM2', sub: 'SET/26: R$ 680 MIL', cor: 'acento'},
  // limpeza
  {a: T.l24 + 0.3, b: T.somando, p: soma(PILHAS_LIMP, [-LADO, altTorre(8.2, 2) + 0.3, 0]), valor: '4,1 MI', sub: 'R$ 4,09 MI · 2024'},
  {a: T.l26 + 0.5, b: T.somando, p: soma(PILHAS_LIMP, [LADO, altTorre(12.9, 2) + 0.3, 0]), valor: '6,4 MI', sub: 'R$ 6,43 MI · 2026', cor: 'acento'},
  {a: T.trocou, b: T.consorcio, p: soma(RUA, [0, 1.6, 0]), valor: 'SAIU: MOTA CONSTRUÇÕES', sub: 'SET/24: R$ 423 MIL'},
  {a: T.consorcio, b: T.somando, p: soma(RUA, [0, 1.6, 0]), valor: 'ENTROU: CONSÓRCIO GRASF', sub: 'SET/26: R$ 685 MIL', cor: 'acento'},
  // somando
  {a: T.s9 + 0.3, b: T.ninguem, p: [-1.0, altTorre(17.9, 3) + 0.35, 1.4], valor: '9 MI', sub: 'R$ 8,95 MI · 2024'},
  {a: T.s17 + 0.5, b: T.ninguem, p: [1.0, altTorre(33.5, 3) + 0.35, 1.4], valor: '16,7 MI', sub: 'R$ 16,72 MI · 2026', cor: 'acento'},
  // ninguém vê
  {a: T.comb26 + 0.2, b: T.tribunal, p: soma(PILHAS_COMB, [LADO, altTorre(10.9, 2) + 0.3, 0]), valor: '5,5 MI', sub: 'COMBUSTÍVEL · JAN–SET 2026', cor: 'acento'},
  {a: T.inteiro + 0.3, b: T.tribunal, p: soma(PILHAS_COMB, [LADO + 1.15, altTorre(9.3, 2) + 0.3, 0]), valor: '4,7 MI', sub: 'O ANO INTEIRO DE 2025'},
];

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira (ida e volta, linear), o vídeo todo
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
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.saiu24 + 0.4, T.tribunal);
  const meioMi = t >= T.comb - 0.2 && t < T.tribunal;
  const setorMi = t >= T.setor && t < T.repara;
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 66 ? 13 : seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${meioMi ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>{meioMi ? 'AQUI, 1 PILHA = R$ 500 MIL · CINZA = 2024' : setorMi ? '1 PILHA = R$ 1 MILHÃO · CINZA = 2024' : '1 PILHA = R$ 1 MILHÃO'}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA · ANEXOS 10 E 12';
    const k = Math.min(entra(t, T.entrou24, 0.45), 1 - rampa(t, T.saiu24 - 0.6, T.saiu24 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const O = coresOrigem(tema);
  const cor = (c?: Rot['cor']) => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : c === 'uniao' ? O.u : c === 'estado' ? O.e : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: r.preso ? pj.x : Math.max(SEGURO.esq + 210, Math.min(SEGURO.botoesX - 210, pj.x)), y: r.preso ? Math.max(640, pj.y) : Math.max(730, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (!visRot[a].r.preso && Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const cartaoGrande = (txt: string, sub: string, k: number, corN: string, top = 600, tam = 84) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k)}}>
        <div style={{padding: '8px 18px 10px', borderRadius: 14, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', whiteSpace: 'nowrap', transform: `translateY(${(1 - Math.min(1, k)) * 12}px) rotate(-1.5deg)`}}>
          <div style={{fontFamily: FONTE, fontSize: Math.min(44, tam * 0.55), fontWeight: 900, letterSpacing: -1, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: tema.textoSuave, marginTop: 5}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const alerta = mistura(C.alerta, tema.texto, 0.25);
  // o Tribunal: seis pastas "EM ANÁLISE" e a 7ª com o carimbo IMPROCEDENTE
  const PASTAS = ['PREGÃO DE AR-CONDICIONADO', 'AR-CONDICIONADO (2º PROCESSO)', 'PREGÃO DA EDUCAÇÃO', 'MANUTENÇÃO DE PRÉDIOS', 'PROJETO DE EMPRÉSTIMO', 'ADIANTAMENTO A SERVIDORES'];
  const pastasK = vis(t, T.seis, T.gastar);
  const improcK = vis(t, T.improc - 0.1, T.gastar);
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
            <div style={{fontFamily: FONTE, fontSize: v.r.preso ? 32 : v.r.valor.length > 22 ? 24 : v.r.valor.length > 14 ? 30 : 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : v.r.cor === 'uniao' ? O.u : v.r.cor === 'estado' ? O.e : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {cartaoGrande('2,6 VEZES', 'COMBUSTÍVEL · JAN–SET 2024 × 2026', vis(t, T.vezes, T.posto), tema.acento, 1250)}
      {cartaoGrande('QUASE O DOBRO', 'COMBUSTÍVEL + ALUGUEL + LIMPEZA · DE R$ 9 MI PARA R$ 16,7 MI', vis(t, T.dobro, T.ninguem), tema.acento, 1250)}
      {pastasK > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.botoesX + 30, top: 640, display: 'flex', flexDirection: 'column', gap: 8, opacity: Math.min(1, pastasK)}}>
          {PASTAS.map((p, i) => {
            const k = rampa(t, T.seis + 0.15 * i, T.seis + 0.15 * i + 0.4);
            return (
              <div key={i} style={{opacity: k, transform: `translateX(${(1 - k) * -20}px)`, display: 'flex', justifyContent: 'space-between', padding: '7px 14px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 1, color: tema.texto}}>
                <span>{p}</span>
                <span style={{color: tema.textoSuave}}>EM ANÁLISE</span>
              </div>
            );
          })}
          <div style={{opacity: rampa(t, T.unico, T.unico + 0.4), display: 'flex', justifyContent: 'space-between', padding: '7px 14px', borderRadius: 10, background: tema.cartao, border: `2px solid ${tema.textoSuave}`, fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 1, color: tema.texto}}>
            <span>PREGÃO DA EDUCAÇÃO (11035E26)</span>
            <span style={{opacity: improcK, color: tema.textoSuave, border: `2px solid ${tema.textoSuave}`, borderRadius: 6, padding: '0 8px', transform: `rotate(-3deg) scale(${1.4 - 0.4 * Math.min(1, improcK)})`}}>IMPROCEDENTE</span>
          </div>
        </div>
      ) : null}
      {cartaoGrande('A FROTA DOBROU?', 'ALUGUEL DE CARROS E MÁQUINAS: +74%', vis(t, T.frota, T.limpa), alerta, 1080, 72)}
      {cartaoGrande('2X MAIS LIMPA?', 'LIMPEZA PÚBLICA: +57%', vis(t, T.limpa, T.segue), alerta, 1080, 72)}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/inhambupe.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: a câmera dá um empurrão leve (0,5 s, sem piscar) em cada número dito ----------
const SOQUINHOS = [T.sobra, T.entrou25, T.saiu25, T.falt, T.ed24, T.ed26, T.s24, T.s26, T.ur24, T.ur26, T.as24, T.as26, T.c24x, T.c26x, T.passouC, T.entrou26, T.comp, T.n27, T.c24, T.c26, T.vezes, T.n286, T.n732, T.a24, T.a26, T.n680, T.antigas, T.l24, T.l26, T.consorcio, T.s9, T.s17, T.dobro, T.inteiro, T.seis, T.improc, T.frota, T.limpa];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.035 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  // mapa
  [quando('quase dobrou'), quando('Arrecadou 190')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  // pilhas que deslizam: pop baixinho
  ANOS.forEach((y) =>
    y.voos.forEach((v) => {
      for (let j = 0; j < Math.ceil(v.n); j += 5) s.push({t: v.t + j * 0.018 + 0.6, f: 'pop', v: 0.05});
    }),
  );
  [T.saiu24 + 0.3, T.ano25 + 0.4, T.ano26 + 0.4].forEach((t) => s.push({t, f: 'subida', v: 0.16}));
  [T.entrou25, T.entrou26].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  [T.ed24, T.ed25, T.s24, T.s25, T.ur24, T.ur25, T.as24, T.as25, T.c24x, T.c25x].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  [T.ed26, T.s26, T.ur26, T.as26, T.c26x].forEach((t) => s.push({t, f: 'subida', v: 0.16}));
  s.push({t: T.passouC, f: 'baque', v: 0.2});
  [T.c24, T.a24, T.l24, T.s9, T.n286, T.n680, T.posto, T.mudou, T.trocou, T.consorcio].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  [T.c26, T.a26, T.l26, T.s17, T.comp].forEach((t) => s.push({t, f: 'subida', v: 0.18}));
  s.push({t: T.sobra, f: 'ding', v: 0.16});
  s.push({t: T.falt, f: 'baque', v: 0.22});
  s.push({t: T.n27, f: 'baque', v: 0.22});
  s.push({t: T.vezes, f: 'impacto', v: 0.2});
  s.push({t: T.n732, f: 'baque', v: 0.2});
  s.push({t: T.antigas, f: 'baque', v: 0.2});
  s.push({t: T.dobro, f: 'ding', v: 0.22});
  s.push({t: T.inteiro, f: 'baque', v: 0.2});
  [0, 1, 2, 3, 4, 5].forEach((i) => s.push({t: T.seis + 0.15 * i, f: 'tique', v: 0.1}));
  s.push({t: T.improc, f: 'impacto', v: 0.2});
  s.push({t: T.frota, f: 'pop', v: 0.18});
  s.push({t: T.limpa, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 4.6, 8.5, 11, 13.5, 16.5, 20, T.saiu24 + 0.9, T.sobra + 0.6, T.ano25 + 1.0, T.entrou25 + 1.0,
  T.saiu25 + 0.6, T.falt + 0.6, T.entrou26 + 1.0, T.comp + 1.0, T.n27 + 0.5, T.tresN + 0.5, T.ed24 + 0.6, T.ed26 + 0.9, T.s26 + 0.8, T.ur26 + 0.8, T.as26 + 0.6, T.c26x + 0.6, T.passouC + 0.8, T.repara + 1.2, T.comb + 0.8, T.c24 + 0.9,
  T.c26 + 1.4, T.vezes + 0.5, T.posto + 0.5, T.n732 + 0.6, T.alug + 0.8, T.a26 + 1.2, T.mudou + 0.5, T.n680 + 0.6, T.antigas + 0.5, T.limp + 0.8, T.l26 + 1.2,
  T.consorcio + 0.6, T.somando + 0.8, T.s17 + 1.2, T.dobro + 0.5, T.comb26 + 0.6, T.inteiro + 1.0, T.tribunal + 0.8, T.seis + 1.2, T.improc + 0.6,
  T.crime + 0.3, T.frota + 0.5, T.limpa + 0.5, T.segue + 1.2, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoInhambupe: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const zoom = (1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}))) * (1 + soquinho(t));
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Inhambupe" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Combustível,', 'aluguel e', 'limpeza:', 'quase 2x'];
export const CapaOrcamentoInhambupe: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · INHAMBUPE`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
