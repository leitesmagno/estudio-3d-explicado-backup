// Estúdio 3D Explicado · base/cidade
// Uma cidade genérica pronta (quarteirões, ruas, dois bancos e o Banco Central), caminhos curvos
// e trilhas de pontinhos para mostrar dinheiro ou documentos indo de um lugar a outro.
import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import type {Tema} from './tema';
import type {V3} from './pecas/tipos';
import {Caixa, Fosco} from './pecas/caixa';
import {G, geoCaixa} from './pecas/geometria';
import {Onda} from './pecas/efeitos';
import {mistura} from './cores';

// ---------- Caminho curvo ----------
/**
 * Ponto do arco entre a e b (s de 0 a 1), subindo `alto` acima da reta no meio do caminho.
 * Use para moedas voando: pos={curva(DE, ATE, 1.2, k)}.
 */
export const curva = (a: V3, b: V3, alto: number, s: number): V3 => {
  const k = Math.max(0, Math.min(1, s));
  const y = a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k);
  return [a[0] + (b[0] - a[0]) * k, y, a[2] + (b[2] - a[2]) * k];
};

// ---------- Trilha de pontinhos ----------
const dummy = new THREE.Object3D();

/**
 * Trilha de pontinhos ao longo de um caminho f(s), s de 0 a 1 (ex.: f={(s) => curva(A, B, 1, s)}).
 * - prog: 0 a 1, quanto do caminho já apareceu. n: número de pontos (padrão 20). raio: tamanho do ponto.
 * - cor: hex. opacidade: padrão 1. Uma única malha instanciada.
 */
export const Trilha: React.FC<{f: (s: number) => V3; prog: number; cor: string; n?: number; raio?: number; opacidade?: number}> = ({f, prog, cor, n = 20, raio = 0.04, opacidade = 1}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) / n;
      const k = Math.max(0, Math.min(1, (prog - s) * n * 0.7 + 1));
      const p = f(s);
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.setScalar(raio * (prog <= 0 ? 0.0001 : Math.max(0.0001, k)));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  if (prog <= 0) return null;
  return (
    <instancedMesh key={n} ref={ref} args={[G.esferaBaixa, undefined, n]} frustumCulled={false}>
      <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.35} roughness={0.7} transparent={opacidade < 1} opacity={opacidade} />
    </instancedMesh>
  );
};

// ---------- Envelope ----------
/**
 * Envelope fechado com selo no acento. Deitado de frente para z+ (de pé).
 * - rotY: giro no eixo vertical. giro: cambalhota (rad) para quando ele voa ou cai.
 * - rot: rotação completa (substitui rotY). escala: padrão 1 (0,5 × 0,32). brilho: 0 a 1 acende o selo.
 */
