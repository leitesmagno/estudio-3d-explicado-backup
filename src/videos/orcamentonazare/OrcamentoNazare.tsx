import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 079. orçamento de Nazaré (BA) (perfil @eumagnoleite). MOLDE: 072 Mata de São João / 092 Ubaitaba (brief _brief-molde-ubaitaba.md).
// O Kit Mapas abre (voo até Nazaré, as três receitas e a de 2024: projetos/079.../mapas/nazare.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 4 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setor = SECRETARIA/fundo (função 28 em "Dívidas"; função 27 em Esporte; função 23 em Comércio e turismo).
// Sem porcentagem, sem nome de gestor, sem nome de empresa. SÓ DADOS DE NAZARÉ, todos do TCM-BA:
// projetos/079.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 178.16; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, atempo 1,115, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '079. orçamento de nazaré';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('A prefeitura arrecadou'),
  gastou24: quando('Gastou 191'),
  mais24: quando('9 milhoes e 600'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 142'),
  gastou25: quando('Gastou 136'),
  mais25: quando('Sobraram'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 102'),
  gastou26: quando('Ja gastou 98'),
  comprometeu: quando('ja comprometeu'),
  folha: quando('Uma parte e folha'),
  turZero: quando('a promocao do turismo previa'),
  repara: quando('Agora repara'),
  fundeb: quando('O dinheiro do Fundeb'),
  fb24: quando('92 milhoes'),
  fb25: quando('48 milhoes'),
  infantil: quando('A educacao infantil'),
  inf24: quando('22 milhoes e 300'),
  inf25: quando('9 milhoes e 500'),
  contas: quando('As contas nao dizem'),
  festas: quando('As festas levaram'),
  f24: quando('levaram 3 milhoes'),
  f25: quando('3 milhoes e 800'),
  f26: quando('2 milhoes e 900'),
  ajuda: quando('A ajuda as familias ficou'),
  aj24: quando('34 mil'),
  aj25: quando('149 mil'),
  aj26: quando('233 mil'),
  camara: quando('E a Camara de Vereadores gastou'),
  oito: quando('mais de 8 vezes'),
  deve: quando('A prefeitura deve'),
  inss: quando('quase tudo ao INSS'),
  pagando: quando('Mesmo pagando'),
  subiu: quando('a divida subiu'),
  tribunal: quando('No Tribunal de Contas'),
  juros: quando('juros e multas'),
  recurso: quando('mantida no recurso'),
  vacina: quando('uma auditoria da vacinacao'),
  falhas: quando('achou falhas'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se o dinheiro da educacao'),
  festas2: quando('por que as festas subiram'),
  familias2: quando('e a ajuda as familias ficou com 149'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'ord', nome: 'ORDEM PÚBLICA E TRÂNSITO', tipo: 'colunas', texto: 'TRÂNSITO'},
  {id: 'com', nome: 'COMÉRCIO E TURISMO', tipo: 'galpao', texto: 'TURISMO'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.15 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões, exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean}};
const lista = (n: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras e servicos'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['cul', 'Cultura e festas'],
    ['ass', 'Assistencia social'],
    ['ord', 'Ordem publica'],
    ['com', 'Comercio e turismo'],
    ['agr', 'Agricultura e meio'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 191.38, rotulo: '2024', falta: {t: T.mais24, v: 9.6495, txt: 'A MAIS'}, entradas: lista(1, [103.0, 24.278, 8.7304, 31.57, 4.0265, 6.967, 4.1664, 2.9648, 4.093, 0.72774, 0.64363, 0.21055])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 136.85, rotulo: '2025', falta: {t: T.mais25, v: 5.4744, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [60.095, 22.887, 8.0363, 18.895, 4.3409, 7.356, 5.3087, 4.0067, 4.2463, 0.696, 0.52171, 0.46468])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 98.057, rotulo: '2026 · ATÉ SET', falta: {t: T.comprometeu, v: 42.809, txt: 'COMPROMETIDOS A MAIS'}, entradas: lista(3, [37.561, 17.512, 6.405, 16.438, 3.6883, 4.6686, 3.0898, 4.2624, 2.3344, 0, 0.88917, 1.2084])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;

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
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;
const LADO = 3;
const ESCALA = 4; // 1 pilha = R$ 4 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2024 usa cerca de 56 pilhas) ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 26],
      [2.25, 31],
      [2.75, 36],
      [3.25, 41],
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
  const totalAno = y.entradas.reduce((a, e) => a + Math.ceil(e.v / ESCALA - 0.0005), 0);
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
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Cada gaveta tem a sua escala (o placar diz qual).
const LADO_A = 3;
const PASSO_A = 0.25;
const ZA = 0.2;
const ZF = 1.0; // a fila da frente (a ajuda às famílias), na frente das festas do mesmo ano
// esquerda (1 pilha = R$ 2 mi, torres 4 x 4): o dinheiro do Fundeb 2024 x 2025 e a educação infantil 2024 x 2025
const ESC_F = 2;
const FB = {
  fb24: {p: [-4.35, 0, ZA] as V3, v: 92.2156},
  fb25: {p: [-3.1, 0, ZA] as V3, v: 48.0547},
  in24: {p: [-1.85, 0, ZA] as V3, v: 22.2829},
  in25: {p: [-0.85, 0, ZA] as V3, v: 9.4665},
};
// direita (1 pilha = R$ 250 mil): a ação das festas (2024, 2025, 2026) e, na frente, a ajuda às famílias (benefícios eventuais)
const ESC_E = 0.25;
const FE = {
  f24: {p: [0.95, 0, ZA] as V3, v: 3.0707},
  f25: {p: [1.9, 0, ZA] as V3, v: 3.8013},
  f26: {p: [2.85, 0, ZA] as V3, v: 2.8516},
  a24: {p: [0.95, 0, ZF] as V3, v: 0.033665},
  a25: {p: [1.9, 0, ZF] as V3, v: 0.14855},
  a26: {p: [2.85, 0, ZF] as V3, v: 0.23251},
};
// atrás do cofre: a Câmara x a agricultura (2025, 1 pilha = R$ 250 mil) e a dívida (1 pilha = R$ 2 mi, torres 4 x 4)
const ZD = -2.0;
const CM = {
  cam: {p: [-2.45, 0, ZD] as V3, v: 4.3409},
  agr: {p: [-1.4, 0, ZD] as V3, v: 0.52171},
  d24: {p: [0.55, 0, ZD] as V3, v: 89.5769},
  d25: {p: [1.85, 0, ZD] as V3, v: 94.6411},
};
const FB_VIS = (t: number) => vis(t, T.repara + 0.1, T.festas - 0.3) + vis(t, T.gastar - 0.1, FIM + 2);
const FE_VIS = (t: number) => vis(t, T.festas - 0.4, T.camara + 1.0) + vis(t, T.gastar - 0.1, FIM + 2);
const CM_VIS = (t: number) => vis(t, T.camara + 0.8, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'JUROS E MULTAS AO INSS POR ATRASO', valor: '2020', t: T.juros, carimbos: [[T.juros + 1.6, 'MULTA', 'alerta'], [T.recurso + 0.3, 'MULTA MANTIDA', 'alerta']]},
  {titulo: 'AUDITORIA DA VACINAÇÃO', valor: '2024', t: T.vacina, carimbos: [[T.falhas + 0.2, 'FALHAS · RECOMENDAÇÕES', 'neutro']]},
];
const posPasta = (i: number): V3 => [-1.25 + i * 2.5, 0, 1.3];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) {
        if (some > 0.01) torres.push({p: v.de, n: v.n * nasce * some, cor: CA[yi]});
      } else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
    });
  });
  if (some > 0.01) {
    // torre na frente do cofre: vermelha "A MAIS" (2024), verde "SOBRARAM" (2025); em 2026, o comprometido além do arrecadado
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (v: number, esc: number, k: number) => Math.max(0.3, v / esc) * k;
  // o Fundeb e a educação infantil (2024 x 2025)
  const fb = FB_VIS(t);
  if (fb > 0.01) {
    const k1 = cresce(T.fb24 + 0.2) * fb;
    if (k1 > 0.01) solidas.push(...torre(FB.fb24.p, tAk(FB.fb24.v, ESC_F, k1), 4, CA[0], PASSO_A));
    const k2 = cresce(T.fb25 + 0.2) * fb;
    if (k2 > 0.01) solidas.push(...torre(FB.fb25.p, tAk(FB.fb25.v, ESC_F, k2), 4, CA[1], PASSO_A));
    if (!final) {
      const k3 = cresce(T.inf24 + 0.2) * fb;
      if (k3 > 0.01) solidas.push(...torre(FB.in24.p, tAk(FB.in24.v, ESC_F, k3), LADO_A, CA[0], PASSO_A));
      const k4 = cresce(T.inf25 + 0.2) * fb;
      if (k4 > 0.01) solidas.push(...torre(FB.in25.p, tAk(FB.in25.v, ESC_F, k4), LADO_A, CA[1], PASSO_A));
    }
  }
  // as festas (três anos) e a ajuda às famílias na frente
  const fe = FE_VIS(t);
  if (fe > 0.01) {
    if (!final) {
      const k1 = cresce(T.f24 + 0.4) * fe;
      if (k1 > 0.01) solidas.push(...torre(FE.f24.p, tAk(FE.f24.v, ESC_E, k1), LADO_A, CA[0], PASSO_A));
      const k3 = cresce(T.f26 + 0.3) * fe;
      if (k3 > 0.01) solidas.push(...torre(FE.f26.p, tAk(FE.f26.v, ESC_E, k3), LADO_A, CA[2], PASSO_A));
      const a1 = cresce(T.aj24 + 0.2) * fe;
      if (a1 > 0.01) solidas.push(...torre(FE.a24.p, tAk(FE.a24.v, ESC_E, a1), 2, mistura(CA[0], C.alerta, 0.35), PASSO_A));
      const a3 = cresce(T.aj26 + 0.2) * fe;
      if (a3 > 0.01) solidas.push(...torre(FE.a26.p, tAk(FE.a26.v, ESC_E, a3), 2, mistura(CA[2], C.alerta, 0.35), PASSO_A));
    }
    const k2 = cresce(T.f25 + 0.3) * fe;
    if (k2 > 0.01) solidas.push(...torre(FE.f25.p, tAk(FE.f25.v, ESC_E, k2), LADO_A, CA[1], PASSO_A));
    const a2 = cresce(T.aj25 + 0.2) * fe;
    if (a2 > 0.01) solidas.push(...torre(FE.a25.p, tAk(FE.a25.v, ESC_E, a2), 2, mistura(CA[1], C.alerta, 0.35), PASSO_A));
  }
  // a Câmara x a agricultura (2025) e a dívida (início de 2024 x fim de 2025)
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const k1 = cresce(T.camara + 1.0) * cm;
    if (k1 > 0.01) solidas.push(...torre(CM.cam.p, tAk(CM.cam.v, ESC_E, k1), LADO_A, CA[1], PASSO_A));
    const k2 = cresce(T.oito + 0.3) * cm;
    if (k2 > 0.01) solidas.push(...torre(CM.agr.p, tAk(CM.agr.v, ESC_E, k2), LADO_A, mistura(CA[1], tema.objetoClaro, 0.45), PASSO_A));
    const k3 = cresce(T.deve + 0.2) * cm;
    if (k3 > 0.01) solidas.push(...torre(CM.d24.p, tAk(CM.d24.v, ESC_F, k3), 4, mistura(CA[0], C.alerta, 0.5), PASSO_A));
    const k4 = cresce(T.deve + 0.7) * cm;
    if (k4 > 0.01) solidas.push(...torre(CM.d25.p, tAk(CM.d25.v, ESC_F, k4), 4, C.alerta, PASSO_A));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
  [[6.9, 0, -3.6], 1.9],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.6, 0, 3.6],
  [7.7, 0, -2.2],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  // a casinha sobe ~1 s ANTES da primeira menção (regra do 081: nada de gramado vazio)
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const zerado = false;
  const aceso = Math.max(0, ...ditas);
  const e = 0.47;
  const props = {tema, pos: p, sobe, aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.2} gariX={-1.4} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.42 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
          ))}
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
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const fb = FB_VIS(t);
  const fe = FE_VIS(t);
  const cm = CM_VIS(t);
  const pk = PASTAS_VIS(t);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.5} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* Fundeb e educação infantil (esquerda); festas x ajuda às famílias (direita); Câmara x agricultura e a dívida (atrás do cofre) */}
      <BaseGaveta tema={tema} pos={[-2.6, 0, 0.35]} sobe={fb} larg={4.6} texto="FUNDEB · EDUCAÇÃO INFANTIL" aceso={Math.max(janela(t, T.repara, T.festas, 0.4), janela(t, T.porque, T.festas2, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.9, 0, 0.6]} sobe={fe} larg={3.4} texto="FESTAS x AJUDA ÀS FAMÍLIAS" aceso={Math.max(janela(t, T.festas, T.camara, 0.4), janela(t, T.festas2, T.segue, 0.4))} />
      <BaseGaveta tema={tema} pos={[-0.3, 0, ZD]} sobe={cm} larg={5.6} texto="CÂMARA x AGRICULTURA · DÍVIDA" aceso={janela(t, T.camara, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.juros - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
            escala={1.0}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={atual[2] === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
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
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.6, 7.6, [dx, 1.2, 1]);
const ULT = SETORES.length - 1;
const OLHA_SETOR = (i0: number, perto = 1): Cam => {
  const i = Math.max(0, Math.min(ULT, i0));
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const alto = e.s === 'edu' || e.s === 'sau' || e.s === 'adm' ? 1.15 : 1;
    const pp = perto * alto * (idx(e.s) >= 8 ? 1.08 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const [Y0, Y1, Y2] = ANOS;
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 1.55, 1]);
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha; depois de casinha em casinha (a agricultura, cinza, no fim)
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já foi comprometido além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.comprometeu + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // o Fundeb e a educação infantil (gaveta da esquerda): da esquerda para a direita
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.6, 1.2, 0.4], 7.4, 7.0, [0, 1.8, 1])],
      [T.fb24 - 0.3, E(soma(meio(FB.fb24.p, FB.fb25.p), [0, 1.2, 0]), 4.0, 4.4, [-0.04, 1.35, 1])],
      [T.infantil - 0.5, E(soma(meio(FB.fb24.p, FB.fb25.p), [0, 1.2, 0]), 3.9, 4.3, [-0.03, 1.35, 1])],
      [T.inf24 - 0.1, E(soma(meio(FB.fb24.p, FB.in25.p), [0, 1.0, 0]), 5.3, 5.2, [-0.02, 1.35, 1])],
      [T.festas - 0.4, E(soma(meio(FB.fb24.p, FB.in25.p), [0, 1.0, 0]), 5.1, 5.0, [0.01, 1.35, 1])],
    ],
  },
  // as festas (três anos) e, na fila da frente, a ajuda às famílias
  {
    ini: T.festas - 0.3,
    arco: 0.03,
    chaves: [
      [T.festas - 0.3, E([1.9, 1.0, 0.5], 5.4, 5.6, [0, 1.6, 1])],
      [T.f24 - 0.1, E([1.45, 1.1, 0.4], 3.8, 4.2, [-0.04, 1.3, 1])],
      [T.f26 - 0.1, E([2.35, 1.1, 0.4], 3.8, 4.2, [0.02, 1.3, 1])],
      [T.ajuda - 0.2, E([1.9, 0.6, 0.8], 4.6, 4.8, [0, 1.0, 1])],
      [T.aj26 + 0.4, E([1.9, 0.6, 0.8], 4.4, 4.6, [0.03, 1.0, 1])],
    ],
  },
  // atrás do cofre: a Câmara x a agricultura (2025), depois a dívida
  {
    ini: T.camara + 0.9,
    arco: 0.03,
    chaves: [
      [T.camara + 0.9, E(soma(meio(CM.cam.p, CM.agr.p), [0, 0.8, 0]), 3.8, 4.2, [-0.03, 1.3, 1])],
      [T.deve - 0.3, E(soma(meio(CM.cam.p, CM.agr.p), [0, 0.8, 0]), 3.6, 4.0, [-0.01, 1.3, 1])],
      [T.deve + 0.5, E(soma(meio(CM.d24.p, CM.d25.p), [0, 1.2, 0]), 4.2, 4.6, [0.03, 1.4, 1])],
      [T.subiu + 0.4, E(soma(meio(CM.d24.p, CM.d25.p), [0, 1.1, 0]), 4.0, 4.4, [0.05, 1.4, 1])],
    ],
  },
  // tribunal: as duas pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.juros - 0.3, E(soma(posPasta(0), [0.1, 0.7, 0]), 4.0, 3.9, [-0.08, 1.5, 1])],
      [T.vacina - 0.5, E(soma(posPasta(0), [0.1, 0.7, 0]), 3.9, 3.8, [-0.06, 1.5, 1])],
      [T.vacina + 0.4, E(soma(posPasta(1), [-0.1, 0.7, 0]), 4.0, 3.9, [0.04, 1.5, 1])],
      [T.gastar - 0.2, E(meio(posPasta(0), posPasta(1)), 6.6, 5.8, [0.06, 1.6, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o Fundeb, as festas de 2025 e a ajuda às famílias
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-0.4, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E(soma(meio(FB.fb24.p, FB.fb25.p), [0, 1.2, 0]), 4.2, 4.8, [-0.03, 1.3, 1])],
      [T.festas2 - 0.5, E(soma(meio(FB.fb24.p, FB.fb25.p), [0, 1.2, 0]), 4.1, 4.7, [-0.02, 1.3, 1])],
      [T.festas2 + 0.3, E([1.9, 1.1, 0.5], 4.2, 4.6, [0, 1.3, 1])],
      [T.familias2 - 0.4, E([1.9, 1.0, 0.6], 4.2, 4.6, [0, 1.25, 1])],
      [T.familias2 + 0.3, E([1.9, 0.7, 0.8], 4.4, 4.6, [0.01, 1.1, 1])],
      [T.segue - 0.1, E([-0.6, 1.3, 0.6], 8.4, 7.2, [0.03, 1.6, 1])],
      [T.segue + 0.8, E([-0.6, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
      [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.04});
};

// ---------- Interface ----------
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.festas, T.camara, T.tribunal, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 191,4 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 9,6 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 142,3 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 136,9 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 5,5 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 102,8 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 98,1 MI'},
    {a: T.comprometeu, b: T.folha, texto: 'COMPROMETIDO: R$ 145,6 MI · ARRECADADO: R$ 102,8 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.turZero, b: Y2.entradas[10].t, texto: 'PROMOÇÃO DO TURISMO 2026: PREVISTO R$ 181 MIL · GASTO R$ 0', destaque: true},
    {a: T.repara, b: T.fb24, texto: 'AGORA REPARA'},
    {a: T.fb24, b: T.fb25, texto: 'FUNDEB EM 2024: R$ 92,2 MI'},
    {a: T.fb25, b: T.infantil, texto: 'FUNDEB EM 2025: R$ 48,1 MI', destaque: true},
    {a: T.infantil, b: T.contas, texto: 'CRECHE E PRÉ-ESCOLA: R$ 22,3 MI → R$ 9,5 MI', destaque: true},
    {a: T.contas, b: T.festas, texto: 'AS CONTAS NÃO DIZEM POR QUÊ'},
    {a: T.festas, b: T.ajuda, texto: 'FESTAS: R$ 3,1 MI · 3,8 MI · 2,9 MI (ATÉ SET/2026)'},
    {a: T.ajuda, b: T.camara + 0.9, texto: 'AJUDA ÀS FAMÍLIAS (BENEFÍCIOS EVENTUAIS): 34 MIL · 149 MIL · 233 MIL', destaque: true},
    {a: T.camara + 0.9, b: T.oito, texto: 'CÂMARA DE VEREADORES 2025: R$ 4,3 MI'},
    {a: T.oito, b: T.deve, texto: 'AGRICULTURA E MEIO AMBIENTE 2025: R$ 522 MIL', destaque: true},
    {a: T.deve, b: T.pagando, texto: 'DÍVIDA: R$ 94,6 MI · INSS: R$ 84,6 MI', destaque: true},
    {a: T.pagando, b: T.tribunal, texto: 'PAGOU R$ 12 MI EM 2024 E 2025 · A DÍVIDA FOI DE R$ 89,6 PARA R$ 94,6 MI'},
    {a: T.tribunal, b: T.juros, texto: 'TRIBUNAL DE CONTAS DOS MUNICÍPIOS'},
    {a: T.juros, b: T.vacina, texto: 'JUROS E MULTAS AO INSS (2020): MULTA MANTIDA EM OUT/2026'},
    {a: T.vacina, b: T.gastar, texto: 'AUDITORIA DA VACINAÇÃO (2024): FALHAS E RECOMENDAÇÕES'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.festas2, texto: 'O FUNDEB CAIU DE R$ 92,2 MI PARA R$ 48,1 MI...', destaque: true},
    {a: T.festas2, b: T.familias2, texto: '...POR QUE AS FESTAS SUBIRAM PARA R$ 3,8 MI...', destaque: true},
    {a: T.familias2, b: T.segue, texto: '...E A AJUDA ÀS FAMÍLIAS FICOU COM R$ 149 MIL?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE065 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE065 DEZ/2025 · DESPESA LIQUIDADA · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: SIGA SET/2026 · PCMGE016 E PCMGE065 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: PCMGE065 SET/2026 (CONSOLIDADO) · LIQUIDADO'},
  {a: T.repara, b: T.festas, texto: 'FONTE: ANEXO 10 (RECEITA) E PCMGE065 · 2024 E 2025'},
  {a: T.festas, b: T.deve, texto: 'FONTE: DESPESA POR AÇÃO 2024 A 2026 · TCM-BA'},
  {a: T.deve, b: T.tribunal, texto: 'FONTE: ANEXO 16 (DÍVIDA FUNDADA) 2024 E 2025'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (09/11/2026)'},
];
const LAT = 90; // regra 73: margem lateral mínima de 90 px para tudo que importa
const larg = (r: {valor: string; sub?: string}) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  // regra 48: o setor zerado também tem plaquinha (Comércio e turismo 2026)
  r.push({a: Y2.entradas[9].t + 0.5, b: Y2.entradas[10].t + 0.45, p: soma(posTorre(idx('com'), 2), [0, 0.7, 0]), valor: 'R$ 0', sub: 'TURISMO PREVIA R$ 181 MIL · 2026', cor: C.alerta});
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  const pe = (c: V3) => topo(c, 0.3, 1, 2); // a plaquinha da ajuda fica no topo da torrinha (fora do letreiro da gaveta)
  // o Fundeb e a educação infantil
  const fimF = T.festas - 0.3;
  r.push(
    {a: T.fb24 + 0.4, b: fimF, p: topo(FB.fb24.p, FB.fb24.v, ESC_F, 4), valor: 'R$ 92,2 MI', sub: 'FUNDEB · 2024', cor: CA[0]},
    {a: T.fb25 + 0.4, b: fimF, p: topo(FB.fb25.p, FB.fb25.v, ESC_F, 4), valor: 'R$ 48,1 MI', sub: 'FUNDEB · 2025', cor: CA[1]},
    {a: T.inf24 + 0.4, b: fimF, p: topo(FB.in24.p, FB.in24.v, ESC_F), valor: 'R$ 22,3 MI', sub: 'ED. INFANTIL · 2024', cor: CA[0]},
    {a: T.inf25 + 0.4, b: fimF, p: topo(FB.in25.p, FB.in25.v, ESC_F), valor: 'R$ 9,5 MI', sub: 'ED. INFANTIL · 2025', cor: C.alerta},
  );
  // as festas e a ajuda às famílias
  const fimE = T.camara + 0.9;
  r.push(
    {a: T.f24 + 0.6, b: fimE, p: topo(FE.f24.p, FE.f24.v, ESC_E), valor: 'R$ 3,1 MI', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.f25 + 0.5, b: fimE, p: topo(FE.f25.p, FE.f25.v, ESC_E), valor: 'R$ 3,8 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.f26 + 0.5, b: fimE, p: topo(FE.f26.p, FE.f26.v, ESC_E), valor: 'R$ 2,9 MI', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.aj24 + 0.4, b: fimE, p: pe(FE.a24.p), valor: 'R$ 34 MIL', sub: 'AJUDA · 2024', cor: C.alerta},
    {a: T.aj25 + 0.4, b: fimE, p: pe(FE.a25.p), valor: 'R$ 149 MIL', sub: 'AJUDA · 2025', cor: C.alerta},
    {a: T.aj26 + 0.4, b: fimE, p: pe(FE.a26.p), valor: 'R$ 233 MIL', sub: 'AJUDA · 2026 ATÉ SET', cor: C.alerta},
  );
  // a Câmara x a agricultura e a dívida
  const fimC = T.tribunal - 0.3;
  r.push(
    {a: T.camara + 1.3, b: T.deve + 0.3, p: topo(CM.cam.p, CM.cam.v, ESC_E), valor: 'R$ 4,3 MI', sub: 'CÂMARA · 2025', cor: CA[1]},
    {a: T.oito + 0.5, b: T.deve + 0.3, p: topo(CM.agr.p, CM.agr.v, ESC_E), valor: 'R$ 522 MIL', sub: 'AGRICULTURA · 2025'},
    {a: T.deve + 0.6, b: fimC, p: topo(CM.d24.p, CM.d24.v, ESC_F, 4), valor: 'R$ 89,6 MI', sub: 'DÍVIDA · INÍCIO DE 2024', cor: mistura(CA[0], C.alerta, 0.5)},
    {a: T.deve + 1.1, b: fimC, p: topo(CM.d25.p, CM.d25.v, ESC_F, 4), valor: 'R$ 94,6 MI', sub: 'DÍVIDA · FIM DE 2025', cor: C.alerta},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.5, p: topo(FB.fb25.p, FB.fb25.v, ESC_F, 4), valor: 'R$ 48,1 MI', sub: 'FUNDEB · 2025', cor: CA[1]},
    {a: T.porque + 0.6, b: T.segue + 0.5, p: topo(FB.fb24.p, FB.fb24.v, ESC_F, 4), valor: 'R$ 92,2 MI', sub: 'FUNDEB · 2024', cor: CA[0]},
    {a: T.festas2 + 0.4, b: T.segue + 0.5, p: topo(FE.f25.p, FE.f25.v, ESC_E), valor: 'R$ 3,8 MI', sub: 'FESTAS · 2025', cor: tema.acento},
    {a: T.familias2 + 0.3, b: T.segue + 0.5, p: pe(FE.a25.p), valor: 'R$ 149 MIL', sub: 'AJUDA ÀS FAMÍLIAS · 2025', cor: tema.acento},
  );
  return r;
};

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira
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

const noMapa = (t: number) => t < T.gastou24;
const soMapa = (t: number) => t < T.gastou24 - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.gastou24) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const miolo = vis(t, T.repara + 0.2, T.tribunal - 0.3) + vis(t, T.gastar, FIM + 2);
  const escalaTxt =
    miolo <= 0.01
      ? '1 PILHA = R$ 4 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'
      : t >= T.gastar
        ? 'FUNDEB: 1 PILHA = R$ 2 MI · FESTAS E AJUDA: R$ 250 MIL'
        : t < T.festas || t >= T.deve
          ? 'AQUI, 1 PILHA = R$ 2 MILHÕES'
          : 'AQUI, 1 PILHA = R$ 250 MIL';
  const escK = Math.max(placarK, miolo);
  const cabecalho = (
    <div style={{position: 'absolute', left: LAT, right: LAT, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 56 ? 14 : seloAtual.texto.length > 48 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {escK > 0.01 ? (
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${miolo > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: escalaTxt.length > 52 ? 14 : 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escalaTxt}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    // na abertura, o selo da fonte entra depois que o selo grande do @ viaja para o cabeçalho
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, T.ano24 - 0.5, T.ano24 - 0.1));
    const k2 = Math.min(entra(t, T.ano24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · SIGA SET/2026 · TCM-BA' : 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA';
    return (
      <div style={{position: 'absolute', left: LAT, right: LAT, top: 400, opacity: Math.max(k1, k2)}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
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
      // regra 73: a plaquinha inteira fica a 90 px ou mais das laterais (o Reels em tela cheia come as bordas)
      const meia = larg(r) / 2;
      return {i, x: Math.max(LAT + meia, Math.min(W - LAT - meia, SEGURO.botoesX - 90, pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 72 : 56));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-64, 64, -128, 128, -192, 192, 256].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: LAT, right: LAT, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
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

// ---------- O mapa do Kit Mapas, por cima do 3D (gerado com os tempos desta mesma voz) ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/nazare.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 50).map((e) => e.t)), T.fb25, T.inf25, T.aj25, T.oito, T.subiu];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('181 milhoes'), quando('142 milhoes'), quando('102 milhoes')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.fb24, T.inf24, T.f24, T.f25, T.f26, T.aj24, T.aj26, T.camara, T.deve].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.fb25, T.inf25, T.aj25, T.oito, T.subiu, T.turZero].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  [T.porque, T.festas2, T.familias2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, 12.5, T.ano24 + 0.6, T.arrec24 + 1.2, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.turZero + 1.2, T.turZero + 3.0,
  T.repara + 0.6, T.fb24 + 1.0, T.fb25 + 1.2, T.infantil + 1.0, T.inf25 + 1.0, T.contas + 0.6,
  T.festas + 0.6, T.f24 + 1.2, T.f25 + 1.2, T.f26 + 1.4, T.ajuda + 0.8, T.aj25 + 0.8, T.aj26 + 1.2,
  T.camara + 0.6, T.camara + 2.0, T.oito + 1.2, T.deve + 1.0, T.inss + 0.8, T.pagando + 1.0, T.subiu + 0.6,
  T.tribunal + 0.6, T.juros + 1.0, T.juros + 2.4, T.recurso + 0.8, T.vacina + 1.0, T.falhas + 1.0,
  T.gastar + 0.5, T.porque + 1.2, T.festas2 + 1.2, T.familias2 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoNazare: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
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
      <CabecalhoCidade tema={tema} cidade="NAZARÉ" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Fundeb caiu', 'R$ 44 mi.', 'Festas:', 'R$ 3,8 mi.'];
export const CapaOrcamentoNazare: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 540}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · NAZARÉ · 2025`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 12 ? 100 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
