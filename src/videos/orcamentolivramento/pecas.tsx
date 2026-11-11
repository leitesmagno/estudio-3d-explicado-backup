import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 047. orçamento de livramento de nossa senhora. As da série vêm de ../orcamentoitabuna/pecas,
// ../orcamentocanavieiras/pecas e ../orcamentoparatinga/pecas.

/** Chão de terra seca e rachada, num disco baixo. Aparece devagar (sobe de 0 a 1 em pelo menos 0,4 s, sem piscar). */
export const ChaoSeco: React.FC<{tema: Tema; pos: V3; raio: number; sobe: number}> = ({tema, pos, raio, sobe}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const terra = mistura(mistura(tema.areia, tema.festa?.rosa ?? tema.areia, 0.22), tema.objetoEscuro, 0.18);
  const racha = mistura(tema.areia, tema.objetoEscuro, 0.8);
  // rachaduras fixas (ângulo, raio interno, raio externo, desvio)
  const R: [number, number, number, number][] = [
    [0.2, 0.15, 0.95, 0.25],
    [1.25, 0.1, 0.85, -0.3],
    [2.3, 0.2, 0.9, 0.2],
    [3.4, 0.12, 0.8, -0.2],
    [4.4, 0.18, 0.92, 0.3],
    [5.5, 0.1, 0.75, -0.25],
  ];
  return (
    <group position={pos}>
      {/* disco: 0,04 acima do chão da mesa, para não chuviscar */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[raio, raio, 0.02, 48]} />
        <Fosco cor={terra} opacidade={s} />
      </mesh>
      {R.flatMap(([a, r0, r1, d], i) => {
        const pts: [number, number][] = [
          [r0, 0],
          [(r0 + r1) / 2, d * 0.35],
          [r1, d * 0.1],
        ];
        return pts.slice(1).map((p, j) => {
          const [x0, z0] = [Math.cos(a + pts[j][1]) * pts[j][0] * raio, Math.sin(a + pts[j][1]) * pts[j][0] * raio];
          const [x1, z1] = [Math.cos(a + p[1]) * p[0] * raio, Math.sin(a + p[1]) * p[0] * raio];
          const len = Math.hypot(x1 - x0, z1 - z0);
          return (
            <mesh key={`${i}-${j}`} position={[(x0 + x1) / 2, 0.056, (z0 + z1) / 2]} rotation={[0, -Math.atan2(z1 - z0, x1 - x0), 0]}>
              <boxGeometry args={[len * s, 0.008, 0.09]} />
              <Fosco cor={racha} opacidade={s} />
            </mesh>
          );
        });
      })}
    </group>
  );
};

/** Carro-pipa genérico: cabine, tanque redondo e rodas (sem marca). */
export const CarroPipa: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; sobe: number; aceso?: number}> = ({tema, pos, rotY = 0, escala = 1, sobe, aceso = 0}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const azul = mistura(tema.festa?.turquesa ?? tema.objetoClaro, tema.objetoClaro, 0.35);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala * s}>
      <Caixa args={[0.55, 0.5, 0.56]} raio={0.06} cor={tema.objetoClaro} position={[0.75, 0.38, 0]} />
      <Caixa args={[0.42, 0.22, 0.52]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.35)} emissivo={0.1} position={[0.82, 0.5, 0]} sombra={false} />
      <Caixa args={[1.25, 0.1, 0.58]} raio={0.02} cor={tema.objetoEscuro} position={[-0.15, 0.17, 0]} />
      <mesh position={[-0.15, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 1.2, 24]} />
        <Fosco cor={mistura(azul, tema.acento, 0.25 * aceso)} emissivo={0.08 * aceso} />
      </mesh>
      <Placa tema={tema} pos={[-0.15, 0.5, 0.29]} larg={0.9} alt={0.2} linhas={[{t: 'ÁGUA', tam: 150, cor: tema.texto, peso: 900}]} fundo={tema.cartao} brilho={0.2 + 0.3 * aceso} />
      {[-0.55, -0.1, 0.75].map((x) =>
        [-1, 1].map((l) => (
          <mesh key={`${x}${l}`} position={[x, 0.11, 0.28 * l]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        )),
      )}
    </group>
  );
};

/** Faixa de pano esticada entre dois mastros (para o palco: "2 MESES DE SÃO JOÃO"). */
export const FaixaMastros: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; sobe: number; texto: string; aceso: number}> = ({tema, pos, rotY = 0, escala = 1, sobe, texto, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {[-1.25, 1.25].map((x) => (
        <Caixa key={x} args={[0.07, 2.0, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={[x, 1.0, 0]} />
      ))}
      <Placa tema={tema} pos={[0, 1.55, 0.04]} larg={2.4} alt={0.55} linhas={[{t: texto, tam: texto.length > 18 ? 95 : 120, cor: mistura(tema.texto, tema.acento, 0.6 * aceso), peso: 900}]} fundo={tema.cartao} brilho={0.3 + 0.4 * aceso} />
    </group>
  );
};
