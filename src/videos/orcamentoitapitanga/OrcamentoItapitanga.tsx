import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, RoloCompactador} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, FolhaMes, PastaProcesso, RuaPlaca} from './pecas';
import {PALAVRAS} from './palavras';

// 038. orçamento de itapitanga (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 (Paratinga v2, aprovado).
// O Kit Mapas abre (voo até Itapitanga e o que a prefeitura arrecadou em 2024: projetos/038.../mapas/itapitanga.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz
// fala um setor, as pilhas voam para a casinha do setor. As casinhas ficam na borda NA ORDEM DA FALA, e a câmera anda sempre no
// mesmo sentido; o galpão da mão de obra terceirizada é a 12ª casa, logo depois do esporte. Sem porcentagem e sem nome de gestor.
// SÓ DADOS DE ITAPITANGA, do TCM-BA e do Portal da Transparência conferido com o TCM: audio/fontes.md. Plano: plano.md (v1, aprovado).
// Duas marcas d'água quicando: @eumagnoleite e @z4politica (pedido do Magno, 07/11/2026).

export const FPS = 30;
const AUDIO_SEG = 178.56; // voz Mário, 1,2x, pausas de 0,22 s
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '038. orçamento de itapitanga';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 70'),
  gastou24: quando('Gastou 67'),
  sobrou: quando('Sobraram 2'),
  embasa: quando('da Embasa'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 69'),
  gastou25: quando('Gastou 71 e 700'),
  falt25: quando('2 milhoes e 200 a mais'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 53'),
  gastou26: quando('Ja gastou 57'),
  falt26: quando('Sao 4 milhoes'),
  repara: quando('Agora repara'),
  maoObra: quando('mao de obra terceirizada'),
  empresa: quando('Uma empresa recebeu'),
  cinco: quando('cinco meses'),
  e2025: quando('8 e 700 em 2025'),
  outra: quando('outra empresa'),
  ateSet: quando('8 e 700 ate setembro'),
  porMes: quando('Quase 1 milhao por mes'),
  festas: quando('As festas levaram'),
  festas2: quando('quase 1 e 600'),
  pav: quando('A pavimentacao de ruas'),
  esporte: quando('Os programas de esporte'),
  previa: quando('pavimentacao das ruas previa'),
  usou290: quando('e usou 290'),
  vicinais: quando('estradas vicinais'),
  usaram13: quando('ja usaram 1 e 300'),
  cincoMi: quando('E 5 milhoes'),
  contas: quando('contas de anos anteriores'),
  colegio: quando('O colegio estadual'),
  governo: quando('Governo do Estado'),
  tribunal: quando('No Tribunal de Contas'),
  t484: quando('484 temporarios'),
  c389: quando('389 concursados'),
  provisoria: quando('decisao provisoria'),
  selecao: quando('sem selecao'),
  analisa: quando('analisa a terceirizacao'),
  comb: quando('o combustivel'),
  limp: quando('limpeza urbana'),
  gastar: quando('Gastar nao'),
  terc: quando('vai para terceirizados'),
  asf: quando('o asfalto das ruas'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 11 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA, e o galpão (12ª) ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'agro' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA E FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'agro'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mob', nome: 'MÃO DE OBRA TERCEIRIZADA', tipo: 'galpao', texto: 'MÃO DE OBRA'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['agu', 'esp'];
const ANGS: number[] = SETORES.map((s, i) => 0.12 * Math.PI + i * 0.13 * Math.PI + (i === 11 ? 0.02 * Math.PI : 0));
const ULT = ANGS.length - 1;
const ang = (i: number) => (i >= ULT ? ANGS[ULT] + (i - ULT) * 0.13 * Math.PI : i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [1.0, 1.85, 1.42][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}; sobra?: {t: number; v: number}};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 67.163,
    rotulo: '2024',
    sobra: {t: T.sobrou, v: 2.88},
    entradas: [
      {s: 'edu', t: quando('Educacao 26'), v: 26.633},
      {s: 'sau', t: quando('Saude 14'), v: 14.458},
      {s: 'adm', t: quando('Administracao 8'), v: 8.634},
      {s: 'obr', t: quando('Obras e servicos urbanos'), v: 9.443},
      {s: 'cam', t: quando('Camara de Vereadores'), v: 1.783},
      {s: 'div', t: quando('Dividas 1 e 300'), v: 1.28},
      {s: 'cul', t: quando('Cultura 1 e 600'), v: 1.614},
      {s: 'ass', t: quando('Assistencia social 3'), v: 3.019},
      {s: 'agu', t: quando('Agua e saneamento zero'), v: 0},
      {s: 'agr', t: quando('Agricultura e meio ambiente numa'), v: 0.299},
      {s: 'esp', t: quando('Esporte zero em programas'), v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 71.65,
    rotulo: '2025',
    falta: {t: T.falt25, v: 2.16},
    entradas: [
      {s: 'edu', t: quando('Educacao 27'), v: 27.837},
      {s: 'sau', t: quando('Saude 13'), v: 13.718},
      {s: 'adm', t: quando('Administracao 11'), v: 11.262},
      {s: 'obr', t: quando('Obras 9'), v: 9.49},
      {s: 'cam', t: quando('Camara 2'), v: 2.071},
      {s: 'div', t: quando('Dividas 2'), v: 2.477},
      {s: 'cul', t: quando('Cultura 1 e 600', 2), v: 1.624},
      {s: 'ass', t: quando('Assistencia social 2 e 700'), v: 2.705},
      {s: 'agu', t: quando('Agua e saneamento zero', 2), v: 0},
      {s: 'agr', t: quando('Agricultura e meio ambiente 470'), v: 0.468},
      {s: 'esp', t: quando('Esporte zero de novo'), v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    gastou: T.gastou26,
    total: 57.421,
    rotulo: '2026 · ATÉ SET',
    falta: {t: T.falt26, v: 4.12},
    entradas: [
      {s: 'edu', t: quando('Educacao 23'), v: 23.382},
      {s: 'sau', t: quando('Saude 11'), v: 11.677},
      {s: 'adm', t: quando('Administracao 9'), v: 9.337},
      {s: 'obr', t: quando('Obras 7'), v: 7.017},
      {s: 'cam', t: quando('Camara 1 e meio'), v: 1.512},
      {s: 'div', t: quando('Dividas 1 e 100'), v: 1.127},
      {s: 'cul', t: quando('Cultura 550'), v: 0.55},
      {s: 'ass', t: quando('Assistencia social 2 e 200'), v: 2.228},
      {s: 'agu', t: quando('Agua zero'), v: 0},
      {s: 'agr', t: quando('Agricultura e meio ambiente 590'), v: 0.591},
      {s: 'esp', t: quando('Esporte zero', 3), v: 0},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.repara + 0.4]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];
// a mão de obra terceirizada (Portal da Transparência, conferido com o PCMGE056 do TCM): 5 meses de 2024, 2025, jan a set/2026
const MOB = [4.853, 8.669, 8.688];
const MOB_T = [T.cinco, T.e2025, T.ateSet];
const MOB_SUB = ['5 MESES DE 2024', '2025', 'ATÉ SET/2026'];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

const ANDAR = 0.75;
const PASSO_T = 0.38;
const torre = (c: V3, n: number, lado: number, cor: string, passo = PASSO_T): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * passo, c[1] + andar * ANDAR, c[2] + z * passo], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;
const LADO = 3;
const ESCALA = 2; // 1 pilha = R$ 2 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 14],
      [2.25, 17],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.31;
      const rel = (a - (ANGS[0] - 0.12 * Math.PI) + Math.PI * 8) % (Math.PI * 2);
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: rel});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  y.entradas.forEach((e) => {
    const n = e.v / ESCALA;
    if (n < 0.003) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[lugar % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.035, yi});
      lugar++;
    }
  });
  return v;
});

