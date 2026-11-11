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
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, EstacaoSaneamento, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 065. orçamento de Luís Eduardo Magalhães (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 063 Lauro de Freitas. O Kit Mapas abre (voo até Luís Eduardo Magalhães, o censo do IBGE
// e o que a prefeitura arrecadou em 2024: projetos/065.../mapas/lem.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio
// e, em cada ano, a PILHA DO ANO em volta dele. Cidade grande (R$ 0,8 a 1,02 bilhão): 1 MOEDA = R$ 2 MI e 1 PILHA = R$ 20 MI.
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando
// sempre no mesmo sentido. Achados no miolo (1 pilha = R$ 4 mi): EMPRÉSTIMOS (2024, 2025, 2026), PARCELAS E JUROS (idem) e
// FESTAS x ASSISTÊNCIA SOCIAL (2026). Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE LUÍS EDUARDO
// MAGALHÃES, do TCM-BA e do IBGE: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 170.17; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,163, -15 LUFS (v liquidado, regra 32)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '065. orçamento de luís eduardo magalhães';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 922'),
  gastou24: quando('Gastou 909'),
  sobrou24: quando('Sobraram 13'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 978'),
  gastou25: quando('Gastou 1 bilhao e 6'),
  amais25: quando('Foram 27'),
  balanco: quando('a mais do que arrecadou Educacao'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 786'),
  emp80: quando('Desse total 80'),
  gastou26: quando('Gastou 798'),
  maisque26: quando('300 mais do que arrecadou'),
  empenhou: quando('E ja empenhou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara'),
  e24: quando('Em 2024 entraram'),
  e25: quando('Em 2025 mais 44'),
  e26: quando('Em 2026 ate setembro mais 80'),
  banco: quando('As contas nao dizem'),
  quase: quando('Quase todo esse dinheiro'),
  preco: quando('E a divida tem preco'),
  p24: quando('Parcelas e juros'),
  p25: quando('64 milhoes em 2025'),
  p26: quando('so ate setembro 62'),
  quatro: quando('Quase quatro vezes'),
  temmais: quando('Tem mais'),
  festas: quando('A conta das festas'),
  prev16: quando('com quase 16'),
  gasto21: quando('ja gastou 21'),
  maisass: quando('Mais que toda a assistencia'),
  tribunal: quando('No Tribunal de Contas uma'),
  improc: quando('julgada improcedente'),
  arraia: quando('E as contratacoes'),
  semjulg: quando('Ainda sem julgamento'),
  crescer: quando('Crescer custa caro'),
  mas: quando('Mas se a divida'),
  festa: quando('a festa precisa'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'estacao' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E JUROS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = []; // nenhum setor da fala ficou em zero

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.18 * Math.PI);
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
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara", "Assistência" e "Esporte" se repetem
const lista = (frases: string[], v: number[], rots: Record<string, string> = {}, so: string[] = []): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'esp', 'mam'].map((s, k) => ({s, t: quando(frases[k]), v: v[k], rot: rots[s], soPlaca: so.includes(s)}));
const ANOS: Ano[] = [
  // 2024 (regra 32: gastou = LIQUIDADO): arrecadou 922,7 e liquidou 909,7: sobraram 13 mi (conta própria)
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 909.7, rotulo: '2024', falta: {t: T.sobrou24, v: 12.952, txt: 'SOBRA', sobra: true, rot: 'SOBRARAM: R$ 13 MI'},
    entradas: lista(['Educacao 266', 'Saude 187', 'Administracao 52', 'Obras e servicos urbanos 254', 'Camara de Vereadores 30', 'Dividas e juros 35', 'Cultura e festas 16', 'Assistencia social 23 milhoes e 200', 'Esporte 10', 'Meio ambiente 4 milhoes e 200'],
      [266.652, 187.758, 52.805, 254.627, 30.310, 35.112, 16.239, 23.190, 10.107, 4.196])},
  // 2025 (liquidado): arrecadou 978,3 e liquidou 1.006,1: 27,8 mi a mais (conta própria)
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 1006.1, rotulo: '2025', falta: {t: T.amais25, v: 27.845, txt: 'A MAIS', rot: 'R$ 27,8 MI A MAIS'},
    entradas: lista(['Educacao 310', 'Saude 233', 'Administracao 65', 'Obras e servicos urbanos 207', 'Camara 36', 'Dividas 64', 'Cultura e festas 24', 'Assistencia social 23 milhoes e 700', 'Esporte 7', 'Meio ambiente 4 milhoes e 800'],
      [310.345, 233.467, 65.418, 206.958, 36.071, 63.970, 24.905, 23.682, 7.372, 4.810])},
  // 2026 (Prefeitura + Câmara, liquidado até setembro): arrecadou 786,9 e gastou 798,3 (a torre vermelha só desenha a diferença; o número não é dito)
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 798.3, rotulo: '2026 · ATÉ SET', falta: {t: T.maisque26, v: 11.427, txt: 'A MAIS', rot: 'MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 222', 'Saude 171', 'Administracao 51', 'Obras e servicos urbanos 175', 'Camara 32', 'Dividas 62', 'Cultura e festas 22', 'Assistencia social 16', 'Esporte 8', 'Meio ambiente 3'],
      [222.254, 171.476, 51.842, 174.959, 32.292, 62.824, 22.364, 16.032, 8.002, 3.814])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const entradaDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id);
