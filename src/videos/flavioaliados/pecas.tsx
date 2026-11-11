// Peças novas do vídeo 004. flávio bolsonaro e aliados.
// Foscas, cores só do tema, frente em z+, base no chão. Pessoas reais só como boneco genérico sem rosto, com placa do nome.
import React from 'react';
import * as THREE from 'three';
import {Boneco, Caixa, Fosco, Placa, geoCaixa, type Pose, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import {ESCURO, type Tema} from '../../base/tema';

const festa = (tema: Tema) => tema.festa ?? ESCURO.festa!;

// ---------- A espiral do tempo: 2000 no centro, 2026 na ponta de fora ----------
export const ANO0 = 2000;
export const ANO1 = 2027;
export const voltaDe = (a: number) => (a - ANO0) * 0.385;
export const raioDe = (a: number) => 3 + (a - ANO0) * 0.55;
/** Ponto da trilha no ano `a` (fracionário). */
export const naTrilha = (a: number, y = 0): V3 => {
  const th = voltaDe(a);
  const r = raioDe(a);
  return [r * Math.sin(th), y, r * Math.cos(th)];
};
/** Direção para fora da espiral (radial) no ano `a`. */
export const foraDe = (a: number): V3 => {
  const th = voltaDe(a);
  return [Math.sin(th), 0, Math.cos(th)];
};
/** Direção ao longo da trilha (para onde o tempo anda) no ano `a`. */
export const frenteDe = (a: number): V3 => {
  const th = voltaDe(a);
  return [Math.cos(th), 0, -Math.sin(th)];
};
/** Ponto ao lado da trilha: `fora` metros para fora (negativo = para dentro) e `lado` metros ao longo dela. */
export const aoLado = (a: number, fora: number, lado = 0, y = 0): V3 => {
  const p = naTrilha(a);
  const n = foraDe(a);
  const f = frenteDe(a);
  return [p[0] + n[0] * fora + f[0] * lado, y, p[2] + n[2] * fora + f[2] * lado];
};
/** Rotação em y para uma peça olhar para fora da espiral (frente z+ apontando para fora). */
export const olharFora = (a: number) => voltaDe(a);

// `k` 0..1: quanto da trilha já nasceu (do centro para fora). `aceso`: até que ano a trilha está acesa.
const PASSOS = 220;
const G_PEDACO = geoCaixa(0.62, 0.05, 0.9, 0.02);
export const TrilhaEspiral: React.FC<{tema: Tema; k: number; aceso: number; destaque: number; t: number}> = ({tema, k, aceso, destaque, t}) => {
  if (k < 0.01) return null;
  const itens = [];
  for (let i = 0; i < PASSOS; i++) {
    const u = i / PASSOS;
    if (u > k) break;
    const a = ANO0 + u * (ANO1 - ANO0);
    const p = naTrilha(a);
    const luz = a <= aceso ? 1 : 0;
    const perto = Math.max(0, 1 - Math.abs(a - destaque) * 1.6);
    const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, 0.35 * luz), tema.acento, 0.7 * perto);
    itens.push(
      <mesh key={i} geometry={G_PEDACO} position={[p[0], 0.035, p[2]]} rotation={[0, voltaDe(a) + Math.PI / 2, 0]} receiveShadow>
        <Fosco cor={cor} emissivo={0.05 + 0.35 * perto + 0.04 * Math.sin(t * 0.6 + i * 0.1) * luz} />
      </mesh>,
    );
  }
  return <>{itens}</>;
};

