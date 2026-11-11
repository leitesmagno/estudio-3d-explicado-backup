import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {temaPorId} from '../../estilo';
import {ArvoreRedonda, CofreFGTS} from '../../pecas';
import {MesaMaquete, PilhasDinheiro, PostoSaude, PredioTCM, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {BaseNome} from '../obrasilheus10/pecas';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {PALAVRAS} from './palavras';

// 127. Ilhéus 10 anos · saúde (2016 a ago/2026). Molde ÚNICO: 095 obras (tom de conversa, folhas de PDF desenhadas,
// mapa do Kit Mapas no gancho, só @eumagnoleite). Mapa: projetos/127.../mapas/saudeilheus10.mp4 (composição SaudeIlheus10Mapa).
// Mesa redonda: o bolo (arrecadou x saúde), o SUS que chega de fora, o mínimo dos impostos (2016, 2018, 2023),
// para onde foi em 2025, quem mais recebeu, o que o Tribunal disse e o fecho 81 x 185.
// Em cada número falado entra a FOLHA DE PDF desenhada com o documento, a página e o valor real marcado (FolhaPdf).
// Sem nome de gestor, sem porcentagem. Dados: projetos/127.../audio/fontes.md e saude/site_fontes_127/fontes_127.json.

export const FPS = 30;
const AUDIO_SEG = 236.55; // Algenib 1,3, pausas 0,28 s, atempo 1,08, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '127. ilhéus 10 anos saúde';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bolo: quando('Funciona assim'),
  olha: quando('Olha os dez anos'),
  maior: quando('O maior dos dez'),
  sus: quando('So que repara'),
  vemSus: quando('Vem do SUS'),
  imp: quando('E o dinheiro dos impostos'),
  lei: quando('A lei manda'),
  abaixo: quando('Ficou abaixo do minimo'),
  compensar: quando('mandou compensar'),
  defesa: quando('Depois da defesa'),
  fechou: quando('fechou em 35'),
  min23: quando('O minimo era'),
  raspando: quando('Passou raspando'),
  naoJulg: quando('As contas de 2024 e 2025'),
  onde: quando('E dentro da saude para onde'),
  pega: quando('Compara 2024 com'),
  quem: quando('E quem mais recebeu'),
  tres: quando('os tres primeiros'),
  trib: quando('E o que o Tribunal'),
  med: quando('Em 2022 a cidade tinha'),
  cred: quando('77 credenciados'),
  adv: quando('Em 2026 o Tribunal julgou'),
  advert: quando('deu advertencia'),
  aud: quando('Numa auditoria'),
  m5: quando('Multa de 5 mil'),
  almox: quando('No almoxarifado'),
  m2: quando('Multa de 2 mil'),
  cons: quando('E de 2017 a 2022'),
  seis: quando('seis anos seguidos'),
  recurso: quando('Multa do Tribunal e decisao'),
  dez: quando('Dez anos tres gestoes'),
  dobrou: quando('A saude foi de 81'),
  porque: quando('Mas me diz'),
  segue: quando('Segue o'),
};

// ---------- 1. Panorama de 10 anos: previu (transparente) x aplicou (sólida), 1 pilha = R$ 10 mi ----------
type Bolo = {ano: string; t: number; tS: number; arr: number; sau: number};
const aplicouEm = (n: number) => quando('Aplicou', n);
const BOLO: Bolo[] = [
  {ano: '2016', t: quando('2016 Previu'), tS: aplicouEm(1), arr: 88.47, sau: 81.16},
  {ano: '2017', t: quando('2017 Previu'), tS: aplicouEm(2), arr: 85.61, sau: 84.52},
  {ano: '2018', t: quando('2018 Previu'), tS: aplicouEm(3), arr: 104.6, sau: 108.76},
  {ano: '2019', t: quando('2019 Previu'), tS: aplicouEm(4), arr: 110.72, sau: 108.08},
  {ano: '2020', t: quando('2020 ano da pandemia'), tS: aplicouEm(5), arr: 98.26, sau: 131.21},
  {ano: '2021', t: quando('2021 Previu'), tS: aplicouEm(6), arr: 110.5, sau: 131.59},
  {ano: '2022', t: quando('2022 Previu'), tS: aplicouEm(7), arr: 119.41, sau: 143.26},
  {ano: '2023', t: quando('2023 Previu'), tS: aplicouEm(8), arr: 153.88, sau: 149.78},
  {ano: '2024', t: quando('2024 Previu'), tS: aplicouEm(9), arr: 172.84, sau: 181.08},
  {ano: '2025', t: quando('2025 Previu'), tS: aplicouEm(10), arr: 186.9, sau: 184.89},
  {ano: '2026 (ATÉ AGO)', t: quando('2026 Previu'), tS: aplicouEm(11), arr: 180.31, sau: 127.27},
];
const ESC_B = 10;
const posBolo = (i: number): V3 => [-6.5 + i * 1.3, 0, -0.2];
const ARR_DX: V3 = [-0.3, 0, 0];
const SAU_DX: V3 = [0.32, 0, 0.08];
const BOLO_VIS = (t: number) => vis(t, T.bolo - 0.2, T.sus - 0.1);

// ---------- 2. SUS: chega de fora para o Fundo de Saúde, 1 pilha = R$ 4 mi ----------
type Sus = {ano: string; t: number; v: number; prev?: number; tC?: number};
const SUS: Sus[] = [
  {ano: '2017', t: quando('Em 2017 o SUS'), v: 48.79},
  {ano: '2024', t: quando('Em 2024 103'), v: 103.71},
  {ano: '2025', t: quando('Em 2025 o orcamento contava'), v: 98.02, prev: 111.23, tC: quando('Chegaram 98')},
  {ano: '2026 (ATÉ AGO)', t: quando('E em 2026 ate agosto 81'), v: 81.65},
];
const ESC_S = 4;
const SUS_DE: V3 = [-4.6, 0, -2.6];
const FUNDO_POS: V3 = [3.4, 0, -2.6];
const posSus = (i: number): V3 => [-2.85 + i * 1.9, 0, 1.0];
const SUS_VIS = (t: number) => vis(t, T.sus - 0.1, T.imp - 0.1);

// ---------- 3. O mínimo dos impostos (transparente = mínimo, sólida = aplicado), 1 pilha = R$ 2 mi ----------
type Min = {ano: string; t: number; tApl: number; min: number; apl: number; apl2?: number; t2?: number; abaixo: boolean; decl?: boolean};
const MIN: Min[] = [
  {ano: '2016', t: quando('Em 2016 Ilheus aplicou'), tApl: quando('aplicou 28'), min: 31.71, apl: 28.92, abaixo: true},
  {ano: '2018', t: quando('Em 2018 a primeira'), tApl: quando('deu abaixo'), min: 33.15, apl: 31.76, apl2: 35.45, t2: quando('fechou em 35'), abaixo: true},
  {ano: '2023', t: quando('Em 2023 foram'), tApl: quando('foram 57'), min: 55.63, apl: 57.43, abaixo: false},
  {ano: '2024', t: quando('Em 2024 a propria prefeitura'), tApl: quando('declarou 68'), min: 67.89, apl: 68.37, abaixo: false, decl: true},
  {ano: '2025', t: quando('Em 2025 declarou'), tApl: quando('declarou 85'), min: 83.39, apl: 85.74, abaixo: false, decl: true},
];
const ESC_M = 2;
const posMin = (i: number): V3 => [-4.4 + i * 2.2, 0, 1.1];
const MIN_DX: V3 = [-0.45, 0, 0];
const APL_DX: V3 = [0.5, 0, 0.1];
const MIN_VIS = (t: number) => vis(t, T.imp - 0.1, T.onde - 0.1);

