import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças do 038. orçamento de itapitanga. Copiadas do 035 (PastaProcesso, RuaPlaca, BaseGaveta) com o tamanho do texto
// do carimbo calculado pela largura (texto longo não sai cortado), mais a folha de mês do calendário.

const tamPorLargura = (texto: string, max: number) => Math.min(max, Math.floor(980 / Math.max(1, texto.length * 0.62)));

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
  const linhas = [{t: titulo, tam: tamPorLargura(titulo, 120), cor: tema.texto, peso: 900}];
  if (valor) linhas.push({t: valor, tam: tamPorLargura(valor, 110), cor: tema.texto, peso: 900});
  return (
    <group position={[pos[0], pos[1] - 1.4 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <group rotation={[-0.18, 0, 0]}>
        <Caixa args={[1.5, 1.9, 0.08]} raio={0.03} cor={capa} position={[0, 0.98, 0]} />
        <Caixa args={[0.55, 0.16, 0.08]} raio={0.03} cor={capa} position={[-0.4, 2.0, 0]} />
        <Placa tema={tema} pos={[0, 1.2, 0.06]} larg={1.3} alt={0.9} linhas={linhas} fundo={tema.cartao} brilho={0.25 + 0.3 * aceso} />
        {k > 0.02 ? (
          <group position={[0, 0.55 + 0.7 * (1 - k), 0.12]} rotation={[0, 0, -0.1]} scale={0.6 + 0.4 * k}>
            <Placa tema={tema} pos={[0, 0, 0]} larg={1.4} alt={0.36} linhas={[{t: textoCarimbo, tam: tamPorLargura(textoCarimbo, 175), cor: corCarimbo, peso: 900}]} fundo={mistura(tema.cartao, corCarimbo, 0.14)} brilho={0.4} />
          </group>
        ) : null}
      </group>
      <Caixa args={[1.7, 0.08, 0.7]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.04, -0.1]} />
    </group>
  );
};

/** Trecho de rua com placa genérica (sem brasão, sem logo). */
export const RuaPlaca: React.FC<{tema: Tema; pos: V3; sobe: number; rotY?: number; escala?: number; linhas: string[]; aceso: number}> = ({tema, pos, sobe, rotY = 0, escala = 1, linhas, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala * s}>
      <Caixa args={[3.6, 0.06, 1.3]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.texto, 0.08)} position={[0, 0.05, 0]} />
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
        linhas={linhas.map((t, i) => ({t, tam: tamPorLargura(t, i === 0 ? 110 : 90), cor: i === 0 ? tema.texto : tema.textoSuave, peso: 900, mono: i > 0}))}
        fundo={tema.cartao}
        brilho={0.25 + 0.4 * aceso}
      />
    </group>
  );
};

/** Plataforma baixa com placa de nome (as "gavetas" da secretaria de obras e a bandeja das contas antigas). */
export const BaseGaveta: React.FC<{tema: Tema; pos: V3; sobe: number; texto: string; aceso: number; larg?: number}> = ({tema, pos, sobe, texto, aceso, larg = 2.4}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={[pos[0], pos[1] - 0.6 * (1 - s), pos[2]]}>
      <Caixa args={[larg, 0.1, 1.5]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.15 * aceso)} position={[0, 0.05, 0]} />
      <Placa tema={tema} pos={[0, 0.32, 0.8]} larg={larg * 0.9} alt={0.34} linhas={[{t: texto, tam: tamPorLargura(texto, 140), cor: mistura(tema.texto, tema.acento, 0.5 * aceso), peso: 900}]} fundo={tema.cartao} brilho={0.25 + 0.4 * aceso} />
    </group>
  );
};

/** Folha de calendário em pé, com o nome do mês (para "quase 1 milhão por mês"). */
export const FolhaMes: React.FC<{tema: Tema; pos: V3; rotY?: number; sobe: number; mes: string; aceso: number; escala?: number}> = ({tema, pos, rotY = 0, sobe, mes, aceso, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const papel = mistura(tema.objetoClaro, tema.areia, 0.15);
  return (
    <group position={[pos[0], pos[1] - 0.8 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.56, 0.62, 0.05]} raio={0.02} cor={papel} position={[0, 0.36, 0]} />
      <Caixa args={[0.56, 0.14, 0.06]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.35 * aceso)} position={[0, 0.66, 0.002]} />
      <Placa tema={tema} pos={[0, 0.33, 0.035]} larg={0.48} alt={0.3} linhas={[{t: mes, tam: 300, cor: tema.tinta, peso: 900}]} fundo={papel} brilho={0.2 + 0.3 * aceso} />
      <Caixa args={[0.62, 0.05, 0.3]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0.05]} />
    </group>
  );
};
