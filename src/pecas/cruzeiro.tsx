import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Boneco, Caixa, Fosco, Placa, type Pose, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';
import {Quepe} from './oitohoras';

// Peças: Leis no cruzeiro: o mar visto como um mapa vivo. Praia à esquerda (−x), mar para a direita (+x),
// linha de boias das 12 milhas em x = 14. Água em y 0,04; faixas coloridas em 0,075; espuma em 0,1+.

export const AGUA_Y = 0.04;
export const LINHA_X = 14;
export const BEIRA_X = -8;
const ESPUMA_Y = 0.11;

// ---------- Mar: plano escuro próprio + faixa do mar territorial + alto-mar + cristas que andam ----------
const G_CRISTA = new THREE.BoxGeometry(1, 1, 1);
export const MarZonas: React.FC<{tema: Tema; t: number; territorial: number; alto: number}> = ({tema, t, territorial, alto}) => {
  const F = festa(tema);
  // mistura() é linear: só cores escuras sobre a água, senão o mar clareia de longe
  const agua = mistura(tema.fundo, F.azulNoite, 0.55);
  const ter = mistura(agua, mistura(F.verde, F.loiro, 0.35), 0.16 * territorial);
  const alt = mistura(agua, mistura(F.azulNoite, tema.fundo, 0.35), alto);
  const crista = mistura(agua, tema.objeto, 0.14);
  const cristas = useMemo(() => {
    let k = 11;
    const rnd = () => {
      k = (k * 16807) % 2147483647;
      return (k % 10000) / 10000;
    };
    return Array.from({length: 240}, () => ({x: -8 + rnd() * 70, z: -30 + rnd() * 60, f: rnd() * 6, l: 0.5 + rnd() * 0.8}));
  }, []);
  const m = useMemo(() => new THREE.Object3D(), []);
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    cristas.forEach((c, i) => {
      const x = -8 + ((c.x + 8 + t * 0.25) % 70);
      const vida = Math.sin(t * 0.7 + c.f) * 0.5 + 0.5;
      m.position.set(x, ESPUMA_Y - 0.02, c.z);
      m.scale.set(c.l * (0.4 + 0.6 * vida), 0.02, 0.07);
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return (
    <group>
      <mesh position={[26, AGUA_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[68, 60]} />
        <meshStandardMaterial color={agua} roughness={0.96} metalness={0} envMapIntensity={0.06} />
      </mesh>
      {territorial > 0.01 ? (
        <mesh position={[(BEIRA_X + LINHA_X) / 2, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[LINHA_X - BEIRA_X, 60]} />
          <meshStandardMaterial color={ter} roughness={0.96} envMapIntensity={0.06} />
        </mesh>
      ) : null}
      {alto > 0.01 ? (
        <mesh position={[(LINHA_X + 60) / 2, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60 - LINHA_X, 60]} />
          <meshStandardMaterial color={alt} roughness={0.96} envMapIntensity={0.06} />
        </mesh>
      ) : null}
      <instancedMesh ref={preparar} args={[G_CRISTA, undefined, cristas.length]}>
        <meshStandardMaterial color={crista} roughness={0.9} />
      </instancedMesh>
    </group>
  );
};

// ---------- Esteira: rastro de espuma em V atrás do navio + ondinhas na proa ----------
// `popa`: ponto da popa (mundo), `proa`: ponto da proa; `k`: velocidade (0 parado, 1 navegando rápido).
const G_BOLHA = new THREE.CircleGeometry(1, 20);
export const Esteira: React.FC<{tema: Tema; popa: V3; proa: V3; larg: number; k: number; t: number; comp?: number}> = ({tema, popa, proa, larg, k, t, comp = 9}) => {
  if (k < 0.02) return null;
  const n = 16;
  const dx = popa[0] - proa[0];
  const dz = popa[2] - proa[2];
  const L = Math.hypot(dx, dz) || 1;
  const ux = dx / L;
  const uz = dz / L;
  const cor = mistura(tema.objeto, tema.fundo, 0.25);
  const bolhas: {p: V3; r: number; o: number}[] = [];
  const L2 = comp * (0.5 + 0.5 * k);
  for (let i = 0; i < n; i++) {
    const u = ((i + ((t * 1.6 * (0.4 + k)) % 1)) / n) * L2;
    const fade = 1 - u / L2;
    const abre = larg * (0.42 + (u / L2) * 0.55);
    const px = popa[0] + ux * u;
    const pz = popa[2] + uz * u;
    // dois braços do V e o redemoinho do meio
    const r = larg * (0.07 + 0.03 * (u / L2));
    bolhas.push({p: [px - uz * abre, ESPUMA_Y, pz + ux * abre], r, o: 0.5 * fade * k});
    bolhas.push({p: [px + uz * abre, ESPUMA_Y, pz - ux * abre], r, o: 0.5 * fade * k});
    bolhas.push({p: [px + Math.sin(i * 2.1 + t) * 0.06 * larg, ESPUMA_Y + 0.005, pz + Math.cos(i * 1.7 + t) * 0.06 * larg], r: larg * (0.11 + 0.05 * (u / L2)), o: 0.3 * fade * k});
  }
  // ondinhas da proa
  for (const l of [-1, 1]) {
    for (let j = 0; j < 3; j++) {
      const s2 = ((t * 1.2 + j / 3) % 1) * 0.6 * larg;
      bolhas.push({p: [proa[0] + ux * s2 - uz * l * (0.3 * larg + s2 * 0.5), ESPUMA_Y, proa[2] + uz * s2 + ux * l * (0.3 * larg + s2 * 0.5)], r: 0.06 * larg + s2 * 0.06, o: 0.45 * k * (1 - s2 / (0.6 * larg))});
    }
  }
  return (
    <>
      {bolhas.map((b, i) => (
        <mesh key={i} geometry={G_BOLHA} position={b.p} rotation={[-Math.PI / 2, 0, 0]} scale={[b.r * 1.5, b.r, 1]}>
          <meshBasicMaterial color={cor} transparent opacity={b.o} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
};

// ---------- Bandeiras (cores simples do país + nome escrito na interface; sem brasão) ----------
export type Pais = 'brasil' | 'italia' | 'malta' | 'panama' | 'navio' | 'duvida';
const FW = 0.6;
const FH = 0.4;
export const Pano: React.FC<{tema: Tema; pais: Pais; t: number; brilho?: number}> = ({tema, pais, t, brilho = 0}) => {
  const F = festa(tema);
  const branco = tema.objetoClaro;
  const vermelho = mistura(tema.acento, F.rosa, 0.15);
  // Base fina (0,01) e desenhos mais grossos (0,035): as faces ficam a 0,0125 uma da outra, sem briga
  const faixa = (x: number, y: number, w: number, h: number, cor: string, key: string, rz = 0) => (
    <Caixa key={key} args={[w, h, 0.035]} raio={0.004} cor={cor} sombra={false} position={[x, y, 0]} rotation={[0, 0, rz]} />
  );
  let fundo = branco;
  let partes: React.ReactNode[] = [];
  if (pais === 'brasil') {
    fundo = F.verde;
    partes = [
      <group key="r" scale={[1.45, 1, 1]}>
        {faixa(0, 0, 0.22, 0.22, F.loiro, 'l', Math.PI / 4)}
      </group>,
      <mesh key="c" rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.05, 24]} />
        <Fosco cor={F.azul} />
      </mesh>,
    ];
  }
  if (pais === 'italia') partes = [faixa(-FW / 3, 0, FW / 3, FH, F.verde, 'v'), faixa(FW / 3, 0, FW / 3, FH, vermelho, 'r')];
  if (pais === 'malta') partes = [faixa(FW / 4, 0, FW / 2, FH, vermelho, 'r')];
  if (pais === 'panama')
    partes = [faixa(FW / 4, FH / 4, FW / 2, FH / 2, vermelho, 'r'), faixa(-FW / 4, -FH / 4, FW / 2, FH / 2, F.azul, 'a'), faixa(-FW / 4, FH / 4, 0.07, 0.07, F.azul, 'e1'), faixa(FW / 4, -FH / 4, 0.07, 0.07, vermelho, 'e2')];
  if (pais === 'navio') {
    fundo = F.azul;
    partes = [
      <mesh key="c" rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.05, 24]} />
        <Fosco cor={branco} />
      </mesh>,
    ];
  }
  if (pais === 'duvida') fundo = tema.corpo;
  return (
    <group rotation={[0, 0.25 * Math.sin(t * 2.3), 0.05 * Math.sin(t * 3.1)]}>
      <group position={[FW / 2 + 0.03, 0, 0]}>
        <Caixa args={[FW, FH, 0.012]} raio={0.004} cor={fundo} emissivo={0.25 * brilho} />
        {partes}
        {pais === 'duvida' ? (
          <>
            <Placa tema={tema} pos={[0, 0, 0.012]} larg={FW * 0.7} alt={FH * 0.8} linhas={[{t: '?', tam: 360, cor: tema.objetoClaro, peso: 900}]} fundo={tema.corpo} />
            <Placa tema={tema} pos={[0, 0, -0.012]} rot={[0, Math.PI, 0]} larg={FW * 0.7} alt={FH * 0.8} linhas={[{t: '?', tam: 360, cor: tema.objetoClaro, peso: 900}]} fundo={tema.corpo} />
          </>
        ) : null}
      </group>
    </group>
  );
};

// Mastro com uma bandeira que sobe (k 0 → embaixo, escondida; 1 → no topo)
export const Mastro: React.FC<{tema: Tema; pos: V3; alt: number; pais: Pais; k: number; t: number; escala?: number; brilho?: number}> = ({tema, pos, alt, pais, k, t, escala = 1, brilho = 0}) => (
  <group position={pos} scale={escala}>
    <mesh position={[0, alt / 2, 0]} castShadow>
      <cylinderGeometry args={[0.022, 0.028, alt, 10]} />
      <Fosco cor={tema.objeto} />
    </mesh>
    <mesh position={[0, alt + 0.03, 0]}>
      <sphereGeometry args={[0.04, 12, 10]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
    {k > 0.02 ? (
      <group position={[0, alt * 0.3 + (alt * 0.7 - FH / 2) * k, 0]} scale={Math.min(1, k * 3)}>
        <Pano tema={tema} pais={pais} t={t} brilho={brilho} />
      </group>
    ) : null}
  </group>
);

// Bandeirinha solta, girando (o "qual lei vale?")
export const BandeiraGira: React.FC<{tema: Tema; pos: V3; pais: Pais; k: number; t: number}> = ({tema, pos, pais, k, t}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k} rotation={[0, t * 1.4, 0]}>
      <Mastro tema={tema} pos={[0, 0, 0]} alt={0.9} pais={pais} k={1} t={t} />
    </group>
  );

// ---------- Navio de cruzeiro (proa em +x local; linha d'água em y 0) ----------
// Comprimento ~9,2, boca 2. Conveses: D1 (cassino) 1,1–1,8; D2 (cabines) 1,8–2,5; D3 (piscina e ponte) a partir de 2,5.
// Gente a bordo: Boneco com escala 0,3 (≈ 0,58 de altura).
// O casco vai até y 1,14 (extrusão 1,1 + chanfro): o piso do D1 começa em 1,16 para não brigar com ele.
export const NAVIO = {comp: 9.2, larg: 2, popa: -4.6, proa: 4.6, D1: 1.16, D2: 1.86, D3: 2.56, ESC_GENTE: 0.3};
const G_CASCO = (() => {
  const s = new THREE.Shape();
  s.moveTo(-4.3, -1);
  s.lineTo(2.0, -1);
  s.quadraticCurveTo(3.9, -0.95, 4.6, 0);
  s.quadraticCurveTo(3.9, 0.95, 2.0, 1);
  s.lineTo(-4.3, 1);
  s.quadraticCurveTo(-4.6, 1, -4.6, 0.7);
  s.lineTo(-4.6, -0.7);
  s.quadraticCurveTo(-4.6, -1, -4.3, -1);
  const g = new THREE.ExtrudeGeometry(s, {depth: 1.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 16});
  g.rotateX(-Math.PI / 2);
  return g;
})();
const G_JANELA = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12);
G_JANELA.rotateX(Math.PI / 2);

// Uma parede comprida com faixa de janelas (vidro escuro + molduras), usada nos lados do navio
const ParedeJanelas: React.FC<{tema: Tema; x0: number; x1: number; y0: number; alt: number; z: number; lado: 1 | -1; luz?: number}> = ({tema, x0, x1, y0, alt, z, lado, luz = 0}) => {
  const F = festa(tema);
  const L = x1 - x0;
  const n = Math.floor(L / 0.32);
  return (
    <group>
      <Caixa args={[L, alt, 0.05]} raio={0.02} cor={tema.objeto} position={[(x0 + x1) / 2, y0 + alt / 2, z]} />
      <Caixa args={[L - 0.12, alt * 0.42, 0.08]} raio={0.02} cor={mistura(F.azulNoite, F.loiro, 0.25 * luz)} emissivo={0.5 * luz} sombra={false} position={[(x0 + x1) / 2, y0 + alt * 0.55, z]} />
      {Array.from({length: n}).map((_, i) => (
        <Caixa key={i} args={[0.035, alt * 0.44, 0.1]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[x0 + 0.16 + i * (L / n), y0 + alt * 0.55, z + 0.005 * lado]} />
      ))}
    </group>
  );
};

// Encolhe a parede em direção ao teto do convés (fica só uma tirinha enrolada lá em cima)
const Persiana: React.FC<{topo: number; abre: number; children: React.ReactNode}> = ({topo, abre, children}) => (
  <group position={[0, topo, 0]} scale={[1, 1 - 0.94 * abre, 1]}>
    <group position={[0, -topo, 0]}>{children}</group>
  </group>
);

export type Bordo = {
  abre?: number; // parede do lado +z dos conveses D1 e D2 (0 fechada, 1 aberta)
  luzCassino?: number; // 0 apagado, 1 aceso
  fechado?: boolean; // placa FECHADO × ABERTO
  cadeado?: number; // 0 aberto, 1 fechado
  roleta?: number; // ângulo da roleta
  dados?: number; // 0..1 dados rolando até parar na mesa
  fichas?: number; // 0..1 pilhas de fichas crescendo
  comandante?: number; // 0..1 vira do timão para a câmera
  autoridade?: number; // brilho das divisas
  porta?: number; // porta da cabine 204: 1 aberta, 0 fechada
  passageiro?: number; // 0..1: caminha do corredor até dentro da cabine
  alerta?: number;
  outros?: number; // 3 passageiros no corredor
  amigos?: number; // os dois amigos no convés da piscina
  pais?: Pais; // bandeira própria (popa e mastro)
  brasilMastro?: number; // bandeira de cortesia do Brasil no mastro
  proprioMastro?: number; // bandeira própria no mastro
  popa?: number; // bandeira da popa
  brilhoMastro?: number;
  nome?: boolean; // nome "MAR ABERTO" no casco
};

export const NavioCruzeiro: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; t: number; b?: Bordo; interior?: boolean}> = ({tema, pos, rotY = 0, escala = 1, t, b = {}, interior}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const {D1, D2, D3, ESC_GENTE} = NAVIO;
  const abre = b.abre ?? 0;
  const luz = b.luzCassino ?? 0;
  const casco = tema.objeto;
  const faixa = F.azulNoite;
  const piso = mistura(tema.objetoEscuro, tema.fundo, 0.2);
  const mostraDentro = interior && abre > 0.02;
  return (
    <group position={[pos[0], pos[1] + 0.03 * Math.sin(t * 1.3), pos[2]]} rotation={[0.012 * Math.sin(t * 1.1), rotY, 0.018 * Math.sin(t * 0.9)]} scale={escala}>
      {/* Casco branco-acinzentado com faixa escura na linha d'água e vigias */}
      <mesh geometry={G_CASCO} castShadow receiveShadow>
        <Fosco cor={casco} />
      </mesh>
      <mesh geometry={G_CASCO} scale={[1.012, 0.3, 1.03]} position={[0, -0.02, 0]}>
        <Fosco cor={faixa} />
      </mesh>
      {[-1, 1].map((l) =>
        Array.from({length: 18}).map((_, i) => (
          <mesh key={`${l}${i}`} geometry={G_JANELA} position={[-3.9 + i * 0.36, 0.72, l * 1.06]}>
            <meshStandardMaterial color={mistura(F.azulNoite, F.loiro, 0.3)} emissive={F.loiro} emissiveIntensity={0.12} roughness={0.4} />
          </mesh>
        )),
      )}
      {b.nome !== false ? <Placa tema={tema} pos={[1.2, 0.5, 1.065]} larg={1.5} alt={0.24} linhas={[{t: 'MAR ABERTO', tam: 150, cor: F.azulNoite, peso: 900}]} fundo={casco} /> : null}

      {/* ===== D1: cassino ===== */}
      <Caixa args={[5.4, 0.06, 1.8]} raio={0.02} cor={piso} position={[-1.0, D1 + 0.03, 0]} />
      <ParedeJanelas tema={tema} x0={-3.7} x1={1.7} y0={D1 + 0.06} alt={0.64} z={-0.88} lado={-1} />
      <Caixa args={[0.06, 0.7, 1.8]} raio={0.02} cor={tema.objeto} position={[-3.7, D1 + 0.38, 0]} />
      <Caixa args={[0.06, 0.7, 1.8]} raio={0.02} cor={tema.objeto} position={[1.7, D1 + 0.38, 0]} />
      {/* Parede do lado +z: enrola para cima como uma persiana (o corte que mostra o cassino) */}
      <Persiana topo={D2} abre={abre}>
        <ParedeJanelas tema={tema} x0={-3.7} x1={1.7} y0={D1 + 0.06} alt={0.64} z={0.88} lado={1} luz={0.3 * luz} />
      </Persiana>

      {/* ===== D2: cabines ===== */}
      <Caixa args={[5.0, 0.06, 1.8]} raio={0.02} cor={piso} position={[-0.8, D2 + 0.03, 0]} />
      <Caixa args={[0.06, 0.7, 1.8]} raio={0.02} cor={tema.objeto} position={[-3.3, D2 + 0.38, 0]} />
      <Caixa args={[0.06, 0.7, 1.8]} raio={0.02} cor={tema.objeto} position={[1.7, D2 + 0.38, 0]} />
      <ParedeJanelas tema={tema} x0={-3.3} x1={1.7} y0={D2 + 0.06} alt={0.64} z={-0.88} lado={-1} />
      <Persiana topo={D3} abre={abre}>
        <ParedeJanelas tema={tema} x0={-3.3} x1={1.7} y0={D2 + 0.06} alt={0.64} z={0.88} lado={1} />
      </Persiana>
      {/* Botes salva-vidas do lado −z */}
      {[-2.6, -1.6, -0.6, 0.4].map((x) => (
        <mesh key={x} position={[x, D2 + 0.25, -1.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 6, 12]} />
          <Fosco cor={F.dourado} />
        </mesh>
      ))}

      {/* ===== D3: piscina, tobogã, ponte e chaminé ===== */}
      <Caixa args={[5.2, 0.08, 1.9]} raio={0.03} cor={tema.objeto} position={[-0.8, D3 + 0.04, 0]} />
      <Caixa args={[1.5, 0.06, 0.8]} raio={0.03} cor={mistura(F.turquesa, F.azulNoite, 0.35)} emissivo={0.12} sombra={false} position={[-1.2, D3 + 0.1, 0.2]} />
      {[-0.4, -0.15].map((z, i) => (
        <mesh key={i} position={[-2.3, D3 + 0.55, z]} rotation={[0, 0, 0.3 + i * 0.6]}>
          <torusGeometry args={[0.32, 0.05, 10, 24, Math.PI * 1.3]} />
          <Fosco cor={i ? F.rosa : F.roxo} />
        </mesh>
      ))}
      {/* Espreguiçadeiras */}
      {[-0.4, 0.0].map((x) => (
        <Caixa key={x} args={[0.14, 0.04, 0.34]} raio={0.015} cor={tema.objetoClaro} position={[x, D3 + 0.12, 0.55]} rotation={[0.15, 0, 0]} />
      ))}
      {/* Chaminé */}
      <Caixa args={[0.9, 1.1, 0.7]} raio={0.15} cor={tema.objetoClaro} position={[-3.0, D3 + 0.6, 0]} rotation={[0, 0, 0.12]} />
      <Caixa args={[0.93, 0.25, 0.73]} raio={0.1} cor={F.azulNoite} position={[-3.07, D3 + 1.05, 0]} rotation={[0, 0, 0.12]} />
      {/* Ponte de comando: aberta do lado +z (a "asa"), vidro na frente */}
      <group position={[1.1, D3, 0]}>
        <Caixa args={[1.3, 0.06, 1.9]} raio={0.02} cor={piso} position={[0, 0.11, 0]} />
        <Caixa args={[1.4, 0.07, 2.0]} raio={0.03} cor={tema.objetoClaro} position={[0, 0.78, 0]} />
        <Caixa args={[1.3, 0.62, 0.05]} raio={0.02} cor={tema.objeto} position={[0, 0.45, -0.92]} />
        <Caixa args={[0.06, 0.62, 1.9]} raio={0.02} cor={tema.objeto} position={[-0.62, 0.45, 0]} />
        <Caixa args={[0.05, 0.28, 1.8]} raio={0.02} cor={mistura(F.azulNoite, F.loiro, 0.2)} emissivo={0.25} sombra={false} position={[0.64, 0.55, 0]} />
        {[-0.85, 0.85].map((z) => (
          <Caixa key={z} args={[0.06, 0.62, 0.06]} raio={0.02} cor={tema.objeto} position={[0.62, 0.45, z]} />
        ))}
        {/* Painel e timão */}
        <Caixa args={[0.2, 0.22, 1.2]} raio={0.03} cor={tema.objetoEscuro} position={[0.42, 0.25, 0]} />
        <mesh position={[0.28, 0.42, 0.25]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 24]} />
          <Fosco cor={tema.areia} />
        </mesh>
        {interior ? (
          <Boneco
            tema={tema}
            pos={[0.05, 0.14, 0.25]}
            rotY={Math.PI / 2 - (Math.PI / 2) * (b.comandante ?? 0)}
            escala={ESC_GENTE}
            cor={tema.objetoClaro}
            pose={{ombroD: [-0.4 * (b.comandante ?? 0), 0, 0.1], cotoveloD: -0.6}}
          >
            <Quepe tema={tema} />
            {[-1, 1].map((l) => (
              <Caixa key={l} args={[0.14, 0.04, 0.16]} raio={0.015} cor={mistura(F.dourado, tema.acento, 0.0)} emissivo={0.2 + 0.9 * (b.autoridade ?? 0)} sombra={false} position={[0.3 * l, 1.6, 0]} />
            ))}
          </Boneco>
        ) : null}
      </group>
      {/* Mastro em cima da ponte (cortesia do Brasil + bandeira própria) e bandeira da popa */}
      <Mastro tema={tema} pos={[1.0, D3 + 0.82, -0.35]} alt={1.1} pais="brasil" k={b.brasilMastro ?? 0} t={t} />
      <Mastro tema={tema} pos={[1.0, D3 + 0.82, 0.35]} alt={1.1} pais={b.pais ?? 'navio'} k={b.proprioMastro ?? 0} t={t + 0.7} brilho={b.brilhoMastro ?? 0} />
      <Mastro tema={tema} pos={[-4.45, D1 + 0.02, 0]} alt={0.75} pais={b.pais ?? 'navio'} k={b.popa ?? 0} t={t + 1.4} escala={0.9} />

      {/* ===== Interior (só quando a parede está aberta) ===== */}
      {mostraDentro ? <Cassino tema={tema} b={b} /> : null}
      {mostraDentro ? <Cabines tema={tema} b={b} t={t} /> : null}
      {interior && (b.amigos ?? 0) > 0.02 ? (
        <>
          <Boneco tema={tema} pos={[0.1, D3 + 0.08, 0.35]} rotY={0.9} escala={ESC_GENTE * (b.amigos ?? 0)} cor={F.turquesa} pose={{ombroD: [-2.3, 0, 0.2], cotoveloD: -0.3}} />
          <Boneco tema={tema} pos={[0.45, D3 + 0.08, 0.6]} rotY={0.6} escala={ESC_GENTE * (b.amigos ?? 0)} cor={F.dourado} />
        </>
      ) : null}
    </group>
  );
};

// Cassino no D1 (x de −3,6 a 1,6)
const Cassino: React.FC<{tema: Tema; b: Bordo}> = ({tema, b}) => {
  const F = festa(tema);
  const {D1} = NAVIO;
  const luz = b.luzCassino ?? 0;
  const y = D1 + 0.06;
  const tapete = mistura(mistura(F.roxoEscuro, tema.acento, 0.25), tema.fundo, 0.2);
  const dados = b.dados ?? 0;
  const fichas = b.fichas ?? 0;
  return (
    <group>
      <Caixa args={[3.8, 0.02, 1.4]} raio={0.008} cor={tapete} sombra={false} position={[-1.6, y + 0.03, -0.05]} />
      {/* Luminárias do teto: acendem devagar */}
      {[-3.0, -2.0, -1.0, 0.0, 1.0].map((x) => (
        <Caixa key={x} args={[0.6, 0.03, 0.4]} raio={0.012} cor={mistura(tema.objetoEscuro, F.loiro, luz)} emissivo={1.3 * luz} sombra={false} position={[x, D1 + 0.66, -0.2]} />
      ))}
      <pointLight position={[-1.2, D1 + 0.55, 0.3]} color={F.loiro} intensity={9 * luz} distance={4} decay={2} />
      <pointLight position={[-2.8, D1 + 0.5, -0.2]} color={F.rosa} intensity={6 * luz} distance={2.5} decay={2} />
      <pointLight position={[0.4, D1 + 0.5, 0.2]} color={F.roxo} intensity={5 * luz} distance={2.5} decay={2} />
      {/* Caça-níqueis encostados no fundo */}
      {[-3.3, -2.9, -2.5, -2.1].map((x, i) => (
        <group key={x} position={[x, y, -0.62]}>
          <Caixa args={[0.3, 0.5, 0.26]} raio={0.04} cor={[F.roxo, F.rosa, F.azul, F.roxo][i]} position={[0, 0.25, 0]} />
          <Caixa args={[0.2, 0.14, 0.04]} raio={0.015} cor={mistura(tema.objetoEscuro, F.loiro, luz)} emissivo={0.9 * luz} sombra={false} position={[0, 0.34, 0.14]} />
          <mesh position={[0.18, 0.3, 0]} rotation={[0, 0, 0.25 - 0.4 * luz]}>
            <cylinderGeometry args={[0.012, 0.012, 0.2, 8]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
        </group>
      ))}
      {/* Roleta */}
      <group position={[-1.1, y, 0.1]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.34, 0.32, 28]} />
          <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.45)} />
        </mesh>
        <group position={[0, 0.34, 0]} rotation={[0, b.roleta ?? 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 28]} />
            <Fosco cor={mistura(F.verde, tema.objetoEscuro, 0.3)} />
          </mesh>
          {Array.from({length: 8}).map((_, i) => (
            <Caixa key={i} args={[0.22, 0.02, 0.05]} raio={0.008} cor={i % 2 ? tema.objetoEscuro : mistura(tema.acento, F.rosa, 0.2)} sombra={false} position={[Math.cos((i * Math.PI) / 4) * 0.13, 0.03, Math.sin((i * Math.PI) / 4) * 0.13]} rotation={[0, -(i * Math.PI) / 4, 0]} />
          ))}
          <mesh position={[0, 0.07, 0]}>
            <coneGeometry args={[0.04, 0.08, 12]} />
            <Fosco cor={F.dourado} />
          </mesh>
        </group>
      </group>
      {/* Mesa de cartas com dados e fichas */}
      <group position={[0.35, y, 0.0]}>
        <Caixa args={[0.9, 0.06, 0.6]} raio={0.03} cor={mistura(F.verde, tema.objetoEscuro, 0.25)} position={[0, 0.27, 0]} />
        <Caixa args={[0.1, 0.25, 0.1]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.12, 0]} />
        {dados > 0.02
          ? [0, 1].map((i) => {
              const u = Math.min(1, dados);
              return (
                <Caixa
                  key={i}
                  args={[0.07, 0.07, 0.07]}
                  raio={0.015}
                  cor={tema.objetoClaro}
                  position={[-0.15 + i * 0.14 - 0.25 * (1 - u), 0.335 + 0.25 * Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u), 0.05 * i]}
                  rotation={[u * 9 + i, u * 7, u * 5]}
                />
              );
            })
          : null}
        {fichas > 0.02
          ? [F.rosa, F.azul, F.dourado].map((c, i) =>
              Array.from({length: Math.round(5 * fichas)}).map((_, k) => (
                <mesh key={`${i}${k}`} position={[0.18 + i * 0.09, 0.31 + k * 0.022, -0.12]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.018, 14]} />
                  <Fosco cor={c} />
                </mesh>
              )),
            )
          : null}
      </group>
      {/* Porta do cassino com placa e cadeado (lado da proa) */}
      <group position={[1.62, y, 0.2]}>
        <Caixa args={[0.04, 0.5, 0.36]} raio={0.015} cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} position={[-0.04, 0.25, 0]} />
        <Placa
          tema={tema}
          pos={[-0.09, 0.38, 0]}
          rot={[0, -Math.PI / 2, 0]}
          larg={0.32}
          alt={0.1}
          linhas={[{t: b.fechado === false ? 'ABERTO' : 'FECHADO', tam: 200, cor: b.fechado === false ? F.verde : tema.acento, peso: 900}]}
          fundo={tema.objetoClaro}
        />
      </group>
    </group>
  );
};

