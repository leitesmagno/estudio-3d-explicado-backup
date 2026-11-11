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
import {ArvoreRedonda, CasaMini, CofreFGTS} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 059. orçamento de Jequié (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 057 Itabela. O Kit Mapas abre (voo até Jequié e o que a prefeitura arrecadou
// em 2024: projetos/059.../mapas/jequie.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele. Cidade grande (orçamento de R$ 690 a 820 mi): 1 MOEDA = R$ 1 MI e 1 PILHA = R$ 10 MI, como
// em Camaçari (041). Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a
// câmera andando sempre no mesmo sentido. Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE JEQUIÉ,
// todos do TCM-BA (e a notícia da A Tarde sobre a Lagoa do Derba): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 173.07; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,141, -15 LUFS (v liquidado, regra 32)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '059. orçamento de jequié';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 764'),
  gastou24: quando('Gastou 793'),
  falta24: quando('Faltaram 28'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 830'),
  gastou25: quando('Gastou 818'), // o gancho diz "Jequié gastou 819 milhões em 2025" (liquidado 818,9)
  sobra25: quando('Sobraram 11'),
  ano26: quando('2026 ate setembro Somando'),
  arrec26: quando('arrecadou 639'),
  gastou26: quando('Gastou 691'),
  amais26: quando('Sao 51'),
  empenhou: quando('ja empenhou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara na conta'),
  f24: quando('Em 2024 previsto'),
  fg24: quando('Gasto 10'),
  f25: quando('Em 2025 previsto'),
  fg25: quando('Gasto 13'),
  meio: quando('E o meio ambiente'),
  secretaria: quando('A secretaria e junto'),
  rios: quando('A acao de preservar'),
  r295: quando('tinha 295'),
  rg: quando('Gasto 371'),
  dez: quando('Em dezembro de 2025'),
  justica: quando('a Justica condenou'),
  lagoa: quando('na Lagoa do Derba'),
  tribunal: quando('No Tribunal de Contas'),
  saojoao: quando('o pregao do Sao Joao'),
  improc: quando('julgada improcedente'),
  audit: quando('A auditoria da folha'),
  adv: quando('com advertencia'),
  gastar: quando('Gastar nao'),
  festas2: quando('Mas se as festas'),
  meio2: quando('e o meio ambiente 931'),
  prioridade: quando('qual e a prioridade'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'apo', nome: 'APOSENTADORIAS DOS SERVIDORES', tipo: 'casinha', texto: 'APOSENTADORIAS'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'}, // menos de R$ 1 mil por ano: árvores sem pilha nenhuma
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = [];
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
type Entrada = {s: string; t: number; v: number; rot?: string};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean; rot?: string}};
// cada setor é achado pela frase EXATA do ano (nome + número), porque "meio ambiente" e "Câmara" também aparecem fora da lista
const lista = (frases: string[], v: number[], rots: Record<string, string> = {}): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'apo', 'cam', 'div', 'cul', 'ass', 'agr', 'esp', 'mam'].map((s, k) => ({s, t: quando(frases[k]), v: v[k], rot: rots[s]}));
const ANOS: Ano[] = [
  // 2024 (regra 32: gastou = LIQUIDADO): arrecadou 764,7 e liquidou 793,2: torre vermelha do que faltou (28,5, conta própria)
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 793.2, rotulo: '2024', falta: {t: T.falta24, v: 28.463, txt: 'A MAIS', rot: 'R$ 28,5 MI A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 214', 'Saude 177', 'Administracao 45 e 100', 'Obras e servicos urbanos com', 'Aposentadorias dos servidores', 'Camara de Vereadores', 'Dividas 39', 'Cultura e festas 14', 'Assistencia social 23 e 400', 'Agricultura 1 milhao e 400', 'Esporte 5', 'Meio ambiente 355'],
      [214.921, 177.82, 45.111, 145.428, 89.049, 22.524, 39.61, 14.211, 23.369, 1.367, 5.203, 0.000355], {mam: 'R$ 355'})},
  // 2025 (liquidado): arrecadou 830,1 e liquidou 818,9: torre branca do que sobrou (11,2, conta própria)
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 818.9, rotulo: '2025', falta: {t: T.sobra25, v: 11.153, txt: 'SOBRARAM', sobra: true, rot: 'R$ 11,2 MI SOBRARAM'},
    entradas: lista(['Educacao 230', 'Saude 186', 'Administracao 45 milhoes', 'Obras e servicos urbanos 126', 'Aposentadorias 94', 'Camara 25', 'Dividas 50', 'Cultura e festas 17', 'Assistencia social 23 e 300', 'Agricultura 1 milhao e 800', 'Esporte 3', 'Meio ambiente 931'],
      [230.633, 186.188, 45.028, 126.008, 94.55, 25.133, 50.721, 17.055, 23.291, 1.787, 3.598, 0.000931], {mam: 'R$ 931'})},
  // 2026 (Prefeitura + Câmara + IPREJ + SUMTRANS + ARJES): liquidado 691,0 > arrecadado 639,3: torre vermelha de 51,75
  // (conta própria: soma de cinco documentos); o empenhado (860,4) vai só no chip
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 691.0, rotulo: '2026 · ATÉ SET', falta: {t: T.amais26, v: 51.75, txt: 'A MAIS', rot: 'R$ 51,75 MI A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 203', 'Saude 153', 'Administracao 42', 'Obras e servicos urbanos 108', 'Aposentadorias 77', 'Camara 19', 'Dividas 41', 'Cultura e festas 12', 'Assistencia social 18', 'Agricultura 1 milhao e 200', 'Esporte 2', 'Meio ambiente 305'],
      [203.368, 153.216, 42.081, 108.04, 76.991, 19.906, 41.395, 12.352, 18.934, 1.2, 2.779, 0.000305], {mam: 'R$ 305'})},
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
const ESCALA = 10; // 1 moeda = R$ 1 milhão; 1 pilha = R$ 10 milhões (cidade grande, como Camaçari)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; 2025 usa cerca de 87 pilhas) ----------
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
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.max(0.12, Math.min(1, n - j)), t0: e.t + 0.1 + j * 0.03, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.6);
const FALTA_POS: V3 = [0, 0, 4.1];

