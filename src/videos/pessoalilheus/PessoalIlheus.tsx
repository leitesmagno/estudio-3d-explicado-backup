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
import {ArvoreRedonda, CalendarioGrande} from '../../pecas';
import {MesaMaquete, PilhasDinheiro, PlacaProibido, PredioTCM, Prefeitura, ReguaLimite, coresOI, yRegua, type Pilha} from '../orcamentoitabuna/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {PALAVRAS} from './palavras';

// 153. Ilhéus: gasto com pessoal x Lei de Responsabilidade Fiscal (pedido do Magno, 13/11/2026).
// Molde: 127 (folhas de PDF desenhadas, mapa do Kit Mapas no gancho, só @eumagnoleite). Sem nome de gestor.
// Números: RGF/SICONFI (Executivo), MSC do Tesouro (mai–set 2025 x 2026) e e-TCM. Fontes: projetos/153.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 191.39; // Algenib 1,3, pausas 0,28 s, atempo 1,15, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '153. ilhéus pessoal e lrf';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  lei: quando('Existe uma lei'),
  efetivo: quando('servidor efetivo'),
  comiss: quando('comissionado'),
  contrat: quando('contratado'),
  apos: quando('aposentado'),
  terc: quando('terceirizado'),
  conta12: quando('A conta e sempre'),
  pega: quando('Pega tudo'),
  divide: quando('divide pela'),
  teto0: quando('O teto da Prefeitura'),
  avisos: quando('Mas antes do teto'),
  d1: quando('Primeiro degrau'),
  d2: quando('Segundo degrau'),
  proibe: quando('ja proibe'),
  aumento: quando('dar aumento'),
  cargo: quando('criar cargo'),
  contratar: quando('contratar ou nomear'),
  hora: quando('pagar hora extra'),
  repor: quando('So pode repor'),
  d3: quando('Terceiro degrau'),
  passou: quando('Passou a Prefeitura'),
  seNao: quando('Se nao cortar'),
  conv: quando('receber convenios'),
  contaJ: quando('Agora vamos fazer'),
  bruto: quando('Gasto bruto'),
  v484: quando('484,9'),
  tirar: quando('A lei deixa tirar'),
  v42: quando('42,3'),
  sobra: quando('Sobra'),
  v442: quando('442,6'),
  rcl: quando('Receita corrente liquida R$'),
  div: quando('dividido por'),
  res: quando('824,9: 53,66%'),
  refiz: quando('Eu refiz'),
  teto: quando('O teto de 54%'),
  folga: quando('a folga era'),
  dias: quando('dois dias'),
  prud: quando('E o limite prudencial ja'),
  hist: quando('Isso nao aconteceu'),
  h24: quando('No ano de 2024'),
  h25: quando('Em 2025'),
  h26: quando('E agora'),
  subiu: quando('Subiu ano'),
  cresc: quando('E dentro da folha'),
  temp: quando('contratacao temporaria'),
  v19: quando('19,3'),
  v23: quando('23,9'),
  alta: quando('Alta de quase'),
  efet: quando('Os salarios de efetivos'),
  v75: quando('7,5%'),
  parte: quando('Parte disso'),
  piso: quando('o piso dos professores'),
  revisao: quando('a revisao dos servidores'),
  ponto: quando('Agora o atraso'),
  rel: quando('O relatorio seguinte'),
  prazo: quando('30 de setembro', 2),
  ate13: quando('Ate 13 de novembro nao estava'),
  d44: quando('44 dias de atraso'),
  pelaLei: quando('Pela lei'),
  tcm: quando('No Tribunal de Contas dos'),
  venceu: quando('venceu em 31'),
  pend: quando('continuava pendente'),
  d13: quando('13 dias de atraso'),
  primeira: quando('E nao e a primeira vez'),
  fecho: quando('Eu nao estou dizendo'),
  oficial: quando('O ultimo numero oficial'),
  colado: quando('a prestacao de contas esta atrasada'),
  mostraria: quando('justo o relatorio que mostraria'),
  olho: quando('fica de olho'),
  segue: quando('Me segue'),
};

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function vis(t: number, a: number, b: number) {
  return entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
}
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
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

// ---------- Cena 1: a regra (lei → conta juntos) ----------
const C1 = (t: number) => vis(t, T.lei - 0.2, T.contaJ - 0.1);
const PREF_POS: V3 = [-2.6, 0, -2.2];
const REGUA1: V3 = [2.6, 0, -0.4];
type Tipo = {nome: string; t: number; p: V3};
const TIPOS: Tipo[] = [
  {nome: 'EFETIVO', t: T.efetivo, p: [-4.2, 0, 0.6]},
  {nome: 'COMISSIONADO', t: T.comiss, p: [-3.3, 0, 1.3]},
  {nome: 'CONTRATADO', t: T.contrat, p: [-2.4, 0, 0.6]},
  {nome: 'APOSENTADO', t: T.apos, p: [-1.5, 0, 1.3]},
  {nome: 'TERCEIRIZADO', t: T.terc, p: [-0.6, 0, 0.6]},
];
// de cada R$ 100: 1 pilha = R$ 1
const CEM_POS: V3 = [-0.4, 0, 2.6];
const PES_POS: V3 = [0.9, 0, 2.6];
const PROIB: {texto: string; t: number; x: number}[] = [
  {texto: 'AUMENTO', t: T.aumento, x: -3.3},
  {texto: 'CARGO NOVO', t: T.cargo, x: -1.1},
  {texto: 'CONTRATAR', t: T.contratar, x: 1.1},
  {texto: 'HORA EXTRA', t: T.hora, x: 3.3},
];
const PROIB_Z = 3.4;
const PROIB_VIS = (t: number) => vis(t, T.proibe - 0.2, T.d3 - 0.1);
const nivel1 = (t: number) => {
  // a régua enche até o degrau falado e, no fim, até Ilhéus
  // vazia na regra; sobe degrau por degrau: 48,6 → 51,3 → 54
  const a = 48.6 * cresce(t, T.d1 + 0.1, 1.0);
  const b = (51.3 - 48.6) * cresce(t, T.d2 + 0.1, 0.8);
  const c = (54 - 51.3) * cresce(t, T.d3 + 0.1, 0.8);
  return a + b + c;
};

