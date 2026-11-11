import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Caixa, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type Pose, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Cadeado, Cadeira, Cone, Congresso, IconeBalao, Jornal, LivroLei, MapaBrasil, Megafone, Relogio, Urna} from '../../pecas';
import {FolhaCarimbo, ListaLei, PlacaChao} from '../demissaovoto/pecas';
import {Corda, N_CADEIRAS, PilhaVotos, PlacaPreco, PlenarioCamara} from '../distritalmisto/pecas';
import {Prefeitura} from '../orcamentoitabuna/pecas';
import {CaixaEtiqueta, CancelaNao, Estrada, Lapis, LinhaChao, Lixeira, MedidorVotos, MesaRedonda, Palanque, PlaquinhaMesa, PranchetaDistritos, TabuleiroDistritos, TerrenoDistrito} from './pecas';
import {PALAVRAS} from './palavras';

// 049. quem quer o distrital misto (perfil @eumagnoleite). Vídeo de OPINIÃO, contra o distrital misto.
// O mundo é a "estrada da PEC": você e a urna no começo, a mesa do acordo no meio, oito cancelas (uma por
// motivo, cada uma desce com a placa NÃO) e o Congresso no fim. Dois trechos de mapa do Kit Mapas
// (composição QuemDistritalBahia: projetos/049.../mapas/bahia.mp4). Pessoas reais só como bonecos
// genéricos com etiqueta; nenhuma cor de partido real. Plano: projetos/049.../plano.md (aprovado em 07/11/2026).

export const FPS = 30;
const AUDIO_SEG = 173.05;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '049. quem quer o distrital misto';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  direita: quando('Direita e esquerda'),
  esquerda: quando('esquerda brigam'),
  quaseTudo: quando('quase tudo'),
  doisLados: quando('dos dois lados'),
  mudarJeito: quando('mudar o jeito'),
  voceVota: quando('que voce vota'),
  souContra: quando('eu sou contra'),
  tresPassos: quando('tres passos'),
  comoHoje: quando('como e hoje'),
  querem: quando('o que eles querem'),
  quemSao: quando('quem sao'),
  oitoMotivos: quando('oito motivos'),
  dizerNao: quando('dizer nao'),
  hoje: quando('Primeiro, hoje'),
  contaFases: quando('A conta tem'),
  fase1: quando('Fase um'),
  divididos: quando('divididos pelas vagas'),
  quociente: quando('quociente eleitoral'),
  preco: quando('o preco de uma'),
  cadaPartido: quando('Cada partido leva'),
  dezPor: quando('pelo menos 10'),
  fase2: quando('Fase dois'),
  sobram: quando('cadeiras que sobram'),
  medias: quando('maiores medias'),
  oitenta: quando('com 80'),
  vinte: quando('candidato com 20'),
  fase3: quando('Fase tres'),
  todos: quando('entram todos'),
  semMinimo: quando('sem minimo'),
  supremo: quando('Decisao do Supremo'),
  porIsso: quando('Por isso'),
  quemTemMuito: quando('quem tem muito'),
  levaColegas: quando('levar colegas'),
  puxador: quando('o puxador'),
  segundo: quando('Segundo, o que'),
  distritalMisto: quando('voto distrital misto'),
  metadeVagas: quando('Metade das vagas'),
  outraMetade: quando('A outra metade'),
  lista: quando('uma lista'),
  montaAntes: quando('monta antes'),
  ordem: quando('ordem definida'),
  votaPartido: quando('Voce vota no partido'),
  topo: quando('colocou no topo'),
  umaPec: quando('uma PEC'),
  constituicao: quando('mudanca na Constituicao'),
  terceiro: quando('Terceiro, quem quer'),
  presidente: quando('presidente da Camara'),
  hugo: quando('Hugo Motta'),
  centro: quando('Do centro e'),
  uniao: quando('Uniao Brasil'),
  pp: quando('PP'),
  psd: quando('PSD MDB'),
  mdb: quando('MDB'),
  podemos: quando('Podemos'),
  psdb: quando('PSDB'),
  relator: quando('O relator previsto'),
  domingos: quando('Domingos Neto'),
  kim: quando('Kim Kataguiri'),
  bonsOlhos: quando('bons olhos'),
  daEsquerda: quando('Da esquerda'),
  psb: quando('PSB de Joao'),
  fechou: quando('fechou a articulacao'),
  eContra: quando('E contra'),
  pl: quando('enquanto PL'),
  pt: quando('PT PCdoB'),
  pcdob: quando('PCdoB'),
  psol: quando('e PSOL'),
  rivais: quando('Rivais de sempre'),
  mesmoLado: quando('do mesmo lado'),
  praMim: quando('Pra mim'),
  esqDir: quando('esquerda contra direita'),
  laDentro: quando('la dentro'),
  mexendo: quando('mexendo na regra'),
  m1: quando('Um. A'),
  metadeCadeiras: quando('Metade das cadeiras'),
  naoEscolhe: quando('voce nao escolhe'),
  cupula: quando('cupula do partido'),
  valdemar: quando('Valdemar Costa'),
  soBom: quando('so e bom'),
  m1fim: quando('dirigente partidario', 1, true),
  m2: quando('Dois. O'),
  disputaPequena: quando('disputa pequena'),
  maquina: quando('a maquina'),
  prefeito: quando('grupo do prefeito'),
  emenda: quando('distribui emenda'),
  liderPsol: quando('lider do PSOL'),
  coronelismo: quando('coronelismo'),
  compra: quando('compra de votos'),
  m2fim: quando('compra de votos', 1, true),
  m3: quando('Tres. Voto'),
  imagina: quando('Imagina'),
  fez49: quando('fez 49'),
  fez50: quando('fez 50'),
  os49: quando('Os 49'),
  m3fim: quando('elegem ninguem', 1, true),
  m4: quando('Quatro. Voto'),
  professora: quando('Uma professora'),
  estadoTodo: quando('estado todo'),
  semReduto: quando('sem reduto'),
  ficaFora: quando('fica de fora'),
  mulheres: quando('mulheres'),
  negros: quando('negros'),
  indigenas: quando('indigenas'),
  m4fim: quando('indigenas', 1, true),
  m5: quando('Cinco. Vereador'),
  deputadoPassa: quando('O deputado passa'),
  obra: quando('obra do distrito'),
  pais: quando('O pais'),
  m5fim: quando('fica para depois', 1, true),
  m6: quando('Seis. O'),
  naoExistem: quando('Os distritos nao'),
  quemDesenha: quando('Quem desenha'),
  bairro: quando('juntar um bairro'),
  cidade: quando('cortar uma cidade'),
  resultado: quando('escolher o resultado'),
  politicos: quando('os politicos'),
  campo: quando('marcando o campo'),
  m6fim: quando('marcando o campo', 1, true),
  m7: quando('Sete. A'),
  votarEste: quando('Querem votar este'),
  apresentado: quando('nem foi apresentado'),
  novo: quando('O Novo soube'),
  relatorMarcou: quando('o relator marcou'),
  empresarios: quando('empresarios em Sao'),
  paraVoce: quando('Para voce'),
  m7fim: quando('quem explicou', 1, true),
  m8: quando('Oito. Tem'),
  minimo: quando('minimo de 10'),
  ajustar: quando('ajustar esse freio'),
  mexer: quando('mexer na Constituicao'),
  m8fim: quando('mexer na Constituicao', 1, true),
  passar: quando('Para passar'),
  n308: quando('308'),
  n49s: quando('49 senadores'),
  cobrar: quando('cobrar quem voce'),
  voceQuer: quando('Voce quer escolher'),
  deixar: quando('deixar o partido'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

// Os oito motivos: começo, fim (a cancela desce) e o z da cancela na estrada
const MOTIVOS = [
  {ini: T.m1, fim: T.m1fim + 0.15, z: -18, pilula: '1 · A LISTA'},
  {ini: T.m2, fim: T.m2fim + 0.15, z: -25, pilula: '2 · O DONO DO DISTRITO'},
  {ini: T.m3, fim: T.m3fim + 0.1, z: -32, pilula: '3 · VOTO NO LIXO'},
  {ini: T.m4, fim: T.m4fim + 0.1, z: -39, pilula: '4 · VOTO ESPALHADO'},
  {ini: T.m5, fim: T.m5fim + 0.1, z: -46, pilula: '5 · VEREADOR FEDERAL'},
  {ini: T.m6, fim: T.m6fim + 0.1, z: -53, pilula: '6 · O MAPA'},
  {ini: T.m7, fim: T.m7fim + 0.1, z: -60, pilula: '7 · A PRESSA'},
  {ini: T.m8, fim: T.m8fim + 0.1, z: -66, pilula: '8 · SAÍDA SIMPLES'},
];
const naoFeitos = (t: number) => MOTIVOS.filter((m) => t >= m.fim + 0.3).length;

const ESTADOS: [number, string][] = [
  [0, 'DOIS LADOS'],
  [T.tresPassos, 'O CAMINHO'],
  [T.hoje, 'HOJE'],
  [T.contaFases, 'HOJE: AS TRÊS FASES'],
  [T.porIsso, 'O PUXADOR'],
  [T.segundo, 'O QUE QUEREM'],
  [T.terceiro, 'QUEM QUER'],
  [T.eContra, 'QUEM É CONTRA'],
  ...MOTIVOS.map((m) => [m.ini, m.pilula] as [number, string]),
  [T.passar, 'O QUE FALTA'],
  [T.voceQuer, 'E VOCÊ?'],
];

// ---------- Os trechos de mapa (Kit Mapas), em quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.hoje), ate: q(T.contaFases), origem: 0};
const MAPA_B = {de: q(T.metadeVagas), ate: q(T.outraMetade), origem: q(5.54)};
const noMapa = (t: number) => (t >= T.hoje && t < T.contaFases) || (t >= T.metadeVagas && t < T.outraMetade);

// ---------- Mapa do mundo (a estrada corre no eixo z, de +9 até o Congresso em -76) ----------
const VOCE: V3 = [-0.9, 0, 8.2];
const URNA: V3 = [0.5, 0, 8.0];
const PUX: V3 = [1.7, 0, 3.8];
const CADS: V3[] = [
  [-0.6, 0, 2.5],
  [0.5, 0, 2.5],
];
const COLEGAS: V3[] = [
  [3.0, 0, 4.4],
  [3.4, 0, 3.6],
];
// As três fases de hoje: 5 cadeiras de exemplo, a pilha dos votos válidos e quem senta em cada uma
const FX = [-2.4, -1.2, 0, 1.2, 2.4];
const CAD_F: V3[] = FX.map((x) => [x, 0, 2.0] as V3);
const PILHA_F: V3 = [0, 0, 4.4];
const BARREIRA: V3 = [0, 0, 3.0];
const REGUA: V3 = [-1.9, 0, 3.9];
const PLEN: V3 = [0, 0, -1.4];
const LISTA: V3 = [2.4, 0, 0.6];
const URNA_P: V3 = [-2.3, 0, 1.2];
const VOCE_P: V3 = [-3.2, 0, 1.7];
const PEC1: V3 = [-0.9, 0, 2.2];
const LIVRO1: V3 = [0.9, 0.7, 2.4];
const MESA: V3 = [0, 0, -10];
const R_MESA = 1.7;
// lugares da mesa (ângulo; 0 = de frente para a câmera). Esquerda: centro e direita. Cabeceira: Motta. Direita: PSB.
const LADO_DIR = [
  {a: -0.6, sigla: 'UNIÃO', t: T.uniao},
  {a: -1.0, sigla: 'PP', t: T.pp},
  {a: -1.4, sigla: 'PSD', t: T.psd},
  {a: -1.8, sigla: 'MDB', t: T.mdb},
  {a: -2.2, sigla: 'PODEMOS', t: T.podemos},
  {a: -2.6, sigla: 'PSDB', t: T.psdb},
];
const A_MOTTA = Math.PI;
const A_PSB = 2.3;
const A_VAZIO = 1.5;
const noLugar = (a: number, r = R_MESA + 0.85): V3 => [MESA[0] + Math.sin(a) * r, 0, MESA[2] + Math.cos(a) * r];
const DOMINGOS: V3 = [-1.6, 0, -12.9];
const KIM: V3 = [-3.7, 0, -8.6];
const CONTRA = [
  {sigla: 'PL', t: T.pl, p: [4.0, 0, -8.4] as V3},
  {sigla: 'PT', t: T.pt, p: [4.5, 0, -9.5] as V3},
  {sigla: 'PCdoB', t: T.pcdob, p: [5.0, 0, -10.6] as V3},
  {sigla: 'PSOL', t: T.psol, p: [5.5, 0, -11.7] as V3},
];
const ZM = MOTIVOS.map((m) => m.z + 2.2); // linha dos objetos de cada motivo (na frente da cancela)
const CONGRESSO: V3 = [0, 0, -77];
const URNAS_FIM: V3[] = [
  [-1.3, 0, -70],
  [1.3, 0, -70],
];
const VOCE_FIM: V3 = [0, 0, -69.4];

// ---------- Ajudantes ----------
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.45) => entra(t, a, d) * (1 - rampa(t, b, b + d));
const andar = (t: number, a: number, b: number) => (t > a && t < b ? Math.sin((t - a) * 9) : 0);
const VOTANDO: Pose = {ombroD: [-0.9, 0, 0.07], cotoveloD: -0.4};
const BRACOS_CRUZADOS: Pose = {ombroD: [-0.55, 0, 0.35], cotoveloD: -1.9, ombroE: [-0.55, 0, -0.35], cotoveloE: -1.9};
const DISCUTINDO = (t: number, fase: number): Pose => ({ombroD: [-0.6, 0, 0.3 + 0.35 * Math.sin(t * 5 + fase)], cotoveloD: -0.9, cabeca: [0, 0.2 * Math.sin(t * 3 + fase), 0]});

