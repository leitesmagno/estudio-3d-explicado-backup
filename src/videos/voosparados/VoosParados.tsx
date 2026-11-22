import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, Bandeira, Cancela, Exclama, GloboWireframe, Jatinho, MalaIntimacao, MapaBrasil, Relogio, XMarca} from '../../pecas';
import {MesaMaquete} from '../orcamentoitabuna/pecas';
import {BaseGaveta} from '../orcamentoparatinga/pecas';
import {SeloArroba} from '../comum/SeloArroba';
import {FolhaPdf, type Folha} from './FolhaPdf';
import {PALAVRAS} from './palavras';

// 156. Parada nacional de voos nos EUA (sexta, 13/11/2026). Notícia do dia, tom informativo.
// Fontes em projetos/156. voos parados nos eua/audio/fontes.md. Sem renderizar antes de conferir os quadros.

export const FPS = 30;
const AUDIO_SEG = 89.53;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '156. voos parados nos eua';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  mandaram: quando('mandaram parar'),
  terceira: quando('terceira vez'),
  v2001: quando('11 de Setembro'),
  v2023: quando('janeiro de 2023'),
  calma: quando('Calma que eu'),
  motivo: quando('O motivo segundo'),
  falha: quando('uma falha de telecomunicacao'),
  c22: quando('os 22 centros'),
  sem: quando('Sem comunicacao garantida'),
  ninguem: quando('ninguem decola'),
  hora: quando('Na hora da ordem'),
  v4mil: quando('mais de 4 mil'),
  pousar: quando('Esses puderam pousar'),
  localiz: quando('todos os voos foram'),
  ataque: quando('Foi ataque'),
  secret: quando('O secretario de Seguranca'),
  investig: quando('a investigacao esta'),
  ia: quando('um sistema novo'),
  empresa: quando('A empresa do sistema'),
  causa: quando('A causa ainda'),
  estrago: quando('O estrago'),
  v10mil: quando('mais de 10 mil'),
  v5mil: quando('perto de 5 mil'),
  europa: quando('A Europa segurou'),
  canada: quando('o Canada cancelou'),
  aqui: quando('E aqui'),
  gru: quando('Guarulhos e o Galeao'),
  passag: quando('mandaram o passageiro'),
  ateComeco: quando('Ate o comeco'),
  agora: quando('E agora'),
  dez: quando('dez e quinze'),
  reaberto: quando('o espaco aereo reaberto'),
  quatro: quando('umas quatro horas'),
  normal: quando('voltar ao normal'),
  tripul: quando('Tem aviao e tripulacao'),
  sabado: quando('no sabado ainda'),
  seuvoo: quando('Se o seu voo'),
  anac: quando('pela regra da Anac'),
  outro: quando('outro voo ou'),
  assist: quando('e dar assistencia'),
  confira: quando('Confira o seu voo'),
  segue: quando('E me segue'),
};

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function vis(t: number, a: number, b: number) {
  return entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
}
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const suave = (k: number) => k * k * (3 - 2 * k);

// ---------- Lugares ----------
const PISTA_Z = 1.2;
const PARADOS: V3[] = [[-3.2, 0.32, -0.4], [-1.2, 0.32, -0.4], [0.8, 0.32, -0.4], [2.8, 0.32, -0.4]];
const CONTROLE: V3 = [-4.4, 0, -2.4];
const RELOGIO: V3 = [4.2, 0, -2.2];
const GLOBO: V3 = [4.6, 1.6, -0.8];
const BRASIL: V3 = [-2.6, 0.05, 3.2];
const DEC = 4.6; // x do começo da pista (onde fica a cancela)

