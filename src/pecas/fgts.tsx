import React from 'react';
import {Caixa, Fosco, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: FGTS saque-aniversário: o cofre, os presentes de cada ano, a corrente da garantia.
// Formas simples, foscas, arredondadas, sem marca. Sem texturas: todo texto fica na interface 2D.

// ---------- Cofre do FGTS ----------
// `abre` 0..1: a porta redonda gira para fora. `trava` 0..1: cadeado marsala na frente. `brilho`: aceso.
export const CofreFGTS: React.FC<{tema: Tema; pos: V3; escala?: number; abre: number; trava: number; brilho?: number}> = ({tema, pos, escala = 1, abre, trava, brilho = 0}) => (
  <group position={pos} scale={escala}>
    <Caixa args={[2.4, 2.0, 1.6]} raio={0.16} cor={mistura(tema.objetoEscuro, tema.objeto, 0.35)} emissivo={0.08 * brilho} position={[0, 1.0, 0]} />
    <Caixa args={[2.5, 0.12, 1.7]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
    {/* Pés */}
    {[-0.9, 0.9].map((x) => (
      <Caixa key={x} args={[0.3, 0.1, 1.4]} raio={0.03} cor={tema.tinta} position={[x, 0.02, 0]} />
    ))}
    {/* Porta redonda, presa na dobradiça da esquerda */}
    <group position={[-0.62, 1.05, 0.81]} rotation={[0, -1.6 * abre, 0]}>
      <group position={[0.62, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
          <Fosco cor={tema.objeto} emissivo={0.1 * brilho} />
        </mesh>
        {/* Volante: aro e três raios */}
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[0.24, 0.03, 12, 40]} />
          <Fosco cor={tema.tinta} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, 0.08]} rotation={[0, 0, (i * Math.PI) / 3]}>
            <boxGeometry args={[0.5, 0.035, 0.035]} />
            <Fosco cor={tema.tinta} />
          </mesh>
        ))}
      </group>
    </group>
    {/* Escuro de dentro, visível quando a porta abre */}
    {abre > 0.02 ? (
      <mesh position={[0, 1.05, 0.805]}>
        <circleGeometry args={[0.56, 40]} />
        <meshBasicMaterial color={tema.fundo} />
      </mesh>
    ) : null}
    {/* Cadeado */}
    {trava > 0.02 ? (
      <group position={[0.75, 1.05 + 0.6 * (1 - trava), 0.95]} scale={trava}>
        <Caixa args={[0.36, 0.3, 0.14]} raio={0.04} cor={tema.acento} emissivo={0.35} />
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.11, 0.03, 12, 32, Math.PI]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      </group>
    ) : null}
  </group>
);

// ---------- Presente (um saque anual) ----------
// `tam` multiplica o tamanho (o valor). `laco` 0..1: laço em marsala. `cinza` 0..1: fora do limite. `preco`: etiqueta pendurada.
export const Presente: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; tam?: number; laco?: number; cinza?: number; preco?: number; fantasma?: boolean}> = ({
  tema,
  pos,
  rot = [0, 0, 0],
  escala,
  tam = 1,
  laco = 0,
  cinza = 0,
  preco = 0,
  fantasma,
}) => {
  if (escala < 0.02) return null;
  const s = 0.55 * tam;
  const corCaixa = mistura(tema.objetoClaro, tema.objetoEscuro, cinza);
  const corLaco = mistura(mistura(tema.corpo, tema.acento, laco), tema.objetoEscuro, cinza);
  const mat = (cor: string, em = 0) =>
    fantasma ? <meshStandardMaterial color={cor} transparent opacity={0.35} depthWrite={false} /> : <Fosco cor={cor} emissivo={em} />;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, s / 2, 0]} castShadow={!fantasma}>
        <boxGeometry args={[s, s, s]} />
        {mat(corCaixa)}
      </mesh>
      {/* Fitas em cruz */}
      <mesh position={[0, s / 2, 0]}>
        <boxGeometry args={[s * 1.01, s * 1.01, s * 0.16]} />
        {mat(corLaco, 0.3 * laco)}
      </mesh>
      <mesh position={[0, s / 2, 0]}>
        <boxGeometry args={[s * 0.16, s * 1.01, s * 1.01]} />
        {mat(corLaco, 0.3 * laco)}
      </mesh>
      {/* Laço em cima */}
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0.1 * s * l, s + 0.07 * s, 0]} rotation={[0, 0, 0.6 * l]}>
          <torusGeometry args={[0.12 * s, 0.04 * s, 10, 24]} />
          {mat(corLaco, 0.3 * laco)}
        </mesh>
      ))}
      {/* Etiqueta de preço pendurada */}
      {preco > 0.02 ? (
        <group position={[s * 0.62, s * (0.95 - 0.25 * preco), s * 0.3]} scale={preco}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.24, 6]} />
            <Fosco cor={tema.tinta} />
          </mesh>
          <Caixa args={[0.2, 0.12, 0.015]} raio={0.02} cor={tema.acento} emissivo={0.35} sombra={false} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Corrente (garantia): elos ao longo de uma linha ----------
// `k` 0..1: quanto já se desenhou. `vida` 0..1: opacidade geral.
export const Corrente: React.FC<{tema: Tema; a: V3; b: V3; k: number; vida?: number; elo?: number; cor?: string}> = ({tema, a, b, k, vida = 1, elo = 0.16, cor}) => {
  if (k < 0.01 || vida < 0.01) return null;
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  const n = Math.max(2, Math.round(L / elo));
  const yaw = Math.atan2(d[0], d[2]);
  const pitch = -Math.asin(d[1] / L);
  return (
    <>
      {Array.from({length: Math.ceil(n * k)}).map((_, i) => {
        const s = (i + 0.5) / n;
        const p: V3 = [a[0] + d[0] * s, a[1] + d[1] * s - 0.25 * Math.sin(Math.PI * s), a[2] + d[2] * s];
        return (
          <group key={i} position={p} rotation={[pitch, yaw, 0]}>
            <mesh rotation={[0, i % 2 ? Math.PI / 2 : 0, Math.PI / 2]} scale={[1, 1.5, 1]}>
              <torusGeometry args={[elo * 0.38, elo * 0.1, 8, 20]} />
              <meshStandardMaterial color={cor ?? tema.acento} emissive={cor ?? tema.acento} emissiveIntensity={0.3} roughness={0.5} transparent={vida < 1} opacity={vida} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// ---------- Trilha dos meses: n blocos no chão que acendem um a um ----------
// `acesos` 0..n (fração = bloco acendendo). `ultimo` 0..1: o último bloco em marsala.
export const Meses: React.FC<{tema: Tema; x0: number; passo: number; z: number; n: number; k: number; acesos: number; ultimo: number}> = ({tema, x0, passo, z, n, k, acesos, ultimo}) => {
  if (k < 0.01) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const vis = Math.max(0, Math.min(1, k * n * 1.3 - i));
        if (vis <= 0) return null;
        const aceso = Math.max(0, Math.min(1, acesos - i));
        const fim = i === n - 1 ? ultimo : 0;
        const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, aceso), tema.acento, fim);
        return <Caixa key={i} args={[0.32, 0.08 + 0.12 * fim, 0.5]} raio={0.03} cor={cor} emissivo={0.1 * aceso + 0.4 * fim} position={[x0 + i * passo, (0.04 + 0.06 * fim) * vis, z]} scale={vis} />;
      })}
    </>
  );
};