const Mundo: React.FC<{t: number; tema: Tema; alvoZ: number}> = ({t, tema, alvoZ}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const corDir = F.azul;
  const corEsq = F.dourado;
  const perto = (z: number, r = 15) => Math.abs(z - alvoZ) < r;
  const motivoK = (i: number) => janela(t, MOTIVOS[i].ini - 0.3, i < 7 ? MOTIVOS[i + 1].ini + 0.4 : T.passar + 0.4, 0.5);

  // Gancho: os dois lados da mesa discutindo; você e a urna; o NÃO desce
  const brigaK = 1 - rampa(t, T.doisLados, T.doisLados + 0.6);
  const naoGancho = rampa(t, T.souContra, T.souContra + 0.45, sai) * (1 - rampa(t, T.tresPassos + 1.0, T.tresPassos + 1.5));
  // Cancelas: nascem em "oito motivos" e descem no fim de cada motivo
  const cancelaK = (i: number) => entra(t, T.oitoMotivos + i * 0.12, 0.5);
  const placaPassos = (a: number) => entra(t, a, 0.45) * (1 - rampa(t, T.hoje, T.hoje + 0.4));
  // Puxador
  const puxK = janela(t, T.quemTemMuito - 0.1, T.segundo, 0.4);
  const cordaK = rampa(t, T.levaColegas, T.levaColegas + 0.4);
  const puxa = rampa(t, T.levaColegas + 0.4, T.puxador + 0.5);
  // As três fases
  const fasesK = janela(t, T.contaFases - 0.2, T.porIsso + 0.2, 0.5);
  const dividir = rampa(t, T.divididos, T.divididos + 1.0);
  const pagaA = rampa(t, T.cadaPartido, T.cadaPartido + 0.5);
  const sobra2 = rampa(t, T.dezPor + 0.8, T.dezPor + 1.3);
  const reguaK = entra(t, T.oitenta - 0.3, 0.5) * (1 - rampa(t, T.semMinimo, T.semMinimo + 0.6));
  const corA = mistura(tema.pessoa, corDir, 0.45);
  const corB = mistura(tema.pessoa, corEsq, 0.45);
  const corC = mistura(tema.pessoa, tema.objeto, 0.6);
  const corCad = (i: number): number => {
    if (i <= 1) return pagaA;
    if (i === 2) return pagaA * (1 - sobra2) + rampa(t, T.medias + 0.6, T.medias + 1.1);
    if (i === 3) return pagaA;
    return rampa(t, T.semMinimo + 0.6, T.semMinimo + 1.1);
  };
  const frente = (i: number): V3 => soma(CAD_F[i], [0, 0, 0.55]);
  type Ocupa = {de: V3; para: V3; a: number; d?: number; cor: string; para2?: V3; a2?: number};
  const OCUPA: Ocupa[] = [
    {de: [-3.6, 0, 5.2], para: frente(0), a: T.cadaPartido + 0.2, cor: corA},
    {de: [-3.2, 0, 5.6], para: frente(1), a: T.cadaPartido + 0.4, cor: corA},
    {de: [-2.8, 0, 5.8], para: soma(BARREIRA, [-0.1, 0, 0.55]), a: T.dezPor - 0.4, cor: mistura(corA, tema.objetoEscuro, 0.35)},
    {de: [3.4, 0, 5.2], para: frente(3), a: T.cadaPartido + 0.3, cor: corB},
    {de: [3.0, 0, 5.8], para: soma(REGUA, [1.0, 0, 0.6]), a: T.sobram, cor: corB, para2: frente(2), a2: T.medias + 0.2},
    {de: [3.7, 0, 6.2], para: soma(REGUA, [1.6, 0, 1.1]), a: T.vinte - 0.6, cor: corC, para2: frente(4), a2: T.semMinimo},
  ];
  // Plenário, lista, PEC
  const plenK = janela(t, T.segundo - 0.2, T.terceiro + 1.2, 0.5);
  const corCadeira = (o: number): string => {
    const base = tema.objetoEscuro;
    if (t < T.outraMetade) return o < N_CADEIRAS / 2 ? mistura(base, tema.objeto, 0.35 * rampa(t, T.distritalMisto, T.distritalMisto + 0.6)) : base;
    const dist = mistura(base, tema.objeto, 0.35);
    return o < N_CADEIRAS / 2 ? dist : mistura(base, tema.acento, rampa(t, T.outraMetade + (o / N_CADEIRAS - 0.5) * 1.2, T.outraMetade + (o / N_CADEIRAS - 0.5) * 1.2 + 0.3));
  };
  const listaK = janela(t, T.lista, T.terceiro, 0.5);
  const urnaPK = janela(t, T.votaPartido - 0.5, T.terceiro, 0.5);
  const pecK = janela(t, T.umaPec, T.terceiro + 0.6, 0.45);
  const livroK = janela(t, T.constituicao, T.terceiro + 0.6, 0.45);
  // Mesa do acordo
  const mesaK = Math.max(entra(t, 0, 0.3) * (1 - rampa(t, T.mudarJeito + 1.5, T.mudarJeito + 2.2)), janela(t, T.terceiro - 0.6, T.m1 + 1.5, 0.6));
  const naMesa = t < T.mudarJeito + 2.2 ? 1 : 0;
  const pessoaMesa = (a: number) => (naMesa ? brigaK * 0 + 1 : entra(t, a, 0.45));
  const aperto = rampa(t, T.fechou, T.fechou + 0.6);
  const contraK = (a: number) => janela(t, a, T.m1 + 1.2, 0.45);
  // Motivo 1: a lista
  const m1 = motivoK(0);
  // Motivo 2: o dono do distrito
  const m2 = motivoK(1);
  const fecha = rampa(t, T.disputaPequena, T.disputaPequena + 1.0);
  const caixas = (i: number) => rampa(t, T.emenda + i * 0.25, T.emenda + i * 0.25 + 0.8);
  // Motivo 3: voto no lixo
  const m3 = motivoK(2);
  const lixo = rampa(t, T.os49, T.os49 + 0.9);
  // Motivo 4
  const m4 = motivoK(3);
  const profSai = rampa(t, T.ficaFora, T.ficaFora + 1.0);
  // Motivo 5
  const m5 = motivoK(4);
  const mapaApaga = 1 - 0.85 * rampa(t, T.pais, T.pais + 0.9);
  // Motivo 6
  const m6 = motivoK(5);
  const lapisK = janela(t, T.quemDesenha, T.politicos, 0.4);
  const bairro = rampa(t, T.bairro, T.bairro + 0.8);
  const corta = rampa(t, T.cidade, T.cidade + 0.7);
  const linha = rampa(t, T.campo - 0.3, T.campo + 0.9);
  // Motivo 7
  const m7 = motivoK(6);
  // Motivo 8
  const m8 = motivoK(7);
  const ponteiro = 0.45 * rampa(t, T.minimo, T.minimo + 0.8) + 0.12 * rampa(t, T.ajustar, T.ajustar + 0.7);
  // Final
  const fimK = entra(t, T.voceQuer - 0.2, 0.5);

  // Você: no começo junto da urna; no plenário votando no partido; no fim, na frente do Congresso
  let vocePos: V3 = VOCE;
  let voceR = 0.5;
  let vocePose: Pose = t > T.voceVota && t < T.voceVota + 1.2 ? VOTANDO : {};
  let voceVis = t < T.hoje + 0.5;
  if (t >= T.votaPartido - 0.6 && t < T.terceiro + 0.4) {
    voceVis = true;
    vocePos = VOCE_P;
    voceR = 1.0;
    vocePose = t > T.votaPartido && t < T.votaPartido + 1.4 ? VOTANDO : {};
  }
  if (t >= T.cobrar - 0.4) {
    voceVis = true;
    vocePos = lerp3([0, 0, -64.5], VOCE_FIM, rampa(t, T.cobrar - 0.4, T.cobrar + 0.8));
    voceR = t < T.cobrar + 0.8 ? Math.PI : Math.PI + 0.35 * Math.sin((t - T.voceQuer) * 1.4);
    vocePose = t < T.cobrar + 0.8 ? {passo: andar(t, T.cobrar - 0.4, T.cobrar + 0.8)} : {ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25};
  }

  return (
    <group>
      <Estrada tema={tema} de={10} ate={-74} />
      <Congresso tema={tema} pos={CONGRESSO} escala={0.95} aceso={Math.max(pulso(t, T.laDentro, 1.4), rampa(t, T.passar, T.passar + 0.8))} />

      {/* Gancho e o caminho */}
      {perto(VOCE[2]) ? (
        <group>
          <Urna tema={tema} pos={URNA} rotY={-0.3} escala={0.8 * entra(t, T.mudarJeito, 0.45) * (1 - rampa(t, T.hoje, T.hoje + 0.4))} />
          {[
            {txt: 'HOJE', a: T.comoHoje, x: -2.5},
            {txt: 'O QUE QUEREM', a: T.querem, x: 0},
            {txt: 'QUEM SÃO', a: T.quemSao, x: 2.5},
          ].map((p) => (
            <PlacaChao key={p.txt} tema={tema} pos={[p.x, 0, 5.4]} escala={1.05 * placaPassos(p.a)} texto={p.txt} aceso={pulso(t, p.a, 1.0)} />
          ))}
          {naoGancho > 0.02 ? (
            <group position={[0, 3.2 - 1.6 * naoGancho, 6.2]} rotation={[0, 0, 0.06 * (1 - naoGancho)]}>
              <Caixa args={[2.4, 0.9, 0.1]} raio={0.1} cor={tema.acento} emissivo={0.3} />
              <Placa tema={tema} pos={[0, 0, 0.06]} larg={2.2} alt={0.76} linhas={[{t: 'NÃO', tam: 380, cor: tema.fundo, peso: 900}]} brilho={0.35} />
            </group>
          ) : null}
        </group>
      ) : null}
      {voceVis ? <Boneco tema={tema} pos={vocePos} rotY={voceR} escala={0.85 * (t < T.mudarJeito ? entra(t, T.voceVota - 0.3, 0.45) : 1)} cor={tema.corpo} pose={vocePose}>
        {t >= T.cobrar ? <Megafone tema={tema} pos={[0.27, 1.17, 0.5]} rot={[0, 0, 0]} escala={0.5 * entra(t, T.cobrar + 0.3, 0.45)} /> : null}
      </Boneco> : null}

      {/* As oito cancelas */}
      {MOTIVOS.map((m, i) => (perto(m.z, 26) || t < T.hoje ? <CancelaNao key={i} tema={tema} pos={[0, 0, m.z]} escala={cancelaK(i)} desce={rampa(t, m.fim, m.fim + 0.5, sai)} numero={`${i + 1}`} aceso={janela(t, m.ini, m.fim + 0.4, 0.4)} /> : null))}

      {/* Hoje: o puxador */}
      {puxK > 0.02 ? (
        <group>
          {CADS.map((c, i) => <Cadeira key={i} tema={tema} pos={c} escala={0.8 * puxK} aceso={rampa(t, T.puxador, T.puxador + 0.4)} />)}
          <Boneco tema={tema} pos={PUX} rotY={-0.5} escala={0.95 * puxK} cor={mistura(tema.pessoa, corDir, 0.3)} pose={{ombroE: [-0.6 * cordaK, 0, -0.3]}} />
          <PilhaVotos tema={tema} pos={soma(PUX, [-0.9, 0, 0.3])} blocos={12} cor={corDir} escala={0.6 * puxK} />
          {COLEGAS.map((c, i) => (
            <Boneco key={i} tema={tema} pos={lerp3(c, soma(CADS[i], [0, 0, 0.5]), puxa)} rotY={-2.2} escala={0.55 * puxK} cor={mistura(tema.pessoa, corDir, 0.15)} pose={{passo: andar(t, T.levaColegas + 0.4, T.puxador + 0.5)}} />
          ))}
          {COLEGAS.map((c, i) => (
            <Corda key={`c${i}`} tema={tema} de={soma(PUX, [-0.2, 1.2, 0])} ate={soma(lerp3(c, soma(CADS[i], [0, 0, 0.5]), puxa), [0, 0.7, 0])} k={cordaK * puxK} />
          ))}
        </group>
      ) : null}

      {/* Hoje: as três fases (exemplo com 5 cadeiras) */}
      {fasesK > 0.02 ? (
        <group>
          {CAD_F.map((c, i) => (
            <group key={i}>
              <Cadeira tema={tema} pos={c} escala={0.85 * fasesK} aceso={corCad(i)} />
              <PlacaPreco tema={tema} pos={soma(c, [0.42, 0, 0.35])} escala={0.62 * entra(t, T.preco, 0.45) * fasesK} texto="QUOCIENTE" aceso={0} />
            </group>
          ))}
          {/* a pilha dos votos válidos se divide em 5 fatias, uma por cadeira */}
          {dividir < 0.02 ? (
            <PilhaVotos tema={tema} pos={PILHA_F} blocos={10 * entra(t, T.fase1, 0.6)} escala={0.8 * fasesK} />
          ) : (
            FX.map((x, i) => <PilhaVotos key={i} tema={tema} pos={lerp3(PILHA_F, [x, 0, 3.0], dividir)} blocos={2} escala={0.6 * fasesK * (1 - rampa(t, T.cadaPartido, T.cadaPartido + 0.6))} />)
          )}
          {/* a barreira dos 10% na frente da 3ª cadeira */}
          {entra(t, T.dezPor - 0.2, 0.45) * fasesK > 0.02 ? (
            <group position={BARREIRA} scale={entra(t, T.dezPor - 0.2, 0.45) * fasesK}>
              {[-0.55, 0.55].map((x) => <Caixa key={x} args={[0.08, 0.6, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.3, 0]} />)}
              <Caixa args={[1.2, 0.12, 0.06]} raio={0.03} cor={tema.acento} emissivo={0.3} position={[0, 0.55, 0]} />
              <Placa tema={tema} pos={[0, 0.85, 0]} larg={0.9} alt={0.36} linhas={[{t: 'MÍN. 10%', tam: 210, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.3} />
            </group>
          ) : null}
          {/* a régua da fase dois: partido 80% e candidato 20% */}
          {reguaK * fasesK > 0.02 ? (
            <group position={REGUA} scale={reguaK * fasesK}>
              <Caixa args={[0.1, 1.6, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.8, 0]} />
              <Placa tema={tema} pos={[0, 1.75, 0.02]} larg={1.5} alt={0.62} linhas={[{t: 'PARTIDO 80%', tam: 150, cor: tema.objetoClaro, peso: 900}, {t: 'CANDIDATO 20%', tam: 130, cor: tema.objetoClaro, peso: 800}]} fundo={mistura(tema.objetoEscuro, tema.acento, 0.35)} brilho={0.3} />
            </group>
          ) : null}
          {OCUPA.map((o, i) => {
            const k = entra(t, o.a - 0.3, 0.45) * fasesK;
            if (k < 0.02) return null;
            const ida = rampa(t, o.a, o.a + 1.0);
            const volta = o.para2 && o.a2 !== undefined ? rampa(t, o.a2, o.a2 + 1.0) : 0;
            const pos = o.para2 ? lerp3(lerp3(o.de, o.para, ida), o.para2, volta) : lerp3(o.de, o.para, ida);
            const andando = andar(t, o.a, o.a + 1.0) || (o.a2 !== undefined ? andar(t, o.a2, o.a2 + 1.0) : 0);
            const barrado = i === 2 || (i === 5 && t < T.semMinimo);
            return <Boneco key={i} tema={tema} pos={pos} rotY={andando ? (o.para[0] > o.de[0] ? 1.2 : -1.2) : 0} escala={0.62 * k} cor={o.cor} pose={{passo: andando, ...(barrado && ida > 0.95 ? {ombroD: [0, 0, 0.5 * Math.sin(t * 4)], cabeca: [0.25, 0, 0]} : {})}} />;
          })}
        </group>
      ) : null}

      {/* O que querem: plenário em duas metades, lista, PEC e Constituição */}
      {plenK > 0.02 && perto(PLEN[2], 16) ? (
        <group>
          <PlenarioCamara tema={tema} pos={PLEN} escala={0.8 * plenK} cor={corCadeira} />
          <PlacaChao tema={tema} pos={[0, 0, 2.9]} escala={1.7 * janela(t, T.distritalMisto, T.metadeVagas + 0.4, 0.45)} texto="DISTRITAL MISTO" aceso={1} />
          <ListaLei tema={tema} pos={LISTA} escala={0.85 * listaK} titulo="LISTA DO PARTIDO" itens={['1º DA LISTA', '2º DA LISTA', '3º DA LISTA']} acesos={[0, 1, 2].map((i) => rampa(t, T.montaAntes + i * 0.25, T.montaAntes + 0.3 + i * 0.25))} destaque={t > T.topo ? [0] : []} />
          <group position={soma(LISTA, [0.75, 1.7, 0.15])} scale={0.85 * listaK}>
            <Cadeado tema={tema} pos={[0, 0, 0]} k={entra(t, T.ordem - 0.1, 0.4)} fecha={rampa(t, T.ordem + 0.2, T.ordem + 0.5)} />
          </group>
          {urnaPK > 0.02 ? (
            <group>
              <Urna tema={tema} pos={URNA_P} rotY={0.3} escala={0.7 * urnaPK} />
              <group position={soma(URNA_P, [0, 1.05, 0.2])} scale={urnaPK}>
                <Caixa args={[1.1, 0.3, 0.05]} raio={0.03} cor={tema.acento} emissivo={0.3} />
                <Placa tema={tema} pos={[0, 0, 0.03]} larg={1.0} alt={0.22} linhas={[{t: 'PARTIDO', tam: 190, cor: tema.fundo, peso: 900}]} brilho={0.3} />
              </group>
            </group>
          ) : null}
          <FolhaCarimbo tema={tema} pos={PEC1} rotY={0.2} escala={1.1 * pecK} texto={['PEC', 'SISTEMA ELEITORAL']} carimbo={0} textoCarimbo="" corCarimbo={tema.objeto} />
          <LivroLei tema={tema} pos={LIVRO1} rot={[0, -0.3, 0]} escala={0.9 * livroK} abre={rampa(t, T.constituicao + 0.2, T.constituicao + 0.9)} capa={1} />
        </group>
      ) : null}

      {/* A mesa do acordo */}
      {mesaK > 0.02 && perto(MESA[2], 18) ? (
        <group>
          <MesaRedonda tema={tema} pos={MESA} raio={R_MESA} lugares={[...LADO_DIR.map((l) => l.a), A_MOTTA, A_PSB, A_VAZIO]} k={mesaK} />
          {/* Motta na cabeceira */}
          <Boneco tema={tema} pos={noLugar(A_MOTTA)} rotY={A_MOTTA + Math.PI} escala={0.7 * mesaK * pessoaMesa(T.presidente)} cor={tema.pessoa} pose={naMesa ? {} : {ombroD: [-0.5, 0, 0.5 * pulso(t, T.hugo, 1.2)], cotoveloD: -0.6}} />
          {LADO_DIR.map((l, i) => (
            <group key={l.sigla}>
              <Boneco tema={tema} pos={noLugar(l.a)} rotY={l.a + Math.PI} escala={0.66 * mesaK * pessoaMesa(l.t)} cor={mistura(tema.pessoa, corDir, 0.45)} pose={naMesa ? DISCUTINDO(t, i) : {}} />
              <PlaquinhaMesa tema={tema} pos={soma(noLugar(l.a, R_MESA - 0.35), [0, 0.86, 0])} texto={l.sigla} k={naMesa ? 0 : entra(t, l.t, 0.4) * mesaK} cor={mistura(tema.objetoClaro, corDir, 0.25)} />
            </group>
          ))}
          <Boneco tema={tema} pos={noLugar(A_PSB)} rotY={A_PSB + Math.PI} escala={0.66 * mesaK * pessoaMesa(T.psb)} cor={mistura(tema.pessoa, corEsq, 0.45)} pose={naMesa ? DISCUTINDO(t, 2.5) : {ombroD: [-0.85 * aperto, 0, 0.6 * aperto], cotoveloD: -0.3 * aperto}} />
          <PlaquinhaMesa tema={tema} pos={soma(noLugar(A_PSB, R_MESA - 0.35), [0, 0.86, 0])} texto="PSB" k={naMesa ? 0 : entra(t, T.psb, 0.4) * mesaK} cor={mistura(tema.objetoClaro, corEsq, 0.3)} />
          {naMesa ? <Boneco tema={tema} pos={noLugar(A_VAZIO)} rotY={A_VAZIO + Math.PI} escala={0.66 * mesaK} cor={mistura(tema.pessoa, corEsq, 0.45)} pose={DISCUTINDO(t, 4)} /> : null}
          {/* aperto de mãos sobre a mesa: duas mãos se encontram no centro */}
          {aperto > 0.02 ? (
            <group position={soma(MESA, [0.3, 1.25, -0.2])} scale={aperto}>
              <Caixa args={[0.5, 0.16, 0.16]} raio={0.07} cor={mistura(tema.pessoa, corDir, 0.45)} position={[-0.25, 0, 0]} />
              <Caixa args={[0.5, 0.16, 0.16]} raio={0.07} cor={mistura(tema.pessoa, corEsq, 0.45)} position={[0.25, 0.02, 0]} />
            </group>
          ) : null}
          {/* de pé: o relator e o Kim */}
          <Boneco tema={tema} pos={DOMINGOS} rotY={0.3} escala={0.8 * (naMesa ? 0 : entra(t, T.relator, 0.45))} cor={mistura(tema.pessoa, corDir, 0.45)} pose={{ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25}} />
          <Boneco tema={tema} pos={KIM} rotY={0.6} escala={0.8 * (naMesa ? 0 : entra(t, T.kim, 0.45))} cor={mistura(tema.pessoa, corDir, 0.45)} pose={{ombroD: [0, 0, 1.2 * pulso(t, T.bonsOlhos, 1.0)], cotoveloD: -0.4}} />
          {/* a calçada do contra */}
          {CONTRA.map((c, i) => {
            const k = contraK(c.t);
            if (k < 0.02) return null;
            const passo = rampa(t, T.mesmoLado, T.mesmoLado + 0.6);
            return (
              <group key={c.sigla}>
                <Boneco tema={tema} pos={soma(c.p, [-0.35 * passo, 0, 0])} rotY={-1.2} escala={0.78 * k} cor={tema.pessoa} pose={{...BRACOS_CRUZADOS, passo: andar(t, T.mesmoLado, T.mesmoLado + 0.6)}} />
                <PlacaChao tema={tema} pos={soma(c.p, [-0.9, 0, 0.5])} rotY={-0.4} escala={0.7 * k} texto={c.sigla} aceso={pulso(t, c.t, 0.9)} />
                {i === 0 ? null : null}
              </group>
            );
          })}
        </group>
      ) : null}

      {/* 1. A lista */}
      {m1 > 0.02 && perto(ZM[0]) ? (
        <group>
          <ListaLei tema={tema} pos={[-0.5, 0, ZM[0]]} escala={1.05 * entra(t, T.metadeCadeiras, 0.5) * m1} titulo="LISTA DO PARTIDO" itens={['?', '?', '?', '?']} acesos={[0, 1, 2, 3].map((i) => rampa(t, T.naoEscolhe + i * 0.15, T.naoEscolhe + 0.3 + i * 0.15))} />
          <group position={[0.4, 2.2, ZM[0] + 0.15]} scale={1.05 * m1}>
            <Cadeado tema={tema} pos={[0, 0, 0]} k={entra(t, T.naoEscolhe, 0.4)} fecha={rampa(t, T.naoEscolhe + 0.3, T.naoEscolhe + 0.6)} />
          </group>
          <Boneco tema={tema} pos={[1.5, 0, ZM[0] - 0.2]} rotY={-0.6} escala={0.85 * entra(t, T.cupula, 0.45) * m1} cor={tema.objetoEscuro} pose={{ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25}} />
          <Boneco tema={tema} pos={[-2.3, 0, ZM[0] + 0.6]} rotY={0.5} escala={0.8 * entra(t, T.valdemar, 0.45) * m1} cor={tema.pessoa} pose={{ombroD: [-0.4, 0, 0.6 * pulso(t, T.soBom, 1.2)], cotoveloD: -0.8}} />
        </group>
      ) : null}

      {/* 2. O dono do distrito */}
      {m2 > 0.02 && perto(ZM[1]) ? (
        <group>
          <TerrenoDistrito tema={tema} pos={[0, 0, ZM[1] - 0.3]} lado={3.4} k={m2} fecha={fecha} />
          <Prefeitura tema={tema} pos={[-0.9, 0.12, ZM[1] - 1.0]} sobe={rampa(t, T.prefeito, T.prefeito + 0.6)} aceso={pulso(t, T.prefeito + 0.3, 1.2)} escala={0.36} />
          <Palanque tema={tema} pos={[0.8, 0.12, ZM[1] - 0.7]} k={entra(t, T.maquina, 0.5) * m2} />
          <Boneco tema={tema} pos={[0.8, 0.12 + 0.65 * entra(t, T.maquina, 0.5), ZM[1] - 0.8]} rotY={-0.2} escala={0.75 * entra(t, T.maquina, 0.5) * m2} cor={mistura(tema.pessoa, tema.objetoEscuro, 0.3)} pose={{ombroD: [0, 0, 2.2 * pulso(t, T.maquina + 0.4, 1.4)], ombroE: [0, 0, -2.2 * pulso(t, T.maquina + 0.4, 1.4)]}} />
          {[0, 1, 2].map((i) => {
            const k = caixas(i);
            return k > 0.02 ? <CaixaEtiqueta key={i} tema={tema} pos={curva([3.6, 0, ZM[1] + 1.2], [0.2 + i * 0.5, 0.12, ZM[1] + 0.6], 1.0, k)} rotY={0.2 * i} texto="EMENDA" k={m2} /> : null;
          })}
        </group>
      ) : null}

      {/* 3. Voto no lixo */}
      {m3 > 0.02 && perto(ZM[2]) ? (
        <group>
          <PilhaVotos tema={tema} pos={lerp3([-0.8, 0, ZM[2]], [-2.1, 0.1, ZM[2] + 0.3], lixo)} blocos={9.8 * rampa(t, T.fez49, T.fez49 + 0.9)} escala={m3 * (1 - 0.7 * lixo)} />
          <PilhaVotos tema={tema} pos={[0.9, 0, ZM[2]]} blocos={10 * rampa(t, T.fez50, T.fez50 + 0.9)} escala={m3} cor={mistura(tema.objetoClaro, tema.acento, rampa(t, T.fez50 + 0.6, T.fez50 + 1.1))} brilho={rampa(t, T.fez50 + 0.6, T.fez50 + 1.1)} />
          <Lixeira tema={tema} pos={[-2.3, 0, ZM[2] + 0.3]} k={entra(t, T.fez50 + 0.6, 0.5) * m3} />
        </group>
      ) : null}

      {/* 4. Voto espalhado */}
      {m4 > 0.02 && perto(ZM[3]) ? (
        <group>
          <TabuleiroDistritos tema={tema} pos={[-0.3, 0, ZM[3] - 0.4]} k={m4} espalha={rampa(t, T.estadoTodo - 0.3, T.estadoTodo + 0.8)} junta={rampa(t, T.semReduto - 0.3, T.semReduto + 0.6)} acendeJunto={rampa(t, T.semReduto + 0.2, T.semReduto + 0.7)} apagaEspalhado={rampa(t, T.ficaFora, T.ficaFora + 0.6)} corEspalhado={corEsq} corJunto={tema.objetoClaro} />
          <Boneco tema={tema} pos={lerp3([1.9, 0, ZM[3] + 0.6], [3.4, 0, ZM[3] + 1.2], profSai)} rotY={profSai > 0 ? 1.2 : -0.4} escala={0.8 * entra(t, T.professora, 0.45) * m4 * (1 - 0.6 * profSai)} cor={mistura(tema.pessoa, corEsq, 0.5)} pose={{passo: andar(t, T.ficaFora, T.ficaFora + 1.0)}} />
          {[T.mulheres, T.negros, T.indigenas].map((a, i) => (
            <Boneco key={i} tema={tema} pos={[-2.3 + i * 0.0, 0, ZM[3] + 1.1 - i * 0.8]} rotY={0.4} escala={0.62 * entra(t, a, 0.45) * m4} cor={mistura(tema.pessoa, corEsq, 0.35)} />
          ))}
        </group>
      ) : null}

      {/* 5. Vereador federal */}
      {m5 > 0.02 && perto(ZM[4]) ? (
        <group>
          <group position={[0, 1.7, ZM[4] - 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <MapaBrasil tema={tema} pos={[0, 0, 0]} tam={2.6} k={m5 * mapaApaga} acende={0} cor={mistura(tema.objeto, tema.objetoClaro, 0.35)} />
          </group>
          <Boneco tema={tema} pos={[-0.7, 0, ZM[4] + 0.2]} rotY={0.4} escala={0.85 * entra(t, T.deputadoPassa, 0.45) * m5} cor={tema.pessoa} pose={{ombroD: [-0.6, 0, 0.3], cotoveloD: -0.8}}>
            <mesh position={[0, 1.78, 0]} castShadow>
              <sphereGeometry args={[0.17, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={mistura(tema.acento, tema.areia, 0.4)} roughness={0.6} />
            </mesh>
          </Boneco>
          <Cone tema={tema} pos={[0.5, 0, ZM[4] + 0.5]} k={entra(t, T.obra, 0.45) * m5} />
          <Cone tema={tema} pos={[1.3, 0, ZM[4] + 0.6]} k={entra(t, T.obra + 0.15, 0.45) * m5} />
          <Caixa args={[1.4, 0.5 * entra(t, T.obra + 0.2, 0.5) * m5 + 0.01, 0.25]} raio={0.03} cor={mistura(tema.areia, tema.objeto, 0.4)} position={[0.9, 0.25 * entra(t, T.obra + 0.2, 0.5) * m5, ZM[4] - 0.1]} />
        </group>
      ) : null}

      {/* 6. O mapa */}
      {m6 > 0.02 && perto(ZM[5]) ? (
        <group>
          <PranchetaDistritos tema={tema} pos={[-0.2, 0, ZM[5] - 0.6]} k={m6} tracejado={rampa(t, T.naoExistem, T.naoExistem + 0.8)} bairro={bairro} corta={corta} cores={[F.azul, F.dourado, F.turquesa, F.rosa]} />
          <Lapis tema={tema} pos={lerp3([-0.6, 2.5, ZM[5] - 0.1], [0.6, 1.4, ZM[5] - 0.1], 0.5 + 0.5 * Math.sin((t - T.quemDesenha) * 2.2))} rot={[0.3, 0, 0.5]} escala={lapisK * m6} />
          <Boneco tema={tema} pos={lerp3([-1.7, 0, ZM[5] + 1.0], [1.7, 0, ZM[5] + 1.0], linha)} rotY={Math.PI / 2} escala={0.8 * entra(t, T.politicos, 0.45) * m6} cor={F.turquesa} pose={{passo: andar(t, T.campo - 0.3, T.campo + 0.9), tronco: 0.4, ombroD: [-0.7, 0, 0.1], cotoveloD: -0.2}} />
          <LinhaChao tema={tema} de={[-1.7, 0, ZM[5] + 1.0]} comp={3.4} k={linha * m6} />
        </group>
      ) : null}

      {/* 7. A pressa */}
      {m7 > 0.02 && perto(ZM[6]) ? (
        <group>
          <Caixa args={[0.5, 0.8, 0.5]} raio={0.04} cor={tema.objeto} position={[-1.7, 0.4, ZM[6]]} scale={[1, m7, 1]} />
          <Relogio tema={tema} pos={[-1.7, 1.35, ZM[6]]} escala={0.9 * m7} giro={t > T.votarEste ? (t - T.votarEste) * 5 : 0} cor={tema.objetoEscuro} />
          <FolhaCarimbo tema={tema} pos={[-0.4, 0, ZM[6] + 0.4]} rotY={0.1} escala={1.0 * entra(t, T.apresentado, 0.45) * m7} texto={['PEC', 'TEXTO: ?']} carimbo={0} textoCarimbo="" corCarimbo={tema.objeto} />
          <Jornal tema={tema} pos={[0.9, 0.05, ZM[6] + 0.8]} rotY={-0.3} titulo="SOUBE PELA IMPRENSA" abre={rampa(t, T.novo, T.novo + 0.7)} escala={1.2 * entra(t, T.novo, 0.45) * m7} />
          {/* a mesinha dos empresários, com o relator */}
          <group>
            <Caixa args={[1.8, 0.08, 0.9]} raio={0.03} cor={mistura(tema.areia, tema.objetoEscuro, 0.55)} position={[0.6, 0.78, ZM[6] - 1.1]} scale={entra(t, T.relatorMarcou, 0.45) * m7} />
            {[-0.1, 0.6, 1.3].map((x, i) => (
              <Boneco key={i} tema={tema} pos={[x, 0, ZM[6] - 1.8]} rotY={0} escala={0.66 * entra(t, i === 1 ? T.relatorMarcou : T.empresarios + i * 0.12, 0.45) * m7} cor={i === 1 ? mistura(tema.pessoa, corDir, 0.45) : tema.objetoEscuro} pose={{ombroD: [-0.5, 0, 0.2 * Math.sin(t * 3 + i)], cotoveloD: -0.9}} />
            ))}
            <Cadeira tema={tema} pos={[1.9, 0, ZM[6] - 0.7]} escala={0.75 * entra(t, T.paraVoce, 0.45) * m7} aceso={rampa(t, T.paraVoce, T.paraVoce + 0.4)} />
          </group>
        </group>
      ) : null}

      {/* 8. Saída mais simples */}
      {m8 > 0.02 && perto(ZM[7]) ? (
        <group>
          <MedidorVotos tema={tema} pos={[-0.6, 0, ZM[7]]} escala={1.45 * entra(t, T.m8 + 0.6, 0.5) * m8} valor={ponteiro} marca={0.45 + 0.12 * rampa(t, T.ajustar, T.ajustar + 0.7)} botao={rampa(t, T.ajustar, T.ajustar + 0.7)} titulo="MÍNIMO DE 10%" />
          <LivroLei tema={tema} pos={[1.3, 0.85, ZM[7] + 0.3]} rot={[0, -0.35, 0]} escala={1.3 * entra(t, T.mexer - 0.2, 0.45) * m8} abre={0} capa={1} />
        </group>
      ) : null}

      {/* Final: as duas urnas na frente do Congresso */}
      {fimK > 0.02 ? (
        <group>
          {URNAS_FIM.map((p, i) => (
            <group key={i}>
              <Urna tema={tema} pos={p} rotY={i ? -0.25 : 0.25} escala={0.75 * fimK} />
              <group position={soma(p, [0, 1.1, 0.2])} scale={fimK}>
                <Caixa args={[1.45, 0.3, 0.05]} raio={0.03} cor={i ? tema.objeto : tema.acento} emissivo={0.3} />
                <Placa tema={tema} pos={[0, 0, 0.03]} larg={1.35} alt={0.22} linhas={[{t: i ? 'LISTA DO PARTIDO' : 'SEU DEPUTADO', tam: 140, cor: tema.fundo, peso: 900}]} brilho={0.3} />
              </group>
              {i ? (
                <group position={soma(p, [0.62, 0.95, 0.3])} scale={fimK}>
                  <Cadeado tema={tema} pos={[0, 0, 0]} k={entra(t, T.deixar, 0.4)} fecha={rampa(t, T.deixar + 0.3, T.deixar + 0.6)} />
                </group>
              ) : null}
            </group>
          ))}
          <IconeBalao pos={soma(VOCE_FIM, [0.9, 2.4, 0])} cor={tema.acento} escala={entra(t, T.comentarios, 0.45)} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const cenaMotivo = (i: number): Cena => {
  const m = MOTIVOS[i];
  const prox = i < 7 ? MOTIVOS[i + 1].ini : T.passar;
  const z = ZM[i];
  const lado = i % 2 ? -1 : 1;
  return {
    ini: m.ini - 0.1,
    arco: 0.05,
    chaves: [
      [m.ini - 0.1, E([0, 1.0, z + 1.4], 6.6, 4.4, [0.12 * lado, 0.36, 1])],
      [(m.ini + m.fim) / 2, E([0, 1.0, z + 0.4], 6.0, 4.1, [0.2 * lado, 0.34, 1])],
      [prox - 0.2, E([0, 1.0, z - 0.4], 6.4, 4.3, [0.26 * lado, 0.38, 1])],
    ],
  };
};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1.0, -10], 7.5, 5.2, [0, 1.5, 1])], [T.doisLados, E([0, 1.0, -10], 7.2, 5.0, [0.15, 1.3, 1])], [T.mudarJeito + 0.4, E([0, 1.0, 7.4], 5.4, 3.8, [0.15, 0.5, 1])], [T.tresPassos - 0.2, E([0, 1.2, 7.0], 4.6, 3.4, [0.15, 0.3, 1])]]},
  {ini: T.tresPassos - 0.1, chaves: [[T.tresPassos - 0.1, E([0, 1.0, 5.4], 7.6, 4.2, [0, 0.35, 1])], [T.quemSao + 0.3, E([0, 1.0, 5.2], 7.4, 4.0, [0, 0.33, 1])], [T.oitoMotivos, {pos: [0.6, 3.2, 11], alvo: [0, 0.6, -30], fov: 30, sobe: 60}], [T.hoje, {pos: [0.4, 3.0, 9], alvo: [0, 0.6, -32], fov: 30, sobe: 60}]]},
  {
    ini: T.contaFases - 0.1,
    arco: 0.04,
    chaves: [
      [T.contaFases - 0.1, E([0, 1.0, 3.3], 6.2, 3.8, [0, 0.4, 1])],
      [T.cadaPartido, E([0, 1.0, 3.0], 5.9, 3.6, [0, 0.33, 1])],
      [T.fase2, E([-0.3, 1.0, 3.1], 6.1, 3.8, [-0.08, 0.33, 1])],
      [T.fase3, E([0.3, 1.0, 3.0], 6.0, 3.7, [0.08, 0.33, 1])],
      [T.porIsso - 0.2, E([0.2, 1.0, 3.0], 5.9, 3.6, [0.1, 0.33, 1])],
    ],
  },
  {ini: T.quemTemMuito - 0.1, chaves: [[T.quemTemMuito - 0.1, E([1.4, 1.0, 3.4], 5.4, 3.6, [0.1, 0.32, 1])], [T.segundo - 0.3, E([1.0, 1.0, 3.2], 5.2, 3.4, [0.18, 0.32, 1])]]},
  {ini: T.segundo - 0.1, chaves: [[T.segundo - 0.1, E([0, 1.0, 0.2], 8.4, 5.0, [0, 0.55, 1])], [T.metadeVagas, E([0, 1.0, 0.2], 8.0, 4.8, [0.05, 0.55, 1])]]},
  {
    ini: T.outraMetade - 0.1,
    chaves: [
      [T.outraMetade - 0.1, E([0.4, 1.0, -0.6], 8.4, 5.0, [0, 0.6, 1])],
      [T.lista, E([1.8, 1.2, 0.5], 5.6, 4.2, [0.12, 0.32, 1])],
      [T.votaPartido - 0.2, E([-1.6, 1.0, 1.0], 6.0, 4.0, [-0.05, 0.35, 1])],
      [T.umaPec - 0.2, E([0, 1.0, 1.8], 6.2, 4.0, [0, 0.35, 1])],
      [T.terceiro - 0.2, E([0, 1.0, 1.6], 6.0, 3.9, [0.05, 0.35, 1])],
    ],
  },
  {
    ini: T.terceiro - 0.1,
    arco: 0.04,
    chaves: [
      [T.terceiro - 0.1, E([0, 1.2, -5], 8, 6, [0, 0.7, 1])],
      [T.presidente, E([0, 1.1, -11], 5.6, 4.2, [0, 0.55, 1])],
      [T.centro, E([-1.3, 1.0, -10], 6.6, 4.6, [-0.25, 0.55, 1])],
      [T.kim, E([-2.0, 1.0, -9.6], 6.8, 4.6, [-0.3, 0.5, 1])],
      [T.daEsquerda, E([0.6, 1.0, -10.2], 6.8, 4.6, [0.3, 0.55, 1])],
      [T.eContra - 0.2, E([0.4, 1.0, -10.2], 6.6, 4.5, [0.35, 0.55, 1])],
    ],
  },
  {
    ini: T.eContra - 0.1,
    chaves: [
      [T.eContra - 0.1, E([4.4, 1.0, -10], 4.6, 4.0, [0.5, 0.35, 1])],
      [T.rivais, E([4.2, 1.0, -10], 5.2, 4.2, [0.55, 0.35, 1])],
      [T.esqDir, E([2.0, 1.0, -12], 7, 5, [0.3, 0.45, 1])],
      [T.laDentro, E([0, 1.4, -45], 7, 9, [0, 0.42, 1])],
      [T.m1 - 0.3, E([0, 1.2, -28], 7, 7, [0, 0.4, 1])],
    ],
  },
  ...MOTIVOS.map((_, i) => cenaMotivo(i)),
  {ini: T.passar - 0.1, chaves: [[T.passar - 0.1, E([0, 1.6, -72], 15, 10, [0.15, 0.42, 1])], [T.n49s, E([0, 1.6, -72], 14, 9.5, [0.2, 0.42, 1])], [T.cobrar, E([0, 1.0, -69.4], 5.2, 3.8, [0.05, 0.35, 1])], [T.voceQuer + 0.3, E([0, 1.0, -69.8], 4.8, 3.5, [0, 0.33, 1])], [FIM, E([0, 1.2, -70], 6.2, 4.8, [0, 0.42, 1])]]},
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
type Txt = {a: number; b: number; texto: string; destaque?: boolean; y?: number};
const CHIPS: Txt[] = [
  {a: T.direita, b: T.doisLados, texto: 'DIREITA × ESQUERDA'},
  {a: T.doisLados, b: T.souContra, texto: 'QUEREM MUDAR SEU VOTO'},
  {a: T.souContra, b: T.tresPassos, texto: 'EU SOU CONTRA', destaque: true},
  {a: T.oitoMotivos, b: T.hoje, texto: '8 MOTIVOS PARA DIZER NÃO', destaque: true},
  {a: T.contaFases, b: T.quociente, texto: 'HOJE: TRÊS FASES'},
  {a: T.quociente, b: T.cadaPartido, texto: 'VOTOS VÁLIDOS ÷ VAGAS = QUOCIENTE', destaque: true},
  {a: T.cadaPartido, b: T.dezPor, texto: 'CADA PARTIDO LEVA AS CADEIRAS QUE PAGA'},
  {a: T.dezPor, b: T.fase2, texto: 'FASE 1: CANDIDATO COM PELO MENOS 10%', destaque: true},
  {a: T.sobram, b: T.oitenta, texto: 'SOBRAS: MAIORES MÉDIAS'},
  {a: T.oitenta, b: T.fase3, texto: 'FASE 2: PARTIDO 80% · CANDIDATO 20%', destaque: true},
  {a: T.todos, b: T.porIsso, texto: 'FASE 3: TODOS OS PARTIDOS, SEM MÍNIMO', destaque: true},
  {a: T.levaColegas, b: T.puxador, texto: 'PODE LEVAR COLEGAS JUNTO'},
  {a: T.puxador, b: T.segundo, texto: 'PUXADOR DE VOTOS', destaque: true},
  {a: T.distritalMisto, b: T.metadeVagas, texto: 'VOTO DISTRITAL MISTO', destaque: true},
  {a: T.outraMetade, b: T.lista, texto: 'A OUTRA METADE: LISTA DO PARTIDO'},
  {a: T.ordem, b: T.votaPartido, texto: 'ORDEM DEFINIDA ANTES'},
  {a: T.topo, b: T.umaPec, texto: 'ENTRA QUEM ESTÁ NO TOPO', destaque: true},
  {a: T.umaPec, b: T.terceiro, texto: 'PEC = MUDAR A CONSTITUIÇÃO'},
  {a: T.centro, b: T.relator, texto: 'CENTRO E DIREITA'},
  {a: T.daEsquerda, b: T.eContra, texto: 'DA ESQUERDA'},
  {a: T.fechou, b: T.eContra, texto: 'FECHOU A ARTICULAÇÃO', destaque: true},
  {a: T.eContra, b: T.rivais, texto: 'CONTRA, POR ENQUANTO'},
  {a: T.rivais, b: T.praMim, texto: 'RIVAIS DE SEMPRE, DO MESMO LADO', destaque: true},
  {a: T.esqDir, b: T.laDentro, texto: 'NÃO É ESQUERDA × DIREITA'},
  {a: T.laDentro, b: T.m1, texto: 'QUEM JÁ ESTÁ LÁ DENTRO MEXENDO NA REGRA', destaque: true},
  {a: T.naoEscolhe, b: T.cupula, texto: 'NOMES QUE VOCÊ NÃO ESCOLHE'},
  {a: T.cupula, b: T.valdemar, texto: 'A ORDEM É DA CÚPULA'},
  {a: T.soBom, b: T.m2, texto: '"SÓ É BOM PARA DIRIGENTE PARTIDÁRIO"', destaque: true},
  {a: T.disputaPequena, b: T.maquina, texto: 'DISPUTA PEQUENA'},
  {a: T.maquina, b: T.liderPsol, texto: 'GANHA QUEM TEM A MÁQUINA'},
  {a: T.coronelismo, b: T.m3, texto: 'CORONELISMO E COMPRA DE VOTOS', destaque: true},
  {a: T.fez50 + 0.6, b: T.os49, texto: 'SÓ O MAIS VOTADO LEVA'},
  {a: T.os49, b: T.m4, texto: '49 MIL VOTOS NÃO ELEGEM NINGUÉM', destaque: true},
  {a: T.estadoTodo, b: T.semReduto, texto: 'ELEITORES NO ESTADO TODO'},
  {a: T.semReduto, b: T.mulheres, texto: 'SEM REDUTO, FICA DE FORA', destaque: true},
  {a: T.mulheres, b: T.m5, texto: 'MULHERES · NEGROS · INDÍGENAS'},
  {a: T.obra, b: T.pais, texto: 'SÓ A OBRA DO DISTRITO'},
  {a: T.pais, b: T.m6, texto: 'O PAÍS FICA PARA DEPOIS', destaque: true},
  {a: T.naoExistem, b: T.quemDesenha, texto: 'OS DISTRITOS AINDA NÃO EXISTEM'},
  {a: T.bairro, b: T.cidade, texto: 'JUNTA UM BAIRRO AQUI'},
  {a: T.cidade, b: T.resultado, texto: 'CORTA UMA CIDADE ALI'},
  {a: T.resultado, b: T.politicos, texto: 'ESCOLHE O RESULTADO ANTES', destaque: true},
  {a: T.campo, b: T.m7, texto: 'O JOGADOR MARCANDO O CAMPO', destaque: true},
  {a: T.votarEste, b: T.apresentado, texto: 'QUEREM VOTAR ESTE ANO'},
  {a: T.apresentado, b: T.novo, texto: 'O TEXTO NEM FOI APRESENTADO', destaque: true},
  {a: T.paraVoce, b: T.m8, texto: 'E PARA VOCÊ, QUEM EXPLICOU?', destaque: true},
  {a: T.minimo, b: T.ajustar, texto: 'MÍNIMO DE 10% (FASE UM) · LEI COMUM'},
  {a: T.ajustar, b: T.passar, texto: 'AJUSTA SEM MEXER NA CONSTITUIÇÃO', destaque: true},
  {a: T.cobrar, b: T.voceQuer, texto: 'AINDA DÁ TEMPO DE COBRAR', destaque: true},
  {a: T.voceQuer, b: T.segue, texto: 'SEU DEPUTADO OU A LISTA?', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.hoje + 2.0, b: T.contaFases, texto: 'BAHIA · 39 DEPUTADOS FEDERAIS', y: 470},
  {a: T.cadaPartido, b: T.fase2, texto: 'EXEMPLO · CÓDIGO ELEITORAL, ARTS. 106 A 108'},
  {a: T.fase2, b: T.fase3, texto: 'CÓDIGO ELEITORAL · ART. 109'},
  {a: T.fase3, b: T.porIsso + 0.6, texto: 'STF · ADIs 7228, 7263 E 7325 · 2024'},
  {a: T.distritalMisto, b: T.metadeVagas, texto: 'CONGRESSO EM FOCO E METRÓPOLES · 28 E 31/10/2026'},
  {a: T.metadeVagas + 1.8, b: T.outraMetade, texto: 'CONTA PRÓPRIA: METADE DE 39 ≈ 20', y: 470},
  {a: T.centro + 1.5, b: T.relator, texto: 'REUNIÃO DE 28/10/2026 · GAZETA DO POVO E CONGRESSO EM FOCO'},
  {a: T.relator, b: T.kim, texto: 'RELATOR PREVISTO · METRÓPOLES · 31/10/2026'},
  {a: T.kim, b: T.daEsquerda, texto: 'O ANTAGONISTA · 28/10/2026'},
  {a: T.psb, b: T.eContra, texto: 'GAZETA DO POVO · 28/10/2026'},
  {a: T.pl, b: T.praMim, texto: 'POSIÇÕES ATÉ 07/11/2026 · PODEM MUDAR'},
  {a: T.praMim, b: T.m1, texto: 'OPINIÃO'},
  {a: T.valdemar, b: T.m2, texto: 'VALDEMAR COSTA NETO · A CRÍTICA (MS) · 19/10/2026'},
  {a: T.liderPsol, b: T.m3, texto: 'TARCÍSIO MOTTA (PSOL-RJ) · O ANTAGONISTA'},
  {a: T.imagina, b: T.m4, texto: 'EXEMPLO'},
  {a: T.professora, b: T.m5, texto: 'EXEMPLO'},
  {a: T.bairro, b: T.m7, texto: 'EXEMPLO'},
  {a: T.novo, b: T.relatorMarcou, texto: 'GILSON MARQUES (NOVO-SC) · O ANTAGONISTA'},
  {a: T.relatorMarcou, b: T.m8, texto: 'METRÓPOLES · 04/11/2026'},
  {a: T.minimo, b: T.passar, texto: 'CÓDIGO ELEITORAL · ART. 108 · LEI COMUM'},
  {a: T.n308, b: T.cobrar, texto: 'CONSTITUIÇÃO · ART. 60 · DOIS TURNOS'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '14px 30px 18px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 92, fontWeight: 900, letterSpacing: -4, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.voceVota, b: T.hoje, p: soma(VOCE, [0, 1.75, 0]), texto: 'VOCÊ', acento: true},
  {a: T.votaPartido, b: T.terceiro, p: soma(VOCE_P, [0, 1.75, 0]), texto: 'VOCÊ', acento: true},
  {a: T.cadaPartido + 0.3, b: T.fase2, p: soma(CAD_F[0], [0.6, 1.6, 0]), texto: 'PARTIDO A'},
  {a: T.cadaPartido + 0.5, b: T.fase2, p: soma(CAD_F[3], [0, 1.6, 0]), texto: 'PARTIDO B'},
  {a: T.dezPor + 0.5, b: T.fase2, p: soma(BARREIRA, [0, 1.7, 0.5]), texto: 'MENOS DE 10%: FICA FORA', acento: true, dy: 40},
  {a: T.sobram + 0.2, b: T.medias + 0.4, p: soma(CAD_F[2], [0, 1.2, 0]), texto: 'SOBROU'},
  {a: T.sobram + 0.4, b: T.semMinimo, p: soma(CAD_F[4], [0, 1.2, 0]), texto: 'SOBROU', dy: 60},
  {a: T.vinte, b: T.semMinimo, p: soma(REGUA, [1.6, 1.4, 1.1]), texto: 'PARTIDO C: NÃO ALCANÇOU', dy: -30},
  {a: T.semMinimo + 0.5, b: T.porIsso, p: soma(CAD_F[4], [0, 1.6, 0]), texto: 'PARTIDO C ENTRA', acento: true},
  {a: T.quemTemMuito, b: T.segundo, p: soma(PUX, [0, 2.0, 0]), texto: 'MUITOS VOTOS'},
  {a: T.hugo, b: T.eContra, p: soma(noLugar(A_MOTTA), [0, 1.45, 0]), texto: 'HUGO MOTTA · PRESIDENTE DA CÂMARA', acento: true},
  {a: T.domingos, b: T.eContra, p: soma(DOMINGOS, [0, 1.6, 0]), texto: 'DOMINGOS NETO · RELATOR', dy: 60},
  {a: T.kim, b: T.eContra, p: soma(KIM, [0, 1.6, 0]), texto: 'KIM KATAGUIRI · MISSÃO'},
  {a: T.psb, b: T.eContra, p: soma(noLugar(A_PSB), [0, 1.4, 0]), texto: 'JOÃO CAMPOS · PSB'},
  {a: T.cupula, b: T.m2, p: [1.5, 1.7, ZM[0] - 0.2], texto: 'CÚPULA DO PARTIDO'},
  {a: T.valdemar, b: T.m2, p: [-2.3, 1.6, ZM[0] + 0.6], texto: 'VALDEMAR · PRESIDENTE DO PL', dy: 40},
  {a: T.maquina, b: T.m3, p: [0.8, 2.3, ZM[1] - 0.8], texto: 'DONO DO DISTRITO', acento: true},
  {a: T.prefeito, b: T.m3, p: [-0.9, 1.3, ZM[1] - 1.0], texto: 'PREFEITURA', dy: -40},
  {a: T.fez49 + 0.3, b: T.m4, p: [-0.8, 1.6, ZM[2]], texto: '49 MIL · SEU CANDIDATO'},
  {a: T.fez50 + 0.3, b: T.m4, p: [0.9, 1.7, ZM[2]], texto: '50 MIL', acento: true, dy: 60},
  {a: T.fez50 + 0.6, b: T.m4, p: [0.9, 1.7, ZM[2]], texto: 'ELEITO', acento: true, dy: 120},
  {a: T.professora, b: T.ficaFora + 0.6, p: [1.9, 1.6, ZM[3] + 0.6], texto: 'PROFESSORA', acento: true},
  {a: T.deputadoPassa, b: T.m6, p: [-0.7, 1.9, ZM[4] + 0.2], texto: 'DEPUTADO'},
  {a: T.politicos, b: T.m7, p: [0, 1.5, ZM[5] + 1.0], texto: 'OS PRÓPRIOS POLÍTICOS', dy: -30},
  {a: T.novo, b: T.m8, p: [0.9, 0.7, ZM[6] + 0.8], texto: 'NOVO: SOUBE PELA IMPRENSA', dy: -20},
  {a: T.empresarios, b: T.m8, p: [0.6, 1.5, ZM[6] - 1.8], texto: 'EMPRESÁRIOS · SÃO PAULO'},
  {a: T.paraVoce + 0.2, b: T.m8, p: [1.9, 1.2, ZM[6] - 0.7], texto: 'VOCÊ?', acento: true, dy: -60},
  {a: T.mexer, b: T.passar, p: [1.3, 1.6, ZM[7] + 0.2], texto: 'CONSTITUIÇÃO: NÃO PRECISA MEXER', acento: true},
  {a: T.cobrar + 0.4, b: T.voceQuer, p: soma(VOCE_FIM, [0, 1.8, 0]), texto: 'VOCÊ', acento: true},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const contador = naoFeitos(t);
  const contK = entra(t, T.m1 - 0.3, 0.45) * (1 - rampa(t, T.voceQuer, T.voceQuer + 0.5));
  const placar =
    contK > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.dir, top: 330, opacity: Math.min(1, contK)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 14, background: tema.cartao, border: `2px solid ${contador > 0 ? tema.acento : tema.cartaoBorda}`}}>
          <div style={{fontFamily: FONTE, fontSize: 30, fontWeight: 900, color: tema.acento}}>NÃO</div>
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 800, color: tema.texto}}>{contador}/8</div>
        </div>
      </div>
    ) : null;
  if (noMapa(t)) {
    const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
    return selo ? (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: selo.y ?? 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
        <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: selo.texto.length > 40 ? 16 : 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
      </div>
    ) : null;
  }
  let chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  // as siglas vão se somando num chip só, na hora em que são ditas
  const SIGLAS_DIR: [number, string][] = [[T.uniao, 'UNIÃO'], [T.pp, 'PP'], [T.psd, 'PSD'], [T.mdb, 'MDB'], [T.podemos, 'PODEMOS'], [T.psdb, 'PSDB']];
  const SIGLAS_CONTRA: [number, string][] = [[T.pl, 'PL'], [T.pt, 'PT'], [T.pcdob, 'PCdoB'], [T.psol, 'PSOL']];
  if (t >= T.uniao - 0.05 && t < T.relator) chip = {a: T.uniao, b: T.relator, texto: SIGLAS_DIR.filter(([a]) => t >= a - 0.05).map(([, s]) => s).join(' · ')};
  if (t >= T.pl - 0.05 && t < T.rivais) chip = {a: T.pl, b: T.rivais, texto: 'CONTRA: ' + SIGLAS_CONTRA.filter(([a]) => t >= a - 0.05).map(([, s]) => s).join(' · ')};
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const k308 = entra(t, T.n308, 0.45) * (1 - rampa(t, T.cobrar - 0.3, T.cobrar));
  const n308 = Math.round(308 * rampa(t, T.n308, T.n308 + 1.2));
  const k49 = entra(t, T.n49s, 0.45) * (1 - rampa(t, T.cobrar - 0.3, T.cobrar));
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 190, Math.min(SEGURO.botoesX - 190, x)), top: Math.max(600, Math.min(1180, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 26 ? 23 : 27, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 400 && Math.abs(visRot[a].y - visRot[b].y) < 58) visRot[a].y = visRot[b].y - 62;
  return (
    <>
      {placar}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1040, display: 'flex', justifyContent: 'center', gap: 20}}>
        <Numero tema={tema} valor={`${n308} DE 513`} rotulo="DEPUTADOS · DOIS TURNOS" k={k308} cor={tema.acento} />
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor="49 DE 81" rotulo="SENADORES" k={k49} />
      </div>
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 34 ? 22 : chip.texto.length > 26 ? 26 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: selo.texto.length > 46 ? 14 : selo.texto.length > 36 ? 16 : 19, letterSpacing: 1.5, color: selo.texto === 'OPINIÃO' || selo.texto === 'EXEMPLO' ? tema.acento : tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>DISTRITAL MISTO? NÃO.</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8}}>PARA MAIS INFORMAÇÕES</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira (por cima dos mapas também)
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

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/bahia.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  [T.hoje, T.quemTemMuito, T.metadeVagas, T.outraMetade].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.28}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.16}));
  s.push({t: T.souContra + 0.35, f: 'baque', v: 0.3});
  [T.comoHoje, T.querem, T.quemSao].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  for (let i = 0; i < 8; i++) s.push({t: T.oitoMotivos + i * 0.12, f: 'pop', v: 0.06});
  [T.fase1, T.fase2, T.fase3].forEach((t) => s.push({t, f: 'tique', v: 0.22}));
  s.push({t: T.divididos + 0.3, f: 'whoosh', v: 0.14});
  s.push({t: T.preco, f: 'pop', v: 0.2});
  [0, 1, 3].forEach((i) => s.push({t: T.cadaPartido + 0.2 + i * 0.1, f: 'pop', v: 0.12}));
  s.push({t: T.dezPor, f: 'baque', v: 0.22});
  s.push({t: T.oitenta - 0.3, f: 'pop', v: 0.2});
  s.push({t: T.medias + 1.2, f: 'pop', v: 0.16});
  s.push({t: T.semMinimo, f: 'subida', v: 0.2});
  s.push({t: T.semMinimo + 1.1, f: 'ding', v: 0.2});
  s.push({t: T.levaColegas + 0.4, f: 'baque', v: 0.2});
  s.push({t: T.puxador, f: 'ding', v: 0.2});
  s.push({t: T.distritalMisto, f: 'ding', v: 0.22});
  s.push({t: T.ordem + 0.3, f: 'tique', v: 0.24});
  s.push({t: T.votaPartido + 0.4, f: 'pop', v: 0.22});
  s.push({t: T.umaPec, f: 'pop', v: 0.2});
  [T.hugo, T.uniao, T.pp, T.psd, T.mdb, T.podemos, T.psdb, T.domingos, T.kim, T.psb].forEach((t) => s.push({t, f: 'pop', v: 0.15}));
  s.push({t: T.fechou + 0.4, f: 'ding', v: 0.22});
  [T.pl, T.pt, T.pcdob, T.psol].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  MOTIVOS.forEach((m, i) => s.push({t: m.fim + 0.4, f: i === 7 ? 'ding' : 'baque', v: 0.3}));
  s.push({t: T.naoEscolhe + 0.5, f: 'tique', v: 0.22});
  [0, 1, 2].forEach((i) => s.push({t: T.emenda + i * 0.25 + 0.8, f: 'pop', v: 0.14}));
  s.push({t: T.fez49, f: 'subida', v: 0.2});
  s.push({t: T.fez50, f: 'subida', v: 0.22});
  s.push({t: T.fez50 + 0.6, f: 'ding', v: 0.22});
  [T.mulheres, T.negros, T.indigenas].forEach((t) => s.push({t, f: 'pop', v: 0.14}));
  s.push({t: T.bairro + 0.3, f: 'pop', v: 0.18});
  s.push({t: T.cidade + 0.3, f: 'pop', v: 0.18});
  s.push({t: T.votarEste, f: 'bip', v: 0.16});
  s.push({t: T.novo, f: 'pop', v: 0.16});
  s.push({t: T.n308, f: 'subida', v: 0.26});
  s.push({t: T.deixar + 0.4, f: 'tique', v: 0.24});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.doisLados + 0.4, T.souContra + 0.6, T.oitoMotivos + 0.9, T.hoje + 2.2, T.hoje + 4.8, T.fase1 + 0.6, T.preco + 0.5, T.cadaPartido + 1.2, T.dezPor + 1.4, T.sobram + 0.6, T.vinte + 0.4, T.medias + 1.3, T.semMinimo + 1.3, T.supremo + 0.5,
  T.levaColegas + 0.8, T.distritalMisto + 0.5, T.metadeVagas + 3.5, T.metadeVagas + 6.6, T.outraMetade + 0.8, T.ordem + 0.6, T.votaPartido + 0.8, T.constituicao + 0.6, T.hugo + 0.5, T.psdb + 0.4, T.kim + 0.6, T.fechou + 0.8, T.psol + 0.4, T.rivais + 0.8, T.laDentro + 0.6,
  T.naoEscolhe + 0.6, T.soBom + 0.6, T.maquina + 0.8, T.m2fim + 0.8, T.fez50 + 1.0, T.os49 + 1.0, T.semReduto + 0.8, T.obra + 0.6, T.cidade + 0.7, T.campo + 0.6, T.novo + 0.6, T.paraVoce + 0.6, T.minimo + 0.7, T.mexer + 0.5, T.n308 + 1.3,
  T.voceQuer + 0.8, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const QuemDistrital: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={150} sombraArea={18} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} alvoZ={cam.alvo[2]} />
      <AcabamentoCinema raioAO={0.5} />
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
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Distrital misto" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Esquerda e', 'direita', 'juntas?', 'Contra você.'];
export const CapaQuemDistrital: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · DISTRITAL MISTO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
