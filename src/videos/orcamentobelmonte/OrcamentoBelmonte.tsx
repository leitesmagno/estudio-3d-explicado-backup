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
import {ArvoreRedonda, CasaMini, CofreFGTS, PastaIntimacao, PilhaPapeis} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, TeatroMini, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PlacaObra, PredioTexto, Trabalhador, type TipoPredio} from './pecas';
import {PALAVRAS} from './palavras';

// 032. orçamento de belmonte, VERSÃO 4 (perfil @eumagnoleite, série Magno Explica). MOLDE: 034 Canavieiras (versão mais nova).
// O Kit Mapas abre (voo até Belmonte e o que a prefeitura arrecadou em 2024: projetos/032.../mapas/belmonte.mp4) e o Estúdio 3D
// monta a maquete redonda: o cofre no meio e os 13 prédios dos setores na borda da mesa, que sobem na palavra e FICAM até o fim.
// Em cada ano, na palavra do setor, as pilhas SAEM do cofre e voam até a torre daquele ano, ao lado do prédio (1 pilha = R$ 2 mi,
// uma cor por ano). No alto, a barra dos 100 reais se pinta setor por setor. Sem segurança pública (pedido da pessoa).
// SÓ DADOS DE BELMONTE, todos do TCM-BA: audio/fontes.md. Plano: projetos/032. orçamento de belmonte/plano.md (v4, aprovado).

