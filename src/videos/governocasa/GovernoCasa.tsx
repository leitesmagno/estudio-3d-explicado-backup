import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Onda, Palco, Particulas, Placa, cinematizar, distancia, enquadrar, focarEm, projetar, trilhoCam, type Cam, type Foco, type V3} from '../../base/pecas';
import {Chip, Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {cai, clamp, criarQuando, entra, k01, mola, pulso, rampa, sai, sumir} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Banco, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {
  Balanca, BarraFixa, Barril, CalendarioGrande, CartaoCredito, CasaMini, CofreFGTS, Cadeira, Contracheque, CuboFatias, DocumentoGrande, Engrenagem, EscolaSimples, Escritorio, Escudo,
  EtiquetaPreco, FabricaCarroVoador, Ficha, Guindaste, Jatinho, Jornal, LinhaChao, LinhaLimite, Lupa, MarcoAno, Medidor, MesaAcordo, Meses, MoedaCor, Notebook, OrgaoPublico, Pedestal, PilhaMoedas,
  Poste, PrediozinhoFumaca, Racha, Recibo, SetasTroca, TagPorcento, Torneira, TrilhoMoedas, trajeto, type FatiaInfo,
} from '../../pecas';
import {CampoPlantacao, CanoVazando, EsteiraTitulos, LinhaCem, MoedaReal, PERIM_OVAL, PASSO_BLOCO, PlataformaPetroleo, Tesoura, TituloPublico, TorreDivida, ovalPonto} from './pecas';
import {PALAVRAS} from './palavras';

// 003. o governo não é a sua casa (perfil @eumagnoleite, série Magno Explica).
// Mundo único: a casinha da família na beira da praça do país (Tesouro, Banco Central, esteira dos títulos).
// Em volta, um bairro por assunto: Rua das Dívidas (esquerda), Linha do Tempo 1999 a 2014 com a Selic (direita),
// quarteirão do Banco Central (fundo), serviços públicos e ralos do dinheiro (frente) e a vitrine das empresas (frente).
// Tudo entra na hora da palavra: tabela T logo abaixo (plano: projetos/003. o governo não é a sua casa/plano.md, versão 2).

export const FPS = 30;
const AUDIO_SEG = 162.77; // duração medida de audio/narracao-norm.wav
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '003. o governo não é a sua casa';

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);

const T = {
  // 1. a casa e o Estado
  voce: quando('Você sabia'),
  governo1: quando('o governo não funciona'),
  orcamento: quando('orçamento'),
  suaCasa: quando('sua casa'),
  familia: quando('família'),
  ganhar: quando('ganhar dinheiro'),
  gastar: quando('gastar'),
  estado: quando('Estado brasileiro'),
  moeda: quando('moeda própria'),
  financia: quando('financia'),
  vendendo: quando('vendendo títulos'),
  dividaPub: quando('dívida pública'),
  // 2. rolagem
  eSabe: quando('E sabe'),
  sabe: quando('sabe o mais'),
  quitar: quando('não precisa quitar'),
  umaVez: quando('de uma vez'),
  rolar: quando('rolar'),
  vencem: quando('paga os que vencem'),
  novos: quando('emitindo novos'),
  // 3. limites
  masIsso: quando('Mas isso'),
  naoSignifica: quando('não significa'),
  semLimites: quando('sem limites'),
  inflacao1: quando('Inflação, capacidade'),
  capacidade: quando('capacidade produtiva'),
  sustent: quando('sustentabilidade'),
  fundamentais: quando('fundamentais'),
  // 4. quem deve mais
  eOBrasil: quando('E o Brasil'),
  brasilEsta: quando('Brasil está'),
  endividado: quando('endividado'),
  japao: quando('Japão'),
  p200: quando('200%'),
  eua: quando('Estados Unidos'),
  tri40: quando('40 trilhões'),
  p120: quando('120%'),
  china: quando('governo chinês'),
  p100: quando('100%'),
  segundoFmi: quando('segundo o FMI'),
  bruta: quando('dívida bruta'),
  p83: quando('83%'),
  criterioBc: quando('critério do Banco'),
  criterioFmi: quando('critério do FMI'),
  p90: quando('90%'),
  // 5. o custo
  ouSeja: quando('Ou seja: não'),
  naoSomos: quando('não somos'),
  maisEnd: quando('mais endividados'),
  emergente: quando('país emergente'),
  alta: quando('alta'),
  maisPesa: quando('mais pesa'),
  custoJuros: quando('custo: os juros'),
  // 6. a culpa é só do gasto? / superávit
  entao: quando('Então por que'),
  taoAltos: quando('tão altos'),
  muitaGente: quando('Muita gente'),
  nosGastos: quando('nos gastos'),
  detalhe: quando('detalhe'),
  a1999: quando('1999'),
  a2013: quando('2013'),
  setorPublico: quando('setor público'),
  superavit: quando('superávit primário'),
  todosAnos: quando('todos os anos'),
  arrecadava: quando('arrecadava'),
  gastava: quando('gastava'),
  semContar: quando('sem contar os juros'),
  // 7. mesmo assim
  eAdivinha: quando('E adivinha'),
  adivinha: quando('adivinha'),
  mesmoAssim: quando('Mesmo assim'),
  jurosReais: quando('juros reais'),
  maisAltos: quando('mais altos do mundo'),
  gastoPublico: quando('gasto público'),
  naoExplica: quando('não explica tudo'),
  inflacao2: quando('Inflação, câmbio'),
  cambio: quando('câmbio'),
  crises: quando('histórico de crises'),
  credito1: quando('mercado de crédito'),
  tambemPesam: quando('também pesam'),
  // 8. expectativas
  outroFator: quando('Outro fator'),
  expectativas: quando('as expectativas'),
  todaSemana: quando('Toda semana'),
  focus: quando('Boletim Focus'),
  bancos: quando('bancos'),
  consultorias: quando('consultorias'),
  fInfl: quando('inflação, juros'),
  fJuros: quando('juros e crescimento'),
  fCresc: quando('crescimento'),
  essasPrev: quando('essas previsões'),
  erram: quando('erram'),
  bcConsidera: quando('Banco Central considera'),
  outrosInd: quando('outros indicadores'),
  decidir: quando('decidir a Selic'),
  // 9. Selic alta
  eQuem: quando('E quem ganha'),
  quemGanha: quando('quem ganha'),
  selicElevada: quando('Selic elevada'),
  aplicacoes: quando('aplicações'),
  atreladas: quando('atreladas aos juros'),
  posFixados: quando('pós-fixados'),
  recebe: quando('recebe mais'),
  creditoFica: quando('crédito fica'),
  empresas: quando('empresas'),
  investemMenos: quando('investem menos'),
  governoGasta: quando('governo gasta'),
  jurosDivida2: quando('juros da dívida', 2),
  // 10. a solução
  masQual: quando('Mas qual'),
  qualSeria: quando('qual seria'),
  cortando: quando('cortando saúde'),
  saude: quando('saúde'),
  educacao1: quando('educação e investimentos'),
  investimentos: quando('investimentos'),
  combater: quando('combater'),
  privilegios: quando('privilégios'),
  supersalarios: quando('supersalários'),
  desperdicios: quando('desperdícios'),
  subsidios: quando('subsídios ineficientes'),
  gestao: quando('gestão'),
  recursos: quando('recursos públicos'),
  // 11. investir
  aoMesmo: quando('Ao mesmo'),
  investirEm: quando('investir em'),
  ciencia: quando('ciência'),
  tecnologia: quando('tecnologia'),
  infra: quando('infraestrutura'),
  educacao2: quando('educação', 2),
  invPublico: quando('investimento público'),
  longoPrazo: quando('longo prazo'),
  embrapa: quando('Embrapa'),
  petrobras: quando('Petrobras'),
  embraer: quando('Embraer'),
  nasceu: quando('nasceu como estatal'),
  // 12. o debate
  portanto: quando('Portanto'),
  vila: quando('vilã'),
  debate: quando('verdadeiro debate'),
  pagamos: quando('pagamos de juros'),
  sustentaveis: quando('contas sustentáveis'),
  dinheiroPub: quando('dinheiro público'),
  cortandoGastos: quando('cortando gastos'),
  investirNo: quando('investir no'),
  futuro: quando('futuro'),
  segue: quando('segue'),
  arroba: quando('@eumagnoleite'),
  bolso: quando('bolso'),
};
const FIM = AUDIO_SEG + 0.9;

const ESTADOS: [number, string][] = [
  [0, 'SUA CASA'],
  [T.estado, 'O ESTADO'],
  [T.eSabe, 'ROLAGEM'],
  [T.masIsso, 'OS LIMITES'],
  [T.eOBrasil, 'QUEM DEVE MAIS'],
  [T.ouSeja, 'O CUSTO'],
  [T.entao, 'OS JUROS'],
  [T.a1999, 'SUPERÁVIT'],
  [T.eAdivinha, 'MESMO ASSIM'],
  [T.outroFator, 'EXPECTATIVAS'],
  [T.eQuem, 'SELIC ALTA'],
  [T.masQual, 'A SOLUÇÃO'],
  [T.aoMesmo, 'INVESTIR'],
  [T.portanto, 'O DEBATE'],
  [T.segue, 'SEGUE'],
];

// ---------- Câmera ----------
const pj = (p: V3, cam: Cam) => projetar(p, cam, W, H);
// Direção pela órbita (graus): `az` 0 = de frente (z+), positivo = pela direita; `el` = ângulo acima do chão.
const D = (az: number, el: number): V3 => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
};
const enq = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const vivo = (c: Cam, k: number, sentido = 1) => cinematizar(c, k, {lente: 1, arco: 0.07, grua: 0.025, sentido});

