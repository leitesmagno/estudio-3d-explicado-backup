import React from 'react';
import {Fosco, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 026. orçamento de brumado. O resto vem do 017 (../orcamentoitabuna/pecas).

/** Morros e serra do sertão na borda da maquete: meias-esferas achatadas em tom de terra seca com pouco verde. */
export const SerraSertao: React.FC<{tema: Tema}> = ({tema}) => {
  const morros: [V3, number, number][] = [
    [[-7.4, 0, -4.6], 1.6, 0.75],
    [[-5.4, 0, -7.1], 1.4, 0.9],
    [[-2.6, 0, -8.2], 1.1, 0.6],
    [[6.9, 0, -4.6], 1.7, 0.8],
    [[4.8, 0, -7.1], 1.3, 0.95],
    [[1.6, 0, -8.3], 1.0, 0.55],
    [[-8.0, 0, 2.6], 1.0, 0.5],
    [[7.9, 0, 0.4], 0.9, 0.5],
  ];
  const terra = mistura(tema.areia, tema.objetoEscuro, 0.35);
  const mato = mistura(tema.festa?.verde ?? tema.objeto, tema.areia, 0.55);
  return (
    <group>
      {morros.map(([p, r, h], i) => (
        <mesh key={i} position={[p[0], 0.06, p[2]]} scale={[1, h, 1]} receiveShadow castShadow>
          <sphereGeometry args={[r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Fosco cor={i % 3 === 0 ? mistura(mato, terra, 0.4) : terra} aspereza={0.97} />
        </mesh>
      ))}
    </group>
  );
};
