import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, geoCaixa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: MEI novas regras: a ratoeira da pegadinha, o teto de vidro congelado, as etiquetas de preço,
// o plenário com os 81 senadores, o bairro de lojinhas (instanciado, leve) e o prédio da empresa.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Nenhuma textura (nada para vazar memória).

const c01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------- Ratoeira de madeira ----------
// `fecha` 0 = armada (arco deitado para trás), 1 = fechada (arco deitado para a frente). `brilho` acende a isca.
export const Ratoeira: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; fecha: number; brilho?: number}> = ({tema, pos, rotY = 0, escala, fecha, brilho = 0}) => {
  if (escala < 0.02) return null;
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.35);
  const arame = tema.objetoClaro;
  const ang = Math.PI - 0.12 - (Math.PI - 0.24) * c01(fecha);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.0, 0.07, 0.48]} raio={0.02} cor={madeira} position={[0, 0.035, 0]} />
      {/* Mola */}
      {[-0.13, 0.13].map((z) => (
        <mesh key={z} position={[0, 0.1, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.035, 0.012, 8, 16]} />
          <Fosco cor={arame} />
        </mesh>
      ))}
      {/* Isca e gatilho */}
      <Caixa args={[0.2, 0.012, 0.16]} raio={0.004} cor={tema.objeto} position={[0.28, 0.077, 0]} />
      <mesh position={[0.28, 0.12, 0]} rotation={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.07, 3]} />
        <Fosco cor={mistura(tema.areia, tema.acento, brilho)} emissivo={0.15 + 0.5 * brilho} />
      </mesh>
      {/* Arco de arame (gira em volta da mola) */}
      <group position={[0, 0.1, 0]} rotation={[0, 0, ang]}>
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[0.21, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
            <Fosco cor={arame} />
          </mesh>
        ))}
        <mesh position={[0.42, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.41, 8]} />
          <Fosco cor={arame} />
        </mesh>
      </group>
      {/* Trava (barrinha que segura o arco armado) */}
      <mesh position={[-0.16, 0.085, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.36 * (1 - c01(fecha)), 6]} />
        <Fosco cor={arame} />
      </mesh>
    </group>
  );
};

// ---------- Teto de vidro (o limite de faturamento) ----------
// `gelo` 0..1: congelado (cor gelo + cristais). `racha` 0..1: rachaduras. `novo` 0..1: vira acento (o teto novo).
export const TetoVidro: React.FC<{tema: Tema; centro: V3; larg: number; prof: number; y: number; vida: number; gelo?: number; racha?: number; novo?: number; t?: number}> = ({
  tema,
  centro,
  larg,
  prof,
  y,
  vida,
  gelo = 0,
  racha = 0,
  novo = 0,
  t = 0,
}) => {
  if (vida <= 0.01) return null;
  const corGelo = mistura(tema.objetoClaro, tema.ceuLuz, 0.5);
  const cor = mistura(mistura(tema.objeto, corGelo, gelo), tema.acento, novo);
  return (
    <group position={[centro[0], y, centro[2]]} scale={[vida, 1, vida]}>
      <mesh>
        <boxGeometry args={[larg, 0.06, prof]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.25 + 0.2 * novo} transparent opacity={0.38} depthWrite={false} roughness={0.15} />
      </mesh>
      {[
        [0, prof / 2, larg, 0.06],
        [0, -prof / 2, larg, 0.06],
        [larg / 2, 0, 0.06, prof],
        [-larg / 2, 0, 0.06, prof],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <boxGeometry args={[w, 0.08, d]} />
          <meshBasicMaterial color={cor} toneMapped={false} />
        </mesh>
      ))}
      {/* Cristais de gelo em cima */}
      {gelo > 0.02
        ? Array.from({length: 11}).map((_, i) => {
            const fx = Math.sin(i * 7.31) * 0.42;
            const fz = Math.cos(i * 3.17) * 0.38;
            const s = (0.07 + 0.05 * ((i * 37) % 5) / 4) * gelo;
            return (
              <mesh key={i} position={[fx * larg, 0.04 + s * 0.8, fz * prof]} rotation={[i, i * 0.7 + t * 0.1, 0]} scale={[s, s * 1.8, s]}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={corGelo} emissive={corGelo} emissiveIntensity={0.35} roughness={0.2} transparent opacity={0.85} />
              </mesh>
            );
          })
        : null}
      {/* Rachaduras: traços claros que crescem a partir do ponto onde a barra bateu */}
      {racha > 0.02
        ? [0.3, 1.4, 2.5, 3.6, 4.8].map((a, i) => {
            const L = (0.25 + 0.12 * (i % 3)) * larg * c01(racha * 1.3 - i * 0.08);
            if (L < 0.01) return null;
            return (
              <mesh key={i} position={[Math.cos(a) * L * 0.5, 0.045, Math.sin(a) * L * 0.5]} rotation={[0, -a, 0]}>
                <boxGeometry args={[L, 0.012, 0.025]} />
                <meshBasicMaterial color={tema.objetoClaro} toneMapped={false} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

// ---------- Etiqueta de preço (inflação) ----------
export const EtiquetaPreco: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; destaque?: number}> = ({tema, pos, rot = [0, 0, 0], escala, destaque = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.34, 0.2, 0.02]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, destaque)} emissivo={0.3 * destaque} sombra={false} />
      <mesh position={[-0.12, 0, 0.012]}>
        <circleGeometry args={[0.025, 14]} />
        <meshBasicMaterial color={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.14, 0.03, 0.022]} raio={0.008} cor={tema.objetoEscuro} sombra={false} position={[0.04, 0.03, 0.002]} />
      <Caixa args={[0.1, 0.03, 0.022]} raio={0.008} cor={tema.objetoEscuro} sombra={false} position={[0.02, -0.03, 0.002]} />
      {/* Barbante */}
      <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, 0.9]}>
        <cylinderGeometry args={[0.005, 0.005, 0.14, 5]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );

