import React from 'react';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Escala 6x1 polêmica: a balança da briga, a conta, os dois lados.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Sem texturas: todo texto fica na interface 2D.

// ---------- Balança de dois pratos ----------
// `inclina` -1..1: -1 = prato esquerdo embaixo. `esq` e `dir`: o que vai em cada prato (filhos posicionados no prato).
export const ALT_BALANCA = 2.6;
export const BRACO = 2.2;
export const Balanca: React.FC<{tema: Tema; pos: V3; escala: number; inclina: number; esq?: React.ReactNode; dir?: React.ReactNode; brilhoEsq?: number; brilhoDir?: number}> = ({
  tema,
  pos,
  escala,
  inclina,
  esq,
  dir,
  brilhoEsq = 0,
  brilhoDir = 0,
}) => {
  if (escala < 0.02) return null;
  const ang = -0.22 * inclina;
  const prato = (lado: -1 | 1, conteudo: React.ReactNode, brilho: number) => {
    // A ponta do travessão sobe/desce; o prato fica sempre na horizontal.
    const y = ALT_BALANCA + Math.sin(ang) * BRACO * lado;
    const x = Math.cos(ang) * BRACO * lado;
    return (
      <group position={[x, y, 0]}>
        {[-1, 1].map((k) => (
          <mesh key={k} position={[0.32 * k, -0.45, 0]} rotation={[0, 0, -0.33 * k]}>
            <cylinderGeometry args={[0.012, 0.012, 0.95, 6]} />
            <Fosco cor={tema.tinta} />
          </mesh>
        ))}
        <mesh position={[0, -0.9, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.62, 0.08, 40]} />
          <Fosco cor={mistura(tema.objeto, tema.acento, brilho)} emissivo={0.25 * brilho} />
        </mesh>
        <group position={[0, -0.86, 0]}>{conteudo}</group>
      </group>
    );
  };
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[1.4, 0.16, 1.0]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.08, 0]} />
      <mesh position={[0, ALT_BALANCA / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, ALT_BALANCA, 20]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0, ALT_BALANCA + 0.12, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 16]} />
        <Fosco cor={tema.acento} emissivo={0.3} />
      </mesh>
      {/* Travessão */}
      <group position={[0, ALT_BALANCA, 0]} rotation={[0, 0, ang]}>
        <Caixa args={[BRACO * 2 + 0.2, 0.1, 0.12]} raio={0.04} cor={tema.objeto} />
      </group>
      {prato(-1, esq, brilhoEsq)}
      {prato(1, dir, brilhoDir)}
    </group>
  );
};

// ---------- Racha no chão (fenda que se abre) ----------
// `k` 0..1: quanto já abriu (cresce do começo ao fim e alarga).
export const Racha: React.FC<{tema: Tema; a: V3; b: V3; k: number}> = ({tema, a, b, k}) => {
  if (k < 0.01) return null;
  const n = 18;
  const ang = Math.atan2(b[0] - a[0], b[2] - a[2]);
  const comp = Math.hypot(b[0] - a[0], b[2] - a[2]) / n;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const s = (i + 0.5) / n;
        const vis = Math.max(0, Math.min(1, k * n * 1.2 - i * 0.9));
        if (vis <= 0) return null;
        const zig = (i % 2 ? 1 : -1) * 0.12;
        const larg = (0.05 + 0.14 * k) * vis * (0.7 + 0.3 * Math.sin(i * 2.3));
        return (
          <mesh key={i} position={[a[0] + (b[0] - a[0]) * s + zig * Math.cos(ang), 0.012, a[2] + (b[2] - a[2]) * s]} rotation={[-Math.PI / 2, 0, ang + zig * 1.2]}>
            <planeGeometry args={[larg, comp * 1.25]} />
            <meshBasicMaterial color={tema.fundo} transparent opacity={0.95} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

// ---------- Recibo (a conta) ----------
// De pé, virado para a frente (z+). `desenrola` 0..1: o papel cresce para baixo a partir do topo.
export const Recibo: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; desenrola: number; destaque?: number}> = ({tema, pos, rot = [0, 0, 0], escala, desenrola, destaque = 0}) => {
  if (escala < 0.02 || desenrola < 0.01) return null;
  const h = 1.5 * desenrola;
  const larg = 0.8;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[larg + 0.08, 0.1, 0.1]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.05, 0]} />
      <Caixa args={[larg, h, 0.015]} raio={0.006} cor={tema.objetoClaro} position={[0, -h / 2, 0]} />
      {/* Linhas da conta e a linha do total em destaque */}
      {Array.from({length: 7}).map((_, i) => {
        const y = -0.16 - i * 0.17;
        if (-y > h - 0.1) return null;
        const total = i === 6;
        return (
          <mesh key={i} position={[total ? 0 : -0.08 + (i % 2) * 0.05, y, 0.009]}>
            <planeGeometry args={[total ? 0.62 : 0.42 + (i % 3) * 0.08, total ? 0.07 : 0.035]} />
            <meshBasicMaterial color={total ? mistura(tema.objetoEscuro, tema.acento, destaque) : tema.objetoEscuro} toneMapped={!total} />
          </mesh>
        );
      })}
      {/* Serrilhado embaixo */}
      {desenrola > 0.95
        ? Array.from({length: 8}).map((_, i) => (
            <mesh key={`s${i}`} position={[-larg / 2 + 0.05 + i * 0.1, -h - 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.07, 0.07]} />
              <meshStandardMaterial color={tema.objetoClaro} />
            </mesh>
          ))
        : null}
    </group>
  );
};

