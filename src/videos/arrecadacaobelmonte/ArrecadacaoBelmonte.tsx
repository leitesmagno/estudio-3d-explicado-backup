import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Caixa, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, Poste} from '../../pecas';
import {MesaMaquete, PilhasDinheiro, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {PALAVRAS} from './palavras';

// 048. arrecadação de belmonte (perfil @eumagnoleite). Série Belmonte, vídeo 1: SÓ A ARRECADAÇÃO, de 2018 a 2026.
// Molde: 035 Paratinga (cofre, pilhas, plaquinhas por ano), com o sentido do dinheiro TROCADO: aqui ele ENTRA no cofre,
// vindo de quatro lugares da borda da mesa (União, Fundeb, Estado e o bairro do município), na ordem da fala.
// Na frente de cada fonte fica a "vitrine": a fileira das 9 torrinhas de 2018 a 2026 do item falado (pedido do Magno, 07/11/2026).
// Valores NOMINAIS do documento (Anexo 10 de 2018 a 2025, PCMGE016 de 09/2026), sem nome de gestor. Fontes: audio/fontes.md.
// Plano: projetos/048.../plano.md (v2, aprovado).

export const FPS = 30;
const AUDIO_SEG = 173.06; // voz Adam, pausas de 0,35 s, 1,033x; trechos do IPTU e do ISS regerados com as letras separadas (07/11)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '048. arrecadação de belmonte';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  em2018: quando('Em 2018'),
  arrec61: quando('arrecadou 61'),
  em2025: quando('Em 2025 125'),
  dobro: quando('Mais que o dobro'),
  em2026: quando('E em 2026'),
  n111: quando('111 milhoes'),
  deOnde: quando('De onde vem'),
  deFora: quando('vem de fora'),
  uniao: quando('a Uniao mandou'),
  fundeb: quando('O Fundeb o fundo'),
  estado: quando('O Estado 13'),
  proprio: quando('proprio municipio arrecadou'),
  comUniao: quando('Comecando pela Uniao'),
  fpm: quando('O FPM'),
  fpm18: quando('foi de 17'),
  fpm25: quando('para 39'),
  sus: quando('O SUS'),
  sus18: quando('de 4 milhoes e meio'),
  sus25: quando('para 11'),
  ajuda: quando('ajuda da Uniao ao Fundeb'),
  aj18: quando('de 4 milhoes e 600'),
  aj25: quando('para 12'),
  aj26: quando('passou de 19'),
  doEstado: quando('Do Estado quase'),
  icms18: quando('7 milhoes e 900'),
  icms25: quando('11 milhoes e meio em'),
  agora: quando('Agora os impostos'),
  somando: quando('Somando impostos'),
  trib18: quando('arrecadou 5 milhoes'),
  ate23: quando('Ate 2023'),
  salto: quando('Ai veio o salto'),
  trib24: quando('8 milhoes e 800'),
  trib25: quando('15 milhoes e 400'),
  tres: quando('Quase tres vezes'),
  impPor: quando('Imposto por imposto'),
  iss: quando('O ISS'),
  iss18: quando('foi de 3'),
  iss25: quando('para 4 milhoes e 200'),
  itbi: quando('O ITBI'),
  itbi18: quando('de 420'),
  itbi25: quando('para 870'),
  ir: quando('O imposto de renda'),
  ir18: quando('de 1 milhao e 700'),
  ir25: quando('para 5 milhoes e 800'),
  taxas: quando('As taxas'),
  tx18: quando('de 180'),
  tx25: quando('para 1 milhao e 300'),
  ilum: quando('a contribuicao da iluminacao publica'),
  zero: quando('era zero'),
  il25: quando('chegou a 660'),
  iptu: quando('E o IPTU'),
  ip18: quando('36 mil'),
  ip25: quando('2 milhoes e 500'),
  repara: quando('Mas repara'),
  divida: quando('divida ativa'),
  atrasado: quando('IPTU atrasado'),
  doAno: quando('do proprio ano'),
  ip320: quando('320 mil'),
  mesmo: quando('Mesmo com o salto'),
  cada100: quando('de cada 100'),
  so16: quando('so 16'),
  resto: quando('O resto veio'),
  resUniao: quando('veio da Uniao'),
  resEstado: quando('do Estado e'),
  resFundeb: quando('e do Fundeb'),
  arrecadar: quando('Arrecadar mais'),
  paraOnde: quando('para onde foi'),
  proximo: quando('proximo video'),
  segue: quando('Segue o'),
};