// ---------- Os achados no miolo (torres de 3 x 3) ----------
const LADO_A = 3;
const ZA = 0.2;
const ESC_A = 1; // festas: 1 pilha = R$ 1 mi
const ESC_R = 0.1; // rios e lagoas: 1 pilha = R$ 100 mil (o placar troca a escala na cena)
// esquerda: a conta de festas populares: previsto (fantasma) x gasto, 2024 e 2025
const FE = {
  p24: {p: [-3.9, 0, ZA] as V3, v: 8.695},
  g24: {p: [-2.7, 0, ZA] as V3, v: 10.675},
  p25: {p: [-1.4, 0, ZA] as V3, v: 11.87},
  g25: {p: [-0.2, 0, ZA] as V3, v: 13.819},
};
// direita: a ação de preservar rios, córregos e lagoas em 2025 (previsto em fantasma; gasto R$ 371, uma moedinha) e a
// pasta da Justiça sobre a Lagoa do Derba (notícia da A Tarde)
const RI = {
  prev: {p: [2.0, 0, ZA] as V3, v: 0.295},
  gasto: {p: [3.2, 0, ZA] as V3, v: 0.000371},
};
const LAGOA_POS: V3 = [3.0, 0, ZA + 1.9];
const FE_VIS = (t: number) => vis(t, T.repara + 0.1, T.meio - 0.2) + vis(t, T.festas2 - 0.45, T.meio2 - 0.1) + vis(t, T.segue + 0.3, FIM + 2);
const RI_VIS = (t: number) => vis(t, T.meio - 0.1, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'PREGÃO DO SÃO JOÃO', valor: '2025', t: T.saojoao, carimbos: [[T.improc + 0.1, 'IMPROCEDENTE', 'neutro']]},
  {titulo: 'FOLHA DE PAGAMENTO', valor: 'INÍCIO DE 2024', t: T.audit, carimbos: [[T.adv + 0.1, 'ADVERTÊNCIA', 'alerta']]},
];
const posPasta = (i: number): V3 => [-1.1 + i * 2.2, 0, 1.3];
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
    // torre na frente do cofre: vermelha do que faltou (2024), branca do que sobrou (2025) e do que falta empenhar (2026)
    ANOS.forEach((y) => {
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.gastar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const fx = FE_VIS(t);
  if (fx > 0.01) {
    ([['p24', T.f24 + 0.5], ['p25', T.f25 + 0.5]] as const).forEach(([k, a]) => {
      const kk = cresce(a) * fx;
      if (kk > 0.01) fantasmas.push(...torre(FE[k].p, (FE[k].v / ESC_A) * kk, LADO_A, tema.objetoClaro));
    });
    ([['g24', T.fg24, 0], ['g25', T.fg25, 1]] as const).forEach(([k, a, yi]) => {
      const kk = cresce(a) * fx;
      if (kk > 0.01) solidas.push(...torre(FE[k].p, (FE[k].v / ESC_A) * kk, LADO_A, CA[yi]));
    });
  }
  const rx = RI_VIS(t);
  if (rx > 0.01) {
    const kp = rampa(t, T.r295, T.r295 + 0.9) * rx;
    if (kp > 0.01) fantasmas.push(...torre(RI.prev.p, (RI.prev.v / ESC_R) * kp, LADO_A, tema.objetoClaro));
    // R$ 371: uma moedinha só (o mínimo que a peça desenha), na cor de 2025
    const kg = rampa(t, T.rg, T.rg + 0.5) * rx;
    if (kg > 0.01) solidas.push({p: RI.gasto.p, n: 0.1 * kg, cor: CA[1]});
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
    case 'agua':
      return <EstacaoSaneamento {...props} />;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={zerado ? 0 : aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const fx = FE_VIS(t);
  const rx = RI_VIS(t);
  const pk = PASTAS_VIS(t);
  const lagoaK = rx * rampa(t, T.dez - 0.1, T.dez + 0.5);
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

      {/* a conta de festas populares (esquerda) e a preservação de rios e lagoas 2025 (direita) */}
      <BaseGaveta tema={tema} pos={[-2.05, 0, ZA]} sobe={fx} larg={5.2} texto="FESTAS POPULARES" aceso={Math.max(janela(t, T.repara, T.meio, 0.4), janela(t, T.festas2, T.meio2, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.6, 0, ZA]} sobe={rx} larg={2.9} texto="RIOS E LAGOAS 2025" aceso={janela(t, T.rios, T.dez, 0.4)} />
      {lagoaK > 0.02 ? (
        <PastaProcesso tema={tema} pos={LAGOA_POS} rotY={-0.12} escala={1.0} sobe={lagoaK} titulo="LAGOA DO DERBA" valor="DEZ/2025" carimbo={rampa(t, T.justica + 0.2, T.justica + 0.6)} textoCarimbo="CONDENADA · 1ª INSTÂNCIA" corCarimbo={C.alerta} aceso={janela(t, T.dez, T.tribunal, 0.4)} />
      ) : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.saojoao - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
            escala={1.3}
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
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre branca do que sobrou; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.falta24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do que faltou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre-fantasma do empenhado além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 1.0, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // festas: da esquerda para a direita, previsto x gasto em cada ano
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.0, 1.0, ZA], 7.6, 6.4, [0, 3.0, 1])],
      [T.f24 - 0.2, PG(soma(FE.p24.p, [0.6, 0, 0]), 4.4, 1.6, -0.05)],
      [T.fg24 + 0.3, PG(soma(FE.g24.p, [0, 0, 0]), 4.4, 1.8, -0.03)],
      [T.f25 - 0.2, PG(soma(FE.g24.p, [0.6, 0, 0]), 4.6, 2.0, -0.01)],
      [T.f25 + 0.5, PG(soma(FE.p25.p, [0.3, 0, 0]), 4.8, 2.2, 0)],
      [T.fg25 + 0.3, PG(FE.g25.p, 5.0, 2.4, 0.01)],
      [T.meio - 0.3, E([-2.0, 1.4, ZA], 7.4, 6.4, [0.02, 3.0, 1])],
    ],
  },
  // meio ambiente: a casinha das árvores na borda, depois a gaveta dos rios e a pasta da Lagoa do Derba (para a direita)
  {
    ini: T.meio - 0.2,
    arco: 0.03,
    chaves: [
      [T.meio - 0.2, OLHA_SETOR(idx('mam'), 1.1)],
      [T.rios - 0.3, OLHA_SETOR(idx('mam'), 1.05)],
      [T.rios + 0.2, E([2.6, 0.6, ZA], 4.6, 4.4, [0, 3.0, 1])],
      [T.r295 + 0.3, PG(RI.prev.p, 3.6, 1.0, -0.02)],
      [T.rg + 0.1, PG(RI.gasto.p, 3.0, 0.5, 0)],
      [T.dez + 0.2, E(soma(LAGOA_POS, [0, 0.9, 0]), 3.4, 3.3, [-0.02, 1.2, 1])],
      [T.tribunal - 0.3, E(soma(LAGOA_POS, [0.1, 0.9, 0]), 3.6, 3.5, [0.04, 1.2, 1])],
    ],
  },
  // tribunal: as duas pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.saojoao - 0.1, E(soma(posPasta(0), [0, 0.9, 0]), 3.6, 3.4, [-0.06, 1.2, 1])],
      [T.audit - 0.2, E(soma(posPasta(0), [0.4, 0.9, 0]), 3.8, 3.5, [-0.03, 1.2, 1])],
      [T.audit + 0.5, E(soma(posPasta(1), [0, 0.9, 0]), 3.6, 3.4, [0.02, 1.2, 1])],
      [T.gastar - 0.2, E(soma(posPasta(1), [0.2, 0.9, 0]), 3.8, 3.5, [0.06, 1.2, 1])],
    ],
  },
  // a pergunta: mesa inteira, a torre das festas de 2025 e depois a casinha do meio ambiente (a gaveta afunda)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.festas2 + 0.2, PG(FE.g25.p, 5.0, 2.4, -0.02)],
      [T.meio2 - 0.15, PG(soma(FE.g25.p, [0.3, 0, 0]), 5.2, 2.3, 0)],
      [T.meio2 + 0.5, OLHA_SETOR(idx('mam'), 1.1)],
      [T.segue - 0.1, OLHA_SETOR(idx('mam'), 1.05)],
      [T.segue + 0.9, E([0, 1.0, ZA], 10.0, 7.6, [-0.1, 1.4, 1])],
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
  [0, 'JEQUIÉ'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: FESTAS'],
  [T.meio, 'E O MEIO AMBIENTE?'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falta24, texto: 'GASTOU EM 2024: R$ 793,2 MILHÕES'},
    {a: T.falta24, b: Y0.entradas[0].t, texto: 'FALTARAM R$ 28,5 MI EM 2024', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 830,1 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 818,9 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 11,2 MI EM 2025'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SET.: R$ 639,3 MI (5 CONTAS SOMADAS)'},
    {a: T.gastou26, b: T.amais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 691 MI'},
    {a: T.amais26, b: T.empenhou, texto: 'R$ 51,75 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.empenhou, b: T.folha, texto: 'JÁ EMPENHOU (RESERVOU PARA PAGAR): R$ 860,4 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'UMA PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.f24, texto: 'A CONTA DE FESTAS POPULARES'},
    {a: T.f24, b: T.fg24, texto: '2024 · PREVISTO: R$ 8,7 MI'},
    {a: T.fg24, b: T.f25, texto: '2024 · GASTO: R$ 10,7 MI', destaque: true},
    {a: T.f25, b: T.fg25, texto: '2025 · PREVISTO: R$ 11,9 MI'},
    {a: T.fg25, b: T.meio, texto: '2025 · GASTO: R$ 13,8 MI', destaque: true},
    {a: T.meio, b: T.secretaria, texto: 'E O MEIO AMBIENTE?'},
    {a: T.secretaria, b: T.rios, texto: 'SECRETARIA DE AGRICULTURA, IRRIGAÇÃO E MEIO AMBIENTE'},
    {a: T.rios, b: T.r295, texto: 'PRESERVAR RIOS, CÓRREGOS E LAGOAS'},
    {a: T.r295, b: T.rg, texto: '2025 · PREVISTO: R$ 295 MIL'},
    {a: T.rg, b: T.dez, texto: '2025 · GASTO: R$ 371', destaque: true},
    {a: T.dez, b: T.justica, texto: 'SEGUNDO O JORNAL A TARDE (20/01/2026)'},
    {a: T.justica, b: T.tribunal, texto: 'CONDENADA EM 1ª INSTÂNCIA: R$ 100 MIL', destaque: true},
    {a: T.tribunal, b: T.saojoao, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.saojoao, b: T.audit, texto: 'PREGÃO DO SÃO JOÃO 2025: IMPROCEDENTE'},
    {a: T.audit, b: T.adv, texto: 'AUDITORIA DA FOLHA (INÍCIO DE 2024)'},
    {a: T.adv, b: T.gastar, texto: 'ADVERTÊNCIA AO GESTOR', destaque: true},
    {a: T.gastar, b: T.festas2, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festas2, b: T.meio2, texto: 'FESTAS EM 2025: R$ 13,8 MI', destaque: true},
    {a: T.meio2, b: T.prioridade, texto: 'MEIO AMBIENTE EM 2025: R$ 931', destaque: true},
    {a: T.prioridade, b: T.segue, texto: 'QUAL É A PRIORIDADE?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO, ANEXO 9 E PCMGE015 DEZ/2024 · LIQUIDADO'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO, ANEXO 9 E PCMGE015 DEZ/2025 · LIQUIDADO'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA, IPREJ, SUMTRANS, ARJES'},
  {a: T.repara, b: T.dez, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2024 E DEZ/2025 · TCM-BA'},
  {a: T.dez, b: T.tribunal, texto: 'FONTE: A TARDE, 20/01/2026 (SENTENÇA DE 17/12/2025)'},
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
    r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(f.v / ESCALA, LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number) => soma(c, [0, altTorre(Math.max(0.35, v / esc), LADO_A) + 0.3, 0]);
  const fimF = T.meio - 0.2;
  // festas populares: previsto x gasto
  r.push(
    {a: T.f24 + 0.7, b: fimF, p: topo(FE.p24.p, FE.p24.v, ESC_A), valor: 'R$ 8,7 MI', sub: 'PREVISTO · 2024'},
    {a: T.fg24 + 0.6, b: fimF, p: topo(FE.g24.p, FE.g24.v, ESC_A), valor: 'R$ 10,7 MI', sub: 'GASTO · 2024', cor: CA[0]},
    {a: T.f25 + 0.7, b: fimF, p: topo(FE.p25.p, FE.p25.v, ESC_A), valor: 'R$ 11,9 MI', sub: 'PREVISTO · 2025'},
    {a: T.fg25 + 0.6, b: fimF, p: topo(FE.g25.p, FE.g25.v, ESC_A), valor: 'R$ 13,8 MI', sub: 'GASTO · 2025', cor: CA[1]},
  );
  // meio ambiente: a casinha das árvores, os rios e lagoas e a Lagoa do Derba
  const fimR = T.dez + 0.2;
  r.push(
    {a: T.meio + 0.4, b: T.rios + 0.2, p: soma(noAnel(idx('mam'), R_PREDIO), [0, 1.9, 0]), valor: 'R$ 931', sub: 'MEIO AMBIENTE · 2025', cor: C.alerta},
    {a: T.r295 + 0.7, b: fimR, p: topo(RI.prev.p, RI.prev.v, ESC_R), valor: 'R$ 295 MIL', sub: 'PREVISTO · 2025'},
    {a: T.rg + 0.4, b: fimR, p: soma(RI.gasto.p, [0, 0.6, 0]), valor: 'R$ 371', sub: 'GASTO · 2025', cor: C.alerta},
  );
  // a pergunta
  r.push(
    {a: T.festas2 + 0.5, b: T.meio2 - 0.1, p: topo(FE.g25.p, FE.g25.v, ESC_A), valor: 'R$ 13,8 MI', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.meio2 + 0.7, b: T.segue + 0.6, p: soma(noAnel(idx('mam'), R_PREDIO), [0, 1.9, 0]), valor: 'R$ 931', sub: 'MEIO AMBIENTE · 2025', cor: C.alerta},
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
  const mioloF = vis(t, T.repara + 0.2, T.meio - 0.2) + vis(t, T.festas2 - 0.2, T.meio2 - 0.1);
  const mioloR = vis(t, T.rios + 0.2, T.dez);
  const miolo = mioloF + mioloR;
  const escalaTxt = mioloR > 0.01 ? 'AQUI, 1 PILHA = R$ 100 MIL' : mioloF > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI' : '1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // ★ melhoria (gancho visual): enquanto a voz diz "819 milhões em 2025. Nas ações de meio ambiente, menos de mil reais",
    // os dois números entram no mapa
    const g1 = quando('gastou 819'), g2 = quando('menos de mil reais');
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, 4.85, 5.2));
    const kg2 = entra(t, g2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="2025: GASTOU R$ 818,9 MI" k={entra(t, g1, 0.45)} tam={34} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="MEIO AMBIENTE EM 2025: R$ 931" k={kg2} destaque tam={30} /> : null}
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
  // v liquidado: a frase de 2024 foi regravada e ficou ~0,3 s mais longa; cada trecho do mapa anda num ritmo próprio
  // para os textos do mapa caírem na palavra nova (tempo novo → tempo do mapa).
  const PONTOS: [number, number][] = [[0, 0], [7.14, 7.14], [7.94, 7.72], [9.58, 9.32], [9.96, 9.66], [12.22, 11.78], [30, 29.56]];
  return (
    <AbsoluteFill style={{opacity: op}}>
      {PONTOS.slice(0, -1).map(([n0, v0], k) => {
        const [n1, v1] = PONTOS[k + 1];
        const a = Math.round(n0 * FPS);
        const b = Math.round(n1 * FPS);
        if (a >= dur) return null;
        return (
          <Sequence key={k} from={a} durationInFrames={Math.min(b, dur) - a} layout="none">
            <AbsoluteFill>
              <OffthreadVideo src={staticFile(`${P}/mapas/jequie.mp4`)} startFrom={de + Math.round(v0 * FPS)} playbackRate={(v1 - v0) / (n1 - n0)} muted style={{width: W, height: H}} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falta24, T.sobra25, T.amais26, T.empenhou, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 40).map((e) => e.t)), T.fg24, T.fg25, T.rg, T.justica];
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
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}));
  [T.f24, T.fg24, T.f25, T.fg25, T.r295, T.dez].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.meio, T.secretaria].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.14}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.justica + 0.25, f: 'tique', v: 0.15});
  s.push({t: T.festas2, f: 'pop', v: 0.18});
  // ★ melhoria (atenção): baque leve no "menos de mil reais" do gancho e no "Gasto: 371 reais"; impacto nos 13,9 mi
  s.push({t: quando('menos de mil reais') + 0.05, f: 'baque', v: 0.15}, {t: T.rg + 0.15, f: 'baque', v: 0.16}, {t: T.fg25 + 0.15, f: 'impacto', v: 0.15});
  s.push({t: T.meio2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 3.8, 6, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.falta24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 0.9, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.gastou26 + 0.9, T.amais26 + 1.2, T.empenhou + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.f24 + 1.0, T.fg24 + 1.0, T.f25 + 1.0, T.fg25 + 1.0,
  T.meio + 0.6, T.secretaria + 0.8, T.rios + 0.8, T.r295 + 1.0, T.rg + 0.8, T.dez + 0.9, T.justica + 1.2, T.lagoa + 0.5,
  T.tribunal + 0.4, T.saojoao + 1.0, T.improc + 0.6, T.audit + 0.9, T.adv + 0.8,
  T.gastar + 0.5, T.festas2 + 1.2, T.meio2 + 1.2, T.prioridade + 0.5, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoJequie: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="JEQUIÉ" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['2025. Festas:', 'R$ 13,8 mi.', 'Meio ambiente:', 'R$ 931.'];
export const CapaOrcamentoJequie: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · JEQUIÉ`} t={1} troca={0} y={SEGURO.topo + 160} />
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
