import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Bengala, CofreFGTS, Cone, Lupa, Onibus, Quepe, RoloCompactador} from '../../pecas';
import {PontoOnibus} from '../onibusilheus/pecas';
import {
  BancoDivida,
  BaseDefesaCivil,
  CamaraVereadores,
  CopoPiso,
  EstacaoSaneamento,
  Escola,
  MesaMaquete,
  PilhasDinheiro,
  PostoGuarda,
  PostoSaude,
  PredioAssistencia,
  PredioTCM,
  Prefeitura,
  ReguaLimite,
  RuaServicos,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from '../orcamentoitabuna/pecas';
import {ConjuntoHabitacao, Pedestal, PredioPrevidencia, TorresSP} from './pecas';
import {PALAVRAS} from './palavras';

// 020. orçamento de são paulo (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda (mesma série do 014 e do 017: cofre da prefeitura no meio,
// aqui 1 pilha = R$ 1 BILHÃO, torres de São Paulo ao fundo) e encaixa os dois trechos de mapa do Kit Mapas
// (projetos/020.../mapas/sao-paulo.mp4, composição OrcamentoSp do kit), seguidos, com o MESMO relógio.
// Todo número vem dos PDFs da Prefeitura de São Paulo (Secretaria da Fazenda), com selo de documento e página.
// Neutro: sem nome de prefeito nem partido. Nenhum número de outra cidade.
// Plano: projetos/020. orçamento de são paulo/plano.md.

export const FPS = 30;
const AUDIO_SEG = 180.41;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '020. orçamento de são paulo';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bi: quando('117 bilhoes'),
  federal: quando('governo federal'),
  iss: quando('o ISS'),
  paraOnde: quando('para onde foi'),
  doMaior: quando('Do maior'),
  educ: quando('Educacao 24'),
  n24: quando('24 bilhoes'),
  maiorFatia: quando('A maior fatia'),
  repara: quando('E repara'),
  creches: quando('as creches'),
  n12c: quando('levaram 12'),
  quaseDobro: quando('Quase o dobro do ensino'),
  fundamental: quando('ensino fundamental'),
  quase7: quando('quase 7'),
  saude: quando('Saude 23'),
  n23: quando('23 bilhoes'),
  previsto: quando('estava previsto'),
  n22: quando('eram 22'),
  meio: quando('dividiu quase ao meio'),
  postos: quando('postos de saude'),
  n95: quando('9 bilhoes e meio'),
  hospitais: quando('quase 10 para hospitais'),
  terceira: quando('E a terceira'),
  aposent: quando('As aposentadorias'),
  n15: quando('15 bilhoes'),
  maisTransp: quando('Mais do que todo'),
  transp: quando('Transporte 11'),
  n11: quando('11 bilhoes e meio'),
  onibus: quando('para os onibus'),
  ruas: quando('Ruas e servicos'),
  n9: quando('quase 9 bilhoes'),
  n65: quando('Mais de 6 e meio'),
  limpeza: quando('limpeza'),
  iluminacao: quando('iluminacao'),
  manutencao: quando('manutencao'),
  adm: quando('A administracao'),
  n3: quando('3 bilhoes'),
  divida: quando('a divida da cidade'),
  n23d: quando('levou 2,3'),
  juros: quando('entre juros'),
  assist: quando('Assistencia social'),
  n26: quando('2,6 bilhoes'),
  seg: quando('Seguranca publica'),
  n17: quando('1,7 bilhao'),
  n47: quando('47 milhoes'),
  defesa: quando('defesa civil'),
  camara: quando('A Camara de Vereadores'),
  tribunal: quando('Tribunal de Contas'),
  n13: quando('1,3 bilhao'),
  cultura: quando('Cultura'),
  n11c: quando('1,1 bilhao'),
  turismo: quando('Turismo'),
  n751: quando('751'),
  esporte: quando('Esporte e lazer'),
  n734: quando('734'),
  cidadania: quando('Direitos da cidadania'),
  n700: quando('700'),
  ambiente: quando('Meio ambiente'),
  n650: quando('650'),
  trabalho: quando('Trabalho e emprego'),
  n500: quando('quase 500'),
  comunic: quando('Comunicacoes'),
  n353: quando('353'),
  n194: quando('194'),
  pequenas: quando('as contas pequenas'),
  relacoes: quando('Relacoes exteriores'),
  n18: quando('18 milhoes'),
  agric: quando('Agricultura'),
  n9m: quando('9 milhoes'),
  rural: quando('zona rural'),
  aquela: quando('E aquela area'),
  ciencia: quando('Ciencia e tecnologia'),
  n57: quando('5,7 milhoes'),
  inteiro: quando('ano inteiro'),
  papel: quando('o que ficou no papel'),
  habit: quando('Habitacao'),
  n54h: quando('previstos 5,4'),
  sairam32: quando('Sairam 3,2'),
  em2024: quando('Em 2024'),
  saneam: quando('Saneamento'),
  n13s: quando('1,3 bilhao', 2),
  anoAnt: quando('No ano anterior'),
  somando: quando('E somando'),
  obras: quando('obras e equipamentos'),
  n15p: quando('15 bilhoes previstos'),
  sairam8: quando('Sairam 8'),
  metade: quando('Pouco mais da metade'),
  limite: quando('estao no limite'),
  nao: quando('Nao A lei'),
  n54: quando('ate 54'),
  salarios: quando('com salarios'),
  n27: quando('gastou 27'),
  metadeTeto: quando('Metade do teto'),
  minimos: quando('Os minimos'),
  cumpridos: quando('foram cumpridos'),
  fimAno: quando('no fim do ano'),
  n6: quando('6 bilhoes'),
  seEsses: quando('Se esses'),
  seus: quando('fossem seus'),
  qualArea: quando('em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'SÃO PAULO 2025'],
  [T.federal - 1.8, 'QUEM PAGA'],
  [T.paraOnde, 'PARA ONDE FOI'],
  [T.educ, 'EDUCAÇÃO'],
  [T.saude, 'SAÚDE'],
  [T.terceira, 'A 3ª MAIOR CONTA'],
  [T.transp, 'TRANSPORTE'],
  [T.ruas, 'RUAS E SERVIÇOS'],
  [T.adm, 'ADMINISTRAÇÃO E DÍVIDA'],
  [T.assist, 'ASSISTÊNCIA SOCIAL'],
  [T.seg, 'SEGURANÇA'],
  [T.camara, 'CÂMARA E TRIBUNAL'],
  [T.cultura, 'AS OUTRAS ÁREAS'],
  [T.pequenas, 'AS CONTAS PEQUENAS'],
  [T.papel, 'O QUE FICOU NO PAPEL'],
  [T.limite, 'OS SALÁRIOS'],
  [T.minimos, 'OS MÍNIMOS'],
  [T.fimAno, 'A SOBRA'],
  [T.seEsses, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-6.2, 0, -2.0];
const PILHAS_EDU: V3 = [-4.2, 0, -1.2];
const HOSP: V3 = [-1.2, 0, -5.7];
const PILHAS_SAU: V3 = [-1.3, 0, -3.6];
const PREV: V3 = [2.6, 0, -5.5];
const PILHAS_PREV: V3 = [2.0, 0, -3.6];
const PILHAS_PREV_FANT: V3 = [3.9, 0, -3.3];
const IDOSOS: V3[] = [
  [1.3, 0, -4.6],
  [1.8, 0, -4.4],
  [3.5, 0, -4.4],
];
const PONTO: V3 = [1.0, 0, 5.05];
const RUA_BUS_Z = 6.0;
const PILHAS_BUS: V3 = [1.6, 0, 3.6];
const RUA: V3 = [-3.6, 0, 4.6];
const PILHAS_RUA: V3 = [-3.6, 0, 3.0];
const PREF: V3 = [5.3, 0, -3.8];
const PILHAS_ADM: V3 = [4.1, 0, -2.2];
const BANCO: V3 = [5.6, 0, 5.0];
const PILHAS_DIV: V3 = [4.0, 0, 3.4];
const ASSIST: V3 = [-7.0, 0, 1.6];
const PILHAS_ASS: V3 = [-5.3, 0, 1.3];
const GUARDA: V3 = [6.6, 0, -1.1];
const BONECO_G: V3 = [5.7, 0, -0.1];
const PILHAS_SEG: V3 = [5.0, 0, -0.6];
const DEFESA: V3 = [6.8, 0, 1.9];
const PILHAS_DEF: V3 = [5.4, 0, 1.4];
const CAMARA: V3 = [-4.0, 0, -5.8];
const TCM: V3 = [-6.6, 0, -4.4];
const PILHAS_CAM: V3 = [-4.2, 0, -3.9];
const HABIT: V3 = [-1.9, 0, -1.0];
const PILHAS_HAB: V3 = [-1.9, 0, 0.6];
const SANEAM: V3 = [2.3, 0, -1.1];
const PILHAS_SAN: V3 = [1.9, 0, 0.6];
const PILHAS_OBR: V3 = [0, 0, 2.7];
const OBRA: V3 = [-2.0, 0, 2.9];
const REGUA: V3 = [0, 0, 0];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.7];
const ARVORES: V3[] = [
  [-7.8, 0, 3.8],
  [-6.4, 0, 6.2],
  [-1.6, 0, 8.2],
  [7.6, 0, 3.6],
];

// a vitrine das áreas menores: 10 pedestais num arco em volta do centro (da esquerda para a direita, na ordem da fala)
type Vit = {nome: string; n: number; t: number; a: number; valor: string; sub: string};
const VITRINE: Vit[] = [
  {nome: 'CULTURA', n: 1.1077, t: T.n11c, a: T.cultura, valor: '1,1 BI', sub: 'R$ 1,108 BI · CULTURA'},
  {nome: 'TURISMO', n: 0.7507, t: T.n751, a: T.turismo, valor: '751 MI', sub: 'TURISMO'},
  {nome: 'ESPORTE', n: 0.7341, t: T.n734, a: T.esporte, valor: '734 MI', sub: 'ESPORTE E LAZER'},
  {nome: 'CIDADANIA', n: 0.7015, t: T.n700, a: T.cidadania, valor: '700 MI', sub: 'R$ 701,5 MI · DIREITOS DA CIDADANIA'},
  {nome: 'AMBIENTE', n: 0.6518, t: T.n650, a: T.ambiente, valor: '650 MI', sub: 'R$ 651,8 MI · MEIO AMBIENTE'},
  {nome: 'TRABALHO', n: 0.4875, t: T.n500, a: T.trabalho, valor: 'QUASE 500 MI', sub: 'R$ 487,5 MI · TRABALHO'},
  {nome: 'COMUNIC.', n: 0.3532, t: T.n353, a: T.comunic, valor: '353 MI', sub: 'COMUNICAÇÕES'},
  {nome: 'EXTERIOR', n: 0.0182, t: T.n18, a: T.relacoes, valor: '18 MI', sub: 'RELAÇÕES EXTERIORES'},
  {nome: 'AGRICULT.', n: 0.0092, t: T.n9m, a: T.agric, valor: '9 MI', sub: 'AGRICULTURA'},
  {nome: 'C&T', n: 0.0057, t: T.n57, a: T.ciencia, valor: '5,7 MI', sub: 'CIÊNCIA E TECNOLOGIA'},
];
const VIT_POS: V3[] = VITRINE.map((_, i) => {
  const a = ((-70 + (140 * i) / 9) * Math.PI) / 180;
  return [Math.sin(a) * 2.5, 0, Math.cos(a) * 2.5 - 0.6];
});

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 1 bilhão) ----------
// 117 pilhas no anel em volta do cofre (117 bilhões). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 30],
      [2.3, 32],
      [2.7, 29],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