// Corredor das cabines no D2: portas no fundo (−z); a 204 abre e fecha
export const PORTAS_X = [-2.7, -2.0, -1.3, -0.6, 0.1, 0.8];
export const PORTA_204 = 0.1;
const Cabines: React.FC<{tema: Tema; b: Bordo; t: number}> = ({tema, b, t}) => {
  const F = festa(tema);
  const {D2, ESC_GENTE} = NAVIO;
  const y = D2 + 0.06;
  const carpete = mistura(F.azulNoite, tema.fundo, 0.3);
  const porta = b.porta ?? 1;
  const pas = b.passageiro ?? 0;
  // Passageiro: do corredor (z 0,4) até dentro da cabine (z −0,75)
  const px = PORTA_204 + (1 - Math.min(1, pas * 2)) * 0.9;
  const pz = pas < 0.5 ? 0.35 : 0.35 - (pas - 0.5) * 2 * 1.1;
  const andando = pas > 0.02 && pas < 0.98;
  return (
    <group>
      <Caixa args={[4.6, 0.02, 0.9]} raio={0.008} cor={carpete} sombra={false} position={[-1.0, y + 0.03, 0.3]} />
      {/* Parede das cabines (z −0,25), com vão em cada porta */}
      {PORTAS_X.map((x, i) => (
        <group key={x}>
          <Caixa args={[0.4, 0.62, 0.05]} raio={0.015} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[x - 0.35, y + 0.31, -0.25]} />
          {/* Porta (dobradiça no lado −x) */}
          <group position={[x - 0.15, y, -0.25]} rotation={[0, x === PORTA_204 ? -1.4 * porta : 0, 0]}>
            <Caixa args={[0.3, 0.52, 0.035]} raio={0.012} cor={x === PORTA_204 ? mistura(F.azul, tema.objetoEscuro, 0.2) : mistura(F.azul, tema.objetoEscuro, 0.55)} position={[0.15, 0.26, 0.01]} />
          </group>
          {x === PORTA_204 ? (
            <Placa tema={tema} pos={[x, y + 0.58, -0.2]} larg={0.26} alt={0.08} linhas={[{t: 'CABINE 204', tam: 120, cor: F.azulNoite, peso: 900}]} fundo={tema.objetoClaro} />
          ) : null}
          {i === PORTAS_X.length - 1 ? <Caixa args={[0.4, 0.62, 0.05]} raio={0.015} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[x + 0.35, y + 0.31, -0.25]} /> : null}
        </group>
      ))}
      {pas < 0.999 || porta > 0.05 ? (
        <Boneco
          tema={tema}
          pos={[px, y, pz]}
          rotY={pas < 0.5 ? -Math.PI / 2 : Math.PI}
          escala={ESC_GENTE}
          cor={mistura(F.dourado, tema.corpo, 0.25)}
          pose={{passo: andando ? Math.sin(t * 9) : 0, ombroE: [-0.3, 0, -0.5 * (b.alerta ?? 0)], cotoveloE: -0.8 * (b.alerta ?? 0)}}
        />
      ) : null}
      {(b.outros ?? 0) > 0.02
        ? [-1.8, -1.45, -1.1].map((x, i) => (
            <Boneco key={x} tema={tema} pos={[x, y, 0.35 + (i % 2) * 0.15]} rotY={Math.PI / 2 - 0.3} escala={ESC_GENTE * (b.outros ?? 0)} cor={[F.turquesa, F.rosa, tema.corpo][i]} />
          ))
        : null}
    </group>
  );
};