// ---------- Os números (R$ milhões; FPM e ICMS já sem a parte do Fundeb, como o Anexo 10 soma o total) ----------
const ANOS_TXT = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const TOTAL = [61.013, 66.072, 68.503, 73.437, 90.92, 89.56, 104.487, 125.811, 111.517];
type Item = {id: string; nome: string; v: number[]; abre: number; fecha: number; ditos: [number, number][]};
// [ano (índice), palavra] em que a voz fala o valor daquele ano
const ITENS: Item[] = [
  {id: 'fpm', nome: 'FPM', v: [17.41, 18.95, 19.78, 24.29, 30.63, 31.67, 36.18, 39.67, 31.12], abre: T.fpm, fecha: T.sus, ditos: [[0, T.fpm18], [7, T.fpm25]]},
  {id: 'sus', nome: 'SUS', v: [4.49, 5.88, 7.75, 5.52, 5.17, 6.57, 9.1, 11.72, 13.96], abre: T.sus, fecha: T.ajuda, ditos: [[0, T.sus18], [7, T.sus25]]},
  {id: 'aju', nome: 'AJUDA AO FUNDEB', v: [4.63, 4.83, 4.82, 5.52, 10.38, 8.33, 7.31, 12.66, 19.09], abre: T.ajuda, fecha: T.doEstado, ditos: [[0, T.aj18], [7, T.aj25], [8, T.aj26]]},
  {id: 'icms', nome: 'ICMS', v: [7.93, 7.11, 6.85, 9.34, 10.05, 10.24, 11.16, 11.49, 8.22], abre: T.doEstado, fecha: T.agora, ditos: [[0, T.icms18], [7, T.icms25]]},
  {id: 'trib', nome: 'IMPOSTOS DO MUNICÍPIO', v: [5.8, 6.52, 6.17, 7.1, 7.47, 6.5, 8.82, 15.35, 10.21], abre: T.trib18 - 0.2, fecha: T.impPor, ditos: [[0, T.trib18], [6, T.trib24], [7, T.trib25]]},
  {id: 'iss', nome: 'ISS', v: [3.48, 3.51, 3.1, 2.92, 3.02, 4.11, 3.32, 4.17, 3.42], abre: T.iss, fecha: T.itbi, ditos: [[0, T.iss18], [7, T.iss25]]},
  {id: 'itbi', nome: 'ITBI', v: [0.415, 0.37, 0.24, 0.86, 1.42, 0.67, 0.85, 0.871, 0.58], abre: T.itbi, fecha: T.ir, ditos: [[0, T.itbi18], [7, T.itbi25]]},
  {id: 'ir', nome: 'IMPOSTO DE RENDA', v: [1.7, 2.16, 2.39, 2.66, 2.21, 0.79, 3.63, 5.81, 4.22], abre: T.ir, fecha: T.taxas, ditos: [[0, T.ir18], [7, T.ir25]]},
  {id: 'tx', nome: 'TAXAS', v: [0.175, 0.38, 0.42, 0.55, 0.39, 0.36, 0.39, 1.34, 0.84], abre: T.taxas, fecha: T.ilum, ditos: [[0, T.tx18], [7, T.tx25]]},
  {id: 'il', nome: 'ILUMINAÇÃO', v: [0, 0, 0, 0, 0.32, 0.44, 0.08, 0.665, 0.53], abre: T.ilum, fecha: T.iptu, ditos: [[7, T.il25]]},
  {id: 'iptu', nome: 'IPTU', v: [0.036, 0.09, 0.03, 0.11, 0.11, 0.12, 0.55, 2.49, 0.63], abre: T.iptu, fecha: T.mesmo, ditos: [[0, T.ip18], [7, T.ip25]]},
];
const NO_BAIRRO = ['trib', 'iss', 'itbi', 'ir', 'tx', 'il', 'iptu'];
const escalaDe = (id: string) => (NO_BAIRRO.includes(id) ? 1 : 2); // 1 pilha = R$ 1 mi no bairro, R$ 2 mi nos repasses
const IPTU_DIVIDA = 2.162; // dívida ativa + juros da dívida ativa (2025)
const FRENTE_IPTU: V3 = [Math.sin(-1.7 * Math.PI) * -0.55, 0, Math.cos(-1.7 * Math.PI) * -0.55]; // meio passo para o lado do cofre

// ---------- A mesa: quatro fontes na borda, na ordem da fala ----------
const pol = (a: number, r: number, y = 0): V3 => [Math.sin(a) * r, y, Math.cos(a) * r];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const tg = (a: number): V3 => [Math.cos(a), 0, -Math.sin(a)];
const A_UNIAO = -0.45 * Math.PI;
const A_FUNDEB = -0.85 * Math.PI;
const A_ESTADO = -1.25 * Math.PI;
const A_BAIRRO = -1.7 * Math.PI;
const R_FONTE = 7.1;
const R_VITRINE = 4.25;
type Fonte = {id: string; nome: string; a: number; v25: number; t: number; tipo: TipoPredio; texto: string};
const FONTES: Fonte[] = [
  {id: 'uniao', nome: 'UNIÃO', a: A_UNIAO, v25: 71.612, t: T.uniao, tipo: 'colunas', texto: 'UNIÃO'},
  {id: 'fundeb', nome: 'FUNDEB', a: A_FUNDEB, v25: 20.307, t: T.fundeb, tipo: 'galpao', texto: 'FUNDEB'},
  {id: 'estado', nome: 'ESTADO', a: A_ESTADO, v25: 13.372, t: T.estado, tipo: 'colunas', texto: 'ESTADO'},
  {id: 'bairro', nome: 'MUNICÍPIO', a: A_BAIRRO, v25: 20.52, t: T.proprio, tipo: 'casinha', texto: 'BELMONTE'},
];
const fonteDoItem = (id: string) => (id === 'icms' ? A_ESTADO : NO_BAIRRO.includes(id) ? A_BAIRRO : A_UNIAO);
// o bairro: uma casinha por tributo, também na ordem da fala (o ângulo diminui, como no resto da mesa)
type Casa = {id: string; a: number; tipo: 'galpao' | 'casinha' | 'poste' | 'iptu'; texto?: string};
const CASAS: Casa[] = [
  {id: 'iss', a: A_BAIRRO + 0.17 * Math.PI, tipo: 'galpao', texto: 'ISS'},
  {id: 'itbi', a: A_BAIRRO + 0.105 * Math.PI, tipo: 'casinha', texto: 'VENDE-SE'},
  {id: 'ir', a: A_BAIRRO + 0.04 * Math.PI, tipo: 'casinha', texto: 'FOLHA'},
  {id: 'tx', a: A_BAIRRO - 0.025 * Math.PI, tipo: 'casinha', texto: 'TAXAS'},
  {id: 'il', a: A_BAIRRO - 0.085 * Math.PI, tipo: 'poste'},
  {id: 'iptu', a: A_BAIRRO - 0.15 * Math.PI, tipo: 'iptu'},
];
const casaDe = (id: string) => CASAS.find((c) => c.id === id);
const R_CASA = 6.75;

