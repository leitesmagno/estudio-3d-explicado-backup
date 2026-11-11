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
import {ArvoreRedonda, CasaMini, CofreFGTS, Cone, Onibus, RoloCompactador} from '../../pecas';
import {
  BancoDivida,
  CaixoteDemissao,
  CamaraVereadores,
  Coqueiro,
  CopoPiso,
  Escola,
  EstacaoSaneamento,
  LojaServicos,
  LoteVazio,
  MesaMaquete,
  PilhasDinheiro,
  PlacaProibido,
  PonteMini,
  PostoSaude,
  PredioAssistencia,
  Prefeitura,
  QuadraMini,
  QuiosqueTurismo,
  RelatorioEmPe,
  ReguaLimite,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from './pecas';
import {PALAVRAS} from './palavras';

// 021. orçamento de una (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda de Una (mesma série do 014 e do 017: cofre da prefeitura no meio,
// 1 pilha = R$ 1 milhão, o mar na borda da direita e o rio Una) e encaixa os dois trechos de mapa do Kit Mapas
// (projetos/021.../mapas/una.mp4, composição OrcamentoUna do kit), seguidos, com o MESMO relógio.
// Todo número vem dos documentos do município de Una (portal da transparência e Tesouro), com selo de documento e página.
// Neutro: sem nome de prefeito nem partido. Nenhum número de outra cidade.
// Plano: projetos/021. orçamento de una/plano.md (versão 1, aprovada em 04/11/2026).

export const FPS = 30;
const AUDIO_SEG = 170.38;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '021. orçamento de una';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  n132: quando('132'),
  abri: quando('abri as contas'),
  primeiro: quando('Primeiro, de onde'),
  federal: quando('governo federal'),
  n72: quando('72'),
  fpm: quando('FPM'),
  n43: quando('43'),
  n11: quando('O estado mandou'),
  n24: quando('mais 24'),
  // cena 1
  impostos: quando('E os impostos'),
  propria: quando('propria cidade', 2),
  n23: quando('So 23') + 0.2,
  iss: quando('ISS'),
  servicos: quando('imposto sobre'),
  iptu: quando('IPTU'),
  casa: quando('imposto da casa'),
  n693: quando('693'),
  n38: quando('38 reais'),
  // cena 2
  previa: quando('O orcamento previa'),
  n124: quando('124'),
  entrou: quando('Entrou mais'),
  n7300: quando('7.300'),
  // cena 3
  paraOnde: quando('Segundo, para onde'),
  maiorMenor: quando('maior para o menor'),
  educ: quando('Educacao: 59'),
  n59: quando('Educacao: 59') + 0.7,
  metade: quando('Quase metade'),
  tresDe4: quando('3 de cada 4'),
  saude: quando('Saude: 31'),
  n31: quando('Saude: 31') + 0.7,
  posto: quando('posto de saude'),
  n148: quando('tinha 14,8'),
  g104: quando('Gastou 10,4'),
  admSau: quando('administracao da saude'),
  n62: quando('tinha 6,2'),
  g133: quando('Gastou 13,3'),
  dobro: quando('Mais que o dobro'),
  adm: quando('Administracao da prefeitura'),
  n22: quando('prefeitura: 22'),
  san: quando('Saneamento'),
  n5: quando('Saneamento: 5') + 0.7,
  camara: quando('Camara de Vereadores'),
  n38c: quando('Vereadores: 3,8'),
  maisToda: quando('Mais que toda'),
  assist: quando('assistencia social'),
  n32: quando('social: 3,2'),
  turismo: quando('Turismo'),
  n23t: quando('Turismo: 2,3'),
  transp: quando('Transporte'),
  n12: quando('Transporte: 1,2'),
  n56: quando('56 mil'),
  vinte: quando('Vinte vezes'),
  esporte: quando('Esporte'),
  n100: quando('menos de 100'),
  zero: quando('ficou no zero'),
  infra: quando('obras de infraestrutura'),
  hab: quando('habitacao'),
  meio: quando('meio ambiente'),
  obrasEq: quando('obras e equipamentos'),
  n29: quando('foram 2,9'),
  so2: quando('So 2'),
  divida: quando('A divida'),
  n43d: quando('mais: 4,3'),
  // cena 4
  salarios: quando('Terceiro, os salarios'),
  maiorConta: quando('maior conta'),
  de3: quando('De cada 3'),
  dois: quando('2 foram'),
  lrf: quando('Lei de Responsabilidade'),
  teto: quando('um teto'),
  n54: quando('maximo 54%'),
  receita: quando('da receita'),
  anoAno: quando('Acompanha ano'),
  a2024: quando('2024'),
  n59p: quando('2024: 59%') + 1.0,
  acima1: quando('Acima do teto'),
  a2025: quando('2025', 2),
  n5435: quando('2025: 54,35%') + 1.2,
  porPouco: quando('por pouco'),
  tirou: quando('o relatorio tirou'),
  n16: quando('16 milhoes'),
  indeniz: quando('indenizacao por demissao'),
  permite: quando('A lei permite'),
  em2024: quando('Em 2024, essa'),
  linhaZero: quando('linha era zero'),
  semDesc: quando('Sem o desconto'),
  nossas: quando('pelas nossas contas'),
  n67: quando('seriam 67%') + 0.3,
  // cena 5
  a2026: quando('2026'),
  enviado: quando('relatorio enviado'),
  n56p: quando('mostra 56%') + 0.3,
  semDem: quando('sem desconto de demissao'),
  acima2: quando('Acima do teto', 2),
  portal: quando('relatorio do portal'),
  mesmo: quando('mesmo periodo'),
  junta: quando('junta prefeitura'),
  n42: quando('mostra 42%') + 0.2,
  com22: quando('Com 22'),
  duas: quando('Duas perguntas'),
  q1: quando('que demissoes'),
  q2: quando('qual numero vale'),
  // cena 6
  importa: quando('Isso importa'),
  meses: quando('8 meses'),
  cortar: quando('cortar o excesso'),
  verbas: quando('verbas extras'),
  // cena 7
  cumprido: quando('O que foi cumprido'),
  n22p: quando('recebeu 22%'),
  min15: quando('minimo e 15'),
  edu31: quando('A educacao, 31%'),
  min25: quando('minimo e 25'),
  // fim
  emQual: quando('Em qual dessas'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'UNA · BAHIA'],
  [T.primeiro, 'DE ONDE VEIO'],
  [T.impostos, 'IMPOSTOS DA CIDADE'],
  [T.previa, 'O PLANO'],
  [T.paraOnde, 'PARA ONDE FOI'],
  [T.zero, 'O QUE FICOU NO ZERO'],
  [T.obrasEq, 'OBRAS E DÍVIDA'],
  [T.salarios, 'OS SALÁRIOS'],
  [T.porPouco + 0.6, 'O DESCONTO'],
  [T.a2026, 'DOIS RELATÓRIOS'],
  [T.importa, 'O QUE A LEI MANDA'],
  [T.cumprido, 'O QUE FOI CUMPRIDO'],
  [T.emQual, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.impostos) + 6};
