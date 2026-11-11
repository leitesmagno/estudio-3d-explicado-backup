import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {Boneco, Caixa, Fosco, Placa, useDescartar, type Pose, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura, MoedaCor} from './bets';
import {festa} from './mansao';

// Peças do estádio de futebol: o estádio genérico (sem escudo nem marca), o telão da dívida,
// o letreiro do nome, o trilho do dinheiro, a torneira dos juros, o guindaste, a torcida e o bairro.
// O estádio é feito de 24 gomos (fatias) que sobem do chão, afundam e abrem a frente para a câmera entrar.

const tmp = new THREE.Object3D();
const cor = new THREE.Color();

// ---------- Medidas do estádio (em volta da origem; o eixo comprido é x) ----------
export const OVAL = 0.72; // achatamento em z (oval de 27,4 × 19,7)
export const R_IN = 9.2; // começo da arquibancada
export const R_TOP = 13.2; // fim do último degrau
export const R_WALL = 13.7; // fachada
export const Y0 = 0.3;
export const DEGRAUS = 12;
export const Y_TOP = 5.4;
export const Y_WALL = 6.2;
export const GOMOS = 24;
const DG = (Math.PI * 2) / GOMOS;
export const CAMPO = {x: 6.6, z: 4.3}; // meio comprimento e meia largura do campo
export const Y_GRAMA = 0.06;
// Fachada da frente (z+) e o telão no alto da arquibancada do fundo
export const Z_FACHADA = R_WALL * OVAL;
export const TELAO: V3 = [0, 8.7, -9.0];
export const LETREIRO: V3 = [0, 4.6, Z_FACHADA + 0.25];
const rDeg = (j: number) => R_IN + (j * (R_TOP - R_IN)) / DEGRAUS;
const yDeg = (j: number) => Y0 + (j * (Y_TOP - Y0)) / DEGRAUS;
// Ponto do degrau j (0 = mais baixo), no ângulo phi (0 = frente, +z), já no oval do mundo
export const naArquibancada = (j: number, phi: number, frente = 0.14): V3 => {
  const r = rDeg(j) + frente;
  return [r * Math.sin(phi), yDeg(j + 1), r * Math.cos(phi) * OVAL];
};
// Gomos da frente: os que abrem para a câmera entrar
const centroGomo = (i: number) => {
  const a = (i + 0.5) * DG;
  return a > Math.PI ? a - Math.PI * 2 : a;
};
const FRENTE = (i: number) => Math.abs(centroGomo(i)) < Math.PI / 3;

// ---------- Geometrias dos gomos (feitas uma vez) ----------
const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const PERFIL_ARQ = (() => {
  const p = [v2(R_IN, 0)];
  for (let j = 0; j < DEGRAUS; j++) {
    p.push(v2(rDeg(j), yDeg(j + 1)));
    p.push(v2(rDeg(j + 1), yDeg(j + 1)));
  }
  p.push(v2(R_WALL - 0.3, Y_TOP));
  p.push(v2(R_WALL - 0.3, 0));
  return p;
})();
const PERFIL_PAREDE = [v2(R_WALL, 0), v2(R_WALL, Y_WALL), v2(R_WALL - 0.55, Y_WALL), v2(R_WALL - 0.55, Y_TOP)];
const PERFIL_FAIXA = [v2(R_WALL, 2.85), v2(R_WALL + 0.45, 2.85), v2(R_WALL + 0.45, 3.15), v2(R_WALL, 3.15)];
const PERFIL_TETO = [v2(10.4, 7.35), v2(14.5, 6.75), v2(14.5, 6.5), v2(10.4, 7.1), v2(10.4, 7.35)];
const PERFIL_FITA = [v2(10.36, 7.08), v2(10.36, 7.37)];
const PERFIL_FUNDACAO = [v2(R_IN - 0.2, 0.05), v2(R_WALL + 0.2, 0.05)];
const lathe = (perfil: THREE.Vector2[], i: number, seg = 4) => new THREE.LatheGeometry(perfil, seg, i * DG, DG);
const GEO = Array.from({length: GOMOS}).map((_, i) => ({
  arq: lathe(PERFIL_ARQ, i),
  parede: lathe(PERFIL_PAREDE, i),
  faixa: lathe(PERFIL_FAIXA, i),
  teto: lathe(PERFIL_TETO, i),
  fita: lathe(PERFIL_FITA, i),
  fundacao: lathe(PERFIL_FUNDACAO, i),
}));
// Cadeira: assento + encosto (o encosto fica do lado de fora do anel)
const G_CADEIRA = mergeGeometries([new THREE.BoxGeometry(0.24, 0.07, 0.18).translate(0, 0.08, 0.02), new THREE.BoxGeometry(0.24, 0.2, 0.04).translate(0, 0.17, -0.08)])!;
const G_BRISE = new THREE.BoxGeometry(0.16, 5.5, 0.32);
const G_PILAR = new THREE.CylinderGeometry(0.16, 0.2, 6.75, 12);
// Matrizes das cadeiras e brises de cada gomo (no espaço do anel, antes do achatamento)
const MAT_CADEIRAS = Array.from({length: GOMOS}).map((_, i) => {
  const out: THREE.Matrix4[] = [];
  for (let j = 0; j < DEGRAUS; j++) {
    const r = rDeg(j) + 0.14;
    const n = Math.max(3, Math.floor((r * DG) / 0.34));
    for (let k = 0; k < n; k++) {
      const phi = i * DG + ((k + 0.5) * DG) / n;
      tmp.position.set(r * Math.sin(phi), yDeg(j + 1), r * Math.cos(phi));
      tmp.rotation.set(0, phi + Math.PI, 0);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      out.push(tmp.matrix.clone());
    }
  }
  return out;
});
const MAT_BRISES = Array.from({length: GOMOS}).map((_, i) =>
  [0, 1, 2, 3].map((k) => {
    const phi = i * DG + ((k + 0.5) * DG) / 4;
    tmp.position.set((R_WALL + 0.1) * Math.sin(phi), 3.0, (R_WALL + 0.1) * Math.cos(phi));
    tmp.rotation.set(0, phi, 0);
    tmp.scale.setScalar(1);
    tmp.updateMatrix();
    return tmp.matrix.clone();
  }),
);

// Malha instanciada com material próprio (descartado quando sai de cena)
const useInstancias = (geo: THREE.BufferGeometry, mats: THREE.Matrix4[], c: string, emissivo = 0) => {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({color: c, roughness: 0.75, envMapIntensity: 0.5, emissive: c, emissiveIntensity: emissivo}), mats.length);
    mats.forEach((x, k) => m.setMatrixAt(k, x));
    m.castShadow = true;
    m.receiveShadow = true;
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [geo, mats, c, emissivo]);
  useEffect(() => () => (mesh.material as THREE.Material).dispose(), [mesh]);
  return mesh;
};