// ---------- Pessoa: boneco genérico com a placa do nome em cima ----------
// `cor` da roupa; `cinza` 0..1 leva a cor ao cinza (trecho de acusação). `k` 0..1 nasce. Placa sempre virada para `rotY`.
export const Pessoa: React.FC<{tema: Tema; pos: V3; rotY?: number; cor: string; nome: string; k: number; cinza?: number; escala?: number; pose?: Pose; placa?: number; placaY?: number; children?: React.ReactNode}> = ({
  tema,
  pos,
  rotY = 0,
  cor,
  nome,
  k,
  cinza = 0,
  escala = 0.55,
  pose,
  placa = 1,
  placaY = 0,
  children,
}) => {
  if (k < 0.02) return null;
  const c = mistura(cor, tema.objeto, Math.max(0, Math.min(1, cinza)));
  const s = escala * Math.min(1.1, k);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Boneco tema={tema} pos={[0, 0, 0]} escala={s} cor={c} pose={pose}>
        {children}
      </Boneco>
      {/* disco da cor da pessoa no chão: a cor continua legível de cima */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.min(1, k)}>
        <circleGeometry args={[0.48, 28]} />
        <meshStandardMaterial color={c} roughness={0.9} emissive={c} emissiveIntensity={0.12} />
      </mesh>
      {placa > 0.02 ? (
        <Placa tema={tema} pos={[0, 1.84 * escala + 0.32 + placaY, 0.02]} larg={1.6 * Math.min(1, k)} alt={0.3 * Math.min(1, k)} linhas={[{t: nome, tam: 120, cor: tema.objetoClaro, peso: 800}]} fundo={mistura(tema.objetoEscuro, c, 0.35)} brilho={0.25} />
      ) : null}
    </group>
  );
};

// ---------- Memorial (vítimas): placa com o nome e flores, em tom neutro ----------
const G_PEDRA = geoCaixa(1.3, 0.5, 0.18, 0.04);
export const Memorial: React.FC<{tema: Tema; pos: V3; rotY?: number; nome: string; sub?: string; k: number; vela?: number}> = ({tema, pos, rotY = 0, nome, sub, k, vela = 0}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const pedra = mistura(tema.objetoClaro, tema.objeto, 0.45);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={Math.min(1, k)}>
      <mesh geometry={G_PEDRA} position={[0, 0.32, 0]} rotation={[-0.25, 0, 0]} castShadow>
        <Fosco cor={pedra} />
      </mesh>
      <Placa tema={tema} pos={[0, 0.36, 0.11]} rot={[-0.25, 0, 0]} larg={1.2} alt={0.4} linhas={sub ? [{t: nome, tam: 120, cor: tema.tinta, peso: 800}, {t: sub, tam: 80, cor: tema.tinta, peso: 600}] : [{t: nome, tam: 120, cor: tema.tinta, peso: 800}]} />
      {[-0.45, -0.2, 0.25, 0.5].map((x, i) => (
        <group key={i} position={[x, 0, 0.32 + (i % 2) * 0.08]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.24, 6]} />
            <Fosco cor={mistura(F.verde, tema.objetoEscuro, 0.4)} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <Fosco cor={mistura(F.rosa, tema.objetoClaro, 0.35)} emissivo={0.08} />
          </mesh>
        </group>
      ))}
      {vela > 0.02 ? (
        <group position={[0.72, 0, 0.1]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 14]} />
            <Fosco cor={tema.branco} />
          </mesh>
          {/* luz fixa e suave (sem chama piscando) */}
          <mesh position={[0, 0.24, 0]} scale={vela}>
            <sphereGeometry args={[0.035, 10, 8]} />
            <meshStandardMaterial color={F.dourado} emissive={F.dourado} emissiveIntensity={0.9} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

// ---------- Gravador de mesa (0,5 × 0,12 × 0,3) com a luz de gravação ----------
export const Gravador: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; luz: number}> = ({tema, pos, rotY = 0, escala, luz}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.12, 0.3]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.3, 0.02, 0.18]} raio={0.008} cor={tema.objeto} sombra={false} position={[-0.04, 0.125, 0]} />
      {[-0.12, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.135, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 18]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
      ))}
      <mesh position={[0.19, 0.13, 0.08]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color={mistura(tema.objeto, tema.acento, luz)} emissive={tema.acento} emissiveIntensity={0.9 * luz} />
      </mesh>
    </group>
  );
};

// ---------- Frasco de vacina genérico (0,22 × 0,5) com etiqueta ----------
export const FrascoVacina: React.FC<{tema: Tema; pos: V3; escala: number; gira?: number; rotulo?: string}> = ({tema, pos, escala, gira = 0, rotulo}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, gira, 0]} scale={escala}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.4, 24]} />
        <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.55} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.22, 24]} />
        <Fosco cor={mistura(festa(tema).azul, tema.objetoClaro, 0.5)} emissivo={0.1} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 18]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {rotulo ? <Placa tema={tema} pos={[0, 0.25, 0.115]} larg={0.2} alt={0.08} linhas={[{t: rotulo, tam: 170, cor: tema.tinta, peso: 800}]} fundo={tema.branco} /> : null}
    </group>
  );
};

