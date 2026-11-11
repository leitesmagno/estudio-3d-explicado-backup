import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS, RoloCompactador} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from './pecas';
import {PALAVRAS} from './palavras';

// 035. orçamento de paratinga (perfil @eumagnoleite, série Magno Explica). MOLDE: 034 (Canavieiras v5).
// O Kit Mapas abre (voo até Paratinga e o que a prefeitura arrecadou em 2024: projetos/035.../mapas/paratinga.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz
// fala um setor, as pilhas saem dessa pilha e voam para a casinha do setor (pedido da pessoa, 06/11/2026). As casinhas ficam na
// borda NA ORDEM DA FALA, então a câmera anda sempre no mesmo sentido; na virada de ano ela sobe e recomeça (sem voltar pela mesa).
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE PARATINGA, todos do TCM-BA: audio/fontes.md. Plano: plano.md (v1, aprovado).

export const FPS = 30;
const AUDIO_SEG = 176.28; // narração v2 (sem nomes), pausas de 0,28 s, acelerada 1,2x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '035. orçamento de paratinga';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 141'),
  gastou24: quando('Gastou 151'),
  falt24: quando('Gastou 9'),
  nemExiste: quando('nem existe'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 153'),
  gastou25: quando('Gastou 160', 2), // a 1ª vez é a frase de abertura ("Paratinga gastou 160 milhões")
  falt25: quando('De novo 6'),
  fora25: quando('de novo fora'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 126'),
  gastou26: quando('Ja gastou'),
  falt26: quando('Sao 14'),
  repara: quando('Agora repara'),
  festas: quando('vai para festas'),
  tresAnos: quando('nos tres anos'),
  familias: quando('ajuda as familias'),
  secretaria: quando('Na secretaria de obras'),
  limp206: quando('limpeza tinha 206'),
  terminou: quando('terminou com 6'),
  asf2: quando('O asfalto e o calcamento'),
  usaram: quando('usaram so'),
  mesma: quando('a mesma coisa'),
  limp26: quando('limpeza ja passou'),
  asf50: quando('asfalto ficou em 50'),
  volta: quando('O asfalto entregue'),
  governo: quando('Governo do Estado'),
  tribunal: quando('No Tribunal de Contas'),
  agua: quando('concessao da agua'),
  parar: quando('mandou parar'),
  cancelou: quando('prefeitura cancelou'),
  pneus: quando('compra de pneus'),
  cancelada: quando('denunciada e cancelada'),
  analisa: quando('ainda analisa'),
  advoc: quando('escritorio de advocacia'),
  remedios: quando('compra de remedios'),
  transp: quando('o transporte escolar'),
  gastar: quando('Gastar nao'),
  festaCresce: quando('a festa cresce'),
  asfNao: quando('o asfalto nao sai'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 14 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | 'defesa' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO DA PREFEITURA', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA E FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE E LAZER', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['def', 'ani'];
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroAgora && zeroProx ? 0.09 * Math.PI : zeroAgora || zeroProx ? 0.115 * Math.PI : 0.13 * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [1.0, 1.85, 1.42][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number}; zero?: number};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 151.21,
    rotulo: '2024',
    falta: {t: T.falt24, v: 9.38},
    zero: quando('Defesa civil'),
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 66.385},
      {s: 'sau', t: quando('Saude'), v: 35.002},
      {s: 'adm', t: quando('Administracao'), v: 20.481},
      {s: 'obr', t: quando('Obras e servicos'), v: 12.43},
      {s: 'cam', t: quando('Camara'), v: 3.452},
      {s: 'div', t: quando('Dividas'), v: 4.838},
      {s: 'cul', t: quando('Cultura'), v: 2.646},
      {s: 'ass', t: quando('Assistencia social'), v: 2.173},
      {s: 'agu', t: quando('Agua e saneamento'), v: 1.69},
      {s: 'agr', t: quando('Agricultura'), v: 0.809},
      {s: 'esp', t: quando('Esporte'), v: 0.746},
      {s: 'mam', t: quando('Meio ambiente'), v: 0.446},
      {s: 'def', t: quando('Defesa civil'), v: 0},
      {s: 'ani', t: quando('protecao animal'), v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 159.85,
    rotulo: '2025',
    falta: {t: T.falt25, v: 6.13},
    zero: quando('Defesa civil', 2),
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 72.421},
      {s: 'sau', t: quando('Saude', 2), v: 35.284},
      {s: 'adm', t: quando('Administracao', 2), v: 22.588},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 13.71},
      {s: 'cam', t: quando('Camara', 2), v: 4.687},
      {s: 'div', t: quando('Dividas', 2), v: 3.53},
      {s: 'cul', t: quando('Cultura', 2), v: 2.041},
      {s: 'ass', t: quando('Assistencia social', 2), v: 1.794},
      {s: 'agu', t: quando('Agua e saneamento', 2), v: 1.545},
      {s: 'agr', t: quando('Agricultura', 2), v: 0.713},
      {s: 'esp', t: quando('Esporte', 2), v: 0.915},
      {s: 'mam', t: quando('Meio ambiente', 2), v: 0.526},
      {s: 'def', t: quando('Defesa civil', 2), v: 0},
      {s: 'ani', t: quando('protecao animal', 2), v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    gastou: T.gastou26,
    total: 140.85,
    rotulo: '2026 · ATÉ SET',
    falta: {t: T.falt26, v: 14.3},
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 64.309},
      {s: 'sau', t: quando('Saude', 3), v: 29.916},
      {s: 'adm', t: quando('Administracao', 3), v: 20.987},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 10.166},
      {s: 'cam', t: quando('Camara', 3), v: 3.71},
      {s: 'div', t: quando('Dividas', 3), v: 3.536},
      {s: 'cul', t: quando('Cultura', 3), v: 3.057},
      {s: 'ass', t: quando('Assistencia social', 3), v: 2.067},
      {s: 'agu', t: quando('Agua e saneamento', 3), v: 0.973},
      {s: 'agr', t: quando('e agricultura'), v: 0.986},
      {s: 'esp', t: quando('Esporte', 3), v: 0.654},
      {s: 'mam', t: quando('Meio ambiente', 3), v: 0.458},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)!.t]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

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
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;
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

