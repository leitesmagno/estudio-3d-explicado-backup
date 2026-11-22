import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Fosco, Palco, Particulas, Vapor, cinematizar, enquadrar, focarEm, mistura, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Etiqueta} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, rampa, suave, sumir} from '../../base/tempo';
import {ESCURO, type Tema} from '../../base/tema';
import {temaPorId} from '../../estilo';
import {Gota} from '../../pecas';
import {Cabecalho, CapaSerie, Check, Estalo, Fecho, Lista, Titulo, TrechoMapa, V} from '../tinhocomum/comum';
import {Olhos, Roda, type Olhar} from '../tinhocomum/pecas3d';
import {Biela, Bloco, Pistao, Virabrequim, geoMotor} from '../bielatinho/pecas';
import {PALAVRAS} from './palavras';

// 161. pistão tinho autopeças: 5º vídeo da série de peças da Tinho Auto Peças (Nova Iguaçu/RJ).
// Estúdio 3D: o motor da série com o pistão-personagem; os quatro tempos devagar (admissão com a válvula
// abrindo, compressão, faísca e queima empurrando, escape com fumaça), o empurrão indo pela biela até o
// virabrequim e a roda, o pistão gigante com os anéis, e o motor gasto soltando fumaça azulada. Kit Mapas no fecho.

export const FPS = 30;
const AUDIO_SEG = 44.18;
export const QUADROS = Math.round((AUDIO_SEG + 1.9) * FPS);
const FIM = QUADROS / FPS;
const W = 1080;
const H = 1920;
const P = '161. pistão tinho autopeças';
const PI = Math.PI;

const quando = criarQuando(PALAVRAS);
const T = {
  explosoes: quando('explosões'),
  vezes: quando('várias vezes'),
  pancada: quando('pancada'),
  oPistao: quando('O pistão é'),
  sobe: quando('sobe e desce'),
  cilindro: quando('cilindro do motor'),
  tempos: quando('quatro tempos'),
  primeiro: quando('Primeiro'),
  puxa: quando('puxa ar'),
  segundo: quando('Segundo', 2),
  aperta: quando('aperta essa'),
  terceiro: quando('Terceiro'),
  vela: quando('a vela'),
  faisca: quando('a faísca'),
  queima: quando('mistura queima'),
  empurra: quando('empurra o pistão'),
  quarto: quando('Quarto'),
  fumaca: quando('a fumaça'),
  esse: quando('Esse empurrão'),
  biela: quando('pela biela'),
  vira: quando('o virabrequim'),
  roda: quando('a roda'),
  emVolta: quando('Em volta'),
  aneis: quando('os anéis.'),
  vedam: quando('vedam'),
  raspam: quando('raspam o óleo'),
  queimar: quando('não queimar'),
  gastam: quando('anéis gastam'),
  forca: quando('perde força'),
  azulada: quando('azulada'),
  bebe: quando('beber óleo'),
  porIsso: quando('Por isso'),
  prazo: quando('no prazo'),
  frio: quando('motor frio'),
  precisa: quando('Precisa de pistão'),
  ctaPis: quando('de pistão'),
  ctaAneis: quando('anéis ou'),
  peca: quando('qualquer peça'),
  chama: quando('Chama'),
};
const XA = 6; // pistão gigante dos anéis
const C = {gancho: 0, oque: T.oPistao - 0.2, tempos: T.primeiro - 0.4, empurrao: T.esse - 0.3, aneis: T.emVolta - 0.3, gasto: T.gastam - 0.3, dica: T.porIsso - 0.2, mapa: T.precisa};

