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
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 090. orçamento de Riachão do Jacuípe (BA) (perfil @eumagnoleite). Lote LARANJA (L19), MOLDE 093 Ilhéus / 124 Ruy Barbosa.
// O Kit Mapas abre (voo até Riachão do Jacuípe, as três receitas, FPM, Fundeb + União, SUS, ICMS e IPTU de 2025:
// projetos/090.../mapas/riachaodojacuipe.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO
// em volta dele (1 pilha = R$ 2 mi). Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA.
// "Gastou" = LIQUIDADO de Prefeitura + Câmara + Fundação de Saúde (2024 e 2025 = Balanço; 2026 até JUNHO = consolidado PCMGE065)
// (~/Documents/RECEITAS-DESPESAS-RIACHAO-DO-JACUIPE/scripts/setores.py).
// Regra 99: "Festas e eventos" (ação de eventos culturais + bandas e palco de outras ações) separado de "Cultura".
// Sem porcentagem, sem nome de gestor, sem nome de empresa contratada.
// SÓ DADOS DE RIACHÃO DO JACUÍPE, todos do TCM-BA: projetos/090.../audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 177.5; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes + 0,35 s, pausas 0,28 s, atempo 1,1468, loudnorm -15,4
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '090. orçamento de riachão do jacuípe';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 130'),
  arrec24: quando('Arrecadou 130 milhoes e 100 Gastou'),
  gastou24: quando('Gastou 136'),
  mais24: quando('Gastou 6 milhoes e 300 a mais'),
  ano25: quando('2025 Arrecadou 165'),
  arrec25: quando('Arrecadou 165 milhoes e 600 Gastou'),
  gastou25: quando('Gastou 150'),
  mais25: quando('Sobraram 15'),
  ano26: quando('2026 ate junho o ultimo'),
  arrec26: quando('Arrecadou 83 milhoes e 800 Gastou'),
  gastou26: quando('Gastou 74'),
  comprometeu: quando('E ja comprometeu'),
  camara: quando('Agora a Camara'),
  rec24: quando('recebeu 4 milhoes e 400'),
  dev24: quando('devolveu 1 milhao'),
  rec25: quando('Em 2025 recebeu 5'),
  dev25: quando('devolveu 70 mil'),
  rec26: quando('ja recebeu 2 milhoes e 900'),
  festas: quando('E as festas'),
  prev24: quando('eventos culturais previa'),
  f24: quando('e gastou 10 milhoes'),
  prev25: quando('Em 2025 previa'),
  f25: quando('e gastou 5 milhoes e 700'),
  prev26: quando('Em 2026 previa'),
  aut26: quando('subiu para 8 milhoes'),
  f26: quando('ja gastou 3 milhoes'),
  c26: quando('e comprometeu 6'),
  mesmos: quando('Em 2024 a assistencia'),
  agr: quando('a agricultura 1 milhao'),
  esp: quando('e o esporte 644'),
  juntos: quando('Os tres juntos'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas numa cidade'),
  dobro: quando('mais que o dobro'),
  porqueFestas: quando('por que a acao de eventos'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'fes', nome: 'FESTAS E EVENTOS', tipo: 'palco', texto: 'FESTAS'},
  {id: 'cul', nome: 'CULTURA', tipo: 'colunas', texto: 'CULTURA'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.165 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.9, 1.55, 1.25][yi];
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
    ['obr', 'Obras'],
    ['adm', 'Administracao'],
    ['div', 'Dividas'],
    ['ass', 'Assistencia social'],
    ['cam', 'Camara'],
    ['fes', 'Festas e eventos'],
    ['cul', 'Cultura'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, s === 'cam' || s === 'edu' || s === 'sau' ? n + 1 : n), v: v[k]})); // 'Câmara', 'educação' e 'saúde' aparecem antes, na abertura
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 136.45, rotulo: '2024', falta: {t: T.mais24, v: 6.307, txt: 'A MAIS'}, entradas: lista(1, [44.587, 41.9904, 12.0061, 8.665, 8.9974, 4.4316, 3.0821, 10.2125, 0.3431, 1.4895, 0.6438])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 150.47, rotulo: '2025', falta: {t: T.mais25, v: 15.0977, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [59.6868, 41.6693, 16.6903, 8.7098, 7.8093, 3.1167, 5.0687, 5.7721, 0.3996, 0.9731, 0.57849])},
  {ini: T.ano26 + 0.3, fim: T.camara, gastou: T.gastou26, total: 74.45, rotulo: '2026 · ATÉ JUN', falta: {t: T.comprometeu, v: 105.2911, txt: 'COMPROMETIDO'}, entradas: lista(3, [26.2591, 21.8276, 9.3512, 5.2935, 2.4532, 1.8525, 2.7021, 3.7691, 0.1669, 0.53, 0.2441])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ JUN'];

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
const ESCALA = 2; // 1 pilha = R$ 2 mi (~74 a 166 mi por ano)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; 2024 usa cerca de 80 pilhas) ----------
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

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.camara - 0.2, T.camara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// cor do ano = 2024 dourado, 2025 verde, 2026 rosa. Cada gaveta tem a sua escala (o placar diz qual).
const LADO_A = 2;
const PASSO_A = 0.25;
const ZD = -2.0;
// atrás do cofre (1 pilha = R$ 500 mil): a Câmara recebeu e devolveu, 2024, 2025 e 2026 até junho
const ESC_C = 0.5;
const CM = {
  rec24: {p: [-2.0, 0, ZD] as V3, v: 4.4225},
  dev24: {p: [-1.25, 0, ZD] as V3, v: 1.3404},
  rec25: {p: [-0.35, 0, ZD] as V3, v: 5.1388},
  dev25: {p: [0.4, 0, ZD] as V3, v: 0.0701},
  rec26: {p: [1.3, 0, ZD] as V3, v: 2.8816},
};
const CM_X = -0.35;
// na frente (1 pilha = R$ 500 mil): a ação de eventos culturais, previsto x gasto (2024, 2025) e previsto x autorizado x gasto x
// comprometido (2026 até junho); depois a assistência social, a agricultura e o esporte de 2024, TUDO NA MESMA ESCALA
const ZA = 0.2;
const ESC_A = 0.5;
const FA = {
  p24: {p: [-5.6, 0, ZA] as V3, v: 4.65},
  f24: {p: [-4.85, 0, ZA] as V3, v: 10.2125},
  p25: {p: [-3.85, 0, ZA] as V3, v: 4.5},
  f25: {p: [-3.1, 0, ZA] as V3, v: 5.7446},
  p26: {p: [-2.1, 0, ZA] as V3, v: 3.201},
  a26: {p: [-1.35, 0, ZA] as V3, v: 8.347},
  f26: {p: [-0.6, 0, ZA] as V3, v: 3.6827},
  c26: {p: [0.15, 0, ZA] as V3, v: 6.7802},
  ass: {p: [1.4, 0, ZA] as V3, v: 4.4316},
  agr: {p: [2.15, 0, ZA] as V3, v: 1.4895},
  esp: {p: [2.9, 0, ZA] as V3, v: 0.6438},
};
const GAV_X = -1.35;
const CM_VIS = (t: number) => vis(t, T.camara - 0.3, T.festas - 0.2);
const FA_VIS = (t: number) => vis(t, T.festas - 0.3, FIM + 2);

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
    // torre na frente do cofre: o que sobrou (verde) ou faltou (vermelho) em cada ano
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const tAk = (v: number, esc: number, k: number, min = 0.3) => Math.max(min, v / esc) * k;
  const claro = mistura(CA[1], tema.objetoClaro, 0.45);
  const cm = CM_VIS(t);
  if (cm > 0.01) {
    // a Câmara: recebeu (cor do ano) e devolveu (claro), em 2024, 2025 e 2026 até setembro
    const pares: [keyof typeof CM, number, string][] = [
      ['rec24', T.rec24 + 0.5, CA[0]], ['dev24', T.dev24 + 0.3, claro],
      ['rec25', T.rec25 + 0.5, CA[1]], ['dev25', T.dev25 + 0.3, claro],
      ['rec26', T.rec26 + 0.4, CA[2]],
    ];
    pares.forEach(([k, a, cor]) => {
      const kk = cresce(a) * cm;
      if (kk > 0.01) solidas.push(...torre(CM[k].p, tAk(CM[k].v, ESC_C, kk, k === 'dev25' ? 0.14 : 0.3), LADO_A, cor, PASSO_A));
    });
  }
  const fa = FA_VIS(t);
  if (fa > 0.01) {
    const prev = (yi: number) => mistura(CA[yi], tema.objetoClaro, 0.55);
    const aut = (yi: number) => mistura(CA[yi], tema.objetoClaro, 0.25);
    const itens: [keyof typeof FA, number, string][] = [
      ['p24', T.prev24 + 0.4, prev(0)], ['f24', T.f24 + 0.2, CA[0]],
      ['p25', T.prev25 + 0.3, prev(1)], ['f25', T.f25 + 0.2, CA[1]],
      ['p26', T.prev26 + 0.3, prev(2)], ['a26', T.aut26 + 0.2, aut(2)], ['f26', T.f26 + 0.2, CA[2]], ['c26', T.c26 + 0.2, mistura(CA[2], C.alerta, 0.5)],
      ['ass', T.mesmos + 0.6, mistura(CA[0], tema.objetoClaro, 0.2)], ['agr', T.agr + 0.2, mistura(CA[0], tema.objetoClaro, 0.2)], ['esp', T.esp + 0.2, mistura(CA[0], tema.objetoClaro, 0.2)],
    ];
    itens.forEach(([k, a, cor]) => {
      const kk = cresce(a, 0.8) * fa;
      if (kk > 0.01) solidas.push(...torre(FA[k].p, tAk(FA[k].v, ESC_A, kk), LADO_A, cor, PASSO_A));
    });
  }
  return {solidas, fantasmas, torres};
};


