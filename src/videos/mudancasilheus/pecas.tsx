import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 009 (mudanças em Ilhéus). Tudo fosco, sem logo e sem rosto; o texto é fixo por peça.

// ---------- Tablado de um órgão (frente em z+), base no chão em pos ----------
// `larg` × `prof`, 0,12 de altura. `aceso` 0..1 acende a borda no acento (o órgão da frase).
export const Tablado: React.FC<{tema: Tema; pos: V3; larg: number; prof: number; aceso?: number}> = ({tema, pos, larg, prof, aceso = 0}) => (
  <group position={pos}>
    <Caixa args={[larg + 0.16, 0.08, prof + 0.16]} raio={0.035} cor={mistura(tema.objetoEscuro, tema.acento, 0.7 * aceso)} emissivo={0.3 * aceso} position={[0, 0.04, 0]} />
    <Caixa args={[larg, 0.12, prof]} raio={0.04} cor={mistura(tema.chao, tema.objeto, 0.42)} position={[0, 0.06, 0]} />
  </group>
);

// ---------- Plaquinha do órgão, em pé num pezinho (frente em z+) ----------
// 1,34 × 0,54 na escala 1, base do pezinho em pos. `aceso` 0..1: o fundo vai para o acento.
export const PlacaOrgao: React.FC<{tema: Tema; pos: V3; linhas: string[]; aceso?: number; escala?: number; alto?: number}> = ({tema, pos, linhas, aceso = 0, escala = 1, alto = 1.75}) => {
  if (escala < 0.02) return null;
  const tam = linhas.length > 1 ? 150 : 190;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.06, alto, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, alto / 2, -0.02]} />
      <Caixa args={[1.34, 0.54, 0.06]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.acento, aceso)} emissivo={0.35 * aceso} position={[0, alto + 0.25, 0]} />
      <Placa tema={tema} pos={[0, alto + 0.25, 0.036]} larg={1.24} alt={0.46} linhas={linhas.map((t) => ({t, tam, cor: tema.objetoClaro, peso: 850, mono: true}))} brilho={0.35} />
    </group>
  );
};

// ---------- Cadeirinha simples (assento e encosto), frente em z+ ----------
// 0,42 × 0,72 de altura na escala 1. `aceso` 0..1 acende o assento na cor `luz`.
export const Cadeirinha: React.FC<{tema: Tema; pos: V3; aceso?: number; luz?: string}> = ({tema, pos, aceso = 0, luz}) => {
  const assento = mistura(tema.objeto, luz ?? tema.acento, 0.75 * aceso);
  return (
    <group position={pos}>
      <Caixa args={[0.4, 0.3, 0.38]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.15, 0]} />
      <Caixa args={[0.44, 0.06, 0.42]} raio={0.025} cor={assento} emissivo={0.25 * aceso} position={[0, 0.33, 0]} />
      <Caixa args={[0.44, 0.4, 0.07]} raio={0.03} cor={assento} emissivo={0.25 * aceso} position={[0, 0.56, -0.18]} />
    </group>
  );
};

// ---------- Portão com placa na trave (frente em z+, a passagem vai de lado a lado em x) ----------
export const PortaoPlaca: React.FC<{tema: Tema; pos: V3; rotY?: number; larg?: number; texto: string; aceso?: number; cor?: string}> = ({tema, pos, rotY = 0, larg = 2.8, texto, aceso = 0, cor}) => {
  const c = cor ?? tema.acento;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {[-1, 1].map((l) => (
        <group key={l} position={[(l * larg) / 2, 0, 0]}>
          <Caixa args={[0.34, 0.2, 0.34]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
          <Caixa args={[0.24, 2.1, 0.24]} raio={0.05} cor={tema.objeto} position={[0, 1.2, 0]} />
        </group>
      ))}
      <Caixa args={[larg + 0.3, 0.5, 0.2]} raio={0.06} cor={mistura(tema.objetoEscuro, c, 0.85 * aceso)} emissivo={0.3 * aceso} position={[0, 2.45, 0]} />
      {[1, -1].map((l) => (
        <Placa key={l} tema={tema} pos={[0, 2.45, 0.105 * l]} rot={[0, l > 0 ? 0 : Math.PI, 0]} larg={larg + 0.1} alt={0.42} linhas={[{t: texto, tam: 230, cor: tema.objetoClaro, peso: 900, mono: true}]} brilho={0.35 + 0.4 * aceso} />
      ))}
    </group>
  );
};

