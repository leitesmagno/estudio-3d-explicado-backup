import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Fosco, Palco, Particulas, cinematizar, enquadrar, focarEm, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Etiqueta} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, rampa, sumir} from '../../base/tempo';
import type {Tema} from '../../base/tema';
import {temaPorId} from '../../estilo';
import {Carro, Gota} from '../../pecas';
import {Balao, Cabecalho, CapaSerie, Check, Estalo, Fecho, Lista, Titulo, TrechoMapa, V} from '../tinhocomum/comum';
import {Mola, Olhos, Roda, type Olhar} from '../tinhocomum/pecas3d';
import {PALAVRAS} from './palavras';

// 158. amortecedor tinho autopeças: 2º vídeo da série de peças da Tinho Auto Peças (Nova Iguaçu/RJ).
// Estúdio 3D: carro pulando como canguru, um canto de suspensão gigante (roda, mola e amortecedor com olhos),
// a mola sozinha balançando, o corte do amortecedor (óleo e pistão com furinhos), o vazamento e o teste do capô.
// Kit Mapas: Brasil → Nova Iguaçu no fecho, com a logo.

export const FPS = 30;
const AUDIO_SEG = 44.58;
export const QUADROS = Math.round((AUDIO_SEG + 1.9) * FPS);
const FIM = QUADROS / FPS;
const W = 1080;
const H = 1920;
const P = '158. amortecedor tinho autopeças';
const PI = Math.PI;

const quando = criarQuando(PALAVRAS);
const T = {
  canguru: quando('canguru'),
  aposenta: quando('aposentadoria'),
  oque: quando('Mas o que'),
  mola1: quando('da mola'),
  roda: quando('cada roda'),
  molaSegura: quando('A mola segura'),
  buraco: quando('engole o buraco'),
  sozinha: quando('sozinha'),
  cama: quando('cama elástica'),
  freia: quando('freia'),
  dentro: quando('Por dentro'),
  tubo: quando('tubo cheio'),
  haste: quando('uma haste'),
  pistao: quando('pistão cheio'),
  roda2: quando('Quando a roda'),
  passar: quando('passar pelos'),
  segura: quando('isso segura'),
  pneu: quando('o pneu continua'),
  freio: quando('freio e curva'),
  gasta: quando('quando ele gasta'),
  balanca: quando('carro balança'),
  torto: quando('gasta torto'),
  demora: quando('freio demora'),
  escorre: quando('óleo escorrendo'),
  vaza: quando('vazamento'),
  teste: quando('Teste rápido'),
  aperte: quando('aperte a frente'),
  solte: quando('e solte'),
  quica: quando('ficar quicando'),
  mecanico: quando('mecânico'),
  precisa: quando('Precisa'),
  ctaAm: quando('de amortecedor'),
  ctaMola: quando('mola ou'),
  peca: quando('qualquer peça'),
  chama: quando('Chama'),
};
const C = {gancho: 0, oque: T.oque - 0.15, mola: T.molaSegura - 0.2, dentro: T.dentro - 0.2, pneu: T.pneu - 0.2, gasto: T.gasta - 0.2, teste: T.teste - 0.2, mapa: T.precisa};

