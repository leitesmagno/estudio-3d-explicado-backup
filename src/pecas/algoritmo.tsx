import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, Vapor, geoCaixa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';
import {Multidao, type Agente} from './concurso';

// Peças (algoritmo): planície de celulares, torre do feed, o Adivinhador com bola de cristal,
// o caderno que anota tudo, as bolhas de cada assunto e a mesa de apostas. Tudo parado; quem anima é a cena.

// ---------- Assuntos: uma cor e um ícone fixos do começo ao fim ----------
export type Assunto = 'politica' | 'futebol' | 'invest' | 'ia' | 'sol' | 'fe' | 'receita';
export const ASSUNTOS: Assunto[] = ['politica', 'futebol', 'invest', 'ia', 'sol', 'fe', 'receita'];
export const NOME_ASSUNTO: Record<Assunto, string> = {politica: 'POLÍTICA', futebol: 'FUTEBOL', invest: 'INVESTIMENTO', ia: 'IA', sol: 'PÔR DO SOL', fe: 'FÉ', receita: 'RECEITA'};
export const corAssunto = (tema: Tema, a: Assunto) => {
  const F = festa(tema);
  return {politica: F.roxo, futebol: F.verde, invest: F.dourado, ia: F.turquesa, sol: F.rosa, fe: F.azul, receita: F.loiro}[a];
};

// ---------- Ícones 3D (cabem num quadrado de ~0,5, de frente para +z) ----------
// `anima` 0..1: a bola entra no gol, as barras sobem, o sol se põe. `cinza` 0..1: perde a cor (feed antigo).
export const Icone: React.FC<{tema: Tema; assunto: Assunto; pos?: V3; rot?: V3; escala?: number; anima?: number; cinza?: number; t?: number}> = ({tema, assunto, pos = [0, 0, 0], rot = [0, 0, 0], escala = 1, anima = 1, cinza = 0, t = 0}) => {
  if (escala < 0.02) return null;
  const base = mistura(corAssunto(tema, assunto), tema.corpo, cinza);
  const c = mistura(base, tema.objetoClaro, 0.55);
  const e = mistura(base, tema.fundo, 0.35);
  const escuro = tema.objetoEscuro;
  let corpo: React.ReactNode = null;
  if (assunto === 'politica')
    corpo = (
      <>
        <Caixa args={[0.3, 0.26, 0.14]} raio={0.03} cor={c} position={[0, -0.1, 0]} />
        <Caixa args={[0.38, 0.05, 0.2]} raio={0.02} cor={c} position={[0, 0.05, 0.01]} rotation={[0.35, 0, 0]} />
        <Caixa args={[0.14, 0.04, 0.02]} raio={0.008} cor={e} position={[0, -0.08, 0.075]} />
        <mesh position={[0.08, 0.15, 0.03]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
          <Fosco cor={escuro} />
        </mesh>
        <mesh position={[0.11, 0.24, 0.03]}>
          <sphereGeometry args={[0.035, 12, 10]} />
          <Fosco cor={escuro} />
        </mesh>
      </>
    );
  if (assunto === 'futebol') {
    const k = Math.min(1, anima);
    corpo = (
      <>
        {[-0.22, 0.22].map((x) => (
          <Caixa key={x} args={[0.035, 0.34, 0.035]} raio={0.012} cor={tema.objetoClaro} position={[x, 0, 0]} />
        ))}
        <Caixa args={[0.48, 0.035, 0.035]} raio={0.012} cor={tema.objetoClaro} position={[0, 0.17, 0]} />
        <mesh position={[0, 0, -0.07]}>
          <planeGeometry args={[0.44, 0.32, 6, 4]} />
          <meshStandardMaterial color={c} wireframe transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.06 - 0.02 * k, -0.11 + 0.06 * Math.sin(Math.PI * k), 0.3 - 0.34 * k]}>
          <sphereGeometry args={[0.065, 16, 12]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        <Caixa args={[0.6, 0.02, 0.2]} raio={0.008} cor={e} position={[0, -0.18, 0.04]} />
      </>
    );
  }
  if (assunto === 'invest')
    corpo = (
      <>
        {[0.14, 0.24, 0.36].map((h, i) => {
          const hh = Math.max(0.02, h * anima);
          return <Caixa key={i} args={[0.1, hh, 0.1]} raio={0.02} cor={i === 2 ? c : e} position={[-0.15 + i * 0.15, -0.18 + hh / 2, 0]} />;
        })}
        <group position={[0.02, 0.06 + 0.04 * anima, 0.08]} rotation={[0, 0, 0.62]}>
          <Caixa args={[0.4, 0.03, 0.03]} raio={0.01} cor={tema.objetoClaro} />
          <mesh position={[0.22, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.05, 0.1, 12]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
        </group>
      </>
    );
  if (assunto === 'ia')
    corpo = (
      <>
        <Caixa args={[0.34, 0.34, 0.06]} raio={0.03} cor={escuro} />
        <Caixa args={[0.18, 0.18, 0.08]} raio={0.025} cor={c} emissivo={0.3 + 0.5 * anima} />
        {[-0.1, 0, 0.1].map((d) =>
          [-1, 1].map((l) => (
            <React.Fragment key={`${d}${l}`}>
              <Caixa args={[0.03, 0.07, 0.02]} raio={0.008} cor={c} position={[d, 0.2 * l, 0]} />
              <Caixa args={[0.07, 0.03, 0.02]} raio={0.008} cor={c} position={[0.2 * l, d, 0]} />
            </React.Fragment>
          )),
        )}
        <mesh position={[0.2, 0.2, 0.06]} rotation={[0, 0, t * 1.5]} scale={0.06 + 0.03 * Math.sin(t * 3)}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.6} />
        </mesh>
      </>
    );
  if (assunto === 'sol')
    corpo = (
      <>
        <mesh position={[0, 0.1 - 0.16 * anima, -0.01]}>
          <circleGeometry args={[0.16, 32]} />
          <meshStandardMaterial color={c} emissive={base} emissiveIntensity={0.9} />
        </mesh>
        <Caixa args={[0.5, 0.18, 0.05]} raio={0.02} cor={e} position={[0, -0.13, 0.02]} />
        {[0, 1].map((i) => (
          <Caixa key={i} args={[0.3 - i * 0.12, 0.018, 0.01]} raio={0.005} cor={c} position={[0, -0.09 - i * 0.05, 0.05]} />
        ))}
      </>
    );
  if (assunto === 'fe')
    corpo = (
      <>
        <Caixa args={[0.24, 0.2, 0.14]} raio={0.02} cor={c} position={[0, -0.12, 0]} />
        <mesh position={[0, 0.045, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.19, 0.13, 4]} />
          <Fosco cor={e} />
        </mesh>
        <Caixa args={[0.03, 0.13, 0.03]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.17, 0]} />
        <Caixa args={[0.09, 0.03, 0.03]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.19, 0]} />
        <Caixa args={[0.06, 0.1, 0.02]} raio={0.01} cor={escuro} position={[0, -0.17, 0.075]} />
      </>
    );
  if (assunto === 'receita')
    corpo = (
      <>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.16, 28]} />
          <Fosco cor={c} />
        </mesh>
        {[-1, 1].map((l) => (
          <Caixa key={l} args={[0.08, 0.03, 0.04]} raio={0.01} cor={e} position={[0.22 * l, -0.05, 0]} />
        ))}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 28]} />
          <Fosco cor={e} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.03, 12, 10]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        {anima > 0.2 ? <Vapor pos={[0, 0.04, 0]} t={t} cor={tema.objetoClaro} /> : null}
      </>
    );
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {corpo}
    </group>
  );
};

