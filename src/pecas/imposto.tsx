import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Quem paga o imposto: peças da cidade (praça, bairro, ruas) e dos 5 exemplos.

// ---------- Cidade: praça, avenida em anel e avenidas que saem dela ----------
export const R_PRACA = 6.6;
export const R_ANEL = 13.4; // meio da avenida em anel
export const LARG_ANEL = 2.0;

const anel = (r1: number, r2: number) => new THREE.RingGeometry(r1, r2, 120);
const G_PRACA = new THREE.CylinderGeometry(R_PRACA, R_PRACA + 0.15, 0.08, 96);
const G_ANEL = anel(R_ANEL - LARG_ANEL / 2, R_ANEL + LARG_ANEL / 2);
const G_CALCADA_IN = anel(R_ANEL - LARG_ANEL / 2 - 0.9, R_ANEL - LARG_ANEL / 2);
const G_CALCADA_OUT = anel(R_ANEL + LARG_ANEL / 2, R_ANEL + LARG_ANEL / 2 + 0.9);

// `avenidas`: ângulo (rad, a partir de -z, positivo para +x) e até onde vão. `centro` 0..1 acende o círculo sob o VOCÊ.
export const Praca: React.FC<{tema: Tema; avenidas: {ang: number; ate: number}[]; centro?: number}> = ({tema, avenidas, centro = 0}) => {
  const asfalto = mistura(tema.chao, tema.objetoEscuro, 0.45);
  const calcada = mistura(tema.chao, tema.branco, 0.55);
  return (
    <>
      <mesh geometry={G_PRACA} position={[0, 0.04, 0]} receiveShadow>
        <Fosco cor={calcada} />
      </mesh>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R_PRACA - 0.35, R_PRACA - 0.2, 96]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.087, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.86, 64]} />
        <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.acento, centro)} emissive={tema.acento} emissiveIntensity={0.6 * centro} roughness={0.7} />
      </mesh>
      <mesh geometry={G_ANEL} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color={asfalto} roughness={0.9} />
      </mesh>
      {[G_CALCADA_IN, G_CALCADA_OUT].map((g, i) => (
        <mesh key={i} geometry={g} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color={calcada} roughness={0.85} />
        </mesh>
      ))}
      {/* Faixa tracejada no meio do anel */}
      {Array.from({length: 48}).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return (
          <mesh key={`f${i}`} position={[Math.sin(a) * R_ANEL, 0.015, -Math.cos(a) * R_ANEL]} rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.6, 0.06]} />
            <meshBasicMaterial color={tema.corpo} transparent opacity={0.5} />
          </mesh>
        );
      })}
      {/* Avenidas que saem do anel até cada prédio */}
      {avenidas.map((av, i) => {
        const r0 = R_ANEL + LARG_ANEL / 2;
        const L = av.ate - r0;
        const rm = r0 + L / 2;
        return (
          <group key={i} position={[Math.sin(av.ang) * rm, 0.012, -Math.cos(av.ang) * rm]} rotation={[0, -av.ang, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[1.8, L]} />
              <meshStandardMaterial color={asfalto} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// Prédios genéricos em volta (anel de 16 a 34), sem tapar as avenidas nem os prédios que decidem.
type PredioB = {p: V3; w: number; d: number; h: number; rot: number; janelas: number};
export const Bairro: React.FC<{tema: Tema; livres: {p: V3; r: number}[]; angulos: number[]}> = ({tema, livres, angulos}) => {
  const lista = useMemo(() => {
    const out: PredioB[] = [];
    let k = 11;
    const rnd = () => {
      k = (k * 16807) % 2147483647;
      return (k % 10000) / 10000;
    };
    for (let r = 16.5; r < 34; r += 2.6) {
      const n = Math.round((2 * Math.PI * r) / 2.7);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rnd() * 0.08;
        const x = Math.sin(a) * (r + (rnd() - 0.5) * 0.6);
        const z = -Math.cos(a) * (r + (rnd() - 0.5) * 0.6);
        const sorte = rnd();
        if (livres.some((q) => Math.hypot(x - q.p[0], z - q.p[2]) < q.r)) continue;
        if (angulos.some((g) => Math.abs(Math.atan2(Math.sin(a - g), Math.cos(a - g))) * r < 1.9)) continue;
        if (z > 18) continue; // a frente fica aberta para a câmera
        const h = 0.9 + sorte * sorte * (r < 22 ? 3.4 : 6.5);
        out.push({p: [x, 0, z], w: 1.4 + rnd() * 0.8, d: 1.4 + rnd() * 0.8, h, rot: -a, janelas: Math.floor(h / 0.9)});
      }
    }
    return out;
  }, [livres, angulos]);
  return (
    <>
      {lista.map((q, i) => (
        <group key={i} position={q.p} rotation={[0, q.rot, 0]}>
          <Caixa args={[q.w, q.h, q.d]} raio={0.07} cor={i % 4 === 0 ? tema.objetoEscuro : tema.branco} position={[0, q.h / 2, 0]} />
          <Caixa args={[q.w + 0.06, 0.12, q.d + 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, q.h - 0.06, 0]} />
          {Array.from({length: q.janelas}).map((_, j) => (
            <Caixa key={j} args={[q.w * 0.7, 0.16, 0.02]} raio={0.02} cor={tema.objetoEscuro} sombra={false} position={[0, 0.55 + j * 0.9, q.d / 2 + 0.005]} />
          ))}
        </group>
      ))}
    </>
  );
};

export const Arvore: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) => (
  <group position={pos} scale={escala}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.1, 0.9, 10]} />
      <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.55)} />
    </mesh>
    <mesh position={[0, 1.25, 0]} castShadow>
      <sphereGeometry args={[0.55, 20, 16]} />
      <Fosco cor={mistura(tema.corpo, tema.objetoEscuro, 0.3)} />
    </mesh>
    <mesh position={[0.25, 1.05, 0.15]} castShadow>
      <sphereGeometry args={[0.36, 16, 12]} />
      <Fosco cor={mistura(tema.corpo, tema.objetoEscuro, 0.4)} />
    </mesh>
  </group>
);

