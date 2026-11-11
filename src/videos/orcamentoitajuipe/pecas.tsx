import React from 'react';
import {Fosco, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {coresOI} from '../orcamentoitabuna/pecas';

// Peças novas do 037. orçamento de itajuípe. As da série vêm de ../orcamentoitabuna/pecas, ../orcamentocanavieiras/pecas
// e ../orcamentoparatinga/pecas (PastaProcesso, RuaPlaca, BaseGaveta).

/** Pé de cacau (região cacaueira): tronco curto, copa baixa e frutos amarelos presos ao tronco. Sem marca. */
export const PeCacau: React.FC<{tema: Tema; pos: V3; escala?: number; rotY?: number}> = ({tema, pos, escala = 1, rotY = 0}) => {
  const tronco = mistura(tema.objetoEscuro, tema.areia, 0.25);
  const C = coresOI(tema);
  const copa = mistura(C.grama, tema.areia, 0.12);
  const fruto = mistura(C.ouro, tema.areia, 0.2);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.9, 8]} />
        <Fosco cor={tronco} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 16, 12]} />
        <Fosco cor={copa} />
      </mesh>
      {[0, 2.1, 4.2].map((a, k) => (
        <mesh key={k} position={[Math.sin(a) * 0.1, 0.32 + 0.12 * k, Math.cos(a) * 0.1]} rotation={[0.3, a, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.1, 4, 8]} />
          <Fosco cor={fruto} />
        </mesh>
      ))}
    </group>
  );
};

/** Árvores apagadas (setor sem gasto em programas): mesma forma da ArvoreRedonda, em cinza. */
export const ArvoreCinza: React.FC<{tema: Tema; pos: V3; r?: number; cresce?: number}> = ({tema, pos, r = 0.5, cresce = 1}) => {
  if (cresce < 0.02) return null;
  const cinza = mistura(tema.objetoEscuro, tema.objetoClaro, 0.35);
  return (
    <group position={pos} scale={cresce}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 1.4, 10]} />
        <Fosco cor={mistura(cinza, tema.objetoEscuro, 0.4)} />
      </mesh>
      <mesh position={[0, 1.2 + r * 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[r, 22, 18]} />
        <Fosco cor={cinza} />
      </mesh>
    </group>
  );
};
