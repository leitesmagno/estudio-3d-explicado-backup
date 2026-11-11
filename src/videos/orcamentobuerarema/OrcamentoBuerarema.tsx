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
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 097. orçamento de Buerarema (BA) (perfil @eumagnoleite). MOLDE: 093 Ilhéus / 092 Ubaitaba / 079 Nazaré (brief _brief-lote-40.md).
// O Kit Mapas abre (voo até Buerarema, as três receitas e a de 2024: projetos/097.../mapas/buerarema.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setor = unidade orçamentária do PCMGE065 consolidado (ação 2.034 em Dívidas; ações 2.049/2.093 em Esporte).
// Sem porcentagem, sem nome de gestor, sem nome de empresa. SÓ DADOS DE BUERAREMA, todos do TCM-BA:
// projetos/097.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 168.38; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, sem atempo, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '097. orçamento de buerarema';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('A prefeitura arrecadou 77'),
  gastou24: quando('Gastou 79'),
  mais24: quando('2 milhoes e 900 a mais'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 85'),
  gastou25: quando('Gastou 82'),
  mais25: quando('Sobraram'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 68'),
  gastou26: quando('Ja gastou 64'),
  comprometeu: quando('E ja comprometeu'),
  folha: quando('Uma parte e folha'),
  espZero: quando('zero de novo'),
  repara: quando('Agora repara'),
  festas: quando('So as festas populares'),
  f24: quando('levaram 3 milhoes e 200'),
  f25: quando('4 milhoes e 600 em 2025'),
  f26: quando('3 milhoes e 400 ate'),
  mesmo: quando('No mesmo tempo'),
  ag24: quando('237 mil', 2),
  ag25: quando('304 mil', 2),
  ag26: quando('213 mil', 2),
  espNada: quando('E o esporte nada'),
  detalhe: quando('Tem um detalhe'),
  funcao: quando('na funcao Educacao'),
  infantil: quando('na parte de educacao infantil'),
  naoExplicam: quando('As contas nao explicam'),
  camara: quando('A Camara de Vereadores gastou'),
  onze: quando('mais de 11 vezes'),
  deve: quando('A prefeitura deve'),
  inss: quando('77 milhoes sao do INSS'),
  pratic: quando('E praticamente tudo'),
  em2026: quando('E em 2026'),
  natal: quando('o Natal sem Fome'),
  seg: quando('a seguranca alimentar'),
  hab: quando('a habitacao'),
  crianca: quando('a protecao a crianca'),
  previam: quando('previam 1 milhao'),
  zeroGasto: quando('Gasto ate setembro'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se as festas levaram'),
  esporte2: quando('por que o esporte ficou'),
  agr2: quando('e a agricultura com 304'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
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
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.175 * Math.PI);
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
    ['agr', 'Agricultura e meio'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 79.909, rotulo: '2024', falta: {t: T.mais24, v: 2.881, txt: 'A MAIS'}, entradas: lista(1, [28.743, 19.4, 8.2298, 8.3264, 2.9819, 5.0828, 4.4045, 2.5039, 0.23688, 0])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 82.565, rotulo: '2025', falta: {t: T.mais25, v: 2.4015, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [30.221, 19.339, 9.4751, 7.4433, 3.4078, 4.7613, 5.7074, 1.905, 0.30409, 0])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 64.719, rotulo: '2026 · ATÉ SET', falta: {t: T.comprometeu, v: 2.2224, txt: 'COMPROMETIDOS A MAIS'}, entradas: lista(3, [24.651, 16.177, 7.4512, 6.0974, 2.8309, 1.4736, 3.6933, 2.1314, 0.21304, 0])},
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
const ESCALA = 2; // 1 pilha = R$ 2 milhões
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
// esquerda (1 pilha = R$ 250 mil): a ação das festas populares (2024, 2025, 2026) e, na frente, agricultura e meio ambiente; o esporte (R$ 0) no fim da fila
const ESC_E = 0.25;
// tudo na MESMA fila (revisão 1: na fila da frente, as torrinhas da agricultura sumiam atrás do letreiro da gaveta)
const FE = {
  f24: {p: [-4.0, 0, ZA] as V3, v: 3.1996},
  f25: {p: [-3.15, 0, ZA] as V3, v: 4.5566},
  f26: {p: [-2.3, 0, ZA] as V3, v: 3.3733},
  a24: {p: [-1.35, 0, ZA] as V3, v: 0.23688},
  a25: {p: [-0.75, 0, ZA] as V3, v: 0.30409},
  a26: {p: [-0.15, 0, ZA] as V3, v: 0.21304},
  esp: {p: [0.6, 0, ZA] as V3, v: 0},
};
const GAV_X = -1.7;
// à direita: a pasta da ação das festas (código 12.365 = função Educação, subfunção Educação Infantil)
const PASTA_EDU: V3 = [2.95, 0, 0.4];
// atrás do cofre: a Câmara x agricultura e meio ambiente (2025, 1 pilha = R$ 250 mil) e a dívida x o que arrecadou em 2025 (1 pilha = R$ 2 mi, torres 4 x 4)
const ESC_F = 2;
const ZD = -2.0;
const CM = {
  cam: {p: [-2.45, 0, ZD] as V3, v: 3.4078},
  agr: {p: [-1.4, 0, ZD] as V3, v: 0.30409},
  div: {p: [0.55, 0, ZD] as V3, v: 85.03},
  rec: {p: [1.85, 0, ZD] as V3, v: 84.966},
};
const FE_VIS = (t: number) => vis(t, T.repara - 0.2, T.camara - 0.5) + vis(t, T.gastar - 0.1, FIM + 2);
const EDU_VIS = (t: number) => vis(t, T.detalhe - 0.3, T.camara - 0.5);
const CM_VIS = (t: number) => vis(t, T.camara - 0.3, T.em2026 - 0.2);
type Carimbo = [number, string, 'alerta' | 'neutro'];
// 2026: ações previstas que não gastaram nada até setembro (PCMGE065 set/2026)
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'NATAL SEM FOME', valor: 'R$ 198 MIL', t: T.natal, carimbos: [[T.zeroGasto + 0.2, 'GASTO R$ 0', 'alerta']]},
  {titulo: 'SEGURANÇA ALIMENTAR', valor: 'R$ 322 MIL', t: T.seg, carimbos: [[T.zeroGasto + 0.35, 'GASTO R$ 0', 'alerta']]},
  {titulo: 'HABITAÇÃO', valor: 'R$ 403 MIL', t: T.hab, carimbos: [[T.zeroGasto + 0.5, 'GASTO R$ 0', 'alerta']]},
  {titulo: 'PROTEÇÃO À CRIANÇA', valor: 'R$ 322 MIL', t: T.crianca, carimbos: [[T.zeroGasto + 0.65, 'GASTO R$ 0', 'alerta']]},
];
const posPasta = (i: number): V3 => [-2.9 + i * 1.95, 0, 1.0];
const PASTAS_VIS = (t: number) => vis(t, T.em2026 - 0.1, T.gastar - 0.1);

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
  // as festas (três anos) e agricultura e meio ambiente na frente
  const fe = FE_VIS(t);
  if (fe > 0.01) {
    if (!final) {
      const k1 = cresce(T.f24 + 0.4) * fe;
      if (k1 > 0.01) solidas.push(...torre(FE.f24.p, tAk(FE.f24.v, ESC_E, k1), LADO_A, CA[0], PASSO_A));
      const k3 = cresce(T.f26 + 0.3) * fe;
      if (k3 > 0.01) solidas.push(...torre(FE.f26.p, tAk(FE.f26.v, ESC_E, k3), LADO_A, CA[2], PASSO_A));
      const a1 = cresce(T.ag24 + 0.2) * fe;
      if (a1 > 0.01) solidas.push(...torre(FE.a24.p, tAk(FE.a24.v, ESC_E, a1), 2, mistura(CA[0], tema.objetoClaro, 0.45), PASSO_A));
      const a3 = cresce(T.ag26 + 0.2) * fe;
      if (a3 > 0.01) solidas.push(...torre(FE.a26.p, tAk(FE.a26.v, ESC_E, a3), 2, mistura(CA[2], tema.objetoClaro, 0.45), PASSO_A));
    }
    const k2 = cresce(T.f25 + 0.3) * fe;
    if (k2 > 0.01) solidas.push(...torre(FE.f25.p, tAk(FE.f25.v, ESC_E, k2), LADO_A, CA[1], PASSO_A));
    const a2 = cresce(T.ag25 + 0.2) * fe;
    if (a2 > 0.01) solidas.push(...torre(FE.a25.p, tAk(FE.a25.v, ESC_E, a2), 2, mistura(CA[1], tema.objetoClaro, 0.45), PASSO_A));
  }
  // a Câmara x agricultura e meio ambiente (2025) e a dívida x o que arrecadou em 2025
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const k1 = cresce(T.camara + 0.6) * cm;
    if (k1 > 0.01) solidas.push(...torre(CM.cam.p, tAk(CM.cam.v, ESC_E, k1), LADO_A, CA[1], PASSO_A));
    const k2 = cresce(T.onze + 0.3) * cm;
    if (k2 > 0.01) solidas.push(...torre(CM.agr.p, tAk(CM.agr.v, ESC_E, k2), LADO_A, mistura(CA[1], tema.objetoClaro, 0.45), PASSO_A));
    const k3 = cresce(T.deve + 0.2) * cm;
    if (k3 > 0.01) solidas.push(...torre(CM.div.p, tAk(CM.div.v, ESC_F, k3), 4, C.alerta, PASSO_A));
    const k4 = cresce(T.pratic + 0.3) * cm;
    if (k4 > 0.01) solidas.push(...torre(CM.rec.p, tAk(CM.rec.v, ESC_F, k4), 4, CA[1], PASSO_A));
  }
  return {solidas, fantasmas, torres};
};

