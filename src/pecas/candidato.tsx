import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Candidato sai da disputa: a pista da corrida eleitoral, arcos das linhas, cancela, martelo,
// jatinho, morro, fumaça, rampa da posse, cadeira, faixa, Congresso genérico, bastão, bengala, foto de chegada,
// cadeado, taça e parede de vidro. Formas simples, foscas, arredondadas, sem marca, sem brasão e sem rosto.
// Sem texturas: todo texto fica na interface 2D.

export const RAIAS = [-2.8, -1.4, 0, 1.4, 2.8];
export const PISTA = {x: 3.8, z0: 9, z1: -16};

// ---------- Transparência de um grupo inteiro (boneco que "apaga") ----------
// `op` 0..1. Ajusta os materiais de todas as malhas do grupo a cada quadro.
export const Fantasma: React.FC<{op: number; children: React.ReactNode}> = ({op, children}) => {
  const aplicar = (g: THREE.Group | null) => {
    if (!g) return;
    g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (!m) return;
      m.transparent = op < 0.999;
      m.opacity = op;
      m.depthWrite = op > 0.95;
    });
  };
  if (op < 0.01) return null;
  return <group ref={aplicar}>{children}</group>;
};

// ---------- Pista: 5 raias de 1,4, de z0 (largada) a z1 (chegada) ----------
// `raias`: brilho em acento de cada raia (0..1). `trecho`: faixa de z destacada (entre os turnos). `todas`: tudo acende junto.
export const Pista: React.FC<{tema: Tema; raias?: number[]; trecho?: {z0: number; z1: number; k: number}; todas?: number}> = ({tema, raias = [], trecho, todas = 0}) => {
  const L = PISTA.z0 - PISTA.z1;
  const zc = (PISTA.z0 + PISTA.z1) / 2;
  const piso = mistura(tema.chao, tema.objetoEscuro, 0.55);
  const linha = mistura(tema.objetoEscuro, tema.objetoClaro, 0.55);
  return (
    <group>
      <Caixa args={[PISTA.x * 2 + 0.4, 0.04, L + 0.4]} raio={0.02} cor={mistura(tema.chao, tema.objetoEscuro, 0.25)} sombra={false} position={[0, 0.0, zc]} />
      <Caixa args={[PISTA.x * 2, 0.05, L]} raio={0.02} cor={piso} sombra={false} position={[0, 0.01, zc]} />
      {RAIAS.map((x, i) => {
        const k = Math.max(raias[i] ?? 0, todas);
        return k > 0.01 ? <Caixa key={i} args={[1.3, 0.012, L - 0.1]} raio={0.005} cor={mistura(piso, tema.acento, 0.55 * k)} emissivo={0.35 * k} sombra={false} position={[x, 0.04, zc]} /> : null;
      })}
      {trecho && trecho.k > 0.01 ? (
        <Caixa args={[PISTA.x * 2 - 0.05, 0.014, Math.abs(trecho.z0 - trecho.z1)]} raio={0.005} cor={mistura(piso, tema.acento, 0.45 * trecho.k)} emissivo={0.3 * trecho.k} sombra={false} position={[0, 0.045, (trecho.z0 + trecho.z1) / 2]} />
      ) : null}
      {[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map((x) => (
        <Caixa key={x} args={[0.05, 0.02, L]} raio={0.008} cor={linha} sombra={false} position={[x, 0.05, zc]} />
      ))}
    </group>
  );
};

// ---------- Arco de linha (largada, 1º turno, 2º turno, chegada) ----------
// Linha no chão atravessando a pista + dois postes + faixa no alto. `sobe` 0..1 cresce do chão. `aceso` 0..1: faixa em acento.
export const ArcoLinha: React.FC<{tema: Tema; z: number; sobe: number; aceso?: number; xadrez?: boolean; semArco?: boolean}> = ({tema, z, sobe, aceso = 0, xadrez, semArco}) => {
  if (sobe < 0.01) return null;
  const alt = 3.3 * sobe;
  const faixa = mistura(tema.objetoEscuro, tema.acento, aceso);
  return (
    <group position={[0, 0, z]}>
      {xadrez ? (
        Array.from({length: 20}).map((_, i) => (
          <Caixa key={i} args={[0.38, 0.015, 0.19]} raio={0.004} cor={(i + Math.floor(i / 20)) % 2 ? tema.objetoEscuro : tema.objetoClaro} sombra={false} position={[-3.61 + i * 0.38, 0.06, 0]} />
        ))
      ) : (
        <Caixa args={[PISTA.x * 2, 0.016, 0.16]} raio={0.005} cor={mistura(tema.objetoClaro, tema.acento, aceso * 0.7)} emissivo={0.15 + 0.35 * aceso} sombra={false} position={[0, 0.06, 0]} />
      )}
      {semArco ? null : (
        <>
          {[-1, 1].map((l) => (
            <Caixa key={l} args={[0.2, alt, 0.2]} raio={0.06} cor={tema.objeto} position={[(PISTA.x + 0.35) * l, alt / 2, 0]} />
          ))}
          <Caixa args={[PISTA.x * 2 + 0.9, 0.62 * sobe, 0.14]} raio={0.06} cor={faixa} emissivo={0.35 * aceso} position={[0, alt - 0.25, 0]} />
          {xadrez
            ? Array.from({length: 16}).map((_, i) => (
                <Caixa key={i} args={[0.42, 0.26 * sobe, 0.02]} raio={0.01} cor={(i + (i > 7 ? 1 : 0)) % 2 ? tema.objetoEscuro : tema.objetoClaro} sombra={false} position={[-3.36 + (i % 8) * 0.96 + (i > 7 ? 0.48 : 0), alt - 0.25 + (i > 7 ? -0.14 : 0.14) * sobe, 0.08]} />
              ))
            : null}
        </>
      )}
    </group>
  );
};

// ---------- Cancela (barreira listrada) ----------
// Braço gira do vertical (0) até atravessar a raia (1).
export const Cancela: React.FC<{tema: Tema; pos: V3; escala: number; desce: number; lado?: 1 | -1}> = ({tema, pos, escala, desce, lado = 1}) => {
  if (escala < 0.02) return null;
  const ang = (Math.PI / 2) * (1 - desce) * lado;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.3, 1.1, 0.3]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.55, 0]} />
      <Caixa args={[0.4, 0.12, 0.4]} raio={0.04} cor={tema.objeto} position={[0, 0.06, 0]} />
      <group position={[0, 1.0, 0.18]} rotation={[0, 0, ang]}>
        {Array.from({length: 6}).map((_, i) => (
          <Caixa key={i} args={[0.26, 0.12, 0.08]} raio={0.03} cor={i % 2 ? tema.objetoClaro : tema.acento} emissivo={i % 2 ? 0 : 0.25} position={[lado * (0.2 + i * 0.25), 0, 0]} />
        ))}
      </group>
    </group>
  );
};

