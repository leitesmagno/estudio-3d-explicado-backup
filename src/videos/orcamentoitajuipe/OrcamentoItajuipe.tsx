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
import {CofreFGTS, RoloCompactador} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from '../orcamentoparatinga/pecas';
import {ArvoreCinza, PeCacau} from './pecas';
import {PALAVRAS} from './palavras';

// 037. orçamento de itajuípe (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 Paratinga v2 (aprovado e amado).
// O Kit Mapas abre (voo até Itajuípe e o que o município arrecadou em 2024: projetos/037.../mapas/itajuipe.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz
// fala um setor, as pilhas saem dali e voam para a casinha do setor. As casinhas ficam na borda NA ORDEM DA FALA, a câmera anda
// sempre no mesmo sentido; na virada de ano ela sobe e recomeça. Diferente do 035: Itajuípe teve SOBRA em 2024 e 2025 (pilha
// "SOBROU" no lugar da torre vermelha) e, em 2026, o empenhado já passa do arrecadado (pilha tracejada "JÁ COMPROMETIDO").
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE ITAJUÍPE, do TCM-BA: audio/fontes.md e saida/CHECAGEM_ROTEIRO.md.

export const FPS = 30;
const AUDIO_SEG = 177.03; // narração Mário, pausas de 0,28 s, acelerada 1,25x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '037. orçamento de itajuípe';
const FIM = AUDIO_SEG + 0.9;

