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
import {CasaMini, CofreFGTS, ArvoreRedonda} from '../../pecas';
import {BancoDivida, CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 071. orçamento de Itamaraju (BA) (perfil @eumagnoleite, série Magno Explica).
// MOLDE: 067 Barreiras (que veio do 035 Paratinga pelo 065 LEM) + Teixeira de Freitas aprovado (folha por setor). Abertura pela RECEITA
// (regras 24, 24b e 25b): o Kit Mapas voa até Itamaraju (projetos/071.../mapas/itamaraju.mp4) enquanto a voz diz o que a prefeitura
// arrecadou em 2024, 2025 e 2026 (chips em cima do mapa) e "eu abri as contas"; nada de setor ou achado na abertura. Depois a história
// em ordem: 2024 → 2025 → 2026 → achados (a DÍVIDA, os FESTEJOS x ASSISTÊNCIA e a CÂMARA x ASSISTÊNCIA) → Tribunal → pergunta.
// Maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele. Cidade média (R$ 230 a 300 milhões por ano):
// 1 MOEDA = R$ 500 MIL e 1 PILHA = R$ 5 MI. Quando a voz fala um setor, as pilhas voam para a casinha do setor, na ORDEM DA FALA.
// FOLHA DOCUMENTO (regras 28b, 28c, 29, 29b; src/videos/comum/CartaoDocumento.tsx): a receita do ano com todos os itens e, nos
// setores, UMA FOLHA POR SETOR com o destino do dinheiro (subfunção ou ação), somando o total dito; fixa no lado DIREITO.
// Sem porcentagem, sem nome de gestor e sem nome de empresa. SÓ DADOS DE ITAMARAJU, do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 167.27; // narração v3 (gastou = liquidado; sem a tarifa, regra 60): Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,137, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '071. orçamento de itamaraju';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  v24: quando('Itamaraju arrecadou 284'),
  v25: quando('304 em 2025'),
  v26: quando('231 milhoes e 900 ate setembro'),
  abri: quando('Eu abri'),
  comeca: quando('Comeca em 2024'),
  gastou24: quando('Gastou 297'),
  amais24: quando('Foram 12'),
  ano25: quando('No ano seguinte'),
  arrec25: quando('Arrecadou 304'),
  gastou25: quando('Gastou 285'),
  sobrou25: quando('Sobraram 19'),
  ano26: quando('E em 2026 ate setembro'),
  arrec26: quando('arrecadou 231 milhoes e 900'),
  gastou26: quando('Gastou 236'),
  amais26: quando('De novo 4'),
  empenhou: quando('E ja empenhou'),
  repara: quando('Agora repara na divida'),
  divida: quando('Agora repara na divida'),
  comecou: quando('comecou o ano em 147'),
  terminou: quando('terminou em 241'),
  inss: quando('A maior parte e o parcelamento'),
  ganhou: quando('que ganhou mais 102'),
  naodizem: quando('As contas nao dizem'),
  festa: quando('E a festa'),
  previa: quando('previa 3'),
  gastou63: quando('Gastou 6 milhoes e 300'),
  maiorparte: quando('a maior parte com dinheiro'),
  maisass: quando('Mais que toda a assistencia'),
  de2026: quando('Em 2026 ate setembro os festejos'),
  dobro: quando('E o dobro'),
  dezvezes: quando('dez vezes a agricultura'),
  terceira: quando('Em 2025 a Camara custou'),
  camara: quando('a Camara custou'),
  quasedobro: quando('Quase o dobro'),
  tribunal: quando('No Tribunal de Contas'),
  multa: quando('rendeu multa'),
  mp: quando('O de 2026 tem questionamento'),
  semjul: quando('sem julgamento'),
  naoecrime: quando('Festa nao e crime'),
  mas: quando('Mas se em dois'),
  precisa: quando('a festa precisa'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 11 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | TipoPredio;
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
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'casinha', texto: 'MEIO AMBIENTE'},
];
const R_PREDIO = 7.45;
const ELEVA = 0.09; // regra 26: a maquete inteira sobe 9 cm (nada afunda no tampo)