// ---------- Movimento da suspensão ----------
const XC = -7; // carro do gancho e do teste
const RODA_Y = 0.62;
const CHASSI_Y = 3.15;
const lomba = (t: number, a: number, d = 0.7) => {
  const u = (t - a) / d;
  return u <= 0 || u >= 1 ? 0 : Math.sin(u * PI);
};
// a roda sobe no buraco (lombada) e o chassi responde
const rodaSobe = (t: number) => 0.38 * (lomba(t, T.buraco - 0.1) + lomba(t, T.roda2, 0.8) + lomba(t, T.balanca - 0.2, 0.6) * 0.8);
const chassi = (t: number) => {
  // sem amortecedor (cama elástica): balança muito; com ele: um balanço só
  const solto = t >= T.buraco + 0.3 && t < T.freia + 0.4 ? 0.3 * Math.sin((t - T.buraco - 0.3) * 2 * PI * 1.6) * (1 - 0.25 * rampa(t, T.cama, T.freia)) : 0;
  const freado = t >= T.freia + 0.4 ? 0.3 * Math.sin((t - T.buraco - 0.3) * 2 * PI * 1.6) * Math.exp(-(t - T.freia - 0.4) * 4) * (t < C.dentro ? 1 : 0) : 0;
  const dentro = t >= C.dentro && t < C.pneu ? 0.12 * Math.sin((t - C.dentro) * 2 * PI * 0.55) : 0;
  const gasto = t >= T.balanca && t < C.teste ? 0.22 * Math.sin((t - T.balanca) * 2 * PI * 1.4) : 0;
  return CHASSI_Y + solto + freado + dentro + gasto + 0.35 * rodaSobe(t);
};
// carro do teste: aperta, solta e quica
const quicaCarro = (t: number) => {
  if (t < C.gancho + 4.4) return Math.abs(Math.sin(t * 5.5)) * 0.9 * (1 - rampa(t, 3.6, 4.4));
  if (t >= T.aperte && t < T.solte) return -0.12 * rampa(t, T.aperte, T.aperte + 0.4);
  if (t >= T.solte) return -0.12 * Math.cos((t - T.solte) * 2 * PI * 1.8) * Math.exp(-(t - T.solte) * 0.6);
  return 0;
};

const olharEm = (t: number): Olhar => {
  if (t < C.oque) return 'sono';
  if (t >= T.sozinha && t < T.freia) return 'medo';
  if (t >= C.gasto && t < C.teste) return 'medo';
  if (t >= T.segura || (t >= T.freia && t < C.dentro)) return 'feliz';
  return 'ok';
};

// ---------- Câmera ----------
const enq = (a: V3, l: number, h: number, d: V3) => enquadrar(a, l * 0.9, h * 0.86, d, 1.1, 30, -70);
const cGancho = enq([XC, 0.9, 0], 3.2, 3.0, [0.45, 0.22, 1]);
const cOque = enq([0, 1.9, 0], 2.6, 3.9, [-0.35, 0.18, 1]);
const cMola = enq([0, 1.9, 0], 2.8, 4.0, [0.3, 0.16, 1]);
const cDentro = enq([0, 2.0, 0], 1.3, 2.6, [0.15, 0.1, 1]);
const cPneu = enq([0, 1.4, 0], 3.2, 3.6, [-0.4, 0.2, 1]);
const cGasto = enq([0, 1.8, 0], 2.6, 3.8, [0.38, 0.18, 1]);
const cTeste = enq([XC, 0.9, 0], 3.0, 2.8, [-0.5, 0.25, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, cGancho],
    [C.oque - 0.1, cGancho],
    [C.oque + 0.9, cOque],
    [C.mola + 0.6, cMola],
    [C.dentro - 0.1, cMola],
    [C.dentro + 0.8, cDentro],
    [C.pneu - 0.1, cDentro],
    [C.pneu + 0.8, cPneu],
    [C.gasto + 0.7, cGasto],
    [C.teste - 0.1, cGasto],
    [C.teste + 0.9, cTeste],
    [FIM, cTeste],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.06, grua: 0.02});
};

