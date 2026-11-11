import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 039. orçamento de santa cruz cabrália. As da série vêm de ../orcamentoitabuna/pecas,
// ../orcamentocanavieiras/pecas e ../orcamentoparatinga/pecas. Nada de logo, brasão ou rosto.

const Roda: React.FC<{tema: Tema; pos: V3; r: number; larg: number}> = ({tema, pos, r, larg}) => (
  <mesh position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
    <cylinderGeometry args={[r, r, larg, 18]} />
    <Fosco cor={tema.objetoEscuro} />
  </mesh>
);

/** Estrada de terra da zona rural: faixa de terra com cascalho, motoniveladora amarela e placa "ZONA RURAL". */
export const EstradaRural: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY = 0, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const terra = mistura(tema.areia, tema.objetoEscuro, 0.35);
  const amarelo = mistura(tema.festa?.dourado ?? tema.objetoClaro, tema.objeto, 0.2);
  return (
    <group position={[pos[0], pos[1] - 1.2 * escala * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {/* a estrada: base de terra e duas trilhas de roda mais escuras */}
      <Caixa args={[3.4, 0.12, 1.3]} raio={0.03} cor={terra} position={[0, 0.1, 0]} />
      {[-0.32, 0.32].map((z) => (
        <Caixa key={z} args={[3.3, 0.012, 0.16]} raio={0.004} cor={mistura(terra, tema.objetoEscuro, 0.3)} position={[0, 0.165, z]} sombra={false} />
      ))}
      {[-1.2, -0.4, 0.5, 1.3].map((x, i) => (
        <mesh key={x} position={[x, 0.18, (i % 2 ? 0.5 : -0.52)]} castShadow>
          <dodecahedronGeometry args={[0.07, 0]} />
          <Fosco cor={mistura(tema.objetoClaro, terra, 0.5)} />
        </mesh>
      ))}
      {/* motoniveladora: corpo, cabine, lâmina embaixo e seis rodas */}
      <group position={[0.2, 0.17, 0]}>
        <Caixa args={[1.5, 0.16, 0.34]} raio={0.04} cor={amarelo} position={[0.1, 0.32, 0]} />
        <Caixa args={[0.6, 0.34, 0.52]} raio={0.05} cor={amarelo} position={[-0.5, 0.36, 0]} />
        <Caixa args={[0.4, 0.38, 0.48]} raio={0.04} cor={amarelo} position={[-0.15, 0.68, 0]} />
        <Caixa args={[0.34, 0.24, 0.5]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.4)} emissivo={0.1 + 0.3 * aceso} position={[-0.15, 0.72, 0]} sombra={false} />
        <Caixa args={[0.1, 0.16, 0.9]} raio={0.02} cor={tema.objetoClaro} position={[0.15, 0.1, 0]} rotation={[0, 0.35, 0]} />
        {[-0.7, -0.38].map((x) => [-0.3, 0.3].map((z) => <Roda key={`${x}${z}`} tema={tema} pos={[x, 0.16, z]} r={0.16} larg={0.12} />))}
        {[0.75].map((x) => [-0.22, 0.22].map((z) => <Roda key={`${x}${z}`} tema={tema} pos={[x, 0.14, z]} r={0.14} larg={0.1} />))}
      </group>
      {/* placa na beira */}
      <Caixa args={[0.06, 0.9, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[-1.35, 0.6, -0.75]} />
      <Placa tema={tema} pos={[-1.35, 1.05, -0.71]} larg={1.1} alt={0.34} linhas={[{t: 'ZONA RURAL', tam: 150, cor: mistura(tema.texto, tema.acento, 0.5 * aceso), peso: 900}]} fundo={tema.cartao} brilho={0.25 + 0.4 * aceso} />
    </group>
  );
};

/** Caminhão genérico de carga com placa "UNIÃO" (sem brasão). As caixas da carroceria são tracejadas (transparentes)
 * até chegarem: `caixas` é a lista de rótulos, `entra` o quanto cada uma já apareceu e `cheia` o quanto ficou sólida. */
export const CaminhaoUniao: React.FC<{tema: Tema; pos: V3; sobe: number; rotY?: number; escala?: number; caixas: {texto: string; entra: number; cheia: number}[]; aceso?: number}> = ({tema, pos, sobe, rotY = 0, escala = 1, caixas, aceso = 0}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const azul = mistura(tema.festa?.turquesa ?? tema.objeto, tema.objeto, 0.45);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala * s}>
      {/* cabine */}
      <Caixa args={[0.8, 0.85, 1.0]} raio={0.08} cor={azul} position={[1.55, 0.62, 0]} />
      <Caixa args={[0.06, 0.4, 0.86]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.4)} emissivo={0.12} position={[1.96, 0.78, 0]} sombra={false} />
      {[-0.36, 0.36].map((z) => (
        <mesh key={z} position={[1.97, 0.42, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 14]} />
          <Fosco cor={tema.objetoClaro} emissivo={0.2 + 0.5 * aceso} />
        </mesh>
      ))}
      <Placa tema={tema} pos={[1.55, 0.78, 0.51]} larg={0.66} alt={0.24} linhas={[{t: 'UNIÃO', tam: 190, cor: tema.texto, peso: 900}]} fundo={tema.cartao} brilho={0.25 + 0.4 * aceso} />
      {/* chassi e carroceria aberta */}
      <Caixa args={[3.0, 0.14, 1.0]} raio={0.03} cor={tema.objetoEscuro} position={[0.25, 0.22, 0]} />
      <Caixa args={[2.2, 0.06, 1.04]} raio={0.02} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[-0.15, 0.32, 0]} />
      {[-0.52, 0.52].map((z) => (
        <Caixa key={z} args={[2.2, 0.22, 0.05]} raio={0.02} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[-0.15, 0.44, z]} />
      ))}
      <Caixa args={[0.05, 0.22, 1.04]} raio={0.02} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[-1.23, 0.44, 0]} />
      {[1.5, 0.15, -0.75].map((x) => [-0.5, 0.5].map((z) => <Roda key={`${x}${z}`} tema={tema} pos={[x, 0.2, z]} r={0.2} larg={0.14} />))}
      {/* as caixas: tracejadas (transparentes) enquanto não chegam */}
      {caixas.map((c, i) => {
        if (c.entra < 0.02) return null;
        const x = -0.95 + i * 0.53;
        const op = 0.22 + 0.78 * c.cheia;
        return (
          <group key={i} position={[x, 0.36 + 0.24 * Math.min(1, c.entra), 0]} scale={Math.min(1, c.entra)}>
            <mesh>
              <boxGeometry args={[0.46, 0.46, 0.8]} />
              <meshStandardMaterial color={mistura(tema.objetoClaro, tema.festa?.dourado ?? tema.objetoClaro, 0.3 * c.cheia)} transparent opacity={op} depthWrite={c.cheia > 0.9} roughness={0.85} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.47, 0.47, 0.81]} />
              <meshBasicMaterial color={tema.objetoClaro} wireframe transparent opacity={0.55} />
            </mesh>
            <Placa tema={tema} pos={[0, 0.05, 0.41]} larg={0.44} alt={0.2} linhas={[{t: c.texto, tam: 150, cor: tema.texto, peso: 900}]} fundo={tema.cartao} brilho={0.3} />
          </group>
        );
      })}
    </group>
  );
};