export const Poste: React.FC<{tema: Tema; pos: V3; luz?: number}> = ({tema, pos, luz = 0.4}) => (
  <group position={pos}>
    <mesh position={[0, 1.2, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.05, 2.4, 8]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 2.45, 0]}>
      <sphereGeometry args={[0.12, 14, 10]} />
      <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={luz} />
    </mesh>
  </group>
);

// ---------- Balcão (frente de cada loja) ----------
export const Balcao: React.FC<{tema: Tema; pos: V3; rotY?: number; larg?: number; escala: number}> = ({tema, pos, rotY = 0, larg = 2.6, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[larg, 0.9, 0.8]} raio={0.05} cor={tema.objeto} position={[0, 0.45, 0]} />
      <Caixa args={[larg + 0.1, 0.07, 0.9]} raio={0.025} cor={tema.objetoEscuro} position={[0, 0.93, 0]} />
    </group>
  );

// ---------- Barra do preço com o imposto dentro ----------
// A barra inteira é o preço. A fatia de cima é o imposto: `abre` 0..1 ela se separa um pouco e acende;
// `fora` 0..1 ela sai para o lado e vira uma barra própria (imposto "por fora").
export const BarraPreco: React.FC<{tema: Tema; pos: V3; rotY?: number; alt: number; fatia?: number; larg?: number; abre: number; fora?: number; lado?: number; escala: number}> = ({
  tema,
  pos,
  rotY = 0,
  alt,
  fatia = 0.18,
  larg = 0.9,
  abre,
  fora = 0,
  lado = 1,
  escala,
}) => {
  if (escala < 0.02) return null;
  const hB = alt * (1 - fatia);
  const hF = alt * fatia;
  const vao = 0.12 * abre * (1 - fora);
  const xF = lado * (larg + 0.35) * fora;
  const yF = hB + vao + (0 - hB - vao) * fora;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[larg, hB, larg]} raio={0.06} cor={tema.objeto} position={[0, hB / 2, 0]} />
      <Caixa args={[larg, hF, larg]} raio={0.05} cor={mistura(tema.objeto, tema.acento, abre)} emissivo={0.35 * abre} position={[xF, yF + hF / 2, 0]} />
    </group>
  );
};

