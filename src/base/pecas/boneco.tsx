// Estúdio 3D Explicado · Boneco (manequim fosco, sem rosto)
import React from 'react';
import * as THREE from 'three';
import type {Tema} from '../tema';
import type {Pose, V3} from './tipos';
import {Fosco} from './caixa';
import {geoCaixa} from './geometria';

// Medidas na escala 1 (altura total cerca de 1,84). A frente é z+.
export const MEDIDAS_BONECO = {
  altura: 1.84,
  quadril: 0.9,
  ombroY: 1.3,
  ombroX: 0.27,
  braco: 0.27,
  antebraco: 0.27,
  peitoZ: 0.2,
  cabecaY: 1.68,
} as const;

// Geometrias compartilhadas por todos os bonecos (nunca descartar).
const GB = {
  tronco: new THREE.CapsuleGeometry(0.19, 0.3, 8, 20),
  cabeca: new THREE.SphereGeometry(0.155, 28, 20),
  pescoco: new THREE.CylinderGeometry(0.06, 0.07, 0.12, 14),
  braco: new THREE.CapsuleGeometry(0.064, 0.17, 6, 14),
  antebraco: new THREE.CapsuleGeometry(0.057, 0.17, 6, 14),
  mao: new THREE.SphereGeometry(0.066, 16, 12),
  coxa: new THREE.CapsuleGeometry(0.085, 0.3, 6, 14),
  canela: new THREE.CapsuleGeometry(0.074, 0.3, 6, 14),
  pe: geoCaixa(0.13, 0.07, 0.25, 0.03),
  quadril: new THREE.CapsuleGeometry(0.17, 0.12, 6, 16),
};
GB.quadril.rotateZ(Math.PI / 2);

const Parte: React.FC<{g: THREE.BufferGeometry; cor: string; position?: V3; rotation?: V3; sombra?: boolean}> = ({g, cor, position, rotation, sombra = true}) => (
  <mesh geometry={g} position={position} rotation={rotation} castShadow={sombra} receiveShadow={sombra}>
    <Fosco cor={cor} aspereza={0.78} />
  </mesh>
);

const Braco: React.FC<{lado: 1 | -1; ombro: V3; cotovelo: number; cor: string}> = ({lado, ombro, cotovelo, cor}) => (
  <group position={[lado * MEDIDAS_BONECO.ombroX, MEDIDAS_BONECO.ombroY - MEDIDAS_BONECO.quadril, 0]} rotation={ombro}>
    <Parte g={GB.braco} cor={cor} position={[0, -0.135, 0]} />
    <group position={[0, -MEDIDAS_BONECO.braco, 0]} rotation={[cotovelo, 0, 0]}>
      <Parte g={GB.antebraco} cor={cor} position={[0, -0.135, 0]} />
      <Parte g={GB.mao} cor={cor} position={[0, -0.29, 0.005]} />
    </group>
  </group>
);

const Perna: React.FC<{lado: 1 | -1; giro: number; cor: string}> = ({lado, giro, cor}) => {
  const joelho = Math.max(0, -giro) * 1.1 + 0.04; // dobra quando a perna vai para trás
  return (
    <group position={[lado * 0.105, MEDIDAS_BONECO.quadril, 0]} rotation={[giro, 0, 0]}>
      <Parte g={GB.coxa} cor={cor} position={[0, -0.225, 0]} />
      <group position={[0, -0.45, 0]} rotation={[joelho, 0, 0]}>
        <Parte g={GB.canela} cor={cor} position={[0, -0.215, 0]} />
        <group rotation={[-joelho * 0.6, 0, 0]} position={[0, -0.415, 0]}>
          <Parte g={GB.pe} cor={cor} position={[0, 0, 0.055]} />
        </group>
      </group>
    </group>
  );
};

/**
 * Pessoa genérica, fosca e sem rosto (frente em z+). Os filhos ficam presos ao corpo, em
 * coordenadas do boneco na escala 1: peito em [0, 1.32, 0.2], mão à frente em [0, 1.17, 0.42]
 * com os braços para a frente (ombro -0.75, cotovelo -1.25).
 * - tema, pos, rotY (giro em radianos), escala (padrão 1; some abaixo de 0.02).
 * - cor: cor do corpo (padrão tema.pessoa; use tema.corpo para o protagonista e tema.acento para destacar).
 * - pose: veja Pose.
 */
export const Boneco: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; cor?: string; pose?: Pose; children?: React.ReactNode}> = ({tema, pos, rotY = 0, escala = 1, cor, pose = {}, children}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.pessoa;
  const passo = pose.passo ?? 0;
  const balanco = passo * 0.55;
  const ombroD: V3 = pose.ombroD ?? [-passo * 0.45, 0, 0.07];
  const ombroE: V3 = pose.ombroE ?? [passo * 0.45, 0, -0.07];
  const cotD = pose.cotoveloD ?? -0.12 - Math.abs(passo) * 0.25;
  const cotE = pose.cotoveloE ?? -0.12 - Math.abs(passo) * 0.25;
  const tronco = pose.tronco ?? 0;
  const pulo = Math.abs(passo) * 0.025;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <group position={[0, pulo, 0]}>
        <Perna lado={1} giro={-balanco} cor={c} />
        <Perna lado={-1} giro={balanco} cor={c} />
        <group position={[0, MEDIDAS_BONECO.quadril, 0]} rotation={[tronco, 0, 0]}>
          <Parte g={GB.quadril} cor={c} position={[0, 0.02, 0]} />
          <Parte g={GB.tronco} cor={c} position={[0, 0.27, 0]} />
          <Parte g={GB.pescoco} cor={c} position={[0, 0.66, 0]} />
          <group position={[0, 0.7, 0]} rotation={pose.cabeca ?? [0, 0, 0]}>
            <Parte g={GB.cabeca} cor={c} position={[0, 0.09, 0.005]} />
          </group>
          <Braco lado={1} ombro={ombroD} cotovelo={cotD} cor={c} />
          <Braco lado={-1} ombro={ombroE} cotovelo={cotE} cor={c} />
        </group>
        {children}
      </group>
    </group>
  );
};