// ---------- Cartão de vídeo/post (na torre, na mesa, na tela) ----------
export const Cartao: React.FC<{
  tema: Tema;
  assunto: Assunto;
  pos: V3;
  rot?: V3;
  escala?: number;
  larg?: number;
  alt?: number;
  apagado?: number;
  destaque?: number;
  brilho?: number;
  anima?: number;
  t?: number;
}> = ({tema, assunto, pos, rot = [0, 0, 0], escala = 1, larg = 1.0, alt = 0.82, apagado = 0, destaque = 0, brilho = 0, anima = 1, t = 0}) => {
  if (escala < 0.02) return null;
  const cor = mistura(corAssunto(tema, assunto), tema.corpo, apagado);
  const face = mistura(cor, tema.fundo, 0.42 + 0.25 * apagado);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {destaque > 0.01 ? <Caixa args={[larg + 0.1, alt + 0.1, 0.03]} raio={0.06} cor={tema.acento} emissivo={0.25 + 0.5 * destaque} position={[0, 0, -0.02]} sombra={false} /> : null}
      <Caixa args={[larg, alt, 0.05]} raio={0.05} cor={face} emissivo={0.12 + 0.45 * brilho} />
      {/* Cabeçalho do post: bolinha do perfil e o nome (traço) */}
      <mesh position={[-larg / 2 + 0.1, alt / 2 - 0.09, 0.03]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <Fosco cor={mistura(cor, tema.objetoClaro, 0.3)} />
      </mesh>
      <Caixa args={[larg * 0.35, 0.03, 0.02]} raio={0.01} cor={mistura(face, tema.objetoClaro, 0.35)} position={[-larg / 2 + 0.17 + larg * 0.175, alt / 2 - 0.09, 0.03]} />
      <Icone tema={tema} assunto={assunto} pos={[0, -0.03, 0.05]} escala={Math.min(larg, alt) * 1.25} anima={anima} cinza={apagado} t={t} />
    </group>
  );
};

