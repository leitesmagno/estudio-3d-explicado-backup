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
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS, Onibus} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoGuarda, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, TeatroMini, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PlacaObra, PredioTexto, Trabalhador, type TipoPredio} from './pecas';
import {PALAVRAS} from './palavras';

// 034. orçamento de canavieiras (perfil @eumagnoleite, série Magno Explica). MOLDE: 032 (Belmonte v2) e 033 (Inhambupé).
// O Kit Mapas abre (voo até Canavieiras e o que a prefeitura arrecadou em 2024: projetos/034.../mapas/canavieiras.mp4) e o Estúdio 3D
// monta a maquete redonda: o cofre no meio, um ANEL DE 100 PILHAS em volta (cada pilha = 1% do gasto do ano) que se pinta
// fatia por fatia, e os 15 prédios dos setores na borda da mesa, que sobem na palavra e FICAM até o fim (pedido da pessoa).
// Na frente de cada prédio, uma torre de pilhas (1 pilha = R$ 1 milhão) que muda de altura a cada ano.
// SÓ DADOS DE CANAVIEIRAS, todos do TCM-BA: audio/fontes.md. Plano: projetos/034. orçamento de canavieiras/plano.md (v2).

export const FPS = 30;
const AUDIO_SEG = 169.89; // narração v3 (receita só o total declarado, "arrecadou", sem segurança), acelerada 1,15x
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '034. orçamento de canavieiras';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 gestao'),
  gastou24: quando('Gastou 143'),
  falt24: quando('Faltaram 13'),
  ano25: quando('2025 Paulo'),
  entrou25: quando('Arrecadou 147'),
  gastou25: quando('Gastou 157'),
  falt25: quando('Faltaram mais'),
  limpeza25: quando('so limpeza'),
  zero25: quando('animal zero', 2),
  ano26: quando('2026 ate maio'),
  ultimo: quando('ultimo mes'),
  camEntregou: quando('Camara ja entregou'),
  entrou26: quando('Arrecadou 61'),
  pagou: quando('Ja pagou'),
  zero26: quando('zero de novo'),
  repara: quando('Agora repara'),
  postos: quando('Tres postos'),
  creche: quando('uma creche'),
  ambul: quando('duas ambulancias'),
  viatura: quando('a viatura'),
  skate: quando('pista de skate'),
  pier: quando('o pier'),
  nenhum: quando('o gasto foi zero'),
  enquanto: quando('Enquanto isso'),
  ch: quando('CH Servicos'),
  recebeu: quando('recebeu 2'),
  folha: quando('folha da saude'),
  anoAntes: quando('Um ano antes'),
  mp: quando('Ministerio Publico recomendou'),
  concurso: quando('funcoes de concurso'),
  continuou: quando('contrato continuou'),
  subiu: quando('subiu 50'),
  denuncia: quando('Uma denuncia'),
  mpf: quando('Ministerio Publico Federal'),
  devol: quando('devolucao de 2'),
  gastar: quando('Gastar nao'),
  posto: quando('o posto de saude'),
  cresce: quando('contrato so cresce'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 15 prédios na borda da mesa, em volta do cofre ----------
type Tipo = 'escola' | 'posto' | 'rua' | 'prefeitura' | 'assist' | 'camara' | 'banco' | 'teatro' | 'guarda' | 'defesa' | 'onibus' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO DA PREFEITURA', tipo: 'prefeitura'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'tur', nome: 'TURISMO', tipo: 'palco', texto: 'TURISMO'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA', tipo: 'teatro'},
  {id: 'agr', nome: 'AGRICULTURA E MEIO AMBIENTE', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE E LAZER', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['esp', 'def', 'ani'];
// os setores com dinheiro ganham mais espaço (o prédio + a torre do lado); os zerados ficam juntinhos no fim
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.15 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroAgora && zeroProx ? 0.085 * Math.PI : zeroAgora || zeroProx ? 0.11 * Math.PI : 0.133 * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
// a torre de pilhas fica AO LADO do prédio (no sentido do próximo setor), nunca na frente
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  // 2024 e 2025 lado a lado ao lado do prédio; 2026 um passo à frente, entre as duas (nenhuma tampa a outra)
  const tan = [1.0, 1.85, 1.42][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos: cada entrada pinta uma fatia do anel (pct) e põe a torre do setor no valor do ano ----------
type Entrada = {s: string; t: number; pct: number; v: number};
type Ano = {ini: number; fim: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}; zero: number};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    rotulo: '2024',
    falta: {t: T.falt24, v: 13.32},
    zero: quando('animal zero'),
    entradas: [
      {s: 'edu', t: quando('Educacao 54'), pct: 38.0, v: 54.34},
      {s: 'sau', t: quando('Saude 33'), pct: 23.2, v: 33.25},
      {s: 'obr', t: quando('Obras e servicos urbanos 20'), pct: 13.7, v: 19.59},
      {s: 'adm', t: quando('Administracao da prefeitura'), pct: 11.3, v: 16.13},
      {s: 'ass', t: quando('Assistencia social 6'), pct: 4.2, v: 5.96},
      {s: 'tur', t: quando('Turismo 4'), pct: 3.1, v: 4.37},
      {s: 'cam', t: quando('Camara de Vereadores'), pct: 3.0, v: 4.3},
      {s: 'div', t: quando('Dividas 3'), pct: 2.6, v: 3.67},
      {s: 'cul', t: quando('Cultura 1'), pct: 0.7, v: 0.99},
      {s: 'agr', t: quando('Agricultura e meio'), pct: 0.4, v: 0.54},
      {s: 'esp', t: quando('Esporte e lazer'), pct: 0, v: 0.0046},
      {s: 'def', t: quando('Defesa civil e protecao'), pct: 0, v: 0},
      {s: 'ani', t: quando('protecao animal zero'), pct: 0, v: 0},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    rotulo: '2025',
    falta: {t: T.falt25, v: 10.63},
    zero: T.zero25,
    entradas: [
      {s: 'edu', t: quando('Educacao 63'), pct: 39.9, v: 62.73},
      {s: 'sau', t: quando('Saude 38'), pct: 23.9, v: 37.66},
      {s: 'adm', t: quando('Administracao 20'), pct: 12.6, v: 19.79},
      {s: 'obr', t: quando('Obras e servicos urbanos 16'), pct: 10.2, v: 16.1},
      {s: 'ass', t: quando('Assistencia social 6 e meio'), pct: 4.1, v: 6.46},
      {s: 'cam', t: quando('Camara 5'), pct: 3.3, v: 5.12},
      {s: 'div', t: quando('Dividas 5'), pct: 3.1, v: 4.91},
      {s: 'tur', t: quando('Turismo 3'), pct: 2.0, v: 3.09},
      {s: 'agr', t: quando('Agricultura e pesca'), pct: 0.6, v: 0.9},
      {s: 'cul', t: quando('Cultura 600'), pct: 0.4, v: 0.63},
      {s: 'esp', t: quando('Esporte defesa'), pct: 0, v: 0},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.repara,
    rotulo: '2026 · JAN–MAI',
    zero: T.zero26,
    entradas: [
      {s: 'edu', t: quando('Educacao 23'), pct: 40.1, v: 22.6},
      {s: 'sau', t: quando('Saude 13'), pct: 23.4, v: 13.21},
      {s: 'adm', t: quando('Administracao 8'), pct: 14.5, v: 8.17},
      {s: 'obr', t: quando('Limpeza 2'), pct: 5.1, v: 2.9},
      {s: 'ass', t: quando('Assistencia 2'), pct: 4.2, v: 2.36},
      {s: 'cam', t: quando('Camara 2'), pct: 4.0, v: 2.28},
      {s: 'div', t: quando('Dividas turismo'), pct: 2.5, v: 1.38},
      {s: 'tur', t: quando('turismo e obras'), pct: 2.0, v: 1.14},
      {s: 'obr', t: quando('e obras entre'), pct: 2.6, v: 1.48},
      {s: 'agr', t: quando('Agricultura 500'), pct: 0.9, v: 0.49},
      {s: 'cul', t: quando('Cultura 340'), pct: 0.6, v: 0.34},
      {s: 'esp', t: quando('Esporte zero de novo'), pct: 0, v: 0},
    ],
  },
];
// primeira vez que cada setor é dito (o prédio sobe e fica)
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, Math.min(...ANOS[0].entradas.filter((e) => e.s === s.id).map((e) => e.t))]));

