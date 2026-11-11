import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CofreFGTS, Lupa} from '../../pecas';
import {
  CamaraVereadores,
  CopoPiso,
  EstacaoSaneamento,
  Escola,
  PilhasDinheiro,
  PostoSaude,
  Prefeitura,
  ReguaLimite,
  RuaServicos,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from '../orcamentoitabuna/pecas';
import {MesaEunapolis, PlacaInterrogacao, QuadraMini} from './pecas';
import {PALAVRAS} from './palavras';

// 025. orçamento de eunápolis (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda da série (cofre da prefeitura no meio, 1 pilha = R$ 5 milhões,
// 108 pilhas, morros e mata no fundo) e encaixa os dois trechos de mapa do Kit Mapas
// (projetos/025.../mapas/eunapolis.mp4, composição OrcamentoEunapolis do kit), com o MESMO relógio.
// SÓ DADOS DE EUNÁPOLIS: todo número vem do PDF do portal da transparência de Eunápolis (RREO 6º bim. 2025,
// RREO 6º bim. 2024 e RGF 3º quadr. 2025), com selo de página.
// Neutro: sem nome de prefeito nem partido.
// Plano: projetos/025. orçamento de eunápolis/plano.md.

export const FPS = 30;
const AUDIO_SEG = 142.0;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '025. orçamento de eunápolis';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
// atenção: o quando() tira vírgula, ponto e % ("45,7%" vira "457", "2.761" vira "2761"); por isso os trechos levam a palavra de antes
const quando = criarQuando(PALAVRAS);
const T = {
  n539: quando('gastou 539'),
  primeiro: quando('Primeiro de onde'),
  arrecadou: quando('arrecadou'),
  federal: quando('governo federal'),
  paraOnde: quando('para onde vai'),
  educ: quando('a educacao'),
  n189: quando('189'),
  fundamental: quando('Quase 7 de cada'),
  em2024: quando('Em 2024'),
  n170: quando('sido 170'),
  saude: quando('vem a saude'),
  n166: quando('166'),
  prev123: quando('previstos 123'),
  hosp: quando('E 6 de cada 10'),
  ruas: quando('As ruas'),
  n39: quando('com 39'),
  saneam: quando('o saneamento'),
  n30: quando('com 30'),
  adm: quando('A administracao da prefeitura'),
  n50: quando('com 50'),
  dobro: quando('Quase o dobro de assistencia'),
  juntos: quando('transporte juntos'),
  papel: quando('quase nao saiu'),
  amb: quando('O meio ambiente tinha'),
  n12: quando('12 milhoes previstos'),
  gastou3: quando('Gastou 3'),
  esporte: quando('o esporte e lazer'),
  n69: quando('69 mil'),
  n2761: quando('Gastou 2.761'),
  inteiro: quando('ano inteiro'),
  repara: quando('Agora repara'),
  nemAparece: quando('nem aparece'),
  municipio: quando('No municipio isso'),
  policia: quando('A policia'),
  camara: quando('Ja a Camara'),
  n17: quando('custou 17'),
  parte: quando('a parte que quase'),
  salarios: quando('Mais da metade do dinheiro'),
  n274: quando('274'),
  obras: quando('Ja obras'),
  n33: quando('receberam 33'),
  seis100: quando('6 reais em cada'),
  mesmo: quando('Mesmo assim'),
  n7: quando('falava em 7'),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  n457: quando('esta em 45,7'),
  alerta: quando('Abaixo do limite'),
  pisos: quando('E os pisos'),
  sauPrec: quando('A saude precisa'),
  n308: quando('Recebeu 30,8'),
  dobroMin: quando('O dobro do minimo'),
  eduPrec: quando('A educacao precisa'),
  n263: quando('Recebeu 26,3'),
  tribunal: quando('Quem analisa'),
  fimAno: quando('no fim do ano'),
  n11: quando('em 11 milhoes'),
  seu: quando('O dinheiro e seu'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'EUNÁPOLIS 2025'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.educ, 'EDUCAÇÃO'],
  [T.saude, 'SAÚDE'],
  [T.ruas, 'RUAS E SANEAMENTO'],
  [T.adm, 'ADMINISTRAÇÃO'],
  [T.papel, 'O QUE NÃO SAIU DO PAPEL'],
  [T.repara, 'SEGURANÇA × CÂMARA'],
  [T.parte, 'SALÁRIOS × OBRAS'],
  [T.lei, 'O TETO'],
  [T.pisos, 'OS PISOS'],
  [T.fimAno, 'A SOBRA'],
  [T.emQual, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+; morros e mata no fundo) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-6.3, 0, -1.6];
const PILHAS_EDU: V3 = [-4.5, 0, -0.5];
const PILHAS_EDU24: V3 = [-4.5, 0, 2.1];
const HOSP: V3 = [-1.6, 0, -5.6];
const PILHAS_SAU: V3 = [-2.0, 0, -3.6];
const PILHAS_SAU_PREV: V3 = [0.4, 0, -3.6];
const PREF: V3 = [2.8, 0, -5.4];
const PILHAS_ADM: V3 = [2.6, 0, -3.5];
const PILHAS_5: V3 = [4.4, 0, -3.3];
const SANEAM: V3 = [6.7, 0, -1.4];
const PILHAS_SAN: V3 = [5.0, 0, -0.6];
const RUA: V3 = [1.2, 0, 6.6];
const PILHAS_RUA: V3 = [1.0, 0, 4.9];
const PILHAS_AMB: V3 = [-5.4, 0, 4.4];
const ESPORTE: V3 = [-4.0, 0, 6.0];
const PILHAS_ESP: V3 = [-3.9, 0, 4.9];
const GUARDA: V3 = [6.4, 0, 2.2];
const CAMARA: V3 = [5.2, 0, 5.2];
const PILHAS_CAM: V3 = [3.7, 0, 3.9];
const PILHAS_SAL: V3 = [-1.5, 0, 0.6];
const PILHAS_OBR: V3 = [2.4, 0, 1.4];
const PILHAS_OBR_PREV: V3 = [3.8, 0, 1.4];
const REGUA: V3 = [0, 0, 0];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.4];
const ARVORES: V3[] = [
  [-7.0, 0, 3.2],
  [-6.4, 0, 5.4],
  [7.4, 0, 3.6],
  [-7.6, 0, 1.4],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 5 milhões) ----------
