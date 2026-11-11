import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Boneco, Caixa, Fosco, type Pose, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';
import {Arvore, Poste} from './imposto';

// Peças: Fumaça das queimadas: o mapa do Brasil deitado como um tabuleiro, com uma ruazinha em miniatura em cima de São Paulo.

// ---------- Mapa: longitude/latitude → mundo ----------
// x = (lon + 54) × 0,6 ; z = −(lat + 15) × 0,6 (Norte para −z). Contorno simplificado (o mesmo de carrovoador.tsx).
const ESC = 0.6;
export const geo = (lon: number, lat: number, y = 0): V3 => [(lon + 54) * ESC, y, -(lat + 15) * ESC];
const BR: [number, number][] = [
  [-73.9, -7.3], [-73.2, -4.3], [-70.0, -4.2], [-69.4, -1.1], [-69.8, 1.7], [-67.0, 2.2], [-64.0, 4.0], [-60.7, 5.2], [-57.0, 2.0], [-54.0, 2.2],
  [-51.6, 4.2], [-50.0, 1.8], [-48.5, -1.2], [-44.0, -2.5], [-41.0, -2.9], [-38.5, -3.7], [-35.2, -5.5], [-34.8, -7.2], [-35.3, -9.5], [-37.5, -11.5],
  [-38.9, -13.5], [-39.2, -17.7], [-40.3, -20.3], [-41.0, -22.0], [-43.2, -23.0], [-45.0, -23.8], [-48.5, -26.5], [-48.6, -28.5], [-50.2, -30.5], [-52.5, -33.7],
  [-53.5, -33.2], [-55.5, -31.0], [-57.6, -30.2], [-55.7, -27.4], [-54.6, -25.6], [-54.3, -24.0], [-55.5, -22.5], [-57.8, -22.0], [-58.0, -20.0], [-58.2, -17.5],
  [-60.2, -16.3], [-60.5, -13.8], [-64.5, -12.5], [-65.3, -10.8], [-68.5, -11.0], [-70.5, -9.5], [-72.2, -10.0],
];
const dentro = (lon: number, lat: number) => {
  let d = false;
  for (let i = 0, j = BR.length - 1; i < BR.length; j = i++) {
    const [xi, yi] = BR[i];
    const [xj, yj] = BR[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
};
// Topo do mapa (o "tabuleiro"): tudo que fica em cima do Brasil apoia aqui.
export const MAPA_Y = 0.36;
const G_MAPA = (() => {
  const s = new THREE.Shape();
  BR.forEach(([lo, la], i) => {
    const x = (lo + 54) * ESC;
    const y = (la + 15) * ESC;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  });
  return new THREE.ExtrudeGeometry(s, {depth: 0.22, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.05, bevelSegments: 3});
})();

// Floresta: arvorezinhas (cones) no Norte e no Pantanal, cada uma com a sua cor (verde → queimada).
type ArvMapa = {x: number; z: number; s: number; o: number};
const ARVORES: ArvMapa[] = (() => {
  let k = 11;
  const rnd = () => {
    k = (k * 16807) % 2147483647;
    return (k % 10000) / 10000;
  };
  const out: ArvMapa[] = [];
  let tent = 0;
  while (out.length < 420 && tent < 20000) {
    tent++;
    const lon = -74 + rnd() * 30;
    const lat = -16 + rnd() * 21;
    const pantanal = lon > -58.5 && lon < -55 && lat < -15.5 && lat > -21;
    if (!pantanal && (lat < -12.5 + (lon + 74) * 0.05 || lon > -45)) continue;
    if (!dentro(lon, lat)) continue;
    const [x, , z] = geo(lon, lat);
    out.push({x, z, s: 0.75 + rnd() * 0.5, o: rnd()});
  }
  return out;
})();
const G_ARV = new THREE.ConeGeometry(0.16, 0.42, 7);
G_ARV.translate(0, 0.21, 0);

export type Queimada = {p: V3; r: number; k: number};
export const Tabuleiro: React.FC<{tema: Tema; queimadas: Queimada[]; seca?: number}> = ({tema, queimadas, seca = 0}) => {
  const F = festa(tema);
  const m = useMemo(() => new THREE.Object3D(), []);
  const c = useMemo(() => new THREE.Color(), []);
  const verde = mistura(F.verde, tema.objetoEscuro, 0.15);
  const verdeEsc = mistura(F.verde, tema.objetoEscuro, 0.45);
  const queimado = mistura(tema.objetoEscuro, '#000000', 0.35);
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    ARVORES.forEach((a, i) => {
      let q = 0;
      for (const f of queimadas) {
        const d = Math.hypot(a.x - f.p[0], a.z - f.p[2]);
        q = Math.max(q, Math.max(0, Math.min(1, (f.r * f.k - d) / 0.6)));
      }
      m.position.set(a.x, MAPA_Y - 0.01, a.z);
      m.scale.setScalar(a.s * (1 - 0.35 * q));
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
      c.set(a.o > 0.5 ? verde : verdeEsc).lerp(new THREE.Color(queimado), q);
      mesh.setColorAt(i, c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <>
      {/* Mar escuro em volta, acima do chão do Palco */}
      <mesh position={[3, 0.04, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 40]} />
        <meshStandardMaterial color={mistura(F.azulNoite, tema.chao, 0.35)} roughness={0.95} />
      </mesh>
      <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={G_MAPA} receiveShadow castShadow>
          <Fosco cor={mistura(mistura(tema.areia, tema.objetoEscuro, 0.55), '#6B6B6B', seca * 0.4)} />
        </mesh>
      </group>
      <instancedMesh ref={preparar} args={[G_ARV, undefined, ARVORES.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </instancedMesh>
    </>
  );
};

// ---------- Pino de cidade ----------
export const Pino: React.FC<{tema: Tema; pos: V3; k: number; cor: string; brilho?: number}> = ({tema, pos, k, cor, brilho = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={[1, k, 1]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.9, 10]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.17, 20, 16]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.25 + 0.6 * brilho} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.22, 24]} />
        <meshBasicMaterial color={cor} transparent opacity={0.6} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
    </group>
  );

// ---------- Fogo: chamas que balançam devagar (a cor e o brilho não mudam: nada pisca) ----------
const G_CHAMA = new THREE.ConeGeometry(1, 2.4, 10);
G_CHAMA.translate(0, 1.2, 0);
export const Chamas: React.FC<{tema: Tema; pos: V3; k: number; t: number; tam?: number; n?: number; semente?: number}> = ({tema, pos, k, t, tam = 0.22, n = 5, semente = 0}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const cores = [F.dourado, mistura(F.dourado, tema.acento, 0.5), F.loiro];
  return (
    <group position={pos} scale={tam * k}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + semente;
        const r = i === 0 ? 0 : 0.9;
        const bal = Math.sin(t * 2.2 + i * 1.7 + semente) * 0.12;
        const alt = (i === 0 ? 1.25 : 0.75 + 0.2 * ((i * 37 + semente * 10) % 3)) * (1 + 0.06 * Math.sin(t * 1.6 + i));
        return (
          <mesh key={i} geometry={G_CHAMA} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[bal, 0, bal * 0.7]} scale={[0.55, alt, 0.55]}>
            <meshStandardMaterial color={cores[i % 3]} emissive={cores[i % 3]} emissiveIntensity={1.1} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Fumaça: bolas que sobem e se abrem, em laço (posição pelo tempo, opacidade suave) ----------
const G_BOLA = new THREE.SphereGeometry(1, 18, 14);
export const ColunaFumaca: React.FC<{tema: Tema; pos: V3; k: number; t: number; alt?: number; tam?: number; escura?: number; vento?: V3}> = ({tema, pos, k, t, alt = 3, tam = 0.35, escura = 0, vento = [0, 0, 0]}) => {
  if (k < 0.02) return null;
  const cor = mistura(mistura(tema.corpo, tema.objetoClaro, 0.25), tema.objetoEscuro, escura);
  const N = 9;
  return (
    <>
      {Array.from({length: N}).map((_, i) => {
        const u = (((t * 0.22 + i / N) % 1) + 1) % 1;
        const sobe = u * alt * k;
        const r = tam * (0.5 + 1.3 * u);
        const op = 0.55 * Math.sin(Math.PI * u) * k;
        if (op < 0.01) return null;
        return (
          <mesh key={i} geometry={G_BOLA} position={[pos[0] + vento[0] * u + Math.sin(i * 2.1) * 0.15, pos[1] + sobe, pos[2] + vento[2] * u + Math.cos(i * 1.3) * 0.15]} scale={r}>
            <meshStandardMaterial color={cor} roughness={1} transparent opacity={op} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

// Névoa: bolas grandes paradas (respiram devagar). Usada no céu cinza e na nuvem de 2024.
export const Nevoa: React.FC<{tema: Tema; bolas: {p: V3; r: number; o: number}[]; t: number; escura?: number}> = ({tema, bolas, t, escura = 0}) => {
  const cor = mistura(mistura(tema.corpo, tema.objetoClaro, 0.2), tema.objetoEscuro, escura);
  return (
    <>
      {bolas.map((b, i) =>
        b.o < 0.01 || b.r < 0.01 ? null : (
          <mesh key={i} geometry={G_BOLA} position={b.p} scale={[b.r * (1 + 0.04 * Math.sin(t * 0.8 + i)), b.r * 0.55, b.r]}>
            <meshStandardMaterial color={cor} roughness={1} transparent opacity={b.o} depthWrite={false} />
          </mesh>
        ),
      )}
    </>
  );
};

// ---------- Rio voador: gotinhas andando por uma curva; `cinza` avança do começo para o fim da curva ----------
const G_GOTA = new THREE.SphereGeometry(1, 10, 8);
export const RioVoador: React.FC<{tema: Tema; curva: THREE.CatmullRomCurve3; k: number; t: number; cinza: number; n?: number; larg?: number}> = ({tema, curva, k, t, cinza, n = 150, larg = 0.45}) => {
  const F = festa(tema);
  const m = useMemo(() => new THREE.Object3D(), []);
  const c = useMemo(() => new THREE.Color(), []);
  if (k < 0.02) return null;
  const azul = new THREE.Color(mistura(F.azul, F.turquesa, 0.35));
  const cinzaC = new THREE.Color(mistura(tema.corpo, tema.objetoEscuro, 0.25));
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    for (let i = 0; i < n; i++) {
      const fase = (i * 0.61803) % 1;
      const u = (((t * 0.07 + i / n) % 1) + 1) % 1;
      const vis = u <= k ? 1 : 0;
      const p = curva.getPointAt(u);
      const lado = (fase - 0.5) * larg * 2;
      const alt = Math.sin(i * 1.7) * larg * 0.5;
      m.position.set(p.x + lado, p.y + alt, p.z + lado * 0.6);
      const ponta = Math.min(1, (k - u) * 12);
      m.scale.setScalar(0.1 * vis * Math.max(0, ponta) * (0.8 + 0.4 * fase));
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
      const q = Math.max(0, Math.min(1, (cinza * 1.3 - u) * 4));
      c.copy(azul).lerp(cinzaC, q);
      mesh.setColorAt(i, c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <instancedMesh ref={preparar} args={[G_GOTA, undefined, n]}>
      <meshStandardMaterial color="#FFFFFF" emissive={mistura(F.azul, tema.fundo, 0.6)} emissiveIntensity={0.3 * (1 - cinza)} roughness={0.5} />
    </instancedMesh>
  );
};

// ---------- Setas de vento ao longo da mesma curva ----------
export const SetasVento: React.FC<{tema: Tema; curva: THREE.CatmullRomCurve3; k: number; t: number; anda: number; n?: number; acima?: number}> = ({tema, curva, k, t, anda, n = 6, acima = 1.1}) => {
  if (k < 0.02) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const u = (((i / n + anda * t * 0.06) % 1) + 1) % 1;
        const op = Math.sin(Math.PI * u) * k;
        if (op < 0.02) return null;
        const p = curva.getPointAt(u);
        const tg = curva.getTangentAt(u);
        const rot = Math.atan2(tg.x, tg.z);
        return (
          <group key={i} position={[p.x, p.y + acima, p.z]} rotation={[0, rot, 0]} scale={1.7 * (0.9 * op + 0.1)}>
            <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
              <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.35} transparent opacity={op} />
            </mesh>
            <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.15, 0.3, 12]} />
              <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.35} transparent opacity={op} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// ---------- Nuvem com chuva (gotas azuis ou pretas, ou fumacinha) ----------
export const NuvemChuva: React.FC<{tema: Tema; pos: V3; k: number; t: number; cor: string; chuva: number; corGota: string; tam?: number; queda?: number}> = ({tema, pos, k, t, cor, chuva, corGota, tam = 1, queda = 2.2}) => {
  if (k < 0.02) return null;
  const bolas: [number, number, number, number][] = [
    [0, 0, 0, 0.55],
    [0.5, -0.08, 0.1, 0.42],
    [-0.5, -0.1, -0.05, 0.45],
    [0.15, 0.25, -0.1, 0.4],
    [-0.2, 0.05, 0.3, 0.38],
  ];
  return (
    <group position={pos} scale={tam * k}>
      {bolas.map(([x, y, z, r], i) => (
        <mesh key={i} geometry={G_BOLA} position={[x, y + 0.03 * Math.sin(t * 1.2 + i), z]} scale={r} castShadow>
          <Fosco cor={cor} />
        </mesh>
      ))}
      {chuva > 0.02
        ? Array.from({length: 10}).map((_, i) => {
            const u = (((t * 1.1 + i * 0.37) % 1) + 1) % 1;
            return (
              <mesh key={`g${i}`} geometry={G_GOTA} position={[((i * 0.29) % 1) * 1.2 - 0.6, -0.35 - u * queda, ((i * 0.53) % 1) * 0.6 - 0.3]} scale={[0.035, 0.07, 0.035].map((s) => s * chuva * Math.sin(Math.PI * Math.min(1, u * 1.15))) as V3}>
                <meshStandardMaterial color={corGota} roughness={0.4} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

// ---------- Ruazinha em miniatura (fica em cima de São Paulo) ----------
// Medidas em "tamanho de boneco" (boneco ≈ 1,95). O grupo é encolhido pela `escala`.
export const Ruazinha: React.FC<{tema: Tema; pos: V3; escala: number; porta: number; luz?: number; children?: React.ReactNode}> = ({tema, pos, escala, porta, luz = 0, children}) => {
  const F = festa(tema);
  return (
    <group position={pos} scale={escala}>
      {/* Base (quarteirão), rua e calçada */}
      <Caixa args={[9, 0.2, 7]} raio={0.06} cor={mistura(tema.objetoEscuro, tema.chao, 0.3)} position={[0, 0.1, 0]} />
      <Caixa args={[9, 0.08, 2.2]} raio={0.03} cor={mistura(tema.chao, tema.objetoEscuro, 0.4)} position={[0, 0.24, 2.0]} />
      {[-3, -1, 1, 3].map((x) => (
        <Caixa key={x} args={[0.9, 0.04, 0.14]} raio={0.015} cor={mistura(tema.objetoClaro, F.loiro, 0.3)} position={[x, 0.3, 2.0]} sombra={false} />
      ))}
      <Caixa args={[9, 0.14, 1.4]} raio={0.03} cor={mistura(tema.objeto, tema.objetoEscuro, 0.45)} position={[0, 0.27, 0.3]} />
      {/* Casa do amigo */}
      <group position={[-0.6, 0.34, -1.6]}>
        <Caixa args={[3.2, 2.6, 2.4]} raio={0.06} cor={mistura(F.dourado, tema.objeto, 0.55)} position={[0, 1.3, 0]} />
        <mesh position={[0, 3.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.45, 1.0, 4]} />
          <Fosco cor={mistura(tema.acento, tema.objetoEscuro, 0.35)} />
        </mesh>
        {/* Porta (abre girando na dobradiça da esquerda) */}
        <Caixa args={[0.95, 1.85, 0.06]} raio={0.02} cor={mistura(tema.objetoEscuro, '#000000', 0.4)} position={[0.4, 0.93, 1.215]} sombra={false} />
        <group position={[-0.075, 0, 1.25]} rotation={[0, -1.5 * porta, 0]}>
          <Caixa args={[0.95, 1.85, 0.08]} raio={0.02} cor={mistura(F.azul, tema.objetoEscuro, 0.35)} position={[0.475, 0.93, 0]} />
        </group>
        {/* Janelas */}
        {[-1.0].map((x) => (
          <Caixa key={x} args={[0.8, 0.7, 0.06]} raio={0.02} cor={mistura(tema.objetoClaro, F.loiro, 0.5)} emissivo={0.15 + 0.8 * luz} position={[x, 1.6, 1.215]} sombra={false} />
        ))}
      </group>
      {/* Casa do vizinho */}
      <group position={[3.0, 0.34, -1.9]}>
        <Caixa args={[2.2, 2.0, 2.0]} raio={0.06} cor={mistura(F.turquesa, tema.objeto, 0.6)} position={[0, 1.0, 0]} />
        <Caixa args={[2.4, 0.2, 2.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 2.1, 0]} />
        <Caixa args={[0.7, 0.6, 0.06]} raio={0.02} cor={mistura(tema.objetoClaro, F.loiro, 0.5)} emissivo={0.15 + 0.8 * luz} position={[0, 1.2, 1.02]} sombra={false} />
      </group>
      <Arvore tema={tema} pos={[-3.6, 0.34, -0.6]} escala={1.2} />
      <Poste tema={tema} pos={[1.6, 0.34, 0.8]} luz={0.3 + luz} />
      {children}
    </group>
  );
};
export const RUA_PORTA: V3 = [-0.6 + 0.4, 0.34, -1.6 + 1.6]; // na frente da porta (coordenadas da ruazinha)

// ---------- Balde (chuva preta) ----------
export const Balde: React.FC<{tema: Tema; pos: V3; escala: number; nivel: number}> = ({tema, pos, escala, nivel}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.28, 0.6, 24, 1, true]} />
        <meshStandardMaterial color={tema.objeto} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 24]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      {nivel > 0.02 ? (
        <mesh position={[0, 0.03 + 0.25 * nivel, 0]}>
          <cylinderGeometry args={[0.28 + 0.07 * nivel, 0.28, 0.5 * nivel, 24]} />
          <meshStandardMaterial color="#0B0B0D" roughness={0.2} />
        </mesh>
      ) : null}
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.37, 0.02, 8, 30, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );

// ---------- Prediozinho com janelas que acendem ----------
export const Prediozinho: React.FC<{tema: Tema; pos: V3; alt: number; larg?: number; luz: number; cor?: string}> = ({tema, pos, alt, larg = 0.5, luz, cor}) => {
  const F = festa(tema);
  const andares = Math.max(2, Math.round(alt / 0.22));
  return (
    <group position={pos}>
      <Caixa args={[larg, alt, larg]} raio={0.03} cor={cor ?? mistura(tema.objeto, tema.objetoEscuro, 0.5)} position={[0, alt / 2, 0]} />
      {Array.from({length: andares - 1}).map((_, i) => (
        <Caixa key={i} args={[larg * 0.7, 0.07, 0.04]} raio={0.015} cor={mistura(tema.objetoEscuro, F.loiro, luz)} emissivo={0.9 * luz} position={[0, 0.2 + i * (alt - 0.25) / (andares - 1), larg / 2 + 0.03]} sombra={false} />
      ))}
    </group>
  );
};

// ---------- Placar 3D com duas colunas (942 × 3.726) ----------
export const Colunas: React.FC<{tema: Tema; pos: V3; rotY?: number; a: number; b: number; altMax: number; corA: string; corB: string; brilhoB?: number}> = ({tema, pos, rotY = 0, a, b, altMax, corA, corB, brilhoB = 0}) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Caixa args={[2.2, 0.12, 1.0]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
    {a > 0.005 ? <Caixa args={[0.7, altMax * a, 0.7]} raio={0.06} cor={corA} position={[-0.5, 0.12 + (altMax * a) / 2, 0]} /> : null}
    {b > 0.005 ? <Caixa args={[0.7, altMax * b, 0.7]} raio={0.06} cor={corB} emissivo={0.15 + 0.4 * brilhoB} position={[0.5, 0.12 + (altMax * b) / 2, 0]} /> : null}
  </group>
);

// ---------- Medidor de ar (arco verde → marsala com ponteiro) ----------
export const MedidorAr: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; valor: number}> = ({tema, pos, rotY = 0, escala, valor}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const cores = [F.verde, F.loiro, F.dourado, tema.acento];
  const ang = Math.PI * (1 - valor);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[2.6, 1.55, 0.16]} raio={0.08} cor={tema.objetoEscuro} position={[0, 0.72, -0.1]} />
      {cores.map((c, i) => (
        <mesh key={i} position={[0, 0.25, 0.02]} rotation={[0, 0, Math.PI - (i + 1) * (Math.PI / 4)]}>
          <torusGeometry args={[0.95, 0.12, 10, 24, Math.PI / 4 - 0.03]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} roughness={0.6} />
        </mesh>
      ))}
      <group position={[0, 0.25, 0.1]} rotation={[0, 0, ang - Math.PI / 2]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.06, 0.84, 0.05]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
      </group>
      <mesh position={[0, 0.25, 0.12]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );
};

// ---------- Pulmão (dois lobos + traqueia); `cinza` escurece as bordas ----------
export const Pulmao: React.FC<{tema: Tema; pos: V3; escala: number; cinza: number; t: number}> = ({tema, pos, escala, cinza, t}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const rosa = mistura(F.rosa, tema.objetoClaro, 0.35);
  const cor = mistura(rosa, mistura(tema.corpo, tema.objetoEscuro, 0.4), cinza * 0.7);
  const resp = 1 + 0.035 * Math.sin(t * 2.0);
  return (
    <group position={pos} scale={escala}>
      {/* Traqueia */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.9, 16]} />
        <Fosco cor={mistura(rosa, tema.objetoClaro, 0.4)} />
      </mesh>
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0.2 * l, 1.42, 0]} rotation={[0, 0, 0.7 * l]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.5, 12]} />
          <Fosco cor={mistura(rosa, tema.objetoClaro, 0.4)} />
        </mesh>
      ))}
      {/* Lobos */}
      {[-1, 1].map((l) => (
        <group key={`l${l}`} position={[0.62 * l, 0.95, 0]} scale={[resp, resp, resp]}>
          <mesh scale={[0.5, 0.85, 0.42]} castShadow>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color={cor} roughness={0.75} />
          </mesh>
          <mesh position={[0.08 * l, -0.35, 0.05]} scale={[0.46, 0.5, 0.4]} castShadow>
            <sphereGeometry args={[1, 28, 20]} />
            <meshStandardMaterial color={mistura(cor, tema.objetoEscuro, 0.08 + 0.3 * cinza)} roughness={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
// Topo da traqueia (onde a máscara encaixa), em coordenadas do pulmão
export const BOCA_PULMAO: V3 = [0, 2.45, 0];

// ---------- Máscara PFF2 (concha com dobra no meio e elásticos) ----------
export const MascaraPFF2: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) => {
  if (escala < 0.02) return null;
  const branca = mistura(tema.objetoClaro, tema.objeto, 0.3);
  return (
    <group position={pos} scale={escala}>
      {/* Concha virada para +z */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.55, 0.32, 0.42]} castShadow>
        <sphereGeometry args={[1, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={branca} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Dobra do meio */}
      <mesh position={[0, 0, 0.16]} rotation={[0, Math.PI / 2, 0]} scale={[0.32, 0.42, 1]}>
        <torusGeometry args={[1, 0.03, 8, 40, Math.PI]} />
        <Fosco cor={mistura(branca, tema.objetoEscuro, 0.15)} />
      </mesh>
      <mesh scale={[0.55, 0.42, 1]}>
        <torusGeometry args={[1, 0.035, 8, 40]} />
        <Fosco cor={mistura(branca, tema.objetoEscuro, 0.2)} />
      </mesh>
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0.55 * l, 0, -0.22]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.28, 0.02, 6, 24]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Fósforo gigante (chama estável) ----------
export const Fosforo: React.FC<{tema: Tema; pos: V3; escala: number; fogo: number; t: number; rotZ?: number}> = ({tema, pos, escala, fogo, t, rotZ = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala} rotation={[0, 0, rotZ]}>
      <Caixa args={[0.12, 1.6, 0.12]} raio={0.03} cor={mistura(tema.areia, tema.objetoClaro, 0.3)} position={[0, 0.8, 0]} />
      <mesh position={[0, 1.68, 0]} scale={[1, 1.3, 1]} castShadow>
        <sphereGeometry args={[0.11, 18, 14]} />
        <Fosco cor={tema.acento} />
      </mesh>
      <Chamas tema={tema} pos={[0, 1.7, 0]} k={fogo} t={t} tam={0.11} n={3} semente={2} />
    </group>
  );

// ---------- Boneco do "amigo do amigo" (de casaco dourado) ----------
export const Amigo: React.FC<{tema: Tema; pos: V3; rotY?: number; pose?: Pose; escala: number}> = ({tema, pos, rotY = 0, pose, escala}) => {
  const F = festa(tema);
  return <Boneco tema={tema} pos={pos} rotY={rotY} pose={pose} escala={escala} cor={mistura(tema.corpo, F.dourado, 0.45)} />;
};
