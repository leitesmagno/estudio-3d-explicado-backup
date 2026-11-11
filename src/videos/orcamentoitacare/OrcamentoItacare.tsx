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
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 058. orçamento de Itacaré (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 056 Dário Meira. O Kit Mapas abre (voo até Itacaré e o que a prefeitura arrecadou
// em 2024: projetos/058.../mapas/itacare.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 4 milhões: orçamento de R$ 132 a 176 mi). Quando a voz fala um setor, as pilhas
// saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando sempre no mesmo sentido. 2024: torre
// vermelha "A MAIS" (déficit do Balanço); 2025: torre branca "SOBROU"; 2026 (até agosto): torre vermelha do que o EMPENHADO
// passou do arrecadado. Achados: eventos x estradas vicinais, a autarquia de turismo e a denúncia no TCM. Sem porcentagem,
// sem nome de gestor e sem nome de empresa. SÓ DADOS DE ITACARÉ, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 173.96; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,138, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '058. orçamento de itacaré';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 165'),
  gastou24: quando('Gastou 169'),
  mais24: quando('Ou seja 3 milhoes'),
  deficit: quando('O proprio balanco'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 180'),
  gastou25: quando('Gastou 176', 2), // o gancho diz "Itacaré gastou 176 milhões em 2025"
  mais25: quando('Desta vez'),
  ano26: quando('2026 ate agosto'),
  arrec26: quando('Arrecadou 134'),
  gastou26: quando('Ja gastou 132'),
  empenhou: quando('E ja empenhou'),
  mais26: quando('Mais do que arrecadou ate aqui'),
  zeros: quando('E os zeros'),
  san: quando('Saneamento Nada'),
  embasa: quando('O esgoto da cidade'),
  dren: quando('Mas a acao da prefeitura'),
  repara: quando('Agora repara'),
  ev24: quando('levou 2 milhoes'),
  ev25: quando('3 milhoes e 700 em 2025'),
  ev26: quando('so ate agosto'),
  prev: quando('O orcamento previa'),
  estr: quando('Ja a acao de conservar'),
  es24: quando('levou 1 milhao e 900'),
  es25: quando('900 mil em 2025'),
  es26: quando('E 441 mil'),
  esprev: quando('de 2 milhoes e 700 previstos'),
  parte: quando('E tem a parte'),
  autarq: quando('A autarquia de turismo'),
  nada: quando('e nao gastou nada'),
  taxa: quando('E nas receitas'),
  tribunal: quando('No Tribunal de Contas'),
  den: quando('uma denuncia de 2025'),
  semdec: quando('Ainda sem decisao'),
  gastar: quando('Gastar com festa'),
  masse: quando('Mas se o evento'),
  estrada: quando('e a estrada rural'),
  quem: quando('quem escolheu'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'tur', nome: 'TURISMO E CULTURA', tipo: 'palco', texto: 'TURISMO'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'tra', nome: 'TRANSPORTE E ESTRADAS', tipo: 'galpao', texto: 'ESTRADAS'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'esg', nome: 'SANEAMENTO', tipo: 'galpao', texto: 'SANEAMENTO'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = ['esg'];
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.15 * Math.PI);
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
type Entrada = {s: string; t: number; v: number; rot?: string};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean; rot?: string}};
const lista = (n: number, v: number[], rots: Record<string, string> = {}): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras e servicos urbanos'],
    ['cam', 'Camara'],
    ['div', 'Dividas e encargos'],
    ['tur', 'Turismo e cultura'],
    ['ass', 'Assistencia social'],
    ['tra', 'Transporte e estradas'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k], rot: rots[s]}));
