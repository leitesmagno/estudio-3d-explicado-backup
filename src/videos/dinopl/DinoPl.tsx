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
import {BalancaJustica, CartaoBeneficio, CelularGigante, Congresso, DocumentoGrande, LivroLei, Lupa, MarcoAno, Martelo, OrgaoPublico, PastaBets, Porta, PredioColunas, Redoma, Seta, XMarca} from '../../pecas';
import {Minerio} from '../flavioaliados/pecas';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 143. dino x deputados do PL (perfil @eumagnoleite, série Magno Explica). Vídeo nacional, NÃO vai para o site.
// Feito com os DOIS kits: o Estúdio 3D monta uma praça comprida com as estações do roteiro, da esquerda para a direita:
// o boato no celular → STF (decisão de 27/10) → PF (as 5 perguntas) → a lei → foro (Congresso → STF) → imunidade (redoma)
// → "nenhum nome" → TSE (o partido pode acabar? o caminho do registro) → o caminho da ação penal → Lula/Alckmin no TSE
// → duas portas (TSE x STF) → os dois lados (balança) → resumo. O Kit Mapas faz dois trechos (projetos/143.../mapas/dino.mp4,
// composição DinoPl do kit): A "do exterior?" (EUA → Brasília com "?") e B "121 deputados do PL eleitos em outubro".
// Neutro: mostra os dois lados com o mesmo peso; nada de boneco com rosto; nomes só em plaquinhas.
// Fontes de cada frase: projetos/143. dino x deputados do PL/audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 167.36;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '143. dino x deputados do PL';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  boato: quando('Flávio Dino vai'),
  cento: quando('cento e vinte deputados'),
  acabar: quando('acabar com o partido'),
  celular: quando('seu celular'),
  li: quando('Eu li'),
  paginas: quando('páginas da decisão'),
  mostrar: quando('Vou te mostrar'),
  naoTa: quando('e o que não'),
  d27: quando('vinte e sete de outubro'),
  ministro: quando('o ministro Flávio'),
  mandou: quando('mandou a Polícia'),
  inquerito: quando('um inquérito'),
  suspeita: quando('A suspeita'),
  pedido: quando('O pedido veio'),
  dinoNegou: quando('Dino negou'),
  separado: quando('investigar em separado'),
  cinco: quando('cinco perguntas'),
  q1: quando('O que um grupo'),
  q2: quando('Quem pagou'),
  q3: quando('Se isso tem'),
  q4: quando('Com quem mais'),
  q5: quando('E se alguma'),
  algoritmo: quando('no algoritmo'),
  importa: quando('Por que isso importa'),
  constituicao: quando('A Constituição'),
  art17: quando('artigo dezessete'),
  proibe: quando('proíbe partido'),
  estrangeira: quando('entidade estrangeira'),
  disfarcada: quando('ajuda disfarçada'),
  publicidade: quando('publicidade paga'),
  porqueSTF: quando('E por que é o Supremo'),
  decisaoDiz: quando('A decisão diz'),
  membros: quando('membros do Congresso'),
  deputado: quando('Deputado e senador'),
  julgados: quando('são julgados'),
  foro: quando('É o foro'),
  imunidade: quando('Mas eles não'),
  tem: quando('imunidade Têm'),
  protege: quando('imunidade protege'),
  opiniao: quando('opinião'),
  palavra: quando('palavra e voto'),
  voto: quando('e voto', 1, true),
  dinheiroNao: quando('Dinheiro não'),
  impede: quando('não impede investigação'),
  detalhe: quando('Agora o detalhe'),
  naoCita: quando('não cita o nome'),
  nenhum: quando('deputado Nenhum'),
  deOnde: quando('De onde saiu'),
  elegeu: quando('O PL elegeu'),
  boatoPegou: quando('O boato pegou'),
  virou: quando('virou lista'),
  lista: quando('Essa lista não'),
  existe: quando('lista não existe', 1, true),
  podeAcabar: quando('E o partido pode'),
  preve: quando('A lei prevê'),
  provado: quando('ficar provado'),
  tse: quando('o TSE cancela'),
  soDepois: quando('Mas só depois'),
  proprio: quando('processo próprio'),
  defesa: quando('com defesa'),
  recurso: quando('mais recurso'),
  hoje: quando('Hoje esse processo'),
  existeInv: quando('Existe uma investigação'),
  mandato: quando('não tira sozinha'),
  caminho: quando('O caminho é longo'),
  pfInv: quando('A PF investiga'),
  pgr: quando('decide se acusa'),
  stf: quando('o Supremo decide'),
  parlamentar: quando('se for parlamentar'),
  suspender: quando('pra suspender'),
  lula: quando('E o Lula'),
  justa: quando('Pergunta justa'),
  tambem: quando('Também tá sendo'),
  d5: quando('cinco de novembro'),
  aceitou: quando('o TSE aceitou'),
  novo: quando('partido Novo'),
  abuso: quando('abuso de poder político'),
  n35: quando('trinta e cinco medidas'),
  pede: quando('pede a cassação'),
  chamados: quando('foram chamados'),
  bolsa: quando('reajuste do Bolsa'),
  gilmar: quando('Gilmar Mendes'),
  naoProibido: quando('não era proibido'),
  corrigiu: quando('só corrigiu'),
  tribunais: quando('Por que tribunais'),
  abusoTSE: quando('Abuso de poder na'),
  crime: quando('Suspeita de crime'),
  mesma: quando('A regra é a mesma'),
  porta: quando('Muda a porta'),
  lados: quando('Os dois lados'),
  nega: quando('Flávio nega'),
  criticos: quando('Críticos dizem'),
  presidente: quando('o presidente do TSE'),
  semSinal: quando('não via sinal'),
  dinoResp: quando('Dino responde'),
  indicios: quando('há indícios'),
  resumindo: quando('Resumindo'),
  investDois: quando('investigação dos dois'),
  condenacao: quando('Condenação até agora'),
  cta: quando('Se esse vídeo'),
  manda: quando('manda pra quem'),
  segue: quando('E segue o'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'O BOATO'],
  [T.d27, 'O QUE ACONTECEU'],
  [T.cinco, 'AS 5 PERGUNTAS'],
  [T.importa, 'A LEI'],
  [T.porqueSTF, 'POR QUE NO STF'],
  [T.imunidade, 'E A IMUNIDADE?'],
  [T.detalhe, 'O DETALHE'],
  [T.podeAcabar, 'O PL PODE ACABAR?'],
  [T.caminho, 'OS PRÓXIMOS PASSOS'],
  [T.lula, 'E O LULA?'],
  [T.tribunais, 'POR QUE TRIBUNAIS DIFERENTES'],
  [T.lados, 'OS DOIS LADOS'],
  [T.resumindo, 'RESUMINDO'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.suspeita), ate: q(T.pedido), origem: 0};
const MAPA_B = {de: q(T.elegeu), ate: q(T.lista), origem: q(T.pedido) - q(T.suspeita)};
const noMapa = (t: number) => (t >= T.suspeita && t < T.pedido) || (t >= T.elegeu && t < T.lista);

