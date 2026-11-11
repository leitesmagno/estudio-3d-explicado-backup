import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {EstradaRural} from '../orcamentocabralia/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 085. orçamento de Ituberá (BA) (perfil @eumagnoleite). MOLDE: 092 Ubaitaba / 070 Valença (brief _brief-molde-ubaitaba.md).
// O Kit Mapas abre (voo até Ituberá: projetos/085.../mapas/itubera.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio
// e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 mi). Quando a voz fala um setor, as pilhas voam para a casinha
// do setor, na ORDEM DA FALA, com a câmera andando num sentido só. "Gastou" = LIQUIDADO (regra 32). Sem porcentagem, sem nome
// de gestor, sem nome de empresa, sem tarifa bancária (regra 60). SÓ DADOS DE ITUBERÁ, todos do TCM-BA: projetos/085.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 177.38; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,15, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '085. orçamento de ituberá';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou'),
  arrec24: quando('2024 Arrecadou'),
  emprestimo: quando('contando um emprestimo'),
  gastou24: quando('Gastou 131'),
  mais24: quando('Sobrou 1'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 138'),
  gastou25: quando('Gastou 143'),
  mais25: quando('4 milhoes e 700 a mais'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 113'),
  gastou26: quando('Ja gastou 110'),
  comprometeu: quando('ja comprometeu'),
  repara: quando('Agora repara'),
  f24: quando('levou 2 milhoes'),
  f25: quando('3 milhoes e 400 em 2025'),
  f26: quando('e ja 4 milhoes'),
  bandas: quando('So com bandas'),
  beneficios: quando('Enquanto isso'),
  b24: quando('cairam de 183'),
  b25: quando('para 122'),
  b26: quando('e 93 mil'),
  produtor: quando('as acoes para o produtor'),
  zeroAgr: quando('gastaram zero'),
  salSec: quando('So sairam salarios'),
  ma: quando('No meio ambiente as acoes'),
  ma204: quando('salarios da secretaria 204'),
  em25: quando('Em 2025 salarios'),
  pessoal: quando('Em 2025 salarios'),
  contratados: quando('sendo 16'),
  camara: quando('A Camara 4 milhoes'),
  tribunal: quando('No Tribunal de Contas ha'),
  festejos: quando('Um sobre as contratacoes'),
  advogados: quando('dois sobre advogados'),
  outros: quando('outros sobre transporte'),
  limpeza: quando('e limpeza publica'),
  naoCond: quando('Estar no tribunal'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se a prefeitura'),
  festas2: quando('as festas ja levaram'),
  ajuda2: quando('e a ajuda de emergencia as'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'estrada' | 'agua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS, LIMPEZA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA E PESCA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.165 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões, exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean}};
const lista = (n: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras limpeza'],
    ['cam', 'Camara'],
    ['div', 'Dividas e encargos'],
    ['cul', 'Cultura e festas'],
    ['ass', 'Assistencia social'],
    ['agr', 'Agricultura e pesca'],
    ['mam', 'Meio ambiente'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 131.23, rotulo: '2024', falta: {t: T.mais24, v: 1.1796, txt: 'SOBROU', sobra: true}, entradas: lista(1, [48.602, 26.362, 14.193, 26.861, 3.802, 2.8685, 2.5929, 4.4904, 0.78979, 0.02202, 0.6947])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 143.41, rotulo: '2025', falta: {t: T.mais25, v: 4.6694, txt: 'A MAIS'}, entradas: lista(2, [58.447, 29.835, 15.197, 22.493, 4.305, 3.9483, 3.377, 3.8161, 1.0745, 0.0456, 0.87487])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 110.8, rotulo: '2026 · COMPROMETIDO ATÉ SET', falta: {t: T.comprometeu, v: 18.269, txt: 'A MAIS'}, entradas: lista(3, [46.157, 22.53, 10.621, 16.931, 3.2477, 3.0262, 4.2013, 2.8023, 0.63549, 0.013544, 0.63185])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;

const ANDAR = 0.75;
const PASSO_T = 0.38;
const torre = (c: V3, n: number, lado: number, cor: string, passo = PASSO_T): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * passo, c[1] + andar * ANDAR, c[2] + z * passo], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;
const LADO = 3;
const ESCALA = 2; // 1 pilha = R$ 2 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2024 usa cerca de 56 pilhas) ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 26],
      [2.25, 31],
      [2.75, 36],
      [3.25, 41],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.31;
      const rel = (a - (ANGS[0] - 0.12 * Math.PI) + Math.PI * 8) % (Math.PI * 2);
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: rel});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + Math.ceil(e.v / ESCALA - 0.0005), 0);
  y.entradas.forEach((e) => {
    const n = e.v / ESCALA;
    if (n < 0.003) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// esquerda (1 pilha = R$ 250 mil): festas 2024, 2025 e 2026 x benefícios eventuais 2024, 2025 e 2026;
// depois a agricultura de 2026 (ações para o produtor = zero; branco = previsto) e o meio ambiente (ações x salários da secretaria)
// direita (1 pilha = R$ 2 mi): pessoal de 2025 (contratados por tempo determinado) e a Câmara
// branco transparente = reservado no orçamento; cor do ano = usado (2024 dourado, 2025 verde, 2026 rosa)
const ESC_A = 0.25;
const ESC_D = 2;
const LADO_A = 3;
const ZA = 0.2;
const FX = {
  f24: {p: [-5.0, 0, ZA] as V3, v: 2.393},
  f25: {p: [-3.95, 0, ZA] as V3, v: 3.3725},
  f26: {p: [-2.9, 0, ZA] as V3, v: 4.0184},
  b24: {p: [-1.4, 0, ZA] as V3, v: 0.18258},
  b25: {p: [-0.45, 0, ZA] as V3, v: 0.12239},
  b26: {p: [0.5, 0, ZA] as V3, v: 0.09279},
  a26: {p: [-1.2, 0, ZA] as V3, res: 0.155, v: 0},
  ma: {p: [-0.1, 0, ZA] as V3, v: 0.013544, sal: 0.20354},
};
const DI = {
  con: {p: [1.75, 0, ZA] as V3, v: 16.395},
  cam: {p: [3.55, 0, ZA] as V3, v: 4.305},
};
const FX_VIS = (t: number) => vis(t, T.repara + 0.1, T.em25 - 0.2) + vis(t, T.gastar - 0.1, FIM + 2);
const BEN_VIS = (t: number) => (t < T.produtor - 0.3 || t >= T.gastar - 0.1 ? 1 : 1 - rampa(t, T.produtor - 0.3, T.produtor + 0.2));
const AGR_VIS = (t: number) => vis(t, T.produtor - 0.1, T.em25 - 0.2);
const DI_VIS = (t: number) => vis(t, T.em25 - 0.1, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'FESTEJOS JUNINOS · ARTISTAS', valor: '2026', t: T.festejos, carimbos: [[T.festejos + 0.6, 'NO TCM-BA', 'neutro']]},
  {titulo: 'ADVOGADOS · FUNDEF', valor: '2 PROCESSOS', t: T.advogados, carimbos: [[T.advogados + 0.5, 'NO TCM-BA', 'neutro']]},
  {titulo: 'TRANSPORTE ESCOLAR', valor: '2025', t: T.outros, carimbos: [[T.outros + 0.5, 'NO TCM-BA', 'neutro']]},
  {titulo: 'LIMPEZA PÚBLICA', valor: '2024', t: T.limpeza, carimbos: [[T.limpeza + 0.4, 'NO TCM-BA', 'neutro']]},
];
const posPasta = (i: number): V3 => [-2.7 + i * 1.8, 0, 1.3];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) {
        if (some > 0.01) torres.push({p: v.de, n: v.n * nasce * some, cor: CA[yi]});
      } else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
    });
  });
  if (some > 0.01) {
    // torre vermelha "A MAIS" na frente do cofre (2024 e 2025); em 2026, o comprometido além do arrecadado
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // festas (2024, 2025, 2026) x benefícios eventuais (2024, 2025, 2026)
  const fx = FX_VIS(t);
  if (fx > 0.01) {
    const fs: [keyof typeof FX, number, number][] = [['f24', T.f24, 0], ['f25', T.f25, 1], ['f26', T.f26, 2]];
    fs.forEach(([k, a, yi]) => {
      if (final && k !== 'f26') return;
      const kk = cresce(a) * fx;
      if (kk > 0.01) solidas.push(...torre(FX[k].p, (FX[k].v / ESC_A) * kk, LADO_A, CA[yi]));
    });
    const kb = fx * BEN_VIS(t);
    const bs: [keyof typeof FX, number, number][] = [['b24', T.b24, 0], ['b25', T.b25, 1], ['b26', T.b26, 2]];
    bs.forEach(([k, a, yi]) => {
      if (final && k !== 'b26') return;
      const kk = (final ? cresce(T.ajuda2) : cresce(a)) * kb;
      if (kk > 0.01) solidas.push(...torre(FX[k].p, Math.max(0.35, FX[k].v / ESC_A) * kk, LADO_A, CA[yi]));
    });
  }
  // agricultura 2026: ações para o produtor (previsto, branco) gastaram zero; meio ambiente: ações x salários da secretaria
  const ag = AGR_VIS(t);
  if (ag > 0.01) {
    const k1 = cresce(T.zeroAgr) * ag;
    if (k1 > 0.01) fantasmas.push(...torre(FX.a26.p, (FX.a26.res / ESC_A) * k1, LADO_A, tema.objetoClaro));
    const k2 = cresce(T.ma) * ag;
    if (k2 > 0.01) solidas.push(...torre(FX.ma.p, 0.35 * k2, LADO_A, CA[2]));
    const k3 = cresce(T.ma204) * ag;
    if (k3 > 0.01) solidas.push(...torre(soma(FX.ma.p, [0.75, 0, 0]), (FX.ma.sal / ESC_A) * k3, LADO_A, mistura(CA[2], tema.objeto, 0.35)));
  }
  // pessoal 2025 (1 pilha = R$ 2 mi)
  const di = DI_VIS(t);
  if (di > 0.01) {
    const k0 = cresce(T.contratados) * di;
    if (k0 > 0.01) solidas.push(...torre(DI.con.p, (DI.con.v / ESC_D) * k0, LADO_A, CA[1]));
    const k1 = cresce(T.camara) * di;
    if (k1 > 0.01) solidas.push(...torre(DI.cam.p, (DI.cam.v / ESC_D) * k1, LADO_A, CA[1]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
  [[6.9, 0, -3.6], 1.9],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.6, 0, 3.6],
  [7.7, 0, -2.2],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const zerado = false;
  const aceso = zerado ? 0 : Math.max(0, ...ditas);
  const e = 0.42;
  const props = {tema, pos: p, sobe, aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.2} gariX={-1.4} />;
    case 'estrada':
      return <EstradaRural tema={tema} pos={p} rotY={rot} sobe={sobe} aceso={aceso} escala={0.45} />;
    case 'agua':
      return <EstacaoSaneamento {...props} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.42 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
          ))}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const fx = FX_VIS(t);
  const di = DI_VIS(t);
  const pk = PASTAS_VIS(t);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.5} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* festas x agricultura e esporte (esquerda); o que pesa em 2025 (direita) */}
      <BaseGaveta tema={tema} pos={[-2.25, 0, ZA]} sobe={fx} larg={6.4} texto={t >= T.produtor - 0.2 && t < T.gastar - 0.1 ? 'AGRICULTURA E MEIO AMBIENTE · 2026' : 'FESTAS x AJUDA ÀS FAMÍLIAS'} aceso={Math.max(janela(t, T.repara, T.em25, 0.4), janela(t, T.porque, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.65, 0, ZA]} sobe={di} larg={3.2} texto="PESSOAL · 2025" aceso={janela(t, T.em25, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.festejos - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1.5 - i) * 0.08}
            escala={1.0}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={atual[2] === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, pa.t, (PASTAS[i + 1]?.t ?? T.gastar) - 0.1, 0.4)}
          />
        );
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.6, 7.6, [dx, 1.2, 1]);
const ULT = SETORES.length - 1;
const OLHA_SETOR = (i0: number, perto = 1): Cam => {
  const i = Math.max(0, Math.min(ULT, i0));
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1, juntos: string[] = []): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    if (juntos.includes(e.s)) {
      // setor zerado e o vizinho num plano só, para a plaquinha do zero ficar na tela (regra 20)
      const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
      const c = (juntos[0] === e.s ? 0.35 : 0.65) + idx(juntos[0]);
      return [
        [e.t - 0.05, OLHA_SETOR(c, perto * 1.3)],
        [Math.max(e.t + 0.25, prox - 0.55), OLHA_SETOR(c + 0.05, perto * 1.28)],
      ];
    }
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const alto = e.s === 'edu' || e.s === 'sau' || e.s === 'adm' ? 1.15 : 1;
    const pp = perto * alto * (idx(e.s) >= 7 ? 1.08 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const [Y0, Y1, Y2] = ANOS;
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 1.55, 1]);
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha; depois de casinha em casinha (a agricultura, cinza, no fim)
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já foi comprometido além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.comprometeu + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // festas (2024, 2025, 2026) e a ajuda às famílias, da esquerda para a direita; depois agricultura e meio ambiente de 2026
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.25, 0.9, ZA], 8.0, 7.0, [0, 1.9, 1])],
      [T.f24 - 0.2, PG(meio(FX.f24.p, FX.f25.p), 3.6, 1.2, -0.05)],
      [T.f26 - 0.1, PG(meio(FX.f25.p, FX.f26.p), 3.8, 1.6, -0.03)],
      [T.bandas + 0.2, PG(FX.f25.p, 3.6, 1.5, -0.02)],
      [T.b24 - 0.2, PG(meio(FX.f26.p, FX.b24.p), 4.2, 1.2, 0)],
      [T.b25 - 0.1, PG(meio(FX.b24.p, FX.b26.p), 3.8, 0.9, 0.02)],
      [T.b26 + 0.3, PG(meio(FX.b25.p, FX.b26.p), 3.6, 0.9, 0.03)],
      [T.produtor - 0.1, PG(meio(FX.a26.p, FX.ma.p), 3.4, 0.9, 0.02)],
      [T.ma - 0.1, PG(soma(FX.ma.p, [0.35, 0, 0]), 3.2, 0.9, 0.03)],
      [T.em25 - 0.3, PG(soma(FX.ma.p, [0.5, 0, 0]), 3.4, 0.9, 0.03)],
    ],
  },
  // pessoal de 2025 (sempre para a direita)
  {
    ini: T.em25 - 0.2,
    arco: 0.03,
    chaves: [
      [T.em25 - 0.2, E([2.65, 1.2, ZA], 6.0, 6.2, [0, 1.8, 1])],
      [T.contratados - 0.1, PG(DI.con.p, 3.6, 2.4, -0.04)],
      [T.camara - 0.1, PG(meio(DI.con.p, DI.cam.p), 4.4, 2.0, -0.02)],
      [T.tribunal - 0.3, E([2.65, 1.2, ZA], 6.4, 6.4, [0.06, 1.8, 1])],
    ],
  },
  // tribunal: as quatro pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.festejos - 0.1, E(soma(posPasta(0), [0.2, 0.7, 0]), 4.0, 3.9, [-0.1, 1.5, 1])],
      [T.advogados - 0.1, E(soma(posPasta(1), [0, 0.7, 0]), 4.0, 3.9, [-0.04, 1.5, 1])],
      [T.outros - 0.1, E(soma(posPasta(2), [0, 0.7, 0]), 4.2, 4.0, [0, 1.5, 1])],
      [T.limpeza - 0.1, E(soma(posPasta(3), [-0.3, 0.7, 0]), 4.6, 4.3, [0.04, 1.5, 1])],
      [T.gastar - 0.2, E(meio(posPasta(0), posPasta(3)), 8.0, 6.2, [0.06, 1.6, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois as festas de 2026 e a ajuda às famílias de 2026
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E([-1.2, 0.9, ZA], 6.8, 6.4, [0, 1.8, 1])],
      [T.festas2 - 0.1, PG(FX.f26.p, 3.6, 1.6, -0.05)],
      [T.ajuda2 - 0.1, PG(meio(FX.f26.p, FX.b26.p), 5.4, 1.2, -0.02)],
      [T.segue - 0.1, PG(soma(meio(FX.f26.p, FX.b26.p), [0.2, 0, 0]), 5.6, 1.2, -0.02)],
      [T.segue + 0.8, E([0, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
      [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.04});
};

// ---------- Interface ----------
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.em25, T.tribunal, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 131,2 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'SOBROU R$ 1,2 MI · COM EMPRÉSTIMO DE R$ 7,4 MI', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 138,7 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 143,4 MILHÕES'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'R$ 4,7 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 113 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 110,8 MI', destaque: true},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'COMPROMETIDO: R$ 131,2 MI · ARRECADADO: R$ 113 MI', destaque: true},
  ];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.f24, texto: 'AGORA REPARA'},
    {a: T.f24, b: T.f25, texto: 'FESTAS E EVENTOS 2024: R$ 2,4 MI'},
    {a: T.f25, b: T.f26, texto: 'FESTAS E EVENTOS 2025: R$ 3,4 MI'},
    {a: T.f26, b: T.bandas, texto: 'FESTAS 2026 ATÉ SETEMBRO: R$ 4 MI', destaque: true},
    {a: T.bandas, b: T.beneficios, texto: 'BANDAS E GRUPOS MUSICAIS 2025: R$ 2 MI'},
    {a: T.beneficios, b: T.b24, texto: 'BENEFÍCIOS EVENTUAIS: AJUDA DE EMERGÊNCIA ÀS FAMÍLIAS'},
    {a: T.b24, b: T.b25, texto: 'AJUDA ÀS FAMÍLIAS 2024: R$ 183 MIL'},
    {a: T.b25, b: T.b26, texto: 'AJUDA ÀS FAMÍLIAS 2025: R$ 122 MIL'},
    {a: T.b26, b: T.produtor, texto: 'AJUDA ÀS FAMÍLIAS 2026 ATÉ SET: R$ 93 MIL', destaque: true},
    {a: T.produtor, b: T.salSec, texto: 'FEIRA, VIVEIRO, CASA DO PESCADOR: R$ 0 EM 2026', destaque: true},
    {a: T.salSec, b: T.ma, texto: 'AGRICULTURA E PESCA: SÓ SALÁRIOS E MANUTENÇÃO'},
    {a: T.ma, b: T.ma204, texto: 'MEIO AMBIENTE · AÇÕES 2026: R$ 14 MIL'},
    {a: T.ma204, b: T.em25, texto: 'SALÁRIOS DA SECRETARIA: R$ 204 MIL'},
    {a: T.em25, b: T.contratados, texto: 'SALÁRIOS E ENCARGOS 2025: R$ 75,6 MI'},
    {a: T.contratados, b: T.camara, texto: 'CONTRATADOS POR TEMPO DETERMINADO: R$ 16,4 MI', destaque: true},
    {a: T.camara, b: T.tribunal, texto: 'CÂMARA EM 2025: R$ 4,3 MI'},
    {a: T.tribunal, b: T.festejos, texto: 'TRIBUNAL DE CONTAS: PROCESSOS DE 2024 A 2026'},
    {a: T.festejos, b: T.advogados, texto: 'CONTRATAÇÕES ARTÍSTICAS DOS FESTEJOS JUNINOS 2026'},
    {a: T.advogados, b: T.outros, texto: '2 SOBRE ADVOGADOS PARA RECUPERAR O FUNDEF'},
    {a: T.outros, b: T.naoCond, texto: 'TRANSPORTE ESCOLAR · LIMPEZA PÚBLICA'},
    {a: T.naoCond, b: T.gastar, texto: 'ESTAR NO TRIBUNAL NÃO É CONDENAÇÃO'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.festas2, texto: 'GASTOU MAIS DO QUE ARRECADOU EM 2025'},
    {a: T.festas2, b: T.ajuda2, texto: 'POR QUE AS FESTAS JÁ LEVARAM R$ 4 MI EM 2026...', destaque: true},
    {a: T.ajuda2, b: T.segue, texto: '...E A AJUDA ÀS FAMÍLIAS, R$ 93 MIL?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE015 DEZ/2024 · TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE015 DEZ/2025 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: SIGA SET/2026 · RECEITA ARRECADADA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: SIGA SET/2026 · DESPESA LIQUIDADA'},
  {a: T.repara, b: T.tribunal, texto: 'FONTE: DESPESA POR AÇÃO 2024 A 2026 · TCM-BA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (09/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc = ESC_A, lado = LADO_A) => soma(c, [0, altTorre(v / esc, lado) + 0.3, 0]);
  // festas x ajuda às famílias
  const fimF = T.produtor - 0.2;
  r.push(
    {a: T.f24 + 0.5, b: fimF, p: topo(FX.f24.p, FX.f24.v), valor: 'R$ 2,4 MI', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.f25 + 0.5, b: fimF, p: topo(FX.f25.p, FX.f25.v), valor: 'R$ 3,4 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.f26 + 0.5, b: fimF, p: topo(FX.f26.p, FX.f26.v), valor: 'R$ 4 MI', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.b24 + 0.4, b: fimF, p: topo(FX.b24.p, 0.35 * ESC_A), valor: 'R$ 183 MIL', sub: 'AJUDA ÀS FAMÍLIAS · 2024', cor: CA[0]},
    {a: T.b25 + 0.4, b: fimF, p: topo(FX.b25.p, 0.35 * ESC_A), valor: 'R$ 122 MIL', sub: 'AJUDA · 2025', cor: CA[1]},
    {a: T.b26 + 0.4, b: fimF, p: topo(FX.b26.p, 0.35 * ESC_A), valor: 'R$ 93 MIL', sub: 'AJUDA · 2026', cor: CA[2]},
  );
  // agricultura e meio ambiente de 2026
  const fimA = T.em25 - 0.3;
  r.push(
    {a: T.zeroAgr + 0.3, b: fimA, p: topo(FX.a26.p, FX.a26.res), valor: 'R$ 0', sub: 'AÇÕES PARA PRODUTOR E PESCADOR · 2026', cor: C.alerta},
    {a: T.ma + 0.5, b: fimA, p: topo(FX.ma.p, 0.35 * ESC_A), valor: 'R$ 14 MIL', sub: 'AÇÕES DE MEIO AMBIENTE', cor: CA[2]},
    {a: T.ma204 + 0.5, b: fimA, p: topo(soma(FX.ma.p, [0.75, 0, 0]), FX.ma.sal), valor: 'R$ 204 MIL', sub: 'SALÁRIOS DA SECRETARIA', cor: CA[2]},
  );
  // pessoal de 2025
  const fimD = T.tribunal - 0.3;
  r.push(
    {a: T.pessoal + 0.8, b: T.contratados + 0.2, p: [2.65, 1.6, ZA], valor: 'R$ 75,6 MI', sub: 'SALÁRIOS E ENCARGOS · 2025', cor: tema.acento},
    {a: T.contratados + 0.6, b: fimD, p: topo(DI.con.p, DI.con.v, ESC_D), valor: 'R$ 16,4 MI', sub: 'CONTRATADOS POR TEMPO DETERMINADO', cor: CA[1]},
    {a: T.camara + 0.5, b: fimD, p: topo(DI.cam.p, DI.cam.v, ESC_D), valor: 'R$ 4,3 MI', sub: 'CÂMARA · 2025', cor: CA[1]},
  );
  // a pergunta
  r.push(
    {a: T.festas2 + 0.3, b: T.segue + 0.5, p: topo(FX.f26.p, FX.f26.v), valor: 'R$ 4 MI', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.ajuda2 + 0.3, b: T.segue + 0.5, p: topo(FX.b26.p, 0.35 * ESC_A), valor: 'R$ 93 MIL', sub: 'AJUDA ÀS FAMÍLIAS · 2026', cor: tema.acento},
  );
  return r;
};

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira
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

const noMapa = (t: number) => t < T.gastou24;
const soMapa = (t: number) => t < T.gastou24 - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.gastou24) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const miolo = vis(t, T.repara + 0.2, T.tribunal - 0.3) + vis(t, T.gastar, FIM + 2);
  const direita = t >= T.em25 - 0.1 && t < T.tribunal;
  const escalaTxt = miolo > 0.01 ? (direita ? 'AQUI, 1 PILHA = R$ 2 MI' : 'AQUI, 1 PILHA = R$ 250 MIL · BRANCO = PREVISTO') : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, miolo);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 56 ? 14 : seloAtual.texto.length > 48 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {escK > 0.01 ? (
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${miolo > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: escalaTxt.length > 52 ? 14 : 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escalaTxt}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    // na abertura, o selo da fonte entra depois que o selo grande do @ viaja para o cabeçalho
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, T.ano24 - 0.5, T.ano24 - 0.1));
    const k2 = Math.min(entra(t, T.ano24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · SIGA SET/2026 · TCM-BA' : 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA';
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: Math.max(k1, k2)}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(SEGURO.botoesX - 90, pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 72 : 56));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-64, 64, -128, 128, -192, 192, 256].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 60 ? 16 : chip.texto.length > 44 ? 19 : chip.texto.length > 32 ? 24 : 30} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 30 : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.3, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D (gerado com os tempos desta mesma voz) ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/itubera.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.f26, T.b26, T.zeroAgr, T.contratados];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('132 milhoes e 400'), quando('138 milhoes e 700'), quando('ja 113')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: 'baque', v: 0.2}));
  [T.f24, T.f25, T.f26, T.b24, T.b25, T.b26, T.ma, T.ma204, T.contratados, T.camara].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.zeroAgr, T.comprometeu].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.festas2, f: 'pop', v: 0.18});
  s.push({t: T.ajuda2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, 12.5, T.ano24 + 0.6, T.emprestimo + 1.0, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.0, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.f24 + 1.0, T.f25 + 1.0, T.f26 + 1.0, T.bandas + 1.0, T.b24 + 0.9, T.b25 + 0.8, T.b26 + 0.8,
  T.produtor + 1.2, T.zeroAgr + 0.8, T.salSec + 0.8, T.ma + 0.8, T.ma204 + 0.8,
  T.pessoal + 1.5, T.contratados + 1.2, T.camara + 1.0,
  T.tribunal + 0.6, T.festejos + 1.2, T.advogados + 0.8, T.outros + 0.8, T.limpeza + 0.6, T.naoCond + 0.8,
  T.gastar + 0.5, T.porque + 1.0, T.festas2 + 0.8, T.ajuda2 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItubera: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = (1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}))) * (1 + soquinho(t));
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [2.5, 0], clamp) : 0;
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
      <CabecalhoCidade tema={tema} cidade="ITUBERÁ" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festas:', 'R$ 4 mi.', 'Ajuda social:', 'R$ 93 mil.'];
export const CapaOrcamentoItubera: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 860}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITUBERÁ · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 12 ? 100 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
