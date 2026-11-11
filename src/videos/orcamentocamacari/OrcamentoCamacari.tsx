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
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS, RoloCompactador, Van} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, PilhaPastas, RuaPlaca, SilhuetaPolo} from './pecas';
import {PALAVRAS} from './palavras';

// 041. orçamento de camaçari (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 (Paratinga v2).
// O Kit Mapas abre (voo até Camaçari e o que o município arrecadou em 2024: projetos/041.../mapas/camacari.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele. ESCALA PEDIDA PELO MAGNO PARA CAMAÇARI:
// 1 MOEDA = R$ 1 MI, 1 PILHA = R$ 10 MI (escrito no placar). Quando a voz fala um setor, as pilhas voam para a casinha dele.
// Casinhas na borda NA ORDEM DA FALA; câmera sempre no mesmo sentido; na virada de ano sobe e recomeça.
// Camaçari arrecadou mais do que gastou nos 3 anos: no lugar da torre vermelha "A MAIS", uma pilha apagada "SOBROU".
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE CAMAÇARI, do TCM-BA: audio/fontes.md. Plano: plano.md (v1, aprovado).

export const FPS = 30;
const AUDIO_SEG = 174.26; // voz Roger, 1ª frase do teste "Camaçarí", pausas 0,28 s, acelerada 1,444x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '041. orçamento de camaçari';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 O municipio'),
  arrec24: quando('arrecadou 2 bilhoes e 407'),
  gastou24: quando('Gastou 2 bilhoes e 402'),
  sobra24: quando('Sobraram quase 5'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 2 bilhoes e 216'),
  gastou25: quando('Gastou 2 bilhoes e 161', 2), // a 1ª vez é a frase de abertura ("Camaçari gastou 2 bilhões e 161")
  sobra25: quando('Sobraram 55'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 1 bilhao'),
  gastou26: quando('Gastou 1 bilhao'),
  sobra26: quando('Sobram quase 10'),
  festasAdm: quando('as festas estao dentro'),
  animal: quando('Protecao animal'),
  nenhum: quando('nenhum real gasto'),
  repara: quando('Agora repara'),
  f24: quando('Em 2024 o orcamento'),
  res24: quando('reservou 5'),
  gas24: quando('gastou 26'),
  res25: quando('reservou 3'),
  gas25: quando('gastou 25'),
  res26: quando('reservou 12'),
  gas26: quando('ja foram 23'),
  propaganda: quando('Na propaganda'),
  pres25: quando('tinha 4 milhoes'),
  pus25: quando('usou 14'),
  pres26: quando('tinha 5'),
  pus26: quando('usou 11'),
  enquanto: quando('Enquanto isso'),
  castra: quando('castracao movel'),
  cortada: quando('cortada para zero'),
  reforma: quando('A reforma de casas'),
  nada: quando('nao gastou nada'),
  meio: quando('E o meio ambiente'),
  polo: quando('polo industrial'),
  tres: quando('nao chegou a 3'),
  rios: quando('limpeza de rios'),
  restauracao: quando('A restauracao'),
  governo: quando('Governo do Estado'),
  tribunal: quando('No Tribunal de Contas'),
  processos: quando('26 processos'),
  semJulg: quando('sem julgamento'),
  ceno: quando('a cenografia'),
  transp: quando('o transporte escolar'),
  cestas: quando('cestas basicas'),
  merenda: quando('a merenda'),
  gastar: quando('Gastar nao'),
  festaSempre: quando('a festa sempre'),
  castraCasas: quando('a castracao e as casas'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 15 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | 'obras' | 'aposent' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO DA PREFEITURA', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'obras'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'apo', nome: 'APOSENTADORIAS DOS SERVIDORES', tipo: 'aposent'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'lix', nome: 'LIXO E LIMPEZA URBANA', tipo: 'rua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
  {id: 'cmh', nome: 'CASA MELHOR', tipo: 'casinha', texto: 'CASA MELHOR'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['ani', 'cmh'];
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

// ---------- Os três anos (R$ milhões, exatos do TCM-BA; audio/fontes.md) ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; rotulo: string; entradas: Entrada[]; sobra: {t: number; v: number}};
const ENT = (k: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras e servicos'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['apo', 'Aposentadorias'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia social'],
    ['lix', 'Lixo e limpeza'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
    ['mam', 'Meio ambiente'],
  ].map(([s, fr], j) => ({s, t: quando(fr, k), v: v[j]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, rotulo: '2024', sobra: {t: T.sobra24, v: 4.992}, entradas: ENT(1, [530.912, 423.199, 293.258, 354.53, 75.628, 161.461, 157.232, 55.251, 86.947, 179.671, 5.34, 9.067, 0.234])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, rotulo: '2025', sobra: {t: T.sobra25, v: 55.553}, entradas: ENT(2, [521.229, 403.586, 266.866, 164.122, 76.102, 267.141, 167.779, 44.163, 68.629, 137.92, 6.224, 2.259, 0.391])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, rotulo: '2026 · ATÉ SET', sobra: {t: T.sobra26, v: 9.584}, entradas: [...ENT(3, [374.34, 339.973, 256.125, 97.775, 59.028, 144.146, 131.505, 9.149, 56.859, 109.787, 5.089, 1.498, 0.047]), {s: 'ani', t: T.animal, v: 0}]},
];
const SOBE: Record<string, number> = {...Object.fromEntries(ANOS[0].entradas.map((e) => [e.s, e.t])), ani: T.animal, cmh: T.reforma};
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
const ESCALA = 10; // PEDIDO DO MAGNO: 1 pilha = R$ 10 milhões (1 moeda = R$ 1 milhão)
const MINIMO = 0.05; // valor abaixo de meia moeda vira meia moedinha, só para marcar (a plaquinha traz o valor exato)
const pilhasDe = (v: number) => (v <= 0 ? 0 : Math.max(MINIMO, v / ESCALA));
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(pilhasDe(v) / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre ----------
// 3 anéis encostados (141 lugares). As pilhas do ano se espalham POR IGUAL pela volta toda (sem ferradura) e, quando há mais
// pilhas que lugares, a segunda fica em cima da primeira no mesmo lugar. Ordem: o MESMO sentido dos setores.
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 40],
      [2.05, 47],
      [2.35, 54],
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
  const totalAno = y.entradas.reduce((a, e) => a + Math.ceil(pilhasDe(e.v) - 0.0005), 0);
  const ocupado: number[] = LUGARES.map(() => 0);
  let lugar = 0;
  y.entradas.forEach((e) => {
    const n = pilhasDe(e.v);
    if (n < 0.003) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      const li = Math.min(LUGARES.length - 1, Math.floor((lugar * LUGARES.length) / Math.max(1, totalAno)));
      const de: V3 = [LUGARES[li][0], ocupado[li] * ANDAR, LUGARES[li][2]];
      ocupado[li]++;
      v.push({de, para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.02, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const SOBRA_POS: V3 = [0, 0, 3.65];

// ---------- As gavetas: reservado (tracejado) x usado (sólido), no miolo da mesa depois que o cofre sai ----------
const ESC_G = 1; // aqui, 1 pilha = R$ 1 milhão
const GAV: Record<string, {p: V3; res: number; usou: number; yi: number; tRes: number; tUsou: number}> = {
  fes24: {p: [-3.1, 0, 1.25], res: 5, usou: 26.642, yi: 0, tRes: T.res24, tUsou: T.gas24},
  fes25: {p: [-1.55, 0, 1.25], res: 3.385, usou: 25.755, yi: 1, tRes: T.res25, tUsou: T.gas25},
  fes26: {p: [0.0, 0, 1.25], res: 12.5, usou: 23.887, yi: 2, tRes: T.res26, tUsou: T.gas26},
  pro25: {p: [1.95, 0, 1.25], res: 4, usou: 14.449, yi: 1, tRes: T.pres25, tUsou: T.pus25},
  pro26: {p: [3.5, 0, 1.25], res: 5, usou: 11.713, yi: 2, tRes: T.pres26, tUsou: T.pus26},
};
const GAVETAS_VIS = (t: number) => vis(t, T.repara + 0.2, T.enquanto - 0.1) + vis(t, T.gastar, T.castraCasas - 0.5);
// cortes: o que estava reservado e não saiu (perto das casinhas cinza do fim da mesa)
const POS_CASTRA: V3 = noAnel(idx('ani'), R_PREDIO - 1.7);
const POS_CMH: V3 = noAnel(idx('cmh'), R_PREDIO - 1.7);
const TCM_POS: V3 = [0, 0, -2.35];
const PASTAS: {titulo: string; t: number}[] = [
  {titulo: 'SÃO JOÃO 2026', t: T.ceno},
  {titulo: 'TRANSPORTE', t: T.transp},
  {titulo: 'CESTAS BÁSICAS', t: T.cestas},
  {titulo: 'MERENDA', t: T.merenda},
];
const posPasta = (i: number): V3 => [-2.0 + i * 1.33, 0, -0.55 + Math.abs(i - 1.5) * 0.2];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);
// Polo ao FUNDO, por fora da mesa, atrás dos setores do fim do giro (lixo, agricultura, esporte, meio ambiente e os cinza)
const ANG_POLO = [ang(10.5), ang(12.5), ang(13.6)];
const ANG_ESTADO = ANGS[ANGS.length - 1] + 0.105 * Math.PI;
const POS_ESTADO: V3 = [Math.sin(ANG_ESTADO) * 7.1, 0, Math.cos(ANG_ESTADO) * 7.1];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  if (some > 0.01) {
    // o que sobrou: pilha apagada na frente do cofre, na cor do ano
    ANOS.forEach((y, yi) => {
      const k = janela(t, y.sobra.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(SOBRA_POS, (y.sobra.v / ESCALA) * rampa(t, y.sobra.t, y.sobra.t + 0.9) * k, LADO, mistura(CA[yi], tema.objeto, 0.55)));
    });
    // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele
    ANOS.forEach((y, yi) => {
      VOOS[yi].forEach((v, j) => {
        const nasce = rampa(t, y.gastou + 0.1 + (j % 47) * 0.012, y.gastou + 0.7 + (j % 47) * 0.012);
        if (nasce <= 0.01) return;
        const k = rampa(t, v.t0, v.t0 + 0.75);
        if (k <= 0) torres.push({p: v.de, n: v.n * nasce, cor: CA[yi]});
        else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n * some, cor: CA[yi]});
      });
    });
  }
  // gavetas das festas e da propaganda (aqui 1 pilha = R$ 1 mi)
  const g = GAVETAS_VIS(t);
  if (g > 0.01) {
    Object.values(GAV).forEach((o) => {
      const r = rampa(t, o.tRes, o.tRes + 0.6) * g;
      const u = rampa(t, o.tUsou, o.tUsou + 1.3) * g;
      if (r > 0.01) fantasmas.push(...torre(o.p, (o.res / ESC_G) * r, LADO, tema.objetoClaro, 0.3));
      if (u > 0.01) solidas.push(...torre(o.p, (o.usou / ESC_G) * u, LADO, CA[o.yi], 0.3));
    });
  }
  // cortes: castração móvel (R$ 2 mi reservados, cortados para zero) e Casa Melhor (R$ 1 mi reservado, R$ 0 gasto)
  const kc = rampa(t, T.castra + 0.3, T.castra + 0.9) * (1 - rampa(t, T.cortada, T.cortada + 0.6));
  if (kc > 0.01) fantasmas.push(...torre(POS_CASTRA, (2 / ESC_G) * kc, 2, tema.objetoClaro, 0.3));
  const km = rampa(t, T.reforma + 0.3, T.reforma + 0.9) * (1 - rampa(t, T.restauracao, T.restauracao + 0.5));
  if (km > 0.01) fantasmas.push(...torre(POS_CMH, (1.01 / ESC_G) * km, 2, tema.objetoClaro, 0.3));
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.repara, T.propaganda, 0.4), janela(t, T.festaSempre, FIM + 1, 0.4));
  if (s.id === 'adm') aceso = Math.max(aceso, janela(t, T.festasAdm, T.festasAdm + 1.6, 0.4), janela(t, T.propaganda, T.enquanto, 0.4));
  if (s.id === 'mam') aceso = Math.max(aceso, janela(t, T.meio, T.restauracao, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, SOBE[s.id], SOBE[s.id] + 6)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - SOBE[s.id]))} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'obras':
      return (
        <group>
          <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto="OBRAS" tipo="galpao" />
          {sobe > 0.05 ? <RoloCompactador tema={tema} pos={soma(p, [tg[0] * -1.2 - Math.sin(ang(i)) * 0.6, 0, tg[2] * -1.2 - Math.cos(ang(i)) * 0.6])} rotY={rot + 0.4} escala={0.28 * Math.min(1, sobe)} giro={0} /> : null}
        </group>
      );
    case 'aposent':
      return (
        <group>
          <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto="APOSENTADORIAS" tipo="colunas" />
          {[-0.45, 0.45].map((d, k) =>
            sobe > 0.3 ? <Boneco key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 1.0, 0.04, tg[2] * d - Math.cos(ang(i)) * 1.0])} rotY={ang(i)} escala={0.28 * Math.min(1, sobe)} cor={mistura(tema.objeto, tema.objetoClaro, 0.3 + 0.2 * k)} /> : null,
          )}
        </group>
      );
    case 'arvores': {
      if (sobe < 0.02) return null;
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
  const iAdm = idx('adm');
  const tgAdm: V3 = [Math.cos(ang(iAdm)), 0, -Math.sin(ang(iAdm))];
  const pPalquinho = soma(noAnel(iAdm, R_PREDIO + 0.2), [tgAdm[0] * -1.35, 0, tgAdm[2] * -1.35]);
  const kPalq = rampa(t, T.festasAdm, T.festasAdm + 0.6) * SOME_DINHEIRO(t);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={2500} />
      <PilhasDinheiro pilhas={torres} max={8000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={900} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* 2026: as festas saíram da Cultura e foram para a Administração (palquinho encostado na prefeitura) */}
      {kPalq > 0.02 ? <PredioTexto tema={tema} pos={pPalquinho} rotY={ang(iAdm) + Math.PI} escala={0.42} sobe={kPalq} aceso={janela(t, T.festasAdm, T.festasAdm + 1.6, 0.4)} texto="FESTAS" tipo="palco" /> : null}

      {/* gavetas: festas (3 anos) e propaganda (2025 e 2026) */}
      <BaseGaveta tema={tema} pos={[-1.55, 0, 1.25]} sobe={g} larg={4.6} texto="FESTAS E EVENTOS" aceso={Math.max(janela(t, T.repara, T.propaganda, 0.4), janela(t, T.festaSempre, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.72, 0, 1.25]} sobe={g} larg={2.9} texto="PROPAGANDA" aceso={janela(t, T.propaganda, T.enquanto, 0.4)} />

      {/* cortes: a van da castração (cinza) e a Casa Melhor */}
      {vis(t, T.castra - 0.1, FIM + 2) > 0.05 ? <Van tema={tema} pos={soma(noAnel(idx('ani') - 0.45, R_PREDIO - 1.0), [0, 0.02, 0])} rotY={ang(idx('ani')) + Math.PI / 2} escala={0.4 * vis(t, T.castra - 0.1, FIM + 2)} /> : null}

      {/* o Polo Industrial ao fundo (silhuetas genéricas) e a obra do Estado nas vias do Polo */}
      {ANG_POLO.map((a, k) => (
        <SilhuetaPolo key={k} tema={tema} pos={[Math.sin(a) * 9.4, 0, Math.cos(a) * 9.4]} rotY={a + Math.PI} escala={0.7} sobe={rampa(t, T.gastou24, T.gastou24 + 0.8)} luz={Math.max(0.15, janela(t, T.polo, T.restauracao + 4, 0.5))} />
      ))}
      <RuaPlaca tema={tema} pos={POS_ESTADO} rotY={ANG_ESTADO + Math.PI} escala={0.95} sobe={vis(t, T.restauracao - 0.2, FIM + 2)} linhas={['19 VIAS DO POLO', 'GOVERNO DO ESTADO', 'MAIS DE R$ 23 MI']} aceso={janela(t, T.governo, T.tribunal, 0.4)} />
      {vis(t, T.restauracao, FIM + 2) > 0.05 ? <CarroRua tema={tema} pos={soma(POS_ESTADO, [Math.cos(ANG_ESTADO) * 0.9, 0.06, -Math.sin(ANG_ESTADO) * 0.9])} rotY={ANG_ESTADO + Math.PI / 2} escala={0.26} farol={0} /> : null}

      {/* o Tribunal, a pilha de 26 pastas e as quatro pastas citadas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      <PilhaPastas tema={tema} pos={[2.35, 0, -1.7]} total={26} n={26 * rampa(t, T.processos, T.processos + 2.2)} sobe={pk} aceso={janela(t, T.processos, T.ceno, 0.4)} />
      {PASTAS.map((pa, i) => {
        const kc = rampa(t, pa.t + 0.35, pa.t + 0.75);
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1.5 - i) * 0.08}
            escala={0.78}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            carimbo={kc}
            textoCarimbo="SEM JULGAMENTO"
            corCarimbo={mistura(C.ouro, tema.texto, 0.35)}
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
const COFRE = (dx = 0) => E([0, 0.5, 1.1], 10.2, 8.0, [dx, 1.25, 1]);
// a torre mais alta de cada setor (para enquadrar inteira, com a plaquinha)
const ALT_SETOR: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, Math.max(...ANOS.map((_, yi) => (valorDe(s.id, yi) > 0 ? altFina(valorDe(s.id, yi)) : 0)))]));
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const s = SETORES[Math.round(Math.min(SETORES.length - 1, Math.max(0, i)))];
  const h = ALT_SETOR[s.id] ?? 0;
  const alto = Math.max(4.8, h + 2.0);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, Math.max(1.0, h * 0.42), Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, Math.max(4.9, alto * 0.9) * perto, alto * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando até 0,55 s antes da próxima
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 10 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
};
const GAV_CAM = (x: number, larg: number, alt: number, dx = 0): Cam => E([x, 1.5, 1.25], larg, alt, [dx, 0.7, 1]);
const TRIO = (perto: number, d = 0): Cam => OLHA_SETOR(idx('ani') + d, perto);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11.5, 8.6, [0, 1.35, 1])], [T.sobra24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.08)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.08)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y2.entradas, T.animal - 0.2, 1.12)]},
  {ini: T.animal - 0.1, arco: 0.04, chaves: [[T.animal - 0.1, OLHA_SETOR(idx('ani'), 1.2)], [T.repara - 0.2, OLHA_SETOR(idx('ani') + 0.2, 1.3)]]},
  // festas: sobe e mergulha no miolo da mesa, onde abrem as gavetas (da esquerda para a direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, DE_CIMA(-0.1)],
      [T.f24 - 0.2, GAV_CAM(-2.4, 5.4, 5.4, -0.05)],
      [T.gas24 + 1.0, GAV_CAM(-2.3, 5.2, 5.4, -0.05)],
      [T.res25 - 0.2, GAV_CAM(-1.7, 5.8, 5.4, -0.02)],
      [T.res26 - 0.2, GAV_CAM(-1.1, 6.6, 5.6, 0)],
      [T.propaganda - 0.3, GAV_CAM(-0.6, 6.8, 5.6, 0.02)],
    ],
  },
  // propaganda: desliza para a direita, para a outra gaveta
  {ini: T.propaganda - 0.1, arco: 0.03, chaves: [[T.propaganda - 0.1, GAV_CAM(2.2, 5.0, 5.0, 0.04)], [T.pres26, GAV_CAM(2.8, 5.0, 4.8, 0.06)], [T.enquanto - 0.3, GAV_CAM(3.0, 5.2, 5.0, 0.08)]]},
  // cortes: um plano só mostra meio ambiente, proteção animal e Casa Melhor, juntos no fim do giro
  {ini: T.enquanto - 0.1, arco: 0.03, chaves: [[T.enquanto - 0.1, TRIO(1.25, -0.3)], [T.castra + 0.2, TRIO(0.9, -0.15)], [T.reforma - 0.1, TRIO(0.9, 0.2)], [T.nada + 0.4, TRIO(0.9, 0.9)], [T.meio - 0.1, TRIO(1.25, 0.1)], [T.polo + 0.6, TRIO(1.35, 0.3)], [T.restauracao - 0.3, TRIO(1.35, 0.6)]]},
  {ini: T.restauracao - 0.2, arco: 0.04, chaves: [[T.restauracao - 0.2, E(soma(POS_ESTADO, [0, 0.9, 0]), 4.0, 3.8, [-Math.sin(ANG_ESTADO) * 0.8, 0.75, -Math.cos(ANG_ESTADO) * 0.8])], [T.tribunal - 0.3, E(soma(POS_ESTADO, [0, 0.9, 0]), 3.7, 3.5, [-Math.sin(ANG_ESTADO) * 0.8, 0.75, -Math.cos(ANG_ESTADO) * 0.8])]]},
  // tribunal: a pilha de pastas, depois as quatro pastas da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0.3, 1.0, -1.4], 8.6, 6.8, [0, 0.9, 1])],
      [T.processos, E([1.4, 1.2, -1.4], 6.0, 5.6, [0.08, 0.7, 1])],
      [T.ceno - 0.1, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.4, 4.2, [-0.1, 0.55, 1])],
      [T.transp, E(soma(posPasta(1), [0, 0.9, 0]), 4.4, 4.2, [-0.05, 0.55, 1])],
      [T.cestas, E(soma(posPasta(2), [0, 0.9, 0]), 4.4, 4.2, [0.02, 0.55, 1])],
      [T.merenda, E(soma(posPasta(3), [-0.2, 0.9, 0]), 4.6, 4.4, [0.06, 0.6, 1])],
      [T.gastar - 0.2, E([0.6, 1.0, -0.9], 7.4, 6.2, [0.1, 0.8, 1])],
    ],
  },
  // a pergunta: mesa inteira, as gavetas das festas, depois as casinhas cinza
  {
    ini: T.gastar - 0.1,
    arco: 0.05,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.festaSempre - 0.3, GAV_CAM(-1.55, 6.8, 5.6, 0)],
      [T.castraCasas - 0.6, GAV_CAM(-1.4, 6.8, 5.6, 0.02)],
      [T.castraCasas + 0.2, TRIO(1.1, 0.5)],
      [T.segue, TRIO(1.3, 0.6)],
      [FIM, E([0, 0, 0.4], 13.5, 9.6, [-Math.sin(ang(13.6)) * 0.9, 1.4, -Math.cos(ang(13.6)) * 0.9])],
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
  [0, 'CAMAÇARI · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA'],
  [T.propaganda, 'A PROPAGANDA'],
  [T.enquanto, 'ENQUANTO ISSO'],
  [T.restauracao, 'OBRA DO ESTADO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra24, texto: 'GASTOU EM 2024: R$ 2,40 BILHÕES'},
    {a: T.sobra24, b: Y0.entradas[0].t, texto: 'SOBRARAM QUASE R$ 5 MI'},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 2,22 BILHÕES'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 2,16 BILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 55,6 MI'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 1,64 BILHÃO'},
    {a: T.gastou26, b: T.sobra26, texto: 'GASTOU ATÉ SETEMBRO: R$ 1,63 BILHÃO'},
    {a: T.sobra26, b: Y2.entradas[0].t, texto: 'SOBRAM R$ 9,6 MI'},
  ];
  ANOS.forEach((y) => {
    const ents = y.entradas.filter((e) => !ZERADOS.includes(e.s));
    ents.forEach((e, k) => {
      let prox = k + 1 < ents.length ? ents[k + 1].t : y.fim;
      if (y === Y2 && k + 1 === ents.length) prox = T.animal;
      if (y === Y2 && e.s === 'adm') prox = T.festasAdm;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.festasAdm, b: Y2.entradas[3].t, texto: 'EM 2026, AS FESTAS FORAM PARA A ADMINISTRAÇÃO', destaque: true},
    {a: T.animal, b: T.nenhum, texto: 'PROTEÇÃO ANIMAL'},
    {a: T.nenhum, b: T.repara, texto: 'PROTEÇÃO ANIMAL: R$ 0 EM 2024, 2025 E 2026*', destaque: true},
    {a: T.repara, b: T.res24, texto: 'FESTAS E EVENTOS: RESERVADO X GASTO'},
    {a: T.res24, b: T.gas24, texto: 'FESTAS 2024: O ORÇAMENTO RESERVOU R$ 5 MI'},
    {a: T.gas24, b: T.res25, texto: 'GASTOU R$ 26,6 MI', destaque: true},
    {a: T.res25, b: T.gas25, texto: 'FESTAS 2025: RESERVOU R$ 3,4 MI'},
    {a: T.gas25, b: T.res26, texto: 'GASTOU R$ 25,8 MI', destaque: true},
    {a: T.res26, b: T.gas26, texto: 'FESTAS 2026: RESERVOU R$ 12,5 MI'},
    {a: T.gas26, b: T.propaganda, texto: 'ATÉ SETEMBRO, JÁ FORAM R$ 23,9 MI', destaque: true},
    {a: T.propaganda, b: T.pres25, texto: 'PROPAGANDA DA PREFEITURA'},
    {a: T.pres25, b: T.pus25, texto: 'PROPAGANDA 2025: RESERVOU R$ 4 MI'},
    {a: T.pus25, b: T.pres26, texto: 'USOU R$ 14,4 MI', destaque: true},
    {a: T.pres26, b: T.pus26, texto: 'PROPAGANDA 2026: RESERVOU R$ 5 MI'},
    {a: T.pus26, b: T.enquanto, texto: 'ATÉ SETEMBRO, JÁ USOU R$ 11,7 MI', destaque: true},
    {a: T.enquanto, b: T.castra, texto: 'ENQUANTO ISSO...'},
    {a: T.castra, b: T.cortada, texto: 'CASTRAÇÃO MÓVEL 2026: R$ 2 MI RESERVADOS'},
    {a: T.cortada, b: T.reforma, texto: 'CORTADA PARA ZERO', destaque: true},
    {a: T.reforma, b: T.nada, texto: 'CASA MELHOR 2025: R$ 1 MI PARA REFORMAR CASAS'},
    {a: T.nada, b: T.meio, texto: 'GASTOU R$ 0', destaque: true},
    {a: T.meio, b: T.tres, texto: 'MEIO AMBIENTE, NUMA CIDADE COM POLO INDUSTRIAL'},
    {a: T.tres, b: T.rios, texto: 'MENOS DE R$ 3 MI POR ANO', destaque: true},
    {a: T.rios, b: T.restauracao, texto: 'COM LIMPEZA DE RIOS E ÁREAS VERDES: R$ 2,8 · 2,6 · 1,4 MI'},
    {a: T.restauracao, b: T.governo, texto: '19 VIAS DO POLO INDUSTRIAL: MAIS DE R$ 23 MI'},
    {a: T.governo, b: T.tribunal, texto: 'OBRA DO GOVERNO DO ESTADO, NÃO DA PREFEITURA'},
    {a: T.tribunal, b: T.processos, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.processos, b: T.semJulg, texto: '26 PROCESSOS DE 2025 E 2026'},
    {a: T.semJulg, b: T.ceno, texto: 'AINDA SEM JULGAMENTO', destaque: true},
    {a: T.ceno, b: T.transp, texto: 'CENOGRAFIA DO SÃO JOÃO 2026'},
    {a: T.transp, b: T.cestas, texto: 'TRANSPORTE ESCOLAR E UNIVERSITÁRIO'},
    {a: T.cestas, b: T.merenda, texto: 'CESTAS BÁSICAS'},
    {a: T.merenda, b: T.gastar, texto: 'MERENDA'},
    {a: T.gastar, b: T.festaSempre, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festaSempre, b: T.castraCasas, texto: 'POR QUE A FESTA SEMPRE PASSA DO PREVISTO...', destaque: true},
    {a: T.castraCasas, b: T.segue, texto: '...E A CASTRAÇÃO E AS CASAS FICAM NO ZERO?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA, ISSM, LIMPEC E STT'},
  {a: T.repara, b: T.enquanto, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026'},
  {a: T.enquanto, b: T.restauracao, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2025 E SET/2026 · TCM-BA'},
  {a: T.restauracao, b: T.tribunal, texto: 'FONTE: CASA CIVIL DA BAHIA, 25/04/2024'},
  {a: T.tribunal, b: T.gastar, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · 07/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      const fimRot = Math.min(e.t + 3.2, (y.entradas[ei + 1]?.t ?? y.fim) + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        const sub = e.s === 'cul' && k === 2 ? '2026 · SEM AS FESTAS' : ANO_SUB[k];
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: fimRot, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub, cor: CA[k]});
      }
    });
    r.push({a: y.sobra.t + 0.4, b: y.entradas[0].t + 0.4, p: soma(SOBRA_POS, [0, altTorre(y.sobra.v / ESCALA, LADO) + 0.3, 0]), valor: `${yi === 2 ? 'SOBRAM' : 'SOBROU'} ${fmtV(y.sobra.v)}`, sub: ANO_SUB[yi], cor: CA[yi]});
  });
  // gavetas das festas e da propaganda
  const topo = (o: {p: V3; res: number; usou: number}, v: number) => soma(o.p, [0, altTorre(Math.max(v, o.res) / ESC_G, LADO) + 0.3, 0]);
  Object.values(GAV).forEach((o) => {
    r.push({a: o.tRes + 0.4, b: o.tUsou + 0.2, p: topo(o, 0), valor: `RESERVADO ${fmtV(o.res)}`, sub: ANO_SUB[o.yi]});
    r.push({a: o.tUsou + 1.0, b: o.p[0] > 0 ? T.enquanto - 0.1 : T.propaganda - 0.1, p: topo(o, o.usou), valor: fmtV(o.usou), sub: `${ANO_SUB[o.yi]} · ${o.p[0] > 0 ? 'PROPAGANDA' : 'FESTAS'}`, cor: CA[o.yi]});
  });
  // cortes e meio ambiente
  r.push(
    {a: T.castra + 0.6, b: T.cortada + 0.2, p: soma(POS_CASTRA, [0, 1.4, 0]), valor: 'RESERVADO R$ 2 MI', sub: '2026 · CASTRAÇÃO MÓVEL'},
    {a: T.cortada + 0.5, b: T.reforma + 0.4, p: soma(POS_CASTRA, [0, 0.9, 0]), valor: 'CORTADA: R$ 0', sub: '2026 · CASTRAÇÃO MÓVEL', cor: tema.objetoClaro},
    {a: T.reforma + 0.6, b: T.nada + 0.2, p: soma(POS_CMH, [0, 1.1, 0]), valor: 'RESERVADO R$ 1 MI', sub: '2025 · CASA MELHOR'},
    {a: T.nada + 0.3, b: T.meio + 0.2, p: soma(POS_CMH, [0, 0.9, 0]), valor: 'GASTOU R$ 0', sub: '2025 · CASA MELHOR', cor: tema.objetoClaro},
    {a: T.tres + 0.3, b: T.restauracao - 0.1, p: soma(noAnel(idx('mam'), R_PREDIO - 0.4), [0, 2.0, 0]), valor: 'MENOS DE R$ 3 MI/ANO', sub: 'MEIO AMBIENTE'},
    {a: T.festasAdm + 0.4, b: T.festasAdm + 1.9, p: soma(noAnel(idx('adm'), R_PREDIO + 0.2), [Math.cos(ang(idx('adm'))) * -1.35, 1.2, -Math.sin(ang(idx('adm'))) * -1.35]), valor: 'FESTAS', sub: '2026 · AGORA AQUI', cor: tema.acento},
    {a: T.castraCasas + 0.3, b: FIM + 1, p: soma(noAnel(idx('ani'), R_PREDIO), [0, 1.6, 0]), valor: '?', cor: tema.acento},
    {a: T.castraCasas + 0.5, b: FIM + 1, p: soma(noAnel(idx('cmh'), R_PREDIO), [0, 1.6, 0]), valor: '?', cor: tema.acento},
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
  const gavK = vis(t, T.res24, T.enquanto - 0.2);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || gavK > 0.01 ? (
        <div style={{opacity: Math.min(1, Math.max(placarK, gavK)), display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${gavK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.3, color: tema.texto, lineHeight: 1.35}}>
            {gavK > 0.01 ? (
              'AQUI, 1 PILHA = R$ 1 MI · BRANCO = RESERVADO'
            ) : (
              <>
                1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI
                <br />
                DOURADO 2024 · VERDE 2025 · ROSA 2026
              </>
            )}
          </div>
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
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(SEGURO.botoesX - 90, pj.x)), y: Math.max(760, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // cada plaquinha procura a altura livre mais perto (acima ou abaixo), sem subir no chip do topo
  const postos: {x: number; y: number}[] = [];
  rots.forEach((r) => {
    const livre = (y: number) => postos.every((o) => Math.abs(o.x - r.x) >= 170 || Math.abs(o.y - y) >= 62);
    const tentativas = [0, -64, 64, -128, 128, -192, 192, 256].map((d) => r.y + d).filter((y) => y >= 740 && y <= 1320);
    r.y = tentativas.find(livre) ?? r.y;
    postos.push({x: r.x, y: r.y});
  });
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/camacari.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra24, T.sobra25, T.sobra26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 30).map((e) => e.t)), T.gas24, T.gas25, T.gas26, T.pus25, T.pus26, T.cortada, T.nada, T.semJulg];
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
  ANOS.forEach((y) => s.push({t: y.sobra.t + 0.1, f: 'pop', v: 0.16}));
  s.push({t: T.festasAdm, f: 'pop', v: 0.16});
  s.push({t: T.nenhum + 0.2, f: 'baque', v: 0.2});
  [T.gas24, T.gas25, T.gas26, T.pus25, T.pus26].forEach((t) => s.push({t, f: 'subida', v: 0.17}));
  [T.res24, T.res25, T.res26, T.pres25, T.pres26].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.13}));
  s.push({t: T.cortada + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.nada + 0.1, f: 'baque', v: 0.18});
  s.push({t: T.tres, f: 'pop', v: 0.16});
  s.push({t: T.governo, f: 'pop', v: 0.16});
  s.push({t: T.processos + 0.2, f: 'subida', v: 0.15});
  s.push({t: T.semJulg + 0.2, f: 'impacto', v: 0.18});
  [T.ceno, T.transp, T.cestas, T.merenda].forEach((t) => s.push({t: t + 0.4, f: 'tique', v: 0.14}));
  s.push({t: T.festaSempre, f: 'pop', v: 0.18});
  s.push({t: T.castraCasas, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6.5, 9.5, 11.5, T.gastou24 + 0.9, T.sobra24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 1.0, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[5].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[12].t + 0.8,
  T.ano26 + 1.0, T.sobra26 + 1.0, Y2.entradas[0].t + 0.9, T.festasAdm + 1.0, Y2.entradas[7].t + 0.9, Y2.entradas[12].t + 0.8, T.nenhum + 0.8,
  T.repara + 0.6, T.gas24 + 1.3, T.gas25 + 1.3, T.gas26 + 1.3, T.pus25 + 1.3, T.pus26 + 1.0, T.castra + 1.0, T.cortada + 0.8, T.nada + 0.4, T.tres + 0.6, T.rios + 0.8,
  T.governo + 0.5, T.processos + 1.8, T.semJulg + 0.6, T.cestas + 0.5, T.merenda + 0.3, T.gastar + 0.5, T.festaSempre + 0.6, T.castraCasas + 0.8, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCamacari: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Camaçari" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['A festa', 'passa do', 'previsto.', 'Todo ano.'];
export const CapaOrcamentoCamacari: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · CAMAÇARI`} t={1} troca={0} y={SEGURO.topo + 160} />
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
