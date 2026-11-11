import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, useDescartar, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Juros abusivos: a vitrine do crédito (carro, cartão, prédio do INSS) e a mesa da Justiça (balança e régua).
// Objetos reconhecíveis, foscos e arredondados, sem marca e sem rosto. Única textura: o letreiro fixo "INSS".

// ---------- Pedestal de vitrine ----------
// `sobe` 0..1: nasce do chão. `luz` 0..1: o friso acende.
export const ALT_PED = 0.5;
export const Pedestal: React.FC<{tema: Tema; pos: V3; sobe: number; luz?: number}> = ({tema, pos, sobe, luz = 0}) => {
  if (sobe < 0.01) return null;
  return (
    <group position={[pos[0], pos[1] - ALT_PED * (1 - sobe), pos[2]]}>
      <Caixa args={[1.9, 0.08, 1.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <Caixa args={[1.8, ALT_PED - 0.12, 1.8]} raio={0.06} cor={tema.branco} position={[0, 0.06 + (ALT_PED - 0.12) / 2, 0]} />
      <Caixa args={[1.84, 0.05, 1.84]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, luz)} emissivo={0.5 * luz} position={[0, ALT_PED - 0.06, 0]} />
      <Caixa args={[1.86, 0.04, 1.86]} raio={0.02} cor={tema.objeto} position={[0, ALT_PED - 0.02, 0]} />
    </group>
  );
};

// ---------- Carro (sedã) ----------
// Comprimento no eixo x (frente em +x). `anda`: distância percorrida (gira as rodas). `farol` 0..1. `quica`: suspensão.
const G_PNEU = new THREE.CylinderGeometry(0.21, 0.21, 0.17, 28);
const G_ARO = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 20);
const G_CUBO = new THREE.CylinderGeometry(0.04, 0.04, 0.19, 10);
export const Carro: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; cor?: string; brilho?: number; anda?: number; farol?: number; quica?: number}> = ({
  tema,
  pos,
  rotY = 0,
  escala = 1,
  cor,
  brilho = 0,
  anda = 0,
  farol = 0,
  quica = 0,
}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.objeto;
  const vidro = mistura(tema.fundo, tema.objetoEscuro, 0.35);
  const giro = -anda / 0.21;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Rodas */}
      {[-0.66, 0.66].map((x) =>
        [-0.43, 0.43].map((z) => (
          <group key={`${x}${z}`} position={[x, 0.21, z]} rotation={[Math.PI / 2, 0, 0]}>
            <group rotation={[0, giro, 0]}>
              <mesh geometry={G_PNEU} castShadow>
                <meshStandardMaterial color={tema.fundo} roughness={0.9} />
              </mesh>
              <mesh geometry={G_ARO}>
                <meshStandardMaterial color={tema.objeto} roughness={0.35} metalness={0.4} />
              </mesh>
              {[0, 1, 2, 3, 4].map((r) => (
                <mesh key={r} position={[Math.cos((r * 2 * Math.PI) / 5) * 0.075, 0, Math.sin((r * 2 * Math.PI) / 5) * 0.075]} geometry={G_CUBO}>
                  <meshStandardMaterial color={tema.objetoEscuro} roughness={0.6} />
                </mesh>
              ))}
            </group>
          </group>
        )),
      )}
      <group position={[0, quica, 0]}>
        {/* Carroceria: base, capô e porta-malas */}
        <Caixa args={[2.0, 0.34, 0.9]} raio={0.13} cor={c} emissivo={0.25 * brilho} position={[0, 0.4, 0]} />
        {/* Caixas de roda (escuras) */}
        {[-0.66, 0.66].map((x) => (
          <Caixa key={x} args={[0.5, 0.2, 0.92]} raio={0.08} cor={tema.objetoEscuro} position={[x, 0.3, 0]} sombra={false} />
        ))}
        {/* Cabine */}
        <Caixa args={[1.08, 0.34, 0.8]} raio={0.15} cor={c} emissivo={0.25 * brilho} position={[-0.12, 0.72, 0]} />
        {/* Vidros: laterais, para-brisa e traseiro */}
        <Caixa args={[0.9, 0.22, 0.82]} raio={0.08} cor={vidro} position={[-0.12, 0.75, 0]} sombra={false} />
        <mesh position={[0.4, 0.74, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.03, 0.3, 0.7]} />
          <meshStandardMaterial color={vidro} roughness={0.15} metalness={0.3} />
        </mesh>
        <mesh position={[-0.64, 0.74, 0]} rotation={[0, 0, -0.55]}>
          <boxGeometry args={[0.03, 0.28, 0.7]} />
          <meshStandardMaterial color={vidro} roughness={0.15} metalness={0.3} />
        </mesh>
        {/* Coluna do meio */}
        <Caixa args={[0.05, 0.24, 0.84]} raio={0.02} cor={c} position={[-0.1, 0.75, 0]} sombra={false} />
        {/* Faróis e lanternas */}
        {[-0.3, 0.3].map((z) => (
          <React.Fragment key={z}>
            <Caixa args={[0.06, 0.09, 0.22]} raio={0.03} cor={mistura(tema.objeto, tema.objetoClaro, farol)} emissivo={0.15 + 1.4 * farol} position={[1.0, 0.45, z]} sombra={false} />
            <Caixa args={[0.06, 0.08, 0.2]} raio={0.03} cor={tema.acento} emissivo={0.3 + 0.5 * farol} position={[-1.0, 0.47, z]} sombra={false} />
          </React.Fragment>
        ))}
        {/* Para-choques */}
        <Caixa args={[0.08, 0.1, 0.92]} raio={0.04} cor={tema.objetoEscuro} position={[1.02, 0.28, 0]} sombra={false} />
        <Caixa args={[0.08, 0.1, 0.92]} raio={0.04} cor={tema.objetoEscuro} position={[-1.02, 0.28, 0]} sombra={false} />
        {/* Grade */}
        <Caixa args={[0.03, 0.06, 0.34]} raio={0.02} cor={tema.objetoEscuro} position={[1.01, 0.4, 0]} sombra={false} />
        {/* Retrovisores e maçanetas */}
        {[-1, 1].map((l) => (
          <React.Fragment key={l}>
            <Caixa args={[0.1, 0.07, 0.08]} raio={0.025} cor={c} position={[0.32, 0.62, 0.47 * l]} sombra={false} />
            <Caixa args={[0.1, 0.025, 0.02]} raio={0.008} cor={tema.objetoEscuro} position={[0.12, 0.5, 0.455 * l]} sombra={false} />
            <Caixa args={[0.1, 0.025, 0.02]} raio={0.008} cor={tema.objetoEscuro} position={[-0.36, 0.5, 0.455 * l]} sombra={false} />
          </React.Fragment>
        ))}
      </group>
    </group>
  );
};

