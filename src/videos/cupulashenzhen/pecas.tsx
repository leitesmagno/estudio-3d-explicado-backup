import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import {type Tema} from '../../base/tema';

// Peças do 233 (cúpula de Shenzhen): mesa redonda, cadeira, ogiva genérica, ponte quebrada, X e moldura de foto.

export const MesaRedonda: React.FC<{tema: Tema; pos: V3; r?: number; k: number}> = ({tema, pos, r = 1.3, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.08, 48]} />
        <Fosco cor={mistura(tema.objeto, tema.objetoClaro, 0.25)} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.34, 0.48, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );
};

// cadeira de espaldar alto, frente (assento) virada para z+ do próprio eixo
export const CadeiraMesa: React.FC<{tema: Tema; pos: V3; rotY?: number; k: number; cor?: string; brilho?: number}> = ({tema, pos, rotY = 0, k, cor, brilho = 0}) => {
  if (k < 0.02) return null;
  const c = cor ?? mistura(tema.objetoEscuro, tema.objeto, 0.35);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <Caixa args={[0.62, 0.1, 0.6]} raio={0.04} cor={c} position={[0, 0.5, 0]} emissivo={brilho * 0.3} />
      <Caixa args={[0.62, 0.9, 0.1]} raio={0.04} cor={c} position={[0, 1.0, -0.3]} emissivo={brilho * 0.3} />
      <Caixa args={[0.1, 0.5, 0.1]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
    </group>
  );
};

// "?" grande em placa, flutuando sobre a cadeira vazia
export const Interrogacao: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={0.9} alt={1.1} linhas={[{t: '?', tam: 520, cor: tema.acento, peso: 900}]} brilho={0.5} />
    </group>
  );
};

// ogiva genérica: corpo cilíndrico, ponta em cone e aletas; em pé
export const Ogiva: React.FC<{tema: Tema; pos: V3; k: number; cor?: string; escala?: number}> = ({tema, pos, k, cor, escala = 1}) => {
  if (k < 0.02) return null;
  const c = cor ?? mistura(tema.objeto, tema.objetoClaro, 0.2);
  return (
    <group position={pos} scale={k * escala}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.1, 20]} />
        <Fosco cor={c} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <coneGeometry args={[0.2, 0.7, 20]} />
        <Fosco cor={tema.acento} emissivo={0.15} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[0.04, 0.4, 0.22]} raio={0.01} cor={tema.objetoEscuro} position={[Math.sin((i * Math.PI * 2) / 3) * 0.22, 0.2, Math.cos((i * Math.PI * 2) / 3) * 0.22]} rotation={[0, (i * Math.PI * 2) / 3, 0]} sombra={false} />
      ))}
    </group>
  );
};

// ponte quebrada: dois pedaços com um vão e uma lasca caída
export const PonteQuebrada: React.FC<{tema: Tema; pos: V3; k: number; quebra: number}> = ({tema, pos, k, quebra}) => {
  if (k < 0.02) return null;
  const c = mistura(tema.objeto, tema.objetoClaro, 0.2);
  const v = 0.35 + 0.5 * quebra;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[1.6, 0.22, 1.0]} raio={0.05} cor={c} position={[-v - 0.8, 0.5, 0]} rotation={[0, 0, 0.06 * quebra]} />
      <Caixa args={[1.6, 0.22, 1.0]} raio={0.05} cor={c} position={[v + 0.8, 0.5, 0]} rotation={[0, 0, -0.06 * quebra]} />
      <Caixa args={[0.3, 0.9, 0.5]} raio={0.04} cor={tema.objetoEscuro} position={[-1.7, 0.0, 0]} />
      <Caixa args={[0.3, 0.9, 0.5]} raio={0.04} cor={tema.objetoEscuro} position={[1.7, 0.0, 0]} />
      <Caixa args={[0.5, 0.12, 0.7]} raio={0.03} cor={mistura(c, tema.objetoEscuro, 0.3)} position={[0.1, 0.06 + 0.02, 0.05]} rotation={[0.2, 0.5, 0.3]} opacidade={quebra} />
    </group>
  );
};

