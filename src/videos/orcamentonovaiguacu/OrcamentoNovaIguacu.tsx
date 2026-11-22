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
import {ArvoreRedonda, CasaMini, CofreFGTS, Onibus} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 00. orçamento de Nova Iguaçu (RJ) (perfil @eumagnoleite). Pedido direto do Magno, 15/11/2026: 1º município fora da Bahia. MOLDE 150 Salvador.
// O Kit Mapas abre (voo até Nova Iguaçu e as três receitas: projetos/202.../mapas/novaiguacu.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE
// no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 50 mi). Quando a voz fala um setor, as pilhas voam para a casinha.
// Totais = Balanço Orçamentário Consolidado analisado pelo TCE-RJ (acórdão 4392/2026 para 2024; processo 218.353-7/26 para 2025)
// e RREO do 4º bimestre de 2026 (SICONFI). Setores = despesa por função do RREO (2024/2025 empenhada, 2026 liquidada), com intraorçamentárias,
// somando o total centavo a centavo (~/Documents/RECEITAS-DESPESAS-NOVA-IGUACU/scripts/setores.py). Segurança (guarda) fora da fala.
// Sem porcentagem na fala, sem nome de gestor. Fontes: projetos/202.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 169.26; // narração v2, Google Chirp 3 HD Algenib, speakingRate 1,3, 11 partes + 0,35 s, pausas 0,28 s, atempo 1,06, loudnorm -15,5
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '00. orçamento de nova iguaçu';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 Arrecadou 2'),
  arrec24: quando('Arrecadou 2 bilhoes e 820 Gastou'),
  gastou24: quando('Gastou 2 bilhoes e 950'),
  mais24: quando('Gastou 126'),
  ano25: quando('2025 Arrecadou 2'),
  arrec25: quando('Arrecadou 2 bilhoes e 770 Gastou'),
  gastou25: quando('Gastou 2 bilhoes e 900'),
  mais25: quando('Gastou 132'),
  ano26: quando('2026 ate agosto Arrecadou'),
  arrec26: quando('Arrecadou 1 bilhao'),
  veio: quando('Os impostos e taxas'),
  uniao: quando('A Uniao mandou'),
  estado: quando('o Estado 495'),
  fundeb: quando('e o Fundeb 323'),
  gastou26: quando('Gastou 1 bilhao'),
  mais26: quando('Sobraram 10'),
  obras: quando('Obras e servicos urbanos levaram'),
  o24: quando('levaram 482'),
  o25: quando('Em 2025 foram 272'),
  caiu: quando('Caiu 209'),
  trib: quando('No Tribunal'),
  e24: quando('a educacao recebeu 220'),
  e25an: quando('As de 2025 estao'),
  e25: quando('Os tecnicos apontaram'),
  emin: quando('O minimo seria'),
  def: quando('A prefeitura pode'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se a cidade'),
  falt: quando('por que faltaram'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | 'onibus' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO E PREVIDÊNCIA', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'ilu', nome: 'ILUMINAÇÃO PÚBLICA', tipo: 'galpao', texto: 'ILUMINAÇÃO'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'tra', nome: 'TRANSPORTE', tipo: 'onibus'},
  {id: 'cul', nome: 'CULTURA', tipo: 'colunas', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'mei', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'esp', nome: 'ESPORTE E LAZER', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'agu', nome: 'ÁGUA E ESGOTO', tipo: 'casinha', texto: 'ÁGUA E ESGOTO'},
];
const R_PREDIO = 7.45;
const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.1475 * Math.PI);
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
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number; txt: string; sobra?: boolean}};
const lista = (n: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao e previdencia'],
    ['obr', 'Obras e servicos urbanos'],
    ['ilu', 'Iluminacao publica'],
    ['cam', 'Camara'],
    ['div', 'Dividas e encargos'],
    ['tra', 'Transporte'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia social'],
    ['mei', 'Agricultura e meio ambiente'],
    ['esp', 'Esporte'],
    ['agu', 'Agua e esgoto'],
  ]
    .filter(([s]) => s !== 'agu' || n === 1) // água e esgoto: o zero é dito uma vez, em 2024
    .map(([s, w], k) => ({s, t: quando(w, n), v: v[k] ?? 0}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 2947.91, rotulo: '2024', falta: {t: T.mais24, v: 126.05412, txt: 'A MAIS'}, entradas: lista(1, [595.01418, 888.10944, 489.44899, 481.94391, 61.03904, 30.32539, 300.60591, 4.67816, 5.17274, 44.13086, 33.42890, 0.59630, 0])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 2899.69, rotulo: '2025', falta: {t: T.mais25, v: 132.09183, txt: 'A MAIS'}, entradas: lista(2, [676.82769, 936.73741, 510.39107, 272.46604, 47.79342, 36.03253, 314.84966, 6.65388, 6.38711, 50.02672, 28.59394, 0.69975])},
  {ini: T.ano26 + 0.3, fim: T.obras, gastou: T.gastou26, total: 1941.91, rotulo: '2026 · ATÉ AGO', falta: {t: T.mais26, v: 10.40999, txt: 'SOBRARAM', sobra: true}, entradas: lista(3, [462.03891, 634.99732, 340.85501, 161.84231, 45.18761, 26.06694, 186.64245, 2.51785, 4.50826, 32.31817, 35.99510, 0.18758])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ AGO'];

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
const ESCALA = 50; // 1 pilha = R$ 50 mi (~39 a 59 pilhas por ano)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: 134 lugares; cada ano usa cerca de 75 a 85 pilhas) ----------
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

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.obras - 0.2, T.obras + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo ----------
// Tudo na MESMA escala (1 pilha = R$ 20 mi). Obras e serviços urbanos 2024 x 2025; depois a educação no Tribunal: o que a conta do TCE-RJ
// considerou com dinheiro de impostos em 2024 (acima do mínimo) e em 2025, ao lado do mínimo de 2025 (25% de 893,76 mi, conta própria) e do que faltou.
const LADO_A = 3;
const PASSO_A = 0.25;
const ZA = 0.2;
const ESC_A = 20;
const FA = {
  o24: {p: [-5.6, 0, ZA] as V3, v: 481.94},
  o25: {p: [-4.5, 0, ZA] as V3, v: 272.47},
  e24: {p: [-2.7, 0, ZA] as V3, v: 220.14159},
  e25: {p: [-1.4, 0, ZA] as V3, v: 198.57096},
  emin: {p: [-0.1, 0, ZA] as V3, v: 223.44085},
  falta: {p: [1.2, 0, ZA] as V3, v: 24.86988},
};
const GAV_X = -2.2;
const FA_VIS = (t: number) => vis(t, T.obras - 0.3, FIM + 2);

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
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  // cada pilha da gaveta só nasce quando a voz fala o valor dela (nada do futuro na tela)
  const cresce = (a: number, d = 0.9) => rampa(t, a, a + d);
  const tAk = (v: number, esc: number, k: number, min = 0.3) => Math.max(min, v / esc) * k;
  const vermelho = mistura(C.alerta, tema.objetoClaro, 0.3);
  const fa = FA_VIS(t);
  if (fa > 0.01) {
    const prev = (c: string) => mistura(c, tema.objetoClaro, 0.55);
    const itens: [keyof typeof FA, number, string][] = [
      ['o24', T.o24 + 0.3, CA[0]], ['o25', T.o25 + 0.3, CA[1]],
      ['e24', T.e24 + 0.4, CA[0]], ['e25', T.e25 + 0.4, C.alerta],
      ['emin', T.emin + 0.3, prev(tema.acento)], ['falta', T.falt + 0.4, C.alerta],
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
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [1.9, 0, 8.4],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  // a casinha sobe ~1 s ANTES da primeira menção (regra do 081: nada de gramado vazio)
  const sobe = rampa(t, SOBE[s.id] - 1.0, SOBE[s.id] - 0.2);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const cinza = s.id === 'agu' ? janela(t, ANOS[0].entradas.find((e) => e.s === 'agu')!.t - 0.2, FIM + 2, 0.4) : 0;
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
    case 'onibus': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          <Onibus tema={tema} pos={soma(p, [0, 0.07 - 1.2 * (1 - Math.min(1, sobe)), 0])} rotY={rot + Math.PI / 2} escala={0.32} farol={aceso} />
          <Onibus tema={tema} pos={soma(p, [tg[0] * 0.9 - Math.sin(ang(i)) * 0.5, 0.07 - 1.2 * (1 - Math.min(1, sobe)), tg[2] * 0.9 - Math.cos(ang(i)) * 0.5])} rotY={rot + Math.PI / 2} escala={0.26} farol={aceso * 0.6} />
        </group>
      );
    }
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

      {/* frente: obras e serviços urbanos 2024 x 2025 e a educação no Tribunal (2024, 2025, mínimo e o que faltou) */}
      <BaseGaveta tema={tema} pos={[GAV_X, 0, 0.6]} sobe={fa} larg={10.6} texto="OBRAS E SERVIÇOS URBANOS · EDUCAÇÃO NO TRIBUNAL" aceso={Math.max(janela(t, T.obras, T.gastar, 0.4), janela(t, T.porque, T.segue, 0.4))} />
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
    const pp = perto * alto * (idx(e.s) >= 11 ? 1.08 : 1);
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
  // 2025: sobe, o cofre ganha a pilha verde e a torre verde do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.mais25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre verde do que sobrou até agosto
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.mais26 + 0.8, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.obras - 0.2, 1.2)]},
  // obras e serviços urbanos 2024 x 2025; depois a educação no Tribunal (frente, da esquerda para a direita)
  {
    ini: T.obras - 0.1,
    arco: 0.03,
    chaves: [
      [T.obras - 0.1, E([GAV_X, 0.8, 0.6], 10.4, 7.4, [0, 1.6, 1])],
      [T.o24 - 0.2, E(soma(meio(FA.o24.p, FA.o25.p), [0, 1.4, 0]), 4.4, 6.2, [-0.01, 1.3, 1])],
      [T.trib - 0.4, E(soma(meio(FA.o24.p, FA.o25.p), [0, 1.4, 0]), 4.4, 6.2, [0.01, 1.3, 1])],
      [T.trib + 0.3, E(soma(meio(FA.e24.p, FA.e25.p), [0, 1.2, 0]), 5.0, 6.4, [0.0, 1.3, 1])],
      [T.emin - 0.3, E(soma(meio(FA.e24.p, FA.e25.p), [0, 1.2, 0]), 5.0, 6.4, [0.01, 1.3, 1])],
      [T.emin + 0.3, E(soma(meio(FA.e25.p, FA.emin.p), [0, 1.2, 0]), 5.0, 6.4, [0.0, 1.3, 1])],
      [T.gastar - 0.4, E(soma(meio(FA.e25.p, FA.emin.p), [0, 1.2, 0]), 5.0, 6.4, [0.015, 1.3, 1])],
    ],
  },
  // a pergunta: a gaveta inteira, depois o mínimo de 2025 ao lado do que faltou
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([GAV_X, 0.7, 0.4], 11.6, 8.2, [0, 1.3, 1])],
      [T.falt - 0.2, E(soma(meio(FA.emin.p, FA.falta.p), [0, 1.1, 0]), 5.0, 6.4, [0.02, 1.3, 1])],
      [T.segue - 0.3, E([-1.2, 1.0, 0.3], 10.4, 7.4, [0, 1.25, 1])],
      [T.segue + 0.8, E([-1.2, 1.0, ZA], 11.0, 7.8, [0.1, 1.3, 1])],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.obras, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