// ---------- Mapa do mundo (uma praça comprida, da esquerda para a direita) ----------
const CEL: V3 = [0, 0, 0];
const DOC: V3 = [2.6, 0, 0.6];
const STF: V3 = [8, 0, -1.2];
const PF: V3 = [15.5, 0, -1.4];
const PERG_Z = 2.2;
const PERG = [12.9, 14.2, 15.5, 16.8, 18.1];
const LEI: V3 = [24, 0, 0];
const CONG: V3 = [30, 0, -1.6];
const STF2: V3 = [35, 0, -1.4];
const IMU: V3 = [41.5, 0, 0];
const NOMES: V3 = [48, 0, 0];
const TSE: V3 = [57, 0, -2.2];
const DEGRAUS = [53.2, 55.4, 57.6];
const CARIMBO_X = 59.8;
const CAM_X = [65, 68, 71, 74];
const TSE2: V3 = [83, 0, -2.2];
const PORTAS = [92.4, 95.6];
const BAL: V3 = [102, 0, 0];
const RES = [107.6, 110.4];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

// letreiro pequeno em pé, preso a um prédio ou objeto
const Letreiro: React.FC<{tema: Tema; pos: V3; texto: string; k: number; larg?: number; acento?: boolean; brilho?: number}> = ({tema, pos, texto, k, larg = 1.4, acento, brilho = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={larg} alt={0.4} linhas={[{t: texto, tam: texto.length > 8 ? 170 : 230, cor: acento ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={acento ? tema.acento : tema.objetoEscuro} brilho={0.2 + 0.5 * brilho} />
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  // ----- Cena 1: o boato no celular e a decisão de 38 páginas -----
  const celK = vis(t, 0, T.d27 + 0.2);
  const docK = entra(t, T.li - 0.1, 0.5) * (1 - rampa(t, T.d27 + 0.2, T.d27 + 0.6));
  const lupaG = entra(t, T.mostrar, 0.4) * (1 - rampa(t, T.d27, T.d27 + 0.4));

  // ----- Cena 2: STF manda a PF abrir o inquérito -----
  const stfK = entra(t, T.d27 - 0.3, 0.6);
  const stfLuz = Math.max(janela(t, T.ministro, T.suspeita), janela(t, T.pedido, T.cinco), janela(t, T.porqueSTF, T.imunidade));
  const bate = pulso(t, T.mandou, 0.8);
  const pfK = entra(t, T.mandou - 0.2, 0.6);
  const voaDoc = rampa(t, T.mandou + 0.2, T.inquerito + 0.6);
  const docVoa: V3 = curva(soma(STF, [1.6, 1.4, 1.6]), soma(PF, [0, 1.0, 2.0]), 2.4, voaDoc);
  const docVoaK = janela(t, T.mandou + 0.1, T.inquerito + 0.7, 0.2);

  // PT pede, Dino nega a entrada no processo e manda investigar em separado
  const portaK = entra(t, T.pedido - 0.1, 0.45) * (1 - rampa(t, T.cinco, T.cinco + 0.4));
  const naoEntra = rampa(t, T.dinoNegou + 0.3, T.dinoNegou + 0.8);
  const pastaVai = rampa(t, T.separado - 0.1, T.separado + 1.0);
  const pastaK = entra(t, T.separado - 0.3, 0.4) * (1 - rampa(t, T.importa, T.importa + 0.4));
  const pastaPos: V3 = curva(soma(STF, [2.2, 0.1, 2.0]), soma(PF, [-1.6, 0.1, 1.6]), 1.4, pastaVai);

  // ----- Cena 3: as 5 perguntas na frente da PF -----
  const qs = [T.q1, T.q2, T.q3, T.q4, T.q5];
  const qK = qs.map((a) => entra(t, a - 0.1, 0.45) * (1 - rampa(t, T.porqueSTF, T.porqueSTF + 0.4)));
  const qLuz = qs.map((a, i) => janela(t, a, i < 4 ? qs[i + 1] : T.importa, 0.3));

  // ----- Cena 4: a lei (Constituição art. 17 e a barreira) -----
  const leiK = entra(t, T.constituicao - 0.2, 0.5) * (1 - rampa(t, T.membros, T.membros + 0.4));
  const leiAbre = rampa(t, T.art17 - 0.1, T.art17 + 0.7);
  const barK = entra(t, T.proibe, 0.4) * (1 - rampa(t, T.membros, T.membros + 0.4));
  const moedaVai = rampa(t, T.proibe + 0.2, T.estrangeira + 0.3);
  const moedaVolta = rampa(t, T.estrangeira + 0.3, T.estrangeira + 1.0);
  const moedaPos: V3 = mix(curva(soma(LEI, [4.2, 1.6, 0.8]), soma(LEI, [1.7, 1.0, 0.8]), 1.0, moedaVai), soma(LEI, [3.6, 0.25, 1.4]), moedaVolta);
  const anuncioK = entra(t, T.disfarcada - 0.1, 0.45) * (1 - rampa(t, T.membros, T.membros + 0.4));
  const anuncioVai = rampa(t, T.publicidade - 0.2, T.publicidade + 0.6);

  // ----- Cena 5: o foro (Congresso → STF) -----
  const congK = entra(t, T.porqueSTF - 0.1, 0.6);
  const congLuz = janela(t, T.membros, T.foro + 1.0, 0.4);
  const stf2K = entra(t, T.porqueSTF + 0.3, 0.6);
  const anda = rampa(t, T.deputado, T.foro + 0.2);
  const parK = entra(t, T.deputado - 0.2, 0.45) * (1 - rampa(t, T.imunidade, T.imunidade + 0.4));

  // ----- Cena 6: a imunidade (redoma) -----
  const imuK = entra(t, T.imunidade - 0.2, 0.5) * (1 - rampa(t, T.naoCita, T.naoCita + 0.4));
  const desce = rampa(t, T.protege - 0.2, T.protege + 0.7);
  const fichasImu = [T.opiniao, T.palavra, T.voto - 0.25].map((a) => entra(t, a, 0.4));
  const moedaImuK = entra(t, T.dinheiroNao - 0.1, 0.4);
  const lupaImu = rampa(t, T.impede - 0.2, T.impede + 0.8);

  // ----- Cena 7: nenhum nome / a lista não existe -----
  const docNomesK = entra(t, T.naoCita - 0.4, 0.5);
  const lupaNomes = entra(t, T.naoCita, 0.4);
  const listaK = entra(t, T.lista - 0.4, 0.45);
  const xLista = entra(t, T.existe - 0.4, 0.4);

  // ----- Cena 8: o partido pode acabar? (TSE e os degraus) -----
  const tseK = entra(t, T.podeAcabar - 0.2, 0.6);
  const tseLuz = Math.max(janela(t, T.tse, T.soDepois), janela(t, T.recurso, T.hoje));
  const degK = [T.proprio, T.defesa, T.recurso].map((a) => entra(t, a - 0.1, 0.4));
  const carimboK = entra(t, T.tse - 0.1, 0.45);
  const hojeK = entra(t, T.hoje - 0.1, 0.45);
  const mandK = entra(t, T.mandato - 0.4, 0.45);
  const tseDesce = janela(t, T.soDepois - 0.3, T.caminho + 1.0, 0.6);

  // ----- Cena 9: o caminho da ação penal -----
  const marcoK = CAM_X.map((_, i) => entra(t, T.caminho + 0.1 + 0.12 * i, 0.4));
  const passos = [T.pfInv, T.pgr, T.stf, T.parlamentar];
  const marcoAceso = passos.map((a, i) => janela(t, a, i < 3 ? passos[i + 1] : T.lula, 0.3));
  const bolaX = (() => {
    let x = CAM_X[0] - 2.2;
    passos.forEach((a, i) => {
      x = x + (CAM_X[i] - x) * rampa(t, a - 0.1, a + 0.6);
    });
    return x;
  })();
  const linhaK = rampa(t, T.caminho, T.caminho + 0.8);

  // ----- Cena 10: Lula e Alckmin no TSE -----
  const tse2K = entra(t, T.aceitou - 0.4, 0.6);
  const tse2Luz = janela(t, T.aceitou, T.bolsa, 0.4);
  const acaoK = entra(t, T.novo - 0.1, 0.45);
  const n35K = rampa(t, T.n35 - 0.1, T.n35 + 1.0);
  const portaDef = rampa(t, T.chamados, T.chamados + 0.8);
  const cartaoK = entra(t, T.bolsa - 0.1, 0.45);
  const tse2Desce = janela(t, T.novo - 0.3, T.tribunais + 1.0, 0.6);

  // ----- Cena 11: duas portas -----
  const portasK = PORTAS.map((_, i) => entra(t, (i ? T.crime : T.abusoTSE) - 0.2, 0.45));
  const abre = PORTAS.map((_, i) => janela(t, i ? T.crime : T.abusoTSE, T.lados, 0.6));

  // ----- Cena 12: os dois lados -----
  const balK = entra(t, T.lados - 0.2, 0.5);

  // ----- Cena 13: resumo -----
  const resK = RES.map((_, i) => entra(t, T.investDois + 0.15 * i, 0.45));

  return (
    <group>
      {/* a calçada da praça, de ponta a ponta */}
      <Caixa args={[124, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[56, 0.02, 3.8]} sombra={false} />

      {/* Cena 1: o boato e a decisão */}
      <CelularGigante tema={tema} pos={CEL} rot={[0, 0.25, 0]} escala={0.9 * celK} tela={celK} baloes={entra(t, T.cento, 1.2)} tarja={1} />
      {docK > 0.02 ? <Caixa args={[1.5, 0.5, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(DOC, [0, 0.25, 0])} /> : null}
      <DocumentoGrande tema={tema} pos={soma(DOC, [0, 0.55, 0])} rot={[-0.9, -0.2, 0]} escala={0.75 * docK} carimbo={rampa(t, T.paginas, T.paginas + 0.5)} />
      <Lupa tema={tema} pos={soma(DOC, [0.2 + 0.35 * Math.sin(t * 1.6), 1.25, 0.3])} rot={[0.4, 0, 0.3]} escala={0.7 * lupaG} />

      {/* Cena 2: STF, martelo, decisão voando para a PF */}
      <PredioColunas tema={tema} pos={STF} aceso={stfLuz} escala={1.1 * stfK} />
      <Letreiro tema={tema} pos={soma(STF, [0, 3.35 * stfK, 1.0])} texto="STF" k={stfK} larg={1.1} acento={stfLuz > 0.3} brilho={stfLuz} />
      <Martelo tema={tema} pos={soma(STF, [2.6, 0, 2.0])} escala={0.8 * stfK * (1 - rampa(t, T.importa, T.importa + 0.4))} bate={bate} rotY={-0.4} />
      <OrgaoPublico tema={tema} pos={PF} escala={0.85} sobe={Math.max(0.0, pfK * (1 - janela(t, T.q1 - 0.3, T.q5 + 1.6, 0.6)))} letreiro={pfK} porta={rampa(t, T.inquerito, T.inquerito + 0.8)} texto="PF" />
      {docVoaK > 0.02 ? <DocumentoGrande tema={tema} pos={docVoa} rot={[-0.3, 0.3, 0.2]} escala={0.45 * docVoaK} carimbo={1} /> : null}
      <Porta tema={tema} pos={soma(STF, [-2.3, 0, 1.4])} abertura={0} luz={0.35 * portaK} />
      {portaK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(STF, [-2.3, 0, 2.6 + 0.6 * naoEntra])} rotY={Math.PI * naoEntra} escala={0.7 * portaK} cor={mistura(tema.pessoa, tema.objeto, 0.3)} />
          <XMarca tema={tema} pos={soma(STF, [-2.3, 1.1, 1.6])} escala={0.45 * naoEntra * portaK} />
        </group>
      ) : null}
      {pastaK > 0.02 ? <PastaBets tema={tema} pos={pastaPos} rot={[0, 0.3, 0]} escala={0.9 * pastaK} /> : null}

      {/* Cena 3: as 5 perguntas, uma peça para cada, na frente da PF */}
      {qK[0] > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={[PERG[0] - 0.3, 0, PERG_Z]} rotY={1.2} escala={0.55 * qK[0]} cor={tema.objetoClaro} />
          <Boneco tema={tema} pos={[PERG[0] + 0.3, 0, PERG_Z]} rotY={-1.2} escala={0.55 * qK[0]} cor={tema.pessoa} />
        </group>
      ) : null}
      {qK[1] > 0.02 ? <CelularGigante tema={tema} pos={[PERG[1], 0, PERG_Z]} rot={[0, -0.15, 0]} escala={0.28 * qK[1]} tela={1} baloes={1} tarja={1} /> : null}
      {qK[2] > 0.02 ? <Minerio tema={tema} pos={[PERG[2], 0, PERG_Z]} k={qK[2]} /> : null}
      {qK[3] > 0.02 ? [0, 1, 2].map((i) => <Boneco key={i} tema={tema} pos={[PERG[3] - 0.35 + 0.35 * i, 0, PERG_Z - 0.15 * (i % 2)]} rotY={0.3 - 0.3 * i} escala={0.42 * qK[3]} cor={i === 1 ? tema.pessoa : tema.objetoClaro} />) : null}
      {qK[4] > 0.02 ? (
        <group position={[PERG[4], 0, PERG_Z]} scale={qK[4]}>
          <Caixa args={[0.7, 0.9, 0.5]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.45, 0]} />
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.2 + 0.2 * i, 0.95 + 0.06 * Math.sin(t * 3 + i), 0]} rotation={[Math.PI / 2, 0, t * (i % 2 ? 1.5 : -1.5)]}>
              <torusGeometry args={[0.12, 0.035, 8, 20]} />
              <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.3} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ) : null}
      {qK.map((k, i) =>
        k > 0.02 ? (
          <group key={i} position={[PERG[i], 0.04, PERG_Z + 0.75]} scale={k}>
            <Placa tema={tema} pos={[0, 0.2, 0]} rot={[-0.5, 0, 0]} larg={0.5} alt={0.4} linhas={[{t: String(i + 1), tam: 300, cor: qLuz[i] > 0.3 ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={qLuz[i] > 0.3 ? tema.acento : tema.objetoEscuro} />
          </group>
        ) : null,
      )}

      {/* Cena 4: a lei e a barreira */}
      {leiK > 0.02 ? <Caixa args={[1.6, 0.8, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(LEI, [0, 0.4, 0])} /> : null}
      <LivroLei tema={tema} pos={soma(LEI, [0, 0.82, 0])} escala={0.9 * leiK} abre={leiAbre} folha={leiAbre} capa={1} />
      {barK > 0.02 ? (
        <group position={soma(LEI, [2.0, 0, 0.8])} scale={barK}>
          <Caixa args={[0.12, 1.8, 2.2]} raio={0.03} cor={tema.objetoClaro} emissivo={0.15 * pulso(t, T.estrangeira + 0.3, 0.8)} position={[0, 0.9, 0]} />
          <XMarca tema={tema} pos={[0.12, 1.0, 0]} escala={0.45} />
        </group>
      ) : null}
      {barK > 0.02 && moedaVai > 0 ? <Moeda tema={tema} pos={moedaPos} r={0.22} rot={[Math.PI / 2, 0, t * 4]} brilho={0.3} /> : null}
      {anuncioK > 0.02 ? (
        <group position={mix(soma(LEI, [4.2, 0.9, -0.2]), soma(LEI, [2.6, 0.9, -0.2]), anuncioVai)} scale={anuncioK}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.1} alt={0.5} linhas={[{t: 'ANÚNCIO', tam: 230, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} />
        </group>
      ) : null}

      {/* Cena 5: o foro */}
      <Congresso tema={tema} pos={CONG} escala={0.3 * congK} aceso={congLuz} />
      <PredioColunas tema={tema} pos={STF2} aceso={janela(t, T.julgados, T.imunidade)} escala={0.75 * stf2K} />
      <Letreiro tema={tema} pos={soma(STF2, [0, 2.55 * stf2K, 0.9])} texto="STF" k={stf2K} larg={1.0} acento />
      <Seta tema={tema} pos={[32.6, 0.5, 1.4]} escala={0.6 * entra(t, T.julgados, 0.4) * (1 - rampa(t, T.imunidade, T.imunidade + 0.4))} cor={tema.acento} />
      {parK > 0.02
        ? [0, 1].map((i) => (
            <Boneco key={i} tema={tema} pos={[30.8 + 3.2 * anda + 0.0 * i, 0, 1.0 + 0.7 * i]} rotY={anda > 0 && anda < 1 ? Math.PI / 2 : 0.2} escala={0.6 * parK} cor={i ? tema.objetoClaro : tema.pessoa} pose={{passo: anda > 0 && anda < 1 ? Math.sin(t * 8 + i) : 0}} />
          ))
        : null}

      {/* Cena 6: a imunidade */}
      {imuK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={IMU} rotY={0.2} escala={0.75 * imuK} cor={tema.pessoa} />
          <Redoma tema={tema} pos={IMU} escala={1.3 * imuK} desce={desce} brilho={pulso(t, T.protege, 1.0)} />
          {['OPINIÃO', 'PALAVRA', 'VOTO'].map((n, i) => (
            <Letreiro key={n} tema={tema} pos={soma(IMU, [-0.75 + 0.75 * i, 1.75 + (i === 1 ? 0.25 : 0), 0.35])} texto={n} k={0.62 * fichasImu[i] * imuK} larg={1.2} acento brilho={pulso(t, [T.opiniao, T.palavra, T.voto][i], 0.8)} />
          ))}
          <Moeda tema={tema} pos={soma(IMU, [2.0, 0.6 + 0.08 * Math.sin(t * 3), 0.6])} r={0.28 * moedaImuK * imuK} rot={[Math.PI / 2, 0, 0.3]} />
          <Lupa tema={tema} pos={mix(soma(IMU, [3.2, 1.6, 1.2]), soma(IMU, [1.1, 1.3, 1.0]), lupaImu)} rot={[0.3, 0, 0.4]} escala={0.8 * entra(t, T.impede - 0.3, 0.4) * imuK} />
        </group>
      ) : null}

      {/* Cena 7: nenhum nome e a lista que não existe */}
      {docNomesK > 0.02 ? <Caixa args={[1.8, 0.6, 1.3]} raio={0.04} cor={tema.objetoEscuro} position={soma(NOMES, [0, 0.3, 0])} /> : null}
      <DocumentoGrande tema={tema} pos={soma(NOMES, [0, 0.66, 0])} rot={[-1.0, 0, 0]} escala={0.95 * docNomesK} />
      <Lupa tema={tema} pos={soma(NOMES, [0.4 * Math.sin(t * 1.3), 1.35, 0.25 + 0.15 * Math.cos(t * 1.3)])} rot={[0.5, 0, 0.2]} escala={0.8 * lupaNomes * (1 - rampa(t, T.lista, T.lista + 0.4))} />
      {listaK > 0.02 ? (
        <group>
          <PastaBets tema={tema} pos={soma(NOMES, [2.4, 0.05, 0.6])} rot={[0, -0.3, 0]} escala={1.1 * listaK} />
          <XMarca tema={tema} pos={soma(NOMES, [2.4, 0.8, 1.0])} escala={0.55 * xLista} />
        </group>
      ) : null}

      {/* Cena 8: o TSE, os degraus do processo e o mandato */}
      <PredioColunas tema={tema} pos={soma(TSE, [0, -3.4 * tseDesce, 0])} aceso={tseLuz} escala={1.1 * tseK} />
      <Letreiro tema={tema} pos={soma(TSE, [0, 3.35 * tseK, 1.0])} texto="TSE" k={tseK * (1 - tseDesce)} larg={1.1} acento={tseLuz > 0.3} brilho={tseLuz} />
      {DEGRAUS.map((x, i) =>
        degK[i] > 0.02 ? <Caixa key={i} args={[1.7, 0.18 + 0.18 * i, 1.2]} raio={0.04} cor={mistura(tema.objetoClaro, tema.objeto, 0.4)} position={[x, (0.18 + 0.18 * i) / 2, 1.4]} scale={[degK[i], degK[i], degK[i]]} /> : null,
      )}
      {carimboK > 0.02 ? (
        <group position={[CARIMBO_X, 0, 1.4]} scale={carimboK}>
          <Caixa args={[1.5, 0.75, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.375, 0]} />
          <Placa tema={tema} pos={[0, 0.76, 0]} rot={[-Math.PI / 2, 0, 0]} larg={1.3} alt={0.9} linhas={[{t: 'REGISTRO', tam: 190, cor: tema.objetoClaro, peso: 900}, {t: 'CANCELADO?', tam: 170, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} />
        </group>
      ) : null}
      {hojeK > 0.02 ? (
        <mesh position={[DEGRAUS[0] - 1.6, 0.3, 1.4]} scale={hojeK} castShadow>
          <sphereGeometry args={[0.26, 24, 16]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} roughness={0.5} />
        </mesh>
      ) : null}
      {mandK > 0.02 ? <Boneco tema={tema} pos={[CARIMBO_X + 2.0, 0, 1.2]} rotY={-0.4} escala={0.65 * mandK * (1 - rampa(t, T.caminho, T.caminho + 0.4))} cor={tema.pessoa} /> : null}

      {/* Cena 9: o caminho da ação penal */}
      {linhaK > 0.02 ? (
        <group>
          <Caixa args={[12 * linhaK, 0.06, 0.24]} raio={0.03} cor={tema.objetoClaro} position={[CAM_X[0] - 1.5 + 6 * linhaK, 0.04, 2.0]} sombra={false} />
          <mesh position={[bolaX, 0.32, 2.0]} castShadow>
            <sphereGeometry args={[0.24, 24, 16]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} roughness={0.5} />
          </mesh>
        </group>
      ) : null}
      {CAM_X.map((x, i) => (
        <MarcoAno key={i} tema={tema} pos={[x, 0, 1.4]} ano={['PF', 'PGR', 'STF', 'CONGRESSO'][i]} k={marcoK[i] * (1 - rampa(t, T.tribunais, T.tribunais + 0.4))} aceso={marcoAceso[i]} />
      ))}

      {/* Cena 10: a ação do Novo no TSE */}
      <PredioColunas tema={tema} pos={soma(TSE2, [0, -3.4 * tse2Desce, 0])} aceso={tse2Luz} escala={1.1 * tse2K} />
      <Letreiro tema={tema} pos={soma(TSE2, [0, 3.35 * tse2K, 1.0])} texto="TSE" k={tse2K * (1 - tse2Desce)} larg={1.1} acento={tse2Luz > 0.3} brilho={tse2Luz} />
      {acaoK > 0.02 ? <PastaBets tema={tema} pos={soma(TSE2, [-2.6, 0.05, 3.4])} rot={[0, 0.35, 0]} escala={1.1 * acaoK} /> : null}
      {n35K > 0.02
        ? [0, 1, 2, 3, 4].map((i) => (
            <DocumentoGrande key={i} tema={tema} pos={soma(TSE2, [-0.6 + 0.05 * Math.sin(i * 2), 0.06 + 0.1 * i, 3.6])} rot={[-Math.PI / 2, 0, 0.15 * Math.sin(i * 3)]} escala={0.4 * Math.max(0, Math.min(1, n35K * 5 - i))} />
          ))
        : null}
      <Porta tema={tema} pos={soma(TSE2, [1.4, 0, 3.0])} abertura={portaDef} luz={0.35 * entra(t, T.chamados - 0.2, 0.4)} />
      {cartaoK > 0.02 ? (
        <group>
          <Caixa args={[0.9, 0.7, 0.7]} raio={0.04} cor={tema.objetoEscuro} position={soma(TSE2, [3.2, 0.35, 3.4])} scale={[cartaoK, cartaoK, cartaoK]} />
          <CartaoBeneficio tema={tema} pos={soma(TSE2, [3.2, 1.05, 3.4])} rot={[0, -0.3, 0.1]} escala={0.9 * cartaoK} brilho={pulso(t, T.naoProibido, 1.0)} />
        </group>
      ) : null}

      {/* Cena 11: duas portas */}
      {PORTAS.map((x, i) =>
        portasK[i] > 0.02 ? (
          <group key={i}>
            <group position={[x, 0, 0]} scale={portasK[i]}>
              <Porta tema={tema} pos={[0, 0, 0]} abertura={abre[i]} luz={0.35 * abre[i]} />
              <Caixa args={[1.8, 2.6, 0.3]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.3, -0.25]} />
            </group>
            <Letreiro tema={tema} pos={[x, 2.75 * portasK[i], 0]} texto={i ? 'STF' : 'TSE'} k={portasK[i]} larg={1.1} acento brilho={abre[i]} />
          </group>
        ) : null,
      )}

      {/* Cena 12: os dois lados */}
      <BalancaJustica tema={tema} pos={BAL} escala={1.0 * balK} inclina={0} brilhoEsq={Math.max(pulso(t, T.nega, 1.0), pulso(t, T.criticos, 1.0))} brilhoDir={pulso(t, T.indicios, 1.0)} />

      {/* Cena 13: resumo, uma investigação de cada lado */}
      {RES.map((x, i) =>
        resK[i] > 0.02 ? (
          <group key={i}>
            <Caixa args={[1.6, 0.6, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[x, 0.3, 0.6]} scale={[resK[i], resK[i], resK[i]]} />
            <PastaBets tema={tema} pos={[x, 0.62, 0.6]} rot={[0, (i ? -1 : 1) * 0.25, 0]} escala={1.0 * resK[i]} />
          </group>
        ) : null,
      )}
      {resK[0] > 0.02 ? <Onda pos={[(RES[0] + RES[1]) / 2, 0.03, 0.6]} k={rampa(t, T.condenacao, T.condenacao + 1.4, (x) => x)} cor={tema.acento} raio={2.2} /> : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0.2, 1.6, 0], 3.6, 3.8, [0.15, 0.2, 1])], [T.celular, E([0.6, 1.5, 0.2], 4.4, 4.0, [0.05, 0.22, 1])], [T.li, E([1.6, 1.2, 0.4], 5.0, 3.8, [-0.05, 0.3, 1])], [T.mostrar, E(soma(DOC, [0, 0.9, 0]), 3.2, 3.0, [0, 0.5, 1])], [T.d27 - 0.1, E(soma(DOC, [0, 0.9, 0]), 3.0, 2.8, [0.04, 0.5, 1])]]},
  {ini: T.d27, chaves: [[T.d27, E(soma(STF, [0, 1.6, 1]), 6, 5, [0.15, 0.3, 1])], [T.mandou, E(soma(STF, [1.4, 1.4, 1.2]), 6.4, 4.8, [0.05, 0.32, 1])], [T.inquerito, E([12, 1.6, 0.6], 11, 6, [0, 0.4, 1])], [T.suspeita, E([12.4, 1.6, 0.6], 10.6, 6, [0, 0.4, 1])]]},
  {ini: T.suspeita, chaves: [[T.suspeita, E([12.4, 1.6, 0.6], 10.6, 6, [0, 0.4, 1])], [T.pedido, E([12.4, 1.6, 0.6], 10.6, 6, [0, 0.4, 1])]]},
  {ini: T.pedido, chaves: [[T.pedido, E(soma(STF, [-1.2, 1.4, 1.6]), 5.6, 4.4, [0.12, 0.3, 1])], [T.dinoNegou + 0.6, E(soma(STF, [-1.6, 1.2, 1.8]), 4.6, 3.8, [0.08, 0.3, 1])], [T.separado, E([11.6, 1.4, 1.0], 10, 5.4, [0, 0.4, 1])], [T.cinco - 0.1, E([12.4, 1.4, 1.0], 9.6, 5.2, [0, 0.4, 1])]]},
  {ini: T.cinco, chaves: [[T.cinco, E([15.5, 1.8, 0.4], 9.0, 6.0, [0, 0.42, 1])], [T.q1, E([PERG[0] + 0.3, 0.8, PERG_Z], 3.6, 2.8, [0.1, 0.35, 1])], [T.q2, E([PERG[1], 0.8, PERG_Z], 3.6, 2.8, [0.05, 0.35, 1])], [T.q3, E([PERG[2], 0.8, PERG_Z], 3.6, 2.8, [0, 0.35, 1])], [T.q4, E([PERG[3], 0.8, PERG_Z], 3.6, 2.8, [-0.05, 0.35, 1])], [T.q5, E([PERG[4], 0.8, PERG_Z], 3.6, 2.8, [-0.08, 0.35, 1])], [T.importa - 0.1, E([15.5, 1.2, 1.4], 8.0, 4.6, [0, 0.45, 1])]]},
  {ini: T.importa, chaves: [[T.importa, E(soma(LEI, [0.6, 1.0, 0]), 5.4, 4.0, [0.12, 0.35, 1])], [T.art17, E(soma(LEI, [0.2, 1.0, 0]), 3.6, 3.2, [0.05, 0.45, 1])], [T.proibe, E(soma(LEI, [1.6, 1.0, 0.6]), 5.4, 3.6, [0, 0.3, 1])], [T.disfarcada, E(soma(LEI, [2.4, 1.0, 0.4]), 5.0, 3.6, [-0.06, 0.3, 1])], [T.porqueSTF - 0.1, E(soma(LEI, [2.2, 1.0, 0.4]), 5.0, 3.6, [-0.08, 0.3, 1])]]},
  {ini: T.porqueSTF, chaves: [[T.porqueSTF, E([32.4, 1.6, -0.4], 10, 6, [0, 0.4, 1])], [T.membros, E(soma(CONG, [0.4, 1.6, 1]), 6.4, 5, [0.1, 0.35, 1])], [T.deputado, E([32.2, 1.2, 0.6], 8.4, 5, [0, 0.38, 1])], [T.foro, E([33.4, 1.4, 0.2], 7.2, 5, [-0.05, 0.38, 1])], [T.imunidade - 0.1, E([33.6, 1.4, 0.2], 7.0, 4.8, [-0.06, 0.38, 1])]]},
  {ini: T.imunidade, chaves: [[T.imunidade, E(soma(IMU, [0.4, 1.3, 0]), 4.6, 3.8, [0.1, 0.3, 1])], [T.opiniao, E(soma(IMU, [0.2, 1.4, 0]), 4.0, 3.6, [0.04, 0.3, 1])], [T.dinheiroNao, E(soma(IMU, [1.0, 1.2, 0.3]), 4.6, 3.6, [-0.04, 0.3, 1])], [T.detalhe - 0.1, E(soma(IMU, [1.3, 1.2, 0.3]), 4.8, 3.6, [-0.08, 0.3, 1])]]},
  {ini: T.detalhe, chaves: [[T.detalhe, E(soma(NOMES, [0, 1.0, 0.2]), 4.0, 3.4, [0.08, 0.55, 1])], [T.deOnde, E(soma(NOMES, [0, 1.0, 0.2]), 3.6, 3.2, [0, 0.6, 1])], [T.elegeu, E(soma(NOMES, [0.6, 1.0, 0.2]), 4.4, 3.6, [0, 0.5, 1])]]},
  {ini: T.elegeu, chaves: [[T.elegeu, E(soma(NOMES, [1.2, 1.0, 0.4]), 5.0, 3.8, [0, 0.4, 1])], [T.lista, E(soma(NOMES, [1.2, 1.0, 0.4]), 5.0, 3.8, [0, 0.4, 1])]]},
  {ini: T.lista, chaves: [[T.lista, E(soma(NOMES, [1.6, 0.9, 0.6]), 4.6, 3.6, [-0.05, 0.38, 1])], [T.podeAcabar - 0.1, E(soma(NOMES, [1.8, 0.9, 0.6]), 4.4, 3.4, [-0.08, 0.38, 1])]]},
  {ini: T.podeAcabar, chaves: [[T.podeAcabar, E(soma(TSE, [0, 1.6, 1.2]), 7, 5.6, [0.1, 0.35, 1])], [T.tse, E(soma(TSE, [1.0, 1.4, 2.0]), 8, 5.4, [0, 0.38, 1])], [T.soDepois, E([56.4, 0.8, 1.6], 8.4, 4.6, [0, 0.42, 1])], [T.hoje, E([53.6, 0.8, 1.6], 6.4, 4.0, [0.08, 0.4, 1])], [T.mandato - 0.3, E([59.6, 0.9, 1.4], 6.0, 3.8, [-0.06, 0.38, 1])], [T.caminho - 0.1, E([60.2, 0.9, 1.4], 5.6, 3.6, [-0.08, 0.38, 1])]]},
  {ini: T.caminho, chaves: [[T.caminho, E([69.5, 1.0, 1.6], 13, 5.8, [0, 0.5, 1])], [T.pfInv, E([CAM_X[0] + 0.4, 1.0, 1.6], 5.0, 3.6, [0.06, 0.42, 1])], [T.pgr, E([CAM_X[1], 1.0, 1.6], 5.0, 3.6, [0.03, 0.42, 1])], [T.stf, E([CAM_X[2], 1.0, 1.6], 5.0, 3.6, [-0.02, 0.42, 1])], [T.parlamentar, E([CAM_X[3], 1.0, 1.6], 5.0, 3.6, [-0.05, 0.42, 1])], [T.lula - 0.1, E([CAM_X[3] + 0.6, 1.0, 1.6], 5.0, 3.6, [-0.08, 0.42, 1])]]},
  {ini: T.lula, chaves: [[T.lula, E(soma(TSE2, [0, 1.6, 2.2]), 8.6, 6.0, [0.1, 0.38, 1])], [T.novo, E(soma(TSE2, [-1.6, 1.0, 3.2]), 5.0, 4.0, [0.08, 0.35, 1])], [T.n35, E(soma(TSE2, [-0.8, 0.8, 3.4]), 4.6, 3.6, [0.02, 0.4, 1])], [T.chamados, E(soma(TSE2, [1.0, 1.1, 3.0]), 4.8, 3.8, [-0.02, 0.35, 1])], [T.bolsa, E(soma(TSE2, [3.0, 1.0, 3.4]), 4.4, 3.6, [-0.06, 0.35, 1])], [T.tribunais - 0.1, E(soma(TSE2, [3.2, 1.0, 3.4]), 4.2, 3.4, [-0.08, 0.35, 1])]]},
  {ini: T.tribunais, chaves: [[T.tribunais, E([94, 1.4, 0.2], 7.4, 4.8, [0, 0.3, 1])], [T.abusoTSE, E([PORTAS[0] + 0.4, 1.3, 0.2], 5.0, 4.0, [0.06, 0.3, 1])], [T.crime, E([PORTAS[1] - 0.4, 1.3, 0.2], 5.0, 4.0, [-0.06, 0.3, 1])], [T.mesma, E([94, 1.4, 0.2], 7.8, 5.0, [0, 0.3, 1])], [T.lados - 0.1, E([94, 1.4, 0.2], 7.6, 4.8, [0, 0.3, 1])]]},
  {ini: T.lados, chaves: [[T.lados, E(soma(BAL, [0, 1.4, 0]), 5.0, 4.2, [0, 0.35, 1])], [T.nega, E(soma(BAL, [-0.8, 1.4, 0]), 4.6, 4.0, [0.08, 0.35, 1])], [T.dinoResp, E(soma(BAL, [0.8, 1.4, 0]), 4.6, 4.0, [-0.08, 0.35, 1])], [T.resumindo - 0.1, E(soma(BAL, [0, 1.4, 0]), 5.0, 4.2, [0, 0.35, 1])]]},
  {ini: T.resumindo, chaves: [[T.resumindo, E([109, 0.9, 0.6], 6.4, 4.2, [0, 0.42, 1])], [T.cta, E([109, 0.9, 0.6], 7.0, 4.6, [0, 0.45, 1])], [FIM, E([100, 2.4, 0], 26, 13, [0, 0.8, 1])]]},
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
  {a: T.mostrar, b: T.d27, texto: 'O QUE ESTÁ NA DECISÃO', destaque: true},
  {a: T.inquerito, b: T.suspeita, texto: 'INQUÉRITO NA POLÍCIA FEDERAL', destaque: true},
  {a: T.separado, b: T.cinco, texto: 'INVESTIGAÇÃO EM SEPARADO'},
  {a: T.proibe, b: T.disfarcada, texto: 'DINHEIRO ESTRANGEIRO: PROIBIDO', destaque: true},
  {a: T.foro, b: T.imunidade, texto: 'FORO NO STF', destaque: true},
  {a: T.impede, b: T.detalhe, texto: 'IMUNIDADE NÃO IMPEDE INVESTIGAÇÃO'},
  {a: T.naoCita, b: T.elegeu, texto: 'NENHUM DEPUTADO NOMEADO', destaque: true},
  {a: T.lista, b: T.podeAcabar, texto: 'ESSA LISTA NÃO EXISTE', destaque: true},
  {a: T.existeInv, b: T.mandato, texto: 'HOJE: SÓ INVESTIGAÇÃO', destaque: true},
  {a: T.tambem, b: T.d5, texto: 'TAMBÉM ESTÁ SENDO INVESTIGADO', destaque: true},
  {a: T.mesma, b: T.lados, texto: 'MESMA REGRA, OUTRA PORTA', destaque: true},
  {a: T.investDois, b: T.condenacao, texto: 'INVESTIGAÇÃO DOS DOIS LADOS'},
  {a: T.condenacao, b: T.cta, texto: 'CONDENAÇÃO: NENHUMA, ATÉ AGORA', destaque: true},
  {a: T.manda, b: T.segue, texto: 'MANDA PRA QUEM TE MANDOU O BOATO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.paginas, b: T.inquerito, texto: 'FONTE: STF · ADPF 1.178 · DECISÃO DE 27/10/2026'},
  {a: T.constituicao, b: T.disfarcada, texto: 'FONTE: CONSTITUIÇÃO, ART. 17, II'},
  {a: T.disfarcada, b: T.porqueSTF, texto: 'FONTE: LEI 9.096/95, ART. 31 · LEI 9.504/97, ART. 24'},
  {a: T.membros, b: T.foro, texto: 'FONTE: DECISÃO, P. 37 · CF, ARTS. 53 E 102'},
  {a: T.protege, b: T.detalhe, texto: 'FONTE: CONSTITUIÇÃO, ART. 53'},
  {a: T.preve, b: T.caminho, texto: 'FONTE: LEI 9.096/95, ART. 28'},
  {a: T.parlamentar, b: T.lula, texto: 'FONTE: CONSTITUIÇÃO, ART. 53, § 3º'},
  {a: T.aceitou, b: T.bolsa, texto: 'FONTE: TSE · AIJE 0603194-42.2026 · 05/11/2026'},
  {a: T.gilmar, b: T.tribunais, texto: 'FONTE: STF · DECISÃO DE 18/09/2026'},
  {a: T.nega, b: T.criticos, texto: 'FONTE: AGÊNCIA O GLOBO · 10/11/2026'},
  {a: T.criticos, b: T.presidente, texto: 'FONTE: CNN BRASIL · 23/09/2026'},
  {a: T.presidente, b: T.dinoResp, texto: 'FONTE: CNN BRASIL · 05/10/2026'},
  {a: T.dinoResp, b: T.resumindo, texto: 'FONTE: DECISÃO, PARÁGRAFO 32'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.cento, b: T.li, p: [0.1, -0.1, 1.0], texto: '"120 CASSADOS"?'},
  {a: T.paginas, b: T.d27, p: soma(DOC, [0, 1.5, 0]), texto: 'DECISÃO · 38 PÁGINAS', acento: true},
  {a: T.d27, b: T.mandou, p: soma(STF, [0, 3.9, 1]), texto: '27 DE OUTUBRO'},
  {a: T.pedido, b: T.dinoNegou, p: soma(STF, [-2.3, 2.6, 1.6]), texto: 'PEDIDO DO PT'},
  {a: T.dinoNegou + 0.3, b: T.separado, p: soma(STF, [-2.3, 2.6, 1.6]), texto: 'NÃO ENTRA NESTE PROCESSO'},
  {a: T.q1, b: T.q2, p: [PERG[0], 1.5, PERG_Z], texto: 'GRUPO AMERICANO × EMPRESÁRIOS', acento: true},
  {a: T.q2, b: T.q3, p: [PERG[1], 1.5, PERG_Z], texto: 'QUEM PAGOU OS ANÚNCIOS?', acento: true},
  {a: T.q3, b: T.q4, p: [PERG[2], 1.2, PERG_Z], texto: 'TERRAS RARAS', acento: true},
  {a: T.q4, b: T.q5, p: [PERG[3], 1.3, PERG_Z], texto: 'COM QUEM MAIS FALOU?', acento: true},
  {a: T.q5, b: T.importa, p: [PERG[4], 1.4, PERG_Z], texto: 'ALGORITMO DAS REDES', acento: true},
  {a: T.art17, b: T.proibe, p: soma(LEI, [0, 1.8, 0]), texto: 'ART. 17', acento: true},
  {a: T.estrangeira, b: T.porqueSTF, p: soma(LEI, [2.0, 2.1, 0.8]), texto: 'GOVERNO OU ENTIDADE ESTRANGEIRA'},
  {a: T.publicidade, b: T.porqueSTF, p: soma(LEI, [2.6, 1.4, -0.2]), texto: 'PUBLICIDADE PAGA TAMBÉM', acento: true},
  {a: T.membros, b: T.deputado, p: soma(CONG, [0, 2.2, 0]), texto: 'CONGRESSO'},
  {a: T.deputado, b: T.imunidade, p: [32.0, 1.5, 1.4], texto: 'DEPUTADO E SENADOR'},
  {a: T.dinheiroNao, b: T.detalhe, p: soma(IMU, [2.0, 1.1, 0.6]), texto: 'DINHEIRO: NÃO PROTEGE', acento: true},
  {a: T.naoCita, b: T.lista, p: soma(NOMES, [0, 1.9, 0]), texto: 'NOMES DE DEPUTADOS: 0', acento: true},
  {a: T.lista, b: T.podeAcabar, p: soma(NOMES, [2.4, 1.6, 0.6]), texto: '"LISTA DE CASSAÇÃO"'},
  {a: T.tse, b: T.soDepois, p: [CARIMBO_X, 1.4, 1.4], texto: 'SE FICAR PROVADO', acento: true},
  {a: T.proprio, b: T.hoje, p: [DEGRAUS[0], 1.0, 1.4], texto: 'PROCESSO PRÓPRIO'},
  {a: T.defesa, b: T.hoje, p: [DEGRAUS[1], 1.2, 1.4], texto: 'DEFESA'},
  {a: T.recurso, b: T.hoje, p: [DEGRAUS[2], 1.4, 1.4], texto: 'SEM MAIS RECURSO'},
  {a: T.hoje, b: T.mandato, p: [DEGRAUS[0] - 1.6, 0.9, 1.4], texto: 'HOJE: AQUI', acento: true},
  {a: T.mandato, b: T.caminho, p: [CARIMBO_X + 2.0, 1.6, 1.2], texto: 'MANDATO NÃO CAI SOZINHO', acento: true},
  {a: T.pfInv, b: T.pgr, p: [CAM_X[0], 2.4, 1.4], texto: 'INVESTIGA'},
  {a: T.pgr, b: T.stf, p: [CAM_X[1], 2.4, 1.4], texto: 'ACUSA OU ARQUIVA'},
  {a: T.stf, b: T.parlamentar, p: [CAM_X[2], 2.4, 1.4], texto: 'ACEITA OU NÃO'},
  {a: T.parlamentar, b: T.lula, p: [CAM_X[3], 2.4, 1.4], texto: 'PODE SUSPENDER', acento: true},
  {a: T.novo, b: T.n35, p: soma(TSE2, [-2.6, 1.2, 3.4]), texto: 'AÇÃO DO NOVO', acento: true},
  {a: T.abuso, b: T.n35, p: soma(TSE2, [-2.6, 1.7, 3.4]), texto: 'ABUSO DE PODER POLÍTICO'},
  {a: T.n35, b: T.chamados, p: soma(TSE2, [-0.6, 1.0, 3.6]), texto: '35 MEDIDAS E DECRETOS'},
  {a: T.pede, b: T.chamados, p: soma(TSE2, [-0.6, 1.5, 3.6]), texto: 'PEDE A CASSAÇÃO', acento: true},
  {a: T.chamados, b: T.bolsa, p: soma(TSE2, [1.4, 2.5, 3.0]), texto: 'CHAMADOS PARA A DEFESA'},
  {a: T.bolsa, b: T.naoProibido, p: soma(TSE2, [3.2, 1.7, 3.4]), texto: 'BOLSA FAMÍLIA +15,04%'},
  {a: T.naoProibido, b: T.tribunais, p: soma(TSE2, [3.2, 1.7, 3.4]), texto: 'CORREÇÃO: NÃO ERA PROIBIDO', acento: true},
  {a: T.abusoTSE, b: T.lados, p: [PORTAS[0], 3.4, 0], texto: 'ABUSO DE PODER NA ELEIÇÃO'},
  {a: T.crime, b: T.lados, p: [PORTAS[1], 3.4, 0], texto: 'CRIME COM PARLAMENTAR'},
  {a: T.nega, b: T.resumindo, p: soma(BAL, [-1.2, 2.3, 0]), texto: 'CAMPANHA: NEGA'},
  {a: T.criticos, b: T.resumindo, p: soma(BAL, [-1.2, 1.7, 0]), texto: 'CRÍTICOS: CAMINHO ESCOLHIDO'},
  {a: T.semSinal, b: T.resumindo, p: soma(BAL, [-1.2, 1.1, 0]), texto: 'TSE: SEM SINAL DE INTERFERÊNCIA'},
  {a: T.indicios, b: T.resumindo, p: soma(BAL, [1.2, 2.3, 0]), texto: 'DINO: HÁ INDÍCIOS', acento: true},
  {a: T.investDois, b: T.segue, p: [RES[0], 1.6, 0.6], texto: 'PL · FLÁVIO'},
  {a: T.investDois + 0.15, b: T.segue, p: [RES[1], 1.6, 0.6], texto: 'LULA · ALCKMIN'},
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
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>FATO, FONTE E OS DOIS LADOS</div>
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
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 190, Math.min(SEGURO.botoesX - 190, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/dino.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.d27, T.suspeita, T.pedido, T.cinco, T.importa, T.porqueSTF, T.imunidade, T.detalhe, T.elegeu, T.lista, T.podeAcabar, T.caminho, T.lula, T.tribunais, T.lados, T.resumindo].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.13}));
  s.push({t: T.cento, f: 'bip', v: 0.16});
  s.push({t: T.paginas, f: 'pop', v: 0.18});
  s.push({t: T.mandou + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.dinoNegou + 0.4, f: 'baque', v: 0.14});
  s.push({t: T.separado, f: 'whoosh', v: 0.14});
  [T.q1, T.q2, T.q3, T.q4, T.q5].forEach((t) => s.push({t, f: 'tique', v: 0.2}));
  s.push({t: T.art17, f: 'pop', v: 0.18});
  s.push({t: T.estrangeira + 0.3, f: 'baque', v: 0.18});
  s.push({t: T.publicidade + 0.4, f: 'baque', v: 0.14});
  s.push({t: T.julgados, f: 'pop', v: 0.16});
  s.push({t: T.foro, f: 'ding', v: 0.2});
  s.push({t: T.protege, f: 'subida', v: 0.16});
  [T.opiniao, T.palavra, T.voto - 0.25].forEach((t) => s.push({t, f: 'pop', v: 0.13}));
  s.push({t: T.dinheiroNao, f: 'bip', v: 0.16});
  s.push({t: T.naoCita, f: 'impacto', v: 0.18});
  s.push({t: T.existe - 0.4, f: 'baque', v: 0.2});
  s.push({t: T.tse, f: 'pop', v: 0.16});
  [T.proprio, T.defesa, T.recurso].forEach((t) => s.push({t, f: 'tique', v: 0.18}));
  s.push({t: T.hoje, f: 'ding', v: 0.2});
  [T.pfInv, T.pgr, T.stf, T.parlamentar].forEach((t) => s.push({t, f: 'tique', v: 0.2}));
  s.push({t: T.aceitou, f: 'pop', v: 0.18});
  s.push({t: T.n35, f: 'subida', v: 0.16});
  s.push({t: T.chamados, f: 'whoosh', v: 0.12});
  s.push({t: T.naoProibido, f: 'ding', v: 0.18});
  [T.abusoTSE, T.crime].forEach((t) => s.push({t, f: 'pop', v: 0.16}));
  s.push({t: T.mesma, f: 'ding', v: 0.2});
  [T.nega, T.criticos, T.dinoResp].forEach((t) => s.push({t, f: 'tique', v: 0.16}));
  s.push({t: T.condenacao, f: 'impacto', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.cento + 0.6, T.paginas + 0.6, T.mostrar + 1.0, T.mandou + 0.6, T.inquerito + 0.5, T.dinoNegou + 0.9, T.separado + 0.8,
  T.q1 + 1.2, T.q2 + 0.8, T.q3 + 0.8, T.q4 + 0.6, T.q5 + 0.8, T.art17 + 0.6, T.estrangeira + 0.4, T.publicidade + 0.5,
  T.membros + 0.6, T.julgados + 0.6, T.foro + 0.3, T.opiniao + 0.6, T.dinheiroNao + 0.5, T.impede + 0.6,
  T.naoCita + 0.8, T.existe + 0.2, T.tse + 0.6, T.recurso + 0.4, T.hoje + 0.8, T.mandato + 0.8,
  T.pgr + 0.6, T.parlamentar + 1.0, T.novo + 0.8, T.n35 + 1.0, T.chamados + 0.8, T.naoProibido + 0.8,
  T.abusoTSE + 0.8, T.crime + 0.8, T.mesma + 0.6, T.nega + 0.8, T.semSinal + 0.5, T.indicios + 0.5, T.condenacao + 0.6, T.manda + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const DinoPl: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={24} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
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
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Dino x PL" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['120 deputados', 'do PL', 'cassados?', 'O que é fato'];
export const CapaDinoPl: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.some((l) => l.length > 12) ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · DINO X PL`} t={1} troca={0} y={SEGURO.topo + 160} />
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
