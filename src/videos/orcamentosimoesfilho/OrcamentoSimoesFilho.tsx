import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
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

// 060. orçamento de Simões Filho (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 059 Jequié. O Kit Mapas abre (voo até Simões Filho e o que a prefeitura arrecadou
// em 2024: projetos/060.../mapas/simoesfilho.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele. Cidade grande (orçamento de R$ 560 a 740 mi): 1 MOEDA = R$ 1 MI e 1 PILHA = R$ 10 MI, como
// em Camaçari (041) e Jequié (059). Quando a voz fala um setor, as pilhas saem dali e voam para a casinha do setor, na ORDEM
// DA FALA, com a câmera andando sempre no mesmo sentido. Achados no miolo: o empréstimo de 2024 (previsto x entrou), a
// pavimentação e os campos e quadras (previsto x gasto), as parcelas de 2025 x a assistência social, a lei derrubada no
// Supremo (notícia) e as representações no TCM. Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE
// SIMÕES FILHO, todos do TCM-BA (e a notícia do Bahia Notícias): audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 174.01; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,1036, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '060. orçamento de simões filho';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  pegou: quando('pegou 83'),
  ano24: quando('2024 Arrecadou 734'),
  arrec24: quando('Arrecadou 734'),
  contando: quando('contando o emprestimo'),
  gastou24: quando('Gastou 735'),
  falta24: quando('Faltaram 566'),
  ano25: quando('2025 Arrecadou 704'),
  arrec25: quando('Arrecadou 704'),
  gastou25: quando('Gastou 688'),
  sobra25: quando('Sobraram 16'),
  ano26: quando('2026 ate setembro Arrecadou'),
  arrec26: quando('Arrecadou 555'),
  gastou26: quando('Gastou 567'),
  amais26: quando('11 milhoes e 400 a mais'),
  empenhou: quando('Ja empenhou'),
  folha: quando('Uma parte e folha'),
  repara: quando('Agora repara no emprestimo'),
  prev9: quando('previa 9'),
  entraram: quando('Entraram 83'),
  ondefoi: quando('Para onde foi'),
  pav: quando('A acao de pavimentacao'),
  pavp: quando('tinha 5 milhoes'),
  pavg: quando('Gastou 40'),
  camp: quando('A de campos e quadras'),
  campp: quando('previsto 1 milhao'),
  campg: quando('Gasto 15'),
  maior: quando('A maior parte das duas'),
  conta: quando('E a conta'),
  parc: quando('pagou 46'),
  triplo: quando('E quase o triplo'),
  stf: quando('Em outubro de 2026'),
  derrubou: quando('o Supremo derrubou'),
  faltou: quando('faltou a estimativa'),
  mesmo: quando('As contas nao dizem'),
  tribunal: quando('No Tribunal de Contas'), // o gancho diz "ao Tribunal de Contas", sem o "No"
  rep1: quando('de 2018 a 2023'),
  rep2: quando('e de 2024 ainda'),
  julg: quando('ainda nao foram julgadas'),
  pegar: quando('Pegar emprestimo nao'),
  parc2: quando('Mas se so as parcelas'),
  obras2: quando('as obras de 2024 valeram'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 11 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'}, // R$ 0 nos três anos: casinha cinza
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = ['agr'];
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

// ---------- Os três anos (valores em R$ milhões; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number; rot?: string};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean; rot?: string}};
// cada setor é achado pela frase EXATA do ano (nome + número), porque "Câmara" e "Agricultura, zero" se repetem
type Frase = string | [string, number];
const lista = (frases: Frase[], v: number[], rots: Record<string, string> = {}): Entrada[] =>
  ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agr', 'esp', 'mam'].map((s, k) => {
    const f = frases[k];
    return {s, t: typeof f === 'string' ? quando(f) : quando(f[0], f[1]), v: v[k], rot: rots[s]};
  });