// ---------- O ângulo do virabrequim ----------
// fase = ângulo mod 4π: [0, π] admissão, [π, 2π] compressão, [2π, 3π] queima, [3π, 4π] escape.
const BASE = 16 * PI; // no "Primeiro" o pistão está em cima, começando a admissão
const fimEscape = T.quarto + 2.4;
const angulo = (t: number) => {
  if (t < T.primeiro) return (BASE * t) / T.primeiro;
  if (t < T.segundo) return BASE + PI * suave(rampa(t, T.primeiro + 0.2, T.segundo - 0.1));
  if (t < T.faisca) return BASE + PI + PI * suave(rampa(t, T.segundo + 0.5, T.terceiro - 0.1));
  if (t < T.quarto) return BASE + 2 * PI + PI * suave(rampa(t, T.faisca + 0.3, T.quarto - 0.2));
  if (t < fimEscape) return BASE + 3 * PI + PI * suave(rampa(t, T.quarto + 0.3, fimEscape));
  return BASE + 4 * PI + 6 * Math.max(0, t - fimEscape) * rampa(t, fimEscape, fimEscape + 0.8);
};
const fase = (t: number) => ((angulo(t) % (4 * PI)) + 4 * PI) % (4 * PI);
const noTempos = (t: number) => t >= T.primeiro && t < fimEscape;
const valvulaAdm = (t: number) => {
  const f = fase(t);
  return f < PI ? Math.sin(f) : 0;
};
const valvulaEsc = (t: number) => {
  const f = fase(t);
  return f >= 3 * PI ? Math.sin(f - 3 * PI) : 0;
};
const queimaBrilho = (t: number) => {
  const f = fase(t);
  return f >= 2 * PI && f < 3 * PI ? Math.sin(((f - 2 * PI) / PI) * PI * 0.5 + PI * 0.5) * Math.min(1, (f - 2 * PI) / 0.25 + 0.2) : 0;
};
const faisca = (t: number) => (noTempos(t) ? rampa(t, T.faisca - 0.2, T.faisca + 0.1) * (1 - rampa(t, T.faisca + 0.3, T.faisca + 0.8)) : 0);

const olharEm = (t: number): Olhar => {
  if (t < C.oque) return 'medo';
  if (t >= C.gasto && t < C.dica) return 'medo';
  if (t >= T.faisca && t < T.quarto) return 'medo';
  return t >= C.dica ? 'feliz' : 'ok';
};

// ---------- Câmera ----------
const enq = (a: V3, l: number, h: number, d: V3) => enquadrar(a, l * 0.9, h * 0.86, d, 1.1, 30, -70);
const cGancho = enq([0, 2.5, 0], 2.2, 2.8, [0.3, 0.15, 1]);
const cOque = enq([0, 2.0, 0], 2.8, 3.8, [-0.3, 0.2, 1]);
const cTempos = enq([0, 2.55, 0], 1.9, 2.3, [0.18, 0.12, 1]);
const cEmpurrao = enq([0.9, 1.6, 0], 4.2, 3.9, [0.25, 0.22, 1]);
const cAneis = enq([XA, 1.25, 0], 2.4, 2.4, [0.2, 0.3, 1]);
const cGasto = enq([0.3, 2.2, 0], 3.2, 4.0, [-0.3, 0.2, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, cGancho],
    [C.oque - 0.1, cGancho],
    [C.oque + 0.9, cOque],
    [C.tempos - 0.1, cOque],
    [C.tempos + 0.8, cTempos],
    [C.empurrao - 0.1, cTempos],
    [C.empurrao + 0.9, cEmpurrao],
    [C.aneis - 0.1, cEmpurrao],
    [C.aneis + 0.9, cAneis],
    [C.gasto - 0.1, cAneis],
    [C.gasto + 0.9, cGasto],
    [FIM, cGasto],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.06, grua: 0.02});
};

// ---------- Mundo 3D ----------
const CABECOTE_BAIXO = 3.08;
const azul = (tema: Tema) => (tema.festa ?? ESCURO.festa!).azul;