// as marcas d'água pedidas pela pessoa (07/11/2026): a dela e a de um parceiro
const MARCAS = ['@eumagnoleite', '@z4politica'];

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 126'),
  gastou24: quando('Gastou 121'),
  sobra24: quando('Sobraram 5'),
  duas: quando('As duas dividem'),
  nemExiste: quando('nem existe'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 137'),
  gastou25: quando('Gastou 136', 2), // a 1ª vez é a frase de abertura ("Itajuípe gastou 136 milhões")
  sobra25: quando('Sobrou 1'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 110'),
  gastou26: quando('Gastou 105'),
  compr: quando('ja comprometeu'),
  repara: quando('Agora repara'),
  mica: quando('Micapedro'),
  saoSeb: quando('Sao Sebastiao'),
  todaAss: quando('toda a assistencia'),
  reserva: quando('reserva da ajuda'),
  caiu: quando('caiu de 1'),
  obras: quando('Nas obras de infraestrutura'),
  previstos: quando('quase 11'),
  usou: quando('Usou 2'),
  rural: quando('A melhoria do acesso'),
  nada: quando('nao gastou nada'),
  colegio: quando('O colegio estadual'),
  estado: quando('obra do Estado'),
  tribunal: quando('No Tribunal de Contas'),
  multa1: quando('gestor levou multa'),
  m1500: quando('1500 reais'),
  recurso: quando('com recurso'),
  outra: quando('Outra multa'),
  frota: quando('contrato da frota'),
  p67: quando('chegaram a 67'),
  duasObras: quando('Em duas obras'),
  edital: quando('tirar do edital'),
  analise2: quando('Em analise os'),
  terc: quando('terceirizados'),
  onibus: quando('onibus escolares'),
  gastar: quando('Gastar com festa'),
  festaLeva: quando('a festa ja leva'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 14 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | 'defesa' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'MICAPEDRO'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E ESGOTO (SAAE)', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['def', 'ani']; // nem existe linha no orçamento (a câmera passa por eles juntos)
const CINZAS = ['agr', 'mam', 'def', 'ani']; // casinha apagada: sem gasto em programas
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroAgora && zeroProx ? 0.09 * Math.PI : zeroAgora || zeroProx ? 0.115 * Math.PI : 0.13 * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
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
type Saldo = {t: number; v: number; tipo: 'sobra' | 'comprometido'};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; saldo: Saldo; zero?: number};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 121.26,
    rotulo: '2024',
    saldo: {t: T.sobra24, v: 5.262, tipo: 'sobra'},
    zero: quando('Defesa civil'),
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 44.484},
      {s: 'sau', t: quando('Saude'), v: 19.964},
      {s: 'adm', t: quando('Administracao'), v: 25.148},
      {s: 'obr', t: quando('Obras e servicos'), v: 6.525},
      {s: 'cam', t: quando('Camara'), v: 3.131},
      {s: 'div', t: quando('Dividas'), v: 9.364},
      {s: 'cul', t: quando('Cultura'), v: 4.109},
      {s: 'ass', t: quando('Assistencia social'), v: 3.787},
      {s: 'agu', t: quando('Agua e esgoto'), v: 3.808},
      {s: 'agr', t: quando('Agricultura'), v: 0},
      {s: 'esp', t: quando('Esporte'), v: 0.94},
      {s: 'mam', t: quando('Meio ambiente'), v: 0},
      {s: 'def', t: quando('Defesa civil'), v: 0},
      {s: 'ani', t: quando('protecao animal'), v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 136.15,
    rotulo: '2025',
    saldo: {t: T.sobra25, v: 1.788, tipo: 'sobra'},
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 48.757},
      {s: 'sau', t: quando('Saude', 2), v: 20.101},
      {s: 'adm', t: quando('Administracao', 2), v: 31.945},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 10.866},
      {s: 'cam', t: quando('Camara', 2), v: 3.637},
      {s: 'div', t: quando('Dividas', 2), v: 9.14},
      {s: 'cul', t: quando('Cultura', 2), v: 2.852},
      {s: 'ass', t: quando('Assistencia social', 2), v: 4.305},
      {s: 'agu', t: quando('Agua e esgoto', 2), v: 4.174},
      {s: 'agr', t: quando('Agricultura', 2), v: 0},
      {s: 'esp', t: quando('Esporte', 2), v: 0.374},
      {s: 'mam', t: quando('Meio ambiente', 2), v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    gastou: T.gastou26,
    total: 105.5,
    rotulo: '2026 · ATÉ SET',
    saldo: {t: T.compr, v: 8.066, tipo: 'comprometido'},
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 39.591},
      {s: 'sau', t: quando('Saude', 3), v: 15.328},
      {s: 'adm', t: quando('Administracao', 3), v: 26.156},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 5.698},
      {s: 'cam', t: quando('Camara', 3), v: 2.985},
      {s: 'div', t: quando('Dividas', 3), v: 3.831},
      {s: 'cul', t: quando('Cultura', 3), v: 5.444},
      {s: 'ass', t: quando('Assistencia social', 3), v: 2.906},
      {s: 'agu', t: quando('Agua e esgoto', 3), v: 3.211},
      {s: 'agr', t: quando('Agricultura', 3), v: 0},
      {s: 'esp', t: quando('Esporte', 3), v: 0.354},
      {s: 'mam', t: quando('Meio ambiente', 3), v: 0},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)!.t]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];

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
      [1.75, 26],
      [2.25, 31],
      [2.75, 36],
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
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number; s: string};
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
      v.push({de: LUGARES[lugar % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.035, yi, s: e.s});
      lugar++;
    }
  });
  return v;
});

// o dinheiro sai da mesa nas obras; só o da festa e o da assistência voltam para a pergunta final
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.obras - 0.2, T.obras + 0.6);
const VOLTA_FINAL = (t: number) => rampa(t, T.gastar + 0.2, T.gastar + 1.0);
const someDe = (t: number, s: string) => (s === 'cul' || s === 'ass' ? Math.max(SOME_DINHEIRO(t), VOLTA_FINAL(t)) : SOME_DINHEIRO(t));
const SALDO_POS: V3 = [0, 0, 3.65];