// ---------- Navio pequeno (frota do mapa): casco + bloco + chaminé ----------
export const NavioMini: React.FC<{tema: Tema; pos: V3; rumo: number; escala: number; t: number}> = ({tema, pos, rumo, escala, t}) =>
  escala < 0.02 ? null : (
    <group position={[pos[0], pos[1] + 0.01 * Math.sin(t * 2 + pos[0]), pos[2]]} rotation={[0, rumo, 0]} scale={escala}>
      <mesh geometry={G_CASCO} scale={[1, 0.5, 1]} castShadow>
        <Fosco cor={tema.objeto} />
      </mesh>
      <Caixa args={[5, 0.9, 1.6]} raio={0.15} cor={tema.objetoClaro} position={[-0.8, 0.95, 0]} />
      <Caixa args={[0.8, 0.8, 0.6]} raio={0.15} cor={festa(tema).azulNoite} position={[-2.6, 1.6, 0]} />
    </group>
  );

// ---------- Praia: areia, espuma na beira, coqueiros, guarda-sóis, cadeiras, banhistas, morros ----------
const Coqueiro: React.FC<{tema: Tema; pos: V3; alt: number; inclina: number; rotY: number; t: number}> = ({tema, pos, alt, inclina, rotY, t}) => {
  const F = festa(tema);
  const tronco = mistura(tema.areia, tema.objetoEscuro, 0.5);
  const folha = mistura(F.verde, tema.objetoEscuro, 0.25);
  const seg = 4;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {Array.from({length: seg}).map((_, i) => {
        const a = inclina * (i / seg);
        const h = alt / seg;
        let x = 0;
        let y = 0;
        for (let k = 0; k < i; k++) {
          x += Math.sin(inclina * (k / seg)) * h;
          y += Math.cos(inclina * (k / seg)) * h;
        }
        return (
          <mesh key={i} position={[x + Math.sin(a) * h * 0.5, y + Math.cos(a) * h * 0.5, 0]} rotation={[0, 0, -a]} castShadow>
            <cylinderGeometry args={[0.07 - i * 0.008, 0.08 - i * 0.008, h * 1.05, 10]} />
            <Fosco cor={tronco} />
          </mesh>
        );
      })}
      {(() => {
        let x = 0;
        let y = 0;
        for (let k = 0; k < seg; k++) {
          x += Math.sin(inclina * (k / seg)) * (alt / seg);
          y += Math.cos(inclina * (k / seg)) * (alt / seg);
        }
        return (
          <group position={[x, y, 0]} rotation={[0, t * 0.05, 0.04 * Math.sin(t * 1.2 + pos[2])]}>
            {Array.from({length: 7}).map((_, i) => (
              <group key={i} rotation={[0, (i * Math.PI * 2) / 7, 0]}>
                <Caixa args={[0.75, 0.03, 0.2]} raio={0.012} cor={folha} position={[0.36, -0.12, 0]} rotation={[0, 0, -0.45]} />
              </group>
            ))}
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0.06 * Math.cos(i * 2.1), -0.08, 0.06 * Math.sin(i * 2.1)]}>
                <sphereGeometry args={[0.06, 10, 8]} />
                <Fosco cor={mistura(tema.areia, F.verde, 0.3)} />
              </mesh>
            ))}
          </group>
        );
      })()}
    </group>
  );
};

