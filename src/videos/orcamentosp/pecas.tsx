import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 020. orçamento de são paulo. O resto vem do 017 (../orcamentoitabuna/pecas), que já traz a
// maquete redonda da série, os prédios das áreas, as pilhas de dinheiro, a régua do teto e os copos dos mínimos.

/** Prédio que sobe do chão (sobe 0 a 1). Some abaixo de 0,02. */
const Sobe: React.FC<{pos: V3; sobe: number; alt: number; rotY?: number; escala?: number; children: React.ReactNode}> = ({pos, sobe, alt, rotY = 0, escala = 1, children}) =>
  sobe < 0.02 ? null : (
    <group position={[pos[0], pos[1] - alt * escala * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {children}
    </group>
  );

const Letreiro: React.FC<{tema: Tema; texto: string; pos: V3; larg: number; aceso: number; tam?: number}> = ({tema, texto, pos, larg, aceso, tam = 200}) => (
  <Placa tema={tema} pos={pos} larg={larg} alt={larg * 0.24} linhas={[{t: texto, tam, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
);

/** Torres altas ao fundo da maquete: o horizonte de prédios de São Paulo (sem nenhum prédio real). */
export const TorresSP: React.FC<{tema: Tema; luz: number}> = ({tema, luz}) => {
  const torres: [number, number, number, number][] = [
    // ângulo (graus, 180 = fundo), raio, altura, largura
    [146, 8.3, 2.6, 0.7],
    [156, 8.5, 3.8, 0.6],
    [165, 8.2, 3.0, 0.8],
    [173, 8.55, 4.6, 0.62],
    [181, 8.3, 3.4, 0.75],
    [189, 8.5, 4.1, 0.6],
    [198, 8.25, 2.8, 0.8],
    [207, 8.5, 3.6, 0.65],
    [216, 8.3, 2.4, 0.7],
  ];
  return (
    <group>
      {torres.map(([g, r, h, w], i) => {
        const a = (g * Math.PI) / 180;
        const x = Math.sin(a) * r;
        const z = Math.cos(a) * r;
        const cor = mistura(tema.objeto, tema.objetoEscuro, 0.35 + 0.1 * (i % 3));
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, a, 0]}>
            <Caixa args={[w, h, w]} raio={0.03} cor={cor} position={[0, h / 2 + 0.06, 0]} />
            {/* faixas de janelas acesas, na face que olha para o centro da mesa */}
            {Array.from({length: Math.floor(h / 0.42)}).map((_, k) => (
              <Caixa key={k} args={[w * 0.72, 0.1, 0.02]} raio={0.005} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.45)} emissivo={0.12 + 0.25 * luz * ((k + i) % 3 === 0 ? 1 : 0.5)} position={[0, 0.32 + k * 0.42, -w / 2 - 0.012]} sombra={false} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

/** Prédio da previdência dos servidores: prédio sóbrio com colunas e letreiro PREVIDÊNCIA (frente z+). */
export const PredioPrevidencia: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.2} rotY={rotY} escala={escala}>
    <Caixa args={[2.8, 1.5, 1.6]} raio={0.05} cor={mistura(tema.objeto, tema.festa?.azul ?? tema.objeto, 0.12)} position={[0, 0.75, 0]} />
    <Caixa args={[3.0, 0.14, 1.8]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.57, 0]} />
    {[-1.1, -0.55, 0.55, 1.1].map((x) => (
      <Caixa key={x} args={[0.16, 1.2, 0.16]} raio={0.04} cor={tema.objetoClaro} position={[x, 0.6, 0.9]} />
    ))}
    <Caixa args={[0.6, 0.85, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.43, 0.81]} sombra={false} />
    <Letreiro tema={tema} texto="PREVIDÊNCIA" pos={[0, 1.26, 0.83]} larg={2.0} aceso={aceso} tam={120} />
  </Sobe>
);

/** Pedestal da vitrine das áreas menores: bloco baixo com o nome da área na frente (frente z+). */
export const Pedestal: React.FC<{tema: Tema; pos: V3; nome: string; sobe: number; aceso: number; rotY?: number}> = ({tema, pos, nome, sobe, aceso, rotY = 0}) =>
  sobe < 0.02 ? null : (
    <group position={[pos[0], pos[1] - 0.6 * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]}>
      <Caixa args={[0.7, 0.3, 0.7]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.objeto, 0.35 + 0.3 * aceso)} position={[0, 0.15, 0]} />
      <Placa tema={tema} pos={[0, 0.15, 0.36]} larg={0.66} alt={0.2} linhas={[{t: nome, tam: nome.length > 8 ? 120 : 150, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
    </group>
  );

/** Conjunto de 3 prédios baixos de habitação, com letreiro HABITAÇÃO (frente z+). */
export const ConjuntoHabitacao: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.0} rotY={rotY} escala={escala}>
    {[-0.95, 0, 0.95].map((x, i) => (
      <group key={x} position={[x, 0, i === 1 ? -0.25 : 0]}>
        <Caixa args={[0.8, 1.2 + 0.25 * (i % 2), 0.8]} raio={0.04} cor={mistura(tema.objeto, tema.areia, 0.2 + 0.1 * i)} position={[0, (1.2 + 0.25 * (i % 2)) / 2, 0]} />
        {[0.3, 0.65, 1.0].map((y) => (
          <Caixa key={y} args={[0.5, 0.12, 0.02]} raio={0.005} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.4)} emissivo={0.1 + 0.25 * aceso} position={[0, y, 0.41]} sombra={false} />
        ))}
      </group>
    ))}
    <Letreiro tema={tema} texto="HABITAÇÃO" pos={[0, 1.65, 0.45]} larg={1.7} aceso={aceso} tam={130} />
  </Sobe>
);