// ---------- 4. Para onde foi em 2025 (1 pilha = R$ 2 mi), as pilhas saem do posto ----------
type Acao = {id: string; t: number; t25: number; v24: number; v: number; nome: string; sub: string};
const ACOES: Acao[] = [
  {id: 'mac', t: quando('Exames consultas especializadas'), t25: quando('caiu para 57'), v24: 74.14, v: 57.86, nome: 'EXAMES E HOSPITAL', sub: 'MÉDIA E ALTA COMPLEXIDADE'},
  {id: 'aps', t: quando('O principal programa'), t25: quando('para 25 e 500'), v24: 24.1, v: 25.49, nome: 'ATENÇÃO BÁSICA', sub: 'PROGRAMA PRINCIPAL'},
  {id: 'acs', t: quando('Os agentes comunitarios'), t25: quando('para 22 e 100'), v24: 14.147, v: 22.08, nome: 'AGENTES', sub: 'COMUNITÁRIOS DE SAÚDE'},
  {id: 'samu', t: quando('O SAMU'), t25: quando('para 9 e 100'), v24: 9.89, v: 9.13, nome: 'SAMU', sub: 'URGÊNCIA'},
  {id: 'farm', t: quando('E remedio e insumos'), t25: quando('para 4 e 700'), v24: 4.16, v: 4.71, nome: 'FARMÁCIA', sub: 'REMÉDIO E INSUMOS'},
];
const ESC_A = 2;
const POSTO_POS: V3 = [0, 0, -3.4];
const posAcao = (i: number): V3 => [-4.4 + i * 2.2, 0, 0.4];
const ACAO_VIS = (t: number) => vis(t, T.onde - 0.1, T.quem - 0.1);

// ---------- 5. Quem mais recebeu (1 pilha = R$ 4 mi), as pilhas voam do cofre ----------
type Emp = {id: string; x: number; t: number; tv: number; v: number; nome: string; sub: string};
const EMP: Emp[] = [
  {id: 'santa', x: -2.9, t: quando('A Santa Casa'), tv: quando('recebeu 73'), v: 73.18, nome: 'SANTA CASA DE ILHÉUS', sub: 'CNPJ 14.168.470/0001-73'},
  {id: 'hcm', x: 0, t: quando('O Hospital de Clinica'), tv: quando('51 milhoes'), v: 51.54, nome: 'HOSPITAL DO MALHADO', sub: 'CNPJ 18.779.564/0001-30'},
  {id: 'renal', x: 2.9, t: quando('E o Centro de Assistencia'), tv: quando('50 milhoes e 100'), v: 50.07, nome: 'CENTRO RENAL', sub: 'CNPJ 40.614.919/0001-90'},
];
const Z_EMP = -0.8;
const COFRE_POS: V3 = [0, 0, 2.5];
const posEmp = (e: Emp): V3 => [e.x, 0, Z_EMP];
const EMP_VIS = (t: number) => vis(t, T.quem - 0.1, T.trib - 0.1);

// ---------- 6. Tribunal ----------
const TCM_POS: V3 = [0, 0, -4.4];
const MED_VIS = (t: number) => vis(t, T.med - 0.2, T.aud - 0.1);
type PastaT = {titulo: string; valor: string; t: number; carimbo: number; texto: string; alerta: boolean; x: number};
const PASTAS_T: PastaT[] = [
  {titulo: 'CREDENCIAMENTO · 2023', valor: 'NO LUGAR DO CONCURSO', t: T.adv, carimbo: T.advert, texto: 'ADVERTÊNCIA', alerta: true, x: -3.6},
  {titulo: 'AUDITORIA · ATENÇÃO BÁSICA', valor: '2023', t: T.aud, carimbo: T.m5, texto: 'MULTA R$ 5 MIL', alerta: true, x: -1.2},
  {titulo: 'ALMOXARIFADO DA SAÚDE', valor: '2023', t: T.almox, carimbo: T.m2, texto: 'MULTA R$ 2 MIL', alerta: true, x: 1.2},
  {titulo: 'CONSELHO DE SAÚDE', valor: '2017 A 2022', t: T.cons, carimbo: T.seis + 0.6, texto: 'SEM PARECER', alerta: false, x: 3.6},
];
const TRIB_VIS = (t: number) => vis(t, T.trib - 0.1, T.dez - 0.1);
const TCM_VIS = (t: number) => vis(t, T.trib - 0.3, T.med + 0.4) + vis(t, T.adv - 0.3, T.dez - 0.2);
// médicos: 1 boneco = 7 médicos (63 = 9, 77 = 11)
const MED_EF: V3[] = Array.from({length: 9}, (_, i) => [-3.6 + (i % 3) * 0.62, 0, 0.5 + Math.floor(i / 3) * 0.62] as V3);
const MED_CR: V3[] = Array.from({length: 11}, (_, i) => [1.4 + (i % 4) * 0.62, 0, 0.5 + Math.floor(i / 4) * 0.62] as V3);