const Gomo: React.FC<{tema: Tema; i: number; dy: number; teto: number; luz: number; cores: ReturnType<typeof coresEstadio>}> = ({i, dy, teto, luz, cores: C}) => {
  const cadeiras = useInstancias(G_CADEIRA, MAT_CADEIRAS[i], i % 2 === 0 ? C.cadeira : C.cadeira2);
  const brises = useInstancias(G_BRISE, MAT_BRISES[i], C.brise);
  const g = GEO[i];
  const phi = i * DG;
  return (
    <group position={[0, dy, 0]}>
      <mesh geometry={g.arq} castShadow receiveShadow>
        <meshStandardMaterial color={C.degrau} roughness={0.85} envMapIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <primitive object={cadeiras} />
      <mesh geometry={g.parede} castShadow receiveShadow>
        <meshStandardMaterial color={C.parede} roughness={0.8} envMapIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <primitive object={brises} />
      <mesh geometry={g.faixa} castShadow>
        <meshStandardMaterial color={C.faixa} roughness={0.7} emissive={C.faixaLuz} emissiveIntensity={0.25 + 0.5 * luz} side={THREE.DoubleSide} />
      </mesh>
      {/* Pilar da cobertura */}
      <mesh geometry={G_PILAR} position={[(R_WALL + 0.45) * Math.sin(phi), 3.375, (R_WALL + 0.45) * Math.cos(phi)]} castShadow>
        <Fosco cor={C.pilar} />
      </mesh>
      {teto > 0.01 ? (
        <group position={[0, -8 * (1 - teto), 0]}>
          <mesh geometry={g.teto} castShadow receiveShadow>
            <meshStandardMaterial color={C.teto} roughness={0.7} envMapIntensity={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={g.fita}>
            <meshStandardMaterial color={C.fita} emissive={C.fita} emissiveIntensity={0.15 + 0.55 * luz} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

export const coresEstadio = (tema: Tema) => ({
  degrau: mistura(tema.objetoEscuro, tema.fundo, 0.25),
  cadeira: mistura(tema.objeto, tema.objetoEscuro, 0.35),
  cadeira2: mistura(tema.objeto, tema.objetoEscuro, 0.55),
  parede: mistura(tema.objetoEscuro, tema.objeto, 0.22),
  brise: mistura(tema.objeto, tema.objetoEscuro, 0.2),
  faixa: mistura(tema.objetoEscuro, tema.fundo, 0.4),
  faixaLuz: mistura(tema.objetoClaro, tema.areia, 0.3),
  pilar: mistura(tema.objeto, tema.objetoEscuro, 0.45),
  teto: mistura(tema.objeto, tema.objetoEscuro, 0.3),
  fita: mistura(tema.objetoClaro, tema.areia, 0.2),
  grama: mistura(festa(tema).verde, tema.fundo, 0.6),
  grama2: mistura(festa(tema).verde, tema.fundo, 0.68),
  terra: mistura(tema.areia, tema.fundo, 0.72),
  linha: mistura(tema.objetoClaro, tema.fundo, 0.12),
});

// ---------- Campo: gramado com faixas, linhas, traves, bancos ----------
const Faixa: React.FC<{a: [number, number]; b: [number, number]; y: number; c: string; larg?: number; emissivo?: number}> = ({a, b, y, c, larg = 0.07, emissivo = 0}) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return (
    <mesh position={[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2]} rotation={[-Math.PI / 2, 0, -Math.atan2(b[1] - a[1], b[0] - a[0])]}>
      <planeGeometry args={[L + larg, larg]} />
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15 + emissivo} roughness={0.9} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-6} />
    </mesh>
  );
};
export const Campo: React.FC<{tema: Tema; obra: number; meio?: number}> = ({tema, obra, meio = 0}) => {
  const C = coresEstadio(tema);
  const {x: X, z: Z} = CAMPO;
  const y = Y_GRAMA + 0.02;
  const corGrama = mistura(C.terra, C.grama, obra);
  const corGrama2 = mistura(C.terra, C.grama2, obra);
  return (
    <group>
      <mesh position={[0, Y_GRAMA, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, OVAL, 1]} receiveShadow>
        <circleGeometry args={[R_IN + 0.05, 64]} />
        <meshStandardMaterial color={corGrama2} roughness={1} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
      </mesh>
      {/* Faixas de corte da grama */}
      {Array.from({length: 10}).map((_, i) => (
        <mesh key={i} position={[-X + (X / 5) * (i + 0.5), Y_GRAMA + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[X / 5, Z * 2]} />
          <meshStandardMaterial color={i % 2 ? corGrama : corGrama2} roughness={1} polygonOffset polygonOffsetFactor={-1.5} polygonOffsetUnits={-4} />
        </mesh>
      ))}
      {obra > 0.5 ? (
        <>
          {/* Linhas */}
          <Faixa a={[-X, -Z]} b={[X, -Z]} y={y} c={C.linha} />
          <Faixa a={[-X, Z]} b={[X, Z]} y={y} c={C.linha} />
          <Faixa a={[-X, -Z]} b={[-X, Z]} y={y} c={C.linha} />
          <Faixa a={[X, -Z]} b={[X, Z]} y={y} c={C.linha} />
          <Faixa a={[0, -Z]} b={[0, Z]} y={y} c={mistura(C.linha, tema.objetoClaro, meio)} larg={0.07 + 0.08 * meio} emissivo={1.2 * meio} />
          {[-1, 1].map((l) => (
            <React.Fragment key={l}>
              <Faixa a={[l * X, -2.1]} b={[l * (X - 2.0), -2.1]} y={y} c={C.linha} />
              <Faixa a={[l * X, 2.1]} b={[l * (X - 2.0), 2.1]} y={y} c={C.linha} />
              <Faixa a={[l * (X - 2.0), -2.1]} b={[l * (X - 2.0), 2.1]} y={y} c={C.linha} />
              <Faixa a={[l * X, -0.95]} b={[l * (X - 0.7), -0.95]} y={y} c={C.linha} />
              <Faixa a={[l * X, 0.95]} b={[l * (X - 0.7), 0.95]} y={y} c={C.linha} />
              <Faixa a={[l * (X - 0.7), -0.95]} b={[l * (X - 0.7), 0.95]} y={y} c={C.linha} />
              {/* Trave com rede */}
              <group position={[l * X, 0, 0]}>
                {[-0.62, 0.62].map((z) => (
                  <mesh key={z} position={[0, 0.3 + Y_GRAMA, z]} castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.6, 10]} />
                    <Fosco cor={tema.objetoClaro} emissivo={0.15} />
                  </mesh>
                ))}
                <mesh position={[0, 0.6 + Y_GRAMA, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 1.27, 10]} />
                  <Fosco cor={tema.objetoClaro} emissivo={0.15} />
                </mesh>
                <mesh position={[l * 0.22, 0.32 + Y_GRAMA, 0]}>
                  <boxGeometry args={[0.44, 0.6, 1.24]} />
                  <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.16} depthWrite={false} roughness={0.9} />
                </mesh>
              </group>
            </React.Fragment>
          ))}
          <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.22, 1.29, 64]} />
            <meshStandardMaterial color={C.linha} emissive={C.linha} emissiveIntensity={0.15} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-6} />
          </mesh>
          {/* Bancos de reservas */}
          {[-1.7, 1.7].map((x) => (
            <group key={x} position={[x, 0, Z + 0.9]}>
              <Caixa args={[1.4, 0.32, 0.4]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.2, 0]} />
              <Caixa args={[1.5, 0.05, 0.6]} raio={0.02} cor={mistura(tema.objetoClaro, tema.ceuLuz, 0.3)} position={[0, 0.62, 0.02]} />
              <Caixa args={[1.5, 0.55, 0.05]} raio={0.02} cor={mistura(tema.objetoClaro, tema.ceuLuz, 0.3)} position={[0, 0.36, -0.27]} />
            </group>
          ))}
        </>
      ) : null}
    </group>
  );
};

