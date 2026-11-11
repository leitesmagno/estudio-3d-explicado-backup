import React from 'react';
import * as THREE from 'three';
import {Caixa, Placa, geoCaixa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 013 (voto distrital misto). Tudo fosco, sem logo e sem rosto; texto fixo por peça.

// ---------- Plenário da Câmara em miniatura: 513 cadeiras em semicírculo, aberto para z+ ----------
// `cor(i)` dá a cor de cada cadeira (i em ordem da esquerda para a direita, fileira por fileira) e
// `sobe(i)` 0..1 levanta a cadeira um pouco (a que acabou de ganhar dono).
export const N_CADEIRAS = 513;
const FILEIRAS = 11;
export const CADEIRAS_CAMARA: {p: V3; ang: number; ordem: number}[] = (() => {
  const raios = Array.from({length: FILEIRAS}, (_, f) => 2.3 + f * 0.36);
  const soma = raios.reduce((a, b) => a + b, 0);
  const contas = raios.map((r) => Math.round((N_CADEIRAS * r) / soma));
  contas[FILEIRAS - 1] += N_CADEIRAS - contas.reduce((a, b) => a + b, 0);
  const out: {p: V3; ang: number; ordem: number}[] = [];
  raios.forEach((r, f) => {
    const n = contas[f];
    for (let j = 0; j < n; j++) {
      const ang = Math.PI * (0.04 + (0.92 * (j + 0.5)) / n);
      out.push({p: [-Math.cos(ang) * r, 0.08 + f * 0.07, -Math.sin(ang) * r], ang, ordem: 0});
    }
  });
  // ordem da onda: da esquerda para a direita (pelo ângulo), fileira de dentro para fora
  const idx = out.map((_, i) => i).sort((a, b) => out[a].ang - out[b].ang || out[a].p[1] - out[b].p[1]);
  idx.forEach((k, o) => (out[k].ordem = o));
  return out;
})();
const G_ASSENTO = geoCaixa(0.17, 0.12, 0.17, 0.03);
const G_ENCOSTO = geoCaixa(0.17, 0.16, 0.04, 0.015);
const tmp = new THREE.Object3D();
const cor = new THREE.Color();
export const PlenarioCamara: React.FC<{tema: Tema; pos: V3; escala: number; cor: (ordem: number) => string; sobe?: (ordem: number) => number}> = ({tema, pos, escala, cor: corDe, sobe = () => 0}) => {
  if (escala < 0.02) return null;
  const preparar = (parte: 'assento' | 'encosto') => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CADEIRAS_CAMARA.forEach((c, i) => {
      const s = sobe(c.ordem);
      tmp.position.set(c.p[0], c.p[1] + (parte === 'assento' ? 0.06 : 0.16) + 0.08 * s, c.p[2]);
      tmp.rotation.set(0, Math.PI / 2 - c.ang, 0);
      if (parte === 'encosto') tmp.translateZ(-0.075);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      cor.set(parte === 'assento' ? corDe(c.ordem) : mistura(tema.objetoEscuro, corDe(c.ordem), 0.55));
      mesh.setColorAt(i, cor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: FILEIRAS}).map((_, f) => (
        <mesh key={f} position={[0, 0.04 + f * 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[2.3 + f * 0.36 - 0.18, 2.3 + f * 0.36 + 0.18, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objeto, 0.15 + f * 0.04)} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <instancedMesh ref={preparar('assento')} args={[G_ASSENTO, undefined, N_CADEIRAS]} castShadow>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={preparar('encosto')} args={[G_ENCOSTO, undefined, N_CADEIRAS]}>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      {/* Mesa diretora */}
      <Caixa args={[2.2, 0.55, 0.6]} raio={0.06} cor={tema.objeto} position={[0, 0.28, 0.9]} />
      <Caixa args={[2.3, 0.08, 0.7]} raio={0.03} cor={tema.objetoClaro} position={[0, 0.58, 0.9]} />
    </group>
  );
};

// ---------- Pilha de votos: cédulas empilhadas (1 bloco = 20 mil votos no exemplo) ----------
export const PilhaVotos: React.FC<{tema: Tema; pos: V3; blocos: number; cor?: string; brilho?: number; escala?: number}> = ({tema, pos, blocos, cor: c, brilho = 0, escala = 1}) => {
  if (blocos <= 0.01 || escala < 0.02) return null;
  const n = Math.ceil(blocos);
  const corB = c ?? tema.objetoClaro;
  return (
    <group position={pos} scale={escala}>
      {Array.from({length: n}).map((_, i) => {
        const k = Math.min(1, blocos - i);
        return (
          <group key={i} position={[0.02 * Math.sin(i * 2.1), 0.09 + i * 0.13, 0.02 * Math.cos(i * 1.7)]} rotation={[0, 0.12 * Math.sin(i * 1.3), 0]} scale={[1, k, 1]}>
            <Caixa args={[0.62, 0.11, 0.42]} raio={0.02} cor={corB} emissivo={0.2 * brilho} />
            <Caixa args={[0.64, 0.025, 0.1]} raio={0.008} cor={mistura(tema.objetoEscuro, corB, 0.3)} sombra={false} position={[0, 0, 0]} />
          </group>
        );
      })}
    </group>
  );
};

// ---------- Corda esticada entre dois pontos (o puxador levando os colegas) ----------
export const Corda: React.FC<{tema: Tema; de: V3; ate: V3; k: number; cor?: string}> = ({tema, de, ate, k, cor: c}) => {
  if (k < 0.02) return null;
  const fim: V3 = [de[0] + (ate[0] - de[0]) * k, de[1] + (ate[1] - de[1]) * k, de[2] + (ate[2] - de[2]) * k];
  const meio: V3 = [(de[0] + fim[0]) / 2, (de[1] + fim[1]) / 2, (de[2] + fim[2]) / 2];
  const dx = fim[0] - de[0];
  const dy = fim[1] - de[1];
  const dz = fim[2] - de[2];
  const comp = Math.max(0.01, Math.hypot(dx, dy, dz));
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  return (
    <mesh position={meio} quaternion={q} castShadow>
      <cylinderGeometry args={[0.025, 0.025, comp, 8]} />
      <meshStandardMaterial color={c ?? mistura(tema.areia, tema.objetoEscuro, 0.2)} roughness={0.9} />
    </mesh>
  );
};

// ---------- Plaquinha de preço espetada (o "preço da cadeira") ----------
export const PlacaPreco: React.FC<{tema: Tema; pos: V3; escala: number; texto: string; aceso?: number}> = ({tema, pos, escala, texto, aceso = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.04, 0.5, 0.04]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
      <Caixa args={[0.9, 0.34, 0.04]} raio={0.04} cor={mistura(tema.objetoClaro, tema.acento, 0.8 * aceso)} emissivo={0.25 * aceso} position={[0, 0.62, 0]} />
      <Placa tema={tema} pos={[0, 0.62, 0.025]} larg={0.82} alt={0.26} linhas={[{t: texto, tam: 150, cor: tema.objetoEscuro, peso: 900}]} brilho={0.2} />
    </group>
  );
