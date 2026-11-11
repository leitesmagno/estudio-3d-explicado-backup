import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, useDescartar, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 012 (fake do ICMS). Tudo fosco, sem logo e sem rosto; texto fixo por peça.

const k01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------- Bomba da notícia: bomba de gasolina pequena com a placa da notícia (frente z+) ----------
// `apaga` 0..1 some com a palavra ESTADOS (a borracha da fábrica); `cinza` deixa tudo apagado.
export const BombaNoticia: React.FC<{tema: Tema; pos: V3; escala?: number; apaga: number; luz?: number}> = ({tema, pos, escala = 1, apaga, luz = 0}) => {
  if (escala < 0.02) return null;
  const corpo = mistura(tema.objetoClaro, tema.objeto, 0.25);
  const a = k01(apaga);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.62, 0.08, 0.5]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <Caixa args={[0.52, 1.0, 0.4]} raio={0.06} cor={corpo} position={[0, 0.58, 0]} />
      <Caixa args={[0.4, 0.22, 0.02]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.86, 0.205]} />
      {/* Mangueira e bico */}
      <mesh position={[0.3, 0.6, 0.05]} rotation={[0, 0, 0.1]}>
        <torusGeometry args={[0.18, 0.025, 8, 20, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.08, 0.2, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0.3, 0.72, 0.12]} />
      {/* Placa da notícia em cima */}
      <group position={[0, 1.5, 0]}>
        <Caixa args={[1.5, 0.62, 0.06]} raio={0.04} cor={mistura(tema.objetoClaro, tema.ceuLuz, 0.2)} emissivo={0.1 + 0.2 * luz} />
        {a < 0.98 ? (
          <group scale={[1 - a, 1, 1]}>
            <Placa tema={tema} pos={[0, 0.14, 0.035]} larg={1.36} alt={0.24} linhas={[{t: 'ESTADOS', tam: 200, cor: tema.objetoEscuro, peso: 900}]} brilho={0.15} />
          </group>
        ) : null}
        {a > 0.02 ? <Caixa args={[1.2 * a, 0.2, 0.01]} raio={0.04} cor={mistura(tema.objetoClaro, tema.objeto, 0.4)} sombra={false} position={[0, 0.14, 0.04]} /> : null}
        <Placa tema={tema} pos={[0, -0.14, 0.035]} larg={1.36} alt={0.24} linhas={[{t: 'AUMENTAM O ICMS', tam: 150, cor: tema.objetoEscuro, peso: 900}]} brilho={0.15} />
      </group>
    </group>
  );
};

// ---------- Bomba de posto grande (frente z+): visor escuro (o número vai na interface 2D) ----------
export const BombaPosto: React.FC<{tema: Tema; pos: V3; escala: number; nome: string; luz: number}> = ({tema, pos, escala, nome, luz}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[1.1, 0.14, 0.8]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.07, 0]} />
      <Caixa args={[0.9, 2.0, 0.6]} raio={0.08} cor={mistura(tema.objetoClaro, tema.objeto, 0.2)} position={[0, 1.14, 0]} />
      <Caixa args={[0.92, 0.32, 0.62]} raio={0.06} cor={mistura(tema.objetoEscuro, tema.acento, 0.6 * luz)} emissivo={0.25 * luz} position={[0, 2.3, 0]} />
      <Placa tema={tema} pos={[0, 2.3, 0.315]} larg={0.82} alt={0.24} linhas={[{t: nome, tam: 190, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
      {/* Visor */}
      <Caixa args={[0.72, 0.5, 0.03]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.6, 0.31]} />
      <Caixa args={[0.62, 0.38, 0.01]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.15 + 0.2 * luz)} emissivo={0.15 + 0.2 * luz} sombra={false} position={[0, 1.6, 0.33]} />
      {/* Mangueira e bico */}
      <mesh position={[0.52, 1.0, 0.1]} rotation={[0, 0, 0.05]}>
        <torusGeometry args={[0.32, 0.04, 8, 24, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.12, 0.34, 0.12]} raio={0.03} cor={tema.objetoEscuro} position={[0.5, 1.2, 0.34]} />
    </group>
  );
};

