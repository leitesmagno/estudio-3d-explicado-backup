import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, geoCaixa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';

// Peças: Bets: a cidade do dinheiro devolvido.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Quem anima é a cena, pelo tempo.

export const mistura = (a: string, b: string, k: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, k))).getHexString();

// ---------- Moeda com cor livre (a da base é sempre do acento) ----------
const G_MOEDA = new THREE.CylinderGeometry(1, 1, 0.26, 40);
const G_ARO = new THREE.RingGeometry(0.62, 0.7, 40);
export const MoedaCor: React.FC<{tema: Tema; pos: V3; rot?: V3; r?: number; cor?: string; brilho?: number; escala?: number}> = ({tema, pos, rot = [0, 0, 0], r = 0.2, cor, brilho = 0, escala = 1}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.acento;
  return (
    <group position={pos} rotation={rot} scale={r * escala}>
      <mesh geometry={G_MOEDA} castShadow>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15 + 0.6 * brilho} roughness={0.38} metalness={0.2} />
      </mesh>
      <mesh geometry={G_ARO} position={[0, 0.131, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={tema.tinta} transparent opacity={0.22} />
      </mesh>
      <mesh geometry={G_ARO} position={[0, -0.131, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={tema.tinta} transparent opacity={0.22} />
      </mesh>
    </group>
  );
};

// ---------- Torre de aposta (genérica: coluna com tela no topo) ----------
// `tela` 0..1: brilho da tela. `afunda` 0..1: desce para dentro do chão. `cinza`: torre ilegal, sem destaque.
export const TorreAposta: React.FC<{tema: Tema; pos: V3; tela: number; afunda?: number; escala?: number; cinza?: boolean}> = ({tema, pos, tela, afunda = 0, escala = 1, cinza}) => {
  if (escala < 0.02 || afunda >= 0.999) return null;
  const corTela = mistura(tema.objetoEscuro, cinza ? tema.corpo : tema.objeto, tela);
  return (
    <group position={[pos[0], pos[1] - 1.95 * afunda, pos[2]]} scale={escala}>
      <Caixa args={[0.9, 0.12, 0.9]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.62, 1.5, 0.62]} raio={0.1} cor={cinza ? tema.branco : tema.objetoEscuro} position={[0, 0.85, 0]} />
      {/* Tela no topo, virada para a frente (z+) */}
      <Caixa args={[0.84, 0.5, 0.12]} raio={0.04} cor={tema.branco} position={[0, 1.82, 0]} />
      <mesh position={[0, 1.82, 0.065]}>
        <planeGeometry args={[0.72, 0.38]} />
        <meshStandardMaterial color={corTela} emissive={corTela} emissiveIntensity={0.9 * tela} roughness={0.5} />
      </mesh>
      {/* Faixas da tela (sem marca): três barras horizontais */}
      {[0.08, 0, -0.08].map((y, i) => (
        <mesh key={i} position={[-0.08 + i * 0.06, 1.82 + y, 0.07]}>
          <planeGeometry args={[0.4 - i * 0.08, 0.035]} />
          <meshBasicMaterial color={tema.fundo} transparent opacity={0.5 * tela} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Casinha ----------
// `luz` 0..1: janela acesa. `porta` 0..1: 1 = porta fechada em destaque (a casa que não recebe).
export const CasaMini: React.FC<{tema: Tema; pos: V3; rotY?: number; luz: number; fechada?: number; escala?: number}> = ({tema, pos, rotY = 0, luz, fechada = 0, escala = 1}) => {
  if (escala < 0.02) return null;
  const janela = mistura(tema.objetoEscuro, tema.objetoClaro, luz);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.0, 0.62, 0.86]} raio={0.06} cor={tema.objeto} position={[0, 0.31, 0]} />
      {/* Telhado: prisma de 3 lados deitado */}
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.36, 0.62, 0.5]} castShadow>
        <cylinderGeometry args={[1, 1, 1.7, 3]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {/* Porta e janela na frente (z+) */}
      <Caixa args={[0.2, 0.34, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.acento, fechada)} emissivo={0.25 * fechada} position={[-0.22, 0.18, 0.44]} />
      <mesh position={[0.2, 0.36, 0.435]}>
        <planeGeometry args={[0.28, 0.2]} />
        <meshStandardMaterial color={janela} emissive={janela} emissiveIntensity={0.8 * luz} />
      </mesh>
    </group>
  );
};

// ---------- Cofrinho (uma conta) ----------
// `nivel` 0..1: quanto tem dentro (some como pilha que cresce). `lasca`: só uma lasquinha de moeda.
export const Cofrinho: React.FC<{tema: Tema; pos: V3; escala: number; destaque?: number; nivel?: number; lasca?: number}> = ({tema, pos, escala, destaque = 0, nivel = 0, lasca = 0}) => {
  if (escala < 0.02) return null;
  const cor = mistura(tema.objetoEscuro, tema.acento, destaque);
  const n = Math.round(nivel * 7);
  return (
    <group position={pos} scale={escala}>
      {/* Caixa aberta: fundo e quatro paredes baixas */}
      <Caixa args={[0.44, 0.04, 0.44]} raio={0.015} cor={cor} emissivo={0.15 * destaque} position={[0, 0.02, 0]} />
      <Caixa args={[0.44, 0.22, 0.04]} raio={0.015} cor={cor} emissivo={0.15 * destaque} position={[0, 0.13, 0.2]} />
      <Caixa args={[0.44, 0.22, 0.04]} raio={0.015} cor={cor} emissivo={0.15 * destaque} position={[0, 0.13, -0.2]} />
      <Caixa args={[0.04, 0.22, 0.44]} raio={0.015} cor={cor} emissivo={0.15 * destaque} position={[0.2, 0.13, 0]} />
      <Caixa args={[0.04, 0.22, 0.44]} raio={0.015} cor={cor} emissivo={0.15 * destaque} position={[-0.2, 0.13, 0]} />
      {Array.from({length: n}).map((_, k) => (
        <MoedaCor key={k} tema={tema} pos={[0, 0.06 + k * 0.034, 0]} rot={[0, k * 0.7, 0]} r={0.13} />
      ))}
      {lasca > 0.02 ? <MoedaCor tema={tema} pos={[0.05, 0.05 + 0.4 * (1 - lasca), -0.03]} rot={[0.2, 0.4, 0]} r={0.035} cor={tema.objeto} /> : null}
    </group>
  );
};

// ---------- Etiqueta física "CPF" pendurada na moeda (sem texto: o texto fica na interface) ----------
export const Selinho: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.14, 6]} />
        <meshBasicMaterial color={tema.tinta} transparent opacity={0.5} />
      </mesh>
      <Caixa args={[0.16, 0.09, 0.012]} raio={0.008} cor={tema.objetoClaro} />
      {[0.022, 0, -0.022].map((y) => (
        <mesh key={y} position={[0, y, 0.0065]}>
          <planeGeometry args={[0.11, 0.008]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      ))}
    </group>
  );

// ---------- Linha do limite (retângulo no chão, desenhado aos poucos) ----------
export const LinhaLimite: React.FC<{tema: Tema; x0: number; x1: number; z0: number; z1: number; k: number; vida?: number}> = ({tema, x0, x1, z0, z1, k, vida = 1}) => {
  if (k <= 0 || vida <= 0) return null;
  const w = x1 - x0;
  const d = z1 - z0;
  const per = 2 * (w + d);
  const lados: {a: V3; dir: V3; comp: number}[] = [
    {a: [x0, 0, z1], dir: [1, 0, 0], comp: w},
    {a: [x1, 0, z1], dir: [0, 0, -1], comp: d},
    {a: [x1, 0, z0], dir: [-1, 0, 0], comp: w},
    {a: [x0, 0, z0], dir: [0, 0, 1], comp: d},
  ];
  let resta = k * per;
  return (
    <>
      {lados.map((l, i) => {
        const c = Math.max(0, Math.min(l.comp, resta));
        resta -= l.comp;
        if (c <= 0.001) return null;
        const meio: V3 = [l.a[0] + (l.dir[0] * c) / 2, 0.03, l.a[2] + (l.dir[2] * c) / 2];
        const deitado = l.dir[0] !== 0;
        return (
          <mesh key={i} position={meio} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={deitado ? [c, 0.14] : [0.14, c]} />
            <meshBasicMaterial color={tema.acento} transparent opacity={0.95 * vida} toneMapped={false} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

// ---------- Prédio de colunas (genérico) ----------
export const PredioColunas: React.FC<{tema: Tema; pos: V3; aceso: number; escala?: number}> = ({tema, pos, aceso, escala = 1}) => {
  const cor = mistura(tema.branco, tema.objeto, aceso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[3.6, 0.24, 2.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.12, 0]} />
      <Caixa args={[3.3, 0.14, 2.0]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.31, 0]} />
      {[-1.3, -0.78, -0.26, 0.26, 0.78, 1.3].map((x) => (
        <mesh key={x} position={[x, 1.18, 0.85]} castShadow>
          <cylinderGeometry args={[0.1, 0.11, 1.6, 20]} />
          <Fosco cor={cor} emissivo={0.12 * aceso} />
        </mesh>
      ))}
      <Caixa args={[3.0, 1.6, 1.4]} raio={0.05} cor={tema.branco} position={[0, 1.18, -0.15]} />
      <Caixa args={[3.6, 0.22, 2.1]} raio={0.04} cor={cor} emissivo={0.08 * aceso} position={[0, 2.09, 0]} />
      {/* Frontão triangular */}
      <mesh position={[0, 2.42, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.25, 1.75, 1.0]} castShadow>
        <cylinderGeometry args={[1, 1, 2.0, 3]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
    </group>
  );
};

// ---------- Prédio largo com duas cúpulas (genérico) ----------
export const PredioLargo: React.FC<{tema: Tema; pos: V3; aceso: number; escala?: number}> = ({tema, pos, aceso, escala = 1}) => {
  const cor = mistura(tema.branco, tema.objeto, aceso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[5.0, 0.7, 2.2]} raio={0.06} cor={cor} emissivo={0.06 * aceso} position={[0, 0.35, 0]} />
      <Caixa args={[5.2, 0.08, 2.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.74, 0]} />
      {/* Cúpula virada para cima e outra para baixo */}
      <mesh position={[-1.3, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
      <mesh position={[1.3, 1.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
      {/* Duas lâminas altas ao fundo */}
      {[-0.18, 0.18].map((x) => (
        <Caixa key={x} args={[0.3, 2.6, 0.9]} raio={0.04} cor={tema.branco} position={[x, 1.3, -0.7]} />
      ))}
    </group>
  );
};

// ---------- Pasta (processo que entra no prédio) ----------
export const Pasta: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh geometry={geoCaixa(0.5, 0.06, 0.36, 0.02)} castShadow>
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <Caixa args={[0.12, 0.065, 0.362]} raio={0.01} cor={tema.acento} emissivo={0.3} position={[-0.17, 0.003, 0]} />
    </group>
  );

// ---------- Documento grande (a medida provisória) ----------
export const DocumentoGrande: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; carimbo?: number}> = ({tema, pos, rot = [0, 0, 0], escala, carimbo = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[1.1, 0.02, 1.45]} raio={0.008} cor={tema.objetoClaro} position={[0.015 * i, 0.012 + i * 0.022, -0.01 * i]} />
      ))}
      {/* Linhas de texto (sem texto real) */}
      {Array.from({length: 7}).map((_, i) => (
        <mesh key={i} position={[-0.05, 0.07, -0.5 + i * 0.13]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[i === 0 ? 0.6 : 0.85 - (i % 3) * 0.12, i === 0 ? 0.07 : 0.035]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      ))}
      {/* Marca do carimbo */}
      {carimbo > 0.02 ? (
        <mesh position={[0.18, 0.072, 0.38]} rotation={[-Math.PI / 2, 0, -0.12]} scale={carimbo}>
          <ringGeometry args={[0.16, 0.2, 40]} />
          <meshBasicMaterial color={tema.acento} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );

// ---------- Carimbo de mão ----------
export const Carimbo3D: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.5, 0.1, 0.32]} raio={0.03} cor={tema.acento} emissivo={0.2} position={[0, 0.05, 0]} />
      <Caixa args={[0.38, 0.12, 0.22]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.16, 0]} />
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.3, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.12, 20, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );
