import React from 'react';
import * as THREE from 'three';
import {Boneco, Caixa, Fosco, Placa, geoCaixa, type Pose, type V3} from '../../base/pecas';
import {ESCURO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {Onibus, Urna} from '../../pecas';
import {BRASIL, UFS} from './mapaIBGE';

// Peças do 005 (ônibus na eleição): o Brasil deitado como tabuleiro e as maquetes que sobem em cima de cada cidade.
// Formas foscas e arredondadas, cores só do tema, sem marca e sem rosto.

export const fe = (tema: Tema) => tema.festa ?? ESCURO.festa!;

// ---------- Mapa: longitude/latitude → mundo (escala 1,0; Norte para −z) ----------
export const MAPA_Y = 0.36;
export const geoE = (lon: number, lat: number, y = MAPA_Y): V3 => [lon + 54, y, -(lat + 15)];
// Contorno do país e dos estados: IBGE (mapaIBGE.ts).
const BR = BRASIL;
const forma = (pts: [number, number][]) => {
  const f = new THREE.Shape();
  pts.forEach(([lo, la], i) => (i === 0 ? f.moveTo(lo + 54, la + 15) : f.lineTo(lo + 54, la + 15)));
  return f;
};
const G_MAPA = new THREE.ExtrudeGeometry(forma(BR), {depth: 0.22, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.06, bevelSegments: 3});
// Linha da divisa com segmentos retos (a curva suave inventava arcos nos trechos longos).
const tubo = (pts: [number, number][], r: number) => {
  const v = pts.map(([lo, la]) => new THREE.Vector3(lo + 54, 0, -(la + 15)));
  const caminho = new THREE.CurvePath<THREE.Vector3>();
  v.forEach((p, i) => caminho.add(new THREE.LineCurve3(p, v[(i + 1) % v.length])));
  return new THREE.TubeGeometry(caminho as unknown as THREE.Curve<THREE.Vector3>, Math.max(60, pts.length * 4), r, 5, true);
};
const G_BORDA = tubo(BR, 0.07);
// Divisas dos estados (linhas finas) e o preenchimento de cada estado (para acender inteiro).
const G_DIVISAS = Object.entries(UFS).map(([uf, pts]) => ({uf, g: tubo(pts, 0.035)}));
const G_UF: Record<string, THREE.ShapeGeometry> = Object.fromEntries(Object.entries(UFS).map(([uf, pts]) => [uf, new THREE.ShapeGeometry(forma(pts))]));
/** Centro aproximado de cada estado (média dos pontos do contorno), em coordenadas do mundo. */
export const CENTRO_UF: Record<string, V3> = Object.fromEntries(
  Object.entries(UFS).map(([uf, pts]) => {
    const lo = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const la = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    return [uf, geoE(lo, la)];
  }),
);
// ajustes à mão onde a média cai fora ou no litoral
CENTRO_UF.PA = geoE(-52.5, -4.5);
CENTRO_UF.MG = geoE(-44.6, -18.4);
CENTRO_UF.BA = geoE(-41.8, -12.4);
CENTRO_UF.SP = geoE(-48.6, -22.3);
CENTRO_UF.RJ = geoE(-42.7, -22.2);
CENTRO_UF.GO = geoE(-50.4, -16.6);
CENTRO_UF.DF = geoE(-47.8, -15.8);

// Discos de luz dos 8 estados (centro aproximado e raio em metros).
export type Estado = {id: string; nome: string; lon: number; lat: number; r: number};
export const ESTADOS_MJ: Estado[] = [
  {id: 'BA', nome: 'BAHIA', lon: -41.6, lat: -12.6, r: 3.4},
  {id: 'SP', nome: 'SÃO PAULO', lon: -48.6, lat: -22.2, r: 2.4},
  {id: 'RJ', nome: 'RIO DE JANEIRO', lon: -42.8, lat: -22.3, r: 1.1},
  {id: 'PI', nome: 'PIAUÍ', lon: -42.7, lat: -7.6, r: 2.3},
  {id: 'AL', nome: 'ALAGOAS', lon: -36.6, lat: -9.6, r: 0.65},
  {id: 'SE', nome: 'SERGIPE', lon: -37.4, lat: -10.6, r: 0.55},
  {id: 'PB', nome: 'PARAÍBA', lon: -36.6, lat: -7.1, r: 0.85},
  {id: 'PA', nome: 'PARÁ', lon: -52.6, lat: -4.0, r: 4.2},
];

// ---------- Mapa-tabuleiro: mar, Brasil em relevo, borda que acende e discos dos estados ----------
// `borda` 0..1 acende o contorno. `acesos[i]` 0..1 acende o disco do estado i de ESTADOS_MJ.
export const MapaTabuleiro: React.FC<{tema: Tema; borda: number; acesos: number[]}> = ({tema, borda, acesos}) => {
  const F = fe(tema);
  const terra = mistura(tema.areia, tema.objetoEscuro, 0.55);
  return (
    <>
      <mesh position={[0, 0.04, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 86]} />
        <meshStandardMaterial color={mistura(F.azulNoite, tema.chao, 0.35)} roughness={0.95} />
      </mesh>
      <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={G_MAPA} receiveShadow castShadow>
          <Fosco cor={terra} />
        </mesh>
      </group>
      <mesh geometry={G_BORDA} position={[0, MAPA_Y + 0.01, 0]}>
        <meshStandardMaterial color={mistura(terra, tema.objetoClaro, 0.35 + 0.4 * borda)} emissive={tema.objetoClaro} emissiveIntensity={0.08 + 0.5 * borda} roughness={0.8} />
      </mesh>
      {G_DIVISAS.map(({uf, g}) => (
        <mesh key={uf} geometry={g} position={[0, MAPA_Y + 0.004, 0]}>
          <meshStandardMaterial color={mistura(terra, tema.objetoEscuro, 0.55)} roughness={0.9} />
        </mesh>
      ))}
      {ESTADOS_MJ.map((e, i) => {
        const k = acesos[i] ?? 0;
        if (k < 0.02) return null;
        return (
          <mesh key={e.id} geometry={G_UF[e.id]} position={[0, MAPA_Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.2 * k} transparent opacity={0.3 * k} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-4} />
          </mesh>
        );
      })}
    </>
  );
};

// ---------- Pino de cidade (haste + bola), cor neutra; `aceso` 0..1 acende a bola ----------
export const PinoCidade: React.FC<{tema: Tema; pos: V3; k: number; aceso?: number}> = ({tema, pos, k, aceso = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={[1, k, 1]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 10]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh position={[0, 0.74, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial color={mistura(tema.objetoClaro, tema.branco, aceso)} emissive={tema.objetoClaro} emissiveIntensity={0.15 + 0.7 * aceso} roughness={0.5} />
      </mesh>
    </group>
  );

// ---------- Maquete pop-up: plataforma redonda num pedestal que sai do pino ----------
// Sobe de `base` (o pino no mapa) até `pos`. Conteúdo como filhos, em coordenadas da plataforma (topo em y 0).
export const Maquete: React.FC<{tema: Tema; base: V3; pos: V3; sobe: number; raio?: number; children?: React.ReactNode}> = ({tema, base, pos, sobe, raio = 1.6, children}) => {
  if (sobe < 0.02) return null;
  const k = Math.min(1, sobe);
  const p: V3 = [base[0] + (pos[0] - base[0]) * k, base[1] + (pos[1] - base[1]) * k, base[2] + (pos[2] - base[2]) * k];
  const dx = p[0] - base[0];
  const dy = p[1] - base[1];
  const dz = p[2] - base[2];
  const comp = Math.hypot(dx, dy, dz);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  return (
    <>
      {comp > 0.05 ? (
        <mesh position={[(base[0] + p[0]) / 2, (base[1] + p[1]) / 2, (base[2] + p[2]) / 2]} quaternion={q}>
          <cylinderGeometry args={[0.05, 0.09, comp, 10]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ) : null}
      <group position={p} scale={sobe}>
        <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[raio, raio * 0.94, 0.2, 64]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[raio - 0.06, raio, 64]} />
          <meshStandardMaterial color={tema.objeto} roughness={0.85} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-2} />
        </mesh>
        {children}
      </group>
    </>
  );
};

// ---------- Rua reta ao longo de x (larg 0,5), com faixa tracejada ----------
export const Rua: React.FC<{tema: Tema; z: number; x0: number; x1: number}> = ({tema, z, x0, x1}) => (
  <group>
    <Caixa args={[x1 - x0, 0.02, 0.5]} raio={0.008} cor={tom(tema.chao, 0.12)} position={[(x0 + x1) / 2, 0.012, z]} sombra={false} />
    {Array.from({length: Math.floor((x1 - x0) / 0.3)}).map((_, i) => (
      <Caixa key={i} args={[0.14, 0.006, 0.03]} raio={0.002} cor={tema.objetoClaro} position={[x0 + 0.15 + i * 0.3, 0.026, z]} sombra={false} />
    ))}
  </group>
);

// ---------- Garagem aberta na frente (+z): `vagas` lado a lado, telhado, luz interna ----------
// Largura = vagas × 0,4 + 0,2. `luz` 0..1 acende o teto por dentro. `letreiro`: texto curto em cima.
export const Garagem: React.FC<{tema: Tema; pos: V3; vagas: number; luz: number; letreiro?: string; brilhoLetreiro?: number}> = ({tema, pos, vagas, luz, letreiro, brilhoLetreiro = 0}) => {
  const L = vagas * 0.4 + 0.2;
  return (
    <group position={pos}>
      <Caixa args={[L, 0.02, 1.05]} raio={0.008} cor={tom(tema.chao, 0.05)} position={[0, 0.012, 0]} sombra={false} />
      <Caixa args={[L, 0.55, 0.06]} raio={0.02} cor={tema.objeto} position={[0, 0.28, -0.52]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.06, 0.55, 1.05]} raio={0.02} cor={tema.objeto} position={[(L / 2) * l, 0.28, 0]} />
      ))}
      <Caixa args={[L + 0.12, 0.06, 1.15]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.58, 0]} />
      <mesh position={[0, 0.545, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L - 0.1, 0.9]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.9 * luz} transparent opacity={0.15 + 0.6 * luz} />
      </mesh>
      {letreiro ? (
        <Placa tema={tema} pos={[0, 0.74, 0.5]} larg={Math.min(L, 1.4)} alt={0.24} linhas={[{t: letreiro, tam: 170, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.6 * brilhoLetreiro} />
      ) : null}
    </group>
  );
};
/** Posição da vaga i (0 = esquerda) de uma garagem em `pos` com `vagas` vagas. */
export const vaga = (pos: V3, vagas: number, i: number): V3 => [pos[0] - (vagas * 0.4) / 2 + 0.2 + i * 0.4, pos[1], pos[2] - 0.02];

