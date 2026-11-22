import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, Particulas, cinematizar, enquadrar, focarEm, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Contador, Etiqueta} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {CABECALHO, GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, mola, rampa, sai, sumir} from '../../base/tempo';
import {FONTE, type Tema} from '../../base/tema';
import {temaPorId} from '../../estilo';
import {Carro, Gota} from '../../pecas';
import {Biela, Bloco, Galao, Haltere, MOTOR, Pistao, Virabrequim, geoMotor, type Olhar} from './pecas';
import {LogoTinho} from './Logo';
import {PALAVRAS} from './palavras';

// 157. biela tinho autopeças: o 1º vídeo da série de peças da Tinho Auto Peças (Nova Iguaçu/RJ).
// Estúdio 3D: motor monocilíndrico em corte com a biela-personagem (olhos), anatomia da biela gigante,
// giro rápido, falta de óleo e a biela "saindo para passear". Kit Mapas: do Brasil até Nova Iguaçu no fim,
// com a logo da loja (redesenhada em vetor a partir do Instagram) por cima.

export const FPS = 30;
const AUDIO_SEG = 46.95;
export const QUADROS = Math.round((AUDIO_SEG + 1.9) * FPS);
const FIM = QUADROS / FPS;
const W = 1080;
const H = 1920;
const P = '157. biela tinho autopeças';

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  toc1: quando('Toc'),
  toc2: quando('toc', 2),
  toc3: quando('toc', 3),
  visita: quando('visita'),
  socorro: quando('biela pedindo'),
  afinal: quando('Mas afinal'),
  oque: quando('que é a biela'),
  pistao: quando('liga o pistão'),
  vira: quando('ao virabrequim'),
  sobe: quando('O pistão só'),
  subir: quando('subir'),
  giro: quando('em giro'),
  ciclista: quando('Igualzinho'),
  pe: quando('o pé'),
  pino: quando('pino do pistão'),
  corpo: quando('O corpo'),
  maromba: quando('marombeiro'),
  cabeca: quando('a cabeça'),
  vira2: quando('abraça o virabrequim'),
  capa: quando('a capa'),
  paraf: quando('os parafusos'),
  bronz: quando('as bronzinas'),
  pesado: quando('E ela trabalha'),
  mil: quando('três mil giros'),
  vezes: quando('cinquenta vezes'),
  carro: quando('Todo carro com'),
  combust: quando('combustão'),
  oleo: quando('se falta óleo'),
  gasta: quando('a bronzina gasta'),
  batida: quando('começa a batida'),
  pior: quando('pior caso'),
  tchau: quando('a biela resolve'),
  sair: quando('sair pra passear'),
  fora: quando('fora do motor'),
  entao: quando('Então'),
  trocado: quando('óleo trocado'),
  barulho: quando('barulho estranho'),
  mecanico: quando('mecânico'),
  precisa: quando('Precisa'),
  bielaCta: quando('Precisa de biela'),
  bronzCta: quando('bronzina ou'),
  peca: quando('qualquer peça'),
  carroCta: quando('seu carro'),
  chama: quando('Chama'),
};
const XA = 6; // onde fica a biela gigante da anatomia
const C = {gancho: 0, oque: T.afinal - 0.15, sobe: T.sobe - 0.2, anat: T.pe - 0.4, rapido: T.pesado - 0.2, pane: T.oleo - 0.2, volta: T.entao - 0.2, mapa: T.precisa};

// ---------- O ângulo do virabrequim (rad) = integral da velocidade ----------
const W_CHAVES: [number, number][] = [
  [0, 0],
  [C.sobe, 0],
  [C.sobe + 0.6, 2.1],
  [C.anat, 2.1],
  [C.anat + 0.6, 0.8],
  [C.rapido, 0.8],
  [T.mil, 19],
  [T.combust + 0.6, 19],
  [T.oleo + 0.4, 4.2],
  [C.volta + 0.6, 2.6],
  [FIM, 2.6],
];
const CUM = W_CHAVES.reduce<number[]>((acc, [tk, wk], i) => {
  if (i === 0) return [0];
  const [t0, w0] = W_CHAVES[i - 1];
  acc.push(acc[i - 1] + ((w0 + wk) / 2) * (tk - t0));
  return acc;
}, []);
const angulo = (t: number) => {
  for (let i = 1; i < W_CHAVES.length; i++) {
    const [t1, w1] = W_CHAVES[i];
    if (t <= t1) {
      const [t0, w0] = W_CHAVES[i - 1];
      const dt = t - t0;
      const a = (w1 - w0) / Math.max(1e-6, t1 - t0);
      return 0.45 + CUM[i - 1] + w0 * dt + (a * dt * dt) / 2;
    }
  }
  return 0.45 + CUM[CUM.length - 1];
};