// ---------- Placas de publicidade em volta do campo (genéricas) ----------
// `caixa` 0..1: acima de 0,5 a placa do meio mostra `patrocinador` (texto livre, padrão genérico).
export const PlacasCampo: React.FC<{tema: Tema; luz: number; caixa: number; patrocinador?: string}> = ({tema, luz, caixa, patrocinador = 'BANCO'}) => {
  const fundo = mistura(tema.objetoEscuro, tema.fundo, 0.3);
  const texto = mistura(tema.objetoClaro, tema.textoSuave, 0.3);
  const xs = [-5.2, -3.1, -1.05, 1.05, 3.1, 5.2];
  return (
    <>
      {xs.map((x, i) => (
        <group key={x} position={[x, 0.27, -CAMPO.z - 0.85]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.95} alt={0.4} linhas={[{t: i === 2 && caixa > 0.5 ? patrocinador : 'PATROCÍNIO', tam: 150, cor: texto, peso: 800}]} fundo={fundo} />
          <Caixa args={[1.9, 0.04, 0.04]} raio={0.015} cor={mistura(fundo, tema.objetoClaro, luz)} emissivo={0.6 * luz} sombra={false} position={[0, -0.22, 0.05]} />
        </group>
      ))}
      {xs.map((x) => (
        <Caixa key={`f${x}`} args={[1.95, 0.4, 0.06]} raio={0.02} cor={mistura(fundo, tema.objeto, 0.2 + 0.3 * luz)} emissivo={0.12 + 0.3 * luz} position={[x, 0.27, CAMPO.z + 0.55]} />
      ))}
    </>
  );
};

// ---------- Torre de refletor ----------
const Refletor: React.FC<{tema: Tema; pos: V3; luz: number; k: number}> = ({tema, pos, luz, k}) => {
  if (k < 0.02) return null;
  const rot = Math.atan2(-pos[0], -pos[2]);
  const H = 11.5;
  const lamp = mistura(tema.objetoClaro, tema.areia, 0.15);
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={[1, k, 1]}>
      <mesh position={[0, H / 2, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.24, H, 12]} />
        <Fosco cor={mistura(tema.objeto, tema.objetoEscuro, 0.45)} />
      </mesh>
      <group position={[0, H + 0.4, 0.2]} rotation={[0.45, 0, 0]}>
        <Caixa args={[2.4, 1.5, 0.3]} raio={0.06} cor={tema.objetoEscuro} />
        {Array.from({length: 12}).map((_, i) => (
          <Caixa key={i} args={[0.44, 0.3, 0.08]} raio={0.03} cor={mistura(tema.objetoEscuro, lamp, luz)} emissivo={1.4 * luz} sombra={false} position={[-0.81 + (i % 4) * 0.54, 0.4 - Math.floor(i / 4) * 0.4, 0.17]} />
        ))}
      </group>
    </group>
  );
};
export const REFLETORES: V3[] = [
  [-12.4, 0, 8.9],
  [12.4, 0, 8.9],
  [-12.4, 0, -8.9],
  [12.4, 0, -8.9],
];

// ---------- O estádio inteiro ----------
// `obra` 0..1: os gomos sobem do chão um a um (0 = só a fundação). `corte` 0..1: a frente afunda e abre.
// `luz` 0..1: refletores, fita da cobertura e faixa da fachada acesas.
export const Estadio: React.FC<{tema: Tema; obra: number; corte: number; luz: number}> = ({tema, obra, corte, luz}) => {
  const C = coresEstadio(tema);
  const k01 = (x: number) => Math.max(0, Math.min(1, x));
  return (
    <>
      <group scale={[1, 1, OVAL]}>
        {/* Fundação (o terreno de 2013) */}
        {obra < 0.98
          ? GEO.map((g, i) => (
              <mesh key={`f${i}`} geometry={g.fundacao}>
                <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.areia, 0.2)} roughness={0.95} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
              </mesh>
            ))
          : null}
        {GEO.map((_, i) => {
          // ordem de subida: começa no fundo e vem para a frente pelos dois lados
          const ordem = 1 - Math.abs(centroGomo(i)) / Math.PI;
          const kg = k01(obra * 1.7 - ordem * 0.7);
          const sobe = 1 - Math.pow(1 - kg, 3);
          const abre = FRENTE(i) ? corte * (1 - 0.35 * (Math.abs(centroGomo(i)) / (Math.PI / 3))) : 0;
          const dy = -9.5 * (1 - sobe) - 9.5 * Math.min(1, abre * 1.25);
          if (dy < -9.3) return null;
          const teto = k01((obra - 0.55) / 0.4);
          return <Gomo key={i} tema={tema} i={i} dy={dy} teto={teto} luz={luz} cores={C} />;
        })}
      </group>
      {REFLETORES.map((p, i) => (
        <Refletor key={i} tema={tema} pos={p} luz={luz} k={k01((obra - 0.7 - i * 0.04) / 0.25)} />
      ))}
      {/* Portão da frente com catracas (afunda junto com a frente) */}
      {obra > 0.9 && corte < 0.98 ? (
        <group position={[0, -9.5 * Math.min(1, corte * 1.25), Z_FACHADA]}>
          <Caixa args={[4.4, 2.4, 0.3]} raio={0.06} cor={mistura(tema.fundo, tema.objetoEscuro, 0.4)} sombra={false} position={[0, 1.2, 0.05]} />
          <Caixa args={[4.9, 0.22, 0.6]} raio={0.04} cor={C.pilar} position={[0, 2.5, 0.25]} />
          {[-1.5, -0.5, 0.5, 1.5].map((x) => (
            <group key={x} position={[x, 0, 1.0]}>
              <Caixa args={[0.18, 0.9, 0.5]} raio={0.04} cor={C.pilar} position={[0, 0.45, 0]} />
              <Caixa args={[0.55, 0.05, 0.05]} raio={0.02} cor={tema.objetoClaro} emissivo={0.2 + 0.4 * luz} sombra={false} position={[0.3, 0.75, 0]} />
            </group>
          ))}
        </group>
      ) : null}
      {luz > 0.02 ? (
        <>
          <pointLight position={[0, 9, 2]} color={tema.luzCor} intensity={60 * luz} distance={34} decay={2} />
          <pointLight position={[0, 9, -4]} color={tema.luzCor} intensity={40 * luz} distance={30} decay={2} />
        </>
      ) : null}
    </>
  );
};

