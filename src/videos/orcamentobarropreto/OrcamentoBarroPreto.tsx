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

// 052. orçamento de Barro Preto (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga, pelo código do 042 Camacan. O Kit Mapas abre (voo até Barro Preto e o que a prefeitura arrecadou
// em 2024: projetos/052.../mapas/barropreto.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 1 milhão, cidade pequena). Quando a voz fala um setor, as pilhas saem dali e
// voam para a casinha do setor, na ORDEM DA FALA, com a câmera andando sempre no mesmo sentido. Sem porcentagem, sem nome de
// gestor e sem nome de empresa. SÓ DADOS DE BARRO PRETO, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 176.25; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,065, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '052. orçamento de barro preto';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 49'),
  gastou24: quando('Gastou 50'),
  mais24: quando('Gastou 1 milhao a mais'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 58'),
  emprest: quando('contando um emprestimo'),
  gastou25: quando('Gastou 55 milhoes Sobraram'), // o gancho diz "gastou 55 milhões em 2025"
  sobra: quando('Sobraram 3'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 48'),
  gastou26: quando('Ja gastou 46'),
  comprometeu: quando('se comprometeu'),
  repara: quando('Agora repara'),
  noNome: quando('No nome'),
  outras: quando('a festa aparece'),
  ev24: quando('1 milhao e 56'),
  naEdu: quando('dentro da conta da educacao'),
  sj25: quando('o Sao Joao custou'),
  naAdm: quando('lancados na administracao'),
  naoEstava: quando('ele nao estava'),
  criada: quando('a linha foi criada'),
  f26: quando('a festa foi para'),
  passa1: quando('ja passa de 1'),
  ruas: quando('E as ruas'),
  pav: quando('a conta de pavimentacao'),
  pracas: quando('A de pracas'),
  festas25: quando('as festas somaram'),
  voltaram: quando('as obras de rua voltaram'),
  p592: quando('592 mil'),
  emprest2: quando('paga com dinheiro'),
  tribunal: quando('No Tribunal de Contas'),
  evento: quando('Um aponta'),
  aluguel: quando('Outro em aluguel'),
  outros: quando('Os outros falam'),
  juridico: quando('servicos juridicos'),
  juros: quando('juros por atraso'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas se a festa'),
  agri2: quando('por que a agricultura'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 12 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS DE RUA E ILUMINAÇÃO', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'palco', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['agr'];
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.15 * Math.PI);
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [0.95, 1.7, 1.32][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos (valores em R$ milhões, como a voz diz; exatos no fontes.md) ----------
type Entrada = {s: string; t: number; v: number; rot?: string};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta: {t: number; v: number; txt: string; sobra?: boolean}};
const lista = (n: number, v: number[], rots: Record<string, string> = {}): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['obr', 'Obras de rua'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia social'],
    ['agu', 'Agua e saneamento'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
    ['mam', 'Meio ambiente'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k], rot: rots[s]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 50.8, rotulo: '2024', falta: {t: T.mais24, v: 1.02, txt: 'A MAIS'}, entradas: lista(1, [25.34, 9.697, 9.718, 0.196, 1.4, 1.898, 0.07, 1.954, 0.136, 0, 0.067, 0.283], {ass: 'R$ 1,95 MI'})},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 55.0, rotulo: '2025', falta: {t: T.sobra, v: 3.6, txt: 'SOBRARAM', sobra: true}, entradas: lista(2, [27.386, 10.378, 10.61, 0.063, 1.8, 2.223, 0.114, 2.019, 0.144, 0, 0.044, 0.208])},
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 46.4, rotulo: '2026 · ATÉ SET', falta: {t: T.comprometeu, v: 11.0, txt: 'COMPROMETIDOS A MAIS'}, entradas: lista(3, [22.881, 9.186, 8.115, 0.672, 1.219, 1.257, 1.02, 1.396, 0.111, 0, 0.061, 0.44])},
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
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;
const LADO = 3;
const ESCALA = 1; // 1 pilha = R$ 1 milhão
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; 2025 usa cerca de 63 pilhas) ----------
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

// ---------- Os achados no miolo (aqui, 1 pilha = R$ 100 mil; torres de 3 x 3) ----------
const ESC_A = 0.1;
const LADO_A = 3;
const ZA = 0.2;
// esquerda: onde está a festa (2024 na educação, 2025 na administração, 2026 na cultura)
const FX = {
  e24: {p: [-4.0, 0, ZA] as V3, v: 1.056},
  sj25: {p: [-2.55, 0, ZA] as V3, v: 0.545},
  f26: {p: [-1.1, 0, ZA] as V3, v: 1.02},
};
// direita: as ruas em 2025 (pavimentação e praças zeradas) x festas 2025; depois as praças de 2026
const RU = {
  pav: {p: [0.55, 0, ZA] as V3},
  pr: {p: [1.55, 0, ZA] as V3},
  f25: {p: [2.65, 0, ZA] as V3, v: 0.859},
  pr26: {p: [3.85, 0, ZA] as V3, v: 0.592},
};
// na pergunta, a gaveta da festa afunda quando a câmera vai para a casinha da agricultura (senão fica na frente) e volta no plano aberto final
const FX_VIS = (t: number) => vis(t, T.repara + 0.1, T.ruas - 0.35) + vis(t, T.gastar - 0.1, T.agri2 - 0.2) + vis(t, T.segue + 0.5, FIM + 2);
const RU_VIS = (t: number) => vis(t, T.ruas - 0.3, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -3.9];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'EVENTO · 2025', valor: 'CONTRATAÇÃO', t: T.evento, carimbos: [[T.evento + 1.3, 'SEM DECISÃO', 'neutro']]},
  {titulo: 'ALUGUEL E COMBUSTÍVEL', valor: 'EDUCAÇÃO · 2023 A 2025', t: T.aluguel, carimbos: [[T.aluguel + 1.2, 'SEM DECISÃO', 'neutro']]},
  {titulo: 'SERVIÇOS JURÍDICOS', valor: '2026', t: T.juridico, carimbos: [[T.juridico + 0.6, 'SEM DECISÃO', 'neutro']]},
  {titulo: 'JUROS DA PREVIDÊNCIA', valor: '2021', t: T.juros, carimbos: [[T.juros + 0.6, 'SEM DECISÃO', 'neutro']]},
];
const posPasta = (i: number): V3 => [-2.7 + i * 1.8, 0, 1.3];
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
    // torre na frente do cofre: vermelha "A MAIS" (2024), branca "SOBRARAM" (2025), vermelha do comprometido a mais (2026)
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
  const fx = FX_VIS(t);
  if (fx > 0.01) {
    const k1 = cresce(T.ev24) * fx;
    if (k1 > 0.01) solidas.push(...torre(FX.e24.p, (FX.e24.v / ESC_A) * k1, LADO_A, CA[0]));
    const k2 = cresce(T.sj25) * fx;
    if (k2 > 0.01) solidas.push(...torre(FX.sj25.p, (FX.sj25.v / ESC_A) * k2, LADO_A, CA[1]));
    const k3 = cresce(T.f26) * fx;
    if (k3 > 0.01) solidas.push(...torre(FX.f26.p, (FX.f26.v / ESC_A) * k3, LADO_A, CA[2]));
  }
  const ru = RU_VIS(t);
  if (ru > 0.01) {
    const k1 = cresce(T.festas25) * ru;
    if (k1 > 0.01) solidas.push(...torre(RU.f25.p, (RU.f25.v / ESC_A) * k1, LADO_A, CA[1]));
    const k2 = cresce(T.p592) * ru;
    if (k2 > 0.01) solidas.push(...torre(RU.pr26.p, (RU.pr26.v / ESC_A) * k2, LADO_A, CA[2]));
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
  const fx = FX_VIS(t);
  const ru = RU_VIS(t);
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
      <PilhasDinheiro pilhas={torres} max={3000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* onde está a festa (esquerda); as ruas em 2025 e 2026 (direita) */}
      <BaseGaveta tema={tema} pos={[-2.55, 0, ZA]} sobe={fx} larg={4.4} texto="ONDE ESTÁ A FESTA" aceso={Math.max(janela(t, T.repara, T.ruas, 0.4), janela(t, T.porque, T.agri2, 0.4))} />
      <BaseGaveta tema={tema} pos={[2.2, 0, ZA]} sobe={ru} larg={4.6} texto="AS RUAS x AS FESTAS" aceso={janela(t, T.ruas, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.evento - 0.4)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
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
            escala={1.0}
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
    const pp = perto * alto * (idx(e.s) >= 9 ? 1.08 : 1);
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
  // 2024: o cofre com a pilha do ano e a torre vermelha; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.mais24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre branca do que sobrou, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobra + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha do que já foi comprometido além do arrecadado
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.comprometeu + 0.6, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // onde está a festa: da esquerda para a direita (2024 educação, 2025 administração, 2026 cultura)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([-2.55, 0.9, ZA], 7.0, 6.4, [0, 1.9, 1])],
      [T.ev24 - 0.2, PG(FX.e24.p, 3.6, 1.1, -0.05)],
      [T.sj25 - 0.3, PG(soma(FX.e24.p, [0.4, 0, 0]), 3.6, 1.1, -0.04)],
      [T.sj25 + 0.3, PG(FX.sj25.p, 3.6, 1.0, 0)],
      [T.f26 - 0.3, PG(soma(FX.sj25.p, [0.4, 0, 0]), 3.6, 1.0, 0)],
      [T.f26 + 0.3, PG(FX.f26.p, 3.6, 1.1, 0.02)],
      [T.ruas - 0.3, PG(soma(FX.f26.p, [0.3, 0, 0]), 3.8, 1.1, 0.03)],
    ],
  },
  // as ruas: pavimentação 2025 (zero), praças 2025 (zero), festas 2025, praças 2026 (sempre para a direita)
  {
    ini: T.ruas - 0.2,
    arco: 0.03,
    chaves: [
      [T.ruas - 0.2, E([2.2, 0.9, ZA], 7.0, 6.4, [0, 1.9, 1])],
      [T.pav - 0.1, PG(meio(RU.pav.p, RU.pr.p), 3.4, 0.8, -0.04)],
      [T.festas25 - 0.3, PG(soma(meio(RU.pav.p, RU.pr.p), [0.4, 0, 0]), 3.6, 0.9, -0.02)],
      [T.festas25 + 0.3, PG(soma(RU.f25.p, [-0.4, 0, 0]), 3.8, 1.0, 0)],
      [T.voltaram, PG(soma(RU.f25.p, [0.1, 0, 0]), 4.0, 1.0, 0.02)],
      [T.p592 + 0.2, PG(soma(RU.pr26.p, [-0.3, 0, 0]), 3.8, 1.0, 0.03)],
      [T.tribunal - 0.3, PG(soma(RU.pr26.p, [-0.1, 0, 0]), 4.0, 1.0, 0.05)],
    ],
  },
  // tribunal: as quatro pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 10.4, 7.6, [0, 2.1, 1])],
      [T.evento - 0.1, E(soma(posPasta(0), [0.2, 0.7, 0]), 4.0, 3.9, [-0.1, 1.5, 1])],
      [T.aluguel - 0.3, E(soma(posPasta(0), [0.4, 0.7, 0]), 4.0, 3.9, [-0.08, 1.5, 1])],
      [T.aluguel + 0.3, E(soma(posPasta(1), [0, 0.7, 0]), 4.0, 3.9, [-0.04, 1.5, 1])],
      [T.outros - 0.2, E(soma(posPasta(1), [0.3, 0.7, 0]), 4.2, 4.0, [0, 1.5, 1])],
      [T.juridico + 0.1, E(soma(meio(posPasta(2), posPasta(3)), [0, 0.7, 0]), 5.4, 4.8, [0.04, 1.5, 1])],
      [T.gastar - 0.2, E(soma(meio(posPasta(2), posPasta(3)), [0.2, 0.7, 0]), 5.6, 5.0, [0.08, 1.5, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois a festa (esquerda) e a casinha cinza da agricultura (borda)
  {
    ini: T.gastar - 0.1,
    arco: 0.04,
    chaves: [
      [T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.porque - 0.1, PG(meio(FX.sj25.p, FX.f26.p), 4.4, 1.1, -0.05)],
      [T.agri2 - 0.4, PG(soma(meio(FX.sj25.p, FX.f26.p), [0.4, 0, 0]), 4.6, 1.1, -0.02)],
      [T.agri2 + 0.3, OLHA_SETOR(idx('agr'), 1.2)],
      [T.segue - 0.1, OLHA_SETOR(idx('agr') + 0.1, 1.25)],
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
const ESTADOS: [number, string][] = [
  [0, 'BARRO PRETO'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'AGORA REPARA: A FESTA'],
  [T.ruas, 'E AS RUAS?'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.mais24, texto: 'GASTOU EM 2024: R$ 50,8 MILHÕES'},
    {a: T.mais24, b: Y0.entradas[0].t, texto: 'GASTOU R$ 1 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.emprest, texto: 'ARRECADOU EM 2025: R$ 58,6 MI'},
    {a: T.emprest, b: T.gastou25, texto: 'CONTANDO UM EMPRÉSTIMO DE R$ 1,5 MI'},
    {a: T.gastou25, b: T.sobra, texto: 'GASTOU EM 2025: R$ 55 MILHÕES'},
    {a: T.sobra, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 3,6 MI EM 2025'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 48,9 MI'},
    {a: T.gastou26, b: T.comprometeu, texto: 'GASTOU ATÉ SETEMBRO: R$ 46,4 MI'},
    {a: T.comprometeu, b: Y2.entradas[0].t, texto: 'COMPROMETIDO: R$ 59,8 MI · ARRECADADO: R$ 48,9 MI', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      const texto = e.s === 'agr' ? 'AGRICULTURA: R$ 0 EM PROGRAMAS' : `${nomeDe(e.s)}: ${fmtE(e)}`;
      c.push({a: e.t, b: prox, texto, destaque: e.s === 'agr'});
    });
  });
  c.push(
    {a: T.repara, b: T.noNome, texto: 'AGORA REPARA NA CULTURA'},
    {a: T.noNome, b: T.outras, texto: 'CULTURA, NO NOME, EM 2024: R$ 70 MIL'},
    {a: T.outras, b: T.ev24, texto: 'A FESTA APARECE EM OUTRAS CONTAS'},
    {a: T.ev24, b: T.sj25, texto: '2024: R$ 1,06 MI DE EVENTOS NA CONTA DA EDUCAÇÃO', destaque: true},
    {a: T.sj25, b: T.naoEstava, texto: '2025: SÃO JOÃO, R$ 545 MIL, NA ADMINISTRAÇÃO'},
    {a: T.naoEstava, b: T.f26, texto: 'O SÃO JOÃO DE 2025 TINHA R$ 0 NO ORÇAMENTO', destaque: true},
    {a: T.f26, b: T.ruas, texto: '2026: NA CULTURA, JÁ PASSA DE R$ 1 MI'},
    {a: T.ruas, b: T.pav, texto: 'E AS RUAS?'},
    {a: T.pav, b: T.pracas, texto: 'PAVIMENTAÇÃO DE VIAS 2025: R$ 0', destaque: true},
    {a: T.pracas, b: T.festas25, texto: 'PRAÇAS E JARDINS 2025: R$ 0', destaque: true},
    {a: T.festas25, b: T.voltaram, texto: 'FESTAS 2025: R$ 859 MIL'},
    {a: T.voltaram, b: T.emprest2, texto: '2026: PRAÇAS, JARDINS E PONTES, R$ 592 MIL'},
    {a: T.emprest2, b: T.tribunal, texto: 'PAGO COM DINHEIRO DE EMPRÉSTIMO'},
    {a: T.tribunal, b: T.evento, texto: 'TRIBUNAL DE CONTAS: 4 PROCESSOS SEM DECISÃO PUBLICADA'},
    {a: T.evento, b: T.aluguel, texto: 'CONTRATAÇÃO DE EMPRESA PARA EVENTO (2025)'},
    {a: T.aluguel, b: T.outros, texto: 'ALUGUEL E COMBUSTÍVEL COM DINHEIRO DA EDUCAÇÃO'},
    {a: T.outros, b: T.gastar, texto: 'SERVIÇOS JURÍDICOS · JUROS POR ATRASO NA PREVIDÊNCIA'},
    {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
    {a: T.porque, b: T.agri2, texto: 'SE A FESTA SEMPRE ACHA UMA CONTA...', destaque: true},
    {a: T.agri2, b: T.segue, texto: '...POR QUE A AGRICULTURA FICA NO ZERO?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: BALANÇO E ANEXO 9 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: Y1.entradas[0].t, texto: 'FONTE: BALANÇO 2025 · TCM-BA · EMPRÉSTIMO: SIGA DEZ/2025'},
  {a: Y1.entradas[0].t, b: T.ano26, texto: 'FONTE: ANEXO 9 2025 · DESPESA EMPENHADA · TCM-BA'},
  {a: T.ano26, b: Y2.entradas[0].t, texto: 'FONTE: SIGA SET/2026 · PREFEITURA, CÂMARA E SAAE'},
  {a: Y2.entradas[0].t, b: T.repara, texto: 'FONTE: SIGA SET/2026 · DESPESA LIQUIDADA'},
  {a: T.repara, b: T.tribunal, texto: 'FONTE: DESPESA POR AÇÃO DEZ/2024, DEZ/2025 E SET/2026'},
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
      if (e.s === 'agr') {
        r.push({a: e.t + 0.5, b, p: soma(noAnel(i, R_PREDIO - 0.4), [0, 1.7, 0]), valor: 'R$ 0 EM PROGRAMAS', sub: yi === 0 ? 'AGRICULTURA · SÓ SALÁRIOS' : `AGRICULTURA · ${ANO_SUB[yi]}`, cor: C.alerta});
        return;
      }
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtE(entradaDe(e.s, k)), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const f = y.falta;
    r.push({a: f.t + 0.4, b: y.entradas[0].t - 0.1, p: soma(FALTA_POS, [0, altTorre(f.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(f.v)} ${f.txt}`, sub: f.sobra ? `${y.rotulo} · CONTANDO O EMPRÉSTIMO` : y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number) => soma(c, [0, altTorre(v / ESC_A, LADO_A) + 0.3, 0]);
  const chao = (c: V3) => soma(c, [0, 0.55, 0.3]);
  // onde está a festa
  const fimF = T.ruas - 0.3;
  r.push(
    {a: T.ev24 + 0.6, b: fimF, p: topo(FX.e24.p, FX.e24.v), valor: 'R$ 1,06 MI', sub: 'EVENTOS 2024 · NA EDUCAÇÃO', cor: CA[0]},
    {a: T.sj25 + 0.6, b: T.naoEstava + 0.2, p: topo(FX.sj25.p, FX.sj25.v), valor: 'R$ 545 MIL', sub: 'SÃO JOÃO 2025 · NA ADMINISTRAÇÃO', cor: CA[1]},
    {a: T.naoEstava + 0.2, b: fimF, p: topo(FX.sj25.p, FX.sj25.v), valor: 'PREVISTO: R$ 0', sub: 'SÃO JOÃO 2025 · LINHA CRIADA DEPOIS', cor: C.alerta},
    {a: T.f26 + 0.6, b: fimF, p: topo(FX.f26.p, FX.f26.v), valor: 'R$ 1,02 MI', sub: 'FESTA 2026 · NA CULTURA', cor: CA[2]},
  );
  // as ruas
  const fimR = T.tribunal - 0.3;
  r.push(
    {a: T.pav + 0.5, b: fimR, p: chao(RU.pav.p), valor: 'R$ 0', sub: 'PAVIMENTAÇÃO · 2025', cor: C.alerta},
    {a: T.pracas + 0.4, b: fimR, p: chao(RU.pr.p), valor: 'R$ 0', sub: 'PRAÇAS E JARDINS · 2025', cor: C.alerta},
    {a: T.festas25 + 0.6, b: fimR, p: topo(RU.f25.p, RU.f25.v), valor: 'R$ 859 MIL', sub: 'FESTAS · 2025', cor: CA[1]},
    {a: T.p592 + 0.5, b: fimR, p: topo(RU.pr26.p, RU.pr26.v), valor: 'R$ 592 MIL', sub: 'PRAÇAS 2026 · EMPRÉSTIMO', cor: CA[2]},
  );
  // a pergunta
  r.push(
    {a: T.porque + 0.3, b: T.agri2 + 0.2, p: soma(meio(FX.sj25.p, FX.f26.p), [0, altTorre(FX.f26.v / ESC_A, LADO_A) + 0.5, 0]), valor: 'R$ 1,06 MI · R$ 545 MIL · R$ 1,02 MI', sub: 'A FESTA EM 2024, 2025 E 2026'},
    {a: T.agri2 + 0.4, b: T.segue + 0.7, p: soma(noAnel(idx('agr'), R_PREDIO - 0.4), [0, 1.7, 0]), valor: 'R$ 0 EM PROGRAMAS', sub: 'AGRICULTURA · 2024, 2025 E 2026', cor: tema.acento},
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
  const escalaTxt = miolo > 0.01 ? 'AQUI, 1 PILHA = R$ 100 MIL' : '1 PILHA = R$ 1 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
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
      <OffthreadVideo src={staticFile(`${P}/mapas/barropreto.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.mais24, T.sobra, T.comprometeu, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 10).map((e) => e.t)), T.ev24, T.naoEstava, T.pav, T.pracas, T.p592];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: e.s === 'agr' ? 'baque' : 'pop', v: 0.18})));
  ANOS.forEach((y) => s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}));
  [T.ev24, T.sj25, T.f26, T.festas25, T.p592].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  [T.naoEstava, T.pav, T.pracas].forEach((t) => s.push({t: t + 0.1, f: 'baque', v: 0.17}));
  PASTAS.forEach((pa) => s.push({t: pa.t + 0.1, f: 'pop', v: 0.14}, {t: pa.carimbos[0][0] + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.agri2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.mais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.emprest + 0.8, T.gastou25 + 0.9, T.sobra + 0.9, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[9].t + 0.9, Y1.entradas[11].t + 0.9,
  T.ano26 + 1.0, T.gastou26 + 0.9, T.comprometeu + 1.2, Y2.entradas[0].t + 0.9, Y2.entradas[3].t + 0.9, Y2.entradas[6].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[11].t + 0.8,
  T.repara + 0.6, T.noNome + 0.8, T.ev24 + 1.0, T.naEdu + 0.6, T.sj25 + 1.0, T.naoEstava + 0.9, T.f26 + 1.0, T.passa1 + 0.6,
  T.ruas + 0.5, T.pav + 0.9, T.pracas + 0.8, T.festas25 + 1.0, T.voltaram + 0.6, T.p592 + 1.0, T.emprest2 + 0.6,
  T.tribunal + 0.4, T.evento + 1.6, T.aluguel + 1.4, T.juridico + 0.6, T.juros + 0.8,
  T.gastar + 0.5, T.porque + 0.8, T.agri2 + 0.8, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoBarroPreto: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="BARRO PRETO" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festa acha', 'conta.', 'Agricultura,', 'zero.'];
export const CapaOrcamentoBarroPreto: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 700}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · BARRO PRETO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
