import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Moeda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Contador, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {CABECALHO, GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Trilha, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Balanca, CasaMini, CofreFGTS, Cone, ContadorVagas, Lupa, MarcoAno, Pessoa} from '../../pecas';
import {CopoPiso, Escola, MesaMaquete, PilhasDinheiro, PonteMini, PredioTCM, Prefeitura, RelatorioPDF, coresOI, type Pilha} from '../orcamentoilheus/pecas';
import {BarraMeses, CaixasMerenda, CarimboParecer, LivroEmenda, PlacaFonte3D} from './pecas';
import {PALAVRAS} from './palavras';

// 029. educação em ilhéus (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete de Ilhéus do 014 com a ESCOLA no centro e a RUA DO TEMPO em volta
// (um marco por ano, 2006 a 2026; coluna de moedas = gasto do ano, 1 moeda = R$ 5 milhões) e encaixa
// três trechos do Kit Mapas Animados (projetos/029.../mapas/educacao.mp4, composição EducacaoIlheus
// do kit): ILHÉUS (0 a 148), O FUNDEB (148 a 301) e É SEU (301 a 562).
// Fontes: SIOPE, RREO, LOA, balanços, pareceres do TCM-BA e notícias (audio/fontes.md).
// Neutro: nenhum nome de pessoa na tela; a investigação da merenda aparece com "segundo a PF" e a
// negativa da prefeitura no mesmo tamanho. Marca d'água @euMagnoLeite do começo ao fim.
// Plano: projetos/029. educação em ilhéus/plano.md (versão 2, aprovada em 05/11/2026).

export const FPS = 30;
const AUDIO_SEG = 179.06;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '029. educação em ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  // gancho e regra
  ilheus: quando('Ilheus gastou'),
  regra: quando('A regra'),
  p25: quando('25% dos impostos'),
  daEdu: quando('sao da educacao'),
  fundeb: quando('E o Fundeb'),
  // 2006 a 2008
  y2006: quando('2006.'),
  tesouro: quando('So o Tesouro'),
  m14: quando('14 milhoes'),
  antigo: quando('o antigo Fundeb'),
  y2007: quando('2007.'),
  nasce: quando('Nasce o Fundeb'),
  m19: quando('19 milhoes'),
  camRep07: quando('A Camara reprovou'),
  naoAchei: quando('O gasto, nao achei'),
  y2008: quando('2008.'),
  siope: quando('Comeca o SIOPE'),
  m43: quando('43 milhoes'),
  limite: quando('no limite'),
  aprov08: quando('Contas aprovadas.'),
  // 2009 a 2012
  y2009: quando('2009 e 2010'),
  m54: quando('54 e 67'),
  m67: quando('67 milhoes'),
  p32: quando('Em 2009, 32%'),
  maior: quando('o maior da serie'),
  y2011: quando('2011.'),
  siope11: quando('O SIOPE mostra mais de 25%'),
  tcm11: quando('Mas o Tribunal de Contas'),
  p22: quando('achou 22%'),
  rej11: quando('recomendou rejeitar as contas.'),
  camRep11: quando('A Camara reprovou.', 2),
  y2012: quando('2012.'),
  m69: quando('69 milhoes'),
  m83: quando('menos que os 83'),
  abaixo12: quando('Abaixo do minimo, e nova'),
  rej12: quando('nova rejeicao do Tribunal'),
  // 2013 a 2017
  y2013: quando('2013 a 2015'),
  m81: quando('De 81 para 88'),
  acima15: quando('acima do minimo. Em 2015'),
  m105: quando('bem abaixo dos 105'),
  y2016: quando('2016.'),
  m119: quando('Previsto: 119'),
  m96: quando('Gasto: 96'),
  siope16: quando('O SIOPE diz 22%'),
  pref16: quando('prefeitura, 27%'),
  y2017: quando('2017.'),
  m100: quando('Passa dos 100'),
  m108: quando('108.'),
  // 2018 a 2021
  y2018: quando('2018.'),
  tcm18: quando('O Tribunal achou menos'),
  defesa: quando('aceitou a defesa'),
  mesmoAssim: quando('Mesmo assim'),
  rej18: quando('rejeitar as contas, tambem'),
  falhas: quando('falhas no Fundeb'),
  y2019: quando('2019.'),
  pref19: quando('A prefeitura informou'),
  tcm19: quando('O Tribunal achou 24'),
  abaixo19: quando('abaixo do minimo. Rejeicao'),
  rej19: quando('Rejeicao de novo'),
  y2020: quando('2020.'),
  terceira: quando('Terceira rejeicao'),
  y2021: quando('2021.'),
  sobe: quando('O Fundeb sobe'),
  m98: quando('98 milhoes'),
  siope21: quando('No SIOPE, abaixo'),
  pandemia: quando('a pandemia livrou'),
  incompleto: quando('saiu incompleto'),
  comoEm2020: quando('como em 2020'),
  // 2022 a 2024
  y2022: quando('2022 e 2023'),
  m170: quando('170 e 195'),
  m195: quando('195 milhoes'),
  acima23: quando('Acima do minimo, segundo'),
  segTrib: quando('segundo o Tribunal.'),
  prec23: quando('Em 2023, quase 43'),
  prec43: quando('43 milhoes de precatorios'),
  precFundef: quando('precatorios do Fundef.'),
  y2024: quando('2024.'),
  recorde: quando('Recorde'),
  m269: quando('269'),
  pagou: quando('A prefeitura pagou 51'),
  fundefAos: quando('Fundef aos trabalhadores'),
  aosTrab: quando('aos trabalhadores'),
  ajuda: quando('ajuda federal'),
  infantil: quando('educacao infantil'),
  p11: quando('foi 11%'),
  p15: quando('15% para obras'),
  p2: quando('menos de 2%'),
  // 2025
  y2025: quando('2025.'),
  m277: quando('Previsto: 277'),
  n277: quando('277 milhoes'),
  balanco: quando('O balanco mostra'),
  planilha: quando('a planilha do portal'),
  relat: quando('o relatorio 300'),
  siope25: quando('O SIOPE diz 26'),
  vira25: quando('26%. O relatorio'),
  pref25: quando('prefeitura, 24'),
  abaixo25: quando('24%, abaixo', 2),
  obras: quando('Obras saltam'),
  // 2026
  y2026: quando('2026, ate agosto'),
  m240: quando('Previstos 240'),
  emp: quando('213 empenhados'),
  pagos: quando('150 pagos'),
  maio: quando('Em maio'),
  pf: quando('Policia Federal investigou'),
  contrato: quando('contrato de merenda'),
  sobrepreco: quando('com sobrepreco'),
  m17: quando('1,7 milhao'),
  segPF: quando('segundo a PF'),
  nega: quando('A prefeitura nega'),
  mp: quando('Ministerio Publico apura'),
  // a conta
  conta: quando('A conta'),
  de2008: quando('de 2008 a 2025'),
  bi209: quando('2 bilhoes e 90'),
  inflacao: quando('Com a inflacao'),
  bi319: quando('3 bilhoes e 190'),
  vaquinha: quando('a vaquinha devolveu'),
  dobro: quando('mais que o dobro'),
  pos613: quando('Ilheus pos 613'),
  recebeu: quando('recebeu 1 bilhao'),
  // fim
  confira: quando('Confira no portal'),
  chegou: quando('Esse dinheiro chegou'),
  escola: quando('escola do seu bairro'),
  meConta: quando('Me conta'),
  segue: quando('E segue o'),
};

const ESTADOS: [number, string][] = [
  [0, 'EDUCAÇÃO EM ILHÉUS'],
  [T.regra, 'A REGRA'],
  [T.fundeb, 'O FUNDEB'],
  [T.y2006, '2006–2008'],
  [T.y2009, '2009–2012'],
  [T.y2013, '2013–2017'],
  [T.y2018, '2018–2021'],
  [T.y2022, '2022–2024'],
  [T.y2025, '2025'],
  [T.y2026, '2026'],
  [T.conta, 'A CONTA'],
  [T.confira, 'É SEU'],
];

