import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, Particulas, Placa, Vapor, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, k01, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {Trilha, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Ampulheta, ArcoPontos, Balanca, CalendarioGrande, CanoMoedas, CartaoBeneficio, Chamine, CofreFGTS, Contracheque, DiarioOficial, Engrenagem, EsteiraOitoHoras, Exclama, IconeBalao, IconeSeta, LinhaLimite, Lupa, Quepe, SetasTroca, XMarca} from '../../pecas';
import {
  Arquivo,
  BLOCO,
  BlocoBi,
  Borracha,
  CAMPO,
  CampoFake,
  Canhao,
  CartazFake,
  CartazinhoVoa,
  CaixaOrgao,
  CaixaRemedio,
  CelularFake,
  EstanteOrgaos,
  FolhaPe,
  Galpao,
  Garra,
  Portico,
  Prensa,
  TVVelha,
  TanqueVidro,
  TrilhoAlto,
  bocaCanhao,
  corFake,
  lugarCaixa,
} from './pecas';
import {PALAVRAS} from './palavras';

// 010. fábrica de fake 6 bi (perfil @eumagnoleite, série Magno Explica).
// Mundo único: uma fábrica de brinquedo em corte, com duas alas. À esquerda a FÁBRICA DE FAKE (laranja), com esteira e 4 máquinas;
// atrás dela a planície de celulares (as redes). À direita a CHECAGEM (verde): lupa, blocos de dinheiro, cofre, Diário Oficial,
// tanques e a estante dos órgãos. Nenhum boneco representa político: o nome só aparece escrito no cartaz, como TEXTO DO POST.
// Plano: projetos/010. fábrica de fake 6 bi/plano.md (versão 1, aprovada em 31/10/2026).

export const FPS = 30;
const AUDIO_SEG = 105.41;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '010. fábrica de fake 6 bi';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  fabrica: quando('fabrica'),
  fake: quando('fake news'),
  olha: quando('Olha'),
  trabalha: quando('trabalha'),
  p1: quando('Passo um'),
  pega: quando('pega'),
  velha: quando('reportagem velha'),
  julho: quando('julho'),
  p2: quando('Passo dois'),
  esconde: quando('esconde'),
  data: quando('data'),
  p3: quando('Passo tres'),
  escreve: quando('escreve'),
  grav: quando('Gravissimo'),
  lula: quando('Lula'),
  quase: quando('quase'),
  saude1: quando('Saude e Educacao'),
  p4: quando('Passo quatro'),
  espalha: quando('espalha'),
  essa: quando('Essa passou'),
  mil154: quando('154'),
  compart: quando('compartilhamentos'),
  agora: quando('Agora vamos'),
  desmontar: quando('desmontar'),
  segundo: quando('Segundo a checagem'),
  aosFatos: quando('Aos Fatos'),
  reportagem2: quando('a reportagem e'),
  d31: quando('31'),
  naquela: quando('Naquela'),
  segurou: quando('governo segurou'),
  b15: quando('15'),
  regra: quando('regra fiscal'),
  daSaude: quando('Da Saude'),
  v44: quando('4,4'),
  daEdu: quando('Da Educacao'),
  v13: quando('1,3'),
  somando: quando('Somando'),
  osQuase: quando('os quase'),
  repara: quando('E repara'),
  segurar: quando('segurar'),
  naoCortar: quando('nao e cortar'),
  bloqueio: quando('bloqueio'),
  temporario: quando('temporario'),
  continua: quando('continua'),
  liberado: quando('liberado'),
  aconteceu: quando('E o que aconteceu'),
  semana: quando('nesta semana'),
  diario: quando('Diario Oficial'),
  d28: quando('28'),
  remanejou: quando('remanejou'),
  v52: quando('5,2'),
  quaseTudo: quando('Quase tudo'),
  v47: quando('4,7'),
  bpc: quando('BPC'),
  pessoas: quando('pessoas com'),
  e388: quando('388'),
  remedios: quando('para remedios'),
  deOnde: quando('De onde saiu'),
  vinte: quando('mais de vinte'),
  orgaos: quando('orgaos'),
  umDeles: quando('Um deles'),
  defesa: quando('Defesa'),
  v226: quando('226'),
  v108: quando('108'),
  militares: quando('dos militares da'),
  icl: quando('Segundo o ICL'),
  naoReduz: quando('nao reduz'),
  autorizacao: quando('autorizacao'),
  cancelada: quando('cancelada'),
  segura: quando('Agora segura'),
  senao: quando('senao a fabrica'),
  outraFake: quando('outra fake'),
  naoDa: quando('Nao da'),
  tiraram: quando('tiraram'),
  porSaude: quando('por na Saude'),
  dosRemedios: quando('dos remedios'),
  propria: quando('propria Saude'),
  cedeu: quando('cedeu'),
  outras: quando('outras contas'),
  saldo: quando('No saldo'),
  saudeFicou: quando('a Saude ficou'),
  v62: quando('62'),
  antes: quando('Antes de compartilhar'),
  procura: quando('procura a data'),
  voce: quando('Voce ja'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
  informacoes: quando('informacoes'),
};

const ESTADOS: [number, string][] = [
  [0, 'A FÁBRICA'],
  [T.p1, 'PASSO A PASSO'],
  [T.agora, 'A CHECAGEM'],
  [T.repara, 'NÃO É CORTE'],
  [T.aconteceu, 'O QUE É VERDADE'],
  [T.deOnde, 'DE ONDE SAIU'],
  [T.segura, 'OUTRA FAKE?'],
  [T.antes, 'PROCURE A DATA'],
];

// ---------- Mapa do mundo ----------
const PISO_Y = 0.1;
const FAB: V3 = [-6.5, 0, 0];
const CHEC: V3 = [7, 0, -2.25];
const ESTEIRA_Z = 0.6;
const ESTEIRA_Y = 0.8;
const X_ARQ = -10.3;
const X_BOR = -8.0;
const X_PRE = -5.5;
const X_CAN = -2.6;
const ARQ: V3 = [X_ARQ, PISO_Y, -2.2];
const CANHAO: V3 = [-1.9, PISO_Y, -1.5];
const CAMPO_POS: V3 = [-6, 0, -24];
const MESA_LUPA: V3 = [3, 0, 0.9];
const TV_MESA: V3 = [3, 0.84, 0.9];
const CAL: V3 = [1.3, PISO_Y, -0.9];
const P15: V3 = [5.4, PISO_Y, 1.6];
const SA: V3 = [3.6, PISO_Y, 2.9];
const ED: V3 = [4.6, PISO_Y, 2.9];
const JUNTA: V3 = [6.8, PISO_Y, 3.0];
const COFRE: V3 = [8.7, PISO_Y, 2.0];
const DENTRO: V3 = [8.7, 0.32, 2.3];
const MESA_DIA: V3 = [6.6, 0, -2.6];
const DIARIO_Y = 0.84;
const TQ_BPC: V3 = [10.7, PISO_Y, -2.2];
const TQ_REM: V3 = [9.2, PISO_Y, 0.2];
const ESTANTE: V3 = [7, PISO_Y, -7.2];
const DEF_FRENTE: V3 = [3.6, PISO_Y, -5.0];
const SAU_FRENTE: V3 = [9.0, PISO_Y, -5.1];
const BALANCA: V3 = [4.0, PISO_Y, 3.0];
const CELULAR: V3 = [1.0, 1.25, 2.9];

// Estante dos órgãos (Anexo II da Portaria 485): 22 órgãos, 2 vagas vazias.
const ORGAOS: (string | null)[][] = [
  ['ENC. FINANC.', 'ENC. PREVID.', 'TRANSFER.', 'OP. CRÉDITO', 'BANCO CENTR.', 'INDÍGENAS', null, null],
  ['CULTURA', 'PLANEJAM.', 'DEFESA', 'AGRÁRIO', 'INTEGRAÇÃO', 'SAÚDE', 'DES. SOCIAL', 'CIDADES'],
  ['PRESIDÊNCIA', 'AGRICULTURA', 'FAZENDA', 'EDUCAÇÃO', 'JUSTIÇA', 'ENERGIA', 'EXTERIORES', 'TRABALHO'],
];
const CAIXAS = ORGAOS.flatMap((linha, lin) => linha.map((nome, col) => ({nome, col, lin}))).filter((c) => c.nome) as {nome: string; col: number; lin: number}[];
const DEF = CAIXAS.find((c) => c.nome === 'DEFESA')!;
const SAU = CAIXAS.find((c) => c.nome === 'SAÚDE')!;
const PONTA_DIARIO: V3 = [6.6, 1.0, -3.7];

