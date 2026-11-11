import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 095 (Ilhéus 10 anos · obras).

/** Placa de obra genérica fincada na mesa (sem brasão nem logo): título, anos e um carimbo "EXECUTADO: R$ 0" que desce. */
export const PlacaObra: React.FC<{tema: Tema; pos: V3; sobe: number; titulo: string; anos: string; carimbo: number; corCarimbo: string; aceso?: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, titulo, anos, carimbo, corCarimbo, aceso = 0, rotY = 0, escala = 1}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const k = Math.min(1, carimbo);
  const poste = mistura(tema.objetoEscuro, tema.areia, 0.3);
  return (
    <group position={[pos[0], pos[1] - 2.0 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.09, 2.2, 0.09]} raio={0.02} cor={poste} position={[-0.62, 1.1, 0]} />
      <Caixa args={[0.09, 2.2, 0.09]} raio={0.02} cor={poste} position={[0.62, 1.1, 0]} />
      <Caixa args={[1.62, 1.08, 0.06]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.12 * aceso)} position={[0, 1.62, -0.02]} />
      <Placa
        tema={tema}
        pos={[0, 1.62, 0.02]}
        larg={1.5}
        alt={0.96}
        linhas={[
          {t: 'OBRA', tam: 90, cor: tema.textoSuave, peso: 800},
          {t: titulo, tam: titulo.length > 16 ? 82 : 100, cor: tema.texto, peso: 900},
          {t: anos, tam: 86, cor: tema.textoSuave, peso: 800},
        ]}
        fundo={tema.cartao}
        brilho={0.22 + 0.3 * aceso}
      />
      {k > 0.02 ? (
        <group position={[0, 1.2 + 0.7 * (1 - k), 0.1]} rotation={[0, 0, -0.08]} scale={0.6 + 0.4 * k}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.55} alt={0.34} linhas={[{t: 'EXECUTADO: R$ 0', tam: 150, cor: corCarimbo, peso: 900}]} fundo={mistura(tema.cartao, corCarimbo, 0.16)} brilho={0.4} />
        </group>
      ) : null}
    </group>
  );
};

/** Plataforma com nome (troca de nome com cruzamento suave) e uma linha de baixo, ex.: CNPJ. */
export const BaseNome: React.FC<{tema: Tema; pos: V3; sobe: number; larg?: number; nomes: [string, number][]; t: number; sub?: string; aceso: number}> = ({tema, pos, sobe, larg = 2.2, nomes, t, sub, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const atual = nomes.filter(([, a]) => t >= a);
  const nome = atual.length ? atual[atual.length - 1][0] : nomes[0][0];
  const linhas = [{t: nome, tam: nome.length > 14 ? 100 : 130, cor: mistura(tema.texto, tema.acento, 0.5 * aceso), peso: 900}];
  if (sub) linhas.push({t: sub, tam: 80, cor: tema.textoSuave, peso: 800});
  return (
    <group position={[pos[0], pos[1] - 0.6 * (1 - s), pos[2]]}>
      <Caixa args={[larg, 0.1, 1.4]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, 0.15 * aceso)} position={[0, 0.05, 0]} />
      <Placa tema={tema} pos={[0, 0.36, 0.76]} larg={larg * 0.94} alt={sub ? 0.46 : 0.34} linhas={linhas} fundo={tema.cartao} brilho={0.25 + 0.4 * aceso} />
    </group>
  );
};