// 2024: torre vermelha "A MAIS" = déficit do Balanço; 2025: torre branca "SOBROU" = superávit do Balanço;
// 2026 (até agosto): o liquidado ficou abaixo do arrecadado, mas o EMPENHADO passou (139,4 − 134,3, conta própria, número não dito)
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 169.0, rotulo: '2024', falta: {t: T.mais24, v: 3.306, txt: 'A MAIS', rot: 'R$ 3,3 MI A MAIS'}, entradas: lista(1, [70.155, 31.137, 12.146, 24.576, 3.483, 7.528, 7.732, 3.452, 4.361, 1.317, 0.561])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 176.0, rotulo: '2025', falta: {t: T.mais25, v: 4.712, txt: 'SOBROU', sobra: true, rot: 'SOBROU R$ 4,7 MI'}, entradas: lista(2, [83.983, 29.597, 15.836, 13.211, 4.274, 6.735, 11.881, 2.732, 3.284, 0.847, 0.863])},
  {ini: T.ano26 + 0.3, fim: T.zeros, gastou: T.gastou26, total: 132.4, rotulo: '2026 · ATÉ AGO', falta: {t: T.mais26, v: 5.098, txt: 'A MAIS', rot: 'EMPENHOU MAIS DO QUE ARRECADOU'}, entradas: lista(3, [59.327, 23.627, 12.371, 14.944, 3.161, 2.493, 7.858, 2.852, 2.894, 0.866, 0.765])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, s.id === 'esg' ? T.san : ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
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
const ESCALA = 4; // 1 pilha = R$ 4 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; 2025 usa cerca de 50 pilhas) ----------
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
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.12, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];


// ---------- Os achados no miolo (torres de 3 x 3) ----------
const LADO_A = 3;
const ZA = 0.2;
// eventos (ação 2.019) e estradas vicinais (ação 2.034): 1 pilha = R$ 200 mil; a quarta torre é o PREVISTO de 2026 (branca-fantasma)
const ESC_E = 0.2;
const EV = {
  ev24: {p: [-2.4, 0, ZA] as V3, v: 2.695},
  ev25: {p: [-0.8, 0, ZA] as V3, v: 3.687},
  ev26: {p: [0.8, 0, ZA] as V3, v: 4.859},
  prev: {p: [2.4, 0, ZA] as V3, v: 3.541},
};
const ES = {
  es24: {p: [-2.4, 0, ZA] as V3, v: 1.869},
  es25: {p: [-0.8, 0, ZA] as V3, v: 0.9},
  es26: {p: [0.8, 0, ZA] as V3, v: 0.441},
  esprev: {p: [2.4, 0, ZA] as V3, v: 2.739},
};
// a autarquia de turismo: R$ 24 mil previstos em 2026 (1 pilha = R$ 10 mil, branca-fantasma), R$ 0 gasto
const ESC_AU = 0.01;
const AU = {p: [0, 0, ZA] as V3, v: 0.0237};
// a pergunta: eventos (esquerda) x estradas vicinais (direita), 1 pilha = R$ 200 mil
const QQ = {
  ev24: {p: [-3.4, 0, ZA] as V3, v: 2.695, a: 0},
  ev25: {p: [-2.2, 0, ZA] as V3, v: 3.687, a: 1},
  ev26: {p: [-1.0, 0, ZA] as V3, v: 4.859, a: 2},
  es24: {p: [1.0, 0, ZA] as V3, v: 1.869, a: 0},
  es25: {p: [2.2, 0, ZA] as V3, v: 0.9, a: 1},
  es26: {p: [3.4, 0, ZA] as V3, v: 0.441, a: 2},
};
const EV_VIS = (t: number) => vis(t, T.repara + 0.1, T.estr - 0.15);
const ES_VIS = (t: number) => vis(t, T.estr + 0.35, T.parte - 0.15);
const AU_VIS = (t: number) => vis(t, T.parte + 0.35, T.tribunal - 0.15);
const QQ_VIS = (t: number) => vis(t, T.masse - 0.45, FIM + 2);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'ESTRUTURA E GERADOR PARA EVENTOS', valor: 'DENÚNCIA DE 2025', t: T.den, carimbos: [[T.semdec, 'SEM DECISÃO', 'neutro']]},
];
const posPasta = (i: number): V3 => [i * 2.2, 0, 1.3];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

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
    // na frente do cofre: vermelha quando o gasto (2024) ou o empenhado (2026) passou da arrecadação; branca quando sobrou (2025)
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const cresce = (a: number, d = 0.9) => rampa(t, a, a + d);
  const ev = EV_VIS(t);
  if (ev > 0.01) {
    const kk = (a: number) => cresce(a) * ev;
    if (kk(T.ev24) > 0.01) solidas.push(...torre(EV.ev24.p, (EV.ev24.v / ESC_E) * kk(T.ev24), LADO_A, CA[0]));
    if (kk(T.ev25) > 0.01) solidas.push(...torre(EV.ev25.p, (EV.ev25.v / ESC_E) * kk(T.ev25), LADO_A, CA[1]));
    if (kk(T.ev26) > 0.01) solidas.push(...torre(EV.ev26.p, (EV.ev26.v / ESC_E) * kk(T.ev26), LADO_A, CA[2]));
    if (kk(T.prev) > 0.01) fantasmas.push(...torre(EV.prev.p, (EV.prev.v / ESC_E) * kk(T.prev), LADO_A, tema.objetoClaro));
  }
  const es = ES_VIS(t);
  if (es > 0.01) {
    const kk = (a: number) => cresce(a) * es;
    if (kk(T.es24) > 0.01) solidas.push(...torre(ES.es24.p, (ES.es24.v / ESC_E) * kk(T.es24), LADO_A, CA[0]));
    if (kk(T.es25) > 0.01) solidas.push(...torre(ES.es25.p, (ES.es25.v / ESC_E) * kk(T.es25), LADO_A, CA[1]));
    if (kk(T.es26) > 0.01) solidas.push(...torre(ES.es26.p, (ES.es26.v / ESC_E) * kk(T.es26), LADO_A, CA[2]));
    if (kk(T.esprev) > 0.01) fantasmas.push(...torre(ES.esprev.p, (ES.esprev.v / ESC_E) * kk(T.esprev), LADO_A, tema.objetoClaro));
  }
  const au = AU_VIS(t);
  if (au > 0.01) {
    const kk = cresce(T.autarq) * au;
    if (kk > 0.01) fantasmas.push(...torre(AU.p, (AU.v / ESC_AU) * kk, LADO_A, tema.objetoClaro));
  }
  const qq = QQ_VIS(t);
  if (qq > 0.01) {
    (['ev24', 'ev25', 'ev26'] as const).forEach((k) => {
      const kk = cresce(T.masse - 0.3 + QQ[k].a * 0.25) * qq;
      if (kk > 0.01) solidas.push(...torre(QQ[k].p, (QQ[k].v / ESC_E) * kk, LADO_A, CA[QQ[k].a]));
    });
    (['es24', 'es25', 'es26'] as const).forEach((k) => {
      const kk = cresce(T.estrada - 0.2 + QQ[k].a * 0.25) * qq;
      if (kk > 0.01) solidas.push(...torre(QQ[k].p, (QQ[k].v / ESC_E) * kk, LADO_A, CA[QQ[k].a]));
    });
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
    case 'agua':
      return <EstacaoSaneamento {...props} />;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};


