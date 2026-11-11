import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Por que 8 horas: o relógio de 24 gomos, a fábrica inglesa, a máquina a vapor, o tear,
// o navio, a greve de Chicago, a linha de montagem com carros antigos e a porta giratória.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Texto 3D só em placas estáticas (ano, "8 HORAS").

// ---------- Relógio do Dia: 24 gomos deitados no chão ----------
// A hora 0 fica no fundo (-z) e as horas andam no sentido horário vistas de cima.
// Cada gomo: `cor`, `em` (emissivo), `sobe` (y extra) e `puxa` (sai do centro, na direção da própria hora).
export type Gomo = {cor: string; em?: number; sobe?: number; puxa?: number};
const cacheGomo = new Map<string, THREE.BufferGeometry>();
const geoGomo = (raio: number) => {
  const k = raio.toFixed(3);
  if (!cacheGomo.has(k)) {
    const r0 = raio * 0.34;
    const passo = (2 * Math.PI) / 24;
    const folga = 0.035;
    // Gomo da hora 0, centrado no -z: no plano da forma, o ângulo π/2 vira -z depois de deitar.
    const a0 = Math.PI / 2 - passo / 2 + folga;
    const a1 = Math.PI / 2 + passo / 2 - folga;
    const s = new THREE.Shape();
    s.moveTo(r0 * Math.cos(a0), r0 * Math.sin(a0));
    s.lineTo(raio * Math.cos(a0), raio * Math.sin(a0));
    s.absarc(0, 0, raio, a0, a1, false);
    s.lineTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
    s.absarc(0, 0, r0, a1, a0, true);
    const g = new THREE.ExtrudeGeometry(s, {depth: raio * 0.045, bevelEnabled: true, bevelThickness: raio * 0.012, bevelSize: raio * 0.012, bevelSegments: 2, curveSegments: 10});
    g.rotateX(-Math.PI / 2);
    cacheGomo.set(k, g);
  }
  return cacheGomo.get(k)!;
};
export const dirHora = (h: number): [number, number] => {
  const a = (2 * Math.PI * h) / 24;
  return [Math.sin(a), -Math.cos(a)];
};
export const RelogioDia: React.FC<{tema: Tema; pos: V3; raio?: number; gomos: Gomo[]; ponteiro?: number; escala?: number; giro?: number}> = ({tema, pos, raio = 5, gomos, ponteiro, escala = 1, giro = 0}) => {
  if (escala < 0.02) return null;
  const geo = geoGomo(raio);
  const passo = (2 * Math.PI) / 24;
  return (
    <group position={pos} scale={escala} rotation={[0, giro, 0]}>
      {/* Base escura e aro */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[raio * 1.05, raio * 1.07, 0.04, 96]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {gomos.map((g, h) => {
        const [dx, dz] = dirHora(h + 0.5);
        const p = g.puxa ?? 0;
        return (
          <mesh key={h} geometry={geo} position={[dx * p, 0.04 + (g.sobe ?? 0), dz * p]} rotation={[0, -passo * h, 0]} castShadow receiveShadow>
            <Fosco cor={g.cor} emissivo={g.em ?? 0} />
          </mesh>
        );
      })}
      {/* Marcas das 0, 6, 12 e 18 horas no aro */}
      {[0, 6, 12, 18].map((h) => {
        const [dx, dz] = dirHora(h);
        return <Caixa key={h} args={[0.08 * raio * 0.2, 0.05, 0.5 * raio * 0.2]} raio={0.02} cor={tema.objetoClaro} position={[dx * raio * 1.11, 0.03, dz * raio * 1.11]} rotation={[0, -(2 * Math.PI * h) / 24, 0]} />;
      })}
      {/* Miolo */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[raio * 0.28, raio * 0.3, raio * 0.06, 64]} />
        <Fosco cor={tema.branco} />
      </mesh>
      {ponteiro !== undefined ? (
        <group position={[0, raio * 0.06 + 0.16, 0]} rotation={[0, -(2 * Math.PI * ponteiro) / 24, 0]}>
          <Caixa args={[raio * 0.05, raio * 0.03, raio * 0.95]} raio={raio * 0.012} cor={tema.objetoClaro} emissivo={0.15} position={[0, 0, -raio * 0.42]} />
          <mesh castShadow>
            <cylinderGeometry args={[raio * 0.06, raio * 0.06, raio * 0.05, 24]} />
            <Fosco cor={tema.acento} emissivo={0.3} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

// ---------- Fábrica inglesa: tijolo, telhado dente de serra, chaminé, relógio na fachada ----------
// Frente em +z. `janelas` 0..1 acende as janelas. `relogio`: ângulo do ponteiro. Chaminé: FAB.chamine (local).
export const FAB = {larg: 8, prof: 4, alt: 3.4, chamine: [2.9, 7.6, -1.1] as V3, apito: [-2.6, 4.25, 0.4] as V3};
export const Fabrica: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; janelas?: number; relogio?: number; cinza?: number}> = ({tema, pos, rotY = 0, escala = 1, janelas = 0, relogio = 0, cinza = 0}) => {
  if (escala < 0.02) return null;
  const {larg, prof, alt} = FAB;
  const tijolo = mistura(mistura(tema.areia, tema.objetoEscuro, 0.62), tema.corpo, cinza);
  const escuro = mistura(tijolo, tema.fundo, 0.45);
  const vidro = mistura(tema.objetoEscuro, tema.areia, janelas * (1 - cinza));
  const dentes = 4;
  const dl = larg / dentes;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[larg, alt, prof]} raio={0.08} cor={tijolo} position={[0, alt / 2, 0]} />
      {/* Faixas de tijolo mais escuro */}
      {[0.9, 1.9, 2.9].map((y) => (
        <Caixa key={y} args={[larg + 0.04, 0.08, prof + 0.04]} raio={0.02} cor={escuro} position={[0, y, 0]} />
      ))}
      {/* Telhado dente de serra (lado inclinado + lado de vidro) */}
      {Array.from({length: dentes}).map((_, i) => {
        const x = -larg / 2 + dl * (i + 0.5);
        return (
          <group key={i} position={[x, alt, 0]}>
            <Caixa args={[dl * 1.05, 0.1, prof + 0.2]} raio={0.03} cor={escuro} position={[-0.05, 0.45, 0]} rotation={[0, 0, 0.42]} />
            <Caixa args={[0.08, 0.9, prof + 0.1]} raio={0.02} cor={vidro} emissivo={0.5 * janelas * (1 - cinza)} position={[dl / 2 - 0.12, 0.45, 0]} />
          </group>
        );
      })}
      {/* Janelas da frente: duas fileiras */}
      {[1.35, 2.45].map((y) =>
        [-3.1, -1.9, 1.9, 3.1].map((x) => (
          <group key={`${x}${y}`} position={[x, y, prof / 2 + 0.02]}>
            <Caixa args={[0.72, 0.68, 0.06]} raio={0.03} cor={escuro} />
            <Caixa args={[0.58, 0.54, 0.05]} raio={0.02} cor={vidro} emissivo={0.6 * janelas * (1 - cinza)} position={[0, 0, 0.02]} />
            <Caixa args={[0.04, 0.54, 0.06]} raio={0.01} cor={escuro} position={[0, 0, 0.04]} />
          </group>
        )),
      )}
      {/* Portão */}
      <Caixa args={[1.7, 2.1, 0.08]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.05, prof / 2 + 0.03]} />
      <Caixa args={[1.9, 0.12, 0.14]} raio={0.03} cor={escuro} position={[0, 2.15, prof / 2 + 0.05]} />
      {/* Relógio na fachada, acima do portão */}
      <group position={[0, alt - 0.55, prof / 2 + 0.06]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 40]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        <group position={[0, 0, 0.06]} rotation={[0, 0, -relogio]}>
          <Caixa args={[0.05, 0.34, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.15, 0]} />
        </group>
        <group position={[0, 0, 0.07]} rotation={[0, 0, -relogio / 12]}>
          <Caixa args={[0.06, 0.22, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.09, 0]} />
        </group>
      </group>
      {/* Chaminé */}
      <group position={[FAB.chamine[0], 0, FAB.chamine[2]]}>
        <mesh position={[0, FAB.chamine[1] / 2, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.46, FAB.chamine[1], 24]} />
          <Fosco cor={tijolo} />
        </mesh>
        {[2.5, 4.5, FAB.chamine[1] - 0.15].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.16, 24]} />
            <Fosco cor={escuro} />
          </mesh>
        ))}
      </group>
      {/* Apito no telhado */}
      <group position={[FAB.apito[0], alt + 0.2, FAB.apito[2]]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 10]} />
          <Fosco cor={tema.objeto} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.12, 0.28, 16]} />
          <meshStandardMaterial color={tema.areia} roughness={0.35} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Chaminé solta (as fábricas que se multiplicam) ----------
