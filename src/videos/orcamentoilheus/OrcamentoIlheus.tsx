import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Trilha, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Balanca, CasaMini, CofreFGTS, Cone, Lupa, Multidao, Onibus, Quepe, RoloCompactador, type Agente} from '../../pecas';
import {
  CamaraVereadores,
  CopoPiso,
  Escola,
  EstacaoSaneamento,
  MesaMaquete,
  PilhasDinheiro,
  PlacaProibido,
  PonteMini,
  PostoGuarda,
  PostoSaude,
  PredioTCM,
  Prefeitura,
  RelatorioPDF,
  ReguaLimite,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from './pecas';
import {PALAVRAS} from './palavras';

// 014. orçamento de ilhéus (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda de Ilhéus com o cofre da prefeitura no meio (1 pilha = R$ 10 milhões)
// e encaixa três trechos de mapa do Kit Mapas Animados (projetos/014.../mapas/ilheus.mp4, composição
// OrcamentoIlheus do kit): ILHÉUS (0 a 243), DE ONDE VEM (243 a 690) e É SEU (690 a 1062).
// Todo número vem dos PDFs do portal da transparência (selo discreto); a exceção é o 26,17% do Tesouro.
// Neutro: sem nome de prefeito nem partido; 2024 e 2025 com o mesmo tratamento.
// Plano: projetos/014. orçamento de ilhéus/plano.md (versão 1, aprovada em 02/11/2026).

export const FPS = 30;
const AUDIO_SEG = 155.55;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '014. orçamento de ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  n790: quando('790'),
  abri: quando('abri os relatorios'),
  tudoAqui: quando('Tudo aqui'),
  relFiscais: quando('relatorios fiscais'),
  propria: quando('propria prefeitura publica'),
  portal1: quando('publica no portal'),
  pagina: quando('A pagina'),
  aparece: quando('aparece na tela'),
  primeiro: quando('Primeiro: de onde'),
  n823: quando('823'),
  agoraPara: quando('Agora, para onde'),
  paraOndeVai: quando('para onde vai'),
  maiorFatia: quando('maior fatia'),
  n231: quando('231'),
  em2024tinham: quando('Em 2024 tinham'),
  n269: quando('269'),
  caiu: quando('Caiu'),
  n38: quando('38'),
  vemSaude: quando('vem a saude'),
  n185: quando('185'),
  quaseIgual: quando('quase igual'),
  adm: quando('administracao da prefeitura'),
  n127: quando('127'),
  maisQue: quando('Mais que'),
  seguranca1: quando('seguranca'),
  cultura: quando('cultura'),
  assist: quando('assistencia social'),
  juntas: quando('juntas'),
  transporte: quando('O transporte subiu'),
  tr2024: quando('3 milhoes em 2024'),
  tr2025: quando('12 em 2025'),
  tr32: quando('32 so'),
  ateAgosto: quando('so ate agosto'),
  saneamento: quando('o saneamento'),
  zero: quando('zero'),
  n26: quando('26 milhoes'),
  agoraRepara: quando('Agora repara'),
  segPub: quando('seguranca publica'),
  n31: quando('31'),
  guarda: quando('guarda municipal'),
  defesa: quando('defesa civil'),
  policia: quando('A policia'),
  camara: quando('Camara de Vereadores'),
  n29: quando('29 milhoes e meio'),
  quaseMesmo: quando('Quase o mesmo'),
  eTemParte: quando('E tem a parte'),
  quaseNinguem: quando('quase ninguem ve'),
  deCada10: quando('De cada 10'),
  seis: quando('6 foram'),
  salarios: quando('salarios e encargos'),
  servidores: quando('servidores'),
  n474: quando('474'),
  obras: quando('obras e equipamentos'),
  so8: quando('so 8'),
  umReal: quando('1 real em cada'),
  leiDeixa: quando('A lei deixa'),
  n54: quando('54%'),
  comPessoal: quando('com pessoal'),
  meses12: quando('12 meses'),
  estavaEm: quando('estava em'),
  n532: quando('53,2%'),
  passou: quando('Passou do limite'),
  prudencial: quando('limite prudencial'),
  n513: quando('51,3%'),
  comIsso: quando('Com isso'),
  leiProibe: quando('a lei proibe'),
  aumento: quando('aumento'),
  cargo: quando('criar cargo'),
  contratar: quando('contratar'),
  excecoes: quando('algumas excecoes'),
  pisos: quando('E os pisos'),
  saudePrecisa: quando('saude precisa'),
  s2024: quando('Em 2024, o relatorio'),
  n146: quando('14,6%'),
  s2025: quando('Em 2025, 15,4%'),
  n154: quando('15,4%'),
  eduPrecisa: quando('educacao precisa'),
  e2024: quando('Em 2024, 25,9%'),
  n259: quando('25,9%'),
  e2025tem: quando('E 2025 tem'),
  pdf: quando('PDF da prefeitura'),
  n242: quando('24,2%'),
  abaixo: quando('abaixo do minimo'),
  tesouro: quando('Tesouro Nacional'),
  dadosPropria: quando('dados da propria'),
  n262: quando('26,2%'),
  doisOficiais: quando('Os dois sao oficiais'),
  naoBatem: quando('nao batem'),
  tribunal: quando('Tribunal de Contas'),
  dinheiroSeu: quando('O dinheiro e seu'),
  numeroPortal: quando('numero no portal'),
  emQualArea: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'ILHÉUS 2025'],
  [T.tudoAqui, 'OS RELATÓRIOS'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.agoraPara, 'PARA ONDE VAI'],
  [T.adm - 0.2, 'PREFEITURA'],
  [T.transporte, 'TRANSPORTE'],
  [T.saneamento, 'SANEAMENTO'],
  [T.agoraRepara, 'SEGURANÇA × CÂMARA'],
  [T.eTemParte, 'OS SERVIDORES'],
  [T.leiDeixa, 'O LIMITE'],
  [T.pisos, 'OS PISOS'],
  [T.e2025tem, 'PDF × TESOURO'],
  [T.dinheiroSeu, 'CONFIRA'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
// Cada trecho do kit começa 0,2 s antes da palavra da troca; `origem` é o quadro do MP4 naquele ponto.
const q = (s: number) => Math.round(s * FPS);
const KIT_B = 243;
const KIT_C = 690;
const MAPA_A = {de: 0, ate: q(T.tudoAqui), origem: 0, entrada: 0};
const MAPA_B = {de: q(T.primeiro) - 6, ate: q(T.agoraPara), origem: KIT_B + (q(T.primeiro) - 6 - q(T.primeiro - 0.2)), entrada: 6};
const MAPA_C = {de: q(T.dinheiroSeu) - 6, ate: QUADROS, origem: KIT_C + (q(T.dinheiroSeu) - 6 - q(T.dinheiroSeu - 0.2)), entrada: 6};
const noMapa = (t: number) => t < T.tudoAqui || (t >= T.primeiro && t < T.agoraPara) || t >= T.dinheiroSeu;
// mapa cobrindo a tela toda (nem entrando nem saindo): o 3D não precisa ser desenhado
const soMapa = (t: number) => (t < T.tudoAqui - 0.3) || (t > T.primeiro + 0.1 && t < T.agoraPara - 0.3) || t > T.dinheiroSeu + 0.1;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const MESA_REL: V3 = [0, 0, 7];
const ESCOLA: V3 = [-4.6, 0, -2.7];
const PILHAS_EDU: V3 = [-4.6, 0, -0.6];
const POSTO: V3 = [-1.6, 0, -5.3];
const PILHAS_SAU: V3 = [-1.6, 0, -3.5];
const PREF: V3 = [2.3, 0, -5.3];
const PILHAS_ADM: V3 = [2.3, 0, -3.5];
const BALANCA: V3 = [4.8, 0, -3.4];
const RUA_Z = -1.7;
const TR: V3[] = [
  [4.2, 0, -0.5],
  [5.0, 0, -0.5],
  [6.0, 0, -0.5],
];
const ESTACAO: V3 = [6.1, 0, 2.3];
const PILHAS_SAN: V3 = [4.3, 0, 2.6];
const GUARDA: V3 = [-5.9, 0, 1.5];
const BONECO_G: V3 = [-4.9, 0, 2.4];
const PILHAS_SEG: V3 = [-4.0, 0, 2.5];
const CAMARA: V3 = [-3.1, 0, 5.3];
const PILHAS_CAM: V3 = [-1.9, 0, 3.9];
const JUNTO_SEG: V3 = [-3.3, 0, 3.4];
const JUNTO_CAM: V3 = [-2.4, 0, 3.4];
const PILHAS_474: V3 = [0, 0, 2.4];
const PILHA_OBRA: V3 = [2.9, 0, 4.4];
const GRADE_100: V3 = [0.9, 0, 5.3];
const GUINDASTE: V3 = [4.4, 0, 5.6];
const REGUA: V3 = [0, 0, 0];
const PLACAS: V3[] = [
  [-2.2, 0, 2.0],
  [0, 0, 2.2],
  [2.2, 0, 2.0],
];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const COPO_PDF: V3 = [0.9, 0, 0];
const COPO_TES: V3 = [2.7, 0, 0];
const TCM: V3 = [0, 0, -3.6];
const CASAS: [V3, number][] = [
  [[-6.6, 0, -4.4], 0.9],
  [[-5.2, 0, -6.3], 0.6],
  [[-3.4, 0, -7.4], 0.4],
  [[0.2, 0, -7.9], 0],
  [[-7.6, 0, -1.9], 1.3],
  [[7.7, 0, -0.9], -1.4],
  [[-8.0, 0, 1.0], 1.5],
];
const ARVORES: V3[] = [
  [-7.6, 0, 3.6],
  [-6.4, 0, 6.0],
  [7.0, 0, 4.6],
  [5.6, 0, 7.0],
  [-1.2, 0, -8.2],
  [3.6, 0, -8.1],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

// ---------- As pilhas (1 pilha = R$ 10 milhões) ----------
// 79 pilhas no anel em volta do cofre (790 milhões). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 24],
      [1.9, 28],
      [2.3, 27],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; junto?: V3};
const VOOS: Voo[] = [
  {n: 23.115, t: T.n231, centro: PILHAS_EDU, cols: 6, slots: 27, fim: T.vemSaude},
  {n: 18.535, t: T.n185, centro: PILHAS_SAU, cols: 6, slots: 19, fim: T.adm},
  {n: 12.722, t: T.n127, centro: PILHAS_ADM, cols: 5, slots: 13, fim: T.transporte},
  {n: 3.123, t: T.n31, centro: PILHAS_SEG, cols: 2, slots: 4, fim: T.eTemParte, junto: JUNTO_SEG},
  {n: 2.948, t: T.n29, centro: PILHAS_CAM, cols: 2, slots: 3, fim: T.eTemParte, junto: JUNTO_CAM},
];
// para cada voo: de quais lugares do anel saem (os mais perto do destino) e para onde vão
const ROTAS = (() => {
  const livres = ANEL.map((_, i) => i);
  return VOOS.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(ANEL[a][0] - dest[j][0], ANEL[a][2] - dest[j][2]) - Math.hypot(ANEL[b][0] - dest[j][0], ANEL[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
})();
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.001);

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const afunda2025 = 0.8 * rampa(t, T.quaseNinguem, T.quaseNinguem + 1.0);
  // o anel e os voos
  if (t >= T.agoraPara - 0.1 && t < T.deCada10 + 1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.agoraPara + 0.1 + i * 0.012, T.agoraPara + 0.5 + i * 0.012);
      const v = DO_VOO[i];
      let pos: V3 = p;
      let n = nasce;
      let k = 0;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.05;
        const kv = rampa(t, a, a + 0.7);
        let dest = ROTAS[v].dest[j];
        if (voo.junto) dest = soma(dest, mix([0, 0, 0], [voo.junto[0] - voo.centro[0], 0, voo.junto[2] - voo.centro[2]], rampa(t, T.quaseMesmo, T.quaseMesmo + 0.9)));
        pos = curva(p, dest, 1.0, kv);
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        k = janela(t, voo.t, voo.fim, 0.4);
      }
      solidas.push({p: [pos[0], pos[1] - afunda2025, pos[2]], n, cor: aceso(k)});
    });
  }
  // fantasmas de 2024 (mesmo lugar, transparentes): educação 269 e saúde 181
  const destEdu = ROTAS[0].dest;
  const destSau = ROTAS[1].dest;
  const someF = 1 - rampa(t, T.adm - 0.3, T.adm + 0.4);
  if (t >= T.em2024tinham && someF > 0.01) {
    destEdu.forEach((p, j) => {
      const nasce = rampa(t, T.em2024tinham + j * 0.03, T.em2024tinham + 0.4 + j * 0.03);
      const total = j === 26 ? 0.927 : 1;
      if (j >= 23 && t >= T.caiu) {
        // as pilhas da diferença ficam marsala e afundam
        const base = j === 23 ? 0.115 : 0;
        const desce = 0.75 * rampa(t, T.caiu + 0.3, T.caiu + 1.5);
        solidas.push({p: [p[0], p[1] + base * 0.6 - desce, p[2]], n: (total - base) * someF, cor: C.alerta});
      } else fantasmas.push({p, n: total * nasce * someF, cor: ouro});
    });
  }
  if (t >= T.quaseIgual && someF > 0.01) {
    destSau.forEach((p, j) => {
      const nasce = rampa(t, T.quaseIgual + j * 0.03, T.quaseIgual + 0.4 + j * 0.03);
      fantasmas.push({p, n: (j === 18 ? 0.108 : 1) * nasce * someF, cor: ouro});
    });
  }
  // transporte: 2024, 2025 e 2026 (até agosto), subindo do chão
  const afunda3 = 0.8 * rampa(t, T.quaseNinguem, T.quaseNinguem + 1.0);
  if (t >= T.tr2024 && t < T.deCada10 + 1) {
    const sobeT = (p: V3): V3 => [p[0], -afunda3, p[2]];
    const k24 = janela(t, T.tr2024, T.tr2025, 0.4);
    const k25 = janela(t, T.tr2025, T.tr32, 0.4);
    const k26 = janela(t, T.tr32, T.saneamento, 0.4);
    solidas.push(...encher([sobeT(TR[0])], 0.302 * rampa(t, T.tr2024, T.tr2024 + 0.5), aceso(k24)));
    solidas.push(...encher(grade(sobeT(TR[1]), 2, 1), 1.2 * rampa(t, T.tr2025, T.tr2025 + 0.6), aceso(k25)));
    solidas.push(...encher(grade(sobeT(TR[2]), 4, 2), 3.236 * rampa(t, T.tr32, T.tr32 + 0.9), aceso(k26)));
  }
  // saneamento: zero em 2025, 26 milhões até agosto de 2026
  if (t >= T.n26 && t < T.deCada10 + 1) {
    solidas.push(...encher(grade([PILHAS_SAN[0], -afunda3, PILHAS_SAN[2]], 3, 3), 2.638 * rampa(t, T.n26, T.n26 + 0.8), aceso(janela(t, T.n26, T.agoraRepara, 0.4))));
  }
  // servidores e obras (2025)
  const afunda5 = 0.8 * rampa(t, T.leiDeixa, T.leiDeixa + 1.0);
  if (t >= T.n474 && t < T.leiDeixa + 1.2) {
    solidas.push(...encher(grade([PILHAS_474[0], -afunda5, PILHAS_474[2]], 48, 8), 47.42 * rampa(t, T.n474, T.n474 + 1.2), aceso(janela(t, T.n474, T.obras, 0.4))));
  }
  if (t >= T.so8 && t < T.leiDeixa + 1.2) {
    solidas.push(...encher([[PILHA_OBRA[0], -afunda5, PILHA_OBRA[2]]], 0.7985 * rampa(t, T.so8, T.so8 + 0.5), aceso(janela(t, T.so8, T.umReal, 0.4))));
  }
  return {solidas, fantasmas};
};

