import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, useDescartar, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import {FONTE, type Tema} from '../../base/tema';
import {useFontesProntas} from '../../base/fontes';

// Peças do molde 001. escala 6x1 (o vídeo real "Escala 6x1 aprovada" do Explicando Direito).
// Este arquivo é completo: traz as peças novas do vídeo e as que ele aproveitou de vídeos anteriores.
// As mesmas peças (e muitas outras) estão na biblioteca src/pecas/ (índice em src/pecas/CATALOGO.md).
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Todas as cores vêm do tema.

// ---------- Ônibus (frente para x-) ----------
export const Onibus: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; farol?: number}> = ({tema, pos, rotY = 0, escala, farol = 0}) => {
  if (escala < 0.02) return null;
  const L = 3.2;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[L, 1.05, 1.0]} raio={0.14} cor={tema.objeto} position={[0, 0.78, 0]} />
      <Caixa args={[L + 0.02, 0.12, 1.02]} raio={0.04} cor={tema.corpo} position={[0, 0.5, 0]} />
      {/* Janelas dos dois lados e para-brisa */}
      {[-1, 1].map((l) => (
        <group key={l}>
          {Array.from({length: 5}).map((_, i) => (
            <Caixa key={i} args={[0.46, 0.36, 0.02]} raio={0.04} cor={tema.objetoEscuro} sombra={false} position={[-1.05 + i * 0.55, 1.0, 0.51 * l]} />
          ))}
        </group>
      ))}
      <Caixa args={[0.02, 0.48, 0.82]} raio={0.04} cor={tema.objetoEscuro} sombra={false} position={[-L / 2 - 0.005, 0.98, 0]} />
      {/* Porta */}
      <Caixa args={[0.4, 0.72, 0.02]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[-1.15, 0.68, 0.512]} />
      {/* Faróis */}
      {[-0.3, 0.3].map((z) => (
        <Caixa key={z} args={[0.03, 0.1, 0.18]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, 0.15 * farol)} emissivo={0.25 + 0.5 * farol} sombra={false} position={[-L / 2 - 0.01, 0.42, z]} />
      ))}
      {/* Rodas */}
      {[-1.05, 1.05].flatMap((x) =>
        [-1, 1].map((l) => (
          <mesh key={`${x}${l}`} position={[x, 0.24, 0.47 * l]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.14, 24]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        )),
      )}
    </group>
  );
};

// ---------- Barra do plantão 12x36: 48 horas, 12 de trabalho e 36 de descanso ----------
// `k` 0..1: a barra cresce da esquerda para a direita. `descanso` 0..1: as 36 h acendem.
export const BarraTurno: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; k: number; descanso: number}> = ({tema, pos, rotY = 0, escala = 1, k, descanso}) => {
  if (k < 0.01) return null;
  const h = 0.1;
  const total = 48 * h * k;
  const trab = Math.min(total, 12 * h);
  const desc = Math.max(0, total - 12 * h);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[48 * h + 0.16, 0.08, 0.5]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <Caixa args={[trab, 0.32, 0.36]} raio={0.06} cor={tema.objeto} position={[-2.4 + trab / 2, 0.24, 0]} />
      {desc > 0.02 ? <Caixa args={[desc - 0.04, 0.32, 0.36]} raio={0.06} cor={mistura(tema.corpo, tema.acento, descanso)} emissivo={0.3 * descanso} position={[-2.4 + 12 * h + 0.02 + desc / 2, 0.24, 0]} /> : null}
    </group>
  );
};

// ---------- Calendário do mês (quadro em pé, virado para z+) ----------
// 4 semanas × 7 dias. `acesas` 0..1: as folgas acendem. `troca` 0..1: as folgas passam da posição de sempre (SÁB e DOM)
// para a compensada (espalhadas, mas 8 no mês).
const FOLGA_NORMAL = (s: number, d: number) => d >= 5;
const COMPENSADA = [
  [1, 3, 5],
  [6],
  [0, 4],
  [2, 6],
];
const FOLGA_COMP = (s: number, d: number) => COMPENSADA[s].includes(d);
export const MesFolgas: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; acesas: number; troca: number}> = ({tema, pos, rotY = 0, escala, acesas, troca}) => {
  if (escala < 0.02) return null;
  const q = 0.3;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Pé */}
      <Caixa args={[0.12, 1.1, 0.12]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.55, -0.05]} />
      <Caixa args={[0.9, 0.08, 0.6]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.05]} />
      <group position={[0, 1.75, 0]}>
        <Caixa args={[7 * q + 0.24, 4 * q + 0.5, 0.08]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.1, -0.05]} />
        <Caixa args={[7 * q + 0.1, 0.16, 0.04]} raio={0.03} cor={tema.objeto} sombra={false} position={[0, 4 * q / 2 + 0.2, 0.01]} />
        {Array.from({length: 4}).flatMap((_, s) =>
          Array.from({length: 7}).map((__, d) => {
            const n = FOLGA_NORMAL(s, d) ? 1 : 0;
            const c = FOLGA_COMP(s, d) ? 1 : 0;
            const f = (n + (c - n) * troca) * acesas;
            return <Caixa key={`${s}${d}`} args={[q - 0.05, q - 0.05, 0.04]} raio={0.03} cor={mistura(tema.corpo, tema.acento, f)} emissivo={0.35 * f} sombra={false} position={[-3 * q + d * q, 1.5 * q - s * q, 0.02]} />;
          }),
        )}
      </group>
    </group>
  );
};

