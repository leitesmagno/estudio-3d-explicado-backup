import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Fosco, Palco, Particulas, Vapor, cinematizar, enquadrar, focarEm, mistura, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Etiqueta} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, rampa, sumir} from '../../base/tempo';
import type {Tema} from '../../base/tema';
import {temaPorId} from '../../estilo';
import {Carro, Chave, Engrenagem} from '../../pecas';
import {Balao, Cabecalho, CapaSerie, Check, Estalo, Fecho, Lista, Titulo, TrechoMapa, V} from '../tinhocomum/comum';
import {Olhos, type Olhar} from '../tinhocomum/pecas3d';
import {Biela, Bloco, Pistao, Virabrequim, geoMotor} from '../bielatinho/pecas';
import {PALAVRAS} from './palavras';

// 160. motor de arranque tinho autopeças: 4º vídeo da série de peças da Tinho Auto Peças (Nova Iguaçu/RJ).
// Estúdio 3D: o motor da biela com o volante na frente; o motor de arranque (olhos na tampa) ligado à bateria;
// a chave gira, o automático empurra o pinhão até o volante, o motor gira e pega; o pinhão volta.
// Um boneco empurra um carrinho (a comparação). Bateria fraca, escovas e pinhão gastos. Kit Mapas no fecho.

export const FPS = 30;
const AUDIO_SEG = 43.96;
export const QUADROS = Math.round((AUDIO_SEG + 1.9) * FPS);
const FIM = QUADROS / FPS;
const W = 1080;
const H = 1920;
const P = '160. motor de arranque tinho autopeças';
const PI = Math.PI;

const quando = criarQuando(PALAVRAS);
const T = {
  chave0: quando('Girou a chave'),
  tec1: quando('ouviu tec'),
  dormindo: quando('dormindo'),
  oMotor: quando('O motor do carro'),
  naoLiga: quando('não liga'),
  empurrao: quando('empurrãozinho'),
  voltas: quando('primeiras voltas'),
  quemDa: quando('Quem dá'),
  arranque: quando('é o motor de arranque'),
  motorzinho: quando('motorzinho'),
  bateria: quando('na bateria'),
  gira: quando('você gira'),
  eletroima: quando('eletroímã'),
  automatico: quando('o automático'),
  empurra: quando('empurra uma'),
  pinhao: quando('o pinhão,'),
  encaixar: quando('encaixar'),
  volante: quando('volante'),
  ai: quando('Aí o motor'),
  giraMotor: quando('gira o motor'),
  combustao: quando('combustão'),
  pega: quando('pega sozinho'),
  mesmaHora: quando('Na mesma hora'),
  volta: quando('volta pro lugar'),
  tipo: quando('É tipo'),
  carrinho: quando('carrinho'),
  andar: quando('andar sozinho'),
  agora: quando('Agora'),
  fraca: quando('está fraca'),
  tec2: quando('só faz tec'),
  escovas: quando('as escovas'),
  gastam: quando('gastam'),
  semForca: quando('sem força'),
  raspando: quando('ferro raspando'),
  dica: quando('Dica'),
  segurando: quando('segurando a chave'),
  tentou: quando('Tentou'),
  espera: quando('espera um pouco'),
  precisa: quando('Precisa de motor'),
  ctaArr: quando('de motor de arranque'),
  ctaAut: quando('automático ou'),
  peca: quando('qualquer peça'),
  chama: quando('Chama'),
};
const C = {gancho: 0, motor: T.oMotor - 0.2, arranque: T.quemDa - 0.2, eletrico: T.motorzinho - 0.3, chave: T.gira - 0.4, gira: T.ai - 0.2, volta: T.mesmaHora - 0.2, carrinho: T.tipo - 0.2, fraca: T.agora - 0.2, gasto: T.escovas - 0.3, dica: T.dica - 0.2, mapa: T.precisa};

// ---------- Layout e movimento ----------
const MK = 0.8; // escala do motor
const F: V3 = [0, 1.1 * MK, 0.95]; // centro do volante
const RV = 0.75; // raio do volante
const RP = 0.19; // raio do pinhão
const ANG = -0.55;
const DIST = 1.08 * (RV + RP);
const PX = F[0] + DIST * Math.cos(ANG);
const PY = F[1] + DIST * Math.sin(ANG);
const XB = 2.45; // bateria
const XC = 8; // cena do carrinho

