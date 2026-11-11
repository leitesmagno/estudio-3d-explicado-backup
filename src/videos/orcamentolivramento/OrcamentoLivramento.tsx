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
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from '../orcamentoparatinga/pecas';
import {CarroPipa, ChaoSeco, FaixaMastros} from './pecas';
import {PALAVRAS} from './palavras';

// 047. orçamento de livramento de nossa senhora (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 (Paratinga), aprovado.
// O Kit Mapas abre (voo até Livramento e o que a prefeitura arrecadou em 2024: projetos/047.../mapas/livramento.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 4 milhões, porque
// Livramento gasta quase o dobro de Paratinga). Na palavra de cada setor, as pilhas voam do cofre para a casinha. As casinhas ficam na
// borda NA ORDEM DA FALA; a câmera anda sempre no mesmo sentido e, na virada de ano, sobe e recomeça.
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE LIVRAMENTO DE NOSSA SENHORA: audio/fontes.md. Plano: plano.md (v1, aprovado).

export const FPS = 30;
const AUDIO_SEG = 177.15; // pausas de 0,28 s, acelerada 1,25x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '047. orçamento de livramento de nossa senhora';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 234'),
  gastou24: quando('Gastou 223'),
  sobra: quando('Sobraram'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 270'),
  gastou25: quando('Gastou 284', 2), // a 1ª vez é a frase de abertura ("gastou 284 milhões em 2025")
  falt25: quando('Sao 14'),
  cobertos: quando('cobertos com'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 195'),
  gastou26: quando('Ja gastou'),
  falt26: quando('Sao 12'),
  zeros: quando('Os zeros'),
  soPagou: quando('so pagou'),
  programas: quando('Programas para'),
  zeroTres: quando('zero nos'),
  repara: quando('Agora repara'),
  festas: quando('vai para festas'),
  todoAno: quando('todo ano'),
  pobres: quando('os mais pobres'),
  festa24: quando('Em 2024 a festa'),
  terminou: quando('terminou com'),
  seca: quando('E tem a seca'),
  emerg: quando('emergencia pela'),
  doisMeses: quando('dois meses'),
  melhorias: quando('acao de melhorias'),
  naoUsou: quando('nao usou'),
  embasa: quando('Embasa'),
  pipa: quando('sai da conta'),
  esgoto: quando('esgoto novo'),
  estado: quando('obra do Estado'),
  tribunal: quando('No Tribunal'),
  kits: quando('kits escolares'),
  parar: quando('mandou parar'),
  cancelou: quando('prefeitura cancelou'),
  arCond: quando('eletronicos para'),
  suspensa: quando('foi suspensa'),
  analisa: quando('tribunal analisa'),
  artistas: quando('artistas do'),
  nada: quando('Nada foi'),
  gastar: quando('Gastar nao'),
  festaLeva: quando('a festa leva'),
  zeroFim: quando('ficam no zero'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | TipoPredio;
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
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE E LAZER', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'prog', nome: 'PROGRAMAS DO AGRICULTOR', tipo: 'galpao', texto: 'PROGRAMAS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['prog'];
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroProx ? 0.135 * Math.PI : 0.145 * Math.PI;
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

// ---------- Os três anos (R$ milhões; 2024 e 2025 empenhado, Anexo 9; 2026 liquidado até setembro) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 223.641,
    rotulo: '2024',
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 102.797},
      {s: 'sau', t: quando('Saude'), v: 43.609},
      {s: 'adm', t: quando('Administracao'), v: 9.187},
      {s: 'obr', t: quando('Obras e servicos'), v: 33.313},
      {s: 'cam', t: quando('Camara'), v: 5.989},
      {s: 'div', t: quando('Dividas'), v: 11.103},
      {s: 'cul', t: quando('Cultura'), v: 7.447},
      {s: 'ass', t: quando('Assistencia social'), v: 3.294},
      {s: 'agu', t: quando('Agua e saneamento'), v: 0.041},
      {s: 'agr', t: quando('Agricultura e meio'), v: 0.426},
      {s: 'esp', t: quando('Esporte'), v: 3.46},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 284.045,
    rotulo: '2025',
    falta: {t: T.falt25, v: 13.806},
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 150.878},
      {s: 'sau', t: quando('Saude', 2), v: 54.36},
      {s: 'adm', t: quando('Administracao', 2), v: 11.757},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 25.758},
      {s: 'cam', t: quando('Camara', 2), v: 6.895},
      {s: 'div', t: quando('Dividas', 2), v: 13.007},
      {s: 'cul', t: quando('Cultura', 2), v: 9.049},
      {s: 'ass', t: quando('Assistencia social', 2), v: 4.049},
      {s: 'agu', t: quando('Agua e saneamento', 2), v: 0.052},
      {s: 'agr', t: quando('Agricultura e meio', 2), v: 0.865},
      {s: 'esp', t: quando('Esporte', 2), v: 4.469},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.zeros,
    gastou: T.gastou26,
    total: 208.39,
    rotulo: '2026 · ATÉ SET',
    falta: {t: T.falt26, v: 12.64},
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 109.011},
      {s: 'sau', t: quando('Saude', 3), v: 44.216},
      {s: 'adm', t: quando('Administracao', 3), v: 8.542},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 20.404},
      {s: 'cam', t: quando('Camara', 3), v: 5.252},
      {s: 'div', t: quando('Dividas', 3), v: 4.868},
      {s: 'cul', t: quando('Cultura', 3), v: 8.349},
      {s: 'ass', t: quando('Assistencia social', 3), v: 3.65},
      {s: 'agu', t: quando('Agua e saneamento', 3), v: 0.053},
      {s: 'agr', t: quando('Agricultura e meio', 3), v: 0.484},
      {s: 'esp', t: quando('Esporte', 3), v: 1.359},
    ],
  },
];
const SOBRA_V = 10.987; // 2024: arrecadou 234,63 − gastou 223,64 (Balanço 2024, "Superávit")
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.zeros + 0.2]));
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
const ESCALA = 4; // 1 pilha = R$ 4 milhões
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