// ---------- Cores dos setores (do tema) ----------
const coresSetor = (tema: Tema): Record<string, string> => {
  const F = tema.festa!;
  const cinza = mistura(tema.objeto, tema.objetoEscuro, 0.3);
  return {
    edu: F.azul,
    sau: F.rosa,
    obr: F.turquesa,
    adm: F.roxo,
    ass: F.verde,
    tur: F.loiro,
    cam: mistura(F.azul, tema.branco, 0.45),
    div: mistura(F.rosa, tema.objetoEscuro, 0.45),
    cul: mistura(F.roxo, tema.branco, 0.45),
    agr: mistura(F.verde, tema.objetoEscuro, 0.35),
    esp: cinza,
    def: cinza,
    ani: cinza,
  };
};

// ---------- O anel de 100 pilhas (ordenado pelo ângulo, a partir do fundo da mesa) ----------
const ANEL: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 28],
      [2.25, 34],
      [2.75, 38],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.31;
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: (a - 0.22 * Math.PI + Math.PI * 8) % (Math.PI * 2)});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
// a fatia de cada entrada: [de, até) no anel
const FATIAS = ANOS.map((y) => {
  let acc = 0;
  return y.entradas.map((e) => {
    const de = acc;
    acc = Math.min(100, acc + e.pct);
    return [de, acc] as [number, number];
  });
});
const centroFatia = (yi: number, ei: number): V3 => {
  const [a, b] = FATIAS[yi][ei];
  const pts = ANEL.slice(Math.floor(a), Math.max(Math.floor(a) + 1, Math.ceil(b)));
  const m = pts.reduce((acc, p) => [acc[0] + p[0], 0, acc[2] + p[2]] as V3, [0, 0, 0] as V3);
  return [m[0] / pts.length, 1.1, m[2] / pts.length];
};

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const anoEm = (t: number) => (t < ANOS[1].ini ? 0 : t < ANOS[2].ini ? 1 : 2);