// ---------- Os trechos de mapa (Kit Mapas), em quadros de 30 ----------
// O vídeo do kit tem A (0 a 148), B (148 a 301) e C (301 a 562). Cada trecho começa 0,2 s antes da palavra.
const q = (s: number) => Math.round(s * FPS);
const KIT_B = 148;
const KIT_C = 301;
const MAPA_A = {de: 0, ate: q(T.regra), origem: 0, entrada: 0};
const MAPA_B = {de: q(T.fundeb) - 6, ate: q(T.y2006), origem: KIT_B + (q(T.fundeb) - 6 - q(T.fundeb - 0.2)), entrada: 6};
const MAPA_C = {de: q(T.confira) - 6, ate: QUADROS, origem: KIT_C + (q(T.confira) - 6 - q(T.confira - 0.2)), entrada: 6};
const noMapa = (t: number) => t < T.regra || (t >= T.fundeb && t < T.y2006) || t >= T.confira;
const soMapa = (t: number) => t < T.regra - 0.3 || (t > T.fundeb + 0.1 && t < T.y2006 - 0.3) || t > T.confira + 0.1;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
// Rua do tempo: 2006 em 200°, 11° por ano (2016 bem na frente), no sentido horário visto de cima.
const R_MARCO = 5.0;
const R_COL = 4.2;
const R_COPO = 6.0;
const R_COPO2 = 6.75;
const angAno = (ano: number) => ((200 - (ano - 2006) * 11) * Math.PI) / 180;
const naRua = (ano: number, r: number, y = 0, dAng = 0): V3 => {
  const a = angAno(ano) + (dAng * Math.PI) / 180;
  return [r * Math.cos(a), y, r * Math.sin(a)];
};
/** giro para a frente (z+) de uma peça apontar para fora da roda, no ano dado */
const giroFora = (ano: number, dAng = 0) => {
  const p = naRua(ano, 1, 0, dAng);
  return Math.atan2(p[0], p[2]);
};
const ANOS = Array.from({length: 21}, (_, i) => 2006 + i);
const ESCOLA: V3 = [0, 0, 0];
const PREF: V3 = [-6.0, 0, -4.2];
const COFRE: V3 = [-7.4, 0, 0.4];
const TCM: V3 = [5.6, 0, -4.0];
const CAIXAS: V3 = [-1.1, 0, -3.7];
const BALANCA: V3 = [1.6, 0, -3.5];
const OBRA: V3 = [2.9, 0, -1.1];
const COPO_REGRA: V3 = [2.6, 0, 1.6];
const CASAS: [V3, number][] = [
  [[-4.0, 0, -6.6], 0.5],
  [[-2.2, 0, -7.6], 0.2],
  [[3.0, 0, -7.4], -0.3],
  [[0.4, 0, -8.1], 0.1],
];
// árvores e casas só no arco de trás (a rua do tempo ocupa esquerda, frente e direita)
const ARVORES: V3[] = [
  [-5.6, 0, -6.4],
  [-7.0, 0, -4.4],
  [7.2, 0, -3.6],
  [5.4, 0, -6.6],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
// 1 moeda = R$ 5 milhões; a pilha do 014 tem 10 moedas (R$ 50 milhões)
const pil = (mi: number) => mi / 50;
const ALT_MOEDA = 0.06;
const altura = (mi: number) => 0.09 + (mi / 5) * ALT_MOEDA;

// ---------- Os anos (valores em R$ milhões) ----------
type Ano = {gasto?: number; cresce?: number; previsto?: number; prevT?: number};
const DADOS: Record<number, Ano> = {
  2008: {gasto: 42.66, cresce: T.m43},
  2009: {gasto: 54.2, cresce: T.m54},
  2010: {gasto: 66.78, cresce: T.m67},
  2011: {gasto: 76.04, cresce: T.y2011 + 0.2},
  2012: {gasto: 69.44, cresce: T.m69, previsto: 83.24, prevT: T.m83},
  2013: {gasto: 81.04, cresce: T.m81},
  2014: {gasto: 79.88, cresce: T.m81 + 0.25},
  2015: {gasto: 88.31, cresce: T.m81 + 0.5, previsto: 104.68, prevT: T.m105},
  2016: {gasto: 96.14, cresce: T.m96, previsto: 119.44, prevT: T.m119},
  2017: {gasto: 108.28, cresce: T.y2017 + 0.1},
  2018: {gasto: 112.4, cresce: T.y2018 + 0.1},
  2019: {gasto: 109.24, cresce: T.y2019 + 0.1},
  2020: {gasto: 108.39, cresce: T.y2020 + 0.1},
  2021: {gasto: 128.72, cresce: T.sobe},
  2022: {gasto: 170.1, cresce: T.m170},
  2023: {gasto: 194.63, cresce: T.m170 + 0.3},
  2024: {gasto: 269.27, cresce: T.recorde},
  2025: {gasto: 231.19, cresce: T.balanco, previsto: 276.86, prevT: T.m277},
  2026: {previsto: 239.86, prevT: T.m240},
};
const ACESO: Record<number, [number, number]> = {
  2006: [T.y2006, T.y2007],
  2007: [T.y2007, T.y2008],
  2008: [T.y2008, T.y2009],
  2009: [T.y2009, T.y2011],
  2010: [T.y2009, T.y2011],
  2011: [T.y2011, T.y2012],
  2012: [T.y2012, T.y2013],
  2013: [T.y2013, T.y2016],
  2014: [T.y2013 + 0.25, T.y2016],
  2015: [T.y2013 + 0.5, T.y2016],
  2016: [T.y2016, T.y2017],
  2017: [T.y2017, T.y2018],
  2018: [T.y2018, T.y2019],
  2019: [T.y2019, T.y2020],
  2020: [T.y2020, T.y2021],
  2021: [T.y2021, T.y2022],
  2022: [T.y2022, T.y2024],
  2023: [T.y2022, T.y2024],
  2024: [T.y2024, T.y2025],
  2025: [T.y2025, T.y2026],
  2026: [T.y2026, T.conta],
};

// copos: [ano, nível %, quando entra, segundo copo?, tempo em que passa a ser "abaixo" (marsala) ou acima]
type Copo = {ano: number; nivel: number; a: number; fora?: boolean; ate?: number; de?: number; neutro?: number};
const COPOS: Copo[] = [
  {ano: 2008, nivel: 25.24, a: T.limite},
  {ano: 2009, nivel: 32.33, a: T.p32},
  {ano: 2011, nivel: 25.75, a: T.siope11},
  {ano: 2011, nivel: 22.43, a: T.p22, fora: true},
  {ano: 2012, nivel: 22.79, a: T.abaixo12},
  {ano: 2013, nivel: 29.19, a: T.acima15},
  {ano: 2014, nivel: 25.3, a: T.acima15 + 0.15},
  {ano: 2015, nivel: 26.47, a: T.acima15 + 0.3},
  {ano: 2016, nivel: 22.1, a: T.siope16},
  {ano: 2016, nivel: 27.46, a: T.pref16, fora: true},
  {ano: 2018, nivel: 22.89, a: T.tcm18, de: 25.6},
  {ano: 2019, nivel: 26.77, a: T.pref19},
  {ano: 2019, nivel: 24.03, a: T.tcm19, fora: true},
  {ano: 2021, nivel: 22.32, a: T.siope21, neutro: T.pandemia + 0.6},
  {ano: 2022, nivel: 26.93, a: T.acima23},
  {ano: 2023, nivel: 29.32, a: T.acima23 + 0.2},
  {ano: 2025, nivel: 26.23, a: T.siope25},
  {ano: 2025, nivel: 24.18, a: T.pref25, fora: true},
  {ano: 2026, nivel: 18.52, a: T.emp + 0.6, neutro: 0},
];

type Carimbo = {ano: number; linhas: string[]; tipo: 'rejeita' | 'aprova'; a: number; nivel?: number};
const CARIMBOS: Carimbo[] = [
  {ano: 2007, linhas: ['CÂMARA:', 'REPROVADA'], tipo: 'rejeita', a: T.camRep07},
  {ano: 2008, linhas: ['CÂMARA:', 'APROVADA'], tipo: 'aprova', a: T.aprov08},
  {ano: 2011, linhas: ['TCM:', 'REJEIÇÃO'], tipo: 'rejeita', a: T.rej11},
  {ano: 2011, linhas: ['CÂMARA:', 'REPROVADA'], tipo: 'rejeita', a: T.camRep11, nivel: 1},
  {ano: 2012, linhas: ['TCM:', 'REJEIÇÃO'], tipo: 'rejeita', a: T.rej12},
  {ano: 2013, linhas: ['CÂMARA:', 'APROVADA'], tipo: 'aprova', a: T.acima15 + 0.4},
  {ano: 2014, linhas: ['CÂMARA:', 'APROVADA'], tipo: 'aprova', a: T.acima15 + 0.6},
  {ano: 2018, linhas: ['TCM:', 'REJEIÇÃO'], tipo: 'rejeita', a: T.rej18},
  {ano: 2019, linhas: ['TCM:', 'REJEIÇÃO'], tipo: 'rejeita', a: T.rej19},
  {ano: 2020, linhas: ['TCM:', 'REJEIÇÃO'], tipo: 'rejeita', a: T.terceira},
  {ano: 2022, linhas: ['TCM: APROV.', 'C/ RESSALVAS'], tipo: 'aprova', a: T.segTrib},
  {ano: 2023, linhas: ['TCM: APROV.', 'C/ RESSALVAS'], tipo: 'aprova', a: T.segTrib + 0.2},
];

// 2025: as três fontes, em arco do lado de fora do marco
const FONTES25: {txt: string; sub: string; mi: number; a: number; dAng: number}[] = [
  {txt: 'BALANÇO', sub: 'ANUAL', mi: 231.19, a: T.balanco, dAng: 9},
  {txt: 'PLANILHA', sub: 'DO PORTAL', mi: 248.95, a: T.planilha, dAng: 0},
  {txt: 'RELATÓRIO', sub: 'RREO DEZ/2025', mi: 300.23, a: T.relat, dAng: -9},
];
const R_FONTES = 7.7;

// ---------- Colunas de moedas ----------
const colunasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const meio: Pilha[] = [];
  const conta = rampa(t, T.de2008, T.de2008 + 1.2) * (1 - rampa(t, T.confira - 0.6, T.confira));
  ANOS.forEach((ano) => {
    const d = DADOS[ano];
    if (!d) return;
    const [a, b] = ACESO[ano];
    const aceso = Math.max(janela(t, a, b, 0.5), 0.6 * conta);
    const corA = mistura(ouro, tema.branco, 0.3 * aceso);
    const p = naRua(ano, R_COL);
    if (d.gasto && d.cresce !== undefined && t >= d.cresce) {
      const k = rampa(t, d.cresce, d.cresce + 0.9, sai);
      solidas.push({p, n: pil(d.gasto) * k, cor: corA});
    }
    if (d.previsto && d.prevT !== undefined && t >= d.prevT) {
      const k = rampa(t, d.prevT, d.prevT + 0.8, sai) * (1 - rampa(t, b, b + 0.6));
      if (k > 0.01) fantasmas.push({p, n: pil(d.previsto) * k, cor: ouro});
    }
  });
  // 2023: os precatórios do Fundef em cima da coluna (cinza claro)
  if (t >= T.prec23) {
    const k = rampa(t, T.prec23, T.prec23 + 0.8) * (1 - rampa(t, T.pagou, T.pagou + 1.4));
    if (k > 0.01) solidas.push({p: naRua(2023, R_COL, altura(194.63) - 0.065), n: pil(42.94) * k, cor: mistura(tema.objetoClaro, tema.acento, 0.2 * pulso(t, T.prec43, 1.0))});
  }
  // 2026: empenhado (meio transparente) e pago (sólido)
  if (t >= T.emp) {
    const p = naRua(2026, R_COL);
    const k = rampa(t, T.emp, T.emp + 0.8, sai);
    meio.push({p, n: pil(213.08) * k, cor: ouro});
    if (t >= T.pagos) solidas.push({p, n: pil(150.17) * rampa(t, T.pagos, T.pagos + 0.7, sai), cor: mistura(ouro, tema.branco, 0.3 * janela(t, T.pagos, T.conta, 0.5))});
  }
  // 2025: as três colunas das fontes
  FONTES25.forEach((f) => {
    if (t < f.a) return;
    const k = rampa(t, f.a + 0.2, f.a + 1.0, sai) * (1 - rampa(t, T.y2026, T.y2026 + 0.8));
    if (k > 0.01) solidas.push({p: soma(naRua(2025, R_FONTES, 0, f.dAng), [0, 0, 0]), n: pil(f.mi) * k, cor: mistura(ouro, tema.branco, 0.25 * janela(t, f.a, f.a + 2.5, 0.5))});
  });
  // a conta: o fantasma da inflação em cima de cada coluna (de 2008 a 2025: 3,19 ÷ 2,09 ≈ 1,53)
  const infl = rampa(t, T.inflacao, T.inflacao + 1.2) * (1 - rampa(t, T.confira - 0.6, T.confira));
  if (infl > 0.01)
    ANOS.forEach((ano) => {
      const d = DADOS[ano];
      if (!d?.gasto) return;
      fantasmas.push({p: naRua(ano, R_COL, altura(d.gasto) - 0.065), n: pil(d.gasto * 0.53) * infl, cor: ouro});
    });
  return {solidas, fantasmas, meio};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, meio} = colunasEm(t, tema);
  // escola: ilumina na regra
  const escolaAceso = janela(t, T.regra, T.fundeb, 0.6) + 0.5 * janela(t, T.chegou, FIM, 0.6);
  // copo da regra e as 4 moedas (cena 2)
  const regraK = vis(t, T.p25, T.y2006);
  const moedasK = vis(t, T.daEdu - 0.2, T.y2006);
  // marcos da rua: nascem em "ano a ano" (a regra), cada um acende no seu tempo
  const marcos = rampa(t, T.regra + 0.4, T.regra + 1.6);
  // TCM: sobe em 2011 e fica
  const tcmK = rampa(t, T.tcm11 - 0.3, T.tcm11 + 0.7);
  // merenda (2026): atrás da escola
  const merendaK = vis(t, T.maio - 0.1, T.conta + 0.6);
  const lupaK = entra(t, T.pf, 0.6) * (1 - rampa(t, T.conta, T.conta + 0.6));
  const balK = entra(t, T.sobrepreco - 0.1, 0.5) * (1 - rampa(t, T.conta, T.conta + 0.6));
  const inclina = 0.7 * rampa(t, T.m17, T.m17 + 0.6) - 0.7 * rampa(t, T.nega, T.nega + 0.8);
  // cofre do Fundeb (a conta)
  const cofreK = rampa(t, T.vaquinha - 0.2, T.vaquinha + 0.6) * (1 - rampa(t, T.confira - 0.4, T.confira));
  const ida = rampa(t, T.pos613, T.pos613 + 1.0);
  const volta = rampa(t, T.recebeu, T.recebeu + 1.0);
  // 2024: barras do VAAT e os trabalhadores
  const barrasK = vis(t, T.ajuda - 0.1, T.y2025);
  const trabK = vis(t, T.pagou, T.ajuda);
  // 2025: obra
  const obraK = vis(t, T.obras - 0.1, T.y2026 + 0.4);
  // relatórios incompletos (2020 e 2021)
  const relK = (a: number) => vis(t, a, T.y2022);
  return (
    <group>
      <MesaMaquete tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}
      <PonteMini tema={tema} pos={[4.6, 0, -6.6]} rotY={-0.85} escala={0.8} />
      <Prefeitura tema={tema} pos={PREF} rotY={0.6} escala={0.75} sobe={1} aceso={janela(t, T.vaquinha, T.confira, 0.5)} />

      {/* a escola no centro */}
      <Escola tema={tema} pos={ESCOLA} escala={1.25} sobe={1} aceso={Math.min(1, escolaAceso)} />
      {regraK > 0.02 ? (
        <group position={COPO_REGRA} scale={0.7}>
          <CopoPiso tema={tema} pos={[0, 0, 0]} sobe={regraK} piso={25} risco={rampa(t, T.p25, T.p25 + 0.6)} nivel={25 * rampa(t, T.p25 + 0.2, T.p25 + 1.2)} acima={0.6 * rampa(t, T.p25 + 1.0, T.p25 + 1.6)} />
        </group>
      ) : null}
      {moedasK > 0.02
        ? [0, 1, 2, 3].map((i) => {
            const k = entra(t, T.daEdu - 0.2 + i * 0.1, 0.4) * moedasK;
            const rola = i === 0 ? rampa(t, T.daEdu + 0.5, T.daEdu + 1.3) : 0;
            const p: V3 = i === 0 ? [-0.9 + 0.9 * rola, 0.33, 2.6 - 1.0 * rola] : [-0.3 + i * 0.6, 0.33, 2.6];
            return <Moeda key={i} tema={tema} pos={p} rot={[Math.PI / 2, 0, rola * 6]} r={0.28} escala={k * (1 - 0.6 * rampa(t, T.daEdu + 1.1, T.daEdu + 1.4) * (i === 0 ? 1 : 0))} cor={i === 0 ? mistura(C.ouro, tema.acento, rampa(t, T.daEdu + 0.3, T.daEdu + 0.8)) : C.ouro} brilho={i === 0 ? 0.3 : 0} />;
          })
        : null}

      {/* a rua do tempo: marcos */}
      {ANOS.map((ano) => {
        const [a, b] = ACESO[ano];
        const aceso = ano === 2026 ? 0.4 + 0.6 * janela(t, a, b, 0.5) : janela(t, a, b, 0.5);
        return (
          <group key={ano} position={naRua(ano, R_MARCO)} rotation={[0, giroFora(ano), 0]}>
            <MarcoAno tema={tema} pos={[0, 0, 0]} ano={String(ano)} k={0.62 * marcos} aceso={aceso} />
          </group>
        );
      })}
      {/* "?" de 2006 e 2007 */}
      {[2006, 2007].map((ano) => {
        const k = vis(t, T.naoAchei, T.y2009);
        return k > 0.02 ? <Placa key={ano} tema={tema} pos={naRua(ano, R_COL, 0.55)} rot={[0, giroFora(ano), 0]} larg={0.5 * Math.min(1, k)} alt={0.5 * Math.min(1, k)} linhas={[{t: '?', tam: 700, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} /> : null;
      })}
      {/* Fundef 2006 e Fundeb 2007: coluninhas de outra cor (o dinheiro do fundo, não o gasto) */}
      <PilhasDinheiro
        max={20}
        pilhas={(
          [
            {p: naRua(2006, R_COL - 0.6), n: pil(14.09) * rampa(t, T.m14, T.m14 + 0.6), cor: tema.objetoClaro},
            {p: naRua(2007, R_COL - 0.6), n: pil(19.14) * rampa(t, T.m19, T.m19 + 0.6), cor: tema.objetoClaro},
          ] as Pilha[]
        ).map((x) => ({...x, n: x.n * (1 - rampa(t, T.y2009, T.y2009 + 0.6))}))
          .filter((x) => x.n > 0.001)}
      />

      {/* as colunas */}
      <PilhasDinheiro pilhas={solidas} max={700} />
      <PilhasDinheiro pilhas={meio} max={60} opacidade={0.45} largura={1.0} />
      <PilhasDinheiro pilhas={fantasmas} max={420} opacidade={0.28} largura={1.15} />
      {/* linha dos 100 milhões (2017) */}
      {(() => {
        const k = vis(t, T.m100, T.y2018);
        return k > 0.02 ? (
          <group position={[0, altura(100), 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[R_COL, 0.025, 8, 160]} />
              <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.4} transparent opacity={Math.min(1, k)} />
            </mesh>
          </group>
        ) : null;
      })()}

      {/* os copos dos 25% */}
      {COPOS.map((c, i) => {
        const fim = c.ano === 2026 ? T.conta : ACESO[c.ano][1] + 0.3;
        const k = vis(t, c.a - 0.1, Math.max(fim, c.a + 2));
        if (k < 0.02) return null;
        const nivel = c.de !== undefined ? c.nivel + (c.de - c.nivel) * rampa(t, T.defesa, T.defesa + 1.0) : c.nivel;
        const enche = nivel * rampa(t, c.a, c.a + 1.0);
        const abaixo = nivel < 25 && c.ano !== 2026;
        const neutro = c.neutro !== undefined ? (c.neutro === 0 ? 1 : rampa(t, c.neutro, c.neutro + 0.6)) : 0;
        return (
          <group key={i} position={naRua(c.ano, c.fora ? R_COPO2 : R_COPO)} scale={0.55}>
            <CopoPiso tema={tema} pos={[0, 0, 0]} sobe={k} piso={25} risco={1} nivel={enche} falta={abaixo ? (1 - neutro) * rampa(t, c.a + 0.8, c.a + 1.3) : 0} acima={!abaixo && nivel >= 25 ? 0.4 * janela(t, c.a + 0.8, c.a + 2.4, 0.4) : 0} />
          </group>
        );
      })}

      {/* carimbos */}
      {CARIMBOS.map((c, i) => {
        const fim = Math.max(ACESO[c.ano][1], c.a + 2);
        const k = rampa(t, c.a, c.a + 0.35, sai) * (1 - rampa(t, fim, fim + 0.5));
        return <CarimboParecer key={i} tema={tema} pos={naRua(c.ano, R_MARCO, 1.6 + (c.nivel ?? 0) * 0.5)} rotY={giroFora(c.ano)} linhas={c.linhas} tipo={c.tipo} k={k} escala={0.85} />;
      })}

      {/* 2011 a 2020: o Tribunal de Contas e o auditor */}
      <PredioTCM tema={tema} pos={TCM} sobe={tcmK} aceso={Math.max(janela(t, T.tcm11, T.y2012, 0.5), janela(t, T.y2018, T.y2021, 0.5), 0.6 * janela(t, T.segTrib, T.y2024, 0.5))} escala={0.85} />
      {(() => {
        const k = vis(t, T.tcm18, T.y2020 + 0.4);
        if (k < 0.02) return null;
        const p = mistura2(naRua(2018, 6.9), naRua(2019, 7.1), rampa(t, T.y2019, T.y2019 + 1.2));
        return (
          <Pessoa tema={tema} pos={p} rotY={giroFora(2019) + Math.PI} cor={tema.objeto} escala={0.55 * Math.min(1, k)}>
            <group position={[0.27, 1.25, 0.42]} rotation={[0.3, 0, 0]}>
              <Lupa tema={tema} pos={[0, 0.2 + 0.25 * rampa(t, T.tcm19, T.tcm19 + 0.5), 0]} escala={0.45} />
            </group>
            <Placa tema={tema} pos={[0, 1.36, 0.24]} larg={0.42} alt={0.14} linhas={[{t: 'TCM-BA', tam: 220, cor: tema.tinta, peso: 900}]} fundo={tema.objetoClaro} />
          </Pessoa>
        );
      })()}

      {/* 2020 e 2021: as folhas dos relatórios incompletos */}
      {[
        {ano: 2021, a: T.incompleto, sub: 'DEZ/2021'},
        {ano: 2020, a: T.comoEm2020, sub: 'DEZ/2020'},
      ].map((r) => {
        const k = relK(r.a);
        return k > 0.02 ? (
          <group key={r.ano} position={naRua(r.ano, R_COPO, 1.4)} rotation={[0, giroFora(r.ano), 0]}>
            <group rotation={[Math.PI / 2 - 0.2, 0, 0]}>
              <RelatorioPDF tema={tema} pos={[0, 0, 0]} titulo="RREO" sub={r.sub} escala={0.7 * Math.min(1, k)} abre={0.85} />
            </group>
          </group>
        ) : null;
      })}
      {/* 2021: o livrinho da emenda */}
      <group position={naRua(2021, R_COPO2 + 0.3)} rotation={[0, giroFora(2021), 0]}>
        <LivroEmenda tema={tema} pos={[0, 0, 0]} k={vis(t, T.pandemia - 0.1, T.y2022)} />
      </group>

      {/* 2024: os trabalhadores da educação e as barras do VAAT */}
      {trabK > 0.02
        ? [0, 1, 2, 3, 4, 5].map((i) => (
            <Pessoa key={i} tema={tema} pos={naRua(2024, 6.9 + (i % 2) * 0.55, 0, 6 + Math.floor(i / 2) * 4)} rotY={giroFora(2024, 6) + Math.PI} cor={tema.pessoa} escala={0.45 * Math.min(1, entra(t, T.pagou + i * 0.08, 0.4)) * Math.min(1, trabK)} />
          ))
        : null}
      {trabK > 0.02
        ? Array.from({length: 8}).map((_, i) => {
            const k = rampa(t, T.fundefAos + i * 0.12, T.fundefAos + 0.9 + i * 0.12);
            if (k <= 0 || k >= 1) return null;
            return <Moeda key={i} tema={tema} pos={curva(naRua(2023, R_COL, altura(194.63) + 0.2), naRua(2024, 7.0, 0.6, 10), 1.6, k)} r={0.12} />;
          })
        : null}
      <group position={naRua(2024, 6.9, 0, -4)} rotation={[0, giroFora(2024, -4), 0]}>
        <ContadorVagas tema={tema} pos={[-0.85, 0, 0]} escala={0.8 * barrasK} enche={0.1143 * rampa(t, T.p11 - 0.3, T.p11 + 0.6)} destaque={0} />
        <ContadorVagas tema={tema} pos={[0.85, 0, 0]} escala={0.8 * entra(t, T.p15 - 0.1, 0.45) * Math.min(1, barrasK)} enche={0.0181 * rampa(t, T.p2 - 0.3, T.p2 + 0.5)} destaque={0} />
        {barrasK > 0.02 ? (
          <>
            <Placa tema={tema} pos={[-0.85, 1.92, 0.07]} larg={1.1} alt={0.18} linhas={[{t: 'META 50%', tam: 160, cor: tema.objetoClaro, peso: 900, mono: true}]} />
            {t > T.p15 ? <Placa tema={tema} pos={[0.85, 1.92, 0.07]} larg={1.1} alt={0.18} linhas={[{t: 'META 15%', tam: 160, cor: tema.objetoClaro, peso: 900, mono: true}]} /> : null}
          </>
        ) : null}
      </group>

      {/* 2025: as placas das fontes e a obra */}
      {FONTES25.map((f) => (
        <PlacaFonte3D key={f.txt} tema={tema} pos={naRua(2025, R_FONTES + 0.9, 0, f.dAng)} rotY={giroFora(2025, f.dAng)} texto={f.txt} sub={f.sub} k={entra(t, f.a, 0.45) * (1 - rampa(t, T.siope25, T.siope25 + 0.5))} aceso={janela(t, f.a, f.a + 2.5, 0.5)} />
      ))}
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK)}>
          {[0, 1, 2].map((i) => (
            <Caixa3 key={i} tema={tema} i={i} />
          ))}
          <Cone tema={tema} pos={[0.7, 0.06, 0.5]} k={0.8} />
          <Cone tema={tema} pos={[-0.7, 0.06, 0.6]} k={0.8} />
        </group>
      ) : null}

      {/* 2026: barra dos meses */}
      <group position={naRua(2026, 6.4, 0.35)} rotation={[0, giroFora(2026), 0]}>
        <BarraMeses tema={tema} pos={[0, 0, 0]} k={vis(t, T.y2026, T.maio + 0.4)} meses={8 * rampa(t, T.y2026, T.y2026 + 1.2)} dez={pulso(t, T.maio - 1.6, 1.2)} />
      </group>

      {/* 2026: a merenda (atrás da escola) */}
      <CaixasMerenda tema={tema} pos={CAIXAS} rotY={Math.PI} k={merendaK} />
      <Lupa tema={tema} pos={soma(CAIXAS, [0.2 * Math.sin(t * 0.8), 2.0 + 0.1 * Math.sin(t * 1.3), -0.1])} rot={[0, Math.PI, 0.3]} escala={0.9 * lupaK} />
      <Balanca
        tema={tema}
        pos={BALANCA}
        escala={0.85 * balK}
        inclina={inclina}
        esq={<group rotation={[0, Math.PI, 0]}><Placa tema={tema} pos={[0, 0.42, 0]} larg={1.3} alt={0.62} linhas={[{t: 'SEGUNDO A PF', tam: 120, cor: tema.objetoClaro, peso: 900, mono: true}, {t: 'SOBREPREÇO', tam: 130, cor: tema.objetoClaro, peso: 900}, {t: '> R$ 1,7 MI', tam: 130, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.3} /></group>}
        dir={t > T.nega - 0.2 ? <group rotation={[0, Math.PI, 0]}><Placa tema={tema} pos={[0, 0.42, 0]} larg={1.3} alt={0.62} linhas={[{t: 'PREFEITURA', tam: 150, cor: tema.objetoClaro, peso: 900}, {t: 'NEGA', tam: 220, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.3} /></group> : null}
      />

      {/* a conta: o cofre do Fundeb e a canaleta de moedas */}
      {cofreK > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.4 * (1 - cofreK), COFRE[2]]} escala={0.7} abre={volta} trava={1 - rampa(t, T.vaquinha, T.vaquinha + 0.4)} brilho={0.3 * janela(t, T.dobro, T.confira, 0.5)} /> : null}
      {cofreK > 0.02 ? <Placa tema={tema} pos={soma(COFRE, [-0.75, 1.25, 0])} rot={[0, -Math.PI / 2, 0]} larg={1.0} alt={0.26} linhas={[{t: 'FUNDEB', tam: 230, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.3} /> : null}
      {ida > 0.01 && cofreK > 0.02 ? <Trilha f={(s) => curva(soma(PREF, [-0.3, 0.6, 1.0]), soma(COFRE, [0.3, 0.9, -0.3]), 1.2, s)} prog={ida} cor={C.ouro} n={14} raio={0.035} opacidade={Math.min(1, cofreK)} /> : null}
      {volta > 0.01 && cofreK > 0.02 ? <Trilha f={(s) => curva(soma(COFRE, [0.5, 0.9, 0.2]), soma(PREF, [0.2, 0.7, 1.2]), 1.9, s)} prog={volta} cor={tema.acento} n={30} raio={0.075} opacidade={Math.min(1, cofreK)} /> : null}
    </group>
  );
};

const mistura2 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** tijolos da obra (2025) */
const Caixa3: React.FC<{tema: Tema; i: number}> = ({tema, i}) => {
  const C = coresOI(tema);
  return (
    <mesh position={[0, 0.17 + i * 0.22, 0]} castShadow>
      <boxGeometry args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} />
      <meshStandardMaterial color={mistura(C.alerta, C.areia, 0.45)} roughness={0.9} />
    </mesh>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
/** olhando um ano de fora da roda: `el` é a altura da direção (0,3 baixo; 0,9 alto); `dAng` gira em volta. */
const noAno = (ano: number, larg: number, alt: number, el = 0.45, dAng = 0, r = R_MARCO, y = 1.0): Cam => {
  const p = naRua(ano, 1, 0, dAng);
  return E(naRua(ano, r, y), larg * 0.8, alt * 0.8, [p[0], el, p[2]]);
};
const entreAnos = (a: number, b: number, larg: number, alt: number, el = 0.45, r = R_MARCO, y = 1.0): Cam => {
  const pa = naRua(a, r, y);
  const pb = naRua(b, r, y);
  const m: V3 = [(pa[0] + pb[0]) / 2, y, (pa[2] + pb[2]) / 2];
  const n = Math.hypot(m[0], m[2]) || 1;
  return E(m, larg * 0.8, alt * 0.8, [m[0] / n, el, m[2] / n]);
};
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0.5, 0], 18, 11, [0, 1.45, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.regra,
    chaves: [
      [T.regra, E([0, 0.6, 0.4], 16, 10, [0, 1.2, 1])],
      [T.p25 - 0.2, E([1.0, 1.1, 1.0], 7.4, 5.2, [0.2, 0.62, 1])],
      [T.fundeb, E([0.8, 1.0, 1.2], 6.6, 4.8, [0.3, 0.6, 1])],
    ],
  },
  {ini: T.fundeb, chaves: [[T.fundeb, MESA_TODA]]},
  {
    ini: T.y2006,
    arco: 0.04,
    chaves: [
      [T.y2006, noAno(2006, 5.6, 4.0, 0.55, -40, R_MARCO, 0.8)],
      [T.y2007 - 0.2, noAno(2006, 5.2, 3.8, 0.52, -34, R_MARCO, 0.8)],
      [T.y2007 + 0.4, noAno(2007, 5.4, 3.9, 0.52, -36, R_MARCO, 0.8)],
      [T.y2008 - 0.2, noAno(2007, 5.2, 3.8, 0.5, -30, R_MARCO, 0.8)],
      [T.y2008 + 0.4, noAno(2008, 5.6, 4.0, 0.52, -34, R_MARCO, 0.9)],
      [T.y2009 - 0.2, noAno(2008, 5.4, 3.9, 0.5, -28, R_MARCO, 0.9)],
    ],
  },
  {
    ini: T.y2009,
    arco: 0.04,
    chaves: [
      [T.y2009, entreAnos(2009, 2010, 5.8, 4.2, 0.5)],
      [T.y2011 - 0.2, entreAnos(2009, 2010, 5.4, 4.0, 0.48)],
      [T.y2011 + 0.3, noAno(2011, 7.6, 5.6, 0.62, 18, 6.2, 1.4)],
      [T.p22, noAno(2011, 4.8, 3.8, 0.45, 6, R_COPO2 - 0.3, 1.0)],
      [T.rej11 + 0.3, noAno(2011, 4.8, 3.8, 0.42, 0, R_MARCO, 1.4)],
      [T.y2012 + 0.2, noAno(2012, 5.2, 3.8, 0.45, -4)],
      [T.y2013 - 0.2, noAno(2012, 5.0, 3.6, 0.45, 4)],
    ],
  },
  {
    ini: T.y2013,
    arco: 0.03,
    chaves: [
      [T.y2013, noAno(2013, 5.4, 4.0, 0.42, -6)],
      [T.m105, noAno(2015, 5.6, 4.0, 0.42, 4)],
      [T.y2016 + 0.2, noAno(2016, 5.2, 4.0, 0.42, -6, R_COPO, 1.0)],
      [T.pref16 + 0.6, noAno(2016, 5.0, 3.8, 0.4, 6, R_COPO, 1.0)],
      [T.y2017 + 0.2, noAno(2017, 6.0, 4.6, 0.38, 0, R_COL, 1.4)],
      [T.y2018 - 0.2, noAno(2017, 6.4, 4.8, 0.36, 6, R_COL, 1.6)],
    ],
  },
  {
    ini: T.y2018,
    arco: 0.04,
    chaves: [
      [T.y2018, noAno(2018, 8.0, 5.8, 0.75, 10, 5.6, 1.4)],
      [T.tcm18 + 0.4, noAno(2018, 5.4, 4.0, 0.55, 4)],
      [T.mesmoAssim, noAno(2018, 8.6, 6.0, 0.7, 12, 5.6, 1.4)],
      [T.y2019 + 0.2, noAno(2019, 4.8, 3.6, 0.5, -6, R_COPO, 1.0)],
      [T.rej19, noAno(2019, 5.0, 3.8, 0.5, 6, R_COPO, 1.0)],
      [T.y2020 + 0.3, entreAnos(2018, 2020, 8.0, 5.6, 0.75)],
      [T.y2021 + 0.2, noAno(2021, 5.6, 4.2, 0.45, -6, R_COPO, 1.2)],
      [T.y2022 - 0.2, noAno(2021, 5.6, 4.2, 0.45, 6, R_COPO, 1.4)],
    ],
  },
  {
    ini: T.y2022,
    arco: 0.04,
    chaves: [
      [T.y2022, entreAnos(2022, 2023, 6.4, 4.6, 0.5, R_COL, 1.3)],
      [T.y2024 - 0.2, entreAnos(2022, 2023, 6.0, 4.4, 0.5, R_COL, 1.6)],
      [T.recorde, noAno(2024, 5.6, 4.6, 0.25, 0, R_COL, 1.6)],
      [T.pagou + 0.3, noAno(2024, 7.8, 5.6, 0.5, 8, 5.6, 1.4)],
      [T.ajuda + 0.2, noAno(2024, 5.0, 3.6, 0.35, -4, 6.9, 1.2)],
      [T.y2025 - 0.2, noAno(2024, 4.8, 3.4, 0.33, -8, 6.9, 1.1)],
    ],
  },
  {
    ini: T.y2025,
    arco: 0.03,
    chaves: [
      [T.y2025, noAno(2025, 6.6, 5.0, 0.45, -6, R_FONTES - 0.6, 1.5)],
      [T.siope25 - 0.3, noAno(2025, 7.6, 5.6, 0.45, 4, R_FONTES - 0.6, 1.4)],
      [T.siope25 + 0.4, noAno(2025, 7.6, 5.6, 0.5, 2, R_COPO + 0.4, 1.0)],
      [T.obras, E(soma(OBRA, [0, 0.6, 0]), 4.8, 3.6, [0.8, 0.6, 0.4])],
      [T.y2026 - 0.2, E(soma(OBRA, [0, 0.6, 0]), 4.6, 3.4, [0.9, 0.55, 0.2])],
    ],
  },
  {
    ini: T.y2026,
    arco: 0.04,
    chaves: [
      [T.y2026, noAno(2026, 6.0, 4.4, 0.45, -4, 5.4, 1.1)],
      [T.maio - 0.2, noAno(2026, 5.6, 4.2, 0.42, 4, 5.4, 1.1)],
      [T.maio + 0.5, E([0.2, 0.9, -3.6], 4.8, 3.6, [0.15, 0.55, -1])],
      [T.nega + 0.4, E([0.4, 0.9, -3.6], 4.6, 3.4, [-0.1, 0.52, -1])],
      [T.conta - 0.2, E([0.3, 0.9, -3.6], 4.8, 3.6, [-0.2, 0.52, -1])],
    ],
  },
  {
    ini: T.conta,
    arco: 0.05,
    chaves: [
      [T.conta, E([0, 1.2, 0.6], 15, 10, [0, 1.1, 1])],
      [T.bi319, E([0, 1.4, 0.4], 17, 11, [0.1, 1.3, 1])],
      [T.vaquinha + 0.2, E([-6.7, 1.0, -1.9], 7.0, 5.2, [-1, 0.65, 0.35])],
      [T.confira, E([-6.7, 1.0, -1.9], 6.6, 5.0, [-1, 0.65, 0.5])],
    ],
  },
  {ini: T.confira, chaves: [[T.confira, MESA_TODA]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.05, grua: 0.02});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const SELOS: Txt[] = [
  {a: T.regra, b: T.fundeb, texto: 'CONSTITUIÇÃO, ART. 212 · RREO ANEXO 8'},
  {a: T.y2006, b: T.y2007, texto: 'TESOURO NACIONAL · TRANSF. CONSTITUCIONAIS · R$ 14,09 MI'},
  {a: T.y2007, b: T.y2008, texto: 'TESOURO: R$ 19,14 MI · CÂMARA, DEC. LEG. 001/2010 (JAN-AGO/2007)'},
  {a: T.y2008, b: T.y2009, texto: 'SIOPE/FNDE 2008: R$ 42,66 MI · 25,24% · CÂMARA, DEC. LEG. 001/2011'},
  {a: T.y2009, b: T.y2011, texto: 'SIOPE: 2009 R$ 54,20 MI (32,33%) · 2010 R$ 66,78 MI'},
  {a: T.y2011, b: T.y2012, texto: 'SIOPE 2011: 25,75% · TCM: 22,43% (JORNAL GRANDE BAHIA, 05/12/2012) · CÂMARA, DEC. LEG. 001/2014', destaque: true},
  {a: T.y2012, b: T.y2013, texto: 'SIOPE 2012: R$ 69,44 MI · 22,79% · LOA 2012: R$ 83,24 MI · TCM REJEITA (BNEWS)'},
  {a: T.y2013, b: T.y2016, texto: 'SIOPE E RREO 2013-2015 · LOA 2015: R$ 104,68 MI · CÂMARA, DEC. LEG. 002/2016 E 001/2016'},
  {a: T.y2016, b: T.y2017, texto: 'LOA 2016: R$ 119,44 MI · SIOPE: 22,10% · RREO DEZ/2016: 27,46%', destaque: true},
  {a: T.y2017, b: T.y2018, texto: 'SIOPE 2017: R$ 108,28 MI'},
  {a: T.y2018, b: T.y2019, texto: 'PARECER TCM-BA 04894e19 · 22,89% → 25,60% · CONSELHO DO FUNDEB SEM PARECER'},
  {a: T.y2019, b: T.y2020, texto: 'RREO DEZ/2019: 26,77% · PARECER TCM-BA 06442e20: 24,03%', destaque: true},
  {a: T.y2020, b: T.y2021, texto: 'PARECER TCM-BA 09984e21'},
  {a: T.y2021, b: T.y2022, texto: 'SIOPE 2021: 22,32% · FUNDEB R$ 97,62 MI · EC 119/2022 · RREO DEZ/2020 E DEZ/2021'},
  {a: T.y2022, b: T.y2024, texto: 'PARECERES TCM-BA 07770e23 (26,93%) E 07666e24 (29,32%) · PRECATÓRIOS R$ 42,94 MI'},
  {a: T.y2024, b: T.ajuda, texto: 'BALANÇO 2024: R$ 269,27 MI · BAHIA NOTÍCIAS, 04/10/2024 (DADO DA PREFEITURA)'},
  {a: T.ajuda, b: T.y2025, texto: 'RREO DEZ/2024 · ANEXO 14 · VAAT: 11,43% (META 50%) · 1,81% (META 15%)', destaque: true},
  {a: T.y2025, b: T.siope25, texto: 'LOA 2025: R$ 276,86 MI · BALANÇO R$ 231,19 · PLANILHA R$ 248,95 · RREO R$ 300,23'},
  {a: T.siope25, b: T.y2026, texto: 'SIOPE 2025: 26,23% · RREO DEZ/2025: 24,18% · OBRAS R$ 50,71 MI', destaque: true},
  {a: T.y2026, b: T.maio, texto: 'LOA 2026: R$ 239,86 MI · RREO 4º BIM/2026 (JAN-AGO): 18,52%'},
  {a: T.maio, b: T.mp, texto: 'OPERAÇÃO MERENDA DIGNA · PF E CGU, 21/05/2026 · INVESTIGAÇÃO, SEM CONDENAÇÃO', destaque: true},
  {a: T.mp, b: T.conta, texto: 'A TARDE, 09/10/2026 · MP-BA, 6ª PROMOTORIA DE ILHÉUS · APURAÇÃO'},
  {a: T.conta, b: T.confira, texto: 'SIOPE 2008-2025 · IPCA/BANCO CENTRAL ATÉ SET/2026 · CONTA DO VÍDEO'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const topo = (ano: number, mi: number, r = R_COL): V3 => naRua(ano, r, altura(mi) + 0.25);
const copoTopo = (ano: number, fora = false): V3 => naRua(ano, fora ? R_COPO2 : R_COPO, 1.75);
const ROTULOS: Rot[] = [
  {a: T.m14, b: T.y2007 + 0.6, p: naRua(2006, R_COL - 0.6, 0.6), valor: 'FUNDEF', sub: 'R$ 14 MI'},
  {a: T.m19, b: T.y2008, p: naRua(2007, R_COL - 0.6, 0.7), valor: 'FUNDEB', sub: 'R$ 19 MI', cor: 'acento'},
  {a: T.m43, b: T.y2009, p: topo(2008, 42.66), valor: 'R$ 43 MI', sub: 'GASTO EM 2008', cor: 'acento'},
  {a: T.limite, b: T.y2009, p: copoTopo(2008), valor: '25,2%', sub: 'NO LIMITE', dy: 60},
  {a: T.m54, b: T.y2011, p: topo(2009, 54.2), valor: 'R$ 54 MI'},
  {a: T.m67, b: T.y2011, p: topo(2010, 66.78), valor: 'R$ 67 MI', dy: 70},
  {a: T.p32, b: T.y2011, p: copoTopo(2009), valor: '32,3%', sub: 'MAIOR DA SÉRIE', cor: 'acento'},
  {a: T.siope11, b: T.y2012, p: copoTopo(2011), valor: 'SIOPE 25,8%', cor: 'acento'},
  {a: T.p22, b: T.y2012, p: copoTopo(2011, true), valor: 'TCM 22,4%', cor: 'alerta', dy: 70},
  {a: T.m69, b: T.y2013, p: topo(2012, 69.44), valor: 'R$ 69 MI', cor: 'acento'},
  {a: T.m83, b: T.y2013, p: topo(2012, 83.24), valor: 'PREVISTO R$ 83 MI', dy: 70},
  {a: T.abaixo12, b: T.y2013, p: copoTopo(2012), valor: '22,8%', sub: 'SIOPE', cor: 'alerta', dy: 140},
  {a: T.m81, b: T.y2016, p: topo(2013, 81.04), valor: 'R$ 81 MI'},
  {a: T.m81 + 0.6, b: T.y2016, p: topo(2015, 88.31), valor: 'R$ 88 MI', cor: 'acento', dy: 70},
  {a: T.m105, b: T.y2016, p: topo(2015, 104.68), valor: 'PREVISTO R$ 105 MI', dy: 140},
  {a: T.m119, b: T.y2017, p: topo(2016, 119.44), valor: 'PREVISTO R$ 119 MI'},
  {a: T.m96, b: T.y2017, p: topo(2016, 96.14), valor: 'GASTO R$ 96 MI', cor: 'acento', dy: -70},
  {a: T.siope16, b: T.y2017, p: copoTopo(2016), valor: 'SIOPE 22,1%', cor: 'alerta'},
  {a: T.pref16, b: T.y2017, p: copoTopo(2016, true), valor: 'PREFEITURA 27,5%', dy: 70},
  {a: T.m108, b: T.y2018, p: topo(2017, 108.28), valor: 'R$ 108 MI', sub: 'PASSA DOS 100 MI', cor: 'acento'},
  {a: T.tcm18, b: T.defesa, p: copoTopo(2018), valor: 'TCM 22,9%', cor: 'alerta'},
  {a: T.defesa + 0.6, b: T.y2019, p: copoTopo(2018), valor: 'APÓS A DEFESA 25,6%'},
  {a: T.pref19, b: T.y2020, p: copoTopo(2019), valor: 'PREFEITURA 26,8%'},
  {a: T.tcm19, b: T.y2020, p: copoTopo(2019, true), valor: 'TCM 24,0%', cor: 'alerta', dy: 70},
  {a: T.terceira, b: T.y2021, p: naRua(2019, R_MARCO, 2.6), valor: '3 SEGUIDAS', sub: '2018 · 2019 · 2020', cor: 'alerta'},
  {a: T.m98, b: T.y2022, p: topo(2021, 128.72), valor: 'FUNDEB R$ 98 MI', sub: 'EM 2020: R$ 76 MI', cor: 'acento'},
  {a: T.siope21, b: T.pandemia + 0.8, p: copoTopo(2021), valor: 'SIOPE 22,3%', cor: 'alerta', dy: 70},
  {a: T.m170, b: T.y2024, p: topo(2022, 170.1), valor: 'R$ 170 MI'},
  {a: T.m195, b: T.y2024, p: topo(2023, 194.63), valor: 'R$ 195 MI', cor: 'acento', dy: 70},
  {a: T.prec43, b: T.y2024, p: topo(2023, 194.63 + 42.94), valor: 'PRECATÓRIOS', sub: 'R$ 42,9 MI · FUNDEF', dy: 140},
  {a: T.m269, b: T.y2025, p: topo(2024, 269.27), valor: 'R$ 269 MI', sub: 'RECORDE', cor: 'acento'},
  {a: T.aosTrab, b: T.ajuda, p: naRua(2024, 7.1, 1.3, 10), valor: 'R$ 51 MI', sub: 'PRECATÓRIOS PAGOS · SEGUNDO A PREFEITURA', dy: 70},
  {a: T.p11, b: T.y2025, p: naRua(2024, 6.9, 2.0, -11), valor: '11,4%', sub: 'META: 50%', cor: 'alerta'},
  {a: T.p2, b: T.y2025, p: naRua(2024, 6.9, 2.0, 3), valor: '1,8%', sub: 'META: 15%', cor: 'alerta', dy: 70},
  {a: T.n277, b: T.balanco, p: topo(2025, 276.86), valor: 'PREVISTO R$ 277 MI'},
  {a: T.balanco + 0.3, b: T.siope25, p: naRua(2025, R_FONTES, altura(231.19) + 0.3, 9), valor: 'R$ 231 MI'},
  {a: T.planilha + 0.3, b: T.siope25, p: naRua(2025, R_FONTES, altura(248.95) + 0.3, 0), valor: 'R$ 249 MI', dy: 70},
  {a: T.relat + 0.3, b: T.siope25, p: naRua(2025, R_FONTES, altura(300.23) + 0.3, -9), valor: 'R$ 300 MI', dy: 140},
  {a: T.siope25, b: T.y2026, p: copoTopo(2025), valor: 'SIOPE 26,2%', cor: 'acento'},
  {a: T.pref25, b: T.y2026, p: copoTopo(2025, true), valor: 'RELATÓRIO 24,2%', cor: 'alerta', dy: 70},
  {a: T.obras + 0.2, b: T.y2026, p: soma(OBRA, [0, 1.2, 0]), valor: 'OBRAS R$ 51 MI', sub: 'EM 2024: R$ 2,5 MI', cor: 'acento'},
  {a: T.m240, b: T.maio, p: topo(2026, 239.86), valor: 'PREVISTO R$ 240 MI'},
  {a: T.emp, b: T.maio, p: topo(2026, 213.08), valor: 'R$ 213 MI', sub: 'EMPENHADOS', dy: 70},
  {a: T.pagos, b: T.maio, p: topo(2026, 150.17), valor: 'R$ 150 MI', sub: 'PAGOS', cor: 'acento', dy: 140},
  {a: T.contrato, b: T.conta, p: soma(CAIXAS, [0, 1.8, 0]), valor: 'CONTRATO R$ 15,5 MI', sub: 'MERENDA · INVESTIGAÇÃO PF E CGU'},
  {a: T.mp, b: T.conta, p: soma(CAIXAS, [0.8, 0.2, 0]), valor: 'MP-BA APURA', sub: 'FALTA DE MERENDA E ÁGUA NAS ESCOLAS', dy: -150},
  {a: T.pos613, b: T.confira, p: soma(PREF, [0.4, 2.0, 0.6]), valor: 'PÔS R$ 613 MI', sub: 'AO FUNDEB, 2008-2025'},
  {a: T.recebeu, b: T.confira, p: soma(COFRE, [0, 2.4, 0]), valor: 'RECEBEU R$ 1,36 BI', cor: 'acento', dy: 70},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.y2008, T.confira - 0.3);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0, maxWidth: 680}}>
        {seloAtual ? (
          <div
            style={{
              padding: '7px 14px',
              borderRadius: 9,
              background: tema.cartao,
              border: `1.5px solid ${seloAtual.destaque ? mistura(tema.cartaoBorda, tema.acento, 0.6) : tema.cartaoBorda}`,
              fontFamily: MONO,
              fontSize: seloAtual.texto.length > 70 ? 15 : 17,
              lineHeight: 1.35,
              letterSpacing: 1.2,
              color: tema.textoSuave,
            }}
          >
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 MOEDA = R$ 5 MI</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const comentaK = vis(t, T.meConta, FIM);
    const arrobaK = rampa(t, T.segue, T.segue + 0.4);
    return (
      <>
        {t >= T.confira ? cabecalho : null}
        {comentaK > 0.01 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center'}}>
            <div style={{padding: '18px 30px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
              <div style={{fontFamily: MONO, fontSize: 23, letterSpacing: 3, color: tema.texto}}>CHEGOU NA ESCOLA DO SEU BAIRRO?</div>
              <div style={{fontFamily: MONO, fontSize: 23, letterSpacing: 3, color: tema.textoSuave, marginTop: 4}}>COMENTA AQUI</div>
              {arrobaK > 0.01 ? <div style={{fontFamily: FONTE, fontSize: 58, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: arrobaK}}>@euMagnoLeite</div> : null}
            </div>
          </div>
        ) : null}
      </>
    );
  }
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 360 && Math.abs(visRot[a].y - visRot[b].y) < 96) visRot[a].y = visRot[b].y - 100;
  // a conta: o contador grande
  const contaK = vis(t, T.bi209, T.vaquinha);
  const valorConta = t < T.bi319 ? 'R$ 2,09 BI' : 'R$ 3,19 BI';
  const subConta = t < T.bi319 ? 'GASTO COM EDUCAÇÃO · 2008-2025' : 'CORRIGIDO PELO IPCA · VALORES DE HOJE';
  const dobroK = vis(t, T.dobro, T.confira);
  return (
    <>
      {cabecalho}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: Math.max(SEGURO.esq + 160, Math.min(SEGURO.botoesX - 160, v.x)), top: Math.max(560, Math.min(1240, v.y)), transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.valor.length > 14 ? 32 : 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, letterSpacing: 1.4, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {contaK > 0.01 ? <Contador tema={tema} valor={valorConta} rotulo={subConta} k={entra(t, t < T.bi319 ? T.bi209 : T.bi319, 0.45) * Math.min(1, contaK)} y={520} destaque /> : null}
      {dobroK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center', opacity: Math.min(1, dobroK)}}>
          <div style={{padding: '10px 28px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.acento}`, fontFamily: FONTE, fontSize: 72, fontWeight: 900, color: tema.acento, letterSpacing: -2}}>× 2,2</div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Marca d'água (pedido da pessoa: o @ do começo ao fim, inclusive sobre os mapas) ----------
const MarcaArroba: React.FC<{tema: Tema}> = ({tema}) => (
  <div style={{position: 'absolute', top: CABECALHO.marca, left: SEGURO.esq + 4, fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.marca, whiteSpace: 'nowrap'}}>
    {SERIE.toUpperCase()} · @euMagnoLeite
  </div>
);

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number; entrada: number}> = ({de, ate, origem, entrada}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = entrada > 0 ? interpolate(f, [0, entrada, dur - 6, dur], [0, 1, 1, 0], clamp) : interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/educacao.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.15}));
  // números e etiquetas
  ROTULOS.forEach((r) => s.push({t: r.a + 0.05, f: 'pop', v: 0.14}));
  // colunas crescendo
  Object.values(DADOS).forEach((d) => {
    if (d.cresce !== undefined) s.push({t: d.cresce, f: 'subida', v: 0.1});
  });
  // copos
  COPOS.forEach((c) => {
    s.push({t: c.a, f: 'subida', v: 0.12});
    if (c.nivel < 25 && c.ano !== 2026) s.push({t: c.a + 0.9, f: 'baque', v: 0.14});
  });
  // carimbos
  CARIMBOS.forEach((c) => s.push({t: c.a + 0.3, f: 'impacto', v: 0.18}));
  // regra
  s.push({t: T.p25, f: 'subida', v: 0.16});
  s.push({t: T.daEdu + 0.6, f: 'ding', v: 0.16});
  // 2024
  s.push({t: T.m269, f: 'ding', v: 0.18});
  s.push({t: T.p11 + 0.4, f: 'baque', v: 0.14});
  s.push({t: T.p2 + 0.4, f: 'baque', v: 0.14});
  // 2026 e merenda
  s.push({t: T.y2026 + 0.2, f: 'bip', v: 0.12});
  s.push({t: T.pf + 0.2, f: 'bip', v: 0.12});
  s.push({t: T.m17, f: 'baque', v: 0.12});
  s.push({t: T.nega, f: 'pop', v: 0.16});
  // a conta
  s.push({t: T.bi209, f: 'subida', v: 0.2});
  s.push({t: T.bi319, f: 'subida', v: 0.2});
  s.push({t: T.dobro + 0.2, f: 'ding', v: 0.2});
  // fim
  s.push({t: T.chegou, f: 'bip', v: 0.12});
  s.push({t: T.meConta, f: 'pop', v: 0.2});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  const ord = s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
  // no máximo um som a cada 0,08 s
  const fora: Som[] = [];
  ord.forEach((x) => {
    if (!fora.length || x.t - fora[fora.length - 1].t >= 0.08) fora.push(x);
  });
  return fora;
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.2, 3.8, T.p25 + 1.0, T.daEdu + 1.0, T.m14 + 0.8, T.camRep07 + 0.7, T.naoAchei + 0.6, T.m43 + 1.0, T.aprov08 + 0.5, T.p32 + 1.0, T.tcm11 + 0.6, T.p22 + 1.0, T.camRep11 + 0.6,
  T.m83 + 0.8, T.rej12 + 0.5, T.m81 + 1.0, T.m105 + 0.6, T.m96 + 0.8, T.pref16 + 1.0, T.m108 + 0.5, T.tcm18 + 0.8, T.defesa + 1.0, T.rej18 + 0.6, T.tcm19 + 1.0, T.terceira + 0.6,
  T.m98 + 0.6, T.pandemia + 0.8, T.comoEm2020 + 0.6, T.m170 + 0.8, T.prec43 + 0.6, T.m269 + 0.6, T.aosTrab + 0.6, T.p11 + 0.8, T.p2 + 0.6, T.balanco + 0.8, T.relat + 0.8,
  T.pref25 + 0.8, T.obras + 0.8, T.emp + 0.8, T.pagos + 0.6, T.pf + 0.8, T.nega + 0.8, T.mp + 0.8, T.bi209 + 0.6, T.bi319 + 0.6, T.dobro + 0.5, T.recebeu + 0.8, T.chegou + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const EducacaoIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={13} />
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
      <MarcaArroba tema={tema} />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['2 bilhões', 'na educação.', 'Os números', 'não batem.'];
export const CapaEducacaoIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 420}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}E6 42%, ${tema.fundo}00 62%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · EDUCAÇÃO EM ILHÉUS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: SEGURO.topo + 90, left: SEGURO.esq + 4, fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.marca, whiteSpace: 'nowrap'}}>{SERIE.toUpperCase()} · @euMagnoLeite</div>
    </AbsoluteFill>
  );
};
