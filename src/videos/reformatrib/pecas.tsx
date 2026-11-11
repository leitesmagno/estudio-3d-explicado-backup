import React from 'react';
import {Caixa, Cofre, Fosco, Placa, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import type {Tema} from '../../base/tema';

// Peças novas do 050. reforma tributária (perfil @eumagnoleite).
// FichaImposto: cartãozinho em pé com o nome do imposto (cinza = velho, verde = novo).
// Trigo: canteiro de espigas. Moinho: casinha com pás girando e saco de farinha.
// PredioDono: prédio público (OrgaoPublico) com letreiro largo próprio (cabe PREFEITURA).
// CofreComite: cofre grande com letreiro e duas bandeirinhas (ESTADOS · MUNICÍPIOS).
// Lancha: lanchinha genérica sobre um espelho d'água. Dial: botão de percentual na fachada.
// Bolo: bolo redondo em fatias que se afastam (o "reparte o bolo").

export const corNovo = (tema: Tema, ibs = false) => (ibs ? mistura(tema.acento, tema.objetoClaro, 0.38) : tema.acento);
export const corVelho = (tema: Tema) => mistura(tema.objeto, tema.objetoEscuro, 0.35);

export const FichaImposto: React.FC<{tema: Tema; pos: V3; k: number; texto: string; novo?: boolean; ibs?: boolean; rot?: V3; brilho?: number; larg?: number}> = ({tema, pos, k, texto, novo, ibs, rot = [0, 0, 0], brilho = 0, larg = 1.0}) => {
  if (k < 0.02) return null;
  const fundo = novo ? corNovo(tema, ibs) : corVelho(tema);
  const letra = novo ? tema.fundo : tema.objetoClaro;
  return (
    <group position={pos} rotation={rot} scale={k}>
      <Caixa args={[larg, 0.56, 0.08]} raio={0.035} cor={fundo} emissivo={0.12 + 0.5 * brilho} />
      <Placa tema={tema} pos={[0, 0, 0.046]} larg={larg * 0.9} alt={0.46} linhas={[{t: texto, tam: texto.length > 6 ? 200 : 260, cor: letra, peso: 900}]} brilho={0.3} />
      <Placa tema={tema} pos={[0, 0, -0.046]} rot={[0, Math.PI, 0]} larg={larg * 0.9} alt={0.46} linhas={[{t: texto, tam: texto.length > 6 ? 200 : 260, cor: letra, peso: 900}]} brilho={0.3} />
    </group>
  );
};

export const Trigo: React.FC<{tema: Tema; pos: V3; k: number; t: number}> = ({tema, pos, k, t}) => {
  if (k < 0.02) return null;
  const terra = mistura(tema.areia, tema.objetoEscuro, 0.55);
  const espiga = mistura(tema.areia, tema.objetoClaro, 0.25);
  const hastes: V3[] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) hastes.push([-1.25 + i * 0.5 + (j % 2) * 0.22, 0, -0.7 + j * 0.46]);
  return (
    <group position={pos}>
      <Caixa args={[3.2, 0.1, 2.0]} raio={0.04} cor={terra} position={[0, 0.05, 0]} />
      {hastes.map((p, i) => {
        const cresce = Math.max(0, Math.min(1, k * 1.6 - (i % 6) * 0.1));
        if (cresce < 0.02) return null;
        const balanca = Math.sin(t * 1.6 + i * 0.7) * 0.06;
        return (
          <group key={i} position={[p[0], 0.1, p[2]]} rotation={[0, 0, balanca]} scale={[1, cresce, 1]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.018, 0.022, 0.7, 6]} />
              <Fosco cor={mistura(espiga, tema.objetoEscuro, 0.3)} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <capsuleGeometry args={[0.06, 0.24, 4, 8]} />
              <Fosco cor={espiga} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const Moinho: React.FC<{tema: Tema; pos: V3; k: number; t: number; giro?: number}> = ({tema, pos, k, t, giro = 1}) => {
  if (k < 0.02) return null;
  const parede = tema.objetoClaro;
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.8, 2.2, 8]} />
        <Fosco cor={parede} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.75, 0.7, 8]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.4, 0.7, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.35, 0.74]} sombra={false} />
      <group position={[0, 1.9, 0.72]} rotation={[0, 0, t * 0.9 * giro]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <Caixa args={[0.06, 1.25, 0.04]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.66, 0.04]} />
            <Caixa args={[0.34, 0.95, 0.02]} raio={0.008} cor={mistura(tema.areia, tema.objetoClaro, 0.4)} position={[0.17, 0.75, 0.05]} />
          </group>
        ))}
      </group>
      {/* o saco de farinha na porta */}
      <group position={[0.9, 0, 0.6]}>
        <Caixa args={[0.5, 0.62, 0.36]} raio={0.15} cor={mistura(tema.branco, tema.areia, 0.25)} position={[0, 0.31, 0]} />
        <Placa tema={tema} pos={[0, 0.34, 0.185]} larg={0.46} alt={0.16} linhas={[{t: 'FARINHA', tam: 200, cor: tema.objetoEscuro, peso: 900}]} />
      </group>
    </group>
  );
};

