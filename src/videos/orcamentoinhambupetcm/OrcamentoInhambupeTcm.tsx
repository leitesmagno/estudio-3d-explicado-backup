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

// 129. orçamento de Inhambupe (BA) (perfil @eumagnoleite). MOLDE: 128 Arataca / 116 Piatã / 093 Ilhéus (brief _brief-lote-40.md).
// Pedido do amigo auditor do Magno (método dele no levantamento; no vídeo, a receita é só o total).
// O Kit Mapas abre (voo até Inhambupe, as três receitas e a de 2024 com o precatório do Fundef: projetos/129.../mapas/inhambupe.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setores (~/Documents/RECEITAS-DESPESAS-INHAMBUPE/scripts129/setores.py): PCMGE015 da Prefeitura
// + PCMGE015 da Câmara, fechando centavo a centavo com o Balanço (2024, 2025). 2026 até AGOSTO (último mês que a Câmara entregou).
// Sem porcentagem, sem nome de gestor, sem nome de empresa contratada, sem nome de pessoa nos processos.
// SÓ DADOS DE INHAMBUPE, todos do TCM-BA: projetos/129.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 178.76; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, atempo 1,12, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '129. orçamento de inhambupe';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 190'),
  arrec24: quando('Arrecadou 190 milhoes e 100'),
  prec: quando('Disso 27 milhoes'),
  gastou24: quando('Gastou 153'),
  mais24: quando('Sobraram 36'),
  ano25: quando('2025 Arrecadou 189'),
  arrec25: quando('Arrecadou 189 milhoes e 700 Gastou'),
  gastou25: quando('Gastou 191'),
  mais25: quando('Gastou 2 milhoes a mais'),
  ano26: quando('2026 ate agosto Arrecadou'),
  arrec26: quando('Arrecadou 158'),
  gastou26: quando('Gastou 136'),
  mais26: quando('Sobraram 21'),
  comprometeu: quando('Mas ja comprometeu'),
  repara: quando('Agora repara'),
  jan: quando('De janeiro a agosto tres'),
  comb: quando('Combustivel 1 milhao'),
  c25: quando('2 milhoes e 500 em 2025'),
  c26: quando('4 milhoes e 200 em 2026'),
  loc: quando('Aluguel de veiculos'),
  l25: quando('3 milhoes e 600'),
  l26: quando('3 milhoes e 900'),
  limp: quando('Limpeza publica'),
  p25: quando('3 milhoes e 800'),
  p26: quando('5 milhoes e 100'),
  festas: quando('So com bandas e palcos'),
  fe25: quando('4 milhoes e 100 em 2025'),
  fe26: quando('Em 2026 ate agosto ja sao'),
  passaram: quando('E ate agosto a cultura'),
  camara: quando('A Camara recebeu'),
  consult: quando('Gastou 551'),
  ccomb: quando('e 365 mil'),
  prazo: quando('E entregou 7'),
  divida: quando('A divida parcelada'),
  entraram: quando('Em 2025 entraram'),
  div25: quando('e ela fechou o ano'),
  maisQue: quando('mais do que a cidade arrecadou'),
  tcm: quando('No Tribunal de Contas 14'),
  improc: quando('Um foi julgado'),
  esperam: quando('Os outros 13'),
  pf: quando('o registro do precatorio'),
  pc: quando('e a consultoria e o combustivel'),
  pcomb: quando('o combustivel da Camara'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas por que so ate agosto'),
  comb2: quando('o combustivel ja passou'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'FESTAS'},
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
    ['obr', 'Obras e servicos'],
    ['adm', 'Administracao'],
    ['div', 'Dividas'],
    ['ass', 'Assistencia social'],
    ['cam', 'Camara'],
    ['cul', 'Cultura e festas'],
    ['agr', 'Agricultura e meio'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, s === 'edu' ? n + 1 : n), v: v[k]})); // 'educação' aparece antes, no precatório
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 153.68, rotulo: '2024', falta: {t: T.mais24, v: 36.428, txt: 'SOBRARAM', sobra: true}, entradas: lista(1, [72.756, 31.006, 14.804, 11.84, 7.992, 5.6209, 5.281, 2.4753, 1.0449, 0.86412])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 191.65, rotulo: '2025', falta: {t: T.mais25, v: 1.9884, txt: 'A MAIS'}, entradas: lista(2, [94.767, 36.046, 20.657, 10.974, 11.14, 5.2239, 6.0682, 4.9105, 1.2745, 0.59018])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 136.77, rotulo: '2026 · ATÉ AGO', falta: {t: T.mais26, v: 21.38, txt: 'SOBRARAM', sobra: true}, entradas: lista(3, [64.107, 25.869, 18.908, 8.9705, 2.8879, 4.152, 4.5399, 4.7514, 1.2861, 1.2982])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ AGO'];

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
const ESCALA = 2; // 1 pilha = R$ 2 mi (~137 a 192 mi por ano)
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