// tons de dentro de uma área (ex.: creches × ensino fundamental): [até quantas pilhas, a partir de quando, cor]
type Faixa2 = {ate: number; de: number; a: number; tom: 'aceso' | 'claro'};
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; cena?: number; faixas?: Faixa2[]};
const VOOS: Voo[] = [
  {n: 23.584, t: T.n24, centro: PILHAS_EDU, cols: 6, slots: 24, fim: T.creches, cena: T.saude, faixas: [{de: 0, ate: 12.434, a: T.n12c, tom: 'aceso'}, {de: 12.434, ate: 19.19, a: T.fundamental, tom: 'claro'}]},
  {n: 23.342, t: T.n23, centro: PILHAS_SAU, cols: 6, slots: 24, fim: T.meio, cena: T.terceira, faixas: [{de: 0, ate: 9.466, a: T.postos, tom: 'aceso'}, {de: 9.466, ate: 19.139, a: T.hospitais, tom: 'claro'}]},
  {n: 15.371, t: T.n15, centro: PILHAS_PREV, cols: 4, slots: 16, fim: T.transp},
  {n: 11.538, t: T.n11, centro: PILHAS_BUS, cols: 4, slots: 12, fim: T.onibus, cena: T.ruas, faixas: [{de: 0, ate: 9.695, a: T.onibus, tom: 'aceso'}]},
  {n: 8.554, t: T.n9, centro: PILHAS_RUA, cols: 3, slots: 9, fim: T.n65, cena: T.adm, faixas: [{de: 0, ate: 6.558, a: T.n65, tom: 'aceso'}]},
  {n: 3.068, t: T.n3, centro: PILHAS_ADM, cols: 2, slots: 4, fim: T.divida},
  {n: 2.311, t: T.n23d, centro: PILHAS_DIV, cols: 2, slots: 3, fim: T.assist},
  {n: 2.607, t: T.n26, centro: PILHAS_ASS, cols: 2, slots: 3, fim: T.seg},
  {n: 1.665, t: T.n17, centro: PILHAS_SEG, cols: 2, slots: 2, fim: T.camara},
  {n: 1.322, t: T.n13, centro: PILHAS_CAM, cols: 2, slots: 2, fim: T.cultura},
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

// o cofre e as pilhas do anel saem de cena na vitrine e o cofre volta na sobra do fim do ano
const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.cultura - 0.4, T.cultura + 0.6)) + rampa(t, T.fimAno - 0.4, T.fimAno + 0.5) * (1 - rampa(t, T.seEsses + 0.6, T.seEsses + 1.4));

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  // as pilhas das áreas afundam quando a vitrine sobe (e voltam no fim, quando os prédios acendem de novo)
  const afunda = 0.9 * rampa(t, T.cultura - 0.3, T.cultura + 0.7) * (1 - rampa(t, T.seEsses, T.seEsses + 1.2));
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.008, T.paraOnde + 0.5 + i * 0.008);
      const v = DO_VOO[i];
      let pos: V3 = p;
      let n = nasce;
      let corP = ouro;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.035;
        const kv = rampa(t, a, a + 0.7);
        pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        let k = janela(t, voo.t, voo.fim, 0.4);
        // os tons de dentro da área (até a cena seguinte)
        (voo.faixas ?? []).forEach((f) => {
          if (j >= f.de - 0.001 && j < f.ate) {
            const sep = janela(t, f.a, voo.cena ?? voo.fim, 0.5);
            if (sep > 0.01) {
              corP = f.tom === 'aceso' ? aceso(sep) : claro(sep);
              k = 0;
            }
          }
        });
        if (k > 0) corP = aceso(k);
        // no fim, quando os prédios acendem de novo, as pilhas voltam
        solidas.push({p: desce(pos), n, cor: corP});
        return;
      }
      // pilhas que ficam no anel: afundam com o cofre na vitrine e não voltam
      const fora = rampa(t, T.cultura - 0.4, T.cultura + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: n * (1 - fora), cor: corP});
    });
  }
  // "mais do que todo o transporte": as 11,5 pilhas do transporte, transparentes, ao lado das 15 da previdência
  const someFT = 1 - rampa(t, T.transp - 0.2, T.transp + 0.4);
  if (t >= T.maisTransp && someFT > 0.01) fantasmas.push(...encher(grade(PILHAS_PREV_FANT, 12, 3), 11.538 * rampa(t, T.maisTransp, T.maisTransp + 0.8) * someFT, ouro));
  // a defesa civil: 47 milhões (uma fatia fininha de pilha) ao lado da base
  const someDef = 1 - rampa(t, T.cultura - 0.3, T.cultura + 0.5);
  if (t >= T.n47 && someDef > 0.01) solidas.push({p: PILHAS_DEF, n: 0.047 * rampa(t, T.n47, T.n47 + 0.5) * someDef, cor: aceso(janela(t, T.n47, T.camara, 0.4))});
  // a vitrine: cada área menor ganha a sua pilha (ou o pedacinho dela) em cima do pedestal
  const vitK = rampa(t, T.cultura, T.cultura + 0.6) * (1 - rampa(t, T.papel, T.papel + 0.6));
  if (vitK > 0.01) {
    VITRINE.forEach((v, i) => {
      if (t < v.t - 0.1) return;
      const g = rampa(t, v.t, v.t + 0.6);
      const topo = soma(VIT_POS[i], [0, 0.3 - 0.6 * (1 - vitK), 0]);
      const ac = janela(t, v.a, i + 1 < VITRINE.length ? VITRINE[i + 1].a : T.papel, 0.4);
      const cheia = Math.min(1, v.n);
      solidas.push({p: topo, n: Math.max(0.004, cheia) * g, cor: ac > 0.01 ? aceso(ac) : ouro});
      if (v.n > 1) solidas.push({p: soma(topo, [0.36, 0, 0]), n: (v.n - 1) * g, cor: ac > 0.01 ? aceso(ac) : ouro});
    });
  }
  // o que ficou no papel: habitação (5,4 previstos × 3,2), saneamento (1,3; em 2024, 2), obras (15 previstos × 8)
  const papelFora = 1 - rampa(t, T.limite - 0.2, T.limite + 0.6);
  if (t >= T.n54h && papelFora > 0.01) {
    const pos = grade(PILHAS_HAB, 6, 3);
    fantasmas.push(...encher(pos, 5.406 * rampa(t, T.n54h, T.n54h + 0.8) * papelFora, ouro));
    if (t >= T.sairam32) solidas.push(...encher(pos, 3.235 * rampa(t, T.sairam32, T.sairam32 + 0.6) * papelFora, aceso(janela(t, T.sairam32, T.saneam, 0.4))));
  }
  if (t >= T.n13s && papelFora > 0.01) {
    const pos = grade(PILHAS_SAN, 3, 3);
    solidas.push(...encher(pos, 1.31 * rampa(t, T.n13s, T.n13s + 0.6) * papelFora, aceso(janela(t, T.n13s, T.somando, 0.4))));
    if (t >= T.anoAnt) fantasmas.push(...encher(pos, 2.033 * rampa(t, T.anoAnt, T.anoAnt + 0.7) * papelFora, ouro));
  }
  if (t >= T.n15p && papelFora > 0.01) {
    const pos = grade(PILHAS_OBR, 16, 6);
    fantasmas.push(...encher(pos, 15.39 * rampa(t, T.n15p, T.n15p + 0.9) * papelFora, ouro));
    if (t >= T.sairam8) solidas.push(...encher(pos, 8.39 * rampa(t, T.sairam8, T.sairam8 + 0.7) * papelFora, aceso(janela(t, T.sairam8, T.limite, 0.4))));
  }
  // a sobra do fim do ano: 6,4 pilhas voltam para a frente do cofre
  const sobraK = rampa(t, T.n6 - 0.2, T.n6 + 0.6) * (1 - rampa(t, T.seEsses + 0.6, T.seEsses + 1.4));
  if (sobraK > 0.01) solidas.push(...encher(grade(PILHAS_SOBRA, 7, 4), 6.443 * sobraK, aceso(janela(t, T.n6, T.seEsses + 0.6, 0.4))));
  return {solidas, fantasmas};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam meio metro quando a vitrine sobe no centro e voltam no fim
  const fora = 0.25 * rampa(t, T.cultura - 0.3, T.cultura + 0.7) * (1 - rampa(t, T.seEsses, T.seEsses + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.seEsses + 0.6 + i * 0.22, FIM + 1, 0.4);
  const ck = cofreK(t);
  // vitrine
  const vitK = rampa(t, T.cultura - 0.2, T.cultura + 0.6) * (1 - rampa(t, T.papel, T.papel + 0.6));
  // ônibus e ponto
  const busK = vis(t, T.transp - 0.2, T.cultura);
  const busX = 4.6 - 3.0 * rampa(t, T.transp - 0.2, T.onibus + 0.6, sai);
  const pontoK = predio(T.n11 - 0.2);
  // guarda
  const guardaK = vis(t, T.seg - 0.2, T.cultura);
  // idosos da previdência
  const idososK = vis(t, T.aposent, T.cultura);
  // o que ficou no papel: os prédios do centro
  const papelFora = 1 - rampa(t, T.limite - 0.2, T.limite + 0.6);
  const habK = rampa(t, T.habit - 0.2, T.habit + 0.6) * papelFora;
  const sanK = rampa(t, T.saneam - 0.2, T.saneam + 0.6) * papelFora;
  const obraK = vis(t, T.obras - 0.1, T.limite);
  // régua do teto
  const reguaK = rampa(t, T.limite + 0.2, T.limite + 1.2) * (1 - rampa(t, T.minimos, T.minimos + 0.8));
  const nivel = 26.82 * rampa(t, T.salarios - 0.2, T.n27 + 0.4);
  // copos
  const coposK = rampa(t, T.minimos + 0.3, T.minimos + 1.1) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  const nivelSau = 23.85 * rampa(t, T.minimos + 0.6, T.minimos + 1.8);
  const nivelEdu = 25.17 * rampa(t, T.minimos + 1.0, T.cumpridos + 0.2);
  // lupa da ciência e tecnologia
  const lupaK = vis(t, T.ciencia, T.papel - 0.2);
  const iCT = VITRINE.length - 1;

  return (
    <group>
      <MesaMaquete tema={tema} />
      <TorresSP tema={tema} luz={0.6 + 0.4 * rampa(t, T.paraOnde, T.paraOnde + 1)} />
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < T.cultura ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n6, T.n6 + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.educ + 0.6), janela(t, T.n6, T.seEsses, 0.5))} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1500} />
      <PilhasDinheiro pilhas={fantasmas} max={700} opacidade={0.3} largura={1.12} />

      {/* educação e saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.26} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.2} escala={1.15} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.terceira, 0.5), fim(1))} />

      {/* a previdência e os aposentados */}
      <PredioPrevidencia tema={tema} pos={PREV} rotY={-0.3} escala={0.85} sobe={predio(T.aposent)} aceso={Math.max(janela(t, T.aposent, T.transp, 0.5), fim(2))} />
      {idososK > 0.02
        ? IDOSOS.map((p, i) => {
            const k = entra(t, T.aposent + 0.3 + i * 0.12, 0.45) * idososK;
            return k > 0.02 ? (
              <Boneco key={i} tema={tema} pos={p} rotY={0.2 - i * 0.2} escala={0.45 * Math.min(1, k)} cor={[tema.objeto, tema.objetoClaro, tema.pessoa][i]}>
                <Bengala tema={tema} k={1} />
              </Boneco>
            ) : null;
          })
        : null}

      {/* transporte: ponto e ônibus */}
      {pontoK > 0.02 ? (
        <group position={PONTO} rotation={[0, Math.PI / 2, 0]} scale={0.5}>
          <PontoOnibus tema={tema} pos={[0, 0, 0]} sobe={pontoK} aceso={Math.max(janela(t, T.onibus, T.ruas, 0.5), fim(3))} />
        </group>
      ) : null}
      {pontoK > 0.02 ? <Caixa args={[4.8, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[1.6, 0.1 - 0.2 * (1 - pontoK), RUA_BUS_Z]} sombra={false} /> : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}

      {/* ruas e serviços */}
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={predio(T.ruas)} luz={Math.max(rampa(t, T.iluminacao - 0.2, T.iluminacao + 0.6) * (1 - rampa(t, T.adm, T.adm + 0.6)), fim(4))} caminhaoX={2.4 - 4.6 * rampa(t, T.limpeza - 0.4, T.limpeza + 4.0)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.ruas))} />

      {/* administração e dívida */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.7} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.divida, 0.5), fim(5))} />
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.7} escala={0.85} sobe={predio(T.divida)} aceso={Math.max(janela(t, T.divida, T.assist, 0.5), fim(6))} />

      {/* assistência social */}
      <PredioAssistencia tema={tema} pos={ASSIST} rotY={1.1} escala={0.85} sobe={predio(T.assist)} aceso={Math.max(janela(t, T.assist, T.seg, 0.5), fim(7))} />

      {/* segurança e defesa civil */}
      <PostoGuarda tema={tema} pos={GUARDA} rotY={-1.36} escala={0.85} sobe={predio(T.seg)} aceso={Math.max(janela(t, T.seg, T.camara, 0.5), fim(8))} />
      {guardaK > 0.02 ? (
        <Boneco tema={tema} pos={BONECO_G} rotY={-0.9} escala={0.5 * Math.min(1, guardaK)} cor={tema.objeto}>
          <Quepe tema={tema} />
        </Boneco>
      ) : null}
      <BaseDefesaCivil tema={tema} pos={DEFESA} rotY={-1.2} escala={0.8} sobe={predio(T.defesa - 0.6)} aceso={Math.max(janela(t, T.defesa - 0.4, T.camara, 0.5), fim(9))} />

      {/* Câmara de Vereadores e Tribunal de Contas do Município */}
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={0.45} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.cultura, 0.5), fim(10))} />
      <PredioTCM tema={tema} pos={TCM} sobe={predio(T.tribunal)} aceso={Math.max(janela(t, T.tribunal, T.cultura, 0.5), fim(11))} escala={0.75} />

      {/* a vitrine das áreas menores */}
      {VITRINE.map((v, i) => (
        <Pedestal key={v.nome} tema={tema} pos={VIT_POS[i]} nome={v.nome} rotY={Math.atan2(VIT_POS[i][0], VIT_POS[i][2] + 6) * 0.6} sobe={vitK * entra(t, v.a - 0.3 - (i === 0 ? 0 : 0), 0.4)} aceso={janela(t, v.a, i + 1 < VITRINE.length ? VITRINE[i + 1].a : T.papel, 0.4)} />
      ))}
      {lupaK > 0.02 ? <Lupa tema={tema} pos={soma(VIT_POS[iCT], [0, 0.85, 0.25])} rot={[-0.9, 0, 0]} escala={0.45 * lupaK} /> : null}

      {/* o que ficou no papel */}
      <ConjuntoHabitacao tema={tema} pos={HABIT} rotY={0.2} escala={0.85} sobe={habK} aceso={janela(t, T.habit, T.saneam, 0.5)} />
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={-0.3} escala={0.6} sobe={sanK} aceso={janela(t, T.saneam, T.somando, 0.5)} />
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK) * 0.8}>
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} raio={0.03} cor={mistura(C.alerta, C.areia, 0.4)} position={[0, 0.17 + i * 0.22, 0]} />
          ))}
          {[0, 1].map((i) => (
            <Caixa key={i} args={[1.3, 0.06, 0.18]} raio={0.02} cor={C.madeira} position={[0.2, 0.1 + i * 0.07, 0.6 + i * 0.05]} rotation={[0, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[2.0, 0.06, 2.5]} k={0.7 * obraK} />
      <Cone tema={tema} pos={[2.2, 0.06, 3.2]} k={0.7 * obraK} />
      <RoloCompactador tema={tema} pos={[2.6, 0.06, 2.0]} rotY={-0.6} escala={0.3 * obraK} giro={t * 0.8} />

      {/* a régua do teto: 27% contra o máximo de 54% */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />

      {/* os copos dos mínimos */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.minimos + 0.3, T.minimos + 0.8)} nivel={nivelSau} acima={rampa(t, T.minimos + 1.6, T.minimos + 2.1)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.minimos + 0.6, T.minimos + 1.1)} nivel={nivelEdu} acima={rampa(t, T.cumpridos, T.cumpridos + 0.5)} />
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
      [T.paraOnde - 0.3, E([0, 0, 0.2], 16, 10.5, [0, 1.25, 1])],
      [T.educ - 0.2, E([0, 0, 0], 14.5, 9.5, [0.05, 1.2, 1])],
    ],
  },
  {
    ini: T.educ,
    arco: 0.04,
    chaves: [
      [T.educ, E([-5.0, 0.8, -1.6], 6.4, 4.6, [0.55, 0.95, 1])],
      [T.saude - 0.3, E([-4.9, 0.8, -1.5], 6.0, 4.4, [0.75, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-1.2, 0.9, -4.5], 6.6, 4.6, [0.3, 0.92, 1])],
      [T.terceira - 0.3, E([-1.2, 0.9, -4.4], 6.2, 4.4, [0.12, 0.92, 1])],
    ],
  },
  {
    ini: T.terceira - 0.1,
    arco: 0.04,
    chaves: [
      [T.terceira - 0.1, E([2.6, 0.9, -4.3], 6.8, 4.8, [-0.1, 0.9, 1])],
      [T.maisTransp, E([2.9, 0.9, -4.0], 7.4, 5.0, [-0.25, 0.9, 1])],
      [T.transp - 0.3, E([2.9, 0.9, -3.9], 7.0, 4.8, [-0.35, 0.9, 1])],
    ],
  },
  {
    ini: T.transp - 0.1,
    arco: 0.04,
    chaves: [
      [T.transp - 0.1, E([1.5, 0.6, 4.7], 5.6, 4.2, [0.1, 0.85, 1])],
      [T.ruas - 0.3, E([1.6, 0.6, 4.8], 5.2, 4.0, [0.25, 0.85, 1])],
    ],
  },
  {
    ini: T.ruas - 0.1,
    arco: 0.04,
    chaves: [
      [T.ruas - 0.1, E([-3.3, 0.8, 4.0], 6.4, 4.4, [0.15, 0.65, 1])],
      [T.adm - 0.3, E([-3.1, 0.8, 4.1], 6.0, 4.3, [0.3, 0.68, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.04,
    chaves: [
      [T.adm - 0.1, E([4.6, 1.0, -3.2], 6.0, 4.4, [-0.5, 0.92, 1])],
      [T.divida - 0.3, E([4.6, 1.0, -3.1], 5.6, 4.2, [-0.65, 0.92, 1])],
      [T.divida + 0.4, E([4.7, 0.8, 4.2], 6.0, 4.4, [-0.35, 0.75, 1])],
      [T.assist - 0.3, E([4.7, 0.8, 4.2], 5.6, 4.2, [-0.5, 0.75, 1])],
    ],
  },
  {
    ini: T.assist - 0.1,
    arco: 0.04,
    chaves: [
      [T.assist - 0.1, E([-6.0, 0.9, 1.4], 6.2, 4.4, [0.6, 0.8, 1])],
      [T.seg - 0.3, E([-5.9, 0.9, 1.4], 5.8, 4.2, [0.75, 0.8, 1])],
    ],
  },
  {
    ini: T.seg - 0.1,
    arco: 0.04,
    chaves: [
      [T.seg - 0.1, E([5.7, 0.9, 0.2], 7.2, 5.0, [-0.6, 0.8, 1])],
      [T.defesa - 0.6, E([5.8, 0.8, 0.8], 6.4, 4.6, [-0.5, 0.78, 1])],
      [T.camara - 0.3, E([5.8, 0.8, 0.9], 6.0, 4.4, [-0.4, 0.78, 1])],
    ],
  },
  {
    ini: T.camara - 0.1,
    arco: 0.04,
    chaves: [
      [T.camara - 0.1, E([-4.8, 0.9, -4.8], 6.8, 4.8, [0.45, 0.95, 1])],
      [T.cultura - 0.4, E([-4.9, 0.9, -4.8], 6.4, 4.6, [0.6, 0.95, 1])],
    ],
  },
  {
    ini: T.cultura - 0.1,
    arco: 0.03,
    chaves: [
      [T.cultura - 0.1, E([-0.8, 0.3, -1.4], 7.0, 5.6, [-0.12, 0.85, 1])],
      [T.ambiente, E([0.0, 0.3, -1.3], 7.2, 5.6, [0, 0.85, 1])],
      [T.comunic, E([0.6, 0.3, -1.4], 7.0, 5.6, [0.1, 0.85, 1])],
      [T.pequenas - 0.3, E([0.8, 0.3, -1.4], 6.8, 5.4, [0.15, 0.85, 1])],
    ],
  },
  {
    ini: T.pequenas - 0.1,
    arco: 0.03,
    chaves: [
      [T.pequenas - 0.1, E([1.7, 0.3, -0.4], 4.0, 3.4, [0.35, 0.75, 1])],
      [T.ciencia - 0.2, E([2.0, 0.3, -0.6], 3.6, 3.2, [0.45, 0.75, 1])],
      [T.n57 + 0.3, E([VIT_POS[9][0], 0.45, VIT_POS[9][2]], 1.8, 1.6, [0.5, 0.55, 1])],
      [T.papel - 0.3, E([VIT_POS[9][0], 0.45, VIT_POS[9][2]], 1.7, 1.5, [0.6, 0.55, 1])],
    ],
  },
  {
    ini: T.papel - 0.1,
    arco: 0.04,
    chaves: [
      [T.papel - 0.1, E([0, 0.6, 0.6], 8.0, 5.4, [0, 0.9, 1])],
      [T.habit + 0.2, E([-1.9, 0.7, -0.3], 4.0, 3.4, [0.25, 0.8, 1])],
      [T.saneam - 0.2, E([-1.7, 0.7, -0.3], 4.0, 3.4, [0.15, 0.8, 1])],
      [T.saneam + 0.4, E([2.0, 0.7, -0.3], 4.0, 3.4, [-0.2, 0.8, 1])],
      [T.somando - 0.2, E([1.9, 0.7, -0.2], 4.0, 3.4, [-0.3, 0.8, 1])],
      [T.obras + 0.2, E([0.2, 0.6, 2.4], 6.4, 4.4, [0, 0.9, 1])],
      [T.limite - 0.3, E([0.2, 0.6, 2.4], 6.0, 4.2, [0.1, 0.9, 1])],
    ],
  },
  {
    ini: T.limite - 0.1,
    arco: 0.04,
    chaves: [
      [T.limite - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.nao + 0.6, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.n27, E([0, 3.0, 0], 3.2, 7.2, [0.05, 0.28, 1])],
      [T.minimos - 0.2, E([0, 3.0, 0], 3.2, 7.0, [0.1, 0.28, 1])],
    ],
  },
  {
    ini: T.minimos - 0.1,
    arco: 0.04,
    chaves: [
      [T.minimos - 0.1, E([0, 1.9, 0], 6.4, 5.0, [0, 0.4, 1])],
      [T.fimAno - 0.3, E([0, 1.9, 0], 6.0, 4.8, [0.08, 0.4, 1])],
    ],
  },
  {
    ini: T.fimAno - 0.1,
    arco: 0.04,
    chaves: [
      [T.fimAno - 0.1, E([0, 0.8, 0.8], 5.4, 4.0, [0, 0.7, 1])],
      [T.seEsses - 0.2, E([0, 0.8, 0.9], 5.0, 3.8, [0.1, 0.7, 1])],
    ],
  },
  {
    ini: T.seEsses,
    chaves: [
      [T.seEsses, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
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
  {a: T.paraOnde + 0.3, b: T.educ, texto: 'DO MAIOR PARA O MENOR'},
  {a: T.maiorFatia, b: T.repara, texto: 'A MAIOR FATIA'},
  {a: T.creches, b: T.quaseDobro, texto: 'CRECHES E PRÉ-ESCOLAS'},
  {a: T.quaseDobro, b: T.saude, texto: 'QUASE O DOBRO DO ENSINO FUNDAMENTAL', destaque: true},
  {a: T.previsto, b: T.meio, texto: 'PREVISTO 22 BI · GASTO 23 BI', destaque: true},
  {a: T.meio, b: T.terceira, texto: 'QUASE AO MEIO'},
  {a: T.terceira, b: T.aposent, texto: 'A 3ª MAIOR CONTA?'},
  {a: T.aposent, b: T.maisTransp, texto: 'APOSENTADORIAS E PENSÕES DOS SERVIDORES', destaque: true},
  {a: T.maisTransp, b: T.transp, texto: 'MAIS DO QUE TODO O TRANSPORTE (11,5 BI)'},
  {a: T.onibus, b: T.ruas, texto: 'OS ÔNIBUS DA CIDADE', destaque: true},
  {a: T.ruas, b: T.limpeza, texto: 'RUAS E SERVIÇOS DA CIDADE'},
  {a: T.limpeza, b: T.adm, texto: 'LIMPEZA, ILUMINAÇÃO E MANUTENÇÃO'},
  {a: T.adm, b: T.divida, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.divida, b: T.assist, texto: 'A DÍVIDA: JUROS E PARCELAS'},
  {a: T.assist, b: T.seg, texto: 'ASSISTÊNCIA SOCIAL'},
  {a: T.seg, b: T.n47, texto: 'SEGURANÇA PÚBLICA'},
  {a: T.n47, b: T.camara, texto: 'DEFESA CIVIL: 47 MILHÕES'},
  {a: T.camara, b: T.tribunal, texto: 'CÂMARA DE VEREADORES'},
  {a: T.tribunal, b: T.cultura, texto: '+ TRIBUNAL DE CONTAS DO MUNICÍPIO'},
  {a: T.n194, b: T.pequenas, texto: 'COMUNICAÇÃO SOCIAL DA PREFEITURA: 194 MI', destaque: true},
  {a: T.pequenas, b: T.relacoes, texto: 'AGORA, AS CONTAS PEQUENAS'},
  {a: T.rural, b: T.aquela, texto: 'SIM, SÃO PAULO TEM ZONA RURAL'},
  {a: T.aquela, b: T.ciencia, texto: 'MENOS DE R$ 0,50 POR MORADOR?'},
  {a: T.inteiro, b: T.papel, texto: 'R$ 0,47 POR MORADOR NO ANO', destaque: true},
  {a: T.papel, b: T.habit, texto: 'O QUE FICOU NO PAPEL'},
  {a: T.habit, b: T.sairam32, texto: 'HABITAÇÃO: PREVISTO × GASTO'},
  {a: T.em2024, b: T.saneam, texto: 'EM 2024: 4,8 BI', destaque: true},
  {a: T.anoAnt, b: T.somando, texto: 'EM 2024: 2 BI', destaque: true},
  {a: T.somando, b: T.n15p, texto: 'SOMANDO TODAS AS ÁREAS'},
  {a: T.n15p, b: T.metade, texto: 'OBRAS E EQUIPAMENTOS'},
  {a: T.metade, b: T.limite, texto: 'POUCO MAIS DA METADE', destaque: true},
  {a: T.limite, b: T.nao, texto: 'AS CONTAS ESTÃO NO LIMITE?'},
  {a: T.nao, b: T.salarios, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.salarios, b: T.metadeTeto, texto: 'GASTO COM SALÁRIOS ÷ RECEITA'},
  {a: T.metadeTeto, b: T.minimos, texto: 'METADE DO TETO', destaque: true},
  {a: T.minimos, b: T.cumpridos, texto: 'OS MÍNIMOS DA LEI'},
  {a: T.cumpridos, b: T.fimAno, texto: 'CUMPRIDOS', destaque: true},
  {a: T.fimAno, b: T.seEsses, texto: 'RECEITAS − DESPESAS'},
];
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.n24, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE SÃO PAULO · ANEXO 2'},
  {a: T.n24, b: T.transp, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 2'},
  {a: T.transp, b: T.ruas, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4'},
  {a: T.ruas, b: T.adm, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 3 (URBANISMO)'},
  {a: T.adm, b: T.divida, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1'},
  {a: T.divida, b: T.assist, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (JUROS E AMORTIZAÇÃO)'},
  {a: T.assist, b: T.cultura, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1'},
  {a: T.cultura, b: T.aquela, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 1 A 4'},
  {a: T.aquela, b: T.papel, texto: 'CONTA DO VÍDEO: 5,7 MI ÷ 12,2 MI DE MORADORES = R$ 0,47', destaque: true},
  {a: T.papel, b: T.somando, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 3 (2024: RREO DEZ/2024 · P. 3)'},
  {a: T.somando, b: T.limite, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (INVESTIMENTOS)'},
  {a: T.limite, b: T.minimos, texto: 'FONTE: RGF DEZ/2025 · EXECUTIVO · TESOURO NACIONAL (SICONFI)'},
  {a: T.minimos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · ANEXO 14 · P. 1'},
  {a: T.fimAno, b: T.seEsses, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (SUPERÁVIT)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n24, b: T.n12c, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '24 BI', sub: 'R$ 23,58 BI · EDUCAÇÃO', cor: 'acento'},
  {a: T.n12c, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '12 BI', sub: 'CRECHES E PRÉ-ESCOLAS', cor: 'acento'},
  {a: T.quase7, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: 'QUASE 7 BI', sub: 'ENSINO FUNDAMENTAL'},
  {a: T.n23, b: T.n95, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '23 BI', sub: 'R$ 23,34 BI · SAÚDE', cor: 'acento'},
  {a: T.n95, b: T.terceira, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '9,5 BI', sub: 'POSTOS DE SAÚDE (ATENÇÃO BÁSICA)', cor: 'acento'},
  {a: T.hospitais, b: T.terceira, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: 'QUASE 10 BI', sub: 'HOSPITAIS E ATENDIMENTO ESPECIALIZADO'},
  {a: T.n15, b: T.transp, p: soma(PILHAS_PREV, [0, 1.1, 0.4]), valor: '15 BI', sub: 'R$ 15,37 BI · PREVIDÊNCIA', cor: 'acento'},
  {a: T.maisTransp + 0.3, b: T.transp, p: soma(PILHAS_PREV_FANT, [0, 0.9, 0]), valor: '11,5 BI', sub: 'TODO O TRANSPORTE', dy: 120},
  {a: T.n11, b: T.onibus, p: soma(PILHAS_BUS, [0, 1.1, 0]), valor: '11,5 BI', sub: 'R$ 11,54 BI · TRANSPORTE', cor: 'acento'},
  {a: T.onibus, b: T.ruas, p: soma(PILHAS_BUS, [0, 1.1, 0]), valor: 'QUASE 10 BI', sub: 'R$ 9,70 BI · ÔNIBUS', cor: 'acento'},
  {a: T.n9, b: T.n65, p: soma(PILHAS_RUA, [0, 1.1, 0]), valor: 'QUASE 9 BI', sub: 'R$ 8,55 BI · URBANISMO', cor: 'acento'},
  {a: T.n65, b: T.adm, p: soma(PILHAS_RUA, [0, 1.1, 0]), valor: 'MAIS DE 6,5 BI', sub: 'R$ 6,56 BI · SERVIÇOS URBANOS', cor: 'acento'},
  {a: T.n3, b: T.divida, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '3 BI', sub: 'R$ 3,07 BI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.n23d, b: T.assist, p: soma(PILHAS_DIV, [0, 1.1, 0]), valor: '2,3 BI', sub: 'JUROS R$ 0,69 + PARCELAS R$ 1,62 BI', cor: 'acento'},
  {a: T.n26, b: T.seg, p: soma(PILHAS_ASS, [0, 1.1, 0]), valor: '2,6 BI', sub: 'R$ 2,61 BI · ASSISTÊNCIA', cor: 'acento'},
  {a: T.n17, b: T.camara, p: soma(PILHAS_SEG, [0, 1.1, 0]), valor: '1,7 BI', sub: 'R$ 1,66 BI · SEGURANÇA', cor: 'acento'},
  {a: T.n47, b: T.camara, p: soma(PILHAS_DEF, [0, 0.5, 0]), valor: '47 MI', sub: 'DEFESA CIVIL', dy: 120},
  {a: T.n13, b: T.cultura, p: soma(PILHAS_CAM, [0, 1.1, 0]), valor: '1,3 BI', sub: 'CÂMARA R$ 857 MI + TCM R$ 407 MI', cor: 'acento'},
  {a: T.n54h, b: T.saneam, p: soma(PILHAS_HAB, [0, 1.1, -0.2]), valor: 'PREVISTO: 5,4 BI', sub: 'HABITAÇÃO'},
  {a: T.sairam32, b: T.saneam, p: soma(PILHAS_HAB, [0, 0.9, 0.4]), valor: '3,2 BI', sub: 'R$ 3,23 BI · GASTO', cor: 'acento', dy: 120},
  {a: T.n13s, b: T.somando, p: soma(PILHAS_SAN, [0, 1.1, 0]), valor: '1,3 BI', sub: 'R$ 1,31 BI · SANEAMENTO', cor: 'acento'},
  {a: T.anoAnt + 0.3, b: T.somando, p: soma(PILHAS_SAN, [0, 0.9, 0]), valor: '2024: 2 BI', sub: 'R$ 2,03 BI', dy: 120},
  {a: T.n15p, b: T.limite, p: soma(PILHAS_OBR, [0, 1.1, -0.2]), valor: 'PREVISTO: 15 BI', sub: 'OBRAS E EQUIPAMENTOS'},
  {a: T.sairam8, b: T.limite, p: soma(PILHAS_OBR, [0, 0.9, 0.4]), valor: '8 BI', sub: 'R$ 8,39 BI · GASTO', cor: 'acento', dy: 120},
  {a: T.n54, b: T.minimos - 0.2, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.minimos + 1.6, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(24) + 0.3, 0.6]), valor: '24%', sub: 'SAÚDE · RREO 23,85% · MÍN. 15%', cor: 'acento'},
  {a: T.cumpridos, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(25.2) + 0.3, 0.6]), valor: '25,2%', sub: 'EDUCAÇÃO · RREO 25,17% · MÍN. 25%', cor: 'acento'},
  {a: T.n6, b: T.seEsses + 0.6, p: soma(PILHAS_SOBRA, [0, 1.1, 0]), valor: '6 BI', sub: 'R$ 6,44 BI · RECEITAS − DESPESAS', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.limite);
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
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 1 BILHÃO</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.federal ? 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 · CONTA DO VÍDEO: 117 BI ÷ 12,2 MI DE MORADORES' : t < T.iss ? 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 (RECEITAS)' : 'FONTE: RREO DEZ/2025 · ANEXO 3 · P. 1 (ISS E IPTU)';
    const k = Math.min(entra(t, T.bi, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloMapa.length > 60 ? 14 : 18, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 210, Math.min(SEGURO.botoesX - 210, pj.x)), y: Math.max(640, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // rótulos que se encostam: um embaixo do outro (o mais antigo em cima)
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  // número grande da régua
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n27K = entra(t, T.n27, 0.5) * (1 - rampa(t, T.minimos - 0.3, T.minimos));
  // a lista das áreas menores, com barras do mesmo tamanho das pilhas (1,1 bi = barra cheia)
  const listaK = entra(t, T.cultura + 0.2, 0.5) * (1 - rampa(t, T.papel - 0.3, T.papel + 0.1));
  const pequenas = t >= T.pequenas - 0.2;
  const linhas = VITRINE.map((v, i) => ({v, i})).filter(({v, i}) => (pequenas ? i >= 7 : i < 7) && t >= v.t - 0.05);
  const lista =
    listaK > 0.01 && linhas.length > 0 ? (
      <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.botoesX + 30, top: 590, opacity: Math.min(1, listaK)}}>
        <div style={{background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, borderRadius: 18, padding: '14px 20px 10px'}}>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginBottom: 6}}>{pequenas ? 'AS CONTAS PEQUENAS · 2025' : 'AS OUTRAS ÁREAS · 2025'}</div>
          {linhas.map(({v, i}) => {
            const k = rampa(t, v.t - 0.05, v.t + 0.5);
            const acesa = janela(t, v.a, i + 1 < VITRINE.length ? VITRINE[i + 1].a : T.papel, 0.4);
            const larg = Math.max(0.6, (v.n / 1.11) * 100) * k;
            return (
              <div key={v.nome} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '5px 0', opacity: Math.min(1, k * 1.5)}}>
                <div style={{width: 260, fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 1, color: acesa > 0.3 ? tema.texto : tema.textoSuave, whiteSpace: 'nowrap'}}>{v.sub.split(' · ').pop()!.replace('DIREITOS DA ', '').replace('ESPORTE E LAZER', 'ESPORTE')}</div>
                <div style={{flex: 1, height: 18, borderRadius: 9, background: mistura(tema.cartao, tema.objeto, 0.4), overflow: 'hidden'}}>
                  <div style={{width: `${larg}%`, height: '100%', borderRadius: 9, background: acesa > 0.3 ? mistura(C.ouro, tema.branco, 0.25) : C.ouro}} />
                </div>
                <div style={{width: 150, textAlign: 'right', fontFamily: FONTE, fontSize: 26, fontWeight: 900, color: acesa > 0.3 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>{v.valor}</div>
              </div>
            );
          })}
        </div>
      </div>
    ) : null;
  const comentaK = vis(t, T.qualArea, FIM);
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
      {lista}
      {numeroGrande('27%', 'SALÁRIOS · TETO 54%', n27K, tema.acento)}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>SE OS 6 BI FOSSEM SEUS?</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/sao-paulo.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  // mapa
  s.push({t: T.bi + 0.6, f: 'pop', v: 0.22});
  [quando('5 bilhoes'), quando('O estado 12', 1, true), quando('mais 8', 1, true), quando('67 bilhoes'), quando('39 bilhoes'), quando('deu 18', 1, true)].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: quando('6 vem'), f: 'ding', v: 0.16});
  // pilhas que deslizam: pop baixinho
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.035 + 0.6, f: 'pop', v: 0.07});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n24, T.n12c, T.quase7, T.n23, T.n95, T.hospitais, T.n15, T.n11, T.n9, T.n3, T.n23d, T.n26, T.n17, T.n47, T.n13].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.maisTransp + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.onibus, f: 'pop', v: 0.16});
  // vitrine
  s.push({t: T.cultura, f: 'subida', v: 0.16});
  VITRINE.forEach((v) => s.push({t: v.t, f: 'pop', v: 0.2}));
  s.push({t: T.n57 + 0.2, f: 'baque', v: 0.22});
  s.push({t: T.inteiro, f: 'bip', v: 0.16});
  // papel
  s.push({t: T.n54h, f: 'subida', v: 0.14});
  s.push({t: T.sairam32, f: 'pop', v: 0.2});
  s.push({t: T.em2024 + 0.3, f: 'baque', v: 0.2});
  s.push({t: T.n13s, f: 'pop', v: 0.2});
  s.push({t: T.anoAnt + 0.3, f: 'baque', v: 0.2});
  s.push({t: T.n15p, f: 'subida', v: 0.14});
  s.push({t: T.sairam8, f: 'pop', v: 0.2});
  // teto
  s.push({t: T.limite + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.salarios, f: 'subida', v: 0.22});
  s.push({t: T.metadeTeto, f: 'ding', v: 0.2});
  // mínimos
  s.push({t: T.minimos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.minimos + 1.6, f: 'ding', v: 0.18});
  s.push({t: T.cumpridos, f: 'ding', v: 0.2});
  // sobra
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n6, f: 'pop', v: 0.24});
  // fim
  for (let i = 0; i < 12; i++) s.push({t: T.seEsses + 0.6 + i * 0.22, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 5.0, 10.0, 15.0, 21.0, 23.5, 28.5, 33.0, 39.0, T.paraOnde + 0.8, T.n24 + 1.0, T.n12c + 0.8, T.quase7 + 0.6, T.n23 + 1.0, T.previsto + 0.6, T.hospitais + 0.8,
  T.aposent + 0.8, T.n15 + 0.8, T.maisTransp + 0.8, T.n11 + 0.8, T.onibus + 1.0, T.n9 + 0.8, T.n65 + 0.8, T.n3 + 0.6, T.n23d + 0.8, T.n26 + 0.6, T.n17 + 0.6, T.n47 + 0.6,
  T.tribunal + 0.4, T.n13 + 0.6, T.n11c + 0.6, T.n734 + 0.4, T.n650 + 0.4, T.n353 + 0.6, T.n194 + 0.6, T.n18 + 0.5, T.rural, T.n57 + 0.8, T.inteiro + 0.3, T.n54h + 0.8,
  T.sairam32 + 0.6, T.em2024 + 0.8, T.n13s + 0.6, T.anoAnt + 0.8, T.n15p + 1.0, T.sairam8 + 0.8, T.limite + 0.8, T.n54 + 0.5, T.n27 + 0.8, T.metadeTeto + 0.4,
  T.minimos + 2.0, T.cumpridos + 0.6, T.fimAno + 1.2, T.n6 + 0.4, T.seEsses + 1.5, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoSp: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="SP Orçamento" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 117 bi.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoSp: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · SP ORÇAMENTO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