const Mistura: React.FC<{t: number; tema: Tema; topo: number}> = ({t, tema, topo}) => {
  const f = fase(t);
  const alt = Math.max(0.02, CABECOTE_BAIXO - topo);
  let cor = tema.ceuLuz;
  let op = 0;
  let emis = 0;
  if (f < PI) {
    op = 0.3 * Math.min(1, f / 0.6);
    cor = mistura(tema.ceuLuz, tema.areia, 0.35);
  } else if (f < 2 * PI) {
    op = 0.3 + 0.25 * ((f - PI) / PI);
    cor = mistura(tema.ceuLuz, tema.areia, 0.5);
  } else if (f < 3 * PI) {
    const q = queimaBrilho(t);
    op = 0.4 + 0.3 * q;
    cor = mistura(tema.areia, tema.acento, 0.5);
    emis = 0.9 * q;
  } else {
    op = 0.45 * (1 - (f - 3 * PI) / PI);
    cor = tema.objeto;
  }
  if (op < 0.02) return null;
  return (
    <mesh position={[0, topo + alt / 2, 0]}>
      <cylinderGeometry args={[0.41, 0.41, alt, 40]} />
      <Fosco cor={cor} opacidade={op} emissivo={emis} />
    </mesh>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const th = angulo(t);
  const g = geoMotor(th);
  const topo = g.pinoY + 0.37;
  const va = valvulaAdm(t);
  const ve = valvulaEsc(t);
  const fum = (t >= T.quarto - 0.2 && t < fimEscape ? ve : 0) + 0.8 * rampa(t, T.azulada - 0.3, T.azulada + 0.3) * (1 - rampa(t, C.dica, C.dica + 0.5));
  const azulado = rampa(t, T.azulada - 0.3, T.azulada + 0.3) * (1 - rampa(t, C.dica, C.dica + 0.5));
  const empurraBrilho = rampa(t, T.esse - 0.2, T.esse + 0.3) * (1 - rampa(t, C.aneis, C.aneis + 0.4));
  // pistão gigante
  const kG = entra(t, C.aneis + 0.2, 0.6) * sumir(t, C.gasto + 0.4, 0.4);
  const aneisSobem = 1 - rampa(t, T.aneis - 0.3, T.aneis + 0.5);
  const raspa = rampa(t, T.raspam - 0.2, T.raspam + 0.3);
  return (
    <>
      <Particulas t={t} centro={[2.5, 2.4, -1]} raio={10} n={50} opacidade={0.3} />
      <Bloco tema={tema} />
      <Virabrequim tema={tema} th={th} />
      {/* mistura dentro do cilindro */}
      <Mistura t={t} tema={tema} topo={topo} />
      <group position={[0, g.pinoY, 0]}>
        <Pistao tema={tema} />
      </group>
      <Olhos tema={tema} pos={[0, g.pinoY + 0.15, 0.43]} esc={2.0} olhar={olharEm(t)} mira={[Math.sin(t * 1.2) * 0.6, 0.2]} />
      <group position={[g.px, g.py, 0]} rotation={[0, 0, g.giroBiela]}>
        <Biela tema={tema} olhar="ok" gasta={0.6 * empurraBrilho} />
      </group>
      {/* válvulas: admissão (esquerda) e escape (direita) */}
      {[
        [-0.2, va],
        [0.2, ve],
      ].map(([x, k], i) => (
        <group key={i} position={[x, CABECOTE_BAIXO - 0.03 - 0.13 * k, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
            <Fosco cor={i === 0 ? mistura(tema.objetoClaro, azul(tema), 0.4) : mistura(tema.objetoClaro, tema.acento, 0.4)} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 10]} />
            <Fosco cor={tema.objeto} />
          </mesh>
        </group>
      ))}
      {/* vela e faísca */}
      <mesh position={[0, CABECOTE_BAIXO - 0.02, 0.15]}>
        <sphereGeometry args={[0.05 + 0.06 * faisca(t), 16, 12]} />
        <Fosco cor={mistura(tema.branco, tema.areia, 0.5)} emissivo={1.2 * faisca(t)} opacidade={0.3 + 0.7 * faisca(t)} />
      </mesh>
      {/* escapamento */}
      <Caixa args={[0.7, 0.14, 0.14]} raio={0.05} cor={tema.objetoEscuro} position={[1.1, 3.25, 0]} />
      {fum > 0.05 ? <Vapor pos={[1.5, 3.3, 0]} t={t} escala={1.1 * fum} n={6} cor={azulado > 0.3 ? mistura(tema.ceuLuz, azul(tema), 0.5) : tema.objeto} /> : null}
      {/* roda ligada ao virabrequim */}
      <Caixa args={[1.4, 0.08, 0.08]} raio={0.03} cor={tema.objeto} position={[1.6, 1.1, 0.35]} />
      <Roda tema={tema} pos={[2.45, 1.1, 0.35]} giro={th * 0.5} r={0.7} />
      {/* pistão gigante com os anéis */}
      {kG > 0.02 ? (
        <group position={[XA, 0.95, 0]} scale={2.2 * kG}>
          <Pistao tema={tema} />
          {[0.24, 0.29, 0.34].map((y, i) => (
            <mesh key={y} position={[0, y + aneisSobem * (0.35 + i * 0.12), 0]} rotation={[PI / 2, 0, 0]}>
              <torusGeometry args={[0.43, 0.016, 10, 48]} />
              <Fosco cor={tema.acento} emissivo={0.3 * rampa(t, T.vedam - 0.2, T.vedam + 0.3)} />
            </mesh>
          ))}
          <Olhos tema={tema} pos={[0, 0.05, 0.43]} esc={1.0} olhar={t >= T.vedam ? 'feliz' : 'ok'} />
          {raspa > 0.05
            ? [0, 0.5].map((o) => {
                const f = (t * 0.8 + o) % 1;
                return <Gota key={o} tema={tema} pos={[0.38, 0.22 - 0.35 * f, 0.18]} escala={0.22} cor={tema.areia} />;
              })
            : null}
        </group>
      ) : null}
      <Caixa args={[1.6, 0.4, 1.2]} raio={0.05} cor={tema.objetoEscuro} position={[XA, 0.2, 0]} />
    </>
  );
};

// ---------- Interface 2D ----------
const TEMPOS: [string, string][] = [
  ['1', 'ADMISSÃO'],
  ['2', 'COMPRESSÃO'],
  ['3', 'EXPLOSÃO'],
  ['4', 'ESCAPE'],
];
const Tempos: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  if (t < T.tempos - 0.2 || t >= C.empurrao) return null;
  const at = t < T.primeiro ? -1 : t < T.segundo ? 0 : t < T.terceiro ? 1 : t < T.quarto ? 2 : 3;
  const op = rampa(t, T.tempos - 0.2, T.tempos + 0.3) * (1 - rampa(t, C.empurrao - 0.3, C.empurrao));
  return (
    <div style={{position: 'absolute', top: 500, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: 12, opacity: op}}>
      {TEMPOS.map(([n, nome], i) => (
        <div key={n} style={{padding: '10px 14px', borderRadius: 14, background: i === at ? tema.acento : 'rgba(10,16,51,0.75)', border: `2px solid ${i === at ? tema.acento : tema.textoSuave}`, color: '#FFFFFF', fontFamily: 'Inter', fontWeight: 900, fontSize: i === at ? 30 : 24, transform: `scale(${i === at ? 1.08 : 1})`}}>
          {n}. {nome}
        </div>
      ))}
    </div>
  );
};

