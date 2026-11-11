import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {temaPorId} from '../../estilo';
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, EstacaoSaneamento, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {CabecalhoDuplo, MarcaDaguaDupla} from './CabecalhoDuplo';
import {PALAVRAS} from './palavras';

// 094. orçamento de Paratinga (BA) 2018–2024 (perfil @eumagnoleite, parceria @eugeniodmr). Molde: 092 Ubaitaba.
// O Kit Mapas abre (projetos/094.../mapas/paratinga1824.mp4) e a maquete redonda mostra 7 ANOS na mesma mesa:
// cofre no meio; em cada ano a pilha do ano nasce em volta do cofre (1 pilha = R$ 4 mi) e voa para as casinhas na ordem da
// fala (Educação, Saúde, Obras, Câmara faladas; os outros 8 setores voam juntos, sem fala). Cada casinha guarda as torres
// dos 7 anos (2018–2021 na fileira da frente, 2022–2024 atrás), cada uma na cor do ano.
// "Gastou" = LIQUIDADO. Sem porcentagem, sem nome de gestor. Dados: projetos/094.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 179.01; // Algenib 1,3, pausas 0,28 s, atempo 1,1323, -15 LUFS (v4: Overclean + emendas Pix do Anexo 10)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '094. orçamento de paratinga 2018-2024';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  repara: quando('Agora repara'),
  seteAnos: quando('Sete anos e em todos'),
  genesis: quando('E tem a Genesis'),
  hospital: quando('gestao do hospital'),
  escolas: quando('nas escolas e na prefeitura'),
  g23: quando('14 milhoes e 200'),
  g24: quando('24 milhoes e 200'),
  maisQue: quando('Em 2024 mais do que obras'),
  processo: quando('um processo sobre'),
  semDecisao: quando('sem decisao publicada'),
  transp: quando('O transporte escolar'),
  t18: quando('2 milhoes e 800'),
  t21: quando('so 34 mil'),
  t24: quando('e 1 e 300'),
  merenda: quando('A merenda'),
  m18: quando('1 milhao em 2018'),
  m24: quando('860 mil'),
  festas: quando('E as festas'),
  f21: quando('122 mil'),
  f24: quando('2 milhoes e 600'),
  assist: quando('Mais do que toda'),
  noticia: quando('E fora das contas'),
  pf: quando('Policia Federal'),
  overclean: quando('Operacao Overclean'),
  emendas: quando('emendas parlamentares'),
  exPref: quando('O exprefeito'),
  pix: quando('Nas contas da prefeitura'),
  pix21: quando('2 milhoes em 2021'),
  pix24: quando('1 e 900 em 2024'),
  tribunal: quando('No Tribunal o gestor'),
  multas: quando('seis multas'),
  licit: quando('por licitacoes'),
  juros: quando('juros e multas'),
  acum: quando('acumulo de cargos'),
  fundef: quando('acumulo de cargos') + 1.3, // a pasta do Fundef aparece sem fala (o caso está na legenda)
  naoCond: quando('Ser investigado'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se a prefeitura'),
  umaSo: quando('uma so empresa'),
  segue: quando('Sigam o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA E FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
];
const FALADOS = ['edu', 'sau', 'obr', 'cam'];
const R_PREDIO = 7.5;
const ANGS: number[] = SETORES.map((_, i) => 0.13 * Math.PI + i * 0.1585 * Math.PI);
const ang = (i: number) => ANGS[Math.max(0, Math.min(ANGS.length - 1, i))];
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
// as torres dos 7 anos na frente de cada casinha: 2018–2021 na fileira de dentro (mais perto do cofre), 2022–2024 atrás
const posTorre = (i: number, yi: number): V3 => {
  const a = ang(i);
  const frente = yi < 4;
  const tan = frente ? [-0.84, -0.28, 0.28, 0.84][yi] : [-0.56, 0, 0.56][yi - 4];
  const r = R_PREDIO - (frente ? 1.75 : 1.15);
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os sete anos (valores em R$ milhões, LIQUIDADO, exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number; falado: boolean};
type Ano = {rotulo: string; ano: number; arrec: number; gastou: number; mais: number; vArrec: number; vGastou: number; vMais: number; fim: number; entradas: Entrada[]};
const ORDEM = ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agu', 'agr', 'esp', 'mam'];
//                   edu     sau     adm     obr     cam    div    cul    ass    agu    agr    esp    mam
const VALORES: number[][] = [
  [39.541, 12.922, 9.65, 6.854, 2.117, 0, 1.661, 1.522, 1.474, 0.618, 0.19, 0.316],
  [44.238, 13.48, 5.051, 8.547, 2.337, 1.194, 1.232, 1.285, 1.371, 0.601, 0.214, 0.236],
  [37.261, 18.622, 8.932, 8.239, 2.45, 1.073, 1.321, 1.219, 1.23, 0.508, 0.221, 0.398],
  [42.66, 19.956, 11.351, 10.488, 2.507, 1.879, 0.386, 1.512, 1.234, 0.699, 0.185, 0.575],
  [58.464, 21.803, 16.018, 11.493, 3.044, 1.15, 1.457, 2.876, 1.419, 0.899, 0.549, 0.336],
  [60.324, 25.586, 17.216, 11.232, 3.391, 4.019, 1.965, 2.04, 1.51, 0.914, 0.872, 0.466],
  [66.385, 35.002, 20.481, 12.43, 3.452, 4.838, 2.646, 2.173, 1.69, 0.809, 0.746, 0.446],
];
const BASE = [
  // ano falado, "Arrecadou N", "Gastou N", "X a mais", arrecadou, gastou, a mais
  ['2018 Arrecadou', 'Arrecadou 70', 'Gastou 77', '6 milhoes e 400 a mais', 70.624, 77.066, 6.442],
  ['2019 Arrecadou', 'Arrecadou 71', 'Gastou 80', '8 e 700 a mais', 71.212, 79.952, 8.74],
  ['2020 Arrecadou', 'Arrecadou 79', 'Gastou 82', '3 milhoes a mais', 79.634, 82.667, 3.034],
  ['2021 Arrecadou', 'Arrecadou 91', 'Gastou 93', '2 e 200 a mais', 91.406, 93.65, 2.244],
  ['2022 Arrecadou', 'Arrecadou 113', 'Gastou 120', '6 e 700 a mais', 113.388, 120.057, 6.669],
  ['2023 Arrecadou', 'Arrecadou 122', 'Gastou 130', '7 e 900 a mais', 122.661, 130.537, 7.876],
  ['2024 Arrecadou', 'Arrecadou 141', 'Gastou 151 e', '9 e 400 a mais', 141.828, 151.212, 9.385],
] as const;
const ROT_ANO = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
const PALAVRA_SETOR: Record<string, string> = {edu: 'Educacao', sau: 'Saude', obr: 'Obras', cam: 'Camara'};
const ANOS: Ano[] = BASE.map((b, yi) => {
  const ano = quando(b[0] as string);
  const tCam = quando('Camara', yi + 1);
  const entradas: Entrada[] = ORDEM.map((s, k) => {
    const falado = FALADOS.includes(s);
    // os setores sem fala voam juntos logo depois da Câmara, um atrás do outro
    const t = falado ? quando(PALAVRA_SETOR[s], yi + 1) : tCam + 1.05 + (k - 5 < 0 ? 0.3 : 0.1 * Math.max(0, k - 5));
    return {s, t, v: VALORES[yi][k], falado};
  });
  return {rotulo: ROT_ANO[yi], ano, arrec: quando(b[1] as string), gastou: quando(b[2] as string), mais: quando(b[3] as string), vArrec: b[4] as number, vGastou: b[5] as number, vMais: b[6] as number, fim: 0, entradas};
});
ANOS.forEach((y, yi) => (y.fim = yi + 1 < ANOS.length ? ANOS[yi + 1].ano : T.repara));
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, Math.min(...ANOS[0].entradas.filter((e) => e.s === s.id).map((e) => e.t))]));
const valorDe = (id: string, yi: number) => VALORES[yi][ORDEM.indexOf(id)];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000 + 1e-9)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtCurto = (v: number) => (v === 0 ? '0' : v < 1 ? `${Math.round(v * 1000 + 1e-9)} mil` : r1(v).toFixed(1).replace('.', ','));