// ---------- Torre do feed: a tela do celular aumentada e de pé, com 10 posts (2 colunas × 5) ----------
export const TORRE: V3 = [3.0, 0, -1.3];
export const TORRE_BASE = 0.35;
export const TORRE_ALT = 5.3;
export const CARD_L = 1.0;
export const CARD_A = 0.82;
export const slotTorre = (i: number): V3 => [TORRE[0] + ((i % 2) - 0.5) * 1.06, TORRE_BASE + TORRE_ALT - 0.76 - Math.floor(i / 2) * 0.94, TORRE[2] + 0.16];
export const TorreFeed: React.FC<{tema: Tema; k: number; brilho: number; sepia?: number}> = ({tema, k, brilho, sepia = 0}) => {
  if (k < 0.01) return null;
  const corpo = mistura(tema.fundo, tema.objetoEscuro, 0.75);
  const tela = mistura(mistura(tema.fundo, tema.objetoEscuro, 0.25), tema.areia, 0.12 * sepia);
  return (
    <group position={[TORRE[0], -6.2 * (1 - k), TORRE[2]]}>
      <Caixa args={[1.7, TORRE_BASE, 0.9]} raio={0.1} cor={tema.objetoEscuro} position={[0, TORRE_BASE / 2, 0]} />
      <Caixa args={[2.5, TORRE_ALT, 0.22]} raio={0.2} cor={corpo} position={[0, TORRE_BASE + TORRE_ALT / 2, 0]} />
      <mesh position={[0, TORRE_BASE + TORRE_ALT / 2, 0.112]}>
        <planeGeometry args={[2.3, TORRE_ALT - 0.24]} />
        <meshStandardMaterial color={tela} emissive={tela} emissiveIntensity={0.3 + 0.5 * brilho} roughness={0.5} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
      {/* Câmera frontal e botões laterais */}
      <Caixa args={[0.46, 0.07, 0.03]} raio={0.03} cor={tema.fundo} position={[0, TORRE_BASE + TORRE_ALT - 0.1, 0.12]} sombra={false} />
      <Caixa args={[0.05, 0.5, 0.12]} raio={0.02} cor={tema.objetoEscuro} position={[1.27, TORRE_BASE + TORRE_ALT - 1.2, 0]} />
      <Caixa args={[0.05, 0.3, 0.12]} raio={0.02} cor={tema.objetoEscuro} position={[-1.27, TORRE_BASE + TORRE_ALT - 1.0, 0]} />
    </group>
  );
};

