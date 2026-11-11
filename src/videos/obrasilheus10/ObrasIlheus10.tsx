import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {temaPorId} from '../../estilo';
import {ArvoreRedonda, CarroRua, CasaMini, CofreFGTS} from '../../pecas';
import {PosteLampada} from '../../pecas/oitohoras';
import {RoloCompactador} from '../../pecas/multas';
import {MesaMaquete, PilhasDinheiro, PredioTCM, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {BaseNome, PlacaObra} from './pecas';
import {PALAVRAS} from './palavras';

// 095. Ilhéus 10 anos · obras e infraestrutura (2016 a ago/2026). Só @eumagnoleite (Magno tirou a parceria em 09/11/2026; roteiro v3, tom de conversa).
// Mapa do Kit Mapas no gancho (projetos/095.../mapas/obrasilheus10.mp4, composição ObrasIlheus10Mapa), depois a mesa redonda:
// receita de capital (torre fantasma = previu, sólida = entrou), Infraestrutura ano a ano (11 pares), obras no papel,
// empresas, iluminação, caronas, Tribunal, dinheiro devolvido e o fecho 301 x 44.
// Em cada número falado entra a FOLHA DE PDF desenhada com o documento, a página e o valor real marcado (FolhaPdf).
// Sem nome de gestor, sem porcentagem. Dados: projetos/095.../audio/fontes.md e obras/site_fontes_095/fontes_095.json.

export const FPS = 30;
const AUDIO_SEG = 253.99; // Algenib 1,3, pausas 0,28 s, atempo 1,08, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '095. ilhéus 10 anos obras';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  capital: quando('Funciona assim'),
  infra: quando('E a Secretaria de Infraestrutura'),
  repara: quando('Agora repara'),
  cemit: quando('Construcao e ampliacao'),
  cemZero: quando('Executado Zero'),
  jorge: quando('O Quarteirao Jorge'),
  jorgeZero: quando('zero de 2016'),
  teatro: quando('O Teatro Municipal'),
  teatroZero: quando('zero em sete'),
  em22: quando('Em 2022 o orcamento trazia'),
  pureza: quando('Rua Maria Pureza'),
  saracura: quando('bairro Saracura'),
  duasZero: quando('Zero nas duas'),
  quem: quando('Ta mas entao'),
  n414: quando('414'),
  cta: quando('A CTA'),
  cta76: quando('76 milhoes'),
  rbs: quando('A RBS'),
  base: quando('Base Terraplanagem'),
  cnpj: quando('mesmo CNPJ'),
  rbs61: quando('61 milhoes'),
  maq: quando('So de aluguel'),
  maq85: quando('85 milhoes'),
  ghia: quando('E a Ghia'),
  ghia60: quando('60 milhoes e 500'),
  parte: quando('E aqui vem a parte'),
  marco: quando('Em marco de 2024'),
  nula: quando('declarou nula'),
  multou: quando('multou o gestor'),
  saiu: quando('saiu justamente'),
  renovado: quando('renovado em 2024'),
  mais26: quando('mais 2 milhoes e 600'),
  prorrog: quando('prorrogado'),
  portal: quando('No portal'),
  pagou: quando('De 2023 a agosto'),
  ghia38: quando('38 milhoes'),
  carona: quando('Tem mais'),
  pav: quando('A pavimentacao de 20'),
  ata: quando('veio da ata de um'),
  ren24: quando('foi renovada'),
  carros: quando('O aluguel de carros'),
  morro: quando('Morro do Chapeu'),
  tres: quando('Tres meses depois'),
  apurar: quando('o Tribunal abriu'),
  decidiu: quando('E o que o Tribunal'),
  limpeza: quando('Na limpeza urbana'),
  n1656: quando('1 milhao e 656'),
  negado: quando('recurso foi negado'),
  emerg: quando('Numa limpeza emergencial'),
  n344: quando('344'),
  denuncias: quando('E quatro denuncias'),
  semJulg: quando('seguem sem julgamento'),
  naoCond: quando('Estar no Tribunal'),
  devolveu: quando('E teve dinheiro'),
  habitar: quando('a prefeitura devolveu'),
  casas: quando('272'),
  caixa: quando('Em 2020 devolveu'),
  dez: quando('Dez anos tres gestoes'),
  gastar: quando('Gastar nao'),
  porque: quando('Mas me diz'),
  segue: quando('Segue o'),
};

// ---------- 1. Receita de capital: 4 anos falados (previu x entrou), 1 pilha = R$ 2 mi ----------
type Rec = {ano: string; t: number; tEntrou: number; prev: number; entrou: number};
const REC: Rec[] = [
  {ano: '2016', t: quando('Em 2016 contou com'), tEntrou: quando('Chegaram 6'), prev: 59.1685, entrou: 6.6679},
  {ano: '2017', t: quando('Em 2017 contou com'), tEntrou: quando('Chegou 1 milhao'), prev: 50.3663, entrou: 1.0664},
  {ano: '2024', t: quando('Em 2024 28'), tEntrou: quando('Chegaram 3'), prev: 28.267, entrou: 3.1989},
  {ano: '2026 (ATÉ AGO)', t: quando('E em 2026 ate agosto'), tEntrou: quando('Chegaram 11'), prev: 65.8315, entrou: 11.1307},
];
const ESC_R = 2;
const posRec = (i: number): V3 => [-2.7 + i * 1.8, 0, 2.3];
const REC_VIS = (t: number) => vis(t, T.capital - 0.2, T.infra - 0.1);

// ---------- 2. Infraestrutura ano a ano (previu x gastou), 1 pilha = R$ 4 mi ----------
type Inf = {ano: string; t: number; tGastou: number; prev: number | null; gastou: number; extra?: string};
const gastouEm = (n: number) => quando('Gastou', n + 1); // a 1ª vez é "a Secretaria de Infraestrutura gastou de verdade"
const INF: Inf[] = [
  {ano: '2016', t: quando('2016 Previu'), tGastou: gastouEm(1), prev: 60.7928, gastou: 20.9059},
  {ano: '2017', t: quando('2017 Gastou'), tGastou: gastouEm(2), prev: null, gastou: 14.4327},
  {ano: '2018', t: quando('2018 Previu'), tGastou: gastouEm(3), prev: 53.1893, gastou: 17.2932},
  {ano: '2019', t: quando('2019 Previu'), tGastou: gastouEm(4), prev: 56.53, gastou: 14.9994},
  {ano: '2020', t: quando('2020 Previu'), tGastou: gastouEm(5), prev: 35.0915, gastou: 21.9496},
  {ano: '2021', t: quando('2021 Previu'), tGastou: gastouEm(6), prev: 23.093, gastou: 17.4394},
  {ano: '2022', t: quando('2022 Gastou'), tGastou: gastouEm(7), prev: null, gastou: 36.5286},
  {ano: '2023', t: quando('2023 Previu'), tGastou: gastouEm(8), prev: 25.7391, gastou: 54.6815},
  {ano: '2024', t: quando('2024 Previu'), tGastou: gastouEm(9), prev: 55.4425, gastou: 55.5814},
  {ano: '2025', t: quando('2025 Previu'), tGastou: gastouEm(10), prev: 65.315, gastou: 18.2854},
  {ano: '2026', t: quando('2026 ate agosto Previu'), tGastou: gastouEm(11), prev: 112.2195, gastou: 22.0879},
];
const T_OBRAS18 = quando('E com obra mesmo');
const T_DOBRO = quando('Mais que o dobro');
const T_EXEC18 = quando('executou 5');
const T_MAIOR = quando('O maior gasto');
const ESC_I = 4;
const posInf = (i: number): V3 => [-5.0 + i * 1.0, 0, -0.2];
const INF_VIS = (t: number) => vis(t, T.infra - 0.2, T.repara + 0.4);