const ANOS: Ano[] = [
  // 2024: arrecadou 734,4 e gastou 735,0: torre vermelha do que faltou (566 mil, Balanço 2024 "DÉFICIT (VI)")
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 735.0, rotulo: '2024', falta: {t: T.falta24, v: 0.567, txt: 'A MAIS', rot: 'R$ 566 MIL A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 201', 'Saude 142', 'Administracao 102', 'Obras e servicos urbanos 157', 'Camara de Vereadores', 'Dividas 51', 'Cultura e festas 9', 'Assistencia social 19', 'Agricultura zero esta', 'Esporte 17', 'Meio ambiente 3 milhoes e 200'],
      [201.397, 142.063, 102.289, 157.197, 24.656, 51.2, 9.399, 19.204, 0, 17.175, 3.19], {agr: 'R$ 0 · NADA GASTO'})},
  // 2025: arrecadou 704,5 e gastou 688,1: torre branca do que sobrou (16,4, Balanço 2025 "SUPERÁVIT (XIV)")
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 688.1, rotulo: '2025', falta: {t: T.sobra25, v: 16.424, txt: 'SOBRARAM', sobra: true, rot: 'R$ 16,4 MI SOBRARAM'},
    entradas: lista(['Educacao 208', 'Saude 146', 'Administracao 101', 'Obras e servicos urbanos 105', 'Camara 28', 'Dividas 62', 'Cultura e festas 5', 'Assistencia social 16', ['Agricultura zero', 2], 'Esporte 3', 'Meio ambiente 3 milhoes e 800'],
      [208.928, 146.424, 101.163, 105.202, 28.436, 62.856, 5.871, 16.269, 0, 3.897, 3.752])},
  // 2026 (Prefeitura + Câmara): liquidado 567,0 > arrecadado 555,6: torre vermelha de 11,4 (conta própria: soma de
  // dois documentos); o empenhado (763,9) vai só no chip
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 567.0, rotulo: '2026 · ATÉ SET', falta: {t: T.amais26, v: 11.418, txt: 'A MAIS', rot: 'R$ 11,4 MI A MAIS DO QUE ARRECADOU'},
    entradas: lista(['Educacao 173', 'Saude 125', 'Administracao 82', 'Obras e servicos urbanos 69', 'Camara 23', 'Dividas 50', 'Cultura e festas 10', 'Assistencia social 13', ['Agricultura zero', 3], 'Esporte 4', 'Meio ambiente 3 milhoes e 400'],
      [173.181, 125.886, 82.261, 69.558, 23.506, 50.606, 10.099, 13.484, 0, 4.322, 3.44])},
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

