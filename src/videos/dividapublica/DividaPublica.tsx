import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Moeda, Onda, Palco, Particulas, cinematizar, distancia, focarEm, mistura, projetar, trilhoCam, type Cam, type Foco, type V3} from '../../base/pecas';
import {Chip, Contador as ContadorBase, Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {cai, clamp, criarQuando, entra, k01, mola, pulso, rampa, sai, sumir} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {SERIE, temaPorId} from '../../estilo';
import {BalancaJustica, Barril, Cadeado, Carrinho, Engrenagem, EtiquetaPreco, Lupa, MarcoAno, PilhaMoedas, PlacaNome, Plateia, PredioColunas, Presente, Recibo, Redoma, Torneira} from '../../pecas';
import {BlocoPIB, CurvaSelic, FaixaGoverno, FaixaPIB, FitaChao, MesaCopom, MostradorSelic, TorreDivida} from './pecas';
import {PALAVRAS} from './palavras';

// 002. dívida pública (perfil @eumagnoleite, série Magno Explica).
// Países ricos devem mais; o que pesa no Brasil são os juros. Quem decide os juros e o debate (sem tomar lado).
// Mundo único: quatro torres da dívida com a faixa de 100% do PIB e as pilhas de juros na frente;
// o bloco do PIB e o placar juros x rombo à direita; o Banco Central, a mesa do Copom e o mostrador da Selic ao fundo;
// a linha do tempo da Selic no meio do caminho; a balança do debate na frente (cenas 6 e 7).
// Tudo entra na hora da palavra: tabela T logo abaixo (plano: projetos/002. dívida pública/plano.md).

export const FPS = 30;
const AUDIO_SEG = 101.73; // duração medida de projetos/002. dívida pública/audio/narracao-norm.wav
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '002. dívida pública';

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);

const T = {
  japao: quando('O Japão'),
  deve: quando('deve quase'),
  dobro: quando('quase o dobro'),
  produz: quando('tudo que produz'),
  paga: quando('E paga'),
  menos: quando('muito menos'),
  menosJuros: quando('menos juros'),
  brasil1: quando('que o Brasil'),
  entao: quando('Então por que'),
  assusta: quando('assusta'),
  calma: quando('Calma'),
  divida: quando('Dívida pública'),
  governoDeve: quando('o governo deve'),
  comparado: quando('comparado'),
  aoPib: quando('ao PIB'),
  tudoPais: quando('tudo que o país'),
  numAno: quando('num ano'),
  fmi: quando('Pelo FMI'),
  eua1: quando('Estados Unidos'),
  p127: quando('127%'),
  italia: quando('Itália'),
  p138: quando('138%'),
  brasil2: quando('Brasil', 2),
  p97: quando('97%'),
  ricos: quando('Países ricos'),
  devemMais: quando('devem mais'),
  repara: quando('Agora repara'),
  cadaUm: quando('cada um paga'),
  jurosPor: quando('de juros por'),
  porAno: quando('por ano'),
  japao2: quando('Japão', 2),
  p15: quando('1,5%'),
  eua2: quando('Estados Unidos', 2),
  p4: quando('4%'),
  brasil3: quando('Brasil', 3),
  maisDe: quando('mais de'),
  p8: quando('8%'),
  em12: quando('Em 12'),
  tri118: quando('1,18'),
  trilhao: quando('trilhão'),
  soJuros: quando('só de juros'),
  rombo: quando('rombo'),
  contasDia: quando('nas contas do'),
  b82: quando('82'),
  bilhoes: quando('bilhões'),
  pesaram: quando('juros pesaram'),
  x14: quando('14'),
  vezes: quando('vezes mais'),
  decide: quando('E quem decide'),
  decideJuros: quando('decide os juros'),
  comite: quando('comitê'),
  bc1: quando('do Banco Central'),
  copom: quando('Copom'),
  taxa: quando('taxa'),
  selic1: quando('Selic'),
  desde: quando('Desde'),
  a2021: quando('2021'),
  bcTem: quando('Banco Central tem'),
  autonomia: quando('autonomia'),
  diretores: quando('diretores'),
  mandato: quando('mandato fixo'),
  selicChegou: quando('A Selic chegou'),
  s1375: quando('13,75%'),
  ago22: quando('agosto de 2022'),
  bolsonaro: quando('Bolsonaro'),
  comecou: quando('Começou a cair'),
  ago23: quando('agosto de 2023'),
  a2023: quando('2023'),
  lula: quando('Lula'),
  subiu: quando('subiu de novo'),
  s15: quando('até 15%'),
  a2025: quando('2025'),
  hoje: quando('Hoje'),
  voltou: quando('voltou a'),
  caindo: quando('está caindo'),
  cinco: quando('cinco cortes'),
  cortes: quando('cortes seguidos'),
  aqui: quando('E aqui'),
  economistas: quando('economistas'),
  dividem: quando('dividem'),
  uns: quando('Uns dizem'),
  juroAlto: quando('juro alto é o'),
  infla: quando('infla'),
  corta: quando('Corta o juro'),
  paraCrescer: quando('para de crescer'),
  outros: quando('Outros'),
  proprio: quando('próprio Banco'),
  juroEAlto: quando('juro é alto'),
  inflacao: quando('inflação'),
  desconfianca: quando('desconfiança'),
  arruma: quando('Arruma'),
  juroCai: quando('juro cai'),
  voce: quando('Pra você'),
  pesaMais: quando('pesa mais'),
  oJuroOu: quando('o juro ou'),
  gasto: quando('gasto'),
  meConta: quando('Me conta'),
  comentarios: quando('comentários'),
  segue: quando('segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'DÍVIDA PÚBLICA'],
  [T.divida, 'QUEM DEVE MAIS'],
  [T.repara, 'QUEM PAGA MAIS'],
  [T.decide, 'QUEM DECIDE'],
  [T.selicChegou, 'A SELIC NO TEMPO'],
  [T.aqui, 'DOIS LADOS'],
  [T.voce, 'E VOCÊ?'],
];

// ---------- Câmera ----------
const FOV = 30;
const pj = (p: V3, cam: Cam) => projetar(p, cam, W, H);
const SOBE = 60;
// Enquadra uma caixa (larg × alt) em volta do alvo, olhando na direção `dir`, dentro da faixa útil do Reels.
const enq = (alvo: V3, larg: number, alt: number, dir: V3 = [0, 0.5, 1], folga = 1.08): Cam => {
  const visivel = Math.max(alt / 0.48, larg / 0.47) * folga;
  const d = visivel / (2 * Math.tan((FOV * Math.PI) / 360));
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  return {pos: [alvo[0] + (dir[0] / n) * d, alvo[1] + (dir[1] / n) * d, alvo[2] + (dir[2] / n) * d], alvo, fov: FOV, sobe: SOBE};
};
// Direção pela órbita (graus): `az` 0 = de frente (z+), positivo = pela direita; `el` = ângulo acima do chão.
const D = (az: number, el: number): V3 => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
};
const vivo = (c: Cam, k: number, sentido = 1) => cinematizar(c, k, {lente: 1, arco: 0.07, grua: 0.025, sentido});

