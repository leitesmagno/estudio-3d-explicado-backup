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
import {ArvoreRedonda, CasaMini, CofreFGTS, Cone, Martelo, Onibus, Posto, RoloCompactador} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoGuarda, PostoSaude, Prefeitura, ReguaLimite, RuaServicos, coresOI, grade, yRegua, type Pilha} from '../orcamentoitabuna/pecas';
import {PALAVRAS} from './palavras';

// 030. orçamento de coaraci (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits, igual à série:
// o Kit Mapas abre (voo até Coaraci e "de onde vem": projetos/030.../mapas/coaraci.mp4, composição
// OrcamentoCoaraci do kit) e o Estúdio 3D monta a maquete redonda com o cofre da prefeitura e as pilhas
// (1 pilha = R$ 1 MILHÃO; o gasto de 2025, R$ 91,6 mi, vira o anel de 92 pilhas).
// Pedido da pessoa: 2024, 2025 e 2026 no mesmo vídeo, e a marca @eumagnoleite em movimento na tela toda.
// SÓ DADOS DE COARACI (SICONFI, SIOPE e PDFs do portal): audio/fontes.md. Neutro: sem nome de prefeito nem partido.
// Plano: projetos/030. orçamento de coaraci/plano.md.

export const FPS = 30;
const AUDIO_SEG = 134.8;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '030. orçamento de coaraci';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  gastou: quando('gastou 91'),
  primeiro: quando('Primeiro'),
  paraOnde: quando('para onde vai'),
  educ: quando('A educacao ficou'),
  n32: quando('32 milhoes'),
  saude: quando('A saude com'),
  n27: quando('com 27'),
  n29: quando('tinha 29'),
  caiu: quando('Caiu 2'),
  adm: quando('A administracao'),
  n13: quando('para 13'),
  urb: quando('o urbanismo'),
  n3: quando('de 8 para 3'),
  cultura: quando('A cultura'),
  n11: quando('com 1 milhao e 100'),
  transp: quando('O transporte'),
  n220: quando('220'),
  repara: quando('Agora repara'),
  seg: quando('A seguranca publica'),
  semVerba: quando('nao tem verba'),
  guarda: quando('guarda municipal'),
  camara: quando('a Camara de Vereadores'),
  n33: quando('custou 3'),
  seisVezes: quando('Mais de 6'),
  parte: quando('E tem a parte'),
  salarios: quando('Salarios e encargos'),
  n56: quando('56 milhoes'),
  n62: quando('62 de cada'),
  temp: quando('Os contratos temporarios'),
  n6: quando('para 6 milhoes'),
  obras: quando('Ja obras'),
  n28: quando('so 2 milhoes'),
  divida: quando('A divida levou'),
  n4: quando('levou 4'),
  conden: quando('as condenacoes'),
  outros4: quando('outros 4'),
  cadaUma: quando('Cada uma'),
  comb: quando('Em 2024 um unico'),
  fornecedor: quando('um unico fornecedor'),
  n56b: quando('recebeu 5'),
  maisTudo: quando('Mais do que tudo'),
  agora26: quando('E agora 2026'),
  janeiro: quando('De janeiro a agosto'),
  igual: quando('ficou igual'),
  subiu21: quando('subiu 21'),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  estava: quando('estava em'),
  em25: quando('2025 em'),
  chegou: quando('chegou a'),
  passou: quando('Passou do limite'),
  abril: quando('abril de 2027'),
  proibe: quando('a lei proibe'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'COARACI 2024 → 2026'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.educ, 'EDUCAÇÃO E SAÚDE'],
  [T.adm, 'ADMINISTRAÇÃO × URBANISMO'],
  [T.cultura, 'CULTURA E TRANSPORTE'],
  [T.repara, 'SEGURANÇA × CÂMARA'],
  [T.parte, 'SALÁRIOS × OBRAS'],
  [T.comb, 'O COMBUSTÍVEL'],
  [T.agora26, '2026'],
  [T.lei, 'O TETO'],
  [T.emQual, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-7.1, 0, -0.9];
