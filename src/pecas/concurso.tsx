import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Escola particular e concurso: cidade à noite em cinza,
// escola particular com torre e relógio, escola pública pequena, caminho em Y até os portões
// EMPREGO PRIVADO (torre de vidro) e CONCURSO PÚBLICO (prédio de colunas), e a multidão em instancedMesh.

const tmp = new THREE.Object3D();
const cor = new THREE.Color();
const M = new THREE.Matrix4();
const M2 = new THREE.Matrix4();

// Cinzas do mundo (todos tirados do tema)
export const cinzas = (tema: Tema) => ({
  parede: mistura(tema.objetoEscuro, tema.objeto, 0.42),
  paredeEscura: mistura(tema.objetoEscuro, tema.objeto, 0.18),
  telhado: mistura(tema.objetoEscuro, tema.fundo, 0.35),
  janela: mistura(tema.objetoClaro, tema.areia, 0.18),
  vao: mistura(tema.fundo, tema.objetoEscuro, 0.3),
  caminho: mistura(tema.chao, tema.objetoEscuro, 0.62),
  praca: mistura(tema.chao, tema.objetoEscuro, 0.5),
  copa: mistura(tema.fundo, tema.objetoEscuro, 0.62),
  predioFundo: mistura(tema.fundo, tema.objetoEscuro, 0.45),
  placaTexto: tema.objetoClaro,
  placaFundo: tema.branco,
});

// ---------- Piso plano (praça e caminho em Y), sempre acima do chão do Palco ----------
const formaPiso = (pts: [number, number][]) => {
  const s = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? s.moveTo(x, -z) : s.lineTo(x, -z)));
  s.closePath();
  return new THREE.ShapeGeometry(s, 12);
};
// Praça em leque: da porta da escola particular (z 6) até longe (z 26)
export const PRACA: [number, number][] = [
  [-4.6, 5.6],
  [-0.4, 5.6],
  [7.5, 26],
  [-13.5, 26],
];
// Caminho até a escola pública
export const CAMINHO_PUB: [number, number][] = [
  [6.0, 6.2],
  [7.6, 6.2],
  [10.5, 26],
  [7.0, 26],
];
// Caminho em Y atrás da escola: haste dos fundos (z 1) até a bifurcação (z -11), braços até os portões (z -22)
export const GARFO: V3 = [0, 0, -11];
export const PORTAO_PRIV: V3 = [-8, 0, -22];
export const PORTAO_PUB: V3 = [8, 0, -22];
export const CAMINHO_Y: [number, number][] = [
  [-4.6, 1.6],
  [-0.4, 1.6],
  [2.0, -9.4],
  [9.9, -21.6],
  [9.9, -23.2],
  [6.1, -23.2],
  [0, -14.2],
  [-6.1, -23.2],
  [-9.9, -23.2],
  [-9.9, -21.6],
  [-2.0, -9.4],
];
export const Piso: React.FC<{pts: [number, number][]; y: number; cor: string}> = ({pts, y, cor: c}) => {
  const geo = useMemo(() => formaPiso(pts), [pts]);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <meshStandardMaterial color={c} roughness={0.95} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
    </mesh>
  );
};