// ---------- Mundo 3D ----------
const Suspensao: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const yr = RODA_Y + rodaSobe(t);
  const yc = chassi(t);
  const baseCorpo = yr + 0.12;
  const topoHaste = yc - 0.2;
  const corte = rampa(t, C.dentro + 0.3, C.dentro + 0.9) * (1 - rampa(t, C.pneu, C.pneu + 0.5));
  const pistaoY = topoHaste - 1.05; // ponta da haste dentro do tubo
  const vaza = rampa(t, T.escorre - 0.2, T.escorre + 0.3) * (1 - rampa(t, C.teste, C.teste + 0.4));
  const giroRoda = t * 1.2;
  const fluxo = (t * 1.6) % 1;
  return (
    <group>
      {/* estrada com lombada que passa por baixo */}
      <Caixa args={[9, 0.1, 2.2]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.05, 0]} />
      {[-3.5, -1.5, 0.5, 2.5].map((x) => (
        <Caixa key={x} args={[0.9, 0.012, 0.08]} raio={0.004} cor={tema.branco} position={[x, 0.106, 0.75]} />
      ))}
      <Roda tema={tema} pos={[0, yr, 0]} giro={giroRoda} />
      {/* braço da suspensão até a roda */}
      <Caixa args={[0.14, 0.14, 0.5]} raio={0.04} cor={tema.objeto} position={[0, yr, -0.32]} />
      {/* chassi (pedaço da carroceria) */}
      <Caixa args={[2.4, 0.3, 1.4]} raio={0.08} cor={tema.acento} position={[0, yc, -0.1]} />
      {/* corpo do amortecedor (tubo) */}
      <group position={[0, baseCorpo, 0.05]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 1.1, 32]} />
          <Fosco cor={tema.objetoClaro} aspereza={0.45} opacidade={1 - 0.7 * corte} />
        </mesh>
        {corte > 0.02 ? (
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.98, 28]} />
            <Fosco cor={tema.areia} opacidade={0.75 * corte} emissivo={0.15} />
          </mesh>
        ) : null}
        <Olhos tema={tema} pos={[0, 0.62, 0.34]} olhar={olharEm(t)} mira={[Math.sin(t * 1.1) * 0.6, 0.2]} esc={1.5} />
      </group>
      {/* haste e pistão com furinhos */}
      <mesh position={[0, topoHaste - 0.55, 0.05]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
        <Fosco cor={tema.objeto} aspereza={0.3} />
      </mesh>
      {corte > 0.02 ? (
        <group position={[0, pistaoY, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.105, 0.105, 0.06, 28]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <mesh key={k} position={[0.065 * Math.cos((k * PI) / 3), 0, 0.065 * Math.sin((k * PI) / 3)]}>
              <cylinderGeometry args={[0.014, 0.014, 0.065, 8]} />
              <Fosco cor={tema.tinta} />
            </mesh>
          ))}
          {/* óleo passando pelos furinhos */}
          {[0, 0.33, 0.66].map((o) => {
            const f = (fluxo + o) % 1;
            const sinal = Math.sin((t - C.dentro) * 2 * PI * 0.55) > 0 ? 1 : -1;
            return (
              <mesh key={o} position={[0.065, sinal * (f * 0.25 - 0.05), 0.04]}>
                <sphereGeometry args={[0.018, 10, 8]} />
                <Fosco cor={tema.areia} emissivo={0.5} />
              </mesh>
            );
          })}
        </group>
      ) : null}
      {/* mola em volta */}
      {corte < 0.5 ? <Mola pos={[0, baseCorpo + 0.05, 0.05]} alt={topoHaste - baseCorpo - 0.05} cor={tema.acento} raio={0.24} voltas={7} fio={0.032} /> : null}
      {/* vazamento: gotas escuras escorrendo no tubo */}
      {vaza > 0.05
        ? [0, 0.5].map((o) => {
            const f = ((t * 0.8 + o) % 1) * vaza;
            return <Gota key={o} tema={tema} pos={[0.11, baseCorpo + 0.9 - 0.85 * f, 0.15]} escala={0.45} cor={tema.tinta} />;
          })
        : null}
    </group>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => (
  <>
    <Particulas t={t} centro={[-3, 2.4, -1]} raio={10} n={50} opacidade={0.3} />
    <Suspensao t={t} tema={tema} />
    {/* o carro do gancho e do teste, numa estrada curta */}
    <Caixa args={[6, 0.08, 2.6]} raio={0.02} cor={tema.objetoEscuro} position={[XC, 0.04, 0]} />
    <Carro tema={tema} pos={[XC, 0.08 + Math.max(0, quicaCarro(t)), 0]} rotY={0.25} escala={0.95} cor={tema.objetoClaro} quica={t < 4.4 ? 0.3 * Math.sin(t * 11) : quicaCarro(t) < 0 ? quicaCarro(t) * 2 : 0} />
  </>
);