// torre de pilhas: blocos lado×lado por andar
const ANDAR = 0.75;
const PASSO_T = 0.38;
const torre = (c: V3, n: number, lado: number, cor: string): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * PASSO_T, c[1] + andar * ANDAR, c[2] + z * PASSO_T], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;
const LADO = 3;
const ESCALA = 2; // 1 pilha = R$ 2 milhões nas torres dos setores (poucas pilhas, proporcionais)
const PASSO_FINO = 0.27;
// torre de pilhas finas (largura 0,75) para os setores
const torreFina = (c: V3, n: number, lado: number, cor: string): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * PASSO_FINO, c[1] + andar * ANDAR, c[2] + z * PASSO_FINO], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altFina = (v: number) => Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005) * ANDAR;
const COFRE_SAIDA: V3 = [0, 0.9, 0];
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
// uma cor por ano (pilhas e plaquinhas): 2024 dourado, 2025 verde-azulado, 2026 rosado
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// valor da torre do setor no ano yi, no instante t (sobe em 0,9 s na palavra; 2026 soma limpeza + obras)
const valorAno = (id: string, yi: number, t: number): number => ANOS[yi].entradas.filter((e) => e.s === id).reduce((acc, e) => acc + e.v * rampa(t, e.t, e.t + 0.9), 0);
const totalAno = (id: string, yi: number): number => ANOS[yi].entradas.filter((e) => e.s === id).reduce((acc, e) => acc + e.v, 0);

// ---------- As pilhas ----------
const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.repara - 0.2, T.repara + 0.7);
const FALTA_POS: V3 = [0, 0, 4.25];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CS = coresSetor(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // (sem anel no meio: pedido da pessoa) o que faltou fica em pilhas vermelhas na frente do cofre
  if (t >= T.gastou24 - 0.05 && some > 0.01)
    ANOS.forEach((yy) => {
      if (!yy.falta) return;
      const k = janela(t, yy.falta.t, yy.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (yy.falta.v / ESCALA) * rampa(t, yy.falta.t, yy.falta.t + 0.9) * k, LADO, C.alerta));
    });
  // as torres de cada setor (1 pilha = R$ 2 milhões, uma cor por ano): na palavra do setor, as pilhas SAEM do cofre e voam até a torre do ano, ao lado do prédio
  if (some > 0.01)
    SETORES.forEach((s, i) => {
      ANOS.forEach((y, yi) => {
        const es = y.entradas.filter((e) => e.s === s.id);
        if (!es.length) return;
        const total = es.reduce((acc, e) => acc + e.v, 0) / ESCALA;
        if (total < 0.003) return;
        const destino = torreFina(posTorre(i, yi), total, LADO, coresAno(tema)[yi]);
        let acc = 0;
        es.forEach((e) => {
          const de = acc;
          acc += e.v / ESCALA;
          destino.forEach((pl, j) => {
            if (j < Math.floor(de) || j >= Math.ceil(acc - 0.0005)) return;
            const t0 = e.t + 0.1 + (j - Math.floor(de)) * 0.035;
            const k = rampa(t, t0, t0 + 0.75);
            if (k <= 0) return;
            const n = j === Math.ceil(acc - 0.0005) - 1 ? Math.min(pl.n, acc - j) : pl.n;
            torres.push({p: k >= 1 ? pl.p : curva(COFRE_SAIDA, pl.p, 2.4, k), n: n * some, cor: pl.cor});
          });
        });
      });
    });
  // o contrato terceirizado: 1 bloco = R$ 100 mil
  const kc = vis(t, T.recebeu, T.mpf);
  if (kc > 0.01) {
    solidas.push(...torre(CH26, 21 * rampa(t, T.recebeu, T.recebeu + 1.4) * kc, 2, mistura(C.ouro, tema.acento, 0.35 + 0.35 * janela(t, T.subiu, T.denuncia, 0.5))));
    solidas.push(...torre(FOLHA, 21.1 * rampa(t, T.folha, T.folha + 1.2) * kc, 2, mistura(C.ouro, tema.objetoEscuro, 0.55)));
    solidas.push(...torre(CH25, 14 * rampa(t, T.anoAntes, T.anoAntes + 1.0) * kc, 2, mistura(C.ouro, tema.objetoEscuro, 0.35)));
  }
  // MPF: 2,2 milhões para devolver (22 blocos de R$ 100 mil)
  const kf = janela(t, T.devol, T.gastar, 0.5);
  if (kf > 0.01) solidas.push(...torre(DEVOL, 22 * rampa(t, T.devol, T.devol + 1.0) * kf, 2, C.alerta));
  return {solidas, fantasmas, torres};
};