// ---------- Chave do carro ----------
export const Chave: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.16, 0.24, 0.06]} raio={0.05} cor={tema.objetoEscuro} />
      <Caixa args={[0.06, 0.05, 0.065]} raio={0.02} cor={tema.acento} emissivo={0.4} position={[0, 0.04, 0]} sombra={false} />
      <Caixa args={[0.05, 0.22, 0.02]} raio={0.01} cor={tema.objeto} position={[0, -0.22, 0]} />
    </group>
  );

// ---------- Cartão de crédito ----------
// Em pé no plano xy, frente para +z. `faixa` 0..1: a faixa acende marsala. `reflexo` 0..1: um brilho atravessa a frente.
export const CartaoCredito: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; faixa?: number; reflexo?: number}> = ({tema, pos, rot = [0, 0, 0], escala, faixa = 0, reflexo = -1}) => {
  if (escala < 0.02) return null;
  const corpo = mistura(tema.objetoEscuro, tema.branco, 0.3);
  const fz = 0.026;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.6, 1.0, 0.045]} raio={0.02} cor={corpo} />
      {/* Faixa */}
      <Caixa args={[1.6, 0.14, 0.006]} raio={0.002} cor={mistura(tema.objeto, tema.acento, faixa)} emissivo={0.6 * faixa} position={[0, 0.3, fz]} sombra={false} />
      {/* Chip com contatos */}
      <Caixa args={[0.24, 0.18, 0.012]} raio={0.03} cor={tema.areia} position={[-0.5, 0.04, fz]} sombra={false} />
      {[-0.04, 0.04].map((y) => (
        <Caixa key={y} args={[0.2, 0.012, 0.014]} raio={0.002} cor={mistura(tema.areia, tema.objetoEscuro, 0.5)} position={[-0.5, 0.04 + y, fz + 0.002]} sombra={false} />
      ))}
      <Caixa args={[0.012, 0.15, 0.014]} raio={0.002} cor={mistura(tema.areia, tema.objetoEscuro, 0.5)} position={[-0.5, 0.04, fz + 0.002]} sombra={false} />
      {/* Aproximação: três arcos */}
      {[0.06, 0.1, 0.14].map((r) => (
        <mesh key={r} position={[-0.22, 0.04, fz]} rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[r, 0.008, 6, 20, Math.PI / 2]} />
          <meshStandardMaterial color={tema.objeto} />
        </mesh>
      ))}
      {/* Número em relevo: 4 grupos de 4 */}
      {[0, 1, 2, 3].map((g) =>
        [0, 1, 2, 3].map((d) => <Caixa key={`${g}${d}`} args={[0.045, 0.07, 0.012]} raio={0.008} cor={tema.objeto} position={[-0.62 + g * 0.34 + d * 0.065, -0.2, fz]} sombra={false} />),
      )}
      {/* Nome e validade (linhas) */}
      <Caixa args={[0.5, 0.035, 0.008]} raio={0.004} cor={tema.objeto} position={[-0.48, -0.36, fz]} sombra={false} />
      <Caixa args={[0.18, 0.035, 0.008]} raio={0.004} cor={tema.objeto} position={[0.2, -0.36, fz]} sombra={false} />
      {/* Brilho que atravessa a frente */}
      {reflexo > 0 && reflexo < 1 ? (
        <mesh position={[-0.9 + 1.8 * reflexo, 0, fz + 0.012]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.12, 1.3]} />
          <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.35 * Math.sin(Math.PI * reflexo)} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- Etiqueta de preço com "%" (pendurada por um fio) ----------