// as 100 moedas (1 real em cada 100): uma pilha de 1 moeda em cada lugar, numa grade 10 × 10
const GRADE_ESC = 0.6;
const POS_100 = grade([GRADE_100[0] / GRADE_ESC, 0, GRADE_100[2] / GRADE_ESC], 100, 10);

// os servidores: duas alas de 20 em volta das pilhas do centro
const agentesServidores = (k: number): Agente[] => {
  if (k < 0.02) return [];
  const a: Agente[] = [];
  [-1, 1].forEach((lado) => {
    for (let i = 0; i < 20; i++) {
      const col = i % 4;
      const lin = Math.floor(i / 4);
      a.push({x: lado * (2.3 + col * 0.42), z: 1.2 + lin * 0.5, rot: -lado * Math.PI / 2, s: 0.6 * Math.min(1, k), fase: i * 0.7, anda: 0});
    }
  });
  return a;
};

const MESES = ['SET', 'OUT', 'NOV', 'DEZ', 'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO'];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam meio metro na cena 5 e saem na cena 6
  const meio = 0.18 * rampa(t, T.quaseNinguem, T.quaseNinguem + 0.8);
  const saem = rampa(t, T.leiDeixa, T.leiDeixa + 1.0);
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - meio - saem);
  // cofre: nasce com a maquete, abre em "para onde vai", sai na cena 6
  const cofreK = rampa(t, T.agoraPara - 0.1, T.agoraPara + 0.5) * (1 - rampa(t, T.leiDeixa, T.leiDeixa + 0.9));
  // cena 1: a mesa dos relatórios
  const relK = 1 - rampa(t, T.agoraPara - 0.3, T.agoraPara + 0.4);
  const RELS: [string, string][] = [
    ['RREO', 'DEZ/2024'],
    ['RGF', 'AGO/2026'],
    ['RREO', 'AGO/2026'],
    ['RREO', 'DEZ/2025'],
  ];
  // balança da administração × segurança + cultura + assistência
  const balK = vis(t, T.maisQue - 0.1, T.tr2024 + 0.2);
  const inclina = -rampa(t, T.juntas, T.juntas + 0.8);
  const pratoDir: Pilha[] = (
    [
    {p: [-0.35, 0, 0], n: 3.123 * rampa(t, T.seguranca1, T.seguranca1 + 0.5), cor: C.ouro},
    {p: [0.05, 0, 0.1], n: 0.147 * rampa(t, T.cultura, T.cultura + 0.3), cor: C.ouro},
    {p: [0.4, 0, -0.05], n: 1.171 * rampa(t, T.assist, T.assist + 0.5), cor: C.ouro},
    ] as Pilha[]
  ).filter((x) => x.n > 0.001);
  const pratoEsq: Pilha[] = grade([0, 0, 0], 9, 3, 0.36).map((p) => ({p, n: 1.4136 * entra(t, T.maisQue, 0.5), cor: C.ouro}));
  // ônibus andando pela rua do transporte
  const busK = vis(t, T.transporte - 0.2, T.agoraRepara);
  const busX = 2.6 + 1.0 * (t - T.transporte);
  // guarda
  const guardaK = vis(t, T.segPub, T.eTemParte);
  const passo = rampa(t, T.guarda, T.guarda + 0.6);
  // cena 5
  const moedasK = vis(t, T.deCada10 - 0.1, T.n474);
  const servK = entra(t, T.servidores, 0.5) * (1 - rampa(t, T.leiDeixa, T.leiDeixa + 0.6));
  const obraK = entra(t, T.obras - 0.1, 0.5) * (1 - rampa(t, T.leiDeixa, T.leiDeixa + 0.6));
  const cemK = rampa(t, T.umReal - 0.3, T.umReal + 0.5) * (1 - rampa(t, T.leiDeixa, T.leiDeixa + 0.6));
  // cena 6
  const reguaK = rampa(t, T.leiDeixa + 0.2, T.leiDeixa + 1.4) * (1 - rampa(t, T.pisos, T.pisos + 1.0));
  const nivel = 53.2 * rampa(t, T.estavaEm - 0.2, T.n532 + 0.3);
  const placasK = (i: number) => entra(t, T.leiProibe + i * 0.15, 0.45) * (1 - rampa(t, T.pisos, T.pisos + 0.6));
  const xs = [T.aumento, T.cargo, T.contratar];
  const mesesK = vis(t, T.meses12 - 0.1, T.estavaEm + 0.6);
  // cena 7
  const coposK = rampa(t, T.pisos + 0.3, T.pisos + 1.2) * (1 - rampa(t, T.dinheiroSeu, T.dinheiroSeu + 0.3));
  const sauK = coposK * (1 - rampa(t, T.e2025tem, T.e2025tem + 0.8));
  const nivelSau = 14.63 * rampa(t, T.s2024, T.n146 + 0.2) + (15.42 - 14.63) * rampa(t, T.s2025, T.n154 + 0.3);
  const eduUnico = coposK * (1 - rampa(t, T.e2025tem + 0.2, T.e2025tem + 0.8));
  const nivelEdu = 25.88 * rampa(t, T.e2024, T.n259 + 0.2) * (1 - rampa(t, T.e2025tem, T.e2025tem + 0.6));
  const doisK = coposK * rampa(t, T.e2025tem + 0.5, T.e2025tem + 1.3);
  const nivelPdf = 24.18 * rampa(t, T.n242 - 0.4, T.n242 + 0.8);
  const nivelTes = 26.17 * rampa(t, T.n262 - 0.4, T.n262 + 0.8);
  const tcmK = rampa(t, T.tribunal - 0.3, T.tribunal + 0.7) * (1 - rampa(t, T.dinheiroSeu, T.dinheiroSeu + 0.3));
  const setaK = rampa(t, T.dadosPropria, T.dadosPropria + 1.2) * (1 - rampa(t, T.dinheiroSeu, T.dinheiroSeu + 0.3));
  const cadernoK = entra(t, T.pdf - 0.2, 0.5) * (1 - rampa(t, T.dinheiroSeu, T.dinheiroSeu + 0.3));

  return (
    <group>
      <MesaMaquete tema={tema} />
      {/* fundo da maquete: casinhas, árvores e a ponte perto do mar */}
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}
      <PonteMini tema={tema} pos={[3.3, 0, -7.2]} rotY={-0.85} escala={0.8} />

      {/* cena 1: os relatórios */}
      {relK > 0.02 ? (
        <group position={[MESA_REL[0], MESA_REL[1] - 0.8 * (1 - relK), MESA_REL[2]]}>
          <Caixa args={[2.6, 0.5, 1.7]} raio={0.05} cor={C.madeira} position={[0, 0.25, 0]} />
          {RELS.map(([titulo, sub], i) => {
            const a = T.relFiscais - 0.1 + i * 0.28;
            const k = rampa(t, a, a + 0.45, sai);
            if (k <= 0) return null;
            const topo = i === RELS.length - 1;
            return (
              <RelatorioPDF
                key={i}
                tema={tema}
                pos={[(i % 2 ? 0.04 : -0.04), 0.5 + i * 0.105 + 1.6 * (1 - k), 0]}
                rotY={[-0.12, 0.08, -0.05, 0.1][i]}
                titulo={titulo}
                sub={sub}
                aceso={topo ? janela(t, T.propria, T.pagina, 0.5) : 0}
                abre={topo ? rampa(t, T.pagina, T.pagina + 0.9) : 0}
              />
            );
          })}
          <Lupa tema={tema} pos={[-0.6 + 1.0 * rampa(t, T.pagina + 0.6, T.aparece + 0.6), 1.25, 0.15]} rot={[-1.1, 0, 0]} escala={0.55 * entra(t, T.pagina + 0.4, 0.5)} />
        </group>
      ) : null}

      {/* o cofre da prefeitura */}
      {cofreK > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - cofreK), COFRE[2]]} escala={0.75} abre={rampa(t, T.paraOndeVai, T.paraOndeVai + 0.8)} trava={1 - rampa(t, T.paraOndeVai - 0.3, T.paraOndeVai)} brilho={0.3 * janela(t, T.paraOndeVai, T.maiorFatia)} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1400} />
      <PilhasDinheiro pilhas={fantasmas} max={500} opacidade={0.3} largura={1.12} />

      {/* cena 2: escola e posto de saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={0.35} escala={0.85} sobe={predio(T.maiorFatia)} aceso={janela(t, T.maiorFatia, T.vemSaude, 0.5)} />
      <PostoSaude tema={tema} pos={POSTO} rotY={0.12} escala={0.85} sobe={predio(T.vemSaude)} aceso={janela(t, T.vemSaude, T.adm, 0.5)} />

      {/* cena 3: prefeitura, balança, rua do ônibus e saneamento */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.15} escala={0.85} sobe={predio(T.adm)} aceso={janela(t, T.adm, T.transporte, 0.5)} />
      <Balanca
        tema={tema}
        pos={BALANCA}
        escala={0.62 * balK}
        inclina={inclina}
        esq={<PilhasDinheiro pilhas={pratoEsq} max={140} />}
        dir={<PilhasDinheiro pilhas={pratoDir} max={60} />}
        brilhoDir={0.25 * janela(t, T.seguranca1, T.juntas, 0.4)}
        brilhoEsq={0.25 * janela(t, T.juntas, T.transporte, 0.4)}
      />
      {predio(T.transporte) > 0.02 ? <Caixa args={[5.0, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[5.1, 0.1 - 0.2 * (1 - predio(T.transporte)), RUA_Z]} sombra={false} /> : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[Math.min(7.0, busX), 0.11, RUA_Z]} rotY={Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}
      <EstacaoSaneamento tema={tema} pos={ESTACAO} rotY={-0.7} escala={0.75} sobe={predio(T.saneamento)} aceso={janela(t, T.saneamento, T.agoraRepara, 0.5)} />
      {/* o zero do saneamento: um círculo vazio no chão */}
      {t > T.zero - 0.1 && t < T.n26 + 0.8 ? (
        <group position={[PILHAS_SAN[0], 0.1, PILHAS_SAN[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.6, 0.03, 8, 48]} />
            <meshStandardMaterial color={C.alerta} transparent opacity={janela(t, T.zero - 0.1, T.n26 + 0.2, 0.4)} />
          </mesh>
        </group>
      ) : null}

      {/* cena 4: guarda municipal e Câmara */}
      <PostoGuarda tema={tema} pos={GUARDA} rotY={0.9} escala={0.85} sobe={predio(T.segPub)} aceso={janela(t, T.segPub, T.camara, 0.5)} />
      {guardaK > 0.02 ? (
        <Boneco tema={tema} pos={soma(BONECO_G, [0.25 * passo, 0, 0.2 * passo])} rotY={0.7} escala={0.5 * Math.min(1, guardaK)} cor={tema.objeto} pose={{passo: Math.sin(passo * Math.PI) * 0.8}}>
          <Quepe tema={tema} />
        </Boneco>
      ) : null}
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={0.3} escala={0.8} sobe={predio(T.camara)} aceso={janela(t, T.camara, T.eTemParte, 0.5)} />

      {/* cena 5: de cada 10 reais, 6 nos salários; obras com 1 em cada 100 */}
      {moedasK > 0.02
        ? Array.from({length: 10}).map((_, i) => {
            const k = entra(t, T.deCada10 + i * 0.06, 0.4) * moedasK;
            const acesa = i < 6 ? rampa(t, T.seis + i * 0.08, T.seis + 0.4 + i * 0.08) : 0;
            return <Moeda key={i} tema={tema} pos={[-2.97 + i * 0.66, 0.42 + 0.08 * acesa, 3.6]} rot={[Math.PI / 2, 0, 0]} r={0.3} escala={k} cor={mistura(tema.objeto, C.ouro, acesa)} brilho={0.3 * acesa} />;
          })
        : null}
      <Multidao tema={tema} agentes={agentesServidores(servK)} corCorpo={tema.pessoa} corMochila={tema.objetoClaro} mochila={false} />
      {/* a obra: pilha de tijolos, tábuas e cones */}
      {obraK > 0.02 ? (
        <group position={GUINDASTE} scale={Math.min(1, obraK)}>
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} raio={0.03} cor={mistura(C.alerta, C.areia, 0.4)} position={[0, 0.17 + i * 0.22, 0]} />
          ))}
          {[0, 1].map((i) => (
            <Caixa key={i} args={[1.3, 0.06, 0.18]} raio={0.02} cor={C.madeira} position={[-0.9, 0.1 + i * 0.07, 0.4 + i * 0.05]} rotation={[0, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[3.2, 0.06, 5.9]} k={0.8 * obraK} />
      <Cone tema={tema} pos={[3.6, 0.06, 6.2]} k={0.8 * obraK} />
      <RoloCompactador tema={tema} pos={[4.0, 0.06, 4.4]} rotY={-0.9} escala={0.35 * obraK} giro={t * 0.8} />
      {cemK > 0.02 ? (
        <PilhasDinheiro
          escala={GRADE_ESC}
          max={100}
          pilhas={POS_100.map((p, i) => ({p, n: 0.1 * rampa(t, T.umReal - 0.3 + (i % 10) * 0.02 + Math.floor(i / 10) * 0.02, T.umReal + 0.1 + (i % 10) * 0.02 + Math.floor(i / 10) * 0.02) * cemK, cor: i === 0 ? mistura(C.ouro, tema.acento, rampa(t, T.umReal + 0.5, T.umReal + 1.0)) : mistura(C.ouro, tema.objeto, 0.55)}))}
        />
      ) : null}

      {/* cena 6: a régua do limite e as três placas */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={rampa(t, T.prudencial, T.prudencial + 0.6)} maximo={rampa(t, T.n54, T.n54 + 0.5) * (1 - rampa(t, T.comPessoal, T.comPessoal + 0.5))} />
      {mesesK > 0.02
        ? MESES.map((m, i) => {
            const k = entra(t, T.meses12 + i * 0.06, 0.35) * mesesK;
            return (
              <group key={m} position={[-2.75 + i * 0.5, 0.08, 1.8]} scale={k}>
                <Caixa args={[0.44, 0.36, 0.06]} raio={0.02} cor={i === 11 ? mistura(tema.objetoClaro, tema.acento, 0.5) : tema.objetoClaro} position={[0, 0.2, 0]} />
                <Placa tema={tema} pos={[0, 0.2, 0.035]} larg={0.42} alt={0.3} linhas={[{t: m, tam: 300, cor: tema.tinta, peso: 900}]} />
              </group>
            );
          })
        : null}
      {['AUMENTO', 'CRIAR CARGO', 'CONTRATAR'].map((txt, i) => (
        <PlacaProibido key={txt} tema={tema} pos={PLACAS[i]} rotY={-PLACAS[i][0] * 0.12} texto={txt} escala={0.9 * placasK(i)} x={rampa(t, xs[i], xs[i] + 0.3)} />
      ))}

      {/* cena 7: os copos dos pisos */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={sauK} piso={15} risco={rampa(t, T.saudePrecisa, T.saudePrecisa + 0.5)} nivel={nivelSau} falta={janela(t, T.n146, T.s2025, 0.4)} acima={rampa(t, T.n154, T.n154 + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={eduUnico} piso={25} risco={rampa(t, T.eduPrecisa, T.eduPrecisa + 0.5)} nivel={nivelEdu} />
      <CopoPiso tema={tema} pos={COPO_PDF} sobe={doisK} piso={25} risco={1} nivel={nivelPdf} falta={rampa(t, T.abaixo, T.abaixo + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_TES} sobe={doisK} piso={25} risco={1} nivel={nivelTes} acima={0.5 * rampa(t, T.n262 + 0.4, T.n262 + 1.0)} />
      {cadernoK > 0.02 ? (
        <group position={[COPO_PDF[0] - 0.2, 0.62, COPO_PDF[2] + 1.15]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
          <RelatorioPDF tema={tema} pos={[0, 0, 0]} titulo="RREO" sub="DEZ/2025" escala={0.75 * cadernoK} aceso={janela(t, T.pdf, T.tesouro, 0.4)} />
        </group>
      ) : null}
      {setaK > 0.02 ? <Trilha f={(s) => curva([COPO_PDF[0] - 0.2, 1.1, COPO_PDF[2] + 1.0], [COPO_TES[0], yCopo(26) + 0.5, COPO_TES[2] + 0.3], 1.0, s)} prog={setaK} cor={tema.objetoClaro} n={22} raio={0.035} /> : null}
      <PredioTCM tema={tema} pos={TCM} sobe={tcmK} aceso={janela(t, T.tribunal, T.dinheiroSeu, 0.5)} escala={0.95} />
      <Lupa tema={tema} pos={[0.9 + 1.8 * rampa(t, T.tribunal + 0.4, T.tribunal + 1.8), 3.3, 0.3]} rot={[-1.1, 0, 0]} escala={0.6 * tcmK} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0], 18, 11, [0, 1.43, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 0.6, 7], 3.2, 2.4, [0, 0.58, 1])]]},
  {
    ini: T.tudoAqui,
    chaves: [
      [T.tudoAqui, E([0, 0.7, 7], 3.6, 2.6, [0, 0.62, 1])],
      [T.propria, E([0, 0.7, 7], 3.0, 2.3, [0.05, 0.6, 1])],
      [T.portal1 - 0.1, E([0, 0.7, 7], 2.6, 2.0, [0.15, 0.62, 1])],
      [T.primeiro, E([0.1, 0.7, 7], 2.3, 1.8, [0.3, 0.66, 1])],
    ],
  },
  {ini: T.primeiro, chaves: [[T.primeiro, MESA_TODA]]},
  {
    ini: T.agoraPara,
    arco: 0.04,
    chaves: [
      [T.agoraPara, E([0, 0, 0.4], 19, 12, [0, 1.43, 1])],
      [T.maiorFatia - 0.1, E([0, 0, 0], 17.5, 11, [0.05, 1.4, 1])],
      [T.maiorFatia + 0.7, E([-3.7, 0.8, -1.4], 6, 4.6, [0.5, 0.72, 1])],
      [T.vemSaude - 0.3, E([-3.9, 0.8, -1.3], 5.6, 4.3, [0.62, 0.72, 1])],
      [T.vemSaude + 0.5, E([-1.6, 0.8, -4.0], 5, 3.9, [0.3, 0.64, 1])],
      [T.adm - 0.3, E([-1.6, 0.8, -4.0], 4.8, 3.8, [0.15, 0.64, 1])],
    ],
  },
  {
    ini: T.adm - 0.2,
    arco: 0.04,
    chaves: [
      [T.adm - 0.2, E([2.9, 1.0, -4.1], 6.4, 4.6, [-0.1, 0.7, 1])],
      [T.juntas, E([3.2, 1.0, -4.0], 6.0, 4.4, [-0.25, 0.7, 1])],
      [T.transporte + 0.4, E([5.0, 0.6, -1.0], 5.6, 4.0, [1, 0.62, 0.55])],
      [T.saneamento - 0.4, E([5.0, 0.6, -1.0], 5.2, 3.8, [1, 0.6, 0.75])],
      [T.saneamento + 0.4, E([5.0, 0.6, 2.4], 5, 3.8, [0.65, 0.66, 1])],
      [T.agoraRepara - 0.2, E([5.0, 0.8, 2.4], 5, 3.8, [0.5, 0.75, 1])],
    ],
  },
  {
    ini: T.agoraRepara,
    arco: 0.04,
    chaves: [
      [T.agoraRepara, E([-2.0, 1.2, 2.0], 8.5, 6, [-0.3, 0.9, 1])],
      [T.segPub + 0.2, E([-4.6, 0.9, 2.1], 5, 3.8, [-0.6, 0.7, 1])],
      [T.camara - 0.3, E([-4.4, 0.9, 2.3], 4.8, 3.6, [-0.5, 0.7, 1])],
      [T.camara + 0.4, E([-3.0, 0.8, 3.7], 6.4, 4.6, [-0.25, 0.8, 1])],
      [T.eTemParte - 0.2, E([-2.9, 0.8, 3.6], 6.0, 4.4, [-0.15, 0.8, 1])],
    ],
  },
  {
    ini: T.eTemParte,
    arco: 0.05,
    chaves: [
      [T.eTemParte, E([0, 1.0, 1.5], 10, 7, [0, 1.0, 1])],
      [T.deCada10, E([0, 0.8, 2.6], 8, 5.6, [0, 0.84, 1])],
      [T.obras - 0.3, E([0.2, 0.8, 2.6], 7.6, 5.4, [0.2, 0.84, 1])],
      [T.obras + 0.4, E([2.2, 0.6, 4.8], 5.8, 4.2, [0.2, 1.0, 1])],
      [T.leiDeixa - 0.2, E([2.1, 0.6, 4.8], 5.4, 4.0, [0.1, 1.0, 1])],
    ],
  },
  {
    ini: T.leiDeixa,
    arco: 0.04,
    chaves: [
      [T.leiDeixa, E([0, 2.6, 0], 3.6, 6.4, [0, 0.3, 1])],
      [T.estavaEm, E([0, 2.9, 0], 3.4, 6.0, [0.05, 0.28, 1])],
      [T.passou, E([0, 4.3, 0], 2.4, 2.2, [0.05, 0.22, 1])],
      [T.comIsso, E([0, 4.3, 0], 2.4, 2.2, [0.08, 0.22, 1])],
      [T.leiProibe + 0.2, E([0, 1.6, 1.6], 6.4, 4.6, [0, 0.47, 1])],
      [T.pisos - 0.2, E([0, 1.6, 1.6], 6.0, 4.4, [0.05, 0.47, 1])],
    ],
  },
  {
    ini: T.pisos,
    arco: 0.04,
    chaves: [
      [T.pisos, E([0, 1.3, 0], 6.4, 4.2, [0, 0.4, 1])],
      [T.saudePrecisa, E([-1.8, 1.3, 0], 3.6, 3.4, [0.1, 0.36, 1])],
      [T.eduPrecisa - 0.4, E([-1.6, 1.3, 0], 3.4, 3.3, [0.15, 0.36, 1])],
      [T.eduPrecisa + 0.3, E([1.8, 1.3, 0], 3.6, 3.4, [-0.1, 0.36, 1])],
      [T.e2025tem, E([1.8, 1.3, 0.2], 3.8, 3.4, [-0.05, 0.38, 1])],
      [T.e2025tem + 1.0, E([1.8, 1.3, 0.3], 5.0, 3.8, [0, 0.4, 1])],
      [T.doisOficiais - 0.2, E([1.8, 1.3, 0.3], 4.6, 3.6, [0.05, 0.4, 1])],
      [T.tribunal - 0.4, E([0.9, 1.7, -1.0], 8, 5.6, [0, 0.58, 1])],
      [T.dinheiroSeu, E([0.9, 1.9, -1.0], 8.4, 6, [0.05, 0.62, 1])],
    ],
  },
  {ini: T.dinheiroSeu, chaves: [[T.dinheiroSeu, MESA_TODA]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.relFiscais, b: T.portal1, texto: 'RELATÓRIOS FISCAIS DA PREFEITURA'},
  {a: T.portal1, b: T.pagina, texto: 'PORTAL DA TRANSPARÊNCIA', destaque: true},
  {a: T.pagina, b: T.primeiro, texto: 'A PÁGINA DE CADA NÚMERO'},
  {a: T.paraOndeVai, b: T.maiorFatia, texto: 'GASTOS DE 2025: R$ 790 MI'},
  {a: T.maiorFatia, b: T.n231, texto: 'A MAIOR FATIA: EDUCAÇÃO'},
  {a: T.vemSaude, b: T.n185, texto: 'DEPOIS, A SAÚDE'},
  {a: T.adm, b: T.n127, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.maisQue, b: T.juntas, texto: 'SEGURANÇA + CULTURA + ASSISTÊNCIA'},
  {a: T.transporte, b: T.tr2024, texto: 'O TRANSPORTE SUBIU', destaque: true},
  {a: T.saneamento, b: T.zero, texto: 'SANEAMENTO'},
  {a: T.agoraRepara, b: T.segPub, texto: 'AGORA REPARA'},
  {a: T.policia, b: T.camara, texto: 'POLÍCIA: É DO ESTADO'},
  {a: T.quaseMesmo, b: T.eTemParte, texto: 'QUASE O MESMO VALOR', destaque: true},
  {a: T.quaseNinguem, b: T.deCada10, texto: 'A PARTE QUE QUASE NINGUÉM VÊ'},
  {a: T.deCada10, b: T.salarios, texto: 'DE CADA 10 REAIS, 6...'},
  {a: T.salarios, b: T.n474, texto: 'SALÁRIOS + ENCARGOS DOS SERVIDORES', destaque: true},
  {a: T.obras, b: T.so8, texto: 'OBRAS E EQUIPAMENTOS'},
  {a: T.umReal, b: T.leiDeixa, texto: '1 REAL EM CADA 100', destaque: true},
  {a: T.comPessoal, b: T.meses12, texto: 'GASTO COM PESSOAL ÷ RECEITA'},
  {a: T.meses12, b: T.n532, texto: '12 MESES ATÉ AGO/2026'},
  {a: T.leiProibe, b: T.excecoes, texto: 'A LEI PROÍBE', destaque: true},
  {a: T.excecoes, b: T.pisos, texto: 'EXCEÇÃO: REPOR SERVIDOR DE SAÚDE, EDUCAÇÃO E SEGURANÇA'},
  {a: T.pisos, b: T.saudePrecisa, texto: 'OS PISOS DA LEI'},
  {a: T.saudePrecisa, b: T.s2024, texto: 'SAÚDE: MÍNIMO DE 15% DOS IMPOSTOS'},
  {a: T.eduPrecisa, b: T.e2024, texto: 'EDUCAÇÃO: MÍNIMO DE 25%'},
  {a: T.e2025tem, b: T.pdf, texto: 'E 2025 TEM UMA DIFERENÇA'},
  {a: T.doisOficiais, b: T.naoBatem, texto: 'OS DOIS SÃO OFICIAIS'},
  {a: T.naoBatem, b: T.tribunal, texto: 'E NÃO BATEM', destaque: true},
  {a: T.tribunal, b: T.dinheiroSeu, texto: 'QUEM ANALISA: TCM-BA'},
];
const SELOS: Txt[] = [
  {a: T.relFiscais, b: T.aparece, texto: 'PORTAL DA TRANSPARÊNCIA DE ILHÉUS · RREO E RGF'},
  {a: T.aparece, b: T.primeiro, texto: 'FONTE: RREO DEZ/2025 · P. 3', destaque: true},
  {a: T.n823, b: T.agoraPara, texto: 'FONTE: RREO DEZ/2025 · P. 1'},
  {a: T.agoraPara + 0.5, b: T.n231, texto: 'FONTE: RREO DEZ/2025 · P. 3 E 5'},
  {a: T.n231, b: T.transporte, texto: 'FONTE: RREO DEZ/2025 · P. 3 (2024: RREO DEZ/2024 · P. 5)'},
  {a: T.transporte, b: T.saneamento, texto: 'FONTE: RREO DEZ/2024 · P. 6 · DEZ/2025 · P. 4 · AGO/2026 · P. 8'},
  {a: T.saneamento, b: T.agoraRepara, texto: 'FONTE: RREO DEZ/2025 · P. 4 · AGO/2026 · P. 7'},
  {a: T.n31, b: T.eTemParte, texto: 'FONTE: RREO DEZ/2025 · P. 3'},
  {a: T.deCada10, b: T.leiDeixa, texto: 'FONTE: RREO DEZ/2025 · P. 2'},
  {a: T.leiDeixa, b: T.pisos, texto: 'FONTE: RGF AGO/2026 · P. 1 · LRF, ART. 20 E 22'},
  {a: T.pisos, b: T.tesouro, texto: 'FONTE: RREO DEZ/2024 · P. 18 E 25 · DEZ/2025 · P. 16 E 22'},
  {a: T.tesouro, b: T.dinheiroSeu, texto: 'TESOURO NACIONAL · SICONFI · RREO DEZ/2025, ANEXO 14'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n231, b: T.vemSaude, p: soma(PILHAS_EDU, [0, 0.8, 0.6]), valor: '231 MI', sub: 'R$ 231,15 MI · 2025', cor: 'acento'},
  {a: T.n269, b: T.vemSaude, p: soma(PILHAS_EDU, [0, 0.8, -1.0]), valor: '2024: 269 MI', sub: 'R$ 269,27 MI', dy: 40},
  {a: T.n38, b: T.vemSaude, p: soma(PILHAS_EDU, [0.7, 0.2, -0.6]), valor: '−38 MI', cor: 'alerta', dy: -60},
  {a: T.n185, b: T.adm, p: soma(PILHAS_SAU, [0, 0.8, 0.4]), valor: '185 MI', sub: 'R$ 185,35 MI · 2025', cor: 'acento'},
  {a: T.quaseIgual, b: T.adm, p: soma(PILHAS_SAU, [0, 0.8, -0.4]), valor: '2024: 181 MI', sub: 'R$ 181,08 MI', dy: 40},
  {a: T.n127, b: T.maisQue, p: soma(PILHAS_ADM, [0, 0.8, 0.3]), valor: '127 MI', sub: 'R$ 127,22 MI', cor: 'acento'},
  {a: T.maisQue, b: T.tr2024, p: soma(BALANCA, [-1.4, 1.6, 0]), valor: '127 MI', sub: 'ADMINISTRAÇÃO'},
  {a: T.juntas, b: T.tr2024, p: soma(BALANCA, [1.4, 1.8, 0]), valor: '44 MI JUNTAS', sub: '31,2 + 1,5 + 11,7', cor: 'acento'},
  {a: T.tr2024, b: T.saneamento, p: soma(TR[0], [0, 0.4, 0]), valor: '2024: 3 MI', dy: 90},
  {a: T.tr2025, b: T.saneamento, p: soma(TR[1], [0, 0.9, 0]), valor: '2025: 12 MI', dy: 30},
  {a: T.tr32, b: T.saneamento, p: soma(TR[2], [0, 1.0, 0]), valor: '32 MI', sub: 'ATÉ AGO/2026 · R$ 32,36 MI', cor: 'acento'},
  {a: T.zero, b: T.n26, p: soma(PILHAS_SAN, [0, 0.4, 0]), valor: '2025: R$ 0', cor: 'alerta'},
  {a: T.n26, b: T.agoraRepara, p: soma(PILHAS_SAN, [0, 0.8, 0]), valor: '26 MI', sub: 'ATÉ AGO/2026 · R$ 26,38 MI', cor: 'acento'},
  {a: T.n31, b: T.guarda, p: soma(PILHAS_SEG, [0, 0.9, 0]), valor: '31 MI', sub: 'R$ 31,23 MI · SEGURANÇA', cor: 'acento'},
  {a: T.guarda, b: T.defesa, p: soma(PILHAS_SEG, [0, 0.9, 0]), valor: '31 MI', sub: 'GUARDA MUNICIPAL', cor: 'acento'},
  {a: T.defesa, b: T.camara, p: soma(PILHAS_SEG, [0, 0.9, 0]), valor: '31 MI', sub: 'GUARDA + DEFESA CIVIL', cor: 'acento'},
  {a: T.camara, b: T.eTemParte, p: soma(JUNTO_SEG, [0, 0.9, 0]), valor: '31 MI', sub: 'SEGURANÇA', dy: 40},
  {a: T.n29, b: T.eTemParte, p: soma(PILHAS_CAM, [0, 0.9, 0]), valor: '29,5 MI', sub: 'R$ 29,48 MI · CÂMARA', cor: 'acento'},
  {a: T.n474, b: T.obras, p: soma(PILHAS_474, [0, 0.9, 0]), valor: '474 MI', sub: 'R$ 474,19 MI · PESSOAL', cor: 'acento'},
  {a: T.so8, b: T.leiDeixa, p: soma(PILHA_OBRA, [0, 0.6, 0]), valor: '8 MI', sub: 'R$ 7,99 MI · OBRAS', cor: 'acento'},
  {a: T.n54, b: T.comIsso, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.n513, b: T.comIsso, p: [0.75, yRegua(51.3) + 0.2, 0], valor: '51,3%', sub: 'PRUDENCIAL', cor: 'alerta', dy: -40},
  {a: T.n146, b: T.s2025, p: soma(COPO_SAU, [0, yCopo(14.6) + 0.2, 0.6]), valor: '2024: 14,6%', cor: 'alerta'},
  {a: T.n154, b: T.eduPrecisa, p: soma(COPO_SAU, [0, yCopo(15.4) + 0.3, 0.6]), valor: '2025: 15,4%', sub: 'CUMPRIU O PISO', cor: 'acento'},
  {a: T.n259, b: T.e2025tem, p: soma(COPO_EDU, [0, yCopo(25.9) + 0.3, 0.6]), valor: '2024: 25,9%', sub: 'CUMPRIU O PISO', cor: 'acento'},
  {a: T.pdf, b: T.n242, p: soma(COPO_PDF, [0, 3.0, 0]), valor: 'PDF', sub: 'DA PREFEITURA'},
  {a: T.n242, b: T.dinheiroSeu, p: soma(COPO_PDF, [0, 3.0, 0]), valor: '24,2%', sub: 'PDF · R$ 140,16 MI', cor: 'alerta'},
  {a: T.tesouro, b: T.n262, p: soma(COPO_TES, [0, 3.0, 0]), valor: 'TESOURO', sub: 'NACIONAL · SICONFI'},
  {a: T.n262, b: T.dinheiroSeu, p: soma(COPO_TES, [0, 3.0, 0]), valor: '26,2%', sub: 'TESOURO · R$ 151,65 MI', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.agoraPara + 0.4, T.leiDeixa);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 9,
              background: tema.cartao,
              border: `1.5px solid ${seloAtual.destaque ? mistura(tema.cartaoBorda, tema.acento, pulso(t, T.aparece, 1.2)) : tema.cartaoBorda}`,
              fontFamily: MONO,
              fontSize: seloAtual.texto.length > 46 ? 14 : 16,
              letterSpacing: 1.5,
              color: tema.textoSuave,
              whiteSpace: 'nowrap',
            }}
          >
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 10 MI</div>
        </div>
      ) : null}
    </div>
  );
  // ícone do PDF que abre no mapa 1
  const pdfK = vis(t, T.abri, T.tudoAqui - 0.2);
  const iconePdf =
    pdfK > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.dir, top: 404, opacity: Math.min(1, pdfK), transform: `translateY(${(1 - Math.min(1, pdfK)) * 16}px)`}}>
        <div style={{width: 92, height: 118, borderRadius: 10, background: tema.objetoClaro, border: `3px solid ${tema.cartaoBorda}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          <div style={{fontFamily: FONTE, fontSize: 24, fontWeight: 900, color: tema.tinta}}>RREO</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 54, height: 5, borderRadius: 3, background: tema.textoSuave}} />
          ))}
        </div>
      </div>
    ) : null;
  if (noMapa(t)) {
    const comentaK = vis(t, T.comentarios, FIM);
    const arrobaK = rampa(t, T.segue, T.segue + 0.4);
    return (
      <>
        {cabecalho}
        {iconePdf}
        {arrobaK > 0.01 || comentaK > 0.01 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center'}}>
            <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
              <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>QUAL ÁREA PRECISA DE MAIS? COMENTA AQUI</div>
              {arrobaK > 0.01 ? <div style={{fontFamily: FONTE, fontSize: 58, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: arrobaK}}>@eumagnoleite</div> : null}
            </div>
          </div>
        ) : null}
      </>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 330 && Math.abs(visRot[a].y - visRot[b].y) < 96) visRot[a].y = visRot[b].y - 100;
  // sinais grandes: ≈ (segurança e Câmara) e ≠ (PDF e Tesouro)
  const sinal = (txt: string, p: V3, k: number, corS: string) => {
    if (k <= 0.01) return null;
    const pj = projetar(p, cam, W, H);
    return (
      <div style={{position: 'absolute', left: pj.x, top: pj.y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, opacity: Math.min(1, k), fontFamily: FONTE, fontSize: 150, fontWeight: 900, color: corS, textShadow: `0 4px 18px ${tema.fundo}`}}>
        {txt}
      </div>
    );
  };
  const n532K = entra(t, T.n532, 0.5) * (1 - rampa(t, T.comIsso - 0.3, T.comIsso));
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 458, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: Math.max(SEGURO.esq + 150, Math.min(SEGURO.botoesX - 150, v.x)), top: Math.max(560, Math.min(1240, v.y)), transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {sinal('≈', soma(mix(JUNTO_SEG, JUNTO_CAM, 0.5), [0, 1.1, 0]), vis(t, T.quaseMesmo + 0.4, T.eTemParte), tema.texto)}
      {sinal('≠', [(COPO_PDF[0] + COPO_TES[0]) / 2, 1.6, 0], vis(t, T.naoBatem, T.dinheiroSeu), C.alerta)}
      {n532K > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, top: 700, display: 'flex', opacity: Math.min(1, n532K)}}>
          <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${tema.acento}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, n532K)) * 20}px)`}}>
            <div style={{fontFamily: FONTE, fontSize: 80, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: tema.acento}}>53,2%</div>
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>12 MESES ATÉ AGO/2026</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number; entrada: number}> = ({de, ate, origem, entrada}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = entrada > 0 ? interpolate(f, [0, entrada, dur - 6, dur], [0, 1, 1, 0], clamp) : interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/ilheus.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.15}));
  // mapa 1
  s.push({t: T.n790, f: 'pop', v: 0.22});
  s.push({t: T.abri, f: 'pop', v: 0.16});
  // cena 1
  [0, 1, 2, 3].forEach((i) => s.push({t: T.relFiscais + 0.3 + i * 0.28, f: 'baque', v: 0.14}));
  s.push({t: T.portal1, f: 'pop', v: 0.2});
  s.push({t: T.pagina + 0.2, f: 'whoosh', v: 0.1});
  // mapa 2
  s.push({t: T.n823, f: 'pop', v: 0.22});
  // pilhas que deslizam: pop baixinho, no máximo 1 a cada 0,08 s
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.05 + 0.6, f: 'pop', v: 0.08});
  });
  s.push({t: T.paraOndeVai, f: 'subida', v: 0.18});
  [T.n231, T.n269, T.n185, T.quaseIgual, T.n127, T.tr2024, T.tr2025, T.tr32, T.n26, T.n31, T.n29, T.n474, T.so8].forEach((t) => s.push({t, f: 'pop', v: 0.22}));
  s.push({t: T.caiu + 0.4, f: 'baque', v: 0.26});
  s.push({t: T.n38, f: 'pop', v: 0.2});
  [T.seguranca1, T.cultura, T.assist].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  s.push({t: T.juntas, f: 'baque', v: 0.2});
  s.push({t: T.zero, f: 'baque', v: 0.24});
  s.push({t: T.policia, f: 'pop', v: 0.16});
  s.push({t: T.quaseMesmo + 0.4, f: 'ding', v: 0.2});
  for (let i = 0; i < 10; i++) s.push({t: T.deCada10 + i * 0.1, f: 'pop', v: 0.08});
  s.push({t: T.seis + 0.2, f: 'subida', v: 0.16});
  s.push({t: T.servidores, f: 'pop', v: 0.18});
  s.push({t: T.umReal + 0.5, f: 'ding', v: 0.18});
  // cena 6
  s.push({t: T.leiDeixa + 0.2, f: 'subida', v: 0.2});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.estavaEm - 0.2, f: 'subida', v: 0.24});
  s.push({t: T.n532, f: 'pop', v: 0.24});
  s.push({t: T.n513, f: 'pop', v: 0.2});
  [T.aumento, T.cargo, T.contratar].forEach((t) => s.push({t: t + 0.1, f: 'impacto', v: 0.22}));
  // cena 7
  s.push({t: T.pisos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.s2024, f: 'subida', v: 0.18});
  s.push({t: T.n154, f: 'ding', v: 0.22});
  s.push({t: T.e2024, f: 'subida', v: 0.18});
  s.push({t: T.e2025tem + 0.5, f: 'whoosh', v: 0.14});
  s.push({t: T.n242 - 0.4, f: 'subida', v: 0.18});
  s.push({t: T.n262 - 0.4, f: 'subida', v: 0.18});
  s.push({t: T.n262 + 0.4, f: 'ding', v: 0.2});
  s.push({t: T.naoBatem, f: 'baque', v: 0.2});
  s.push({t: T.tribunal, f: 'subida', v: 0.16});
  // mapa 3
  s.push({t: T.numeroPortal, f: 'bip', v: 0.16});
  [0, 1, 2, 3, 4].forEach((i) => s.push({t: T.emQualArea + 0.4 * i + 0.1, f: 'bip', v: 0.12}));
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.n790 + 2.0, T.relFiscais + 1.4, T.portal1 + 0.4, T.pagina + 1.2, T.n823 + 1.2, T.agoraPara + 0.8, T.maiorFatia + 1.2, T.n231 + 1.4, T.n269 + 0.6, T.n38 + 0.6,
  T.n185 + 1.2, T.quaseIgual + 0.8, T.n127 + 1.0, T.juntas + 0.6, T.tr2024 + 0.5, T.tr32 + 0.8, T.zero + 0.4, T.n26 + 1.0, T.agoraRepara + 0.4, T.n31 + 1.0, T.defesa + 0.4, T.policia + 0.4,
  T.n29 + 1.0, T.quaseMesmo + 1.0, T.quaseNinguem + 0.6, T.seis + 0.6, T.servidores + 0.8, T.n474 + 1.2, T.so8 + 0.6, T.umReal + 1.0, T.leiDeixa + 1.4, T.n54 + 0.6, T.meses12 + 0.8,
  T.n532 + 0.6, T.n513 + 0.6, T.contratar + 0.6, T.excecoes + 0.6, T.saudePrecisa + 0.4, T.n146 + 0.6, T.n154 + 0.6, T.n259 + 0.6, T.e2025tem + 1.4, T.n242 + 0.8, T.abaixo + 0.6,
  T.dadosPropria + 1.0, T.n262 + 0.8, T.naoBatem + 0.4, T.tribunal + 1.2, T.numeroPortal + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
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
    <>
      <Sequence from={MAPA_A.de} durationInFrames={MAPA_A.ate - MAPA_A.de} layout="none">
        <TrechoMapa {...MAPA_A} />
      </Sequence>
      <Sequence from={MAPA_B.de} durationInFrames={MAPA_B.ate - MAPA_B.de} layout="none">
        <TrechoMapa {...MAPA_B} />
      </Sequence>
      <Sequence from={MAPA_C.de} durationInFrames={MAPA_C.ate - MAPA_C.de} layout="none">
        <TrechoMapa {...MAPA_C} />
      </Sequence>
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Ilhéus" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['790 milhões.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE ILHÉUS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