// ---------- Mapa do mundo (plano.md, seção 2) ----------
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
// casa e família
const CASA: V3 = [0, 0, 9];
const ADULTO: V3 = [-1.6, 0, 10.3];
const CRIANCA: V3 = [-0.95, 0, 10.6];
const SALARIO: V3 = [2.3, 0, 9.6];
const RECIBO: V3 = [3.3, 0, 8.4];
// praça do Estado
const TESOURO: V3 = [-3.5, 0, -1];
const BC: V3 = [3.8, 0, -1.5];
const MOEDA_R: V3 = [0, 0, -0.6];
const PILHA_TIT: V3 = [-3.5, 0, 1.2];
const INVEST: V3[] = [0, 1, 2, 3].map((i) => [5.0 + i * 0.75, 0, 3.4 + (i % 2) * 0.35]);
const ESTEIRA: V3 = [0, 0, 3];
// limites
const MEDIDORES: {x: number; label: string}[] = [
  {x: 4.6, label: 'INFLAÇÃO'},
  {x: 7.0, label: 'CAPACIDADE'},
  {x: 9.4, label: 'DÍVIDA'},
];
const Z_MED = 5.8;
// Rua das Dívidas: 1 bloco = 10% do PIB
const PAISES: {nome: string; x: number; blocos: number}[] = [
  {nome: 'JAPÃO', x: -10, blocos: 20.5},
  {nome: 'EUA', x: -13.3, blocos: 12.5},
  {nome: 'CHINA', x: -16.6, blocos: 10.7},
  {nome: 'BRASIL', x: -19.9, blocos: 8.3},
];
const Z_RUA = -2;
const Y_TOPO = (b: number) => 0.16 + b * PASSO_BLOCO;
const Y_CEM = Y_TOPO(10);
const DOLARES: V3 = [-11.6, 0, -0.4];
const TORNEIRA: V3 = [-19.9, 0, 0.7];
const BICA_W: V3 = [TORNEIRA[0], 3.25, TORNEIRA[2] + 0.95];
// Linha do Tempo 1999 a 2014, com a meta Selic de dezembro de cada ano (BC, série 432)
const LT = {x0: 9, passo: 1.1, z: -2, n: 16};
const LT_C = LT.x0 + 7 * LT.passo; // meio da linha
const xAno = (i: number) => LT.x0 + i * LT.passo;
const SELIC = [19, 15.75, 19, 25, 16.5, 17.75, 18, 13.25, 11.25, 13.75, 8.75, 10.75, 11, 7.25, 10];
const fmtPct = (v: number) => `${String(v).replace('.', ',')}%`;
const Y_TILE = 0.08;
const BALANCA: V3 = [16.7, 0, 2.2];
const PILHA_JUROS_FORA: V3 = [19.6, 0, 2.6];
// juros reais (sem número) e o cubo dos motivos
const BARRAS_JR: {x: number; alt: number; br?: boolean}[] = [
  {x: 13.7, alt: 0.9},
  {x: 14.9, alt: 1.5},
  {x: 16.1, alt: 2.6, br: true},
  {x: 17.3, alt: 0.6},
  {x: 18.5, alt: 2.2},
  {x: 19.7, alt: 1.2},
];
const Z_JR = -5.6;
const CUBO: V3 = [16.7, 0, -9.8];
// quarteirão do Banco Central
const SEDE: V3 = [0, 0, -13.5];
const CALEND: V3 = [5.6, 0, -10.8];
const JORNAL: V3 = [2.6, 0, -10.0];
const MESA: V3 = [0, 0, -9.4];
const SELIC_MED: V3 = [-3.1, 0, -9.8];
const BANCOS: V3[] = [
  [8.2, 0, -13],
  [9.6, 0, -10.4],
  [7.2, 0, -15.6],
];
const CONSULT: V3[] = [
  [-7.2, 0, -13],
  [-8.6, 0, -10.6],
];
// Selic alta
const INVESTIDOR: V3 = [-6.6, 0, -6];
const COFRE: V3 = [-5.2, 0, -6];
const TRILHO = trajeto([
  [-5.4, 0.1],
  [-5.6, -2.8],
  [-5.2, -5.1],
]);
const CARTAO: V3 = [5, 1.5, -6];
const EMPRESA: V3 = [8.8, 0, -7.6];
const GUINDASTE_E: V3 = [10.6, 0, -6.4];
const PILHA_JD: V3 = [-5.9, 0, 1.0];
// serviços públicos e ralos (frente)
const SAUDE: V3 = [8, 0, 8.5];
const ESCOLA: V3 = [11.6, 0, 8.4];
const OBRA: V3 = [15, 0, 8.4];
const RALOS = {cadeira: [-7.6, 0, 8.5] as V3, cheque: [-10.0, 0, 8.6] as V3, cano: [-12.6, 0, 8.6] as V3, torneira: [-15.0, 0, 8.4] as V3, gestao: [-11.3, 0, 10.9] as V3};
const LUPA: V3 = [8.6, 1.5, 11];
const NOTE: V3 = [10.8, 0, 11];
const POSTE: V3 = [13.6, 0, 11];
// vitrine e cidade do futuro
const VITRINE = [-3, 0, 3].map((x) => [x, 0, 14] as V3);
const DOC: V3 = [0, 0, 0.9];
const FUTURO = Array.from({length: 26}).map((_, i) => {
  const a = (i / 26) * Math.PI * 2 + 0.2;
  const r = 24 + 2 * Math.sin(i * 2.3);
  return {p: [r * Math.sin(a), 0, 1 + r * Math.cos(a)] as V3, alt: 2.2 + 2.6 * Math.abs(Math.sin(i * 1.7)), atraso: (i % 9) * 0.09};
});

// ---------- Esteira: quanto andou (m) ----------
// Gira desde "rolar", para na troca do título (vencem → novos) e desacelera até parar na cena 4.
const V_EST = 1.3;
const andaEsteira = (t: number) => {
  const a = Math.max(0, Math.min(t, T.vencem - 0.1) - T.rolar) * V_EST;
  const b = t > T.novos + 0.9 ? Math.max(0, Math.min(t, T.naoSignifica) - (T.novos + 0.9)) * V_EST : 0;
  const c = t > T.naoSignifica ? Math.max(0, Math.min(t, T.eOBrasil) - T.naoSignifica) * V_EST * 0.35 : 0;
  // volta a girar devagar no debate ("contas sustentáveis")
  const d = t > T.sustentaveis ? Math.max(0, t - T.sustentaveis) * V_EST * 0.4 : 0;
  return a + b + c + d;
};
const SLOT0 = (() => {
  const u = (((Math.max(0, T.vencem - 0.1 - T.rolar) * V_EST) / PERIM_OVAL) % 1 + 1) % 1;
  const [x, z] = ovalPonto(u);
  return [ESTEIRA[0] + x, 0.08, ESTEIRA[2] + z] as V3;
})();

// Fichas das previsões: saem de um banco, pousam no jornal e depois vão para a mesa.
const FICHAS = [
  {de: BANCOS[1], t0: () => T.fInfl, txt: 'INFLAÇÃO'},
  {de: BANCOS[0], t0: () => T.fJuros, txt: 'JUROS'},
  {de: CONSULT[1], t0: () => T.fCresc, txt: 'CRESCIMENTO'},
];
const fichaPos = (i: number, t: number): V3 => {
  const f = FICHAS[i];
  const a = f.t0();
  const noJornal: V3 = [JORNAL[0] - 1.1 + i * 1.1, 3.2, JORNAL[2] + 0.6];
  const naMesa: V3 = [MESA[0] - 0.9 + i * 0.9, 1.35, MESA[2] + 0.2];
  const ida = rampa(t, a, a + 0.8, Easing.inOut(Easing.quad));
  const vai = rampa(t, T.bcConsidera + i * 0.12, T.bcConsidera + 0.9 + i * 0.12, Easing.inOut(Easing.quad));
  const p1 = curva(soma(f.de, [0, 3, 0]), noJornal, 1.6, ida);
  return vai > 0 ? curva(noJornal, naMesa, 1.4, vai) : p1;
};
const OUTRAS_FICHAS: V3[] = [
  [-6, 3, -6],
  [6, 3.4, -5],
  [-4, 4, -16],
  [5, 3.6, -16],
];
const outraFichaPos = (i: number, t: number): V3 => {
  const naMesa: V3 = [MESA[0] - 1.4 + i * 0.9, 1.5, MESA[2] - 0.45];
  return curva(OUTRAS_FICHAS[i], naMesa, 1.2, rampa(t, T.outrosInd + i * 0.15, T.outrosInd + 0.9 + i * 0.15, Easing.inOut(Easing.quad)));
};

const fatias = (tema: Tema): FatiaInfo[] => [
  {label: 'GASTO PÚBLICO', pct: 0.24, cor: mistura(tema.objeto, tema.objetoEscuro, 0.2)},
  {label: 'INFLAÇÃO', pct: 0.19, cor: mistura(tema.objeto, tema.objetoClaro, 0.15)},
  {label: 'CÂMBIO', pct: 0.19, cor: mistura(tema.objeto, tema.objetoEscuro, 0.45)},
  {label: 'CRISES', pct: 0.19, cor: mistura(tema.objeto, tema.objetoClaro, 0.3)},
  {label: 'CRÉDITO', pct: 0.19, cor: mistura(tema.objeto, tema.objetoEscuro, 0.1)},
];

