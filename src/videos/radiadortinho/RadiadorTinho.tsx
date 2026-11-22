import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Fosco, Palco, Particulas, Vapor, cinematizar, enquadrar, focarEm, mistura, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Etiqueta} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, rampa, sumir} from '../../base/tempo';
import {ESCURO, type Tema} from '../../base/tema';
import {Trilha} from '../../base/cidade';
import {temaPorId} from '../../estilo';
import {Gota} from '../../pecas';
import {Balao, Cabecalho, CapaSerie, Check, Estalo, Fecho, Lista, Titulo, TrechoMapa, V} from '../tinhocomum/comum';
import {Olhos, type Olhar} from '../tinhocomum/pecas3d';
import {Biela, Bloco, Pistao, Virabrequim, geoMotor} from '../bielatinho/pecas';
import {PALAVRAS} from './palavras';

// 159. radiador tinho autopeças: 3º vídeo da série de peças da Tinho Auto Peças (Nova Iguaçu/RJ).
// Estúdio 3D: motor em corte (o da biela, menor) ligado por mangueiras ao radiador-personagem; o líquido
// quente (vermelho) vai, esfria nos tubinhos e volta frio (azul); vento da grade e da ventoinha; fervura e vazamento.
// Kit Mapas: Brasil → Nova Iguaçu no fecho, com a logo.

export const FPS = 30;
const AUDIO_SEG = 42.58;
export const QUADROS = Math.round((AUDIO_SEG + 1.9) * FPS);
const FIM = QUADROS / FPS;
const W = 1080;
const H = 1920;
const P = '159. radiador tinho autopeças';
const PI = Math.PI;

const quando = criarQuando(PALAVRAS);
const T = {
  vermelho: quando('no vermelho'),
  febre: quando('febre'),
  radiador: quando('é o radiador'),
  esquenta: quando('motor esquenta'),
  liquido: quando('Um líquido'),
  aditivo: quando('o aditivo misturado'),
  calor: quando('esse calor'),
  depois: quando('Depois'),
  quente: quando('líquido quente'),
  frente: quando('na frente'),
  tubinhos: quando('tubinhos'),
  aletas: quando('aletas'),
  vento: quando('o vento'),
  grade: quando('pela grade'),
  sopa: quando('soprando'),
  parado: quando('Quando o carro'),
  ventoinha: quando('a ventoinha liga'),
  volta: quando('volta frio'),
  ciclo: quando('o ciclo'),
  entope: quando('entope'),
  vaza: quando('vaza'),
  ferve: quando('motor ferve'),
  empenar: quando('empenar'),
  caro: quando('fica caro'),
  entao: quando('Então'),
  nivel: quando('nível do'),
  frio: quando('motor frio'),
  certo: quando('aditivo certo'),
  agua: quando('só água'),
  precisa: quando('Precisa'),
  ctaRad: quando('de radiador'),
  ctaVent: quando('ventoinha ou'),
  peca: quando('qualquer peça'),
  chama: quando('Chama'),
};
const C = {gancho: 0, motor: T.esquenta - 0.25, radiador: T.depois - 0.2, aletas: T.tubinhos - 0.8, ventoinha: T.parado - 0.2, ciclo: T.volta - 0.4, pane: T.entope - 0.6, dica: T.entao - 0.2, mapa: T.precisa};

// ---------- Layout ----------
const MX = -1.75; // motor
const MK = 0.62; // escala do motor
const RX = 1.45; // radiador
const RY = 1.25;
const RW = 1.7;
const RH = 1.55;
const azul = (tema: Tema) => (tema.festa ?? ESCURO.festa!).azul;
// mangueiras (pontos no mundo)
const QUENTE: V3[] = [[MX + 0.2, 3.55 * MK + 0.05, 0.25], [MX + 0.9, 2.5, 0.35], [RX - RW / 2 - 0.15, RY + RH / 2 + 0.05, 0.25]];
const FRIA: V3[] = [[RX - RW / 2 - 0.15, RY - RH / 2 - 0.02, 0.25], [MX + 1.0, 0.45, 0.35], [MX + 0.5, 0.9, 0.3]];
const curva3 = (p: V3[], s: number): V3 => {
  const u = 1 - s;
  return [0, 1, 2].map((i) => u * u * p[0][i] + 2 * u * s * p[1][i] + s * s * p[2][i]) as V3;
};
const MANG_Q = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length: 21}, (_, i) => new THREE.Vector3(...curva3(QUENTE, i / 20)))), 40, 0.06, 10, false);
const MANG_F = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length: 21}, (_, i) => new THREE.Vector3(...curva3(FRIA, i / 20)))), 40, 0.06, 10, false);