export const TagPorcento: React.FC<{tema: Tema; pos: V3; escala: number; balanca?: number; destaque?: number}> = ({tema, pos, escala, balanca = 0, destaque = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, 0, balanca]} scale={escala}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.24, 6]} />
        <meshStandardMaterial color={tema.tinta} />
      </mesh>
      <group position={[0, -0.42, 0]}>
        <Caixa args={[0.3, 0.38, 0.03]} raio={0.04} cor={mistura(tema.objetoClaro, tema.acento, destaque)} emissivo={0.3 * destaque} />
        {/* "%" desenhado: dois aros e uma barra */}
        <mesh position={[-0.06, 0.07, 0.018]}>
          <torusGeometry args={[0.035, 0.012, 8, 20]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0.06, -0.07, 0.018]}>
          <torusGeometry args={[0.035, 0.012, 8, 20]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0, 0, 0.018]} rotation={[0, 0, -0.75]}>
          <planeGeometry args={[0.024, 0.26]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      </group>
    </group>
  );

// ---------- Pilha de moedas (uma malha por moeda, sem aro, para aguentar pilhas altas) ----------
// `n`: quantas moedas (fracionário: a de cima cresce). `passo`: altura de cada moeda.
const G_MOEDA = new THREE.CylinderGeometry(1, 1, 1, 32);
export const PASSO_MOEDA = 0.07;
export const PilhaMoedas: React.FC<{tema: Tema; pos: V3; n: number; cor: string; r?: number; brilho?: number; escala?: number}> = ({tema, pos, n, cor, r = 0.3, brilho = 0, escala = 1}) => {
  if (n <= 0.01 || escala < 0.02) return null;
  const inteiras = Math.floor(n);
  const resto = n - inteiras;
  const total = inteiras + (resto > 0.02 ? 1 : 0);
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: total}).map((_, i) => {
        const s = i < inteiras ? 1 : resto;
        const desvio = Math.sin(i * 2.3) * 0.015;
        return (
          <mesh key={i} geometry={G_MOEDA} position={[desvio, (i + 0.5) * PASSO_MOEDA, Math.cos(i * 1.7) * 0.015]} scale={[r * s, PASSO_MOEDA * 0.86, r * s]} castShadow receiveShadow>
            <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.08 + 0.45 * brilho} roughness={0.42} metalness={0.15} />
          </mesh>
        );
      })}
      {/* Borda escura no topo de cada moeda (dá leitura de pilha) */}
      {Array.from({length: inteiras}).map((_, i) => (
        <mesh key={`b${i}`} position={[Math.sin(i * 2.3) * 0.015, (i + 1) * PASSO_MOEDA - 0.004, Math.cos(i * 1.7) * 0.015]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r * 0.97, r * 1.005, 32]} />
          <meshBasicMaterial color={tema.fundo} transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Grade de parcelas (blocos que acendem) ----------
// `k` 0..1: os blocos nascem. `acesos`: quantos já acenderam (fracionário).
export const Parcelas: React.FC<{tema: Tema; pos: V3; n: number; cols: number; passo?: number; k: number; acesos: number; destaque?: number}> = ({tema, pos, n, cols, passo = 0.26, k, acesos, destaque = 0}) => {
  if (k < 0.01) return null;
  const linhas = Math.ceil(n / cols);
  return (
    <group position={pos}>
      {Array.from({length: n}).map((_, i) => {
        const vis = Math.max(0, Math.min(1, k * n * 1.25 - i));
        if (vis <= 0) return null;
        const aceso = Math.max(0, Math.min(1, acesos - i));
        const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, aceso), tema.acento, aceso * destaque);
        const x = ((i % cols) - (cols - 1) / 2) * passo;
        const z = (Math.floor(i / cols) - (linhas - 1) / 2) * passo;
        return <Caixa key={i} args={[passo * 0.8, 0.07, passo * 0.8]} raio={0.02} cor={cor} emissivo={0.12 * aceso + 0.3 * aceso * destaque} position={[x, 0.035 * vis, z]} scale={vis} sombra={false} />;
      })}
    </group>
  );
};

