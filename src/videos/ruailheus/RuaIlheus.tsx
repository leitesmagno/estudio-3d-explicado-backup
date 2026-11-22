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
import {ArvoreRedonda, CalendarioGrande, CasaMini, Confete, Van} from '../../pecas';
import {MesaMaquete, PilhasDinheiro, Prefeitura, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {BaseGaveta} from '../orcamentoparatinga/pecas';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {PALAVRAS} from './palavras';

// 154. Ilhéus: os 3 consultórios móveis (post do prefeito de 13/11/2026). Tom de deboche leve, só com fatos:
// as vans são do Ministério da Saúde (400 para todas as equipes cofinanciadas até 2027), Consultório na Rua existe onde há
// gente morando na rua, "móvel x imóvel" e o gasto da assistência social (MSC jan–set/2026). Sem nome de gestor.

export const FPS = 30;
const AUDIO_SEG = 81.67;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '154. ilhéus consultório na rua';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  prim: quando('Primeiro quem mandou'),
  minist: quando('Ministerio da Saude'),
  dinheiro: quando('Dinheiro do Governo'),
  chave: quando('recebeu a chave'),
  seg: quando('Segundo esse'),
  v400: quando('400 unidades'),
  v350: quando('350 ainda'),
  resto: quando('o resto ate 2027'),
  tres: quando('Ilheus tem tres equipes'),
  ganhou: quando('Ganhou tres vans'),
  concurso: quando('Nao foi concurso'),
  fila: quando('Foi fila'),
  parte: quando('a parte que ninguem'),
  existe: quando('Consultorio na Rua existe'),
  cidade3: quando('Uma cidade com tres'),
  festejar: quando('como festejar'),
  boa: quando('A ambulancia e boa'),
  motivo: quando('O motivo nem tanto'),
  repara: quando('E repara'),
  movel: quando('Veiculo e movel'),
  imovel: quando('e um imovel'),
  teto: quando('Um teto'),
  din: quando('E o dinheiro da propria'),
  v119: quando('11,9 milhoes'),
  menos: quando('Menos de'),
  adm: quando('ficaram na administracao'),
  com: quando('a comunicacao social'),
  v31: quando('3,1 milhoes'),
  entao: quando('Entao fica assim'),
  trofeu: quando('nao e trofeu'),
  ans: quando('Ansiedade boa'),
  quero: quando('Esse eu quero ver'),
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


// ---------- Lugares ----------
const MS_POS: V3 = [-4.6, 0, -2.6];
const PREF_POS: V3 = [3.0, 0, -2.2];
const vanDe = (k: number): V3 => [-4.2, 0, -1.0 + k * 0.9];
const vanAte = (k: number): V3 => [0.8 + k * 1.15, 0, 0.9];
const vanEm = (t: number, k: number): V3 => {
  const a = rampa(t, T.minist + 0.3 + k * 0.25, T.minist + 2.2 + k * 0.25);
  const d = vanDe(k), e = vanAte(k);
  return [d[0] + (e[0] - d[0]) * a, 0, d[2] + (e[2] - d[2]) * a];
};
const RUA: V3[] = [[-3.6, 0, 2.6], [-3.0, 0, 3.1], [-2.4, 0, 2.6], [-1.8, 0, 3.1], [-1.2, 0, 2.6]];
const CASA_POS: V3 = [-2.4, 0, 0.6];
const ASSIST_POS: V3 = [-1.0, 0, 0.6];
const COM_POS: V3 = [1.2, 0, 0.6];
const V_ASS = 11.881;
const V_ADM = 6.987;
const V_COM = 3.147;
const C_VANS = (t: number) => vis(t, T.prim - 0.2, T.din - 0.1) + vis(t, T.entao - 0.1, FIM + 2);
const C_FILA = (t: number) => vis(t, T.seg - 0.1, T.parte - 0.1);
const C_RUA = (t: number) => vis(t, T.existe - 0.1, T.din - 0.1);
const C_DIN = (t: number) => vis(t, T.din - 0.1, T.entao - 0.1);

const pilhasEm = (t: number, tema: Tema): Pilha[] => {
  const C = coresOI(tema);
  const s: Pilha[] = [];
  const v = C_DIN(t);
  if (v < 0.01) return s;
  const ka = cresce(t, T.v119 + 0.1, 1.2) * v;
  const kAdm = rampa(t, T.adm + 0.2, T.adm + 0.8);
  if (ka > 0.01) {
    const n = V_ASS * ka;
    torre(ASSIST_POS, n, 2, C.ouro, 0.3).forEach((p, j) => s.push({...p, cor: j < V_ADM && kAdm > 0.5 ? mistura(C.ouro, tema.texto, 0.45) : tema.acento}));
  }
  const kc = cresce(t, T.com + 0.3) * v;
  if (kc > 0.01) s.push(...torre(COM_POS, V_COM * kc, 2, C.ouro, 0.3));
  return s;
};

const ARVORES: V3[] = [[-6.6, 0, 4.4], [6.4, 0, 4.6], [-7.4, 0, -2.6], [7.2, 0, -2.0]];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const cv = Math.min(1, C_VANS(t));
  const cf = C_FILA(t);
  const cr = C_RUA(t);
  const solidas = pilhasEm(t, tema);
  const parado = t >= T.seg;
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />)}
      <PilhasDinheiro pilhas={solidas} max={200} />
      <BaseGaveta tema={tema} pos={MS_POS} sobe={vis(t, T.prim - 0.2, T.seg)} larg={3.0} texto="MINISTÉRIO DA SAÚDE" aceso={janela(t, T.minist, T.chave)} />
      <Prefeitura tema={tema} pos={PREF_POS} sobe={vis(t, T.prim - 0.2, T.din - 0.1) + vis(t, T.entao, FIM + 2)} aceso={janela(t, T.chave, T.seg) + janela(t, T.ans, FIM)} escala={0.75} />
      {[0, 1, 2].map((k) => <Van key={k} tema={tema} pos={parado ? vanAte(k) : vanEm(t, k)} rotY={0} escala={0.6 * cv} />)}
      {/* fila: equipes e calendário */}
      {[0, 1, 2].map((k) => <Boneco key={'e' + k} tema={tema} pos={[0.8 + k * 1.15, 0, 1.8]} rotY={0} escala={0.45 * cf * rampa(t, T.tres + k * 0.15, T.tres + 0.4 + k * 0.15)} cor={mistura(tema.pessoa, tema.ceuLuz, 0.25)} />)}
      <CalendarioGrande tema={tema} pos={[-3.0, 0, -0.6]} rotY={0.25} texto="2026" sub="350 EQUIPES" folha={rampa(t, T.v350, T.v350 + 0.5)} escala={0.7 * cf * rampa(t, T.v350 - 0.2, T.v350 + 0.3)} destaque={janela(t, T.v350, T.resto)} />
      <CalendarioGrande tema={tema} pos={[-1.2, 0, -0.9]} rotY={0.15} texto="2027" sub="TODAS" folha={rampa(t, T.resto, T.resto + 0.5)} escala={0.7 * cf * rampa(t, T.resto - 0.2, T.resto + 0.3)} destaque={janela(t, T.resto, T.tres)} />
      <Confete tema={tema} centro={[2.0, 1.6, 0.9]} t={t} t0={T.festejar} dur={2.2} raio={2.0} n={60} />
      {/* quem mora na rua */}
      {RUA.map((p, i) => <Boneco key={'r' + i} tema={tema} pos={p} rotY={0.4} escala={0.42 * cr * rampa(t, T.existe + i * 0.1, T.existe + 0.4 + i * 0.1)} cor={mistura(tema.objetoEscuro, tema.texto, 0.3)} />)}
      <BaseGaveta tema={tema} pos={[-2.4, 0, 3.9]} sobe={cr * rampa(t, T.existe, T.existe + 0.4)} larg={3.6} texto="QUEM MORA NA RUA" aceso={janela(t, T.existe, T.repara)} />
      {/* móvel x imóvel */}
      <BaseGaveta tema={tema} pos={[2.0, 0, 2.2]} sobe={vis(t, T.movel - 0.1, T.din - 0.1)} larg={2.6} texto="MÓVEL: CHEGOU" aceso={janela(t, T.movel, T.imovel)} />
      <CasaMini tema={tema} pos={CASA_POS} rotY={0.3} luz={0} fechada={1} escala={0.9 * vis(t, T.imovel - 0.1, T.din - 0.1)} />
      <BaseGaveta tema={tema} pos={soma(CASA_POS, [0, 0, 1.3])} sobe={vis(t, T.imovel - 0.1, T.din - 0.1)} larg={2.6} texto="IMÓVEL: FALTA" aceso={janela(t, T.imovel, T.din)} />
      {/* dinheiro */}
      <BaseGaveta tema={tema} pos={soma(ASSIST_POS, [0, 0, 1.1])} sobe={C_DIN(t) * rampa(t, T.din, T.din + 0.4)} larg={2.0} texto="ASSISTÊNCIA SOCIAL" aceso={janela(t, T.din, T.com)} />
      <BaseGaveta tema={tema} pos={soma(COM_POS, [0, 0, 1.1])} sobe={C_DIN(t) * rampa(t, T.com, T.com + 0.4)} larg={2.0} texto="COMUNICAÇÃO" aceso={janela(t, T.com, T.entao)} />
      <CasaMini tema={tema} pos={[-1.6, 0, -0.8]} rotY={0.3} luz={rampa(t, T.quero, T.quero + 0.6)} fechada={0} escala={0.8 * vis(t, T.ans - 0.1, FIM + 2)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1, 0], 12, 10, [0, 1.6, 1])]]},
  {ini: T.prim - 0.2, arco: 0.03, chaves: [
    [T.prim - 0.2, E([-0.6, 1.0, -0.6], 10.8, 7.6, [-0.05, 1.2, 1])],
    [T.chave - 0.2, E([2.0, 1.0, -0.2], 6.8, 5.6, [0.02, 1.0, 1])],
    [T.seg - 0.3, E([2.0, 1.0, -0.2], 6.6, 5.4, [0.05, 1.0, 1])],
  ]},
  {ini: T.seg - 0.1, arco: 0.03, chaves: [
    [T.seg - 0.1, E([-0.4, 1.0, 0.0], 9.0, 6.8, [-0.04, 1.1, 1])],
    [T.v350 - 0.1, E([-2.1, 1.0, -0.6], 4.6, 3.8, [-0.06, 0.8, 1])],
    [T.tres - 0.1, E([2.0, 0.8, 1.2], 5.0, 3.8, [0.0, 0.7, 1])],
    [T.parte - 0.3, E([2.0, 0.8, 1.2], 4.8, 3.6, [0.04, 0.7, 1])],
  ]},
  {ini: T.parte - 0.1, arco: 0.03, chaves: [
    [T.parte - 0.1, E([0, 1.0, 1.6], 9.6, 6.8, [-0.04, 1.0, 1])],
    [T.existe - 0.1, E([-2.4, 0.8, 3.0], 4.8, 3.6, [-0.06, 0.7, 1])],
    [T.festejar - 0.1, E([2.0, 1.2, 1.0], 5.6, 5.0, [0.02, 0.8, 1])],
    [T.repara - 0.1, E([0, 0.9, 1.4], 7.8, 5.2, [0.0, 0.8, 1])],
    [T.imovel, E([-0.2, 0.9, 1.4], 7.0, 4.8, [0.03, 0.8, 1])],
    [T.din - 0.3, E([-0.2, 0.9, 1.4], 6.8, 4.6, [0.06, 0.8, 1])],
  ]},
  {ini: T.din - 0.1, arco: 0.03, chaves: [
    [T.din - 0.1, E([0, 1.2, 0.8], 6.4, 5.0, [-0.04, 0.9, 1])],
    [T.adm, E([-1.0, 1.4, 0.8], 4.0, 4.0, [-0.06, 0.8, 1])],
    [T.com, E([0.1, 1.2, 0.8], 5.4, 4.4, [0.02, 0.8, 1])],
    [T.entao - 0.3, E([0.1, 1.2, 0.8], 5.2, 4.2, [0.05, 0.8, 1])],
  ]},
  {ini: T.entao - 0.1, arco: 0.04, chaves: [
    [T.entao - 0.1, E([1.0, 1.0, -0.2], 9.0, 6.8, [-0.04, 1.1, 1])],
    [T.ans, E([0.8, 0.9, -0.8], 7.6, 5.4, [0.02, 0.9, 1])],
    [T.segue, E([0, 1.2, -0.4], 8.0, 6.8, [0.1, 1.0, 1])],
    [FIM, E([0, 1.2, -0.4], 12.0, 9.6, [0.25, 1.4, 1])],
  ]},
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