const olharEm = (t: number): Olhar => {
  if (t < C.motor) return 'medo';
  if (t >= C.pane && t < C.dica) return 'medo';
  if (t >= T.esquenta && t < C.radiador) return 'sono';
  return t >= C.dica ? 'feliz' : 'ok';
};
const fervura = (t: number) => (1 - rampa(t, T.esquenta - 0.6, T.esquenta)) + rampa(t, T.ferve - 0.4, T.ferve + 0.4) * (1 - rampa(t, C.dica, C.dica + 0.6));

// ---------- Câmera ----------
const enq = (a: V3, l: number, h: number, d: V3) => enquadrar(a, l * 0.9, h * 0.86, d, 1.1, 30, -70);
const cGancho = enq([RX - 0.2, 1.4, 0], 2.6, 3.2, [0.3, 0.2, 1]);
const cMotor = enq([MX, 1.3, 0], 2.2, 3.3, [-0.2, 0.18, 1]);
const cTudo = enq([0, 1.4, 0], 5.4, 3.6, [0.1, 0.22, 1]);
const cAletas = enq([RX, RY, 0], 1.5, 2.3, [0.18, 0.12, 1]);
const cTras = enq([RX, RY, -0.2], 2.2, 2.8, [0.7, 0.2, -0.75]);
const cPane = enq([0, 1.4, 0], 4.6, 3.6, [-0.25, 0.22, 1]);
const cDica = enq([MX + 0.6, 1.8, 0.3], 1.6, 2.4, [0.25, 0.25, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, cGancho],
    [C.motor - 0.1, cGancho],
    [C.motor + 0.8, cMotor],
    [C.radiador - 0.1, cMotor],
    [C.radiador + 0.8, cTudo],
    [C.aletas + 0.1, cTudo],
    [C.aletas + 0.9, cAletas],
    [C.ventoinha - 0.1, cAletas],
    [C.ventoinha + 0.9, cTras],
    [C.ciclo - 0.1, cTras],
    [C.ciclo + 0.9, cTudo],
    [C.pane + 0.2, cTudo],
    [C.pane + 0.9, cPane],
    [C.dica - 0.1, cPane],
    [C.dica + 0.9, cDica],
    [FIM, cDica],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.06, grua: 0.02});
};