// encaixe do pinhão (0 = recolhido, 1 = no volante)
const encaixe = (t: number) => rampa(t, T.empurra - 0.1, T.encaixar + 0.2) * (1 - rampa(t, T.volta - 0.2, T.volta + 0.4)) + rampa(t, T.fraca - 0.4, T.fraca) * (1 - rampa(t, C.dica, C.dica + 0.4));
// velocidade do pinhão (rad/s) e do motor
const W_CH: [number, number][] = [
  [0, 0],
  [T.giraMotor - 0.3, 0],
  [T.giraMotor + 0.3, 22],
  [T.pega, 22],
  [T.pega + 0.4, 0],
  [T.semForca - 0.3, 0],
  [T.semForca, 7],
  [T.raspando + 0.8, 7],
  [T.raspando + 1.1, 0],
  [FIM, 0],
];
const integra = (ch: [number, number][], t: number) => {
  let acc = 0;
  for (let i = 1; i < ch.length; i++) {
    const [t0, w0] = ch[i - 1];
    const [t1, w1] = ch[i];
    if (t <= t0) break;
    const b = Math.min(t, t1);
    const wb = w0 + ((w1 - w0) * (b - t0)) / Math.max(1e-6, t1 - t0);
    acc += ((w0 + wb) / 2) * (b - t0);
  }
  return acc;
};
const giroPinhao = (t: number) => integra(W_CH, t);
// o motor: puxado pelo pinhão (relação RP/RV) e, depois que pega, sozinho e mais rápido
const giroMotor = (t: number) => giroPinhao(t) * (RP / RV) + 9 * Math.max(0, Math.min(t, C.fraca) - T.pega - 0.25);
const motorLigado = (t: number) => rampa(t, T.pega, T.pega + 0.5) * (1 - rampa(t, C.fraca - 0.3, C.fraca + 0.2));

const olharEm = (t: number): Olhar => {
  if (t < C.motor) return 'sono';
  if (t >= C.fraca && t < C.dica) return 'medo';
  if (t >= T.pega && t < C.carrinho) return 'feliz';
  if (t >= C.dica) return 'feliz';
  return 'ok';
};

// ---------- Câmera ----------
const enq = (a: V3, l: number, h: number, d: V3) => enquadrar(a, l * 0.9, h * 0.86, d, 1.1, 30, -70);
const cGancho = enq([0.6, 1.2, 0.9], 3.4, 3.4, [0.3, 0.22, 1]);
const cMotor = enq([0.3, 1.5, 0.4], 3.2, 3.6, [-0.3, 0.2, 1]);
const cArranque = enq([PX + 0.2, PY + 0.1, 1.3], 2.2, 2.6, [0.55, 0.2, 1]);
const cEletrico = enq([1.4, 0.8, 0.9], 3.4, 2.8, [0.15, 0.3, 1]);
const cEncaixe = enq([(PX + F[0]) / 2 + 0.2, PY + 0.2, 1.1], 1.9, 2.2, [0.7, 0.25, 0.75]);
const cGira = enq([0.4, 1.3, 0.6], 3.4, 3.6, [0.3, 0.22, 1]);
const cCarrinho = enq([XC + 1.3, 0.75, 0], 3.0, 2.0, [0.2, 0.22, 1]);
const cFraca = enq([1.75, 0.9, 0.9], 3.0, 2.8, [-0.2, 0.28, 1]);
const cGasto = enq([PX + 0.2, PY + 0.2, 1.2], 2.2, 2.6, [0.45, 0.2, 1]);
const cDica = enq([-1.35, 2.35, 0.9], 1.3, 1.8, [0.15, 0.1, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, cGancho],
    [C.motor - 0.1, cGancho],
    [C.motor + 0.9, cMotor],
    [C.arranque - 0.1, cMotor],
    [C.arranque + 0.8, cArranque],
    [C.eletrico + 0.2, cArranque],
    [C.eletrico + 1.0, cEletrico],
    [C.chave + 0.6, cEletrico],
    [T.empurra, cEncaixe],
    [C.gira - 0.1, cEncaixe],
    [C.gira + 0.8, cGira],
    [C.carrinho - 0.15, cGira],
    [C.carrinho + 0.5, cCarrinho],
    [C.fraca - 0.15, cCarrinho],
    [C.fraca + 0.5, cFraca],
    [C.gasto + 0.1, cFraca],
    [C.gasto + 0.8, cGasto],
    [C.dica + 0.1, cGasto],
    [C.dica + 0.9, cDica],
    [FIM, cDica],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.06, grua: 0.02});
};