// ---------- Mapa do mundo (plano.md, seção 2) ----------
const ALT = (pct: number) => pct / 50; // 100% do PIB = 2 m
const Y_PIB = 0.12 + ALT(100);
const TORRES = [
  {nome: 'JAPÃO', x: -4.5, pct: 199.4},
  {nome: 'ITÁLIA', x: -1.5, pct: 137.9},
  {nome: 'EUA', x: 1.5, pct: 126.8},
  {nome: 'BRASIL', x: 4.5, pct: 97.0},
];
const JAPAO = TORRES[0];
const BRASIL = TORRES[3];
const Z_PILHA = 1.75;
const R_MOEDA = 0.34;
const PASSO = 0.07; // PASSO_MOEDA da PilhaMoedas
const PIB_A: V3 = [-6.6, 0, 0.3]; // ao lado do Japão (gancho)
const PIB_B: V3 = [6.8, 0, 0.3]; // ao lado do Brasil
const TORNEIRA: V3 = [BRASIL.x + 0.95, 0, Z_PILHA]; // girada: a bica cai sobre a pilha do Brasil
const PLACAR = {x: 9.0, z: 2.3, alt: 4.0};
const ALT_ROMBO = (PLACAR.alt * 82.1) / 1182.2;
const BC: V3 = [0, 0, -12.5];
const COPOM: V3 = [-3.6, 0, -8.8];
const MOSTRADOR: V3 = [3.6, 0, -8.8];
const LT = {z: -4.6, x0: -6.2, x1: 6.2};
// Linha do tempo da Selic: x pelo mês (0 = ago/2022), y pela taxa.
const xMes = (m: number) => -5.6 + m * (11.4 / 51);
const ySelic = (s: number) => 0.15 + (s - 8) * 0.42;
const DECISOES: [number, number][] = [
  [0, 13.75], [12, 13.25], [13.6, 12.75], [15, 12.25], [16.4, 11.75], [18, 11.25], [19.6, 10.75], [21.2, 10.5],
  [25.6, 10.75], [27.2, 11.25], [28.4, 12.25], [29.9, 13.25], [31.6, 14.25], [33.2, 14.75], [34.6, 15.0],
  [43.6, 14.75], [45, 14.5], [46.6, 14.25], [48.1, 14.0], [49.5, 13.75],
];
const PTS: [number, number][] = DECISOES.map(([m, s]) => [xMes(m), ySelic(s)]);
const X_HOJE = xMes(50.7);
const X_FIM_2022 = xMes(4.9);
const MARCOS = [
  {ano: '2022', m: 0},
  {ano: '2023', m: 12},
  {ano: '2024', m: 21.2},
  {ano: '2025', m: 34.6},
  {ano: '2026', m: 49.5},
];
// Faixas dos governos no chão, logo na frente dos marcos (iguais, neutras; o nome vai num chip 2D do mesmo tamanho)
const Z_GOV = LT.z + 1.9;
const GOV1: [number, number] = [-6.0, X_FIM_2022];
const GOV2: [number, number] = [X_FIM_2022, 6.2];
const BALANCA: V3 = [0, 0, 6.0];
const ESC_BAL = 1.25;
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
// Ponteiro do mostrador: Selic de 8% (0) a 16% (1)
const ponteiro = (s: number) => k01((s - 8) / 8);

// Selic mostrada (ponteiro e chips) e até onde a curva foi desenhada, em meses, presos à fala.
const mesCurva = (t: number) =>
  interpolate(
    t,
    [T.selicChegou, T.s1375 + 0.6, T.comecou, T.ago23 + 0.4, T.a2023 + 0.3, T.lula, T.subiu, T.s15 + 0.4, T.hoje, T.voltou + 0.9],
    [0, 0.6, 0.6, 12, 12.2, 21.4, 21.4, 34.8, 34.8, 50.7],
    clamp,
  );
const selicNoMes = (m: number) => {
  let s = DECISOES[0][1];
  for (const [mm, ss] of DECISOES) if (mm <= m + 1e-6) s = ss;
  return s;
};