// ---------- Lugares do miolo (depois do "Agora repara", no centro da mesa) ----------
const OBRAS: {titulo: string; t: number; carro?: boolean}[] = [
  {titulo: 'POSTO DE SAÚDE', t: T.postos},
  {titulo: 'POSTO DE SAÚDE', t: T.postos + 0.3},
  {titulo: 'POSTO DE SAÚDE', t: T.postos + 0.6},
  {titulo: 'CRECHE', t: T.creche},
  {titulo: 'AMBULÂNCIA', t: T.ambul, carro: true},
  {titulo: 'AMBULÂNCIA', t: T.ambul + 0.3, carro: true},
  {titulo: 'VIATURA DA GUARDA', t: T.viatura, carro: true},
  {titulo: 'PISTA DE SKATE', t: T.skate},
  {titulo: 'PÍER DOS PESCADORES', t: T.pier},
];
const R_OBRA = 3.35;
const angObra = (i: number) => -0.62 * Math.PI + (i * 1.24 * Math.PI) / (OBRAS.length - 1);
const posObra = (i: number): V3 => [Math.sin(angObra(i)) * R_OBRA, 0, Math.cos(angObra(i)) * R_OBRA];
const GALPAO: V3 = [0, 0, -1.7];
const CH26: V3 = [1.55, 0, -0.35];
const FOLHA: V3 = [2.45, 0, -0.35];
const CH25: V3 = [0.65, 0, -0.35];
const MP: V3 = [-1.95, 0, -0.45];
const DEVOL: V3 = [-0.75, 0, 0.55];
const TCM: V3 = [2.2, 0, 1.25];
// os trabalhadores: três grupos que saem do galpão para a saúde, a escola e a assistência
const GRUPOS = [
  {destino: idx('sau'), t: T.concurso + 0.6},
  {destino: idx('edu'), t: T.concurso + 1.2},
  {destino: idx('ass'), t: T.concurso + 1.8},
];

