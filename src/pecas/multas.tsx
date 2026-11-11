import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, useDescartar, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';

// Peças (multas e buracos): um anel viário em maquete, cortado como bolo, com a praça afundada
// no miolo (onde ficam os três donos do dinheiro), radares de poste, buracos que abrem, são tapados e reabrem,
// os canos por onde correm as moedas, as gavetas da lei e a lista do Contran. Tudo parado; quem anima é a cena.

// ---------- Medidas do anel (plano.md, mapa do mundo) ----------
// Ângulo θ: 0 = frente (+z), cresce para +x. ponto(θ, r, y) = [r sen θ, y, r cos θ]
export const ANEL = {
  praca: 7.6, // raio da praça do miolo (e da parede de dentro)
  guiaIn: 7.85, // fim do meio-fio de dentro
  guiaOut: 11.0, // começo do meio-fio de fora
  calcada: 11.25, // começo da calçada
  borda: 12.6, // parede de fora
  topo: 1.2, // topo da pista
  yPraca: 0.55, // piso da praça afundada
};
export const FAIXA_DENTRO = 8.65;
export const FAIXA_FORA = 10.2;
export const ponto = (th: number, r: number, y: number): V3 => [r * Math.sin(th), y, r * Math.cos(th)];
// Os três donos: CIDADE na frente, ESTADO à esquerda, UNIÃO à direita
export const TRECHOS = [0, (-2 * Math.PI) / 3, (2 * Math.PI) / 3];

