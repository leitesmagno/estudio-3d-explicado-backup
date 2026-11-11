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
import {BaseGaveta} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 142. orçamento de Itapé (BA) (perfil @eumagnoleite). PEDIDO DE SEGUIDOR (e-mail do site): transporte escolar e manutenção de ar-condicionado.
// MOLDE 093 Ilhéus / 110 Catu / 131 Maraú. O Kit Mapas abre (projetos/142.../mapas/itape.mp4) e o Estúdio 3D monta a maquete redonda:
// o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 1 mi). Quando a voz fala um setor, as pilhas voam para a casinha.
// "Gastou" = LIQUIDADO. Total do ano = Prefeitura (com o Fundo de Saúde) + Câmara = consolidado PCMGE065 = Balanço, centavo a centavo
// (~/Documents/RECEITAS-DESPESAS-ITAPE/scripts/setores.py). Regra 99: "Festas e eventos" separado de "Cultura".
// Transporte escolar = ação "Manutenção do Transporte Escolar" (PCMGE015). Ar-condicionado = pagamentos lidos a olho nos PCMGE056.
// Sem porcentagem, sem nome de gestor, sem nome de empresa. SÓ DADOS DE ITAPÉ, todos do TCM-BA: projetos/142.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 178.34; // Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes + 0,35 s, pausas 0,28 s, atempo 1,06, -15,5 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '142. orçamento de itapé';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 59'),
  arrec24: quando('Arrecadou 59 milhoes e 400 Gastou'),
  gastou24: quando('Gastou 55'),
  mais24: quando('Sobraram 4'),
  ano25: quando('2025 Arrecadou 61'),
  arrec25: quando('Arrecadou 61 milhoes e 600 Gastou'),
  gastou25: quando('Gastou 63'),
  mais25: quando('Gastou 1 milhao e 500'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 51 milhoes e 100 Gastou'),
  gastou26: quando('Gastou 51 milhoes e 500'),
  mais26: quando('Gastou 395'),
  comprometeu: quando('E ja comprometeu'),
  camara: quando('A Camara recebeu'),
  rec24: quando('recebeu 1 milhao'),
  rec25: quando('e 2 milhoes e 300 em 2025'),
  dev24: quando('Devolveu 8 mil'),
  dev25: quando('e 8 mil e 300'),
  pergunta: quando('Agora a pergunta'),
  tesc: quando('O transporte escolar'),
  quem: quando('E quem leva'),
  t24: quando('Em 2024 457'),
  t25: quando('Em 2025 314'),
  t26: quando('Em 2026 ate setembro 280'),
  ac: quando('E os arescondicionados'),
  apartir: quando('A partir de junho'),
  ac24: quando('Foram 38'),
  ac25: quando('33 mil em 2025'),
  ac26: quando('26 mil e 200'),
  saude: quando('So na saude'),
  s24: quando('16 mil e 900'),
  s25: quando('7 mil e 800'),
  s26: quando('4 mil e 800'),
  separa: quando('O documento nao separa'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se o transporte'),
  festas2: quando('por que as festas'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 11 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'fes', nome: 'FESTAS E EVENTOS', tipo: 'palco', texto: 'FESTAS'},
  {id: 'cul', nome: 'CULTURA', tipo: 'colunas', texto: 'CULTURA'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.14 * Math.PI + i * 0.164 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.9, 1.55, 1.25][yi];
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
    ['div', 'Dividas e encargos'],
    ['ass', 'Assistencia social'],
    ['cam', 'Camara'],
    ['fes', 'Festas e eventos'],
    ['cul', 'Cultura'],
    ['agr', 'Agricultura e meio'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, s === 'cam' ? n + 1 : n), v: v[k]})); // 'Câmara' aparece antes, na abertura
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 55.15, rotulo: '2024', falta: {t: T.mais24, v: 4.2714, txt: 'SOBRARAM', sobra: true}, entradas: lista(1, [25.177, 10.348, 8.3708, 4.1811, 1.8447, 1.8115, 1.7603, 1.4059, 0, 0.23702, 0.0113])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 63.15, rotulo: '2025', falta: {t: T.mais25, v: 1.5323, txt: 'A MAIS'}, entradas: lista(2, [26.975, 11.722, 8.134, 4.9778, 3.7253, 1.2001, 2.2832, 3.4084, 0.0000507, 0.72108, 0.0049])},
  {ini: T.ano26 + 0.3, fim: T.camara, gastou: T.gastou26, total: 51.52, rotulo: '2026 · ATÉ SET', falta: {t: T.mais26, v: 0.39497, txt: 'A MAIS'}, entradas: lista(3, [23.798, 9.2509, 7.6751, 3.9329, 1.272, 0.97327, 1.7848, 2.061, 0.096639, 0.55345, 0.12214])},
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
const ESCALA = 1; // 1 pilha = R$ 1 mi (~52 a 63 mi por ano)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2024 usa cerca de 80 pilhas) ----------
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
    if (n < 0.0009) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.04, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.camara - 0.2, T.camara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Cada gaveta tem a sua escala (o placar diz qual).
