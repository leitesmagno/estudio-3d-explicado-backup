// Estúdio 3D Explicado · Particulas, Onda e Vapor (efeitos suaves, sem piscar)
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import type {V3} from './tipos';
import {G} from './geometria';
import {usarTemaAtivo} from './palco';
import {mistura} from '../cores';

// número pseudoaleatório fixo por índice (o mesmo em todo quadro)
const acaso = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const dummy = new THREE.Object3D();

/**
 * Poeira de luz flutuando devagar (dá profundidade ao ar). Uma só malha instanciada.
 * - t: tempo em segundos. centro: centro da nuvem. raio: tamanho da nuvem. n: quantidade (padrão 50).
 * - cor: hex (padrão: tom claro do tema). opacidade: padrão 0.5.
 */
export const Particulas: React.FC<{t: number; centro: V3; raio: number; n?: number; cor?: string; opacidade?: number; tamanho?: number}> = ({t, centro, raio, n = 50, cor, opacidade = 0.4, tamanho = 1}) => {
  const tema = usarTemaAtivo();
  const ref = useRef<THREE.InstancedMesh>(null);
  const corFinal = cor ?? mistura(tema.objetoClaro, tema.fundo, 0.4);
  const base = useMemo(
    () =>
      Array.from({length: n}, (_, i) => ({
        x: (acaso(i, 1) * 2 - 1) * raio,
        y: (acaso(i, 2) * 2 - 1) * raio * 0.45,
        z: (acaso(i, 3) * 2 - 1) * raio,
        r: (0.008 + acaso(i, 4) * 0.014) * tamanho * Math.max(1, raio / 12),
        v: 0.15 + acaso(i, 5) * 0.25,
        f: acaso(i, 6) * Math.PI * 2,
      })),
    [n, raio, tamanho],
  );
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    base.forEach((p, i) => {
      const subida = ((p.y / (raio * 0.45) + 1) / 2 + t * p.v * 0.04) % 1; // sobe bem devagar e volta por baixo
      const y = (subida * 2 - 1) * raio * 0.45;
      const borda = Math.min(1, Math.min(subida, 1 - subida) * 6); // nasce e some nas bordas, sem estalo
      dummy.position.set(centro[0] + p.x + Math.sin(t * p.v + p.f) * 0.25, centro[1] + y, centro[2] + p.z + Math.cos(t * p.v * 0.8 + p.f) * 0.25);
      dummy.scale.setScalar(p.r * (0.3 + 0.7 * borda));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[G.esferaBaixa, undefined, n]} frustumCulled={false}>
      <meshBasicMaterial color={corFinal} transparent opacity={opacidade} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
};

/**
 * Onda no chão: um anel que se abre e some. Marca "aconteceu aqui".
 * - pos: centro (no chão). k: 0 a 1, progresso da onda (fora disso some). cor: hex. raio: tamanho final.
 */
export const Onda: React.FC<{pos: V3; k: number; cor: string; raio: number}> = ({pos, k, cor, raio}) => {
  if (k <= 0.001 || k >= 0.999) return null;
  const e = 1 - Math.pow(1 - k, 3);
  const aneis = [0, 0.18];
  return (
    <group position={[pos[0], pos[1] + 0.015, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {aneis.map((atraso, i) => {
        const kk = Math.max(0, Math.min(1, (k - atraso) / (1 - atraso)));
        if (kk <= 0) return null;
        const ee = 1 - Math.pow(1 - kk, 3);
        const r = raio * (0.12 + 0.88 * ee);
        const op = (i === 0 ? 0.85 : 0.45) * Math.min(1, kk * 6) * (1 - kk);
        return (
          <mesh key={i} scale={[r, r, 1]} geometry={G.anel}>
            <meshBasicMaterial color={cor} transparent opacity={op} depthWrite={false} toneMapped={false} side={2} />
          </mesh>
        );
      })}
      <mesh scale={[raio * (0.12 + 0.88 * e), raio * (0.12 + 0.88 * e), 1]} geometry={G.disco}>
        <meshBasicMaterial color={cor} transparent opacity={0.1 * (1 - k)} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

/**
 * Vapor ou fumaça leve subindo em ciclo contínuo.
 * - pos: saída do vapor. t: tempo em segundos (some um valor para desencontrar duas saídas).
 * - cor: hex (padrão creme do tema). escala: tamanho (padrão 1).
 */
export const Vapor: React.FC<{pos: V3; t: number; cor?: string; escala?: number; n?: number}> = ({pos, t, cor, escala = 1, n = 6}) => {
  const tema = usarTemaAtivo();
  const c = cor ?? tema.objetoClaro;
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: n}).map((_, i) => {
        const vida = (t * 0.7 + i / n) % 1;
        const r = 0.05 + 0.16 * vida;
        const op = 0.42 * Math.sin(Math.PI * vida);
        return (
          <mesh key={i} geometry={G.esferaBaixa} position={[Math.sin(i * 2.3 + t * 0.9) * 0.05 * vida, 0.9 * vida, Math.cos(i * 1.7) * 0.04 * vida]} scale={r}>
            <meshStandardMaterial color={c} roughness={1} transparent opacity={op} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