export const Chamine: React.FC<{tema: Tema; pos: V3; alt: number; sobe: number}> = ({tema, pos, alt, sobe}) => {
  if (sobe < 0.02) return null;
  const tijolo = mistura(tema.areia, tema.objetoEscuro, 0.66);
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      <Caixa args={[3.2, 2.2, 2.6]} raio={0.06} cor={tijolo} position={[0, 1.1, 0]} />
      <mesh position={[0.8, alt / 2, -0.4]} castShadow>
        <cylinderGeometry args={[0.26, 0.38, alt, 20]} />
        <Fosco cor={tijolo} />
      </mesh>
    </group>
  );
};

// ---------- Máquina a vapor: caldeira, volante que gira, pistão ----------
// Frente em +z, comprimento em x. `giro`: ângulo do volante (rad).
export const MaquinaVapor: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; giro: number; cinza?: number}> = ({tema, pos, rotY = 0, escala = 1, giro, cinza = 0}) => {
  if (escala < 0.02) return null;
  const ferro = mistura(tema.objetoEscuro, tema.corpo, 0.3 + 0.4 * cinza);
  const latao = mistura(tema.areia, tema.corpo, cinza);
  const pino: V3 = [0.95 + 0.32 * Math.cos(giro), 1.0 + 0.32 * Math.sin(giro), 0.32];
  const cruz: V3 = [0.2 + 0.32 * Math.cos(giro), 1.0, 0.32];
  const rodX = (pino[0] + cruz[0]) / 2;
  const rodY = (pino[1] + cruz[1]) / 2;
  const rodL = Math.hypot(pino[0] - cruz[0], pino[1] - cruz[1]);
  const rodA = Math.atan2(pino[1] - cruz[1], pino[0] - cruz[0]);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[2.6, 0.3, 1.2]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.15, 0]} />
      {/* Caldeira deitada */}
      <mesh position={[-0.55, 0.85, -0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.3, 32]} />
        <Fosco cor={ferro} />
      </mesh>
      {[-1.05, -0.55, -0.05].map((x) => (
        <mesh key={x} position={[x, 0.85, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.47, 0.06, 32]} />
          <meshStandardMaterial color={latao} roughness={0.35} metalness={0.45} />
        </mesh>
      ))}
      <mesh position={[-0.75, 1.55, -0.05]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.9, 16]} />
        <Fosco cor={ferro} />
      </mesh>
      <mesh position={[-0.3, 1.32, -0.05]} castShadow>
        <sphereGeometry args={[0.16, 18, 14]} />
        <meshStandardMaterial color={latao} roughness={0.35} metalness={0.45} />
      </mesh>
      {/* Cilindro do pistão e a biela */}
      <Caixa args={[0.5, 0.26, 0.26]} raio={0.06} cor={ferro} position={[0.25, 1.0, 0.32]} />
      <Caixa args={[rodL, 0.06, 0.06]} raio={0.02} cor={tema.objeto} position={[rodX, rodY, 0.36]} rotation={[0, 0, rodA]} />
      {/* Volante */}
      <group position={[0.95, 1.0, 0.25]} rotation={[0, 0, giro]}>
        <mesh castShadow>
          <torusGeometry args={[0.58, 0.07, 12, 40]} />
          <Fosco cor={ferro} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Caixa key={i} args={[1.12, 0.05, 0.05]} raio={0.015} cor={ferro} rotation={[0, 0, (i * Math.PI) / 6]} />
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 16]} />
          <meshStandardMaterial color={latao} roughness={0.35} metalness={0.45} />
        </mesh>
      </group>
      <Caixa args={[0.14, 0.7, 0.14]} raio={0.03} cor={ferro} position={[0.95, 0.5, 0.0]} />
    </group>
  );
};