const LADO_A = 2;
const PASSO_A = 0.25;
const ZD = -2.0;
// atrás do cofre, à esquerda (1 pilha = R$ 250 mil): a Câmara recebeu e devolveu, em 2024 e 2025
const ESC_C = 0.25;
const CM = {
  rec24: {p: [-4.3, 0, ZD] as V3, v: 1.7701},
  dev24: {p: [-3.35, 0, ZD] as V3, v: 0.0088531},
  rec25: {p: [-2.2, 0, ZD] as V3, v: 2.2932},
  dev25: {p: [-1.25, 0, ZD] as V3, v: 0.0082504},
};
const CM_X = -2.775;
// atrás do cofre, à direita (1 pilha = R$ 50 mil): o transporte escolar, 2024, 2025 e 2026 até setembro
const ESC_T = 0.05;
const TR = {
  t24: {p: [0.95, 0, ZD] as V3, v: 0.45684},
  t25: {p: [2.3, 0, ZD] as V3, v: 0.3139},
  t26: {p: [3.65, 0, ZD] as V3, v: 0.28021},
};
const TR_X = 2.3;
// na frente, à direita (1 pilha = R$ 5 mil): ar-condicionado (pagamentos achados) e só a saúde
const ZA = 0.2;
const ESC_AC = 0.005;
const AC = {
  a24: {p: [0.6, 0, ZA] as V3, v: 0.03889},
  a25: {p: [1.45, 0, ZA] as V3, v: 0.03301},
  a26: {p: [2.3, 0, ZA] as V3, v: 0.02615},
  s24: {p: [3.25, 0, ZA] as V3, v: 0.01692},
  s25: {p: [4.1, 0, ZA] as V3, v: 0.00781},
  s26: {p: [4.95, 0, ZA] as V3, v: 0.004765},
};
const AC_X = 2.775;
// na frente, à esquerda (1 pilha = R$ 200 mil): transporte escolar 2025 x festas e eventos 2025
const ESC_F = 0.2;
const FA = {
  tr25: {p: [-3.6, 0, ZA] as V3, v: 0.3139},
  fe25: {p: [-2.2, 0, ZA] as V3, v: 3.4084},
};
const GAV_X = -2.9;
const CM_VIS = (t: number) => vis(t, T.camara - 0.3, T.pergunta + 0.1);
const TR_VIS = (t: number) => vis(t, T.pergunta - 0.3, T.ac + 0.1);
const AC_VIS = (t: number) => vis(t, T.ac - 0.3, T.gastar + 0.1);
const FA_VIS = (t: number) => vis(t, T.gastar - 0.3, FIM + 2);

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
    // torre na frente do cofre: o que sobrou (verde) ou o que passou do arrecadado (vermelho), em cada ano
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (v: number, esc: number, k: number, min = 0.3) => Math.max(min, v / esc) * k;
  const claro = mistura(CA[1], tema.objetoClaro, 0.45);
  const vermelho = mistura(C.alerta, tema.objetoClaro, 0.3);
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const pares: [keyof typeof CM, number, string][] = [
      ['rec24', T.rec24 + 0.5, CA[0]], ['dev24', T.dev24 + 0.3, claro],
      ['rec25', T.rec25 + 0.5, CA[1]], ['dev25', T.dev25 + 0.3, claro],
    ];
    pares.forEach(([k, a, cor]) => {
      const kk = cresce(a) * cm;
      if (kk > 0.01) solidas.push(...torre(CM[k].p, tAk(CM[k].v, ESC_C, kk, k.startsWith('dev') ? 0.08 : 0.3), LADO_A, cor, PASSO_A));
    });
  }
  const tr = TR_VIS(t);
  if (tr > 0.01) {
    const itens: [keyof typeof TR, number, string][] = [['t24', T.t24 + 0.4, CA[0]], ['t25', T.t25 + 0.4, CA[1]], ['t26', T.t26 + 0.6, CA[2]]];
    itens.forEach(([k, a, cor]) => {
      const kk = cresce(a) * tr;
      if (kk > 0.01) solidas.push(...torre(TR[k].p, tAk(TR[k].v, ESC_T, kk), LADO_A, cor, PASSO_A));
    });
  }
  const ac = AC_VIS(t);
  if (ac > 0.01) {
    const itens: [keyof typeof AC, number, string][] = [
      ['a24', T.ac24 + 0.3, CA[0]], ['a25', T.ac25 + 0.2, CA[1]], ['a26', T.ac26 + 0.2, CA[2]],
      ['s24', T.s24 + 0.2, vermelho], ['s25', T.s25 + 0.2, vermelho], ['s26', T.s26 + 0.2, vermelho],
    ];
    itens.forEach(([k, a, cor]) => {
      const kk = cresce(a) * ac;
      if (kk > 0.01) solidas.push(...torre(AC[k].p, tAk(AC[k].v, ESC_AC, kk), LADO_A, cor, PASSO_A));
    });
  }
  const fa = FA_VIS(t);
  if (fa > 0.01) {
    const itens: [keyof typeof FA, number, string][] = [['tr25', T.porque + 0.4, CA[1]], ['fe25', T.festas2 + 0.3, vermelho]];
    itens.forEach(([k, a, cor]) => {
      const kk = rampa(t, a, a + 0.8) * fa;
      if (kk > 0.01) solidas.push(...torre(FA[k].p, tAk(FA[k].v, ESC_F, kk), LADO_A, cor, PASSO_A));
    });
  }
  return {solidas, fantasmas, torres};
};