// ---------- 3. Obras no papel ----------
type Obra = {titulo: string; anos: string; t: number; zero: number; x: number};
const OBRAS: Obra[] = [
  {titulo: 'CEMITÉRIOS', anos: '2016 A 2025', t: T.cemit, zero: T.cemZero, x: -3.6},
  {titulo: 'QUARTEIRÃO JORGE AMADO', anos: '2016 A 2023', t: T.jorge, zero: T.jorgeZero, x: -1.8},
  {titulo: 'TEATRO MUNICIPAL', anos: '7 ANOS', t: T.teatro, zero: T.teatroZero, x: 0},
  {titulo: 'RUA MARIA PUREZA', anos: 'BANCO DA VITÓRIA · 2022', t: T.pureza, zero: T.duasZero, x: 1.8},
  {titulo: 'BAIRRO SARACURA', anos: 'PAVIMENTAÇÃO · 2022', t: T.saracura, zero: T.duasZero + 0.3, x: 3.6},
];
const posObra = (o: Obra): V3 => [o.x, 0, 1.3];
const OBRAS_VIS = (t: number) => vis(t, T.repara + 0.2, T.quem - 0.1);

// ---------- 4. Empresas (1 pilha = R$ 4 mi), as pilhas voam do cofre ----------
const COFRE_POS: V3 = [0, 0, 2.4];
type Emp = {id: string; x: number; t: number; v: number; nomes: [string, number][]; sub?: string};
const EMP: Emp[] = [
  {id: 'cta', x: -3.6, t: T.cta76, v: 76.4, nomes: [['CTA EMPREENDIMENTOS', 0]]},
  {id: 'rbs', x: -1.2, t: T.rbs61, v: 61.4, nomes: [['RBS CONSTRUTORA', 0], ['BASE TERRAPLANAGEM', T.base]], sub: 'CNPJ 21.442.493/0001-90'},
  {id: 'maq', x: 1.2, t: T.maq85, v: 85.8, nomes: [['ALUGUEL DE MÁQUINAS', 0]], sub: 'SOMA DE TODAS AS EMPRESAS'},
  {id: 'ghia', x: 3.6, t: T.ghia60, v: 60.5, nomes: [['GHIA ENGENHARIA', 0]], sub: 'ILUMINAÇÃO PÚBLICA'},
];
const Z_EMP = -1.0;
const posEmp = (e: Emp): V3 => [e.x, 0, Z_EMP];
const EMP_VIS = (t: number) => vis(t, T.quem - 0.1, T.carona - 0.2);
const GHIA38: V3 = [4.35, 0, Z_EMP - 0.1];
const COFRE_VIS = (t: number) => vis(t, T.quem - 0.1, T.parte);

// ---------- 5. Iluminação: o Tribunal e as pastas ----------
const TCM_POS: V3 = [0, 0, -4.3];
const ILU = {conc: [-0.3, 0, 1.2] as V3, contrato: [1.4, 0, 1.4] as V3};
const ILU_VIS = (t: number) => vis(t, T.parte - 0.1, T.carona - 0.2);
const TCM_VIS = (t: number) => vis(t, T.marco - 0.3, T.saiu + 0.4) + vis(t, T.decidiu - 0.3, T.limpeza + 0.2); // só quando a fala é do Tribunal (fica atrás do cabeçalho)

// ---------- 6. Caronas ----------
const CAR = {pav: [-2.7, 0, 1.3] as V3, rolo: [-1.15, 0, 0.9] as V3, carro: [1.15, 0, 0.9] as V3, carros: [2.7, 0, 1.3] as V3, tcm: [0, 0, -1.2] as V3};
const CAR_VIS = (t: number) => vis(t, T.carona - 0.1, T.decidiu - 0.1);

// ---------- 7. Tribunal ----------
type PastaT = {titulo: string; valor: string; t: number; carimbo: number; texto: string; alerta: boolean; x: number};
const PASTAS_T: PastaT[] = [
  {titulo: 'LIMPEZA URBANA · 2017', valor: 'DEVOLVER R$ 1,66 MI', t: T.limpeza, carimbo: T.negado, texto: 'RECURSO NEGADO', alerta: true, x: -2.5},
  {titulo: 'EMERGENCIAL DE LIMPEZA · 2019', valor: 'DEVOLVER R$ 344 MIL', t: T.emerg, carimbo: T.n344 + 0.6, texto: 'DEVOLVER', alerta: true, x: 0},
  {titulo: '4 DENÚNCIAS · OBRAS DE 2022', valor: 'DESDE 2023', t: T.denuncias, carimbo: T.semJulg, texto: 'SEM JULGAMENTO', alerta: false, x: 2.5},
];
const TRIB_VIS = (t: number) => vis(t, T.decidiu - 0.1, T.devolveu - 0.1);

// ---------- 8. Dinheiro devolvido (1 pilha = R$ 500 mil) ----------
const DEV = {de: [0.6, 0, 1.4] as V3, uniao: [3.9, 0, -1.6] as V3, caixa: [3.9, 0, 1.6] as V3};
const ESC_D = 0.5;
const CASAS: V3[] = Array.from({length: 18}, (_, i) => [-4.4 + (i % 6) * 0.72, 0, -1.0 + Math.floor(i / 6) * 0.95] as V3);
const DEV_VIS = (t: number) => vis(t, T.devolveu - 0.1, T.dez - 0.1);

// ---------- 9. Fecho: 301 x 44 (1 pilha = R$ 4 mi) ----------
const FECHO: V3 = [0, 0, 0.6];
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