// tremida do motor nas batidas (deslocamento em x, m)
const BATIDAS = [T.toc1, T.toc2, T.toc3, T.batida, T.batida + 0.25, T.batida + 0.5, T.batida + 0.75];
const tremida = (t: number) => {
  let e = 0;
  BATIDAS.forEach((b) => {
    const d = t - b;
    if (d >= 0 && d < 0.25) e = Math.max(e, 1 - d / 0.25);
  });
  return 0.035 * e * Math.sin(t * 70);
};

// a biela sai voando (T.sair) e volta caindo (T.entao)
const voo = (t: number) => {
  if (t >= T.sair && t < C.volta + 0.2) {
    const p = Math.pow(rampa(t, T.sair, T.sair + 1.2, (x) => x), 2);
    return {dx: 2.6 * p, dy: 5.5 * p, dz: 0.8 * p, gira: -7 * p, solto: true};
  }
  if (t >= C.volta + 0.2) {
    const p = mola(Math.min(1, Math.max(0, (t - C.volta - 0.2) / 0.6)));
    return {dx: 0, dy: 5 * (1 - p), dz: 0, gira: 0, solto: false};
  }
  return {dx: 0, dy: 0, dz: 0, gira: 0, solto: false};
};
const thBiela = (t: number) => (t >= T.sair && t < C.volta + 0.2 ? angulo(T.sair) : angulo(t));

const olharEm = (t: number): Olhar => {
  if (t < C.oque - 0.1) return 'medo';
  if (t >= T.oleo && t < T.tchau) return 'medo';
  if (t >= T.tchau && t < C.volta + 0.2) return 'tchau';
  if (t >= C.volta) return 'feliz';
  return 'ok';
};

// ---------- Câmera ----------
// sobe negativo: o motor fica um pouco mais baixo, longe do título
const enq = (a: V3, l: number, h: number, d: V3) => enquadrar(a, l * 0.9, h * 0.86, d, 1.1, 30, -70);
const cGancho = enq([0, 1.95, 0], 2.5, 3.4, [0.32, 0.2, 1]);
const cGancho2 = enq([0, 1.9, 0], 2.7, 3.6, [0.18, 0.22, 1]);
const cOque = enq([0, 1.85, 0], 2.9, 3.7, [-0.32, 0.24, 1]);
const cSobe = enq([0.55, 1.85, 0], 3.6, 3.8, [0.12, 0.2, 1]);
const cAnat = enq([XA, 2.05, 0], 2.4, 3.9, [0.18, 0.12, 1]);
const cAnat2 = enq([XA, 1.95, 0], 2.6, 3.9, [-0.16, 0.14, 1]);
const cRapido = enq([0, 1.85, 0], 2.8, 3.7, [-0.28, 0.22, 1]);
const cTodos = enq([0, 1.5, 0.4], 6.8, 4.0, [0, 0.28, 1]);
const cPane = enq([0, 1.55, 0], 2.4, 3.0, [0.28, 0.18, 1]);
const cVoo = enq([0.7, 2.6, 0], 3.6, 4.6, [0.2, 0.18, 1]);
const cVolta = enq([0, 2.2, 0], 2.9, 4.4, [0.22, 0.24, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, cGancho],
    [C.oque - 0.4, cGancho2],
    [C.oque + 0.8, cOque],
    [C.sobe + 0.8, cSobe],
    [C.anat - 0.1, cSobe],
    [C.anat + 0.9, cAnat],
    [C.rapido - 0.6, cAnat2],
    [C.rapido + 0.6, cRapido],
    [T.carro - 0.2, cRapido],
    [T.carro + 0.6, cTodos],
    [C.pane - 0.2, cTodos],
    [C.pane + 0.7, cPane],
    [T.sair, cPane],
    [T.sair + 0.9, cVoo],
    [C.volta, cVoo],
    [C.volta + 0.9, cVolta],
    [FIM, cVolta],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.06, grua: 0.02});
};