// ---------- Relógio de ponto (caixa num poste, com visor e cartão) ----------
// `visor` 0..1: aceso → apagado (0).
export const RelogioPonto: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; visor: number}> = ({tema, pos, rotY = 0, escala, visor}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.06, 0.4]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0]} />
      <Caixa args={[0.1, 1.1, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.6, 0]} />
      <Caixa args={[0.62, 0.8, 0.34]} raio={0.06} cor={tema.objeto} position={[0, 1.5, 0]} />
      <Caixa args={[0.46, 0.2, 0.02]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, visor)} emissivo={0.6 * visor} sombra={false} position={[0, 1.7, 0.175]} />
      {/* Fenda e cartão */}
      <Caixa args={[0.34, 0.04, 0.02]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 1.42, 0.175]} />
      <Caixa args={[0.26, 0.34, 0.012]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[0, 1.28, 0.19]} />
    </group>
  );
};

// ---------- Lojinha (ME / EPP): corpo, vitrine, porta e toldo listrado ----------
export const Lojinha: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; larg?: number; toldo?: number}> = ({tema, pos, rotY = 0, escala, larg = 1.6, toldo = 0}) => {
  if (escala < 0.02) return null;
  const A = 1.5 + 0.25 * (larg - 1.6);
  const n = Math.round(larg / 0.2);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[larg, A, 1.0]} raio={0.06} cor={tema.objeto} position={[0, A / 2, 0]} />
      <Caixa args={[larg + 0.08, 0.1, 1.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, A + 0.05, 0]} />
      {/* Vitrine e porta */}
      <Caixa args={[larg * 0.5, 0.6, 0.02]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[-larg * 0.18, 0.75, 0.505]} />
      <Caixa args={[0.34, 0.9, 0.02]} raio={0.03} cor={tema.corpo} sombra={false} position={[larg * 0.3, 0.45, 0.505]} />
      {/* Toldo */}
      <group position={[0, A - 0.15, 0.62]} rotation={[0.45, 0, 0]}>
        {Array.from({length: n}).map((_, i) => (
          <Caixa key={i} args={[larg / n, 0.04, 0.5]} raio={0.012} cor={i % 2 === 0 ? mistura(tema.corpo, tema.acento, toldo) : tema.objetoClaro} position={[-larg / 2 + (larg / n) * (i + 0.5), 0, 0]} />
        ))}
      </group>
    </group>
  );
};

// ---------- Diário Oficial (jornal dobrado, deitado) ----------
export const DiarioOficial: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; destaque?: number}> = ({tema, pos, rot = [0, 0, 0], escala, destaque = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {[0, 1].map((i) => (
        <Caixa key={i} args={[0.9, 0.02, 1.2]} raio={0.008} cor={tema.objetoClaro} position={[0.01 * i, 0.012 + i * 0.022, -0.008 * i]} />
      ))}
      {/* Cabeçalho, manchete e colunas */}
      <Caixa args={[0.8, 0.008, 0.14]} raio={0.003} cor={mistura(tema.objetoEscuro, tema.acento, destaque)} emissivo={0.3 * destaque} sombra={false} position={[0.01, 0.06, -0.47]} />
      <Caixa args={[0.8, 0.006, 0.012]} raio={0.002} cor={tema.objetoEscuro} sombra={false} position={[0.01, 0.06, -0.37]} />
      <Caixa args={[0.66, 0.006, 0.07]} raio={0.002} cor={tema.objetoEscuro} sombra={false} position={[0.01, 0.06, -0.29]} />
      {[-0.27, 0.01, 0.29].map((x) =>
        Array.from({length: 8}).map((_, i) => (
          <Caixa key={`${x}${i}`} args={[0.22, 0.005, 0.022]} raio={0.002} cor={tema.corpo} sombra={false} position={[x, 0.06, -0.18 + i * 0.085]} />
        )),
      )}
    </group>
  );
};