// ---------- Martelo da Justiça sobre o bloco ----------
// `bate` 0..1: o martelo desce do alto até encostar no bloco.
export const Martelo: React.FC<{tema: Tema; pos: V3; escala: number; bate: number; rotY?: number}> = ({tema, pos, escala, bate, rotY = 0}) => {
  if (escala < 0.02) return null;
  const ang = -1.0 * (1 - bate);
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.45);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.12, 32]} />
        <Fosco cor={madeira} />
      </mesh>
      <group position={[0.75, 0.32, 0]} rotation={[0, 0, -ang]}>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.9, 14]} />
          <Fosco cor={madeira} />
        </mesh>
        <mesh position={[-0.92, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.42, 24]} />
          <Fosco cor={madeira} />
        </mesh>
        {[-0.22, 0.22].map((z) => (
          <mesh key={z} position={[-0.92, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------- Jatinho (avião pequeno, nariz em +x local) ----------
export const Jatinho: React.FC<{tema: Tema; pos: V3; rumo?: number; pique?: number; escala?: number}> = ({tema, pos, rumo = 0, pique = 0, escala = 1}) => {
  const casco = tema.objeto;
  const escuro = tema.objetoEscuro;
  return (
    <group position={pos} rotation={[0, rumo, 0]} scale={escala}>
      <group rotation={[0.12 * pique, 0, -pique]}>
        {/* Fuselagem e nariz */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.28, 2.2, 10, 24]} />
          <Fosco cor={casco} />
        </mesh>
        {/* Para-brisa */}
        <Caixa args={[0.3, 0.12, 0.42]} raio={0.05} cor={escuro} sombra={false} position={[1.15, 0.16, 0]} rotation={[0, 0, -0.5]} />
        {/* Janelas */}
        {[-1, 1].flatMap((l) =>
          Array.from({length: 5}).map((_, i) => (
            <Caixa key={`${l}${i}`} args={[0.12, 0.1, 0.02]} raio={0.03} cor={escuro} sombra={false} position={[0.65 - i * 0.3, 0.08, 0.275 * l]} />
          )),
        )}
        {/* Asas baixas */}
        <Caixa args={[0.7, 0.06, 3.2]} raio={0.03} cor={casco} position={[0.05, -0.16, 0]} />
        {[-1, 1].map((l) => (
          <Caixa key={l} args={[0.22, 0.24, 0.04]} raio={0.02} cor={casco} position={[-0.15, -0.02, 1.6 * l]} />
        ))}
        {/* Motores na cauda */}
        {[-1, 1].map((l) => (
          <group key={l} position={[-0.95, 0.18, 0.4 * l]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.55, 20]} />
              <Fosco cor={casco} />
            </mesh>
            <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
              <Fosco cor={escuro} />
            </mesh>
          </group>
        ))}
        {/* Cauda em T */}
        <Caixa args={[0.5, 0.7, 0.05]} raio={0.02} cor={casco} position={[-1.3, 0.55, 0]} rotation={[0, 0, -0.35]} />
        <Caixa args={[0.34, 0.05, 1.2]} raio={0.02} cor={casco} position={[-1.45, 0.88, 0]} />
      </group>
    </group>
  );
};

// ---------- Morro (colina baixa que esconde a queda) ----------
export const Morro: React.FC<{tema: Tema; pos: V3; raios: V3}> = ({tema, pos, raios}) => (
  <mesh position={pos} scale={raios} receiveShadow castShadow>
    <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
    <Fosco cor={mistura(tema.chao, tema.objetoEscuro, 0.55)} />
  </mesh>
);

// ---------- Fumaça (bolinhas cinzas translúcidas) ----------
const G_BOLA = new THREE.SphereGeometry(1, 16, 12);
export const Fumaca: React.FC<{tema: Tema; bolas: {p: V3; r: number; o: number}[]}> = ({tema, bolas}) => (
  <>
    {bolas.map((b, i) =>
      b.o < 0.01 || b.r < 0.01 ? null : (
        <mesh key={i} geometry={G_BOLA} position={b.p} scale={b.r}>
          <meshStandardMaterial color={mistura(tema.corpo, tema.fundo, 0.25)} roughness={1} transparent opacity={b.o} depthWrite={false} />
        </mesh>
      ),
    )}
  </>
);

// ---------- Rampa da posse ----------
// Sobe de z = zPe (y 0) até z = zPe - comp (y alt), plataforma no topo com colunas lisas ao fundo.
export const RAMPA = {zPe: -16, comp: 4, alt: 1.6, larg: 5.6, fundo: 3.6};
export const yRampa = (z: number) => (z >= RAMPA.zPe ? 0 : z <= RAMPA.zPe - RAMPA.comp ? RAMPA.alt : (RAMPA.alt * (RAMPA.zPe - z)) / RAMPA.comp);
export const Rampa: React.FC<{tema: Tema; sobe: number; aceso?: number}> = ({tema, sobe, aceso = 0}) => {
  if (sobe < 0.01) return null;
  const {zPe, comp, alt, larg, fundo} = RAMPA;
  const ang = Math.atan2(alt, comp);
  const L = Math.hypot(alt, comp);
  const zTopo = zPe - comp;
  const borda = mistura(tema.objetoEscuro, tema.acento, aceso);
  return (
    <group position={[0, -2.2 * (1 - sobe), 0]}>
      {/* Rampa inclinada */}
      <group position={[0, alt / 2 - 0.06, zPe - comp / 2]} rotation={[ang, 0, 0]}>
        <Caixa args={[larg, 0.16, L + 0.08]} raio={0.04} cor={tema.objeto} />
        {[-1, 1].map((l) => (
          <Caixa key={l} args={[0.12, 0.1, L]} raio={0.03} cor={borda} emissivo={0.35 * aceso} position={[(larg / 2 - 0.06) * l, 0.1, 0]} />
        ))}
      </group>
      {/* Corrimãos inclinados */}
      {[-1, 1].map((l) => (
        <group key={l} position={[(larg / 2 - 0.1) * l, alt / 2 + 0.9, zPe - comp / 2]} rotation={[ang, 0, 0]}>
          <Caixa args={[0.07, 0.07, L]} raio={0.03} cor={tema.objetoClaro} />
        </group>
      ))}
      {[-1, 1].flatMap((l) =>
        [0, 0.5, 1].map((f) => (
          <Caixa key={`${l}${f}`} args={[0.06, 0.9, 0.06]} raio={0.02} cor={tema.objetoClaro} position={[(larg / 2 - 0.1) * l, alt * f + 0.45, zPe - comp * f]} />
        )),
      )}
      {/* Plataforma */}
      <Caixa args={[larg + 2.4, alt, fundo]} raio={0.05} cor={mistura(tema.objetoEscuro, tema.objeto, 0.45)} position={[0, alt / 2, zTopo - fundo / 2]} />
      <Caixa args={[larg + 2.5, 0.05, 0.1]} raio={0.02} cor={borda} emissivo={0.35 * aceso} position={[0, alt + 0.02, zTopo + 0.02]} />
      {/* Colunas lisas e marquise ao fundo (genérico) */}
      {Array.from({length: 7}).map((_, i) => (
        <mesh key={i} position={[-3.6 + i * 1.2, alt + 1.2, zTopo - fundo + 0.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.11, 2.4, 18]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Cadeira (encosto alto, braços), virada para z+ ----------
export const Cadeira: React.FC<{tema: Tema; pos: V3; escala: number; aceso?: number}> = ({tema, pos, escala, aceso = 0}) => {
  if (escala < 0.02) return null;
  const madeira = mistura(tema.objetoEscuro, tema.areia, 0.25);
  const estofado = mistura(tema.corpo, tema.acento, aceso * 0.6);
  return (
    <group position={pos} scale={escala}>
      {[-0.32, 0.32].flatMap((x) =>
        [-0.28, 0.28].map((z) => <Caixa key={`${x}${z}`} args={[0.08, 0.5, 0.08]} raio={0.03} cor={madeira} position={[x, 0.25, z]} />),
      )}
      <Caixa args={[0.8, 0.12, 0.72]} raio={0.05} cor={madeira} position={[0, 0.54, 0]} />
      <Caixa args={[0.66, 0.1, 0.6]} raio={0.05} cor={estofado} emissivo={0.25 * aceso} position={[0, 0.64, 0.02]} />
      <Caixa args={[0.8, 1.2, 0.12]} raio={0.06} cor={madeira} position={[0, 1.15, -0.32]} />
      <Caixa args={[0.62, 0.95, 0.06]} raio={0.05} cor={estofado} emissivo={0.25 * aceso} position={[0, 1.12, -0.25]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.1, 0.1, 0.66]} raio={0.04} cor={madeira} position={[0.4 * l, 0.86, 0]} />
      ))}
    </group>
  );
};

// ---------- Faixa da posse (marsala, sem brasão) ----------
// Para usar como filho do Boneco (`pos` relativo ao boneco). `k` 0..1 aparece; `desce` 0..1 cai do alto até o peito.
export const FaixaPosse: React.FC<{tema: Tema; k: number; desce?: number; pos?: V3}> = ({tema, k, desce = 1, pos = [0, 0, 0]}) =>
  k < 0.02 ? null : (
    <group position={[pos[0], pos[1] + 1.2 * (1 - desce), pos[2]]} scale={k}>
      <Caixa args={[0.14, 0.82, 0.03]} raio={0.012} cor={tema.acento} emissivo={0.3} position={[0, 1.3, 0.2]} rotation={[0.12, 0, 0.62]} />
      <Caixa args={[0.14, 0.82, 0.03]} raio={0.012} cor={tema.acento} emissivo={0.3} position={[0, 1.3, -0.19]} rotation={[-0.12, 0, -0.62]} />
    </group>
  );
// Faixa dobrada, pousada (sobre a cadeira).
export const FaixaDobrada: React.FC<{tema: Tema; pos: V3; k: number; brilho?: number}> = ({tema, pos, k, brilho = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Caixa args={[0.5, 0.05, 0.16]} raio={0.02} cor={tema.acento} emissivo={0.25 + 0.4 * brilho} />
      <Caixa args={[0.16, 0.05, 0.42]} raio={0.02} cor={tema.acento} emissivo={0.25 + 0.4 * brilho} position={[0.12, 0.04, 0.06]} rotation={[0, 0.5, 0]} />
    </group>
  );

// ---------- Congresso (silhueta genérica: base, cúpula, cuia e duas torres) ----------
export const Congresso: React.FC<{tema: Tema; pos: V3; escala?: number; aceso?: number}> = ({tema, pos, escala = 1, aceso = 0}) => {
  const cor = mistura(tema.objeto, tema.objetoClaro, aceso * 0.6);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[14, 1.0, 5]} raio={0.08} cor={cor} emissivo={0.1 * aceso} position={[0, 0.5, 0]} />
      {/* Cúpula (para baixo) à esquerda e cuia (para cima) à direita */}
      <mesh position={[-3.6, 1.0, 0.3]} scale={[1.9, 1.1, 1.9]} castShadow>
        <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.1 * aceso} />
      </mesh>
      <mesh position={[3.6, 2.2, 0.3]} scale={[2.6, 1.2, 2.6]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.1 * aceso} />
      </mesh>
      <mesh position={[3.6, 1.6, 0.3]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 1.2, 24]} />
        <Fosco cor={cor} />
      </mesh>
      {/* Duas torres com passarela */}
      {[-0.75, 0.75].map((x) => (
        <Caixa key={x} args={[1.1, 11, 1.6]} raio={0.06} cor={cor} emissivo={0.1 * aceso} position={[x, 5.5, -1.4]} />
      ))}
      <Caixa args={[0.5, 1.1, 1.2]} raio={0.04} cor={cor} position={[0, 7.5, -1.4]} />
      {Array.from({length: 12}).map((_, i) => (
        <Caixa key={i} args={[2.62, 0.05, 1.64]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 1.6 + i * 0.8, -1.4]} />
      ))}
    </group>
  );
};

// ---------- Bastão do revezamento ----------
export const Bastao: React.FC<{tema: Tema; pos: V3; rot?: V3; k: number; brilho?: number}> = ({tema, pos, rot = [0, 0, 0], k, brilho = 1}) =>
  k < 0.02 ? null : (
    <mesh position={pos} rotation={rot} scale={k} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.46, 16]} />
      <Fosco cor={mistura(tema.objeto, tema.acento, brilho)} emissivo={0.35 * brilho} />
    </mesh>
  );

