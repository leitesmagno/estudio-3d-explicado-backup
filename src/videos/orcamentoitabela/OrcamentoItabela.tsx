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

// 057. orçamento de Itabela (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 054 Cândido Sales. O Kit Mapas abre (voo até Itabela e o que a prefeitura arrecadou
// em 2024: projetos/057.../mapas/itabela.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 3 milhões: orçamento de R$ 133 a 179 mi). Quando a voz fala um setor, as pilhas
// saem dali e voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando sempre no mesmo sentido. Sem porcentagem,
// sem nome de gestor e sem nome de empresa. SÓ DADOS DE ITABELA, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 173.99; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,158, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '057. orçamento de itabela';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 154'),
  gastou24: quando('Gastou 153'),
  sobra24: quando('Sobrou 1 milhao'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 169'),
  gastou25: quando('Gastou 178', 2), // o gancho diz "Itabela gastou 178 milhões em 2025"
  falta25: quando('Faltaram 9'),
  ano26: quando('2026 ate setembro Contando'),
  arrec26: quando('arrecadou 136'),
  gastou26: quando('Gastou 133'),
  empenhou: quando('ja empenhou'),
  folha: quando('Uma parte e folha'),
  zeros: quando('Saneamento zero nos tres'),
  agua: quando('E todo ano o orcamento'),
  nada0: quando('Nada foi gasto'),
  repara: quando('Agora repara numa conta'),
  conta: quando('E a conta usada'),
  i24: quando('Em 2024 previsto'),
  g24: quando('Gasto 6 milhoes e 200'),
  i25: quando('Em 2025 previsto'),
  g25: quando('Gasto 19 milhoes'),
  areas: quando('em educacao saude e financas'),
  i26: quando('mais 4 milhoes e 600'),
  quem: quando('Esses relatorios'),
  junho: quando('Em junho de 2026'),
  contrato: quando('um contrato de 6'),
  reservou: quando('A acao das casas'),
  nadaPago: quando('Ate setembro nada foi pago'),
  tribunal: quando('No Tribunal de Contas'),
  duas: quando('duas denuncias'),
  adv: quando('com advertencia'),
  semdec: quando('E segue sem decisao'),
  gastar: quando('Gastar nao'),
  inden: quando('Mas se as indenizacoes'),
  agua2: quando('e a agua de Monte Pascoal nada'),
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
  {id: 'obr', nome: 'OBRAS, LIMPEZA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'apo', nome: 'APOSENTADORIAS DOS SERVIDORES', tipo: 'casinha', texto: 'APOSENTADORIAS'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'san', nome: 'SANEAMENTO', tipo: 'galpao', texto: 'SANEAMENTO'}, // zero nos 3 anos: PredioTexto cinza (aprendizado 046)
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
];
const R_PREDIO = 7.45;
const ZERADOS: string[] = ['san'];
const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.1375 * Math.PI);
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
const lista = (n: number, v: number[], rots: Record<string, string> = {}): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras limpeza e iluminacao'],
    ['apo', 'Aposentadorias'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['cul', 'Cultura e festas'],
    ['ass', 'Assistencia social'],
    ['san', 'Saneamento zero'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
    ['mam', 'Meio ambiente'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k], rot: rots[s]}));