// ---------- Contracheque (folha em pé num suporte, virada para z+) ----------
// `salario` e `piso` 0..1: as linhas acendem.
export const Contracheque: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; salario: number; piso: number}> = ({tema, pos, rotY = 0, escala, salario, piso}) => {
  if (escala < 0.02) return null;
  const linha = (y: number, w: number, k: number, grossa = false) => <Caixa args={[w, grossa ? 0.07 : 0.035, 0.012]} raio={0.008} cor={mistura(tema.corpo, tema.acento, k)} emissivo={0.5 * k} sombra={false} position={[-0.32 + w / 2, y, 0.02]} />;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.1]} />
      <group position={[0, 0.82, 0]} rotation={[-0.12, 0, 0]}>
        <Caixa args={[0.8, 1.2, 0.025]} raio={0.01} cor={tema.objetoClaro} />
        <Caixa args={[0.66, 0.1, 0.012]} raio={0.008} cor={tema.objetoEscuro} sombra={false} position={[0, 0.47, 0.02]} />
        {[0.3, 0.2, 0.1].map((y, i) => linha(y, 0.5 - i * 0.08, 0))}
        {linha(-0.05, 0.64, salario, true)}
        {[-0.18, -0.26].map((y, i) => linha(y, 0.4 + i * 0.1, 0))}
        <Caixa args={[0.66, 0.008, 0.012]} raio={0.002} cor={tema.objetoEscuro} sombra={false} position={[0, -0.36, 0.02]} />
        {linha(-0.45, 0.64, piso, true)}
      </group>
    </group>
  );
};

// ---------- Cadeira de praia (`abre` 0..1: dobrada → aberta) ----------
export const CadeiraPraia: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; abre: number}> = ({tema, pos, rotY = 0, escala, abre}) => {
  if (escala < 0.02) return null;
  const enc = -0.15 - 1.0 * abre;
  const tubo = (p: V3, r: V3, h: number) => (
    <mesh position={p} rotation={r} castShadow>
      <cylinderGeometry args={[0.018, 0.018, h, 8]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
  );
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Pernas */}
      {[-0.22, 0.22].map((x) => (
        <group key={x}>
          {tubo([x, 0.12, 0.12], [0.9, 0, 0], 0.34)}
          {tubo([x, 0.12, -0.12], [-0.9, 0, 0], 0.34)}
        </group>
      ))}
      {/* Assento */}
      <group position={[0, 0.24, 0.04]}>
        {Array.from({length: 5}).map((_, i) => (
          <Caixa key={i} args={[0.44 / 5, 0.02, 0.36]} raio={0.008} cor={i % 2 === 0 ? tema.acento : tema.objetoClaro} emissivo={i % 2 === 0 ? 0.2 : 0} position={[-0.22 + (0.44 / 5) * (i + 0.5), 0, 0]} />
        ))}
      </group>
      {/* Encosto, gira na traseira do assento */}
      <group position={[0, 0.25, -0.14]} rotation={[enc, 0, 0]}>
        {Array.from({length: 5}).map((_, i) => (
          <Caixa key={i} args={[0.44 / 5, 0.5, 0.02]} raio={0.008} cor={i % 2 === 0 ? tema.acento : tema.objetoClaro} emissivo={i % 2 === 0 ? 0.2 : 0} position={[-0.22 + (0.44 / 5) * (i + 0.5), 0.25, 0]} />
        ))}
      </group>
    </group>
  );
};

// ---------- Mesa do Congresso: mesa comprida com duas cadeiras de espaldar alto ----------
// `brilho` 0..1: o tampo e os dois documentos acendem (promulgação).
export const MesaCongresso: React.FC<{tema: Tema; pos: V3; escala: number; brilho?: number}> = ({tema, pos, escala, brilho = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[3.2, 0.1, 1.0]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.82, 0]} />
      <Caixa args={[3.0, 0.72, 0.08]} raio={0.03} cor={tema.objeto} position={[0, 0.41, 0.42]} />
      {[-1.45, 1.45].map((x) => (
        <Caixa key={x} args={[0.1, 0.78, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.39, 0]} />
      ))}
      {[-0.75, 0.75].map((x) => (
        <group key={x}>
          {/* Cadeira atrás da mesa */}
          <Caixa args={[0.6, 0.08, 0.55]} raio={0.03} cor={tema.corpo} position={[x, 0.55, -0.75]} />
          <Caixa args={[0.6, 1.2, 0.1]} raio={0.04} cor={tema.corpo} position={[x, 1.15, -1.02]} />
          <Caixa args={[0.08, 0.55, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.27, -0.75]} />
          {/* Documento na mesa */}
          <Caixa args={[0.5, 0.012, 0.64]} raio={0.004} cor={mistura(tema.objetoClaro, tema.acento, 0.25 * brilho)} emissivo={0.3 * brilho} sombra={false} position={[x, 0.88, 0.05]} />
        </group>
      ))}
    </group>
  );
};

// ===== vindas do vídeo "bets" =====

// ---------- Moeda com cor livre (a da base é sempre do acento) ----------
const G_MOEDA = new THREE.CylinderGeometry(1, 1, 0.26, 40);

const G_ARO = new THREE.RingGeometry(0.62, 0.7, 40);