// enfeites só no vão entre o Esporte (último) e a Educação (primeira), longe das casinhas dos setores
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
  // a casinha sobe ~1 s ANTES da primeira menção (regra do 081: nada de gramado vazio)
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const cinza = 0;
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
    case 'agua':
      return <EstacaoSaneamento {...props} />;
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

      {/* a Câmara: recebeu e devolveu (atrás do cofre); eventos previsto x autorizado x gasto, assistência, agricultura e esporte de 2024 (frente) */}
      <BaseGaveta tema={tema} pos={[CM_X, 0, ZD]} sobe={cm} larg={4.6} texto="CÂMARA: RECEBEU E DEVOLVEU" aceso={janela(t, T.camara, T.festas, 0.4)} />
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={fa} larg={9.6} texto="EVENTOS x ASSISTÊNCIA x AGRICULTURA x ESPORTE" aceso={Math.max(janela(t, T.festas, T.gastar, 0.4), janela(t, T.porque, T.segue, 0.4))} />
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
    const pp = perto * alto * (idx(e.s) >= 9 ? 1.08 : 1);
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
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.6, E([0, 0.9, 1.6], 9.8, 7.8, [0.08, 1.2, 1])], [Y1.entradas[0].t - 0.4, E([0, 0.9, 1.6], 9.8, 7.8, [0.1, 1.2, 1])]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre verde do que sobrou
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.comprometeu + 0.4, E([0, 1.6, 2.2], 10.4, 8.6, [0.08, 1.2, 1])], [Y2.entradas[0].t - 0.4, E([0, 1.6, 2.2], 10.4, 8.6, [0.1, 1.2, 1])]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.camara - 0.2, 1.2)]},
  // a Câmara: recebeu e devolveu, 2024, 2025 e 2026 (atrás do cofre)
  {
    ini: T.camara - 0.1,
    arco: 0.03,
    chaves: [
      [T.camara - 0.1, E([CM_X, 1.0, ZD], 6.0, 6.0, [0, 1.5, 1])],
      [T.rec24 - 0.2, E(soma(meio(CM.rec24.p, CM.dev24.p), [0, 1.2, 0]), 3.4, 5.0, [-0.03, 1.3, 1])],
      [T.rec25 - 0.4, E(soma(meio(CM.rec24.p, CM.dev24.p), [0, 1.2, 0]), 3.0, 5.0, [-0.02, 1.3, 1])],
      [T.rec25 + 0.2, E(soma(meio(CM.rec25.p, CM.dev25.p), [0, 1.3, 0]), 3.0, 5.2, [-0.01, 1.3, 1])],
      [T.rec26 - 0.4, E(soma(meio(CM.rec25.p, CM.dev25.p), [0, 1.3, 0]), 3.0, 5.2, [0.0, 1.3, 1])],
      [T.rec26 + 0.2, E(soma(meio(CM.dev25.p, CM.rec26.p), [0, 1.2, 0]), 3.2, 5.0, [0.01, 1.3, 1])],
      [T.festas - 0.4, E(soma(meio(CM.dev25.p, CM.rec26.p), [0, 1.2, 0]), 3.2, 5.0, [0.015, 1.3, 1])],
    ],
  },
  // a ação de eventos culturais: previsto x gasto (2024, 2025), previsto x autorizado x gasto x comprometido (2026); assistência, agricultura e esporte de 2024 (frente)
  {
    ini: T.festas - 0.1,
    arco: 0.03,
    chaves: [
      [T.festas - 0.1, E([GAV_X, 1.0, 0.6], 9.8, 7.6, [0, 1.6, 1])],
      [T.prev24 + 0.1, E(soma(meio(FA.p24.p, FA.f24.p), [0, 2.0, 0]), 3.6, 6.6, [-0.02, 1.3, 1])],
      [T.prev25 - 0.2, E(soma(meio(FA.p24.p, FA.f24.p), [0.05, 2.0, 0]), 3.6, 6.6, [-0.015, 1.3, 1])],
      [T.prev25 + 0.3, E(soma(meio(FA.p25.p, FA.f25.p), [0, 1.5, 0]), 3.2, 5.8, [-0.01, 1.3, 1])],
      [T.prev26 - 0.3, E(soma(meio(FA.p25.p, FA.f25.p), [0.05, 1.5, 0]), 3.2, 5.8, [0.0, 1.3, 1])],
      [T.prev26 + 0.3, E(soma(meio(FA.a26.p, FA.f26.p), [0, 1.8, 0]), 4.2, 6.6, [0.005, 1.3, 1])],
      [T.mesmos - 0.4, E(soma(meio(FA.a26.p, FA.c26.p), [0.05, 1.8, 0]), 4.2, 6.6, [0.01, 1.3, 1])],
      [T.mesmos + 0.2, E(soma(meio(FA.f24.p, FA.esp.p), [0, 1.8, 0]), 9.4, 7.4, [0.01, 1.3, 1])],
      [T.gastar - 0.4, E(soma(meio(FA.f24.p, FA.esp.p), [0.05, 1.8, 0]), 9.4, 7.4, [0.015, 1.3, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois 2024 previsto x gasto
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([-1.0, 0, 0.0], 12.6, 9.2, [0, 1.3, 1])],
      [T.porqueFestas - 0.2, E(soma(meio(FA.p24.p, FA.f24.p), [0, 2.0, 0]), 3.6, 6.6, [0.02, 1.3, 1])],
      [T.segue - 0.5, E(soma(meio(FA.p24.p, FA.f24.p), [0.05, 2.0, 0]), 3.6, 6.6, [0.01, 1.3, 1])],
      [T.segue + 0.8, E([-1.0, 1.0, ZA], 9.8, 7.6, [0.1, 1.3, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.camara, T.festas, T.mesmos, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) =>
  v === 0 ? 'R$ 0' : v < 0.01 ? `R$ ${(v * 1000).toFixed(1).replace('.', ',').replace(/,0$/, '')} MIL` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 136,4 MI'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 6,3 MI A MAIS', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 165,6 MI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 150,5 MI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 15,1 MI'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ JUNHO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ JUNHO: R$ 83,8 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ JUNHO: R$ 74,4 MI'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'JÁ COMPROMETIDO (EMPENHADO): R$ 105,3 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: e.v === 0 ? `${nomeDe(e.s)}: NADA NAS AÇÕES DA ÁREA` : `${nomeDe(e.s)}: ${fmtV(e.v)}`, destaque: e.v === 0});
    });
  });
  c.push(
    {a: T.camara, b: T.rec24, texto: 'A CÂMARA: O QUE ENTROU E O QUE SAIU'},
    {a: T.rec24, b: T.dev24, texto: '2024: RECEBEU R$ 4,4 MI DA PREFEITURA'},
    {a: T.dev24, b: T.rec25, texto: 'DEVOLVEU R$ 1,3 MI', destaque: true},
    {a: T.rec25, b: T.dev25, texto: '2025: RECEBEU R$ 5,1 MI'},
    {a: T.dev25, b: T.rec26, texto: 'DEVOLVEU R$ 70 MIL'},
    {a: T.rec26, b: T.festas, texto: 'ATÉ JUN/2026: JÁ RECEBEU R$ 2,9 MI'},
    {a: T.festas, b: T.prev24, texto: 'E AS FESTAS'},
    {a: T.prev24, b: T.f24, texto: 'AÇÃO DE EVENTOS 2024: PREVISTO R$ 4,65 MI'},
    {a: T.f24, b: T.prev25, texto: 'EVENTOS 2024: GASTOU R$ 10,2 MI', destaque: true},
    {a: T.prev25, b: T.f25, texto: 'EVENTOS 2025: PREVISTO R$ 4,5 MI'},
    {a: T.f25, b: T.prev26, texto: 'EVENTOS 2025: GASTOU R$ 5,7 MI'},
    {a: T.prev26, b: T.aut26, texto: 'EVENTOS 2026: PREVISTO R$ 3,2 MI'},
    {a: T.aut26, b: T.f26, texto: 'AUTORIZADO DEPOIS: R$ 8,3 MI', destaque: true},
    {a: T.f26, b: T.c26, texto: 'ATÉ JUNHO: JÁ GASTOU R$ 3,7 MI'},
    {a: T.c26, b: T.mesmos, texto: 'E JÁ COMPROMETEU R$ 6,8 MI', destaque: true},
    {a: T.mesmos, b: T.agr, texto: 'ASSISTÊNCIA SOCIAL 2024: R$ 4,4 MI'},
    {a: T.agr, b: T.esp, texto: 'AGRICULTURA 2024: R$ 1,5 MI'},
    {a: T.esp, b: T.juntos, texto: 'ESPORTE 2024: R$ 644 MIL'},
    {a: T.juntos, b: T.gastar, texto: 'OS TRÊS JUNTOS: R$ 6,6 MI · EVENTOS: R$ 10,2 MI', destaque: true},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.porqueFestas, texto: 'EM 2024, GASTOU MAIS DO QUE ARRECADOU...', destaque: true},
    {a: T.porqueFestas, b: T.segue + 0.3, texto: '...EVENTOS: MAIS QUE O DOBRO DO PREVISTO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E DESPESA DEZ/2024 (PCMGE015) · TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 (RECEITA E DESPESA) · TCM-BA'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: DESPESA DEZ/2025 PREFEITURA, CÂMARA E FUNDAÇÃO · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: CONSOLIDADO JUN/2026 (PCMGE065 E 066) · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.camara, texto: 'FONTE: DESPESA JUN/2026, AÇÃO POR AÇÃO (PCMGE015) · TCM-BA'},
  {a: T.camara, b: T.festas, texto: 'FONTE: RAZÃO DA CÂMARA (PCMGE018) · TCM-BA'},
  {a: T.festas, b: T.gastar, texto: 'FONTE: DESPESA DA PREFEITURA (PCMGE015), AÇÃO POR AÇÃO · TCM-BA'},
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
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: v < 0.01 ? C.alerta : CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  // a Câmara: recebeu e devolveu
  const fimC = T.festas - 0.1;
  const claro = mistura(CA[1], tema.objetoClaro, 0.45);
  r.push(
    {a: T.rec24 + 0.9, b: fimC, p: topo(CM.rec24.p, CM.rec24.v, ESC_C), valor: 'R$ 4,4 MI', sub: 'RECEBEU · 2024', cor: CA[0]},
    {a: T.dev24 + 0.6, b: fimC, p: topo(CM.dev24.p, CM.dev24.v, ESC_C), valor: 'R$ 1,3 MI', sub: 'DEVOLVEU · 2024', cor: claro},
    {a: T.rec25 + 0.9, b: fimC, p: topo(CM.rec25.p, CM.rec25.v, ESC_C), valor: 'R$ 5,1 MI', sub: 'RECEBEU · 2025', cor: CA[1]},
    {a: T.dev25 + 0.6, b: fimC, p: soma(CM.dev25.p, [0, 0.4, 0]), valor: 'R$ 70 MIL', sub: 'DEVOLVEU · 2025', cor: claro},
    {a: T.rec26 + 0.8, b: fimC, p: topo(CM.rec26.p, CM.rec26.v, ESC_C), valor: 'R$ 2,9 MI', sub: 'RECEBEU · ATÉ JUN/2026', cor: CA[2]},
  );
  // ação de eventos culturais: previsto x (autorizado) x gasto x comprometido; assistência, agricultura e esporte de 2024
  const fimF = T.gastar - 0.1;
  const pv = (yi: number) => mistura(CA[yi], tema.objetoClaro, 0.4);
  const c24 = mistura(CA[0], tema.objetoClaro, 0.2);
  r.push(
    {a: T.prev24 + 0.9, b: T.prev25 + 0.2, p: topo(FA.p24.p, FA.p24.v, ESC_A), valor: 'R$ 4,65 MI', sub: 'PREVISTO · 2024', cor: pv(0)},
    {a: T.f24 + 0.6, b: fimF, p: topo(FA.f24.p, FA.f24.v, ESC_A), valor: 'R$ 10,2 MI', sub: 'EVENTOS · 2024', cor: CA[0]},
    {a: T.prev25 + 0.8, b: T.prev26 + 0.2, p: topo(FA.p25.p, FA.p25.v, ESC_A), valor: 'R$ 4,5 MI', sub: 'PREVISTO · 2025', cor: pv(1)},
    {a: T.f25 + 0.6, b: T.mesmos, p: topo(FA.f25.p, FA.f25.v, ESC_A), valor: 'R$ 5,7 MI', sub: 'EVENTOS · 2025', cor: CA[1]},
    {a: T.prev26 + 0.8, b: T.mesmos, p: topo(FA.p26.p, FA.p26.v, ESC_A), valor: 'R$ 3,2 MI', sub: 'PREVISTO · 2026', cor: pv(2)},
    {a: T.aut26 + 0.6, b: T.mesmos, p: topo(FA.a26.p, FA.a26.v, ESC_A), valor: 'R$ 8,3 MI', sub: 'AUTORIZADO · 2026', cor: pv(2)},
    {a: T.f26 + 0.6, b: T.mesmos, p: topo(FA.f26.p, FA.f26.v, ESC_A), valor: 'R$ 3,7 MI', sub: 'GASTOU · ATÉ JUN/2026', cor: CA[2]},
    {a: T.c26 + 0.6, b: T.mesmos, p: topo(FA.c26.p, FA.c26.v, ESC_A), valor: 'R$ 6,8 MI', sub: 'COMPROMETIDO · 2026', cor: C.alerta},
    {a: T.mesmos + 0.9, b: fimF, p: topo(FA.ass.p, FA.ass.v, ESC_A), valor: 'R$ 4,4 MI', sub: 'ASSISTÊNCIA · 2024', cor: c24},
    {a: T.agr + 0.6, b: fimF, p: topo(FA.agr.p, FA.agr.v, ESC_A), valor: 'R$ 1,5 MI', sub: 'AGRICULTURA · 2024', cor: c24},
    {a: T.esp + 0.6, b: fimF, p: topo(FA.esp.p, FA.esp.v, ESC_A), valor: 'R$ 644 MIL', sub: 'ESPORTE · 2024', cor: c24},
  );
  // a pergunta (somem no "Segue o", regra do 081)
  r.push(
    {a: T.porqueFestas + 0.3, b: T.segue + 0.5, p: topo(FA.p24.p, FA.p24.v, ESC_A), valor: 'R$ 4,65 MI', sub: 'PREVISTO · 2024', cor: pv(0)},
    {a: T.porqueFestas + 0.6, b: T.segue + 0.5, p: topo(FA.f24.p, FA.f24.v, ESC_A), valor: 'R$ 10,2 MI', sub: 'EVENTOS · 2024', cor: tema.acento},
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
  const placarK = vis(t, T.gastou24 + 0.4, T.camara);
  const miolo = vis(t, T.camara + 0.2, FIM + 2);
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : 'AQUI, 1 PILHA = R$ 500 MIL';
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
    const REC = quando('Em 2025 o FPM');
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, REC - 0.5, REC - 0.1));
    const k2 = Math.min(entra(t, REC, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < REC - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · RECEITA JUN/2026 · TCM-BA' : t < T.ano24 - 0.1 ? 'FONTE: ANEXO 10 DO BALANÇO 2025 · TCM-BA' : 'FONTE: BALANÇO ORÇAMENTÁRIO 2024 · TCM-BA';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/riachaodojacuipe.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.f24, T.f25, T.aut26, T.c26, T.juntos, T.dobro + 0.3];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);


// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('130 milhoes e 100 em 2024'), quando('165 milhoes e 600 em 2025'), quando('83 milhoes e 800 ate')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.camara, T.rec24, T.rec25, T.rec26, T.festas, T.prev24, T.prev25, T.prev26, T.f26, T.mesmos, T.agr, T.esp].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.dev24, T.f24, T.f25, T.aut26, T.c26, T.juntos].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.dobro].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.5, 10.5, 13.5, 16.0, 19.0, 22.0, 26.0, 29.0, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.camara + 0.6, T.rec24 + 1.2, T.dev24 + 1.0, T.rec25 + 1.2, T.dev25 + 1.0, T.rec26 + 1.2,
  T.festas + 0.5, T.prev24 + 1.2, T.f24 + 1.0, T.prev25 + 1.0, T.f25 + 1.0, T.prev26 + 1.0, T.aut26 + 1.0, T.f26 + 1.0, T.c26 + 1.0,
  T.mesmos + 1.0, T.agr + 1.0, T.esp + 1.0, T.juntos + 1.2, T.gastar - 0.5,
  T.gastar + 0.5, T.porque + 1.2, T.dobro + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoRiachaoDoJacuipe: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="RIACHÃO DO JACUÍPE" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Eventos 2024:', 'previa 4,65 mi.', 'Gastou:', 'R$ 10,2 mi.'];
export const CapaOrcamentoRiachaoDoJacuipe: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · RIACHÃO DO JACUÍPE · 2024`} t={1} troca={0} y={SEGURO.topo + 160} />
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