// ---------- Gavetas (aqui, 1 pilha = R$ 500 mil) ----------
const ESC_OBRA = 0.5;
const RES_POS = noAnel(idx('ass'), 4.4); // reserva da ajuda temporária, perto da assistência
const RES = {ini: 1.912, fim: 0.97};
const OBRA_POS: V3 = [0, 0, 1.25];
const OBRA = {prev: 10.948, usou: 2.064};
const OBRA_VIS = (t: number) => vis(t, T.obras + 0.2, T.rural - 0.3); // sai antes de a câmera ir para a borda (senão as moedas ficam na frente)
const RES_VIS = (t: number) => vis(t, T.reserva - 0.1, T.obras);
const ANG_RURAL = ANGS[ANGS.length - 1] + 0.13 * Math.PI;
const POS_RURAL: V3 = [Math.sin(ANG_RURAL) * 7.1, 0, Math.cos(ANG_RURAL) * 7.1];
const ANG_COL = ANGS[ANGS.length - 1] + 0.27 * Math.PI;
const POS_COL: V3 = [Math.sin(ANG_COL) * 7.1, 0, Math.cos(ANG_COL) * 7.1];
const RURAL = [0.255, 0.28, 0.341]; // verba prevista da "Melhoria do acesso à zona rural", gasto R$ 0
const TCM_POS: V3 = [0, 0, -2.35];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: [number, string][]; cor: 'alerta' | 'neutro'}[] = [
  {titulo: 'CONTAS ATRASADAS', valor: '2024', t: T.multa1, carimbos: [[T.m1500, 'MULTA R$ 1.500'], [T.recurso, 'RECURSO EM ANÁLISE']], cor: 'alerta'},
  {titulo: 'FROTA', valor: 'PREVIA R$ 44 MIL', t: T.outra, carimbos: [[T.outra + 0.5, 'MULTA R$ 1.500'], [T.p67, 'PAGOU R$ 67 MIL']], cor: 'alerta'},
  {titulo: 'PISTA DE CAMINHADA', t: T.duasObras, carimbos: [[T.edital, 'EDITAL CORRIGIDO']], cor: 'neutro'},
  {titulo: 'REFORMA DA SEDE', t: T.duasObras + 0.35, carimbos: [[T.edital + 0.3, 'EDITAL CORRIGIDO']], cor: 'neutro'},
  {titulo: 'TERCEIRIZADOS', t: T.terc, carimbos: [[T.terc + 0.4, 'EM ANÁLISE']], cor: 'neutro'},
  {titulo: 'ÔNIBUS ESCOLARES', t: T.onibus, carimbos: [[T.onibus + 0.3, 'EM ANÁLISE']], cor: 'neutro'},
];
const posPasta = (i: number): V3 => [-2.75 + i * 1.1, 0, -0.55 + Math.abs(i - 2.5) * 0.22];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // o saldo do ano ao lado do cofre: SOBROU (sólido) ou JÁ COMPROMETIDO (só o contorno)
  if (some > 0.01) {
    ANOS.forEach((y, yi) => {
      const k = janela(t, y.saldo.t, y.fim - 0.2, 0.5) * some;
      if (k <= 0.01) return;
      const n = (y.saldo.v / ESCALA) * rampa(t, y.saldo.t, y.saldo.t + 0.9) * k;
      if (y.saldo.tipo === 'sobra') solidas.push(...torre(SALDO_POS, n, LADO, CA[yi]));
      else fantasmas.push(...torre(SALDO_POS, n, LADO, CA[yi]));
    });
  }
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const sv = someDe(t, v.s);
      if (sv <= 0.01) return;
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) torres.push({p: v.de, n: v.n * nasce * sv, cor: CA[yi]});
      else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n * sv, cor: CA[yi]});
    });
  });
  // a reserva da ajuda temporária às famílias: o contorno encolhe de R$ 1,9 mi para R$ 970 mil
  const rv = RES_VIS(t);
  if (rv > 0.01) {
    const v = RES.ini + (RES.fim - RES.ini) * rampa(t, T.caiu, T.caiu + 0.8);
    fantasmas.push(...torre(soma(RES_POS, [0, 0.1, 0]), (v / ESC_OBRA) * rampa(t, T.reserva, T.reserva + 0.6) * rv, LADO, CA[2]));
  }
  // obras de infraestrutura 2024: previsto (contorno) x usado (sólido)
  const g = OBRA_VIS(t);
  if (g > 0.01) {
    const r = rampa(t, T.previstos, T.previstos + 0.6) * g;
    const u = rampa(t, T.usou, T.usou + 0.9) * g;
    if (r > 0.01) fantasmas.push(...torre(soma(OBRA_POS, [0, 0.1, 0]), (OBRA.prev / ESC_OBRA) * r, LADO, CA[0]));
    if (u > 0.01) solidas.push(...torre(soma(OBRA_POS, [0, 0.1, 0]), (OBRA.usou / ESC_OBRA) * u, LADO, CA[0]));
  }
  // acesso à zona rural: verba prevista nos três anos (contornos), nada gasto
  const rr = vis(t, T.rural, FIM + 2);
  if (rr > 0.01) {
    RURAL.forEach((v, yi) => {
      const p = soma(POS_RURAL, [Math.cos(ANG_RURAL) * (yi - 1) * 0.6, 0, -Math.sin(ANG_RURAL) * (yi - 1) * 0.6 + 0]);
      fantasmas.push(...torre(soma(p, [-Math.sin(ANG_RURAL) * 1.1, 0, -Math.cos(ANG_RURAL) * 1.1]), (v / ESC_OBRA) * rampa(t, T.rural + 0.3 + yi * 0.2, T.rural + 0.8 + yi * 0.2) * rr, 1, CA[yi]));
    });
  }
  return {solidas, fantasmas, torres};
};