const noMapa = (t: number) => t < T.impostos;
const soMapa = (t: number) => t < T.impostos - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const LOJA: V3 = [-2.4, 0, 4.4];
const PILHAS_ISS: V3 = [-2.4, 0, 5.7];
const CASA_IPTU: V3 = [0.6, 0, 4.6];
const PILHA_IPTU: V3 = [0.6, 0, 5.6];
const ESCOLA: V3 = [-5.6, 0, -2.9];
const PILHAS_EDU: V3 = [-4.9, 0, 0.4];
const POSTO: V3 = [-1.4, 0, -5.5];
const PILHAS_AB: V3 = [-2.8, 0, -3.7];
const PILHAS_ADMS: V3 = [-0.5, 0, -3.7];
const PILHAS_SOUT: V3 = [1.2, 0, -3.6];
const PREF: V3 = [2.8, 0, -5.0];
const PILHAS_ADM: V3 = [3.4, 0, -2.6];
const SANEAM: V3 = [5.0, 0, -1.2];
const PILHAS_SAN: V3 = [3.9, 0, -0.5];
const CAMARA: V3 = [5.0, 0, 1.5];
const PILHAS_CAM: V3 = [3.4, 0, 0.9];
const ASSIST: V3 = [3.9, 0, 3.6];
const PILHAS_ASS: V3 = [2.5, 0, 2.5];
const QUIOSQUE: V3 = [5.4, 0, 4.4];
const PILHAS_TUR: V3 = [4.6, 0, 5.4];
const RUA_BUS_Z = 6.3;
const PILHAS_TR: V3 = [1.4, 0, 5.2];
const QUADRA: V3 = [-3.8, 0, 4.8];
const MOEDAS_ESP: V3 = [-3.8, 0, 6.0];
const LOTES: [V3, string, 'infra' | 'hab' | 'meio'][] = [
  [[-6.4, 0, 2.7], 'OBRAS NA CIDADE', 'infra'],
  [[-6.6, 0, 4.4], 'HABITAÇÃO', 'hab'],
  [[-5.6, 0, 6.0], 'MEIO AMBIENTE', 'meio'],
];
const OBRA: V3 = [-1.5, 0, 6.8];
const PILHAS_OBR: V3 = [-0.4, 0, 5.6];
const GRADE100_Z = 4.4;
const BANCO: V3 = [4.0, 0, 6.8];
const PILHAS_DIV: V3 = [3.0, 0, 5.4];
const REGUA: V3 = [0, 0, 0];
const MARCOS: [number, string][] = [
  [-1.9, '2024'],
  [0, '2025'],
  [1.9, '2026'],
];
const MARCO_Z = 2.4;
const REL1: V3 = [-1.25, 0, 0.6];
const REL2: V3 = [1.25, 0, 0.6];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const CASAS: [V3, number][] = [
  [[-6.6, 0, -4.7], 0.9],
  [[-4.0, 0, -6.2], 0.5],
  [[1.2, 0, -6.4], -0.2],
  [[-7.8, 0, -1.2], 1.4],
];
const ARVORES: V3[] = [
  [-7.6, 0, 1.0],
  [-2.6, 0, 8.0],
  [0.4, 0, -8.6],
  [-5.0, 0, -7.2],
];
const COQUEIROS: [V3, number][] = [
  [[5.7, 0, -3.6], 0.9],
  [[5.5, 0, -6.0], 0.8],
  [[6.1, 0, 2.6], 0.85],
  [[5.2, 0, 6.6], 0.8],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 1 milhão) ----------
// 132 pilhas no anel em volta do cofre (132 milhões recebidos; 138 lugares, porque cada área tem uma pilha quebrada). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 32],
      [2.3, 36],
      [2.7, 44],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
// as 23 pilhas da cidade (impostos): as do anel mais perto da loja e da casinha
const DA_CIDADE: number[] = ANEL.map((p, i) => ({i, d: Math.hypot(p[0] - LOJA[0] * 0.5, p[2] - LOJA[2] * 0.5)}))
  .sort((a, b) => a.d - b.d)
  .slice(0, 23)
  .map((x) => x.i);

type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; volta: number; fim: number};
// volta: quando a pilha volta ao anel; fim: quando o grupo deixa de estar aceso
const VOOS: Voo[] = [
  // cena 1: o ISS vai para a loja e volta no "orçamento previa"
  {n: 16.539, t: T.iss + 0.2, centro: PILHAS_ISS, cols: 9, slots: 18, volta: T.previa, fim: T.iptu},
  // cena 3: as áreas (voltam ao anel nos salários)
  {n: 59.063, t: T.n59, centro: PILHAS_EDU, cols: 8, slots: 64, volta: T.salarios, fim: T.saude},
  {n: 10.408, t: T.n31, centro: PILHAS_AB, cols: 5, slots: 15, volta: T.salarios, fim: T.adm},
  {n: 13.326, t: T.n31 + 0.25, centro: PILHAS_ADMS, cols: 5, slots: 15, volta: T.salarios, fim: T.adm},
  {n: 6.899, t: T.n31 + 0.5, centro: PILHAS_SOUT, cols: 4, slots: 8, volta: T.salarios, fim: T.posto},
  {n: 21.676, t: T.n22, centro: PILHAS_ADM, cols: 6, slots: 24, volta: T.salarios, fim: T.san},
  {n: 5.028, t: T.n5, centro: PILHAS_SAN, cols: 3, slots: 6, volta: T.salarios, fim: T.camara},
  {n: 3.767, t: T.n38c, centro: PILHAS_CAM, cols: 2, slots: 4, volta: T.salarios, fim: T.turismo},
  {n: 3.183, t: T.n32, centro: PILHAS_ASS, cols: 2, slots: 4, volta: T.salarios, fim: T.turismo},
  {n: 2.257, t: T.n23t, centro: PILHAS_TUR, cols: 3, slots: 3, volta: T.salarios, fim: T.transp},
  {n: 1.164, t: T.n12, centro: PILHAS_TR, cols: 2, slots: 2, volta: T.salarios, fim: T.esporte},
  {n: 4.35, t: T.n43d, centro: PILHAS_DIV, cols: 3, slots: 6, volta: T.salarios, fim: T.salarios},
];
const ROTAS = (() => {
  // o ISS sai das pilhas da cidade; as áreas saem do anel inteiro (o ISS volta antes de as áreas saírem)
  const livresAreas = ANEL.map((_, i) => i);
  return VOOS.map((v, iv) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const livres = iv === 0 ? [...DA_CIDADE] : livresAreas;
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(ANEL[a][0] - dest[j][0], ANEL[a][2] - dest[j][2]) - Math.hypot(ANEL[b][0] - dest[j][0], ANEL[b][2] - dest[j][2]));
      const x = livres.shift();
      if (x !== undefined) de.push(x);
    }
    return {de, dest};
  });
})();
const PERTENCE: number[][] = ANEL.map(() => []);
ROTAS.forEach((r, v) => r.de.forEach((i) => PERTENCE[i].push(v)));

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const fraco = (k: number) => mistura(ouro, tema.objeto, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const afunda = 1.0 * rampa(t, T.teto - 0.6, T.teto + 0.4);
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  // o anel e os voos
  if (t >= T.impostos - 0.4 && t < T.teto + 0.6) {
    const cidadeK = janela(t, T.propria, T.previa, 0.5);
    const passouK = janela(t, T.entrou, T.paraOnde, 0.4);
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.impostos - 0.3 + i * 0.004, T.impostos + 0.1 + i * 0.004);
      let pos: V3 = p;
      let n = nasce;
      let corP = ouro;
      // cena 1: as que vieram de fora ficam fracas; as 23 da cidade sobem um pouco
      const daCidade = DA_CIDADE.indexOf(i) >= 0;
      if (cidadeK > 0) {
        if (daCidade) {
          pos = [p[0], p[1] + 0.12 * cidadeK * (1 - rampa(t, T.iss, T.iss + 0.6)), p[2]];
          corP = aceso(cidadeK);
        } else corP = fraco(cidadeK);
      }
      // cena 2: as 7,5 pilhas que passaram do previsto acendem (as 8 últimas do anel de fora)
      if (passouK > 0 && i >= ANEL.length - 8) corP = mistura(ouro, tema.acento, 0.6 * passouK);
      if (i === ANEL.length - 8 && passouK > 0) n = n * (1 - 0.5 * passouK);
      // voos (o primeiro que estiver no ar manda)
      for (const v of PERTENCE[i]) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.035;
        const ida = rampa(t, a, a + 0.7);
        const volta = rampa(t, voo.volta + j * 0.012, voo.volta + 0.8 + j * 0.012);
        const kv = ida * (1 - volta);
        if (kv <= 0) continue;
        pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = janela(t, voo.t, voo.fim, 0.4);
        corP = k > 0 ? aceso(k) : ouro;
        // educação: 3 de cada 4 (as 44 primeiras = ensino fundamental) acendem; o resto fica fraco
        if (v === 1 && t >= T.tresDe4 && t < T.saude + 0.5) {
          const sep = rampa(t, T.tresDe4, T.tresDe4 + 0.6) * (1 - rampa(t, T.saude, T.saude + 0.4));
          corP = j < 44 ? aceso(sep) : fraco(sep);
        }
        // saúde: o posto (atenção básica) e a administração da saúde acendem cada um na sua vez
        if (v === 2) corP = aceso(janela(t, T.posto, T.admSau, 0.4));
        if (v === 3) corP = aceso(janela(t, T.admSau, T.adm, 0.4));
        break;
      }
      solidas.push({p: desce(pos), n, cor: corP});
    });
  }
  // cena 1: a pilha do IPTU (0,69) na porta da casinha
  const iptuK = rampa(t, T.n693, T.n693 + 0.5) * (1 - rampa(t, T.previa, T.previa + 0.5));
  if (iptuK > 0.01) solidas.push({p: PILHA_IPTU, n: 0.693 * iptuK, cor: aceso(janela(t, T.n693, T.previa, 0.4))});
  // cena 2: o previsto (124,5) como fantasmas por cima do anel
  const prevK = rampa(t, T.n124 - 0.2, T.n124 + 1.0) * (1 - rampa(t, T.paraOnde, T.paraOnde + 0.5));
  if (prevK > 0.01) {
    const total = 124.5 * prevK;
    ANEL.forEach((p, i) => {
      const n = Math.max(0, Math.min(1, total - i));
      if (n > 0.001) fantasmas.push({p: [p[0], p[1] + 0.02, p[2]], n, cor: mistura(ouro, tema.branco, 0.4)});
    });
  }
  // saúde: os previstos (fantasmas) do posto (14,8) e da administração da saúde (6,2)
  const someSau = 1 - rampa(t, T.adm, T.adm + 0.6);
  if (t >= T.n148 && someSau > 0.01) fantasmas.push(...encher(grade(PILHAS_AB, 15, 5), 14.814 * rampa(t, T.n148, T.n148 + 0.9) * someSau, mistura(ouro, C.alerta, rampa(t, T.g104 + 0.3, T.g104 + 0.9))));
  if (t >= T.n62 && someSau > 0.01) fantasmas.push(...encher(grade(PILHAS_ADMS, 15, 5), 6.157 * rampa(t, T.n62, T.n62 + 0.6) * someSau, ouro));
  // transporte: o previsto (56 mil) é um disco fininho
  const someTr = 1 - rampa(t, T.salarios, T.salarios + 0.6);
  if (t >= T.n56 && someTr > 0.01) fantasmas.push({p: soma(PILHAS_TR, [0.9, 0, 0]), n: 0.056 * rampa(t, T.n56, T.n56 + 0.4) * someTr, cor: ouro});
  // esporte: 3 moedas soltas (0,097 de pilha)
  if (t >= T.n100 - 0.2 && someTr > 0.01) solidas.push({p: MOEDAS_ESP, n: 0.097 * rampa(t, T.n100 - 0.2, T.n100 + 0.3) * someTr, cor: aceso(janela(t, T.n100, T.zero, 0.4))});
  // obras e equipamentos: 2,9 (aparecem na obra; são parte das áreas)
  if (t >= T.n29 - 0.2 && someTr > 0.01) solidas.push(...encher(grade(PILHAS_OBR, 3, 3), 2.852 * rampa(t, T.n29 - 0.2, T.n29 + 0.6) * someTr, aceso(janela(t, T.n29, T.divida, 0.4))));
  return {solidas, fantasmas};
};