// ---------- Tear: armação, fios, rolo e o tecido que sai ----------
// Frente em +z. `giro`: rolo. `tecido`: comprimento do pano já saído (m).
export const Tear: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; giro: number; tecido: number}> = ({tema, pos, rotY = 0, escala = 1, giro, tecido}) => {
  if (escala < 0.02) return null;
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.35);
  const L = 1.7;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {[-1, 1].map((l) =>
        [-0.5, 0.5].map((z) => <Caixa key={`${l}${z}`} args={[0.1, 1.35, 0.1]} raio={0.03} cor={madeira} position={[(l * L) / 2, 0.675, z]} />),
      )}
      <Caixa args={[L + 0.1, 0.1, 0.1]} raio={0.03} cor={madeira} position={[0, 1.35, -0.5]} />
      <Caixa args={[L + 0.1, 0.1, 0.1]} raio={0.03} cor={madeira} position={[0, 1.35, 0.5]} />
      <Caixa args={[L + 0.1, 0.08, 0.08]} raio={0.03} cor={madeira} position={[0, 0.35, 0]} />
      {/* Fios esticados da trave de trás até o rolo */}
      {Array.from({length: 14}).map((_, i) => (
        <mesh key={i} position={[-L / 2 + 0.12 + i * ((L - 0.24) / 13), 1.0, 0]} rotation={[0.62, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.2, 4]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
      ))}
      {/* Pente (bate de um lado para o outro) */}
      <Caixa args={[L - 0.1, 0.18, 0.04]} raio={0.02} cor={madeira} position={[0, 0.98, 0.08 + 0.06 * Math.sin(giro * 2)]} />
      {/* Rolo de tecido */}
      <mesh position={[0, 0.65, 0.55]} rotation={[giro, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, L - 0.15, 24]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      {tecido > 0.02 ? (
        <group position={[0, 0.5, 0.62]} rotation={[0.9, 0, 0]}>
          <Caixa args={[L - 0.2, tecido, 0.015]} raio={0.005} cor={tema.objetoClaro} position={[0, -tecido / 2, 0]} />
          {Array.from({length: Math.max(1, Math.floor(tecido / 0.22))}).map((_, i) => (
            <Caixa key={i} args={[L - 0.2, 0.04, 0.02]} raio={0.005} cor={tema.corpo} position={[0, -0.12 - i * 0.22, 0.004]} />
          ))}
        </group>
      ) : null}
    </group>
  );
};