// ---------- Botijão de gás de 13 kg ----------
export const Botijao: React.FC<{tema: Tema; pos: V3; escala: number; luz?: number}> = ({tema, pos, escala, luz = 0}) => {
  if (escala < 0.02) return null;
  const cor = mistura(mistura(tema.objeto, tema.objetoClaro, 0.3), tema.acento, 0.5 * luz);
  return (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.12, 32]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.42, 8, 32]} />
        <Fosco cor={cor} emissivo={0.15 * luz} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <torusGeometry args={[0.16, 0.035, 8, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 8, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.08, 0.1, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.92, 0]} />
    </group>
  );
};

// ---------- Mesa redonda do Confaz: 27 lugares, uma sigla em cada; frente z+ ----------
export const SIGLAS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO', 'DF'];
export const MESA_R = 2.4;
// Ângulo de cada lugar: começa na frente (z+) e gira no sentido anti-horário visto de cima.
export const anguloLugar = (i: number) => (i / SIGLAS.length) * Math.PI * 2;
export const lugarMesa = (centro: V3, i: number, r: number): V3 => [centro[0] + Math.sin(anguloLugar(i)) * r, centro[1], centro[2] + Math.cos(anguloLugar(i)) * r];
const PlacaSigla: React.FC<{tema: Tema; sigla: string}> = ({tema, sigla}) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 128;
    cv.height = 64;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 44px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sigla, 64, 34);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [sigla]);
  useDescartar(tex);
  return (
    <mesh position={[0, 0, 0.026]}>
      <planeGeometry args={[0.36, 0.18]} />
      <meshBasicMaterial map={tex} transparent color={tema.objetoClaro} toneMapped={false} />
    </mesh>
  );
};
export const MesaRedonda: React.FC<{tema: Tema; pos: V3; sobe: number; acesas: number[]; verde: number; centro: number}> = ({tema, pos, sobe, acesas, verde, centro}) => {
  if (sobe < 0.02) return null;
  const tampo = mistura(mistura(tema.areia, tema.objetoEscuro, 0.35), tema.acento, 0.25 * verde);
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - sobe), pos[2]]}>
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[MESA_R, MESA_R, 0.08, 72]} />
        <Fosco cor={tampo} emissivo={0.1 * verde} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.72, 32]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {/* Placa CONFAZ no centro */}
      <group position={[0, 1.0, 0]}>
        {[0, Math.PI].map((r) => (
          <group key={r} rotation={[0, r, 0]}>
            <Caixa args={[1.3, 0.42, 0.06]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.85 * centro)} emissivo={0.3 * centro} position={[0, 0, 0.03]} />
            <Placa tema={tema} pos={[0, 0, 0.065]} larg={1.2} alt={0.32} linhas={[{t: 'CONFAZ', tam: 220, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
          </group>
        ))}
      </group>
      {SIGLAS.map((s, i) => {
        const a = anguloLugar(i);
        const k = k01(acesas[i] ?? 0);
        const r = MESA_R - 0.28;
        return (
          <group key={s} position={[Math.sin(a) * r, 0.88, Math.cos(a) * r]} rotation={[0, a, 0]}>
            <Caixa args={[0.42, 0.22, 0.05]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.85 * k)} emissivo={0.3 * k} sombra={false} />
            <PlacaSigla tema={tema} sigla={s} />
          </group>
        );
      })}
      {/* Cadeiras */}
      {SIGLAS.map((s, i) => {
        const a = anguloLugar(i);
        const r = MESA_R + 0.45;
        return (
          <group key={`c${s}`} position={[Math.sin(a) * r, 0, Math.cos(a) * r]} rotation={[0, a, 0]}>
            <Caixa args={[0.4, 0.06, 0.4]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.46, 0]} />
            <Caixa args={[0.4, 0.5, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.74, 0.2]} />
            <Caixa args={[0.06, 0.46, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.23, 0]} />
          </group>
        );
      })}
    </group>
  );
};

