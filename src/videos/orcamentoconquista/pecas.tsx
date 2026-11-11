import React from 'react';
import {Fosco, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 022. orçamento de vitória da conquista. O resto vem do 017 (../orcamentoitabuna/pecas).

/** Morros baixos do planalto na borda da maquete (meias-esferas achatadas, verdes e foscas). */
export const MorrosPlanalto: React.FC<{tema: Tema}> = ({tema}) => {
  const morros: [V3, number, number][] = [
    [[-7.4, 0, -4.6], 1.5, 0.55],
    [[-5.6, 0, -7.0], 1.3, 0.5],
    [[6.9, 0, -4.6], 1.6, 0.6],
    [[5.0, 0, -7.0], 1.2, 0.45],
    [[-8.0, 0, 2.6], 1.0, 0.4],
    [[7.9, 0, 0.4], 0.9, 0.4],
  ];
  const verde = mistura(tema.festa?.verde ?? tema.objeto, tema.objetoEscuro, 0.5);
  return (
    <group>
      {morros.map(([p, r, h], i) => (
        <mesh key={i} position={[p[0], 0.06, p[2]]} scale={[1, h, 1]} receiveShadow castShadow>
          <sphereGeometry args={[r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Fosco cor={mistura(verde, tema.areia, 0.12 * (i % 2))} aspereza={0.95} />
        </mesh>
      ))}
    </group>
  );
};