// pontos do mundo para rótulos
const posBielaMotor = (t: number): V3 => {
  const g = geoMotor(thBiela(t));
  const v = voo(t);
  return [g.px + v.dx + tremida(t), g.py + v.dy + MOTOR.L * 0.55, 0.1 + v.dz];
};
const BIELA_GRANDE = {base: [XA, 0.78, 0] as V3, k: 2.2};
const naGrande = (x: number, y: number, z = 0.18): V3 => [BIELA_GRANDE.base[0] + x * BIELA_GRANDE.k, BIELA_GRANDE.base[1] + y * BIELA_GRANDE.k, z * BIELA_GRANDE.k];

// ---------- Mundo 3D ----------
const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const th = angulo(t);
  const gb = geoMotor(thBiela(t));
  const gp = geoMotor(thBiela(t));
  const v = voo(t);
  const dx = tremida(t);
  const gasta = rampa(t, T.gasta, T.gasta + 0.6) * (1 - rampa(t, C.volta, C.volta + 0.6));
  const racha = rampa(t, T.sair + 0.15, T.sair + 0.5) * (1 - rampa(t, C.volta + 0.3, C.volta + 0.8));
  // anatomia
  const kG = entra(t, C.anat + 0.2, 0.6);
  const capa = 0.12 * rampa(t, T.capa, T.capa + 0.4) * (1 - rampa(t, T.bronz + 0.6, T.bronz + 1.0));
  const maromba = rampa(t, T.maromba - 0.1, T.maromba + 0.3) * (1 - rampa(t, T.cabeca, T.cabeca + 0.4));
  const pula = maromba * Math.abs(Math.sin((t - T.maromba) * 7)) * 0.08;
  // carro: todo carro a combustão tem biela
  const kCM = entra(t, T.carro, 0.5) * sumir(t, C.pane, 0.5);
  // óleo
  const kGalao = entra(t, T.trocado - 0.3, 0.5) * sumir(t, T.barulho + 0.3, 0.5);
  const pinga = rampa(t, T.trocado + 0.2, T.barulho, (x) => x);
  return (
    <>
      <Particulas t={t} centro={[2.5, 2.4, -1]} raio={10} n={60} opacidade={0.3} />
      <group position={[dx, 0, 0]}>
        <Bloco tema={tema} racha={racha} />
        <Virabrequim tema={tema} th={th} />
        <group position={[0, gp.pinoY, 0]}>
          <Pistao tema={tema} />
        </group>
        <group position={[gb.px + v.dx, gb.py + v.dy, v.dz]} rotation={[0, 0, gb.giroBiela + v.gira]}>
          <Biela tema={tema} olhar={olharEm(t)} mira={[Math.sin(t * 1.3) * 0.6, 0.2]} gasta={gasta} bronz={0.6 * gasta} suor={rampa(t, T.mil, T.mil + 0.4) * (1 - rampa(t, T.combust + 0.5, T.combust + 0.9)) + (t < C.oque ? 1 : 0)} />
        </group>
      </group>
      {/* biela gigante da anatomia */}
      {kG > 0.02 ? (
        <group position={[BIELA_GRANDE.base[0], BIELA_GRANDE.base[1] + pula, 0]} scale={BIELA_GRANDE.k * kG}>
          <Biela
            tema={tema}
            olhar={t >= T.maromba ? 'feliz' : 'ok'}
            mira={[0, 0.3]}
            pino={t >= T.pino}
            vira={t >= T.vira2}
            capa={capa}
            paraf={rampa(t, T.paraf, T.paraf + 0.4)}
            bronz={rampa(t, T.bronz - 0.1, T.bronz + 0.4)}
            maromba={maromba}
          />
          <Haltere tema={tema} pos={[-0.32, MOTOR.L * 0.5 + 0.12 * Math.sin((t - T.maromba) * 7), 0.12]} k={0.4 * entra(t, T.maromba - 0.1) * sumir(t, T.cabeca, 0.4)} rot={Math.PI / 2} />
          <Haltere tema={tema} pos={[0.32, MOTOR.L * 0.5 - 0.12 * Math.sin((t - T.maromba) * 7), 0.12]} k={0.4 * entra(t, T.maromba - 0.1) * sumir(t, T.cabeca, 0.4)} rot={Math.PI / 2} />
        </group>
      ) : null}
      <Caixa args={[1.6, 0.28, 1.0]} raio={0.05} cor={tema.objetoEscuro} position={[XA, 0.14, 0]} />
      {/* carro e moto: todo motor tem */}
      <Carro tema={tema} pos={[2.4, 0, 0.6]} rotY={-0.5} escala={1.15 * kCM} cor={tema.objetoClaro} />
      {/* galão de óleo pingando no cabeçote */}
      <Galao tema={tema} pos={[-0.7, 3.95, 0.3]} k={0.8 * kGalao} inclina={0.9 * rampa(t, T.trocado - 0.2, T.trocado + 0.3)} />
      {kGalao > 0.3
        ? [0, 0.33, 0.66].map((o) => {
            const f = (pinga + o) % 1;
            return <Gota key={o} tema={tema} pos={[-0.38, 3.8 - 0.4 * f, 0.3]} escala={0.5 * (1 - f * 0.4)} cor={tema.areia} />;
          })
        : null}
    </>
  );
};

