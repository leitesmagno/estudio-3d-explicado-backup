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
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 099. orçamento de Guaratinga (BA) (perfil @eumagnoleite). MOLDE: 098 Floresta Azul / 097 Buerarema / 093 Ilhéus (brief _brief-lote-40.md).
// O Kit Mapas abre (voo até Guaratinga, as três receitas e a de 2024: projetos/099.../mapas/guaratinga.mp4)
// e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Setor = ação do PCMGE015 SIGA da Prefeitura + PCMGE015 da Câmara (UJ 177): ação 28.843
// "Administração da dívida pública" em Dívidas; função 13 e a ação "Festas tradicionais" em Cultura e festas; função 27 em Esporte.
// Sem porcentagem, sem nome de gestor, sem nome de empresa contratada.
// SÓ DADOS DE GUARATINGA, todos do TCM-BA: projetos/099.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 168.57; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, sem atempo, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '099. orçamento de guaratinga';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('A prefeitura arrecadou 87'),
  gastou24: quando('Gastou 92'),
  mais24: quando('5 milhoes e 300 a mais'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 95'),
  gastou25: quando('Gastou 93'),
  mais25: quando('Sobraram 2 milhoes'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 79'),
  gastou26: quando('Ja gastou 81'),
  mais26: quando('2 milhoes e 100 a mais'),
  comprometeu: quando('E ja comprometeu'),
  repara: quando('Agora repara'),
  f24: quando('as festas tradicionais nao'),
  f25: quando('foram 1 milhao e 500'),
  f26: quando('ja sao 2 milhoes e 300'),
  comparar: quando('Para comparar'),
  iptuV: quando('rendeu 334'),
  esp: quando('No esporte'),
  salarios: quando('a maior parte em salarios'),
  quadras: quando('Para quadras'),
  nada: quando('nada empenhado'),
  camara: quando('A Camara de Vereadores foi'),
  cam25: quando('para 4 milhoes em 2025'),
  consult: quando('So em consultoria'),
  tres: quando('mais de 3 vezes'),
  dividas: quando('E as dividas'),
  pagou: quando('a prefeitura pagou 11'),
  inss: quando('a divida parcelada com o INSS'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se as festas'),
  quadras2: quando('por que quadras'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'FESTAS'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.175 * Math.PI);
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
    ['obr', 'Obras e servicos'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['ass', 'Assistencia social'],
    ['agr', 'Agricultura e meio'],
    ['cul', 'Cultura e festas'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 92.306, rotulo: '2024', falta: {t: T.mais24, v: 5.3417, txt: 'A MAIS'}, entradas: lista(1, [38.826, 20.204, 8.4071, 10.444, 3.3078, 6.5098, 2.6397, 1.1986, 0.20872, 0.56142])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 93.115, rotulo: '2025', falta: {t: T.mais25, v: 2.7671, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [38.387, 21.559, 10.352, 7.6912, 3.9939, 4.6401, 2.5818, 1.2958, 1.686, 0.9291])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 81.836, rotulo: '2026 · ATÉ SET', falta: {t: T.mais26, v: 2.0901, txt: 'A MAIS'}, entradas: lista(3, [33.333, 19.723, 7.3632, 8.8141, 3.1414, 1.6697, 3.1181, 1.1575, 2.5102, 1.0067])},
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

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2025 usa cerca de 62 pilhas) ----------
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
    if (n < 0.0009) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.04, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Cada gaveta tem a sua escala (o placar diz qual).
const LADO_A = 3;
const PASSO_A = 0.25;
const ZA = 0.2;
// na frente, à esquerda (1 pilha = R$ 250 mil): as festas nos três anos, o IPTU de 2025 e o R$ 0 de quadras e ginásio (tudo na MESMA fila, regra do 097)
const ESC_A = 0.25;
const FA = {
  f24: {p: [-4.0, 0, ZA] as V3, v: 0},
  f25: {p: [-3.2, 0, ZA] as V3, v: 1.5203},
  f26: {p: [-2.3, 0, ZA] as V3, v: 2.3227},
  iptu: {p: [-1.25, 0, ZA] as V3, v: 0.33428},
  q26: {p: [-0.3, 0, ZA] as V3, v: 0},
};
const GAV_X = -2.1;
// atrás do cofre (1 pilha = R$ 250 mil): a Câmara 2024 e 2025, a consultoria dela em 2025 e a agricultura e meio ambiente 2025;
// à direita (1 pilha = R$ 1 mi): o que a prefeitura pagou de dívidas em 2024 e 2025 e a dívida parcelada com o INSS no fim de 2024
const ESC_D = 1;
const ZD = -2.0;
const CM = {
  c24: {p: [-3.1, 0, ZD] as V3, v: 3.3078},
  c25: {p: [-2.25, 0, ZD] as V3, v: 3.9939},
  cons: {p: [-1.4, 0, ZD] as V3, v: 0.4895},
  agr: {p: [-0.55, 0, ZD] as V3, v: 1.2958},
  p24: {p: [0.75, 0, ZD] as V3, v: 6.5098},
  p25: {p: [1.6, 0, ZD] as V3, v: 4.6401},
  inss: {p: [2.75, 0, ZD] as V3, v: 63.543},
};
// a gaveta sai na cena da casinha do esporte (ficava na frente da câmera) e volta no "Para quadras"
const FA_VIS = (t: number) => vis(t, T.repara - 0.2, T.esp - 0.15) + vis(t, T.quadras - 0.3, T.camara - 0.5) + vis(t, T.gastar - 0.1, FIM + 2);
const CM_VIS = (t: number) => vis(t, T.camara - 0.3, T.gastar - 0.2);

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
    // torre na frente do cofre: vermelha "A MAIS" (2024 e 2026), verde "SOBRARAM" (2025)
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (v: number, esc: number, k: number) => Math.max(0.3, v / esc) * k;
  // as festas (três anos; 2024 sem gasto = só a base cinza), o IPTU de 2025 e o R$ 0 de quadras e ginásio em 2026
  const fa = FA_VIS(t);
  if (fa > 0.01) {
    const zero = mistura(tema.objetoClaro, tema.fundo, 0.35);
    if (!final) {
      const k0 = cresce(T.f24 + 0.3) * fa;
      if (k0 > 0.01) solidas.push(...torre(FA.f24.p, 0.12 * k0, 2, zero, PASSO_A));
      const k1 = cresce(T.f25 + 0.3) * fa;
      if (k1 > 0.01) solidas.push(...torre(FA.f25.p, tAk(FA.f25.v, ESC_A, k1), LADO_A, CA[1], PASSO_A));
      const k3 = cresce(T.iptuV + 0.2) * fa;
      if (k3 > 0.01) solidas.push(...torre(FA.iptu.p, tAk(FA.iptu.v, ESC_A, k3), 2, mistura(CA[1], tema.objetoClaro, 0.45), PASSO_A));
    }
    const k2 = cresce(T.f26 + 0.3) * fa;
    if (k2 > 0.01) solidas.push(...torre(FA.f26.p, tAk(FA.f26.v, ESC_A, k2), LADO_A, CA[2], PASSO_A));
    const kq = cresce(T.nada + 0.1) * fa;
    if (kq > 0.01) solidas.push(...torre(FA.q26.p, 0.12 * kq, 2, zero, PASSO_A));
  }
  // a Câmara x agricultura e meio ambiente; as dívidas pagas e a dívida com o INSS
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    const a1 = cresce(T.camara + 0.6) * cm;
    if (a1 > 0.01) solidas.push(...torre(CM.c24.p, tAk(CM.c24.v, ESC_A, a1), LADO_A, CA[0], PASSO_A));
    const a2 = cresce(T.cam25 + 0.3) * cm;
    if (a2 > 0.01) solidas.push(...torre(CM.c25.p, tAk(CM.c25.v, ESC_A, a2), LADO_A, CA[1], PASSO_A));
    const a3 = cresce(T.consult + 0.3) * cm;
    if (a3 > 0.01) solidas.push(...torre(CM.cons.p, tAk(CM.cons.v, ESC_A, a3), 2, mistura(CA[1], tema.objetoClaro, 0.3), PASSO_A));
    const a4 = cresce(T.tres + 0.3) * cm;
    if (a4 > 0.01) solidas.push(...torre(CM.agr.p, tAk(CM.agr.v, ESC_A, a4), LADO_A, mistura(CA[1], tema.objetoClaro, 0.45), PASSO_A));
    const d1 = cresce(T.pagou + 0.3) * cm;
    if (d1 > 0.01) solidas.push(...torre(CM.p24.p, tAk(CM.p24.v, ESC_D, d1), LADO_A, CA[0], PASSO_A));
    if (d1 > 0.01) solidas.push(...torre(CM.p25.p, tAk(CM.p25.v, ESC_D, d1), LADO_A, CA[1], PASSO_A));
    const d2 = cresce(T.inss + 0.3) * cm;
    if (d2 > 0.01) solidas.push(...torre(CM.inss.p, tAk(CM.inss.v, ESC_D, d2), 4, C.alerta, PASSO_A));
  }
  return {solidas, fantasmas, torres};
};

// enfeites só no vão entre o Esporte (último) e a Educação (primeira), longe das casinhas dos setores
const CASAS: [V3, number][] = [
  [[-3.9, 0, 7.4], 0.45],
  [[-1.5, 0, 8.3], 0.15],
  [[0.95, 0, 8.4], -0.1],
];
const ARVORES: V3[] = [
  [-2.75, 0, 7.95],
  [-0.25, 0, 8.45],
  [-5.0, 0, 6.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  // a casinha sobe ~1 s ANTES da primeira menção (regra do 081: nada de gramado vazio)
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  // esporte: a casinha fica cinza no "nada empenhado" (quadras, ginásio e eventos em 2026) e segue cinza até o fim
  const cinza = s.id === 'esp' ? rampa(t, T.nada + 0.2, T.nada + 0.8) : 0;
  const aceso = Math.max(0, ...ditas);
  const e = 0.47;
  const props = {tema, pos: p, sobe, aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.2} gariX={-1.4} />;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={cinza} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const fa = FA_VIS(t);
  const cm = CM_VIS(t);
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

      {/* festas (três anos) x IPTU 2025 x quadras e ginásio 2026 (frente, à esquerda); Câmara x agricultura e as dívidas (atrás do cofre) */}
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={fa} larg={4.9} texto="FESTAS x IPTU x QUADRAS" aceso={Math.max(janela(t, T.repara, T.esp, 0.4), janela(t, T.quadras, T.camara, 0.4), janela(t, T.porque, T.segue, 0.4))} />
      <BaseGaveta tema={tema} pos={[-1.8, 0, ZD]} sobe={cm} larg={3.7} texto="CÂMARA x AGRICULTURA" aceso={janela(t, T.camara, T.dividas, 0.4)} />
      <BaseGaveta tema={tema} pos={[1.75, 0, ZD]} sobe={cm} larg={3.1} texto="DÍVIDAS" aceso={janela(t, T.dividas, T.gastar, 0.4)} />
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
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const alto = e.s === 'edu' || e.s === 'sau' || e.s === 'adm' ? 1.15 : 1;
    const pp = perto * alto * (idx(e.s) >= 8 ? 1.08 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const [Y0, Y1, Y2] = ANOS;
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre verde do que sobrou; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do que gastou a mais, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já gastou a mais
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.mais26 + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // as festas nos três anos (frente, à esquerda)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([GAV_X, 1.0, 0.6], 6.6, 6.4, [0, 1.7, 1])],
      [T.f24 - 0.1, E([-3.6, 0.8, 0.3], 3.9, 4.2, [-0.04, 1.3, 1])],
      [T.f26 - 0.4, E([-3.4, 0.85, 0.3], 3.9, 4.3, [-0.03, 1.3, 1])],
      [T.f26 + 0.1, E([-2.9, 0.9, 0.3], 3.9, 4.3, [-0.03, 1.3, 1])],
      [T.comparar - 0.4, E([-2.85, 0.9, 0.3], 4.0, 4.4, [-0.02, 1.3, 1])],
    ],
  },
  // o IPTU de 2025 ao lado das festas
  {
    ini: T.comparar - 0.1,
    arco: 0.03,
    chaves: [
      [T.comparar - 0.1, E([-2.2, 0.8, 0.3], 4.6, 4.6, [0, 1.3, 1])],
      [T.iptuV - 0.1, E([-2.0, 0.8, 0.3], 4.4, 4.4, [0.01, 1.3, 1])],
      [T.esp - 0.4, E([-2.0, 0.8, 0.3], 4.3, 4.3, [0.02, 1.3, 1])],
    ],
  },
  // a casinha do esporte (2026: a secretaria, a maior parte em salários)
  {
    ini: T.esp - 0.1,
    arco: 0.03,
    chaves: [
      [T.esp - 0.1, OLHA_SETOR(idx('esp'), 1.2)],
      [T.quadras - 0.4, OLHA_SETOR(idx('esp'), 1.12)],
    ],
  },
  // quadras, ginásio e eventos esportivos em 2026: nada empenhado
  {
    ini: T.quadras - 0.1,
    arco: 0.03,
    chaves: [
      [T.quadras - 0.1, E([-0.8, 0.6, 0.3], 3.9, 4.1, [0.02, 1.3, 1])],
      [T.camara - 0.4, E([-0.75, 0.6, 0.3], 3.8, 4.0, [0.03, 1.3, 1])],
    ],
  },
  // atrás do cofre: a Câmara 2024 e 2025, a consultoria dela e a agricultura e meio ambiente (2025)
  {
    ini: T.camara - 0.2,
    arco: 0.03,
    chaves: [
      [T.camara - 0.2, E(soma(meio(CM.c24.p, CM.c25.p), [0, 0.8, 0]), 3.7, 4.2, [-0.03, 1.3, 1])],
      [T.consult - 0.3, E(soma(meio(CM.c25.p, CM.cons.p), [0, 0.8, 0]), 3.7, 4.2, [-0.02, 1.3, 1])],
      [T.tres - 0.2, E(soma(meio(CM.c24.p, CM.agr.p), [0, 0.8, 0]), 4.7, 4.7, [-0.01, 1.3, 1])],
      [T.dividas - 0.4, E(soma(meio(CM.c24.p, CM.agr.p), [0, 0.8, 0]), 4.6, 4.6, [0.0, 1.3, 1])],
    ],
  },
  // as dívidas: o que a prefeitura pagou em 2024 e 2025 e a dívida parcelada com o INSS no fim de 2024
  {
    ini: T.dividas - 0.2,
    arco: 0.03,
    chaves: [
      [T.dividas - 0.2, E(soma(meio(CM.p24.p, CM.p25.p), [0, 0.9, 0]), 3.9, 4.4, [0.03, 1.4, 1])],
      [T.inss - 0.2, E(soma(meio(CM.p24.p, CM.inss.p), [0, 1.9, 0]), 5.6, 6.8, [0.04, 1.4, 1])],
      [T.gastar - 0.4, E(soma(meio(CM.p24.p, CM.inss.p), [0, 1.9, 0]), 5.5, 6.7, [0.05, 1.4, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois as festas de 2026 e o R$ 0 de quadras e ginásio
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-0.4, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E([-2.4, 1.0, 0.3], 3.9, 4.4, [-0.02, 1.3, 1])],
      [T.quadras2 - 0.4, E([-2.3, 1.0, 0.3], 3.9, 4.4, [-0.01, 1.3, 1])],
      [T.quadras2 + 0.2, E([-0.8, 0.6, 0.3], 3.9, 4.1, [0.02, 1.3, 1])],
      [T.segue - 0.5, E([-1.6, 0.8, 0.3], 6.0, 5.8, [0, 1.25, 1])],
      [T.segue + 0.8, E([-1.2, 1.0, ZA], 9.0, 7.2, [0.1, 1.3, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.comparar, T.esp, T.quadras, T.camara, T.dividas, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) =>
  v === 0 ? 'R$ 0' : v < 0.01 ? `R$ ${(v * 1000).toFixed(1).replace('.', ',').replace(/,0$/, '')} MIL` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 92,3 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 5,3 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 95,9 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 93,1 MI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 2,8 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 79,7 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 81,8 MI'},
    {a: T.mais26, b: T.comprometeu, texto: 'R$ 2,1 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'JÁ COMPROMETIDO (EMPENHADO): R$ 90,8 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.f24, texto: 'AGORA REPARA'},
    {a: T.f24, b: T.f25, texto: 'FESTAS TRADICIONAIS 2024: R$ 0', destaque: true},
    {a: T.f25, b: T.f26, texto: 'FESTAS TRADICIONAIS 2025: R$ 1,52 MI'},
    {a: T.f26, b: T.comparar, texto: 'FESTAS 2026 ATÉ SETEMBRO: R$ 2,32 MI', destaque: true},
    {a: T.comparar, b: T.iptuV, texto: 'PARA COMPARAR'},
    {a: T.iptuV, b: T.esp, texto: 'IPTU ARRECADADO EM 2025: R$ 334 MIL', destaque: true},
    {a: T.esp, b: T.salarios, texto: 'ESPORTE 2026 ATÉ SETEMBRO: R$ 1 MI'},
    {a: T.salarios, b: T.quadras, texto: 'SALÁRIOS E ENCARGOS: R$ 699 MIL'},
    {a: T.quadras, b: T.camara, texto: 'QUADRAS, GINÁSIO E EVENTOS: R$ 0 EMPENHADO', destaque: true},
    {a: T.camara, b: T.cam25, texto: 'CÂMARA DE VEREADORES 2024: R$ 3,3 MI'},
    {a: T.cam25, b: T.consult, texto: 'CÂMARA DE VEREADORES 2025: R$ 4 MI'},
    {a: T.consult, b: T.tres, texto: 'CONSULTORIA DA CÂMARA 2025: R$ 489,5 MIL', destaque: true},
    {a: T.tres, b: T.dividas, texto: 'AGRICULTURA E MEIO AMBIENTE 2025: R$ 1,3 MI', destaque: true},
    {a: T.dividas, b: T.pagou, texto: 'E AS DÍVIDAS?'},
    {a: T.pagou, b: T.inss, texto: 'PAGOU EM 2024 E 2025: R$ 11,1 MI'},
    {a: T.inss, b: T.gastar, texto: 'DÍVIDA PARCELADA COM O INSS (FIM DE 2024): R$ 63,5 MI', destaque: true},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.quadras2, texto: 'FESTAS EM 2026: R$ 2,3 MI...', destaque: true},
    {a: T.quadras2, b: T.segue, texto: '...QUADRAS E GINÁSIO: R$ 0 EMPENHADO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E PCMGE015 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE015 DEZ/2025 (PREFEITURA E CÂMARA) · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: PCMGE016 E PCMGE015 SET/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: PCMGE015 SET/2026 (PREFEITURA E CÂMARA) · LIQUIDADO'},
  {a: T.repara, b: T.comparar, texto: 'FONTE: AÇÃO "FESTAS TRADICIONAIS" (PCMGE015) · TCM-BA'},
  {a: T.comparar, b: T.esp, texto: 'FONTE: RECEITA (PCMGE016) DEZ/2025 · TCM-BA'},
  {a: T.esp, b: T.camara, texto: 'FONTE: PCMGE015 SET/2026 · AÇÕES DO ESPORTE · TCM-BA'},
  {a: T.camara, b: T.dividas, texto: 'FONTE: PCMGE015 DA CÂMARA DEZ/2024 E DEZ/2025 · TCM-BA'},
  {a: T.dividas, b: T.gastar, texto: 'FONTE: PCMGE015 E ANEXO 16 (DÍVIDA FUNDADA) 2024'},
];
const LAT = 90; // regra 73: margem lateral mínima de 90 px para tudo que importa
const larg = (r: {valor: string; sub?: string}) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
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
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: v < 0.01 ? C.alerta : CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  const pe = (c: V3) => topo(c, 0.3, 1, 2); // torrinha baixa: a plaquinha fica no topo (fora do letreiro da gaveta)
  // as festas, o IPTU e o R$ 0 de quadras e ginásio; a casinha do esporte (2026)
  const fimF = T.esp - 0.1;
  const esp = idx('esp');
  r.push(
    {a: T.f24 + 0.4, b: fimF, p: pe(FA.f24.p), valor: 'R$ 0', sub: 'FESTAS · 2024', cor: CA[0]},
    {a: T.f25 + 0.5, b: fimF, p: topo(FA.f25.p, FA.f25.v, ESC_A), valor: 'R$ 1,52 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.f26 + 0.5, b: fimF, p: topo(FA.f26.p, FA.f26.v, ESC_A), valor: 'R$ 2,32 MI', sub: 'FESTAS · 2026 ATÉ SET', cor: CA[2]},
    {a: T.iptuV + 0.4, b: fimF, p: pe(FA.iptu.p), valor: 'R$ 334 MIL', sub: 'IPTU · 2025 INTEIRO', cor: C.alerta},
    {a: T.esp + 0.4, b: T.quadras - 0.1, p: soma(posTorre(esp, 2), [0, altFina(1.0067) + 0.35, 0]), valor: 'R$ 1 MI', sub: 'ESPORTE · 2026 ATÉ SET', cor: CA[2]},
    {a: T.salarios + 0.3, b: T.quadras - 0.1, p: soma(posTorre(esp, 2), [0, altFina(1.0067) + 2.1, 0]), valor: 'R$ 699 MIL', sub: 'SALÁRIOS E ENCARGOS · 2026'},
    {a: T.nada + 0.3, b: T.camara - 0.2, p: pe(FA.q26.p), valor: 'R$ 0', sub: 'QUADRAS E GINÁSIO · 2026', cor: C.alerta},
    {a: T.nada + 0.3, b: T.camara - 0.2, p: pe(FA.iptu.p), valor: 'R$ 334 MIL', sub: 'IPTU · 2025'},
  );
  // a Câmara x agricultura e as dívidas
  r.push(
    {a: T.camara + 1.0, b: T.dividas - 0.1, p: topo(CM.c24.p, CM.c24.v, ESC_A), valor: 'R$ 3,3 MI', sub: 'CÂMARA · 2024', cor: CA[0]},
    {a: T.cam25 + 0.5, b: T.dividas - 0.1, p: topo(CM.c25.p, CM.c25.v, ESC_A), valor: 'R$ 4 MI', sub: 'CÂMARA · 2025', cor: CA[1]},
    {a: T.consult + 0.5, b: T.dividas - 0.1, p: topo(CM.cons.p, CM.cons.v, ESC_A, 2), valor: 'R$ 489 MIL', sub: 'CONSULTORIA · 2025', cor: C.alerta},
    {a: T.tres + 0.4, b: T.dividas - 0.1, p: topo(CM.agr.p, CM.agr.v, ESC_A), valor: 'R$ 1,3 MI', sub: 'AGRICULTURA · 2025'},
    {a: T.pagou + 0.6, b: T.gastar - 0.2, p: topo(CM.p24.p, CM.p24.v, ESC_D), valor: 'R$ 6,5 MI', sub: 'DÍVIDAS PAGAS · 2024', cor: CA[0]},
    {a: T.pagou + 0.8, b: T.gastar - 0.2, p: topo(CM.p25.p, CM.p25.v, ESC_D), valor: 'R$ 4,6 MI', sub: 'DÍVIDAS PAGAS · 2025', cor: CA[1]},
    {a: T.inss + 0.6, b: T.gastar - 0.2, p: topo(CM.inss.p, CM.inss.v, ESC_D, 4), valor: 'R$ 63,5 MI', sub: 'INSS · FIM DE 2024', cor: C.alerta},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.5, p: topo(FA.f26.p, FA.f26.v, ESC_A), valor: 'R$ 2,3 MI', sub: 'FESTAS · 2026', cor: tema.acento},
    {a: T.quadras2 + 0.3, b: T.segue + 0.5, p: pe(FA.q26.p), valor: 'R$ 0', sub: 'QUADRAS E GINÁSIO · 2026', cor: tema.acento},
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
  const miolo = vis(t, T.repara + 0.2, T.esp - 0.2) + vis(t, T.quadras, FIM + 2);
  const umMi = t >= T.dividas && t < T.gastar;
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : umMi ? 'AQUI, 1 PILHA = R$ 1 MILHÃO' : 'AQUI, 1 PILHA = R$ 250 MIL';
  const escK = Math.max(placarK, miolo);
  const cabecalho = (
    <div style={{position: 'absolute', left: LAT, right: LAT, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
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
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · PCMGE016 SET/2026 · TCM-BA' : 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA';
    return (
      <div style={{position: 'absolute', left: LAT, right: LAT, top: 400, opacity: Math.max(k1, k2)}}>
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
      // regra 73: a plaquinha inteira fica a 90 px ou mais das laterais (o Reels em tela cheia come as bordas)
      const meia = larg(r) / 2;
      return {i, x: Math.max(LAT + meia, Math.min(W - LAT - meia, SEGURO.botoesX - 90, pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
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
        <div style={{position: 'absolute', left: LAT, right: LAT, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/guaratinga.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 30).map((e) => e.t)), T.f26, T.iptuV, T.nada, T.consult, T.tres, T.inss];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('87 milhoes em 2024'), quando('95 milhoes e 900'), quando('79 milhoes e 700')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.f25, T.esp, T.salarios, T.camara, T.cam25, T.pagou].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.f24, T.f26, T.iptuV, T.nada, T.consult, T.tres, T.inss].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.quadras2].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, 12.5, T.ano24 + 0.6, T.arrec24 + 1.2, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.mais26 + 1.0, T.comprometeu + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.f24 + 1.2, T.f25 + 1.2, T.f26 + 1.4, T.comparar + 0.8, T.iptuV + 1.0, T.esp + 1.0, T.salarios + 0.9, T.quadras + 0.8, T.nada + 0.9,
  T.camara + 1.4, T.cam25 + 1.0, T.consult + 1.0, T.tres + 1.2, T.dividas + 0.6, T.pagou + 1.6, T.inss + 1.4,
  T.gastar + 0.5, T.porque + 1.2, T.quadras2 + 1.0, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoGuaratinga: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="GUARATINGA" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festas:', 'R$ 2,3 mi.', 'Quadras:', 'R$ 0.'];
export const CapaOrcamentoGuaratinga: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · GUARATINGA · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 100 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