// ---------- Teto (placa translúcida que desce) ----------
// `y`: altura atual. `vida` 0..1. `quebra` 0..1: se desfaz em pedaços que caem e somem.
export const Teto: React.FC<{tema: Tema; centro: V3; larg: number; prof: number; y: number; vida: number; quebra?: number; pulso?: number}> = ({tema, centro, larg, prof, y, vida, quebra = 0, pulso = 0}) => {
  if (vida <= 0.01) return null;
  const nx = 6;
  const nz = 3;
  const pedacos = quebra > 0.001;
  const op = vida * (1 - quebra);
  if (op <= 0.01) return null;
  return (
    <group position={[centro[0], y, centro[2]]}>
      {pedacos ? (
        Array.from({length: nx * nz}).map((_, i) => {
          const ix = i % nx;
          const iz = Math.floor(i / nx);
          const w = larg / nx;
          const d = prof / nz;
          const sx = -larg / 2 + w * (ix + 0.5);
          const sz = -prof / 2 + d * (iz + 0.5);
          const fase = Math.sin(i * 12.9898) * 0.5 + 0.5;
          const q = Math.max(0, Math.min(1, quebra * 1.4 - fase * 0.4));
          return (
            <mesh key={i} position={[sx * (1 + 0.25 * q), -2.2 * q * q, sz * (1 + 0.25 * q)]} rotation={[q * (fase - 0.5) * 2, q * fase, q * (0.5 - fase) * 2]}>
              <boxGeometry args={[w * 0.96, 0.06, d * 0.96]} />
              <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.4} transparent opacity={0.5 * op} depthWrite={false} />
            </mesh>
          );
        })
      ) : (
        <>
          <mesh>
            <boxGeometry args={[larg, 0.05, prof]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.35 + 0.5 * pulso} transparent opacity={0.32 * op} depthWrite={false} />
          </mesh>
          {/* Borda acesa */}
          {[
            [0, prof / 2, larg, 0.06],
            [0, -prof / 2, larg, 0.06],
            [larg / 2, 0, 0.06, prof],
            [-larg / 2, 0, 0.06, prof],
          ].map(([x, z, w, d], i) => (
            <mesh key={i} position={[x, 0, z]}>
              <boxGeometry args={[w, 0.07, d]} />
              <meshBasicMaterial color={tema.acento} transparent opacity={0.95 * op} toneMapped={false} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

// ---------- Órgão público com letreiro ----------
// `sobe` 0..1: nasce do chão. `letreiro` 0..1: o nome acende. `porta` 0..1: abre. O letreiro é uma textura fixa.
const useLetreiro = (texto: string) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 256;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, 1024, 256);
    ctx.font = '900 190px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, 512, 138);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [texto]);
  useDescartar(tex);
  return tex;
};
export const OrgaoPublico: React.FC<{tema: Tema; pos: V3; escala: number; sobe: number; letreiro: number; porta?: number; texto: string}> = ({tema, pos, escala, sobe, letreiro, porta = 0, texto}) => {
  const tex = useLetreiro(texto);
  if (sobe < 0.01) return null;
  const parede = tema.objeto;
  const coluna = tema.objetoClaro;
  return (
    <group position={[pos[0], pos[1] - 3.4 * escala * (1 - sobe), pos[2]]} scale={escala}>
      {/* Escadaria */}
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[4.4 - i * 0.25, 0.16, 2.9 - i * 0.25]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.08 + i * 0.16, 0.1 - i * 0.05]} />
      ))}
      {/* Corpo */}
      <Caixa args={[3.6, 2.0, 1.8]} raio={0.05} cor={parede} position={[0, 1.48, -0.25]} />
      {/* Colunas */}
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((x) => (
        <group key={x} position={[x, 0, 0.95]}>
          <mesh position={[0, 1.48, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 2.0, 20]} />
            <Fosco cor={coluna} />
          </mesh>
          <Caixa args={[0.34, 0.08, 0.34]} raio={0.02} cor={coluna} position={[0, 0.52, 0]} />
          <Caixa args={[0.34, 0.08, 0.34]} raio={0.02} cor={coluna} position={[0, 2.44, 0]} />
        </group>
      ))}
      {/* Porta grande */}
      <Caixa args={[0.9, 1.3, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.13, 0.66]} sombra={false} />
      {[-1, 1].map((l) => (
        <group key={l} position={[0.45 * l, 1.13, 0.7]} rotation={[0, -l * 1.2 * porta, 0]}>
          <Caixa args={[0.44, 1.26, 0.05]} raio={0.02} cor={mistura(tema.branco, tema.objeto, 0.4)} position={[-0.22 * l, 0, 0]} sombra={false} />
        </group>
      ))}
      {porta > 0.05 ? <Caixa args={[0.86, 1.24, 0.02]} raio={0.01} cor={tema.objetoClaro} emissivo={0.6 * porta} position={[0, 1.13, 0.64]} sombra={false} /> : null}
      {/* Entablamento com o letreiro */}
      <Caixa args={[4.0, 0.5, 2.3]} raio={0.04} cor={parede} position={[0, 2.73, 0.0]} />
      <Caixa args={[4.1, 0.08, 2.4]} raio={0.02} cor={coluna} position={[0, 2.99, 0.0]} />
      <Caixa args={[2.5, 0.42, 0.04]} raio={0.02} cor={tema.objetoEscuro} position={[0, 2.73, 1.16]} sombra={false} />
      <mesh position={[0, 2.73, 1.19]}>
        <planeGeometry args={[2.6, 0.65]} />
        <meshStandardMaterial map={tex} transparent color={mistura(tema.corpo, tema.objetoClaro, letreiro)} emissive={tema.objetoClaro} emissiveMap={tex} emissiveIntensity={1.1 * letreiro} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Frontão */}
      <mesh position={[0, 3.32, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 2.1, 1.1]} castShadow>
        <cylinderGeometry args={[1, 1, 2.0, 3]} />
        <Fosco cor={parede} />
      </mesh>
      {/* Mastro sem bandeira (não é marca) */}
      <mesh position={[1.75, 3.6, 0.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );
};