const valorDe = (id: string, yi: number) => entradaDe(id, yi)?.v ?? 0;
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
const ESCALA = 20; // 1 moeda = R$ 2 mi; 1 pilha = R$ 20 milhões (cidade grande: orçamento de R$ 0,8 a 1,02 bilhão)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa de 43 a 55 pilhas) ----------
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

// ---------- Os achados no miolo (1 pilha = R$ 4 mi) ----------
const ESC_A = 4;
const LADO_A = 3;
const LADO_F = 2;
const ZA = 0.2;
// os empréstimos (à esquerda): 2024 (dourado, Caixa), 2025 (verde, Caixa), 2026 até setembro (rosa, banco não informado)
const EMP_CENTRO: V3 = [-2.0, 0, ZA];
const EMP = [
  {p: [-3.15, 0, ZA] as V3, v: 95.720, t: () => T.e24},
  {p: [-2.0, 0, ZA] as V3, v: 44.0, t: () => T.e25},
  {p: [-0.85, 0, ZA] as V3, v: 80.0, t: () => T.e26},
];
// as parcelas e juros das dívidas (à direita), e a assistência social de 2026 para comparar ("quase quatro vezes")
const PAR_CENTRO: V3 = [2.0, 0, ZA];
const PAR = [
  {p: [0.85, 0, ZA] as V3, v: 35.112, t: () => T.p24},
  {p: [2.0, 0, ZA] as V3, v: 63.970, t: () => T.p25},
  {p: [3.15, 0, ZA] as V3, v: 62.824, t: () => T.p26},
];
const PAR_ASS: V3 = [4.25, 0, ZA];
// as festas de 2026: previsto no começo do ano (fantasma), gasto até setembro (rosa) e toda a assistência social (verde)
const FES_CENTRO: V3 = [0, 0, 1.9];
const FES_PREV: V3 = [-0.9, 0, 1.9];
const FES_GASTO: V3 = [0, 0, 1.9];
const FES_ASS: V3 = [0.9, 0, 1.9];
const EMP_VIS = (t: number) => vis(t, T.repara - 0.1, T.festas - 0.25);
// na pergunta: as parcelas voltam no "Mas se a dívida", afundam no "a festa precisa" (senão ficam atrás das festas) e voltam no plano aberto final
const PAR_VIS = (t: number) => vis(t, T.preco - 0.1, T.festas - 0.25) + vis(t, T.mas - 0.3, T.festa - 0.3) + vis(t, T.segue + 0.4, FIM + 2);
const FES_VIS = (t: number) => vis(t, T.festas - 0.1, T.tribunal - 0.15) + vis(t, T.festa - 0.35, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.6];
const PASTA_A: V3 = [-2.4, 0, -1.3];
const PASTA_B: V3 = [2.4, 0, -1.3];
const TCM_VIS = (t: number) => vis(t, T.tribunal - 0.2, T.crescer - 0.1);

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
    // na frente do cofre: torre-fantasma do que sobrou em 2024 e torres vermelhas do que passou em 2025 e 2026
    ANOS.forEach((y) => {
      if (y.falta.v <= 0) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.crescer - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const em = EMP_VIS(t);
  if (em > 0.01) EMP.forEach((e, k) => {
    const g = cresce(e.t() + 0.4) * em;
    if (g > 0.01) solidas.push(...torre(e.p, (e.v / ESC_A) * g, LADO_A, CA[k]));
  });
  const px = PAR_VIS(t);
  if (px > 0.01) {
    PAR.forEach((e, k) => {
      const g = cresce(e.t() + 0.3) * px;
      if (g > 0.01) solidas.push(...torre(e.p, (e.v / ESC_A) * g, LADO_A, CA[k]));
    });
    const ga = (final ? 0 : rampa(t, T.quatro + 0.3, T.quatro + 1.0)) * vis(t, T.preco, T.temmais) ;
    if (ga > 0.01) solidas.push(...torre(PAR_ASS, (16.032 / ESC_A) * ga, LADO_F, C.grama));
  }
  const fx = FES_VIS(t);
  if (fx > 0.01) {
    const kp = cresce(T.prev16 + 0.3) * fx;
    if (kp > 0.01) fantasmas.push(...torre(FES_PREV, (15.96 / ESC_A) * kp, LADO_F, tema.objetoClaro));
    const kg = cresce(T.gasto21 + 0.2) * fx;
    if (kg > 0.01) solidas.push(...torre(FES_GASTO, (21.329 / ESC_A) * kg, LADO_F, CA[2]));
    const ka = cresce(T.maisass + 0.3) * fx;
    if (ka > 0.01) solidas.push(...torre(FES_ASS, (16.032 / ESC_A) * ka, LADO_F, C.grama));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.6], 0.2],
  [[-3.3, 0, 8.0], -0.4],
];
const ARVORES: V3[] = [
  [-1.4, 0, 8.4],
  [2.2, 0, 8.5],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  // "quase todo esse dinheiro foi para pavimentação, drenagem, urbanismo e praças": a casinha de obras acende de novo
  if (s.id === 'obr') ditas.push(janela(t, T.quase, T.preco, 0.4));
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
    case 'estacao':
      return <EstacaoSaneamento {...props} />;
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const em = EMP_VIS(t);
  const px = PAR_VIS(t);
  const fx = FES_VIS(t);
  const tv = TCM_VIS(t);
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

      {/* os achados: as gavetas dos empréstimos, das parcelas e das festas de 2026 */}
      {em > 0.01 ? <BaseGaveta tema={tema} pos={EMP_CENTRO} sobe={em} larg={3.8} texto="EMPRÉSTIMOS" aceso={janela(t, T.repara, T.quase, 0.4)} /> : null}
      {px > 0.01 ? <BaseGaveta tema={tema} pos={PAR_CENTRO} sobe={px} larg={3.8} texto="PARCELAS E JUROS" aceso={Math.max(janela(t, T.preco, T.temmais, 0.4), janela(t, T.mas, T.festa, 0.4))} /> : null}
      {fx > 0.01 ? <BaseGaveta tema={tema} pos={FES_CENTRO} sobe={fx} larg={3.0} texto="2026 · ATÉ SET" aceso={Math.max(janela(t, T.festas, T.tribunal, 0.4), janela(t, T.festa, FIM, 0.4))} /> : null}

      {/* o Tribunal e as duas pastas: a denúncia de 2024 (improcedente) e a do Arraiá de 2026 (sem julgamento) */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={tv} aceso={janela(t, T.tribunal, T.crescer, 0.5)} />
      <PastaProcesso tema={tema} pos={PASTA_A} rotY={0.25} escala={0.75} sobe={vis(t, T.tribunal + 0.3, T.crescer - 0.1)} titulo="EVENTOS 2024" valor="DENÚNCIA"
        carimbo={rampa(t, T.improc + 0.1, T.improc + 0.5)} textoCarimbo="IMPROCEDENTE" corCarimbo={tema.acento} aceso={janela(t, T.tribunal, T.arraia, 0.4)} />
      <PastaProcesso tema={tema} pos={PASTA_B} rotY={-0.25} escala={0.75} sobe={vis(t, T.arraia, T.crescer - 0.1)} titulo="ARRAIÁ 2026" valor="DENÚNCIA"
        carimbo={rampa(t, T.semjulg + 0.1, T.semjulg + 0.5)} textoCarimbo="EM ANÁLISE" corCarimbo={C.ouro} aceso={janela(t, T.arraia, T.crescer, 0.4)} />
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
// achados no miolo: câmera alta (dir y 2,1) para o fundo ser a mesa e nada ficar atrás do cabeçalho
const PM = (c: V3, larg: number, h: number, dx = 0, el = 2.1): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, el, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre-fantasma da sobra; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobrou24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do déficit, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.balanco + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do "mais do que arrecadou"
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 0.8, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // agora repara: a gaveta dos empréstimos, torre por torre
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, DE_CIMA(0.1)],
      [T.e24 - 0.2, PM(EMP_CENTRO, 5.0, 3.2, -0.05, 2.8)],
      [T.e26 + 1.2, PM(EMP_CENTRO, 4.8, 3.2, 0.0, 2.8)],
      [T.quase - 0.4, PM(EMP_CENTRO, 4.7, 3.2, 0.04, 2.8)],
    ],
  },
  // "quase todo esse dinheiro foi para pavimentação...": a casinha de obras, com as torres dos três anos
  {ini: T.quase - 0.2, arco: 0.02, chaves: [[T.quase - 0.2, OLHA_SETOR(idx('obr'), 1.35)], [T.preco - 0.3, OLHA_SETOR(idx('obr'), 1.3)]]},
  // a dívida tem preço: a gaveta das parcelas e, no "quase quatro vezes", a torre da assistência ao lado
  {
    ini: T.preco - 0.1,
    arco: 0.03,
    chaves: [
      [T.preco - 0.1, PM(PAR_CENTRO, 5.2, 2.4, 0.05, 2.8)],
      [T.p26 + 0.8, PM(PAR_CENTRO, 5.0, 2.4, 0.02, 2.8)],
      [T.quatro - 0.1, PM(soma(PAR_CENTRO, [0.55, 0, 0]), 6.0, 2.4, 0.0, 2.8)],
      [T.festas - 0.3, PM(soma(PAR_CENTRO, [0.6, 0, 0]), 5.8, 2.4, -0.02, 2.8)],
    ],
  },
  // as festas de 2026: previsto, gasto até setembro e a assistência social
  {
    ini: T.festas - 0.1,
    arco: 0.03,
    chaves: [
      [T.festas - 0.1, PM(FES_CENTRO, 4.2, 2.0, -0.04, 1.6)],
      [T.gasto21 + 0.6, PM(FES_CENTRO, 3.9, 2.0, 0, 1.6)],
      [T.tribunal - 0.3, PM(FES_CENTRO, 3.8, 2.0, 0.04, 1.6)],
    ],
  },
  // o Tribunal e as duas pastas
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E(soma(TCM_POS, [-0.9, 1.0, 0.6]), 6.2, 5.4, [-0.05, 1.2, 1])],
      [T.arraia - 0.2, E(soma(TCM_POS, [0, 1.0, 0.6]), 7.6, 5.6, [0, 1.2, 1])],
      [T.crescer - 0.3, E(soma(TCM_POS, [0.4, 1.0, 0.6]), 7.2, 5.4, [0.05, 1.2, 1])],
    ],
  },
  // a pergunta: a mesa, as parcelas, as festas e de novo a mesa inteira
  {
    ini: T.crescer - 0.1,
    arco: 0.04,
    chaves: [
      [T.crescer - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PM(soma(PAR_CENTRO, [0.3, 0, 0]), 6.4, 2.4, 0.02, 2.8)],
      [T.festa - 0.1, PM(FES_CENTRO, 4.4, 2.0, 0, 1.6)],
      [T.segue - 0.1, PM(FES_CENTRO, 4.2, 2.0, 0.03, 1.6)],
      [T.segue + 0.9, E([0, 1.0, 1.0], 11.0, 7.6, [-0.1, 1.4, 1])],
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
  [0, 'LUÍS EDUARDO MAGALHÃES'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'OS EMPRÉSTIMOS'],
  [T.preco, 'O PREÇO DA DÍVIDA'],
  [T.festas, 'AS FESTAS DE 2026'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.crescer, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobrou24, texto: 'GASTOU EM 2024: R$ 909,7 MI'},
    {a: T.sobrou24, b: Y0.entradas[0].t, texto: 'SOBRARAM: R$ 13 MI'},
    {a: T.ano25, b: T.arrec25 + 0.2, texto: '2025'},
    {a: T.arrec25 + 0.2, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 978,3 MI'},
    {a: T.gastou25, b: T.amais25, texto: 'GASTOU EM 2025: R$ 1,006 BILHÃO'},
    {a: T.amais25, b: Y1.entradas[0].t, texto: 'R$ 27,8 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.emp80, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 786,9 MI'},
    {a: T.emp80, b: T.gastou26, texto: 'DESSE TOTAL, R$ 80 MI SÃO EMPRÉSTIMO', destaque: true},
    {a: T.gastou26, b: T.maisque26, texto: 'GASTOU ATÉ SETEMBRO: R$ 798,3 MI'},
    {a: T.maisque26, b: T.empenhou, texto: 'MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.empenhou, b: T.folha, texto: 'EMPENHOU (RESERVOU PARA PAGAR): R$ 931,4 MI'},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.e24, texto: 'OS EMPRÉSTIMOS'},
    {a: T.e24, b: T.e25, texto: '2024: R$ 95,7 MI DA CAIXA'},
    {a: T.e25, b: T.e26, texto: '2025: R$ 44 MI DA CAIXA'},
    {a: T.e26, b: T.banco, texto: '2026, ATÉ SETEMBRO: R$ 80 MI', destaque: true},
    {a: T.banco, b: T.quase, texto: 'O RELATÓRIO DE 2026 NÃO DIZ O BANCO'},
    {a: T.quase, b: T.preco, texto: 'PAVIMENTAÇÃO, DRENAGEM, URBANISMO E PRAÇAS'},
    {a: T.preco, b: T.p24, texto: 'A DÍVIDA TEM PREÇO'},
    {a: T.p24, b: T.p25, texto: 'PARCELAS E JUROS 2024: R$ 35,1 MI'},
    {a: T.p25, b: T.p26, texto: 'PARCELAS E JUROS 2025: R$ 64 MI'},
    {a: T.p26, b: T.quatro, texto: 'SÓ ATÉ SETEMBRO DE 2026: R$ 62,8 MI', destaque: true},
    {a: T.quatro, b: T.temmais, texto: 'QUASE 4 VEZES A ASSISTÊNCIA SOCIAL (R$ 16 MI)', destaque: true},
    {a: T.temmais, b: T.prev16, texto: 'A CONTA DAS FESTAS'},
    {a: T.prev16, b: T.gasto21, texto: 'PREVISTO PARA 2026: R$ 15,96 MI'},
    {a: T.gasto21, b: T.maisass, texto: 'GASTO ATÉ SETEMBRO: R$ 21,3 MI', destaque: true},
    {a: T.maisass, b: T.tribunal, texto: 'MAIS QUE TODA A ASSISTÊNCIA SOCIAL (R$ 16 MI)', destaque: true},
    {a: T.tribunal, b: T.improc, texto: 'DENÚNCIA DE 2024: ESTRUTURA DE EVENTOS'},
    {a: T.improc, b: T.arraia, texto: 'JULGADA IMPROCEDENTE (AGOSTO DE 2025)'},
    {a: T.arraia, b: T.semjulg, texto: 'DENÚNCIA: ATRAÇÕES DO ARRAIÁ DE 2026'},
    {a: T.semjulg, b: T.crescer, texto: 'AINDA SEM JULGAMENTO'},
    {a: T.crescer, b: T.mas, texto: 'EMPRÉSTIMO NÃO É CRIME'},
    {a: T.mas, b: T.festa, texto: 'PARCELAS E JUROS: MAIS DE R$ 60 MI POR ANO'},
    {a: T.festa, b: T.segue, texto: 'FESTA MAIOR QUE A ASSISTÊNCIA SOCIAL?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E PCMGE015 DEZ/2024 · LIQUIDADO · TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E PCMGE015 DEZ/2025 · LIQUIDADO · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.preco, texto: 'FONTE: BALANÇOS E ANEXO 10 (2024, 2025) · SIGA SET/2026'},
  {a: T.preco, b: T.festas, texto: 'FONTE: BALANÇOS 2024 E 2025 · SIGA SET/2026 · TCM-BA'},
  {a: T.festas, b: T.tribunal, texto: 'FONTE: SIGA SET/2026 (DESPESA POR AÇÃO) · TCM-BA'},
  {a: T.tribunal, b: T.crescer, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
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
    if (f.v > 0) r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.35, v / ESC_A), lado) + 0.3, 0]);
  // os empréstimos
  const fimE = T.quase - 0.05;
  r.push({a: T.e24 + 0.9, b: fimE, p: topo(EMP[0].p, EMP[0].v), valor: 'R$ 95,7 MI', sub: '2024 · CAIXA', cor: CA[0]});
  r.push({a: T.e25 + 0.9, b: fimE, p: topo(EMP[1].p, EMP[1].v), valor: 'R$ 44 MI', sub: '2025 · CAIXA', cor: CA[1]});
  r.push({a: T.e26 + 1.0, b: fimE, p: topo(EMP[2].p, EMP[2].v), valor: 'R$ 80 MI', sub: '2026 · ATÉ SET', cor: CA[2]});
  // "foi para pavimentação...": as plaquinhas de obras dos três anos voltam presas às torres da casinha
  [0, 1, 2].forEach((k) => r.push({a: T.quase + 0.4 + k * 0.15, b: T.preco - 0.05, p: soma(posTorre(idx('obr'), k), [0, altFina(valorDe('obr', k)) + 0.35, 0]), valor: fmtE(entradaDe('obr', k)), sub: `OBRAS · ${ANO_SUB[k]}`, cor: CA[k]}));
  // as parcelas e juros
  const fimP = T.temmais + 0.2;
  r.push({a: T.p24 + 1.6, b: fimP, p: topo(PAR[0].p, PAR[0].v), valor: 'R$ 35,1 MI', sub: '2024', cor: CA[0]});
  r.push({a: T.p25 + 0.7, b: fimP, p: topo(PAR[1].p, PAR[1].v), valor: 'R$ 64 MI', sub: '2025', cor: CA[1]});
  r.push({a: T.p26 + 1.2, b: fimP, p: topo(PAR[2].p, PAR[2].v), valor: 'R$ 62,8 MI', sub: '2026 · ATÉ SET', cor: CA[2]});
  r.push({a: T.quatro + 0.9, b: fimP, p: topo(PAR_ASS, 16.032, LADO_F), valor: 'R$ 16 MI', sub: 'ASSISTÊNCIA · ATÉ SET', cor: C.grama});
  // as festas de 2026
  const fimF = T.tribunal - 0.1;
  r.push({a: T.prev16 + 0.9, b: fimF, p: topo(FES_PREV, 15.96, LADO_F), valor: 'R$ 15,96 MI', sub: 'FESTAS · PREVISTO'});
  r.push({a: T.gasto21 + 0.7, b: fimF, p: topo(FES_GASTO, 21.329, LADO_F), valor: 'R$ 21,3 MI', sub: 'FESTAS · GASTO', cor: CA[2]});
  r.push({a: T.maisass + 0.9, b: fimF, p: topo(FES_ASS, 16.032, LADO_F), valor: 'R$ 16 MI', sub: 'ASSISTÊNCIA SOCIAL', cor: C.grama});
  // a pergunta
  r.push(
    {a: T.mas + 0.5, b: T.festa - 0.05, p: topo(PAR[1].p, PAR[1].v), valor: 'R$ 64 MI', sub: '2025', cor: CA[1]},
    {a: T.mas + 0.7, b: T.festa - 0.05, p: topo(PAR[2].p, PAR[2].v), valor: 'R$ 62,8 MI', sub: '2026 · ATÉ SET', cor: CA[2]},
    {a: T.festa + 0.4, b: T.segue + 0.8, p: topo(FES_GASTO, 21.329, LADO_F), valor: 'R$ 21,3 MI', sub: 'FESTAS · ATÉ SET', cor: CA[2]},
    {a: T.festa + 0.6, b: T.segue + 0.8, p: topo(FES_ASS, 16.032, LADO_F), valor: 'R$ 16 MI', sub: 'ASSISTÊNCIA SOCIAL', cor: C.grama},
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
  const miolo = vis(t, T.repara + 0.2, T.quase - 0.1) + vis(t, T.preco, T.tribunal - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 4 MI' : '1 MOEDA = R$ 2 MI · 1 PILHA = R$ 20 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // selo da fonte sobre o mapa: o censo do IBGE e, depois, o Balanço de 2024
    const censo = quando('Em 12 anos');
    const kc = Math.min(entra(t, censo, 0.45), 1 - rampa(t, T.ano24 - 0.4, T.ano24 - 0.05));
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const selo = (txt: string, op: number) => (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: op}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
      </div>
    );
    return (
      <>
        {kc > 0.01 ? selo('FONTE: IBGE, CENSOS 2010 E 2022', kc) : null}
        {k > 0.01 ? selo('FONTE: BALANÇO 2024 ENVIADO AO TCM-BA', k) : null}
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
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 86 : 60));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-90, 90, -180, 180, -270, 270, 360].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
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
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/lem.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.amais25, T.maisque26, T.emp80, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 100).map((e) => e.t)), T.e24, T.e26, T.p25, T.p26, T.quatro, T.gasto21, T.maisass];
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
  ANOS.forEach((y) => (y.falta.v > 0 ? s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}) : null));
  [T.e24, T.e25, T.e26, T.p24, T.p25, T.prev16, T.tribunal, T.improc, T.arraia].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.emp80, T.quatro].forEach((t) => s.push({t: t + 0.3, f: 'baque', v: 0.15}));
  // ★ melhoria (atenção): baque no "220 milhões" do gancho; subida na torre de 2026 dos empréstimos; impacto nas parcelas de 2026 e no "mais que toda a assistência"
  s.push({t: quando('quase 220') + 0.3, f: 'baque', v: 0.15}, {t: T.e26 + 0.4, f: 'subida', v: 0.15}, {t: T.p26 + 0.3, f: 'impacto', v: 0.14}, {t: T.gasto21 + 0.2, f: 'subida', v: 0.15}, {t: T.maisass + 0.1, f: 'impacto', v: 0.15});
  s.push({t: T.festa + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.6, 2.0, 3.6, 4.4, 6.5, 9.5, 11.8, T.ano24 + 0.6, T.arrec24 + 1.2, T.gastou24 + 0.9, T.sobrou24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 1.0, T.gastou25 + 0.9, T.amais25 + 1.0, T.balanco + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.emp80 + 1.0, T.gastou26 + 0.9, T.maisque26 + 0.9, T.empenhou + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.e24 + 1.4, T.e25 + 1.3, T.e26 + 1.6, T.banco + 0.8, T.quase + 1.4, T.preco + 0.6, T.p24 + 2.0, T.p25 + 1.0, T.p26 + 1.6,
  T.quatro + 1.5, T.temmais + 0.3, T.prev16 + 1.2, T.gasto21 + 1.0, T.maisass + 1.4, T.tribunal + 0.8, T.improc + 0.8, T.arraia + 1.0, T.semjulg + 0.7,
  T.crescer + 0.5, T.mas + 1.2, T.festa + 1.0, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoLem: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="LUÍS EDUARDO MAGALHÃES" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {/* selo do @eumagnoleite na abertura (arte aprovada, opção B; regras 15c e 18) */}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 219,7 mi', 'emprestados.', 'Festa de', 'R$ 21 mi?'];
export const CapaOrcamentoLem: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · LUÍS EDUARDO MAGALHÃES`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: Math.max(...linhas.map((x) => x.length)) > 11 ? 104 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
