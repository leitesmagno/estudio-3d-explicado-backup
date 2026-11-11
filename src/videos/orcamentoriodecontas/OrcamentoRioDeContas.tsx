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
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 066. orçamento de Rio de Contas (BA) (perfil @eumagnoleite, série Magno Explica). TESTE DA RECEITA DETALHADA (regras 19 e 20).
// MOLDE: 035 Paratinga, pelo código do 064 Teixeira de Freitas. O Kit Mapas abre (voo até Rio de Contas e o que a prefeitura
// arrecadou em 2024: projetos/066.../mapas/riodecontas.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada
// ano, a PILHA DO ANO em volta dele. Cidade pequena (R$ 60 a 72 mi por ano): 1 MOEDA = R$ 200 MIL e 1 PILHA = R$ 2 MI.
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, sempre no mesmo sentido.
// NOVO (regra 19): em 2026, "DE ONDE VEIO": quatro entradas chegam na frente do cofre (CIDADE, UNIÃO, ESTADO, FUNDEB), uma de
// cada vez na palavra, e o FPM mostra o que foi para o Fundeb e o que voltou. RITMO (regra 20): plaquinha nova fica pelo menos
// 2,5 s; no máximo 2 informações novas por vez. Achados no miolo: CULTURA x ASSISTÊNCIA e a EMENDA PIX esperando.
// Sem porcentagem, sem nome de gestor, de parlamentar ou de empresa. SÓ DADOS DE RIO DE CONTAS: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 174.41; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,114, -15 LUFS (v3: regra 22)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '066. orçamento de rio de contas';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 65'),
  arrec24: quando('Arrecadou 65'),
  gastou24: quando('Gastou 64'),
  sobrou24: quando('Sobraram 400'),
  ano25: quando('2025 Arrecadou 72'),
  arrec25: quando('Arrecadou 72'),
  gastou25: quando('Gastou 61'),
  sobra25: quando('Sobraram 10'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 60'),
  deonde: quando('De onde veio'),
  propria: quando('Impostos da propria'),
  iptu: quando('O IPTU previa'),
  ilum: quando('A iluminacao publica'),
  uniao: quando('Da Uniao 41'),
  sauU: quando('sendo 4 milhoes e 900'),
  estado: quando('Do Estado 7'),
  sauE: quando('com 535'),
  fundeb: quando('E do Fundeb'),
  fpm: quando('O FPM maior repasse'),
  semfundeb: quando('chega sem a parte'),
  icms: quando('Com o ICMS'),
  voltaram: quando('Voltaram 8'),
  gastou26: quando('Gastou 54'),
  empenhou: quando('E ja empenhou'),
  maisque: quando('Mais do que arrecadou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara na cultura'),
  duas: quando('Quase tudo sai de duas'),
  conv: quando('Em 2026 1 milhao e 250'),
  mesmo: quando('Mesmo assim a cultura'),
  espera: quando('E tem dinheiro esperando'),
  maio: quando('Em maio chegaram 3'),
  infra: quando('2 milhoes para infraestrutura'),
  zero: quando('essa fonte aparece com zero'),
  licit: quando('A prefeitura abriu licitacoes'),
  naodiz: quando('as contas nao dizem se usam'),
  tribunal: quando('No Tribunal de Contas o Ministerio'),
  limpeza: quando('e o contrato da limpeza'),
  semjul: quando('ainda sem julgamento'),
  bn: quando('Segundo o Bahia Noticias'),
  susp: quando('o Tribunal suspendeu'),
  culturaimp: quando('Cultura importa'),
  mas: quando('Mas se ela ja leva'),
  emenda3: quando('e 3 milhoes de emenda esperam'),
  primeiro: quando('o que vem primeiro'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 11 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS, LIMPEZA E ESTRADAS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
// o esporte de 2024 ficou em zero (nenhuma ação de esporte teve gasto): a casinha fica cinza só em 2024
const ZERADO = (id: string, t: number) => id === 'esp' && t < T.ano25;

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.162 * Math.PI);
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
const ORDEM = ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agr', 'esp', 'mam'];
const lista = (tempos: number[], v: number[], rots: Record<string, string> = {}): Entrada[] => ORDEM.map((s, k) => ({s, t: tempos[k], v: v[k], rot: rots[s]}));
const q = (...f: string[]) => f.map((x) => quando(x));
const ANOS: Ano[] = [
  // 2024: arrecadou 65,23 e gastou 64,84: o Balanço traz superávit de 395 mil
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 64.84, rotulo: '2024', falta: {t: T.sobrou24, v: 0.395, txt: 'SOBRA', sobra: true, rot: 'SOBRA: R$ 395 MIL'},
    entradas: lista(q('Educacao 24', 'Saude 16 milhoes e 100', 'Administracao 4 milhoes e 900', 'Obras limpeza e estradas 10', 'Camara de Vereadores 2', 'Dividas quase 2', 'Cultura quase 3', 'Assistencia social 1 milhao e 600', 'Agricultura 270', 'Esporte zero', 'Meio ambiente 100'),
      [24.16, 16.084, 4.894, 10.268, 2.415, 1.952, 2.984, 1.592, 0.274, 0, 0.101], {div: 'R$ 1,95 MI', cul: 'R$ 2,98 MI', esp: 'R$ 0'})},
  // 2025: arrecadou 72,25 e gastou 61,30: o Balanço traz superávit de 10,95 mi
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 61.3, rotulo: '2025', falta: {t: T.sobra25, v: 10.945, txt: 'SOBRA', sobra: true, rot: 'SOBRA: R$ 10,9 MI'},
    entradas: lista(
      [quando('Educacao 21'), quando('Saude 16 milhoes e 100', 2), quando('Administracao 5'), quando('Obras limpeza e estradas 6 milhoes e 800'), quando('Camara 2 milhoes e 900'), quando('Dividas 3'), quando('Cultura 2 milhoes e 800'), quando('Assistencia social 1 milhao Agricultura'), quando('Agricultura 240'), quando('Esporte 29'), quando('Meio ambiente 200')],
      [21.862, 16.111, 5.904, 6.803, 2.852, 3.314, 2.821, 1.017, 0.242, 0.029, 0.203])},
  // 2026 (Prefeitura + Câmara, liquidado até setembro): arrecadou 60,95, gastou 54,22, empenhou 66,77
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 54.22, rotulo: '2026 · ATÉ SET', falta: {t: T.gastou26, v: 0, txt: ''},
    entradas: lista(
      [quando('Educacao quase 20'), quando('Saude 13'), quando('Administracao 4 milhoes e 600'), quando('Obras limpeza e estradas 6 milhoes e 800', 2), quando('Camara 2 milhoes e 300'), quando('Dividas 1'), quando('Cultura 3 milhoes e 500'), quando('Assistencia social 920'), quando('Agricultura 1 milhao'), quando('Esporte 28'), quando('Meio ambiente 170')],
      [19.961, 13.537, 4.591, 6.819, 2.345, 1.087, 3.525, 0.922, 1.009, 0.028, 0.168], {edu: 'R$ 19,96 MI'})},
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
const ESCALA = 2; // 1 moeda = R$ 200 mil; 1 pilha = R$ 2 milhões (cidade pequena, como no molde 035)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa de 30 a 40 pilhas) ----------
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