// valores em R$ milhões: bilhão com 2 casas, milhão inteiro (com 1 casa abaixo de 100), mil abaixo de 1 milhão
const fmtV = (v: number) =>
  v === 0
    ? 'R$ 0'
    : v >= 1000
      ? `R$ ${(Math.round(v / 10) / 100).toFixed(2).replace('.', ',')} BI`
      : v >= 100
        ? `R$ ${Math.round(v)} MI`
        : v >= 1
          ? `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`
          : `R$ ${Math.round(v * 100) * 10} MIL`; // abaixo de 1 mi, arredonda como a voz (600 mil, 700 mil, 190 mil)
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 2,95 BI'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 126 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 2,77 BI'},
    {a: T.gastou25, b: T.mais25, texto: 'GASTOU EM 2025: R$ 2,90 BI'},
    {a: T.mais25, b: Y1.entradas[0].t, texto: 'GASTOU R$ 132 MI A MAIS', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ AGOSTO, O ÚLTIMO BIMESTRE ENTREGUE'},
    {a: T.arrec26, b: T.veio, texto: 'ARRECADOU ATÉ AGOSTO: R$ 1,95 BI'},
    {a: T.veio, b: T.uniao, texto: 'IMPOSTOS E TAXAS DA CIDADE: R$ 370 MI'},
    {a: T.uniao, b: T.estado, texto: 'CIDADE: R$ 370 MI · UNIÃO: R$ 496 MI'},
    {a: T.estado, b: T.fundeb, texto: 'DO ESTADO: R$ 495 MI'},
    {a: T.fundeb, b: T.gastou26, texto: 'ESTADO: R$ 495 MI · FUNDEB: R$ 323 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ AGOSTO: R$ 1,94 BI'},
    {a: T.mais26, b: Y2.entradas[0].t, texto: 'SOBRARAM R$ 10 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: e.v === 0 ? 'ÁGUA E ESGOTO: R$ 0 · CONCESSÃO CONTRATADA PELO ESTADO' : `${nomeDe(e.s)}: ${fmtV(e.v)}`, destaque: e.v === 0});
    });
  });
  c.push(
    {a: T.obras, b: T.o24, texto: 'OBRAS E SERVIÇOS URBANOS'},
    {a: T.o24, b: T.o25, texto: '2024: R$ 482 MI'},
    {a: T.o25, b: T.caiu, texto: '2025: R$ 272 MI', destaque: true},
    {a: T.caiu, b: T.trib, texto: 'CAIU R$ 209 MI', destaque: true},
    {a: T.trib, b: T.e24, texto: 'CONTAS DE 2024: PARECER FAVORÁVEL, COM RESSALVAS'},
    {a: T.e24, b: T.e25an, texto: 'EDUCAÇÃO 2024, COM IMPOSTOS: R$ 220 MI · ACIMA DO MÍNIMO'},
    {a: T.e25an, b: T.e25, texto: 'CONTAS DE 2025: EM ANÁLISE NO TCE-RJ'},
    {a: T.e25, b: T.emin, texto: 'EDUCAÇÃO 2025, COM IMPOSTOS: R$ 198,6 MI', destaque: true},
    {a: T.emin, b: T.def, texto: 'MÍNIMO DA CONSTITUIÇÃO: PERTO DE R$ 223 MI'},
    {a: T.def, b: T.gastar, texto: 'A PREFEITURA PODE SE DEFENDER · QUEM JULGA É A CÂMARA'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.falt, texto: 'ARRECADOU EM 2025: R$ 2,77 BI'},
    {a: T.falt, b: T.segue, texto: 'FALTARAM R$ 25 MI PARA O MÍNIMO DA EDUCAÇÃO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO 2024 (ACÓRDÃO 4392/2026) · TCE-RJ · RREO DEZ/2024'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO 2025 (PROC. 218.353-7/26) · TCE-RJ · RREO DEZ/2025'},
  {a: T.ano26, b: T.obras, texto: 'FONTE: RREO 4º BIMESTRE 2026 (ATÉ AGOSTO) · SICONFI'},
  {a: T.obras, b: T.trib, texto: 'FONTE: DESPESA POR FUNÇÃO · RREO DEZ/2024 E DEZ/2025'},
  {a: T.trib, b: FIM, texto: 'FONTE: ACÓRDÃO 4392/2026 E PROCESSO 218.353-7/26 · TCE-RJ'},
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
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / esc), lado) + 0.3, 0]);
  // obras saem quando a voz vai para o Tribunal; a educação fica até o fim (a pergunta compara com ela)
  const fim = T.segue + 0.5;
  const prev = (c: string) => mistura(c, tema.objetoClaro, 0.4);
  r.push(
    {a: T.o24 + 0.6, b: T.trib + 0.4, p: topo(FA.o24.p, FA.o24.v, ESC_A), valor: 'R$ 482 MI', sub: 'OBRAS · 2024', cor: CA[0]},
    {a: T.o25 + 0.6, b: T.trib + 0.4, p: topo(FA.o25.p, FA.o25.v, ESC_A), valor: 'R$ 272 MI', sub: 'OBRAS · 2025', cor: CA[1]},
    {a: T.e24 + 0.8, b: fim, p: topo(FA.e24.p, FA.e24.v, ESC_A), valor: 'R$ 220 MI', sub: 'EDUCAÇÃO · 2024', cor: CA[0]},
    {a: T.e25 + 0.8, b: fim, p: topo(FA.e25.p, FA.e25.v, ESC_A), valor: 'R$ 198,6 MI', sub: 'EDUCAÇÃO · 2025', cor: C.alerta},
    {a: T.emin + 0.6, b: fim, p: topo(FA.emin.p, FA.emin.v, ESC_A), valor: 'R$ 223 MI', sub: 'MÍNIMO · 2025', cor: prev(tema.acento)},
    {a: T.falt + 0.8, b: fim, p: topo(FA.falta.p, FA.falta.v, ESC_A), valor: 'R$ 25 MI', sub: 'FALTARAM', cor: C.alerta},
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
  const placarK = vis(t, T.gastou24 + 0.4, T.obras);
  const miolo = vis(t, T.obras + 0.2, FIM + 2);
  const escalaTxt = miolo <= 0.01 ? '1 PILHA = R$ 50 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026' : 'AQUI, 1 PILHA = R$ 20 MI';
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
    const REC = T.ano24;
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, REC - 0.5, REC - 0.1));
    const k2 = Math.min(entra(t, REC, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < REC - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · TCE-RJ · RREO AGO/2026 · SICONFI' : 'FONTE: BALANÇO ORÇAMENTÁRIO 2024 (CONSOLIDADO) · TCE-RJ';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/novaiguacu.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.mais25, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 800).map((e) => e.t)), T.o25, T.caiu, T.e25, T.falt + 0.3];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);


// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('2 bilhoes e 820 milhoes em'), quando('2 bilhoes e 770 milhoes em'), quando('1 bilhao e 950 milhoes ate'), T.veio, T.uniao, T.estado, T.fundeb].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}) : null));
  [T.obras, T.o24, T.trib, T.e24, T.emin].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.o25, T.caiu, T.e25].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  [T.porque, T.falt].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.0, 7.0, 10.0, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.mais24 + 1.4,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.mais25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.veio + 1.0, T.uniao + 1.0, T.fundeb + 1.0, T.gastou26 + 0.9, T.mais26 + 1.0, ...Y2.entradas.map((e) => e.t + 0.9),
  T.obras + 0.5, T.o24 + 1.2, T.o25 + 1.2, T.caiu + 0.8, T.trib + 1.0, T.e24 + 1.4, T.e25an + 0.8, T.e25 + 1.4, T.emin + 1.2, T.def + 1.0, T.gastar - 0.3,
  T.gastar + 0.5, T.porque + 1.4, T.falt + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoNovaIguacu: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="NOVA IGUAÇU" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};


// ---------- Capa ----------
export const TITULO_CAPA = ['Educação:', 'faltaram', '25 mi para', 'o mínimo.'];
export const CapaOrcamentoNovaIguacu: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · NOVA IGUAÇU · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
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