// ---------- Balança da Justiça ----------
// Dois pratos presos por correntes, base em degraus, coluna com anéis e ponteiro no meio.
// `inclina` -1..1 (positivo: prato direito desce). `ponteiro` 0..1: o ponteiro acende.
export const ALT_BJ = 2.7;
export const BRACO_BJ = 2.0;
export const BalancaJustica: React.FC<{tema: Tema; pos: V3; escala: number; inclina: number; esq?: React.ReactNode; dir?: React.ReactNode; brilhoEsq?: number; brilhoDir?: number; ponteiro?: number}> = ({
  tema,
  pos,
  escala,
  inclina,
  esq,
  dir,
  brilhoEsq = 0,
  brilhoDir = 0,
  ponteiro = 0,
}) => {
  if (escala < 0.02) return null;
  const ang = -0.24 * inclina;
  const metal = tema.objeto;
  const prato = (lado: -1 | 1, conteudo: React.ReactNode, brilho: number) => {
    const y = ALT_BJ + Math.sin(ang) * BRACO_BJ * lado;
    const x = Math.cos(ang) * BRACO_BJ * lado;
    return (
      <group position={[x, y, 0]}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 10]} />
          <Fosco cor={metal} />
        </mesh>
        {/* Três correntes (elos em fila) */}
        {[0, 1, 2].map((k) => {
          const a = (k * 2 * Math.PI) / 3;
          const bx = Math.cos(a) * 0.55;
          const bz = Math.sin(a) * 0.55;
          return Array.from({length: 7}).map((_, e) => {
            const f = (e + 0.5) / 7;
            return (
              <mesh key={`${k}${e}`} position={[bx * f, -1.0 * f, bz * f]} rotation={[0, a + (e % 2) * (Math.PI / 2), 0]}>
                <torusGeometry args={[0.05, 0.012, 6, 12]} />
                <Fosco cor={metal} />
              </mesh>
            );
          });
        })}
        {/* Prato */}
        <mesh position={[0, -1.04, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.72, 0.56, 0.1, 40]} />
          <Fosco cor={mistura(metal, tema.acento, brilho)} emissivo={0.3 * brilho} />
        </mesh>
        <group position={[0, -0.99, 0]}>{conteudo}</group>
      </group>
    );
  };
  return (
    <group position={pos} scale={escala}>
      {/* Base em degraus */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.12, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.1, 40]} />
        <Fosco cor={tema.branco} />
      </mesh>
      {/* Coluna com anéis */}
      <mesh position={[0, ALT_BJ / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, ALT_BJ - 0.1, 20]} />
        <Fosco cor={metal} />
      </mesh>
      {[0.6, 1.4, 2.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.105, 0.03, 10, 24]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
      ))}
      {/* Mostrador do ponteiro */}
      <mesh position={[0, ALT_BJ - 0.25, 0.09]}>
        <circleGeometry args={[0.32, 32, Math.PI * 1.15, Math.PI * 0.7]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.7} side={2} />
      </mesh>
      {/* Travessão + ponteiro */}
      <group position={[0, ALT_BJ, 0]} rotation={[0, 0, ang]}>
        <Caixa args={[BRACO_BJ * 2 + 0.16, 0.09, 0.12]} raio={0.04} cor={metal} />
        <mesh position={[0, -0.25, 0.11]}>
          <boxGeometry args={[0.035, 0.42, 0.02]} />
          <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.acento, ponteiro)} emissive={tema.acento} emissiveIntensity={0.6 * ponteiro} />
        </mesh>
        {[-1, 1].map((l) => (
          <mesh key={l} position={[BRACO_BJ * l, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <Fosco cor={metal} />
          </mesh>
        ))}
      </group>
      {/* Topo */}
      <mesh position={[0, ALT_BJ + 0.16, 0]} castShadow>
        <sphereGeometry args={[0.13, 20, 16]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      {prato(-1, esq, brilhoEsq)}
      {prato(1, dir, brilhoDir)}
    </group>
  );
};

// ---------- Régua em pé ----------
// `marca`: altura (0..1) da taxa média; `aceso` 0..1. `contrato`: altura (0..1) do marcador do contrato; `kContrato` 0..1.
export const Regua3D: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; alt: number; marca: number; aceso: number; contrato?: number; kContrato?: number; brilho?: number}> = ({
  tema,
  pos,
  rot = [0, 0, 0],
  escala,
  alt,
  marca,
  aceso,
  contrato = 0,
  kContrato = 0,
  brilho = 0,
}) => {
  if (escala < 0.02) return null;
  const n = Math.round(alt / 0.2);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.4, alt, 0.08]} raio={0.03} cor={mistura(tema.objetoClaro, tema.objeto, 0.2)} emissivo={0.2 * brilho} position={[0, alt / 2, 0]} />
      {/* Marcas */}
      {Array.from({length: n + 1}).map((_, i) => (
        <Caixa key={i} args={[i % 5 === 0 ? 0.2 : 0.1, 0.02, 0.012]} raio={0.004} cor={tema.objetoEscuro} position={[-0.2 + (i % 5 === 0 ? 0.1 : 0.05), i * 0.2, 0.045]} sombra={false} />
      ))}
      {/* Marca da taxa média */}
      {aceso > 0.01 ? (
        <Caixa args={[0.4 + 0.3 * aceso, 0.06, 0.12]} raio={0.02} cor={mistura(tema.objeto, tema.objetoClaro, aceso)} emissivo={0.6 * aceso} position={[0.15 * aceso, marca * alt, 0]} />
      ) : null}
      {/* Marcador do contrato */}
      {kContrato > 0.01 ? (
        <group position={[0, contrato * alt, 0]} scale={kContrato}>
          <Caixa args={[0.62, 0.08, 0.14]} raio={0.02} cor={tema.acento} emissivo={0.5} position={[-0.12, 0, 0]} />
          <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.09, 0.16, 3]} />
            <Fosco cor={tema.acento} emissivo={0.5} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