const ANGS: number[] = SETORES.map((_, i) => 0.11 * Math.PI + i * 0.162 * Math.PI);
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
const ORDEM = ['edu', 'sau', 'adm', 'obr', 'cam', 'div', 'cul', 'ass', 'agr', 'esp', 'mam'];
// cada setor é achado pela frase EXATA do ano (nome + número), porque os nomes se repetem nos três anos
const lista = (frases: string[], v: number[]): Entrada[] => ORDEM.map((s, k) => ({s, t: quando(frases[k]), v: v[k]}));
const ANOS: Ano[] = [
  // 2024 (LIQUIDADO, regra 32): arrecadou 284,1 e gastou 297,0: 12,9 mi a mais
  {ini: T.gastou24, fim: T.ano25, gastou: T.gastou24, total: 297.02, rotulo: '2024', falta: {t: T.amais24, v: 12.913, txt: 'A MAIS', rot: 'A MAIS: R$ 12,9 MI'},
    entradas: lista(['Educacao 104', 'Saude 60', 'Administracao 16 milhoes Obras', 'Obras e servicos urbanos 76', 'Camara de Vereadores 7', 'Dividas 10', 'Cultura e festas 6', 'Assistencia social 7', 'Agricultura 1 milhao e 600', 'Esporte 2 milhoes e 200 Meio', 'Meio ambiente 298'],
      [104.588, 60.277, 15.958, 76.799, 7.764, 10.908, 6.034, 7.139, 1.601, 2.179, 0.298])},
  // 2025 (LIQUIDADO): arrecadou 304,4 e gastou 285,0: sobraram 19,4 mi
  {ini: T.ano25 + 0.3, fim: T.ano26, gastou: T.gastou25, total: 284.96, rotulo: '2025', falta: {t: T.sobrou25, v: 19.391, txt: 'SOBRA', sobra: true, rot: 'SOBROU: R$ 19,4 MI'},
    entradas: lista(['Educacao 127', 'Saude 61', 'Administracao 16 milhoes e 400', 'Obras e servicos urbanos 33', 'Camara 9', 'Dividas 18', 'Cultura e festas 7', 'Assistencia social 4 milhoes e 800', 'Agricultura 1 milhao e 900', 'Esporte 622', 'Meio ambiente 669'],
      [127.935, 61.107, 16.356, 33.852, 9.381, 18.246, 7.343, 4.775, 1.863, 0.622, 0.669])},
  // 2026 (Prefeitura + Câmara, liquidado até setembro): arrecadou 231,9, gastou 236,7 (4,8 a mais) e empenhou 253,5
  {ini: T.ano26 + 0.3, fim: T.repara, gastou: T.gastou26, total: 236.73, rotulo: '2026 · ATÉ SET', falta: {t: T.amais26, v: 4.802, txt: 'A MAIS', rot: 'A MAIS: R$ 4,8 MI'},
    entradas: lista(['Educacao 96', 'Saude 48', 'Administracao 17', 'Obras e servicos urbanos 34 milhoes e 100', 'Camara 7 milhoes e 300', 'Dividas 12', 'Cultura e festas 10', 'Assistencia social 4 milhoes e 900', 'Agricultura 951', 'Esporte 2 milhoes e 200 Meio ambiente 573', 'Meio ambiente 573'],
      [96.916, 48.66, 17.389, 34.108, 7.3, 12.224, 10.504, 4.863, 0.951, 2.248, 0.573])},
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? T.ano25]));
const entradaDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id);
const valorDe = (id: string, yi: number) => entradaDe(id, yi)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ SET'];

// ---------- As folhas (receita do ano e uma por setor) entram DEPOIS do render, coladas pela tools/lista_pdf (molde Ubaitaba) ----------


// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;

const ANDAR = 0.75;
const PASSO_T = 0.38;
const torre = (c: V3, n: number, lado: number, cor: string | ((j: number) => string), passo = PASSO_T): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * passo, c[1] + andar * ANDAR, c[2] + z * passo], n: Math.min(1, n - j), cor: typeof cor === 'string' ? cor : cor(j)});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;
const LADO = 3;
const ESCALA = 5; // 1 moeda = R$ 500 mil; 1 pilha = R$ 5 milhões (R$ 230 a 300 milhões por ano)
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre (3 voltas: 93 lugares; cada ano usa de 38 a 56 pilhas) ----------
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