// ---------- O mundo inteiro, animado pelo tempo ----------
const Mundo: React.FC<{tema: Tema; t: number; centro: V3}> = ({tema, t, centro}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const ouro = F.dourado;
  const ac = (k: number) => mistura(tema.objeto, tema.acento, k01(k));

  // ---- 1. casa e família
  const janela = 0.6 + 0.4 * pulso(t, T.suaCasa, 1.2);
  const aceno = pulso(t, T.familia, 1.4);
  const bolso = rampa(t, T.bolso - 0.3, T.bolso + 0.4);
  const nSal = 3 + 7 * rampa(t, T.ganhar, T.ganhar + 0.9) - 3 * rampa(t, T.gastar, T.gastar + 0.8);
  const recibo = entra(t, T.orcamento - 0.2, 0.5);
  const desenrola = rampa(t, T.orcamento, T.orcamento + 0.9);

  // ---- praça do Estado
  const tesouro = rampa(t, T.governo1, T.governo1 + 1.0, sai);
  const letreiroTes = rampa(t, T.estado, T.estado + 0.5) + 0.2;
  const moedaR = entra(t, T.moeda - 0.15, 0.6);
  const giroR = Math.PI * 2 * rampa(t, T.moeda, T.moeda + 1.4, Easing.inOut(Easing.quad)) + 0.15 * Math.sin(t * 0.5);
  const bc = rampa(t, T.financia - 0.2, T.financia + 0.6, sai);
  const pulsoBc = 0.6 * pulso(t, T.criterioBc, 1.2);
  const pilhaTit = entra(t, T.vendendo, 0.5);
  const invest = entra(t, T.dividaPub - 0.4, 0.5);
  // ---- 2. esteira
  const esteira = rampa(t, T.sabe - 0.1, T.sabe + 0.8);
  const vazio = rampa(t, T.vencem + 0.1, T.vencem + 0.5) - rampa(t, T.novos + 0.6, T.novos + 0.9);
  const vence = rampa(t, T.vencem - 0.3, T.vencem + 0.1) * (1 - rampa(t, T.vencem + 0.1, T.vencem + 0.4));
  const saiVelho = rampa(t, T.vencem + 0.1, T.vencem + 0.9, Easing.inOut(Easing.quad));
  const chegaNovo = rampa(t, T.novos, T.novos + 0.9, Easing.inOut(Easing.quad));

  // ---- 3. limites
  const limite = rampa(t, T.semLimites - 0.1, T.semLimites + 1.0) * sumir(t, T.eOBrasil, 0.6);
  const medK = (i: number) => entra(t, [T.inflacao1, T.capacidade, T.sustent][i] - 0.1, 0.55) * sumir(t, T.eOBrasil + 0.2, 0.6);
  const medV = (i: number) => 0.18 + 0.32 * rampa(t, T.fundamentais - 0.2, T.fundamentais + 0.6, mola) + 0.06 * Math.sin(t * 2 + i) * (1 - rampa(t, T.fundamentais, T.fundamentais + 0.3));
  const fabrica = entra(t, T.capacidade, 0.6) * sumir(t, T.eOBrasil + 0.2, 0.6);

  // ---- 4. Rua das Dívidas
  const bases = rampa(t, T.brasilEsta - 0.1, T.brasilEsta + 0.6, sai);
  const cem = rampa(t, T.endividado, T.endividado + 1.0);
  const cresce = [
    rampa(t, T.japao, T.p200 + 0.6, Easing.inOut(Easing.quad)),
    rampa(t, T.eua, T.p120 + 0.4, Easing.inOut(Easing.quad)),
    rampa(t, T.china, T.p100 + 0.3, Easing.inOut(Easing.quad)),
    rampa(t, T.bruta, T.p83 + 0.2, Easing.inOut(Easing.quad)),
  ];
  const brAcento = rampa(t, T.bruta, T.bruta + 0.5) - rampa(t, T.entao, T.entao + 0.8);
  const brilhoTorre = [0.8 * pulso(t, T.maisEnd, 1.3), 0, 0, 0.6 * pulso(t, T.alta, 1.2)];
  const fantasma = rampa(t, T.criterioFmi, T.p90 + 0.3, Easing.inOut(Easing.quad)) * sumir(t, T.naoSomos, 0.6);
  const dolares = 14 * rampa(t, T.tri40 - 0.1, T.tri40 + 0.9);
  const torneira = entra(t, T.maisPesa - 0.1, 0.6);
  const abreT = rampa(t, T.custoJuros, T.custoJuros + 0.8);
  const brilhoT = 0.8 * pulso(t, T.pagamos, 1.6);

  // ---- 6. Tesouro, multidão, lupa
  const tag = entra(t, T.taoAltos - 0.1, 0.7) * sumir(t, T.detalhe, 0.5);
  const multidao = entra(t, T.muitaGente - 0.1, 0.5) * sumir(t, T.detalhe + 0.3, 0.5);
  const aponta = rampa(t, T.muitaGente + 0.3, T.muitaGente + 0.9);
  const lupa = entra(t, T.detalhe - 0.1, 0.6) * sumir(t, T.a1999, 0.5);
  // Linha do Tempo e Selic
  const lt = rampa(t, T.a1999 - 0.3, T.a1999 + 0.4);
  const acesos = 15 * rampa(t, T.a1999, T.a2013 + 0.9, Easing.linear);
  const superK = rampa(t, T.superavit - 0.1, T.superavit + 0.5) - rampa(t, T.adivinha + 0.6, T.adivinha + 1.4);
  const marco99 = entra(t, T.a1999, 0.5);
  const marco13 = entra(t, T.a2013, 0.5);
  const selicPulso = pulso(t, T.eAdivinha, 1.4);
  const selicTop = pulso(t, T.setorPublico, 1.4);
  const balanca = entra(t, T.arrecadava - 0.6, 0.6);
  const inclina = -0.45 * rampa(t, T.arrecadava, T.gastava + 0.5, Easing.inOut(Easing.quad));
  const pilhaFora = entra(t, T.semContar, 0.5);
  // 7. juros reais e cubo
  const barras = rampa(t, T.mesmoAssim - 0.1, T.mesmoAssim + 0.7) * sumir(t, T.gastoPublico - 0.2, 0.6);
  const barraBr = rampa(t, T.jurosReais, T.jurosReais + 1.0, sai);
  const fatiaK = [T.gastoPublico, T.inflacao2, T.cambio, T.crises, T.credito1].map((a) => rampa(t, a - 0.1, a + 0.5, sai));
  const cuboFantasma = rampa(t, T.naoExplica, T.naoExplica + 0.4) * (1 - rampa(t, T.credito1, T.credito1 + 0.5));
  const giraCubo = 0.35 * rampa(t, T.tambemPesam, T.tambemPesam + 2.5, Easing.inOut(Easing.quad));
  const etiq = entra(t, T.inflacao2, 0.5);
  const troca = rampa(t, T.cambio, T.cambio + 1.0, Easing.inOut(Easing.quad));
  const moedasCambio = entra(t, T.cambio - 0.1, 0.5);
  const racha = rampa(t, T.crises, T.crises + 1.2);
  const cartaoMot = entra(t, T.credito1, 0.5);

  // ---- 8. Banco Central
  const sede = rampa(t, T.outroFator - 0.1, T.outroFator + 0.8, sai);
  const predios = (i: number) => entra(t, T.expectativas + i * 0.12, 0.6);
  const luzBancos = rampa(t, T.bancos, T.bancos + 0.4);
  const luzCons = rampa(t, T.consultorias, T.consultorias + 0.4);
  const calend = entra(t, T.todaSemana - 0.2, 0.5);
  const folha = rampa(t, T.todaSemana, T.todaSemana + 0.6);
  const jornal = entra(t, T.focus - 0.1, 0.6);
  const mesa = entra(t, T.bcConsidera - 0.3, 0.6);
  const selicMed = entra(t, T.outroFator + 0.4, 0.6);
  const selicV = 0.3 + 0.55 * rampa(t, T.decidir, T.decidir + 0.9, mola) + 0.05 * pulso(t, T.selicElevada, 1.2);
  const pulsoSede = 0.7 * pulso(t, T.decidir, 1.4);

  // ---- 9. Selic alta
  const investidor = entra(t, T.quemGanha, 0.5);
  const cofre = entra(t, T.aplicacoes - 0.1, 0.6);
  const abreCofre = rampa(t, T.aplicacoes + 0.2, T.aplicacoes + 0.9);
  const trilho = rampa(t, T.atreladas - 0.1, T.atreladas + 0.8);
  const fluxo = 0.6 + 1.4 * rampa(t, T.recebe, T.recebe + 0.5);
  const posFix = rampa(t, T.posFixados, T.posFixados + 0.9, Easing.inOut(Easing.quad));
  const moedasCofre = 2 + 8 * rampa(t, T.recebe, T.recebe + 2.0);
  const cartao = entra(t, T.creditoFica - 0.1, 0.6);
  const tagCartao = entra(t, T.creditoFica + 0.3, 0.6);
  const empresa = entra(t, T.empresas - 0.1, 0.6);
  const luzEmpresa = 1 - 0.7 * rampa(t, T.investemMenos, T.investemMenos + 0.8);
  const obraAnda = 1 - rampa(t, T.investemMenos, T.investemMenos + 0.6);
  const pilhaJD = 4 + 12 * rampa(t, T.jurosDivida2 - 0.3, T.jurosDivida2 + 1.0);
  const pilhaJDk = entra(t, T.governoGasta, 0.5);

  // ---- 10. solução
  const saude = rampa(t, T.saude - 0.2, T.saude + 0.6, sai);
  const escola = entra(t, T.educacao1 - 0.1, 0.6);
  const obra = entra(t, T.investimentos - 0.1, 0.6);
  const tesoura = entra(t, T.cortando - 0.4, 0.6) * sumir(t, T.investimentos + 0.5, 0.6);
  const recuaTes = rampa(t, T.investimentos + 0.1, T.investimentos + 0.9, sai);
  const escudo = entra(t, T.investimentos, 0.7) * sumir(t, T.investirEm, 0.6);
  const cadeira = entra(t, T.privilegios - 0.2, 0.5);
  const luzCadeira = rampa(t, T.privilegios, T.privilegios + 0.3) * (1 - 0.85 * rampa(t, T.privilegios + 0.5, T.privilegios + 1.2));
  const cheque = entra(t, T.supersalarios - 0.2, 0.5);
  const encolhe = rampa(t, T.supersalarios + 0.2, T.supersalarios + 1.0, Easing.inOut(Easing.quad));
  const cano = entra(t, T.desperdicios - 0.3, 0.5);
  const remendo = rampa(t, T.desperdicios + 0.5, T.desperdicios + 0.9, mola);
  const vaza = rampa(t, T.desperdicios - 0.2, T.desperdicios + 0.2) * (1 - rampa(t, T.desperdicios + 0.6, T.desperdicios + 1.0));
  const torneiraSub = entra(t, T.subsidios - 0.2, 0.5);
  const fechaSub = 1 - 0.5 * rampa(t, T.subsidios + 0.3, T.subsidios + 1.0);
  const gestao = entra(t, T.gestao - 0.2, 0.5);
  const check = rampa(t, T.gestao + 0.2, T.gestao + 0.7);
  const salvas = rampa(t, T.recursos, T.recursos + 1.2, Easing.inOut(Easing.quad));

  // ---- 11. investir
  const lupaInv = entra(t, T.ciencia - 0.1, 0.5);
  const note = entra(t, T.tecnologia - 0.1, 0.5);
  const abreNote = rampa(t, T.tecnologia, T.tecnologia + 0.6);
  const poste = rampa(t, T.infra, T.infra + 0.5);
  const viga = rampa(t, T.infra, T.infra + 1.6, Easing.inOut(Easing.quad));
  const luzEscola = 0.2 + 0.8 * rampa(t, T.educacao2, T.educacao2 + 0.6);
  const pedestais = rampa(t, T.invPublico - 0.1, T.invPublico + 0.7, sai);
  const linhaLP = rampa(t, T.longoPrazo - 0.1, T.longoPrazo + 1.0);
  const campo = entra(t, T.embrapa - 0.1, 0.5);
  const cresceCampo = rampa(t, T.embrapa, T.embrapa + 1.2);
  const plataforma = entra(t, T.petrobras - 0.1, 0.5);
  const jato = entra(t, T.embraer - 0.1, 0.5);
  const decola = rampa(t, T.embraer + 0.4, T.embraer + 2.4, Easing.inOut(Easing.quad));
  const luzVitrine = 0.6 * pulso(t, T.dinheiroPub, 1.6);

  // ---- 12. debate e futuro
  const doc = entra(t, T.portanto, 0.6) * sumir(t, T.debate + 0.6, 0.6);
  const carimbo = rampa(t, T.vila - 0.2, T.vila + 0.2, cai) * (1 - rampa(t, T.vila + 0.5, T.vila + 1.0, sai));
  const tesouraFim = entra(t, T.cortandoGastos - 0.2, 0.5) * sumir(t, T.cortandoGastos + 0.9, 0.5);
  const luzFuturo = rampa(t, T.futuro - 0.2, T.futuro + 1.0);
  const servicosLuz = 0.7 * pulso(t, T.dinheiroPub, 1.6);

  return (
    <>
      <Particulas t={t} centro={[centro[0], 2.5, centro[2]]} raio={10} n={50} />

      {/* ===== Casa e família ===== */}
      <CasaMini tema={tema} pos={CASA} escala={2.2} luz={janela} />
      <Onda pos={CASA} k={rampa(t, T.suaCasa, T.suaCasa + 1.1, Easing.linear)} cor={tema.acento} raio={2.2} />
      <Boneco
        tema={tema}
        pos={ADULTO}
        rotY={0.35}
        escala={0.8}
        cor={tema.corpo}
        pose={bolso > 0 ? {ombroD: [-0.25 * bolso, 0, 0.12], cotoveloD: -0.6 * bolso} : {ombroD: [0, 0, 2.4 * aceno], cotoveloD: -0.4 * aceno}}
      />
      <Boneco tema={tema} pos={CRIANCA} rotY={0.3} escala={0.5} cor={tema.pessoa} pose={{ombroE: [0, 0, -2.2 * aceno]}} />
      {bolso > 0.02 && bolso < 0.98 ? <MoedaCor tema={tema} pos={curva([SALARIO[0], 0.9, SALARIO[2]], [ADULTO[0] + 0.25, 0.75, ADULTO[2] + 0.1], 0.8, bolso)} r={0.12} cor={ouro} brilho={0.4} rot={[Math.PI / 2, t * 3, 0]} /> : null}
      <PilhaMoedas tema={tema} pos={SALARIO} n={nSal} cor={ouro} r={0.32} brilho={0.3 * pulso(t, T.ganhar, 1.2)} />
      {[0, 1, 2, 3].map((i) => {
        const k = rampa(t, T.ganhar + i * 0.15, T.ganhar + 0.7 + i * 0.15, Easing.inOut(Easing.quad));
        return k > 0.02 && k < 0.98 ? <MoedaCor key={`g${i}`} tema={tema} pos={curva([7, 2.4, 11.5], [SALARIO[0], 0.8, SALARIO[2]], 1.4, k)} r={0.2} cor={ouro} rot={[Math.PI / 2 - 0.4, t * 2, 0]} /> : null;
      })}
      {[0, 1, 2].map((i) => {
        const k = rampa(t, T.gastar + i * 0.15, T.gastar + 0.7 + i * 0.15, Easing.inOut(Easing.quad));
        return k > 0.02 && k < 0.98 ? <MoedaCor key={`s${i}`} tema={tema} pos={curva([SALARIO[0], 0.9, SALARIO[2]], [RECIBO[0], 1.3, RECIBO[2] + 0.1], 0.9, k)} r={0.2} cor={ouro} rot={[Math.PI / 2 - 0.4, t * 2, 0]} /> : null;
      })}
      <Recibo tema={tema} pos={[RECIBO[0], 1.9, RECIBO[2]]} rot={[0, -0.35, 0]} escala={1.3 * recibo} desenrola={desenrola} destaque={rampa(t, T.gastar + 0.6, T.gastar + 1.0)} />

      {/* ===== Praça do Estado ===== */}
      <OrgaoPublico tema={tema} pos={TESOURO} escala={0.8} sobe={tesouro} letreiro={k01(letreiroTes)} texto="TESOURO" />
      <Banco tema={tema} pos={BC} rotY={-0.25} sobe={bc} pulso={pulsoBc} />
      <MoedaReal tema={tema} pos={MOEDA_R} escala={moedaR} gira={giroR} brilho={0.6 * pulso(t, T.moeda + 0.3, 1.4)} />
      {pilhaTit > 0.02
        ? [0, 1, 2, 3, 4].map((i) => {
            const voa = i < 4 ? rampa(t, T.dividaPub + i * 0.15, T.dividaPub + 0.8 + i * 0.15, Easing.inOut(Easing.quad)) : 0;
            const de: V3 = [PILHA_TIT[0] - 0.8 + i * 0.4, 0, PILHA_TIT[2] + (i % 2) * 0.12];
            const ate: V3 = [INVEST[i % 4][0], 0.7, INVEST[i % 4][2] + 0.3];
            const fim = voa >= 1 ? 0 : 1;
            return <TituloPublico key={`pt${i}`} tema={tema} pos={voa > 0 ? curva(de, ate, 1.6, voa) : de} rot={[0, 0.2, 0]} escala={pilhaTit * (voa > 0 ? fim * (1 - 0.4 * voa) : 1)} />;
          })
        : null}
      {[0, 1, 2, 3].map((i) => {
        const k = rampa(t, T.dividaPub + 0.6 + i * 0.12, T.dividaPub + 1.4 + i * 0.12, Easing.inOut(Easing.quad));
        return k > 0.02 && k < 0.98 ? <MoedaCor key={`iv${i}`} tema={tema} pos={curva([INVEST[i][0], 1.0, INVEST[i][2]], [TESOURO[0] + 1, 1.0, TESOURO[2] + 1.6], 1.5, k)} r={0.16} cor={ouro} rot={[Math.PI / 2 - 0.4, t * 2, 0]} /> : null;
      })}
      {invest > 0.02 ? INVEST.map((p, i) => <Boneco key={`inv${i}`} tema={tema} pos={p} rotY={-0.6} escala={0.5 * invest} cor={tema.pessoa} />) : null}
      <EsteiraTitulos tema={tema} pos={ESTEIRA} k={esteira} anda={andaEsteira(t)} falta={0} vazio={k01(vazio)} vence={vence} />
      {saiVelho > 0.02 && saiVelho < 0.98 ? <TituloPublico tema={tema} pos={curva(SLOT0, [INVEST[0][0], 0.8, INVEST[0][2] + 0.3], 1.4, saiVelho)} rot={[0, 0.4, 0]} escala={1} vence={1} /> : null}
      {saiVelho > 0.6 && saiVelho < 1 ? null : null}
      {chegaNovo > 0.02 && chegaNovo < 0.98 ? <TituloPublico tema={tema} pos={curva([TESOURO[0] + 0.5, 1.0, TESOURO[2] + 1.4], SLOT0, 1.6, chegaNovo)} rot={[0, 0.2, 0]} escala={1} /> : null}
      {[0, 1, 2].map((i) => {
        const k = rampa(t, T.vencem + 0.7 + i * 0.12, T.vencem + 1.4 + i * 0.12, Easing.inOut(Easing.quad));
        return k > 0.02 && k < 0.98 ? <MoedaCor key={`vm${i}`} tema={tema} pos={curva([TESOURO[0] + 1, 1.0, TESOURO[2] + 1.6], [INVEST[0][0], 1.0, INVEST[0][2]], 1.4, k)} r={0.16} cor={ouro} rot={[Math.PI / 2 - 0.4, t * 2, 0]} /> : null;
      })}
      <SetasTroca tema={tema} pos={[SLOT0[0], 2.0, SLOT0[2]]} escala={0.9 * entra(t, T.novos, 0.5) * sumir(t, T.masIsso, 0.5)} giro={t * 1.2} />

      {/* ===== Limites ===== */}
      {limite > 0.02 ? <LinhaLimite tema={tema} x0={-6.2} x1={6.2} z0={-3.2} z1={6.9} k={limite} /> : null}
      {MEDIDORES.map((m, i) => {
        const k = medK(i);
        return k < 0.02 ? null : (
          <group key={m.label} position={[m.x, -1.6 * (1 - Math.min(1, k)), Z_MED]}>
            <Caixa args={[0.12, 0.85, 0.12]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.42, -0.05]} />
            <Caixa args={[0.6, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.05]} />
            <Medidor tema={tema} pos={[0, 1.5, 0]} label={m.label} valor={medV(i)} escala={1.1} />
          </group>
        );
      })}
      <EtiquetaPreco tema={tema} pos={[MEDIDORES[0].x - 0.9, 2.6, Z_MED]} rot={[0, 0.2, 0.15 * Math.sin(t * 2.2)]} escala={0.8 * medK(0)} />
      {fabrica > 0.02 ? (
        <group position={[8.6, 0, Z_MED + 1.6]} scale={0.18 * fabrica}>
          <FabricaCarroVoador tema={tema} pos={[0, 0, 0]} sobe={1} paineis={1} janelas={1} letreiro="INDÚSTRIA" acesoLetreiro={0.6} />
        </group>
      ) : null}
      <Engrenagem tema={tema} pos={[5.9, 0.5, Z_MED + 1.4]} rot={[0, 0.3, 0]} r={0.38} giro={t * 1.6} escala={fabrica} />

      {/* ===== Rua das Dívidas ===== */}
      {bases > 0.02
        ? PAISES.map((p, i) => {
            const br = i === 3;
            return <TorreDivida key={p.nome} tema={tema} pos={[p.x, 0, Z_RUA]} blocos={p.blocos * cresce[i]} cor={br ? ac(brAcento) : tema.objeto} nome={p.nome} base={bases} brilho={brilhoTorre[i] + (br ? 0.4 * k01(brAcento) : 0)} />;
          })
        : null}
      {fantasma > 0.02 ? <TorreDivida tema={tema} pos={[PAISES[3].x, 0, Z_RUA]} blocos={9.4 * fantasma} cor={tema.ceuLuz} base={0} vidro /> : null}
      <LinhaCem tema={tema} x0={-21.4} x1={-8.6} y={Y_CEM} z={Z_RUA} k={cem} />
      <PilhaMoedas tema={tema} pos={DOLARES} n={dolares} cor={F.azul} r={0.34} />
      <Torneira tema={tema} pos={TORNEIRA} k={torneira} abre={abreT} brilho={brilhoT} />
      {abreT > 0.3
        ? [0, 1, 2].map((i) => {
            const c = (t * 0.9 + i / 3) % 1;
            return <MoedaCor key={`tq${i}`} tema={tema} pos={[BICA_W[0], BICA_W[1] - 0.15 - 2.9 * c * c, BICA_W[2]]} r={0.16} cor={ouro} rot={[c * 3, 0, 0.5]} escala={abreT} />;
          })
        : null}
      <PilhaMoedas tema={tema} pos={[BICA_W[0], 0, BICA_W[2]]} n={torneira > 0.02 ? 1 + 9 * rampa(t, T.custoJuros, T.custoJuros + 30, Easing.linear) : 0} cor={ouro} r={0.3} />

      {/* ===== Tesouro: etiqueta %, multidão e lupa ===== */}
      <TagPorcento tema={tema} pos={[TESOURO[0] + 1.2, 6.2 - 1.6 * tag, TESOURO[2] + 0.6]} escala={1.6 * tag} balanca={Math.sin(t * 2.1) * 0.5} />
      {multidao > 0.02
        ? Array.from({length: 12}).map((_, i) => {
            const a = -1.2 + (i / 11) * 2.4;
            const r = 5.2 + (i % 3) * 0.5;
            const p: V3 = [TESOURO[0] + r * Math.sin(a), 0, TESOURO[2] + 1.0 + r * Math.cos(a)];
            return <Boneco key={`m${i}`} tema={tema} pos={p} rotY={a + Math.PI} escala={0.45 * multidao} cor={tema.pessoa} pose={{ombroD: [-1.5 * aponta, 0, 0.1], cotoveloD: -0.1}} />;
          })
        : null}
      <Lupa tema={tema} pos={[TESOURO[0], 3.6, TESOURO[2] + 1.6]} rot={[0.2, 0.5 + 0.3 * Math.sin(t), 0.2]} escala={1.4 * lupa} />

      {/* ===== Linha do Tempo 1999 a 2014, com a Selic ===== */}
      {lt > 0.02 ? (
        <>
          <Meses tema={tema} x0={LT.x0} passo={LT.passo} z={LT.z} n={LT.n} k={lt} acesos={Math.min(15, acesos)} ultimo={0} />
          {SELIC.map((v, i) => {
            const k = rampa(t, T.a1999 + (i / 15) * (T.a2013 + 0.9 - T.a1999), T.a1999 + (i / 15) * (T.a2013 + 0.9 - T.a1999) + 0.5, sai);
            if (k < 0.02) return null;
            const brilho = 0.35 * selicPulso + (i === 3 ? 0.4 * selicTop : 0);
            return <BarraFixa key={`sl${i}`} pos={[xAno(i), Y_TILE, LT.z]} alt={v * 0.12 * k} larg={0.26} cor={mistura(tema.objetoClaro, tema.objeto, 0.35)} emissivo={brilho} />;
          })}
          {/* superávit: os 15 blocos acendem no acento */}
          {superK > 0.02
            ? SELIC.map((_, i) => <Caixa key={`sv${i}`} args={[0.34, 0.03, 0.52]} raio={0.012} cor={tema.acento} emissivo={0.45 * superK} sombra={false} position={[xAno(i), 0.095, LT.z]} scale={[1, 1, k01(superK)]} />)
            : null}
        </>
      ) : null}
      <MarcoAno tema={tema} pos={[xAno(0), 0, LT.z + 1.4]} ano="1999" k={marco99} aceso={superK} />
      <MarcoAno tema={tema} pos={[xAno(14), 0, LT.z + 1.4]} ano="2013" k={marco13} aceso={superK} />
      <Balanca
        tema={tema}
        pos={BALANCA}
        escala={balanca}
        inclina={inclina}
        esq={<PilhaMoedas tema={tema} pos={[0, 0.05, 0]} n={9} cor={ouro} r={0.28} />}
        dir={<PilhaMoedas tema={tema} pos={[0, 0.05, 0]} n={5} cor={mistura(ouro, tema.objeto, 0.5)} r={0.28} />}
        brilhoEsq={0.6 * rampa(t, T.arrecadava, T.arrecadava + 0.5)}
      />
      {pilhaFora > 0.02 ? (
        <>
          <PilhaMoedas tema={tema} pos={PILHA_JUROS_FORA} n={6 * pilhaFora} cor={mistura(ouro, tema.objetoEscuro, 0.55)} r={0.3} />
          <Onda pos={PILHA_JUROS_FORA} k={rampa(t, T.semContar + 0.2, T.semContar + 1.2, Easing.linear)} cor={tema.objetoClaro} raio={0.7} />
        </>
      ) : null}
      {/* juros reais: barras sem número */}
      {barras > 0.02
        ? BARRAS_JR.map((b, i) => <BarraFixa key={`jr${i}`} pos={[b.x, 0, Z_JR]} alt={b.br ? 0.4 * barras + (b.alt - 0.4) * barraBr : b.alt * barras} larg={0.7} cor={b.br ? ac(barraBr * (1 - rampa(t, T.outroFator, T.outroFator + 0.8))) : tema.objeto} emissivo={b.br ? 0.3 * barraBr : 0} />)
        : null}
      {fatiaK[0] > 0.02 ? <CuboFatias tema={tema} pos={CUBO} rotY={-0.25 + giraCubo} fatias={fatias(tema)} altTotal={3.2} larg={1.6} apareceCada={fatiaK} /> : null}
      {cuboFantasma > 0.02 ? (
        <mesh position={[CUBO[0], 1.6 + 0.77 * 0, CUBO[2]]} rotation={[0, -0.25, 0]}>
          <boxGeometry args={[1.66, 3.22, 1.66]} />
          <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.16 * cuboFantasma} depthWrite={false} />
        </mesh>
      ) : null}
      <EtiquetaPreco tema={tema} pos={[CUBO[0] - 2.0, 2.0, CUBO[2] + 0.5]} rot={[0, 0.4, 0.1 * Math.sin(t * 2)]} escala={0.9 * etiq} />
      {moedasCambio > 0.02 ? (
        <group position={[CUBO[0] + 2.1, 1.3, CUBO[2] + 0.6]}>
          <MoedaCor tema={tema} pos={lerp([-0.45, 0, 0], [0.45, 0, 0], troca)} rot={[Math.PI / 2, 0, 0]} r={0.34} cor={ouro} escala={moedasCambio} />
          <MoedaCor tema={tema} pos={lerp([0.45, 0, 0], [-0.45, 0, 0], troca)} rot={[Math.PI / 2, 0, 0]} r={0.34} cor={F.azul} escala={moedasCambio} />
          <SetasTroca tema={tema} pos={[0, 0.8, 0]} escala={0.6 * moedasCambio} giro={t} />
        </group>
      ) : null}
      {racha > 0.02 ? <Racha tema={tema} a={[CUBO[0] - 3, 0, CUBO[2] + 2.2]} b={[CUBO[0] + 3, 0, CUBO[2] + 1.6]} k={racha} /> : null}
      <CartaoCredito tema={tema} pos={[CUBO[0] - 1.9, 0.7, CUBO[2] + 1.4]} rot={[0, 0.35, 0]} escala={1.1 * cartaoMot} faixa={0.5} />

      {/* ===== Quarteirão do Banco Central ===== */}
      <group position={SEDE} scale={1.7}>
        <Banco tema={tema} pos={[0, 0, 0]} sobe={sede} pulso={pulsoSede} />
      </group>
      {BANCOS.map((p, i) => (
        <Escritorio key={`b${i}`} tema={tema} pos={p} rotY={-0.5} escala={0.6 * predios(i)} luz={luzBancos} />
      ))}
      {CONSULT.map((p, i) => (
        <PrediozinhoFumaca key={`c${i}`} tema={tema} pos={p} alt={predios(3 + i) > 0.02 ? 2.4 * Math.min(1, predios(3 + i)) : 0.01} larg={1.1} luz={luzCons} />
      ))}
      <CalendarioGrande tema={tema} pos={CALEND} rotY={-0.2} texto="SEMANA" sub="TODA" folha={folha} escala={calend} />
      {jornal > 0.02 ? <Jornal tema={tema} pos={JORNAL} rotY={-0.35} titulo="BOLETIM FOCUS" abre={0} escala={2.1 * jornal} /> : null}
      <MesaAcordo tema={tema} pos={MESA} k={mesa} />
      {selicMed > 0.02 ? (
        <group position={[SELIC_MED[0], -2 * (1 - Math.min(1, selicMed)), SELIC_MED[2]]}>
          <Caixa args={[0.14, 1.4, 0.14]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.7, -0.05]} />
          <Caixa args={[0.7, 0.08, 0.5]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.05]} />
          <Medidor tema={tema} pos={[0, 2.2, 0]} rotY={0.25} label="SELIC" valor={selicV} escala={1.5} />
        </group>
      ) : null}
      {FICHAS.map((f, i) => {
        const a = f.t0();
        if (t < a - 0.1) return null;
        const k = entra(t, a - 0.1, 0.4) * sumir(t, T.eQuem + 0.5, 0.5);
        return <Ficha key={`f${i}`} tema={tema} pos={fichaPos(i, t)} k={k} destaque={i === 0 ? pulso(t, T.essasPrev, 1.4) : 0} />;
      })}
      {OUTRAS_FICHAS.map((_, i) => {
        if (t < T.outrosInd - 0.1) return null;
        return <Ficha key={`of${i}`} tema={tema} pos={outraFichaPos(i, t)} k={entra(t, T.outrosInd + i * 0.15, 0.4) * sumir(t, T.eQuem + 0.5, 0.5)} />;
      })}

      {/* ===== Selic alta: investidor, crédito, empresa ===== */}
      {investidor > 0.02 ? <Boneco tema={tema} pos={INVESTIDOR} rotY={0.6} escala={0.75 * investidor} cor={tema.pessoa} pose={{ombroD: [-0.6, 0, 0.1], cotoveloD: -0.5}} /> : null}
      {cofre > 0.02 ? (
        <>
          <CofreFGTS tema={tema} pos={COFRE} escala={cofre} abre={abreCofre} trava={0} brilho={0.5 * rampa(t, T.recebe, T.recebe + 0.6)} />
          <PilhaMoedas tema={tema} pos={[COFRE[0] + 0.9, 0, COFRE[2] + 0.4]} n={moedasCofre} cor={ouro} r={0.26} />
        </>
      ) : null}
      <TrilhoMoedas tema={tema} tr={TRILHO} k={trilho} t={t} fluxo={fluxo} vazao={rampa(t, T.atreladas + 0.4, T.atreladas + 1.0)} />
      {posFix > 0.02 && posFix < 0.98 ? <TituloPublico tema={tema} pos={curva([TESOURO[0] - 1.4, 1.0, TESOURO[2] + 1.2], [COFRE[0], 0.7, COFRE[2] + 0.6], 1.4, posFix)} escala={1.1} texto="PÓS-FIXADO" vence={1} /> : null}
      <CartaoCredito tema={tema} pos={CARTAO} rot={[0, -0.3, 0]} escala={2.6 * cartao} faixa={0.6 + 0.4 * pulso(t, T.creditoFica + 0.3, 1.2)} />
      <TagPorcento tema={tema} pos={[CARTAO[0] + 1.5, 3.5, CARTAO[2] + 0.3]} escala={0.9 * tagCartao} balanca={Math.sin(t * 2.4) * 0.6} />
      <Escritorio tema={tema} pos={EMPRESA} rotY={-0.45} escala={0.7 * empresa} luz={luzEmpresa} />
      {empresa > 0.02 ? (
        <group position={GUINDASTE_E} scale={0.32}>
          <Guindaste tema={tema} pos={[0, 0, 0]} rotY={-0.9 + 0.5 * Math.sin(t * 0.8) * obraAnda} k={empresa} cabo={3 + 6 * (0.5 + 0.5 * Math.sin(t * 1.2)) * obraAnda + 9 * (1 - obraAnda)} braco={9} />
        </group>
      ) : null}
      <PilhaMoedas tema={tema} pos={PILHA_JD} n={pilhaJDk > 0.02 ? pilhaJD : 0} cor={mistura(ouro, tema.objetoEscuro, 0.2)} r={0.34} brilho={0.4 * pulso(t, T.jurosDivida2, 1.4)} />

      {/* ===== Serviços públicos ===== */}
      <OrgaoPublico tema={tema} pos={SAUDE} escala={0.55} sobe={saude} letreiro={rampa(t, T.saude + 0.2, T.saude + 0.7)} texto="SAÚDE" />
      {escola > 0.02 ? (
        <group position={[ESCOLA[0], -2 * (1 - Math.min(1, escola)), ESCOLA[2]]} scale={0.55}>
          <EscolaSimples tema={tema} pos={[0, 0, 0]} luz={t > T.investirEm ? luzEscola : 0.3 + servicosLuz} />
        </group>
      ) : null}
      {obra > 0.02 ? (
        <group position={OBRA}>
          {[-1, 1].map((x) => [-1, 1].map((z) => <Caixa key={`o${x}${z}`} args={[0.12, 1.8 * obra, 0.12]} raio={0.03} cor={tema.objeto} position={[x * 0.8, 0.9 * obra, z * 0.6]} />))}
          <Caixa args={[1.8, 0.1, 1.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.8 * obra, 0]} />
          <group position={[1.6, 0, -0.6]} scale={0.26}>
            <Guindaste tema={tema} pos={[0, 0, 0]} rotY={-2.2 + 0.6 * viga} k={obra} cabo={10 - 6 * viga} braco={8} carga={<Caixa args={[3, 0.5, 0.6]} raio={0.06} cor={tema.objetoClaro} />} />
          </group>
        </group>
      ) : null}
      <Tesoura tema={tema} pos={[ESCOLA[0] + 2.5 * recuaTes, 4.2 + 2 * recuaTes, ESCOLA[2] + 1.4]} rot={[0.9, -0.4, 0]} escala={2.2 * tesoura} abre={0.5 + 0.5 * Math.sin(t * 5)} />
      <Escudo tema={tema} pos={[SAUDE[0] - 1.9, 0, SAUDE[2] + 1.6]} rotY={0.4} escala={1.5 * escudo} acende={0.6 + 0.4 * pulso(t, T.investimentos + 0.4, 1.2)} />

      {/* ===== Ralos do dinheiro ===== */}
      <Cadeira tema={tema} pos={RALOS.cadeira} escala={1.2 * cadeira} aceso={luzCadeira} />
      <Contracheque tema={tema} pos={RALOS.cheque} rotY={0.15} escala={cheque * (2.6 - 1.5 * encolhe)} salario={1 - encolhe} piso={0} />
      <CanoVazando tema={tema} pos={RALOS.cano} escala={cano} t={t} vaza={vaza} remendo={remendo} />
      {torneiraSub > 0.02 ? (
        <group position={RALOS.torneira} scale={0.45}>
          <Torneira tema={tema} pos={[0, 0, 0]} k={torneiraSub} abre={fechaSub} />
        </group>
      ) : null}
      {torneiraSub > 0.02 && fechaSub > 0.6
        ? [0, 1].map((i) => {
            const c = (t * 1.2 + i / 2) % 1;
            return <MoedaCor key={`sb${i}`} tema={tema} pos={[RALOS.torneira[0], 1.45 - 1.4 * c * c, RALOS.torneira[2] + 0.43]} r={0.09} cor={ouro} rot={[c * 3, 0, 0.4]} escala={(fechaSub - 0.5) * 2} />;
          })
        : null}
      <DocumentoGrande tema={tema} pos={[RALOS.gestao[0], 1.0, RALOS.gestao[2]]} rot={[-0.2, 0.25, 0]} escala={0.7 * gestao} carimbo={check} />
      {[0, 1, 2, 3].map((i) => {
        const de = [RALOS.cadeira, RALOS.cheque, RALOS.cano, RALOS.torneira][i];
        const k = k01(salvas * 1.3 - i * 0.1);
        return k > 0.02 && k < 0.98 ? <MoedaCor key={`sv${i}`} tema={tema} pos={curva([de[0], 1.2, de[2]], [TESOURO[0], 1.4, TESOURO[2] + 1.6], 3, k)} r={0.22} cor={ouro} brilho={0.4} rot={[Math.PI / 2 - 0.4, t * 2, 0]} /> : null;
      })}

      {/* ===== Investir ===== */}
      <Lupa tema={tema} pos={LUPA} rot={[0.3, -0.5 + 0.6 * rampa(t, T.ciencia, T.ciencia + 1.5), 0.2]} escala={1.1 * lupaInv} />
      <Notebook tema={tema} pos={NOTE} rotY={-0.2} escala={1.6 * note} abre={abreNote} tela={abreNote} />
      {poste > 0.02 ? <Poste tema={tema} pos={POSTE} luz={0.2 + 0.8 * poste} /> : null}

      {/* ===== Vitrine ===== */}
      {VITRINE.map((p, i) => (
        <Pedestal key={`pd${i}`} tema={tema} pos={p} sobe={pedestais} luz={[campo, plataforma, jato][i] * 0.6 + luzVitrine} />
      ))}
      {pedestais > 0.5
        ? ['EMBRAPA', 'PETROBRAS', 'EMBRAER'].map((nome, i) => {
            const k = [campo, plataforma, jato][i];
            return k > 0.02 ? <Placa key={nome} tema={tema} pos={[VITRINE[i][0], 1.85, VITRINE[i][2] - 0.9]} larg={2.3 * Math.min(1, k)} alt={0.46 * Math.min(1, k)} linhas={[{t: nome, tam: 190, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.25} /> : null;
          })
        : null}
      <CampoPlantacao tema={tema} pos={[VITRINE[0][0], 0.5, VITRINE[0][2]]} escala={1.3 * campo} cresce={cresceCampo} />
      <PlataformaPetroleo tema={tema} pos={[VITRINE[1][0], 0.5, VITRINE[1][2]]} escala={1.2 * plataforma} luz={plataforma} />
      {plataforma > 0.02 ? [0, 1].map((i) => <Barril key={`br${i}`} tema={tema} pos={[VITRINE[1][0] + 0.75 + i * 0.32, 0.5, VITRINE[1][2] + 0.45]} escala={0.32 * plataforma} />) : null}
      <Jatinho tema={tema} pos={[VITRINE[2][0] + 1.8 * decola, 1.05 + 1.8 * decola, VITRINE[2][2] - 0.5 * decola]} rumo={-0.5} pique={-0.12 * decola} escala={0.42 * jato} />
      {linhaLP > 0.02 ? (
        <LinhaChao
          tema={tema}
          x0={-5}
          x1={5}
          z={15.8}
          k={linhaLP}
          acesa={rampa(t, T.longoPrazo, T.embraer + 0.6, Easing.linear)}
          marcos={VITRINE.map((p, i) => ({x: p[0], k: entra(t, [T.embrapa, T.petrobras, T.embraer][i], 0.4), aceso: rampa(t, [T.embrapa, T.petrobras, T.embraer][i], [T.embrapa, T.petrobras, T.embraer][i] + 0.4)}))}
        />
      ) : null}

      {/* ===== Debate e futuro ===== */}
      {doc > 0.02 ? (
        <group position={[DOC[0], 0, DOC[2] - 1.2 * 0]}>
          <Caixa args={[1.7 * doc, 2.2 * doc, 0.06]} raio={0.03} cor={mistura(tema.objetoClaro, tema.objeto, 0.35)} position={[0, 1.4, 0]} />
          {doc > 0.6 ? <Placa tema={tema} pos={[0, 2.15, 0.035]} larg={1.5} alt={0.5} linhas={[{t: 'DÍVIDA', tam: 220, cor: tema.tinta, peso: 900}, {t: 'PÚBLICA', tam: 220, cor: tema.tinta, peso: 900}]} /> : null}
          {doc > 0.6 ? [0, 1, 2, 3].map((i) => <Caixa key={`dl${i}`} args={[1.2, 0.04, 0.01]} raio={0.01} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} sombra={false} position={[0, 1.6 - i * 0.22, 0.036]} />) : null}
          {carimbo > 0.02 ? <Caixa args={[1.0, 0.36, 0.04]} raio={0.06} cor={tema.acento} emissivo={0.5} position={[0, 0.85, 0.06 + 0.8 * (1 - carimbo)]} sombra={false} /> : null}
        </group>
      ) : null}
      <Onda pos={DOC} k={rampa(t, T.vila + 0.1, T.vila + 1.3, Easing.linear)} cor={tema.acento} raio={3} />
      <Tesoura tema={tema} pos={[0, 3.6, 4.5]} rot={[0.9, 0.3, 0]} escala={1.4 * tesouraFim} abre={0.5 + 0.5 * Math.sin(t * 5)} />
      {t > T.investirNo - 0.2
        ? FUTURO.map((f, i) => {
            const k = entra(t, T.investirNo + f.atraso, 0.7);
            return k > 0.02 ? <PrediozinhoFumaca key={`fu${i}`} tema={tema} pos={f.p} alt={f.alt * Math.min(1, k)} larg={1.4} luz={0.1 + 0.9 * luzFuturo} /> : null;
          })
        : null}
    </>
  );
};