// 108 pilhas no anel em volta do cofre (539 milhões). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 30],
      [2.3, 30],
      [2.7, 22],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number};
const VOOS: Voo[] = [
  {n: 37.88, t: T.n189, centro: PILHAS_EDU, cols: 7, slots: 40, fim: T.fundamental},
  {n: 33.278, t: T.n166, centro: PILHAS_SAU, cols: 6, slots: 34, fim: T.hosp},
  {n: 7.885, t: T.n39, centro: PILHAS_RUA, cols: 4, slots: 8, fim: T.saneam},
  {n: 6.032, t: T.n30, centro: PILHAS_SAN, cols: 3, slots: 7, fim: T.adm},
  {n: 10.041, t: T.n50, centro: PILHAS_ADM, cols: 4, slots: 11, fim: T.dobro},
  // assistência 8,84 + cultura 10,95 + meio ambiente 2,99 + agricultura 1,36 + transporte 1,62 = 25,76 mi
  {n: 5.152, t: T.dobro + 0.3, centro: PILHAS_5, cols: 3, slots: 6, fim: T.papel},
  {n: 3.455, t: T.n17, centro: PILHAS_CAM, cols: 2, slots: 4, fim: T.parte},
];
const ROTAS = (() => {
  const livres = ANEL.map((_, i) => i);
  return VOOS.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(ANEL[a][0] - dest[j][0], ANEL[a][2] - dest[j][2]) - Math.hypot(ANEL[b][0] - dest[j][0], ANEL[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
})();
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

// o cofre e as pilhas das áreas saem de cena em "a parte que quase ninguém vê"; o cofre volta na sobra
const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.parte - 0.3, T.parte + 0.6)) + rampa(t, T.fimAno - 0.4, T.fimAno + 0.5) * (1 - rampa(t, T.emQual + 0.6, T.emQual + 1.4));

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const afunda = 0.9 * rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 1.2));
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.008, T.paraOnde + 0.5 + i * 0.008);
      const v = DO_VOO[i];
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.035;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        let n = nasce;
        const ultima = j === Math.ceil(voo.n) - 1;
        if (ultima) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = janela(t, voo.t, voo.fim, 0.4);
        let cor = k > 0.01 ? aceso(k) : ouro;
        // educação: as primeiras 25,8 pilhas (129 mi, o ensino fundamental) acendem
        if (v === 0 && j < 25.84) {
          const f = janela(t, T.fundamental, T.saude, 0.5);
          if (f > 0.01) cor = aceso(f);
        }
        // saúde: as primeiras 20 pilhas (99,9 mi, hospitais e atendimento especializado) ficam claras
        if (v === 1 && j < 19.98) {
          const f = janela(t, T.hosp, T.ruas, 0.5);
          if (f > 0.01) cor = claro(f);
        }
        solidas.push({p: desce(pos), n, cor});
        return;
      }
      const fora = rampa(t, T.parte - 0.4, T.parte + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: nasce * (1 - fora), cor: ouro});
    });
  }
  const someAreas = 1 - rampa(t, T.parte - 0.3, T.parte + 0.5);
  // educação: 2024 (170 mi), transparente ao lado
  if (t >= T.n170 - 0.2 && someAreas > 0.01) fantasmas.push(...encher(grade(PILHAS_EDU24, 34, 7), 33.974 * rampa(t, T.n170 - 0.2, T.n170 + 0.6) * (1 - rampa(t, T.saude, T.saude + 0.5)), ouro));
  // saúde: 123 previstos, transparentes ao lado dos 166 gastos
  if (t >= T.prev123 && someAreas > 0.01) fantasmas.push(...encher(grade(PILHAS_SAU_PREV, 25, 5), 24.537 * rampa(t, T.prev123, T.prev123 + 0.8) * (1 - rampa(t, T.hosp, T.hosp + 0.5)), ouro));
  // meio ambiente: 12,3 previstos (transparentes) e 3 gastos
  const ambK = vis(t, T.amb, T.repara);
  if (ambK > 0.01) {
    const pos = grade(PILHAS_AMB, 3, 3);
    fantasmas.push(...encher(pos, 2.465 * rampa(t, T.n12, T.n12 + 0.6) * ambK, ouro));
    if (t >= T.gastou3) solidas.push(...encher(pos, 0.598 * rampa(t, T.gastou3, T.gastou3 + 0.5) * ambK, aceso(janela(t, T.gastou3, T.esporte, 0.4))));
  }
  // esporte e lazer: 69 mil previstos e 2.761 reais gastos (uma lasca de moeda)
  const espK = vis(t, T.esporte, T.repara);
  if (espK > 0.01) {
    fantasmas.push({p: PILHAS_ESP, n: 0.0138 * rampa(t, T.n69, T.n69 + 0.5) * espK, cor: ouro});
    if (t >= T.n2761) solidas.push({p: PILHAS_ESP, n: 0.004 * rampa(t, T.n2761, T.n2761 + 0.4) * espK, cor: aceso(1)});
  }
  // "a parte que quase ninguém vê": o mesmo dinheiro, agora por tipo de gasto
  const tipoK = 1 - rampa(t, T.lei - 0.2, T.lei + 0.6);
  if (t >= T.n274 - 0.1 && tipoK > 0.01) solidas.push(...encher(grade(PILHAS_SAL, 55, 8), 54.825 * rampa(t, T.n274, T.n274 + 1.4) * tipoK, aceso(janela(t, T.n274, T.obras, 0.4))));
  if (t >= T.n33 - 0.1 && tipoK > 0.01) solidas.push(...encher(grade(PILHAS_OBR, 7, 3), 6.632 * rampa(t, T.n33, T.n33 + 0.8) * tipoK, aceso(janela(t, T.n33, T.lei, 0.4))));
  if (t >= T.n7 - 0.2 && tipoK > 0.01) fantasmas.push(...encher(grade(PILHAS_OBR_PREV, 2, 2), 1.48 * rampa(t, T.n7 - 0.2, T.n7 + 0.4) * tipoK, ouro));
  // a sobra do fim do ano: 11 milhões (2,2 pilhas) na frente do cofre
  const sobraK = rampa(t, T.n11 - 0.2, T.n11 + 0.5) * (1 - rampa(t, T.emQual + 0.6, T.emQual + 1.4));
  if (sobraK > 0.01) solidas.push(...encher(grade(PILHAS_SOBRA, 3, 3), 2.246 * sobraK, aceso(janela(t, T.n11, T.emQual + 0.6, 0.4))));
  return {solidas, fantasmas};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas} = pilhasEm(t, tema);
  const fora = 0.25 * rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.emQual + 0.6 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.pisos, T.pisos + 0.8));
  const nivel = 45.66 * rampa(t, T.n457 - 0.5, T.n457 + 0.6);
  const coposK = rampa(t, T.pisos + 0.3, T.pisos + 1.1) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  // o copo vai até 30%: a saúde (30,78%) enche o copo inteiro; o número exato fica no rótulo
  const nivelSau = 29.9 * rampa(t, T.sauPrec + 0.4, T.n308 + 0.4);
  const nivelEdu = 26.3 * rampa(t, T.eduPrec + 0.4, T.n263 + 0.4);
  const placaK = vis(t, T.nemAparece - 0.2, T.parte);
  const lupaK = vis(t, T.n2761 - 0.2, T.repara);

  return (
    <group>
      <MesaEunapolis tema={tema} />
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < T.parte ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n11, T.n11 + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.educ + 0.6), janela(t, T.n11, T.emQual, 0.5))} /> : null}

      <PilhasDinheiro pilhas={solidas} max={1500} />
      <PilhasDinheiro pilhas={fantasmas} max={700} opacidade={0.3} largura={1.12} />

      <Escola tema={tema} pos={ESCOLA} rotY={1.26} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.2} escala={1.1} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.ruas, 0.5), fim(1))} />
      <RuaServicos tema={tema} pos={RUA} rotY={0} sobe={predio(T.ruas)} luz={Math.max(janela(t, T.ruas, T.saneam, 0.5), fim(2))} caminhaoX={2.4 - 4.6 * rampa(t, T.ruas, T.ruas + 4.0)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.ruas))} />
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={-1.2} escala={0.6} sobe={predio(T.saneam)} aceso={Math.max(janela(t, T.saneam, T.adm, 0.5), fim(3))} />
      <Prefeitura tema={tema} pos={PREF} rotY={-0.3} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.papel, 0.5), fim(4))} />
      <QuadraMini tema={tema} pos={ESPORTE} rotY={0.55} sobe={predio(T.esporte)} aceso={janela(t, T.esporte, T.repara, 0.5)} />
      {lupaK > 0.02 ? <Lupa tema={tema} pos={soma(PILHAS_ESP, [0, 0.75, 0.3])} rot={[-0.9, 0, 0]} escala={0.45 * lupaK} /> : null}

      <PlacaInterrogacao tema={tema} pos={GUARDA} rotY={-0.9} escala={0.8 * placaK} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={-0.85} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(5))} />

      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />

      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.sauPrec, T.sauPrec + 0.5)} nivel={nivelSau} acima={rampa(t, T.n308, T.n308 + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduPrec, T.eduPrec + 0.5)} nivel={nivelEdu} acima={rampa(t, T.n263, T.n263 + 0.6)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0.2], 17, 11, [0, 1.3, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.paraOnde - 0.3,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.3, E([0, 0, 0.2], 16, 10.5, [0, 1.25, 1])],
      [T.educ - 0.2, E([0, 0, 0], 14.5, 9.5, [0.05, 1.2, 1])],
    ],
  },
  {
    ini: T.educ,
    arco: 0.04,
    chaves: [
      [T.educ, E([-4.8, 0.8, -0.4], 6.6, 4.8, [0.5, 0.95, 1])],
      [T.em2024, E([-4.6, 0.8, 0.6], 6.8, 5.4, [0.55, 0.95, 1])],
      [T.saude - 0.3, E([-4.6, 0.8, 0.6], 6.6, 5.2, [0.65, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-1.4, 0.9, -4.4], 6.4, 4.6, [0.25, 0.92, 1])],
      [T.prev123, E([-0.8, 0.9, -4.2], 7.0, 5.0, [0.12, 0.92, 1])],
      [T.ruas - 0.3, E([-0.9, 0.9, -4.2], 6.6, 4.8, [0.05, 0.92, 1])],
    ],
  },
  {
    ini: T.ruas - 0.1,
    arco: 0.04,
    chaves: [
      [T.ruas - 0.1, E([1.1, 0.7, 5.5], 6.0, 4.4, [0.1, 0.9, 1])],
      [T.saneam - 0.2, E([1.3, 0.7, 5.4], 5.6, 4.2, [0.2, 0.9, 1])],
      [T.saneam + 0.4, E([5.4, 0.8, -0.6], 6.0, 4.4, [-0.6, 0.9, 1])],
      [T.adm - 0.3, E([5.4, 0.8, -0.5], 5.6, 4.2, [-0.75, 0.9, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.04,
    chaves: [
      [T.adm - 0.1, E([2.9, 0.9, -4.2], 6.4, 4.6, [-0.1, 0.92, 1])],
      [T.dobro, E([3.4, 0.9, -4.0], 6.8, 4.8, [-0.25, 0.92, 1])],
      [T.papel - 0.3, E([3.4, 0.9, -4.0], 6.4, 4.6, [-0.35, 0.92, 1])],
    ],
  },
  {
    ini: T.papel - 0.1,
    arco: 0.04,
    chaves: [
      [T.papel - 0.1, E([-4.4, 0.6, 4.8], 6.4, 4.6, [0.4, 0.9, 1])],
      [T.esporte - 0.2, E([-4.4, 0.6, 5.0], 6.0, 4.4, [0.3, 0.9, 1])],
      [T.n2761 - 0.2, E([-3.9, 0.4, 5.0], 3.2, 2.6, [0.2, 0.85, 1])],
      [T.repara - 0.3, E([-3.9, 0.4, 5.0], 3.0, 2.4, [0.25, 0.85, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([6.0, 1.0, 2.6], 5.4, 4.2, [-0.55, 0.85, 1])],
      [T.camara - 0.2, E([5.6, 1.0, 3.2], 6.2, 4.6, [-0.5, 0.85, 1])],
      [T.camara + 0.5, E([4.6, 0.8, 4.2], 7.0, 5.0, [-0.3, 0.9, 1])],
      [T.parte - 0.3, E([4.6, 0.8, 4.2], 6.6, 4.8, [-0.2, 0.9, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0.4, 0.6, 0.8], 8.6, 6.0, [0, 1.0, 1])],
      [T.n274 + 0.6, E([0.4, 0.6, 0.8], 8.0, 5.6, [0.05, 1.0, 1])],
      [T.obras, E([1.6, 0.6, 1.0], 7.0, 5.0, [-0.1, 1.0, 1])],
      [T.lei - 0.3, E([1.8, 0.6, 1.0], 6.6, 4.8, [-0.2, 1.0, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 0.8, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.n457, E([0, 3.0, 0], 3.2, 7.2, [0.05, 0.28, 1])],
      [T.alerta + 0.4, E([0, 3.6, 0], 3.2, 5.0, [0.05, 0.25, 1])],
      [T.pisos - 0.2, E([0, 3.6, 0], 3.2, 4.8, [0.1, 0.25, 1])],
    ],
  },
  {
    ini: T.pisos - 0.1,
    arco: 0.04,
    chaves: [
      [T.pisos - 0.1, E([0, 1.9, 0], 6.4, 5.0, [0, 0.4, 1])],
      [T.fimAno - 0.3, E([0, 1.9, 0], 6.0, 4.8, [0.08, 0.4, 1])],
    ],
  },
  {
    ini: T.fimAno - 0.1,
    arco: 0.04,
    chaves: [
      [T.fimAno - 0.1, E([0, 0.8, 0.7], 5.0, 3.8, [0, 0.7, 1])],
      [T.emQual - 0.2, E([0, 0.8, 0.8], 4.6, 3.6, [0.1, 0.7, 1])],
    ],
  },
  {
    ini: T.emQual,
    chaves: [
      [T.emQual, E([0, 0, 0], 17, 10.5, [0, 1.3, 1])],
      [FIM, E([0, 0, 0], 18, 11, [0.3, 1.35, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.paraOnde + 0.3, b: T.educ, texto: 'PARA ONDE VAI O DINHEIRO'},
  {a: T.educ, b: T.fundamental, texto: 'A MAIOR FATIA'},
  {a: T.fundamental, b: T.em2024, texto: 'QUASE 7 DE CADA 10: ENSINO FUNDAMENTAL', destaque: true},
  {a: T.em2024, b: T.saude, texto: 'EM 2024: 170 MILHÕES'},
  {a: T.prev123, b: T.hosp, texto: 'PREVISTO 123 MI · GASTO 166 MI', destaque: true},
  {a: T.hosp, b: T.ruas, texto: '6 DE CADA 10: HOSPITAIS E ATENDIMENTO ESPECIALIZADO'},
  {a: T.ruas, b: T.saneam, texto: 'RUAS E SERVIÇOS DA CIDADE'},
  {a: T.saneam, b: T.adm, texto: 'SANEAMENTO'},
  {a: T.adm, b: T.dobro, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.dobro, b: T.papel, texto: 'QUASE O DOBRO DE 5 ÁREAS JUNTAS', destaque: true},
  {a: T.papel, b: T.amb, texto: 'QUASE NÃO SAIU DO PAPEL'},
  {a: T.amb, b: T.esporte, texto: 'MEIO AMBIENTE: PREVISTO × GASTO'},
  {a: T.esporte, b: T.n2761, texto: 'ESPORTE E LAZER: PREVISTO × GASTO'},
  {a: T.n2761, b: T.repara, texto: 'R$ 2.761 NO ANO INTEIRO', destaque: true},
  {a: T.repara, b: T.nemAparece, texto: 'AGORA REPARA'},
  {a: T.nemAparece, b: T.policia, texto: 'SEGURANÇA PÚBLICA: NEM APARECE NO RELATÓRIO', destaque: true},
  {a: T.policia, b: T.camara, texto: 'A POLÍCIA É DO ESTADO'},
  {a: T.camara, b: T.parte, texto: 'CÂMARA DE VEREADORES'},
  {a: T.parte, b: T.salarios, texto: 'A PARTE QUE QUASE NINGUÉM VÊ'},
  {a: T.salarios, b: T.obras, texto: 'SALÁRIOS E ENCARGOS: MAIS DA METADE', destaque: true},
  {a: T.obras, b: T.mesmo, texto: 'OBRAS E EQUIPAMENTOS: 6 EM CADA 100'},
  {a: T.mesmo, b: T.lei, texto: 'MAIS QUE O PREVISTO (7 MI)'},
  {a: T.lei, b: T.n457, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.alerta, b: T.pisos, texto: 'ABAIXO DO LIMITE DE ALERTA (48,6%)', destaque: true},
  {a: T.pisos, b: T.sauPrec, texto: 'OS PISOS DA LEI'},
  {a: T.dobroMin, b: T.eduPrec, texto: 'SAÚDE: O DOBRO DO MÍNIMO', destaque: true},
  {a: T.tribunal, b: T.fimAno, texto: 'QUEM ANALISA: TCM-BA'},
  {a: T.fimAno, b: T.seu, texto: 'RECEITAS − DESPESAS'},
  {a: T.seu, b: T.emQual, texto: 'O DINHEIRO É SEU', destaque: true},
];
// páginas do PDF do portal de Eunápolis (RREO 6º bim. 2025, RREO 6º bim. 2024, RGF 3º quadr. 2025)
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.n189, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE EUNÁPOLIS'},
  {a: T.n189, b: T.saude, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 5 (2024: RREO DEZ/2024 · P. 5)'},
  {a: T.saude, b: T.ruas, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 5'},
  {a: T.ruas, b: T.adm, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6'},
  {a: T.adm, b: T.papel, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4 A 6'},
  {a: T.papel, b: T.repara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6 (PREVISTO × GASTO)'},
  {a: T.repara, b: T.camara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4 A 7 (SEM A FUNÇÃO SEGURANÇA)'},
  {a: T.camara, b: T.parte, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4'},
  {a: T.parte, b: T.lei, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (PESSOAL E INVESTIMENTOS)'},
  {a: T.lei, b: T.pisos, texto: 'FONTE: RGF DEZ/2025 · PODER EXECUTIVO · P. 2'},
  {a: T.pisos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · ANEXO 14 · P. 38 E 39'},
  {a: T.fimAno, b: T.emQual, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 E 2'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n189, b: T.fundamental, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '189 MI', sub: 'R$ 189,40 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.fundamental + 0.4, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: '129 MI', sub: 'ENSINO FUNDAMENTAL · 68%', cor: 'acento'},
  {a: T.n170, b: T.saude, p: soma(PILHAS_EDU24, [0, 1.0, 0]), valor: '2024: 170 MI', sub: 'R$ 169,87 MI', dy: 120},
  {a: T.n166, b: T.hosp, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '166 MI', sub: 'R$ 166,39 MI · SAÚDE', cor: 'acento'},
  {a: T.prev123 + 0.3, b: T.hosp, p: soma(PILHAS_SAU_PREV, [0, 1.0, 0]), valor: 'PREVISTO: 123 MI', sub: 'SAÚDE', dy: 120},
  {a: T.hosp + 0.4, b: T.ruas, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '100 MI', sub: 'HOSPITAIS E ESPECIALIZADO · 60%', cor: 'acento'},
  {a: T.n39, b: T.adm, p: soma(PILHAS_RUA, [0, 1.0, 0]), valor: '39 MI', sub: 'R$ 39,43 MI · RUAS E SERVIÇOS', cor: 'acento'},
  {a: T.n30, b: T.adm, p: soma(PILHAS_SAN, [0, 1.0, 0]), valor: '30 MI', sub: 'R$ 30,16 MI · SANEAMENTO', cor: 'acento'},
  {a: T.n50, b: T.papel, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '50 MI', sub: 'R$ 50,20 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.dobro + 0.6, b: T.papel, p: soma(PILHAS_5, [0, 0.9, 0]), valor: '26 MI', sub: 'ASSIST. + CULTURA + AMBIENTE + AGRIC. + TRANSPORTE', dy: 120},
  {a: T.n12 + 0.3, b: T.esporte, p: soma(PILHAS_AMB, [0, 0.9, 0]), valor: 'PREVISTO: 12 MI', sub: 'MEIO AMBIENTE'},
  {a: T.gastou3, b: T.esporte, p: soma(PILHAS_AMB, [0, 0.6, 0.4]), valor: '3 MI', sub: 'R$ 2,99 MI · GASTO', cor: 'acento', dy: 120},
  {a: T.n69 + 0.2, b: T.repara, p: soma(PILHAS_ESP, [0, 0.5, 0]), valor: 'PREVISTO: 69 MIL', sub: 'ESPORTE E LAZER'},
  {a: T.n2761 + 0.3, b: T.repara, p: soma(PILHAS_ESP, [0, 0.3, 0.3]), valor: 'R$ 2.761', sub: 'GASTO NO ANO INTEIRO', cor: 'acento', dy: 120},
  {a: T.nemAparece, b: T.policia, p: soma(GUARDA, [0, 2.4, 0]), valor: 'SEGURANÇA PÚBLICA', sub: 'NÃO HÁ ESSA LINHA NO RELATÓRIO', cor: 'alerta'},
  {a: T.n17, b: T.parte, p: soma(PILHAS_CAM, [0, 1.0, 0]), valor: '17 MI', sub: 'R$ 17,27 MI · CÂMARA', cor: 'acento'},
  {a: T.n274, b: T.lei, p: soma(PILHAS_SAL, [0, 1.1, 0]), valor: '274 MI', sub: 'SALÁRIOS E ENCARGOS · 51%', cor: 'acento'},
  {a: T.n33, b: T.lei, p: soma(PILHAS_OBR, [0, 1.0, 0.2]), valor: '33 MI', sub: 'OBRAS E EQUIPAMENTOS', cor: 'acento', dy: 120},
  {a: T.n7, b: T.lei, p: soma(PILHAS_OBR_PREV, [0, 0.4, 0.4]), valor: 'PREVISTO: 7 MI', sub: 'R$ 7,40 MI', dy: -60},
  {a: T.n54, b: T.n457, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.alerta, b: T.pisos - 0.2, p: [-0.8, yRegua(48.6) + 0.2, 0], valor: '48,6%', sub: 'LIMITE DE ALERTA', dy: -40},
  {a: T.n308, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(29.9) + 0.3, 0.6]), valor: '30,8%', sub: 'SAÚDE · RREO 30,78% · MÍN. 15%', cor: 'acento'},
  {a: T.n263, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(26.3) + 0.3, 0.6]), valor: '26,3%', sub: 'EDUCAÇÃO · RREO 26,30% · MÍN. 25%', cor: 'acento'},
  {a: T.n11, b: T.emQual + 0.6, p: soma(PILHAS_SOBRA, [0, 0.9, 0]), valor: '11 MI', sub: 'R$ 11,23 MI · RECEITAS − DESPESAS', cor: 'acento'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.lei);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div
            style={{
              padding: '9px 16px',
              borderRadius: 11,
              background: tema.cartao,
              border: `2px solid ${seloAtual.destaque ? tema.acento : tema.cartaoBorda}`,
              fontFamily: MONO,
              fontSize: seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: tema.texto,
              whiteSpace: 'nowrap',
            }}
          >
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 5 MILHÕES</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.arrecadou ? 'FONTE: RREO DEZ/2025 · PREFEITURA DE EUNÁPOLIS · ANEXO 1 · P. 2' : 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 (RECEITAS)';
    const k = Math.min(entra(t, T.n539, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 18, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 210, Math.min(SEGURO.botoesX - 210, pj.x)), y: Math.max(640, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // rótulos que se encostam: um embaixo do outro (o mais antigo em cima)
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n48K = entra(t, T.n457, 0.5) * (1 - rampa(t, T.pisos - 0.3, T.pisos));
  const comentaK = vis(t, T.emQual, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 48 ? 17 : chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {numeroGrande('45,7%', 'PESSOAL · RGF 45,66%', n48K, tema.acento)}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>QUAL ÁREA PRECISA DE MAIS?</div>
            <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: rampa(t, T.comentarios, T.comentarios + 0.4)}}>COMENTA AQUI</div>
            {t >= T.segue ? <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 900, letterSpacing: -1, color: tema.acento, marginTop: 10, opacity: rampa(t, T.segue + 0.4, T.segue + 0.9)}}>@eumagnoleite</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/eunapolis.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  // mapa
  s.push({t: T.n539, f: 'pop', v: 0.22});
  s.push({t: quando('550'), f: 'pop', v: 0.22});
  s.push({t: quando('menos de 1 de cada'), f: 'pop', v: 0.18});
  s.push({t: quando('229'), f: 'pop', v: 0.2});
  s.push({t: quando('Mais que o dobro de todos'), f: 'ding', v: 0.16});
  // pilhas que deslizam: pop baixinho
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.035 + 0.6, f: 'pop', v: 0.07});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n189, T.n166, T.n39, T.n30, T.n50, T.n17, T.n274, T.n33].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  [T.n170, T.prev123, T.n12].forEach((t) => s.push({t, f: 'subida', v: 0.13}));
  s.push({t: T.gastou3 + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.n2761 + 0.3, f: 'baque', v: 0.22});
  s.push({t: T.nemAparece, f: 'bip', v: 0.18});
  s.push({t: T.n274 + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n7, f: 'pop', v: 0.16});
  // teto
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.n457 - 0.4, f: 'subida', v: 0.22});
  s.push({t: T.alerta, f: 'ding', v: 0.16});
  // pisos
  s.push({t: T.pisos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.n308, f: 'ding', v: 0.2});
  s.push({t: T.n263, f: 'ding', v: 0.18});
  // sobra
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n11, f: 'pop', v: 0.24});
  // fim
  for (let i = 0; i < 6; i++) s.push({t: T.emQual + 0.6 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 4.5, 10.0, 16.0, 20.0, 24.0, 28.6, 31.5, T.paraOnde + 0.8, T.n189 + 1.0, T.fundamental + 0.8, T.n170 + 0.6, T.n166 + 0.8, T.prev123 + 0.8, T.hosp + 1.0, T.n39 + 0.4, T.n30 + 0.4,
  T.n50 + 0.4, T.juntos, T.n12 + 0.4, T.gastou3 + 0.3, T.n69 + 0.4, T.n2761 + 1.2, T.nemAparece + 0.4, T.policia + 0.3, T.n17 + 0.4, T.salarios + 0.4, T.n274 + 1.2, T.n33 + 0.6, T.n7 + 0.3,
  T.n54 + 0.4, T.n457 + 0.6, T.alerta + 1.0, T.n308 + 0.4, T.n263 + 0.4, T.tribunal + 0.4, T.n11 + 0.6, T.seu + 0.4, T.emQual + 1.5, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoEunapolis: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = soMapa(t) ? null : (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={12} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
    </ThreeCanvas>
  );
  const mapas = (
    <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
      <TrechoMapa {...MAPA} />
    </Sequence>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Eunápolis" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['539 milhões.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoEunapolis: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO DE EUNÁPOLIS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