export const Envelope: React.FC<{tema: Tema; pos: V3; rotY?: number; giro?: number; rot?: V3; escala?: number; brilho?: number}> = ({tema, pos, rotY = 0, giro = 0, rot, escala = 1, brilho = 0}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.25);
  const aba = mistura(papel, tema.objetoEscuro, 0.12);
  return (
    <group position={pos} rotation={rot ?? [0, rotY, 0]} scale={escala}>
      <group rotation={[giro, 0, giro * 0.35]}>
        <Caixa args={[0.5, 0.32, 0.025]} raio={0.012} cor={papel} />
        {/* aba em V: dois retângulos inclinados */}
        {[1, -1].map((s) => (
          <Caixa key={s} args={[0.3, 0.012, 0.006]} raio={0.003} cor={aba} sombra={false} position={[0.115 * s, 0.07, 0.015]} rotation={[0, 0, -0.56 * s]} />
        ))}
        <mesh position={[0, 0.0, 0.018]} rotation={[Math.PI / 2, 0, 0]} scale={[0.045, 0.01, 0.045]} geometry={G.cilindro}>
          <Fosco cor={tema.acento} emissivo={0.2 + 0.6 * brilho} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Banco (prédio com colunas) ----------
/**
 * Banco: base, colunas, frontão com faixa de destaque. Base no chão, cerca de 2,4 × 1,9 × 1,6.
 * - sobe: 0 a 1 cresce do chão. pulso: 0 a 1 acende a faixa e as colunas no acento.
 */
export const Banco: React.FC<{tema: Tema; pos: V3; rotY?: number; sobe?: number; pulso?: number; cor?: string}> = ({tema, pos, rotY = 0, sobe = 1, pulso = 0, cor}) => {
  if (sobe < 0.02) return null;
  const c = cor ?? mistura(tema.objetoClaro, tema.objeto, 0.25);
  const faixa = mistura(tema.objetoEscuro, tema.acento, Math.max(0.15, pulso));
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, Math.min(1, sobe), 1]}>
      <Caixa args={[2.4, 0.22, 1.6]} raio={0.05} cor={mistura(c, tema.objetoEscuro, 0.15)} position={[0, 0.11, 0]} />
      <Caixa args={[2.0, 1.2, 1.1]} raio={0.06} cor={mistura(c, tema.objetoEscuro, 0.25)} position={[0, 0.82, -0.15]} />
      {[-0.84, -0.42, 0, 0.42, 0.84].map((x) => (
        <mesh key={x} position={[x, 0.82, 0.55]} scale={[0.09, 1.2, 0.09]} geometry={G.cilindro} castShadow receiveShadow>
          <Fosco cor={mistura(c, tema.acento, 0.5 * pulso)} emissivo={0.25 * pulso} />
        </mesh>
      ))}
      <Caixa args={[2.3, 0.18, 1.5]} raio={0.04} cor={c} position={[0, 1.5, 0]} />
      <Caixa args={[1.4, 0.13, 0.04]} raio={0.02} cor={faixa} emissivo={0.15 + 0.6 * pulso} sombra={false} position={[0, 1.5, 0.76]} />
      {/* frontão (prisma triangular) */}
      <group position={[0, 1.74, 0]} scale={[1, 1, 2.8]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, 2.3, 3, 1, false, Math.PI / 2]} />
          <Fosco cor={c} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Cidade ----------
/** Onde fica o "seu banco" na Cidade (no chão). */
export const SEU: V3 = [1.2, 0, 0];
/** Topo do seu banco: ponto de chegada de moedas e trilhas. */
export const TOPO_SEU: V3 = [1.2, 1.9, 0];
/** Outro banco (comparação). */
export const OUTRO: V3 = [-3.4, 0, 0];
/** Banco Central, ao fundo. */
export const BC: V3 = [-1.0, 0, -4.4];

export type PredioCidade = {p: V3; w: number; h: number; d: number};

const acaso = (i: number, s: number) => {
  const x = Math.sin(i * 91.7 + s * 47.3) * 24634.6345;
  return x - Math.floor(x);
};

const PREDIOS: PredioCidade[] = (() => {
  const out: PredioCidade[] = [];
  const livre = (x: number, z: number) => [SEU, OUTRO, BC].every((q) => Math.hypot(x - q[0], z - q[2]) > 2.1) && Math.abs(z - 2.0) > 0.9; // avenida em z = 2
  let i = 0;
  for (let gx = -9; gx <= 9; gx += 2) {
    for (let gz = -9; gz <= 5; gz += 2) {
      i++;
      const x = gx + (acaso(i, 1) - 0.5) * 0.5;
      const z = gz + (acaso(i, 2) - 0.5) * 0.5;
      if (!livre(x, z)) continue;
      const longe = Math.min(1, Math.hypot(x, z) / 10);
      out.push({p: [x, 0, z], w: 1.0 + acaso(i, 3) * 0.5, d: 1.0 + acaso(i, 4) * 0.5, h: 0.8 + acaso(i, 5) * 1.6 + longe * 1.6});
    }
  }
  return out;
})();