const ANDAR = 0.75;
const torre = (c: V3, n: number, lado: number, cor: string, passo = 0.38): Pilha[] => {
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
const ESCALA = 4; // 1 pilha = R$ 4 milhões
const LADO_S = 2; // torres dos setores: 2 x 2 pilhas por andar
const PASSO_S = 0.27;
const altSetor = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO_S * LADO_S) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
// cores dos anos: dourado 2018, verde 2019, rosa 2020, cinza 2021, preto 2022, laranja 2023, vermelho 2024
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, F.verde, F.rosa, tema.objeto, tom(tema.objetoEscuro, -0.55), mistura(F.dourado, F.rosa, 0.42), tom(mistura(F.rosa, F.dourado, 0.12), -0.12)];
};
// a cor do texto de cada ano nas plaquinhas (o preto vira cinza claro para ler no fundo escuro)
const corTexto = (tema: Tema, yi: number) => (yi === 4 ? tema.textoSuave : coresAno(tema)[yi]);

// ---------- A pilha do ano em volta do cofre ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 22],
      [2.3, 28],
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
type Voo = {de: V3; para: V3; n: number; t0: number};
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
      const porAndar = LADO_S * LADO_S;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO_S) - 0.5) * PASSO_S, andar * ANDAR, c[2] + (Math.floor(k / LADO_S) - 0.5) * PASSO_S];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.03});
      lugar++;
    }
  });
  return v;
});

const SOME_COFRE = (t: number) => 1 - rampa(t, T.genesis - 0.2, T.genesis + 0.6);
const FALTA_POS: V3 = [0, 0, 3.6];
// "Agora repara": as 7 torres A MAIS lado a lado na frente do cofre (aqui, 1 pilha = R$ 1 mi)
const ESC_M = 1;
const posMais = (yi: number): V3 => [-2.7 + yi * 0.9, 0, 2.4];
const MAIS_VIS = (t: number) => vis(t, T.repara - 0.1, T.genesis + 0.1) + vis(t, T.gastar - 0.1, T.porque - 0.2);

