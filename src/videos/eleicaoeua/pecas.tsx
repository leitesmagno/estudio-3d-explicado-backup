import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, geoCaixa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 015 (eleição nos EUA × Brasil). Tudo fosco, sem logo, sem bandeira e sem rosto.

// ---------- Plenário em semicírculo com N cadeiras (aqui, as 435 da Câmara dos EUA), aberto para z+ ----------
// Mesmo desenho do PlenarioCamara do 013, com o número de cadeiras livre. `cor(ordem)` pinta cada cadeira
// (ordem da esquerda para a direita).
const fazerCadeiras = (n: number, fileiras: number) => {
  const raios = Array.from({length: fileiras}, (_, f) => 2.3 + f * 0.36);
  const soma = raios.reduce((a, b) => a + b, 0);
  const contas = raios.map((r) => Math.round((n * r) / soma));
  contas[fileiras - 1] += n - contas.reduce((a, b) => a + b, 0);
  const out: {p: V3; ang: number; ordem: number}[] = [];
  raios.forEach((r, f) => {
    for (let j = 0; j < contas[f]; j++) {
      const ang = Math.PI * (0.04 + (0.92 * (j + 0.5)) / contas[f]);
      out.push({p: [-Math.cos(ang) * r, 0.08 + f * 0.07, -Math.sin(ang) * r], ang, ordem: 0});
    }
  });
  const idx = out.map((_, i) => i).sort((a, b) => out[a].ang - out[b].ang || out[a].p[1] - out[b].p[1]);
  idx.forEach((k, o) => (out[k].ordem = o));
  return out;
};
export const N_CAMARA = 435;
const FILEIRAS = 10;
const CADEIRAS = fazerCadeiras(N_CAMARA, FILEIRAS);
const G_ASSENTO = geoCaixa(0.17, 0.12, 0.17, 0.03);
const G_ENCOSTO = geoCaixa(0.17, 0.16, 0.04, 0.015);
const tmp = new THREE.Object3D();
const corTmp = new THREE.Color();
export const PlenarioEua: React.FC<{tema: Tema; pos: V3; escala: number; cor: (ordem: number) => string; sobe?: (ordem: number) => number}> = ({tema, pos, escala, cor: corDe, sobe = () => 0}) => {
  if (escala < 0.02) return null;
  const preparar = (parte: 'assento' | 'encosto') => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CADEIRAS.forEach((c, i) => {
      tmp.position.set(c.p[0], c.p[1] + (parte === 'assento' ? 0.06 : 0.16) + 0.1 * sobe(c.ordem), c.p[2]);
      tmp.rotation.set(0, Math.PI / 2 - c.ang, 0);
      if (parte === 'encosto') tmp.translateZ(-0.075);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      corTmp.set(parte === 'assento' ? corDe(c.ordem) : mistura(tema.objetoEscuro, corDe(c.ordem), 0.55));
      mesh.setColorAt(i, corTmp);
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
      <instancedMesh ref={preparar('assento')} args={[G_ASSENTO, undefined, N_CAMARA]} castShadow>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={preparar('encosto')} args={[G_ENCOSTO, undefined, N_CAMARA]}>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <Caixa args={[2.2, 0.55, 0.6]} raio={0.06} cor={tema.objeto} position={[0, 0.28, 0.9]} />
      <Caixa args={[2.3, 0.08, 0.7]} raio={0.03} cor={tema.objetoClaro} position={[0, 0.58, 0.9]} />
    </group>
  );
};

// ---------- Urna de cédulas de papel: caixa transparente com moldura, fenda em cima e cédulas dentro ----------
export const UrnaPapel: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cheia: number}> = ({tema, pos, rotY = 0, escala, cheia}) => {
  if (escala < 0.02) return null;
  const n = Math.round(14 * cheia);
  const quina = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* pés e base */}
      <Caixa args={[1.0, 0.08, 0.8]} raio={0.03} cor={quina} position={[0, 0.04, 0]} />
      {/* vidro */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.94, 0.84, 0.74]} />
        <Fosco cor={tema.ceuLuz} opacidade={0.22} dupla />
      </mesh>
      {/* quinas */}
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => <Caixa key={`${x}${z}`} args={[0.05, 0.86, 0.05]} raio={0.015} cor={quina} position={[0.47 * x, 0.5, 0.37 * z]} />))}
      {/* tampa com a fenda */}
      <Caixa args={[1.0, 0.07, 0.8]} raio={0.03} cor={quina} position={[0, 0.95, 0]} />
      <Caixa args={[0.5, 0.02, 0.06]} raio={0.008} cor={tema.fundo} sombra={false} position={[0, 0.99, 0]} />
      {/* cédulas lá dentro */}
      {Array.from({length: n}).map((_, i) => (
        <Caixa key={i} args={[0.34, 0.01, 0.24]} raio={0.004} cor={tema.objetoClaro} sombra={false} position={[0.28 * Math.sin(i * 2.3), 0.1 + i * 0.022, 0.2 * Math.cos(i * 1.7)]} rotation={[0.1 * Math.sin(i), i * 0.9, 0.1 * Math.cos(i * 1.3)]} />
      ))}
      {/* faixa da frente */}
      <Caixa args={[0.6, 0.16, 0.02]} raio={0.02} cor={tema.objetoClaro} position={[0, 0.62, 0.38]} />
      <Placa tema={tema} pos={[0, 0.62, 0.395]} larg={0.56} alt={0.13} linhas={[{t: 'CÉDULAS', tam: 190, cor: tema.objetoEscuro, peso: 900}]} brilho={0.2} />
    </group>
  );
};