// ---------- Cena 2: a conta (1 pilha = R$ 10 mi) ----------
const C2 = (t: number) => vis(t, T.contaJ - 0.1, T.hist - 0.1);
const BRUTO_POS: V3 = [-2.4, 0, 0.4];
const DESC_POS: V3 = [-4.6, 0, 2.2];
const RCL_POS: V3 = [0.6, 0, 0.4];
const REGUA2: V3 = [3.4, 0, 0.0];
const BRUTO = 484.896;
const NAO_COMP = 42.282;
const DTP = 442.615;
const RCL = 824.871;
const ESC = 10;
const LADO = 3;

// ---------- Cena 3: ano após ano (três réguas) ----------
const C3 = (t: number) => vis(t, T.hist - 0.1, T.cresc - 0.1);
const HIST = [
  {ano: '2024', t: T.h24, v: 45.96, x: -2.6},
  {ano: '2025', t: T.h25, v: 50.52, x: 0},
  {ano: 'MAI/25–ABR/26', t: T.h26, v: 53.66, x: 2.6},
];

// ---------- Cena 4: o que mais cresceu (mai–set) ----------
const C4 = (t: number) => vis(t, T.cresc - 0.1, T.ponto - 0.1);
const TEMP = {a: 19.325, b: 23.91};
const EFET = {a: 114.406, b: 122.972};
const posTemp = (k: number): V3 => [-2.6 + k * 1.4, 0, 0.4];
const posEfet = (k: number): V3 => [1.3 + k * 1.6, 0, 0.4];

// ---------- Cena 5: o que falta ----------
const C5 = (t: number) => vis(t, T.ponto - 0.1, T.fecho - 0.1);
const TES_POS: V3 = [-2.2, 0, 0.2];
const TCM_POS: V3 = [2.4, 0, -2.0];

