import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Moeda, Onda, Palco, Particulas, Placa, cinematizar, enquadrar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {cai, clamp, criarQuando, entra, k01, pulso, rampa, sai, sumir} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {Banco, Envelope, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {
  BalancaJustica, CartaoBeneficio, CasaMini, Congresso, DocumentoGrande, Fio, Grades, Jatinho, Martelo, OrgaoPublico, PlacarVotos, PredioColunas, PredioLargo, Redoma, RelogioPonto, TagPorcento, TorreAposta, Urna, XMarca,
} from '../../pecas';
import {CaixaMunicao, Claquete, FrascoVacina, Gravador, LugarVazio, Memorial, Minerio, Pessoa, PraiaMini, TrilhaEspiral, aoLado, foraDe, naTrilha, olharFora} from './pecas';
import {PALAVRAS} from './palavras';

// 004. flávio bolsonaro e aliados (perfil @eumagnoleite, série Magno Explica).
// Mundo único: a espiral da trajetória, de 2000 (centro) a 2026 (ponta de fora). O boneco do Flávio caminha por ela;
// em cada ano, as pessoas do fato nascem ao lado da trilha, com placa do nome e cor própria, ligadas por um fio da cor delas.
// Pessoas reais só como boneco genérico sem rosto; vítimas só como memorial; cinza no trecho de cada acusação.
// Plano: projetos/004. flávio bolsonaro e aliados/plano.md (versão 1, aprovada).

export const FPS = 30;
const AUDIO_SEG = 193.37;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '004. flávio bolsonaro e aliados';
const FIM = AUDIO_SEG + 0.9;
const NUNCA = 1e9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  inicio: quando('Flávio Bolsonaro tem'),
  vinte: quando('vinte anos'),
  vida: quando('vida pública'),
  quem: quando('Quem esteve'),
  aoLado: quando('ao lado dele'),
  fatos: quando('Vamos aos fatos'),
  aos19: quando('19 anos'),
  a2002: quando('2002'),
  cargo: quando('cargo de 40'),
  camara: quando('Câmara'),
  brasilia: quando('Brasília'),
  rio: quando('estudava no Rio'),
  alerj: quando('Alerj'),
  a2009: quando('2009'),
  unico: quando('único a votar'),
  licenca: quando('licença-maternidade'),
  reduziria: quando('reduziria vagas'),
  a2011: quando('2011'),
  acioli: quando('Patrícia Acioli'),
  morta: quando('morta por PMs'),
  distorceram: quando('distorceram'),
  senado: quando('Senado'),
  a2022: quando('2022'),
  pec: quando('PEC da Transição'),
  bolsa: quando('Bolsa Família'),
  r600: quando('600 reais'),
  praias: quando('PEC das Praias'),
  a2003: quando('2003'),
  a2005: quando('2005'),
  homAdriano: quando('homenageou o PM'),
  adriano: quando('Adriano da Nóbrega'),
  preso: quando('estava preso'),
  milicia: quando('chefe de milícia'),
  mae: quando('A mãe'),
  mulher: quando('mulher dele'),
  gabinete: quando('gabinete'),
  naEpoca: quando('Flávio diz que, na época'),
  a2004: quando('2004'),
  homRonald: quando('homenageou Ronald'),
  condenadoPelo: quando('condenado pelo'),
  a2026: quando('2026'),
  marielle: quando('Marielle Franco'),
  anderson: quando('Anderson Gomes'),
  relatorios: quando('relatórios dos comandantes'),
  segundoPF: quando('Segundo a PF'),
  robson: quando('Robson Calixto'),
  tambemCond: quando('também condenado'),
  a2023: quando('2023'),
  destinou: quando('Flávio destinou'),
  mil200: quando('200 mil'),
  ong: quando('ONG'),
  seguiuLei: quando('seguiu a lei'),
  defendeu: quando('Defendeu votar'),
  fimDa: quando('fim da marcação'),
  marcacao: quando('marcação de munições'),
  rastrear: quando('rastrear'),
  casoMarielle: quando('caso Marielle'),
  marinho: quando('Rogério Marinho'),
  naoAutor: quando('não é autor'),
  a2020: quando('2020'),
  mpRio: quando('MP do Rio'),
  denunciou: quando('denunciou'),
  rachadinha: quando('rachadinha'),
  queiroz: quando('Fabrício Queiroz'),
  operador: quando('operador'),
  stj: quando('STJ'),
  anulou: quando('anulou as provas'),
  arquivado: quando('arquivado'),
  negou: quando('sempre negou'),
  a2019: quando('2019'),
  toffoli: quando('Dias Toffoli'),
  suspendeu: quando('suspendeu'),
  coaf: quando('Coaf'),
  a2020b: quando('2020', 2),
  ramagem: quando('Alexandre Ramagem'),
  abin: quando('Abin'),
  gravou: quando('gravou uma reunião'),
  jair: quando('Jair Bolsonaro'),
  advogadas: quando('advogadas'),
  receita: quando('auditores da Receita'),
  irregular: quando('denunciar irregularidades'),
  moro: quando('Sergio Moro'),
  interferencia: quando('interferência na PF'),
  jairNegou: quando('Jair negou'),
  pandemia: quando('pandemia'),
  bndes: quando('BNDES'),
  precisa: quando('dono da Precisa'),
  covaxin: quando('Covaxin'),
  semNegocio: quando('não tem negócio'),
  oAmigo: quando('O amigo'),
  willer: quando('Willer Tomaz'),
  investigado: quando('investigado'),
  inss: quando('INSS'),
  bestbet: quando('BestBet'),
  loterj: quando('Loterj'),
  indicado: quando('indicado de Flávio'),
  pfQuer: quando('A PF quer'),
  oculto: quando('sócio oculto'),
  voos: quando('pagou voos'),
  a2025: quando('2025'),
  amizade: quando('só amizade'),
  a2025b: quando('2025', 2),
  jatinho: quando('jatinho'),
  vorcaro: quando('Daniel Vorcaro'),
  master: quando('Banco Master'),
  pedir: quando('pedir dinheiro'),
  darkHorse: quando('Dark Horse'),
  patrocinio: quando('patrocínio privado'),
  frias: quando('Mário Frias'),
  nega: quando('nega dinheiro'),
  advogado: quando('advogado'),
  a2024: quando('advogado, em 2024'),
  juri: quando('tirar do júri'),
  pm: quando('PM acusado'),
  anaClara: quando('Ana Clara'),
  advocacia: quando('direito à advocacia'),
  plano: quando('plano de matar'),
  lula: quando('Lula e Alckmin'),
  disse2024: quando('disse em 2024'),
  pensar: quando('pensar em matar'),
  naoCrime: quando('não é crime'),
  noRio: quando('No Rio', 2),
  canella: quando('Márcio Canella'),
  mae2: quando('própria mãe'),
  pfLiga: quando('A PF liga'),
  bacellar: quando('Rodrigo Bacellar'),
  cv: quando('Comando Vermelho'),
  surpreso: quando('surpreso'),
  a2025c: quando('2025', 3),
  injusta: quando('injusta'),
  tarifa: quando('tarifa de Trump'),
  anistia: quando('anistia'),
  a2026b: quando('2026', 2),
  porTrump: quando('por Trump'),
  vance: quando('Vance'),
  rubio: quando('Rubio'),
  fimTarifa: quando('fim da nova'),
  terras: quando('terras raras'),
  serra: quando('Serra Verde'),
  fontes: quando('As fontes'),
  legenda: quando('legenda'),
  comenta: quando('Comenta'),
  segue: quando('segue'),
  arroba: quando('@eumagnoleite'),
  bolso: quando('bolso'),
};

const ESTADOS: [number, string][] = [
  [0, 'VIDA PÚBLICA'],
  [T.aos19 - 0.2, 'O COMEÇO'],
  [T.senado - 0.7, 'NO SENADO'],
  [T.a2003 - 0.3, 'HOMENAGENS'],
  [T.defendeu, 'MUNIÇÃO'],
  [T.a2020 - 0.2, 'RACHADINHA'],
  [T.a2019 - 0.3, 'INVESTIGAÇÕES'],
  [T.pandemia - 0.5, 'PANDEMIA'],
  [T.oAmigo, 'BETS'],
  [T.a2025b - 0.4, 'BANCO MASTER'],
  [T.advogado - 0.3, 'ADVOCACIA'],
  [T.plano - 0.4, 'O PLANO'],
  [T.noRio, 'NO RIO'],
  [T.a2025c - 0.3, 'EUA'],
  [T.fontes, 'SEGUE'],
];