// ---------- Bengala (filho do boneco) ----------
export const Bengala: React.FC<{tema: Tema; k: number}> = ({tema, k}) =>
  k < 0.02 ? null : (
    <group position={[0.42, 0, 0.12]} scale={k}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 10]} />
        <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} />
      </mesh>
      <mesh position={[-0.08, 0.9, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
        <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} />
      </mesh>
    </group>
  );

// ---------- Moldura da foto de chegada (em pé, virada para z+) ----------
export const FotoChegada: React.FC<{tema: Tema; pos: V3; k: number; aceso?: number}> = ({tema, pos, k, aceso = 0}) => {
  if (k < 0.02) return null;
  const cor = mistura(tema.objetoClaro, tema.acento, aceso);
  const w = 3.0;
  const h = 2.4;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[w, 0.08, 0.06]} raio={0.02} cor={cor} emissivo={0.3 * aceso} sombra={false} position={[0, h, 0]} />
      <Caixa args={[w, 0.08, 0.06]} raio={0.02} cor={cor} emissivo={0.3 * aceso} sombra={false} position={[0, 0.06, 0]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.08, h, 0.06]} raio={0.02} cor={cor} emissivo={0.3 * aceso} sombra={false} position={[(w / 2) * l, h / 2, 0]} />
      ))}
    </group>
  );
};

