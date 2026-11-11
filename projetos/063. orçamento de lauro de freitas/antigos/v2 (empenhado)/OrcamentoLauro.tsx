import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {CasaMini, CofreFGTS, ArvoreRedonda} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, EstacaoSaneamento, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, RuaPlaca} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 063. orçamento de Lauro de Freitas (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 062 Bom Jesus da Lapa. O Kit Mapas abre (voo até Lauro de Freitas e o que a prefeitura
// arrecadou em 2024: projetos/063.../mapas/lauro.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada
// ano, a PILHA DO ANO em volta dele. Cidade grande (orçamento de R$ 0,9 a 1,1 bilhão): 1 MOEDA = R$ 2 MI e 1 PILHA = R$ 20 MI.
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando
// sempre no mesmo sentido. Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE LAURO DE FREITAS, todos do
// TCM-BA (mais as notícias do Correio e do A Tarde): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 174.81; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,136, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '063. orçamento de lauro de freitas';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 1 bilhao e 56'),
  gastou24: quando('Gastou 1 bilhao e 104'),
  deficit24: quando('O proprio balanco'),
  d47: quando('deficit 47'),
  ano25: quando('2025 Em janeiro'),
  calam25: quando('Em janeiro a prefeitura'),
  correio: quando('segundo o jornal Correio'),
  arrec25: quando('arrecadou 1 bilhao e 127'),
  gastou25: quando('Gastou 1 bilhao e 19'),
  sobra25: quando('O balanco fecha com sobra'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 873'),
  gastou26: quando('Gastou 903'),
  amais26: quando('Sao 29'),
  empenhou: quando('E ja empenhou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara'),
  subiu: quando('a arrecadacao subiu'),
  saude40: quando('a saude gastou 40'),
  ass11: quando('A assistencia social quase 11'),
  festas: quando('E as festas'),
  e24: quando('A conta de eventos culturais gastou'),
  e25: quando('Em 2025 5 milhoes'),
  e26: quando('Em 2026 comecou'),
  sub21: quando('subiu para 21'),
  pagou: quando('ja pagou 14'),
  somados: quando('Mais que os dois anos'),
  mat: quando('A maternidade municipal'),
  obra2: quando('A obra deve levar'),
  mat17: quando('Dos 17 milhoes'),
  mat684: quando('684 mil'),
  tribunal: quando('No Tribunal de Contas uma'),
  improc: quando('foi julgada improcedente'),
  sete: quando('Sete processos'),
  gastar: quando('Gastar com festa'),
  mas: quando('Mas numa cidade'),
  porque: quando('por que a conta'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 10 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'estacao' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E PRECATÓRIOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = []; // nenhum setor da fala ficou em zero

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.18 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number; rot?: string; soPlaca?: boolean};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean; rot?: string}};
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara", "Assistência" e "Esporte" se repetem
const lista = (frases: string[], v: number[], rots: Record<string, string> = {}, so: string[] = []): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'esp', 'mam'].map((s, k) => ({s, t: quando(frases[k]), v: v[k], rot: rots[s], soPlaca: so.includes(s)}));
const ANOS: Ano[] = [
  // 2024: arrecadou 1.056,1 e gastou 1.103,8: o Balanço chama a diferença de "DÉFICIT": 47,7 mi
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 1103.8, rotulo: '2024', falta: {t: T.deficit24, v: 47.694, txt: 'A MAIS', rot: 'DÉFICIT: R$ 47,7 MI'},
    entradas: lista(['Educacao 360', 'Saude 251', 'Administracao 147', 'Obras e servicos urbanos 137', 'Camara de Vereadores 38', 'Dividas e precatorios 57', 'Cultura e festas 8', 'Assistencia social 36', 'Esporte 4 e 300', 'Meio ambiente 8'],
      [360.565, 251.375, 147.836, 137.627, 38.199, 57.233, 8.868, 36.164, 4.333, 8.831])},
  // 2025: arrecadou 1.127,0 e gastou 1.019,4: o Balanço traz superávit de 107,6 mi
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 1019.4, rotulo: '2025', falta: {t: T.sobra25, v: 107.563, txt: 'SOBRA', sobra: true, rot: 'SOBRA: R$ 107,6 MI'},
    entradas: lista(['Educacao 334', 'Saude 211', 'Administracao 98 e 500', 'Obras e servicos urbanos 165', 'Camara 43', 'Dividas 89', 'Cultura e festas 7', 'Assistencia social 25', 'Esporte 1 milhao', 'Meio ambiente 5'],
      [334.255, 211.041, 98.533, 165.583, 43.689, 89.757, 6.962, 25.315, 1.086, 5.287])},
  // 2026 (Prefeitura + Câmara, liquidado até setembro): arrecadou 873,8 e gastou 903,7: 29,9 a mais
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 903.7, rotulo: '2026 · ATÉ SET', falta: {t: T.amais26, v: 29.911, txt: 'A MAIS', rot: 'R$ 29,9 MI A MAIS'},
    entradas: lista(['Educacao 272', 'Saude 195', 'Administracao 98 e 600', 'Obras e servicos urbanos 168', 'Camara 34', 'Dividas 42', 'Cultura e festas 14', 'Assistencia social 18', 'Esporte 4 e 400', 'Meio ambiente 6'],
      [272.719, 195.125, 98.647, 168.784, 34.291, 42.509, 14.440, 18.498, 4.352, 6.594])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const entradaDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id);
