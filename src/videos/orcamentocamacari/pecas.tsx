import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças do 041. orçamento de camaçari (copiadas do 035 Paratinga, mais o Polo e a pilha de pastas). As da série vêm de ../orcamentoitabuna/pecas e ../orcamentocanavieiras/pecas.

/** Pasta de processo do Tribunal em pé: título, valor e um carimbo que desce e pode trocar de texto. */
export const PastaProcesso: React.FC<{
  tema: Tema;
  pos: V3;
  sobe: number;
  titulo: string;
  valor?: string;
  carimbo: number;
  textoCarimbo: string;
  corCarimbo: string;
  aceso?: number;
  rotY?: number;
  escala?: number;
}> = ({tema, pos, sobe, titulo, valor, carimbo, textoCarimbo, corCarimbo, aceso = 0, rotY = 0, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const k = Math.min(1, carimbo);
  const capa = mistura(mistura(tema.areia, tema.objeto, 0.35), tema.acento, 0.18 * aceso);
  const linhas = [{t: titulo, tam: titulo.length > 12 ? 92 : 120, cor: tema.texto, peso: 900}];
  if (valor) linhas.push({t: valor, tam: 110, cor: tema.texto, peso: 900});
  return (
    <group position={[pos[0], pos[1] - 1.4 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {/* a pasta: capa inclinada encostada num suporte */}
      <group rotation={[-0.18, 0, 0]}>
        <Caixa args={[1.5, 1.9, 0.08]} raio={0.03} cor={capa} position={[0, 0.98, 0]} />
        <Caixa args={[0.55, 0.16, 0.08]} raio={0.03} cor={capa} position={[-0.4, 2.0, 0]} />
        <Placa tema={tema} pos={[0, 1.2, 0.06]} larg={1.3} alt={0.9} linhas={linhas} fundo={tema.cartao} brilho={0.25 + 0.3 * aceso} />
        {k > 0.02 ? (
          <group position={[0, 0.55 + 0.7 * (1 - k), 0.12]} rotation={[0, 0, -0.1]} scale={0.6 + 0.4 * k}>
            <Placa tema={tema} pos={[0, 0, 0]} larg={1.4} alt={0.36} linhas={[{t: textoCarimbo, tam: textoCarimbo.length > 12 ? 112 : textoCarimbo.length > 9 ? 150 : 175, cor: corCarimbo, peso: 900}]} fundo={mistura(tema.cartao, corCarimbo, 0.14)} brilho={0.4} />
          </group>
        ) : null}
      </group>
      <Caixa args={[1.7, 0.08, 0.7]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.04, -0.1]} />
    </group>
  );
};

/** Trecho de rua asfaltada com placa genérica (sem brasão, sem logo). */
export const RuaPlaca: React.FC<{tema: Tema; pos: V3; sobe: number; rotY?: number; escala?: number; linhas: string[]; aceso: number}> = ({tema, pos, sobe, rotY = 0, escala = 1, linhas, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala * s}>
      <Caixa args={[3.6, 0.06, 1.3]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.texto, 0.08)} position={[0, 0.05, 0]} />
      {[-1.3, -0.45, 0.45, 1.3].map((x) => (
        <Caixa key={x} args={[0.45, 0.01, 0.07]} raio={0.005} cor={mistura(tema.objetoClaro, tema.festa?.dourado ?? tema.objetoClaro, 0.5)} position={[x, 0.09, 0]} sombra={false} />
      ))}
      {[-1.7, 1.7].map((x) => (
        <Caixa key={x} args={[0.12, 0.1, 1.3]} raio={0.02} cor={tema.objetoClaro} position={[x, 0.07, 0]} />
      ))}
      {[-0.75, 0.75].map((x) => (
        <Caixa key={x} args={[0.07, 1.5, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.75, -0.85]} />
      ))}
      <Placa
        tema={tema}
        pos={[0, 1.35, -0.8]}
        larg={2.0}
        alt={0.82}
        linhas={linhas.map((t, i) => ({t, tam: i === 0 ? 110 : 90, cor: i === 0 ? tema.texto : tema.textoSuave, peso: 900, mono: i > 0}))}
        fundo={tema.cartao}
        brilho={0.25 + 0.4 * aceso}
      />
    </group>
  );
};

/** Plataforma baixa com placa de nome, para as "gavetas" da secretaria de obras. */
export const BaseGaveta: React.FC<{tema: Tema; pos: V3; sobe: number; texto: string; aceso: number; larg?: number}> = ({tema, pos, sobe, texto, aceso, larg = 2.4}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={[pos[0], pos[1] - 0.6 * (1 - s), pos[2]]}>
      <Caixa args={[larg, 0.1, 1.5]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.15 * aceso)} position={[0, 0.05, 0]} />
      <Placa tema={tema} pos={[0, 0.32, 0.8]} larg={larg * 0.9} alt={0.34} linhas={[{t: texto, tam: texto.length > 14 ? 110 : 140, cor: mistura(tema.texto, tema.acento, 0.5 * aceso), peso: 900}]} fundo={tema.cartao} brilho={0.25 + 0.4 * aceso} />
    </group>
  );
};

/** Silhueta genérica de indústria (tanques redondos e chaminés), sem marca: o Polo Industrial ao fundo. */
export const SilhuetaPolo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; sobe: number; luz: number}> = ({tema, pos, rotY = 0, escala = 1, sobe, luz}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const cor = mistura(tema.objetoEscuro, tema.objeto, 0.25 + 0.25 * luz);
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[2.6, 0.7, 1.0]} raio={0.04} cor={cor} position={[0, 0.35, 0]} />
      {[-0.85, 0.05].map((x) => (
        <mesh key={x} position={[x, 0.95, 0.15]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.6, 24]} />
          <meshStandardMaterial color={mistura(cor, tema.objetoClaro, 0.18)} roughness={0.7} />
        </mesh>
      ))}
      {[0.75, 1.05].map((x, k) => (
        <Caixa key={x} args={[0.16, 1.7 + 0.4 * k, 0.16]} raio={0.03} cor={cor} position={[x, 0.85 + 0.2 * k, -0.2]} />
      ))}
      {[-1.0, -0.4, 0.2, 0.8].map((x) => (
        <Caixa key={x} args={[0.22, 0.12, 0.02]} raio={0.01} cor={mistura(cor, tema.festa?.dourado ?? tema.objetoClaro, 0.35 * luz)} position={[x, 0.42, 0.51]} sombra={false} />
      ))}
    </group>
  );
};

/** Pilha de pastas de processo que cresce de 0 a `total`, uma por vez (`n` é quantas já estão na pilha). */
export const PilhaPastas: React.FC<{tema: Tema; pos: V3; n: number; total: number; sobe: number; aceso: number}> = ({tema, pos, n, total, sobe, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const capa = mistura(mistura(tema.areia, tema.objeto, 0.35), tema.acento, 0.15 * aceso);
  return (
    <group position={[pos[0], pos[1] - 0.8 * (1 - s), pos[2]]}>
      {Array.from({length: total}).map((_, k) => {
        const f = Math.max(0, Math.min(1, n - k));
        if (f < 0.02) return null;
        return <Caixa key={k} args={[0.9, 0.07, 0.65]} raio={0.015} cor={k % 2 ? capa : mistura(capa, tema.objetoClaro, 0.2)} position={[Math.sin(k * 1.3) * 0.04, 0.05 + k * 0.08 + 0.4 * (1 - f), Math.cos(k * 1.7) * 0.04]} />;
      })}
    </group>
  );
};