// ---------- Engrenagem ----------
export const Engrenagem: React.FC<{tema: Tema; pos: V3; rot?: V3; r?: number; giro: number; cor?: string; emissivo?: number; escala?: number}> = ({tema, pos, rot = [0, 0, 0], r = 0.5, giro, cor, emissivo = 0, escala = 1}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.objeto;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <group rotation={[0, 0, giro]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[r, r, r * 0.3, 40]} />
          <Fosco cor={c} emissivo={emissivo} />
        </mesh>
        {Array.from({length: 12}).map((_, i) => {
          const a = (i * 2 * Math.PI) / 12;
          return <Caixa key={i} args={[r * 0.28, r * 0.3, r * 0.3]} raio={r * 0.04} cor={c} emissivo={emissivo} position={[Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08, 0]} rotation={[0, 0, a]} />;
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[r * 0.28, r * 0.28, r * 0.34, 24]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Chapéus (filhos do Boneco: coordenadas do boneco) ----------
export const Cartola: React.FC<{tema: Tema}> = ({tema}) => (
  <group position={[0, 2.0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.27, 0.27, 0.025, 28]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 0.17, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.15, 0.34, 28]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.152, 0.152, 0.05, 28]} />
      <Fosco cor={tema.acento} emissivo={0.2} />
    </mesh>
  </group>
);
export const Chapeu: React.FC<{tema: Tema}> = ({tema}) => (
  <group position={[0, 1.98, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.025, 28]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 0.08, 0]} castShadow scale={[1, 1, 0.9]}>
      <cylinderGeometry args={[0.14, 0.16, 0.16, 28]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
  </group>
);
export const Bone: React.FC<{tema: Tema; cor?: string}> = ({tema, cor}) => (
  <group position={[0, 1.93, 0.01]}>
    <mesh scale={[1, 0.45, 1.05]} castShadow>
      <sphereGeometry args={[0.185, 20, 14]} />
      <Fosco cor={cor ?? tema.objetoEscuro} />
    </mesh>
    <Caixa args={[0.28, 0.025, 0.14]} raio={0.01} cor={cor ?? tema.objetoEscuro} position={[0, -0.03, 0.17]} rotation={[0.15, 0, 0]} />
  </group>
);
export const Quepe: React.FC<{tema: Tema}> = ({tema}) => (
  <group position={[0, 1.97, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.2, 0.17, 0.12, 24]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 0.07, 0]}>
      <cylinderGeometry args={[0.21, 0.21, 0.025, 24]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <Caixa args={[0.26, 0.02, 0.13]} raio={0.008} cor={tema.tinta} position={[0, -0.05, 0.18]} rotation={[0.25, 0, 0]} />
    <mesh position={[0, 0.0, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
      <meshStandardMaterial color={tema.areia} roughness={0.3} metalness={0.5} />
    </mesh>
  </group>
);

// ---------- Cama e poltrona (o "descanso" e o "viver") ----------
export const Cama: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.0, 0.28, 1.9]} raio={0.05} cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} position={[0, 0.2, 0]} />
      <Caixa args={[0.94, 0.16, 1.82]} raio={0.07} cor={tema.objetoClaro} position={[0, 0.41, 0]} />
      <Caixa args={[0.96, 0.08, 1.1]} raio={0.04} cor={tema.corpo} position={[0, 0.5, 0.35]} />
      <Caixa args={[0.6, 0.12, 0.32]} raio={0.06} cor={tema.objetoClaro} position={[0, 0.54, -0.68]} />
      <Caixa args={[1.04, 0.75, 0.08]} raio={0.04} cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} position={[0, 0.45, -0.95]} />
    </group>
  );
export const Poltrona: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.95, 0.4, 0.85]} raio={0.1} cor={tema.objeto} position={[0, 0.3, 0]} />
      <Caixa args={[0.95, 0.75, 0.22]} raio={0.1} cor={tema.objeto} position={[0, 0.72, -0.33]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.18, 0.55, 0.85]} raio={0.08} cor={tema.objeto} position={[0.43 * l, 0.47, 0]} />
      ))}
      {/* Livro aberto no braço */}
      <Caixa args={[0.32, 0.04, 0.24]} raio={0.01} cor={tema.acento} emissivo={0.2} position={[0.43, 0.77, 0.12]} rotation={[0, 0.3, 0]} />
      <Caixa args={[0.28, 0.02, 0.22]} raio={0.005} cor={tema.objetoClaro} position={[0.43, 0.8, 0.12]} rotation={[0, 0.3, 0]} />
    </group>
  );

