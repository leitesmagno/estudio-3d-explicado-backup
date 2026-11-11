import React from 'react';
import {Boneco, Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 034. orçamento de canavieiras. As da série (escola, posto de saúde, prefeitura, Câmara,
// guarda, Tribunal, rua de serviços, assistência, teatro, defesa civil, banco da dívida, mesa e pilhas)
// vêm de ../orcamentoitabuna/pecas.

const Letreiro: React.FC<{tema: Tema; texto: string; pos: V3; larg: number; aceso: number; tam?: number}> = ({tema, texto, pos, larg, aceso, tam = 200}) => (
  <Placa tema={tema} pos={pos} larg={larg} alt={larg * 0.24} linhas={[{t: texto, tam, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
);

/** Grupo que sobe do chão (sobe 0 a 1) com um quique leve ao parar. */
const Sobe: React.FC<{pos: V3; sobe: number; alt: number; rotY?: number; escala?: number; children: React.ReactNode}> = ({pos, sobe, alt, rotY = 0, escala = 1, children}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  // quique: passa 6% do ponto e volta
  const y = s < 0.85 ? -alt * escala * (1 - s / 0.85) : alt * escala * 0.06 * Math.sin(((s - 0.85) / 0.15) * Math.PI);
  return (
    <group position={[pos[0], pos[1] + y, pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {children}
    </group>
  );
};

export type TipoPredio = 'galpao' | 'palco' | 'quadra' | 'casinha' | 'trator' | 'colunas';

/** Prédio genérico com letreiro de texto livre (sem logo). cinza = 1 deixa tudo apagado (setor zerado). */
export const PredioTexto: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; texto: string; tipo: TipoPredio; rotY?: number; escala?: number; cinza?: number}> = ({tema, pos, sobe, aceso, texto, tipo, rotY, escala, cinza = 0}) => {
  const c = (cor: string) => mistura(cor, tema.objetoEscuro, 0.55 * cinza);
  const a = aceso * (1 - cinza);
  if (tipo === 'galpao')
    return (
      <Sobe pos={pos} sobe={sobe} alt={2.4} rotY={rotY} escala={escala}>
        <Caixa args={[3.4, 1.5, 2.0]} raio={0.04} cor={c(mistura(tema.objeto, tema.areia, 0.2))} position={[0, 0.75, 0]} />
        <mesh position={[0, 1.62, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.72, 1.0, 0.42]} castShadow>
          <cylinderGeometry args={[1, 1, 2.0, 24, 1, false, 0, Math.PI]} />
          <Fosco cor={c(tema.objetoEscuro)} dupla />
        </mesh>
        <Caixa args={[1.2, 1.0, 0.03]} raio={0.01} cor={c(tema.objetoEscuro)} position={[0, 0.5, 1.01]} sombra={false} />
        <Letreiro tema={tema} texto={texto} pos={[0, 1.25, 1.03]} larg={2.0} aceso={a} tam={150} />
      </Sobe>
    );
  if (tipo === 'palco')
    return (
      <Sobe pos={pos} sobe={sobe} alt={2.6} rotY={rotY} escala={escala}>
        <Caixa args={[3.0, 0.4, 1.8]} raio={0.04} cor={c(tema.objetoEscuro)} position={[0, 0.2, 0]} />
        {[-1.4, 1.4].map((x) => (
          <Caixa key={x} args={[0.14, 2.2, 0.14]} raio={0.03} cor={c(tema.objeto)} position={[x, 1.3, -0.7]} />
        ))}
        <Caixa args={[3.0, 0.16, 0.2]} raio={0.03} cor={c(tema.objeto)} position={[0, 2.4, -0.7]} />
        {[-0.9, 0, 0.9].map((x) => (
          <mesh key={x} position={[x, 2.25, -0.55]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <Fosco cor={mistura(tema.objetoClaro, tema.acento, a)} emissivo={0.15 + 0.6 * a} />
          </mesh>
        ))}
        <Letreiro tema={tema} texto={texto} pos={[0, 0.2, 0.91]} larg={1.8} aceso={a} tam={160} />
      </Sobe>
    );
  if (tipo === 'quadra') {
    // campo de futebol de verdade: gramado listrado, linhas brancas, círculo central, áreas, traves com rede,
    // bola no meio, arquibancadinha atrás e dois refletores que acendem quando o setor é falado
    const verde = mistura(tema.festa?.verde ?? tema.objeto, tema.objetoEscuro, 0.3);
    const verde2 = mistura(verde, tema.objetoEscuro, 0.18);
    const linha = c(mistura(tema.objetoClaro, tema.branco, 0.5));
    const L = 1.5; // meia largura (x)
    const P = 0.9; // meia profundidade (z)
    const Y = 0.095;
    const fx = (x: number, z: number, w: number, d: number) => <Caixa args={[w, 0.008, d]} raio={0.002} cor={linha} position={[x, Y, z]} sombra={false} />;
    return (
      <Sobe pos={pos} sobe={sobe} alt={1.6} rotY={rotY} escala={escala}>
        {/* tudo erguido 0,1: a mesa tem 6 cm e o setor vem em escala menor, o gramado sumia por baixo dela */}
        <group position={[0, 0.1, 0]}>
        {/* base e gramado em faixas */}
        <Caixa args={[3.4, 0.16, 2.2]} raio={0.02} cor={c(mistura(tema.objetoEscuro, verde, 0.25))} position={[0, -0.02, 0]} />
        {Array.from({length: 8}).map((_, i) => (
          <Caixa key={i} args={[(2 * L) / 8, 0.03, 2 * P]} raio={0.002} cor={c(i % 2 ? verde : verde2)} position={[-L + ((2 * L) / 8) * (i + 0.5), 0.075, 0]} sombra={false} />
        ))}
        {/* linhas: contorno, meio, áreas e pequenas áreas */}
        {fx(0, -P, 2 * L, 0.035)}
        {fx(0, P, 2 * L, 0.035)}
        {fx(-L, 0, 0.035, 2 * P)}
        {fx(L, 0, 0.035, 2 * P)}
        {fx(0, 0, 0.035, 2 * P)}
        {[-1, 1].map((l) => (
          <React.Fragment key={l}>
            {fx(l * (L - 0.24), -0.5, 0.48, 0.03)}
            {fx(l * (L - 0.24), 0.5, 0.48, 0.03)}
            {fx(l * (L - 0.48), 0, 0.03, 1.0)}
            {fx(l * (L - 0.09), -0.24, 0.18, 0.025)}
            {fx(l * (L - 0.09), 0.24, 0.18, 0.025)}
            {fx(l * (L - 0.18), 0, 0.025, 0.48)}
            {/* trave com rede */}
            <group position={[l * L, 0, 0]}>
              {[-0.2, 0.2].map((z) => (
                <Caixa key={z} args={[0.035, 0.32, 0.035]} raio={0.01} cor={linha} position={[0, 0.25, z]} />
              ))}
              <Caixa args={[0.035, 0.035, 0.44]} raio={0.01} cor={linha} position={[0, 0.41, 0]} />
              <mesh position={[l * 0.1, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.32, 0.4]} />
                <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.22} depthWrite={false} roughness={0.9} />
              </mesh>
            </group>
          </React.Fragment>
        ))}
        {/* círculo central e bola */}
        <mesh position={[0, Y + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.27, 0.3, 48]} />
          <meshStandardMaterial color={linha} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-6} />
        </mesh>
        <mesh position={[0.12, 0.15, 0.08]} castShadow>
          <sphereGeometry args={[0.055, 16, 16]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        {/* arquibancadinha atrás */}
        {[0, 1, 2].map((k) => (
          <Caixa key={k} args={[2.2, 0.12, 0.18]} raio={0.02} cor={c(mistura(tema.objeto, tema.areia, 0.25 + 0.1 * k))} position={[0, 0.12 + 0.12 * k, -P - 0.22 - 0.16 * k]} />
        ))}
        {/* refletores nos cantos */}
        {[-1, 1].map((l) => (
          <group key={l} position={[l * (L + 0.05), 0, -P - 0.05]}>
            <Caixa args={[0.05, 1.3, 0.05]} raio={0.015} cor={c(tema.objetoEscuro)} position={[0, 0.65, 0]} />
            <Caixa args={[0.34, 0.16, 0.07]} raio={0.02} cor={c(tema.objetoEscuro)} position={[0, 1.33, 0]} />
            <mesh position={[0, 1.33, 0.04]}>
              <boxGeometry args={[0.28, 0.1, 0.02]} />
              <Fosco cor={mistura(tema.objetoClaro, tema.acento, 0.25 * a)} emissivo={0.15 + 0.85 * a} />
            </mesh>
          </group>
        ))}
        <Letreiro tema={tema} texto={texto} pos={[0, 0.3, P + 0.14]} larg={1.6} aceso={a} tam={150} />
        </group>
      </Sobe>
    );
  }
  if (tipo === 'casinha')
    return (
      <Sobe pos={pos} sobe={sobe} alt={1.8} rotY={rotY} escala={escala}>
        <Caixa args={[1.4, 0.9, 1.2]} raio={0.04} cor={c(mistura(tema.objeto, tema.areia, 0.4))} position={[0, 0.45, 0]} />
        <mesh position={[0, 1.12, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.05, 0.55, 4]} />
          <Fosco cor={c(tema.objetoEscuro)} />
        </mesh>
        <mesh position={[0, 0.32, 0.61]}>
          <circleGeometry args={[0.26, 20]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <Letreiro tema={tema} texto={texto} pos={[0, 0.78, 0.62]} larg={1.2} aceso={a} tam={120} />
      </Sobe>
    );
  if (tipo === 'trator')
    return (
      <Sobe pos={pos} sobe={sobe} alt={1.8} rotY={rotY} escala={escala}>
        <Caixa args={[1.6, 0.6, 0.9]} raio={0.06} cor={c(mistura(tema.festa?.verde ?? tema.objeto, tema.objeto, 0.3))} position={[0, 0.6, 0]} />
        <Caixa args={[0.7, 0.7, 0.8]} raio={0.05} cor={c(tema.objeto)} position={[-0.35, 1.15, 0]} />
        {[
          [-0.55, 0.45, 0.42],
          [0.6, 0.3, 0.28],
        ].map(([x, r, y], i) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`${i}${z}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[r, r, 0.22, 20]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
          )),
        )}
        <Letreiro tema={tema} texto={texto} pos={[0.3, 0.62, 0.47]} larg={1.1} aceso={a} tam={120} />
      </Sobe>
    );
  // colunas: prédio público genérico (Ministério Público, MPF)
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.6} rotY={rotY} escala={escala}>
      <Caixa args={[3.0, 0.18, 1.9]} raio={0.03} cor={c(tema.objetoEscuro)} position={[0, 0.09, 0.1]} />
      <Caixa args={[2.7, 1.6, 1.3]} raio={0.05} cor={c(mistura(tema.objeto, tema.branco, 0.2))} position={[0, 0.95, -0.2]} />
      {[-1.1, -0.55, 0, 0.55, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.62]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 1.5, 16]} />
          <Fosco cor={c(tema.objetoClaro)} />
        </mesh>
      ))}
      <Caixa args={[2.9, 0.16, 1.7]} raio={0.03} cor={c(tema.objetoClaro)} position={[0, 1.74, 0]} />
      <Letreiro tema={tema} texto={texto} pos={[0, 1.36, 0.5]} larg={2.1} aceso={a} tam={130} />
    </Sobe>
  );
};

/** Placa de obra prevista num terreno vazio: duas linhas e o carimbo "R$ 0 GASTO" que desce. */
export const PlacaObra: React.FC<{tema: Tema; pos: V3; sobe: number; carimbo: number; titulo: string; rotY?: number; escala?: number; cor: string}> = ({tema, pos, sobe, carimbo, titulo, rotY = 0, escala = 1, cor}) => {
  if (sobe < 0.02) return null;
  const s = Math.min(1, sobe);
  const k = Math.min(1, carimbo);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala * s}>
      {/* o terreno: um retângulo de terra com estacas */}
      <Caixa args={[1.6, 0.04, 1.2]} raio={0.01} cor={mistura(tema.areia, tema.objetoEscuro, 0.5)} position={[0, 0.06, 0]} sombra={false} />
      {[-0.75, 0.75].map((x) =>
        [-0.55, 0.55].map((z) => <Caixa key={`${x}${z}`} args={[0.05, 0.25, 0.05]} raio={0.01} cor={tema.objetoClaro} position={[x, 0.17, z]} />),
      )}
      {/* a placa */}
      {[-0.55, 0.55].map((x) => (
        <Caixa key={x} args={[0.06, 1.2, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.6, -0.4]} />
      ))}
      <Placa tema={tema} pos={[0, 1.05, -0.36]} larg={1.4} alt={0.72} linhas={[{t: titulo, tam: 120, cor: tema.texto, peso: 900}, {t: 'PREVISTO NO ORÇAMENTO', tam: 70, cor: tema.textoSuave, peso: 800, mono: true}]} fundo={tema.cartao} brilho={0.25} />
      {/* o carimbo: desce de cima e encosta na placa */}
      {k > 0.02 ? (
        <group position={[0, 1.0 + 0.8 * (1 - k), -0.3]} rotation={[0, 0, -0.12]} scale={0.6 + 0.4 * k}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.15} alt={0.34} linhas={[{t: 'R$ 0 GASTO', tam: 190, cor, peso: 900}]} fundo={mistura(tema.cartao, cor, 0.12)} brilho={0.4} />
        </group>
      ) : null}
    </group>
  );
};

/** Trabalhador genérico com crachá, andando (passo = fase da caminhada, 0 parado). */
export const Trabalhador: React.FC<{tema: Tema; pos: V3; rotY: number; passo: number; escala?: number; cor: string}> = ({tema, pos, rotY, passo, escala = 0.32, cor}) => (
  <Boneco tema={tema} pos={pos} rotY={rotY} escala={escala} cor={cor} pose={{passo}}>
    <Caixa args={[0.22, 0.3, 0.02]} raio={0.02} cor={tema.branco} position={[0.08, 1.25, 0.2]} sombra={false} />
  </Boneco>
);