const FALTA_POS: V3 = [0, 0, 3.65];
// o cofre afunda enquanto as pastas do Tribunal ocupam o miolo da mesa
const SOME_COFRE = (t: number) => 1 - janela(t, T.tribunal - 0.3, T.gastar, 0.5);

// ---------- 2026: as duas gavetas da secretaria de obras (entre o cofre e a borda) ----------
const ESC_OBRA = 0.2; // aqui, 1 pilha = R$ 200 mil
const GAV = {pav: [-1.15, 0, 3.55] as V3, vic: [1.15, 0, 3.55] as V3};
const OBRA = {pav: {res: 1.91, usou: 0.294}, vic: {res: 0.096, usou: 1.271}};
const GAVETAS_VIS = (t: number) => vis(t, T.previa - 0.2, T.cincoMi) + vis(t, T.asf - 0.3, FIM + 2);
// contas de anos anteriores: 2,5 pilhas rosa saem do cofre para a bandeja
const BANDEJA: V3 = [2.65, 0, -0.9];
const CONTAS_VIS = (t: number) => vis(t, T.cincoMi, T.tribunal - 0.2);
// colégio estadual (obra do Estado), na borda, depois do galpão
const ANG_COL = ANGS[11] + 0.37 * Math.PI;
const POS_COL: V3 = [Math.sin(ANG_COL) * 7.2, 0, Math.cos(ANG_COL) * 7.2];
// o Tribunal e as pastas
const TCM_POS: V3 = [0, 0, -2.35];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: [number, string][]; cor: 'alerta' | 'neutro'}[] = [
  {titulo: 'TEMPORÁRIOS', valor: '484', t: T.t484, carimbos: [[T.provisoria, 'PROVISÓRIA'], [T.selecao, 'SÓ COM SELEÇÃO']], cor: 'alerta'},
  {titulo: 'TERCEIRIZAÇÃO', t: T.analisa, carimbos: [[T.analisa + 0.5, 'EM ANÁLISE']], cor: 'neutro'},
  {titulo: 'COMBUSTÍVEL', valor: 'R$ 4,5 MI', t: T.comb, carimbos: [[T.comb + 0.5, 'EM ANÁLISE']], cor: 'neutro'},
  {titulo: 'LIMPEZA URBANA', valor: 'R$ 2,4 MI', t: T.limp, carimbos: [[T.limp + 0.5, 'EM ANÁLISE']], cor: 'neutro'},
];
const posPasta = (i: number): V3 => [-2.0 + i * 1.35, 0, -0.55 + Math.abs(i - 1.5) * 0.2];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);
// filas de bonecos: 10 claros (cada um = cerca de 48 temporários) e 8 escuros (concursados), na frente das pastas
const FILA_T: V3[] = Array.from({length: 10}, (_, k) => [-3.1 + k * 0.4, 0, 1.15]);
const FILA_C: V3[] = Array.from({length: 8}, (_, k) => [-3.1 + k * 0.4, 0, 1.75]);
// calendário: 9 folhas (jan a set de 2026) num arco por dentro do galpão
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET'];
const angMes = (k: number) => ANGS[11] + 0.075 * Math.PI + (8 - k) * 0.03 * Math.PI; // JAN à esquerda de quem olha do centro
const posMes = (k: number): V3 => [Math.sin(angMes(k)) * 6.75, 0, Math.cos(angMes(k)) * 6.75];
const MOB_PORTA: V3 = noAnel(11, R_PREDIO - 1.0);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  // o que foi gasto a mais: torre vermelha na frente do cofre; em 2024 sobrou: pilha dourada no mesmo lugar
  ANOS.forEach((y) => {
    if (y.falta) {
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5);
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    }
    if (y.sobra) {
      const k = janela(t, y.sobra.t, y.fim - 0.2, 0.5);
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.sobra.v / ESCALA) * rampa(t, y.sobra.t, y.sobra.t + 0.9) * k, LADO, C.ouro));
    }
  });
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) torres.push({p: v.de, n: v.n * nasce, cor: CA[yi]});
      else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
    });
  });
  // a mão de obra terceirizada: uma torre por ano ao lado do galpão
  MOB.forEach((v, yi) => {
    const k = rampa(t, MOB_T[yi] + 0.1, MOB_T[yi] + 1.0);
    if (k > 0.01) torres.push(...torre(posTorre(11, yi), (v / ESCALA) * k, LADO, CA[yi], PASSO_FINO));
  });
  // "quase 1 milhão por mês": meia pilha rosa (R$ 1 mi) em cada folha do calendário
  MESES.forEach((_, k) => {
    const a = rampa(t, T.porMes + 0.2 + k * 0.12, T.porMes + 0.6 + k * 0.12) * (1 - rampa(t, T.festas + 0.2, T.festas + 0.6));
    if (a > 0.01) torres.push({p: soma(posMes(k), [-Math.sin(angMes(k)) * 0.42, 0.06, -Math.cos(angMes(k)) * 0.42]), n: 0.48 * a, cor: CA[2]});
  });
  // gavetas de 2026: tracejado (previa) e sólido (usou), aqui 1 pilha = R$ 200 mil
  const g = GAVETAS_VIS(t);
  if (g > 0.01) {
    const par = (chave: keyof typeof GAV, tRes: number, tUsou: number) => {
      const o = OBRA[chave];
      const r = rampa(t, tRes, tRes + 0.6) * g;
      const u = rampa(t, tUsou, tUsou + 1.3) * g;
      if (r > 0.01) fantasmas.push(...torre(GAV[chave], (o.res / ESC_OBRA) * r, LADO, tema.objetoClaro));
      if (u > 0.01) solidas.push(...torre(GAV[chave], Math.max(0.12, o.usou / ESC_OBRA) * u, LADO, CA[2]));
    };
    par('pav', T.previa + 0.3, T.usou290);
    par('vic', T.vicinais + 0.3, T.usaram13);
  }
  // as contas de anos anteriores: sobem do cofre e vão para a bandeja
  const ck = CONTAS_VIS(t);
  if (ck > 0.01) {
    const k = rampa(t, T.contas - 0.9, T.contas + 0.1);
    const c = curva([0, 1.2, 0], BANDEJA, 1.6, k);
    solidas.push(...torre(c, 2.5 * rampa(t, T.cincoMi + 0.2, T.cincoMi + 0.9) * ck, 2, CA[2]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
// borda: roça de cacau (árvores baixas genéricas)
const CACAU: V3[] = [
  [-1.2, 0, 8.2],
  [1.9, 0, 8.3],
  [8.2, 0, 2.2],
  [7.6, 0, -3.4],
  [-3.4, 0, -7.8],
  [3.8, 0, -7.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.festas, T.pav, 0.4));
  if (s.id === 'obr') aceso = Math.max(aceso, janela(t, T.pav, T.esporte, 0.4));
  if (s.id === 'mob') aceso = Math.max(janela(t, T.maoObra, T.festas, 0.4), janela(t, T.terc, T.asf, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6} gariX={-1.6} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'agua':
      return <EstacaoSaneamento {...props} />;
    case 'agro': {
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto="AGRICULTURA" tipo="trator" />
          {sobe > 0.02
            ? [-1.25, 1.25].map((d, k) => <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d, 0, tg[2] * d])} r={0.42} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />)
            : null}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_COFRE(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)), janela(t, T.cincoMi, T.contas + 1.2, 0.5));
  const g = GAVETAS_VIS(t);
  const pk = PASTAS_VIS(t);
  const tgMob: V3 = [Math.cos(ang(11)), 0, -Math.sin(ang(11))];
  const paraDentro: V3 = [-Math.sin(ang(11)), 0, -Math.cos(ang(11))];
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {CACAU.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.5} cresce={0.65} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* os trabalhadores terceirizados saem do galpão (bonecos genéricos de colete) */}
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = rampa(t, T.maoObra + 0.2 + k * 0.18, T.maoObra + 0.6 + k * 0.18);
        if (a < 0.02) return null;
        const anda = rampa(t, T.maoObra + 0.3 + k * 0.18, T.maoObra + 2.2 + k * 0.18);
        const lado = (k - 2.5) * 0.36;
        const pos = soma(MOB_PORTA, [paraDentro[0] * anda * 1.3 + tgMob[0] * lado, 0.04, paraDentro[2] * anda * 1.3 + tgMob[2] * lado]);
        return <Boneco key={k} tema={tema} pos={pos} rotY={ang(11) + Math.PI} escala={0.28 * a} cor={mistura(tema.festa!.dourado, tema.objeto, 0.3 + 0.08 * k)} pose={{passo: anda > 0 && anda < 1 ? 0.4 * Math.sin(t * 9 + k) : 0}} />;
      })}
      {MESES.map((m, k) => (
        <FolhaMes key={m} tema={tema} pos={posMes(k)} rotY={angMes(k) + Math.PI} sobe={vis(t, T.porMes + k * 0.12, T.festas + 0.2)} escala={1.15} mes={m} aceso={janela(t, T.porMes + 0.2 + k * 0.12, T.festas, 0.3)} />
      ))}

      {/* 2026: as duas gavetas da secretaria de obras */}
      <BaseGaveta tema={tema} pos={[GAV.pav[0], 0, GAV.pav[2]]} sobe={g} larg={2.1} texto="PAVIMENTAÇÃO DAS RUAS" aceso={Math.max(janela(t, T.previa, T.vicinais, 0.4), janela(t, T.asf, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[GAV.vic[0], 0, GAV.vic[2]]} sobe={g} larg={2.1} texto="ESTRADAS VICINAIS" aceso={janela(t, T.vicinais, T.cincoMi, 0.4)} />
      {g > 0.05 ? <RoloCompactador tema={tema} pos={[-2.65, 0, 2.7]} rotY={0.6} escala={0.3 * Math.min(1, g)} giro={0} /> : null}

      {/* contas de anos anteriores */}
      <BaseGaveta tema={tema} pos={BANDEJA} sobe={CONTAS_VIS(t)} texto="CONTAS ANTIGAS" larg={2.0} aceso={janela(t, T.contas, T.colegio, 0.4)} />

      {/* o colégio estadual: obra do Governo do Estado */}
      <Escola tema={tema} pos={POS_COL} sobe={rampa(t, T.colegio - 0.2, T.colegio + 0.6)} aceso={janela(t, T.colegio, T.tribunal, 0.4)} rotY={ANG_COL + Math.PI} escala={0.55} />
      <RuaPlaca
        tema={tema}
        pos={soma(POS_COL, [Math.cos(ANG_COL) * 2.1 - Math.sin(ANG_COL) * 0.6, 0, -Math.sin(ANG_COL) * 2.1 - Math.cos(ANG_COL) * 0.6])}
        rotY={ANG_COL + Math.PI}
        escala={0.7}
        sobe={vis(t, T.colegio + 0.2, FIM + 2)}
        linhas={t >= T.governo ? ['COLÉGIO ESTADUAL', 'OBRA DO GOVERNO DO ESTADO', 'R$ 20 MI'] : ['COLÉGIO ESTADUAL', 'R$ 20 MI']}
        aceso={janela(t, T.governo, T.tribunal, 0.4)}
      />

      {/* o Tribunal, as filas e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {FILA_T.map((p, k) => {
        const a = rampa(t, T.t484 + k * 0.06, T.t484 + 0.4 + k * 0.06) * PASTAS_VIS(t);
        return <Boneco key={`t${k}`} tema={tema} pos={p} rotY={0} escala={0.26 * a} cor={mistura(tema.objetoClaro, tema.areia, 0.2)} />;
      })}
      {FILA_C.map((p, k) => {
        const a = rampa(t, T.c389 + k * 0.06, T.c389 + 0.4 + k * 0.06) * PASTAS_VIS(t);
        return <Boneco key={`c${k}`} tema={tema} pos={p} rotY={0} escala={0.26 * a} cor={mistura(tema.objetoEscuro, tema.festa!.turquesa, 0.35)} />;
      })}
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1.5 - i) * 0.08}
            escala={0.78}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={i === 0 && t >= T.c389 ? '484 × 389' : pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={pa.cor === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, pa.t, (PASTAS[i + 1]?.t ?? T.gastar) - 0.1, 0.4)}
          />
        );
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.2, 7.2, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha (os zerados também), sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 8 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.sobrou + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // terceirização: o giro continua da quadra para o galpão (12ª casa); depois o calendário
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, OLHA_SETOR(10.6, 1.25)],
      [T.maoObra, OLHA_SETOR(11, 1.0)],
      [T.empresa, OLHA_SETOR(11.05, 1.05)],
      [T.porMes - 0.3, OLHA_SETOR(11.15, 1.1)],
      [T.porMes + 0.3, OLHA_SETOR(12.2, 1.45)],
      [T.festas - 0.3, OLHA_SETOR(12.3, 1.45)],
    ],
  },
  // festa x asfalto x esporte: vista de cima da mesa inteira
  {
    ini: T.festas - 0.1,
    arco: 0.04,
    chaves: [
      [T.festas - 0.1, DE_CIMA(0.1)],
      [T.festas + 0.5, OLHA_SETOR(6, 1.35)],
      [T.pav - 0.7, OLHA_SETOR(6.05, 1.35)],
      [T.pav - 0.2, DE_CIMA(0.05)],
      [T.pav + 0.4, OLHA_SETOR(3, 1.4)],
      [T.esporte - 0.6, OLHA_SETOR(3.05, 1.4)],
      [T.esporte - 0.1, DE_CIMA(-0.05)],
      [T.esporte + 0.5, OLHA_SETOR(10, 1.3)],
      [T.previa - 0.3, OLHA_SETOR(10.05, 1.3)],
    ],
  },
  // 2026: mergulha nas duas gavetas, da pavimentação para as vicinais
  {
    ini: T.previa - 0.2,
    arco: 0.03,
    chaves: [
      [T.previa - 0.2, E([0, 0.8, 3.4], 7.2, 6.4, [0, 1.25, 1])],
      [T.previa + 0.4, E(soma(GAV.pav, [0, 1.2, 0]), 4.6, 5.2, [-0.05, 0.75, 1])],
      [T.vicinais - 0.3, E(soma(GAV.pav, [0.2, 1.2, 0]), 4.6, 5.2, [-0.02, 0.75, 1])],
      [T.vicinais + 0.2, E(soma(GAV.vic, [0, 1.0, 0]), 4.6, 5.0, [0.05, 0.75, 1])],
      [T.cincoMi - 0.2, E(soma(GAV.vic, [-0.2, 1.0, 0]), 4.8, 5.0, [0.05, 0.75, 1])],
    ],
  },
  // contas antigas: sobe para o cofre e acompanha as pilhas até a bandeja
  {ini: T.cincoMi - 0.1, arco: 0.04, chaves: [[T.cincoMi - 0.1, E([0.6, 1.0, 0], 6.4, 5.6, [0.1, 1.1, 1])], [T.contas - 0.6, E([1.6, 0.8, -0.4], 6.0, 5.4, [0.2, 1.0, 1])], [T.colegio + 0.1, E([2.0, 0.8, -0.6], 5.8, 5.2, [0.25, 1.0, 1])]]},
  // colégio estadual, na borda
  {
    ini: T.colegio + 0.2,
    arco: 0.04,
    chaves: [
      [T.colegio + 0.2, E(soma(POS_COL, [0, 1.0, 0]), 5.4, 4.6, [-Math.sin(ANG_COL) * 0.8, 0.75, -Math.cos(ANG_COL) * 0.8])],
      [T.tribunal - 0.3, E(soma(POS_COL, [0, 1.0, 0]), 5.0, 4.4, [-Math.sin(ANG_COL) * 0.8 + 0.1, 0.75, -Math.cos(ANG_COL) * 0.8])],
    ],
  },
  // tribunal: filas e pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -0.8], 8.6, 6.8, [0, 0.9, 1])],
      [T.t484, E([-2.2, 0.9, 0.6], 5.4, 4.8, [-0.1, 0.7, 1])],
      [T.selecao + 0.4, E([-2.0, 0.9, 0.4], 5.4, 4.8, [-0.06, 0.7, 1])],
      [T.analisa, E(soma(posPasta(1), [0, 0.9, 0]), 4.4, 4.4, [0, 0.6, 1])],
      [T.comb, E(soma(posPasta(2), [0, 0.9, 0]), 4.4, 4.4, [0.05, 0.6, 1])],
      [T.limp, E(soma(posPasta(3), [-0.2, 0.9, 0]), 4.6, 4.4, [0.08, 0.6, 1])],
      [T.gastar - 0.2, E([0.4, 1.0, -0.6], 7.4, 6.2, [0.1, 0.8, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o galpão aceso e a gaveta quase vazia da pavimentação
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.terc - 0.3, OLHA_SETOR(11, 1.0)], [T.asf - 0.4, OLHA_SETOR(11.05, 1.0)], [T.asf - 0.1, E(soma(GAV.pav, [0, 1.0, 0]), 5.2, 5.0, [-0.1, 0.8, 1])], [T.segue, E(soma(GAV.pav, [0.2, 1.0, 0]), 5.6, 5.2, [-0.15, 0.85, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.04});
};

// ---------- Interface ----------
const ESTADOS: [number, string][] = [
  [0, 'ITAPITANGA · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.festas, 'FESTA × ASFALTO'],
  [T.previa, 'O ASFALTO EM 2026'],
  [T.cincoMi, 'CONTAS ANTIGAS'],
  [T.colegio, 'OBRA DO ESTADO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 100) * 10} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const ZERO_TXT: Record<string, string[]> = {
  agu: ['ÁGUA E SANEAMENTO: R$ 0', 'ÁGUA E SANEAMENTO: R$ 0', 'ÁGUA: R$ 0'],
  esp: ['ESPORTE: R$ 0 EM PROGRAMAS', 'ESPORTE: R$ 0 DE NOVO', 'ESPORTE: R$ 0'],
};
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobrou, texto: 'GASTOU EM 2024: R$ 67,2 MILHÕES'},
    {a: T.sobrou, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 2,9 MI', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 69,5 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 71,7 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'R$ 2,2 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 53,3 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 57,4 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: Y2.entradas[0].t, texto: 'R$ 4,1 MI A MAIS, ATÉ SETEMBRO', destaque: true},
  ];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      if (e.s === 'agu' && yi === 0) {
        c.push({a: e.t, b: T.embasa, texto: ZERO_TXT.agu[0], destaque: true}, {a: T.embasa, b: prox, texto: 'A ÁGUA DA CIDADE É DA EMBASA, DO ESTADO'});
        return;
      }
      if (ZERADOS.includes(e.s)) {
        c.push({a: e.t, b: prox, texto: ZERO_TXT[e.s][yi], destaque: true});
        return;
      }
      const nome = e.s === 'agr' && yi === 0 ? 'AGRICULTURA E MEIO AMBIENTE (1 SECRETARIA)' : nomeDe(e.s);
      c.push({a: e.t, b: prox, texto: `${nome}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.maoObra, texto: 'AGORA REPARA'},
    {a: T.maoObra, b: T.empresa, texto: 'O MAIOR FORNECEDOR: MÃO DE OBRA TERCEIRIZADA', destaque: true},
    {a: T.empresa, b: T.cinco, texto: 'EMPRESA 1'},
    {a: T.cinco, b: T.e2025, texto: 'EMPRESA 1: R$ 4,9 MI EM 5 MESES DE 2024'},
    {a: T.e2025, b: T.outra, texto: 'EMPRESA 1: R$ 8,7 MI EM 2025'},
    {a: T.outra, b: T.ateSet, texto: 'EM 2026, OUTRA EMPRESA'},
    {a: T.ateSet, b: T.porMes, texto: 'EMPRESA 2: R$ 8,7 MI ATÉ SETEMBRO'},
    {a: T.porMes, b: T.festas, texto: 'QUASE R$ 1 MI POR MÊS', destaque: true},
    {a: T.festas, b: T.festas2, texto: 'FESTAS 2024: QUASE R$ 1,5 MI'},
    {a: T.festas2, b: T.pav, texto: 'FESTAS 2025: QUASE R$ 1,6 MI'},
    {a: T.pav, b: T.esporte, texto: 'PAVIMENTAÇÃO DE RUAS: R$ 500 MIL (2024) E QUASE R$ 1 MI (2025)'},
    {a: T.esporte, b: T.previa, texto: 'PROGRAMAS DE ESPORTE: R$ 0', destaque: true},
    {a: T.previa, b: T.usou290, texto: '2026 · PAVIMENTAÇÃO DAS RUAS: PREVIA R$ 1,9 MI'},
    {a: T.usou290, b: T.vicinais, texto: 'USOU R$ 290 MIL', destaque: true},
    {a: T.vicinais, b: T.usaram13, texto: 'ESTRADAS VICINAIS: PREVIAM R$ 96 MIL'},
    {a: T.usaram13, b: T.cincoMi, texto: 'JÁ USARAM R$ 1,3 MI'},
    {a: T.cincoMi, b: T.contas, texto: 'R$ 5 MI DO QUE FOI GASTO EM 2026...'},
    {a: T.contas, b: T.colegio + 0.45, texto: '...PAGARAM CONTAS DE ANOS ANTERIORES', destaque: true},
    {a: T.colegio + 0.45, b: T.governo, texto: 'COLÉGIO ESTADUAL NOVO: R$ 20 MI'},
    {a: T.governo, b: T.tribunal, texto: 'OBRA DO GOVERNO DO ESTADO'},
    {a: T.tribunal, b: T.t484, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.t484, b: T.c389, texto: 'DENÚNCIA DE UM VEREADOR: 484 TEMPORÁRIOS'},
    {a: T.c389, b: T.provisoria, texto: '484 TEMPORÁRIOS × 389 CONCURSADOS, SEGUNDO A DENÚNCIA'},
    {a: T.provisoria, b: T.selecao, texto: 'DECISÃO PROVISÓRIA DO TRIBUNAL'},
    {a: T.selecao, b: T.analisa, texto: 'PROIBIDOS NOVOS TEMPORÁRIOS SEM SELEÇÃO', destaque: true},
    {a: T.analisa, b: T.comb, texto: 'EM ANÁLISE: A TERCEIRIZAÇÃO'},
    {a: T.comb, b: T.limp, texto: 'EM ANÁLISE: COMBUSTÍVEL, R$ 4,5 MI'},
    {a: T.limp, b: T.gastar, texto: 'EM ANÁLISE: LIMPEZA URBANA, R$ 2,4 MI'},
    {a: T.gastar, b: T.terc, texto: 'GASTAR NÃO É CRIME'},
    {a: T.terc, b: T.asf, texto: 'QUASE R$ 1 MI POR MÊS PARA TERCEIRIZADOS...', destaque: true},
    {a: T.asf, b: T.segue, texto: '...E O ASFALTO DAS RUAS FICA PARA DEPOIS?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.repara, b: T.festas, texto: 'FONTE: PORTAL DA TRANSPARÊNCIA, CONFERIDO COM O TCM-BA'},
  {a: T.festas, b: T.colegio, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.colegio, b: T.tribunal, texto: 'FONTE: JORNAL GRANDE BAHIA, 22/01/2026'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · 07/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      const i = idx(e.s);
      if (ZERADOS.includes(e.s)) {
        // setor zerado: casinha cinza, plaquinha com o zero e o motivo (sem torre)
        const pz = soma(noAnel(i, R_PREDIO - 0.6), [0, 2.1, 0]);
        if (e.s === 'agu' && yi === 0) {
          r.push({a: e.t + 0.5, b: T.embasa + 0.3, p: pz, valor: 'R$ 0', sub: ANO_SUB[0]}, {a: T.embasa + 0.2, b: T.embasa + 2.6, p: pz, valor: 'R$ 0', sub: '2024 · ÁGUA: EMBASA (ESTADO)'});
          return;
        }
        const sub = e.s === 'agu' ? 'ÁGUA: EMBASA (ESTADO)' : 'ZERO EM PROGRAMAS';
        r.push({a: e.t + 0.5, b: e.t + 3.0, p: pz, valor: 'R$ 0', sub: `${ANO_SUB[yi]} · ${sub}`});
        return;
      }
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
    if (y.sobra) r.push({a: y.sobra.t + 0.4, b: y.entradas[0].t + 0.2, p: soma(FALTA_POS, [0, altTorre(y.sobra.v / ESCALA, LADO) + 0.3, 0]), valor: `SOBROU ${fmtV(y.sobra.v)}`, cor: C.ouro});
  });
  // a mão de obra terceirizada, uma plaquinha por ano
  MOB.forEach((v, k) => r.push({a: MOB_T[k] + 0.6, b: T.festas, p: soma(posTorre(11, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: `${MOB_SUB[k]} · ${k < 2 ? 'EMPRESA 1' : 'EMPRESA 2'}`, cor: CA[k]}));
  r.push({a: T.porMes + 0.8, b: T.festas, p: soma(posMes(4), [0, 1.6, 0]), valor: 'QUASE R$ 1 MI POR MÊS', cor: CA[2]});
  // festa x asfalto x esporte (vista de cima)
  const pCul = (k: number) => soma(posTorre(idx('cul'), k), [0, altFina(1.6) + 0.35, 0]);
  const pObr = (k: number) => soma(posTorre(idx('obr'), k), [0, altFina(9.5) + 0.35, 0]);
  r.push(
    {a: T.festas + 0.4, b: T.previa, p: pCul(0), valor: 'QUASE R$ 1,5 MI', sub: '2024 · FESTAS', cor: CA[0]},
    {a: T.festas2 + 0.3, b: T.previa, p: pCul(1), valor: 'QUASE R$ 1,6 MI', sub: '2025 · FESTAS', cor: CA[1]},
    {a: T.pav + 0.5, b: T.previa, p: pObr(0), valor: 'R$ 500 MIL', sub: '2024 · PAVIMENTAÇÃO', cor: CA[0]},
    {a: T.pav + 1.1, b: T.previa, p: pObr(1), valor: 'QUASE R$ 1 MI', sub: '2025 · PAVIMENTAÇÃO', cor: CA[1]},
    {a: T.esporte + 0.3, b: T.previa, p: soma(noAnel(idx('esp'), R_PREDIO - 0.6), [0, 2.1, 0]), valor: 'R$ 0', sub: 'PROGRAMAS DE ESPORTE'},
  );
  // gavetas de 2026
  const topo = (chave: keyof typeof GAV, v: number) => soma(GAV[chave], [0, altTorre(Math.max(v, OBRA[chave].res) / ESC_OBRA, LADO) + 0.3, 0]);
  r.push(
    {a: T.previa + 0.6, b: T.cincoMi - 0.1, p: topo('pav', 0), valor: 'PREVIA R$ 1,9 MI', sub: '2026 · PAVIMENTAÇÃO'},
    {a: T.usou290 + 0.4, b: T.cincoMi - 0.1, p: soma(GAV.pav, [0, 0.6, 0]), valor: 'USOU R$ 290 MIL', cor: CA[2]},
    {a: T.vicinais + 0.6, b: T.usaram13, p: soma(GAV.vic, [0, 0.6, 0]), valor: 'PREVIAM R$ 96 MIL', sub: '2026 · VICINAIS'},
    {a: T.usaram13 + 0.6, b: T.contas, p: topo('vic', OBRA.vic.usou), valor: 'USARAM R$ 1,3 MI', sub: '2026 · VICINAIS', cor: CA[2]},
    {a: T.contas + 0.2, b: T.colegio + 0.5, p: soma(BANDEJA, [0, 1.3, 0]), valor: 'R$ 5 MI', sub: 'CONTAS DE ANOS ANTERIORES · 2026', cor: CA[2]},
    {a: T.asf, b: FIM + 1, p: topo('pav', 0), valor: '?', cor: tema.acento},
    {a: T.terc + 0.2, b: T.asf, p: soma(noAnel(11, R_PREDIO - 0.6), [0, 2.4, 0]), valor: '?', cor: tema.acento},
  );
  return r;
};

// as marcas d'água: @eumagnoleite e @z4politica, pequenas e leves, quicando devagar pela tela inteira
const MARCA_H = 36;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
const MarcaDagua: React.FC<{tema: Tema; t: number; texto: string; larg: number; px: number; py: number; fase: number}> = ({tema, t, texto, larg, px, py, fase}) => {
  const x = 24 + vaiVolta(t / px + fase) * (W - larg - 48);
  const y = 24 + vaiVolta(t / py + fase * 0.6) * (H - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: larg, height: MARCA_H, fontFamily: FONTE, fontSize: 30, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.16, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
      {texto}
    </div>
  );
};

const noMapa = (t: number) => t < T.gastou24;
const soMapa = (t: number) => t < T.gastou24 - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.gastou24) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.festas);
  const obraK = vis(t, T.previa, T.cincoMi - 0.2);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || obraK > 0.01 ? (
        <div style={{opacity: Math.min(1, Math.max(placarK, obraK)), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${obraK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{obraK > 0.01 ? 'AQUI, 1 PILHA = R$ 200 MIL · BRANCO = PREVISTO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 ENVIADO AO TCM-BA</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(SEGURO.botoesX - 90, pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < 150 && Math.abs(rots[a].y - rots[b].y) < 62) rots[a].y = rots[b].y - 64;
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 60 ? 16 : chip.texto.length > 44 ? 19 : chip.texto.length > 32 ? 24 : 30} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 30 : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.3, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itapitanga.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobrou, T.falt25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.cinco, T.e2025, T.ateSet, T.usou290, T.usaram13, T.contas, T.provisoria];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: ZERADOS.includes(e.s) ? 'baque' : 'pop', v: ZERADOS.includes(e.s) ? 0.14 : 0.18})));
  s.push({t: T.sobrou + 0.3, f: 'ding', v: 0.16});
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  [0, 1, 2, 3, 4, 5].forEach((k) => s.push({t: T.maoObra + 0.25 + k * 0.18, f: 'pop', v: 0.07}));
  MOB_T.forEach((t) => s.push({t: t + 0.1, f: 'subida', v: 0.14}));
  s.push({t: T.porMes + 0.2, f: 'subida', v: 0.16});
  s.push({t: T.esporte, f: 'baque', v: 0.18});
  s.push({t: T.usou290, f: 'tique', v: 0.16});
  s.push({t: T.usaram13, f: 'subida', v: 0.16});
  s.push({t: T.contas, f: 'whoosh', v: 0.14});
  s.push({t: T.governo, f: 'pop', v: 0.16});
  [T.provisoria, T.selecao].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.18}));
  [T.analisa, T.comb, T.limp].forEach((t) => s.push({t: t + 0.5, f: 'tique', v: 0.14}));
  s.push({t: T.terc, f: 'pop', v: 0.18});
  s.push({t: T.asf, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 7, 10.5, 12.5, T.gastou24 + 0.9, T.sobrou + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.embasa + 0.6, T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[10].t + 0.7,
  T.ano26 + 1.0, T.falt26 + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[10].t + 0.6,
  T.repara + 0.6, T.maoObra + 1.4, T.cinco + 0.9, T.e2025 + 0.9, T.ateSet + 0.9, T.porMes + 1.2, T.festas + 0.9, T.festas2 + 0.6, T.pav + 1.4, T.esporte + 0.6,
  T.previa + 1.0, T.usou290 + 0.7, T.vicinais + 1.0, T.usaram13 + 1.3, T.cincoMi + 0.9, T.contas + 1.4, T.colegio + 0.9, T.governo + 0.6,
  T.t484 + 0.8, T.c389 + 0.8, T.provisoria + 0.6, T.selecao + 0.6, T.analisa + 0.8, T.comb + 0.8, T.limp + 0.8, T.gastar + 0.5, T.terc + 0.4, T.asf + 0.4, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItapitanga: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [2.5, 0], clamp) : 0;
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Itapitanga" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} texto="@eumagnoleite" larg={250} px={11.3} py={15.7} fase={0} />
      <MarcaDagua tema={tema} t={t} texto="@z4politica" larg={215} px={13.1} py={9.7} fase={0.85} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 1 mi', 'por mês em', 'mão de obra', 'terceirizada'];
export const CapaOrcamentoItapitanga: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITAPITANGA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 112, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