// ---------- A pilha do ano em volta do cofre ----------
// lugares em três anéis, ordenados no MESMO sentido dos setores, a partir da frente da Educação
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 26],
      [2.25, 31],
      [2.75, 36],
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
// cada entrada ganha os seus lugares (em sequência) e os seus destinos (a torre do ano, ao lado da casinha)
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
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
      v.push({de: LUGARES[lugar % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.035, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.secretaria - 0.2, T.secretaria + 0.6);
const FALTA_POS: V3 = [0, 0, 3.65];

// ---------- As gavetas da secretaria de obras (miolo da mesa, depois que o cofre sai) ----------
const ESC_OBRA = 0.2; // aqui, 1 pilha = R$ 200 mil
const GAV = {
  limp25: [-1.95, 0, 1.25] as V3,
  limp26: [-0.95, 0, 1.25] as V3,
  asf25: [0.95, 0, 1.25] as V3,
  asf26: [1.95, 0, 1.25] as V3,
};
const OBRA = {limp25: {res: 0.206, usou: 6.52}, limp26: {res: 0.206, usou: 5.2}, asf25: {res: 2.06, usou: 0.12}, asf26: {res: 1.7, usou: 0.05}};
const GAVETAS_VIS = (t: number) => vis(t, T.secretaria + 0.2, T.tribunal - 0.1) + vis(t, T.gastar, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.35];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: [number, string][]; cor: 'alerta' | 'neutro'}[] = [
  {titulo: 'ÁGUA E ESGOTO', valor: 'R$ 39 MI', t: T.agua, carimbos: [[T.parar, 'SUSPENSA'], [T.cancelou, 'CANCELADA']], cor: 'alerta'},
  {titulo: 'PNEUS', valor: 'R$ 2 MI', t: T.pneus, carimbos: [[T.cancelada, 'CANCELADA']], cor: 'alerta'},
  {titulo: 'ADVOCACIA', valor: 'R$ 2 MI', t: T.advoc, carimbos: [[T.advoc + 0.5, 'EM ANÁLISE']], cor: 'neutro'},
  {titulo: 'REMÉDIOS', t: T.remedios, carimbos: [[T.remedios + 0.4, 'EM ANÁLISE']], cor: 'neutro'},
  {titulo: 'TRANSPORTE ESCOLAR', t: T.transp, carimbos: [[T.transp + 0.4, 'EM ANÁLISE']], cor: 'neutro'},
];
const posPasta = (i: number): V3 => [-2.6 + i * 1.3, 0, -0.55 + Math.abs(i - 2) * 0.25];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);
const ANG_VOLTA = ANGS[ANGS.length - 1] + 0.19 * Math.PI;
const POS_VOLTA: V3 = [Math.sin(ANG_VOLTA) * 7.1, 0, Math.cos(ANG_VOLTA) * 7.1];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  if (some > 0.01) {
    // o que foi gasto a mais: torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    });
    // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
    ANOS.forEach((y, yi) => {
      VOOS[yi].forEach((v, j) => {
        const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
        if (nasce <= 0.01) return;
        const k = rampa(t, v.t0, v.t0 + 0.75);
        if (k <= 0) torres.push({p: v.de, n: v.n * nasce, cor: CA[yi]});
        else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n * some, cor: CA[yi]});
      });
    });
  }
  // gavetas: tracejado (reservado) e sólido (usado), aqui 1 pilha = R$ 200 mil
  const g = GAVETAS_VIS(t);
  if (g > 0.01) {
    const par = (chave: keyof typeof GAV, tRes: number, tUsou: number, cor: string) => {
      const o = OBRA[chave];
      const r = rampa(t, tRes, tRes + 0.6) * g;
      const u = rampa(t, tUsou, tUsou + 1.3) * g;
      if (r > 0.01) fantasmas.push(...torre(GAV[chave], (o.res / ESC_OBRA) * r, LADO, tema.objetoClaro));
      if (u > 0.01) solidas.push(...torre(GAV[chave], Math.max(0.12, o.usou / ESC_OBRA) * u, LADO, cor));
    };
    par('limp25', T.limp206, T.terminou, CA[1]);
    par('asf25', T.asf2, T.usaram, CA[1]);
    par('limp26', T.limp26 - 0.3, T.limp26, CA[2]);
    par('asf26', T.asf50 - 0.3, T.asf50, CA[2]);
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-5.6, 0, 6.6],
  [-7.6, 0, 3.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.festas, T.secretaria, 0.4), janela(t, T.festaCresce, FIM + 1, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.tresAnos, T.secretaria, 0.4));
  if (s.id === 'obr') aceso = Math.max(aceso, janela(t, T.secretaria, T.tribunal, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, T.limp206 - 0.5, T.limp206 + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - T.limp206))} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'agua':
      return <EstacaoSaneamento {...props} />;
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.45 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
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
  const g = GAVETAS_VIS(t);
  const pk = PASTAS_VIS(t);
  const ass = SETORES[idx('ass')];
  const pAss = noAnel(idx('ass'), R_PREDIO - 1.35);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* famílias na porta da assistência social */}
      {[0, 1, 2].map((k) => {
        const a = rampa(t, T.familias + k * 0.15, T.familias + k * 0.15 + 0.4) * (1 - rampa(t, T.secretaria, T.secretaria + 0.4));
        if (a < 0.02 || !ass) return null;
        const tg: V3 = [Math.cos(ang(idx('ass'))), 0, -Math.sin(ang(idx('ass')))];
        return <Boneco key={k} tema={tema} pos={soma(pAss, [tg[0] * (k - 1) * 0.42, 0.04, tg[2] * (k - 1) * 0.42])} rotY={ang(idx('ass'))} escala={0.3 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.25 + 0.2 * k)} />;
      })}

      {/* secretaria de obras: as duas gavetas */}
      <BaseGaveta tema={tema} pos={[-1.45, 0, 1.25]} sobe={g} texto="LIMPEZA" aceso={Math.max(janela(t, T.limp206, T.asf2, 0.4), janela(t, T.limp26, T.asf50, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.45, 0, 1.25]} sobe={g} texto="ASFALTO E CALÇAMENTO" aceso={Math.max(janela(t, T.asf2, T.mesma, 0.4), janela(t, T.asf50, T.volta, 0.4), janela(t, T.asfNao, FIM + 1, 0.4))} />
      {g > 0.05 ? <RoloCompactador tema={tema} pos={[2.75, 0, 0.35]} rotY={-0.6} escala={0.32 * Math.min(1, g)} giro={0} /> : null}

      {/* Volta da Serra: a rua que o Governo do Estado entregou em 2024 */}
      <RuaPlaca tema={tema} pos={POS_VOLTA} rotY={ANG_VOLTA + Math.PI} escala={0.95} sobe={vis(t, T.volta - 0.2, FIM + 2)} linhas={['VOLTA DA SERRA', 'GOVERNO DO ESTADO · 2024', 'R$ 1,5 MI']} aceso={janela(t, T.governo, T.tribunal, 0.4)} />
      {vis(t, T.volta, FIM + 2) > 0.05 ? <CarroRua tema={tema} pos={soma(POS_VOLTA, [Math.cos(ANG_VOLTA) * 0.9, 0.06, -Math.sin(ANG_VOLTA) * 0.9])} rotY={ANG_VOLTA + Math.PI / 2} escala={0.26} farol={0} /> : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(2 - i) * 0.08}
            escala={0.78}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={pa.cor === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
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
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.2, 7.2, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 8 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
};
const ZERO_CAM = OLHA_SETOR(12.5, 1.25);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.falt24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, Y0.zero! - 0.2)]},
  {ini: Y0.zero! - 0.1, arco: 0.04, chaves: [[Y0.zero! - 0.1, ZERO_CAM], [T.ano25 - 0.2, OLHA_SETOR(12.5, 1.35)]]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, Y1.zero! - 0.2, 1.12)]},
  {ini: Y1.zero! - 0.1, arco: 0.04, chaves: [[Y1.zero! - 0.1, ZERO_CAM], [T.ano26 - 0.2, OLHA_SETOR(12.5, 1.35)]]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // festas: sobe e mergulha entre o palco e a assistência (vizinhos na mesa)
  {ini: T.repara - 0.1, arco: 0.05, chaves: [[T.repara - 0.1, DE_CIMA(-0.1)], [T.festas - 0.2, OLHA_SETOR(6.5, 1.5)], [T.familias, OLHA_SETOR(6.6, 1.45)], [T.secretaria - 0.2, OLHA_SETOR(6.7, 1.5)]]},
  // secretaria de obras: sobe e mergulha no miolo; da limpeza (esquerda) para o asfalto (direita), depois para a borda
  {
    ini: T.secretaria - 0.1,
    arco: 0.03,
    chaves: [
      [T.secretaria - 0.1, E([0, 0.6, 1.2], 8.4, 6.6, [0, 1.25, 1])],
      [T.limp206 - 0.2, E([-1.45, 1.4, 1.3], 4.6, 5.4, [-0.05, 0.75, 1])],
      [T.asf2 - 0.3, E([-1.3, 1.4, 1.3], 4.6, 5.4, [-0.02, 0.75, 1])],
      [T.asf2 + 0.2, E([1.45, 1.0, 1.3], 4.6, 5.0, [0.05, 0.75, 1])],
      [T.mesma - 0.1, E([1.3, 1.0, 1.3], 4.8, 5.0, [0.05, 0.75, 1])],
      [T.mesma + 0.3, E([0, 1.3, 1.3], 7.2, 6.2, [0.1, 0.85, 1])],
      [T.volta - 0.3, E([0.3, 1.2, 1.3], 7.4, 6.2, [0.15, 0.85, 1])],
    ],
  },
  {ini: T.volta - 0.2, arco: 0.04, chaves: [[T.volta - 0.2, E(soma(POS_VOLTA, [0, 0.9, 0]), 3.8, 3.6, [-Math.sin(ANG_VOLTA) * 0.8, 0.75, -Math.cos(ANG_VOLTA) * 0.8])], [T.tribunal - 0.3, E(soma(POS_VOLTA, [0, 0.9, 0]), 3.6, 3.4, [-Math.sin(ANG_VOLTA) * 0.8, 0.75, -Math.cos(ANG_VOLTA) * 0.8])]]},
  // tribunal: as pastas da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 8.6, 6.8, [0, 0.9, 1])],
      [T.agua, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.4, 4.2, [-0.1, 0.55, 1])],
      [T.cancelou + 0.3, E(soma(posPasta(0), [0.4, 0.9, 0]), 4.4, 4.2, [-0.08, 0.55, 1])],
      [T.pneus, E(soma(posPasta(1), [0, 0.9, 0]), 4.2, 4.2, [-0.05, 0.55, 1])],
      [T.analisa, E(soma(posPasta(2), [0, 0.9, 0]), 5.2, 4.6, [0, 0.6, 1])],
      [T.remedios, E(soma(posPasta(3), [0, 0.9, 0]), 4.8, 4.4, [0.05, 0.6, 1])],
      [T.transp, E(soma(posPasta(4), [-0.2, 0.9, 0]), 4.8, 4.4, [0.08, 0.6, 1])],
      [T.gastar - 0.2, E([0.6, 1.0, -0.9], 7.4, 6.2, [0.1, 0.8, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o palco e a gaveta vazia do asfalto
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.festaCresce - 0.3, OLHA_SETOR(6, 1.12)], [T.asfNao - 0.4, OLHA_SETOR(6.05, 1.1)], [T.asfNao - 0.1, E([1.45, 1.0, 1.3], 5.2, 5.0, [0.1, 0.8, 1])], [T.segue, E([1.2, 1.0, 1.3], 5.6, 5.2, [0.15, 0.85, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
const ESTADOS: [number, string][] = [
  [0, 'PARATINGA · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.secretaria, 'A SECRETARIA DE OBRAS'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 100) * 10} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falt24, texto: 'GASTOU EM 2024: R$ 151,2 MILHÕES'},
    {a: T.falt24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 9,4 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: Y0.zero!, b: T.nemExiste, texto: 'DEFESA CIVIL E PROTEÇÃO ANIMAL: R$ 0', destaque: true},
    {a: T.nemExiste, b: T.ano25, texto: 'NEM EXISTE UMA LINHA PARA ELAS NO ORÇAMENTO', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 153,7 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 159,9 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'DE NOVO: R$ 6,1 MI A MAIS', destaque: true},
    {a: Y1.zero!, b: T.ano26, texto: 'DEFESA CIVIL E PROTEÇÃO ANIMAL: DE NOVO FORA DO ORÇAMENTO', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 126,6 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 140,9 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: Y2.entradas[0].t, texto: 'R$ 14,3 MI A MAIS, ATÉ SETEMBRO', destaque: true},
  ];
  ANOS.forEach((y) => {
    const ents = y.entradas.filter((e) => !ZERADOS.includes(e.s));
    ents.forEach((e, k) => {
      const prox = k + 1 < ents.length ? ents[k + 1].t : (y.zero ?? y.fim);
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.festas, b: T.tresAnos, texto: 'QUASE TODA A CULTURA VAI PARA FESTAS'},
    {a: T.tresAnos, b: T.secretaria, texto: 'NOS 3 ANOS: FESTAS LEVARAM MAIS QUE A ASSISTÊNCIA SOCIAL', destaque: true},
    {a: T.secretaria, b: T.limp206, texto: 'SECRETARIA DE OBRAS: O DINHEIRO MUDOU DE LUGAR'},
    {a: T.limp206, b: T.terminou, texto: 'LIMPEZA 2025: RESERVADO R$ 206 MIL'},
    {a: T.terminou, b: T.asf2, texto: 'LIMPEZA 2025: TERMINOU COM R$ 6,5 MI', destaque: true},
    {a: T.asf2, b: T.usaram, texto: 'ASFALTO E CALÇAMENTO 2025: RESERVADO R$ 2 MI'},
    {a: T.usaram, b: T.mesma, texto: 'USOU SÓ R$ 120 MIL', destaque: true},
    {a: T.mesma, b: T.asf50, texto: '2026: LIMPEZA JÁ PASSOU DE R$ 5 MI'},
    {a: T.asf50, b: T.volta, texto: '2026: ASFALTO FICOU EM R$ 50 MIL', destaque: true},
    {a: T.volta, b: T.tribunal, texto: 'VOLTA DA SERRA, 2024: OBRA DO GOVERNO DO ESTADO'},
    {a: T.tribunal, b: T.agua, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.agua, b: T.parar, texto: 'CONCESSÃO DA ÁGUA E DO ESGOTO: R$ 39 MI'},
    {a: T.parar, b: T.cancelou, texto: 'DENUNCIADA. O TRIBUNAL MANDOU PARAR', destaque: true},
    {a: T.cancelou, b: T.pneus, texto: 'A PREFEITURA CANCELOU'},
    {a: T.pneus, b: T.analisa, texto: 'PNEUS: R$ 2 MI · DENUNCIADA E CANCELADA'},
    {a: T.analisa, b: T.advoc, texto: 'O TRIBUNAL AINDA ANALISA'},
    {a: T.advoc, b: T.remedios, texto: 'ESCRITÓRIO DE ADVOCACIA: HONORÁRIOS DE R$ 2 MI'},
    {a: T.remedios, b: T.transp, texto: 'A COMPRA DE REMÉDIOS'},
    {a: T.transp, b: T.gastar, texto: 'O TRANSPORTE ESCOLAR'},
    {a: T.gastar, b: T.festaCresce, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festaCresce, b: T.asfNao, texto: 'A FESTA CRESCE...', destaque: true},
    {a: T.asfNao, b: T.segue, texto: '...E O ASFALTO NÃO SAI?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.repara, b: T.volta, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.volta, b: T.tribunal, texto: 'FONTE: BAHIA NOTÍCIAS, 22/12/2024'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · 06/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  // festas x assistência social, nos três anos
  ['cul', 'ass'].forEach((id) =>
    [0, 1, 2].forEach((k) => {
      const v = valorDe(id, k);
      r.push({a: T.tresAnos + 0.3 + k * 0.45, b: T.secretaria, p: soma(posTorre(idx(id), k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: `${ANO_SUB[k]} · ${id === 'cul' ? 'FESTAS' : 'ASSISTÊNCIA'}`, cor: CA[k]});
    }),
  );
  // gavetas da secretaria de obras
  const topo = (chave: keyof typeof GAV, v: number) => soma(GAV[chave], [0, altTorre(Math.max(v, OBRA[chave].res) / ESC_OBRA, LADO) + 0.3, 0]);
  r.push(
    {a: T.limp206 + 0.4, b: T.terminou + 0.2, p: topo('limp25', 0), valor: 'RESERVADO R$ 206 MIL'},
    {a: T.terminou + 1.0, b: T.tribunal - 0.1, p: topo('limp25', OBRA.limp25.usou), valor: 'R$ 6,5 MI', sub: '2025 · LIMPEZA', cor: CA[1]},
    {a: T.asf2 + 0.5, b: T.tribunal - 0.1, p: topo('asf25', 0), valor: 'R$ 2 MI RESERVADO', sub: '2025 · ASFALTO'},
    {a: T.usaram + 0.4, b: T.tribunal - 0.1, p: soma(GAV.asf25, [0, 0.55, 0]), valor: 'USOU R$ 120 MIL', cor: CA[1]},
    {a: T.limp26 + 1.0, b: T.tribunal - 0.1, p: topo('limp26', OBRA.limp26.usou), valor: 'R$ 5,2 MI', sub: '2026 · LIMPEZA', cor: CA[2]},
    {a: T.asf50 + 0.4, b: T.tribunal - 0.1, p: soma(GAV.asf26, [0, 0.55, 0]), valor: 'USOU R$ 50 MIL', sub: '2026 · ASFALTO', cor: CA[2]},
    {a: T.asfNao, b: FIM + 1, p: topo('asf25', 0), valor: '?', cor: tema.acento},
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
  const obraK = vis(t, T.limp206, T.tribunal - 0.2);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || obraK > 0.01 ? (
        <div style={{opacity: Math.min(1, Math.max(placarK, obraK)), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${obraK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{obraK > 0.01 ? 'AQUI, 1 PILHA = R$ 200 MIL · BRANCO = RESERVADO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 ENVIADO AO TCM-BA</div>
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
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < 150 && Math.abs(rots[a].y - rots[b].y) < 62) rots[a].y = rots[b].y - 64;
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

// ---------- O mapa do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/paratinga.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falt24, T.falt25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.terminou, T.usaram, T.parar, T.cancelada];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: ZERADOS.includes(e.s) ? 0.1 : 0.18})));
  [Y0.zero!, Y1.zero!].forEach((t) => s.push({t: t + 0.9, f: 'baque', v: 0.2}));
  ANOS.forEach((y) => s.push({t: y.falta.t, f: 'baque', v: 0.22}));
  s.push({t: T.tresAnos + 0.3, f: 'pop', v: 0.16});
  s.push({t: T.terminou, f: 'subida', v: 0.18});
  s.push({t: T.usaram, f: 'tique', v: 0.16});
  s.push({t: T.limp26, f: 'subida', v: 0.16});
  s.push({t: T.governo, f: 'pop', v: 0.16});
  [T.parar, T.cancelou, T.cancelada].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.18}));
  [T.advoc, T.remedios, T.transp].forEach((t) => s.push({t: t + 0.4, f: 'tique', v: 0.14}));
  s.push({t: T.festaCresce, f: 'pop', v: 0.18});
  s.push({t: T.asfNao, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 7, 10.5, 12.8, T.gastou24 + 0.9, T.falt24 + 0.9,
  ...Y0.entradas.slice(0, 9).map((e) => e.t + 0.9),
  Y0.zero! + 1.0, T.nemExiste + 0.6, T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.zero! + 1.0,
  T.ano26 + 1.0, T.falt26 + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[11].t + 0.8,
  T.repara + 0.6, T.festas + 0.4, T.tresAnos + 1.6, T.familias + 0.6, T.secretaria + 0.8, T.terminou + 1.4, T.usaram + 0.7, T.limp26 + 1.4, T.asf50 + 0.8, T.governo + 0.4,
  T.parar + 0.6, T.cancelou + 0.6, T.cancelada + 0.5, T.advoc + 0.8, T.transp + 0.5, T.gastar + 0.5, T.festaCresce + 0.4, T.asfNao + 0.4, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoParatinga: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Paratinga" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['A festa', 'cresce.', 'O asfalto', 'não sai.'];
export const CapaOrcamentoParatinga: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · PARATINGA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