// aviões que estavam no ar e pousam
const voando = (t: number, k: number): {p: V3; pique: number} => {
  const a = suave(rampa(t, T.pousar - 0.4 + k * 0.5, T.pousar + 2.2 + k * 0.5));
  const x0 = -8 + k * 1.2, x1 = -1.4 + k * 2.2;
  const y = 3.4 - k * 0.4;
  return {p: [x0 + (x1 - x0) * a, 0.32 + (y - 0.32) * (1 - a), PISTA_Z + (k - 1) * 0.15], pique: 0.18 * (1 - a) * (a > 0.01 ? 1 : 0)};
};
// avião que decola na reabertura
const decolando = (t: number): {p: V3; pique: number} => {
  const a = rampa(t, T.reaberto + 0.2, T.reaberto + 3.2);
  const x = -3.2 + a * 10;
  const y = 0.32 + Math.max(0, a - 0.35) * 5.5;
  return {p: [x, y, PISTA_Z], pique: -0.22 * rampa(t, T.reaberto + 1.2, T.reaberto + 1.8)};
};

const C_AERO = (t: number) => vis(t, 0.15, T.aqui - 0.1) + vis(t, T.agora - 0.1, FIM + 2);
const C_BR = (t: number) => vis(t, T.aqui - 0.1, T.agora - 0.1);
const C_ANAC = (t: number) => vis(t, T.seuvoo - 0.1, FIM + 2);

const ARVORES: V3[] = [[-6.6, 0, 4.4], [6.4, 0, 4.6], [-7.0, 0, -3.2], [7.0, 0, -3.0]];