// ---------- Os achados no miolo ----------
const ZA = 0.4;
// Gênesis: 1 pilha = R$ 1 mi, torres 2 x 2
const GE = {
  pasta: [-4.0, 0, ZA + 0.3] as V3,
  g23: {p: [-2.85, 0, ZA] as V3, v: 14.215},
  g24: {p: [-2.05, 0, ZA] as V3, v: 24.181},
  comp: {p: [-0.9, 0, ZA] as V3, v: 18.056},
};
const GE_VIS = (t: number) => vis(t, T.genesis + 0.1, T.transp - 0.2) + vis(t, T.porque - 0.1, FIM + 2);
// transporte escolar e merenda: 1 pilha = R$ 200 mil
const ESC_T = 0.2;
const TR = {
  t18: {p: [0.75, 0, ZA] as V3, v: 2.798, ano: 0},
  t21: {p: [1.45, 0, ZA] as V3, v: 0.034, ano: 3},
  t24: {p: [2.15, 0, ZA] as V3, v: 1.338, ano: 6},
  m18: {p: [3.25, 0, ZA] as V3, v: 1.03, ano: 0},
  m24: {p: [3.95, 0, ZA] as V3, v: 0.864, ano: 6},
};
const TR_VIS = (t: number) => vis(t, T.transp - 0.1, T.festas - 0.2);
// festas x assistência social: 1 pilha = R$ 200 mil
const FE = {
  f21: {p: [-3.4, 0, ZA] as V3, v: 0.122, ano: 3},
  f24: {p: [-2.6, 0, ZA] as V3, v: 2.646, ano: 6},
  as24: {p: [-1.55, 0, ZA] as V3, v: 2.173, ano: 6},
};
const FE_VIS = (t: number) => vis(t, T.festas - 0.1, T.noticia - 0.2);
// a notícia (fora das contas): carro e pasta da operação, no fundo do miolo
const NO = {carro: [-1.15, 0, -1.4] as V3, pasta: [0.55, 0, -0.9] as V3};
// emendas Pix (transferência especial) nas contas da prefeitura: 1 pilha = R$ 200 mil
const PIX = {p21: {p: [1.85, 0, -0.75] as V3, v: 2.0, ano: 3}, p24: {p: [2.55, 0, -0.75] as V3, v: 1.9, ano: 6}};
const NO_VIS = (t: number) => vis(t, T.noticia - 0.1, T.tribunal - 0.2);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'DENÚNCIA · EDITAL', valor: '2019', t: T.licit, carimbos: [[T.licit + 0.4, 'MULTA R$ 2 MIL', 'alerta']]},
  {titulo: 'PREGÃO 36/2019', valor: '2019', t: T.licit + 0.35, carimbos: [[T.licit + 0.75, 'MULTA R$ 4 MIL', 'alerta']]},
  {titulo: 'PREGÕES · MATERIAIS', valor: '2020', t: T.licit + 0.7, carimbos: [[T.licit + 1.1, 'MULTA R$ 8 MIL', 'alerta']]},
  {titulo: 'PREGÃO 033/2021', valor: '2021', t: T.licit + 1.05, carimbos: [[T.licit + 1.45, 'MULTA R$ 1 MIL', 'alerta']]},
  {titulo: 'JUROS E MULTAS', valor: '2017–2018', t: T.juros, carimbos: [[T.juros + 0.4, 'MULTA R$ 5 MIL', 'alerta']]},
  {titulo: 'ACÚMULO DE CARGOS', valor: '2022', t: T.acum, carimbos: [[T.acum + 0.4, 'MULTA R$ 1 MIL', 'alerta']]},
  {titulo: 'PRECATÓRIOS DO FUNDEF', valor: '2019–2020', t: T.fundef, carimbos: [[T.fundef + 0.6, 'EM ANÁLISE', 'neutro']]},
];
const posPasta = (i: number): V3 => [-3.3 + i * 1.1, 0, 1.4];
const PASTAS_VIS = (t: number) => vis(t, T.multas - 0.2, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const torres: Pilha[] = [];
  const cofre = SOME_COFRE(t);
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) {
        if (cofre > 0.01) torres.push({p: v.de, n: v.n * nasce * cofre, cor: CA[yi]});
      } else {
        const fica = 1 - rampa(t, T.repara - 0.3, T.repara + 0.5);
        if (fica > 0.01) torres.push({p: k >= 1 ? soma(v.para, [0, -2.5 * (1 - fica), 0]) : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
      }
    });
  });
  // torre "A MAIS" na frente do cofre, ano a ano
  if (cofre > 0.01) {
    ANOS.forEach((y) => {
      const k = janela(t, y.mais, y.entradas[0].t - 0.3, 0.5) * cofre;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.vMais / ESCALA) * rampa(t, y.mais, y.mais + 0.9) * k, 2, C.alerta, 0.3));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // as 7 torres A MAIS juntas
  const mv = MAIS_VIS(t);
  if (mv > 0.01)
    ANOS.forEach((y, yi) => {
      const k = cresce(T.repara + 0.15 + yi * 0.12, 0.6) * mv;
      if (k > 0.01) solidas.push(...torre(posMais(yi), (y.vMais / ESC_M) * k, 2, CA[yi], 0.27));
    });
  // Gênesis
  const ge = GE_VIS(t);
  if (ge > 0.01) {
    const a = cresce(T.g23) * ge;
    if (a > 0.01) solidas.push(...torre(GE.g23.p, (GE.g23.v / 1) * a, 2, CA[5], 0.27));
    const b = cresce(T.g24) * ge;
    if (b > 0.01) solidas.push(...torre(GE.g24.p, (GE.g24.v / 1) * b, 2, CA[6], 0.27));
    const c = (final ? 0 : cresce(T.maisQue)) * ge;
    if (c > 0.01) solidas.push(...torre(GE.comp.p, (GE.comp.v / 1) * c, 2, tema.objetoClaro, 0.27));
  }
  // transporte escolar e merenda
  const tr = TR_VIS(t);
  if (tr > 0.01) {
    (
      [
        ['t18', T.t18],
        ['t21', T.t21],
        ['t24', T.t24],
        ['m18', T.m18],
        ['m24', T.m24],
      ] as [keyof typeof TR, number][]
    ).forEach(([id, a]) => {
      const k = cresce(a) * tr;
      const x = TR[id];
      if (k > 0.01) solidas.push(...torre(x.p, Math.max(0.12, x.v / ESC_T) * k, 2, CA[x.ano], 0.27));
    });
  }
  // festas x assistência
  const fe = FE_VIS(t);
  if (fe > 0.01) {
    (
      [
        ['f21', T.f21],
        ['f24', T.f24],
        ['as24', T.assist],
      ] as [keyof typeof FE, number][]
    ).forEach(([id, a]) => {
      const k = cresce(a) * fe;
      const x = FE[id];
      if (k > 0.01) solidas.push(...torre(x.p, Math.max(0.3, x.v / ESC_T) * k, 2, id === 'as24' ? tema.objetoClaro : CA[x.ano], 0.27));
    });
  }
  const no = NO_VIS(t);
  if (no > 0.01) {
    const a = rampa(t, T.pix21, T.pix21 + 0.9) * no;
    if (a > 0.01) solidas.push(...torre(PIX.p21.p, (PIX.p21.v / ESC_T) * a, 2, CA[3], 0.27));
    const b = rampa(t, T.pix24, T.pix24 + 0.9) * no;
    if (b > 0.01) solidas.push(...torre(PIX.p24.p, (PIX.p24.v / ESC_T) * b, 2, CA[6], 0.27));
  }
  return {solidas, torres};
};