// ---------- Ajudantes ----------
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
// Trecho percorrido: 0 antes de a, sobe até dist em d segundos.
const anda = (t: number, a: number, d: number, dist: number) => dist * rampa(t, a, a + d);

// Onde está a TV (base) em cada momento.
const tvPos = (t: number): V3 => {
  const naPrateleira: V3 = [X_ARQ, PISO_Y + 1.53, ARQ[2]];
  const noAlto: V3 = [X_ARQ, 2.6, ARQ[2]];
  const naEsteira: V3 = [X_ARQ, ESTEIRA_Y, ESTEIRA_Z];
  if (t < T.velha) return naPrateleira;
  if (t < T.velha + 0.4) return lerp3(naPrateleira, noAlto, rampa(t, T.velha, T.velha + 0.4));
  if (t < T.julho - 0.2) return lerp3(lerp3(noAlto, [X_ARQ, 2.6, ESTEIRA_Z], rampa(t, T.velha + 0.4, T.velha + 0.8)), naEsteira, rampa(t, T.velha + 0.8, T.julho - 0.2));
  if (t < T.desmontar) {
    const x = X_ARQ + anda(t, T.p2, 0.8, X_BOR - X_ARQ) + anda(t, T.p3, 0.8, X_PRE - X_BOR) + anda(t, T.p4, 0.8, X_CAN - X_PRE);
    return [x, ESTEIRA_Y, ESTEIRA_Z];
  }
  return curva([X_CAN, ESTEIRA_Y, ESTEIRA_Z], TV_MESA, 1.6, rampa(t, T.desmontar, T.desmontar + 1.4));
};
const descendo = (t: number, a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b, b + 0.4));

// Avanço da esteira (para as ripas) e giro das engrenagens.
const andaEsteira = (t: number) =>
  100 +
  0.4 * Math.max(0, Math.min(t, T.agora) - T.olha) +
  anda(t, T.p2, 0.8, 2.3) +
  anda(t, T.p3, 0.8, 2.5) +
  anda(t, T.p4, 0.8, 2.9) -
  anda(t, T.desmontar, 1.6, 3.2) +
  0.5 * Math.max(0, Math.min(t, T.naoDa) - T.senao);
const ligada = (t: number) => rampa(t, T.fake, T.fake + 0.6) * (1 - rampa(t, T.agora, T.agora + 1.0)) + rampa(t, T.senao, T.senao + 0.5) * (1 - rampa(t, T.naoDa, T.naoDa + 0.6));
const giroEng = (t: number) => {
  let g = 0;
  const passo = 1 / 30;
  for (let s = 0; s < t; s += passo) g += ligada(s) * passo * 1.6;
  return g;
};
const GIRO = (() => {
  const out: number[] = [];
  let g = 0;
  for (let q = 0; q <= Math.ceil(FIM * 30) + 2; q++) {
    out.push(g);
    g += (ligada(q / 30) * 1.6) / 30;
  }
  return out;
})();
const giroEm = (t: number) => GIRO[Math.max(0, Math.min(GIRO.length - 1, Math.round(t * 30)))] ?? giroEng(t);

// Os 15 blocos (R$ 15 bi): colunas A, B e C; Saúde leva 4,4 do topo de A; Educação leva 1,3 do topo de B.
type Peca = {id: string; de: V3; h: number; para?: V3; ida?: number; junta?: V3; grupo?: 'saude' | 'edu'};
const colX = (c: number) => P15[0] + (c - 1) * 0.52;
const yBloco = (i: number) => PISO_Y + i * BLOCO.a;
const PECAS: Peca[] = (() => {
  const out: Peca[] = [];
  // Coluna A: a0 fica com 0,6 embaixo; 0,4 de cima + a1..a4 vão para a Saúde.
  out.push({id: 'a0r', de: [colX(0), yBloco(0), P15[2]], h: 0.6});
  out.push({id: 'a0s', de: [colX(0), yBloco(0) + 0.6 * BLOCO.a, P15[2]], h: 0.4, para: [SA[0], SA[1] + 4 * BLOCO.a, SA[2]], ida: 0.25, junta: [JUNTA[0] - 0.27, PISO_Y + 4 * BLOCO.a, JUNTA[2]], grupo: 'saude'});
  for (let i = 1; i <= 4; i++) out.push({id: `a${i}`, de: [colX(0), yBloco(i), P15[2]], h: 1, para: [SA[0], SA[1] + (i - 1) * BLOCO.a, SA[2]], ida: 0.05 * (4 - i), junta: [JUNTA[0] - 0.27, PISO_Y + (i - 1) * BLOCO.a, JUNTA[2]], grupo: 'saude'});
  // Coluna B: b0..b2 ficam; b3 fica com 0,7; 0,3 de cima + b4 vão para a Educação.
  for (let i = 0; i <= 2; i++) out.push({id: `b${i}`, de: [colX(1), yBloco(i), P15[2]], h: 1});
  out.push({id: 'b3r', de: [colX(1), yBloco(3), P15[2]], h: 0.7});
  out.push({id: 'b3s', de: [colX(1), yBloco(3) + 0.7 * BLOCO.a, P15[2]], h: 0.3, para: [ED[0], ED[1] + BLOCO.a, ED[2]], ida: 0.15, junta: [JUNTA[0] + 0.27, PISO_Y + BLOCO.a, JUNTA[2]], grupo: 'edu'});
  out.push({id: 'b4', de: [colX(1), yBloco(4), P15[2]], h: 1, para: [ED[0], ED[1], ED[2]], ida: 0, junta: [JUNTA[0] + 0.27, PISO_Y, JUNTA[2]], grupo: 'edu'});
  for (let i = 0; i <= 4; i++) out.push({id: `c${i}`, de: [colX(2), yBloco(i), P15[2]], h: 1});
  return out;
})();
const ORDEM_NASCE = ['a0r', 'b0', 'c0', 'a0s', 'a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3r', 'b3s', 'c3', 'a4', 'b4', 'c4'];
const nasceBloco = (id: string) => {
  // a0r/a0s e b3r/b3s nascem juntos (são um bloco só)
  const base = id === 'a0s' ? 'a0r' : id === 'b3s' ? 'b3r' : id;
  const lista = ORDEM_NASCE.filter((x) => x !== 'a0s' && x !== 'b3s');
  return T.segurou + 0.08 * lista.indexOf(base);
};
const blocoPos = (pc: Peca, t: number): {pos: V3; esc: number} => {
  let p = pc.de;
  let esc = 1;
  if (pc.para && pc.grupo) {
    const a = (pc.grupo === 'saude' ? T.daSaude : T.daEdu) + (pc.ida ?? 0);
    p = curva(pc.de, pc.para, 0.5, rampa(t, a, a + 0.7));
    if (pc.junta) p = curva(p, pc.junta, 0.6, rampa(t, T.somando + (pc.grupo === 'edu' ? 0.1 : 0), T.somando + 0.8));
    // Entram no cofre
    const off: V3 = [pc.junta![0] - JUNTA[0], pc.junta![1] - PISO_Y, 0];
    const dentro: V3 = [DENTRO[0] + off[0] * 0.7, DENTRO[1] + off[1] * 0.7, DENTRO[2]];
    const k = rampa(t, T.bloqueio - 0.1, T.bloqueio + 0.6);
    p = curva(p, dentro, 0.4, k);
    esc = 1 - 0.3 * k;
  } else {
    // O resto do orçamento sai de cena
    esc = 1 - rampa(t, T.repara, T.repara + 0.6);
  }
  return {pos: p, esc};
};

