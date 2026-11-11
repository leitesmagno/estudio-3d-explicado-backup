import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {CasaMini, CofreFGTS, ArvoreRedonda} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, EstacaoSaneamento, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 064. orçamento de Teixeira de Freitas (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 063 Lauro de Freitas. O Kit Mapas abre (voo até Teixeira de Freitas e o que a prefeitura
// arrecadou em 2024: projetos/064.../mapas/teixeira.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada
// ano, a PILHA DO ANO em volta dele. Cidade grande (orçamento de R$ 0,5 a 0,7 bilhão): 1 MOEDA = R$ 1 MI e 1 PILHA = R$ 10 MI.
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando
// sempre no mesmo sentido. Achados no miolo: os EMPRÉSTIMOS, a PAVIMENTAÇÃO de 2026 e as PARCELAS das dívidas.
// Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE TEIXEIRA DE FREITAS, todos do TCM-BA (mais as leis
// 1.360 e 1.361/2025 da Câmara Municipal): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 173.88; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,112, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '064. orçamento de teixeira de freitas';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 666'),
  gastou24: quando('Gastou 641'),
  sobrou24: quando('Sobrou 25'),
  ano25: quando('2025 Arrecadou 706'),
  arrec25: quando('Arrecadou 706'),
  gastou25: quando('Gastou 687'),
  sobra25: quando('Sobra de quase 19'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 644'),
  emp99: quando('Desse total 99'),
  gastou26: quando('Gastou 534'),
  empenhou: quando('E ja empenhou'),
  maisque: quando('Mais do que entrou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara'),
  e24: quando('Em 2024 entraram 32'),
  abril: quando('Em abril de 2025'),
  caixa: quando('Ate 50 milhoes com a Caixa'),
  bb: quando('ate 50 milhoes com o Banco'),
  e26: quando('Em 2026 entraram 99'),
  banco: quando('As contas nao dizem'),
  pav: quando('A conta de pavimentacao'),
  sub92: quando('Subiu para 92'),
  gastou58: quando('gastou 58'),
  emp46: quando('Desse valor 46'),
  preco: quando('E a divida tem preco'),
  p24: quando('a prefeitura pagou quase 42'),
  p25: quando('Em 2025 48'),
  p26: quando('Em 2026 ate setembro 43'),
  cinco: quando('as parcelas foram mais de cinco'),
  tribunal: quando('No Tribunal de Contas a licitacao'),
  susp: quando('Em julho a relatora'),
  libera: quando('Em agosto liberou'),
  semjul: quando('As denuncias ainda'),
  emprest: quando('Emprestimo nao e crime'),
  mas: quando('Mas se as parcelas'),
  quanto: quando('quanto vai custar'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'estacao' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = []; // nenhum setor da fala ficou em zero

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.18 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number; rot?: string; soPlaca?: boolean};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean; rot?: string}};
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara", "Dívidas" e "Meio ambiente" se repetem
const lista = (tempos: number[], v: number[], rots: Record<string, string> = {}, so: string[] = []): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'esp', 'mam'].map((s, k) => ({s, t: tempos[k], v: v[k], rot: rots[s], soPlaca: so.includes(s)}));
const q = (...f: string[]) => f.map((x) => quando(x));
const ANOS: Ano[] = [
  // 2024: arrecadou 666,6 e gastou 641,1: o Balanço traz superávit de 25,5 mi
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 641.1, rotulo: '2024', falta: {t: T.sobrou24, v: 25.487, txt: 'SOBRA', sobra: true, rot: 'SOBRA: R$ 25,5 MI'},
    entradas: lista(q('Educacao 190', 'Saude 183', 'Administracao 52', 'Obras e servicos urbanos 113', 'Camara de Vereadores 19', 'Dividas e encargos 49', 'Cultura e festas 2', 'Assistencia social 9 milhoes e 900', 'Esporte 1 milhao e 400', 'Meio ambiente 2 milhoes e 900'),
      [190.536, 183.218, 52.167, 113.381, 19.876, 49.205, 2.079, 9.925, 1.441, 2.885])},
  // 2025: arrecadou 706,3 e gastou 687,3: o Balanço traz superávit de 18,98 mi
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 687.3, rotulo: '2025', falta: {t: T.sobra25, v: 18.98, txt: 'SOBRA', sobra: true, rot: 'SOBRA: QUASE R$ 19 MI'},
    entradas: lista(q('Educacao 226', 'Saude 159', 'Administracao 69', 'Obras e servicos urbanos 119', 'Camara 22', 'Dividas 56', 'Cultura e festas 3 milhoes e 300', 'Assistencia social 9 milhoes e 200', 'Esporte 1 milhao e 700', 'Meio ambiente 2 milhoes e 200'),
      [226.867, 159.518, 69.165, 119.627, 22.709, 56.365, 3.346, 9.226, 1.738, 2.244])},
  // 2026 (consolidado: Prefeitura + Câmara, liquidado até setembro): arrecadou 644,7, dos quais 99 de EMPRÉSTIMO (torre vermelha)
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 534.1, rotulo: '2026 · ATÉ SET', falta: {t: T.emp99, v: 99, txt: 'EMPRÉSTIMO', rot: 'R$ 99 MI DE EMPRÉSTIMO'},
    entradas: lista(
      [quando('Educacao 170'), quando('Saude 100'), quando('Administracao 60'), quando('Obras e servicos urbanos 108'), quando('Camara 19 milhoes e 300'), quando('Dividas 49 milhoes e 600'), quando('Cultura e festas 3 milhoes e 600'), quando('Assistencia social 6'), quando('Esporte 1 milhao e 500'), quando('Meio ambiente 2 milhoes e 200', 2)],
      [170.533, 100.131, 60.387, 108.222, 19.33, 49.564, 3.635, 6.812, 1.497, 2.195])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const entradaDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id);
