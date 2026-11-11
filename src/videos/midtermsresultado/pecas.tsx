import React from 'react';
import * as THREE from 'three';
import {Caixa, Placa, geoCaixa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 019 (resultado das midterms). Tudo fosco, sem logo, sem bandeira e sem rosto.

// ---------- Plenário do Senado dos EUA: 100 cadeiras em meia-lua, 4 fileiras, aberto para z+ ----------
// `cor(ordem)` pinta cada cadeira (ordem 0 = ponta esquerda, 99 = ponta direita).
// `linhas`: marcas radiais no chão entre duas cadeiras (ex.: maioria de 51, 2/3 = 67), cada uma com `k` 0..1.
export const N_SENADO = 100;
const FILEIRAS_S = 4;
const R0 = 1.5;
const PASSO_R = 0.42;
const angDe = (j: number, n: number) => Math.PI * (0.05 + (0.9 * (j + 0.5)) / n);
const CADEIRAS_S = (() => {
  const raios = Array.from({length: FILEIRAS_S}, (_, f) => R0 + f * PASSO_R);
  const soma = raios.reduce((a, b) => a + b, 0);
  const contas = raios.map((r) => Math.round((N_SENADO * r) / soma));
  contas[FILEIRAS_S - 1] += N_SENADO - contas.reduce((a, b) => a + b, 0);
  const out: {p: V3; ang: number; ordem: number}[] = [];
  raios.forEach((r, f) => {
    for (let j = 0; j < contas[f]; j++) {
      const ang = angDe(j, contas[f]);
      out.push({p: [-Math.cos(ang) * r, 0.1 + f * 0.09, -Math.sin(ang) * r], ang, ordem: 0});
    }
  });
  const idx = out.map((_, i) => i).sort((a, b) => out[a].ang - out[b].ang || out[a].p[1] - out[b].p[1]);
  idx.forEach((k, o) => (out[k].ordem = o));
  return out;
})();
const ANG_ORDEM = (() => {
  const a: number[] = [];
  CADEIRAS_S.forEach((c) => (a[c.ordem] = c.ang));
  return a;
})();
/** Posição (no espaço do plenário, escala 1) de uma cadeira pela ordem: serve para rótulos. */
export const cadeiraSenado = (ordem: number): V3 => CADEIRAS_S.find((c) => c.ordem === ordem)!.p;
const G_ASSENTO_S = geoCaixa(0.2, 0.13, 0.2, 0.035);
const G_ENCOSTO_S = geoCaixa(0.2, 0.2, 0.045, 0.018);
const tmpS = new THREE.Object3D();
const corS = new THREE.Color();

/** Marca radial no chão de um plenário em meia-lua, entre a cadeira `ordem - 1` e a `ordem`. */
export const LinhaPlenario: React.FC<{ang: number; r0: number; r1: number; y: number; k: number; cor: string}> = ({ang, r0, r1, y, k, cor}) => {
  if (k < 0.02) return null;
  const len = (r1 - r0) * k;
  const rm = r0 + len / 2;
  return (
    <group position={[-Math.cos(ang) * rm, y, -Math.sin(ang) * rm]} rotation={[0, Math.PI - ang, 0]}>
      <Caixa args={[len, 0.035, 0.07]} raio={0.015} cor={cor} emissivo={0.5} sombra={false} />
    </group>
  );
};

export const PlenarioSenado: React.FC<{tema: Tema; pos: V3; escala: number; cor: (ordem: number) => string; sobe?: (ordem: number) => number; linhas?: {ordem: number; k: number; cor: string}[]}> = ({tema, pos, escala, cor: corDe, sobe = () => 0, linhas = []}) => {
  if (escala < 0.02) return null;
  const preparar = (parte: 'assento' | 'encosto') => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CADEIRAS_S.forEach((c, i) => {
      tmpS.position.set(c.p[0], c.p[1] + (parte === 'assento' ? 0.07 : 0.19) + 0.12 * sobe(c.ordem), c.p[2]);
      tmpS.rotation.set(0, Math.PI / 2 - c.ang, 0);
      if (parte === 'encosto') tmpS.translateZ(-0.09);
      tmpS.scale.setScalar(1);
      tmpS.updateMatrix();
      mesh.setMatrixAt(i, tmpS.matrix);
      corS.set(parte === 'assento' ? corDe(c.ordem) : mistura(tema.objetoEscuro, corDe(c.ordem), 0.55));
      mesh.setColorAt(i, corS);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: FILEIRAS_S}).map((_, f) => (
        <mesh key={f} position={[0, 0.05 + f * 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[R0 + f * PASSO_R - 0.21, R0 + f * PASSO_R + 0.21, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objeto, 0.18 + f * 0.06)} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <instancedMesh ref={preparar('assento')} args={[G_ASSENTO_S, undefined, N_SENADO]} castShadow>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={preparar('encosto')} args={[G_ENCOSTO_S, undefined, N_SENADO]}>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      {/* mesa da presidência */}
      <Caixa args={[1.5, 0.5, 0.5]} raio={0.06} cor={tema.objeto} position={[0, 0.25, 0.7]} />
      <Caixa args={[1.6, 0.07, 0.6]} raio={0.03} cor={tema.objetoClaro} position={[0, 0.53, 0.7]} />
      {linhas.map((l) => {
        const a = (ANG_ORDEM[l.ordem - 1] + ANG_ORDEM[l.ordem]) / 2;
        return <LinhaPlenario key={l.ordem} ang={a} r0={R0 - 0.35} r1={R0 + (FILEIRAS_S - 1) * PASSO_R + 0.4} y={0.66} k={l.k} cor={l.cor} />;
      })}
    </group>
  );
};

// ---------- Carimbo de mão grande com a face VETO (sem acento: grafite com texto claro) ----------
// Frente em z+; a face com o texto fica de frente para a câmera. Escala 1: cerca de 0,9 de largura.
export const CarimboVeto: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; texto?: number}> = ({tema, pos, rot = [0, 0, 0], escala, texto = 1}) => {
  if (escala < 0.02) return null;
  const madeira = mistura(tema.objeto, tema.areia, 0.35);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* almofada com a borracha */}
      <Caixa args={[0.9, 0.12, 0.5]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.86, 0.3, 0.46]} raio={0.06} cor={madeira} position={[0, 0.27, 0]} />
      {/* placa da frente com VETO */}
      <Caixa args={[0.8, 0.24, 0.03]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.27, 0.235]} />
      {texto > 0.02 ? <Placa tema={tema} pos={[0, 0.27, 0.255]} larg={0.74} alt={0.2} linhas={[{t: 'VETO', tam: 260, cor: mistura(tema.objetoEscuro, tema.objetoClaro, texto), peso: 900}]} brilho={0.35} /> : null}
      {/* cabo */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.34, 18]} />
        <meshStandardMaterial color={madeira} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.15, 22, 16]} />
        <meshStandardMaterial color={madeira} roughness={0.8} />
      </mesh>
    </group>
  );
};

// ---------- Marca VETADO no papel (fica deitada sobre o documento) ----------
export const MarcaVetado: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={[-Math.PI / 2, 0, -0.12]} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={0.95} alt={0.34} linhas={[{t: 'VETADO', tam: 210, cor: tema.objetoEscuro, peso: 900}]} brilho={0.1} />
    </group>
  );