// X grande na cor do acento (cai de frente, de pé)
export const XGrande: React.FC<{tema: Tema; pos: V3; k: number; escala?: number}> = ({tema, pos, k, escala = 1}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k * escala}>
      <Caixa args={[1.3, 0.2, 0.1]} raio={0.04} cor={tema.acento} emissivo={0.35} rotation={[0, 0, Math.PI / 4]} />
      <Caixa args={[1.3, 0.2, 0.1]} raio={0.04} cor={tema.acento} emissivo={0.35} rotation={[0, 0, -Math.PI / 4]} />
    </group>
  );
};

// moldura de foto em pé
export const MolduraFoto: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[1.1, 1.4, 0.08]} raio={0.04} cor={tema.objetoClaro} position={[0, 0.8, 0]} />
      <Caixa args={[0.86, 1.16, 0.05]} raio={0.03} cor={mistura(tema.objeto, tema.objetoEscuro, 0.4)} position={[0, 0.8, 0.04]} />
      <Boneco2 tema={tema} />
    </group>
  );
};
const Boneco2: React.FC<{tema: Tema}> = ({tema}) => (
  <group position={[0, 0.75, 0.08]}>
    <mesh position={[0, 0.22, 0]}>
      <sphereGeometry args={[0.13, 20, 16]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
    <Caixa args={[0.4, 0.34, 0.04]} raio={0.1} cor={tema.objetoClaro} position={[0, -0.12, 0]} sombra={false} />
  </group>
);

// caixa de força com 3 chaves que acendem (luz: 0 a 1 cada)
export const CaixaDeForca: React.FC<{tema: Tema; pos: V3; k: number; chaves: [number, number, number]}> = ({tema, pos, k, chaves}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[0.2, 0.2, 0.2]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.1, 0]} sombra={false} />
      <Caixa args={[1.0, 1.3, 0.28]} raio={0.05} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[0, 0.95, 0]} />
      {chaves.map((l, i) => (
        <group key={i} position={[-0.3 + 0.3 * i, 1.0, 0.16]}>
          <Caixa args={[0.2, 0.2, 0.06]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, l)} emissivo={0.6 * l} sombra={false} />
          <Caixa args={[0.05, 0.1, 0.05]} raio={0.01} cor={tema.objetoClaro} position={[0, 0.0, 0.05]} sombra={false} />
        </group>
      ))}
      <Caixa args={[0.8, 0.12, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0, 1.4, 0.16]} sombra={false} />
    </group>
  );
};

// seta simples apontando para +x (dir=1) ou -x (dir=-1)
export const SetaSimples: React.FC<{tema: Tema; pos: V3; dir: 1 | -1; k: number}> = ({tema, pos, dir, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[k * dir, k, k]}>
      <Caixa args={[1.0, 0.16, 0.16]} raio={0.05} cor={tema.acento} emissivo={0.3} position={[-0.1, 0, 0]} />
      <Caixa args={[0.5, 0.16, 0.16]} raio={0.05} cor={tema.acento} emissivo={0.3} position={[0.42, 0.14, 0]} rotation={[0, 0, -0.75]} />
      <Caixa args={[0.5, 0.16, 0.16]} raio={0.05} cor={tema.acento} emissivo={0.3} position={[0.42, -0.14, 0]} rotation={[0, 0, 0.75]} />
    </group>
  );
};

// arena: disco baixo no chão que marca onde a briga acontece
export const Arena: React.FC<{tema: Tema; pos: V3; r?: number; k: number}> = ({tema, pos, r = 2, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[r, r, 0.04, 48]} />
        <Fosco cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} />
      </mesh>
    </group>
  );
};