// ---------- Plenário do Senado: 81 cadeiras em meia-lua, abertas para +z ----------
// `acesos` 0..81: quantas cadeiras já votaram (acendem da esquerda para a direita). As que sobram ficam escuras.
const FILEIRAS = [
  {r: 1.5, n: 15},
  {r: 2.05, n: 19},
  {r: 2.6, n: 22},
  {r: 3.15, n: 25},
];
const CADEIRAS: {p: V3; ang: number; ordem: number}[] = (() => {
  const out: {p: V3; ang: number; ordem: number}[] = [];
  FILEIRAS.forEach((f, fi) => {
    for (let i = 0; i < f.n; i++) {
      const a = Math.PI * (0.06 + (0.88 * i) / (f.n - 1));
      out.push({p: [-Math.cos(a) * f.r, 0.14 + fi * 0.16, -Math.sin(a) * f.r], ang: a, ordem: 0});
    }
  });
  // Ordem de acender: da esquerda para a direita, misturando as fileiras.
  const idx = out.map((_, i) => i).sort((a, b) => out[a].ang - out[b].ang);
  idx.forEach((k, o) => (out[k].ordem = o));
  return out;
})();
const AUSENTES = [12, 47, 70]; // 3 senadores que não votaram (78 de 81)
export const Plenario: React.FC<{tema: Tema; pos: V3; escala: number; acesos: number}> = ({tema, pos, escala, acesos}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} scale={escala}>
      {FILEIRAS.map((f, fi) => (
        <mesh key={fi} position={[0, 0.04 + fi * 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[f.r - 0.26, f.r + 0.26, 48, 1, 0, Math.PI]} />
          <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.branco, 0.3 + fi * 0.1)} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {CADEIRAS.map((c, i) => {
        const ausente = AUSENTES.includes(c.ordem);
        const ordemVoto = c.ordem - AUSENTES.filter((a) => a < c.ordem).length;
        const k = ausente ? 0 : c01(acesos - ordemVoto);
        return (
          <group key={i} position={c.p} rotation={[0, Math.PI / 2 - c.ang, 0]}>
            <Caixa args={[0.2, 0.16 + 0.06 * k, 0.2]} raio={0.04} cor={mistura(tema.corpo, tema.acento, k)} emissivo={0.45 * k} position={[0, 0.08, 0]} />
            <Caixa args={[0.2, 0.2, 0.05]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.6 * k)} position={[0, 0.2, -0.09]} />
          </group>
        );
      })}
      {/* Mesa diretora */}
      <Caixa args={[1.6, 0.5, 0.5]} raio={0.06} cor={tema.objeto} position={[0, 0.25, 0.5]} />
    </group>
  );
};