// ---------- O mundo inteiro, animado pelo tempo ----------
const Mundo: React.FC<{tema: Tema; t: number; centro: V3; cam: Cam}> = ({tema, t, centro, cam}) => {
  const ouro = (tema.festa ?? ESCURO.festa!).dourado;

  // Torres
  const sobeTorre = (a: number, d = 1.1) => rampa(t, a, a + d, Easing.out(Easing.quad));
  const torres = [
    {...JAPAO, sobe: sobeTorre(T.japao, 1.4), brilho: 0},
    {...TORRES[1], sobe: sobeTorre(T.italia - 0.1, 0.8), brilho: 0},
    {...TORRES[2], sobe: sobeTorre(T.eua1 - 0.1, 0.8), brilho: 0},
    {
      ...BRASIL,
      sobe: sobeTorre(T.menosJuros, 0.9),
      // acesa no acento quando o assunto é o Brasil
      brilho: Math.max(rampa(t, T.divida, T.divida + 0.5) * sumir(t, T.fmi, 0.5), rampa(t, T.brasil2, T.brasil2 + 0.5) * sumir(t, T.repara, 0.5), 0.8 * rampa(t, T.infla, T.infla + 0.5) * sumir(t, T.voce, 0.5)),
    },
  ];
  // As torres desmontam enquanto a câmera visita o Banco Central e a linha da Selic, e voltam no debate
  const vis = k01(1 - rampa(t, T.decide - 0.1, T.decide + 0.9) + rampa(t, T.aqui, T.aqui + 1.2));
  const acima = rampa(t, T.devemMais, T.devemMais + 0.6) * sumir(t, T.repara, 0.6);
  const cresce = rampa(t, T.infla, T.infla + 0.6, sai);
  const pulsoBR = 0.5 * pulso(t, T.governoDeve, 1.2);
  const faixa = rampa(t, T.ricos - 0.1, T.ricos + 0.8, sai);

  // Bloco do PIB: nasce ao lado do Japão, voa por cima até o Brasil em "comparado"
  const pib = entra(t, T.deve, 0.6) * sumir(t, T.decide, 0.5);
  const voa = rampa(t, T.comparado - 0.2, T.aoPib, Easing.inOut(Easing.quad));
  const pibPos: V3 = (() => {
    const p = lerp(PIB_A, PIB_B, voa);
    return [p[0], 4.8 * Math.sin(Math.PI * voa), p[2]];
  })();
  const pibBrilho = 0.8 * pulso(t, T.aoPib, 1.4);
  const produto = (a: number) => entra(t, a, 0.5);

  // Pilhas de juros: primeiro no gancho (Japão e Brasil), depois de novo, uma a uma, na cena 3
  const recomeca = sumir(t, T.cadaUm, 0.45);
  const nJapao = rampa(t, T.paga, T.menos + 0.4) * recomeca + rampa(t, T.japao2, T.p15 + 0.3, Easing.linear) * (t > T.cadaUm + 0.45 ? 1 : 0);
  const nEua = rampa(t, T.eua2, T.p4 + 0.3, Easing.linear);
  const nBrasil = rampa(t, T.brasil1 - 0.1, T.brasil1 + 0.7) * recomeca + rampa(t, T.brasil3, T.p8 + 0.4, Easing.linear) * (t > T.cadaUm + 0.45 ? 1 : 0);
  const somePilhas = sumir(t, T.decide, 0.5);
  const brilhoPilhaBR = rampa(t, T.brasil1, T.brasil1 + 0.6) * recomeca + rampa(t, T.p8, T.p8 + 0.5) * sumir(t, T.decide, 0.5);

  // Torneira e placar
  const torneira = entra(t, T.tri118 - 0.4, 0.6) * sumir(t, T.decide, 0.5);
  const abre = rampa(t, T.tri118 - 0.2, T.tri118 + 0.5);
  const colA = rampa(t, T.tri118, T.trilhao + 0.5, Easing.out(Easing.cubic)) * sumir(t, T.decide, 0.5);
  const colB = entra(t, T.rombo, 0.5) * sumir(t, T.decide, 0.5);
  const yTopoBR = 0.06 + 2 * 8.28 * PASSO;

  // Banco Central, Copom e mostrador
  const bc = rampa(t, T.bc1 - 0.2, T.bc1 + 0.8, sai);
  const mesa = entra(t, T.comite, 0.6);
  const gente = 9 * rampa(t, T.comite + 0.2, T.copom + 0.4, Easing.linear);
  const diretores = 9 * rampa(t, T.diretores, T.diretores + 0.9, Easing.linear) * sumir(t, T.selicChegou, 0.6);
  const mostrador = entra(t, T.taxa - 0.1, 0.7);
  const redoma = rampa(t, T.autonomia - 0.1, T.autonomia + 0.9, Easing.inOut(Easing.quad)) * (1 - rampa(t, T.selicChegou - 0.3, T.selicChegou + 0.9, Easing.inOut(Easing.quad)));
  const m = mesCurva(t);
  const selicAgora = t < T.selic1 ? 8 : t < T.selicChegou ? 13.75 : selicNoMes(m);
  const ajusteDebate = -1.0 * rampa(t, T.corta, T.corta + 0.6) + 1.0 * rampa(t, T.juroEAlto, T.juroEAlto + 0.5) - 1.0 * rampa(t, T.juroCai, T.juroCai + 0.6);
  const valorPonteiro = ponteiro(selicAgora + (t > T.aqui ? ajusteDebate : 0) - 0.25 * rampa(t, T.caindo, T.caindo + 0.8) * (t < T.aqui ? 1 : 0));

  // Linha do tempo da Selic
  const lt = rampa(t, T.selicChegou - 0.1, T.selicChegou + 0.9);
  const progX = xMes(m);
  const degraus = rampa(t, T.cinco, T.cinco + 1.0, Easing.linear);
  const xDegrau = interpolate(degraus, [0, 1], [xMes(43.6), xMes(49.5)], clamp);
  const marco = (i: number) => {
    const a = [T.ago22, T.ago23, T.a2023 + 0.4, T.a2025, T.hoje][i];
    return {k: entra(t, a, 0.5), aceso: i === 4 ? rampa(t, T.voltou, T.voltou + 0.6) : 0.3 * rampa(t, a, a + 0.4)};
  };
  const gov1 = rampa(t, T.bolsonaro - 0.1, T.bolsonaro + 0.6);
  const gov2 = rampa(t, T.lula - 0.1, T.lula + 0.8);

  // Balança do debate
  const balanca = rampa(t, T.economistas - 0.1, T.economistas + 0.9, sai);
  const inclina =
    -0.75 * rampa(t, T.infla - 0.1, T.infla + 0.6, mola) +
    0.75 * rampa(t, T.juroEAlto - 0.1, T.juroEAlto + 0.6) +
    0.7 * rampa(t, T.desconfianca, T.desconfianca + 0.6, mola) -
    0.7 * rampa(t, T.juroCai - 0.1, T.juroCai + 0.7) +
    0.12 * Math.sin((t - T.pesaMais) * 4) * pulso(t, T.pesaMais, 1.6);
  const pilhaBal = entra(t, T.juroAlto, 0.5);
  const etiqueta = entra(t, T.inflacao, 0.5);
  const lupa = entra(t, T.desconfianca, 0.5);
  const recibo = entra(t, T.arruma - 0.1, 0.5);

  // Plateia nos cantos (cenas 6 e 7)
  const plateia = entra(t, T.dividem, 0.7);

  return (
    <>
      <Particulas t={t} centro={[centro[0], 2.5, centro[2]]} raio={10} n={50} />

      {/* Torres da dívida */}
      {torres.map((tr, i) => (
        <TorreDivida
          key={tr.nome}
          tema={tema}
          pos={[tr.x, 0, 0]}
          alt={ALT(tr.pct)}
          nome={tr.nome}
          sobe={tr.sobe * vis}
          brilho={Math.min(1, tr.brilho + (i === 3 ? pulsoBR : 0))}
          acima={i < 3 ? acima : 0}
          yLinha={Y_PIB}
          cresce={i === 3 ? cresce : 0}
        />
      ))}
      <FaixaPIB tema={tema} x0={-5.7} x1={5.7} y={Y_PIB} k={faixa * sumir(t, T.repara, 0.6)} brilho={pulso(t, T.devemMais, 1.2)} />

      {/* Bloco do PIB com os produtos em cima */}
      <BlocoPIB tema={tema} pos={pibPos} k={pib} brilho={pibBrilho}>
        <Carrinho tema={tema} pos={[-0.35, 0, 0.3]} rotY={0.4} escala={0.45 * produto(T.produz)} />
        <Engrenagem tema={tema} pos={[0.35, 0.3, -0.2]} rot={[0, -0.3, 0]} r={0.28} giro={t * 0.6} escala={produto(T.produz + 0.2)} />
        <Barril tema={tema} pos={[0.4, 0, 0.35]} escala={0.45 * produto(T.produz + 0.35)} />
        <Presente tema={tema} pos={[-0.4, 0, -0.35]} escala={0.5 * produto(T.tudoPais)} laco={0} />
      </BlocoPIB>

      {/* Pilhas de juros (dourado; a do Brasil acende no acento) */}
      <PilhaMoedas tema={tema} pos={[JAPAO.x, 0, Z_PILHA]} n={2 * 1.49 * nJapao} cor={ouro} r={R_MOEDA} escala={somePilhas} />
      <PilhaMoedas tema={tema} pos={[TORRES[2].x, 0, Z_PILHA]} n={2 * 3.95 * nEua} cor={ouro} r={R_MOEDA} escala={somePilhas} />
      <PilhaMoedas tema={tema} pos={[BRASIL.x, 0, Z_PILHA]} n={2 * 8.28 * nBrasil} cor={mistura(ouro, tema.acento, brilhoPilhaBR)} r={R_MOEDA} brilho={0.4 * brilhoPilhaBR} escala={somePilhas} />

      {/* Torneira dos juros pingando moedas sobre a pilha do Brasil */}
      <group position={TORNEIRA} rotation={[0, -Math.PI / 2, 0]}>
        <Torneira tema={tema} pos={[0, 0, 0]} abre={abre} k={torneira} brilho={abre} />
      </group>
      {torneira > 0.5 && abre > 0.3
        ? Array.from({length: 5}).map((_, i) => {
            const f = ((t - T.tri118) * 0.9 + i / 5) % 1;
            if (f < 0) return null;
            const y = 3.0 - f * (3.0 - yTopoBR);
            return <Moeda key={i} tema={tema} pos={[BRASIL.x, y, Z_PILHA]} rot={[0.4 * i, f * 6, 0.3]} r={0.16} cor={ouro} escala={k01(f * 8) * k01((1 - f) * 8) * torneira} />;
          })
        : null}

      {/* Placar: coluna dos juros (acento) x coluna do rombo, e as 14 cópias do rombo */}
      {colA > 0.01 || colB > 0.02 ? (
        <group position={[PLACAR.x, 0, PLACAR.z]}>
          <Caixa args={[2.6, 0.12, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[0.35, 0.06, 0]} />
          {colA > 0.01 ? <Caixa args={[0.9, PLACAR.alt * colA, 0.9]} raio={0.06} cor={tema.acento} emissivo={0.2} position={[-0.4, 0.12 + (PLACAR.alt * colA) / 2, 0]} /> : null}
          {Array.from({length: 14}).map((_, j) => {
            const k = j === 0 ? colB : rampa(t, T.x14 + j * 0.05, T.x14 + j * 0.05 + 0.25, cai) * sumir(t, T.decide, 0.5);
            if (k < 0.02) return null;
            const y = 0.12 + j * ALT_ROMBO + (ALT_ROMBO - 0.015) / 2 + (j === 0 ? 0 : 0.8 * (1 - k));
            return <Caixa key={j} args={[0.9, ALT_ROMBO - 0.015, 0.9]} raio={0.03} cor={mistura(tema.objeto, tema.objetoClaro, 0.2)} position={[1.1, y, 0]} scale={j === 0 ? [1, k, 1] : 1} />;
          })}
        </group>
      ) : null}

      {/* Banco Central, Copom e mostrador da Selic */}
      {bc > 0.01 ? (
        <group position={[BC[0], -4.2 * (1 - bc), BC[2]]}>
          <PredioColunas tema={tema} pos={[0, 0, 0]} aceso={0.3 * pulso(t, T.bc1, 1.2)} escala={1.5} />
        </group>
      ) : null}
      <PlacaNome tema={tema} pos={[BC[0], 0.75, BC[2] + 2.4]} texto="BANCO CENTRAL" brilho={rampa(t, T.bc1 + 0.2, T.bc1 + 0.7) * (1 - 0.4 * rampa(t, T.aqui, T.aqui + 0.5))} escala={0.62 * entra(t, T.bc1 + 0.1, 0.6)} />
      {redoma > 0.01 ? <Redoma tema={tema} pos={BC} escala={5.2} desce={redoma} brilho={0.4 * pulso(t, T.autonomia + 0.6, 1.2)} /> : null}
      <MesaCopom tema={tema} pos={COPOM} k={mesa} gente={gente} luz={diretores} />
      <Cadeado tema={tema} pos={[COPOM[0], 1.35, COPOM[2] + 0.6]} k={0.55 * entra(t, T.mandato, 0.5) * sumir(t, T.selicChegou, 0.5)} fecha={rampa(t, T.mandato + 0.3, T.mandato + 0.7)} />
      <MostradorSelic tema={tema} pos={MOSTRADOR} k={mostrador} valor={valorPonteiro} brilho={rampa(t, T.selic1, T.selic1 + 0.4)} rotY={-0.25} />

      {/* Linha do tempo da Selic */}
      <FitaChao tema={tema} x0={LT.x0} x1={LT.x1} z={LT.z + 0.4} k={lt} />
      <CurvaSelic tema={tema} pts={PTS} z={LT.z} prog={t > T.selicChegou ? progX : -99} xFim={X_HOJE} acesos={[xMes(43.6), xDegrau]} brilho={degraus * sumir(t, T.aqui, 0.6)} />
      {MARCOS.map((mc, i) => {
        const s = marco(i);
        return <MarcoAno key={mc.ano} tema={tema} pos={[xMes(mc.m), 0, LT.z + 1.3]} ano={mc.ano} k={0.5 * s.k} aceso={s.aceso} />;
      })}
      <FaixaGoverno tema={tema} x0={GOV1[0]} x1={GOV1[1]} z={Z_GOV} k={gov1} texto="" xPlaca={0} />
      <FaixaGoverno tema={tema} x0={GOV2[0]} x1={GOV2[1]} z={Z_GOV} k={gov2} texto="" xPlaca={0} />

      {/* Balança do debate: JURO à esquerda, CONTAS à direita; os dois pratos neutros */}
      {balanca > 0.01 ? (
        <group position={[BALANCA[0], -4.5 * (1 - balanca), BALANCA[2]]}>
          <BalancaJustica
            tema={tema}
            pos={[0, 0, 0]}
            escala={ESC_BAL}
            inclina={inclina}
            esq={<PilhaMoedas tema={tema} pos={[0, 0.03, 0]} n={7 * pilhaBal} cor={ouro} r={0.32} escala={pilhaBal > 0.02 ? 1 : 0} />}
            dir={
              <>
                <EtiquetaPreco tema={tema} pos={[-0.25, 0.25, 0.1]} rot={[0, 0.3, 0.2]} escala={0.9 * etiqueta} />
                <Lupa tema={tema} pos={[0.25, 0.22, -0.05]} rot={[0.2, -0.4, 0.5]} escala={0.8 * lupa} />
                <Recibo tema={tema} pos={[0, 0.02, -0.4]} escala={0.35 * recibo} desenrola={rampa(t, T.arruma, T.arruma + 0.8)} />
              </>
            }
          />
        </group>
      ) : null}
      <Plateia tema={tema} cam={cam} px={190} py={1340} n={6} larg={300} k={plateia} cor={tema.pessoa} t={t} />
      <Plateia tema={tema} cam={cam} px={830} py={1340} n={6} larg={300} k={plateia} cor={tema.pessoa} t={t + 1.7} />

      {/* Ondas no chão nas viradas */}
      <Onda pos={[BRASIL.x, 0.02, Z_PILHA]} k={rampa(t, T.p8, T.p8 + 1.1, Easing.linear)} cor={tema.acento} raio={1.3} />
      <Onda pos={[PLACAR.x - 0.4, 0.02, PLACAR.z]} k={rampa(t, T.vezes, T.vezes + 1.2, Easing.linear)} cor={tema.acento} raio={1.8} />
      <Onda pos={[X_HOJE, 0.02, LT.z]} k={rampa(t, T.voltou + 0.6, T.voltou + 1.8, Easing.linear)} cor={tema.acento} raio={1.4} />
    </>
  );
};

// ---------- Câmeras de cada cena (plano.md, seção 4) ----------
type Cena = {ini: number; cam: (t: number, ini: number, fim: number) => Cam; foco?: (t: number, cam: Cam) => Foco};
const FIM = AUDIO_SEG + 0.9;
const C_FILEIRA = enq([0.6, 1.9, 0.4], 12.5, 4.6, D(22, 22));
const CENAS: Cena[] = [
  // 1. Gancho: o Japão de baixo para cima; depois Japão e Brasil, arco para a direita
  {
    ini: 0,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-5.0, 2.0, 0.4], 4.2, 4.6, D(-14, 12))],
          [T.produz, enq([-5.4, 2.2, 0.4], 4.6, 5.0, D(-8, 16))],
          [T.menosJuros + 0.2, enq([0, 1.7, 0.8], 11.4, 4.4, D(0, 18))],
          [b, enq([0, 1.7, 0.6], 11.0, 4.2, D(10, 24))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 6, 3),
  },
  // 2. Quem deve mais: Brasil e o PIB; depois a fileira vista da ponta do Brasil
  {
    ini: T.divida,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([5.6, 1.4, 0.3], 4.6, 3.6, D(30, 22))],
          [T.comparado, enq([5.8, 1.6, 0.3], 5.0, 3.8, D(34, 22))],
          [T.fmi - 0.1, enq([5.7, 1.4, 0.3], 4.4, 3.4, D(38, 22))],
          [T.eua1 + 0.4, C_FILEIRA],
          [b, enq([0.2, 2.0, 0.3], 12.8, 4.8, D(30, 25))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 7, 3),
  },
  // 3. Quem paga mais: as pilhas da esquerda para a direita; depois torneira e placar
  {
    ini: T.repara,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0, 1.0, 1.4], 11.4, 3.6, D(0, 30))],
          [T.japao2, enq([-1.6, 0.8, 1.6], 8.6, 3.0, D(-4, 32))],
          [T.eua2, enq([0, 0.8, 1.6], 9.6, 3.0, D(0, 32))],
          [T.brasil3, enq([1.6, 0.9, 1.6], 8.8, 3.0, D(4, 32))],
          [T.em12 + 0.3, enq([7.4, 2.0, 1.9], 8.0, 4.8, D(34, 20))],
          [T.x14, enq([8.8, 2.2, 2.2], 6.8, 5.4, D(36, 22))],
          [b, enq([9.0, 2.2, 2.2], 6.4, 5.4, D(40, 25))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 5, 3.5),
  },
  // 4. Quem decide: grua por cima das torres até o Banco Central; depois o prédio com a redoma
  {
    ini: T.decide,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0, 2.0, -3.0], 13, 6, D(10, 34))],
          [T.comite + 0.2, enq([0, 1.6, -9.8], 9.6, 4.4, D(4, 24))],
          [T.desde, enq([0, 1.7, -9.8], 9.2, 4.2, D(-4, 24))],
          [T.bcTem + 0.3, enq([0, 2.6, -11.8], 9.6, 6.4, D(-18, 20))],
          [b, enq([0, 2.6, -11.6], 9.2, 6.2, D(-24, 22))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 6, 3),
  },
  // 5. A Selic no tempo: travelling junto da ponta da curva; recua para a curva inteira
  {
    ini: T.selicChegou,
    cam: (t, a, b) => {
      const x = interpolate(xMes(mesCurva(t)), [-5.6, 5.8], [-3.6, 3.6], clamp);
      const segue = enq([x, 1.5, LT.z + 0.9], 7.2, 4.4, D(-4, 24));
      return vivo(
        trilhoCam(t, [
          [a, enq([-3.6, 1.5, LT.z + 0.9], 7.2, 4.4, D(-8, 24))],
          [T.s1375 + 0.2, segue],
          [T.hoje, segue],
          [T.cinco - 0.3, enq([0.2, 1.7, LT.z + 0.6], 12.8, 4.4, D(0, 22))],
          [b, enq([0.2, 1.7, LT.z + 0.6], 12.6, 4.4, D(6, 24))],
        ]),
        rampa(t, a, b),
      );
    },
    foco: (t, cam) => focarEm(cam, cam.alvo, 6, 3),
  },
  // 6. O debate: a balança na frente, as torres ao fundo
  {
    ini: T.aqui,
    cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([0, 2.2, BALANCA[2]], 7.4, 4.8, D(0, 26))], [T.economistas + 1.0, enq([0, 2.3, BALANCA[2]], 7.0, 4.6, D(-3, 26))], [b, enq([0, 2.3, BALANCA[2]], 6.6, 4.4, D(4, 25))]]), rampa(t, a, b)),
    foco: (t, cam) => focarEm(cam, [0, 2.3, BALANCA[2]], 3, 4.5),
  },
  // 7. E você? A balança no meio; grua para o mundo inteiro
  {
    ini: T.voce,
    cam: (t, a) => trilhoCam(t, [[a, enq([0, 2.3, BALANCA[2]], 7.4, 4.8, D(0, 27))], [T.segue, enq([0, 2.2, BALANCA[2]], 8.2, 5.0, D(0, 30))], [FIM, enq([0, 0.5, -3.5], 22, 20, D(0, 42))]]),
    foco: (t, cam) => (t < T.segue ? focarEm(cam, cam.alvo, 4, 3.5) : focarEm(cam, cam.alvo, distancia(cam.pos, cam.alvo) * 0.4, 3)),
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
const Contador: React.FC<{tema: Tema; k: number; valor: string; rotulo: string; y?: number; some?: number; destaque?: boolean}> = ({tema, k, valor, rotulo, y = 430, some = 1, destaque}) =>
  k <= 0 || some <= 0 ? null : (
    <div style={{position: 'absolute', inset: 0, opacity: some}}>
      <ContadorBase tema={tema} valor={valor} rotulo={rotulo} k={k} y={y} destaque={destaque} />
    </div>
  );
const Centro: React.FC<{y: number; children: React.ReactNode; some?: number}> = ({y, children, some = 1}) =>
  some <= 0 ? null : <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', gap: 14, opacity: some}}>{children}</div>;
// Chip pequeno preso a um ponto do 3D (número em cima de uma torre ou pilha).
const Marquinha: React.FC<{tema: Tema; cam: Cam; p: V3; texto: string; k: number; destaque?: boolean; tam?: number}> = ({tema, cam, p, texto, k, destaque, tam = 30}) => {
  if (k <= 0) return null;
  const q = pj(p, cam);
  if (!q.visivel) return null;
  return (
    <div style={{position: 'absolute', left: q.x - 150, top: q.y - 34, width: 300, display: 'flex', justifyContent: 'center'}}>
      <Chip tema={tema} texto={texto} k={k} destaque={destaque} tam={tam} />
    </div>
  );
};
// Selo da fonte: uma linha pequena acima da legenda, na hora em que o dado é dito.
const Selo: React.FC<{tema: Tema; t: number; a: number; b: number; texto: string}> = ({tema, t, a, b, texto}) => {
  const k = rampa(t, a, a + 0.4) * (1 - rampa(t, b - 0.4, b));
  if (k <= 0) return null;
  return (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: t > T.aqui ? 1120 : 1196, display: 'flex', justifyContent: 'flex-start', opacity: k}}>
      <div style={{padding: '8px 16px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 22, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>
        FONTE · {texto}
      </div>
    </div>
  );
};
// Balão pequeno de pensamento sobre a plateia de um canto.
const Balao: React.FC<{tema: Tema; x: number; y: number; texto: string; k: number}> = ({tema, x, y, texto, k}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: x - 130, top: y, width: 260, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.4), transform: `scale(${0.8 + 0.2 * Math.min(1, k)})`}}>
      <div style={{padding: '10px 18px', borderRadius: 26, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 24, fontWeight: 700, letterSpacing: 1.5, color: tema.texto, whiteSpace: 'nowrap'}}>{texto}</div>
    </div>
  );