// ---------- Escudo ----------
export const Escudo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; acende?: number}> = ({tema, pos, rotY = 0, escala, acende = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.8, -0.85]} castShadow>
        <cylinderGeometry args={[1, 1, 1.4, 32, 1, true, -0.55, 1.1]} />
        <meshStandardMaterial color={mistura(tema.objeto, tema.acento, acende)} emissive={tema.acento} emissiveIntensity={0.35 * acende} roughness={0.6} side={2} />
      </mesh>
      {/* Aro e centro */}
      <mesh position={[0, 0.8, 0.16]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.18, 28]} />
        <meshStandardMaterial color={mistura(tema.objetoClaro, tema.acento, acende)} emissive={tema.acento} emissiveIntensity={0.5 * acende} side={2} />
      </mesh>
      {[1.5, 0.1].map((y) => (
        <mesh key={y} position={[0, y, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.025, 6, 32, 1.1]} />
          <meshStandardMaterial color={tema.objetoClaro} />
        </mesh>
      ))}
    </group>
  );

// ---------- Seta (pressão) ----------
export const Seta: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cor?: string}> = ({tema, pos, rotY = 0, escala, cor}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} />
        <Fosco cor={cor ?? tema.corpo} />
      </mesh>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.16, 0.3, 16]} />
        <Fosco cor={cor ?? tema.corpo} />
      </mesh>
    </group>
  );