// Faixa de um anel (setor) feito com LatheGeometry: perfil retangular de r0 a r1, de y0 a y1
const useSetor = (r0: number, r1: number, y0: number, y1: number, ini: number, comp: number, seg = 96) => {
  const g = useMemo(() => {
    const pts = [new THREE.Vector2(r0, y0), new THREE.Vector2(r1, y0), new THREE.Vector2(r1, y1), new THREE.Vector2(r0, y1), new THREE.Vector2(r0, y0)];
    return new THREE.LatheGeometry(pts, seg, ini, comp);
  }, [r0, r1, y0, y1, ini, comp, seg]);
  useDescartar(g);
  return g;
};
const Setor: React.FC<{r0: number; r1: number; y0: number; y1: number; ini?: number; comp?: number; cor: string; emissivo?: number; seg?: number}> = ({r0, r1, y0, y1, ini = 0, comp = Math.PI * 2, cor, emissivo = 0, seg}) => {
  const g = useSetor(r0, r1, y0, y1, ini, comp, seg);
  return (
    <mesh geometry={g} castShadow receiveShadow>
      <meshStandardMaterial color={cor} roughness={0.85} metalness={0} envMapIntensity={0.3} emissive={cor} emissiveIntensity={emissivo} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ---------- Faixas tracejadas e faixa de pedestre (instancedMesh) ----------
const G_TRACO = new THREE.BoxGeometry(0.12, 0.012, 0.75);
const Tracos: React.FC<{tema: Tema}> = ({tema}) => {
  const lista = useMemo(() => {
    const out: {p: V3; rot: number}[] = [];
    const r = (FAIXA_DENTRO + FAIXA_FORA) / 2;
    for (let i = 0; i < 52; i++) {
      const th = (i / 52) * Math.PI * 2;
      out.push({p: ponto(th, r, ANEL.topo + 0.008), rot: th + Math.PI / 2});
    }
    return out;
  }, []);
  const ref = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    const o = new THREE.Object3D();
    lista.forEach((x, i) => {
      o.position.set(...x.p);
      o.rotation.set(0, x.rot, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  return (
    <instancedMesh ref={ref} args={[G_TRACO, undefined, lista.length]} receiveShadow>
      <meshStandardMaterial color={mistura(tema.objetoClaro, tema.objeto, 0.5)} roughness={0.8} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
    </instancedMesh>
  );
};
const G_ZEBRA = new THREE.BoxGeometry(0.34, 0.012, 1.0);
const Zebra: React.FC<{tema: Tema; th: number}> = ({tema, th}) => {
  const ref = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < 6; i++) {
      const r = ANEL.guiaIn + 0.35 + i * ((ANEL.guiaOut - ANEL.guiaIn - 0.7) / 5);
      o.position.set(...ponto(th, r, ANEL.topo + 0.008));
      o.rotation.set(0, th, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  };
  return (
    <instancedMesh ref={ref} args={[G_ZEBRA, undefined, 6]} receiveShadow>
      <meshStandardMaterial color={mistura(tema.objetoClaro, tema.objeto, 0.4)} roughness={0.8} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
    </instancedMesh>
  );
};

// ---------- O anel viário inteiro ----------
// `luz` acende a guia de cada trecho (CIDADE, ESTADO, UNIÃO); `corte` acende as camadas da parede de dentro
export const AnelViario: React.FC<{tema: Tema; luz: [number, number, number]; corte: number}> = ({tema, luz, corte}) => {
  const F = festa(tema);
  const cores = [F.turquesa, F.roxo, F.azul];
  const asfalto = mistura(tema.objetoEscuro, tema.fundo, 0.45);
  const base = mistura(tema.objetoEscuro, tema.objeto, 0.12);
  const terra = mistura(tema.chao, mistura(tema.areia, tema.objetoEscuro, 0.6), 0.55);
  const pedra = mistura(tema.objetoEscuro, tema.fundo, 0.25);
  const calc = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  const T = ANEL;
  // Camadas: asfalto (topo−0,22), base (−0,25), terra (resto)
  const y1 = T.topo - 0.22;
  const y2 = y1 - 0.25;
  return (
    <group>
      {/* Praça afundada e pista */}
      <Setor r0={0.001} r1={T.praca} y0={0} y1={T.yPraca} cor={pedra} />
      <Setor r0={T.praca} r1={T.borda} y0={0} y1={T.topo} cor={asfalto} />
      {/* Calçada de fora */}
      <Setor r0={T.calcada} r1={T.borda} y0={T.topo} y1={T.topo + 0.06} cor={calc} />
      {/* Parede de dentro (o "corte" que mostra as camadas), um pouco à frente da face */}
      <Setor r0={T.praca - 0.03} r1={T.praca - 0.02} y0={y1} y1={T.topo} cor={mistura(asfalto, tema.objetoClaro, 0.05 * corte)} />
      <Setor r0={T.praca - 0.03} r1={T.praca - 0.02} y0={y2} y1={y1} cor={mistura(base, tema.objetoClaro, 0.12 * corte)} emissivo={0.05 * corte} />
      <Setor r0={T.praca - 0.03} r1={T.praca - 0.02} y0={T.yPraca} y1={y2} cor={terra} emissivo={0.04 * corte} />
      {/* Parede de fora com as mesmas camadas */}
      <Setor r0={T.borda + 0.02} r1={T.borda + 0.03} y0={y1} y1={T.topo + 0.06} cor={asfalto} />
      <Setor r0={T.borda + 0.02} r1={T.borda + 0.03} y0={y2} y1={y1} cor={base} />
      <Setor r0={T.borda + 0.02} r1={T.borda + 0.03} y0={0.03} y1={y2} cor={terra} />
      {/* Meio-fios coloridos por trecho */}
      {TRECHOS.map((c, i) => (
        <React.Fragment key={i}>
          <Setor r0={T.praca} r1={T.guiaIn} y0={T.topo} y1={T.topo + 0.09} ini={c - Math.PI / 3} comp={(2 * Math.PI) / 3} seg={40} cor={mistura(tema.objetoEscuro, cores[i], 0.35 + 0.5 * luz[i])} emissivo={0.08 + 0.35 * luz[i]} />
          <Setor r0={T.guiaOut} r1={T.calcada} y0={T.topo} y1={T.topo + 0.09} ini={c - Math.PI / 3} comp={(2 * Math.PI) / 3} seg={40} cor={mistura(tema.objetoEscuro, cores[i], 0.35 + 0.5 * luz[i])} emissivo={0.08 + 0.35 * luz[i]} />
        </React.Fragment>
      ))}
      <Tracos tema={tema} />
      <Zebra tema={tema} th={0.5} />
    </group>
  );
};

// ---------- Radar de poste (lente para -x local: olha os carros que vêm) ----------
export const RadarPoste: React.FC<{tema: Tema; pos: V3; rotY: number; k: number; lente: number; abre?: number; escala?: number}> = ({tema, pos, rotY, k, lente, abre = 0, escala = 0.85}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const caixa = mistura(tema.objeto, tema.objetoEscuro, 0.45);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[escala, escala * k, escala]}>
      <Caixa args={[0.34, 0.08, 0.34]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 1.7, 12]} />
        <Fosco cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} />
      </mesh>
      {/* Caixa do radar (a tampa de cima abre na cena 2) */}
      <Caixa args={[0.52, 0.36, 0.34]} raio={0.06} cor={caixa} position={[0, 1.82, 0]} />
      <group position={[0.26, 2.0, 0]} rotation={[0, 0, 1.6 * abre]}>
        <Caixa args={[0.54, 0.05, 0.36]} raio={0.02} cor={caixa} position={[-0.27, 0.0, 0]} />
      </group>
      {abre > 0.05 ? <Caixa args={[0.42, 0.02, 0.24]} raio={0.008} cor={tema.fundo} position={[0, 1.99, 0]} sombra={false} /> : null}
      {/* Lente e anel (acendem devagar, sem flash) */}
      <mesh position={[-0.27, 1.84, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.11, 0.06, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[-0.305, 1.84, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
        <meshStandardMaterial color={mistura(tema.objetoEscuro, F.dourado, 0.3 + 0.7 * lente)} emissive={F.dourado} emissiveIntensity={0.15 + 1.6 * lente} roughness={0.3} toneMapped={false} />
      </mesh>
      {/* Plaquinha de "fiscalização" */}
      <Caixa args={[0.04, 0.22, 0.3]} raio={0.015} cor={mistura(tema.objetoClaro, F.dourado, 0.25)} position={[0.0, 1.45, 0.0]} sombra={false} />
    </group>
  );
};

// ---------- Buraco: abre (k), é tapado (tapa) e racha de novo (racha) ----------
const G_DISCO = new THREE.CircleGeometry(1, 28);
export const Buraco: React.FC<{tema: Tema; pos: V3; rotY?: number; r?: number; k: number; tapa?: number; treme?: number}> = ({tema, pos, rotY = 0, r = 0.5, k, tapa = 0, treme = 0}) => {
  if (k < 0.02 && tapa < 0.02) return null;
  const rr = r * Math.max(k, tapa > 0 ? 1 : 0);
  const fundo = mistura(tema.fundo, '#000000', 0.35);
  const borda = mistura(tema.objetoEscuro, tema.objeto, 0.2);
  const remendo = mistura(mistura(tema.objetoEscuro, tema.fundo, 0.25), tema.areia, 0.06);
  const aberto = k * (1 - tapa);
  return (
    <group position={[pos[0], pos[1], pos[2]]} rotation={[0, rotY, 0]} scale={1 + 0.04 * Math.sin(treme * 20) * treme}>
      {/* Remendo (só depois de tapado) */}
      {tapa > 0.02 ? (
        <mesh geometry={G_DISCO} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} scale={[r * 1.12, r * 0.95, 1]}>
          <meshStandardMaterial color={remendo} roughness={0.9} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-6} />
        </mesh>
      ) : null}
      {aberto > 0.02 ? (
        <>
          {/* Borda rachada (aro irregular) */}
          <mesh geometry={G_DISCO} rotation={[-Math.PI / 2, 0, 0.4]} position={[0, 0.016, 0]} scale={[rr * 1.22, rr * 1.02, 1]}>
            <meshStandardMaterial color={borda} roughness={0.95} polygonOffset polygonOffsetFactor={-3} polygonOffsetUnits={-8} />
          </mesh>
          {/* Fundo escuro (a cratera) */}
          <mesh geometry={G_DISCO} rotation={[-Math.PI / 2, 0, -0.3]} position={[0, 0.02, 0]} scale={[rr * aberto * 1.02 + rr * 0.0, rr * 0.86 * aberto, 1]}>
            <meshStandardMaterial color={fundo} roughness={1} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-10} />
          </mesh>
          {/* Pedrinhas soltas */}
          {[0.3, 1.4, 2.6, 3.9, 5.1].map((a, i) => (
            <Caixa key={i} args={[0.09, 0.06, 0.08]} raio={0.025} cor={borda} position={[Math.cos(a) * rr * 1.35, 0.04, Math.sin(a) * rr * 1.2]} rotation={[0, a, 0]} sombra={false} />
          ))}
        </>
      ) : null}
    </group>
  );
};

// ---------- Cano translúcido com moedas que correm dentro ----------
const G_MOEDINHA = new THREE.CylinderGeometry(0.11, 0.11, 0.035, 18);
export const CanoMoedas: React.FC<{tema: Tema; pontos: V3[]; k: number; fluxo: number; n?: number; brilho?: number}> = ({tema, pontos, k, fluxo, n = 14, brilho = 0}) => {
  const curva = useMemo(() => new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.2), [JSON.stringify(pontos)]); // eslint-disable-line react-hooks/exhaustive-deps
  const tubo = useMemo(() => new THREE.TubeGeometry(curva, 80, 0.17, 12, false), [curva]);
  useDescartar(tubo);
  const F = festa(tema);
  if (k < 0.02) return null;
  const ref = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const u = (((i / n + fluxo) % 1) + 1) % 1;
      const p = curva.getPointAt(u);
      const tg = curva.getTangentAt(u);
      o.position.copy(p);
      o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg);
      o.scale.setScalar(fluxo > 0 || i < n ? Math.min(1, k * 1.2) : 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  };
  return (
    <group>
      <mesh geometry={tubo}>
        <meshStandardMaterial color={mistura(tema.objeto, F.dourado, 0.15 + 0.3 * brilho)} transparent opacity={0.22 * k + 0.12 * brilho} roughness={0.25} metalness={0.1} depthWrite={false} emissive={F.dourado} emissiveIntensity={0.05 + 0.3 * brilho} />
      </mesh>
      <instancedMesh ref={ref} args={[G_MOEDINHA, undefined, n]} frustumCulled={false}>
        <meshStandardMaterial color={F.dourado} roughness={0.35} metalness={0.3} emissive={F.dourado} emissiveIntensity={0.15 + 0.5 * brilho} />
      </instancedMesh>
    </group>
  );
};

