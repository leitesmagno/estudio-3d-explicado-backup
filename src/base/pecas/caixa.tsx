// Estúdio 3D Explicado · Fosco (material) e Caixa (bloco arredondado)
import React from 'react';
import type {ThreeElements} from '@react-three/fiber';
import type {V3} from './tipos';
import {useGeoCaixa} from './geometria';

/**
 * Material fosco padrão (sem brilho de plástico). Use dentro de <mesh>.
 * - cor: hex. emissivo: 0 a 1, faz a peça "acender" na própria cor (para o acento). Padrão 0.
 * - opacidade: 0 a 1 (padrão 1). aspereza: 0 a 1 (padrão 0.82).
 */
export const Fosco: React.FC<{cor: string; emissivo?: number; opacidade?: number; aspereza?: number; dupla?: boolean}> = ({cor, emissivo = 0, opacidade = 1, aspereza = 0.82, dupla}) => (
  <meshStandardMaterial
    color={cor}
    roughness={aspereza}
    metalness={0}
    emissive={cor}
    emissiveIntensity={Math.max(0, emissivo)}
    transparent={opacidade < 1}
    opacity={opacidade}
    depthWrite={opacidade >= 1}
    side={dupla ? 2 : 0}
  />
);

type MeshProps = Omit<ThreeElements['mesh'], 'args' | 'position' | 'rotation' | 'scale'>;

/**
 * Bloco arredondado fosco, a peça mais usada.
 * - args: [largura, altura, profundidade] (centrado na posição).
 * - raio: raio da quina (padrão 0.05). cor: hex. emissivo: 0 a 1.
 * - sombra: projeta e recebe sombra (padrão true; use false em detalhes pequenos e coisas que brilham).
 * - position, rotation, scale: como em <mesh>. Filhos ficam presos à caixa.
 */
export const Caixa: React.FC<
  {
    args: V3 | [number, number, number];
    raio?: number;
    cor: string;
    emissivo?: number;
    opacidade?: number;
    sombra?: boolean;
    position?: V3;
    rotation?: V3;
    scale?: number | V3;
    children?: React.ReactNode;
  } & MeshProps
> = ({args, raio = 0.05, cor, emissivo = 0, opacidade = 1, sombra = true, position, rotation, scale, children, ...resto}) => {
  const g = useGeoCaixa(args[0], args[1], args[2], raio);
  return (
    <mesh geometry={g} position={position} rotation={rotation} scale={scale} castShadow={sombra} receiveShadow={sombra} {...resto}>
      <Fosco cor={cor} emissivo={emissivo} opacidade={opacidade} />
      {children}
    </mesh>
  );
};
