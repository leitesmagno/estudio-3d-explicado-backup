import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, RoloCompactador} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 046. orçamento de potiraguá (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 Paratinga (código do 040 Anagé).
// O Kit Mapas abre (voo até Potiraguá e o que a prefeitura arrecadou em 2024: projetos/046.../mapas/potiragua.mp4) e o
// Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões).
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor. As casinhas ficam na borda NA ORDEM DA
// FALA, então a câmera anda sempre no mesmo sentido; na virada de ano ela sobe e recomeça.
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE POTIRAGUÁ, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 175.96; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,05, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '046. orçamento de potiraguá';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 53'),
  gastou24: quando('Gastou 55'),
  falt24: quando('2 milhoes e 400 a mais'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 57'),
  gastou25: quando('Gastou 63', 2), // a 1ª vez é a frase de abertura ("Potiraguá gastou 63 milhões")
  falt25: quando('5 milhoes e 300 a mais'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 54'),
  gastou26: quando('Ja gastou'),
  falt26: quando('3 milhoes e 500 a mais'),
  agua: quando('Agua e saneamento'),
  embasa: quando('Embasa'),
  defesa: quando('Defesa civil tem'),
  animal: quando('Protecao animal'),
  repara: quando('Agora repara'),
  plano: quando('O orcamento e o plano'),
  conta: quando('uma conta so'),
  r24: quando('o plano reservou'),
  u24: quando('Usou 266'),
  r25: quando('2025 reservou'),
  u25: quando('Usou 286'),
  r26: quando('2026 reservou'),
  u26: quando('usou 750'),
  papel: quando('Sao 13 milhoes'),
  pagou: quando('pagou 7'),
  cinco: quando('Mais de cinco'),
  caiu: quando('caiu para'),
  mudou: quando('O que mudou'),
  festas: quando('as festas'),
  levaram: quando('levaram 2'),
  maisQue: quando('Mais do que toda'),
  familias: quando('ajuda as familias'),
  tribunal: quando('No Tribunal de Contas'),
  dezMeses: quando('10 dos 12'),
  prazo: quando('fora do prazo'),
  concurso: quando('O concurso publico'),
  semJulg: quando('sem julgamento'),
  balanco: quando('E o balanco'),
  tomada: quando('tomada de contas'),
  gastar: quando('Gastar nao'),
  promete: quando('plano promete'),
  porque: quando('por que so'),
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
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E ESPORTE', tipo: 'palco', texto: 'CULTURA E ESPORTE'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'tra', nome: 'TRANSPORTE', tipo: 'galpao', texto: 'TRANSPORTE'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'galpao', texto: 'ÁGUA'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['agu', 'def', 'ani'];
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroAgora && zeroProx ? 0.1 * Math.PI : zeroAgora || zeroProx ? 0.125 * Math.PI : 0.135 * Math.PI;
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

// ---------- Os três anos (valores em R$ milhões, como a voz diz; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 55.74,
    rotulo: '2024',
    falta: {t: T.falt24, v: 2.4},
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 22.6},
      {s: 'sau', t: quando('Saude'), v: 10.8},
      {s: 'adm', t: quando('Administracao'), v: 7.1},
      {s: 'obr', t: quando('Obras e servicos'), v: 6.8},
      {s: 'cam', t: quando('Camara'), v: 1.8},
      {s: 'div', t: quando('Dividas'), v: 1.1},
      {s: 'cul', t: quando('Cultura'), v: 2.8},
      {s: 'ass', t: quando('Assistencia social'), v: 2.3},
      {s: 'tra', t: quando('Transporte'), v: 0.43},
      {s: 'agr', t: quando('Agricultura'), v: 0.04},
      {s: 'mam', t: quando('Meio ambiente'), v: 0.057},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 63.2,
    rotulo: '2025',
    falta: {t: T.falt25, v: 5.3},
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 22.6},
      {s: 'sau', t: quando('Saude', 2), v: 13.4},
      {s: 'adm', t: quando('Administracao', 2), v: 12.6},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 4.7},
      {s: 'cam', t: quando('Camara', 2), v: 2.4},
      {s: 'div', t: quando('Dividas', 2), v: 2.7},
      {s: 'cul', t: quando('Cultura', 2), v: 0.84},
      {s: 'ass', t: quando('Assistencia social', 2), v: 3.0},
      {s: 'tra', t: quando('Transporte', 2), v: 0.62},
      {s: 'agr', t: quando('Agricultura', 2), v: 0.17},
      {s: 'mam', t: quando('Meio ambiente', 2), v: 0.078},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.agua,
    gastou: T.gastou26,
    total: 58.4,
    rotulo: '2026 · ATÉ SET',
    falta: {t: T.falt26, v: 3.5},
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 24.4},
      {s: 'sau', t: quando('Saude', 3), v: 14.0},
      {s: 'adm', t: quando('Administracao', 3), v: 8.3},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 3.8},
      {s: 'cam', t: quando('Camara', 3), v: 2.1},
      {s: 'div', t: quando('Dividas', 3), v: 1.8},
      {s: 'cul', t: quando('Cultura', 3), v: 0.91},
      {s: 'ass', t: quando('Assistencia social', 3), v: 2.2},
      {s: 'tra', t: quando('Transporte', 3), v: 0.67},
      {s: 'agr', t: quando('Agricultura', 3), v: 0.21},
      {s: 'mam', t: quando('Meio ambiente', 3), v: 0.062},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? (s.id === 'agu' ? T.agua : s.id === 'def' ? T.defesa : T.animal)]));
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
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.035, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 3.65];

