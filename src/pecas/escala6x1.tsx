import React from 'react';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Escala 6x1: a semana como objeto, as horas como cubinhos.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Sem texturas: todo texto fica na interface 2D.

// ---------- Bloco de um dia da semana ----------
// `aceso` 0..1: sai do escuro para a cor do dia. `descanso` 0..1: grafite (trabalho) → acento (folga).
export const DiaBloco: React.FC<{tema: Tema; pos: V3; aceso: number; descanso: number; escala?: number}> = ({tema, pos, aceso, descanso, escala = 1}) => {
  if (escala < 0.02) return null;
  const trabalho = mistura(tema.objetoEscuro, tema.corpo, aceso);
  const cor = mistura(trabalho, tema.acento, descanso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.85, 0.15, 0.85]} raio={0.05} cor={cor} emissivo={0.06 * aceso + 0.3 * descanso} position={[0, 0.075, 0]} />
    </group>
  );
};

// ---------- Cubinho de uma hora de trabalho ----------
// `claro` 0..1: grafite → claro (a hora "vale mais").
export const CuboHora: React.FC<{tema: Tema; pos: V3; escala?: number; claro?: number}> = ({tema, pos, escala = 1, claro = 0}) =>
  escala < 0.02 ? null : (
    <Caixa args={[0.2 * escala, 0.2 * escala, 0.2 * escala]} raio={0.035 * escala} cor={mistura(tema.objeto, tema.objetoClaro, claro)} emissivo={0.12 * claro} position={pos} />
  );

// ---------- Contorno no chão em volta de alguns dias ----------
export const Contorno: React.FC<{tema: Tema; x0: number; x1: number; z: number; prof: number; k: number; cor: string}> = ({x0, x1, z, prof, k, cor}) => {
  if (k <= 0.01) return null;
  const w = x1 - x0;
  const lados: [V3, [number, number]][] = [
    [[x0 + w / 2, 0.02, z + prof / 2], [w, 0.06]],
    [[x0 + w / 2, 0.02, z - prof / 2], [w, 0.06]],
    [[x0, 0.02, z], [0.06, prof]],
    [[x1, 0.02, z], [0.06, prof]],
  ];
  return (
    <>
      {lados.map(([p, a], i) => (
        <mesh key={i} position={p} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={a} />
          <meshBasicMaterial color={cor} transparent opacity={0.9 * k} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
};

// ---------- Livro de leis (de pé, virado para a frente, z+) ----------
// `abre` 0..1: capa esquerda gira na lombada. `folha` 0..n: páginas que já passaram (fração = página virando).
// `capa` 0..1: a faixa da capa vai para o acento (vira "Constituição"). `fitas`: marcadores pendurados [k, destaque].
const PAG = {w: 0.78, h: 1.08};
export const LivroLei: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre: number; folha?: number; capa?: number; fitas?: [number, number][]}> = ({tema, pos, rot = [0, 0, 0], escala, abre, folha = 0, capa = 0, fitas = []}) => {
  if (escala < 0.02) return null;
  const corCapa = mistura(tema.objetoEscuro, tema.tinta, 0.15);
  const faixa = mistura(tema.objeto, tema.acento, capa);
  const linhas = (lado: number) =>
    Array.from({length: 9}).map((_, i) => (
      <mesh key={i} position={[lado * (PAG.w / 2 + 0.02) - 0.03 * lado, 0.38 - i * 0.095, 0.052]}>
        <planeGeometry args={[i === 0 ? 0.4 : 0.6 - (i % 3) * 0.1, i === 0 ? 0.05 : 0.026]} />
        <meshBasicMaterial color={tema.objetoEscuro} />
      </mesh>
    ));
  const ang = Math.PI * (1 - abre);
  const virando = folha % 1;
  const passadas = Math.min(3, Math.floor(folha));
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* Metade direita: capa + bloco de páginas */}
      <Caixa args={[PAG.w + 0.06, PAG.h + 0.06, 0.03]} raio={0.02} cor={corCapa} position={[(PAG.w + 0.06) / 2, 0, -0.015]} />
      <Caixa args={[PAG.w, PAG.h, 0.05]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[PAG.w / 2 + 0.02, 0, 0.025]} />
      {abre > 0.6 ? linhas(1) : null}
      {/* Metade esquerda: gira na lombada (x = 0) */}
      {/* Fechado, a metade esquerda deita por cima das páginas da direita */}
      <group rotation={[0, ang, 0]} position={[0, 0, 0.1 * (1 - abre)]}>
        <Caixa args={[PAG.w + 0.06, PAG.h + 0.06, 0.03]} raio={0.02} cor={corCapa} position={[-(PAG.w + 0.06) / 2, 0, -0.015]} />
        <Caixa args={[PAG.w, PAG.h, 0.05]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[-PAG.w / 2 - 0.02, 0, 0.025]} />
        {abre > 0.6 ? linhas(-1) : null}
        {/* Faixa da capa (lado de fora) */}
        <Caixa args={[PAG.w * 0.7, 0.16, 0.012]} raio={0.005} cor={faixa} emissivo={0.25 * capa} sombra={false} position={[-(PAG.w + 0.06) / 2, 0.22, -0.036]} />
      </group>
      {/* Páginas virando, da direita para a esquerda */}
      {abre > 0.9
        ? Array.from({length: passadas + (virando > 0.01 ? 1 : 0)}).map((_, i) => {
            const a = i < passadas ? Math.PI : Math.PI * virando;
            return (
              <group key={i} rotation={[0, a, 0]} position={[0, 0, 0.052 + 0.003 * i]}>
                <mesh position={[PAG.w / 2, 0, 0]}>
                  <planeGeometry args={[PAG.w - 0.04, PAG.h - 0.04]} />
                  <meshStandardMaterial color={tema.objetoClaro} roughness={0.8} side={2} />
                </mesh>
              </group>
            );
          })
        : null}
      {/* Fitas marcadoras saindo por baixo */}
      {fitas.map(([k, dest], i) =>
        k < 0.02 ? null : (
          <Caixa key={i} args={[0.07, 0.5 * k, 0.012]} raio={0.005} cor={mistura(tema.objeto, tema.acento, dest)} emissivo={0.3 * dest} sombra={false} position={[0.22 + i * 0.26, -PAG.h / 2 - 0.25 * k, 0.06]} />
        ),
      )}
    </group>
  );
};

// ---------- Crachá (pendurado no peito do boneco; usar como filho do Boneco) ----------
export const Cracha: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Caixa args={[0.16, 0.2, 0.02]} raio={0.02} cor={tema.objetoClaro} sombra={false} />
      <Caixa args={[0.12, 0.04, 0.022]} raio={0.008} cor={tema.acento} emissivo={0.3} sombra={false} position={[0, 0.05, 0.002]} />
    </group>
  );