// o dinheiro (cofre e pilhas) sai da mesa quando começa a seca: o miolo vira o chão seco
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.seca - 0.2, T.seca + 0.6);
const FALTA_POS: V3 = [0, 0, 3.65];
const SOBRA_POS: V3 = [1.35, 0, 3.55];

// ---------- Festas 2024: reservado (tracejado) x gasto (sólido), ao lado do palco ----------
const ESC_FESTA = 0.4; // aqui, 1 pilha = R$ 400 mil
const FESTA_POS: V3 = noAnel(idx('cul') + 0.15, 4.7);
const FESTA = {res: 1.233, usou: 7.447};

// ---------- Melhorias sanitárias: três anos reservados, nada usado (miolo da mesa) ----------
const ESC_SAN = 0.2; // aqui, 1 pilha = R$ 200 mil
const SAN: {pos: V3; res: number; ano: string}[] = [
  {pos: [-1.35, 0, 0.9], res: 1.495, ano: '2024'},
  {pos: [0, 0, 0.9], res: 1.222, ano: '2025'},
  {pos: [1.35, 0, 0.9], res: 1.123, ano: '2026'},
];
const SAN_VIS = (t: number) => vis(t, T.melhorias - 0.2, T.tribunal - 0.1) + vis(t, T.gastar, FIM + 2);
const SECA_VIS = (t: number) => vis(t, T.seca + 0.2, FIM + 2);