const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Escala do miolo: 1 pilha = R$ 250 mil (a dívida: 1 pilha = R$ 20 mi).
const LADO_A = 2;
const PASSO_A = 0.25;
const ZA = 0.2;
const ESC_A = 0.25;
// na frente, à esquerda: os três gastos de janeiro a agosto (combustível, aluguel de veículos e máquinas, limpeza pública), 2024 · 2025 · 2026
const TM = {
  c24: {p: [-5.0, 0, ZA] as V3, v: 1.6877},
  c25: {p: [-4.45, 0, ZA] as V3, v: 2.5123},
  c26: {p: [-3.9, 0, ZA] as V3, v: 4.1666},
  l24: {p: [-3.0, 0, ZA] as V3, v: 2.2558},
  l25: {p: [-2.45, 0, ZA] as V3, v: 3.5653},
  l26: {p: [-1.9, 0, ZA] as V3, v: 3.925},
  p24: {p: [-1.0, 0, ZA] as V3, v: 3.1388},
  p25: {p: [-0.45, 0, ZA] as V3, v: 3.8479},
  p26: {p: [0.1, 0, ZA] as V3, v: 5.0546},
};
const TM_X = -2.45;
// na pergunta final: o combustível do ano INTEIRO de 2024, ao lado do de 2026 até agosto
const C24ANO = {p: [-3.9, 0, ZA + 0.95] as V3, v: 2.9524};
// na frente, à direita: bandas e palcos (elementos 36.04/39.18/39.94 e 39.19/39.95, todas as funções) de 2024, 2025 e 2026 até agosto;
// depois a função Cultura (13) inteira x a assistência social inteira, 2026 até agosto. Regra da controladoria: a ação genérica de cultura não é chamada de "festas".
const FE = {
  f24: {p: [1.15, 0, ZA] as V3, v: 1.7547},
  f25: {p: [1.75, 0, ZA] as V3, v: 4.0881},
  f26: {p: [2.35, 0, ZA] as V3, v: 2.2437},
  cul26: {p: [3.15, 0, ZA] as V3, v: 4.7514},
  as26: {p: [3.75, 0, ZA] as V3, v: 4.152},
};
const FE_X = 2.45;
// atrás do cofre, à esquerda: a Câmara em 2025 (recebeu, consultoria, combustível);
// à direita (1 pilha = R$ 20 mi): a dívida parcelada com o INSS no fim de 2024, o que entrou em 2025, o fim de 2025 e a receita de 2025
const ZD = -2.0;
const ESC_C = 0.25;
const CM = {
  rec: {p: [-3.6, 0, ZD] as V3, v: 6.0686},
  cons: {p: [-2.95, 0, ZD] as V3, v: 0.551},
  comb: {p: [-2.3, 0, ZD] as V3, v: 0.36534},
};
const ESC_R = 20;
const RY = {
  d24: {p: [0.55, 0, ZD] as V3, v: 143.15},
  ent: {p: [1.45, 0, ZD] as V3, v: 81.318},
  d25: {p: [2.35, 0, ZD] as V3, v: 215.77},
  rec25: {p: [3.35, 0, ZD] as V3, v: 189.66},
};
// ★ os processos do TCM abertos em 2025 e 2026: uma fila de pastas na frente da mesa
const ZP = 0.8; // no meio da mesa (o cofre já sumiu)
const PROC: {t: () => number; titulo: string; valor: string; x: number; carimbo: () => number; txt: string; julgado?: boolean}[] = [
  {t: () => T.improc, titulo: 'PREGÃO 012/2026', valor: 'EDUCAÇÃO', x: -3.25, carimbo: () => T.improc + 0.5, txt: 'IMPROCEDENTE', julgado: true},
  {t: () => T.pf, titulo: 'PRECATÓRIO', valor: 'FUNDEF · 2024', x: -1.95, carimbo: () => T.esperam + 0.3, txt: 'SEM JULGAMENTO'},
  {t: () => T.pc, titulo: 'CÂMARA', valor: 'CONSULTORIA 2025', x: -0.65, carimbo: () => T.esperam + 0.42, txt: 'SEM JULGAMENTO'},
  {t: () => T.pcomb, titulo: 'CÂMARA', valor: 'COMBUSTÍVEL 2026', x: 0.65, carimbo: () => T.esperam + 0.54, txt: 'SEM JULGAMENTO'},
  {t: () => T.esperam + 0.3, titulo: 'PREGÃO 017/2026', valor: 'AR-CONDICIONADO', x: 1.95, carimbo: () => T.esperam + 0.66, txt: 'SEM JULGAMENTO'},
  {t: () => T.esperam + 0.45, titulo: '+ 9 PROCESSOS', valor: '2025 E 2026', x: 3.25, carimbo: () => T.esperam + 0.78, txt: 'SEM JULGAMENTO'},
];
const posProc = (k: number): V3 => [PROC[k].x, 0, ZP];
// os três gastos ficam do "Agora repara" até a Câmara; as festas, da fala delas até a Câmara; tudo volta na pergunta final
const TM_VIS = (t: number) => vis(t, T.repara - 0.2, T.camara - 0.15) + vis(t, T.gastar - 0.1, FIM + 2);
const FE_VIS = (t: number) => vis(t, T.festas - 0.4, T.camara - 0.15);
const CM_VIS = (t: number) => vis(t, T.camara - 0.3, T.tcm - 0.2);
const PR_VIS = (t: number) => vis(t, T.tcm - 0.3, T.gastar - 0.2);

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
    // torre na frente do cofre: o que sobrou (verde) ou o que gastou a mais (vermelho) em cada ano
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (v: number, esc: number, k: number, min = 0.3) => Math.max(min, v / esc) * k;
  const azul = mistura(tema.objetoClaro, tema.festa!.turquesa, 0.55);
  const vermelho = mistura(C.alerta, tema.objetoClaro, 0.3);
  // os três gastos de janeiro a agosto: cada tema sobe na palavra dele, ano a ano
  const tm = TM_VIS(t);
  if (tm > 0.01) {
    const grupos: [keyof typeof TM, number][] = [
      ['c24', T.comb + 0.5], ['c25', T.c25 + 0.2], ['c26', T.c26 + 0.2],
      ['l24', T.loc + 0.7], ['l25', T.l25 + 0.2], ['l26', T.l26 + 0.2],
      ['p24', T.limp + 0.5], ['p25', T.p25 + 0.2], ['p26', T.p26 + 0.2],
    ];
    grupos.forEach(([id, a], k) => {
      const kk = cresce(a) * tm;
      if (kk > 0.01) solidas.push(...torre(TM[id].p, tAk(TM[id].v, ESC_A, kk), LADO_A, CA[k % 3], PASSO_A));
    });
    // a pergunta final: o combustível do ano inteiro de 2024, na frente
    const kf = rampa(t, T.comb2, T.comb2 + 0.9) * (final ? 1 : 0);
    if (kf > 0.01) solidas.push(...torre(C24ANO.p, tAk(C24ANO.v, ESC_A, kf), LADO_A, mistura(CA[0], tema.objetoClaro, 0.25), PASSO_A));
  }
  // as festas de 2024, 2025 e 2026 até agosto; cultura e festas x assistência social em 2026 até agosto
  const fe = FE_VIS(t);
  if (fe > 0.01) {
    const k0 = cresce(T.festas + 0.4) * fe;
    if (k0 > 0.01) solidas.push(...torre(FE.f24.p, tAk(FE.f24.v, ESC_A, k0), LADO_A, CA[0], PASSO_A));
    const k1 = cresce(T.fe25 + 0.2) * fe;
    if (k1 > 0.01) solidas.push(...torre(FE.f25.p, tAk(FE.f25.v, ESC_A, k1), LADO_A, CA[1], PASSO_A));
    const k2 = cresce(T.fe26 + 0.5) * fe;
    if (k2 > 0.01) solidas.push(...torre(FE.f26.p, tAk(FE.f26.v, ESC_A, k2), LADO_A, CA[2], PASSO_A));
    const k3 = cresce(T.passaram + 0.5) * fe;
    if (k3 > 0.01) solidas.push(...torre(FE.cul26.p, tAk(FE.cul26.v, ESC_A, k3), LADO_A, mistura(CA[2], tema.objetoClaro, 0.3), PASSO_A));
    if (k3 > 0.01) solidas.push(...torre(FE.as26.p, tAk(FE.as26.v, ESC_A, cresce(T.passaram + 0.9) * fe), LADO_A, azul, PASSO_A));
  }
  // a Câmara (recebeu, consultoria e combustível em 2025) e a dívida com o INSS
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const a0 = cresce(T.camara + 0.6) * cm;
    if (a0 > 0.01) solidas.push(...torre(CM.rec.p, tAk(CM.rec.v, ESC_C, a0), 3, CA[1], PASSO_A)); // mais larga: 24 pilhas
    const a1 = cresce(T.consult + 0.3, 0.6) * cm;
    if (a1 > 0.01) solidas.push(...torre(CM.cons.p, tAk(CM.cons.v, ESC_C, a1), LADO_A, vermelho, PASSO_A));
    const a2 = cresce(T.ccomb + 0.2, 0.6) * cm;
    if (a2 > 0.01) solidas.push(...torre(CM.comb.p, tAk(CM.comb.v, ESC_C, a2), LADO_A, mistura(C.alerta, CA[0], 0.35), PASSO_A));
    const r0k = cresce(T.divida + 0.8) * cm;
    if (r0k > 0.01) solidas.push(...torre(RY.d24.p, tAk(RY.d24.v, ESC_R, r0k), LADO_A, mistura(C.alerta, tema.objetoClaro, 0.45), PASSO_A));
    const r1k = cresce(T.entraram + 0.4) * cm;
    if (r1k > 0.01) solidas.push(...torre(RY.ent.p, tAk(RY.ent.v, ESC_R, r1k), LADO_A, mistura(C.alerta, tema.objetoClaro, 0.2), PASSO_A));
    const r2k = cresce(T.div25 + 0.3) * cm;
    if (r2k > 0.01) solidas.push(...torre(RY.d25.p, tAk(RY.d25.v, ESC_R, r2k), LADO_A, C.alerta, PASSO_A));
    const r3k = cresce(T.maisQue + 0.3) * cm;
    if (r3k > 0.01) solidas.push(...torre(RY.rec25.p, tAk(RY.rec25.v, ESC_R, r3k), LADO_A, CA[1], PASSO_A));
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
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const tm = TM_VIS(t);
  const fe = FE_VIS(t);
  const pr = PR_VIS(t);
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

      {/* três gastos e festas (frente); Câmara e dívida com o INSS (atrás do cofre); processos do TCM (fila na frente) */}
      <BaseGaveta tema={tema} pos={[TM_X, 0, 0.6]} sobe={tm} larg={5.9} texto="DE JANEIRO A AGOSTO" aceso={Math.max(janela(t, T.jan, T.festas, 0.4), janela(t, T.porque, T.segue, 0.4))} />
      <BaseGaveta tema={tema} pos={[FE_X, 0, 0.6]} sobe={fe} larg={3.6} texto={t < T.passaram + 0.3 ? 'BANDAS E PALCOS' : 'CULTURA x ASSISTÊNCIA'} aceso={janela(t, T.festas, T.camara, 0.4)} />
      <BaseGaveta tema={tema} pos={[-2.95, 0, ZD]} sobe={cm} larg={2.4} texto="CÂMARA" aceso={janela(t, T.camara, T.divida, 0.4)} />
      <BaseGaveta tema={tema} pos={[1.95, 0, ZD]} sobe={cm} larg={3.9} texto="DÍVIDA COM O INSS" aceso={janela(t, T.divida, T.tcm, 0.4)} />
      {PROC.map((p, k) => (
        <PastaProcesso
          key={k}
          tema={tema}
          pos={posProc(k)}
          rotY={0}
          escala={0.85}
          sobe={pr * rampa(t, T.tcm + 0.2 + k * 0.22, T.tcm + 0.7 + k * 0.22)}
          titulo={p.titulo}
          valor={p.valor}
          carimbo={rampa(t, p.carimbo(), p.carimbo() + 0.4)}
          textoCarimbo={p.txt}
          corCarimbo={p.julgado ? mistura(tema.festa!.turquesa, tema.objetoClaro, 0.2) : mistura(C.alerta, tema.objetoClaro, 0.2)}
          aceso={janela(t, p.t(), p.t() + 1.4, 0.4)}
        />
      ))}
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
  // 2024: o cofre com a pilha do ano e a torre verde do que sobrou; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do que gastou a mais, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre verde do que sobrou
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.mais26 + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // os três gastos de janeiro a agosto (frente, à esquerda): combustível, aluguel, limpeza, um grupo por vez
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([TM_X, 1.0, 0.6], 7.6, 6.8, [0, 1.7, 1])],
      [T.comb - 0.2, E(soma(TM.c25.p, [0, 1.0, 0]), 3.0, 4.6, [-0.04, 1.3, 1])],
      [T.loc - 0.5, E(soma(TM.c25.p, [0, 1.1, 0]), 3.0, 4.6, [-0.03, 1.3, 1])],
      [T.loc + 0.1, E(soma(TM.l25.p, [0, 1.1, 0]), 3.0, 4.6, [-0.02, 1.3, 1])],
      [T.limp - 0.5, E(soma(TM.l25.p, [0, 1.1, 0]), 3.0, 4.6, [-0.01, 1.3, 1])],
      [T.limp + 0.1, E(soma(TM.p25.p, [0, 1.2, 0]), 3.0, 4.8, [0.0, 1.3, 1])],
      [T.festas - 0.5, E(soma(TM.p25.p, [0, 1.2, 0]), 3.0, 4.8, [0.01, 1.3, 1])],
    ],
  },
  // as festas (frente, à direita) e cultura e festas x assistência social em 2026
  {
    ini: T.festas - 0.2,
    arco: 0.03,
    chaves: [
      [T.festas - 0.2, E(soma(meio(FE.f24.p, FE.f26.p), [0, 1.1, 0]), 3.4, 4.8, [0.02, 1.3, 1])],
      [T.passaram - 0.4, E(soma(meio(FE.f24.p, FE.f26.p), [0, 1.1, 0]), 3.4, 4.8, [0.03, 1.3, 1])],
      [T.passaram + 0.3, E(soma(meio(FE.cul26.p, FE.as26.p), [0, 1.2, 0]), 3.0, 4.6, [0.04, 1.3, 1])],
      [T.camara - 0.4, E(soma(meio(FE.cul26.p, FE.as26.p), [0, 1.2, 0]), 3.0, 4.6, [0.05, 1.3, 1])],
    ],
  },
  // atrás do cofre: a Câmara em 2025 (recebeu, consultoria, combustível)
  {
    ini: T.camara - 0.2,
    arco: 0.03,
    chaves: [
      [T.camara - 0.2, E(soma(CM.rec.p, [0.2, 1.4, 0]), 3.0, 5.2, [-0.03, 1.3, 1])],
      [T.consult - 0.3, E(soma(CM.rec.p, [0.3, 1.4, 0]), 3.0, 5.2, [-0.02, 1.3, 1])],
      [T.consult + 0.2, E(soma(meio(CM.cons.p, CM.comb.p), [0, 0.5, 0]), 2.8, 3.8, [-0.01, 1.3, 1])],
      [T.divida - 0.4, E(soma(meio(CM.cons.p, CM.comb.p), [0, 0.5, 0]), 2.8, 3.8, [0.0, 1.3, 1])],
    ],
  },
  // a dívida parcelada com o INSS: fim de 2024, o que entrou em 2025, fim de 2025 e a receita de 2025
  {
    ini: T.divida - 0.2,
    arco: 0.03,
    chaves: [
      [T.divida - 0.2, E(soma(meio(RY.d24.p, RY.ent.p), [0, 1.3, 0]), 3.2, 5.0, [0.02, 1.4, 1])],
      [T.div25 - 0.3, E(soma(meio(RY.d24.p, RY.ent.p), [0, 1.4, 0]), 3.4, 5.2, [0.03, 1.4, 1])],
      [T.div25 + 0.4, E(soma(meio(RY.d24.p, RY.rec25.p), [0, 1.5, 0]), 4.6, 5.6, [0.04, 1.4, 1])],
      [T.tcm - 0.4, E(soma(meio(RY.d24.p, RY.rec25.p), [0, 1.5, 0]), 4.6, 5.7, [0.05, 1.4, 1])],
    ],
  },
  // ★ os processos do TCM: as pastas sobem uma a uma; câmera de frente e baixa, de duas em duas
  {
    ini: T.tcm - 0.2,
    arco: 0.02,
    chaves: [
      [T.tcm - 0.2, E([0, 0.9, ZP], 8.6, 5.0, [0, 1.0, 1])],
      [T.improc - 0.2, E([0, 0.9, ZP], 8.4, 5.0, [0, 1.0, 1])],
      [T.improc + 0.3, E([(PROC[0].x + PROC[1].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.pf - 0.2, E([(PROC[0].x + PROC[1].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.pc - 0.1, E([(PROC[2].x + PROC[3].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.gastar - 0.9, E([(PROC[2].x + PROC[3].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.gastar - 0.3, E([0, 0.9, ZP], 8.8, 5.1, [0, 1.0, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o combustível de 2026 até agosto ao lado do ano inteiro de 2024
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-1.0, 0, 0.6], 12.0, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E(soma(meio(TM.c26.p, C24ANO.p), [0, 0.9, 0]), 3.2, 4.4, [0.02, 1.3, 1])],
      [T.comb2 + 0.3, E(soma(meio(TM.c26.p, C24ANO.p), [0, 0.9, 0]), 3.0, 4.3, [0.01, 1.3, 1])],
      [T.segue - 0.5, E([-2.4, 0.9, 0.5], 6.6, 6.2, [0, 1.25, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.festas, T.camara, T.divida, T.tcm, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) =>
  v === 0 ? 'R$ 0' : v < 0.01 ? `R$ ${(v * 1000).toFixed(1).replace('.', ',').replace(/,0$/, '')} MIL` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 153,7 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 36,4 MI EM 2024', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 189,7 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 191,7 MI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'GASTOU R$ 2 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ AGOSTO, O ÚLTIMO MÊS DA CÂMARA'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ AGOSTO: R$ 158,1 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ AGOSTO: R$ 136,8 MI'},
    {a: T.mais26, b: T.comprometeu, texto: 'SOBRARAM R$ 21,4 MI', destaque: true},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'JÁ COMPROMETIDO (EMPENHADO): R$ 189,5 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.jan, texto: 'AGORA REPARA'},
    {a: T.jan, b: T.comb, texto: 'DE JANEIRO A AGOSTO · 2024 · 2025 · 2026'},
    {a: T.comb, b: T.loc, texto: 'COMBUSTÍVEL: R$ 1,7 MI → R$ 2,5 MI → R$ 4,2 MI', destaque: true},
    {a: T.loc, b: T.limp, texto: 'ALUGUEL DE VEÍCULOS E MÁQUINAS: R$ 2,3 → 3,6 → 3,9 MI', destaque: true},
    {a: T.limp, b: T.festas, texto: 'LIMPEZA PÚBLICA: R$ 3,1 MI → R$ 3,8 MI → R$ 5,1 MI', destaque: true},
    {a: T.festas, b: T.fe25, texto: 'BANDAS E PALCOS 2024: R$ 1,8 MI'},
    {a: T.fe25, b: T.fe26, texto: 'BANDAS E PALCOS 2025: R$ 4,1 MI', destaque: true},
    {a: T.fe26, b: T.passaram, texto: 'BANDAS E PALCOS 2026, ATÉ AGOSTO: R$ 2,2 MI', destaque: true},
    {a: T.passaram, b: T.camara, texto: 'CULTURA R$ 4,8 MI x ASSISTÊNCIA R$ 4,2 MI (ATÉ AGO)', destaque: true},
    {a: T.camara, b: T.consult, texto: 'A CÂMARA RECEBEU EM 2025: R$ 6,1 MI'},
    {a: T.consult, b: T.ccomb, texto: 'CONSULTORIA DA CÂMARA 2025: R$ 551 MIL', destaque: true},
    {a: T.ccomb, b: T.prazo, texto: 'COMBUSTÍVEL DA CÂMARA 2025: R$ 365 MIL', destaque: true},
    {a: T.prazo, b: T.divida, texto: '7 DE 8 PRESTAÇÕES DE 2026 FORA DO PRAZO', destaque: true},
    {a: T.divida, b: T.entraram, texto: 'DÍVIDA PARCELADA COM O INSS, FIM DE 2024: R$ 143 MI'},
    {a: T.entraram, b: T.div25, texto: 'ENTRARAM EM 2025: R$ 81,3 MI', destaque: true},
    {a: T.div25, b: T.maisQue, texto: 'FIM DE 2025: R$ 215,8 MI', destaque: true},
    {a: T.maisQue, b: T.tcm, texto: 'MAIS QUE A RECEITA DE 2025: R$ 189,7 MI', destaque: true},
    {a: T.tcm, b: T.improc, texto: '14 PROCESSOS NO TCM, ABERTOS EM 2025 E 2026'},
    {a: T.improc, b: T.esperam, texto: '1 JULGADO IMPROCEDENTE'},
    {a: T.esperam, b: T.gastar, texto: '13 AINDA SEM JULGAMENTO', destaque: true},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.comb2, texto: 'COMBUSTÍVEL 2026, SÓ ATÉ AGOSTO: R$ 4,2 MI...', destaque: true},
    {a: T.comb2, b: T.segue, texto: '...O ANO INTEIRO DE 2024: R$ 3 MI', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E DESPESA DEZ/2024 (PCMGE015) · TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 E DESPESA DEZ/2025 · TCM-BA'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: DESPESA DEZ/2025 (PCMGE015) · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: RECEITA E DESPESA AGO/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: DESPESA AGO/2026 (PCMGE015) · TCM-BA'},
  {a: T.repara, b: T.festas, texto: 'FONTE: DESPESA AGO/2024, AGO/2025 E AGO/2026 · TCM-BA'},
  {a: T.festas, b: T.camara, texto: 'FONTE: ELEMENTOS DE BANDAS E PALCOS · FUNÇÕES 13 E 08 · TCM-BA'},
  {a: T.camara, b: T.divida, texto: 'FONTE: RAZÃO E DESPESA DA CÂMARA · E-TCM · TCM-BA'},
  {a: T.divida, b: T.tcm, texto: 'FONTE: DÍVIDA FUNDADA 2024 E 2025 · TCM-BA'},
  {a: T.tcm, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES · CONSULTA EM 10/11/2026'},
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
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: v < 0.01 ? C.alerta : CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  const azul = mistura(tema.objetoClaro, tema.festa!.turquesa, 0.55);
  // os três gastos: a plaquinha do ano sai quando o grupo seguinte entra (só o grupo da vez fica escrito)
  const g = (id: keyof typeof TM, a: number, b: number, sub: string, k: number): Rot => ({a, b, p: topo(TM[id].p, TM[id].v, ESC_A), valor: fmtV(TM[id].v), sub, cor: CA[k]});
  r.push(
    g('c24', T.comb + 0.7, T.loc + 0.2, 'COMBUSTÍVEL · 2024', 0),
    g('c25', T.c25 + 0.4, T.loc + 0.2, '2025', 1),
    g('c26', T.c26 + 0.4, T.loc + 0.2, '2026', 2),
    g('l24', T.loc + 0.9, T.limp + 0.2, 'ALUGUEL · 2024', 0),
    g('l25', T.l25 + 0.4, T.limp + 0.2, '2025', 1),
    g('l26', T.l26 + 0.4, T.limp + 0.2, '2026', 2),
    g('p24', T.limp + 0.7, T.festas + 0.2, 'LIMPEZA · 2024', 0),
    g('p25', T.p25 + 0.4, T.festas + 0.2, '2025', 1),
    g('p26', T.p26 + 0.4, T.festas + 0.2, '2026', 2),
  );
  // as festas e cultura e festas x assistência social em 2026
  const fimF = T.camara - 0.1;
  r.push(
    {a: T.festas + 0.6, b: T.passaram + 0.2, p: topo(FE.f24.p, FE.f24.v, ESC_A), valor: 'R$ 1,8 MI', sub: 'BANDAS E PALCOS · 2024', cor: CA[0]},
    {a: T.fe25 + 0.4, b: T.passaram + 0.2, p: topo(FE.f25.p, FE.f25.v, ESC_A), valor: 'R$ 4,1 MI', sub: '2025', cor: CA[1]},
    {a: T.fe26 + 0.8, b: T.passaram + 0.2, p: topo(FE.f26.p, FE.f26.v, ESC_A), valor: 'R$ 2,2 MI', sub: '2026 ATÉ AGO', cor: CA[2]},
    {a: T.passaram + 0.8, b: fimF, p: topo(FE.cul26.p, FE.cul26.v, ESC_A), valor: 'R$ 4,8 MI', sub: 'CULTURA · 2026 ATÉ AGO', cor: CA[2]},
    {a: T.passaram + 1.2, b: fimF, p: topo(FE.as26.p, FE.as26.v, ESC_A), valor: 'R$ 4,2 MI', sub: 'ASSISTÊNCIA · 2026 ATÉ AGO', cor: azul},
  );
  // a Câmara e a dívida com o INSS
  r.push(
    {a: T.camara + 1.0, b: T.divida - 0.1, p: topo(CM.rec.p, CM.rec.v, ESC_C, 3), valor: 'R$ 6,1 MI', sub: 'RECEBEU · 2025', cor: CA[1]},
    {a: T.consult + 0.5, b: T.divida - 0.1, p: topo(CM.cons.p, CM.cons.v, ESC_C), valor: 'R$ 551 MIL', sub: 'CONSULTORIA · 2025', cor: C.alerta},
    {a: T.ccomb + 0.4, b: T.divida - 0.1, p: topo(CM.comb.p, CM.comb.v, ESC_C), valor: 'R$ 365 MIL', sub: 'COMBUSTÍVEL · 2025', cor: C.alerta},
    {a: T.divida + 1.4, b: T.tcm - 0.2, p: topo(RY.d24.p, RY.d24.v, ESC_R), valor: 'R$ 143 MI', sub: 'INSS · FIM DE 2024'},
    {a: T.entraram + 0.7, b: T.tcm - 0.2, p: topo(RY.ent.p, RY.ent.v, ESC_R), valor: 'R$ 81,3 MI', sub: 'ENTROU EM 2025', cor: C.alerta},
    {a: T.div25 + 0.5, b: T.tcm - 0.2, p: topo(RY.d25.p, RY.d25.v, ESC_R), valor: 'R$ 215,8 MI', sub: 'INSS · FIM DE 2025', cor: C.alerta},
    {a: T.maisQue + 0.5, b: T.tcm - 0.2, p: topo(RY.rec25.p, RY.rec25.v, ESC_R), valor: 'R$ 189,7 MI', sub: 'ARRECADOU EM 2025', cor: CA[1]},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.5, p: topo(TM.c26.p, TM.c26.v, ESC_A), valor: 'R$ 4,2 MI', sub: 'COMBUSTÍVEL · 2026 ATÉ AGO', cor: tema.acento},
    {a: T.comb2 + 0.6, b: T.segue + 0.5, p: topo(C24ANO.p, C24ANO.v, ESC_A), valor: 'R$ 3 MI', sub: 'COMBUSTÍVEL · 2024 INTEIRO', cor: CA[0]},
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
  const miolo = vis(t, T.repara + 0.2, FIM + 2);
  const cincoMi = t >= T.divida && t < T.gastar;
  const semEscala = t >= T.tcm && t < T.gastar;
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : cincoMi ? 'AQUI, 1 PILHA = R$ 20 MILHÕES' : 'AQUI, 1 PILHA = R$ 250 MIL';
  const escK = Math.max(placarK, miolo) * (semEscala ? 1 - Math.min(1, janela(t, T.tcm - 0.2, T.gastar - 0.3, 0.3)) : 1);
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
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · RECEITA AGO/2026 · TCM-BA' : t < T.prec - 0.1 ? 'FONTE: BALANÇO ORÇAMENTÁRIO 2024 · TCM-BA' : 'FONTE: RECEITA DEZ/2024 (PCMGE016) · TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/inhambupe.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.c26, T.l26, T.p26, T.fe26, T.passaram, T.consult, T.prazo, T.entraram, T.div25, T.maisQue, T.esperam];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);


// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('190 milhoes em 2024'), quando('189 milhoes e 700 em 2025'), quando('158 milhoes ate agosto')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.comb, T.c25, T.loc, T.l25, T.limp, T.p25, T.festas, T.fe25, T.camara, T.divida, T.improc].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.c26, T.l26, T.p26, T.fe26, T.passaram, T.consult, T.ccomb, T.prazo, T.entraram, T.div25, T.maisQue, T.esperam].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.comb2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, 12.5, T.ano24 + 0.6, T.arrec24 + 1.2, T.prec + 1.5, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.mais26 + 1.0, T.comprometeu + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.jan + 1.0, T.c26 + 1.0, T.l26 + 1.0, T.p26 + 1.0, T.fe25 + 0.8, T.fe26 + 1.4, T.passaram + 1.8,
  T.camara + 1.6, T.consult + 0.9, T.ccomb + 0.8, T.prazo + 1.0, T.divida + 1.8, T.entraram + 1.0, T.div25 + 1.0, T.maisQue + 1.2,
  T.tcm + 1.2, T.improc + 1.0, T.esperam + 1.2, T.pc + 1.0, T.gastar - 0.5,
  T.gastar + 0.5, T.porque + 1.2, T.comb2 + 1.4, T.segue + 1.0, FIM - 0.4,
];


type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoInhambupeTcm: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="INHAMBUPE" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Combustível', '2024: R$ 3 mi.', 'Até ago/2026:', 'R$ 4,2 mi.'];
export const CapaOrcamentoInhambupeTcm: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · INHAMBUPE · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 100 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
