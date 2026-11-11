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
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 093. orçamento de Ilhéus (BA), refeito no padrão da série (perfil @eumagnoleite). REFERÊNCIA: 042 Camacan / 092 Ubaitaba.
// O Kit Mapas abre (voo até Ilhéus, as três receitas e a de 2024: projetos/093.../mapas/ilheus.mp4) e o Estúdio 3D monta a
// maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (cidade grande: 1 pilha = R$ 20 mi).
// Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando num sentido só.
// "Gastou" = LIQUIDADO (regra 32). Sem porcentagem, sem nome de gestor, sem nome de empresa, sem segurança pública.
// SÓ DADOS DO e-TCM (Prefeitura UJ 768, Câmara UJ 197, SUTRAM UJ 1086, Fundação Maramata UJ 1104): projetos/093.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 178.56; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,1325, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '093. orçamento de ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('A prefeitura arrecadou'),
  gastou24: quando('Gastou 809'),
  mais24: quando('45 milhoes a mais'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 827'),
  gastou25: quando('Gastou 790'),
  sobra25: quando('Sobraram 37'),
  ano26: quando('2026 ate agosto'),
  arrec26: quando('Arrecadou 575'),
  gastou26: quando('Gastou 576'),
  mais26: quando('903 mil'),
  repara: quando('Agora repara'),
  eventos: quando('a promocao de eventos'),
  onze: quando('levou 11'),
  juntos: quando('Mais do que cultura'),
  ajuda: quando('Ja a ajuda'),
  benef: quando('os beneficios eventuais'),
  b197: quando('1 milhao e 970'),
  camara: quando('A Camara de Vereadores passou'),
  c25: quando('para 29'),
  dobro: quando('Mais que o dobro'),
  subsidio: quando('O subsidio'),
  s26: quando('para 21'),
  pessoal: quando('E o pessoal'),
  p474: quando('custou 474'),
  tribunal: quando('No banco'),
  rendeu: quando('rendeu 5'),
  naoJulg: quando('nao aparece lancamento'),
  negocia: quando('pode ser negociada'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se os eventos'),
  ajuda2: quando('por que a ajuda'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | 'onibus' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO E DEMAIS SECRETARIAS', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E INFRAESTRUTURA', tipo: 'galpao', texto: 'OBRAS'},
  {id: 'lim', nome: 'LIMPEZA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'tra', nome: 'TRANSPORTE E TRÂNSITO', tipo: 'onibus'},
  {id: 'cul', nome: 'CULTURA E TURISMO', tipo: 'palco', texto: 'CULTURA E TURISMO'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'agr', nome: 'AGRICULTURA E PESCA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
];
const R_PREDIO = 7.45;
// a rua da limpeza é larga: ganha folga dos dois lados
const ANGS: number[] = SETORES.map((_, i) => (0.11 + i * 0.14 + (i >= 4 ? 0.05 : 0) + (i >= 5 ? 0.05 : 0)) * Math.PI);
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
    ['obr', 'Obras'],
    ['lim', 'Limpeza'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['tra', 'Transporte'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia'],
    ['mam', 'Meio ambiente'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 809.71, rotulo: '2024', falta: {t: T.mais24, v: 44.953, txt: 'A MAIS'}, entradas: lista(1, [269.265, 181.084, 107.418, 53.337, 66.371, 21.752, 52.448, 3.0222, 6.3491, 16.824, 3.5503, 2.2965, 1.2116])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 790.0, rotulo: '2025', falta: {t: T.sobra25, v: 37.153, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [231.152, 184.892, 130.01, 17.273, 65.849, 29.478, 59.236, 12.004, 9.792, 11.715, 4.3959, 2.121, 0.84789])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 576.72, rotulo: '2026 · ATÉ AGO', falta: {t: T.mais26, v: 0.90312, txt: 'A MAIS'}, entradas: lista(3, [150.235, 127.265, 92.459, 22.088, 58.563, 23.243, 27.332, 32.363, 13.369, 10.975, 2.7931, 1.1416, 0.65182])},
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
const ESCALA = 20; // cidade grande: 1 pilha = R$ 20 milhões
const MIN_PILHA = 0.12; // setor pequeno ainda mostra uma pilhinha baixa
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre ----------
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
      const rel = (a - (ANGS[0] - 0.11 * Math.PI) + Math.PI * 8) % (Math.PI * 2);
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: rel});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + Math.ceil(Math.max(MIN_PILHA, e.v / ESCALA) - 0.0005), 0);
  y.entradas.forEach((e) => {
    const n = Math.max(MIN_PILHA, e.v / ESCALA);
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

// ---------- Os achados no miolo (aqui, 1 pilha = R$ 2 milhões; torres de 3 x 3) ----------
const ESC_A = 2;
const LADO_A = 3;
const ZA = 0.2;
// esquerda (2026 até agosto): eventos de turismo x cultura, esporte, agricultura, meio ambiente; e a ajuda às famílias
const FX = {
  eve: {p: [-4.3, 0, ZA] as V3, v: 10.99},
  cul: {p: [-3.25, 0, ZA] as V3, v: 1.5435},
  esp: {p: [-2.55, 0, ZA] as V3, v: 0.65182},
  agr: {p: [-1.85, 0, ZA] as V3, v: 1.1416},
  mam: {p: [-1.15, 0, ZA] as V3, v: 2.7931},
  ben: {p: [-0.2, 0, ZA] as V3, v: 1.9668},
};
// direita: Câmara 2024 → 2025 x assistência social 2025; subsídio do ônibus 2025 → 2026
const DI = {
  c24: {p: [0.55, 0, ZA] as V3, v: 21.752},
  c25: {p: [1.6, 0, ZA] as V3, v: 29.478},
  ass: {p: [2.65, 0, ZA] as V3, v: 11.715},
  s25: {p: [3.75, 0, ZA] as V3, v: 7.35},
  s26: {p: [4.8, 0, ZA] as V3, v: 21.236},
};
const FX_VIS = (t: number) => vis(t, T.repara + 0.1, T.camara - 0.2) + vis(t, T.gastar - 0.1, FIM + 2);
const DI_VIS = (t: number) => vis(t, T.camara - 0.1, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
// o banco (2025): o dinheiro parado rendeu R$ 5,96 mi; tarifa bancária da prefeitura: não aparece lançamento
const RENDE = {p: [-0.6, 0, 1.0] as V3, v: 5.9645};
const TARIFA_POS: V3 = [0.9, 0, 1.0];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'TARIFA BANCÁRIA', valor: 'PREFEITURA', t: T.naoJulg, carimbos: [[T.naoJulg + 0.6, 'SEM LANÇAMENTO', 'neutro']]},
];
const posPasta = (_i: number): V3 => TARIFA_POS;
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
    // torre na frente do cofre: vermelha quando gastou a mais (2024, 2026), verde quando sobrou (2025)
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, Math.max(0.35, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, y.falta.sobra ? CA[1] : C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const CA26 = CA[2];
  const fx = FX_VIS(t);
  if (fx > 0.01) {
    const k1 = cresce(T.onze) * fx;
    if (k1 > 0.01) solidas.push(...torre(FX.eve.p, (FX.eve.v / ESC_A) * k1, LADO_A, CA26));
    if (!final) {
      const k2 = cresce(T.juntos + 0.4) * fx;
      [FX.cul, FX.esp, FX.agr, FX.mam].forEach((o, k) => {
        if (k2 > 0.01) solidas.push(...torre(o.p, Math.max(0.3, o.v / ESC_A) * cresce(T.juntos + 0.4 + k * 0.25) * fx, 2, tema.objetoClaro, 0.3));
      });
    }
    const k3 = cresce(T.b197) * fx;
    if (k3 > 0.01) solidas.push(...torre(FX.ben.p, (FX.ben.v / ESC_A) * k3, LADO_A, C.alerta));
  }
  const di = DI_VIS(t);
  if (di > 0.01) {
    const k0 = cresce(T.camara + 0.6) * di;
    if (k0 > 0.01) solidas.push(...torre(DI.c24.p, (DI.c24.v / ESC_A) * k0, LADO_A, CA[0]));
    const k1 = cresce(T.c25) * di;
    if (k1 > 0.01) solidas.push(...torre(DI.c25.p, (DI.c25.v / ESC_A) * k1, LADO_A, CA[1]));
    const k2 = cresce(T.dobro + 0.3) * di;
    if (k2 > 0.01) solidas.push(...torre(DI.ass.p, (DI.ass.v / ESC_A) * k2, LADO_A, tema.objetoClaro));
    const k3 = cresce(T.subsidio + 0.6) * di;
    if (k3 > 0.01) solidas.push(...torre(DI.s25.p, (DI.s25.v / ESC_A) * k3, LADO_A, CA[1]));
    const k4 = cresce(T.s26) * di;
    if (k4 > 0.01) solidas.push(...torre(DI.s26.p, (DI.s26.v / ESC_A) * k4, LADO_A, CA26));
  }
  const bk = vis(t, T.tribunal - 0.1, T.gastar - 0.2);
  if (bk > 0.01) {
    const kr = rampa(t, T.rendeu, T.rendeu + 0.9) * bk;
    if (kr > 0.01) solidas.push(...torre(RENDE.p, (RENDE.v / ESC_A) * kr, LADO_A, CA[1]));
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [[[0.6, 0, 8.5], 0.2]];
const ARVORES: V3[] = [[-1.2, 0, 8.2]];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const aceso = Math.max(0, ...ditas);
  const e = 0.45;
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
    case 'onibus': {
      if (sobe < 0.02) return null;
      const k = Math.min(1, sobe);
      return (
        <group position={[p[0], 0.04, p[2]]} rotation={[0, rot + Math.PI / 2, 0]} scale={[k, k, k]}>
          <Onibus tema={tema} pos={[0, 0, 0]} escala={0.42} farol={aceso} />
        </group>
      );
    }
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={0} />;
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

      <BaseGaveta tema={tema} pos={[-2.25, 0, ZA]} sobe={fx} larg={5.2} texto="EVENTOS x OUTRAS ÁREAS · 2026" aceso={Math.max(janela(t, T.repara, T.camara, 0.4), janela(t, T.porque, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.68, 0, ZA]} sobe={di} larg={5.3} texto="CÂMARA E ÔNIBUS" aceso={janela(t, T.camara, T.tribunal, 0.4)} />

      <BancoDivida tema={tema} pos={TCM_POS} escala={0.55} sobe={vis(t, T.tribunal - 0.1, T.gastar - 0.2)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} rotY={0} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(0.5 - i) * 0.08}
            escala={1.0}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={atual[2] === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, pa.t, T.gastar - 0.1, 0.4)}
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
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.5);
    const alto = e.s === 'edu' || e.s === 'sau' || e.s === 'adm' ? 1.2 : 1;
    const pp = perto * alto;
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
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.mais26 + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // eventos de turismo x o resto e a ajuda às famílias (esquerda para a direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.3, 0.9, ZA], 7.6, 6.8, [0, 1.9, 1])],
      [T.eventos - 0.2, PG(soma(FX.eve.p, [0.6, 0, 0]), 4.4, 1.4, -0.05)],
      [T.juntos - 0.2, PG(meio(FX.eve.p, FX.ben.p), 6.4, 1.2, -0.03)],
      [T.ajuda - 0.2, PG(soma(meio(FX.eve.p, FX.ben.p), [0.3, 0, 0]), 6.2, 1.2, 0)],
      [T.camara - 0.3, PG(soma(meio(FX.eve.p, FX.ben.p), [0.5, 0, 0]), 6.4, 1.2, 0.02)],
    ],
  },
  // Câmara 2024 → 2025 x assistência, depois o subsídio do ônibus (sempre para a direita)
  {
    ini: T.camara - 0.2,
    arco: 0.03,
    chaves: [
      [T.camara - 0.2, E([2.7, 1.0, ZA], 7.4, 6.8, [0, 1.8, 1])],
      [T.c25 - 0.2, PG(meio(DI.c24.p, DI.ass.p), 4.8, 1.8, -0.04)],
      [T.dobro - 0.1, PG(soma(meio(DI.c24.p, DI.ass.p), [-0.15, 0, 0]), 5.4, 1.8, -0.02)],
      [T.subsidio - 0.2, PG(meio(DI.s25.p, DI.s26.p), 4.4, 1.6, 0)],
      [T.s26 + 0.2, PG(soma(meio(DI.s25.p, DI.s26.p), [0.15, 0, 0]), 4.4, 1.6, 0.02)],
      [T.pessoal - 0.1, E([2.7, 1.2, ZA], 7.6, 7.0, [0.05, 1.8, 1])],
      [T.tribunal - 0.3, E([2.8, 1.2, ZA], 7.4, 6.8, [0.08, 1.8, 1])],
    ],
  },
  // tribunal: as duas pastas
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.0], 9.0, 7.0, [0, 1.9, 1])],
      [T.rendeu + 0.2, E(meio(RENDE.p, TARIFA_POS), 5.0, 4.8, [-0.04, 1.5, 1])],
      [T.gastar - 0.2, E(soma(meio(RENDE.p, TARIFA_POS), [0.2, 0, 0]), 5.2, 5.0, [0.03, 1.5, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois eventos x ajuda às famílias
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, E([-2.3, 0.9, ZA], 7.4, 6.6, [0, 1.8, 1])],
      [T.ajuda2 - 0.1, PG(meio(FX.eve.p, FX.ben.p), 5.0, 1.8, -0.03)],
      [T.segue - 0.1, PG(soma(meio(FX.eve.p, FX.ben.p), [0.2, 0, 0]), 5.2, 1.8, -0.01)],
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
const ESTADOS: number[] = [T.gastou24, T.ano25, T.ano26, T.repara, T.camara, T.tribunal, T.gastar];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 809,7 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 45 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 827,2 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 790 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 37,2 MI'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ AGOSTO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ AGOSTO: R$ 575,8 MI'},
    {a: T.gastou26, b: T.mais26, texto: 'GASTOU ATÉ AGOSTO: R$ 576,7 MI'},
    {a: T.mais26, b: Y2.entradas[0].t, texto: 'R$ 903 MIL A MAIS DO QUE ARRECADOU', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.eventos, texto: 'AGORA REPARA · 2026 ATÉ AGOSTO'},
    {a: T.eventos, b: T.juntos, texto: 'PROMOÇÃO DE EVENTOS DE TURISMO: R$ 11 MI'},
    {a: T.juntos, b: T.ajuda, texto: 'CULTURA + ESPORTE + AGRICULTURA + MEIO AMBIENTE: R$ 6,1 MI'},
    {a: T.ajuda, b: T.camara, texto: 'AJUDA A FAMÍLIAS EM EMERGÊNCIA: R$ 1,97 MI', destaque: true},
    {a: T.camara, b: T.c25, texto: 'CÂMARA DE VEREADORES EM 2024: R$ 21,8 MI'},
    {a: T.c25, b: T.dobro, texto: 'CÂMARA EM 2025: R$ 29,5 MI'},
    {a: T.dobro, b: T.subsidio, texto: 'TODA A ASSISTÊNCIA SOCIAL EM 2025: R$ 11,7 MI', destaque: true},
    {a: T.subsidio, b: T.s26, texto: 'SUBSÍDIO AO TRANSPORTE COLETIVO EM 2025: R$ 7,35 MI'},
    {a: T.s26, b: T.pessoal, texto: 'SÓ ATÉ AGOSTO DE 2026: R$ 21,2 MI', destaque: true},
    {a: T.pessoal, b: T.tribunal, texto: 'PESSOAL E ENCARGOS 2025 (COM A CÂMARA): R$ 473,9 MI'},
    {a: T.tribunal, b: T.naoJulg, texto: 'NO BANCO, O DINHEIRO DA PREFEITURA RENDEU R$ 5,96 MI EM 2025'},
    {a: T.naoJulg, b: T.negocia, texto: 'TARIFA BANCÁRIA: SEM LANÇAMENTO COM ESSE NOME NA PREFEITURA'},
    {a: T.negocia, b: T.gastar, texto: 'TARIFA PODE SER NEGOCIADA · JÁ HÁ PREFEITURA COM ISENÇÃO TOTAL'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.ajuda2, texto: 'EVENTOS: R$ 11 MI EM OITO MESES...', destaque: true},
    {a: T.ajuda2, b: T.segue, texto: '...POR QUE A AJUDA ÀS FAMÍLIAS FICOU EM MENOS DE R$ 2 MI?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: Y0.entradas[0].t, texto: 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y0.entradas[0].t, b: T.ano25, texto: 'FONTE: PCMGE015 DEZ/2024 (PREFEITURA, CÂMARA, SUTRAM, FUNDAÇÃO)'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 ENVIADO AO TCM-BA · LIQUIDADO'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: PCMGE015 DEZ/2025 CONSOLIDADO · LIQUIDADO · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: PCMGE016 E PCMGE015 AGO/2026 · TCM-BA'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: AGO/2026 · PREFEITURA, CÂMARA, SUTRAM, FUNDAÇÃO · LIQUIDADO'},
  {a: T.repara, b: T.tribunal, texto: 'FONTE: DESPESA POR AÇÃO 2024 A 2026 · TCM-BA'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: PCMGE016 DEZ/2025 (1.3.2.1.01) E PCMGE015 2024 A 2026'},
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
      const prox = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        const doAno = k === yi;
        // o ano falado fica pelo menos 2,5 s (regra 20); os anos anteriores saem 0,45 s depois da troca de setor
        const b = doAno ? Math.max(prox + 0.45, e.t + 2.5) : prox + 0.45;
        r.push({a: e.t + (doAno ? 0.55 : 0.3 + k * 0.1), b: Math.min(b, y.fim + 0.3), p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    r.push({a: y.falta.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(Math.max(0.35, y.falta.v / ESCALA), LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} ${y.falta.txt}`, sub: y.rotulo, cor: y.falta.sobra ? CA[1] : C.alerta});
  });
  const topo = (c: V3, v: number, lado = LADO_A) => soma(c, [0, altTorre(Math.max(0.3, v / ESC_A), lado) + 0.3, 0]);
  const fimF = T.camara - 0.3;
  r.push(
    {a: T.onze + 0.5, b: fimF, p: topo(FX.eve.p, FX.eve.v), valor: 'R$ 11 MI', sub: 'EVENTOS DE TURISMO · 2026', cor: CA[2]},
    {a: T.juntos + 0.9, b: T.ajuda + 0.4, p: soma(meio(FX.cul.p, FX.mam.p), [0, 1.35, 0]), valor: 'R$ 6,1 MI', sub: 'CULTURA, ESPORTE, AGRICULTURA, M. AMBIENTE'},
    {a: T.b197 + 0.4, b: fimF, p: topo(FX.ben.p, FX.ben.v), valor: 'R$ 1,97 MI', sub: 'AJUDA ÀS FAMÍLIAS · 2026', cor: C.alerta},
  );
  const fimD = T.tribunal - 0.3;
  r.push(
    {a: T.camara + 1.2, b: T.subsidio + 0.2, p: topo(DI.c24.p, DI.c24.v), valor: 'R$ 21,8 MI', sub: 'CÂMARA · 2024', cor: CA[0]},
    {a: T.c25 + 0.5, b: T.subsidio + 0.2, p: topo(DI.c25.p, DI.c25.v), valor: 'R$ 29,5 MI', sub: 'CÂMARA · 2025', cor: CA[1]},
    {a: T.dobro + 0.8, b: T.subsidio + 0.2, p: topo(DI.ass.p, DI.ass.v), valor: 'R$ 11,7 MI', sub: 'ASSISTÊNCIA SOCIAL · 2025', cor: C.alerta},
    {a: T.subsidio + 1.0, b: fimD, p: topo(DI.s25.p, DI.s25.v), valor: 'R$ 7,35 MI', sub: 'SUBSÍDIO ÔNIBUS · 2025', cor: CA[1]},
    {a: T.s26 + 0.5, b: fimD, p: topo(DI.s26.p, DI.s26.v), valor: 'R$ 21,2 MI', sub: 'SUBSÍDIO ÔNIBUS · 2026 ATÉ AGO', cor: CA[2]},
  );
  r.push({a: T.rendeu + 0.6, b: T.gastar - 0.2, p: topo(RENDE.p, RENDE.v), valor: 'R$ 5,96 MI', sub: 'RENDEU NO BANCO · 2025', cor: CA[1]});
  r.push(
    {a: T.ajuda2 + 0.3, b: T.segue + 0.3, p: topo(FX.eve.p, FX.eve.v), valor: 'R$ 11 MI', sub: 'EVENTOS · 2026', cor: CA[2]},
    {a: T.ajuda2 + 0.6, b: T.segue + 0.3, p: topo(FX.ben.p, FX.ben.v), valor: 'R$ 1,97 MI', sub: 'AJUDA ÀS FAMÍLIAS · 2026', cor: tema.acento},
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
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 2 MI' : '1 PILHA = R$ 20 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    const k1 = Math.min(entra(t, 4.6, 0.45), 1 - rampa(t, T.ano24 - 0.5, T.ano24 - 0.1));
    const k2 = Math.min(entra(t, T.ano24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const txt = t < T.ano24 - 0.1 ? 'FONTE: BALANÇOS 2024 E 2025 · PCMGE016 AGO/2026 · TCM-BA' : 'FONTE: BALANÇO 2024 ENVIADO AO TCM-BA';
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: Math.max(k1, k2)}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 16, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/ilheus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número grande ----------
const SOQUINHOS = [T.mais24, T.sobra25, T.mais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 50).map((e) => e.t)), T.onze, T.b197, T.c25, T.dobro, T.s26];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach((t) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('764 milhoes'), quando('827 milhoes'), quando('575 milhoes')].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.2}));
  [T.onze, T.juntos, T.c25, T.subsidio].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.b197, T.dobro, T.s26].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.ajuda2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  1.5, 4.2, 6.0, 8.5, 10.5, T.ano24 + 0.6, T.arrec24 + 1.2, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.gastou26 + 0.9, T.mais26 + 1.0, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.onze + 1.0, T.juntos + 1.6, T.ajuda + 0.8, T.b197 + 1.0,
  T.camara + 1.5, T.c25 + 1.0, T.dobro + 1.2, T.subsidio + 1.4, T.s26 + 1.0, T.pessoal + 1.2, T.p474 + 1.0,
  T.tribunal + 0.8, T.rendeu + 1.2, T.naoJulg + 1.2, T.negocia + 1.2,
  T.gastar + 0.5, T.porque + 1.0, T.ajuda2 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoIlheusTcm: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="ILHÉUS" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Eventos:', 'R$ 11 mi.', 'Ajuda social:', 'R$ 1,97 mi.'];
export const CapaOrcamentoIlheusTcm: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 780}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ILHÉUS · 2026`} t={1} troca={0} y={SEGURO.topo + 160} />
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