// ---------- Escola particular: 2 andares, torre central com relógio ----------
// Frente para +z. `horas`: posição dos ponteiros (1 = uma volta do ponteiro dos minutos). `porta` 0..1 abre.
export const ESCOLA = {x: -2.5, z: 4, larg: 9, alt: 3.6, prof: 4};
export const EscolaTorre: React.FC<{tema: Tema; pos: V3; horas: number; porta: number; luz: number; placa: number}> = ({tema, pos, horas, porta, luz, placa}) => {
  const C = cinzas(tema);
  const {larg: L, alt: A, prof: P} = ESCOLA;
  const janelas: [number, number][] = [];
  for (const y of [1.05, 2.55]) for (const x of [-3.6, -2.5, -1.4, 1.4, 2.5, 3.6]) janelas.push([x, y]);
  const corJanela = mistura(C.janela, tema.objetoClaro, 0.4 * luz);
  return (
    <group position={pos}>
      <Caixa args={[L, A, P]} raio={0.08} cor={C.parede} position={[0, A / 2, 0]} />
      <Caixa args={[L + 0.3, 0.22, P + 0.3]} raio={0.05} cor={C.telhado} position={[0, A + 0.11, 0]} />
      <Caixa args={[L + 0.1, 0.12, 0.12]} raio={0.03} cor={C.paredeEscura} position={[0, 1.85, P / 2 + 0.03]} />
      {/* Janelas da frente e de trás */}
      {janelas.map(([x, y], i) => (
        <React.Fragment key={i}>
          <Caixa args={[0.62, 0.86, 0.06]} raio={0.02} cor={corJanela} emissivo={0.25 + 0.35 * luz} sombra={false} position={[x, y, P / 2 + 0.02]} />
          <Caixa args={[0.62, 0.86, 0.06]} raio={0.02} cor={corJanela} emissivo={0.2} sombra={false} position={[x, y, -P / 2 - 0.02]} />
        </React.Fragment>
      ))}
      {/* Entrada: vão escuro, duas folhas que abrem para dentro */}
      <Caixa args={[1.9, 1.75, 0.1]} raio={0.03} cor={C.vao} sombra={false} position={[0, 0.88, P / 2 + 0.02]} />
      {[-1, 1].map((l) => (
        <group key={l} position={[0.92 * l, 0, P / 2 + 0.06]} rotation={[0, l * 1.35 * porta, 0]}>
          <Caixa args={[0.88, 1.7, 0.06]} raio={0.02} cor={C.paredeEscura} position={[-0.45 * l, 0.86, 0]} />
        </group>
      ))}
      <Caixa args={[2.3, 0.14, 0.7]} raio={0.03} cor={C.telhado} position={[0, 1.86, P / 2 + 0.3]} />
      {/* Porta dos fundos (por onde a multidão sai adulta) */}
      <Caixa args={[1.9, 1.75, 0.1]} raio={0.03} cor={C.vao} sombra={false} position={[0, 0.88, -P / 2 - 0.02]} />
      {/* Placa da fachada */}
      <group position={[0, 2.25, P / 2 + 0.12]}>
        <Placa tema={tema} pos={[0, 0.35, 0]} larg={5.4} alt={0.78} linhas={[{t: 'ESCOLA PARTICULAR', tam: 92, cor: C.placaTexto, peso: 800}]} fundo={C.placaFundo} />
        {/* Fita de luz embaixo da placa (o destaque muda o material, nunca a textura) */}
        <Caixa args={[5.0, 0.05, 0.08]} raio={0.02} cor={mistura(C.paredeEscura, tema.objetoClaro, placa)} emissivo={0.7 * placa} sombra={false} position={[0, -0.12, 0.12]} />
      </group>
      {/* Torre com relógio */}
      <group position={[0, A + 0.22, P / 2 - 1.2]}>
        <Caixa args={[2.2, 2.0, 2.2]} raio={0.06} cor={C.parede} position={[0, 1.0, 0]} />
        <Caixa args={[2.5, 0.16, 2.5]} raio={0.04} cor={C.telhado} position={[0, 2.08, 0]} />
        <mesh position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.75, 1.2, 4]} />
          <Fosco cor={C.telhado} />
        </mesh>
        {/* Mostrador */}
        <mesh position={[0, 1.05, 1.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.06, 40]} />
          <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.18 + 0.25 * luz} roughness={0.6} />
        </mesh>
        <group position={[0, 1.05, 1.17]}>
          <mesh>
            <torusGeometry args={[0.66, 0.05, 8, 40]} />
            <Fosco cor={C.paredeEscura} />
          </mesh>
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <Caixa key={i} args={[0.035, 0.1, 0.02]} raio={0.008} cor={tema.fundo} sombra={false} position={[Math.sin(a) * 0.52, Math.cos(a) * 0.52, 0.02]} rotation={[0, 0, -a]} />;
          })}
          {/* Ponteiros: horas (curto) e minutos (longo) */}
          <group rotation={[0, 0, -(horas / 12) * Math.PI * 2 - 1.1]}>
            <Caixa args={[0.06, 0.32, 0.025]} raio={0.01} cor={tema.fundo} sombra={false} position={[0, 0.14, 0.04]} />
          </group>
          <group rotation={[0, 0, -horas * Math.PI * 2]}>
            <Caixa args={[0.04, 0.48, 0.025]} raio={0.01} cor={tema.fundo} sombra={false} position={[0, 0.22, 0.06]} />
          </group>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
            <Fosco cor={tema.fundo} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ---------- Escola pública: um andar, porta pequena, placa num poste ----------