// ---------- 7. Fecho: 2016 x 2025 (1 pilha = R$ 4 mi) ----------
const FECHO_A: V3 = [-1.3, 0, 0.6];
const FECHO_B: V3 = [1.3, 0, 0.6];
const FECHO_VIS = (t: number) => vis(t, T.dez - 0.1, FIM + 2);

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function vis(t: number, a: number, b: number) {
  return entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
}
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;
const fmtV = (v: number) => (v < 1 ? `R$ ${Math.round(v * 1000 + 1e-9)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const ANDAR = 0.75;
const torre = (c: V3, n: number, lado: number, cor: string, passo = 0.3): Pilha[] => {
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
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const cresce = (t: number, a: number, d = 0.9) => rampa(t, a, a + d);
const voando = (t: number, de: V3, para: V3, n: number, lado: number, passo: number, t0: number, cor: string, out: Pilha[]) => {
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const alvo: V3 = [para[0] + ((k % lado) - (lado - 1) / 2) * passo, andar * ANDAR, para[2] + (Math.floor(k / lado) - (lado - 1) / 2) * passo];
    const a = t0 + j * 0.03;
    const kk = rampa(t, a, a + 0.7);
    if (kk <= 0) continue;
    out.push({p: kk >= 1 ? alvo : curva(de, alvo, 2.2, kk), n: Math.min(1, n - j), cor});
  }
};

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]} => {
  const C = coresOI(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const corFant = mistura(tema.objetoClaro, tema.texto, 0.3);
  // 1. bolo
  const bv = BOLO_VIS(t);
  if (bv > 0.01)
    BOLO.forEach((b, i) => {
      const ka = cresce(t, b.t + 0.5) * bv;
      if (ka > 0.01) fantasmas.push(...torre(soma(posBolo(i), ARR_DX), (b.arr / ESC_B) * ka, 2, corFant, 0.28));
      const ks = cresce(t, b.tS + 0.1) * bv;
      if (ks > 0.01) solidas.push(...torre(soma(posBolo(i), SAU_DX), (b.sau / ESC_B) * ks, 2, b.ano === '2025' ? tema.acento : C.ouro, 0.28));
    });
  // 2. SUS: voa da base do governo federal
  const sv = SUS_VIS(t);
  if (sv > 0.01) {
    const out: Pilha[] = [];
    SUS.forEach((s, i) => voando(t, soma(SUS_DE, [0, 0.6, 0]), soma(posSus(i), s.prev ? [0.42, 0, 0.08] : [0, 0, 0]), s.v / ESC_S, 3, 0.28, (s.tC ?? s.t) + 0.1, C.ouro, out));
    out.forEach((p) => solidas.push({...p, n: p.n * sv}));
    SUS.forEach((s, i) => {
      if (!s.prev) return;
      const kp = cresce(t, s.t + 0.6) * sv;
      if (kp > 0.01) fantasmas.push(...torre(soma(posSus(i), [-0.42, 0, 0]), (s.prev / ESC_S) * kp, 3, corFant, 0.28));
    });
  }
  // 3. mínimo
  const mv = MIN_VIS(t);
  if (mv > 0.01)
    MIN.forEach((m, i) => {
      const kp = cresce(t, m.t + 0.4) * mv;
      if (kp > 0.01) fantasmas.push(...torre(soma(posMin(i), MIN_DX), (m.min / ESC_M) * kp, 3, corFant, 0.3));
      const ka = cresce(t, m.tApl + 0.1) * mv;
      const extra = m.apl2 && m.t2 ? (m.apl2 - m.apl) * cresce(t, m.t2 + 0.1) : 0;
      const cor = m.abaixo && extra < 0.5 ? C.alerta : C.ouro;
      if (ka > 0.01) solidas.push(...torre(soma(posMin(i), APL_DX), ((m.apl + extra) / ESC_M) * ka, 3, cor, 0.28));
    });
  // 4. para onde foi: saem do posto
  const av = ACAO_VIS(t);
  if (av > 0.01) {
    const out: Pilha[] = [];
    ACOES.forEach((a, i) => {
      voando(t, soma(POSTO_POS, [0, 1.2, 0]), soma(posAcao(i), [-0.45, 0.1, 0]), a.v24 / ESC_A, 3, 0.27, a.t + 0.3, mistura(C.ouro, tema.texto, 0.25), out);
      voando(t, soma(POSTO_POS, [0, 1.2, 0]), soma(posAcao(i), [0.45, 0.1, 0.08]), a.v / ESC_A, 3, 0.27, a.t25 + 0.05, a.id === 'mac' ? tema.acento : C.ouro, out);
    });
    out.forEach((p) => solidas.push({...p, n: p.n * av}));
  }
  // 5. empresas: voam do cofre
  const ev = EMP_VIS(t);
  if (ev > 0.01) {
    const out: Pilha[] = [];
    EMP.forEach((e) => voando(t, soma(COFRE_POS, [0, 1.2, 0]), soma(posEmp(e), [0, 0.1, 0.1]), e.v / 4, 3, 0.3, e.tv + 0.05, C.ouro, out));
    out.forEach((p) => solidas.push({...p, n: p.n * ev}));
  }
  // 7. fecho
  const fv = FECHO_VIS(t);
  if (fv > 0.01) {
    const ka = cresce(t, T.dez + 0.1) * fv;
    if (ka > 0.01) solidas.push(...torre(FECHO_A, (81.16 / 4) * ka, 3, C.ouro, 0.3));
    const kb = cresce(t, T.dobrou + 0.1, 1.2) * fv;
    if (kb > 0.01) solidas.push(...torre(FECHO_B, (184.89 / 4) * kb, 3, tema.acento, 0.3));
  }
  return {solidas, fantasmas};
};

const ARVORES: V3[] = [
  [-6.6, 0, 4.4],
  [6.4, 0, 4.6],
  [-7.4, 0, -2.6],
  [7.2, 0, -2.0],
];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  const neutro = mistura(C.ouro, tema.texto, 0.35);
  const sv = SUS_VIS(t);
  const av = ACAO_VIS(t);
  const ev = EMP_VIS(t);
  const tri = TRIB_VIS(t);
  const mdv = MED_VIS(t);
  const desceMed = 1 - rampa(t, T.adv - 0.3, T.adv + 0.4);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />
      ))}

      <PilhasDinheiro pilhas={solidas} max={2600} />
      <PilhasDinheiro pilhas={fantasmas} max={2600} opacidade={0.26} largura={1.12} />

      {/* 1. bolo */}
      {/* 2. SUS */}
      <BaseGaveta tema={tema} pos={SUS_DE} sobe={sv} larg={2.6} texto="SUS · GOVERNO FEDERAL" aceso={janela(t, T.vemSus, T.imp)} />
      <PostoSaude tema={tema} pos={FUNDO_POS} sobe={sv} aceso={janela(t, T.vemSus, T.imp)} escala={0.7} />
      {/* 3. mínimo */}
      <PastaProcesso tema={tema} pos={[0, 0, -1.6]} escala={0.8} sobe={MIN_VIS(t) * rampa(t, T.naoJulg - 0.1, T.naoJulg + 0.4)} titulo="CONTAS DE 2024 E 2025" valor="TCM-BA" carimbo={rampa(t, T.naoJulg + 1.0, T.naoJulg + 1.4)} textoCarimbo="SEM JULGAMENTO" corCarimbo={neutro} aceso={janela(t, T.naoJulg, T.onde)} />
      {/* 4. para onde foi */}
      <PostoSaude tema={tema} pos={POSTO_POS} sobe={av} aceso={janela(t, T.pega, T.quem)} escala={0.8} />
      {ACOES.map((a, i) => (
        <BaseNome key={a.id} tema={tema} pos={soma(posAcao(i), [0, 0, 0.9])} sobe={rampa(t, a.t - 0.2, a.t + 0.3) * av} larg={2.0} nomes={[[a.nome, 0]]} t={t} sub={a.sub} aceso={janela(t, a.t, i + 1 < ACOES.length ? ACOES[i + 1].t : T.quem)} />
      ))}
      {/* 5. quem mais recebeu */}
      {ev > 0.02 ? <CofreFGTS tema={tema} pos={soma(COFRE_POS, [0, -1.6 * (1 - Math.min(1, ev)), 0])} escala={0.55} abre={janela(t, T.tres, T.trib - 0.4)} trava={0} brilho={0.2} /> : null}
      {EMP.map((e) => (
        <BaseNome key={e.id} tema={tema} pos={soma(posEmp(e), [0, 0, 0])} sobe={rampa(t, e.t - 0.2, e.t + 0.4) * ev} larg={2.6} nomes={[[e.nome, 0]]} t={t} sub={e.sub} aceso={janela(t, e.t, T.trib)} />
      ))}
      {/* 6. Tribunal: médicos (1 boneco = 7 médicos) e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={TCM_VIS(t)} aceso={janela(t, T.trib, T.med, 0.5) + janela(t, T.adv, T.dez, 0.5)} />
      {MED_EF.map((p, i) => (
        <Boneco key={'e' + i} tema={tema} pos={p} rotY={0.1} escala={0.42 * mdv * desceMed * rampa(t, T.med + 0.2 + i * 0.04, T.med + 0.6 + i * 0.04)} cor={mistura(tema.pessoa, tema.ceuLuz, 0.25)} />
      ))}
      {MED_CR.map((p, i) => (
        <Boneco key={'c' + i} tema={tema} pos={p} rotY={-0.1} escala={0.42 * mdv * desceMed * rampa(t, T.cred - 0.3 + i * 0.04, T.cred + 0.1 + i * 0.04)} cor={tema.acento} />
      ))}
      {PASTAS_T.map((pa, i) => (
        <PastaProcesso key={i} tema={tema} pos={[pa.x, 0, 1.2]} rotY={-pa.x * 0.05} escala={0.8} sobe={tri * rampa(t, pa.t - 0.1, pa.t + 0.4)} titulo={pa.titulo} valor={pa.valor} carimbo={rampa(t, pa.carimbo, pa.carimbo + 0.4)} textoCarimbo={pa.texto} corCarimbo={pa.alerta ? C.alerta : neutro} aceso={janela(t, pa.t, i + 1 < PASTAS_T.length ? PASTAS_T[i + 1].t : T.dez)} />
      ))}
      {/* 7. fecho */}
      <BaseGaveta tema={tema} pos={soma(FECHO_A, [0, 0, 1.2])} sobe={FECHO_VIS(t)} larg={1.9} texto="2016" aceso={0.4} />
      <BaseGaveta tema={tema} pos={soma(FECHO_B, [0, 0, 1.2])} sobe={FECHO_VIS(t) * rampa(t, T.dobrou - 0.1, T.dobrou + 0.4)} larg={1.9} texto="2025" aceso={0.6} />
    </group>
  );
};

// ---------- Câmera (sempre girando no mesmo sentido) ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13.5, 11.5, [dx, 2.0, 1]);
const VER_BOLO = (i: number, b: Bolo): Cam => {
  const alt = Math.max(altTorre(Math.max(b.arr, b.sau) / ESC_B, 2), 2.2);
  return E(soma(posBolo(i), [0, alt * 0.55, 0]), 3.6, alt + 2.4, [-0.12 + i * 0.024, 0.75, 1]);
};
const VER_MIN = (i: number, m: Min): Cam => {
  const alt = Math.max(altTorre(Math.max(m.min, m.apl2 ?? m.apl) / ESC_M, 3), 2.2);
  return E(soma(posMin(i), [0, alt * 0.55, 0]), 4.0, alt + 2.6, [-0.1 + i * 0.06, 0.75, 1]);
};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, DE_CIMA()]]},
  // 1. bolo
  {
    ini: T.bolo - 0.2,
    arco: 0.03,
    chaves: [
      [T.bolo - 0.2, E([0, 1.4, 1.4], 8.6, 7.0, [-0.05, 1.4, 1])],
      ...BOLO.flatMap((b, i): [number, Cam][] => [
        [b.t - 0.05, VER_BOLO(i, b)],
        [(i + 1 < BOLO.length ? BOLO[i + 1].t : T.sus) - 0.45, VER_BOLO(i, b)],
      ]),
    ],
  },
  // 2. SUS
  {
    ini: T.sus - 0.1,
    arco: 0.03,
    chaves: [
      [T.sus - 0.1, E([-0.6, 1.0, -0.6], 10.6, 7.6, [-0.04, 1.4, 1])],
      [SUS[0].t - 0.1, E(soma(posSus(0), [0, 1.2, -0.6]), 5.2, 5.0, [-0.1, 1.0, 1])],
      [SUS[1].t - 0.1, E(soma(posSus(1), [0, 1.6, -0.4]), 5.0, 5.4, [-0.06, 1.0, 1])],
      [SUS[2].t - 0.1, E(soma(posSus(2), [0, 1.8, -0.4]), 5.0, 5.8, [-0.02, 1.0, 1])],
      [SUS[3].t - 0.1, E(soma(posSus(3), [0, 1.6, -0.4]), 5.0, 5.4, [0.02, 1.0, 1])],
      [T.imp - 0.3, E([0.8, 1.4, -0.4], 8.6, 6.6, [0.06, 1.2, 1])],
    ],
  },
  // 3. mínimo
  {
    ini: T.imp - 0.1,
    arco: 0.03,
    chaves: [
      [T.imp - 0.1, E([0, 1.4, 1.1], 9.6, 7.0, [-0.04, 1.2, 1])],
      ...MIN.flatMap((m, i): [number, Cam][] => [
        [m.t - 0.05, VER_MIN(i, m)],
        [(i + 1 < MIN.length ? MIN[i + 1].t : T.naoJulg) - 0.45, VER_MIN(i, m)],
      ]),
      [T.naoJulg + 0.1, E([0, 1.4, -0.8], 7.6, 6.4, [0.08, 1.2, 1])],
      [T.onde - 0.3, E([0, 1.4, -0.8], 7.4, 6.2, [0.1, 1.2, 1])],
    ],
  },
  // 4. para onde foi
  {
    ini: T.onde - 0.1,
    arco: 0.03,
    chaves: [
      [T.onde - 0.1, E([0, 1.2, -1.2], 11.0, 8.0, [-0.04, 1.3, 1])],
      ...ACOES.flatMap((a, i): [number, Cam][] => [
        [a.t - 0.1, E(soma(posAcao(i), [0, Math.max(1.2, altTorre(Math.max(a.v, a.v24) / ESC_A, 3) * 0.55), 0]), 3.8, Math.max(3.4, altTorre(Math.max(a.v, a.v24) / ESC_A, 3) + 2.4), [-0.1 + i * 0.04, 0.85, 1])],
        [(i + 1 < ACOES.length ? ACOES[i + 1].t : T.quem) - 0.4, E(soma(posAcao(i), [0, Math.max(1.2, altTorre(Math.max(a.v, a.v24) / ESC_A, 3) * 0.55), 0]), 3.9, Math.max(3.5, altTorre(Math.max(a.v, a.v24) / ESC_A, 3) + 2.5), [-0.08 + i * 0.04, 0.85, 1])],
      ]),
    ],
  },
  // 5. quem mais recebeu
  {
    ini: T.quem - 0.1,
    arco: 0.03,
    chaves: [
      [T.quem - 0.1, E([0, 1.0, 0.8], 10.2, 8.0, [-0.04, 1.4, 1])],
      ...EMP.flatMap((e, i): [number, Cam][] => [
        [e.t - 0.2, E(soma(posEmp(e), [0, 1.8, 0]), 4.2, 6.0, [-0.1 + i * 0.05, 0.9, 1])],
        [(i + 1 < EMP.length ? EMP[i + 1].t : T.trib) - 0.4, E(soma(posEmp(e), [0, 1.8, 0]), 4.4, 6.2, [-0.08 + i * 0.05, 0.9, 1])],
      ]),
    ],
  },
  // 6. Tribunal
  {
    ini: T.trib - 0.1,
    arco: 0.03,
    chaves: [
      [T.trib - 0.1, E([0, 1.4, -2.6], 7.4, 6.6, [-0.06, 1.2, 1])],
      [T.med - 0.1, E([-0.1, 0.9, 1.0], 8.8, 4.8, [-0.04, 0.9, 1])],
      [T.cred + 1.0, E([-0.1, 0.9, 1.0], 8.6, 4.7, [-0.02, 0.9, 1])],
      [T.adv - 0.2, E([-3.6, 1.0, 1.2], 3.4, 3.2, [-0.1, 0.8, 1])],
      [Math.max(T.advert + 0.7, T.aud - 0.5), E([-3.6, 1.0, 1.2], 3.3, 3.1, [-0.08, 0.8, 1])],
      [T.aud + 0.1, E([-1.2, 1.0, 1.2], 3.4, 3.2, [-0.04, 0.8, 1])],
      [Math.max(T.m5 + 1.2, T.almox - 0.5), E([-1.2, 1.0, 1.2], 3.3, 3.1, [-0.02, 0.8, 1])],
      [T.almox + 0.1, E([1.2, 1.0, 1.2], 3.4, 3.2, [0.02, 0.8, 1])],
      [Math.max(T.m2 + 0.7, T.cons - 0.4), E([1.2, 1.0, 1.2], 3.3, 3.1, [0.03, 0.8, 1])],
      [T.cons + 0.2, E([3.6, 1.0, 1.2], 3.4, 3.2, [0.06, 0.8, 1])],
      [T.seis + 1.4, E([3.6, 1.0, 1.2], 3.3, 3.1, [0.07, 0.8, 1])],
      [T.recurso - 0.2, E([0, 1.3, -0.6], 9.4, 6.8, [0.08, 1.2, 1])],
      [T.dez - 0.3, E([0, 1.3, -0.6], 9.2, 6.6, [0.1, 1.2, 1])],
    ],
  },
  // 7. fecho
  {
    ini: T.dez - 0.1,
    arco: 0.04,
    chaves: [
      [T.dez - 0.1, E([0, 2.4, 0.6], 6.2, 7.6, [0, 1.0, 1])],
      [T.porque + 0.2, E([0, 2.4, 0.6], 5.8, 7.4, [0.06, 0.9, 1])],
      [T.segue, E([0, 2.4, 0.6], 6.2, 7.8, [0.1, 1.0, 1])],
      [FIM, E([0, 1.2, 0.4], 12.0, 9.6, [0.25, 1.4, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.04, grua: 0.03});
};

// ---------- Folhas de PDF (mesmo id do site) ----------
const A0 = ACOES[0];
const pan = (b: Bolo, id: number, idA: number | null, doc: string, sub: string, pag: number, lp: string, vp: string, la: string, va: string, docA?: string, subA?: string, pagA?: number): Omit<Folha, 'b'>[] =>
  idA === null
    ? [{id, a: b.t, doc, sub, pag, linhas: [[lp, vp, true], [la, va, true]]}]
    : [
        {id, a: b.t, doc, sub, pag, linhas: [[lp, vp, true]]},
        {id: idA, a: b.tS, doc: docA ?? '', sub: subA ?? '', pag: pagA ?? 1, linhas: [[la, va, true]]},
      ];
const F0: Omit<Folha, 'b'>[] = [
  ...pan(BOLO[0], 2, null, 'Despesa Consolidada · Saúde', 'PCMGE015 · DEZEMBRO DE 2016', 24, 'Secretaria de Saúde · dotação inicial', '88.467.900,00', 'Secretaria de Saúde · liquidado', '81.155.784,58'),
  ...pan(BOLO[1], 3, 4, 'Lei Orçamentária Anual de 2017', 'LOA 2017 · PUBLICAÇÃO (CONTAS DE 2017)', 2, 'Secretaria de Saúde · fixado', '85.614.800,00', 'Função 10 · Saúde · realizada', '84.518.484,16', 'Anexo 9 · Despesa por Órgão e Função', 'CONTAS ANUAIS DE 2017', 10),
  ...pan(BOLO[2], 5, 6, 'Lei Orçamentária Anual de 2018', 'LOA 2018 · SAÚDE', 3, 'Saúde · fixado', '104.600.000,00', 'Função 10 · Saúde · realizada', '108.757.803,88', 'Anexo 9 · Despesa por Órgão e Função', 'CONTAS ANUAIS DE 2018', 12),
  ...pan(BOLO[3], 7, 8, 'Lei Orçamentária Anual de 2019', 'LOA 2019 · SAÚDE', 3, 'Saúde · fixado', '110.720.000,00', 'Função 10 · Saúde · realizada', '108.081.173,69', 'Anexo 9 · Despesa por Órgão e Função', 'CONTAS ANUAIS DE 2019', 12),
  ...pan(BOLO[4], 9, null, 'Despesa Orçamentária · Saúde', 'PCMGE015 · DEZEMBRO DE 2020 · ÓRGÃO 9', 77, 'Total do órgão · fixada', '98.261.888,00', 'Total do órgão · liquidado', '131.210.099,70'),
  ...pan(BOLO[5], 10, null, 'Despesa Orçamentária · Saúde', 'PCMGE015 · DEZEMBRO DE 2021 · ÓRGÃO 9', 79, 'Total do órgão · fixada', '110.503.000,00', 'Total do órgão · liquidado', '131.592.059,01'),
  ...pan(BOLO[6], 11, null, 'RREO · Despesa por Função', '6º BIMESTRE DE 2022 · ANEXO 2', 4, 'Saúde · dotação inicial', '119.413.070,00', 'Saúde · liquidada até o bimestre', '143.256.000,41'),
  ...pan(BOLO[7], 12, 13, 'Despesa Orçamentária · Saúde', 'PCMGE015 · SETEMBRO DE 2023 · ÓRGÃO 3', 111, 'Total do órgão · fixada', '153.883.000,00', 'Saúde · Secretaria + Fundo', '149.779.405,73', 'Anexo 9 · Despesa por Unidade e Função', 'CONTAS ANUAIS DE 2023', 4),
  ...pan(BOLO[8], 14, null, 'Despesa Orçamentária · Saúde', 'PCMGE015 · DEZEMBRO DE 2024 · ÓRGÃO 3', 107, 'Total do órgão · fixada', '172.843.581,65', 'Total do órgão · liquidado', '181.083.887,45'),
  ...pan(BOLO[9], 15, 16, 'RREO · Despesa por Função', '6º BIMESTRE DE 2025 · ANEXO 2', 3, 'Saúde · dotação inicial', '186.900.897,71', 'Saúde · total (Secretaria + Fundo)', '184.892.318,26', 'Anexo 9 · Despesa por Função', 'CONTAS ANUAIS DE 2025', 4),
  ...pan(BOLO[10], 17, null, 'Despesa Orçamentária Consolidada', 'PCMGE015 · AGOSTO DE 2026 · FUNDO DE SAÚDE', 17, 'Fundo Municipal de Saúde · inicial', '180.314.313,00', 'Liquidado até agosto', '127.265.202,42'),
  {id: 18, a: SUS[0].t, doc: 'Anexo 10 · Receita Orçada x Arrecadada', sub: 'CONTAS ANUAIS DE 2017', pag: 2, linhas: [['SUS · repasse fundo a fundo', '48.793.196,08', true]]},
  {id: 19, a: SUS[1].t, doc: 'Anexo X · Receita Orçada x Arrecadada', sub: 'CONTAS ANUAIS DE 2024', pag: 6, linhas: [['SUS · repasses fundo a fundo', '103.712.626,37', true]]},
  {id: 20, a: SUS[2].t, doc: 'Anexo 10 · Receita Orçada x Arrecadada', sub: 'CONTAS ANUAIS DE 2025', pag: 7, linhas: [['SUS · previsto', '111.227.000,00', true], ['SUS · arrecadado', '98.016.665,56', true]]},
  {id: 21, a: SUS[3].t, doc: 'Receita Orçamentária', sub: 'PCMGE016 · AGOSTO DE 2026', pag: 3, linhas: [['SUS · repasses fundo a fundo · acumulado', '81.647.757,55', true]]},
  {id: 22, a: MIN[0].t, doc: 'Voto · Contas de 2016 (07309e17)', sub: 'TCM-BA › DECISÕES · APLICAÇÃO EM SAÚDE', pag: 18, linhas: [['Aplicado em ações e serviços de saúde', '28.919.709,38', true], ['Resultado', 'ABAIXO DO MÍNIMO', true]]},
  {id: 23, a: MIN[1].t, doc: 'Voto · Contas de 2018 (04894e19)', sub: 'TCM-BA › DECISÕES · ITEM 11.3', pag: 31, linhas: [['Aplicado · primeira conta', '31.757.130,57', true], ['Aplicado · após a defesa', '35.451.735,71', true]]},
  {id: 24, a: MIN[2].t, doc: 'Voto · Contas de 2023 (07666e24)', sub: 'TCM-BA › DECISÕES · ITEM 7.2', pag: 11, linhas: [['Impostos e transferências (base)', '370.859.436,00', false], ['Aplicado após análise do TCM', '57.426.885,27', true]]},
  {id: 25, a: MIN[3].t, doc: 'RREO · Aplicação em Saúde (ASPS)', sub: '6º BIMESTRE DE 2024 · DECLARADO PELA PREFEITURA', pag: 24, linhas: [['Valor aplicado em ASPS', '68.373.929,57', true], ['Despesa mínima (15%)', '67.891.028,70', true]]},
  {id: 26, a: MIN[4].t, doc: 'RREO · Aplicação em Saúde (ASPS)', sub: '6º BIMESTRE DE 2025 · DECLARADO PELA PREFEITURA', pag: 22, linhas: [['Valor aplicado em ASPS', '85.744.934,29', true], ['Despesa mínima (15%)', '83.393.332,78', true]]},
  {id: 27, a: ACOES[0].t, doc: 'Ação 2023 · Média e alta complexidade', sub: 'PCMGE015 DE DEZEMBRO · LIQUIDADO', pag: 99, linhas: [['2024 · PCMGE015 dez/2024, pág. 99', '74.139.649,98', true], ['2025 · PCMGE015 dez/2025, pág. 21', '57.860.373,84', true]]},
  {id: 28, a: ACOES[1].t, doc: 'Ação 2048 · Incentivo da atenção primária', sub: 'PCMGE015 DE DEZEMBRO · LIQUIDADO', pag: 89, linhas: [['2024 · PCMGE015 dez/2024, pág. 89', '24.103.961,14', true], ['2025 · PCMGE015 dez/2025, pág. 18', '25.490.485,03', true]]},
  {id: 29, a: ACOES[2].t, doc: 'Ação 2049 · Agentes comunitários de saúde', sub: 'PCMGE015 DE DEZEMBRO · LIQUIDADO', pag: 90, linhas: [['2024 · PCMGE015 dez/2024, pág. 90', '14.146.945,00', true], ['2025 · PCMGE015 dez/2025, pág. 18', '22.082.017,43', true]]},
  {id: 30, a: ACOES[3].t, doc: 'Ação 2020 · SAMU', sub: 'PCMGE015 DE DEZEMBRO · LIQUIDADO', pag: 97, linhas: [['2024 · PCMGE015 dez/2024, pág. 97', '9.887.288,29', true], ['2025 · PCMGE015 dez/2025, pág. 21', '9.129.645,96', true]]},
  {id: 31, a: ACOES[4].t, doc: 'Ação 2046 · Assistência farmacêutica', sub: 'PCMGE015 DE DEZEMBRO · LIQUIDADO', pag: 87, linhas: [['2024 · PCMGE015 dez/2024, pág. 87', '4.158.223,81', true], ['2025 · PCMGE015 dez/2025, pág. 26', '4.708.396,99', true]]},
  {id: 32, a: EMP[0].t, doc: 'Relação de Pagamentos · Fundo de Saúde', sub: 'PCMGE056 · DEZEMBRO DE 2024 · PROCESSO 6562', pag: 31, linhas: [['Irmandade da Santa Casa de Misericórdia', '14.168.470/0001-73', false], ['Leitos de retaguarda · pago em 11/12/2024', '237.858,33', true]]},
  {id: 33, a: EMP[1].t, doc: 'Relação de Pagamentos · Fundo de Saúde', sub: 'PCMGE056 · DEZEMBRO DE 2024 · PROCESSO 6389', pag: 12, linhas: [['HCM · Hospital de Clínica do Malhado', '18.779.564/0001-30', false], ['Média e alta complexidade · 06/12/2024', '316.237,42', true]]},
  {id: 34, a: EMP[2].t, doc: 'Relação de Pagamentos · Fundo de Saúde', sub: 'PCMGE056 · DEZEMBRO DE 2024 · PROCESSO 6609', pag: 34, linhas: [['Centro de Assist. Integral ao Paciente Renal', '40.614.919/0001-90', false], ['Média e alta complexidade · 12/12/2024', '668.141,52', true]]},
  {id: 35, a: T.med, doc: 'Voto · Contas de 2022 (07770e23)', sub: 'TCM-BA › DECISÕES · CONTRATAÇÃO DE MÉDICOS', pag: 16, linhas: [['Médicos efetivos', '63', true], ['Médicos credenciados', '77', true]]},
  {id: 36, a: T.adv, doc: 'Termo de Ocorrência 21795e25', sub: 'GESTÃO EM SAÚDE · 2023 · JULGADO EM 06/05/2026', pag: 2, linhas: [['Inexigibilidades do credenciamento', '3.096.000,00', false], ['Decisão', 'PROCEDENTE · ADVERTÊNCIA', true]]},
  {id: 37, a: T.aud, doc: 'Auditoria 25682e23 · Atenção Primária', sub: 'TCM-BA · SESSÃO DE 04/06/2025', pag: 10, linhas: [['Decisão', 'PARCIALMENTE PROCEDENTE', false], ['Multa', '5.000,00', true]]},
  {id: 38, a: T.almox, doc: 'Representação 13909e23 · Almoxarifado', sub: 'TCM-BA · SESSÃO DE 29/04/2026', pag: 11, linhas: [['Decisão', 'PARCIALMENTE PROCEDENTE', false], ['Multa', '2.000,00', true]]},
  {id: 39, a: T.cons, doc: 'Voto · Contas de 2019 (06442e20)', sub: 'UM DOS SEIS ANOS (2017 A 2022)', pag: 23, linhas: [['Parecer do Conselho Municipal de Saúde', 'NÃO CONSTA DOS AUTOS', true]]},
];
const FOLHAS: Folha[] = F0.sort((x, y) => x.a - y.a).map((f, i, arr) => {
  const prox = i + 1 < arr.length ? arr[i + 1].a : 1e9;
  return {...f, b: Math.max(f.a + 2.6, Math.min(f.a + 3.6, prox - 0.05))};
});
const TOPO_FOLHA = 470;
const folhaEm = (t: number) => FOLHAS.filter((f) => t >= f.a - 0.05 && t < f.b + 0.05).pop();

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.bolo, b: BOLO[0].t, texto: 'SAÚDE · O QUE O ORÇAMENTO PREVIU x O QUE FOI APLICADO'},
  {a: T.maior, b: BOLO[10].t, texto: '2025: O MAIOR VALOR APLICADO DOS DEZ ANOS', destaque: true},
  {a: T.sus, b: SUS[0].t, texto: 'BOA PARTE VEM DO SUS, DO GOVERNO FEDERAL'},
  {a: T.lei, b: MIN[0].t, texto: 'A LEI MANDA SEPARAR UMA PARTE FIXA DOS IMPOSTOS'},
  {a: T.compensar, b: MIN[1].t, texto: '2016: ABAIXO DO MÍNIMO · COMPENSAR NO ANO SEGUINTE', destaque: true},
  {a: T.raspando, b: MIN[3].t, texto: '2023: PASSOU RASPANDO', destaque: true},
  {a: quando('Passou por menos'), b: MIN[4].t, texto: '2024: MENOS DE R$ 500 MIL ACIMA DO MÍNIMO (DECLARADO)', destaque: true},
  {a: T.naoJulg, b: T.onde, texto: 'CONTAS DE 2024 E 2025: AINDA SEM JULGAMENTO NO TCM'},
  {a: T.pega, b: A0.t, texto: 'DENTRO DA SAÚDE · 2024 x 2025'},
  {a: T.tres, b: EMP[0].t, texto: 'OS TRÊS PRIMEIROS: HOSPITAIS E CLÍNICAS DO SUS'},
  {a: T.recurso, b: T.dez, texto: 'MULTA DO TCM É DECISÃO ADMINISTRATIVA · CABE RECURSO'},
  {a: T.dez, b: T.dobrou, texto: 'DEZ ANOS E TRÊS GESTÕES'},
  {a: T.dobrou, b: T.porque, texto: 'SAÚDE: DE R$ 81 MI (2016) A R$ 185 MI (2025)', destaque: true},
  {a: T.porque, b: T.segue, texto: 'IMPOSTOS DA CIDADE NA SAÚDE: PERTO DO MÍNIMO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.bolo, b: T.sus, texto: 'FONTE: LOA, PCMGE015, RREO E ANEXO 9 · e-TCM · TCM-BA'},
  {a: T.sus, b: T.imp, texto: 'FONTE: ANEXO 10 E PCMGE016 · e-TCM · TCM-BA'},
  {a: T.imp, b: T.onde, texto: 'FONTE: TCM-BA › DECISÕES E RREO (2024, 2025)'},
  {a: T.onde, b: T.quem, texto: 'FONTE: PCMGE015 DE DEZEMBRO DE 2024 E 2025 · LIQUIDADO'},
  {a: T.quem, b: T.trib, texto: 'FONTE: PCMGE056 DO FUNDO DE SAÚDE 2021–AGO/2026 · CONTA PRÓPRIA'},
  {a: T.trib, b: T.dez, texto: 'FONTE: TCM-BA › DECISÕES (10/11/2026)'},
  {a: T.dez, b: T.segue, texto: 'FONTE: PCMGE015 DE 2016 E ANEXO 9 DE 2025 · TCM-BA'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const r: Rot[] = [];
  const fant = mistura(tema.objetoClaro, tema.texto, 0.4);
  BOLO.forEach((b, i) => {
    const fim = i + 1 < BOLO.length ? BOLO[i + 1].t + 0.6 : T.sus - 0.2;
    r.push({a: b.t + 1.0, b: fim, p: soma(posBolo(i), [-0.3, altTorre(b.arr / ESC_B, 2) + 0.3, 0]), valor: `PREVIU ${fmtV(b.arr)}`, sub: b.ano, cor: fant});
    r.push({a: b.tS + 0.5, b: fim, p: soma(posBolo(i), [0.32, altTorre(b.sau / ESC_B, 2) + 0.25, 0.08]), valor: `${b.ano.startsWith('2026') ? 'ATÉ AGO ' : 'APLICOU '}${fmtV(b.sau)}`, cor: b.ano === '2025' ? tema.acento : C.ouro});
  });
  SUS.forEach((s, i) => {
    if (s.prev) r.push({a: s.t + 1.2, b: T.imp - 0.2, p: soma(posSus(i), [-0.42, altTorre(s.prev / ESC_S, 3) + 0.3, 0]), valor: `PREVISTO ${fmtV(s.prev)}`, sub: 'SUS · 2025', cor: fant});
    r.push({a: (s.tC ?? s.t) + 1.0, b: T.imp - 0.2, p: soma(posSus(i), [s.prev ? 0.42 : 0, altTorre(s.v / ESC_S, 3) + 0.3, 0]), valor: s.prev ? `CHEGOU ${fmtV(s.v)}` : fmtV(s.v), sub: s.prev ? undefined : `SUS · ${s.ano}`, cor: C.ouro});
  });
  MIN.forEach((m, i) => {
    const fim = T.onde - 0.2;
    r.push({a: m.t + 0.9, b: fim, p: soma(posMin(i), [-0.45, altTorre(m.min / ESC_M, 3) + 0.3, 0]), valor: `MÍNIMO ≈ ${fmtV(m.min)}`, sub: m.ano, cor: fant});
    const v = m.apl2 && m.t2 ? m.apl2 : m.apl;
    r.push({a: m.tApl + 0.6, b: m.t2 ? m.t2 + 0.3 : fim, p: soma(posMin(i), [0.5, altTorre(m.apl / ESC_M, 3) + 0.25, 0.1]), valor: `${m.decl ? 'DECLAROU' : 'APLICOU'} ${fmtV(m.apl)}`, sub: m.t2 ? 'PRIMEIRA CONTA' : m.decl ? 'PELA PREFEITURA' : undefined, cor: m.abaixo ? C.alerta : C.ouro});
    if (m.t2) r.push({a: m.t2 + 0.6, b: fim, p: soma(posMin(i), [0.5, altTorre(v / ESC_M, 3) + 0.25, 0.1]), valor: `APÓS A DEFESA ${fmtV(v)}`, cor: C.ouro});
  });
  ACOES.forEach((a, i) => {
    r.push({a: a.t + 0.9, b: T.quem - 0.2, p: soma(posAcao(i), [-0.45, altTorre(a.v24 / ESC_A, 3) + 0.3, 0]), valor: fmtV(a.v24), sub: '2024', cor: mistura(C.ouro, tema.texto, 0.25)});
    r.push({a: a.t25 + 0.8, b: T.quem - 0.2, p: soma(posAcao(i), [0.45, altTorre(a.v / ESC_A, 3) + 0.3, 0.08]), valor: fmtV(a.v), sub: '2025', cor: a.id === 'mac' ? tema.acento : C.ouro});
  });
  EMP.forEach((e) => {
    r.push({a: e.tv + 0.7, b: T.trib - 0.2, p: soma(posEmp(e), [0, altTorre(e.v / 4, 3) + 0.35, 0]), valor: fmtV(e.v), sub: '2021 A AGO/2026', cor: C.ouro});
  });
  r.push({a: T.med + 0.9, b: T.adv - 0.2, p: [-3.0, 1.2, 1.1], valor: '63 CONCURSADOS', sub: 'MÉDICOS · 2022'});
  r.push({a: T.cred + 0.5, b: T.adv - 0.2, p: [2.3, 1.2, 1.1], valor: '77 CREDENCIADOS', sub: 'MÉDICOS · 2022', cor: tema.acento});
  r.push({a: T.dez + 0.8, b: T.segue + 0.3, p: soma(FECHO_A, [0, altTorre(81.16 / 4, 3) + 0.3, 0]), valor: 'R$ 81,2 MI', sub: 'SAÚDE · 2016', cor: C.ouro});
  r.push({a: T.dobrou + 1.0, b: T.segue + 0.3, p: soma(FECHO_B, [0, altTorre(184.89 / 4, 3) + 0.3, 0]), valor: 'R$ 184,9 MI', sub: 'SAÚDE · 2025', cor: tema.acento});
  return r;
};

const noMapa = (t: number) => t < T.bolo;
const soMapa = (t: number) => t < T.bolo - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.bolo) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const escK = Math.max(vis(t, T.bolo, T.onde), vis(t, T.onde, T.trib), vis(t, T.dez, FIM));
  const escTxt =
    t < T.sus ? '1 PILHA = R$ 10 MI · TRANSPARENTE = PREVISTO' : t < T.imp ? '1 PILHA = R$ 4 MI · TRANSPARENTE = PREVISTO' : t < T.onde ? '1 PILHA = R$ 2 MI · TRANSPARENTE = MÍNIMO' : t < T.quem ? '1 PILHA = R$ 2 MI' : '1 PILHA = R$ 4 MI';
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', alignItems: 'center', gap: 10}}>
      {seloAtual && !folha ? (
        <div style={{opacity: Math.min(1, visivel(seloAtual, t)), padding: '8px 14px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 52 ? 14 : 16, fontWeight: 700, letterSpacing: 1.0, color: tema.texto, whiteSpace: 'nowrap'}}>{seloAtual.texto}</div>
      ) : null}
    </div>
  );
  const chip = folha ? undefined : CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const yMin = folha ? 900 : 760;
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 200 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 130, Math.min(SEGURO.botoesX - 130, pj.x)), y: Math.max(yMin, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10) + 34;
  const alt = (r: Rot) => (r.sub ? 72 : 56);
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < Math.max(alt(o.r), alt(rots[a].r)));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-75, 75, -150, 150, -225, 225].map((d) => y0 + d).filter((y) => y >= yMin && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  return (
    <>
      {cabecalho}
      {escK > 0.01 && !folha ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 30, top: TOPO_SELO + 44, opacity: Math.min(1, escK) * 0.95, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 14, height: 14, borderRadius: 7, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 13, fontWeight: 800, letterSpacing: 1.0, color: tema.texto}}>{escTxt}</div>
        </div>
      ) : null}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_CHIP, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 52 ? 15 : chip.texto.length > 44 ? 18 : chip.texto.length > 32 ? 22 : 28} />
        </div>
      ) : null}
      {FOLHAS.filter((f) => t >= f.a - 0.05 && t < f.b + 0.05).map((f) => (
        <FolhaPdf key={f.id} tema={tema} t={t} f={f} top={TOPO_FOLHA} />
      ))}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 28 : 25, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.2, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/saudeilheus10.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera em números grandes ----------
const SOQUINHOS = [...BOLO.map((b) => b.tS), ...SUS.map((s) => (s.tC ?? s.t) + 0.6), ...MIN.map((m) => m.tApl), T.abaixo, T.raspando, ...EMP.map((e) => e.tv), T.advert, T.m5, T.m2, T.porque];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  BOLO.forEach((b) => s.push({t: b.tS + 0.15, f: 'subida', v: 0.13}));
  SUS.forEach((x) => s.push({t: x.t + 0.2, f: 'pop', v: 0.15}));
  MIN.forEach((m) => s.push({t: m.tApl + 0.15, f: 'subida', v: 0.13}));
  ACOES.forEach((a) => s.push({t: a.t + 0.15, f: 'pop', v: 0.14}, {t: a.t25 + 0.1, f: 'pop', v: 0.13}));
  EMP.forEach((e) => s.push({t: e.tv + 0.1, f: 'subida', v: 0.14}));
  [T.abaixo, T.advert, T.m5, T.m2, T.seis + 0.6].forEach((x) => s.push({t: x + 0.05, f: 'impacto', v: 0.13}));
  [T.fechou, T.raspando, T.naoJulg + 1.0].forEach((x) => s.push({t: x + 0.1, f: 'pop', v: 0.15}));
  [T.dobrou + 0.1, T.porque + 0.3].forEach((x) => s.push({t: x, f: 'baque', v: 0.17}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala
export const REVISAO: number[] = [
  0.6, 2.5, 4.8, 7.8, 11.0, T.bolo + 0.8,
  ...BOLO.flatMap((b) => [b.t + 1.2, b.tS + 1.0]),
  T.maior + 0.5,
  T.sus + 0.8, T.vemSus + 1.5, ...SUS.flatMap((s) => [s.t + 0.6, (s.tC ?? s.t) + 1.6]),
  T.imp + 0.8, T.lei + 1.0, ...MIN.flatMap((m) => [m.t + 0.8, m.tApl + 1.0]), T.compensar + 0.6, T.fechou + 1.0, T.min23 + 1.0, T.raspando + 0.5, T.naoJulg + 1.6, T.olha + 0.5,
  T.onde + 0.6, T.pega + 0.6, ...ACOES.flatMap((a) => [a.t + 1.2, a.t25 + 1.0]),
  T.quem + 0.6, T.tres + 1.0, ...EMP.flatMap((e) => [e.t + 0.8, e.tv + 1.2]),
  T.trib + 0.6, T.med + 1.2, T.cred + 1.0, T.adv + 1.0, T.advert + 0.8, T.aud + 1.5, T.m5 + 0.8, T.almox + 1.2, T.m2 + 0.6, T.cons + 1.2, T.seis + 1.2, T.recurso + 1.0,
  T.dez + 0.8, T.dobrou + 1.2, T.porque + 1.5, T.porque + 4.0, T.segue + 0.4, T.segue + 1.8, FIM - 0.4,
].filter((x) => x < FIM);

// marca d'água quicando, pequena e sutil (só @eumagnoleite)
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

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const SaudeIlheus10: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
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
      <CabecalhoCidade tema={tema} cidade="ILHÉUS" t={t} final={T.segue} yAbertura={445} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Abaixo do', 'mínimo da', 'saúde em', '2016.'];
export const CapaSaudeIlheus10: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 450}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoCidade tema={tema} cidade="ILHÉUS · 2016–2026" t={10} />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 300}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 110 : 128, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