// ---------- Barraquinha (o pequeno negócio): balcão com toldo listrado ----------
export const Barraquinha: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; toldo?: number}> = ({tema, pos, rotY = 0, escala, toldo = 0}) => {
  if (escala < 0.02) return null;
  const L = 1.8;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[L, 0.75, 0.7]} raio={0.04} cor={tema.objeto} position={[0, 0.375, 0]} />
      <Caixa args={[L + 0.1, 0.06, 0.8]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.78, 0]} />
      {[-1, 1].map((l) => (
        <mesh key={l} position={[(L / 2 - 0.05) * l, 1.15, -0.3]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.3, 10]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      ))}
      <group position={[0, 2.2, 0]} rotation={[0.3, 0, 0]}>
        {Array.from({length: 8}).map((_, i) => (
          <Caixa key={i} args={[L / 8, 0.04, 1.1]} raio={0.015} cor={i % 2 === 0 ? mistura(tema.corpo, tema.acento, toldo) : tema.objetoClaro} position={[-L / 2 + (L / 8) * (i + 0.5), 0, 0]} />
        ))}
      </group>
      {/* Caixinhas no balcão */}
      {[-0.55, -0.15, 0.3].map((x, i) => (
        <Caixa key={i} args={[0.24, 0.2 + 0.06 * i, 0.22]} raio={0.03} cor={tema.objetoClaro} position={[x, 0.91 + 0.03 * i, 0.05]} />
      ))}
    </group>
  );
};

// ---------- Prateleira com produtos e uma etiqueta de preço ----------
// `preco` 0..1: a etiqueta sobe e acende.
export const Prateleira: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; preco: number}> = ({tema, pos, rotY = 0, escala, preco}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {[-0.75, 0.75].map((x) => (
        <Caixa key={x} args={[0.08, 1.7, 0.5]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.85, 0]} />
      ))}
      {[0.5, 1.15].map((y) => (
        <Caixa key={y} args={[1.5, 0.06, 0.5]} raio={0.02} cor={tema.objeto} position={[0, y, 0]} />
      ))}
      {[-0.45, 0, 0.45].map((x, i) => (
        <group key={x}>
          <Caixa args={[0.3, 0.36, 0.3]} raio={0.04} cor={tema.objetoClaro} position={[x, 0.71, 0]} />
          <Caixa args={[0.26, 0.42 - 0.06 * i, 0.26]} raio={0.04} cor={tema.objetoClaro} position={[x, 1.39 - 0.03 * i, 0]} />
        </group>
      ))}
      {/* Etiqueta de preço pendurada na frente da prateleira de cima, subindo */}
      <group position={[0, 1.08 + 0.35 * preco, 0.27]}>
        <Caixa args={[0.34, 0.2, 0.02]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, preco)} emissivo={0.35 * preco} sombra={false} />
      </group>
    </group>
  );
};

// ---------- Posto de trabalho vazio (uma vaga): mesinha e banquinho ----------
export const PostoVaga: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; ocupado?: number}> = ({tema, pos, rotY = 0, escala, ocupado = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.7, 0.05, 0.45]} raio={0.02} cor={mistura(tema.objeto, tema.acento, ocupado)} emissivo={0.2 * ocupado} position={[0, 0.55, -0.1]} />
      {[
        [-0.3, -0.28],
        [0.3, -0.28],
        [-0.3, 0.08],
        [0.3, 0.08],
      ].map(([x, z], i) => (
        <Caixa key={i} args={[0.05, 0.53, 0.05]} raio={0.015} cor={tema.objetoEscuro} position={[x, 0.265, z]} />
      ))}
      <Caixa args={[0.3, 0.05, 0.3]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.34, 0.32]} />
      <mesh position={[0, 0.17, 0.32]}>
        <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );
};