const PILHAS_EDU: V3 = [-4.6, 0, -3.3];
const HOSP: V3 = [-0.4, 0, -6.0];
const PILHAS_SAU: V3 = [-0.4, 0, -3.8];
const RUA: V3 = [-3.6, 0, 4.7];
const PILHAS_URB: V3 = [-3.6, 0, 3.1];
const RUA_BUS_Z = 6.0;
const PREF: V3 = [5.4, 0, -3.9];
const PILHAS_ADM: V3 = [3.9, 0, -2.2];
const PILHAS_CUL: V3 = [4.6, 0, 1.6];
const PILHAS_TRA: V3 = [5.8, 0, 2.8];
const CAMARA: V3 = [-3.6, 0, -6.5];
const PILHAS_CAM: V3 = [-2.6, 0, -5.4];
const PILHAS_IPTU: V3 = [-1.5, 0, -5.2];
const GUARDA: V3 = [-6.4, 0, -4.9];
const OBRA: V3 = [-1.6, 0, 3.6];
const PILHAS_OBR: V3 = [0.2, 0, 3.6];
const BANCO: V3 = [5.7, 0, 5.0];
const PILHAS_DIV: V3 = [3.9, 0, 3.6];
const MARTELO: V3 = [-5.4, 0, 1.6];
const PILHAS_JUS: V3 = [-4.0, 0, 2.0];
const POSTO: V3 = [0, 0, -1.9];
const PILHAS_COMB: V3 = [-1.5, 0, 1.0];
const PILHAS_OB24: V3 = [1.5, 0, 1.0];
const REGUA: V3 = [0, 0, 0];
const CASAS: [V3, number][] = [
  [[-6.0, 0, -6.4], 0.6],
  [[3.4, 0, -7.6], -0.3],
  [[7.6, 0, -2.0], -1.2],
  [[-8.1, 0, 1.2], 1.4],
  [[7.4, 0, 4.4], -1.6],
  [[1.8, 0, -7.9], 0.2],
  [[-7.6, 0, 3.6], 1.0],
];
const ARVORES: V3[] = [
  [-5.8, 0, 6.6],
  [-1.6, 0, 8.3],
  [7.6, 0, -0.6],
  [2.6, 0, 7.6],
  [-8.4, 0, -2.6],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 1 milhão) ----------