export const FPS = 30;
const AUDIO_SEG = 173.44; // narração v4 (voz Mário), "transporte" cortado 3x, acelerada 1,2x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '032. orçamento de belmonte';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  arrec24: quando('arrecadou 104'),
  gastou24: quando('Gastou 105'),
  cul24: quando('Cultura e turismo'),
  ano25: quando('2025 gestao'),
  entrou25: quando('Arrecadou 125'),
  gastou25: quando('Gastou 126'),
  mais62: quando('62 por cento a mais'),
  ano26: quando('2026 ate setembro'),
  entrou26: quando('Arrecadou 111'),
  compr: quando('Ja comprometeu'),
  quase10: quando('quase 10 a mais'),
  repara: quando('Agora repara'),
  previstos: quando('700 mil previstos'),
  reforco: quando('ganhou 4 milhoes e 900'),
  gastouTur: quando('ja gastou quase'),
  bandas: quando('So bandas'),
  culTinha: quando('a Cultura tinha'),
  cortados: quando('2 milhoes e 900 cortados'),
  gastouCul: quando('e gastou 400'),
  tribunal: quando('O Tribunal multou'),
  r1500: quando('1.500 reais'),
  compra: quando('Numa compra'),
  naoComprovou: quando('nao comprovou'),
  advertiu: quando('Advertiu por'),
  denuncias: quando('E denuncias sobre'),
  gastar: quando('Gastar nao'),
  show: quando('show ganhou'),
  culturaPerdeu: quando('cultura perdeu'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 prédios na borda da mesa, em volta do cofre ----------
type Tipo = 'escola' | 'posto' | 'rua' | 'prefeitura' | 'assist' | 'camara' | 'banco' | 'teatro' | 'defesa' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'div', nome: 'DÍVIDAS', tipo: 'banco'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'cul', nome: 'CULTURA', tipo: 'teatro'},
  {id: 'tur', nome: 'TURISMO', tipo: 'palco', texto: 'TURISMO'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'esp', nome: 'ESPORTE E LAZER', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['def', 'ani'];
// passo entre um prédio e o próximo (em frações de pi): cultura e turismo colados (eram uma secretaria só em 2024)
const PASSOS: Record<string, number> = {cul: 0.085, agr: 0.12, def: 0.09};
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.15 * Math.PI;
  SETORES.forEach((s) => {
    a.push(x);
    x += (PASSOS[s.id] ?? 0.14) * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);
// a torre de pilhas fica AO LADO do prédio; a cultura põe as torres do outro lado, para não entrar no palco do turismo
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const lado = SETORES[i].id === 'cul' ? -1 : 1;
  const tan = [1.0, 1.85, 1.42][yi] * lado;
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};

// ---------- Os três anos ----------
type Entrada = {s: string; t: number; pct: number; v: number};
type Ano = {ini: number; fim: number; rotulo: string; entradas: Entrada[]; zero: number};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    rotulo: '2024',
    zero: quando('animal zero'),
    entradas: [
      {s: 'edu', t: quando('Educacao 45'), pct: 42.7, v: 44.86},
      {s: 'sau', t: quando('Saude 21'), pct: 20.2, v: 21.21},
      {s: 'obr', t: quando('Obras e servicos urbanos 11'), pct: 10.8, v: 11.34},
      {s: 'div', t: quando('Dividas 9'), pct: 8.9, v: 9.33},
      {s: 'adm', t: quando('Administracao 6'), pct: 6.4, v: 6.73},
      {s: 'cul', t: T.cul24, pct: 4.0, v: 4.23},
      {s: 'ass', t: quando('Assistencia social 3'), pct: 3.4, v: 3.6},
      {s: 'cam', t: quando('Camara de Vereadores'), pct: 3.2, v: 3.32},
      {s: 'esp', t: quando('Esporte e lazer'), pct: 0.2, v: 0.223},
      {s: 'agr', t: quando('Agricultura e meio ambiente 220'), pct: 0.2, v: 0.223},
      {s: 'def', t: quando('Defesa civil protecao'), pct: 0, v: 0},
      {s: 'ani', t: quando('protecao animal zero'), pct: 0, v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    rotulo: '2025',
    zero: quando('animal zero', 2),
    entradas: [
      {s: 'edu', t: quando('Educacao 52'), pct: 41.2, v: 52.11},
      {s: 'sau', t: quando('Saude 25 20'), pct: 19.9, v: 25.19},
      {s: 'obr', t: quando('Obras 16'), pct: 12.6, v: 15.97},
      {s: 'adm', t: quando('Administracao 11'), pct: 8.6, v: 10.92},
      {s: 'div', t: quando('Dividas 7'), pct: 5.8, v: 7.27},
      {s: 'cam', t: quando('Camara 4 milhoes e 600'), pct: 3.6, v: 4.56},
      {s: 'ass', t: quando('Assistencia 4 e meio'), pct: 3.6, v: 4.49},
      {s: 'cul', t: quando('Cultura 2 milhoes e 800'), pct: 2.3, v: 2.85},
      {s: 'tur', t: quando('Turismo 2 milhoes e 100'), pct: 1.7, v: 2.11},
      {s: 'agr', t: quando('Agricultura e meio ambiente 500'), pct: 0.4, v: 0.517},
      {s: 'esp', t: quando('Esporte 280'), pct: 0.2, v: 0.278},
      {s: 'def', t: quando('Defesa civil protecao', 2), pct: 0, v: 0},
      {s: 'ani', t: quando('protecao animal zero', 2), pct: 0, v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    rotulo: '2026 · ATÉ SET',
    zero: quando('animal zero', 3),
    entradas: [
      {s: 'edu', t: quando('Educacao 53'), pct: 43.7, v: 53.05},
      {s: 'sau', t: quando('Saude 25 21'), pct: 20.6, v: 25.03},
      {s: 'obr', t: quando('Obras 13'), pct: 10.8, v: 13.13},
      {s: 'adm', t: quando('Administracao 10'), pct: 8.6, v: 10.44},
      {s: 'ass', t: quando('Assistencia 5'), pct: 4.1, v: 5.01},
      {s: 'cam', t: quando('Camara 4 milhoes e 900'), pct: 4.0, v: 4.91},
      {s: 'tur', t: quando('Turismo 4 milhoes e 800'), pct: 3.9, v: 4.79},
      {s: 'div', t: quando('Dividas 3'), pct: 3.1, v: 3.75},
      {s: 'agr', t: quando('Agricultura e meio ambiente e cultura'), pct: 0.3, v: 0.413},
      {s: 'cul', t: quando('e cultura 400'), pct: 0.3, v: 0.4},
      {s: 'esp', t: quando('Esporte 250'), pct: 0.2, v: 0.246},
      {s: 'def', t: quando('Defesa civil protecao', 3), pct: 0, v: 0},
      {s: 'ani', t: quando('protecao animal zero', 3), pct: 0, v: 0},
    ],
  },
];
// primeira vez que cada setor é dito (o prédio sobe e fica). O turismo sobe junto com a cultura em 2024 (uma secretaria só).
const SOBE: Record<string, number> = Object.fromEntries(
  SETORES.map((s) => {
    const ts = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => e.t));
    return [s.id, s.id === 'tur' ? T.cul24 + 0.25 : Math.min(...ts)];
  }),
);

// ---------- Cores ----------
const coresSetor = (tema: Tema): Record<string, string> => {
  const F = tema.festa!;
  const cinza = mistura(tema.objeto, tema.objetoEscuro, 0.3);
  return {
    edu: F.azul,
    sau: F.rosa,
    obr: F.turquesa,
    div: mistura(F.rosa, tema.objetoEscuro, 0.45),
    adm: F.roxo,
    cul: mistura(F.roxo, tema.branco, 0.45),
    tur: F.loiro,
    ass: F.verde,
    cam: mistura(F.azul, tema.branco, 0.45),
    esp: mistura(F.turquesa, tema.branco, 0.4),
    agr: mistura(F.verde, tema.objetoEscuro, 0.35),
    def: cinza,
    ani: cinza,
  };
};
// uma cor por ano (pilhas e plaquinhas): 2024 dourado, 2025 verde-azulado, 2026 rosado
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const anoEm = (t: number) => (t < ANOS[1].ini ? 0 : t < ANOS[2].ini ? 1 : 2);

const ANDAR = 0.75;
const LADO = 3;
const ESCALA = 2; // 1 pilha = R$ 2 milhões nas torres dos setores
const PASSO_FINO = 0.27;
const torreFina = (c: V3, n: number, lado: number, cor: string, passo = PASSO_FINO): Pilha[] => {
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
const altFina = (v: number) => Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005) * ANDAR;
const COFRE_SAIDA: V3 = [0, 0.9, 0];
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const totalAno = (id: string, yi: number): number => ANOS[yi].entradas.filter((e) => e.s === id).reduce((acc, e) => acc + e.v, 0);
const pctAno = (id: string, yi: number): number => ANOS[yi].entradas.filter((e) => e.s === id).reduce((acc, e) => acc + e.pct, 0);

// ---------- O dinheiro ----------
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.7);
const FALTA_POS: V3 = [0, 0, 3.2];
const FALTA_26 = 9.78; // 121,30 comprometidos − 111,52 arrecadados
// "Agora repara": as duas torres do orçamento de 2026, na frente do palco e do teatro (aqui, 1 pilha = R$ 500 mil)
const ESC_REPARA = 0.5;
const frenteDe = (id: string, r = 5.55, tan = 0): V3 => {
  const a = ang(idx(id));
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const TUR_ORC = frenteDe('tur', 5.5, 0.55);
const CUL_ORC = frenteDe('cul', 5.5, -0.55);
const DENTRO_REPARA = (t: number) => janela(t, T.repara + 0.3, T.tribunal - 0.2, 0.5);

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // 2026: o que passou do arrecadado fica em pilhas vermelhas na frente do cofre
  const kf = janela(t, T.quase10 - 0.3, T.repara - 0.2, 0.5);
  if (kf > 0.01) solidas.push(...torreFina(FALTA_POS, (FALTA_26 / ESCALA) * rampa(t, T.quase10 - 0.3, T.quase10 + 0.6) * kf, LADO, C.alerta, 0.38));
  // as torres de cada setor: na palavra do setor, as pilhas do ano SAEM do cofre e voam até a torre ao lado do prédio
  if (some > 0.01)
    SETORES.forEach((s, i) => {
      ANOS.forEach((y, yi) => {
        const es = y.entradas.filter((e) => e.s === s.id);
        if (!es.length) return;
        const total = es.reduce((acc, e) => acc + e.v, 0) / ESCALA;
        if (total < 0.003) return;
        const destino = torreFina(posTorre(i, yi), total, LADO, coresAno(tema)[yi]);
        const e = es[0];
        destino.forEach((pl, j) => {
          const t0 = e.t + 0.1 + j * 0.035;
          const k = rampa(t, t0, t0 + 0.75);
          if (k <= 0) return;
          torres.push({p: k >= 1 ? pl.p : curva(COFRE_SAIDA, pl.p, 2.4, k), n: pl.n * some, cor: pl.cor});
        });
      });
    });
  // "Agora repara": o orçamento do turismo (previsto + reforço) e o da cultura (previsto, corte, gasto)
  const kr = DENTRO_REPARA(t);
  if (kr > 0.01) {
    const prevTur = (0.715 / ESC_REPARA) * rampa(t, T.previstos, T.previstos + 0.6);
    const refTur = (4.896 / ESC_REPARA) * rampa(t, T.reforco + 0.2, T.reforco + 1.6);
    const tur = torreFina(TUR_ORC, (prevTur + refTur) * kr, LADO, C.ouro, 0.3);
    const nPrev = Math.ceil(0.715 / ESC_REPARA);
    const gasto = rampa(t, T.gastouTur, T.gastouTur + 0.6);
    tur.forEach((pl, j) => solidas.push({...pl, cor: j < nPrev ? C.ouro : mistura(tema.acento, C.ouro, 0.35 * gasto)}));
    const prevCul = 4.576 / ESC_REPARA;
    const nGasto = 0.4 / ESC_REPARA;
    const nSobra = (4.576 - 2.859) / ESC_REPARA;
    const kc = rampa(t, T.culTinha, T.culTinha + 0.7);
    const corte = rampa(t, T.cortados, T.cortados + 1.0);
    const naoGasto = rampa(t, T.gastouCul, T.gastouCul + 0.6);
    torreFina(CUL_ORC, prevCul * kc * kr, LADO, C.ouro, 0.3).forEach((pl, j) => {
      if (j >= nSobra) {
        // a parte cortada fica cinza e afunda na mesa
        if (corte >= 0.99) return;
        solidas.push({...pl, p: [pl.p[0], pl.p[1] - 1.6 * corte, pl.p[2]], cor: mistura(C.ouro, tema.objetoEscuro, Math.min(1, corte * 2)), n: pl.n * (1 - corte)});
      } else if (j >= nGasto && naoGasto > 0.01) {
        fantasmas.push({...pl, cor: mistura(C.ouro, tema.objeto, 0.6)});
        if (naoGasto < 0.99) solidas.push({...pl, n: pl.n * (1 - naoGasto)});
      } else solidas.push(pl);
    });
  }
  return {solidas, fantasmas, torres};
};