const Interface: React.FC<{tema: Tema; t: number; cam: Cam; cena: number}> = ({tema, t, cam, cena}) => {
  const ap = (a: number) => rampa(t, a - 0.05, a + 0.5, Easing.linear);
  const fora = (a: number) => 1 - rampa(t, a - 0.35, a - 0.05, Easing.linear);
  const topo = (x: number, pct: number, extra = 0.35): V3 => [x, 0.12 + ALT(pct) + extra, 0];
  const topoPilha = (x: number, pct: number): V3 => [x, 2 * pct * PASSO + 0.35, Z_PILHA];
  if (cena === 0)
    return (
      <>
        <Centro y={440} some={fora(T.paga)}>
          <Chip tema={tema} texto="QUASE 2× O PIB" k={entra(t, T.dobro)} destaque tam={40} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={[JAPAO.x, -0.1, Z_PILHA + 1.0]} texto="JUROS DO JAPÃO" k={entra(t, T.menos) * fora(T.assusta)} tam={24} />
        <Marquinha tema={tema} cam={cam} p={[BRASIL.x, -0.1, Z_PILHA + 1.0]} texto="JUROS DO BRASIL" k={entra(t, T.brasil1 + 0.2) * fora(T.assusta)} destaque tam={24} />
        <Centro y={440}>
          <Chip tema={tema} texto="POR QUÊ?" k={entra(t, T.assusta)} tam={44} />
        </Centro>
      </>
    );
  if (cena === 1)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={topo(BRASIL.x, 97, 0)} x={X} y={470} titulo="Dívida pública" sub="O QUE O GOVERNO DEVE" destaque aparece={ap(T.divida)} some={fora(T.comparado + 0.4)} />
        <Rotulo tema={tema} cam={cam} p={[PIB_B[0], 2.0, PIB_B[2]]} x={X} y={470} titulo="PIB" sub="TUDO QUE O PAÍS PRODUZ NUM ANO" aparece={ap(T.aoPib)} some={fora(T.fmi)} />
        <Marquinha tema={tema} cam={cam} p={topo(TORRES[2].x, 126.8)} texto="127%" k={entra(t, T.p127)} destaque={t < T.italia} />
        <Marquinha tema={tema} cam={cam} p={topo(TORRES[1].x, 137.9)} texto="138%" k={entra(t, T.p138)} destaque={t < T.brasil2} />
        <Marquinha tema={tema} cam={cam} p={topo(BRASIL.x, 97)} texto="97%" k={entra(t, T.p97)} destaque />
        <Marquinha tema={tema} cam={cam} p={topo(JAPAO.x, 199.4)} texto="199%" k={entra(t, T.p97 + 0.3)} />
        <Centro y={440}>
          <Chip tema={tema} texto="DÍVIDA EM % DO PIB" k={entra(t, T.fmi) * fora(T.ricos)} tam={32} />
        </Centro>
        <Centro y={440}>
          <Chip tema={tema} texto="PAÍSES RICOS DEVEM MAIS" k={entra(t, T.ricos)} destaque tam={36} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={[-6.3, Y_PIB, 1.1]} texto="100% DO PIB" k={entra(t, T.ricos + 0.6)} tam={24} />
      </>
    );
  if (cena === 2) {
    const tri = (1.18 * rampa(t, T.tri118, T.trilhao + 0.4, sai)).toFixed(2).replace('.', ',');
    return (
      <>
        <Centro y={440} some={fora(T.em12)}>
          <Chip tema={tema} texto="JUROS POR ANO, % DO PIB" k={entra(t, T.porAno)} tam={32} />
        </Centro>
        <Marquinha tema={tema} cam={cam} p={topoPilha(JAPAO.x, 1.49)} texto="1,5%" k={entra(t, T.p15) * fora(T.em12)} />
        <Marquinha tema={tema} cam={cam} p={topoPilha(TORRES[2].x, 3.95)} texto="4%" k={entra(t, T.p4) * fora(T.em12)} />
        <Marquinha tema={tema} cam={cam} p={topoPilha(BRASIL.x, 8.28)} texto="+ DE 8%" k={entra(t, T.p8) * fora(T.em12)} destaque tam={36} />
        <Contador tema={tema} k={entra(t, T.tri118, 0.4)} valor={`R$ ${tri} TRI`} rotulo={t > T.soJuros ? 'SÓ DE JUROS · 12 MESES' : 'EM 12 MESES'} destaque some={fora(T.x14)} />
        <Rotulo tema={tema} cam={cam} p={[PLACAR.x + 1.1, 0.5, PLACAR.z]} x={X + 300} y={1000} titulo="R$ 82 bi" sub="CONTAS DO DIA A DIA, SEM JUROS" aparece={ap(T.b82)} some={fora(T.x14)} />
        <Centro y={1010} some={fora(T.b82) * (t < T.b82 ? 1 : 0)}>
          <Chip tema={tema} texto="O ROMBO" k={entra(t, T.rombo)} tam={32} />
        </Centro>
        <Contador tema={tema} k={entra(t, T.x14, 0.4)} valor="14×" rotulo="OS JUROS PESARAM MAIS" destaque />
      </>
    );
  }
  if (cena === 3)
    return (
      <>
        <Centro y={440} some={fora(T.comite + 0.6)}>
          <Chip tema={tema} texto="QUEM DECIDE?" k={entra(t, T.decideJuros - 0.3)} tam={42} />
        </Centro>
        <Rotulo tema={tema} cam={cam} p={[COPOM[0], 1.4, COPOM[2]]} x={X} y={470} titulo="Copom" sub="COMITÊ DO BANCO CENTRAL" aparece={ap(T.copom)} some={fora(T.desde)} />
        <Rotulo tema={tema} cam={cam} p={[MOSTRADOR[0], 2.5, MOSTRADOR[2]]} x={X + 330} y={1010} titulo="Selic" sub="A TAXA BÁSICA DE JUROS" destaque aparece={ap(T.selic1)} some={fora(T.bcTem)} />
        <Centro y={440}>
          <Chip tema={tema} texto="DESDE 2021" k={entra(t, T.a2021) * fora(T.autonomia)} tam={36} />
        </Centro>
        <Centro y={440}>
          <Chip tema={tema} texto="AUTONOMIA" k={entra(t, T.autonomia)} destaque tam={42} />
        </Centro>
        <Centro y={540}>
          <Chip tema={tema} texto="DIRETORES COM MANDATO FIXO" k={entra(t, T.mandato - 0.4)} tam={30} />
        </Centro>
      </>
    );
  if (cena === 4) {
    const m = mesCurva(t);
    const ponta: V3 = [xMes(m), ySelic(selicNoMes(m)) + 0.45, LT.z];
    const rotuloPonta = t < T.comecou ? '13,75% · AGO/2022' : t < T.a2023 + 0.3 ? '13,75% · AGO/2023' : t < T.subiu ? '10,50% · MAI/2024' : t < T.hoje ? '15% · JUN/2025' : '13,75% · SET/2026';
    const k = entra(t, T.s1375) * (1 - rampa(t, T.cinco - 0.4, T.cinco - 0.1));
    return (
      <>
        <Marquinha tema={tema} cam={cam} p={ponta} texto={rotuloPonta} k={k} destaque={t > T.voltou} tam={30} />
        <Marquinha tema={tema} cam={cam} p={[(GOV1[0] + GOV1[1]) / 2 + 0.6, 0, Z_GOV + 0.5]} texto="GOVERNO BOLSONARO" k={entra(t, T.bolsonaro)} tam={24} />
        <Marquinha tema={tema} cam={cam} p={[(GOV2[0] + GOV2[1]) / 2, 0, Z_GOV + 0.5]} texto="GOVERNO LULA" k={entra(t, T.lula)} tam={24} />
        <Centro y={440}>
          <Chip tema={tema} texto="5 CORTES SEGUIDOS" k={entra(t, T.cinco)} destaque tam={38} />
        </Centro>
        <Centro y={540}>
          <Chip tema={tema} texto="HOJE: 13,75%" k={entra(t, T.cortes + 0.2)} tam={30} />
        </Centro>
      </>
    );
  }
  if (cena === 5) {
    const esq = rampa(t, T.uns, T.uns + 0.4) * (1 - rampa(t, T.outros - 0.3, T.outros));
    const dir = rampa(t, T.outros, T.outros + 0.4) * (1 - rampa(t, T.voce - 0.3, T.voce));
    return (
      <>
        <Balao tema={tema} x={230} y={1040} texto="JURO ALTO" k={esq} />
        <Balao tema={tema} x={850} y={1040} texto="CONTAS" k={dir} />
        <Centro y={440} some={fora(T.outros)}>
          <Chip tema={tema} texto="CORTA O JURO → DÍVIDA PARA" k={entra(t, T.paraCrescer - 0.4)} tam={32} />
        </Centro>
        <Centro y={440} some={fora(T.juroCai - 0.1)}>
          <Chip tema={tema} texto="INFLAÇÃO" k={entra(t, T.inflacao)} tam={30} />
          <Chip tema={tema} texto="DESCONFIANÇA" k={entra(t, T.desconfianca)} tam={30} />
        </Centro>
        <Centro y={540} some={fora(T.juroCai - 0.1)}>
          <Chip tema={tema} texto="COMO O BANCO CENTRAL" k={entra(t, T.proprio)} tam={26} />
        </Centro>
        <Centro y={440}>
          <Chip tema={tema} texto="ARRUMA AS CONTAS → JURO CAI" k={entra(t, T.juroCai - 0.1)} tam={32} />
        </Centro>
      </>
    );
  }
  if (cena === 6)
    return (
      <>
        <Centro y={440} some={fora(T.segue)}>
          <Chip tema={tema} texto="JURO?" k={entra(t, T.oJuroOu)} tam={44} />
          <Chip tema={tema} texto="GASTO?" k={entra(t, T.gasto)} tam={44} />
        </Centro>
        <Centro y={550} some={fora(T.segue)}>
          <Chip tema={tema} texto="ME CONTA NOS COMENTÁRIOS" k={entra(t, T.meConta)} tam={28} />
        </Centro>
        {t > T.segue - 0.05 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4), transform: `translateY(${(1 - rampa(t, T.segue, T.segue + 0.5, mola)) * 30}px)`}}>
            <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE O PERFIL</div>
              <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.texto, marginTop: 6}}>{SERIE}</div>
            </div>
          </div>
        ) : null}
      </>
    );
  return null;
};

