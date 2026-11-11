import React from 'react';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Escala 6x1 aprovada: ônibus, plantão 12x36, calendário do mês, relógio de ponto,
// lojinhas, Diário Oficial, contracheque, cadeira de praia e a mesa do Congresso.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Sem texturas: todo texto fica na interface 2D.

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