const GuardaSol: React.FC<{tema: Tema; pos: V3; cor: string}> = ({tema, pos, cor}) => (
  <group position={pos}>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
    <mesh position={[0, 0.8, 0]} castShadow>
      <coneGeometry args={[0.42, 0.18, 8]} />
      <Fosco cor={cor} />
    </mesh>
    {/* Cadeirinha e toalha */}
    <Caixa args={[0.18, 0.04, 0.34]} raio={0.015} cor={tema.objetoClaro} position={[0.32, 0.1, 0.1]} rotation={[0.25, 0, 0]} />
    <Caixa args={[0.26, 0.012, 0.5]} raio={0.005} cor={mistura(cor, tema.objetoClaro, 0.35)} position={[-0.3, 0.012, 0.15]} sombra={false} />
  </group>
);

const AREIA_Y = 0.16;
export const Praia: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const F = festa(tema);
  const areia = mistura(tema.areia, tema.objetoEscuro, 0.42);
  const terra = mistura(F.verde, tema.objetoEscuro, 0.62);
  const espuma = mistura(tema.objeto, mistura(tema.fundo, festa(tema).azulNoite, 0.55), 0.35);
  const coqueiros: [number, number, number, number][] = [
    [-13.5, -9, 2.0, 0.35],
    [-14.2, -5.5, 2.3, 0.25],
    [-13.2, -1.5, 1.9, 0.4],
    [-14.0, 5.5, 2.2, 0.3],
    [-13.3, 9.0, 2.0, 0.38],
    [-14.5, 12.5, 2.4, 0.2],
    [-13.8, -13, 2.1, 0.3],
  ];
  const sois: [number, number, string][] = [
    [-11.0, -8.0, F.rosa],
    [-10.5, -4.5, F.dourado],
    [-11.3, -1.0, F.turquesa],
    [-10.8, 5.0, F.roxo],
    [-11.4, 8.0, F.azul],
    [-10.6, 11.0, F.rosa],
  ];
  const banhistas: [number, number, string, number][] = [
    [-9.6, -6.5, F.dourado, 0.6],
    [-9.2, -2.5, F.turquesa, -0.4],
    [-9.8, 6.5, F.rosa, 0.2],
    [-8.9, 9.5, tema.corpo, -0.8],
  ];
  return (
    <group>
      {/* Terra firme e faixa de areia (topo a 0,16, bem acima da água) */}
      <Caixa args={[24, 0.32, 60]} raio={0.1} cor={terra} position={[-30, 0.0, 0]} />
      <Caixa args={[10, 0.32, 60]} raio={0.12} cor={areia} position={[BEIRA_X - 5, 0.0, 0]} />
      {/* Espuma que vai e volta na beira: pedaços irregulares, em duas fileiras desencontradas */}
      {Array.from({length: 46}).map((_, i) => {
        const z = -28 + i * 1.25 + 0.4 * Math.sin(i * 3.7);
        const fila = i % 2;
        const v = Math.sin(t * 1.1 + i * 0.9);
        const comp = 0.9 + 0.7 * Math.abs(Math.sin(i * 2.3));
        return <Caixa key={i} args={[0.22 + 0.12 * Math.abs(Math.sin(i * 1.3)), 0.03, comp]} raio={0.012} cor={espuma} sombra={false} position={[BEIRA_X + 0.2 + fila * 0.55 + 0.22 * v, ESPUMA_Y - 0.005, z]} rotation={[0, 0.25 * Math.sin(i * 1.9), 0]} />;
      })}
      {coqueiros.map(([x, z, a, i], k) => (
        <Coqueiro key={k} tema={tema} pos={[x, AREIA_Y, z]} alt={a} inclina={i} rotY={k * 1.9} t={t} />
      ))}
      {sois.map(([x, z, c], k) => (
        <GuardaSol key={k} tema={tema} pos={[x, AREIA_Y, z]} cor={c} />
      ))}
      {banhistas.map(([x, z, c, r], k) => (
        <Boneco key={k} tema={tema} pos={[x, AREIA_Y, z]} rotY={r} escala={0.3} cor={c} pose={{ombroD: [-0.3 * Math.sin(t * 2 + k), 0, 0.1]}} />
      ))}
      {/* Morros ao fundo */}
      {[
        [-26, -10, 4.5],
        [-29, 2, 6],
        [-25, 13, 4],
      ].map(([x, z, r], k) => (
        <mesh key={k} position={[x, 0, z]} scale={[1, 0.55, 1.2]} castShadow receiveShadow>
          <sphereGeometry args={[r, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Fosco cor={mistura(terra, F.verde, 0.15)} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Cais com guindastes ----------
export const CAIS = {x0: -8.5, x1: -3.6, z0: 1.25, z1: 3.3, y: 0.5};
export const Cais: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const F = festa(tema);
  const concreto = mistura(tema.objeto, tema.objetoEscuro, 0.55);
  const {x0, x1, z0, z1, y} = CAIS;
  return (
    <group>
      <Caixa args={[x1 - x0, y, z1 - z0]} raio={0.05} cor={concreto} position={[(x0 + x1) / 2, y / 2, (z0 + z1) / 2]} />
      {/* Cabeços de amarração e cordas até o navio */}
      {[-6.8, -4.4].map((x) => (
        <mesh key={x} position={[x, y + 0.06, z0 + 0.15]}>
          <cylinderGeometry args={[0.06, 0.07, 0.12, 12]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      ))}
      {/* Guindastes */}
      {[-7.6, -5.0].map((x, i) => (
        <group key={x} position={[x, y, z1 - 0.4]}>
          <Caixa args={[0.18, 1.8, 0.18]} raio={0.03} cor={F.dourado} position={[0, 0.9, 0]} />
          <group position={[0, 1.8, 0]} rotation={[0, 0.6 + 0.25 * Math.sin(t * 0.4 + i * 2), 0]}>
            <Caixa args={[1.6, 0.12, 0.12]} raio={0.03} cor={F.dourado} position={[0.55, 0, 0]} />
            <mesh position={[1.2, -0.45, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
              <Fosco cor={tema.objetoClaro} />
            </mesh>
            <Caixa args={[0.26, 0.18, 0.18]} raio={0.03} cor={i ? F.azul : F.rosa} position={[1.2, -0.95, 0]} />
          </group>
        </group>
      ))}
      {/* Terminal de passageiros */}
      <Caixa args={[1.6, 0.7, 1.0]} raio={0.06} cor={tema.objetoClaro} position={[-7.6, y + 0.35, z1 - 1.4]} />
      <Caixa args={[1.7, 0.08, 1.1]} raio={0.03} cor={F.azulNoite} position={[-7.6, y + 0.74, z1 - 1.4]} />
    </group>
  );
};

// ---------- Boias da linha das 12 milhas ----------
export const Boia: React.FC<{tema: Tema; pos: V3; k: number; acende: number; t: number}> = ({tema, pos, k, acende, t}) =>
  k < 0.02 ? null : (
    <group position={[pos[0], pos[1] - 0.6 * (1 - k) + 0.04 * Math.sin(t * 2 + pos[2]), pos[2]]} rotation={[0.08 * Math.sin(t * 1.5 + pos[2]), 0, 0.08 * Math.cos(t * 1.3 + pos[2])]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.36, 18]} />
        <Fosco cor={mistura(tema.objetoClaro, tema.acento, acende)} emissivo={0.35 * acende} />
      </mesh>
      <Caixa args={[0.46, 0.08, 0.46]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.4, 0]} />
      <mesh position={[0, 0.66, 0]} castShadow>
        <coneGeometry args={[0.13, 0.42, 14]} />
        <Fosco cor={mistura(tema.objetoClaro, tema.acento, acende)} emissivo={0.35 * acende} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.06, 12, 10]} />
        <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.3 + 0.9 * acende} />
      </mesh>
    </group>
  );

// Tracejado na água ligando as boias (desenha de −z para +z)
export const Tracejado: React.FC<{tema: Tema; x: number; z0: number; z1: number; k: number; acende: number}> = ({tema, x, z0, z1, k, acende}) => {
  if (k < 0.02) return null;
  const n = Math.floor((z1 - z0) / 0.7);
  const ate = Math.floor(n * k);
  return (
    <>
      {Array.from({length: ate}).map((_, i) => (
        <Caixa key={i} args={[0.12, 0.03, 0.4]} raio={0.012} cor={mistura(tema.objeto, tema.acento, acende)} emissivo={0.4 * acende} sombra={false} position={[x, ESPUMA_Y + 0.01, z0 + i * 0.7 + 0.2]} />
      ))}
    </>
  );
};

// ---------- Régua da costa até a linha ----------
export const Regua: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number}> = ({tema, x0, x1, z, k}) => {
  if (k < 0.02) return null;
  const L = (x1 - x0) * k;
  const n = Math.floor(L / 1.0);
  return (
    <group position={[x0, 0.3, z]}>
      <Caixa args={[L, 0.08, 0.5]} raio={0.03} cor={festa(tema).loiro} position={[L / 2, 0, 0]} />
      {Array.from({length: n + 1}).map((_, i) => (
        <Caixa key={i} args={[0.05, 0.1, i % 5 === 0 ? 0.35 : 0.2]} raio={0.015} cor={tema.objetoEscuro} sombra={false} position={[i * 1.0, 0.05, -0.1]} />
      ))}
    </group>
  );
};

// ---------- Gaivota (V que plana) ----------
export const Gaivota: React.FC<{tema: Tema; pos: V3; rumo: number; t: number; escala?: number}> = ({tema, pos, rumo, t, escala = 1}) => {
  const bate = 0.35 * Math.sin(t * 5 + pos[0]);
  return (
    <group position={pos} rotation={[0, rumo, 0]} scale={escala}>
      <mesh scale={[0.18, 0.06, 0.06]}>
        <sphereGeometry args={[1, 10, 8]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      {[-1, 1].map((l) => (
        <group key={l} rotation={[l * (0.25 + bate), 0, 0]}>
          <Caixa args={[0.1, 0.012, 0.3]} raio={0.005} cor={tema.objetoClaro} sombra={false} position={[0, 0, l * 0.16]} />
        </group>
      ))}
    </group>
  );
};

// ---------- Folheto, passagem, mala, livro do CDC ----------
export const Folheto: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k} rotation={[-0.2, 0, 0]}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={0.55} alt={0.36} linhas={[{t: 'CRUZEIRO', tam: 190, cor: festa(tema).azulNoite, peso: 900}, {t: '7 NOITES · LITORAL', tam: 90, cor: tema.acento, peso: 800}]} fundo={tema.objetoClaro} />
    </group>
  );

export const Bilhete: React.FC<{tema: Tema; pos: V3; rotY?: number; k: number}> = ({tema, pos, rotY = 0, k}) =>
  k < 0.02 ? null : (
    <group position={[pos[0], pos[1] + 0.6 * (1 - Math.min(1, k)), pos[2]]} rotation={[0, rotY, 0.06]} scale={k}>
      <Placa tema={tema} pos={[0, 0.5, 0]} larg={1.5} alt={0.75} linhas={[{t: 'PASSAGEM', tam: 150, cor: festa(tema).azulNoite, peso: 900}, {t: 'COMPRADA NO BRASIL', tam: 82, cor: tema.acento, peso: 800}]} fundo={tema.objetoClaro} />
      <Caixa args={[0.06, 0.5, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, -0.03, -0.05]} />
    </group>
  );

export const Mala: React.FC<{tema: Tema; pos: V3; k: number; quebra: number}> = ({tema, pos, k, quebra}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos} scale={k} rotation={[0, -0.4, 0]}>
      <Caixa args={[0.62, 0.8, 0.3]} raio={0.08} cor={F.roxo} position={[0, 0.45, 0]} />
      {[-0.2, 0.2].map((x) => (
        <Caixa key={x} args={[0.04, 0.78, 0.32]} raio={0.015} cor={mistura(F.roxo, tema.objetoEscuro, 0.4)} sombra={false} position={[x, 0.45, 0]} />
      ))}
      {/* Alça: um lado solto e caído */}
      <Caixa args={[0.05, 0.22, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[-0.12, 0.95, 0]} />
      <group position={[0.12, 0.85, 0]} rotation={[0, 0, -1.6 * quebra]}>
        <Caixa args={[0.05, 0.22, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.11, 0]} />
      </group>
      <Caixa args={[0.29, 0.05, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[-0.0 - 0.1 * quebra, 1.06 - 0.12 * quebra, 0]} rotation={[0, 0, -0.5 * quebra]} />
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.035, 0.015, 8, 14]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      ))}
    </group>
  );
};

