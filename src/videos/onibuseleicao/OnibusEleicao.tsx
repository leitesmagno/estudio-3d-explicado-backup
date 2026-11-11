import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Onda, Palco, Particulas, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Envelope, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Ampulheta, ArcoPontos, BalancaJustica, Jatinho, Lupa, NuvemChuva, Onibus, OrgaoPublico, PilhaMoedas, RelogioMesa} from '../../pecas';
import {
  Balsa, CENTRO_UF, Cais, CelularMsg, ESTADOS_MJ, Escola, Garagem, MAPA_Y, MapaTabuleiro, Maquete, OnibusVivo, PainelApuracao, Papel, Pessoa, PinoCidade, PontoOnibus, Rodoviaria, Rua, SalaSecao, TorreRelogio, UrnaCor, fe, geoE, vaga,
} from './pecas';
import {PALAVRAS} from './palavras';

// 005. ônibus na eleição (perfil @eumagnoleite, série Magno Explica).
// Mundo único: o Brasil deitado como tabuleiro. Cada cidade citada vira uma maquete que sobe num pedestal em cima do seu lugar.
// Na parte 2, a maquete de Brasília (TSE, STF, MP Eleitoral e a torre do relógio). Verde = funcionando; cinza = parado ou fechado.
// Pessoas reais só como bonecos genéricos sem rosto, todos da mesma cor neutra, com placa de nome e cargo.
// Plano: projetos/005. ônibus na eleição/plano.md (versão 1, aprovada).

export const FPS = 30;
const AUDIO_SEG = 257.76;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '005. ônibus na eleição';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  // 1. gancho
  parados: quando('Ônibus parados'),
  secretario: quando('secretário com'),
  ordem: quando('ordem de prisão'),
  votacao: quando('votação estendida'),
  estendida: quando('estendida'),
  cimaHora: quando('em cima da hora'),
  aconteceu: quando('O que aconteceu'),
  segundoTurno: quando('segundo turno'),
  ano: quando('2026?'),
  // 2. o país
  domingo: quando('Neste domingo'),
  eleitores: quando('eleitores do Brasil'),
  brasilTodo: quando('Brasil todo'),
  esperaram: quando('esperaram'),
  naoVieram: quando('que não vieram'),
  ministerio: quando('Ministério da Justiça'),
  contou: quando('contou falhas'),
  oito: quando('oito estados'),
  oea: quando('missão da OEA'),
  observa: quando('observa a eleição'),
  acompanha: quando('acompanha as denúncias'),
  respeito: quando('respeito à vontade'),
  dasUrnas: quando('vontade das urnas', 1, true),
  vamos: quando('Vamos estado'),
  // 3. Bahia
  naBahia: quando('Na Bahia'),
  maisGrave: quando('caso mais grave'),
  salvador: quando('em Salvador'),
  procon: quando('Procon'),
  achou: quando('achou ônibus'),
  garagens: quando('garagens'),
  treBA: quando('TRE da Bahia'),
  mandouVoltar: quando('mandou voltar'),
  todaFrota: quando('toda a frota'),
  multa: quando('com multa'),
  milhao: quando('R$ 1 milhão'),
  porHora: quando('milhão por hora'),
  pf: quando('Polícia Federal'),
  prender: quando('prender o secretário'),
  pablo: quando('Pablo Souza'),
  pfDiz: quando('A PF diz'),
  paris: quando('em Paris'),
  prefDiz: quando('A prefeitura diz que é viagem'),
  voltaAmanha: quando('volta amanhã'),
  bruno: quando('Bruno Reis'),
  nega: quando('Reis nega'),
  reduzir: quando('reduzir a frota'),
  adesivos: quando('adesivos eleitorais'),
  nosOnibus: quando('eleitorais nos ônibus'),
  frotaJa: quando('frota já começou'),
  normal: quando('voltar ao normal'),
  aindaBahia: quando('Ainda na Bahia'),
  ilheus: quando('Ilhéus'),
  vereadores: quando('vereadores'),
  mostraram: quando('mostraram'),
  paradosIlheus: quando('mostraram ônibus parados'),
  empresa: quando('garagem de uma empresa'),
  segundoEles: quando('segundo eles'),
  familia: quando('família do prefeito'),
  naoPronunciou: quando('não se pronunciou'),
  presTSE: quando('presidente do TSE'),
  meiaHora: quando('meia hora para as prefeituras'),
  prefeituras: quando('prefeituras de Salvador'),
  arcoSalvador: quando('prefeituras de Salvador', 1, true),
  feira: quando('Feira de Santana e Lauro'),
  lauro: quando('e Lauro de Freitas explicarem'),
  explicarem: quando('explicarem'),
  emFeira: quando('Em Feira de Santana e em'),
  apenasDen: quando('houve apenas denúncias'),
  emLauro: quando('Em Lauro, moradores'),
  moradores: quando('moradores'),
  naoConseguiam: quando('não conseguiam pegar'),
  prefLauro: quando('e a prefeitura diz'),
  frotaNormal: quando('com a frota normal'),
  emFeira2: quando('Em Feira, a prefeitura'),
  diaUtil: quando('frota de dia útil'),
  // 4. São Paulo
  emSP: quando('Em São Paulo'),
  h1320: quando('13h20'),
  pct: quando('71,7%'),
  rodavam: quando('capital rodavam'),
  campLulaSP: quando('campanha de Lula pediu à'),
  justicaPrisao: quando('Justiça a prisão'),
  secMob: quando('do secretário de Mobilidade'),
  sptrans: quando('presidente da SPTrans'),
  boulos: quando('Guilherme Boulos'),
  vaiPedir: quando('vai pedir também'),
  nunes: quando('Ricardo Nunes'),
  semDecisao: quando('Ainda não há decisão'),
  nunesDiz: quando('Nunes diz'),
  passageiros: quando('do que passageiros'),
  // 5. Rio
  noRio: quando('No Rio de Janeiro'),
  treRJ: quando('o TRE cobrou'),
  maisOnibusRJ: quando('cobrou mais ônibus'),
  petropolis: quando('Petrópolis'),
  saoGoncalo: quando('São Gonçalo'),
  // 6. Nordeste
  noPiaui: quando('No Piauí'),
  trePI: quando('o TRE mandou recompor'),
  teresina: quando('frota de Teresina'),
  milhao2: quando('R$ 1 milhão', 2),
  porHora2: quando('por hora.', 2),
  emAlagoas: quando('Em Alagoas'),
  ptDenunciou: quando('PT denunciou'),
  maceio: quando('Maceió'),
  treNegou: quando('TRE negou'),
  semTempo: quando('não havia tempo'),
  semProvas: quando('nem provas'),
  prefNega: quando('A prefeitura nega'),
  emSergipe: quando('Em Sergipe'),
  relataram: quando('passageiros relataram'),
  duasHoras: quando('cerca de duas horas'),
  rodoviaria: quando('rodoviária de Aracaju'),
  treSE: quando('TRE deu uma hora'),
  interior: quando('para o interior'),
  governo: quando('governo do estado diz'),
  vinte: quando('mais 20 ônibus'),
  procura: quando('procura foi maior'),
  naParaiba: quando('Na Paraíba'),
  joaoPessoa: quando('João Pessoa'),
  apenasDen2: quando('também houve apenas'),
  eleitoresJP: quando('eleitores disseram'),
  naoParavam: quando('não paravam nos pontos'),
  prefAbriu: quando('prefeitura abriu'),
  // 7. Pará
  noPara: quando('No Pará'),
  balsa: quando('balsa'),
  marajo: quando('Marajó'),
  lotada: quando('saiu lotada'),
  duzentas: quando('200 pessoas'),
  porto: quando('no porto, em Belém'),
  prefBelem: quando('prefeito de Belém'),
  oab: quando('OAB'),
  empresas: quando('contra as empresas'),
  // 8. o relógio
  repara: quando('Agora repara'),
  corrida: quando('corrida contra o relógio'),
  pedLula: quando('campanha de Lula pediu mais'),
  pedFlavio: quando('de Flávio também'),
  cidades17: quando('17 cidades'),
  chuva: quando('com chuva'),
  noTSE: quando('No TSE'),
  kassio: quando('Kassio Nunes'),
  meiaHora2: quando('meia hora para o Ministério'),
  mpe: quando('Ministério Público Eleitoral'),
  h1701: quando('17h01'),
  disseNao: quando('Público disse não'),
  fechar17: quando('fechar às 17h'),
  chegouSTF: quando('chegou ao STF'),
  colunista: quando('colunista Míriam'),
  fachin: quando('Edson Fachin'),
  h1640: quando('16h40'),
  mandouPara: quando('o mandou para'),
  zanin: quando('Cristiano Zanin'),
  h1702: quando('17h02'),
  zaninMandou: quando('Zanin mandou'),
  estender: quando('estender a votação'),
  h19: quando('até as 19h'),
  paisTodo: quando('país todo'),
  // 9. urnas fechadas
  mas: quando('Mas muitas'),
  muitasUrnas: quando('muitas urnas'),
  jaFechado: quando('já tinham fechado'),
  folha: quando('Segundo a Folha'),
  h1714: quando('17h14'),
  orientados: quando('mesários foram orientados'),
  naoFechar: quando('não fechar as urnas'),
  h1738: quando('17h38'),
  secaoFechada: quando('seção fechada não reabre'),
  usp: quando('Faculdade de Direito'),
  so7: quando('só 7'),
  de21: quando('de 21 seções'),
  taboao: quando('Taboão da Serra'),
  liberados: quando('mesários foram liberados'),
  depois17: quando('depois das 17h'),
  ata: quando('nome anotado em ata'),
  semVotar: quando('sem poder votar'),
  tresDF: quando('TREs do Distrito Federal'),
  minas: quando('e de Minas'),
  naoReceberam: quando('não receberam aviso'),
  novaVeneza: quando('Nova Veneza'),
  fecharam17: quando('as seções fecharam'),
  avisoNao: quando('o aviso não chegou'),
  pausou: quando('TSE pausou'),
  // 10. o impasse
  h18: quando('Às 18h,'),
  segMiriam: quando('segundo Míriam'),
  fachinTentava: quando('Fachin tentava'),
  impasse: quando('impasse'),
  entreTSE: quando('entre o TSE'),
  eZanin: quando('e Zanin'),
  paraEla: quando('Para ela'),
  omissao: quando('omissão de Kassio'),
  demora: quando('demora de Fachin'),
  confusao: quando('criaram a confusão'),
  h1812: quando('18h12'),
  kassioOrientou: quando('Kassio orientou'),
  osTREs: quando('os TREs', 2),
  abertas: quando('ainda estavam abertas'),
  seguem: quando('seguem até'),
  asQueFecharam: quando('As que fecharam'),
  naoReabrem: quando('não reabrem'),
  ministros: quando('ministros do TSE'),
  portas: quando('portas fechadas'),
  // 11. final
  falta: quando('Ainda falta saber'),
  punido: quando('quem será punido'),
  faltaOnibus: quando('pela falta de ônibus'),
  contagem: quando('quando a contagem'),
  volta: quando('votos volta'),
  suaCidade: quando('Na sua cidade'),
  passou: quando('ônibus passou'),
  comenta: quando('Me conta'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
  direitos: quando('seus direitos'),
};