// ---------- Telão: o placar da dívida (ou do jogo) ----------
// Valores já arredondados pela cena (o texto só muda em poucos degraus: cada troca é uma textura nova, descartada).
export const Telao: React.FC<{
  tema: Tema;
  modo: 'conta' | 'jogo';
  pegou: number;
  pagou: number;
  deve: number;
  linhas: number; // quantas linhas já apareceram (0..3)
  deveTexto?: string;
  brilho?: number;
  sobe?: number;
}> = ({tema, modo, pegou, pagou, deve, linhas, deveTexto, brilho = 0.5, sobe = 0}) => {
  const tela = mistura(tema.fundo, tema.objetoEscuro, 0.25);
  const semBorda: Tema = {...tema, tinta: tela}; // Placa sem a moldura clara
  const label = tema.textoSuave;
  const F = festa(tema);
  const MAX = 700;
  const L = 3.0;
  const linha = (y: number, nome: string, v: number, txt: string, c: string, k: number) =>
    k < 0.02 ? null : (
      <group position={[0, y, 0.2]}>
        <Placa tema={semBorda} pos={[-2.75, 0, 0]} larg={2.0} alt={0.66} linhas={[{t: nome, tam: 210, cor: label, peso: 800}]} fundo={tela} />
        <Caixa args={[L + 0.08, 0.5, 0.04]} raio={0.03} cor={mistura(tela, tema.objetoEscuro, 0.4)} sombra={false} position={[-1.6 + L / 2, 0, 0]} />
        {v > 0.5 ? <Caixa args={[Math.max(0.06, (L * v) / MAX), 0.4, 0.08]} raio={0.03} cor={c} emissivo={0.55 * k} sombra={false} position={[-1.6 + (L * v) / MAX / 2, 0, 0.04]} /> : null}
        <Placa tema={semBorda} pos={[2.85, 0, 0]} larg={2.1} alt={0.66} linhas={[{t: txt, tam: 190, cor: c, peso: 850}]} fundo={tela} />
      </group>
    );
  return (
    <group position={[TELAO[0], TELAO[1] - 12 * sobe, TELAO[2]]}>
      {/* Pernas apoiadas na cobertura */}
      {[-3.0, 3.0].map((x) => (
        <Caixa key={x} args={[0.3, 2.2, 0.3]} raio={0.06} cor={mistura(tema.objeto, tema.objetoEscuro, 0.5)} position={[x, -2.2, -0.2]} />
      ))}
      <Caixa args={[8.4, 3.6, 0.4]} raio={0.1} cor={tema.objetoEscuro} position={[0, 0, -0.05]} />
      <Caixa args={[8.0, 3.2, 0.06]} raio={0.04} cor={tela} emissivo={0.1 + 0.25 * brilho} sombra={false} position={[0, 0, 0.16]} />
      {modo === 'conta' ? (
        <>
          {linha(1.05, 'PEGOU', pegou, `R$ ${pegou} MI`, mistura(tema.objetoClaro, tema.areia, 0.1), linhas)}
          {linha(0, 'PAGOU', pagou, `R$ ${pagou} MI`, F.dourado, linhas - 1)}
          {linha(-1.05, 'DEVE', deve, deveTexto ?? `R$ ${deve} MI`, tema.acento, linhas - 2)}
        </>
      ) : (
        <group position={[0, 0, 0.21]}>
          <Placa tema={semBorda} pos={[0, 0.85, 0]} larg={4.4} alt={0.8} linhas={[{t: '● AO VIVO', tam: 220, cor: tema.acento, peso: 800}]} fundo={tela} />
          <Placa tema={semBorda} pos={[0, -0.45, 0]} larg={6.0} alt={1.6} linhas={[{t: 'CASA 2 × 1 FORA', tam: 100, cor: tema.objetoClaro, peso: 850}]} fundo={tela} />
        </group>
      )}
    </group>
  );
};

// ---------- Letreiro da fachada: "ARENA" + o lugar do nome ----------
export const Letreiro: React.FC<{tema: Tema; dy: number; brilho: number; vazio: number}> = ({tema, dy, brilho, vazio}) => {
  const fundo = mistura(tema.fundo, tema.objetoEscuro, 0.3);
  return (
    <group position={[LETREIRO[0], LETREIRO[1] + dy, LETREIRO[2]]}>
      <Placa tema={tema} pos={[-2.6, 0, 0]} larg={3.0} alt={1.15} linhas={[{t: 'ARENA', tam: 250, cor: tema.objetoClaro, peso: 850}]} fundo={fundo} />
      <Caixa args={[2.8, 0.06, 0.08]} raio={0.02} cor={mistura(fundo, tema.objetoClaro, brilho)} emissivo={0.8 * brilho} sombra={false} position={[-2.6, -0.68, 0.08]} />
      {/* Lugar vazio do nome: moldura tracejada */}
      {vazio > 0.02
        ? Array.from({length: 14}).map((_, i) => {
            const lado = i < 5 ? 0 : i < 10 ? 1 : i < 12 ? 2 : 3;
            const k = lado < 2 ? (i % 5) / 4 : (i % 2) / 1;
            const x = lado < 2 ? -0.1 + k * 4.4 : lado === 2 ? -0.2 : 4.4;
            const y = lado === 0 ? 0.58 : lado === 1 ? -0.58 : -0.25 + k * 0.5;
            return <Caixa key={i} args={lado < 2 ? [0.55, 0.06, 0.05] : [0.06, 0.32, 0.05]} raio={0.02} cor={tema.objetoClaro} emissivo={0.6 * vazio} sombra={false} position={[x, y, 0.06]} scale={vazio} />;
          })
        : null}
    </group>
  );
};
// A placa do nome (solta: voa até o banco, volta, troca de texto)
export const LUGAR_NOME: V3 = [LETREIRO[0] + 2.1, LETREIRO[1], LETREIRO[2] + 0.02];
export const PlacaNome: React.FC<{tema: Tema; pos: V3; rotY?: number; texto: string; brilho: number; escala?: number}> = ({tema, pos, rotY = 0, texto, brilho, escala = 1}) => {
  if (escala < 0.02) return null;
  const fundo = mistura(tema.objeto, tema.objetoClaro, 0.3 + 0.4 * brilho);
  const tam = texto.length > 12 ? 98 : texto.length > 6 ? 150 : 220;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={4.4} alt={1.15} linhas={texto ? [{t: texto, tam, cor: tema.fundo, peso: 850}] : []} fundo={fundo} />
      <Caixa args={[4.5, 0.08, 0.1]} raio={0.03} cor={mistura(tema.objeto, tema.objetoClaro, brilho)} emissivo={0.7 * brilho} sombra={false} position={[0, -0.66, 0.06]} />
    </group>
  );
};