// ---------- Planície de celulares (instancedMesh: corpo e tela) ----------
export type Cel = {x: number; z: number; rot: number; d: number; c0: number; c1: number; f: number};
const rndCel = (() => {
  let s = 21;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
})();
export const CELULARES: Cel[] = (() => {
  const out: Cel[] = [];
  const passo = 1.55;
  for (let gx = -32; gx <= 32; gx++) {
    for (let gz = -32; gz <= 32; gz++) {
      const x = gx * passo + (rndCel() - 0.5) * 0.8;
      const z = gz * passo + (rndCel() - 0.5) * 0.8;
      const d = Math.hypot(x, z);
      if (d < 5.2 || d > 48) continue;
      // Corredor livre na frente (onde a câmera passa nos closes): menos celulares perto do eixo +z
      if (z > 3 && Math.abs(x) < 2.2 && d < 12) continue;
      out.push({x, z, rot: Math.atan2(-x, -z), d, c0: Math.floor(rndCel() * 7), c1: Math.floor(rndCel() * 7), f: rndCel() * 6.28});
    }
  }
  return out;
})();
const G_CEL = geoCaixa(0.42, 0.8, 0.05, 0.05);
const G_TELA_CEL = new THREE.PlaneGeometry(0.36, 0.72);
const O = new THREE.Object3D();
const M_TELA = new THREE.Matrix4().makeTranslation(0, 0, 0.028);
const COR = new THREE.Color();
const COR2 = new THREE.Color();
// `luz(i)` 0..1 por celular; `ergue` 0..1 (deitado → de pé, inclinado para o centro); `troca` 0..1 (cada tela vai para outra cor).
export const CampoCelulares: React.FC<{tema: Tema; luz: (c: Cel) => number; ergue: number; troca: number}> = ({tema, luz, ergue, troca}) => {
  const cores = ASSUNTOS.map((a) => corAssunto(tema, a));
  const tilt = (Math.PI / 2) * (1 - ergue) + 0.62 * ergue;
  const y = 0.4 * Math.cos(tilt) + 0.035;
  const corpo = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CELULARES.forEach((c, i) => {
      O.position.set(c.x, y, c.z);
      O.rotation.set(-tilt, c.rot, 0, 'YXZ');
      O.updateMatrix();
      mesh.setMatrixAt(i, O.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  const telas = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CELULARES.forEach((c, i) => {
      O.position.set(c.x, y, c.z);
      O.rotation.set(-tilt, c.rot, 0, 'YXZ');
      O.updateMatrix();
      O.matrix.multiply(M_TELA);
      mesh.setMatrixAt(i, O.matrix);
      const l = luz(c);
      COR.set(cores[c.c0]).lerp(COR2.set(cores[c.c1]), troca);
      COR.lerp(COR2.set(tema.fundo), 0.12).multiplyScalar(0.06 + 0.8 * l);
      mesh.setColorAt(i, COR);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <>
      <instancedMesh ref={corpo} args={[G_CEL, undefined, CELULARES.length]} frustumCulled={false} receiveShadow>
        <meshStandardMaterial color={mistura(tema.fundo, tema.objetoEscuro, 0.55)} roughness={0.45} />
      </instancedMesh>
      <instancedMesh ref={telas} args={[G_TELA_CEL, undefined, CELULARES.length]} frustumCulled={false}>
        <meshBasicMaterial color="#FFFFFF" polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </instancedMesh>
    </>
  );
};

// ---------- Celular na mão do protagonista ----------
export const CelularMao: React.FC<{tema: Tema; pos: V3; rot?: V3; cor: string; brilho?: number; assunto?: Assunto | null; progresso?: number; t?: number; anima?: number}> = ({tema, pos, rot = [0, 0, 0], cor, brilho = 1, assunto = null, progresso = -1, t = 0, anima = 1}) => (
  <group position={pos} rotation={rot}>
    <Caixa args={[0.27, 0.52, 0.035]} raio={0.035} cor={mistura(tema.fundo, tema.objetoEscuro, 0.8)} />
    <mesh position={[0, 0, 0.019]}>
      <planeGeometry args={[0.24, 0.47]} />
      <meshStandardMaterial color={mistura(cor, tema.fundo, 0.35)} emissive={cor} emissiveIntensity={0.35 * brilho} roughness={0.5} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
    </mesh>
    {assunto ? <Icone tema={tema} assunto={assunto} pos={[0, 0.03, 0.026]} escala={0.38} anima={anima} t={t} /> : null}
    {progresso >= 0 ? (
      <>
        <Caixa args={[0.21, 0.02, 0.012]} raio={0.008} cor={mistura(tema.fundo, tema.objetoEscuro, 0.4)} position={[0, -0.2, 0.026]} sombra={false} />
        {progresso > 0.01 ? <Caixa args={[0.21 * progresso, 0.024, 0.016]} raio={0.008} cor={tema.objetoClaro} emissivo={0.5} position={[-0.105 + 0.105 * progresso, -0.2, 0.029]} sombra={false} /> : null}
      </>
    ) : null}
  </group>
);

// ---------- O Adivinhador: pedestal, bola de cristal com posts girando, anel e o olho ----------
export const ADIV: V3 = [-3.0, 0, -1.3];
export const ADIV_BOLA: V3 = [ADIV[0], 2.15, ADIV[2]];
export const Adivinhador: React.FC<{tema: Tema; k: number; t: number; olhar: [number, number]; abre: number; brilho: number; placa?: number}> = ({tema, k, t, olhar, abre, brilho, placa = 0}) => {
  if (k < 0.01) return null;
  const F = festa(tema);
  const pedra = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  return (
    <group position={[ADIV[0], -4.2 * (1 - k), ADIV[2]]}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.88, 0.2, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.44, 0.96, 32]} />
        <Fosco cor={pedra} />
      </mesh>
      <mesh position={[0, 1.27, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.3, 0.26, 32]} />
        <Fosco cor={pedra} />
      </mesh>
      {/* Garras que seguram a bola */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2 + Math.PI / 4, 0]}>
          <Caixa args={[0.08, 0.36, 0.08]} raio={0.03} cor={pedra} position={[0, 1.5, 0.5]} rotation={[-0.35, 0, 0]} />
        </group>
      ))}
      <group position={[0, 2.15, 0]}>
        {/* Olho dentro da bola: vira para onde ele "olha" e abre/fecha devagar */}
        <group rotation={[olhar[1], olhar[0], 0]} scale={[1, 0.1 + 0.9 * abre, 1]}>
          <mesh>
            <sphereGeometry args={[0.26, 28, 20]} />
            <meshStandardMaterial color={tema.objetoClaro} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.235]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.35 + 0.8 * brilho} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.255]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.04, 24]} />
            <meshStandardMaterial color={tema.fundo} roughness={0.3} />
          </mesh>
        </group>
        {/* Posts coloridos girando dentro da bola */}
        {ASSUNTOS.map((a, i) => {
          const ang = t * 0.7 + (i / 7) * Math.PI * 2;
          return <Caixa key={a} args={[0.13, 0.17, 0.012]} raio={0.005} cor={corAssunto(tema, a)} emissivo={0.4 + 0.4 * brilho} position={[Math.sin(ang) * 0.5, 0.18 * Math.sin(ang * 2 + i), Math.cos(ang) * 0.5]} rotation={[0, ang, 0]} sombra={false} />;
        })}
        <mesh>
          <sphereGeometry args={[0.75, 40, 28]} />
          <meshStandardMaterial color={mistura(F.roxoEscuro, tema.objetoClaro, 0.25)} emissive={F.roxoEscuro} emissiveIntensity={0.2 + 0.6 * brilho} transparent opacity={0.3} roughness={0.06} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.77, 40, 28]} />
          <meshBasicMaterial color={F.roxo} transparent opacity={0.05 + 0.1 * brilho} side={THREE.BackSide} depthWrite={false} />
        </mesh>
        {/* Reflexo da luz no vidro */}
        <mesh position={[-0.3, 0.38, 0.52]} scale={[0.12, 0.07, 0.04]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.5} depthWrite={false} />
        </mesh>
        {/* Anel em órbita */}
        <group rotation={[Math.PI / 2 - 0.45, 0.3, t * 0.6]}>
          <mesh>
            <torusGeometry args={[1.05, 0.03, 12, 80]} />
            <meshStandardMaterial color={tema.objeto} emissive={tema.objeto} emissiveIntensity={0.15 + 0.3 * brilho} roughness={0.4} />
          </mesh>
          <mesh position={[1.05, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
      {placa > 0.02 ? (
        <group position={[0, 0.5, 0.5]} scale={placa}>
          <Placa tema={tema} pos={[0, 0, 0]} rot={[-0.1, 0, 0]} larg={1.4} alt={0.3} linhas={[{t: 'ADIVINHADOR', tam: 128, cor: tema.objetoClaro, peso: 850}]} fundo={mistura(tema.fundo, tema.objetoEscuro, 0.5)} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- O caderno que anota tudo ----------
export const CADERNO: V3 = [-1.75, 0, 0.9];
export const CADERNO_ROT = 0.42;
const PAPEL = (tema: Tema) => mistura(tema.branco, tema.areia, 0.38);
export const Caderno: React.FC<{tema: Tema; k: number; abre: number; linhas: number; final: number; brilho?: number}> = ({tema, k, abre, linhas, final, brilho = 0}) => {
  if (k < 0.01) return null;
  const papel = mistura(PAPEL(tema), tema.objetoClaro, 0.15 * brilho);
  const capa = mistura(tema.acento, tema.fundo, 0.45);
  const linha = (i: number) => {
    const f = Math.max(0, Math.min(1, linhas - i));
    if (f <= 0) return null;
    const lado = i < 4 ? -1 : 1;
    const row = i % 4;
    const z = -0.32 + row * 0.2;
    const larg = 0.3 + ((i * 37) % 5) * 0.03;
    return (
      <group key={i} position={[lado * 0.38 - 0.27, 0.075, z]}>
        <Caixa args={[0.12, 0.03, 0.12]} raio={0.02} cor={corAssunto(tema, ASSUNTOS[i % 7])} emissivo={0.45} sombra={false} />
        <Caixa args={[larg * f, 0.025, 0.055]} raio={0.012} cor={mistura(papel, tema.fundo, 0.65)} position={[0.1 + (larg * f) / 2, 0, 0]} sombra={false} />
      </group>
    );
  };
  return (
    <group position={[CADERNO[0], -2.4 * (1 - k), CADERNO[2]]} rotation={[0, CADERNO_ROT, 0]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.06, 28]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.86, 14]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <group position={[0, 0.92, 0]} rotation={[0.62, 0, 0]}>
        <Caixa args={[1.62, 0.05, 1.06]} raio={0.03} cor={capa} />
        {/* Página da esquerda (fixa) */}
        <Caixa args={[0.76, 0.03, 0.98]} raio={0.02} cor={papel} position={[-0.39, 0.04, 0]} />
        {/* Página da direita: dobra por cima da esquerda quando fechado */}
        <group position={[0, 0.04, 0]} rotation={[0, 0, (1 - abre) * Math.PI * 0.985]}>
          <Caixa args={[0.76, 0.03, 0.98]} raio={0.02} cor={papel} position={[0.39, 0, 0]} />
          <Caixa args={[0.8, 0.02, 1.04]} raio={0.02} cor={capa} position={[0.4, -0.026, 0]} />
        </group>
        {abre > 0.9 ? (
          <>
            {Array.from({length: 8}).map((_, i) => linha(i))}
            {final > 0.02 ? (
              <group position={[0.39, 0.075, 0.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[final, 1, 1]}>
                <Placa tema={tema} pos={[0, 0, 0]} larg={0.74} alt={0.17} linhas={[{t: 'GOSTA DE: ALGORITMO', tam: 80, cor: tema.acento, peso: 850}]} fundo={papel} />
              </group>
            ) : null}
            <Caixa args={[0.04, 0.03, 0.98]} raio={0.01} cor={mistura(capa, tema.fundo, 0.3)} position={[0, 0.045, 0]} sombra={false} />
          </>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Bolha de um assunto: esfera de vidro com um grupo de pessoas da mesma cor ----------
export const agentesBolha = (n: number, raio: number, semente: number): Agente[] => {
  let s = semente;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2 + r() * 0.5;
    const d = i === 0 ? 0 : raio * (0.45 + 0.55 * r());
    const x = Math.sin(a) * d;
    const z = Math.cos(a) * d;
    return {x, z, rot: Math.atan2(-x, -z) + Math.PI + (r() - 0.5) * 0.6, s: 0.92 + r() * 0.16, fase: r() * 6.28, anda: 0};
  });
};
export const BolhaGrupo: React.FC<{
  tema: Tema;
  cor: string;
  pos: V3;
  k: number;
  r?: number;
  gente?: number;
  brilho?: number;
  t: number;
  agentes?: Agente[];
  icone?: Assunto | null;
  chao?: boolean;
  some?: number;
}> = ({tema, cor, pos, k, r = 1.3, gente = 1, brilho = 0, t, agentes = [], icone = null, chao = true, some = 1}) => {
  if (k < 0.01) return null;
  const piso = -r * 0.55;
  const pessoas = agentes.map((a, i) => ({...a, s: a.s * 0.82 * Math.max(0, Math.min(1, gente * 1.6 - (i / agentes.length) * 0.6)), fase: a.fase + t * 3, anda: 0.18}));
  return (
    <group position={pos} scale={k}>
      {chao ? (
        <>
          <mesh position={[0, piso, 0]} receiveShadow>
            <cylinderGeometry args={[Math.sqrt(r * r - piso * piso) - 0.02, Math.sqrt(r * r - piso * piso) - 0.12, 0.06, 40]} />
            <meshStandardMaterial color={mistura(cor, tema.fundo, 0.55)} emissive={cor} emissiveIntensity={0.08 + 0.35 * brilho} roughness={0.7} />
          </mesh>
          <group position={[0, piso + 0.03, 0]}>
            <Multidao tema={tema} agentes={pessoas} corCorpo={mistura(cor, tema.objetoClaro, 0.18)} mochila={false} />
          </group>
        </>
      ) : null}
      <mesh>
        <sphereGeometry args={[r, 48, 32]} />
        <meshStandardMaterial color={mistura(cor, tema.objetoClaro, 0.55)} emissive={cor} emissiveIntensity={0.05 + 0.2 * brilho} transparent opacity={(0.11 + 0.07 * brilho) * some} roughness={0.06} metalness={0.1} envMapIntensity={1.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 1.012, 48, 32]} />
        <meshBasicMaterial color={cor} transparent opacity={(0.07 + 0.13 * brilho) * some} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Brilho de bolha de sabão */}
      <mesh position={[-r * 0.42, r * 0.5, r * 0.62]} scale={[r * 0.16, r * 0.09, r * 0.05]} rotation={[0, 0, 0.6]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.45 * some} depthWrite={false} />
      </mesh>
      {icone ? <Icone tema={tema} assunto={icone} pos={[0, r + 0.42 + 0.06 * Math.sin(t * 1.4), 0]} rot={[0, 0.5 * Math.sin(t * 0.6), 0]} escala={1.15} t={t} /> : null}
    </group>
  );
};

// ---------- Robô genérico de binóculo (o "espião" que ele não é) ----------
export const Robo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; afunda?: number}> = ({tema, pos, rotY = 0, escala, afunda = 0}) => {
  if (escala < 0.02 || afunda > 0.99) return null;
  const c = mistura(tema.objeto, tema.objetoEscuro, 0.35);
  return (
    <group position={[pos[0], pos[1] - 2.2 * afunda, pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.12, 0.4]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.62, 0.72, 0.42]} raio={0.1} cor={c} position={[0, 0.6, 0]} />
      <Caixa args={[0.24, 0.2, 0.03]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.65, 0.22]} />
      <Caixa args={[0.5, 0.4, 0.4]} raio={0.1} cor={c} position={[0, 1.2, 0]} />
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.5} />
      </mesh>
      {/* Binóculo na frente dos olhos */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 1.22, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.26, 18]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      ))}
      {[-1, 1].map((l) => (
        <group key={l} position={[0.36 * l, 0.84, 0]} rotation={[-1.1, 0, 0.25 * l]}>
          <Caixa args={[0.12, 0.42, 0.12]} raio={0.05} cor={c} position={[0, -0.18, 0]} />
        </group>
      ))}
    </group>
  );
};

