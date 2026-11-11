import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, Portico} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 045. orçamento de cairu, o município de Morro de São Paulo (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 035 Paratinga (pelo código do 046 Potiraguá). O Kit Mapas abre (voo até Cairu e o que a prefeitura arrecadou
// em 2024: projetos/045.../mapas/cairu.mp4) e o Estúdio 3D monta a maquete redonda: o COFRE no meio e, em cada ano,
// a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz fala um setor, as pilhas saem dali e voam para
// a casinha do setor. As casinhas ficam na borda NA ORDEM DA FALA, então a câmera anda sempre no mesmo sentido.
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE CAIRU, todos do TCM-BA (e a TUPA segundo a prefeitura, com fonte):
// audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 176.09; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,161, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '045. orçamento de cairu';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 167'),
  gastou24: quando('Gastou 164'),
  sobra24: quando('Sobraram 3 milhoes e 600'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 186'),
  gastou25: quando('Gastou 183', 2), // a 1ª vez é a frase de abertura ("Cairu... gastou 183 milhões")
  sobra25: quando('Sobraram 3 milhoes e 900'),
  ano26: quando('2026 ate setembro'),
  arrec26: quando('Arrecadou 145'),
  gastou26: quando('Ja gastou'),
  falt26: quando('18 milhoes e meio'),
  dondeSai: quando('De onde vai sair'),
  espZero: quando('Esporte zerado'),
  quadras: quando('as quadras de escola'),
  defesa: quando('Defesa civil teve'),
  animal: quando('Protecao animal'),
  repara: quando('Agora repara'),
  entra: quando('Quem entra'),
  prefDiz: quando('A prefeitura diz'),
  rendeu: quando('ela rendeu'),
  nasContas: quando('Nas contas mandadas'),
  nomeTupa: quando('com o nome TUPA'),
  parecida: quando('A mais parecida'),
  outros: quando('outros servicos'),
  paraOnde: quando('Para onde vai'),
  lixo: quando('pagou o lixo'),
  limpeza: quando('A limpeza e mesmo'),
  l13: quando('13 milhoes e 300'),
  quatroVezes: quando('mais de quatro vezes'),
  eventos: quando('E os eventos'),
  em2026: quando('e em 2026'),
  tribunal: quando('No Tribunal de Contas'),
  denuncia: quando('uma denuncia'),
  espera: quando('espera julgamento'),
  suspender: quando('mandou suspender'),
  podiam: quando('podiam chegar'),
  mp: quando('Ministerio Publico'),
  emprest: quando('um emprestimo'),
  gastar: quando('Gastar nao'),
  turista: quando('se o turista'),
  porque: quando('por que nao da'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 15 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'arvores' | 'defesa' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'lim', nome: 'LIMPEZA E SANEAMENTO', tipo: 'rua'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'galpao', texto: 'OBRAS'},
  {id: 'tur', nome: 'TURISMO E EVENTOS', tipo: 'palco', texto: 'TURISMO E EVENTOS'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'casinha', texto: 'CULTURA'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agr', nome: 'AGRICULTURA E PESCA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['ani'];
const ANGS: number[] = SETORES.map((_, i) => 0.12 * Math.PI + i * 0.125 * Math.PI);
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
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}; sobra?: {t: number; v: number}};
const lista = (n: number, v: number[]): Entrada[] =>
  [
    ['edu', 'Educacao'],
    ['sau', 'Saude'],
    ['adm', 'Administracao'],
    ['lim', 'Limpeza e saneamento'],
    ['obr', 'Obras'],
    ['tur', 'Turismo e eventos'],
    ['cam', 'Camara'],
    ['div', 'Dividas'],
    ['cul', 'Cultura'],
    ['ass', 'Assistencia social'],
    ['agr', 'Agricultura'],
    ['esp', 'Esporte'],
    ['mam', 'Meio ambiente'],
  ].map(([s, w], k) => ({s, t: quando(w, n), v: v[k]}));
const ANOS: Ano[] = [
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 164.3, rotulo: '2024', sobra: {t: T.sobra24, v: 3.6}, entradas: lista(1, [59.2, 31.4, 28.4, 13.7, 8.9, 6.1, 5.7, 4.6, 0.76, 3.1, 0.37, 0, 0.015])},
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 183, rotulo: '2025', sobra: {t: T.sobra25, v: 3.9}, entradas: lista(2, [77.7, 35.3, 27.4, 12.6, 3.0, 6.1, 6.4, 7.8, 0.62, 3.8, 0.41, 0, 0.036])},
  {ini: T.ano26 + 0.3, fim: T.espZero, gastou: T.gastou26, total: 163.8, rotulo: '2026 · ATÉ SET', falta: {t: T.falt26, v: 18.5}, entradas: lista(3, [69.9, 31.5, 22.8, 10.9, 5.4, 4.7, 5.0, 5.5, 1.3, 2.7, 0.3, 1.2, 0.93])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? (s.id === 'def' ? T.defesa : T.animal)]));
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
const ESCALA = 2; // 1 pilha = R$ 2 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (4 voltas: cabem 134 pilhas; 2025 usa 97) ----------
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
    if (n < 0.003) return;
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