export const ESCOLA_PUB = {x: 6.8, z: 4.2};
export const EscolaSimples: React.FC<{tema: Tema; pos: V3; luz: number}> = ({tema, pos, luz}) => {
  const C = cinzas(tema);
  return (
    <group position={pos}>
      <Caixa args={[4.6, 2.0, 3.0]} raio={0.06} cor={C.paredeEscura} position={[0, 1.0, 0]} />
      <Caixa args={[4.85, 0.16, 3.25]} raio={0.04} cor={C.telhado} position={[0, 2.08, 0]} />
      {[-1.6, -0.8, 0.9, 1.7].map((x) => (
        <Caixa key={x} args={[0.5, 0.6, 0.05]} raio={0.02} cor={mistura(C.janela, tema.fundo, 0.25)} emissivo={0.12 + 0.2 * luz} sombra={false} position={[x, 1.15, 1.52]} />
      ))}
      <Caixa args={[0.7, 1.3, 0.06]} raio={0.02} cor={C.vao} sombra={false} position={[0.05, 0.65, 1.52]} />
      {/* Placa no poste, ao lado do caminho */}
      <group position={[2.9, 0, 2.2]}>
        <Caixa args={[0.12, 2.6, 0.12]} raio={0.04} cor={C.paredeEscura} position={[0, 1.3, 0]} />
        <Placa tema={tema} pos={[0, 2.75, 0.08]} larg={3.4} alt={0.62} linhas={[{t: 'ESCOLA PÚBLICA', tam: 98, cor: C.placaTexto, peso: 800}]} fundo={C.placaFundo} />
      </group>
    </group>
  );
};

// ---------- Torre de escritórios de vidro (EMPREGO PRIVADO) ----------
// `onda` 0..1 acende as janelas andar por andar, de baixo para cima.
const ANDARES = 14;
const COLS = 6;
const G_JANELA = new THREE.BoxGeometry(0.5, 0.42, 0.05);
export const TorreVidro: React.FC<{tema: Tema; pos: V3; onda: number}> = ({tema, pos, onda}) => {
  const C = cinzas(tema);
  const L = 5;
  const A = 17;
  const P = 4;
  const lit = (a: number, c: number) => ((a * 7 + c * 13) % 5 < 2 ? 1 : 0.15);
  const n = ANDARES * COLS * 2;
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    let i = 0;
    for (const face of [0, 1])
      for (let a = 0; a < ANDARES; a++)
        for (let c = 0; c < COLS; c++) {
          const y = 1.4 + a * 1.1;
          if (face === 0) {
            tmp.position.set(-L / 2 + 0.55 + c * 0.78, y, P / 2 + 0.03);
            tmp.rotation.set(0, 0, 0);
          } else {
            tmp.position.set(L / 2 + 0.03, y, P / 2 - 0.5 - c * 0.6);
            tmp.rotation.set(0, Math.PI / 2, 0);
          }
          tmp.scale.setScalar(1);
          tmp.updateMatrix();
          mesh.setMatrixAt(i, tmp.matrix);
          const aceso = Math.max(lit(a, c + face * 3), onda * (onda * ANDARES > a ? 1 : 0));
          cor.set(mistura(C.vao, C.janela, aceso));
          mesh.setColorAt(i, cor);
          i++;
        }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <group position={pos}>
      <Caixa args={[L, A, P]} raio={0.1} cor={mistura(C.paredeEscura, tema.ceuLuz, 0.12)} position={[0, A / 2, 0]} />
      <Caixa args={[L + 0.2, 0.3, P + 0.2]} raio={0.06} cor={C.telhado} position={[0, A + 0.15, 0]} />
      {Array.from({length: ANDARES + 1}).map((_, a) => (
        <Caixa key={a} args={[L + 0.06, 0.06, P + 0.06]} raio={0.02} cor={C.telhado} sombra={false} position={[0, 0.85 + a * 1.1, 0]} />
      ))}
      <instancedMesh key={n} ref={preparar} args={[G_JANELA, undefined, n]}>
        <meshStandardMaterial roughness={0.4} emissive={tema.objetoClaro} emissiveIntensity={0.12} />
      </instancedMesh>
    </group>
  );
};