// ---------- Ônibus que sai da vaga e roda pela rua ----------
// `sai` 0..1: anda da vaga até a rua (vira para −x). Depois `roda` (metros) anda pela rua; some ao passar de `xFim`.
export const OnibusVivo: React.FC<{tema: Tema; de: V3; ruaZ: number; sai: number; roda?: number; xFim?: number; escala?: number; ligado: number; k?: number}> = ({tema, de, ruaZ, sai, roda = 0, xFim = -1.5, escala = 0.3, ligado, k = 1}) => {
  if (k < 0.02) return null;
  const u = Math.max(0, Math.min(1, sai));
  const z = de[2] + (ruaZ - de[2]) * Math.min(1, u * 1.4);
  const giro = Math.max(0, Math.min(1, (u - 0.45) / 0.55));
  const x = de[0] - roda;
  const some = x < xFim ? Math.max(0, 1 - (xFim - x) / 0.5) : 1;
  if (some < 0.02) return null;
  return <Onibus tema={tema} pos={[x, de[1], z]} rotY={(Math.PI / 2) * (1 - giro)} escala={escala * Math.min(1, k) * some} farol={ligado} />;
};

// ---------- Ponto de ônibus: cobertura, banco e placa com o nome ----------
export const PontoOnibus: React.FC<{tema: Tema; pos: V3; rotY?: number; nome?: string; escala?: number}> = ({tema, pos, rotY = 0, nome, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {[-0.32, 0.32].map((x) => (
        <Caixa key={x} args={[0.04, 0.5, 0.04]} raio={0.015} cor={tema.objetoClaro} position={[x, 0.25, -0.12]} />
      ))}
      <Caixa args={[0.8, 0.04, 0.34]} raio={0.015} cor={tema.objeto} position={[0, 0.52, -0.04]} />
      <Caixa args={[0.72, 0.36, 0.02]} raio={0.01} cor={mistura(tema.ceuLuz, tema.objetoEscuro, 0.6)} opacidade={0.7} position={[0, 0.3, -0.15]} />
      <Caixa args={[0.56, 0.04, 0.14]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.16, -0.06]} />
      <Caixa args={[0.03, 0.62, 0.03]} raio={0.01} cor={tema.objetoClaro} position={[0.48, 0.31, 0.06]} />
      {nome ? <Placa tema={tema} pos={[0.48, 0.7, 0.08]} larg={0.66} alt={0.16} linhas={[{t: nome, tam: 140, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.35} /> : null}
    </group>
  );

// ---------- Pessoa com placa (nome e cargo), boneco genérico sem rosto ----------
export const Pessoa: React.FC<{tema: Tema; pos: V3; rotY?: number; cor?: string; nome?: string; cargo?: string; k: number; escala?: number; pose?: Pose; transp?: number; placaLarg?: number}> = ({
  tema,
  pos,
  rotY = 0,
  cor,
  nome,
  cargo,
  k,
  escala = 0.2,
  pose,
  transp = 0,
  placaLarg = 1.0,
}) => {
  if (k < 0.02) return null;
  const s = escala * Math.min(1.08, k);
  const c = cor ?? tema.objetoClaro;
  const op = 1 - 0.8 * transp;
  const corpo = <Boneco tema={tema} pos={[0, 0, 0]} escala={s} cor={c} pose={pose} />;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {op < 0.99 ? <Fantasma op={op}>{corpo}</Fantasma> : corpo}
      {nome ? (
        <Placa
          tema={tema}
          pos={[0, 1.84 * escala + 0.16 + (cargo ? 0.06 : 0), 0.02]}
          larg={placaLarg * Math.min(1, k)}
          alt={(cargo ? 0.3 : 0.18) * Math.min(1, k)}
          linhas={cargo ? [{t: nome, tam: 110, cor: tema.objetoClaro, peso: 850}, {t: cargo, tam: 70, cor: tema.textoSuave, peso: 700, mono: true}] : [{t: nome, tam: 120, cor: tema.objetoClaro, peso: 850}]}
          fundo={tema.objetoEscuro}
          brilho={0.3}
        />
      ) : null}
    </group>
  );
};
const Fantasma: React.FC<{op: number; children: React.ReactNode}> = ({op, children}) => {
  const ref = React.useRef<THREE.Group>(null);
  React.useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) {
        m.transparent = true;
        m.opacity = op;
        m.depthWrite = op > 0.6;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
};

// ---------- Papel em pé (ordem, decisão, parecer) com título e carimbo ----------
// `carimbo` 0..1: o carimbo desce e marca. `corCarimbo` do tema (nunca o acento).
export const Papel: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; titulo?: string; carimbo?: number; textoCarimbo?: string; corCarimbo?: string}> = ({tema, pos, rotY = 0, escala, titulo, carimbo = 0, textoCarimbo, corCarimbo}) => {
  if (escala < 0.02) return null;
  const cc = corCarimbo ?? tom(fe(tema).dourado, -0.25);
  const desce = Math.max(0, 1 - carimbo * 1.6);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.06, 0.5, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.25, -0.06]} />
      <Caixa args={[0.78, 1.0, 0.03]} raio={0.012} cor={mistura(tema.branco, tema.areia, 0.25)} position={[0, 0.92, 0]} />
      {titulo ? <Placa tema={tema} pos={[0, 1.27, 0.02]} larg={0.66} alt={0.14} linhas={[{t: titulo, tam: 130, cor: tema.tinta, peso: 900}]} /> : null}
      {Array.from({length: 6}).map((_, i) => (
        <Caixa key={i} args={[i % 3 === 2 ? 0.4 : 0.56, 0.022, 0.006]} raio={0.003} cor={tom(tema.objeto, -0.1)} sombra={false} position={[-0.02, 1.12 - i * 0.09, 0.02]} />
      ))}
      {carimbo > 0.02 && textoCarimbo ? (
        <group position={[0.06, 0.62 + 0.5 * desce, 0.03 + 0.25 * desce]} rotation={[0, 0, -0.12]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={0.62} alt={0.18} linhas={[{t: textoCarimbo, tam: 150, cor: cc, peso: 900}]} fundo={mistura(tema.branco, cc, 0.12)} brilho={0.15} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Escola (local de votação) com urna na porta ----------
// `aberta` 0..1: verde (votando) → cinza (fechada).
export const Escola: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; aberta: number}> = ({tema, pos, rotY = 0, escala = 1, aberta}) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
    <Caixa args={[1.0, 0.5, 0.6]} raio={0.03} cor={mistura(tema.objetoClaro, tema.objeto, 0.4)} position={[0, 0.25, 0]} />
    <Caixa args={[1.08, 0.06, 0.68]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.53, 0]} />
    {[-0.32, 0.32].map((x) => (
      <Caixa key={x} args={[0.2, 0.14, 0.01]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.2 * aberta)} emissivo={0.4 * aberta} sombra={false} position={[x, 0.32, 0.305]} />
    ))}
    <Caixa args={[0.2, 0.3, 0.01]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 0.15, 0.305]} />
    <UrnaCor tema={tema} pos={[0.2, 0, 0.5]} escala={0.22} aberta={aberta} />
    <Placa tema={tema} pos={[0, 0.66, 0.2]} larg={0.8} alt={0.14} linhas={[{t: 'SEÇÃO ELEITORAL', tam: 110, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.3} />
  </group>
);

// ---------- Urna que mostra o estado: aberta (acento) ou fechada (cinza) ----------
export const UrnaCor: React.FC<{tema: Tema; pos: V3; escala: number; aberta: number; rotY?: number}> = ({tema, pos, escala, aberta, rotY = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Urna tema={tema} pos={[0, 0, 0]} escala={escala} />
      <mesh position={[0, 1.02 * escala, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28 * escala, 24]} />
        <meshStandardMaterial color={mistura(tema.objeto, tema.acento, aberta)} emissive={tema.acento} emissiveIntensity={1.0 * aberta} toneMapped={false} />
      </mesh>
    </group>
  );
};

// ---------- Sala de seção eleitoral: grade de urnas (7 × 3) ----------
// `acesas` 0..21 (fração acende a próxima); as outras ficam cinza (fechadas).
export const SalaSecao: React.FC<{tema: Tema; pos: V3; k: number; acesas: number}> = ({tema, pos, k, acesas}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={Math.min(1, k)}>
      <Caixa args={[2.6, 0.02, 1.7]} raio={0.008} cor={mistura(tema.objeto, tema.areia, 0.25)} position={[0, 0.012, 0]} sombra={false} />
      <Caixa args={[2.6, 0.5, 0.05]} raio={0.02} cor={tema.objeto} position={[0, 0.25, -0.85]} />
      {Array.from({length: 21}).map((_, i) => {
        const c = i % 7;
        const r = Math.floor(i / 7);
        const a = Math.max(0, Math.min(1, acesas - i));
        return <UrnaCor key={i} tema={tema} pos={[-1.08 + c * 0.36, 0, -0.45 + r * 0.42]} escala={0.2} aberta={a} />;
      })}
    </group>
  );
};