// ---------- Folhas (documentos reais) ----------
const F0: Omit<Folha, 'b'>[] = [
  {id: 1, a: T.minist + 0.2, doc: 'Ministério da Saúde · notícia oficial', sub: 'JUNHO DE 2026 · POLÍTICA PARA A POPULAÇÃO DE RUA', origem: 'GOV.BR/SAUDE', linhas: [['Unidades Móveis de Rua previstas', '400', true], ['Para quem', 'TODAS AS EQUIPES COFINANCIADAS', false]]},
  {id: 2, a: T.v350 + 0.2, doc: 'Ministério da Saúde · notícia oficial', sub: 'JUNHO DE 2026', origem: 'GOV.BR/SAUDE', linhas: [['Equipes que recebem ainda em 2026', '350', true], ['Todas em funcionamento até', '2027', true]]},
  {id: 3, a: T.tres + 0.3, doc: 'Secretaria Municipal de Saúde de Ilhéus', sub: 'NOTÍCIA DE 13/11/2026', origem: 'JORNAL FOCO', linhas: [['Equipes de Consultório na Rua em Ilhéus', '3', true], ['Unidades móveis recebidas', '3', true]]},
  {id: 4, a: T.v119, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'EXECUTIVO · LIQUIDADO DE JANEIRO A SETEMBRO DE 2026', origem: 'SICONFI · TESOURO NACIONAL', linhas: [['Função 08 · Assistência Social', '11.880.677,74', true]]},
  {id: 5, a: T.menos, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'EXECUTIVO · LIQUIDADO DE JANEIRO A SETEMBRO DE 2026', origem: 'SICONFI · TESOURO NACIONAL', linhas: [['Total liquidado pela Prefeitura', '621.326.052,08', false], ['Assistência Social (1,91%)', '11.880.677,74', true]]},
  {id: 6, a: T.adm + 0.3, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'FUNÇÃO 08 · SUBFUNÇÃO 122', origem: 'SICONFI · TESOURO NACIONAL', linhas: [['Administração geral da Assistência Social', '6.987.342,05', true]]},
  {id: 7, a: T.v31, doc: 'Matriz de Saldos Contábeis (MSC)', sub: 'SUBFUNÇÃO 131 · COMUNICAÇÃO SOCIAL', origem: 'SICONFI · TESOURO NACIONAL', linhas: [['Comunicação social', '3.147.473,61', true]]},
];
const FOLHAS: Folha[] = F0.sort((x, y) => x.a - y.a).map((f, i, arr) => {
  const prox = i + 1 < arr.length ? arr[i + 1].a : 1e9;
  return {...f, b: Math.max(f.a + 2.6, Math.min(f.a + 3.4, prox - 0.05))};
});
const TOPO_FOLHA = 470;
const folhaEm = (t: number) => FOLHAS.filter((f) => t >= f.a - 0.05 && t < f.b + 0.05).pop();

