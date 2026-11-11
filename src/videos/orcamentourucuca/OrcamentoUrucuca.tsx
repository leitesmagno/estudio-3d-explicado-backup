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
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, RuaPlaca} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 061. orçamento de Uruçuca (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 059 Jequié. O Kit Mapas abre (voo até Uruçuca e o que a prefeitura arrecadou
// em 2024: projetos/061.../mapas/urucuca.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele. Orçamento de R$ 85 a 125 mi: 1 MOEDA = R$ 200 MIL e 1 PILHA = R$ 2 MI (como o 035).
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando
// sempre no mesmo sentido. Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE URUÇUCA, todos do TCM-BA
// (e a notícia do Jornal Grande Bahia sobre a BA-653): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 171.05; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,099, -15 LUFS (v liquidado, regra 32)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '061. orçamento de uruçuca';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 107'),
  gastou24: quando('Gastou 108'),
  falta24: quando('Faltaram 718'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 112'),
  gastou25: quando('Gastou 121', 2), // o gancho diz "Uruçuca gastou 121 milhões em 2025" (v liquidado)
  deficit25: quando('Sao 8 milhoes'),
  d12: quando('8 milhoes e 200 a mais'),
  ano26: quando('2026 ate agosto Arrecadou'),
  arrec26: quando('Arrecadou 78'),
  gastou26: quando('Gastou 85'),
  amais26: quando('Sao 6 milhoes'),
  empenhou: quando('ja empenhou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara'),
  praias: quando('Urucuca tem as praias'),
  tur25: quando('Em 2025 a secretaria de turismo', 2), // a 1ª é o gancho ("em 2025. A secretaria de turismo")
  fora: quando('Mais da metade'),
  tirados: quando('Durante o ano'),
  tg: quando('Gasto 1.314 reais em diarias'),
  t26: quando('Em 2026 ate agosto 29'),
  sub: quando('A subprefeitura de Serra Grande'),
  subg: quando('Gastou 303'),
  carnaval: quando('188 mil no carnaval'),
  festas: quando('E as festas'),
  f24: quando('carnaval e festas juninas tinham'),
  fg24: quando('Gasto pouco mais de 2'),
  dobro: quando('Quase o dobro'),
  estrada: quando('A estrada da sede'),
  ba50: quando('50 milhoes e 100 segundo'),
  ordem: quando('com ordem de servico'),
  tribunal: quando('Nas decisoes de auditoria'),
  gastar: quando('Gastar com festa'),
  mas: quando('Mas numa cidade'),
  turismo2: quando('por que o turismo gastou'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS, PRECATÓRIOS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'casinha', texto: 'ÁGUA'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = ['agu', 'agr', 'mam']; // zero nos três anos: casinha cinza

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.15 * Math.PI);
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
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara", "zero" e "Agricultura" se repetem
const lista = (frases: string[], v: number[], rots: Record<string, string> = {}, so: string[] = []): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agu', 'agr', 'esp', 'mam'].map((s, k) => ({s, t: quando(frases[k]), v: v[k], rot: rots[s], soPlaca: so.includes(s)}));
const ANOS: Ano[] = [
  // 2024: arrecadou 107,9 e gastou 108,7: torre vermelha do que faltou (718 mil, Balanço 2024 "DÉFICIT (VII)")
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 108.7, rotulo: '2024', falta: {t: T.falta24, v: 0.718, txt: 'A MAIS', rot: 'R$ 718 MIL A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 41', 'Saude 22', 'Administracao 16', 'Obras e servicos urbanos somando', 'Camara de Vereadores 3', 'Dividas precatorios', 'Cultura e festas 2 milhoes e 100', 'Assistencia social 2 milhoes Agua', 'Agua e saneamento zero Quem', 'Agricultura zero Esporte 106', 'Esporte 106', 'Meio ambiente zero 2025'],
      [41.495, 22.559, 16.305, 15.474, 3.012, 5.434, 2.071, 2.015, 0, 0, 0.1066, 0], {esp: 'R$ 106,6 MIL'})},
  // 2025 (regra 32: gastou = LIQUIDADO): arrecadou 112,9 e liquidou 121,0: 8,2 mi a mais (conta própria)
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 121.0, rotulo: '2025', falta: {t: T.deficit25, v: 8.175, txt: 'A MAIS', rot: 'R$ 8,2 MI A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 49', 'Saude 24', 'Administracao 20', 'Obras e servicos urbanos 17', 'Camara 3 e 700', 'Dividas 5 e 400 Cultura', 'Cultura e festas 1 milhao e 100', 'Assistencia social 2 e 200', 'Agua e saneamento zero Agricultura zero Esporte 23', 'Agricultura zero Esporte 23', 'Esporte 23', 'Meio ambiente zero 2026'],
      [49.181, 24.650, 20.287, 17.069, 3.701, 5.382, 1.101, 2.203, 0, 0, 0.0231, 0], {esp: 'R$ 23 MIL'})},
  // 2026 (Prefeitura + Câmara, até agosto): liquidado 85,5 > arrecadado 78,6: torre vermelha de 6,9 (conta própria);
  // o empenhado (112,1) vai só no chip. Esporte: R$ 44 mil das quadras das escolas, que já estão na Educação (só plaquinha)
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 85.5, rotulo: '2026 · ATÉ AGO', falta: {t: T.amais26, v: 6.905, txt: 'A MAIS', rot: 'R$ 6,9 MI A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 33', 'Saude 17', 'Administracao 13', 'Obras e servicos urbanos quase', 'Camara 2', 'Dividas 3', 'Cultura e festas 1 milhao e 900', 'Assistencia social 1 e 400', 'Agua e saneamento zero Agricultura zero Esporte 44', 'Agricultura zero Esporte 44', 'Esporte 44', 'Meio ambiente zero Agora'],
      [33.465, 17.475, 12.971, 11.951, 2.764, 3.557, 1.884, 1.428, 0, 0, 0.0444, 0], {esp: 'R$ 44 MIL · QUADRAS DAS ESCOLAS'}, ['esp'])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const entradaDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id);