// ---------- Interface 2D ----------
const Titulo: React.FC<{t: number; a: number; b: number; children: React.ReactNode; top?: number; tam?: number}> = ({t, a, b, children, top = 390, tam = 62}) => {
  const e = interpolate(t, [a, a + 0.3], [0, 1], {...clamp, easing: sai});
  const s = interpolate(t, [b - 0.25, b], [0, 1], clamp);
  const op = e * (1 - s);
  if (op <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.dir + 10, top, textAlign: 'center', opacity: op, transform: `translateY(${(1 - e) * 24}px) scale(${0.96 + 0.04 * e})`}}>
      <div style={{fontFamily: FONTE, fontWeight: 900, fontSize: tam, lineHeight: 1.05, letterSpacing: -1, color: '#FFFFFF', textTransform: 'uppercase', textShadow: '0 6px 0 rgba(5,8,30,0.85)'}}>{children}</div>
    </div>
  );
};
const V: React.FC<{tema: Tema; children: React.ReactNode}> = ({tema, children}) => <span style={{color: tema.acento}}>{children}</span>;

const Balao: React.FC<{tema: Tema; x: number; y: number; texto: string; k: number; cor?: string}> = ({tema, x, y, texto, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-10%, -100%) scale(${k})`, transformOrigin: '10% 100%'}}>
      <div style={{background: '#FFFFFF', borderRadius: 26, padding: '14px 28px', border: `5px solid ${tema.tinta}`, fontFamily: FONTE, fontWeight: 900, fontSize: 44, color: cor ?? tema.acento, whiteSpace: 'nowrap'}}>{texto}</div>
      <div style={{position: 'absolute', left: 30, bottom: -26, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `28px solid ${tema.tinta}`}} />
    </div>
  );

const Estalo: React.FC<{x: number; y: number; texto: string; k: number; rot: number; cor: string}> = ({x, y, texto, k, rot, cor}) =>
  k <= 0.01 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k})`, fontFamily: FONTE, fontWeight: 900, fontSize: 84, color: cor, WebkitTextStroke: '10px #05081E', paintOrder: 'stroke fill'}}>{texto}</div>
  );