// ---------- Peças ----------
const MotorDeArranque: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const e = encaixe(t);
  const zp = F[2] + 0.38 * (1 - e);
  const empurra = rampa(t, T.empurra - 0.1, T.empurra + 0.3) * (1 - rampa(t, T.volta - 0.2, T.volta + 0.3));
  const escova = rampa(t, T.escovas - 0.2, T.escovas + 0.3) * (1 - rampa(t, C.dica, C.dica + 0.4));
  return (
    <group>
      <Engrenagem tema={tema} pos={[PX, PY, zp]} r={RP} giro={giroPinhao(t)} cor={mistura(tema.objetoClaro, tema.acento, 0.6 * rampa(t, T.pinhao - 0.2, T.pinhao + 0.3) * (1 - rampa(t, T.encaixar + 0.4, T.encaixar + 0.8)))} />
      {/* eixo e corpo, deitado no eixo z */}
      <mesh position={[PX, PY, zp + 0.2]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 14]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[PX, PY, F[2] + 0.85]} rotation={[PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.9, 36]} />
        <Fosco cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} aspereza={0.5} />
      </mesh>
      <mesh position={[PX, PY, F[2] + 1.31]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 36]} />
        <Fosco cor={tema.objetoClaro} aspereza={0.45} />
      </mesh>
      {/* escovas: janelinha que acende quando gastam */}
      <Caixa args={[0.2, 0.08, 0.3]} raio={0.02} cor={mistura(tema.objeto, tema.acento, escova)} emissivo={0.3 * escova} position={[PX, PY - 0.26, F[2] + 1.0]} sombra={false} />
      {/* automático (eletroímã) em cima, com o êmbolo que empurra */}
      <mesh position={[PX, PY + 0.38, F[2] + 0.75]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.62, 28]} />
        <Fosco cor={mistura(tema.objetoClaro, tema.acento, 0.7 * rampa(t, T.eletroima - 0.2, T.eletroima + 0.3) * (1 - rampa(t, T.encaixar + 0.4, T.encaixar + 0.8)))} emissivo={0.25 * rampa(t, T.eletroima, T.eletroima + 0.4) * (1 - rampa(t, T.encaixar + 0.4, T.encaixar + 0.8))} />
      </mesh>
      <mesh position={[PX, PY + 0.38, F[2] + 0.35 - 0.12 * empurra]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.25, 14]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <Olhos tema={tema} pos={[PX, PY + 0.02, F[2] + 1.34]} esc={2.0} olhar={olharEm(t)} mira={[Math.sin(t * 1.2) * 0.6, 0.2]} />
    </group>
  );
};