// ---------- Mar (placa com ondas lentas) ----------
export const Mar: React.FC<{tema: Tema; x0: number; x1: number; z0: number; z1: number; t: number}> = ({tema, x0, x1, z0, z1, t}) => {
  // mistura() interpola em espaço linear: frações pequenas de uma cor clara já clareiam muito.
  const agua = mistura(tema.fundo, tema.objetoEscuro, 0.3);
  const crista = mistura(agua, tema.objetoClaro, 0.12);
  const w = x1 - x0;
  const d = z1 - z0;
  const filas = Math.floor(d / 1.6);
  return (
    <group>
      <mesh position={[x0 + w / 2, 0.012, z0 + d / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={agua} roughness={0.95} metalness={0} envMapIntensity={0.15} />
      </mesh>
      {Array.from({length: filas}).map((_, i) =>
        [0, 1, 2].map((j) => {
          const x = x0 + 0.6 + (((j * w) / 3 + t * 0.35 + i * 0.9) % (w - 1.2));
          return <Caixa key={`${i}${j}`} args={[1.0, 0.03, 0.08]} raio={0.015} cor={crista} sombra={false} position={[x, 0.03 + 0.02 * Math.sin(t * 1.4 + i + j), z0 + 0.8 + i * 1.6]} />;
        }),
      )}
    </group>
  );
};

// ---------- Navio a vapor (proa em +x), vela com as 3 faixas do 8-8-8 ----------
export const Navio: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; t: number}> = ({tema, pos, rotY = 0, escala = 1, t}) => {
  if (escala < 0.02) return null;
  const casco = mistura(tema.objetoEscuro, tema.fundo, 0.2);
  return (
    <group position={[pos[0], pos[1] + 0.04 * Math.sin(t * 1.6), pos[2]]} rotation={[0.03 * Math.sin(t * 1.3), rotY, 0.02 * Math.sin(t * 1.1)]} scale={escala}>
      <Caixa args={[3.0, 0.6, 1.0]} raio={0.14} cor={casco} position={[0, 0.3, 0]} />
      <Caixa args={[0.8, 0.6, 0.72]} raio={0.14} cor={casco} position={[1.55, 0.32, 0]} rotation={[0, Math.PI / 4, 0]} />
      <Caixa args={[3.1, 0.08, 1.04]} raio={0.03} cor={tema.objeto} position={[0, 0.62, 0]} />
      <Caixa args={[1.2, 0.5, 0.7]} raio={0.06} cor={tema.objetoClaro} position={[-0.5, 0.9, 0]} />
      {[-0.75, -0.25].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, 0.7, 16]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
          <mesh position={[x, 1.77, 0]}>
            <cylinderGeometry args={[0.135, 0.135, 0.08, 16]} />
            <Fosco cor={tema.acento} emissivo={0.25} />
          </mesh>
        </group>
      ))}
      {/* Mastro e vela: trabalho (acento), descanso (cinza), viver (claro) */}
      <mesh position={[0.8, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 2.0, 10]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      {[tema.acento, tema.corpo, tema.objetoClaro].map((c, i) => (
        <Caixa key={i} args={[0.04, 0.38, 0.9]} raio={0.01} cor={c} emissivo={i === 0 ? 0.3 : 0.05} position={[0.86, 2.3 - i * 0.4, 0]} />
      ))}
    </group>
  );
};

// ---------- Prédio de tijolo (fábrica antiga) ----------
export const Sobrado: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; prof?: number; sobe: number; luz?: number; cor?: string}> = ({tema, pos, larg, alt, prof = 2.4, sobe, luz = 0, cor}) => {
  if (sobe < 0.02) return null;
  const c = cor ?? mistura(tema.areia, tema.objetoEscuro, 0.68);
  const vidro = mistura(tema.objetoEscuro, tema.areia, luz);
  const cols = Math.max(1, Math.floor(larg / 0.9));
  const fil = Math.max(1, Math.floor((alt - 0.6) / 1.1));
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      <Caixa args={[larg, alt, prof]} raio={0.06} cor={c} position={[0, alt / 2, 0]} />
      <Caixa args={[larg + 0.2, 0.16, prof + 0.2]} raio={0.04} cor={mistura(c, tema.fundo, 0.4)} position={[0, alt, 0]} />
      {Array.from({length: fil}).map((_, j) =>
        Array.from({length: cols}).map((_, i) => (
          <Caixa key={`${i}${j}`} args={[0.42, 0.62, 0.05]} raio={0.02} cor={vidro} emissivo={0.5 * luz} position={[-larg / 2 + (larg / cols) * (i + 0.5), 1.0 + j * 1.1, prof / 2 + 0.02]} />
        )),
      )}
    </group>
  );
};

