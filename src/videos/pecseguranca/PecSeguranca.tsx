import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Cofre, Moeda, Onda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Cadeado, Congresso} from '../../pecas/candidato';
import {Plenario} from '../../pecas/mei';
import {PosteLampada} from '../../pecas/oitohoras';
import {DocumentoGrande, PredioColunas, Carimbo3D} from '../../pecas/bets';
import {CanoMoedas} from '../../pecas/multas';
import {NavioMini} from '../../pecas/cruzeiro';
import {Urna} from '../../pecas/gasolina';
import {Balanca} from '../../pecas/escala6x1b';
import {BalancaJustica} from '../../pecas/juros';
import {DiarioOficial} from '../../pecas/escala6x1c';
import {Escudo} from '../escala6x1/pecas';
import {PlataformaPetroleo} from '../governocasa/pecas';
import {Alicerce, AndarObra, ArmarioDados, Arvore, CASA, CasaSeguranca, Cela, Cartao, Guarita, LivroPorta, MesaRedonda, PlacarParede, Policial, PredioSigla, Presidio, Rio, TremMini, Trilho, Tora} from './pecas';
import {PALAVRAS} from './palavras';

// 018. pec da segurança (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a "Casa da Segurança" (3 cômodos: GOVERNADOR, UNIÃO, PREFEITURA, em cima do alicerce
// 1988 → CONSTITUIÇÃO), com o Congresso em maquete ao fundo, e encaixa três trechos de mapa do Kit Mapas
// (projetos/018.../mapas/pec.mp4, composição PecSeguranca do kit): os estados (A), os municípios (B) e o fecho (C).
// Pessoas reais só como bonecos genéricos com etiqueta. Plano: projetos/018. pec da segurança/plano.md (v1, aprovado 04/11/2026).

export const FPS = 30;
const AUDIO_SEG = 166.65;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '018. pec da segurança';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  n75: quando('75'),
  zero: quando('zero'),
  nenhum: quando('Nenhum senador'),
  seguranca: quando('segurança pública'),
  mexe: quando('mexe com quem'),
  rua: quando('sua rua'),
  primeiro: quando('Primeiro, como era'),
  n1988: quando('Desde 1988'),
  casa: quando('casa com'),
  donos: quando('vários donos'),
  conversam: quando('não conversam'),
  governador: quando('O governador'),
  pm: quando('Polícia Militar'),
  civil: quando('Civil'),
  uniao: quando('A União'),
  federal: quando('na Federal'),
  rodoviaria: quando('Rodoviária'),
  prefeitura: quando('a prefeitura'),
  guarda: quando('guarda'),
  praca: quando('praça'),
  predio: quando('prédio público'),
  resultado: quando('Resultado'),
  em2018: quando('Em 2018'),
  intervencao: quando('intervenção federal'),
  susp: quando('cria o Susp'),
  leiComum: quando('lei comum'),
  porIsso: quando('Por isso'),
  n2024: quando('2024'),
  governo: quando('o governo leva'),
  governadores: quando('governadores'),
  pec: quando('uma PEC'),
  proposta: quando('proposta para mudar'),
  constituicao1: quando('própria Constituição'),
  parte: quando('Parte deles'),
  nariz: quando('torce o nariz'),
  controle: quando('controle das suas'),
  naCamara: quando('Na Câmara'),
  relator: quando('relator Mendonça'),
  tres: quando('tira três coisas'),
  exclusivo: quando('exclusivo da União'),
  troca: quando('troca de nome'),
  reducao: quando('redução da maioridade'),
  aprova: quando('A Câmara aprova'),
  marco: quando('março'),
  n487: quando('487'),
  n15: quando('487 a 15', 1, true),
  senado: quando('O Senado'),
  bets: quando('o dinheiro das'),
  devolver: quando('não ter que devolver'),
  ontem: quando('ontem 75'),
  zero2: quando('ontem 75 a zero', 1, true),
  dividiu: quando('Só um ponto'),
  deixar: quando('deixar a maioridade'),
  n38: quando('38'),
  n36: quando('38 a 36', 1, true),
  agora: quando('Agora, o que muda'),
  cinco: quando('cinco coisas'),
  um: quando('Um o Susp'),
  suspEntra: quando('o Susp entra'),
  constituicao2: quando('entra na Constituição'),
  sus: quando('Pensa no SUS'),
  comPolicia: quando('com polícia'),
  todoMundo: quando('todo mundo dividindo'),
  dados: quando('dividindo dados'),
  operacoes: quando('operações'),
  dois: quando('Dois'),
  dinheiroProprio: quando('dinheiro próprio'),
  treinamento: quando('treinamento padrão'),
  avaliacao: quando('avaliação regular'),
  mp: quando('Ministério Público'),
  tresN: quando('Três a Rodoviária'),
  prf: quando('Rodoviária Federal'),
  ferrovias: quando('ferrovias'),
  rios: quando('rios federais'),
  pf: quando('a Federal ganha'),
  faccoes: quando('facções e crime'),
  ambiental: quando('crime ambiental'),
  quatro: quando('Quatro'),
  garantido: quando('dinheiro garantido'),
  bloquear: quando('bloquear'),
  fundos: quando('fundos da segurança'),
  presidios: quando('presídios'),
  metade: quando('Metade'),
  estados: quando('os estados'),
  n10: quando('10%'),
  sobra: quando('sobra'),
  presal: quando('pré-sal'),
  cincoN: quando('Cinco facção'),
  faccao: quando('facção e milícia'),
  cargo: quando('mais alto o cargo'),
  pena: quando('maior a pena'),
  maxima: quando('segurança máxima'),
  beneficios: quando('menos benefícios'),
  bens: quando('perda dos bens'),
  vitima: quando('a vítima'),
  apoio: quando('apoio na Justiça'),
  ninguem: quando('a parte que quase'),
  preso: quando('Quem for preso'),
  definitiva: quando('condenação definitiva'),
  provisoria: quando('prisão provisória'),
  votar: quando('direito de votar'),
  enquanto: quando('enquanto estiver preso'),
  especialistas: quando('Especialistas'),
  discutem: quando('discutem'),
  fere: quando('fere a presunção'),
  inocencia: quando('inocência'),
  congresso: quando('o Congresso ganha'),
  barrar: quando('barrar regras'),
  juizes: quando('juízes e promotores'),
  areaPenal: quando('área penal'),
  atencao: quando('Mas atenção'),
  constituicao3: quando('a Constituição só'),
  porta: quando('abre a porta'),
  penaDura: quando('Pena mais dura'),
  perdaBens: quando('perda de bens'),
  leiNova: quando('lei nova'),
  naoMuda: quando('o que não muda'),
  pmCivil: quando('PM e Polícia'),
  comGov: quando('com o governador'),
  maioridade: quando('a maioridade penal segue'),
  enquanto2: quando('por enquanto'),
  outraPec: quando('outra PEC'),
  falta: quando('Falta só'),
  publicar: quando('o Congresso publicar'),
  sem: quando('Sem assinatura'),
  lula: quando('Lula já avisou'),
  passo: quando('próximo passo'),
  ministerio: quando('Ministério da Segurança'),
  eAi: quando('E aí, você quer'),
  meConta: quando('Me conta'),
  segue: quando('E segue o'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, '75 A ZERO'],
  [T.primeiro, 'COMO ERA'],
  [T.resultado, 'CADA UM NO SEU QUADRADO'],
  [T.em2018, '2018'],
  [T.porIsso, 'A PEC'],
  [T.aprova, 'AS VOTAÇÕES'],
  [T.agora, 'O QUE MUDA'],
  [T.um, '1 · SUSP'],
  [T.dois, '2 · SUA CIDADE'],
  [T.tresN, '3 · PRF E PF'],
  [T.quatro, '4 · DINHEIRO'],
  [T.cincoN, '5 · FACÇÕES'],
  [T.ninguem, 'QUASE NINGUÉM VIU'],
  [T.atencao, 'SÓ A PORTA'],
  [T.naoMuda, 'NÃO MUDA'],
  [T.falta, 'PRÓXIMO PASSO'],
  [T.eAi, 'E VOCÊ?'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.resultado), ate: q(T.porIsso), origem: 0};