export const MoedaCor: React.FC<{tema: Tema; pos: V3; rot?: V3; r?: number; cor?: string; brilho?: number; escala?: number}> = ({tema, pos, rot = [0, 0, 0], r = 0.2, cor, brilho = 0, escala = 1}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.acento;
  return (
    <group position={pos} rotation={rot} scale={r * escala}>
      <mesh geometry={G_MOEDA} castShadow>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15 + 0.6 * brilho} roughness={0.38} metalness={0.2} />
      </mesh>
      <mesh geometry={G_ARO} position={[0, 0.131, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={tema.tinta} transparent opacity={0.22} />
      </mesh>
      <mesh geometry={G_ARO} position={[0, -0.131, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={tema.tinta} transparent opacity={0.22} />
      </mesh>
    </group>
  );
};

// ---------- Prédio de colunas (genérico) ----------
export const PredioColunas: React.FC<{tema: Tema; pos: V3; aceso: number; escala?: number}> = ({tema, pos, aceso, escala = 1}) => {
  const cor = mistura(tema.branco, tema.objeto, aceso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[3.6, 0.24, 2.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.12, 0]} />
      <Caixa args={[3.3, 0.14, 2.0]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.31, 0]} />
      {[-1.3, -0.78, -0.26, 0.26, 0.78, 1.3].map((x) => (
        <mesh key={x} position={[x, 1.18, 0.85]} castShadow>
          <cylinderGeometry args={[0.1, 0.11, 1.6, 20]} />
          <Fosco cor={cor} emissivo={0.12 * aceso} />
        </mesh>
      ))}
      <Caixa args={[3.0, 1.6, 1.4]} raio={0.05} cor={tema.branco} position={[0, 1.18, -0.15]} />
      <Caixa args={[3.6, 0.22, 2.1]} raio={0.04} cor={cor} emissivo={0.08 * aceso} position={[0, 2.09, 0]} />
      {/* Frontão triangular */}
      <mesh position={[0, 2.42, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.25, 1.75, 1.0]} castShadow>
        <cylinderGeometry args={[1, 1, 2.0, 3]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
    </group>
  );
};

// ---------- Prédio largo com duas cúpulas (genérico) ----------
export const PredioLargo: React.FC<{tema: Tema; pos: V3; aceso: number; escala?: number}> = ({tema, pos, aceso, escala = 1}) => {
  const cor = mistura(tema.branco, tema.objeto, aceso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[5.0, 0.7, 2.2]} raio={0.06} cor={cor} emissivo={0.06 * aceso} position={[0, 0.35, 0]} />
      <Caixa args={[5.2, 0.08, 2.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.74, 0]} />
      {/* Cúpula virada para cima e outra para baixo */}
      <mesh position={[-1.3, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
      <mesh position={[1.3, 1.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Fosco cor={cor} emissivo={0.08 * aceso} />
      </mesh>
      {/* Duas lâminas altas ao fundo */}
      {[-0.18, 0.18].map((x) => (
        <Caixa key={x} args={[0.3, 2.6, 0.9]} raio={0.04} cor={tema.branco} position={[x, 1.3, -0.7]} />
      ))}
    </group>
  );
};

// ---------- Documento grande (a medida provisória) ----------
export const DocumentoGrande: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; carimbo?: number}> = ({tema, pos, rot = [0, 0, 0], escala, carimbo = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[1.1, 0.02, 1.45]} raio={0.008} cor={tema.objetoClaro} position={[0.015 * i, 0.012 + i * 0.022, -0.01 * i]} />
      ))}
      {/* Linhas de texto (sem texto real) */}
      {Array.from({length: 7}).map((_, i) => (
        <mesh key={i} position={[-0.05, 0.07, -0.5 + i * 0.13]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[i === 0 ? 0.6 : 0.85 - (i % 3) * 0.12, i === 0 ? 0.07 : 0.035]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      ))}
      {/* Marca do carimbo */}
      {carimbo > 0.02 ? (
        <mesh position={[0.18, 0.072, 0.38]} rotation={[-Math.PI / 2, 0, -0.12]} scale={carimbo}>
          <ringGeometry args={[0.16, 0.2, 40]} />
          <meshBasicMaterial color={tema.acento} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );

// ---------- Carimbo de mão ----------
export const Carimbo3D: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.5, 0.1, 0.32]} raio={0.03} cor={tema.acento} emissivo={0.2} position={[0, 0.05, 0]} />
      <Caixa args={[0.38, 0.12, 0.22]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.16, 0]} />
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.3, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.12, 20, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

// ===== vindas do vídeo "escala6x1" =====

// ---------- Bloco de um dia da semana ----------
// `aceso` 0..1: sai do escuro para a cor do dia. `descanso` 0..1: grafite (trabalho) → acento (folga).
export const DiaBloco: React.FC<{tema: Tema; pos: V3; aceso: number; descanso: number; escala?: number}> = ({tema, pos, aceso, descanso, escala = 1}) => {
  if (escala < 0.02) return null;
  const trabalho = mistura(tema.objetoEscuro, tema.corpo, aceso);
  const cor = mistura(trabalho, tema.acento, descanso);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.85, 0.15, 0.85]} raio={0.05} cor={cor} emissivo={0.06 * aceso + 0.3 * descanso} position={[0, 0.075, 0]} />
    </group>
  );
};