// ---------- Cerca baixa em volta de um retângulo, com vãos nos portões ----------
// Retângulo de x0..x1 e z0..z1. `vaos`: [x, z0, z1] (vão na lateral x, entre z0 e z1).
export const Cerca: React.FC<{tema: Tema; x0: number; x1: number; z0: number; z1: number; vaos: [number, number, number][]}> = ({tema, x0, x1, z0, z1, vaos}) => {
  const cor = mistura(tema.objetoEscuro, tema.objeto, 0.35);
  const lados: {a: V3; b: V3}[] = [
    {a: [x0, 0, z0], b: [x1, 0, z0]},
    {a: [x0, 0, z1], b: [x1, 0, z1]},
  ];
  for (const x of [x0, x1]) {
    const v = vaos.filter((q) => Math.abs(q[0] - x) < 0.01).sort((p, q) => p[1] - q[1]);
    let z = z0;
    for (const q of v) {
      lados.push({a: [x, 0, z], b: [x, 0, q[1]]});
      z = q[2];
    }
    lados.push({a: [x, 0, z], b: [x, 0, z1]});
  }
  return (
    <group>
      {lados.map(({a, b}, i) => {
        const L = Math.hypot(b[0] - a[0], b[2] - a[2]);
        if (L < 0.05) return null;
        const m: V3 = [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
        const ry = Math.atan2(b[0] - a[0], b[2] - a[2]);
        const n = Math.max(1, Math.round(L / 3));
        return (
          <group key={i} position={m} rotation={[0, ry, 0]}>
            <Caixa args={[0.07, 0.07, L]} raio={0.03} cor={cor} position={[0, 0.55, 0]} />
            <Caixa args={[0.06, 0.06, L]} raio={0.025} cor={cor} position={[0, 0.28, 0]} />
            {Array.from({length: n + 1}, (_, k) => (
              <Caixa key={k} args={[0.12, 0.66, 0.12]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.33, -L / 2 + (k * L) / n]} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Calçada (laje baixa) ----------
export const Calcada: React.FC<{tema: Tema; pos: V3; larg: number; prof: number; aceso?: number; cor?: string}> = ({tema, pos, larg, prof, aceso = 0, cor}) => (
  <group position={pos}>
    <Caixa args={[larg, 0.08, prof]} raio={0.03} cor={mistura(mistura(tema.chao, tema.objetoClaro, 0.18), cor ?? tema.acento, 0.25 * aceso)} position={[0, 0.04, 0]} />
  </group>
);

// ---------- Folha de decreto (folhinha deitada) ----------
export const Folha: React.FC<{pos: V3; cor: string; rot?: V3; brilho?: number}> = ({pos, cor, rot = [0, 0, 0], brilho = 0}) => (
  <mesh position={pos} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={[0.78, 0.045, 0.56]} />
    <Fosco cor={cor} emissivo={brilho} />
  </mesh>
);

// ---------- "?" grande em pé, dos dois lados ----------
// 0,9 × 1,2 na escala 1, centro em pos. `k` 0..1 nasce.
export const Interrogacao: React.FC<{tema: Tema; pos: V3; k: number; giro?: number; cor?: string}> = ({tema, pos, k, giro = 0, cor}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation={[0, giro, 0]} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={0.9} alt={1.2} linhas={[{t: '?', tam: 900, cor: cor ?? tema.acento, peso: 900}]} brilho={0.6} dupla />
    </group>
  );
};
