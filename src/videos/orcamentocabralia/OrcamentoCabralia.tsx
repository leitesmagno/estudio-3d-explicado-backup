import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Fosco, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
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
import {CaminhaoUniao, EnvelopeMes, EstradaRural, PlacaPoste} from './pecas';
import {PALAVRAS} from './palavras';

// 039. orçamento de santa cruz cabrália (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 (Paratinga v2).
// O Kit Mapas abre (voo até Santa Cruz Cabrália e o que a prefeitura arrecadou em 2024: projetos/039.../mapas/cabralia.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 3 milhões).
// Quando a voz fala um setor, as pilhas voam para a casinha. Casinhas na borda NA ORDEM DA FALA, câmera num sentido só;
// na virada de ano ela sobe e recomeça. Depois: convênios da União, ruas x estradas, festas x ajuda, Tribunal e a pergunta.
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE CABRÁLIA, todos do TCM-BA: audio/fontes.md. Plano: plano.md (v1, aprovado).

export const FPS = 30;
const AUDIO_SEG = 177.89; // voz Adam, pausas de 0,22 s, acelerada 1,27x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '039. orçamento de santa cruz cabrália';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  arrec24: quando('arrecadou 189'),
  gastou24: quando('Gastou 190'),
  falt24: quando('Quase 800'),
  zero24: quando('Agua e esgoto zero'),
  quemCuida: quando('quem cuida'),
  animal24: quando('Protecao animal zero'),
  nemExiste: quando('nem existe'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 204'),
  gastou25: quando('Gastou 211', 2), // a 1ª vez é o gancho ("Cabrália gastou 211 milhões")
  falt25: quando('6 milhoes e 400'),
  zero25: quando('Agua esgoto e protecao'),
  zeroNovo: quando('zero de novo'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 161'),
  gastou26: quando('Gastou 154'),
  compr: quando('ja comprometeu'),
  repara: quando('Agora repara'),
  previu: quando('previu quase'),
  escola: quando('escola creche'),
  creche: quando('creche esgoto'),
  esgoto: quando('esgoto e drenagem'),
  drenagem: quando('drenagem Chegaram'),
  chegaram: quando('Chegaram 400'),
  secretaria: quando('Na secretaria de obras'),
  pavim: quando('pavimentacao e drenagem'),
  tinha12: quando('tinha 12'),
  usou: quando('usou 1'),
  vicinais: quando('estradas vicinais'),
  tinha650: quando('tinha 650'),
  recebeu: quando('recebeu 9'),
  ruas26: quando('de novo ruas'),
  estr26: quando('estradas 7'),
  bandas: quando('Bandas palcos'),
  festa24: quando('2 milhoes em 2024'),
  festa26: quando('ja 1 milhao'),
  benef: quando('beneficios eventuais'),
  familias: quando('familias pobres'),
  m340: quando('ficaram em 340'),
  m240: quando('240 mil'),
  tribunal: quando('No Tribunal de Contas'),
  nove: quando('9 das 12'),
  atrasadas: quando('chegaram atrasadas'),
  processos: quando('dois processos'),
  transp: quando('transporte escolar'),
  nada: quando('Nada foi julgado'),
  seRua: quando('Se a rua'),
  brasilia: quando('dinheiro de Brasilia'),
  palco: quando('o palco nao'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 15 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'estrada' | 'camara' | 'banco' | 'culesp' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'est', nome: 'ESTRADAS DA ZONA RURAL', tipo: 'estrada'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E ESPORTE', tipo: 'culesp'},
  {id: 'tur', nome: 'TURISMO', tipo: 'palco', texto: 'TURISMO'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'ind', nome: 'ASSUNTOS INDÍGENAS', tipo: 'galpao', texto: 'INDÍGENAS'},
  {id: 'agu', nome: 'ÁGUA E ESGOTO', tipo: 'agua'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['agu', 'ani'];
const LARGOS = ['cul']; // cultura e esporte: duas peças lado a lado, pede mais espaço
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const prox = SETORES[i + 1];
    if (!prox) return;
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = ZERADOS.includes(prox.id);
    let passo = zeroAgora && zeroProx ? 0.09 : zeroAgora || zeroProx ? 0.115 : 0.125;
    if (LARGOS.includes(s.id) || LARGOS.includes(prox.id)) passo += 0.025;
    x += passo * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const tangente = (i: number): V3 => [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [1.0, 1.85, 1.42][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}; zero?: number};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    rotulo: '2024',
    falta: {t: T.falt24, v: 0.77},
    zero: T.zero24,
    entradas: [
      {s: 'edu', t: quando('Educacao 95'), v: 95.579},
      {s: 'sau', t: quando('Saude 30'), v: 30.755},
      {s: 'adm', t: quando('Administracao 23'), v: 23.651},
      {s: 'obr', t: quando('Obras e servicos'), v: 15.787},
      {s: 'cam', t: quando('Camara de Vereadores'), v: 5.358},
      {s: 'div', t: quando('Dividas 8'), v: 8.078},
      {s: 'cul', t: quando('Cultura e esporte'), v: 1.172},
      {s: 'tur', t: quando('Turismo'), v: 3.158},
      {s: 'ass', t: quando('Assistencia social'), v: 4.706},
      {s: 'agr', t: quando('Agricultura'), v: 0.374},
      {s: 'mam', t: quando('Meio ambiente'), v: 1.244},
      {s: 'ind', t: quando('Assuntos indigenas'), v: 0.422},
      {s: 'agu', t: T.zero24, v: 0},
      {s: 'ani', t: T.animal24, v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    rotulo: '2025',
    falta: {t: T.falt25, v: 6.369},
    zero: T.zero25,
    entradas: [
      {s: 'edu', t: quando('Educacao 102'), v: 102.009},
      {s: 'sau', t: quando('Saude 35'), v: 35.416},
      {s: 'adm', t: quando('Administracao 26'), v: 26.848},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 13.325},
      {s: 'est', t: quando('Estradas da zona rural'), v: 9.02},
      {s: 'cam', t: quando('Camara 6'), v: 6.677},
      {s: 'div', t: quando('Dividas 7'), v: 6.976},
      {s: 'cul', t: quando('Cultura e esporte', 2), v: 1.34},
      {s: 'tur', t: quando('Turismo', 2), v: 3.488},
      {s: 'ass', t: quando('Assistencia social', 2), v: 4.064},
      {s: 'agr', t: quando('Agricultura', 2), v: 0.691},
      {s: 'mam', t: quando('Meio ambiente', 2), v: 0.785},
      {s: 'ind', t: quando('Assuntos indigenas', 2), v: 0.534},
      {s: 'agu', t: T.zero25, v: 0},
      {s: 'ani', t: T.zero25 + 0.6, v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    gastou: T.gastou26,
    rotulo: '2026 · ATÉ SET',
    entradas: [
      {s: 'edu', t: quando('Educacao 68'), v: 68.404},
      {s: 'sau', t: quando('Saude 28'), v: 27.949},
      {s: 'adm', t: quando('Administracao 19'), v: 19.336},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 10.114},
      {s: 'est', t: quando('Estradas da zona rural', 2), v: 7.255},
      {s: 'cam', t: quando('Camara 5'), v: 5.79},
      {s: 'div', t: quando('Dividas 6'), v: 6.902},
      {s: 'cul', t: quando('Cultura e esporte', 3), v: 0.707},
      {s: 'tur', t: quando('Turismo', 3), v: 3.718},
      {s: 'ass', t: quando('Assistencia social', 3), v: 3.159},
      {s: 'agr', t: quando('Agricultura', 3), v: 0.393},
      {s: 'mam', t: quando('Meio ambiente', 3), v: 0.502},
      {s: 'ind', t: quando('Assuntos indigenas', 3), v: 0.256},
    ],
  },
];
// cada casinha sobe na 1ª vez que o setor é falado (as estradas só em 2025)
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS.map((y) => y.entradas.find((e) => e.s === s.id)?.t).find((x) => x !== undefined)!]));
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
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;
const LADO = 3;
const ESCALA = 3; // 1 pilha = R$ 3 milhões
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

// o dinheiro dos anos sai da mesa quando começam os achados (o miolo vira palco dos achados)
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 3.65];
const COMPR = 66.88; // empenhado 221,36 − liquidado 154,49 (conta própria, fontes.md)