// Seta em laço (o imposto entrando na conta dele mesmo). `k` 0..1 desenha o arco.
export const SetaLaco: React.FC<{tema: Tema; pos: V3; rotY?: number; raio?: number; k: number}> = ({tema, pos, rotY = 0, raio = 0.55, k}) => {
  if (k < 0.02) return null;
  const arco = Math.max(0.05, k * Math.PI * 1.6);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <group rotation={[0, 0, Math.PI * 0.2]}>
        <mesh>
          <torusGeometry args={[raio, 0.045, 10, 48, arco]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[Math.cos(arco) * raio, Math.sin(arco) * raio, 0]} rotation={[0, 0, arco]}>
          <coneGeometry args={[0.11, 0.24, 14]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// Régua vertical com tracinhos; `alt` = altura medida.
export const Regua: React.FC<{tema: Tema; pos: V3; rotY?: number; alt: number; k: number; destaque?: number}> = ({tema, pos, rotY = 0, alt, k, destaque = 0}) => {
  if (k < 0.02 || alt < 0.05) return null;
  const cor = mistura(tema.objetoClaro, tema.acento, destaque);
  // Geometria fixa de 1 unidade, esticada por `scale` (tamanho animado não cria geometria nova a cada quadro).
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, alt * k, 1]}>
      <Caixa args={[0.05, 1, 0.05]} raio={0.02} cor={cor} emissivo={0.3 * destaque} sombra={false} position={[0, 0.5, 0]} />
      {Array.from({length: 9}).map((_, i) => (
        <Caixa key={i} args={[i % 2 === 0 ? 0.22 : 0.13, 0.03, 0.03]} raio={0.01} cor={cor} sombra={false} position={[0.05, i / 8, 0]} scale={[1, 1 / Math.max(0.2, alt * k), 1]} />
      ))}
    </group>
  );
};

// Barra de gráfico com geometria fixa (altura por `scale`).
export const BarraFixa: React.FC<{pos: V3; alt: number; larg?: number; cor: string; emissivo?: number}> = ({pos, alt, larg = 0.5, cor, emissivo = 0}) =>
  alt < 0.03 ? null : (
    <group position={pos} scale={[1, alt, 1]}>
      <Caixa args={[larg, 1, larg]} raio={0.04} cor={cor} emissivo={emissivo} position={[0, 0.5, 0]} />
    </group>
  );

// ---------- Mercado ----------
export const CaixaRegistradora: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; gaveta?: number; tela?: number}> = ({tema, pos, rotY = 0, escala, gaveta = 0, tela = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.7, 0.18, 0.6]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.09, 0]} />
      <Caixa args={[0.6, 0.12, 0.5]} raio={0.03} cor={tema.corpo} position={[0, 0.12, 0.08 + 0.3 * gaveta]} />
      <Caixa args={[0.62, 0.22, 0.42]} raio={0.05} cor={tema.objeto} position={[0, 0.3, -0.05]} rotation={[-0.35, 0, 0]} />
      {Array.from({length: 9}).map((_, i) => (
        <Caixa key={i} args={[0.1, 0.03, 0.08]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[-0.15 + (i % 3) * 0.15, 0.4 + Math.floor(i / 3) * 0.04, 0.02 - Math.floor(i / 3) * 0.08]} rotation={[-0.35, 0, 0]} />
      ))}
      <mesh position={[0, 0.48, -0.25]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.34, 0.2, 0.04]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.objetoClaro, tela)} emissivo={0.4 * tela} position={[0, 0.66, -0.25]} />
    </group>
  );