// perna no pedal: a mesma conta da biela (coxa e canela = biela, pedal = virabrequim)
const Pedal: React.FC<{tema: Tema; th: number; k: number}> = ({tema, th, k}) => {
  if (k <= 0.01) return null;
  const s = Math.sin(th);
  const c = Math.cos(th);
  const fx = 34 * s;
  const fy = 50 - 34 * c;
  const ky = 50 - (34 * c + Math.sqrt(95 * 95 - 34 * 34 * s * s));
  return (
    <div style={{position: 'absolute', left: 700, top: 560, width: 300, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, textAlign: 'center'}}>
      <svg width={300} height={300} viewBox="-150 -150 300 300">
        <circle r={140} fill="#F3EFE6" stroke={tema.acento} strokeWidth={8} />
        <rect x={-96} y={-112} width={72} height={20} rx={10} fill="#222" />
        <circle cx={0} cy={50} r={36} fill="none" stroke="#333" strokeWidth={6} />
        <line x1={-60} y1={-95} x2={0} y2={ky} stroke="#2F4FB8" strokeWidth={26} strokeLinecap="round" />
        <line x1={0} y1={ky} x2={fx} y2={fy} stroke="#2F4FB8" strokeWidth={20} strokeLinecap="round" />
        <line x1={0} y1={50} x2={fx} y2={fy} stroke="#222" strokeWidth={7} strokeLinecap="round" />
        <ellipse cx={fx} cy={fy} rx={22} ry={10} fill={tema.acento} />
      </svg>
      <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 30, color: '#FFFFFF', marginTop: 6}}>= PERNA NO PEDAL</div>
    </div>
  );
};

