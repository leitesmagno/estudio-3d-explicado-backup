import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {coresOI} from '../orcamentoitabuna/pecas';

// Peças novas do 024. orçamento de porto seguro. O resto vem do 017 (../orcamentoitabuna/pecas): prédios das
// áreas, pilhas de dinheiro, régua do teto e copos dos mínimos. Aqui a maquete ganha o mar e a praia ao fundo.

/** Prédio que sobe do chão (sobe 0 a 1). Some abaixo de 0,02. */
const Sobe: React.FC<{pos: V3; sobe: number; alt: number; rotY?: number; escala?: number; children: React.ReactNode}> = ({pos, sobe, alt, rotY = 0, escala = 1, children}) =>
  sobe < 0.02 ? null : (
    <group position={[pos[0], pos[1] - alt * escala * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {children}
    </group>
  );

const Letreiro: React.FC<{tema: Tema; texto: string; pos: V3; larg: number; aceso: number; tam?: number}> = ({tema, texto, pos, larg, aceso, tam = 200}) => (
  <Placa tema={tema} pos={pos} larg={larg} alt={larg * 0.24} linhas={[{t: texto, tam, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
);

/** Coqueiro: tronco fino levemente inclinado e copa de folhas em leque. */
export const Coqueiro: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) => {
  const C = coresOI(tema);
  const tronco = mistura(tema.objetoEscuro, tema.areia, 0.45);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <group rotation={[0, 0, 0.12]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 1.6, 10]} />
          <Fosco cor={tronco} />
        </mesh>
        {Array.from({length: 7}).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return (
            <group key={i} position={[0, 1.6, 0]} rotation={[0, a, 0]}>
              <mesh position={[0.32, -0.06, 0]} rotation={[0, 0, -0.45]} castShadow>
                <boxGeometry args={[0.7, 0.03, 0.16]} />
                <Fosco cor={C.grama} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/** Mesa redonda da série com o mar e a faixa de praia no fundo (atrás, z negativo), sem rio. */
export const MesaPortoSeguro: React.FC<{tema: Tema}> = ({tema}) => {
  const C = coresOI(tema);
  const praia = mistura(tema.areia, tema.objetoClaro, 0.25);
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
          [-6.4, -3.6, 1.6],
          [6.9, 3.2, 1.3],
          [-6.9, 4.0, 1.3],
          [-2.6, 7.6, 1.0],
        ] as [number, number, number][]
      ).map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.075, z]} receiveShadow>
          <cylinderGeometry args={[r, r, 0.02, 40]} />
          <Fosco cor={C.grama} aspereza={0.95} />
        </mesh>
      ))}
      {/* a faixa de praia e o mar: um arco no fundo da mesa (de 35° a 145° no plano, centrado no fundo; raio de 7,0 a 9,0) */}
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.0, 7.6, 64, 1, (35 * Math.PI) / 180, (110 * Math.PI) / 180]} />
        <Fosco cor={praia} aspereza={0.95} />
      </mesh>
      <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.6, 8.98, 64, 1, (35 * Math.PI) / 180, (110 * Math.PI) / 180]} />
        <Fosco cor={C.agua} aspereza={0.9} />
      </mesh>
    </group>
  );
};

/** Quiosque de turismo: balcão com toldo listrado e letreiro TURISMO (frente z+). */
export const QuiosqueTurismo: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => {
  const toldoA = mistura(tema.festa?.azul ?? tema.objeto, tema.objetoClaro, 0.25);
  const toldoB = tema.objetoClaro;
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.2} rotY={rotY} escala={escala}>
      <Caixa args={[2.2, 0.9, 1.2]} raio={0.05} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[0, 0.45, 0]} />
      {[-0.95, 0.95].map((x) => (
        <Caixa key={x} args={[0.08, 1.1, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[x, 1.45, 0.55]} />
      ))}
      {Array.from({length: 6}).map((_, i) => (
        <Caixa key={i} args={[0.4, 0.06, 1.5]} raio={0.02} cor={i % 2 ? toldoA : toldoB} position={[-1.0 + i * 0.4, 2.02, 0.15]} rotation={[0.18, 0, 0]} />
      ))}
      <Letreiro tema={tema} texto="TURISMO" pos={[0, 0.62, 0.62]} larg={1.5} aceso={aceso} tam={170} />
    </Sobe>
  );
};