// enfeites só no vão entre o Esporte (último) e a Educação (primeira), longe das casinhas dos setores
const CASAS: [V3, number][] = [
  [[-3.9, 0, 7.4], 0.45],
  [[-1.5, 0, 8.3], 0.15],
  [[0.95, 0, 8.4], -0.1],
];
const ARVORES: V3[] = [
  [-2.75, 0, 7.95],
  [-0.25, 0, 8.45],
  [-5.0, 0, 6.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  // a casinha sobe ~1 s ANTES da primeira menção (regra do 081: nada de gramado vazio)
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const zerado = s.id === 'esp'; // esporte: R$ 0 nos três anos (casinha cinza)
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
  const fe = FE_VIS(t);
  const ed = EDU_VIS(t);
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

      {/* festas x agricultura e meio ambiente e esporte (esquerda); a pasta da ação das festas (direita); Câmara x agricultura e a dívida (atrás do cofre) */}
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={fe} larg={5.8} texto="FESTAS x AGRICULTURA · ESPORTE" aceso={Math.max(janela(t, T.festas, T.detalhe, 0.4), janela(t, T.porque, T.segue, 0.4))} />
      <PastaProcesso
        tema={tema}
        pos={PASTA_EDU}
        rotY={-0.12}
        escala={1.15}
        sobe={rampa(t, T.detalhe - 0.2, T.detalhe + 0.35) * ed}
        titulo="FESTAS POPULARES · AÇÃO 2.046"
        valor="12.365"
        carimbo={rampa(t, T.funcao + 0.2, T.funcao + 0.6)}
        textoCarimbo={t < T.infantil + 0.2 ? 'FUNÇÃO EDUCAÇÃO' : 'EDUCAÇÃO INFANTIL'}
        corCarimbo={mistura(C.ouro, tema.texto, 0.35)}
        aceso={janela(t, T.detalhe, T.camara, 0.4)}
      />
      <BaseGaveta tema={tema} pos={[-0.3, 0, ZD]} sobe={cm} larg={5.6} texto="CÂMARA x AGRICULTURA · DÍVIDA" aceso={janela(t, T.camara, T.em2026, 0.4)} />

      {/* 2026: as ações previstas que não gastaram nada até setembro */}
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1.5 - i) * 0.05}
            escala={0.95}
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
  // as festas (três anos) e, na fila da frente, agricultura e meio ambiente; o esporte (R$ 0) no fim
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([GAV_X, 1.0, 0.6], 7.4, 6.8, [0, 1.7, 1])],
      [T.f24 - 0.1, E([-3.6, 1.2, 0.3], 3.9, 4.3, [-0.04, 1.3, 1])],
      [T.f26 - 0.1, E([-3.0, 1.2, 0.3], 4.3, 4.6, [-0.01, 1.3, 1])],
      [T.mesmo - 0.2, E([-1.6, 0.9, 0.3], 5.8, 5.6, [0.0, 1.25, 1])],
      [T.ag26 + 0.4, E([-1.4, 0.9, 0.3], 5.6, 5.4, [0.02, 1.25, 1])],
      [T.espNada - 0.1, E([-0.4, 0.7, 0.3], 4.6, 4.6, [0.05, 1.2, 1])],
      [T.detalhe - 0.4, E([-0.3, 0.7, 0.3], 4.5, 4.5, [0.06, 1.2, 1])],
    ],
  },
  // a pasta da ação das festas: código 12.365 (função Educação, educação infantil)
  {
    ini: T.detalhe - 0.3,
    arco: 0.03,
    chaves: [
      [T.detalhe - 0.3, E([1.0, 0.9, 0.5], 7.0, 6.6, [0.03, 1.5, 1])],
      [T.funcao - 0.2, E(soma(PASTA_EDU, [0, 0.7, 0]), 3.6, 3.6, [0.06, 1.5, 1])],
      [T.naoExplicam - 0.2, E(soma(PASTA_EDU, [0, 0.7, 0]), 3.5, 3.5, [0.08, 1.5, 1])],
      [T.camara - 0.4, E([1.6, 0.9, 0.5], 6.4, 6.2, [0.06, 1.5, 1])],
    ],
  },
  // atrás do cofre: a Câmara x agricultura e meio ambiente (2025), depois a dívida x o que arrecadou em 2025
  {
    ini: T.camara - 0.2,
    arco: 0.03,
    chaves: [
      [T.camara - 0.2, E(soma(meio(CM.cam.p, CM.agr.p), [0, 0.8, 0]), 4.2, 4.5, [-0.03, 1.3, 1])],
      [T.deve - 0.3, E(soma(meio(CM.cam.p, CM.agr.p), [0, 0.8, 0]), 3.9, 4.2, [-0.01, 1.3, 1])],
      [T.deve + 0.5, E(soma(meio(CM.div.p, CM.rec.p), [0, 1.2, 0]), 4.4, 4.8, [0.03, 1.4, 1])],
      [T.em2026 - 0.4, E(soma(meio(CM.div.p, CM.rec.p), [0, 1.1, 0]), 4.2, 4.6, [0.05, 1.4, 1])],
    ],
  },
  // 2026: as quatro pastas, da esquerda para a direita, depois todas com o carimbo
  {
    ini: T.em2026 - 0.2,
    arco: 0.03,
    chaves: [
      [T.em2026 - 0.2, E([0, 0.8, 0.9], 9.2, 7.0, [0, 1.9, 1])],
      [T.natal - 0.1, E(soma(meio(posPasta(0), posPasta(1)), [0, 0.7, 0]), 4.8, 4.6, [-0.05, 1.5, 1])],
      [T.hab - 0.3, E(soma(meio(posPasta(0), posPasta(1)), [0, 0.7, 0]), 4.7, 4.5, [-0.04, 1.5, 1])],
      [T.hab + 0.2, E(soma(meio(posPasta(2), posPasta(3)), [0, 0.7, 0]), 4.8, 4.6, [0.05, 1.5, 1])],
      [T.previam - 0.1, E(soma(meio(posPasta(2), posPasta(3)), [0, 0.7, 0]), 4.7, 4.5, [0.06, 1.5, 1])],
      [T.zeroGasto - 0.3, E([0, 0.7, 1.0], 8.6, 6.8, [0.02, 1.7, 1])],
      [T.gastar - 0.2, E([0, 0.7, 1.0], 8.4, 6.6, [0.04, 1.7, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois as festas de 2025, o esporte (R$ 0) e a agricultura de 2025
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-0.4, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E([-3.15, 1.2, 0.3], 4.2, 4.6, [-0.03, 1.3, 1])],
      [T.esporte2 - 0.4, E([-3.0, 1.1, 0.3], 4.1, 4.5, [-0.02, 1.3, 1])],
      [T.esporte2 + 0.2, E([0.4, 0.6, 0.3], 4.2, 4.4, [0.04, 1.2, 1])],
      [T.agr2 - 0.2, E([-0.6, 0.6, 0.3], 4.2, 4.4, [0.0, 1.2, 1])],
      [T.agr2 + 0.6, E([-1.3, 0.8, 0.3], 5.6, 5.4, [-0.01, 1.25, 1])],
      [T.segue - 0.1, E([-1.2, 1.3, 0.6], 8.4, 7.2, [0.03, 1.6, 1])],
      [T.segue + 0.8, E([-1.0, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.detalhe, T.camara, T.em2026, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 79,9 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 2,9 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 85 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 82,6 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 2,4 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 68,5 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 64,7 MI'},
    {a: T.comprometeu, b: T.folha, texto: 'COMPROMETIDO: R$ 70,7 MI · ARRECADADO: R$ 68,5 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      if (e.s === 'esp' && y === Y2) return; // o esporte de 2026 tem chip próprio (previa R$ 80 mil)
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`, destaque: e.v === 0});
    });
  });
  c.push(
    {a: Y2.entradas[9].t, b: T.repara, texto: 'ESPORTE 2026: PREVISTO R$ 80 MIL · GASTO R$ 0', destaque: true},
    {a: T.repara, b: T.festas, texto: 'AGORA REPARA'},
    {a: T.festas, b: T.mesmo, texto: 'FESTAS POPULARES: R$ 3,2 MI · 4,6 MI · 3,4 MI (ATÉ SET/2026)'},
    {a: T.mesmo, b: T.espNada, texto: 'AGRICULTURA E MEIO AMBIENTE: 237 MIL · 304 MIL · 213 MIL', destaque: true},
    {a: T.espNada, b: T.detalhe, texto: 'ESPORTE: R$ 0 EM 2024, 2025 E 2026', destaque: true},
    {a: T.detalhe, b: T.funcao, texto: 'UM DETALHE NO DOCUMENTO'},
    {a: T.funcao, b: T.naoExplicam, texto: 'AÇÃO DAS FESTAS: CÓDIGO 12.365 · FUNÇÃO EDUCAÇÃO, EDUCAÇÃO INFANTIL', destaque: true},
    {a: T.naoExplicam, b: T.camara, texto: 'AS CONTAS NÃO EXPLICAM POR QUÊ'},
    {a: T.camara, b: T.onze, texto: 'CÂMARA DE VEREADORES 2025: R$ 3,4 MI'},
    {a: T.onze, b: T.deve, texto: 'AGRICULTURA E MEIO AMBIENTE 2025: R$ 304 MIL', destaque: true},
    {a: T.deve, b: T.inss, texto: 'DÍVIDA NO FIM DE 2025: R$ 85 MI'},
    {a: T.inss, b: T.pratic, texto: 'R$ 77 MI SÃO DO INSS', destaque: true},
    {a: T.pratic, b: T.em2026, texto: 'DÍVIDA: R$ 85,03 MI · ARRECADOU EM 2025: R$ 84,97 MI', destaque: true},
    {a: T.em2026, b: T.previam, texto: '2026 · PREVISTO NO ORÇAMENTO'},
    {a: T.previam, b: T.zeroGasto, texto: 'QUATRO AÇÕES: PREVISTO R$ 1,2 MI · NADA EMPENHADO'},
    {a: T.zeroGasto, b: T.gastar, texto: 'GASTO ATÉ SETEMBRO: R$ 0', destaque: true},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.esporte2, texto: 'FESTAS EM 2025: R$ 4,6 MI...', destaque: true},
    {a: T.esporte2, b: T.agr2, texto: '...POR QUE O ESPORTE FICOU SEM NADA...', destaque: true},
    {a: T.agr2, b: T.segue, texto: '...E A AGRICULTURA COM R$ 304 MIL?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE065 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE065 DEZ/2025 · DESPESA LIQUIDADA · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: PCMGE066 E PCMGE065 SET/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: PCMGE065 SET/2026 (CONSOLIDADO) · LIQUIDADO'},
  {a: T.repara, b: T.camara, texto: 'FONTE: DESPESA POR AÇÃO (PCMGE065) 2024 A 2026 · TCM-BA'},
  {a: T.camara, b: T.deve, texto: 'FONTE: PCMGE065 DEZ/2025 · LIQUIDADO'},
  {a: T.deve, b: T.em2026, texto: 'FONTE: ANEXO 16 (DÍVIDA FUNDADA) E BALANÇO 2025'},
  {a: T.em2026, b: T.gastar, texto: 'FONTE: PCMGE065 SET/2026 · DOTAÇÃO x LIQUIDADO'},
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
  // regra 48: o setor zerado também tem plaquinha (Esporte, nos três anos)
  const PREV_ESP = ['PREVISTO R$ 0 · 2024', 'PREVIA R$ 16.764 · 2025', 'PREVIA R$ 80 MIL · 2026'];
  ANOS.forEach((y, yi) => {
    const e = y.entradas[9];
    r.push({a: e.t + 0.45, b: yi === 2 ? T.repara - 0.1 : y.fim + 0.2, p: soma(posTorre(idx('esp'), yi), [0, 0.7, 0]), valor: 'R$ 0', sub: `ESPORTE · ${PREV_ESP[yi]}`, cor: C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  const pe = (c: V3) => topo(c, 0.3, 1, 2); // a plaquinha da fila da frente fica no topo da torrinha (fora do letreiro da gaveta)
  // as festas e agricultura e meio ambiente; o esporte
  const fimE = T.detalhe + 0.2;
  r.push(
    {a: T.f24 + 0.6, b: T.mesmo + 0.9, p: topo(FE.f24.p, FE.f24.v, ESC_E), valor: 'R$ 3,2 MI', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.f25 + 0.5, b: T.mesmo + 0.9, p: topo(FE.f25.p, FE.f25.v, ESC_E), valor: 'R$ 4,6 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.f26 + 0.5, b: T.mesmo + 0.9, p: topo(FE.f26.p, FE.f26.v, ESC_E), valor: 'R$ 3,4 MI', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.ag24 + 0.4, b: fimE, p: pe(FE.a24.p), valor: 'R$ 237 MIL', sub: 'AGRIC. · 2024', cor: CA[0]},
    {a: T.ag25 + 0.4, b: fimE, p: pe(FE.a25.p), valor: 'R$ 304 MIL', sub: 'AGRIC. · 2025', cor: CA[1]},
    {a: T.ag26 + 0.4, b: fimE, p: pe(FE.a26.p), valor: 'R$ 213 MIL', sub: 'AGRIC. · 2026', cor: CA[2]},
    {a: T.espNada + 0.3, b: fimE, p: soma(FE.esp.p, [0, 0.4, 0]), valor: 'R$ 0', sub: 'ESPORTE · 2024 A 2026', cor: C.alerta},
  );
  // a Câmara x agricultura e a dívida x o que arrecadou em 2025
  const fimC = T.em2026 - 0.2;
  r.push(
    {a: T.camara + 1.0, b: T.deve + 0.3, p: topo(CM.cam.p, CM.cam.v, ESC_E), valor: 'R$ 3,4 MI', sub: 'CÂMARA · 2025', cor: CA[1]},
    {a: T.onze + 0.5, b: T.deve + 0.3, p: topo(CM.agr.p, CM.agr.v, ESC_E), valor: 'R$ 304 MIL', sub: 'AGRICULTURA · 2025'},
    {a: T.deve + 0.6, b: fimC, p: topo(CM.div.p, CM.div.v, ESC_F, 4), valor: 'R$ 85 MI', sub: 'DÍVIDA · 77 MI DO INSS', cor: C.alerta},
    {a: T.pratic + 0.6, b: fimC, p: topo(CM.rec.p, CM.rec.v, ESC_F, 4), valor: 'R$ 85 MI', sub: 'ARRECADOU EM 2025', cor: CA[1]},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.5, p: topo(FE.f25.p, FE.f25.v, ESC_E), valor: 'R$ 4,6 MI', sub: 'FESTAS · 2025', cor: tema.acento},
    {a: T.esporte2 + 0.3, b: T.segue + 0.5, p: soma(FE.esp.p, [0, 0.4, 0]), valor: 'R$ 0', sub: 'ESPORTE', cor: tema.acento},
    {a: T.agr2 + 0.3, b: T.segue + 0.5, p: pe(FE.a25.p), valor: 'R$ 304 MIL', sub: 'AGRICULTURA · 2025', cor: tema.acento},
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
  const miolo = vis(t, T.repara + 0.2, T.detalhe - 0.2) + vis(t, T.camara, T.em2026 - 0.3) + vis(t, T.gastar, FIM + 2);
  const escalaTxt =
    miolo <= 0.01
      ? '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'
      : t >= T.deve && t < T.em2026
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
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · PCMGE066 SET/2026 · TCM-BA' : 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/buerarema.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 25).map((e) => e.t)), T.f25, T.espNada, T.funcao, T.onze, T.inss, T.zeroGasto];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('77 milhoes'), quando('85 milhoes'), quando('68 milhoes')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.f24, T.f25, T.f26, T.ag24, T.ag26, T.camara, T.deve, T.pratic].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.ag25, T.espNada, T.onze, T.inss, T.espZero].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  s.push({t: T.detalhe + 0.1, f: 'pop', v: 0.14}, {t: T.funcao + 0.25, f: 'tique', v: 0.15});
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  [T.porque, T.esporte2, T.agr2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
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
  T.espZero + 1.2, T.espZero + 2.6,
  T.repara + 0.6, T.festas + 0.8, T.f24 + 1.2, T.f25 + 1.2, T.f26 + 1.4, T.mesmo + 1.0, T.ag25 + 0.8, T.ag26 + 1.0, T.espNada + 1.0,
  T.detalhe + 0.6, T.funcao + 1.0, T.infantil + 1.2, T.naoExplicam + 0.8,
  T.camara + 0.6, T.camara + 2.0, T.onze + 1.2, T.deve + 1.0, T.inss + 0.8, T.pratic + 1.2,
  T.em2026 + 0.6, T.natal + 0.8, T.seg + 0.8, T.hab + 0.8, T.crianca + 1.0, T.previam + 1.0, T.zeroGasto + 1.2,
  T.gastar + 0.5, T.porque + 1.2, T.esporte2 + 1.0, T.agr2 + 1.0, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoBuerarema: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="BUERAREMA" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festas:', 'R$ 4,6 mi.', 'Esporte:', 'R$ 0.'];
export const CapaOrcamentoBuerarema: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · BUERAREMA · 2025`} t={1} troca={0} y={SEGURO.topo + 160} />
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