// pés de cacau na borda (região cacaueira), só onde não há casinha
const CACAU: [V3, number][] = Array.from({length: 22}, (_, k) => {
  const a = (k / 22) * Math.PI * 2 + 0.05;
  const r = 8.45 + 0.25 * (k % 2);
  return [[Math.sin(a) * r, 0, Math.cos(a) * r] as V3, a];
});

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.mica, T.obras, 0.4), janela(t, T.festaLeva - 0.6, FIM + 1, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.todaAss, T.obras, 0.4), janela(t, T.festaLeva - 0.6, FIM + 1, 0.4));
  if (s.id === 'obr') aceso = Math.max(aceso, janela(t, T.obras, T.rural, 0.4));
  const cinza = CINZAS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: cinza ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, T.obras - 0.5, T.obras + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - T.obras))} />;
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
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreCinza key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.45 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * 0.75} />
          ))}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={cinza ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={cinza ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const g = OBRA_VIS(t);
  const rv = RES_VIS(t);
  const pk = PASTAS_VIS(t);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CACAU.map(([p, a], k) => (
        <PeCacau key={k} tema={tema} pos={p} rotY={a} escala={0.55 + 0.08 * (k % 3)} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.3} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* a reserva da ajuda temporária às famílias, ao lado da assistência */}
      <BaseGaveta tema={tema} pos={RES_POS} sobe={rv} texto="AJUDA TEMPORÁRIA" larg={2.0} aceso={janela(t, T.reserva, T.obras, 0.4)} />

      {/* obras de infraestrutura 2024: previsto x usado, no miolo (o cofre já saiu) */}
      <BaseGaveta tema={tema} pos={OBRA_POS} sobe={g} texto="OBRAS DE INFRAESTRUTURA" larg={2.8} aceso={janela(t, T.previstos, T.rural, 0.4)} />
      {g > 0.05 ? <RoloCompactador tema={tema} pos={[1.9, 0, 0.45]} rotY={-0.6} escala={0.32 * Math.min(1, g)} giro={0} /> : null}

      {/* acesso à zona rural e o colégio do Estado, na borda depois do último setor */}
      <RuaPlaca tema={tema} pos={POS_RURAL} rotY={ANG_RURAL + Math.PI} escala={0.95} sobe={vis(t, T.rural - 0.2, FIM + 2)} linhas={['ACESSO À ZONA RURAL', 'VERBA EM 2024, 2025 E 2026', 'GASTO: R$ 0']} aceso={janela(t, T.nada, T.colegio, 0.4)} />
      <RuaPlaca tema={tema} pos={POS_COL} rotY={ANG_COL + Math.PI} escala={0.95} sobe={vis(t, T.colegio - 0.2, FIM + 2)} linhas={['COLÉGIO ESTADUAL', 'GOVERNO DO ESTADO', 'R$ 13,9 MI']} aceso={janela(t, T.estado - 0.8, T.tribunal, 0.4)} />
      <PredioTexto tema={tema} pos={soma(POS_COL, [Math.sin(ANG_COL) * 0.95, 0, Math.cos(ANG_COL) * 0.95])} rotY={ANG_COL + Math.PI} sobe={vis(t, T.colegio - 0.1, FIM + 2)} aceso={janela(t, T.colegio, T.tribunal, 0.4) * 0.6} escala={0.42} texto="COLÉGIO ESTADUAL" tipo="galpao" />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(2.5 - i) * 0.07}
            escala={0.7}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
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
const OLHA_BORDA = (a: number, perto = 1): Cam => {
  const alvo: V3 = [Math.sin(a) * 6.9, 0.9, Math.cos(a) * 6.9];
  return E(alvo, 4.2 * perto, 4.0 * perto, [-Math.sin(a) * 0.8, 0.75, -Math.cos(a) * 0.8]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 8 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
};
const ZERO_CAM = OLHA_SETOR(12.5, 1.25);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a sobra; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.sobra24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.duas - 0.15), [T.duas, OLHA_SETOR(10.6, 1.85)], [Y0.zero! - 0.3, OLHA_SETOR(10.8, 1.8)]]},
  {ini: Y0.zero! - 0.1, arco: 0.04, chaves: [[Y0.zero! - 0.1, ZERO_CAM], [T.ano25 - 0.2, OLHA_SETOR(12.5, 1.35)]]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // a festa: sobe e mergulha entre o palco e a assistência (vizinhos na mesa); depois a reserva da ajuda temporária
  {
    ini: T.repara - 0.1,
    arco: 0.05,
    chaves: [
      [T.repara - 0.1, DE_CIMA(-0.1)],
      [T.mica - 0.3, OLHA_SETOR(6.5, 1.5)],
      [T.todaAss, OLHA_SETOR(6.6, 1.45)],
      [T.reserva - 0.3, OLHA_SETOR(6.75, 1.55)],
      [T.reserva + 0.4, E(soma(RES_POS, [0, 1.0, 0]), 4.6, 4.6, [-Math.sin(ang(7)) * 0.2, 0.9, -Math.cos(ang(7)) * 0.2 + 0.6])],
      [T.obras - 0.3, E(soma(RES_POS, [0, 0.9, 0]), 4.4, 4.4, [-Math.sin(ang(7)) * 0.2, 0.9, -Math.cos(ang(7)) * 0.2 + 0.6])],
    ],
  },
  // obras: sobe e mergulha no miolo (previsto x usado), depois desliza para a borda (zona rural e colégio)
  {
    ini: T.obras - 0.1,
    arco: 0.03,
    chaves: [
      [T.obras - 0.1, E([0, 0.6, 1.2], 8.4, 6.6, [0, 1.25, 1])],
      [T.previstos - 0.2, E([0, 1.4, 1.25], 4.8, 5.6, [-0.05, 0.75, 1])],
      [T.rural - 0.4, E([0.2, 1.3, 1.25], 4.8, 5.4, [0.05, 0.75, 1])],
    ],
  },
  {ini: T.rural - 0.2, arco: 0.012, chaves: [[T.rural - 0.2, OLHA_BORDA(ANG_RURAL, 1)], [T.colegio - 0.05, OLHA_BORDA(ANG_RURAL, 0.95)], [T.colegio + 0.7, OLHA_BORDA(ANG_COL, 1.05)], [T.tribunal - 0.3, OLHA_BORDA(ANG_COL, 1.0)]]},
  // tribunal: as pastas da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 8.6, 6.8, [0, 0.9, 1])],
      [T.multa1, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.2, 4.2, [-0.1, 0.55, 1])],
      [T.recurso + 0.3, E(soma(posPasta(0), [0.4, 0.9, 0]), 4.2, 4.2, [-0.08, 0.55, 1])],
      [T.outra, E(soma(posPasta(1), [0, 0.9, 0]), 4.0, 4.2, [-0.05, 0.55, 1])],
      [T.duasObras, E(soma(posPasta(2.5), [0, 0.9, 0]), 4.8, 4.4, [0, 0.6, 1])],
      [T.terc, E(soma(posPasta(4), [0, 0.9, 0]), 4.4, 4.4, [0.05, 0.6, 1])],
      [T.onibus, E(soma(posPasta(5), [-0.2, 0.9, 0]), 4.4, 4.4, [0.08, 0.6, 1])],
      [T.gastar - 0.2, E([0.6, 1.0, -0.9], 7.4, 6.2, [0.1, 0.8, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o palco e a assistência lado a lado, nada entre a câmera e eles
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.festaLeva - 0.6, OLHA_SETOR(6.5, 1.15)], [T.segue, OLHA_SETOR(6.55, 1.2)], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'ITAJUÍPE · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.obras, 'AS OBRAS'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 100) * 10} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra24, texto: 'GASTOU EM 2024: R$ 121,3 MILHÕES'},
    {a: T.sobra24, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 5,3 MI', destaque: true},
    {a: T.duas, b: Y0.zero!, texto: 'AGRICULTURA E MEIO AMBIENTE: MESMA SECRETARIA, SÓ MANUTENÇÃO'},
    {a: Y0.zero!, b: T.nemExiste, texto: 'DEFESA CIVIL E PROTEÇÃO ANIMAL: R$ 0 NOS 3 ANOS', destaque: true},
    {a: T.nemExiste, b: T.ano25, texto: 'NEM EXISTE UMA LINHA PARA ELAS NO ORÇAMENTO', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 137,9 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 136,15 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBROU R$ 1,8 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 110,6 MI'},
    {a: T.gastou26, b: T.compr, texto: 'GASTOU: R$ 105,5 MI (PREFEITURA, CÂMARA E SAAE)'},
    {a: T.compr, b: Y2.entradas[0].t, texto: 'E JÁ COMPROMETEU MAIS R$ 8 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    const ents = y.entradas.filter((e) => !ZERADOS.includes(e.s));
    ents.forEach((e, k) => {
      const prox = k + 1 < ents.length ? ents[k + 1].t : e.s === 'mam' && y === Y0 ? T.duas : (y.zero ?? y.fim);
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${e.v === 0 ? 'R$ 0 EM PROGRAMAS' : fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.mica, texto: 'AGORA REPARA'},
    {a: T.mica, b: T.saoSeb, texto: 'FESTA DO MICAPEDRO, 2026: R$ 4,5 MI'},
    {a: T.saoSeb, b: T.todaAss, texto: 'COM A DE SÃO SEBASTIÃO: R$ 5,3 MI'},
    {a: T.todaAss, b: T.reserva, texto: 'MAIS QUE TODA A ASSISTÊNCIA SOCIAL: R$ 2,9 MI', destaque: true},
    {a: T.reserva, b: T.caiu, texto: 'RESERVA DA AJUDA TEMPORÁRIA ÀS FAMÍLIAS: R$ 1,9 MI'},
    {a: T.caiu, b: T.obras, texto: 'CAIU PARA R$ 970 MIL', destaque: true},
    {a: T.obras, b: T.previstos, texto: 'OBRAS DE INFRAESTRUTURA, 2024'},
    {a: T.previstos, b: T.usou, texto: 'PREVISTO: QUASE R$ 11 MI'},
    {a: T.usou, b: T.rural, texto: 'USOU R$ 2 MI', destaque: true},
    {a: T.rural, b: T.nada, texto: 'MELHORIA DO ACESSO À ZONA RURAL: VERBA NOS 3 ANOS'},
    {a: T.nada, b: T.colegio, texto: 'GASTOU R$ 0', destaque: true},
    {a: T.colegio, b: T.tribunal, texto: 'COLÉGIO ESTADUAL DE TEMPO INTEGRAL: R$ 13,9 MI · OBRA DO ESTADO'},
    {a: T.tribunal, b: T.multa1, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.multa1, b: T.recurso, texto: 'CONTAS DE 2024 ATRASADAS: MULTA DE R$ 1.500 AO GESTOR'},
    {a: T.recurso, b: T.outra, texto: 'COM RECURSO EM ANÁLISE'},
    {a: T.outra, b: T.p67, texto: 'OUTRA MULTA DE R$ 1.500: O CONTRATO DA FROTA PREVIA R$ 44 MIL'},
    {a: T.p67, b: T.duasObras, texto: 'OS PAGAMENTOS CHEGARAM A R$ 67 MIL', destaque: true},
    {a: T.duasObras, b: T.analise2, texto: 'DUAS OBRAS DE 2024: O TRIBUNAL MANDOU TIRAR UMA EXIGÊNCIA DO EDITAL'},
    {a: T.analise2, b: T.gastar, texto: 'EM ANÁLISE: TERCEIRIZADOS E ÔNIBUS ESCOLARES'},
    {a: T.gastar, b: T.festaLeva, texto: 'GASTAR COM FESTA NÃO É CRIME'},
    {a: T.festaLeva, b: T.segue, texto: 'EM 2026, A FESTA JÁ LEVA MAIS QUE A ASSISTÊNCIA SOCIAL?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E SAAE · TCM-BA'},
  {a: T.repara, b: T.colegio, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024 E SET/2026 · TCM-BA'},
  {a: T.colegio, b: T.tribunal, texto: 'FONTE: CASA CIVIL DA BAHIA, 17/04/2026'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · 07/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      const i = idx(e.s);
      if (e.v <= 0) {
        if (ZERADOS.includes(e.s)) return;
        r.push({a: e.t + 0.5, b: e.t + 3.0, p: soma(noAnel(i, R_PREDIO), [0, 1.9, 0]), valor: 'R$ 0', sub: `EM PROGRAMAS · ${ANO_SUB[yi]}`});
        return;
      }
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const s = y.saldo;
    r.push({a: s.t + 0.4, b: y.fim - 0.2, p: soma(SALDO_POS, [0, altTorre(s.v / ESCALA, LADO) + 0.3, 0]), valor: s.tipo === 'sobra' ? `SOBROU ${fmtV(s.v)}` : `JÁ COMPROMETIDO ${fmtV(s.v)}`, sub: ANO_SUB[yi], cor: CA[yi]});
  });
  // a secretaria conjunta da agricultura e do meio ambiente
  r.push({a: T.duas + 0.2, b: Y0.zero! - 0.1, p: soma(noAnel(10, R_PREDIO), [0, 2.6, 0]), valor: 'MESMA SECRETARIA', sub: 'SÓ PAGOU A MANUTENÇÃO'});
  // a festa x a assistência social, em 2026
  const topoCul = soma(posTorre(idx('cul'), 2), [0, altFina(valorDe('cul', 2)) + 0.35, 0]);
  const topoAss = soma(posTorre(idx('ass'), 2), [0, altFina(valorDe('ass', 2)) + 0.35, 0]);
  r.push(
    {a: T.mica + 0.4, b: T.saoSeb, p: topoCul, valor: 'R$ 4,5 MI', sub: 'MICAPEDRO · 2026', cor: CA[2]},
    {a: T.saoSeb + 0.4, b: T.obras, p: topoCul, valor: 'R$ 5,3 MI', sub: 'FESTAS · 2026', cor: CA[2]},
    {a: T.todaAss + 0.3, b: T.obras, p: topoAss, valor: 'R$ 2,9 MI', sub: 'ASSISTÊNCIA · 2026', cor: CA[2]},
    {a: T.reserva + 0.5, b: T.caiu + 0.2, p: soma(RES_POS, [0, altTorre(RES.ini / ESC_OBRA, LADO) + 0.4, 0]), valor: 'RESERVA R$ 1,9 MI', sub: 'AJUDA TEMPORÁRIA · 2026'},
    {a: T.caiu + 0.9, b: T.obras, p: soma(RES_POS, [0, altTorre(RES.fim / ESC_OBRA, LADO) + 0.4, 0]), valor: 'R$ 970 MIL', sub: 'RESERVA DEPOIS DO CORTE', cor: CA[2]},
  );
  // obras de infraestrutura 2024
  r.push(
    {a: T.previstos + 0.5, b: T.rural - 0.1, p: soma(OBRA_POS, [0, altTorre(OBRA.prev / ESC_OBRA, LADO) + 0.4, 0]), valor: 'PREVISTO: QUASE R$ 11 MI', sub: '2024'},
    {a: T.usou + 0.6, b: T.rural - 0.1, p: soma(OBRA_POS, [0.9, altTorre(OBRA.usou / ESC_OBRA, LADO) + 0.3, 0.7]), valor: 'USOU R$ 2 MI', sub: '2024', cor: CA[0]},
  );
  // a pergunta
  r.push(
    {a: T.festaLeva + 0.2, b: FIM + 1, p: topoCul, valor: 'R$ 5,3 MI', sub: 'FESTAS · 2026', cor: CA[2]},
    {a: T.festaLeva + 0.5, b: FIM + 1, p: topoAss, valor: 'R$ 2,9 MI', sub: 'ASSISTÊNCIA · 2026', cor: CA[2]},
  );
  return r;
};

// as marcas d'água: pequenas e leves, quicam devagar pela tela inteira, cada uma no seu ritmo
const MARCA_W = 250;
const MARCA_H = 36;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
const MarcaDagua: React.FC<{tema: Tema; t: number; texto: string; px: number; py: number; fase: number}> = ({tema, t, texto, px, py, fase}) => {
  const x = 24 + vaiVolta(t / px + fase) * (W - MARCA_W - 48);
  const y = 24 + vaiVolta(t / py + fase * 0.7) * (H - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MARCA_W, height: MARCA_H, fontFamily: FONTE, fontSize: 30, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.16, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
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
  const placarK = vis(t, T.gastou24 + 0.4, T.reserva);
  const obraK = Math.max(vis(t, T.reserva, T.obras - 0.1), vis(t, T.previstos, T.colegio - 0.2));
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
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{obraK > 0.01 ? 'AQUI, 1 PILHA = R$ 500 MIL · CLARO = PREVISTO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itajuipe.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra24, T.sobra25, T.compr, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.todaAss, T.caiu, T.usou, T.nada, T.m1500, T.p67];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: e.v === 0 ? 0.1 : 0.18})));
  ANOS.forEach((y) => y.entradas.filter((e) => e.v === 0 && !ZERADOS.includes(e.s)).forEach((e) => s.push({t: e.t + 0.7, f: 'baque', v: 0.12})));
  s.push({t: Y0.zero! + 0.9, f: 'baque', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.saldo.t + 0.1, f: y.saldo.tipo === 'sobra' ? 'ding' : 'baque', v: y.saldo.tipo === 'sobra' ? 0.14 : 0.2}));
  s.push({t: T.mica + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.saoSeb + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.todaAss + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.caiu + 0.3, f: 'baque', v: 0.16});
  s.push({t: T.previstos, f: 'tique', v: 0.14});
  s.push({t: T.usou, f: 'baque', v: 0.16});
  s.push({t: T.nada, f: 'baque', v: 0.14});
  s.push({t: T.estado, f: 'pop', v: 0.16});
  [T.m1500, T.outra + 0.5, T.edital].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.18}));
  [T.recurso, T.p67, T.terc, T.onibus].forEach((t) => s.push({t: t + 0.4, f: 'tique', v: 0.14}));
  s.push({t: T.festaLeva, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 5.6, 7.2, 9.0, T.gastou24 + 0.9, T.sobra24 + 0.9,
  ...Y0.entradas.slice(0, 12).map((e) => e.t + 0.9),
  T.duas + 0.8, Y0.zero! + 1.0, T.nemExiste + 0.6, T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[9].t + 0.7, Y1.entradas[11].t + 0.7,
  T.ano26 + 1.0, T.compr + 0.9, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[8].t + 0.8, Y2.entradas[11].t + 0.8,
  T.repara + 0.6, T.mica + 0.8, T.saoSeb + 0.8, T.todaAss + 0.8, T.reserva + 0.9, T.caiu + 1.2, T.obras + 0.8, T.previstos + 0.9, T.usou + 0.9, T.nada + 0.5, T.colegio + 0.8, T.estado + 0.2,
  T.tribunal + 0.5, T.m1500 + 0.6, T.recurso + 0.5, T.p67 + 0.6, T.edital + 0.7, T.terc + 0.6, T.onibus + 0.4, T.gastar + 0.5, T.festaLeva + 0.9, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItajuipe: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Itajuípe" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} texto={MARCAS[0]} px={11.3} py={15.7} fase={0} />
      <MarcaDagua tema={tema} t={t} texto={MARCAS[1]} px={13.9} py={10.1} fase={0.9} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Em 2026,', 'festa levou', 'mais que a', 'assistência'];
export const CapaOrcamentoItajuipe: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITAJUÍPE`} t={1} troca={0} y={SEGURO.topo + 160} />
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