// ---------- Bairro de lojinhas (os 3,6 milhões): instanciado, poucas chamadas de desenho ----------
export type LojaMini = {x: number; z: number; rot: number; s: number; acende: number; corrente: number};
const tmp = new THREE.Object3D();
const cor = new THREE.Color();
const G_CORPO = geoCaixa(1.3, 1.1, 1.0, 0.06);
const G_TOLDO = geoCaixa(1.4, 0.06, 0.5, 0.02);
const G_CADEADO = geoCaixa(0.32, 0.28, 0.12, 0.04);
export const BairroLojinhas: React.FC<{tema: Tema; lojas: LojaMini[]}> = ({tema, lojas}) => {
  const n = lojas.length;
  const preparar = (parte: 'corpo' | 'toldo' | 'cadeado') => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    lojas.forEach((l, i) => {
      const s = Math.max(0.0001, l.s);
      tmp.rotation.set(0, l.rot, 0);
      if (parte === 'corpo') {
        tmp.position.set(l.x, 0.55 * s, l.z);
        tmp.scale.setScalar(s);
        cor.set(mistura(tema.objetoEscuro, tema.objeto, 0.25 + 0.35 * l.acende));
      } else if (parte === 'toldo') {
        const dx = Math.sin(l.rot) * 0.68 * s;
        const dz = Math.cos(l.rot) * 0.68 * s;
        tmp.position.set(l.x + dx, 1.0 * s, l.z + dz);
        tmp.rotateX(0.45);
        tmp.scale.setScalar(s);
        cor.set(mistura(tema.corpo, tema.acento, l.acende));
      } else {
        const c = Math.max(0.0001, l.corrente * s);
        const dx = Math.sin(l.rot) * 0.56 * s;
        const dz = Math.cos(l.rot) * 0.56 * s;
        tmp.position.set(l.x + dx, 0.45 * s - 0.6 * (1 - l.corrente) * s, l.z + dz);
        tmp.scale.setScalar(c);
        cor.set(tema.acento);
      }
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      mesh.setColorAt(i, cor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  if (n === 0) return null;
  const algumaCorrente = lojas.some((l) => l.corrente > 0.01);
  return (
    <>
      <instancedMesh key={`c${n}`} ref={preparar('corpo')} args={[G_CORPO, undefined, n]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.72} />
      </instancedMesh>
      <instancedMesh key={`t${n}`} ref={preparar('toldo')} args={[G_TOLDO, undefined, n]} castShadow>
        <meshStandardMaterial roughness={0.6} emissive={tema.acento} emissiveIntensity={0.08} />
      </instancedMesh>
      {algumaCorrente ? (
        <instancedMesh key={`k${n}`} ref={preparar('cadeado')} args={[G_CADEADO, undefined, n]}>
          <meshStandardMaterial roughness={0.5} emissive={tema.acento} emissiveIntensity={0.35} />
        </instancedMesh>
      ) : null}
    </>
  );
};

// ---------- Prédio de escritórios (a empresa que já recebia nota) ----------
export const Escritorio: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; luz?: number}> = ({tema, pos, rotY = 0, escala, luz = 0}) => {
  if (escala < 0.02) return null;
  const L = 2.6;
  const A = 3.6;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[L, A, 1.8]} raio={0.06} cor={tema.objeto} position={[0, A / 2, 0]} />
      <Caixa args={[L + 0.1, 0.1, 1.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, A + 0.05, 0]} />
      {/* Janelas em faixas */}
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 4}).map((_, c) => (
          <Caixa key={`${r}${c}`} args={[0.42, 0.4, 0.02]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.25 * luz)} emissivo={0.35 * luz} sombra={false} position={[-0.9 + c * 0.6, 1.25 + r * 0.6, 0.905]} />
        )),
      )}
      {/* Porta de vidro e marquise */}
      <Caixa args={[0.8, 0.85, 0.02]} raio={0.02} cor={tema.objetoEscuro} sombra={false} position={[0, 0.43, 0.905]} />
      <Caixa args={[1.3, 0.06, 0.45]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.95, 1.1]} />
    </group>
  );
};