// ---------- Ajudantes ----------
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const ANDAR = 0.75;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const torre = (c: V3, n: number, lado: number, cor: string, passo: number): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    s.push({p: [c[0] + ((k % lado) - (lado - 1) / 2) * passo, c[1] + andar * ANDAR, c[2] + (Math.floor(k / lado) - (lado - 1) / 2) * passo], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const meio = mistura(tema.objetoClaro, tema.objeto, 0.35);
  return [C.ouro, meio, meio, meio, meio, meio, meio, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};
const fmtC = (v: number) => (v <= 0 ? 'ZERO' : v < 1 ? `${Math.round(v * 100) * 10} MIL` : `${v.toFixed(1).replace('.', ',')} MI`);

// ---------- A escadaria dos anos (atrás do cofre) ----------
const ESC_Z = -2.5;
const posEscada = (k: number): V3 => [(k - 4) * 0.92, 0, ESC_Z];
const ESC_VIS = (t: number) => vis(t, T.em2025 - 0.4, T.deOnde + 0.6);
const sobeEscada = (t: number, k: number) => {
  if (k === 0) return rampa(t, T.em2025 - 0.4, T.em2025 + 0.2);
  if (k === 7) return rampa(t, T.em2025 + 0.4, T.em2025 + 1.6);
  if (k === 8) return rampa(t, T.n111, T.n111 + 1.0);
  return rampa(t, T.dobro + (k - 1) * 0.3, T.dobro + (k - 1) * 0.3 + 0.6);
};

// ---------- A vitrine: a fileira das 9 torrinhas na frente da fonte ----------
const LADO_V = 2;
const PASSO_V = 0.24;
const posFileira = (a: number, k: number): V3 => soma(pol(a, R_VITRINE), [tg(a)[0] * (4 - k) * 0.64, 0, tg(a)[2] * (4 - k) * 0.64]);
const itemVis = (t: number, it: Item) => vis(t, it.abre - 0.1, it.fecha - 0.2);
const sobeFileira = (t: number, it: Item, k: number) => {
  const dito = it.ditos.find(([kk]) => kk === k);
  const auto = rampa(t, it.abre + 0.1 + k * 0.15, it.abre + 0.7 + k * 0.15);
  if (it.id === 'trib') {
    // a soma dos impostos sobe na ordem da fala: 2018, até 2023, 2024, 2025, 2026
    if (k === 0) return rampa(t, T.trib18, T.trib18 + 0.7);
    if (k <= 5) return rampa(t, T.ate23 + (k - 1) * 0.25, T.ate23 + (k - 1) * 0.25 + 0.6);
    if (k === 6) return rampa(t, T.trib24, T.trib24 + 0.7);
    if (k === 7) return rampa(t, T.trib25, T.trib25 + 1.2);
    return rampa(t, T.trib25 + 1.3, T.trib25 + 2.0);
  }
  return dito ? Math.max(auto * 0.999, rampa(t, dito[1] - 0.2, dito[1] + 0.5)) : auto;
};

// ---------- De onde vem: as pilhas correm de cada fonte para o cofre ----------
const COFRE: V3 = [0, 0.9, 0];
const fluxo = (t: number, f: Fonte, tema: Tema): Pilha[] => {
  const n = f.v25 / 2;
  const s: Pilha[] = [];
  const cor = coresAno(tema)[7];
  for (let j = 0; j < Math.ceil(n); j++) {
    const t0 = f.t + 0.15 + j * (1.6 / Math.max(10, n));
    const k = rampa(t, t0, t0 + 0.9);
    if (k <= 0 || k >= 1) continue;
    const de = soma(pol(f.a, 6.0), [tg(f.a)[0] * ((j % 3) - 1) * 0.3, 0, tg(f.a)[2] * ((j % 3) - 1) * 0.3]);
    s.push({p: curva(de, COFRE, 1.6, k), n: Math.min(1, n - j) * (k > 0.85 ? (1 - k) / 0.15 : 1), cor});
  }
  return s;
};

// ---------- De cada R$ 100: 100 moedas em fila na frente do cofre ----------
const GRADE100 = (i: number): V3 => [((i % 10) - 4.5) * 0.3, 0, 1.9 + Math.floor(i / 10) * 0.3];
const DESTINO100 = (i: number): {p: V3; t: number; grupo: number} => {
  // 0..15 bairro, 16..72 União, 73..83 Estado, 84..99 Fundeb
  const grupo = i < 16 ? 3 : i < 73 ? 0 : i < 84 ? 2 : 1;
  const ini = [16, 73, 84, 0][grupo] === 0 ? 0 : 0;
  void ini;
  const base = [16, 84, 73, 0][grupo];
  const j = i - [16, 84, 73, 0][grupo];
  void base;
  const f = FONTES[grupo];
  const t = [T.resUniao + 0.1, T.resFundeb + 0.1, T.resEstado + 0.1, T.so16 + 0.2][grupo] + (j % 20) * 0.03;
  const c = pol(f.a, R_VITRINE + 0.3);
  const lado = 6;
  return {p: soma(c, [tg(f.a)[0] * ((j % lado) - 2.5) * 0.26, Math.floor(j / (lado * 2)) * 0.07, tg(f.a)[2] * ((j % lado) - 2.5) * 0.26 + ((Math.floor(j / lado) % 2) - 0.5) * 0.26]), t, grupo};
};
const CEM_VIS = (t: number) => vis(t, T.cada100 - 0.2, T.arrecadar + 0.6);

// ---------- O que some nas viradas ----------
const VITRINE_FORA = (t: number) => t < T.fpm - 0.3 || t > T.mesmo - 0.1;

const pilhasEm = (t: number, tema: Tema): {torres: Pilha[]; voando: Pilha[]; grandes: Pilha[]} => {
  const CA = coresAno(tema);
  const torres: Pilha[] = [];
  const voando: Pilha[] = [];
  const grandes: Pilha[] = [];
  // escadaria
  const ev = ESC_VIS(t);
  if (ev > 0.01) TOTAL.forEach((v, k) => torres.push(...torre(posEscada(k), (v / 2) * sobeEscada(t, k) * ev, 3, CA[k], 0.27)));
  // vitrines
  if (!VITRINE_FORA(t))
    ITENS.forEach((it) => {
      const iv = itemVis(t, it);
      if (iv <= 0.01) return;
      const a = fonteDoItem(it.id);
      const esc = escalaDe(it.id);
      it.v.forEach((v, k) => {
        const n = (v / esc) * sobeFileira(t, it, k) * iv;
        if (n <= 0.001) return;
        if (it.id === 'iptu' && k === 7) {
          // IPTU 2025: a dívida ativa fica cinza-escura a partir de "dívida ativa"; o IPTU do ano acende verde
          const div = Math.min(n, IPTU_DIVIDA);
          const cinza = mistura(tema.objetoEscuro, tema.objeto, 0.3);
          const kd = rampa(t, T.divida, T.divida + 0.5);
          torre(posFileira(a, k), div, LADO_V, kd > 0.5 ? cinza : CA[7], PASSO_V).forEach((p) => torres.push(p));
          if (n > IPTU_DIVIDA) torres.push({p: soma(posFileira(a, k), FRENTE_IPTU), n: n - IPTU_DIVIDA, cor: CA[7]});
          return;
        }
        torres.push(...torre(posFileira(a, k), n, LADO_V, CA[k], PASSO_V));
      });
    });
  // de onde vem
  if (t > T.uniao - 0.2 && t < T.comUniao + 1) FONTES.forEach((f) => grandes.push(...fluxo(t, f, tema)));
  // de cada R$ 100
  const cv = CEM_VIS(t);
  if (cv > 0.01)
    for (let i = 0; i < 100; i++) {
      const d = DESTINO100(i);
      const nasce = rampa(t, T.cada100 + (i % 10) * 0.03 + Math.floor(i / 10) * 0.05, T.cada100 + 0.5 + (i % 10) * 0.03 + Math.floor(i / 10) * 0.05);
      const k = rampa(t, d.t, d.t + 0.8);
      const cor = d.grupo === 3 && t > T.so16 ? tema.acento : coresAno(tema)[7];
      voando.push({p: k <= 0 ? GRADE100(i) : curva(GRADE100(i), d.p, 1.4, k), n: 0.1 * nasce * cv, cor});
    }
  // a pergunta: moedas saem do cofre e somem por uma trilha no escuro
  if (t > T.paraOnde - 0.1)
    for (let j = 0; j < 14; j++) {
      const t0 = T.paraOnde + j * 0.22;
      const k = rampa(t, t0, t0 + 2.4);
      if (k <= 0 || k >= 1) continue;
      grandes.push({p: curva(COFRE, [0.4 * Math.sin(j), 0, -11.5], 1.2, k), n: 0.3 * (1 - k * k), cor: coresAno(tema)[7]});
    }
  return {torres, voando, grandes};
};

// ---------- Peças do mundo ----------
const Trilha: React.FC<{tema: Tema; a: number; k: number; aceso: number}> = ({tema, a, k, aceso}) => {
  if (k < 0.02) return null;
  const meio = pol(a, 3.65, 0.04);
  return (
    <group position={meio} rotation={[0, a, 0]}>
      <Caixa args={[0.55, 0.02, 4.9 * Math.min(1, k)]} raio={0.008} cor={mistura(tema.objetoEscuro, tema.acento, 0.12 + 0.35 * aceso)} sombra={false} />
    </group>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const {torres, voando, grandes} = pilhasEm(t, tema);
  // o cofre desce para dentro da mesa enquanto a câmera olha as vitrines (senão ele tapa a frente da tela)
  const someCofre = janela(t, T.comUniao - 0.3, T.mesmo - 0.4, 0.6);
  const abre = Math.max(janela(t, T.uniao - 0.2, T.comUniao, 0.5), janela(t, T.paraOnde - 0.3, FIM + 1, 0.6));
  const trilhas = vis(t, T.deOnde, T.comUniao + 0.6);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {[
        [-1.6, 0, 7.9],
        [2.1, 0, 7.6],
        [-7.7, 0, -2.6],
        [7.8, 0, -0.9],
      ].map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p as V3} r={0.5} cresce={0.7} />
      ))}
      <CofreFGTS tema={tema} pos={[0, -1.6 * someCofre, 0]} escala={0.55} abre={abre} trava={0} brilho={0.25 * abre} />
      <PilhasDinheiro pilhas={torres} max={5200} largura={0.72} />
      <PilhasDinheiro pilhas={voando} max={1400} largura={0.72} />
      <PilhasDinheiro pilhas={grandes} max={800} largura={1.25} />

      {FONTES.map((f) => {
        const aceso = Math.max(
          janela(t, f.t, f.t + 2.6, 0.4),
          f.id === 'uniao' ? janela(t, T.comUniao, T.doEstado, 0.4) : 0,
          f.id === 'estado' ? janela(t, T.doEstado, T.agora, 0.4) : 0,
          f.id === 'bairro' ? janela(t, T.agora, T.impPor, 0.4) : 0,
          janela(t, T.deFora, T.uniao, 0.3) * (f.id === 'bairro' ? 0 : 1),
        );
        return (
          <group key={f.id}>
            <Trilha tema={tema} a={f.a} k={trilhas} aceso={janela(t, f.t, f.t + 2.4, 0.3)} />
            {f.id === 'bairro' ? null : <PredioTexto tema={tema} pos={pol(f.a, R_FONTE)} rotY={f.a + Math.PI} escala={0.62} sobe={rampa(t, T.em2025 - 0.4, T.em2025 + 0.4)} aceso={aceso} texto={f.texto} tipo={f.tipo} />}
          </group>
        );
      })}

      {/* o bairro de Belmonte: uma casinha por tributo */}
      {CASAS.map((c) => {
        const it = ITENS.find((i) => i.id === c.id)!;
        const aceso = Math.max(janela(t, it.abre, it.fecha, 0.4), janela(t, T.somando + 0.4 * CASAS.indexOf(c), T.trib18, 0.3), janela(t, T.proprio, T.comUniao, 0.4));
        const p = pol(c.a, R_CASA);
        const rot = c.a + Math.PI;
        const sobe = rampa(t, T.em2025 - 0.4, T.em2025 + 0.4);
        if (c.tipo === 'poste') {
          const luz = rampa(t, T.il25 - 0.1, T.il25 + 0.5);
          return sobe > 0.02 ? <group key={c.id} scale={0.9}><Poste tema={tema} pos={[p[0] / 0.9, 0, p[2] / 0.9]} luz={0.05 + 0.9 * luz} /></group> : null;
        }
        if (c.tipo === 'iptu') return sobe > 0.02 ? <CasaMini key={c.id} tema={tema} pos={p} rotY={rot} luz={0.2 + 0.7 * aceso} escala={0.7} /> : null;
        return <PredioTexto key={c.id} tema={tema} pos={p} rotY={rot} escala={0.52} sobe={sobe} aceso={aceso} texto={c.texto!} tipo={c.tipo} />;
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0) => E([0, 0, 0], 15.5, 13.5, [dx, 2.1, 1]);
const VITRINE = (a: number, dirA = a, larg = 6.6, alt = 6.4, y = 1.3): Cam => E(soma(pol(a, R_VITRINE + 0.4), [0, y, 0]), larg, alt, [-Math.sin(dirA) * 0.85, 0.85, -Math.cos(dirA) * 0.85]);
const NA_CASA = (id: string, perto = 1): Cam => {
  const c = casaDe(id)!;
  const a = A_BAIRRO * 0.55 + c.a * 0.45;
  return VITRINE(A_BAIRRO, a, 7.2 * perto, 6.8 * perto, 1.2);
};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 2, -2.5], 9.6, 7.6, [0, 0.8, 1])]]},
  // o total: a escadaria dos anos
  {ini: T.em2025 - 0.3, arco: 0.05, chaves: [[T.em2025 - 0.3, E([-0.6, 2.2, -2.5], 9.8, 7.8, [-0.12, 0.75, 1])], [T.n111, E([0.4, 2.4, -2.5], 9.6, 7.8, [0.1, 0.8, 1])], [T.deOnde - 0.2, E([0.7, 2.4, -2.5], 9.6, 7.8, [0.16, 0.82, 1])]]},
  // de onde vem: a mesa inteira
  {ini: T.deOnde - 0.1, arco: 0.04, chaves: [[T.deOnde - 0.1, E([0, 0, 0], 13.2, 11.5, [0.05, 1.45, 1])], [T.comUniao - 0.3, E([0, 0, 0], 12.8, 11.2, [-0.1, 1.45, 1])]]},
  // União
  {ini: T.comUniao - 0.1, arco: 0.03, chaves: [[T.comUniao - 0.1, VITRINE(A_UNIAO, A_UNIAO + 0.05, 7.4, 7.0)], [T.fpm25, VITRINE(A_UNIAO, A_UNIAO + 0.02)], [T.ajuda, VITRINE(A_UNIAO, A_UNIAO - 0.02)], [T.doEstado - 0.3, VITRINE(A_UNIAO, A_UNIAO - 0.06)]]},
  // Estado (o giro continua; o Fundeb fica no caminho)
  {ini: T.doEstado - 0.1, arco: 0.03, chaves: [[T.doEstado - 0.1, VITRINE(A_ESTADO, A_ESTADO + 0.05)], [T.agora - 0.3, VITRINE(A_ESTADO, A_ESTADO - 0.05)]]},
  // o bairro: a soma dos impostos, depois casinha por casinha
  {
    ini: T.agora - 0.1,
    arco: 0.03,
    chaves: [
      [T.agora - 0.1, VITRINE(A_BAIRRO, A_BAIRRO + 0.12, 9.4, 8.4, 1.0)],
      [T.trib18 - 0.3, VITRINE(A_BAIRRO, A_BAIRRO + 0.05, 7.0, 6.6)],
      [T.tres + 1.2, VITRINE(A_BAIRRO, A_BAIRRO - 0.02, 7.0, 6.6)],
      [T.iss - 0.1, NA_CASA('iss')],
      [T.itbi - 0.1, NA_CASA('itbi')],
      [T.ir - 0.1, NA_CASA('ir')],
      [T.taxas - 0.1, NA_CASA('tx')],
      [T.ilum - 0.1, NA_CASA('il')],
      [T.iptu - 0.3, NA_CASA('iptu')],
    ],
  },
  // IPTU: avanço lento até a torre de 2025
  {ini: T.iptu - 0.1, arco: 0.02, chaves: [[T.iptu - 0.1, NA_CASA('iptu')], [T.repara, E(soma(posFileira(A_BAIRRO, 7), [0, 1.0, 0]), 4.6, 4.6, [-Math.sin(A_BAIRRO - 0.1) * 0.85, 0.7, -Math.cos(A_BAIRRO - 0.1) * 0.85])], [T.mesmo - 0.3, E(soma(posFileira(A_BAIRRO, 7), [0, 1.0, 0]), 4.4, 4.4, [-Math.sin(A_BAIRRO - 0.14) * 0.85, 0.7, -Math.cos(A_BAIRRO - 0.14) * 0.85])]]},
  // de cada R$ 100
  {ini: T.mesmo - 0.1, arco: 0.04, chaves: [[T.mesmo - 0.1, DE_CIMA(0.1)], [T.arrecadar - 0.3, DE_CIMA(-0.05)]]},
  // a pergunta
  {ini: T.arrecadar - 0.1, arco: 0.04, chaves: [[T.arrecadar - 0.1, E([0, 1.0, 0.4], 6.2, 6.0, [0, 0.8, 1])], [T.paraOnde, E([0, 1.0, -0.6], 7.6, 6.8, [0.05, 0.85, 1])], [FIM, E([0, 0.8, -4.0], 11, 9, [0.1, 0.9, 1])]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.05, grua: 0.04});
};

