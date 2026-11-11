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
import {ArvoreRedonda, BalancaJustica, CasaMini, CofreFGTS, Martelo} from '../../pecas';
import {BancoDivida, CaixaFundef, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from '../orcamentoparatinga/pecas';
import {CanalSeco, CelularManchete, PilhaPastas} from './pecas';
import {PALAVRAS} from './palavras';

// 051. orçamento de guanambi (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 (Paratinga) com as melhorias do 047 e do 041.
// O Kit Mapas abre (voo até Guanambi e o que a prefeitura arrecadou em 2024: projetos/051.../mapas/guanambi.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 moeda = R$ 500 mil, 1 pilha = R$ 5 mi,
// porque Guanambi gasta quase o triplo de Paratinga). Na palavra de cada setor, as pilhas voam do cofre para a casinha. As casinhas
// ficam na borda NA ORDEM DA FALA; a câmera anda sempre no mesmo sentido e, na virada de ano, sobe e recomeça.
// Depois: festas x assistência, o Canal do Belém (reservado x gasto), o pedido do seguidor (precatórios do Fundef: dívida x juros,
// a regra dos 6 de cada 10, a manchete, a balança que volta ao meio) e o Tribunal. Sem porcentagem e sem nome de gestor.
// SÓ DADOS DE GUANAMBI: audio/fontes.md. Plano: plano.md (v1, aprovado em 07/11/2026).

export const FPS = 30;
const AUDIO_SEG = 176.64; // voz Google Algenib, speakingRate 1,3 + pausas 0,28 s + atempo 1,15
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '051. orçamento de guanambi';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 405'),
  gastou24: quando('Gastou 416'),
  falt24: quando('Quase 11'),
  contratos: quando('maior parte em contratos'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 456'),
  emprestimo: quando('contando um emprestimo'),
  gastou25: quando('Gastou 474', 2), // a 1ª vez é a frase de abertura ("gastou 474 milhões em 2025")
  falt25: quando('Sao 17'),
  sairam: quando('esses contratos sairam'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 380'),
  com29: quando('com quase 29'),
  gastou26: quando('Ja gastou'),
  comprometeu: quando('comprometeu mais'),
  defesa: quando('Defesa civil'),
  nenhum: quando('nenhum real gasto'),
  animal: quando('Protecao animal'),
  nemAparece: quando('nem aparece'),
  repara: quando('Repara em'),
  reservados: quando('5 milhoes e 600'),
  levaram: quando('levaram 13'),
  dobro: quando('Quase o dobro'),
  canal: quando('drenagem do Canal'),
  canalRes: quando('750 reservados'),
  nadaGasto: quando('e nada gasto'),
  pedido: quando('Agora o pedido'),
  precatorio: quando('Precatorio e'),
  uniao: quando('A Uniao deixou'),
  agencia: quando('Segundo a Agencia'),
  parcelas: quando('tres parcelas'),
  primeira: quando('A primeira chegou'),
  nota: quando('Pela nota'),
  divida: quando('sao a divida'),
  juros: quando('juros pelo atraso'),
  lei: quando('A lei manda'),
  seisDez: quando('6 de cada'),
  rateou: quando('rateou 7'),
  hora: quando('95'),
  livres: quando('Os juros ficaram'),
  site: quando('O site'),
  masEsse: quando('mas esse e'),
  razao: quando('E quem tem'),
  supremo: quando('O Supremo'),
  projeto: quando('Mas um projeto'),
  seriam: quando('Ai seriam'),
  decide: quando('Quem decide'),
  tribunal: quando('No Tribunal'),
  processos: quando('22 processos'),
  gastar: quando('Gastar nao'),
  festaCresce: quando('por que a festa'),
  canalFim: quando('e o canal'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 14 lugares na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | 'canil' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA E FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'amb', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'dc', nome: 'DEFESA CIVIL', tipo: 'casinha', texto: 'DEFESA CIVIL'},
  {id: 'pa', nome: 'PROTEÇÃO ANIMAL', tipo: 'canil'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['dc', 'pa'];
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.1 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroProx ? 0.118 * Math.PI : 0.138 * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.75, 1.35][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.45][yi];
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
    total: 416.542,
    rotulo: '2024',
    falta: {t: T.falt24, v: 10.872},
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 138.059},
      {s: 'sau', t: quando('Saude'), v: 129.018},
      {s: 'adm', t: quando('Administracao'), v: 16.557},
      {s: 'obr', t: quando('Obras e servicos'), v: 54.492},
      {s: 'cam', t: quando('Camara'), v: 10.121},
      {s: 'div', t: quando('Dividas'), v: 21.228},
      {s: 'cul', t: quando('Cultura'), v: 11.134},
      {s: 'ass', t: quando('Assistencia social'), v: 7.665},
      {s: 'agu', t: quando('Agua e saneamento'), v: 12.93},
      {s: 'agr', t: quando('Agricultura'), v: 4.297},
      {s: 'esp', t: quando('Esporte'), v: 0.559},
      {s: 'amb', t: quando('Meio ambiente'), v: 1.879},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 474.195,
    rotulo: '2025',
    falta: {t: T.falt25, v: 17.275},
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 163.401},
      {s: 'sau', t: quando('Saude', 2), v: 144.937},
      {s: 'adm', t: quando('Administracao', 2), v: 19.98},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 61.238},
      {s: 'cam', t: quando('Camara', 2), v: 12.991},
      {s: 'div', t: quando('Dividas', 2), v: 25.5},
      {s: 'cul', t: quando('Cultura', 2), v: 16.453},
      {s: 'ass', t: quando('Assistencia social', 2), v: 7.423},
      {s: 'agu', t: quando('Agua e saneamento', 2), v: 1.871},
      {s: 'agr', t: quando('Agricultura', 2), v: 3.283},
      {s: 'esp', t: quando('Esporte', 2), v: 0.259},
      {s: 'amb', t: quando('Meio ambiente', 2), v: 2.097},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.defesa,
    gastou: T.gastou26,
    total: 365.727,
    rotulo: '2026 · ATÉ SET',
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 134.211},
      {s: 'sau', t: quando('Saude', 3), v: 107.013},
      {s: 'adm', t: quando('Administracao', 3), v: 15.394},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 33.093},
      {s: 'cam', t: quando('Camara', 3), v: 10.948},
      {s: 'div', t: quando('Dividas', 3), v: 21.79},
      {s: 'cul', t: quando('Cultura', 3), v: 12.5},
      {s: 'ass', t: quando('Assistencia social', 3), v: 6.686},
      {s: 'agu', t: quando('Agua e saneamento', 3), v: 6.779},
      {s: 'agr', t: quando('Agricultura', 3), v: 2.615},
      {s: 'esp', t: quando('Esporte', 3), v: 0.138},
      {s: 'amb', t: quando('Meio ambiente', 3), v: 1.288},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? (s.id === 'dc' ? T.defesa : T.animal) - 0.1]));
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
const ESCALA = 5; // 1 pilha = R$ 5 milhões (1 moeda = R$ 500 mil)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};
const azulPrec = (tema: Tema) => mistura(tema.objetoClaro, tema.festa!.turquesa, 0.55);
const cinzaJuros = (tema: Tema) => mistura(tema.objetoClaro, tema.objeto, 0.35);

