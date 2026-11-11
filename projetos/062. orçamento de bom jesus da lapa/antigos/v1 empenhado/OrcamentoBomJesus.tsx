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

// 062. orçamento de Bom Jesus da Lapa (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 061 Uruçuca. O Kit Mapas abre (voo até Bom Jesus da Lapa e o que a prefeitura
// arrecadou em 2024: projetos/062.../mapas/bomjesus.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada
// ano, a PILHA DO ANO em volta dele. Orçamento de R$ 325 a 365 mi: 1 MOEDA = R$ 500 MIL e 1 PILHA = R$ 5 MI.
// Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando
// sempre no mesmo sentido. Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE BOM JESUS DA LAPA, todos do
// TCM-BA (mais a Lei 15.197/2025 e a notícia do jornal A Tarde sobre o aeroporto): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 174.9; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,1193, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '062. orçamento de bom jesus da lapa';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 345'),
  gastou24: quando('Gastou 359'),
  deficit24: quando('O proprio balanco'),
  d14: quando('deficit 14'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 400'),
  gastou25: quando('Gastou 364', 2), // o gancho diz "Bom Jesus da Lapa gastou 364 milhões e 500 em 2025"
  sobra25: quando('Sobraram 36'),
  ano26: quando('2026 ate setembro Somando'),
  somando: quando('Somando prefeitura'),
  arrec26: quando('arrecadou 355'),
  gastou26: quando('Gastou 325'),
  repara: quando('Agora repara'),
  romaria: quando('Aqui e a cidade da romaria'),
  lei: quando('uma lei federal'),
  nascontas: quando('Nas contas as festas'),
  relat: quando('Os relatorios nao separam'),
  f24: quando('Em 2024 essa acao'),
  fg24: quando('Gasto 10 e 100'),
  dobro: quando('Mais que o dobro'),
  f25: quando('Em 2025 previsto'),
  fg25: quando('Gasto 8 e 200'),
  f26: quando('Em 2026 ate setembro ja sao'),
  jaSao: quando('ja sao 9'),
  bandas: quando('So com bandas'),
  assist: quando('A assistencia social inteira'),
  a24: quando('teve 7 e 400'),
  a25: quando('4 e 700 em 2025'),
  a26: quando('5 milhoes ate setembro'),
  tres: quando('Nos tres anos'),
  aero: quando('O aeroporto da cidade'),
  aero26: quando('26 milhoes e 100 segundo'),
  tribunal: quando('No Tribunal de Contas ha'),
  pregao: quando('uma delas sobre o pregao'),
  analise: quando('Em analise nao e condenacao'),
  gastar: quando('Gastar com festa'),
  mas: quando('Mas se a festa'),
  prioridade: quando('qual e a prioridade'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'estacao' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E ESGOTO (SAAE)', tipo: 'estacao'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = []; // nenhum setor da fala ficou em zero

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.15 * Math.PI);
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
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara", "Assistência" e "Agricultura" se repetem
const lista = (frases: string[], v: number[], rots: Record<string, string> = {}, so: string[] = []): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agu', 'agr', 'esp', 'mam'].map((s, k) => ({s, t: quando(frases[k]), v: v[k], rot: rots[s], soPlaca: so.includes(s)}));
const ANOS: Ano[] = [
  // 2024: arrecadou 345,3 e gastou 359,9: o Balanço chama a diferença de "Défit": 14,6 mi
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 359.9, rotulo: '2024', falta: {t: T.deficit24, v: 14.594, txt: 'A MAIS', rot: 'DÉFICIT: R$ 14,6 MI'},
    entradas: lista(['Educacao 133', 'Saude 105', 'Administracao 20 e 500', 'Obras e servicos urbanos 29', 'Camara de Vereadores 8', 'Dividas e encargos 17', 'Cultura e festas 11', 'Assistencia social 7 e 400 Agua', 'Agua e esgoto pela autarquia', 'Agricultura 2 milhoes e 200', 'Esporte 1 milhao e 100', 'Meio ambiente 1 milhao e 800'],
      [133.794, 105.892, 20.518, 28.981, 8.640, 17.817, 11.781, 7.426, 18.499, 2.158, 1.1136, 1.837])},
  // 2025: arrecadou 400,8 e gastou 364,5: o Balanço traz superávit de 36,2 mi
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 364.5, rotulo: '2025', falta: {t: T.sobra25, v: 36.221, txt: 'SOBRARAM', sobra: true, rot: 'SOBRARAM R$ 36,2 MI'},
    entradas: lista(['Educacao 161', 'Saude 94', 'Administracao 22', 'Obras e servicos urbanos 18', 'Camara 10', 'Dividas 16', 'Cultura e festas 10', 'Assistencia social 4', 'Agua e esgoto 20', 'Agricultura 3', 'Esporte 819', 'Meio ambiente 1 milhao e 900'],
      [161.368, 94.466, 22.370, 18.456, 10.379, 16.662, 10.065, 4.676, 20.003, 3.357, 0.8187, 1.854])},
  // 2026 (Prefeitura + Câmara + SAAE, liquidado até setembro): arrecadou 355,1 e gastou 325,0. A voz não fala de diferença: sem torre
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 325.0, rotulo: '2026 · ATÉ SET', falta: {t: T.gastou26, v: 0, txt: ''},
    entradas: lista(['Educacao 134', 'Saude 82', 'Administracao 20 e 100', 'Obras e servicos urbanos 25', 'Camara 7', 'Dividas 14', 'Cultura e festas 12', 'Assistencia social 5', 'Agua e esgoto 15', 'Agricultura 2 e 700', 'Esporte 1 milhao e 300', 'Meio ambiente 3'],
      [134.269, 82.124, 20.073, 25.356, 7.918, 14.627, 12.343, 4.963, 15.771, 2.693, 1.2535, 3.339])},
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
const ESCALA = 5; // 1 moeda = R$ 500 mil; 1 pilha = R$ 5 milhões (orçamento de R$ 325 a 365 mi)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa cerca de 80 pilhas) ----------
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
// esquerda: a ação "festas culturais e religiosas", previsto (fantasma) x gasto (cor do ano), um par por ano
const FE = [
  {prev: {p: [-4.75, 0, ZA] as V3, v: 4.259}, gasto: {p: [-3.95, 0, ZA] as V3, v: 10.109}, tP: () => T.f24, tG: () => T.fg24},
  {prev: {p: [-2.95, 0, ZA] as V3, v: 6.298}, gasto: {p: [-2.15, 0, ZA] as V3, v: 8.175}, tP: () => T.f25, tG: () => T.fg25},
  {prev: {p: [-1.15, 0, ZA] as V3, v: 7.599}, gasto: {p: [-0.35, 0, ZA] as V3, v: 9.572}, tP: () => T.f26, tG: () => T.f26 + 2.0},
];
// direita: a assistência social inteira (função 08), uma torre por ano
const AS = [
  {p: [1.85, 0, ZA] as V3, v: 7.426, t: () => T.a24},
  {p: [2.85, 0, ZA] as V3, v: 4.676, t: () => T.a25},
  {p: [3.85, 0, ZA] as V3, v: 4.963, t: () => T.a26},
];
const FE_VIS = (t: number) => vis(t, T.nascontas - 0.1, T.aero - 0.2) + vis(t, T.mas - 0.45, FIM + 2);
const AS_VIS = (t: number) => vis(t, T.assist - 0.3, T.aero - 0.2) + vis(t, T.mas - 0.45, FIM + 2);
const PLACA_POS: V3 = [0, 0, 1.9];
const ROMARIA_VIS = (t: number) => vis(t, T.romaria - 0.1, T.nascontas + 0.3);
const AERO_VIS = (t: number) => vis(t, T.aero - 0.1, T.tribunal - 0.1);
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
  const fx = FE_VIS(t);
  if (fx > 0.01) {
    FE.forEach((par, yi) => {
      const kp = cresce(par.tP() + 0.6) * fx;
      if (kp > 0.01) fantasmas.push(...torre(par.prev.p, (par.prev.v / ESC_A) * kp, LADO_A, tema.objetoClaro));
      const kg = cresce(par.tG() + 0.1) * fx;
      if (kg > 0.01) solidas.push(...torre(par.gasto.p, (par.gasto.v / ESC_A) * kg, LADO_A, CA[yi]));
    });
  }
  const ax = AS_VIS(t);
  if (ax > 0.01) {
    AS.forEach((a, yi) => {
      const k = cresce(a.t() + 0.1) * ax;
      if (k > 0.01) solidas.push(...torre(a.p, (a.v / ESC_A) * k, LADO_A, CA[yi]));
    });
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.9, 0, 5.0], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.7, 0, 3.0],
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
  const fx = FE_VIS(t);
  const ax = AS_VIS(t);
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

      {/* os achados: a placa da romaria, a gaveta das festas (esquerda) e a da assistência social (direita) */}
      <RuaPlaca tema={tema} pos={PLACA_POS} escala={0.95} sobe={ROMARIA_VIS(t)} linhas={['ROMARIA DO BOM JESUS', 'LEI FEDERAL 15.197/2025', 'CULTURA NACIONAL']} aceso={janela(t, T.romaria, T.nascontas, 0.4)} />
      <BaseGaveta tema={tema} pos={[-2.55, 0, ZA]} sobe={fx} larg={5.4} texto="FESTAS CULTURAIS E RELIGIOSAS" aceso={Math.max(janela(t, T.nascontas, T.assist, 0.4), janela(t, T.tres, T.aero, 0.4), janela(t, T.mas, FIM, 0.4), 0.6 * janela(t, T.bandas, T.bandas + 1.6, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.85, 0, ZA]} sobe={ax} larg={3.4} texto="ASSISTÊNCIA SOCIAL" aceso={Math.max(janela(t, T.assist, T.aero, 0.4), janela(t, T.mas, FIM, 0.4))} />

      {/* a obra do Estado (o aeroporto) e o Tribunal */}
      <RuaPlaca tema={tema} pos={PLACA_POS} escala={0.95} sobe={AERO_VIS(t)} linhas={['AEROPORTO', 'GOVERNO DO ESTADO', 'R$ 26,1 MI']} aceso={janela(t, T.aero, T.tribunal, 0.4)} />
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
const PB = (c: V3, larg: number, h: number, dx = 0): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, 1.1, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre vermelha do déficit; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.d14 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre-fantasma do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // achados: a placa da romaria, depois as festas (esquerda, par a par) e a assistência social (direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 1.2, ZA], 10.4, 7.6, [0, 1.6, 1])],
      [T.romaria - 0.1, E(soma(PLACA_POS, [0, 1.15, 0]), 3.7, 3.4, [-0.05, 0.95, 1])],
      [T.nascontas - 0.3, E(soma(PLACA_POS, [0.05, 1.15, 0]), 3.5, 3.2, [0.05, 0.95, 1])],
      [T.nascontas + 0.4, PB([-2.55, 0, ZA], 6.6, 3.2, -0.04)],
      [T.f24 - 0.1, PB(soma(FE[0].prev.p, [0.4, 0, 0]), 3.8, 3.0, -0.03)],
      [T.dobro + 0.6, PB(soma(FE[0].prev.p, [0.5, 0, 0]), 3.8, 3.0, -0.02)],
      [T.f25 - 0.1, PB(soma(FE[1].prev.p, [0.4, 0, 0]), 3.8, 3.0, -0.01)],
      [T.fg25 + 0.8, PB(soma(FE[1].prev.p, [0.5, 0, 0]), 3.8, 3.0, 0)],
      [T.f26 - 0.1, PB(soma(FE[2].prev.p, [0.4, 0, 0]), 3.8, 3.0, 0.01)],
      [T.bandas + 1.6, PB(soma(FE[2].prev.p, [0.5, 0, 0]), 3.8, 3.0, 0.02)],
      [T.assist - 0.1, PB(AS[1].p, 4.4, 2.4, 0.03)],
      [T.a26 + 1.0, PB(AS[1].p, 4.2, 2.4, 0.04)],
      [T.tres - 0.1, PB([-0.35, 0, ZA], 10.4, 3.2, 0.02)],
      [T.aero - 0.3, PB([-0.2, 0, ZA], 10.0, 3.2, 0.0)],
    ],
  },
  // a obra do Estado
  {
    ini: T.aero - 0.2,
    arco: 0.02,
    chaves: [
      [T.aero - 0.2, E(soma(PLACA_POS, [0, 1.15, 0]), 3.7, 3.4, [-0.05, 0.95, 1])],
      [T.tribunal - 0.3, E(soma(PLACA_POS, [0.05, 1.15, 0]), 3.5, 3.2, [0.05, 0.95, 1])],
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
  // a pergunta: as duas gavetas (festas x assistência social) e depois a mesa inteira
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PB([-0.35, 0, ZA], 10.4, 3.2, -0.02)],
      [T.prioridade + 0.3, PB([-0.1, 0, ZA], 9.6, 3.2, 0)],
      [T.segue - 0.1, PB([-0.1, 0, ZA], 9.8, 3.2, 0.02)],
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
  [0, 'BOM JESUS DA LAPA'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: A ROMARIA'],
  [T.nascontas, 'FESTAS CULTURAIS E RELIGIOSAS'],
  [T.assist, 'E A ASSISTÊNCIA SOCIAL?'],
  [T.aero, 'OBRA DO ESTADO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.deficit24, texto: 'GASTOU EM 2024: R$ 359,9 MILHÕES'},
    {a: T.deficit24, b: Y0.entradas[0].t, texto: 'O BALANÇO CHAMA DE DÉFICIT: R$ 14,6 MI', destaque: true},
    {a: T.ano25, b: T.arrec25 + 0.3, texto: '2025'},
    {a: T.arrec25 + 0.3, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 400,8 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 364,5 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 36,2 MI EM 2025', destaque: true},
    {a: T.ano26, b: T.somando, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.somando, b: T.arrec26, texto: 'PREFEITURA + CÂMARA + SAAE (AUTARQUIA DA ÁGUA)'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 355,1 MI'},
    {a: T.gastou26, b: Y2.entradas[0].t, texto: 'GASTOU ATÉ SETEMBRO: R$ 325 MI'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.lei, texto: 'BOM JESUS DA LAPA, A CIDADE DA ROMARIA'},
    {a: T.lei, b: T.nascontas, texto: 'LEI 15.197/2025: MANIFESTAÇÃO DA CULTURA NACIONAL'},
    {a: T.nascontas, b: T.relat, texto: 'NAS CONTAS: FESTAS CULTURAIS E RELIGIOSAS, NUMA AÇÃO SÓ'},
    {a: T.relat, b: T.f24, texto: 'OS RELATÓRIOS NÃO SEPARAM A ROMARIA'},
    {a: T.f24, b: T.fg24, texto: 'FESTAS 2024 · PREVISTO: R$ 4,3 MI'},
    {a: T.fg24, b: T.dobro, texto: 'GASTO EM 2024: R$ 10,1 MI', destaque: true},
    {a: T.dobro, b: T.f25, texto: 'MAIS QUE O DOBRO DO PREVISTO', destaque: true},
    {a: T.f25, b: T.fg25, texto: 'FESTAS 2025 · PREVISTO: R$ 6,3 MI'},
    {a: T.fg25, b: T.f26, texto: 'GASTO EM 2025: R$ 8,2 MI', destaque: true},
    {a: T.f26, b: T.jaSao, texto: 'FESTAS 2026 · ATÉ SETEMBRO'},
    {a: T.jaSao, b: T.bandas, texto: 'JÁ SÃO R$ 9,6 MI · PREVISTO NO ANO: R$ 7,6 MI', destaque: true},
    {a: T.bandas, b: T.assist, texto: 'SÓ COM BANDAS E SHOWS: R$ 5,9 MI', destaque: true},
    {a: T.assist, b: T.a24, texto: 'A ASSISTÊNCIA SOCIAL INTEIRA'},
    {a: T.a24, b: T.a25, texto: 'ASSISTÊNCIA SOCIAL 2024: R$ 7,4 MI'},
    {a: T.a25, b: T.a26, texto: 'ASSISTÊNCIA SOCIAL 2025: R$ 4,7 MI'},
    {a: T.a26, b: T.tres, texto: 'ASSISTÊNCIA SOCIAL 2026, ATÉ SETEMBRO: R$ 5 MI'},
    {a: T.tres, b: T.aero, texto: 'NOS TRÊS ANOS, A AÇÃO DAS FESTAS GASTOU MAIS', destaque: true},
    {a: T.aero, b: T.aero26, texto: 'O AEROPORTO DA CIDADE'},
    {a: T.aero26, b: T.tribunal, texto: 'OBRA DO ESTADO: R$ 26,1 MI (SEGUNDO O JORNAL A TARDE)', destaque: true},
    {a: T.tribunal, b: T.pregao, texto: 'DENÚNCIAS EM ANÁLISE NO TCM-BA'},
    {a: T.pregao, b: T.analise, texto: 'UMA SOBRE O PREGÃO DE 2026 PARA ESTRUTURAS DE EVENTOS'},
    {a: T.analise, b: T.gastar, texto: 'EM ANÁLISE NÃO É CONDENAÇÃO'},
    {a: T.gastar, b: T.mas, texto: 'GASTAR COM FESTA NÃO É CRIME'},
    {a: T.mas, b: T.prioridade, texto: 'FESTAS 2025: R$ 8,2 MI · ASSISTÊNCIA 2025: R$ 4,7 MI'},
    {a: T.prioridade, b: T.segue, texto: 'QUAL É A PRIORIDADE?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E SAAE · TCM-BA'},
  {a: T.repara, b: T.nascontas, texto: 'FONTE: LEI FEDERAL 15.197, DE 5/9/2025'},
  {a: T.nascontas, b: T.aero, texto: 'FONTE: DESPESA POR AÇÃO, ANEXOS 6 E 9 · TCM-BA'},
  {a: T.aero, b: T.tribunal, texto: 'FONTE: JORNAL A TARDE, 06/08/2023'},
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
  const fimA = T.aero - 0.05;
  const ANO_F = ['2024', '2025', '2026 ATÉ SET'];
  const valF = ['R$ 10,1 MI', 'R$ 8,2 MI', 'R$ 9,6 MI'];
  const prevF = ['R$ 4,3 MI', 'R$ 6,3 MI', 'R$ 7,6 MI'];
  FE.forEach((par, k) => {
    // cada par fica com as plaquinhas só enquanto a voz fala dele (o próximo par entra no lugar)
    const fimPar = k < 2 ? FE[k + 1].tP() + 0.2 : T.assist;
    r.push({a: par.tP() + 0.8, b: fimPar, p: topo(par.prev.p, par.prev.v), valor: prevF[k], sub: `PREVISTO · ${ANO_F[k]}`});
    r.push({a: par.tG() + 0.5, b: fimPar, p: topo(par.gasto.p, par.gasto.v), valor: valF[k], sub: `GASTO · ${ANO_F[k]}`, cor: CA[k]});
  });
  // ao lado da torre de 2026 (nunca em cima dela)
  r.push({a: T.bandas + 0.5, b: T.assist, p: soma(FE[2].gasto.p, [1.05, 1.1, 0]), valor: 'R$ 5,9 MI', sub: 'SÓ BANDAS E SHOWS', cor: C.alerta});
  AS.forEach((a, k) => r.push({a: a.t() + 0.5, b: T.tres, p: topo(a.p, a.v), valor: fmtV(a.v), sub: `ASSISTÊNCIA · ${ANO_F[k]}`, cor: CA[k]}));
  // "nos três anos": um par por ano, festas x assistência (só os gastos)
  FE.forEach((par, k) => r.push({a: T.tres + 0.4 + k * 0.15, b: fimA, p: topo(par.gasto.p, par.gasto.v), valor: valF[k], sub: `FESTAS · ${ANO_F[k]}`, cor: CA[k]}));
  AS.forEach((a, k) => r.push({a: T.tres + 0.5 + k * 0.15, b: fimA, p: topo(a.p, a.v), valor: fmtV(a.v), sub: `ASSIST. · ${ANO_F[k]}`, cor: CA[k]}));
  // a pergunta: 2025, festas x assistência
  r.push(
    {a: T.mas + 0.6, b: T.segue + 0.8, p: topo(FE[1].gasto.p, FE[1].gasto.v), valor: 'R$ 8,2 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.mas + 0.8, b: T.segue + 0.8, p: topo(AS[1].p, AS[1].v), valor: 'R$ 4,7 MI', sub: 'ASSISTÊNCIA · 2025', cor: CA[1]},
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
  const miolo = vis(t, T.nascontas + 0.2, T.aero - 0.2) + vis(t, T.mas - 0.2, FIM + 1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI' : '1 MOEDA = R$ 500 MIL · 1 PILHA = R$ 5 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // ★ melhoria (gancho visual): enquanto a voz diz "364 milhões e 500 em 2025. Só a conta das festas levou mais que toda a
    // assistência social", os números entram no mapa
    const g1 = quando('gastou 364'), g2 = quando('So a conta das festas');
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, 6.3, 6.65));
    const kg2 = entra(t, g2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="2025: GASTOU R$ 364,5 MI" k={entra(t, g1, 0.45)} tam={34} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="FESTAS R$ 8,2 MI × ASSISTÊNCIA R$ 4,7 MI" k={kg2} destaque tam={30} /> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/bomjesus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.d14, T.sobra25, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 50).map((e) => e.t)), T.fg24, T.dobro, T.fg25, T.bandas, T.tres, T.aero26];
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
  [T.romaria, T.lei, T.f24, T.f25, T.f26, T.a24, T.a25, T.a26, T.aero, T.tribunal, T.pregao].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.fg24, T.fg25].forEach((t) => s.push({t: t + 0.2, f: 'baque', v: 0.15}));
  // ★ melhoria (atenção): baque leve no gancho das festas; impacto no "mais que o dobro", nas bandas e no "nos três anos"
  s.push({t: quando('So a conta das festas') + 0.9, f: 'baque', v: 0.15}, {t: T.dobro + 0.05, f: 'impacto', v: 0.15}, {t: T.bandas + 0.5, f: 'impacto', v: 0.13}, {t: T.tres + 0.1, f: 'impacto', v: 0.15});
  s.push({t: T.prioridade + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.8, 7.5, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.deficit24 + 0.9, T.d14 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.somando + 1.2, T.arrec26 + 0.9, T.gastou26 + 0.9, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.romaria + 0.6, T.lei + 1.4, T.nascontas + 1.0, T.relat + 1.0, T.f24 + 1.4, T.fg24 + 0.9, T.dobro + 0.6,
  T.f25 + 1.4, T.fg25 + 0.9, T.f26 + 1.2, T.f26 + 2.8, T.bandas + 1.0, T.assist + 0.8, T.a24 + 0.9, T.a25 + 0.9, T.a26 + 0.9,
  T.tres + 1.0, T.aero + 0.8, T.aero26 + 0.9, T.tribunal + 0.8, T.pregao + 1.2, T.analise + 0.6,
  T.gastar + 0.5, T.mas + 1.2, T.prioridade + 0.4, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoBomJesus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="BOM JESUS DA LAPA" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {/* selo do @eumagnoleite na abertura (arte aprovada, opção B; regra 15c) */}
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festa gastou', 'mais que a', 'assistência', 'social?'];
export const CapaOrcamentoBomJesus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · BOM JESUS DA LAPA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