// ---------- Pórtico: dois pilares e a placa em cima (estilo das fotos) ----------
export const Portico: React.FC<{tema: Tema; pos: V3; texto: string; luz: number; rotY?: number}> = ({tema, pos, texto, luz, rotY = 0}) => {
  const C = cinzas(tema);
  const tam = Math.min(96, Math.floor(980 / (texto.length * 0.62)));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {[-1, 1].map((l) => (
        <React.Fragment key={l}>
          <Caixa args={[0.5, 3.2, 0.5]} raio={0.06} cor={mistura(C.parede, tema.objetoClaro, 0.25 * luz)} emissivo={0.1 * luz} position={[1.75 * l, 1.6, 0]} />
          <Caixa args={[0.7, 0.18, 0.7]} raio={0.04} cor={C.telhado} position={[1.75 * l, 0.09, 0]} />
        </React.Fragment>
      ))}
      <Caixa args={[4.3, 0.2, 0.55]} raio={0.04} cor={C.telhado} position={[0, 3.25, 0]} />
      <Placa tema={tema} pos={[0, 3.85, 0.05]} larg={4.6} alt={0.82} linhas={[{t: texto, tam, cor: C.placaTexto, peso: 800}]} fundo={C.placaFundo} />
      {/* Fita de luz embaixo da placa */}
      <Caixa args={[4.1, 0.05, 0.08]} raio={0.02} cor={mistura(C.paredeEscura, tema.objetoClaro, luz)} emissivo={0.6 * luz} sombra={false} position={[0, 3.39, 0.3]} />
      {luz > 0.02 ? <pointLight position={[0, 2.6, 1.6]} color={tema.objetoClaro} intensity={6 * luz} distance={7} decay={2} /> : null}
    </group>
  );
};