const MESES8 = ['1', '2', '3', '4', '5', '6', '7', '8'];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, saem nos salários e voltam no fim
  const fora = rampa(t, T.salarios + 0.6, T.salarios + 1.6) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.emQual + 0.6 + i * 0.25, FIM + 1, 0.4);
  // cofre: nasce com a maquete, abre em "para onde foi", afunda no teto
  const cofreK = rampa(t, T.impostos - 0.3, T.impostos + 0.4) * (1 - rampa(t, T.teto - 0.6, T.teto + 0.4));
  // cena 1: loja e casinha (somem quando começa "para onde foi")
  const lojaK = rampa(t, T.iss - 0.3, T.iss + 0.5) * (1 - rampa(t, T.paraOnde, T.paraOnde + 0.6));
  const casaK = rampa(t, T.iptu - 0.3, T.iptu + 0.5) * (1 - rampa(t, T.paraOnde, T.paraOnde + 0.6));
  // ônibus
  const busK = vis(t, T.transp - 0.4, T.salarios);
  const busX = 3.2 - 3.6 * rampa(t, T.transp - 0.4, T.transp + 2.4, sai);
  // obra
  const obraK = vis(t, T.obrasEq - 0.1, T.salarios);
  // grade de 100 moedas (2 de cada 100)
  const m100K = vis(t, T.so2 - 0.1, T.divida + 0.4);
  // salários: 3 pilhas grandes, 2 com crachá
  const tresK = vis(t, T.de3 - 0.1, T.teto - 0.2);
  // régua
  const reguaK = rampa(t, T.teto - 0.2, T.teto + 1.0) * (1 - rampa(t, T.a2026 + 0.2, T.a2026 + 1.2));
  const nivel = 58.79 * rampa(t, T.a2024, T.n59p + 0.3) - (58.79 - 54.35) * rampa(t, T.a2025, T.n5435 + 0.3) + (67.1 - 54.35) * rampa(t, T.nossas - 0.2, T.n67 + 0.3);
  const acima = Math.max(0, nivel - 54);
  // marcos da linha do tempo
  const marcosK = vis(t, T.anoAno - 0.1, T.importa);
  const marcoAceso = (i: number) => (i === 0 ? janela(t, T.a2024, T.a2025, 0.4) + janela(t, T.em2024, T.semDesc, 0.4) : i === 1 ? janela(t, T.a2025, T.a2026, 0.4) * (1 - janela(t, T.em2024, T.semDesc, 0.4)) : rampa(t, T.a2026, T.a2026 + 0.4));
  // caixote da demissão (16 mi): sai da régua, vai para o lado, volta em "sem o desconto"
  const cx16 = rampa(t, T.tirou, T.tirou + 0.9, sai) * (1 - rampa(t, T.semDesc, T.semDesc + 0.9));
  const cx16K = rampa(t, T.tirou - 0.1, T.tirou + 0.3) * (1 - rampa(t, T.semDesc + 0.6, T.semDesc + 0.9));
  const vazioK = vis(t, T.em2024, T.semDesc);
  // os dois relatórios
  const relK = rampa(t, T.a2026 + 0.4, T.a2026 + 1.4) * (1 - rampa(t, T.importa, T.importa + 0.7));
  const cx22 = rampa(t, T.com22, T.com22 + 0.9, sai);
  // calendário e placa
  const mesesK = vis(t, T.meses - 0.3, T.cumprido);
  const placaK = entra(t, T.verbas - 0.3, 0.45) * (1 - rampa(t, T.cumprido, T.cumprido + 0.6));
  // copos
  const coposK = rampa(t, T.cumprido + 0.2, T.cumprido + 1.1) * (1 - rampa(t, T.emQual, T.emQual + 0.6));
  const nivelSau = 22.44 * rampa(t, T.n22p, T.n22p + 1.0);
  const nivelEdu = 31.01 * rampa(t, T.edu31, T.edu31 + 1.2);

  return (
    <group>
      <MesaMaquete tema={tema} />
      {/* fundo: casinhas, árvores, coqueiros e a ponte do rio Una */}
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}
      {COQUEIROS.map(([p, e], i) => (
        <Coqueiro key={i} tema={tema} pos={p} escala={e} rotY={i * 1.3} />
      ))}
      <PonteMini tema={tema} pos={[-2.6, 0, -7.0]} rotY={Math.PI / 2 - 0.2} escala={0.5} />

      {/* o cofre da prefeitura */}
      {cofreK > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - cofreK), COFRE[2]]} escala={0.75} abre={rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0)} trava={1 - rampa(t, T.paraOnde, T.paraOnde + 0.3)} brilho={0.3 * janela(t, T.paraOnde + 0.3, T.educ + 0.6)} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1700} />
      <PilhasDinheiro pilhas={fantasmas} max={1400} opacidade={0.3} largura={1.14} />

      {/* cena 1: a loja do ISS e a casinha do IPTU */}
      <LojaServicos tema={tema} pos={LOJA} rotY={0.25} escala={0.85} sobe={lojaK} aceso={janela(t, T.servicos, T.iptu, 0.5)} />
      {casaK > 0.02 ? <CasaMini tema={tema} pos={[CASA_IPTU[0], -0.9 * (1 - casaK), CASA_IPTU[2]]} rotY={-0.15} luz={0.4 + 0.5 * janela(t, T.casa, T.previa, 0.5)} escala={0.75} /> : null}

      {/* cena 3: escola e posto de saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={0.85} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={POSTO} rotY={0.15} escala={1.0} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.adm, 0.5), fim(1))} />

      {/* prefeitura, saneamento, Câmara e assistência */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.45} escala={0.8} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.san, 0.5), fim(2))} />
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={-1.2} escala={0.7} sobe={predio(T.san)} aceso={Math.max(janela(t, T.san, T.camara, 0.5), fim(3))} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={-1.1} escala={0.72} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.turismo, 0.5), fim(4))} />
      <PredioAssistencia tema={tema} pos={ASSIST} rotY={-0.8} escala={0.72} sobe={predio(T.maisToda)} aceso={Math.max(janela(t, T.assist, T.turismo, 0.5), fim(5))} />

      {/* turismo, transporte e esporte */}
      <QuiosqueTurismo tema={tema} pos={QUIOSQUE} rotY={-0.9} escala={0.8} sobe={predio(T.turismo)} aceso={Math.max(janela(t, T.turismo, T.transp, 0.5), fim(6))} />
      {busK > 0.02 ? <Caixa args={[6.0, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[1.0, 0.1 - 0.2 * (1 - Math.min(1, busK)), RUA_BUS_Z]} sombra={false} /> : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.42 * Math.min(1, busK)} farol={0.6} /> : null}
      <QuadraMini tema={tema} pos={QUADRA} rotY={0.3} escala={0.8} sobe={predio(T.esporte)} aceso={Math.max(janela(t, T.esporte, T.zero, 0.5), fim(7))} />

      {/* o que ficou no zero */}
      {LOTES.map(([p, nome, chave], i) => (
        <LoteVazio key={nome} tema={tema} pos={p} rotY={0.9 - i * 0.25} escala={0.85} nome={nome} sobe={predio(T[chave])} />
      ))}

      {/* obras e dívida */}
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
      <RoloCompactador tema={tema} pos={[OBRA[0] - 1.3, 0.06, OBRA[2] + 0.1]} rotY={0.6} escala={0.3 * obraK} giro={t * 0.8} />
      {m100K > 0.02
        ? Array.from({length: 100}).map((_, i) => {
            const col = i % 10;
            const lin = Math.floor(i / 10);
            const k = entra(t, T.so2 + lin * 0.04, 0.35) * m100K;
            const acesa = i < 2 ? rampa(t, T.so2 + 0.6, T.so2 + 1.0) : 0;
            return <Moeda key={i} tema={tema} pos={[-1.35 + col * 0.3, 0.1 + 0.08 * acesa, GRADE100_Z - 1.35 + lin * 0.3]} rot={[0, 0, 0]} r={0.12} escala={k} cor={mistura(tema.objeto, C.ouro, acesa)} brilho={0.3 * acesa} />;
          })
        : null}
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.75} escala={0.78} sobe={predio(T.divida)} aceso={Math.max(janela(t, T.divida, T.salarios, 0.5), fim(8))} />

      {/* cena 4: as 3 pilhas grandes (2 com crachá) */}
      {tresK > 0.02 ? (
        <group position={[0, 0, 3.4]}>
          <PilhasDinheiro pilhas={[-1.1, 0, 1.1].map((x, i) => ({p: [x / 2.4, 0, 0] as V3, n: entra(t, T.de3 + i * 0.12, 0.4) * tresK, cor: i < 2 ? mistura(C.ouro, tema.branco, 0.3 * rampa(t, T.dois, T.dois + 0.5)) : mistura(C.ouro, tema.objeto, 0.4 * rampa(t, T.dois, T.dois + 0.5))}))} max={40} escala={2.4} />
          {[-1.1, 0].map((x, i) => {
            const k = entra(t, T.dois + i * 0.15, 0.45) * tresK;
            return k > 0.02 ? <Boneco key={i} tema={tema} pos={[x, 1.75, 0]} rotY={0} escala={0.45 * k} cor={tema.pessoa} /> : null;
          })}
        </group>
      ) : null}

      {/* a régua do teto */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={Math.min(54, nivel)} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />
      {reguaK > 0.02 && acima > 0.01 ? (
        <mesh position={[REGUA[0], REGUA[1] - 6.2 * (1 - reguaK) + 0.2 + yRegua(54) + yRegua(acima) / 2, REGUA[2]]}>
          <cylinderGeometry args={[0.505, 0.505, yRegua(acima), 40]} />
          <meshStandardMaterial color={C.alerta} emissive={C.alerta} emissiveIntensity={0.25} roughness={0.8} />
        </mesh>
      ) : null}
      <CaixoteDemissao tema={tema} pos={[0.2 + 2.0 * cx16, 0.6 * (1 - cx16) + 0.0, 0.3 + 0.7 * cx16]} escala={0.9 * cx16K} valor="16 MI" brilho={janela(t, T.n16, T.permite, 0.4)} />
      {vazioK > 0.02 ? (
        <group position={[MARCOS[0][0] - 1.2, 0, MARCO_Z]} scale={0.55 * vazioK}>
          {[0, 1, 2, 3].map((i) => (
            <Caixa key={i} args={i < 2 ? [1.3, 0.6, 0.06] : [0.06, 0.6, 0.9]} raio={0.02} cor={C.madeira} position={i === 0 ? [0, 0.3, 0.42] : i === 1 ? [0, 0.3, -0.42] : [i === 2 ? -0.62 : 0.62, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      {marcosK > 0.02
        ? MARCOS.map(([x, ano], i) => {
            const k = entra(t, T.anoAno + i * 0.15, 0.4) * marcosK;
            const ac = Math.min(1, marcoAceso(i));
            return (
              <group key={ano} position={[x, 0, MARCO_Z]} scale={k}>
                <Caixa args={[1.2, 0.08, 0.6]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.6 * ac)} emissivo={0.25 * ac} position={[0, 0.04, 0]} />
                <Placa tema={tema} pos={[0, 0.3, 0.05]} rot={[-0.5, 0, 0]} larg={1.1} alt={0.42} linhas={[{t: ano, tam: 330, cor: tema.objetoClaro, peso: 900}]} brilho={0.2} />
              </group>
            );
          })
        : null}

      {/* cena 5: os dois relatórios */}
      <RelatorioEmPe tema={tema} pos={[REL1[0], -2.6 * (1 - relK), REL1[2]]} rotY={0.12} escala={relK} titulo="ENVIADO" sub="AO TESOURO" data="MAI A AGO 2026" numero="56%" mostraNumero={rampa(t, T.n56p, T.n56p + 0.4)} aceso={janela(t, T.enviado, T.portal, 0.5)} />
      <RelatorioEmPe tema={tema} pos={[REL2[0], -2.6 * (1 - relK), REL2[2]]} rotY={-0.12} escala={relK} titulo="PORTAL DA" sub="PREFEITURA" data="MAI A AGO 2026" numero="42%" mostraNumero={rampa(t, T.n42, T.n42 + 0.4)} aceso={janela(t, T.portal, T.duas, 0.5)} />
      <CaixoteDemissao tema={tema} pos={[REL2[0] + 0.3 + 1.1 * cx22, 0, REL2[2] + 0.2 + 1.3 * cx22]} escala={0.7 * relK * rampa(t, T.com22 - 0.1, T.com22 + 0.3)} valor="22 MI" brilho={janela(t, T.com22, T.duas, 0.4)} />

      {/* cena 6: o calendário de 8 meses e a placa */}
      {mesesK > 0.02
        ? MESES8.map((m, i) => {
            const k = entra(t, T.meses - 0.2 + i * 0.06, 0.35) * mesesK;
            const vira = rampa(t, T.meses + 0.3 + i * 0.16, T.meses + 0.65 + i * 0.16);
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
      <PlacaProibido tema={tema} pos={[0, 0, 3.6]} rotY={0} texto="VERBAS EXTRAS" escala={0.9 * placaK} x={rampa(t, T.verbas + 0.3, T.verbas + 0.6)} />

      {/* cena 7: os copos dos mínimos */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.min15 - 0.2, T.min15 + 0.3)} nivel={nivelSau} acima={rampa(t, T.min15, T.min15 + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.min25 - 0.2, T.min25 + 0.3)} nivel={nivelEdu} acima={rampa(t, T.min25, T.min25 + 0.6)} />
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
    ini: T.impostos - 0.3,
    arco: 0.04,
    chaves: [
      [T.impostos - 0.3, E([0, 0, 0.6], 18.5, 11.5, [0, 1.5, 1])],
      [T.iss - 0.3, E([-0.6, 0, 1.6], 12, 8, [0.05, 1.2, 1])],
      [T.iss + 0.6, E([-1.0, 0.6, 4.8], 6.6, 4.8, [-0.1, 0.8, 1])],
      [T.previa - 0.3, E([-0.9, 0.6, 4.9], 6.2, 4.6, [0.15, 0.8, 1])],
    ],
  },
  {
    ini: T.previa - 0.1,
    arco: 0.03,
    chaves: [
      [T.previa - 0.1, E([0, 0.4, 0.2], 7.6, 5.4, [0, 0.9, 1])],
      [T.paraOnde - 0.3, E([0, 0.4, 0.2], 7.2, 5.2, [0.05, 1.5, 1])],
    ],
  },
  {
    ini: T.paraOnde - 0.1,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.1, E([0, 0, 0.2], 17.5, 11, [0, 1.4, 1])],
      [T.educ, E([-2.8, 0.6, -0.8], 9.5, 6.4, [0.35, 0.85, 1])],
      [T.n59 + 0.6, E([-4.6, 0.8, -0.8], 6.8, 5.0, [0.45, 0.75, 1])],
      [T.saude - 0.3, E([-4.6, 0.8, -0.8], 6.4, 4.8, [0.6, 0.75, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-1.2, 0.8, -4.0], 7.4, 5.2, [0.1, 0.72, 1])],
      [T.posto, E([-1.6, 0.8, -3.9], 6.4, 4.6, [0.15, 0.7, 1])],
      [T.admSau, E([-1.0, 0.8, -3.9], 6.2, 4.5, [-0.05, 0.7, 1])],
      [T.adm - 0.3, E([-0.8, 0.8, -3.9], 6.0, 4.4, [-0.15, 0.7, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.03,
    chaves: [
      [T.adm - 0.1, E([2.8, 0.9, -3.4], 6.4, 4.6, [-0.2, 0.75, 1])],
      [T.san, E([3.6, 0.9, -2.2], 6.6, 4.6, [-0.45, 0.75, 1])],
      [T.camara - 0.3, E([4.0, 0.9, -1.2], 6.2, 4.4, [-0.6, 0.75, 1])],
    ],
  },
  {
    ini: T.camara - 0.1,
    arco: 0.03,
    chaves: [
      [T.camara - 0.1, E([3.8, 0.8, 1.8], 6.6, 4.6, [-0.55, 0.72, 1])],
      [T.turismo - 0.3, E([3.6, 0.8, 2.0], 6.2, 4.4, [-0.4, 0.72, 1])],
    ],
  },
  {
    ini: T.turismo - 0.1,
    arco: 0.03,
    chaves: [
      [T.turismo - 0.1, E([4.4, 0.7, 4.8], 5.8, 4.2, [-0.35, 0.7, 1])],
      [T.transp, E([2.0, 0.6, 5.6], 6.6, 4.6, [-0.1, 0.7, 1])],
      [T.esporte, E([-2.6, 0.6, 5.4], 6.0, 4.3, [0.2, 0.7, 1])],
      [T.zero - 0.3, E([-3.4, 0.6, 5.2], 5.8, 4.2, [0.3, 0.72, 1])],
    ],
  },
  {
    ini: T.zero - 0.1,
    arco: 0.03,
    chaves: [
      [T.zero - 0.1, E([-5.6, 0.6, 4.2], 6.0, 4.6, [0.35, 0.95, 1])],
      [T.obrasEq - 0.3, E([-5.6, 0.6, 4.4], 5.6, 4.4, [0.45, 0.95, 1])],
    ],
  },
  {
    ini: T.obrasEq - 0.1,
    arco: 0.03,
    chaves: [
      [T.obrasEq - 0.1, E([0.6, 0.6, 5.6], 8.6, 5.8, [0, 0.85, 1])],
      [T.so2, E([0, 0.4, 4.8], 6.0, 4.4, [0, 1.1, 1])],
      [T.divida, E([1.6, 0.7, 5.8], 7.6, 5.2, [-0.15, 0.8, 1])],
      [T.salarios - 0.3, E([1.8, 0.7, 5.8], 7.2, 5.0, [-0.25, 0.8, 1])],
    ],
  },
  {
    ini: T.salarios - 0.1,
    arco: 0.04,
    chaves: [
      [T.salarios - 0.1, E([0, 0.4, 1.2], 11, 7.4, [0, 1.0, 1])],
      [T.de3, E([0, 1.2, 3.0], 5.6, 4.4, [0, 0.45, 1])],
      [T.teto - 0.3, E([0, 1.4, 2.8], 5.6, 4.4, [0.05, 0.45, 1])],
      [T.teto + 0.6, E([0, 2.9, 0.6], 4.6, 7.2, [0, 0.28, 1])],
      [T.a2024, E([0, 2.6, 1.2], 5.4, 7.2, [0, 0.32, 1])],
      [T.porPouco, E([0, 4.8, 0], 2.4, 2.2, [0.05, 0.22, 1])],
      [T.tirou - 0.2, E([0.6, 2.4, 0.8], 5.6, 6.6, [0.05, 0.32, 1])],
      [T.permite + 0.3, E([0.4, 2.4, 1.0], 6.0, 6.8, [0.1, 0.34, 1])],
      [T.n67 - 0.2, E([0, 3.2, 0.6], 4.8, 6.6, [0.05, 0.3, 1])],
      [T.a2026 - 0.2, E([0, 3.4, 0.6], 4.6, 6.4, [0.1, 0.3, 1])],
    ],
  },
  {
    ini: T.a2026 - 0.1,
    arco: 0.04,
    chaves: [
      [T.a2026 - 0.1, E([0, 1.4, 1.2], 6.8, 5.0, [0, 0.35, 1])],
      [T.enviado, E([-1.0, 1.3, 0.8], 4.6, 4.0, [0.1, 0.25, 1])],
      [T.portal, E([1.1, 1.3, 0.8], 4.6, 4.0, [-0.1, 0.25, 1])],
      [T.com22, E([1.6, 1.1, 1.4], 5.4, 4.4, [-0.15, 0.32, 1])],
      [T.duas, E([0, 1.3, 1.0], 6.6, 5.0, [0, 0.3, 1])],
      [T.importa - 0.2, E([0, 1.3, 1.0], 7.0, 5.2, [0.05, 0.3, 1])],
    ],
  },
  {
    ini: T.importa - 0.1,
    arco: 0.04,
    chaves: [
      [T.importa - 0.1, E([0, 0.5, 2.4], 4.6, 3.6, [0, 0.5, 1])],
      [T.verbas - 0.3, E([0, 0.5, 2.8], 4.4, 3.6, [0.08, 0.5, 1])],
      [T.cumprido - 0.3, E([0, 0.6, 3.0], 4.6, 3.8, [0.12, 0.5, 1])],
    ],
  },
  {
    ini: T.cumprido - 0.1,
    arco: 0.04,
    chaves: [
      [T.cumprido - 0.1, E([0, 1.3, 0], 6.4, 4.2, [0, 0.4, 1])],
      [T.n22p, E([-0.6, 1.4, 0], 6.4, 4.4, [0.08, 0.42, 1])],
      [T.edu31 - 0.3, E([-0.3, 1.4, 0], 6.2, 4.3, [0.04, 0.42, 1])],
      [T.edu31 + 0.3, E([0.5, 1.4, 0], 6.2, 4.3, [-0.06, 0.42, 1])],
      [T.emQual - 0.2, E([0.6, 1.4, 0], 6.4, 4.4, [-0.12, 0.42, 1])],
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
  {a: T.impostos + 0.3, b: T.propria, texto: 'UNIÃO 72 · ESTADO 11 · FUNDEB 24'},
  {a: T.propria, b: T.iss, texto: 'IMPOSTOS DA PRÓPRIA CIDADE'},
  {a: T.servicos, b: T.iptu, texto: 'ISS: IMPOSTO SOBRE SERVIÇOS'},
  {a: T.casa, b: T.n693, texto: 'IPTU: O IMPOSTO DA CASA'},
  {a: T.previa, b: T.entrou, texto: 'O QUE O ORÇAMENTO PREVIA'},
  {a: T.entrou, b: T.paraOnde, texto: 'ENTROU MAIS DO QUE O PREVISTO', destaque: true},
  {a: T.paraOnde + 0.3, b: T.educ, texto: 'DO MAIOR PARA O MENOR'},
  {a: T.metade, b: T.tresDe4, texto: 'QUASE METADE DE TUDO', destaque: true},
  {a: T.tresDe4, b: T.saude, texto: '3 DE CADA 4 REAIS: ENSINO FUNDAMENTAL'},
  {a: T.posto, b: T.admSau, texto: 'ATENÇÃO BÁSICA: O POSTO DO BAIRRO'},
  {a: T.admSau, b: T.dobro, texto: 'ADMINISTRAÇÃO DA SAÚDE'},
  {a: T.dobro, b: T.adm, texto: 'MAIS QUE O DOBRO DO PREVISTO', destaque: true},
  {a: T.adm, b: T.san, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.san, b: T.camara, texto: 'SANEAMENTO'},
  {a: T.camara, b: T.maisToda, texto: 'CÂMARA DE VEREADORES'},
  {a: T.maisToda, b: T.turismo, texto: 'MAIS QUE TODA A ASSISTÊNCIA SOCIAL', destaque: true},
  {a: T.turismo, b: T.transp, texto: 'TURISMO'},
  {a: T.transp, b: T.vinte, texto: 'TRANSPORTE: PREVISTO × GASTO'},
  {a: T.vinte, b: T.esporte, texto: '20 VEZES O PREVISTO', destaque: true},
  {a: T.esporte, b: T.zero, texto: 'ESPORTE'},
  {a: T.zero, b: T.obrasEq, texto: 'PREVISTOS NO ORÇAMENTO, GASTO ZERO', destaque: true},
  {a: T.obrasEq, b: T.so2, texto: 'OBRAS E EQUIPAMENTOS'},
  {a: T.so2, b: T.divida, texto: '2 REAIS DE CADA 100', destaque: true},
  {a: T.divida, b: T.salarios, texto: 'A DÍVIDA LEVOU MAIS QUE AS OBRAS'},
  {a: T.salarios, b: T.de3, texto: 'A MAIOR CONTA: OS SALÁRIOS'},
  {a: T.dois, b: T.lrf, texto: '2 DE CADA 3 REAIS: PESSOAL', destaque: true},
  {a: T.lrf, b: T.receita, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.receita, b: T.anoAno, texto: 'GASTO COM PESSOAL ÷ RECEITA'},
  {a: T.anoAno, b: T.a2024, texto: 'ANO A ANO'},
  {a: T.acima1, b: T.a2025, texto: '2024: ACIMA DO TETO', destaque: true},
  {a: T.porPouco, b: T.tirou, texto: 'ACIMA, POR POUCO'},
  {a: T.permite, b: T.em2024, texto: 'A LEI PERMITE · LRF, ART. 19'},
  {a: T.linhaZero, b: T.semDesc, texto: '2024: R$ 0 DE DEMISSÃO'},
  {a: T.semDesc, b: T.n67, texto: 'SEM O DESCONTO...'},
  {a: T.a2026, b: T.enviado, texto: '2026, ATÉ AGOSTO'},
  {a: T.semDem, b: T.acima2, texto: 'DEMISSÃO: R$ 0'},
  {a: T.acima2, b: T.portal, texto: 'ACIMA DO TETO DE 54%', destaque: true},
  {a: T.mesmo, b: T.junta, texto: 'O MESMO PERÍODO'},
  {a: T.junta, b: T.com22, texto: 'PREFEITURA + CÂMARA (LIMITE 60%)'},
  {a: T.com22, b: T.duas, texto: '22 MILHÕES DESCONTADOS COMO DEMISSÃO'},
  {a: T.importa, b: T.meses, texto: 'POR QUE ISSO IMPORTA'},
  {a: T.meses, b: T.verbas, texto: '8 MESES PARA CORTAR O EXCESSO'},
  {a: T.verbas, b: T.cumprido, texto: 'SENÃO: SEM VERBAS EXTRAS DO GOVERNO'},
  {a: T.cumprido, b: T.n22p, texto: 'O QUE FOI CUMPRIDO'},
  {a: T.n22p, b: T.edu31, texto: 'SAÚDE: MÍNIMO DE 15% DOS IMPOSTOS'},
  {a: T.edu31, b: T.emQual, texto: 'EDUCAÇÃO: MÍNIMO DE 25%'},
];
const SELOS: Txt[] = [
  {a: T.n132, b: T.federal, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE UNA · ANEXO 1, P. 1'},
  {a: T.federal, b: T.fpm, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (RECEITAS)'},
  {a: T.fpm, b: T.n11, texto: 'FONTE: RREO DEZ/2025 · ANEXO 3, P. 1 (FPM)'},
  {a: T.n11, b: T.impostos, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (RECEITAS)'},
  {a: T.impostos, b: T.n38, texto: 'FONTE: RREO DEZ/2025 · ANEXO 3, P. 1 (ISS, IPTU)'},
  {a: T.n38, b: T.previa, texto: 'CONTA DO VÍDEO: R$ 693.299 ÷ 17.998 MORADORES (IBGE)', destaque: true},
  {a: T.previa, b: T.educ, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (PREVISÃO INICIAL)'},
  {a: T.educ, b: T.camara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2, P. 1 A 3'},
  {a: T.camara, b: T.assist, texto: 'FONTE: TESOURO (SICONFI) · RREO DEZ/2025 · ANEXO 2 (LEGISLATIVA)', destaque: true},
  {a: T.assist, b: T.obrasEq, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2, P. 1 A 3'},
  {a: T.obrasEq, b: T.dois, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (INVESTIMENTOS, AMORTIZAÇÃO)'},
  {a: T.dois, b: T.teto, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (PESSOAL E ENCARGOS)'},
  {a: T.teto, b: T.a2024, texto: 'LEI DE RESPONSABILIDADE FISCAL · ART. 20 E 23'},
  {a: T.a2024, b: T.a2025, texto: 'FONTE: TESOURO (SICONFI) · RGF DEZ/2024 · PREFEITURA DE UNA'},
  {a: T.a2025, b: T.permite, texto: 'FONTE: TESOURO (SICONFI) · RGF DEZ/2025 · ANEXO 1 (DESPESAS NÃO COMPUTADAS)'},
  {a: T.permite, b: T.nossas, texto: 'LRF · ART. 19, § 1º, I'},
  {a: T.nossas, b: T.a2026, texto: 'CONTA DO VÍDEO: (69,1 + 16,2) ÷ 127,2 = 67%', destaque: true},
  {a: T.enviado, b: T.portal, texto: 'FONTE: TESOURO (SICONFI) · RGF AGO/2026 · PREFEITURA DE UNA'},
  {a: T.portal, b: T.importa, texto: 'FONTE: PORTAL DE UNA · RGF AGO/2026 · CONSOLIDADO · P. 1 (LIMITE 60%)', destaque: true},
  {a: T.importa, b: T.cumprido, texto: 'LRF · ART. 23'},
  {a: T.cumprido, b: T.emQual, texto: 'FONTE: RREO DEZ/2025 · ANEXO 12, P. 1 (SAÚDE) · ANEXO 8, P. 3 (EDUCAÇÃO)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n23, b: T.iss, p: [-0.8, 0.9, 1.6], valor: '23 MI', sub: 'R$ 23,30 MI · IMPOSTOS DA CIDADE', cor: 'acento'},
  {a: T.iss + 0.4, b: T.previa, p: soma(PILHAS_ISS, [0, 0.9, 0]), valor: 'ISS · 16,5 MI', sub: 'R$ 16,54 MI', cor: 'acento'},
  {a: T.n693, b: T.previa, p: soma(PILHA_IPTU, [0.4, 0.6, 0]), valor: 'IPTU · 693 MIL', sub: 'R$ 693.299', dy: -20},
  {a: T.n38, b: T.previa, p: soma(PILHA_IPTU, [0.4, 0.6, 0]), valor: 'R$ 38', sub: 'POR MORADOR, NO ANO', cor: 'acento', dy: 110},
  {a: T.n124, b: T.paraOnde, p: [-1.4, 1.0, 2.6], valor: 'PREVISTO · 124,5 MI', sub: 'R$ 124,50 MI'},
  {a: T.entrou, b: T.paraOnde, p: [1.4, 1.0, 2.6], valor: 'RECEBIDO · 132 MI', sub: 'R$ 131,88 MI', cor: 'acento'},
  {a: T.n7300, b: T.paraOnde, p: [0, 1.6, 2.0], valor: 'R$ 7.300', sub: 'POR MORADOR (17.998 PESSOAS)', cor: 'acento', dy: -130},
  {a: T.n59, b: T.saude, p: soma(PILHAS_EDU, [0, 0.9, 0.6]), valor: '59 MI', sub: 'R$ 59,06 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.tresDe4, b: T.saude, p: soma(PILHAS_EDU, [0, 0.9, -0.6]), valor: '44 MI', sub: 'ENSINO FUNDAMENTAL', dy: 120},
  {a: T.n31, b: T.posto, p: [-1.4, 1.2, -3.0], valor: '31 MI', sub: 'R$ 30,63 MI · SAÚDE', cor: 'acento'},
  {a: T.n148, b: T.adm, p: soma(PILHAS_AB, [0, 0.9, -0.2]), valor: 'PREVISTO 14,8', sub: 'ATENÇÃO BÁSICA'},
  {a: T.g104, b: T.adm, p: soma(PILHAS_AB, [0, 0.5, 0.4]), valor: 'GASTO 10,4', sub: 'R$ 10,41 MI', cor: 'alerta', dy: -90},
  {a: T.n62, b: T.adm, p: soma(PILHAS_ADMS, [0, 0.9, -0.2]), valor: 'PREVISTO 6,2', sub: 'ADMINISTRAÇÃO DA SAÚDE'},
  {a: T.g133, b: T.adm, p: soma(PILHAS_ADMS, [0, 0.5, 0.4]), valor: 'GASTO 13,3', sub: 'R$ 13,33 MI', cor: 'acento', dy: -90},
  {a: T.n22, b: T.san, p: soma(PILHAS_ADM, [0, 0.9, 0.3]), valor: '22 MI', sub: 'R$ 21,68 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.n5, b: T.camara, p: soma(PILHAS_SAN, [0, 0.9, 0]), valor: '5 MI', sub: 'R$ 5,03 MI · SANEAMENTO', cor: 'acento'},
  {a: T.n38c, b: T.turismo, p: soma(PILHAS_CAM, [0, 0.9, 0]), valor: '3,8 MI', sub: 'R$ 3,77 MI · CÂMARA', cor: 'acento'},
  {a: T.n32, b: T.turismo, p: soma(PILHAS_ASS, [0, 0.9, 0]), valor: '3,2 MI', sub: 'R$ 3,18 MI · ASSISTÊNCIA'},
  {a: T.n23t, b: T.transp, p: soma(PILHAS_TUR, [0, 0.9, 0]), valor: '2,3 MI', sub: 'R$ 2,26 MI · TURISMO', cor: 'acento'},
  {a: T.n12, b: T.esporte, p: soma(PILHAS_TR, [0, 0.8, 0]), valor: 'GASTO 1,2 MI', sub: 'R$ 1,16 MI · TRANSPORTE', cor: 'acento'},
  {a: T.n56, b: T.esporte, p: soma(PILHAS_TR, [0.9, 0.5, 0]), valor: 'PREVISTO 56 MIL', dy: -100},
  {a: T.n100, b: T.zero, p: soma(MOEDAS_ESP, [0, 0.6, 0]), valor: 'MENOS DE 100 MIL', sub: 'R$ 96.740 · ESPORTE', cor: 'acento'},
  {a: T.n29, b: T.salarios, p: soma(PILHAS_OBR, [0, 0.8, 0]), valor: '2,9 MI', sub: 'R$ 2,85 MI · OBRAS E EQUIPAMENTOS', cor: 'acento'},
  {a: T.n43d, b: T.salarios, p: soma(PILHAS_DIV, [0, 0.9, 0]), valor: '4,3 MI', sub: 'R$ 4,35 MI · DÍVIDA', cor: 'alerta'},
  {a: T.dois + 0.3, b: T.teto, p: [0, 3.2, 3.4], valor: '88,6 MI', sub: 'PESSOAL · DE R$ 132 MI GASTOS', cor: 'acento'},
  {a: T.n54, b: T.a2024, p: [0.8, yRegua(54) + 0.2, 0], valor: '54%', sub: 'TETO DA LEI'},
  {a: T.n16, b: T.semDesc, p: [2.2, 1.4, 1.0], valor: '16 MI', sub: 'TIRADOS DA CONTA', cor: 'alerta'},
  {a: T.n22p + 0.4, b: T.emQual, p: soma(COPO_SAU, [0, yCopo(22.44) + 0.3, 0.6]), valor: '22%', sub: 'SAÚDE · MÍNIMO 15%', cor: 'acento'},
  {a: T.edu31 + 0.8, b: T.emQual, p: soma(COPO_EDU, [0, yCopo(31.01) + 0.3, 0.6]), valor: '31%', sub: 'EDUCAÇÃO · MÍNIMO 25%', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.impostos + 0.4, T.salarios);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 11,
              background: tema.cartao,
              border: `2px solid ${seloAtual.destaque ? tema.acento : tema.cartaoBorda}`,
              fontFamily: MONO,
              fontSize: seloAtual.texto.length > 62 ? 15 : seloAtual.texto.length > 54 ? 17 : seloAtual.texto.length > 46 ? 19 : 22,
              fontWeight: 700,
              letterSpacing: 1.1,
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
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 1 MILHÃO</div>
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
  // números grandes (régua)
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n59K = entra(t, T.n59p, 0.5) * (1 - rampa(t, T.a2025 - 0.3, T.a2025));
  const n5435K = entra(t, T.n5435, 0.5) * (1 - rampa(t, T.semDesc - 0.3, T.semDesc));
  const n67K = entra(t, T.n67, 0.5) * (1 - rampa(t, T.a2026 - 0.3, T.a2026));
  // as duas perguntas
  const perg = (n: string, txt: string, a: number, y: number) => {
    const k = entra(t, a, 0.45) * (1 - rampa(t, T.importa - 0.3, T.importa));
    return k > 0.01 ? (
      <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.botoesX + 10, top: y, opacity: Math.min(1, k), transform: `translateY(${(1 - Math.min(1, k)) * 16}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 18, background: tema.cartao, border: `2px solid ${tema.acento}`}}>
          <div style={{fontFamily: FONTE, fontSize: 56, fontWeight: 900, color: tema.acento, lineHeight: 1}}>{n}</div>
          <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 800, color: tema.texto, lineHeight: 1.1}}>{txt}</div>
        </div>
      </div>
    ) : null;
  };
  const comentaK = vis(t, T.comentarios - 0.6, FIM);
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
      {sinal('2×', soma(PILHAS_ADMS, [0.9, 1.5, 0.4]), vis(t, T.dobro + 0.1, T.adm), tema.texto)}
      {sinal('20×', soma(PILHAS_TR, [0.4, 1.6, 0]), vis(t, T.vinte, T.esporte), tema.texto)}
      {sinal('?', [0, 2.6, 0.6], vis(t, T.duas, T.importa), tema.acento)}
      {numeroGrande('59%', 'GASTO COM PESSOAL · 2024', n59K, C.alerta)}
      {numeroGrande('54,35%', 'GASTO COM PESSOAL · 2025', n5435K, tema.texto)}
      {numeroGrande('67%', 'SEM O DESCONTO · CONTA DO VÍDEO', n67K, tema.acento)}
      {perg('1', 'QUE DEMISSÕES FORAM ESSAS?', T.q1, 1010)}
      {perg('2', 'QUAL NÚMERO VALE: 56% OU 42%?', T.q2, 1130)}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>ONDE UNA DEVIA GASTAR MAIS?</div>
            <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: rampa(t, T.comentarios, T.comentarios + 0.4)}}>COMENTA AQUI</div>
            {t >= T.segue ? <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 900, letterSpacing: -1, color: tema.acento, marginTop: 10, opacity: rampa(t, T.segue + 0.2, T.segue + 0.7)}}>@eumagnoleite</div> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/una.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  s.push({t: T.primeiro - 0.1, f: 'whoosh', v: 0.2});
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.15}));
  // mapa
  s.push({t: quando('milhoes de reais'), f: 'pop', v: 0.22});
  s.push({t: T.abri, f: 'pop', v: 0.16});
  [T.n72, T.n43, quando('11'), quando('24')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  // pilhas que deslizam: pop baixinho
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 3) s.push({t: v.t + j * 0.035 + 0.6, f: 'pop', v: 0.07});
  });
  s.push({t: T.impostos + 0.1, f: 'subida', v: 0.18});
  [T.n23, T.n693, T.n38, T.n7300, T.n59, T.n31, T.n22, T.n5, T.n38c, T.n32, T.n23t, T.n12, T.n100, T.n29, T.n43d].forEach((t) => s.push({t, f: 'pop', v: 0.22}));
  s.push({t: T.n124, f: 'subida', v: 0.16});
  s.push({t: T.entrou + 0.2, f: 'ding', v: 0.16});
  s.push({t: T.g104 + 0.3, f: 'baque', v: 0.22});
  s.push({t: T.g133 + 0.2, f: 'subida', v: 0.16});
  s.push({t: T.vinte, f: 'pop', v: 0.2});
  [T.infra, T.hab, T.meio].forEach((t) => s.push({t: t + 0.3, f: 'baque', v: 0.22}));
  s.push({t: T.so2 + 0.6, f: 'pop', v: 0.18});
  // salários e teto
  s.push({t: T.dois, f: 'pop', v: 0.2});
  s.push({t: T.teto, f: 'subida', v: 0.2});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.a2024, f: 'subida', v: 0.22});
  s.push({t: T.n59p + 0.3, f: 'baque', v: 0.22});
  s.push({t: T.n5435, f: 'pop', v: 0.2});
  s.push({t: T.tirou + 0.2, f: 'baque', v: 0.24});
  s.push({t: T.permite, f: 'tique', v: 0.16});
  s.push({t: T.semDesc + 0.3, f: 'subida', v: 0.22});
  s.push({t: T.n67, f: 'ding', v: 0.22});
  // dois relatórios
  s.push({t: T.a2026 + 0.4, f: 'subida', v: 0.16});
  s.push({t: T.n56p, f: 'pop', v: 0.22});
  s.push({t: T.n42, f: 'pop', v: 0.22});
  s.push({t: T.com22 + 0.2, f: 'baque', v: 0.24});
  s.push({t: T.duas, f: 'ding', v: 0.2});
  s.push({t: T.q1, f: 'pop', v: 0.18});
  s.push({t: T.q2, f: 'pop', v: 0.18});
  // lei
  for (let i = 0; i < 8; i++) s.push({t: T.meses + 0.3 + i * 0.16, f: 'bip', v: 0.06});
  s.push({t: T.verbas + 0.35, f: 'impacto', v: 0.22});
  // mínimos
  s.push({t: T.cumprido + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.min15, f: 'ding', v: 0.2});
  s.push({t: T.min25, f: 'ding', v: 0.2});
  // fim
  for (let i = 0; i < 9; i++) s.push({t: T.emQual + 0.6 + i * 0.25, f: 'bip', v: 0.08});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.9, 2.8, 5.2, 7.2, 9.0, 13.0, 16.4, 21.4, 23.0, 25.4, T.impostos + 0.7, T.n23 + 0.5, T.iss + 1.0, T.n693 + 0.6, T.n38 + 0.5, T.n124 + 1.0, T.n7300 + 0.4,
  T.paraOnde + 0.8, T.n59 + 1.2, T.tresDe4 + 0.8, T.n31 + 1.0, T.n148 + 1.0, T.g104 + 0.9, T.g133 + 1.0, T.dobro + 0.5, T.n22 + 1.0, T.n5 + 0.6, T.n38c + 0.8, T.n32 + 0.8,
  T.n23t + 0.6, T.n12 + 0.4, T.vinte + 0.4, T.n100 + 0.4, T.infra + 0.6, T.meio + 0.6, T.n29 + 0.6, T.so2 + 0.9, T.n43d + 0.6, T.salarios + 1.0, T.dois + 0.6,
  T.teto + 1.2, T.n54 + 0.6, T.n59p + 0.8, T.n5435 + 0.8, T.porPouco + 0.5, T.n16 + 0.8, T.permite + 0.3, T.linhaZero + 0.3, T.n67 + 0.6, T.a2026 + 1.6, T.n56p + 0.6,
  T.n42 + 0.6, T.com22 + 1.0, T.q1 + 0.5, T.q2 + 0.6, T.meses + 1.2, T.verbas + 0.6, T.n22p + 1.0, T.edu31 + 1.2, T.emQual + 1.2, T.comentarios + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoUna: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Una" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['132 milhões.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoUna: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE UNA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