const CASAS: [V3, number][] = [
  [[0.8, 0, 8.4], 0.2],
  [[-1.4, 0, 8.3], -0.3],
  [[8.6, 0, -1.2], -1.2],
];
const ARVORES: V3[] = [
  [-0.4, 0, 6.6],
  [1.9, 0, 7.0],
  [-2.2, 0, 7.4],
  [8.2, 0, 2.6],
  [-8.4, 0, 2.2],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  // acende quando o setor é dito em qualquer ano
  const aceso = Math.max(0, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4))));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, T.limpeza25 - 0.5, T.limpeza25 + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - T.limpeza25))} />;
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
    case 'guarda':
      return <PostoGuarda {...props} />;
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    case 'onibus':
      return sobe > 0.02 ? <Onibus tema={tema} pos={p} rotY={rot + Math.PI / 2} escala={0.32 * Math.min(1, sobe)} farol={0} /> : null;
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(janela(t, T.gastou24 + 0.3, T.ano25 - 0.2, 0.6), janela(t, T.ano25 + 0.6, T.ano26 - 0.2, 0.6), janela(t, T.ano26 + 0.6, T.repara, 0.6));
  const predioMeio = (a: number) => rampa(t, a - 0.2, a + 0.6);
  const mpK = predioMeio(T.mp);
  const trocaMPF = rampa(t, T.mpf, T.mpf + 0.4);
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

      <PilhasDinheiro pilhas={solidas} max={7000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={1000} opacidade={0.3} largura={1.12} />

      {/* os 15 prédios: sobem na primeira vez que o setor é dito e ficam até o fim */}
      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* o que não saiu do papel: placas de obra prevista */}
      {OBRAS.map((o, i) => {
        const p = posObra(i);
        const sobe = rampa(t, o.t - 0.1, o.t + 0.5);
        const carimbo = rampa(t, T.nenhum + i * 0.12, T.nenhum + i * 0.12 + 0.4);
        return (
          <group key={i}>
            <PlacaObra tema={tema} pos={p} rotY={angObra(i)} escala={1.0} sobe={sobe} carimbo={carimbo} titulo={o.titulo} cor={mistura(C.alerta, tema.texto, 0.2)} />
            {o.carro ? <CarroRua tema={tema} pos={soma(p, [0, 0.06, 0])} rotY={angObra(i) + Math.PI / 2} escala={0.2 * sobe} farol={0} /> : null}
          </group>
        );
      })}

      {/* o contrato terceirizado: o galpão e a fila de trabalhadores */}
      <PredioTexto tema={tema} pos={GALPAO} sobe={predioMeio(T.enquanto)} aceso={Math.max(janela(t, T.ch, T.mp, 0.5), janela(t, T.cresce, FIM + 1, 0.5))} texto="CH SERVIÇOS" tipo="galpao" escala={0.78} />
      {GRUPOS.map((g, gi) =>
        [0, 1, 2].map((k) => {
          const de: V3 = [GALPAO[0] - 0.4 + k * 0.4, 0, GALPAO[2] + 1.1];
          const para = noAnel(g.destino, R_PREDIO - 1.5);
          const sai0 = T.enquanto + 1.0 + gi * 0.4 + k * 0.25;
          const u = rampa(t, sai0, g.t + 0.3);
          const aparece = rampa(t, sai0 - 0.3, sai0);
          if (aparece < 0.02) return null;
          const pos: V3 = [de[0] + (para[0] - de[0]) * u, 0.06, de[2] + (para[2] - de[2]) * u];
          const rot = Math.atan2(para[0] - de[0], para[2] - de[2]);
          const andando = u > 0 && u < 1 ? 1 : 0;
          return <Trabalhador key={`${gi}${k}`} tema={tema} pos={pos} rotY={rot} passo={Math.sin(t * 7 + k) * andando} escala={0.38 * aparece} cor={mistura(tema.festa!.turquesa, tema.objeto, 0.3)} />;
        }),
      )}

      {/* Ministério Público, que troca o letreiro para MPF */}
      {trocaMPF < 0.98 ? <PredioTexto tema={tema} pos={MP} rotY={0.35} escala={0.7} sobe={mpK * (1 - trocaMPF)} aceso={janela(t, T.mp, T.mpf, 0.4)} texto="MINISTÉRIO PÚBLICO" tipo="colunas" /> : null}
      {trocaMPF > 0.02 ? <PredioTexto tema={tema} pos={MP} rotY={0.35} escala={0.7} sobe={trocaMPF} aceso={janela(t, T.mpf, T.gastar, 0.4)} texto="MPF" tipo="colunas" /> : null}

      {/* o Tribunal de Contas, na denúncia */}
      <PredioTCM tema={tema} pos={TCM} escala={0.48} sobe={predioMeio(T.denuncia)} aceso={janela(t, T.denuncia, T.mpf, 0.5)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
// olha o prédio do setor i e a torre ao lado, com a câmera do lado de dentro da mesa
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// olha uma placa de obra (as placas olham para fora da mesa)
const OLHA_OBRA = (i0: number, i1: number, perto = 1): Cam => {
  const p0 = posObra(i0);
  const p1 = posObra(i1);
  const m: V3 = [(p0[0] + p1[0]) / 2, 0.8, (p0[2] + p1[2]) / 2];
  const a = (angObra(i0) + angObra(i1)) / 2;
  return E(m, (3.2 + Math.hypot(p1[0] - p0[0], p1[2] - p0[2])) * perto, 3.4 * perto, [Math.sin(a), 0.55, Math.cos(a)]);
};
const ent24 = ANOS[0].entradas;
// câmera que para em cada prédio dos setores com dinheiro daquele ano (os setores com R$ 0 ficam para a vista geral)
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] => {
  const comValor = ents.filter((e) => !ZERADOS.includes(e.s));
  return comValor.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < comValor.length ? comValor[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), perto)],
      [segura, OLHA_SETOR(idx(e.s), perto * 0.97)],
    ];
  });
};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: abre na mesa e gira de setor em setor
  {ini: T.gastou24 - 0.3, arco: 0.06, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.falt24 + 0.6, E([0, 0, 1.4], 9.5, 7.4, [0.1, 1.15, 1])]]},
  {
    ini: ent24[0].t - 0.3,
    arco: 0.03,
    chaves: [
      ...ent24.slice(0, 10).flatMap((e, k): [number, Cam][] => {
        const prox = ent24[k + 1].t;
        const segura = Math.max(e.t + 0.2, prox - 0.55);
        return [
          [e.t - (k === 0 ? 0.3 : 0.05), OLHA_SETOR(idx(e.s))],
          [segura, OLHA_SETOR(idx(e.s), 0.97)],
        ];
      }),
      [ent24[10].t - 0.2, OLHA_SETOR(10, 1.15)],
      [ent24[11].t - 0.1, OLHA_SETOR(11.5, 1.9)],
      [ANOS[0].zero + 0.2, OLHA_SETOR(11.5, 2.0)],
    ],
  },
  {ini: ANOS[0].zero + 0.3, arco: 0.06, chaves: [[ANOS[0].zero + 0.3, VISTA_GERAL(0.1)], [T.ano25 - 0.2, VISTA_GERAL(0.2)]]},
  // 2025: abre de cima e passa de prédio em prédio, com as torres de 2024 e 2025 lado a lado
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [ANOS[1].entradas[0].t - 0.5, DE_CIMA(-0.1)]]},
  {ini: ANOS[1].entradas[0].t - 0.4, arco: 0.03, chaves: [[ANOS[1].entradas[0].t - 0.4, OLHA_SETOR(idx('edu'), 1.15)], ...passaSetores(ANOS[1].entradas, T.zero25 - 3.0, 1.15)]},
  {ini: T.zero25 - 2.9, arco: 0.06, chaves: [[T.zero25 - 2.9, DE_CIMA(-0.2)], [T.ano26 - 0.2, DE_CIMA(0.25)]]},
  // 2026: prefeitura × Câmara nos selos de entrega; depois de prédio em prédio, com as três torres
  {ini: T.ano26 - 0.1, arco: 0.04, chaves: [[T.ano26 - 0.1, OLHA_SETOR(4.5, 2.3)], [T.entrou26 - 0.2, OLHA_SETOR(4.6, 2.15)]]},
  {ini: T.entrou26 - 0.1, arco: 0.05, chaves: [[T.entrou26 - 0.1, DE_CIMA(0.2)], [ANOS[2].entradas[0].t - 0.5, DE_CIMA(0.0)]]},
  {ini: ANOS[2].entradas[0].t - 0.4, arco: 0.03, chaves: [[ANOS[2].entradas[0].t - 0.4, OLHA_SETOR(idx('edu'), 1.25)], ...passaSetores(ANOS[2].entradas, T.zero26 - 1.4, 1.25)]},
  {ini: T.zero26 - 1.3, arco: 0.06, chaves: [[T.zero26 - 1.3, DE_CIMA(-0.2)], [T.repara - 0.2, DE_CIMA(-0.25)]]},
  // o que não saiu do papel: a câmera passa pelas placas
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 0, 1.6], 10, 7, [0, 1.2, 1])],
      [T.postos + 0.2, OLHA_OBRA(0, 2)],
      [T.creche + 0.1, OLHA_OBRA(3, 3)],
      [T.ambul + 0.2, OLHA_OBRA(4, 5)],
      [T.viatura + 0.1, OLHA_OBRA(6, 6)],
      [T.skate + 0.1, OLHA_OBRA(7, 7)],
      [T.pier + 0.1, OLHA_OBRA(8, 8)],
      [T.nenhum - 0.3, E([0, 0.4, 2.0], 8.6, 6.2, [0, 1.0, 1])],
      [T.enquanto - 0.2, E([0, 0.4, 1.8], 8.6, 6.2, [0.15, 1.0, 1])],
    ],
  },
  // o contrato
  {ini: T.enquanto - 0.1, arco: 0.06, chaves: [[T.enquanto - 0.1, E([0.3, 0.8, -1.0], 7, 5.6, [0.1, 0.85, 1])], [T.folha, E([1.4, 1.3, -0.6], 5.8, 5.4, [0.3, 0.75, 1])], [T.mp - 0.2, E([1.0, 1.3, -0.6], 6.6, 5.6, [0.1, 0.8, 1])]]},
  // o MP e os trabalhadores
  {ini: T.mp - 0.1, arco: 0.05, chaves: [[T.mp - 0.1, E([-1.4, 0.9, -0.4], 6.4, 5.2, [-0.3, 0.85, 1])], [T.concurso, E([0, 0.4, -2.8], 11.5, 8, [0, 1.15, 1])], [T.continuou, E([0.8, 1.0, -0.8], 6.8, 5.4, [0.2, 0.85, 1])], [T.denuncia, E([1.8, 0.8, 0.6], 6, 5, [0.4, 0.8, 1])], [T.mpf - 0.2, E([1.9, 0.8, 0.8], 5.8, 4.8, [0.3, 0.8, 1])]]},
  // o Fundeb
  {ini: T.mpf - 0.1, arco: 0.06, chaves: [[T.mpf - 0.1, E([-1.4, 1.0, 0.0], 6, 5.2, [-0.2, 0.8, 1])], [T.gastar - 0.2, E([-1.2, 1.0, 0.1], 5.6, 5, [-0.05, 0.8, 1])]]},
  // a pergunta e o fim
  {ini: T.gastar - 0.1, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 11.5, 8.4, [0, 1.25, 1])], [T.posto - 0.1, OLHA_OBRA(0, 2, 1.25)], [T.cresce, E([0, 0.6, -0.8], 8, 6, [0.15, 1.0, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  [0, 'CANAVIEIRAS · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ MAIO'],
  [T.repara, 'O QUE NÃO SAIU DO PAPEL'],
  [T.enquanto, 'O CONTRATO'],
  [T.mp, 'O MINISTÉRIO PÚBLICO'],
  [T.mpf, 'O FUNDEB'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 0.01 ? 'R$ 4.600' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtP = (p: number) => `${p.toFixed(1).replace('.', ',').replace(/,0$/, '')}%`;
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.falt24, texto: 'GASTOU EM 2024: R$ 143,1 MILHÕES'},
    {a: T.falt24, b: ANOS[0].entradas[0].t, texto: 'FALTARAM R$ 13,3 MI · 1 DE CADA 10 REAIS', destaque: true},
    {a: T.ano25, b: T.entrou25, texto: '2025 · PAULO CARVALHO DE NOVO'},
    {a: T.entrou25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 146,8 MI · +13%'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 157,4 MILHÕES'},
    {a: T.falt25, b: ANOS[1].entradas[0].t, texto: 'FALTARAM MAIS R$ 10,6 MI · 2º ANO NO VERMELHO', destaque: true},
    {a: T.ano26, b: T.ultimo, texto: '2026 · ATÉ MAIO'},
    {a: T.ultimo, b: T.camEntregou, texto: 'PREFEITURA: ENTREGOU AO TCM SÓ ATÉ MAIO', destaque: true},
    {a: T.camEntregou, b: T.entrou26, texto: 'CÂMARA: ENTREGOU ATÉ SETEMBRO, NO PRAZO'},
    {a: T.entrou26, b: T.pagou, texto: 'ARRECADOU ATÉ MAIO: R$ 60,8 MILHÕES'},
    {a: T.pagou, b: ANOS[2].entradas[0].t, texto: 'JÁ PAGOU: R$ 56,4 MI (PREFEITURA + CÂMARA)'},
  ];
  ANOS.forEach((y, yi) => {
    const ents = y.entradas;
    ents.forEach((e, k) => {
      const prox = k + 1 < ents.length ? ents[k + 1].t : y.zero + 0.1;
      if (ZERADOS.includes(e.s) && e.s !== 'esp') return;
      const z = e.s === 'esp';
      c.push({
        a: e.t,
        b: z ? y.zero + 1.4 : prox,
        texto: z ? (yi === 0 ? 'ESPORTE: R$ 4.600 · DEFESA CIVIL E PROTEÇÃO ANIMAL: R$ 0' : yi === 1 ? 'ESPORTE, DEFESA CIVIL E PROTEÇÃO ANIMAL: R$ 0' : 'ESPORTE: R$ 0 DE NOVO') : `${yi === 2 && e.s === 'obr' ? (e.pct > 4 ? 'LIMPEZA' : 'OUTRAS OBRAS E SERVIÇOS URBANOS') : nomeDe(e.s)}: ${fmtV(e.v)} · ${fmtP(e.pct)}`,
        destaque: z,
      });
    });
  });
  c.push(
    {a: T.limpeza25, b: ANOS[1].entradas[4].t, texto: 'SÓ LIMPEZA: R$ 6,9 MI · QUASE METADE DE OBRAS E SERVIÇOS', destaque: true},
    {a: T.repara, b: T.nenhum, texto: 'ESTÃO NO ORÇAMENTO DE 2024, 2025 E 2026'},
    {a: T.nenhum, b: T.enquanto, texto: 'NAS LINHAS DELES NO ORÇAMENTO: R$ 0 GASTO ATÉ MAIO/2026', destaque: true},
    {a: T.enquanto, b: T.recebeu, texto: 'UM ÚNICO CONTRATO DE MÃO DE OBRA TERCEIRIZADA'},
    {a: T.recebeu, b: T.folha, texto: 'MAIO/2026: R$ 2,1 MI NUM MÊS SÓ'},
    {a: T.folha, b: T.anoAntes, texto: 'PRATICAMENTE A FOLHA DA SAÚDE NO MESMO MÊS', destaque: true},
    {a: T.anoAntes, b: T.mp, texto: 'MAIO/2025: R$ 1,4 MI'},
    {a: T.mp, b: T.continuou, texto: 'MP-BA, OUT/2025: RECOMENDOU SUSPENDER', destaque: true},
    {a: T.continuou, b: T.subiu, texto: 'O CONTRATO CONTINUOU'},
    {a: T.subiu, b: T.denuncia, texto: '+50% EM UM ANO', destaque: true},
    {a: T.denuncia, b: T.mpf, texto: 'DENÚNCIA NO TCM: SEM JULGAMENTO'},
    {a: T.mpf, b: T.devol, texto: 'MINISTÉRIO PÚBLICO FEDERAL'},
    {a: T.devol, b: T.gastar, texto: 'COBRA A DEVOLUÇÃO DE R$ 2,2 MI DO FUNDEB', destaque: true},
    {a: T.gastar, b: T.posto, texto: 'GASTAR NÃO É CRIME'},
    {a: T.posto, b: T.cresce, texto: 'O POSTO DE SAÚDE NÃO SAI...', destaque: true},
    {a: T.cresce, b: T.segue, texto: '...E O CONTRATO SÓ CRESCE?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA MAIO/2026 · PREFEITURA E CÂMARA · VALORES PAGOS'},
  {a: T.repara, b: T.enquanto, texto: 'FONTE: SIGA DEZ/2024, DEZ/2025 E MAI/2026 · TCM-BA'},
  {a: T.enquanto, b: T.mp, texto: 'FONTE: PCMGE056 MAIO/2025 E MAIO/2026 · TCM-BA'},
  {a: T.mp, b: T.denuncia, texto: 'FONTE: MP-BA, RECOMENDAÇÃO DE OUT/2025 (BAHIA NOTÍCIAS, 02/10/2025)'},
  {a: T.denuncia, b: T.mpf, texto: 'FONTE: TCM-BA · DECISÕES › AUDITORIA · 06/11/2026'},
  {a: T.mpf, b: T.gastar, texto: 'FONTE: MPF, 30/07/2026 (BAHIA NOTÍCIAS, 31/07/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const CS = coresSetor(tema);
  const C = coresOI(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
    });
    y.entradas.forEach((e) => {
      if (totalAno(e.s, yi) < 0.9) return;
      const i = idx(e.s);
      for (let k = 0; k <= yi; k++) {
        // no ano que está sendo falado, só o que a voz já disse (2026: primeiro a limpeza, depois limpeza + obras)
        const ditas = ANOS[k].entradas.filter((x) => x.s === e.s && (k < yi || x.t <= e.t));
        const v = ditas.reduce((acc, x) => acc + x.v, 0);
        if (v < 0.9) continue;
        const pct = ditas.reduce((acc, x) => acc + x.pct, 0);
        const qual = k === yi && e.s === 'obr' && yi === 2 ? (ditas.length === 1 ? ' · SÓ LIMPEZA' : ' · LIMPEZA + OBRAS') : '';
        r.push({a: e.t + (k === yi ? 0.9 : 0.35 + k * 0.1), b: e.t + 3.2, p: soma(posTorre(i, k), [0, altFina(totalAno(e.s, k)) + 0.35, 0]), valor: fmtV(v), sub: `${['2024', '2025', '2026 · ATÉ MAIO'][k]}${pct ? ' · ' + fmtP(pct) : ''}${qual}`, cor: coresAno(tema)[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v, LADO) + 0.3, 0]), valor: `FALTARAM ${fmtV(y.falta.v)}`, cor: C.alerta});
  });
  r.push(
    {a: T.recebeu + 1.0, b: T.mpf, p: soma(CH26, [0, altTorre(21, 2) + 0.3, 0]), valor: 'R$ 2,1 MI', sub: 'CH · MAIO/2026', cor: tema.acento},
    {a: T.folha + 0.8, b: T.mp, p: soma(FOLHA, [0.3, altTorre(21, 2) + 0.3, 0]), valor: 'R$ 2,1 MI', sub: 'FOLHA DA SAÚDE · MAIO/2026'},
    {a: T.anoAntes + 0.6, b: T.mpf, p: soma(CH25, [-0.3, altTorre(14, 2) + 0.3, 0]), valor: 'R$ 1,4 MI', sub: 'CH · MAIO/2025'},
    {a: T.devol + 0.6, b: T.gastar, p: soma(DEVOL, [0, altTorre(22, 2) + 0.3, 0]), valor: 'R$ 2,2 MI', sub: 'FUNDEB · DEVOLVER', cor: C.alerta},
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
  const chMi = t >= T.recebeu - 0.2 && t < T.gastar;
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || chMi ? (
        <div style={{opacity: chMi ? 1 : Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${chMi ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{chMi ? 'AQUI, 1 PILHA = R$ 100 MIL' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, quando('arrecadou 130'), 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
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
  // afasta as plaquinhas que encostam
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < 150 && Math.abs(rots[a].y - rots[b].y) < 62) rots[a].y = rots[b].y - 64;
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
      <OffthreadVideo src={staticFile(`${P}/mapas/canavieiras.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [
  T.falt24,
  T.falt25,
  T.pagou,
  ...ANOS.flatMap((y) => y.entradas.filter((e) => e.pct >= 2).map((e) => e.t)),
  T.nenhum,
  T.recebeu,
  T.folha,
  T.anoAntes,
  T.subiu,
  T.devol,
];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [quando('arrecadou 130')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.gastou24 + 0.2, f: 'subida', v: 0.16});
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: ZERADOS.includes(e.s) ? 0.1 : 0.18})));
  [ANOS[0].zero, T.zero25, T.zero26].forEach((t) => s.push({t, f: 'baque', v: 0.2}));
  [T.falt24, T.falt25].forEach((t) => s.push({t, f: 'baque', v: 0.22}));
  OBRAS.forEach((o) => s.push({t: o.t, f: 'tique', v: 0.12}));
  OBRAS.forEach((_, i) => s.push({t: T.nenhum + i * 0.12 + 0.35, f: i === 0 ? 'impacto' : 'tique', v: i === 0 ? 0.2 : 0.1}));
  s.push({t: T.recebeu, f: 'subida', v: 0.18});
  [T.folha, T.anoAntes, T.devol].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.mp + 0.4, f: 'impacto', v: 0.18});
  s.push({t: T.subiu, f: 'baque', v: 0.2});
  s.push({t: T.cresce, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6.5, 10, 12.5, T.gastou24 + 0.9, T.falt24 + 0.7,
  ...ANOS[0].entradas.slice(0, 10).map((e) => e.t + 0.8),
  ANOS[0].zero + 0.6, T.ano25 + 1.2, T.falt25 + 0.7, ANOS[1].entradas[0].t + 0.8, T.limpeza25 + 0.6, ANOS[1].entradas[6].t + 0.6, T.zero25 + 0.5,
  T.ano26 + 0.8, T.camEntregou + 0.8, T.pagou + 0.6, ANOS[2].entradas[0].t + 0.8, ANOS[2].entradas[5].t + 0.6, T.zero26 + 0.5,
  T.repara + 0.8, T.ambul + 0.6, T.pier + 0.6, T.nenhum + 1.4, T.enquanto + 1.5, T.recebeu + 1.4, T.folha + 1.2, T.anoAntes + 1.0,
  T.mp + 0.8, T.concurso + 1.5, T.subiu + 0.5, T.denuncia + 0.8, T.mpf + 0.6, T.devol + 1.2, T.gastar + 0.6, T.posto + 0.4, T.cresce + 0.5, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoCanavieiras: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Canavieiras" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Faltou', 'dinheiro.', 'O contrato', 'cresceu.'];
export const CapaOrcamentoCanavieiras: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · CANAVIEIRAS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