// ---------- Trilho do dinheiro: canaleta no chão com moedas correndo ----------
export type Trajeto = {pts: [number, number][]; acc: number[]; L: number};
export const trajeto = (pts: [number, number][]): Trajeto => {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return {pts, acc, L: acc[acc.length - 1]};
};
export const noTrajeto = (tr: Trajeto, d: number): [number, number, number] => {
  const dd = Math.max(0, Math.min(tr.L, d));
  let i = 1;
  while (i < tr.acc.length - 1 && tr.acc[i] < dd) i++;
  const k = (dd - tr.acc[i - 1]) / Math.max(1e-6, tr.acc[i] - tr.acc[i - 1]);
  const [ax, az] = tr.pts[i - 1];
  const [bx, bz] = tr.pts[i];
  return [ax + (bx - ax) * k, az + (bz - az) * k, Math.atan2(bx - ax, bz - az)];
};
// `k` 0..1: a canaleta aparece. `fluxo` > 0 corre do começo para o fim; < 0, ao contrário. `vazao` 0..1: quantas moedas.
export const TrilhoMoedas: React.FC<{tema: Tema; tr: Trajeto; k: number; t: number; fluxo: number; vazao: number; brilho?: number}> = ({tema, tr, k, t, fluxo, vazao, brilho = 0}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const canal = mistura(tema.objetoEscuro, tema.fundo, 0.35);
  const borda = mistura(tema.objeto, tema.objetoEscuro, 0.5);
  const segs = tr.pts.slice(1).map((b, i) => {
    const a = tr.pts[i];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return {x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2, L, rot: Math.atan2(b[0] - a[0], b[1] - a[1])};
  });
  const n = Math.round(tr.L / 0.9);
  return (
    <>
      {segs.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.rot, 0]}>
          <Caixa args={[0.62, 0.07, s.L * k + 0.3]} raio={0.03} cor={canal} position={[0, 0.07, 0]} />
          {[-1, 1].map((l) => (
            <Caixa key={l} args={[0.08, 0.14, s.L * k + 0.3]} raio={0.03} cor={mistura(borda, tema.objetoClaro, brilho)} emissivo={0.4 * brilho} position={[0.33 * l, 0.1, 0]} />
          ))}
        </group>
      ))}
      {vazao > 0.02
        ? Array.from({length: n}).map((_, i) => {
            const u = (((i / n + (t * fluxo) / tr.L) % 1) + 1) % 1;
            const [x, z, r] = noTrajeto(tr, u * tr.L);
            const fade = Math.min(1, u / 0.04, (1 - u) / 0.04);
            const s = Math.min(1, vazao * 1.4 - (i % 3) * 0.2) * fade;
            if (s <= 0.02) return null;
            return <MoedaCor key={i} tema={tema} pos={[x, 0.28, z]} rot={[Math.PI / 2, r, t * 6 * Math.sign(fluxo) + i]} r={0.2 * s} cor={F.dourado} brilho={0.25} />;
          })
        : null}
    </>
  );
};

// ---------- Torneira dos juros (cano, registro, bica) ----------
export const BICA: V3 = [0, 3.1, 0.95]; // ponta da bica, relativa à torneira
export const Torneira: React.FC<{tema: Tema; pos: V3; abre: number; k: number; brilho?: number}> = ({tema, pos, abre, k, brilho = 0}) => {
  if (k < 0.02) return null;
  const metal = mistura(tema.objeto, tema.objetoEscuro, 0.25);
  return (
    <group position={pos} scale={k}>
      <Caixa args={[0.8, 0.2, 0.8]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.1, -0.6]} />
      <mesh position={[0, 1.75, -0.6]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 3.3, 20]} />
        <meshStandardMaterial color={metal} roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Curva e bica */}
      <mesh position={[0, 3.4, -0.25]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.35, 0.16, 14, 24, Math.PI / 2]} />
        <meshStandardMaterial color={metal} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 3.4, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 1.2, 20]} />
        <meshStandardMaterial color={metal} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 3.25, 0.95]} castShadow>
        <cylinderGeometry args={[0.2, 0.17, 0.3, 20]} />
        <meshStandardMaterial color={mistura(metal, tema.acento, brilho)} emissive={tema.acento} emissiveIntensity={0.4 * brilho} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Registro (gira quando abre) */}
      <group position={[0, 3.95, 0.35]} rotation={[0, abre * Math.PI * 1.5, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 10]} />
          <Fosco cor={metal} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.36, 0.055, 10, 28]} />
          <Fosco cor={tema.acento} emissivo={0.25 + 0.3 * abre} />
        </mesh>
        {[0, Math.PI / 2].map((a) => (
          <Caixa key={a} args={[0.7, 0.06, 0.06]} raio={0.02} cor={tema.acento} rotation={[0, a, 0]} />
        ))}
      </group>
    </group>
  );
};