// ---------- Câmeras de cada cena (plano.md, seção 4) ----------
type Cena = {ini: number; cam: (t: number, ini: number, fim: number) => Cam; foco?: (t: number, cam: Cam) => Foco};
const CENAS: Cena[] = [
  // 1. a casa; grua para a praça
  {
    ini: 0,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0, 1.2, 9.3], 4.2, 3.0, D(15, 22))],
          [T.ganhar, enq([0.9, 1.0, 9.2], 4.6, 2.8, D(-8, 18))],
          [T.estado - 0.1, enq([0.9, 1.0, 9.0], 4.8, 2.8, D(-6, 20))],
          [T.estado + 1.2, enq([0, 1.8, 0.8], 12.5, 6, D(0, 28))],
          [b, enq([0.4, 1.8, 1.2], 12, 5.6, D(8, 28))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 2. rolagem: arco por cima da esteira
  {ini: T.eSabe, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([0.3, 0.6, 2.6], 8.6, 4.2, D(-15, 34))], [b, enq([0.6, 0.6, 2.6], 8.0, 4.0, D(15, 34))]]), rampa(t, a, b))},
  // 3. limites
  {ini: T.masIsso, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([5, 1.2, 4.6], 10, 4.4, D(18, 28))], [T.inflacao1 - 0.2, enq([7, 1.4, 5.8], 6.8, 3.6, D(16, 22))], [b, enq([7, 1.4, 6.0], 6.2, 3.4, D(6, 22))]]), rampa(t, a, b))},
  // 4. Rua das Dívidas, depois a torre do Brasil
  {
    ini: T.eOBrasil,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-5, 2, 0.5], 13, 6.5, D(-10, 26))],
          [T.japao - 0.2, enq([-15, 3.4, -2], 13.5, 7.6, D(50, 20))],
          [T.bruta - 0.3, enq([-15.5, 3.0, -2], 12.5, 7.0, D(42, 20))],
          [T.bruta + 0.7, enq([-19.9, 1.9, -2], 4.4, 4.4, D(30, 18))],
          [b, enq([-19.9, 1.9, -2], 4.0, 4.0, D(16, 18))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 5. o custo: recua e desce até a torneira
  {
    ini: T.ouSeja,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-15, 2.8, -1.5], 13.5, 7.4, D(62, 24))],
          [T.maisPesa - 0.2, enq([-15.5, 2.8, -1.5], 13, 7.2, D(56, 24))],
          [T.maisPesa + 0.8, enq([-19.9, 2.0, 0.2], 4.6, 4.6, D(32, 22))],
          [b, enq([-19.9, 2.0, 0.2], 4.4, 4.4, D(24, 22))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 6. Tesouro e multidão; Linha do Tempo e balança
  {
    ini: T.entao,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-3.5, 2.2, -0.2], 9, 5.4, D(-20, 28))],
          [T.detalhe + 0.4, enq([-3.5, 2.4, -0.4], 7.2, 4.8, D(-8, 26))],
          [T.a1999 - 0.15, enq([-3.4, 2.4, -0.4], 7.0, 4.6, D(-6, 26))],
          [T.a1999 + 1.1, enq([LT_C + 0.8, 1.4, -1.8], 16.5, 6.4, D(-32, 44))],
          [T.arrecadava - 0.5, enq([LT_C + 0.8, 1.4, -1.6], 16, 6.2, D(-26, 44))],
          [T.arrecadava + 0.4, enq([BALANCA[0] + 0.6, 1.3, 1.2], 6.2, 3.6, D(-26, 24))],
          [b, enq([BALANCA[0] + 0.8, 1.3, 1.6], 5.8, 3.4, D(-18, 22))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 7. mesmo assim: Selic, barras e o cubo
  {
    ini: T.eAdivinha,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([LT_C + 0.8, 1.4, -1.6], 16, 6.2, D(-26, 44))],
          [T.mesmoAssim + 0.2, enq([16.7, 1.6, -5.4], 8.4, 3.6, D(-14, 24))],
          [T.gastoPublico - 0.3, enq([16.7, 1.6, -5.6], 8.0, 3.6, D(-4, 24))],
          [T.gastoPublico + 0.6, enq([16.7, 1.7, -9.0], 6.6, 4.4, D(8, 28))],
          [b, enq([16.7, 1.7, -9.0], 6.2, 4.2, D(20, 32))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 8. o quarteirão do Banco Central, o Focus e a Selic
  {
    ini: T.outroFator,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([1.6, 2.2, -11.6], 14, 6.6, D(10, 30))],
          [T.bcConsidera - 0.3, enq([2, 2.2, -11.4], 12.4, 6.0, D(24, 30))],
          [T.bcConsidera + 0.8, enq([-1.4, 1.6, -9.6], 6.4, 3.8, D(-10, 22))],
          [b, enq([-1.6, 1.8, -9.6], 6.0, 3.8, D(-24, 22))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 9. investidor; crédito e empresa; Tesouro
  {
    ini: T.eQuem,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-5.6, 1.1, -5.4], 5.6, 3.4, D(-35, 26))],
          [T.creditoFica - 0.3, enq([-5.6, 1.1, -5.2], 5.2, 3.2, D(-20, 26))],
          [T.creditoFica + 0.6, enq([6.8, 1.8, -6.6], 8.2, 4.4, D(20, 28))],
          [T.governoGasta - 0.1, enq([6.8, 1.8, -6.6], 7.8, 4.2, D(28, 28))],
          [T.governoGasta + 0.8, enq([-4.6, 1.6, -0.2], 6.6, 3.8, D(-12, 26))],
          [b, enq([-4.8, 1.6, 0], 6.2, 3.6, D(-20, 26))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 10. serviços públicos; ralos do dinheiro
  {
    ini: T.masQual,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([11.3, 1.5, 8.8], 8.4, 4.2, D(26, 24))],
          [T.combater - 0.3, enq([11.3, 1.5, 8.8], 8.0, 4.0, D(18, 24))],
          [T.combater + 0.7, enq([-11.3, 1.3, 9.2], 7.6, 3.4, D(-16, 22))],
          [b, enq([-11.3, 1.3, 9.4], 7.0, 3.2, D(-4, 22))],
        ]),
        rampa(t, a, b),
        -1,
      ),
  },
  // 11. investir; a vitrine
  {
    ini: T.aoMesmo,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([11.5, 1.5, 9.6], 9.4, 4.4, D(20, 24))],
          [T.invPublico - 0.3, enq([11.5, 1.5, 9.6], 8.8, 4.2, D(34, 24))],
          [T.invPublico + 0.7, enq([0, 1.4, 14.2], 9.0, 3.8, D(0, 22))],
          [b, enq([0.4, 1.6, 14.2], 8.6, 3.8, D(15, 22))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 12. o documento; o mundo inteiro; a cidade do futuro; grua final
  {
    ini: T.portanto,
    cam: (t, a) =>
      trilhoCam(t, [
        [a, enq([0, 1.6, 1.2], 6.4, 4.4, D(0, 30))],
        [T.debate - 0.1, enq([0, 1.6, 1.2], 6.0, 4.2, D(-8, 30))],
        [T.debate + 1.6, enq([0, 1, -1], 28, 18, D(10, 40))],
        [T.cortandoGastos, enq([0, 1, -1], 30, 19, D(0, 40))],
        [T.investirNo + 0.4, enq([0, 1, 0], 38, 24, D(-10, 44))],
        [T.segue, enq([0, 1, 2], 40, 25, D(-4, 46))],
        [FIM, enq([0, 1, 3], 44, 28, D(6, 50))],
      ]),
    foco: (t, cam) => focarEm(cam, cam.alvo, distancia(cam.pos, cam.alvo) * (t < T.debate ? 0.3 : 0.5), 3),
  },
];