type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.prim, b: T.chave, texto: 'QUEM MANDOU: MINISTÉRIO DA SAÚDE'},
  {a: T.chave, b: T.seg, texto: 'A PREFEITURA RECEBEU A CHAVE', destaque: true},
  {a: T.seg, b: T.v400, texto: '“SÓ 100 MUNICÍPIOS”?'},
  {a: T.concurso, b: T.fila, texto: 'NÃO FOI CONCURSO'},
  {a: T.fila, b: T.parte, texto: 'FOI FILA', destaque: true},
  {a: T.parte, b: T.existe, texto: 'A PARTE QUE NINGUÉM COMEMORA'},
  {a: T.cidade3, b: T.festejar, texto: '3 EQUIPES = PRECISA DE 3 EQUIPES'},
  {a: T.festejar, b: T.boa, texto: 'AMBULÂNCIA NOVA NA ESQUINA DO ACIDENTE', destaque: true},
  {a: T.boa, b: T.repara, texto: 'A AMBULÂNCIA É BOA. O MOTIVO, NEM TANTO.'},
  {a: T.teto, b: T.din, texto: 'FALTA UM TETO', destaque: true},
  {a: T.entao, b: T.trofeu, texto: 'VEIO DE BRASÍLIA · TODA CIDADE COM EQUIPE VAI RECEBER'},
  {a: T.trofeu, b: T.ans, texto: 'NÃO É TROFÉU', destaque: true},
  {a: T.ans, b: T.segue, texto: 'ANSIEDADE BOA: MENOS GENTE MORANDO NA RUA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.prim, b: T.parte, texto: 'FONTE: MINISTÉRIO DA SAÚDE (JUN/2026) E SESAU ILHÉUS (13/11/2026)'},
  {a: T.parte, b: T.din, texto: 'CONSULTÓRIO NA RUA · MINISTÉRIO DA SAÚDE'},
  {a: T.din, b: T.entao, texto: 'FONTE: MSC · TESOURO NACIONAL · JAN–SET/2026 · CONTA PRÓPRIA'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));