// ---------- Os achados no miolo ----------
const ZA = 0.2;
// A DÍVIDA (Anexo 16 de 2025; 1 pilha = R$ 10 mi): começou 147,4, terminou 241,1 (208,6 é o parcelamento do INSS, que ganhou 102,8 em 2025)
const ESC_D = 10;
const DIV_CENTRO: V3 = [0, 0, ZA];
const DIV = {ini: {p: [-1.1, 0, ZA] as V3, v: 147.416}, fim: {p: [1.1, 0, ZA] as V3, v: 241.071}};
const INSS = 208.587;
const INSS_NOVO = 102.803;
// OS FESTEJOS (1 pilha = R$ 1 mi): 2025 previsto 3,35, gasto 6,27 e toda a assistência 4,78; 2026 até setembro: 9,76 x 4,86 x agricultura 0,95
const ESC_F = 1;
const LADO_F = 2;
const FES_CENTRO: V3 = [0, 0, 1.9];
const FES = {prev: {p: [-2.3, 0, 1.9] as V3, v: 3.347}, g25: {p: [-1.38, 0, 1.9] as V3, v: 6.274}, a25: {p: [-0.46, 0, 1.9] as V3, v: 4.777}, g26: {p: [0.46, 0, 1.9] as V3, v: 9.76}, a26: {p: [1.38, 0, 1.9] as V3, v: 4.863}, agr: {p: [2.3, 0, 1.9] as V3, v: 0.951}};
// A CÂMARA x ASSISTÊNCIA (2025; 1 pilha = R$ 1 mi), na gaveta da dívida (que já afundou)
const CAM_CENTRO: V3 = [0, 0, ZA];
const CAM = {cam: {p: [-0.8, 0, ZA] as V3, v: 9.381}, ass: {p: [0.8, 0, ZA] as V3, v: 4.777}};
// na pergunta: a dívida volta no "Mas se em dois", afunda no "a festa precisa" e volta no plano aberto final
const DIV_VIS = (t: number) => vis(t, T.repara - 0.1, T.festa - 0.25) + vis(t, T.mas - 0.3, T.precisa - 0.3);
const FES_VIS = (t: number) => vis(t, T.festa - 0.1, T.camara - 0.3) + vis(t, T.precisa - 0.35, FIM + 2);
const CAM_VIS = (t: number) => vis(t, T.camara - 0.4, T.tribunal - 0.15);
const TCM_POS: V3 = [0, 0, -2.6];
const PASTA_A: V3 = [-2.4, 0, -1.2];
const PASTA_B: V3 = [2.4, 0, -1.2];
const TCM_VIS = (t: number) => vis(t, T.tribunal - 0.2, T.naoecrime - 0.1);

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
    // na frente do cofre: torre-fantasma do que sobrou em 2024 e torre vermelha do déficit de 2025
    ANOS.forEach((y) => {
      if (y.falta.v <= 0) return;
      const k = janela(t, y.falta.t, y.entradas[0].t - 0.3, 0.5) * some;
      if (k <= 0.01) return;
      const n = Math.max(0.15, y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k;
      if (y.falta.sobra) fantasmas.push(...torre(FALTA_POS, n, LADO, tema.objetoClaro));
      else solidas.push(...torre(FALTA_POS, n, LADO, C.alerta));
    });
  }
  const final = t >= T.naoecrime - 0.1;
  const cresce = (a: number, d = 0.9) => (final ? 1 : rampa(t, a, a + d));
  // a dívida: início (fantasma) e fim (vermelho; a parte do INSS em vermelho cheio depois do "INSS", o resto clareia)
  const dv = DIV_VIS(t);
  if (dv > 0.01) {
    const ki = cresce(T.comecou + 0.4) * dv;
    if (ki > 0.01) fantasmas.push(...torre(DIV.ini.p, (DIV.ini.v / ESC_D) * ki, LADO_F, tema.objetoClaro));
    const kf = cresce(T.terminou + 0.4) * dv;
    const nInss = INSS / ESC_D;
    const corFim = (j: number) => (t >= T.inss + 0.3 && j >= Math.ceil(nInss - 0.0005) ? mistura(C.alerta, tema.objetoClaro, 0.55) : C.alerta);
    if (kf > 0.01) solidas.push(...torre(DIV.fim.p, (DIV.fim.v / ESC_D) * kf, LADO_F, corFim));
  }
  // os festejos, a assistência e a agricultura
  const fx = FES_VIS(t);
  if (fx > 0.01) {
    const kp = cresce(T.previa + 0.4) * fx;
    if (kp > 0.01) fantasmas.push(...torre(FES.prev.p, (FES.prev.v / ESC_F) * kp, LADO_F, tema.objetoClaro));
    const k1 = cresce(T.gastou63 + 0.3) * fx;
    if (k1 > 0.01) solidas.push(...torre(FES.g25.p, (FES.g25.v / ESC_F) * k1, LADO_F, CA[1]));
    const k2 = cresce(T.maisass + 0.3) * fx;
    if (k2 > 0.01) solidas.push(...torre(FES.a25.p, (FES.a25.v / ESC_F) * k2, LADO_F, C.grama));
    const k3 = cresce(T.de2026 + 0.6) * fx;
    if (k3 > 0.01) solidas.push(...torre(FES.g26.p, (FES.g26.v / ESC_F) * k3, LADO_F, CA[2]));
    const k4 = cresce(T.dobro + 0.3) * fx;
    if (k4 > 0.01) solidas.push(...torre(FES.a26.p, (FES.a26.v / ESC_F) * k4, LADO_F, C.grama));
    const k5 = cresce(T.dezvezes + 0.3) * fx;
    if (k5 > 0.01) solidas.push(...torre(FES.agr.p, Math.max(0.3, FES.agr.v / ESC_F) * k5, LADO_F, mistura(C.grama, C.ouro, 0.5)));
  }
  // a Câmara e a assistência (2025)
  const cx = CAM_VIS(t);
  if (cx > 0.01) {
    const kc = cresce(T.camara + 0.1) * cx;
    if (kc > 0.01) solidas.push(...torre(CAM.cam.p, (CAM.cam.v / ESC_F) * kc, LADO_F, CA[1]));
    const ka = cresce(T.quasedobro + 0.3) * cx;
    if (ka > 0.01) solidas.push(...torre(CAM.ass.p, (CAM.ass.v / ESC_F) * ka, LADO_F, C.grama));
  }
  return {solidas, fantasmas, torres};
};