const Interface: React.FC<{t: number; tema: Tema; cam: Cam}> = ({t, tema, cam}) => {
  const pj = (p: V3) => projetar(p, cam, W, H);
  const ap = (a: number, b: number) => rampa(t, a, a + 0.35) * (1 - rampa(t, b - 0.3, b));
  const g = geoMotor(angulo(t));
  return (
    <>
      <Titulo t={t} a={0} b={C.oque}>
        <V tema={tema}>EXPLOSÕES</V> NO MOTOR?
      </Titulo>
      <Titulo t={t} a={C.oque} b={C.tempos}>
        O QUE É O <V tema={tema}>PISTÃO</V>?
      </Titulo>
      <Titulo t={t} a={C.tempos} b={C.empurrao}>
        OS <V tema={tema}>QUATRO TEMPOS</V>
      </Titulo>
      <Tempos t={t} tema={tema} />
      <Titulo t={t} a={C.empurrao} b={C.aneis}>
        O EMPURRÃO <V tema={tema}>GIRA A RODA</V>
      </Titulo>
      <Titulo t={t} a={C.aneis} b={C.gasto}>
        OS <V tema={tema}>ANÉIS</V>
      </Titulo>
      <Titulo t={t} a={C.gasto} b={C.dica}>
        ANÉIS <V tema={tema}>GASTOS</V>
      </Titulo>
      <Lista t={t} a={C.dica} b={C.mapa}>
        <Check tema={tema} texto="Óleo no prazo" k={rampa(t, T.prazo - 0.2, T.prazo + 0.3)} tam={48} />
        <Check tema={tema} texto={<>Motor frio? <V tema={tema}>Pé leve</V></>} k={rampa(t, T.frio - 0.2, T.frio + 0.3)} tam={48} />
      </Lista>
      {/* gancho */}
      <Estalo x={230} y={760} texto="BUM!" k={entra(t, T.explosoes, 0.3) * sumir(t, C.oque - 0.2, 0.3)} rot={-10} cor={tema.acento} />
      <Estalo x={850} y={900} texto="BUM!" k={entra(t, T.vezes, 0.3) * sumir(t, C.oque - 0.2, 0.3)} rot={8} cor={tema.acento} />
      <Estalo x={250} y={1060} texto="BUM!" k={entra(t, T.pancada - 0.2, 0.3) * sumir(t, C.oque - 0.2, 0.3)} rot={-5} cor={tema.acento} />
      {/* o que é */}
      <Etiqueta tema={tema} x={640} y={560} alvo={pj([0.42, g.pinoY + 0.2, 0.3])} titulo="Pistão" sub="A PEÇA DO VÍDEO" aparece={ap(T.oPistao, C.tempos)} destaque largura={370} />
      <Etiqueta tema={tema} x={70} y={1150} alvo={pj([-0.42, 2.7, 0])} titulo="Cilindro" aparece={ap(T.cilindro, C.tempos)} largura={300} />
      {/* tempos */}
      <Etiqueta tema={tema} x={70} y={640} alvo={pj([-0.2, CABECOTE_BAIXO - 0.1, 0.05])} titulo="Válvula" sub="ENTRA AR + COMBUSTÍVEL" aparece={ap(T.puxa - 0.1, T.segundo)} largura={420} />
      <Etiqueta tema={tema} x={640} y={640} alvo={pj([0, CABECOTE_BAIXO, 0.15])} titulo="Vela" aparece={ap(T.vela, T.quarto)} destaque largura={280} />
      <Etiqueta tema={tema} x={600} y={640} alvo={pj([0.2, CABECOTE_BAIXO - 0.1, 0.05])} titulo="Escape" sub="SAI A FUMAÇA" aparece={ap(T.quarto + 0.3, C.empurrao)} largura={330} />
      {/* empurrão */}
      <Etiqueta tema={tema} x={70} y={1120} alvo={pj([g.px * 0.5, (g.py + g.pinoY) / 2, 0.1])} titulo="Biela" aparece={ap(T.biela, C.aneis)} largura={260} />
      <Etiqueta tema={tema} x={70} y={560} alvo={pj([0, 1.1, 0.3])} titulo="Virabrequim" aparece={ap(T.vira, C.aneis)} largura={380} />
      <Etiqueta tema={tema} x={680} y={560} alvo={pj([2.45, 1.6, 0.35])} titulo="Roda" aparece={ap(T.roda, C.aneis)} destaque largura={260} />
      {/* anéis */}
      <Etiqueta tema={tema} x={640} y={600} alvo={pj([XA + 0.95, 0.95 + 0.29 * 2.2, 0.2])} titulo="Anéis" sub="VEDAM E RASPAM O ÓLEO" aparece={ap(T.aneis, C.gasto)} destaque largura={400} />
      {/* gasto */}
      <Estalo x={760} y={760} texto="FUMAÇA AZUL" k={entra(t, T.azulada, 0.3) * sumir(t, C.dica, 0.3)} rot={6} cor={tema.branco} tam={54} />
      <Estalo x={290} y={1100} texto="BEBENDO ÓLEO" k={entra(t, T.bebe, 0.3) * sumir(t, C.dica, 0.3)} rot={-6} cor={tema.acento} tam={54} />
      <Estalo x={300} y={900} texto="SEM FORÇA" k={entra(t, T.forca, 0.3) * sumir(t, C.dica, 0.3)} rot={-4} cor={tema.branco} tam={54} />
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: T.explosoes, f: 'impacto', v: 0.24},
  {t: T.vezes, f: 'baque', v: 0.24},
  {t: T.pancada - 0.2, f: 'baque', v: 0.24},
  {t: C.oque, f: 'whoosh', v: 0.18},
  {t: T.oPistao, f: 'pop', v: 0.18},
  {t: C.tempos, f: 'whoosh', v: 0.18},
  {t: T.primeiro, f: 'tique', v: 0.2},
  {t: T.segundo, f: 'tique', v: 0.2},
  {t: T.terceiro, f: 'tique', v: 0.2},
  {t: T.faisca, f: 'bip', v: 0.16},
  {t: T.queima, f: 'impacto', v: 0.24},
  {t: T.quarto, f: 'tique', v: 0.2},
  {t: C.empurrao, f: 'whoosh', v: 0.18},
  {t: T.roda, f: 'ding', v: 0.16},
  {t: C.aneis, f: 'whoosh', v: 0.18},
  {t: T.aneis, f: 'pop', v: 0.18},
  {t: T.vedam, f: 'tique', v: 0.18},
  {t: C.gasto, f: 'whoosh', v: 0.16},
  {t: T.azulada, f: 'baque', v: 0.2},
  {t: T.bebe, f: 'pop', v: 0.16},
  {t: C.dica, f: 'whoosh', v: 0.16},
  {t: T.prazo, f: 'ding', v: 0.16},
  {t: T.frio, f: 'tique', v: 0.18},
  {t: C.mapa, f: 'whoosh', v: 0.2},
  {t: T.ctaPis, f: 'pop', v: 0.18},
  {t: T.ctaAneis, f: 'pop', v: 0.18},
  {t: T.peca, f: 'pop', v: 0.18},
  {t: T.chama - 1.6, f: 'subida', v: 0.2},
  {t: T.chama, f: 'impacto', v: 0.3},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];
export const REVISAO: number[] = [0.3, T.pancada + 0.3, T.oPistao + 0.6, T.cilindro + 0.4, T.puxa + 0.4, T.aperta + 0.6, T.faisca + 0.2, T.empurra + 0.3, T.fumaca + 0.3, T.vira + 0.4, T.roda + 0.3, T.aneis + 0.4, T.raspam + 0.4, T.azulada + 0.3, T.bebe + 0.3, T.frio + 0.4, T.ctaAneis + 0.3, T.chama + 0.9, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const PistaoTinho: React.FC<Props> = ({guia, semInterface, estilo = 'tinho', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cam = camEm(t);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={14} centro={[3, 0, 0]} />
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
            ['Pistão', T.ctaPis],
            ['Anéis', T.ctaAneis],
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

export const CapaPistaoTinho: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'tinho', fundo = `${P}/capa/fundo-limpo.jpg`}) => (
  <CapaSerie tema={temaPorId(estilo)} fundo={fundo} linhas={['EXPLOSÕES', 'DENTRO DO', 'MOTOR? É O', 'PISTÃO!']} />
);