// ---------- Placas da beira da estrada ----------
export const PlacaRodovia: React.FC<{tema: Tema; pos: V3; rotY: number; k: number}> = ({tema, pos, rotY, k}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const verde = mistura(F.verde, tema.fundo, 0.35);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, k, 1]}>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 1.8, 10]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
      <Placa tema={{...tema, tinta: verde}} pos={[0, 1.95, 0.06]} larg={2.3} alt={0.72} linhas={[{t: 'RODOVIA ESTADUAL', tam: 92, cor: tema.objetoClaro, peso: 800}]} fundo={verde} />
    </group>
  );
};
export const EscudoBR: React.FC<{tema: Tema; pos: V3; rotY: number; k: number}> = ({tema, pos, rotY, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, k, 1]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 1.6, 10]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      {/* Escudo: corpo e ponta de baixo */}
      <group position={[0, 1.95, 0.06]}>
        <Caixa args={[0.95, 0.7, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.1, -0.02]} />
        <mesh position={[0, -0.32, -0.02]} rotation={[0, 0, Math.PI]}>
          <cylinderGeometry args={[0.47, 0.47, 0.06, 3, 1, false]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <Placa tema={{...tema, tinta: tema.objetoClaro}} pos={[0, 0.08, 0.02]} larg={0.82} alt={0.58} linhas={[{t: 'BR', tam: 330, cor: tema.fundo, peso: 900}]} fundo={tema.objetoClaro} />
      </group>
    </group>
  );
};
export const Cone: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos} scale={k}>
      <Caixa args={[0.34, 0.04, 0.34]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.02, 0]} />
      <mesh position={[0, 0.27, 0]} castShadow>
        <coneGeometry args={[0.13, 0.5, 18]} />
        <Fosco cor={F.dourado} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.085, 0.1, 0.08, 18]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );
};