/** Envelope de um mês (prestação de contas): papel com o mês e um selo embaixo (ATRASADA / NO PRAZO). */
export const EnvelopeMes: React.FC<{tema: Tema; pos: V3; sobe: number; mes: string; selo: number; textoSelo: string; corSelo: string; rotY?: number; escala?: number}> = ({tema, pos, sobe, mes, selo, textoSelo, corSelo, rotY = 0, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const papel = mistura(tema.objetoClaro, tema.areia, 0.15);
  const k = Math.min(1, selo);
  return (
    <group position={[pos[0], pos[1] - 0.9 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <group rotation={[-0.12, 0, 0]}>
        <Caixa args={[0.62, 0.44, 0.04]} raio={0.015} cor={papel} position={[0, 0.5, 0]} />
        {/* aba do envelope */}
        <mesh position={[0, 0.66, 0.022]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.31, 0.12, 3]} />
          <Fosco cor={mistura(papel, tema.objetoEscuro, 0.12)} />
        </mesh>
        <Placa tema={tema} pos={[0, 0.46, 0.025]} larg={0.5} alt={0.2} linhas={[{t: mes, tam: 260, cor: tema.tinta, peso: 900}]} fundo={papel} brilho={0.2} />
        {k > 0.02 ? (
          <group position={[0, 0.2 + 0.25 * (1 - k), 0.06]} scale={0.6 + 0.4 * k}>
            <Placa tema={tema} pos={[0, 0, 0]} larg={0.66} alt={0.17} linhas={[{t: textoSelo, tam: 190, cor: corSelo, peso: 900}]} fundo={mistura(tema.cartao, corSelo, 0.16)} brilho={0.35} />
          </group>
        ) : null}
      </group>
      <Caixa args={[0.66, 0.05, 0.3]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0.05]} />
    </group>
  );
};

/** Placa num poste (para "EMBASA · DO ESTADO" ao lado da estação de saneamento cinza). */
export const PlacaPoste: React.FC<{tema: Tema; pos: V3; sobe: number; linhas: string[]; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, linhas, aceso, rotY = 0, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={[pos[0], pos[1] - 1.4 * escala * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.08, 1.4, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.7, 0]} />
      <Placa tema={tema} pos={[0, 1.35, 0.06]} larg={1.5} alt={0.6} linhas={linhas.map((t, i) => ({t, tam: i === 0 ? 150 : 110, cor: i === 0 ? mistura(tema.texto, tema.acento, 0.4 * aceso) : tema.textoSuave, peso: 900, mono: i > 0}))} fundo={tema.cartao} brilho={0.25 + 0.45 * aceso} />
    </group>
  );
};