// ---------- Placa de greve "8 HORAS" num cabo ----------
export const PlacaGreve: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number}> = ({tema, pos, rot = [0, 0, 0], escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, -0.45, -0.03]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
        <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.3)} />
      </mesh>
      <Placa tema={tema} pos={[0, 0.15, 0]} larg={0.82} alt={0.46} linhas={[{t: '8 HORAS', tam: 210, cor: tema.acento, peso: 900}]} fundo={tema.objetoClaro} />
    </group>
  );

// ---------- Placa de ano à beira da estrada ----------
export const PlacaAno: React.FC<{tema: Tema; pos: V3; ano: string; sobe: number; destaque?: number; rotY?: number}> = ({tema, pos, ano, sobe, destaque = 0, rotY = 0}) => {
  if (sobe < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, sobe, 1]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 10]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <Caixa args={[1.42, 0.66, 0.05]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, destaque)} emissivo={0.5 * destaque} position={[0, 1.25, -0.03]} />
      <Placa tema={tema} pos={[0, 1.25, 0]} larg={1.3} alt={0.56} linhas={[{t: ano, tam: 300, cor: tema.tinta, peso: 850}]} fundo={tema.branco} />
    </group>
  );
};

// ---------- Esteira da linha de montagem (comprimento em x) ----------
export const ALT_ESTEIRA = 0.8;
export const Esteira: React.FC<{tema: Tema; pos: V3; comp: number; anda: number}> = ({tema, pos, comp, anda}) => {
  const n = Math.floor(comp / 0.6);
  return (
    <group position={pos}>
      {Array.from({length: Math.floor(comp / 2) + 1}).map((_, i) =>
        [-0.55, 0.55].map((z) => <Caixa key={`${i}${z}`} args={[0.1, ALT_ESTEIRA - 0.1, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[-comp / 2 + i * 2 + 0.1, (ALT_ESTEIRA - 0.1) / 2, z]} />),
      )}
      <Caixa args={[comp, 0.1, 1.3]} raio={0.04} cor={tema.objetoEscuro} position={[0, ALT_ESTEIRA - 0.12, 0]} />
      <Caixa args={[comp - 0.1, 0.04, 1.1]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.fundo, 0.5)} position={[0, ALT_ESTEIRA - 0.05, 0]} />
      {/* Ripas da esteira andando */}
      {Array.from({length: n}).map((_, i) => {
        const x = -comp / 2 + 0.1 + ((i * 0.6 + anda) % (comp - 0.2));
        return <Caixa key={i} args={[0.05, 0.02, 1.05]} raio={0.008} cor={tema.corpo} sombra={false} position={[x, ALT_ESTEIRA - 0.02, 0]} />;
      })}
      {[-0.67, 0.67].map((z) => (
        <Caixa key={z} args={[comp, 0.12, 0.06]} raio={0.02} cor={tema.objeto} position={[0, ALT_ESTEIRA + 0.02, z]} />
      ))}
      {[-1, 1].map((l) => (
        <mesh key={l} position={[(l * comp) / 2, ALT_ESTEIRA - 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 1.3, 20]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Carro antigo (anos 1910): alto, capota, rodas de raio, estribo ----------
// Frente em +x. `monta` 0..1: chassi e rodas → capô e radiador → carroceria e para-lamas → capota.
const G_PNEU_A = new THREE.TorusGeometry(0.33, 0.05, 10, 32);
export const CarroAntigo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; monta?: number; anda?: number; cor?: string}> = ({tema, pos, rotY = 0, escala = 1, monta = 1, anda = 0, cor}) => {
  if (escala < 0.02) return null;
  const c = cor ?? mistura(tema.objetoEscuro, tema.fundo, 0.25);
  const raio = mistura(tema.areia, tema.objetoEscuro, 0.2);
  const latao = tema.areia;
  const k1 = Math.max(0, Math.min(1, monta * 4 - 0.6));
  const k2 = Math.max(0, Math.min(1, monta * 4 - 1.6));
  const k3 = Math.max(0, Math.min(1, monta * 4 - 2.6));
  const giro = -anda / 0.38;
  const lataria = (props: {args: V3; position: V3; rotation?: V3; raio?: number}) => <Caixa {...props} raio={props.raio ?? 0.05} cor={c} />;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Rodas de raio */}
      {[0.78, -0.72].map((x) =>
        [-0.5, 0.5].map((z) => (
          <group key={`${x}${z}`} position={[x, 0.38, z]} rotation={[0, 0, giro]}>
            <mesh geometry={G_PNEU_A} castShadow>
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
            {Array.from({length: 6}).map((_, i) => (
              <Caixa key={i} args={[0.6, 0.035, 0.035]} raio={0.01} cor={raio} rotation={[0, 0, (i * Math.PI) / 6]} />
            ))}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.12, 14]} />
              <meshStandardMaterial color={latao} roughness={0.3} metalness={0.5} />
            </mesh>
          </group>
        )),
      )}
      {/* Chassi */}
      {[-0.32, 0.32].map((z) => (
        <Caixa key={z} args={[2.3, 0.08, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0.03, 0.42, z]} />
      ))}
      <Caixa args={[0.08, 0.06, 1.0]} raio={0.02} cor={tema.objetoEscuro} position={[0.78, 0.38, 0]} />
      <Caixa args={[0.08, 0.06, 1.0]} raio={0.02} cor={tema.objetoEscuro} position={[-0.72, 0.38, 0]} />
      {/* Capô, radiador e faróis */}
      {k1 > 0.01 ? (
        <group scale={[1, k1, 1]} position={[0, 0.45 * (1 - k1), 0]}>
          {lataria({args: [0.72, 0.42, 0.62], position: [0.72, 0.72, 0], raio: 0.08})}
          <Caixa args={[0.08, 0.56, 0.6]} raio={0.03} cor={latao} position={[1.12, 0.76, 0]} />
          {[-0.28, 0.28].map((z) => (
            <mesh key={z} position={[1.2, 0.9, z]} castShadow>
              <sphereGeometry args={[0.08, 14, 12]} />
              <meshStandardMaterial color={latao} roughness={0.3} metalness={0.5} emissive={latao} emissiveIntensity={0.15} />
            </mesh>
          ))}
        </group>
      ) : null}
      {/* Carroceria, banco, para-lamas e estribo */}
      {k2 > 0.01 ? (
        <group scale={[1, k2, 1]} position={[0, 0.45 * (1 - k2), 0]}>
          {lataria({args: [1.15, 0.5, 0.86], position: [-0.18, 0.8, 0], raio: 0.08})}
          {lataria({args: [0.5, 0.36, 0.86], position: [-0.5, 1.15, 0]})}
          {[-1, 1].map((l) => (
            <group key={l}>
              <Caixa args={[1.0, 0.04, 0.2]} raio={0.015} cor={tema.objetoEscuro} position={[0.03, 0.46, 0.52 * l]} />
              {lataria({args: [0.6, 0.05, 0.24], position: [0.82, 0.76, 0.5 * l], rotation: [0, 0, -0.25], raio: 0.02})}
              {lataria({args: [0.6, 0.05, 0.24], position: [-0.74, 0.76, 0.5 * l], rotation: [0, 0, 0.25], raio: 0.02})}
            </group>
          ))}
        </group>
      ) : null}
      {/* Para-brisa, volante e capota de lona */}
      {k3 > 0.01 ? (
        <group scale={[1, k3, 1]} position={[0, 0.6 * (1 - k3), 0]}>
          <Caixa args={[0.04, 0.55, 0.8]} raio={0.015} cor={tema.objeto} position={[0.36, 1.32, 0]} />
          <mesh position={[0.25, 1.2, 0.18]} rotation={[0, 0, 1.1]}>
            <torusGeometry args={[0.12, 0.018, 8, 20]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
          {[-0.36, 0.36].map((z) =>
            [0.32, -0.75].map((x) => <Caixa key={`${x}${z}`} args={[0.035, 0.6, 0.035]} raio={0.01} cor={tema.objetoEscuro} position={[x, 1.38, z]} />),
          )}
          <Caixa args={[1.2, 0.06, 0.86]} raio={0.03} cor={mistura(c, tema.corpo, 0.15)} position={[-0.22, 1.7, 0]} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Lâmpada num poste ----------
export const PosteLampada: React.FC<{tema: Tema; pos: V3; escala?: number; acesa: number}> = ({tema, pos, escala = 1, acesa}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.4, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 2.6, 12]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.7, 0.05, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0.3, 2.6, 0]} />
      <mesh position={[0.62, 2.48, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.14, 14]} />
        <meshStandardMaterial color={tema.areia} roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh position={[0.62, 2.28, 0]} scale={[1, 1.2, 1]}>
        <sphereGeometry args={[0.16, 22, 18]} />
        <meshStandardMaterial color={mistura(tema.objetoClaro, tema.areia, 0.5 * acesa)} emissive={tema.areia} emissiveIntensity={2.2 * acesa} roughness={0.2} transparent opacity={0.6 + 0.4 * acesa} />
      </mesh>
    </group>
  );

// ---------- Barril de petróleo ----------
export const Barril: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number}> = ({tema, pos, rot = [0, 0, 0], escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.9, 28]} />
        <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.fundo, 0.3)} roughness={0.4} metalness={0.25} />
      </mesh>
      {[0.12, 0.45, 0.78].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.335, 0.335, 0.05, 28]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
      <mesh position={[0.12, 0.91, 0.08]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

// ---------- Porta giratória (frente em +z), num pedaço de parede ----------
export const PortaGiratoria: React.FC<{tema: Tema; pos: V3; giro: number; escala?: number}> = ({tema, pos, giro, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0, 1.2, 0]} rotation={[0, l > 0 ? Math.PI * 0.18 : Math.PI * 1.18, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 2.4, 32, 1, true, 0, Math.PI * 0.64]} />
          <meshStandardMaterial color={tema.objeto} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 2.45, 0]} castShadow>
        <cylinderGeometry args={[1.08, 1.08, 0.12, 32]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.04, 32]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <group rotation={[0, giro, 0]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.4, 10]} />
          <Fosco cor={tema.objeto} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <Caixa args={[0.92, 2.2, 0.04]} raio={0.02} cor={tema.objeto} position={[0.48, 1.2, 0]} />
            <mesh position={[0.48, 1.2, 0.025]}>
              <planeGeometry args={[0.78, 2.0]} />
              <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.ceuLuz, 0.4)} roughness={0.15} transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );

// ---------- Prato (o intervalo do almoço) ----------
export const Prato: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.28, 0.06, 32]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.07, 0]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.2, 18, 12]} />
        <Fosco cor={tema.areia} />
      </mesh>
      <Caixa args={[0.04, 0.02, 0.5]} raio={0.008} cor={tema.objeto} position={[0.45, 0.02, 0]} />
      <Caixa args={[0.05, 0.02, 0.5]} raio={0.008} cor={tema.objeto} position={[-0.45, 0.02, 0]} />
    </group>
  );

// ---------- Sol e lua ----------
export const Sol: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <mesh position={pos} scale={escala}>
      <sphereGeometry args={[0.55, 28, 20]} />
      <meshStandardMaterial color={tema.areia} emissive={tema.areia} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  );
export const Lua: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh>
        <sphereGeometry args={[0.45, 28, 20]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0.22, 0.12, 0.25]}>
        <sphereGeometry args={[0.4, 28, 20]} />
        <meshBasicMaterial color={tema.ceu} />
      </mesh>
    </group>
  );

// ---------- Notificação (cartãozinho que pula do celular) ----------
export const Notificacao: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number}> = ({tema, pos, rot = [0, 0, 0], escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.9, 0.26, 0.05]} raio={0.06} cor={tema.objetoClaro} emissivo={0.15} />
      <mesh position={[-0.32, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
        <Fosco cor={tema.acento} emissivo={0.5} />
      </mesh>
      {[0.05, -0.05].map((y, i) => (
        <Caixa key={y} args={[i === 0 ? 0.48 : 0.34, 0.035, 0.02]} raio={0.01} cor={tema.corpo} position={[0.06 - (i === 0 ? 0 : 0.07), y, 0.03]} />
      ))}
    </group>
  );

// ---------- Flor (homenagem no lugar dos operários) ----------
export const Flor: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 6]} />
        <Fosco cor={tema.corpo} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 2 * Math.PI) / 5;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.06, 0.42, Math.sin(a) * 0.06]} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <Fosco cor={tema.objetoClaro} emissivo={0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.43, 0]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <Fosco cor={tema.acento} emissivo={0.4} />
      </mesh>
    </group>
  );

// ---------- Estrada do tempo (faixa no chão em x, com tracejado) ----------
// `acesa`: trechos [x0, x1, k] que acendem em acento.
export const Estrada: React.FC<{tema: Tema; trechos: [number, number][]; z: number; larg?: number; acesa?: [number, number, number][]}> = ({tema, trechos, z, larg = 1.8, acesa = []}) => (
  <group>
    {trechos.map(([a, b]) => (
      <group key={a}>
        <Caixa args={[b - a, 0.04, larg]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.fundo, 0.25)} position={[(a + b) / 2, 0.02, z]} />
        {Array.from({length: Math.floor((b - a) / 1.4)}).map((_, i) => (
          <Caixa key={i} args={[0.6, 0.012, 0.08]} raio={0.005} cor={tema.objeto} sombra={false} position={[a + 0.7 + i * 1.4, 0.045, z]} />
        ))}
      </group>
    ))}
    {acesa.map(([a, b, k], i) =>
      k < 0.01 ? null : <Caixa key={i} args={[(b - a) * k, 0.03, larg * 0.32]} raio={0.01} cor={tema.acento} emissivo={0.7} sombra={false} position={[a + ((b - a) * k) / 2, 0.055, z + larg * 0.3]} />,
    )}
  </group>
);