// ---------- Interface por cima do 3D ----------
const X = SEGURO.esq + 20;
const Rotulo: React.FC<{tema: Tema; cam: Cam; p: V3; x: number; y: number; titulo: string; sub?: string; aparece: number; some?: number; destaque?: boolean}> = ({tema, cam, p, x, y, titulo, sub, aparece, some = 1, destaque}) =>
  aparece <= 0 || some <= 0 ? null : (
    <div style={{position: 'absolute', inset: 0, opacity: some}}>
      <Etiqueta tema={tema} x={x} y={y} alvo={pj(p, cam)} titulo={titulo} sub={sub} aparece={aparece} destaque={destaque} />
    </div>
  );
const Centro: React.FC<{y: number; children: React.ReactNode; some?: number; gap?: number}> = ({y, children, some = 1, gap = 14}) =>
  some <= 0 ? null : <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap, opacity: some}}>{children}</div>;
// Rótulo curto preso a um ponto do 3D.
const Marquinha: React.FC<{tema: Tema; cam: Cam; p: V3; texto: string; k: number; destaque?: boolean; tam?: number}> = ({tema, cam, p, texto, k, destaque, tam = 26}) => {
  if (k <= 0) return null;
  const q = pj(p, cam);
  if (!q.visivel) return null;
  return (
    <div style={{position: 'absolute', left: q.x - 150, top: q.y - 30, width: 300, display: 'flex', justifyContent: 'center'}}>
      <Chip tema={tema} texto={texto} k={k} destaque={destaque} tam={tam} />
    </div>
  );
};
// Número pequeno preso ao topo de uma barra (a Selic de cada ano).
const Numero: React.FC<{tema: Tema; cam: Cam; p: V3; texto: string; k: number; alto?: boolean}> = ({tema, cam, p, texto, k, alto}) => {
  if (k <= 0) return null;
  const q = pj(p, cam);
  if (!q.visivel) return null;
  return (
    <div style={{position: 'absolute', left: q.x - 60, top: q.y - 34, width: 120, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(1, k)) * 10}px)`}}>
      <div style={{padding: '3px 8px', borderRadius: 8, background: alto ? tema.acento : tema.cartao, fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: 0, color: tema.texto, whiteSpace: 'nowrap'}}>{texto}</div>
    </div>
  );
};
// Selo de fonte: pequeno, acima da legenda.
const Selo: React.FC<{tema: Tema; texto: string; k: number; y?: number}> = ({tema, texto, k, y = 1250}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k)}}>
      <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{texto}</div>
    </div>
  );
const Carimbo: React.FC<{tema: Tema; texto: string; k: number; y: number; tam?: number}> = ({tema, texto, k, y, tam = 64}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.5), transform: `scale(${2 - Math.min(k, 1)}) rotate(-5deg)`}}>
      <div style={{padding: '14px 40px', borderRadius: 18, border: `6px solid ${tema.acento}`, background: tema.cartao, fontFamily: FONTE, fontWeight: 850, fontSize: tam, color: tema.acento, whiteSpace: 'nowrap', letterSpacing: 2}}>{texto}</div>
    </div>
  );

const Interface: React.FC<{tema: Tema; t: number; cam: Cam; cena: number}> = ({tema, t, cam, cena}) => {
  const ap = (a: number) => rampa(t, a - 0.05, a + 0.5, Easing.linear);
  const fora = (a: number) => 1 - rampa(t, a - 0.35, a - 0.05, Easing.linear);
  const e = (a: number, d = 0.45) => entra(t, a, d);
  const topo = (b: number): V3 => [0, Y_TOPO(b) + 0.35, Z_RUA];
  if (cena === 0)
    return (
      <>
        <Centro y={440} some={fora(T.estado)}>
          <Chip tema={tema} texto="ORÇAMENTO DA CASA" k={e(T.orcamento)} tam={36} />
        </Centro>
        <Centro y={540} some={fora(T.estado)}>
          <Chip tema={tema} texto="1º GANHA" k={e(T.ganhar)} destaque tam={34} />
          <Chip tema={tema} texto="2º GASTA" k={e(T.gastar)} tam={34} />
        </Centro>
        <Rotulo tema={tema} cam={cam} p={[SALARIO[0], 1.0, SALARIO[2]]} x={X + 420} y={1080} titulo="Salário" sub="O QUE ENTRA" aparece={ap(T.ganhar + 0.2)} some={fora(T.estado)} />
        <Rotulo tema={tema} cam={cam} p={[BC[0], 2.2, BC[2]]} x={X + 380} y={470} titulo="Banco Central" sub="CUIDA DA MOEDA" aparece={ap(T.financia)} some={fora(T.eSabe)} />
        <Centro y={1110} some={fora(T.eSabe + 0.3)}>
          <Chip tema={tema} texto="TÍTULOS PÚBLICOS" k={e(T.vendendo)} destaque tam={34} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={[INVEST[1][0] + 0.4, 1.4, INVEST[1][2]]} texto="INVESTIDORES" k={e(T.dividaPub) * fora(T.eSabe + 0.3)} tam={24} />
      </>
    );
  if (cena === 1)
    return (
      <>
        <Centro y={440} some={fora(T.rolar)}>
          <Chip tema={tema} texto="QUITAR TUDO DE UMA VEZ?" k={e(T.quitar)} tam={34} risco={rampa(t, T.umaVez + 0.2, T.umaVez + 0.7)} />
        </Centro>
        <Centro y={440}>
          <Chip tema={tema} texto="ROLAGEM DA DÍVIDA" k={e(T.rolar)} tam={36} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={[SLOT0[0], 1.0, SLOT0[2]]} texto="VENCEU" k={e(T.vencem) * fora(T.novos + 0.6)} destaque tam={24} />
        <Centro y={1110}>
          <Chip tema={tema} texto="PAGA O ANTIGO COM O NOVO" k={e(T.novos + 0.2)} destaque tam={32} />
        </Centro>
      </>
    );
  if (cena === 2)
    return (
      <>
        <Centro y={440}>
          <Chip tema={tema} texto="TEM LIMITE" k={e(T.semLimites)} tam={38} />
        </Centro>
        <Centro y={1110}>
          <Chip tema={tema} texto="OS 3 SINAIS" k={e(T.fundamentais)} destaque tam={36} />
        </Centro>
      </>
    );
  if (cena === 3) {
    const v = [
      {i: 0, a: T.p200, txt: 'JAPÃO: 200%+'},
      {i: 1, a: T.p120, txt: 'EUA: 120%+'},
      {i: 2, a: T.p100, txt: 'CHINA: 100%+'},
      {i: 3, a: T.p83, txt: 'BRASIL: 83%'},
    ];
    return (
      <>
        {v.map((x) => (
          <Marquinha key={x.txt} tema={tema} cam={cam} p={soma(topo(PAISES[x.i].blocos), [PAISES[x.i].x, 0, 0])} texto={x.txt} k={e(x.a)} destaque={x.i === 3} tam={x.i === 3 ? 30 : 26} />
        ))}
        <Marquinha tema={tema} cam={cam} p={[DOLARES[0], 1.6, DOLARES[2]]} texto="US$ 40 TRI" k={e(T.tri40)} tam={24} />
        <Marquinha tema={tema} cam={cam} p={[PAISES[3].x + 1.6, Y_TOPO(9.4) + 0.2, Z_RUA]} texto="PELO FMI: 90%+" k={e(T.p90)} tam={24} />
        <Selo tema={tema} texto="FONTE: FMI · PROJEÇÕES 2026" k={ap(T.segundoFmi) * fora(T.criterioBc)} />
        <Selo tema={tema} texto="CRITÉRIO DO BANCO CENTRAL · AGO/2026" k={ap(T.criterioBc) * fora(T.criterioFmi)} />
        <Selo tema={tema} texto="CRITÉRIO DO FMI" k={ap(T.criterioFmi)} />
      </>
    );
  }
  if (cena === 4)
    return (
      <>
        <Marquinha tema={tema} cam={cam} p={[PAISES[0].x, Y_TOPO(20.5) + 0.6, Z_RUA]} texto="RICOS" k={e(T.emergente) * fora(T.maisPesa)} tam={24} />
        <Marquinha tema={tema} cam={cam} p={[PAISES[1].x, Y_TOPO(12.5) + 0.6, Z_RUA]} texto="RICOS" k={e(T.emergente + 0.1) * fora(T.maisPesa)} tam={24} />
        <Marquinha tema={tema} cam={cam} p={[PAISES[3].x, Y_TOPO(8.3) + 0.6, Z_RUA]} texto="EMERGENTE" k={e(T.emergente + 0.25) * fora(T.maisPesa)} destaque tam={26} />
        <Centro y={1110}>
          <Chip tema={tema} texto="O PESO: OS JUROS" k={e(T.custoJuros)} destaque tam={38} />
        </Centro>
      </>
    );
  if (cena === 5) {
    const dur = T.a2013 + 0.9 - T.a1999;
    return (
      <>
        <Centro y={440} some={fora(T.a1999)}>
          <Chip tema={tema} texto="A CULPA É SÓ DO GASTO?" k={e(T.nosGastos)} tam={34} />
        </Centro>
        {SELIC.map((v, i) => {
          const a = T.a1999 + (i / 15) * dur;
          const p: V3 = [xAno(i), Y_TILE + v * 0.12 + 0.22 + (i % 2) * 0.42, LT.z];
          return <Numero key={`sx${i}`} tema={tema} cam={cam} p={p} texto={fmtPct(v)} k={entra(t, a + 0.25, 0.4) * fora(T.arrecadava + 0.2)} alto={i === 3} />;
        })}
        <Marquinha tema={tema} cam={cam} p={[xAno(15) - 0.6, 0.05, LT.z + 1.3]} texto="2014: DÉFICIT" k={e(T.todosAnos + 0.2) * fora(T.arrecadava + 0.2)} tam={18} />
        <Centro y={440}>
          <Chip tema={tema} texto="SUPERÁVIT PRIMÁRIO" k={e(T.superavit)} destaque tam={34} />
        </Centro>
        <Centro y={530} some={fora(T.arrecadava + 0.2)}>
          <Chip tema={tema} texto="15 ANOS SEGUIDOS" k={e(T.todosAnos)} tam={30} />
        </Centro>
        <Selo tema={tema} texto="SELIC: META EM DEZEMBRO DE CADA ANO · BANCO CENTRAL" k={ap(T.a1999 + 0.3) * fora(T.todosAnos)} />
        <Selo tema={tema} texto="SUPERÁVIT PRIMÁRIO · FONTE: BANCO CENTRAL" k={ap(T.todosAnos) * fora(T.arrecadava + 0.2)} />
        <Rotulo tema={tema} cam={cam} p={[BALANCA[0] - 2.0, 2.0, BALANCA[2]]} x={X} y={1060} titulo="Arrecadação" sub="MAIS PESADA" destaque aparece={ap(T.arrecadava)} />
        <Rotulo tema={tema} cam={cam} p={[BALANCA[0] + 2.0, 2.4, BALANCA[2]]} x={X + 430} y={600} titulo="Gastos" sub="SEM OS JUROS" aparece={ap(T.gastava)} />
        <Marquinha tema={tema} cam={cam} p={[PILHA_JUROS_FORA[0], 1.0, PILHA_JUROS_FORA[2]]} texto="JUROS: FORA DA CONTA" k={e(T.semContar)} tam={22} />
      </>
    );
  }
  if (cena === 6)
    return (
      <>
        <Centro y={440} some={fora(T.mesmoAssim + 0.3)}>
          <Chip tema={tema} texto="SELIC DE 2 DÍGITOS EM 13 DOS 15 ANOS" k={e(T.eAdivinha)} destaque tam={28} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={[BARRAS_JR[2].x, 3.0, Z_JR]} texto="BRASIL" k={e(T.jurosReais + 0.3) * fora(T.gastoPublico)} destaque tam={26} />
        <Centro y={440} some={fora(T.gastoPublico)}>
          <Chip tema={tema} texto="JUROS REAIS: ENTRE OS MAIS ALTOS DO MUNDO" k={e(T.maisAltos)} tam={26} />
        </Centro>
        <Selo tema={tema} texto="RANKING MONEYOU E LEV · 40 PAÍSES · SET/2026" k={ap(T.maisAltos) * fora(T.gastoPublico)} />
        <Centro y={440}>
          <Chip tema={tema} texto="O GASTO NÃO EXPLICA TUDO" k={e(T.naoExplica)} tam={32} />
        </Centro>
        <Centro y={1110}>
          <Chip tema={tema} texto="TUDO ISSO PESA" k={e(T.tambemPesam)} destaque tam={36} />
        </Centro>
      </>
    );
  if (cena === 7)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[SEDE[0], 3.4, SEDE[2]]} x={X} y={470} titulo="Banco Central" sub="DECIDE A SELIC" aparece={ap(T.outroFator + 0.3)} some={fora(T.focus)} />
        <Marquinha tema={tema} cam={cam} p={[BANCOS[0][0], 2.8, BANCOS[0][2]]} texto="BANCOS" k={e(T.bancos) * fora(T.essasPrev)} tam={22} />
        <Marquinha tema={tema} cam={cam} p={[CONSULT[0][0], 3.0, CONSULT[0][2]]} texto="CONSULTORIAS" k={e(T.consultorias) * fora(T.essasPrev)} tam={22} />
        <Centro y={440} some={fora(T.essasPrev)}>
          <Chip tema={tema} texto="BOLETIM FOCUS" k={e(T.focus)} destaque tam={36} />
        </Centro>
        <Selo tema={tema} texto="PESQUISA SEMANAL DO BANCO CENTRAL" k={ap(T.focus) * fora(T.essasPrev)} />
        {FICHAS.map((f, i) => (t > f.t0() && t < T.bcConsidera ? <Marquinha key={f.txt} tema={tema} cam={cam} p={soma(fichaPos(i, t), [0, 0.55, 0])} texto={f.txt} k={e(f.t0())} tam={18} /> : null))}
        <Centro y={440} some={fora(T.bcConsidera)}>
          <Chip tema={tema} texto="PREVISÃO" k={e(T.essasPrev)} tam={30} />
          <Chip tema={tema} texto="REAL" k={e(T.essasPrev + 0.35)} tam={30} apagado={0} />
        </Centro>
        <Centro y={1110} some={fora(T.outrosInd)}>
          <Chip tema={tema} texto="PREVISÕES TAMBÉM ERRAM" k={e(T.erram)} destaque tam={32} />
        </Centro>
        <Centro y={1110}>
          <Chip tema={tema} texto="+ OUTROS INDICADORES" k={e(T.outrosInd)} tam={30} />
        </Centro>
        <Rotulo tema={tema} cam={cam} p={[SELIC_MED[0], 2.4, SELIC_MED[2]]} x={X + 400} y={470} titulo="Selic" sub="DECIDIDA PELO COPOM" destaque aparece={ap(T.decidir)} />
      </>
    );
  if (cena === 8)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[INVESTIDOR[0], 1.4, INVESTIDOR[2]]} x={X} y={470} titulo="Investidor" sub="APLICAÇÃO NOS JUROS" aparece={ap(T.aplicacoes)} some={fora(T.creditoFica)} />
        <Centro y={1110} some={fora(T.creditoFica)}>
          <Chip tema={tema} texto="TÍTULOS PÓS-FIXADOS" k={e(T.posFixados)} destaque tam={32} />
        </Centro>
        <Rotulo tema={tema} cam={cam} p={[CARTAO[0], 2.6, CARTAO[2]]} x={X} y={470} titulo="Crédito caro" sub="PARA FAMÍLIAS E EMPRESAS" aparece={ap(T.creditoFica)} some={fora(T.governoGasta)} />
        <Rotulo tema={tema} cam={cam} p={[EMPRESA[0], 2.4, EMPRESA[2]]} x={X + 340} y={1050} titulo="Menos investimento" sub="OBRA PARADA" aparece={ap(T.investemMenos)} some={fora(T.governoGasta)} />
        <Centro y={1110}>
          <Chip tema={tema} texto="MAIS GASTO COM JUROS" k={e(T.jurosDivida2)} destaque tam={34} />
        </Centro>
      </>
    );
  if (cena === 9)
    return (
      <>
        <Marquinha tema={tema} cam={cam} p={[ESCOLA[0], 1.9, ESCOLA[2]]} texto="EDUCAÇÃO" k={e(T.educacao1) * fora(T.combater)} tam={22} />
        <Marquinha tema={tema} cam={cam} p={[OBRA[0], 2.4, OBRA[2]]} texto="INVESTIMENTOS" k={e(T.investimentos) * fora(T.combater)} tam={22} />
        <Centro y={440} some={fora(T.combater)}>
          <Chip tema={tema} texto="NÃO É SÓ CORTAR" k={e(T.investimentos + 0.2)} destaque tam={36} />
        </Centro>
        {[
          {p: [RALOS.cadeira[0], 2.2, RALOS.cadeira[2]] as V3, txt: 'PRIVILÉGIOS', a: T.privilegios},
          {p: [RALOS.cheque[0], 2.6, RALOS.cheque[2]] as V3, txt: 'SUPERSALÁRIOS', a: T.supersalarios},
          {p: [RALOS.cano[0], 1.8, RALOS.cano[2]] as V3, txt: 'DESPERDÍCIO', a: T.desperdicios},
          {p: [RALOS.torneira[0], 2.2, RALOS.torneira[2]] as V3, txt: 'SUBSÍDIOS INEFICIENTES', a: T.subsidios},
          {p: [RALOS.gestao[0], 2.1, RALOS.gestao[2]] as V3, txt: '✓ GESTÃO', a: T.gestao},
        ].map((r) => (
          <Marquinha key={r.txt} tema={tema} cam={cam} p={r.p} texto={r.txt} k={e(r.a)} destaque={r.txt === '✓ GESTÃO'} tam={20} />
        ))}
      </>
    );
  if (cena === 10)
    return (
      <>
        {[
          {p: [LUPA[0], 2.5, LUPA[2]] as V3, txt: 'CIÊNCIA', a: T.ciencia},
          {p: [NOTE[0], 1.3, NOTE[2]] as V3, txt: 'TECNOLOGIA', a: T.tecnologia},
          {p: [OBRA[0], 2.8, OBRA[2]] as V3, txt: 'INFRAESTRUTURA', a: T.infra},
          {p: [ESCOLA[0], 1.9, ESCOLA[2]] as V3, txt: 'EDUCAÇÃO', a: T.educacao2},
        ].map((r) => (
          <Marquinha key={r.txt} tema={tema} cam={cam} p={r.p} texto={r.txt} k={e(r.a) * fora(T.invPublico + 0.4)} tam={22} />
        ))}
        <Centro y={440}>
          <Chip tema={tema} texto="INVESTIMENTO DE LONGO PRAZO" k={e(T.longoPrazo)} tam={30} />
        </Centro>
        <Selo tema={tema} texto="EMBRAER · 1969 · NASCEU ESTATAL" k={ap(T.nasceu)} />
      </>
    );
  if (cena === 11)
    return (
      <>
        <Carimbo tema={tema} texto="NÃO É VILÃ" k={rampa(t, T.vila, T.vila + 0.35, mola) * fora(T.debate + 0.6)} y={520} tam={70} />
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: fora(T.cortandoGastos)}}>
          <Chip tema={tema} texto="1. QUANTO PAGAMOS DE JUROS" k={e(T.pagamos)} tam={28} />
          <Chip tema={tema} texto="2. CONTAS SUSTENTÁVEIS" k={e(T.sustentaveis)} tam={28} />
          <Chip tema={tema} texto="3. COMO USAMOS O DINHEIRO" k={e(T.dinheiroPub)} tam={28} />
        </div>
        <Centro y={440} some={fora(T.segue)}>
          <Chip tema={tema} texto="SÓ CORTAR NÃO BASTA" k={e(T.cortandoGastos)} tam={34} />
        </Centro>
        <Centro y={540} some={fora(T.segue)}>
          <Chip tema={tema} texto="INVESTIR NO FUTURO" k={e(T.investirNo)} destaque tam={36} />
        </Centro>
        {t > T.segue - 0.05 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4), transform: `translateY(${(1 - rampa(t, T.segue, T.segue + 0.5, mola)) * 30}px)`}}>
            <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE O PERFIL</div>
              <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
              <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8}}>{SERIE.toUpperCase()}</div>
            </div>
          </div>
        ) : null}
      </>
    );
  return null;
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.28}));
  [T.estado, T.japao - 0.3, T.a1999, T.bcConsidera].forEach((t) => s.push({t, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t, f: 'tique', v: 0.28}));
  [T.orcamento, T.moeda, T.financia, T.vendendo, T.sabe, T.inflacao1, T.capacidade, T.sustent, T.brasilEsta, T.tri40, T.maisPesa, T.muitaGente, T.detalhe, T.arrecadava, T.mesmoAssim, T.gastoPublico, T.inflacao2, T.cambio, T.credito1, T.outroFator, T.focus, T.aplicacoes, T.creditoFica, T.empresas, T.saude, T.educacao1, T.privilegios, T.supersalarios, T.desperdicios, T.subsidios, T.ciencia, T.tecnologia, T.invPublico, T.embrapa, T.petrobras].forEach((t) => s.push({t, f: 'pop', v: 0.3}));
  [T.japao, T.eua, T.china, T.bruta, T.a1999 + 0.2].forEach((t) => s.push({t, f: 'subida', v: 0.26}));
  [T.novos + 0.6, T.todosAnos, T.investimentos, T.gestao + 0.2, T.embraer + 0.4, T.segue].forEach((t) => s.push({t, f: 'ding', v: 0.36}));
  [T.cortando, T.cortandoGastos, T.todosAnos + 0.3, T.investemMenos].forEach((t) => s.push({t, f: 'baque', v: 0.26}));
  s.push({t: T.vila + 0.1, f: 'impacto', v: 0.42});
  [T.decidir, T.fInfl + 0.8, T.fJuros + 0.8, T.fCresc + 0.8].forEach((t) => s.push({t, f: 'bip', v: 0.24}));
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();

// Som do vídeo: narração + efeitos do Estúdio. O Estúdio não traz trilha; para pôr uma sua (sem direitos autorais):
// {arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1.3}
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// Segundos dos quadros de revisão padrão: começo e meio de cada cena e os momentos-chave.
export const REVISAO: number[] = [
  0.8, T.ganhar + 1.0, T.vendendo + 0.6, T.dividaPub + 0.9, T.rolar + 0.6, T.novos + 0.7, T.inflacao1 + 0.6, T.fundamentais + 0.6, T.p200 + 0.5, T.p120 + 0.4, T.p83 + 0.4, T.p90 + 0.4, T.emergente + 0.6, T.custoJuros + 0.8,
  T.muitaGente + 0.9, T.detalhe + 0.5, T.a2013 + 1.0, T.superavit + 0.6, T.gastava + 0.7, T.eAdivinha + 0.3, T.maisAltos + 0.4, T.tambemPesam + 0.6, T.focus + 0.5, T.fCresc + 0.8, T.erram + 0.3, T.decidir + 0.8,
  T.posFixados + 0.5, T.creditoFica + 0.9, T.investemMenos + 0.7, T.jurosDivida2 + 0.6, T.saude + 0.6, T.investimentos + 0.8, T.supersalarios + 0.8, T.gestao + 0.6, T.ciencia + 0.6, T.infra + 0.8, T.embrapa + 0.6, T.embraer + 1.0,
  T.vila + 0.6, T.dinheiroPub + 0.6, T.investirNo + 0.9, T.segue + 1.2, T.bolso + 0.3,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};

export const GovernoCasa: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  // Sem desfoque de profundidade: a pessoa prefere tudo nítido, inclusive as palavras nos objetos 3D (aprendizado 003).
  const foco = undefined;
  // Troca de cena: leve zoom e desfoque que somem em 0,35 a 0,7 s. Fim: escurece no último meio segundo.
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={i === CENAS.length - 1 ? 480 : 260} sombraArea={i === CENAS.length - 1 ? 52 : 34} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} centro={cam.alvo} tema={tema} />
      <AcabamentoCinema foco={foco} raioAO={0.6} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} cam={cam} cena={i} tema={tema} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Dívida pública" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa (still 1080 × 1920) ----------
// Fundo: um quadro limpo do próprio mundo, gerado com
//   npx remotion still GovernoCasaLimpo "projetos/003. o governo não é a sua casa/capa/fundo-limpo.jpg" --frame=NNN
// Título: 4 linhas de até 12 caracteres, a última no acento (aprovado em 24/10/2026).
export const TITULO_CAPA = ['Deve menos,', 'paga mais', 'juros.', 'Por quê?'];

export const CapaGovernoCasa: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 250}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · DÍVIDA PÚBLICA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