const valorDe = (id: string, yi: number) => entradaDe(id, yi)?.v ?? 0;
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
const ESCALA = 10; // 1 moeda = R$ 1 mi; 1 pilha = R$ 10 milhões (cidade grande: orçamento de R$ 0,5 a 0,7 bilhão)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa de 52 a 71 pilhas) ----------
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
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + (e.soPlaca ? 0 : Math.ceil(e.v / ESCALA - 0.0005)), 0);
  y.entradas.forEach((e) => {
    const n = e.v / ESCALA;
    if (n < 0.003 || e.soPlaca) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.12, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo (torres de 2 x 2, 1 pilha = R$ 5 mi), da esquerda para a direita na ordem da fala ----------
const LADO_A = 2;
const ZA = 0.2;
const ESC_A = 5;
const CENTRO_A: V3 = [-0.9, 0, ZA];
// os empréstimos: 2024 (dourado) e 2026 (rosa); a placa das duas leis de abril/2025 na frente, só enquanto a voz fala delas
const EM = {e24: {p: [-2.0, 0, ZA] as V3, v: 32.5}, e26: {p: [0.2, 0, ZA] as V3, v: 99}};
const LEI_PLACA: V3 = [-0.9, 0, 2.3]; // na frente da gaveta; câmera baixa e de frente (regra do 062: RuaPlaca no miolo)
const LEI_VIS = (t: number) => vis(t, T.abril - 0.1, T.e26 - 0.25);
// a gaveta dos empréstimos afunda enquanto a placa das leis está na tela e volta no "Em 2026, entraram"
const EM_VIS = (t: number) => vis(t, T.repara - 0.1, T.pav - 0.25) * (1 - LEI_VIS(t));
// a pavimentação de 2026: previsto (fantasma, cresce de 40,1 para 92,1), gasto até setembro (rosa) e a parte de empréstimo (vermelho)
const PAV = {prev: {p: [-2.0, 0, ZA] as V3, ini: 40.109, fim: 92.087}, gasto: {p: [-0.9, 0, ZA] as V3, v: 58.277}, emp: {p: [0.2, 0, ZA] as V3, v: 46.208}};
const PAV_VIS = (t: number) => vis(t, T.pav - 0.1, T.preco - 0.25);
// as parcelas: 2024, 2025, 2026 até set. e, ao lado do 2025, a assistência social de 2025; na pergunta, o empréstimo de 2026
const PAR = {p24: {p: [-2.3, 0, ZA] as V3, v: 41.965}, p25: {p: [-1.3, 0, ZA] as V3, v: 48.463}, p26: {p: [-0.3, 0, ZA] as V3, v: 43.485}, ass: {p: [0.75, 0, ZA] as V3, v: 9.226}, nova: {p: [0.75, 0, ZA] as V3, v: 99}};
const PAR_CENTRO: V3 = [-0.8, 0, ZA];
const PAR_VIS = (t: number) => vis(t, T.preco - 0.1, T.tribunal - 0.25) + vis(t, T.emprest - 0.45, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.6];
// ★ melhoria (atenção): a pasta da licitação da limpeza urbana ao lado do Tribunal, com o carimbo que muda com a fala
const PASTA_POS: V3 = [2.4, 0, -1.3];

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
    // na frente do cofre: torres-fantasma do que sobrou (2024, 2025) e a torre vermelha do empréstimo de 2026
    ANOS.forEach((y) => {
      if (y.falta.v <= 0) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.emprest - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const em = EM_VIS(t);
  if (em > 0.01) {
    const k24 = rampa(t, T.e24 + 0.3, T.e24 + 1.2) * em;
    if (k24 > 0.01) solidas.push(...torre(EM.e24.p, (EM.e24.v / ESC_A) * k24, LADO_A, CA[0]));
    const k26 = rampa(t, T.e26 + 0.3, T.e26 + 1.4) * em;
    if (k26 > 0.01) solidas.push(...torre(EM.e26.p, (EM.e26.v / ESC_A) * k26, LADO_A, CA[2]));
  }
  const pv = PAV_VIS(t);
  if (pv > 0.01) {
    const kp = rampa(t, T.pav + 0.6, T.pav + 1.5) * pv;
    const vPrev = PAV.prev.ini + (PAV.prev.fim - PAV.prev.ini) * rampa(t, T.sub92 + 0.1, T.sub92 + 1.3);
    if (kp > 0.01) fantasmas.push(...torre(PAV.prev.p, (vPrev / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const kg = rampa(t, T.gastou58 + 0.2, T.gastou58 + 1.1) * pv;
    if (kg > 0.01) solidas.push(...torre(PAV.gasto.p, (PAV.gasto.v / ESC_A) * kg, LADO_A, CA[2]));
    const ke = rampa(t, T.emp46 + 0.3, T.emp46 + 1.2) * pv;
    if (ke > 0.01) solidas.push(...torre(PAV.emp.p, (PAV.emp.v / ESC_A) * ke, LADO_A, C.alerta));
  }
  const px = PAR_VIS(t);
  if (px > 0.01) {
    const k24 = cresce(T.p24 + 0.4) * px;
    if (k24 > 0.01) solidas.push(...torre(PAR.p24.p, (PAR.p24.v / ESC_A) * k24, LADO_A, CA[0]));
    const k25 = cresce(T.p25 + 0.3) * px;
    if (k25 > 0.01) solidas.push(...torre(PAR.p25.p, (PAR.p25.v / ESC_A) * k25, LADO_A, CA[1]));
    const k26 = cresce(T.p26 + 0.5) * px;
    if (k26 > 0.01) solidas.push(...torre(PAR.p26.p, (PAR.p26.v / ESC_A) * k26, LADO_A, CA[2]));
    if (!final) {
      const ka = rampa(t, T.cinco + 0.6, T.cinco + 1.3) * px;
      if (ka > 0.01) solidas.push(...torre(PAR.ass.p, Math.max(0.3, PAR.ass.v / ESC_A) * ka, LADO_A, tema.objetoClaro));
    } else {
      // a pergunta: a dívida nova (o empréstimo de 2026) em fantasma ao lado das parcelas
      const kn = rampa(t, T.quanto, T.quanto + 1.1) * px;
      if (kn > 0.01) fantasmas.push(...torre(PAR.nova.p, (PAR.nova.v / ESC_A) * kn, LADO_A, C.alerta));
    }
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.6], 0.2],
  [[-3.3, 0, 8.0], -0.4],
];
const ARVORES: V3[] = [
  [-1.4, 0, 8.4],
  [2.2, 0, 8.5],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const aceso = Math.max(0, ...ditas);
  const zerado = ZERADOS.includes(s.id);
  const e = 0.47;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
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
    case 'estacao':
      return <EstacaoSaneamento {...props} />;
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const em = EM_VIS(t);
  const pv = PAV_VIS(t);
  const px = PAR_VIS(t);
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
      <PilhasDinheiro pilhas={torres} max={3000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* os achados: a gaveta dos empréstimos (com a placa das leis), a da pavimentação e a das parcelas */}
      {em > 0.01 ? <BaseGaveta tema={tema} pos={CENTRO_A} sobe={em} larg={4.2} texto="EMPRÉSTIMOS" aceso={janela(t, T.repara, T.pav, 0.4)} /> : null}
      {LEI_VIS(t) > 0.01 ? <RuaPlaca tema={tema} pos={LEI_PLACA} escala={0.9} sobe={LEI_VIS(t)} linhas={['ABRIL/2025 · LEIS 1.360 E 1.361', 'ATÉ R$ 50 MI · CAIXA', 'ATÉ R$ 50 MI · BANCO DO BRASIL']} aceso={janela(t, T.abril, T.e26, 0.4)} /> : null}
      {pv > 0.01 ? <BaseGaveta tema={tema} pos={CENTRO_A} sobe={pv} larg={4.2} texto="PAVIMENTAÇÃO 2026" aceso={janela(t, T.pav, T.preco, 0.4)} /> : null}
      {px > 0.01 ? <BaseGaveta tema={tema} pos={PAR_CENTRO} sobe={px} larg={4.6} texto="PARCELAS DE DÍVIDAS" aceso={Math.max(janela(t, T.preco, T.tribunal, 0.4), janela(t, T.mas, FIM, 0.4))} /> : null}

      {/* o Tribunal e a pasta da licitação da limpeza urbana (carimbo: suspensa → liberada → em análise) */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={vis(t, T.tribunal - 0.2, T.emprest - 0.1)} aceso={janela(t, T.tribunal, T.emprest, 0.5)} />
      <PastaProcesso
        tema={tema}
        pos={PASTA_POS}
        rotY={-0.25}
        escala={0.8}
        sobe={vis(t, T.tribunal + 0.3, T.emprest - 0.1)}
        titulo="LIMPEZA URBANA 2026"
        valor="5 DENÚNCIAS"
        carimbo={t < T.libera ? rampa(t, T.susp + 0.2, T.susp + 0.6) : t < T.semjul ? rampa(t, T.libera + 0.2, T.libera + 0.6) : rampa(t, T.semjul + 0.2, T.semjul + 0.6)}
        textoCarimbo={t < T.libera ? 'SUSPENSA' : t < T.semjul ? 'LIBERADA' : 'EM ANÁLISE'}
        corCarimbo={t < T.libera ? coresOI(tema).alerta : t < T.semjul ? tema.acento : coresOI(tema).ouro}
        aceso={janela(t, T.tribunal, T.emprest, 0.5)}
      />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.6, 7.6, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(Math.max(0, Math.min(SETORES.length - 1, i)));
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
// achados: câmera alta (dir y 2,1), para o fundo ser a mesa e nada ficar atrás do cabeçalho
const PB = (c: V3, larg: number, h: number, dx = 0, el = 1.1): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, el, 1]);
const PM = (c: V3, larg: number, h: number, dx = 0): Cam => PB(c, larg, h, dx, 2.1);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre-fantasma da sobra; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobrou24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre-fantasma do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: a torre vermelha do empréstimo na frente do cofre; o cofre ganha a pilha rosa
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.emp99 + 0.3, COFRE(0.05)], [T.gastou26 + 0.3, COFRE(0.06)], [T.folha + 0.5, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // os empréstimos: 2024, a placa das duas leis, 2026
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, DE_CIMA(0.1)],
      [T.e24 - 0.2, PM(CENTRO_A, 6.4, 3.2, -0.04)],
      [T.e24 + 1.6, PM(soma(EM.e24.p, [0.3, 0, 0]), 4.6, 3.0, -0.03)],
      [T.abril - 0.1, E(soma(LEI_PLACA, [0, 1.1, -0.6]), 3.1, 2.8, [-0.04, 0.8, 1])],
      [T.e26 - 0.4, E(soma(LEI_PLACA, [0.04, 1.1, -0.6]), 2.9, 2.6, [0.04, 0.8, 1])],
      [T.e26 + 0.2, PM(soma(EM.e26.p, [-0.3, 0, 0]), 5.2, 5.2, 0)],
      [T.pav - 0.3, PM(CENTRO_A, 6.6, 5.2, 0.03)],
    ],
  },
  // a pavimentação: o previsto que cresce, o gasto e a parte de empréstimo
  {
    ini: T.pav - 0.1,
    arco: 0.03,
    chaves: [
      [T.pav - 0.1, PM(CENTRO_A, 6.6, 4.2, -0.03)],
      [T.sub92 - 0.2, PM(soma(PAV.prev.p, [0.4, 0, 0]), 5.2, 5.0, -0.02)],
      [T.gastou58 - 0.1, PM(soma(PAV.gasto.p, [-0.1, 0, 0]), 5.4, 5.2, 0)],
      [T.emp46 + 0.2, PM(soma(PAV.gasto.p, [0.5, 0, 0]), 5.2, 4.6, 0.02)],
      [T.preco - 0.3, PM(CENTRO_A, 6.6, 5.2, 0.03)],
    ],
  },
  // as parcelas: 2024, 2025, 2026 e a assistência social ao lado
  {
    ini: T.preco - 0.1,
    arco: 0.03,
    chaves: [
      [T.preco - 0.1, PM(PAR_CENTRO, 7.0, 3.6, -0.03)],
      [T.p24 + 0.2, PM(soma(PAR.p24.p, [0.5, 0, 0]), 4.8, 3.4, -0.02)],
      [T.p26 - 0.2, PM(soma(PAR.p25.p, [0.5, 0, 0]), 5.0, 3.6, 0)],
      [T.cinco + 0.2, PM(soma(PAR.p25.p, [1.0, 0, 0]), 5.0, 3.6, 0.02)],
      [T.tribunal - 0.3, PM(soma(PAR.p25.p, [1.0, 0, 0]), 5.2, 3.6, 0.03)],
    ],
  },
  // o Tribunal
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E(soma(TCM_POS, [0.6, 1.0, 0.4]), 6.4, 5.4, [-0.05, 1.2, 1])],
      [T.susp - 0.2, E(soma(PASTA_POS, [0, 0.85, 0]), 3.0, 2.8, [0, 1.0, 1])],
      [T.emprest - 0.3, E(soma(PASTA_POS, [0, 0.85, 0]), 2.9, 2.7, [0.05, 1.0, 1])],
    ],
  },
  // a pergunta: a mesa, a gaveta das parcelas com a dívida nova ao lado e de novo a mesa inteira
  {
    ini: T.emprest - 0.1,
    arco: 0.04,
    chaves: [
      [T.emprest - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PM(soma(PAR_CENTRO, [0.3, 0, 0]), 5.8, 4.4, -0.02)],
      [T.quanto + 0.3, PM(soma(PAR_CENTRO, [0.5, 0, 0]), 5.4, 4.4, 0)],
      [T.segue - 0.1, PM(soma(PAR_CENTRO, [0.5, 0, 0]), 5.6, 4.4, 0.02)],
      [T.segue + 0.9, E([0, 1.0, ZA], 11.0, 7.6, [-0.1, 1.4, 1])],
      [FIM, E([0, 0, 0.4], 13.5, 9.6, [-0.3, 1.3, 1])],
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
const ESTADOS: [number, string][] = [
  [0, 'TEIXEIRA DE FREITAS'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'OS EMPRÉSTIMOS'],
  [T.pav, 'A PAVIMENTAÇÃO'],
  [T.preco, 'AS PARCELAS DAS DÍVIDAS'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.emprest, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobrou24, texto: 'GASTOU EM 2024: R$ 641,1 MI'},
    {a: T.sobrou24, b: Y0.entradas[0].t, texto: 'O BALANÇO FECHA COM SOBRA: R$ 25,5 MI', destaque: true},
    {a: T.ano25, b: T.arrec25 + 0.3, texto: '2025'},
    {a: T.arrec25 + 0.3, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 706,3 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 687,3 MI'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRA: QUASE R$ 19 MI (R$ 18,98 MI)', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.emp99, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 644,7 MI'},
    {a: T.emp99, b: T.gastou26, texto: 'DESSE TOTAL, R$ 99 MI SÃO EMPRÉSTIMO', destaque: true},
    {a: T.gastou26, b: T.empenhou, texto: 'GASTOU ATÉ SETEMBRO: R$ 534,1 MI'},
    {a: T.empenhou, b: T.maisque, texto: 'EMPENHOU (RESERVOU PARA PAGAR): R$ 690,4 MI'},
    {a: T.maisque, b: T.folha, texto: 'MAIS DO QUE ENTROU (R$ 644,7 MI)', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.e24, texto: 'AGORA REPARA NOS EMPRÉSTIMOS'},
    {a: T.e24, b: T.abril, texto: 'EMPRÉSTIMOS QUE ENTRARAM EM 2024: R$ 32,5 MI'},
    {a: T.abril, b: T.caixa, texto: 'ABRIL/2025: A CÂMARA AUTORIZOU MAIS DOIS'},
    {a: T.caixa, b: T.e26, texto: 'ATÉ R$ 50 MI (CAIXA) + ATÉ R$ 50 MI (BB)'},
    {a: T.e26, b: T.banco, texto: 'ENTRARAM EM 2026, ATÉ SETEMBRO: R$ 99 MI', destaque: true},
    {a: T.banco, b: T.pav, texto: 'AS CONTAS NÃO DIZEM DE QUAL BANCO'},
    {a: T.pav, b: T.sub92, texto: 'PAVIMENTAÇÃO 2026 · PREVISTO NO COMEÇO: R$ 40,1 MI'},
    {a: T.sub92, b: T.gastou58, texto: 'O PREVISTO SUBIU PARA R$ 92,1 MI', destaque: true},
    {a: T.gastou58, b: T.emp46, texto: 'GASTO ATÉ SETEMBRO: R$ 58,3 MI'},
    {a: T.emp46, b: T.preco, texto: 'R$ 46,2 MI COM DINHEIRO DE EMPRÉSTIMO', destaque: true},
    {a: T.preco, b: T.p24, texto: 'E A DÍVIDA TEM PREÇO'},
    {a: T.p24, b: T.p25, texto: 'PARCELAS PAGAS EM 2024: QUASE R$ 42 MI'},
    {a: T.p25, b: T.p26, texto: 'PARCELAS PAGAS EM 2025: R$ 48,5 MI'},
    {a: T.p26, b: T.cinco, texto: '2026, ATÉ SETEMBRO: R$ 43,5 MI'},
    {a: T.cinco, b: T.tribunal, texto: '2025: MAIS DE 5 VEZES A ASSISTÊNCIA SOCIAL (R$ 9,2 MI)', destaque: true},
    {a: T.tribunal, b: T.susp, texto: 'LICITAÇÃO DA LIMPEZA URBANA 2026: 5 DENÚNCIAS'},
    {a: T.susp, b: T.libera, texto: '30/07/2026: RELATORA SUSPENDE A LICITAÇÃO'},
    {a: T.libera, b: T.semjul, texto: '10/08/2026: SUSPENSÃO REVOGADA (CONTRATO ATUAL ACABAVA)'},
    {a: T.semjul, b: T.emprest, texto: 'DENÚNCIAS AINDA SEM JULGAMENTO'},
    {a: T.emprest, b: T.mas, texto: 'EMPRÉSTIMO NÃO É CRIME'},
    {a: T.mas, b: T.quanto, texto: 'PARCELAS: MAIS DE R$ 40 MI POR ANO'},
    {a: T.quanto, b: T.segue, texto: 'QUANTO VAI CUSTAR A DÍVIDA NOVA?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.abril, texto: 'FONTE: BALANÇO E ANEXO 10 DE 2024 · TCM-BA'},
  {a: T.abril, b: T.e26, texto: 'FONTE: LEIS MUNICIPAIS 1.360 E 1.361, DE 11/04/2025'},
  {a: T.e26, b: T.pav, texto: 'FONTE: SIGA SET/2026 · RECEITA CONSOLIDADA · TCM-BA'},
  {a: T.pav, b: T.preco, texto: 'FONTE: SIGA SET/2026 · AÇÃO DE PAVIMENTAÇÃO · TCM-BA'},
  {a: T.preco, b: T.tribunal, texto: 'FONTE: BALANÇOS 2024 E 2025 E SIGA SET/2026 · TCM-BA'},
  {a: T.tribunal, b: T.emprest, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      const i = idx(e.s);
      const proxT = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      const b = ei + 1 < y.entradas.length ? Math.max(proxT + 0.45, e.t + 1.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtE(entradaDe(e.s, k)), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const f = y.falta;
    if (f.v > 0) r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.35, v / ESC_A), LADO_A) + 0.3, 0]);
  // os empréstimos
  const fimEm = T.pav - 0.05;
  // a plaquinha de 2024 sai enquanto a câmera olha a placa das leis (senão fica em cima dela) e volta com a de 2026
  r.push({a: T.e24 + 1.1, b: T.abril - 0.05, p: topo(EM.e24.p, EM.e24.v), valor: 'R$ 32,5 MI', sub: 'EMPRÉSTIMOS · 2024', cor: CA[0]});
  r.push({a: T.e26 + 1.0, b: fimEm, p: topo(EM.e24.p, EM.e24.v), valor: 'R$ 32,5 MI', sub: 'EMPRÉSTIMOS · 2024', cor: CA[0]});
  r.push({a: T.e26 + 1.2, b: fimEm, p: topo(EM.e26.p, EM.e26.v), valor: 'R$ 99 MI', sub: 'EMPRÉSTIMOS · 2026 ATÉ SET', cor: CA[2]});
  // a pavimentação
  const fimPav = T.preco - 0.05;
  r.push({a: T.pav + 1.4, b: T.sub92 + 0.2, p: topo(PAV.prev.p, PAV.prev.ini), valor: 'R$ 40,1 MI', sub: 'PREVISTO NO COMEÇO'});
  r.push({a: T.sub92 + 1.1, b: fimPav, p: topo(PAV.prev.p, PAV.prev.fim), valor: 'R$ 92,1 MI', sub: 'PREVISTO DEPOIS'});
  r.push({a: T.gastou58 + 0.9, b: fimPav, p: topo(PAV.gasto.p, PAV.gasto.v), valor: 'R$ 58,3 MI', sub: 'GASTO ATÉ SET/2026', cor: CA[2]});
  r.push({a: T.emp46 + 1.0, b: fimPav, p: topo(PAV.emp.p, PAV.emp.v), valor: 'R$ 46,2 MI', sub: 'DE EMPRÉSTIMO', cor: C.alerta});
  // as parcelas
  const fimPar = T.tribunal - 0.05;
  // no "cinco vezes" ficam só 2025 e a assistência social (a fala compara os dois)
  r.push({a: T.p24 + 1.1, b: T.cinco + 0.1, p: topo(PAR.p24.p, PAR.p24.v), valor: 'R$ 41,97 MI', sub: 'PARCELAS · 2024', cor: CA[0]});
  r.push({a: T.p25 + 0.9, b: fimPar, p: topo(PAR.p25.p, PAR.p25.v), valor: 'R$ 48,5 MI', sub: 'PARCELAS · 2025', cor: CA[1]});
  r.push({a: T.p26 + 1.1, b: T.cinco + 0.1, p: topo(PAR.p26.p, PAR.p26.v), valor: 'R$ 43,5 MI', sub: 'PARCELAS · 2026 ATÉ SET', cor: CA[2]});
  r.push({a: T.cinco + 1.1, b: fimPar, p: topo(PAR.ass.p, PAR.ass.v), valor: 'R$ 9,2 MI', sub: 'ASSISTÊNCIA SOCIAL 2025'});
  // a pergunta
  r.push(
    {a: T.mas + 0.6, b: T.segue + 0.8, p: topo(PAR.p25.p, PAR.p25.v), valor: 'R$ 48,5 MI', sub: 'PARCELAS · 2025', cor: CA[1]},
    {a: T.quanto + 1.0, b: T.segue + 0.8, p: topo(PAR.nova.p, PAR.nova.v), valor: 'R$ 99 MI', sub: 'EMPRÉSTIMO DE 2026', cor: C.alerta},
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
const qd = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: qd(T.gastou24) + 6};
const G1 = quando('recebeu 99');
const G2 = quando('E todo ano paga');
const G_FIM = quando('Eu abri');

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const miolo = vis(t, T.repara + 0.2, T.tribunal - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 5 MI' : '1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, miolo);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
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
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    // ★ melhoria (gancho visual): enquanto a voz diz "recebeu 99 milhões de empréstimo em 2026. E todo ano paga mais de 40
    // milhões em parcelas", os dois números entram no mapa como chips, um embaixo do outro
    const kg = Math.min(entra(t, G1, 0.4), 1 - rampa(t, G_FIM - 0.1, G_FIM + 0.3));
    const kg2 = entra(t, G2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="2026: R$ 99 MI DE EMPRÉSTIMO" k={entra(t, G1, 0.45)} destaque tam={32} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="PARCELAS DE DÍVIDAS: MAIS DE R$ 40 MI POR ANO" k={kg2} tam={24} /> : null}
          </div>
        ) : null}
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
          <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 ENVIADO AO TCM-BA</div>
        </div>
      </>
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
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 86 : 60));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-90, 90, -180, 180, -270, 270, 360].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
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
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? (v.r.valor.length > 22 ? 22 : 30) : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/teixeira.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobrou24, T.sobra25, T.emp99, T.maisque, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 100).map((e) => e.t)), T.e26, T.sub92, T.emp46, T.p25, T.cinco, T.quanto];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => (y.falta.v > 0 ? s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}) : null));
  [T.e24, T.abril, T.pav, T.gastou58, T.p24, T.p25, T.p26, T.tribunal, T.susp, T.libera].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.maisque, T.cinco].forEach((t) => s.push({t: t + 0.3, f: 'baque', v: 0.15}));
  // ★ melhoria (atenção): baque leve no gancho do empréstimo; subida no previsto que cresce; impacto nos 99 mi e na parte de empréstimo
  s.push({t: G1 + 0.6, f: 'baque', v: 0.15}, {t: T.sub92 + 0.2, f: 'subida', v: 0.15}, {t: T.e26 + 0.4, f: 'impacto', v: 0.15}, {t: T.emp46 + 0.3, f: 'impacto', v: 0.14});
  s.push({t: T.quanto + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.5, 1.5, 2.6, 3.6, 4.8, 7.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.sobrou24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.emp99 + 1.0, T.gastou26 + 0.9, T.empenhou + 1.2, T.maisque + 0.6, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.e24 + 1.4, T.abril + 0.9, T.caixa + 1.0, T.e26 + 1.5, T.banco + 0.9, T.pav + 1.6, T.sub92 + 1.4, T.gastou58 + 1.1, T.emp46 + 1.3,
  T.preco + 0.6, T.p24 + 1.3, T.p25 + 1.1, T.p26 + 1.3, T.cinco + 1.4, T.tribunal + 0.8, T.susp + 0.6, T.libera + 0.8, T.semjul + 0.8,
  T.emprest + 0.5, T.mas + 1.0, T.quanto + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoTeixeira: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="TEIXEIRA DE FREITAS" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {/* selo do @eumagnoleite na abertura (arte aprovada, opção B; regra 15c) */}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 99 mi', 'emprestados.', 'Quanto vai', 'custar?'];
export const CapaOrcamentoTeixeira: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · TEIXEIRA DE FREITAS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: Math.max(...linhas.map((x) => x.length)) > 14 ? 108 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