// ---------- Os achados, no miolo (aqui 1 pilha = R$ 1 milhão) ----------
const ESC_ACH = 1;
const UNIAO = {prev: 24.635, chegou: 0.398};
const POS_CAMINHAO: V3 = [0.5, 0, -0.05];
const POS_UNIAO: V3 = [-2.45, 0, 0.15];
const CAIXAS = [
  {texto: 'ESCOLA', t: T.escola, valor: 'R$ 6,8 MI'},
  {texto: 'CRECHE', t: T.creche, valor: 'R$ 3 MI'},
  {texto: 'ESGOTO', t: T.esgoto, valor: 'R$ 3 MI'},
  {texto: 'DRENAGEM', t: T.drenagem, valor: 'R$ 5,7 MI'},
];
const GAV = {
  rua25: [-1.95, 0, 1.25] as V3,
  rua26: [-0.95, 0, 1.25] as V3,
  est25: [0.95, 0, 1.25] as V3,
  est26: [1.95, 0, 1.25] as V3,
  fes24: [-1.95, 0, -1.3] as V3,
  fes26: [-0.95, 0, -1.3] as V3,
  ben24: [0.95, 0, -1.3] as V3,
  ben26: [1.95, 0, -1.3] as V3,
};
type Gav = keyof typeof GAV;
// prev = previsto (tracejado); usou = o que foi usado (sólido)
const OBRA: Record<Gav, {prev?: number; usou: number}> = {
  rua25: {prev: 11.936, usou: 1.765},
  rua26: {usou: 1.668},
  est25: {prev: 0.649, usou: 9.02},
  est26: {usou: 7.255},
  fes24: {usou: 2.093},
  fes26: {usou: 1.94},
  ben24: {usou: 0.338},
  ben26: {usou: 0.243},
};
const CAMINHAO_VIS = (t: number) => vis(t, T.repara + 0.3, T.secretaria - 0.1) + vis(t, T.brasilia - 0.3, FIM + 2);
const OBRAS_VIS = (t: number) => vis(t, T.secretaria + 0.2, T.bandas - 0.2) + vis(t, T.seRua, FIM + 2);
const FESTAS_VIS = (t: number) => vis(t, T.bandas - 0.1, T.tribunal - 0.1) + vis(t, T.palco - 0.3, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.6];
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const NO_PRAZO = ['AGO', 'SET', 'NOV'];
const posEnvelope = (i: number): V3 => [-3.03 + i * 0.55, 0, 1.15];
const PASTAS: {titulo: string; valor?: string; t: number}[] = [
  {titulo: 'CONTAS ATRASADAS', valor: '2025', t: T.processos},
  {titulo: 'CONTAS ATRASADAS', valor: '2025', t: T.processos + 0.3},
  {titulo: 'TRANSPORTE ESCOLAR', valor: 'DENÚNCIA', t: T.transp},
];
const posPasta = (i: number): V3 => [-1.75 + i * 1.75, 0, -0.75];
const TRIB_VIS = (t: number) => vis(t, T.tribunal - 0.1, T.seRua - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  if (some > 0.01) {
    // o que foi gasto a mais: torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.12, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9)) * k, LADO, C.alerta));
    });
    // 2026: o que já foi comprometido (empenhado e ainda não liquidado), tracejado rosa
    const kc = janela(t, T.compr, T.repara - 0.3, 0.5) * some;
    if (kc > 0.01) fantasmas.push(...torre(FALTA_POS, (COMPR / ESCALA) * rampa(t, T.compr, T.compr + 1.0) * kc, LADO, CA[2]));
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
  // convênios da União: previsto (tracejado) e o que chegou (sólido)
  const ku = vis(t, T.previu, T.secretaria - 0.1);
  if (ku > 0.01) {
    fantasmas.push(...torre(POS_UNIAO, (UNIAO.prev / ESC_ACH) * rampa(t, T.previu, T.previu + 1.0) * ku, LADO, tema.objetoClaro));
    const kk = rampa(t, T.chegaram, T.chegaram + 0.8) * ku;
    if (kk > 0.01) solidas.push(...torre(POS_UNIAO, Math.max(0.12, UNIAO.chegou / ESC_ACH) * kk, LADO, C.ouro));
  }
  // gavetas: tracejado (previsto) e sólido (usado)
  const par = (g: Gav, vk: number, tPrev: number | null, tUsou: number, cor: string) => {
    if (vk <= 0.01) return;
    const o = OBRA[g];
    if (o.prev && tPrev !== null) {
      const r = rampa(t, tPrev, tPrev + 0.6) * vk;
      if (r > 0.01) fantasmas.push(...torre(GAV[g], (o.prev / ESC_ACH) * r, LADO, tema.objetoClaro));
    }
    const u = rampa(t, tUsou, tUsou + 1.1) * vk;
    if (u > 0.01) solidas.push(...torre(GAV[g], Math.max(0.12, o.usou / ESC_ACH) * u, LADO, cor));
  };
  const ob = OBRAS_VIS(t);
  par('rua25', ob, T.tinha12, T.usou, CA[1]);
  par('est25', ob, T.tinha650, T.recebeu, CA[1]);
  par('rua26', ob, null, T.ruas26 + 0.3, CA[2]);
  par('est26', ob, null, T.estr26, CA[2]);
  const fe = FESTAS_VIS(t);
  par('fes24', fe, null, T.festa24, CA[0]);
  par('fes26', fe, null, T.festa26, CA[2]);
  par('ben24', fe, null, T.m340, CA[0]);
  par('ben26', fe, null, T.m240, CA[2]);
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
  const aceso = Math.max(0, ...ditas);
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  const tg = tangente(i);
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, SOBE.obr - 0.5, SOBE.obr + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - SOBE.obr))} />;
    case 'estrada':
      return <EstradaRural tema={tema} pos={p} rotY={rot} sobe={sobe} aceso={aceso} escala={0.5} />;
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
    case 'culesp':
      // cultura (colunas) e esporte (campo de futebol de verdade, peça 'quadra' sem alteração) lado a lado
      return (
        <group>
          <PredioTexto tema={tema} pos={soma(p, [-tg[0] * 0.85, 0, -tg[2] * 0.85])} rotY={rot} escala={0.42} sobe={sobe} aceso={aceso} texto="CULTURA" tipo="colunas" />
          <PredioTexto tema={tema} pos={soma(p, [tg[0] * 0.9, 0, tg[2] * 0.9])} rotY={rot} escala={0.42} sobe={rampa(t, SOBE.cul - 0.05, SOBE.cul + 0.75)} aceso={aceso} texto="ESPORTE" tipo="quadra" />
        </group>
      );
    case 'arvores': {
      if (sobe < 0.02) return null;
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

// borda de mar numa parte da mesa (Cabrália é litoral): faixa fina, sem cruzar a mesa
const Mar: React.FC<{tema: Tema}> = ({tema}) => {
  const C = coresOI(tema);
  return (
    <mesh position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <ringGeometry args={[8.45, 8.98, 96, 1, 0.55 * Math.PI, 0.55 * Math.PI]} />
      <Fosco cor={C.agua} aspereza={0.9} />
    </mesh>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const ob = OBRAS_VIS(t);
  const fe = FESTAS_VIS(t);
  const tv = TRIB_VIS(t);
  const iAgu = idx('agu');
  const pAgu = soma(noAnel(iAgu, R_PREDIO - 1.25), [tangente(iAgu)[0] * 0.75, 0, tangente(iAgu)[2] * 0.75]);
  const cam = CAMINHAO_VIS(t);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      <Mar tema={tema} />
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
      {/* água e esgoto: quem cuida é a Embasa, do Estado */}
      <PlacaPoste tema={tema} pos={pAgu} rotY={ang(iAgu) + Math.PI} escala={0.75} sobe={rampa(t, T.quemCuida - 0.2, T.quemCuida + 0.5)} linhas={['EMBASA', 'DO ESTADO']} aceso={Math.max(janela(t, T.quemCuida, T.animal24, 0.4), janela(t, T.zero25, T.ano26, 0.4))} />

      {/* convênios da União: o caminhão com as caixas que não chegaram */}
      <CaminhaoUniao
        tema={tema}
        pos={POS_CAMINHAO}
        rotY={0}
        escala={0.75}
        sobe={cam}
        aceso={Math.max(janela(t, T.previu, T.secretaria - 0.2, 0.4), janela(t, T.brasilia, FIM + 1, 0.4))}
        caixas={CAIXAS.map((c) => ({texto: c.texto, entra: rampa(t, c.t - 0.1, c.t + 0.4), cheia: 0}))}
      />

      {/* secretaria de obras: ruas x estradas */}
      <BaseGaveta tema={tema} pos={[-1.45, 0, 1.25]} sobe={ob} texto="PAVIMENTAÇÃO E DRENAGEM" aceso={Math.max(janela(t, T.pavim, T.vicinais, 0.4), janela(t, T.ruas26, T.estr26, 0.4), janela(t, T.seRua, T.brasilia + 0.6, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.45, 0, 1.25]} sobe={ob} texto="ESTRADAS VICINAIS" aceso={Math.max(janela(t, T.vicinais, T.ruas26, 0.4), janela(t, T.estr26, T.bandas, 0.4))} />

      {/* festas x ajuda de emergência */}
      <BaseGaveta tema={tema} pos={[-1.45, 0, -1.3]} sobe={fe} texto="BANDAS, PALCOS E FESTAS" aceso={Math.max(janela(t, T.bandas, T.benef, 0.4), janela(t, T.palco, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.45, 0, -1.3]} sobe={fe} texto="BENEFÍCIOS EVENTUAIS" aceso={janela(t, T.benef, T.tribunal, 0.4)} />
      {[0, 1, 2].map((k) => {
        const a = rampa(t, T.familias + k * 0.15, T.familias + k * 0.15 + 0.4) * (1 - rampa(t, T.tribunal - 0.3, T.tribunal + 0.1));
        if (a < 0.02) return null;
        return <Boneco key={k} tema={tema} pos={[2.95, 0.06, -1.75 + k * 0.42]} rotY={-Math.PI / 2} escala={0.3 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.25 + 0.2 * k)} />;
      })}

      {/* o Tribunal, os 12 envelopes de 2025 e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={tv} aceso={janela(t, T.tribunal, T.seRua, 0.5)} />
      {MESES.map((m, i) => {
        const noPrazo = NO_PRAZO.includes(m);
        const ts = T.atrasadas + 0.05 + i * 0.09;
        return (
          <EnvelopeMes
            key={m}
            tema={tema}
            pos={posEnvelope(i)}
            escala={0.85}
            sobe={rampa(t, T.nove - 0.2 + i * 0.05, T.nove + 0.3 + i * 0.05) * tv}
            mes={m}
            selo={rampa(t, ts, ts + 0.4)}
            textoSelo={noPrazo ? 'NO PRAZO' : 'ATRASADA'}
            corSelo={noPrazo ? mistura(CA[1], tema.texto, 0.2) : C.alerta}
          />
        );
      })}
      {PASTAS.map((pa, i) => (
        <PastaProcesso
          key={i}
          tema={tema}
          pos={posPasta(i)}
          rotY={(1 - i) * 0.1}
          escala={0.72}
          sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * tv}
          titulo={pa.titulo}
          valor={pa.valor}
          carimbo={rampa(t, T.nada + i * 0.12, T.nada + 0.4 + i * 0.12)}
          textoCarimbo="SEM JULGAMENTO"
          corCarimbo={mistura(C.ouro, tema.texto, 0.35)}
          aceso={janela(t, pa.t, T.seRua - 0.1, 0.4)}
        />
      ))}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.2, 7.2, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 9 ? 1.1 : 1) * (e.s === 'cul' ? 1.15 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
};
const [Y0, Y1, Y2] = ANOS;
const iAgu = idx('agu');
const iAni = idx('ani');
const OBRA_E = (x: number, perto = 1) => E([x, 1.2, 1.3], 4.6 * perto, 5.2 * perto, [x > 0 ? 0.05 : -0.05, 0.75, 1]);
const FESTA_E = (x: number, perto = 1) => E([x, 0.9, -1.3], 4.6 * perto, 5.0 * perto, [x > 0 ? 0.05 : -0.05, 0.75, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, DE_CIMA()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.falt24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.zero24 - 0.2)]},
  {ini: T.zero24 - 0.1, arco: 0.04, chaves: [[T.zero24 - 0.1, OLHA_SETOR(iAgu, 1.15)], [T.animal24 - 0.4, OLHA_SETOR(iAgu + 0.15, 1.12)], [T.animal24 + 0.1, OLHA_SETOR(iAni, 1.15)], [T.ano25 - 0.2, OLHA_SETOR(iAni, 1.2)]]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.zero25 - 0.2, 1.12)]},
  {ini: T.zero25 - 0.1, arco: 0.04, chaves: [[T.zero25 - 0.1, OLHA_SETOR(iAgu + 0.5, 1.3)], [T.ano26 - 0.2, OLHA_SETOR(iAgu + 0.5, 1.35)]]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.compr + 0.4, E([0, 0.8, 1.6], 9.6, 7.6, [0.08, 1.15, 1])], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // convênios da União: sobe e mergulha no caminhão
  {ini: T.repara - 0.1, arco: 0.04, chaves: [[T.repara - 0.1, DE_CIMA(-0.1)], [T.previu - 0.3, E([-0.7, 0.9, 0.2], 7.2, 5.8, [-0.05, 0.95, 1])], [T.escola - 0.2, E([0.2, 0.7, 0.1], 5.4, 4.6, [0.05, 0.8, 1])], [T.chegaram, E([-1.0, 0.8, 0.2], 7.0, 5.6, [-0.02, 0.9, 1])], [T.secretaria - 0.2, E([-0.9, 0.8, 0.2], 7.2, 5.8, [0, 0.9, 1])]]},
  // secretaria de obras: ruas (esquerda) e estradas (direita)
  {
    ini: T.secretaria - 0.1,
    arco: 0.03,
    chaves: [
      [T.secretaria - 0.1, E([0, 0.6, 1.2], 8.4, 6.6, [0, 1.25, 1])],
      [T.pavim - 0.2, OBRA_E(-1.45)],
      [T.vicinais - 0.4, OBRA_E(-1.3)],
      [T.vicinais + 0.2, OBRA_E(1.45)],
      [T.ruas26 - 0.3, OBRA_E(1.3)],
      [T.ruas26 + 0.2, E([0, 1.2, 1.3], 7.2, 6.0, [0.05, 0.85, 1])],
      [T.bandas - 0.3, E([0.2, 1.2, 1.3], 7.4, 6.2, [0.1, 0.85, 1])],
    ],
  },
  // festas x ajuda: palco (esquerda) e benefícios (direita)
  {
    ini: T.bandas - 0.2,
    arco: 0.03,
    chaves: [
      [T.bandas - 0.2, FESTA_E(-1.45, 1.05)],
      [T.benef - 0.4, FESTA_E(-1.3, 1.05)],
      [T.benef + 0.2, FESTA_E(1.45, 1.05)],
      [T.m240 + 0.3, E([0, 1.0, -1.3], 7.2, 6.0, [0.05, 0.85, 1])],
      [T.tribunal - 0.3, E([0.2, 1.0, -1.3], 7.4, 6.2, [0.1, 0.85, 1])],
    ],
  },
  // tribunal: envelopes na frente, pastas atrás
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.2], 8.6, 6.8, [0, 0.9, 1])],
      [T.nove - 0.1, E([0, 0.5, 1.2], 7.2, 4.6, [0, 0.7, 1])],
      [T.processos - 0.3, E([0.1, 0.5, 1.2], 7.2, 4.6, [0.03, 0.7, 1])],
      [T.processos + 0.3, E([-0.6, 1.0, -0.6], 5.6, 5.0, [-0.05, 0.7, 1])],
      [T.transp, E([1.75, 1.0, -0.6], 4.6, 4.4, [0.08, 0.65, 1])],
      [T.nada, E([0, 1.0, -0.4], 6.8, 5.6, [0.05, 0.75, 1])],
      [T.seRua - 0.2, E([0, 1.0, -0.4], 7.0, 5.8, [0.08, 0.78, 1])],
    ],
  },
  // a pergunta: a rua que espera, o caminhão de Brasília e o palco
  {
    ini: T.seRua - 0.1,
    arco: 0.04,
    chaves: [
      [T.seRua - 0.1, OBRA_E(-1.45, 1.15)],
      [T.brasilia - 0.2, E([0.3, 0.7, 0.2], 6.4, 5.2, [0, 0.95, 1])],
      [T.palco - 0.2, FESTA_E(-1.45, 1.1)],
      [T.segue, E([0, 0.8, 0], 8.6, 7.2, [0.05, 1.1, 1])],
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
  [0, 'SANTA CRUZ CABRÁLIA · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.secretaria, 'NA SECRETARIA DE OBRAS'],
  [T.bandas, 'FESTAS X AJUDA DE EMERGÊNCIA'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.seRua, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 100) * 10} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falt24, texto: 'GASTOU EM 2024: R$ 190,3 MILHÕES'},
    {a: T.falt24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 770 MIL A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.zero24, b: T.quemCuida, texto: 'ÁGUA E ESGOTO: R$ 0', destaque: true},
    {a: T.quemCuida, b: T.animal24, texto: 'NA CIDADE, QUEM CUIDA É A EMBASA, DO ESTADO'},
    {a: T.animal24, b: T.nemExiste, texto: 'PROTEÇÃO ANIMAL: R$ 0', destaque: true},
    {a: T.nemExiste, b: T.ano25, texto: 'NEM EXISTE UMA LINHA PARA ELA NO ORÇAMENTO', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 204,8 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 211,2 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'R$ 6,4 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.zero25, b: T.zeroNovo, texto: 'ÁGUA, ESGOTO E PROTEÇÃO ANIMAL'},
    {a: T.zeroNovo, b: T.ano26, texto: 'R$ 0 DE NOVO', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 161 MI'},
    {a: T.gastou26, b: T.compr, texto: 'GASTOU: R$ 154,5 MI (PREFEITURA + CÂMARA)'},
    {a: T.compr, b: Y2.entradas[0].t, texto: 'E JÁ COMPROMETEU MAIS R$ 67 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    const ents = y.entradas.filter((e) => !ZERADOS.includes(e.s));
    ents.forEach((e, k) => {
      const prox = k + 1 < ents.length ? ents[k + 1].t : (y.zero ?? y.fim);
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.previu, texto: 'AGORA REPARA'},
    {a: T.previu, b: T.chegaram, texto: '2025: PREVIU R$ 24,6 MI DA UNIÃO PARA OBRAS'},
    {a: T.chegaram, b: T.secretaria, texto: 'CHEGARAM R$ 400 MIL', destaque: true},
    {a: T.secretaria, b: T.pavim, texto: 'SECRETARIA DE OBRAS: O DINHEIRO MUDOU DE LUGAR'},
    {a: T.pavim, b: T.usou, texto: 'RUAS 2025: PREVISTO R$ 11,9 MI'},
    {a: T.usou, b: T.vicinais, texto: 'USOU R$ 1,8 MI', destaque: true},
    {a: T.vicinais, b: T.recebeu, texto: 'ESTRADAS VICINAIS 2025: PREVISTO R$ 650 MIL'},
    {a: T.recebeu, b: T.ruas26, texto: 'RECEBEU R$ 9 MI', destaque: true},
    {a: T.ruas26, b: T.estr26, texto: '2026 ATÉ SET: RUAS, R$ 1,7 MI'},
    {a: T.estr26, b: T.bandas, texto: '2026 ATÉ SET: ESTRADAS, R$ 7,3 MI', destaque: true},
    {a: T.bandas, b: T.festa24, texto: 'BANDAS, PALCOS E FESTAS'},
    {a: T.festa24, b: T.festa26, texto: '2024: R$ 2,1 MI'},
    {a: T.festa26, b: T.benef, texto: '2026, ATÉ SETEMBRO: JÁ R$ 1,9 MI', destaque: true},
    {a: T.benef, b: T.m340, texto: 'BENEFÍCIOS EVENTUAIS: AJUDA DE EMERGÊNCIA'},
    {a: T.m340, b: T.tribunal, texto: '2024: R$ 340 MIL · 2026: R$ 240 MIL', destaque: true},
    {a: T.tribunal, b: T.nove, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.nove, b: T.processos, texto: '2025: 9 DAS 12 CONTAS MENSAIS ATRASADAS', destaque: true},
    {a: T.processos, b: T.transp, texto: 'VIRARAM DOIS PROCESSOS'},
    {a: T.transp, b: T.nada, texto: 'TRANSPORTE ESCOLAR: DENÚNCIA'},
    {a: T.nada, b: T.seRua, texto: 'NADA FOI JULGADO AINDA'},
    {a: T.seRua, b: T.palco, texto: 'SE A RUA ESPERA O DINHEIRO DE BRASÍLIA...', destaque: true},
    {a: T.palco, b: T.segue, texto: '...POR QUE O PALCO NÃO ESPERA?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.zero24, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.zero24, b: T.ano25, texto: 'ÁGUA E ESGOTO: OPERADORA EMBASA (ANA, ATLAS ESGOTOS)'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · LIQUIDADO · COMPROMETIDO = EMPENHADO'},
  {a: T.repara, b: T.secretaria, texto: 'FONTE: ANEXO 10 DE 2025 (PREVISTO X ARRECADADO), TCM-BA'},
  {a: T.secretaria, b: T.tribunal, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.tribunal, b: T.seRua, texto: 'FONTE: E-TCM E TCM-BA · DECISÕES › AUDITORIA · 07/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      const i = idx(e.s);
      if (e.v <= 0) {
        r.push({a: e.t + 0.5, b: e.t + 3.2, p: soma(noAnel(i, R_PREDIO), [0, 1.9, 0]), valor: 'R$ 0', sub: ANO_SUB[yi], cor: tema.textoSuave});
        return;
      }
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.entradas[0].t + 0.6, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  r.push({a: T.compr + 0.5, b: ANOS[2].entradas[0].t + 0.6, p: soma(FALTA_POS, [0, altTorre(COMPR / ESCALA, LADO) + 0.3, 0]), valor: '+ R$ 67 MI', sub: 'JÁ COMPROMETIDO', cor: CA[2]});
  // convênios
  const topoU = soma(POS_UNIAO, [0, altTorre(UNIAO.prev / ESC_ACH, LADO) + 0.3, 0]);
  r.push(
    {a: T.previu + 0.6, b: T.secretaria - 0.1, p: topoU, valor: 'PREVISTO R$ 24,6 MI', sub: 'DA UNIÃO · 2025'},
    {a: T.chegaram + 0.4, b: T.secretaria - 0.1, p: soma(POS_UNIAO, [0, 0.45, 0.6]), valor: 'CHEGARAM R$ 400 MIL', cor: C.ouro},
  );
  CAIXAS.forEach((c, k) => r.push({a: c.t + 0.2, b: T.chegaram, p: soma(POS_CAMINHAO, [(-0.95 + k * 0.53) * 0.75 + 0.0, 1.05 + (k % 2) * 0.35, 0]), valor: c.valor, sub: c.texto}));
  // gavetas
  const topo = (g: Gav, v: number) => soma(GAV[g], [0, altTorre(Math.max(v, OBRA[g].prev ?? 0) / ESC_ACH, LADO) + 0.3, 0]);
  r.push(
    {a: T.tinha12 + 0.4, b: T.usou + 0.2, p: topo('rua25', 0), valor: 'PREVISTO R$ 11,9 MI', sub: '2025 · RUAS'},
    {a: T.usou + 0.9, b: T.bandas - 0.2, p: soma(GAV.rua25, [0, 1.05, 0.2]), valor: 'USOU R$ 1,8 MI', sub: '2025 · RUAS', cor: CA[1]},
    {a: T.tinha650 + 0.3, b: T.recebeu + 0.2, p: soma(GAV.est25, [0, 0.9, 0]), valor: 'PREVISTO R$ 650 MIL', sub: '2025 · ESTRADAS'},
    {a: T.recebeu + 1.0, b: T.bandas - 0.2, p: topo('est25', OBRA.est25.usou), valor: 'RECEBEU R$ 9 MI', sub: '2025 · ESTRADAS', cor: CA[1]},
    {a: T.ruas26 + 0.8, b: T.bandas - 0.2, p: topo('rua26', OBRA.rua26.usou), valor: 'R$ 1,7 MI', sub: '2026 · RUAS', cor: CA[2]},
    {a: T.estr26 + 0.6, b: T.bandas - 0.2, p: topo('est26', OBRA.est26.usou), valor: 'R$ 7,3 MI', sub: '2026 · ESTRADAS', cor: CA[2]},
    {a: T.festa24 + 0.6, b: T.tribunal - 0.1, p: topo('fes24', OBRA.fes24.usou), valor: 'R$ 2,1 MI', sub: '2024 · FESTAS', cor: CA[0]},
    {a: T.festa26 + 0.6, b: T.tribunal - 0.1, p: topo('fes26', OBRA.fes26.usou), valor: 'R$ 1,9 MI', sub: '2026 · FESTAS', cor: CA[2]},
    {a: T.m340 + 0.5, b: T.tribunal - 0.1, p: topo('ben24', 0), valor: 'R$ 340 MIL', sub: '2024 · AJUDA', cor: CA[0]},
    {a: T.m240 + 0.4, b: T.tribunal - 0.1, p: topo('ben26', 0), valor: 'R$ 240 MIL', sub: '2026 · AJUDA', cor: CA[2]},
    {a: T.seRua + 0.4, b: FIM + 1, p: topo('rua25', 0), valor: '?', cor: tema.acento},
    {a: T.brasilia + 0.4, b: FIM + 1, p: soma(POS_CAMINHAO, [0, 1.6, 0]), valor: '?', cor: tema.acento},
    {a: T.palco + 0.3, b: FIM + 1, p: topo('fes26', OBRA.fes26.usou), valor: '?', cor: tema.acento},
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
  const achK = vis(t, T.previu, T.tribunal - 0.2);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || achK > 0.01 ? (
        <div style={{opacity: Math.min(1, Math.max(placarK, achK)), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${achK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{achK > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI · BRANCO = PREVISTO' : '1 PILHA = R$ 3 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/cabralia.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falt24, T.falt25, T.compr, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.chegaram, T.usou, T.recebeu, T.festa26, T.nada];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: ZERADOS.includes(e.s) ? 0.1 : 0.18})));
  [T.zero24 + 0.9, T.animal24 + 0.9, T.zeroNovo].forEach((t) => s.push({t, f: 'baque', v: 0.2}));
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  s.push({t: T.compr + 0.3, f: 'baque', v: 0.2});
  s.push({t: T.previu + 0.3, f: 'subida', v: 0.14});
  CAIXAS.forEach((c) => s.push({t: c.t, f: 'tique', v: 0.12}));
  s.push({t: T.chegaram + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.usou, f: 'tique', v: 0.16});
  s.push({t: T.recebeu, f: 'subida', v: 0.18});
  s.push({t: T.ruas26 + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.estr26, f: 'pop', v: 0.16});
  [T.festa24, T.festa26].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  [T.m340, T.m240].forEach((t) => s.push({t, f: 'tique', v: 0.14}));
  s.push({t: T.atrasadas + 0.1, f: 'tique', v: 0.14});
  [T.processos, T.transp].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.14}));
  s.push({t: T.nada + 0.35, f: 'impacto', v: 0.18});
  s.push({t: T.brasilia, f: 'pop', v: 0.16});
  s.push({t: T.palco, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 5.5, 8.6, 10.2, T.gastou24 + 0.9, T.falt24 + 0.9,
  ...Y0.entradas.slice(0, 12).map((e) => e.t + 0.9),
  T.zero24 + 1.0, T.quemCuida + 0.8, T.animal24 + 0.8, T.nemExiste + 0.6,
  T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[4].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[12].t + 0.9, T.zeroNovo + 0.4,
  T.ano26 + 1.0, T.compr + 1.0, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[7].t + 0.9, Y2.entradas[12].t + 0.9,
  T.repara + 0.6, T.previu + 1.0, T.drenagem + 0.3, T.chegaram + 0.9,
  T.secretaria + 0.8, T.tinha12 + 0.8, T.usou + 1.0, T.tinha650 + 0.6, T.recebeu + 1.2, T.ruas26 + 1.0, T.estr26 + 1.0,
  T.bandas + 0.6, T.festa26 + 0.9, T.familias + 0.6, T.m240 + 0.8,
  T.tribunal + 0.6, T.nove + 0.6, T.atrasadas + 1.2, T.processos + 0.6, T.transp + 0.6, T.nada + 0.8,
  T.seRua + 0.6, T.brasilia + 0.6, T.palco + 0.5, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCabralia: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Santa Cruz Cabrália" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['A rua', 'espera.', 'O palco', 'não.'];
export const CapaOrcamentoCabralia: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · SANTA CRUZ CABRÁLIA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