// as pilhas que voam do cofre até a torre (empresas e devolução)
const voando = (t: number, de: V3, para: V3, n: number, lado: number, passo: number, t0: number, cor: string, out: Pilha[]) => {
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const alvo: V3 = [para[0] + ((k % lado) - (lado - 1) / 2) * passo, andar * ANDAR, para[2] + (Math.floor(k / lado) - (lado - 1) / 2) * passo];
    const a = t0 + j * 0.035;
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
  // 1. receita
  const rv = REC_VIS(t);
  if (rv > 0.01)
    REC.forEach((r, i) => {
      const kp = cresce(t, r.t + 0.6) * rv;
      if (kp > 0.01) fantasmas.push(...torre(posRec(i), (r.prev / ESC_R) * kp, 3, corFant));
      const ke = cresce(t, r.tEntrou + 0.1) * rv;
      if (ke > 0.01) solidas.push(...torre(posRec(i), Math.max(0.5, r.entrou / ESC_R) * ke, 3, C.ouro));
    });
  // 2. infraestrutura
  const iv = INF_VIS(t);
  if (iv > 0.01)
    INF.forEach((y, i) => {
      if (y.prev) {
        const kp = cresce(t, y.t + 0.6) * iv;
        if (kp > 0.01) fantasmas.push(...torre(posInf(i), (y.prev / ESC_I) * kp, 2, corFant, 0.32));
      }
      const kg = cresce(t, y.tGastou + 0.1) * iv;
      const cor = y.ano === '2023' || y.ano === '2024' ? tema.acento : C.ouro;
      if (kg > 0.01) solidas.push(...torre(posInf(i), (y.gastou / ESC_I) * kg, 2, cor, 0.27));
    });
  // 4. empresas: voam do cofre
  const ev = EMP_VIS(t);
  if (ev > 0.01) {
    const out: Pilha[] = [];
    EMP.forEach((e) => voando(t, soma(COFRE_POS, [0, 1.2, 0]), soma(posEmp(e), [0, 0.1, 0.1]), e.v / 4, 2, 0.3, e.t + 0.05, e.id === 'maq' ? mistura(C.ouro, tema.acento, 0.35) : C.ouro, out));
    // Ghia 2023 a ago/2026, ao lado
    const kg = cresce(t, T.ghia38 + 0.1) * ev;
    if (kg > 0.01) out.push(...torre(GHIA38, (38.8 / 4) * kg, 2, tema.acento, 0.27));
    // as empresas descem quando a cena vai para a iluminação (fica só a Ghia)
    const desce = rampa(t, T.parte - 0.2, T.parte + 0.6);
    out.forEach((p) => {
      const ghia = p.p[0] > 3.0;
      if (!ghia && desce > 0) p.p = [p.p[0], p.p[1] - 4 * desce, p.p[2]];
      if (ev < 1) p.n *= ev;
      if (!ghia && desce > 0.98) return;
      solidas.push(p);
    });
  }
  // 8. devolução: pilhas saem da mesa para a União e para a Caixa
  const dv = DEV_VIS(t);
  if (dv > 0.01) {
    const out: Pilha[] = [];
    voando(t, DEV.de, DEV.uniao, 4.7223 / ESC_D, 2, 0.3, T.habitar + 0.3, C.ouro, out);
    voando(t, DEV.de, DEV.caixa, 2.9841 / ESC_D, 2, 0.3, T.caixa + 0.4, C.ouro, out);
    out.forEach((p) => solidas.push({...p, n: p.n * dv}));
  }
  // 9. fecho: 301 x 44
  const fv = FECHO_VIS(t);
  if (fv > 0.01) {
    const kp = cresce(t, T.dez + 0.1, 1.2) * fv;
    if (kp > 0.01) fantasmas.push(...torre(FECHO, (301.17 / 4) * kp, 4, corFant, 0.34));
    const ke = cresce(t, T.porque + 0.3) * fv;
    if (ke > 0.01) solidas.push(...torre(FECHO, (44.25 / 4) * ke, 4, C.ouro, 0.3));
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
  const cv = Math.max(REC_VIS(t), COFRE_VIS(t));
  const ilu = ILU_VIS(t);
  const car = CAR_VIS(t);
  const tri = TRIB_VIS(t);
  const dev = DEV_VIS(t);
  const ob = OBRAS_VIS(t);
  const ev = EMP_VIS(t);
  const desceEmp = 1 - rampa(t, T.parte - 0.2, T.parte + 0.5);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />
      ))}

      {/* cofre: receita (no centro, atrás das torres) e empresas (na frente) */}
      {cv > 0.02 ? <CofreFGTS tema={tema} pos={soma(t < T.infra ? [0, 0, 0.2] : COFRE_POS, [0, -1.6 * (1 - Math.min(1, cv)), 0])} escala={0.55} abre={janela(t, T.capital + 0.4, T.infra - 0.4) + janela(t, T.cta, T.parte - 0.3)} trava={0} brilho={0.2} /> : null}

      <PilhasDinheiro pilhas={solidas} max={2600} />
      <PilhasDinheiro pilhas={fantasmas} max={2600} opacidade={0.26} largura={1.12} />

      {/* receita: placa do conjunto */}
      <BaseGaveta tema={tema} pos={[0, 0, 3.55]} sobe={REC_VIS(t)} larg={6.6} texto="CONVÊNIOS · NO PAPEL x O QUE CHEGOU" aceso={0.4} />
      {/* infraestrutura: placa do conjunto */}
      <BaseGaveta tema={tema} pos={[0, 0, 0.75]} sobe={INF_VIS(t)} larg={10.6} texto="SECRETARIA DE INFRAESTRUTURA · PREVIU x GASTOU" aceso={0.4} />

      {/* obras no papel */}
      {OBRAS.map((o, i) => (
        <PlacaObra key={i} tema={tema} pos={posObra(o)} rotY={-o.x * 0.04} escala={0.95} sobe={rampa(t, o.t - 0.1, o.t + 0.5) * ob} titulo={o.titulo} anos={o.anos} carimbo={rampa(t, o.zero, o.zero + 0.4)} corCarimbo={C.alerta} aceso={janela(t, o.t, o.t + 3.5)} />
      ))}

      {/* empresas */}
      {EMP.map((e) => (
        <BaseNome key={e.id} tema={tema} pos={posEmp(e)} sobe={rampa(t, e.id === 'cta' ? T.cta - 0.2 : e.id === 'rbs' ? T.rbs - 0.2 : e.id === 'maq' ? T.maq - 0.2 : T.ghia - 0.2, (e.id === 'cta' ? T.cta : e.id === 'rbs' ? T.rbs : e.id === 'maq' ? T.maq : T.ghia) + 0.4) * ev * (e.id === 'ghia' ? 1 : desceEmp)} larg={2.2} nomes={e.nomes} t={t} sub={e.id === 'rbs' ? (t >= T.cnpj ? e.sub : undefined) : e.sub} aceso={janela(t, e.id === 'cta' ? T.cta : e.id === 'rbs' ? T.rbs : e.id === 'maq' ? T.maq : T.ghia, e.id === 'ghia' ? T.carona : (e.id === 'cta' ? T.rbs : e.id === 'rbs' ? T.maq : T.ghia))} />
      ))}
      <RoloCompactador tema={tema} pos={[1.2, 0, Z_EMP + 1.15]} rotY={Math.PI / 2} escala={0.32 * rampa(t, T.maq, T.maq + 0.5) * ev * desceEmp} giro={t * 0.6} />
      {[2.85, 4.85].map((x, i) => (
        <PosteLampada key={i} tema={tema} pos={[x, 0, Z_EMP - 0.4]} escala={0.62 * rampa(t, T.ghia - 0.1 + i * 0.15, T.ghia + 0.4 + i * 0.15) * ev} acesa={0.4 + 0.6 * janela(t, T.ghia, T.carona)} />
      ))}

      {/* iluminação: concorrência anulada e o contrato que seguiu */}
      <PastaProcesso tema={tema} pos={ILU.conc} rotY={0.12} escala={0.85} sobe={ilu * rampa(t, T.marco - 0.1, T.marco + 0.4)} titulo="CONCORRÊNCIA 002/2022" valor="ILUMINAÇÃO" carimbo={rampa(t, T.nula, T.nula + 0.4)} textoCarimbo={t >= T.multou ? 'NULA · MULTA' : 'NULA · 03/2024'} corCarimbo={C.alerta} aceso={janela(t, T.marco, T.saiu)} />
      <PastaProcesso
        tema={tema}
        pos={ILU.contrato}
        rotY={-0.12}
        escala={0.85}
        sobe={ilu * rampa(t, T.saiu - 0.1, T.saiu + 0.4)}
        titulo="CONTRATO 224/2022 · GHIA"
        valor="DESSA CONCORRÊNCIA"
        carimbo={t >= T.prorrog ? rampa(t, T.prorrog, T.prorrog + 0.4) : t >= T.mais26 ? rampa(t, T.mais26, T.mais26 + 0.4) : rampa(t, T.renovado, T.renovado + 0.4)}
        textoCarimbo={t >= T.prorrog ? 'ATÉ NOV/2026' : t >= T.mais26 ? '+ R$ 2,6 MI' : 'RENOVADO 2024'}
        corCarimbo={neutro}
        aceso={janela(t, T.saiu, T.carona)}
      />
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={TCM_VIS(t)} aceso={janela(t, T.marco, T.saiu, 0.5) + janela(t, T.decidiu, T.devolveu, 0.5)} />

      {/* caronas */}
      <PastaProcesso tema={tema} pos={CAR.pav} rotY={0.18} escala={0.85} sobe={car * rampa(t, T.pav - 0.1, T.pav + 0.4)} titulo="PAVIMENTAÇÃO · 2025" valor="R$ 20,5 MI" carimbo={t >= T.ren24 ? rampa(t, T.ren24, T.ren24 + 0.4) : rampa(t, T.ata, T.ata + 0.4)} textoCarimbo={t >= T.ren24 ? 'RENOVADA: R$ 24 MI' : 'ATA DE CONSÓRCIO'} corCarimbo={neutro} aceso={janela(t, T.pav, T.carros)} />
      <RoloCompactador tema={tema} pos={CAR.rolo} rotY={Math.PI / 2} escala={0.3 * car * rampa(t, T.pav, T.pav + 0.5)} giro={t * 0.6} />
      {car > 0.02 ? <CarroRua tema={tema} pos={soma(CAR.carro, [0, 0, 2.5 * (1 - rampa(t, T.carros, T.carros + 1.0))])} rotY={0} escala={0.55} farol={0.5} anda={0} t={t} /> : null}
      <PastaProcesso tema={tema} pos={CAR.carros} rotY={-0.18} escala={0.85} sobe={car * rampa(t, T.carros - 0.1, T.carros + 0.4)} titulo="ALUGUEL DE CARROS" valor="R$ 5,3 MI" carimbo={t >= T.tres ? rampa(t, T.tres, T.tres + 0.4) : rampa(t, T.morro, T.morro + 0.4)} textoCarimbo={t >= T.tres ? '+ R$ 5,3 MI' : 'ATA DE MORRO DO CHAPÉU'} corCarimbo={neutro} aceso={janela(t, T.carros, T.apurar)} />
      <PastaProcesso tema={tema} pos={CAR.tcm} escala={0.85} sobe={car * rampa(t, T.apurar - 0.1, T.apurar + 0.4)} titulo="TCM · LOCAÇÃO DE VEÍCULOS E MÁQUINAS" valor="2026" carimbo={rampa(t, T.apurar + 2.0, T.apurar + 2.4)} textoCarimbo="EM APURAÇÃO" corCarimbo={neutro} aceso={janela(t, T.apurar, T.decidiu)} />

      {/* Tribunal: o que já decidiu */}
      {PASTAS_T.map((pa, i) => (
        <PastaProcesso key={i} tema={tema} pos={[pa.x, 0, 1.2]} rotY={-pa.x * 0.05} escala={0.85} sobe={tri * rampa(t, pa.t - 0.1, pa.t + 0.4)} titulo={pa.titulo} valor={pa.valor} carimbo={rampa(t, pa.carimbo, pa.carimbo + 0.4)} textoCarimbo={pa.texto} corCarimbo={pa.alerta ? C.alerta : neutro} aceso={janela(t, pa.t, T.devolveu)} />
      ))}

      {/* devolução: casas apagadas do Teotônio Vilela, União e Caixa */}
      {CASAS.map((p, i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={0.1 * (i % 3)} luz={0} escala={0.32 * dev * rampa(t, T.casas - 0.2 + (i % 6) * 0.05, T.casas + 0.3 + (i % 6) * 0.05)} />
      ))}
      <BaseGaveta tema={tema} pos={DEV.uniao} sobe={dev * rampa(t, T.habitar, T.habitar + 0.4)} larg={2.0} texto="UNIÃO" aceso={janela(t, T.habitar, T.caixa)} />
      <BaseGaveta tema={tema} pos={DEV.caixa} sobe={dev * rampa(t, T.caixa - 0.1, T.caixa + 0.4)} larg={2.0} texto="CAIXA" aceso={janela(t, T.caixa, T.dez)} />

      {/* fecho */}
      <BaseGaveta tema={tema} pos={soma(FECHO, [0, 0, 1.35])} sobe={FECHO_VIS(t)} larg={4.2} texto="DINHEIRO DE CONVÊNIO · 2016 A 2025" aceso={0.5} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13.5, 11.5, [dx, 2.0, 1]);