// Ano mostrado no contador do topo (só anos ditos na fala).
const ANOS: [number, string][] = [
  [T.aos19 + 0.9, '2000'],
  [T.a2002, '2000–2002'],
  [T.a2009, '2009'],
  [T.a2011, '2011'],
  [T.a2022, '2022'],
  [T.a2003, '2003'],
  [T.a2005, '2003 E 2005'],
  [T.a2004, '2004'],
  [T.a2026, '2004 → 2026'],
  [T.a2023, '2023'],
  [T.defendeu, ''],
  [T.a2020, '2020'],
  [T.a2019, '2019'],
  [T.a2020b, '2020'],
  [T.pandemia, 'PANDEMIA'],
  [T.oAmigo, ''],
  [T.a2025, '2025'],
  [T.a2024, '2024'],
  [T.noRio, ''],
  [T.a2025c, '2025'],
  [T.a2026b, '2026'],
  [T.fontes, ''],
];

// O Flávio caminha pela espiral: [tempo em que começa a andar, ano de destino].
const ANDA: [number, number][] = [
  [0, 2000],
  [T.aos19 - 0.2, 2001],
  [T.alerj - 0.3, 2009],
  [T.a2011 - 0.3, 2011],
  [T.senado - 0.5, 2022.2],
  [T.a2003 - 0.3, 2003.3],
  [T.a2004 - 0.4, 2004.7],
  [T.a2023 - 0.6, 2023],
  [T.defendeu - 0.3, 2026.4],
  [T.a2020 - 0.3, 2020],
  [T.a2019 - 0.3, 2019],
  [T.a2020b - 0.3, 2020.55],
  [T.moro - 0.3, 2021],
  [T.pandemia - 0.4, 2021.6],
  [T.oAmigo - 0.2, 2025],
  [T.a2025b - 0.3, 2025.6],
  [T.advogado - 0.3, 2023.9],
  [T.plano - 0.3, 2024.45],
  [T.noRio - 0.2, 2026],
  [T.a2025c - 0.3, 2026.7],
];
const anoFlavio = (t: number) => {
  let a = ANDA[0][1];
  for (let i = 1; i < ANDA.length; i++) {
    const [t0, alvo] = ANDA[i];
    if (t < t0) break;
    const d = Math.min(1.5, 0.6 + Math.abs(alvo - a) * 0.08);
    a = a + (alvo - a) * rampa(t, t0, t0 + d, Easing.inOut(Easing.quad));
  }
  return a;
};
const anoMax = (t: number) => {
  let m = 2000;
  for (let s = 0; s <= t; s += 0.5) m = Math.max(m, anoFlavio(s));
  return Math.max(m, anoFlavio(t));
};

// ---------- Pessoas (plano, seção 2: cores) ----------
type CorFn = (tema: Tema) => string;
const fe = (tema: Tema) => tema.festa ?? ESCURO.festa!;
type Pess = {id: string; nome: string; ano: number; fora: number; lado: number; cor: CorFn; nasce: number; fio?: number; cinza?: [number, number][]; placa?: number; escala?: number};
const PESSOAS: Pess[] = [
  {id: 'adriano', nome: 'ADRIANO DA NÓBREGA', ano: 2003.3, fora: 2.6, lado: -0.2, cor: (t) => fe(t).roxo, nasce: T.adriano, fio: T.adriano, cinza: [[T.milicia, T.naEpoca + 0.8]]},
  {id: 'mae', nome: 'MÃE DE ADRIANO', ano: 2003.3, fora: 2.6, lado: 1.1, cor: (t) => tom(fe(t).roxo, 0.3), nasce: T.mae, fio: T.mae},
  {id: 'mulher', nome: 'MULHER DE ADRIANO', ano: 2003.3, fora: 3.5, lado: 0.5, cor: (t) => tom(fe(t).roxo, 0.45), nasce: T.mulher, fio: T.mulher},
  {id: 'ronald', nome: 'RONALD PEREIRA', ano: 2004.7, fora: 2.6, lado: -0.4, cor: (t) => fe(t).azulNoite, nasce: T.homRonald, fio: T.homRonald, cinza: [[T.condenadoPelo, T.relatorios + 0.8]]},
  {id: 'peixe', nome: 'ROBSON CALIXTO (PEIXE)', ano: 2023, fora: 2.6, lado: -0.5, cor: (t) => fe(t).turquesa, nasce: T.robson, fio: T.destinou, cinza: [[T.tambemCond, T.seguiuLei + 0.8]]},
  {id: 'marinho', nome: 'ROGÉRIO MARINHO', ano: 2026.4, fora: -2.8, lado: 0.6, cor: (t) => fe(t).loiro, nasce: T.marinho, fio: T.marinho},
  {id: 'queiroz', nome: 'FABRÍCIO QUEIROZ', ano: 2020, fora: 2.6, lado: -0.6, cor: (t) => fe(t).dourado, nasce: T.queiroz, fio: T.queiroz, cinza: [[T.operador, T.negou + 0.8]]},
  {id: 'ass1', nome: 'ASSESSORES', ano: 2020, fora: 3.4, lado: 0.6, cor: (t) => t.objeto, nasce: T.rachadinha, escala: 0.42},
  {id: 'ass2', nome: '', ano: 2020, fora: 4.1, lado: 1.1, cor: (t) => t.objeto, nasce: T.rachadinha + 0.12, placa: 0, escala: 0.42},
  {id: 'ass3', nome: '', ano: 2020, fora: 3.3, lado: 1.6, cor: (t) => t.objeto, nasce: T.rachadinha + 0.24, placa: 0, escala: 0.42},
  {id: 'toffoli', nome: 'DIAS TOFFOLI', ano: 2019, fora: 2.6, lado: -0.4, cor: (t) => fe(t).azul, nasce: T.toffoli, fio: T.toffoli},
  {id: 'ramagem', nome: 'ALEXANDRE RAMAGEM (ABIN)', ano: 2020.55, fora: 2.9, lado: -1.1, cor: (t) => fe(t).roxoEscuro, nasce: T.ramagem, fio: T.ramagem},
  {id: 'jair', nome: 'JAIR BOLSONARO', ano: 2020.55, fora: 3.9, lado: 0, cor: (t) => tom(fe(t).azul, -0.35), nasce: T.jair, fio: T.jair},
  {id: 'adv1', nome: 'ADVOGADA DE FLÁVIO', ano: 2020.55, fora: 2.9, lado: 1.1, cor: (t) => tom(fe(t).rosa, -0.3), nasce: T.advogadas, fio: T.advogadas},
  {id: 'adv2', nome: 'ADVOGADA DE FLÁVIO', ano: 2020.55, fora: 3.9, lado: 1.3, cor: (t) => tom(fe(t).rosa, -0.45), nasce: T.advogadas + 0.15, fio: T.advogadas + 0.15},
  {id: 'moro', nome: 'SERGIO MORO', ano: 2021, fora: 2.4, lado: 0, cor: (t) => tom(fe(t).loiro, -0.35), nasce: T.moro, fio: T.moro},
  {id: 'precisa', nome: 'DONO DA PRECISA', ano: 2021.6, fora: 2.6, lado: -0.3, cor: (t) => tom(fe(t).turquesa, -0.35), nasce: T.precisa, fio: T.precisa},
  {id: 'willer', nome: 'WILLER TOMAZ', ano: 2025, fora: 2.6, lado: 0, cor: (t) => tom(fe(t).dourado, -0.35), nasce: T.willer, fio: T.willer, cinza: [[T.investigado, T.amizade + 0.8]]},
  {id: 'loterj', nome: 'PRESIDENTE DA LOTERJ', ano: 2025, fora: 3.4, lado: 1.2, cor: (t) => tom(fe(t).roxo, 0.25), nasce: T.indicado, fio: T.indicado},
  {id: 'vorcaro', nome: 'DANIEL VORCARO', ano: 2025.6, fora: 2.7, lado: -0.5, cor: (t) => tom(fe(t).azulNoite, 0.35), nasce: T.vorcaro, fio: T.vorcaro},
  {id: 'frias', nome: 'MÁRIO FRIAS', ano: 2025.6, fora: 2.7, lado: 1.4, cor: (t) => tom(fe(t).pele, -0.3), nasce: T.frias, fio: T.frias},
  {id: 'pm', nome: 'PM ACUSADO', ano: 2023.9, fora: 2.6, lado: -0.5, cor: (t) => tom(fe(t).azul, 0.3), nasce: T.pm, fio: T.pm, cinza: [[T.pm, T.plano]]},
  {id: 'lula', nome: 'LULA', ano: 2024.45, fora: 2.8, lado: -0.5, cor: (t) => tom(fe(t).turquesa, 0.3), nasce: T.lula, fio: T.lula},
  {id: 'alckmin', nome: 'ALCKMIN', ano: 2024.45, fora: 2.8, lado: 0.6, cor: (t) => tom(fe(t).loiro, 0.3), nasce: T.lula + 0.3, fio: T.lula + 0.3},
  {id: 'canella', nome: 'MÁRCIO CANELLA', ano: 2026, fora: 2.6, lado: -1.0, cor: (t) => tom(fe(t).rosa, 0.3), nasce: T.canella, fio: T.canella, cinza: [[T.pfLiga, T.surpreso + 0.8]]},
  {id: 'rogeria', nome: 'MÃE DE FLÁVIO (SUPLENTE)', ano: 2026, fora: 2.6, lado: 0.2, cor: (t) => tom(fe(t).roxoEscuro, 0.35), nasce: T.mae2, fio: T.mae2},
  {id: 'bacellar', nome: 'RODRIGO BACELLAR', ano: 2026, fora: 3.5, lado: 1.2, cor: (t) => tom(fe(t).dourado, 0.3), nasce: T.bacellar, fio: T.bacellar, cinza: [[T.bacellar, T.surpreso + 0.8]]},
  {id: 'trump', nome: 'DONALD TRUMP', ano: 2026.75, fora: 2.8, lado: -1.0, cor: (t) => tom(fe(t).azul, -0.55), nasce: T.porTrump, fio: T.porTrump},
  {id: 'vance', nome: 'J.D. VANCE', ano: 2026.75, fora: 2.8, lado: 0.1, cor: (t) => tom(fe(t).azul, -0.15), nasce: T.vance, fio: T.vance},
  {id: 'rubio', nome: 'MARCO RUBIO', ano: 2026.75, fora: 2.8, lado: 1.2, cor: (t) => tom(fe(t).azulNoite, 0.15), nasce: T.rubio, fio: T.rubio},
];
// Placas mais altas para não encostarem nas vizinhas do mesmo grupo.
const ALTO = new Set(['mae', 'adv1', 'loterj', 'frias', 'alckmin', 'rogeria', 'vance']);
const posPessoa = (p: Pess, t: number): V3 => {
  if (p.id === 'moro') return aoLado(p.ano, p.fora + 3 * rampa(t, T.moro + 0.6, T.moro + 3.2, Easing.inOut(Easing.quad)), p.lado);
  return aoLado(p.ano, p.fora, p.lado);
};
const cinzaDe = (cz: [number, number][] | undefined, t: number) => (cz ? Math.max(0, ...cz.map(([a, b]) => rampa(t, a, a + 0.5) * (1 - rampa(t, b, b + 0.6)))) : 0);
const CINZA_FLAVIO: [number, number][] = [
  [T.denunciou, T.negou + 0.8],
  [T.pfQuer, T.amizade + 0.8],
];