// ---------- Interface ----------
const ESTADOS: [number, string][] = [
  [0, 'BELMONTE · ARRECADAÇÃO'],
  [T.em2025, '2018 A 2026'],
  [T.deOnde, 'DE ONDE VEM'],
  [T.comUniao, 'UNIÃO'],
  [T.doEstado, 'ESTADO'],
  [T.agora, 'IMPOSTOS DO MUNICÍPIO'],
  [T.impPor, 'IMPOSTO POR IMPOSTO'],
  [T.iptu, 'O IPTU'],
  [T.mesmo, 'DE CADA R$ 100'],
  [T.arrecadar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.em2025, b: T.dobro, texto: 'ARRECADOU EM 2025: R$ 125,8 MI'},
  {a: T.dobro, b: T.em2026, texto: 'MAIS QUE O DOBRO DE 2018 (R$ 61,0 MI)', destaque: true},
  {a: T.em2026, b: T.deOnde, texto: '2026, ATÉ SETEMBRO: R$ 111,5 MI'},
  {a: T.deOnde, b: T.uniao, texto: 'DE ONDE VEM O DINHEIRO? (2025)'},
  {a: T.uniao, b: T.fundeb, texto: 'UNIÃO: R$ 71,6 MI'},
  {a: T.fundeb, b: T.estado, texto: 'FUNDEB, O FUNDO DA EDUCAÇÃO: R$ 20,3 MI'},
  {a: T.estado, b: T.proprio, texto: 'ESTADO: R$ 13,4 MI'},
  {a: T.proprio, b: T.comUniao, texto: 'O PRÓPRIO MUNICÍPIO: R$ 20,5 MI', destaque: true},
  {a: T.fpm, b: T.fpm25, texto: 'FPM · FUNDO DE PARTICIPAÇÃO DOS MUNICÍPIOS'},
  {a: T.fpm25, b: T.sus, texto: 'FPM: R$ 17,4 MI (2018) → R$ 39,7 MI (2025)', destaque: true},
  {a: T.sus, b: T.sus25, texto: 'SUS · REPASSE DA SAÚDE'},
  {a: T.sus25, b: T.ajuda, texto: 'SUS: R$ 4,5 MI (2018) → R$ 11,7 MI (2025)', destaque: true},
  {a: T.ajuda, b: T.aj25, texto: 'AJUDA DA UNIÃO AO FUNDEB'},
  {a: T.aj25, b: T.aj26, texto: 'AJUDA: R$ 4,6 MI (2018) → R$ 12,7 MI (2025)', destaque: true},
  {a: T.aj26, b: T.doEstado, texto: '2026, SÓ ATÉ SETEMBRO: R$ 19,1 MI', destaque: true},
  {a: T.doEstado, b: T.icms25, texto: 'DO ESTADO, QUASE TUDO É ICMS'},
  {a: T.icms25, b: T.agora, texto: 'ICMS: R$ 7,9 MI (2018) → R$ 11,5 MI (2025)', destaque: true},
  {a: T.agora, b: T.somando, texto: 'OS IMPOSTOS DO PRÓPRIO MUNICÍPIO'},
  {a: T.somando, b: T.trib18, texto: 'IMPOSTOS + TAXAS + ILUMINAÇÃO'},
  {a: T.trib18, b: T.ate23, texto: '2018: R$ 5,8 MI'},
  {a: T.ate23, b: T.salto, texto: 'ATÉ 2023: ENTRE R$ 6 E 7,5 MI'},
  {a: T.salto, b: T.trib24, texto: 'AÍ VEIO O SALTO', destaque: true},
  {a: T.trib24, b: T.trib25, texto: '2024: R$ 8,8 MI'},
  {a: T.trib25, b: T.tres, texto: '2025: R$ 15,4 MI', destaque: true},
  {a: T.tres, b: T.impPor, texto: 'QUASE 3 VEZES 2018', destaque: true},
  {a: T.impPor, b: T.iss, texto: 'IMPOSTO POR IMPOSTO'},
  {a: T.iss, b: T.iss25, texto: 'ISS · COBRADO SOBRE SERVIÇOS'},
  {a: T.iss25, b: T.itbi, texto: 'ISS: R$ 3,5 MI (2018) → R$ 4,2 MI (2025)', destaque: true},
  {a: T.itbi, b: T.itbi25, texto: 'ITBI · PAGO NA VENDA DE IMÓVEIS'},
  {a: T.itbi25, b: T.ir, texto: 'ITBI: R$ 420 MIL (2018) → R$ 870 MIL (2025)', destaque: true},
  {a: T.ir, b: T.ir25, texto: 'IMPOSTO DE RENDA RETIDO DOS SALÁRIOS'},
  {a: T.ir25, b: T.taxas, texto: 'IR: R$ 1,7 MI (2018) → R$ 5,8 MI (2025)', destaque: true},
  {a: T.taxas, b: T.tx25, texto: 'TAXAS'},
  {a: T.tx25, b: T.ilum, texto: 'TAXAS: R$ 180 MIL (2018) → R$ 1,3 MI (2025)', destaque: true},
  {a: T.ilum, b: T.zero, texto: 'CONTRIBUIÇÃO DA ILUMINAÇÃO PÚBLICA'},
  {a: T.zero, b: T.il25, texto: 'R$ 0 DE 2018 A 2021', destaque: true},
  {a: T.il25, b: T.iptu, texto: '2025: R$ 660 MIL'},
  {a: T.iptu, b: T.ip18, texto: 'IPTU'},
  {a: T.ip18, b: T.ip25, texto: '2018: R$ 36 MIL'},
  {a: T.ip25, b: T.divida, texto: '2025: R$ 2,5 MI'},
  {a: T.divida, b: T.doAno, texto: 'R$ 2,1 MI SÃO DÍVIDA ATIVA (ANOS ANTERIORES)', destaque: true},
  {a: T.doAno, b: T.mesmo, texto: 'IPTU DO PRÓPRIO ANO: R$ 320 MIL', destaque: true},
  {a: T.cada100, b: T.so16, texto: 'DE CADA R$ 100 ARRECADADOS EM 2025'},
  {a: T.so16, b: T.resto, texto: 'SÓ R$ 16 VIERAM DO MUNICÍPIO', destaque: true},
  {a: T.resto, b: T.arrecadar, texto: 'R$ 57 UNIÃO · R$ 16 FUNDEB · R$ 11 ESTADO'},
  {a: T.arrecadar, b: T.paraOnde, texto: 'ARRECADAR MAIS NÃO É PROBLEMA'},
  {a: T.paraOnde, b: T.proximo, texto: 'PARA ONDE FOI ESSE DINHEIRO?', destaque: true},
  {a: T.proximo, b: T.segue, texto: 'NO PRÓXIMO VÍDEO DA SÉRIE'},
  {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.em2025, b: T.deOnde, texto: 'FONTE: ANEXO 10 (2018 A 2025) E SIGA SET/2026 · TCM-BA'},
  {a: T.deOnde, b: T.comUniao, texto: 'FONTE: ANEXO 10 DE 2025 ENVIADO AO TCM-BA'},
  {a: T.comUniao, b: T.agora, texto: 'FPM E ICMS JÁ SEM A PARTE QUE FORMA O FUNDEB · ANEXO 10'},
  {a: T.agora, b: T.mesmo, texto: 'FONTE: ANEXO 10 (2018 A 2025) E SIGA SET/2026 · TCM-BA'},
  {a: T.mesmo, b: T.arrecadar, texto: 'CONTA PRÓPRIA SOBRE O ANEXO 10 DE 2025'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string; forte?: boolean};
const ROTULOS = (tema: Tema): Rot[] => {
  const CA = coresAno(tema);
  const r: Rot[] = [];
  // escadaria
  TOTAL.forEach((v, k) => {
    const a = k === 0 ? T.em2025 + 0.1 : k === 7 ? T.em2025 + 1.2 : k === 8 ? T.n111 + 0.6 : T.dobro + (k - 1) * 0.3 + 0.4;
    r.push({a, b: T.deOnde + 0.3, p: soma(posEscada(k), [0, altTorre(v / 2, 3) + 0.3, 0]), valor: fmtC(v), sub: k === 8 ? '2026 ATÉ SET' : ANOS_TXT[k], cor: CA[k], forte: k === 0 || k >= 7});
  });
  // de onde vem
  FONTES.forEach((f) => r.push({a: f.t + 0.4, b: T.comUniao, p: pol(f.a, f.id === 'bairro' ? 6.4 : R_FONTE, 2.2), valor: `R$ ${f.v25.toFixed(1).replace('.', ',')} MI`, sub: `${f.nome} · 2025`, cor: CA[7], forte: true}));
  // vitrines
  ITENS.forEach((it) => {
    const a0 = fonteDoItem(it.id);
    const esc = escalaDe(it.id);
    it.v.forEach((v, k) => {
      const dito = it.ditos.find(([kk]) => kk === k);
      const a = it.id === 'trib' ? (k === 0 ? T.trib18 + 0.4 : k <= 5 ? T.ate23 + (k - 1) * 0.25 + 0.4 : k === 6 ? T.trib24 + 0.4 : k === 7 ? T.trib25 + 0.8 : T.trib25 + 1.8) : dito ? dito[1] + 0.2 : it.abre + 0.6 + k * 0.15;
      const n = it.id === 'iptu' && k === 7 ? IPTU_DIVIDA : v / esc;
      r.push({a, b: it.fecha - 0.2, p: soma(posFileira(a0, k), [0, altTorre(n, LADO_V) + 0.25, 0]), valor: fmtC(v), sub: k === 8 ? '2026*' : ANOS_TXT[k], cor: CA[k], forte: !!dito || k === 8});
    });
  });
  // IPTU 2025 dividido
  r.push({a: T.divida + 0.3, b: T.mesmo - 0.2, p: soma(posFileira(A_BAIRRO, 7), [0, 1.5, 0]), valor: 'DÍVIDA ATIVA · R$ 2,1 MI', sub: 'IPTU DE ANOS ANTERIORES', cor: mistura(tema.objetoClaro, tema.objeto, 0.2), forte: true});
  r.push({a: T.ip320, b: T.mesmo - 0.2, p: soma(posFileira(A_BAIRRO, 7), soma(FRENTE_IPTU, [0, 0.3, 0])), valor: 'DO ANO · R$ 320 MIL', cor: CA[7], forte: true});
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

const noMapa = (t: number) => t < T.em2025;
const soMapa = (t: number) => t < T.em2025 - 0.4;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.em2025) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.em2025 + 0.4, FIM);
  const bairro = t >= T.agora && t < T.mesmo;
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 52 ? 15 : 18, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${bairro ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          {[C.ouro, CA[1], CA[7], CA[8]].map((c, i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          ))}
          <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: tema.texto}}>{bairro ? 'NO BAIRRO: 1 MOEDA = R$ 100 MIL · 1 PILHA = R$ 1 MI' : '1 PILHA = R$ 2 MI · DOURADO 2018 · VERDE 2025 · ROSA 2026'}</div>
        </div>
      ) : null}
      {placarK > 0.01 ? <div style={{opacity: 0.85 * Math.min(1, placarK), fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: tema.textoSuave}}>VALORES DO DOCUMENTO, SEM CORREÇÃO PELA INFLAÇÃO · *2026 ATÉ SETEMBRO</div> : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec61, 0.45), 1 - rampa(t, T.em2025 - 0.6, T.em2025 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: ANEXO 10 DE 2018 ENVIADO AO TCM-BA</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq - 20 || pj.x > SEGURO.botoesX + 20) return null;
      return {i, x: Math.max(SEGURO.esq + 50, Math.min(SEGURO.botoesX - 50, pj.x)), y: Math.max(700, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  // sem sobreposição: quem chega depois sobe
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < (rots[a].r.forte || rots[b].r.forte ? 112 : 92) && Math.abs(rots[a].y - rots[b].y) < 52) rots[a].y = rots[b].y - 54;
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 44 ? 19 : chip.texto.length > 32 ? 24 : 30} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 8}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.forte ? '5px 10px 6px' : '3px 7px 4px', borderRadius: 10, background: v.r.cor ? mistura(tema.cartao, v.r.cor, v.r.forte ? 0.22 : 0.1) : tema.cartao, border: `${v.r.forte ? 3 : 2}px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.forte ? 24 : 17, fontWeight: 900, letterSpacing: -0.3, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.3) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: v.r.forte ? 12 : 10, fontWeight: 700, letterSpacing: 1.1, color: tema.textoSuave, marginTop: 2}}>{v.r.sub}</div> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/belmonte-arrecadacao.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número dito ----------
const SOQUINHOS = [T.em2025, T.n111, T.uniao, T.fundeb, T.estado, T.proprio, ...ITENS.flatMap((it) => it.ditos.map(([, x]) => x)), T.divida, T.so16];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec61, f: 'pop', v: 0.2}, {t: T.em2025 + 0.4, f: 'subida', v: 0.16}, {t: T.n111, f: 'pop', v: 0.18});
  FONTES.forEach((f) => s.push({t: f.t + 0.3, f: 'subida', v: 0.13}));
  ITENS.forEach((it) => it.ditos.forEach(([, x]) => s.push({t: x + 0.05, f: 'pop', v: 0.18})));
  s.push({t: T.trib25 + 0.1, f: 'subida', v: 0.2}, {t: T.zero + 0.1, f: 'baque', v: 0.2}, {t: T.il25, f: 'ding', v: 0.14});
  s.push({t: T.divida + 0.1, f: 'baque', v: 0.18}, {t: T.doAno + 0.1, f: 'pop', v: 0.18}, {t: T.so16 + 0.2, f: 'pop', v: 0.2});
  s.push({t: T.paraOnde, f: 'whoosh', v: 0.14}, {t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, 9.6, T.em2025 + 1.2, T.dobro + 1.8, T.n111 + 0.9, T.deOnde + 0.8, T.uniao + 1.0, T.fundeb + 1.0, T.estado + 1.0, T.proprio + 1.4,
  T.fpm + 1.4, T.fpm25 + 0.8, T.sus25 + 0.8, T.aj25 + 0.6, T.aj26 + 0.8, T.icms25 + 0.8,
  T.agora + 0.8, T.trib18 + 0.8, T.ate23 + 1.6, T.trib25 + 1.6, T.tres + 0.8,
  T.iss25 + 0.6, T.itbi25 + 0.6, T.ir25 + 0.6, T.tx25 + 0.6, T.zero + 0.5, T.il25 + 0.8,
  T.ip18 + 0.6, T.ip25 + 0.8, T.divida + 1.0, T.ip320 + 0.6, T.cada100 + 1.2, T.so16 + 0.9, T.resto + 2.2, T.arrecadar + 0.8, T.paraOnde + 1.2, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const ArrecadacaoBelmonte: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Arrecadação de Belmonte" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Arrecadou', 'o dobro.', 'Para onde', 'foi?'];
export const CapaArrecadacaoBelmonte: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
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