// ---------- Escola: prédio baixo com placa ESCOLA, mastro e um boletim com seta (frente z+) ----------
export const Escola: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; luz: number; seta: number}> = ({tema, pos, rotY = 0, escala, luz, seta}) => {
  if (escala < 0.02) return null;
  const parede = mistura(mistura(tema.objetoClaro, tema.objeto, 0.3), tema.acento, 0.25 * luz);
  const s = k01(seta);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[3.0, 1.5, 1.6]} raio={0.06} cor={parede} emissivo={0.08 * luz} position={[0, 0.75, 0]} />
      <Caixa args={[3.2, 0.16, 1.8]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.58, 0]} />
      {[-1.05, -0.35, 0.35, 1.05].map((x) => (
        <Caixa key={x} args={[0.42, 0.42, 0.02]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.2 + 0.5 * luz)} emissivo={0.25 * luz} sombra={false} position={[x, 0.95, 0.81]} />
      ))}
      <Caixa args={[0.5, 0.75, 0.02]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[0, 0.38, 0.81]} />
      <Caixa args={[1.6, 0.36, 0.06]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.85 * luz)} emissivo={0.3 * luz} position={[0, 1.95, 0.6]} />
      <Placa tema={tema} pos={[0, 1.95, 0.64]} larg={1.5} alt={0.28} linhas={[{t: 'ESCOLA', tam: 220, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
      {/* Mastro com bandeirinha genérica */}
      <Caixa args={[0.05, 2.2, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[1.9, 1.1, 0.5]} />
      <Caixa args={[0.5, 0.3, 0.02]} raio={0.01} cor={mistura(tema.objetoClaro, tema.acento, luz)} sombra={false} position={[2.16, 2.02, 0.5]} />
      {/* Boletim em pé ao lado, com barras e seta subindo */}
      <group position={[-2.3, 0, 0.6]}>
        <Caixa args={[0.06, 0.9, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.45, 0]} />
        <Caixa args={[0.9, 1.0, 0.04]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.3, 0]} />
        {[0.25, 0.42, 0.62].map((h, i) => {
          const hh = h * (i < 2 ? 1 : 0.4 + 0.6 * s);
          return <Caixa key={i} args={[0.16, hh, 0.02]} raio={0.01} cor={i === 2 ? mistura(tema.objeto, tema.acento, s) : tema.objeto} sombra={false} position={[-0.25 + i * 0.25, 0.9 + hh / 2, 0.03]} />;
        })}
        {s > 0.02 ? (
          <group position={[0.05, 1.45, 0.05]} rotation={[0, 0, 0.6]} scale={s}>
            <Caixa args={[0.6, 0.05, 0.02]} raio={0.01} cor={tema.acento} emissivo={0.3} sombra={false} />
            <Caixa args={[0.16, 0.05, 0.02]} raio={0.01} cor={tema.acento} emissivo={0.3} sombra={false} position={[0.25, 0.05, 0]} rotation={[0, 0, -0.9]} />
            <Caixa args={[0.16, 0.05, 0.02]} raio={0.01} cor={tema.acento} emissivo={0.3} sombra={false} position={[0.25, -0.05, 0]} rotation={[0, 0, 0.9]} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Fatia de moeda grande, de pé, de frente para a câmera (z+) ----------
// `de` e `ate` são frações da volta (0..1) a partir do topo, no sentido horário.
export const FatiaMoeda: React.FC<{tema: Tema; pos: V3; r: number; de: number; ate: number; brilho?: number; escala?: number; cor?: string}> = ({tema, pos, r, de, ate, brilho = 0, escala = 1, cor}) => {
  if (escala < 0.02 || ate - de < 0.005) return null;
  const c = cor ?? tema.acento;
  // cilindro deitado (eixo y → z): thetaStart conta a partir de +z no plano xz, que vira +y depois do giro de 90° em x
  const t0 = Math.PI - (ate * Math.PI * 2);
  const tl = (ate - de) * Math.PI * 2;
  return (
    <group position={pos} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[r, r, 0.12 * r + 0.02, 48, 1, false, t0, tl]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.2 + 0.4 * brilho} roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
