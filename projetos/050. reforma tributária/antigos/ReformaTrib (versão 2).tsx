import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Onda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Congresso} from '../../pecas/candidato';
import {Jatinho} from '../../pecas/candidato';
import {DocumentoGrande} from '../../pecas/bets';
import {CanoMoedas} from '../../pecas/multas';
import {Balanca} from '../../pecas/escala6x1b';
import {LivroLei} from '../../pecas/escala6x1';
import {Lojinha} from '../../pecas/escala6x1c';
import {Casinha} from '../../pecas/hediondo';
import {Carro, Chave} from '../../pecas/juros';
import {MarcoAno} from '../../pecas/estadio';
import {SetasTroca} from '../../pecas/concurso';
import {EtiquetaPreco} from '../../pecas/mei';
import {Coracao} from '../../pecas/algoritmo';
import {Arvore, Carrinho, Cesta, Garrafa, Lupa, MacoCigarro, NotaFiscal, Pacote as PacoteImposto, Van} from '../../pecas/imposto';
import {Bolo, CofreComite, Dial, FichaImposto, Lancha, Moinho, Pao, PredioDono, Trigo, corNovo, corVelho} from './pecas';
import {PALAVRAS} from './palavras';

// 050. reforma tributária (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a "rua do pãozinho" (trigo → moinho → padaria → casa de você) com os três donos do
// imposto atrás (UNIÃO, ESTADO, PREFEITURA), o cofre do Comitê Gestor e a estrada do tempo na frente;
// o Kit Mapas faz três trechos (projetos/050.../mapas/reforma.mp4, composição ReformaTributaria do kit):
// A1 cada um com sua lei, A2 guerra fiscal, B a grande virada. Cinza = imposto velho, verde = novo.
// Plano: projetos/050. reforma tributária/plano.md (v1, aprovado 07/11/2026). Neutro: sem tomar lado.