const TCM_POS: V3 = [0, 0, -2.35];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: [number, string][]; cor: 'alerta' | 'neutro'}[] = [
  {titulo: 'KITS ESCOLARES', valor: 'R$ 3,7 MI', t: T.kits, carimbos: [[T.parar, 'SUSPENSA'], [T.cancelou, 'CANCELADA']], cor: 'alerta'},
  {titulo: 'AR-CONDICIONADO', valor: 'R$ 2,7 MI', t: T.arCond, carimbos: [[T.suspensa, 'SUSPENSA']], cor: 'alerta'},
  {titulo: 'ARTISTAS DO SÃO JOÃO', valor: '2026', t: T.artistas, carimbos: [[T.artistas + 0.5, 'EM ANÁLISE']], cor: 'neutro'},
];
const posPasta = (i: number): V3 => [-1.5 + i * 1.5, 0, -0.45 + Math.abs(i - 1) * 0.25];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);
const ANG_ESG = ANGS[ANGS.length - 1] + 0.16 * Math.PI;
const POS_ESG: V3 = [Math.sin(ANG_ESG) * 7.1, 0, Math.cos(ANG_ESG) * 7.1];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  if (some > 0.01) {
    // 2024: a sobra fica guardada ao lado do cofre; em "cobertos com a sobra" ela desliza para a torre vermelha de 2025
    const ks = rampa(t, T.sobra, T.sobra + 0.8) * (1 - rampa(t, T.cobertos + 0.9, T.cobertos + 1.4)) * some;
    if (ks > 0.01) {
      const desliza = rampa(t, T.cobertos, T.cobertos + 1.0);
      const pos: V3 = [SOBRA_POS[0] * (1 - desliza) + (FALTA_POS[0] + 0.9) * desliza, 0, SOBRA_POS[2]];
      solidas.push(...torre(pos, (SOBRA_V / ESCALA) * ks, 2, CA[0]));
    }
    // o que foi gasto a mais: torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, 2, C.alerta));
    });
    // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
    ANOS.forEach((y, yi) => {
      VOOS[yi].forEach((v, j) => {
        const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
        if (nasce <= 0.01) return;
        const k = rampa(t, v.t0, v.t0 + 0.75);
        if (k <= 0) torres.push({p: v.de, n: v.n * nasce, cor: CA[yi]});
        else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n * some, cor: CA[yi]});
      });
    });
  }
  // festas 2024: tracejado do que foi reservado e a torre do que foi gasto
  const kf = vis(t, T.festa24 - 0.1, T.seca + 0.2);
  if (kf > 0.01) {
    const r = rampa(t, T.festa24, T.festa24 + 0.6) * kf;
    const u = rampa(t, T.terminou, T.terminou + 1.3) * kf;
    if (r > 0.01) fantasmas.push(...torre(FESTA_POS, (FESTA.res / ESC_FESTA) * r, LADO, tema.objetoClaro));
    if (u > 0.01) solidas.push(...torre(FESTA_POS, (FESTA.usou / ESC_FESTA) * u, LADO, CA[0]));
  }
  // melhorias sanitárias: só tracejado (nada usado)
  const g = SAN_VIS(t);
  if (g > 0.01) {
    SAN.forEach((s, k) => {
      const r = rampa(t, T.melhorias + 0.3 + k * 0.35, T.melhorias + 0.9 + k * 0.35) * g;
      if (r > 0.01) fantasmas.push(...torre(s.pos, (s.res / ESC_SAN) * r, LADO, tema.objetoClaro));
    });
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
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.festas, T.seca, 0.4), janela(t, T.doisMeses, T.melhorias, 0.4), janela(t, T.festaLeva, FIM + 1, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.todoAno, T.festa24, 0.4), janela(t, T.festaLeva, FIM + 1, 0.4));
  if (s.id === 'agr') aceso = Math.max(aceso, janela(t, T.soPagou, T.programas, 0.4));
  if (s.id === 'agu') aceso = Math.max(aceso, janela(t, T.embasa, T.pipa, 0.4));
  if (s.id === 'obr') aceso = Math.max(aceso, janela(t, T.pipa, T.esgoto, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, SOBE.obr, SOBE.obr + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - SOBE.obr))} />;
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
    case 'trator': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo="trator" />
          {[-1.25, 1.25].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d, 0, tg[2] * d])} r={0.4} cresce={Math.min(1, sobe) * 0.8} />
          ))}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const g = SAN_VIS(t);
  const pk = PASTAS_VIS(t);
  const ass = SETORES[idx('ass')];
  const pAss = noAnel(idx('ass'), R_PREDIO - 1.35);
  const pObr = noAnel(idx('obr'), R_PREDIO - 1.6);
  const pAgu = noAnel(idx('agu'), R_PREDIO - 1.6);
  const kp = rampa(t, T.pipa - 0.1, T.pipa + 3.2);
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
        const a = rampa(t, T.pobres + k * 0.15, T.pobres + k * 0.15 + 0.4) * (1 - rampa(t, T.seca, T.seca + 0.4));
        if (a < 0.02 || !ass) return null;
        const tg: V3 = [Math.cos(ang(idx('ass'))), 0, -Math.sin(ang(idx('ass')))];
        return <Boneco key={k} tema={tema} pos={soma(pAss, [tg[0] * (k - 1) * 0.42, 0.04, tg[2] * (k - 1) * 0.42])} rotY={ang(idx('ass'))} escala={0.3 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.25 + 0.2 * k)} />;
      })}

      {/* festas 2024: a base da comparação ao lado do palco */}
      <BaseGaveta tema={tema} pos={FESTA_POS} sobe={vis(t, T.festa24 - 0.2, T.seca + 0.2)} texto="FESTAS 2024" aceso={janela(t, T.festa24, T.seca, 0.4)} larg={1.7} />

      {/* a seca: chão rachado no miolo, placa da emergência e a faixa do São João no palco */}
      <ChaoSeco tema={tema} pos={[0, 0, 0.4]} raio={3.3} sobe={rampa(t, T.seca + 0.1, T.seca + 1.4) * SECA_VIS(t)} />
      <FaixaMastros tema={tema} pos={[0, 0, -1.55]} escala={0.9} sobe={vis(t, T.emerg - 0.2, T.tribunal - 0.1)} texto="EMERGÊNCIA PELA SECA · 2025 E 2026" aceso={janela(t, T.emerg, T.doisMeses, 0.4)} />
      <FaixaMastros tema={tema} pos={noAnel(idx('cul'), 5.3)} rotY={ang(idx('cul')) + Math.PI} escala={0.85} sobe={vis(t, T.doisMeses - 0.2, FIM + 2)} texto="2 MESES DE SÃO JOÃO · 2026" aceso={Math.max(janela(t, T.doisMeses, T.melhorias, 0.4), janela(t, T.festaLeva, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[0, 0, 0.9]} sobe={g} texto="MELHORIAS SANITÁRIAS" aceso={Math.max(janela(t, T.melhorias, T.embasa, 0.4), janela(t, T.zeroFim, FIM + 1, 0.4))} larg={4.2} />

      {/* água: o carro-pipa sai da rua de obras e anda pela borda, rumo à zona rural */}
      <CarroPipa tema={tema} pos={[pObr[0] + (pAgu[0] - pObr[0]) * kp * 0.5, 0, pObr[2] + (pAgu[2] - pObr[2]) * kp * 0.5]} rotY={Math.atan2(pAgu[0] - pObr[0], pAgu[2] - pObr[2]) - Math.PI / 2} escala={0.55} sobe={vis(t, T.pipa - 0.3, FIM + 2)} aceso={janela(t, T.pipa, T.esgoto, 0.4)} />
      <RuaPlaca tema={tema} pos={POS_ESG} rotY={ANG_ESG + Math.PI} escala={0.95} sobe={vis(t, T.esgoto - 0.2, FIM + 2)} linhas={['ESGOTO NOVO', 'GOVERNO DO ESTADO', 'NOVO PAC']} aceso={janela(t, T.esgoto, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const C = coresOI(tema);
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1 - i) * 0.08}
            escala={0.78}
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
const [Y0, Y1, Y2] = ANOS;
const MIOLO = (dx = 0) => E([0, 0.5, 0.6], 8.6, 6.8, [dx, 1.15, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a sobra; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.sobra + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, a sobra cobre a torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.zeros - 0.2, 1.2)]},
  // os zeros: o giro segue até o fim da mesa (galpão cinza), com o trator vizinho no quadro
  {ini: T.zeros - 0.1, arco: 0.03, chaves: [[T.zeros - 0.1, OLHA_SETOR(10, 2.05)], [T.programas, OLHA_SETOR(10.2, 2.0)], [T.repara - 0.2, OLHA_SETOR(10.3, 2.0)]]},
  // festas: sobe e mergulha entre o palco e a assistência (vizinhos na mesa), com a base das festas 2024 na frente
  {ini: T.repara - 0.1, arco: 0.05, chaves: [[T.repara - 0.1, DE_CIMA(-0.1)], [T.festas - 0.2, OLHA_SETOR(6.5, 1.5)], [T.festa24 - 0.3, OLHA_SETOR(6.4, 1.55)], [T.seca - 0.2, OLHA_SETOR(6.3, 1.55)]]},
  // a seca: sobe e mergulha no miolo (chão seco, placa da emergência, melhorias sanitárias), com o palco ao fundo
  {ini: T.seca - 0.1, arco: 0.04, chaves: [[T.seca - 0.1, DE_CIMA(0)], [T.emerg - 0.3, MIOLO(0)], [T.doisMeses - 0.2, E(soma(noAnel(idx('cul'), 5.0), [0, 1.2, 0]), 6.4, 5.6, [0.1, 0.7, 1])], [T.melhorias - 0.3, E(soma(noAnel(idx('cul'), 5.0), [0, 1.2, 0]), 6.2, 5.4, [0.12, 0.7, 1])], [T.melhorias, E([0, 0.9, 0.9], 6.4, 5.6, [0, 0.85, 1])], [T.embasa - 0.3, E([0, 0.9, 0.9], 6.2, 5.4, [0.05, 0.85, 1])]]},
  // água: vista de cima da mesa inteira (caixa d'água, carro-pipa e a placa do esgoto do Estado), sem ir e voltar
  {ini: T.embasa - 0.1, arco: 0.04, chaves: [[T.embasa - 0.1, E([0, 0, 0.3], 15.5, 11.5, [0.1, 1.9, 1])], [T.tribunal - 0.3, E([0, 0, 0.3], 15.2, 11.3, [0.2, 1.9, 1])]]},
  // tribunal: as pastas da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 8.6, 6.8, [0, 0.9, 1])],
      [T.kits, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.4, 4.2, [-0.1, 0.55, 1])],
      [T.cancelou + 0.3, E(soma(posPasta(0), [0.4, 0.9, 0]), 4.4, 4.2, [-0.08, 0.55, 1])],
      [T.arCond, E(soma(posPasta(1), [0, 0.9, 0]), 4.4, 4.2, [0, 0.55, 1])],
      [T.artistas, E(soma(posPasta(2), [-0.2, 0.9, 0]), 4.6, 4.4, [0.06, 0.6, 1])],
      [T.gastar - 0.2, E([0.3, 1.0, -0.9], 7.4, 6.2, [0.1, 0.8, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o palco com a assistência e a gaveta vazia
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.festaLeva - 0.3, OLHA_SETOR(6.5, 1.5)], [T.zeroFim - 0.4, OLHA_SETOR(6.5, 1.45)], [T.zeroFim - 0.1, E([0, 0.9, 0.9], 6.4, 5.6, [0.05, 0.85, 1])], [T.segue, E([0, 0.9, 0.9], 6.8, 5.8, [0.12, 0.9, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'LIVRAMENTO · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.zeros, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA'],
  [T.seca, 'A SECA'],
  [T.embasa, 'ÁGUA E ESGOTO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${(Math.round(v * 10 + 1e-9) / 10).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra, texto: 'GASTOU EM 2024: R$ 223,6 MILHÕES'},
    {a: T.sobra, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 11 MI', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 270,2 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 284 MILHÕES'},
    {a: T.falt25, b: T.cobertos, texto: 'R$ 13,8 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.cobertos, b: Y1.entradas[0].t, texto: 'COBERTOS COM A SOBRA DOS ANOS ANTERIORES'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 195,7 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 208,4 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: Y2.entradas[0].t, texto: 'R$ 12,6 MI A MAIS, ATÉ SETEMBRO', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.zeros, b: T.soPagou, texto: 'OS ZEROS'},
    {a: T.soPagou, b: T.programas, texto: 'AGRICULTURA: SÓ A MANUTENÇÃO DA SECRETARIA'},
    {a: T.programas, b: T.zeroTres, texto: 'PEQUENO AGRICULTOR, TRATORES, AGRICULTURA FAMILIAR'},
    {a: T.zeroTres, b: T.repara, texto: 'R$ 0 NOS TRÊS ANOS', destaque: true},
    {a: T.festas, b: T.todoAno, texto: 'QUASE TODA A CULTURA VAI PARA FESTAS'},
    {a: T.todoAno, b: T.festa24, texto: 'TODO ANO: FESTA > O DOBRO DA ASSISTÊNCIA SOCIAL', destaque: true},
    {a: T.festa24, b: T.terminou, texto: 'FESTAS 2024: RESERVADO R$ 1,2 MI'},
    {a: T.terminou, b: T.seca, texto: 'FESTAS 2024: TERMINOU COM R$ 7,4 MI', destaque: true},
    {a: T.seca, b: T.emerg, texto: 'E TEM A SECA'},
    {a: T.emerg, b: T.doisMeses, texto: 'EMERGÊNCIA PELA ESTIAGEM: 2025 E 2026'},
    {a: T.doisMeses, b: T.melhorias, texto: 'DOIS MESES DE SÃO JOÃO EM 2026', destaque: true},
    {a: T.melhorias, b: T.naoUsou, texto: 'MELHORIAS SANITÁRIAS: MAIS DE R$ 1 MI RESERVADO POR ANO'},
    {a: T.naoUsou, b: T.embasa, texto: 'USOU R$ 0 NOS TRÊS ANOS', destaque: true},
    {a: T.embasa, b: T.pipa, texto: 'ÁGUA E ESGOTO DA CIDADE: EMBASA'},
    {a: T.pipa, b: T.esgoto, texto: 'O CARRO-PIPA SAI DA CONTA DE OBRAS'},
    {a: T.esgoto, b: T.tribunal, texto: 'ESGOTO NOVO: OBRA DO GOVERNO DO ESTADO'},
    {a: T.tribunal, b: T.kits, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.kits, b: T.parar, texto: 'KITS ESCOLARES: R$ 3,7 MI · DENUNCIADA'},
    {a: T.parar, b: T.cancelou, texto: 'O TRIBUNAL MANDOU PARAR', destaque: true},
    {a: T.cancelou, b: T.arCond, texto: 'A PREFEITURA CANCELOU'},
    {a: T.arCond, b: T.analisa, texto: 'AR-CONDICIONADO E ELETRÔNICOS: R$ 2,7 MI · SUSPENSA'},
    {a: T.analisa, b: T.nada, texto: 'ARTISTAS DO SÃO JOÃO 2026: EM ANÁLISE'},
    {a: T.nada, b: T.gastar, texto: 'NADA FOI JULGADO AINDA'},
    {a: T.gastar, b: T.festaLeva, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festaLeva, b: T.zeroFim, texto: 'A FESTA LEVA O DOBRO DA ASSISTÊNCIA...', destaque: true},
    {a: T.zeroFim, b: T.segue, texto: '...E AS MELHORIAS SANITÁRIAS FICAM NO ZERO?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.zeros, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.zeros, b: T.emerg, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.emerg, b: T.melhorias, texto: 'FONTE: A TARDE, 02/06/2025 E 07/04/2026'},
  {a: T.melhorias, b: T.embasa, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.embasa, b: T.tribunal, texto: 'FONTE: MP-BA (BAHIA NOTÍCIAS) · PAGAMENTOS SET/2026 · JORNAL GRANDE BAHIA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · MEDIDAS CAUTELARES · CONSULTA DE 07/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, 2) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  r.push({a: T.sobra + 0.5, b: T.cobertos + 1.2, p: soma(SOBRA_POS, [0, altTorre(SOBRA_V / ESCALA, 2) + 0.3, 0]), valor: 'SOBROU R$ 11 MI', sub: '2024', cor: CA[0]});
  // o zero: galpão cinza dos programas do agricultor
  r.push({a: T.zeroTres, b: T.repara - 0.1, p: soma(noAnel(idx('prog'), R_PREDIO), [0, 1.6, 0]), valor: 'R$ 0', sub: '2024 · 2025 · 2026'});
  r.push({a: T.soPagou + 0.3, b: T.programas, p: soma(noAnel(idx('agr'), R_PREDIO), [0, 1.6, 0]), valor: 'SÓ A SECRETARIA', cor: tema.acento});
  // festas x assistência social, nos três anos
  ['cul', 'ass'].forEach((id) =>
    [0, 1, 2].forEach((k) => {
      const v = valorDe(id, k);
      r.push({a: T.todoAno + 0.3 + k * 0.45, b: T.festa24, p: soma(posTorre(idx(id), k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: `${ANO_SUB[k]} · ${id === 'cul' ? 'FESTAS' : 'ASSISTÊNCIA'}`, cor: CA[k]});
    }),
  );
  const topoF = (v: number) => soma(FESTA_POS, [0, altTorre(v / ESC_FESTA, LADO) + 0.3, 0]);
  r.push(
    {a: T.festa24 + 0.5, b: T.terminou + 0.2, p: topoF(FESTA.res), valor: 'RESERVADO R$ 1,2 MI', sub: 'FESTAS 2024'},
    {a: T.terminou + 1.0, b: T.seca - 0.1, p: topoF(FESTA.usou), valor: 'R$ 7,4 MI', sub: 'FESTAS 2024 · GASTO', cor: CA[0]},
  );
  // melhorias sanitárias: reservado em cada ano, usado zero
  SAN.forEach((s, k) => {
    r.push({a: T.melhorias + 0.6 + k * 0.35, b: T.naoUsou, p: soma(s.pos, [0, altTorre(s.res / ESC_SAN, LADO) + 0.3, 0]), valor: fmtV(s.res), sub: `${s.ano} · RESERVADO`});
    r.push({a: T.naoUsou + 0.2 + k * 0.2, b: T.embasa - 0.1, p: soma(s.pos, [0, altTorre(s.res / ESC_SAN, LADO) + 0.3, 0]), valor: 'USOU R$ 0', sub: s.ano, cor: C.alerta});
  });
  r.push(
    {a: T.embasa + 0.2, b: T.tribunal - 0.1, p: soma(noAnel(idx('agu'), R_PREDIO), [0, 1.9, 0]), valor: 'EMBASA', sub: 'ÁGUA E ESGOTO DA CIDADE'},
    {a: T.pipa + 0.3, b: T.tribunal - 0.1, p: soma(noAnel(idx('obr'), R_PREDIO - 2.4), [0, 1.0, 0]), valor: 'CARRO-PIPA', sub: 'CONTA DE OBRAS'},
    {a: T.zeroFim, b: FIM + 1, p: soma(SAN[1].pos, [0, altTorre(SAN[1].res / ESC_SAN, LADO) + 0.3, 0]), valor: '?', cor: tema.acento},
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
  const festaK = vis(t, T.festa24, T.seca - 0.2);
  const sanK = vis(t, T.melhorias, T.embasa - 0.2);
  const escala = festaK > 0.01 ? 'AQUI, 1 PILHA = R$ 400 MIL · BRANCO = RESERVADO' : sanK > 0.01 ? 'AQUI, 1 PILHA = R$ 200 MIL · BRANCO = RESERVADO' : '1 PILHA = R$ 4 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, festaK, sanK);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {escK > 0.01 ? (
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${festaK > 0.01 || sanK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escala}</div>
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
  // rótulos que se encostam: procura um lugar livre (em cima; sem espaço por causa do chip, ao lado)
  const bate = (x: number, y: number, ate: number) => rots.slice(0, ate).some((o) => Math.abs(o.x - x) < 170 && Math.abs(o.y - y) < 66);
  for (let a = 0; a < rots.length; a++) {
    if (!bate(rots[a].x, rots[a].y, a)) continue;
    const {x: x0, y: y0} = rots[a];
    const cands: [number, number][] = [];
    for (let k = 1; k <= 4; k++) cands.push([x0, y0 - 68 * k]);
    for (const dx of [175, -175, 350, -350]) for (const dy of [0, -68, 68]) cands.push([x0 + dx, y0 + dy]);
    const ok = cands.find(([x, y]) => y >= 700 && y <= 1300 && x >= SEGURO.esq + 90 && x <= SEGURO.botoesX - 90 && !bate(x, y, a));
    if (ok) [rots[a].x, rots[a].y] = ok;
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
      <OffthreadVideo src={staticFile(`${P}/mapas/livramento.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra, T.falt25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.terminou, T.naoUsou, T.parar, T.suspensa];
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
  s.push({t: T.sobra + 0.2, f: 'ding', v: 0.16});
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  s.push({t: T.zeroTres, f: 'baque', v: 0.2});
  s.push({t: T.todoAno + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.terminou, f: 'subida', v: 0.18});
  s.push({t: T.naoUsou, f: 'baque', v: 0.2});
  s.push({t: T.pipa + 0.2, f: 'pop', v: 0.14});
  s.push({t: T.estado, f: 'pop', v: 0.16});
  [T.parar, T.cancelou, T.suspensa].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.18}));
  s.push({t: T.artistas + 0.5, f: 'tique', v: 0.14});
  s.push({t: T.festaLeva, f: 'pop', v: 0.18});
  s.push({t: T.zeroFim, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 7, 10.5, 13, T.gastou24 + 0.9, T.sobra + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, T.cobertos + 1.2, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[9].t + 0.9,
  T.ano26 + 1.0, T.falt26 + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[8].t + 0.9, Y2.entradas[10].t + 0.9,
  T.soPagou + 0.6, T.zeroTres + 0.6, T.festas + 0.4, T.todoAno + 1.6, T.pobres + 0.4, T.festa24 + 0.8, T.terminou + 1.4,
  T.seca + 1.2, T.emerg + 0.8, T.doisMeses + 0.8, T.melhorias + 1.6, T.naoUsou + 0.8, T.embasa + 0.5, T.pipa + 0.8, T.estado + 0.3,
  T.kits + 0.8, T.parar + 0.6, T.cancelou + 0.6, T.suspensa + 0.6, T.artistas + 0.9, T.nada + 0.5, T.gastar + 0.5, T.festaLeva + 0.6, T.zeroFim + 0.4, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoLivramento: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Livramento de Nossa Senhora" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Em emergência', 'pela seca.', 'Dois meses', 'de festa.'];
export const CapaOrcamentoLivramento: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · LIVRAMENTO`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 12 ? 104 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