const CASAS: [V3, number][] = [
  [[0.4, 0, 8.6], 0.2],
  [[-1.6, 0, 8.4], -0.3],
];
const ARVORES: V3[] = [
  [-0.7, 0, 8.9],
  [1.6, 0, 8.4],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id && e.falado).map((e) => janela(t, e.t, e.t + 2.2, 0.4)));
  const achado =
    (s.id === 'sau' ? janela(t, T.hospital, T.escolas + 0.3, 0.4) : 0) +
    (s.id === 'edu' ? janela(t, T.escolas, T.g23, 0.4) + janela(t, T.transp, T.festas, 0.4) : 0) +
    (s.id === 'adm' ? janela(t, T.escolas + 0.6, T.g23, 0.4) + janela(t, T.noticia, T.tribunal, 0.4) : 0) +
    (s.id === 'cul' ? janela(t, T.festas, T.noticia, 0.4) : 0) +
    (s.id === 'ass' ? janela(t, T.assist, T.noticia, 0.4) : 0);
  const aceso = Math.min(1, Math.max(0, ...ditas) + achado);
  const e = 0.45;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, ANOS[0].gastou - 0.1, ANOS[0].gastou + 0.5) * SOME_COFRE(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const ge = GE_VIS(t);
  const tr = TR_VIS(t);
  const fe = FE_VIS(t);
  const no = NO_VIS(t);
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

      <PilhasDinheiro pilhas={solidas} max={2000} />
      <PilhasDinheiro pilhas={torres} max={1200} largura={0.75} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* Gênesis (esquerda), transporte escolar e merenda (direita), festas x assistência (esquerda) */}
      <BaseGaveta tema={tema} pos={[-2.45, 0, ZA]} sobe={ge} larg={4.4} texto="GÊNESIS · PAGO EM 2023 E 2024" aceso={Math.max(janela(t, T.genesis, T.transp, 0.4), janela(t, T.umaSo, FIM + 1, 0.4))} />
      <PastaProcesso
        tema={tema}
        pos={GE.pasta}
        rotY={0.15}
        escala={0.9}
        sobe={ge}
        titulo="GÊNESIS INOVAÇÕES EMPRESARIAIS"
        valor="MÃO DE OBRA TERCEIRIZADA"
        carimbo={rampa(t, T.semDecisao, T.semDecisao + 0.4) * (t < T.transp ? 1 : 0)}
        textoCarimbo="SEM DECISÃO PUBLICADA"
        corCarimbo={mistura(C.ouro, tema.texto, 0.35)}
        aceso={janela(t, T.genesis, T.transp, 0.4)}
      />
      <BaseGaveta tema={tema} pos={[2.35, 0, ZA]} sobe={tr} larg={4.2} texto="TRANSPORTE ESCOLAR · MERENDA" aceso={janela(t, T.transp, T.festas, 0.4)} />
      <BaseGaveta tema={tema} pos={[-2.45, 0, ZA]} sobe={fe} larg={3.4} texto="FESTAS x ASSISTÊNCIA SOCIAL" aceso={janela(t, T.festas, T.noticia, 0.4)} />

      {/* a notícia: carro e pasta da operação (sem logo, sem rosto) */}
      {no > 0.02 ? <CarroRua tema={tema} pos={soma(NO.carro, [-3 * (1 - rampa(t, T.pf, T.pf + 1.2)), 0, 0])} rotY={Math.PI / 2} escala={0.7} farol={0.6} anda={0} t={t} /> : null}
      <PastaProcesso tema={tema} pos={NO.pasta} rotY={-0.12} escala={1.0} sobe={no * rampa(t, T.overclean - 0.1, T.overclean + 0.4)} titulo="OPERAÇÃO OVERCLEAN" valor="EMENDAS 2021–2024" carimbo={rampa(t, T.exPref, T.exPref + 0.4)} textoCarimbo="INVESTIGAÇÃO" corCarimbo={mistura(C.ouro, tema.texto, 0.35)} aceso={janela(t, T.overclean, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.licit - 0.3)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(3 - i) * 0.05}
            escala={0.72}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={atual[2] === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, pa.t, T.naoCond, 0.4)}
          />
        );
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13.5, 11.5, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.2], 9.0, 7.2, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.2, 1.2, Math.cos(a) * 6.2];
  return E(alvo, 3.9 * perto, 4.4 * perto, [-Math.sin(a) * 0.62, 2.1, -Math.cos(a) * 0.62]);
};
// passa de casinha em casinha (só as faladas), sempre no mesmo sentido
const passaSetores = (y: Ano, perto = 1): [number, Cam][] => {
  const ents = y.entradas.filter((e) => e.falado);
  return ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : y.fim - 0.4;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (e.s === 'edu' ? 1.2 : e.s === 'sau' ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
};
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 1.55, 1]);
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, DE_CIMA()]]},
  ...ANOS.flatMap((y, yi): Cena[] => [
    {
      ini: yi === 0 ? y.gastou - 0.3 : y.ano - 0.1,
      arco: 0.06,
      chaves: [
        [yi === 0 ? y.gastou - 0.3 : y.ano - 0.1, DE_CIMA(0.12 + 0.02 * yi)],
        [y.gastou + 0.3, COFRE(0.05)],
        [y.mais + 0.6, COFRE(0.08)],
        [y.entradas[0].t - 0.4, COFRE(0.1)],
      ],
    },
    {ini: y.entradas[0].t - 0.3, arco: 0.03, chaves: [[y.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(y, 1.05 + 0.02 * yi)]},
  ]),
  // "Agora repara": as 7 torres A MAIS
  {ini: T.repara - 0.1, arco: 0.03, chaves: [[T.repara - 0.1, E([0, 0.8, 2.0], 9.0, 7.0, [0, 1.6, 1])], [T.seteAnos + 0.4, E([0, 1.0, 2.4], 7.4, 6.2, [0.04, 1.4, 1])], [T.genesis - 0.2, E([0, 1.0, 2.4], 7.2, 6.0, [0.07, 1.4, 1])]]},
  // Gênesis: a pasta, depois as torres de 2023 e 2024 e a comparação
  {
    ini: T.genesis - 0.1,
    arco: 0.03,
    chaves: [
      [T.genesis - 0.1, E([-2.5, 1.0, ZA], 6.6, 6.0, [0, 1.8, 1])],
      [T.hospital - 0.2, E([-2.0, 1.4, ZA - 0.6], 9.5, 8.0, [-0.25, 1.4, 1])],
      [T.g23 - 0.2, E(soma(meio(GE.g23.p, GE.g24.p), [0, 2.2, 0]), 3.6, 5.8, [-0.05, 1.0, 1])],
      [T.maisQue + 0.2, E(soma(meio(GE.g23.p, GE.comp.p), [0, 2.2, 0]), 4.6, 6.0, [0, 1.0, 1])],
      [T.processo - 0.1, E(soma(GE.pasta, [0.2, 0.8, 0]), 2.8, 2.8, [-0.2, 1.2, 1])],
      [T.transp - 0.3, E(soma(GE.pasta, [0.35, 0.8, 0]), 2.9, 2.9, [-0.15, 1.2, 1])],
    ],
  },
  // transporte escolar e merenda (sempre para a direita)
  {
    ini: T.transp - 0.2,
    arco: 0.03,
    chaves: [
      [T.transp - 0.2, E([2.35, 1.0, ZA], 6.2, 5.8, [0, 1.8, 1])],
      [T.t18 - 0.1, PG(meio(TR.t18.p, TR.t21.p), 3.2, 1.6, -0.04)],
      [T.t24 + 0.2, PG(meio(TR.t21.p, TR.t24.p), 3.2, 1.4, -0.02)],
      [T.merenda - 0.1, PG(meio(TR.m18.p, TR.m24.p), 3.0, 1.0, 0.02)],
      [T.festas - 0.3, PG(soma(meio(TR.m18.p, TR.m24.p), [0.2, 0, 0]), 3.1, 1.0, 0.04)],
    ],
  },
  // festas x assistência social
  {
    ini: T.festas - 0.2,
    arco: 0.03,
    chaves: [
      [T.festas - 0.2, E([-2.45, 1.0, ZA], 5.6, 5.4, [0, 1.8, 1])],
      [T.f24 - 0.1, PG(meio(FE.f21.p, FE.f24.p), 3.0, 1.6, -0.04)],
      [T.assist, PG(meio(FE.f24.p, FE.as24.p), 3.2, 1.6, -0.02)],
      [T.noticia - 0.3, PG(soma(meio(FE.f24.p, FE.as24.p), [0.2, 0, 0]), 3.3, 1.6, 0)],
    ],
  },
  // a notícia: o carro chega, a pasta da operação
  {
    ini: T.noticia - 0.2,
    arco: 0.03,
    chaves: [
      [T.noticia - 0.2, E([-0.2, 0.7, -1.1], 6.2, 5.4, [0, 1.6, 1])],
      [T.overclean, E([-0.2, 0.7, -1.1], 5.0, 4.6, [-0.04, 1.5, 1])],
      [T.pix - 0.2, E([1.3, 0.9, -0.9], 4.8, 4.6, [0, 1.4, 1])],
      [T.tribunal - 0.3, E([1.6, 0.9, -0.9], 4.6, 4.4, [0.04, 1.4, 1])],
    ],
  },
  // o Tribunal e as 7 pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.3, -3.2], 6.4, 6.2, [0, 1.3, 1])],
      [T.licit - 0.6, E([0, 1.0, -0.8], 8.0, 6.4, [0, 1.6, 1])],
      [T.licit - 0.1, E(soma(meio(posPasta(0), posPasta(3)), [0, 0.5, 0]), 5.4, 4.4, [-0.06, 1.3, 1])],
      [T.juros - 0.1, E(soma(meio(posPasta(2), posPasta(5)), [0, 0.5, 0]), 5.4, 4.4, [-0.02, 1.3, 1])],
      [T.fundef - 0.1, E(soma(meio(posPasta(4), posPasta(6)), [0, 0.5, 0]), 4.6, 4.0, [0.02, 1.3, 1])],
      [T.gastar - 0.2, E(meio(posPasta(0), posPasta(6)), 8.6, 6.4, [0.05, 1.6, 1])],
    ],
  },
  // a pergunta: as 7 torres A MAIS, depois a Gênesis
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.8], 12.5, 9, [0, 1.3, 1])],
      [T.porque + 0.2, E([0, 1.0, 2.4], 7.6, 6.4, [0.04, 1.4, 1])],
      [T.umaSo - 0.1, E(soma(meio(GE.g23.p, GE.g24.p), [0, 2.2, 0]), 3.8, 5.8, [-0.04, 1.0, 1])],
      [T.segue - 0.1, E(soma(meio(GE.g23.p, GE.g24.p), [0.2, 2.2, 0]), 4.0, 6.0, [-0.02, 1.0, 1])],
      [T.segue + 0.8, E([-1.5, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
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
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [];
  ANOS.forEach((y, yi) => {
    c.push(
      {a: y.ano, b: y.arrec, texto: y.rotulo},
      {a: y.arrec, b: y.gastou, texto: `ARRECADOU EM ${y.rotulo}: ${fmtV(y.vArrec)}`},
      {a: y.gastou, b: y.mais, texto: `GASTOU EM ${y.rotulo}: ${fmtV(y.vGastou)}`},
      {a: y.mais, b: y.entradas[0].t, texto: `${fmtV(y.vMais)} A MAIS DO QUE ARRECADOU`, destaque: true},
    );
    const ents = y.entradas.filter((e) => e.falado);
    ents.forEach((e, k) => c.push({a: e.t, b: k + 1 < ents.length ? ents[k + 1].t : y.fim, texto: `${nomeDe(e.s)} ${y.rotulo}: ${fmtV(e.v)}`}));
  });
  c.push(
    {a: T.repara, b: T.seteAnos, texto: 'AGORA REPARA'},
    {a: T.seteAnos, b: T.genesis, texto: '7 ANOS · EM TODOS GASTOU MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.genesis, b: T.hospital, texto: 'GÊNESIS INOVAÇÕES EMPRESARIAIS · MÃO DE OBRA'},
    {a: T.hospital, b: T.g23, texto: 'GESTÃO DO HOSPITAL · APOIO NAS ESCOLAS E NA PREFEITURA'},
    {a: T.g23, b: T.g24, texto: 'PAGO EM 2023: R$ 14,2 MI'},
    {a: T.g24, b: T.maisQue, texto: 'PAGO EM 2024: R$ 24,2 MI', destaque: true},
    {a: T.maisQue, b: T.processo, texto: 'MAIS QUE OBRAS + CÂMARA + ASSISTÊNCIA (R$ 18,1 MI)'},
    {a: T.processo, b: T.transp, texto: 'PROCESSO NO TCM (PREGÃO 065/2022) · SEM DECISÃO'},
    {a: T.transp, b: T.t18, texto: 'TRANSPORTE ESCOLAR · AÇÃO DO PROGRAMA NACIONAL'},
    {a: T.t18, b: T.t21, texto: 'TRANSPORTE ESCOLAR 2018: R$ 2,8 MI'},
    {a: T.t21, b: T.t24, texto: '2021, NA PANDEMIA: R$ 34 MIL', destaque: true},
    {a: T.t24, b: T.merenda, texto: 'TRANSPORTE ESCOLAR 2024: R$ 1,3 MI'},
    {a: T.merenda, b: T.m24, texto: 'MERENDA 2018: R$ 1 MI'},
    {a: T.m24, b: T.festas, texto: 'MERENDA 2024: R$ 860 MIL'},
    {a: T.festas, b: T.f24, texto: 'FESTAS 2021: R$ 122 MIL'},
    {a: T.f24, b: T.assist, texto: 'FESTAS 2024: R$ 2,6 MI', destaque: true},
    {a: T.assist, b: T.noticia, texto: 'ASSISTÊNCIA SOCIAL 2024: R$ 2,2 MI'},
    {a: T.noticia, b: T.overclean, texto: 'FORA DAS CONTAS · JUNHO DE 2025'},
    {a: T.overclean, b: T.exPref, texto: 'POLÍCIA FEDERAL · OPERAÇÃO OVERCLEAN · EMENDAS 2021–2024'},
    {a: T.exPref, b: T.pix, texto: 'BUSCAS EM PARATINGA · EX-PREFEITO FOI ALVO'},
    {a: T.pix, b: T.pix21, texto: 'EMENDAS PIX NAS CONTAS DA PREFEITURA: R$ 3,9 MI', destaque: true},
    {a: T.pix21, b: T.pix24, texto: 'TRANSFERÊNCIA ESPECIAL 2021: R$ 2 MI'},
    {a: T.pix24, b: T.tribunal, texto: 'TRANSFERÊNCIA ESPECIAL 2024: R$ 1,9 MI'},
    {a: T.tribunal, b: T.licit, texto: 'TRIBUNAL DE CONTAS: 6 MULTAS AO GESTOR'},
    {a: T.licit, b: T.fundef, texto: 'MULTAS DE R$ 1 MIL A R$ 8 MIL · CABE RECURSO'},
    {a: T.fundef, b: T.naoCond, texto: 'PRECATÓRIOS DO FUNDEF: EM ANÁLISE'},
    {a: T.naoCond, b: T.gastar, texto: 'SER INVESTIGADO OU ESTAR NO TRIBUNAL NÃO É CONDENAÇÃO'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.umaSo, texto: '7 ANOS GASTANDO MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.umaSo, b: T.segue, texto: 'POR QUE UMA SÓ EMPRESA RECEBEU R$ 24,2 MI EM 2024?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  ...ANOS.map((y, yi) => ({a: y.ano, b: y.fim, texto: `FONTE: BALANÇO ${y.rotulo} E DESPESA DE DEZ/${y.rotulo} · TCM-BA · LIQUIDADO`})),
  {a: T.repara, b: T.genesis, texto: 'FONTE: BALANÇOS 2018 A 2024 · TCM-BA'},
  {a: T.genesis, b: T.transp, texto: 'FONTE: PCMGE056 · PAGAMENTOS 2023 E 2024 · TCM-BA'},
  {a: T.transp, b: T.noticia, texto: 'FONTE: DESPESA POR AÇÃO, DEZ/2018 A DEZ/2024 · TCM-BA'},
  {a: T.noticia, b: T.pix, texto: 'FONTES: CNN BRASIL E BAHIA NOTÍCIAS · 27/06/2025'},
  {a: T.pix, b: T.tribunal, texto: 'FONTE: ANEXO 10 DE 2021 E 2024 · TRANSFERÊNCIA ESPECIAL · TCM-BA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (09/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string; hist?: {txt: string; cor: string}[]};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    const ents = y.entradas.filter((e) => e.falado);
    ents.forEach((e, ei) => {
      const i = idx(e.s);
      const b = ei + 1 < ents.length ? Math.max(ents[ei + 1].t + 0.45, e.t + 1.4) : Math.min(e.t + 3.0, y.fim + 0.2);
      // uma plaquinha só por setor: o ano falado em destaque e, embaixo, os anos anteriores, cada um na sua cor
      const hist = yi === 0 ? undefined : Array.from({length: yi}, (_, k) => ({txt: `${ROT_ANO[k].slice(2)} ${fmtCurto(valorDe(e.s, k))}`, cor: corTexto(tema, k)}));
      r.push({a: e.t + 0.5, b, p: soma(posTorre(i, yi), [0, altSetor(e.v) + 0.35, 0]), valor: fmtV(e.v), sub: `${nomeDe(e.s)} · ${y.rotulo}`, cor: CA[yi], hist});
    });
    r.push({a: y.mais + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.vMais / ESCALA), 2) + 0.3, 0]), valor: `${fmtV(y.vMais)} A MAIS`, sub: y.rotulo, cor: C.alerta});
  });
  const topo = (c: V3, n: number) => soma(c, [0, altTorre(n, 2) + 0.3, 0]);
  // as 7 torres A MAIS
  ANOS.forEach((y, yi) => r.push({a: T.repara + 0.6 + yi * 0.12, b: T.genesis - 0.1, p: topo(posMais(yi), y.vMais / ESC_M), valor: fmtCurto(y.vMais), sub: y.rotulo, cor: CA[yi]}));
  // Gênesis
  r.push(
    {a: T.g23 + 0.5, b: T.transp - 0.3, p: topo(GE.g23.p, GE.g23.v), valor: 'R$ 14,2 MI', sub: 'GÊNESIS · 2023', cor: CA[5]},
    {a: T.g24 + 0.5, b: T.transp - 0.3, p: topo(GE.g24.p, GE.g24.v), valor: 'R$ 24,2 MI', sub: 'GÊNESIS · 2024', cor: CA[6]},
    {a: T.maisQue + 0.5, b: T.transp - 0.3, p: topo(GE.comp.p, GE.comp.v), valor: 'R$ 18,1 MI', sub: 'OBRAS + CÂMARA + ASSIST. · 2024'},
  );
  // transporte escolar e merenda
  const fimT = T.festas - 0.3;
  (
    [
      ['t18', T.t18, 'TRANSPORTE · 2018'],
      ['t21', T.t21, 'TRANSPORTE · 2021'],
      ['t24', T.t24, 'TRANSPORTE · 2024'],
      ['m18', T.m18, 'MERENDA · 2018'],
      ['m24', T.m24, 'MERENDA · 2024'],
    ] as [keyof typeof TR, number, string][]
  ).forEach(([id, a, sub]) => r.push({a: a + 0.5, b: fimT, p: topo(TR[id].p, Math.max(0.12, TR[id].v / ESC_T)), valor: id === 'm24' ? 'R$ 860 MIL' : fmtV(TR[id].v), sub, cor: CA[TR[id].ano]}));
  // festas x assistência
  const fimF = T.noticia - 0.3;
  r.push(
    {a: T.f21 + 0.4, b: fimF, p: topo(FE.f21.p, Math.max(0.3, FE.f21.v / ESC_T)), valor: 'R$ 122 MIL', sub: 'FESTAS · 2021', cor: CA[3]},
    {a: T.f24 + 0.5, b: fimF, p: topo(FE.f24.p, FE.f24.v / ESC_T), valor: 'R$ 2,6 MI', sub: 'FESTAS · 2024', cor: CA[6]},
    {a: T.assist + 0.6, b: fimF, p: topo(FE.as24.p, FE.as24.v / ESC_T), valor: 'R$ 2,2 MI', sub: 'ASSISTÊNCIA SOCIAL · 2024'},
  );
  // emendas Pix
  r.push(
    {a: T.pix21 + 0.5, b: T.tribunal - 0.3, p: topo(PIX.p21.p, PIX.p21.v / ESC_T), valor: 'R$ 2 MI', sub: 'EMENDA PIX · 2021', cor: CA[3]},
    {a: T.pix24 + 0.5, b: T.tribunal - 0.3, p: topo(PIX.p24.p, PIX.p24.v / ESC_T), valor: 'R$ 1,9 MI', sub: 'EMENDA PIX · 2024', cor: CA[6]},
  );
  // a pergunta
  r.push(
    {a: T.porque + 0.4, b: T.umaSo - 0.1, p: [0, 3.0, 2.4], valor: 'R$ 44,4 MI A MAIS', sub: 'SOMA DE 2018 A 2024', cor: C.alerta},
    {a: T.umaSo + 0.3, b: T.segue + 0.5, p: topo(GE.g24.p, GE.g24.v), valor: 'R$ 24,2 MI', sub: 'GÊNESIS · 2024', cor: tema.acento},
  );
  return r;
};

