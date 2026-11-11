import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Balanca, CasaMini, CofreFGTS, Cone, Lupa, Multidao, Onibus, Quepe, RoloCompactador, type Agente} from '../../pecas';
import {PontoOnibus} from '../onibusilheus/pecas';
import {
  BancoDivida,
  BaseDefesaCivil,
  CaixaFundef,
  CamaraVereadores,
  CopoPiso,
  Escola,
  ListaHabilitados,
  MesaMaquete,
  PilhasDinheiro,
  PlacaProibido,
  PonteMini,
  PostoGuarda,
  PostoSaude,
  PredioAssistencia,
  PredioTCM,
  Prefeitura,
  RelatorioPDF,
  ReguaLimite,
  RuaServicos,
  TeatroMini,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from './pecas';
import {PALAVRAS} from './palavras';

// 017. orçamento de itabuna (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda de Itabuna (mesma série do 014: cofre da prefeitura no meio,
// 1 pilha = R$ 10 milhões, o rio Cachoeira ao fundo) e encaixa os dois trechos de mapa do Kit Mapas
// (projetos/017.../mapas/itabuna.mp4, composição OrcamentoItabuna do kit), seguidos, com o MESMO relógio.
// Todo número vem dos PDFs da Prefeitura de Itabuna (portal da transparência), com selo de documento e página.
// Neutro: sem nome de prefeito nem partido. Nenhum número de outra cidade.
// Plano: projetos/017. orçamento de itabuna/plano.md (versão 1, aprovada em 04/11/2026).

export const FPS = 30;
const AUDIO_SEG = 172.21;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '017. orçamento de itabuna';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bilhao: quando('1 bilhao'),
  abri: quando('abri as contas'),
  pagina: quando('A pagina'),
  primeiro: quando('Primeiro, de onde'),
  federal: quando('governo federal'),
  n543: quando('543'),
  impostos1: quando('os impostos da'),
  paraOnde: quando('para onde foi'),
  saude: quando('Saude'),
  n366: quando('366'),
  maiorFatia: quando('maior fatia'),
  umDe3: quando('1 de cada 3'),
  seteDe10: quando('7 de cada 10'),
  hospital: quando('hospital e atendimento'),
  educ: quando('Educacao: 236'),
  n236: quando('236'),
  n13: quando('13 milhoes'),
  aMenos: quando('a menos'),
  em2024: quando('em 2024'),
  adm: quando('administracao da prefeitura'),
  n97: quando('97'),
  camara: quando('A Camara de Vereadores'),
  n27: quando('27'),
  dobro: quando('o dobro'),
  todaSeg: quando('toda a seguranca'),
  ruas: quando('Ruas e servicos'),
  n111: quando('111'),
  limpeza: quando('limpeza'),
  iluminacao: quando('iluminacao'),
  manutencao: quando('manutencao'),
  asObras: quando('As obras de'),
  previstas128: quando('previstas em 128'),
  sairam: quando('Sairam 36'),
  curiosidade: quando('uma curiosidade'),
  contaTr: quando('conta do transporte'),
  so2: quando('so 2 milhoes'),
  outraParte: quando('outra parte do relatorio'),
  linha: quando('linha chamada'),
  coletivo: quando('transporte coletivo'),
  n44: quando('44'),
  onibus: quando('onibus da cidade'),
  camaraInteira: quando('a Camara inteira'),
  assist: quando('Assistencia social'),
  n27b: quando('27', 2),
  cultura: quando('Cultura'),
  n14: quando('14'),
  segPub: quando('Seguranca publica: 13'),
  repara: quando('E repara'),
  defesa: quando('defesa civil'),
  n71: quando('71'),
  gastou105: quando('Gastou 105'),
  somando: quando('Somando todas'),
  obrasEq: quando('obras e equipamentos'),
  n218: quando('218'),
  n33: quando('33 gastos'),
  nem1: quando('Nem 1 real'),
  divida: quando('a divida levou'),
  n62: quando('62'),
  quaseDobro: quando('Quase o dobro'),
  maiorConta: quando('maior conta'),
  salarios: quando('os salarios'),
  lrf: quando('Lei de Responsabilidade'),
  teto: quando('um teto'),
  n54: quando('maximo 54%'),
  receita: quando('da receita'),
  em2025: quando('Em 2025, Itabuna'),
  n57: quando('57%'),
  passou: quando('Passou do teto'),
  meses: quando('8 meses'),
  cortar: quando('cortar o excesso'),
  verbas: quando('verbas extras'),
  emprest: quando('novos emprestimos'),
  em2026: quando('Em 2026'),
  n44p: quando('caiu para 44%'),
  parece: quando('Parece resolvido'),
  naoBem: quando('nao e bem assim'),
  fevereiro: quando('Em fevereiro'),
  deUmaVez: quando('de uma vez'),
  n208: quando('208'),
  precatorio: quando('precatorio do Fundef'),
  justica: quando('a Justica mandou'),
  uniaoPagar: quando('a Uniao pagar'),
  soPode: quando('so pode ir'),
  inflou: quando('inflou a receita'),
  porcentagem: quando('porcentagem caiu'),
  semEle: quando('Sem ele'),
  nossas: quando('pelas nossas contas'),
  perto54: quando('perto de 54%'),
  colado: quando('Colado no teto'),
  professores: quando('os professores'),
  reserva: quando('reserva cerca'),
  n40: quando('40 milhoes'),
  lista: quando('saiu a lista'),
  n2236: quando('2.236'),
  categoria: quando('a categoria parou'),
  semData: quando('nao havia data'),
  minimos: quando('Os minimos da lei'),
  saudeRec: quando('A saude recebeu'),
  n17: quando('17%'),
  min15: quando('minimo e 15'),
  eduRec: quando('A educacao, 25,8%'),
  min25: quando('minimo e 25'),
  tribunal: quando('Tribunal de Contas'),
  emQual: quando('Em qual dessas'),
  gastarMais: quando('gastar mais'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'ITABUNA 2025'],
  [T.primeiro, 'DE ONDE VEIO'],
  [T.paraOnde, 'PARA ONDE FOI'],
  [T.saude, 'SAÚDE'],
  [T.educ, 'EDUCAÇÃO'],
  [T.adm, 'PREFEITURA'],
  [T.camara, 'CÂMARA'],
  [T.ruas, 'RUAS E SERVIÇOS'],
  [T.curiosidade, 'O ÔNIBUS'],
  [T.assist, 'OUTRAS ÁREAS'],
  [T.repara, 'DEFESA CIVIL'],
  [T.somando, 'OBRAS × DÍVIDA'],
  [T.maiorConta, 'O TETO'],
  [T.em2026, 'O FUNDEF'],
  [T.professores, 'OS PROFESSORES'],
  [T.minimos, 'OS MÍNIMOS'],
  [T.emQual, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const MESA_REL: V3 = [0, 0, 7.4];
const HOSP: V3 = [-1.4, 0, -5.6];
const PILHAS_SAU: V3 = [-1.6, 0, -3.7];
const MOEDAS3: V3 = [1.3, 0, -3.5];
const ESCOLA: V3 = [-6.2, 0, -2.0];
const PILHAS_EDU: V3 = [-4.4, 0, -1.4];
const PREF: V3 = [2.2, 0, -5.4];
const PILHAS_ADM: V3 = [2.0, 0, -3.7];
const CAMARA: V3 = [5.2, 0, -3.8];
const PILHAS_CAM: V3 = [3.8, 0, -2.3];
const GUARDA: V3 = [6.4, 0, -1.4];
const BONECO_G: V3 = [5.5, 0, -0.3];
const PILHAS_SEG: V3 = [4.9, 0, -0.9];
const RUA: V3 = [-3.6, 0, 4.6];
const PILHAS_RUA: V3 = [-3.6, 0, 3.0];
const PILHAS_INF: V3 = [-1.4, 0, 5.7];
const OBRA: V3 = [-2.6, 0, 6.4];
const PLACA_TR: V3 = [0.4, 0, 3.5];
const PONTO: V3 = [1.0, 0, 5.05];
const RUA_BUS_Z = 6.0;
const PILHAS_BUS: V3 = [1.8, 0, 3.8];
const PILHAS_GHOST: V3 = [2.9, 0, 3.8];
const ASSIST: V3 = [-7.0, 0, 1.6];
const PILHAS_ASS: V3 = [-5.3, 0, 1.3];
const CULTURA: V3 = [-4.6, 0, -5.4];
const PILHAS_CUL: V3 = [-3.6, 0, -3.9];
const DEFESA: V3 = [6.8, 0, 1.4];
const PILHAS_DEF: V3 = [5.0, 0, 1.0];
const PILHAS_OBR: V3 = [-0.4, 0, 4.0];
const MOEDAS6_Z = 5.3;
const BANCO: V3 = [5.6, 0, 5.0];
const PILHAS_DIV: V3 = [3.6, 0, 3.6];
const REGUA: V3 = [0, 0, 0];
const PLACAS: V3[] = [
  [-1.6, 0, 2.6],
  [1.6, 0, 2.6],
];
const CAIXA_Z = 0.9;
const PROF_PILHAS: V3 = [0, 0, 1.6];
const LISTA: V3 = [2.7, 0, 1.6];
const BALANCA: V3 = [-3.9, 0, -1.3];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const TCM: V3 = [0, 0, -3.6];
const CASAS: [V3, number][] = [
  [[-6.6, 0, -4.4], 0.9],
  [[-5.2, 0, -6.3], 0.6],
  [[-3.4, 0, -7.2], 0.4],
  [[7.4, 0, -3.4], -1.1],
];
const ARVORES: V3[] = [
  [-7.8, 0, 3.8],
  [-6.4, 0, 6.0],
  [6.6, 0, -4.8],
  [-1.4, 0, 8.2],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 10 milhões) ----------
// 110 pilhas no anel em volta do cofre (1,1 bilhão). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 30],
      [2.3, 30],
      [2.7, 24],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; acende2?: [number, number]};
const VOOS: Voo[] = [
  {n: 36.56, t: T.n366, centro: PILHAS_SAU, cols: 8, slots: 40, fim: T.educ},
  {n: 23.584, t: T.n236, centro: PILHAS_EDU, cols: 5, slots: 25, fim: T.adm},
  {n: 9.709, t: T.n97, centro: PILHAS_ADM, cols: 5, slots: 10, fim: T.camara},
  {n: 2.691, t: T.n27, centro: PILHAS_CAM, cols: 2, slots: 3, fim: T.ruas},
  {n: 1.328, t: T.todaSeg, centro: PILHAS_SEG, cols: 2, slots: 2, fim: T.ruas, acende2: [T.segPub, T.repara]},
  {n: 11.137, t: T.n111, centro: PILHAS_RUA, cols: 4, slots: 12, fim: T.asObras},
  {n: 4.415, t: T.n44, centro: PILHAS_BUS, cols: 3, slots: 6, fim: T.assist},
  {n: 2.742, t: T.n27b, centro: PILHAS_ASS, cols: 2, slots: 3, fim: T.segPub},
  {n: 1.357, t: T.n14, centro: PILHAS_CUL, cols: 2, slots: 2, fim: T.segPub},
  {n: 6.213, t: T.n62, centro: PILHAS_DIV, cols: 3, slots: 7, fim: T.maiorConta},
];
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
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

// as 21 pilhas da caixa do Fundef (208 mi), relativas ao centro da caixa
const DENTRO_CAIXA = grade([0, 0.08, 0], 21, 7, 0.28);

const caixaX = (t: number) => -6.6 + 4.0 * rampa(t, T.deUmaVez, T.deUmaVez + 1.1, sai) + 0.45 * rampa(t, T.inflou, T.inflou + 0.8) - 1.3 * rampa(t, T.semEle, T.semEle + 0.9);

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const fraco = mistura(ouro, tema.objeto, 0.45);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const afunda = 0.8 * rampa(t, T.maiorConta, T.maiorConta + 1.0);
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  // o anel e os voos
  if (t >= T.paraOnde - 0.1 && t < T.salarios + 1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.01, T.paraOnde + 0.5 + i * 0.01);
      const v = DO_VOO[i];
      let pos: V3 = p;
      let n = nasce;
      let k = 0;
      let corP = ouro;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.04;
        const kv = rampa(t, a, a + 0.7);
        pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        k = janela(t, voo.t, voo.fim, 0.4);
        if (voo.acende2) k = Math.max(k, janela(t, voo.acende2[0], voo.acende2[1], 0.4));
        // saúde: 7 de cada 10 (as primeiras 26 pilhas = hospital e atendimento especializado) acendem; o resto apaga
        if (v === 0 && t >= T.seteDe10) {
          const sep = rampa(t, T.seteDe10, T.seteDe10 + 0.6) * (1 - rampa(t, T.educ, T.educ + 0.4));
          corP = j < 26 ? mistura(ouro, tema.branco, 0.3 * sep) : mistura(ouro, tema.objeto, 0.45 * sep);
          k = 0;
        }
      }
      solidas.push({p: desce(pos), n, cor: k > 0 ? aceso(k) : corP});
    });
  }
  // fantasmas de 2024 da educação (249 mi): as 1,34 pilhas a mais ficam marsala e afundam
  const destEdu = ROTAS[1].dest;
  const someF = 1 - rampa(t, T.adm - 0.3, T.adm + 0.4);
  if (t >= T.n13 && someF > 0.01) {
    destEdu.forEach((p, j) => {
      const nasce = rampa(t, T.n13 + j * 0.03, T.n13 + 0.4 + j * 0.03);
      const total = j === 24 ? 0.917 : 1;
      if (j >= 23 && t >= T.aMenos) {
        const base = j === 23 ? 0.584 : 0;
        const d = 0.75 * rampa(t, T.aMenos + 0.3, T.aMenos + 1.5);
        solidas.push({p: [p[0], p[1] + base * 0.6 - d, p[2]], n: (total - base) * someF, cor: C.alerta});
      } else fantasmas.push({p, n: total * nasce * someF, cor: ouro});
    });
  }
  // ruas: das obras de infraestrutura previstas (128), saíram 36
  const someInf = 1 - rampa(t, T.curiosidade, T.curiosidade + 0.6);
  if (t >= T.previstas128 && someInf > 0.01) {
    const pos = grade(PILHAS_INF, 13, 5);
    fantasmas.push(...encher(pos, 12.765 * rampa(t, T.previstas128, T.previstas128 + 0.9) * someInf, ouro));
    if (t >= T.sairam) solidas.push(...encher(pos, 3.618 * rampa(t, T.sairam, T.sairam + 0.6) * someInf, aceso(janela(t, T.sairam, T.curiosidade, 0.4))));
  }
  // transporte: só 2 milhões (uma pilha fininha)
  const someTr = 1 - rampa(t, T.assist, T.assist + 0.5);
  if (t >= T.so2 && someTr > 0.01) solidas.push(...encher([PLACA_TR], 0.192 * rampa(t, T.so2, T.so2 + 0.4) * someTr, aceso(janela(t, T.so2, T.outraParte, 0.4))));
  // a Câmara inteira (cópia transparente ao lado das pilhas do ônibus)
  if (t >= T.camaraInteira && someTr > 0.01) fantasmas.push(...encher(grade(PILHAS_GHOST, 3, 2), 2.691 * rampa(t, T.camaraInteira, T.camaraInteira + 0.5) * someTr, ouro));
  // defesa civil: 71 milhões previstos, 105 mil gastos
  const someDef = 1 - rampa(t, T.somando + 0.4, T.somando + 1.0);
  if (t >= T.n71 && someDef > 0.01) {
    const pos = grade(PILHAS_DEF, 8, 4);
    const corF = t >= T.gastou105 ? mistura(ouro, C.alerta, rampa(t, T.gastou105 + 0.4, T.gastou105 + 1.0)) : ouro;
    fantasmas.push(...encher(pos, 7.095 * rampa(t, T.n71, T.n71 + 0.9) * someDef, corF));
    if (t >= T.gastou105) solidas.push({p: pos[0], n: 0.0105 * 10 * rampa(t, T.gastou105, T.gastou105 + 0.4) * someDef, cor: mistura(ouro, tema.acento, 0.6)});
  }
  // obras e equipamentos: 218 previstos, 33 gastos
  const someObr = 1 - rampa(t, T.maiorConta, T.maiorConta + 0.8);
  if (t >= T.n218 && someObr > 0.01) {
    const pos = grade(PILHAS_OBR, 22, 6);
    fantasmas.push(...encher(pos, 21.81 * rampa(t, T.n218, T.n218 + 1.0) * someObr, ouro));
    if (t >= T.n33) solidas.push(...encher(pos.map(desce), 3.3 * rampa(t, T.n33, T.n33 + 0.6), aceso(janela(t, T.n33, T.divida, 0.4))));
  }
  // a caixa do Fundef: 21 pilhas dentro; 4 delas (40 mi) vão para os professores
  const caixaK = rampa(t, T.deUmaVez - 0.2, T.deUmaVez + 0.3) * (1 - rampa(t, T.minimos, T.minimos + 0.6));
  if (t >= T.deUmaVez - 0.2 && caixaK > 0.01) {
    const cx = caixaX(t);
    const destProf = grade(PROF_PILHAS, 5, 5);
    DENTRO_CAIXA.forEach((d, j) => {
      const base: V3 = [cx + d[0], d[1], CAIXA_Z + d[2]];
      let pos = base;
      let n = (j === 20 ? 0.856 : 1) * rampa(t, T.n208 - 0.2 + j * 0.02, T.n208 + 0.3 + j * 0.02);
      let corP = ouro;
      if (j < 5) {
        const a = T.reserva + j * 0.06;
        const kv = rampa(t, a, a + 0.8);
        pos = curva(base, destProf[j], 1.0, kv);
        if (j === 4) n = n * (1 - 0.94 * kv);
        corP = aceso(janela(t, T.n40, T.minimos, 0.4));
      }
      solidas.push({p: pos, n: n * Math.min(1, caixaK * 1.2), cor: corP});
    });
  }
  return {solidas, fantasmas};
};