// ---------- Cubinho de uma hora de trabalho ----------
// `claro` 0..1: grafite → claro (a hora "vale mais").
export const CuboHora: React.FC<{tema: Tema; pos: V3; escala?: number; claro?: number}> = ({tema, pos, escala = 1, claro = 0}) =>
  escala < 0.02 ? null : (
    <Caixa args={[0.2 * escala, 0.2 * escala, 0.2 * escala]} raio={0.035 * escala} cor={mistura(tema.objeto, tema.objetoClaro, claro)} emissivo={0.12 * claro} position={pos} />
  );

// ---------- Livro de leis (de pé, virado para a frente, z+) ----------
// `abre` 0..1: capa esquerda gira na lombada. `folha` 0..n: páginas que já passaram (fração = página virando).
// `capa` 0..1: a faixa da capa vai para o acento (vira "Constituição"). `fitas`: marcadores pendurados [k, destaque].
const PAG = {w: 0.78, h: 1.08};

export const LivroLei: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre: number; folha?: number; capa?: number; fitas?: [number, number][]}> = ({tema, pos, rot = [0, 0, 0], escala, abre, folha = 0, capa = 0, fitas = []}) => {
  if (escala < 0.02) return null;
  const corCapa = mistura(tema.objetoEscuro, tema.tinta, 0.15);
  const faixa = mistura(tema.objeto, tema.acento, capa);
  const linhas = (lado: number) =>
    Array.from({length: 9}).map((_, i) => (
      <mesh key={i} position={[lado * (PAG.w / 2 + 0.02) - 0.03 * lado, 0.38 - i * 0.095, 0.052]}>
        <planeGeometry args={[i === 0 ? 0.4 : 0.6 - (i % 3) * 0.1, i === 0 ? 0.05 : 0.026]} />
        <meshBasicMaterial color={tema.objetoEscuro} />
      </mesh>
    ));
  const ang = Math.PI * (1 - abre);
  const virando = folha % 1;
  const passadas = Math.min(3, Math.floor(folha));
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* Metade direita: capa + bloco de páginas */}
      <Caixa args={[PAG.w + 0.06, PAG.h + 0.06, 0.03]} raio={0.02} cor={corCapa} position={[(PAG.w + 0.06) / 2, 0, -0.015]} />
      <Caixa args={[PAG.w, PAG.h, 0.05]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[PAG.w / 2 + 0.02, 0, 0.025]} />
      {abre > 0.6 ? linhas(1) : null}
      {/* Metade esquerda: gira na lombada (x = 0) */}
      {/* Fechado, a metade esquerda deita por cima das páginas da direita */}
      <group rotation={[0, ang, 0]} position={[0, 0, 0.1 * (1 - abre)]}>
        <Caixa args={[PAG.w + 0.06, PAG.h + 0.06, 0.03]} raio={0.02} cor={corCapa} position={[-(PAG.w + 0.06) / 2, 0, -0.015]} />
        <Caixa args={[PAG.w, PAG.h, 0.05]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[-PAG.w / 2 - 0.02, 0, 0.025]} />
        {abre > 0.6 ? linhas(-1) : null}
        {/* Faixa da capa (lado de fora) */}
        <Caixa args={[PAG.w * 0.7, 0.16, 0.012]} raio={0.005} cor={faixa} emissivo={0.25 * capa} sombra={false} position={[-(PAG.w + 0.06) / 2, 0.22, -0.036]} />
      </group>
      {/* Páginas virando, da direita para a esquerda */}
      {abre > 0.9
        ? Array.from({length: passadas + (virando > 0.01 ? 1 : 0)}).map((_, i) => {
            const a = i < passadas ? Math.PI : Math.PI * virando;
            return (
              <group key={i} rotation={[0, a, 0]} position={[0, 0, 0.052 + 0.003 * i]}>
                <mesh position={[PAG.w / 2, 0, 0]}>
                  <planeGeometry args={[PAG.w - 0.04, PAG.h - 0.04]} />
                  <meshStandardMaterial color={tema.objetoClaro} roughness={0.8} side={2} />
                </mesh>
              </group>
            );
          })
        : null}
      {/* Fitas marcadoras saindo por baixo */}
      {fitas.map(([k, dest], i) =>
        k < 0.02 ? null : (
          <Caixa key={i} args={[0.07, 0.5 * k, 0.012]} raio={0.005} cor={mistura(tema.objeto, tema.acento, dest)} emissivo={0.3 * dest} sombra={false} position={[0.22 + i * 0.26, -PAG.h / 2 - 0.25 * k, 0.06]} />
        ),
      )}
    </group>
  );
};

// ---------- Crachá (pendurado no peito do boneco; usar como filho do Boneco) ----------
export const Cracha: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Caixa args={[0.16, 0.2, 0.02]} raio={0.02} cor={tema.objetoClaro} sombra={false} />
      <Caixa args={[0.12, 0.04, 0.022]} raio={0.008} cor={tema.acento} emissivo={0.3} sombra={false} position={[0, 0.05, 0.002]} />
    </group>
  );