const valorDe = (id: string, yi: number) => entradaDe(id, yi)?.v ?? 0;
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
const ESCALA = 20; // 1 moeda = R$ 2 mi; 1 pilha = R$ 20 milhões (cidade grande: orçamento de R$ 0,9 a 1,1 bilhão)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa de 47 a 57 pilhas) ----------
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
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + (e.soPlaca ? 0 : Math.ceil(e.v / ESCALA - 0.0005)), 0);
  y.entradas.forEach((e) => {
    const n = e.v / ESCALA;
    if (n < 0.003 || e.soPlaca) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.12, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo (torres de 2 x 2, 1 pilha = R$ 1 mi), da esquerda para a direita na ordem da fala ----------
const LADO_A = 2;
const ZA = 0.2;
const ESC_A = 1;
// a conta de eventos culturais: 2024 (dourado), 2025 (verde), 2026 previsto (fantasma, cresce de 11 para 21,1) e 2026 pago (rosa)
const EV = {
  e24: {p: [-3.2, 0, ZA] as V3, v: 8.816},
  e25: {p: [-2.2, 0, ZA] as V3, v: 5.319},
  prev26: {p: [-0.2, 0, ZA] as V3, ini: 10.995, fim: 21.141},
  pago26: {p: [0.8, 0, ZA] as V3, v: 14.373},
};
const EV_CENTRO: V3 = [-1.2, 0, ZA];
const EV_VIS = (t: number) => vis(t, T.festas - 0.1, T.mat - 0.2) + vis(t, T.gastar - 0.45, FIM + 2);
// a maternidade: placa da obra e, à direita, o previsto no ano (fantasma) x o pago até setembro (rosa)
const MAT_PLACA: V3 = [-1.0, 0, 1.3];
const MAT_PREV: V3 = [2.0, 0, ZA];
const MAT_PAGO: V3 = [2.85, 0, ZA];
const MAT_VIS = (t: number) => vis(t, T.mat - 0.1, T.tribunal - 0.1);
const TCM_POS: V3 = [0, 0, -2.6];

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
    // na frente do cofre: torre vermelha do déficit de 2024 e torre-fantasma do que sobrou em 2025
    ANOS.forEach((y) => {
      if (y.falta.v <= 0) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const ex = EV_VIS(t);
  if (ex > 0.01) {
    const k24 = cresce(T.e24 + 0.3) * ex;
    if (k24 > 0.01) solidas.push(...torre(EV.e24.p, (EV.e24.v / ESC_A) * k24, LADO_A, CA[0]));
    const k25 = cresce(T.e25 + 0.2) * ex;
    if (k25 > 0.01) solidas.push(...torre(EV.e25.p, (EV.e25.v / ESC_A) * k25, LADO_A, CA[1]));
    const kp = cresce(T.e26 + 0.5) * ex;
    const vPrev = EV.prev26.ini + (EV.prev26.fim - EV.prev26.ini) * (final ? 1 : rampa(t, T.sub21 + 0.2, T.sub21 + 1.4));
    if (kp > 0.01) fantasmas.push(...torre(EV.prev26.p, (vPrev / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const kg = cresce(T.pagou + 0.1) * ex;
    if (kg > 0.01) solidas.push(...torre(EV.pago26.p, (EV.pago26.v / ESC_A) * kg, LADO_A, CA[2]));
  }
  const mx = MAT_VIS(t);
  if (mx > 0.01) {
    const kp = rampa(t, T.mat17 + 0.2, T.mat17 + 1.1) * mx;
    if (kp > 0.01) fantasmas.push(...torre(MAT_PREV, (17.44 / ESC_A) * kp, LADO_A, tema.objetoClaro));
    const kg = rampa(t, T.mat684, T.mat684 + 0.6) * mx;
    if (kg > 0.01) solidas.push(...torre(MAT_PAGO, Math.max(0.2, 0.684 / ESC_A) * kg, LADO_A, CA[2]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.6], 0.2],
  [[-3.3, 0, 8.0], -0.4],
];
const ARVORES: V3[] = [
  [-1.4, 0, 8.4],
  [2.2, 0, 8.5],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const aceso = Math.max(0, ...ditas);
  const zerado = ZERADOS.includes(s.id);
  const e = 0.47;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
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
    case 'estacao':
      return <EstacaoSaneamento {...props} />;
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const ex = EV_VIS(t);
  const mx = MAT_VIS(t);
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
      <PilhasDinheiro pilhas={torres} max={3000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* os achados: a gaveta dos eventos culturais e a placa da maternidade */}
      <BaseGaveta tema={tema} pos={EV_CENTRO} sobe={ex} larg={5.4} texto="EVENTOS CULTURAIS" aceso={Math.max(janela(t, T.festas, T.mat, 0.4), janela(t, T.mas, FIM, 0.4), 0.6 * janela(t, T.somados, T.somados + 1.8, 0.4))} />
      <RuaPlaca tema={tema} pos={MAT_PLACA} escala={0.9} sobe={mx} linhas={['MATERNIDADE MUNICIPAL', 'ORDEM DE SERVIÇO: MAIO/2026', 'OBRA DE CERCA DE 2 ANOS']} aceso={janela(t, T.mat, T.tribunal, 0.4)} />
      <BaseGaveta tema={tema} pos={[2.42, 0, ZA]} sobe={mx} larg={2.2} texto="2026" aceso={janela(t, T.mat17, T.tribunal, 0.4)} />

      {/* o Tribunal */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={vis(t, T.tribunal - 0.2, T.gastar - 0.1)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.6, 7.6, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(Math.max(0, Math.min(SETORES.length - 1, i)));
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
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 3.0, 1]);
// achados: câmera mais baixa (dir y 1,1) para ver a ALTURA da torre do previsto ao lado da moedinha do gasto
const PB = (c: V3, larg: number, h: number, dx = 0, el = 1.1): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, el, 1]);
// eventos e maternidade: mais alta (dir y 2,1), para o fundo ser a mesa e nada ficar atrás do cabeçalho
const PM = (c: V3, larg: number, h: number, dx = 0): Cam => PB(c, larg, h, dx, 2.1);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha do déficit; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.d47 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre-fantasma do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.amais26 + 0.8, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // agora repara: a casinha da saúde (2024 x 2025) e depois a da assistência social
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, DE_CIMA(0.1)],
      [T.saude40 - 0.4, OLHA_SETOR(idx('sau'), 1.25)],
      [T.ass11 - 0.5, OLHA_SETOR(idx('sau'), 1.2)],
      [T.ass11 - 0.1, OLHA_SETOR(idx('ass'), 1.15)],
      [T.festas - 0.2, OLHA_SETOR(idx('ass'), 1.1)],
    ],
  },
  // a conta de eventos: 2024, 2025, o previsto de 2026 que cresce e o pago até setembro
  {
    ini: T.festas - 0.1,
    arco: 0.03,
    chaves: [
      [T.festas - 0.1, PM(EV_CENTRO, 7.2, 3.2, -0.04)],
      [T.e24 - 0.1, PM(soma(EV.e24.p, [0.5, 0, 0]), 4.4, 2.8, -0.03)],
      [T.e25 + 0.9, PM(soma(EV.e24.p, [0.55, 0, 0]), 4.4, 2.8, -0.02)],
      [T.e26 - 0.1, PM(soma(EV.prev26.p, [0.3, 0, 0]), 5.0, 3.8, -0.01)],
      [T.sub21 + 1.4, PM(soma(EV.prev26.p, [0.3, 0, 0]), 5.4, 5.2, 0)],
      [T.somados - 0.2, PM(EV_CENTRO, 7.2, 5.2, 0.02)],
      [T.mat - 0.3, PM(soma(EV_CENTRO, [0.1, 0, 0]), 7.0, 5.2, 0.03)],
    ],
  },
  // a maternidade
  {
    ini: T.mat - 0.2,
    arco: 0.02,
    chaves: [
      [T.mat - 0.2, E(soma(MAT_PLACA, [0, 0.8, 0]), 3.9, 3.6, [-0.05, 1.9, 1])],
      [T.mat17 - 0.3, E(soma(MAT_PLACA, [0.05, 0.8, 0]), 3.8, 3.5, [0.05, 1.9, 1])],
      [T.mat17 + 0.1, PM(soma(MAT_PREV, [0.4, 0, 0]), 4.6, 4.6, 0.02)],
      [T.tribunal - 0.3, PM(soma(MAT_PREV, [0.45, 0, 0]), 4.4, 4.6, 0.04)],
    ],
  },
  // o Tribunal
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E(soma(TCM_POS, [0, 1.0, 0]), 6.2, 5.4, [-0.05, 1.3, 1])],
      [T.gastar - 0.3, E(soma(TCM_POS, [0.1, 1.0, 0]), 5.8, 5.0, [0.05, 1.3, 1])],
    ],
  },
  // a pergunta: a gaveta dos eventos e depois a mesa inteira
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PM(EV_CENTRO, 7.4, 5.2, -0.02)],
      [T.porque + 0.3, PM(EV_CENTRO, 7.0, 5.2, 0)],
      [T.segue - 0.1, PM(EV_CENTRO, 7.2, 5.2, 0.02)],
      [T.segue + 0.9, E([0, 1.0, ZA], 11.0, 7.6, [-0.1, 1.4, 1])],
      [FIM, E([0, 0, 0.4], 13.5, 9.6, [-0.3, 1.3, 1])],
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
const ESTADOS: [number, string][] = [
  [0, 'LAURO DE FREITAS'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.festas, 'A CONTA DE EVENTOS'],
  [T.mat, 'A MATERNIDADE'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.deficit24, texto: 'GASTOU EM 2024: R$ 1,104 BILHÃO'},
    {a: T.deficit24, b: Y0.entradas[0].t, texto: 'O BALANÇO CHAMA DE DÉFICIT: R$ 47,7 MI', destaque: true},
    {a: T.ano25, b: T.calam25 + 0.2, texto: '2025'},
    {a: T.calam25 + 0.2, b: T.arrec25, texto: 'JAN/2025: DECRETO DE CALAMIDADE FINANCEIRA', destaque: true},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 1,127 BILHÃO'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 1,019 BILHÃO'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'O BALANÇO FECHA COM SOBRA: R$ 107,6 MI', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 873,8 MI'},
    {a: T.gastou26, b: T.amais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 903,7 MI'},
    {a: T.amais26, b: T.empenhou, texto: 'R$ 29,9 MI A MAIS', destaque: true},
    {a: T.empenhou, b: T.folha, texto: 'EMPENHOU (RESERVOU PARA PAGAR): R$ 1,109 BILHÃO'},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.subiu, texto: 'DE 2024 PARA 2025'},
    {a: T.subiu, b: T.saude40, texto: 'A ARRECADAÇÃO SUBIU QUASE R$ 71 MI'},
    {a: T.saude40, b: T.ass11, texto: 'SAÚDE: R$ 40,3 MI A MENOS', destaque: true},
    {a: T.ass11, b: T.festas, texto: 'ASSISTÊNCIA SOCIAL: R$ 10,8 MI A MENOS', destaque: true},
    {a: T.festas, b: T.e24, texto: 'E AS FESTAS?'},
    {a: T.e24, b: T.e25, texto: 'EVENTOS CULTURAIS 2024: R$ 8,8 MI'},
    {a: T.e25, b: T.e26, texto: 'EVENTOS CULTURAIS 2025: R$ 5,3 MI'},
    {a: T.e26, b: T.sub21, texto: '2026 · PREVISTO NO COMEÇO DO ANO: R$ 11 MI'},
    {a: T.sub21, b: T.pagou, texto: 'O PREVISTO SUBIU PARA R$ 21,1 MI', destaque: true},
    {a: T.pagou, b: T.somados, texto: 'PAGO ATÉ SETEMBRO: R$ 14,4 MI', destaque: true},
    {a: T.somados, b: T.mat, texto: 'MAIS QUE 2024 + 2025 (R$ 14,1 MI)', destaque: true},
    {a: T.mat, b: T.obra2, texto: 'MATERNIDADE: ORDEM DE SERVIÇO EM MAIO/2026'},
    {a: T.obra2, b: T.mat17, texto: 'OBRA DE CERCA DE 2 ANOS (SEGUNDO O A TARDE)'},
    {a: T.mat17, b: T.mat684, texto: 'PREVISTO PARA 2026: R$ 17,4 MI'},
    {a: T.mat684, b: T.tribunal, texto: 'PAGO ATÉ SETEMBRO: R$ 684 MIL'},
    {a: T.tribunal, b: T.improc, texto: 'REPRESENTAÇÃO DO MP SOBRE AS CONTAS DE 2024'},
    {a: T.improc, b: T.sete, texto: 'JULGADA IMPROCEDENTE (MARÇO/2026)'},
    {a: T.sete, b: T.gastar, texto: '7 PROCESSOS DE 2025 E 2026 SEM JULGAMENTO PUBLICADO'},
    {a: T.gastar, b: T.mas, texto: 'GASTAR COM FESTA NÃO É CRIME'},
    {a: T.mas, b: T.porque, texto: 'CALAMIDADE FINANCEIRA EM 2025'},
    {a: T.porque, b: T.segue, texto: 'EVENTOS 2026 > 2024 + 2025?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.arrec25, texto: 'FONTE: JORNAL CORREIO, 08/01/2025 (DECRETO 5.432)'},
  {a: T.arrec25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.festas, texto: 'FONTE: ANEXO 9 DE 2024 E DE 2025 · TCM-BA'},
  {a: T.festas, b: T.mat, texto: 'FONTE: ANEXO 6 (2024, 2025) E SIGA SET/2026 · TCM-BA'},
  {a: T.mat, b: T.tribunal, texto: 'FONTE: JORNAL A TARDE, 07/05/2026 · SIGA SET/2026'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      const i = idx(e.s);
      const proxT = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      const b = ei + 1 < y.entradas.length ? Math.max(proxT + 0.45, e.t + 1.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtE(entradaDe(e.s, k)), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const f = y.falta;
    if (f.v > 0) r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(Math.max(0.35, v / ESC_A), LADO_A) + 0.3, 0]);
  // agora repara: as plaquinhas da saúde e da assistência (2024 x 2025) voltam presas às torres das casinhas
  (['sau', 'ass'] as const).forEach((s) => {
    const a = s === 'sau' ? T.saude40 : T.ass11;
    const b = s === 'sau' ? T.ass11 + 0.2 : T.festas;
    [0, 1].forEach((k) => r.push({a: a + 0.3 + k * 0.15, b, p: soma(posTorre(idx(s), k), [0, altFina(valorDe(s, k)) + 0.35, 0]), valor: fmtE(entradaDe(s, k)), sub: ANO_SUB[k], cor: CA[k]}));
  });
  // a conta de eventos
  const fimEv = T.mat - 0.05;
  r.push({a: T.e24 + 0.9, b: fimEv, p: topo(EV.e24.p, EV.e24.v), valor: 'R$ 8,8 MI', sub: 'EVENTOS · 2024', cor: CA[0]});
  r.push({a: T.e25 + 0.6, b: fimEv, p: topo(EV.e25.p, EV.e25.v), valor: 'R$ 5,3 MI', sub: 'EVENTOS · 2025', cor: CA[1]});
  r.push({a: T.e26 + 1.0, b: T.sub21 + 0.2, p: topo(EV.prev26.p, EV.prev26.ini), valor: 'R$ 11 MI', sub: 'PREVISTO · 2026'});
  r.push({a: T.sub21 + 1.0, b: fimEv, p: topo(EV.prev26.p, EV.prev26.fim), valor: 'R$ 21,1 MI', sub: 'PREVISTO · 2026'});
  r.push({a: T.pagou + 0.6, b: fimEv, p: topo(EV.pago26.p, EV.pago26.v), valor: 'R$ 14,4 MI', sub: 'PAGO ATÉ SET/2026', cor: CA[2]});
  r.push({a: T.somados + 0.4, b: fimEv, p: [-2.7, altTorre(EV.e24.v / ESC_A, LADO_A) + 1.25, ZA], valor: 'R$ 14,1 MI', sub: '2024 + 2025', cor: C.alerta});
  // a maternidade
  r.push({a: T.mat17 + 1.0, b: T.tribunal - 0.1, p: topo(MAT_PREV, 17.44), valor: 'R$ 17,4 MI', sub: 'PREVISTO · 2026'});
  r.push({a: T.mat684 + 0.5, b: T.tribunal - 0.1, p: topo(MAT_PAGO, 0.684), valor: 'R$ 684 MIL', sub: 'PAGO ATÉ SET/2026', cor: CA[2]});
  // a pergunta
  r.push(
    {a: T.porque + 0.4, b: T.segue + 0.8, p: [-2.7, altTorre(EV.e24.v / ESC_A, LADO_A) + 1.25, ZA], valor: 'R$ 14,1 MI', sub: 'EVENTOS 2024 + 2025', cor: CA[1]},
    {a: T.porque + 0.6, b: T.segue + 0.8, p: topo(EV.pago26.p, EV.pago26.v), valor: 'R$ 14,4 MI', sub: 'EVENTOS 2026 ATÉ SET', cor: CA[2]},
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
  const miolo = vis(t, T.festas + 0.2, T.tribunal - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI' : '1 MOEDA = R$ 2 MI · 1 PILHA = R$ 20 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    // ★ melhoria (gancho visual): enquanto a voz diz "decretou calamidade financeira em 2025. Em 2026, a conta de eventos já
    // passou de 14 milhões", o decreto e a comparação dos eventos entram no mapa
    const g1 = quando('decretou calamidade'), g2 = quando('a conta de eventos ja passou');
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, 6.3, 6.65));
    const kg2 = entra(t, g2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="DECRETO Nº 5.432, DE 7/1/2025" k={entra(t, g1, 0.45)} tam={32} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="EVENTOS 2026: R$ 14,4 MI · 2024 + 2025: R$ 14,1 MI" k={kg2} destaque tam={24} /> : null}
          </div>
        ) : null}
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
          <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 ENVIADO AO TCM-BA</div>
        </div>
      </>
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
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 86 : 60));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-90, 90, -180, 180, -270, 270, 360].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
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
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? (v.r.valor.length > 22 ? 22 : 30) : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/lauro.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.d47, T.sobra25, T.amais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 100).map((e) => e.t)), T.saude40, T.ass11, T.sub21, T.pagou, T.somados, T.mat684];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => (y.falta.v > 0 ? s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}) : null));
  [T.calam25, T.e24, T.e25, T.e26, T.mat, T.mat17, T.tribunal, T.improc, T.sete].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.saude40, T.ass11].forEach((t) => s.push({t: t + 0.3, f: 'baque', v: 0.15}));
  // ★ melhoria (atenção): baque leve no gancho dos eventos; subida no previsto que cresce; impacto no pago e no "somados"
  s.push({t: quando('a conta de eventos ja passou') + 1.0, f: 'baque', v: 0.15}, {t: T.sub21 + 0.2, f: 'subida', v: 0.15}, {t: T.pagou + 0.3, f: 'impacto', v: 0.14}, {t: T.somados + 0.1, f: 'impacto', v: 0.15});
  s.push({t: T.porque + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.8, 7.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.deficit24 + 0.9, T.d47 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.calam25 + 1.2, T.arrec25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.gastou26 + 0.9, T.amais26 + 0.9, T.empenhou + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.subiu + 0.9, T.saude40 + 1.0, T.ass11 + 1.0, T.festas + 0.4, T.e24 + 1.4, T.e25 + 1.0, T.e26 + 1.3, T.sub21 + 1.5,
  T.pagou + 1.0, T.somados + 1.0, T.mat + 0.8, T.obra2 + 0.8, T.mat17 + 1.3, T.mat684 + 0.9, T.tribunal + 0.8, T.improc + 0.8, T.sete + 1.2,
  T.gastar + 0.5, T.mas + 1.2, T.porque + 0.9, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoLauro: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="LAURO DE FREITAS" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {/* selo do @eumagnoleite na abertura (arte aprovada, opção B; regra 15c) */}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Calamidade', 'em 2025.', 'Eventos de', 'R$ 14 mi?'];
export const CapaOrcamentoLauro: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · LAURO DE FREITAS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: Math.max(...linhas.map((x) => x.length)) > 14 ? 108 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