const MAPA_B = {de: q(T.dois), ate: q(T.tresN), origem: q(T.porIsso) - q(T.resultado)};
const MAPA_C = {de: q(T.eAi), ate: QUADROS, origem: MAPA_B.origem + q(T.tresN) - q(T.dois)};
const noMapa = (t: number) => (t >= T.resultado && t < T.porIsso) || (t >= T.dois && t < T.tresN) || t >= T.eAi;

// ---------- Mapa do mundo ----------
const ALI: V3 = [0, 0, 0];
const PISO = 0.5;
const CASA_P: V3 = [0, PISO, 0];
const COMODO = CASA.comodos;
const VOCE: V3 = [7.6, 0, 5.7];
const COFRE: V3 = [0, 0, 3.15];
const PLATAFORMA: V3 = [3.3, 0, 3.4];
const PRESIDIO: V3 = [11, 0, 0];
const CELA: V3 = [9.2, 0, 3.6];
const URNA: V3 = [10.8, 0, 4.0];
const BALANCA: V3 = [12.8, 0, 3.7];
const VITIMA: V3 = [7.4, 0, 2.6];
const CONGRESSO: V3 = [0, 0, -19];
const PLENARIO: V3 = [0, 0, -12.5];
const RELATOR: V3 = [-4.6, 0, -11.6];
const PLACAR: V3 = [4.6, 0, -11.2];
const MESA_GOV: V3 = [-10, 0, -9];
const CNJ: V3 = [6.8, 0, -15.8];
const CNMP: V3 = [8.9, 0, -15.8];
const DIARIO: V3 = [-1.2, 0, -12.0];
const LIVRO: V3 = [0, 0, 3.3];
const LULA: V3 = [-7.4, 0, 3.2];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const k1 = (x: number) => Math.max(0, Math.min(1, x));

