import React from 'react';
import * as THREE from 'three';
import {Fosco, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';

// Peças 3D comuns da série da Tinho: olhos de personagem, mola helicoidal e roda.

const PI = Math.PI;
export type Olhar = 'ok' | 'medo' | 'tchau' | 'feliz' | 'sono';

/** Olhos e boca de personagem (frente em z+), centrados em pos. esc 1 = olhos de 4,5 cm. */
export const Olhos: React.FC<{tema: Tema; pos: V3; esc?: number; olhar?: Olhar; mira?: [number, number]; rotY?: number}> = ({tema, pos, esc = 1, olhar = 'ok', mira = [0, 0], rotY = 0}) => {
  const pupila = olhar === 'medo' ? 0.014 : 0.022;
  const fechado = (x: number) => (
    <mesh position={[x, 0, 0.02]}>
      <boxGeometry args={[0.075, 0.013, 0.012]} />
      <Fosco cor={tema.tinta} />
    </mesh>
  );
  const olho = (x: number, fecha: boolean) =>
    fecha ? (
      fechado(x)
    ) : (
      <group position={[x, 0, 0]}>
        <mesh>
          <sphereGeometry args={[olhar === 'medo' ? 0.05 : 0.045, 20, 14]} />
          <Fosco cor={tema.branco} aspereza={0.5} />
        </mesh>
        <mesh position={[mira[0] * 0.015, mira[1] * 0.015, 0.04]}>
          <sphereGeometry args={[pupila, 14, 10]} />
          <Fosco cor={tema.tinta} aspereza={0.3} />
        </mesh>
      </group>
    );
  return (
    <group position={pos} scale={esc} rotation={[0, rotY, 0]}>
      {olho(-0.05, olhar === 'sono')}
      {olho(0.05, olhar === 'tchau' || olhar === 'sono')}
      {olhar === 'medo' ? (
        <>
          <mesh position={[-0.05, 0.075, 0.02]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <Fosco cor={tema.tinta} />
          </mesh>
          <mesh position={[0.05, 0.075, 0.02]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <Fosco cor={tema.tinta} />
          </mesh>
          <mesh position={[0, -0.09, 0.005]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.025, 14, 10]} />
            <Fosco cor={tema.tinta} />
          </mesh>
        </>
      ) : olhar === 'sono' ? (
        <mesh position={[0, -0.08, 0.005]}>
          <boxGeometry args={[0.04, 0.01, 0.01]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      ) : (
        <mesh position={[0, -0.085, 0.005]} rotation={[0, 0, PI]}>
          <torusGeometry args={[olhar === 'ok' ? 0.032 : 0.042, 0.009, 8, 20, PI]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      )}
    </group>
  );
};

/** Mola helicoidal de altura 1 (base em y = 0), para esticar com scale y. */
const geoMola = (raio: number, voltas: number, fio: number) => {
  const n = voltas * 24;
  const pts = Array.from({length: n + 1}, (_, i) => {
    const u = i / n;
    const a = u * voltas * 2 * PI;
    return new THREE.Vector3(raio * Math.cos(a), u, raio * Math.sin(a));
  });
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), voltas * 40, fio, 10, false);
};
const MOLAS = new Map<string, THREE.TubeGeometry>();
export const Mola: React.FC<{pos: V3; alt: number; raio?: number; voltas?: number; fio?: number; cor: string; emissivo?: number}> = ({pos, alt, raio = 0.22, voltas = 7, fio = 0.028, cor, emissivo = 0}) => {
  const chave = `${raio}|${voltas}|${fio}`;
  if (!MOLAS.has(chave)) MOLAS.set(chave, geoMola(raio, voltas, fio));
  return (
    <mesh geometry={MOLAS.get(chave)} position={pos} scale={[1, Math.max(0.05, alt), 1]} castShadow>
      <Fosco cor={cor} emissivo={emissivo} aspereza={0.45} />
    </mesh>
  );
};

/** Roda de pé (eixo em z): pneu e aro. giro em rad. */
export const Roda: React.FC<{tema: Tema; pos: V3; r?: number; giro?: number; escala?: number}> = ({tema, pos, r = 0.55, giro = 0, escala = 1}) => (
  <group position={pos} scale={escala} rotation={[0, 0, -giro]}>
    <mesh castShadow>
      <torusGeometry args={[r * 0.72, r * 0.28, 16, 40]} />
      <Fosco cor={tema.tinta} aspereza={0.85} />
    </mesh>
    <mesh rotation={[PI / 2, 0, 0]}>
      <cylinderGeometry args={[r * 0.5, r * 0.5, r * 0.4, 32]} />
      <Fosco cor={tema.objetoClaro} aspereza={0.4} />
    </mesh>
    {[0, 1, 2, 3, 4].map((k) => (
      <mesh key={k} rotation={[0, 0, (k * 2 * PI) / 5]} position={[0, 0, r * 0.21]}>
        <boxGeometry args={[r * 0.12, r * 0.85, 0.02]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    ))}
  </group>
);
