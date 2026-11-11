// Catálogo visual da base: cada peça numa prateleira, com o nome embaixo.
// Use para conhecer as peças: npx remotion studio (composição Catalogo) ou os quadros em out/.
import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Celular, Cofre, Fosco, Moeda, Onda, Palco, Particulas, Pilhas, Placa, Predio, Vapor, projetar, type Cam, type V3} from '../../base/pecas';
import {Barra, Barras} from '../../base/graficos';
import {Banco, Cidade, Envelope, Trilha, curva} from '../../base/cidade';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {SEGURO} from '../../base/reels';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';

const W = 1080;
const H = 1920;
const COLS = 3;
const CEL_L = 4.6;
const CEL_A = 3.0;

type Item = {nome: string; peca: (t: number, tema: Tema) => React.ReactNode};

const ITENS: Item[] = [
  {nome: 'Caixa', peca: (t, tema) => <Caixa args={[1.4, 0.9, 0.9]} raio={0.12} cor={tema.objeto} position={[0, 0.45, 0]} rotation={[0, 0.5 + t * 0.2, 0]} />},
  {
    nome: 'Fosco',
    peca: (t, tema) => (
      <group>
        <mesh position={[-0.55, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.5, 40, 24]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        <mesh position={[0.65, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.5, 40, 24]} />
          <Fosco cor={tema.acento} emissivo={0.25} />
        </mesh>
      </group>
    ),
  },
  {nome: 'Placa', peca: (t, tema) => <Placa tema={tema} pos={[0, 0.85, 0]} larg={2.6} alt={1.1} linhas={[{t: 'R$ 1.518', tam: 230, cor: tema.objetoClaro, peso: 850}, {t: 'SALÁRIO MÍNIMO', tam: 90, cor: tema.textoSuave, peso: 600, mono: true}]} fundo={tema.objetoEscuro} />},
  {nome: 'Boneco', peca: (t, tema) => <Boneco tema={tema} pos={[0, 0, 0]} rotY={0.3} escala={1.05} cor={tema.pessoa} />},
  {nome: 'Boneco · pose', peca: (t, tema) => <Boneco tema={tema} pos={[0, 0, 0]} rotY={-0.4} escala={1.05} cor={tema.acento} pose={{passo: Math.sin(t * 5), ombroE: [0, 0, -2.4], cotoveloE: -0.3}} />},
  {
    nome: 'Celular',
    peca: (t, tema) => (
      <group position={[0, 0.85, 0]} rotation={[-0.1, 0.35, 0]} scale={9}>
        <Celular tema={tema} pos={[0, 0, 0]} brilho={1} />
      </group>
    ),
  },
  {
    nome: 'Predio',
    peca: (t, tema) => (
      <group scale={0.27}>
        <Predio tema={tema} pos={[0, 0, 0]} rotY={0.5} aceso={0.6} />
      </group>
    ),
  },
  {nome: 'Moeda', peca: (t, tema) => <Moeda tema={tema} pos={[0, 0.75, 0]} rot={[Math.PI / 2, 0, t * 1.2]} r={0.6} />},
  {nome: 'Pilhas', peca: (t, tema) => <Pilhas tema={tema} pos={[0, 0, 0]} alturas={[4, 7, 10]} r={0.32} destaque={2} />},
  {
    nome: 'Cofre',
    peca: (t, tema) => (
      <group scale={1.15}>
        <Cofre tema={tema} pos={[0, 0, 0]} rotY={-0.4} abre={0.35} brilho={0.6} />
      </group>
    ),
  },
  {
    nome: 'Vapor',
    peca: (t, tema) => (
      <group>
        <Caixa args={[0.6, 0.5, 0.6]} raio={0.08} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
        <Vapor pos={[0, 0.5, 0]} t={t} escala={1.6} />
      </group>
    ),
  },
  {nome: 'Onda', peca: (t, tema) => <Onda pos={[0, 0.02, 0]} k={0.15 + ((t * 0.35) % 0.75)} cor={tema.acento} raio={1.9} />},
  {nome: 'Barra · Barras', peca: (t, tema) => <Barras tema={tema} pos={[0, 0, 0]} valores={[0.8, 1.3, 1.9]} destaque={2} larg={0.55} espaco={0.8} />},
  {
    nome: 'Envelope',
    peca: (t, tema) => (
      <group position={[0, 0.8, 0]} scale={3.4}>
        <Envelope tema={tema} pos={[0, 0, 0]} rotY={-0.3} giro={0.2 * Math.sin(t)} brilho={0.6} />
      </group>
    ),
  },
  {
    nome: 'Trilha · curva',
    peca: (t, tema) => {
      const a: V3 = [-1.6, 0.3, 0];
      const b: V3 = [1.6, 0.3, 0];
      return (
        <group>
          <Trilha f={(s) => curva(a, b, 1.6, s)} prog={0.85} cor={tema.acento} n={22} raio={0.07} />
          <Moeda tema={tema} pos={curva(a, b, 1.6, 0.85)} rot={[Math.PI / 2, 0, 0]} r={0.22} />
        </group>
      );
    },
  },
  {
    nome: 'Banco',
    peca: (t, tema) => (
      <group scale={0.95}>
        <Banco tema={tema} pos={[0, 0, 0]} rotY={-0.3} pulso={0.6} />
      </group>
    ),
  },
  {
    nome: 'Cidade',
    peca: (t, tema) => (
      <group scale={0.15} position={[0, 0, 0.2]}>
        <Cidade tema={tema} t={t} sobe={1} pulsoSeu={0.8} />
      </group>
    ),
  },
  {
    nome: 'Particulas',
    peca: (t, tema) => (
      <group>
        <Particulas t={t} centro={[0, 1.1, 0]} raio={1.6} n={45} tamanho={1.4} cor={tema.objetoClaro} opacidade={0.7} />
        <Caixa args={[0.5, 0.5, 0.5]} raio={0.1} cor={tema.objeto} position={[0, 0.25, 0]} />
      </group>
    ),
  },
];

const LINHAS = Math.ceil(ITENS.length / COLS);
const CENTRO_Y = (LINHAS * CEL_A) / 2;
// posição da base de cada célula (prateleiras de cima para baixo)
const celula = (i: number): V3 => {
  const c = i % COLS;
  const l = Math.floor(i / COLS);
  return [(c - (COLS - 1) / 2) * CEL_L, (LINHAS - 1 - l) * CEL_A + 0.12, 0];
};
const ALTO_GRADE = LINHAS * CEL_A;
const CAM: Cam = (() => {
  const fov = 24;
  const altVisivel = ALTO_GRADE / (1000 / 1920);
  const d = altVisivel / (2 * Math.tan((fov * Math.PI) / 360));
  const ang = 0.12;
  return {pos: [0, CENTRO_Y + d * Math.sin(ang), d * Math.cos(ang)], alvo: [0, CENTRO_Y, 0], fov, sobe: 150};
})();

const PALAVRAS_DEMO = [
  {w: 'A', s: 0, e: 0.2},
  {w: 'legenda', s: 0.2, e: 0.6},
  {w: 'acende', s: 0.6, e: 1.0},
  {w: 'palavra', s: 1.0, e: 1.4},
  {w: 'por', s: 1.4, e: 1.6},
  {w: 'palavra.', s: 1.6, e: 2.2},
];

export const Catalogo: React.FC<{estilo?: string; revisao?: number[]}> = ({estilo}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: CAM.fov, position: CAM.pos}}>
        <Palco tema={tema} alcance={260} sombraArea={14} centro={[0, CENTRO_Y, 4]} />
        <Camera {...CAM} />
        {ITENS.map((it, i) => {
          const p = celula(i);
          return (
            <group key={it.nome} position={p}>
              <Caixa args={[CEL_L - 0.35, 0.12, 2.2]} raio={0.04} cor={mistura(tema.chao, tema.objetoEscuro, 0.5)} position={[0, -0.06, 0]} castShadow={false} />
              {it.peca(t, tema)}
            </group>
          );
        })}
        <AcabamentoCinema raioAO={0.4} />
      </ThreeCanvas>
      {ITENS.map((it, i) => {
        const p = celula(i);
        const q = projetar([p[0], p[1] - 0.12, 1.1], CAM, W, H);
        return (
          <div key={it.nome} style={{position: 'absolute', left: q.x - 160, top: q.y + 2, width: 320, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 700, letterSpacing: 2, color: tema.textoSuave}}>
            {it.nome}
          </div>
        );
      })}
      <Marca tema={tema} serie={SERIE} assunto="Catálogo da base" />
      <Pilula tema={tema} estado="CATÁLOGO" t={t} troca={0} />
      <div style={{position: 'absolute', right: 1080 - SEGURO.dir, top: SEGURO.topo + 66, fontFamily: FONTE, fontSize: 30, fontWeight: 700, color: tema.texto}}>{ITENS.length} peças 3D</div>
      <div style={{position: 'absolute', left: SEGURO.esq, top: 1580, display: 'flex', gap: 12}}>
        <Chip tema={tema} texto="CHIP" k={1} tam={26} />
        <Chip tema={tema} texto="CHIP DESTAQUE" k={1} destaque tam={26} />
      </div>
      <Legenda t={1.1 + (t % 1.2)} palavras={PALAVRAS_DEMO} tema={tema} tam={48} />
    </AbsoluteFill>
  );
};
