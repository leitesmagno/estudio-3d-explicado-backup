import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {coresOI} from '../orcamentoitabuna/pecas';

// Peças novas do 025. orçamento de eunápolis. O resto vem do 017 (../orcamentoitabuna/pecas): prédios das
// áreas, pilhas de dinheiro, régua do teto e copos dos pisos. Eunápolis não fica no mar: a maquete ganha
// morros e mata verde na borda do fundo.

/** Mesa redonda da série com morros verdes e manchas de mata na borda do fundo (sem mar e sem rio). */
export const MesaEunapolis: React.FC<{tema: Tema}> = ({tema}) => {
  const C = coresOI(tema);
  const mata = mistura(C.grama, tema.objetoEscuro, 0.25);
  const morros: [number, number, number][] = [
    // ângulo (graus, 180 = fundo), raio, tamanho
    [128, 7.9, 1.3],
    [148, 8.1, 1.7],
    [166, 7.8, 1.4],
    [184, 8.2, 1.9],
    [202, 7.9, 1.5],
    [220, 8.1, 1.6],
    [238, 7.9, 1.2],
  ];
  return (
    <group>
      <mesh position={[0, -0.36, 0]} receiveShadow>
        <cylinderGeometry args={[9.4, 9.2, 0.8, 96]} />
        <Fosco cor={C.madeira} aspereza={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[9.0, 9.0, 0.02, 96]} />
        <Fosco cor={C.areia} aspereza={0.95} />
      </mesh>
      {(
        [
          [-6.4, -3.8, 1.6],
          [6.9, 3.2, 1.2],
          [-6.9, 3.4, 1.4],
          [-2.6, 7.6, 1.0],
        ] as [number, number, number][]
      ).map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.075, z]} receiveShadow>
          <cylinderGeometry args={[r, r, 0.02, 40]} />
          <Fosco cor={C.grama} aspereza={0.95} />
        </mesh>
      ))}
      {/* faixa de mata no fundo e os morros por cima dela */}
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.0, 8.98, 64, 1, (35 * Math.PI) / 180, (110 * Math.PI) / 180]} />
        <Fosco cor={mata} aspereza={0.95} />
      </mesh>
      {morros.map(([g, r, t], i) => {
        const a = (g * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.sin(a) * r, 0.06, Math.cos(a) * r]} scale={[t, t * 0.55, t]} castShadow receiveShadow>
            <sphereGeometry args={[1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Fosco cor={mistura(mata, C.grama, 0.3 + 0.15 * (i % 3))} aspereza={0.95} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Placa vazia com um "?" grande: a linha que nem aparece no relatório. */
export const PlacaInterrogacao: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.1, 1.3, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.65, 0]} />
      <Caixa args={[1.5, 1.0, 0.08]} raio={0.03} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[0, 1.6, 0]} />
      <Placa tema={tema} pos={[0, 1.6, 0.05]} larg={1.4} alt={0.9} linhas={[{t: '?', tam: 520, cor: tema.objetoClaro, peso: 900}]} fundo={mistura(tema.objeto, tema.objetoEscuro, 0.3)} brilho={0.2} />
    </group>
  );

/** Quadra de esporte pequena: piso verde, linhas brancas e duas traves (frente z+). */
export const QuadraMini: React.FC<{tema: Tema; pos: V3; rotY?: number; sobe: number; aceso: number}> = ({tema, pos, rotY = 0, sobe, aceso}) => {
  const C = coresOI(tema);
  if (sobe < 0.02) return null;
  return (
    <group position={[pos[0], pos[1] - 0.3 * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]}>
      <Caixa args={[2.2, 0.06, 1.3]} raio={0.02} cor={mistura(C.grama, tema.acento, 0.25 * aceso)} position={[0, 0.12, 0]} />
      {[-1.0, 0, 1.0].map((x) => (
        <Caixa key={x} args={[0.03, 0.01, 1.2]} raio={0.004} cor={tema.objetoClaro} position={[x, 0.157, 0]} sombra={false} />
      ))}
      {[-1.05, 1.05].map((x) => (
        <group key={x} position={[x, 0.15, 0]}>
          <Caixa args={[0.04, 0.4, 0.04]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.2, -0.3]} />
          <Caixa args={[0.04, 0.4, 0.04]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.2, 0.3]} />
          <Caixa args={[0.04, 0.04, 0.64]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.4, 0]} />
        </group>
      ))}
    </group>
  );
};