// ---------- Torre do relógio (praça dos poderes): 4 mostradores, ponteiros pela hora ----------
// `hora` em horas decimais (17,5 = 17h30). `sobe` 0..1 nasce do chão. `pulso` 0..1 acende o aro.
export const TorreRelogio: React.FC<{tema: Tema; pos: V3; sobe: number; hora: number; pulso?: number}> = ({tema, pos, sobe, hora, pulso = 0}) => {
  if (sobe < 0.02) return null;
  const H0 = 2.3;
  const ang = ((hora % 12) / 12) * Math.PI * 2;
  const angM = ((hora % 1) * Math.PI * 2);
  return (
    <group position={[pos[0], pos[1] - H0 * (1 - sobe), pos[2]]}>
      <Caixa args={[0.5, H0, 0.5]} raio={0.04} cor={tema.objeto} position={[0, H0 / 2, 0]} />
      <Caixa args={[0.62, 0.62, 0.62]} raio={0.05} cor={tema.objetoClaro} position={[0, H0 + 0.31, 0]} />
      <mesh position={[0, H0 + 0.78, 0]} castShadow>
        <coneGeometry args={[0.45, 0.4, 4]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {[0, 1, 2, 3].map((f) => (
        <group key={f} rotation={[0, (f * Math.PI) / 2, 0]}>
          <group position={[0, H0 + 0.31, 0.315]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 40]} />
              <meshStandardMaterial color={tema.branco} emissive={tema.objetoClaro} emissiveIntensity={0.25 + 0.5 * pulso} />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <torusGeometry args={[0.24, 0.018, 8, 40]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
            <group position={[0, 0, 0.016]} rotation={[0, 0, -ang]}>
              <Caixa args={[0.025, 0.14, 0.008]} raio={0.004} cor={tema.objetoEscuro} position={[0, 0.06, 0]} sombra={false} />
            </group>
            <group position={[0, 0, 0.022]} rotation={[0, 0, -angM]}>
              <Caixa args={[0.016, 0.2, 0.008]} raio={0.004} cor={tema.objetoEscuro} position={[0, 0.09, 0]} sombra={false} />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
};

// ---------- Rodoviária: plataforma comprida com cobertura e placa ----------
export const Rodoviaria: React.FC<{tema: Tema; pos: V3}> = ({tema, pos}) => (
  <group position={pos}>
    <Caixa args={[2.4, 0.08, 0.7]} raio={0.02} cor={tema.objeto} position={[0, 0.04, 0]} />
    {[-1.05, -0.35, 0.35, 1.05].map((x) => (
      <Caixa key={x} args={[0.05, 0.6, 0.05]} raio={0.02} cor={tema.objetoClaro} position={[x, 0.38, -0.2]} />
    ))}
    <Caixa args={[2.5, 0.05, 0.8]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.7, -0.05]} />
    <Placa tema={tema} pos={[0, 0.84, 0.2]} larg={1.1} alt={0.2} linhas={[{t: 'RODOVIÁRIA', tam: 160, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.35} />
  </group>
);

// ---------- Cais e balsa ----------
export const Cais: React.FC<{tema: Tema; pos: V3}> = ({tema, pos}) => (
  <group position={pos}>
    <Caixa args={[1.4, 0.12, 0.8]} raio={0.02} cor={mistura(tema.areia, tema.objetoEscuro, 0.5)} position={[0, 0.06, 0]} />
    {[-0.6, 0, 0.6].map((x) => (
      <mesh key={x} position={[x, 0.08, 0.42]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 10]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    ))}
  </group>
);
const G_CASCO = geoCaixa(1.5, 0.2, 0.5, 0.08);
// Balsa: casco, convés com cobertura e passageiros (`n`). Frente para −x.
export const Balsa: React.FC<{tema: Tema; pos: V3; rotY?: number; n: number; t: number}> = ({tema, pos, rotY = 0, n, t}) => (
  <group position={[pos[0], pos[1] + 0.015 * Math.sin(t * 1.8), pos[2]]} rotation={[0, rotY, 0.02 * Math.sin(t * 1.3)]}>
    <mesh geometry={G_CASCO} position={[0, 0.1, 0]} castShadow>
      <Fosco cor={tema.objeto} />
    </mesh>
    <Caixa args={[1.1, 0.04, 0.42]} raio={0.015} cor={tema.objetoClaro} position={[0.1, 0.48, 0]} />
    {[-0.4, 0.6].map((x) => (
      <Caixa key={x} args={[0.03, 0.26, 0.03]} raio={0.01} cor={tema.objetoClaro} position={[x, 0.34, 0.18]} />
    ))}
    {Array.from({length: Math.round(n)}).map((_, i) => (
      <Boneco key={i} tema={tema} pos={[-0.45 + (i % 6) * 0.18, 0.2, -0.12 + Math.floor(i / 6) * 0.14]} escala={0.1} cor={i % 3 === 0 ? tema.corpo : tema.pessoa} />
    ))}
  </group>
);

// ---------- Celular em pé com uma mensagem (texto fixo por mensagem) ----------
export const CelularMsg: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; msg: string; hora: string; luz: number}> = ({tema, pos, rotY = 0, escala, msg, hora, luz}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.62, 1.2, 0.06]} raio={0.07} cor={tema.objetoEscuro} position={[0, 0.6, 0]} />
      <Caixa args={[0.54, 1.08, 0.01]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.18 + 0.2 * luz)} emissivo={0.25 * luz} sombra={false} position={[0, 0.6, 0.032]} />
      <Placa tema={tema} pos={[0, 0.98, 0.04]} larg={0.4} alt={0.08} linhas={[{t: hora, tam: 140, cor: tema.textoSuave, peso: 700, mono: true}]} />
      <Caixa args={[0.46, 0.34, 0.01]} raio={0.04} cor={tema.cartao} sombra={false} position={[0, 0.7, 0.04]} />
      <Placa tema={tema} pos={[0, 0.7, 0.047]} larg={0.42} alt={0.3} linhas={msg.split('|').map((m) => ({t: m, tam: 110, cor: tema.texto, peso: 800}))} brilho={0.4 * luz + 0.2} />
    </group>
  );

// ---------- Painel de apuração (telão com barras que crescem e param, sem números de votos) ----------
export const PainelApuracao: React.FC<{tema: Tema; pos: V3; sobe: number; enche: number; pausado: number}> = ({tema, pos, sobe, enche, pausado}) => {
  if (sobe < 0.02) return null;
  return (
    <group position={[pos[0], pos[1] - 2.2 * (1 - sobe), pos[2]]}>
      <Caixa args={[0.08, 1.2, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.6, -0.05]} />
      <Caixa args={[2.0, 1.1, 0.08]} raio={0.05} cor={tema.objetoEscuro} position={[0, 1.65, 0]} />
      <Caixa args={[1.86, 0.96, 0.01]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.12)} sombra={false} position={[0, 1.65, 0.045]} />
      {[0, 1].map((i) => (
        <Caixa key={i} args={[1.4 * Math.max(0.02, enche) * (i === 0 ? 0.95 : 0.8), 0.18, 0.01]} raio={0.02} cor={mistura(tema.objetoClaro, tema.objeto, pausado)} emissivo={0.3 * (1 - pausado)} sombra={false} position={[-0.7 + 0.7 * Math.max(0.02, enche) * (i === 0 ? 0.95 : 0.8), 1.8 - i * 0.3, 0.052]} />
      ))}
      <Placa tema={tema} pos={[0, 1.33, 0.055]} larg={1.4} alt={0.16} linhas={[{t: pausado > 0.5 ? 'CONTAGEM PAUSADA' : 'APURAÇÃO', tam: 130, cor: tema.objetoClaro, peso: 900, mono: true}]} />
    </group>
  );
};