export const Carrinho: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {[-0.42, 0.42].map((z) => (
        <Caixa key={`l${z}`} args={[0.9, 0.5, 0.03]} raio={0.01} cor={tema.objeto} position={[0, 0.72, z * 0.6]} />
      ))}
      {[-0.45, 0.45].map((x) => (
        <Caixa key={`f${x}`} args={[0.03, 0.5, 0.5]} raio={0.01} cor={tema.objeto} position={[x, 0.72, 0]} />
      ))}
      <Caixa args={[0.9, 0.03, 0.5]} raio={0.01} cor={tema.objeto} position={[0, 0.48, 0]} />
      <mesh position={[-0.55, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.56, 8]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {[-0.35, 0.35].flatMap((x) =>
        [-0.22, 0.22].map((z) => (
          <group key={`${x}${z}`}>
            <mesh position={[x, 0.24, z]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.44, 6]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
            <mesh position={[x, 0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 14]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
          </group>
        )),
      )}
      {/* Compras dentro */}
      <Caixa args={[0.26, 0.3, 0.2]} raio={0.03} cor={tema.objetoClaro} position={[-0.15, 0.65, 0]} />
      <Caixa args={[0.2, 0.22, 0.2]} raio={0.03} cor={tema.areia} position={[0.18, 0.62, 0.05]} />
    </group>
  );

export const Cesta: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.6, 0.04, 0.4]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.02, 0]} />
      {[-1, 1].map((l) => (
        <group key={l}>
          <Caixa args={[0.6, 0.3, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.17, 0.2 * l]} />
          <Caixa args={[0.03, 0.3, 0.4]} raio={0.01} cor={tema.objetoEscuro} position={[0.3 * l, 0.17, 0]} />
        </group>
      ))}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.24, 0.02, 8, 24, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.2, 0.24, 0.16]} raio={0.03} cor={tema.objetoClaro} position={[-0.14, 0.18, 0]} />
      <mesh position={[0.14, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.1, 14, 10]} />
        <Fosco cor={tema.areia} />
      </mesh>
    </group>
  );

// ---------- Blusinha ----------
export const Pacote: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; etiqueta?: number}> = ({tema, pos, rot = [0, 0, 0], escala, etiqueta = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.9, 0.55, 0.65]} raio={0.04} cor={mistura(tema.areia, tema.objetoEscuro, 0.25)} position={[0, 0.275, 0]} />
      <Caixa args={[0.92, 0.02, 0.14]} raio={0.005} cor={mistura(tema.areia, tema.objetoClaro, 0.45)} sombra={false} position={[0, 0.555, 0]} />
      <Caixa args={[0.14, 0.56, 0.67]} raio={0.005} cor={mistura(tema.areia, tema.objetoClaro, 0.45)} sombra={false} position={[0, 0.275, 0]} />
      <Caixa args={[0.34, 0.22, 0.01]} raio={0.01} cor={mistura(tema.objetoClaro, tema.acento, 0.25 * etiqueta)} emissivo={0.2 * etiqueta} sombra={false} position={[0.22, 0.3, 0.33]} />
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[0.24 - i * 0.05, 0.02, 0.01]} raio={0.005} cor={tema.objetoEscuro} sombra={false} position={[0.2, 0.35 - i * 0.05, 0.337]} />
      ))}
    </group>
  );

export const Blusa: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; cor?: string}> = ({tema, pos, rot = [0, 0, 0], escala, cor}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.objetoClaro;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.5, 0.06, 0.6]} raio={0.025} cor={c} position={[0, 0.03, 0]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.26, 0.05, 0.2]} raio={0.02} cor={c} position={[0.3 * l, 0.03, -0.2]} rotation={[0, 0.5 * l, 0]} />
      ))}
      <mesh position={[0, 0.065, -0.29]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.11, 24, 1, 0, Math.PI]} />
        <meshStandardMaterial color={tema.corpo} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Jabuti: casco alto com placas, cabeça e patas. `anda` gira as patas.