// ---------- Lugares (plano, seção 2.2) ----------
const g = geoE;
const L = {
  salvador: g(-38.5, -12.97), lauro: g(-38.33, -12.9), feira: g(-38.97, -12.27), ilheus: g(-39.05, -14.79),
  sp: g(-46.63, -23.55), taboao: g(-46.79, -23.63), petropolis: g(-43.18, -22.5), saoGoncalo: g(-43.05, -22.83),
  teresina: g(-42.8, -5.09), maceio: g(-35.73, -9.67), aracaju: g(-37.07, -10.91), joaoPessoa: g(-34.86, -7.12), belem: g(-48.5, -1.46),
  brasilia: g(-47.88, -15.79), df: g(-47.4, -15.4), bh: g(-43.94, -19.92), novaVeneza: g(-49.3, -16.37),
};
const MQ = {
  salvador: [18.0, 2.6, -2.6] as V3, lauro: [16.8, 2.6, -5.6] as V3, feira: [12.8, 2.6, -4.6] as V3, ilheus: [17.6, 2.6, 1.4] as V3,
  sp: [5.6, 2.8, 11.2] as V3, rj: [13.2, 2.6, 9.6] as V3, teresina: [11.2, 2.6, -12.6] as V3, maceio: [21.0, 2.6, -6.4] as V3,
  aracaju: [20.2, 2.6, -2.4] as V3, joaoPessoa: [21.6, 2.6, -9.6] as V3, belem: [5.0, 2.8, -17.0] as V3, brasilia: [6.1, 3.2, 0.8] as V3,
};
const somaV = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
// pontos de espera espalhados pelo país (cena 2)
const CAPITAIS: [number, number][] = [
  [-38.5, -12.97], [-46.63, -23.55], [-43.2, -22.9], [-42.8, -5.09], [-35.73, -9.67], [-37.07, -10.91], [-34.86, -7.12], [-48.5, -1.46], [-49.27, -16.68], [-43.94, -19.92], [-60.02, -3.1], [-51.2, -30.03],
];

// ---------- Pílula, placar de estados e relógio ----------
const ESTADOS: [number, string][] = [
  [0, 'SEGUNDO TURNO'],
  [T.domingo, 'O PAÍS TODO'],
  [T.naBahia, 'BAHIA'],
  [T.emSP, 'SÃO PAULO'],
  [T.noRio, 'RIO DE JANEIRO'],
  [T.noPiaui, 'PIAUÍ'],
  [T.emAlagoas, 'ALAGOAS'],
  [T.emSergipe, 'SERGIPE'],
  [T.naParaiba, 'PARAÍBA'],
  [T.noPara, 'PARÁ'],
  [T.repara, 'O RELÓGIO'],
  [T.mas, 'URNAS FECHADAS'],
  [T.h18, 'O IMPASSE'],
  [T.falta, 'O QUE FALTA'],
];
// quando cada uma das 8 bolinhas acende (ordem de ESTADOS_MJ: BA, SP, RJ, PI, AL, SE, PB, PA)
const ACENDE_ESTADO = [T.naBahia, T.emSP + 0.5, T.noRio, T.noPiaui, T.emAlagoas, T.emSergipe, T.naParaiba, T.noPara];
// hora mostrada no relógio fixo
const HORAS: [number, string, string][] = [
  [T.segundoTurno, '2º TURNO', '25/10/2026'],
  [T.h1320, '13:20', 'HORÁRIO DE BRASÍLIA'],
  [T.h1320 + 2.6, '2º TURNO', '25/10/2026'],
  [T.h1701, '17:01', 'HORÁRIO DE BRASÍLIA'],
  [T.h1640, '16:40', 'ANTES, NO STF'],
  [T.h1702, '17:02', 'HORÁRIO DE BRASÍLIA'],
  [T.h1714, '17:14', 'HORÁRIO DE BRASÍLIA'],
  [T.h1738, '17:38', 'HORÁRIO DE BRASÍLIA'],
  [T.h18, '18:00', 'HORÁRIO DE BRASÍLIA'],
  [T.h1812, '18:12', 'HORÁRIO DE BRASÍLIA'],
  [T.falta, '2º TURNO', '25/10/2026'],
];
// hora da torre do relógio (horas decimais)
const horaTorre = (t: number) => {
  let h = 16.0 + 1.0 * rampa(t, T.corrida, T.h1701, Easing.inOut(Easing.quad));
  h += (17 + 1 / 60 - h) * rampa(t, T.h1701 - 0.3, T.h1701 + 0.3);
  h += (16 + 40 / 60 - h) * rampa(t, T.h1640 - 0.3, T.h1640 + 0.5);
  h += (17 + 2 / 60 - h) * rampa(t, T.h1702 - 0.3, T.h1702 + 0.5);
  h += (19 - h) * rampa(t, T.estender, T.h19 + 0.4, Easing.inOut(Easing.quad));
  h += (17 + 14 / 60 - h) * rampa(t, T.mas, T.mas + 0.6);
  h += (18 - h) * rampa(t, T.h18 - 0.3, T.h18 + 0.4);
  h += (18 + 12 / 60 - h) * rampa(t, T.h1812 - 0.3, T.h1812 + 0.4);
  return h;
};

// ---------- Câmera ----------
const D = (az: number, el: number): V3 => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
};
const enq = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const vivo = (c: Cam, k: number, sentido = 1) => cinematizar(c, k, {lente: 1, arco: 0.07, grua: 0.02, sentido});
const MAPA = enq([1, 0, -1], 40, 40, D(6, 60));
const mq = (c: V3, larg: number, az = 18, el = 27, alt?: number, dy = 0.3) => enq([c[0], c[1] + dy, c[2] + 0.15], larg * 0.78, alt ?? larg * 0.56, D(az, el));

type Cena = {ini: number; longe?: boolean; cam: (t: number, ini: number, fim: number) => Cam};
const CENAS: Cena[] = [
  // 1. gancho: close na garagem e subida até o mapa
  {
    ini: 0,
    longe: true,
    cam: (t) =>
      trilhoCam(t, [
        [0, mq(MQ.salvador, 2.6, 22, 18)],
        [T.aconteceu - 0.2, mq(MQ.salvador, 2.3, 14, 20)],
        [T.aconteceu + 0.9, enq([12, 1, -2], 12, 10, D(12, 40))],
        [T.domingo, MAPA],
      ]),
  },
  // 2. o país todo
  {
    ini: T.domingo,
    longe: true,
    cam: (t, a) =>
      trilhoCam(t, [
        [a, MAPA],
        [T.vamos, enq([1, 0, -1], 38, 38, D(-6, 61))],
        [T.vamos + 1.4, enq([12, 1, -3], 16, 12, D(10, 45))],
        [T.naBahia + 0.6, mq(MQ.salvador, 4.4, 18, 30)],
      ]),
  },
  // 3a. Salvador
  {
    ini: T.naBahia + 0.6,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, mq(MQ.salvador, 4.4, 18, 30)],
          [T.pfDiz, mq(MQ.salvador, 4.2, 10, 28)],
          [T.paris - 0.2, enq([24, 3, -3.6], 17, 8, D(8, 26))],
          [T.paris + 0.7, enq([25, 3, -3.6], 17, 8, D(4, 26))],
          [T.prefDiz + 0.8, mq(MQ.salvador, 4.2, 6, 27)],
          [T.frotaJa, mq(MQ.salvador, 4.0, 0, 26)],
          [b, mq(MQ.salvador, 4.0, -12, 26)],
        ]),
        rampa(t, a, b),
      ),
  },
  // 3b. Ilhéus
  {ini: T.aindaBahia, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([17, 2, -0.5], 9, 7, D(0, 40))], [T.ilheus + 0.5, mq(MQ.ilheus, 4.2, -16, 26)], [b, mq(MQ.ilheus, 4.0, -4, 26)]]), rampa(t, a, b))},
  // 3c. TSE e as prefeituras; Feira e Lauro no mesmo plano
  {
    ini: T.presTSE - 0.4,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([11, 0.5, -1], 18, 11, D(0, 54))],
          [T.emFeira - 0.3, enq([11.5, 0.5, -1.5], 17, 11, D(6, 52))],
          [T.emFeira + 0.9, enq([14.8, 2.85, -5.0], 6.6, 3.2, D(10, 24))],
          [T.emLauro, enq([16.2, 2.85, -5.4], 4.0, 2.8, D(16, 24))],
          [T.emFeira2, enq([13.2, 2.85, -4.6], 4.0, 2.8, D(4, 24))],
          [b, enq([13.0, 2.85, -4.6], 3.9, 2.7, D(-6, 24))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 4. São Paulo
  {
    ini: T.emSP,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([11, 1, 3], 16, 12, D(30, 40))],
          [T.h1320 + 0.6, mq(MQ.sp, 5.2, 22, 27)],
          [T.campLulaSP, mq(MQ.sp, 5.0, 14, 27)],
          [T.semDecisao, mq(MQ.sp, 5.0, 4, 27)],
          [b, mq(MQ.sp, 4.8, -8, 27)],
        ]),
        rampa(t, a, b),
      ),
  },
  // 5. Rio
  {ini: T.noRio, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([10, 1, 9], 9, 7, D(-10, 40))], [T.treRJ, mq(MQ.rj, 4.2, -12, 27)], [b, mq(MQ.rj, 4.0, 0, 27)]]), rampa(t, a, b))},
  // 6a. Piauí
  {ini: T.noPiaui, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([12, 1, -2], 18, 14, D(0, 50))], [T.trePI + 0.2, mq(MQ.teresina, 4.2, 12, 27)], [b, mq(MQ.teresina, 4.0, 0, 27)]]), rampa(t, a, b))},
  // 6b. Alagoas
  {ini: T.emAlagoas, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([17, 1.5, -8], 10, 8, D(-14, 40))], [T.maceio, mq(MQ.maceio, 4.2, -22, 27)], [b, mq(MQ.maceio, 4.0, -10, 27)]]), rampa(t, a, b))},
  // 6c. Sergipe
  {ini: T.emSergipe, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([19, 1.5, -4], 9, 7, D(-16, 40))], [T.relataram, mq(MQ.aracaju, 4.6, -18, 25)], [T.vinte, mq(MQ.aracaju, 4.8, -6, 27)], [b, mq(MQ.aracaju, 4.8, 4, 27)]]), rampa(t, a, b))},
  // 6d. Paraíba
  {ini: T.naParaiba, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([20, 1.5, -6], 10, 8, D(-10, 42))], [T.joaoPessoa + 0.3, mq(MQ.joaoPessoa, 4.2, -14, 27)], [b, mq(MQ.joaoPessoa, 4.0, -2, 27)]]), rampa(t, a, b))},
  // 7. Pará
  {ini: T.noPara, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([10, 1, -10], 22, 16, D(-10, 50))], [T.balsa + 0.4, mq(MQ.belem, 5.0, 18, 25)], [b, mq(MQ.belem, 5.0, 34, 25)]]), rampa(t, a, b))},
  // 8. a corrida contra o relógio (Brasília)
  {
    ini: T.repara,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([6, 1, -8], 24, 18, D(0, 52))],
          [T.corrida + 0.8, mq(MQ.brasilia, 7.0, 0, 28, 5.0, 0.6)],
          [T.noTSE, enq([MQ.brasilia[0] - 1.4, MQ.brasilia[1] + 0.6, MQ.brasilia[2] - 0.1], 4.8, 3.8, D(24, 26))],
          [T.disseNao + 0.8, enq([MQ.brasilia[0] - 1.0, MQ.brasilia[1] + 0.6, MQ.brasilia[2] - 0.4], 4.8, 3.8, D(14, 26))],
          [T.chegouSTF, enq([MQ.brasilia[0] + 1.4, MQ.brasilia[1] + 0.6, MQ.brasilia[2] - 0.1], 4.8, 3.8, D(-22, 26))],
          [T.zaninMandou, enq([MQ.brasilia[0] + 1.2, MQ.brasilia[1] + 0.6, MQ.brasilia[2]], 5.0, 4.0, D(-12, 27))],
          [T.paisTodo + 0.3, enq([4, 0.5, 0], 30, 26, D(0, 55))],
          [b, enq([4, 0.5, 0], 34, 30, D(-4, 56))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 9a. as urnas fechadas: sala da USP
  {
    ini: T.mas,
    longe: true,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, MAPA],
          [T.folha + 0.3, enq([6.5, 2, 9], 9, 8, D(10, 40))],
          [T.h1714 + 0.4, mq(MQ.sp, 4.8, 16, 31)],
          [T.taboao, mq(MQ.sp, 4.8, 4, 31)],
          [b, mq(MQ.sp, 4.6, -8, 31)],
        ]),
        rampa(t, a, b),
      ),
  },
  // 9b. os TREs (DF, MG, GO) e a contagem pausada
  {ini: T.tresDF - 0.4, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([7.6, 0.6, 2.6], 7.5, 5.5, D(0, 44))], [T.novaVeneza, enq([6.0, 0.6, 1.6], 6.5, 5, D(-10, 42))], [T.pausou, enq([7.6, 1.4, -0.2], 8, 6, D(-8, 38))], [b, enq([7.6, 1.6, -0.4], 8, 6, D(-14, 36))]]), rampa(t, a, b))},
  // 10. o impasse
  {
    ini: T.h18,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, mq(MQ.brasilia, 7.0, 0, 27, 4.6, 0.6)],
          [T.confusao, mq(MQ.brasilia, 6.8, -10, 27, 4.6, 0.6)],
          [T.h1812 + 0.4, enq([6, 1, 2], 22, 15, D(0, 44))],
          [T.ministros - 0.2, enq([6, 1, 2], 22, 15, D(8, 44))],
          [T.ministros + 0.6, enq([MQ.brasilia[0] - 1.4, MQ.brasilia[1] + 0.6, MQ.brasilia[2] - 0.1], 4.0, 3.2, D(16, 22))],
          [b, enq([MQ.brasilia[0] - 1.4, MQ.brasilia[1] + 0.6, MQ.brasilia[2] - 0.1], 3.7, 3.0, D(8, 22))],
        ]),
        rampa(t, a, b),
      ),
  },
  // 11. o que falta saber: mapa e volta à eleitora
  {
    ini: T.falta,
    longe: true,
    cam: (t, a) =>
      trilhoCam(t, [
        [a, MAPA],
        [T.suaCidade - 0.2, enq([1, 0, -1], 38, 38, D(-6, 60))],
        [T.suaCidade + 1.6, enq([16, 2, -2.5], 12, 9, D(14, 36))],
        [T.comenta, mq(MQ.salvador, 2.6, 24, 18)],
        [FIM, mq(MQ.salvador, 2.4, 14, 18)],
      ]),
  },
];