// ---------- A pilha do ano em volta do cofre (até 95 pilhas, três voltas espalhadas por igual) ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.7, 28],
      [2.2, 34],
      [2.7, 40],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.31;
      const rel = (a - (ANGS[0] - 0.1 * Math.PI) + Math.PI * 8) % (Math.PI * 2);
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: rel});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + (e.v / ESCALA < 0.003 ? 0 : Math.ceil(e.v / ESCALA - 0.0005)), 0);
  const lugarDe = (j: number) => LUGARES[Math.floor((j * LUGARES.length) / Math.max(totalAno, 1)) % LUGARES.length];
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
      v.push({de: lugarDe(lugar), para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

// o dinheiro (cofre e pilhas) afunda quando a câmera vai para o miolo (canal e precatórios) e volta na pergunta final
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.canal - 0.2, T.canal + 0.6);
const FALTA_POS: V3 = [0, 0, 3.55];
const EMP_POS: V3 = [-1.4, 0, 3.45];
const COMP_POS: V3 = [1.4, 0, 3.45];
const EMPRESTIMO = 15;
const COMPROMETIDO = 67.315;
const PREC_RECEBIDO = 28.923;

// ---------- Festas 2025: reservado (tracejado) x gasto (sólido), ao lado do palco ----------
const ESC_FESTA = 1; // aqui, 1 pilha = R$ 1 mi
const FESTA_POS: V3 = noAnel(idx('cul') + 0.5, 4.9);
const FESTA = {res: 5.602, usou: 13.354};

// ---------- Miolo: o canal e os precatórios (aqui, 1 pilha = R$ 1 mi) ----------
const CANAL_POS: V3 = [0, 0, 1.0];
const CANAL_RES = 8.75;
const CANAL_GAV: V3 = [0, 0, 2.6];
const CAIXAS: V3[] = [
  [-1.6, 0, -1.7],
  [0, 0, -1.9],
  [1.6, 0, -1.7],
];
const PDIV: V3 = [-1.5, 0, 0.55];
const PJUR: V3 = [1.5, 0, 0.55];
const PPROF: V3 = [-3.2, 0, 1.6];
const PMAIS: V3 = [-3.2, 0, 2.95];
const PREC = {divida: 12.713, juros: 16.21, rateio: 7.654, maisJuros: 9.726};
const PREC_VIS = (t: number) => vis(t, T.pedido + 0.2, T.tribunal - 0.1);
const CAIXA_VIS = (t: number) => janela(t, T.com29 - 0.4, Y2E0() - 0.4, 0.5) + vis(t, T.pedido + 0.2, T.tribunal - 0.1);
const Y2E0 = () => ANOS[2].entradas[0].t;
const TCM_POS: V3 = [0, 0, -2.4];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = Math.min(1, SOME_DINHEIRO(t));
  {
    // o que foi gasto a mais: torre vermelha na frente do cofre (2024 e 2025)
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, 2, C.alerta));
    });
    // 2025: o empréstimo de R$ 15 mi entra no cofre (3 pilhas que vêm da borda)
    const ke = rampa(t, T.emprestimo, T.emprestimo + 1.2);
    if (ke > 0.01 && t < T.gastou25 + 0.3) {
      const de: V3 = [-3.2, 0, 6.4];
      for (let j = 0; j < 3; j++) {
        const kk = Math.min(1, Math.max(0, ke * 1.3 - j * 0.15));
        torres.push({p: curva(de, soma(EMP_POS, [(j - 1) * 0.36, 0, 0]), 1.8, kk), n: 1 * some * (1 - rampa(t, T.gastou25 - 0.1, T.gastou25 + 0.3)), cor: C.ouro});
      }
    }
    // 2026: as pilhas do precatório saem da caixa da União e entram no cofre
    const kp = rampa(t, T.com29 + 0.2, T.com29 + 1.6);
    if (kp > 0.01 && t < T.gastou26 + 0.4) {
      const n = PREC_RECEBIDO / ESCALA;
      for (let j = 0; j < Math.ceil(n); j++) {
        const kk = Math.min(1, Math.max(0, kp * 1.4 - j * 0.07));
        const dentro = rampa(t, T.gastou26 - 0.2, T.gastou26 + 0.3);
        torres.push({p: curva(soma(CAIXAS[0], [0, 0.6, 0]), [(j - 2.5) * 0.3, 0.4, 0.9], 1.6, kk), n: Math.min(1, n - j) * (1 - dentro), cor: azulPrec(tema)});
      }
    }
    // 2026: o que já foi comprometido além do pago, em tracejado rosa ao lado do cofre
    const kc = janela(t, T.comprometeu, ANOS[2].entradas[0].t - 0.5, 0.4) * some;
    if (kc > 0.01) fantasmas.push(...torre(COMP_POS, (COMPROMETIDO / ESCALA) * rampa(t, T.comprometeu, T.comprometeu + 1.0) * kc, 3, CA[2]));
    // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
    ANOS.forEach((y, yi) => {
      VOOS[yi].forEach((v, j) => {
        const nasce = rampa(t, y.gastou + 0.1 + (j % 34) * 0.012, y.gastou + 0.7 + (j % 34) * 0.012);
        if (nasce <= 0.01) return;
        const k = rampa(t, v.t0, v.t0 + 0.75);
        if (k <= 0) torres.push({p: v.de, n: v.n * nasce * some, cor: CA[yi]});
        else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
      });
    });
  }
  // festas 2025: tracejado do que foi reservado e a torre do que foi gasto
  const kf = vis(t, T.reservados - 0.1, T.canal) + vis(t, T.festaCresce - 0.2, FIM + 2);
  if (kf > 0.01) {
    const r = Math.max(rampa(t, T.reservados, T.reservados + 0.6), rampa(t, T.festaCresce - 0.2, T.festaCresce + 0.3)) * Math.min(1, kf);
    const u = Math.max(rampa(t, T.levaram, T.levaram + 1.3), rampa(t, T.festaCresce - 0.2, T.festaCresce + 0.4)) * Math.min(1, kf);
    if (r > 0.01) fantasmas.push(...torre(FESTA_POS, (FESTA.res / ESC_FESTA) * r, LADO, tema.objetoClaro));
    if (u > 0.01) solidas.push(...torre(soma(FESTA_POS, [0, 0, 0.02]), (FESTA.usou / ESC_FESTA) * u, LADO, CA[1]));
  }
  // canal do Belém: só o tracejado do reservado (nada gasto)
  const kg = vis(t, T.canalRes - 0.2, T.pedido + 1.6) + vis(t, T.canalFim - 0.2, FIM + 2);
  if (kg > 0.01) {
    const r = Math.max(rampa(t, T.canalRes, T.canalRes + 0.8), rampa(t, T.canalFim - 0.2, T.canalFim + 0.4)) * Math.min(1, kg);
    fantasmas.push(...torre(CANAL_GAV, CANAL_RES * r, LADO, tema.objetoClaro));
  }
  // precatórios: dívida (azul-claro) e juros (cinza-azulado); o rateio sai da dívida para os professores
  const kv = PREC_VIS(t);
  if (kv > 0.01) {
    const div = rampa(t, T.divida, T.divida + 0.8) * kv;
    const jur = rampa(t, T.juros, T.juros + 0.8) * kv;
    const rat = rampa(t, T.rateou, T.rateou + 1.4);
    if (div > 0.01) solidas.push(...torre(PDIV, (PREC.divida - PREC.rateio * rat) * div, LADO, azulPrec(tema)));
    if (jur > 0.01) solidas.push(...torre(PJUR, PREC.juros * jur, LADO, cinzaJuros(tema)));
    if (rat > 0.01) solidas.push(...torre(PPROF, PREC.rateio * rat * kv, LADO, tema.acento));
    const km = janela(t, T.seriam, T.tribunal - 0.3, 0.6);
    if (km > 0.01) fantasmas.push(...torre(PMAIS, PREC.maisJuros * rampa(t, T.seriam, T.seriam + 1.0) * km, LADO, tema.acento));
    // a regra da lei: 10 moedas, 6 acesas
    const kl = janela(t, T.seisDez - 0.1, T.rateou + 0.6, 0.45);
    if (kl > 0.01) {
      for (let m = 0; m < 10; m++) {
        const a = rampa(t, T.seisDez + m * 0.06, T.seisDez + 0.35 + m * 0.06) * kl;
        if (a > 0.01) solidas.push({p: [-1.62 + m * 0.36, 0, 2.15], n: 0.3 * a, cor: m < 6 ? tema.acento : tema.objetoClaro});
      }
    }
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.4, 0, 8.6], 0.2],
  [[-6.8, 0, 5.4], -0.6],
];
const ARVORES: V3[] = [
  [-1.4, 0, 8.3],
  [-5.4, 0, 6.8],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.4, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.repara, T.canal, 0.4), janela(t, T.festaCresce, FIM + 1, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.dobro, T.canal, 0.4));
  if (s.id === 'edu') aceso = Math.max(aceso, janela(t, T.rateou, T.livres, 0.4));
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
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.9, 0, 0.9].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d * 0.8, 0, tg[2] * d * 0.8])} r={k === 1 ? 0.34 : 0.27} cresce={Math.min(1, sobe) * 0.7} />
          ))}
          <BaseGaveta tema={tema} pos={noAnel(i, R_PREDIO - 1.2)} sobe={sobe} texto="MEIO AMBIENTE" aceso={aceso} larg={1.35} />
        </group>
      );
    }
    case 'canil': {
      // proteção animal: nem existe no orçamento. Só uma base vazia, cinza, sem plaquinha de valor.
      const k = vis(t, T.animal - 0.1, FIM + 2);
      return <BaseGaveta tema={tema} pos={p} sobe={k} texto="PROTEÇÃO ANIMAL" aceso={0} larg={2.0} />;
    }
    default: {
      const sobeZ = zerado ? vis(t, T.defesa - 0.1, FIM + 2) : sobe;
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobeZ} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
    }
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * Math.min(1, SOME_DINHEIRO(t));
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)), janela(t, T.emprestimo, T.gastou25, 0.5), janela(t, T.com29 + 0.6, T.gastou26 + 0.4, 0.5));
  const pAgu = noAnel(idx('agu'), R_PREDIO - 1.55);
  const tgAgu: V3 = [Math.cos(ang(idx('agu'))), 0, -Math.sin(ang(idx('agu')))];
  const kv = PREC_VIS(t);
  const kcx = Math.min(1, CAIXA_VIS(t));
  const kb = vis(t, T.razao - 0.1, T.tribunal - 0.1);
  const inclina = (rampa(t, T.supremo, T.supremo + 0.8) * -0.9 + rampa(t, T.projeto, T.projeto + 0.9) * 1.8) * (1 - rampa(t, T.decide, T.decide + 1.4));
  const pk = vis(t, T.tribunal, T.gastar - 0.1);
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
      <PilhasDinheiro pilhas={torres} max={4500} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={1200} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* 2024: terceirizados na caixa d'água; em 2025 eles saem andando */}
      {[0, 1, 2].map((k) => {
        const a = rampa(t, T.contratos + k * 0.12, T.contratos + k * 0.12 + 0.45) * (1 - rampa(t, T.sairam + 0.6, T.sairam + 1.4));
        if (a < 0.02) return null;
        const anda = 1.4 * rampa(t, T.sairam, T.sairam + 1.4);
        return <Boneco key={k} tema={tema} pos={soma(pAgu, [tgAgu[0] * ((k - 1) * 0.45 + anda), 0.04, tgAgu[2] * ((k - 1) * 0.45 + anda)])} rotY={ang(idx('agu'))} escala={0.3 * a} cor={mistura(tema.festa!.dourado, tema.festa!.rosa, 0.45)} />;
      })}

      {/* festas 2025: a base da comparação ao lado do palco */}
      <BaseGaveta tema={tema} pos={FESTA_POS} sobe={vis(t, T.reservados - 0.2, T.canal) + vis(t, T.festaCresce - 0.3, FIM + 2)} texto="FESTAS 2025" aceso={Math.max(janela(t, T.reservados, T.canal, 0.4), janela(t, T.festaCresce, FIM + 1, 0.4))} larg={1.7} />

      {/* o Canal do Belém, no miolo */}
      <CanalSeco tema={tema} pos={CANAL_POS} sobe={vis(t, T.canal + 0.1, T.pedido + 1.6) + vis(t, T.canalFim - 0.3, FIM + 2)} aceso={Math.max(janela(t, T.canal, T.pedido, 0.4), janela(t, T.canalFim, FIM + 1, 0.4))} linhas={['CANAL DO BELÉM', 'DRENAGEM · 2026']} />
      <BaseGaveta tema={tema} pos={CANAL_GAV} sobe={vis(t, T.canalRes - 0.3, T.pedido + 1.6) + vis(t, T.canalFim - 0.3, FIM + 2)} texto="RESERVADO X GASTO" aceso={janela(t, T.nadaGasto, T.pedido, 0.4)} larg={1.7} />

      {/* precatórios: as três parcelas, a fita do tempo, o martelo, as pilhas e a balança */}
      {CAIXAS.map((c, k) => {
        const s = k === 0 ? kcx : Math.min(1, kcx) * rampa(t, T.parcelas + k * 0.25, T.parcelas + 0.5 + k * 0.25);
        const tampa = k === 0 ? Math.max(janela(t, T.com29, T.gastou26, 0.5), janela(t, T.primeira, T.tribunal, 0.6)) : 0;
        return <CaixaFundef key={k} tema={tema} pos={c} escala={0.5 * s} tampa={tampa} carimbo1={s} carimbo2={0} />;
      })}
      <RuaPlaca tema={tema} pos={[0, 0, -3.15]} escala={0.85} sobe={vis(t, T.uniao - 0.1, T.tribunal - 0.1)} linhas={['UNIÃO → EDUCAÇÃO', 'FUNDEF · 1998 A 2006']} aceso={janela(t, T.uniao, T.parcelas, 0.4)} />
      <Martelo tema={tema} pos={[2.3, 0, -1.1]} escala={0.85 * vis(t, T.precatorio - 0.1, T.parcelas)} bate={rampa(t, T.precatorio + 0.3, T.precatorio + 0.7)} rotY={-0.6} />
      <BaseGaveta tema={tema} pos={soma(PDIV, [0, 0, 0.05])} sobe={vis(t, T.divida - 0.2, T.tribunal - 0.1)} texto="DÍVIDA" aceso={janela(t, T.divida, T.juros, 0.4)} larg={1.3} />
      <BaseGaveta tema={tema} pos={soma(PJUR, [0, 0, 0.05])} sobe={vis(t, T.juros - 0.2, T.tribunal - 0.1)} texto="JUROS" aceso={Math.max(janela(t, T.juros, T.lei, 0.4), janela(t, T.livres, T.site, 0.4))} larg={1.3} />
      <BaseGaveta tema={tema} pos={soma(PPROF, [0, 0, 0.05])} sobe={vis(t, T.rateou - 0.2, T.tribunal - 0.1)} texto="PROFESSORES" aceso={janela(t, T.rateou, T.livres, 0.4)} larg={1.5} />
      {[0, 1, 2, 3].map((k) => {
        const a = rampa(t, T.rateou + 0.4 + k * 0.12, T.rateou + 0.85 + k * 0.12) * kv;
        if (a < 0.02) return null;
        return <Boneco key={k} tema={tema} pos={[PPROF[0] - 0.75 + k * 0.5, 0.04, PPROF[2] - 0.9]} rotY={0.3} escala={0.28 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.2 + 0.15 * k)} />;
      })}
      <CelularManchete tema={tema} pos={[2.9, 0, 1.6]} rotY={-0.45} escala={0.9} sobe={vis(t, T.site - 0.1, T.razao)} manchete={['R$ 12,7 MI', 'PARA OS', 'PROFESSORES']} site="SITE iGUANAMBI · 27/10/2026" aceso={janela(t, T.site, T.razao, 0.4)} />
      <BalancaJustica tema={tema} pos={[0, 0, -0.2]} escala={0.9 * kb} inclina={inclina} brilhoEsq={janela(t, T.supremo, T.projeto, 0.4)} brilhoDir={janela(t, T.projeto, T.decide, 0.4)} ponteiro={janela(t, T.decide, T.tribunal, 0.5)} />

      {/* o Tribunal e as 22 pastas em análise */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={pk} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      <PilhaPastas tema={tema} pos={[-1.3, 0, 0.9]} escala={1.1} n={22} sobe={pk * rampa(t, T.processos - 0.1, T.processos + 1.2)} aceso={janela(t, T.processos, T.gastar, 0.4)} etiqueta="22 EM ANÁLISE" />
      <PastaProcesso tema={tema} pos={[1.3, 0, 1.0]} rotY={-0.25} escala={0.7} sobe={pk * rampa(t, T.processos + 0.4, T.processos + 0.9)} titulo="DENÚNCIAS E" valor="FISCALIZAÇÕES" carimbo={rampa(t, T.processos + 0.9, T.processos + 1.3)} textoCarimbo="EM ANÁLISE" corCarimbo={mistura(coresOI(tema).ouro, tema.texto, 0.35)} aceso={janela(t, T.processos, T.gastar, 0.4)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13.5, 11.5, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.4], 9.6, 7.6, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
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
const [Y0, Y1, Y2] = ANOS;
const MIOLO = (dx = 0, perto = 1) => E([0, 0.6, 0.4], 8.8 * perto, 7.0 * perto, [dx, 1.05, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.falt24 + 0.4, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, empréstimo, pilha verde, torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.emprestimo, COFRE(0.0)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: sobe, a caixa da União manda o precatório para o cofre, pilha rosa, o comprometido
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.com29 - 0.2, E([0, 0.5, 0.2], 10.5, 8.2, [0.05, 1.25, 1])], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.defesa - 0.2, 1.2)]},
  // os zeros: o giro segue até o fim da mesa (defesa civil e proteção animal)
  {ini: T.defesa - 0.1, arco: 0.03, chaves: [[T.defesa - 0.1, OLHA_SETOR(12, 1.5)], [T.animal - 0.2, OLHA_SETOR(12.5, 1.6)], [T.repara - 0.2, OLHA_SETOR(12.6, 1.6)]]},
  // festas: sobe e mergulha entre o palco e a assistência (vizinhos na mesa), com a base das festas 2025 na frente
  {ini: T.repara - 0.1, arco: 0.05, chaves: [[T.repara - 0.1, DE_CIMA(-0.1)], [T.reservados - 0.3, OLHA_SETOR(6.5, 1.5)], [T.dobro, OLHA_SETOR(6.6, 1.55)], [T.canal - 0.2, OLHA_SETOR(6.6, 1.55)]]},
  // o canal: desliza para o miolo (o cofre afunda)
  {ini: T.canal - 0.1, arco: 0.04, chaves: [[T.canal - 0.1, DE_CIMA(0)], [T.canal + 0.8, E([0, 0.6, 1.6], 6.4, 5.4, [0, 0.9, 1])], [T.pedido - 0.2, E([0, 0.6, 1.6], 6.2, 5.2, [0.08, 0.9, 1])]]},
  // precatórios: caixas da União, as duas pilhas, os professores, a manchete e a balança, sem voltar
  {
    ini: T.pedido - 0.1,
    arco: 0.03,
    chaves: [
      [T.pedido - 0.1, E([0, 0.6, -1.4], 7.4, 6.0, [0, 1.0, 1])],
      [T.parcelas, E([0, 0.6, -1.6], 6.8, 5.6, [0.05, 0.95, 1])],
      [T.nota - 0.2, MIOLO(0, 0.95)],
      [T.lei, E([-0.6, 0.6, 1.2], 7.6, 6.2, [-0.1, 0.95, 1])],
      [T.rateou + 0.3, E([-2.2, 0.8, 1.3], 6.2, 5.4, [-0.2, 0.9, 1])],
      [T.livres, E([0.6, 0.8, 0.8], 6.6, 5.6, [0.1, 0.9, 1])],
      [T.site, E([2.4, 1.1, 1.4], 4.8, 4.6, [0.25, 0.5, 1])],
      [T.razao - 0.1, E([0, 1.2, 0.2], 7.2, 6.2, [0, 0.75, 1])],
      [T.seriam, E([-1.4, 1.0, 1.0], 8.2, 6.6, [-0.1, 0.8, 1])],
      [T.decide, E([0, 1.2, 0.2], 7.4, 6.4, [0.05, 0.75, 1])],
    ],
  },
  // tribunal: o prédio ao fundo e a pilha de 22 pastas
  {ini: T.tribunal - 0.2, arco: 0.03, chaves: [[T.tribunal - 0.2, E([0, 1.0, -0.6], 8.8, 7.0, [0, 0.9, 1])], [T.gastar - 0.2, E([0.4, 0.9, 0.2], 7.0, 6.0, [0.1, 0.8, 1])]]},
  // a pergunta: mesa inteira, depois o palco aceso e o canal seco
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 13, 9.4, [0, 1.3, 1])], [T.festaCresce - 0.3, OLHA_SETOR(6.5, 1.5)], [T.canalFim - 0.1, E([0, 0.7, 1.6], 6.6, 5.6, [0.05, 0.9, 1])], [T.segue, E([0, 0.7, 1.6], 7.0, 5.9, [0.12, 0.95, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'GUANAMBI · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.defesa, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA'],
  [T.canal, 'O CANAL'],
  [T.pedido, 'PEDIDO DE SEGUIDOR'],
  [T.razao, 'QUEM TEM RAZÃO?'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${(Math.round(v * 10 + 1e-9) / 10).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falt24, texto: 'GASTOU EM 2024: R$ 416,5 MILHÕES'},
    {a: T.falt24, b: Y0.entradas[0].t, texto: 'R$ 10,9 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.emprestimo, texto: 'ARRECADOU EM 2025: R$ 456,9 MI'},
    {a: T.emprestimo, b: T.gastou25, texto: 'CONTANDO UM EMPRÉSTIMO DE R$ 15 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 474,2 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'R$ 17,3 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.com29, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 380,5 MI'},
    {a: T.com29, b: T.gastou26, texto: 'COM R$ 28,9 MI DOS PRECATÓRIOS DO FUNDEF'},
    {a: T.gastou26, b: T.comprometeu, texto: 'JÁ GASTOU: R$ 365,7 MI (PREFEITURA + CÂMARA)'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'E JÁ COMPROMETEU MAIS R$ 67,3 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.defesa, b: T.nenhum, texto: 'DEFESA CIVIL'},
    {a: T.nenhum, b: T.animal, texto: 'RESERVADO NOS 3 ANOS · GASTO R$ 0', destaque: true},
    {a: T.animal, b: T.nemAparece, texto: 'PROTEÇÃO ANIMAL'},
    {a: T.nemAparece, b: T.repara, texto: 'NENHUMA LINHA NO ORÇAMENTO', destaque: true},
    {a: T.reservados, b: T.levaram, texto: 'FESTAS 2025: RESERVADO R$ 5,6 MI'},
    {a: T.levaram, b: T.dobro, texto: 'FESTAS 2025: GASTARAM R$ 13,4 MI', destaque: true},
    {a: T.dobro, b: T.canal, texto: 'QUASE O DOBRO DA ASSISTÊNCIA SOCIAL (R$ 7,4 MI)'},
    {a: T.canal, b: T.canalRes, texto: 'DRENAGEM DO CANAL DO BELÉM'},
    {a: T.canalRes, b: T.nadaGasto, texto: 'RESERVADO PARA 2026: R$ 8,75 MI'},
    {a: T.nadaGasto, b: T.pedido, texto: 'GASTO ATÉ SETEMBRO: R$ 0', destaque: true},
    {a: T.pedido, b: T.precatorio, texto: 'PEDIDO DE SEGUIDOR: OS PRECATÓRIOS DO FUNDEF'},
    {a: T.precatorio, b: T.uniao, texto: 'PRECATÓRIO = DÍVIDA QUE A JUSTIÇA MANDOU PAGAR'},
    {a: T.uniao, b: T.agencia, texto: 'A UNIÃO DEIXOU DE PAGAR À EDUCAÇÃO DE 1998 A 2006'},
    {a: T.agencia, b: T.primeira, texto: 'ACORDO: 3 PARCELAS · 2026, 2027 E 2028'},
    {a: T.primeira, b: T.nota, texto: 'A 1ª CHEGOU EM 2026: R$ 28,9 MI', destaque: true},
    {a: T.nota, b: T.juros, texto: 'DÍVIDA (PRINCIPAL): R$ 12,7 MI'},
    {a: T.juros, b: T.lei, texto: 'JUROS PELO ATRASO: R$ 16,2 MI'},
    {a: T.lei, b: T.rateou, texto: 'A LEI: 6 DE CADA 10 REAIS AOS PROFESSORES'},
    {a: T.rateou, b: T.hora, texto: 'A PREFEITURA CONTOU SÓ A DÍVIDA: RATEIO DE R$ 7,65 MI', destaque: true},
    {a: T.hora, b: T.livres, texto: 'R$ 0,95 POR HORA TRABALHADA'},
    {a: T.livres, b: T.site, texto: 'OS JUROS FICARAM LIVRES PARA A PREFEITURA'},
    {a: T.site, b: T.masEsse, texto: 'O SITE iGUANAMBI FALOU EM R$ 12,7 MI AOS PROFESSORES'},
    {a: T.masEsse, b: T.razao, texto: 'R$ 12,7 MI É A DÍVIDA INTEIRA', destaque: true},
    {a: T.razao, b: T.supremo, texto: 'E QUEM TEM RAZÃO?'},
    {a: T.supremo, b: T.projeto, texto: 'STF: JURO NÃO FICA PRESO À EDUCAÇÃO'},
    {a: T.projeto, b: T.seriam, texto: 'PROJETO NA CÂMARA DOS DEPUTADOS: JUROS NA CONTA'},
    {a: T.seriam, b: T.decide, texto: 'COM OS JUROS: + R$ 9,7 MI AOS PROFESSORES', destaque: true},
    {a: T.decide, b: T.tribunal, texto: 'QUEM DECIDE É A JUSTIÇA'},
    {a: T.tribunal, b: T.processos, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.processos, b: T.gastar, texto: '22 PROCESSOS DESDE 2024 ESPERAM JULGAMENTO'},
    {a: T.gastar, b: T.festaCresce, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festaCresce, b: T.canalFim, texto: 'SE FALTOU DINHEIRO, POR QUE A FESTA CRESCE...', destaque: true},
    {a: T.canalFim, b: T.segue, texto: '...E O CANAL NÃO SAI?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.defesa, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.defesa, b: T.pedido, texto: 'FONTE: DESPESA POR AÇÃO · ANEXO 6 E SIGA DEZ/2025, SET/2026'},
  {a: T.pedido, b: T.nota, texto: 'FONTE: AGÊNCIA SERTÃO, 07/04/2025'},
  {a: T.nota, b: T.site, texto: 'FONTE: NOTA DA PREFEITURA, 05/11/2026 · RECEITA SIGA SET/2026'},
  {a: T.site, b: T.razao, texto: 'FONTE: iGUANAMBI, 27/10/2026 · NOTA DA PREFEITURA, 05/11/2026'},
  {a: T.razao, b: T.tribunal, texto: 'FONTE: STF, ADPF 528 E RE 1.428.399 · PL 6399/2025'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · CONSULTA DE 07/11/2026'},
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
      const prox = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.5 : 0.3 + k * 0.1), b: Math.max(e.t + 1.6, prox + 0.1), p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, 2) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  r.push(
    {a: T.emprestimo + 0.6, b: T.gastou25, p: soma(EMP_POS, [0, 1.1, 0]), valor: 'EMPRÉSTIMO', sub: 'R$ 15 MI · 2025', cor: C.ouro},
    {a: T.com29 + 0.6, b: T.gastou26, p: soma(CAIXAS[0], [0, 1.3, 0]), valor: 'R$ 28,9 MI', sub: 'PRECATÓRIOS · 2026', cor: azulPrec(tema)},
    {a: T.comprometeu + 0.4, b: Y2.entradas[0].t - 0.1, p: soma(COMP_POS, [0, altTorre(COMPROMETIDO / ESCALA, 3) + 0.3, 0]), valor: 'R$ 67,3 MI', sub: 'COMPROMETIDO', cor: CA[2]},
    {a: T.contratos + 0.4, b: Y0.entradas[9].t, p: soma(noAnel(idx('agu'), R_PREDIO - 1.55), [0, 0.9, 0]), valor: 'TERCEIRIZADOS', sub: 'E SERVIÇOS · 2024'},
    {a: T.nenhum + 0.2, b: T.animal, p: soma(noAnel(idx('dc'), R_PREDIO), [0, 1.6, 0]), valor: 'R$ 0', sub: '2024 · 2025 · 2026'},
  );
  // festas 2025 x assistência
  const topoF = (v: number) => soma(FESTA_POS, [0, altTorre(v / ESC_FESTA, LADO) + 0.3, 0]);
  r.push(
    {a: T.reservados + 0.5, b: T.levaram + 0.2, p: topoF(FESTA.res), valor: 'RESERVADO R$ 5,6 MI', sub: 'FESTAS 2025'},
    {a: T.levaram + 1.0, b: T.canal - 0.1, p: topoF(FESTA.usou), valor: 'R$ 13,4 MI', sub: 'FESTAS 2025 · GASTO', cor: CA[1]},
    {a: T.dobro + 0.3, b: T.canal - 0.1, p: soma(posTorre(idx('ass'), 1), [0, altFina(7.423) + 0.35, 0]), valor: 'R$ 7,4 MI', sub: '2025 · ASSISTÊNCIA', cor: CA[1]},
  );
  // canal
  const topoC = soma(CANAL_GAV, [0, altTorre(CANAL_RES, LADO) + 0.3, 0]);
  r.push(
    {a: T.canalRes + 0.4, b: T.nadaGasto + 0.1, p: topoC, valor: 'R$ 8,75 MI', sub: 'RESERVADO · 2026'},
    {a: T.nadaGasto + 0.2, b: T.pedido + 1.5, p: topoC, valor: 'GASTO R$ 0', sub: 'ATÉ SETEMBRO', cor: C.alerta},
  );
  // precatórios
  r.push(
    {a: T.parcelas + 0.3, b: T.primeira, p: soma(CAIXAS[0], [0, 1.0, 0]), valor: '2026'},
    {a: T.parcelas + 0.55, b: T.primeira, p: soma(CAIXAS[1], [0, 1.0, 0]), valor: '2027'},
    {a: T.parcelas + 0.8, b: T.primeira, p: soma(CAIXAS[2], [0, 1.0, 0]), valor: '2028'},
    {a: T.primeira + 0.4, b: T.nota, p: soma(CAIXAS[0], [0, 1.2, 0]), valor: 'R$ 28,9 MI', sub: '1ª PARCELA · 2026', cor: azulPrec(tema)},
    {a: T.divida + 0.5, b: T.rateou, p: soma(PDIV, [0, altTorre(PREC.divida, LADO) + 0.3, 0]), valor: 'R$ 12,7 MI', sub: 'DÍVIDA', cor: azulPrec(tema)},
    {a: T.juros + 0.5, b: T.livres, p: soma(PJUR, [0, altTorre(PREC.juros, LADO) + 0.3, 0]), valor: 'R$ 16,2 MI', sub: 'JUROS'},
    {a: T.rateou + 1.0, b: T.livres, p: soma(PPROF, [0, altTorre(PREC.rateio, LADO) + 0.3, 0]), valor: 'R$ 7,65 MI', sub: 'RATEIO AOS PROFESSORES', cor: tema.acento},
    {a: T.livres + 0.3, b: T.site, p: soma(PJUR, [0, altTorre(PREC.juros, LADO) + 0.3, 0]), valor: 'LIVRE', sub: 'JUROS · R$ 16,2 MI'},
    {a: T.seriam + 0.6, b: T.decide + 0.6, p: soma(PMAIS, [0, altTorre(PREC.maisJuros, LADO) + 0.3, 0]), valor: '+ R$ 9,7 MI', sub: 'SE OS JUROS ENTRASSEM', cor: tema.acento},
  );
  r.push({a: T.canalFim + 0.2, b: FIM + 1, p: topoC, valor: '?', cor: tema.acento}, {a: T.festaCresce + 0.3, b: FIM + 1, p: topoF(FESTA.usou), valor: '?', cor: tema.acento});
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
  const festaK = vis(t, T.reservados, T.canal - 0.2);
  const canalK = vis(t, T.canalRes, T.pedido - 0.2);
  const precK = vis(t, T.divida, T.razao - 0.2);
  const escala =
    festaK > 0.01 || canalK > 0.01 || precK > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI · BRANCO = RESERVADO' : '1 MOEDA = R$ 500 MIL · 1 PILHA = R$ 5 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, festaK, canalK, precK);
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
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${festaK > 0.01 || canalK > 0.01 || precK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: escala.length > 60 ? 13 : 16, fontWeight: 800, letterSpacing: 1.2, color: tema.texto}}>{escala}</div>
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
  // rótulos que se encostam: procura a altura livre mais perto (acima ou abaixo) e depois ao lado
  const bate = (x: number, y: number, ate: number) => rots.slice(0, ate).some((o) => Math.abs(o.x - x) < 170 && Math.abs(o.y - y) < 66);
  for (let a = 0; a < rots.length; a++) {
    if (!bate(rots[a].x, rots[a].y, a)) continue;
    const {x: x0, y: y0} = rots[a];
    const cands: [number, number][] = [];
    for (let k = 1; k <= 4; k++) cands.push([x0, y0 - 68 * k], [x0, y0 + 68 * k]);
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
      <OffthreadVideo src={staticFile(`${P}/mapas/guanambi.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falt24, T.falt25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.levaram, T.nadaGasto, T.primeira, T.rateou, T.seriam];
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
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  s.push({t: T.emprestimo + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.com29 + 0.3, f: 'pop', v: 0.18});
  s.push({t: T.comprometeu + 0.2, f: 'tique', v: 0.14});
  s.push({t: T.nenhum, f: 'baque', v: 0.2});
  s.push({t: T.levaram, f: 'subida', v: 0.18});
  s.push({t: T.nadaGasto, f: 'baque', v: 0.2});
  s.push({t: T.precatorio + 0.6, f: 'impacto', v: 0.14});
  s.push({t: T.primeira + 0.3, f: 'pop', v: 0.18});
  s.push({t: T.seisDez + 0.2, f: 'pop', v: 0.14});
  s.push({t: T.rateou + 0.2, f: 'subida', v: 0.16});
  s.push({t: T.site + 0.1, f: 'bip', v: 0.12});
  s.push({t: T.decide + 0.6, f: 'ding', v: 0.16});
  s.push({t: T.processos + 0.9, f: 'impacto', v: 0.16});
  s.push({t: T.festaCresce, f: 'pop', v: 0.18});
  s.push({t: T.canalFim, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1, 4, 7.5, T.gastou24 + 0.9, T.falt24 + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.contratos + 0.8, T.ano25 + 1.0, T.emprestimo + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[8].t + 1.4, Y1.entradas[10].t + 0.9,
  T.ano26 + 1.0, T.com29 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[8].t + 0.9, Y2.entradas[11].t + 0.9,
  T.nenhum + 0.6, T.nemAparece + 0.5, T.levaram + 1.4, T.dobro + 0.8, T.canal + 1.2, T.canalRes + 1.2, T.nadaGasto + 0.6,
  T.precatorio + 0.8, T.uniao + 1.0, T.parcelas + 1.2, T.primeira + 0.8, T.juros + 1.0, T.seisDez + 1.0, T.rateou + 1.4, T.hora + 0.5, T.livres + 0.6, T.site + 1.0, T.masEsse + 0.6,
  T.supremo + 1.0, T.projeto + 1.2, T.seriam + 1.2, T.decide + 1.0, T.processos + 1.4, T.gastar + 0.5, T.festaCresce + 0.6, T.canalFim + 0.4, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoGuanambi: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Guanambi" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['A festa', 'cresce.', 'O canal', 'não sai.'];
export const CapaOrcamentoGuanambi: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 660}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · GUANAMBI`} t={1} troca={0} y={SEGURO.topo + 160} />
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