// ---------- Câmera ----------
const enq = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const vivo = (c: Cam, k: number, sentido = 1) => cinematizar(c, k, {lente: 1, arco: 0.06, grua: 0.02, sentido});
/** Câmera olhando para um ponto ao lado da trilha, vindo de fora da espiral. `giro` (graus) gira em volta; `el` é a altura. */
const camEm = (ano: number, fora: number, lado: number, larg: number, el = 30, giro = 0, y = 0.9): Cam => {
  const alvo = aoLado(ano, fora, lado, y);
  const n = foraDe(ano);
  const g = (giro * Math.PI) / 180;
  const nx = n[0] * Math.cos(g) + n[2] * Math.sin(g);
  const nz = -n[0] * Math.sin(g) + n[2] * Math.cos(g);
  const e = (el * Math.PI) / 180;
  return enq(alvo, larg, larg * 0.52, [nx * Math.cos(e), Math.sin(e), nz * Math.cos(e)]);
};
const D = (az: number, el: number): V3 => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
};
const VISTA_TOPO = enq([0, 0, 1], 13, 8, D(0, 62));

type Cena = {ini: number; cam: (t: number, ini: number, fim: number) => Cam};
const CENAS: Cena[] = [
  {ini: 0, cam: (t, a) => trilhoCam(t, [[a, enq([0, 1.0, 3], 3.6, 3.0, D(18, 26))], [T.vinte - 0.1, enq([0, 1.0, 3], 3.4, 2.9, D(8, 28))], [T.vinte + 1.2, VISTA_TOPO], [T.quem + 0.6, enq([2, 0, 0], 30, 20, D(10, 62))], [T.aoLado + 0.2, camEm(2000, 0.6, 0, 5, 34)], [T.aos19 - 0.2, camEm(2000.4, 0.8, 0, 5.4, 32, 10)]])},
  {
    ini: T.aos19 - 0.2,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, camEm(2001, 0, 0, 7, 34, 0)],
          [T.alerj - 0.3, camEm(2001.5, 0, 0, 7.5, 34, -10)],
          [T.alerj + 1.0, camEm(2009, 0.2, 0, 7.4, 32, 0)],
          [T.a2011 - 0.3, camEm(2009.3, 0.4, 0, 7, 32, 10)],
          [T.a2011 + 1.0, camEm(2011, 1.2, 0, 6, 28, 0)],
          [b, camEm(2011, 1.2, 0, 5.6, 28, -12)],
        ]),
        rampa(t, a, b),
      ),
  },
  {ini: T.senado - 0.7, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq(naTrilha(2016), 20, 13, D(30, 50))], [T.pec - 0.3, camEm(2022.2, -0.4, 0, 8.4, 32, 0)], [b, camEm(2022.2, 0.2, 0, 7.4, 30, 14)]]), rampa(t, a, b))},
  {
    ini: T.a2003 - 0.3,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq(naTrilha(2010), 22, 14, D(-20, 55))],
          [T.homAdriano, camEm(2003.3, 1.6, 0.4, 7, 30, 0)],
          [T.a2004 - 0.3, camEm(2003.6, 1.6, 0.4, 6.6, 30, 14)],
          [T.a2004 + 0.9, camEm(2004.7, 1.6, 0.4, 6.4, 30, 0)],
          [T.a2026 - 0.2, camEm(2004.8, 1.6, 0.4, 6.4, 30, 8)],
          [T.a2026 + 0.9, enq([0, 0, 0], 36, 26, D(40, 60))],
          [T.marielle + 0.2, camEm(2004.7, 1.8, 0.8, 6.4, 30, -6)],
          [T.segundoPF - 0.2, camEm(2004.7, 1.8, 0.8, 6.0, 30, -14)],
          [T.segundoPF + 1.0, camEm(2023, 1.4, 0.6, 7.6, 30, 0)],
          [b, camEm(2023, 1.6, 0.8, 7.0, 30, 12)],
        ]),
        rampa(t, a, b),
      ),
  },
  {ini: T.defendeu, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2026.4, -1.4, 0.4, 6.6, 30, 0)], [b, camEm(2026.4, -1.4, 0.4, 6.0, 30, -14)]]), rampa(t, a, b))},
  {ini: T.a2020 - 0.2, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2020, 1.2, 0.4, 9, 34, 0)], [T.stj - 0.3, camEm(2020, 0.8, 0.4, 8.4, 34, 10)], [T.stj + 0.7, camEm(2020.3, -1.4, 0, 8.6, 32, 0)], [b, camEm(2020.2, 0.4, 0, 8.4, 32, -10)]]), rampa(t, a, b))},
  {
    ini: T.a2019 - 0.3,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, camEm(2019, 0.4, 0.3, 7.6, 30, 0)],
          [T.ramagem - 0.4, camEm(2019.2, 0.6, 0.3, 7.4, 30, 12)],
          [T.ramagem + 0.6, camEm(2020.55, 2.6, 0, 6.6, 42, 0)],
          [T.moro - 0.3, camEm(2020.55, 2.6, 0, 6.4, 42, 12)],
          [T.moro + 0.8, camEm(2021, 2.8, 0, 8.6, 30, 0)],
          [b, camEm(2021, 3.4, 0, 8.6, 30, -12)],
        ]),
        rampa(t, a, b),
      ),
  },
  {ini: T.pandemia - 0.5, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2021.6, 0.6, 0.3, 7.6, 30, 0)], [b, camEm(2021.6, 0.6, 0.3, 7.0, 30, 14)]]), rampa(t, a, b))},
  {ini: T.oAmigo, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2025, 0.8, 0, 9.4, 32, 0)], [T.voos - 0.3, camEm(2025, 0.8, 0, 9, 32, 10)], [T.voos + 0.6, camEm(2025, 1.2, 0, 13, 42, 0)], [b, camEm(2025.2, 1.2, 0, 12, 40, -8)]]), rampa(t, a, b))},
  {ini: T.a2025b - 0.4, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2025.6, 1.3, 0.4, 8.4, 30, 0)], [b, camEm(2025.6, 1.3, 0.4, 7.6, 30, 14)]]), rampa(t, a, b))},
  {ini: T.advogado - 0.3, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2023.9, 1.3, 0.2, 7.4, 30, 0)], [b, camEm(2023.9, 1.3, 0.2, 6.8, 30, -12)]]), rampa(t, a, b))},
  {ini: T.plano - 0.4, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2024.45, 1.4, 0, 6.8, 30, 0)], [b, camEm(2024.45, 1.4, 0, 6.2, 30, 12)]]), rampa(t, a, b))},
  {ini: T.noRio, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2026, 1.4, 0, 8.4, 30, 0)], [b, camEm(2026, 1.6, 0.2, 7.8, 30, -12)]]), rampa(t, a, b))},
  {ini: T.a2025c - 0.3, cam: (t, a, b) => vivo(trilhoCam(t, [[a, camEm(2026.75, 2.6, 0, 10, 30, 0)], [T.terras - 0.4, camEm(2026.75, 2.6, 0, 9.4, 30, 12)], [T.terras + 0.6, camEm(2027.1, 1.6, 0, 6, 28, 0)], [b, camEm(2027.1, 1.6, 0, 5.6, 28, -10)]]), rampa(t, a, b))},
  {ini: T.fontes, cam: (t, a) => trilhoCam(t, [[a, camEm(2026.7, 1.2, 0, 8, 32, 0)], [T.comenta + 0.4, enq([2, 0, 0], 32, 22, D(10, 56))], [FIM, enq([2, 0, 0], 35, 24, D(0, 60))]])},
];