const BateriaCarro: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const fraca = rampa(t, T.fraca - 0.3, T.fraca + 0.3) * (1 - rampa(t, C.dica, C.dica + 0.4));
  const ativa = rampa(t, T.bateria - 0.2, T.bateria + 0.3);
  const n = 1 - 0.8 * fraca;
  return (
    <group position={[XB, 0, 0.6]}>
      <Caixa args={[0.85, 0.6, 0.5]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.3, 0]} />
      <Caixa args={[0.85, 0.06, 0.5]} raio={0.02} cor={tema.tinta} position={[0, 0.62, 0]} />
      <mesh position={[-0.25, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <Fosco cor={tema.acento} />
      </mesh>
      <mesh position={[0.25, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <Fosco cor={tema.tinta} />
      </mesh>
      {/* nível de carga na frente */}
      <Caixa args={[0.6, 0.16, 0.02]} raio={0.02} cor={tema.tinta} position={[0, 0.32, 0.26]} sombra={false} />
      <Caixa args={[0.56 * n, 0.12, 0.022]} raio={0.02} cor={fraca > 0.5 ? tema.acento : mistura(tema.objetoClaro, '#2FB36B', 0.8)} emissivo={0.4 * ativa} position={[-0.28 + 0.28 * n, 0.32, 0.27]} sombra={false} />
    </group>
  );
};

// cabo da bateria até o automático
const CABO = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([new THREE.Vector3(XB - 0.25, 0.75, 0.6), new THREE.Vector3(XB - 0.4, 1.2, 0.9), new THREE.Vector3(PX + 0.3, PY + 0.75, F[2] + 0.9), new THREE.Vector3(PX, PY + 0.52, F[2] + 0.95)]),
  40,
  0.035,
  8,
  false,
);

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const th = giroMotor(t);
  const g = geoMotor(th);
  const lig = motorLigado(t);
  const chaveGira = (rampa(t, T.chave0 + 0.1, T.chave0 + 0.4) * (1 - rampa(t, T.dormindo, T.dormindo + 0.4)) + rampa(t, T.gira, T.gira + 0.3) * (1 - rampa(t, T.mesmaHora, T.mesmaHora + 0.3)) + rampa(t, T.segurando, T.segurando + 0.3) * (1 - rampa(t, T.espera, T.espera + 0.3))) * (PI / 2);
  const corrente = rampa(t, T.bateria - 0.2, T.bateria + 0.3) * (1 - rampa(t, T.gira - 0.1, T.gira)) * 0.5 + rampa(t, T.gira, T.gira + 0.3) * (1 - rampa(t, T.pega, T.pega + 0.4));
  // carrinho
  const empurra = rampa(t, T.carrinho - 0.4, T.andar, (x) => x);
  const sozinho = Math.max(0, t - T.andar) * 1.4;
  const xCarro = XC + 0.9 + 1.4 * empurra + sozinho;
  const xBoneco = XC + 0.05 + 1.4 * empurra;
  return (
    <>
      <Particulas t={t} centro={[2, 2, -1]} raio={10} n={50} opacidade={0.3} />
      {/* motor + volante */}
      <group scale={MK}>
        <Bloco tema={tema} />
        <Virabrequim tema={tema} th={th} />
        <group position={[0, g.pinoY, 0]}>
          <Pistao tema={tema} />
        </group>
        <group position={[g.px, g.py, 0]} rotation={[0, 0, g.giroBiela]}>
          <Biela tema={tema} olhar={lig > 0.5 ? 'feliz' : 'ok'} />
        </group>
      </group>
      <mesh position={[F[0], F[1], (F[2] + 0.25) / 2]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, F[2] - 0.25, 14]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <Engrenagem tema={tema} pos={F} r={RV} giro={-th} cor={tema.objetoClaro} />
      <MotorDeArranque tema={tema} t={t} />
      <BateriaCarro tema={tema} t={t} />
      <mesh geometry={CABO}>
        <Fosco cor={mistura(tema.tinta, tema.acento, 0.5 + 0.5 * corrente)} emissivo={0.5 * corrente} />
      </mesh>
      {/* chave na ignição */}
      <group position={[-1.35, 2.5, 0.9]}>
        <Caixa args={[0.5, 0.5, 0.12]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0, -0.08]} />
        <Chave tema={tema} pos={[0, 0, 0.02]} rot={[0, 0, -chaveGira]} escala={2.4} />
      </group>
      {/* escapamento: fumacinha quando pega */}
      {lig > 0.05 ? <Vapor pos={[-0.85, 0.5, 0.2]} t={t} escala={0.9 * lig} n={5} /> : null}
      {/* comparação: boneco empurrando o carrinho */}
      <Caixa args={[9, 0.06, 2.4]} raio={0.02} cor={tema.objetoEscuro} position={[XC + 2.5, 0.03, 0]} />
      <Carro tema={tema} pos={[xCarro, 0.06, 0]} rotY={PI / 2} escala={0.75} cor={tema.acento} anda={xCarro - XC} />
      <Boneco tema={tema} pos={[xBoneco, 0.06, 0]} rotY={PI / 2} escala={0.75} cor={tema.corpo} pose={{ombroD: [-1.45, 0, 0.05], ombroE: [-1.45, 0, -0.05], cotoveloD: -0.2, cotoveloE: -0.2, tronco: 0.35, passo: t < T.andar ? Math.sin(t * 7) : 0}} />
    </>
  );
};