const VER_REC = (i: number, perto = 1): Cam => E(soma(posRec(i), [0, 1.6, 0]), 3.6 * perto, 5.0 * perto, [-0.08 + i * 0.05, 1.1, 1]);
const VER_INF = (i: number, y: Inf): Cam => {
  const alt = Math.max(altTorre(Math.max(y.prev ?? 0, y.gastou) / ESC_I, 2), 2.2);
  return E(soma(posInf(i), [0, alt * 0.55, 0]), 3.6, alt + 2.6, [-0.12 + i * 0.024, 0.9, 1]);
};
const meio = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, DE_CIMA()]]},
  // 1. receita de capital
  {
    ini: T.capital - 0.2,
    arco: 0.04,
    chaves: [
      [T.capital - 0.2, E([0, 0.8, 1.6], 8.6, 7.0, [-0.05, 1.5, 1])],
      [REC[0].t - 0.2, E([0, 0.8, 2.0], 7.6, 6.4, [-0.08, 1.3, 1])],
      ...REC.flatMap((r, i): [number, Cam][] => [
        [r.t + 0.1, VER_REC(i, 1.25)],
        [(i + 1 < REC.length ? REC[i + 1].t : T.infra) - 0.4, VER_REC(i, 1.18)],
      ]),
    ],
  },
  // 2. infraestrutura ano a ano (sempre da esquerda para a direita)
  {
    ini: T.infra - 0.2,
    arco: 0.02,
    chaves: [
      [T.infra - 0.2, E([0, 1.6, -0.2], 12.4, 9.0, [0, 1.1, 1])],
      ...INF.flatMap((y, i): [number, Cam][] => [
        [y.t - 0.05, VER_INF(i, y)],
        [(i + 1 < INF.length ? INF[i + 1].t : T.repara) - 0.45, VER_INF(i, y)],
      ]),
    ],
  },
  // 3. obras no papel: plano geral e passa de placa em placa
  {
    ini: T.repara - 0.1,
    arco: 0.03,
    chaves: [
      [T.repara - 0.1, E([0, 1.2, 1.3], 9.6, 6.6, [0, 1.0, 1])],
      ...OBRAS.flatMap((o, i): [number, Cam][] => [
        [o.t - 0.1, E(soma(posObra(o), [0, 1.4, 0]), 3.0, 3.0, [-0.1 + 0.05 * i, 0.55, 1])],
        [(i + 1 < OBRAS.length ? OBRAS[i + 1].t : T.duasZero + 0.4) - 0.4, E(soma(posObra(o), [0, 1.4, 0]), 2.9, 2.9, [-0.08 + 0.05 * i, 0.55, 1])],
      ]),
      [T.duasZero + 0.5, E([2.7, 1.4, 1.3], 5.4, 3.8, [0.15, 0.6, 1])],
      [T.quem - 0.3, E([0, 1.2, 1.3], 9.6, 6.6, [0.08, 1.0, 1])],
    ],
  },
  // 4. empresas
  {
    ini: T.quem - 0.1,
    arco: 0.03,
    chaves: [
      [T.quem - 0.1, E([0, 1.0, 0.6], 10.2, 8.0, [0, 1.4, 1])],
      [T.cta - 0.2, E([-2.4, 1.6, 0.0], 5.6, 6.4, [-0.12, 1.0, 1])],
      [T.rbs - 0.2, E([-1.2, 1.8, Z_EMP], 4.2, 6.0, [-0.08, 0.9, 1])],
      [T.maq - 0.4, E([1.2, 2.0, Z_EMP], 4.2, 6.6, [-0.04, 0.9, 1])],
      [T.ghia - 0.3, E([3.6, 2.0, Z_EMP], 4.4, 6.0, [0.0, 0.9, 1])],
      [T.parte - 0.3, E([0.6, 1.6, -0.4], 8.4, 7.0, [0.04, 1.1, 1])],
    ],
  },
  // 5. iluminação
  {
    ini: T.parte - 0.1,
    arco: 0.03,
    chaves: [
      [T.parte - 0.1, E([0.4, 1.4, -1.6], 9.0, 7.4, [0, 1.2, 1])],
      [T.marco - 0.1, E([0, 1.6, -3.0], 6.0, 6.0, [-0.05, 1.0, 1])],
      [T.nula - 0.3, E(soma(ILU.conc, [0, 1.0, 0]), 3.2, 3.2, [-0.12, 0.8, 1])],
      [T.saiu - 0.2, E(soma(meio(ILU.conc, ILU.contrato), [0, 1.0, 0]), 4.2, 3.6, [-0.06, 0.8, 1])],
      [T.renovado, E(soma(ILU.contrato, [0, 1.0, 0]), 3.2, 3.2, [0.0, 0.8, 1])],
      [T.portal - 0.2, E(soma(ILU.contrato, [0, 1.0, 0]), 3.4, 3.4, [0.04, 0.8, 1])],
      [T.pagou - 0.2, E([4.0, 2.2, Z_EMP], 4.0, 6.4, [0.06, 0.9, 1])],
      [T.carona - 0.3, E([4.0, 2.2, Z_EMP], 4.2, 6.6, [0.1, 0.9, 1])],
    ],
  },
  // 6. caronas
  {
    ini: T.carona - 0.1,
    arco: 0.03,
    chaves: [
      [T.carona - 0.1, E([0, 1.2, 0.6], 8.8, 6.8, [0, 1.2, 1])],
      [T.pav - 0.1, E(soma(meio(CAR.pav, CAR.rolo), [0, 1.0, 0]), 4.0, 3.6, [-0.1, 0.8, 1])],
      [T.ren24 + 0.6, E(soma(meio(CAR.pav, CAR.rolo), [0, 1.0, 0]), 3.8, 3.4, [-0.06, 0.8, 1])],
      [T.carros - 0.1, E(soma(meio(CAR.carro, CAR.carros), [0, 1.0, 0]), 4.0, 3.6, [0.0, 0.8, 1])],
      [T.apurar - 0.3, E(soma(meio(CAR.carro, CAR.carros), [0, 1.0, 0]), 3.8, 3.4, [0.04, 0.8, 1])],
      [T.apurar + 0.2, E([0, 1.1, -0.6], 5.4, 4.6, [0.06, 1.0, 1])],
      [T.decidiu - 0.3, E([0, 1.1, -0.8], 5.2, 4.4, [0.08, 1.0, 1])],
    ],
  },
  // 7. Tribunal
  {
    ini: T.decidiu - 0.1,
    arco: 0.03,
    chaves: [
      [T.decidiu - 0.1, E([0, 1.4, -2.6], 7.4, 6.6, [-0.04, 1.2, 1])],
      [T.limpeza - 0.1, E([-2.5, 1.0, 1.2], 3.4, 3.2, [-0.1, 0.8, 1])],
      [T.emerg - 0.2, E([0, 1.0, 1.2], 3.4, 3.2, [-0.03, 0.8, 1])],
      [T.denuncias - 0.2, E([2.5, 1.0, 1.2], 3.4, 3.2, [0.04, 0.8, 1])],
      [T.naoCond - 0.2, E([0, 1.3, -0.6], 8.6, 6.6, [0.06, 1.2, 1])],
      [T.devolveu - 0.3, E([0, 1.3, -0.6], 8.4, 6.4, [0.08, 1.2, 1])],
    ],
  },
  // 8. dinheiro devolvido
  {
    ini: T.devolveu - 0.1,
    arco: 0.03,
    chaves: [
      [T.devolveu - 0.1, E([0, 0.8, 0.2], 9.6, 7.2, [0, 1.4, 1])],
      [T.habitar + 0.2, E([1.8, 1.0, -0.2], 7.0, 5.8, [0.03, 1.2, 1])],
      [T.casas - 0.2, E([-2.6, 0.6, -0.1], 5.2, 4.2, [-0.06, 1.0, 1])],
      [T.caixa - 0.1, E([2.6, 0.9, 0.6], 5.8, 5.0, [0.06, 1.2, 1])],
      [T.dez - 0.3, E([2.6, 0.9, 0.6], 5.6, 4.8, [0.1, 1.2, 1])],
    ],
  },
  // 9. fecho 301 x 44
  {
    ini: T.dez - 0.1,
    arco: 0.04,
    chaves: [
      [T.dez - 0.1, E(soma(FECHO, [0, 2.4, 0]), 6.6, 7.6, [0, 1.0, 1])],
      [T.porque + 0.2, E(soma(FECHO, [0, 2.4, 0]), 6.0, 7.4, [0.06, 0.9, 1])],
      [T.segue, E(soma(FECHO, [0, 2.4, 0]), 6.4, 7.8, [0.1, 1.0, 1])],
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
const F0: Omit<Folha, 'b'>[] = [
  {id: 2, a: REC[0].t, doc: 'Receita Orçamentária Consolidada', sub: 'PCMGE016 · DEZEMBRO DE 2016', pag: 6, linhas: [['Receitas de Capital · previsto', '59.168.500,00', true], ['Receitas de Capital · arrecadado', '6.667.872,33', true]]},
  {id: 3, a: REC[1].t, doc: 'Anexo 10 · Receita Orçada x Arrecadada', sub: 'CONTAS ANUAIS DE 2017', pag: 6, linhas: [['Receitas de Capital · orçado', '50.366.300,00', true], ['Receitas de Capital · arrecadado', '1.066.409,53', true]]},
  {id: 4, a: REC[2].t, doc: 'Anexo 10 · Receita Orçada x Arrecadada', sub: 'CONTAS ANUAIS DE 2024', pag: 13, linhas: [['Receitas de Capital · orçado', '28.267.000,00', true], ['Receitas de Capital · arrecadado', '3.198.879,33', true]]},
  {id: 5, a: REC[3].t, doc: 'Receita Orçamentária Consolidada', sub: 'PCMGE016 · AGOSTO DE 2026', pag: 6, linhas: [['Receitas de Capital · previsto', '65.831.494,00', true], ['Receitas de Capital · arrecadado até agosto', '11.130.653,11', true]]},
  {id: 6, a: INF[0].t, doc: 'Despesa Consolidada · Infraestrutura', sub: 'PCMGE015 · DEZEMBRO DE 2016', pag: 44, linhas: [['Total da unidade · dotação inicial', '60.792.800,00', true], ['Total da unidade · liquidado', '20.905.871,77', true]]},
  {id: 7, a: INF[1].t, doc: 'Anexo 11 · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2017', pag: 20, linhas: [['Secretaria de Infraestrutura · realizada', '14.432.652,11', true]]},
  {id: 8, a: INF[2].t, doc: 'Lei Orçamentária Anual de 2018', sub: 'LOA 2018 · INFRAESTRUTURA', pag: 3, linhas: [['Secretaria de Infraestrutura · fixado', '53.189.266,53', true]]},
  {id: 9, a: INF[2].tGastou, doc: 'Anexo XI · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2018', pag: 15, linhas: [['Secretaria de Infraestrutura · realizada', '17.293.164,01', true], ['Obras e instalações · autorizado', '16.767.713,69', true], ['Obras e instalações · realizado', '5.853.562,07', true]]},
  {id: 10, a: INF[3].t, doc: 'Lei Orçamentária Anual de 2019', sub: 'LOA 2019 · INFRAESTRUTURA', pag: 3, linhas: [['Secretaria de Infraestrutura · fixado', '56.530.000,00', true]]},
  {id: 11, a: INF[3].tGastou, doc: 'Anexo XI · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2019', pag: 15, linhas: [['Secretaria de Infraestrutura · realizada', '10.843.803,58', true], ['Nova Secretaria de Infraestrutura · realizada (pág. 27)', '4.155.592,37', true]]},
  {id: 12, a: INF[4].t, doc: 'Despesa Orçamentária · Infraestrutura', sub: 'PCMGE015 · DEZEMBRO DE 2020', pag: 98, linhas: [['Unidade 11.1101 · dotação inicial', '35.091.531,99', true], ['Unidade 11.1101 · liquidado', '21.949.622,49', true]]},
  {id: 13, a: INF[5].t, doc: 'Despesa Orçamentária · Infraestrutura', sub: 'PCMGE015 · DEZEMBRO DE 2021', pag: 97, linhas: [['Unidade 11.1101 · dotação inicial', '23.093.000,00', true], ['Unidade 11.1101 · liquidado', '17.439.429,25', true]]},
  {id: 14, a: INF[6].t, doc: 'Anexo 11 · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2022', pag: 2, linhas: [['Secretaria de Infraestrutura · realizada', '36.528.583,36', true]]},
  {id: 15, a: INF[7].t, doc: 'Despesa Orçamentária · Infraestrutura', sub: 'PCMGE015 · SETEMBRO DE 2023', pag: 19, linhas: [['Secretaria de Infraestrutura · dotação inicial', '25.739.112,17', true]]},
  {id: 16, a: INF[7].tGastou, doc: 'Anexo 11 · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2023', pag: 2, linhas: [['Secretaria de Infraestrutura · realizada', '54.681.462,98', true]]},
  {id: 17, a: INF[8].t, doc: 'Anexo 11 · Despesa Autorizada x Realizada', sub: 'CONTAS ANUAIS DE 2024', pag: 3, linhas: [['Secretaria de Infraestrutura · créditos autorizados', '58.029.629,76', false], ['Secretaria de Infraestrutura · realizada', '55.581.401,12', true]]},
  {id: 18, a: INF[9].t, doc: 'Despesa Orçamentária Consolidada', sub: 'PCMGE015 · DEZEMBRO DE 2025', pag: 43, linhas: [['Unidade 17001 · dotação inicial', '65.315.000,00', true], ['Unidade 17001 · liquidado', '18.285.385,81', true]]},
  {id: 19, a: INF[10].t, doc: 'Despesa Orçamentária Consolidada', sub: 'PCMGE015 · AGOSTO DE 2026', pag: 49, linhas: [['Órgão 21 · Infraestrutura · inicial', '112.219.538,00', true], ['Órgão 21 · liquidado até agosto', '22.087.949,73', true]]},
  {id: 20, a: T.cemit, doc: 'Anexo VI · Programa de Trabalho', sub: 'CONTAS ANUAIS DE 2017 (UM DOS DEZ ANOS)', pag: 14, linhas: [['Construção e ampliação de cemitérios · executado', '0,00', true]]},
  {id: 21, a: T.em22, doc: 'Anexo 6 · Programa por Unidade', sub: 'CONTAS ANUAIS DE 2022', pag: 6, linhas: [['Drenagem e pavimentação da Rua Maria Pureza · executado', '0,00', true], ['Pavimentação do bairro Saracura · executado (pág. 7)', '0,00', true]]},
  {id: 22, a: T.rbs, doc: 'Contrato 151/2017 · RBS Construtora', sub: 'MESMO CNPJ DA BASE TERRAPLANAGEM', pag: 1, linhas: [['CNPJ da contratada', '21.442.493/0001-90', true]]},
  {id: 23, a: T.marco, doc: 'Deliberação TCM 14546e22', sub: 'JULGADA EM 06/03/2024', pag: 3, linhas: [['Concorrência 002/2022 · iluminação pública', 'NULIDADE', true], ['Multa ao gestor', 'R$ 2.000,00', false]]},
  {id: 24, a: T.pav, doc: 'Contrato 008/2025 · Pavimentação', sub: 'CLÁUSULA TERCEIRA · DO PREÇO', pag: 2, linhas: [['Valor total da contratação', '20.464.269,49', true]]},
  {id: 25, a: T.ata, doc: '1º Termo Aditivo · Contrato 008/2025', sub: 'ORIGEM DA CONTRATAÇÃO', pag: 1, linhas: [['Ata de registro de preços · consórcio CIVALERG', '001/2024', true], ['Concorrência / SRP', '001/2023', false]]},
  {id: 26, a: T.carros, doc: 'Adesão à Ata 018/2025', sub: 'PE 016/2025 · MORRO DO CHAPÉU', pag: 2, linhas: [['Locação de veículos · valor', '5.274.108,60', true]]},
  {id: 27, a: T.limpeza, doc: 'Recurso 12280e20 · Auditoria 09243e19', sub: 'LIMPEZA URBANA · 2017', pag: 3, linhas: [['Valor a ressarcir', '1.656.585,98', true], ['Recurso', 'NÃO PROVIDO', true]]},
  {id: 28, a: T.emerg, doc: 'Deliberação TCM 00568e20', sub: 'CONTRATAÇÃO EMERGENCIAL DE LIMPEZA · 2019', pag: 1, linhas: [['Ressarcimento', '344.678,47', true], ['Multa', '20.000,00', false]]},
  {id: 29, a: T.habitar, doc: 'Relação de Pagamentos', sub: 'PCMGE056 · NOVEMBRO DE 2016 · PROCESSO 4349', pag: 12, linhas: [['Devolução à União · Habitar Brasil', '4.722.302,75', true]]},
  {id: 30, a: T.caixa, doc: 'Relação de Pagamentos', sub: 'PCMGE056 · MAIO DE 2020', pag: 9, linhas: [['Devolução de saldo · contrato de repasse (Caixa)', '2.984.058,20', true]]},
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
  {a: T.capital, b: REC[0].t, texto: 'DINHEIRO DE FORA: CONVÊNIOS, EMENDAS E EMPRÉSTIMOS'},
  ...REC.map((r, i) => ({a: r.tEntrou, b: i + 1 < REC.length ? REC[i + 1].t : T.infra, texto: `${r.ano}: NO PAPEL ${fmtV(r.prev)} · CHEGOU ${fmtV(r.entrou)}`, destaque: true})),
  {a: T.infra, b: INF[0].t, texto: 'SECRETARIA DE INFRAESTRUTURA · ANO A ANO'},
  {a: T_OBRAS18, b: INF[3].t, texto: 'OBRAS 2018: AUTORIZOU R$ 16,8 MI · EXECUTOU R$ 5,9 MI', destaque: true},
  {a: T_DOBRO, b: INF[8].t, texto: '2023: GASTOU MAIS QUE O DOBRO DO PREVISTO', destaque: true},
  {a: T_MAIOR, b: INF[9].t, texto: '2024: O MAIOR GASTO DOS DEZ ANOS', destaque: true},
  {a: T.repara, b: T.cemit, texto: 'NO ORÇAMENTO TODO ANO, FORA DO PAPEL NUNCA'},
  {a: T.duasZero, b: T.quem, texto: 'AS DUAS TERMINARAM 2022 COM ZERO', destaque: true},
  {a: T.n414, b: T.cta, texto: 'OBRAS E SERVIÇOS URBANOS: R$ 414 MI EM 10 ANOS', destaque: true},
  {a: T.cta76, b: T.rbs, texto: 'CTA: R$ 76,4 MI DE 2018 A 2025'},
  {a: T.rbs61, b: T.maq, texto: 'RBS / BASE: R$ 61,4 MI DE 2017 A 2025'},
  {a: T.maq85, b: T.ghia, texto: 'ALUGUEL DE MÁQUINAS: R$ 85,8 MI EM 10 ANOS', destaque: true},
  {a: T.ghia60, b: T.parte, texto: 'GHIA: R$ 60,5 MI'},
  {a: T.multou, b: T.saiu, texto: 'NOVA LICITAÇÃO E MULTA AO GESTOR'},
  {a: T.portal, b: T.pagou, texto: 'PORTAL: NENHUM CONTRATO NOVO DE ILUMINAÇÃO DEPOIS DE 2022'},
  {a: T.ghia38, b: T.carona, texto: 'PAGO À GHIA DE 2023 A AGO/2026: R$ 38,8 MI', destaque: true},
  {a: T.carona, b: T.pav, texto: '2025: CONTRATOS POR CARONA EM ATA DE OUTROS LUGARES'},
  {a: T.ren24, b: T.carros, texto: 'PAVIMENTAÇÃO RENOVADA EM 2026: R$ 24 MI'},
  {a: T.tres, b: T.apurar, texto: 'TRÊS MESES DEPOIS: MAIS R$ 5,3 MI', destaque: true},
  {a: T.apurar, b: T.decidiu, texto: 'TCM: PROCESSO ABERTO EM 2026 · SEM JULGAMENTO'},
  {a: T.denuncias, b: T.naoCond, texto: '4 DENÚNCIAS DE 2022 · SEM JULGAMENTO DESDE 2023'},
  {a: T.naoCond, b: T.devolveu, texto: 'ESTAR NO TRIBUNAL NÃO É CONDENAÇÃO'},
  {a: T.casas, b: T.caixa, texto: '272 CASAS NO TEOTÔNIO VILELA'},
  {a: T.dez, b: T.gastar, texto: 'DEZ ANOS E TRÊS GESTÕES'},
  {a: T.gastar, b: T.porque, texto: 'GASTAR NÃO É CRIME'},
  {a: T.porque, b: T.segue, texto: 'PROMETEU R$ 301 MI · CHEGARAM R$ 44 MI', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.capital, b: T.infra, texto: 'FONTE: ANEXO 10 E PCMGE016 · e-TCM · TCM-BA'},
  {a: T.infra, b: T.repara, texto: 'FONTE: LOA, ANEXO 11 E PCMGE015 · e-TCM · TCM-BA'},
  {a: T.repara, b: T.quem, texto: 'FONTE: ANEXO 6 (PROGRAMA DE TRABALHO) · TCM-BA'},
  {a: T.quem, b: T.parte, texto: 'FONTE: RELAÇÕES DE PAGAMENTO (PCMGE056) 2016–2026 · TCM-BA'},
  {a: T.parte, b: T.carona, texto: 'FONTES: TCM-BA (14546e22) E PORTAL DA TRANSPARÊNCIA'},
  {a: T.carona, b: T.decidiu, texto: 'FONTES: CONTRATOS NO e-TCM E PORTAL DA TRANSPARÊNCIA'},
  {a: T.decidiu, b: T.devolveu, texto: 'FONTE: TCM-BA › DECISÕES (09/11/2026)'},
  {a: T.devolveu, b: T.dez, texto: 'FONTE: RELAÇÕES DE PAGAMENTO 2016 E 2020 · TCM-BA'},
  {a: T.dez, b: T.segue, texto: 'FONTE: ANEXO 10 DE 2016 A 2025 · CONTA PRÓPRIA DA SOMA'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const r: Rot[] = [];
  const fant = mistura(tema.objetoClaro, tema.texto, 0.4);
  REC.forEach((x, i) => {
    const fim = i + 1 < REC.length ? REC[i + 1].t + 0.6 : T.infra - 0.2;
    r.push({a: x.t + 1.0, b: fim, p: soma(posRec(i), [0, altTorre(x.prev / ESC_R, 3) + 0.3, 0]), valor: `NO PAPEL ${fmtV(x.prev)}`, sub: x.ano, cor: fant});
    r.push({a: x.tEntrou + 0.5, b: fim, p: soma(posRec(i), [0.0, altTorre(x.entrou / ESC_R, 3) + 0.25, 0.45]), valor: `CHEGOU ${fmtV(x.entrou)}`, cor: C.ouro});
  });
  INF.forEach((y, i) => {
    const fim = i + 1 < INF.length ? INF[i + 1].t + 0.5 : T.repara;
    const alt = altTorre(Math.max(y.prev ?? 0, y.gastou) / ESC_I, 2);
    r.push({a: y.tGastou + 0.5, b: fim, p: soma(posInf(i), [0, alt + 0.3, 0]), valor: `GASTOU ${fmtV(y.gastou)}`, sub: y.prev ? `${y.ano} · PREVIU ${fmtV(y.prev)}` : `${y.ano} · PREVISTO NÃO CONSTA NO TCM`, cor: y.ano === '2023' || y.ano === '2024' ? tema.acento : C.ouro});
  });
  // empresas
  EMP.forEach((e) => {
    const fim = e.id === 'ghia' ? T.parte + 0.3 : T.parte - 0.2;
    r.push({a: e.t + 0.6, b: fim, p: soma(posEmp(e), [0, altTorre(e.v / 4, 2) + 0.35, 0]), valor: fmtV(e.v), sub: e.id === 'maq' ? 'ALUGUEL DE MÁQUINAS · 10 ANOS' : e.nomes[e.nomes.length - 1][0], cor: e.id === 'maq' ? mistura(C.ouro, tema.acento, 0.35) : C.ouro});
  });
  r.push({a: T.ghia38 + 0.5, b: T.carona - 0.2, p: soma(GHIA38, [0, altTorre(38.8 / 4, 2) + 0.35, 0]), valor: 'R$ 38,8 MI', sub: 'GHIA · 2023 A AGO/2026', cor: tema.acento});
  // devolução
  r.push({a: T.habitar + 1.4, b: T.dez - 0.2, p: soma(DEV.uniao, [0, altTorre(4.7223 / ESC_D, 2) + 0.35, 0]), valor: 'R$ 4,7 MI', sub: 'À UNIÃO · HABITAR BRASIL · 2016'});
  r.push({a: T.caixa + 1.2, b: T.dez - 0.2, p: soma(DEV.caixa, [0, altTorre(2.9841 / ESC_D, 2) + 0.35, 0]), valor: 'R$ 3 MI', sub: 'À CAIXA · 2020'});
  r.push({a: T.casas + 0.6, b: T.caixa + 0.4, p: [-2.6, 1.0, 1.0], valor: '272 CASAS', sub: 'TEOTÔNIO VILELA'});
  // fecho
  r.push({a: T.dez + 1.0, b: T.segue + 0.3, p: soma(FECHO, [0, altTorre(301.17 / 4, 4) + 0.3, 0]), valor: 'PROMETEU R$ 301 MI', sub: 'CONVÊNIOS · 2016 A 2025', cor: fant});
  r.push({a: T.porque + 0.8, b: T.segue + 0.3, p: soma(FECHO, [0, altTorre(44.25 / 4, 4) + 0.25, 0.75]), valor: 'CHEGARAM R$ 44 MI', cor: C.ouro});
  return r;
};

const noMapa = (t: number) => t < T.capital;
const soMapa = (t: number) => t < T.capital - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.capital) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const kFolha = folha ? 1 : 0;
  const escK = Math.max(vis(t, T.capital, T.repara), vis(t, T.quem, T.parte), vis(t, T.devolveu, FIM));
  const escTxt = t < T.infra ? '1 PILHA = R$ 2 MI · TRANSPARENTE = PREVISTO' : t < T.quem ? '1 PILHA = R$ 4 MI · TRANSPARENTE = PREVISTO' : t < T.dez ? (t < T.devolveu ? '1 PILHA = R$ 4 MI' : '1 PILHA = R$ 500 MIL') : '1 PILHA = R$ 4 MI · TRANSPARENTE = PREVISTO';
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', alignItems: 'center', gap: 10, opacity: 1 - 0.0 * kFolha}}>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/obrasilheus10.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera em números grandes ----------
const SOQUINHOS = [...REC.map((r) => r.tEntrou), ...INF.map((y) => y.tGastou), T.cemZero, T.duasZero, T.n414, T.nula, T.ghia38, T.n1656, T.n344, T.porque];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  REC.forEach((r) => s.push({t: r.tEntrou + 0.2, f: 'pop', v: 0.16}));
  INF.forEach((y) => s.push({t: y.tGastou + 0.15, f: 'subida', v: 0.13}));
  OBRAS.forEach((o) => s.push({t: o.t + 0.1, f: 'pop', v: 0.15}, {t: o.zero + 0.05, f: 'impacto', v: 0.13}));
  EMP.forEach((e) => s.push({t: e.t + 0.1, f: 'subida', v: 0.14}));
  [T.nula, T.negado, T.n344 + 0.6, T.semJulg].forEach((x) => s.push({t: x + 0.05, f: 'impacto', v: 0.13}));
  [T.renovado, T.mais26, T.prorrog, T.ata, T.ren24, T.morro, T.tres, T.ghia38, T.habitar + 0.3, T.caixa + 0.4].forEach((x) => s.push({t: x + 0.1, f: 'pop', v: 0.15}));
  [T.n414, T.porque + 0.3].forEach((x) => s.push({t: x + 0.1, f: 'baque', v: 0.17}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala (regra 13)
export const REVISAO: number[] = [
  0.6, 2.5, 4.8, 7.8, 11.0, T.capital + 1.0,
  ...REC.flatMap((r) => [r.t + 1.2, r.tEntrou + 1.0]),
  T.infra + 1.0,
  ...INF.flatMap((y) => [y.t + 1.0, y.tGastou + 1.0]),
  T_OBRAS18 + 1.0, T_MAIOR + 0.8,
  T.repara + 0.8, ...OBRAS.flatMap((o) => [o.t + 1.0, o.zero + 0.8]),
  T.quem + 0.6, T.n414 + 0.8, T.cta76 + 1.2, T.rbs + 1.0, T.base + 0.8, T.rbs61 + 1.2, T.maq85 + 1.2, T.ghia60 + 1.0,
  T.parte + 0.6, T.marco + 1.0, T.nula + 0.8, T.saiu + 0.8, T.renovado + 0.8, T.mais26 + 0.8, T.prorrog + 0.8, T.portal + 1.0, T.ghia38 + 1.0,
  T.carona + 0.8, T.pav + 1.0, T.ata + 1.0, T.ren24 + 0.8, T.carros + 1.0, T.morro + 0.8, T.tres + 1.0, T.apurar + 2.5,
  T.decidiu + 0.6, T.limpeza + 1.0, T.negado + 0.6, T.emerg + 1.0, T.n344 + 1.0, T.denuncias + 1.0, T.semJulg + 0.8, T.naoCond + 0.8,
  T.devolveu + 0.6, T.habitar + 1.2, T.casas + 1.0, T.caixa + 1.2,
  T.dez + 0.8, T.gastar + 0.5, T.porque + 1.5, T.segue + 0.4, T.segue + 1.8, FIM - 0.4,
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
export const ObrasIlheus10: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
export const TITULO_CAPA = ['Prometeu 301', 'milhões.', 'Chegaram', 'só 44.'];
export const CapaObrasIlheus10: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 450}) => {
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
