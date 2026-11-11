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
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 043. orçamento de Ibicaraí (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 044 Itapetinga. O Kit Mapas abre (voo até Ibicaraí e o que a prefeitura arrecadou
// em 2024: projetos/043.../mapas/ibicarai.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões, como em Paratinga). Quando a voz fala um setor, as pilhas saem
// dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando sempre no mesmo sentido. Sem porcentagem e
// sem nome de gestor. SÓ DADOS DE IBICARAÍ, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 175.93; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,134, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '043. orçamento de ibicaraí';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 104'),
  gastou24: quando('Gastou 104'),
  sobra24: quando('Sobraram 560'),
  zero24: quando('Defesa civil e protecao'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 115'),
  gastou25: quando('Gastou 108 e 400'), // a frase de abertura diz "gastou 108 milhões"
  sobra25: quando('Sobraram 6 milhoes'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 83'),
  gastou26: quando('Gastou 80'),
  prometeu: quando('ja prometeu pagar'),
  passa: quando('Ai passa'),
  repara: quando('Agora repara'),
  conv25: quando('contava com 1'),
  naoEntrou: quando('Esse dinheiro nao entrou'),
  usou476: quando('usou 476'),
  diaDia: quando('o dia a dia'),
  terminou: quando('terminou com 6'),
  em26: quando('Em 2026 de novo'),
  usados158: quando('a acao usou 158'),
  esporte: quando('No esporte'),
  sairam20: quando('sairam 20'),
  canil: quando('O canil'),
  aterro: quando('O aterro'),
  nada: quando('Nada usado'),
  casas: quando('E as casas populares'),
  c24: quando('tinham 12 mil'),
  c43: quando('gastaram 4 milhoes'),
  c25: quando('mais 1 milhao e 300'),
  convEst: quando('veio de convenio'),
  porIsso: quando('Por isso a assistencia'),
  tribunal: quando('No Tribunal de Contas'),
  terc: quando('uma denuncia sobre'),
  remedios: quando('a compra de remedios'),
  repasse: quando('um atraso no repasse'),
  acumulo: quando('o acumulo de cargos'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se sobrou'),
  esporte2: quando('por que o esporte'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | TipoPredio;
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
  {id: 'agu', nome: 'ÁGUA E ESGOTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'casinha', texto: 'DEFESA CIVIL'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['def', 'ani'];
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.135 * Math.PI);
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
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number; txt: string}; sobra?: {t: number; v: number}};
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
    ['agu', 'Agua e esgoto'],
    ['agr', 'Agricultura e meio'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.zero24, gastou: T.gastou24, total: 104.1, rotulo: '2024', sobra: {t: T.sobra24, v: 0.564}, entradas: lista(1, [34.4, 27.5, 7.5, 13.2, 2.7, 6.5, 0.65, 7.8, 3.7, 0.27, 0])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 108.4, rotulo: '2025', sobra: {t: T.sobra25, v: 6.7}, entradas: lista(2, [38.7, 27.7, 8.5, 12, 3.5, 7.3, 1.5, 5, 3.8, 0.49, 0])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 80.2, rotulo: '2026 · ATÉ SET', falta: {t: T.prometeu, v: 5.46, txt: 'JÁ PROMETIDOS'}, entradas: lista(3, [29.5, 20.7, 7.5, 9.9, 2.9, 2.2, 0.49, 3.7, 2.7, 0.46, 0.02])},
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

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2025 usa cerca de 60 pilhas) ----------
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
// branco transparente = reservado no orçamento; cor do ano = usado (2025 verde, 2026 rosa, 2024 dourado)
const ESC_A = 0.25;
const LADO_A = 3;
const ZA = 0.2;
const OB = {
  inf25: {p: [-3.4, 0, ZA] as V3, conv: 1.6, usou: 0.476},
  dia25: {p: [-1.5, 0, ZA] as V3, res: 3.814, usou: 6.843},
};
const N26 = {
  inf: {p: [0.75, 0, ZA] as V3, conv: 1.494, usou: 0.158},
  esp: {p: [1.85, 0, ZA] as V3, res: 0.7, usou: 0.0195},
  canil: {p: [2.75, 0, ZA] as V3, res: 0.05},
  aterro: {p: [3.5, 0, ZA] as V3, res: 0.06},
};
const CASA = {
  c24: {p: [-0.75, 0, ZA] as V3, res: 0.012, usou: 4.299},
  c25: {p: [0.75, 0, ZA] as V3, res: 0.02, usou: 1.323},
};
const GA_VIS = (t: number) => vis(t, T.repara + 0.1, T.casas - 0.2) + vis(t, T.gastar - 0.1, FIM + 2);
const GB_VIS = (t: number) => vis(t, T.em26 - 0.4, T.casas - 0.2) + vis(t, T.gastar - 0.1, FIM + 2);
const CASAS_VIS = (t: number) => vis(t, T.casas, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'TERCEIRIZADOS · 2025', valor: 'DENÚNCIA', t: T.terc, carimbos: [[T.terc + 1.4, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'REMÉDIOS DE ALTO CUSTO', valor: '2024', t: T.remedios, carimbos: [[T.remedios + 1.0, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'REPASSE À CÂMARA', valor: '2025', t: T.repasse, carimbos: [[T.repasse + 1.0, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'ACÚMULO DE CARGOS', valor: '2025', t: T.acumulo, carimbos: [[T.acumulo + 0.9, 'SEM JULGAMENTO', 'neutro']]},
];
const posPasta = (i: number): V3 => [-2.7 + i * 1.8, 0, 1.3];
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
    // 2026: o que já foi prometido além do pago, torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // 2025: obras de infraestrutura (convênio que não entrou x usado) e o dia a dia da secretaria
  const ga = GA_VIS(t);
  if (ga > 0.01) {
    const kc = cresce(T.conv25) * ga;
    if (kc > 0.01) fantasmas.push(...torre(OB.inf25.p, (OB.inf25.conv / ESC_A) * kc, LADO_A, tema.objetoClaro));
    const ku = cresce(T.usou476 + 0.2) * ga;
    if (ku > 0.01) solidas.push(...torre(OB.inf25.p, (OB.inf25.usou / ESC_A) * ku, LADO_A, CA[1]));
    const kd = cresce(T.diaDia + 0.3) * ga;
    if (kd > 0.01) fantasmas.push(...torre(OB.dia25.p, (OB.dia25.res / ESC_A) * kd, LADO_A, tema.objetoClaro));
    const kt = cresce(T.terminou, 1.3) * ga;
    if (kt > 0.01) solidas.push(...torre(OB.dia25.p, (OB.dia25.usou / ESC_A) * kt, LADO_A, CA[1]));
  }
  // 2026: obras de infraestrutura, esporte, canil e aterro
  const gb = GB_VIS(t);
  if (gb > 0.01) {
    const kc = cresce(T.em26 + 0.3) * gb;
    if (kc > 0.01) fantasmas.push(...torre(N26.inf.p, (N26.inf.conv / ESC_A) * kc, LADO_A, tema.objetoClaro));
    const ku = cresce(T.usados158) * gb;
    if (ku > 0.01) solidas.push(...torre(N26.inf.p, Math.max(0.63, N26.inf.usou / ESC_A) * ku, LADO_A, CA[2]));
    const ke = cresce(T.esporte + 0.3) * gb;
    if (ke > 0.01) fantasmas.push(...torre(N26.esp.p, (N26.esp.res / ESC_A) * ke, LADO_A, tema.objetoClaro));
    const ks = cresce(T.sairam20) * gb;
    if (ks > 0.01) solidas.push(...torre(N26.esp.p, 0.3 * ks, LADO_A, CA[2]));
    const kn = cresce(T.canil) * gb;
    if (kn > 0.01) fantasmas.push(...torre(N26.canil.p, Math.max(0.3, N26.canil.res / ESC_A) * kn, LADO_A, tema.objetoClaro));
    const ka = cresce(T.aterro) * gb;
    if (ka > 0.01) fantasmas.push(...torre(N26.aterro.p, Math.max(0.3, N26.aterro.res / ESC_A) * ka, LADO_A, tema.objetoClaro));
  }
  // casas populares: quase nada reservado, milhões gastos (convênio com o Estado)
  const cs = CASAS_VIS(t);
  if (cs > 0.01) {
    const r24 = rampa(t, T.c24, T.c24 + 0.6) * cs;
    if (r24 > 0.01) fantasmas.push(...torre(CASA.c24.p, 0.3 * r24, LADO_A, tema.objetoClaro));
    const u24 = rampa(t, T.c43, T.c43 + 1.2) * cs;
    if (u24 > 0.01) solidas.push(...torre(CASA.c24.p, (CASA.c24.usou / ESC_A) * u24, LADO_A, CA[0]));
    const u25 = rampa(t, T.c25, T.c25 + 1.0) * cs;
    if (u25 > 0.01) solidas.push(...torre(CASA.c25.p, (CASA.c25.usou / ESC_A) * u25, LADO_A, CA[1]));
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
  const zerado = ZERADOS.includes(s.id) || (s.id === 'esp' && t < ANOS[2].entradas[10].t + 0.2);
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
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const ga = GA_VIS(t);
  const gb = GB_VIS(t);
  const cs = CASAS_VIS(t);
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

      {/* 2025: obras (esquerda); 2026: obras, esporte, canil e aterro (direita); depois as casas populares no meio */}
      <BaseGaveta tema={tema} pos={[-2.1, 0, ZA]} sobe={ga} larg={3.9} texto="2025 · OBRAS" aceso={Math.max(janela(t, T.repara, T.em26, 0.4), janela(t, T.porque, T.esporte2, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.15, 0, ZA]} sobe={gb} larg={3.9} texto="2026 · ATÉ SETEMBRO" aceso={Math.max(janela(t, T.em26, T.casas, 0.4), janela(t, T.esporte2, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[0, 0, ZA]} sobe={cs} larg={3.2} texto="CASAS POPULARES" aceso={janela(t, T.casas, T.tribunal, 0.4)} />
      {cs > 0.05
        ? ([-2.4, 2.4] as number[]).map((x, k) => <CasaMini key={k} tema={tema} pos={[x, 0, ZA - 0.2]} rotY={k ? -0.3 : 0.3} luz={0.6 * cs} escala={0.55 * Math.min(1, cs)} />)
        : null}

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
            rotY={(1 - i) * 0.1}
            escala={0.9}
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
const PERTO_A = (c: V3, larg = 3.6, h = 1.1, dx = -0.05): Cam => E(soma(c, [0, h, 0.05]), larg, larg * 1.15, [dx, 1.8, 1]);
const [Y0, Y1, Y2] = ANOS;
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h, 0.05]), larg, larg * 1.1, [dx, 1.85, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha; no fim, as duas casinhas cinzas do zero
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobra24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.zero24 - 0.2)]},
  {ini: T.zero24 - 0.1, arco: 0.03, chaves: [[T.zero24 - 0.1, OLHA_SETOR(11.1, 1.05)], [T.zero24 + 0.9, OLHA_SETOR(11.5, 1.1)], [T.ano25 - 0.2, OLHA_SETOR(11.7, 1.1)]]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já foi prometido
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.passa + 0.5, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // as obras: 2025 da esquerda para a direita, depois 2026, o esporte, o canil e o aterro (sempre para a direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.0, 0.9, ZA], 7.4, 6.6, [0, 1.9, 1])],
      [T.conv25 - 0.1, PG(OB.inf25.p, 3.8, 1.2, -0.05)],
      [T.diaDia - 0.3, PG(soma(OB.inf25.p, [0.4, 0, 0]), 3.9, 1.3, -0.05)],
      [T.diaDia + 0.4, PG(OB.dia25.p, 4.6, 1.8)],
      [T.em26 - 0.5, PG(soma(OB.dia25.p, [0.2, 0, 0]), 4.8, 2.0)],
      [T.em26 + 0.2, PG(N26.inf.p, 3.8, 1.1)],
      [T.esporte - 0.4, PG(soma(N26.inf.p, [0.3, 0, 0]), 3.8, 1.1)],
      [T.esporte + 0.2, PG(N26.esp.p, 3.6, 1.0)],
      [T.canil - 0.3, PG(soma(N26.esp.p, [0.3, 0, 0]), 3.6, 1.0)],
      [T.canil + 0.2, PG(soma(N26.canil.p, [0.3, 0, 0]), 3.6, 1.0)],
      [T.nada + 0.2, PG(soma(N26.canil.p, [0.5, 0, 0]), 3.8, 1.0)],
      [T.casas - 0.3, PG(soma(N26.canil.p, [0.55, 0, 0]), 3.9, 1.0)],
    ],
  },
  // casas populares: sobe e mergulha nas duas torres, 2024 (esquerda) e 2025 (direita)
  {
    ini: T.casas - 0.2,
    arco: 0.03,
    chaves: [
      [T.casas - 0.2, E([0, 0.9, ZA], 6.8, 6.2, [0, 1.9, 1])],
      [T.c24, PG(CASA.c24.p, 4.0, 1.4)],
      [T.c25 - 0.3, PG(soma(CASA.c24.p, [0.3, 0, 0]), 4.2, 1.5)],
      [T.c25 + 0.4, PG(soma(CASA.c25.p, [-0.2, 0, 0]), 4.2, 1.3)],
      [T.tribunal - 0.3, E([0.2, 0.9, ZA], 6.4, 6.0, [0.05, 1.9, 1])],
    ],
  },
  // tribunal: as quatro pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 9.4, 7.0, [0, 2.1, 1])],
      [T.terc - 0.1, E(soma(posPasta(0), [0.2, 0.9, 0]), 4.0, 3.9, [-0.1, 2.1, 1])],
      [T.remedios - 0.3, E(soma(posPasta(0), [0.4, 0.9, 0]), 4.0, 3.9, [-0.08, 2.1, 1])],
      [T.remedios + 0.3, E(soma(posPasta(1), [0, 0.9, 0]), 4.0, 3.9, [-0.04, 2.1, 1])],
      [T.repasse - 0.3, E(soma(posPasta(1), [0.2, 0.9, 0]), 4.0, 3.9, [0, 2.1, 1])],
      [T.repasse + 0.3, E(soma(posPasta(2), [0, 0.9, 0]), 4.0, 3.9, [0.04, 2.1, 1])],
      [T.acumulo - 0.3, E(soma(posPasta(2), [0.2, 0.9, 0]), 4.0, 3.9, [0.06, 2.1, 1])],
      [T.acumulo + 0.3, E(soma(posPasta(3), [-0.1, 0.9, 0]), 4.0, 3.9, [0.1, 2.1, 1])],
      [T.gastar - 0.2, E(soma(posPasta(3), [-0.3, 0.9, 0]), 4.6, 4.3, [0.1, 2.1, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois a obra (esquerda) e o esporte (direita)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.2, PG(soma(OB.dia25.p, [-0.5, 0, 0]), 5.2, 1.6, -0.05)],
      [T.esporte2 - 0.6, PG(soma(OB.dia25.p, [0.2, 0, 0]), 5.4, 1.6, -0.02)],
      [T.esporte2 + 0.1, PG(soma(N26.esp.p, [0, 0, 0]), 4.6, 1.2, 0)],
      [T.segue - 0.1, PG(soma(N26.esp.p, [0.1, 0, 0]), 4.7, 1.2, 0)],
      [T.segue + 0.8, E([0.2, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
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
  [0, 'IBICARAÍ'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: AS OBRAS'],
  [T.esporte, 'NO ESPORTE'],
  [T.casas, 'CASAS POPULARES'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra24, texto: 'GASTOU EM 2024: R$ 104,1 MILHÕES'},
    {a: T.sobra24, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 564 MIL EM 2024', destaque: true},
    {a: T.zero24, b: T.ano25, texto: 'DEFESA CIVIL E PROTEÇÃO ANIMAL: NEM APARECEM NO ORÇAMENTO', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 115,2 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 108,4 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 6,7 MI EM 2025', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 83 MI'},
    {a: T.gastou26, b: T.prometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 80,2 MI'},
    {a: T.prometeu, b: T.passa, texto: 'E JÁ PROMETEU PAGAR MAIS R$ 5,5 MI', destaque: true},
    {a: T.passa, b: Y2.entradas[0].t, texto: 'PROMETIDO: R$ 85,6 MI · ARRECADADO: R$ 83 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: e.v === 0 ? `${nomeDe(e.s)}: R$ 0 EM PROGRAMAS` : `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.conv25, texto: 'AGORA REPARA NAS OBRAS'},
    {a: T.conv25, b: T.naoEntrou, texto: 'OBRAS DE INFRAESTRUTURA 2025: R$ 1,6 MI DE CONVÊNIO DO ESTADO'},
    {a: T.naoEntrou, b: T.usou476, texto: 'O DINHEIRO DO CONVÊNIO NÃO ENTROU', destaque: true},
    {a: T.usou476, b: T.diaDia, texto: 'A AÇÃO USOU R$ 476 MIL'},
    {a: T.diaDia, b: T.terminou, texto: 'DIA A DIA DA SECRETARIA: R$ 3,8 MI RESERVADOS'},
    {a: T.terminou, b: T.em26, texto: 'TERMINOU 2025 COM R$ 6,8 MI', destaque: true},
    {a: T.em26, b: T.usados158, texto: '2026: R$ 1,5 MI ESPERANDO CONVÊNIO'},
    {a: T.usados158, b: T.esporte, texto: 'A AÇÃO USOU R$ 158 MIL ATÉ SETEMBRO', destaque: true},
    {a: T.esporte, b: T.sairam20, texto: 'ESPORTE 2026: R$ 700 MIL RESERVADOS'},
    {a: T.sairam20, b: T.canil, texto: 'ATÉ SETEMBRO: R$ 20 MIL', destaque: true},
    {a: T.canil, b: T.aterro, texto: 'CANIL: R$ 50 MIL RESERVADOS'},
    {a: T.aterro, b: T.nada, texto: 'ATERRO SANITÁRIO: R$ 60 MIL RESERVADOS'},
    {a: T.nada, b: T.casas, texto: 'NADA USADO ATÉ SETEMBRO', destaque: true},
    {a: T.casas, b: T.c24, texto: 'E AS CASAS POPULARES?'},
    {a: T.c24, b: T.c25, texto: '2024: R$ 12 MIL RESERVADOS · R$ 4,3 MI GASTOS', destaque: true},
    {a: T.c25, b: T.convEst, texto: '2025: MAIS R$ 1,3 MI'},
    {a: T.convEst, b: T.porIsso, texto: 'DINHEIRO DE CONVÊNIO COM O GOVERNO DO ESTADO'},
    {a: T.porIsso, b: T.tribunal, texto: 'POR ISSO A ASSISTÊNCIA SOCIAL PARECE MAIOR EM 2024'},
    {a: T.tribunal, b: T.terc, texto: 'NO TRIBUNAL DE CONTAS: PROCESSOS SEM JULGAMENTO'},
    {a: T.terc, b: T.remedios, texto: 'TERCEIRIZADOS 2025: DENÚNCIA FALA EM BURLA AO CONCURSO'},
    {a: T.remedios, b: T.repasse, texto: 'COMPRA DE REMÉDIOS DE ALTO CUSTO (2024)'},
    {a: T.repasse, b: T.acumulo, texto: 'ATRASO NO REPASSE PARA A CÂMARA (2025)'},
    {a: T.acumulo, b: T.gastar, texto: 'ACÚMULO DE CARGOS DE SERVIDORES'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.esporte2, texto: 'SOBROU DINHEIRO EM 2024 E 2025...', destaque: true},
    {a: T.esporte2, b: T.segue, texto: '...POR QUE O ESPORTE USOU SÓ R$ 20 MIL?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 · DESPESA EMPENHADA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E SAAE'},
  {a: T.repara, b: T.casas, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2025 E SET/2026 · TCM-BA'},
  {a: T.casas, b: T.tribunal, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2024 E DEZ/2025 · TCM-BA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
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
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: C.alerta});
    if (y.sobra) r.push({a: y.sobra.t + 0.4, b: y.entradas[0].t - 0.1, p: [0, 3.1, 0.6], valor: `SOBRARAM ${fmtV(y.sobra.v)}`, sub: y.rotulo, cor: CA[yi]});
  });
  // os zeros: esporte (2024 e 2025) e as duas casinhas cinzas de 2024
  [0, 1].forEach((yi) => {
    const e = ANOS[yi].entradas[10];
    r.push({a: e.t + 0.5, b: ANOS[yi].fim + 0.3, p: soma(posTorre(idx('esp'), 0), [0, 1.2, 0]), valor: 'R$ 0 EM PROGRAMAS', sub: `ESPORTE · ${ANO_SUB[yi]}`});
  });
  r.push(
    {a: T.zero24 + 0.5, b: T.ano25 - 0.1, p: soma(noAnel(idx('def'), R_PREDIO - 0.4), [0, 1.7, 0]), valor: 'NEM APARECE NO ORÇAMENTO', sub: 'DEFESA CIVIL · 2024'},
    {a: T.zero24 + 0.8, b: T.ano25 - 0.1, p: soma(noAnel(idx('ani'), R_PREDIO - 0.4), [0, 1.7, 0]), valor: 'NEM APARECE NO ORÇAMENTO', sub: 'PROTEÇÃO ANIMAL · 2024'},
  );
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(v / ESC_A, LADO_A) + 0.3, 0]);
  const fimA = T.casas - 0.3;
  // 2025: obras
  r.push(
    {a: T.conv25 + 0.7, b: fimA, p: topo(OB.inf25.p, OB.inf25.conv), valor: 'R$ 1,6 MI', sub: 'CONVÊNIO · NÃO ENTROU'},
    {a: T.usou476 + 0.5, b: fimA, p: soma(OB.inf25.p, [0, 0.55, 0.6]), valor: 'R$ 476 MIL', sub: 'OBRAS DE INFRA · USADO', cor: CA[1]},
    {a: T.diaDia + 0.7, b: T.terminou + 0.2, p: topo(OB.dia25.p, OB.dia25.res), valor: 'R$ 3,8 MI', sub: 'DIA A DIA · RESERVADO'},
    {a: T.terminou + 0.6, b: fimA, p: topo(OB.dia25.p, OB.dia25.usou), valor: 'R$ 6,8 MI', sub: 'DIA A DIA · USADO EM 2025', cor: CA[1]},
  );
  // 2026
  r.push(
    {a: T.em26 + 0.7, b: fimA, p: topo(N26.inf.p, N26.inf.conv), valor: 'R$ 1,5 MI', sub: 'ESPERANDO CONVÊNIO'},
    {a: T.usados158 + 0.4, b: fimA, p: soma(N26.inf.p, [0, 0.5, 0.6]), valor: 'R$ 158 MIL', sub: 'OBRAS DE INFRA · ATÉ SET', cor: CA[2]},
    {a: T.esporte + 0.7, b: fimA, p: topo(N26.esp.p, N26.esp.res), valor: 'R$ 700 MIL', sub: 'ESPORTE · RESERVADO'},
    {a: T.sairam20 + 0.4, b: fimA, p: soma(N26.esp.p, [0, 0.45, 0.6]), valor: 'R$ 20 MIL', sub: 'ESPORTE · ATÉ SET', cor: CA[2]},
    {a: T.canil + 0.4, b: fimA, p: soma(N26.canil.p, [0, 0.9, 0]), valor: 'R$ 50 MIL → R$ 0', sub: 'CANIL'},
    {a: T.aterro + 0.4, b: fimA, p: soma(N26.aterro.p, [0, 0.9, 0]), valor: 'R$ 60 MIL → R$ 0', sub: 'ATERRO SANITÁRIO'},
  );
  // casas populares
  const fimC = T.tribunal - 0.3;
  r.push(
    {a: T.c24 + 0.5, b: T.c43 + 0.4, p: soma(CASA.c24.p, [0, 0.8, 0.4]), valor: 'R$ 12 MIL', sub: '2024 · RESERVADO'},
    {a: T.c43 + 0.9, b: fimC, p: topo(CASA.c24.p, CASA.c24.usou), valor: 'R$ 4,3 MI', sub: '2024 · GASTO', cor: CA[0]},
    {a: T.c25 + 0.8, b: fimC, p: topo(CASA.c25.p, CASA.c25.usou), valor: 'R$ 1,3 MI', sub: '2025 · GASTO', cor: CA[1]},
    {a: T.convEst + 0.3, b: fimC, p: [0, 3.0, ZA], valor: 'CONVÊNIO DO ESTADO', sub: 'FONTE 1665', cor: tema.acento},
  );
  // a pergunta
  r.push(
    {a: T.esporte2 + 0.2, b: FIM + 1, p: topo(N26.esp.p, N26.esp.res), valor: 'R$ 20 MIL DE R$ 700 MIL', sub: 'ESPORTE · 2026', cor: tema.acento},
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
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/ibicarai.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra24, T.sobra25, T.prometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 10).map((e) => e.t)), T.naoEntrou, T.terminou, T.usados158, T.sairam20, T.c43];
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
  [T.sobra24, T.sobra25].forEach((t) => s.push({t: t + 0.3, f: 'ding', v: 0.12}));
  s.push({t: T.prometeu + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.zero24 + 0.9, f: 'baque', v: 0.2});
  [T.conv25, T.diaDia, T.em26, T.esporte, T.canil, T.aterro, T.c24].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.naoEntrou, T.usados158, T.sairam20, T.nada].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.terminou, T.c43].forEach((t) => s.push({t: t + 0.1, f: 'subida', v: 0.18}));
  s.push({t: T.convEst + 0.1, f: 'tique', v: 0.14});
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.esporte2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.sobra24 + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.zero24 + 1.2,
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 0.9, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[10].t + 0.9,
  T.ano26 + 1.0, T.prometeu + 1.0, T.passa + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[5].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[10].t + 0.8,
  T.repara + 0.6, T.conv25 + 1.0, T.naoEntrou + 0.8, T.usou476 + 0.9, T.diaDia + 1.0, T.terminou + 1.2,
  T.em26 + 0.9, T.usados158 + 0.8, T.esporte + 0.9, T.sairam20 + 0.7, T.canil + 0.7, T.aterro + 0.7, T.nada + 0.6,
  T.casas + 0.6, T.c24 + 0.9, T.c43 + 1.2, T.c25 + 1.0, T.convEst + 0.9, T.porIsso + 1.0,
  T.tribunal + 0.4, T.terc + 1.6, T.remedios + 1.2, T.repasse + 1.2, T.acumulo + 1.1,
  T.gastar + 0.5, T.porque + 0.8, T.esporte2 + 0.8, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoIbicarai: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Ibicaraí" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 700 mil', 'pro esporte.', 'Usou só', 'R$ 20 mil.'];
export const CapaOrcamentoIbicarai: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 760}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · IBICARAÍ · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
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
