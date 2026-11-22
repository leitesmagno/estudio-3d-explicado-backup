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
import {ArvoreRedonda, CalendarioGrande, Campo, Estadio, MarcoAno, Onibus, Van} from '../../pecas';
import {MesaMaquete, Prefeitura, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {BaseGaveta, PastaProcesso} from '../orcamentoparatinga/pecas';
import {CabecalhoCidade} from '../comum/CabecalhoCidade';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {PALAVRAS} from './palavras';

// 155. Barcelona de Ilhéus: o clube que saiu de Ilhéus (13/11/2026: Feira Forte Club SAF, sede em Feira de Santana).
// História, o estádio Mário Pessoa sem laudo, a promessa de janeiro, o caminho até Feira, e o silêncio do prefeito.
// Mapa do Kit Mapas em dois trechos (gancho e "agosto → registro"). Sem nome de gestor.

export const FPS = 30;
const AUDIO_SEG = 99.81;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '155. barcelona de ilhéus';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  nasceu: quando('O clube nasceu'),
  saf: quando('uma SAF'),
  t21: quando('Em 2021'),
  t24: quando('Em 2024'),
  t25: quando('Em 2025 jogou'),
  novo: quando('Um clube novo'),
  problema: quando('So que tinha'),
  estadio: quando('o Estadio Mario Pessoa'),
  ano2: quando('um ano e dois meses'),
  maio: quando('So em maio'),
  jan: quando('Em janeiro de 2026'),
  reparos: quando('anunciou reparos'),
  secretario: quando('E o secretario'),
  compromisso: quando('conforme compromisso'),
  naoDeu: quando('Nao deu'),
  laudos: quando('sem os laudos'),
  longe: quando('longe de casa'),
  cajueiro: quando('Uma das casas'),
  setimo: quando('Terminou em setimo'),
  agosto: quando('Em agosto'),
  ressalva: quando('Ainda nao ha'),
  dono: quando('nem de mudanca de dono'),
  lista: quando('O clube esta na lista'),
  prefeito: quando('E o prefeito'),
  procurei: quando('Procurei'),
  nenhuma: quando('nao achei nenhuma'),
  ultima: quando('A ultima noticia'),
  gramado: quando('manutencao do gramado'),
  vans: quando('O mesmo prefeito'),
  silencio: quando('silencio'),
  vive: quando('Clube de futebol vive'),
  onca: quando('a onca foi'),
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


// ---------- Lugares ----------
const LINHA: {ano: string; t: number; x: number; txt: string; sub: string}[] = [
  {ano: '2019', t: T.nasceu, x: -3.3, txt: 'NASCEU', sub: 'JÁ COMO SAF'},
  {ano: '2021', t: T.t21, x: -1.1, txt: 'CAMPEÃO', sub: '2ª DIVISÃO BAIANA'},
  {ano: '2024', t: T.t24, x: 1.1, txt: 'SENSAÇÃO', sub: 'DO BAIANÃO'},
  {ano: '2025', t: T.t25, x: 3.3, txt: 'SÉRIE D', sub: 'DO BRASILEIRO'},
];
const C_LINHA = (t: number) => vis(t, T.nasceu - 0.2, T.problema - 0.1);
const EST_POS: V3 = [0.6, 0, -0.6];
const EST_ESC = 0.3;
const C_EST = (t: number) => vis(t, T.problema - 0.1, T.agosto) ;
const PREF_POS: V3 = [-3.6, 0, 1.4];
const C_PREF = (t: number) => vis(t, T.jan - 0.1, T.naoDeu + 0.3);
const ONI0: V3 = [1.2, 0, 2.6];
const ONI1: V3 = [6.0, 0, 2.6];
const C_DEPOIS = (t: number) => vis(t, T.ressalva - 0.1, FIM + 2);

const ARVORES: V3[] = [[-6.6, 0, 4.4], [6.4, 0, 4.6], [-7.4, 0, -2.6], [7.2, 0, -2.0]];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const cl = C_LINHA(t);
  const ce = Math.min(1, C_EST(t));
  const cp = C_PREF(t);
  const cd = C_DEPOIS(t);
  const sem = rampa(t, T.laudos + 0.3, T.laudos + 0.7);
  const kO = rampa(t, T.cajueiro, T.cajueiro + 2.2);
  const oni: V3 = [ONI0[0] + (ONI1[0] - ONI0[0]) * kO, 0, ONI0[2]];
  const neutro = mistura(C.ouro, tema.texto, 0.35);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />)}
      {/* 1. linha do tempo */}
      {LINHA.map((m, i) => (
        <MarcoAno key={i} tema={tema} pos={[m.x, 0, 0.6]} ano={m.ano} k={cl * rampa(t, m.t - 0.1, m.t + 0.4)} aceso={janela(t, m.t, i + 1 < LINHA.length ? LINHA[i + 1].t : T.problema)} />
      ))}
      {/* 2–4. o estádio */}
      {ce > 0.02 ? (
        <group position={[EST_POS[0], EST_POS[1] - 1.5 * (1 - ce), EST_POS[2]]} scale={EST_ESC}>
          <Estadio tema={tema} obra={1} corte={0} luz={0.4 * (1 - sem)} />
          <Campo tema={tema} obra={1} />
        </group>
      ) : null}
      <PastaProcesso tema={tema} pos={[0.6, 0, 3.0]} escala={0.9} sobe={ce * rampa(t, T.maio - 0.2, T.maio + 0.3) * (1 - rampa(t, T.jan - 0.3, T.jan))} titulo="ESTÁDIO MÁRIO PESSOA" valor="MAIO/2025" carimbo={rampa(t, T.maio + 1.0, T.maio + 1.4)} textoCarimbo="LIBERADO PELA CBF" corCarimbo={C.ouro} aceso={janela(t, T.maio, T.jan)} />
      <Prefeitura tema={tema} pos={PREF_POS} sobe={cp} aceso={janela(t, T.compromisso, T.naoDeu)} escala={0.7} rotY={0.4} />
      <PastaProcesso tema={tema} pos={[-1.2, 0, 3.0]} escala={0.9} sobe={cp * rampa(t, T.reparos - 0.1, T.reparos + 0.4)} titulo="REPAROS PRO BAIANÃO" valor="JANEIRO/2026" carimbo={0} textoCarimbo="" corCarimbo={C.ouro} aceso={janela(t, T.reparos, T.naoDeu)} />
      <PastaProcesso tema={tema} pos={[0.6, 0, 3.0]} escala={0.9} sobe={ce * rampa(t, T.naoDeu - 0.1, T.naoDeu + 0.4)} titulo="LAUDOS PRO JOGO PROFISSIONAL" valor="BAIANÃO 2026" carimbo={sem} textoCarimbo="SEM LAUDO" corCarimbo={C.alerta} aceso={janela(t, T.laudos, T.agosto)} />
      <Onibus tema={tema} pos={oni} rotY={Math.PI / 2} escala={0.55 * ce * rampa(t, T.longe - 0.2, T.longe + 0.3)} farol={1} />
      <BaseGaveta tema={tema} pos={[4.6, 0, 3.6]} sobe={ce * rampa(t, T.cajueiro, T.cajueiro + 0.4)} larg={3.0} texto="ARENA CAJUEIRO · FEIRA" aceso={janela(t, T.cajueiro, T.agosto)} />
      {/* 5–7. depois do registro */}
      <PastaProcesso tema={tema} pos={[-2.2, 0, 1.0]} escala={0.9} sobe={cd * rampa(t, T.ressalva - 0.1, T.ressalva + 0.4) * (1 - rampa(t, T.prefeito - 0.3, T.prefeito))} titulo="JOGAR COM O NOME NOVO" valor="E MUDANÇA DE DONO" carimbo={rampa(t, T.dono + 0.5, T.dono + 0.9)} textoCarimbo="SEM CONFIRMAÇÃO" corCarimbo={neutro} aceso={janela(t, T.ressalva, T.lista)} />
      <CalendarioGrande tema={tema} pos={[1.6, 0, 0.8]} rotY={-0.2} texto="09/01" sub="BAIANÃO 2027" folha={rampa(t, T.lista, T.lista + 0.5)} escala={0.8 * cd * rampa(t, T.lista - 0.2, T.lista + 0.3) * (1 - rampa(t, T.prefeito - 0.3, T.prefeito))} destaque={janela(t, T.lista, T.prefeito)} />
      <Prefeitura tema={tema} pos={[-1.6, 0, -1.6]} sobe={cd * rampa(t, T.prefeito - 0.2, T.prefeito + 0.4)} aceso={0} escala={0.8} />
      <PastaProcesso tema={tema} pos={[-1.6, 0, 1.6]} escala={0.9} sobe={cd * rampa(t, T.procurei, T.procurei + 0.4) * (1 - rampa(t, T.vive - 0.3, T.vive))} titulo="FALA SOBRE A SAÍDA DO CLUBE" valor="ATÉ 13/11" carimbo={rampa(t, T.nenhuma + 0.6, T.nenhuma + 1.0)} textoCarimbo="NENHUMA" corCarimbo={C.alerta} aceso={janela(t, T.procurei, T.ultima)} />
      <CalendarioGrande tema={tema} pos={[1.4, 0, 1.0]} rotY={-0.2} texto="04/11" sub="GRAMADO" folha={rampa(t, T.ultima, T.ultima + 0.5)} escala={0.75 * cd * rampa(t, T.ultima - 0.2, T.ultima + 0.3) * (1 - rampa(t, T.vans - 0.3, T.vans))} destaque={janela(t, T.ultima, T.vans)} />
      {[0, 1, 2].map((k) => <Van key={k} tema={tema} pos={[0.6 + k * 1.1, 0, 0.8]} rotY={0} escala={0.5 * cd * rampa(t, T.vans + 0.6 + k * 0.15, T.vans + 1.0 + k * 0.15) * (1 - rampa(t, T.vive - 0.3, T.vive))} />)}
      {/* fecho: o estádio vazio */}
      {t > T.vive - 0.4 ? (
        <group position={[0, -1.5 * (1 - rampa(t, T.vive - 0.4, T.vive + 0.2)), -0.4]} scale={0.3}>
          <Estadio tema={tema} obra={1} corte={0} luz={0} />
          <Campo tema={tema} obra={1} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1, 0], 12, 10, [0, 1.6, 1])]]},
  {ini: T.nasceu - 0.2, arco: 0.03, chaves: [
    [T.nasceu - 0.2, E([-3.3, 1.0, 0.6], 3.6, 3.4, [-0.08, 0.6, 1])],
    ...LINHA.slice(1).map((m): [number, Cam] => [m.t - 0.1, E([m.x, 1.0, 0.6], 3.6, 3.4, [-0.06 + m.x * 0.01, 0.6, 1])]),
    [T.novo, E([0, 1.0, 0.6], 8.6, 5.0, [0.02, 0.8, 1])],
    [T.problema - 0.3, E([0, 1.0, 0.6], 8.4, 4.8, [0.05, 0.8, 1])],
  ]},
  {ini: T.problema - 0.1, arco: 0.03, chaves: [
    [T.problema - 0.1, E([0.6, 1.0, -0.4], 9.4, 7.0, [-0.04, 1.1, 1])],
    [T.maio, E([0.6, 0.8, 2.2], 5.2, 4.4, [-0.02, 0.8, 1])],
    [T.jan - 0.1, E([-2.2, 0.9, 2.0], 5.8, 4.8, [-0.06, 0.8, 1])],
    [T.compromisso, E([-3.0, 1.0, 1.6], 4.4, 4.0, [-0.08, 0.8, 1])],
    [T.naoDeu - 0.1, E([0.6, 0.8, 2.4], 4.8, 4.0, [0.0, 0.7, 1])],
    [T.longe, E([2.6, 0.8, 2.4], 7.6, 5.2, [0.04, 0.8, 1])],
    [T.cajueiro + 0.4, E([4.0, 0.8, 3.0], 5.0, 4.0, [0.08, 0.7, 1])],
    [T.agosto - 0.2, E([4.0, 0.8, 3.0], 4.8, 3.8, [0.1, 0.7, 1])],
  ]},
  {ini: T.ressalva - 0.1, arco: 0.03, chaves: [
    [T.ressalva - 0.1, E([-0.4, 0.9, 1.0], 6.4, 4.6, [-0.04, 0.8, 1])],
    [T.lista, E([0.6, 0.9, 0.9], 5.6, 4.4, [0.0, 0.8, 1])],
    [T.prefeito - 0.1, E([-0.6, 1.0, 0.2], 6.4, 5.4, [-0.04, 0.9, 1])],
    [T.nenhuma, E([-1.6, 0.8, 1.6], 3.8, 3.4, [-0.04, 0.7, 1])],
    [T.ultima, E([0.0, 0.9, 1.2], 5.6, 4.4, [0.0, 0.8, 1])],
    [T.vans + 0.4, E([1.6, 0.8, 0.8], 4.8, 3.8, [0.04, 0.7, 1])],
    [T.vive - 0.3, E([1.6, 0.8, 0.8], 4.6, 3.6, [0.06, 0.7, 1])],
  ]},
  {ini: T.vive - 0.1, arco: 0.04, chaves: [
    [T.vive - 0.1, E([0, 1.0, -0.4], 8.4, 6.4, [0, 1.0, 1])],
    [T.segue, E([0, 1.0, -0.4], 9.0, 7.0, [0.1, 1.1, 1])],
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



// ---------- Folhas (documentos e matérias) ----------
const F0: Omit<Folha, 'b'>[] = [
  {id: 1, a: T.saf, doc: 'Comprovante de CNPJ · Receita Federal', sub: 'CONFORME BAHIA NOTÍCIAS · 13/11/2026', origem: 'RECEITA FEDERAL', linhas: [['CNPJ', '34.904.069/0001-61', false], ['Data de abertura', '17/09/2019', true]]},
  {id: 2, a: T.ano2, doc: 'Bahia Notícias · 14/05/2025', sub: 'CBF LIBERA O ESTÁDIO MÁRIO PESSOA', origem: 'BAHIA NOTÍCIAS', linhas: [['Tempo sem jogar em casa', '1 ANO E 2 MESES', true]]},
  {id: 3, a: T.secretario, doc: 'Nota da Prefeitura · 09/01/2026', sub: 'REPAROS NO ESTÁDIO PARA O BAIANÃO 2026', origem: 'PIMENTA BLOG', linhas: [['Secretário de Esporte', '“CONFORME COMPROMISSO DO PREFEITO”', true]]},
  {id: 4, a: T.setimo, doc: 'Futebol Baiano · 13/11/2026', sub: 'BAIANÃO 2026', origem: 'FUTEBOLBAIANO.COM.BR', linhas: [['Mando de jogo', 'ARENA CAJUEIRO (FEIRA)', false], ['Colocação final', '7º · FICOU NA ELITE', true]]},
  {id: 5, a: T.lista + 0.4, doc: 'Comprovante de CNPJ · 13/11/2026', sub: 'MESMO CNPJ, DADOS NOVOS', origem: 'RECEITA FEDERAL', linhas: [['Razão social', 'FEIRA FORTE CLUB S.A.F.', true], ['Sede', 'FEIRA DE SANTANA', true]]},
  {id: 6, a: T.ultima + 0.3, doc: 'Prefeitura de Ilhéus · 04/11/2026', sub: 'ESTÁDIO MÁRIO PESSOA', origem: 'JORNAL FOCO', linhas: [['Manutenção do gramado', 'CAMPO FECHADO DESDE 10/11', true]]},
];
const FOLHAS: Folha[] = F0.sort((x, y) => x.a - y.a).map((f, i, arr) => {
  const prox = i + 1 < arr.length ? arr[i + 1].a : 1e9;
  return {...f, b: Math.max(f.a + 2.6, Math.min(f.a + 3.4, prox - 0.05))};
});
const TOPO_FOLHA = 470;
const folhaEm = (t: number) => FOLHAS.filter((f) => t >= f.a - 0.05 && t < f.b + 0.05).pop();

type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.novo, b: T.problema, texto: 'O NOME DE ILHÉUS PRA BAHIA INTEIRA'},
  {a: T.problema, b: T.ano2, texto: 'O PROBLEMA: O ESTÁDIO MÁRIO PESSOA', destaque: true},
  {a: T.jan, b: T.secretario, texto: 'JANEIRO/2026: REPAROS PRO BAIANÃO'},
  {a: T.compromisso, b: T.naoDeu, texto: '“CONFORME COMPROMISSO DO PREFEITO”', destaque: true},
  {a: T.naoDeu, b: T.laudos, texto: 'NÃO DEU', destaque: true},
  {a: T.longe, b: T.cajueiro, texto: 'BAIANÃO 2026 LONGE DE CASA'},
  {a: T.ressalva, b: T.lista, texto: 'AINDA SEM CONFIRMAÇÃO DO NOME NOVO EM CAMPO'},
  {a: T.prefeito, b: T.procurei, texto: 'E O PREFEITO?', destaque: true},
  {a: T.vans, b: T.silencio, texto: 'PRA ANUNCIAR 3 VANS: ANSIEDADE'},
  {a: T.silencio, b: T.vive, texto: 'PRO TIME INDO EMBORA: SILÊNCIO', destaque: true},
  {a: T.onca, b: T.olho, texto: 'SEM ESTÁDIO, A ONÇA FOI PROCURAR OUTRA CASA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.nasceu, b: T.problema, texto: 'FONTE: RECEITA FEDERAL (CNPJ), BAHIA NOTÍCIAS, CORREIO'},
  {a: T.problema, b: T.agosto, texto: 'FONTE: BAHIA NOTÍCIAS, PIMENTA, FUTEBOL BAIANO'},
  {a: T.ressalva, b: T.vive, texto: 'FONTE: FUTEBOL BAIANO, BAHIA NOTÍCIAS, JORNAL FOCO · 13/11/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));



type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const r: Rot[] = [];
  LINHA.forEach((m, i) => r.push({a: m.t + 0.3, b: T.problema - 0.2, p: [m.x, 1.9, 0.6], valor: m.txt, sub: m.sub, cor: i === 2 ? tema.acento : C.ouro}));
  r.push({a: T.setimo + 0.4, b: T.agosto - 0.2, p: [4.6, 1.4, 3.4], valor: '7º LUGAR', sub: 'FICOU NA ELITE', cor: C.ouro});
  return r;
};
const soMapa = (t: number) => t < T.nasceu - 0.3 || (t > T.agosto + 0.3 && t < T.ressalva - 0.3);
const noMapa = (t: number) => t < T.nasceu || (t >= T.agosto && t < T.ressalva);
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.nasceu) + 6};
const MAPA_B = {de: q(T.agosto) - 6, ate: q(T.ressalva) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const escTxt = '';
  const escK = 0;
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
  const op = Math.min(de > 0 ? interpolate(f, [0, 6], [0, 1], clamp) : 1, interpolate(f, [dur - 6, dur], [1, 0], clamp));
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/barcelonailheus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};