// ---------- O que fica em volta ----------
const CASAS: [V3, number][] = [
  [[-2.2, 0, 8.4], 0.2],
  [[-4.0, 0, 7.6], -0.3],
  [[-6.1, 0, 5.9], -0.9],
];
const ARVORES: V3[] = [
  [-1.1, 0, 7.3],
  [-3.2, 0, 8.6],
  [-5.2, 0, 7.0],
  [-7.2, 0, 4.4],
  [0.4, 0, 8.4],
];
// o Tribunal e o que ele apontou (no miolo, depois do "Agora repara")
const TCM: V3 = [0, 0, -1.4];
const PAPEIS: V3 = [-1.6, 0, 0.5];
const PASTA_ADV: V3 = [1.6, 0, 0.5];
const PASTA_LIMP: V3 = [-0.75, 0, 1.9];
const PASTA_TRANSP: V3 = [0.75, 0, 1.9];
const DENTRO_TCM = (t: number) => janela(t, T.tribunal - 0.2, T.gastar + 0.3, 0.5);

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  // acende quando o setor é dito em qualquer ano (o turismo acende junto com a cultura em 2024)
  const ditos = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id || (s.id === 'tur' && e.t === T.cul24)).map((e) => e.t));
  let aceso = Math.max(0, ...ditos.map((a) => janela(t, a, a + 2.6, 0.4)));
  // "Agora repara" e a pergunta: palco e teatro acesos; no fim, o palco fica no acento e o teatro apaga
  if (s.id === 'tur') aceso = Math.max(aceso, DENTRO_REPARA(t), janela(t, T.show, FIM + 1, 0.4));
  if (s.id === 'cul') aceso = Math.max(aceso, DENTRO_REPARA(t) * (1 - rampa(t, T.cortados, T.cortados + 1.0)));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, SOBE.obr, SOBE.obr + 6)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - SOBE.obr))} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'teatro':
      return <TeatroMini {...props} />;
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  // o cofre abre em cada "Gastou" / "comprometeu" e fecha na virada do ano
  const abre = Math.max(janela(t, T.gastou24 + 0.3, T.ano25 - 0.2, 0.6), janela(t, T.gastou25, T.ano26 - 0.2, 0.6), janela(t, T.compr, T.repara, 0.6));
  const kt = DENTRO_TCM(t);
  const pastaK = (a: number) => rampa(t, a - 0.1, a + 0.5) * kt;
  // a banda no palco (bonequinhos genéricos, sem rosto)
  const bandaK = janela(t, T.bandas, T.tribunal - 0.3, 0.5);
  const aPalco = ang(idx('tur'));
  const pPalco = noAnel(idx('tur'), R_PREDIO - 0.95);
  return (
    <group>
      <MesaMaquete tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.6} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura: some no "Agora repara" junto com o dinheiro */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={2500} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={600} opacidade={0.3} />

      {/* os 13 prédios: sobem na primeira vez que o setor é dito e ficam até o fim */}
      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* a banda no palco do turismo */}
      {bandaK > 0.02
        ? [-0.45, -0.15, 0.15, 0.45].map((x, k) => {
            const pos: V3 = [pPalco[0] + Math.cos(aPalco) * x, 0.06, pPalco[2] - Math.sin(aPalco) * x];
            return <Trabalhador key={k} tema={tema} pos={pos} rotY={aPalco + Math.PI} passo={Math.sin(t * 6 + k * 1.3) * 0.6} escala={0.3 * bandaK} cor={[tema.festa!.loiro, tema.festa!.rosa, tema.festa!.azul, tema.festa!.verde][k]} />;
          })
        : null}

      {/* o Tribunal e o que ele apontou */}
      <PredioTCM tema={tema} pos={TCM} escala={0.5} sobe={rampa(t, T.tribunal - 0.2, T.tribunal + 0.6) * kt} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {kt > 0.02 ? (
        <group>
          <PilhaPapeis tema={tema} pos={soma(PAPEIS, [-1.05, 0, 0.35])} n={Math.round(60 * pastaK(T.compra))} />
          <PlacaObra tema={tema} pos={PAPEIS} sobe={pastaK(T.compra)} carimbo={rampa(t, T.naoComprovou, T.naoComprovou + 0.4)} titulo="MATERIAL GRÁFICO" sub="COMPRA DE R$ 3,9 MI" selo="ENTREGA NÃO COMPROVADA" cor={C.alerta} terreno={false} escala={1.1} />
          <PlacaObra tema={tema} pos={PASTA_ADV} sobe={pastaK(T.advertiu)} carimbo={rampa(t, T.advertiu + 0.3, T.advertiu + 0.7)} titulo="PAPÉIS FORA DO PRAZO" sub="CONTRATAÇÃO SEM LICITAÇÃO" selo="ADVERTÊNCIA" cor={C.alerta} terreno={false} escala={1.1} />
          <PastaIntimacao tema={tema} pos={soma(PASTA_ADV, [0, 0.05, 0.6])} escala={0.5 * pastaK(T.advertiu)} />
          <PlacaObra tema={tema} pos={PASTA_LIMP} sobe={pastaK(T.denuncias)} carimbo={rampa(t, T.denuncias + 0.8, T.denuncias + 1.2)} titulo="LIMPEZA" sub="DENÚNCIA NO TCM" selo="EM ANÁLISE" cor={mistura(tema.texto, tema.objeto, 0.3)} terreno={false} escala={0.75} />
          <PlacaObra tema={tema} pos={PASTA_TRANSP} sobe={pastaK(T.denuncias + 0.3)} carimbo={rampa(t, T.denuncias + 1.1, T.denuncias + 1.5)} titulo="TRANSPORTE ESCOLAR" sub="DENÚNCIA NO TCM" selo="EM ANÁLISE" cor={mistura(tema.texto, tema.objeto, 0.3)} terreno={false} escala={0.75} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
// olha o prédio do setor i e as torres ao lado, com a câmera do lado de dentro da mesa
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const lado = SETORES[Math.round(i)]?.id === 'cul' ? -1 : 1;
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7 * lado, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7 * lado];
  return E(alvo, 4.2 * perto, 4.1 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// palco e teatro lado a lado, olhando de dentro da mesa
const OLHA_PAR = (perto = 1): Cam => {
  const i = idx('cul') + 0.5;
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.3, 1.1, Math.cos(a) * 6.3];
  return E(alvo, 5.4 * perto, 5.0 * perto, [-Math.sin(a) * 0.8, 0.85, -Math.cos(a) * 0.8]);
};
const passaSetores = (ents: Entrada[], fim: number, perto = 1, primeiro = 0.05): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    return [
      [e.t - (k === 0 ? primeiro : 0.05), OLHA_SETOR(idx(e.s), perto)],
      [segura, OLHA_SETOR(idx(e.s), perto * 0.97)],
    ];
  });
};
const ZERO_CAM = (perto: number) => OLHA_SETOR(idx('def') + 0.5, perto);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: abre na mesa e gira de setor em setor
  {ini: T.gastou24 - 0.3, arco: 0.06, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [ANOS[0].entradas[0].t - 0.4, E([0, 0, 1.2], 9.8, 7.6, [0.1, 1.2, 1])]]},
  {ini: ANOS[0].entradas[0].t - 0.35, arco: 0.03, chaves: [...passaSetores(ANOS[0].entradas, ANOS[0].entradas[10].t - 0.2, 1, 0.3), [ANOS[0].entradas[10].t - 0.1, ZERO_CAM(1.5)], [ANOS[0].zero + 0.2, ZERO_CAM(1.6)]]},
  {ini: ANOS[0].zero + 0.3, arco: 0.06, chaves: [[ANOS[0].zero + 0.3, VISTA_GERAL(0.1)], [T.ano25 - 0.2, VISTA_GERAL(0.2)]]},
  // 2025: abre de cima no cofre e passa de prédio em prédio, com as torres de 2024 e 2025 lado a lado
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [ANOS[1].entradas[0].t - 0.5, DE_CIMA(-0.1)]]},
  {ini: ANOS[1].entradas[0].t - 0.4, arco: 0.03, chaves: [[ANOS[1].entradas[0].t - 0.4, OLHA_SETOR(idx('edu'), 1.15)], ...passaSetores(ANOS[1].entradas, ANOS[1].entradas[11].t - 0.2, 1.15), [ANOS[1].entradas[11].t - 0.1, ZERO_CAM(1.5)], [ANOS[1].zero + 0.2, ZERO_CAM(1.6)]]},
  {ini: ANOS[1].zero + 0.3, arco: 0.06, chaves: [[ANOS[1].zero + 0.3, DE_CIMA(-0.2)], [T.ano26 - 0.2, DE_CIMA(0.25)]]},
  // 2026: o cofre não dá conta (pilhas vermelhas); depois de prédio em prédio, com as três torres
  {ini: T.ano26 - 0.1, arco: 0.05, chaves: [[T.ano26 - 0.1, E([0, 0.4, 1.4], 7.5, 6, [0, 1.1, 1])], [T.quase10 + 0.3, E([0, 0.5, 2.0], 6.2, 5.2, [0.1, 0.95, 1])], [ANOS[2].entradas[0].t - 0.5, E([0, 0.5, 2.0], 6.6, 5.4, [0.15, 1.0, 1])]]},
  {ini: ANOS[2].entradas[0].t - 0.4, arco: 0.03, chaves: [[ANOS[2].entradas[0].t - 0.4, OLHA_SETOR(idx('edu'), 1.25)], ...passaSetores(ANOS[2].entradas, ANOS[2].entradas[11].t - 0.2, 1.25), [ANOS[2].entradas[11].t - 0.1, ZERO_CAM(1.5)], [ANOS[2].zero + 0.2, ZERO_CAM(1.6)]]},
  // Agora repara: o palco do turismo e o teatro da cultura, lado a lado
  {ini: T.repara - 0.1, arco: 0.03, chaves: [[T.repara - 0.1, DE_CIMA(-0.2)], [T.previstos - 0.2, OLHA_PAR(1.05)], [T.bandas, OLHA_PAR(0.95)], [T.culTinha, OLHA_PAR(1.0)], [T.tribunal - 0.3, OLHA_PAR(0.92)]]},
  // o Tribunal
  {ini: T.tribunal - 0.2, arco: 0.05, chaves: [[T.tribunal - 0.2, E([0, 1.0, -1.0], 6.5, 6, [0, 0.95, 1])], [T.compra, E([-1.4, 0.8, 0.6], 4.4, 4.2, [-0.2, 0.75, 1])], [T.advertiu - 0.5, E([-1.4, 0.8, 0.6], 4.2, 4.0, [-0.2, 0.75, 1])], [T.advertiu, E([1.4, 0.8, 0.6], 4.4, 4.2, [0.2, 0.75, 1])], [T.denuncias - 0.5, E([1.4, 0.8, 0.6], 4.2, 4.0, [0.2, 0.75, 1])], [T.denuncias, E([0, 0.7, 1.9], 4.0, 3.8, [0, 0.8, 1])], [T.gastar - 0.6, E([0, 0.7, 1.9], 3.8, 3.6, [0, 0.8, 1])], [T.gastar - 0.3, E([0, 0.7, 1.0], 6.5, 5.5, [0, 0.9, 1])]]},
  // a pergunta e o fim
  {ini: T.gastar - 0.2, chaves: [[T.gastar - 0.2, VISTA_GERAL(-0.2)], [T.show - 0.2, OLHA_PAR(1.4)], [T.segue, OLHA_PAR(1.6)], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'BELMONTE · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, 'O SHOW E A CULTURA'],
  [T.tribunal, 'O TRIBUNAL'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtP = (p: number) => `${p.toFixed(1).replace('.', ',').replace(/,0$/, '')}%`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: ANOS[0].entradas[0].t, texto: 'GASTOU EM 2024: R$ 105,1 MILHÕES'},
    {a: T.ano25, b: T.entrou25, texto: '2025 · GESTÃO IÊDO ELIAS'},
    {a: T.entrou25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 125,8 MILHÕES'},
    {a: T.gastou25, b: ANOS[1].entradas[0].t, texto: 'GASTOU EM 2025: R$ 126,4 MILHÕES'},
    {a: T.ano26, b: T.entrou26, texto: '2026 · ATÉ SETEMBRO'},
    {a: T.entrou26, b: T.compr, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 111,5 MI'},
    {a: T.compr, b: T.quase10, texto: 'JÁ COMPROMETEU: R$ 121,3 MI (PREFEITURA + CÂMARA)'},
    {a: T.quase10, b: ANOS[2].entradas[0].t, texto: 'QUASE R$ 10 MI A MAIS DO QUE ARRECADOU', destaque: true},
  ];
  ANOS.forEach((y, yi) => {
    const ents = y.entradas;
    ents.forEach((e, k) => {
      const prox = k + 1 < ents.length ? ents[k + 1].t : y.zero + 0.1;
      if (e.s === 'ani') return;
      const z = e.s === 'def';
      let texto = z ? 'DEFESA CIVIL E PROTEÇÃO ANIMAL: R$ 0' : `${nomeDe(e.s)}: ${fmtV(e.v)} · ${fmtP(e.pct)}`;
      if (yi === 0 && e.s === 'cul') texto = `CULTURA E TURISMO (1 SECRETARIA): ${fmtV(e.v)} · ${fmtP(e.pct)}`;
      c.push({a: e.t, b: z ? y.zero + 1.3 : prox, texto, destaque: z});
    });
  });
  c.push(
    {a: T.mais62, b: ANOS[1].entradas[4].t, texto: 'ADMINISTRAÇÃO: +62% EM UM ANO', destaque: true},
    {a: T.repara, b: T.previstos, texto: 'O ORÇAMENTO DE 2026 · AQUI, 1 PILHA = R$ 500 MIL'},
    {a: T.previstos, b: T.reforco, texto: 'TURISMO: R$ 715 MIL PREVISTOS'},
    {a: T.reforco, b: T.gastouTur, texto: '+ R$ 4,9 MI DE REFORÇO', destaque: true},
    {a: T.gastouTur, b: T.bandas, texto: 'JÁ GASTOU: R$ 4,79 MI · MAIS QUE O DOBRO DE 2025'},
    {a: T.bandas, b: T.culTinha, texto: 'BANDAS E PRODUTORAS SEM LICITAÇÃO: R$ 2,28 MI PAGOS', destaque: true},
    {a: T.culTinha, b: T.cortados, texto: 'CULTURA: R$ 4,6 MI PREVISTOS'},
    {a: T.cortados, b: T.gastouCul, texto: 'R$ 2,9 MI CORTADOS', destaque: true},
    {a: T.gastouCul, b: T.tribunal, texto: 'GASTOU R$ 400 MIL · 12 VEZES MENOS QUE O TURISMO'},
    {a: T.tribunal, b: T.compra, texto: 'TCM-BA MULTOU O PREFEITO: R$ 1.500', destaque: true},
    {a: T.compra, b: T.naoComprovou, texto: 'COMPRA DE MATERIAL GRÁFICO: R$ 3,9 MI'},
    {a: T.naoComprovou, b: T.advertiu, texto: 'NÃO COMPROVOU QUE RECEBEU O MATERIAL', destaque: true},
    {a: T.advertiu, b: T.denuncias, texto: 'ADVERTÊNCIA: PAPÉIS ENVIADOS FORA DO PRAZO'},
    {a: T.denuncias, b: T.gastar, texto: 'DENÚNCIAS AINDA SEM JULGAMENTO'},
    {a: T.gastar, b: T.show, texto: 'GASTAR NÃO É CRIME'},
    {a: T.show, b: T.segue, texto: 'O SHOW GANHOU REFORÇO. A CULTURA PERDEU?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXOS 7, 9 E 12 DE 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXOS 8, 9 E 12 DE 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · EMPENHADO'},
  {a: T.repara, b: T.tribunal, texto: 'FONTE: SIGA SET/2026 E PCMGE056 JAN–SET/2026 · TCM-BA'},
  {a: T.tribunal, b: T.denuncias, texto: 'FONTE: TCM-BA · ACÓRDÃOS 32484e25 E 10859e25'},
  {a: T.denuncias, b: T.gastar, texto: 'FONTE: TCM-BA · DENÚNCIAS 08808e26 E 15247e26 (06/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const r: Rot[] = [];
  const nomesAno = ['2024', '2025', '2026 · ATÉ SET'];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e) => {
      const i = idx(e.s);
      if (ZERADOS.includes(e.s)) {
        if (yi === 0) r.push({a: e.t + 0.3, b: y.zero + 1.3, p: soma(noAnel(i, R_PREDIO), [0, 1.3, 0]), valor: 'R$ 0', cor: C.alerta});
        return;
      }
      // a plaquinha do ano e, junto, as dos anos anteriores do mesmo setor (cada uma na cor do seu ano)
      for (let k = 0; k <= yi; k++) {
        const v = totalAno(e.s, k);
        if (v < 0.1) continue;
        let sub = `${nomesAno[k]} · ${fmtP(pctAno(e.s, k))}`;
        if (e.s === 'cul' && k === 0) sub = '2024 · CULTURA + TURISMO';
        if (e.s === 'tur' && k === 1) sub = '2025 · NO BALANÇO, EM ESPORTE';
        r.push({a: e.t + (k === yi ? 0.9 : 0.35 + k * 0.1), b: e.t + 3.0, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub, cor: coresAno(tema)[k]});
      }
    });
  });
  // 2024: cultura e turismo eram uma secretaria só
  const meio = noAnel(idx('cul') + 0.5, R_PREDIO);
  r.push({a: T.cul24 + 0.5, b: T.cul24 + 3.2, p: soma(meio, [0, 1.9, 0]), valor: 'UMA SECRETARIA SÓ', sub: 'CULTURA + TURISMO'});
  // 2026: o que passou do arrecadado
  r.push({a: T.quase10 + 0.5, b: ANOS[2].entradas[0].t, p: soma(FALTA_POS, [0, ANDAR + 0.4, 0]), valor: 'QUASE R$ 10 MI', sub: 'A MAIS DO QUE ARRECADOU', cor: C.alerta});
  // "Agora repara"
  const hT = (n: number) => Math.ceil(n / 9 - 0.0005) * ANDAR + 0.35;
  r.push(
    {a: T.previstos + 0.4, b: T.reforco + 0.3, p: soma(TUR_ORC, [0, hT(0.715 / ESC_REPARA), 0]), valor: 'R$ 715 MIL', sub: 'TURISMO · PREVISTO'},
    {a: T.reforco + 1.2, b: T.culTinha, p: soma(TUR_ORC, [0, hT(5.611 / ESC_REPARA), 0]), valor: 'R$ 4,79 MI GASTOS', sub: 'TURISMO · COM O REFORÇO', cor: tema.acento},
    {a: T.culTinha + 0.6, b: T.cortados + 0.2, p: soma(CUL_ORC, [0, hT(4.576 / ESC_REPARA), 0]), valor: 'R$ 4,6 MI', sub: 'CULTURA · PREVISTO'},
    {a: T.cortados + 0.9, b: T.gastouCul + 0.2, p: soma(CUL_ORC, [0, hT((4.576 - 2.859) / ESC_REPARA), 0]), valor: '− R$ 2,9 MI', sub: 'CULTURA · CORTADO', cor: C.alerta},
    {a: T.gastouCul + 0.6, b: T.tribunal - 0.1, p: soma(CUL_ORC, [0, hT(0.4 / ESC_REPARA), 0]), valor: 'R$ 400 MIL GASTOS', sub: 'CULTURA'},
    {a: T.r1500 + 0.2, b: T.compra + 0.2, p: soma(TCM, [0, 2.4, 0]), valor: 'MULTA: R$ 1.500', sub: 'ACÓRDÃO 32484e25', cor: C.alerta},
  );
  return r;
};