export const FPS = 30;
const AUDIO_SEG = 185.62;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '050. reforma tributária';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  cinco: quando('Cinco impostos'),
  escondidos: quando('escondidos'),
  preco: quando('preço de tudo'),
  trocados: quando('trocados'),
  comecou: quando('já começou'),
  paozinho: quando('pãozinho'),
  chegar: quando('chegar em você'),
  trigo: quando('trigo'),
  farinha: quando('farinha'),
  padaria: quando('padaria'),
  cadaEtapa: quando('em cada etapa'),
  temImposto: quando('tem imposto'),
  n1988: quando('1988'),
  donos: quando('três donos'),
  uniao: quando('A União cobra'),
  ipi: quando('IPI'),
  pis: quando('PIS'),
  cofins: quando('Cofins'),
  estado: quando('O estado'),
  icms: quando('ICMS'),
  prefeitura: quando('A prefeitura'),
  iss: quando('ISS'),
  problema: quando('O problema'),
  n27: quando('27'),
  mil5: quando('5 mil'),
  muitas: quando('Muitas vezes'),
  padariaPaga: quando('padaria paga'),
  emCima: quando('em cima do imposto'),
  veio: quando('já veio na farinha'),
  cascata: quando('efeito cascata'),
  estados: quando('E estados dão'),
  porMais: quando('Por mais de'),
  decadas: quando('três décadas'),
  tentativas: quando('tentativas'),
  morreram: quando('morreram'),
  n2023: quando('2023'),
  camara: quando('Câmara'),
  senado: quando('Senado'),
  constituicao: quando('entrou na Constituição'),
  regras: quando('As regras'),
  n2025: quando('2025'),
  n2026: quando('2026'),
  comoFica: quando('Agora como fica'),
  osCinco: quando('Os cinco'),
  umSo: quando('um imposto só'),
  dividido: quando('dividido em dois'),
  cbs: quando('A CBS'),
  daUniao: quando('da União'),
  pisCofins: quando('de PIS e Cofins'),
  ibs: quando('O IBS'),
  juntos: quando('estados e cidades juntos'),
  icms2: quando('do ICMS'),
  iss2: quando('do ISS'),
  ipiZera: quando('IPI zera'),
  zona: quando('Zona Franca'),
  paozinho2: quando('E o pãozinho'),
  cadaEtapa2: quando('Cada etapa paga'),
  acrescentou: quando('acrescentou'),
  desconta: quando('desconta'),
  vezSo: quando('uma vez só'),
  semCascata: quando('sem cascata'),
  quemManda: quando('quem manda'),
  cadaEstado: quando('Cada estado e'),
  cadaCidade: quando('cada cidade'),
  percentual: quando('percentual'),
  leiUma: quando('a lei é uma só'),
  dinheiro: quando('o dinheiro cai'),
  caixa: quando('caixa único'),
  comite: quando('Comitê Gestor'),
  estMun: quando('de estados e municípios'),
  reparte: quando('reparte'),
  bolo: quando('bolo'),
  repara: quando('Agora repara'),
  a2077: quando('2077'),
  continua: quando('O que continua'),
  ipva: quando('IPVA'),
  iptu: quando('IPTU'),
  itbi: quando('ITBI'),
  heranca: quando('imposto da herança'),
  seguem: quando('seguem com'),
  jatinho: quando('jatinho'),
  lancha: quando('lancha'),
  herancaPaga: quando('herança paga'),
  maior: quando('maior o valor'),
  calendario: quando('Agora o calendário'),
  quatroDatas: quando('quatro datas'),
  um: quando('Um 2026'),
  hoje: quando('hoje'),
  teste: quando('Ano de teste'),
  nota: quando('A nota mostra'),
  p09: quando('0,9%'),
  p01: quando('0,1%'),
  naoPaga: quando('não paga'),
  dois: quando('Dois 2027'),
  vale: quando('vale de verdade'),
  acabam: quando('Cofins acabam'),
  tcu: quando('O TCU'),
  p113: quando('11,3%'),
  senadoConf: quando('Senado ainda'),
  seletivo: quando('Imposto Seletivo'),
  saude: quando('saúde'),
  ambiente: quando('meio ambiente'),
  cigarro: quando('cigarro'),
  bebida: quando('bebida'),
  tres: quando('Três de 2029'),
  diminuem: quando('diminuem'),
  cresce: quando('IBS cresce'),
  quatro: quando('Quatro 2033'),
  deixam: quando('deixam de existir'),
  bolso: quando('E no seu bolso'),
  cesta: quando('Cesta básica'),
  zero: quando('imposto zero'),
  baixa: quando('baixa renda'),
  volta: quando('de volta'),
  separado: quando('separado na nota'),
  enxerga: quando('enxerga'),
  atencao: quando('Mas atenção'),
  teto: quando('teto'),
  p265: quando('26,5%'),
  juntos2: quando('os dois juntos'),
  estimativa: quando('estimativa'),
  p28: quando('quase 28%'),
  ajuste: quando('propor ajuste'),
  eAi: quando('E aí você acha'),
  leve: quando('leve'),
  pesada: quando('pesada'),
  comentarios: quando('comentários'),
  segue: quando('E segue o'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'A TROCA'],
  [T.paozinho, 'O PÃOZINHO'],
  [T.n1988, 'OS TRÊS DONOS'],
  [T.problema, 'CADA UM COM SUA LEI'],
  [T.muitas, 'A CASCATA'],
  [T.estados, 'GUERRA FISCAL'],
  [T.porMais, 'A HISTÓRIA'],
  [T.comoFica, 'COMO FICA'],
  [T.paozinho2, 'SEM CASCATA'],
  [T.quemManda, 'QUEM MANDA'],
  [T.repara, 'A GRANDE VIRADA'],
  [T.continua, 'O QUE CONTINUA'],
  [T.calendario, 'O CALENDÁRIO'],
  [T.bolso, 'NO SEU BOLSO'],
  [T.atencao, 'O TETO'],
  [T.eAi, 'E AÍ?'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A1 = {de: q(T.problema), ate: q(T.muitas), origem: 0};
const MAPA_A2 = {de: q(T.estados), ate: q(T.porMais), origem: q(T.muitas) - q(T.problema)};
const MAPA_B = {de: q(T.repara), ate: q(T.continua), origem: MAPA_A2.origem + q(T.porMais) - q(T.estados)};
const noMapa = (t: number) => (t >= T.problema && t < T.muitas) || (t >= T.estados && t < T.porMais) || (t >= T.repara && t < T.continua);

// ---------- Mapa do mundo ----------
const TRIGO: V3 = [-8, 0, 3.4];
const MOINHO: V3 = [-4.2, 0, 3.4];
const PADARIA: V3 = [0.6, 0, 3.4];
const CASA: V3 = [5, 0, 3.2];
const VOCE: V3 = [6.5, 0, 5.0];
const ETIQ: V3 = [6.6, 1.9, 6.8];
const UNIAO: V3 = [-6, 0, -5];
const ESTADO: V3 = [0, 0, -5];
const PREF: V3 = [6, 0, -5];
const TETO_Y = 3.75;
const CONGRESSO: V3 = [-17.5, 0, -3.5];
const COFRE: V3 = [3, 0, -1.4];
const LINHA_Z = 10;
const MARCOS = [-7.5, -2.5, 2.5, 7.5];
const OBJ_Z = 11.0;
const BOLSO_X = 12;
const MEDIDOR: V3 = [16.6, 0, 11];
const BALANCA: V3 = [3, 0, 13.6];
const ESC_PREDIO = 0.85;

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
// voo de uma ficha: nasce em `de` em t0, voa em arco até `ate` entre t0 e t0 + d
const voo = (t: number, t0: number, de: V3, ate: V3, d = 0.8, alto = 1.2): V3 => curva(de, ate, alto, rampa(t, t0, t0 + d));

// as fichas velhas nos telhados dos donos
const TELHADO = {
  ipi: soma(UNIAO, [-1.3, TETO_Y, 0.4]),
  pis: soma(UNIAO, [0, TETO_Y, 0.4]),
  cofins: soma(UNIAO, [1.3, TETO_Y, 0.4]),
  icms: soma(ESTADO, [0, TETO_Y, 0.4]),
  iss: soma(PREF, [0, TETO_Y, 0.4]),
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  // ----- Cena 1: o gancho (etiqueta de preço e as 5 fichas) -----
  const g = vis(t, 0, T.paozinho - 0.1);
  const giroTroca = rampa(t, T.trocados - 0.1, T.trocados + 0.6);
  const nomesG = ['IPI', 'PIS', 'COFINS', 'ICMS', 'ISS'];
  const fichasG = nomesG.map((n, i) => {
    const a = -0.9 + i * 0.45;
    const p: V3 = soma(ETIQ, [Math.sin(a) * 1.55, 0.25 + Math.cos(a) * 0.9, -0.2]);
    return {n, p, k: entra(t, T.cinco + 0.12 * i, 0.4) * (1 - giroTroca) * g};
  });

  // ----- Cena 2: a rua -----
  const voceK = entra(t, T.paozinho - 0.2, 0.5);
  const trigoK = rampa(t, T.trigo - 0.2, T.trigo + 0.8);
  const moinhoK = entra(t, T.farinha - 0.1, 0.5);
  const padariaK = entra(t, T.padaria - 0.1, 0.5);
  const casaK = entra(t, T.paozinho - 0.2, 0.5);
  const vanX = -7 + 7.4 * rampa(t, T.cadaEtapa - 0.4, T.temImposto + 0.6);
  const vanK = vis(t, T.cadaEtapa - 0.6, T.n1988 + 0.6);
  const fichasEtapa = [TRIGO, MOINHO, PADARIA].map((p, i) => ({p: soma(p, [0, i === 0 ? 1.9 : 3.1, 0.3]), k: entra(t, T.temImposto + 0.12 * i, 0.4) * (1 - rampa(t, T.uniao - 0.3, T.uniao + 0.2))}));

  // ----- Cena 3: os três donos -----
  const terrenos = rampa(t, T.donos, T.donos + 0.5);
  const uniaoK = rampa(t, T.uniao - 0.1, T.uniao + 0.7);
  const estadoK = rampa(t, T.estado - 0.1, T.estado + 0.7);
  const prefK = rampa(t, T.prefeitura - 0.1, T.prefeitura + 0.7);
  const DE_PADARIA: V3 = soma(PADARIA, [0, 2.6, 0.3]);
  const DE_MOINHO: V3 = soma(MOINHO, [0, 3.0, 0.3]);
  // fichas velhas: voam para o telhado e ficam até a parte delas acabar
  const velhas = [
    {n: 'IPI', t0: T.ipi, de: DE_PADARIA, ate: TELHADO.ipi, fim: 999},
    {n: 'PIS', t0: T.pis, de: DE_PADARIA, ate: TELHADO.pis, fim: T.pisCofins + 0.3},
    {n: 'COFINS', t0: T.cofins, de: DE_PADARIA, ate: TELHADO.cofins, fim: T.pisCofins + 0.5},
    {n: 'ICMS', t0: T.icms, de: DE_MOINHO, ate: TELHADO.icms, fim: T.icms2 + 0.2},
    {n: 'ISS', t0: T.iss, de: DE_PADARIA, ate: TELHADO.iss, fim: T.iss2 + 0.2},
  ];
  const ipiZero = rampa(t, T.ipiZera, T.ipiZera + 0.5);

  // luz dos prédios
  const luzUni = Math.max(janela(t, T.uniao, T.estado), janela(t, T.daUniao, T.ibs, 0.5));
  const luzEst = Math.max(janela(t, T.estado, T.prefeitura), janela(t, T.juntos, T.ipiZera), janela(t, T.cadaEstado, T.leiUma), janela(t, T.seguem, T.jatinho));
  const luzPre = Math.max(janela(t, T.prefeitura, T.problema), janela(t, T.juntos, T.ipiZera), janela(t, T.cadaCidade, T.leiUma), janela(t, T.seguem, T.jatinho));

  // ----- Cena 4: a cascata (torre de fichas na padaria) e Cena 7 (desmonta) -----
  const TORRE: V3 = soma(PADARIA, [1.6, 0, 1.1]);
  const torreK = vis(t, T.padariaPaga - 0.1, T.quemManda);
  const nTorre = 1 + 3 * rampa(t, T.emCima, T.veio + 0.2);
  const balanca = Math.sin(t * 5) * 0.05 * janela(t, T.cascata, T.estados, 0.3);
  const desmonta = rampa(t, T.vezSo, T.vezSo + 0.6);

  // ----- Cena 5: a história -----
  const congAceso = janela(t, T.decadas, T.comoFica, 0.5);
  const camaraK = rampa(t, T.camara, T.camara + 0.4);
  const senadoK = rampa(t, T.senado, T.senado + 0.4);
  const propK = vis(t, T.tentativas - 0.1, T.morreram + 1.2);
  const propCai = rampa(t, T.morreram, T.morreram + 0.9);
  const livroK = vis(t, T.n2023, T.comoFica + 0.3);
  const livroAbre = rampa(t, T.constituicao, T.constituicao + 0.8);
  const lei1 = vis(t, T.n2025 - 0.2, T.comoFica + 0.3);
  const lei2 = vis(t, T.n2026 - 0.2, T.comoFica + 0.3);
  const LIVRO: V3 = [-13.4, 0, -0.4];

  // ----- Cena 6: como fica -----
  const CENTRO: V3 = [0, 5.0, -2.6];
  const junta = rampa(t, T.osCinco, T.umSo);
  const copiasK = janela(t, T.osCinco - 0.1, T.umSo + 0.1, 0.3);
  const ivaK = entra(t, T.umSo, 0.45) * (1 - rampa(t, T.dividido + 0.3, T.dividido + 0.5));
  const parte = rampa(t, T.dividido + 0.2, T.dividido + 0.9);
  const novoK = entra(t, T.dividido + 0.2, 0.45);
  const CBS_FIM: V3 = soma(UNIAO, [0, TETO_Y + 0.85, 0.4]);
  const IBS_FIM: V3 = [3, TETO_Y + 0.85, -4.6];
  const cbsVai = rampa(t, T.daUniao, T.daUniao + 0.8);
  const ibsVai = rampa(t, T.juntos - 0.4, T.juntos + 0.5);
  const ibsLarg = 1.0 + 3.6 * rampa(t, T.juntos, T.juntos + 0.8);
  const cbsP: V3 = cbsVai > 0 ? curva(soma(CENTRO, [-0.7, 0, 0]), CBS_FIM, 0.8, cbsVai) : soma(CENTRO, [-0.7 * parte, 0, 0]);
  const ibsP: V3 = ibsVai > 0 ? curva(soma(CENTRO, [0.7, 0, 0]), IBS_FIM, 0.8, ibsVai) : soma(CENTRO, [0.7 * parte, 0, 0]);

  // ----- Cena 7: sem cascata (fatias em cada etapa) -----
  const fatiasK = vis(t, T.cadaEtapa2 - 0.1, T.quemManda);
  const verdeK = rampa(t, T.acrescentou, T.acrescentou + 0.5);

  // ----- Cena 8: quem manda -----
  const dialK = vis(t, T.cadaEstado - 0.1, T.continua);
  const dial2K = vis(t, T.cadaCidade - 0.1, T.continua);
  const giroD = 1.4 * rampa(t, T.percentual, T.percentual + 0.9);
  const leiK = vis(t, T.leiUma - 0.1, T.repara);
  const cofreK = entra(t, T.caixa - 0.1, 0.5);
  const letreiroK = entra(t, T.comite, 0.4);
  const bandK = entra(t, T.estMun, 0.4);
  const moedasK = janela(t, T.dinheiro, T.reparte + 0.6, 0.3);
  const canoK = rampa(t, T.reparte - 0.1, T.reparte + 0.5);
  const fluxo = rampa(t, T.reparte, T.repara, (x) => x) * 6;
  const boloK = entra(t, T.bolo - 0.15, 0.4);
  const boloAbre = rampa(t, T.bolo, T.bolo + 0.7);

  // ----- Cena 9: o que continua -----
  const carroK = entra(t, T.ipva, 0.45);
  const casinhaK = entra(t, T.iptu, 0.45);
  const chaveK = entra(t, T.itbi, 0.45);
  const herK = entra(t, T.heranca, 0.45);
  const jatK = entra(t, T.jatinho - 0.1, 0.5);
  const lanchaK = entra(t, T.lancha - 0.1, 0.5);
  const escadaK = entra(t, T.herancaPaga - 0.1, 0.45);
  const fatiaH = rampa(t, T.herancaPaga + 0.2, T.maior + 0.4);

  // ----- Cena 10: o calendário -----
  const linhaK = rampa(t, T.calendario, T.calendario + 0.9);
  const marcoK = MARCOS.map((_, i) => entra(t, T.quatroDatas + 0.12 * i, 0.4));
  const marcoAceso = [T.um, T.dois, T.tres, T.quatro].map((a, i, arr) => janela(t, a, i < 3 ? arr[i + 1] : T.bolso, 0.4));
  const cabX = (() => {
    const ks = [T.um, T.dois, T.tres, T.quatro];
    let x = -9.4;
    ks.forEach((a, i) => {
      x = x + (MARCOS[i] - x) * rampa(t, a - 0.1, a + 0.7);
    });
    return x;
  })();
  const notaK = entra(t, T.nota - 0.1, 0.5);
  const testeK = entra(t, T.teste, 0.35);
  const cbsAlt = 0.15 + 1.45 * rampa(t, T.vale, T.vale + 0.9);
  const cbsK = entra(t, T.dois + 0.3, 0.45);
  const pisQueda = rampa(t, T.acabam, T.acabam + 0.8);
  const selK = entra(t, T.seletivo, 0.45);
  const corK = entra(t, T.saude, 0.4);
  const arvK = entra(t, T.ambiente, 0.4);
  const cigK = entra(t, T.cigarro, 0.4);
  const garK = entra(t, T.bebida, 0.4);
  const barrasK = entra(t, T.tres + 0.4, 0.45);
  const degrau = (() => {
    // ICMS e ISS: 10/10 → 9/10, 8/10, 7/10, 6/10 (2029-2032) → 0 (2033)
    const s0 = T.diminuem;
    let f = 1;
    for (let i = 0; i < 4; i++) f -= 0.1 * rampa(t, s0 + i * 0.55, s0 + i * 0.55 + 0.4);
    return f * (1 - rampa(t, T.deixam - 0.2, T.deixam + 0.6));
  })();
  const fimK = entra(t, T.deixam + 0.3, 0.35);

  // você anda até a frente no fim do calendário
  const anda = rampa(t, T.quatro + 0.4, T.bolso + 0.1);
  const vocePos: V3 = mix(VOCE, [BOLSO_X - 0.9, 0, 10.4], anda);

  // ----- Cena 11: no seu bolso -----
  const cestaK = entra(t, T.cesta, 0.45);
  const famK = entra(t, T.baixa, 0.45);
  const volta = rampa(t, T.volta - 0.3, T.volta + 0.7);
  const nota2K = entra(t, T.separado - 0.3, 0.45);
  const separa = rampa(t, T.separado, T.separado + 0.6);
  const lupaK = entra(t, T.enxerga - 0.1, 0.4);

  // ----- Cena 12: o teto -----
  const medK = entra(t, T.atencao, 0.45);
  const tetoK = rampa(t, T.teto - 0.1, T.teto + 0.5);
  const nivel = 0.25 * rampa(t, T.juntos2 - 0.2, T.juntos2 + 0.6) + (27.91 / 30 - 0.25) * rampa(t, T.estimativa, T.p28 + 0.4);

  // ----- Cena 13: a balança -----
  const balK = entra(t, T.eAi + 0.6, 0.5);

  return (
    <group>
      {/* a rua */}
      <Caixa args={[24, 0.04, 1.7]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.5)} position={[-1, 0.02, 5.4]} sombra={false} />
      {[-11, -8, -5, -2, 1, 4, 7, 10].map((x) => (
        <Caixa key={x} args={[1.2, 0.012, 0.1]} raio={0.005} cor={tema.objetoClaro} position={[x, 0.045, 5.4]} sombra={false} />
      ))}
      <Trigo tema={tema} pos={TRIGO} k={trigoK} t={t} />
      <Moinho tema={tema} pos={MOINHO} k={moinhoK} t={t} />
      <Lojinha tema={tema} pos={PADARIA} escala={1.35 * padariaK} larg={1.8} toldo={padariaK} />
      {padariaK > 0.02 ? <Placa tema={tema} pos={soma(PADARIA, [0, 2.75 * padariaK, 0.4])} larg={1.9} alt={0.42} linhas={[{t: 'PADARIA', tam: 220, cor: tema.fundo, peso: 900}]} fundo={tema.objetoClaro} brilho={0.3 + 0.5 * pulso(t, T.padaria, 1.0)} /> : null}
      <Casinha tema={tema} pos={CASA} cor={tema.objetoClaro} escala={2.6 * casaK} />
      <Van tema={tema} pos={[vanX, 0.05, 5.4]} rotY={Math.PI / 2} escala={0.7 * vanK} />
      {fichasEtapa.map((f, i) => (
        <FichaImposto key={i} tema={tema} pos={f.p} k={1.1 * f.k} texto="IMPOSTO" />
      ))}

      {/* você */}
      <Boneco tema={tema} pos={vocePos} rotY={anda > 0 && anda < 1 ? Math.atan2(BOLSO_X - 0.9 - VOCE[0], 10.4 - VOCE[2]) : 0.15} escala={0.8 * voceK} cor={tema.corpo} pose={{ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25, passo: anda > 0 && anda < 1 ? Math.sin(t * 8) : 0}}>
        <Pao tema={tema} pos={[0.27, 1.2, 0.46]} k={entra(t, T.paozinho, 0.4) * (1 - rampa(t, T.cesta, T.cesta + 0.4))} />
      </Boneco>
      {voceK > 0.02 ? <Onda pos={soma(VOCE, [0, 0.03, 0])} k={rampa(t, T.chegar, T.chegar + 1.2, (x) => x)} cor={tema.acento} raio={1.0} /> : null}

      {/* Cena 1: etiqueta, pacotes e as 5 fichas */}
      {g > 0.02 ? (
        <group>
          <EtiquetaPreco tema={tema} pos={ETIQ} rot={[0, 0, 0.12]} escala={4.2 * entra(t, 0, 0.5) * g} destaque={pulso(t, T.escondidos, 1.0)} />
          <PacoteImposto tema={tema} pos={soma(ETIQ, [-1.5, -1.9, 0.6])} escala={0.9 * entra(t, T.preco, 0.4) * g} etiqueta={1} />
          <PacoteImposto tema={tema} pos={soma(ETIQ, [1.5, -1.9, 0.6])} rot={[0, -0.4, 0]} escala={0.9 * entra(t, T.preco + 0.15, 0.4) * g} etiqueta={1} />
          <SetasTroca tema={tema} pos={soma(ETIQ, [0, 1.25, 0.4])} escala={0.7 * janela(t, T.trocados - 0.2, T.paozinho - 0.4, 0.3)} giro={giroTroca * Math.PI * 2} />
        </group>
      ) : null}
      {fichasG.map((f) => (
        <FichaImposto key={f.n} tema={tema} pos={f.p} k={0.8 * f.k} texto={f.n} />
      ))}
      <FichaImposto tema={tema} pos={soma(ETIQ, [-0.75, 1.2, -0.2])} k={0.9 * giroTroca * g} texto="CBS" novo />
      <FichaImposto tema={tema} pos={soma(ETIQ, [0.75, 1.2, -0.2])} k={0.9 * giroTroca * g} texto="IBS" novo ibs />

      {/* Cena 3: terrenos e os três donos */}
      {terrenos > 0.02
        ? [UNIAO, ESTADO, PREF].map((p, i) => <Caixa key={i} args={[4.6 * terrenos, 0.06, 3.4 * terrenos]} raio={0.02} cor={mistura(tema.chao, tema.objeto, 0.35)} position={soma(p, [0, 0.03, 0])} sombra={false} />)
        : null}
      <PredioDono tema={tema} pos={UNIAO} escala={ESC_PREDIO} sobe={uniaoK} letreiro={uniaoK} texto="UNIÃO" luz={luzUni} />
      <PredioDono tema={tema} pos={ESTADO} escala={ESC_PREDIO} sobe={estadoK} letreiro={estadoK} texto="ESTADO" luz={luzEst} />
      <PredioDono tema={tema} pos={PREF} escala={ESC_PREDIO} sobe={prefK} letreiro={prefK} texto="PREFEITURA" luz={luzPre} />
      {velhas.map((v) => {
        const k = entra(t, v.t0, 0.4) * (1 - rampa(t, v.fim, v.fim + 0.5));
        if (k < 0.02) return null;
        const afunda = rampa(t, v.fim, v.fim + 0.5);
        const p = soma(voo(t, v.t0, v.de, v.ate, 0.8, 1.4), [0, -0.6 * afunda, 0]);
        const brilho = v.n === 'IPI' ? 0 : pulso(t, T.osCinco, 1.0);
        return v.n === 'IPI' ? (
          <group key={v.n}>
            <FichaImposto tema={tema} pos={p} k={1.15 * k * (1 - ipiZero)} texto="IPI" brilho={pulso(t, T.osCinco, 1.0)} />
            <FichaImposto tema={tema} pos={p} k={1.15 * k * ipiZero} texto="IPI 0%" larg={1.3} />
          </group>
        ) : (
          <FichaImposto key={v.n} tema={tema} pos={p} k={1.15 * k} texto={v.n} brilho={brilho} />
        );
      })}

      {/* Cena 4: a torre da cascata (e a Cena 7: desmonta em uma camada verde) */}
      {torreK > 0.02
        ? [0, 1, 2, 3].map((i) => {
            const k = Math.max(0, Math.min(1, nTorre - i)) * torreK * (i === 0 ? 1 : 1 - desmonta);
            return <FichaImposto key={i} tema={tema} pos={soma(TORRE, [0.04 * i * Math.sin(t * 5 + i), 0.36 + i * 0.6, 0])} rot={[0, -0.3, balanca * (i + 1)]} k={0.85 * k} texto={i === 0 && desmonta > 0.5 ? 'UMA VEZ' : 'IMPOSTO'} novo={i === 0 && desmonta > 0.5} />;
          })
        : null}
      {torreK > 0.02 ? <Caixa args={[0.6, 0.06, 0.5]} raio={0.02} cor={tema.objetoEscuro} position={soma(TORRE, [0, 0.03, 0])} /> : null}

      {/* Cena 5: Congresso, propostas, Constituição e as duas leis */}
      <Congresso tema={tema} pos={CONGRESSO} escala={0.5} aceso={Math.max(congAceso * 0.5, camaraK * congAceso * 0.8, senadoK * congAceso)} />
      {propK > 0.02
        ? [0, 1, 2, 3].map((i) => (
            <DocumentoGrande key={i} tema={tema} pos={[-18.8 + i * 0.85, 1.5 + 0.3 * Math.sin(i) - 1.5 * propCai, -0.2]} rot={[0.1, 0.2 - i * 0.1, 0.6 * propCai * (i % 2 ? 1 : -1)]} escala={0.55 * propK * (1 - 0.6 * propCai)} />
          ))
        : null}
      {livroK > 0.02 ? (
        <group>
          <Caixa args={[1.6, 0.8, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(LIVRO, [0, 0.4, 0])} />
          <LivroLei tema={tema} pos={soma(LIVRO, [0, 0.82, 0])} escala={0.9 * livroK} abre={livroAbre} folha={livroAbre} capa={1} />
          <Caixa args={[0.5, 0.012, 0.6]} raio={0.004} cor={tema.acento} emissivo={0.5} position={soma(LIVRO, [0.28, 0.9 + 0.02 * livroAbre, 0])} scale={[livroAbre, 1, livroAbre]} sombra={false} />
        </group>
      ) : null}
      <LivroLei tema={tema} pos={soma(LIVRO, [1.6, 0.02, 0.2])} escala={0.55 * lei1} abre={0} capa={1} />
      <LivroLei tema={tema} pos={soma(LIVRO, [2.6, 0.02, 0.2])} escala={0.55 * lei2} abre={0} capa={1} />

      {/* Cena 6: as cópias juntam no meio, viram IVA e se dividem */}
      {copiasK > 0.02
        ? velhas.map((v, i) => <FichaImposto key={i} tema={tema} pos={mix(v.ate, CENTRO, junta)} k={0.75 * copiasK * (1 - 0.4 * junta)} texto={v.n} />)
        : null}
      <FichaImposto tema={tema} pos={CENTRO} k={1.7 * ivaK} texto="IVA" novo larg={1.4} />
      <FichaImposto tema={tema} pos={cbsP} k={1.3 * novoK} texto="CBS" novo brilho={janela(t, T.cbs, T.ibs, 0.3)} />
      <FichaImposto tema={tema} pos={ibsP} k={1.3 * novoK} texto="IBS" novo ibs larg={ibsLarg} brilho={janela(t, T.ibs, T.ipiZera, 0.3)} />

      {/* Cena 7: fatias de valor em cada etapa */}
      {fatiasK > 0.02
        ? [TRIGO, MOINHO, PADARIA].map((p, i) => (
            <group key={i} position={soma(p, [i === 0 ? 1.9 : 1.5, 0, 1.2])} scale={fatiasK}>
              {Array.from({length: i + 1}).map((_, j) => {
                const topo = j === i;
                return <Caixa key={j} args={[0.55, 0.3, 0.55]} raio={0.04} cor={topo ? mistura(corVelho(tema), tema.acento, verdeK) : corVelho(tema)} emissivo={topo ? 0.3 * verdeK : 0} position={[0, 0.16 + j * 0.32, 0]} />;
              })}
            </group>
          ))
        : null}

      {/* Cena 8: botões de percentual, lei nacional, cofre, moedas, canos e bolo */}
      <group position={[ESTADO[0] - 1.9, 0, -2.8]}>
        {dialK > 0.02 ? <Caixa args={[0.08, 1.2 * dialK, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.6 * dialK, 0]} /> : null}
        <Dial tema={tema} pos={[0, 1.4, 0.05]} k={0.9 * dialK} giro={giroD} brilho={pulso(t, T.cadaEstado, 1.0)} />
      </group>
      <group position={[PREF[0] - 1.9, 0, -2.8]}>
        {dial2K > 0.02 ? <Caixa args={[0.08, 1.2 * dial2K, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.6 * dial2K, 0]} /> : null}
        <Dial tema={tema} pos={[0, 1.4, 0.05]} k={0.9 * dial2K} giro={-giroD * 0.7} brilho={pulso(t, T.cadaCidade, 1.0)} />
      </group>
      <LivroLei tema={tema} pos={[3, TETO_Y + 1.9, -4.8]} rot={[0.5, 0, 0]} escala={1.0 * leiK} abre={rampa(t, T.leiUma, T.leiUma + 0.7)} capa={1} />
      <CofreComite tema={tema} pos={COFRE} k={cofreK} letreiro={letreiroK} bandeiras={bandK} brilho={pulso(t, T.comite, 1.0)} />
      {moedasK > 0.02
        ? [0, 1, 2, 3, 4].map((i) => {
            const s = rampa(t, T.dinheiro + i * 0.25, T.caixa + 0.6 + i * 0.25);
            if (s <= 0 || s >= 1) return null;
            return <Moeda key={i} tema={tema} pos={curva(soma(PADARIA, [0.4 * i - 0.8, 0.6, 1.6]), soma(COFRE, [0, 1.9, 0]), 2.0, s)} r={0.16} />;
          })
        : null}
      <CanoMoedas tema={tema} pontos={[soma(COFRE, [-0.9, 0.7, 0]), [1.6, 0.7, -2.2], [1.0, 0.7, -3.4]]} k={canoK} fluxo={fluxo} n={8} brilho={luzEst} />
      <CanoMoedas tema={tema} pontos={[soma(COFRE, [0.9, 0.7, 0]), [4.6, 0.7, -2.2], [5.2, 0.7, -3.4]]} k={canoK} fluxo={fluxo} n={8} brilho={luzPre} />
      {boloK > 0.02 ? <Caixa args={[0.5, 0.7 * boloK, 0.5]} raio={0.04} cor={tema.objetoEscuro} position={[COFRE[0] + 1.9, 0.35 * boloK, COFRE[2] + 0.6]} /> : null}
      <Bolo tema={tema} pos={[COFRE[0] + 1.9, 0.7, COFRE[2] + 0.6]} k={0.75 * boloK} abre={boloAbre} />

      {/* Cena 9: o que continua */}
      <Carro tema={tema} pos={[-1.7, 0, -2.4]} rotY={0.5} escala={0.55 * carroK} />
      <Casinha tema={tema} pos={[4.8, 0, -2.6]} cor={tema.objetoClaro} escala={1.4 * casinhaK} />
      <Chave tema={tema} pos={[7.3, 0.6, -2.4]} rot={[0, -0.4, 0.3]} escala={1.6 * chaveK} />
      {herK > 0.02 ? (
        <group position={[0.4, 0, -2.4]}>
          <Caixa args={[0.9, 0.5 * herK, 0.7]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.25 * herK, 0]} />
          <DocumentoGrande tema={tema} pos={[0, 0.9, 0.05]} rot={[-0.3, 0, 0]} escala={0.6 * herK} />
        </group>
      ) : null}
      <Jatinho tema={tema} pos={[-3.9, 0.05, -1.2]} rumo={0.9} escala={0.45 * jatK} />
      <Lancha tema={tema} pos={[-1.8, 0, -0.6]} k={0.9 * lanchaK} t={t} />
      {escadaK > 0.02
        ? [0, 1, 2].map((i) => {
            const alt = 0.3 + i * 0.35;
            const fat = (0.05 + 0.07 * i) * fatiaH;
            return (
              <group key={i} position={[-0.4 + i * 0.55, 0, -0.8]} scale={escadaK}>
                <Caixa args={[0.4, alt, 0.4]} raio={0.04} cor={tema.objetoClaro} position={[0, alt / 2, 0]} />
                {fat > 0.005 ? <Caixa args={[0.42, fat * 3, 0.42]} raio={0.03} cor={tema.acento} emissivo={0.3} position={[0, alt + fat * 1.5, 0]} /> : null}
              </group>
            );
          })
        : null}

      {/* Cena 10: a estrada do tempo */}
      {linhaK > 0.02 ? (
        <group>
          <Caixa args={[19 * linhaK, 0.06, 0.24]} raio={0.03} cor={tema.objetoClaro} position={[-9.5 + 9.5 * linhaK, 0.04, LINHA_Z]} sombra={false} />
          <mesh position={[cabX, 0.32, LINHA_Z]} castShadow>
            <sphereGeometry args={[0.24, 24, 16]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} roughness={0.5} />
          </mesh>
        </group>
      ) : null}
      {MARCOS.map((x, i) => (
        <MarcoAno key={i} tema={tema} pos={[x, 0, LINHA_Z - 0.6]} ano={['2026', '2027', '2029-32', '2033'][i]} k={marcoK[i]} aceso={marcoAceso[i]} />
      ))}
      <NotaFiscal tema={tema} pos={[MARCOS[0] - 0.6, 0, OBJ_Z]} escala={1.7 * notaK} desenrola={rampa(t, T.nota, T.nota + 0.8)} tributos={rampa(t, T.p09, T.p01 + 0.5)} />
      {testeK > 0.02 ? (
        <group position={[MARCOS[0] + 1.1, 1.0, OBJ_Z + 0.2]} scale={testeK} rotation={[0, -0.2, -0.15]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.3} alt={0.42} linhas={[{t: 'TESTE', tam: 300, cor: tema.acento, peso: 900}]} fundo={tema.fundo} />
        </group>
      ) : null}
      {cbsK > 0.02 ? (
        <group position={[MARCOS[1] - 0.9, 0, OBJ_Z]} scale={cbsK}>
          <Caixa args={[1.1, cbsAlt, 1.1]} raio={0.05} cor={tema.acento} emissivo={0.25} position={[0, cbsAlt / 2, 0]} />
          <Placa tema={tema} pos={[0, cbsAlt + 0.3, 0]} larg={0.9} alt={0.36} linhas={[{t: 'CBS', tam: 300, cor: tema.fundo, peso: 900}]} fundo={tema.acento} />
        </group>
      ) : null}
      <FichaImposto tema={tema} pos={[MARCOS[1] + 0.1, 1.3 - 1.4 * pisQueda, OBJ_Z]} rot={[0, 0, 0.9 * pisQueda]} k={0.9 * cbsK * (1 - rampa(t, T.acabam + 0.6, T.acabam + 1.0))} texto="PIS" />
      <FichaImposto tema={tema} pos={[MARCOS[1] + 0.1, 0.65 - 0.8 * pisQueda, OBJ_Z]} rot={[0, 0, -0.9 * pisQueda]} k={0.9 * cbsK * (1 - rampa(t, T.acabam + 0.7, T.acabam + 1.1))} texto="COFINS" />
      <FichaImposto tema={tema} pos={[MARCOS[1] + 1.2, 1.7, OBJ_Z]} k={0.7 * selK} texto="SELETIVO" larg={1.3} />
      <Coracao tema={tema} pos={[MARCOS[1] + 0.6, 0.9, OBJ_Z + 0.2]} escala={0.35 * corK} />
      {arvK > 0.02 ? <Arvore tema={tema} pos={[MARCOS[1] + 1.8, 0, OBJ_Z + 0.2]} escala={0.5 * arvK} /> : null}
      <MacoCigarro tema={tema} pos={[MARCOS[1] + 0.9, 0, OBJ_Z + 0.9]} escala={0.9 * cigK} />
      <Garrafa tema={tema} pos={[MARCOS[1] + 1.5, 0, OBJ_Z + 0.9]} escala={0.9 * garK} />
      {barrasK > 0.02 ? (
        <group position={[MARCOS[2] - 0.6, 0, OBJ_Z]} scale={barrasK}>
          {degrau > 0.01 ? <Caixa args={[0.7, 2.0 * degrau, 0.7]} raio={0.05} cor={corVelho(tema)} position={[0, degrau, 0]} /> : null}
          <Caixa args={[0.7, Math.max(0.06, 2.0 * (1 - degrau)), 0.7]} raio={0.03} cor={corNovo(tema, true)} emissivo={0.25} position={[1.0, Math.max(0.03, 1 - degrau), 0]} />
          {degrau > 0.05 ? <Placa tema={tema} pos={[0, 2.0 * degrau + 0.28, 0]} larg={1.2} alt={0.3} linhas={[{t: 'ICMS + ISS', tam: 170, cor: tema.objetoClaro, peso: 900}]} /> : null}
          <Placa tema={tema} pos={[1.0, 2.0 * (1 - degrau) + 0.28, 0]} larg={0.9} alt={0.3} linhas={[{t: 'IBS', tam: 220, cor: corNovo(tema, true), peso: 900}]} />
        </group>
      ) : null}
      {fimK > 0.02 ? (
        <group position={[MARCOS[3] + 0.9, 1.0, OBJ_Z + 0.2]} scale={fimK} rotation={[0, -0.2, -0.12]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.9} alt={0.7} linhas={[{t: 'FIM DO', tam: 190, cor: tema.acento, peso: 900}, {t: 'ICMS E ISS', tam: 160, cor: tema.acento, peso: 900}]} fundo={tema.fundo} />
        </group>
      ) : null}

      {/* Cena 11: cesta, família, cashback e a nota separada */}
      <Cesta tema={tema} pos={[BOLSO_X - 1.6, 0, OBJ_Z]} escala={2.4 * cestaK} />
      {famK > 0.02
        ? [0, 1, 2].map((i) => <Boneco key={i} tema={tema} pos={[BOLSO_X + 0.6 + i * 0.55, 0, OBJ_Z - 0.4 + (i === 1 ? 0.2 : 0)]} rotY={-0.2} escala={(i === 2 ? 0.62 : 0.9) * famK} cor={tema.pessoa} />)
        : null}
      {volta > 0 && volta < 1
        ? [0, 1, 2].map((i) => <Moeda key={i} tema={tema} pos={curva([BOLSO_X - 1.8, 1.0, OBJ_Z], [BOLSO_X + 1.1, 1.3, OBJ_Z - 0.3], 1.2, Math.max(0, Math.min(1, volta * 1.3 - i * 0.15)))} r={0.14} />)
        : null}
      <NotaFiscal tema={tema} pos={[BOLSO_X + 2.8, 0, OBJ_Z]} escala={1.6 * nota2K} desenrola={rampa(t, T.separado - 0.3, T.separado + 0.4)} tributos={1} separa={separa} />
      <Lupa tema={tema} pos={[BOLSO_X + 2.6 + 0.4 * Math.sin(t * 1.4) * lupaK, 1.3, OBJ_Z + 0.5]} rot={[0.2, 0, 0.3]} escala={0.9 * lupaK} />

      {/* Cena 12: o medidor do teto */}
      {medK > 0.02 ? (
        <group position={MEDIDOR} scale={medK}>
          <Caixa args={[1.3, 0.2, 1.0]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
          <Caixa args={[0.9, 3.2, 0.5]} raio={0.06} cor={mistura(tema.objeto, tema.fundo, 0.4)} opacidade={0.55} position={[0, 1.8, 0]} />
          {nivel > 0.005 ? <Caixa args={[0.76, 3.0 * nivel, 0.38]} raio={0.04} cor={tema.acento} emissivo={0.3} position={[0, 0.25 + 1.5 * nivel, 0]} /> : null}
          {tetoK > 0.02 ? <Caixa args={[1.5 * tetoK, 0.06, 0.62]} raio={0.02} cor={tema.objetoClaro} emissivo={0.5} position={[0, 0.25 + 3.0 * (26.5 / 30), 0]} sombra={false} /> : null}
        </group>
      ) : null}

      {/* Cena 13: a balança equilibrada */}
      <Balanca tema={tema} pos={BALANCA} escala={1.0 * balK} inclina={0} esq={<Carrinho tema={tema} pos={[0, 0, 0]} escala={0.5} />} dir={<Carrinho tema={tema} pos={[0, 0, 0]} escala={0.5} />} brilhoEsq={pulso(t, T.leve, 1.0)} brilhoDir={pulso(t, T.pesada, 1.0)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VIS_DONOS = E([0, 2.0, -3.4], 18, 8.5, [0, 0.7, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ETIQ, [0, 0.2, 0]), 3.6, 3.8, [0.15, 0.22, 1])], [T.trocados, E(soma(ETIQ, [0, 0.4, 0]), 4.0, 4.0, [-0.08, 0.26, 1])], [T.paozinho - 0.1, E(soma(ETIQ, [0, 0.3, 0]), 4.2, 4.2, [-0.12, 0.28, 1])]]},
  {ini: T.paozinho, chaves: [[T.paozinho, E(soma(VOCE, [0, 1.0, 0]), 3.0, 2.8, [0.1, 0.35, 1])], [T.chegar + 0.4, E(soma(VOCE, [-0.6, 1.0, 0]), 4.2, 3.4, [0.05, 0.38, 1])], [T.trigo - 0.1, E(soma(TRIGO, [0.6, 1.0, 0.2]), 5.2, 3.6, [0.1, 0.4, 1])], [T.farinha, E(soma(MOINHO, [0.3, 1.3, 0.2]), 5.2, 3.8, [0.05, 0.4, 1])], [T.padaria, E(soma(PADARIA, [0.4, 1.3, 0.2]), 5.2, 3.8, [0, 0.4, 1])], [T.cadaEtapa, E([-3.4, 1.4, 3.6], 10.5, 5, [0, 0.45, 1])], [T.n1988 - 0.1, E([-3.2, 1.4, 3.6], 10, 4.8, [0.04, 0.45, 1])]]},
  {ini: T.n1988, chaves: [[T.n1988, VIS_DONOS], [T.uniao - 0.2, VIS_DONOS], [T.uniao + 0.4, E([-4.2, 2.2, -2.2], 10, 6.5, [0.08, 0.65, 1])], [T.estado, E([-0.6, 2.2, -2.2], 10, 6.5, [0, 0.65, 1])], [T.prefeitura, E([3.4, 2.2, -2.2], 10, 6.5, [-0.05, 0.65, 1])], [T.problema, E([4, 2.2, -2.2], 10, 6.5, [-0.08, 0.65, 1])]]},
  {ini: T.problema, chaves: [[T.problema, VIS_DONOS], [T.muitas, VIS_DONOS]]},
  {ini: T.muitas, chaves: [[T.muitas, E([1.6, 1.4, 4.2], 5.0, 3.8, [0.15, 0.35, 1])], [T.estados, E([1.8, 1.6, 4.3], 4.4, 3.6, [0.05, 0.33, 1])]]},
  {ini: T.estados, chaves: [[T.estados, VIS_DONOS], [T.porMais, VIS_DONOS]]},
  {ini: T.porMais, arco: 0.1, chaves: [[T.porMais, E([-17.4, 1.4, -1.2], 5.6, 4.2, [0.1, 0.4, 1])], [T.n2023, E([-16.0, 1.4, -1.2], 6, 4.4, [0.05, 0.4, 1])], [T.regras, E([-12.2, 1.0, -0.3], 5.4, 3.6, [0, 0.5, 1])], [T.comoFica - 0.1, E([-12.0, 1.0, -0.3], 5.0, 3.4, [-0.05, 0.5, 1])]]},
  {ini: T.comoFica, chaves: [[T.comoFica, E([0, 3.2, -3.4], 14, 7, [0, 0.55, 1])], [T.umSo, E([0, 4.2, -2.8], 7, 4.6, [0, 0.35, 1])], [T.daUniao, E([-3.4, 4.0, -3.8], 8, 5, [0.08, 0.4, 1])], [T.ibs, E([2.6, 4.0, -3.8], 9, 5.2, [-0.04, 0.4, 1])], [T.ipiZera, E([-5.6, 4.0, -3.8], 6.4, 4.4, [0.1, 0.4, 1])], [T.paozinho2, E([-5.4, 4.0, -3.8], 6.2, 4.2, [0.12, 0.4, 1])]]},
  {ini: T.paozinho2, chaves: [[T.paozinho2, E([-3.4, 1.2, 4.0], 10.5, 5, [0, 0.45, 1])], [T.vezSo - 0.2, E([-2.8, 1.2, 4.0], 10, 4.8, [0, 0.45, 1])], [T.vezSo + 0.3, E([1.8, 1.4, 4.3], 5.4, 3.8, [0.1, 0.35, 1])], [T.quemManda, E([1.9, 1.4, 4.3], 5.0, 3.6, [0.05, 0.35, 1])]]},
  {ini: T.quemManda, chaves: [[T.quemManda, E([3, 2.4, -3.4], 12, 7, [0, 1.0, 1])], [T.dinheiro, E([2.4, 2.0, -0.4], 11, 7, [0, 1.1, 1])], [T.caixa, E(soma(COFRE, [0, 1.3, 0]), 6.5, 4.6, [0, 1.1, 1])], [T.reparte, E([3, 1.6, -2.6], 10, 6, [0, 1.25, 1])], [T.repara, E([3, 1.6, -2.6], 10, 6, [0.04, 1.25, 1])]]},
  {ini: T.repara, chaves: [[T.repara, VIS_DONOS], [T.continua, VIS_DONOS]]},
  {ini: T.continua, arco: 0.1, chaves: [[T.continua, E([2.6, 1.0, -2.2], 10.5, 5, [0, 0.95, 1])], [T.jatinho - 0.3, E([2.0, 1.0, -2.0], 10, 4.8, [0.04, 0.95, 1])], [T.jatinho + 0.2, E([-2.6, 0.7, -1.0], 5.6, 3.4, [0.1, 2.1, 1])], [T.herancaPaga, E([0.1, 0.8, -1.4], 4.2, 3.0, [0, 2.2, 1])], [T.calendario - 0.1, E([0.1, 0.8, -1.4], 4.0, 2.9, [-0.05, 2.2, 1])]]},
  {ini: T.calendario, chaves: [[T.calendario, E([0, 1.2, 10.4], 21, 6, [0, 0.55, 1])], [T.um - 0.2, E([-1, 1.2, 10.4], 20, 6, [0, 0.55, 1])], [T.um + 0.5, E([MARCOS[0], 1.1, 10.8], 4.8, 3.4, [0.04, 0.4, 1])], [T.dois - 0.5, E([MARCOS[0] + 0.2, 1.1, 10.8], 4.8, 3.4, [-0.04, 0.4, 1])], [T.dois + 0.2, E([MARCOS[1] + 0.2, 1.1, 10.8], 4.8, 3.4, [0.04, 0.4, 1])], [T.tres - 0.5, E([MARCOS[1] + 0.4, 1.1, 10.8], 4.8, 3.4, [-0.04, 0.4, 1])], [T.tres + 0.2, E([MARCOS[2], 1.1, 10.8], 4.8, 3.4, [0.04, 0.4, 1])], [T.quatro - 0.5, E([MARCOS[2] + 0.2, 1.1, 10.8], 4.8, 3.4, [-0.04, 0.4, 1])], [T.quatro + 0.2, E([MARCOS[3] + 0.4, 1.1, 10.8], 4.8, 3.4, [0.04, 0.4, 1])], [T.bolso - 0.1, E([MARCOS[3] + 1.4, 1.1, 10.8], 5.2, 3.6, [0, 0.42, 1])]]},
  {ini: T.bolso, chaves: [[T.bolso, E([BOLSO_X, 1.0, 10.8], 5.6, 3.6, [0, 0.4, 1])], [T.separado - 0.2, E([BOLSO_X + 0.4, 1.0, 10.8], 5.4, 3.6, [0, 0.4, 1])], [T.separado + 0.3, E([BOLSO_X + 2.6, 1.2, 10.9], 4.4, 3.4, [0, 0.35, 1])], [T.atencao - 0.1, E([BOLSO_X + 2.8, 1.2, 10.9], 4.2, 3.2, [0, 0.35, 1])]]},
  {ini: T.atencao, chaves: [[T.atencao, E(soma(MEDIDOR, [0, 1.8, 0]), 4.4, 4.6, [0, 0.3, 1])], [T.eAi - 0.1, E(soma(MEDIDOR, [0, 2.0, 0]), 4.0, 4.4, [0.05, 0.3, 1])]]},
  {ini: T.eAi, chaves: [[T.eAi, E(soma(BALANCA, [0, 1.4, 0]), 5.0, 4.0, [0, 0.4, 1])], [T.comentarios, E(soma(BALANCA, [0, 1.4, 0]), 5.6, 4.4, [0, 0.45, 1])], [FIM, E([1, 2.4, 3], 24, 13, [0, 0.8, 1])]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.08, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.comecou, b: T.paozinho, texto: 'DESDE 2026', destaque: true},
  {a: T.n1988, b: T.donos, texto: '1988 · CONSTITUIÇÃO'},
  {a: T.cascata, b: T.estados, texto: 'IMPOSTO SOBRE IMPOSTO', destaque: true},
  {a: T.decadas, b: T.n2023, texto: '+ DE 30 ANOS DE TENTATIVAS'},
  {a: T.n2023, b: T.regras, texto: '2023 · APROVADA', destaque: true},
  {a: T.dividido, b: T.cbs, texto: '5 VIRAM 2', destaque: true},
  {a: T.semCascata, b: T.quemManda, texto: 'COBRADO UMA VEZ SÓ', destaque: true},
  {a: T.leiUma, b: T.dinheiro, texto: 'PERCENTUAL DE CADA UM · LEI ÚNICA'},
  {a: T.caixa, b: T.repara, texto: 'CAIXA ÚNICO', destaque: true},
  {a: T.continua, b: T.jatinho, texto: 'CONTINUA COM ESTADOS E CIDADES'},
  {a: T.maior, b: T.calendario, texto: 'QUANTO MAIOR, MAIOR O PERCENTUAL'},
  {a: T.quatroDatas, b: T.um, texto: '4 DATAS', destaque: true},
  {a: T.deixam, b: T.bolso, texto: 'O SISTEMA NOVO INTEIRO', destaque: true},
  {a: T.ajuste, b: T.eAi, texto: 'GOVERNO TERÁ QUE PROPOR AJUSTE'},
  {a: T.comentarios, b: T.segue, texto: 'ME CONTA NOS COMENTÁRIOS', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.constituicao, b: T.n2025, texto: 'FONTE: EMENDA CONSTITUCIONAL 132 · 20/12/2023'},
  {a: T.n2025, b: T.n2026, texto: 'FONTE: LEI COMPLEMENTAR 214/2025'},
  {a: T.n2026, b: T.comoFica + 1.0, texto: 'FONTE: LEI COMPLEMENTAR 227/2026 · COMITÊ GESTOR'},
  {a: T.um, b: T.dois, texto: 'FONTE: EC 132 · ADCT, ART. 125'},
  {a: T.tcu, b: T.seletivo, texto: 'FONTE: TCU, 28/10/2026 · SENADO DECIDE ATÉ DEZEMBRO'},
  {a: T.tres, b: T.bolso, texto: 'FONTE: EC 132 · ADCT, ARTS. 128 E 129'},
  {a: T.estimativa, b: T.eAi, texto: 'FONTE: COMITÊ GESTOR · RESOLUÇÃO 14/2026 · 27,91%'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.chegar, b: T.trigo, p: soma(VOCE, [0, 1.8, 0]), texto: 'VOCÊ', acento: true},
  {a: T.trigo, b: T.n1988, p: soma(TRIGO, [0, 1.7, 0]), texto: 'TRIGO'},
  {a: T.farinha, b: T.n1988, p: soma(MOINHO, [0, 3.2, 0]), texto: 'FARINHA'},
  {a: T.veio, b: T.estados, p: soma(MOINHO, [0.9, 0.8, 0.6]), texto: 'JÁ VEIO COM IMPOSTO'},
  {a: T.tentativas, b: T.n2023, p: [-17.5, 2.5, -0.2], texto: 'PROPOSTAS ARQUIVADAS'},
  {a: T.constituicao, b: T.comoFica, p: [-13.4, 1.7, -0.4], texto: 'CONSTITUIÇÃO', acento: true},
  {a: T.n2025, b: T.comoFica, p: [-11.8, 0.9, -0.2], texto: 'LEI DOS NOVOS IMPOSTOS'},
  {a: T.n2026, b: T.comoFica, p: [-10.8, 0.5, -0.2], texto: 'LEI DO COMITÊ GESTOR'},
  {a: T.zona, b: T.paozinho2, p: soma(TELHADO.ipi, [0, -0.6, 0]), texto: 'MENOS NA ZONA FRANCA DE MANAUS'},
  {a: T.desconta, b: T.vezSo, p: soma(MOINHO, [1.5, 1.3, 1.2]), texto: 'DESCONTA O QUE JÁ VEIO PAGO', acento: true},
  {a: T.leiUma, b: T.dinheiro, p: [3, TETO_Y + 2.6, -4.8], texto: 'LEI NACIONAL'},
  {a: T.ipva, b: T.calendario, p: [-1.7, 1.2, -2.4], texto: 'IPVA'},
  {a: T.iptu, b: T.calendario, p: [4.8, 1.4, -2.6], texto: 'IPTU'},
  {a: T.itbi, b: T.calendario, p: [7.3, 1.3, -2.4], texto: 'ITBI'},
  {a: T.heranca, b: T.calendario, p: [0.4, 1.6, -2.4], texto: 'HERANÇA'},
  {a: T.jatinho, b: T.herancaPaga, p: [-3.0, 1.4, -1.0], texto: 'IPVA PODE PEGAR', acento: true},
  {a: T.hoje, b: T.dois, p: [MARCOS[0], 2.2, LINHA_Z - 0.6], texto: 'HOJE', acento: true},
  {a: T.p09, b: T.dois, p: [MARCOS[0] - 0.5, 1.8, OBJ_Z], texto: 'CBS 0,9%'},
  {a: T.p01, b: T.dois, p: [MARCOS[0] - 0.5, 1.2, OBJ_Z], texto: 'IBS 0,1%'},
  {a: T.naoPaga, b: T.dois, p: [MARCOS[0] + 1.1, 0.4, OBJ_Z], texto: 'QUEM CUMPRE AS REGRAS NÃO PAGA'},
  {a: T.p113, b: T.seletivo, p: [MARCOS[1] - 0.9, 2.3, OBJ_Z], texto: 'CBS 2027: 11,3%', acento: true},
  {a: T.senadoConf, b: T.seletivo, p: [MARCOS[1] - 0.9, 0.5, OBJ_Z], texto: 'SENADO CONFIRMA...'},
  {a: T.diminuem, b: T.quatro, p: [MARCOS[2] - 0.6, 0.4, OBJ_Z + 0.4], texto: '9/10 · 8/10 · 7/10 · 6/10'},
  {a: T.zero, b: T.separado, p: [BOLSO_X - 1.8, 1.3, OBJ_Z], texto: 'IMPOSTO ZERO', acento: true},
  {a: T.volta, b: T.separado, p: [BOLSO_X + 1.1, 1.8, OBJ_Z - 0.3], texto: 'CASHBACK · CADÚNICO'},
  {a: T.separado + 0.4, b: T.atencao, p: [BOLSO_X + 2.8, 2.0, OBJ_Z], texto: 'IMPOSTO SEPARADO NA NOTA'},
  {a: T.p265, b: T.eAi, p: soma(MEDIDOR, [-1.0, 0.25 + 3.0 * (26.5 / 30), 0]), texto: 'TETO 26,5%'},
  {a: T.p28, b: T.eAi, p: soma(MEDIDOR, [1.0, 0.25 + 3.0 * (27.91 / 30) + 0.3, 0]), texto: 'QUASE 28% (ESTIMATIVA)', acento: true},
  {a: T.leve, b: T.segue, p: soma(BALANCA, [-1.2, 2.0, 0]), texto: 'MAIS LEVE'},
  {a: T.pesada, b: T.segue, p: soma(BALANCA, [1.2, 2.0, 0]), texto: 'MAIS PESADA'},
];

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira (regra fixa do perfil)
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

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 17 : 21, fontWeight: 700, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 30 ? 24 : 30} />
    </div>
  ) : null;
  const fimK = rampa(t, T.segue, T.segue + 0.4);
  const fimEl =
    t > T.segue - 0.05 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: fimK, transform: `translateY(${(1 - fimK) * 20}px)`}}>
        <div style={{padding: '24px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE</div>
          <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>O QUE MEXE COM O SEU BOLSO</div>
        </div>
      </div>
    ) : null;
  if (noMapa(t))
    return (
      <>
        {selo ? seloDe(selo) : null}
        {chipEl}
      </>
    );
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 170, Math.min(SEGURO.botoesX - 170, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 22 ? 21 : 25, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y, k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  visRot.sort((a, b) => a.i - b.i);
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 400 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y + 58;
  return (
    <>
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {fimEl}
    </>
  );
};

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/reforma.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.paozinho, T.n1988, T.problema, T.muitas, T.estados, T.porMais, T.comoFica, T.paozinho2, T.quemManda, T.repara, T.continua, T.calendario, T.bolso, T.atencao, T.eAi].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [0, 0.12, 0.24, 0.36, 0.48].forEach((d) => s.push({t: T.cinco + d, f: 'pop', v: 0.13}));
  s.push({t: T.trocados, f: 'ding', v: 0.24});
  [T.trigo, T.farinha, T.padaria].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  [0, 0.12, 0.24].forEach((d) => s.push({t: T.temImposto + d, f: 'pop', v: 0.14}));
  [T.uniao, T.estado, T.prefeitura].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  [T.ipi, T.pis, T.cofins, T.icms, T.iss].forEach((t) => s.push({t: t + 0.6, f: 'pop', v: 0.13}));
  s.push({t: T.n27, f: 'subida', v: 0.2});
  s.push({t: T.mil5, f: 'subida', v: 0.2});
  s.push({t: T.emCima, f: 'pop', v: 0.16});
  s.push({t: T.cascata, f: 'baque', v: 0.18});
  s.push({t: T.morreram + 0.5, f: 'baque', v: 0.16});
  s.push({t: T.constituicao, f: 'impacto', v: 0.2});
  [T.n2025, T.n2026].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  s.push({t: T.umSo, f: 'ding', v: 0.22});
  s.push({t: T.dividido + 0.2, f: 'whoosh', v: 0.14});
  [T.pisCofins + 0.3, T.icms2 + 0.2, T.iss2 + 0.2].forEach((t) => s.push({t, f: 'baque', v: 0.14}));
  s.push({t: T.ipiZera, f: 'pop', v: 0.16});
  s.push({t: T.acrescentou, f: 'pop', v: 0.16});
  s.push({t: T.semCascata, f: 'ding', v: 0.24});
  [T.cadaEstado, T.cadaCidade].forEach((t) => s.push({t, f: 'tique', v: 0.18}));
  s.push({t: T.caixa, f: 'pop', v: 0.2});
  s.push({t: T.comite, f: 'impacto', v: 0.16});
  s.push({t: T.reparte, f: 'subida', v: 0.18});
  s.push({t: quando('vai para a Bahia'), f: 'whoosh', v: 0.14});
  s.push({t: T.a2077, f: 'subida', v: 0.2});
  [T.ipva, T.iptu, T.itbi, T.heranca, T.jatinho, T.lancha].forEach((t) => s.push({t, f: 'pop', v: 0.15}));
  [T.um, T.dois, T.tres, T.quatro].forEach((t) => s.push({t, f: 'tique', v: 0.2}));
  s.push({t: T.teste, f: 'impacto', v: 0.18});
  [T.p09, T.p01].forEach((t) => s.push({t, f: 'bip', v: 0.14}));
  s.push({t: T.vale, f: 'subida', v: 0.18});
  s.push({t: T.acabam + 0.6, f: 'baque', v: 0.16});
  [T.seletivo, T.cigarro, T.bebida].forEach((t) => s.push({t, f: 'pop', v: 0.14}));
  s.push({t: T.diminuem, f: 'subida', v: 0.16});
  s.push({t: T.deixam + 0.3, f: 'ding', v: 0.24});
  [T.cesta, T.baixa].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  s.push({t: T.volta, f: 'ding', v: 0.18});
  s.push({t: T.estimativa, f: 'subida', v: 0.2});
  s.push({t: T.comentarios, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.trocados + 0.5, T.chegar + 0.4, T.padaria + 0.8, T.temImposto + 0.5, T.uniao + 0.8, T.cofins + 0.8, T.icms + 0.8, T.iss + 0.8,
  T.n27 + 0.8, T.mil5 + 0.9, T.emCima + 0.9, T.cascata + 0.5, quando('roubar') + 0.8, quando('guerra fiscal') + 0.6,
  T.tentativas + 0.6, T.morreram + 0.7, T.camara + 0.5, T.constituicao + 0.8, T.n2026 + 0.5,
  T.umSo + 0.5, T.dividido + 0.8, T.daUniao + 0.8, T.juntos + 0.8, T.iss2 + 0.4, T.zona + 0.4,
  T.acrescentou + 0.6, T.desconta + 0.4, T.vezSo + 0.7, T.percentual + 0.6, T.leiUma + 0.5, T.comite + 0.5, T.reparte + 0.8, T.bolo + 0.6,
  quando('Bahia') + 0.6, quando('vai para a Bahia') + 1.0, T.a2077 + 1.5, quando('fundo regional') + 0.9,
  T.ipva + 0.4, T.heranca + 0.4, T.jatinho + 0.5, T.lancha + 0.4, T.maior + 0.4,
  T.quatroDatas + 0.6, T.p01 + 0.6, T.naoPaga + 0.4, T.p113 + 0.4, T.cigarro + 0.6, T.diminuem + 1.5, T.deixam + 0.8,
  T.zero + 0.4, T.volta + 0.4, T.enxerga + 0.4, T.p265 + 0.4, T.p28 + 0.6, T.pesada + 0.4, T.comentarios + 0.4, FIM - 0.4,
].filter((x) => x > 0);

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const ReformaTrib: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={30} centro={[3, 0, 2]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  const mapas = (
    <>
      <Sequence from={MAPA_A1.de} durationInFrames={MAPA_A1.ate - MAPA_A1.de} layout="none">
        <TrechoMapa {...MAPA_A1} />
      </Sequence>
      <Sequence from={MAPA_A2.de} durationInFrames={MAPA_A2.ate - MAPA_A2.de} layout="none">
        <TrechoMapa {...MAPA_A2} />
      </Sequence>
      <Sequence from={MAPA_B.de} durationInFrames={MAPA_B.ate - MAPA_B.de} layout="none">
        <TrechoMapa {...MAPA_B} />
      </Sequence>
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Reforma tributária" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['5 impostos', 'viram 2.', 'O que muda', 'pra você?'];
export const CapaReformaTrib: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.length > 4 ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · REFORMA TRIBUTÁRIA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap', marginTop: k === 2 ? 28 : 0}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