// ---------- Caneta ----------
export const Caneta: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.6, 16]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.045, 0.12, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <Caixa args={[0.02, 0.22, 0.03]} raio={0.008} cor={tema.objeto} position={[0, 0.52, 0.055]} />
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.048, 12, 10]} />
        <Fosco cor={tema.acento} emissivo={0.3} />
      </mesh>
    </group>
  );

// ---------- Redoma de vidro ----------
export const Redoma: React.FC<{tema: Tema; pos: V3; escala: number; desce: number; brilho?: number}> = ({tema, pos, escala, desce, brilho = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.62, 0.66, 0.06, 40]} />
        <Fosco cor={mistura(tema.objetoEscuro, tema.acento, brilho)} emissivo={0.3 * brilho} />
      </mesh>
      <group position={[0, 0.06 + 1.6 * (1 - desce), 0]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 1.1, 40, 1, true]} />
          <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.16} roughness={0.1} side={2} depthWrite={false} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.56, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.16} roughness={0.1} side={2} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );

// ---------- Holofote (cone de luz suave vindo de cima) ----------
export const Holofote: React.FC<{tema: Tema; pos: V3; k: number; alt?: number; raio?: number}> = ({tema, pos, k, alt = 4.5, raio = 0.9}) =>
  k < 0.01 ? null : (
    <mesh position={[pos[0], pos[1] + alt / 2, pos[2]]}>
      <coneGeometry args={[raio, alt, 40, 1, true]} />
      <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.03 * k} side={2} depthWrite={false} />
    </mesh>
  );

// ---------- Folha (papel voando) ----------
export const Folha: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.34, 0.012, 0.44]} raio={0.004} cor={tema.objetoClaro} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.02, 0.008, -0.12 + i * 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.22 - (i % 2) * 0.06, 0.025]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      ))}
    </group>
  );