const ANOS: Ano[] = [
  // 2024: arrecadou 154,0 e gastou 153,0: torre branca do que sobrou (1,0, Balanço 2024 "Superávit")
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 153.0, rotulo: '2024', falta: {t: T.sobra24, v: 1.017, txt: 'SOBROU', sobra: true}, entradas: lista(1, [59.822, 30.807, 11.249, 17.192, 13.802, 4.449, 3.824, 6.377, 3.756, 0, 1.119, 0.199, 0.393])},
  // 2025: gastou 178,7 > arrecadou 169,4: torre vermelha do déficit (9,2, Balanço 2025 "Déficit")
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 178.7, rotulo: '2025', falta: {t: T.falta25, v: 9.249, txt: 'A MAIS', rot: 'R$ 9,2 MI A MAIS DO QUE ARRECADOU'}, entradas: lista(2, [64.827, 40.581, 19.534, 15.245, 14.576, 5.259, 7.903, 2.921, 4.099, 0, 1.541, 0.243, 0.418])},
  // 2026 (Prefeitura + Câmara + CAPREMI): liquidado 133,0; arrecadado 136,3; empenhado 153,1. Torre-fantasma do empenhado
  // além do arrecadado (16,8: só o desenho; uma parte é folha a vencer, por isso branca e não vermelha)
  {ini: T.ano26 + 0.3, fim: T.zeros, gastou: T.gastou26, total: 133.0, rotulo: '2026 · ATÉ SET', falta: {t: T.empenhou, v: 16.788, txt: 'EMPENHADO', sobra: true, rot: 'EMPENHOU R$ 153,1 MI · ARRECADOU R$ 136,3 MI'}, entradas: lista(3, [50.134, 29.339, 11.154, 11.24, 11.199, 4.024, 4.512, 2.095, 3.218, 0, 2.062, 0.267, 0.355])},
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
const ESCALA = 3; // 1 pilha = R$ 3 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; 2025 usa cerca de 54 pilhas) ----------
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

// ---------- Os achados no miolo (torres de 3 x 3; aqui 1 pilha = R$ 500 mil) ----------
const LADO_A = 3;
const ZA = 0.2;
const ESC_A = 0.5;
// esquerda: a conta "indenizações e restituições" (elemento 3.3.90.93): previsto (fantasma) x gasto, ano a ano
const IN = {
  p24: {p: [-4.6, 0, ZA] as V3, v: 0.348},
  g24: {p: [-3.4, 0, ZA] as V3, v: 6.182},
  p25: {p: [-2.1, 0, ZA] as V3, v: 0.389},
  g25: {p: [-0.9, 0, ZA] as V3, v: 19.12},
  g26: {p: [0.45, 0, ZA] as V3, v: 4.621},
};
// direita: as casas populares 2026 (contrato de R$ 6,4 mi e R$ 1 mi reservado, em fantasma; casinha cinza do R$ 0 pago)
const CS = {
  contrato: {p: [2.05, 0, ZA] as V3, v: 6.421},
  reserva: {p: [3.25, 0, ZA] as V3, v: 1.0},
  gasto: {p: [4.35, 0, ZA] as V3, v: 0},
};
const IN_VIS = (t: number) => vis(t, T.repara + 0.1, T.tribunal - 0.3) + vis(t, T.inden - 0.45, T.agua2 - 0.1) + vis(t, T.segue + 0.3, FIM + 2);
const CS_VIS = (t: number) => vis(t, T.junho - 0.2, T.tribunal - 0.3) + vis(t, T.segue + 0.3, FIM + 2);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'CÂMARA: AMPLIAÇÃO DO PRÉDIO', valor: '2024', t: T.duas, carimbos: [[T.adv + 0.1, 'ADVERTÊNCIA', 'alerta']]},
  {titulo: 'CÂMARA: DECORAÇÃO DE SESSÕES', valor: '2024', t: T.duas + 0.7, carimbos: [[T.adv + 0.5, 'ADVERTÊNCIA', 'alerta']]},
  {titulo: 'TRANSPORTE ESCOLAR', valor: '2025', t: T.semdec, carimbos: [[T.semdec + 0.9, 'SEM DECISÃO', 'neutro']]},
];
const posPasta = (i: number): V3 => [-2.0 + i * 2.0, 0, 1.3];
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
  const ix = IN_VIS(t);
  if (ix > 0.01) {
    ([['p24', T.i24 + 0.5], ['p25', T.i25 + 0.5]] as const).forEach(([k, a]) => {
      const kk = cresce(a) * ix;
      if (kk > 0.01) fantasmas.push(...torre(IN[k].p, Math.max(0.35, IN[k].v / ESC_A) * kk, LADO_A, tema.objetoClaro));
    });
    ([['g24', T.g24, 0], ['g25', T.g25, 1], ['g26', T.i26, 2]] as const).forEach(([k, a, yi]) => {
      const kk = cresce(a) * ix;
      if (kk > 0.01) solidas.push(...torre(IN[k].p, (IN[k].v / ESC_A) * kk, LADO_A, CA[yi]));
    });
  }
  const cs = CS_VIS(t);
  if (cs > 0.01) {
    const kc = cresce(T.contrato + 0.2) * cs;
    if (kc > 0.01) fantasmas.push(...torre(CS.contrato.p, (CS.contrato.v / ESC_A) * kc, LADO_A, tema.objetoClaro));
    const kr = cresce(T.reservou + 0.2) * cs;
    if (kr > 0.01) fantasmas.push(...torre(CS.reserva.p, (CS.reserva.v / ESC_A) * kr, LADO_A, tema.objetoClaro));
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
  const ix = IN_VIS(t);
  const cs = CS_VIS(t);
  const pk = PASTAS_VIS(t);
  const casaK = cs * (t >= T.gastar ? 1 : rampa(t, T.nadaPago - 0.1, T.nadaPago + 0.5));
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

      {/* a conta de indenizações (esquerda) e as casas populares 2026 (direita) */}
      <BaseGaveta tema={tema} pos={[-2.05, 0, ZA]} sobe={ix} larg={6.4} texto="INDENIZAÇÕES E RESTITUIÇÕES" aceso={Math.max(janela(t, T.repara, T.junho, 0.4), janela(t, T.inden, T.agua2, 0.4))} />
      <BaseGaveta tema={tema} pos={[3.2, 0, ZA]} sobe={cs} larg={3.7} texto="CASAS POPULARES 2026" aceso={janela(t, T.junho, T.tribunal, 0.4)} />
      {casaK > 0.02 ? <CasaMini tema={tema} pos={[CS.gasto.p[0], -0.9 * (1 - casaK), CS.gasto.p[2]]} rotY={-0.3} luz={0} escala={0.42} /> : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.duas - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
const PG = (c: V3, larg = 4.0, h = 1.2, dx = 0): Cam => E(soma(c, [0, h * 0.8, 0.05]), larg, larg * 1.1, [dx, 2.1, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano e a torre branca do que sobrou; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobra24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre vermelha do que faltou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.falta25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre-fantasma do empenhado além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 1.0, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.zeros - 0.2, 1.2)]},
  // o zero: sobe e recomeça no saneamento (a água de Monte Pascoal)
  {
    ini: T.zeros - 0.1,
    arco: 0.03,
    chaves: [
      [T.zeros - 0.1, DE_CIMA(0.1)],
      [T.zeros + 0.6, OLHA_SETOR(idx('san'), 1.12)],
      [T.repara - 0.3, OLHA_SETOR(idx('san'), 1.06)],
    ],
  },
  // indenizações: da esquerda para a direita, previsto x gasto em cada ano
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.0, 1.0, ZA], 9.4, 7.0, [0, 2.3, 1])],
      [T.i24 - 0.2, PG(soma(IN.p24.p, [0.6, 0, 0]), 4.0, 1.3, -0.05)],
      [T.i25 - 0.3, PG(soma(IN.g24.p, [0.3, 0, 0]), 4.2, 1.6, -0.03)],
      [T.i25 + 0.4, PG(soma(IN.p25.p, [0.6, 0, 0]), 4.6, 2.2, -0.01)],
      [T.areas, PG(soma(IN.g25.p, [0, 0, 0]), 5.4, 3.0, 0)],
      [T.i26 - 0.2, PG(soma(IN.g25.p, [0.5, 0, 0]), 5.4, 2.6, 0.01)],
      [T.i26 + 0.4, PG(soma(IN.g26.p, [0, 0, 0]), 4.4, 1.8, 0.02)],
      [T.quem, E([-2.0, 1.4, ZA], 8.8, 7.4, [0.02, 2.2, 1])],
      [T.junho - 0.3, E([-1.6, 1.4, ZA], 9.0, 7.4, [0.04, 2.2, 1])],
    ],
  },
  // as casas populares 2026: contrato, reservado e o que foi pago, sempre para a direita
  {
    ini: T.junho - 0.2,
    arco: 0.03,
    chaves: [
      [T.junho - 0.2, E([3.2, 0.8, ZA], 6.4, 5.6, [0, 1.8, 1])],
      [T.contrato + 0.2, PG(CS.contrato.p, 3.8, 1.3, -0.03)],
      [T.reservou - 0.2, PG(soma(CS.contrato.p, [0.5, 0, 0]), 3.8, 1.1, -0.02)],
      [T.reservou + 0.4, PG(CS.reserva.p, 3.6, 0.8, 0)],
      [T.nadaPago + 0.2, PG(CS.gasto.p, 3.6, 0.7, 0.02)],
      [T.tribunal - 0.3, E([3.3, 0.9, ZA], 5.8, 5.2, [0.06, 1.7, 1])],
    ],
  },
  // tribunal: as três pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.duas - 0.1, E(soma(posPasta(0), [1.0, 0.9, 0]), 5.0, 3.6, [-0.08, 1.2, 1])],
      [T.adv + 1.2, E(soma(posPasta(1), [-0.4, 0.9, 0]), 5.0, 3.6, [-0.04, 1.2, 1])],
      [T.semdec - 0.1, E(soma(posPasta(2), [0, 0.9, 0]), 3.4, 3.3, [0.02, 1.2, 1])],
      [T.gastar - 0.2, E(soma(posPasta(2), [0.2, 0.9, 0]), 3.6, 3.5, [0.06, 1.2, 1])],
    ],
  },
  // a pergunta: mesa inteira, a torre das indenizações de 2025 e depois a casinha cinza do saneamento (a gaveta afunda)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.inden + 0.2, PG(IN.g25.p, 5.2, 2.8, -0.02)],
      [T.agua2 - 0.15, PG(soma(IN.g25.p, [0.3, 0, 0]), 5.4, 2.6, 0)],
      [T.agua2 + 0.5, OLHA_SETOR(idx('san'), 1.1)],
      [T.segue - 0.1, OLHA_SETOR(idx('san'), 1.05)],
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
  [0, 'ITABELA'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.zeros, 'O ZERO'],
  [T.repara, 'AGORA REPARA: INDENIZAÇÕES'],
  [T.junho, 'CASAS POPULARES'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra24, texto: 'GASTOU EM 2024: R$ 153 MILHÕES'},
    {a: T.sobra24, b: Y0.entradas[0].t, texto: 'SOBROU R$ 1 MI EM 2024'},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 169,4 MI'},
    {a: T.gastou25, b: T.falta25, texto: 'GASTOU EM 2025: R$ 178,7 MILHÕES'},
    {a: T.falta25, b: Y1.entradas[0].t, texto: 'FALTARAM R$ 9,2 MI EM 2025', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SET.: R$ 136,3 MI (COM A PREVIDÊNCIA)'},
    {a: T.gastou26, b: T.empenhou, texto: 'GASTOU ATÉ SETEMBRO: R$ 133 MI'},
    {a: T.empenhou, b: T.folha, texto: 'JÁ EMPENHOU (RESERVOU PARA PAGAR): R$ 153,1 MI', destaque: true},
    {a: T.folha, b: Y2.entradas[0].t, texto: 'UMA PARTE É FOLHA QUE AINDA VAI VENCER'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.zeros, b: T.agua, texto: 'SANEAMENTO: R$ 0 NOS 3 ANOS'},
    {a: T.agua, b: T.nada0, texto: 'ÁGUA EM MONTE PASCOAL: PREVISTA EM 2024, 2025 E 2026'},
    {a: T.nada0, b: T.repara, texto: 'GASTO NOS 3 ANOS: R$ 0', destaque: true},
    {a: T.repara, b: T.conta, texto: 'INDENIZAÇÕES E RESTITUIÇÕES'},
    {a: T.conta, b: T.i24, texto: 'PARA INDENIZAR ALGUÉM OU DEVOLVER DINHEIRO'},
    {a: T.i24, b: T.g24, texto: '2024 · PREVISTO: R$ 348 MIL'},
    {a: T.g24, b: T.i25, texto: '2024 · GASTO: R$ 6,2 MI', destaque: true},
    {a: T.i25, b: T.g25, texto: '2025 · PREVISTO: R$ 389 MIL'},
    {a: T.g25, b: T.areas, texto: '2025 · GASTO: R$ 19,1 MI', destaque: true},
    {a: T.areas, b: T.i26, texto: 'EM EDUCAÇÃO, SAÚDE E FINANÇAS'},
    {a: T.i26, b: T.quem, texto: '2026 · ATÉ SETEMBRO: MAIS R$ 4,6 MI'},
    {a: T.quem, b: T.junho, texto: 'ESSES RELATÓRIOS NÃO DIZEM A QUEM'},
    {a: T.junho, b: T.reservou, texto: 'CONTRATO: R$ 6,4 MI · 50 CASAS (JUNHO/2026)'},
    {a: T.reservou, b: T.nadaPago, texto: 'A AÇÃO DAS CASAS RESERVOU R$ 1 MI'},
    {a: T.nadaPago, b: T.tribunal, texto: 'PAGO ATÉ SETEMBRO: R$ 0', destaque: true},
    {a: T.tribunal, b: T.duas, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.duas, b: T.adv, texto: 'CÂMARA (2024): 2 DENÚNCIAS EM PARTE PROCEDENTES'},
    {a: T.adv, b: T.semdec, texto: 'ADVERTÊNCIA AO EX-PRESIDENTE', destaque: true},
    {a: T.semdec, b: T.gastar, texto: 'SEM DECISÃO: TRANSPORTE ESCOLAR (2025)'},
    {a: T.gastar, b: T.inden, texto: 'GASTAR NÃO É CRIME'},
    {a: T.inden, b: T.agua2, texto: 'INDENIZAÇÕES 2025: R$ 19,1 MI', destaque: true},
    {a: T.agua2, b: T.prioridade, texto: 'ÁGUA DE MONTE PASCOAL: R$ 0', destaque: true},
    {a: T.prioridade, b: T.segue, texto: 'QUAL É A PRIORIDADE?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2025 · TCM-BA'},
  {a: T.ano26, b: T.zeros, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E CAPREMI · TCM-BA'},
  {a: T.zeros, b: T.junho, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2024, DEZ/2025 E SET/2026'},
  {a: T.junho, b: T.tribunal, texto: 'FONTE: PNCP (CONTRATO DE 02/06/2026) E SIGA SET/2026'},
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
  const fimI = T.junho - 0.2;
  // indenizações e restituições: previsto x gasto
  r.push(
    {a: T.i24 + 0.7, b: fimI, p: topo(IN.p24.p, IN.p24.v, ESC_A), valor: 'R$ 348 MIL', sub: 'PREVISTO · 2024'},
    {a: T.g24 + 0.6, b: fimI, p: topo(IN.g24.p, IN.g24.v, ESC_A), valor: 'R$ 6,2 MI', sub: 'GASTO · 2024', cor: CA[0]},
    {a: T.i25 + 0.7, b: fimI, p: topo(IN.p25.p, IN.p25.v, ESC_A), valor: 'R$ 389 MIL', sub: 'PREVISTO · 2025'},
    {a: T.g25 + 0.6, b: fimI, p: topo(IN.g25.p, IN.g25.v, ESC_A), valor: 'R$ 19,1 MI', sub: 'GASTO · 2025', cor: CA[1]},
    {a: T.i26 + 0.6, b: fimI, p: topo(IN.g26.p, IN.g26.v, ESC_A), valor: 'R$ 4,6 MI', sub: 'GASTO · 2026 ATÉ SET', cor: CA[2]},
  );
  // as casas populares 2026
  const fimC = T.tribunal - 0.3;
  r.push(
    {a: T.contrato + 0.9, b: fimC, p: topo(CS.contrato.p, CS.contrato.v, ESC_A), valor: 'R$ 6,4 MI', sub: 'CONTRATO · 50 CASAS'},
    {a: T.reservou + 0.6, b: fimC, p: topo(CS.reserva.p, CS.reserva.v, ESC_A), valor: 'R$ 1 MI', sub: 'RESERVADO'},
    {a: T.nadaPago + 0.4, b: fimC, p: soma(CS.gasto.p, [0, 0.9, 0]), valor: 'R$ 0', sub: 'PAGO ATÉ SET', cor: C.alerta},
  );
  // a pergunta
  r.push(
    {a: T.inden + 0.5, b: T.agua2 - 0.1, p: topo(IN.g25.p, IN.g25.v, ESC_A), valor: 'R$ 19,1 MI', sub: 'INDENIZAÇÕES · 2025', cor: CA[1]},
    {a: T.agua2 + 0.7, b: T.segue + 0.6, p: soma(noAnel(idx('san'), R_PREDIO), [0, 1.9, 0]), valor: 'R$ 0', sub: 'ÁGUA · MONTE PASCOAL', cor: C.alerta},
  );
  // o zero: a água de Monte Pascoal, presa à casinha cinza do saneamento
  r.push({a: T.nada0 + 0.3, b: T.repara - 0.1, p: soma(noAnel(idx('san'), R_PREDIO), [0, 1.9, 0]), valor: 'R$ 0', sub: 'ÁGUA · MONTE PASCOAL · 3 ANOS', cor: C.alerta});
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
  const miolo = vis(t, T.repara + 0.2, T.tribunal - 0.3) + vis(t, T.inden - 0.2, T.agua2 - 0.1);
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 500 MIL' : '1 PILHA = R$ 3 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
    // ★ melhoria da revisão (gancho visual): enquanto a voz diz "178 milhões em 2025. 9 milhões a mais", o número entra no mapa
    const g1 = quando('gastou 178'), g2 = quando('9 milhoes a mais');
    const kg = Math.min(entra(t, g1, 0.4), 1 - rampa(t, T.ano24 - 5.2, T.ano24 - 4.8));
    const kg2 = entra(t, g2, 0.4);
    return (
      <>
        {kg > 0.01 ? (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: kg}}>
            <Chip tema={tema} texto="2025: GASTOU R$ 178,7 MI" k={entra(t, g1, 0.45)} tam={34} />
            {kg2 > 0.01 ? <Chip tema={tema} texto="R$ 9,2 MI A MAIS DO QUE ARRECADOU" k={kg2} destaque tam={30} /> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itabela.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra24, T.falta25, T.empenhou, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 20).map((e) => e.t)), T.g24, T.g25, T.i26, T.nada0, T.nadaPago];
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
  [T.agua, T.nada0].forEach((t) => s.push({t: t + 0.1, f: 'tique', v: 0.16}));
  [T.i24, T.g24, T.i25, T.g25, T.i26, T.contrato, T.reservou].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.nadaPago].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.inden, f: 'pop', v: 0.18});
  // ★ melhoria da revisão: impacto leve na revelação dos 19 milhões e no gancho
  s.push({t: T.g25 + 0.15, f: 'impacto', v: 0.16}, {t: quando('9 milhoes a mais') + 0.05, f: 'baque', v: 0.15});
  s.push({t: T.agua2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.sobra24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.falta25 + 0.9, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[4].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[9].t + 0.6, Y1.entradas[11].t + 0.5, Y1.entradas[12].t + 0.9,
  T.ano26 + 1.0, T.gastou26 + 0.9, T.empenhou + 1.2, T.folha + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[3].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[7].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[11].t + 0.9, Y2.entradas[12].t + 0.9,
  T.zeros + 0.4, T.agua + 1.0, T.nada0 + 0.9,
  T.repara + 0.6, T.conta + 1.0, T.i24 + 1.0, T.g24 + 1.0, T.i25 + 1.0, T.g25 + 1.0, T.areas + 0.8, T.i26 + 1.0, T.quem + 0.8,
  T.junho + 0.6, T.contrato + 1.2, T.reservou + 1.0, T.nadaPago + 0.8,
  T.tribunal + 0.4, T.duas + 1.5, T.adv + 1.0, T.semdec + 1.4,
  T.gastar + 0.5, T.inden + 1.2, T.agua2 + 1.2, T.prioridade + 0.5, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItabela: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="ITABELA" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 19 mi em', 'indenizações', 'em 2025.', 'Para quem?'];
export const CapaOrcamentoItabela: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITABELA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