// ---------- Ajudantes de tempo ----------
/** Janela de uma peça: nasce em `a` com mola e sai em `b` (0,5 s). */
const ap = (t: number, a: number, b = 1e9, d = 0.45) => (t < a ? 0 : entra(t, a, d) * (1 - rampa(t, b - 0.5, b)));
/** Maquete: sobe em `a` e desce em `b`. */
const sobe = (t: number, a: number, b: number) => rampa(t, a - 0.3, a + 0.6, sai) * (1 - rampa(t, b - 0.7, b, Easing.inOut(Easing.quad)));
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

// ---------- O mundo ----------
const Mundo: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const F = fe(tema);
  const ouro = F.dourado;
  const neutro = tema.objetoClaro;
  // estados acesos no mapa: pisca em sequência em "oito estados" e fica aceso quando o vídeo chega nele
  const acesos = ESTADOS_MJ.map((_, i) => {
    const seq = pulso(t, T.oito - 0.1 + i * 0.12, 1.2);
    const prox = i + 1 < ACENDE_ESTADO.length ? ACENDE_ESTADO[i + 1] : T.repara;
    const fica = (0.4 + 0.45 * (1 - rampa(t, prox - 0.3, prox + 0.5))) * rampa(t, ACENDE_ESTADO[i] - 0.2, ACENDE_ESTADO[i] + 0.5) * (1 - 0.6 * rampa(t, T.repara, T.repara + 1));
    const olha = pulso(t, T.acompanha + i * 0.1, 1.0) * 0.6;
    return Math.min(1, Math.max(seq, fica, olha) * (1 - rampa(t, T.falta, T.falta + 1)) + 0.5 * rampa(t, T.punido, T.punido + 0.8));
  });
  const borda = pulso(t, T.brasilTodo, 1.4);

  // maquetes
  const mSalv = Math.max(sobe(t, -1, T.domingo + 0.6), sobe(t, T.salvador, T.aindaBahia + 0.4), sobe(t, T.suaCidade + 0.4, 1e9));
  const mIlheus = sobe(t, T.ilheus, T.presTSE);
  const mFeira = sobe(t, T.emFeira, T.emSP + 0.4);
  const mLauro = sobe(t, T.emFeira + 0.12, T.emSP + 0.4);
  const mSP = Math.max(sobe(t, T.emSP + 0.6, T.noRio + 0.3), sobe(t, T.folha, T.tresDF));
  const salaUSP = rampa(t, T.folha - 0.1, T.folha + 0.4);
  const mRJ = sobe(t, T.noRio + 0.5, T.noPiaui + 0.3);
  const mPI = sobe(t, T.trePI - 0.2, T.emAlagoas + 0.3);
  const mAL = sobe(t, T.emAlagoas + 0.4, T.emSergipe + 0.3);
  const mSE = sobe(t, T.emSergipe + 0.4, T.naParaiba + 0.3);
  const mJP = sobe(t, T.joaoPessoa - 0.2, T.noPara + 0.3);
  const mBelem = sobe(t, T.noPara + 0.6, T.repara + 0.5);
  const mBsb = Math.max(sobe(t, T.corrida - 0.2, T.folha + 0.4), sobe(t, T.h18 - 0.6, T.falta + 0.6));

  // pinos (ficam até o fim, memória do caminho)
  const pinos: [V3, number][] = [
    [L.salvador, T.salvador], [L.ilheus, T.ilheus], [L.feira, T.feira], [L.lauro, T.lauro], [L.sp, T.emSP + 0.4], [L.petropolis, T.petropolis], [L.saoGoncalo, T.saoGoncalo],
    [L.teresina, T.noPiaui + 0.3], [L.maceio, T.maceio], [L.aracaju, T.emSergipe + 0.3], [L.joaoPessoa, T.joaoPessoa], [L.belem, T.noPara + 0.3], [L.brasilia, T.presTSE],
    [L.taboao, T.taboao], [L.df, T.tresDF], [L.bh, T.minas], [L.novaVeneza, T.novaVeneza],
  ];
  // pino some enquanto a maquete dele está no ar (o pedestal ocupa o lugar)
  const ESCONDE = [mSalv, mIlheus, mFeira, mLauro, mSP, mRJ, 0, mPI, mAL, mSE, mJP, mBelem, mBsb];
  // urnas nos pinos (parte 2): nascem verdes, muitas ficam cinza às 17h
  const URNAS_PINO: {p: V3; fecha: number}[] = [
    {p: L.salvador, fecha: T.fechar17 + 0.2}, {p: L.sp, fecha: 1e9}, {p: L.teresina, fecha: T.fechar17 + 0.5}, {p: L.maceio, fecha: T.fechar17 + 0.35}, {p: L.aracaju, fecha: 1e9},
    {p: L.joaoPessoa, fecha: T.fechar17 + 0.65}, {p: L.belem, fecha: 1e9}, {p: L.df, fecha: T.fechar17 + 0.8}, {p: L.bh, fecha: T.fechar17 + 0.95}, {p: L.novaVeneza, fecha: T.fechar17 + 1.1},
    {p: L.petropolis, fecha: T.fechar17 + 1.25}, {p: L.feira, fecha: 1e9},
  ];
  const urnasK = ap(t, T.corrida + 0.6, T.falta + 0.6);

  // ---- Salvador (gancho e cena 3a): garagem de 4 vagas, rua, ponto, escola
  const gSalv: V3 = [-0.55, 0, -0.55];
  const ruaSalvZ = 0.45;
  const saiSalv = (i: number) => rampa(t, T.frotaJa + i * 0.75, T.frotaJa + 1.4 + i * 0.75);
  const rodaSalv = (i: number) => Math.max(0, t - (T.frotaJa + 1.4 + i * 0.75)) * 1.1;
  const recua = (i: number) => (i === 1 || i === 2 ? pulso(t, T.reduzir, 1.2) * 0.25 : 0);
  const farolSalv = Math.max(rampa(t, T.todaFrota, T.todaFrota + 0.6) * (1 - rampa(t, T.bruno, T.bruno + 0.5)), rampa(t, T.frotaJa - 0.3, T.frotaJa + 0.4));
  const fimVideo = rampa(t, T.passou - 1.2, T.passou + 0.4, Easing.inOut(Easing.quad));

  return (
    <>
      <MapaTabuleiro tema={tema} borda={borda} acesos={acesos} />
      <Particulas t={t} centro={[4, 9, -2]} raio={16} n={50} opacidade={0.12} tamanho={0.5} />

      {pinos.map(([p, a], i) => (
        <PinoCidade key={i} tema={tema} pos={p} k={entra(t, a - 0.2, 0.5) * (1 - 0.95 * (ESCONDE[i] ?? 0))} aceso={pulso(t, a - 0.1, 1.2)} />
      ))}
      {URNAS_PINO.map((u, i) => (
        <UrnaCor key={`u${i}`} tema={tema} pos={[u.p[0] + 0.45, MAPA_Y, u.p[2] + 0.2]} escala={0.32 * urnasK} aberta={1 - rampa(t, u.fecha, u.fecha + 0.6)} />
      ))}

      {/* Cena 2: pontos de espera pelo país */}
      {CAPITAIS.map(([lo, la], i) => {
        const k = ap(t, T.eleitores + i * 0.08, T.vamos + 0.5);
        if (k < 0.02) return null;
        const p = g(lo, la);
        const ol = rampa(t, T.esperaram, T.esperaram + 0.6);
        return (
          <group key={`c${i}`} position={[p[0] + 0.6, MAPA_Y, p[2] + 0.5]} scale={1.3 * Math.min(1, k)}>
            <PontoOnibus tema={tema} pos={[0, 0, 0]} />
            <Boneco tema={tema} pos={[0.15, 0, 0.12]} escala={0.22} cor={i === 0 ? tema.corpo : tema.pessoa} pose={{cabeca: [0, -0.7 * ol, 0]}} />
            {i % 4 === 1 ? <Placa tema={tema} pos={[0.15, 0.75 + 0.12 * rampa(t, T.naoVieram, T.naoVieram + 0.8), 0.12]} larg={0.3} alt={0.3} linhas={[{t: '?', tam: 600, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} /> : null}
          </group>
        );
      })}
      {/* OEA: lupa sobre o mapa e urna grande no centro */}
      {ap(t, T.oea, T.vamos + 0.4) > 0.02 ? (
        <Lupa tema={tema} pos={lerp(lerp([-14, 6, -10], [3, 6, -2], rampa(t, T.oea, T.observa + 0.4, Easing.inOut(Easing.quad))), [6, 6, 1], rampa(t, T.acompanha, T.respeito, Easing.inOut(Easing.quad)))} rot={[-1.2, 0, 0]} escala={5 * ap(t, T.oea, T.vamos + 0.4)} />
      ) : null}
      {ap(t, T.respeito, T.vamos + 0.6) > 0.02 ? <UrnaCor tema={tema} pos={[0, MAPA_Y, 0]} escala={3.2 * ap(t, T.respeito, T.vamos + 0.6)} aberta={1} /> : null}

      {/* ---- Salvador ---- */}
      <Maquete tema={tema} base={L.salvador} pos={MQ.salvador} sobe={mSalv}>
        <Garagem tema={tema} pos={gSalv} vagas={4} luz={Math.max(rampa(t, T.achou, T.achou + 0.8) * (1 - rampa(t, T.aindaBahia - 1, T.aindaBahia)), 0.15)} />
        <Rua tema={tema} z={ruaSalvZ} x0={-1.45} x1={1.45} />
        {[0, 1, 2, 3].map((i) => (
          <OnibusVivo key={i} tema={tema} de={[vaga(gSalv, 4, i)[0], 0, vaga(gSalv, 4, i)[2] - recua(i)]} ruaZ={ruaSalvZ} sai={t < T.falta ? saiSalv(i) : 0} roda={t < T.falta ? rodaSalv(i) : 0} xFim={-1.4} escala={0.3} ligado={t < T.falta ? farolSalv : 0} />
        ))}
        {/* final: o ônibus verde chega e para no ponto */}
        {fimVideo > 0.02 ? <Onibus tema={tema} pos={[2.2 - 1.4 * fimVideo, 0, ruaSalvZ]} rotY={0} escala={0.3 * Math.min(1, fimVideo * 3)} farol={1} /> : null}
        {/* adesivos nas laterais */}
        {ap(t, T.adesivos, T.frotaJa) > 0.02
          ? [0, 1, 2, 3].map((i) => {
              const de = vaga(gSalv, 4, i);
              return <Placa key={`ad${i}`} tema={tema} pos={[de[0] + 0.155, 0.27, de[2] + 0.08]} rot={[0, Math.PI / 2, 0]} larg={0.2 * ap(t, T.adesivos + i * 0.1, T.frotaJa)} alt={0.1 * ap(t, T.adesivos + i * 0.1, T.frotaJa)} linhas={[{t: 'VOTE', tam: 300, cor: tema.tinta, peso: 900}]} fundo={F.loiro} brilho={0.2} />;
            })
          : null}
        <PontoOnibus tema={tema} pos={[-1.0, 0, 0.95]} rotY={0.2} escala={0.8} />
        {(() => {
          const emb = t < T.falta ? rampa(t, T.normal, T.normal + 1.2) : 0;
          const k = t < T.falta ? 1 - rampa(t, T.normal + 1.0, T.normal + 1.5) : entra(t, T.suaCidade, 0.5);
          return <Boneco tema={tema} pos={[-0.85 - 0.1 * emb, 0, 0.98 - 0.4 * emb]} rotY={t < T.falta ? 0 : 1.2} escala={0.16 * k} cor={tema.corpo} pose={{passo: emb > 0 && emb < 1 ? Math.sin(t * 9) : 0, ombroD: [0, 0, 1.8 * pulso(t, T.passou - 0.3, 1.4)]}} />;
        })()}
        <Escola tema={tema} pos={[1.0, 0, -0.7]} rotY={-0.3} escala={0.85} aberta={1} />
        {/* gancho: secretário, ordem, urna e relógio */}
        <Pessoa tema={tema} pos={[0.3, 0, 1.05]} rotY={-0.25} nome={t < T.domingo + 1 ? 'SECRETÁRIO' : 'PABLO SOUZA'} cargo={t < T.domingo + 1 ? undefined : 'SECRETÁRIO DE MOBILIDADE'} k={Math.max(ap(t, T.secretario, T.domingo + 0.4), ap(t, T.pablo, T.bruno))} transp={rampa(t, T.paris + 0.2, T.paris + 0.8) * (1 - rampa(t, T.bruno - 0.5, T.bruno))} escala={0.2} placaLarg={0.8} />
        <Papel tema={tema} pos={[-0.3, 0, 1.05]} rotY={0.15} escala={0.55 * Math.max(ap(t, T.ordem - 0.15, T.domingo + 0.4), ap(t, T.prender - 0.1, T.prefDiz))} titulo="ORDEM" carimbo={Math.max(rampa(t, T.ordem + 0.2, T.ordem + 0.6), rampa(t, T.prender + 0.25, T.prender + 0.65))} textoCarimbo="PRISÃO" />
        <RelogioMesa tema={tema} pos={[0.95, 0, 0.45]} escala={2.0 * ap(t, T.estendida - 0.1, T.domingo)} ang={Math.PI * 2 * (17 + 2 * rampa(t, T.estendida, T.cimaHora + 0.4))} />
        {/* TRE-BA, envelope, multa */}
        <OrgaoPublico tema={tema} pos={[1.25, 0, 0.55]} escala={0.15} sobe={ap(t, T.treBA - 0.2, T.aindaBahia)} letreiro={rampa(t, T.treBA, T.treBA + 0.6)} texto="TRE-BA" />
        {rampa(t, T.mandouVoltar, T.todaFrota) > 0 && t < T.todaFrota + 0.4 ? <Envelope tema={tema} pos={curva([1.25, 0.5, 0.55], [-0.55, 0.7, -0.1], 0.7, rampa(t, T.mandouVoltar, T.todaFrota))} rotY={0.4} escala={0.6} /> : null}
        {ap(t, T.milhao - 0.1, T.pf + 0.4) > 0.02 ? <PilhaMoedas tema={tema} pos={[0.7, 0, 0.2]} n={14 * rampa(t, T.milhao - 0.1, T.porHora + 0.4)} cor={ouro} r={0.09} escala={ap(t, T.milhao - 0.1, T.pf + 0.4)} /> : null}
        {/* Procon e Bruno Reis */}
        <Pessoa tema={tema} pos={[-0.15, 0, 0.12]} rotY={0.3} nome="PROCON" k={ap(t, T.procon - 0.1, T.treBA + 0.6)} escala={0.17} placaLarg={0.6} pose={{ombroD: [-0.6, 0, 0.1], cotoveloD: -0.9}} />
        <Pessoa tema={tema} pos={[0.75, 0, 1.1]} rotY={-0.3} nome="BRUNO REIS" cargo="PREFEITO DE SALVADOR" k={ap(t, T.bruno - 0.1, T.aindaBahia)} escala={0.2} placaLarg={0.9} />
      </Maquete>
      {/* Paris: arco para o leste e jatinho */}
      <ArcoPontos a={somaV(MQ.salvador, [0.5, 0.5, 0.2])} b={[31, 3.4, -4.2]} k={rampa(t, T.paris - 0.3, T.paris + 0.6) * (1 - rampa(t, T.prefDiz + 0.4, T.prefDiz + 0.9))} cor={neutro} alt={1.6} n={26} />
      {ap(t, T.paris, T.prefDiz + 0.9) > 0.02 ? <Jatinho tema={tema} pos={curva(somaV(MQ.salvador, [0.5, 0.5, 0.2]), [31, 3.4, -4.2], 1.6, rampa(t, T.paris - 0.2, T.paris + 0.7))} rumo={-0.05} escala={0.45 * ap(t, T.paris, T.prefDiz + 0.9)} /> : null}

      {/* ---- Ilhéus ---- */}
      <Maquete tema={tema} base={L.ilheus} pos={MQ.ilheus} sobe={mIlheus}>
        <Garagem tema={tema} pos={[-0.25, 0, -0.5]} vagas={5} luz={rampa(t, T.paradosIlheus, T.paradosIlheus + 0.7)} letreiro="EMPRESA" brilhoLetreiro={rampa(t, T.empresa, T.empresa + 0.6)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Onibus key={i} tema={tema} pos={vaga([-0.25, 0, -0.5], 5, i)} rotY={Math.PI / 2} escala={0.3 * entra(t, T.paradosIlheus + i * 0.08, 0.4)} farol={0} />
        ))}
        <Rua tema={tema} z={0.5} x0={-1.45} x1={1.45} />
        {[0, 1, 2].map((i) => (
          <Boneco key={i} tema={tema} pos={[0.55 + i * 0.28, 0, 0.95 - i * 0.05]} rotY={-0.6} escala={0.17 * entra(t, T.vereadores + i * 0.12, 0.4)} cor={tema.pessoa} pose={{ombroD: [-0.9 * rampa(t, T.mostraram, T.mostraram + 0.5), 0, 0.2], cotoveloD: -0.2}} />
        ))}
        <Placa tema={tema} pos={[0.83, 0.6, 1.0]} larg={0.9 * ap(t, T.vereadores, T.presTSE)} alt={0.16 * ap(t, T.vereadores, T.presTSE)} linhas={[{t: 'VEREADORES', tam: 140, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.3} />
        <Escola tema={tema} pos={[1.0, 0, -0.85]} rotY={-0.4} escala={0.75} aberta={1} />
      </Maquete>

      {/* ---- TSE (pino de Brasília) e arcos até a Bahia ---- */}
      {ap(t, T.presTSE, T.emFeira + 0.4) > 0.02 ? (
        <group>
          <OrgaoPublico tema={tema} pos={[L.brasilia[0] + 0.9, MAPA_Y, L.brasilia[2]]} escala={0.32} sobe={ap(t, T.presTSE, T.emFeira + 0.4)} letreiro={rampa(t, T.presTSE, T.presTSE + 0.6)} texto="TSE" />
          <Ampulheta tema={tema} pos={[L.brasilia[0] - 0.6, MAPA_Y, L.brasilia[2] + 0.6]} escala={2.6 * ap(t, T.meiaHora, T.emFeira + 0.4)} areia={1 - rampa(t, T.meiaHora, T.emFeira)} fio />
        </group>
      ) : null}
      {(
        [
          [L.salvador, T.arcoSalvador - 0.3],
          [L.feira, T.feira],
          [L.lauro, T.lauro],
        ] as [V3, number][]
      ).map(([p, a], i) => (
        <ArcoPontos key={`ba${i}`} a={[L.brasilia[0] + 0.9, 1.4, L.brasilia[2]]} b={[p[0], 0.9, p[2]]} k={rampa(t, a - 0.2, a + 0.7) * (1 - rampa(t, T.emFeira, T.emFeira + 0.6))} cor={neutro} alt={2.6} n={30} />
      ))}

      {/* ---- Feira de Santana e Lauro de Freitas ---- */}
      <Maquete tema={tema} base={L.feira} pos={MQ.feira} sobe={mFeira} raio={1.4}>
        <Rua tema={tema} z={0.2} x0={-1.25} x1={1.25} />
        {[0, 1].map((i) => {
          const x = ((((t - T.emFeira) * 0.55 + i * 1.25) % 2.5) + 2.5) % 2.5;
          return <Onibus key={i} tema={tema} pos={[1.15 - x, 0, 0.2]} rotY={0} escala={0.28 * Math.min(1, entra(t, T.emFeira + 0.3 + i * 0.2, 0.4))} farol={rampa(t, T.diaUtil, T.diaUtil + 0.5)} />;
        })}
        <PontoOnibus tema={tema} pos={[0.5, 0, 0.8]} escala={0.8} nome="FEIRA" />
        <Escola tema={tema} pos={[-0.5, 0, -0.6]} escala={0.75} aberta={1} />
      </Maquete>
      <Maquete tema={tema} base={L.lauro} pos={MQ.lauro} sobe={mLauro} raio={1.4}>
        <Rua tema={tema} z={0.2} x0={-1.25} x1={1.25} />
        {ap(t, T.frotaNormal - 0.2, T.emFeira2) > 0.02 ? <Onibus tema={tema} pos={[1.2 - 2.4 * rampa(t, T.frotaNormal - 0.2, T.emFeira2 + 0.5, Easing.linear), 0, 0.2]} escala={0.28 * ap(t, T.frotaNormal - 0.2, T.emFeira2 + 0.4)} farol={1} /> : null}
        <PontoOnibus tema={tema} pos={[0.1, 0, 0.8]} escala={0.8} nome="LAURO" />
        {[0, 1, 2].map((i) => (
          <Boneco key={i} tema={tema} pos={[-0.15 + i * 0.22, 0, 0.92]} escala={0.16 * entra(t, T.moradores + i * 0.1, 0.4)} cor={tema.pessoa} pose={{cabeca: [0, 0.8 * rampa(t, T.naoConseguiam, T.naoConseguiam + 0.6), 0]}} />
        ))}
        <Escola tema={tema} pos={[0.5, 0, -0.6]} escala={0.75} aberta={1} />
      </Maquete>

      {/* ---- São Paulo (cena 4) e a sala da USP (cena 9a) ---- */}
      <Maquete tema={tema} base={L.sp} pos={MQ.sp} sobe={mSP} raio={1.8}>
        {salaUSP < 0.5 ? (
          <group scale={1 - salaUSP * 2}>
            <Garagem tema={tema} pos={[-0.35, 0, -0.75]} vagas={6} luz={0.5} />
            <Rua tema={tema} z={0.15} x0={-1.65} x1={1.65} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const fica = i === 1 || i === 4;
              const de = vaga([-0.35, 0, -0.75], 6, i);
              const ordem = [0, 0, 1, 2, 0, 3][i];
              const s = fica ? 0 : rampa(t, T.pct + ordem * 0.7, T.pct + 1.2 + ordem * 0.7);
              const roda = fica ? 0 : Math.max(0, t - (T.pct + 1.2 + ordem * 0.7)) * 1.0;
              return <OnibusVivo key={i} tema={tema} de={de} ruaZ={0.15} sai={s} roda={((roda + 3.2) % 3.2) * (roda > 0 ? 1 : 0)} xFim={-1.6} escala={0.28} ligado={fica ? 0 : rampa(t, T.pct, T.pct + 0.5)} k={entra(t, T.emSP + 0.8, 0.4)} />;
            })}
            <OrgaoPublico tema={tema} pos={[1.2, 0, -0.6]} escala={0.17} sobe={ap(t, T.campLulaSP, T.noRio)} letreiro={rampa(t, T.campLulaSP, T.campLulaSP + 0.6)} texto="TRE-SP" />
            {rampa(t, T.campLulaSP, T.justicaPrisao + 0.3) > 0 && t < T.justicaPrisao + 0.8 ? <Envelope tema={tema} pos={curva([-1.2, 0.4, 1.2], [1.2, 0.5, -0.4], 0.8, rampa(t, T.campLulaSP, T.justicaPrisao + 0.3))} rotY={0.3} escala={0.6} /> : null}
            <Pessoa tema={tema} pos={[-1.2, 0, 0.95]} rotY={0.25} nome="SECRETÁRIO" cargo="MOBILIDADE (SP)" k={ap(t, T.secMob, T.noRio)} placaLarg={0.72} />
            <Pessoa tema={tema} pos={[-0.45, 0, 1.1]} rotY={0.1} nome="PRESIDENTE" cargo="SPTRANS" k={ap(t, T.sptrans, T.noRio)} placaLarg={0.72} />
            <Pessoa tema={tema} pos={[0.35, 0, 1.1]} rotY={-0.1} nome="GUILHERME BOULOS" k={ap(t, T.boulos, T.noRio)} placaLarg={0.78} />
            <Pessoa tema={tema} pos={[1.15, 0, 0.95]} rotY={-0.25} nome="RICARDO NUNES" cargo="PREFEITO DE SP" k={ap(t, T.nunes, T.noRio)} placaLarg={0.72} />
            {ap(t, T.passageiros - 0.3, T.noRio) > 0.02 ? (
              <BalancaJustica
                tema={tema}
                pos={[0.2, 0, -0.15]}
                escala={0.28 * ap(t, T.passageiros - 0.3, T.noRio)}
                inclina={-0.35 * rampa(t, T.passageiros, T.passageiros + 0.8)}
                esq={<Onibus tema={tema} pos={[0, 0, 0]} escala={0.6} farol={1} />}
                dir={<Boneco tema={tema} pos={[0, 0, 0]} escala={0.5} cor={tema.pessoa} />}
              />
            ) : null}
          </group>
        ) : null}
        {/* sala de seção (USP) */}
        <SalaSecao tema={tema} pos={[0.25, 0, -0.2]} k={salaUSP} acesas={t < T.so7 ? 21 * (1 - rampa(t, T.secaoFechada, T.so7)) : 7 * rampa(t, T.so7, T.de21, Easing.linear)} />
        {salaUSP > 0.02 ? (
          <>
            <CelularMsg tema={tema} pos={[-1.35, 0, 0.55]} rotY={0.5} escala={0.9 * salaUSP} msg={t < T.h1738 ? 'NÃO FECHEM|AS URNAS' : 'SEÇÃO FECHADA|NÃO REABRE'} hora={t < T.h1738 ? '17:14' : '17:38'} luz={Math.max(pulso(t, T.h1714, 1.2), pulso(t, T.h1738, 1.2), 0.4)} />
            {[0, 1, 2, 3].map((i) => {
              const saiK = rampa(t, T.liberados + i * 0.15, T.liberados + 1.4 + i * 0.15);
              return <Boneco key={i} tema={tema} pos={[-0.6 + i * 0.4 + 1.6 * saiK, 0, 0.7 + 0.5 * saiK]} rotY={saiK > 0 ? 1.2 : Math.PI + 0.6} escala={0.16 * (1 - rampa(t, T.liberados + 1.2 + i * 0.15, T.liberados + 1.6 + i * 0.15)) * entra(t, T.orientados, 0.4)} cor={tema.pessoa} pose={{passo: saiK > 0 && saiK < 1 ? Math.sin(t * 9 + i) : 0}} />;
            })}
            <Boneco tema={tema} pos={[1.35, 0, 1.05]} rotY={-2.3} escala={0.17 * entra(t, T.depois17, 0.4)} cor={tema.corpo} />
            <Papel tema={tema} pos={[1.0, 0, 0.6]} rotY={-0.6} escala={0.5 * ap(t, T.ata - 0.2, T.tresDF)} titulo="ATA" carimbo={0} />
            <Placa tema={tema} pos={[0.25, 0.75, -1.05]} larg={1.8} alt={0.22} linhas={[{t: 'FACULDADE DE DIREITO · USP', tam: 100, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.35 * rampa(t, T.usp, T.usp + 0.5) + 0.1} />
          </>
        ) : null}
      </Maquete>

      {/* ---- Rio de Janeiro ---- */}
      <Maquete tema={tema} base={L.petropolis} pos={MQ.rj} sobe={mRJ}>
        <OrgaoPublico tema={tema} pos={[0, 0, -0.75]} escala={0.2} sobe={ap(t, T.treRJ - 0.2, T.noPiaui)} letreiro={rampa(t, T.treRJ, T.treRJ + 0.6)} texto="TRE-RJ" />
        <Rua tema={tema} z={0.35} x0={-1.45} x1={1.45} />
        <PontoOnibus tema={tema} pos={[-0.7, 0, 0.9]} escala={0.9 * entra(t, T.petropolis - 0.2, 0.4)} nome="PETRÓPOLIS" />
        <PontoOnibus tema={tema} pos={[0.7, 0, 0.9]} escala={0.9 * entra(t, T.saoGoncalo - 0.2, 0.4)} nome="S. GONÇALO" />
        {[0, 1].map((i) => (
          <Onibus key={i} tema={tema} pos={[1.5 - 2.2 * rampa(t, T.maisOnibusRJ + i * 0.4, T.maisOnibusRJ + 1.6 + i * 0.4, sai), 0, 0.35]} escala={0.28 * entra(t, T.maisOnibusRJ + i * 0.4, 0.4)} farol={1} />
        ))}
      </Maquete>

      {/* ---- Piauí ---- */}
      <Maquete tema={tema} base={L.teresina} pos={MQ.teresina} sobe={mPI}>
        <Garagem tema={tema} pos={[-0.4, 0, -0.55]} vagas={4} luz={0.5} />
        <Rua tema={tema} z={0.45} x0={-1.45} x1={1.45} />
        {[0, 1, 2, 3].map((i) => (
          <OnibusVivo key={i} tema={tema} de={vaga([-0.4, 0, -0.55], 4, i)} ruaZ={0.45} sai={rampa(t, T.teresina + i * 0.6, T.teresina + 1.2 + i * 0.6)} roda={Math.max(0, t - T.teresina - 1.2 - i * 0.6) * 1.1} xFim={-1.4} ligado={rampa(t, T.teresina, T.teresina + 0.4)} />
        ))}
        <OrgaoPublico tema={tema} pos={[1.0, 0, 0.6]} escala={0.17} sobe={ap(t, T.trePI, T.emAlagoas)} letreiro={rampa(t, T.trePI, T.trePI + 0.6)} texto="TRE-PI" />
        {ap(t, T.milhao2 - 0.1, T.emAlagoas) > 0.02 ? <PilhaMoedas tema={tema} pos={[1.25, 0, -0.15]} n={14 * rampa(t, T.milhao2 - 0.1, T.porHora2 + 0.4)} cor={ouro} r={0.09} escala={ap(t, T.milhao2 - 0.1, T.emAlagoas)} /> : null}
      </Maquete>

      {/* ---- Alagoas ---- */}
      <Maquete tema={tema} base={L.maceio} pos={MQ.maceio} sobe={mAL}>
        <OrgaoPublico tema={tema} pos={[-0.7, 0, -0.6]} escala={0.18} sobe={ap(t, T.ptDenunciou, T.emSergipe)} letreiro={rampa(t, T.treNegou - 0.4, T.treNegou + 0.3)} texto="TRE-AL" />
        {rampa(t, T.ptDenunciou, T.maceio + 0.4) > 0 && t < T.maceio + 0.9 ? <Envelope tema={tema} pos={curva([1.2, 0.4, 1.1], [-0.7, 0.55, -0.1], 0.8, rampa(t, T.ptDenunciou, T.maceio + 0.4))} rotY={0.3} escala={0.6} /> : null}
        <Papel tema={tema} pos={[0.45, 0, -0.35]} rotY={-0.3} escala={0.6 * ap(t, T.treNegou - 0.2, T.emSergipe)} titulo="PEDIDO" carimbo={rampa(t, T.treNegou + 0.2, T.treNegou + 0.6)} textoCarimbo="NEGADO" />
        <Rua tema={tema} z={0.5} x0={-1.45} x1={1.45} />
        <PontoOnibus tema={tema} pos={[0.6, 0, 1.0]} escala={0.8} nome="MACEIÓ" />
        {[0, 1].map((i) => (
          <Boneco key={i} tema={tema} pos={[0.45 + i * 0.25, 0, 1.08]} escala={0.16 * entra(t, T.maceio + i * 0.1, 0.4)} cor={tema.pessoa} />
        ))}
      </Maquete>

      {/* ---- Sergipe ---- */}
      <Maquete tema={tema} base={L.aracaju} pos={MQ.aracaju} sobe={mSE} raio={1.7}>
        <Rodoviaria tema={tema} pos={[-0.1, 0, -0.75]} />
        {Array.from({length: 20}).map((_, i) => {
          const k = i < 12 ? entra(t, T.relataram + i * 0.06, 0.4) : entra(t, T.procura + (i - 12) * 0.06, 0.4);
          return <Boneco key={i} tema={tema} pos={[-1.0 + (i % 10) * 0.2, 0, -0.25 + Math.floor(i / 10) * 0.2]} rotY={Math.PI / 2} escala={0.15 * k} cor={i === 0 ? tema.corpo : tema.pessoa} />;
        })}
        <RelogioMesa tema={tema} pos={[1.3, 0, -0.2]} escala={1.8 * ap(t, T.duasHoras - 0.1, T.treSE + 0.4)} ang={Math.PI * 2 * 2 * rampa(t, T.duasHoras, T.duasHoras + 1.4)} />
        <OrgaoPublico tema={tema} pos={[1.15, 0, 0.75]} escala={0.16} sobe={ap(t, T.treSE - 0.2, T.naParaiba)} letreiro={rampa(t, T.treSE, T.treSE + 0.6)} texto="TRE-SE" />
        <Ampulheta tema={tema} pos={[0.45, 0, 1.05]} escala={1.6 * ap(t, T.treSE + 0.3, T.interior + 0.8)} areia={1 - rampa(t, T.treSE + 0.3, T.interior + 0.6)} fio />
        <Rua tema={tema} z={0.35} x0={-1.6} x1={1.6} />
        {[0, 1].map((i) => (
          <Onibus key={i} tema={tema} pos={[-0.6 - 1.6 * rampa(t, T.interior + i * 0.35, T.interior + 1.8 + i * 0.35) + i * 0.9, 0, 0.35]} escala={0.28 * (1 - rampa(t, T.interior + 1.4 + i * 0.35, T.interior + 1.9 + i * 0.35)) * entra(t, T.treSE + 0.5, 0.4)} farol={1} />
        ))}
        {Array.from({length: 20}).map((_, i) => {
          const k = entra(t, T.vinte + i * 0.05, 0.35);
          if (k < 0.02) return null;
          return <Onibus key={`v${i}`} tema={tema} pos={[-1.35 + (i % 10) * 0.3, 0, 0.75 + Math.floor(i / 10) * 0.3]} escala={0.09 * k} farol={1} />;
        })}
      </Maquete>

      {/* ---- Paraíba ---- */}
      <Maquete tema={tema} base={L.joaoPessoa} pos={MQ.joaoPessoa} sobe={mJP}>
        <Rua tema={tema} z={0.35} x0={-1.45} x1={1.45} />
        <PontoOnibus tema={tema} pos={[0, 0, 0.85]} escala={0.9} nome="J. PESSOA" />
        {[0, 1, 2].map((i) => (
          <Boneco key={i} tema={tema} pos={[-0.25 + i * 0.25, 0, 0.92]} escala={0.16 * entra(t, T.eleitoresJP + i * 0.1, 0.4)} cor={tema.pessoa} pose={{ombroD: [0, 0, 2.2 * pulso(t, T.naoParavam + 0.3 + i * 0.1, 1.2)]}} />
        ))}
        {ap(t, T.naoParavam - 1.0, T.prefAbriu + 0.5) > 0.02 ? <Onibus tema={tema} pos={[1.6 - 3.4 * rampa(t, T.naoParavam - 1.0, T.naoParavam + 1.4, Easing.linear), 0, 0.35]} escala={0.28 * ap(t, T.naoParavam - 1.0, T.prefAbriu + 0.5)} farol={0.6} /> : null}
        <Lupa tema={tema} pos={[0.9, 0.5, -0.5]} rot={[-0.4, 0.3, 0]} escala={0.6 * ap(t, T.prefAbriu, T.noPara)} />
        <Escola tema={tema} pos={[-0.7, 0, -0.6]} escala={0.75} aberta={1} />
      </Maquete>

      {/* ---- Pará ---- */}
      <Maquete tema={tema} base={L.belem} pos={MQ.belem} sobe={mBelem} raio={1.9}>
        <mesh position={[0.35, 0.012, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 48]} />
          <meshStandardMaterial color={mistura(F.azulNoite, tema.chao, 0.2)} roughness={0.9} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
        </mesh>
        <Cais tema={tema} pos={[-0.95, 0, 0.75]} />
        <Balsa tema={tema} pos={[0.2 + 1.0 * rampa(t, T.lotada, T.duzentas + 1.5, Easing.inOut(Easing.quad)), 0, -0.1 - 0.6 * rampa(t, T.lotada, T.duzentas + 1.5)]} rotY={Math.PI + 0.4} n={12} t={t} />
        {Array.from({length: 18}).map((_, i) => (
          <Boneco key={i} tema={tema} pos={[-1.55 + (i % 6) * 0.13, 0.12, 0.5 + Math.floor(i / 6) * 0.16]} escala={0.12 * entra(t, T.duzentas + i * 0.04, 0.35)} cor={tema.pessoa} pose={{cabeca: [0, -0.6, 0]}} />
        ))}
        <OrgaoPublico tema={tema} pos={[1.1, 0, 1.0]} escala={0.15} sobe={ap(t, T.prefBelem - 0.2, T.repara)} letreiro={rampa(t, T.prefBelem, T.prefBelem + 0.6)} texto="TRE-PA" />
        {[
          [T.prefBelem, 0],
          [T.oab, 1],
        ].map(([a, i]) =>
          rampa(t, a, a + 1.0) > 0 && t < a + 1.5 ? <Envelope key={i} tema={tema} pos={curva([-0.9, 0.5, 0.75 - i * 0.2], [1.1, 0.5, 0.6], 0.8, rampa(t, a, a + 1.0))} rotY={0.3} escala={0.6} /> : null,
        )}
        <Placa tema={tema} pos={[-0.95, 0.5, 0.95]} larg={0.9} alt={0.16} linhas={[{t: 'PORTO · BELÉM', tam: 120, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.3 * rampa(t, T.porto, T.porto + 0.5) + 0.1} />
      </Maquete>

      {/* ---- Brasília: praça com TSE, STF, MP Eleitoral e a torre do relógio ---- */}
      <Maquete tema={tema} base={L.brasilia} pos={MQ.brasilia} sobe={mBsb} raio={3.1}>
        <OrgaoPublico tema={tema} pos={[-1.6, 0, -0.5]} escala={0.3} sobe={rampa(t, T.corrida, T.corrida + 0.8)} letreiro={0.4 + 0.6 * Math.max(pulso(t, T.noTSE, 1.2), pulso(t, T.entreTSE, 1.0), pulso(t, T.ministros, 1.0))} porta={1 - rampa(t, T.portas - 0.2, T.portas + 0.8)} texto="TSE" />
        <OrgaoPublico tema={tema} pos={[1.6, 0, -0.5]} escala={0.3} sobe={rampa(t, T.corrida + 0.2, T.corrida + 1.0)} letreiro={0.4 + 0.6 * pulso(t, T.chegouSTF, 1.2)} texto="STF" />
        <OrgaoPublico tema={tema} pos={[0, 0, -2.1]} escala={0.24} sobe={rampa(t, T.corrida + 0.4, T.corrida + 1.2)} letreiro={0.4 + 0.6 * Math.max(pulso(t, T.mpe, 1.2), pulso(t, T.disseNao, 1.0))} texto="MPE" />
        <TorreRelogio tema={tema} pos={[0, 0, 0.2]} sobe={rampa(t, T.corrida, T.corrida + 1.0, sai)} hora={horaTorre(t)} pulso={Math.max(pulso(t, T.h1701, 0.9), pulso(t, T.h1702, 0.9), pulso(t, T.h19, 1.2), pulso(t, T.h1812, 0.9))} />
        {/* pedidos: dois envelopes iguais (Lula e Flávio) */}
        {(
          [
            [T.pedLula, -0.5, 'CAMPANHA DE LULA'],
            [T.pedFlavio, 0.5, 'CAMPANHA DE FLÁVIO'],
          ] as [number, number, string][]
        ).map(([a, x, nome]) => {
          const k = rampa(t, a, a + 1.1);
          const vis = ap(t, a - 0.2, T.noTSE + 0.6);
          if (vis < 0.02) return null;
          const p = curva([x * 2.2, 0.4, 2.4], [-1.6 + x * 2.1, 1.0, 1.0], 1.0, k);
          return (
            <group key={nome}>
              <Envelope tema={tema} pos={p} rotY={0.2} escala={1.6 * vis} />
              <Placa tema={tema} pos={[p[0], p[1] + 0.45, p[2]]} larg={1.35 * vis} alt={0.24 * vis} linhas={[{t: nome, tam: 100, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.3} />
              {x > 0 && ap(t, T.chuva - 0.3, T.noTSE + 0.6) > 0.02 ? <NuvemChuva tema={tema} pos={[p[0], p[1] + 0.95, p[2]]} k={ap(t, T.chuva - 0.3, T.noTSE + 0.6)} t={t} cor={tema.objetoClaro} chuva={1} corGota={F.azul} tam={0.45} queda={0.6} /> : null}
            </group>
          );
        })}
        {/* Kassio, MP, Fachin e Zanin */}
        <Pessoa tema={tema} pos={[-1.6, 0, 0.75]} rotY={0.2} nome="KASSIO NUNES MARQUES" cargo="PRESIDENTE DO TSE" k={Math.max(ap(t, T.kassio - 0.1, T.mas + 1), ap(t, T.h18, T.falta + 0.5))} escala={0.34} placaLarg={1.4} pose={{ombroD: [-0.6 * pulso(t, T.kassioOrientou, 1.6), 0, 0.1]}} />
        {rampa(t, T.meiaHora2, T.mpe + 0.6) > 0 && t < T.h1701 ? <Envelope tema={tema} pos={curva([-1.6, 0.9, 0.2], [0, 1.0, -1.5], 0.8, rampa(t, T.meiaHora2, T.mpe + 0.6))} rotY={0.2} escala={0.7} /> : null}
        <Ampulheta tema={tema} pos={[-0.85, 0, 0.9]} escala={1.6 * ap(t, T.meiaHora2 - 0.1, T.chegouSTF)} areia={1 - rampa(t, T.meiaHora2, T.h1701)} fio />
        <Papel tema={tema} pos={[-0.55, 0, -0.9]} rotY={0.2} escala={0.75 * ap(t, T.h1701 - 0.2, T.chegouSTF + 0.3)} titulo="PARECER" carimbo={rampa(t, T.disseNao, T.disseNao + 0.4)} textoCarimbo="CONTRA" />
        <Pessoa tema={tema} pos={[1.15, 0, 0.75]} rotY={-0.1} nome="EDSON FACHIN" cargo="PRESIDENTE DO STF" k={Math.max(ap(t, T.fachin - 0.1, T.mas + 1), ap(t, T.h18, T.h1812))} escala={0.34} placaLarg={1.05} />
        <Pessoa tema={tema} pos={[2.15, 0, 0.6]} rotY={-0.3} nome="CRISTIANO ZANIN" cargo="MINISTRO DO STF" k={Math.max(ap(t, T.zanin - 0.1, T.mas + 1), ap(t, T.h18, T.h1812))} escala={0.34} placaLarg={1.05} pose={{ombroD: [-0.75 * rampa(t, T.zaninMandou, T.zaninMandou + 0.5) * (1 - rampa(t, T.mas, T.mas + 0.5)), 0, 0.07], cotoveloD: -0.5}} />
        {rampa(t, T.chegouSTF - 0.2, T.chegouSTF + 0.8) > 0 && t < T.mandouPara + 1.2 ? (
          <Envelope tema={tema} pos={lerp(curva([-1.0, 1.0, 0.3], [1.15, 0.75, 0.95], 0.8, rampa(t, T.chegouSTF - 0.2, T.chegouSTF + 0.8)), [2.15, 0.7, 0.8], rampa(t, T.mandouPara, T.mandouPara + 0.8))} rotY={0} escala={0.7} />
        ) : null}
        <Papel tema={tema} pos={[2.35, 0, 1.25]} rotY={-0.4} escala={0.8 * ap(t, T.zaninMandou - 0.1, T.mas + 0.5)} titulo="DECISÃO" carimbo={rampa(t, T.h19 - 0.2, T.h19 + 0.3)} textoCarimbo="ATÉ 19H" />
        <Papel tema={tema} pos={[-2.3, 0, 1.2]} rotY={0.4} escala={0.8 * ap(t, T.kassioOrientou - 0.1, T.ministros)} titulo="OFÍCIO" carimbo={rampa(t, T.abertas, T.abertas + 0.4)} textoCarimbo="18H12" />
        {/* balança do impasse */}
        {ap(t, T.fachinTentava - 0.2, T.h1812) > 0.02 ? <BalancaJustica tema={tema} pos={[0, 0, 1.55]} escala={0.32 * ap(t, T.fachinTentava - 0.2, T.h1812)} inclina={0.35 * Math.sin((t - T.impasse) * 2.2) * (1 - rampa(t, T.confusao, T.confusao + 0.8)) * rampa(t, T.impasse - 0.3, T.impasse)} /> : null}
        {/* ministros entrando no TSE */}
        {[0, 1, 2].map((i) => {
          const e = rampa(t, T.ministros + i * 0.2, T.portas + i * 0.1);
          const k = ap(t, T.ministros - 0.2 + i * 0.1, T.falta) * (1 - rampa(t, T.portas - 0.1 + i * 0.1, T.portas + 0.3 + i * 0.1));
          return <Boneco key={i} tema={tema} pos={[-1.9 + i * 0.3 + 0.3 * e, 0, 0.5 - 0.5 * e]} rotY={Math.PI} escala={0.2 * k} cor={tema.objetoClaro} pose={{passo: e > 0 && e < 1 ? Math.sin(t * 8 + i) : 0}} />;
        })}
      </Maquete>
      {/* aviso de Zanin: arcos de Brasília para o país; chegam com as urnas já cinza */}
      {[L.salvador, L.sp, L.teresina, L.maceio, L.aracaju, L.joaoPessoa, L.belem, L.df, L.bh, L.novaVeneza, L.petropolis, L.feira].map((p, i) => (
        <ArcoPontos key={`z${i}`} a={somaV(MQ.brasilia, [1.6, 1.0, -0.5])} b={[p[0] + 0.45, 0.8, p[2] + 0.2]} k={rampa(t, T.paisTodo - 0.3 + i * 0.05, T.jaFechado + 0.4 + i * 0.05) * (1 - rampa(t, T.folha - 0.3, T.folha + 0.3))} cor={neutro} alt={3.2} n={34} />
      ))}
      {[L.df, L.bh, L.novaVeneza].map((p, i) => (
        <ArcoPontos key={`t${i}`} a={[L.brasilia[0], 1.2, L.brasilia[2]]} b={[p[0] + 0.45, 0.8, p[2] + 0.2]} k={rampa(t, T.naoReceberam - 0.2 + i * 0.25, T.naoReceberam + 1.2 + i * 0.25) * (1 - rampa(t, i === 2 ? T.avisoNao : T.novaVeneza, (i === 2 ? T.avisoNao : T.novaVeneza) + 0.5))} cor={neutro} alt={1.4} n={18} />
      ))}
      {/* DF e MG: seções já fechadas quando o aviso chegou */}
      {[[L.df, T.tresDF], [L.bh, T.minas]].map(([p, a], i) => {
        const k = ap(t, (a as number) - 0.1, T.h18);
        return k > 0.02 ? <Escola key={`e${i}`} tema={tema} pos={[(p as V3)[0] + 0.9, MAPA_Y, (p as V3)[2] + 0.4]} escala={0.9 * k} aberta={0} /> : null;
      })}
      {/* Nova Veneza: escola que fecha */}
      {ap(t, T.novaVeneza - 0.1, T.h18) > 0.02 ? <Escola tema={tema} pos={[L.novaVeneza[0] - 0.8, MAPA_Y, L.novaVeneza[2] + 0.5]} escala={0.9 * ap(t, T.novaVeneza - 0.1, T.h18)} aberta={1 - rampa(t, T.fecharam17, T.fecharam17 + 0.6)} /> : null}
      {/* painel de apuração parado, atrás de Brasília */}
      <PainelApuracao tema={tema} pos={[L.brasilia[0] + 3.2, MAPA_Y, L.brasilia[2] - 2.6]} sobe={Math.max(ap(t, T.pausou - 0.4, T.h18 + 0.5), ap(t, T.contagem - 0.5, T.suaCidade))} enche={0.35} pausado={rampa(t, T.pausou, T.pausou + 0.6)} />
      {/* ofício das 18h12: arcos para os TREs */}
      {[L.salvador, L.sp, L.teresina, L.maceio, L.aracaju, L.joaoPessoa, L.belem, L.df, L.bh, L.novaVeneza, L.petropolis, L.feira].map((p, i) => (
        <ArcoPontos key={`o${i}`} a={somaV(MQ.brasilia, [-1.6, 1.0, -0.5])} b={[p[0] + 0.45, 0.8, p[2] + 0.2]} k={rampa(t, T.osTREs - 0.2 + i * 0.04, T.osTREs + 1.0 + i * 0.04) * (1 - rampa(t, T.ministros, T.ministros + 0.6))} cor={tema.acento} alt={3.0} n={30} />
      ))}

      {/* final: o ônibus verde que para para a eleitora */}
      <Onda pos={[L.salvador[0], MAPA_Y + 0.02, L.salvador[2]]} k={rampa(t, T.passou, T.passou + 1.2, Easing.linear)} cor={tema.acento} raio={2.2} />
    </>
  );
};

// ---------- Interface ----------
type Txt = {a: number; b?: number; texto: string; destaque?: boolean; tam?: number};
const CHIPS: Txt[] = [
  {a: T.contou, b: T.oea, texto: 'FALHAS NO TRANSPORTE EM 8 ESTADOS', destaque: true},
  {a: T.dasUrnas - 0.4, b: T.vamos + 0.6, texto: '"RESPEITEM A VONTADE DAS URNAS"', tam: 27},
  {a: T.maisGrave, b: T.procon, texto: 'O CASO MAIS GRAVE'},
  {a: T.achou, b: T.treBA, texto: 'ÔNIBUS PARADOS NAS GARAGENS'},
  {a: T.todaFrota, b: T.multa, texto: 'TODA A FROTA DE VOLTA', destaque: true},
  {a: T.multa, b: T.pf, texto: 'MULTA DE R$ 1 MILHÃO POR HORA'},
  {a: T.prender, b: T.pfDiz, texto: 'ORDEM DE PRISÃO DO SECRETÁRIO'},
  {a: T.paris, b: T.voltaAmanha, texto: 'PF: ELE ESTÁ EM PARIS'},
  {a: T.nosOnibus - 0.3, b: T.frotaJa, texto: 'CULPA ADESIVOS NOS ÔNIBUS'},
  {a: T.frotaJa, b: T.aindaBahia, texto: 'FROTA VOLTANDO AO NORMAL', destaque: true},
  {a: T.familia, b: T.naoPronunciou, texto: 'DA FAMÍLIA DO PREFEITO, SEGUNDO VEREADORES', tam: 25},
  {a: T.meiaHora, b: T.emFeira, texto: '30 MINUTOS PARA EXPLICAR'},
  {a: T.apenasDen, b: T.emLauro, texto: 'POR ENQUANTO, APENAS DENÚNCIAS'},
  {a: T.naoConseguiam, b: T.prefLauro, texto: 'MORADORES: NÃO CONSEGUIAM PEGAR ÔNIBUS', tam: 26},
  {a: T.pct, b: T.campLulaSP, texto: '71,7% DOS ÔNIBUS RODANDO', destaque: true},
  {a: T.justicaPrisao, b: T.boulos, texto: 'PEDIDO DE PRISÃO NA JUSTIÇA'},
  {a: T.vaiPedir, b: T.semDecisao, texto: 'BOULOS: VAI PEDIR A DO PREFEITO'},
  {a: T.semDecisao, b: T.nunesDiz, texto: 'AINDA SEM DECISÃO'},
  {a: T.treRJ, b: T.noPiaui, texto: 'TRE COBROU MAIS ÔNIBUS'},
  {a: T.trePI, b: T.milhao2, texto: 'RECOMPOR A FROTA', destaque: true},
  {a: T.milhao2, b: T.emAlagoas, texto: 'MULTA DE R$ 1 MILHÃO POR HORA'},
  {a: T.ptDenunciou, b: T.treNegou, texto: 'DENÚNCIA DO PT'},
  {a: T.treNegou, b: T.semTempo, texto: 'REFORÇO NEGADO'},
  {a: T.semTempo, b: T.prefNega, texto: 'SEM TEMPO E SEM PROVAS'},
  {a: T.duasHoras, b: T.treSE, texto: 'CERCA DE 2 H DE ESPERA'},
  {a: T.treSE, b: T.governo, texto: '1 HORA PARA RECOMPOR'},
  {a: T.procura, b: T.naParaiba, texto: 'PROCURA MAIOR QUE A ESPERADA'},
  {a: T.apenasDen2, b: T.naoParavam, texto: 'APENAS DENÚNCIAS'},
  {a: T.naoParavam, b: T.prefAbriu, texto: 'ÔNIBUS NÃO PARAVAM NOS PONTOS'},
  {a: T.lotada, b: T.duzentas, texto: 'BALSA PARA O MARAJÓ LOTADA'},
  {a: T.duzentas, b: T.prefBelem, texto: 'MAIS DE 200 PESSOAS NO PORTO'},
  {a: T.empresas, b: T.repara, texto: 'NA JUSTIÇA CONTRA AS EMPRESAS'},
  {a: T.pedLula, b: T.cidades17, texto: 'OS DOIS LADOS PEDIRAM MAIS TEMPO', destaque: true},
  {a: T.cidades17, b: T.noTSE, texto: 'FLÁVIO: 17 CIDADES COM CHUVA'},
  {a: T.meiaHora2, b: T.h1701, texto: '30 MINUTOS PARA O MP OPINAR'},
  {a: T.disseNao, b: T.chegouSTF, texto: 'MP: URNAS FECHAM ÀS 17H'},
  {a: T.mandouPara, b: T.h1702, texto: 'PEDIDO VAI PARA ZANIN'},
  {a: T.h19, b: T.mas, texto: 'VOTAÇÃO ATÉ 19H NO PAÍS TODO', destaque: true},
  {a: T.jaFechado, b: T.folha, texto: 'MUITAS URNAS JÁ FECHADAS'},
  {a: T.naoFechar, b: T.h1738, texto: '17:14 · "NÃO FECHEM AS URNAS"'},
  {a: T.secaoFechada, b: T.usp, texto: '17:38 · "SEÇÃO FECHADA NÃO REABRE"', tam: 27},
  {a: T.de21, b: T.taboao, texto: '7 DE 21 SEÇÕES ABERTAS', destaque: true},
  {a: T.taboao, b: T.depois17, texto: 'TABOÃO DA SERRA: MESÁRIOS LIBERADOS', tam: 26},
  {a: T.ata, b: T.tresDF, texto: 'NOME EM ATA, SEM VOTAR'},
  {a: T.naoReceberam, b: T.novaVeneza, texto: 'SEM AVISO OFICIAL A TEMPO'},
  {a: T.novaVeneza, b: T.pausou, texto: 'NOVA VENEZA (GO): FECHOU ÀS 17H'},
  {a: T.pausou, b: T.h18, texto: 'CONTAGEM PAUSADA'},
  {a: T.fachinTentava, b: T.paraEla, texto: 'FACHIN TENTA RESOLVER O IMPASSE'},
  {a: T.seguem, b: T.asQueFecharam, texto: 'ABERTAS SEGUEM ATÉ 19H', destaque: true},
  {a: T.naoReabrem, b: T.ministros, texto: 'FECHADAS NÃO REABREM'},
  {a: T.portas, b: T.falta, texto: 'REUNIÃO A PORTAS FECHADAS'},
  {a: T.punido, b: T.contagem, texto: 'QUEM SERÁ PUNIDO?'},
  {a: T.contagem, b: T.suaCidade, texto: 'QUANDO A CONTAGEM VOLTA?'},
  {a: T.passou, b: T.segue, texto: 'NA SUA CIDADE, O ÔNIBUS PASSOU?', destaque: true},
];
const RESPOSTAS: Txt[] = [
  {a: T.prefDiz, b: T.bruno, texto: 'VIAGEM OFICIAL; VOLTA NA SEGUNDA (26)'},
  {a: T.nega, b: T.frotaJa, texto: 'PREFEITO NEGA ORDEM PARA REDUZIR'},
  {a: T.naoPronunciou, b: T.presTSE, texto: 'PREFEITO NÃO SE PRONUNCIOU'},
  {a: T.prefLauro, b: T.emFeira2, texto: 'GRÁTIS O DIA TODO, COM A FROTA NORMAL'},
  {a: T.diaUtil, b: T.emSP, texto: 'RODOU COM FROTA DE DIA ÚTIL'},
  {a: T.nunesDiz, b: T.noRio, texto: 'MAIS ÔNIBUS DO QUE PASSAGEIROS'},
  {a: T.prefNega, b: T.emSergipe, texto: 'PREFEITURA NEGA A REDUÇÃO'},
  {a: T.governo, b: T.procura, texto: 'GOVERNO: MAIS 20 ÔNIBUS'},
  {a: T.prefAbriu, b: T.noPara, texto: 'PREFEITURA ABRIU APURAÇÃO'},
];
const SELOS: Txt[] = [
  {a: T.ministerio, b: T.oea, texto: 'MINISTÉRIO DA JUSTIÇA'},
  {a: T.oea + 0.4, b: T.vamos, texto: 'NOTA DA MISSÃO DA OEA · 25/10'},
  {a: T.garagens, b: T.pfDiz, texto: 'PROCON-BA · DECISÃO DO TRE-BA'},
  {a: T.pfDiz, b: T.bruno, texto: 'POLÍCIA FEDERAL · NOTA DA PREFEITURA'},
  {a: T.segundoEles, b: T.presTSE, texto: 'SEGUNDO VEREADORES DE ILHÉUS'},
  {a: T.explicarem, b: T.emFeira, texto: 'DESPACHO DO PRESIDENTE DO TSE'},
  {a: T.pct + 0.4, b: T.campLulaSP, texto: 'INFOBUS · 13H20'},
  {a: T.justicaPrisao, b: T.nunesDiz, texto: 'PEDIDO À 1ª ZONA ELEITORAL'},
  {a: T.treRJ, b: T.noPiaui, texto: 'TRE-RJ'},
  {a: T.trePI, b: T.emAlagoas, texto: 'TRE-PI'},
  {a: T.treNegou, b: T.emSergipe, texto: 'TRE-AL'},
  {a: T.relataram, b: T.naParaiba, texto: 'RELATO DE PASSAGEIROS · TRE-SE'},
  {a: T.balsa, b: T.repara, texto: 'DIÁRIO DO PARÁ'},
  {a: T.disseNao, b: T.chegouSTF, texto: 'PARECER DO MP ELEITORAL · 17H01'},
  {a: T.colunista, b: T.h1702, texto: 'SEGUNDO MÍRIAM LEITÃO, O GLOBO'},
  {a: T.zaninMandou, b: T.mas, texto: 'DECISÃO DE ZANIN (STF) · 17H02'},
  {a: T.folha, b: T.tresDF, texto: 'SEGUNDO A FOLHA · RELATO DE MESÁRIOS'},
  {a: T.naoReceberam, b: T.h18, texto: 'TRE-DF E TRE-MG · PORTAL VENEZA'},
  {a: T.segMiriam, b: T.paraEla, texto: 'SEGUNDO MÍRIAM LEITÃO, O GLOBO'},
  {a: T.kassioOrientou, b: T.falta, texto: 'OFÍCIO DO TSE · 18H12'},
];
// t < a: a mola devolve um resto minúsculo (> 0); por isso o corte em 0,01 abaixo.
const visivel = (x: Txt, t: number) => (t < x.a ? 0 : entra(t, x.a, 0.45) * (x.b !== undefined ? 1 - rampa(t, x.b - 0.35, x.b - 0.05, Easing.linear) : 1));
const Contadores: {a: number; b: number; valor: string; rotulo: string}[] = [
  {a: T.oito, b: T.oea, valor: '8 ESTADOS', rotulo: 'COM FALHAS NO TRANSPORTE'},
  {a: T.milhao, b: T.pf, valor: 'R$ 1 MILHÃO', rotulo: 'POR HORA DE ATRASO'},
  {a: T.vinte, b: T.naParaiba, valor: '+20', rotulo: 'ÔNIBUS, SEGUNDO O GOVERNO'},
  {a: T.duzentas, b: T.prefBelem, valor: '+200', rotulo: 'PESSOAS NO PORTO'},
  {a: T.cidades17, b: T.noTSE, valor: '17', rotulo: 'CIDADES COM CHUVA'},
];

const Interface: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const chip = CHIPS.filter((c) => visivel(c, t) > 0.01).slice(-1)[0];
  const resp = RESPOSTAS.find((r) => visivel(r, t) > 0.01);
  const selo = SELOS.filter((s) => visivel(s, t) > 0.01).slice(-1)[0];
  const cont = Contadores.find((c) => t >= c.a && t < c.b);
  // relógio fixo
  let hora: [number, string, string] | null = null;
  for (const h of HORAS) if (t >= h[0]) hora = h;
  const kHora = hora ? rampa(t, hora[0], hora[0] + 0.35) : 0;
  // placar dos 8 estados
  const kPlacar = entra(t, T.contou, 0.5) * (1 - rampa(t, T.repara, T.repara + 0.6));
  // opinião da colunista
  const kOp = entra(t, T.paraEla, 0.45) * (1 - rampa(t, T.confusao + 0.6, T.confusao + 1.0));
  return (
    <>
      {hora ? (
        <div style={{position: 'absolute', top: 326, right: W - SEGURO.dir, textAlign: 'right', opacity: 0.4 + 0.6 * kHora, transform: `translateY(${(1 - kHora) * 8}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 42, fontWeight: 800, letterSpacing: 2, color: hora[1].includes(':') ? tema.acento : tema.texto, whiteSpace: 'nowrap', lineHeight: 1}}>{hora[1]}</div>
          <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: tema.textoSuave, marginTop: 6, whiteSpace: 'nowrap'}}>{hora[2]}</div>
        </div>
      ) : null}
      {kPlacar > 0.01 ? (
        <div style={{position: 'absolute', top: 404, left: SEGURO.esq, display: 'flex', gap: 10, opacity: Math.min(1, kPlacar)}}>
          {ESTADOS_MJ.map((e, i) => {
            const k = rampa(t, ACENDE_ESTADO[i] - 0.1, ACENDE_ESTADO[i] + 0.4);
            return (
              <div key={e.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <div style={{width: 22, height: 22, borderRadius: 11, background: mistura(tema.cartao, tema.texto, k), border: `2px solid ${tema.cartaoBorda}`, boxShadow: k > 0.5 ? `0 0 ${12 * k}px ${tema.texto}55` : undefined}} />
                <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 1, color: k > 0.5 ? tema.texto : tema.textoSuave}}>{e.id}</div>
              </div>
            );
          })}
        </div>
      ) : null}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.2)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.tam ?? 29} />
        </div>
      ) : null}
      {cont ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: entra(t, cont.a, 0.45) * (1 - rampa(t, cont.b - 0.4, cont.b))}}>
          <div style={{padding: '14px 30px', borderRadius: 18, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', transform: `scale(${0.9 + 0.1 * Math.min(1, entra(t, cont.a, 0.45))})`}}>
            <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 850, color: tema.texto, lineHeight: 1, whiteSpace: 'nowrap'}}>{cont.valor}</div>
            <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: tema.textoSuave, marginTop: 6, whiteSpace: 'nowrap'}}>{cont.rotulo}</div>
          </div>
        </div>
      ) : null}
      {kOp > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 40, right: W - SEGURO.dir + 40, top: 560, opacity: Math.min(1, kOp)}}>
          <div style={{padding: '18px 26px', borderRadius: 16, background: tema.cartao, border: `2px dashed ${tema.textoSuave}`}}>
            <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: tema.textoSuave}}>OPINIÃO DA COLUNISTA MÍRIAM LEITÃO</div>
            <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 750, color: tema.texto, marginTop: 8, opacity: rampa(t, T.omissao, T.omissao + 0.4)}}>A omissão de Kassio</div>
            <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 750, color: tema.texto, opacity: rampa(t, T.demora, T.demora + 0.4)}}>e a demora de Fachin</div>
            <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 750, color: tema.textoSuave, opacity: rampa(t, T.confusao, T.confusao + 0.4)}}>criaram a confusão.</div>
          </div>
        </div>
      ) : null}
      {resp ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1110, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(resp, t) * 1.2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 14, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, transform: `translateY(${(1 - Math.min(1, entra(t, resp.a, 0.45))) * 14}px)`}}>
            <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave}}>RESPOSTA</div>
            <div style={{fontFamily: FONTE, fontSize: 29, fontWeight: 700, color: tema.texto, whiteSpace: 'nowrap'}}>{resp.texto}</div>
          </div>
        </div>
      ) : null}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1240, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>FONTE: {selo.texto}</div>
        </div>
      ) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
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

// ---------- Siglas dos estados nos planos abertos ----------
const SiglasUF: React.FC<{cam: Cam; tema: Tema}> = ({cam, tema}) => {
  const dist = Math.hypot(cam.pos[0] - cam.alvo[0], cam.pos[1] - cam.alvo[1], cam.pos[2] - cam.alvo[2]);
  const k = rampa(dist, 22, 32);
  if (k < 0.02) return null;
  return (
    <>
      {Object.entries(CENTRO_UF).map(([uf, p]) => {
        const q = projetar([p[0], p[1] + 0.05, p[2]], cam, W, H);
        if (!q.visivel || q.y < 450 || q.y > 1470 || q.x < 30 || q.x > W - 30) return null;
        return (
          <div key={uf} style={{position: 'absolute', left: q.x - 30, top: q.y - 12, width: 60, textAlign: 'center', fontFamily: MONO, fontSize: 20, fontWeight: 800, letterSpacing: 1, color: tema.objetoEscuro, opacity: 0.8 * k}}>
            {uf}
          </div>
        );
      })}
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.24}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t, f: 'tique', v: 0.24}));
  [T.salvador, T.ilheus, T.emFeira, T.emSP + 0.6, T.noRio + 0.5, T.trePI, T.emAlagoas + 0.4, T.emSergipe + 0.4, T.joaoPessoa, T.noPara + 0.6, T.corrida].forEach((t) => s.push({t, f: 'pop', v: 0.26}));
  [T.pablo, T.bruno, T.secMob, T.sptrans, T.boulos, T.nunes, T.kassio, T.fachin, T.zanin, T.pedLula + 1.0, T.pedFlavio + 1.0, T.oito, T.vinte, T.duzentas].forEach((t) => s.push({t, f: 'pop', v: 0.22}));
  [T.ordem + 0.3, T.prender + 0.35, T.treNegou + 0.3, T.disseNao + 0.15].forEach((t) => s.push({t, f: 'impacto', v: 0.3}));
  [T.jaFechado, T.naoReabrem].forEach((t) => s.push({t, f: 'baque', v: 0.28}));
  [T.h1701, T.h1640, T.h1702, T.h1714, T.h1738, T.h18, T.h1812].forEach((t) => s.push({t, f: 'bip', v: 0.24}));
  [T.milhao, T.milhao2].forEach((t) => s.push({t, f: 'subida', v: 0.24}));
  [T.frotaJa, T.seguem, T.segue].forEach((t) => s.push({t, f: 'ding', v: 0.3}));
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.6, T.ordem + 0.8, T.aconteceu + 1.4, T.oito + 1.0, T.respeito + 0.8, T.achou + 0.8, T.milhao + 0.6, T.pablo + 0.6, T.paris + 0.6, T.bruno + 0.8, T.frotaJa + 1.4, T.familia + 0.6, T.lauro + 0.5,
  T.apenasDen + 0.4, T.diaUtil + 0.5, T.pct + 1.4, T.nunes + 0.5, T.passageiros + 0.6, T.saoGoncalo + 0.4, T.teresina + 1.2, T.treNegou + 0.6, T.duasHoras + 0.6, T.vinte + 1.0, T.naoParavam + 0.5,
  T.duzentas + 0.6, T.pedFlavio + 0.8, T.chuva + 0.5, T.kassio + 0.6, T.disseNao + 0.5, T.zanin + 0.5, T.h19 + 0.5, T.paisTodo + 0.8, T.jaFechado + 0.4, T.h1714 + 0.8, T.de21 + 0.4, T.liberados + 0.8,
  T.minas + 0.5, T.novaVeneza + 0.8, T.pausou + 0.6, T.impasse + 0.4, T.demora + 0.4, T.osTREs + 0.8, T.portas + 0.4, T.punido + 0.4, T.passou + 0.6, T.segue + 1.0,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OnibusEleicao: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  // Sem desfoque de profundidade (aprendizado 003): tudo nítido; só o borrado leve na troca de cena.
  const dt = t - ini;
  const zoom = 1 + 0.025 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const longe = CENAS[i].longe || Math.hypot(cam.pos[0] - cam.alvo[0], cam.pos[1] - cam.alvo[1], cam.pos[2] - cam.alvo[2]) > 28;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={longe ? 520 : 280} sombraArea={longe ? 34 : 12} centro={longe ? [2, 0, 0] : [cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}D0 0%, ${tema.fundo}99 16%, ${tema.fundo}00 30%)`, pointerEvents: 'none'}} />
      <SiglasUF cam={cam} tema={tema} />
      <Interface t={t} tema={tema} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Ônibus na eleição" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Cadê o', 'ônibus?', 'A Justiça', 'foi atrás.'];
export const CapaOnibusEleicao: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 540}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ÔNIBUS NA ELEIÇÃO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