export const Jabuti: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; anda?: number; cabeca?: number}> = ({tema, pos, rotY = 0, escala, anda = 0, cabeca = 1}) => {
  if (escala < 0.02) return null;
  const casco = mistura(tema.areia, tema.objetoEscuro, 0.35);
  const pele = mistura(tema.areia, tema.corpo, 0.5);
  const placas: V3[] = [
    [0, 0.42, 0],
    [0.2, 0.36, 0.14],
    [-0.2, 0.36, 0.14],
    [0.2, 0.36, -0.14],
    [-0.2, 0.36, -0.14],
    [0, 0.33, 0.27],
    [0, 0.33, -0.27],
  ];
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.12, 0]} scale={[1, 0.62, 1.15]} castShadow>
        <sphereGeometry args={[0.38, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={casco} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.05, 28]} />
        <Fosco cor={mistura(casco, tema.objetoEscuro, 0.4)} />
      </mesh>
      {placas.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.1, 6, 4]} />
          <Fosco cor={mistura(casco, tema.areia, 0.35)} />
        </mesh>
      ))}
      {/* Cabeça (sai do casco) */}
      <group position={[0, 0.16, 0.38 + 0.1 * cabeca]}>
        <mesh scale={[0.9, 0.8, 1.2]} castShadow>
          <sphereGeometry args={[0.1, 16, 12]} />
          <Fosco cor={pele} />
        </mesh>
      </group>
      {/* Patas */}
      {[
        [0.26, 0.24, 0],
        [-0.26, 0.24, Math.PI],
        [0.26, -0.24, Math.PI],
        [-0.26, -0.24, 0],
      ].map(([x, z, f], i) => (
        <mesh key={i} position={[x, 0.07, z]} rotation={[0.4 * Math.sin(anda * 8 + f), 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.15, 10]} />
          <Fosco cor={pele} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, -0.43]} rotation={[-1.2, 0, 0]}>
        <coneGeometry args={[0.035, 0.12, 8]} />
        <Fosco cor={pele} />
      </mesh>
    </group>
  );
};

// Van de entrega (frente em +x).
export const Van: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.6, 0.95, 0.9]} raio={0.1} cor={tema.objetoClaro} position={[-0.2, 0.72, 0]} />
      <Caixa args={[0.55, 0.6, 0.88]} raio={0.12} cor={tema.objetoClaro} position={[0.82, 0.55, 0]} />
      <Caixa args={[0.02, 0.32, 0.74]} raio={0.04} cor={tema.objetoEscuro} sombra={false} position={[1.1, 0.68, 0]} rotation={[0, 0, -0.35]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.36, 0.28, 0.02]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[0.8, 0.7, 0.45 * l]} />
      ))}
      <Caixa args={[1.0, 0.08, 0.02]} raio={0.02} cor={tema.corpo} sombra={false} position={[-0.25, 0.7, 0.46]} />
      {[-0.65, 0.75].flatMap((x) =>
        [-1, 1].map((l) => (
          <mesh key={`${x}${l}`} position={[x, 0.2, 0.42 * l]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 20]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        )),
      )}
    </group>
  );

// ---------- Lupa ----------
export const Lupa: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh castShadow>
        <torusGeometry args={[0.42, 0.06, 14, 48]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.4, 40]} />
        <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.18} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.78, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.075, 0.62, 14]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 14]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

// ---------- Imposto do pecado ----------
export const MacoCigarro: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.34, 0.48, 0.16]} raio={0.02} cor={tema.objetoClaro} position={[0, 0.24, 0]} />
      <Caixa args={[0.35, 0.12, 0.17]} raio={0.015} cor={tema.corpo} position={[0, 0.42, 0]} />
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={x} position={[x, 0.5 + 0.03 * i, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 12]} />
          <Fosco cor={tema.areia} />
        </mesh>
      ))}
    </group>
  );

export const Garrafa: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) => {
  if (escala < 0.02) return null;
  const vidro = mistura(tema.objetoEscuro, tema.areia, 0.35);
  return (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.52, 24]} />
        <meshStandardMaterial color={vidro} roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.13, 0.14, 24]} />
        <meshStandardMaterial color={vidro} roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.2, 16]} />
        <meshStandardMaterial color={vidro} roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.132, 0.132, 0.2, 24]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );
};

export const Lata: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 28]} />
        <meshStandardMaterial color={tema.objeto} roughness={0.3} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.152, 0.152, 0.16, 28]} />
        <Fosco cor={tema.corpo} />
      </mesh>
      {[0.01, 0.43].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.03, 28]} />
          <meshStandardMaterial color={tema.objetoClaro} roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );

// Fichas de aposta empilhadas e um dado.
export const Fichas: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) => {
  if (escala < 0.02) return null;
  const cores = [tema.objetoClaro, tema.corpo, tema.objeto];
  return (
    <group position={pos} scale={escala}>
      {[
        [-0.12, 0, 5],
        [0.14, 0.08, 3],
        [0, -0.16, 4],
      ].map(([x, z, n], k) =>
        Array.from({length: n}).map((_, i) => (
          <mesh key={`${k}${i}`} position={[x, 0.025 + i * 0.045, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
            <Fosco cor={cores[(i + k) % 3]} />
          </mesh>
        )),
      )}
      <Caixa args={[0.14, 0.14, 0.14]} raio={0.03} cor={tema.objetoClaro} position={[0.2, 0.07, -0.18]} rotation={[0, 0.5, 0]} />
    </group>
  );
};

// ---------- Nota fiscal em pé ----------
// `desenrola` 0..1. `tributos` 0..1 acende a linha "valor aproximado dos tributos".
// `separa` 0..1: o total vira duas faixas, PREÇO (cinza claro) e IMPOSTO (acento), uma embaixo da outra.
export const NotaFiscal: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; desenrola: number; tributos?: number; separa?: number; preco?: number; imposto?: number}> = ({
  tema,
  pos,
  rotY = 0,
  escala,
  desenrola,
  tributos = 0,
  separa = 0,
  preco = 0,
  imposto = 0,
}) => {
  if (escala < 0.02 || desenrola < 0.01) return null;
  const H = 2.0;
  const h = H * desenrola;
  const larg = 1.1;
  const linhas = Array.from({length: 6}, (_, i) => 0.3 + i * 0.16);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[larg + 0.1, 0.12, 0.14]} raio={0.05} cor={tema.objetoEscuro} position={[0, H + 0.06, 0]} />
      <Caixa args={[larg, H, 0.02]} raio={0.008} cor={tema.objetoClaro} position={[0, H - h / 2, 0]} scale={[1, desenrola, 1]} />
      {linhas.map((y, i) =>
        y < h - 0.05 ? <Caixa key={i} args={[i === 0 ? 0.7 : 0.55 + (i % 3) * 0.12, i === 0 ? 0.07 : 0.035, 0.012]} raio={0.006} cor={tema.objetoEscuro} sombra={false} position={[-0.05, H - y, 0.016]} /> : null,
      )}
      {/* Linha dos tributos (Lei 12.741) */}
      {h > 1.35 ? <Caixa args={[0.86, 0.06, 0.012]} raio={0.008} cor={mistura(tema.corpo, tema.acento, tributos)} emissivo={0.5 * tributos} sombra={false} position={[0, H - 1.3, 0.017]} /> : null}
      {/* Total: uma faixa que se divide em duas */}
      {h > 1.85 ? (
        <>
          <Caixa args={[0.92, 0.1, 0.014]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.objeto, separa * (0.4 + 0.6 * preco))} emissivo={0.3 * preco} sombra={false} position={[0, H - 1.62 + 0.08 * separa, 0.018]} />
          {separa > 0.02 ? <Caixa args={[0.92, 0.12, 0.014]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.acento, 0.5 + 0.5 * imposto)} emissivo={0.6 * imposto} sombra={false} position={[0, H - 1.84, 0.018]} scale={[separa, 1, 1]} /> : null}
        </>
      ) : null}
      {/* Serrilhado */}
      {desenrola > 0.97
        ? Array.from({length: 10}).map((_, i) => (
            <mesh key={`s${i}`} position={[-larg / 2 + 0.055 + i * 0.11, -0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.08, 0.08]} />
              <meshStandardMaterial color={tema.objetoClaro} side={THREE.DoubleSide} />
            </mesh>
          ))
        : null}
    </group>
  );
};

// Ponto de exclamação 3D (o medo da "taxa do Pix").
export const Exclama: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.12, 0.4, 0.12]} raio={0.05} cor={tema.objetoClaro} emissivo={0.3} position={[0, 0.32, 0]} />
      <mesh position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.07, 14, 10]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