// ---------- Os achados no miolo (1 pilha = R$ 2 mi; o placar troca a escala na cena) ----------
const LADO_A = 3;
const ZA = 0.2;
const ESC_A = 2;
type Torre = {p: V3; v: number; lado: number};
// fila da frente: o empréstimo de 2024 (previsto em fantasma x entrou), a pavimentação e os campos e quadras (previsto x gasto)
const EM = {
  prev: {p: [-3.9, 0, ZA], v: 9.0, lado: 3} as Torre,
  entrou: {p: [-2.55, 0, ZA], v: 83.833, lado: 4} as Torre,
  pavp: {p: [-0.8, 0, ZA], v: 5.919, lado: 3} as Torre,
  pavg: {p: [0.4, 0, ZA], v: 40.872, lado: 3} as Torre,
  campp: {p: [2.0, 0, ZA], v: 1.5, lado: 3} as Torre,
  campg: {p: [3.2, 0, ZA], v: 15.802, lado: 3} as Torre,
};
// fila de trás (perto da câmera): a conta de 2025: parcelas de empréstimos x assistência social inteira
const ZB = 3.2; // longe o bastante para a torre das parcelas não tapar a placa PAVIMENTAÇÃO no plano aberto
const CO = {
  parc: {p: [-0.65, 0, ZB], v: 46.893, lado: 3} as Torre,
  ass: {p: [0.65, 0, ZB], v: 16.269, lado: 3} as Torre,
};
// a pasta do Supremo fica no miolo (onde depois entram as pastas do TCM): na borda da frente, as pilhas da Educação tapavam
const STF_POS: V3 = [0, 0, 1.3];
const EM_VIS = (t: number) => vis(t, T.repara + 0.1, T.stf - 0.3) + vis(t, T.pegar - 0.1, FIM + 2);
const CO_VIS = (t: number) => vis(t, T.conta - 0.1, T.stf - 0.3) + vis(t, T.pegar - 0.1, FIM + 2);
const STF_VIS = (t: number) => vis(t, T.stf - 0.1, T.tribunal - 0.25);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'OPERAÇÕES DE CRÉDITO', valor: '2018 A 2023', t: T.rep1, carimbos: [[T.julg + 0.1, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'USO DOS EMPRÉSTIMOS', valor: '2024', t: T.rep2, carimbos: [[T.julg + 0.25, 'SEM JULGAMENTO', 'neutro']]},
];
const posPasta = (i: number): V3 => [-1.1 + i * 2.2, 0, 1.3];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.pegar - 0.1);

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
  const final = t >= T.pegar - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  const ex = EM_VIS(t);
  if (ex > 0.01) {
    ([[EM.prev, T.prev9 + 0.4], [EM.pavp, T.pavp + 0.4], [EM.campp, T.campp + 0.4]] as const).forEach(([o, a]) => {
      const kk = cresce(a) * ex;
      if (kk > 0.01) fantasmas.push(...torre(o.p, (o.v / ESC_A) * kk, o.lado, tema.objetoClaro));
    });
    ([[EM.entrou, T.entraram + 0.2, 1.4], [EM.pavg, T.pavg + 0.1, 1.0], [EM.campg, T.campg + 0.1, 0.9]] as const).forEach(([o, a, d]) => {
      const kk = cresce(a, d) * ex;
      if (kk > 0.01) solidas.push(...torre(o.p, (o.v / ESC_A) * kk, o.lado, CA[0]));
    });
  }
  const cx = CO_VIS(t);
  if (cx > 0.01) {
    const kp = cresce(T.parc + 0.1, 1.1) * cx;
    if (kp > 0.01) solidas.push(...torre(CO.parc.p, (CO.parc.v / ESC_A) * kp, CO.parc.lado, C.alerta));
    const ka = cresce(T.triplo + 0.4, 0.8) * cx;
    if (ka > 0.01) solidas.push(...torre(CO.ass.p, (CO.ass.v / ESC_A) * ka, CO.ass.lado, CA[1]));
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
  const ex = EM_VIS(t);
  const cx = CO_VIS(t);
  const pk = PASTAS_VIS(t);
  const stfK = STF_VIS(t) * rampa(t, T.stf - 0.1, T.stf + 0.5);
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

      {/* o empréstimo de 2024, a pavimentação e os campos e quadras (fila da frente) */}
      <BaseGaveta tema={tema} pos={[-3.2, 0, ZA]} sobe={ex} larg={2.9} texto="EMPRÉSTIMO 2024" aceso={Math.max(janela(t, T.repara, T.pav, 0.4))} />
      <BaseGaveta tema={tema} pos={[-0.2, 0, ZA]} sobe={ex} larg={2.6} texto="PAVIMENTAÇÃO" aceso={Math.max(janela(t, T.pav, T.camp, 0.4), janela(t, T.obras2, T.segue, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.6, 0, ZA]} sobe={ex} larg={2.6} texto="CAMPOS E QUADRAS" aceso={Math.max(janela(t, T.camp, T.conta, 0.4), janela(t, T.obras2, T.segue, 0.4))} />
      {/* a conta de 2025 (fila de trás) e a pasta do Supremo (notícia) */}
      <BaseGaveta tema={tema} pos={[0, 0, ZB]} sobe={cx} larg={2.9} texto="A CONTA DE 2025" aceso={Math.max(janela(t, T.conta, T.stf, 0.4), janela(t, T.parc2, T.obras2, 0.4))} />
      {stfK > 0.02 ? (
        <PastaProcesso tema={tema} pos={STF_POS} rotY={-0.06} escala={1.3} sobe={stfK} titulo="LEI DO EMPRÉSTIMO DE R$ 85 MI" valor="LEI DE 2023" carimbo={rampa(t, T.derrubou + 0.3, T.derrubou + 0.7)} textoCarimbo="INCONSTITUCIONAL (STF)" corCarimbo={C.alerta} aceso={janela(t, T.stf, T.tribunal, 0.4)} />
      ) : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.rep1 - 0.4)} aceso={janela(t, T.tribunal, T.pegar, 0.5)} />
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
            aceso={janela(t, pa.t, (PASTAS[i + 1]?.t ?? T.pegar) - 0.1, 0.4)}
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
  // o empréstimo de 2024: previsto x entrou; depois a pavimentação e os campos e quadras, da esquerda para a direita
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-0.4, 1.0, ZA], 9.6, 7.4, [0, 2.6, 1])],
      [T.prev9 - 0.2, PG(soma(EM.prev.p, [0.6, 0, 0]), 4.4, 1.4, -0.05)],
      [T.entraram + 0.3, PG(soma(EM.entrou.p, [-0.2, 0, 0]), 4.6, 2.4, -0.03)],
      [T.ondefoi + 0.1, PG(soma(EM.entrou.p, [1.2, 0, 0]), 5.6, 2.4, -0.02)],
      [T.pav - 0.1, PG(soma(EM.pavp.p, [0.6, 0, 0]), 4.6, 1.8, -0.01)],
      [T.pavg + 0.3, PG(soma(EM.pavg.p, [-0.1, 0, 0]), 4.8, 2.4, 0)],
      [T.camp - 0.1, PG(soma(EM.campp.p, [0.6, 0, 0]), 4.4, 1.6, 0.01)],
      [T.campg + 0.3, PG(soma(EM.campg.p, [-0.1, 0, 0]), 4.4, 1.8, 0.02)],
      [T.maior + 0.1, E([-0.4, 1.0, ZA], 9.6, 7.4, [0.03, 2.6, 1])],
      [T.conta - 0.3, E([-0.2, 1.0, ZA], 9.4, 7.3, [0.05, 2.6, 1])],
    ],
  },
  // a conta de 2025: parcelas de empréstimos x assistência social (fila de trás)
  {
    ini: T.conta - 0.1,
    arco: 0.03,
    chaves: [
      [T.conta - 0.1, E([0, 1.0, ZB], 5.4, 4.8, [0, 1.8, 1])],
      [T.parc + 0.2, PG(soma(CO.parc.p, [0.2, 0, 0]), 4.4, 2.4, -0.02)],
      [T.triplo, E([0, 1.2, ZB], 4.8, 4.6, [0.02, 1.8, 1])],
      [T.stf - 0.3, E([0.1, 1.2, ZB], 4.9, 4.7, [0.04, 1.8, 1])],
    ],
  },
  // o Supremo: a pasta da lei do empréstimo (notícia do Bahia Notícias)
  {
    ini: T.stf - 0.1,
    arco: 0.02,
    chaves: [
      [T.stf - 0.1, E(soma(STF_POS, [0, 0.9, 0]), 3.6, 3.5, [-0.03, 1.2, 1])],
      [T.tribunal - 0.3, E(soma(STF_POS, [0.1, 0.9, 0]), 3.8, 3.6, [0.03, 1.2, 1])],
    ],
  },
  // tribunal: as duas pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.rep1 - 0.1, E(soma(posPasta(0), [0, 0.9, 0]), 3.6, 3.4, [-0.06, 1.2, 1])],
      [T.rep2 - 0.2, E(soma(posPasta(0), [0.4, 0.9, 0]), 3.8, 3.5, [-0.03, 1.2, 1])],
      [T.rep2 + 0.4, E(soma(posPasta(1), [0, 0.9, 0]), 3.6, 3.4, [0.02, 1.2, 1])],
      [T.julg + 0.2, E([0, 1.0, 1.3], 6.4, 5.2, [0.03, 1.4, 1])],
      [T.pegar - 0.2, E([0, 1.0, 1.3], 6.6, 5.4, [0.05, 1.4, 1])],
    ],
  },
  // a pergunta: mesa inteira, a torre das parcelas de 2025 e depois as obras de 2024 (pavimentação e campos)
  {
    ini: T.pegar - 0.1,
    arco: 0.04,
    chaves: [
      [T.pegar - 0.1, E([0, 0, 1.0], 12.5, 9, [0, 1.3, 1])],
      [T.parc2 + 0.2, PG(soma(CO.parc.p, [0.2, 0, 0]), 4.6, 2.4, -0.02)],
      [T.obras2 - 0.15, PG(soma(CO.parc.p, [0.4, 0, 0]), 4.8, 2.4, 0)],
      [T.obras2 + 0.5, PG(soma(EM.pavg.p, [1.4, 0, 0]), 5.8, 2.4, 0.01)],
      [T.segue - 0.1, PG(soma(EM.pavg.p, [1.5, 0, 0]), 6.0, 2.4, 0.02)],
      [T.segue + 0.9, E([0, 1.0, 1.0], 10.0, 7.6, [-0.1, 1.4, 1])],
      [FIM, E([0, 0, 0.6], 13.5, 9.6, [-0.3, 1.3, 1])],
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
  [0, 'SIMÕES FILHO'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: O EMPRÉSTIMO'],
  [T.conta, 'E A CONTA?'],
  [T.stf, 'NO SUPREMO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.pegar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.001 ? `R$ ${Math.round(v * 1e6)}` : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falta24, texto: 'GASTOU EM 2024: R$ 735 MILHÕES'},
    {a: T.falta24, b: Y0.entradas[0].t, texto: 'FALTARAM R$ 566 MIL EM 2024', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 704,5 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 688,1 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 16,4 MI EM 2025'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 555,6 MI'},
    {a: T.gastou26, b: T.amais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 567 MI (PREFEITURA + CÂMARA)'},
    {a: T.amais26, b: T.empenhou, texto: 'R$ 11,4 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.empenhou, b: T.folha, texto: 'JÁ EMPENHOU (RESERVOU PARA PAGAR): R$ 763,9 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'UMA PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.prev9, texto: 'O EMPRÉSTIMO DE 2024'},
    {a: T.prev9, b: T.entraram, texto: 'PREVISTO NO ORÇAMENTO DE 2024: R$ 9 MI'},
    {a: T.entraram, b: T.ondefoi, texto: 'ENTRARAM R$ 83,8 MI, DA CAIXA (FINISA)', destaque: true},
    {a: T.ondefoi, b: T.pav, texto: 'PARA ONDE FOI?'},
    {a: T.pav, b: T.pavg, texto: 'PAVIMENTAÇÃO · PREVISTO: R$ 5,9 MI'},
    {a: T.pavg, b: T.camp, texto: 'PAVIMENTAÇÃO · GASTO: R$ 40,9 MI', destaque: true},
    {a: T.camp, b: T.campg, texto: 'CAMPOS E QUADRAS · PREVISTO: R$ 1,5 MI'},
    {a: T.campg, b: T.maior, texto: 'CAMPOS E QUADRAS · GASTO: R$ 15,8 MI', destaque: true},
    {a: T.maior, b: T.conta, texto: 'A MAIOR PARTE: DINHEIRO DE EMPRÉSTIMO'},
    {a: T.conta, b: T.parc, texto: 'E A CONTA?'},
    {a: T.parc, b: T.triplo, texto: '2025 · PARCELAS DE EMPRÉSTIMOS: R$ 46,9 MI', destaque: true},
    {a: T.triplo, b: T.stf, texto: 'QUASE O TRIPLO DA ASSISTÊNCIA SOCIAL (R$ 16,3 MI)', destaque: true},
    {a: T.stf, b: T.derrubou, texto: 'SEGUNDO O BAHIA NOTÍCIAS (22/10/2026)'},
    {a: T.derrubou, b: T.faltou, texto: 'STF DERRUBOU A LEI DO EMPRÉSTIMO DE R$ 85 MI', destaque: true},
    {a: T.faltou, b: T.mesmo, texto: 'FALTOU A ESTIMATIVA DE IMPACTO NO ORÇAMENTO'},
    {a: T.mesmo, b: T.tribunal, texto: 'AS CONTAS NÃO DIZEM SE É O MESMO CONTRATO'},
    {a: T.tribunal, b: T.rep1, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.rep1, b: T.rep2, texto: 'REPRESENTAÇÃO DO MP · EMPRÉSTIMOS 2018 A 2023'},
    {a: T.rep2, b: T.julg, texto: 'REPRESENTAÇÃO DO MP · USO DOS EMPRÉSTIMOS EM 2024'},
    {a: T.julg, b: T.pegar, texto: 'AINDA NÃO JULGADAS', destaque: true},
    {a: T.pegar, b: T.parc2, texto: 'PEGAR EMPRÉSTIMO NÃO É CRIME'},
    {a: T.parc2, b: T.obras2, texto: 'PARCELAS DE 2025: R$ 46,9 MI', destaque: true},
    {a: T.obras2, b: T.segue, texto: 'AS OBRAS VALERAM O QUE A CIDADE VAI PAGAR?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.conta, texto: 'FONTE: BALANÇO, ANEXO 16 E DESPESA POR AÇÃO 2024 · TCM-BA'},
  {a: T.conta, b: T.stf, texto: 'FONTE: DESPESA POR AÇÃO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.stf, b: T.tribunal, texto: 'FONTE: BAHIA NOTÍCIAS, 22/10/2026'},
  {a: T.tribunal, b: T.pegar, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
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
  const topo = (o: Torre) => soma(o.p, [0, altTorre(Math.max(0.35, o.v / ESC_A), o.lado) + 0.3, 0]);
  const fimE = T.conta - 0.2;
  r.push(
    {a: T.prev9 + 0.6, b: fimE, p: topo(EM.prev), valor: 'R$ 9 MI', sub: 'PREVISTO · 2024'},
    {a: T.entraram + 0.9, b: fimE, p: topo(EM.entrou), valor: 'R$ 83,8 MI', sub: 'ENTROU · 2024', cor: CA[0]},
    {a: T.pavp + 0.6, b: fimE, p: topo(EM.pavp), valor: 'R$ 5,9 MI', sub: 'PREVISTO'},
    {a: T.pavg + 0.6, b: fimE, p: topo(EM.pavg), valor: 'R$ 40,9 MI', sub: 'GASTO · 2024', cor: CA[0]},
    {a: T.campp + 0.6, b: fimE, p: topo(EM.campp), valor: 'R$ 1,5 MI', sub: 'PREVISTO'},
    {a: T.campg + 0.6, b: fimE, p: topo(EM.campg), valor: 'R$ 15,8 MI', sub: 'GASTO · 2024', cor: CA[0]},
  );
  const fimC = T.stf - 0.2;
  r.push(
    {a: T.parc + 0.8, b: fimC, p: topo(CO.parc), valor: 'R$ 46,9 MI', sub: 'PARCELAS · 2025', cor: C.alerta},
    {a: T.triplo + 0.9, b: fimC, p: topo(CO.ass), valor: 'R$ 16,3 MI', sub: 'ASSISTÊNCIA · 2025', cor: CA[1]},
  );
  // a pergunta
  r.push(
    {a: T.parc2 + 0.5, b: T.obras2 + 0.2, p: topo(CO.parc), valor: 'R$ 46,9 MI', sub: 'PARCELAS · 2025', cor: C.alerta},
    {a: T.obras2 + 0.7, b: T.segue + 0.6, p: topo(EM.pavg), valor: 'R$ 40,9 MI', sub: 'PAVIMENTAÇÃO · 2024', cor: CA[0]},
    {a: T.obras2 + 0.9, b: T.segue + 0.6, p: topo(EM.campg), valor: 'R$ 15,8 MI', sub: 'CAMPOS · 2024', cor: CA[0]},
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
  const miolo = vis(t, T.repara + 0.2, T.stf - 0.2) + vis(t, T.pegar + 0.1, T.segue + 0.6);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 2 MI · FANTASMA = PREVISTO' : '1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // ★ melhoria (gancho visual): enquanto a voz diz "pegou 83 milhões e 800 emprestados em 2024", o número entra no mapa;
    // e no "contando o empréstimo" a etiqueta volta para lembrar que parte do arrecadado é empréstimo
    const g1 = T.pegou;
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, 3.55, 3.9)) + Math.min(entra(t, T.contando, 0.4), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    const kg2 = entra(t, T.contando, 0.4) * (t >= T.contando ? 1 : 0);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            {kg2 > 0.01 ? <Chip tema={tema} texto="R$ 83,8 MI DESSE TOTAL: EMPRÉSTIMO" k={kg2} destaque tam={30} /> : <Chip tema={tema} texto="2024: R$ 83,8 MI EMPRESTADOS" k={entra(t, g1, 0.45)} destaque tam={34} />}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/simoesfilho.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falta24, T.sobra25, T.amais26, T.empenhou, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 40).map((e) => e.t)), T.entraram, T.pavg, T.campg, T.parc, T.derrubou];
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
  [T.prev9, T.pavp, T.campp, T.stf].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.ondefoi, T.conta].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.14}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.derrubou + 0.35, f: 'tique', v: 0.15});
  s.push({t: T.parc2, f: 'pop', v: 0.18});
  // ★ melhoria (atenção): impacto quando a torre dos R$ 83,8 mi sobe e baque no "quase o triplo"
  s.push({t: T.entraram + 0.2, f: 'impacto', v: 0.15}, {t: T.triplo + 0.1, f: 'baque', v: 0.16}, {t: T.pavg + 0.1, f: 'subida', v: 0.13}, {t: T.pegou + 0.05, f: 'baque', v: 0.14});
  s.push({t: T.obras2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 3.8, 6, T.ano24 + 0.6, T.arrec24 + 1.0, T.gastou24 + 0.9, T.falta24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 0.9, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 0.9, T.gastou26 + 0.9, T.amais26 + 1.2, T.empenhou + 1.2, T.folha + 0.8, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.6, T.prev9 + 1.0, T.entraram + 1.3, T.ondefoi + 0.4, T.pavp + 0.9, T.pavg + 1.0, T.campp + 0.9, T.campg + 1.0, T.maior + 0.9,
  T.conta + 0.5, T.parc + 1.2, T.triplo + 1.2, T.stf + 0.8, T.derrubou + 1.0, T.faltou + 0.8, T.mesmo + 0.8,
  T.tribunal + 0.4, T.rep1 + 0.8, T.rep2 + 0.9, T.julg + 0.8,
  T.pegar + 0.5, T.parc2 + 1.2, T.obras2 + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoSimoesFilho: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Simões Filho" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 83,8 mi', 'emprestados.', 'Valeu o que', 'vai custar?'];
export const CapaOrcamentoSimoesFilho: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · SIMÕES FILHO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