// ---------- Cédula grande em pé num cavalete, com os cargos em linhas ----------
// `vazia` é a linha que não está nesta eleição (PRESIDENTE): fica cinza e ganha um X (`x` 0..1).
export const CedulaGrande: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; linhas: string[]; vazia?: number; x?: number; marcadas?: number}> = ({tema, pos, rotY = 0, escala, linhas, vazia = -1, x = 0, marcadas = 0}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.branco, 0.3);
  const alt = 0.36 + linhas.length * 0.3;
  const topo = 0.4 + alt;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* cavalete */}
      <Caixa args={[0.06, topo, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[-0.42, topo / 2, -0.12]} />
      <Caixa args={[0.06, topo, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0.42, topo / 2, -0.12]} />
      <Caixa args={[1.1, alt, 0.04]} raio={0.03} cor={papel} position={[0, 0.4 + alt / 2, -0.06]} />
      <Placa tema={tema} pos={[0, topo - 0.15, -0.035]} larg={0.9} alt={0.16} linhas={[{t: 'CÉDULA', tam: 190, cor: tema.objetoEscuro, peso: 900, mono: true}]} brilho={0.2} />
      {linhas.map((l, i) => {
        const y = topo - 0.42 - i * 0.3;
        const ehVazia = i === vazia;
        const marca = !ehVazia && i < marcadas;
        return (
          <group key={l} position={[0, y, -0.03]}>
            <Caixa args={[0.13, 0.13, 0.02]} raio={0.02} cor={ehVazia ? mistura(papel, tema.objeto, 0.4) : marca ? tema.acento : tema.objetoClaro} emissivo={marca ? 0.3 : 0} position={[-0.38, 0, 0.01]} />
            <Caixa args={[0.09, 0.09, 0.02]} raio={0.02} cor={papel} sombra={false} position={[-0.38, 0, 0.012]} scale={marca ? 0.01 : 1} />
            <Placa tema={tema} pos={[0.1, 0, 0.015]} larg={0.72} alt={0.15} linhas={[{t: l, tam: 150, cor: ehVazia ? tema.objeto : tema.objetoEscuro, peso: 900}]} brilho={0.15} />
            {ehVazia && x > 0.02
              ? [0.6, -0.6].map((r) => <Caixa key={r} args={[0.9 * x, 0.03, 0.02]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 0, 0.03]} rotation={[0, 0, r * 0.35]} />)
              : null}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Placar de uma casa: duas colunas (os dois partidos) com o nome da casa na frente ----------
export const PlacarCasa: React.FC<{tema: Tema; pos: V3; escala: number; casa: string; a: number; b: number; corA: string; corB: string}> = ({tema, pos, escala, casa, a, b, corA, corB}) => {
  if (escala < 0.02) return null;
  const altA = Math.max(0.02, a);
  const altB = Math.max(0.02, b);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[1.6, 0.12, 0.9]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.6, altA, 0.6]} raio={0.04} cor={corA} position={[-0.38, 0.12 + altA / 2, 0]} />
      <Caixa args={[0.6, altB, 0.6]} raio={0.04} cor={corB} position={[0.38, 0.12 + altB / 2, 0]} />
      <Caixa args={[1.5, 0.3, 0.04]} raio={0.03} cor={tema.objeto} position={[0, 0.06, 0.48]} />
      <Placa tema={tema} pos={[0, 0.06, 0.505]} larg={1.4} alt={0.24} linhas={[{t: casa, tam: 190, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
    </group>
  );
};

// ---------- Plaquinha de regra num palito (as regras diferentes de cada estado) ----------
export const PlaquinhaRegra: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; texto: string}> = ({tema, pos, rotY = 0, escala, texto}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.04, 0.5, 0.04]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
      <Caixa args={[0.62, 0.3, 0.04]} raio={0.04} cor={tema.objetoClaro} position={[0, 0.6, 0]} />
      <Placa tema={tema} pos={[0, 0.6, 0.025]} larg={0.56} alt={0.22} linhas={[{t: texto, tam: 200, cor: tema.objetoEscuro, peso: 900}]} brilho={0.2} />
    </group>
  );

// ---------- Capitólio (o Congresso dos EUA, desenho simbólico): cúpula branca sobre um tambor de colunas,
// pórtico com frontão no centro, duas alas com colunatas e pavilhões nas pontas, escadaria na frente.
// Frente em z+. Escala 1: cerca de 10 × 5,6 × 3,4. `aceso` 0..1 clareia o prédio e acende as janelas.
const colunas = (n: number, x0: number, x1: number) => Array.from({length: n}, (_, i) => x0 + ((x1 - x0) * i) / Math.max(1, n - 1));
export const Capitolio: React.FC<{tema: Tema; pos: V3; escala?: number; aceso?: number}> = ({tema, pos, escala = 1, aceso = 0}) => {
  if (escala < 0.02) return null;
  const pedra = mistura(mistura(tema.objetoClaro, tema.objeto, 0.35), tema.branco, 0.35 * aceso);
  const claro = mistura(tema.objetoClaro, tema.branco, 0.25 + 0.4 * aceso);
  const sombra = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  const janela = mistura(tema.objetoEscuro, tema.luzCor, 0.55 * aceso);
  const em = 0.12 * aceso;
  const Coluna: React.FC<{x: number; y: number; z: number; alt: number; r?: number}> = ({x, y, z, alt, r = 0.07}) => (
    <mesh position={[x, y + alt / 2, z]} castShadow>
      <cylinderGeometry args={[r, r * 1.1, alt, 12]} />
      <Fosco cor={claro} emissivo={em} />
    </mesh>
  );
  const Frontao: React.FC<{x: number; y: number; z: number; larg: number}> = ({x, y, z, larg}) => (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[larg / 1.73, 0.22, 0.34]} castShadow>
      <cylinderGeometry args={[1, 1, 1, 3]} />
      <Fosco cor={claro} emissivo={em} />
    </mesh>
  );
  return (
    <group position={pos} scale={escala}>
      {/* plataforma e escadaria */}
      <Caixa args={[10.4, 0.45, 3.6]} raio={0.05} cor={sombra} position={[0, 0.225, 0]} />
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[2.8 - i * 0.2, 0.1, 0.32]} raio={0.02} cor={pedra} position={[0, 0.05 + i * 0.1, 2.05 - i * 0.26]} />
      ))}
      {/* corpo central */}
      <Caixa args={[3.2, 1.5, 2.6]} raio={0.05} cor={pedra} emissivo={em} position={[0, 0.45 + 0.75, -0.1]} />
      {/* pórtico central: 8 colunas e frontão */}
      {colunas(8, -1.15, 1.15).map((x) => (
        <Coluna key={`c${x}`} x={x} y={0.45} z={1.35} alt={1.3} />
      ))}
      <Caixa args={[2.6, 0.16, 0.5]} raio={0.03} cor={claro} emissivo={em} position={[0, 1.83, 1.3]} />
      <Frontao x={0} y={2.1} z={1.3} larg={2.6} />
      {/* alas laterais com colunatas e pavilhões nas pontas */}
      {[-1, 1].map((l) => (
        <group key={l}>
          <Caixa args={[2.6, 1.2, 2.0]} raio={0.05} cor={pedra} emissivo={em} position={[l * 2.9, 0.45 + 0.6, -0.2]} />
          <Caixa args={[1.3, 1.4, 2.4]} raio={0.05} cor={pedra} emissivo={em} position={[l * 4.55, 0.45 + 0.7, -0.1]} />
          {colunas(6, 2.0, 3.8).map((x) => (
            <Coluna key={x} x={l * x} y={0.45} z={0.86} alt={1.05} r={0.055} />
          ))}
          <Caixa args={[2.0, 0.1, 0.3]} raio={0.02} cor={claro} position={[l * 2.9, 1.55, 0.85]} />
          {colunas(4, 4.15, 4.95).map((x) => (
            <Coluna key={`p${x}`} x={l * x} y={0.45} z={1.12} alt={1.2} r={0.055} />
          ))}
          <Frontao x={l * 4.55} y={1.82} z={1.12} larg={1.2} />
          {/* janelas da ala */}
          {colunas(5, 2.1, 3.7).map((x) => (
            <Caixa key={`j${x}`} args={[0.16, 0.34, 0.02]} raio={0.01} cor={janela} emissivo={0.5 * aceso} sombra={false} position={[l * x, 1.05, 0.81]} />
          ))}
        </group>
      ))}
      {/* base da cúpula: dois andares de tambor com anel de colunas */}
      <mesh position={[0, 2.05 + 0.25, -0.1]} castShadow>
        <cylinderGeometry args={[1.25, 1.3, 0.5, 40]} />
        <Fosco cor={pedra} emissivo={em} />
      </mesh>
      <mesh position={[0, 2.55 + 0.45, -0.1]} castShadow>
        <cylinderGeometry args={[0.98, 0.98, 0.9, 40]} />
        <Fosco cor={mistura(pedra, sombra, 0.25)} emissivo={em} />
      </mesh>
      {Array.from({length: 20}).map((_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return <Coluna key={`t${i}`} x={Math.sin(a) * 1.1} y={2.55} z={-0.1 + Math.cos(a) * 1.1} alt={0.9} r={0.05} />;
      })}
      <mesh position={[0, 3.5, -0.1]} castShadow>
        <cylinderGeometry args={[1.18, 1.18, 0.1, 40]} />
        <Fosco cor={claro} emissivo={em} />
      </mesh>
      {/* a cúpula */}
      <mesh position={[0, 3.55, -0.1]} scale={[1.0, 1.25, 1.0]} castShadow>
        <sphereGeometry args={[1.0, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={claro} emissivo={0.15 * aceso} />
      </mesh>
      {/* nervuras da cúpula */}
      {Array.from({length: 12}).map((_, i) => (
        <mesh key={`n${i}`} position={[0, 3.55, -0.1]} rotation={[0, (i / 12) * Math.PI * 2, 0]} scale={[1.012, 1.262, 1.012]}>
          <sphereGeometry args={[1.0, 4, 16, -0.012, 0.024, 0, Math.PI / 2]} />
          <Fosco cor={mistura(claro, sombra, 0.25)} />
        </mesh>
      ))}
      {/* lanterna e estátua no topo */}
      <mesh position={[0, 4.95, -0.1]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.4, 16]} />
        <Fosco cor={claro} emissivo={em} />
      </mesh>
      <mesh position={[0, 5.22, -0.1]} castShadow>
        <coneGeometry args={[0.24, 0.18, 16]} />
        <Fosco cor={claro} />
      </mesh>
      <mesh position={[0, 5.45, -0.1]} castShadow>
        <capsuleGeometry args={[0.06, 0.22, 4, 8]} />
        <Fosco cor={mistura(claro, sombra, 0.4)} />
      </mesh>
    </group>
  );
};