const SOQUINHOS = [T.naoDeu, T.laudos + 0.5, T.nenhuma + 0.8, T.silencio, T.onca];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  [T.agosto - 0.1].forEach((x) => s.push({t: x, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  LINHA.forEach((m) => s.push({t: m.t + 0.1, f: 'pop', v: 0.13}));
  [T.maio + 1.0].forEach((x) => s.push({t: x, f: 'subida', v: 0.13}));
  [T.laudos + 0.3, T.nenhuma + 0.6].forEach((x) => s.push({t: x, f: 'impacto', v: 0.13}));
  [T.naoDeu, T.silencio].forEach((x) => s.push({t: x + 0.05, f: 'baque', v: 0.16}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.6, 3.0, 7.5, 10.0, ...LINHA.map((m) => m.t + 0.8), T.novo + 0.8, T.problema + 0.8, T.ano2 + 1.0, T.maio + 1.6, T.jan + 0.8, T.reparos + 1.0, T.compromisso + 0.8, T.naoDeu + 0.4, T.laudos + 1.0, T.longe + 0.6, T.cajueiro + 1.5, T.setimo + 0.8, T.agosto + 1.0, T.agosto + 4.0, T.agosto + 7.0, T.agosto + 11.0, T.ressalva + 0.8, T.dono + 1.2, T.lista + 1.0, T.prefeito + 0.5, T.nenhuma + 1.2, T.ultima + 1.0, T.vans + 1.4, T.silencio + 0.3, T.vive + 0.8, T.onca + 0.8, T.segue + 0.6, FIM - 0.4].filter((x) => x < FIM);
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
export const BarcelonaIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
    <>
      <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
        <TrechoMapa {...MAPA} />
      </Sequence>
      <Sequence from={MAPA_B.de} durationInFrames={MAPA_B.ate - MAPA_B.de} layout="none">
        <TrechoMapa {...MAPA_B} />
      </Sequence>
    </>
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



export const TITULO_CAPA = ['O Barcelona', 'de Ilhéus', 'foi embora', 'pra Feira.'];
export const CapaBarcelonaIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 450}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoCidade tema={tema} cidade="ILHÉUS · BARCELONA" t={10} />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 300}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 104 : 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