// queda de um cartão: sobe do documento, fica no ar e, a partir de `cai`, desce girando e afunda
const voo = (t: number, ini: number, cai: number, de: V3, ar: V3, chao: V3) => {
  const sobe = rampa(t, ini, ini + 0.5);
  const desce = rampa(t, cai, cai + 0.8);
  const p = desce > 0 ? curva(ar, chao, 0.3, desce) : curva(de, ar, 0.4, sobe);
  return {p, k: entra(t, ini, 0.4) * (1 - rampa(t, cai + 0.8, cai + 1.4)), giro: 1.4 * desce};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  // ----- A casa (do começo ao fim, menos nos mapas: o mapa cobre) -----
  const aliSobe = rampa(t, T.n1988 - 0.2, T.n1988 + 0.6);
  const constituicao = rampa(t, T.suspEntra, T.suspEntra + 0.6);
  const aliBrilho = pulso(t, T.constituicao2, 1.0) + janela(t, T.atencao, T.naoMuda, 0.5) * 0.6;
  const casaSobe = rampa(t, T.casa - 0.1, T.casa + 0.8);
  const placas: [number, number, number] = [entra(t, T.donos, 0.4), entra(t, T.donos + 0.25, 0.4), entra(t, T.donos + 0.5, 0.4)];
  const luzGov = Math.max(janela(t, T.governador, T.uniao), pulso(t, T.controle, 1.0), janela(t, T.estados - 0.4, T.n10, 0.4), janela(t, T.pmCivil, T.maioridade, 0.4));
  const luzUni = Math.max(janela(t, T.uniao, T.prefeitura), janela(t, T.prf, T.quatro));
  const luzPre = janela(t, T.prefeitura, T.resultado);
  const luzSusp = janela(t, T.dados, T.dois, 0.5);
  const portas = rampa(t, T.comPolicia, T.comPolicia + 0.9);
  const fecha = janela(t, T.conversam, T.resultado, 0.4);

  // bonecos dos cômodos
  const pmK = entra(t, T.pm, 0.45);
  const civK = entra(t, T.civil, 0.45);
  const pfK = entra(t, T.federal, 0.45);
  const prfK = entra(t, T.rodoviaria, 0.45);
  const guardaK = entra(t, T.guarda, 0.45);
  const pracaK = entra(t, T.praca, 0.45);
  const predK = entra(t, T.predio, 0.45);
  const viram = rampa(t, T.todoMundo, T.todoMundo + 0.6) * (1 - rampa(t, T.dois, T.dois + 0.5));
  const passo = rampa(t, T.operacoes, T.operacoes + 0.8) * (1 - rampa(t, T.dois, T.dois + 0.5));
  const aceno = janela(t, T.pmCivil, T.maioridade, 0.3);
  const ombroAceno: V3 = [0, 0, 2.2 * aceno];

  // ----- Cena 0: plenário do Senado e o protagonista -----
  const plenK = Math.max(vis(t, 0, T.primeiro - 0.4), vis(t, T.senado - 0.3, T.agora - 0.2) * 0.9);
  const acesos = t < T.primeiro ? 78 * rampa(t, 0, 1.4) : 78 * rampa(t, T.ontem, T.ontem + 1.0);
  const voceK = entra(t, T.rua, 0.5);

  // ----- Cena 2: mesa dos governadores e o relator -----
  const c2 = vis(t, T.porIsso - 0.3, T.aprova);
  const govK = c2;
  const docGov = entra(t, T.governo, 0.45) * (1 - rampa(t, T.naCamara, T.naCamara + 0.4));
  const andaGov = rampa(t, T.governo, T.governadores + 0.8);
  const recua = rampa(t, T.parte, T.parte + 0.6);
  const viraCabeca = rampa(t, T.nariz, T.nariz + 0.4);
  const relK = vis(t, T.naCamara - 0.3, T.aprova + 6);
  const docRel = relK;
  const MESA_REL: V3 = soma(RELATOR, [0, 0, 1.0]);
  const cartoes = [
    {ini: T.tres, cai: T.exclusivo + 0.4, linhas: ['PODER EXCLUSIVO', 'DA UNIÃO'], ar: soma(MESA_REL, [-1.9, 2.6, 0.2]), risco: rampa(t, T.exclusivo, T.exclusivo + 0.4)},
    {ini: T.tres + 0.15, cai: T.troca + 0.4, linhas: ['PRF VIRA', 'POLÍCIA VIÁRIA'], ar: soma(MESA_REL, [0, 3.0, 0.2]), risco: rampa(t, T.troca, T.troca + 0.4)},
    {ini: T.tres + 0.3, cai: T.reducao + 0.5, linhas: ['MAIORIDADE', 'PENAL 16'], ar: soma(MESA_REL, [1.9, 2.6, 0.2]), risco: rampa(t, T.reducao, T.reducao + 0.4)},
    {ini: T.bets - 0.3, cai: T.devolver + 0.2, linhas: ['DINHEIRO', 'DAS BETS'], ar: soma(PLACAR, [-2.4, 3.2, 1.2]), risco: rampa(t, T.bets + 0.3, T.bets + 0.7)},
  ];

  // ----- Cena 3: Congresso e placar -----
  const congAceso = Math.max(janela(t, T.aprova, T.agora), janela(t, T.congresso, T.atencao), janela(t, T.publicar, T.lula));
  const placarK = vis(t, T.aprova - 0.2, T.agora);
  let sim = 0;
  let nao = 0;
  if (t < T.ontem) {
    sim = 0.97 * rampa(t, T.n487, T.n487 + 1.0);
    nao = 0.03 * rampa(t, T.n15, T.n15 + 0.4);
  } else if (t < T.dividiu) {
    sim = rampa(t, T.ontem, T.ontem + 1.0);
    nao = 0;
  } else {
    const zera = 1 - rampa(t, T.dividiu, T.dividiu + 0.5);
    sim = Math.max(zera, 0.51 * rampa(t, T.n38, T.n38 + 0.7));
    nao = 0.49 * rampa(t, T.n36 - 0.2, T.n36 + 0.5);
  }

  // ----- Cena 4.3: quintal da União -----
  const trilhoK = rampa(t, T.ferrovias - 0.2, T.ferrovias + 0.5) * (1 - rampa(t, T.quatro, T.quatro + 0.6));
  const tremX = -1.2 + 3.2 * rampa(t, T.ferrovias + 0.2, T.quatro, (x) => x);
  const rioK = rampa(t, T.rios - 0.1, T.rios + 0.6) * (1 - rampa(t, T.quatro, T.quatro + 0.6));
  const escudoK = vis(t, T.pf, T.quatro);
  const faccK = vis(t, T.faccoes - 0.1, T.quatro);
  const faccRecua = rampa(t, T.faccoes + 0.3, T.faccoes + 1.2);
  const arvK = vis(t, T.ambiental, T.cincoN);

  // ----- Cena 4.4: o cofre -----
  const cofreK = vis(t, T.garantido - 0.2, T.cincoN + 0.3);
  const cadeadoK = vis(t, T.bloquear - 0.2, T.fundos);
  const cadeadoSai = rampa(t, T.bloquear + 0.4, T.fundos);
  const canoK = vis(t, T.metade - 0.1, T.cincoN + 0.3);
  const fluxo = rampa(t, T.metade, T.cincoN, (x) => x);
  const platK = vis(t, T.sobra - 0.1, T.cincoN + 0.3);
  const moedaVoa = rampa(t, T.sobra + 0.3, T.presal + 0.4);

  // ----- Cena 4.5 e 5: presídio -----
  const presK = vis(t, T.cincoN - 0.2, T.atencao);
  const muro = rampa(t, T.maxima - 0.2, T.maxima + 0.6) * presK;
  const piramide = rampa(t, T.faccao, T.faccao + 0.9) * presK;
  const acende = rampa(t, T.cargo, T.cargo + 1.2) * (1 - rampa(t, T.ninguem, T.ninguem + 0.5));
  const grades: [number, number, number] = [rampa(t, T.pena + 0.5, T.pena + 1.0), rampa(t, T.pena + 0.25, T.pena + 0.75), rampa(t, T.pena, T.pena + 0.5)];
  const bensK = vis(t, T.faccao, T.bens) * (1 - rampa(t, T.bens, T.bens + 0.8));
  const bensAfunda = rampa(t, T.bens, T.bens + 0.8);
  const vitK = vis(t, T.vitima, T.ninguem);
  const justK = vis(t, T.apoio - 0.1, T.ninguem);
  const celaK = vis(t, T.preso - 0.2, T.atencao);
  const presoK = entra(t, T.preso, 0.5) * celaK;
  const urnaK = vis(t, T.votar - 0.1, T.atencao);
  const fechaUrna = rampa(t, T.enquanto, T.enquanto + 0.5);
  const balK = vis(t, T.especialistas - 0.1, T.atencao);
  const inclina = 0.7 * rampa(t, T.discutem, T.discutem + 0.4) - 1.4 * rampa(t, T.fere, T.fere + 0.5) + 0.7 * rampa(t, T.inocencia, T.inocencia + 0.5);
  const conselhosK = vis(t, T.congresso - 0.2, T.atencao);
  const regraK = vis(t, T.barrar, T.atencao);
  const carimboK = entra(t, T.areaPenal, 0.3) * (1 - rampa(t, T.atencao, T.atencao + 0.4));
  const carimboDesce = 1 - rampa(t, T.areaPenal, T.areaPenal + 0.25);

  // ----- Cena 6: o livro -----
  const livroK = vis(t, T.constituicao3 - 0.1, T.naoMuda + 0.3);
  const abre = rampa(t, T.porta, T.porta + 0.8);
  const itens = rampa(t, T.penaDura, T.penaDura + 0.4) + rampa(t, T.perdaBens, T.perdaBens + 0.4);
  const tituloLei = entra(t, T.leiNova, 0.4);

  // ----- Cena 7 e 8 -----
  const outraK = vis(t, T.outraPec - 0.2, T.falta + 1.0);
  const outraVoa = rampa(t, T.outraPec, T.falta + 0.8);
  const diarioK = vis(t, T.publicar - 0.1, T.eAi);
  const lulaK = vis(t, T.lula - 0.1, T.eAi);
  const obraSobe = rampa(t, T.passo, T.passo + 1.0);
  const obraPlaca = entra(t, T.ministerio, 0.5);
  const obraMat = entra(t, T.ministerio + 0.3, 0.5);

  return (
    <group>
      {/* a rua */}
      <Caixa args={[20, 0.04, 2.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.5)} position={[0, 0.02, 5.8]} sombra={false} />
      {[-8, -5.5, -3, -0.5, 2, 4.5, 7].map((x) => (
        <Caixa key={x} args={[1.2, 0.012, 0.12]} raio={0.005} cor={tema.objetoClaro} position={[x, 0.045, 5.8]} sombra={false} />
      ))}
      <Caixa args={[20, 0.1, 0.5]} raio={0.03} cor={tema.objeto} position={[0, 0.05, 4.3]} />
      <Boneco tema={tema} pos={VOCE} rotY={Math.PI + 0.2} escala={0.75 * voceK} cor={tema.corpo} />
      {voceK > 0.02 ? <Onda pos={soma(VOCE, [0, 0.03, 0])} k={rampa(t, T.rua, T.rua + 1.2, (x) => x)} cor={tema.acento} raio={1.1} /> : null}

      {/* alicerce e casa */}
      <Alicerce tema={tema} pos={ALI} sobe={aliSobe} constituicao={constituicao} brilho={Math.min(1, aliBrilho)} />
      <CasaSeguranca tema={tema} pos={CASA_P} sobe={casaSobe} luz={[luzGov, Math.max(luzUni, luzSusp * 0.6), Math.max(luzPre, luzSusp * 0.6)]} placas={placas} portas={portas} fecha={fecha} />
      {/* armários de dados em cada cômodo + fio do Susp */}
      {COMODO.map((x, i) => (
        <ArmarioDados key={i} tema={tema} pos={[x + 1.3, PISO, -1.4]} escala={0.9 * casaSobe} aceso={luzSusp} />
      ))}
      {luzSusp > 0.02
        ? [
            [-2.7, 2.15],
            [1.3, 2.15],
          ].map(([x0], i) => (
            <Caixa key={i} args={[4 * luzSusp, 0.06, 0.06]} raio={0.02} cor={tema.acento} emissivo={0.8} position={[x0 + 2 * luzSusp, PISO + 1.55, -1.4]} sombra={false} />
          ))
        : null}

      {/* GOVERNADOR: 2 PM + 1 Civil */}
      <Policial tema={tema} pos={[-4.9 + 0.5 * passo, PISO + 0.08, 0.3]} rotY={0.25 + 1.2 * viram} escala={0.62 * pmK} pose={{ombroD: ombroAceno}} />
      <Policial tema={tema} pos={[-4.1, PISO + 0.08, 0.6]} rotY={0.1 + 1.0 * viram} escala={0.62 * pmK} pose={{ombroE: [0, 0, -2.2 * aceno]}} />
      <Policial tema={tema} pos={[-3.2, PISO + 0.08, 0.2]} rotY={-0.15 + 1.0 * viram} escala={0.62 * civK} quepe={false} cor={mistura(tema.pessoa, tema.objetoEscuro, 0.35)} pose={{ombroD: ombroAceno}} />
      {/* UNIÃO: PF e PRF */}
      <Policial tema={tema} pos={[-0.6, PISO + 0.08, 0.4]} rotY={0.15 - 1.2 * viram} escala={0.62 * pfK} cor={mistura(tema.pessoa, tema.objetoEscuro, 0.5)} quepe={false} />
      <Policial tema={tema} pos={[0.7 + 0.4 * passo, PISO + 0.08, 0.3]} rotY={-0.15 + 1.2 * viram} escala={0.62 * prfK} />
      {/* PREFEITURA: guarda, guarita, praça */}
      <Policial tema={tema} pos={[3.0 - 0.4 * passo, PISO + 0.08, 0.6]} rotY={0.2 - 1.2 * viram} escala={0.62 * guardaK} />
      <Guarita tema={tema} pos={[3.5, PISO + 0.08, -0.9]} escala={0.8 * guardaK} aceso={luzPre} />
      <PosteLampada tema={tema} pos={[5.3, PISO + 0.08, 1.2]} escala={0.6 * pracaK} acesa={pracaK * 0.6} />
      {pracaK > 0.02 ? (
        <group position={[4.6, PISO + 0.08, 1.0]} scale={pracaK}>
          <Caixa args={[1.0, 0.08, 0.36]} raio={0.03} cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} position={[0, 0.42, 0]} />
          <Caixa args={[0.08, 0.4, 0.3]} raio={0.02} cor={tema.objetoEscuro} position={[-0.42, 0.2, 0]} />
          <Caixa args={[0.08, 0.4, 0.3]} raio={0.02} cor={tema.objetoEscuro} position={[0.42, 0.2, 0]} />
        </group>
      ) : null}
      <PredioColunas tema={tema} pos={[5.0, PISO + 0.08, -1.0]} aceso={0} escala={0.32 * predK} />

      {/* Cena 0: plenário do Senado; Congresso ao fundo (sempre) */}
      <Congresso tema={tema} pos={CONGRESSO} escala={0.95} aceso={congAceso} />
      <Plenario tema={tema} pos={PLENARIO} escala={0.95 * plenK} acesos={acesos} />

      {/* Cena 2: mesa dos governadores */}
      <MesaRedonda tema={tema} pos={MESA_GOV} raio={1.6} k={govK} />
      {govK > 0.02
        ? Array.from({length: 8}).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
            const sai = i < 3 ? recua : 0;
            const r = 2.25 + 0.7 * sai;
            const p: V3 = [MESA_GOV[0] + Math.sin(a) * r, 0, MESA_GOV[2] + Math.cos(a) * r];
            return <Boneco key={i} tema={tema} pos={p} rotY={a + Math.PI + (i < 3 ? 0.9 * viraCabeca : 0)} escala={0.7 * govK} cor={tema.objeto} pose={{cabeca: [0, i < 3 ? 0.5 * viraCabeca : 0, 0]}} />;
          })
        : null}
      {govK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={[MESA_GOV[0] + 0.6, 0, MESA_GOV[2] + 5.4 - 1.9 * andaGov]} rotY={Math.PI} escala={0.75 * govK} cor={tema.objeto} pose={{ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25, passo: andaGov < 1 ? Math.sin(t * 7) : 0}} />
          <DocumentoGrande tema={tema} pos={[MESA_GOV[0] + 0.3, 0.92 + 0.5 * rampa(t, T.pec, T.pec + 0.5), MESA_GOV[2] + 5.0 - 1.9 * andaGov]} rot={[-0.9, 0, 0]} escala={(0.5 + 0.4 * rampa(t, T.pec, T.pec + 0.5)) * docGov} />
        </group>
      ) : null}
      {/* Cena 2: relator e cartões */}
      {relK > 0.02 ? (
        <group>
          <Caixa args={[2.6, 0.1, 1.2]} raio={0.03} cor={mistura(tema.objeto, tema.objetoClaro, 0.3)} position={soma(MESA_REL, [0, 0.85, 0])} />
          <Caixa args={[2.3, 0.8, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={soma(MESA_REL, [0, 0.4, 0])} />
          <Boneco tema={tema} pos={RELATOR} escala={0.8 * relK} cor={tema.objeto} pose={{ombroD: [-0.6, 0, 0.1], cotoveloD: -0.8}} />
          <DocumentoGrande tema={tema} pos={soma(MESA_REL, [0, 0.92, 0.1])} escala={0.9 * docRel} />
        </group>
      ) : null}
      {cartoes.map((c, i) => {
        const v = voo(t, c.ini, c.cai, i === 3 ? soma(PLACAR, [-1.2, 1.0, 1.0]) : soma(MESA_REL, [0, 1.0, 0.1]), c.ar, soma(c.ar, [0.4, -c.ar[1] + 0.05, 0.8]));
        return <Cartao key={i} tema={tema} pos={v.p} rot={[0, 0, v.giro]} escala={1.1 * v.k} linhas={c.linhas} risco={c.risco} />;
      })}
      {/* Cena 3: placar */}
      <PlacarParede tema={tema} pos={PLACAR} escala={placarK} sim={sim} nao={nao} />

      {/* Cena 4.3: quintal de trás da União */}
      <Trilho tema={tema} pos={[0, 0, -3.1]} comp={8} k={trilhoK} />
      <TremMini tema={tema} pos={[tremX, 0.04, -3.1]} escala={0.8 * trilhoK} aceso={janela(t, T.ferrovias, T.rios, 0.3)} />
      <Rio tema={tema} pos={[0, 0, -4.6]} comp={9} larg={1.3} k={rioK} />
      <NavioMini tema={tema} pos={[-2.4 + 3.4 * rampa(t, T.rios, T.quatro, (x) => x), 0.06, -4.6]} rumo={Math.PI / 2} escala={0.5 * rioK} t={t} />
      <Escudo tema={tema} pos={[-0.3, PISO + 0.08, 1.4]} escala={0.55 * escudoK} acende={escudoK} />
      {faccK > 0.02
        ? [0, 1, 2].map((i) => <Boneco key={i} tema={tema} pos={[-1.2 + i * 0.6, 0, 3.0 + 0.9 * faccRecua]} rotY={Math.PI} escala={0.6 * faccK} cor={tema.objetoEscuro} />)
        : null}
      <Arvore tema={tema} pos={[3.6, 0, -4.2]} k={arvK} />
      <Arvore tema={tema} pos={[4.4, 0, -3.8]} k={arvK * 0.8} />
      <Tora tema={tema} pos={[2.6, 0, -3.9]} k={arvK} />

      {/* Cena 4.4: cofre, cadeado, cano e pré-sal */}
      {cofreK > 0.02 ? (
        <group position={COFRE} scale={1.3 * cofreK}>
          <Cofre tema={tema} pos={[0, 0, 0]} abre={0.3} brilho={pulso(t, T.garantido, 1.0)} />
          {[0, 1, 2, 3].map((i) => (
            <Moeda key={i} tema={tema} pos={[-0.3 + i * 0.2, 1.08 + (i % 2) * 0.06, 0.2]} r={0.14} />
          ))}
        </group>
      ) : null}
      <Cadeado tema={tema} pos={soma(COFRE, [0.2 + 1.6 * cadeadoSai, 1.1 - 0.6 * cadeadoSai, 0.6])} k={0.9 * cadeadoK * (1 - cadeadoSai * 0.6)} fecha={0} />
      <CanoMoedas tema={tema} pontos={[soma(COFRE, [-0.4, 0.7, 0]), [-2.2, 1.4, 3.2], [-4.0, 1.5, 2.4], [-4.0, PISO + 0.5, 1.2]]} k={canoK} fluxo={fluxo * 6} n={12} brilho={luzGov} />
      <PlataformaPetroleo tema={tema} pos={PLATAFORMA} escala={0.9 * platK} luz={platK * 0.5} />
      {moedaVoa > 0.02 && moedaVoa < 0.98 ? <Moeda tema={tema} pos={curva(soma(PLATAFORMA, [0, 1.4, 0]), soma(COFRE, [0, 1.2, 0]), 1.0, moedaVoa)} r={0.18} /> : null}

      {/* Cena 4.5: presídio, pirâmide, bens, vítima */}
      <Presidio tema={tema} pos={PRESIDIO} muro={muro} piramide={piramide} acende={acende} grades={grades} />
      {bensK > 0.02 ? (
        <group position={[PRESIDIO[0] + 1.6, -0.9 * bensAfunda, 3.4]} scale={0.8}>
          <Caixa args={[1.0, 0.36, 0.5]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.3, 0]} />
          <Caixa args={[0.55, 0.26, 0.46]} raio={0.05} cor={tema.objetoEscuro} position={[-0.05, 0.6, 0]} />
          <Caixa args={[0.8, 0.7, 0.7]} raio={0.04} cor={tema.objetoEscuro} position={[1.3, 0.35, -0.2]} />
        </group>
      ) : null}
      <Boneco tema={tema} pos={VITIMA} rotY={0.3} escala={0.7 * vitK} cor={tema.pessoa} />
      <BalancaJustica tema={tema} pos={soma(VITIMA, [0.9, 0, 0.5])} escala={0.45 * justK} inclina={0} brilhoEsq={justK * 0.6} brilhoDir={justK * 0.6} />

      {/* Cena 5: cela, urna, balança, conselhos */}
      <Cela tema={tema} pos={CELA} k={celaK} />
      <Boneco tema={tema} pos={soma(CELA, [0, 0.1, -0.1])} escala={0.6 * presoK} cor={tema.pessoa} />
      {urnaK > 0.02 ? <Urna tema={tema} pos={URNA} rotY={-0.3} escala={0.75 * urnaK} /> : null}
      <Cadeado tema={tema} pos={soma(URNA, [0.1, 0.78, 0.25])} k={0.7 * fechaUrna * urnaK} fecha={fechaUrna} />
      <Balanca tema={tema} pos={BALANCA} escala={0.6 * balK} inclina={inclina} />
      <PredioSigla tema={tema} pos={CNJ} sobe={conselhosK} aceso={rampa(t, T.juizes, T.juizes + 0.4) * conselhosK} sigla="CNJ" />
      <PredioSigla tema={tema} pos={CNMP} sobe={conselhosK} aceso={rampa(t, T.juizes, T.juizes + 0.4) * conselhosK} sigla="CNMP" />
      {regraK > 0.02 ? (
        <group position={[4.6, 0, -14.2]}>
          <Placa tema={tema} pos={[0, 1.7 + 0.5 * regraK, 0]} larg={1.6} alt={1.4} linhas={[{t: 'REGRA', tam: 200, cor: tema.tinta, peso: 900}, {t: ' ', tam: 200, cor: tema.tinta}, {t: ' ', tam: 200, cor: tema.tinta}]} fundo={tema.objetoClaro} />
          {carimboK > 0.02 ? (
            <group>
              <Carimbo3D tema={tema} pos={[0.2, 2.2 + 0.8 * carimboDesce, 0.3]} escala={0.7 * carimboK} />
              <group position={[0, 1.55, 0.05]} scale={carimboK * (1 - carimboDesce * 0.8)}>
                <Placa tema={tema} pos={[0, 0, 0]} rot={[0, 0, -0.12]} larg={1.4} alt={0.34} linhas={[{t: 'BARRADO', tam: 220, cor: tema.acento, peso: 900}]} />
              </group>
            </group>
          ) : null}
        </group>
      ) : null}

      {/* Cena 6: o livro com a porta */}
      <LivroPorta tema={tema} pos={LIVRO} escala={1.05 * livroK} abre={abre} itens={itens} titulo={tituloLei} />

      {/* Cena 7: outra PEC indo para o Congresso */}
      {outraK > 0.02 ? <DocumentoGrande tema={tema} pos={curva([-6.2, 1.2, 2.4], [-2, 2.4, -10], 3, outraVoa)} rot={[-0.6, 0.4, 0]} escala={0.8 * outraK} /> : null}

      {/* Cena 8: Diário Oficial, Lula e o andar em obra */}
      <DiarioOficial tema={tema} pos={soma(DIARIO, [0, 0.9, 0])} rot={[-0.9, 0, 0]} escala={2.4 * diarioK} destaque={diarioK} />
      {diarioK > 0.02 ? <Caixa args={[1.6, 0.9, 1.0]} raio={0.04} cor={tema.objetoEscuro} position={soma(DIARIO, [0, 0.45, 0])} /> : null}
      <Boneco tema={tema} pos={LULA} rotY={0.5} escala={0.8 * lulaK} cor={tema.objeto} pose={{ombroD: [0, 0, 1.2 * rampa(t, T.passo, T.passo + 0.4)], cotoveloD: -0.6}} />
      <AndarObra tema={tema} pos={[0, PISO + CASA.alt + 0.2, 0]} sobe={obraSobe} placa={obraPlaca} material={obraMat} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1.4, -13.5], 9.5, 6, [0.1, 0.55, 1])], [T.mexe, E([0, 1.4, -13.5], 8.5, 5.4, [0.05, 0.55, 1])], [T.mexe + 1.0, E([0.5, 2.0, -2], 16, 10, [0, 0.9, 1])], [T.primeiro - 0.2, E(soma(VOCE, [0, 0.8, 0]), 4.6, 3.2, [-0.05, 0.75, 1])]]},
  {ini: T.primeiro, chaves: [[T.primeiro, E([0, 1.6, 0.6], 14, 7, [0, 0.62, 1])], [T.governador - 0.3, E([0, 1.6, 0.6], 13, 6.6, [0.08, 0.6, 1])], [T.governador, E([-4, PISO + 1.2, 0.4], 5.2, 3.6, [0.05, 0.55, 1])], [T.uniao, E([0, PISO + 1.2, 0.4], 5.2, 3.6, [0, 0.55, 1])], [T.prefeitura, E([4, PISO + 1.1, 0.4], 5.2, 3.6, [-0.05, 0.55, 1])], [T.resultado, E([4.2, PISO + 1.1, 0.4], 5.0, 3.5, [-0.1, 0.55, 1])]]},
  {ini: T.resultado, chaves: [[T.resultado, E([0, 1.6, 0.6], 14, 7, [0, 0.62, 1])], [T.porIsso, E([0, 1.6, 0.6], 14, 7, [0, 0.62, 1])]]},
  {ini: T.porIsso, arco: 0.15, chaves: [[T.porIsso, E(soma(MESA_GOV, [0, 1.0, 1.0]), 7.5, 5, [0.2, 1.1, 1])], [T.naCamara - 0.3, E(soma(MESA_GOV, [0, 1.0, 1.0]), 7, 4.8, [0.3, 1.1, 1])], [T.naCamara + 0.6, E(soma(RELATOR, [0, 1.6, 1.4]), 6.4, 4.4, [0, 0.95, 1])], [T.aprova - 0.2, E(soma(RELATOR, [0, 1.4, 1.6]), 5.8, 4.0, [0.05, 0.9, 1])]]},
  {ini: T.aprova, chaves: [[T.aprova, E([1.5, 2.2, -14.5], 12, 7, [0.05, 0.85, 1])], [T.n487, E(soma(PLACAR, [-0.3, 1.8, 0]), 6.0, 4.6, [0, 0.7, 1])], [T.senado, E([1.5, 2.2, -14.5], 12, 7, [0.05, 0.85, 1])], [T.ontem - 0.1, E(soma(PLACAR, [-0.6, 1.8, 0]), 6.6, 4.8, [0, 0.72, 1])], [T.agora - 0.2, E(soma(PLACAR, [0, 1.8, 0]), 5.6, 4.3, [0, 0.7, 1])]]},
  {ini: T.agora, chaves: [[T.agora, E([0, 4, -8], 18, 10, [0, 0.7, 1])], [T.um, E([0, 1.6, 0.6], 14, 7, [0, 0.62, 1])], [T.comPolicia - 0.2, E([0, 1.6, 0], 13, 6.4, [0, 0.95, 1])], [T.dois, E([0, 1.6, 0], 12.4, 6.2, [0.04, 0.97, 1])]]},
  {ini: T.dois, chaves: [[T.dois, E([0, 1.6, 0], 12.4, 6.2, [0.04, 0.97, 1])], [T.tresN, E([0, 1.6, 0], 12.4, 6.2, [0.04, 0.97, 1])]]},
  {ini: T.tresN, arco: 0.12, chaves: [[T.tresN, E([0, 0.8, -3.9], 6.6, 3.8, [0.15, 0.75, -1])], [T.pf - 0.2, E([0.3, 0.8, -3.9], 6.2, 3.6, [0.3, 0.75, -1])], [T.pf + 0.2, E([-0.4, 1.0, 2.0], 6.4, 4.4, [0.05, 0.55, 1])], [T.quatro - 0.2, E([-0.4, 1.0, 2.2], 6.0, 4.2, [0.1, 0.55, 1])]]},
  {ini: T.quatro, chaves: [[T.quatro, E([0.4, 1.0, 3.0], 6.0, 4.0, [0.05, 0.5, 1])], [T.metade, E([-1.8, 1.2, 2.6], 8.6, 5, [0.05, 0.55, 1])], [T.n10, E([1.2, 1.1, 3.0], 7.4, 4.6, [-0.05, 0.5, 1])], [T.cincoN - 0.2, E([1.6, 1.1, 3.0], 7.0, 4.4, [-0.1, 0.5, 1])]]},
  {ini: T.cincoN, arco: 0.1, chaves: [[T.cincoN, E(soma(PRESIDIO, [0, 1.0, 0.2]), 4.8, 3.4, [0, 0.55, 1])], [T.maxima, E(soma(PRESIDIO, [0, 1.6, 0.2]), 6.6, 5.0, [0, 0.7, 1])], [T.vitima - 0.2, E(soma(PRESIDIO, [-1.8, 1.4, 1.6]), 7.4, 5, [0, 0.62, 1])], [T.ninguem - 0.2, E(soma(VITIMA, [0.8, 1.0, 0.4]), 5, 3.8, [0.1, 0.55, 1])]]},
  {ini: T.ninguem, arco: 0.06, chaves: [[T.ninguem, E([10.6, 1.2, 3.4], 6.8, 4.4, [0, 0.62, 1])], [T.especialistas, E([11.6, 1.2, 3.6], 6.0, 4.2, [0, 0.6, 1])], [T.congresso - 0.2, E([11.6, 1.2, 3.6], 5.8, 4.0, [0.05, 0.6, 1])], [T.congresso + 0.6, E([5.6, 1.8, -14.8], 5.6, 4.0, [0, 0.62, 1])], [T.atencao - 0.2, E([5.4, 1.8, -14.8], 5.0, 3.8, [0.05, 0.6, 1])]]},
  {ini: T.atencao, chaves: [[T.atencao, E(soma(LIVRO, [0, 1.9, 0]), 4.8, 4.4, [0, 0.35, 1])], [T.naoMuda - 0.2, E(soma(LIVRO, [0, 1.6, 0]), 3.6, 3.6, [0, 0.3, 1])]]},
  {ini: T.naoMuda, arco: 0.1, chaves: [[T.naoMuda, E([-4, PISO + 1.2, 0.4], 6, 4, [0.1, 0.55, 1])], [T.outraPec - 0.4, E([-4, PISO + 1.2, 0.4], 5.6, 3.8, [0.15, 0.55, 1])], [T.falta - 0.2, E([-4.4, 1.6, -2], 9, 6, [0.15, 0.55, 1])]]},
  {ini: T.falta, chaves: [[T.falta, E(soma(DIARIO, [0, 1.1, 0]), 3.8, 2.8, [0, 0.95, 1])], [T.lula - 0.2, E(soma(DIARIO, [0, 1.1, 0]), 3.5, 2.6, [0.05, 0.95, 1])], [T.lula + 0.5, E([-2.0, 2.6, 1.0], 15, 9, [0, 0.55, 1])], [T.eAi, E([-1.0, 3.4, 0.6], 14, 9, [0, 0.62, 1])]]},
  {ini: T.eAi, chaves: [[T.eAi, E([0, 3, 0.6], 14, 9, [0, 0.62, 1])], [FIM, E([0, 3, 0.6], 15, 9.5, [0, 0.62, 1])]]},
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
  {a: T.seguranca, b: T.primeiro, texto: 'SEGURANÇA PÚBLICA'},
  {a: T.em2018, b: T.intervencao, texto: '2018', destaque: true},
  {a: T.leiComum, b: T.porIsso, texto: 'SÓ LEI COMUM'},
  {a: T.constituicao1, b: T.naCamara, texto: 'PEC = PROPOSTA PARA MUDAR A CONSTITUIÇÃO', destaque: true},
  {a: T.tres, b: T.aprova, texto: 'A CÂMARA TIRA 3 COISAS'},
  {a: T.marco, b: T.n487, texto: 'MARÇO DE 2026'},
  {a: T.senado, b: T.ontem, texto: 'SENADO SÓ CORTA AS BETS'},
  {a: T.deixar, b: T.n38, texto: 'TIRAR A MAIORIDADE DA PEC'},
  {a: T.cinco, b: T.um, texto: '5 MUDANÇAS', destaque: true},
  {a: T.um, b: T.sus, texto: 'SUSP NA CONSTITUIÇÃO', destaque: true},
  {a: T.sus, b: T.dados, texto: 'COMO O SUS, SÓ QUE COM POLÍCIA'},
  {a: T.dados, b: T.dois, texto: 'DADOS E OPERAÇÕES JUNTOS', destaque: true},
  {a: T.dinheiroProprio, b: T.treinamento, texto: '✓ DINHEIRO PRÓPRIO'},
  {a: T.treinamento, b: T.avaliacao, texto: '✓ TREINAMENTO PADRÃO'},
  {a: T.avaliacao, b: T.mp, texto: '✓ AVALIAÇÃO REGULAR'},
  {a: T.mp, b: T.tresN, texto: '✓ MINISTÉRIO PÚBLICO DE OLHO'},
  {a: T.prf, b: T.pf, texto: 'PRF: FERROVIAS E RIOS FEDERAIS', destaque: true},
  {a: T.pf, b: T.quatro, texto: 'PF: FACÇÕES E CRIME AMBIENTAL'},
  {a: T.garantido, b: T.metade, texto: 'FUNDOS SEM BLOQUEIO', destaque: true},
  {a: T.faccao, b: T.pena, texto: 'FACÇÃO E MILÍCIA'},
  {a: T.pena, b: T.beneficios, texto: 'QUANTO MAIS ALTO, MAIOR A PENA', destaque: true},
  {a: T.beneficios, b: T.vitima, texto: 'MENOS BENEFÍCIOS · PERDA DE BENS'},
  {a: T.vitima, b: T.ninguem, texto: 'MAIS APOIO À VÍTIMA'},
  {a: T.definitiva, b: T.provisoria, texto: 'SEM CONDENAÇÃO DEFINITIVA'},
  {a: T.provisoria, b: T.especialistas, texto: 'PRISÃO PROVISÓRIA: NÃO VOTA', destaque: true},
  {a: T.especialistas, b: T.congresso, texto: 'ESPECIALISTAS DIVERGEM'},
  {a: T.congresso, b: T.atencao, texto: 'CONGRESSO PODE BARRAR REGRAS DO CNJ E DO CNMP'},
  {a: T.leiNova, b: T.pmCivil, texto: 'AINDA DEPENDE DE LEI NOVA', destaque: true},
  {a: T.comGov, b: T.maioridade, texto: 'PM E CIVIL: CONTINUA IGUAL'},
  {a: T.outraPec, b: T.falta, texto: 'MAIORIDADE: OUTRA PEC'},
  {a: T.publicar, b: T.sem, texto: 'PROMULGAR = PUBLICAR', destaque: true},
  {a: T.sem, b: T.lula, texto: 'SEM SANÇÃO DO PRESIDENTE'},
  {a: T.ministerio, b: T.eAi, texto: 'MINISTÉRIO: AINDA NÃO EXISTE'},
];
const SELOS: Txt[] = [
  {a: T.n75 + 0.1, b: T.mexe, texto: 'FONTE: AGÊNCIA SENADO, 03/11/2026'},
  {a: T.n1988, b: T.governador, texto: 'FONTE: CONSTITUIÇÃO, ART. 144'},
  {a: T.intervencao, b: T.susp, texto: 'FONTE: DECRETO 9.288/2018'},
  {a: T.susp, b: T.porIsso, texto: 'FONTE: LEI 13.675/2018'},
  {a: T.n2024, b: T.parte, texto: 'FONTE: AGÊNCIA BRASIL, 31/10/2024'},
  {a: T.naCamara, b: T.aprova, texto: 'FONTE: AGÊNCIA CÂMARA, 05/03/2026'},
  {a: T.n487, b: T.senado, texto: 'FONTE: AGÊNCIA CÂMARA, 04/03/2026'},
  {a: T.bets, b: T.dividiu, texto: 'FONTE: AGÊNCIA SENADO, 03/11/2026'},
  {a: T.n38, b: T.agora, texto: 'FONTE: AGÊNCIA SENADO, 03/11/2026'},
  {a: T.agora, b: T.um + 1.5, texto: 'FONTE: TEXTO DA PEC 18/2025 · AG. SENADO E AG. CÂMARA'},
  {a: T.provisoria, b: T.especialistas + 1.0, texto: 'FONTE: AGÊNCIA CÂMARA, 04/03/2026'},
  {a: T.lula, b: T.eAi, texto: 'FONTE: METRÓPOLES, 03/11/2026'},
];
type Num = {a: number; b: number; valor: string; rotulo: string; acento?: boolean};
const NUMEROS: Num[] = [
  {a: T.n75, b: T.seguranca, valor: '75 × 0', rotulo: 'SENADO · 2º TURNO', acento: true},
  {a: T.n2024, b: T.pec, valor: '2024', rotulo: 'A PEC VAI AOS GOVERNADORES'},
  {a: T.n487, b: T.senado, valor: '487 × 15', rotulo: 'CÂMARA · 1º TURNO'},
  {a: T.ontem, b: T.deixar, valor: '75 × 0', rotulo: 'SENADO · 2º TURNO', acento: true},
  {a: T.n38, b: T.agora, valor: '38 × 36', rotulo: 'SEPARAR A MAIORIDADE'},
  {a: T.metade, b: T.n10, valor: '50%', rotulo: 'DOS FUNDOS PARA OS ESTADOS', acento: true},
  {a: T.n10, b: T.cincoN, valor: '10%', rotulo: 'DA SOBRA DO FUNDO SOCIAL DO PRÉ-SAL'},
  {a: T.maioridade, b: T.outraPec, valor: '18 ANOS*', rotulo: 'MAIORIDADE PENAL, POR ENQUANTO'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 21, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.rua, b: T.primeiro, p: soma(VOCE, [0, 1.6, 0]), texto: 'VOCÊ', acento: true},
  {a: T.pm, b: T.uniao, p: [-4.5, PISO + 1.55, 0.5], texto: 'PM'},
  {a: T.civil, b: T.uniao, p: [-3.2, PISO + 1.55, 0.2], texto: 'CIVIL'},
  {a: T.federal, b: T.prefeitura, p: [-0.6, PISO + 1.55, 0.4], texto: 'FEDERAL'},
  {a: T.rodoviaria, b: T.prefeitura, p: [0.7, PISO + 1.55, 0.3], texto: 'RODOVIÁRIA'},
  {a: T.governo, b: T.parte, p: [MESA_GOV[0] + 0.6, 1.7, MESA_GOV[2] + 3.6], texto: 'GOVERNO'},
  {a: T.governadores, b: T.naCamara, p: [MESA_GOV[0], 2.2, MESA_GOV[2] - 1.5], texto: 'GOVERNADORES'},
  {a: T.relator, b: T.tres + 0.5, p: soma(RELATOR, [0, 1.8, 0]), texto: 'RELATOR: MENDONÇA FILHO'},
  {a: T.fundos, b: T.metade, p: soma(COFRE, [0, 1.4, 0]), texto: 'FUNDO NACIONAL DE SEGURANÇA'},
  {a: T.presidios, b: T.metade, p: soma(COFRE, [0, 0.6, 0]), texto: 'FUNDO PENITENCIÁRIO'},
  {a: T.estados, b: T.n10, p: [-4.0, PISO + 2.2, 0.8], texto: 'ESTADOS', acento: true},
  {a: T.presal, b: T.cincoN, p: soma(PLATAFORMA, [0, 1.8, 0]), texto: 'FUNDO SOCIAL DO PRÉ-SAL'},
  {a: T.vitima, b: T.ninguem, p: soma(VITIMA, [0, 1.6, 0]), texto: 'VÍTIMA'},
  {a: T.preso, b: T.especialistas, p: soma(CELA, [0, 2.4, 0]), texto: 'PRESO SEM CONDENAÇÃO'},
  {a: T.discutem, b: T.inocencia + 0.6, p: soma(BALANCA, [-1.0, 1.5, 0]), texto: 'É PROTEÇÃO'},
  {a: T.fere, b: T.inocencia + 0.6, p: soma(BALANCA, [1.0, 1.5, 0]), texto: 'FERE A PRESUNÇÃO'},
  {a: T.lula, b: T.eAi, p: soma(LULA, [0, 1.8, 0]), texto: 'LULA'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 17 : 21, fontWeight: 700, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const num = NUMEROS.filter((n) => t >= n.a - 0.05 && visivel(n, t) > 0.01).pop();
  const chip = num ? undefined : CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 36 ? 22 : chip.texto.length > 26 ? 27 : 32} />
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
  if (noMapa(t)) return (
    <>
      {selo ? seloDe(selo) : null}
      {chipEl}
      {fimEl}
    </>
  );
  // os 5 marcadores das mudanças
  const marcK = vis(t, T.cinco, T.ninguem);
  const marcAceso = [T.um, T.dois, T.tresN, T.quatro, T.cincoN].map((a) => rampa(t, a, a + 0.3));
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 190, Math.min(SEGURO.botoesX - 190, x)), top: Math.max(680, Math.min(1260, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 26, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y, k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  // rótulos que se encostam: um embaixo do outro, o mais antigo em cima (regra do 016)
  visRot.sort((a, b) => a.i - b.i);
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 60) visRot[a].y = visRot[b].y + 62;
  return (
    <>
      {num ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 476, display: 'flex', justifyContent: 'center'}}>
          <Numero tema={tema} valor={num.valor} rotulo={num.rotulo} k={visivel(num, t)} cor={num.acento ? tema.acento : undefined} />
        </div>
      ) : null}
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {marcK > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1290, display: 'flex', justifyContent: 'center', gap: 18, opacity: marcK}}>
          {marcAceso.map((k, i) => (
            <div key={i} style={{width: 52, height: 52, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mistura(tema.cartao, tema.acento, k), border: `2px solid ${k > 0.5 ? tema.acento : tema.cartaoBorda}`, fontFamily: MONO, fontSize: 26, fontWeight: 800, color: k > 0.5 ? tema.texto : tema.textoSuave}}>
              {i + 1}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, ate >= QUADROS ? 1 : 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/pec.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.mexe, T.resultado, T.porIsso, T.naCamara, T.agora, T.dois, T.tresN, T.quatro, T.cincoN, T.congresso, T.atencao, T.falta, T.eAi].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.24}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.16}));
  s.push({t: T.n75, f: 'subida', v: 0.24});
  s.push({t: T.zero, f: 'ding', v: 0.3});
  s.push({t: T.rua, f: 'pop', v: 0.22});
  s.push({t: T.n1988, f: 'impacto', v: 0.2});
  [0, 0.25, 0.5].forEach((d) => s.push({t: T.donos + d, f: 'pop', v: 0.14}));
  [T.pm, T.civil, T.federal, T.rodoviaria, T.guarda, T.praca].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  s.push({t: T.dados + 0.2, f: 'bip', v: 0.16});
  s.push({t: T.governo, f: 'pop', v: 0.18});
  s.push({t: T.pec, f: 'pop', v: 0.22});
  s.push({t: T.parte + 0.2, f: 'baque', v: 0.14});
  [T.exclusivo + 0.4, T.troca + 0.4, T.reducao + 0.5, T.devolver + 0.2].forEach((t) => s.push({t: t + 0.7, f: 'baque', v: 0.2}));
  s.push({t: T.n487, f: 'subida', v: 0.24});
  s.push({t: T.ontem, f: 'subida', v: 0.24});
  s.push({t: T.zero2, f: 'ding', v: 0.3});
  s.push({t: T.n38, f: 'subida', v: 0.22});
  s.push({t: T.n36, f: 'baque', v: 0.2});
  [T.um, T.dois, T.tresN, T.quatro, T.cincoN].forEach((t) => s.push({t, f: 'tique', v: 0.2}));
  s.push({t: T.suspEntra, f: 'impacto', v: 0.2});
  s.push({t: T.comPolicia, f: 'ding', v: 0.26});
  [T.dinheiroProprio, T.treinamento, T.avaliacao, T.mp].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.ferrovias, f: 'pop', v: 0.2});
  s.push({t: T.rios, f: 'pop', v: 0.2});
  s.push({t: T.pf, f: 'pop', v: 0.2});
  s.push({t: T.garantido, f: 'ding', v: 0.22});
  s.push({t: T.bloquear + 0.4, f: 'baque', v: 0.18});
  s.push({t: T.metade, f: 'subida', v: 0.22});
  s.push({t: T.n10, f: 'pop', v: 0.22});
  s.push({t: T.faccao, f: 'pop', v: 0.18});
  s.push({t: T.pena, f: 'impacto', v: 0.24});
  s.push({t: T.maxima, f: 'baque', v: 0.2});
  s.push({t: T.bens, f: 'baque', v: 0.16});
  s.push({t: T.vitima, f: 'pop', v: 0.18});
  s.push({t: T.votar, f: 'pop', v: 0.2});
  s.push({t: T.enquanto, f: 'impacto', v: 0.18});
  s.push({t: T.especialistas, f: 'pop', v: 0.16});
  s.push({t: T.areaPenal, f: 'impacto', v: 0.3});
  s.push({t: T.porta, f: 'whoosh', v: 0.16});
  s.push({t: T.leiNova, f: 'pop', v: 0.2});
  s.push({t: T.maioridade, f: 'pop', v: 0.2});
  s.push({t: T.outraPec, f: 'whoosh', v: 0.14});
  s.push({t: T.publicar, f: 'pop', v: 0.2});
  s.push({t: T.passo, f: 'subida', v: 0.2});
  s.push({t: T.ministerio, f: 'pop', v: 0.2});
  s.push({t: T.meConta, f: 'ding', v: 0.24});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.nenhum + 0.6, T.mexe + 0.7, T.rua + 0.5, T.n1988 + 0.6, T.donos + 0.8, T.pm + 0.8, T.federal + 0.8, T.guarda + 0.8, T.predio + 0.4,
  T.dados + 0.4, quando('atravessa') + 0.8, T.intervencao + 1.2, T.susp + 1.2, T.leiComum + 0.6,
  T.n2024 + 0.6, T.pec + 0.6, T.nariz + 0.6, T.relator + 0.4, T.exclusivo + 0.3, T.reducao + 0.6, T.n487 + 1.0, T.bets + 0.6, T.ontem + 0.9, T.n36 + 0.4,
  T.agora + 1.2, T.suspEntra + 0.6, T.comPolicia + 1.0, T.dados + 0.5, quando('polícia municipal') + 0.6, T.mp + 0.5,
  T.ferrovias + 0.8, T.rios + 0.5, T.faccoes + 0.6, T.garantido + 0.6, T.bloquear + 0.5, T.metade + 1.0, T.sobra + 0.6,
  T.faccao + 0.8, T.pena + 0.8, T.maxima + 0.8, T.bens + 0.4, T.apoio + 0.4,
  T.provisoria + 0.6, T.enquanto + 0.6, T.fere + 0.4, T.juizes + 0.4, T.areaPenal + 0.5,
  T.porta + 0.8, T.leiNova + 0.4, T.pmCivil + 0.8, T.maioridade + 0.6, T.outraPec + 0.4,
  T.publicar + 0.5, T.lula + 0.6, T.ministerio + 0.8, T.meConta + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const PecSeguranca: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={26} centro={[2, 0, -6]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
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
      <Sequence from={MAPA_C.de} durationInFrames={MAPA_C.ate - MAPA_C.de} layout="none">
        <TrechoMapa {...MAPA_C} />
      </Sequence>
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="PEC da Segurança" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['PEC', 'SEGURANÇA', 'PÚBLICA.', 'O que muda', 'na sua', 'segurança?'];
export const CapaPecSeguranca: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.length > 4 ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · PEC DA SEGURANÇA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap', marginTop: k === 3 ? 28 : 0}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