export const PredioDono: React.FC<{tema: Tema; pos: V3; escala: number; sobe: number; letreiro: number; texto: string; luz?: number; cor?: string}> = ({tema, pos, escala, sobe, letreiro, texto, luz = 0, cor}) => {
  if (sobe < 0.01) return null;
  const y = pos[1] - 3.4 * escala * (1 - sobe);
  const parede = cor ?? tema.objeto;
  const coluna = tema.objetoClaro;
  return (
    <group position={[pos[0], y, pos[2]]} scale={escala}>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[4.4 - i * 0.25, 0.16, 2.9 - i * 0.25]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.08 + i * 0.16, 0.1 - i * 0.05]} />
      ))}
      <Caixa args={[3.6, 2.0, 1.8]} raio={0.05} cor={parede} emissivo={0.25 * luz} position={[0, 1.48, -0.25]} />
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((x) => (
        <mesh key={x} position={[x, 1.48, 0.95]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 2.0, 16]} />
          <Fosco cor={coluna} emissivo={0.2 * luz} />
        </mesh>
      ))}
      <Caixa args={[0.9, 1.3, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.13, 0.66]} sombra={false} />
      <Caixa args={[4.0, 0.62, 2.3]} raio={0.04} cor={parede} emissivo={0.25 * luz} position={[0, 2.79, 0.0]} />
      <Caixa args={[4.1, 0.08, 2.4]} raio={0.02} cor={coluna} position={[0, 3.11, 0.0]} />
      <Placa tema={tema} pos={[0, 2.79, 1.165]} larg={3.5} alt={0.5} linhas={[{t: texto, tam: 230, cor: mistura(tema.objetoClaro, tema.acento, 0.6 * luz), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.25 + 0.6 * letreiro} />
      <mesh position={[0, 3.42, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 2.1, 1.1]} castShadow>
        <cylinderGeometry args={[1, 1, 2.0, 3]} />
        <Fosco cor={parede} emissivo={0.2 * luz} />
      </mesh>
    </group>
  );
};

export const CofreComite: React.FC<{tema: Tema; pos: V3; k: number; letreiro: number; bandeiras: number; brilho?: number}> = ({tema, pos, k, letreiro, bandeiras, brilho = 0}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[2.4, 0.2, 2.0]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
      <group position={[0, 0.2, 0]} scale={1.6}>
        <Cofre tema={tema} pos={[0, 0, 0]} abre={0.15} brilho={brilho} />
      </group>
      {letreiro > 0.02 ? (
        <group position={[0, 2.15, 0.2]} scale={letreiro}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={2.6} alt={0.58} linhas={[{t: 'COMITÊ GESTOR', tam: 150, cor: tema.fundo, peso: 900}]} fundo={tema.acento} brilho={0.5} />
        </group>
      ) : null}
      {[-1, 1].map((l) =>
        bandeiras > 0.02 ? (
          <group key={l} position={[l * 1.05, 0.2, 0.75]} scale={bandeiras}>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
              <Fosco cor={tema.objetoClaro} />
            </mesh>
            <Placa tema={tema} pos={[l * 0.42, 1.2, 0]} larg={0.8} alt={0.3} linhas={[{t: l < 0 ? 'ESTADOS' : 'MUNICÍPIOS', tam: 150, cor: tema.fundo, peso: 900}]} fundo={tema.objetoClaro} dupla />
          </group>
        ) : null,
      )}
    </group>
  );
};

export const Lancha: React.FC<{tema: Tema; pos: V3; k: number; t: number}> = ({tema, pos, k, t}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[2.4, 0.03, 1.3]} raio={0.012} cor={mistura(tema.ceuLuz, tema.fundo, 0.55)} position={[0, 0.035, 0]} sombra={false} />
      <group position={[0, 0.1 + Math.sin(t * 2.2) * 0.02, 0]} rotation={[0, 0.3, Math.sin(t * 1.7) * 0.03]}>
        <Caixa args={[1.3, 0.22, 0.46]} raio={0.1} cor={tema.branco} position={[0, 0.11, 0]} />
        <mesh position={[0.72, 0.13, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.23, 0.36, 4]} />
          <Fosco cor={tema.branco} />
        </mesh>
        <Caixa args={[0.42, 0.18, 0.36]} raio={0.05} cor={mistura(tema.ceuLuz, tema.objetoEscuro, 0.4)} position={[-0.05, 0.31, 0]} />
        <Caixa args={[1.36, 0.04, 0.48]} raio={0.015} cor={tema.objetoEscuro} position={[0.03, 0.03, 0]} />
      </group>
    </group>
  );
};

// botão de percentual: disco na parede com um ponteiro que gira e "%" no meio
export const Dial: React.FC<{tema: Tema; pos: V3; k: number; giro: number; brilho?: number}> = ({tema, pos, k, giro, brilho = 0}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
        <Fosco cor={tema.objetoClaro} emissivo={0.3 * brilho} />
      </mesh>
      <group position={[0, 0, 0.05]} rotation={[0, 0, -giro]}>
        <Caixa args={[0.06, 0.32, 0.03]} raio={0.012} cor={tema.acento} position={[0, 0.17, 0]} emissivo={0.5} sombra={false} />
      </group>
      <Placa tema={tema} pos={[0, -0.02, 0.046]} larg={0.36} alt={0.24} linhas={[{t: '%', tam: 420, cor: tema.objetoEscuro, peso: 900}]} />
    </group>
  );
};

// bolo em fatias que se afastam (abre 0..1)
export const Bolo: React.FC<{tema: Tema; pos: V3; k: number; abre: number}> = ({tema, pos, k, abre}) => {
  if (k < 0.02) return null;
  const n = 4;
  return (
    <group position={pos} scale={k}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const meio = a + Math.PI / n;
        const d = 0.18 * abre;
        return (
          <group key={i} position={[Math.sin(meio) * d, 0, Math.cos(meio) * d]}>
            <mesh position={[0, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.32, 24, 1, false, a, (Math.PI * 2) / n]} />
              <Fosco cor={i % 2 ? corNovo(tema, true) : tema.acento} />
            </mesh>
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.04, 24, 1, false, a, (Math.PI * 2) / n]} />
              <Fosco cor={tema.objetoClaro} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// pãozinho na mão
export const Pao: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.09, 0.16, 6, 12]} />
        <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.3)} />
      </mesh>
    </group>
  );
