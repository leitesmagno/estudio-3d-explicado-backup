import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 051. orçamento de guanambi. As da série vêm de ../orcamentoitabuna/pecas,
// ../orcamentocanavieiras/pecas, ../orcamentoparatinga/pecas e ../orcamentolivramento/pecas.

/** Canal de drenagem de concreto, seco, com placa de obra. Sobe de 0 a 1 (sai do chão), sem piscar. */
export const CanalSeco: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; sobe: number; aceso: number; linhas: string[]}> = ({tema, pos, rotY = 0, escala = 1, sobe, aceso, linhas}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const concreto = mistura(tema.objetoClaro, tema.objeto, 0.45);
  const fundo = mistura(mistura(tema.areia, tema.objetoEscuro, 0.35), tema.festa?.rosa ?? tema.areia, 0.12);
  return (
    <group position={[pos[0], pos[1] - 0.6 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {/* fundo de terra seca, 0,05 acima da mesa (sem chuviscar) */}
      <Caixa args={[3.6, 0.04, 0.9]} raio={0.015} cor={fundo} position={[0, 0.05, 0]} sombra={false} />
      {/* as duas paredes de concreto */}
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[3.7, 0.42, 0.16]} raio={0.04} cor={concreto} position={[0, 0.24, 0.53 * l]} />
      ))}
      {/* pedrinhas soltas no fundo */}
      {[-1.3, -0.6, 0.2, 0.9, 1.4].map((x, i) => (
        <Caixa key={x} args={[0.12, 0.06, 0.1]} raio={0.02} cor={mistura(concreto, tema.objetoEscuro, 0.3)} position={[x, 0.1, (i % 2 ? 0.18 : -0.2)]} sombra={false} />
      ))}
      {/* placa da obra em dois postes, atrás do canal */}
      {[-0.75, 0.75].map((x) => (
        <Caixa key={x} args={[0.07, 1.25, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.62, -0.85]} />
      ))}
      <Placa
        tema={tema}
        pos={[0, 1.05, -0.8]}
        larg={1.9}
        alt={0.62}
        linhas={linhas.map((t, k) => ({t, tam: k === 0 ? (t.length > 14 ? 120 : 150) : 95, cor: k === 0 ? mistura(tema.texto, tema.acento, 0.6 * aceso) : tema.textoSuave, peso: k === 0 ? 900 : 700}))}
        fundo={tema.cartao}
        brilho={0.25 + 0.35 * aceso}
      />
    </group>
  );
};

/** Celular genérico em pé (sem logo) com uma manchete na tela e o nome do site embaixo. */
export const CelularManchete: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; sobe: number; manchete: string[]; site: string; aceso: number}> = ({tema, pos, rotY = 0, escala = 1, sobe, manchete, site, aceso}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  return (
    <group position={[pos[0], pos[1] - 0.8 * (1 - s), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {/* corpo e base */}
      <Caixa args={[1.0, 1.9, 0.1]} raio={0.045} cor={tema.objetoEscuro} position={[0, 1.05, 0]} />
      <Caixa args={[0.6, 0.12, 0.4]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} position={[0, 0.06, 0]} />
      {/* tela: afastada 0,006 da face do corpo */}
      <Placa
        tema={tema}
        pos={[0, 1.08, 0.056]}
        larg={0.86}
        alt={1.62}
        linhas={[
          {t: 'NOTÍCIA', tam: 70, cor: tema.textoSuave, peso: 800},
          ...manchete.map((t) => ({t, tam: 92, cor: tema.texto, peso: 900})),
          {t: site, tam: 60, cor: mistura(tema.textoSuave, tema.acento, 0.5 * aceso), peso: 700},
        ]}
        fundo={tema.cartao}
        brilho={0.3 + 0.35 * aceso}
      />
    </group>
  );
};

/** Pilha de pastas de processo, uma em cima da outra (n pastas finas), com etiqueta na frente. */
export const PilhaPastas: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; n: number; sobe: number; aceso: number; etiqueta: string}> = ({tema, pos, rotY = 0, escala = 1, n, sobe, aceso, etiqueta}) => {
  if (sobe < 0.02) return null;
  const vis = Math.max(1, Math.round(n * Math.min(1, sobe)));
  const capa = [mistura(tema.objetoClaro, tema.festa?.dourado ?? tema.objetoClaro, 0.35), mistura(tema.objetoClaro, tema.objeto, 0.3)];
  const alt = 0.075;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {Array.from({length: vis}).map((_, k) => (
        <Caixa key={k} args={[1.1, alt - 0.012, 0.8]} raio={0.012} cor={capa[k % 2]} position={[((k * 37) % 7) * 0.012 - 0.036, alt / 2 + k * alt, ((k * 53) % 5) * 0.012 - 0.024]} />
      ))}
      <Placa tema={tema} pos={[0, 0.32, 0.43]} larg={1.0} alt={0.36} linhas={[{t: etiqueta, tam: etiqueta.length > 10 ? 120 : 160, cor: mistura(tema.texto, tema.acento, 0.6 * aceso), peso: 900}]} fundo={tema.cartao} brilho={0.25 + 0.35 * aceso} />
    </group>
  );
};