// ---------- As gavetas: construir e reformar (3 anos) e o apoio administrativo (2025 e 2026), no miolo da mesa ----------
const ESC_OBRA = 0.25; // aqui, 1 pilha = R$ 250 mil
const GAV = {
  o24: [-2.9, 0, 1.25] as V3,
  o25: [-1.7, 0, 1.25] as V3,
  o26: [-0.5, 0, 1.25] as V3,
  ap25: [1.5, 0, 1.25] as V3,
  ap26: [2.7, 0, 1.25] as V3,
};
const OBRA = {o24: {res: 3.866, usou: 0.266}, o25: {res: 2.981, usou: 0.286}, o26: {res: 6.126, usou: 0.75}, ap25: {res: 0, usou: 7.427}, ap26: {res: 0, usou: 0.71}};
const LADO_G: Record<keyof typeof GAV, number> = {o24: 3, o25: 3, o26: 3, ap25: 3, ap26: 3};
const GAVETAS_VIS = (t: number) => vis(t, T.repara + 0.2, T.festas - 0.3) + vis(t, T.gastar, FIM + 2);
const APOIO_VIS = (t: number) => vis(t, T.pagou - 0.4, T.festas - 0.3);
const TCM_POS: V3 = [0, 0, -2.35];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'CONTAS DE 2024', valor: '10 DE 12 MESES', t: T.dezMeses, carimbos: [[T.prazo, 'FORA DO PRAZO', 'alerta'], [T.semJulg, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'CONCURSO 2024', valor: 'EM PROCESSO', t: T.concurso, carimbos: [[T.semJulg + 0.15, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'BALANÇO 2025', valor: 'NÃO APARECE', t: T.balanco, carimbos: [[T.tomada, 'TOMADA DE CONTAS', 'alerta']]},
];
const posPasta = (i: number): V3 => [-2.0 + i * 2.0, 0, 0.4];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele.
  // As torres que já chegaram à borda ficam até o fim (aprendizado do 051); só o que está no miolo some.
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
    // o que foi gasto a mais: torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    });
  }
  // gavetas: claro e transparente = reservado; cor do ano = usado. Aqui 1 pilha = R$ 250 mil
  const g = GAVETAS_VIS(t);
  if (g > 0.01) {
    const par = (chave: keyof typeof GAV, tRes: number, tUsou: number, cor: string) => {
      const o = OBRA[chave];
      const r = rampa(t, tRes, tRes + 0.6) * g;
      const u = rampa(t, tUsou, tUsou + 1.0) * g;
      if (r > 0.01 && o.res > 0) fantasmas.push(...torre(GAV[chave], (o.res / ESC_OBRA) * r, LADO_G[chave], tema.objetoClaro));
      if (u > 0.01 && o.usou > 0) solidas.push(...torre(GAV[chave], (o.usou / ESC_OBRA) * u, LADO_G[chave], cor));
    };
    par('o24', T.r24, T.u24, CA[0]);
    par('o25', T.r25, T.u25, CA[1]);
    par('o26', T.r26, T.u26, CA[2]);
  }
  const ap = APOIO_VIS(t);
  if (ap > 0.01) {
    const u25 = rampa(t, T.pagou, T.pagou + 1.3) * ap;
    const u26 = rampa(t, T.caiu, T.caiu + 0.8) * ap;
    if (u25 > 0.01) solidas.push(...torre(GAV.ap25, (OBRA.ap25.usou / ESC_OBRA) * u25, LADO_G.ap25, CA[1]));
    if (u26 > 0.01) solidas.push(...torre(GAV.ap26, (OBRA.ap26.usou / ESC_OBRA) * u26, LADO_G.ap26, CA[2]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-5.6, 0, 6.6],
  [-7.6, 0, 3.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.festas, T.tribunal, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.maisQue, T.tribunal, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
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
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.45 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
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
  const g = GAVETAS_VIS(t);
  const ap = APOIO_VIS(t);
  const pk = PASTAS_VIS(t);
  const pAss = noAnel(idx('ass'), R_PREDIO - 1.35);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* famílias na porta da assistência social */}
      {[0, 1, 2].map((k) => {
        const a = rampa(t, T.familias + k * 0.15, T.familias + k * 0.15 + 0.4) * (1 - rampa(t, T.tribunal, T.tribunal + 0.4));
        if (a < 0.02) return null;
        const tg: V3 = [Math.cos(ang(idx('ass'))), 0, -Math.sin(ang(idx('ass')))];
        return <Boneco key={k} tema={tema} pos={soma(pAss, [tg[0] * (k - 1) * 0.42, 0.04, tg[2] * (k - 1) * 0.42])} rotY={ang(idx('ass'))} escala={0.3 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.25 + 0.2 * k)} />;
      })}

      {/* as gavetas: construir e reformar nos três anos e o apoio administrativo */}
      <BaseGaveta tema={tema} pos={[-1.7, 0, 1.25]} sobe={g} larg={3.7} texto="CONSTRUIR E REFORMAR" aceso={Math.max(janela(t, T.conta, T.pagou, 0.4), janela(t, T.promete, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.1, 0, 1.25]} sobe={ap} larg={2.6} texto="APOIO ADMINISTRATIVO" aceso={janela(t, T.pagou, T.festas, 0.4)} />
      {g > 0.05 ? <RoloCompactador tema={tema} pos={[-1.7, 0, 0.15]} rotY={-0.2} escala={0.3 * Math.min(1, g)} giro={0} /> : null}

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
            escala={0.78}
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
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.2, 7.2, [dx, 1.2, 1]);
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
    const pp = perto * (idx(e.s) >= 8 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const GAV_CAM = (c: V3, perto = 1, h = 1.0): Cam => E(soma(c, [0, h, 0.05]), 3.8 * perto, 4.4 * perto, [0, 0.75, 1]);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.falt24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.agua - 0.2, 1.2)]},
  // os zeros: água (Embasa), defesa civil e proteção animal, as três últimas casinhas
  {ini: T.agua - 0.1, arco: 0.04, chaves: [[T.agua - 0.1, OLHA_SETOR(11, 0.95)], [T.defesa - 0.3, OLHA_SETOR(11.2, 0.95)], [T.defesa + 0.1, OLHA_SETOR(12, 0.95)], [T.animal - 0.3, OLHA_SETOR(12.2, 0.95)], [T.animal + 0.1, OLHA_SETOR(13, 0.9)], [T.repara - 0.2, OLHA_SETOR(13, 0.95)]]},
  // construir e reformar: sobe e mergulha no miolo; da esquerda (2024) para a direita (apoio administrativo)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 0.6, 1.2], 8.4, 6.6, [0, 1.25, 1])],
      [T.plano, E([-1.2, 0.8, 1.2], 7.0, 6.0, [-0.05, 1.0, 1])],
      [T.r24 - 0.2, GAV_CAM(GAV.o24, 1.05, 1.0)],
      [T.u24 + 0.6, GAV_CAM(GAV.o24, 1.0, 1.0)],
      [T.r25 - 0.2, GAV_CAM(GAV.o25, 1.05, 1.0)],
      [T.u25 + 0.6, GAV_CAM(GAV.o25, 1.0, 1.0)],
      [T.r26 - 0.2, GAV_CAM(GAV.o26, 1.15, 1.3)],
      [T.u26 + 0.4, GAV_CAM(GAV.o26, 1.12, 1.3)],
      [T.papel - 0.1, E([-1.7, 1.1, 1.25], 6.2, 5.6, [0, 0.8, 1])],
      [T.pagou - 0.4, E([-1.2, 1.1, 1.25], 6.4, 5.8, [0.03, 0.8, 1])],
      [T.pagou + 0.2, E([2.1, 1.7, 1.25], 4.4, 5.6, [0.05, 0.6, 1])],
      [T.cinco - 0.2, E([0.1, 1.4, 1.25], 8.6, 6.8, [0, 0.85, 1])],
      [T.caiu - 0.3, E([0.5, 1.4, 1.25], 8.2, 6.6, [0.02, 0.85, 1])],
      [T.caiu + 0.3, E([2.3, 1.5, 1.25], 4.8, 5.6, [0.06, 0.65, 1])],
      [T.festas - 0.3, E([2.3, 1.5, 1.25], 4.9, 5.7, [0.08, 0.65, 1])],
    ],
  },
  // festas de 2024: sobe e mergulha entre o palco e a assistência (vizinhos na mesa)
  {ini: T.festas - 0.15, arco: 0.05, chaves: [[T.festas - 0.15, DE_CIMA(-0.1)], [T.festas + 1.2, OLHA_SETOR(6.5, 1.5)], [T.familias, OLHA_SETOR(6.6, 1.45)], [T.tribunal - 0.2, OLHA_SETOR(6.7, 1.5)]]},
  // tribunal: as três pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 9.4, 7.0, [0, 0.9, 1])],
      [T.dezMeses - 0.2, E(soma(posPasta(0), [0.2, 0.9, 0]), 4.2, 4.0, [-0.1, 0.55, 1])],
      [T.concurso - 0.3, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.2, 4.0, [-0.08, 0.55, 1])],
      [T.concurso + 0.3, E(soma(posPasta(1), [0, 0.9, 0]), 4.2, 4.0, [0, 0.55, 1])],
      [T.semJulg - 0.4, E([-1.0, 0.9, 0.4], 7.6, 5.6, [0, 0.6, 1])],
      [T.balanco - 0.3, E([-1.0, 0.9, 0.4], 7.4, 5.5, [0.01, 0.6, 1])],
      [T.balanco - 0.1, E(soma(posPasta(2), [-0.1, 0.9, 0]), 4.2, 4.0, [0.06, 0.55, 1])],
      [T.gastar - 0.2, E(soma(posPasta(2), [-0.2, 0.9, 0]), 4.6, 4.3, [0.08, 0.6, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois a gaveta de construir e reformar
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.promete - 0.1, E([-1.7, 1.1, 1.25], 6.2, 5.6, [0, 0.85, 1])], [T.segue, E([-1.5, 1.1, 1.25], 6.6, 5.8, [0.1, 0.9, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'POTIRAGUÁ · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.agua, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA'],
  [T.pagou, 'APOIO ADMINISTRATIVO'],
  [T.festas, 'AS FESTAS DE 2024'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falt24, texto: 'GASTOU EM 2024: R$ 55,7 MILHÕES'},
    {a: T.falt24, b: Y0.entradas[0].t, texto: 'R$ 2,4 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 57,9 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 63,2 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'R$ 5,3 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 54,9 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 58,4 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: Y2.entradas[0].t, texto: 'R$ 3,5 MI A MAIS, ATÉ SETEMBRO', destaque: true},
    {a: T.agua, b: T.embasa, texto: 'ÁGUA E SANEAMENTO: R$ 0', destaque: true},
    {a: T.embasa, b: T.defesa, texto: 'A ÁGUA DA CIDADE É DA EMBASA, EMPRESA DO ESTADO'},
    {a: T.defesa, b: T.animal, texto: 'DEFESA CIVIL: TEM LINHA NO ORÇAMENTO, GASTO R$ 0', destaque: true},
    {a: T.animal, b: T.repara, texto: 'PROTEÇÃO ANIMAL: NEM APARECE NO ORÇAMENTO', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.plano, texto: 'AGORA REPARA'},
    {a: T.plano, b: T.conta, texto: 'O ORÇAMENTO É O PLANO DO ANO'},
    {a: T.conta, b: T.r24, texto: 'A CONTA DE CONSTRUIR E REFORMAR: OBRAS E INSTALAÇÕES'},
    {a: T.r24, b: T.u24, texto: '2024: RESERVADO R$ 3,9 MI'},
    {a: T.u24, b: T.r25, texto: '2024: USADO R$ 266 MIL', destaque: true},
    {a: T.r25, b: T.u25, texto: '2025: RESERVADO R$ 3 MI'},
    {a: T.u25, b: T.r26, texto: '2025: USADO R$ 286 MIL', destaque: true},
    {a: T.r26, b: T.u26, texto: '2026: RESERVADO R$ 6,1 MI'},
    {a: T.u26, b: T.papel, texto: '2026, ATÉ SETEMBRO: USADO R$ 750 MIL', destaque: true},
    {a: T.papel, b: T.pagou, texto: 'R$ 13 MI NO PAPEL · R$ 1,3 MI USADOS', destaque: true},
    {a: T.pagou, b: T.cinco, texto: '2025: R$ 7,4 MI A EMPRESAS DE APOIO ADMINISTRATIVO'},
    {a: T.cinco, b: T.caiu, texto: 'MAIS DE 5 VEZES O USADO EM OBRAS NOS 3 ANOS', destaque: true},
    {a: T.caiu, b: T.mudou, texto: '2026, ATÉ SETEMBRO: R$ 710 MIL'},
    {a: T.mudou, b: T.festas, texto: 'O QUE MUDOU?', destaque: true},
    {a: T.festas, b: T.maisQue, texto: '2024: FESTAS (MICARJÃO, SÃO JOÃO DOS BAIRROS) R$ 2,7 MI'},
    {a: T.maisQue, b: T.tribunal, texto: 'MAIS QUE TODA A ASSISTÊNCIA SOCIAL DE 2024: R$ 2,3 MI', destaque: true},
    {a: T.tribunal, b: T.dezMeses, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.dezMeses, b: T.concurso, texto: '10 DOS 12 MESES DE 2024 CHEGARAM FORA DO PRAZO', destaque: true},
    {a: T.concurso, b: T.semJulg, texto: 'CONCURSO PÚBLICO DE 2024: PROCESSO NO TCM'},
    {a: T.semJulg, b: T.balanco, texto: 'OS DOIS PROCESSOS: SEM JULGAMENTO'},
    {a: T.balanco, b: T.tomada, texto: 'BALANÇO DE 2025: NÃO APARECE NA CONSULTA PÚBLICA'},
    {a: T.tomada, b: T.gastar, texto: 'NO E-TCM, 2025 ESTÁ COMO "TOMADA DE CONTAS"', destaque: true},
    {a: T.gastar, b: T.promete, texto: 'GASTAR NÃO É CRIME'},
    {a: T.promete, b: T.porque, texto: 'O PLANO PROMETEU R$ 13 MI EM OBRAS...', destaque: true},
    {a: T.porque, b: T.segue, texto: '...POR QUE SÓ R$ 1,3 MI SAIU DO PAPEL?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: SIGA DEZ/2025 · PREFEITURA E CÂMARA · DESPESA EMPENHADA'},
  {a: T.ano26, b: T.agua, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.agua, b: T.defesa, texto: 'FONTE: SIGA DO TCM-BA · OPERADORA DA ÁGUA: EMBASA (INFOSANBAS)'},
  {a: T.defesa, b: T.festas, texto: 'FONTE: DESPESA POR AÇÃO E ELEMENTO · SIGA DEZ/24, DEZ/25, SET/26'},
  {a: T.festas, b: T.tribunal, texto: 'FONTE: SIGA DEZ/2024 · PAGAMENTOS DE JUN/2024 (PCMGE056)'},
  {a: T.tribunal, b: T.balanco, texto: 'FONTE: TCM-BA › DECISÕES (06251E25, 25552E25) · E-TCM'},
  {a: T.balanco, b: T.gastar, texto: 'FONTE: E-TCM · CONSULTA PÚBLICA, 07/11/2026'},
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
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(sai, e.t + 2.1) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  // festas x assistência social, 2024
  r.push({a: T.levaram + 0.3, b: T.tribunal, p: soma(posTorre(idx('cul'), 0), [0, altFina(valorDe('cul', 0)) + 0.35, 0]), valor: 'R$ 2,7 MI', sub: '2024 · FESTAS', cor: CA[0]});
  r.push({a: T.maisQue + 0.4, b: T.tribunal, p: soma(posTorre(idx('ass'), 0), [0, altFina(valorDe('ass', 0)) + 0.35, 0]), valor: 'R$ 2,3 MI', sub: '2024 · ASSISTÊNCIA', cor: CA[0]});
  // gavetas: construir e reformar (reservado e usado) e apoio administrativo
  const topo = (chave: keyof typeof GAV, v: number) => soma(GAV[chave], [0, altTorre(v / ESC_OBRA, LADO_G[chave]) + 0.3, 0]);
  r.push(
    {a: T.r24 + 0.5, b: T.festas - 0.3, p: topo('o24', OBRA.o24.res), valor: 'R$ 3,9 MI', sub: '2024 · RESERVADO'},
    {a: T.u24 + 0.5, b: T.festas - 0.3, p: soma(GAV.o24, [0, 0.35, 0.75]), valor: 'R$ 266 MIL', sub: '2024 · USADO', cor: CA[0]},
    {a: T.r25 + 0.5, b: T.festas - 0.3, p: topo('o25', OBRA.o25.res), valor: 'R$ 3 MI', sub: '2025 · RESERVADO'},
    {a: T.u25 + 0.5, b: T.festas - 0.3, p: soma(GAV.o25, [0, 0.35, 0.75]), valor: 'R$ 286 MIL', sub: '2025 · USADO', cor: CA[1]},
    {a: T.r26 + 0.5, b: T.festas - 0.3, p: topo('o26', OBRA.o26.res), valor: 'R$ 6,1 MI', sub: '2026 · RESERVADO'},
    {a: T.u26 + 0.5, b: T.festas - 0.3, p: soma(GAV.o26, [0, 0.35, 0.75]), valor: 'R$ 750 MIL', sub: '2026 · USADO ATÉ SET', cor: CA[2]},
    {a: T.pagou + 0.9, b: T.festas - 0.3, p: topo('ap25', OBRA.ap25.usou), valor: 'R$ 7,4 MI', sub: '2025 · APOIO ADM.', cor: CA[1]},
    {a: T.caiu + 0.6, b: T.festas - 0.3, p: topo('ap26', OBRA.ap26.usou), valor: 'R$ 710 MIL', sub: '2026 · ATÉ SET', cor: CA[2]},
    {a: T.porque, b: FIM + 1, p: topo('o26', OBRA.o26.res), valor: '?', cor: tema.acento},
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
  const obraK = vis(t, T.r24, T.festas - 0.3);
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
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{obraK > 0.01 ? 'AQUI, 1 PILHA = R$ 250 MIL · BRANCO = RESERVADO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/potiragua.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falt24, T.falt25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.u24, T.u25, T.u26, T.papel, T.cinco, T.prazo, T.tomada];
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
  [T.agua, T.defesa, T.animal].forEach((t) => s.push({t: t + 0.9, f: 'baque', v: 0.2}));
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  [T.r24, T.r25, T.r26].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.15}));
  [T.u24, T.u25, T.u26].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.16}));
  s.push({t: T.papel + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.pagou + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.caiu + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.levaram + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.maisQue + 0.4, f: 'pop', v: 0.16});
  s.push({t: T.prazo + 0.1, f: 'impacto', v: 0.16});
  s.push({t: T.semJulg + 0.1, f: 'tique', v: 0.14});
  s.push({t: T.tomada + 0.1, f: 'impacto', v: 0.16});
  s.push({t: T.promete, f: 'pop', v: 0.18});
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.falt24 + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[10].t + 0.9,
  T.ano26 + 1.0, T.falt26 + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[8].t + 0.6, Y2.entradas[10].t + 0.8,
  T.agua + 0.6, T.embasa + 0.4, T.defesa + 1.0, T.animal + 0.8,
  T.repara + 0.6, T.conta + 0.8, T.r24 + 0.9, T.u24 + 0.9, T.r25 + 0.9, T.u25 + 0.9, T.r26 + 0.9, T.u26 + 0.9, T.papel + 1.0,
  T.pagou + 1.4, T.cinco + 0.8, T.caiu + 0.9, T.mudou + 0.2,
  T.festas + 0.4, T.levaram + 0.8, T.maisQue + 0.9, T.familias + 0.6,
  T.tribunal + 0.4, T.dezMeses + 0.6, T.prazo + 0.6, T.concurso + 0.9, T.semJulg + 0.5, T.balanco + 0.8, T.tomada + 0.6,
  T.gastar + 0.5, T.promete + 0.6, T.porque + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoPotiragua: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="POTIRAGUÁ" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 13 mi', 'no papel.', 'R$ 1,3 mi', 'usado.'];
export const CapaOrcamentoPotiragua: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 760}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · POTIRAGUÁ`} t={1} troca={0} y={SEGURO.topo + 160} />
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