// ---------- Diploma (canudo com fita) ----------
export const Diploma: React.FC<{tema: Tema; pos: V3; rot?: V3; k: number}> = ({tema, pos, rot = [0, 0, Math.PI / 2], k}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={k}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 20]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.065, 0.065, 0.07, 20]} />
        <Fosco cor={tema.acento} emissivo={0.3} />
      </mesh>
    </group>
  );

// ---------- Mesa da sanção (mesa pequena e caneta) ----------
// `caneta` 0..1: brilho da caneta (acende e depois apaga).
export const MesaSancao: React.FC<{tema: Tema; pos: V3; escala?: number; caneta: number}> = ({tema, pos, escala = 1, caneta}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[1.6, 0.08, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.78, 0]} />
      {[
        [-0.7, -0.36],
        [0.7, -0.36],
        [-0.7, 0.36],
        [0.7, 0.36],
      ].map(([x, z], i) => (
        <Caixa key={i} args={[0.08, 0.74, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.37, z]} />
      ))}
      {/* Folha e caneta */}
      <Caixa args={[0.5, 0.012, 0.66]} raio={0.004} cor={tema.objetoClaro} sombra={false} position={[0.1, 0.826, 0.02]} />
      <mesh position={[0.45, 0.845, 0.05]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.4, 16]} />
        <Fosco cor={mistura(tema.objeto, tema.acento, caneta)} emissivo={0.5 * caneta} />
      </mesh>
    </group>
  );

// ---------- Placar de votos: 5 gomos, `acesos` 0..5 (fração = gomo acendendo) ----------
export const PlacarVotos: React.FC<{tema: Tema; pos: V3; escala: number; acesos: number}> = ({tema, pos, escala, acesos}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[2.1, 0.5, 0.1]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0, -0.06]} />
      {Array.from({length: 5}).map((_, i) => {
        const k = Math.max(0, Math.min(1, acesos - i));
        return <Caixa key={i} args={[0.34, 0.32, 0.08]} raio={0.04} cor={mistura(tema.corpo, tema.acento, k)} emissivo={0.4 * k} sombra={false} position={[-0.8 + i * 0.4, 0, 0.02]} />;
      })}
    </group>
  );

// ---------- Linha do tempo no chão, com marcos ----------
// `k` 0..1: quanto da linha já nasceu. `acesa` 0..1: quanto já acendeu (da esquerda para a direita).
export type Marco = {x: number; k: number; aceso: number};

export const LinhaChao: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number; acesa: number; marcos: Marco[]}> = ({tema, x0, x1, z, k, acesa, marcos}) => {
  if (k < 0.01) return null;
  const len = (x1 - x0) * k;
  const lenAceso = (x1 - x0) * Math.min(k, acesa);
  return (
    <group position={[0, 0, z]}>
      <Caixa args={[len, 0.04, 0.1]} raio={0.02} cor={tema.objetoEscuro} position={[x0 + len / 2, 0.02, 0]} />
      {lenAceso > 0.01 ? <Caixa args={[lenAceso, 0.05, 0.11]} raio={0.02} cor={tema.acento} emissivo={0.5} sombra={false} position={[x0 + lenAceso / 2, 0.025, 0]} /> : null}
      {marcos.map((m, i) =>
        m.k < 0.02 ? null : (
          <group key={i} position={[m.x, 0, 0]} scale={m.k}>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
              <Fosco cor={mistura(tema.objeto, tema.acento, m.aceso)} emissivo={0.5 * m.aceso} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
              <Fosco cor={tema.objeto} />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
};

// ---------- Linha tracejada no chão (separa quem fica de fora) ----------
export const Tracejado: React.FC<{tema: Tema; a: V3; b: V3; k: number}> = ({tema, a, b, k}) => {
  if (k < 0.01) return null;
  const n = 14;
  const ang = Math.atan2(b[0] - a[0], b[2] - a[2]);
  return (
    <>
      {Array.from({length: Math.ceil(n * k)}).map((_, i) => {
        const s = (i + 0.5) / n;
        return <Caixa key={i} args={[0.08, 0.03, 0.14]} raio={0.01} cor={tema.acento} emissivo={0.4} sombra={false} position={[a[0] + (b[0] - a[0]) * s, 0.02, a[2] + (b[2] - a[2]) * s]} rotation={[0, ang, 0]} />;
      })}
    </>
  );
};

// ===== vindas do vídeo "escala6x1b" =====

// ---------- Barraquinha (o pequeno negócio): balcão com toldo listrado ----------
export const Barraquinha: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; toldo?: number}> = ({tema, pos, rotY = 0, escala, toldo = 0}) => {
  if (escala < 0.02) return null;
  const L = 1.8;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[L, 0.75, 0.7]} raio={0.04} cor={tema.objeto} position={[0, 0.375, 0]} />
      <Caixa args={[L + 0.1, 0.06, 0.8]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.78, 0]} />
      {[-1, 1].map((l) => (
        <mesh key={l} position={[(L / 2 - 0.05) * l, 1.15, -0.3]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.3, 10]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      ))}
      <group position={[0, 2.2, 0]} rotation={[0.3, 0, 0]}>
        {Array.from({length: 8}).map((_, i) => (
          <Caixa key={i} args={[L / 8, 0.04, 1.1]} raio={0.015} cor={i % 2 === 0 ? mistura(tema.corpo, tema.acento, toldo) : tema.objetoClaro} position={[-L / 2 + (L / 8) * (i + 0.5), 0, 0]} />
        ))}
      </group>
      {/* Caixinhas no balcão */}
      {[-0.55, -0.15, 0.3].map((x, i) => (
        <Caixa key={i} args={[0.24, 0.2 + 0.06 * i, 0.22]} raio={0.03} cor={tema.objetoClaro} position={[x, 0.91 + 0.03 * i, 0.05]} />
      ))}
    </group>
  );
};