// ---------- Guindaste de torre ----------
export const Guindaste: React.FC<{tema: Tema; pos: V3; rotY: number; k: number; cabo: number; braco?: number; carga?: React.ReactNode}> = ({tema, pos, rotY, k, cabo, braco = 13, carga}) => {
  if (k < 0.02) return null;
  const amarelo = mistura(festa(tema).dourado, tema.objetoEscuro, 0.25);
  const H = 15;
  return (
    <group position={[pos[0], pos[1] - (1 - k) * (H + 2), pos[2]]}>
      <Caixa args={[1.6, 0.4, 1.6]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.2, 0]} />
      {/* Torre treliçada: 4 montantes e travessas */}
      {[-1, 1].map((a) =>
        [-1, 1].map((b) => <Caixa key={`${a}${b}`} args={[0.1, H, 0.1]} raio={0.03} cor={amarelo} position={[0.35 * a, H / 2, 0.35 * b]} />),
      )}
      {Array.from({length: 14}).map((_, i) => (
        <group key={i} position={[0, 0.8 + i * 1.03, 0]} rotation={[0, (i % 2) * (Math.PI / 2), 0]}>
          <Caixa args={[0.8, 0.07, 0.07]} raio={0.02} cor={amarelo} position={[0, 0, 0.35]} rotation={[0, 0, 0.9]} sombra={false} />
          <Caixa args={[0.8, 0.07, 0.07]} raio={0.02} cor={amarelo} position={[0, 0, -0.35]} rotation={[0, 0, -0.9]} sombra={false} />
        </group>
      ))}
      <group position={[0, H, 0]} rotation={[0, rotY, 0]}>
        {/* Cabine, lança e contralança */}
        <Caixa args={[0.9, 0.8, 0.9]} raio={0.06} cor={tema.objeto} position={[0.2, 0.4, 0.6]} />
        <Caixa args={[0.5, 0.5, braco]} raio={0.06} cor={amarelo} position={[0, 0.9, braco / 2 - 1]} />
        <Caixa args={[0.5, 0.5, 4]} raio={0.06} cor={amarelo} position={[0, 0.9, -2.8]} />
        <Caixa args={[1.0, 1.0, 1.2]} raio={0.08} cor={tema.objetoEscuro} position={[0, 0.5, -4.2]} />
        <mesh position={[0, 2.0, 0]} castShadow>
          <coneGeometry args={[0.35, 2.4, 4]} />
          <Fosco cor={amarelo} />
        </mesh>
        {/* Carrinho, cabo e gancho */}
        <group position={[0, 0.6, braco - 2]}>
          <Caixa args={[0.6, 0.25, 0.6]} raio={0.05} cor={tema.objetoEscuro} />
          <mesh position={[0, -cabo / 2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, cabo, 6]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
          <group position={[0, -cabo, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.18, 0.05, 8, 16, Math.PI * 1.4]} />
              <Fosco cor={tema.objeto} />
            </mesh>
            {carga}
          </group>
        </group>
      </group>
    </group>
  );
};

// ---------- Bandeirinha genérica (sem escudo) ----------
export const Flamula: React.FC<{tema: Tema; pos: V3; rotY: number; cor: string; k: number; t: number; fase: number}> = ({tema, pos, rotY, cor: c, k, t, fase}) => {
  if (k < 0.02) return null;
  const onda = Math.sin(t * 3.2 + fase) * 0.25;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 6]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <group position={[0, 1.55, 0]} rotation={[0, onda, 0]}>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.28, 0.9, 3]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Torcedor amigo: boneco de camisa listrada (sem escudo) ----------
export const Amigo: React.FC<{tema: Tema; pos: V3; rotY?: number; pose?: Pose; escala?: number}> = ({tema, pos, rotY = 0, pose, escala = 1}) => {
  const listra = mistura(tema.fundo, tema.objetoEscuro, 0.3);
  return (
    <Boneco tema={tema} pos={pos} rotY={rotY} pose={pose} escala={escala} cor={tema.objetoClaro}>
      <group rotation={[pose?.tronco ?? 0, 0, 0]} position={[0, 0.93, 0]}>
        <group position={[0, -0.93, 0]}>
          {[1.13, 1.25, 1.37, 1.49].map((y) => (
            <mesh key={y} position={[0, y, 0]} scale={[1, 1, 0.75]}>
              <cylinderGeometry args={[0.247, 0.247, 0.06, 28]} />
              <Fosco cor={listra} />
            </mesh>
          ))}
          {/* Calção */}
          <mesh position={[0, 0.97, 0]} scale={[1.06, 0.62, 0.84]}>
            <sphereGeometry args={[0.205, 24, 16]} />
            <Fosco cor={listra} />
          </mesh>
        </group>
      </group>
    </Boneco>
  );
};

// ---------- Torcida: bonecos simples em instancedMesh, com cor por pessoa e braços que sobem ----------
export type Torcedor = {x: number; y: number; z: number; rot: number; cor: string; fase: number};
const G_CORPO = new THREE.CapsuleGeometry(0.085, 0.16, 4, 10);
const G_CAB = new THREE.SphereGeometry(0.075, 12, 10);
const G_BR = new THREE.CapsuleGeometry(0.028, 0.16, 3, 6);
export const Torcida: React.FC<{tema: Tema; gente: Torcedor[]; t: number; s: number; agita: number; luz: number}> = ({tema, gente, t, s, agita, luz}) => {
  const n = gente.length;
  const cabeca = mistura(tema.objetoClaro, festa(tema).pele, 0.35);
  const preparar = (parte: 'corpo' | 'cab' | 'br') => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    let k = 0;
    gente.forEach((g) => {
      const pulo = Math.max(0, Math.sin(t * 7 + g.fase)) * 0.06 * agita;
      const sc = Math.max(0.0001, s);
      const base = new THREE.Matrix4().compose(new THREE.Vector3(g.x, g.y + pulo * sc, g.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, g.rot, 0)), new THREE.Vector3(sc, sc, sc));
      if (parte === 'br') {
        const sobe = agita * (0.6 + 0.4 * Math.sin(t * 5 + g.fase));
        [-1, 1].forEach((l) => {
          tmp.position.set(0.11 * l, 0.31, 0);
          tmp.rotation.set(0, 0, l * (0.25 + 2.5 * sobe));
          tmp.scale.setScalar(1);
          tmp.updateMatrix();
          const m = base.clone().multiply(tmp.matrix).multiply(new THREE.Matrix4().makeTranslation(0, -0.1, 0));
          mesh.setMatrixAt(k, m);
          cor.set(g.cor);
          mesh.setColorAt(k, cor);
          k++;
        });
        return;
      }
      tmp.position.set(0, parte === 'corpo' ? 0.2 : 0.42, 0);
      tmp.rotation.set(0, 0, 0);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      mesh.setMatrixAt(k, base.clone().multiply(tmp.matrix));
      cor.set(parte === 'corpo' ? g.cor : cabeca);
      mesh.setColorAt(k, cor);
      k++;
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  };
  if (n === 0 || s < 0.02) return null;
  return (
    <>
      {(['corpo', 'cab', 'br'] as const).map((p) => (
        <instancedMesh key={`${p}${n}`} ref={preparar(p)} args={[p === 'corpo' ? G_CORPO : p === 'cab' ? G_CAB : G_BR, undefined, p === 'br' ? n * 2 : n]} castShadow frustumCulled={false}>
          <meshStandardMaterial roughness={0.75} emissive={tema.objetoClaro} emissiveIntensity={0.06 + 0.16 * luz} />
        </instancedMesh>
      ))}
    </>
  );
};