// ---------- X grande (risca o robô) ----------
export const XMarca: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[1.5, 0.16, 0.12]} raio={0.06} cor={tema.acento} emissivo={0.5} rotation={[0, 0, (Math.PI / 4) * l]} sombra={false} />
      ))}
    </group>
  );

// ---------- Dado (a "coincidência") ----------
const PONTOS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.15, -0.15], [0.15, 0.15]],
  3: [[-0.15, -0.15], [0, 0], [0.15, 0.15]],
  4: [[-0.15, -0.15], [0.15, 0.15], [-0.15, 0.15], [0.15, -0.15]],
  5: [[-0.15, -0.15], [0.15, 0.15], [-0.15, 0.15], [0.15, -0.15], [0, 0]],
  6: [[-0.15, -0.16], [-0.15, 0], [-0.15, 0.16], [0.15, -0.16], [0.15, 0], [0.15, 0.16]],
};
const FACES: {n: number; rot: V3}[] = [
  {n: 1, rot: [0, 0, 0]},
  {n: 6, rot: [0, Math.PI, 0]},
  {n: 2, rot: [0, Math.PI / 2, 0]},
  {n: 5, rot: [0, -Math.PI / 2, 0]},
  {n: 3, rot: [-Math.PI / 2, 0, 0]},
  {n: 4, rot: [Math.PI / 2, 0, 0]},
];
export const Dado: React.FC<{tema: Tema; pos: V3; rot: V3; escala: number}> = ({tema, pos, rot, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.6, 0.6, 0.6]} raio={0.1} cor={tema.objetoClaro} />
      {FACES.map((f) => (
        <group key={f.n} rotation={f.rot}>
          {PONTOS[f.n].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.296]} scale={[1, 1, 0.3]}>
              <sphereGeometry args={[0.05, 12, 10]} />
              <Fosco cor={tema.fundo} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );

// ---------- Crachá "???" ----------
export const Cracha: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.06, 0.5, 0.01]} raio={0.004} cor={tema.acento} position={[0, 0.78, -0.01]} sombra={false} />
      <Caixa args={[0.72, 1.0, 0.03]} raio={0.05} cor={tema.objetoClaro} />
      <Caixa args={[0.16, 0.05, 0.02]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.42, 0.02]} />
      <Caixa args={[0.36, 0.38, 0.02]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.corpo, 0.4)} position={[0, 0.12, 0.02]} />
      {/* Silhueta sem rosto no lugar da foto */}
      <mesh position={[0, 0.17, 0.035]}>
        <circleGeometry args={[0.08, 24]} />
        <meshStandardMaterial color={tema.corpo} />
      </mesh>
      <mesh position={[0, 0.01, 0.035]}>
        <circleGeometry args={[0.13, 24, 0, Math.PI]} />
        <meshStandardMaterial color={tema.corpo} />
      </mesh>
      <Placa tema={tema} pos={[0, -0.27, 0.02]} larg={0.6} alt={0.24} linhas={[{t: '???', tam: 300, cor: tema.fundo, peso: 900}]} fundo={tema.objetoClaro} />
    </group>
  );