/** Lista fixa dos prédios comuns da Cidade ({p, w, h, d}). Use para desenhar só alguns, do seu jeito. */
export const usePredios = (): PredioCidade[] => PREDIOS;

const G_PREDIO = geoCaixa(1, 1, 1, 0.05);

/**
 * Cidade inteira num lugar só: chão de quarteirões, avenida, prédios comuns (instanciados),
 * seu banco (SEU), outro banco (OUTRO) e o Banco Central (BC) ao fundo.
 * - t: tempo (s). sobe: 0 a 1 faz os prédios comuns crescerem (0 = não desenha; desenhe os seus com usePredios()).
 * - bcSobe: 0 a 1 Banco Central. bancosSobem: [seu, outro], cada um 0 a 1.
 * - pulsoSeu: 0 a 1 acende o seu banco e solta uma onda no chão.
 */
export const Cidade: React.FC<{tema: Tema; t: number; sobe?: number; bcSobe?: number; bancosSobem?: [number, number]; pulsoSeu?: number}> = ({tema, t, sobe = 1, bcSobe = 1, bancosSobem = [1, 1], pulsoSeu = 0}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    PREDIOS.forEach((q, i) => {
      const atraso = Math.min(0.5, Math.hypot(q.p[0], q.p[2]) / 24);
      const k = Math.max(0.0001, Math.min(1, (sobe - atraso) / (1 - atraso)));
      const h = q.h * k;
      dummy.position.set(q.p[0], h / 2, q.p[2]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(q.w, Math.max(0.0001, h), q.d);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  const quarteirao = mistura(tema.chao, tema.objeto, 0.12);
  const rua = mistura(tema.chao, tema.objetoEscuro, 0.35);
  return (
    <group>
      <Caixa args={[21, 0.04, 17]} raio={0.02} cor={quarteirao} position={[0, 0.02, -2]} castShadow={false} />
      <Caixa args={[21, 0.05, 1.2]} raio={0.02} cor={rua} sombra={false} position={[0, 0.025, 2]} />
      {Array.from({length: 18}).map((_, i) => (
        <Caixa key={i} args={[0.5, 0.06, 0.07]} raio={0.01} cor={mistura(rua, tema.objetoClaro, 0.35)} sombra={false} position={[-9.6 + i * 1.13, 0.03, 2]} />
      ))}
      {sobe > 0.001 ? (
        <instancedMesh ref={ref} args={[G_PREDIO, undefined, PREDIOS.length]} castShadow receiveShadow frustumCulled={false}>
          <meshStandardMaterial color={mistura(tema.objeto, tema.objetoClaro, 0.2)} roughness={0.85} metalness={0} />
        </instancedMesh>
      ) : null}
      <Banco tema={tema} pos={SEU} sobe={bancosSobem[0]} pulso={pulsoSeu} />
      <Banco tema={tema} pos={OUTRO} sobe={bancosSobem[1]} />
      {bcSobe > 0.02 ? (
        <group position={BC} scale={[1.5, 1.5 * Math.min(1, bcSobe), 1.5]}>
          <Caixa args={[3.2, 2.6, 1.6]} raio={0.08} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} position={[0, 1.3, 0]} />
          {Array.from({length: 6}).map((_, i) => (
            <Caixa key={i} args={[3.24, 0.12, 1.64]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.15)} sombra={false} position={[0, 0.45 + i * 0.36, 0]} />
          ))}
          <Caixa args={[0.9, 0.5, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.25, 0.81]} />
        </group>
      ) : null}
      <Onda pos={[SEU[0], 0.02, SEU[2] + 0.4]} k={pulsoSeu > 0.01 ? (t * 0.9) % 1 : 0} cor={tema.acento} raio={1.8 * Math.min(1, pulsoSeu * 1.5)} />
    </group>
  );
};