// ---------- Cadeado (em cima da urna) ----------
export const Cadeado: React.FC<{tema: Tema; pos: V3; k: number; fecha: number}> = ({tema, pos, k, fecha}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Caixa args={[0.5, 0.42, 0.2]} raio={0.06} cor={mistura(tema.objetoEscuro, tema.acento, fecha)} emissivo={0.3 * fecha} position={[0, 0.21, 0]} />
      <mesh position={[0, 0.42 + 0.18 * (1 - fecha), 0]}>
        <torusGeometry args={[0.16, 0.04, 10, 24, Math.PI]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );

// ---------- Taça de réveillon ----------
export const Taca: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.42, 10]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.13, 0.06, 0.46, 24, 1, true]} />
        <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.55} roughness={0.2} side={2} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.11, 0.06, 0.3, 24]} />
        <Fosco cor={tema.areia} emissivo={0.15} />
      </mesh>
    </group>
  );

// ---------- Parede de vidro (barra quem vem de fora da pista) ----------
export const Parede: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; k: number; rotY?: number}> = ({tema, pos, larg, alt, k, rotY = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh position={[0, (alt * k) / 2, 0]}>
        <planeGeometry args={[larg, alt * k]} />
        <meshStandardMaterial color={tema.acento} transparent opacity={0.16 * k} roughness={0.2} side={2} depthWrite={false} emissive={tema.acento} emissiveIntensity={0.2} />
      </mesh>
      <Caixa args={[larg, 0.05, 0.05]} raio={0.02} cor={tema.acento} emissivo={0.5} sombra={false} position={[0, alt * k, 0]} />
    </group>
  );

// ---------- Ficha (cartãozinho em pé sobre a cabeça; o texto fica na interface) ----------
export const Ficha: React.FC<{tema: Tema; pos: V3; k: number; destaque?: number}> = ({tema, pos, k, destaque = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Caixa args={[0.62, 0.38, 0.03]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, destaque)} emissivo={0.25 * destaque} />
    </group>
  );