// ---------- Cidade à noite: silhueta de prédios com janelinhas ----------
const G_JANELINHA = new THREE.BoxGeometry(0.34, 0.42, 0.04);
type PredioFundo = {x: number; z: number; l: number; a: number};
export const CIDADE_FUNDO: PredioFundo[] = (() => {
  const out: PredioFundo[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let x = -34; x <= 34; x += 3.6 + rnd() * 1.6) out.push({x, z: -46 - rnd() * 6, l: 2.6 + rnd() * 2.4, a: 5 + rnd() * 13});
  return out;
})();
export const CidadeNoite: React.FC<{tema: Tema; luz: number}> = ({tema, luz}) => {
  const C = cinzas(tema);
  const janelas = useMemo(() => {
    const out: V3[] = [];
    let s = 11;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    CIDADE_FUNDO.forEach((p) => {
      for (let y = 1.2; y < p.a - 0.6; y += 1.0)
        for (let x = -p.l / 2 + 0.45; x < p.l / 2 - 0.3; x += 0.62) if (rnd() < 0.28) out.push([p.x + x, y, p.z + 1.27]);
    });
    return out;
  }, []);
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    janelas.forEach((p, i) => {
      tmp.position.set(...p);
      tmp.rotation.set(0, 0, 0);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return (
    <>
      {CIDADE_FUNDO.map((p, i) => (
        <Caixa key={i} args={[p.l, p.a, 2.5]} raio={0.08} cor={C.predioFundo} sombra={false} position={[p.x, p.a / 2, p.z]} />
      ))}
      <instancedMesh key={janelas.length} ref={preparar} args={[G_JANELINHA, undefined, janelas.length]}>
        <meshStandardMaterial color={mistura(C.janela, tema.fundo, 0.35)} emissive={C.janela} emissiveIntensity={0.18 + 0.2 * luz} roughness={0.6} />
      </instancedMesh>
    </>
  );
};

// ---------- Árvore de copa redonda e escura ----------
export const ArvoreRedonda: React.FC<{tema: Tema; pos: V3; r?: number; cresce?: number}> = ({tema, pos, r = 1.1, cresce = 1}) => {
  const C = cinzas(tema);
  return (
    <group position={pos} scale={cresce}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 1.4, 10]} />
        <Fosco cor={C.paredeEscura} />
      </mesh>
      <mesh position={[0, 1.2 + r * 0.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[r, 22, 18]} />
        <Fosco cor={C.copa} />
      </mesh>
    </group>
  );
};

// ---------- Multidão: bonecos simples em instancedMesh (corpo, cabeça, braços, pernas, mochila) ----------
// Altura ~1 com escala 1. Cada agente traz posição, rumo (rotY), escala, fase do passo e se anda.
export type Agente = {x: number; z: number; rot: number; s: number; fase: number; anda: number};
const G_TRONCO = new THREE.CapsuleGeometry(0.11, 0.24, 4, 10);
const G_CABECA = new THREE.SphereGeometry(0.1, 14, 12);
const G_PERNA = new THREE.CapsuleGeometry(0.052, 0.3, 4, 8);
const G_BRACO = new THREE.CapsuleGeometry(0.038, 0.26, 4, 8);
const G_MOCHILA = new THREE.BoxGeometry(0.17, 0.2, 0.09);
type Parte = 'tronco' | 'cabeca' | 'pernaE' | 'pernaD' | 'bracoE' | 'bracoD' | 'mochila';
const PARTES: {p: Parte; g: THREE.BufferGeometry}[] = [
  {p: 'tronco', g: G_TRONCO},
  {p: 'cabeca', g: G_CABECA},
  {p: 'pernaE', g: G_PERNA},
  {p: 'pernaD', g: G_PERNA},
  {p: 'bracoE', g: G_BRACO},
  {p: 'bracoD', g: G_BRACO},
  {p: 'mochila', g: G_MOCHILA},
];
const matrizParte = (a: Agente, parte: Parte, out: THREE.Matrix4) => {
  const s = Math.max(0.0001, a.s);
  const balanco = Math.sin(a.fase) * a.anda;
  const pulo = Math.abs(Math.cos(a.fase)) * 0.025 * a.anda;
  out.compose(new THREE.Vector3(a.x, pulo * s, a.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, a.rot, 0)), new THREE.Vector3(s, s, s));
  const local = (px: number, py: number, pz: number, rx: number, dy: number) => {
    M2.makeTranslation(px, py, pz);
    out.multiply(M2);
    M2.makeRotationX(rx);
    out.multiply(M2);
    M2.makeTranslation(0, dy, 0);
    out.multiply(M2);
  };
  if (parte === 'tronco') local(0, 0.66, 0, 0, 0);
  else if (parte === 'cabeca') local(0, 0.96, 0, 0, 0);
  else if (parte === 'pernaE') local(-0.065, 0.47, 0, 0.5 * balanco, -0.2);
  else if (parte === 'pernaD') local(0.065, 0.47, 0, -0.5 * balanco, -0.2);
  else if (parte === 'bracoE') local(-0.15, 0.8, 0, -0.45 * balanco, -0.17);
  else if (parte === 'bracoD') local(0.15, 0.8, 0, 0.45 * balanco, -0.17);
  else local(0, 0.68, -0.13, 0, 0);
};
export const Multidao: React.FC<{tema: Tema; agentes: Agente[]; corCorpo?: string; corMochila?: string; mochila?: boolean}> = ({tema, agentes, corCorpo, corMochila, mochila = true}) => {
  const n = agentes.length;
  const preparar = (parte: Parte) => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    agentes.forEach((a, i) => {
      matrizParte(a, parte, M);
      mesh.setMatrixAt(i, M);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  };
  if (n === 0) return null;
  return (
    <>
      {PARTES.filter((x) => mochila || x.p !== 'mochila').map(({p, g}) => (
        <instancedMesh key={`${p}${n}`} ref={preparar(p)} args={[g, undefined, n]} castShadow receiveShadow frustumCulled={false}>
          <meshStandardMaterial color={p === 'mochila' ? corMochila ?? tema.corpo : corCorpo ?? tema.objetoClaro} roughness={0.75} />
        </instancedMesh>
      ))}
    </>
  );
};

// ---------- Estrela (a ambição) ----------
const G_ESTRELA = (() => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.5 : 0.21;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3});
  g.center();
  return g;
})();
export const Estrela: React.FC<{tema: Tema; pos: V3; escala: number; giro?: number; brilho?: number}> = ({tema, pos, escala, giro = 0, brilho = 0.4}) =>
  escala < 0.02 ? null : (
    <mesh geometry={G_ESTRELA} position={pos} rotation={[0, giro, 0]} scale={escala} castShadow>
      <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={brilho} roughness={0.45} />
    </mesh>
  );