// ---------- Papel de multa (folhinha com texto) ----------
export const PapelMulta: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; texto?: string}> = ({tema, pos, rot = [0, 0, 0], escala, texto = 'MULTA'}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.18);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Placa tema={{...tema, tinta: papel}} pos={[0, 0, 0]} larg={0.9} alt={1.15} linhas={[{t: texto, tam: 210, cor: tema.fundo, peso: 900}, {t: '— — — —', tam: 120, cor: tema.objetoEscuro, peso: 700}, {t: 'R$ ___', tam: 140, cor: tema.objetoEscuro, peso: 800}]} fundo={papel} />
    </group>
  );
};
// Pilha de papéis (instancedMesh, até ~200)
const G_FOLHA = new THREE.BoxGeometry(0.5, 0.025, 0.64);
export const PilhaPapeis: React.FC<{tema: Tema; pos: V3; n: number}> = ({tema, pos, n}) => {
  const N = 220;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.18);
  const ref = (m: THREE.InstancedMesh | null) => {
    if (!m) return;
    const o = new THREE.Object3D();
    let s = 5;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < N; i++) {
      const col = i % 4;
      const alt = Math.floor(i / 4);
      const vis = i < n;
      o.position.set(((col % 2) - 0.5) * 0.56 + (rnd() - 0.5) * 0.06, 0.013 + alt * 0.028, (Math.floor(col / 2) - 0.5) * 0.7 + (rnd() - 0.5) * 0.06);
      o.rotation.set(0, (rnd() - 0.5) * 0.3, 0);
      o.scale.setScalar(vis ? 1 : 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  };
  if (n < 1) return null;
  return (
    <group position={pos}>
      <instancedMesh ref={ref} args={[G_FOLHA, undefined, N]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial color={papel} roughness={0.85} />
      </instancedMesh>
    </group>
  );
};

// ---------- Central do destino: móvel de 4 gavetas em cima de uma coluna ----------
export const GAVETAS = ['SINALIZAÇÃO', 'FISCALIZAÇÃO', 'EDUCAÇÃO', 'OBRAS NA PISTA'];
export const ALT_COLUNA = 3.0;
export const GavetasLei: React.FC<{tema: Tema; pos: V3; rotY?: number; k: number; abre: number[]; luz: number[]}> = ({tema, pos, rotY = 0, k, abre, luz}) => {
  if (k < 0.02) return null;
  const movel = mistura(tema.objetoEscuro, tema.objeto, 0.25);
  const frente = mistura(tema.objeto, tema.objetoEscuro, 0.35);
  return (
    <group position={[pos[0], pos[1] - (ALT_COLUNA + 1.6) * (1 - k), pos[2]]} rotation={[0, rotY, 0]}>
      <mesh position={[0, ALT_COLUNA / 2, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.4, ALT_COLUNA, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <group position={[0, ALT_COLUNA, 0]}>
        <Caixa args={[2.3, 1.62, 1.0]} raio={0.06} cor={movel} position={[0, 0.81, 0]} />
        {GAVETAS.map((g, i) => {
          const y = 1.42 - i * 0.38;
          const a = abre[i] ?? 0;
          return (
            <group key={g} position={[0, y, 0.5 + 0.55 * a]}>
              <Caixa args={[2.1, 0.32, 0.9]} raio={0.03} cor={mistura(frente, tema.objetoClaro, 0.25 * luz[i])} emissivo={0.12 * luz[i]} position={[0, 0, -0.45]} />
              <Placa tema={{...tema, tinta: frente}} pos={[0, 0, 0.0]} larg={1.6} alt={0.26} linhas={[{t: g, tam: Math.min(150, Math.floor(900 / (g.length * 0.62))), cor: mistura(tema.objetoClaro, tema.texto, 0.5), peso: 800}]} fundo={frente} />
              <Caixa args={[0.3, 0.05, 0.06]} raio={0.02} cor={tema.objetoClaro} position={[0.92, 0, 0.05]} sombra={false} />
            </group>
          );
        })}
      </group>
    </group>
  );
};
// Ícones que saem das gavetas
// `cor`: cor da placa (padrão: o acento do tema, que costuma ser vermelho ou marsala).
export const PlacaPare: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cor?: string}> = ({tema, pos, rotY = 0, escala, cor}) => {
  if (escala < 0.02) return null;
  const F = {vermelho: cor ?? tema.acento};
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0, 1.05, 0.03]} rotation={[Math.PI / 2, Math.PI / 8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 8]} />
        <Fosco cor={mistura(F.vermelho, tema.fundo, 0.25)} />
      </mesh>
      <mesh position={[0, 1.05, 0.053]} rotation={[Math.PI / 2, Math.PI / 8, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.01, 8]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.8} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
      <mesh position={[0, 1.05, 0.062]} rotation={[Math.PI / 2, Math.PI / 8, 0]}>
        <cylinderGeometry args={[0.215, 0.215, 0.01, 8]} />
        <meshStandardMaterial color={mistura(F.vermelho, tema.fundo, 0.25)} roughness={0.8} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-6} />
      </mesh>
    </group>
  );
};
export const Cartilha: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.62, 0.8, 0.1]} raio={0.03} cor={mistura(F.turquesa, tema.fundo, 0.3)} position={[0, 0.4, 0]} />
      <Caixa args={[0.58, 0.76, 0.08]} raio={0.02} cor={tema.objetoClaro} position={[0.02, 0.4, -0.02]} sombra={false} />
      {/* Faixa de pedestre na capa */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Caixa key={i} args={[0.07, 0.36, 0.012]} raio={0.004} cor={tema.objetoClaro} position={[-0.2 + i * 0.1, 0.36, 0.057]} sombra={false} />
      ))}
      <Caixa args={[0.46, 0.08, 0.012]} raio={0.004} cor={tema.objetoClaro} position={[0, 0.66, 0.057]} sombra={false} />
    </group>
  );
};
export const RoloCompactador: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; giro: number}> = ({tema, pos, rotY = 0, escala, giro}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const corpo = mistura(F.dourado, tema.objetoEscuro, 0.2);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Rolo da frente (+x) e rodas de trás */}
      <group position={[0.62, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh rotation={[0, -giro, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.9, 28]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      </group>
      {[-0.42, 0.42].map((z) => (
        <group key={z} position={[-0.5, 0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh rotation={[0, -giro * 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.16, 22]} />
            <Fosco cor={tema.fundo} />
          </mesh>
        </group>
      ))}
      <Caixa args={[1.0, 0.36, 0.7]} raio={0.08} cor={corpo} position={[-0.3, 0.5, 0]} />
      <Caixa args={[0.5, 0.06, 1.0]} raio={0.03} cor={corpo} position={[0.62, 0.68, 0]} />
      {/* Cabine */}
      <Caixa args={[0.5, 0.42, 0.62]} raio={0.06} cor={mistura(tema.fundo, tema.objetoEscuro, 0.4)} position={[-0.38, 0.92, 0]} />
      <Caixa args={[0.6, 0.06, 0.72]} raio={0.03} cor={corpo} position={[-0.38, 1.16, 0]} />
    </group>
  );
};

// ---------- Lista do Contran (documento com 3 itens que acendem) ----------
export const ITENS_CONTRAN = ['PAVIMENTAÇÃO', 'RECAPEAMENTO', 'TAPA-BURACO'];
export const ListaContran: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; titulo: number; linhas: number; itens: number[]}> = ({tema, pos, rot = [0, 0, 0], escala, titulo, linhas, itens}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.areia, 0.14);
  const meio = mistura(tema.objetoClaro, tema.areia, 0.38); // papel grande claro estoura no bloom
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[2.6, 3.3, 0.06]} raio={0.03} cor={meio} position={[0, 0, -0.04]} />
      <Placa tema={{...tema, tinta: meio}} pos={[0, 1.3, 0]} larg={2.3} alt={0.5} linhas={[{t: 'RES. CONTRAN', tam: 130, cor: mistura(tema.objetoEscuro, tema.acento, 0.6 * titulo), peso: 900}, {t: '875/2021 · ART. 8º', tam: 80, cor: tema.objetoEscuro, peso: 700}]} fundo={meio} />
      {/* Linhas "escritas" que crescem */}
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[Math.max(0.05, 2.0 * Math.min(1, Math.max(0, linhas * 3 - i))), 0.06, 0.02]} raio={0.01} cor={mistura(meio, tema.objetoEscuro, 0.5)} position={[-1.0 + Math.max(0.025, 1.0 * Math.min(1, Math.max(0, linhas * 3 - i))), 0.85 - i * 0.17, 0.02]} sombra={false} />
      ))}
      {ITENS_CONTRAN.map((txt, i) => {
        const k = itens[i] ?? 0;
        const ultimo = i === 2;
        const cor = ultimo ? mistura(papel, tema.acento, k) : mistura(papel, mistura(tema.objeto, tema.objetoClaro, 0.5), k * 0.5);
        const s = 1 + (ultimo ? 0.12 * k : 0);
        return (
          <group key={txt} position={[0, 0.15 - i * 0.62, 0.02 + (ultimo ? 0.05 * k : 0)]} scale={s}>
            <Placa tema={{...tema, tinta: cor}} pos={[0.18, 0, 0]} larg={1.9} alt={0.46} linhas={[{t: txt, tam: 118, cor: ultimo && k > 0.5 ? tema.texto : tema.objetoEscuro, peso: 900}]} fundo={cor} />
            {/* Caixinha do ✓ */}
            <Caixa args={[0.36, 0.36, 0.04]} raio={0.04} cor={mistura(tema.objetoEscuro, ultimo ? tema.acento : tema.objeto, k * 0.6)} emissivo={0.2 * k} position={[-1.0, 0, 0]} />
            {k > 0.3 ? (
              <group position={[-1.0, 0, 0.04]} scale={Math.min(1, (k - 0.3) / 0.5)}>
                <Caixa args={[0.08, 0.16, 0.03]} raio={0.02} cor={tema.objetoClaro} rotation={[0, 0, 0.7]} position={[-0.06, -0.03, 0]} sombra={false} />
                <Caixa args={[0.08, 0.3, 0.03]} raio={0.02} cor={tema.objetoClaro} rotation={[0, 0, -0.6]} position={[0.05, 0.03, 0]} sombra={false} />
              </group>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Notebook grande do Portal da Transparência (tela troca por estado, sem redesenhar a cada quadro) ----------
export type TelaPortal = 'portal' | 'busca' | 'zero' | 'pedido';
const TELAS: Record<TelaPortal, (tema: Tema) => {t: string; tam: number; cor: string; peso?: number}[]> = {
  portal: (tema) => [
    {t: 'PORTAL DA', tam: 120, cor: tema.objetoClaro, peso: 900},
    {t: 'TRANSPARÊNCIA', tam: 120, cor: tema.objetoClaro, peso: 900},
    {t: 'DA SUA PREFEITURA', tam: 64, cor: tema.textoSuave, peso: 700},
  ],
  busca: (tema) => [
    {t: 'BUSCAR:', tam: 70, cor: tema.textoSuave, peso: 700},
    {t: '[ RECEITA DE MULTAS ]', tam: 96, cor: tema.objetoClaro, peso: 900},
  ],
  zero: (tema) => [
    {t: 'RECEITA DE MULTAS', tam: 72, cor: tema.textoSuave, peso: 700},
    {t: '0 RESULTADOS', tam: 140, cor: tema.objetoClaro, peso: 900},
  ],
  pedido: (tema) => [
    {t: 'PEDIDO DE INFORMAÇÃO', tam: 82, cor: tema.objetoClaro, peso: 900},
    {t: 'LEI DE ACESSO · GRÁTIS', tam: 70, cor: tema.textoSuave, peso: 700},
  ],
};
export const NotebookPortal: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; abre: number; tela: TelaPortal; luz: number}> = ({tema, pos, rotY = 0, escala, abre, tela, luz}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const corpo = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  const fundoTela = mistura(F.azulNoite, tema.fundo, 0.3);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Base com teclado */}
      <Caixa args={[3.0, 0.12, 2.0]} raio={0.05} cor={corpo} position={[0, 0.06, 0]} />
      <Caixa args={[2.6, 0.02, 1.0]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} position={[0, 0.125, -0.2]} sombra={false} />
      <Caixa args={[0.9, 0.02, 0.5]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.fundo, 0.15)} position={[0, 0.125, 0.62]} sombra={false} />
      {/* Tampa (abre de 0 a ~105°) */}
      <group position={[0, 0.12, -1.0]} rotation={[-(Math.PI / 2) * 1.15 * abre + Math.PI / 2, 0, 0]}>
        <Caixa args={[3.0, 2.0, 0.08]} raio={0.05} cor={corpo} position={[0, 1.0, 0]} />
        {abre > 0.3 ? (
          <group position={[0, 1.0, 0.045]}>
            <mesh>
              <planeGeometry args={[2.8, 1.82]} />
              <meshStandardMaterial color={fundoTela} emissive={fundoTela} emissiveIntensity={0.4 * luz} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
            </mesh>
            <Placa tema={{...tema, tinta: fundoTela}} pos={[0, 0, -0.01]} larg={2.6} alt={1.5} linhas={TELAS[tela](tema)} fundo={fundoTela} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Tracejado em arco (bolinhas) entre dois pontos ----------
export const ArcoPontos: React.FC<{a: V3; b: V3; k: number; cor: string; alt?: number; n?: number}> = ({a, b, k, cor, alt = 2, n = 22}) => {
  if (k < 0.02) return null;
  const m = Math.floor(n * k);
  return (
    <group>
      {Array.from({length: m}, (_, i) => {
        const u = i / (n - 1);
        const p: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * alt, a[2] + (b[2] - a[2]) * u];
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Cabo de "internet" (fio com bolinha de luz que corre) ----------
export const Cabo: React.FC<{tema: Tema; a: V3; b: V3; k: number; u: number}> = ({tema, a, b, k, u}) => {
  const curva = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 1.2, (a[2] + b[2]) / 2), new THREE.Vector3(...b)), [JSON.stringify(a), JSON.stringify(b)]); // eslint-disable-line react-hooks/exhaustive-deps
  const tubo = useMemo(() => new THREE.TubeGeometry(curva, 40, 0.035, 8, false), [curva]);
  useDescartar(tubo);
  if (k < 0.02) return null;
  const F = festa(tema);
  const p = curva.getPointAt(Math.max(0, Math.min(1, u)));
  return (
    <group>
      <mesh geometry={tubo}>
        <meshStandardMaterial color={mistura(tema.objetoEscuro, F.azul, 0.5)} emissive={F.azul} emissiveIntensity={0.2 * k} transparent opacity={k} />
      </mesh>
      {u > 0 && u < 1 ? (
        <mesh position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={F.azul} emissive={F.azul} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
};