// regra 26: casinhas e árvores decorativas DENTRO da mesa (no vão entre a Educação e o Meio ambiente)
const CASAS: [V3, number][] = [
  [[0.9, 0, 7.2], 0.2],
  [[-2.6, 0, 6.8], -0.4],
];
const ARVORES: V3[] = [
  [-0.9, 0, 7.35],
  [-3.9, 0, 6.0],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  const aceso = Math.max(0, ...ditas);
  const e = 0.47;
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
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.comeca - 0.1, T.comeca + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const dv = DIV_VIS(t);
  const fx = FES_VIS(t);
  const cx = CAM_VIS(t);
  const tv = TCM_VIS(t);
  const carimbo = rampa(t, T.semjul + 0.1, T.semjul + 0.5);
  const carimboMulta = rampa(t, T.multa + 0.1, T.multa + 0.5);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      <group position={[0, ELEVA, 0]}>
        {CASAS.map(([p, r], i) => (
          <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
        ))}
        {ARVORES.map((p, i) => (
          <ArvoreRedonda key={i} tema={tema} pos={p} r={0.5} cresce={0.7} />
        ))}

        {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

        <PilhasDinheiro pilhas={solidas} max={3000} />
        <PilhasDinheiro pilhas={torres} max={3000} largura={0.75} />
        <PilhasDinheiro pilhas={fantasmas} max={1200} opacidade={0.28} largura={1.06} />

        {SETORES.map((s, i) => (
          <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
        ))}

        {/* os achados: a gaveta da dívida, a dos festejos e a da Câmara */}
        {dv > 0.01 ? <BaseGaveta tema={tema} pos={DIV_CENTRO} sobe={dv} larg={4.6} texto="A DÍVIDA · 2025" aceso={Math.max(janela(t, T.divida, T.festa, 0.4), janela(t, T.mas, T.precisa, 0.4))} /> : null}
        {fx > 0.01 ? <BaseGaveta tema={tema} pos={FES_CENTRO} sobe={fx} larg={5.6} texto="FESTEJOS x ASSISTÊNCIA" aceso={Math.max(janela(t, T.festa, T.terceira, 0.4), janela(t, T.precisa, FIM, 0.4))} /> : null}
        {cx > 0.01 ? <BaseGaveta tema={tema} pos={DIV_CENTRO} sobe={cx} larg={3.6} texto="CÂMARA x ASSISTÊNCIA" aceso={janela(t, T.camara, T.tribunal, 0.4)} /> : null}

        {/* o Tribunal e as duas pastas do São João */}
        <PredioTCM tema={tema} pos={TCM_POS} escala={0.55} sobe={tv} aceso={janela(t, T.tribunal, T.naoecrime, 0.5)} />
        <PastaProcesso tema={tema} pos={PASTA_A} rotY={0.25} escala={0.75} sobe={vis(t, T.tribunal + 0.4, T.naoecrime - 0.1)} titulo="SÃO JOÃO 2025" valor="ESTRUTURA"
          carimbo={carimboMulta} textoCarimbo="MULTA AO GESTOR" corCarimbo={C.alerta} aceso={janela(t, T.tribunal, T.mp, 0.4)} />
        <PastaProcesso tema={tema} pos={PASTA_B} rotY={-0.25} escala={0.75} sobe={vis(t, T.mp - 0.1, T.naoecrime - 0.1)} titulo="SÃO JOÃO 2026" valor="MIN. PÚBLICO"
          carimbo={carimbo} textoCarimbo="SEM JULGAMENTO" corCarimbo={C.ouro} aceso={janela(t, T.mp, T.naoecrime, 0.4)} />
      </group>
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
// com a folha no lado direito, os planos do cofre e das casinhas põem o assunto no lado esquerdo (alvo deslocado para a direita da câmera)
const DE_CIMA = (dx = 0) => E([1.6, 0, 0], 14, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([1.5, 0.4, 1.3], 10.4, 7.6, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(Math.max(0, Math.min(SETORES.length - 1, i)));
  // centro entre a casinha e as torres (que ficam à esquerda dela) + 1,0 para a direita da câmera (a folha de 300 px fica à direita)
  const lado = 0.7 - 1.0 * perto;
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * lado, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * lado];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 1.4, -Math.cos(a) * 0.85]);
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
// achados no miolo: câmera alta (dir y 2,8) para o fundo ser a mesa e nada ficar atrás do cabeçalho
const PM = (c: V3, larg: number, h: number, dx = 0, el = 3.4): Cam => E(soma(c, [0, h * 0.5, 0]), larg, Math.max(larg * 1.15, h * 1.25), [dx, el, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre (a receita do ano na folha), a pilha do ano e a torre vermelha do déficit; depois de casinha em casinha
  {ini: T.comeca - 0.3, arco: 0.05, chaves: [[T.comeca - 0.3, DE_CIMA(0.1)], [T.gastou24 + 0.2, COFRE(0.03)], [T.amais24 + 0.8, COFRE(0.06)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0, 1.15)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde e a torre-fantasma da sobra, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [T.sobrou25 + 0.8, COFRE(0.08)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.25)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026: o cofre ganha a pilha rosa e a torre vermelha dos 4,8 a mais
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [T.empenhou + 0.8, COFRE(0.08)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.3)], ...passaSetores(Y2.entradas, T.repara - 0.2, 1.2)]},
  // 1º achado: a dívida, as duas torres
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 0, 0], 13, 11, [0.1, 2.0, 1])],
      [T.comecou - 0.2, PM(soma(DIV_CENTRO, [-0.6, 0, 0]), 4.2, 4.0, -0.04, 1.5)],
      [T.terminou + 0.2, PM(DIV_CENTRO, 5.0, 5.6, -0.02, 1.5)],
      [T.inss + 0.2, PM(DIV_CENTRO, 5.0, 5.6, 0.02, 1.5)],
      [T.festa - 0.3, PM(DIV_CENTRO, 5.0, 5.6, 0.04, 1.5)],
    ],
  },
  // 2º achado: os festejos, a assistência social e a agricultura
  {
    ini: T.festa - 0.1,
    arco: 0.03,
    chaves: [
      [T.festa - 0.1, PM(FES_CENTRO, 6.2, 2.4, -0.02, 1.6)],
      [T.previa - 0.15, PM(soma(FES_CENTRO, [-1.4, 0, 0]), 3.4, 2.2, -0.04, 1.6)],
      [T.maisass + 0.2, PM(soma(FES_CENTRO, [-1.4, 0, 0]), 3.4, 2.2, -0.02, 1.6)],
      [T.de2026 + 0.1, PM(soma(FES_CENTRO, [0.9, 0, 0]), 3.6, 2.8, 0, 1.6)],
      [T.dezvezes + 0.1, PM(soma(FES_CENTRO, [0.9, 0, 0]), 3.8, 2.8, 0.02, 1.6)],
      [T.camara - 0.5, PM(soma(FES_CENTRO, [0.9, 0, 0]), 3.8, 2.8, 0.03, 1.6)],
    ],
  },
  // 3º achado: a Câmara e a assistência social (2025)
  {
    ini: T.camara - 0.4,
    arco: 0.03,
    chaves: [
      [T.camara - 0.4, PM(CAM_CENTRO, 3.6, 2.8, -0.03, 1.6)],
      [T.tribunal - 0.3, PM(CAM_CENTRO, 3.4, 2.8, 0.03, 1.6)],
    ],
  },
  // o Tribunal e as duas pastas do São João
  {
    ini: T.tribunal - 0.2,
    arco: 0.02,
    chaves: [
      [T.tribunal - 0.2, E(soma(TCM_POS, [-0.8, 0.7, 1.0]), 4.4, 3.4, [-0.05, 0.75, 1])],
      [T.multa - 0.1, E(soma(PASTA_A, [0, 0.5, 0]), 2.6, 2.2, [-0.05, 0.7, 1])],
      [T.mp - 0.45, E(soma(PASTA_A, [0.1, 0.5, 0]), 2.6, 2.2, [-0.02, 0.7, 1])],
      [T.mp - 0.2, E(soma(PASTA_B, [0, 0.5, 0]), 2.6, 2.2, [0.05, 0.7, 1])],
      [T.semjul - 0.2, E(soma(TCM_POS, [0, 0.6, 1.2]), 6.4, 3.8, [0, 0.8, 1])],
      [T.naoecrime - 0.3, E(soma(TCM_POS, [0.3, 0.6, 1.2]), 6.2, 3.8, [0.05, 0.8, 1])],
    ],
  },
  // a pergunta: a mesa, a dívida, os festejos e de novo a mesa inteira
  {
    ini: T.naoecrime - 0.1,
    arco: 0.04,
    chaves: [
      [T.naoecrime - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])],
      [T.mas + 0.2, PM(DIV_CENTRO, 5.0, 5.6, 0.02, 1.5)],
      [T.precisa - 0.45, PM(DIV_CENTRO, 4.8, 5.6, 0.03, 1.5)],
      [T.precisa - 0.1, PM(soma(FES_CENTRO, [0.9, 0, 0]), 3.8, 2.8, 0, 1.6)],
      [T.segue - 0.1, PM(soma(FES_CENTRO, [0.9, 0, 0]), 3.8, 2.8, 0.03, 1.6)],
      [T.segue + 0.9, E([0, 1.0, 1.0], 11.0, 7.6, [-0.1, 1.4, 1])],
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
  [0, 'ITAMARAJU'],
  [T.comeca, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ SETEMBRO'],
  [T.repara, '1º ACHADO · A DÍVIDA'],
  [T.festa, '2º ACHADO · OS FESTEJOS'],
  [T.terceira, '3º ACHADO · A CÂMARA'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.naoecrime, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtE = (e?: Entrada) => (e ? e.rot ?? fmtV(e.v) : 'R$ 0');
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.comeca, b: T.gastou24, texto: '2024'},
    {a: T.gastou24 + 0.2, b: T.amais24, texto: 'GASTOU (LIQUIDADO) EM 2024: R$ 297 MI'},
    {a: T.amais24, b: Y0.entradas[0].t, texto: 'R$ 12,9 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano25, b: T.arrec25 + 0.2, texto: '2025'},
    {a: T.arrec25 + 0.2, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 304,4 MI'},
    {a: T.gastou25, b: T.sobrou25, texto: 'GASTOU (LIQUIDADO) EM 2025: R$ 285 MI'},
    {a: T.sobrou25, b: Y1.entradas[0].t, texto: 'SOBROU: R$ 19,4 MI'},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ SETEMBRO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ SETEMBRO: R$ 231,9 MI'},
    {a: T.gastou26, b: T.amais26, texto: 'GASTOU ATÉ SETEMBRO: R$ 236,7 MI'},
    {a: T.amais26, b: T.empenhou, texto: 'DE NOVO: R$ 4,8 MI A MAIS', destaque: true},
    {a: T.empenhou, b: Y2.entradas[0].t, texto: 'EMPENHOU (RESERVOU PARA PAGAR): R$ 253,5 MI'},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtE(e)}`});
    });
  });
  c.push(
    {a: T.repara, b: T.comecou, texto: 'AGORA, REPARA NA DÍVIDA'},
    {a: T.comecou, b: T.terminou, texto: 'A DÍVIDA COMEÇOU 2025 EM R$ 147,4 MI'},
    {a: T.terminou, b: T.inss, texto: 'E TERMINOU EM R$ 241,1 MI', destaque: true},
    {a: T.inss, b: T.ganhou, texto: 'PARCELAMENTO COM O INSS: R$ 208,6 MI'},
    {a: T.ganhou, b: T.naodizem, texto: 'SÓ EM 2025: MAIS R$ 102,8 MI NO PARCELAMENTO', destaque: true},
    {a: T.naodizem, b: T.festa, texto: 'AS CONTAS NÃO DIZEM DE QUE ANOS É A DÍVIDA'},
    {a: T.festa, b: T.previa, texto: 'E A FESTA'},
    {a: T.previa, b: T.gastou63, texto: 'FESTEJOS 2025: PREVISTO R$ 3,3 MI'},
    {a: T.gastou63, b: T.maisass, texto: 'GASTO: R$ 6,3 MI (R$ 5,5 MI DA PREFEITURA)', destaque: true},
    {a: T.maisass, b: T.de2026, texto: 'MAIS QUE TODA A ASSISTÊNCIA SOCIAL (R$ 4,8 MI)', destaque: true},
    {a: T.de2026, b: T.dobro, texto: '2026, ATÉ SETEMBRO: FESTEJOS R$ 9,8 MI'},
    {a: T.dobro, b: T.dezvezes, texto: 'O DOBRO DA ASSISTÊNCIA SOCIAL (R$ 4,9 MI)', destaque: true},
    {a: T.dezvezes, b: T.terceira, texto: 'DEZ VEZES A AGRICULTURA (R$ 951 MIL)', destaque: true},
    {a: T.terceira, b: T.quasedobro, texto: 'A CÂMARA CUSTOU R$ 9,4 MI EM 2025'},
    {a: T.quasedobro, b: T.tribunal, texto: 'QUASE O DOBRO DA ASSISTÊNCIA (R$ 4,8 MI)', destaque: true},
    {a: T.tribunal, b: T.multa, texto: 'SÃO JOÃO 2025: LICITAÇÃO DA ESTRUTURA'},
    {a: T.multa, b: T.mp, texto: 'TCM: MULTA DE R$ 2 MIL AO GESTOR', destaque: true},
    {a: T.mp, b: T.semjul, texto: 'MINISTÉRIO PÚBLICO: DECORAÇÃO DO SÃO JOÃO 2026'},
    {a: T.semjul, b: T.naoecrime, texto: 'SEM JULGAMENTO AINDA', destaque: true},
    {a: T.naoecrime, b: T.mas, texto: 'FESTA NÃO É CRIME.'},
    {a: T.mas, b: T.precisa, texto: 'GASTOU MAIS DO QUE ARRECADOU EM 2024 E 2026'},
    {a: T.precisa, b: T.segue, texto: 'FESTEJOS: O DOBRO DA ASSISTÊNCIA?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.comeca, b: T.ano25, texto: 'FONTE: BALANÇO 2024 E SIGA DEZ/2024 (LIQUIDADO) · TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: BALANÇO 2025 E SIGA DEZ/2025 (LIQUIDADO) · TCM-BA'},
  {a: T.ano26, b: T.repara, texto: 'FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · TCM-BA'},
  {a: T.repara, b: T.festa, texto: 'FONTE: ANEXO 16 (DÍVIDA FUNDADA) DE 2025 · TCM-BA'},
  {a: T.festa, b: T.terceira, texto: 'FONTE: ANEXO 6 E SIGA DEZ/2025 E SET/2026 (AÇÕES)'},
  {a: T.terceira, b: T.tribunal, texto: 'FONTE: PCMGE015 DEZ/2025 · PREFEITURA E CÂMARA'},
  {a: T.tribunal, b: T.naoecrime, texto: 'FONTE: TCM-BA › DECISÕES › AUDITORIA (08/11/2026)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

// RITMO (regra 20): a plaquinha do ano falado fica pelo menos 2,5 s; as de relembrar saem 0,45 s depois que a voz passa ao próximo setor
const MIN_PLACA = 2.5;
type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      const i = idx(e.s);
      const proxT = ei + 1 < y.entradas.length ? y.entradas[ei + 1].t : y.fim;
      const bVelho = ei + 1 < y.entradas.length ? proxT + 0.45 : Math.min(e.t + 3.2, y.fim + 0.3);
      const bNovo = Math.max(bVelho, e.t + 0.35 + MIN_PLACA);
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.35 : 0.3 + k * 0.1), b: k === yi ? bNovo : bVelho, p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtE(entradaDe(e.s, k)), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    const f = y.falta;
    if (f.v > 0) r.push({a: f.t + 0.4, b: Math.max(y.entradas[0].t - 0.1, f.t + 0.4 + MIN_PLACA), p: soma(FALTA_POS, [0, altTorre(Math.max(0.15, f.v / ESCALA), LADO) + 0.3, 0]), valor: f.rot ?? `${fmtV(f.v)} ${f.txt}`, sub: y.rotulo, cor: f.sobra ? undefined : C.alerta});
  });
  const topo = (c: V3, v: number, esc: number, lado: number) => soma(c, [0, altTorre(Math.max(0.35, v / esc), lado) + 0.3, 0]);
  // a dívida
  const fimD = T.festa - 0.05;
  r.push({a: T.comecou + 0.9, b: fimD, p: topo(DIV.ini.p, DIV.ini.v, ESC_D, LADO_F), valor: 'R$ 147,4 MI', sub: 'DÍVIDA · INÍCIO DE 2025'});
  r.push({a: T.terminou + 0.9, b: fimD, p: topo(DIV.fim.p, DIV.fim.v, ESC_D, LADO_F), valor: 'R$ 241,1 MI', sub: 'DÍVIDA · FIM DE 2025', cor: C.alerta});
  r.push({a: T.inss + 0.8, b: fimD, p: soma(DIV.fim.p, [1.1, altTorre(INSS / ESC_D, LADO_F) * 0.5, 0.3]), valor: 'R$ 208,6 MI', sub: 'INSS PARCELADO', cor: C.alerta});
  // os festejos (regra 20: no máximo 2 informações novas; as de 2025 saem quando a voz passa para 2026)
  const fimF = T.camara - 0.3;
  const fim25 = T.de2026 + 0.3;
  r.push({a: T.previa + 0.9, b: fim25, p: topo(FES.prev.p, FES.prev.v, ESC_F, LADO_F), valor: 'R$ 3,3 MI', sub: 'FESTEJOS 2025 · PREVISTO'});
  r.push({a: T.gastou63 + 0.7, b: fim25, p: topo(FES.g25.p, FES.g25.v, ESC_F, LADO_F), valor: 'R$ 6,3 MI', sub: 'FESTEJOS 2025 · GASTO', cor: CA[1]});
  r.push({a: T.maisass + 0.7, b: fim25, p: topo(FES.a25.p, FES.a25.v, ESC_F, LADO_F), valor: 'R$ 4,8 MI', sub: 'ASSISTÊNCIA 2025', cor: C.grama});
  r.push({a: T.de2026 + 1.0, b: fimF, p: topo(FES.g26.p, FES.g26.v, ESC_F, LADO_F), valor: 'R$ 9,8 MI', sub: 'FESTEJOS 2026 · ATÉ SET', cor: CA[2]});
  r.push({a: T.dobro + 0.7, b: fimF, p: topo(FES.a26.p, FES.a26.v, ESC_F, LADO_F), valor: 'R$ 4,9 MI', sub: 'ASSISTÊNCIA 2026', cor: C.grama});
  r.push({a: T.dezvezes, b: fimF, p: topo(FES.agr.p, Math.max(0.3, FES.agr.v), ESC_F, LADO_F), valor: 'R$ 951 MIL', sub: 'AGRICULTURA 2026'});
  // a Câmara
  const fimC = T.tribunal - 0.1;
  r.push({a: T.camara + 0.7, b: fimC, p: topo(CAM.cam.p, CAM.cam.v, ESC_F, LADO_F), valor: 'R$ 9,4 MI', sub: 'CÂMARA 2025', cor: CA[1]});
  r.push({a: T.quasedobro + 0.6, b: fimC, p: topo(CAM.ass.p, CAM.ass.v, ESC_F, LADO_F), valor: 'R$ 4,8 MI', sub: 'ASSISTÊNCIA 2025', cor: C.grama});
  // a pergunta
  r.push(
    {a: T.mas + 0.5, b: T.precisa - 0.05, p: topo(DIV.fim.p, DIV.fim.v, ESC_D, LADO_F), valor: 'R$ 241,1 MI', sub: 'DÍVIDA · FIM DE 2025', cor: C.alerta},
    {a: T.precisa + 0.4, b: T.segue + 0.8, p: topo(FES.g26.p, FES.g26.v, ESC_F, LADO_F), valor: 'R$ 9,8 MI', sub: 'FESTEJOS 2026', cor: CA[2]},
    {a: T.precisa + 0.6, b: T.segue + 0.8, p: topo(FES.a26.p, FES.a26.v, ESC_F, LADO_F), valor: 'R$ 4,9 MI', sub: 'ASSISTÊNCIA 2026', cor: C.grama},
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

const noMapa = (t: number) => t < T.comeca;
const soMapa = (t: number) => t < T.comeca - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.comeca) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const mDiv = vis(t, T.repara + 0.2, T.festa - 0.1) + vis(t, T.mas - 0.2, T.precisa - 0.1);
  const mFes = vis(t, T.festa, T.tribunal - 0.2) + vis(t, T.precisa - 0.1, FIM + 1);
  const escalaTxt = mDiv > 0.01 ? 'AQUI, 1 PILHA = R$ 10 MI' : mFes > 0.01 ? 'AQUI, 1 PILHA = R$ 1 MI' : '1 MOEDA = R$ 500 MIL · 1 PILHA = R$ 5 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026';
  const escK = Math.max(placarK, mDiv, mFes);
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
        <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${mDiv + mFes > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: escalaTxt.length > 52 ? 14 : 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escalaTxt}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    // abertura (regras 24b e 25b): só o que Itamaraju arrecadou, um chip por ano na hora da fala, um embaixo do outro
    const sai = 1 - rampa(t, T.comeca - 0.5, T.comeca - 0.1);
    const ks = [T.v24 + 0.5, T.v25 + 0.4, T.v26 + 0.4].map((a) => entra(t, a, 0.45) * sai);
    const txt = ['2024: ARRECADOU R$ 284,1 MI', '2025: R$ 304,4 MI', '2026, ATÉ SETEMBRO: R$ 231,9 MI'];
    const kf = Math.min(entra(t, T.v24 + 0.5, 0.45), sai);
    return (
      <>
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 1060, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          {ks.map((k, i) => (k > 0.01 ? <Chip key={i} tema={tema} texto={txt[i]} k={k} destaque={i === 0} tam={i === 0 ? 30 : 26} /> : null))}
        </div>
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 600, opacity: kf}}>
          <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 16, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇOS 2024 E 2025 · SIGA SET/2026 · TCM-BA</div>
        </div>
      </>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  // com a folha na tela (lado direito), as plaquinhas ficam à esquerda dela
  // regra 28c: com a folha na tela (canto direito), a plaquinha inteira fica à esquerda dela (borda direita ≤ folha − 16 px)
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
  const xMax = (_r: Rot) => SEGURO.botoesX - 90;
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(xMax(r), pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // cada plaquinha procura um lugar livre: primeiro acima, depois abaixo (nunca em cima do chip, y >= 700)
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < (o.r.sub || rots[a].r.sub ? 86 : 60));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-90, 90, -180, 180, -270, 270, 360].map((d) => y0 + d).filter((y) => y >= 700 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  // ★ revisão (regra 14): nos achados a câmera alta mostra a borda da mesa atrás da marca e da pílula; uma faixa escura suave
  // atrás do cabeçalho deixa o texto limpo (entra em 0,5 s)
  const faixa = rampa(t, T.repara - 0.2, T.repara + 0.3);
  return (
    <>
      {faixa > 0.01 ? <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 600, opacity: faixa, background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} 440px, ${tema.fundo}00 600px)`}} /> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/itamaraju.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número forte ----------