// ---------- 2026: DE ONDE VEIO (regra 19), quatro entradas na frente do cofre, 1 pilha = R$ 2 mi ----------
const ZO = 3.4;
const ORIGEM = {
  cid: {p: [-2.4, 0, ZO] as V3, v: 3.945, a: T.propria, valor: 'R$ 3,95 MI', sub: 'IMPOSTOS DA CIDADE'},
  uni: {p: [-0.8, 0, ZO] as V3, v: 41.72, a: T.uniao, valor: 'R$ 41,7 MI', sub: 'DA UNIÃO'},
  est: {p: [0.8, 0, ZO] as V3, v: 7.177, a: T.estado, valor: 'R$ 7,2 MI', sub: 'DO ESTADO'},
  fun: {p: [2.4, 0, ZO] as V3, v: 8.092, a: T.fundeb, valor: 'R$ 8,1 MI', sub: 'DO FUNDEB'},
};
// o que saiu antes para o Fundeb (fantasma vermelho): 5,13 do FPM e, somando ICMS, IPVA e ITR, 6,31
const FOI_POS: V3 = [0.8, 0, ZO + 1.0];
const ORIGEM_VIS = (t: number) => vis(t, T.deonde - 0.1, T.gastou26 - 0.15);
const ORIGEM_CENTRO: V3 = [0, 0, ZO + 0.3];