const Check: React.FC<{tema: Tema; texto: React.ReactNode; k: number}> = ({tema, texto, k}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14, opacity: k, transform: `translateX(${(1 - k) * -40}px)`}}>
    <div style={{width: 56, height: 56, borderRadius: 28, background: '#2FB36B', color: '#05081E', fontFamily: FONTE, fontWeight: 900, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
    <div style={{fontFamily: FONTE, fontWeight: 900, fontSize: 52, color: '#FFFFFF', textTransform: 'uppercase'}}>{texto}</div>
  </div>
);

const Cabecalho: React.FC<{tema: Tema; op: number}> = ({tema, op}) =>
  op <= 0.01 ? null : (
    <div style={{position: 'absolute', top: CABECALHO.marca - 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '6px 22px 6px 8px', borderRadius: 40, background: 'rgba(10,16,51,0.7)', border: `2px solid ${tema.acento}`}}>
        <LogoTinho tam={56} />
        <div style={{fontFamily: FONTE, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: '#FFFFFF'}}>TINHO AUTO PEÇAS</div>
      </div>
    </div>
  );

const Interface: React.FC<{t: number; tema: Tema; cam: Cam}> = ({t, tema, cam}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const rosto = pj(posBielaMotor(t));
  const vezes = Math.round(50 * interpolate(t, [T.vezes, T.vezes + 0.8], [0, 1], {...clamp, easing: sai}));
  const ap = (a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b - 0.3, b));
  return (
    <>
      {/* títulos */}
      <Titulo t={t} a={0} b={T.socorro - 0.3}>
        TOC! TOC! TOC!
      </Titulo>
      <Titulo t={t} a={T.socorro - 0.3} b={C.oque}>
        A BIELA PEDE <V tema={tema}>SOCORRO!</V>
      </Titulo>
      <Titulo t={t} a={C.oque} b={C.sobe}>
        O QUE É A <V tema={tema}>BIELA</V>?
      </Titulo>
      <Titulo t={t} a={C.sobe} b={T.giro - 0.05}>
        O PISTÃO SÓ <V tema={tema}>SOBE E DESCE</V>
      </Titulo>
      <Titulo t={t} a={T.giro - 0.05} b={C.anat}>
        A BIELA VIRA ISSO EM <V tema={tema}>GIRO</V>
      </Titulo>
      <Titulo t={t} a={C.anat} b={C.rapido}>
        ANATOMIA DA <V tema={tema}>BIELA</V>
      </Titulo>
      <Titulo t={t} a={T.carro} b={C.pane}>
        <V tema={tema}>TODO CARRO</V> A COMBUSTÃO TEM
      </Titulo>
      <Titulo t={t} a={C.pane} b={T.batida}>
        <V tema={tema}>SEM ÓLEO</V>, A BRONZINA GASTA
      </Titulo>
      <Titulo t={t} a={T.batida} b={T.fora - 0.05}>
        <V tema={tema}>BATIDA</V> DE BIELA!
      </Titulo>
      <Titulo t={t} a={T.fora - 0.05} b={C.volta}>
        FORA DO <V tema={tema}>MOTOR</V>!
      </Titulo>
      <Titulo t={t} a={T.bielaCta - 0.4} b={T.chama}>
        PRECISA DE <V tema={tema}>PEÇA</V>?
      </Titulo>
      {/* contadores */}
      {t >= C.rapido && t < T.carro ? <Contador tema={tema} valor={t < T.vezes ? '3.000' : `${vezes}x`} rotulo={t < T.vezes ? 'GIROS POR MINUTO' : 'VAI E VOLTA POR SEGUNDO'} k={entra(t, T.mil - 0.15) * sumir(t, T.carro - 0.1, 0.3)} y={400} destaque={t >= T.vezes} /> : null}
      {/* checklist */}
      {t >= C.volta && t < C.mapa ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 390, opacity: 1 - rampa(t, C.mapa - 0.3, C.mapa)}}>
          <Check tema={tema} texto="Óleo em dia" k={rampa(t, T.trocado - 0.2, T.trocado + 0.3)} />
          <Check tema={tema} texto={<>Barulho? <V tema={tema}>Mecânico!</V></>} k={rampa(t, T.barulho - 0.2, T.barulho + 0.3)} />
        </div>
      ) : null}
      {/* gancho: TOC! e SOCORRO */}
      <Estalo x={210} y={760} texto="TOC!" k={entra(t, T.toc1, 0.3) * sumir(t, T.visita, 0.4)} rot={-12} cor={tema.branco} />
      <Estalo x={860} y={900} texto="TOC!" k={entra(t, T.toc2, 0.3) * sumir(t, T.visita, 0.4)} rot={9} cor={tema.branco} />
      <Estalo x={220} y={1080} texto="TOC!" k={entra(t, T.toc3, 0.3) * sumir(t, T.visita, 0.4)} rot={-6} cor={tema.branco} />
      <Balao tema={tema} x={rosto.x + 60} y={rosto.y - 60} texto="SOCORRO!" k={entra(t, T.socorro + 0.3, 0.35) * sumir(t, C.oque - 0.1, 0.3)} />
      {/* o que é: rótulos */}
      <Etiqueta tema={tema} x={70} y={560} alvo={pj(posBielaMotor(t))} titulo="Biela" sub="A PEÇA DO VÍDEO" aparece={ap(T.oque, C.sobe)} destaque />
      <Etiqueta tema={tema} x={640} y={520} alvo={pj([0.25, geoMotor(angulo(t)).pinoY + 0.2, 0.42])} titulo="Pistão" aparece={ap(T.pistao, C.sobe)} largura={330} />
      <Etiqueta tema={tema} x={600} y={1250} alvo={pj([0.25, 0.95, 0.35])} titulo="Virabrequim" aparece={ap(T.vira, C.sobe)} largura={380} />
      {/* sobe e desce + pedal */}
      <Pedal tema={tema} th={angulo(t)} k={rampa(t, T.ciclista - 0.1, T.ciclista + 0.3) * (1 - rampa(t, C.anat - 0.3, C.anat))} />
      {/* anatomia */}
      <Etiqueta tema={tema} x={640} y={560} alvo={pj(naGrande(0.13, MOTOR.L))} titulo="Pé" aparece={ap(T.pe, C.rapido - 0.5)} destaque largura={300} />
      <Etiqueta tema={tema} x={70} y={520} alvo={pj(naGrande(0, MOTOR.L, 0.1))} titulo="Pino" aparece={ap(T.pino, C.rapido - 0.5)} largura={280} />
      <Etiqueta tema={tema} x={680} y={820} alvo={pj(naGrande(0.08, MOTOR.L * 0.45))} titulo="Corpo" aparece={ap(T.corpo, C.rapido - 0.5)} destaque largura={300} />
      <Etiqueta tema={tema} x={70} y={980} alvo={pj(naGrande(-0.18, 0.12))} titulo="Cabeça" aparece={ap(T.cabeca, C.rapido - 0.5)} destaque largura={300} />
      <Etiqueta tema={tema} x={700} y={1180} alvo={pj(naGrande(0.1, -0.22))} titulo="Capa" aparece={ap(T.capa, C.rapido - 0.5)} largura={280} />
      <Etiqueta tema={tema} x={680} y={1020} alvo={pj(naGrande(0.23, 0.0, 0.1))} titulo="Parafusos" aparece={ap(T.paraf, C.rapido - 0.5)} largura={330} />
      <Etiqueta tema={tema} x={70} y={1180} alvo={pj(naGrande(-0.1, -0.05, 0.1))} titulo="Bronzinas" aparece={ap(T.bronz, C.rapido - 0.5)} largura={330} />
      {/* pane */}
      <Estalo x={220} y={900} texto="TÁ!" k={entra(t, T.batida, 0.25) * sumir(t, T.pior, 0.3)} rot={-10} cor={tema.acento} />
      <Estalo x={850} y={1020} texto="TÁ!" k={entra(t, T.batida + 0.25, 0.25) * sumir(t, T.pior, 0.3)} rot={8} cor={tema.acento} />
      <Balao tema={tema} x={Math.min(760, rosto.x + 50)} y={Math.max(560, rosto.y - 70)} texto="TCHAU!" cor={tema.tinta} k={entra(t, T.tchau, 0.35) * sumir(t, T.sair + 0.6, 0.3)} />
    </>
  );
};

