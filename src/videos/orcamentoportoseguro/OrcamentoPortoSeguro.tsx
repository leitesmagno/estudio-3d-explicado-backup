import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Moeda, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CofreFGTS, Quepe} from '../../pecas';
import {
  BancoDivida,
  CamaraVereadores,
  CopoPiso,
  EstacaoSaneamento,
  Escola,
  PilhasDinheiro,
  PostoGuarda,
  PostoSaude,
  Prefeitura,
  ReguaLimite,
  TeatroMini,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from '../orcamentoitabuna/pecas';
import {Coqueiro, MesaPortoSeguro, QuiosqueTurismo} from './pecas';
import {PALAVRAS} from './palavras';

// 024. orçamento de porto seguro (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda da série (cofre da prefeitura no meio, 1 pilha = R$ 10 milhões,
// 115 pilhas, o mar e a praia ao fundo) e encaixa os dois trechos de mapa do Kit Mapas
// (projetos/024.../mapas/porto-seguro.mp4, composição OrcamentoPortoSeguro do kit), com o MESMO relógio.
// SÓ DADOS DE PORTO SEGURO: todo número vem do PDF do portal de Porto Seguro (RREO 6º bim. 2025 + RGF 3º quadr.
// 2025, Diário Oficial de 30/01/2026; RREO 6º bim. 2024 para as comparações), com selo de página.
// Neutro: sem nome de prefeito nem partido.
// Plano: projetos/024. orçamento de porto seguro/plano.md.

export const FPS = 30;
const AUDIO_SEG = 130.25;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '024. orçamento de porto seguro';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
// atenção: o quando() tira vírgula e % ("15,8%" vira "158", "54%" vira "54"); por isso os trechos levam a palavra de antes
const quando = criarQuando(PALAVRAS);
const T = {
  bilhao: quando('gastou 1 bilhao'),
  primeiro: quando('Primeiro de onde'),
  arrecadou: quando('arrecadou'),
  federal: quando('governo federal'),
  paraOnde: quando('para onde vai'),
  educ: quando('a educacao quase'),
  n400: quando('quase 400'),
  umDe3: quando('1 de cada 3'),
  saude: quando('vem a saude'),
  n195: quando('195'),
  prev150: quando('previstos 150'),
  adm: quando('A administracao da prefeitura'),
  n128: quando('128'),
  maisQue: quando('Mais que assistencia'),
  juntos: quando('ambiente juntos'),
  saneam: quando('O saneamento'),
  n85: quando('recebeu 85'),
  dobro: quando('Mais que o dobro do previsto'),
  turismo: quando('o turismo'),
  n15: quando('previstos 15'),
  n44: quando('Sairam 44'),
  triplo: quando('Quase o triplo'),
  repara: quando('Agora repara'),
  seg: quando('Na linha da seguranca'),
  zero: quando('mostra zero'),
  policiamento: quando('O policiamento'),
  n808: quando('808'),
  policia: quando('A policia'),
  camara: quando('E a Camara'),
  n26: quando('custou 26'),
  dezVezes: quando('10 vezes'),
  n26c: quando('ficou com 2,6'),
  parte: quando('a parte que quase'),
  salarios: quando('Quase metade do dinheiro'),
  n554: quando('554'),
  obras: quando('Ja obras'),
  n138: quando('138'),
  n12: quando('12 reais'),
  divida: quando('a divida levou'),
  n67: quando('67 milhoes'),
  em2024: quando('Em 2024'),
  n24: quando('sido 24'),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  n48: quando('esta em 48'),
  alerta: quando('Perto do limite'),
  pisos: quando('E os pisos'),
  eduPrec: quando('A educacao precisa'),
  n26p: quando('Recebeu 26'),
  sauPrec: quando('A saude precisa'),
  n158: quando('Recebeu 15,8'),
  pouco: quando('Passou por pouco'),
  tribunal: quando('Quem analisa'),
  fimAno: quando('no fim do ano'),
  n5: quando('em 5 milhoes'),
  seu: quando('O dinheiro e seu'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'PORTO SEGURO 2025'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.educ, 'EDUCAÇÃO'],
  [T.saude, 'SAÚDE'],
  [T.adm, 'ADMINISTRAÇÃO'],
  [T.saneam, 'SANEAMENTO'],
  [T.turismo, 'TURISMO'],
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

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+; mar e praia no fundo) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-6.3, 0, -1.6];
const PILHAS_EDU: V3 = [-4.5, 0, -0.5];
const MOEDAS3: V3 = [-3.9, 0, 1.6];
const HOSP: V3 = [-1.6, 0, -5.6];
const PILHAS_SAU: V3 = [-2.0, 0, -3.6];
const PILHAS_SAU_PREV: V3 = [0.1, 0, -3.6];
const PREF: V3 = [2.6, 0, -5.4];
const PILHAS_ADM: V3 = [2.4, 0, -3.5];
const PILHAS_4: V3 = [4.2, 0, -3.3];
const PILHAS_POL: V3 = [3.9, 0, -4.6];
const SANEAM: V3 = [6.7, 0, -1.4];
const PILHAS_SAN: V3 = [5.0, 0, -0.6];
const PILHAS_SAN_PREV: V3 = [5.0, 0, 0.9];
const TURISMO: V3 = [-6.8, 0, 2.4];
const PILHAS_TUR: V3 = [-5.1, 0, 2.3];
const PILHAS_TUR_PREV: V3 = [-5.1, 0, 3.6];
const GUARDA: V3 = [6.8, 0, 2.2];
const BONECO_G: V3 = [5.8, 0, 2.8];
const CAMARA: V3 = [5.2, 0, 5.2];
const PILHAS_CAM: V3 = [3.6, 0, 3.8];
const TEATRO: V3 = [1.2, 0, 6.6];
const PILHAS_CUL: V3 = [1.6, 0, 4.9];
const PILHAS_SAL: V3 = [-1.5, 0, 0.6];
const PILHAS_OBR: V3 = [2.3, 0, 1.4];
const PILHAS_DIV: V3 = [2.3, 0, -1.0];
const PILHAS_DIV24: V3 = [3.7, 0, -1.0];
const BANCO: V3 = [4.2, 0, -1.4];
const REGUA: V3 = [0, 0, 0];
const COPO_EDU: V3 = [-1.8, 0, 0];
const COPO_SAU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.4];
const ARVORES: V3[] = [
  [-7.6, 0, 4.6],
  [-3.0, 0, 7.8],
  [7.4, 0, 3.6],
];
// coqueiros na faixa de praia do fundo
const COQUEIROS: V3[] = [-60, -42, -24, -6, 12, 30, 48, 62].map((g) => {
  const a = ((180 + g) * Math.PI) / 180;
  return [Math.sin(a) * 7.3, 0.09, Math.cos(a) * 7.3];
});

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 10 milhões) ----------
// 115 pilhas no anel em volta do cofre (1,15 bilhão). Cada área leva as suas, em onda, na palavra do número.
const ANEL: V3[] = (() => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 30],
      [2.3, 30],
      [2.7, 29],
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
  {n: 39.948, t: T.n400, centro: PILHAS_EDU, cols: 7, slots: 42, fim: T.saude},
  {n: 19.493, t: T.n195, centro: PILHAS_SAU, cols: 5, slots: 20, fim: T.adm},
  {n: 12.753, t: T.n128, centro: PILHAS_ADM, cols: 4, slots: 13, fim: T.saneam},
  // assistência social 22,62 + cultura 2,57 + esporte 8,54 + meio ambiente 10,89 = 44,62 mi
  {n: 4.462, t: T.maisQue + 0.3, centro: PILHAS_4, cols: 3, slots: 6, fim: T.saneam},
  {n: 8.485, t: T.n85, centro: PILHAS_SAN, cols: 3, slots: 9, fim: T.turismo},
  {n: 4.368, t: T.n44, centro: PILHAS_TUR, cols: 3, slots: 6, fim: T.repara},
  {n: 2.619, t: T.n26, centro: PILHAS_CAM, cols: 2, slots: 3, fim: T.parte},
  {n: 0.257, t: T.n26c, centro: PILHAS_CUL, cols: 1, slots: 1, fim: T.parte},
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
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  // as pilhas das áreas afundam em "a parte que quase ninguém vê" e voltam no fim
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
        let k = janela(t, voo.t, voo.fim, 0.4);
        // educação: "1 de cada 3 reais" acende o grupo inteiro de novo
        if (v === 0) k = Math.max(k, 0.6 * janela(t, T.umDe3, T.saude, 0.4));
        solidas.push({p: desce(pos), n, cor: k > 0.01 ? aceso(k) : ouro});
        return;
      }
      // pilhas que ficam no anel: afundam com o cofre
      const fora = rampa(t, T.parte - 0.4, T.parte + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: nasce * (1 - fora), cor: ouro});
    });
  }
  const someAreas = 1 - rampa(t, T.parte - 0.3, T.parte + 0.5);
  // saúde: 150 previstos, transparentes ao lado dos 195 gastos
  if (t >= T.prev150 && someAreas > 0.01) fantasmas.push(...encher(grade(PILHAS_SAU_PREV, 16, 4), 15.047 * rampa(t, T.prev150, T.prev150 + 0.8) * (1 - rampa(t, T.adm, T.adm + 0.5)), ouro));
  // saneamento: 39 previstos
  if (t >= T.dobro && someAreas > 0.01) fantasmas.push(...encher(grade(PILHAS_SAN_PREV, 4, 2), 3.866 * rampa(t, T.dobro, T.dobro + 0.6) * (1 - rampa(t, T.turismo, T.turismo + 0.5)), ouro));
  // turismo: 15 previstos (aparecem antes dos 44 gastos)
  if (t >= T.n15 && someAreas > 0.01) fantasmas.push(...encher(grade(PILHAS_TUR_PREV, 2, 2), 1.518 * rampa(t, T.n15, T.n15 + 0.5) * (1 - rampa(t, T.repara, T.repara + 0.5)), ouro));
  // policiamento: 808 mil dentro da administração (uma fatia fininha de pilha)
  if (t >= T.n808 && someAreas > 0.01) solidas.push({p: PILHAS_POL, n: 0.0808 * rampa(t, T.n808, T.n808 + 0.4) * someAreas, cor: aceso(janela(t, T.n808, T.camara, 0.4))});
  // "a parte que quase ninguém vê": o mesmo dinheiro, agora por tipo de gasto
  const tipoK = 1 - rampa(t, T.lei - 0.2, T.lei + 0.6);
  if (t >= T.n554 - 0.1 && tipoK > 0.01) solidas.push(...encher(grade(PILHAS_SAL, 56, 8), 55.402 * rampa(t, T.n554, T.n554 + 1.4) * tipoK, aceso(janela(t, T.n554, T.obras, 0.4))));
  if (t >= T.n138 - 0.1 && tipoK > 0.01) solidas.push(...encher(grade(PILHAS_OBR, 14, 4), 13.834 * rampa(t, T.n138, T.n138 + 0.8) * tipoK, aceso(janela(t, T.n138, T.divida, 0.4))));
  if (t >= T.n67 - 0.1 && tipoK > 0.01) solidas.push(...encher(grade(PILHAS_DIV, 7, 3), 6.718 * rampa(t, T.n67, T.n67 + 0.6) * tipoK, aceso(janela(t, T.n67, T.lei, 0.4))));
  if (t >= T.n24 && tipoK > 0.01) fantasmas.push(...encher(grade(PILHAS_DIV24, 3, 3), 2.406 * rampa(t, T.n24, T.n24 + 0.5) * tipoK, ouro));
  // a sobra do fim do ano: meia pilha (5 milhões) na frente do cofre
  const sobraK = rampa(t, T.n5 - 0.2, T.n5 + 0.5) * (1 - rampa(t, T.emQual + 0.6, T.emQual + 1.4));
  if (sobraK > 0.01) solidas.push({p: PILHAS_SOBRA, n: 0.499 * sobraK, cor: aceso(janela(t, T.n5, T.emQual + 0.6, 0.4))});
  return {solidas, fantasmas};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam um pouco em "a parte que ninguém vê" e voltam no fim
  const fora = 0.25 * rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.emQual + 0.6 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const m3K = vis(t, T.umDe3 - 0.1, T.saude);
  const guardaK = vis(t, T.seg, T.parte);
  const bancoK = predio(T.divida) * (1 - rampa(t, T.lei - 0.2, T.lei + 0.6));
  // régua do teto
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.pisos, T.pisos + 0.8));
  const nivel = 48.16 * rampa(t, T.n48 - 0.5, T.n48 + 0.6);
  // copos dos pisos
  const coposK = rampa(t, T.pisos + 0.3, T.pisos + 1.1) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  const nivelEdu = 26.05 * rampa(t, T.eduPrec + 0.4, T.n26p + 0.4);
  const nivelSau = 15.79 * rampa(t, T.sauPrec + 0.4, T.n158 + 0.4);

  return (
    <group>
      <MesaPortoSeguro tema={tema} />
      {COQUEIROS.map((p, i) => (
        <Coqueiro key={i} tema={tema} pos={p} rotY={i * 1.3} escala={0.9 + 0.15 * (i % 3)} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < T.parte ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n5, T.n5 + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.educ + 0.6), janela(t, T.n5, T.emQual, 0.5))} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1500} />
      <PilhasDinheiro pilhas={fantasmas} max={700} opacidade={0.3} largura={1.12} />

      {/* educação: a escola e as 3 moedas do "1 de cada 3" */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.26} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.saude, 0.5), fim(0))} />
      {m3K > 0.02
        ? [0, 1, 2].map((i) => {
            const k = entra(t, T.umDe3 + i * 0.08, 0.4) * m3K;
            const acesa = i === 0 ? rampa(t, T.umDe3 + 0.4, T.umDe3 + 0.8) : 0;
            return <Moeda key={i} tema={tema} pos={[MOEDAS3[0] - 0.66 + i * 0.66, 0.42 + 0.08 * acesa, MOEDAS3[2]]} rot={[Math.PI / 2, 0, 0]} r={0.3} escala={k} cor={mistura(tema.objeto, C.ouro, acesa)} brilho={0.3 * acesa} />;
          })
        : null}

      {/* saúde */}
      <PostoSaude tema={tema} pos={HOSP} rotY={0.2} escala={1.1} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.adm, 0.5), fim(1))} />

      {/* administração da prefeitura */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.3} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.saneam, 0.5), janela(t, T.policiamento, T.camara, 0.5), fim(2))} />

      {/* saneamento */}
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={-1.2} escala={0.6} sobe={predio(T.saneam)} aceso={Math.max(janela(t, T.saneam, T.turismo, 0.5), fim(3))} />

      {/* turismo */}
      <QuiosqueTurismo tema={tema} pos={TURISMO} rotY={1.2} escala={0.85} sobe={predio(T.turismo)} aceso={Math.max(janela(t, T.turismo, T.repara, 0.5), fim(4))} />

      {/* segurança (zerada) e Câmara de Vereadores */}
      <PostoGuarda tema={tema} pos={GUARDA} rotY={-1.36} escala={0.8} sobe={predio(T.seg)} aceso={0.15 * janela(t, T.seg, T.policiamento, 0.5)} />
      {guardaK > 0.02 ? (
        <Boneco tema={tema} pos={BONECO_G} rotY={-0.9} escala={0.45 * Math.min(1, guardaK)} cor={tema.objeto}>
          <Quepe tema={tema} />
        </Boneco>
      ) : null}
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={-0.85} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(5))} />
      <TeatroMini tema={tema} pos={TEATRO} rotY={-0.1} escala={0.7} sobe={predio(T.dezVezes)} aceso={Math.max(janela(t, T.dezVezes, T.parte, 0.5), fim(6))} />

      {/* a dívida */}
      <BancoDivida tema={tema} pos={BANCO} rotY={-1.0} escala={0.7} sobe={bancoK} aceso={janela(t, T.divida, T.lei, 0.5)} />

      {/* a régua do teto: 48% (alerta 48,6, máximo 54) */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />

      {/* os copos dos pisos */}
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduPrec, T.eduPrec + 0.5)} nivel={nivelEdu} acima={rampa(t, T.n26p, T.n26p + 0.6)} />
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.sauPrec, T.sauPrec + 0.5)} nivel={nivelSau} acima={rampa(t, T.n158, T.n158 + 0.6)} />
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
      [T.educ, E([-4.8, 0.8, -0.2], 6.6, 4.8, [0.5, 0.95, 1])],
      [T.umDe3, E([-4.6, 0.8, 0.4], 6.4, 4.8, [0.6, 0.95, 1])],
      [T.saude - 0.3, E([-4.6, 0.8, 0.4], 6.0, 4.6, [0.7, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-1.4, 0.9, -4.4], 6.4, 4.6, [0.25, 0.92, 1])],
      [T.prev150, E([-0.9, 0.9, -4.2], 6.8, 4.8, [0.12, 0.92, 1])],
      [T.adm - 0.3, E([-0.9, 0.9, -4.2], 6.4, 4.6, [0.05, 0.92, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.04,
    chaves: [
      [T.adm - 0.1, E([2.7, 0.9, -4.2], 6.4, 4.6, [-0.1, 0.92, 1])],
      [T.maisQue, E([3.2, 0.9, -4.0], 6.8, 4.8, [-0.25, 0.92, 1])],
      [T.saneam - 0.3, E([3.2, 0.9, -4.0], 6.4, 4.6, [-0.35, 0.92, 1])],
    ],
  },
  {
    ini: T.saneam - 0.1,
    arco: 0.04,
    chaves: [
      [T.saneam - 0.1, E([5.4, 0.8, -0.4], 6.0, 4.4, [-0.6, 0.9, 1])],
      [T.turismo - 0.3, E([5.4, 0.8, -0.2], 5.6, 4.2, [-0.75, 0.9, 1])],
    ],
  },
  {
    ini: T.turismo - 0.1,
    arco: 0.04,
    chaves: [
      [T.turismo - 0.1, E([-5.6, 0.8, 2.6], 6.0, 4.4, [0.6, 0.9, 1])],
      [T.repara - 0.3, E([-5.5, 0.8, 2.7], 5.6, 4.2, [0.75, 0.9, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([6.2, 0.9, 2.4], 5.6, 4.2, [-0.55, 0.9, 1])],
      [T.zero + 0.4, E([6.3, 0.9, 2.3], 5.2, 4.0, [-0.65, 0.9, 1])],
      [T.policiamento + 0.5, E([3.4, 0.9, -4.6], 5.4, 4.2, [-0.2, 0.92, 1])],
      [T.camara - 0.2, E([3.4, 0.9, -4.6], 5.2, 4.0, [-0.3, 0.92, 1])],
      [T.camara + 0.5, E([3.6, 0.8, 4.6], 7.2, 5.0, [-0.2, 0.9, 1])],
      [T.parte - 0.3, E([3.4, 0.8, 4.8], 7.0, 4.8, [-0.1, 0.9, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0.4, 0.6, 0.6], 8.6, 6.0, [0, 1.0, 1])],
      [T.n554 + 0.6, E([0.2, 0.6, 0.6], 8.0, 5.6, [0.05, 1.0, 1])],
      [T.divida, E([1.2, 0.6, 0.4], 7.4, 5.2, [-0.1, 1.0, 1])],
      [T.lei - 0.3, E([1.4, 0.6, 0.2], 7.0, 5.0, [-0.2, 1.0, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 0.8, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.n48, E([0, 3.0, 0], 3.2, 7.2, [0.05, 0.28, 1])],
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
  {a: T.educ, b: T.umDe3, texto: 'A MAIOR FATIA'},
  {a: T.umDe3, b: T.saude, texto: '1 DE CADA 3 REAIS', destaque: true},
  {a: T.prev150, b: T.adm, texto: 'PREVISTO 150 MI · GASTO 195 MI', destaque: true},
  {a: T.adm, b: T.maisQue, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.maisQue, b: T.saneam, texto: 'MAIS QUE ASSISTÊNCIA, CULTURA, ESPORTE E MEIO AMBIENTE JUNTOS'},
  {a: T.dobro, b: T.turismo, texto: 'MAIS QUE O DOBRO DO PREVISTO', destaque: true},
  {a: T.turismo, b: T.n44, texto: 'NUMA CIDADE TURÍSTICA'},
  {a: T.triplo, b: T.repara, texto: 'QUASE O TRIPLO DO PREVISTO', destaque: true},
  {a: T.repara, b: T.zero, texto: 'AGORA REPARA'},
  {a: T.zero, b: T.policiamento + 0.6, texto: 'SEGURANÇA PÚBLICA: ZERO', destaque: true},
  {a: T.policiamento + 0.6, b: T.policia, texto: 'O POLICIAMENTO ESTÁ NA ADMINISTRAÇÃO'},
  {a: T.policia, b: T.camara, texto: 'A POLÍCIA É DO ESTADO'},
  {a: T.camara, b: T.dezVezes, texto: 'CÂMARA DE VEREADORES'},
  {a: T.dezVezes, b: T.parte, texto: '10 VEZES A CULTURA', destaque: true},
  {a: T.parte, b: T.salarios, texto: 'A PARTE QUE QUASE NINGUÉM VÊ'},
  {a: T.salarios, b: T.obras, texto: 'SALÁRIOS E ENCARGOS: QUASE METADE', destaque: true},
  {a: T.obras, b: T.divida, texto: 'OBRAS E EQUIPAMENTOS: 12 EM CADA 100'},
  {a: T.divida, b: T.lei, texto: 'A DÍVIDA: JUROS E PARCELAS'},
  {a: T.lei, b: T.n48, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.alerta, b: T.pisos, texto: 'PERTO DO LIMITE DE ALERTA (48,6%)', destaque: true},
  {a: T.pisos, b: T.eduPrec, texto: 'OS PISOS DA LEI'},
  {a: T.pouco, b: T.tribunal, texto: 'A SAÚDE PASSOU POR POUCO', destaque: true},
  {a: T.tribunal, b: T.fimAno, texto: 'QUEM ANALISA: TCM-BA'},
  {a: T.fimAno, b: T.seu, texto: 'RECEITAS − DESPESAS'},
  {a: T.seu, b: T.emQual, texto: 'O DINHEIRO É SEU', destaque: true},
];
// páginas do PDF do portal de Porto Seguro ("RREO 6º bim. 2025 e RGF 3º quadr. 2025", Diário Oficial de 30/01/2026)
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.n400, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE PORTO SEGURO'},
  {a: T.n400, b: T.saude, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6'},
  {a: T.saude, b: T.adm, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 5'},
  {a: T.adm, b: T.saneam, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4 A 8'},
  {a: T.saneam, b: T.turismo, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 7'},
  {a: T.turismo, b: T.repara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 8'},
  {a: T.repara, b: T.camara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4 (SEGURANÇA E POLICIAMENTO)'},
  {a: T.camara, b: T.parte, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 4 E 6'},
  {a: T.parte, b: T.divida, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (PESSOAL E INVESTIMENTOS)'},
  {a: T.divida, b: T.lei, texto: 'FONTE: RREO DEZ/2025 · P. 8 (2024: RREO DEZ/2024 · P. 22)'},
  {a: T.lei, b: T.pisos, texto: 'FONTE: RGF DEZ/2025 · PODER EXECUTIVO · P. 44'},
  {a: T.pisos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · P. 41 E 42'},
  {a: T.fimAno, b: T.emQual, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 E 2'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n400, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.4]), valor: 'QUASE 400 MI', sub: 'R$ 399,48 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.n195, b: T.adm, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '195 MI', sub: 'R$ 194,93 MI · SAÚDE', cor: 'acento'},
  {a: T.prev150 + 0.3, b: T.adm, p: soma(PILHAS_SAU_PREV, [0, 1.0, 0]), valor: 'PREVISTO: 150 MI', sub: 'SAÚDE', dy: 120},
  {a: T.n128, b: T.saneam, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '128 MI', sub: 'R$ 127,53 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.maisQue + 0.6, b: T.saneam, p: soma(PILHAS_4, [0, 0.9, 0]), valor: '45 MI', sub: 'ASSISTÊNCIA + CULTURA + ESPORTE + MEIO AMBIENTE', dy: 120},
  {a: T.n85, b: T.turismo, p: soma(PILHAS_SAN, [0, 1.1, 0]), valor: '85 MI', sub: 'R$ 84,85 MI · SANEAMENTO', cor: 'acento'},
  {a: T.dobro + 0.3, b: T.turismo, p: soma(PILHAS_SAN_PREV, [0, 0.9, 0]), valor: 'PREVISTO: 39 MI', sub: 'SANEAMENTO', dy: 120},
  {a: T.n15 + 0.3, b: T.repara, p: soma(PILHAS_TUR_PREV, [0, 0.9, 0]), valor: 'PREVISTO: 15 MI', sub: 'TURISMO'},
  {a: T.n44, b: T.repara, p: soma(PILHAS_TUR, [0, 1.1, 0]), valor: '44 MI', sub: 'R$ 43,68 MI · TURISMO', cor: 'acento', dy: 120},
  {a: T.zero, b: T.policiamento + 0.6, p: soma(GUARDA, [0, 1.8, 0]), valor: 'R$ 0', sub: 'SEGURANÇA PÚBLICA', cor: 'alerta'},
  {a: T.n808, b: T.camara, p: soma(PILHAS_POL, [0, 0.6, 0]), valor: '808 MIL', sub: 'POLICIAMENTO, DENTRO DA ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.n26, b: T.parte, p: soma(PILHAS_CAM, [0, 1.1, 0]), valor: '26 MI', sub: 'R$ 26,19 MI · CÂMARA', cor: 'acento'},
  {a: T.n26c, b: T.parte, p: soma(PILHAS_CUL, [0, 0.7, 0]), valor: '2,6 MI', sub: 'R$ 2,57 MI · CULTURA', dy: 120},
  {a: T.n554, b: T.lei, p: soma(PILHAS_SAL, [0, 1.1, 0]), valor: '554 MI', sub: 'SALÁRIOS E ENCARGOS', cor: 'acento'},
  {a: T.n138, b: T.lei, p: soma(PILHAS_OBR, [0, 1.1, 0.4]), valor: '138 MI', sub: 'OBRAS E EQUIPAMENTOS', cor: 'acento', dy: 120},
  {a: T.n67, b: T.lei, p: soma(PILHAS_DIV, [0, 1.0, 0]), valor: '67 MI', sub: 'DÍVIDA · JUROS + PARCELAS', cor: 'acento'},
  {a: T.n24, b: T.lei, p: soma(PILHAS_DIV24, [0, 0.2, 0.4]), valor: '2024: 24 MI', sub: 'R$ 24,06 MI', dy: -60},
  {a: T.n54, b: T.n48, p: [0.75, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.alerta, b: T.pisos - 0.2, p: [-0.8, yRegua(48.6) + 0.2, 0], valor: '48,6%', sub: 'LIMITE DE ALERTA', dy: -40},
  {a: T.n26p, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(26) + 0.3, 0.6]), valor: '26%', sub: 'EDUCAÇÃO · RREO 26,05% · MÍN. 25%', cor: 'acento'},
  {a: T.n158, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(15.8) + 0.3, 0.6]), valor: '15,8%', sub: 'SAÚDE · RREO 15,79% · MÍN. 15%', cor: 'acento'},
  {a: T.n5, b: T.emQual + 0.6, p: soma(PILHAS_SOBRA, [0, 0.9, 0]), valor: '5 MI', sub: 'R$ 4,99 MI · RECEITAS − DESPESAS', cor: 'acento'},
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
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 10 MILHÕES</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.arrecadou ? 'FONTE: RREO DEZ/2025 · PREFEITURA DE PORTO SEGURO · ANEXO 1 · P. 2' : 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 1 (RECEITAS)';
    const k = Math.min(entra(t, T.bilhao, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
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
  const n48K = entra(t, T.n48, 0.5) * (1 - rampa(t, T.pisos - 0.3, T.pisos));
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
      {numeroGrande('48%', 'SALÁRIOS · TETO 54%', n48K, tema.acento)}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/porto-seguro.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
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
  s.push({t: quando('150 milhoes'), f: 'pop', v: 0.22});
  s.push({t: quando('155'), f: 'pop', v: 0.22});
  s.push({t: quando('1 de cada 4'), f: 'pop', v: 0.18});
  s.push({t: quando('100 milhoes'), f: 'pop', v: 0.2});
  s.push({t: quando('previa 30'), f: 'baque', v: 0.16});
  // pilhas que deslizam: pop baixinho
  VOOS.forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 2) s.push({t: v.t + j * 0.035 + 0.6, f: 'pop', v: 0.07});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n400, T.n195, T.n128, T.n85, T.n44, T.n808, T.n26, T.n26c, T.n554, T.n138, T.n67].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.umDe3 + 0.4, f: 'pop', v: 0.18});
  [T.prev150, T.dobro, T.n15].forEach((t) => s.push({t, f: 'subida', v: 0.13}));
  s.push({t: T.triplo, f: 'ding', v: 0.18});
  s.push({t: T.zero, f: 'baque', v: 0.24});
  s.push({t: T.dezVezes, f: 'baque', v: 0.2});
  s.push({t: T.n554 + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n24, f: 'baque', v: 0.18});
  // teto
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.n48 - 0.4, f: 'subida', v: 0.22});
  s.push({t: T.alerta, f: 'bip', v: 0.16});
  // pisos
  s.push({t: T.pisos + 0.3, f: 'subida', v: 0.18});
  s.push({t: T.n26p, f: 'ding', v: 0.2});
  s.push({t: T.n158, f: 'ding', v: 0.18});
  // sobra
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n5, f: 'pop', v: 0.24});
  // fim
  for (let i = 0; i < 7; i++) s.push({t: T.emQual + 0.6 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 4.5, 10.0, 16.0, 20.0, 24.0, 28.0, 31.5, T.paraOnde + 0.8, T.n400 + 1.0, T.umDe3 + 0.6, T.n195 + 0.8, T.prev150 + 0.8, T.n128 + 0.8, T.juntos, T.n85 + 0.6, T.dobro + 0.6,
  T.n15 + 0.6, T.n44 + 0.8, T.triplo + 0.4, T.zero + 0.4, T.n808 + 0.6, T.n26 + 0.6, T.n26c + 0.4, T.salarios + 0.4, T.n554 + 1.2, T.n138 + 0.8, T.n67 + 0.6, T.n24 + 0.4,
  T.n54 + 0.4, T.n48 + 0.6, T.alerta + 1.0, T.n26p + 0.4, T.n158 + 0.4, T.tribunal + 0.4, T.n5 + 0.6, T.seu + 0.4, T.emQual + 1.5, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoPortoSeguro: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Porto Seguro" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['1,15 bilhão.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoPortoSeguro: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ORÇAMENTO PORTO SEGURO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