// ---------- Bairro atrás do estádio (casinhas em instancedMesh) ----------
export const CASAS: {x: number; z: number; rot: number; e: number}[] = (() => {
  const out: {x: number; z: number; rot: number; e: number}[] = [];
  let s = 23;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let z = -17; z >= -37; z -= 3.3)
    for (let x = -15; x <= 15; x += 2.5) {
      if (Math.abs(x) < 1.6) continue; // rua do meio
      if (rnd() < 0.12) continue;
      out.push({x: x + (rnd() - 0.5) * 0.5, z: z + (rnd() - 0.5) * 0.6, rot: (rnd() < 0.5 ? 0 : Math.PI) + (rnd() - 0.5) * 0.2, e: 0.9 + rnd() * 0.35});
    }
  return out;
})();
const G_CASA = new THREE.BoxGeometry(1.4, 0.95, 1.2).translate(0, 0.475, 0);
const G_TELHADO = new THREE.CylinderGeometry(1, 1, 1, 3).rotateZ(Math.PI / 2).scale(0.85, 0.42, 0.72).translate(0, 1.13, 0);
const G_JANELA = new THREE.PlaneGeometry(0.34, 0.3).translate(0.3, 0.55, 0.605);
const G_PORTA = new THREE.PlaneGeometry(0.28, 0.5).translate(-0.3, 0.25, 0.605);
export const Bairro: React.FC<{tema: Tema; luz: number}> = ({tema, luz}) => {
  const paredes = [mistura(tema.objeto, tema.objetoEscuro, 0.35), mistura(tema.objeto, tema.areia, 0.25), mistura(tema.objeto, tema.ceuLuz, 0.3)];
  const preparar = (tipo: number) => (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CASAS.forEach((c, i) => {
      tmp.position.set(c.x, 0, c.z);
      tmp.rotation.set(0, c.rot, 0);
      tmp.scale.setScalar(c.e);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      if (tipo === 0) {
        cor.set(paredes[i % 3]);
        mesh.setColorAt(i, cor);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  const n = CASAS.length;
  const janela = mistura(tema.objetoEscuro, mistura(tema.objetoClaro, tema.areia, 0.3), 0.35 + 0.65 * luz);
  return (
    <>
      <instancedMesh ref={preparar(0)} args={[G_CASA, undefined, n]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={preparar(1)} args={[G_TELHADO, undefined, n]} castShadow>
        <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.fundo, 0.2)} roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={preparar(2)} args={[G_JANELA, undefined, n]}>
        <meshStandardMaterial color={janela} emissive={janela} emissiveIntensity={0.25 + 0.9 * luz} />
      </instancedMesh>
      <instancedMesh ref={preparar(3)} args={[G_PORTA, undefined, n]}>
        <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.fundo, 0.4)} />
      </instancedMesh>
    </>
  );
};

// ---------- Calendário grande de mesa (o ano/a data em texto; muda poucas vezes) ----------
export const CalendarioGrande: React.FC<{tema: Tema; pos: V3; rotY?: number; texto: string; sub?: string; folha: number; escala?: number; destaque?: number}> = ({tema, pos, rotY = 0, texto, sub, folha, escala = 1, destaque = 0}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.12);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.6, 0.12, 0.7]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <group position={[0, 0.12, 0]} rotation={[-0.18, 0, 0]}>
        <Caixa args={[1.5, 1.5, 0.12]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.75, -0.05]} />
        <Caixa args={[1.4, 0.3, 0.06]} raio={0.03} cor={mistura(tema.acento, tema.objetoEscuro, 0.2 - 0.2 * destaque)} emissivo={0.25 + 0.4 * destaque} position={[0, 1.36, 0.04]} />
        <Placa tema={tema} pos={[0, 0.66, 0.02]} larg={1.4} alt={1.0} linhas={[{t: texto, tam: texto.length > 5 ? 190 : 300, cor: tema.fundo, peso: 850}, ...(sub ? [{t: sub, tam: 120, cor: tema.objetoEscuro, peso: 700}] : [])]} fundo={papel} />
        {/* Argolas */}
        {[-0.45, 0.45].map((x) => (
          <mesh key={x} position={[x, 1.5, 0.05]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.08, 0.025, 8, 16]} />
            <Fosco cor={tema.objeto} />
          </mesh>
        ))}
        {/* Folha que vira para trás */}
        {folha > 0.02 && folha < 0.98 ? (
          <group position={[0, 1.2, 0.09]} rotation={[-folha * Math.PI * 0.95, 0, 0]}>
            <Caixa args={[1.36, 1.02, 0.015]} raio={0.005} cor={papel} position={[0, -0.51, 0]} sombra={false} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Marco de ano na linha do tempo (poste + placa) ----------
export const MarcoAno: React.FC<{tema: Tema; pos: V3; ano: string; k: number; aceso: number}> = ({tema, pos, ano, k, aceso}) => {
  if (k < 0.02) return null;
  const c = mistura(tema.objeto, tema.objetoClaro, aceso);
  return (
    <group position={pos} scale={[k, k, k]}>
      <Caixa args={[0.12, 1.3, 0.12]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[0, 0.65, 0]} />
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 24]} />
        <Fosco cor={c} emissivo={0.4 * aceso} />
      </mesh>
      <Placa tema={tema} pos={[0, 1.55, 0]} larg={1.4} alt={0.55} linhas={[{t: ano, tam: 330, cor: tema.fundo, peso: 850}]} fundo={c} />
    </group>
  );
};

// ---------- Contrato (folha com linhas e o espaço da assinatura vazio) ----------
export const Contrato: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre?: number}> = ({tema, pos, rot = [0, 0, 0], escala, abre = 1}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.1);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.62, 0.012, 0.82]} raio={0.004} cor={papel} position={[0, 0.006, 0]} />
      <group position={[0, 0.014, 0]} scale={[1, 1, Math.max(0.02, abre)]}>
        <Caixa args={[0.4, 0.004, 0.05]} raio={0.002} cor={tema.objetoEscuro} position={[0, 0, -0.31]} sombra={false} />
        {Array.from({length: 7}).map((_, i) => (
          <Caixa key={i} args={[0.5 - (i % 3) * 0.06, 0.003, 0.018]} raio={0.001} cor={mistura(tema.objetoEscuro, papel, 0.35)} position={[-(i % 3) * 0.03, 0, -0.2 + i * 0.055]} sombra={false} />
        ))}
        {/* Linhas da assinatura, vazias */}
        {[-0.15, 0.15].map((x) => (
          <Caixa key={x} args={[0.22, 0.003, 0.012]} raio={0.001} cor={tema.objetoEscuro} position={[x, 0, 0.31]} sombra={false} />
        ))}
      </group>
    </group>
  );
};