// ---------- Peças ----------
const Radiador: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const tubos = 12;
  const quente = tema.acento;
  const frio = azul(tema);
  const k = rampa(t, T.quente, T.quente + 0.8) * (1 - rampa(t, C.pane + 0.4, C.pane + 1)) + rampa(t, C.dica, C.dica + 0.5);
  const giroVent = rampa(t, T.ventoinha - 0.2, T.ventoinha + 0.6) * (t - T.ventoinha) * 14 + t * 0.3;
  return (
    <group position={[RX, RY, 0]}>
      {/* tanques de cima e de baixo */}
      <Caixa args={[RW + 0.15, 0.2, 0.3]} raio={0.06} cor={tema.objetoEscuro} position={[0, RH / 2 + 0.1, 0]} />
      <Caixa args={[RW + 0.15, 0.2, 0.3]} raio={0.06} cor={tema.objetoEscuro} position={[0, -RH / 2 - 0.1, 0]} />
      <mesh position={[-0.55, RH / 2 + 0.26, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 20]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      {/* tubinhos: vermelho em cima, azul embaixo (o líquido esfria descendo) */}
      {Array.from({length: tubos}, (_, i) => {
        const x = -RW / 2 + 0.07 + (i * (RW - 0.14)) / (tubos - 1);
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, RH / 4, 0]}>
              <boxGeometry args={[0.05, RH / 2, 0.12]} />
              <Fosco cor={mistura(tema.objetoClaro, mistura(quente, frio, 0.25), 0.7 * k)} emissivo={0.2 * k} />
            </mesh>
            <mesh position={[0, -RH / 4, 0]}>
              <boxGeometry args={[0.05, RH / 2, 0.12]} />
              <Fosco cor={mistura(tema.objetoClaro, mistura(quente, frio, 0.85), 0.7 * k)} emissivo={0.2 * k} />
            </mesh>
          </group>
        );
      })}
      {/* aletas finas */}
      {Array.from({length: 16}, (_, j) => (
        <mesh key={j} position={[0, -RH / 2 + 0.05 + (j * (RH - 0.1)) / 15, 0.01]}>
          <boxGeometry args={[RW - 0.04, 0.012, 0.1]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
      {/* moldura */}
      <Caixa args={[0.07, RH + 0.1, 0.16]} raio={0.02} cor={tema.objetoEscuro} position={[-RW / 2 - 0.02, 0, 0]} />
      <Caixa args={[0.07, RH + 0.1, 0.16]} raio={0.02} cor={tema.objetoEscuro} position={[RW / 2 + 0.02, 0, 0]} />
      {/* ventoinha atrás */}
      <group position={[0, 0, -0.32]} rotation={[0, 0, -giroVent]}>
        <mesh rotation={[PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 20]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        {[0, 1, 2, 3, 4].map((b) => (
          <mesh key={b} rotation={[0.35, 0, (b * 2 * PI) / 5]} position={[0, 0, 0]}>
            <boxGeometry args={[0.16, 1.15, 0.02]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0, -0.3]} rotation={[PI / 2, 0, 0]}>
        <torusGeometry args={[0.66, 0.03, 8, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {/* rosto */}
      <Olhos tema={tema} pos={[0, 0.12, 0.12]} esc={2.4} olhar={olharEm(t)} mira={[Math.sin(t * 1.2) * 0.6, 0.1]} />
    </group>
  );
};

// vento da grade: riscos brancos indo para o radiador
const Vento: React.FC<{tema: Tema; t: number; k: number}> = ({tema, t, k}) =>
  k < 0.02 ? null : (
    <group>
      {Array.from({length: 9}, (_, i) => {
        const f = (t * 0.9 + i * 0.37) % 1;
        const x = RX - 0.7 + (i % 3) * 0.7;
        const y = RY - 0.5 + Math.floor(i / 3) * 0.5;
        return (
          <mesh key={i} position={[x, y, 1.6 - 1.4 * f]}>
            <boxGeometry args={[0.02, 0.02, 0.35]} />
            <Fosco cor={tema.branco} emissivo={0.6} opacidade={k * Math.sin(f * PI)} />
          </mesh>
        );
      })}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const th = t * 3.2;
  const g = geoMotor(th);
  const fluxo = rampa(t, T.liquido - 0.2, T.liquido + 0.6) * (1 - rampa(t, C.pane + 0.6, C.pane + 1.2)) + rampa(t, C.dica, C.dica + 0.5);
  const destaqueCiclo = 1 + 0.6 * rampa(t, T.ciclo - 0.2, T.ciclo + 0.3) * (1 - rampa(t, C.pane - 0.2, C.pane + 0.3));
  const ferve = fervura(t);
  const empena = 0.12 * rampa(t, T.empenar, T.empenar + 0.6) * (1 - rampa(t, C.dica, C.dica + 0.6));
  const vaza = rampa(t, T.vaza - 0.1, T.vaza + 0.3) * (1 - rampa(t, C.dica, C.dica + 0.5));
  const vento = rampa(t, T.vento - 0.2, T.vento + 0.4) * (1 - rampa(t, C.ciclo, C.ciclo + 0.5));
  const nivel = rampa(t, T.nivel - 0.2, T.nivel + 0.4);
  return (
    <>
      <Particulas t={t} centro={[0, 2.2, -1]} raio={9} n={50} opacidade={0.3} />
      {/* motor (o da biela, menor) */}
      <group position={[MX, 0, 0]} scale={MK}>
        <group rotation={[0, 0, empena]}>
          <Bloco tema={tema} />
        </group>
        <Virabrequim tema={tema} th={th} />
        <group position={[0, g.pinoY, 0]}>
          <Pistao tema={tema} />
        </group>
        <group position={[g.px, g.py, 0]} rotation={[0, 0, g.giroBiela]}>
          <Biela tema={tema} olhar={ferve > 0.3 ? 'medo' : 'ok'} suor={ferve} />
        </group>
      </group>
      {/* reservatório de aditivo */}
      <group position={[MX + 1.0, 1.75, 0.45]}>
        <mesh>
          <boxGeometry args={[0.35, 0.45, 0.25]} />
          <Fosco cor={tema.branco} opacidade={0.45} />
        </mesh>
        <mesh position={[0, -0.22 + 0.15 * (0.6 + 0.4 * nivel), 0]}>
          <boxGeometry args={[0.31, 0.3 * (0.6 + 0.4 * nivel), 0.21]} />
          <Fosco cor={mistura(azul(tema), tema.areia, 0.25)} emissivo={0.2} opacidade={0.85} />
        </mesh>
      </group>
      {/* mangueiras: quente e fria */}
      <mesh geometry={MANG_Q}>
        <Fosco cor={mistura(tema.objetoEscuro, tema.acento, 0.55)} />
      </mesh>
      <mesh geometry={MANG_F}>
        <Fosco cor={mistura(tema.objetoEscuro, azul(tema), 0.55)} />
      </mesh>
      {fluxo > 0.02 ? (
        <>
          <Trilha f={(s) => curva3(QUENTE, (s + t * 0.35) % 1)} prog={1} cor={tema.acento} n={10} raio={0.05 * destaqueCiclo} opacidade={fluxo} />
          <Trilha f={(s) => curva3(FRIA, (s + t * 0.35) % 1)} prog={1} cor={azul(tema)} n={10} raio={0.05 * destaqueCiclo} opacidade={fluxo} />
        </>
      ) : null}
      <Radiador tema={tema} t={t} />
      <Vento tema={tema} t={t} k={vento} />
      {/* vapor da fervura */}
      {ferve > 0.05 ? (
        <>
          <Vapor pos={[MX, 3.6 * MK + 0.1, 0]} t={t} escala={1.4 * ferve} n={6} />
          <Vapor pos={[RX - 0.55, RY + RH / 2 + 0.3, 0]} t={t + 0.7} escala={1.2 * ferve} n={6} />
        </>
      ) : null}
      {/* vazamento embaixo do radiador */}
      {vaza > 0.05
        ? [0, 0.5].map((o) => {
            const f = ((t * 0.9 + o) % 1) * vaza;
            return <Gota key={o} tema={tema} pos={[RX + 0.3, RY - RH / 2 - 0.25 - 0.7 * f, 0.1]} escala={0.5} cor={azul(tema)} />;
          })
        : null}
      {vaza > 0.05 ? (
        <mesh position={[RX + 0.3, 0.02, 0.1]} rotation={[-PI / 2, 0, 0]}>
          <circleGeometry args={[0.35 * vaza, 28]} />
          <Fosco cor={azul(tema)} opacidade={0.6} />
        </mesh>
      ) : null}
    </>
  );
};

// ---------- Interface 2D ----------
const Ponteiro: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const k = entra(t, 0.1, 0.4) * sumir(t, C.motor, 0.3);
  if (k <= 0.01) return null;
  const ang = -60 + 115 * rampa(t, 0.2, T.vermelho + 0.3);
  return (
    <div style={{position: 'absolute', left: 90, top: 560, transform: `scale(${k})`}}>
      <svg width={260} height={170} viewBox="-130 -130 260 170">
        <path d="M-110 0 A110 110 0 0 1 110 0" fill="none" stroke="#FFFFFF" strokeWidth={18} />
        <path d="M60 -92 A110 110 0 0 1 110 0" fill="none" stroke={tema.acento} strokeWidth={18} />
        <text x={-100} y={30} fontFamily="Inter" fontWeight={900} fontSize={26} fill="#FFFFFF">C</text>
        <text x={84} y={30} fontFamily="Inter" fontWeight={900} fontSize={26} fill={tema.acento}>H</text>
        <g transform={`rotate(${ang})`}>
          <rect x={-5} y={-100} width={10} height={100} rx={5} fill={tema.acento} />
        </g>
        <circle r={14} fill="#FFFFFF" />
      </svg>
    </div>
  );
};

const Interface: React.FC<{t: number; tema: Tema; cam: Cam}> = ({t, tema, cam}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const ap = (a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b - 0.3, b));
  const rosto = pj([RX, RY + 0.5, 0.2]);
  return (
    <>
      <Titulo t={t} a={0} b={C.motor}>
        MOTOR COM <V tema={tema}>FEBRE</V>!
      </Titulo>
      <Titulo t={t} a={C.motor} b={C.radiador}>
        O MOTOR <V tema={tema}>ESQUENTA</V>
      </Titulo>
      <Titulo t={t} a={C.radiador} b={C.aletas}>
        O QUENTE VAI PRO <V tema={tema}>RADIADOR</V>
      </Titulo>
      <Titulo t={t} a={C.aletas} b={C.ventoinha}>
        O VENTO <V tema={tema}>ESFRIA</V> TUDO
      </Titulo>
      <Titulo t={t} a={C.ventoinha} b={C.ciclo}>
        PARADO? <V tema={tema}>VENTOINHA</V>!
      </Titulo>
      <Titulo t={t} a={C.ciclo} b={C.pane}>
        UM CICLO <V tema={tema}>SEM FIM</V>
      </Titulo>
      <Titulo t={t} a={C.pane} b={C.dica}>
        ENTUPIU? <V tema={tema}>FERVEU</V>!
      </Titulo>
      <Lista t={t} a={C.dica} b={C.mapa}>
        <Check tema={tema} texto="Nível com motor frio" k={rampa(t, T.nivel - 0.2, T.nivel + 0.3)} tam={46} />
        <Check tema={tema} texto={<>Aditivo <V tema={tema}>certo</V></>} k={rampa(t, T.certo - 0.2, T.certo + 0.3)} tam={46} />
      </Lista>
      <Ponteiro tema={tema} t={t} />
      <Balao tema={tema} x={rosto.x + 60} y={rosto.y - 40} texto="TÔ COM FEBRE!" k={entra(t, T.febre - 0.2, 0.35) * sumir(t, C.motor, 0.3)} />
      {/* motor */}
      <Etiqueta tema={tema} x={600} y={620} alvo={pj([MX + 0.35, 1.5, 0.3])} titulo="Motor" aparece={ap(T.esquenta, C.radiador)} largura={300} />
      <Etiqueta tema={tema} x={570} y={1120} alvo={pj([MX + 1.0, 1.75, 0.55])} titulo="Aditivo + água" sub="O LÍQUIDO" aparece={ap(T.aditivo, C.radiador)} destaque largura={420} />
      {/* radiador */}
      <Etiqueta tema={tema} x={600} y={560} alvo={pj([RX + 0.5, RY + 0.7, 0.1])} titulo="Radiador" sub="A PEÇA DO VÍDEO" aparece={ap(T.radiador + 0.2, C.motor) + ap(T.quente, C.aletas)} destaque largura={400} />
      <Etiqueta tema={tema} x={70} y={560} alvo={pj([RX - 0.3, RY + 0.3, 0.08])} titulo="Tubinhos" aparece={ap(T.tubinhos, C.ventoinha)} largura={300} />
      <Etiqueta tema={tema} x={640} y={1180} alvo={pj([RX + 0.4, RY - 0.4, 0.08])} titulo="Aletas" aparece={ap(T.aletas, C.ventoinha)} largura={280} />
      <Estalo x={540} y={1250} texto="FUUUU!" k={entra(t, T.sopa, 0.3) * sumir(t, C.ventoinha, 0.3)} rot={-4} cor={tema.branco} tam={70} />
      <Etiqueta tema={tema} x={600} y={1150} alvo={pj([RX, RY, -0.35])} titulo="Ventoinha" aparece={ap(T.ventoinha, C.ciclo)} destaque largura={340} />
      {/* pane */}
      <Etiqueta tema={tema} x={70} y={600} alvo={pj([MX, 3.3 * MK, 0.3])} titulo="Cabeçote empenado" aparece={ap(T.empenar, C.dica)} destaque largura={460} />
      <Etiqueta tema={tema} x={640} y={1150} alvo={pj([RX + 0.3, 0.1, 0.1])} titulo="Vazamento" aparece={ap(T.vaza, C.dica)} largura={340} />
      <Estalo x={760} y={780} texto="R$ $$$" k={entra(t, T.caro, 0.3) * sumir(t, C.dica, 0.3)} rot={8} cor={tema.acento} tam={64} />
      <Etiqueta tema={tema} x={600} y={1150} alvo={pj([MX + 1.0, 1.75, 0.6])} titulo="Reservatório" aparece={ap(T.nivel, C.mapa)} destaque largura={400} />
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: 0.2, f: 'subida', v: 0.18},
  {t: T.vermelho, f: 'bip', v: 0.16},
  {t: T.febre, f: 'pop', v: 0.18},
  {t: C.motor, f: 'whoosh', v: 0.18},
  {t: T.aditivo, f: 'pop', v: 0.16},
  {t: C.radiador, f: 'whoosh', v: 0.18},
  {t: T.quente, f: 'tique', v: 0.18},
  {t: T.tubinhos, f: 'tique', v: 0.18},
  {t: T.aletas, f: 'tique', v: 0.18},
  {t: T.sopa, f: 'whoosh', v: 0.2},
  {t: T.ventoinha, f: 'subida', v: 0.16},
  {t: T.volta, f: 'ding', v: 0.16},
  {t: C.pane, f: 'whoosh', v: 0.16},
  {t: T.ferve, f: 'impacto', v: 0.24},
  {t: T.empenar, f: 'baque', v: 0.22},
  {t: T.caro, f: 'bip', v: 0.16},
  {t: C.dica, f: 'whoosh', v: 0.16},
  {t: T.nivel, f: 'tique', v: 0.2},
  {t: T.certo, f: 'ding', v: 0.18},
  {t: C.mapa, f: 'whoosh', v: 0.2},
  {t: T.ctaRad, f: 'pop', v: 0.18},
  {t: T.ctaVent, f: 'pop', v: 0.18},
  {t: T.peca, f: 'pop', v: 0.18},
  {t: T.chama - 1.6, f: 'subida', v: 0.2},
  {t: T.chama, f: 'impacto', v: 0.3},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.3, T.febre + 0.4, T.esquenta + 0.6, T.aditivo + 0.6, T.quente + 0.6, T.tubinhos + 0.4, T.sopa + 0.4, T.ventoinha + 0.8, T.ciclo + 0.4, T.ferve + 0.4, T.empenar + 0.6, T.nivel + 0.6, T.certo + 0.6, T.ctaVent + 0.3, T.chama + 0.9, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const RadiadorTinho: React.FC<Props> = ({guia, semInterface, estilo = 'tinho', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camEm(t);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={12} />
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
            ['Radiador', T.ctaRad],
            ['Ventoinha', T.ctaVent],
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

export const CapaRadiadorTinho: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'tinho', fundo = `${P}/capa/fundo-limpo.jpg`}) => (
  <CapaSerie tema={temaPorId(estilo)} fundo={fundo} linhas={['MOTOR COM', 'FEBRE?', 'CHAMA O', 'RADIADOR!']} />
);