// ---------- A TUPA no miolo: pórtico, turistas e duas gavetas (prefeitura diz x nas contas) ----------
const ESC_TUPA = 0.25; // aqui, 1 pilha = R$ 250 mil
const PORTICO_POS: V3 = [0, 0, -1.3];
const GT = {pref: [-1.85, 0, 1.35] as V3, contas: [1.85, 0, 1.35] as V3};
const TUPA = {pref: 7.6909, contas: 7.1473};
const TUPA_VIS = (t: number) => vis(t, T.repara + 0.2, T.paraOnde - 0.2) + vis(t, T.turista, FIM + 2);
const PORTICO_VIS = (t: number) => vis(t, T.repara + 0.1, T.paraOnde - 0.2) + vis(t, T.gastar, FIM + 2);
// ---------- Para onde vai: limpeza x assistência x eventos (1 pilha = R$ 500 mil) ----------
const ESC_CMP = 0.5;
const CMP = {
  lim24: {p: [-3.0, 0, 1.0] as V3, v: 13.326, t: T.lixo, ano: 0, nome: 'LIMPEZA'},
  ass24: {p: [-1.6, 0, 1.0] as V3, v: 3.06, t: T.quatroVezes, ano: 0, nome: 'ASSISTÊNCIA'},
  eve24: {p: [-0.2, 0, 1.0] as V3, v: 3.285, t: T.eventos, ano: 0, nome: 'EVENTOS'},
  eve26: {p: [1.5, 0, 1.0] as V3, v: 3.227, t: T.em2026, ano: 2, nome: 'EVENTOS'},
  ass26: {p: [2.9, 0, 1.0] as V3, v: 2.744, t: T.em2026 + 0.5, ano: 2, nome: 'ASSISTÊNCIA'},
};
const CMP_VIS = (t: number) => vis(t, T.paraOnde, T.tribunal - 0.3);
const TCM_POS: V3 = [0, 0, -2.35];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'TUPA · DENÚNCIA', valor: 'AUMENTO E DESTINO', t: T.denuncia, carimbos: [[T.espera, 'SEM JULGAMENTO', 'neutro']]},
  {titulo: 'ESCRITÓRIO · ROYALTIES', valor: 'ATÉ R$ 8,76 MI', t: T.suspender, carimbos: [[T.suspender + 0.5, 'PAGAMENTOS SUSPENSOS', 'alerta']]},
  {titulo: 'EMPRÉSTIMO R$ 21 MI', valor: 'MINISTÉRIO PÚBLICO', t: T.mp, carimbos: [[T.emprest, 'MP INVESTIGA', 'neutro']]},
];
const posPasta = (i: number): V3 => [-2.0 + i * 2.0, 0, 0.4];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele.
  // As torres que já chegaram à borda ficam até o fim; só o que está no miolo some.
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
    // 2026: o que foi gasto a mais, torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    });
  }
  // TUPA: transparente = o que a prefeitura diz que arrecadou; rosa = a linha "outros serviços" nas contas (jan–abr/2026)
  const g = TUPA_VIS(t);
  if (g > 0.01) {
    const r = rampa(t, T.rendeu, T.rendeu + 0.9) * g;
    const u = rampa(t, T.outros, T.outros + 0.9) * g;
    if (r > 0.01) fantasmas.push(...torre(GT.pref, (TUPA.pref / ESC_TUPA) * r, LADO, tema.objetoClaro));
    if (u > 0.01) solidas.push(...torre(GT.contas, (TUPA.contas / ESC_TUPA) * u, LADO, CA[2]));
  }
  // limpeza x assistência x eventos
  const cm = CMP_VIS(t);
  if (cm > 0.01)
    Object.values(CMP).forEach((c) => {
      const k = rampa(t, c.t, c.t + 1.0) * cm;
      if (k > 0.01) solidas.push(...torre(c.p, (c.v / ESC_CMP) * k, LADO, CA[c.ano]));
    });
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-7.6, 0, 3.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'esp') aceso = Math.max(aceso, janela(t, T.espZero, T.defesa, 0.4));
  if (s.id === 'def') aceso = Math.max(aceso, janela(t, T.defesa, T.animal, 0.4));
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
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
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
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