// ---------- Setas circulares (a troca) ----------
export const SetasTroca: React.FC<{tema: Tema; pos: V3; escala: number; giro: number}> = ({tema, pos, escala, giro}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, 0, giro]} scale={escala}>
      {[0, Math.PI].map((a) => (
        <group key={a} rotation={[0, 0, a]}>
          <mesh>
            <torusGeometry args={[0.6, 0.06, 8, 28, Math.PI * 0.75]} />
            <Fosco cor={tema.objetoClaro} emissivo={0.2} />
          </mesh>
          <mesh position={[Math.cos(Math.PI * 0.75) * 0.6, Math.sin(Math.PI * 0.75) * 0.6, 0]} rotation={[0, 0, Math.PI * 0.75 + Math.PI]}>
            <coneGeometry args={[0.14, 0.28, 12]} />
            <Fosco cor={tema.objetoClaro} emissivo={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );

// ---------- Cartão em pé (casos da Constituição, blocos dos anos) ----------
export const Cartao: React.FC<{tema: Tema; pos: V3; rotY?: number; k: number; larg: number; alt: number; linhas: {t: string; tam: number; cor?: string}[]; destaque?: number}> = ({tema, pos, rotY = 0, k, larg, alt, linhas, destaque = 0}) => {
  if (k < 0.02) return null;
  const C = cinzas(tema);
  return (
    <group position={[pos[0], pos[1] - (1 - Math.min(1, k)) * 0.6, pos[2]]} rotation={[0, rotY, 0]} scale={[1, Math.max(0.02, k), 1]}>
      <Caixa args={[larg + 0.12, 0.12, 0.4]} raio={0.04} cor={mistura(C.telhado, tema.objetoClaro, destaque)} emissivo={0.5 * destaque} position={[0, 0.06, 0]} />
      <Placa tema={tema} pos={[0, 0.12 + alt / 2, 0]} larg={larg} alt={alt} linhas={linhas.map((l) => ({t: l.t, tam: l.tam, cor: l.cor ?? C.placaTexto, peso: 800}))} fundo={C.placaFundo} />
    </group>
  );
};