// ---------- Diploma (canudo com fita) ----------
export const Diploma: React.FC<{tema: Tema; pos: V3; rot?: V3; k: number}> = ({tema, pos, rot = [0, 0, Math.PI / 2], k}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={k}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 20]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.065, 0.065, 0.07, 20]} />
        <Fosco cor={tema.acento} emissivo={0.3} />
      </mesh>
    </group>
  );

// ---------- Mesa da sanção (mesa pequena e caneta) ----------
// `caneta` 0..1: brilho da caneta (acende e depois apaga).
export const MesaSancao: React.FC<{tema: Tema; pos: V3; escala?: number; caneta: number}> = ({tema, pos, escala = 1, caneta}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[1.6, 0.08, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.78, 0]} />
      {[
        [-0.7, -0.36],
        [0.7, -0.36],
        [-0.7, 0.36],
        [0.7, 0.36],
      ].map(([x, z], i) => (
        <Caixa key={i} args={[0.08, 0.74, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.37, z]} />
      ))}
      {/* Folha e caneta */}
      <Caixa args={[0.5, 0.012, 0.66]} raio={0.004} cor={tema.objetoClaro} sombra={false} position={[0.1, 0.826, 0.02]} />
      <mesh position={[0.45, 0.845, 0.05]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.4, 16]} />
        <Fosco cor={mistura(tema.objeto, tema.acento, caneta)} emissivo={0.5 * caneta} />
      </mesh>
    </group>
  );

// ---------- Placar de votos: 5 gomos, `acesos` 0..5 (fração = gomo acendendo) ----------
export const PlacarVotos: React.FC<{tema: Tema; pos: V3; escala: number; acesos: number}> = ({tema, pos, escala, acesos}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[2.1, 0.5, 0.1]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0, -0.06]} />
      {Array.from({length: 5}).map((_, i) => {
        const k = Math.max(0, Math.min(1, acesos - i));
        return <Caixa key={i} args={[0.34, 0.32, 0.08]} raio={0.04} cor={mistura(tema.corpo, tema.acento, k)} emissivo={0.4 * k} sombra={false} position={[-0.8 + i * 0.4, 0, 0.02]} />;
      })}
    </group>
  );

// ---------- Linha do tempo no chão, com marcos ----------
// `k` 0..1: quanto da linha já nasceu. `acesa` 0..1: quanto já acendeu (da esquerda para a direita).
export type Marco = {x: number; k: number; aceso: number};
export const LinhaChao: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number; acesa: number; marcos: Marco[]}> = ({tema, x0, x1, z, k, acesa, marcos}) => {
  if (k < 0.01) return null;
  const len = (x1 - x0) * k;
  const lenAceso = (x1 - x0) * Math.min(k, acesa);
  return (
    <group position={[0, 0, z]}>
      <Caixa args={[len, 0.04, 0.1]} raio={0.02} cor={tema.objetoEscuro} position={[x0 + len / 2, 0.02, 0]} />
      {lenAceso > 0.01 ? <Caixa args={[lenAceso, 0.05, 0.11]} raio={0.02} cor={tema.acento} emissivo={0.5} sombra={false} position={[x0 + lenAceso / 2, 0.025, 0]} /> : null}
      {marcos.map((m, i) =>
        m.k < 0.02 ? null : (
          <group key={i} position={[m.x, 0, 0]} scale={m.k}>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
              <Fosco cor={mistura(tema.objeto, tema.acento, m.aceso)} emissivo={0.5 * m.aceso} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
              <Fosco cor={tema.objeto} />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
};

// ---------- Linha tracejada no chão (separa quem fica de fora) ----------
export const Tracejado: React.FC<{tema: Tema; a: V3; b: V3; k: number}> = ({tema, a, b, k}) => {
  if (k < 0.01) return null;
  const n = 14;
  const ang = Math.atan2(b[0] - a[0], b[2] - a[2]);
  return (
    <>
      {Array.from({length: Math.ceil(n * k)}).map((_, i) => {
        const s = (i + 0.5) / n;
        return <Caixa key={i} args={[0.08, 0.03, 0.14]} raio={0.01} cor={tema.acento} emissivo={0.4} sombra={false} position={[a[0] + (b[0] - a[0]) * s, 0.02, a[2] + (b[2] - a[2]) * s]} rotation={[0, ang, 0]} />;
      })}
    </>
  );
};