// ---------- Interface 2D ----------
const Interface: React.FC<{t: number; tema: Tema; cam: Cam}> = ({t, tema, cam}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const ap = (a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b - 0.3, b));
  const rosto = pj([PX, PY + 0.3, F[2] + 1.35]);
  const tec = (a: number, x: number, y: number, r: number, b: number) => <Estalo x={x} y={y} texto="TEC!" k={entra(t, a, 0.25) * sumir(t, b, 0.3)} rot={r} cor={tema.branco} tam={72} />;
  return (
    <>
      <Titulo t={t} a={0} b={C.motor}>
        SÓ <V tema={tema}>TEC, TEC, TEC</V>?
      </Titulo>
      <Titulo t={t} a={C.motor} b={C.arranque}>
        O MOTOR NÃO LIGA <V tema={tema}>SOZINHO</V>
      </Titulo>
      <Titulo t={t} a={C.arranque} b={C.chave}>
        O <V tema={tema}>MOTOR DE ARRANQUE</V>
      </Titulo>
      <Titulo t={t} a={C.chave} b={C.gira}>
        GIROU A CHAVE: <V tema={tema}>ENCAIXA!</V>
      </Titulo>
      <Titulo t={t} a={C.gira} b={C.carrinho}>
        GIRA, PEGA E <V tema={tema}>SOLTA</V>
      </Titulo>
      <Titulo t={t} a={C.carrinho} b={C.fraca}>
        É TIPO <V tema={tema}>EMPURRAR</V> UM CARRINHO
      </Titulo>
      <Titulo t={t} a={C.fraca} b={C.gasto}>
        BATERIA <V tema={tema}>FRACA</V>
      </Titulo>
      <Titulo t={t} a={C.gasto} b={C.dica}>
        ESCOVAS E PINHÃO <V tema={tema}>GASTOS</V>
      </Titulo>
      <Lista t={t} a={C.dica} b={C.mapa}>
        <Check tema={tema} texto="Não segure a chave" k={rampa(t, T.segurando - 0.2, T.segurando + 0.3)} tam={46} />
        <Check tema={tema} texto={<>Não pegou? <V tema={tema}>Espere</V></>} k={rampa(t, T.espera - 0.2, T.espera + 0.3)} tam={46} />
      </Lista>
      {/* gancho */}
      {tec(T.tec1, 230, 760, -10, C.motor - 0.3)}
      {tec(T.tec1 + 0.3, 840, 880, 8, C.motor - 0.3)}
      {tec(T.tec1 + 0.6, 260, 1060, -5, C.motor - 0.3)}
      <Balao tema={tema} x={rosto.x + 40} y={rosto.y - 60} texto="ZZZ..." cor={tema.tinta} k={entra(t, T.dormindo - 0.2, 0.35) * sumir(t, C.motor, 0.3)} />
      {/* etiquetas */}
      <Etiqueta tema={tema} x={70} y={560} alvo={pj([0, 2.4, 0.3])} titulo="Motor" aparece={ap(T.oMotor, C.arranque)} largura={280} />
      <Etiqueta tema={tema} x={570} y={1130} alvo={pj([F[0] + 0.4, F[1] - 0.4, F[2] + 0.1])} titulo="Volante" aparece={ap(T.voltas, C.arranque) + ap(T.volante, C.gira)} largura={300} />
      <Etiqueta tema={tema} x={70} y={560} alvo={pj([PX, PY + 0.25, F[2] + 1.2])} titulo="Motor de arranque" sub="A PEÇA DO VÍDEO" aparece={ap(T.arranque, C.chave)} destaque largura={480} />
      <Etiqueta tema={tema} x={620} y={560} alvo={pj([XB, 0.65, 0.6])} titulo="Bateria" aparece={ap(T.bateria, C.chave)} largura={300} />
      <Etiqueta tema={tema} x={600} y={560} alvo={pj([PX, PY + 0.5, F[2] + 0.75])} titulo="Automático" sub="ELETROÍMÃ" aparece={ap(T.automatico, C.gira)} destaque largura={400} />
      <Etiqueta tema={tema} x={70} y={1150} alvo={pj([PX, PY - 0.1, F[2] + 0.05])} titulo="Pinhão" aparece={ap(T.pinhao, C.gira)} destaque largura={280} />
      <Estalo x={540} y={1240} texto="VRUM!" k={entra(t, T.pega, 0.3) * sumir(t, C.carrinho, 0.3)} rot={-4} cor={tema.acento} tam={80} />
      <Estalo x={540} y={1240} texto="TEC... TEC..." k={entra(t, T.tec2, 0.3) * sumir(t, C.gasto, 0.3)} rot={-4} cor={tema.branco} tam={64} />
      <Etiqueta tema={tema} x={600} y={1150} alvo={pj([PX, PY - 0.27, F[2] + 1.0])} titulo="Escovas" aparece={ap(T.escovas, C.dica)} destaque largura={300} />
      <Estalo x={540} y={1240} texto="CRRRRR!" k={entra(t, T.raspando, 0.3) * sumir(t, C.dica, 0.3)} rot={4} cor={tema.acento} tam={72} />
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: T.chave0 + 0.1, f: 'tique', v: 0.22},
  {t: T.tec1, f: 'tique', v: 0.26},
  {t: T.tec1 + 0.3, f: 'tique', v: 0.26},
  {t: T.tec1 + 0.6, f: 'tique', v: 0.26},
  {t: C.motor, f: 'whoosh', v: 0.18},
  {t: T.arranque, f: 'pop', v: 0.18},
  {t: T.bateria, f: 'bip', v: 0.14},
  {t: T.gira, f: 'tique', v: 0.22},
  {t: T.eletroima, f: 'subida', v: 0.14},
  {t: T.encaixar, f: 'baque', v: 0.24},
  {t: T.giraMotor, f: 'subida', v: 0.18},
  {t: T.pega, f: 'impacto', v: 0.26},
  {t: T.volta, f: 'tique', v: 0.2},
  {t: C.carrinho, f: 'whoosh', v: 0.18},
  {t: T.andar, f: 'ding', v: 0.16},
  {t: C.fraca, f: 'whoosh', v: 0.16},
  {t: T.tec2, f: 'tique', v: 0.24},
  {t: T.tec2 + 0.3, f: 'tique', v: 0.24},
  {t: T.escovas, f: 'pop', v: 0.16},
  {t: T.raspando, f: 'baque', v: 0.2},
  {t: C.dica, f: 'whoosh', v: 0.16},
  {t: T.segurando, f: 'tique', v: 0.18},
  {t: T.espera, f: 'ding', v: 0.16},
  {t: C.mapa, f: 'whoosh', v: 0.2},
  {t: T.ctaArr, f: 'pop', v: 0.18},
  {t: T.ctaAut, f: 'pop', v: 0.18},
  {t: T.peca, f: 'pop', v: 0.18},
  {t: T.chama - 1.6, f: 'subida', v: 0.2},
  {t: T.chama, f: 'impacto', v: 0.3},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.3, T.dormindo + 0.3, T.voltas + 0.4, T.arranque + 0.6, T.bateria + 0.4, T.automatico + 0.4, T.encaixar + 0.4, T.giraMotor + 0.5, T.pega + 0.4, T.volta + 0.4, T.carrinho + 0.3, T.andar + 0.4, T.tec2 + 0.3, T.raspando + 0.3, T.segurando + 0.4, T.espera + 0.4, T.ctaAut + 0.3, T.chama + 0.9, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const ArranqueTinho: React.FC<Props> = ({guia, semInterface, estilo = 'tinho', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camEm(t);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={16} centro={[3, 0, 0]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema foco={focarEm(cam, cam.alvo, 3, 3.5)} raioAO={0.4} vinheta={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  const mapaDe = Math.round(C.mapa * FPS);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      {t < C.mapa + 0.6 ? mundo : null}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.75) 0%, rgba(10,16,51,0) 30%, rgba(10,16,51,0) 75%, rgba(10,16,51,0.55) 100%)'}} />
      <Sequence from={mapaDe} durationInFrames={QUADROS - mapaDe} layout="none">
        <TrechoMapa pasta={P} dur={QUADROS - mapaDe} />
      </Sequence>
      <Interface t={t} tema={tema} cam={cam} />
      {t >= C.mapa ? (
        <Fecho
          t={t}
          tema={tema}
          chips={[
            ['Motor de arranque', T.ctaArr],
            ['Automático', T.ctaAut],
            ['E muito mais', T.peca],
          ]}
          chama={T.chama}
        />
      ) : null}
      <Cabecalho tema={tema} op={(1 - rampa(t, T.chama - 0.3, T.chama)) * rampa(t, 0, 0.4)} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} tam={54} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const CapaArranqueTinho: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'tinho', fundo = `${P}/capa/fundo-limpo.jpg`}) => (
  <CapaSerie tema={temaPorId(estilo)} fundo={fundo} linhas={['GIROU A', 'CHAVE E SÓ', 'TEC, TEC?', 'O ARRANQUE!']} desce={520} />
);