// ---------- Os achados no miolo (1 pilha = R$ 1 mi, uma pilha por andar), lado a lado ----------
const ZA = 0.2;
const ESC_A = 1;
const LADO_A = 1;
// cultura x assistência social (2026 até setembro), com a parte da cultura paga por convênio do Estado
const CULT_CENTRO: V3 = [-1.5, 0, ZA];
const CUL = {cul: {p: [-2.3, 0, ZA] as V3, v: 3.525}, est: {p: [-1.5, 0, ZA] as V3, v: 1.255}, ass: {p: [-0.7, 0, ZA] as V3, v: 0.922}};
const CULT_VIS = (t: number) => vis(t, T.repara - 0.1, T.espera - 0.25) + vis(t, T.mas - 0.45, FIM + 2);
// a emenda Pix de maio/2026: 2,05 para infraestrutura urbana e 0,995 para esporte; fonte com zero gasto até setembro
const EMD_CENTRO: V3 = [1.6, 0, ZA];
const EMD = {inf: {p: [1.15, 0, ZA] as V3, v: 2.05}, esp: {p: [2.05, 0, ZA] as V3, v: 0.995}};
const EMD_VIS = (t: number) => vis(t, T.espera - 0.1, T.tribunal - 0.25) + vis(t, T.emenda3 - 0.4, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.6];
// ★ melhoria (atenção): as duas pastas do Ministério Público ao lado do Tribunal, com carimbo que muda com a fala
const PASTA1: V3 = [-2.1, 0, -0.9];
const PASTA2: V3 = [2.1, 0, -0.9];

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
    // na frente do cofre: torres-fantasma do que sobrou (2024, 2025)
    ANOS.forEach((y) => {
      if (y.falta.v <= 0) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  // 2026: de onde veio (cada entrada cresce na palavra dela; tudo afunda no "Gastou")
  const ov = ORIGEM_VIS(t);
  if (ov > 0.01) {
    Object.values(ORIGEM).forEach((o) => {
      const k = rampa(t, o.a + 0.2, o.a + 1.1) * ov;
      if (k > 0.01) solidas.push(...torre(o.p, Math.max(0.2, o.v / ESCALA) * k, LADO, CA[2]));
    });
    const kf = rampa(t, T.semfundeb + 0.2, T.semfundeb + 1.0) * ov;
    const vFoi = 5.129 + (6.307 - 5.129) * rampa(t, T.icms + 0.4, T.icms + 1.3);
    if (kf > 0.01) fantasmas.push(...torre(FOI_POS, (vFoi / ESCALA) * kf, LADO, C.alerta));
  }
  // cultura x assistência social
  const cv = CULT_VIS(t);
  const final = t >= T.culturaimp - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  if (cv > 0.01) {
    const kc = cresce(T.repara + 0.5) * cv;
    if (kc > 0.01) solidas.push(...torre(CUL.cul.p, (CUL.cul.v / ESC_A) * kc, LADO_A, CA[2]));
    if (!final) {
      const ke = rampa(t, T.conv + 0.4, T.conv + 1.2) * cv;
      if (ke > 0.01) solidas.push(...torre(CUL.est.p, (CUL.est.v / ESC_A) * ke, LADO_A, C.agua));
    }
    const ka = (final ? rampa(t, T.mas + 0.3, T.mas + 1.0) : rampa(t, T.mesmo + 0.4, T.mesmo + 1.1)) * cv;
    if (ka > 0.01) solidas.push(...torre(CUL.ass.p, Math.max(0.3, CUL.ass.v / ESC_A) * ka, LADO_A, tema.objetoClaro));
  }
  // a emenda Pix
  const ev = EMD_VIS(t);
  if (ev > 0.01) {
    const k1 = (final ? rampa(t, T.emenda3 + 0.1, T.emenda3 + 0.9) : rampa(t, T.maio + 0.4, T.maio + 1.3)) * ev;
    if (k1 > 0.01) {
      solidas.push(...torre(EMD.inf.p, (EMD.inf.v / ESC_A) * k1, LADO_A, C.liquido));
      solidas.push(...torre(EMD.esp.p, Math.max(0.3, EMD.esp.v / ESC_A) * k1, LADO_A, C.liquido));
    }
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
  const zerado = ZERADO(s.id, t);
  const aceso = zerado ? 0 : Math.max(0, ...ditas);
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
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const C = coresOI(tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)), janela(t, T.voltaram, T.gastou26 + 0.4, 0.5));
  const ov = ORIGEM_VIS(t);
  const cv = CULT_VIS(t);
  const ev = EMD_VIS(t);
  const tribunal = vis(t, T.tribunal - 0.2, T.culturaimp - 0.1);
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

      {/* 2026: a gaveta "DE ONDE VEIO", na frente do cofre */}
      {ov > 0.01 ? <BaseGaveta tema={tema} pos={ORIGEM_CENTRO} sobe={ov} larg={6.2} texto="DE ONDE VEIO · 2026" aceso={janela(t, T.deonde, T.gastou26, 0.4)} /> : null}
      {/* os achados: cultura x assistência e a emenda Pix */}
      {cv > 0.01 ? <BaseGaveta tema={tema} pos={CULT_CENTRO} sobe={cv} larg={2.9} texto="CULTURA x ASSIST." aceso={Math.max(janela(t, T.repara, T.espera, 0.4), janela(t, T.mas, FIM, 0.4))} /> : null}
      {ev > 0.01 ? <BaseGaveta tema={tema} pos={EMD_CENTRO} sobe={ev} larg={2.6} texto="EMENDA PIX" aceso={Math.max(janela(t, T.espera, T.tribunal, 0.4), janela(t, T.emenda3, FIM, 0.4))} /> : null}

      {/* o Tribunal e as duas pastas do Ministério Público (carnaval de 2025 e contrato da limpeza) */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={tribunal} aceso={janela(t, T.tribunal, T.culturaimp, 0.5)} />
      <PastaProcesso
        tema={tema}
        pos={PASTA1}
        rotY={0.25}
        escala={0.8}
        sobe={vis(t, T.tribunal + 0.6, T.culturaimp - 0.1)}
        titulo="CARNAVAL 2025"
        valor="MIN. PÚBLICO"
        carimbo={rampa(t, T.semjul + 0.1, T.semjul + 0.5)}
        textoCarimbo="SEM JULGAMENTO"
        corCarimbo={C.ouro}
        aceso={janela(t, T.tribunal, T.limpeza, 0.5)}
      />
      <PastaProcesso
        tema={tema}
        pos={PASTA2}
        rotY={-0.25}
        escala={0.8}
        sobe={vis(t, T.limpeza - 0.2, T.culturaimp - 0.1)}
        titulo="LIMPEZA"
        valor="CONTRATO"
        carimbo={t < T.susp ? rampa(t, T.semjul + 0.1, T.semjul + 0.5) : rampa(t, T.susp + 0.2, T.susp + 0.6)}
        textoCarimbo={t < T.susp ? 'SEM JULGAMENTO' : 'AUMENTO SUSPENSO'}
        corCarimbo={t < T.susp ? C.ouro : C.alerta}
        aceso={janela(t, T.limpeza, T.culturaimp, 0.5)}
      />
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
// achados: câmera um pouco alta, para o fundo ser a mesa
const PB = (c: V3, larg: number, h: number, dx = 0, el = 1.1): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, el, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre-fantasma da sobra; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobrou24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre-fantasma do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: sobe; DE ONDE VEIO na frente do cofre (entrada por entrada), o FPM e o Fundeb; depois o cofre ganha a pilha rosa
  {
    ini: T.ano26 - 0.1,
    arco: 0.04,
    chaves: [
      [T.ano26 - 0.1, DE_CIMA(0.15)],
      [T.arrec26 + 0.4, COFRE(0.05)],
      [T.deonde + 0.2, PB(ORIGEM_CENTRO, 7.4, 2.4, -0.04, 2.2)],
      [T.estado + 0.4, PB(ORIGEM_CENTRO, 7.2, 2.4, 0, 2.2)],
      [T.fpm - 0.1, PB(soma(ORIGEM.uni.p, [0.8, 0, 0.4]), 5.2, 2.6, -0.02, 2.2)],
      [T.icms + 0.3, PB(soma(ORIGEM.est.p, [0.4, 0, 0.4]), 5.6, 2.4, 0.02, 2.2)],
      [T.voltaram + 0.2, PB(soma(ORIGEM.fun.p, [-0.7, 0, 0.4]), 5.2, 2.4, 0.03, 2.2)],
      [T.gastou26 + 0.2, COFRE(0.05)],
      [T.folha + 0.5, COFRE(0.08)],
      [Y2.entradas[0].t - 0.4, COFRE(0.1)],
    ],
  },
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // cultura x assistência social
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, DE_CIMA(0.1)],
      [T.repara + 0.6, PB(CULT_CENTRO, 4.4, 2.8, -0.04, 2.4)],
      [T.conv + 0.2, PB(soma(CULT_CENTRO, [-0.2, 0, 0]), 4.0, 2.8, -0.02, 2.4)],
      [T.mesmo + 0.2, PB(CULT_CENTRO, 4.2, 2.8, 0.01, 2.4)],
      [T.espera - 0.3, PB(CULT_CENTRO, 4.4, 2.8, 0.03, 2.4)],
    ],
  },
  // a emenda Pix
  {
    ini: T.espera - 0.1,
    arco: 0.03,
    chaves: [
      [T.espera - 0.1, PB(EMD_CENTRO, 4.6, 2.2, -0.03, 2.4)],
      [T.infra + 0.2, PB(EMD_CENTRO, 4.0, 2.2, -0.01, 2.4)],
      [T.zero, PB(EMD_CENTRO, 3.8, 2.2, 0.01, 2.4)],
      [T.tribunal - 0.3, PB(EMD_CENTRO, 4.0, 2.2, 0.03, 2.4)],
    ],
  },
  // o Tribunal: o prédio e as duas pastas
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.6], 7.0, 5.6, [0, 1.5, 1])],
      [T.limpeza - 0.3, E([0, 0.9, -1.2], 6.6, 4.8, [0, 1.4, 1])],
      [T.semjul + 0.6, E([0, 0.9, -1.1], 6.2, 4.6, [0.02, 1.4, 1])],
      [T.bn - 0.2, E(soma(PASTA2, [0, 0.85, 0]), 3.0, 2.8, [-0.03, 1.0, 1])],
      [T.culturaimp - 0.3, E(soma(PASTA2, [0, 0.85, 0]), 2.9, 2.7, [0.03, 1.0, 1])],
    ],
  },
  // a pergunta: a mesa, a cultura x assistência e a emenda esperando, lado a lado, e de novo a mesa inteira
  {
    ini: T.culturaimp - 0.1,
    arco: 0.04,
    chaves: [
      [T.culturaimp - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PB(CULT_CENTRO, 4.6, 2.8, -0.02, 2.4)],
      [T.emenda3 + 0.2, PB([0, 0, ZA], 7.4, 2.8, 0, 2.4)],
      [T.segue - 0.1, PB([0, 0, ZA], 7.6, 2.8, 0.02, 2.4)],
      [T.segue + 0.9, E([0, 1.0, ZA], 11.0, 7.6, [-0.1, 1.4, 1])],
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
  [0, 'RIO DE CONTAS'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.deonde, '2026 · DE ONDE VEIO'],
  [T.gastou26, '2026 · PARA ONDE FOI'],
  [T.repara, 'CULTURA x ASSISTÊNCIA'],
  [T.espera, 'A EMENDA PIX'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.culturaimp, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobrou24, texto: 'GASTOU EM 2024: R$ 64,8 MI'},
    {a: T.sobrou24, b: Y0.entradas[0].t, texto: 'O BALANÇO FECHA COM SOBRA: R$ 395 MIL', destaque: true},
    {a: T.ano25, b: T.arrec25 + 0.3, texto: '2025'},
    {a: T.arrec25 + 0.3, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 72,2 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 61,3 MI'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRA: R$ 10,9 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.deonde, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 60,9 MI'},
    {a: T.deonde, b: T.iptu, texto: 'DE ONDE VEIO ESSE DINHEIRO?', destaque: true},
    {a: T.iptu, b: T.ilum, texto: 'IPTU: PREVISTO R$ 298 MIL NO ANO · ARRECADADO R$ 175 MIL ATÉ SET.'},
    {a: T.ilum, b: T.uniao, texto: 'CONTRIBUIÇÃO DE ILUMINAÇÃO PÚBLICA: R$ 13,9 MIL'},
    {a: T.uniao, b: T.sauU, texto: 'DA UNIÃO: R$ 41,7 MI'},
    {a: T.sauU, b: T.sauE, texto: 'SUS DA UNIÃO: R$ 4,9 MI (NO FNS, R$ 5,6 MI: DATA OU CÓDIGO?)', destaque: true},
    {a: T.sauE, b: T.fundeb, texto: 'DO ESTADO: R$ 7,2 MI · PARA A SAÚDE: R$ 535 MIL'},
    {a: T.fundeb, b: T.fpm, texto: 'DO FUNDEB, O FUNDO DA EDUCAÇÃO: R$ 8,1 MI'},
    {a: T.fpm, b: T.icms, texto: 'O FPM CHEGA SEM A PARTE DO FUNDEB: R$ 5,1 MI ATÉ SET.'},
    {a: T.icms, b: T.voltaram, texto: 'A CIDADE MANDOU R$ 6,3 MI AO FUNDEB'},
    {a: T.voltaram, b: T.gastou26, texto: 'VOLTARAM R$ 8,1 MI, PELO NÚMERO DE ALUNOS', destaque: true},
    {a: T.gastou26, b: T.empenhou, texto: 'GASTOU ATÉ SETEMBRO: R$ 54,2 MI'},
    {a: T.empenhou, b: T.maisque, texto: 'EMPENHOU (RESERVOU PARA PAGAR): R$ 66,8 MI'},
    {a: T.maisque, b: T.folha, texto: 'MAIS DO QUE ARRECADOU (R$ 60,9 MI)', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: e.v === 0 ? `${nomeDe(e.s)}: R$ 0 · NENHUMA AÇÃO TEVE GASTO` : `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.duas, texto: 'AGORA REPARA NA CULTURA'},
    {a: T.duas, b: T.conv, texto: 'QUASE TUDO EM DUAS CONTAS: MANIFESTAÇÕES ARTÍSTICAS E POPULARES'},
    {a: T.conv, b: T.mesmo, texto: '2026: R$ 1,25 MI DA CULTURA VEIO DE CONVÊNIO COM O ESTADO'},
    {a: T.mesmo, b: T.espera, texto: 'MESMO ASSIM: MAIS DE 3 VEZES A ASSISTÊNCIA SOCIAL', destaque: true},
    {a: T.espera, b: T.maio, texto: 'E TEM DINHEIRO ESPERANDO'},
    {a: T.maio, b: T.infra, texto: 'MAIO/2026: R$ 3,04 MI DE EMENDA PIX', destaque: true},
    {a: T.infra, b: T.zero, texto: 'EMENDA PIX: DE PARLAMENTARES DIRETO À PREFEITURA'},
    {a: T.zero, b: T.licit, texto: 'ATÉ SETEMBRO: ZERO GASTO COM ESSA FONTE', destaque: true},
    {a: T.licit, b: T.naodiz, texto: 'LICITAÇÕES DE CALÇAMENTO ABERTAS EM 2026 (PNCP)'},
    {a: T.naodiz, b: T.tribunal, texto: 'AS CONTAS NÃO DIZEM SE USAM ESSE DINHEIRO'},
    {a: T.tribunal, b: T.limpeza, texto: 'MINISTÉRIO PÚBLICO: DESPESAS DO CARNAVAL DE 2025'},
    {a: T.limpeza, b: T.semjul, texto: 'E O CONTRATO DA LIMPEZA'},
    {a: T.semjul, b: T.bn, texto: 'OS DOIS AINDA SEM JULGAMENTO'},
    {a: T.bn, b: T.culturaimp, texto: 'OUT/2026: TCM SUSPENDEU O AUMENTO DE 2026 DA LIMPEZA', destaque: true},
    {a: T.culturaimp, b: T.mas, texto: 'CULTURA IMPORTA'},
    {a: T.mas, b: T.emenda3, texto: '2026: CULTURA, MAIS QUE O TRIPLO DA ASSISTÊNCIA'},
    {a: T.emenda3, b: T.segue, texto: 'E R$ 3 MI DE EMENDA ESPERAM. O QUE VEM PRIMEIRO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.deonde, texto: 'FONTE: SIGA SET/2026 · RECEITA (PCMGE016) · TCM-BA'},
  {a: T.deonde, b: T.gastou26, texto: 'FONTE: SIGA SET/2026 · RECEITA (PCMGE016) · TCM-BA · FNS'},
  {a: T.gastou26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.espera, texto: 'FONTE: SIGA SET/2026 · AÇÕES DA CULTURA · TCM-BA'},
  {a: T.espera, b: T.licit, texto: 'FONTE: SIGA SET/2026 · TRANSFEREGOV · PORTAL DA TRANSPARÊNCIA'},
  {a: T.licit, b: T.tribunal, texto: 'FONTE: PNCP · LICITAÇÕES DA PREFEITURA EM 2026'},
  {a: T.tribunal, b: T.bn, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
  {a: T.bn, b: T.culturaimp, texto: 'FONTE: BAHIA NOTÍCIAS, 26/10/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

// RITMO (regra 20): toda plaquinha nova fica pelo menos 2,5 s parada e legível
const MIN_PLACA = 2.5;
type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      const i = idx(e.s);
      const proxT = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      // a do ano falado fica pelo menos 2,5 s; as de relembrar (anos anteriores) saem junto com a fala (0,45 s depois)
      const bVelho = ei + 1 < y.entradas.length ? proxT + 0.45 : Math.min(e.t + 3.2, y.fim + 0.3);
      const bNovo = Math.max(bVelho, e.t + 0.35 + MIN_PLACA);
      for (let k = 0; k <= yi; k++) {
        const b = k === yi ? bNovo : bVelho;
        const v = valorDe(e.s, k);
        if (v <= 0) {
          // o zero de 2024 (esporte) ganha plaquinha só no ano em que é dito
          if (k === yi) r.push({a: e.t + 0.35, b, p: soma(posTorre(i, k), [0, 0.9, 0]), valor: 'R$ 0', sub: `${ANO_SUB[k]} · NENHUMA AÇÃO`});
          continue;
        }
        r.push({a: e.t + (k === yi ? 0.35 : 0.3 + k * 0.1), b, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtE(entradaDe(e.s, k)), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const f = y.falta;
    if (f.v > 0) r.push({a: f.t + 0.4, b: Math.max(y.entradas[0].t - 0.1, f.t + 0.4 + MIN_PLACA), p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  // 2026: de onde veio (uma entrada por vez; no máximo 2 novas juntas)
  const topoO = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.2, v / ESCALA), LADO) + 0.35, 0]);
  const fimO = T.gastou26 - 0.2;
  const O = ORIGEM;
  // a cidade: o total e, uma de cada vez, o IPTU (previsto x arrecadado) e a iluminação pública (regra 22)
  r.push({a: O.cid.a + 0.6, b: Math.max(T.iptu + 0.3, O.cid.a + 0.6 + MIN_PLACA), p: topoO(O.cid.p, O.cid.v), valor: O.cid.valor, sub: O.cid.sub, cor: CA[2]});
  r.push({a: T.iptu + 0.6, b: Math.max(T.ilum + 0.2, T.iptu + 0.6 + MIN_PLACA), p: soma(topoO(O.cid.p, O.cid.v), [0, 0.5, 0]), valor: 'IPTU: R$ 175 MIL', sub: 'PREVISTO NO ANO: R$ 298 MIL', cor: CA[2]});
  r.push({a: T.ilum + 0.5, b: T.ilum + 0.5 + MIN_PLACA + 0.2, p: soma(topoO(O.cid.p, O.cid.v), [0, 0.5, 0]), valor: 'R$ 13,9 MIL', sub: 'ILUMINAÇÃO PÚBLICA', cor: CA[2]});
  // União e Estado: o total e a parte da SAÚDE (SUS), regra 22
  r.push({a: O.uni.a + 0.6, b: T.fpm + 0.2, p: topoO(O.uni.p, O.uni.v), valor: O.uni.valor, sub: O.uni.sub, cor: CA[2]});
  r.push({a: T.sauU + 0.5, b: Math.max(T.sauU + 0.5 + MIN_PLACA, T.fundeb + 0.3), p: soma(O.uni.p, [0, 0.35, 0.9]), valor: 'SAÚDE: R$ 4,9 MI', sub: 'SUS DA UNIÃO', cor: C.agua});
  r.push({a: O.est.a + 0.6, b: Math.max(O.est.a + 0.6 + MIN_PLACA, T.fpm - 0.3), p: topoO(O.est.p, O.est.v), valor: O.est.valor, sub: O.est.sub, cor: CA[2]});
  r.push({a: T.sauE + 0.5, b: Math.max(T.sauE + 0.5 + MIN_PLACA, T.fpm - 0.3), p: soma(O.est.p, [0, 0.35, 0.9]), valor: 'SAÚDE: R$ 535 MIL', sub: 'SUS DO ESTADO', cor: C.agua});
  r.push({a: O.fun.a + 0.6, b: T.voltaram + 0.1, p: topoO(O.fun.p, O.fun.v), valor: O.fun.valor, sub: O.fun.sub, cor: CA[2]});
  r.push({a: T.fpm + 0.6, b: fimO, p: topoO(O.uni.p, O.uni.v), valor: 'FPM: R$ 23,5 MI', sub: 'JÁ SEM A PARTE DO FUNDEB', cor: CA[2]});
  r.push({a: T.semfundeb + 0.8, b: Math.max(T.icms + 1.2, T.semfundeb + 0.8 + MIN_PLACA), p: soma(FOI_POS, [0, 1.15, 0]), valor: 'R$ 5,1 MI', sub: 'DO FPM PARA O FUNDEB', cor: C.alerta});
  r.push({a: Math.max(T.icms + 1.4, T.semfundeb + 0.9 + MIN_PLACA), b: fimO, p: soma(FOI_POS, [0, 1.15, 0]), valor: 'R$ 6,3 MI', sub: 'FOI PARA O FUNDEB', cor: C.alerta});
  r.push({a: T.voltaram + 0.3, b: fimO, p: topoO(O.fun.p, O.fun.v), valor: 'R$ 8,1 MI', sub: 'VOLTOU DO FUNDEB', cor: tema.acento});
  // cultura x assistência
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.35, v / ESC_A), LADO_A) + 0.3, 0]);
  const fimC = T.espera - 0.05;
  r.push({a: T.repara + 1.2, b: fimC, p: topo(CUL.cul.p, CUL.cul.v), valor: 'R$ 3,5 MI', sub: 'CULTURA · 2026', cor: CA[2]});
  r.push({a: T.conv + 1.0, b: Math.max(T.conv + 1.0 + MIN_PLACA, T.mesmo + 0.3), p: topo(CUL.est.p, CUL.est.v), valor: 'R$ 1,25 MI', sub: 'DELA, DO ESTADO', cor: coresOI(tema).agua});
  r.push({a: T.mesmo + 1.0, b: fimC, p: topo(CUL.ass.p, CUL.ass.v), valor: 'R$ 922 MIL', sub: 'ASSISTÊNCIA · 2026'});
  // a emenda Pix
  const fimE = T.tribunal - 0.05;
  r.push({a: T.infra + 0.4, b: T.zero + 0.4, p: topo(EMD.inf.p, EMD.inf.v), valor: 'R$ 2,05 MI', sub: 'INFRAESTRUTURA URBANA', cor: C.liquido});
  r.push({a: T.infra + 1.6, b: Math.max(T.zero + 0.4, T.infra + 1.6 + MIN_PLACA), p: topo(EMD.esp.p, EMD.esp.v), valor: 'R$ 995 MIL', sub: 'ESPORTE', cor: C.liquido});
  r.push({a: T.zero + 0.7, b: fimE, p: soma(EMD_CENTRO, [0, 2.3, 0]), valor: 'R$ 0', sub: 'GASTO ATÉ SET/2026', cor: C.alerta});
  // a pergunta
  r.push(
    {a: T.mas + 0.8, b: T.segue + 0.8, p: topo(CUL.cul.p, CUL.cul.v), valor: 'R$ 3,5 MI', sub: 'CULTURA · 2026', cor: CA[2]},
    {a: T.mas + 1.2, b: T.segue + 0.8, p: topo(CUL.ass.p, CUL.ass.v), valor: 'R$ 922 MIL', sub: 'ASSISTÊNCIA'},
    {a: T.emenda3 + 0.8, b: T.segue + 0.8, p: soma(EMD_CENTRO, [0, 2.3, 0]), valor: 'R$ 3,04 MI', sub: 'EMENDA PIX ESPERANDO', cor: C.liquido},
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
const qd = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: qd(T.gastou24) + 6};
const G1 = quando('Rio de Contas gastou 2');
const G2 = quando('Com toda a assistencia');
const G_FIM = quando('Eu abri');

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const miolo = vis(t, T.repara + 0.2, T.tribunal - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
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
          <div style={{fontFamily: MONO, fontSize: escalaTxt.length > 52 ? 13 : 16, fontWeight: 800, letterSpacing: 1.2, color: tema.texto}}>{escalaTxt}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    // ★ melhoria (gancho visual): enquanto a voz compara cultura e assistência social de 2025, os dois números entram no
    // mapa como chips, um embaixo do outro (cada um fica mais de 2,5 s)
    const kg = Math.min(entra(t, G1, 0.4), 1 - rampa(t, G_FIM + 0.6, G_FIM + 1.0));
    const kg2 = entra(t, G2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="CULTURA EM 2025: R$ 2,8 MI" k={entra(t, G1, 0.45)} destaque tam={32} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="TODA A ASSISTÊNCIA SOCIAL: R$ 1 MI" k={kg2} tam={28} /> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/riodecontas.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número forte ----------
const SOQUINHOS = [T.sobra25, T.uniao, T.voltaram, T.maisque, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 15).map((e) => e.t)), T.mesmo, T.maio, T.zero, T.susp, T.emenda3];
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
  // de onde veio: um pop por entrada; o que foi ao Fundeb (baque leve) e o que voltou (subida)
  [T.propria, T.iptu, T.ilum, T.uniao, T.sauU, T.estado, T.sauE, T.fundeb, T.fpm].forEach((t) => s.push({t: t + 0.25, f: 'pop', v: 0.17}));
  s.push({t: T.semfundeb + 0.3, f: 'baque', v: 0.13}, {t: T.voltaram + 0.2, f: 'subida', v: 0.16});
  [T.duas, T.conv, T.maio, T.infra, T.tribunal, T.limpeza].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.maisque, T.zero].forEach((t) => s.push({t: t + 0.3, f: 'baque', v: 0.15}));
  // ★ melhoria (atenção): impacto no "mais de três vezes" e no carimbo do aumento suspenso
  s.push({t: T.mesmo + 0.5, f: 'impacto', v: 0.14}, {t: T.susp + 0.3, f: 'impacto', v: 0.13});
  s.push({t: T.emenda3 + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.5, 1.5, 2.6, 3.6, 4.8, 7.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.sobrou24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.deonde + 0.6, T.propria + 1.2, T.iptu + 1.4, T.ilum + 1.2, T.uniao + 1.2, T.sauU + 1.2, T.estado + 1.2, T.sauE + 1.2, T.fundeb + 1.2, T.fpm + 1.3, T.semfundeb + 1.3, T.icms + 1.8, T.voltaram + 1.0,
  T.gastou26 + 0.9, T.empenhou + 1.2, T.maisque + 0.6, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.repara + 1.6, T.duas + 1.0, T.conv + 1.5, T.mesmo + 1.4, T.espera + 0.5, T.maio + 1.4, T.infra + 2.0, T.zero + 1.2, T.licit + 0.9, T.naodiz + 0.6,
  T.tribunal + 0.8, T.limpeza + 0.6, T.semjul + 0.6, T.bn + 0.6, T.susp + 1.0,
  T.culturaimp + 0.5, T.mas + 1.5, T.emenda3 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoRioDeContas: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="RIO DE CONTAS" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {/* selo do @eumagnoleite na abertura (arte aprovada, opção B; regras 15c e 18) */}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Cultura:', 'o triplo da', 'assistência.', 'Por quê?'];
export const CapaOrcamentoRioDeContas: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · RIO DE CONTAS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