const SOQUINHOS = [T.amais24, T.amais26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 50).map((e) => e.t)), T.terminou, T.ganhou, T.gastou63, T.maisass, T.dobro, T.quasedobro, T.multa];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  [T.v24, T.v25, T.v26].forEach((t) => s.push({t: t + 0.5, f: 'pop', v: 0.18}));
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  ANOS.forEach((y) => (y.falta.v > 0 ? s.push({t: y.falta.t + 0.2, f: y.falta.sobra ? 'ding' : 'baque', v: 0.18}) : null));
  // a folha documento: um "tique" de papel quando entra
  [T.comeca, T.arrec25, T.arrec26].forEach((t) => s.push({t: t + 0.2, f: 'tique', v: 0.1})); // a folha de receita do ano entra aqui
  [T.comecou, T.previa, T.de2026, T.camara, T.tribunal, T.mp].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.16}));
  // ★ melhoria (atenção): subida na torre do fim de 2025 e impacto no "ganhou mais 102,8"; subida no gasto dos festejos, impacto no "mais que toda a assistência" e no "o dobro"; baque na multa
  s.push({t: T.terminou + 0.4, f: 'subida', v: 0.16}, {t: T.ganhou + 0.3, f: 'impacto', v: 0.15}, {t: T.gastou63 + 0.2, f: 'subida', v: 0.15}, {t: T.maisass + 0.1, f: 'impacto', v: 0.15}, {t: T.dobro + 0.1, f: 'impacto', v: 0.14}, {t: T.multa + 0.3, f: 'baque', v: 0.13}, {t: T.semjul + 0.3, f: 'tique', v: 0.12});
  s.push({t: T.precisa + 0.2, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão em TODAS as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.6, 1.8, 3.0, 4.4, 6.6, 9.0, 10.4, T.comeca + 0.8, T.gastou24 + 0.9, T.amais24 + 1.0,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 0.6, T.arrec25 + 1.0, T.gastou25 + 0.9, T.sobrou25 + 1.0, ...Y1.entradas.map((e) => e.t + 0.9),
  T.ano26 + 1.0, T.arrec26 + 1.2, T.gastou26 + 0.9, T.amais26 + 1.0, T.empenhou + 1.2, ...Y2.entradas.map((e) => e.t + 0.9),
  T.repara + 0.4, T.comecou + 1.4, T.terminou + 1.4, T.inss + 1.4, T.ganhou + 1.2, T.naodizem + 0.8,
  T.festa + 0.4, T.previa + 1.2, T.gastou63 + 1.0, T.maisass + 1.0, T.de2026 + 1.4, T.dobro + 0.9, T.dezvezes + 0.9,
  T.terceira + 0.5, T.camara + 1.0, T.quasedobro + 0.9,
  T.tribunal + 0.8, T.multa + 0.7, T.mp + 0.8, T.semjul + 0.7,
  T.naoecrime + 0.5, T.mas + 1.2, T.precisa + 1.0, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoItamaraju: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      {/* regras 39 e 40: cabeçalho fixo com o nome da cidade e o selo do @ (grande na abertura, viaja até o cabeçalho, volta no "Segue o") */}
      <CabecalhoCidade tema={tema} cidade="ITAMARAJU" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festa de', 'R$ 9,8 mi.', 'Assistência:', 'R$ 4,9 mi?'];
export const CapaOrcamentoItamaraju: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ITAMARAJU`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: Math.max(...linhas.map((x) => x.length)) > 11 ? 104 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