// ===== vindas do vídeo "juros" =====

// ---------- Órgão público com letreiro ----------
// `sobe` 0..1: nasce do chão. `letreiro` 0..1: o nome acende. `porta` 0..1: abre. O letreiro é uma textura fixa.
const useLetreiro = (texto: string) => {
  const prontas = useFontesProntas();
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = 256;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, 1024, 256);
    ctx.font = `900 190px ${FONTE}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, 512, 138);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [texto, prontas]);
  useDescartar(tex);
  return tex;
};

export const OrgaoPublico: React.FC<{tema: Tema; pos: V3; escala: number; sobe: number; letreiro: number; porta?: number; texto: string}> = ({tema, pos, escala, sobe, letreiro, porta = 0, texto}) => {
  const tex = useLetreiro(texto);
  if (sobe < 0.01) return null;
  const parede = tema.objeto;
  const coluna = tema.objetoClaro;
  return (
    <group position={[pos[0], pos[1] - 3.4 * escala * (1 - sobe), pos[2]]} scale={escala}>
      {/* Escadaria */}
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[4.4 - i * 0.25, 0.16, 2.9 - i * 0.25]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.08 + i * 0.16, 0.1 - i * 0.05]} />
      ))}
      {/* Corpo */}
      <Caixa args={[3.6, 2.0, 1.8]} raio={0.05} cor={parede} position={[0, 1.48, -0.25]} />
      {/* Colunas */}
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((x) => (
        <group key={x} position={[x, 0, 0.95]}>
          <mesh position={[0, 1.48, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 2.0, 20]} />
            <Fosco cor={coluna} />
          </mesh>
          <Caixa args={[0.34, 0.08, 0.34]} raio={0.02} cor={coluna} position={[0, 0.52, 0]} />
          <Caixa args={[0.34, 0.08, 0.34]} raio={0.02} cor={coluna} position={[0, 2.44, 0]} />
        </group>
      ))}
      {/* Porta grande */}
      <Caixa args={[0.9, 1.3, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.13, 0.66]} sombra={false} />
      {[-1, 1].map((l) => (
        <group key={l} position={[0.45 * l, 1.13, 0.7]} rotation={[0, -l * 1.2 * porta, 0]}>
          <Caixa args={[0.44, 1.26, 0.05]} raio={0.02} cor={mistura(tema.branco, tema.objeto, 0.4)} position={[-0.22 * l, 0, 0]} sombra={false} />
        </group>
      ))}
      {porta > 0.05 ? <Caixa args={[0.86, 1.24, 0.02]} raio={0.01} cor={tema.objetoClaro} emissivo={0.6 * porta} position={[0, 1.13, 0.64]} sombra={false} /> : null}
      {/* Entablamento com o letreiro */}
      <Caixa args={[4.0, 0.5, 2.3]} raio={0.04} cor={parede} position={[0, 2.73, 0.0]} />
      <Caixa args={[4.1, 0.08, 2.4]} raio={0.02} cor={coluna} position={[0, 2.99, 0.0]} />
      <Caixa args={[2.5, 0.42, 0.04]} raio={0.02} cor={tema.objetoEscuro} position={[0, 2.73, 1.16]} sombra={false} />
      <mesh position={[0, 2.73, 1.19]}>
        <planeGeometry args={[2.6, 0.65]} />
        <meshStandardMaterial map={tex} transparent color={mistura(tema.corpo, tema.objetoClaro, letreiro)} emissive={tema.objetoClaro} emissiveMap={tex} emissiveIntensity={1.1 * letreiro} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Frontão */}
      <mesh position={[0, 3.32, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 2.1, 1.1]} castShadow>
        <cylinderGeometry args={[1, 1, 2.0, 3]} />
        <Fosco cor={parede} />
      </mesh>
      {/* Mastro sem bandeira (não é marca) */}
      <mesh position={[1.75, 3.6, 0.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  );
};

// ---------- Escudo ----------
export const Escudo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; acende?: number}> = ({tema, pos, rotY = 0, escala, acende = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh position={[0, 0.8, -0.85]} castShadow>
        <cylinderGeometry args={[1, 1, 1.4, 32, 1, true, -0.55, 1.1]} />
        <meshStandardMaterial color={mistura(tema.objeto, tema.acento, acende)} emissive={tema.acento} emissiveIntensity={0.35 * acende} roughness={0.6} side={2} />
      </mesh>
      {/* Aro e centro */}
      <mesh position={[0, 0.8, 0.16]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.18, 28]} />
        <meshStandardMaterial color={mistura(tema.objetoClaro, tema.acento, acende)} emissive={tema.acento} emissiveIntensity={0.5 * acende} side={2} />
      </mesh>
      {[1.5, 0.1].map((y) => (
        <mesh key={y} position={[0, y, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.025, 6, 32, 1.1]} />
          <meshStandardMaterial color={tema.objetoClaro} />
        </mesh>
      ))}
    </group>
  );

// ---------- Folha (papel voando) ----------
export const Folha: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.34, 0.012, 0.44]} raio={0.004} cor={tema.objetoClaro} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.02, 0.008, -0.12 + i * 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.22 - (i % 2) * 0.06, 0.025]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      ))}
    </group>
  );

// ===== vindas do vídeo "intimacao" =====

// ---------- Ampulheta ----------
// `areia`: quanto ainda há em cima (0..1). `virar`: rotação em torno do centro. `fio`: mostra o filete caindo.
export const Ampulheta: React.FC<{tema: Tema; pos: V3; escala?: number; areia: number; virar?: number; fio?: boolean}> = ({tema, pos, escala = 1, areia, virar = 0, fio}) => {
  if (escala < 0.02) return null;
  const a = Math.max(0, Math.min(1, areia));
  const hC = 0.2 * Math.sqrt(a);
  const hB = 0.2 * Math.sqrt(1 - a);
  return (
    <group position={pos} scale={escala}>
      <group position={[0, 0.25, 0]} rotation={[0, 0, virar]}>
        <group position={[0, -0.25, 0]}>
          {[0.015, 0.485].map((y) => (
            <mesh key={y} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.145, 0.145, 0.03, 32]} />
              <Fosco cor={tema.areia} />
            </mesh>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.125, 0.25, Math.sin((i * 2 * Math.PI) / 3) * 0.125]} castShadow>
              <cylinderGeometry args={[0.011, 0.011, 0.46, 10]} />
              <Fosco cor={tema.areia} />
            </mesh>
          ))}
          {/* Vidro */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.014, 0.105, 0.22, 32, 1, true]} />
            <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.22} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.105, 0.014, 0.22, 32, 1, true]} />
            <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.22} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Areia: em cima, um cone que esvazia; embaixo, um monte que cresce */}
          {hC > 0.004 ? (
            <mesh position={[0, 0.255 + hC / 2, 0]}>
              <cylinderGeometry args={[0.014 + 0.09 * (hC / 0.2), 0.012, hC, 28]} />
              <Fosco cor={tema.acento} emissivo={0.25} />
            </mesh>
          ) : null}
          {hB > 0.004 ? (
            <mesh position={[0, 0.03 + hB / 2, 0]}>
              <cylinderGeometry args={[0.012 + 0.03 * (1 - hB / 0.2), 0.012 + 0.09 * (hB / 0.2), hB, 28]} />
              <Fosco cor={tema.acento} emissivo={0.25} />
            </mesh>
          ) : null}
          {fio && a > 0.002 ? (
            <mesh position={[0, 0.03 + hB + (0.25 - 0.03 - hB) / 2, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.25 - 0.03 - hB, 6]} />
              <Fosco cor={tema.acento} emissivo={0.4} />
            </mesh>
          ) : null}
        </group>
      </group>
    </group>
  );
};

export const Calendario: React.FC<{tema: Tema; pos: V3; escala: number; folhas?: number}> = ({tema, pos, escala, folhas = 0}) => {
  if (escala < 0.02) return null;
  const virando = folhas - Math.floor(folhas);
  return (
    <group position={pos} scale={escala}>
      <group rotation={[-0.25, 0, 0]}>
        <Caixa args={[0.22, 0.2, 0.025]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.1, -0.005]} />
        <Caixa args={[0.2, 0.17, 0.006]} raio={0.002} cor={tema.objetoClaro} position={[0, 0.09, 0.012]} />
        <Caixa args={[0.2, 0.035, 0.008]} raio={0.002} cor={tema.acento} emissivo={0.3} position={[0, 0.175, 0.014]} />
        {/* Grade de dias */}
        {Array.from({length: 12}, (_, i) => (
          <Caixa key={i} args={[0.032, 0.022, 0.003]} raio={0.001} cor={(i + Math.floor(folhas)) % 7 === 3 ? tema.acento : tema.corpo} position={[-0.06 + (i % 4) * 0.04, 0.13 - Math.floor(i / 4) * 0.035, 0.017]} />
        ))}
        {virando > 0.02 && virando < 0.98 ? (
          <group position={[0, 0.175, 0.02]} rotation={[-virando * Math.PI * 0.9, 0, 0]}>
            <Caixa args={[0.2, 0.15, 0.004]} raio={0.002} cor={tema.objetoClaro} position={[0, -0.075, 0]} />
          </group>
        ) : null}
      </group>
    </group>
  );
};