// Selos das fontes (plano.md, seção 2): um por dado.
const SELOS: {a: number; b: number; texto: string}[] = [
  {a: T.fmi, b: T.ricos, texto: 'FMI · DÍVIDA BRUTA, PREVISÃO 2026'},
  {a: T.jurosPor, b: T.em12, texto: 'FMI · JUROS PAGOS, 2024'},
  {a: T.em12 + 0.1, b: T.pesaram, texto: 'BANCO CENTRAL · 12 MESES ATÉ AGO/2026'},
  {a: T.pesaram, b: T.decide, texto: 'CONTA DO VÍDEO: 1.182 ÷ 82'},
  {a: T.desde, b: T.selicChegou, texto: 'LEI COMPLEMENTAR 179/2021'},
  {a: T.selicChegou, b: T.aqui, texto: 'BANCO CENTRAL · SÉRIE DA META SELIC'},
  {a: T.economistas, b: T.juroEAlto, texto: 'ECONOMISTAS NA AGÊNCIA BRASIL'},
  {a: T.juroEAlto, b: T.voce, texto: 'ATAS DO COPOM'},
];

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.28}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t, f: 'tique', v: 0.28}));
  [T.japao + 0.05, T.brasil1, T.eua1, T.p127, T.italia, T.p138, T.p97, T.p15, T.p4, T.p8, T.b82, T.copom, T.selic1, T.ago22, T.ago23, T.a2025, T.hoje, T.meConta].forEach((t) => s.push({t, f: 'pop', v: 0.3}));
  [T.menosJuros, T.tri118, T.subiu].forEach((t) => s.push({t, f: 'subida', v: 0.26}));
  [T.p15, T.p4, T.p8].forEach((t) => s.push({t: t - 0.6, f: 'tique', v: 0.18}));
  [T.taxa, T.selicChegou + 0.2, T.voltou].forEach((t) => s.push({t, f: 'bip', v: 0.24}));
  s.push({t: T.rombo, f: 'baque', v: 0.28});
  s.push({t: T.paraCrescer, f: 'baque', v: 0.24});
  s.push({t: T.x14 + 0.1, f: 'impacto', v: 0.4});
  [T.devemMais, T.vezes, T.autonomia, T.juroCai, T.segue].forEach((t) => s.push({t, f: 'ding', v: 0.34}));
  return s.filter((x) => x.t >= 0);
})();