type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const r: Rot[] = [];
  [0, 1, 2].forEach((k) => r.push({a: T.tres + 0.3 + k * 0.15, b: T.parte - 0.2, p: [0.8 + k * 1.15, 1.2, 1.8], valor: `EQUIPE ${k + 1}`}));
  r.push({a: T.v400 + 0.4, b: T.v350, p: [-2.1, 1.6, -0.8], valor: '400 VANS', sub: 'PRA TODAS AS EQUIPES', cor: C.ouro});
  r.push({a: T.v119 + 1.0, b: T.entao - 0.2, p: soma(ASSIST_POS, [0, altTorre(V_ASS, 2) + 0.3, 0]), valor: 'R$ 11,9 MI', sub: 'ASSISTÊNCIA SOCIAL', cor: tema.acento});
  r.push({a: T.adm + 0.8, b: T.entao - 0.2, p: soma(ASSIST_POS, [-0.9, altTorre(V_ADM, 2) * 0.6, 0]), valor: 'R$ 7 MI', sub: 'ADMINISTRAÇÃO', cor: mistura(C.ouro, tema.texto, 0.45)});
  r.push({a: T.com + 1.0, b: T.entao - 0.2, p: soma(COM_POS, [0, altTorre(V_COM, 2) + 0.3, 0]), valor: 'R$ 3,1 MI', sub: 'COMUNICAÇÃO', cor: C.ouro});
  return r;
};
const soMapa = (t: number) => t < T.prim - 0.3;
const noMapa = (t: number) => t < T.prim;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.prim) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const escTxt = t >= T.din && t < T.entao ? '1 PILHA = R$ 1 MI · LIQUIDADO JAN–SET/2026' : '';
  const escK = escTxt ? vis(t, T.din, T.entao) : 0;
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
      <OffthreadVideo src={staticFile(`${P}/mapas/ruailheus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};


const SOQUINHOS = [T.fila, T.festejar, T.teto, T.v119, T.v31, T.trofeu];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  [T.minist + 0.4, T.tres + 0.1].forEach((x) => s.push({t: x, f: 'pop', v: 0.13}));
  [T.fila, T.trofeu].forEach((x) => s.push({t: x + 0.05, f: 'baque', v: 0.16}));
  s.push({t: T.festejar + 0.1, f: 'subida', v: 0.14});
  [T.v119, T.v31].forEach((x) => s.push({t: x + 0.15, f: 'subida', v: 0.13}));
  s.push({t: T.teto + 0.05, f: 'impacto', v: 0.12});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.6, 4.0, 8.0, 12.0, T.prim + 0.6, T.minist + 1.5, T.chave + 0.6, T.seg + 0.6, T.v400 + 1.0, T.v350 + 1.0, T.resto + 0.8, T.tres + 1.0, T.fila + 0.4, T.parte + 0.6, T.existe + 1.0, T.cidade3 + 1.0, T.festejar + 1.0, T.boa + 0.6, T.movel + 0.6, T.imovel + 0.6, T.teto + 0.4, T.din + 0.6, T.v119 + 1.2, T.menos + 1.0, T.adm + 1.2, T.com + 0.8, T.v31 + 1.0, T.entao + 0.8, T.trofeu + 0.5, T.ans + 1.0, T.quero + 0.5, T.segue + 0.6, FIM - 0.4].filter((x) => x < FIM);
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
export const RuaIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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


export const TITULO_CAPA = ['Comemorou', 'estar no', 'top 100', 'da rua.'];
export const CapaRuaIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 450}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoCidade tema={tema} cidade="ILHÉUS · CONSULTÓRIO NA RUA" t={10} />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 300}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 110 : 128, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