// Cópias voando do canhão para a planície.
const ALVOS = [12, 40, 77, 100, 140, 170, 200, 230, 260, 300, 330, 360].map((i) => CAMPO[i % CAMPO.length]);
const BOCA = bocaCanhao(CANHAO);

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const laranja = corFake(tema);
  const lig = ligada(t);
  const luzFab = 0.35 + 0.65 * Math.max(lig, janela(t, T.fabrica, T.agora, 0.5)) - 0.35 * rampa(t, T.segue, T.segue + 1.0);
  const luzChec = rampa(t, T.agora, T.agora + 0.8);
  const giro = giroEm(t);
  const afunda = 2.3 * janela(t, T.deOnde + 0.4, T.segura - 0.6, 0.6);
  const tv0 = tvPos(t);
  const tv: V3 = t > T.desmontar + 1.4 ? [tv0[0], tv0[1] - afunda, tv0[2]] : tv0;
  const placaAcesa = (i: number) => {
    const marcos = [T.p1, T.p2, T.p3, T.p4];
    const fim = i < 3 ? marcos[i + 1] : T.agora;
    return Math.max(0.3 * rampa(t, T.trabalha + i * 0.15, T.trabalha + i * 0.15 + 0.3), janela(t, marcos[i], fim, 0.3)) * (1 - rampa(t, T.agora, T.agora + 0.6));
  };

  // Garra
  const garraDesce = rampa(t, T.pega, T.pega + 0.34) * (1 - rampa(t, T.velha, T.velha + 0.4)) + rampa(t, T.velha + 0.8, T.julho - 0.2) * (1 - rampa(t, T.julho, T.julho + 0.4));
  const garraZ = ARQ[2] + (ESTEIRA_Z - ARQ[2]) * rampa(t, T.velha + 0.4, T.velha + 0.8) * (1 - rampa(t, T.julho + 0.3, T.julho + 1.2));
  const garraBaixo = garraZ > 0 ? ESTEIRA_Y + 0.85 : PISO_Y + 1.53 + 0.85;

  // Borracha
  const borrY = 3.0 - 2.0 * descendo(t, T.esconde, T.data + 0.4);
  const borrVai = 0.18 * Math.sin((t - T.esconde) * 9) * janela(t, T.esconde + 0.3, T.data + 0.3, 0.2);
  const dataVis = 1 - rampa(t, T.data, T.data + 0.5) + rampa(t, T.reportagem2, T.d31 + 0.1);
  const verde = rampa(t, T.d31 - 0.1, T.d31 + 0.3);

  // Prensa: carimba o título e, na virada, trava no meio.
  const preDesce = Math.max(descendo(t, T.escreve, T.grav - 0.35), descendo(t, T.senao + 0.3, T.outraFake - 0.1), 0.5 * rampa(t, T.naoDa, T.naoDa + 0.35) * (1 - rampa(t, T.dosRemedios, T.dosRemedios + 0.8)));
  const cartazSobe = rampa(t, T.grav - 0.1, T.grav + 0.45, sai);
  const cartazLinhas = rampa(t, T.grav, T.grav + 0.35) + rampa(t, T.lula, T.lula + 0.4) + rampa(t, T.quase, T.quase + 0.4) + rampa(t, T.saude1, T.saude1 + 0.4);
  const cinza1 = rampa(t, T.d31, T.d31 + 0.6) * (1 - rampa(t, T.antes, T.antes + 0.6) * 0);
  const cart2 = rampa(t, T.outraFake - 0.05, T.outraFake + 0.4);
  const cart2Linhas = Math.min(1.5, 1.5 * rampa(t, T.outraFake, T.naoDa + 0.2));
  const cinza2 = rampa(t, T.naoDa, T.naoDa + 0.6);
  const cart2Some = 1 - rampa(t, T.antes, T.antes + 0.6);

  // Canhão e planície
  const recuo = pulso(t, T.espalha, 0.5);
  const luzCampo = (c: {d: number}) => rampa(t, T.essa + c.d * 0.05, T.essa + c.d * 0.05 + 0.5) * (1 - 0.7 * rampa(t, T.desmontar, T.aosFatos + 0.5));

  // Lupa
  const lupaK = entra(t, T.aosFatos, 0.5) * (1 - rampa(t, T.repara, T.repara + 0.5)) + entra(t, T.segura, 0.5) * (1 - rampa(t, T.dosRemedios, T.dosRemedios + 0.5)) + entra(t, T.antes, 0.5);
  const lupaSobreTV: V3 = [TV_MESA[0] - 0.08, TV_MESA[1] + 0.21, TV_MESA[2] + 0.85];
  const lupaAlto: V3 = [TV_MESA[0], 3.6, TV_MESA[2] + 0.9];
  const lupaPrensa: V3 = [X_PRE + 1.75, 2.3, ESTEIRA_Z + 1.0];
  let lupaPos: V3 = lerp3(lupaAlto, lupaSobreTV, rampa(t, T.aosFatos, T.reportagem2, sai));
  let lupaEsc = 1.0;
  if (t > T.segura - 0.1 && t < T.antes) {
    lupaPos = curva([TV_MESA[0], 2.6, TV_MESA[2] + 0.9], lupaPrensa, 1.4, rampa(t, T.outraFake - 0.3, T.naoDa + 0.1));
    lupaEsc = 1.0 + 0.8 * rampa(t, T.outraFake - 0.3, T.naoDa + 0.1);
  }
  if (t >= T.antes) lupaPos = lerp3([TV_MESA[0] + 0.6, 2.4, TV_MESA[2] + 1.2], lupaSobreTV, rampa(t, T.antes + 0.2, T.procura, sai));

  // Blocos e cofre
  const regra = rampa(t, T.regra, T.regra + 0.8);
  const cofreK = entra(t, T.segurar, 0.5) * (1 - rampa(t, T.aconteceu + 0.6, T.aconteceu + 1.2));
  const cofreAbre = Math.max(0.9 * janela(t, T.segurar + 0.2, T.bloqueio + 0.5, 0.4), 0.5 * rampa(t, T.continua, T.continua + 0.5), 0.75 * rampa(t, T.liberado, T.liberado + 0.5));
  const trava = rampa(t, T.bloqueio + 0.7, T.bloqueio + 0.9) * (1 - rampa(t, T.liberado - 0.1, T.liberado + 0.2));
  const blocosK = 1 - rampa(t, T.aconteceu + 0.6, T.aconteceu + 1.2);

  // Diário, tanques, estante
  const diarioK = rampa(t, T.diario - 0.1, T.diario + 0.6, sai);
  const portaria = entra(t, T.d28, 0.5) * (1 - rampa(t, T.deOnde, T.deOnde + 0.5));
  const setas = entra(t, T.remanejou, 0.45) * (1 - rampa(t, T.quaseTudo, T.quaseTudo + 0.4));
  const canoBPC = rampa(t, T.quaseTudo, T.quaseTudo + 0.6);
  const canoREM = rampa(t, T.e388 - 0.3, T.e388 + 0.3);
  const nivelBPC = 0.91 * rampa(t, T.v47, T.v47 + 2.2);
  const nivelREM = 0.8 * rampa(t, T.e388, T.e388 + 1.6);
  const estK = rampa(t, T.deOnde - 0.2, T.deOnde + 0.6, sai);
  const placaBPC = rampa(t, T.bpc, T.bpc + 0.4);
  const placaREM = rampa(t, T.remedios, T.remedios + 0.4);

  // Defesa e Saúde saindo da estante
  const defSai = rampa(t, T.defesa, T.defesa + 0.8) * (1 - rampa(t, T.antes, T.antes + 0.9));
  const defPos = curva(lugarCaixa(ESTANTE, DEF.col, DEF.lin), DEF_FRENTE, 0.7, defSai);
  const defMeio = rampa(t, T.v108, T.v108 + 0.5);
  const sauSai = rampa(t, T.propria, T.propria + 0.8) * (1 - rampa(t, T.antes, T.antes + 0.9));
  const sauPos = curva(lugarCaixa(ESTANTE, SAU.col, SAU.lin), SAU_FRENTE, 0.7, sauSai);
  const militares = entra(t, T.militares, 0.5) * (1 - rampa(t, T.antes, T.antes + 0.5));
  const cheque = entra(t, T.naoReduz, 0.5) * (1 - rampa(t, T.antes, T.antes + 0.5));
  const folha = entra(t, T.autorizacao, 0.5) * (1 - rampa(t, T.antes, T.antes + 0.5));
  const carimbo = rampa(t, T.cancelada - 0.25, T.cancelada + 0.15);
  const arcoDS = rampa(t, T.tiraram, T.tiraram + 0.9) * 0.5 * (1 - rampa(t, T.dosRemedios, T.dosRemedios + 0.6));
  const xK = entra(t, T.porSaude, 0.45) * (1 - rampa(t, T.dosRemedios, T.dosRemedios + 0.6));
  const caboSau = rampa(t, T.cedeu, T.cedeu + 0.8) * (1 - rampa(t, T.antes, T.antes + 0.5));
  const balK = entra(t, T.saldo, 0.5) * (1 - rampa(t, T.antes + 0.4, T.antes + 1.0));
  const balInc = -0.9 * rampa(t, T.saudeFicou, T.saudeFicou + 0.9, sai);
  const celK = entra(t, T.voce, 0.5);
  const celCarimbo = rampa(t, T.voce + 0.5, T.voce + 0.9);

  return (
    <group>
      {/* ===== Ala da fábrica ===== */}
      <Galpao tema={tema} pos={FAB} larg={11} prof={8} altFundo={5} altLado={2.5} cor={tom(tema.chao, -0.12)} corParede={mistura(tema.objetoEscuro, laranja, 0.06 * luzFab)} />
      <group position={[FAB[0], 4.3, -3.7]}>
        <Caixa args={[7.4, 0.95, 0.08]} raio={0.04} cor={mistura(tema.objetoEscuro, laranja, 0.75 * luzFab)} emissivo={0.45 * luzFab} />
        <Placa tema={tema} pos={[0, 0, 0.045]} larg={7.0} alt={0.75} linhas={[{t: 'FÁBRICA DE FAKE', tam: 140, cor: tema.fundo, peso: 900}]} brilho={0.3} />
      </group>
      <Chamine tema={tema} pos={[-10.6, 0, -5.8]} alt={9} sobe={1} />
      {lig > 0.05 || luzFab > 0.6 ? <Vapor pos={[-9.8, 9.1, -6.2]} t={t} cor={tema.objeto} escala={1.6 * Math.max(0.3, lig)} n={7} /> : null}
      {[
        [-9.4, 2.3, 0.9],
        [-7.7, 3.3, 0.6],
        [-3.6, 2.6, 0.75],
      ].map(([x, y, r], i) => (
        <Engrenagem key={i} tema={tema} pos={[x, y, -3.62]} r={r} giro={(i % 2 ? -1 : 1) * giro * (0.9 / r)} cor={mistura(tema.objeto, laranja, 0.2 * luzFab)} />
      ))}
      <EsteiraOitoHoras tema={tema} pos={[FAB[0], PISO_Y, ESTEIRA_Z]} comp={10} anda={andaEsteira(t)} />
      <Arquivo tema={tema} pos={ARQ} />
      <TrilhoAlto tema={tema} x={X_ARQ} y={3.4} z0={ARQ[2]} z1={ESTEIRA_Z} />
      <Garra tema={tema} pos={[X_ARQ, garraBaixo, garraZ]} topo={2.9} desce={garraDesce} fecha={rampa(t, T.pega + 0.3, T.pega + 0.5) * (1 - rampa(t, T.julho - 0.3, T.julho))} />
      {[X_ARQ, X_BOR, X_PRE, X_CAN].map((x, i) => (
        <Portico key={i} tema={tema} pos={[x, PISO_Y, ESTEIRA_Z]} larg={1.7} alt={i === 2 ? 4.0 : 3.3} numero={String(i + 1)} aceso={placaAcesa(i)} luz={laranja} />
      ))}
      <Borracha tema={tema} pos={[X_BOR - 0.08, 0, ESTEIRA_Z + 0.55]} y={borrY} vai={borrVai} luz={laranja} aceso={placaAcesa(1)} />
      <Prensa tema={tema} pos={[X_PRE, 0, ESTEIRA_Z]} topo={3.3} baixo={ESTEIRA_Y + 0.95} desce={preDesce} luz={laranja} aceso={Math.max(placaAcesa(2), cart2 * (1 - cinza2))} />
      <Canhao tema={tema} pos={CANHAO} recuo={recuo} luz={laranja} aceso={placaAcesa(3)} />
      {/* Operários (cinza, sem rosto) */}
      {[
        [-9.0, -1.4, 0.25],
        [-6.8, -1.5, 0],
        [-4.3, -1.4, -0.2],
      ].map(([x, z, r], i) => (
        <Boneco key={i} tema={tema} pos={[x, PISO_Y, z]} rotY={r} escala={0.72} cor={tema.pessoa} pose={{cabeca: [0.25, 0, 0], ombroD: [-0.4, 0, 0.05], cotoveloD: -0.6, tronco: 0.08}} />
      ))}

      {/* A TV, a data e o cartaz da fake */}
      <TVVelha tema={tema} pos={tv} data={k01(dataVis)} verde={verde} brilhoData={pulso(t, T.procura, 1.0)} />
      {t > T.julho - 0.1 && t < T.julho + 1.2 ? <Particulas t={t} centro={soma(tv, [0, 0.6, 0])} raio={0.8} n={14} opacidade={0.35 * janela(t, T.julho - 0.1, T.julho + 0.6, 0.3)} /> : null}
      <CartazFake tema={tema} pos={soma(tv, [0, 0.95, -0.1])} escala={(0.75 - 0.3 * rampa(t, T.desmontar, T.desmontar + 1.2)) * (1 - rampa(t, T.segurou, T.segurou + 0.6))} textos={['GRAVÍSSIMO!', 'LULA ACABA DE CORTAR', 'QUASE R$ 6 BILHÕES', 'DA SAÚDE E EDUCAÇÃO']} linhas={cartazLinhas} sobe={cartazSobe} cinza={cinza1} />
      <Exclama tema={tema} pos={soma(tv, [1.15, 1.75 + 0.15 * Math.abs(Math.sin((t - T.grav) * 5)), -0.1])} escala={1.4 * entra(t, T.grav, 0.45) * (1 - rampa(t, T.desmontar, T.desmontar + 0.4))} />
      <CartazFake tema={tema} pos={[X_PRE, ESTEIRA_Y, ESTEIRA_Z]} escala={0.75 * cart2Some} textos={['TIRARAM DOS', 'MILITARES', 'PRA SAÚDE']} linhas={cart2Linhas} sobe={cart2} cinza={cinza2} rotulo="A PRÓXIMA FAKE?" />

      {/* Cópias voando e a planície de celulares */}
      {ALVOS.map((c, i) => {
        const a = T.espalha + i * 0.08;
        const s = rampa(t, a, a + 1.1);
        if (s <= 0 || s >= 1) return null;
        const alvo: V3 = [CAMPO_POS[0] + c.x, 0.3, CAMPO_POS[2] + c.z];
        return <CartazinhoVoa key={i} tema={tema} pos={curva(BOCA, alvo, 5, s)} rot={[0.4 + s * 2, i * 0.7 + s * 3, 0.3]} escala={1.1 - 0.3 * s} />;
      })}
      <CampoFake tema={tema} pos={CAMPO_POS} luz={luzCampo} cor={laranja} />
      {[30, 95, 160, 220, 290, 350].map((idx, i) => {
        const c = CAMPO[idx % CAMPO.length];
        const k = rampa(t, T.compart + i * 0.1, T.compart + i * 0.1 + 0.4) * (1 - rampa(t, T.agora, T.agora + 0.5));
        if (k < 0.02) return null;
        return <IconeSeta key={i} pos={[CAMPO_POS[0] + c.x, 0.6 + 1.6 * rampa(t, T.compart + i * 0.1, T.compart + 2.2), CAMPO_POS[2] + c.z]} cor={laranja} escala={1.3 * k} t={t} />;
      })}

      {/* ===== Ala da checagem ===== */}
      <Galpao tema={tema} pos={CHEC} larg={13} prof={12.5} altFundo={1.0} altLado={0.7} cor={mistura(tom(tema.chao, 0.1), tema.acento, 0.06 * luzChec)} corParede={mistura(tema.objetoEscuro, tema.objeto, 0.3)} faixa={tema.acento} kFaixa={luzChec} />
      {/* Mesa da lupa */}
      <group position={[MESA_LUPA[0], MESA_LUPA[1] - afunda, MESA_LUPA[2]]}>
        <Caixa args={[1.9, 0.08, 1.4]} raio={0.03} cor={tema.objeto} position={[0, 0.8, 0]} />
        {[
          [-0.8, -0.55],
          [0.8, -0.55],
          [-0.8, 0.55],
          [0.8, 0.55],
        ].map(([x, z], i) => (
          <Caixa key={i} args={[0.08, 0.76, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.38, z]} />
        ))}
      </group>
      <Lupa tema={tema} pos={lupaPos} rot={[0, 0, 0.12]} escala={lupaEsc * Math.min(1.1, lupaK)} />
      <CalendarioGrande tema={tema} pos={CAL} rotY={0.4} escala={0.85 * entra(t, T.naquela, 0.5) * (1 - rampa(t, T.deOnde, T.deOnde + 0.5))} texto={t < T.semana + 0.35 ? 'JUL 2024' : 'OUT 2026'} folha={rampa(t, T.semana, T.semana + 0.7)} destaque={pulso(t, T.semana + 0.4, 0.8)} />

      {/* Blocos (R$ 1 bi cada), linha da regra fiscal e cofre */}
      {blocosK > 0.02
        ? PECAS.map((pc) => {
            const n = rampa(t, nasceBloco(pc.id), nasceBloco(pc.id) + 0.25);
            if (n < 0.02) return null;
            const {pos, esc} = blocoPos(pc, t);
            const destaque = pc.grupo ? rampa(t, (pc.grupo === 'saude' ? T.daSaude : T.daEdu) + 0.2, (pc.grupo === 'saude' ? T.daSaude : T.daEdu) + 0.6) : 0;
            const e = esc * blocosK;
            return (
              <group key={pc.id} position={pos} scale={[e, e * n, e]}>
                <BlocoBi tema={tema} pos={[0, 0, 0]} h={pc.h} brilho={destaque * (1 - rampa(t, T.bloqueio, T.bloqueio + 0.6)) + 0.9 * (pc.grupo ? rampa(t, T.continua, T.continua + 0.5) : 0)} />
              </group>
            );
          })
        : null}
      <LinhaLimite tema={tema} x0={P15[0] - 1.0} x1={P15[0] + 1.0} z0={P15[2] - 0.65} z1={P15[2] + 0.65} k={regra} vida={1 - rampa(t, T.somando, T.somando + 0.5)} />
      {cofreK > 0.02 ? (
        <group position={COFRE} scale={0.85 * cofreK}>
          <CofreFGTS tema={tema} pos={[0, 0, 0]} abre={cofreAbre} trava={trava} brilho={pulso(t, T.liberado, 0.9)} />
          <Ampulheta tema={tema} pos={[0.6, 2.0, 0]} escala={1.6 * entra(t, T.temporario, 0.45)} areia={1 - rampa(t, T.temporario, T.aconteceu)} />
          <group position={[0, 2.35, 0.3]}>
            <Caixa args={[2.3, 0.36, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0, -0.02]} />
            {rampa(t, T.bloqueio, T.bloqueio + 0.4) > 0.02 ? <Placa tema={tema} pos={[0, 0, 0.02]} larg={2.2 * rampa(t, T.bloqueio, T.bloqueio + 0.4)} alt={0.28} linhas={[{t: 'BLOQUEIO TEMPORÁRIO', tam: 100, cor: tema.objetoClaro, peso: 900, mono: true}]} brilho={0.3} /> : null}
          </group>
        </group>
      ) : null}

      {/* Diário Oficial na mesa */}
      <group position={MESA_DIA}>
        <Caixa args={[2.8, 0.08, 3.5]} raio={0.03} cor={tema.objeto} position={[0, 0.8, 0]} />
        {[
          [-1.25, -1.6],
          [1.25, -1.6],
          [-1.25, 1.6],
          [1.25, 1.6],
        ].map(([x, z], i) => (
          <Caixa key={i} args={[0.1, 0.76, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.38, z]} />
        ))}
      </group>
      <DiarioOficial tema={tema} pos={[MESA_DIA[0], DIARIO_Y + 2.6 * (1 - diarioK), MESA_DIA[2]]} rot={[0, 0.05, 0]} escala={2.4 * Math.min(1, diarioK * 1.5)} destaque={0.4 * diarioK} />
      {portaria > 0.02 ? (
        <group position={[MESA_DIA[0], 0.84 + 0.75 * Math.min(1, portaria), MESA_DIA[2] - 1.55]} scale={Math.min(1.05, portaria)}>
          <Caixa args={[0.06, 0.8, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, -0.4, -0.04]} />
          <Caixa args={[2.5, 0.72, 0.07]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.2, -0.03]} />
          <Placa tema={tema} pos={[0, 0.2, 0.01]} larg={2.36} alt={0.6} linhas={[{t: 'PORTARIA Nº 485', tam: 105, cor: tema.objetoClaro, peso: 900}, {t: '28/10/2026', tam: 100, cor: tema.acento, peso: 900, mono: true}]} brilho={0.3} />
        </group>
      ) : null}
      <SetasTroca tema={tema} pos={[MESA_DIA[0], 2.3, MESA_DIA[2] - 1.5]} escala={0.7 * setas} giro={-(t - T.remanejou) * 3} />
      <CanoMoedas tema={tema} pontos={[[7.8, 0.95, -2.3], [8.9, 2.6, -2.4], [10.0, 3.55, -2.3], [10.7, 3.45, -2.2]]} k={canoBPC} fluxo={(t - T.quaseTudo) * 0.45} n={12} brilho={0.3 * janela(t, T.quaseTudo, T.bpc + 1, 0.4)} />
      <CanoMoedas tema={tema} pontos={[[7.6, 0.95, -1.2], [8.4, 1.9, -0.4], [9.0, 2.0, 0.1], [9.2, 1.75, 0.2]]} k={canoREM} fluxo={(t - T.e388) * 0.45} n={8} brilho={0.3 * janela(t, T.e388, T.remedios + 1, 0.4)} />
      <TanqueVidro tema={tema} pos={TQ_BPC} r={0.85} alt={3.0} nivel={nivelBPC} cor={tema.acento} escala={rampa(t, T.quaseTudo - 0.4, T.quaseTudo + 0.2, sai)} />
      <TanqueVidro tema={tema} pos={TQ_REM} r={0.5} alt={1.4} nivel={nivelREM} cor={mistura(tema.acento, tema.objetoClaro, 0.35)} escala={rampa(t, T.e388 - 0.6, T.e388, sai)} />
      {placaBPC > 0.02 ? (
        <group position={[TQ_BPC[0], 3.95, TQ_BPC[2]]} scale={placaBPC}>
          <Caixa args={[1.3, 0.5, 0.07]} raio={0.04} cor={tema.acento} emissivo={0.3} position={[0, 0, -0.03]} />
          <Placa tema={tema} pos={[0, 0, 0.012]} larg={1.2} alt={0.42} linhas={[{t: 'BPC', tam: 380, cor: tema.fundo, peso: 900}]} brilho={0.3} />
        </group>
      ) : null}
      {placaREM > 0.02 ? (
        <group position={[TQ_REM[0], 2.15, TQ_REM[2]]} scale={placaREM}>
          <Caixa args={[1.4, 0.5, 0.07]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0, -0.03]} />
          <Placa tema={tema} pos={[0, 0, 0.012]} larg={1.3} alt={0.42} linhas={[{t: 'REMÉDIOS', tam: 180, cor: tema.objetoClaro, peso: 900}, {t: 'SUS', tam: 150, cor: tema.acento, peso: 900}]} brilho={0.3} />
        </group>
      ) : null}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = T.remedios + i * 0.12;
        const s = rampa(t, a, a + 0.6);
        if (s < 0.02) return null;
        const de: V3 = [TQ_REM[0] + (i % 2 ? 0.25 : -0.25), 3.0, TQ_REM[2] + 0.1];
        const ate: V3 = [TQ_REM[0] + (i % 3 - 1) * 0.18, 0.4 + 0.12 * i, TQ_REM[2]];
        return <CaixaRemedio key={i} tema={tema} pos={lerp3(de, ate, s)} rot={[0.3 * i, i, 0.2]} escala={1} />;
      })}
      <CartaoBeneficio tema={tema} pos={[12.0, 1.35, -0.6]} rot={[0, -0.35, 0]} escala={1.5 * entra(t, T.pessoas, 0.5)} brilho={0.6} />
      {entra(t, T.pessoas, 0.5) > 0.02 ? <Boneco tema={tema} pos={[12.4, PISO_Y, 0.2]} rotY={-0.4} escala={0.62 * Math.min(1, entra(t, T.pessoas + 0.1, 0.5))} cor={tema.pessoa} pose={{ombroD: [0, 0, 0.5], cotoveloD: -0.3}} /> : null}

      {/* Estante dos órgãos */}
      <EstanteOrgaos tema={tema} pos={[ESTANTE[0], 0, ESTANTE[2]]} k={estK} />
      {estK > 0.5
        ? CAIXAS.map((c, i) => {
            const onda = rampa(t, T.vinte + i * 0.04, T.vinte + i * 0.04 + 0.3) * (1 - rampa(t, T.umDeles, T.umDeles + 0.4));
            const ehDef = c === DEF;
            const ehSau = c === SAU;
            const aceso = ehDef ? Math.max(onda, rampa(t, T.defesa, T.defesa + 0.3) * (1 - rampa(t, T.antes, T.antes + 0.5))) : ehSau ? Math.max(onda, rampa(t, T.propria, T.propria + 0.3) * (1 - rampa(t, T.antes, T.antes + 0.5))) : onda;
            const luz = ehDef || ehSau ? (aceso > onda + 0.01 || t > T.umDeles ? tema.acento : tema.objetoClaro) : tema.objetoClaro;
            const pos = ehDef ? defPos : ehSau ? sauPos : lugarCaixa(ESTANTE, c.col, c.lin);
            const esc = ehDef ? 1 + 0.25 * defSai : ehSau ? 1 + 0.25 * sauSai : 1;
            return <CaixaOrgao key={c.nome} tema={tema} pos={pos} nome={c.nome} aceso={aceso} luz={luz} escala={Math.min(1, (estK - 0.5) * 2) * esc} meio={ehDef ? defMeio * (1 - rampa(t, T.antes, T.antes + 0.5)) : 0} />;
          })
        : null}
      {CAIXAS.map((c, i) => {
        const prog = rampa(t, T.orgaos + i * 0.025, T.orgaos + i * 0.025 + 0.8);
        const vida = 1 - rampa(t, T.umDeles, T.umDeles + 0.5);
        if (prog < 0.02 || vida < 0.02) return null;
        const a = soma(lugarCaixa(ESTANTE, c.col, c.lin), [0, 0.45, 0.45]);
        return <Trilha key={c.nome} f={(s) => curva(a, PONTA_DIARIO, 1.2, s)} prog={prog} cor={tema.objetoClaro} n={12} raio={0.045} opacidade={0.8 * vida} />;
      })}
      {caboSau > 0.02 ? <Trilha f={(s) => curva(soma(SAU_FRENTE, [0, 1.0, 0.3]), PONTA_DIARIO, 1.4, s)} prog={caboSau} cor={tema.acento} n={16} raio={0.06} opacidade={1} /> : null}

      {/* Defesa: militares da ativa, contracheque e a folha cancelada */}
      {militares > 0.02
        ? [
            [-1.0, 0.85, 0.15],
            [-0.5, 1.15, 0],
            [-1.5, 1.2, 0.3],
          ].map(([dx, dz, r], i) => (
            <Boneco key={i} tema={tema} pos={[DEF_FRENTE[0] + dx, PISO_Y, DEF_FRENTE[2] + dz]} rotY={r} escala={0.55 * Math.min(1, entra(t, T.militares + i * 0.1, 0.45))} cor={tema.pessoa}>
              <Quepe tema={tema} />
            </Boneco>
          ))
        : null}
      <Contracheque tema={tema} pos={[DEF_FRENTE[0] - 2.1, PISO_Y, DEF_FRENTE[2] + 1.0]} rotY={0.3} escala={0.9 * cheque} salario={rampa(t, T.naoReduz + 0.3, T.naoReduz + 0.7)} piso={0} />
      <FolhaPe tema={tema} pos={[DEF_FRENTE[0] + 1.25, PISO_Y, DEF_FRENTE[2] + 0.2]} escala={0.95 * folha} texto={['AUTORIZAÇÃO', 'DE GASTO']} carimbo={carimbo} textoCarimbo="CANCELADA" corCarimbo={tema.objetoClaro} />
      <ArcoPontos a={soma(DEF_FRENTE, [0.6, 1.2, 0])} b={soma(SAU_FRENTE, [-0.6, 1.2, 0])} k={arcoDS} cor={laranja} alt={1.6} n={26} />
      <XMarca tema={tema} pos={[(DEF_FRENTE[0] + SAU_FRENTE[0]) / 2, 2.4, (DEF_FRENTE[2] + SAU_FRENTE[2]) / 2 + 0.3]} escala={1.3 * xK} />

      {/* Balança do saldo da Saúde */}
      <Balanca
        tema={tema}
        pos={BALANCA}
        escala={0.55 * balK}
        inclina={balInc}
        esq={
          <group>
            {[0, 1, 2, 3].map((i) => (
              <BlocoBi key={i} tema={tema} pos={[0, i * BLOCO.a, 0]} h={i === 3 ? 0.5 : 1} cor={mistura(tema.objetoClaro, tema.objeto, 0.4)} />
            ))}
          </group>
        }
        dir={
          <group>
            {[0, 1, 2, 3].map((i) => (
              <BlocoBi key={i} tema={tema} pos={[0, i * BLOCO.a, 0]} h={i === 3 ? 0.88 : 1} />
            )).slice(0, 4)}
          </group>
        }
        brilhoDir={0.3 * balK}
      />

      {/* Fim: celular com a fake e o carimbo da data */}
      <CelularFake tema={tema} pos={[CELULAR[0], CELULAR[1] - 1.2 * (1 - Math.min(1, celK)), CELULAR[2]]} rot={[-0.05, 0.25, 0]} escala={0.95 * celK} carimbo={celCarimbo} />
      <IconeBalao pos={[CELULAR[0] + 0.75, CELULAR[1] + 1.05, CELULAR[2] + 0.1]} cor={tema.acento} escala={1.1 * entra(t, T.comentarios, 0.45)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([-7.2, 4.0, -3.2], 7, 7.5, [0.25, 1.1, 1])], [T.fake, E([-6.6, 3.2, -2.2], 8.5, 6.5, [0.15, 0.8, 1])], [T.olha, E([-6.5, 2.0, -0.6], 10, 6, [0.05, 0.5, 1])], [T.p1 - 0.2, E([-6.8, 1.8, -0.2], 10, 5.6, [0, 0.42, 1])]]},
  {
    ini: T.p1 - 0.3,
    arco: 0.05,
    chaves: [
      [T.p1 - 0.3, E([-10.1, 1.4, -0.7], 5.2, 3.6, [0.3, 0.3, 1])],
      [T.velha + 0.9, E([-10.1, 1.2, 0.3], 4.8, 3.2, [0.25, 0.24, 1])],
      [T.p2 + 0.3, E([-8.4, 1.2, 0.6], 4.8, 3.0, [0.1, 0.2, 1])],
      [T.data + 0.4, E([-8.0, 1.15, 0.8], 4.2, 2.8, [0.05, 0.16, 1])],
      [T.p3 + 0.5, E([-5.5, 1.9, 0.6], 4.8, 3.8, [0, 0.16, 1])],
      [T.grav + 0.5, E([-5.5, 2.2, 0.6], 4.6, 3.6, [0.08, 0.14, 1])],
      [T.p4 + 0.4, E([-2.6, 2.0, 0.2], 5, 4.8, [-0.2, 0.35, 1])],
      [T.espalha + 0.5, E([-5.0, 0.5, -15], 14, 16, [0.2, 0.75, 1])],
      [T.mil154 + 0.6, E([-6.0, 0.3, -21], 17, 13, [0.15, 1.0, 1])],
      [T.agora - 0.3, E([-6.0, 0.3, -21], 16, 12, [0.05, 1.05, 1])],
    ],
  },
  {
    ini: T.agora - 0.2,
    arco: 0.05,
    chaves: [
      [T.agora - 0.2, E([-1.5, 1.8, 0.2], 11, 6, [0, 0.45, 1])],
      [T.desmontar + 1.3, E([3.0, 1.5, 0.8], 3.6, 3.0, [0.2, 0.32, 1])],
      [T.reportagem2, E([2.95, 1.15, 0.9], 2.4, 1.8, [0.12, 0.2, 1])],
      [T.d31 + 0.8, E([2.95, 1.2, 0.9], 2.2, 1.7, [0.05, 0.18, 1])],
      [T.naquela + 0.3, E([3.0, 1.3, 0.6], 4.6, 3.4, [0.3, 0.35, 1])],
      [T.segurou + 0.6, E([5.0, 0.5, 2.1], 4.2, 2.6, [0.1, 1.0, 1])],
      [T.daSaude + 0.4, E([4.6, 0.4, 2.4], 4.4, 2.6, [0, 1.0, 1])],
      [T.somando + 0.4, E([5.4, 0.4, 2.6], 5.0, 2.8, [0, 0.95, 1])],
      [T.repara - 0.3, E([6.3, 0.4, 2.7], 4.8, 2.8, [0.05, 0.9, 1])],
    ],
  },
  {
    ini: T.repara - 0.2,
    chaves: [
      [T.repara - 0.2, E([7.4, 1.0, 2.6], 4.8, 3.4, [0.12, 0.42, 1])],
      [T.bloqueio + 0.5, E([8.5, 1.3, 2.2], 3.8, 3.2, [0.18, 0.35, 1])],
      [T.aconteceu - 0.3, E([8.6, 1.3, 2.2], 3.6, 3.0, [0.1, 0.32, 1])],
    ],
  },
  {
    ini: T.aconteceu - 0.2,
    arco: 0.06,
    chaves: [
      [T.aconteceu - 0.2, E([6.4, 1.4, -2.6], 5.4, 4.8, [-0.15, 0.9, 1])],
      [T.d28 + 0.4, E([6.6, 1.3, -2.8], 4.6, 4.2, [-0.05, 0.75, 1])],
      [T.quaseTudo + 0.3, E([9.0, 1.8, -1.5], 6, 5, [0.1, 0.45, 1])],
      [T.pessoas + 0.4, E([10.6, 1.9, -1.1], 5, 4.8, [0.3, 0.38, 1])],
      [T.e388 + 0.2, E([9.2, 1.4, -0.4], 4.8, 3.8, [0.0, 0.42, 1])],
      [T.deOnde - 0.3, E([9.0, 1.4, -0.6], 5, 3.8, [0.0, 0.45, 1])],
    ],
  },
  {
    ini: T.deOnde - 0.2,
    arco: 0.05,
    chaves: [
      [T.deOnde - 0.2, E([7, 1.8, -6.4], 13, 5, [0, 0.55, 1])],
      [T.umDeles, E([7, 1.8, -6.2], 12.5, 4.8, [0, 0.5, 1])],
      [T.defesa + 0.8, E([3.4, 0.7, -4.6], 5.2, 3.6, [0, 1.15, 1])],
      [T.icl, E([2.5, 0.6, -4.3], 5.6, 3.6, [-0.12, 1.1, 1])],
      [T.autorizacao + 0.2, E([4.4, 0.8, -4.7], 4.2, 3.0, [0.15, 0.9, 1])],
      [T.segura - 0.3, E([4.4, 0.8, -4.7], 4.0, 2.9, [0.2, 0.9, 1])],
    ],
  },
  {
    ini: T.segura - 0.2,
    arco: 0.04,
    chaves: [
      [T.segura - 0.2, E([-1.5, 1.8, -1.2], 22, 8, [0, 0.7, 1])],
      [T.outraFake, E([-4.6, 2.0, 0.6], 7, 5, [0.05, 0.4, 1])],
      [T.naoDa + 0.5, E([-4.8, 2.0, 0.8], 6.4, 4.6, [0.1, 0.38, 1])],
      [T.tiraram, E([-4.9, 2.0, 0.8], 6.2, 4.5, [0.14, 0.38, 1])],
      [T.porSaude, E([6.3, 1.5, -5.0], 8.5, 4.4, [0, 0.55, 1])],
      [T.dosRemedios + 0.3, E([8.6, 1.4, -3.6], 6.5, 4.6, [0.15, 0.5, 1])],
      [T.cedeu + 0.4, E([8.0, 1.3, -4.2], 6, 4.2, [0.05, 0.5, 1])],
      [T.saldo + 0.3, E([4.0, 1.0, 3.0], 3.2, 2.6, [0, 0.32, 1])],
      [T.antes - 0.3, E([4.0, 1.0, 3.0], 3.0, 2.4, [0.08, 0.3, 1])],
    ],
  },
  {
    ini: T.antes - 0.2,
    chaves: [
      [T.antes - 0.2, E([2.95, 1.2, 0.9], 2.8, 2.1, [0.1, 0.22, 1])],
      [T.procura + 0.4, E([2.95, 1.15, 0.9], 2.3, 1.8, [0.05, 0.2, 1])],
      [T.voce + 0.3, E([1.6, 1.4, 2.2], 3.6, 3.4, [0, 0.25, 1])],
      [T.segue, E([1.5, 1.4, 1.8], 4.4, 3.8, [0, 0.3, 1])],
      [FIM, E([1.0, 1.2, -2], 17, 11, [0, 0.9, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.08, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean; risco?: number};
const CHIPS: Txt[] = [
  {a: T.p1, b: T.p2, texto: 'PASSO 1 · PEGA UMA REPORTAGEM VELHA'},
  {a: T.p2, b: T.p3, texto: 'PASSO 2 · ESCONDE A DATA'},
  {a: T.p3, b: T.p4, texto: 'PASSO 3 · TÍTULO POR CIMA'},
  {a: T.p4, b: T.agora, texto: 'PASSO 4 · ESPALHA'},
  {a: T.d31 + 0.1, b: T.segurou, texto: 'É DE 2024', destaque: true},
  {a: T.bloqueio, b: T.continua, texto: 'BLOQUEIO TEMPORÁRIO', destaque: true},
  {a: T.continua, b: T.liberado, texto: 'CONTINUA NO ORÇAMENTO'},
  {a: T.liberado, b: T.aconteceu, texto: 'PODE SER LIBERADO', destaque: true},
  {a: T.vinte, b: T.defesa, texto: '22 ÓRGÃOS'},
  {a: T.naoReduz, b: T.segura, texto: 'NÃO REDUZ SALÁRIO', destaque: true},
  {a: T.outraFake, b: T.naoDa, texto: 'A PRÓXIMA FAKE?'},
  {a: T.naoDa, b: T.dosRemedios, texto: 'NÃO DÁ PARA DIZER ISSO', destaque: true},
  {a: T.outras, b: T.saldo, texto: '3 CONTAS DA PRÓPRIA SAÚDE'},
  {a: T.antes, b: T.segue, texto: 'ANTES DE COMPARTILHAR, PROCURE A DATA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.grav, b: T.p4, texto: 'TEXTO DO POST QUE CIRCULOU'},
  {a: T.segundo, b: T.repara, texto: 'SEGUNDO O AOS FATOS · 27/10/2026'},
  {a: T.diario, b: T.deOnde, texto: 'DIÁRIO OFICIAL DA UNIÃO · PORTARIA Nº 485'},
  {a: T.deOnde, b: T.icl, texto: 'DIÁRIO OFICIAL · ANEXO II (CANCELAMENTOS)'},
  {a: T.icl, b: T.segura, texto: 'SEGUNDO O ICL NOTÍCIAS · 30/10/2026'},
  {a: T.saldo, b: T.antes, texto: 'CONTA FEITA COM OS NÚMEROS DO DIÁRIO OFICIAL'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '14px 30px 18px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 104, fontWeight: 900, letterSpacing: -4, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

type Rot = {a: number; b: number; p: V3; texto: string; cor?: 'acento' | 'fake'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.julho, b: T.p2, p: [X_ARQ - 0.08, ESTEIRA_Y + 0.2, ESTEIRA_Z + 0.4], texto: 'DATA: 31 JUL 2024', dy: 90},
  {a: T.b15, b: T.daSaude, p: [P15[0], PISO_Y + 1.3, P15[2]], texto: 'R$ 15 BI · ORÇAMENTO 2024'},
  {a: T.v44, b: T.somando, p: [SA[0], PISO_Y + 1.25, SA[2]], texto: 'SAÚDE · R$ 4,4 BI', cor: 'acento'},
  {a: T.v13, b: T.somando, p: [ED[0], PISO_Y + 0.65, ED[2]], texto: 'EDUCAÇÃO · R$ 1,3 BI', cor: 'acento', dy: -60},
  {a: T.v47, b: T.deOnde, p: [TQ_BPC[0], 1.9, TQ_BPC[2] + 0.9], texto: 'R$ 4,7 BI', cor: 'acento'},
  {a: T.pessoas, b: T.deOnde, p: [12.0, 0.6, -0.4], texto: 'BENEFÍCIO DE PESSOAS COM DEFICIÊNCIA', dy: -80},
  {a: T.e388, b: T.deOnde, p: [TQ_REM[0], 1.5, TQ_REM[2]], texto: 'R$ 388 MI', cor: 'acento', dy: -40},
  {a: T.v226, b: T.segura, p: [DEF_FRENTE[0], PISO_Y + 1.25, DEF_FRENTE[2]], texto: 'DEFESA · R$ 226 MI', cor: 'acento', dy: 20},
  {a: T.v108, b: T.icl, p: [DEF_FRENTE[0] - 1.0, PISO_Y + 1.5, DEF_FRENTE[2] + 0.9], texto: 'R$ 108 MI · MILITARES DA ATIVA', dy: -10},
  {a: T.militares + 0.4, b: T.icl, p: [DEF_FRENTE[0] + 0.5, PISO_Y + 0.3, DEF_FRENTE[2]], texto: 'RESERVA DA DEFESA E OUTROS', dy: -150},
  {a: T.cedeu, b: T.saldo, p: [SAU_FRENTE[0], PISO_Y + 1.35, SAU_FRENTE[2]], texto: 'SAÚDE CEDEU · R$ 450 MI', cor: 'acento'},
  {a: T.saldo + 0.3, b: T.antes, p: [BALANCA[0] - 1.2, 1.0, BALANCA[2]], texto: 'SAIU R$ 450 MI', dy: -150},
  {a: T.saldo + 0.5, b: T.antes, p: [BALANCA[0] + 1.2, 1.0, BALANCA[2]], texto: 'ENTROU R$ 388 MI', cor: 'acento', dy: -150},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const k154 = entra(t, T.mil154, 0.45) * (1 - rampa(t, T.agora - 0.3, T.agora + 0.1));
  const n154 = Math.round(154 * rampa(t, T.mil154, T.mil154 + 1.0));
  const k57 = entra(t, T.osQuase, 0.45) * (1 - rampa(t, T.repara - 0.3, T.repara + 0.1));
  const k52 = entra(t, T.v52, 0.45) * (1 - rampa(t, T.quaseTudo + 0.6, T.quaseTudo + 1.0));
  const k62 = entra(t, T.v62, 0.45) * (1 - rampa(t, T.antes - 0.3, T.antes + 0.1));
  const kCortar = entra(t, T.naoCortar, 0.45) * (1 - rampa(t, T.bloqueio - 0.3, T.bloqueio));
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const corDe = (r: Rot) => (r.cor === 'acento' ? tema.acento : r.cor === 'fake' ? corFake(tema) : tema.cartaoBorda);
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 170, Math.min(SEGURO.botoesX - 170, x)), top: Math.max(560, Math.min(1180, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 28, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: corDe(r)};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  // Rótulos que se sobrepõem sobem
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 360 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y - 60;
  return (
    <>
      {/* Números grandes */}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor={`${n154} MIL`} rotulo="COMPARTILHAMENTOS" k={k154} cor={corFake(tema)} />
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor="R$ 5,7 BI" rotulo="4,4 + 1,3 = OS “QUASE 6 BI”" k={k57} cor={tema.acento} />
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor="R$ 5,2 BI" rotulo="REMANEJADOS" k={k52} cor={tema.acento} />
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor="− R$ 62 MI" rotulo="SALDO DA SAÚDE NA PORTARIA" k={k62} />
      </div>
      {/* Cortar x segurar */}
      {kCortar > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', gap: 18, opacity: Math.min(1, kCortar * 1.3)}}>
          <Chip tema={tema} texto="CORTAR" k={kCortar} tam={34} risco={rampa(t, T.naoCortar + 0.2, T.naoCortar + 0.6)} apagado={0.4 * rampa(t, T.naoCortar + 0.2, T.naoCortar + 0.6)} />
          <Chip tema={tema} texto="SEGURAR" k={entra(t, T.naoCortar + 0.3, 0.45)} tam={34} destaque />
        </div>
      ) : null}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 26 ? 27 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {/* Final */}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>PROCURE A DATA</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8, opacity: rampa(t, T.informacoes, T.informacoes + 0.4)}}>PARA MAIS INFORMAÇÕES</div>
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
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.2}));
  [0, 1, 2, 3].forEach((i) => s.push({t: T.trabalha + i * 0.15, f: 'pop', v: 0.16}));
  s.push({t: T.velha, f: 'pop', v: 0.24});
  s.push({t: T.data, f: 'tique', v: 0.24});
  s.push({t: T.escreve + 0.3, f: 'baque', v: 0.32});
  s.push({t: T.grav, f: 'pop', v: 0.28});
  s.push({t: T.espalha, f: 'whoosh', v: 0.32});
  s.push({t: T.mil154, f: 'subida', v: 0.28});
  s.push({t: T.d31, f: 'ding', v: 0.3});
  for (let i = 0; i < 15; i++) s.push({t: T.segurou + 0.08 * i, f: 'pop', v: 0.1});
  [T.v44, T.v13, T.osQuase].forEach((t) => s.push({t, f: 'pop', v: 0.24}));
  s.push({t: T.bloqueio + 0.75, f: 'tique', v: 0.3});
  s.push({t: T.liberado, f: 'ding', v: 0.24});
  s.push({t: T.diario, f: 'baque', v: 0.22});
  s.push({t: T.v52, f: 'pop', v: 0.26});
  s.push({t: T.v47, f: 'subida', v: 0.24});
  s.push({t: T.e388, f: 'pop', v: 0.22});
  for (let i = 0; i < 6; i++) s.push({t: T.vinte + i * 0.15, f: 'pop', v: 0.1});
  s.push({t: T.defesa, f: 'pop', v: 0.26});
  s.push({t: T.cancelada, f: 'impacto', v: 0.32});
  s.push({t: T.senao + 0.5, f: 'baque', v: 0.24});
  s.push({t: T.naoDa + 0.2, f: 'baque', v: 0.3});
  s.push({t: T.porSaude, f: 'tique', v: 0.26});
  s.push({t: T.saldo, f: 'pop', v: 0.24});
  s.push({t: T.v62, f: 'pop', v: 0.24});
  s.push({t: T.procura, f: 'ding', v: 0.28});
  s.push({t: T.voce + 0.6, f: 'impacto', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.24});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.5, T.olha + 0.6, T.p1 + 0.3, T.velha + 0.7, T.julho + 0.6, T.data + 0.4, T.escreve + 0.3, T.lula + 0.5, T.saude1 + 0.8, T.espalha + 0.5, T.mil154 + 1.1,
  T.desmontar + 0.7, T.aosFatos + 0.7, T.d31 + 0.8, T.naquela + 0.9, T.b15 + 0.6, T.v44 + 0.6, T.v13 + 0.7, T.osQuase + 0.6, T.naoCortar + 0.6, T.bloqueio + 1.0,
  T.continua + 0.7, T.liberado + 0.6, T.diario + 0.7, T.v52 + 0.5, T.v47 + 1.2, T.pessoas + 0.7, T.remedios + 0.6, T.vinte + 0.8, T.defesa + 1.0, T.v108 + 0.7,
  T.militares + 0.6, T.naoReduz + 0.6, T.cancelada + 0.5, T.segura + 0.6, T.outraFake + 0.4, T.naoDa + 0.7, T.porSaude + 0.4, T.propria + 0.8, T.cedeu + 0.9, T.saldo + 0.8,
  T.v62 + 0.5, T.procura + 0.5, T.voce + 1.0, T.arroba + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const FabricaFake: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={260} sombraArea={26} centro={[0, 0, -4]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Fábrica de fake" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Lula cortou', 'R$ 6 bi da', 'Saúde?', 'É de 2024.'];
export const CapaFabricaFake: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · FÁBRICA DE FAKE`} t={1} troca={0} y={SEGURO.topo + 160} />
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
