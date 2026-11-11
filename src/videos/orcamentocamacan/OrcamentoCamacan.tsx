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
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {Onibus} from '../../pecas/escala6x1c';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 042. orçamento de Camacan (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 043 Ibicaraí. O Kit Mapas abre (voo até Camacan e o que a prefeitura arrecadou
// em 2024: projetos/042.../mapas/camacan.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz fala um setor, as pilhas saem dali e voam para a
// casinha do setor, na ORDEM DA FALA, com a câmera andando sempre no mesmo sentido. Sem porcentagem, sem nome de gestor
// e sem nome de empresa. SÓ DADOS DE CAMACAN, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 175.07; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,1297, -15 LUFS (v3: gastou = LIQUIDADO, regra 32)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '042. orçamento de camacan';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 119'),
  gastou24: quando('Gastou 124'),
  mais24: quando('Gastou 5 milhoes'),
  zero24: quando('Protecao animal'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 132'),
  gastou25: quando('Gastou 128 e 800'), // o gancho diz "gastou 128 milhões e 800 mil"
  mais25: quando('3 milhoes e 200 a menos'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 107'),
  gastou26: quando('Ja gastou 98'),
  comprometeu: quando('se comprometeu'),
  repara: quando('Agora repara'),
  festas: quando('vai para festas'),
  f24: quando('as festas levaram'),
  a24: quando('A assistencia social que ajuda'),
  em25: quando('Em 2025 empate'),
  empate: quando('empate 3'),
  rural: quando('Na zona rural'),
  e24: quando('usou quase 1'),
  em25e: quando('Em 2025 tiraram'),
  tiraram: quando('tiraram mais de 900'),
  e183: quando('ela usou 183'),
  transp: quando('o setor de transportes'),
  ganhou: quando('ganhou 2 milhoes'),
  naoDizem: quando('As contas nao dizem'),
  agri: quando('E a agricultura familiar'),
  r727: quando('tinha 727'),
  tudo: quando('Tiraram tudo'),
  feira: quando('A feira livre'),
  zeroF: quando('Zero O mercado'),
  mercado: quando('O mercado municipal'),
  tribunal: quando('No Tribunal de Contas'),
  eventos: quando('Um e sobre o contrato'),
  rocad: quando('Uma compra de rocadeiras'),
  suspensa: quando('foi suspensa'),
  outros: quando('Os outros falam'),
  transpar: quando('falam de transparencia'),
  acumulo: quando('acumulo de cargos'),
  contratos: quando('contratos de 2025'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se em 2024'),
  agri2: quando('e a agricultura familiar ficou'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 14 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | 'transporte' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS, LIMPEZA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'tra', nome: 'TRANSPORTES', tipo: 'transporte', texto: 'TRANSPORTES'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['ani'];
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.13 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões, como a voz diz; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean}};
const lista = (n: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras limpeza'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia social'],
    ['tra', 'Transportes'],
    ['agu', 'Agua e saneamento'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
    ['mam', 'Meio ambiente'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.zero24, gastou: T.gastou24, total: 124.4, rotulo: '2024', falta: {t: T.mais24, v: 5.2722, txt: 'A MAIS'}, entradas: lista(1, [47.3, 28.2, 11.3, 12.4, 2.6, 6.2, 5.7, 3.6, 2.5, 1.0, 1.6, 1.4, 0.184])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 128.8, rotulo: '2025', falta: {t: T.mais25, v: 3.2499, txt: 'A MENOS', sobra: true}, entradas: lista(2, [51.1, 29.4, 13.0, 10.9, 4.3, 4.9, 3.5, 3.4, 4.1, 0.34, 1.9, 1.2, 0.35])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 98.3, rotulo: '2026 · ATÉ SET', falta: {t: T.comprometeu, v: 28.345, txt: 'COMPROMETIDOS A MAIS'}, entradas: lista(3, [38.9, 22.9, 9.2, 9.2, 3.4, 3.3, 2.1, 2.9, 3.5, 0.097, 1.3, 0.92, 0.29])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.zero24]));
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

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2025 usa cerca de 73 pilhas) ----------
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

// ---------- Os achados no miolo (aqui, 1 pilha = R$ 250 mil; torres de 3 x 3) ----------
// branco transparente = reservado no orçamento; cor do ano = usado (2024 dourado, 2025 verde)
const ESC_A = 0.25;
const LADO_A = 3;
const ZA = 0.2;
// esquerda: festas x assistência social (2024 e 2025)
const FX = {
  f24: {p: [-4.2, 0, ZA] as V3, v: 5.204},
  a24: {p: [-2.95, 0, ZA] as V3, v: 3.564},
  f25: {p: [-1.5, 0, ZA] as V3, v: 3.403},
  a25: {p: [-0.25, 0, ZA] as V3, v: 3.368},
};
// direita: zona rural (estradas vicinais e transportes)
const RU = {
  e24: {p: [0.55, 0, ZA] as V3, usou: 1.756},
  e25: {p: [1.65, 0, ZA] as V3, res: 1.217, usou: 0.183},
  tr25: {p: [3.0, 0, ZA] as V3, res: 1.534, usou: 3.644},
};
// direita, depois: agricultura familiar, feira livre e o mercado (obra do Estado)
const AG = {
  fam: {p: [0.6, 0, ZA] as V3, res: 0.727},
  feira: {p: [1.95, 0, ZA] as V3, res: 1.04},
  mercado: [3.3, 0, ZA - 0.05] as V3,
};
const FX_VIS = (t: number) => vis(t, T.repara + 0.1, T.rural - 0.35) + vis(t, T.gastar - 0.1, FIM + 2);
const RU_VIS = (t: number) => vis(t, T.rural - 0.3, T.agri - 0.1);
const AG_VIS = (t: number) => vis(t, T.agri + 0.25, T.tribunal - 0.3) + vis(t, T.gastar - 0.1, FIM + 2);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'EVENTOS · 2025/2026', valor: 'R$ 2,7 MI', t: T.eventos, carimbos: [[T.eventos + 1.3, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'ROÇADEIRAS · 2026', valor: 'DISPENSA', t: T.rocad, carimbos: [[T.suspensa + 0.1, 'SUSPENSA', 'alerta']]},
  {titulo: 'TRANSPARÊNCIA', valor: '2024', t: T.transpar, carimbos: [[T.transpar + 0.5, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'ACÚMULO DE CARGOS', valor: '2025', t: T.acumulo, carimbos: [[T.acumulo + 0.5, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'CONTRATOS', valor: '2025', t: T.contratos, carimbos: [[T.contratos + 0.5, 'SEM JULGAMENTO', 'neutro']]},
];
const posPasta = (i: number): V3 => [-3.6 + i * 1.8, 0, 1.3];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele.
  // As torres que já chegaram à borda ficam até o fim; só o que está no miolo some.
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
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // festas x assistência social
  const fx = FX_VIS(t);
  if (fx > 0.01) {
    const k1 = cresce(T.f24) * fx;
    if (k1 > 0.01) solidas.push(...torre(FX.f24.p, (FX.f24.v / ESC_A) * k1, LADO_A, CA[0]));
    const k2 = cresce(T.a24 + 2.5) * fx;
    if (k2 > 0.01) solidas.push(...torre(FX.a24.p, (FX.a24.v / ESC_A) * k2, LADO_A, CA[0]));
    const k3 = cresce(T.empate) * fx;
    if (k3 > 0.01) {
      solidas.push(...torre(FX.f25.p, (FX.f25.v / ESC_A) * k3, LADO_A, CA[1]));
      solidas.push(...torre(FX.a25.p, (FX.a25.v / ESC_A) * k3, LADO_A, CA[1]));
    }
  }
  // zona rural: estradas vicinais (2024 usado; 2025 reservado x usado) e transportes 2025
  const ru = RU_VIS(t);
  if (ru > 0.01) {
    const k1 = cresce(T.e24) * ru;
    if (k1 > 0.01) solidas.push(...torre(RU.e24.p, (RU.e24.usou / ESC_A) * k1, LADO_A, CA[0]));
    const k2 = cresce(T.em25e) * ru;
    if (k2 > 0.01) fantasmas.push(...torre(RU.e25.p, (RU.e25.res / ESC_A) * k2, LADO_A, tema.objetoClaro));
    const k3 = cresce(T.e183) * ru;
    if (k3 > 0.01) solidas.push(...torre(RU.e25.p, Math.max(0.4, RU.e25.usou / ESC_A) * k3, LADO_A, CA[1]));
    const k4 = cresce(T.transp) * ru;
    if (k4 > 0.01) fantasmas.push(...torre(RU.tr25.p, (RU.tr25.res / ESC_A) * k4, LADO_A, tema.objetoClaro));
    const k5 = cresce(T.ganhou, 1.3) * ru;
    if (k5 > 0.01) solidas.push(...torre(RU.tr25.p, (RU.tr25.usou / ESC_A) * k5, LADO_A, CA[1]));
  }
  // agricultura familiar e feira livre: só o reservado (branco); usado = zero
  const ag = AG_VIS(t);
  if (ag > 0.01) {
    const k1 = cresce(T.r727) * ag;
    if (k1 > 0.01) fantasmas.push(...torre(AG.fam.p, (AG.fam.res / ESC_A) * k1, LADO_A, tema.objetoClaro));
    const k2 = cresce(T.feira + 0.2) * ag;
    if (k2 > 0.01) fantasmas.push(...torre(AG.feira.p, (AG.feira.res / ESC_A) * k2, LADO_A, tema.objetoClaro));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.6, 0, 3.6],
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
    case 'agua':
      return <EstacaoSaneamento {...props} />;
    case 'transporte': {
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo="galpao" cinza={0} />
          {sobe > 0.3 ? <Onibus tema={tema} pos={soma(p, [tg[0] * -1.15 - Math.sin(ang(i)) * 0.5, 0.02, tg[2] * -1.15 - Math.cos(ang(i)) * 0.5])} rotY={rot + Math.PI / 2} escala={0.22 * Math.min(1, sobe)} farol={aceso} /> : null}
        </group>
      );
    }
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
  const fx = FX_VIS(t);
  const ru = RU_VIS(t);
  const ag = AG_VIS(t);
  const pk = PASTAS_VIS(t);
  const merc = ag * (t >= T.gastar - 0.1 ? 1 : rampa(t, T.mercado - 0.1, T.mercado + 0.6));
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

      {/* festas x assistência (esquerda); zona rural e depois agricultura familiar (direita) */}
      <BaseGaveta tema={tema} pos={[-2.22, 0, ZA]} sobe={fx} larg={4.7} texto="FESTAS x ASSISTÊNCIA" aceso={Math.max(janela(t, T.repara, T.rural, 0.4), janela(t, T.porque, T.agri2, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.8, 0, ZA]} sobe={ru} larg={3.9} texto="ZONA RURAL" aceso={janela(t, T.rural, T.agri, 0.4)} />
      <BaseGaveta tema={tema} pos={[2.0, 0, ZA]} sobe={ag} larg={4.1} texto="AGRICULTURA FAMILIAR · 2025" aceso={Math.max(janela(t, T.agri, T.tribunal, 0.4), janela(t, T.agri2, FIM + 1, 0.4))} />
      {ru > 0.05 ? <Onibus tema={tema} pos={soma(RU.tr25.p, [0.05, 0.12, 0.85])} rotY={0} escala={0.18 * Math.min(1, ru)} farol={janela(t, T.transp, T.agri, 0.4)} /> : null}
      {merc > 0.02 ? <PredioTexto tema={tema} pos={AG.mercado} rotY={0} escala={0.34} sobe={merc} aceso={janela(t, T.mercado, T.tribunal, 0.4)} texto="MERCADO" tipo="galpao" cinza={0} /> : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.eventos - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(2 - i) * 0.08}
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
const OLHA_SETOR = (i: number, perto = 1): Cam => {
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
    const pp = perto * alto * (idx(e.s) >= 10 ? 1.08 : 1);
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
  // 2024: o cofre com a pilha do ano e a torre vermelha; depois de casinha em casinha; no fim, a casinha cinza do zero
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.zero24 - 0.2)]},
  {ini: T.zero24 - 0.1, arco: 0.03, chaves: [[T.zero24 - 0.1, OLHA_SETOR(12.6, 1.05)], [T.zero24 + 0.9, OLHA_SETOR(12.9, 1.05)], [T.ano25 - 0.2, OLHA_SETOR(13, 1.1)]]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já foi comprometido além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.comprometeu + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // festas x assistência: da esquerda para a direita (2024, depois 2025)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.3, 0.9, ZA], 7.4, 6.6, [0, 1.9, 1])],
      [T.f24 - 0.2, PG(meio(FX.f24.p, FX.a24.p), 3.6, 1.3, -0.05)],
      [T.em25 - 0.3, PG(soma(meio(FX.f24.p, FX.a24.p), [0.3, 0, 0]), 3.6, 1.3, -0.04)],
      [T.empate + 0.1, PG(meio(FX.f25.p, FX.a25.p), 3.6, 1.2, 0)],
      [T.rural - 0.3, PG(soma(meio(FX.f25.p, FX.a25.p), [0.3, 0, 0]), 3.7, 1.2, 0)],
    ],
  },
  // zona rural: estradas 2024, estradas 2025, transportes 2025 (sempre para a direita)
  {
    ini: T.rural - 0.2,
    arco: 0.03,
    chaves: [
      [T.rural - 0.2, E([1.8, 0.9, ZA], 6.8, 6.2, [0, 1.9, 1])],
      [T.e24 - 0.2, PG(RU.e24.p, 3.4, 1.0, -0.04)],
      [T.em25e - 0.3, PG(soma(RU.e24.p, [0.4, 0, 0]), 3.4, 1.0, -0.03)],
      [T.em25e + 0.3, PG(RU.e25.p, 3.4, 1.0, 0)],
      [T.transp - 0.3, PG(soma(RU.e25.p, [0.3, 0, 0]), 3.5, 1.1, 0)],
      [T.transp + 0.4, PG(RU.tr25.p, 3.8, 1.5, 0.02)],
      [T.naoDizem, PG(soma(meio(RU.e25.p, RU.tr25.p), [0.1, 0, 0]), 4.6, 1.4, 0.03)],
      [T.agri - 0.2, PG(soma(meio(RU.e25.p, RU.tr25.p), [0.2, 0, 0]), 4.8, 1.4, 0.03)],
    ],
  },
  // agricultura familiar: a gaveta da direita troca; agricultura familiar, feira livre, mercado
  {
    ini: T.agri - 0.1,
    arco: 0.03,
    chaves: [
      [T.agri - 0.1, E([1.95, 0.9, ZA], 6.6, 6.0, [0.03, 1.9, 1])],
      [T.r727 - 0.2, PG(AG.fam.p, 3.4, 1.0, 0)],
      [T.feira - 0.3, PG(soma(AG.fam.p, [0.3, 0, 0]), 3.4, 1.0, 0)],
      [T.feira + 0.3, PG(AG.feira.p, 3.4, 1.0, 0.02)],
      [T.mercado - 0.2, PG(soma(AG.feira.p, [0.3, 0, 0]), 3.6, 1.0, 0.03)],
      [T.mercado + 0.5, PG(soma(AG.mercado, [-0.2, 0, 0]), 3.8, 1.0, 0.05)],
      [T.tribunal - 0.3, E([1.9, 0.9, ZA], 6.4, 6.0, [0.06, 1.9, 1])],
    ],
  },
  // tribunal: as cinco pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.eventos - 0.1, E(soma(posPasta(0), [0.2, 0.7, 0]), 4.0, 3.9, [-0.1, 1.5, 1])],
      [T.rocad - 0.3, E(soma(posPasta(0), [0.4, 0.7, 0]), 4.0, 3.9, [-0.08, 1.5, 1])],
      [T.rocad + 0.3, E(soma(posPasta(1), [0, 0.7, 0]), 4.0, 3.9, [-0.04, 1.5, 1])],
      [T.outros - 0.3, E(soma(posPasta(1), [0.2, 0.7, 0]), 4.0, 3.9, [0, 1.5, 1])],
      [T.transpar + 0.2, E(soma(posPasta(3), [0, 0.7, 0]), 5.4, 4.8, [0.04, 1.5, 1])],
      [T.gastar - 0.2, E(soma(posPasta(3), [0.2, 0.7, 0]), 5.6, 5.0, [0.08, 1.5, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois as festas (esquerda) e a agricultura familiar (direita)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, PG(meio(FX.f25.p, FX.a25.p), 4.2, 1.3, -0.05)],
      [T.agri2 - 0.5, PG(soma(meio(FX.f25.p, FX.a25.p), [0.4, 0, 0]), 4.4, 1.3, -0.02)],
      [T.agri2 + 0.2, PG(meio(AG.fam.p, AG.feira.p), 4.0, 1.1, 0)],
      [T.segue - 0.1, PG(soma(meio(AG.fam.p, AG.feira.p), [0.1, 0, 0]), 4.1, 1.1, 0)],
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
const ESTADOS: [number, string][] = [
  [0, 'CAMACAN'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: AS FESTAS'],
  [T.rural, 'NA ZONA RURAL'],
  [T.agri, 'AGRICULTURA FAMILIAR'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 124,4 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 5,3 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.zero24, b: T.ano25, texto: 'PROTEÇÃO ANIMAL: NEM UMA LINHA NAS CONTAS', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 132,1 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 128,8 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'R$ 3,2 MI A MENOS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 107 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 98,3 MI'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'COMPROMETIDO: R$ 135,3 MI · ARRECADADO: R$ 107 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.festas, texto: 'AGORA REPARA'},
    {a: T.festas, b: T.f24, texto: 'QUASE TODO O DINHEIRO DA CULTURA VAI PARA FESTAS'},
    {a: T.f24, b: T.a24, texto: 'FESTAS EM 2024: R$ 5,2 MI'},
    {a: T.a24, b: T.em25, texto: 'ASSISTÊNCIA SOCIAL EM 2024: R$ 3,6 MI'},
    {a: T.em25, b: T.rural, texto: '2025: EMPATE, R$ 3,4 MI PARA CADA UMA', destaque: true},
    {a: T.rural, b: T.e24, texto: 'ZONA RURAL: ESTRADAS VICINAIS'},
    {a: T.e24, b: T.em25e, texto: 'ESTRADAS EM 2024: R$ 1,8 MI USADOS'},
    {a: T.em25e, b: T.e183, texto: '2025: TIRARAM R$ 923 MIL DA AÇÃO'},
    {a: T.e183, b: T.transp, texto: 'USOU R$ 183 MIL EM 2025', destaque: true},
    {a: T.transp, b: T.naoDizem, texto: 'TRANSPORTES 2025: + R$ 2,4 MI EM COMBUSTÍVEL E SERVIÇOS'},
    {a: T.naoDizem, b: T.agri, texto: 'AS CONTAS NÃO DIZEM SE FOI PARA AS ESTRADAS'},
    {a: T.agri, b: T.r727, texto: 'E A AGRICULTURA FAMILIAR?'},
    {a: T.r727, b: T.tudo, texto: '2025: R$ 727 MIL RESERVADOS'},
    {a: T.tudo, b: T.feira, texto: 'TIRARAM TUDO: R$ 0 GASTO', destaque: true},
    {a: T.feira, b: T.zeroF, texto: 'FEIRA LIVRE 2025: R$ 1 MI RESERVADO'},
    {a: T.zeroF, b: T.mercado, texto: 'FEIRA LIVRE: R$ 0 GASTO', destaque: true},
    {a: T.mercado, b: T.tribunal, texto: 'MERCADO MUNICIPAL: OBRA DO GOVERNO DO ESTADO'},
    {a: T.tribunal, b: T.eventos, texto: 'TRIBUNAL DE CONTAS: 5 PROCESSOS SEM JULGAMENTO FINAL'},
    {a: T.eventos, b: T.rocad, texto: 'ESTRUTURA DE EVENTOS 2025/2026: R$ 2,7 MI'},
    {a: T.rocad, b: T.outros, texto: 'ROÇADEIRAS (2026): SUSPENSA PELO TRIBUNAL', destaque: true},
    {a: T.outros, b: T.gastar, texto: 'TRANSPARÊNCIA · ACÚMULO DE CARGOS · CONTRATOS DE 2025'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.agri2, texto: 'POR QUE A FESTA EMPATA COM A ASSISTÊNCIA...', destaque: true},
    {a: T.agri2, b: T.segue, texto: '...E O APOIO À AGRICULTURA FAMILIAR FICOU NO ZERO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE015 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE015 DEZ/2025 · DESPESA LIQUIDADA · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: SIGA SET/2026 · RECEITA ARRECADADA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · LIQUIDADO'},
  {a: T.repara, b: T.mercado, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2024 E DEZ/2025 · TCM-BA'},
  {a: T.mercado, b: T.tribunal, texto: 'FONTE: GOVERNO DA BAHIA (SDR/CAR), 27/06/2026'},
  {a: T.tribunal, b: T.eventos, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
  {a: T.eventos, b: T.rocad, texto: 'VALOR: PNCP, CONTRATO DE 04/08/2025'},
  {a: T.rocad, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
];
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
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  r.push({a: T.zero24 + 0.5, b: T.ano25 - 0.1, p: soma(noAnel(idx('ani'), R_PREDIO - 0.4), [0, 1.7, 0]), valor: 'NEM UMA LINHA NAS CONTAS', sub: 'PROTEÇÃO ANIMAL · 2024 A 2026'});
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(v / ESC_A, LADO_A) + 0.3, 0]);
  // festas x assistência
  const fimF = T.rural - 0.3;
  r.push(
    {a: T.f24 + 0.6, b: fimF, p: topo(FX.f24.p, FX.f24.v), valor: 'R$ 5,2 MI', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.a24 + 2.7, b: fimF, p: topo(FX.a24.p, FX.a24.v), valor: 'R$ 3,6 MI', sub: 'ASSISTÊNCIA · 2024', cor: CA[0]},
    {a: T.empate + 0.5, b: fimF, p: topo(FX.f25.p, FX.f25.v), valor: 'R$ 3,4 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.empate + 0.8, b: fimF, p: topo(FX.a25.p, FX.a25.v), valor: 'R$ 3,4 MI', sub: 'ASSISTÊNCIA · 2025', cor: CA[1]},
  );
  // zona rural
  const fimR = T.agri - 0.2;
  r.push(
    {a: T.e24 + 0.7, b: fimR, p: topo(RU.e24.p, RU.e24.usou), valor: 'R$ 1,8 MI', sub: 'ESTRADAS · 2024', cor: CA[0]},
    {a: T.em25e + 0.6, b: T.e183 + 0.2, p: topo(RU.e25.p, RU.e25.res), valor: 'R$ 1,2 MI', sub: 'ESTRADAS 2025 · RESERVADO'},
    {a: T.tiraram + 0.5, b: fimR, p: topo(RU.e25.p, RU.e25.res), valor: 'R$ 923 MIL TIRADOS', sub: 'ESTRADAS · 2025'},
    {a: T.e183 + 0.5, b: fimR, p: soma(RU.e25.p, [0, 0.55, 0.6]), valor: 'R$ 183 MIL', sub: 'ESTRADAS 2025 · USADO', cor: CA[1]},
    {a: T.transp + 0.6, b: T.ganhou + 0.3, p: topo(RU.tr25.p, RU.tr25.res), valor: 'R$ 1,5 MI', sub: 'TRANSPORTES · RESERVADO'},
    {a: T.ganhou + 0.9, b: fimR, p: topo(RU.tr25.p, RU.tr25.usou), valor: '+ R$ 2,4 MI', sub: 'TRANSPORTES 2025 · R$ 3,9 MI', cor: CA[1]},
  );
  // agricultura familiar
  const fimA = T.tribunal - 0.3;
  r.push(
    {a: T.r727 + 0.6, b: T.tudo + 0.3, p: topo(AG.fam.p, AG.fam.res), valor: 'R$ 727 MIL', sub: 'AGRICULTURA FAMILIAR · RESERVADO'},
    {a: T.tudo + 0.3, b: T.mercado + 0.3, p: topo(AG.fam.p, AG.fam.res), valor: 'R$ 727 MIL → R$ 0', sub: 'AGRICULTURA FAMILIAR · USADO', cor: C.alerta},
    {a: T.feira + 0.7, b: T.zeroF + 0.2, p: topo(AG.feira.p, AG.feira.res), valor: 'R$ 1 MI', sub: 'FEIRA LIVRE · RESERVADO'},
    {a: T.zeroF + 0.2, b: T.mercado + 0.3, p: topo(AG.feira.p, AG.feira.res), valor: 'R$ 1 MI → R$ 0', sub: 'FEIRA LIVRE · USADO', cor: C.alerta},
    {a: T.mercado + 0.7, b: fimA, p: soma(AG.mercado, [0, 1.25, 0]), valor: 'OBRA DO ESTADO', sub: 'MERCADO MUNICIPAL · 2026', cor: tema.acento},
  );
  // a pergunta
  r.push(
    {a: T.porque + 0.3, b: T.agri2 + 0.2, p: soma(meio(FX.f25.p, FX.a25.p), [0, altTorre(FX.f25.v / ESC_A, LADO_A) + 0.4, 0]), valor: 'R$ 3,4 MI x R$ 3,4 MI', sub: 'FESTAS x ASSISTÊNCIA · 2025', cor: CA[1]},
    {a: T.agri2 + 0.3, b: FIM + 1, p: topo(AG.fam.p, AG.fam.res), valor: 'R$ 0 DE R$ 727 MIL', sub: 'AGRICULTURA FAMILIAR · 2025', cor: tema.acento},
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
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 250 MIL · BRANCO = RESERVADO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
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
  // v3 (liquidado): a abertura nova é ~0,4 s mais longa que a da voz em que o mapa foi gerado; cada trecho do mapa
  // anda num ritmo próprio para os textos do mapa caírem na palavra nova (tempo novo → tempo do mapa).
  const PONTOS: [number, number][] = [[0, 0], [3.68, 3.24], [5.18, 4.82], [8.24, 7.84], [9.78, 9.64], [10.12, 10.06], [11.78, 11.72], [30, 29.94]];
  return (
    <AbsoluteFill style={{opacity: op}}>
      {PONTOS.slice(0, -1).map(([n0, v0], k) => {
        const [n1, v1] = PONTOS[k + 1];
        const a = Math.round(n0 * FPS);
        const b = Math.round(n1 * FPS);
        if (a >= dur) return null;
        return (
          <Sequence key={k} from={a} durationInFrames={Math.min(b, dur) - a} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(`${P}/mapas/camacan.mp4`)} startFrom={de + Math.round(v0 * FPS)} playbackRate={(v1 - v0) / (n1 - n0)} muted style={{width: W, height: H}} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 10).map((e) => e.t)), T.empate, T.e183, T.ganhou, T.tudo, T.zeroF];
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
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: 'baque', v: 0.2}));
  s.push({t: T.zero24 + 0.9, f: 'baque', v: 0.2});
  [T.f24, T.a24, T.e24, T.em25e, T.transp, T.r727, T.feira, T.mercado].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.e183, T.tudo, T.zeroF].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.empate, T.ganhou].forEach((t) => s.push({t: t + 0.1, f: 'subida', v: 0.18}));
  s.push({t: T.naoDizem + 0.1, f: 'tique', v: 0.14});
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.agri2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.zero24 + 1.2,
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 0.9, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[8].t + 0.9, Y1.entradas[12].t + 0.9,
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, Y2.entradas[0].t + 0.9, Y2.entradas[5].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[12].t + 0.8,
  T.repara + 0.6, T.festas + 0.8, T.f24 + 1.0, T.a24 + 2.8, T.empate + 1.3,
  T.rural + 0.6, T.e24 + 1.0, T.em25e + 0.9, T.tiraram + 0.9, T.e183 + 0.9, T.transp + 1.0, T.ganhou + 1.4, T.naoDizem + 0.8,
  T.agri + 0.6, T.r727 + 1.0, T.tudo + 0.6, T.feira + 1.0, T.zeroF + 0.4, T.mercado + 1.2,
  T.tribunal + 0.4, T.eventos + 1.6, T.suspensa + 0.6, T.transpar + 0.5, T.acumulo + 0.6, T.contratos + 0.7,
  T.gastar + 0.5, T.porque + 0.8, T.agri2 + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCamacan: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="CAMACAN" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festa,', 'R$ 3,4 mi.', 'Agricultura', 'familiar, 0.'];
export const CapaOrcamentoCamacan: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 540}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · CAMACAN · 2025`} t={1} troca={0} y={SEGURO.topo + 160} />
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