// ---------- Interface 2D ----------
const Interface: React.FC<{t: number; tema: Tema; cam: Cam}> = ({t, tema, cam}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const ap = (a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b - 0.3, b));
  const yr = RODA_Y + rodaSobe(t);
  const yc = chassi(t);
  const olho = pj([0, yr + 0.12 + 0.7, 0.2]);
  const carro = pj([XC + 0.3, 1.4, 0]);
  return (
    <>
      <Titulo t={t} a={0} b={C.oque}>
        PULANDO IGUAL <V tema={tema}>CANGURU</V>?
      </Titulo>
      <Titulo t={t} a={C.oque} b={C.mola}>
        O QUE É O <V tema={tema}>AMORTECEDOR</V>?
      </Titulo>
      <Titulo t={t} a={C.mola} b={T.freia - 0.05}>
        A MOLA SOZINHA VIRA <V tema={tema}>CAMA ELÁSTICA</V>
      </Titulo>
      <Titulo t={t} a={T.freia - 0.05} b={C.dentro}>
        O AMORTECEDOR <V tema={tema}>FREIA O BALANÇO</V>
      </Titulo>
      <Titulo t={t} a={C.dentro} b={C.pneu}>
        POR <V tema={tema}>DENTRO</V> DELE
      </Titulo>
      <Titulo t={t} a={C.pneu} b={C.gasto}>
        PNEU <V tema={tema}>COLADO</V> NO CHÃO
      </Titulo>
      <Titulo t={t} a={C.gasto} b={C.teste}>
        AMORTECEDOR <V tema={tema}>GASTO</V>
      </Titulo>
      <Lista t={t} a={C.teste} b={C.mapa}>
        <Check tema={tema} texto="Aperte e solte" k={rampa(t, T.aperte - 0.2, T.aperte + 0.3)} />
        <Check tema={tema} texto={<>Quicou? <V tema={tema}>Mecânico!</V></>} k={rampa(t, T.quica - 0.2, T.quica + 0.3)} />
      </Lista>
      {/* gancho */}
      <Estalo x={260} y={700} texto="BOING!" k={entra(t, 0.15, 0.3) * sumir(t, C.oque - 0.3, 0.3)} rot={-10} cor={tema.branco} />
      <Estalo x={800} y={860} texto="BOING!" k={entra(t, T.canguru, 0.3) * sumir(t, C.oque - 0.3, 0.3)} rot={8} cor={tema.branco} />
      <Balao tema={tema} x={carro.x + 40} y={carro.y - 120} texto="ZZZ..." cor={tema.tinta} k={entra(t, T.aposenta - 0.2, 0.35) * sumir(t, C.oque, 0.3)} />
      {/* o que é */}
      <Etiqueta tema={tema} x={70} y={600} alvo={pj([0, yr + 0.7, 0.15])} titulo="Amortecedor" sub="A PEÇA DO VÍDEO" aparece={ap(T.oque + 0.5, C.mola)} destaque />
      <Etiqueta tema={tema} x={650} y={760} alvo={pj([0.24, (yr + yc) / 2 + 0.2, 0.1])} titulo="Mola" aparece={ap(T.mola1, C.mola)} largura={300} />
      <Etiqueta tema={tema} x={650} y={1120} alvo={pj([0.4, yr, 0.3])} titulo="Roda" aparece={ap(T.roda, C.mola)} largura={300} />
      <Estalo x={540} y={1260} texto="BURACO!" k={entra(t, T.buraco - 0.1, 0.3) * sumir(t, T.sozinha, 0.3)} rot={-4} cor={tema.acento} tam={64} />
      {/* por dentro */}
      <Etiqueta tema={tema} x={70} y={600} alvo={pj([0.12, yr + 0.6, 0.1])} titulo="Tubo com óleo" aparece={ap(T.tubo, C.pneu)} largura={420} />
      <Etiqueta tema={tema} x={650} y={560} alvo={pj([0.04, yc - 0.6, 0.06])} titulo="Haste" aparece={ap(T.haste, C.pneu)} largura={300} />
      <Etiqueta tema={tema} x={600} y={1180} alvo={pj([0.1, yc - 1.25, 0.06])} titulo="Pistão com furinhos" aparece={ap(T.pistao, C.pneu)} destaque largura={410} />
      {/* gasto */}
      <Etiqueta tema={tema} x={600} y={1150} alvo={pj([0.15, yr + 0.6, 0.15])} titulo="Vazamento" aparece={ap(T.escorre, C.teste)} destaque largura={360} />
      <Estalo x={250} y={760} texto="PNEU TORTO" k={entra(t, T.torto, 0.3) * sumir(t, T.escorre, 0.3)} rot={-6} cor={tema.branco} tam={52} />
      <Estalo x={780} y={880} texto="FREIO LONGO" k={entra(t, T.demora, 0.3) * sumir(t, T.escorre, 0.3)} rot={6} cor={tema.branco} tam={52} />
      {/* teste */}
      <Estalo x={carro.x} y={carro.y - 170} texto="⬇ APERTA" k={entra(t, T.aperte, 0.3) * sumir(t, T.solte, 0.3)} rot={0} cor={tema.branco} tam={56} />
      <Estalo x={carro.x} y={carro.y - 170} texto="BOING BOING" k={entra(t, T.quica, 0.3) * sumir(t, C.mapa, 0.3)} rot={-5} cor={tema.acento} tam={56} />
      <Balao tema={tema} x={olho.x + 50} y={olho.y - 60} texto="SOCORRO!" k={entra(t, T.balanca, 0.35) * sumir(t, T.torto, 0.3)} />
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: 0.15, f: 'baque', v: 0.25},
  {t: 0.6, f: 'baque', v: 0.2},
  {t: T.canguru, f: 'pop', v: 0.2},
  {t: C.oque, f: 'whoosh', v: 0.18},
  {t: T.oque + 0.5, f: 'pop', v: 0.18},
  {t: T.mola1, f: 'tique', v: 0.18},
  {t: T.roda, f: 'tique', v: 0.18},
  {t: T.buraco, f: 'baque', v: 0.28},
  {t: T.cama, f: 'subida', v: 0.14},
  {t: T.freia, f: 'ding', v: 0.18},
  {t: C.dentro, f: 'whoosh', v: 0.18},
  {t: T.tubo, f: 'tique', v: 0.18},
  {t: T.haste, f: 'tique', v: 0.18},
  {t: T.pistao, f: 'pop', v: 0.18},
  {t: C.pneu, f: 'whoosh', v: 0.16},
  {t: T.freio, f: 'ding', v: 0.16},
  {t: C.gasto, f: 'whoosh', v: 0.16},
  {t: T.balanca, f: 'baque', v: 0.22},
  {t: T.torto, f: 'pop', v: 0.16},
  {t: T.demora, f: 'pop', v: 0.16},
  {t: T.escorre, f: 'bip', v: 0.14},
  {t: C.teste, f: 'whoosh', v: 0.16},
  {t: T.aperte, f: 'tique', v: 0.2},
  {t: T.quica, f: 'baque', v: 0.22},
  {t: C.mapa, f: 'whoosh', v: 0.2},
  {t: T.ctaAm, f: 'pop', v: 0.18},
  {t: T.ctaMola, f: 'pop', v: 0.18},
  {t: T.peca, f: 'pop', v: 0.18},
  {t: T.chama - 1.6, f: 'subida', v: 0.2},
  {t: T.chama, f: 'impacto', v: 0.3},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.3, T.aposenta + 0.3, T.roda + 0.6, T.buraco + 0.3, T.cama + 0.4, T.freia + 0.6, T.haste + 0.4, T.pistao + 0.6, T.passar + 0.4, T.freio + 0.4, T.balanca + 0.4, T.demora + 0.3, T.vaza + 0.3, T.aperte + 0.3, T.quica + 0.5, T.ctaMola + 0.3, T.chama + 0.9, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const AmortecedorTinho: React.FC<Props> = ({guia, semInterface, estilo = 'tinho', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camEm(t);
  const alvoFoco: V3 = t < C.oque || t >= C.teste ? [XC, 0.9, 0] : [0, 1.9, 0];
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={14} centro={[-3, 0, 0]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema foco={focarEm(cam, alvoFoco, 2.8, 3.5)} raioAO={0.4} vinheta={0.5} />
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
            ['Amortecedor', T.ctaAm],
            ['Mola', T.ctaMola],
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

export const CapaAmortecedorTinho: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'tinho', fundo = `${P}/capa/fundo-limpo.jpg`}) => (
  <CapaSerie tema={temaPorId(estilo)} fundo={fundo} linhas={['SEU CARRO', 'PULA IGUAL', 'CANGURU?', 'AMORTECEDOR!']} />
);