const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const ev = EV_VIS(t);
  const es = ES_VIS(t);
  const au = AU_VIS(t);
  const qq = QQ_VIS(t);
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
      <PilhasDinheiro pilhas={torres} max={3000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* eventos; estradas vicinais; a autarquia de turismo; a pergunta (todas no miolo, uma de cada vez) */}
      <BaseGaveta tema={tema} pos={[0, 0, ZA]} sobe={ev} larg={6.6} texto="EVENTOS CULTURAIS E TRADICIONAIS" aceso={janela(t, T.repara, T.estr, 0.4)} />
      <BaseGaveta tema={tema} pos={[0, 0, ZA]} sobe={es} larg={6.6} texto="ESTRADAS VICINAIS (ZONA RURAL)" aceso={janela(t, T.estr, T.parte, 0.4)} />
      <BaseGaveta tema={tema} pos={[0, 0, ZA]} sobe={au} larg={5.0} texto="AUTARQUIA DE TURISMO" aceso={janela(t, T.autarq, T.tribunal, 0.4)} />
      <BaseGaveta tema={tema} pos={[0, 0, ZA]} sobe={qq} larg={8.4} texto="EVENTOS  ×  ESTRADAS VICINAIS" aceso={janela(t, T.masse, FIM, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.den - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(0.5 - i) * 0.08}
            escala={1.3}
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
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 1.9, 1]); // 1,9: o fundo é a mesa, não as casinhas atrás da pílula (044)
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha do que passou da arrecadação; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que foi EMPENHADO além do arrecadado até agosto
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 0.6, COFRE(0.07)], [T.mais26 + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.zeros - 0.2, 1.2)]},
  // os zeros: sobe e recomeça no saneamento (a última casinha, no mesmo sentido)
  {
    ini: T.zeros - 0.1,
    arco: 0.03,
    chaves: [
      [T.zeros - 0.1, DE_CIMA(0.1)],
      [T.san - 0.1, OLHA_SETOR(idx('esg'), 1.1)],
      [T.repara - 0.3, OLHA_SETOR(idx('esg'), 1.05)],
    ],
  },
  // os eventos: 2024, 2025, 2026 até agosto e o previsto de 2026 (da esquerda para a direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 0.9, ZA], 9.6, 7.4, [0, 2.3, 1])],
      [T.ev24 - 0.2, PG(EV.ev24.p, 4.0, 1.3, -0.05)],
      [T.ev25 - 0.3, PG(soma(EV.ev24.p, [0.5, 0, 0]), 4.0, 1.5, -0.03)],
      [T.ev25 + 0.3, PG(EV.ev25.p, 4.2, 1.6, 0)],
      [T.ev26 - 0.2, PG(soma(EV.ev25.p, [0.6, 0, 0]), 4.4, 1.8, 0)],
      [T.ev26 + 0.4, PG(EV.ev26.p, 4.6, 1.9, 0.02)],
      [T.prev + 0.2, PG(soma(EV.ev26.p, [0.8, 0, 0]), 4.8, 1.7, 0.03)],
      [T.estr - 0.3, PG(soma(EV.ev26.p, [1.0, 0, 0]), 5.0, 1.6, 0.04)],
    ],
  },
  // as estradas vicinais: 2024, 2025, 2026 até agosto e o previsto de 2026
  {
    ini: T.estr - 0.1,
    arco: 0.03,
    chaves: [
      [T.estr - 0.1, E([0, 0.9, ZA], 9.6, 7.4, [0, 2.3, 1])],
      [T.es24 - 0.2, PG(ES.es24.p, 4.0, 1.0, -0.05)],
      [T.es25 - 0.3, PG(soma(ES.es24.p, [0.5, 0, 0]), 4.0, 0.9, -0.03)],
      [T.es25 + 0.3, PG(ES.es25.p, 4.0, 0.8, 0)],
      [T.es26 - 0.2, PG(soma(ES.es25.p, [0.6, 0, 0]), 4.2, 0.8, 0)],
      [T.es26 + 0.3, PG(ES.es26.p, 4.2, 0.8, 0.02)],
      [T.esprev + 0.1, PG(soma(ES.es26.p, [0.8, 0, 0]), 4.8, 1.2, 0.03)],
      [T.parte - 0.3, PG(soma(ES.es26.p, [1.0, 0, 0]), 5.0, 1.2, 0.04)],
    ],
  },
  // a autarquia de turismo: o previsto (branco) e o R$ 0 gasto
  {
    ini: T.parte - 0.2,
    arco: 0.03,
    chaves: [
      [T.parte - 0.2, E([0, 0.9, ZA], 8.5, 6.8, [0, 2.3, 1])],
      [T.autarq + 0.2, PG(AU.p, 4.0, 0.7, -0.03)],
      [T.nada + 0.2, PG(AU.p, 3.8, 0.7, 0)],
      [T.tribunal - 0.3, PG(AU.p, 4.2, 0.8, 0.03)],
    ],
  },
  // tribunal: a pasta da denúncia
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.den - 0.1, E(soma(posPasta(0), [0, 0.9, 0]), 3.6, 3.4, [-0.06, 1.75, 1])],
      [T.semdec - 0.2, E(soma(posPasta(0), [0.1, 0.9, 0]), 3.4, 3.2, [0, 1.75, 1])],
      [T.gastar - 0.2, E(soma(posPasta(0), [0.2, 0.9, 0]), 3.6, 3.5, [0.06, 1.75, 1])],
    ],
  },
  // a pergunta: mesa inteira, os eventos (esquerda) e as estradas vicinais (direita) e a mesa inteira de novo
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.masse - 0.1, E([-2.2, 1.0, ZA], 4.8, 4.8, [-0.04, 1.9, 1])],
      [T.estrada - 0.1, E([-1.0, 1.0, ZA], 5.8, 5.4, [0, 1.9, 1])],
      [T.estrada + 0.5, E([2.2, 0.8, ZA], 4.8, 4.6, [0.03, 1.9, 1])],
      [T.quem + 0.2, E([0, 0.9, ZA], 9.2, 6.6, [0.03, 1.9, 1])],
      [T.segue + 0.6, E([0, 1.0, ZA], 10.0, 7.6, [-0.1, 1.3, 1])],
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