export const LivroCDC: React.FC<{tema: Tema; pos: V3; rotY?: number; k: number; brilho: number}> = ({tema, pos, rotY = 0, k, brilho}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <Caixa args={[1.1, 1.5, 0.3]} raio={0.06} cor={mistura(festa(tema).azulNoite, tema.acento, 0.15 * brilho)} position={[0, 0.75, 0]} />
      <Caixa args={[1.02, 1.42, 0.31]} raio={0.03} cor={tema.objetoClaro} sombra={false} position={[0.05, 0.75, 0]} />
      <Caixa args={[1.1, 1.5, 0.06]} raio={0.04} cor={mistura(festa(tema).azulNoite, tema.acento, 0.2 * brilho)} position={[0, 0.75, 0.17]} />
      <Placa tema={tema} pos={[0, 0.85, 0.21]} larg={0.8} alt={0.6} linhas={[{t: 'CDC', tam: 330, cor: tema.objetoClaro, peso: 900}, {t: 'CONSUMIDOR', tam: 110, cor: tema.objetoClaro, peso: 700}]} fundo={mistura(festa(tema).azulNoite, tema.acento, 0.2 * brilho)} />
    </group>
  );

// Amigo genérico do kit (bonecos coloridos da paleta festa)
export const Pessoa: React.FC<{tema: Tema; pos: V3; rotY?: number; cor: string; escala?: number; pose?: Pose; children?: React.ReactNode}> = ({tema, pos, rotY = 0, cor, escala = 0.3, pose, children}) => (
  <Boneco tema={tema} pos={pos} rotY={rotY} escala={escala} cor={cor} pose={pose}>
    {children}
  </Boneco>
);