const anel = (desloca = 0): V3[] => {
  const s: V3[] = [];
  (
    [
      [1.5, 20],
      [1.9, 22],
      [2.3, 24],
      [2.7, 26],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r + desloca;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
};
// fase 1: o gasto de 2025 por área. As pilhas voam do anel para cada área, na palavra do número.
const ANEL: V3[] = anel();
// fase 2 ("a parte que quase ninguém vê"): o dinheiro todo de novo no anel, agora separado em salários, obras, dívida e condenações
const ANEL2: V3[] = anel(0.07);

type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number};
const VOOS: Voo[] = [
  {n: 32.07, t: T.n32, centro: PILHAS_EDU, cols: 6, slots: 36, fim: T.saude},
  {n: 26.73, t: T.n27, centro: PILHAS_SAU, cols: 6, slots: 30, fim: T.adm},
  {n: 13.03, t: T.n13, centro: PILHAS_ADM, cols: 4, slots: 16, fim: T.urb},
  {n: 3.23, t: T.n3, centro: PILHAS_URB, cols: 3, slots: 9, fim: T.cultura},
  {n: 1.09, t: T.n11, centro: PILHAS_CUL, cols: 2, slots: 2, fim: T.transp},
  {n: 0.22, t: T.n220, centro: PILHAS_TRA, cols: 1, slots: 1, fim: T.repara},
  {n: 3.28, t: T.n33, centro: PILHAS_CAM, cols: 2, slots: 4, fim: T.parte},
];
const rotas = (base: V3[], voos: Voo[]) => {
  const livres = base.map((_, i) => i);
  return voos.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(base[a][0] - dest[j][0], base[a][2] - dest[j][2]) - Math.hypot(base[b][0] - dest[j][0], base[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
};
const ROTAS = rotas(ANEL, VOOS);
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));
// fase 2: obras (2,8), dívida (4,1) e condenações na Justiça (4,0) voam do anel; 57 pilhas (salários, 56,8 mi) acendem
const VOOS2: Voo[] = [
  {n: 2.83, t: T.n28, centro: PILHAS_OBR, cols: 3, slots: 6, fim: T.divida},
  {n: 4.11, t: T.n4, centro: PILHAS_DIV, cols: 3, slots: 6, fim: T.conden},
  {n: 4.0, t: T.outros4, centro: PILHAS_JUS, cols: 2, slots: 4, fim: T.comb},
];
const ROTAS2 = rotas(ANEL2, VOOS2);
const DO_VOO2: number[] = ANEL2.map(() => -1);
ROTAS2.forEach((r, v) => r.de.forEach((i) => (DO_VOO2[i] = v)));
const SALARIO2 = (() => {
  const livres = ANEL2.map((_, i) => i).filter((i) => DO_VOO2[i] < 0);
  return new Set(livres.slice(0, 57));
})();

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.comb - 0.3, T.comb + 0.5)) + rampa(t, T.emQual - 0.2, T.emQual + 0.6);

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  // fase 1: as pilhas das áreas afundam na "parte que quase ninguém vê"
  const afunda = 0.9 * rampa(t, T.parte - 0.2, T.parte + 0.8);
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1 && afunda < 0.89) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.006, T.paraOnde + 0.5 + i * 0.006);
      const v = DO_VOO[i];
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.03;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = janela(t, voo.t, voo.fim, 0.4);
        solidas.push({p: desce(pos), n, cor: k > 0.01 ? aceso(k) : ouro});
        return;
      }
      const fora = rampa(t, T.parte - 0.4, T.parte + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: nasce * (1 - fora), cor: ouro});
    });
  }
  // 2024 em pilhas transparentes ao lado de 2025: saúde 28,8; administração 8,9; urbanismo 7,9
  const fant = (centro: V3, slots: number, cols: number, n: number, a: number, b: number) => {
    const k = rampa(t, a, a + 0.8) * (1 - rampa(t, b, b + 0.5));
    if (k > 0.01) fantasmas.push(...encher(grade(centro, slots, cols), n * k, ouro));
  };
  fant(PILHAS_SAU, 30, 6, 28.82, T.n29, T.adm);
  fant(PILHAS_ADM, 16, 4, 8.92, T.adm + 0.2, T.urb);
  fant(PILHAS_URB, 9, 3, 7.94, T.urb + 0.2, T.cultura);
  // o IPTU de 2025 (0,5 pilha) ao lado da Câmara
  const iptuK = rampa(t, T.seisVezes - 0.2, T.seisVezes + 0.5) * (1 - rampa(t, T.parte - 0.2, T.parte + 0.4));
  if (iptuK > 0.01) solidas.push({p: PILHAS_IPTU, n: 0.502 * iptuK, cor: claro(1)});
  // fase 2: o dinheiro todo de volta no anel; salários acendem; obras, dívida e condenações voam
  const k2 = rampa(t, T.parte + 0.2, T.parte + 1.0) * (1 - rampa(t, T.comb - 0.3, T.comb + 0.5));
  if (k2 > 0.01) {
    ANEL2.forEach((p, i) => {
      const nasce = k2 * rampa(t, T.parte + 0.2 + i * 0.004, T.parte + 0.6 + i * 0.004);
      const v = DO_VOO2[i];
      if (v >= 0) {
        const voo = VOOS2[v];
        const j = ROTAS2[v].de.indexOf(i);
        const a = voo.t + j * 0.05;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS2[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = Math.max(janela(t, voo.t, voo.fim, 0.4), janela(t, T.cadaUma, T.comb, 0.4));
        solidas.push({p: pos, n, cor: k > 0.01 ? aceso(k) : ouro});
        return;
      }
      const sal = SALARIO2.has(i) ? janela(t, T.n56, T.obras, 0.5) : 0;
      // 91,6: a última pilha do anel é só 0,6
      const ult = i === ANEL2.length - 1 ? 0.6 : 1;
      solidas.push({p, n: nasce * ult, cor: sal > 0.01 ? aceso(sal) : ouro});
    });
  }
  // o combustível de 2024 (5,6 pilhas) e tudo o que foi investido em obras em 2024 (4,5 pilhas)
  const combK = rampa(t, T.n56b - 0.2, T.n56b + 0.9) * (1 - rampa(t, T.agora26 - 0.2, T.agora26 + 0.5));
  if (combK > 0.01) solidas.push(...encher(grade(PILHAS_COMB, 6, 3), 5.62 * combK, aceso(janela(t, T.n56b, T.agora26, 0.4))));
  const ob24K = rampa(t, T.maisTudo - 0.2, T.maisTudo + 0.9) * (1 - rampa(t, T.agora26 - 0.2, T.agora26 + 0.5));
  if (ob24K > 0.01) solidas.push(...encher(grade(PILHAS_OB24, 6, 3), 4.51 * ob24K, claro(1)));
  return {solidas, fantasmas};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam na "parte que quase ninguém vê" e voltam no fim
  const fora = rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.emQual, T.emQual + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - 0.25 * fora - 0.75 * rampa(t, T.comb - 0.4, T.comb + 0.4) * (1 - rampa(t, T.emQual, T.emQual + 0.9)));
  const fim = (i: number) => janela(t, T.emQual + 0.4 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const busK = vis(t, T.transp - 0.3, T.repara);
  const busX = 4.6 - 6.0 * rampa(t, T.transp - 0.3, T.transp + 3.0, sai);
  const obraK = vis(t, T.obras - 0.1, T.comb);
  const marteloK = vis(t, T.conden - 0.1, T.comb);
  const postoK = vis(t, T.comb, T.agora26);
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.emQual - 0.3, T.emQual + 0.5));
  const nivel = 49.78 * rampa(t, T.estava - 0.2, T.estava + 1.2) + (50.64 - 49.78) * rampa(t, T.em25, T.em25 + 0.9) + (57.11 - 50.64) * rampa(t, T.chegou, T.chegou + 1.4);

  return (
    <group>
      <MesaMaquete tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - Math.min(1, ck)), COFRE[2]]} escala={0.75} abre={rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0)} trava={0} brilho={0.3 * janela(t, T.paraOnde + 0.3, T.educ + 0.6)} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1200} />
      <PilhasDinheiro pilhas={fantasmas} max={300} opacidade={0.3} largura={1.12} />

      {/* educação e saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.35} escala={0.85} sobe={predio(T.educ)} aceso={Math.max(janela(t, T.educ, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.05} escala={1.1} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.adm, 0.5), fim(1))} />

      {/* administração */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.7} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.urb, 0.5), fim(2))} />

      {/* urbanismo: ruas e limpeza */}
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={predio(T.urb)} luz={Math.max(janela(t, T.urb + 0.6, T.cultura, 0.5), fim(3))} caminhaoX={2.4 - 4.6 * rampa(t, T.urb, T.urb + 5)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.urb))} />

      {/* transporte: o ônibus passa */}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}

      {/* segurança (posto da guarda vazio, sem pilhas) e Câmara */}
      <PostoGuarda tema={tema} pos={GUARDA} rotY={0.9} escala={0.8} sobe={predio(T.seg)} aceso={Math.max(0.25 * janela(t, T.seg, T.camara, 0.5), fim(4))} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={0.35} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(5))} />

      {/* obras e equipamentos */}
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK) * 0.8}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.17 + i * 0.22, 0]} castShadow>
              <boxGeometry args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} />
              <meshStandardMaterial color={mistura(C.alerta, C.areia, 0.4)} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[OBRA[0] - 0.7, 0.06, OBRA[2] - 0.6]} k={0.7 * obraK} />
      <RoloCompactador tema={tema} pos={[OBRA[0] - 1.0, 0.06, OBRA[2] + 0.5]} rotY={0.6} escala={0.3 * obraK} giro={t * 0.8} />

      {/* dívida */}
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.7} escala={0.85} sobe={Math.max(0, rampa(t, T.divida - 0.2, T.divida + 0.6) - rampa(t, T.comb - 0.4, T.comb + 0.4))} aceso={janela(t, T.divida, T.conden, 0.5)} />

      {/* condenações na Justiça: o martelo bate */}
      <Martelo tema={tema} pos={MARTELO} escala={0.55 * Math.min(1, marteloK)} bate={rampa(t, T.outros4 - 0.3, T.outros4 + 0.1)} rotY={0.6} />

      {/* o posto de combustível de 2024 */}
      {postoK > 0.02 ? (
        <group position={[POSTO[0], -1.2 * (1 - Math.min(1, postoK)), POSTO[2]]}>
          <Posto tema={tema} pos={[0, 0, 0]} preco="--" visora={0.6} escala={0.55} />
        </group>
      ) : null}

      {/* a régua do teto: 49,8% → 50,6% → 57,1%, passando do máximo (54) */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={0} maximo={rampa(t, T.n54, T.n54 + 0.5)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0.4], 18.5, 11.5, [0, 1.43, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.paraOnde - 0.3,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.3, E([0, 0, 0.2], 16, 10.5, [0, 1.25, 1])],
      [T.educ - 0.1, E([0, 0, 0], 15, 9.8, [0.05, 1.2, 1])],
    ],
  },
  {
    ini: T.educ + 0.2,
    arco: 0.04,
    chaves: [
      [T.educ + 0.2, E([-4.8, 0.8, -2.8], 6.8, 4.8, [0.5, 0.95, 1])],
      [T.saude - 0.3, E([-4.8, 0.8, -2.7], 6.4, 4.6, [0.7, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-0.4, 0.9, -4.6], 6.6, 4.6, [0.25, 0.92, 1])],
      [T.adm - 0.3, E([-0.4, 0.9, -4.5], 6.2, 4.4, [0.1, 0.92, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.04,
    chaves: [
      [T.adm - 0.1, E([4.6, 1.0, -3.0], 6.0, 4.4, [-0.5, 0.92, 1])],
      [T.urb - 0.3, E([4.4, 0.9, -2.6], 6.0, 4.4, [-0.4, 0.92, 1])],
    ],
  },
  {
    ini: T.urb - 0.1,
    arco: 0.04,
    chaves: [
      [T.urb - 0.1, E([-2.8, 0.7, 4.0], 7.2, 4.8, [0.15, 0.85, 1])],
      [T.cultura - 0.3, E([-2.6, 0.6, 4.2], 6.8, 4.6, [0.1, 0.85, 1])],
    ],
  },
  {
    ini: T.cultura - 0.1,
    arco: 0.04,
    chaves: [
      [T.cultura - 0.1, E([4.6, 0.6, 2.4], 6.0, 4.2, [-0.5, 0.85, 1])],
      [T.transp, E([3.6, 0.6, 3.6], 7.2, 4.8, [-0.3, 0.8, 1])],
      [T.repara - 0.3, E([3.4, 0.6, 3.8], 7.0, 4.6, [-0.25, 0.8, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([-5.6, 0.9, -5.2], 5.6, 4.2, [0.5, 0.95, 1])],
      [T.camara, E([-3.4, 0.9, -5.8], 6.6, 4.6, [0.3, 0.95, 1])],
      [T.parte - 0.3, E([-3.2, 0.9, -5.8], 6.2, 4.4, [0.2, 0.95, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0, 0.4, 0.6], 8.6, 5.8, [0, 1.05, 1])],
      [T.obras + 0.2, E([0.4, 0.5, 2.4], 8.0, 5.4, [0, 0.95, 1])],
      [T.divida + 0.2, E([2.0, 0.5, 2.8], 8.0, 5.4, [-0.15, 0.95, 1])],
      [T.conden + 0.2, E([-1.8, 0.5, 2.2], 8.4, 5.6, [0.15, 0.95, 1])],
      [T.comb - 0.3, E([0, 0.5, 2.0], 10, 6.6, [0, 1.0, 1])],
    ],
  },
  {
    ini: T.comb - 0.1,
    arco: 0.04,
    chaves: [
      [T.comb - 0.1, E([0, 0.9, -0.3], 6.6, 5.0, [0, 0.75, 1])],
      [T.maisTudo, E([0, 0.8, 0.2], 6.4, 4.8, [0.1, 0.72, 1])],
      [T.agora26 - 0.3, E([0, 0.8, 0.2], 6.2, 4.6, [0.15, 0.72, 1])],
    ],
  },
  {
    ini: T.agora26 - 0.1,
    chaves: [
      [T.agora26 - 0.1, E([0, 0, 0], 16, 10.5, [0, 1.25, 1])],
      [T.lei - 0.2, E([0, 0, 0], 17, 11, [0.2, 1.3, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 1.2, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.chegou, E([0, 3.4, 0], 3.0, 6.0, [0.05, 0.28, 1])],
      [T.emQual - 0.2, E([0, 3.4, 0], 3.0, 5.8, [0.1, 0.28, 1])],
    ],
  },
  {
    ini: T.emQual,
    chaves: [
      [T.emQual, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
      [FIM, E([0, 0, 0], 19, 11.5, [0.3, 1.35, 1])],
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
  {a: T.paraOnde + 0.3, b: T.educ, texto: 'GASTOS DE 2025: R$ 91,6 MILHÕES'},
  {a: T.educ, b: T.saude, texto: 'EDUCAÇÃO'},
  {a: T.saude, b: T.n29, texto: 'SAÚDE'},
  {a: T.n29, b: T.caiu, texto: 'TRANSPARENTE = 2024'},
  {a: T.caiu, b: T.adm, texto: 'SAÚDE: CAIU 2 MILHÕES', destaque: true},
  {a: T.adm, b: T.n13, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.n13 + 0.3, b: T.urb, texto: 'SUBIU 46%', destaque: true},
  {a: T.urb, b: T.n3, texto: 'URBANISMO: RUAS E LIMPEZA'},
  {a: T.n3 + 0.3, b: T.cultura, texto: 'CAIU DE 8 PARA 3 MILHÕES', destaque: true},
  {a: T.cultura, b: T.transp, texto: 'CULTURA'},
  {a: T.transp, b: T.repara, texto: 'TRANSPORTE'},
  {a: T.repara, b: T.semVerba, texto: 'AGORA REPARA'},
  {a: T.semVerba, b: T.guarda, texto: 'SEGURANÇA: SEM VERBA PRÓPRIA', destaque: true},
  {a: T.guarda, b: T.camara, texto: 'A GUARDA SAI DA CONTA DA ADMINISTRAÇÃO'},
  {a: T.camara, b: T.seisVezes, texto: 'CÂMARA DE VEREADORES'},
  {a: T.seisVezes, b: T.parte, texto: 'MAIS DE 6 VEZES O IPTU', destaque: true},
  {a: T.parte, b: T.salarios, texto: 'O DINHEIRO TODO: R$ 91,6 MILHÕES'},
  {a: T.salarios, b: T.n62, texto: 'SALÁRIOS E ENCARGOS DOS SERVIDORES', destaque: true},
  {a: T.n62, b: T.temp, texto: '62 DE CADA 100 REAIS', destaque: true},
  {a: T.obras, b: T.divida, texto: 'OBRAS E EQUIPAMENTOS'},
  {a: T.divida, b: T.conden, texto: 'DÍVIDA'},
  {a: T.conden, b: T.cadaUma, texto: 'CONDENAÇÕES NA JUSTIÇA'},
  {a: T.cadaUma, b: T.comb, texto: 'CADA UMA: MAIS QUE TODAS AS OBRAS', destaque: true},
  {a: T.comb, b: T.maisTudo, texto: '2024: UM ÚNICO FORNECEDOR DE COMBUSTÍVEL'},
  {a: T.maisTudo, b: T.agora26, texto: 'MAIS QUE TODAS AS OBRAS DE 2024', destaque: true},
  {a: T.lei, b: T.estava, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.passou, b: T.abril, texto: 'PASSOU DO LIMITE MÁXIMO (54%)', destaque: true},
  {a: T.proibe, b: T.emQual, texto: 'SEM AUMENTO, CARGO NOVO OU CONTRATAÇÃO (COM EXCEÇÕES)'},
];
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.educ, texto: 'FONTE: DCA 2025 · PREFEITURA DE COARACI · SICONFI/TESOURO NACIONAL'},
  {a: T.educ, b: T.repara, texto: 'FONTE: DCA 2025 E DCA 2024 · ANEXO I-E (DESPESA POR ÁREA) · SICONFI'},
  {a: T.repara, b: T.parte, texto: 'FONTE: DCA 2025 · ANEXO I-E E I-C (IPTU) · SICONFI'},
  {a: T.parte, b: T.comb, texto: 'FONTE: DCA 2025 · ANEXO I-D (PESSOAL, OBRAS, DÍVIDA, SENTENÇAS) · SICONFI'},
  {a: T.comb, b: T.agora26, texto: 'FONTE: ORDEM CRONOLÓGICA DE PAGAMENTOS 2024 · PORTAL DA TRANSPARÊNCIA'},
  {a: T.agora26, b: T.lei, texto: 'FONTE: RREO JAN–AGO 2025 E 2026 · ANEXO 1 · SICONFI'},
  {a: T.lei, b: T.emQual, texto: 'FONTE: RGF 2024, 2025 E AGO/2026 · ANEXO 1 · LRF, ARTS. 20, 22 E 23'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n32, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.6]), valor: '32 MI', sub: 'R$ 32,07 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.n27, b: T.n29, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '27 MI', sub: 'R$ 26,73 MI · SAÚDE 2025', cor: 'acento'},
  {a: T.n29, b: T.adm, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '2024: 29 MI', sub: '2025: 27 MI · CAIU 2 MI', cor: 'alerta'},
  {a: T.adm + 0.4, b: T.n13, p: soma(PILHAS_ADM, [0, 1.0, 0]), valor: '2024: 9 MI', sub: 'ADMINISTRAÇÃO'},
  {a: T.n13, b: T.urb, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '13 MI', sub: 'R$ 13,03 MI · ADMINISTRAÇÃO 2025', cor: 'acento'},
  {a: T.urb + 0.4, b: T.n3, p: soma(PILHAS_URB, [0, 1.0, 0]), valor: '2024: 8 MI', sub: 'URBANISMO'},
  {a: T.n3, b: T.cultura, p: soma(PILHAS_URB, [0, 1.0, 0]), valor: '3 MI', sub: 'R$ 3,23 MI · URBANISMO 2025', cor: 'alerta'},
  {a: T.n11, b: T.repara, p: soma(PILHAS_CUL, [0, 0.8, 0]), valor: '1,1 MI', sub: 'CULTURA', cor: 'acento'},
  {a: T.n220, b: T.repara, p: soma(PILHAS_TRA, [0, 0.6, 0]), valor: '220 MIL', sub: 'TRANSPORTE', cor: 'acento', dy: 120},
  {a: T.semVerba, b: T.parte, p: soma(GUARDA, [0, 1.4, 0]), valor: 'R$ 0', sub: 'SEGURANÇA PÚBLICA', cor: 'alerta'},
  {a: T.n33, b: T.parte, p: soma(PILHAS_CAM, [0, 1.0, 0]), valor: '3,3 MI', sub: 'R$ 3,28 MI · CÂMARA', cor: 'acento', dy: 120},
  {a: T.seisVezes, b: T.parte, p: soma(PILHAS_IPTU, [0, 0.6, 0]), valor: '0,5 MI', sub: 'IPTU DA CIDADE INTEIRA'},
  {a: T.n56, b: T.obras, p: [-2.2, 0.6, 1.4], valor: '56,8 MI', sub: 'SALÁRIOS E ENCARGOS', cor: 'acento'},
  {a: T.n28, b: T.divida, p: soma(PILHAS_OBR, [0, 1.0, -0.2]), valor: '2,8 MI', sub: 'R$ 2,83 MI · OBRAS E EQUIPAMENTOS', cor: 'alerta'},
  {a: T.n4, b: T.comb, p: soma(PILHAS_DIV, [0, 1.0, 0]), valor: '4,1 MI', sub: 'DÍVIDA', cor: 'acento'},
  {a: T.outros4, b: T.comb, p: soma(PILHAS_JUS, [0, 1.0, 0]), valor: '4 MI', sub: 'CONDENAÇÕES NA JUSTIÇA', cor: 'acento', dy: 120},
  {a: T.n56b, b: T.agora26, p: soma(PILHAS_COMB, [0, 1.0, 0]), valor: '5,6 MI', sub: 'COMBUSTÍVEL · 1 FORNECEDOR', cor: 'alerta'},
  {a: T.maisTudo, b: T.agora26, p: soma(PILHAS_OB24, [0, 1.0, 0]), valor: '4,5 MI', sub: 'OBRAS E EQUIPAMENTOS 2024', dy: 120},
  {a: T.n54, b: T.emQual - 0.2, p: [-0.9, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
];

// 2026: o placar de janeiro a agosto (2D, por cima da mesa)
const Placar2026: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const C = coresOI(tema);
  const k = entra(t, T.agora26 + 0.2, 0.45) * (1 - rampa(t, T.lei - 0.3, T.lei + 0.1));
  if (k <= 0.01) return null;
  const linha = (rot: string, v: number, txt: string, a: number, cor: string) => {
    const kk = rampa(t, a, a + 0.9);
    return (
      <div style={{marginTop: 10, opacity: Math.min(1, rampa(t, a - 0.1, a + 0.3) * 1.5)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 19, fontWeight: 800, letterSpacing: 1, color: tema.texto}}>
          <span>{rot}</span>
          <span style={{fontFamily: FONTE, fontSize: 28, fontWeight: 900, color: cor}}>{txt}</span>
        </div>
        <div style={{height: 18, borderRadius: 9, background: tema.cartaoBorda, marginTop: 6, overflow: 'hidden'}}>
          <div style={{height: 18, width: `${(v / 70) * 100 * kk}%`, borderRadius: 9, background: cor}} />
        </div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.botoesX + 30, top: 640, opacity: Math.min(1, k)}}>
      <div style={{background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, borderRadius: 18, padding: '16px 22px 18px'}}>
        <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave}}>JANEIRO A AGOSTO</div>
        <div style={{fontFamily: FONTE, fontSize: 30, fontWeight: 900, color: tema.texto, marginTop: 10}}>RECEITA</div>
        {linha('2025', 66.43, '66,4 MI', T.janeiro, tema.textoSuave)}
        {linha('2026', 66.64, '66,6 MI · IGUAL', T.igual, tema.acento)}
        <div style={{fontFamily: FONTE, fontSize: 30, fontWeight: 900, color: tema.texto, marginTop: 16, opacity: rampa(t, T.subiu21 - 0.6, T.subiu21 - 0.2)}}>DESPESA</div>
        {linha('2025', 55.38, '55,4 MI', T.subiu21 - 0.5, tema.textoSuave)}
        {linha('2026', 66.87, '66,9 MI · +21%', T.subiu21, C.alerta)}
      </div>
    </div>
  );
};

// a marca d'água @eumagnoleite: bem leve, quica devagar pela tela inteira (ida e volta, linear), o vídeo todo
const MARCA_W = 330;
const MARCA_H = 44;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
const MarcaDagua: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const x = 24 + vaiVolta(t / 9.7) * (W - MARCA_W - 48);
  const y = 24 + vaiVolta(t / 13.3) * (H - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MARCA_W, height: MARCA_H, fontFamily: FONTE, fontSize: 38, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.14, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
      @eumagnoleite
    </div>
  );
};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.comb);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 66 ? 14 : seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 1 MILHÃO</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.primeiro ? 'FONTE: DCA 2025 · PREFEITURA DE COARACI · SICONFI/TESOURO NACIONAL' : 'FONTE: DCA 2025 (RECEITAS) · SIOPE 2025 (DEDUÇÃO DO FUNDEB)';
    const k = Math.min(entra(t, T.gastou, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloMapa.length > 66 ? 14 : 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
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
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const numeroGrande = (txt: string, sub: string, k: number, corN: string, top = 700) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  // a folha: 49,8 → 50,6 → 57,1 (o cartão grande troca na palavra)
  const nPct = t < T.em25 ? '49,8%' : t < T.chegou ? '50,6%' : '57,1%';
  const subPct = t < T.em25 ? 'PESSOAL · FIM DE 2024' : t < T.chegou ? 'PESSOAL · FIM DE 2025' : 'PESSOAL · AGOSTO DE 2026';
  const pctK = entra(t, T.estava + 0.3, 0.5) * (1 - rampa(t, T.abril - 0.3, T.abril));
  const prazoK = entra(t, T.abril, 0.45) * (1 - rampa(t, T.emQual - 0.3, T.emQual));
  // os temporários: 1,6 → 6 milhões
  const tempK = entra(t, T.temp, 0.45) * (1 - rampa(t, T.obras - 0.3, T.obras + 0.1));
  const comentaK = vis(t, T.emQual, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
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
      {tempK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: Math.min(1, tempK)}}>
          <div style={{padding: '14px 28px', borderRadius: 20, background: tema.cartao, border: `2px solid ${C.alerta}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 19, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave}}>CONTRATOS TEMPORÁRIOS</div>
            <div style={{fontFamily: FONTE, fontSize: 56, fontWeight: 900, color: tema.texto, marginTop: 4}}>
              1,6 MI <span style={{color: tema.textoSuave}}>→</span> <span style={{color: mistura(C.alerta, tema.texto, 0.25), opacity: rampa(t, T.n6, T.n6 + 0.4)}}>6 MI</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 4}}>2024 → 2025 · QUASE 4 VEZES</div>
          </div>
        </div>
      ) : null}
      <Placar2026 tema={tema} t={t} />
      {numeroGrande(nPct, subPct, pctK, t < T.chegou ? tema.acento : C.alerta)}
      {numeroGrande('ABRIL/2027', 'PRAZO PARA CORTAR O EXCESSO', prazoK, C.alerta, 700)}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/coaraci.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
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
  s.push({t: quando('91'), f: 'pop', v: 0.22});
  [quando('98'), quando('5 de cada 100'), quando('42 milhoes')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: quando('Mais de 8'), f: 'ding', v: 0.16});
  // pilhas que deslizam: pop baixinho
  [...VOOS, ...VOOS2].forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 3) s.push({t: v.t + j * 0.03 + 0.6, f: 'pop', v: 0.06});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n32, T.n27, T.n13, T.n3, T.n11, T.n220, T.n33, T.n56, T.n28, T.n4, T.outros4, T.n56b].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.caiu, f: 'baque', v: 0.2});
  s.push({t: T.n3 + 0.3, f: 'baque', v: 0.18});
  s.push({t: T.semVerba, f: 'baque', v: 0.22});
  s.push({t: T.seisVezes, f: 'baque', v: 0.2});
  s.push({t: T.parte + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n6, f: 'baque', v: 0.2});
  s.push({t: T.outros4, f: 'baque', v: 0.16});
  s.push({t: T.cadaUma, f: 'baque', v: 0.2});
  s.push({t: T.maisTudo, f: 'baque', v: 0.2});
  s.push({t: T.subiu21, f: 'baque', v: 0.2});
  // teto
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.estava, f: 'subida', v: 0.2});
  s.push({t: T.em25, f: 'pop', v: 0.18});
  s.push({t: T.chegou, f: 'subida', v: 0.22});
  s.push({t: T.passou, f: 'baque', v: 0.24});
  s.push({t: T.abril, f: 'pop', v: 0.2});
  // fim
  for (let i = 0; i < 7; i++) s.push({t: T.emQual + 0.4 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 4.5, 8.0, 13.0, 17.5, 20.5, 25.0, 28.0, 30.5, T.paraOnde + 0.8, T.n32 + 0.8, T.n27 + 0.6, T.n29 + 0.6, T.caiu + 0.4, T.n13 + 0.6, T.n3 + 0.6,
  T.n11 + 0.4, T.n220 + 0.5, T.semVerba + 0.6, T.guarda + 0.3, T.n33 + 0.6, T.seisVezes + 0.6, T.parte + 1.0, T.n56 + 0.8, T.n62 + 0.4, T.n6 + 0.4, T.n28 + 0.8,
  T.n4 + 0.6, T.outros4 + 0.6, T.cadaUma + 0.4, T.n56b + 0.8, T.maisTudo + 0.8, T.igual + 0.6, T.subiu21 + 0.6, T.n54 + 0.6, T.estava + 1.0, T.em25 + 1.0,
  T.chegou + 1.4, T.abril + 0.6, T.proibe + 1.0, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCoaraci: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Coaraci" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['91,6 mi.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoCoaraci: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · COARACI`} t={1} troca={0} y={SEGURO.topo + 160} />
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