// turistas passando pelo pórtico da TUPA (andam da frente para o fundo, em fila)
const TURISTAS = [
  {x: -0.45, atraso: 0},
  {x: 0.35, atraso: 0.7},
  {x: -0.1, atraso: 1.4},
  {x: 0.5, atraso: 2.1},
  {x: -0.5, atraso: 2.8},
];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const g = TUPA_VIS(t);
  const pv = PORTICO_VIS(t);
  const cm = CMP_VIS(t);
  const pk = PASTAS_VIS(t);
  const turistasK = vis(t, T.entra - 0.2, T.paraOnde - 0.3);
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

      {/* a TUPA: pórtico de entrada de Morro de São Paulo, turistas e as duas gavetas */}
      {pv > 0.02 ? (
        <group position={[PORTICO_POS[0], PORTICO_POS[1] - 2.4 * (1 - Math.min(1, pv)), PORTICO_POS[2]]} scale={0.62}>
          <Portico tema={tema} pos={[0, 0, 0]} texto="TUPA · R$ 70" luz={Math.max(janela(t, T.entra, T.paraOnde, 0.4), janela(t, T.turista, FIM + 1, 0.4))} />
        </group>
      ) : null}
      {turistasK > 0.02
        ? TURISTAS.map((tu, k) => {
            const u = ((t - T.entra - tu.atraso + 10) % 3.5) / 3.5;
            const z = 1.0 - u * 3.6;
            const a = turistasK * Math.min(1, Math.min(u, 1 - u) * 8);
            if (a < 0.02) return null;
            return <Boneco key={k} tema={tema} pos={[tu.x, 0.04, z]} rotY={Math.PI} escala={0.38 * a} cor={mistura([F.turquesa, F.rosa, F.dourado, F.verde, F.azul][k], tema.objeto, 0.25)} />;
          })
        : null}
      <BaseGaveta tema={tema} pos={GT.pref} sobe={g} larg={2.3} texto="TUPA · DIZ A PREFEITURA" aceso={janela(t, T.prefDiz, T.parecida, 0.4)} />
      <BaseGaveta tema={tema} pos={GT.contas} sobe={g} larg={2.5} texto="NAS CONTAS: OUTROS SERVIÇOS" aceso={janela(t, T.parecida, T.paraOnde, 0.4)} />

      {/* para onde vai: 2024 (limpeza, assistência, eventos) e 2026 (eventos, assistência) */}
      <BaseGaveta tema={tema} pos={[-1.6, 0, 1.0]} sobe={cm} larg={4.4} texto="2024" aceso={janela(t, T.paraOnde, T.em2026, 0.4)} />
      <BaseGaveta tema={tema} pos={[2.2, 0, 1.0]} sobe={vis(t, T.em2026 - 0.2, T.tribunal - 0.3)} larg={2.9} texto="2026 · ATÉ SET" aceso={janela(t, T.em2026, T.tribunal, 0.4)} />

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(1 - i) * 0.1}
            escala={0.78}
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
    const pp = perto * alto * (idx(e.s) >= 10 ? 1.08 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const GAV_CAM = (c: V3, perto = 1, h = 1.0): Cam => E(soma(c, [0, h, 0.05]), 3.8 * perto, 4.4 * perto, [-0.3, 1.0, 1]);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 11, 8.4, [0, 1.3, 1])], [T.sobra24 + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.falt26 + 0.8, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.espZero - 0.2, 1.2)]},
  // os zeros: esporte (com meio ambiente ao lado), defesa civil e proteção animal, sempre andando para a frente
  {ini: T.espZero - 0.1, arco: 0.04, chaves: [[T.espZero - 0.1, OLHA_SETOR(11.35, 1.45)], [T.defesa - 0.3, OLHA_SETOR(12.3, 1.2)], [T.defesa + 0.1, OLHA_SETOR(13, 0.95)], [T.animal - 0.3, OLHA_SETOR(13.3, 0.95)], [T.animal + 0.1, OLHA_SETOR(14, 0.9)], [T.repara - 0.2, OLHA_SETOR(14, 0.95)]]},
  // a TUPA: sobe e mergulha no miolo; pórtico, depois a gaveta da prefeitura (esquerda) e a das contas (direita)
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 0.8, 0.2], 8.6, 6.8, [0, 1.25, 1])],
      [T.entra, E([0, 1.3, -0.6], 6.2, 6.0, [0, 0.8, 1])],
      [T.prefDiz - 0.2, E([-0.8, 1.2, 0.6], 6.6, 6.0, [-0.04, 0.8, 1])],
      [T.rendeu + 0.2, GAV_CAM(GT.pref, 1.15, 1.4)],
      [T.parecida - 0.2, GAV_CAM(GT.pref, 1.1, 1.4)],
      [T.parecida + 0.3, E([0, 1.3, 1.35], 7.6, 6.4, [0, 0.8, 1])],
      [T.outros + 0.2, GAV_CAM(GT.contas, 1.15, 1.4)],
      [T.paraOnde - 0.3, GAV_CAM(GT.contas, 1.12, 1.4)],
    ],
  },
  // para onde vai: base de 2024 (limpeza, assistência, eventos) e a de 2026, da esquerda para a direita
  {
    ini: T.paraOnde - 0.1,
    arco: 0.03,
    chaves: [
      [T.paraOnde - 0.1, E([-1.4, 1.0, 1.0], 6.6, 6.2, [0, 0.95, 1])],
      [T.l13 - 0.2, E([-2.2, 1.4, 1.0], 4.6, 5.0, [-0.05, 0.75, 1])],
      [T.quatroVezes, E([-2.0, 1.2, 1.0], 4.8, 5.0, [-0.03, 0.75, 1])],
      [T.eventos - 0.2, E([-1.1, 1.1, 1.0], 5.6, 5.2, [0, 0.75, 1])],
      [T.em2026 - 0.1, E([0, 1.0, 1.0], 9.4, 6.8, [0, 1.0, 1])],
      [T.tribunal - 0.3, E([0.1, 1.0, 1.0], 9.2, 6.7, [0.02, 1.0, 1])],
    ],
  },
  // tribunal: as três pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 9.4, 7.0, [0, 0.9, 1])],
      [T.denuncia - 0.1, E(soma(posPasta(0), [0.2, 0.9, 0]), 4.2, 4.0, [-0.1, 0.85, 1])],
      [T.suspender - 0.3, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.2, 4.0, [-0.08, 0.85, 1])],
      [T.suspender + 0.3, E(soma(posPasta(1), [0, 0.9, 0]), 4.2, 4.0, [0, 0.85, 1])],
      [T.mp - 0.3, E(soma(posPasta(1), [0.1, 0.9, 0]), 4.2, 4.0, [0.02, 0.85, 1])],
      [T.mp + 0.3, E(soma(posPasta(2), [-0.1, 0.9, 0]), 4.2, 4.0, [-0.25, 0.9, 1])],
      [T.gastar - 0.2, E(soma(posPasta(2), [-0.2, 0.9, 0]), 4.6, 4.3, [-0.22, 0.95, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o pórtico da TUPA
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.turista - 0.1, E([0, 1.4, 0.2], 7.4, 6.6, [-0.25, 1.1, 1])], [T.segue, E([0, 1.4, 0.2], 7.9, 7.0, [-0.2, 1.15, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'CAIRU · MORRO DE SÃO PAULO'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.espZero, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA: A TUPA'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobra24, texto: 'GASTOU EM 2024: R$ 164,3 MILHÕES'},
    {a: T.sobra24, b: Y0.entradas[0].t, texto: 'SOBRARAM R$ 3,6 MI EM 2024', destaque: true},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 186,9 MI'},
    {a: T.gastou25, b: T.sobra25, texto: 'GASTOU EM 2025: R$ 183 MILHÕES'},
    {a: T.sobra25, b: Y1.entradas[0].t, texto: 'SOBRARAM R$ 3,9 MI EM 2025', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 145,2 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 163,8 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: T.dondeSai, texto: 'R$ 18,5 MI A MAIS, ATÉ SETEMBRO', destaque: true},
    {a: T.dondeSai, b: Y2.entradas[0].t, texto: 'DE ONDE VAI SAIR ESSA DIFERENÇA?', destaque: true},
    {a: T.espZero, b: T.quadras, texto: 'ESPORTE: R$ 0 EM 2024 E EM 2025', destaque: true},
    {a: T.quadras, b: T.defesa, texto: 'QUADRAS DE ESCOLA PELA EDUCAÇÃO: R$ 2,2 MI (2024) E R$ 1,1 MI (2025)'},
    {a: T.defesa, b: T.animal, texto: 'DEFESA CIVIL: R$ 620 MIL, SÓ EM 2025'},
    {a: T.animal, b: T.repara, texto: 'PROTEÇÃO ANIMAL: NEM APARECE NO ORÇAMENTO', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.entra, texto: 'AGORA REPARA'},
    {a: T.entra, b: T.prefDiz, texto: 'TUPA: R$ 70 POR VISITANTE EM MORRO DE SÃO PAULO'},
    {a: T.prefDiz, b: T.nasContas, texto: 'PREFEITURA: TUPA RENDEU R$ 7,7 MI DE JANEIRO A ABRIL DE 2026'},
    {a: T.nasContas, b: T.parecida, texto: 'NAS CONTAS ENVIADAS AO TCM: NENHUMA LINHA CHAMADA TUPA', destaque: true},
    {a: T.parecida, b: T.paraOnde, texto: '"OUTROS SERVIÇOS": R$ 7,1 MI DE JANEIRO A ABRIL DE 2026', destaque: true},
    {a: T.paraOnde, b: T.lixo, texto: 'PARA ONDE VAI?'},
    {a: T.lixo, b: T.limpeza, texto: 'PREFEITURA: EM MAIO, A MAIOR PARTE DA TUPA PAGOU O LIXO'},
    {a: T.limpeza, b: T.quatroVezes, texto: 'LIMPEZA URBANA EM 2024: R$ 13,3 MI'},
    {a: T.quatroVezes, b: T.eventos, texto: 'MAIS DE 4 VEZES A ASSISTÊNCIA SOCIAL (R$ 3,1 MI)', destaque: true},
    {a: T.eventos, b: T.em2026, texto: '2024: EVENTOS R$ 3,3 MI · ASSISTÊNCIA R$ 3,1 MI'},
    {a: T.em2026, b: T.tribunal, texto: '2026, ATÉ SET: EVENTOS R$ 3,2 MI · ASSISTÊNCIA R$ 2,7 MI', destaque: true},
    {a: T.tribunal, b: T.denuncia, texto: 'NO TRIBUNAL DE CONTAS'},
    {a: T.denuncia, b: T.suspender, texto: 'DENÚNCIA SOBRE A TUPA: AINDA SEM JULGAMENTO'},
    {a: T.suspender, b: T.podiam, texto: 'O TCM MANDOU SUSPENDER OS PAGAMENTOS A UM ESCRITÓRIO'},
    {a: T.podiam, b: T.mp, texto: 'HONORÁRIOS PODIAM CHEGAR A R$ 8,76 MI', destaque: true},
    {a: T.mp, b: T.gastar, texto: 'MP INVESTIGA A APROVAÇÃO DO EMPRÉSTIMO DE R$ 21 MI'},
    {a: T.gastar, b: T.turista, texto: 'GASTAR NÃO É CRIME'},
    {a: T.turista, b: T.porque, texto: 'O TURISTA PAGA PARA ENTRAR...', destaque: true},
    {a: T.porque, b: T.segue, texto: '...QUANTO ENTROU E PARA ONDE FOI?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 · DESPESA EMPENHADA'},
  {a: T.ano26, b: T.espZero, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.espZero, b: T.repara, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/24, DEZ/25, SET/26'},
  {a: T.repara, b: T.paraOnde, texto: 'FONTE: PREFEITURA (A TARDE, 05/05/2026) · SIGA ABR/2026'},
  {a: T.paraOnde, b: T.tribunal, texto: 'FONTE: PREFEITURA (BAHIA NOTÍCIAS, 09/07/2026) · SIGA'},
  {a: T.tribunal, b: T.mp, texto: 'FONTE: TCM-BA › DECISÕES (33936E25, 26269E24)'},
  {a: T.mp, b: T.gastar, texto: 'FONTE: A TARDE, 06/08/2026 · 6ª PROMOTORIA DE VALENÇA'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : Math.min(e.t + 3.2, y.fim + 0.3);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: ei + 1 < y.entradas.length ? Math.max(y.entradas[ei + 1].t + 0.45, e.t + 1.3) : sai, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
    if (y.sobra) r.push({a: y.sobra.t + 0.4, b: y.entradas[0].t - 0.1, p: [0, 3.1, 0.6], valor: `SOBRARAM ${fmtV(y.sobra.v)}`, sub: y.rotulo, cor: CA[yi]});
  });
  // zeros: esporte (quadras de escola pela educação) e defesa civil (só 2025)
  const pEsp = soma(noAnel(11.5, R_PREDIO - 1.6), [0, 1.2, 0]);
  r.push(
    {a: T.quadras + 0.4, b: T.defesa + 0.2, p: pEsp, valor: 'R$ 2,2 MI', sub: '2024 · QUADRAS DE ESCOLA', cor: CA[0]},
    {a: T.quadras + 0.6, b: T.defesa + 0.2, p: soma(pEsp, [0, 0, 0.01]), valor: 'R$ 1,1 MI', sub: '2025 · QUADRAS DE ESCOLA', cor: CA[1]},
    {a: T.entra + 0.2, b: T.prefDiz + 0.4, p: soma(PORTICO_POS, [0, 3.0, 0]), valor: 'TUPA · R$ 70', sub: 'POR VISITANTE · MORRO DE SÃO PAULO', cor: tema.acento},
    {a: T.defesa + 0.5, b: T.animal + 0.2, p: soma(noAnel(idx('def'), R_PREDIO - 0.6), [0, 1.6, 0]), valor: 'R$ 620 MIL', sub: '2025 · DEFESA CIVIL', cor: CA[1]},
  );
  // TUPA
  const topo = (c: V3, v: number, esc: number) => soma(c, [0, altTorre(v / esc, LADO) + 0.3, 0]);
  r.push(
    {a: T.rendeu + 0.6, b: T.paraOnde - 0.3, p: topo(GT.pref, TUPA.pref, ESC_TUPA), valor: 'R$ 7,7 MI', sub: 'TUPA · JAN–ABR/2026 · PREFEITURA'},
    {a: T.nomeTupa + 0.3, b: T.parecida + 0.2, p: soma(GT.pref, [0, 1.1, 0.9]), valor: 'NENHUMA LINHA "TUPA"', cor: C.alerta},
    {a: T.outros + 0.6, b: T.paraOnde - 0.3, p: topo(GT.contas, TUPA.contas, ESC_TUPA), valor: 'R$ 7,1 MI', sub: '"OUTROS SERVIÇOS" · JAN–ABR/2026', cor: CA[2]},
    {a: T.turista + 0.5, b: FIM + 1, p: topo(GT.pref, TUPA.pref, ESC_TUPA), valor: 'R$ 7,7 MI', sub: 'DIZ A PREFEITURA'},
    {a: T.turista + 0.7, b: FIM + 1, p: topo(GT.contas, TUPA.contas, ESC_TUPA), valor: 'R$ 7,1 MI', sub: 'NAS CONTAS', cor: CA[2]},
  );
  // limpeza x assistência x eventos
  Object.values(CMP).forEach((c) => {
    r.push({a: c.t + 0.6, b: T.tribunal - 0.3, p: topo(c.p, c.v, ESC_CMP), valor: fmtV(Math.round(c.v * 10) / 10), sub: `${['2024', '', '2026'][c.ano]} · ${c.nome}`, cor: CA[c.ano]});
  });
  r.push({a: T.porque, b: FIM + 1, p: soma(PORTICO_POS, [0, 3.0, 0]), valor: 'TUPA: ?', sub: 'QUANTO ENTROU E PARA ONDE FOI', cor: tema.acento});
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
  const tupaK = vis(t, T.rendeu, T.paraOnde - 0.2);
  const cmpK = vis(t, T.lixo, T.tribunal - 0.3);
  const escalaTxt = tupaK > 0.01 ? 'AQUI, 1 PILHA = R$ 250 MIL · BRANCO = DIZ A PREFEITURA' : cmpK > 0.01 ? 'AQUI, 1 PILHA = R$ 500 MIL · DOURADO 2024 · ROSA 2026' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, tupaK, cmpK);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {escK > 0.01 ? (
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tupaK > 0.01 || cmpK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
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
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < 185 && Math.abs(y - o.y) < 62);
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
      <OffthreadVideo src={staticFile(`${P}/mapas/cairu.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.sobra24, T.sobra25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 5).map((e) => e.t)), T.rendeu, T.nomeTupa, T.outros, T.l13, T.quatroVezes, T.em2026, T.podiam];
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
  [T.sobra24, T.sobra25].forEach((t) => s.push({t: t + 0.3, f: 'ding', v: 0.12}));
  s.push({t: T.falt26, f: 'baque', v: 0.22});
  [T.espZero, T.animal].forEach((t) => s.push({t: t + 0.9, f: 'baque', v: 0.2}));
  s.push({t: T.defesa + 0.5, f: 'pop', v: 0.16});
  s.push({t: T.rendeu + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.nomeTupa + 0.3, f: 'impacto', v: 0.16});
  s.push({t: T.outros + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.lixo + 0.1, f: 'subida', v: 0.18});
  s.push({t: T.quatroVezes + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.eventos + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.em2026 + 0.1, f: 'pop', v: 0.16});
  s.push({t: T.espera + 0.1, f: 'tique', v: 0.14});
  s.push({t: T.suspender + 0.5, f: 'impacto', v: 0.16});
  s.push({t: T.emprest + 0.1, f: 'impacto', v: 0.14});
  s.push({t: T.turista, f: 'pop', v: 0.18});
  s.push({t: T.porque, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.sobra24 + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.sobra25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[7].t + 0.9, Y1.entradas[12].t + 0.9,
  T.ano26 + 1.0, T.falt26 + 0.8, T.dondeSai + 0.6, Y2.entradas[0].t + 0.9, Y2.entradas[5].t + 0.9, Y2.entradas[9].t + 0.6, Y2.entradas[11].t + 0.8, Y2.entradas[12].t + 0.8,
  T.espZero + 0.6, T.quadras + 1.0, T.defesa + 1.0, T.animal + 0.8,
  T.repara + 0.6, T.entra + 0.8, T.rendeu + 1.0, T.nomeTupa + 0.6, T.outros + 1.0, T.paraOnde + 0.6,
  T.lixo + 0.9, T.l13 + 0.8, T.quatroVezes + 0.8, T.eventos + 0.9, T.em2026 + 1.2,
  T.tribunal + 0.4, T.denuncia + 0.6, T.espera + 0.6, T.suspender + 1.0, T.podiam + 0.8, T.mp + 0.6, T.emprest + 0.8,
  T.gastar + 0.5, T.turista + 0.6, T.porque + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCairu: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <CabecalhoCidade tema={tema} cidade="CAIRU" t={t} final={T.segue} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['O turista', 'paga.', 'Para onde', 'vai?'];
export const CapaOrcamentoCairu: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 760}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · CAIRU`} t={1} troca={0} y={SEGURO.topo + 160} />
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