// ---------- A barra dos 100 reais (compacta, no alto; não tapa a maquete) ----------
const BARRA_Y = 612;
const Barra: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const yi = anoEm(t);
  const y = ANOS[yi];
  const k = Math.min(janela(t, y.entradas[0].t - 0.3, y.fim - 0.3, 0.4), yi === 2 ? 1 - rampa(t, T.repara - 0.4, T.repara) : 1);
  if (k <= 0.01) return null;
  const CS = coresSetor(tema);
  const larg = SEGURO.dir - SEGURO.esq;
  let acc = 0;
  const fatias = y.entradas
    .filter((e) => e.pct > 0)
    .map((e) => {
      const de = acc;
      acc += e.pct;
      return {de, ate: acc, cor: CS[e.s], u: rampa(t, e.t, e.t + 0.6)};
    });
  const contado = fatias.reduce((s, f) => s + (f.ate - f.de) * f.u, 0);
  const atual = [...y.entradas].reverse().find((e) => t >= e.t && e.pct > 0);
  return (
    <div style={{position: 'absolute', left: SEGURO.esq, top: BARRA_Y, width: larg, opacity: k}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: tema.textoSuave, marginBottom: 5}}>
        <span>DE CADA R$ 100 GASTOS EM {y.rotulo}</span>
        <span style={{color: tema.texto}}>{Math.min(100, Math.round(contado))} DE 100</span>
      </div>
      <div style={{position: 'relative', height: 20, borderRadius: 7, background: mistura(tema.cartao, tema.objetoEscuro, 0.3), border: `1.5px solid ${tema.cartaoBorda}`, overflow: 'hidden'}}>
        {fatias.map((f, i) => (
          <div key={i} style={{position: 'absolute', left: `${f.de}%`, width: `${(f.ate - f.de) * f.u}%`, top: 0, bottom: 0, background: f.cor, borderRight: f.u > 0.9 ? `1px solid ${tema.fundo}` : undefined, filter: atual && CS[atual.s] === f.cor && t < (atual.t + 2.2) ? 'brightness(1.25)' : undefined}} />
        ))}
      </div>
    </div>
  );
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
  const repara = t >= T.repara && t < T.tribunal;
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 56 ? 15 : seloAtual.texto.length > 48 ? 17 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          {coresAno(tema).map((c, i) => (
            <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: c, opacity: i <= anoEm(t) ? 1 : 0.25}} />
          ))}
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 (ANEXO 12) ENVIADO AO TCM-BA</div>
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
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(SEGURO.botoesX - 90, pj.x)), y: Math.max(770, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // afasta as plaquinhas que encostam: cada uma procura a altura livre mais perto (nunca acima de y 770, para não tocar a barra)
  const postos: {x: number; y: number}[] = [];
  for (const r of rots) {
    const base = Math.max(770, r.y);
    const tentativas = [0, -68, 68, -136, 136, 204, 272];
    let yy = base;
    for (const d of tentativas) {
      const c = base + d;
      if (c < 770 || c > 1300) continue;
      if (!postos.some((o) => Math.abs(o.x - r.x) < 170 && Math.abs(o.y - c) < 66)) {
        yy = c;
        break;
      }
    }
    r.y = yy;
    postos.push({x: r.x, y: yy});
  }
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 46 ? 17 : chip.texto.length > 38 ? 20 : chip.texto.length > 30 ? 24 : 30} />
        </div>
      ) : null}
      {repara ? null : <Barra tema={tema} t={t} />}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/belmonte.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [
  T.gastou24,
  T.mais62,
  T.quase10,
  ...ANOS.flatMap((y) => y.entradas.filter((e) => e.pct >= 2).map((e) => e.t)),
  T.reforco,
  T.bandas,
  T.cortados,
  T.r1500,
  T.naoComprovou,
  T.advertiu,
];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  s.push({t: T.gastou24 + 0.2, f: 'subida', v: 0.16});
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: ZERADOS.includes(e.s) ? 0.1 : 0.18})));
  ANOS.forEach((y) => s.push({t: y.zero, f: 'baque', v: 0.18}));
  [T.entrou25, T.entrou26].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.mais62, f: 'subida', v: 0.16});
  s.push({t: T.quase10, f: 'baque', v: 0.22});
  s.push({t: T.reforco + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.bandas, f: 'pop', v: 0.18});
  s.push({t: T.cortados, f: 'baque', v: 0.2});
  s.push({t: T.r1500, f: 'impacto', v: 0.2});
  s.push({t: T.naoComprovou + 0.35, f: 'impacto', v: 0.18});
  s.push({t: T.advertiu + 0.65, f: 'impacto', v: 0.16});
  [T.denuncias + 1.1, T.denuncias + 1.4].forEach((t) => s.push({t, f: 'tique', v: 0.12}));
  s.push({t: T.show, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 4.5, 7, 9.8, T.gastou24 + 0.9,
  ...ANOS[0].entradas.slice(0, 10).map((e) => e.t + 1.0),
  ANOS[0].zero + 0.6, T.ano25 + 1.0, T.gastou25 + 0.8,
  ...ANOS[1].entradas.filter((e) => ['edu', 'adm', 'cul', 'tur', 'esp'].includes(e.s)).map((e) => e.t + 1.0),
  T.mais62 + 0.5, ANOS[1].zero + 0.6,
  T.ano26 + 1.0, T.quase10 + 1.0,
  ...ANOS[2].entradas.filter((e) => ['edu', 'sau', 'cam', 'tur', 'cul'].includes(e.s)).map((e) => e.t + 1.0),
  ANOS[2].zero + 0.6,
  T.repara + 0.6, T.previstos + 0.8, T.reforco + 1.6, T.bandas + 1.0, T.culTinha + 1.0, T.cortados + 1.2, T.gastouCul + 0.8,
  T.tribunal + 0.6, T.r1500 + 0.6, T.naoComprovou + 0.8, T.advertiu + 1.0, T.denuncias + 1.6, T.gastar + 0.6, T.show + 0.8, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoBelmonte: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Belmonte" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['O show', 'ganhou.', 'A cultura', 'perdeu.'];
export const CapaOrcamentoBelmonte: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · BELMONTE`} t={1} troca={0} y={SEGURO.topo + 160} />
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