// ---------- Fim: Kit Mapas (Nova Iguaçu) + logo ----------
const Fecho: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const kChips = (a: number) => entra(t, a, 0.35) * sumir(t, T.chama - 0.1, 0.3);
  const kLogo = entra(t, T.chama, 0.6);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.85) 0%, rgba(10,16,51,0.35) 36%, rgba(10,16,51,0) 50%, rgba(10,16,51,0) 72%, rgba(10,16,51,0.7) 100%)'}} />
      <div style={{position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[
          ['BIELA', T.bielaCta],
          ['BRONZINA', T.bronzCta],
          ['E MUITO MAIS', T.peca],
        ].map(([txt, a]) => {
          const k = kChips(a as number);
          return k <= 0.01 ? null : (
            <div key={txt as string} style={{transform: `scale(${k})`, background: tema.acento, color: '#FFFFFF', fontFamily: FONTE, fontWeight: 900, fontSize: 40, padding: '14px 26px', borderRadius: 18}}>
              {txt}
            </div>
          );
        })}
      </div>
      {kLogo > 0.01 ? (
        <div style={{position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${kLogo})`}}>
          <div style={{borderRadius: '50%', boxShadow: `0 0 60px rgba(227,38,46,0.55), 0 18px 40px rgba(0,0,0,0.6)`}}>
            <LogoTinho tam={470} />
          </div>
          <div style={{marginTop: 22, fontFamily: FONTE, fontWeight: 800, fontSize: 38, color: '#FFFFFF', background: 'rgba(10,16,51,0.8)', padding: '8px 26px', borderRadius: 14, opacity: rampa(t, T.chama + 0.6, T.chama + 1.0)}}>
            Peças para o seu carro
          </div>
        </div>
      ) : null}
    </>
  );
};

const TrechoMapa: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/nova-iguacu.mp4`)} muted style={{width: W, height: H}} endAt={dur} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: T.toc1, f: 'baque', v: 0.3},
  {t: T.toc2, f: 'baque', v: 0.3},
  {t: T.toc3, f: 'baque', v: 0.3},
  {t: T.socorro + 0.3, f: 'pop', v: 0.2},
  {t: C.oque, f: 'whoosh', v: 0.18},
  {t: T.oque, f: 'pop', v: 0.18},
  {t: T.pistao, f: 'tique', v: 0.2},
  {t: T.vira, f: 'tique', v: 0.2},
  {t: C.sobe, f: 'whoosh', v: 0.16},
  {t: T.ciclista, f: 'pop', v: 0.18},
  {t: C.anat, f: 'whoosh', v: 0.2},
  {t: T.pe, f: 'pop', v: 0.16},
  {t: T.pino, f: 'tique', v: 0.18},
  {t: T.corpo, f: 'pop', v: 0.16},
  {t: T.maromba, f: 'baque', v: 0.2},
  {t: T.cabeca, f: 'pop', v: 0.16},
  {t: T.capa, f: 'tique', v: 0.18},
  {t: T.paraf, f: 'tique', v: 0.18},
  {t: T.bronz, f: 'ding', v: 0.18},
  {t: C.rapido, f: 'whoosh', v: 0.18},
  {t: T.mil - 0.3, f: 'subida', v: 0.18},
  {t: T.vezes, f: 'bip', v: 0.14},
  {t: T.carro, f: 'pop', v: 0.18},
  {t: C.pane, f: 'whoosh', v: 0.16},
  {t: T.batida, f: 'impacto', v: 0.3},
  {t: T.batida + 0.25, f: 'baque', v: 0.3},
  {t: T.batida + 0.5, f: 'baque', v: 0.26},
  {t: T.sair, f: 'whoosh', v: 0.28},
  {t: T.fora, f: 'impacto', v: 0.22},
  {t: C.volta + 0.5, f: 'baque', v: 0.24},
  {t: T.trocado, f: 'ding', v: 0.18},
  {t: T.barulho, f: 'tique', v: 0.2},
  {t: C.mapa, f: 'whoosh', v: 0.2},
  {t: T.bielaCta, f: 'pop', v: 0.18},
  {t: T.bronzCta, f: 'pop', v: 0.18},
  {t: T.peca, f: 'pop', v: 0.18},
  {t: T.chama - 1.6, f: 'subida', v: 0.2},
  {t: T.chama, f: 'impacto', v: 0.3},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [0.3, T.toc3 + 0.4, T.socorro + 0.7, T.oque + 0.6, T.vira + 0.6, T.subir + 0.3, T.ciclista + 0.8, T.pe + 0.5, T.maromba + 0.4, T.bronz + 0.5, T.mil + 0.4, T.vezes + 0.9, T.carro + 0.9, T.gasta + 0.5, T.batida + 0.3, T.tchau + 0.4, T.sair + 0.6, T.fora + 0.4, T.trocado + 0.4, T.barulho + 0.6, T.bronzCta + 0.3, T.chama + 0.9, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const BielaTinho: React.FC<Props> = ({guia, semInterface, estilo = 'tinho', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camEm(t);
  const alvoFoco: V3 = t >= C.anat && t < C.rapido ? [XA, 2, 0] : [0, 1.9, 0];
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={14} centro={[3, 0, 0]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema foco={focarEm(cam, alvoFoco, 2.6, 3.5)} raioAO={0.4} vinheta={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  const mapaDe = Math.round(C.mapa * FPS);
  const opCab = 1 - rampa(t, T.chama - 0.3, T.chama);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      {t < C.mapa + 0.6 ? mundo : null}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.75) 0%, rgba(10,16,51,0) 30%, rgba(10,16,51,0) 75%, rgba(10,16,51,0.55) 100%)'}} />
      <Sequence from={mapaDe} durationInFrames={QUADROS - mapaDe} layout="none">
        <TrechoMapa dur={QUADROS - mapaDe} />
      </Sequence>
      <Interface t={t} tema={tema} cam={cam} />
      {t >= C.mapa ? <Fecho t={t} tema={tema} /> : null}
      <Cabecalho tema={tema} op={opCab * rampa(t, 0, 0.4)} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} tam={54} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const CapaBielaTinho: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'tinho', fundo = `${P}/capa/fundo-limpo.jpg`}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: 380, width: W, height: H}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,51,0.95) 0%, rgba(10,16,51,0.6) 30%, rgba(10,16,51,0) 50%, rgba(10,16,51,0.75) 100%)'}} />
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <LogoTinho tam={170} />
      </div>
      <div style={{position: 'absolute', top: 490, left: SEGURO.esq, right: W - SEGURO.dir, textAlign: 'center', fontFamily: FONTE, fontWeight: 900, fontSize: 108, lineHeight: 1.0, color: '#FFFFFF', textShadow: '0 8px 0 rgba(5,8,30,0.9)'}}>
        VOCÊ SABE<br />O QUE É<br />A BIELA<br /><span style={{color: tema.acento}}>DO MOTOR?</span>
      </div>
    </AbsoluteFill>
  );
};