// ---------- Cena 6: fecho ----------
const C6 = (t: number) => vis(t, T.fecho - 0.1, FIM + 2);
const REGUA6: V3 = [1.3, 0, 0.6];
const PASTA6: V3 = [-1.3, 0, 1.4];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]} => {
  const C = coresOI(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const corFant = mistura(tema.objetoClaro, tema.texto, 0.3);
  // 1. de cada R$ 100
  const v1 = C1(t) * janela(t, T.pega - 0.2, T.d1 - 0.2);
  if (v1 > 0.01) {
    const kr = cresce(t, T.divide + 0.1);
    if (kr > 0.01) fantasmas.push(...torre(CEM_POS, 100 * kr * v1, 4, corFant, 0.28));
    const kp = cresce(t, T.pega + 0.3);
    if (kp > 0.01) solidas.push(...torre(PES_POS, 53.66 * kp * v1, 4, tema.acento, 0.28));
  }
  // 2. a conta
  const v2 = C2(t);
  if (v2 > 0.01) {
    const kb = cresce(t, T.v484, 1.2) * v2;
    const sai = rampa(t, T.v42 + 0.1, T.v42 + 1.1);
    const nDesc = NAO_COMP / ESC;
    const nFica = (BRUTO - NAO_COMP) / ESC;
    // a parte que fica
    if (kb > 0.01) solidas.push(...torre(BRUTO_POS, nFica * kb, LADO, sai > 0.5 ? tema.acento : C.ouro));
    // a parte descontada: em cima da torre e depois voando para o canto
    if (kb > 0.01) {
      const base = torre(soma(BRUTO_POS, [0, 0, 0]), (nFica + nDesc) * kb, LADO, C.ouro).slice(Math.ceil(nFica));
      const alvo = torre(DESC_POS, nDesc, LADO, mistura(C.ouro, tema.texto, 0.35));
      base.forEach((p, j) => {
        const a = alvo[j] ?? alvo[alvo.length - 1];
        const kk = rampa(t, T.v42 + 0.1 + j * 0.04, T.v42 + 0.9 + j * 0.04);
        solidas.push({p: kk <= 0 ? p.p : kk >= 1 ? a.p : curva(p.p, a.p, 1.6, kk), n: p.n * v2, cor: kk > 0.5 ? a.cor : p.cor});
      });
    }
    const kr = cresce(t, T.rcl + 0.4, 1.4) * v2;
    if (kr > 0.01) fantasmas.push(...torre(RCL_POS, (RCL / ESC) * kr, LADO, corFant));
  }
  // 4. o que mais cresceu: temporários 1 pilha = R$ 1 mi, efetivos 1 pilha = R$ 5 mi
  const v4 = C4(t);
  if (v4 > 0.01) {
    const ka = cresce(t, T.v19 + 0.1) * v4;
    if (ka > 0.01) solidas.push(...torre(posTemp(0), TEMP.a * ka, 3, mistura(C.ouro, tema.texto, 0.3), 0.28));
    const kb = cresce(t, T.v23 + 0.1) * v4;
    if (kb > 0.01) solidas.push(...torre(posTemp(1), TEMP.b * kb, 3, tema.acento, 0.28));
    const ke = cresce(t, T.efet + 0.4) * v4;
    if (ke > 0.01) solidas.push(...torre(posEfet(0), (EFET.a / 5) * ke, 3, mistura(C.ouro, tema.texto, 0.3), 0.28));
    const kf = cresce(t, T.v75 + 0.1) * v4;
    if (kf > 0.01) solidas.push(...torre(posEfet(1), (EFET.b / 5) * kf, 3, C.ouro, 0.28));
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
  const c1 = C1(t);
  const c3 = C3(t);
  const c5 = C5(t);
  const c6 = C6(t);
  const neutro = mistura(C.ouro, tema.texto, 0.35);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />
      ))}
      <PilhasDinheiro pilhas={solidas} max={2400} />
      <PilhasDinheiro pilhas={fantasmas} max={2400} opacidade={0.26} largura={1.12} />

      {/* 1. a regra */}
      <Prefeitura tema={tema} pos={PREF_POS} sobe={c1 * (1 - rampa(t, T.proibe - 0.4, T.proibe))} aceso={janela(t, T.lei, T.efetivo)} escala={0.8} />
      {TIPOS.map((b, i) => (
        <Boneco key={i} tema={tema} pos={b.p} rotY={0.2} escala={0.5 * c1 * rampa(t, b.t - 0.15, b.t + 0.25) * (1 - rampa(t, T.pega - 0.3, T.pega + 0.1))} cor={i === 2 ? tema.acento : mistura(tema.pessoa, tema.ceuLuz, 0.2 * i)} />
      ))}
      <ReguaLimite tema={tema} pos={REGUA1} sobe={c1 * rampa(t, T.lei, T.lei + 0.6)} nivel={nivel1(t)} prudencial={rampa(t, T.d2, T.d2 + 0.6)} maximo={rampa(t, T.d3, T.d3 + 0.6)} />
      {PROIB.map((p, i) => (
        <PlacaProibido key={i} tema={tema} pos={[p.x, 0, PROIB_Z]} texto={p.texto} escala={1.2 * PROIB_VIS(t) * rampa(t, p.t - 0.15, p.t + 0.3)} x={rampa(t, p.t + 0.45, p.t + 0.85)} />
      ))}
      <PastaProcesso tema={tema} pos={[-1.6, 0, 1.6]} escala={0.9} sobe={c1 * janela(t, T.passou - 0.2, T.contaJ - 0.3)} titulo="CONVÊNIOS E EMPRÉSTIMOS" valor="ACIMA DE 54%" carimbo={rampa(t, T.conv, T.conv + 0.4)} textoCarimbo="BLOQUEADOS" corCarimbo={C.alerta} aceso={janela(t, T.passou, T.contaJ)} />

      {/* 2. a conta */}
      <BaseGaveta tema={tema} pos={soma(BRUTO_POS, [0, 0, 1.2])} sobe={C2(t) * rampa(t, T.bruto - 0.2, T.bruto + 0.3)} larg={2.0} texto={t < T.sobra ? 'GASTO BRUTO' : 'GASTO QUE CONTA'} aceso={janela(t, T.bruto, T.rcl)} />
      <BaseGaveta tema={tema} pos={soma(DESC_POS, [0, 0, 1.1])} sobe={C2(t) * rampa(t, T.tirar, T.tirar + 0.4)} larg={2.0} texto="FORA DA CONTA" aceso={janela(t, T.tirar, T.sobra)} />
      <BaseGaveta tema={tema} pos={soma(RCL_POS, [0, 0, 1.2])} sobe={C2(t) * rampa(t, T.rcl - 0.2, T.rcl + 0.3)} larg={2.2} texto="RECEITA (RCL)" aceso={janela(t, T.rcl, T.div)} />
      <ReguaLimite tema={tema} pos={REGUA2} sobe={C2(t) * rampa(t, T.div - 0.2, T.div + 0.4)} nivel={53.66 * cresce(t, T.res, 1.2)} prudencial={rampa(t, T.prud, T.prud + 0.5)} maximo={rampa(t, T.teto, T.teto + 0.5)} />

      {/* 3. ano após ano */}
      {HIST.map((h, i) => (
        <ReguaLimite key={i} tema={tema} pos={[h.x, 0, 0.2]} sobe={c3 * rampa(t, T.hist + i * 0.12, T.hist + 0.5 + i * 0.12)} nivel={h.v * cresce(t, h.t + 0.3, 1.2)} prudencial={h.v > 51.3 ? rampa(t, h.t + 1.2, h.t + 1.6) : 0} maximo={0} />
      ))}
      {HIST.map((h, i) => (
        <BaseGaveta key={'b' + i} tema={tema} pos={[h.x, 0, 1.6]} sobe={c3 * rampa(t, h.t - 0.2, h.t + 0.3)} larg={2.2} texto={h.ano} aceso={janela(t, h.t, i + 1 < HIST.length ? HIST[i + 1].t : T.cresc)} />
      ))}

      {/* 4. o que mais cresceu */}
      <BaseGaveta tema={tema} pos={[-1.9, 0, 1.6]} sobe={C4(t) * rampa(t, T.temp - 0.2, T.temp + 0.3)} larg={2.8} texto="TEMPORÁRIOS" aceso={janela(t, T.temp, T.efet)} />
      <BaseGaveta tema={tema} pos={[2.1, 0, 1.6]} sobe={C4(t) * rampa(t, T.efet - 0.2, T.efet + 0.3)} larg={3.0} texto="EFETIVOS E COMISSIONADOS" aceso={janela(t, T.efet, T.parte)} />

      {/* 5. o que falta */}
      <BaseGaveta tema={tema} pos={TES_POS} sobe={c5} larg={2.8} texto="TESOURO NACIONAL" aceso={janela(t, T.rel, T.tcm)} />
      <PastaProcesso tema={tema} pos={soma(TES_POS, [0, 0.12, -0.1])} escala={0.95} sobe={c5 * rampa(t, T.rel - 0.1, T.rel + 0.4)} titulo="RELATÓRIO ATÉ AGO/2026" valor="PRAZO 30/09" carimbo={rampa(t, T.ate13 + 0.6, T.ate13 + 1.0)} textoCarimbo={t < T.d44 ? 'NÃO ENTREGUE ATÉ 13/11' : '44 DIAS DE ATRASO'} corCarimbo={C.alerta} aceso={janela(t, T.rel, T.tcm)} />
      <CalendarioGrande tema={tema} pos={soma(TES_POS, [-2.4, 0, 1.2])} rotY={0.3} texto="30/09" sub="PRAZO" folha={rampa(t, T.prazo, T.prazo + 0.5)} escala={0.75 * c5 * rampa(t, T.prazo - 0.2, T.prazo + 0.3)} destaque={janela(t, T.prazo, T.ate13)} />
      <CalendarioGrande tema={tema} pos={soma(TCM_POS, [2.4, 0, 2.8])} rotY={-0.3} texto="31/10" sub="PRAZO" folha={rampa(t, T.venceu, T.venceu + 0.5)} escala={0.75 * c5 * rampa(t, T.venceu - 0.2, T.venceu + 0.3)} destaque={janela(t, T.venceu, T.fecho)} />
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={c5 * rampa(t, T.tcm - 0.3, T.tcm + 0.3)} aceso={janela(t, T.tcm, T.fecho)} />
      <PastaProcesso tema={tema} pos={soma(TCM_POS, [0, 0, 2.6])} escala={0.9} sobe={c5 * rampa(t, T.tcm + 0.2, T.tcm + 0.7)} titulo="PRESTAÇÃO DE SETEMBRO" valor="PRAZO 31/10" carimbo={rampa(t, T.pend, T.pend + 0.4)} textoCarimbo={t < T.d13 ? 'PENDENTE' : '13 DIAS DE ATRASO'} corCarimbo={t < T.d13 ? neutro : C.alerta} aceso={janela(t, T.tcm, T.fecho)} />

      {/* 6. fecho */}
      <Prefeitura tema={tema} pos={[-0.6, 0, -2.4]} sobe={c6} aceso={janela(t, T.olho, FIM + 1)} escala={0.8} />
      <PastaProcesso tema={tema} pos={PASTA6} escala={0.95} sobe={c6 * rampa(t, T.colado - 0.2, T.colado + 0.3)} titulo="PRESTAÇÃO DE CONTAS" valor="SETEMBRO/2026" carimbo={rampa(t, T.colado + 0.8, T.colado + 1.2)} textoCarimbo="ATRASADA" corCarimbo={C.alerta} aceso={janela(t, T.colado, FIM + 1)} />
      <ReguaLimite tema={tema} pos={REGUA6} sobe={c6} nivel={53.66 * cresce(t, T.fecho + 0.2, 1.0)} prudencial={c6} maximo={rampa(t, T.colado, T.colado + 0.5)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const R1y = (pct: number) => yRegua(pct) + 0.2;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1, 0], 12, 10, [0, 1.6, 1])]]},
  {
    ini: T.lei - 0.2,
    arco: 0.03,
    chaves: [
      [T.lei - 0.2, E([0, 1.4, -0.6], 10.4, 8.0, [-0.06, 1.2, 1])],
      [T.efetivo - 0.2, E([-2.4, 1.0, 0.4], 6.0, 5.0, [-0.1, 0.9, 1])],
      [T.terc + 0.8, E([-2.2, 1.0, 0.4], 6.2, 5.0, [-0.06, 0.9, 1])],
      [T.pega - 0.1, E([0.3, 1.8, 2.4], 4.6, 5.6, [-0.04, 0.8, 1])],
      [T.teto0 - 0.2, E([1.5, 2.2, 1.4], 6.4, 6.6, [0.0, 0.9, 1])],
      [T.d1 - 0.1, E(soma(REGUA1, [0, R1y(48.6), 0]), 3.6, 3.4, [0.02, 0.5, 1])],
      [T.d2 - 0.1, E(soma(REGUA1, [0, R1y(51.3), 0]), 3.6, 3.4, [0.04, 0.5, 1])],
      [T.proibe - 0.1, E([0, 1.6, PROIB_Z], 8.4, 3.6, [0.0, 0.45, 1])],
      [T.repor - 0.1, E([0, 1.6, PROIB_Z], 8.6, 3.8, [0.03, 0.45, 1])],
      [T.d3 - 0.1, E(soma(REGUA1, [0, R1y(54), 0]), 3.6, 3.4, [0.06, 0.5, 1])],
      [T.passou - 0.1, E([-1.6, 1.0, 1.6], 3.8, 3.4, [0.0, 0.8, 1])],
      [T.contaJ - 0.3, E([-1.6, 1.0, 1.6], 3.6, 3.3, [0.03, 0.8, 1])],
    ],
  },
  {
    ini: T.contaJ - 0.1,
    arco: 0.03,
    chaves: [
      [T.contaJ - 0.1, E([0, 1.6, 0.4], 11.0, 8.0, [-0.05, 1.2, 1])],
      [T.bruto - 0.1, E(soma(BRUTO_POS, [0, 2.0, 0]), 4.4, 6.0, [-0.08, 0.8, 1])],
      [T.tirar - 0.1, E(soma(BRUTO_POS, [-1.0, 1.8, 0.8]), 5.6, 5.8, [-0.06, 0.8, 1])],
      [T.sobra - 0.1, E(soma(BRUTO_POS, [0, 2.0, 0]), 4.4, 6.0, [-0.04, 0.8, 1])],
      [T.rcl - 0.1, E(soma(RCL_POS, [-1.2, 3.0, 0]), 6.4, 8.4, [-0.02, 0.8, 1])],
      [T.div - 0.1, E([0.8, 2.6, 0.2], 9.0, 8.0, [0.0, 0.9, 1])],
      [T.res + 0.4, E(soma(REGUA2, [0, R1y(53), 0]), 3.8, 4.0, [0.04, 0.5, 1])],
      [T.hist - 0.3, E(soma(REGUA2, [0, R1y(52.5), 0]), 3.4, 3.4, [0.08, 0.5, 1])],
    ],
  },
  {
    ini: T.hist - 0.1,
    arco: 0.03,
    chaves: [
      [T.hist - 0.1, E([0, 3.0, 0.4], 8.6, 6.8, [-0.04, 0.8, 1])],
      ...HIST.flatMap((h, i): [number, Cam][] => [
        [h.t - 0.1, E([h.x, R1y(h.v) - 0.6, 0.2], 3.4, 4.2, [-0.06 + i * 0.06, 0.55, 1])],
        [(i + 1 < HIST.length ? HIST[i + 1].t : T.subiu) - 0.4, E([h.x, R1y(h.v) - 0.6, 0.2], 3.3, 4.0, [-0.04 + i * 0.06, 0.55, 1])],
      ]),
      [T.subiu, E([0, 3.0, 0.4], 8.6, 6.8, [0.08, 0.8, 1])],
    ],
  },
  {
    ini: T.cresc - 0.1,
    arco: 0.03,
    chaves: [
      [T.cresc - 0.1, E([0, 1.6, 0.6], 8.6, 6.6, [-0.05, 1.0, 1])],
      [T.temp - 0.1, E([-1.9, 1.8, 0.6], 4.6, 5.0, [-0.08, 0.8, 1])],
      [T.alta + 0.6, E([-1.9, 1.8, 0.6], 4.4, 4.8, [-0.05, 0.8, 1])],
      [T.efet - 0.1, E([2.1, 2.0, 0.6], 4.8, 5.4, [0.02, 0.8, 1])],
      [T.parte - 0.1, E([0, 1.8, 0.6], 8.6, 6.6, [0.04, 1.0, 1])],
      [T.ponto - 0.3, E([0, 1.8, 0.6], 8.4, 6.4, [0.07, 1.0, 1])],
    ],
  },
  {
    ini: T.ponto - 0.1,
    arco: 0.03,
    chaves: [
      [T.ponto - 0.1, E([0, 1.2, -0.4], 10.4, 7.6, [-0.05, 1.2, 1])],
      [T.rel - 0.1, E(soma(TES_POS, [-0.6, 0.9, 0.5]), 4.2, 3.4, [-0.08, 0.7, 1])],
      [T.d44 - 0.1, E(soma(TES_POS, [0, 0.9, 0.3]), 3.0, 2.6, [-0.04, 0.6, 1])],
      [T.pelaLei + 0.6, E(soma(TES_POS, [-0.4, 0.9, 0.3]), 4.0, 3.4, [-0.02, 0.7, 1])],
      [T.tcm - 0.1, E(soma(TCM_POS, [0.6, 1.2, 1.6]), 4.8, 4.4, [0.04, 0.8, 1])],
      [T.d13 - 0.1, E(soma(TCM_POS, [0, 0.9, 2.6]), 3.0, 2.6, [0.06, 0.6, 1])],
      [T.primeira + 0.4, E(soma(TCM_POS, [0.4, 1.0, 2.2]), 4.2, 3.6, [0.07, 0.7, 1])],
      [T.fecho - 0.3, E(soma(TCM_POS, [0, 1.0, 2.0]), 4.6, 4.2, [0.08, 0.8, 1])],
    ],
  },
  {
    ini: T.fecho - 0.1,
    arco: 0.04,
    chaves: [
      [T.fecho - 0.1, E(soma(REGUA6, [0, R1y(50), 0]), 4.0, 4.6, [0, 0.6, 1])],
      [T.oficial + 1.6, E(soma(REGUA6, [0, R1y(53.5), 0]), 3.0, 3.0, [0.04, 0.5, 1])],
      [T.colado - 0.1, E([0, 1.6, 0.8], 5.6, 5.0, [0.02, 0.7, 1])],
      [T.olho, E([0, 1.6, 0.8], 5.4, 4.8, [0.06, 0.7, 1])],
      [T.segue, E([0, 2.0, -0.6], 7.0, 7.0, [0.1, 0.9, 1])],
      [FIM, E([0, 1.2, -0.4], 12.0, 9.6, [0.25, 1.4, 1])],
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

// ---------- Folhas de PDF (documentos reais, valores como estão) ----------
const RGF = 'SICONFI · TESOURO NACIONAL';
const F0: Omit<Folha, 'b'>[] = [
  {id: 1, a: T.v484, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Despesa bruta com pessoal (12 meses)', '484.896.204,88', true]]},
  {id: 2, a: T.v42, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Despesas não computadas (art. 19, §1º)', '42.281.672,65', true]]},
  {id: 3, a: T.v442, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Despesa total com pessoal (DTP)', '442.614.532,23', true]]},
  {id: 4, a: T.rcl + 0.3, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Receita corrente líquida ajustada', '824.871.248,03', true]]},
  {id: 5, a: T.res, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['DTP · % sobre a RCL ajustada', '53,66', true], ['Limite máximo (art. 20)', '54,00', false]]},
  {id: 6, a: T.teto + 0.6, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Limite máximo (54%)', '445.430.473,94', true], ['Despesa total com pessoal', '442.614.532,23', false]]},
  {id: 7, a: T.prud, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 1º QUADRIMESTRE DE 2026', origem: RGF, linhas: [['Limite prudencial (51,3%)', '423.158.950,24', true], ['Despesa total com pessoal', '442.614.532,23', false]]},
  {id: 8, a: T.h24 + 0.4, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 3º QUADRIMESTRE DE 2024', origem: RGF, linhas: [['DTP · % sobre a RCL ajustada', '45,96', true]]},
  {id: 9, a: T.h25 + 0.2, doc: 'RGF · Anexo 1 · Despesa com Pessoal', sub: 'PODER EXECUTIVO · 3º QUADRIMESTRE DE 2025', origem: RGF, linhas: [['DTP · % sobre a RCL ajustada', '50,52', true]]},
  {id: 10, a: T.v19, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'EXECUTIVO · LIQUIDADO DE MAIO A SETEMBRO', origem: RGF, linhas: [['Contratação temporária · 2025', '19.325.373,74', true], ['Contratação temporária · 2026', '23.909.522,65', true]]},
  {id: 11, a: T.efet + 0.2, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'EXECUTIVO · LIQUIDADO DE MAIO A SETEMBRO', origem: RGF, linhas: [['Vencimentos (efetivos e comissionados) · 2025', '114.405.530,02', false], ['Vencimentos (efetivos e comissionados) · 2026', '122.972.295,39', true]]},
  {id: 12, a: T.ate13, doc: 'Extrato de entregas · Prefeitura de Ilhéus', sub: 'EXERCÍCIO 2026 · CONSULTADO EM 13/11/2026', origem: RGF, linhas: [['RGF · 1º quadrimestre', 'ENTREGUE 25/06', false], ['RGF · 2º quadrimestre (prazo 30/09)', 'NÃO CONSTA', true]]},
  {id: 13, a: T.pend - 0.4, doc: 'e-TCM · Consulta Pública', sub: 'PREFEITURA DE ILHÉUS · MENSAL 2026 · 13/11/2026', origem: 'e-TCM · TCM-BA', linhas: [['Competência 08/2026', 'NO PRAZO', false], ['Competência 09/2026 (prazo 31/10)', 'PENDENTE', true]]},
  {id: 14, a: T.primeira + 0.6, doc: 'e-TCM · Consulta Pública', sub: 'PREFEITURA DE ILHÉUS · MENSAL 2026', origem: 'e-TCM · TCM-BA', linhas: [['01/2026 · enviada em 01/05/2026', 'FORA DO PRAZO', true], ['02/2026 · enviada em 19/06/2026', 'FORA DO PRAZO', true], ['03/2026 · enviada em 29/06/2026', 'FORA DO PRAZO', true]]},
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
  {a: T.lei, b: T.efetivo, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.efetivo, b: T.conta12, texto: 'QUEM ENTRA NA CONTA DO PESSOAL'},
  {a: T.conta12, b: T.teto0, texto: 'PESSOAL ÷ RECEITA CORRENTE LÍQUIDA · 12 MESES'},
  {a: T.teto0, b: T.d1, texto: 'TETO DA PREFEITURA: 54%', destaque: true},
  {a: T.d1, b: T.d2, texto: '1º DEGRAU · 48,6% · ALERTA'},
  {a: T.d2, b: T.proibe, texto: '2º DEGRAU · 51,3% · LIMITE PRUDENCIAL', destaque: true},
  {a: T.proibe, b: T.repor, texto: 'ACIMA DE 51,3%, A LEI PROÍBE'},
  {a: T.repor, b: T.d3, texto: 'SÓ REPOR APOSENTADORIA OU FALECIMENTO: EDUCAÇÃO, SAÚDE, SEGURANÇA'},
  {a: T.d3, b: T.seNao, texto: '3º DEGRAU · 54% · TETO: 2 QUADRIMESTRES PRA CORTAR', destaque: true},
  {a: T.contaJ, b: T.bruto, texto: 'A CONTA · MAIO/2025 A ABRIL/2026'},
  {a: T.div, b: T.res, texto: 'R$ 442,6 MI ÷ R$ 824,9 MI'},
  {a: T.refiz, b: T.teto, texto: 'CONTA REFEITA: BATE', destaque: true},
  {a: T.dias, b: T.prud, texto: 'FOLGA ≈ 2 DIAS DE FOLHA'},
  {a: T.subiu, b: T.cresc, texto: 'SUBIU ANO APÓS ANO', destaque: true},
  {a: T.cresc, b: T.temp, texto: 'MAIO A SETEMBRO · 2025 x 2026'},
  {a: T.alta, b: T.efet, texto: 'TEMPORÁRIOS: +23,7%', destaque: true},
  {a: T.parte, b: T.piso, texto: 'PARTE DISSO VEM DE REAJUSTES'},
  {a: T.piso, b: T.revisao, texto: 'PISO DOS PROFESSORES · CONTRATADOS · ABRIL/2026'},
  {a: T.revisao, b: T.ponto, texto: 'REVISÃO DOS SERVIDORES · JUNHO/2026'},
  {a: T.ponto, b: T.rel, texto: 'O ATRASO', destaque: true},
  {a: T.d44, b: T.pelaLei, texto: 'RELATÓRIO DE PESSOAL: 44 DIAS DE ATRASO', destaque: true},
  {a: T.pelaLei, b: T.tcm, texto: 'SEM O RELATÓRIO: SEM CONVÊNIO E SEM EMPRÉSTIMO (LRF, ART. 51)'},
  {a: T.d13, b: T.primeira, texto: 'PRESTAÇÃO DE SETEMBRO: 13 DIAS DE ATRASO', destaque: true},
  {a: T.fecho, b: T.oficial, texto: 'NÃO DÁ PRA DIZER QUE PASSOU DO TETO'},
  {a: T.oficial, b: T.colado, texto: 'ÚLTIMO NÚMERO OFICIAL: 53,66%', destaque: true},
  {a: T.colado, b: T.mostraria, texto: 'A PRESTAÇÃO DE CONTAS ESTÁ ATRASADA', destaque: true},
  {a: T.mostraria, b: T.olho, texto: 'O RELATÓRIO QUE MOSTRARIA O LIMITE NÃO APARECEU', destaque: true},
  {a: T.olho, b: T.segue, texto: 'ILHÉUS, FICA DE OLHO'},
];
const SELOS: Txt[] = [
  {a: T.lei, b: T.contaJ, texto: 'FONTE: LRF (LC 101/2000), ARTS. 19, 20, 22, 23 E 59'},
  {a: T.contaJ, b: T.hist, texto: 'FONTE: RGF 1º QUADRIMESTRE 2026 · SICONFI · CONTA PRÓPRIA'},
  {a: T.hist, b: T.cresc, texto: 'FONTE: RGF 2024, 2025 E 1º QUADRIMESTRE 2026 · SICONFI'},
  {a: T.cresc, b: T.ponto, texto: 'FONTE: MSC · TESOURO NACIONAL · CONTA PRÓPRIA'},
  {a: T.ponto, b: T.fecho, texto: 'FONTE: SICONFI E e-TCM · CONSULTADOS EM 13/11/2026'},
  {a: T.fecho, b: T.segue, texto: 'FONTE: RGF 1º QUADRIMESTRE 2026 · SICONFI'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const fant = mistura(tema.objetoClaro, tema.texto, 0.4);
  const r: Rot[] = [];
  TIPOS.forEach((b) => r.push({a: b.t + 0.2, b: T.pega - 0.2, p: soma(b.p, [0, 1.15, 0]), valor: b.nome, cor: b.nome === 'CONTRATADO' ? tema.acento : undefined}));
  r.push({a: T.pega + 0.8, b: T.d1 - 0.3, p: soma(PES_POS, [0, altTorre(53.66, 4) + 0.3, 0]), valor: 'R$ 53,66', sub: 'PESSOAL', cor: tema.acento});
  r.push({a: T.divide + 0.9, b: T.d1 - 0.3, p: soma(CEM_POS, [0, altTorre(100, 4) + 0.3, 0]), valor: 'R$ 100', sub: 'RECEITA', cor: fant});
  const deg = (pct: number, a: number, txt: string, cor?: string) => r.push({a, b: T.contaJ - 0.3, p: soma(REGUA1, [0.9, R1y(pct), 0]), valor: `${pct.toString().replace('.', ',')}%`, sub: txt, cor});
  deg(48.6, T.d1 + 0.4, 'ALERTA');
  deg(51.3, T.d2 + 0.4, 'PRUDENCIAL', C.alerta);
  deg(54, T.d3 + 0.4, 'TETO', C.alerta);
  r.push({a: T.v484 + 0.9, b: T.sobra - 0.2, p: soma(BRUTO_POS, [0, altTorre(BRUTO / ESC, LADO) + 0.3, 0]), valor: 'R$ 484,9 MI', sub: 'GASTO BRUTO', cor: C.ouro});
  r.push({a: T.v42 + 1.0, b: T.hist - 0.2, p: soma(DESC_POS, [0, altTorre(NAO_COMP / ESC, LADO) + 0.3, 0]), valor: '− R$ 42,3 MI', sub: 'INDENIZAÇÕES E INATIVOS', cor: fant});
  r.push({a: T.v442 + 0.6, b: T.hist - 0.2, p: soma(BRUTO_POS, [0, altTorre(DTP / ESC, LADO) + 0.3, 0]), valor: 'R$ 442,6 MI', sub: 'GASTO QUE CONTA', cor: tema.acento});
  r.push({a: T.rcl + 1.6, b: T.hist - 0.2, p: soma(RCL_POS, [0, altTorre(RCL / ESC, LADO) + 0.3, 0]), valor: 'R$ 824,9 MI', sub: 'RECEITA CORRENTE LÍQUIDA', cor: fant});
  r.push({a: T.res + 1.0, b: T.hist - 0.2, p: soma(REGUA2, [0.95, R1y(53.66), 0]), valor: '53,66%', sub: 'ILHÉUS', cor: tema.acento});
  r.push({a: T.teto + 0.4, b: T.hist - 0.2, p: soma(REGUA2, [-0.95, R1y(54), 0]), valor: '54%', sub: 'TETO', cor: C.alerta});
  r.push({a: T.folga + 0.5, b: T.prud - 0.2, p: soma(REGUA2, [-0.95, R1y(52.4), 0]), valor: 'FOLGA R$ 2,8 MI', cor: C.ouro});
  r.push({a: T.prud + 0.6, b: T.hist - 0.2, p: soma(REGUA2, [-0.95, R1y(51.3), 0]), valor: '51,3%', sub: 'PRUDENCIAL', cor: C.alerta});
  HIST.forEach((h, i) => r.push({a: h.t + 1.2, b: T.cresc - 0.2, p: [h.x, R1y(h.v) + 0.1, 0.9], valor: `${h.v.toFixed(2).replace('.', ',')}%`, sub: h.ano, cor: i === 2 ? tema.acento : C.ouro}));
  r.push({a: T.v19 + 0.8, b: T.ponto - 0.2, p: soma(posTemp(0), [0, altTorre(TEMP.a, 3) + 0.3, 0]), valor: 'R$ 19,3 MI', sub: 'MAI–SET 2025', cor: fant});
  r.push({a: T.v23 + 0.6, b: T.ponto - 0.2, p: soma(posTemp(1), [0, altTorre(TEMP.b, 3) + 0.3, 0]), valor: 'R$ 23,9 MI', sub: 'MAI–SET 2026', cor: tema.acento});
  r.push({a: T.efet + 1.2, b: T.ponto - 0.2, p: soma(posEfet(0), [0, altTorre(EFET.a / 5, 3) + 0.3, 0]), valor: 'R$ 114,4 MI', sub: 'MAI–SET 2025', cor: fant});
  r.push({a: T.v75 + 0.6, b: T.ponto - 0.2, p: soma(posEfet(1), [0, altTorre(EFET.b / 5, 3) + 0.3, 0]), valor: 'R$ 123,0 MI', sub: '+7,5%', cor: C.ouro});
  r.push({a: T.oficial + 0.6, b: FIM, p: soma(REGUA6, [0.95, R1y(53.66), 0]), valor: '53,66%', sub: 'ILHÉUS', cor: tema.acento});
  r.push({a: T.colado + 0.3, b: FIM, p: soma(REGUA6, [-0.95, R1y(54), 0]), valor: '54%', sub: 'TETO', cor: C.alerta});
  return r;
};

const soMapa = (t: number) => t < T.lei - 0.3;
const noMapa = (t: number) => t < T.lei;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.lei) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const escTxt =
    t < T.d1 ? '1 PILHA = R$ 1 · TRANSPARENTE = RECEITA' : t < T.contaJ ? '' : t < T.hist ? '1 PILHA = R$ 10 MI · TRANSPARENTE = RECEITA' : t < T.cresc ? '' : t < T.ponto ? 'TEMPORÁRIOS: 1 PILHA = R$ 1 MI · EFETIVOS: R$ 5 MI' : '';
  const escK = escTxt && t > T.pega ? Math.max(vis(t, T.pega, T.d1), vis(t, T.contaJ, T.hist), vis(t, T.cresc, T.ponto)) : 0;
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
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', alignItems: 'center', gap: 10}}>
        {seloAtual && !folha ? (
          <div style={{opacity: Math.min(1, visivel(seloAtual, t)), padding: '8px 14px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 52 ? 14 : 16, fontWeight: 700, letterSpacing: 1.0, color: tema.texto, whiteSpace: 'nowrap'}}>{seloAtual.texto}</div>
        ) : null}
      </div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/pessoalilheus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

const SOQUINHOS = [T.v484, T.v442, T.res, T.v23, T.ate13 + 0.6, T.d44, T.pend, T.d13, T.colado];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  TIPOS.forEach((b) => s.push({t: b.t + 0.05, f: 'pop', v: 0.12}));
  [T.d1, T.d2, T.d3].forEach((x) => s.push({t: x + 0.2, f: 'subida', v: 0.13}));
  PROIB.forEach((p) => s.push({t: p.t + 0.5, f: 'impacto', v: 0.12}));
  [T.conv + 0.05, T.ate13 + 0.65, T.d44 + 0.05, T.pend + 0.05, T.d13 + 0.05, T.colado + 0.1].forEach((x) => s.push({t: x, f: 'impacto', v: 0.13}));
  [T.v484, T.v42, T.v442, T.rcl + 0.4, T.v19, T.v23, T.efet + 0.4, T.v75].forEach((x) => s.push({t: x + 0.15, f: 'subida', v: 0.13}));
  HIST.forEach((h) => s.push({t: h.t + 0.4, f: 'subida', v: 0.13}));
  [T.res + 0.2, T.oficial + 0.4].forEach((x) => s.push({t: x, f: 'baque', v: 0.17}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.6, 2.8, 5.5, 8.0, T.lei + 0.8,
  ...TIPOS.map((b) => b.t + 0.6), T.pega + 1.2, T.divide + 1.5, T.teto0 + 0.8, T.avisos + 0.6,
  T.d1 + 1.2, T.d2 + 1.2, ...PROIB.map((p) => p.t + 0.9), T.repor + 1.5, T.d3 + 1.2, T.passou + 1.0, T.conv + 1.0,
  T.contaJ + 0.8, T.v484 + 1.2, T.v42 + 1.4, T.v442 + 1.0, T.rcl + 2.0, T.div + 1.0, T.res + 1.4, T.refiz + 0.5, T.teto + 1.0, T.folga + 1.0, T.dias + 0.5, T.prud + 1.5,
  T.hist + 0.6, ...HIST.map((h) => h.t + 1.5), T.subiu + 0.5,
  T.cresc + 0.8, T.v19 + 1.0, T.v23 + 1.0, T.alta + 0.5, T.efet + 1.6, T.v75 + 0.8, T.piso + 0.8, T.revisao + 0.8,
  T.ponto + 0.5, T.rel + 1.0, T.prazo + 0.6, T.ate13 + 1.4, T.d44 + 0.8, T.pelaLei + 1.0, T.tcm + 1.0, T.venceu + 0.6, T.pend + 0.8, T.d13 + 0.8, T.primeira + 1.6,
  T.fecho + 0.8, T.oficial + 1.4, T.colado + 1.0, T.mostraria + 1.0, T.olho + 0.4, T.segue + 0.6, FIM - 0.4,
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
export const PessoalIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
export const TITULO_CAPA = ['Contas', 'atrasadas,', 'pessoal', 'no limite.'];
export const CapaPessoalIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 450}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoCidade tema={tema} cidade="ILHÉUS · CONTAS ATRASADAS" t={10} />
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