const noMapa = (t: number) => t < ANOS[0].gastou;
const soMapa = (t: number) => t < ANOS[0].gastou - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(ANOS[0].gastou) + 6};
const TOPO_SELO = 440; // abaixo da pilha dos dois selos do cabeçalho (até ~y 420)
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, ANOS[0].gastou + 0.4, T.repara);
  const miolo = vis(t, T.repara + 0.2, T.noticia - 0.3) + vis(t, T.pix, T.tribunal - 0.3);
  const escalaTxt = miolo > 0.01 ? (t < T.transp ? 'AQUI, 1 PILHA = R$ 1 MI' : 'AQUI, 1 PILHA = R$ 200 MIL') : '1 PILHA = R$ 4 MI';
  const escK = Math.max(placarK, miolo);
  const anoAtual = ANOS.filter((y) => t >= y.ano - 0.1).length - 1;
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 56 ? 14 : seloAtual.texto.length > 48 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {escK > 0.01 ? (
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${miolo > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          {miolo > 0.01 ? (
            <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          ) : (
            ROT_ANO.map((r, k) => <div key={k} style={{width: 14, height: 14, borderRadius: 7, background: CA[k], border: `1.5px solid ${k <= anoAtual ? tema.texto : 'transparent'}`, opacity: k <= anoAtual ? 1 : 0.35}} />)
          )}
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escalaTxt}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    // na abertura, o selo da fonte entra depois que os dois selos grandes viajam para o cabeçalho
    const k = Math.min(entra(t, 4.8, 0.45), 1 - rampa(t, ANOS[0].gastou - 0.6, ANOS[0].gastou - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇOS 2018 A 2024 ENVIADOS AO TCM-BA</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 200 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 120, Math.min(SEGURO.botoesX - 120, pj.x)), y: Math.max(760, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10, (r.hist ?? []).reduce((a, h) => a + h.txt.length * 10 + 10, 0)) + 34;
  const alt = (r: Rot) => (r.hist ? 92 : r.sub ? 72 : 56);
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < Math.max(alt(o.r), alt(rots[a].r)));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-70, 70, -140, 140, -210, 210, 280].map((d) => y0 + d).filter((y) => y >= 740 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_CHIP, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 52 ? 15 : chip.texto.length > 44 ? 18 : chip.texto.length > 32 ? 22 : 28} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 30 : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.3, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
            {v.r.hist ? (
              <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4}}>
                {v.r.hist.map((h, k) => (
                  <div key={k} style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, color: h.cor}}>
                    {h.txt}
                  </div>
                ))}
              </div>
            ) : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/paratinga1824.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [...ANOS.map((y) => y.mais), ...ANOS.flatMap((y) => y.entradas.filter((e) => e.falado && e.v >= 10).map((e) => e.t)), T.g24, T.t21, T.f24];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  ANOS.forEach((y) => s.push({t: y.ano + 0.05, f: 'tique', v: 0.14}, {t: y.arrec + 0.3, f: 'pop', v: 0.16}, {t: y.gastou + 0.2, f: 'subida', v: 0.15}, {t: y.mais + 0.2, f: 'baque', v: 0.18}));
  ANOS.forEach((y) => y.entradas.filter((e) => e.falado).forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.17})));
  [T.g23, T.g24, T.t18, T.t24, T.m18, T.m24, T.f21, T.f24, T.assist, T.overclean, T.pix21, T.pix24].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.t21, T.semDecisao].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.16}));
  PASTAS.forEach((pa) => s.push({t: pa.carimbos[0][0] + 0.05, f: 'impacto', v: 0.13}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.6, 1.5, 3.0, 4.2, 5.6, 6.5, 7.4, 8.8,
  ...ANOS.flatMap((y) => [y.ano + 0.5, y.arrec + 0.9, y.gastou + 1.0, y.mais + 0.9, ...y.entradas.filter((e) => e.falado).map((e) => e.t + 0.9), y.fim - 0.5]),
  T.repara + 0.8, T.seteAnos + 1.2, T.genesis + 0.8, T.hospital + 1.0, T.g23 + 1.0, T.g24 + 1.0, T.maisQue + 1.2, T.processo + 1.5,
  T.transp + 0.8, T.t18 + 1.0, T.t21 + 1.0, T.t24 + 1.0, T.merenda + 0.8, T.m24 + 1.0,
  T.festas + 0.6, T.f21 + 0.9, T.f24 + 1.0, T.assist + 1.2,
  T.noticia + 0.8, T.pf + 1.0, T.overclean + 1.2, T.emendas + 1.0, T.exPref + 0.9, T.pix + 0.8, T.pix21 + 1.0, T.pix24 + 1.0,
  T.tribunal + 0.6, T.licit + 1.4, T.juros + 0.9, T.acum + 0.9, T.fundef + 1.2, T.naoCond + 0.8,
  T.gastar + 0.5, T.porque + 1.2, T.umaSo + 1.0, T.segue + 0.4, T.segue + 1.5, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoParatinga1824: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoDuplo tema={tema} cidade="PARATINGA" t={t} final={T.segue} yAbertura={470} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDaguaDupla tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['7 anos', 'gastando', 'mais do que', 'arrecadou.'];
export const CapaOrcamentoParatinga1824: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoDuplo tema={tema} cidade="PARATINGA · 2018–2024" t={10} />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 300}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 110 : 128, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