// os professores: duas fileiras de 12 de frente para a câmera
const agentesProfessores = (k: number): Agente[] => {
  if (k < 0.02) return [];
  const a: Agente[] = [];
  for (let i = 0; i < 24; i++) {
    const col = i % 12;
    const lin = Math.floor(i / 12);
    a.push({x: -2.6 + col * 0.47 + lin * 0.23, z: 3.0 + lin * 0.55, rot: 0, s: 0.6 * Math.min(1, k), fase: i * 0.7, anda: 0});
  }
  return a;
};

const MESES8 = ['1', '2', '3', '4', '5', '6', '7', '8'];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam meio metro na cena do teto, saem nos salários e voltam no fim
  const fora = Math.min(1, 0.18 * rampa(t, T.maiorConta, T.maiorConta + 0.8) + 0.82 * rampa(t, T.salarios, T.salarios + 1.0)) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.emQual + 0.6 + i * 0.25, FIM + 1, 0.4);
  // cofre: nasce com a maquete, abre em "para onde foi", sai nos salários
  const cofreK = rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.salarios, T.salarios + 0.9));
  // ruas
  const ruaK = predio(T.ruas);
  // ônibus e ponto
  const busK = vis(t, T.onibus - 0.6, T.somando);
  const busX = 4.6 - 3.0 * rampa(t, T.onibus - 0.6, T.onibus + 1.2, sai);
  const pontoK = predio(T.n44 - 0.2) * (1 - rampa(t, T.somando, T.somando + 0.6));
  const relK = vis(t, T.curiosidade + 0.4, T.assist);
  const placaTrK = vis(t, T.contaTr - 0.1, T.assist);
  // guarda
  const guardaK = vis(t, T.todaSeg - 0.2, T.maiorConta);
  // obra (material)
  const obraK = Math.max(vis(t, T.asObras - 0.1, T.curiosidade), vis(t, T.obrasEq - 0.1, T.maiorConta));
  // 3 moedas (1 de cada 3) e 6 moedas (nem 1 em cada 6)
  const m3K = vis(t, T.umDe3 - 0.1, T.seteDe10 + 0.2);
  const m6K = vis(t, T.nem1 - 0.1, T.divida + 0.3);
  // régua do teto
  const reguaK = rampa(t, T.salarios + 0.2, T.salarios + 1.4) * (1 - rampa(t, T.professores, T.professores + 1.0));
  const nivel = 57.02 * rampa(t, T.em2025 - 0.1, T.n57 + 0.3) - (57.02 - 44.36) * rampa(t, T.n44p - 0.5, T.n44p + 0.6) + (53.65 - 44.36) * rampa(t, T.nossas, T.perto54 + 0.3);
  const acima = Math.max(0, nivel - 54);
  const mesesK = vis(t, T.meses - 0.1, T.em2026);
  const placasK = (i: number) => entra(t, (i === 0 ? T.verbas : T.emprest) - 0.3, 0.45) * (1 - rampa(t, T.em2026, T.em2026 + 0.6));
  // caixa do Fundef
  const caixaK = rampa(t, T.deUmaVez - 0.2, T.deUmaVez + 0.3) * (1 - rampa(t, T.minimos, T.minimos + 0.6));
  const balK = vis(t, T.justica - 0.1, T.soPode + 0.6);
  // professores
  const profK = entra(t, T.professores, 0.5) * (1 - rampa(t, T.minimos, T.minimos + 0.6));
  const listaK = entra(t, T.lista - 0.1, 0.5) * (1 - rampa(t, T.minimos, T.minimos + 0.6));
  // copos
  const coposK = rampa(t, T.minimos + 0.3, T.minimos + 1.2) * (1 - rampa(t, T.emQual, T.emQual + 0.6));
  const nivelSau = 16.96 * rampa(t, T.saudeRec, T.n17 + 0.4);
  const nivelEdu = 25.77 * rampa(t, T.eduRec, T.eduRec + 1.4);
  const tcmK = rampa(t, T.tribunal - 0.3, T.tribunal + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 0.5));

  return (
    <group>
      <MesaMaquete tema={tema} />
      {/* fundo: casinhas, árvores e as pontes do rio Cachoeira */}
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}
      <PonteMini tema={tema} pos={[-1.2, 0, -7.6]} rotY={1.45} escala={0.55} />
      <PonteMini tema={tema} pos={[3.4, 0, -7.1]} rotY={1.75} escala={0.55} />

      {/* o cofre da prefeitura */}
      {cofreK > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - cofreK), COFRE[2]]} escala={0.75} abre={rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0)} trava={1 - rampa(t, T.paraOnde, T.paraOnde + 0.3)} brilho={0.3 * janela(t, T.paraOnde + 0.3, T.saude + 0.6)} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1500} />
      <PilhasDinheiro pilhas={fantasmas} max={700} opacidade={0.3} largura={1.12} />

      {/* cena 1 e 2: hospital e escola */}
      <PostoSaude tema={tema} pos={HOSP} rotY={0.24} escala={1.15} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.educ, 0.5), fim(0))} />
      <Escola tema={tema} pos={ESCOLA} rotY={1.26} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.adm, 0.5), fim(1))} />
      {m3K > 0.02
        ? [0, 1, 2].map((i) => {
            const k = entra(t, T.umDe3 + i * 0.08, 0.4) * m3K;
            const acesa = i === 0 ? rampa(t, T.umDe3 + 0.4, T.umDe3 + 0.8) : 0;
            return <Moeda key={i} tema={tema} pos={[MOEDAS3[0] - 0.66 + i * 0.66, 0.42 + 0.08 * acesa, MOEDAS3[2]]} rot={[Math.PI / 2, 0, 0]} r={0.3} escala={k} cor={mistura(tema.objeto, C.ouro, acesa)} brilho={0.3 * acesa} />;
          })
        : null}

      {/* cena 3: prefeitura, Câmara e guarda */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.39} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.camara, 0.5), fim(2))} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={-0.94} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.ruas, 0.5), fim(3))} />
      <PostoGuarda tema={tema} pos={GUARDA} rotY={-1.36} escala={0.85} sobe={predio(T.dobro)} aceso={Math.max(janela(t, T.todaSeg, T.ruas, 0.5), janela(t, T.segPub, T.repara, 0.4), fim(4))} />
      {guardaK > 0.02 ? (
        <Boneco tema={tema} pos={BONECO_G} rotY={-0.9} escala={0.5 * Math.min(1, guardaK)} cor={tema.objeto}>
          <Quepe tema={tema} />
        </Boneco>
      ) : null}

      {/* cena 4: a rua */}
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={ruaK} luz={Math.max(rampa(t, T.iluminacao - 0.2, T.iluminacao + 0.6) * (1 - rampa(t, T.curiosidade, T.curiosidade + 0.6)), fim(5))} caminhaoX={2.4 - 4.6 * rampa(t, T.limpeza - 0.4, T.limpeza + 4.0)} gariX={-1.8 + 0.22 * Math.max(0, t - T.ruas)} />
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK)}>
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} raio={0.03} cor={mistura(C.alerta, C.areia, 0.4)} position={[0, 0.17 + i * 0.22, 0]} />
          ))}
          {[0, 1].map((i) => (
            <Caixa key={i} args={[1.3, 0.06, 0.18]} raio={0.02} cor={C.madeira} position={[0.9, 0.1 + i * 0.07, 0.3 + i * 0.05]} rotation={[0, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[OBRA[0] - 0.9, 0.06, OBRA[2] - 0.5]} k={0.8 * obraK} />
      <Cone tema={tema} pos={[OBRA[0] + 0.3, 0.06, OBRA[2] - 0.9]} k={0.8 * obraK} />
      <RoloCompactador tema={tema} pos={[OBRA[0] - 1.4, 0.06, OBRA[2] + 0.2]} rotY={0.6} escala={0.32 * obraK} giro={t * 0.8} />

      {/* cena 5: o relatório, a placa do transporte, o ponto e o ônibus */}
      {relK > 0.02 ? (
        <group position={[MESA_REL[0], MESA_REL[1] - 0.8 * (1 - relK), MESA_REL[2]]}>
          <Caixa args={[2.6, 0.5, 1.7]} raio={0.05} cor={C.madeira} position={[0, 0.25, 0]} />
          <RelatorioPDF tema={tema} pos={[0, 0.5, 0]} titulo="RREO" sub="DEZ/2025" aceso={janela(t, T.outraParte, T.n44, 0.5)} abre={rampa(t, T.outraParte, T.outraParte + 0.9)} />
          <Lupa tema={tema} pos={[-0.5 + 0.9 * rampa(t, T.linha, T.coletivo + 0.6), 1.15, 0.15]} rot={[-1.1, 0, 0]} escala={0.5 * entra(t, T.linha - 0.2, 0.5)} />
        </group>
      ) : null}
      <PlacaProibido tema={tema} pos={PLACA_TR} rotY={0} texto="TRANSPORTE" escala={0.55 * placaTrK} x={0} />
      {pontoK > 0.02 ? (
        <group position={PONTO} rotation={[0, Math.PI / 2, 0]} scale={0.5}>
          <PontoOnibus tema={tema} pos={[0, 0, 0]} sobe={pontoK} aceso={janela(t, T.onibus, T.assist, 0.5)} />
        </group>
      ) : null}
      {pontoK > 0.02 ? <Caixa args={[4.8, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[1.6, 0.1 - 0.2 * (1 - pontoK), RUA_BUS_Z]} sombra={false} /> : null}
      {pontoK > 0.02
        ? [0, 1, 2].map((i) => {
            const sobeBus = rampa(t, T.onibus + 1.0 + i * 0.3, T.onibus + 1.6 + i * 0.3);
            const k = pontoK * (1 - sobeBus);
            return k > 0.02 ? <Boneco key={i} tema={tema} pos={[0.5 + i * 0.4 + 0.6 * sobeBus, 0.1, 5.25 + 0.4 * sobeBus]} rotY={Math.PI} escala={0.42 * k} cor={[tema.objeto, tema.objetoClaro, tema.pessoa][i]} /> : null;
          })
        : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}

      {/* cena 6: assistência, cultura e defesa civil */}
      <PredioAssistencia tema={tema} pos={ASSIST} rotY={1.1} escala={0.85} sobe={predio(T.assist)} aceso={Math.max(janela(t, T.assist, T.segPub, 0.5), fim(6))} />
      <TeatroMini tema={tema} pos={CULTURA} rotY={0.7} escala={0.85} sobe={predio(T.cultura)} aceso={Math.max(janela(t, T.cultura, T.segPub, 0.5), fim(7))} />
      <BaseDefesaCivil tema={tema} pos={DEFESA} rotY={-1.0} escala={0.85} sobe={predio(T.defesa)} aceso={Math.max(janela(t, T.defesa, T.somando, 0.5), fim(8))} />

      {/* cena 7: as 6 moedas e o prédio da dívida */}
      {m6K > 0.02
        ? Array.from({length: 6}).map((_, i) => {
            const k = entra(t, T.nem1 + i * 0.07, 0.4) * m6K;
            const enche = i === 0 ? 0.9 * rampa(t, T.nem1 + 0.5, T.nem1 + 1.0) : 0;
            return <Moeda key={i} tema={tema} pos={[-1.65 + i * 0.66, 0.42, MOEDAS6_Z]} rot={[Math.PI / 2, 0, 0]} r={0.3} escala={k} cor={mistura(tema.objeto, C.ouro, enche)} brilho={0.25 * enche} />;
          })
        : null}
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.7} escala={0.85} sobe={predio(T.divida)} aceso={Math.max(janela(t, T.divida, T.maiorConta, 0.5), fim(9))} />

      {/* cena 8: a régua do teto, o calendário de 8 meses e as duas placas */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={Math.min(54, nivel)} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />
      {reguaK > 0.02 && acima > 0.01 ? (
        <mesh position={[REGUA[0], REGUA[1] - 5.6 * (1 - reguaK) + 0.2 + yRegua(54) + yRegua(acima) / 2, REGUA[2]]}>
          <cylinderGeometry args={[0.505, 0.505, yRegua(acima), 40]} />
          <meshStandardMaterial color={C.alerta} emissive={C.alerta} emissiveIntensity={0.25} roughness={0.8} />
        </mesh>
      ) : null}
      {mesesK > 0.02
        ? MESES8.map((m, i) => {
            const k = entra(t, T.meses + i * 0.06, 0.35) * mesesK;
            const vira = rampa(t, T.cortar + i * 0.15, T.cortar + 0.35 + i * 0.15);
            return (
              <group key={m} position={[-1.75 + i * 0.5, 0.08, 2.0]} scale={k}>
                <group rotation={[-1.45 * vira, 0, 0]}>
                  <Caixa args={[0.44, 0.4, 0.06]} raio={0.02} cor={mistura(tema.objetoClaro, tema.objeto, 0.5 * vira)} position={[0, 0.22, 0]} />
                  <Placa tema={tema} pos={[0, 0.22, 0.035]} larg={0.42} alt={0.34} linhas={[{t: m, tam: 320, cor: tema.tinta, peso: 900}]} />
                </group>
              </group>
            );
          })
        : null}
      {['VERBAS', 'EMPRÉSTIMOS'].map((txt, i) => (
        <PlacaProibido key={txt} tema={tema} pos={PLACAS[i]} rotY={-PLACAS[i][0] * 0.12} texto={txt} escala={0.9 * placasK(i)} x={rampa(t, (i === 0 ? T.verbas : T.emprest) + 0.3, (i === 0 ? T.verbas : T.emprest) + 0.6)} />
      ))}

      {/* cena 9: a caixa do Fundef e a balança da Justiça */}
      <CaixaFundef tema={tema} pos={[caixaX(t), 0, CAIXA_Z]} escala={caixaK} tampa={rampa(t, T.n208 - 0.3, T.n208 + 0.4)} carimbo1={rampa(t, T.precatorio, T.precatorio + 0.5)} carimbo2={rampa(t, T.soPode, T.soPode + 0.5)} />
      <Balanca tema={tema} pos={BALANCA} escala={0.5 * balK} inclina={0.25 * Math.sin(Math.min(1, Math.max(0, (t - T.justica) / 1.6)) * Math.PI)} esq={null} dir={null} brilhoDir={0} brilhoEsq={0} />

      {/* cena 10: os professores e a lista */}
      <Multidao tema={tema} agentes={agentesProfessores(profK)} corCorpo={tema.pessoa} corMochila={tema.objetoClaro} mochila={false} />
      <ListaHabilitados tema={tema} pos={LISTA} rotY={-0.35} escala={0.9 * listaK} numero="2.236" />

      {/* cena 11: os copos dos mínimos e o TCM */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.saudeRec, T.saudeRec + 0.5)} nivel={nivelSau} acima={rampa(t, T.n17, T.n17 + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduRec, T.eduRec + 0.5)} nivel={nivelEdu} acima={rampa(t, T.eduRec + 1.0, T.eduRec + 1.6)} />
      <PredioTCM tema={tema} pos={TCM} sobe={tcmK} aceso={janela(t, T.tribunal, T.emQual, 0.5)} escala={0.95} />
      <Lupa tema={tema} pos={[-1.8 + 3.6 * rampa(t, T.tribunal + 0.3, T.tribunal + 1.6), 3.3, 0.3]} rot={[-1.1, 0, 0]} escala={0.6 * tcmK} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0.4], 18.5, 11.5, [0, 1.43, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.paraOnde - 0.3,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.3, E([0, 0, 0.4], 19, 12, [0, 1.43, 1])],
      [T.saude - 0.1, E([0, 0, 0], 17.5, 11, [0.05, 1.4, 1])],
      [T.saude + 0.7, E([-0.9, 0.9, -4.0], 6.4, 4.6, [0.35, 0.72, 1])],
      [T.hospital, E([-1.0, 0.9, -4.0], 6.0, 4.4, [0.2, 0.7, 1])],
      [T.educ - 0.3, E([-1.1, 0.9, -4.0], 5.8, 4.3, [0.12, 0.7, 1])],
    ],
  },
  {
    ini: T.educ - 0.2,
    arco: 0.04,
    chaves: [
      [T.educ - 0.2, E([-4.9, 0.8, -1.7], 6.0, 4.4, [0.55, 0.72, 1])],
      [T.adm - 0.3, E([-4.9, 0.8, -1.6], 5.6, 4.2, [0.75, 0.72, 1])],
    ],
  },
  {
    ini: T.adm - 0.2,
    arco: 0.04,
    chaves: [
      [T.adm - 0.2, E([2.1, 1.0, -4.3], 5.4, 4.2, [-0.1, 0.7, 1])],
      [T.camara - 0.2, E([2.5, 1.0, -4.0], 5.2, 4.0, [-0.3, 0.7, 1])],
      [T.camara + 0.5, E([4.6, 0.9, -2.2], 6.8, 4.8, [-0.55, 0.8, 1])],
      [T.ruas - 0.3, E([4.6, 0.9, -2.0], 6.4, 4.6, [-0.75, 0.8, 1])],
    ],
  },
  {
    ini: T.ruas - 0.1,
    arco: 0.04,
    chaves: [
      [T.ruas - 0.1, E([-3.3, 0.8, 4.1], 6.4, 4.4, [0.15, 0.62, 1])],
      [T.asObras - 0.2, E([-3.0, 0.8, 4.3], 6.0, 4.3, [0.3, 0.66, 1])],
      [T.asObras + 0.4, E([-2.2, 0.7, 5.2], 5.8, 4.1, [0.35, 0.72, 1])],
      [T.curiosidade - 0.3, E([-2.0, 0.7, 5.3], 5.2, 3.9, [0.45, 0.78, 1])],
    ],
  },
  {
    ini: T.curiosidade - 0.1,
    arco: 0.03,
    chaves: [
      [T.curiosidade - 0.1, E([0.5, 0.7, 3.9], 5.2, 3.9, [0.2, 0.75, 1])],
      [T.outraParte - 0.3, E([0.4, 0.7, 3.8], 4.8, 3.7, [0.3, 0.75, 1])],
      [T.outraParte + 0.3, E([0, 0.6, 7.4], 3.0, 2.4, [0, 1.5, 0.7])],
      [T.n44 - 0.2, E([0, 0.6, 7.4], 2.8, 2.2, [0.08, 1.5, 0.7])],
      [T.n44 + 0.5, E([1.7, 0.8, 4.8], 6.2, 4.4, [0.1, 0.62, 1])],
      [T.assist - 0.3, E([1.8, 0.8, 4.8], 5.8, 4.2, [0.25, 0.62, 1])],
    ],
  },
  {
    ini: T.assist - 0.1,
    arco: 0.04,
    chaves: [
      [T.assist - 0.1, E([-5.4, 0.9, -1.2], 8.4, 5.8, [0.7, 0.95, 1])],
      [T.segPub - 0.3, E([-5.2, 0.9, -1.4], 8.0, 5.6, [0.8, 0.95, 1])],
      [T.segPub + 0.3, E([4.6, 0.9, -0.8], 6.2, 4.4, [-0.6, 0.8, 1])],
      [T.repara + 0.4, E([5.6, 0.8, 1.2], 6.0, 4.3, [-0.55, 0.72, 1])],
      [T.somando - 0.3, E([5.6, 0.8, 1.2], 5.6, 4.1, [-0.45, 0.72, 1])],
    ],
  },
  {
    ini: T.somando - 0.1,
    arco: 0.04,
    chaves: [
      [T.somando - 0.1, E([0, 0, 0.6], 18, 11, [0, 1.4, 1])],
      [T.obrasEq + 0.3, E([-0.2, 0.8, 4.4], 6.4, 4.6, [0.1, 0.85, 1])],
      [T.divida - 0.2, E([0.4, 0.8, 4.6], 6.4, 4.6, [0.15, 0.85, 1])],
      [T.divida + 0.5, E([2.2, 0.8, 4.4], 7.6, 5.2, [-0.25, 0.8, 1])],
      [T.maiorConta - 0.3, E([2.3, 0.8, 4.4], 7.2, 5.0, [-0.35, 0.8, 1])],
    ],
  },
  {
    ini: T.maiorConta - 0.1,
    arco: 0.04,
    chaves: [
      [T.maiorConta - 0.1, E([0, 1.0, 1.0], 10, 7, [0, 1.0, 1])],
      [T.salarios + 0.6, E([0, 2.6, 0], 3.6, 6.4, [0, 0.3, 1])],
      [T.em2025, E([0, 2.9, 0], 3.4, 6.0, [0.05, 0.28, 1])],
      [T.n57 - 0.3, E([0, 4.7, 0], 2.6, 2.4, [0.05, 0.22, 1])],
      [T.passou + 0.6, E([0, 4.7, 0], 2.6, 2.4, [0.1, 0.22, 1])],
      [T.meses, E([0, 1.6, 1.6], 6.4, 4.6, [0, 0.47, 1])],
      [T.em2026 - 0.2, E([0, 1.6, 1.6], 6.0, 4.4, [0.05, 0.47, 1])],
    ],
  },
  {
    ini: T.em2026 - 0.1,
    arco: 0.04,
    chaves: [
      [T.em2026 - 0.1, E([0, 2.8, 0], 3.6, 6.2, [0.1, 0.3, 1])],
      [T.deUmaVez - 0.4, E([0, 2.6, 0.2], 3.8, 6.0, [0.0, 0.3, 1])],
      [T.deUmaVez + 0.5, E([-2.0, 1.2, 0.6], 6.6, 4.6, [-0.2, 0.55, 1])],
      [T.soPode + 0.2, E([-1.6, 1.3, 0.6], 6.6, 4.8, [-0.1, 0.5, 1])],
      [T.inflou + 0.4, E([-1.0, 2.1, 0.5], 7.0, 5.8, [-0.05, 0.4, 1])],
      [T.perto54 - 0.5, E([-0.9, 2.2, 0.5], 6.8, 5.6, [0.05, 0.4, 1])],
      [T.perto54 + 0.4, E([0, 4.4, 0], 2.4, 2.2, [0.05, 0.22, 1])],
      [T.professores - 0.2, E([0, 4.4, 0], 2.3, 2.1, [0.1, 0.22, 1])],
    ],
  },
  {
    ini: T.professores - 0.1,
    arco: 0.05,
    chaves: [
      [T.professores - 0.1, E([0.2, 0.9, 2.4], 7.4, 5.0, [0, 0.8, 1])],
      [T.lista, E([0.6, 0.9, 2.3], 7.0, 4.8, [0.2, 0.8, 1])],
      [T.minimos - 0.2, E([0.7, 0.9, 2.3], 6.6, 4.6, [0.3, 0.8, 1])],
    ],
  },
  {
    ini: T.minimos - 0.1,
    arco: 0.04,
    chaves: [
      [T.minimos - 0.1, E([0, 1.3, 0], 6.4, 4.2, [0, 0.4, 1])],
      [T.saudeRec, E([-1.8, 1.3, 0], 3.6, 3.4, [0.1, 0.36, 1])],
      [T.eduRec - 0.4, E([-1.6, 1.3, 0], 3.4, 3.3, [0.15, 0.36, 1])],
      [T.eduRec + 0.3, E([1.8, 1.3, 0], 3.6, 3.4, [-0.1, 0.36, 1])],
      [T.tribunal - 0.4, E([0, 1.7, -1.0], 8, 5.6, [0, 0.58, 1])],
      [T.emQual - 0.2, E([0, 1.9, -1.0], 8.4, 6, [0.05, 0.62, 1])],
    ],
  },
  {
    ini: T.emQual,
    chaves: [
      [T.emQual, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
      [FIM, E([0, 0, 0], 19, 11.5, [0.3, 1.35, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.paraOnde + 0.3, b: T.saude, texto: 'GASTOS DE 2025: R$ 1,1 BILHÃO'},
  {a: T.maiorFatia, b: T.umDe3, texto: 'A MAIOR FATIA'},
  {a: T.umDe3, b: T.seteDe10, texto: '1 DE CADA 3 REAIS', destaque: true},
  {a: T.seteDe10, b: T.educ, texto: '7 DE CADA 10 REAIS DA SAÚDE: HOSPITAL'},
  {a: T.aMenos, b: T.adm, texto: '13 MILHÕES A MENOS QUE EM 2024', destaque: true},
  {a: T.adm, b: T.camara, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.camara, b: T.dobro, texto: 'CÂMARA DE VEREADORES'},
  {a: T.dobro, b: T.ruas, texto: 'O DOBRO DA SEGURANÇA PÚBLICA', destaque: true},
  {a: T.ruas, b: T.limpeza, texto: 'RUAS E SERVIÇOS DA CIDADE'},
  {a: T.limpeza, b: T.asObras, texto: 'LIMPEZA, ILUMINAÇÃO E MANUTENÇÃO'},
  {a: T.asObras, b: T.sairam, texto: 'OBRAS DE INFRAESTRUTURA: PREVISTO × GASTO'},
  {a: T.curiosidade, b: T.contaTr, texto: 'AGORA UMA CURIOSIDADE'},
  {a: T.contaTr, b: T.outraParte, texto: 'NA CONTA DO TRANSPORTE: SÓ 2 MI'},
  {a: T.onibus, b: T.camaraInteira, texto: 'DINHEIRO PARA O ÔNIBUS DA CIDADE', destaque: true},
  {a: T.camaraInteira, b: T.assist, texto: 'MAIS DO QUE A CÂMARA INTEIRA'},
  {a: T.repara, b: T.defesa, texto: 'E REPARA'},
  {a: T.gastou105, b: T.somando, texto: 'PREVISTO 71 MI · GASTO 105 MIL', destaque: true},
  {a: T.somando, b: T.obrasEq, texto: 'SOMANDO TODAS AS ÁREAS'},
  {a: T.obrasEq, b: T.nem1, texto: 'OBRAS E EQUIPAMENTOS'},
  {a: T.nem1, b: T.divida, texto: 'NEM 1 REAL EM CADA 6', destaque: true},
  {a: T.quaseDobro, b: T.maiorConta, texto: 'DÍVIDA: QUASE O DOBRO DAS OBRAS', destaque: true},
  {a: T.maiorConta, b: T.lrf, texto: 'A MAIOR CONTA: OS SALÁRIOS'},
  {a: T.lrf, b: T.receita, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.receita, b: T.n57, texto: 'GASTO COM PESSOAL ÷ RECEITA'},
  {a: T.passou, b: T.meses, texto: 'PASSOU DO TETO', destaque: true},
  {a: T.meses, b: T.verbas, texto: '8 MESES PARA CORTAR O EXCESSO'},
  {a: T.verbas, b: T.emprest, texto: 'SEM VERBAS EXTRAS DO GOVERNO'},
  {a: T.emprest, b: T.em2026, texto: 'SEM NOVOS EMPRÉSTIMOS'},
  {a: T.em2026, b: T.n44p, texto: '2026 (12 MESES ATÉ AGOSTO)'},
  {a: T.parece, b: T.naoBem, texto: 'PARECE RESOLVIDO?'},
  {a: T.fevereiro, b: T.n208, texto: 'FEVEREIRO DE 2026'},
  {a: T.precatorio, b: T.justica, texto: 'PRECATÓRIO DO FUNDEF', destaque: true},
  {a: T.justica, b: T.soPode, texto: 'DÍVIDA DA UNIÃO COM A EDUCAÇÃO DE ITABUNA'},
  {a: T.soPode, b: T.inflou, texto: 'SÓ PODE IR PARA O ENSINO', destaque: true},
  {a: T.inflou, b: T.semEle, texto: 'A RECEITA CRESCEU, A PORCENTAGEM CAIU'},
  {a: T.semEle, b: T.perto54, texto: 'SEM O FUNDEF...'},
  {a: T.colado, b: T.professores, texto: 'COLADO NO TETO', destaque: true},
  {a: T.lista, b: T.categoria, texto: 'LISTA PUBLICADA EM 21/09/2026'},
  {a: T.categoria, b: T.semData, texto: 'A CATEGORIA PAROU PARA COBRAR'},
  {a: T.semData, b: T.minimos, texto: 'ATÉ A ÚLTIMA NOTÍCIA: SEM DATA', destaque: true},
  {a: T.minimos, b: T.saudeRec, texto: 'OS MÍNIMOS DA LEI'},
  {a: T.saudeRec, b: T.eduRec, texto: 'SAÚDE: MÍNIMO DE 15% DOS IMPOSTOS'},
  {a: T.eduRec, b: T.tribunal, texto: 'EDUCAÇÃO: MÍNIMO DE 25%'},
  {a: T.tribunal, b: T.emQual, texto: 'QUEM JULGA: TCM-BA'},
];
const SELOS: Txt[] = [
  {a: T.bilhao, b: T.federal, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE ITABUNA · P. 3'},
  {a: T.federal, b: T.paraOnde, texto: 'FONTE: RREO DEZ/2025 · P. 1 (RECEITAS)'},
  {a: T.n366, b: T.ruas, texto: 'FONTE: RREO DEZ/2025 · P. 6 E 7 (2024: RREO DEZ/2024 · P. 7)'},
  {a: T.n111, b: T.curiosidade, texto: 'FONTE: RREO DEZ/2025 · P. 7 (URBANISMO)'},
  {a: T.contaTr, b: T.assist, texto: 'FONTE: RREO DEZ/2025 · P. 8 · ENCARGOS ESPECIAIS', destaque: true},
  {a: T.assist, b: T.defesa, texto: 'FONTE: RREO DEZ/2025 · P. 6 E 7'},
  {a: T.defesa, b: T.obrasEq, texto: 'FONTE: RREO DEZ/2025 · P. 6 (PREVISTO × GASTO)'},
  {a: T.obrasEq, b: T.teto, texto: 'FONTE: RREO DEZ/2025 · P. 3 (INVESTIMENTOS, JUROS E AMORTIZAÇÃO)'},
  {a: T.teto, b: T.n44p, texto: 'FONTE: RGF DEZ/2025 · P. 1 · LRF, ART. 20 E 23'},
  {a: T.n44p, b: T.n208, texto: 'FONTE: RGF AGO/2026 · P. 1'},
  {a: T.n208, b: T.nossas, texto: 'FONTE: RREO AGO/2026 · P. 10 (FEV/26) · EC 114/2021'},
  {a: T.nossas, b: T.professores, texto: 'CONTA DO VÍDEO: 532,7 ÷ (1.200,7 − 208) = 53,7%', destaque: true},
  {a: T.n40, b: T.minimos, texto: 'FONTE: LEI MUNICIPAL 2.163/2026 · EDITAL 03/2026 (DOM 21/09)'},
  {a: T.minimos, b: T.emQual, texto: 'FONTE: RREO DEZ/2025 · P. 41 E 42'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n366, b: T.educ, p: soma(PILHAS_SAU, [0.4, 0.9, 0.6]), valor: '366 MI', sub: 'R$ 365,60 MI · SAÚDE', cor: 'acento'},
  {a: T.hospital, b: T.educ, p: soma(PILHAS_SAU, [-0.8, 0.9, -0.4]), valor: '259 MI', sub: 'HOSPITAL E ATENDIMENTO ESPECIALIZADO', dy: 40},
  {a: T.n236, b: T.adm, p: soma(PILHAS_EDU, [0, 0.9, 0.6]), valor: '236 MI', sub: 'R$ 235,84 MI · 2025', cor: 'acento'},
  {a: T.n13 + 0.4, b: T.adm, p: soma(PILHAS_EDU, [0, 0.9, -0.8]), valor: '2024: 249 MI', sub: 'R$ 249,17 MI', dy: 40},
  {a: T.aMenos, b: T.adm, p: soma(PILHAS_EDU, [0.8, 0.2, -0.8]), valor: '−13 MI', cor: 'alerta', dy: -60},
  {a: T.n97, b: T.camara, p: soma(PILHAS_ADM, [0, 0.9, 0.3]), valor: '97 MI', sub: 'R$ 97,09 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.n27, b: T.ruas, p: soma(PILHAS_CAM, [0, 0.9, 0]), valor: '27 MI', sub: 'R$ 26,91 MI · CÂMARA', cor: 'acento'},
  {a: T.todaSeg, b: T.ruas, p: soma(PILHAS_SEG, [0, 0.9, 0]), valor: '13 MI', sub: 'R$ 13,28 MI · SEGURANÇA'},
  {a: T.n111, b: T.asObras, p: soma(PILHAS_RUA, [0, 0.9, 0]), valor: '111 MI', sub: 'R$ 111,37 MI · URBANISMO', cor: 'acento'},
  {a: T.manutencao, b: T.asObras, p: soma(PILHAS_RUA, [0, 0.9, 0]), valor: '67 MI', sub: 'LIMPEZA, LUZ E MANUTENÇÃO', dy: 110},
  {a: T.previstas128 + 0.3, b: T.curiosidade, p: soma(PILHAS_INF, [0, 0.9, -0.3]), valor: 'PREVISTO: 128 MI', sub: 'INFRAESTRUTURA URBANA'},
  {a: T.sairam, b: T.curiosidade, p: soma(PILHAS_INF, [0, 0.7, 0.4]), valor: '36 MI', sub: 'R$ 36,18 MI · GASTO', cor: 'acento', dy: -80},
  {a: T.so2, b: T.outraParte, p: soma(PLACA_TR, [0, 0.4, 0.3]), valor: '2 MI', sub: 'R$ 1,92 MI · TRANSPORTE', cor: 'acento'},
  {a: T.n44, b: T.assist, p: soma(PILHAS_BUS, [0, 0.9, 0]), valor: '44 MI', sub: 'R$ 44,15 MI · ÔNIBUS', cor: 'acento'},
  {a: T.camaraInteira, b: T.assist, p: soma(PILHAS_GHOST, [0, 0.9, 0]), valor: '27 MI', sub: 'CÂMARA', dy: -10},
  {a: T.n27b, b: T.segPub, p: soma(PILHAS_ASS, [0, 0.9, 0]), valor: '27 MI', sub: 'R$ 27,42 MI · ASSISTÊNCIA', cor: 'acento'},
  {a: T.n14, b: T.segPub, p: soma(PILHAS_CUL, [0, 0.9, 0]), valor: '14 MI', sub: 'R$ 13,57 MI · CULTURA', cor: 'acento'},
  {a: T.segPub, b: T.repara, p: soma(PILHAS_SEG, [0, 0.9, 0]), valor: '13 MI', sub: 'R$ 13,28 MI · SEGURANÇA', cor: 'acento'},
  {a: T.n71, b: T.somando, p: soma(PILHAS_DEF, [0, 0.9, -0.2]), valor: 'PREVISTO: 71 MI', sub: 'DEFESA CIVIL'},
  {a: T.gastou105, b: T.somando, p: soma(PILHAS_DEF, [-0.6, 0.4, 0.4]), valor: '105 MIL', sub: 'R$ 105.292 · GASTO', cor: 'acento', dy: -80},
  {a: T.n218, b: T.maiorConta, p: soma(PILHAS_OBR, [0, 0.9, -0.4]), valor: 'PREVISTO: 218 MI', sub: 'OBRAS E EQUIPAMENTOS'},
  {a: T.n33, b: T.maiorConta, p: soma(PILHAS_OBR, [-0.8, 0.6, 0.5]), valor: '33 MI', sub: 'R$ 33,00 MI · GASTO', cor: 'acento', dy: -90},
  {a: T.n62, b: T.maiorConta, p: soma(PILHAS_DIV, [0, 0.9, 0]), valor: '62 MI', sub: 'R$ 62,13 MI · JUROS + PARCELAS', cor: 'acento'},
  {a: T.n54, b: T.n57 - 0.4, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.n208, b: T.professores, p: [-3.0, 1.4, CAIXA_Z], valor: '208 MI', sub: 'PRECATÓRIO DO FUNDEF', dy: 20},
  {a: T.n40, b: T.minimos, p: soma(PROF_PILHAS, [0, 0.9, 0]), valor: '40 MI', sub: 'PARA OS PROFESSORES', cor: 'acento'},
  {a: T.n17, b: T.eduRec, p: soma(COPO_SAU, [0, yCopo(17) + 0.3, 0.6]), valor: '17%', sub: 'RREO: 16,96% · MÍNIMO 15%', cor: 'acento'},
  {a: T.eduRec + 0.9, b: T.emQual, p: soma(COPO_EDU, [0, yCopo(25.8) + 0.3, 0.6]), valor: '25,8%', sub: 'RREO: 25,77% · MÍNIMO 25%', cor: 'acento'},
];

// a página 8 do RREO, aberta (2D, para dar para ler)
const LINHAS_P8: {nome: string; valor: string; acende?: number}[] = [
  {nome: 'TRANSPORTES (FISCALIZAÇÃO)', valor: '1.920.756,75'},
  {nome: 'DESPORTO E LAZER', valor: '2.282.728,83'},
  {nome: 'ENCARGOS ESPECIAIS', valor: '119.098.184,20', acende: T.linha},
  {nome: '   TRANSPORTES COLETIVOS URBANOS', valor: '44.151.090,55', acende: T.coletivo},
  {nome: '   SERVIÇO DA DÍVIDA INTERNA', valor: '60.887.126,23'},
  {nome: '   OUTROS ENCARGOS ESPECIAIS', valor: '14.059.967,42'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.maiorConta);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div
            style={{
              padding: '9px 16px',
              borderRadius: 11,
              background: tema.cartao,
              border: `2px solid ${seloAtual.destaque ? tema.acento : tema.cartaoBorda}`,
              fontFamily: MONO,
              fontSize: seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: tema.texto,
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
  if (noMapa(t)) return <>{cabecalho}</>;
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 190, Math.min(SEGURO.botoesX - 190, pj.x)), y: Math.max(640, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // rótulos que se encostam: um embaixo do outro (o mais antigo em cima)
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const sinal = (txt: string, p: V3, k: number, corS: string) => {
    if (k <= 0.01) return null;
    const pj = projetar(p, cam, W, H);
    return (
      <div style={{position: 'absolute', left: pj.x, top: pj.y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, opacity: Math.min(1, k), fontFamily: FONTE, fontSize: 120, fontWeight: 900, color: corS, textShadow: `0 4px 18px ${tema.fundo}`}}>
        {txt}
      </div>
    );
  };
  // números grandes da régua
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n57K = entra(t, T.n57, 0.5) * (1 - rampa(t, T.em2026 - 0.3, T.em2026));
  const n44K = entra(t, T.n44p + 0.3, 0.5) * (1 - rampa(t, T.nossas - 0.3, T.nossas));
  const n537K = entra(t, T.perto54, 0.5) * (1 - rampa(t, T.professores - 0.3, T.professores));
  // a página 8
  const pagK = entra(t, T.outraParte + 0.5, 0.5) * (1 - rampa(t, T.n44 + 0.6, T.n44 + 1.0));
  const pagina8 =
    pagK > 0.01 ? (
      <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.dir + 10, top: 600, opacity: Math.min(1, pagK), transform: `translateY(${(1 - Math.min(1, pagK)) * 24}px)`}}>
        <div style={{background: mistura(tema.branco, tema.objetoClaro, 0.3), borderRadius: 14, padding: '18px 22px', boxShadow: `0 10px 30px ${tema.fundo}`}}>
          <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: tema.tinta}}>RREO DEZ/2025 · ANEXO 2 · P. 8</div>
          <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 1, color: mistura(tema.tinta, tema.branco, 0.4), marginBottom: 10}}>FUNÇÃO / SUBFUNÇÃO · DESPESAS LIQUIDADAS (R$)</div>
          {LINHAS_P8.map((l, i) => {
            const k = l.acende !== undefined ? rampa(t, l.acende, l.acende + 0.4) : 0;
            return (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 8, background: k > 0 ? mistura(mistura(tema.branco, tema.objetoClaro, 0.3), tema.acento, 0.45 * k) : 'transparent', fontFamily: MONO, fontSize: 21, fontWeight: l.acende !== undefined ? 800 : 600, color: tema.tinta, whiteSpace: 'pre'}}>
                <span>{l.nome}</span>
                <span>{l.valor}</span>
              </div>
            );
          })}
        </div>
      </div>
    ) : null;
  const comentaK = vis(t, T.gastarMais, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {sinal('2×', soma(PILHAS_CAM, [0.6, 1.6, 0.8]), vis(t, T.dobro + 0.2, T.ruas), tema.texto)}
      {numeroGrande('57%', 'GASTO COM PESSOAL · 2025', n57K, tema.acento)}
      {numeroGrande('44%', '12 MESES ATÉ AGO/2026', n44K, tema.acento)}
      {numeroGrande('53,7%', 'SEM O FUNDEF · CONTA DO VÍDEO', n537K, tema.acento)}
      {pagina8}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>QUAL ÁREA PRECISA DE MAIS?</div>
            <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: rampa(t, T.comentarios, T.comentarios + 0.4)}}>COMENTA AQUI</div>
            {t >= T.segue ? <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 900, letterSpacing: -1, color: tema.acento, marginTop: 10, opacity: rampa(t, T.segue + 0.4, T.segue + 0.9)}}>@eumagnoleite</div> : null}
          </div>
        </div>
      ) : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itabuna.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.15}));
  // mapa
  s.push({t: T.bilhao + 0.7, f: 'pop', v: 0.22});
  s.push({t: T.abri, f: 'pop', v: 0.16});
  [T.n543, quando('127'), quando('108'), quando('169')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: quando('triplo'), f: 'ding', v: 0.18});
  // pilhas que deslizam: pop baixinho
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.04 + 0.6, f: 'pop', v: 0.08});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n366, T.n236, T.n97, T.n27, T.todaSeg, T.n111, T.so2, T.n44, T.n27b, T.n14, T.n62, T.n40].forEach((t) => s.push({t, f: 'pop', v: 0.22}));
  s.push({t: T.umDe3 + 0.4, f: 'pop', v: 0.18});
  s.push({t: T.aMenos + 0.4, f: 'baque', v: 0.26});
  s.push({t: T.previstas128, f: 'subida', v: 0.14});
  s.push({t: T.sairam + 0.2, f: 'pop', v: 0.2});
  s.push({t: T.linha, f: 'bip', v: 0.16});
  s.push({t: T.coletivo, f: 'bip', v: 0.18});
  s.push({t: T.n71, f: 'subida', v: 0.14});
  s.push({t: T.gastou105 + 0.3, f: 'baque', v: 0.24});
  s.push({t: T.n218, f: 'subida', v: 0.14});
  s.push({t: T.n33, f: 'pop', v: 0.2});
  for (let i = 0; i < 6; i++) s.push({t: T.nem1 + i * 0.07, f: 'pop', v: 0.07});
  s.push({t: T.quaseDobro, f: 'baque', v: 0.2});
  // teto
  s.push({t: T.salarios + 0.2, f: 'subida', v: 0.2});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.em2025, f: 'subida', v: 0.24});
  s.push({t: T.n57, f: 'baque', v: 0.26});
  for (let i = 0; i < 8; i++) s.push({t: T.cortar + i * 0.15, f: 'pop', v: 0.06});
  [T.verbas, T.emprest].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.22}));
  // Fundef
  s.push({t: T.n44p - 0.4, f: 'subida', v: 0.16});
  s.push({t: T.deUmaVez, f: 'whoosh', v: 0.16});
  s.push({t: T.n208, f: 'pop', v: 0.24});
  s.push({t: T.precatorio + 0.1, f: 'impacto', v: 0.2});
  s.push({t: T.soPode + 0.1, f: 'impacto', v: 0.2});
  s.push({t: T.nossas, f: 'subida', v: 0.2});
  s.push({t: T.perto54, f: 'baque', v: 0.22});
  // professores
  s.push({t: T.professores, f: 'pop', v: 0.18});
  s.push({t: T.n2236, f: 'pop', v: 0.2});
  // mínimos
  s.push({t: T.minimos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.n17, f: 'ding', v: 0.22});
  s.push({t: T.eduRec + 1.0, f: 'ding', v: 0.2});
  s.push({t: T.tribunal, f: 'subida', v: 0.16});
  // fim
  for (let i = 0; i < 10; i++) s.push({t: T.emQual + 0.6 + i * 0.25, f: 'bip', v: 0.08});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, 2.6, 5.0, 11.2, 16.5, 21.0, 24.2, T.paraOnde + 0.6, T.n366 + 1.0, T.umDe3 + 0.6, T.hospital + 0.6, T.n236 + 1.0, T.aMenos + 0.8, T.n97 + 0.8, T.n27 + 0.6, T.todaSeg + 0.6,
  T.n111 + 0.8, T.manutencao + 0.5, T.previstas128 + 1.0, T.sairam + 0.6, T.so2 + 0.5, T.outraParte + 1.2, T.coletivo + 0.6, T.n44 + 1.0, T.onibus + 1.0, T.camaraInteira + 0.5,
  T.n27b + 0.6, T.n14 + 0.4, T.segPub + 0.6, T.n71 + 0.8, T.gastou105 + 1.0, T.somando + 0.4, T.n218 + 1.0, T.n33 + 0.6, T.nem1 + 0.8, T.n62 + 0.8, T.quaseDobro + 0.4,
  T.salarios + 1.2, T.n54 + 0.4, T.n57 + 0.6, T.meses + 0.6, T.cortar + 1.0, T.emprest + 0.5, T.n44p + 0.8, T.n208 + 0.6, T.justica + 0.6, T.soPode + 0.8, T.inflou + 0.8,
  T.nossas + 0.6, T.perto54 + 0.8, T.reserva + 1.2, T.n2236 + 0.8, T.semData + 0.4, T.n17 + 0.6, T.eduRec + 1.4, T.tribunal + 1.0, T.emQual + 1.2, T.comentarios + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItabuna: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Itabuna" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['1,1 bilhão.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoItabuna: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE ITABUNA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