// ---------- Maquete de praia (1,6 × 1,0): areia, mar e guarda-sóis ----------
export const PraiaMini: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.6, 0.1, 0.6]} raio={0.03} cor={mistura(tema.areia, tema.objeto, 0.2)} position={[0, 0.05, 0.2]} />
      <Caixa args={[1.6, 0.06, 0.4]} raio={0.03} cor={mistura(F.azul, tema.objetoEscuro, 0.35)} position={[0, 0.03, -0.3]} />
      {[
        [-0.5, F.rosa],
        [0.05, F.dourado],
        [0.55, F.turquesa],
      ].map(([x, c]) => (
        <group key={x as number} position={[x as number, 0.1, 0.25]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.4, 6]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <coneGeometry args={[0.2, 0.1, 16]} />
            <Fosco cor={c as string} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- Claquete de filme (0,6 × 0,5), `abre` 0..1 levanta a régua ----------
export const Claquete: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; abre: number; titulo?: string}> = ({tema, pos, rotY = 0, escala, abre, titulo}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.6, 0.42, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.21, 0]} />
      {titulo ? <Placa tema={tema} pos={[0, 0.2, 0.027]} larg={0.52} alt={0.16} linhas={[{t: titulo, tam: 150, cor: tema.objetoClaro, peso: 850}]} /> : null}
      <group position={[-0.3, 0.44, 0]} rotation={[0, 0, 0.6 * abre]}>
        <Caixa args={[0.6, 0.08, 0.05]} raio={0.015} cor={tema.objetoClaro} position={[0.3, 0.04, 0]} />
        {[0.08, 0.24, 0.4, 0.56].map((x) => (
          <Caixa key={x} args={[0.07, 0.081, 0.052]} raio={0.005} cor={tema.objetoEscuro} sombra={false} position={[x, 0.04, 0]} rotation={[0, 0, 0.5]} />
        ))}
      </group>
    </group>
  );
};

// ---------- Caixa de cartuchos (0,5 × 0,3 × 0,35) com etiqueta de lote; `lote` 0..1 apaga a etiqueta ----------
export const CaixaMunicao: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; lote: number}> = ({tema, pos, rotY = 0, escala, lote}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.3, 0.35]} raio={0.03} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[0, 0.15, 0]} />
      <Caixa args={[0.36, 0.12, 0.01]} raio={0.008} cor={mistura(tema.objeto, tema.objetoClaro, lote)} sombra={false} position={[0, 0.16, 0.177]} />
      {lote > 0.05 ? <Placa tema={tema} pos={[0, 0.16, 0.184]} larg={0.34} alt={0.1} linhas={[{t: 'LOTE 0418', tam: 150, cor: mistura(tema.objetoClaro, tema.tinta, lote), peso: 800, mono: true}]} /> : null}
    </group>
  );
};

// ---------- Pedras de minério (terras raras): `k` 0..1 brotam do chão ----------
const PEDRAS: [number, number, number, number][] = [
  [0, 0, 0.32, 0.3],
  [0.45, 0.12, 0.22, 1.1],
  [-0.4, 0.2, 0.25, 2.2],
  [0.15, -0.38, 0.18, 0.7],
  [-0.2, -0.3, 0.15, 1.7],
];
export const Minerio: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos}>
      {PEDRAS.map(([x, z, r, g], i) => {
        const s = Math.max(0, Math.min(1, k * 1.6 - i * 0.12));
        return s < 0.02 ? null : (
          <mesh key={i} position={[x, r * 0.7 * s, z]} rotation={[g, g * 1.3, g * 0.6]} scale={s} castShadow>
            <dodecahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={mistura(F.roxoEscuro, tema.objeto, 0.45)} roughness={0.5} metalness={0.35} emissive={F.roxo} emissiveIntensity={0.08} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

// Marca no chão de um lugar ainda vazio (a silhueta do gancho).
export const LugarVazio: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <mesh position={[pos[0], 0.015, pos[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={k}>
      <ringGeometry args={[0.32, 0.42, 28]} />
      <meshStandardMaterial color={tema.objeto} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