// ---------- Mesa de apostas (feltro escuro) ----------
export const MESA: V3 = [0, 0, 2.55];
export const MESA_Y = 0.82;
export const MesaApostas: React.FC<{tema: Tema; k: number}> = ({tema, k}) => {
  if (k < 0.01) return null;
  const F = festa(tema);
  const feltro = mistura(F.verde, tema.fundo, 0.62);
  return (
    <group position={[MESA[0], -1.6 * (1 - k), MESA[2]]}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.5, 0.76, 28]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, MESA_Y - 0.06, 0]} scale={[2.3, 1, 1.05]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <Fosco cor={mistura(tema.areia, tema.fundo, 0.5)} />
      </mesh>
      <mesh position={[0, MESA_Y + 0.005, 0]} scale={[2.3, 1, 1.05]} receiveShadow>
        <cylinderGeometry args={[0.93, 0.93, 0.04, 64]} />
        <Fosco cor={feltro} />
      </mesh>
    </group>
  );
};

// ---------- Fichas de aposta (pilha com cor livre) ----------
export const PilhaFichas: React.FC<{tema: Tema; pos: V3; n: number; cor: string; escala?: number}> = ({tema, pos, n, cor, escala = 1}) =>
  n < 0.5 || escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {Array.from({length: Math.round(n)}).map((_, i) => (
        <group key={i} position={[0.006 * Math.sin(i * 2.1), 0.022 + i * 0.044, 0.006 * Math.cos(i * 1.7)]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.04, 28]} />
            <meshStandardMaterial color={i % 2 ? cor : mistura(cor, tema.objetoClaro, 0.5)} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );

// ---------- Ícones das medidas da aposta ----------
const G_CORACAO = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.3);
  s.bezierCurveTo(-0.05, -0.22, -0.32, -0.05, -0.32, 0.1);
  s.bezierCurveTo(-0.32, 0.27, -0.12, 0.33, 0, 0.18);
  s.bezierCurveTo(0.12, 0.33, 0.32, 0.27, 0.32, 0.1);
  s.bezierCurveTo(0.32, -0.05, 0.05, -0.22, 0, -0.3);
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3});
  g.center();
  return g;
})();
export const Coracao: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; cor?: string; brilho?: number}> = ({tema, pos, rot = [0, 0, 0], escala, cor, brilho = 0.3}) =>
  escala < 0.02 ? null : (
    <mesh geometry={G_CORACAO} position={pos} rotation={rot} scale={escala}>
      <meshStandardMaterial color={cor ?? tema.acento} emissive={cor ?? tema.acento} emissiveIntensity={brilho} roughness={0.45} />
    </mesh>
  );