// Som do vídeo: narração + efeitos do Estúdio. Toca na prévia com <Sons /> e é mixado pelo render.mjs.
// Para pôr uma trilha de fundo sua (sem direitos autorais): {arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1.3}.
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((s) => efeito(s.f, s.t, s.v))];

// Segundos dos quadros de revisão padrão (scripts/quadros.mjs): começo e meio de cada cena.
export const REVISAO: number[] = [
  0.8, T.dobro + 0.5, T.brasil1 + 0.8, T.aoPib + 0.4, T.p127 + 0.4, T.p97 + 0.6, T.devemMais + 0.6, T.p15 + 0.4, T.p8 + 0.5, T.trilhao + 0.4, T.b82 + 0.4, T.vezes + 0.4,
  T.comite + 0.8, T.selic1 + 0.4, T.autonomia + 0.9, T.s1375 + 0.6, T.bolsonaro + 0.4, T.lula + 0.4, T.s15 + 0.4, T.voltou + 1.0, T.cortes + 0.4,
  T.economistas + 1.0, T.infla + 0.6, T.desconfianca + 0.6, T.juroCai + 0.6, T.gasto + 0.4, T.segue + 1.5,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};

export const DividaPublica: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const foco = CENAS[i].foco ? CENAS[i].foco!(t, cam) : focarEm(cam, cam.alvo, Math.max(0.4, distancia(cam.pos, cam.alvo) * 0.3), 4);
  // Troca de cena: leve zoom e desfoque que somem em 0,35 a 0,7 s. Fim: escurece no último meio segundo.
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.35], [10, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={24} />
      <Camera {...cam} />
      <Mundo t={t} centro={cam.alvo} tema={tema} cam={cam} />
      <AcabamentoCinema foco={foco} raioAO={0.6} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} cam={cam} cena={i} tema={tema} />
      {SELOS.map((s) => (
        <Selo key={s.texto} tema={tema} t={t} a={s.a} b={s.b} texto={s.texto} />
      ))}
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
//   npx remotion still DividaPublicaLimpo "projetos/002. dívida pública/capa/fundo-limpo.jpg" --frame=NNN
// Título aprovado: 4 linhas de até 12 caracteres, a última no acento.
export const TITULO_CAPA = ['Japão deve', 'quase 2x.', 'Paga menos', 'juros. Como?'];

export const CapaDividaPublica: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 270}) => {
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