// ---------- Interface ----------
const ESTADOS: [number, string][] = [
  [0, 'ITACARÉ'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ AGOSTO'],
  [T.zeros, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA: AS FESTAS'],
  [T.estr, 'E AS ESTRADAS DA ZONA RURAL'],
  [T.parte, 'O QUE QUASE NINGUÉM VÊ'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 169 MILHÕES'},
    {a: T.mais24, b: T.deficit, texto: 'R$ 3,3 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.deficit, b: Y0.entradas[0].t, texto: 'O PRÓPRIO BALANÇO CHAMA DE DÉFICIT'},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 180,7 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 176 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 4,7 MI EM 2025', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ AGOSTO, O ÚLTIMO MÊS COMPLETO'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ AGOSTO: R$ 134,3 MI'},
    {a: T.gastou26, b: T.empenhou, texto: 'JÁ GASTOU ATÉ AGOSTO: R$ 132,4 MI'},
    {a: T.empenhou, b: T.mais26, texto: 'JÁ EMPENHOU (RESERVOU PARA PAGAR): R$ 139,4 MI', destaque: true},
    {a: T.mais26, b: Y2.entradas[0].t, texto: 'MAIS DO QUE ARRECADOU ATÉ AGOSTO', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.zeros, b: T.san, texto: 'E OS ZEROS'},
    {a: T.san, b: T.embasa, texto: 'SANEAMENTO: R$ 0 NOS 3 ANOS'},
    {a: T.embasa, b: T.dren, texto: 'O ESGOTO DA CIDADE É DA EMBASA (ESTADO)'},
    {a: T.dren, b: T.repara, texto: 'DRENAGEM E ESGOTO: R$ 32 MIL PREVISTOS EM 2026, R$ 0'},
    {a: T.repara, b: T.ev24, texto: 'AGORA REPARA NAS FESTAS'},
    {a: T.ev24, b: T.ev25, texto: 'EVENTOS CULTURAIS E TRADICIONAIS 2024: R$ 2,7 MI'},
    {a: T.ev25, b: T.ev26, texto: 'EVENTOS 2025: R$ 3,7 MI'},
    {a: T.ev26, b: T.prev, texto: 'EVENTOS 2026, SÓ ATÉ AGOSTO: R$ 4,9 MI', destaque: true},
    {a: T.prev, b: T.estr, texto: 'O ORÇAMENTO DE 2026 PREVIA R$ 3,5 MI'},
    {a: T.estr, b: T.es24, texto: 'CONSERVAÇÃO DAS ESTRADAS VICINAIS (ZONA RURAL)'},
    {a: T.es24, b: T.es25, texto: 'ESTRADAS VICINAIS 2024: R$ 1,9 MI'},
    {a: T.es25, b: T.es26, texto: 'ESTRADAS VICINAIS 2025: R$ 900 MIL'},
    {a: T.es26, b: T.parte, texto: '2026 ATÉ AGOSTO: R$ 441 MIL DE R$ 2,7 MI PREVISTOS', destaque: true},
    {a: T.parte, b: T.autarq, texto: 'O QUE QUASE NINGUÉM VÊ'},
    {a: T.autarq, b: T.nada, texto: 'AUTARQUIA DE TURISMO: R$ 24 MIL NO ORÇAMENTO DE 2026'},
    {a: T.nada, b: T.taxa, texto: 'GASTO ATÉ SETEMBRO: R$ 0', destaque: true},
    {a: T.taxa, b: T.tribunal, texto: 'TAXA DE TURISMO: NENHUMA NAS RECEITAS DECLARADAS'},
    {a: T.tribunal, b: T.den, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.den, b: T.semdec, texto: 'DENÚNCIA (2025): PREGÃO DE ESTRUTURA E GERADOR PARA EVENTOS'},
    {a: T.semdec, b: T.gastar, texto: 'AINDA SEM DECISÃO'},
    {a: T.gastar, b: T.masse, texto: 'GASTAR COM FESTA NÃO É CRIME'},
    {a: T.masse, b: T.estrada, texto: 'EVENTOS: R$ 2,7 MI · R$ 3,7 MI · R$ 4,9 MI'},
    {a: T.estrada, b: T.quem + 0.55, texto: 'ESTRADAS VICINAIS: R$ 1,9 MI · R$ 900 MIL · R$ 441 MIL'},
    {a: T.quem + 0.5, b: T.segue + 0.75, texto: 'QUEM ESCOLHEU ESSA PRIORIDADE?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.zeros, texto: 'FONTE: DESPESA E RECEITA SIGA AGO/2026 · TCM-BA'},
  {a: T.zeros, b: T.repara, texto: 'FONTE: DESPESA POR AÇÃO · TCM-BA · ATLAS ESGOTOS (ANA)'},
  {a: T.repara, b: T.parte, texto: 'FONTE: ANEXO 6 DE 2024 E 2025 E SIGA AGO/2026 · TCM-BA'},
  {a: T.parte, b: T.tribunal, texto: 'FONTE: SIGA SET/2026 DA ITACARÉ-TUR E RECEITAS · TCM-BA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
  {a: T.gastar, b: FIM + 1, texto: 'FONTE: ANEXO 6 DE 2024 E 2025 E SIGA AGO/2026 · TCM-BA'},
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
    r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(f.v / ESCALA, LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number) => soma(c, [0, altTorre(v / esc, LADO_A) + 0.3, 0]);
  // os eventos e as estradas vicinais
  const fimE = T.estr - 0.05;
  r.push(
    {a: T.ev24 + 0.5, b: fimE, p: topo(EV.ev24.p, EV.ev24.v, ESC_E), valor: 'R$ 2,7 MI', sub: 'EVENTOS · 2024', cor: CA[0]},
    {a: T.ev25 + 0.5, b: fimE, p: topo(EV.ev25.p, EV.ev25.v, ESC_E), valor: 'R$ 3,7 MI', sub: 'EVENTOS · 2025', cor: CA[1]},
    {a: T.ev26 + 0.6, b: fimE, p: topo(EV.ev26.p, EV.ev26.v, ESC_E), valor: 'R$ 4,9 MI', sub: '2026 · ATÉ AGO', cor: CA[2]},
    {a: T.prev + 0.5, b: fimE, p: topo(EV.prev.p, EV.prev.v, ESC_E), valor: 'R$ 3,5 MI', sub: 'PREVISTO · 2026'},
  );
  const fimS = T.parte - 0.05;
  r.push(
    {a: T.es24 + 0.5, b: fimS, p: topo(ES.es24.p, ES.es24.v, ESC_E), valor: 'R$ 1,9 MI', sub: 'ESTRADAS · 2024', cor: CA[0]},
    {a: T.es25 + 0.5, b: fimS, p: topo(ES.es25.p, ES.es25.v, ESC_E), valor: 'R$ 900 MIL', sub: 'ESTRADAS · 2025', cor: CA[1]},
    {a: T.es26 + 0.5, b: fimS, p: topo(ES.es26.p, ES.es26.v, ESC_E), valor: 'R$ 441 MIL', sub: '2026 · ATÉ AGO', cor: CA[2]},
    {a: T.esprev + 0.4, b: fimS, p: topo(ES.esprev.p, ES.esprev.v, ESC_E), valor: 'R$ 2,7 MI', sub: 'PREVISTO · 2026'},
  );
  // a autarquia de turismo
  const fimA = T.tribunal - 0.05;
  r.push(
    {a: T.autarq + 0.6, b: T.nada + 0.15, p: topo(AU.p, AU.v, ESC_AU), valor: 'R$ 24 MIL', sub: 'PREVISTOS · 2026'},
    {a: T.nada + 0.05, b: fimA, p: topo(AU.p, AU.v, ESC_AU), valor: 'R$ 0 GASTO', sub: 'DE R$ 24 MIL · ATÉ SET/2026', cor: C.alerta},
  );
  // a pergunta: o último ano de cada um
  r.push(
    {a: T.masse + 0.5, b: FIM + 1, p: topo(QQ.ev26.p, QQ.ev26.v, ESC_E), valor: 'R$ 4,9 MI', sub: 'EVENTOS · 2026 ATÉ AGO', cor: CA[2]},
    {a: T.estrada + 0.6, b: FIM + 1, p: topo(QQ.es26.p, QQ.es26.v, ESC_E), valor: 'R$ 441 MIL', sub: 'ESTRADAS · 2026 ATÉ AGO', cor: CA[2]},
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
const GANCHO_FIM = quando('Eu abri');
const soMapa = (t: number) => t < T.gastou24 - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.gastou24) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara + 0.35);
  const miolo = vis(t, T.repara + 0.35, T.tribunal - 0.3) + vis(t, T.masse - 0.2, FIM + 2);
  const escalaTxt = miolo > 0.01 ? (t >= T.parte && t < T.tribunal ? 'AQUI, 1 PILHA = R$ 10 MIL' : 'AQUI, 1 PILHA = R$ 200 MIL') : '1 PILHA = R$ 4 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // gancho visual (item 14): o número do gancho em destaque enquanto a voz fala (0,75 s até "Eu abri")
    const kg = entra(t, 0.75, 0.45) * (1 - rampa(t, GANCHO_FIM - 0.4, GANCHO_FIM));
    return (
      <>
      {kg > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kg)}}>
          <Chip tema={tema} texto="GASTOU R$ 176 MI EM 2025" k={entra(t, 0.75, 0.45)} destaque tam={34} />
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
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/itacare.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.ev24, T.ev25, T.ev26, T.es24, T.es25, T.es26, T.nada, T.masse, T.estrada];
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
  [T.san, T.dren].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.16}));
  [T.ev24, T.ev25, T.prev, T.es24, T.es25, T.esprev, T.autarq].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  // item 14: a revelação principal (eventos de 2026 só até agosto) ganha o som de impacto
  s.push({t: T.ev26 + 0.1, f: 'impacto', v: 0.2}, {t: 0.8, f: 'pop', v: 0.18});
  [T.es26, T.nada].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  [T.masse, T.estrada].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.17}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 4, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.mais24 + 1.0, T.deficit + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 0.8, T.gastou25 + 0.9, T.mais25 + 0.9,
  ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 0.6, T.arrec26 + 0.8, T.gastou26 + 0.9, T.empenhou + 1.2, T.mais26 + 0.8,
  ...Y2.entradas.map((e) => e.t + 0.9),
  T.zeros + 0.4, T.san + 0.9, T.embasa + 1.0, T.dren + 1.4,
  T.repara + 0.6, T.ev24 + 1.0, T.ev25 + 1.0, T.ev26 + 1.2, T.prev + 1.0,
  T.estr + 0.8, T.es24 + 1.0, T.es25 + 1.0, T.es26 + 1.0, T.esprev + 0.9,
  T.parte + 0.6, T.autarq + 1.2, T.nada + 0.8, T.taxa + 1.2,
  T.tribunal + 0.4, T.den + 1.4, T.semdec + 0.8,
  T.gastar + 0.5, T.masse + 1.0, T.estrada + 1.0, T.quem + 0.8, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItacare: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="ITACARÉ" t={t} final={T.segue} yAbertura={700} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Festa sobe,', 'estrada', 'desce. Quem', 'escolheu?'];
export const CapaOrcamentoItacare: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITACARÉ`} t={1} troca={0} y={SEGURO.topo + 160} />
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