// ---------- Aperto de mão (o "negócio") ----------
export const ApertoMao: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; balanca?: number}> = ({tema, pos, rotY = 0, escala, balanca = 0}) => {
  if (escala < 0.02) return null;
  const a = mistura(tema.objetoClaro, festa(tema).pele, 0.3);
  const b = mistura(tema.objeto, tema.objetoEscuro, 0.2);
  return (
    <group position={pos} rotation={[0, rotY, balanca * 0.15]} scale={escala}>
      {[-1, 1].map((l) => (
        <group key={l}>
          <mesh position={[0.62 * l, -0.12 * l * 0, 0]} rotation={[0, 0, (Math.PI / 2) * l * 0.92]} castShadow>
            <capsuleGeometry args={[0.13, 0.8, 8, 16]} />
            <Fosco cor={l < 0 ? b : mistura(b, tema.objetoEscuro, 0.4)} />
          </mesh>
          <mesh position={[0.95 * l, 0, 0]} rotation={[0, 0, (Math.PI / 2) * l]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.14, 20]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0]} scale={[1.3, 0.85, 0.9]} castShadow>
        <sphereGeometry args={[0.22, 24, 18]} />
        <Fosco cor={a} />
      </mesh>
      <mesh position={[0.05, 0.1, 0.12]} scale={[1.1, 0.6, 0.7]} castShadow>
        <sphereGeometry args={[0.2, 24, 18]} />
        <Fosco cor={mistura(a, tema.objetoEscuro, 0.12)} />
      </mesh>
    </group>
  );
};

// ---------- Megafone (a publicidade) ----------
export const Megafone: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.1, 0.7, 28, 1, true]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 20]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.08, 0.3, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, -0.18, -0.15]} />
    </group>
  );
};

// ---------- Confete (papeizinhos caindo devagar, sem brilho) ----------
const G_PAPEL = new THREE.PlaneGeometry(0.09, 0.05);
export const Confete: React.FC<{tema: Tema; centro: V3; t: number; t0: number; dur: number; raio?: number; n?: number}> = ({tema, centro, t, t0, dur, raio = 2.2, n = 70}) => {
  const vida = t - t0;
  const cores = [tema.objetoClaro, mistura(tema.fundo, tema.objetoEscuro, 0.4), tema.objeto];
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    for (let i = 0; i < n; i++) {
      const a = (i * 2.399) % (Math.PI * 2);
      const r = raio * Math.sqrt(((i * 37) % 100) / 100);
      const queda = ((vida * (0.7 + ((i * 13) % 10) / 20) + ((i * 7) % 10) / 10) % 1.6) * 2.4;
      tmp.position.set(centro[0] + Math.cos(a) * r + Math.sin(vida * 2 + i) * 0.15, centro[1] + 3.6 - queda, centro[2] + Math.sin(a) * r);
      tmp.rotation.set(vida * 3 + i, vida * 2 + i * 0.5, i);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
      cor.set(cores[i % 3]);
      mesh.setColorAt(i, cor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  if (vida < 0 || vida > dur) return null;
  return (
    <instancedMesh ref={preparar} args={[G_PAPEL, undefined, n]} frustumCulled={false}>
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.8} transparent opacity={Math.min(1, (dur - vida) / 0.6)} />
    </instancedMesh>
  );
};

// ---------- Vitrine: caixa de vidro em volta do estádio ----------
export const Vitrine: React.FC<{tema: Tema; k: number; larg: number; prof: number; alt: number; y?: number}> = ({tema, k, larg, prof, alt, y = 0}) => {
  if (k < 0.02) return null;
  const c = mistura(tema.objetoClaro, tema.ceuLuz, 0.3);
  const A = alt * k;
  const aresta = (p: V3, s: V3, i: number) => <Caixa key={i} args={s} raio={0.05} cor={c} emissivo={0.6} sombra={false} position={p} />;
  const X = larg / 2;
  const Z = prof / 2;
  return (
    <group position={[0, y, 0]}>
      {[
        [-X, -Z],
        [X, -Z],
        [-X, Z],
        [X, Z],
      ].map(([x, z], i) => aresta([x, A / 2, z], [0.14, A, 0.14], i))}
      {aresta([0, A, -Z], [larg, 0.14, 0.14], 10)}
      {aresta([0, A, Z], [larg, 0.14, 0.14], 11)}
      {aresta([-X, A, 0], [0.14, 0.14, prof], 12)}
      {aresta([X, A, 0], [0.14, 0.14, prof], 13)}
      {aresta([0, 0.07, Z], [larg, 0.14, 0.14], 14)}
      {aresta([-X, 0.07, 0], [0.14, 0.14, prof], 15)}
      {aresta([X, 0.07, 0], [0.14, 0.14, prof], 16)}
      {[
        [0, A / 2, -Z, 0, larg],
        [-X, A / 2, 0, Math.PI / 2, prof],
        [X, A / 2, 0, Math.PI / 2, prof],
      ].map(([x, yy, z, r, w], i) => (
        <mesh key={`v${i}`} position={[x, yy, z]} rotation={[0, r, 0]}>
          <planeGeometry args={[w, A]} />
          <meshStandardMaterial color={c} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Jornal com manchete (textura feita uma vez por título) ----------
export const Manchete: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; titulo: string}> = ({tema, pos, rot = [0, 0, 0], escala, titulo}) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 680;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = mistura(tema.objetoClaro, tema.areia, 0.12);
    ctx.fillRect(0, 0, 512, 680);
    ctx.fillStyle = tema.fundo;
    ctx.fillRect(0, 0, 512, 92);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 50px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = tema.objetoClaro;
    ctx.fillText('ESPORTE', 256, 47);
    ctx.fillStyle = tema.fundo;
    ctx.font = '850 64px "Helvetica Neue", Arial, sans-serif';
    titulo.split('\n').forEach((l, i) => ctx.fillText(l, 256, 160 + i * 72));
    ctx.fillStyle = mistura(tema.objetoEscuro, tema.objetoClaro, 0.3);
    for (let i = 0; i < 9; i++) ctx.fillRect(40, 330 + i * 34, i % 3 === 2 ? 300 : 432, 14);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [titulo, tema]);
  useDescartar(tex);
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.06, 0.015]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
    </group>
  );
};
