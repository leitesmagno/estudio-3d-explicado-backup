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
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {EstradaRural} from '../orcamentocabralia/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 074. orçamento de Macaúbas (BA) (perfil @eumagnoleite). MOLDE: 092 Ubaitaba / 086 Gandu (brief _brief-molde-ubaitaba.md).
// O Kit Mapas abre (voo até Macaúbas e as três receitas: projetos/074.../mapas/macaubas.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 4 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setor = SECRETARIA/UNIDADE (função 28 em "Dívidas e encargos"; função 26 em "Estradas e transportes").
// Sem porcentagem, sem nome de gestor, sem nome de empresa. SÓ DADOS DE MACAÚBAS, todos do TCM-BA:
// projetos/074.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 178.61; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes + 0,35 s, pausas 0,28 s, atempo 1,181, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '074. orçamento de macaúbas';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('A prefeitura arrecadou'),
  gastou24: quando('Gastou 215'),
  mais24: quando('4 milhoes e 100'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 229'),
  gastou25: quando('Gastou 221'),
  mais25: quando('Desta vez'),
  ano26: quando('2026 ate setembro ultimo'),
  arrec26: quando('Arrecadou 183'),
  gastou26: quando('Ja gastou 179'),
  comprometeu: quando('ja comprometeu'),
  repara: quando('Agora repara'),
  ev24: quando('gastou 4 milhoes e 400'),
  ev25: quando('e 5 milhoes em 2025'),
  previsto: quando('O previsto era menor'),
  em26: quando('Em 2026 so'),
  ev26: quando('ja foram 6'),
  maisQue: quando('mais que o ano inteiro'),
  agr: quando('Enquanto isso'),
  usina: quando('A usina de cana'),
  zeroUs: quando('gastou zero'),
  areas: quando('A recuperacao de areas'),
  zeroAr: quando('gastou zero', 2),
  divida: quando('E tem a divida'),
  div23: quando('era de 92'),
  div25: quando('No fim de 2025'),
  inss: quando('So em 2024'),
  pessoal: quando('E os salarios'),
  tribunal: quando('No Tribunal de Contas'),
  sj: quando('o artista do Sao Joao'),
  adv: quando('dois contratos de advocacia'),
  fundef: quando('o uso do precatorio'),
  naoCond: quando('Estar no tribunal'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se a divida'),
  eventos2: quando('por que os eventos'),
  usina2: quando('e a usina de cana ficou'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'estrada' | 'agua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS, LIMPEZA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'est', nome: 'ESTRADAS E TRANSPORTES', tipo: 'estrada'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA, ESPORTE E TURISMO', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E ESGOTO (SAAE)', tipo: 'agua'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.152 * Math.PI);
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
    ['obr', 'Obras limpeza'],
    ['est', 'Estradas e transportes'],
    ['cam', 'Camara'],
    ['div', 'Dividas e encargos'],
    ['cul', 'Cultura esporte'],
    ['ass', 'Assistencia social'],
    ['agu', 'Agua e esgoto'],
    ['mam', 'Meio ambiente'],
    ['agr', 'Agricultura'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 215.56, rotulo: '2024', falta: {t: T.mais24, v: 4.1055, txt: 'A MAIS'}, entradas: lista(1, [80.596, 54.218, 17.518, 17.698, 11.237, 5.6346, 7.9289, 6.8282, 2.997, 7.7183, 2.4234, 0.75904])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 221.22, rotulo: '2025', falta: {t: T.mais25, v: 8.0203, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [88.31, 53.725, 17.008, 16.007, 8.56, 6.4012, 8.8063, 6.7646, 2.9652, 8.2271, 3.298, 1.1578])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 179.71, rotulo: '2026 · ATÉ SET', falta: {t: T.comprometeu, v: 30.673, txt: 'COMPROMETIDOS ALÉM DO ARRECADADO'}, entradas: lista(3, [69.675, 45.111, 11.76, 16.071, 5.9786, 5.1214, 5.5571, 7.424, 3.5443, 6.3333, 2.1715, 0.95888])},
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

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2024 usa cerca de 59 pilhas) ----------
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

// ---------- Os achados no miolo (aqui, 1 pilha = R$ 500 mil; torres de 2 x 2) ----------
// branco transparente = previsto/reservado no orçamento; cor do ano = gasto (2024 dourado, 2025 verde, 2026 rosa)
const ESC_A = 0.5;
const LADO_A = 2;
const PASSO_A = 0.3;
const ZA = 0.2;
// esquerda: a ação de eventos tradicionais x o previsto (previsto ao lado do gasto, regra do 081)
const EV = {
  e24: {p: [-4.7, 0, ZA] as V3, v: 4.44258},
  p24: {p: [-3.88, 0, ZA] as V3, res: 2.35},
  e25: {p: [-2.98, 0, ZA] as V3, v: 5.02399},
  p25: {p: [-2.16, 0, ZA] as V3, res: 3.04508},
  e26: {p: [-1.2, 0, ZA] as V3, v: 6.27898},
};
// direita: a agricultura de 2025 e o que ficou no zero (usina de cana e áreas degradadas: reservado, branco)
const DI = {
  agr: {p: [0.8, 0, ZA] as V3, v: 1.15781},
  us: {p: [1.75, 0, ZA] as V3, res: 0.854635},
  ar: {p: [3.15, 0, ZA] as V3, res: 13.23016},
};
// atrás do cofre: a dívida fundada (Anexo 16), aqui 1 pilha = R$ 4 mi (a escala da mesa)
const ZD = -2.0;
const DV = {
  d23: {p: [-2.2, 0, ZD] as V3, v: 92.454},
  d25: {p: [-0.45, 0, ZD] as V3, v: 129.924},
  inss: {p: [1.45, 0, ZD] as V3, v: 42.922},
};
const EV_VIS = (t: number) => vis(t, T.repara + 0.1, T.agr - 0.2) + vis(t, T.gastar - 0.1, FIM + 2);
const DI_VIS = (t: number) => vis(t, T.agr - 0.1, T.divida + 1.2) + vis(t, T.gastar - 0.1, FIM + 2);
const DV_VIS = (t: number) => vis(t, T.divida + 0.9, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'ARTISTA DO SÃO JOÃO', valor: '2026', t: T.sj, carimbos: [[T.sj + 0.6, 'NO TCM-BA', 'neutro']]},
  {titulo: 'CONTRATOS DE ADVOCACIA', valor: '2025', t: T.adv, carimbos: [[T.adv + 0.6, 'NO TCM-BA', 'neutro']]},
  {titulo: 'PRECATÓRIO DO FUNDEF', valor: '2023-2024', t: T.fundef, carimbos: [[T.fundef + 0.5, 'NO TCM-BA', 'neutro']]},
];
const posPasta = (i: number): V3 => [-1.8 + i * 1.8, 0, 1.3];
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
    // torre vermelha "A MAIS" na frente do cofre (2024 e 2025); em 2026, o comprometido além do arrecadado
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (_c: V3, v: number, k: number) => Math.max(0.3, v / ESC_A) * k;
  // os eventos x o previsto (2024, 2025) e 2026 até setembro
  const ev = EV_VIS(t);
  if (ev > 0.01) {
    const k1 = cresce(T.ev24 + 0.3) * ev;
    if (k1 > 0.01 && !final) solidas.push(...torre(EV.e24.p, tAk(EV.e24.p, EV.e24.v, k1), LADO_A, CA[0], PASSO_A));
    const k2 = cresce(T.ev25 + 0.2) * ev;
    if (k2 > 0.01) solidas.push(...torre(EV.e25.p, tAk(EV.e25.p, EV.e25.v, k2), LADO_A, CA[1], PASSO_A));
    const k3 = cresce(T.previsto + 0.5) * ev;
    if (k3 > 0.01 && !final) {
      fantasmas.push(...torre(EV.p24.p, tAk(EV.p24.p, EV.p24.res, k3), LADO_A, tema.objetoClaro, PASSO_A));
      fantasmas.push(...torre(EV.p25.p, tAk(EV.p25.p, EV.p25.res, k3), LADO_A, tema.objetoClaro, PASSO_A));
    }
    const k4 = cresce(T.ev26 + 0.2) * ev;
    if (k4 > 0.01) solidas.push(...torre(EV.e26.p, tAk(EV.e26.p, EV.e26.v, k4), LADO_A, CA[2], PASSO_A));
  }
  // a agricultura de 2025 e o que ficou no zero
  const di = DI_VIS(t);
  if (di > 0.01) {
    const k0 = cresce(T.agr + 0.8) * di;
    if (k0 > 0.01 && !final) solidas.push(...torre(DI.agr.p, tAk(DI.agr.p, DI.agr.v, k0), LADO_A, CA[1], PASSO_A));
    const k1 = cresce(T.usina + 0.4) * di;
    if (k1 > 0.01) fantasmas.push(...torre(DI.us.p, tAk(DI.us.p, DI.us.res, k1), LADO_A, tema.objetoClaro, PASSO_A));
    const k2 = cresce(T.areas + 0.6) * di;
    if (k2 > 0.01 && !final) fantasmas.push(...torre(DI.ar.p, Math.max(0.3, DI.ar.res / ESC_A) * k2, LADO, tema.objetoClaro, PASSO_FINO));
  }
  // a dívida fundada: fim de 2023 x fim de 2025, e o INSS parcelado que entrou em 2024
  const dv = DV_VIS(t);
  if (dv > 0.01) {
    const k1 = cresce(T.div23 + 0.3) * dv;
    if (k1 > 0.01) solidas.push(...torre(DV.d23.p, (DV.d23.v / ESCALA) * k1, LADO, mistura(C.alerta, C.ouro, 0.45), PASSO_FINO));
    const k2 = cresce(T.div25 + 0.3) * dv;
    if (k2 > 0.01) solidas.push(...torre(DV.d25.p, (DV.d25.v / ESCALA) * k2, LADO, C.alerta, PASSO_FINO));
    const k3 = cresce(T.inss + 0.4) * dv;
    if (k3 > 0.01) solidas.push(...torre(DV.inss.p, (DV.inss.v / ESCALA) * k3, LADO, mistura(C.alerta, tema.texto, 0.25), PASSO_FINO));
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
    case 'estrada':
      return <EstradaRural tema={tema} pos={p} rotY={rot} sobe={sobe} aceso={aceso} escala={0.45} />;
    case 'agua':
      return <EstacaoSaneamento {...props} />;
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
  const ev = EV_VIS(t);
  const di = DI_VIS(t);
  const dv = DV_VIS(t);
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

      {/* eventos x o previsto (esquerda); agricultura e o que ficou no zero (direita); a dívida fundada (atrás do cofre) */}
      <BaseGaveta tema={tema} pos={[-2.95, 0, ZA]} sobe={ev} larg={4.8} texto="EVENTOS x O PREVISTO" aceso={Math.max(janela(t, T.repara, T.agr, 0.4), janela(t, T.eventos2, T.usina2, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.95, 0, ZA]} sobe={di} larg={4.0} texto="AGRICULTURA E O ZERO · 2025" aceso={Math.max(janela(t, T.agr, T.divida + 1.0, 0.4), janela(t, T.usina2, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[-0.35, 0, ZD]} sobe={dv} larg={5.6} texto="DÍVIDA FUNDADA · QUASE TODA INSS" aceso={janela(t, T.divida, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.sj - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
  // eventos x o previsto: da esquerda para a direita (2024, 2025, 2026)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.95, 0.9, ZA], 7.0, 6.4, [0, 1.9, 1])],
      [T.ev24 - 0.1, PG(meio(EV.e24.p, EV.p24.p), 3.4, 1.4, -0.05)],
      [T.ev25 - 0.2, PG(meio(EV.e24.p, EV.e25.p), 4.4, 1.4, -0.04)],
      [T.previsto - 0.1, PG(meio(EV.e24.p, EV.p25.p), 5.4, 1.4, -0.03)],
      [T.em26 - 0.1, PG(meio(EV.e24.p, EV.e26.p), 5.8, 1.7, -0.02)],
      [T.maisQue - 0.1, PG(meio(EV.e25.p, EV.e26.p), 4.4, 1.8, 0)],
      [T.agr - 0.3, PG(soma(meio(EV.e25.p, EV.e26.p), [0.2, 0, 0]), 4.5, 1.8, 0.01)],
    ],
  },
  // a agricultura e o que ficou no zero: da esquerda para a direita
  {
    ini: T.agr - 0.2,
    arco: 0.03,
    chaves: [
      [T.agr - 0.2, E([1.95, 0.9, ZA], 7.0, 6.4, [0, 1.9, 1])],
      [T.agr + 1.2, PG(meio(DI.agr.p, DI.us.p), 4.2, 0.8, -0.04)],
      [T.usina - 0.1, PG(meio(DI.agr.p, DI.us.p), 3.2, 0.9, -0.03)],
      [T.areas - 0.1, PG(meio(DI.us.p, DI.ar.p), 3.8, 1.3, -0.01)],
      [T.divida + 0.9, PG(soma(meio(DI.us.p, DI.ar.p), [0.2, 0, 0]), 4.2, 1.4, 0.02)],
    ],
  },
  // a dívida fundada: de frente para a gaveta de trás, 2023 x 2025, depois o INSS de 2024
  {
    ini: T.divida + 1.0,
    arco: 0.03,
    chaves: [
      [T.divida + 1.0, E([-0.35, 1.1, ZD], 7.6, 6.8, [0, 1.6, 1])],
      [T.div23 - 0.2, E(meio(DV.d23.p, DV.d25.p), 4.6, 4.6, [-0.06, 1.3, 1])],
      [T.div25 + 0.8, E(soma(meio(DV.d23.p, DV.d25.p), [0.3, 0, 0]), 4.6, 4.6, [-0.04, 1.3, 1])],
      [T.inss - 0.1, E(meio(DV.d25.p, DV.inss.p), 4.8, 4.6, [0.02, 1.3, 1])],
      [T.pessoal - 0.1, E(soma(meio(DV.d25.p, DV.inss.p), [0.2, 0, 0]), 5.4, 5.0, [0.04, 1.3, 1])],
      [T.tribunal - 0.3, E([-0.35, 1.1, ZD], 7.6, 7.0, [0.06, 1.5, 1])],
    ],
  },
  // tribunal: as três pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.sj - 0.1, E(soma(posPasta(0), [0.2, 0.7, 0]), 4.0, 3.9, [-0.1, 1.5, 1])],
      [T.adv - 0.1, E(soma(posPasta(1), [0, 0.7, 0]), 4.0, 3.9, [-0.04, 1.5, 1])],
      [T.fundef - 0.1, E(soma(posPasta(2), [-0.2, 0.7, 0]), 4.2, 4.0, [0.02, 1.5, 1])],
      [T.gastar - 0.2, E(meio(posPasta(0), posPasta(2)), 7.0, 6.0, [0.06, 1.6, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois os eventos e a usina de cana
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E([-0.5, 0.9, ZA], 10.5, 7.6, [0, 1.6, 1])],
      [T.eventos2 - 0.1, E([-1.6, 1.3, ZA], 5.6, 5.6, [-0.03, 1.6, 1])],
      [T.usina2 - 0.4, E([0.2, 1.1, ZA], 5.8, 5.6, [-0.01, 1.6, 1])],
      [T.usina2 + 0.4, E([0.3, 1.1, ZA], 6.0, 5.8, [0.0, 1.6, 1])],
      [T.segue - 0.1, E([0.3, 1.1, ZA], 6.6, 6.2, [0.01, 1.6, 1])],
      [T.segue + 0.8, E([0, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.agr, T.divida, T.tribunal, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 215,6 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 4,1 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 229,2 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 221,2 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'DESTA VEZ, SOBRARAM R$ 8 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 183,3 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 179,7 MI'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'COMPROMETIDO: R$ 214 MI · ARRECADADO: R$ 183,3 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.ev24, texto: 'AGORA REPARA'},
    {a: T.ev24, b: T.ev25, texto: 'INCENTIVO À CULTURA E EVENTOS TRADICIONAIS 2024: R$ 4,4 MI'},
    {a: T.ev25, b: T.previsto, texto: 'EVENTOS EM 2025: R$ 5 MI'},
    {a: T.previsto, b: T.em26, texto: 'PREVISTO: R$ 2,35 MI (2024) E R$ 3 MI (2025)', destaque: true},
    {a: T.em26, b: T.maisQue, texto: '2026, SÓ ATÉ SETEMBRO: R$ 6,3 MI'},
    {a: T.maisQue, b: T.agr, texto: 'JÁ PASSOU O ANO INTEIRO DE 2025', destaque: true},
    {a: T.agr, b: T.usina, texto: 'SECRETARIA DE AGRICULTURA 2025: R$ 1,2 MI'},
    {a: T.usina, b: T.areas, texto: 'USINA DE CANA: R$ 854 MIL RESERVADOS, R$ 0 GASTO', destaque: true},
    {a: T.areas, b: T.divida + 1.0, texto: 'ÁREAS DEGRADADAS: R$ 13,2 MI RESERVADOS, R$ 0 GASTO', destaque: true},
    {a: T.divida + 1.0, b: T.div25, texto: 'DÍVIDA FUNDADA NO FIM DE 2023: R$ 92,5 MI'},
    {a: T.div25, b: T.inss, texto: 'NO FIM DE 2025: R$ 129,9 MI', destaque: true},
    {a: T.inss, b: T.pessoal, texto: 'SÓ EM 2024: + R$ 42,9 MI DE INSS PARCELADO', destaque: true},
    {a: T.pessoal, b: T.tribunal, texto: 'SALÁRIOS E ENCARGOS 2025 (COM A CÂMARA): R$ 105 MI'},
    {a: T.tribunal, b: T.sj, texto: 'TRIBUNAL DE CONTAS: PROCESSOS RECENTES'},
    {a: T.sj, b: T.adv, texto: 'CONTRATAÇÃO DE ARTISTA PARA O SÃO JOÃO DE 2026'},
    {a: T.adv, b: T.fundef, texto: 'DOIS CONTRATOS DE ADVOCACIA · HONORÁRIOS QUESTIONADOS'},
    {a: T.fundef, b: T.naoCond, texto: 'USO DO PRECATÓRIO DO FUNDEF (2023 E 2024)'},
    {a: T.naoCond, b: T.gastar, texto: 'ESTAR NO TRIBUNAL NÃO É CONDENAÇÃO'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.eventos2, texto: 'A DÍVIDA PASSOU DE R$ 129 MI'},
    {a: T.eventos2, b: T.usina2, texto: 'POR QUE OS EVENTOS JÁ LEVARAM R$ 6,3 MI EM 2026...', destaque: true},
    {a: T.usina2, b: T.segue, texto: '...E A USINA DE CANA FICOU NO ZERO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE065 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE065 DEZ/2025 (CONSOLIDADO) · LIQUIDADO'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: SIGA SET/2026 · PCMGE066 E PCMGE065 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E SAAE'},
  {a: T.repara, b: T.divida + 1.0, texto: 'FONTE: DESPESA POR AÇÃO 2024 A 2026 · TCM-BA'},
  {a: T.divida + 1.0, b: T.pessoal, texto: 'FONTE: ANEXO 16 (DÍVIDA FUNDADA) 2024 E 2025 · TCM-BA'},
  {a: T.pessoal, b: T.tribunal, texto: 'FONTE: BALANÇO 2025 · PESSOAL E ENCARGOS · LIQUIDADO'},
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
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.3, v / ESC_A), LADO_A) + 0.3, 0]);
  const topoD = (c: V3, v: number) => soma(c, [0, altTorre(v / ESCALA, LADO) + 0.3, 0]);
  // eventos x o previsto
  const fimE = T.agr - 0.3;
  r.push(
    {a: T.ev24 + 0.8, b: fimE, p: topo(EV.e24.p, EV.e24.v), valor: 'R$ 4,4 MI', sub: 'EVENTOS · 2024', cor: CA[0]},
    {a: T.ev25 + 0.6, b: fimE, p: topo(EV.e25.p, EV.e25.v), valor: 'R$ 5 MI', sub: 'EVENTOS · 2025', cor: CA[1]},
    {a: T.previsto + 0.9, b: fimE, p: topo(EV.p24.p, EV.p24.res), valor: 'R$ 2,35 MI', sub: 'PREVISTO · 2024'},
    {a: T.previsto + 1.1, b: fimE, p: topo(EV.p25.p, EV.p25.res), valor: 'R$ 3 MI', sub: 'PREVISTO · 2025'},
    {a: T.ev26 + 0.6, b: fimE, p: topo(EV.e26.p, EV.e26.v), valor: 'R$ 6,3 MI', sub: 'EVENTOS · 2026 ATÉ SET', cor: CA[2]},
  );
  // a agricultura e o que ficou no zero
  const fimD = T.divida + 1.1; // o R$ 0 das áreas degradadas fica na tela durante "E tem a dívida" (regra 20)
  const topoL = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.3, v / ESC_A), LADO) + 0.3, 0]);
  r.push(
    {a: T.agr + 1.3, b: fimD, p: topo(DI.agr.p, DI.agr.v), valor: 'R$ 1,2 MI', sub: 'AGRICULTURA · 2025', cor: CA[1]},
    {a: T.usina + 0.9, b: T.zeroUs + 0.2, p: topo(DI.us.p, DI.us.res), valor: 'R$ 854 MIL', sub: 'USINA DE CANA · RESERVADO'},
    {a: T.zeroUs + 0.2, b: fimD, p: topo(DI.us.p, DI.us.res), valor: 'R$ 0', sub: 'USINA DE CANA · GASTO', cor: C.alerta},
    {a: T.areas + 1.0, b: T.zeroAr, p: topoL(DI.ar.p, DI.ar.res), valor: 'R$ 13,2 MI', sub: 'ÁREAS DEGRADADAS · RESERVADO'},
    {a: T.zeroAr, b: fimD, p: topoL(DI.ar.p, DI.ar.res), valor: 'R$ 0', sub: 'ÁREAS DEGRADADAS · GASTO', cor: C.alerta},
  );
  // a dívida fundada
  const fimV = T.tribunal - 0.3;
  const fimDV = T.pessoal + 0.4; // as três da dívida saem quando a fala chega nos salários (no máximo 2 informações novas)
  r.push(
    {a: T.div23 + 0.8, b: fimDV, p: topoD(DV.d23.p, DV.d23.v), valor: 'R$ 92,5 MI', sub: 'DÍVIDA · FIM DE 2023', cor: mistura(C.alerta, C.ouro, 0.45)},
    {a: T.div25 + 0.8, b: fimDV, p: topoD(DV.d25.p, DV.d25.v), valor: 'R$ 129,9 MI', sub: 'DÍVIDA · FIM DE 2025', cor: C.alerta},
    {a: T.inss + 1.0, b: fimDV, p: topoD(DV.inss.p, DV.inss.v), valor: 'R$ 42,9 MI', sub: 'INSS PARCELADO · ENTROU EM 2024', cor: mistura(C.alerta, tema.texto, 0.25)},
    {a: T.pessoal + 0.8, b: fimV, p: [-0.35, 3.6, ZD], valor: 'R$ 105 MI', sub: 'SALÁRIOS E ENCARGOS · 2025', cor: tema.acento},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.eventos2 + 0.3, b: T.segue + 0.5, p: topo(EV.e26.p, EV.e26.v), valor: 'R$ 6,3 MI', sub: 'EVENTOS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.eventos2 + 0.6, b: T.segue + 0.5, p: topo(EV.e25.p, EV.e25.v), valor: 'R$ 5 MI', sub: 'EVENTOS · 2025', cor: CA[1]},
    {a: T.usina2 + 0.3, b: T.segue + 0.5, p: topo(DI.us.p, DI.us.res), valor: 'R$ 0', sub: 'USINA DE CANA · 2025', cor: tema.acento},
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
  const naDivida = t >= T.divida + 0.9 && t < T.tribunal;
  const escalaTxt = naDivida ? '1 PILHA = R$ 4 MI · DÍVIDA FUNDADA (ANEXO 16)' : miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 500 MIL · BRANCO = PREVISTO' : '1 PILHA = R$ 4 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · SIGA SET/2026 · TCM-BA' : 'FONTE: ANEXO 10 / BALANÇO 2024 · TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/macaubas.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.previsto, T.maisQue, T.zeroUs, T.zeroAr, T.div25, T.inss];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('211 milhoes'), quando('229 milhoes'), quando('ja 183')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: 'baque', v: 0.2}));
  [T.ev24, T.ev25, T.ev26, T.agr, T.usina, T.areas, T.div23, T.pessoal].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.previsto, T.maisQue, T.zeroUs, T.zeroAr, T.div25, T.inss].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.eventos2, f: 'pop', v: 0.18});
  s.push({t: T.usina2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, 12.5, T.ano24 + 0.6, T.arrec24 + 1.2, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.ev24 + 1.4, T.ev25 + 1.2, T.previsto + 1.8, T.em26 + 1.0, T.ev26 + 1.2, T.maisQue + 1.2,
  T.agr + 1.8, T.usina + 1.2, T.zeroUs + 0.6, T.areas + 1.4, T.zeroAr + 0.4, T.divida + 0.6,
  T.divida + 0.5, T.div23 + 1.4, T.div25 + 1.4, T.inss + 1.6, T.pessoal + 1.6,
  T.tribunal + 0.6, T.sj + 1.2, T.adv + 1.0, T.fundef + 1.0, T.naoCond + 0.8,
  T.gastar + 0.5, T.porque + 1.0, T.eventos2 + 1.2, T.usina2 + 1.0, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoMacaubas: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="MACAÚBAS" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Eventos:', 'R$ 6,3 mi.', 'Usina de', 'cana: R$ 0.'];
export const CapaOrcamentoMacaubas: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 540}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · MACAÚBAS · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
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