// enfeites só no vão entre o Esporte (último) e a Educação (primeira), longe das casinhas dos setores
const CASAS: [V3, number][] = [
  [[0.4, 0, 8.6], 0.2],
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
  const cinza = 0;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={cinza} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const cm = CM_VIS(t);
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

      {/* a Câmara (atrás, à esquerda); transporte escolar (atrás, à direita); ar-condicionado (frente, à direita); transporte x festas (frente, à esquerda) */}
      <BaseGaveta tema={tema} pos={[CM_X, 0, ZD]} sobe={cm} larg={4.3} texto="CÂMARA: RECEBEU E DEVOLVEU" aceso={janela(t, T.camara, T.pergunta, 0.4)} />
      <BaseGaveta tema={tema} pos={[TR_X, 0, ZD]} sobe={TR_VIS(t)} larg={4.0} texto="TRANSPORTE ESCOLAR" aceso={janela(t, T.pergunta, T.ac, 0.4)} />
      <BaseGaveta tema={tema} pos={[AC_X, 0, 0.6]} sobe={AC_VIS(t)} larg={5.4} texto="AR-CONDICIONADO · TOTAL x SAÚDE" aceso={janela(t, T.ac, T.gastar, 0.4)} />
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={FA_VIS(t)} larg={3.2} texto="TRANSPORTE x FESTAS · 2025" aceso={janela(t, T.porque, T.segue, 0.4)} />
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
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.mais26 + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.camara - 0.2, 1.2)]},
  // a Câmara: recebeu e devolveu, 2024 e 2025 (atrás do cofre, à esquerda)
  {
    ini: T.camara - 0.1,
    arco: 0.03,
    chaves: [
      [T.camara - 0.1, E(soma(meio(CM.rec24.p, CM.dev25.p), [0, 0.9, 0]), 5.0, 5.4, [0, 1.4, 1])],
      [T.dev24 - 0.2, E(soma(meio(CM.rec24.p, CM.dev25.p), [0, 0.9, 0]), 4.6, 5.2, [-0.02, 1.3, 1])],
      [T.pergunta - 0.4, E(soma(meio(CM.rec24.p, CM.dev25.p), [0, 0.9, 0]), 4.6, 5.2, [0.0, 1.3, 1])],
    ],
  },
  // o transporte escolar (atrás do cofre, à direita)
  {
    ini: T.pergunta - 0.1,
    arco: 0.03,
    chaves: [
      [T.pergunta - 0.1, E([TR_X, 0.9, ZD], 5.6, 5.8, [0, 1.5, 1])],
      [T.t24 - 0.2, E(soma(meio(TR.t24.p, TR.t26.p), [0, 0.8, 0]), 4.4, 5.0, [-0.02, 1.3, 1])],
      [T.ac - 0.4, E(soma(meio(TR.t24.p, TR.t26.p), [0, 0.8, 0]), 4.2, 5.0, [0.02, 1.3, 1])],
    ],
  },
  // o ar-condicionado (frente, à direita): total por ano e só a saúde
  {
    ini: T.ac - 0.1,
    arco: 0.03,
    chaves: [
      [T.ac - 0.1, E([AC_X, 0.9, 0.6], 6.4, 6.0, [0, 1.6, 1])],
      [T.ac24 - 0.2, E(soma(meio(AC.a24.p, AC.a26.p), [0, 0.8, 0]), 3.6, 4.8, [-0.02, 1.3, 1])],
      [T.saude - 0.3, E(soma(meio(AC.a24.p, AC.a26.p), [0.1, 0.8, 0]), 3.4, 4.8, [-0.01, 1.3, 1])],
      [T.saude + 0.3, E(soma(meio(AC.s24.p, AC.s26.p), [0, 0.6, 0]), 3.4, 4.6, [0.0, 1.3, 1])],
      [T.separa + 0.2, E([AC_X, 0.8, 0.6], 6.0, 5.8, [0.02, 1.4, 1])],
      [T.gastar - 0.4, E([AC_X, 0.8, 0.6], 6.0, 5.8, [0.03, 1.4, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois transporte 2025 x festas 2025
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.0], 12.0, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E(soma(meio(FA.tr25.p, FA.fe25.p), [0, 1.0, 0]), 4.2, 5.6, [0.02, 1.3, 1])],
      [T.festas2 + 0.3, E(soma(meio(FA.tr25.p, FA.fe25.p), [0, 1.6, 0]), 4.6, 6.6, [0.0, 1.3, 1])],
      [T.segue - 0.5, E([-2.6, 1.2, 0.3], 6.6, 6.6, [0, 1.25, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.camara, T.pergunta, T.ac, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) =>
  v === 0 ? 'R$ 0' : v < 0.0001 ? 'R$ 51' : v < 0.01 ? `R$ ${(v * 1000).toFixed(1).replace('.', ',').replace(/,0$/, '')} MIL` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 55,1 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 4,3 MI', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 61,6 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 63,2 MI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'GASTOU R$ 1,5 MI A MAIS DO QUE ARRECADOU'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 51,1 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 51,5 MI'},
    {a: T.mais26, b: T.comprometeu, texto: 'GASTOU R$ 395 MIL A MAIS'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'JÁ COMPROMETIDO (EMPENHADO): R$ 55,6 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      const txt = e.s === 'cul' && e.v === 0 ? 'CULTURA: NENHUMA AÇÃO PRÓPRIA (SÓ AS FESTAS)' : `${nomeDe(e.s)}: ${fmtV(e.v)}`;
      c.push({a: e.t, b: prox, texto: txt, destaque: e.v === 0});
    });
  });
  c.push(
    {a: T.camara, b: T.rec25, texto: 'CÂMARA 2024: RECEBEU R$ 1,8 MI DA PREFEITURA'},
    {a: T.rec25, b: T.dev24, texto: 'CÂMARA 2025: RECEBEU R$ 2,3 MI'},
    {a: T.dev24, b: T.pergunta, texto: 'DEVOLVEU R$ 8,9 MIL (2024) E R$ 8,3 MIL (2025)'},
    {a: T.pergunta, b: T.t24, texto: 'PEDIDO DO SEGUIDOR: TRANSPORTE ESCOLAR', destaque: true},
    {a: T.t24, b: T.t25, texto: 'TRANSPORTE ESCOLAR 2024: R$ 457 MIL'},
    {a: T.t25, b: T.t26, texto: 'TRANSPORTE ESCOLAR 2025: R$ 314 MIL'},
    {a: T.t26, b: T.ac, texto: 'TRANSPORTE ESCOLAR 2026 ATÉ SET: R$ 280 MIL'},
    {a: T.ac, b: T.ac24, texto: 'PEDIDO DO SEGUIDOR: AR-CONDICIONADO', destaque: true},
    {a: T.ac24, b: T.saude, texto: 'LIMPEZA, MANUTENÇÃO E INSTALAÇÃO DE AR-CONDICIONADO'},
    {a: T.saude, b: T.separa, texto: 'SÓ NA SAÚDE: R$ 16,9 MIL · R$ 7,8 MIL · R$ 4,8 MIL', destaque: true},
    {a: T.separa, b: T.gastar, texto: 'O DOCUMENTO NÃO SEPARA LIMPEZA, MANUTENÇÃO E INSTALAÇÃO'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.festas2, texto: 'TRANSPORTE ESCOLAR 2025: R$ 314 MIL...', destaque: true},
    {a: T.festas2, b: T.segue, texto: '...FESTAS E EVENTOS 2025: R$ 3,4 MI?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E DESPESA DEZ/2024 · TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO ORÇAMENTÁRIO 2025 · TCM-BA'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: DESPESA DEZ/2025 (PCMGE015) · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: RECEITA E DESPESA CONSOLIDADAS SET/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.camara, texto: 'FONTE: DESPESA SET/2026 (PCMGE015) · TCM-BA'},
  {a: T.camara, b: T.pergunta, texto: 'FONTE: RAZÃO DA PREFEITURA E CONTAS DA CÂMARA · TCM-BA'},
  {a: T.pergunta, b: T.ac, texto: 'FONTE: AÇÃO DE TRANSPORTE ESCOLAR (PCMGE015) · TCM-BA'},
  {a: T.ac, b: T.gastar, texto: 'FONTE: RELAÇÃO DE PAGAMENTOS (PCMGE056) · TCM-BA'},
  {a: T.gastar, b: T.segue, texto: 'FONTE: DESPESA DEZ/2025 (PCMGE015) · TCM-BA'},
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
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: v < 0.001 ? C.alerta : CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  const claro = mistura(CA[1], tema.objetoClaro, 0.45);
  const fimC = T.pergunta - 0.1;
  r.push(
    {a: T.rec24 + 0.9, b: fimC, p: topo(CM.rec24.p, CM.rec24.v, ESC_C), valor: 'R$ 1,8 MI', sub: 'RECEBEU · 2024', cor: CA[0]},
    {a: T.rec25 + 0.9, b: fimC, p: topo(CM.rec25.p, CM.rec25.v, ESC_C), valor: 'R$ 2,3 MI', sub: 'RECEBEU · 2025', cor: CA[1]},
    {a: T.dev24 + 0.6, b: fimC, p: topo(CM.dev24.p, CM.dev24.v, ESC_C), valor: 'R$ 8,9 MIL', sub: 'DEVOLVEU · 2024', cor: claro},
    {a: T.dev25 + 0.6, b: fimC, p: topo(CM.dev25.p, CM.dev25.v, ESC_C), valor: 'R$ 8,3 MIL', sub: 'DEVOLVEU · 2025', cor: claro},
  );
  const fimT = T.ac - 0.1;
  r.push(
    {a: T.t24 + 0.8, b: fimT, p: topo(TR.t24.p, TR.t24.v, ESC_T), valor: 'R$ 457 MIL', sub: 'TRANSPORTE · 2024', cor: CA[0]},
    {a: T.t25 + 0.8, b: fimT, p: topo(TR.t25.p, TR.t25.v, ESC_T), valor: 'R$ 314 MIL', sub: 'TRANSPORTE · 2025', cor: CA[1]},
    {a: T.t26 + 1.2, b: fimT, p: topo(TR.t26.p, TR.t26.v, ESC_T), valor: 'R$ 280 MIL', sub: '2026 · ATÉ SET', cor: CA[2]},
  );
  const fimA = T.gastar - 0.1;
  const verm = C.alerta;
  r.push(
    {a: T.ac24 + 0.6, b: T.saude, p: topo(AC.a24.p, AC.a24.v, ESC_AC), valor: 'R$ 38,9 MIL', sub: 'AR-COND. · 2024', cor: CA[0]},
    {a: T.ac25 + 0.5, b: T.saude, p: topo(AC.a25.p, AC.a25.v, ESC_AC), valor: 'R$ 33 MIL', sub: 'AR-COND. · 2025', cor: CA[1]},
    {a: T.ac26 + 0.6, b: T.saude, p: topo(AC.a26.p, AC.a26.v, ESC_AC), valor: 'R$ 26,2 MIL', sub: '2026 · ATÉ SET', cor: CA[2]},
    {a: T.s24 + 0.4, b: fimA, p: topo(AC.s24.p, AC.s24.v, ESC_AC), valor: 'R$ 16,9 MIL', sub: 'SAÚDE · 2024', cor: verm},
    {a: T.s25 + 0.4, b: fimA, p: topo(AC.s25.p, AC.s25.v, ESC_AC), valor: 'R$ 7,8 MIL', sub: 'SAÚDE · 2025', cor: verm},
    {a: T.s26 + 0.4, b: fimA, p: topo(AC.s26.p, AC.s26.v, ESC_AC), valor: 'R$ 4,8 MIL', sub: 'SAÚDE · 2026', cor: verm},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.8, b: T.segue + 0.5, p: topo(FA.tr25.p, FA.tr25.v, ESC_F), valor: 'R$ 314 MIL', sub: 'TRANSPORTE ESCOLAR · 2025', cor: tema.acento},
    {a: T.festas2 + 0.9, b: T.segue + 0.5, p: topo(FA.fe25.p, FA.fe25.v, ESC_F), valor: 'R$ 3,4 MI', sub: 'FESTAS E EVENTOS · 2025', cor: tema.acento},
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
  const placarK = vis(t, T.gastou24 + 0.4, T.camara);
  const miolo = vis(t, T.camara + 0.2, FIM + 2);
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 1 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : t < T.pergunta ? 'AQUI, 1 PILHA = R$ 250 MIL' : t < T.ac ? 'AQUI, 1 PILHA = R$ 50 MIL' : t < T.gastar ? 'AQUI, 1 PILHA = R$ 5 MIL' : 'AQUI, 1 PILHA = R$ 200 MIL';
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
    const REC = quando('A maior parte vem');
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, REC - 0.5, REC - 0.1));
    const k2 = Math.min(entra(t, REC, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < REC - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · RECEITA SET/2026 · TCM-BA' : t < T.ano24 - 0.1 ? 'FONTE: RECEITA DEZ/2025 (PCMGE016) · TCM-BA' : 'FONTE: BALANÇO ORÇAMENTÁRIO 2024 · TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itape.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 10).map((e) => e.t)), T.rec24, T.pergunta, T.t25, T.ac, T.saude, T.festas2];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);


// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('59 milhoes e 400 em 2024'), quando('61 milhoes e 600 em 2025'), quando('51 milhoes e 100 ate')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.camara, T.rec25, T.dev24, T.t24, T.t25, T.t26, T.ac24, T.ac25, T.ac26].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.pergunta, T.ac, T.saude, T.separa].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.festas2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 5.0, 9.5, 12.5, 15.5, 19.0, 22.0, 25.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.mais26 + 1.0, T.comprometeu + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.camara + 0.6, T.rec25 + 1.2, T.dev24 + 1.0, T.dev25 + 0.8,
  T.pergunta + 0.6, T.quem + 1.0, T.t24 + 1.2, T.t25 + 1.0, T.t26 + 1.6,
  T.ac + 0.6, T.apartir + 1.5, T.ac24 + 1.0, T.ac25 + 0.9, T.ac26 + 1.0, T.saude + 0.8, T.s25 + 0.8, T.s26 + 0.8, T.separa + 1.5,
  T.gastar + 0.5, T.porque + 1.4, T.festas2 + 1.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItape: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="ITAPÉ" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Transporte', 'escolar 2025:', 'R$ 314 mil.', 'Festas: R$ 3,4 mi.'];
export const CapaOrcamentoItape: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITAPÉ · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 14 ? 88 : l.length > 10 ? 100 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
