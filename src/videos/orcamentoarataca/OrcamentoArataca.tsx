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

// 128. orçamento de Arataca (BA) (perfil @eumagnoleite). MOLDE: 116 Piatã / 115 Caculé / 093 Ilhéus (brief _brief-lote-40.md).
// O Kit Mapas abre (voo até Arataca, as três receitas e a de 2024 com o precatório do Fundef: projetos/128.../mapas/arataca.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 1 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setores (~/Documents/RECEITAS-DESPESAS-ARATACA/scripts/setores.py): PCMGE015 da Prefeitura
// + PCMGE015 da Câmara, fechando centavo a centavo com o Balanço (2024, 2025) e com o razão consolidado PCMGE064 (2026). Setor pela FUNÇÃO.
// Em 2025 os festejos juninos (ação na função Educação) foram para Cultura e festas, como diz a fala.
// Sem porcentagem, sem nome de gestor, sem nome de empresa contratada, sem nome de pessoa nos processos.
// SÓ DADOS DE ARATACA, todos do TCM-BA: projetos/128.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 177.06; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 15 partes + 0,35 s, pausas 0,28 s, atempo 1,10, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '128. orçamento de arataca';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 75'),
  arrec24: quando('Arrecadou 75 milhoes Disso'),
  prec: quando('Disso 16 milhoes'),
  gastou24: quando('Gastou 77'),
  mais24: quando('Gastou 2 milhoes e 400'),
  ano25: quando('2025 Arrecadou 61'),
  arrec25: quando('Arrecadou 61 milhoes e 900 Gastou'),
  gastou25: quando('Gastou 67'),
  mais25: quando('Gastou 5 milhoes'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 57'),
  gastou26: quando('Gastou 55'),
  mais26: quando('Sobraram 2'),
  comprometeu: quando('E ja comprometeu'),
  repara: quando('Agora repara'),
  f24: quando('As festas tradicionais'),
  f25: quando('E 3 milhoes e 200 em 2025'),
  jun: quando('Em 2025 1 milhao e 100'),
  junEdu: quando('na conta da educacao'),
  naoExp: quando('As contas nao explicam'),
  passaram: quando('E so as festas passaram'),
  ajuda: quando('A ajuda de emergencia para as familias ficou em 90'),
  aj25: quando('e 368 mil em 2025'),
  aj26: quando('Em 2026 ate setembro subiu'),
  f26: quando('E as festas cairam'),
  camara: quando('A Camara recebeu'),
  devolveu: quando('e devolveu 232'),
  consult: quando('Com consultoria'),
  cons26: quando('e 153 mil'),
  divida: quando('A divida parcelada'),
  div24: quando('Fechou 2024 em 35'),
  div25: quando('E fechou 2025 em 34'),
  tcm: quando('No Tribunal de Contas 7'),
  esperam: quando('ainda esperam julgamento'),
  p1: quando('compras sem prova'),
  p2: quando('terceirizacao'),
  p3: quando('remedios'),
  p4: quando('peixes da Semana'),
  p5: quando('acumulo de cargos'),
  p6: quando('e dois contratos da Camara'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se em 2025'),
  festas2: quando('por que as festas'),
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
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 77.43, rotulo: '2024', falta: {t: T.mais24, v: 2.3752, txt: 'A MAIS'}, entradas: lista(1, [38.397, 12.384, 8.4026, 6.6056, 1.7749, 3.5848, 1.5436, 3.437, 0.33047, 0.96991])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 67.646, rotulo: '2025', falta: {t: T.mais25, v: 5.7779, txt: 'A MAIS'}, entradas: lista(2, [27.913, 13.167, 8.3532, 5.7236, 2.2131, 3.0774, 2.3964, 3.2844, 0.34201, 1.1769])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 54.964, rotulo: '2026 · ATÉ SET', falta: {t: T.mais26, v: 2.5516, txt: 'SOBRARAM', sobra: true}, entradas: lista(3, [22.455, 10.628, 8.0871, 5.3339, 1.8426, 3.5389, 1.7776, 0.2511, 0.31186, 0.73844])},
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
const ESCALA = 1; // 1 pilha = R$ 1 mi (~55 a 77 mi por ano)
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
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Cada gaveta tem a sua escala (o placar diz qual).
const LADO_A = 2;
const PASSO_A = 0.25;
const ZA = 0.2;
// na frente (1 pilha = R$ 200 mil): festas 2024 e 2025, a parte de 2025 lançada na Educação (festejos juninos),
// a assistência social inteira de 2025, a ajuda de emergência às famílias (benefícios eventuais) de 2024, 2025 e 2026 e as festas de 2026
const ESC_A = 0.2;
const FA = {
  f24: {p: [-5.1, 0, ZA] as V3, v: 3.3161},
  f25: {p: [-4.45, 0, ZA] as V3, v: 3.2109},
  jun: {p: [-3.8, 0, ZA] as V3, v: 1.0921},
  as25: {p: [-3.15, 0, ZA] as V3, v: 3.0774},
  aj24: {p: [-2.3, 0, ZA] as V3, v: 0.08968},
  aj25: {p: [-1.7, 0, ZA] as V3, v: 0.36791},
  aj26: {p: [-1.1, 0, ZA] as V3, v: 1.4474},
  f26: {p: [-0.5, 0, ZA] as V3, v: 0.16717},
};
const GAV_X = -2.8;
// atrás do cofre, à esquerda (1 pilha = R$ 200 mil): a Câmara em 2025 (recebeu e devolveu) e a consultoria de 2025 e 2026;
// à direita (1 pilha = R$ 5 mi): a dívida com o INSS no começo de 2024, no fim de 2024 e no fim de 2025
const ZD = -2.0;
const ESC_C = 0.2;
const CM = {
  rec: {p: [-3.6, 0, ZD] as V3, v: 2.6286},
  dev: {p: [-2.95, 0, ZD] as V3, v: 0.23217},
  cons: {p: [-2.3, 0, ZD] as V3, v: 0.2125},
  c26: {p: [-1.7, 0, ZD] as V3, v: 0.153},
};
const ESC_R = 5;
const RY = {
  d23: {p: [0.75, 0, ZD] as V3, v: 31.767},
  d24: {p: [1.75, 0, ZD] as V3, v: 35.426},
  d25: {p: [2.75, 0, ZD] as V3, v: 34.028},
};
// ★ os 7 processos do TCM abertos em 2025 e 2026, sem julgamento: uma fila de pastas na frente da mesa, cada uma sobe no assunto
const ZP = 0.8; // no meio da mesa (o cofre já sumiu): as torres da Educação, na frente, não tapam a câmera baixa
const PROC: {t: () => number; titulo: string; valor: string; x: number}[] = [
  {t: () => T.p1, titulo: 'COMPRAS', valor: 'ENTREGA?', x: -3.9},
  {t: () => T.p2, titulo: 'TERCEIRIZAÇÃO', valor: 'MÃO DE OBRA', x: -2.6},
  {t: () => T.p3, titulo: 'REMÉDIOS', valor: 'REG. PREÇO', x: -1.3},
  {t: () => T.p4, titulo: 'PEIXES', valor: 'SEMANA SANTA', x: 0.0},
  {t: () => T.p5, titulo: 'CARGOS', valor: 'ACÚMULO', x: 1.3},
  {t: () => T.p6, titulo: 'CÂMARA', valor: 'CONTRATO 003', x: 2.6},
  {t: () => T.p6 + 0.45, titulo: 'CÂMARA', valor: 'CONTRATO 015', x: 3.9},
];
const posProc = (k: number): V3 => [PROC[k].x, 0, ZP];
// as festas somem quando a Câmara entra e voltam na pergunta final
const FA_VIS = (t: number) => vis(t, T.repara - 0.2, T.camara - 0.15) + vis(t, T.gastar - 0.1, FIM + 2);
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
    // torre verde na frente do cofre: o que sobrou em cada ano
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
  const azul = mistura(tema.objetoClaro, tema.festa!.turquesa, 0.55);
  // festas 2024 e 2025, a parte na Educação, a assistência 2025, a ajuda de emergência dos três anos e as festas de 2026
  const fa = FA_VIS(t);
  if (fa > 0.01) {
    const k0 = cresce(T.f24 + 0.3) * fa;
    if (k0 > 0.01) solidas.push(...torre(FA.f24.p, tAk(FA.f24.v, ESC_A, k0), LADO_A, CA[0], PASSO_A));
    const k1 = cresce(T.f25 + 0.3) * fa;
    if (k1 > 0.01) solidas.push(...torre(FA.f25.p, tAk(FA.f25.v, ESC_A, k1), LADO_A, CA[1], PASSO_A));
    const kj = cresce(T.jun + 0.4) * fa;
    if (kj > 0.01) solidas.push(...torre(FA.jun.p, tAk(FA.jun.v, ESC_A, kj), LADO_A, claro, PASSO_A));
    const ka = cresce(T.passaram + 0.4) * fa;
    if (ka > 0.01) solidas.push(...torre(FA.as25.p, tAk(FA.as25.v, ESC_A, ka), LADO_A, azul, PASSO_A));
    const a0 = cresce(T.ajuda + 0.6, 0.6) * fa;
    if (a0 > 0.01) solidas.push(...torre(FA.aj24.p, tAk(FA.aj24.v, ESC_A, a0), LADO_A, mistura(C.alerta, CA[0], 0.35), PASSO_A));
    const a1 = cresce(T.aj25 + 0.2, 0.6) * fa;
    if (a1 > 0.01) solidas.push(...torre(FA.aj25.p, tAk(FA.aj25.v, ESC_A, a1), LADO_A, vermelho, PASSO_A));
    const a2 = cresce(T.aj26 + 0.5) * fa * (final ? 0 : 1);
    if (a2 > 0.01) solidas.push(...torre(FA.aj26.p, tAk(FA.aj26.v, ESC_A, a2), LADO_A, mistura(C.alerta, CA[2], 0.4), PASSO_A));
    const k2 = cresce(T.f26 + 0.3) * fa * (final ? 0 : 1);
    if (k2 > 0.01) solidas.push(...torre(FA.f26.p, tAk(FA.f26.v, ESC_A, k2), LADO_A, CA[2], PASSO_A));
  }
  // a Câmara (recebeu e devolveu em 2025, consultoria de 2025 e 2026) e a dívida com o INSS
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const a0 = cresce(T.camara + 0.6) * cm;
    if (a0 > 0.01) solidas.push(...torre(CM.rec.p, tAk(CM.rec.v, ESC_C, a0), LADO_A, CA[1], PASSO_A));
    const a1 = cresce(T.devolveu + 0.3, 0.6) * cm;
    if (a1 > 0.01) solidas.push(...torre(CM.dev.p, tAk(CM.dev.v, ESC_C, a1), LADO_A, claro, PASSO_A));
    const a4 = cresce(T.consult + 0.6) * cm;
    if (a4 > 0.01) solidas.push(...torre(CM.cons.p, tAk(CM.cons.v, ESC_C, a4), LADO_A, vermelho, PASSO_A));
    const a5 = cresce(T.cons26 + 0.2) * cm;
    if (a5 > 0.01) solidas.push(...torre(CM.c26.p, tAk(CM.c26.v, ESC_C, a5), LADO_A, mistura(C.alerta, CA[2], 0.4), PASSO_A));
    const r0k = cresce(T.divida + 0.6) * cm;
    if (r0k > 0.01) solidas.push(...torre(RY.d23.p, tAk(RY.d23.v, ESC_R, r0k), LADO_A, mistura(C.alerta, tema.objetoClaro, 0.45), PASSO_A));
    const r1k = cresce(T.div24 + 0.3) * cm;
    if (r1k > 0.01) solidas.push(...torre(RY.d24.p, tAk(RY.d24.v, ESC_R, r1k), LADO_A, mistura(C.alerta, tema.objetoClaro, 0.2), PASSO_A));
    const r3k = cresce(T.div25 + 0.2) * cm;
    if (r3k > 0.01) solidas.push(...torre(RY.d25.p, tAk(RY.d25.v, ESC_R, r3k), LADO_A, C.alerta, PASSO_A));
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
  const fa = FA_VIS(t);
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

      {/* festas x ajuda às famílias (frente); Câmara e dívida com o INSS (atrás do cofre); processos do TCM (fila na frente) */}
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={fa} larg={5.6} texto="FESTAS x AJUDA ÀS FAMÍLIAS" aceso={Math.max(janela(t, T.repara, T.camara, 0.4), janela(t, T.porque, T.segue, 0.4))} />
      <BaseGaveta tema={tema} pos={[-2.65, 0, ZD]} sobe={cm} larg={2.9} texto="CÂMARA" aceso={janela(t, T.camara, T.divida, 0.4)} />
      <BaseGaveta tema={tema} pos={[1.75, 0, ZD]} sobe={cm} larg={3.2} texto="DÍVIDA COM O INSS" aceso={janela(t, T.divida, T.tcm, 0.4)} />
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
          carimbo={rampa(t, T.esperam + k * 0.12, T.esperam + 0.4 + k * 0.12)}
          textoCarimbo="SEM JULGAMENTO"
          corCarimbo={mistura(C.alerta, tema.objetoClaro, 0.2)}
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
  // festas 2024 e 2025, a parte de 2025 na Educação e a assistência social de 2025 (frente, à esquerda)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([GAV_X, 1.0, 0.6], 7.2, 6.8, [0, 1.7, 1])],
      [T.f24 + 0.5, E(soma(meio(FA.f24.p, FA.f25.p), [0, 1.3, 0]), 3.2, 5.0, [-0.04, 1.3, 1])],
      [T.jun - 0.3, E(soma(meio(FA.f24.p, FA.f25.p), [0, 1.3, 0]), 3.2, 5.0, [-0.03, 1.3, 1])],
      [T.jun + 0.3, E(soma(meio(FA.f25.p, FA.jun.p), [0, 1.0, 0]), 3.2, 4.8, [-0.02, 1.3, 1])],
      [T.passaram - 0.3, E(soma(meio(FA.f25.p, FA.jun.p), [0, 1.0, 0]), 3.2, 4.8, [-0.015, 1.3, 1])],
      [T.passaram + 0.3, E(soma(meio(FA.f25.p, FA.as25.p), [0, 1.3, 0]), 3.6, 5.0, [-0.01, 1.3, 1])],
      [T.ajuda - 0.4, E(soma(meio(FA.f25.p, FA.as25.p), [0, 1.3, 0]), 3.6, 5.0, [-0.005, 1.3, 1])],
    ],
  },
  // a ajuda de emergência às famílias 2024, 2025 e 2026 e as festas de 2026 (frente, no meio)
  {
    ini: T.ajuda - 0.2,
    arco: 0.03,
    chaves: [
      [T.ajuda - 0.2, E(soma(meio(FA.aj24.p, FA.aj25.p), [0, 0.6, 0]), 3.0, 4.3, [0.0, 1.2, 1])],
      [T.aj26 - 0.3, E(soma(meio(FA.aj24.p, FA.aj25.p), [0, 0.6, 0]), 3.0, 4.3, [0.005, 1.2, 1])],
      [T.aj26 + 0.4, E(soma(meio(FA.aj25.p, FA.f26.p), [0, 0.8, 0]), 3.4, 4.6, [0.01, 1.2, 1])],
      [T.camara - 0.4, E(soma(meio(FA.aj25.p, FA.f26.p), [0, 0.8, 0]), 3.4, 4.6, [0.015, 1.2, 1])],
    ],
  },
  // atrás do cofre: a Câmara em 2025 (recebeu e devolveu) e a consultoria de 2025 e 2026
  {
    ini: T.camara - 0.2,
    arco: 0.03,
    chaves: [
      [T.camara - 0.2, E(soma(meio(CM.rec.p, CM.dev.p), [0, 0.9, 0]), 3.0, 4.4, [-0.03, 1.3, 1])],
      [T.consult - 0.4, E(soma(meio(CM.rec.p, CM.dev.p), [0, 0.9, 0]), 3.0, 4.4, [-0.02, 1.3, 1])],
      [T.consult + 0.1, E(soma(meio(CM.dev.p, CM.c26.p), [0, 0.6, 0]), 3.2, 4.3, [-0.01, 1.3, 1])],
      [T.divida - 0.4, E(soma(meio(CM.dev.p, CM.c26.p), [0, 0.6, 0]), 3.2, 4.3, [0.0, 1.3, 1])],
    ],
  },
  // a dívida parcelada com o INSS: começo de 2024, fim de 2024 e fim de 2025
  {
    ini: T.divida - 0.2,
    arco: 0.03,
    chaves: [
      [T.divida - 0.2, E(soma(meio(RY.d23.p, RY.d24.p), [0, 1.2, 0]), 3.4, 5.0, [0.02, 1.4, 1])],
      [T.div24 - 0.3, E(soma(meio(RY.d23.p, RY.d24.p), [0, 1.3, 0]), 3.4, 5.0, [0.03, 1.4, 1])],
      [T.div25 + 0.2, E(soma(meio(RY.d23.p, RY.d25.p), [0, 1.4, 0]), 4.4, 5.4, [0.04, 1.4, 1])],
      [T.tcm - 0.4, E(soma(meio(RY.d23.p, RY.d25.p), [0, 1.4, 0]), 4.4, 5.5, [0.05, 1.4, 1])],
    ],
  },
  // ★ os processos do TCM: as pastas sobem uma a uma no assunto; câmera de frente e baixa, de duas em duas
  {
    ini: T.tcm - 0.2,
    arco: 0.02,
    chaves: [
      [T.tcm - 0.2, E([0, 0.9, ZP], 9.0, 5.2, [0, 1.0, 1])],
      [T.p1 - 0.3, E([0, 0.9, ZP], 8.6, 5.0, [0, 1.0, 1])],
      [T.p1 + 0.2, E([(PROC[0].x + PROC[1].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.p3 - 0.2, E([(PROC[1].x + PROC[2].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.p4 - 0.1, E([(PROC[2].x + PROC[3].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.p5 - 0.1, E([(PROC[3].x + PROC[4].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.p6 - 0.1, E([(PROC[4].x + PROC[5].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.p6 + 0.9, E([(PROC[5].x + PROC[6].x) / 2, 1.0, ZP], 3.2, 3.4, [0, 0.9, 1])],
      [T.gastar - 0.4, E([0, 0.9, ZP], 9.2, 5.2, [0, 1.0, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois a ajuda de 2025 (368 mil) e as festas de 2025 (3,2 mi)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-1.0, 0, 0.6], 12.0, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E(soma(FA.aj25.p, [0, 0.5, 0]), 3.2, 4.3, [0.02, 1.3, 1])],
      [T.festas2 - 0.4, E(soma(FA.aj25.p, [-0.1, 0.5, 0]), 3.2, 4.3, [0.01, 1.3, 1])],
      [T.festas2 + 0.2, E(soma(meio(FA.f25.p, FA.aj25.p), [0, 1.3, 0]), 4.6, 5.8, [0.0, 1.3, 1])],
      [T.segue - 0.5, E([-2.4, 0.9, 0.3], 6.6, 6.2, [0, 1.25, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.ajuda, T.camara, T.divida, T.tcm, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) =>
  v === 0 ? 'R$ 0' : v < 0.01 ? `R$ ${(v * 1000).toFixed(1).replace('.', ',').replace(/,0$/, '')} MIL` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 77,4 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 2,4 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 61,9 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 67,6 MI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'GASTOU R$ 5,8 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 57,5 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 55 MI'},
    {a: T.mais26, b: T.comprometeu, texto: 'SOBRARAM R$ 2,6 MI', destaque: true},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'JÁ COMPROMETIDO (EMPENHADO): R$ 58,3 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.f24, texto: 'AGORA REPARA'},
    {a: T.f24, b: T.f25, texto: 'FESTAS TRADICIONAIS 2024: R$ 3,3 MI', destaque: true},
    {a: T.f25, b: T.jun, texto: 'FESTAS EM 2025: R$ 3,2 MI', destaque: true},
    {a: T.jun, b: T.naoExp, texto: 'R$ 1,1 MI DAS FESTAS NA CONTA DA EDUCAÇÃO', destaque: true},
    {a: T.naoExp, b: T.passaram, texto: 'FESTEJOS JUNINOS · AÇÃO 12.361 (ENSINO FUNDAMENTAL)'},
    {a: T.passaram, b: T.ajuda, texto: 'FESTAS R$ 3,2 MI x ASSISTÊNCIA R$ 3,1 MI', destaque: true},
    {a: T.ajuda, b: T.aj26, texto: 'AJUDA DE EMERGÊNCIA: R$ 90 MIL E R$ 368 MIL', destaque: true},
    {a: T.aj26, b: T.f26, texto: '2026 ATÉ SETEMBRO: AJUDA SOBE PARA R$ 1,4 MI'},
    {a: T.f26, b: T.camara, texto: 'FESTAS 2026 ATÉ SETEMBRO: R$ 167 MIL'},
    {a: T.camara, b: T.devolveu, texto: 'A CÂMARA RECEBEU EM 2025: R$ 2,6 MI'},
    {a: T.devolveu, b: T.consult, texto: 'DEVOLVEU À PREFEITURA: R$ 232 MIL', destaque: true},
    {a: T.consult, b: T.cons26, texto: 'CONSULTORIA DA CÂMARA 2025: R$ 212,5 MIL', destaque: true},
    {a: T.cons26, b: T.divida, texto: 'CONSULTORIA 2026 ATÉ SETEMBRO: R$ 153 MIL', destaque: true},
    {a: T.divida, b: T.div24, texto: 'DÍVIDA COM O INSS, COMEÇO DE 2024: R$ 31,8 MI'},
    {a: T.div24, b: T.div25, texto: 'FIM DE 2024: R$ 35,4 MI', destaque: true},
    {a: T.div25, b: T.tcm, texto: 'FIM DE 2025: R$ 34 MI', destaque: true},
    {a: T.tcm, b: T.esperam, texto: '7 PROCESSOS NO TCM, ABERTOS EM 2025 E 2026'},
    {a: T.esperam, b: T.gastar, texto: 'TODOS AINDA SEM JULGAMENTO', destaque: true},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.festas2, texto: 'AJUDA DE EMERGÊNCIA 2025: R$ 368 MIL...', destaque: true},
    {a: T.festas2, b: T.segue, texto: '...FESTAS 2025: R$ 3,2 MI?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E DESPESA DEZ/2024 (PCMGE015) · TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 E DESPESA DEZ/2025 · TCM-BA'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: DESPESA DEZ/2025 (PCMGE015) · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: RECEITA E DESPESA SET/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: DESPESA SET/2026 (PCMGE015) · TCM-BA'},
  {a: T.repara, b: T.ajuda, texto: 'FONTE: AÇÕES DE FESTAS E FUNÇÃO 08 · TCM-BA'},
  {a: T.ajuda, b: T.camara, texto: 'FONTE: AÇÃO BENEFÍCIOS EVENTUAIS · TCM-BA'},
  {a: T.camara, b: T.divida, texto: 'FONTE: BALANÇO FINANCEIRO E DESPESA DA CÂMARA · TCM-BA'},
  {a: T.divida, b: T.tcm, texto: 'FONTE: ANEXO 16 DE 2024 E 2025 · TCM-BA'},
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
  const pe = (c: V3) => topo(c, 0.3, 1, 2); // torrinha baixa: a plaquinha fica no topo (fora do letreiro da gaveta)
  // festas, a parte na Educação, a assistência 2025, a ajuda de emergência e as festas de 2026
  const fimF = T.camara - 0.1;
  const azul = mistura(tema.objetoClaro, tema.festa!.turquesa, 0.55);
  r.push(
    {a: T.f24 + 0.6, b: T.passaram + 0.2, p: topo(FA.f24.p, FA.f24.v, ESC_A), valor: 'R$ 3,3 MI', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.f25 + 0.6, b: fimF, p: topo(FA.f25.p, FA.f25.v, ESC_A), valor: 'R$ 3,2 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.jun + 0.8, b: T.ajuda + 0.2, p: topo(FA.jun.p, FA.jun.v, ESC_A), valor: 'R$ 1,1 MI', sub: 'NA CONTA DA EDUCAÇÃO · 2025'},
    {a: T.passaram + 0.8, b: fimF, p: topo(FA.as25.p, FA.as25.v, ESC_A), valor: 'R$ 3,1 MI', sub: 'ASSISTÊNCIA SOCIAL · 2025', cor: azul},
    {a: T.ajuda + 0.9, b: fimF, p: pe(FA.aj24.p), valor: 'R$ 90 MIL', sub: 'AJUDA · 2024', cor: C.alerta},
    {a: T.aj25 + 0.4, b: fimF, p: topo(FA.aj25.p, FA.aj25.v, ESC_A), valor: 'R$ 368 MIL', sub: 'AJUDA · 2025', cor: C.alerta},
    {a: T.aj26 + 0.9, b: fimF, p: topo(FA.aj26.p, FA.aj26.v, ESC_A), valor: 'R$ 1,4 MI', sub: 'AJUDA · 2026 ATÉ SET', cor: C.alerta},
    {a: T.f26 + 0.5, b: fimF, p: pe(FA.f26.p), valor: 'R$ 167 MIL', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
  );
  // a Câmara e a dívida com o INSS
  r.push(
    {a: T.camara + 1.0, b: T.divida - 0.1, p: topo(CM.rec.p, CM.rec.v, ESC_C), valor: 'R$ 2,6 MI', sub: 'RECEBEU · 2025', cor: CA[1]},
    {a: T.devolveu + 0.4, b: T.divida - 0.1, p: topo(CM.dev.p, CM.dev.v, ESC_C), valor: 'R$ 232 MIL', sub: 'DEVOLVEU · 2025'},
    {a: T.consult + 1.0, b: T.divida - 0.1, p: topo(CM.cons.p, CM.cons.v, ESC_C), valor: 'R$ 212,5 MIL', sub: 'CONSULTORIA · 2025', cor: C.alerta},
    {a: T.cons26 + 0.4, b: T.divida - 0.1, p: topo(CM.c26.p, CM.c26.v, ESC_C), valor: 'R$ 153 MIL', sub: 'CONSULTORIA · 2026 ATÉ SET', cor: C.alerta},
    {a: T.divida + 1.2, b: T.tcm - 0.2, p: topo(RY.d23.p, RY.d23.v, ESC_R), valor: 'R$ 31,8 MI', sub: 'INSS · COMEÇO DE 2024'},
    {a: T.div24 + 0.6, b: T.tcm - 0.2, p: topo(RY.d24.p, RY.d24.v, ESC_R), valor: 'R$ 35,4 MI', sub: 'INSS · FIM DE 2024', cor: C.alerta},
    {a: T.div25 + 0.5, b: T.tcm - 0.2, p: topo(RY.d25.p, RY.d25.v, ESC_R), valor: 'R$ 34 MI', sub: 'INSS · FIM DE 2025', cor: C.alerta},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.5, p: topo(FA.aj25.p, FA.aj25.v, ESC_A), valor: 'R$ 368 MIL', sub: 'AJUDA DE EMERGÊNCIA · 2025', cor: tema.acento},
    {a: T.festas2 + 0.4, b: T.segue + 0.5, p: topo(FA.f25.p, FA.f25.v, ESC_A), valor: 'R$ 3,2 MI', sub: 'FESTAS · 2025', cor: tema.acento},
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
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 1 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : cincoMi ? 'AQUI, 1 PILHA = R$ 5 MILHÕES' : 'AQUI, 1 PILHA = R$ 200 MIL';
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
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · RECEITA SET/2026 · TCM-BA' : t < T.prec - 0.1 ? 'FONTE: BALANÇO ORÇAMENTÁRIO 2024 · TCM-BA' : 'FONTE: RECEITA DEZ/2024 (PCMGE016) · TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/arataca.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 10).map((e) => e.t)), T.jun, T.passaram, T.aj26, T.f26, T.devolveu, T.consult, T.div24, T.div25, T.esperam];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);


// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('75 milhoes em 2024'), quando('61 milhoes e 900 em 2025'), quando('57 milhoes e 500 ate')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.f24, T.f25, T.aj25, T.camara, T.div24, T.p1, T.p2, T.p3, T.p4, T.p5, T.p6].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.jun, T.passaram, T.ajuda, T.aj26, T.f26, T.devolveu, T.consult, T.cons26, T.divida, T.div25, T.esperam].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.festas2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
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
  T.repara + 0.6, T.f24 + 1.4, T.f25 + 1.2, T.jun + 1.4, T.naoExp + 0.8, T.passaram + 1.6, T.ajuda + 1.6, T.aj25 + 0.8, T.aj26 + 1.4, T.f26 + 1.0,
  T.camara + 1.6, T.devolveu + 0.9, T.consult + 1.4, T.cons26 + 0.9, T.divida + 1.6, T.div24 + 1.0, T.div25 + 1.2,
  T.tcm + 1.0, T.p1 + 0.8, T.p3 + 0.6, T.p5 + 0.6, T.p6 + 1.2, T.gastar - 0.5,
  T.gastar + 0.5, T.porque + 1.2, T.festas2 + 1.4, T.segue + 1.0, FIM - 0.4,
];


type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoArataca: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="ARATACA" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Festas 2025:', 'R$ 3,2 mi.', 'Emergência:', 'R$ 368 mil.'];
export const CapaOrcamentoArataca: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ARATACA · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
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