const valorDe = (id: string, yi: number) => entradaDe(id, yi)?.v ?? 0;
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
const ESCALA = 2; // 1 moeda = R$ 200 mil; 1 pilha = R$ 2 milhões (como o 035 Paratinga)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; 2025 usa cerca de 66 pilhas) ----------
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

// ---------- Os achados no miolo (torres de 3 x 3, 1 pilha = R$ 1 mi), da esquerda para a direita na ordem da fala ----------
const LADO_A = 1; // uma pilha em cima da outra: o previsto vira uma torre alta e o gasto fica do lado, do tamanho que é
const ZA = 0.2;
const ESC_A = 1;
// esquerda: a Secretaria de Turismo em 2025 (previsto 6,954; tirados 4,829; gasto 1.314,50) e o gasto de 2026 até agosto (29,4 mil)
const TU = {
  prev: {p: [-3.95, 0, ZA] as V3, v: 6.954, fim: 2.125},
  g25: {p: [-2.75, 0, ZA] as V3, v: 0.0013145},
  g26: {p: [-1.95, 0, ZA] as V3, v: 0.0294},
};
// meio: a Subprefeitura de Serra Grande em 2025 (previsto 6,501; gasto 0,303: carnaval 188,2 mil + salários 115,2 mil)
const SG = {
  prev: {p: [-0.55, 0, ZA] as V3, v: 6.501},
  g25: {p: [0.65, 0, ZA] as V3, v: 0.3034},
};
// direita: carnaval e festas juninas de 2024 (previsto 1,04; gasto 2,046)
const FE = {
  p24: {p: [2.35, 0, ZA] as V3, v: 1.04},
  g24: {p: [3.55, 0, ZA] as V3, v: 2.046},
};
const TU_VIS = (t: number) => vis(t, T.repara + 0.1, T.estrada - 0.2) + vis(t, T.mas - 0.45, FIM + 2);
const SG_VIS = (t: number) => vis(t, T.sub - 0.3, T.estrada - 0.2);
const FE_VIS = (t: number) => vis(t, T.festas - 0.3, T.estrada - 0.2);
const ESTRADA_POS: V3 = [0, 0, 1.6];
const ESTRADA_VIS = (t: number) => vis(t, T.estrada - 0.1, T.tribunal - 0.1);
const TCM_POS: V3 = [0, 0, -2.6];

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
    // torre vermelha na frente do cofre: o que foi gasto a mais do que arrecadou, em cada ano
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // turismo: o previsto (fantasma) encolhe quando a voz diz que 4,8 mi foram tirados; o gasto é uma moedinha
  const tx = TU_VIS(t);
  if (tx > 0.01) {
    // na pergunta a torre volta ao previsto inteiro (a plaquinha diz R$ 6,95 MI PREVISTO)
    const encolhe = rampa(t, T.tirados + 0.3, T.tirados + 1.5) * (1 - rampa(t, T.mas - 0.6, T.mas - 0.1));
    const vPrev = TU.prev.v + (TU.prev.fim - TU.prev.v) * encolhe;
    const kp = cresce(T.tur25 + 1.2) * tx;
    if (kp > 0.01) fantasmas.push(...torre(TU.prev.p, (vPrev / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const k25 = (final ? 1 : rampa(t, T.tg, T.tg + 0.5)) * tx;
    if (k25 > 0.01) solidas.push({p: TU.g25.p, n: 0.1 * k25, cor: CA[1]});
    const k26 = rampa(t, T.t26, T.t26 + 0.5) * tx * (1 - rampa(t, T.mas - 0.6, T.mas - 0.2));
    if (k26 > 0.01) solidas.push({p: TU.g26.p, n: 0.1 * k26, cor: CA[2]});
  }
  const sx = SG_VIS(t);
  if (sx > 0.01) {
    const kp = cresce(T.sub + 1.2) * sx;
    if (kp > 0.01) fantasmas.push(...torre(SG.prev.p, (SG.prev.v / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const kg = rampa(t, T.subg, T.subg + 0.6) * sx;
    if (kg > 0.01) solidas.push({p: SG.g25.p, n: SG.g25.v * kg, cor: CA[1]});
  }
  const fx = FE_VIS(t);
  if (fx > 0.01) {
    const kp = cresce(T.f24 + 0.8) * fx;
    if (kp > 0.01) fantasmas.push(...torre(FE.p24.p, (FE.p24.v / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const kg = rampa(t, T.fg24, T.fg24 + 0.9) * fx;
    if (kg > 0.01) solidas.push(...torre(FE.g24.p, (FE.g24.v / ESC_A) * kg, LADO_A, CA[0]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.9, 0, 5.0], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.7, 0, 3.0],
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
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const tx = TU_VIS(t);
  const sx = SG_VIS(t);
  const fx = FE_VIS(t);
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

      {/* os achados: turismo (esquerda), Subprefeitura de Serra Grande (meio) e festas de 2024 (direita) */}
      <BaseGaveta tema={tema} pos={[-2.95, 0, ZA]} sobe={tx} larg={3.2} texto="TURISMO" aceso={Math.max(janela(t, T.tur25, T.sub, 0.4), janela(t, T.mas, FIM, 0.4))} />
      <BaseGaveta tema={tema} pos={[0.05, 0, ZA]} sobe={sx} larg={2.4} texto="SERRA GRANDE" aceso={janela(t, T.sub, T.festas, 0.4)} />
      <BaseGaveta tema={tema} pos={[2.95, 0, ZA]} sobe={fx} larg={2.4} texto="FESTAS 2024" aceso={janela(t, T.festas, T.estrada, 0.4)} />

      {/* a estrada do Estado (BA-653) e o Tribunal */}
      <RuaPlaca tema={tema} pos={ESTRADA_POS} escala={0.95} sobe={ESTRADA_VIS(t)} linhas={['BA-653', 'GOVERNO DO ESTADO', 'R$ 50,1 MI']} aceso={janela(t, T.estrada, T.tribunal, 0.4)} />
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={vis(t, T.tribunal - 0.2, T.gastar - 0.1)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 3.0, 1]);
// achados: câmera mais baixa (dir y 1,1) para ver a ALTURA da torre do previsto ao lado da moedinha do gasto
const PB = (c: V3, larg: number, h: number, dx = 0): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, 1.1, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha do que faltou; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.falta24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do déficit, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.d12 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que passou do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 1.0, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // achados: da esquerda para a direita (turismo, Serra Grande, festas)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 1.2, ZA], 10.4, 7.6, [0, 1.6, 1])],
      [T.tur25 - 0.1, PB(soma(TU.prev.p, [0.6, 0, 0]), 4.6, 5.6, -0.05)],
      [T.tirados + 1.4, PB(soma(TU.prev.p, [0.7, 0, 0]), 4.4, 3.8, -0.03)],
      [T.tg - 0.1, PB(soma(TU.g25.p, [-0.3, 0, 0]), 3.8, 2.6, -0.01)],
      [T.t26 + 0.4, PB(soma(TU.g26.p, [-0.4, 0, 0]), 3.8, 2.4, 0)],
      [T.sub - 0.1, PB(soma(SG.prev.p, [0.6, 0, 0]), 4.6, 5.4, 0)],
      [T.subg - 0.2, PB(soma(SG.prev.p, [0.7, 0, 0]), 4.6, 5.6, 0.005)],
      [T.carnaval + 0.2, PB(soma(SG.g25.p, [-0.5, 0, 0]), 4.6, 5.6, 0.01)],
      [T.festas - 0.1, PB(soma(FE.p24.p, [0.6, 0, 0]), 4.2, 2.8, 0.02)],
      [T.fg24 + 0.3, PB(soma(FE.g24.p, [-0.5, 0, 0]), 4.2, 3.0, 0.03)],
      [T.estrada - 0.3, PB(soma(FE.g24.p, [-0.6, 0, 0]), 4.4, 3.0, 0.04)],
    ],
  },
  // a estrada do Estado
  {
    ini: T.estrada - 0.2,
    arco: 0.02,
    chaves: [
      [T.estrada - 0.2, E(soma(ESTRADA_POS, [0, 0.8, 0]), 5.2, 4.6, [-0.05, 1.3, 1])],
      [T.tribunal - 0.3, E(soma(ESTRADA_POS, [0.1, 0.9, 0]), 4.8, 4.3, [0.05, 1.3, 1])],
    ],
  },
  // o Tribunal
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E(soma(TCM_POS, [0, 1.0, 0]), 6.2, 5.4, [-0.05, 1.3, 1])],
      [T.gastar - 0.3, E(soma(TCM_POS, [0.1, 1.0, 0]), 5.8, 5.0, [0.05, 1.3, 1])],
    ],
  },
  // a pergunta: mesa inteira e depois o turismo (previsto x 1.314 reais)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PB(soma(TU.prev.p, [0.6, 0, 0]), 4.6, 5.6, -0.02)],
      [T.turismo2 + 0.3, PB(soma(TU.g25.p, [-0.5, 0, 0]), 4.4, 5.0, 0)],
      [T.segue - 0.1, PB(soma(TU.g25.p, [-0.5, 0, 0]), 4.6, 5.0, 0.02)],
      [T.segue + 0.9, E([0, 1.0, ZA], 10.0, 7.6, [-0.1, 1.4, 1])],
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
  [0, 'URUÇUCA'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ AGOSTO'],
  [T.repara, 'AGORA REPARA: TURISMO'],
  [T.sub, 'SUBPREFEITURA DE SERRA GRANDE'],
  [T.festas, 'E AS FESTAS?'],
  [T.estrada, 'OBRA DO ESTADO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falta24, texto: 'GASTOU EM 2024: R$ 108,7 MILHÕES'},
    {a: T.falta24, b: Y0.entradas[0].t, texto: 'FALTARAM R$ 718 MIL EM 2024', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 112,9 MI'},
    {a: T.gastou25, b: T.deficit25, texto: 'GASTOU EM 2025: R$ 121 MILHÕES'},
    {a: T.deficit25, b: Y1.entradas[0].t, texto: 'R$ 8,2 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ AGOSTO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ AGOSTO: R$ 78,6 MI'},
    {a: T.gastou26, b: T.amais26, texto: 'GASTOU ATÉ AGOSTO: R$ 85,5 MI (PREFEITURA + CÂMARA)'},
    {a: T.amais26, b: T.empenhou, texto: 'R$ 6,9 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.empenhou, b: T.folha, texto: 'JÁ EMPENHOU (RESERVOU PARA PAGAR): R$ 112,1 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'UMA PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      const extra = e.s === 'agu' && y === ANOS[0] ? ' · QUEM OPERA É A EMBASA' : e.s === 'obr' && y === ANOS[0] ? ' (TODA A SECRETARIA)' : '';
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}${extra}`});
    });
  });
  c.push(
    {a: T.repara, b: T.tur25, texto: 'URUÇUCA TEM AS PRAIAS DE SERRA GRANDE'},
    {a: T.tur25, b: T.fora, texto: 'TURISMO 2025 · PREVISTO: R$ 6,95 MI'},
    {a: T.fora, b: T.tirados, texto: 'MAIS DA METADE DEPENDIA DE CONVÊNIOS E REPASSES'},
    {a: T.tirados, b: T.tg, texto: 'TIRADOS DURANTE O ANO: R$ 4,8 MI'},
    {a: T.tg, b: T.t26, texto: 'TURISMO 2025 · GASTO: R$ 1.314,50 (DIÁRIAS)', destaque: true},
    {a: T.t26, b: T.sub, texto: 'TURISMO 2026 ATÉ AGOSTO: R$ 29,4 MIL'},
    {a: T.sub, b: T.subg, texto: 'SUBPREFEITURA DE SERRA GRANDE · PREVISTO 2025: R$ 6,5 MI'},
    {a: T.subg, b: T.carnaval, texto: 'GASTOU EM 2025: R$ 303 MIL', destaque: true},
    {a: T.carnaval, b: T.festas, texto: 'R$ 188 MIL NO CARNAVAL · R$ 115 MIL EM SALÁRIOS'},
    {a: T.festas, b: T.f24, texto: 'E AS FESTAS?'},
    {a: T.f24, b: T.fg24, texto: 'CARNAVAL E FESTAS JUNINAS 2024 · PREVISTO: R$ 1,04 MI'},
    {a: T.fg24, b: T.dobro, texto: 'GASTO EM 2024: R$ 2,05 MI', destaque: true},
    {a: T.dobro, b: T.estrada, texto: 'QUASE O DOBRO DO PREVISTO', destaque: true},
    {a: T.estrada, b: T.ba50, texto: 'BA-653: DA SEDE ATÉ SERRA GRANDE'},
    {a: T.ba50, b: T.ordem, texto: 'OBRA DO ESTADO: R$ 50,1 MI', destaque: true},
    {a: T.ordem, b: T.tribunal, texto: 'ORDEM DE SERVIÇO EM MAIO DE 2026, SEGUNDO O JORNAL GRANDE BAHIA'},
    {a: T.tribunal, b: T.gastar, texto: 'NENHUMA DECISÃO DE AUDITORIA SOBRE 2024, 2025 OU 2026'},
    {a: T.gastar, b: T.mas, texto: 'GASTAR COM FESTA NÃO É CRIME'},
    {a: T.mas, b: T.turismo2, texto: 'URUÇUCA TEM AS PRAIAS DE SERRA GRANDE'},
    {a: T.turismo2, b: T.segue, texto: 'POR QUE O TURISMO GASTOU R$ 1.314,50 EM 2025?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E PCMGE015 DEZ/2025 · LIQUIDADO · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA AGO/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.estrada, texto: 'FONTE: DESPESA POR AÇÃO E ANEXO 6 · TCM-BA'},
  {a: T.estrada, b: T.tribunal, texto: 'FONTE: JORNAL GRANDE BAHIA, 21/05/2026'},
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
    r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: C.alerta});
  });
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.35, v / ESC_A), LADO_A) + 0.3, 0]);
  const fimA = T.estrada - 0.05;
  r.push(
    {a: T.tur25 + 1.4, b: T.tirados + 0.4, p: topo(TU.prev.p, TU.prev.v), valor: 'R$ 6,95 MI', sub: 'PREVISTO · 2025'},
    {a: T.tirados + 1.0, b: T.sub, p: topo(TU.prev.p, TU.prev.fim), valor: 'R$ 4,8 MI TIRADOS', sub: 'DURANTE 2025'},
    {a: T.tg + 0.5, b: T.sub, p: soma(TU.g25.p, [0, 0.55, 0]), valor: 'R$ 1.314,50', sub: 'GASTO · 2025', cor: C.alerta},
    {a: T.t26 + 0.5, b: T.sub, p: soma(TU.g26.p, [0, 0.55, 0]), valor: 'R$ 29,4 MIL', sub: 'GASTO · 2026 ATÉ AGO', cor: CA[2]},
    {a: T.sub + 1.4, b: T.festas, p: topo(SG.prev.p, SG.prev.v), valor: 'R$ 6,5 MI', sub: 'PREVISTO · 2025'},
    {a: T.subg + 0.5, b: T.festas, p: soma(SG.g25.p, [0, 0.8, 0]), valor: 'R$ 303 MIL', sub: 'GASTO · 2025', cor: CA[1]},
    {a: T.f24 + 1.0, b: fimA, p: topo(FE.p24.p, FE.p24.v), valor: 'R$ 1,04 MI', sub: 'PREVISTO · 2024'},
    {a: T.fg24 + 0.7, b: fimA, p: topo(FE.g24.p, FE.g24.v), valor: 'R$ 2,05 MI', sub: 'GASTO · 2024', cor: CA[0]},
  );
  // a pergunta
  r.push(
    {a: T.mas + 0.6, b: T.segue + 0.8, p: topo(TU.prev.p, TU.prev.v), valor: 'R$ 6,95 MI', sub: 'PREVISTO · TURISMO 2025'},
    {a: T.turismo2 + 0.5, b: T.segue + 0.8, p: soma(TU.g25.p, [0, 0.55, 0]), valor: 'R$ 1.314,50', sub: 'GASTO · TURISMO 2025', cor: C.alerta},
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
  const miolo = vis(t, T.repara + 0.2, T.estrada - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI' : '1 MOEDA = R$ 200 MIL · 1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // ★ melhoria (gancho visual): enquanto a voz diz "121 milhões em 2025. A secretaria de turismo, 1.314 reais",
    // os dois números entram no mapa
    const g1 = quando('gastou 121'), g2 = quando('A secretaria de turismo 1.314');
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, 5.5, 5.85));
    const kg2 = entra(t, g2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="2025: GASTOU R$ 121 MI" k={entra(t, g1, 0.45)} tam={34} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="TURISMO EM 2025: R$ 1.314,50" k={kg2} destaque tam={30} /> : null}
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
  // v liquidado: o gancho novo ("121 milhões") é mais curto que o da voz em que o mapa foi gerado; cada trecho do mapa
  // anda num ritmo próprio para os textos do mapa caírem na palavra nova (tempo novo → tempo do mapa).
  const PONTOS: [number, number][] = [[0, 0], [2.48, 3.16], [5.42, 5.92], [6.98, 7.64], [8.0, 8.62], [9.64, 10.22], [9.98, 10.58], [11.68, 12.28], [30, 30.6]];
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
              <OffthreadVideo src={staticFile(`${P}/mapas/urucuca.mp4`)} startFrom={de + Math.round(v0 * FPS)} playbackRate={(v1 - v0) / (n1 - n0)} muted style={{width: W, height: H}} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falta24, T.d12, T.amais26, T.empenhou, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.tg, T.subg, T.fg24, T.ba50];
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
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: 'baque', v: 0.18}));
  [T.tur25, T.tirados, T.t26, T.sub, T.f24, T.estrada, T.tribunal].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  s.push({t: T.ordem + 0.1, f: 'tique', v: 0.14});
  // ★ melhoria (atenção): baque leve no "1.314 reais" do gancho e do achado; impacto no gasto da subprefeitura e no "quase o dobro"
  s.push({t: quando('A secretaria de turismo 1.314') + 1.05, f: 'baque', v: 0.15}, {t: T.tg + 0.6, f: 'baque', v: 0.17}, {t: T.subg + 0.1, f: 'impacto', v: 0.14}, {t: T.dobro + 0.05, f: 'impacto', v: 0.15});
  s.push({t: T.turismo2 + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.8, 6.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.falta24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.deficit25 + 0.9, T.d12 + 0.8, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.gastou26 + 0.9, T.amais26 + 1.2, T.empenhou + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.praias + 0.8, T.tur25 + 1.6, T.fora + 1.0, T.tirados + 1.8, T.tg + 1.0, T.t26 + 0.9,
  T.sub + 1.6, T.subg + 0.8, T.carnaval + 1.0, T.festas + 0.6, T.f24 + 1.3, T.fg24 + 1.0, T.dobro + 0.5,
  T.estrada + 0.8, T.ba50 + 0.8, T.ordem + 0.8, T.tribunal + 1.0, T.tribunal + 4.0,
  T.gastar + 0.5, T.mas + 1.2, T.turismo2 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoUrucuca: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="URUÇUCA" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Turismo 2025:', 'previstos', 'quase R$ 7 mi.', 'Gasto: R$ 1.314'];
export const CapaOrcamentoUrucuca: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · URUÇUCA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