// ---------- O mundo ----------
const Mundo: React.FC<{tema: Tema; t: number; centro: V3}> = ({tema, t, centro}) => {
  const F = fe(tema);
  const ouro = F.dourado;
  const af = anoFlavio(t);
  const pF = naTrilha(af);
  const andando = Math.abs(anoFlavio(t + 0.05) - af) > 0.002;
  const cinzaF = cinzaDe(CINZA_FLAVIO, t);
  const trilha = 0.3 + 0.7 * rampa(t, T.vida - 0.3, T.vida + 1.2, Easing.inOut(Easing.quad));
  const marcosK = (i: number, n: number) => entra(t, -0.4 + (i / n) * (T.vinte + 1.2), 0.4);
  const ANOS_MARCO = [2000, 2002, 2003, 2004, 2005, 2009, 2011, 2019, 2020, 2022, 2023, 2024, 2025, 2026];
  const vazio = rampa(t, T.quem, T.quem + 0.8);

  // objetos por fato
  const ob = {
    camara: rampa(t, T.camara - 0.2, T.camara + 0.7, sai),
    relogio: entra(t, T.cargo, 0.5),
    alerj: rampa(t, T.alerj - 0.2, T.alerj + 0.7, sai),
    placar: entra(t, T.unico - 0.3, 0.5),
    votos: 4.4 * rampa(t, T.unico, T.unico + 0.9),
    acioli: entra(t, T.acioli, 0.6),
    vela: rampa(t, T.morta, T.morta + 0.8),
    senado: rampa(t, T.senado - 0.2, T.senado + 0.8, sai),
    docPec: entra(t, T.pec, 0.5),
    cartao: entra(t, T.bolsa, 0.5),
    praia: entra(t, T.praias, 0.6),
    medalha: entra(t, T.homAdriano, 0.5),
    grades: rampa(t, T.preso, T.preso + 0.8),
    gabinete: entra(t, T.gabinete - 0.2, 0.5),
    moocao: entra(t, T.homRonald, 0.5),
    tempo: rampa(t, T.a2026, T.a2026 + 1.2, Easing.inOut(Easing.quad)),
    marielle: entra(t, T.marielle, 0.6),
    pf: rampa(t, T.segundoPF - 0.2, T.segundoPF + 0.7, sai),
    envelope: rampa(t, T.destinou, T.destinou + 1.2, Easing.inOut(Easing.quad)),
    ong: entra(t, T.ong - 0.2, 0.5),
    municao: entra(t, T.marcacao - 0.3, 0.5),
    lote: 1 - rampa(t, T.fimDa + 0.4, T.naoAutor, Easing.linear),
    linhaM: rampa(t, T.rastrear, T.rastrear + 1.0) * sumir(t, T.marinho + 0.4, 0.6),
    mp: rampa(t, T.mpRio - 0.2, T.mpRio + 0.7, sai),
    envs: rampa(t, T.rachadinha + 0.2, T.queiroz + 1.0, Easing.inOut(Easing.quad)),
    somemEnvs: sumir(t, T.anulou, 0.8),
    stj: rampa(t, T.stj - 0.2, T.stj + 0.6, sai),
    docArq: entra(t, T.anulou, 0.5),
    carimbo: rampa(t, T.arquivado - 0.1, T.arquivado + 0.3, cai),
    stf: rampa(t, T.toffoli - 0.4, T.toffoli + 0.5, sai),
    martelo: rampa(t, T.suspendeu - 0.1, T.suspendeu + 0.5, cai),
    coaf: entra(t, T.coaf - 0.2, 0.5),
    mesa: entra(t, T.gravou - 0.4, 0.5),
    luzRec: rampa(t, T.gravou, T.gravou + 0.6),
    receita: rampa(t, T.receita - 0.2, T.receita + 0.7, sai),
    bndes: rampa(t, T.bndes - 0.2, T.bndes + 0.6, sai),
    frasco: entra(t, T.pandemia, 0.6),
    torre: entra(t, T.bestbet - 0.1, 0.6),
    loterjP: rampa(t, T.loterj - 0.2, T.loterj + 0.6, sai),
    jato1: rampa(t, T.voos - 0.2, T.voos + 2.6, Easing.inOut(Easing.quad)),
    jato2: rampa(t, T.jatinho - 0.8, T.jatinho + 0.8, sai),
    master: rampa(t, T.master - 0.2, T.master + 0.6, sai),
    moedas: rampa(t, T.pedir, T.pedir + 1.0, Easing.inOut(Easing.quad)) - rampa(t, T.nega, T.nega + 0.9, Easing.inOut(Easing.quad)),
    claquete: entra(t, T.darkHorse - 0.3, 0.5),
    abreClaq: 0.5 + 0.5 * Math.sin((t - T.darkHorse) * 4) * rampa(t, T.darkHorse, T.darkHorse + 0.3) * (1 - rampa(t, T.darkHorse + 1.2, T.darkHorse + 1.5)),
    balanca: entra(t, T.juri - 0.2, 0.6),
    anaClara: entra(t, T.anaClara, 0.6),
    plano: entra(t, T.plano, 0.5),
    redoma: entra(t, T.lula + 0.4, 0.6) * sumir(t, T.naoCrime + 0.4, 0.6),
    urna: entra(t, T.canella - 0.2, 0.5),
    casaBranca: rampa(t, T.tarifa - 0.2, T.tarifa + 0.8, sai),
    tag: entra(t, T.injusta - 0.2, 0.5),
    minerio: rampa(t, T.terras - 0.1, T.terras + 1.2),
  };
  const R = (a: number) => olharFora(a);
  const ano20 = 2020;

  return (
    <>
      <Particulas t={t} centro={[centro[0], 2.5, centro[2]]} raio={12} n={50} />
      <TrilhaEspiral tema={tema} k={trilha} aceso={anoMax(t)} destaque={af} t={t} />
      {ANOS_MARCO.map((a, i) => {
        const k = marcosK(i, ANOS_MARCO.length);
        if (k < 0.02) return null;
        const p = aoLado(a, -1.05, -0.9, 0);
        const perto = Math.max(0, 1 - Math.abs(a - af) * 0.9);
        return (
          <group key={a} position={p} rotation={[0, R(a), 0]} scale={Math.min(1, k)}>
            <Caixa args={[0.08, 0.6, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.3, 0]} />
            <Placa tema={tema} pos={[0, 0.78, 0.01]} larg={1.0} alt={0.36} linhas={[{t: String(a), tam: 300, cor: tema.fundo, peso: 900}]} fundo={mistura(tema.objeto, tema.acento, perto)} brilho={0.2 + 0.4 * perto} />
          </group>
        );
      })}
      {/* lugares ainda vazios (o gancho) */}
      {vazio > 0.02 ? PESSOAS.filter((p) => p.placa !== 0).map((p) => <LugarVazio key={`v${p.id}`} tema={tema} pos={posPessoa(p, 0)} k={vazio * (1 - entra(t, p.nasce - 0.3, 0.3))} />) : null}

      {/* o Flávio */}
      <Pessoa
        tema={tema}
        pos={[pF[0], 0.06, pF[2]]}
        rotY={R(af) + (andando ? Math.PI / 2 : 0)}
        cor={tema.corpo}
        nome="FLÁVIO BOLSONARO"
        k={1}
        cinza={cinzaF}
        escala={0.62}
        pose={andando ? {passo: Math.sin(t * 9)} : undefined}
      />
      {t > T.advogado - 0.2 && t < T.plano ? <Caixa args={[0.32, 0.24, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={[pF[0] + 0.3, 0.42, pF[2] + 0.1]} /> : null}

      {/* pessoas e fios */}
      {PESSOAS.map((p) => {
        const k = entra(t, p.nasce, 0.55);
        if (k < 0.02) return null;
        const pos = posPessoa(p, t);
        const cor = p.cor(tema);
        const fk = p.fio !== undefined ? rampa(t, p.fio + 0.1, p.fio + 0.9, Easing.out(Easing.cubic)) : 0;
        const novo = p.fio !== undefined ? pulso(t, p.fio + 0.6, 1.0) : 0;
        const fioTodos = 0.5 * pulso(t, T.comenta, 2.2);
        return (
          <React.Fragment key={p.id}>
            <Pessoa tema={tema} pos={pos} rotY={R(p.ano)} cor={cor} nome={p.nome} k={k} cinza={cinzaDe(p.cinza, t)} escala={p.escala ?? 0.55} placa={p.placa ?? 1} placaY={ALTO.has(p.id) ? 0.42 : 0} />
            {fk > 0.02 ? <Fio a={naTrilha(p.ano, 0.5)} b={[pos[0], 0.9, pos[2]]} k={fk} cor={mistura(cor, tema.acento, k01(novo + fioTodos))} altura={1.1} n={22} /> : null}
          </React.Fragment>
        );
      })}

      {/* 2000–2002: Câmara e relógio de ponto */}
      <group position={aoLado(2001, -2.4, 0)} rotation={[0, R(2001), 0]}>
        {ob.camara > 0.02 ? <PredioLargo tema={tema} pos={[0, -2.4 * (1 - ob.camara), 0]} aceso={0.3} escala={0.5} /> : null}
        {ob.camara > 0.5 ? <Placa tema={tema} pos={[0, 1.9, 0.9]} larg={1.8} alt={0.34} linhas={[{t: 'CÂMARA · BRASÍLIA', tam: 120, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} /> : null}
      </group>
      <RelogioPonto tema={tema} pos={aoLado(2001, 1.6, 0.6)} rotY={R(2001)} escala={0.8 * ob.relogio} visor={ob.relogio} />

      {/* 2009: Alerj e o painel de votos */}
      <group position={aoLado(2009, -2.6, 0)} rotation={[0, R(2009), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.5} sobe={ob.alerj} letreiro={ob.alerj} texto="ALERJ" />
      </group>
      {ob.placar > 0.02 ? (
        <group position={aoLado(2009, 1.7, 0.4)} rotation={[0, R(2009), 0]}>
          <Caixa args={[0.1, 1.2 * ob.placar, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.6 * ob.placar, -0.08]} />
          <PlacarVotos tema={tema} pos={[0, 1.4, 0]} escala={0.8 * ob.placar} acesos={ob.votos} />
          <Caixa args={[0.26, 0.26, 0.08]} raio={0.04} cor={tema.objetoEscuro} emissivo={0.2} position={[1.15, 1.4, 0]} scale={entra(t, T.unico + 0.6, 0.4)} />
        </group>
      ) : null}

      {/* 2011: memorial da juíza */}
      <Memorial tema={tema} pos={aoLado(2011, 2.4, 0)} rotY={R(2011)} nome="JUÍZA PATRÍCIA ACIOLI" k={ob.acioli} vela={ob.vela} />

      {/* 2022: Senado, PEC, Bolsa Família, praias */}
      <group position={aoLado(2022.2, -4.2, 0)} rotation={[0, R(2022.2), 0]}>
        {ob.senado > 0.02 ? <Congresso tema={tema} pos={[0, -3 * (1 - ob.senado), 0]} escala={0.34} aceso={0.4} /> : null}
        {ob.senado > 0.5 ? <Placa tema={tema} pos={[0, 0.5, 1.6]} larg={1.4} alt={0.32} linhas={[{t: 'SENADO', tam: 200, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} /> : null}
      </group>
      <DocumentoGrande tema={tema} pos={aoLado(2022.2, 1.6, -0.9, 1.0)} rot={[0, R(2022.2), 0]} escala={0.55 * ob.docPec} carimbo={rampa(t, T.r600, T.r600 + 0.4)} />
      <CartaoBeneficio tema={tema} pos={aoLado(2022.2, 1.7, 0.4, 1.1)} rot={[0, R(2022.2) + 2 * Math.PI * (1 - Math.min(1, ob.cartao)), 0]} escala={1.0 * ob.cartao} brilho={0.4} />
      <PraiaMini tema={tema} pos={aoLado(2022.2, 1.9, 1.8)} rotY={R(2022.2)} escala={1.0 * ob.praia} />

      {/* 2003–2005: medalha, grades e gabinete (Adriano); moção (Ronald) */}
      {ob.medalha > 0.02 ? <Moeda tema={tema} pos={aoLado(2003.3, 1.5, -1.2, 0.9)} rot={[Math.PI / 2, R(2003.3), 0]} r={0.28} escala={ob.medalha} brilho={0.3} /> : null}
      <group position={aoLado(2003.3, 1.9, -0.2)} rotation={[0, R(2003.3), 0]}>
        <Grades tema={tema} pos={[0, 0, -0.4]} larg={1.4} alt={1.4} desce={ob.grades * (1 - rampa(t, T.naEpoca, T.naEpoca + 0.8))} />
      </group>
      {ob.gabinete > 0.02 ? (
        <group position={aoLado(2003.3, 1.6, 1.4)} rotation={[0, R(2003.3), 0]} scale={ob.gabinete}>
          <Caixa args={[1.0, 0.06, 0.55]} raio={0.02} cor={tema.objeto} position={[0, 0.62, 0]} />
          {[-0.42, 0.42].map((x) => (
            <Caixa key={x} args={[0.06, 0.6, 0.5]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.3, 0]} />
          ))}
          <Placa tema={tema} pos={[0, 0.85, 0.05]} larg={1.0} alt={0.26} linhas={[{t: 'GABINETE', tam: 180, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} />
        </group>
      ) : null}
      <DocumentoGrande tema={tema} pos={aoLado(2004.7, 1.5, -1.3, 0.9)} rot={[0, R(2004.7), 0]} escala={0.42 * ob.moocao} />
      {ob.tempo > 0.02 ? <Fio a={naTrilha(2004.7, 0.5)} b={naTrilha(2026, 0.5)} k={ob.tempo} cor={mistura(fe(tema).azulNoite, tema.objetoClaro, 0.3)} altura={5} n={40} /> : null}
      <Memorial tema={tema} pos={aoLado(2004.7, 2.6, 1.2)} rotY={R(2004.7)} nome="MARIELLE FRANCO" sub="E ANDERSON GOMES" k={ob.marielle} vela={pulso(t, T.casoMarielle, 1.6) + ob.marielle * 0.4} />

      {/* 2023: PF, envelope e ONG */}
      <group position={aoLado(2022.8, -5.2, 0)} rotation={[0, R(2022.8), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.45} sobe={ob.pf} letreiro={ob.pf + 0.5 * pulso(t, T.interferencia, 1.2)} texto="PF" />
      </group>
      {ob.envelope > 0.02 && ob.envelope < 0.98 ? <Envelope tema={tema} pos={curva(naTrilha(2023, 0.8), aoLado(2023, 2.6, 2.0, 0.7), 1.4, ob.envelope)} rotY={R(2023)} escala={1.2} brilho={0.4} /> : null}
      <CasaMini tema={tema} pos={aoLado(2023, 2.7, 2.0)} rotY={R(2023)} luz={0.6} escala={1.1 * ob.ong} />
      {ob.ong > 0.5 ? <Placa tema={tema} pos={aoLado(2023, 2.7, 2.0, 1.4)} rot={[0, R(2023), 0]} larg={0.8} alt={0.3} linhas={[{t: 'ONG', tam: 260, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}

      {/* munição (no Senado, 2026, por dentro da espiral) */}
      {[0, 1, 2].map((i) => (
        <CaixaMunicao key={`cm${i}`} tema={tema} pos={aoLado(2026.4, -1.8 - (i % 2) * 0.5, -0.9 + i * 0.55, i === 1 ? 0.3 : 0)} rotY={R(2026.4) + 0.2 * i} escala={1.5 * entra(t, T.marcacao - 0.3 + i * 0.1, 0.5)} lote={ob.lote} />
      ))}
      {ob.linhaM > 0.02 ? <Fio a={aoLado(2026.4, -1.8, -0.4, 0.5)} b={aoLado(2004.7, 2.6, 1.2, 0.5)} k={ob.linhaM} cor={tema.objetoClaro} altura={4} n={40} /> : null}

      {/* 2020: rachadinha */}
      <group position={aoLado(2020, -2.6, 0)} rotation={[0, R(2020), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.45} sobe={ob.mp} letreiro={ob.mp} texto="MP-RJ" />
      </group>
      {ob.envs > 0.02 && ob.somemEnvs > 0.02
        ? [0, 1, 2].map((i) => {
            const de = aoLado(ano20, [3.4, 4.1, 3.3][i], [0.6, 1.1, 1.6][i], 0.8);
            const ate = aoLado(ano20, 2.6, -0.6, 0.9);
            const k = k01(ob.envs * 1.4 - i * 0.2);
            return <Envelope key={`e${i}`} tema={tema} pos={k < 1 ? curva(de, ate, 0.8, k) : [ate[0], 0.15 + i * 0.05, ate[2] + 0.3]} rotY={R(ano20)} escala={0.9 * ob.somemEnvs} />;
          })
        : null}
      {ob.envs > 0.5 && ob.somemEnvs > 0.02 ? <Moeda tema={tema} pos={aoLado(ano20, 2.0, -1.0, 0.05)} r={0.3} escala={ob.somemEnvs} cor={ouro} /> : null}
      <group position={aoLado(2020.4, -4.8, 0)} rotation={[0, R(2020.4), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.45} sobe={ob.stj} letreiro={ob.stj} texto="STJ" />
      </group>
      <DocumentoGrande tema={tema} pos={aoLado(ano20, 1.4, 1.2, 1.0)} rot={[0, R(ano20), 0]} escala={0.5 * ob.docArq} carimbo={ob.carimbo} />

      {/* 2019: STF, Toffoli, martelo, Coaf */}
      <group position={aoLado(2019, -2.6, 0)} rotation={[0, R(2019), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.45} sobe={Math.max(ob.stf, rampa(t, T.condenadoPelo - 0.2, T.condenadoPelo + 0.6, sai))} letreiro={ob.stf + 0.6 * pulso(t, T.condenadoPelo, 1.4)} texto="STF" />
      </group>
      <Martelo tema={tema} pos={aoLado(2019, 1.5, 0.8)} rotY={R(2019)} escala={0.7 * entra(t, T.suspendeu - 0.4, 0.4)} bate={ob.martelo} />
      <DocumentoGrande tema={tema} pos={aoLado(2019, 1.6, 1.8, 0.06)} rot={[-Math.PI / 2, 0, R(2019)]} escala={0.42 * ob.coaf} />
      {ob.coaf > 0.5 ? <Placa tema={tema} pos={aoLado(2019, 1.6, 1.8, 0.4)} rot={[0, R(2019), 0]} larg={0.7} alt={0.24} linhas={[{t: 'COAF', tam: 220, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}

      {/* 2020: a reunião gravada; Receita */}
      {ob.mesa > 0.02 ? (
        <group position={aoLado(2020.55, 3.4, 0.1)} rotation={[0, R(2020.55), 0]} scale={ob.mesa}>
          <Caixa args={[1.6, 0.06, 0.9]} raio={0.02} cor={tema.objeto} position={[0, 0.7, 0]} />
          <Caixa args={[0.1, 0.68, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.34, 0]} />
          <Gravador tema={tema} pos={[0, 0.73, 0]} escala={1.1} luz={ob.luzRec} />
        </group>
      ) : null}
      <group position={aoLado(2020.55, -2.8, 0)} rotation={[0, R(2020.55), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.42} sobe={ob.receita} letreiro={ob.receita} texto="RECEITA" />
      </group>

      {/* pandemia: BNDES e frasco */}
      <group position={aoLado(2021.6, -2.6, 0)} rotation={[0, R(2021.6), 0]} scale={0.7}>
        <Banco tema={tema} pos={[0, 0, 0]} sobe={ob.bndes} />
      </group>
      {ob.bndes > 0.5 ? <Placa tema={tema} pos={aoLado(2021.6, -1.4, 0, 1.9)} rot={[0, R(2021.6), 0]} larg={1.2} alt={0.28} linhas={[{t: 'BNDES', tam: 220, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}
      <FrascoVacina tema={tema} pos={aoLado(2021.6, 1.5, 1.0)} gira={R(2021.6) + t * 0.6} escala={1.6 * ob.frasco} rotulo={t > T.covaxin ? 'COVAXIN' : undefined} />

      {/* 2025: BestBet, Loterj, jatinho */}
      <TorreAposta tema={tema} pos={aoLado(2025, 1.6, -1.5)} tela={ob.torre} escala={0.8 * ob.torre} />
      {ob.torre > 0.5 ? <Placa tema={tema} pos={aoLado(2025, 1.6, -1.5, 2.2)} rot={[0, R(2025), 0]} larg={1.3} alt={0.3} linhas={[{t: 'BESTBET', tam: 200, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}
      <group position={aoLado(2025, -2.6, 0)} rotation={[0, R(2025), 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={0.45} sobe={ob.loterjP} letreiro={ob.loterjP} texto="LOTERJ" />
      </group>
      {ob.jato1 > 0.02 && ob.jato1 < 0.98 ? <Jatinho tema={tema} pos={lerp(aoLado(2024.4, 6, 0, 3.2), aoLado(2025.8, 6, 0, 3.6), ob.jato1)} rumo={R(2025) + Math.PI / 2} pique={0.05} escala={0.5} /> : null}

      {/* 2025: Vorcaro, Banco Master, claquete */}
      {ob.jato2 > 0.02 ? <Jatinho tema={tema} pos={aoLado(2025.6, -4.8, -0.2 + 3 * (1 - ob.jato2), 0.35 + 1.2 * (1 - ob.jato2))} rumo={R(2025.6) - Math.PI / 2} escala={0.5} /> : null}
      <group position={aoLado(2025.6, -2.6, 0)} rotation={[0, R(2025.6), 0]} scale={0.7}>
        <Banco tema={tema} pos={[0, 0, 0]} sobe={ob.master} />
      </group>
      {ob.master > 0.5 ? <Placa tema={tema} pos={aoLado(2025.6, -1.4, 0, 1.9)} rot={[0, R(2025.6), 0]} larg={1.4} alt={0.28} linhas={[{t: 'BANCO MASTER', tam: 160, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}
      <Claquete tema={tema} pos={aoLado(2025.6, 1.6, 0.6)} rotY={R(2025.6)} escala={1.3 * ob.claquete} abre={ob.abreClaq} titulo="DARK HORSE" />
      {ob.moedas > 0.02
        ? [0, 1, 2].map((i) => <Moeda key={`vm${i}`} tema={tema} pos={curva(aoLado(2025.6, 2.7, -0.5, 1.0), aoLado(2025.6, 1.6, 0.6, 0.9), 1.0, k01(ob.moedas * 1.3 - i * 0.15))} r={0.13} cor={ouro} rot={[Math.PI / 2, t * 3, 0]} />)
        : null}

      {/* 2024: júri, Ana Clara; o plano */}
      <BalancaJustica tema={tema} pos={aoLado(2023.9, 1.5, -1.6)} escala={0.55 * ob.balanca} inclina={0.15 * Math.sin(t * 0.8)} />
      <Memorial tema={tema} pos={aoLado(2023.9, 2.6, 1.1)} rotY={R(2023.9)} nome="ANA CLARA" sub="5 ANOS" k={ob.anaClara} vela={ob.anaClara * 0.6} />
      <DocumentoGrande tema={tema} pos={aoLado(2024.45, 1.5, -1.4, 0.95)} rot={[0, R(2024.45), 0]} escala={0.5 * ob.plano} />
      {ob.plano > 0.5 ? <Placa tema={tema} pos={aoLado(2024.45, 1.52, -1.4, 1.45)} rot={[0, R(2024.45), 0]} larg={0.8} alt={0.22} linhas={[{t: 'PLANO', tam: 220, cor: tema.tinta, peso: 900}]} /> : null}
      {ob.plano > 0.02 && t < T.naoCrime + 1 ? <XMarca tema={tema} pos={aoLado(2024.45, 1.6, -1.4, 0.95)} escala={0.35 * entra(t, T.lula + 0.6, 0.4) * sumir(t, T.naoCrime + 0.4, 0.5)} /> : null}
      <Redoma tema={tema} pos={aoLado(2024.45, 2.8, 0.05)} escala={1.2 * Math.min(1, ob.redoma)} desce={Math.min(1, ob.redoma)} brilho={0.3} />

      {/* 2026: urna (Rio); Casa Branca, tarifa e terras raras */}
      <Urna tema={tema} pos={aoLado(2026, 1.5, -2.0)} rotY={R(2026)} escala={0.8 * ob.urna} />
      <group position={aoLado(2026.75, -3.0, 0)} rotation={[0, R(2026.75), 0]}>
        {ob.casaBranca > 0.02 ? <PredioColunas tema={tema} pos={[0, -2.4 * (1 - ob.casaBranca), 0]} aceso={0.4} escala={0.6} /> : null}
      </group>
      {ob.casaBranca > 0.5 ? <Placa tema={tema} pos={aoLado(2026.75, -1.6, 0, 2.6)} rot={[0, R(2026.75), 0]} larg={1.7} alt={0.3} linhas={[{t: 'CASA BRANCA', tam: 170, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} /> : null}
      {ob.tag > 0.02 ? (
        <group position={aoLado(2026.75, 1.6, -1.6, 2.2)}>
          <TagPorcento tema={tema} pos={[0, 0, 0]} escala={0.8 * ob.tag} balanca={Math.sin(t * 2.2) * 0.6} />
        </group>
      ) : null}
      <Minerio tema={tema} pos={aoLado(2027.1, 1.8, 0)} k={ob.minerio} />
      {ob.minerio > 0.5 ? <Placa tema={tema} pos={aoLado(2027.1, 1.8, 0, 1.2)} rot={[0, R(2027.1), 0]} larg={1.6} alt={0.28} linhas={[{t: 'SERRA VERDE (GO)', tam: 140, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} /> : null}

      <Onda pos={[pF[0], 0.02, pF[2]]} k={rampa(t, T.bolso - 0.2, T.bolso + 1.0, Easing.linear)} cor={tema.acento} raio={1.6} />
    </>
  );
};
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

// ---------- Interface ----------
type Txt = {a: number; b?: number; texto: string; y?: number; destaque?: boolean; tam?: number};
// Chips de contexto (topo) e respostas (embaixo). `b`: quando sai.
const CHIPS: Txt[] = [
  {a: T.fatos, b: T.aos19, texto: 'OS FATOS, COM FONTE', destaque: true},
  {a: T.cargo, b: T.rio, texto: '40 H POR SEMANA NA CÂMARA'},
  {a: T.rio, b: T.alerj, texto: 'MORAVA E ESTUDAVA NO RIO'},
  {a: T.licenca, b: T.reduziria, texto: 'LICENÇA-MATERNIDADE: 6 MESES'},
  {a: T.unico, b: T.licenca, texto: 'O ÚNICO VOTO CONTRA', y: 540},
  {a: T.r600, b: T.praias, texto: 'BOLSA FAMÍLIA DE R$ 600'},
  {a: T.praias, b: T.a2003, texto: 'RELATOR DA PEC DAS PRAIAS'},
  {a: T.milicia, b: T.mae, texto: 'APONTADO PELO MP COMO CHEFE DE MILÍCIA'},
  {a: T.condenadoPelo, b: T.relatorios, texto: 'CONDENADO PELO STF NO CASO MARIELLE'},
  {a: T.tambemCond, b: T.a2023, texto: 'PEIXE: CONDENADO NO CASO'},
  {a: T.mil200, b: T.seguiuLei, texto: 'EMENDA DE R$ 200 MIL'},
  {a: T.marcacao, b: T.marinho, texto: 'FIM DA MARCAÇÃO DE MUNIÇÕES'},
  {a: T.denunciou, b: T.stj, texto: 'DENUNCIADO PELO MP-RJ'},
  {a: T.anulou, b: T.arquivado, texto: 'PROVAS ANULADAS'},
  {a: T.arquivado, b: T.a2019, texto: 'ARQUIVADO', destaque: true},
  {a: T.coaf, b: T.ramagem, texto: 'INVESTIGAÇÕES COM DADOS DO COAF SUSPENSAS'},
  {a: T.gravou, b: T.irregular, texto: 'REUNIÃO GRAVADA'},
  {a: T.interferencia, b: T.jairNegou, texto: 'MORO ACUSA INTERFERÊNCIA NA PF'},
  {a: T.covaxin, b: T.semNegocio, texto: 'PRECISA: EMPRESA DA COVAXIN'},
  {a: T.inss, b: T.bestbet, texto: 'INVESTIGADO NO CASO DO INSS'},
  {a: T.indicado, b: T.pfQuer, texto: 'LOTERJ: PRESIDENTE INDICADO POR FLÁVIO'},
  {a: T.oculto, b: T.amizade, texto: 'PEDIDO DE INVESTIGAÇÃO: SÓCIO OCULTO?'},
  {a: T.darkHorse, b: T.patrocinio, texto: 'FILME DARK HORSE'},
  {a: T.nega, b: T.advogado, texto: 'FRIAS NEGA DINHEIRO DE VORCARO'},
  {a: T.juri, b: T.anaClara + 0.8, texto: 'RECURSO PARA EVITAR O JÚRI'},
  {a: T.pensar, b: T.noRio, texto: '"PENSAR EM MATAR ALGUÉM NÃO É CRIME"', tam: 26},
  {a: T.mae2, b: T.pfLiga, texto: 'SUPLENTE: A MÃE DE FLÁVIO'},
  {a: T.cv, b: T.surpreso, texto: 'NÚCLEO POLÍTICO DO CV, SEGUNDO A PF'},
  {a: T.anistia, b: T.a2026b, texto: 'LIGOU A TARIFA À ANISTIA'},
  {a: T.serra, b: T.fontes, texto: 'TERRAS RARAS: SERRA VERDE (GO)'},
  {a: T.legenda, b: T.segue, texto: 'FONTES NA LEGENDA', destaque: true},
];
const RESPOSTAS: Txt[] = [
  {a: T.reduziria, b: T.a2011, texto: 'TIRARIA VAGAS DE MULHERES'},
  {a: T.distorceram, b: T.senado, texto: 'DISTORCERAM SUAS PALAVRAS'},
  {a: T.naEpoca, b: T.a2004, texto: 'NA ÉPOCA, ADRIANO ERA INOCENTE'},
  {a: T.relatorios, b: T.segundoPF, texto: 'HOMENAGENS SEGUIAM RELATÓRIOS'},
  {a: T.seguiuLei, b: T.defendeu, texto: 'O GABINETE SEGUIU A LEI'},
  {a: T.naoAutor, b: T.a2020, texto: 'NÃO É AUTOR DO TEXTO (MARINHO)'},
  {a: T.negou, b: T.a2019, texto: 'SEMPRE NEGOU'},
  {a: T.irregular, b: T.moro, texto: 'FOI DENUNCIAR IRREGULARIDADES (ADVOGADA)'},
  {a: T.jairNegou, b: T.pandemia, texto: 'JAIR NEGOU'},
  {a: T.semNegocio, b: T.oAmigo, texto: 'NÃO TEM NEGÓCIO COM ELE'},
  {a: T.amizade, b: T.a2025b, texto: 'É SÓ AMIZADE'},
  {a: T.patrocinio, b: T.frias, texto: 'PATROCÍNIO PRIVADO'},
  {a: T.advocacia, b: T.plano, texto: 'DIREITO À ADVOCACIA'},
  {a: T.surpreso, b: T.a2025c, texto: 'SE DISSE SURPRESO'},
  {a: T.injusta, b: T.anistia, texto: 'CHAMOU A TARIFA DE INJUSTA'},
  {a: T.fimTarifa, b: T.terras, texto: 'PEDIU O FIM DA NOVA TARIFA'},
];
const SELOS: Txt[] = [
  {a: T.cargo, b: T.alerj, texto: 'REPORTAGEM DA BBC BRASIL, 2019'},
  {a: T.unico, b: T.a2011, texto: 'ALERJ, VOTAÇÃO DE 2009'},
  {a: T.acioli, b: T.senado, texto: 'POST DE FLÁVIO, AGOSTO DE 2011'},
  {a: T.pec, b: T.a2003, texto: 'SENADO, 07/12/2022'},
  {a: T.homAdriano, b: T.a2004, texto: 'ALERJ: MOÇÃO 2003, MEDALHA 2005'},
  {a: T.condenadoPelo, b: T.segundoPF, texto: 'STF, 1ª TURMA, FEV/2026'},
  {a: T.segundoPF, b: T.defendeu, texto: 'RELATÓRIO DA PF'},
  {a: T.marcacao, b: T.a2020, texto: 'PL 3.723/2019'},
  {a: T.denunciou, b: T.arquivado, texto: 'MP-RJ, DENÚNCIA DE NOV/2020'},
  {a: T.arquivado, b: T.a2019, texto: 'STJ ANULOU AS PROVAS (2021) · ARQUIVADO (2022)'},
  {a: T.gravou, b: T.pandemia, texto: 'ÁUDIO LIBERADO PELO STF EM 2024'},
  {a: T.precisa, b: T.oAmigo, texto: 'REUNIÃO NO BNDES, 13/10/2020'},
  {a: T.pfQuer, b: T.a2025b, texto: 'PEDIDO DA PF AO STF, SEGUNDO A REVISTA PIAUÍ'},
  {a: T.jatinho, b: T.advogado, texto: 'REVISTA PIAUÍ, SET/2026'},
  {a: T.juri, b: T.plano, texto: 'RECURSO AO STJ, 2024'},
  {a: T.pensar, b: T.noRio, texto: 'POST DE FLÁVIO, 19/11/2024'},
  {a: T.pfLiga, b: T.a2025c, texto: 'RELATÓRIOS DA PF, 2026'},
  {a: T.porTrump, b: T.fontes, texto: 'VISITA A WASHINGTON, MAIO DE 2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (x.b !== undefined ? 1 - rampa(t, x.b - 0.35, x.b - 0.05, Easing.linear) : 1);

const Interface: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  let ano = '';
  let anoT = -1;
  for (const [a, txt] of ANOS) if (t >= a) [ano, anoT] = [txt, a];
  const kAno = ano ? rampa(t, anoT, anoT + 0.35) : 0;
  const chipsTopo = CHIPS.filter((c) => visivel(c, t) > 0);
  const resp = RESPOSTAS.find((r) => visivel(r, t) > 0);
  const selo = SELOS.find((s) => visivel(s, t) > 0);
  return (
    <>
      {ano ? (
        <div style={{position: 'absolute', top: 334, right: W - SEGURO.dir, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.4 + 0.6 * kAno, transform: `translateY(${(1 - kAno) * 8}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 800, letterSpacing: 2, color: tema.acento, whiteSpace: 'nowrap'}}>{ano}</div>
        </div>
      ) : null}
      {chipsTopo.map((c, i) => (
        <div key={c.texto} style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: c.y ?? 440 + i * 0, display: 'flex', justifyContent: 'center', opacity: visivel(c, t) > 0 ? 1 : 0}}>
          <div style={{opacity: Math.min(1, visivel(c, t) * 1.2)}}>
            <Chip tema={tema} texto={c.texto} k={entra(t, c.a, 0.45)} destaque={c.destaque} tam={c.tam ?? 28} />
          </div>
        </div>
      ))}
      {resp ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1110, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(resp, t) * 1.2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 14, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, transform: `translateY(${(1 - Math.min(1, entra(t, resp.a, 0.45))) * 14}px)`}}>
            <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 800, letterSpacing: 3, color: tema.acento}}>RESPOSTA</div>
            <div style={{fontFamily: FONTE, fontSize: 30, fontWeight: 700, color: tema.texto, whiteSpace: 'nowrap'}}>{resp.texto}</div>
          </div>
        </div>
      ) : null}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1240, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>FONTE: {selo.texto}</div>
        </div>
      ) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE O PERFIL</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8}}>{SERIE.toUpperCase()}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.26}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t, f: 'tique', v: 0.26}));
  PESSOAS.filter((p) => p.placa !== 0).forEach((p) => s.push({t: p.nasce, f: 'pop', v: 0.26}));
  [T.camara, T.alerj, T.senado, T.segundoPF, T.mpRio, T.stj, T.toffoli, T.receita, T.bndes, T.bestbet, T.loterj, T.master, T.tarifa].forEach((t) => s.push({t, f: 'pop', v: 0.22}));
  [T.a2026, T.comenta].forEach((t) => s.push({t, f: 'subida', v: 0.24}));
  [T.arquivado, T.suspendeu + 0.3].forEach((t) => s.push({t, f: 'baque', v: 0.24}));
  [T.gravou + 0.2, T.bestbet + 0.3].forEach((t) => s.push({t, f: 'bip', v: 0.22}));
  s.push({t: T.segue, f: 'ding', v: 0.32});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.5, T.quem + 0.6, T.fatos + 1.0, T.camara + 0.8, T.unico + 0.9, T.acioli + 1.0, T.pec + 0.6, T.praias + 0.4, T.adriano + 0.6, T.gabinete + 0.4, T.homRonald + 0.7, T.a2026 + 1.4, T.marielle + 0.6, T.destinou + 0.9,
  T.ong + 0.6, T.marcacao + 0.8, T.marinho + 0.8, T.queiroz + 0.8, T.arquivado + 0.5, T.toffoli + 0.8, T.coaf + 0.4, T.advogadas + 0.6, T.moro + 1.6, T.precisa + 0.7, T.willer + 0.6, T.indicado + 0.6, T.voos + 1.2,
  T.vorcaro + 0.6, T.darkHorse + 0.5, T.frias + 0.6, T.pm + 0.6, T.anaClara + 0.6, T.lula + 0.8, T.pensar + 0.8, T.canella + 0.6, T.bacellar + 0.6, T.porTrump + 0.6, T.rubio + 0.6, T.terras + 1.0, T.comenta + 0.6, T.segue + 1.0, T.bolso,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const FlavioAliados: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (CENAS[k].ini <= t) i = k;
  const ini = CENAS[i].ini;
  const fim = i + 1 < CENAS.length ? CENAS[i + 1].ini : durationInFrames / fps;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = CENAS[i].cam(t, ini, fim);
  // Sem desfoque de profundidade (aprendizado 003): tudo nítido.
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const longe = i === 0 || i === CENAS.length - 1;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={longe ? 480 : 260} sombraArea={longe ? 30 : 16} centro={longe ? [0, 0, 0] : [cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} centro={cam.alvo} tema={tema} />
      <AcabamentoCinema raioAO={0.6} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} tema={tema} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Flávio e aliados" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Quem anda', 'com Flávio?', 'Os fatos,', 'com fonte.'];
export const CapaFlavioAliados: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 400}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · FLÁVIO E ALIADOS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