export type Medida = 'fim' | 'curtir' | 'comentar' | 'mandar';
export const IconeMedida: React.FC<{tema: Tema; tipo: Medida; pos: V3; rot?: V3; escala: number; cor: string}> = ({tema, tipo, pos, rot = [0, 0, 0], escala, cor}) => {
  if (escala < 0.02) return null;
  let corpo: React.ReactNode = null;
  if (tipo === 'fim')
    corpo = (
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 3]} />
        <Fosco cor={cor} />
      </mesh>
    );
  if (tipo === 'curtir') corpo = <Coracao tema={tema} pos={[0, 0, 0]} escala={0.75} cor={cor} brilho={0.2} />;
  if (tipo === 'comentar')
    corpo = (
      <>
        <mesh scale={[1, 0.78, 0.4]}>
          <sphereGeometry args={[0.2, 20, 14]} />
          <Fosco cor={cor} />
        </mesh>
        <mesh position={[-0.11, -0.15, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.06, 0.12, 4]} />
          <Fosco cor={cor} />
        </mesh>
      </>
    );
  if (tipo === 'mandar')
    corpo = (
      <group rotation={[0, 0, 0.5]}>
        <mesh scale={[1, 1.6, 0.18]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.13, 0.24, 3]} />
          <Fosco cor={cor} />
        </mesh>
      </group>
    );
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {corpo}
    </group>
  );
};
export const MEDIDAS: Medida[] = ['fim', 'curtir', 'comentar', 'mandar'];
// Painel deitado na frente de cada carta: 4 linhas (ícone + barra que enche)
export const PainelAposta: React.FC<{tema: Tema; pos: V3; valores: number[]; ks: number[]; escala: number; vence?: number}> = ({tema, pos, valores, ks, escala, vence = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[-1.05, 0, 0]} scale={escala}>
      <Caixa args={[0.86, 0.84, 0.03]} raio={0.04} cor={mistura(tema.fundo, tema.objetoEscuro, 0.5)} emissivo={0.1 * vence} />
      {MEDIDAS.map((m, i) => {
        const y = 0.3 - i * 0.2;
        const k = ks[i];
        const v = valores[i] * k;
        return (
          <group key={m} position={[0, y, 0.025]}>
            <IconeMedida tema={tema} tipo={m} pos={[-0.32, 0, 0.02]} escala={0.42 * Math.min(1, k * 2)} cor={tema.objetoClaro} />
            <Caixa args={[0.52, 0.06, 0.02]} raio={0.02} cor={mistura(tema.fundo, tema.objetoEscuro, 0.9)} position={[0.1, 0, 0]} sombra={false} />
            {v > 0.01 ? <Caixa args={[0.52 * v, 0.07, 0.03]} raio={0.025} cor={mistura(tema.objetoClaro, tema.acento, vence)} emissivo={0.25 + 0.4 * vence} position={[-0.16 + 0.26 * v, 0, 0.005]} sombra={false} /> : null}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Cronômetro (anel que fecha em volta da tela) ----------
export const Cronometro: React.FC<{tema: Tema; pos: V3; rot?: V3; k: number; escala: number}> = ({tema, pos, rot = [0, 0, 0], k, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh>
        <torusGeometry args={[0.5, 0.018, 8, 64]} />
        <meshStandardMaterial color={tema.objetoEscuro} transparent opacity={0.7} />
      </mesh>
      {k > 0.01 ? (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.03, 8, 64, Math.PI * 2 * Math.min(1, k)]} />
          <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.6} />
        </mesh>
      ) : null}
    </group>
  );

// ---------- Feixe de luz entre dois pontos (o olho escolhendo) ----------
const UP = new THREE.Vector3(0, 1, 0);
export const Feixe: React.FC<{a: V3; b: V3; k: number; cor: string; raio?: number}> = ({a, b, k, cor, raio = 0.5}) => {
  if (k < 0.01) return null;
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  const meio = va.clone().lerp(vb, 0.5);
  return (
    <mesh position={[meio.x, meio.y, meio.z]} quaternion={q}>
      <cylinderGeometry args={[raio, 0.05, len, 32, 1, true]} />
      <meshBasicMaterial color={cor} transparent opacity={0.24 * k} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

// ---------- Posts de IA "às dezenas" girando em volta da torre (instancedMesh) ----------
const G_MINI = geoCaixa(0.42, 0.34, 0.03, 0.03);
export const DezenasIA: React.FC<{tema: Tema; centro: V3; t: number; k: (i: number) => number; n?: number}> = ({tema, centro, t, k, n = 40}) => {
  const base = useMemo(() => {
    let s = 7;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({length: n}, () => ({a: r() * Math.PI * 2, y: (r() - 0.5) * 4.4, d: 1.7 + r() * 1.2, v: 0.15 + r() * 0.2, g: r() * 6}));
  }, [n]);
  const cor = corAssunto(tema, 'ia');
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    base.forEach((p, i) => {
      const s = Math.max(0.0001, k(i));
      const a = p.a + t * p.v;
      O.position.set(centro[0] + Math.sin(a) * p.d, centro[1] + p.y + 0.1 * Math.sin(t + p.g), centro[2] + Math.cos(a) * p.d * 0.7);
      O.rotation.set(0.2 * Math.sin(t + p.g), a + Math.PI, 0);
      O.scale.setScalar(s);
      O.updateMatrix();
      mesh.setMatrixAt(i, O.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return (
    <instancedMesh ref={preparar} args={[G_MINI, undefined, n]} frustumCulled={false}>
      <meshStandardMaterial color={mistura(cor, tema.fundo, 0.3)} emissive={cor} emissiveIntensity={0.45} roughness={0.5} />
    </instancedMesh>
  );
};

// ---------- Etiqueta de hora presa a um post (feed antigo, em ordem de horário) ----------
export const TagHora: React.FC<{tema: Tema; pos: V3; hora: string; escala: number}> = ({tema, pos, hora, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={0.5} alt={0.17} linhas={[{t: hora, tam: 260, cor: tema.fundo, peso: 850}]} fundo={mistura(tema.objetoClaro, tema.areia, 0.25)} />
    </group>
  );

// ---------- Mostrador "VOCÊ" (ele te mede): arco que enche e ponteiro ----------
export const Mostrador: React.FC<{tema: Tema; pos: V3; rotY?: number; valor: number; escala: number}> = ({tema, pos, rotY = 0, valor, escala}) => {
  if (escala < 0.02) return null;
  const v = Math.max(0, Math.min(1, valor));
  const arco = Math.PI * 1.5;
  const ang = Math.PI * 1.25 - arco * v;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 48]} />
        <Fosco cor={mistura(tema.fundo, tema.objetoEscuro, 0.7)} />
      </mesh>
      <mesh position={[0, 0, 0.045]} rotation={[0, 0, -Math.PI * 0.25]}>
        <torusGeometry args={[0.5, 0.035, 8, 64, arco]} />
        <meshStandardMaterial color={tema.objetoEscuro} />
      </mesh>
      {v > 0.01 ? (
        <mesh position={[0, 0, 0.055]} rotation={[0, 0, Math.PI * 1.25 - arco * v]}>
          <torusGeometry args={[0.5, 0.045, 8, 64, arco * v]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.6} />
        </mesh>
      ) : null}
      <group position={[0, 0, 0.07]} rotation={[0, 0, ang]}>
        <Caixa args={[0.42, 0.035, 0.02]} raio={0.012} cor={tema.objetoClaro} position={[0.21, 0, 0]} sombra={false} />
      </group>
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <Placa tema={tema} pos={[0, -0.32, 0.06]} larg={0.5} alt={0.16} linhas={[{t: 'VOCÊ', tam: 300, cor: tema.acento, peso: 900}]} fundo={mistura(tema.fundo, tema.objetoEscuro, 0.7)} />
    </group>
  );
};