const PistaPouso: React.FC<{tema: Tema; k: number}> = ({tema, k}) =>
  k < 0.02 ? null : (
    <group position={[0, 0, PISTA_Z]} scale={[1, Math.min(1, k), 1]}>
      <Caixa args={[13, 0.04, 1.5]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.11, 0]} />
      {Array.from({length: 12}).map((_, i) => (
        <Caixa key={i} args={[0.5, 0.02, 0.08]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[-5.8 + i * 1.05, 0.135, 0]} />
      ))}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const ca = Math.min(1, C_AERO(t));
  const cb = C_BR(t);
  const cn = C_ANAC(t);
  const parada = rampa(t, T.mandaram, T.mandaram + 0.8) * (1 - rampa(t, T.reaberto, T.reaberto + 0.8));
  const de = decolando(t);
  const cancelados = vis(t, T.v5mil + 0.2, T.aqui - 0.1);
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {ARVORES.map((p, i) => <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.75} />)}
      <PistaPouso tema={tema} k={ca} />
      <Cancela tema={tema} pos={[DEC, 0, PISTA_Z - 1.0]} escala={0.9 * ca} desce={parada} lado={1} />
      {/* aviões parados no pátio */}
      {PARADOS.map((p, i) => (i === 0 && t > T.reaberto ? null : <Jatinho key={i} tema={tema} pos={p} rumo={0} escala={0.55 * ca} />))}
      {t > T.reaberto ? <Jatinho tema={tema} pos={de.p} rumo={0} pique={de.pique} escala={0.55 * ca} /> : null}
      {[1, 2].map((i) => <XMarca key={'x' + i} tema={tema} pos={soma(PARADOS[i], [0, 1.0, 0])} escala={0.45 * cancelados} />)}
      {/* aviões que estavam no ar */}
      {[0, 1, 2].map((k) => {
        const v = voando(t, k);
        const e = vis(t, T.hora - 0.1, T.aqui - 0.1) + vis(t, T.agora - 0.1, FIM + 2);
        return <Jatinho key={'v' + k} tema={tema} pos={v.p} rumo={0} pique={v.pique} escala={0.5 * Math.min(1, e)} />;
      })}
      {/* centro de controle */}
      <BaseGaveta tema={tema} pos={CONTROLE} sobe={vis(t, T.motivo - 0.2, T.aqui - 0.1)} larg={3.0} texto="CONTROLE DE VOO" aceso={janela(t, T.motivo, T.hora)} />
      <Exclama tema={tema} pos={soma(CONTROLE, [0, 1.3, 0])} escala={0.6 * vis(t, T.falha, T.hora) * (1 - 0.15 * Math.abs(Math.sin(t * 3)))} />
      {/* ataque? / IA */}
      <Exclama tema={tema} pos={[0, 1.8, -1.6]} escala={0.5 * vis(t, T.ataque, T.secret)} />
      {/* Europa e Canadá */}
      <GloboWireframe cor={tema.objetoEscuro} pos={GLOBO} escala={0.9 * vis(t, T.europa - 0.2, T.aqui - 0.1)} t={t} />
      {/* relógio da parada */}
      <Relogio tema={tema} pos={RELOGIO} rotY={-0.4} escala={0.9 * vis(t, T.dez - 0.2, T.seuvoo - 0.1)} giro={rampa(t, T.dez, T.quatro + 1)} cor={tema.acento} />
      {/* Brasil */}
      <MapaBrasil tema={tema} pos={BRASIL} tam={3.2} k={cb} acende={rampa(t, T.aqui, T.aqui + 1.5)} />
      <Bandeira tema={tema} pos={soma(BRASIL, [0.9, 0, -0.6])} escala={0.7 * cb * rampa(t, T.gru, T.gru + 0.4)} texto="GRU" t={t} destaque />
      <Bandeira tema={tema} pos={soma(BRASIL, [1.5, 0, 0.3])} escala={0.7 * cb * rampa(t, T.gru + 0.4, T.gru + 0.8)} texto="GALEÃO" t={t} destaque />
      {/* passageiro e mala (ANAC) */}
      <Boneco tema={tema} pos={[-1.6, 0, 3.0]} rotY={0.3} escala={0.6 * cn} cor={mistura(tema.pessoa, tema.ceuLuz, 0.25)} />
      <MalaIntimacao tema={tema} pos={[-1.0, 0, 3.1]} rotY={0.3} escala={0.5 * cn} />
      <BaseGaveta tema={tema} pos={[-1.3, 0, 4.1]} sobe={cn * rampa(t, T.anac, T.anac + 0.4)} larg={2.6} texto="REGRA DA ANAC" aceso={janela(t, T.anac, T.confira)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [
    [0, E([0, 0.8, 0.6], 8.6, 6.4, [0.15, 1.2, 1])],
    [T.terceira, E([0.6, 0.8, 0.6], 9.6, 7.0, [0.05, 1.1, 1])],
    [T.motivo - 0.3, E([0.6, 0.8, 0.6], 9.2, 6.8, [-0.02, 1.1, 1])],
  ]},
  {ini: T.motivo - 0.1, arco: 0.03, chaves: [
    [T.motivo - 0.1, E([-3.6, 1.0, -1.8], 5.6, 4.6, [-0.08, 0.9, 1])],
    [T.hora - 0.3, E([-3.6, 1.0, -1.8], 5.2, 4.3, [-0.02, 0.9, 1])],
  ]},
  {ini: T.hora - 0.1, arco: 0.03, chaves: [
    [T.hora - 0.1, E([-3.0, 1.6, 0.8], 9.0, 6.4, [-0.1, 0.8, 1])],
    [T.localiz, E([-0.6, 0.8, 0.6], 8.6, 6.0, [0.02, 0.9, 1])],
    [T.ataque - 0.3, E([-0.6, 0.8, 0.6], 8.4, 5.8, [0.05, 0.9, 1])],
  ]},
  {ini: T.ataque - 0.1, arco: 0.03, chaves: [
    [T.ataque - 0.1, E([0, 1.2, -0.8], 7.0, 5.4, [0.0, 1.0, 1])],
    [T.estrago - 0.3, E([0, 1.2, -0.8], 6.6, 5.0, [0.06, 1.0, 1])],
  ]},
  {ini: T.estrago - 0.1, arco: 0.03, chaves: [
    [T.estrago - 0.1, E([0, 0.8, 0], 8.8, 6.4, [-0.04, 1.0, 1])],
    [T.europa, E([3.4, 1.4, -0.6], 5.4, 4.6, [0.1, 0.8, 1])],
    [T.aqui - 0.3, E([3.4, 1.4, -0.6], 5.2, 4.4, [0.14, 0.8, 1])],
  ]},
  {ini: T.aqui - 0.1, arco: 0.03, chaves: [
    [T.aqui - 0.1, E([-2.2, 0.6, 3.0], 5.8, 4.6, [-0.05, 1.3, 1])],
    [T.agora - 0.3, E([-2.0, 0.6, 3.0], 5.4, 4.3, [0.03, 1.3, 1])],
  ]},
  {ini: T.agora - 0.1, arco: 0.03, chaves: [
    [T.agora - 0.1, E([2.4, 1.0, -0.8], 7.6, 5.6, [0.05, 1.0, 1])],
    [T.reaberto, E([1.0, 1.0, 0.6], 10.0, 6.8, [0.0, 0.9, 1])],
    [T.normal, E([1.6, 1.0, 0.2], 9.0, 6.4, [0.06, 1.0, 1])],
    [T.seuvoo - 0.3, E([1.6, 1.0, 0.2], 8.8, 6.2, [0.08, 1.0, 1])],
  ]},
  {ini: T.seuvoo - 0.1, arco: 0.04, chaves: [
    [T.seuvoo - 0.1, E([-1.3, 0.8, 3.3], 4.8, 4.0, [-0.04, 0.9, 1])],
    [T.confira, E([-1.0, 0.8, 2.6], 6.4, 5.0, [0.02, 1.0, 1])],
    [T.segue, E([0, 1.0, 1.0], 9.0, 7.0, [0.1, 1.1, 1])],
    [FIM, E([0, 1.0, 1.0], 12.0, 9.4, [0.22, 1.4, 1])],
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

// ---------- Folhas (o que cada fonte disse) ----------
const F0: Omit<Folha, 'b'>[] = [
  {id: 1, a: T.falha + 0.3, doc: 'FAA · comunicado oficial', sub: '13/11/2026 · AGÊNCIA DE AVIAÇÃO DOS EUA', origem: 'PERFIL DA FAA NO X · VIA NBC NEWS', linhas: [['Causa informada', 'FALHA TEMPORÁRIA DE TELECOMUNICAÇÃO', true], ['Atingiu', 'TODOS OS CENTROS DE CONTROLE DE ROTA', false]]},
  {id: 2, a: T.v4mil + 0.3, doc: 'Flightradar24', sub: 'NA HORA DA ORDEM DE PARADA', origem: 'CITADO PELA AL JAZEERA', linhas: [['Aviões no ar indo para os EUA', '4.042', true]]},
  {id: 3, a: T.v10mil + 0.2, doc: 'FlightAware', sub: '13/11/2026 · 19H30 EM NOVA YORK', origem: 'CITADO PELA NBC NEWS E PELA ABC NEWS', linhas: [['Voos atrasados', '10.079', true], ['Voos cancelados (fim da noite)', 'PERTO DE 5 MIL', true]]},
  {id: 4, a: T.gru + 0.3, doc: 'GRU Airport · nota', sub: '13/11/2026 · NOITE', origem: 'FOLHAPRESS (O TEMPO) E TMC', linhas: [['Voos de e para os EUA', 'EM SOLO ATÉ NOVO AVISO', true], ['Orientação ao passageiro', 'FALAR COM A COMPANHIA', false]]},
  {id: 5, a: T.dez + 0.2, doc: 'Secretário de Transportes dos EUA', sub: '13/11/2026', origem: 'CITADO PELA NBC NEWS', linhas: [['Espaço aéreo reaberto', '20H15 EM NOVA YORK', false], ['No horário de Brasília', '22H15', true]]},
];
const FOLHAS: Folha[] = F0.sort((x, y) => x.a - y.a).map((f, i, arr) => {
  const prox = i + 1 < arr.length ? arr[i + 1].a : 1e9;
  return {...f, b: Math.max(f.a + 2.6, Math.min(f.a + 3.4, prox - 0.05))};
});
const TOPO_FOLHA = 470;
const folhaEm = (t: number) => FOLHAS.filter((f) => t >= f.a - 0.05 && t < f.b + 0.05).pop();

type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.mandaram, b: T.terceira, texto: 'TODOS OS AVIÕES NO CHÃO', destaque: true},
  {a: T.terceira, b: T.v2001, texto: '3ª VEZ NA HISTÓRIA'},
  {a: T.v2001, b: T.motivo, texto: '2001 · 2023 · 2026'},
  {a: T.sem, b: T.hora, texto: 'SEM COMUNICAÇÃO, NINGUÉM DECOLA', destaque: true},
  {a: T.pousar, b: T.localiz, texto: 'QUEM ESTAVA NO AR PÔDE POUSAR'},
  {a: T.localiz, b: T.ataque, texto: 'TODOS OS VOOS LOCALIZADOS'},
  {a: T.ataque, b: T.secret, texto: 'FOI ATAQUE?', destaque: true},
  {a: T.secret, b: T.ia, texto: 'ATÉ AGORA, SEM SINAL DE ATAQUE HACKER'},
  {a: T.ia, b: T.empresa, texto: 'SISTEMA NOVO DE INTELIGÊNCIA ARTIFICIAL'},
  {a: T.empresa, b: T.causa, texto: 'A EMPRESA NEGA LIGAÇÃO'},
  {a: T.causa, b: T.estrago, texto: 'CAUSA AINDA NÃO DIVULGADA', destaque: true},
  {a: T.europa, b: T.aqui, texto: 'EUROPA E CANADÁ TAMBÉM SEGURARAM VOOS'},
  {a: T.aqui, b: T.gru, texto: 'E AQUI NO BRASIL?', destaque: true},
  {a: T.ateComeco, b: T.agora, texto: 'SEM CANCELAMENTO CONFIRMADO ATÉ O COMEÇO DA NOITE'},
  {a: T.agora, b: T.dez, texto: 'E AGORA?', destaque: true},
  {a: T.quatro, b: T.normal, texto: 'CERCA DE 4 HORAS PARADO'},
  {a: T.normal, b: T.sabado, texto: 'VOLTAR AO NORMAL DEMORA'},
  {a: T.sabado, b: T.seuvoo, texto: 'SÁBADO AINDA TEM CANCELAMENTO', destaque: true},
  {a: T.outro, b: T.assist, texto: 'OUTRO VOO OU DINHEIRO DE VOLTA'},
  {a: T.assist, b: T.confira, texto: 'ALIMENTAÇÃO E, SE PERNOITAR, HOTEL'},
  {a: T.confira, b: T.segue, texto: 'CONFIRA SEU VOO ANTES DE SAIR', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.mandaram, b: T.aqui, texto: 'FONTES: FAA, GOVERNO DOS EUA, NBC, ABC, AL JAZEERA · 13/11/2026'},
  {a: T.aqui, b: T.agora, texto: 'FONTES: GRU AIRPORT, AENA (GALEÃO), FOLHAPRESS · 13/11/2026'},
  {a: T.agora, b: T.seuvoo, texto: 'FONTES: GOVERNO DOS EUA (NBC), JETBLUE (ABC) · 13/11/2026'},
  {a: T.seuvoo, b: FIM, texto: 'FONTE: ANAC · RESOLUÇÃO 400'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => [
  {a: T.c22 + 0.3, b: T.hora - 0.2, p: soma(CONTROLE, [0, 2.2, 0]), valor: '22 CENTROS', sub: 'CONTROLE DE ROTA', cor: tema.acento},
  {a: T.v4mil + 3.6, b: T.ataque - 0.2, p: [-1.0, 2.6, PISTA_Z], valor: '4.042 NO AR', sub: 'TODOS POUSARAM'},
  {a: T.v5mil + 3.4, b: T.europa - 0.1, p: [0, 2.2, -0.4], valor: '~5 MIL', sub: 'VOOS CANCELADOS', cor: tema.acento},
  {a: T.europa + 0.3, b: T.aqui - 0.2, p: soma(GLOBO, [0, 1.3, 0]), valor: 'EUROPA E CANADÁ'},
  {a: T.reaberto + 0.4, b: T.seuvoo - 0.2, p: soma(RELOGIO, [0, 1.8, 0]), valor: '22H15', sub: 'REABERTO (BRASÍLIA)', cor: tema.acento},
];
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const folha = folhaEm(t);
  const chip = folha ? undefined : CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const yMin = folha ? 900 : 760;
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 200 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 140, Math.min(SEGURO.botoesX - 140, pj.x)), y: Math.max(yMin, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  return (
    <>
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', alignItems: 'center', gap: 10}}>
        {seloAtual && !folha && t > 4.4 ? (
          <div style={{opacity: Math.min(1, visivel(seloAtual, t)), padding: '8px 14px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 52 ? 14 : 16, fontWeight: 700, letterSpacing: 1.0, color: tema.texto, whiteSpace: 'nowrap'}}>{seloAtual.texto}</div>
        ) : null}
      </div>
      {chip && (t > 4.4 || chip.a > 4.4) ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: t < 4.4 ? 790 : TOPO_CHIP, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
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

const ESTADOS: [number, string][] = [
  [0, 'VOOS PARADOS NOS EUA'],
  [T.motivo - 0.1, 'O MOTIVO'],
  [T.ataque - 0.1, 'FOI ATAQUE?'],
  [T.estrago - 0.1, 'O ESTRAGO'],
  [T.aqui - 0.1, 'NO BRASIL'],
  [T.agora - 0.1, 'COMO ESTÁ AGORA'],
  [T.seuvoo - 0.1, 'SEUS DIREITOS'],
];

const SOQUINHOS = [T.mandaram, T.ninguem, T.causa, T.v5mil, T.reaberto, T.confira];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  FOLHAS.forEach((f) => s.push({t: f.a + 0.02, f: 'tique', v: 0.12}));
  ESTADOS.slice(1).forEach(([x]) => s.push({t: x + 0.05, f: 'tique', v: 0.1}));
  [T.mandaram, T.causa].forEach((x) => s.push({t: x + 0.05, f: 'baque', v: 0.16}));
  [T.falha, T.ataque].forEach((x) => s.push({t: x + 0.1, f: 'pop', v: 0.13}));
  [T.v10mil, T.reaberto].forEach((x) => s.push({t: x + 0.15, f: 'subida', v: 0.13}));
  s.push({t: T.v5mil + 0.2, f: 'impacto', v: 0.12});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.6, 2.5, 4.6, T.terceira + 0.8, T.v2001 + 1.0, T.motivo + 0.8, T.falha + 1.2, T.c22 + 1.0, T.sem + 0.8, T.hora + 0.6, T.v4mil + 1.0, T.pousar + 1.2, T.localiz + 0.8, T.ataque + 0.4, T.secret + 1.0, T.ia + 1.0, T.empresa + 0.8, T.causa + 0.6, T.estrago + 0.6, T.v10mil + 1.2, T.v5mil + 3.6, T.europa + 0.8, T.aqui + 0.6, T.gru + 1.2, T.ateComeco + 0.8, T.agora + 0.4, T.dez + 1.2, T.reaberto + 1.5, T.quatro + 0.6, T.sabado + 0.6, T.seuvoo + 0.8, T.anac + 1.0, T.assist + 0.8, T.confira + 0.6, T.segue + 0.6, FIM - 0.4].filter((x) => x < FIM);

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
export const VoosParados: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = (1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}))) * (1 + soquinho(t));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [2.5, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={12} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Voos nos EUA" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const TITULO_CAPA = ['EUA', 'pararam', 'todos os', 'aviões'];
export const CapaVoosParados: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Marca tema={tema} serie={SERIE} assunto="Voos nos EUA" />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 260}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 8 ? 116 : 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
