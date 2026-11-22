import React from 'react';
import {Caixa, Fosco, type V3} from '../../base/pecas';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças do 234 (grid forming x grid following). Tudo genérico, sem marca de fabricante.

const Cilindro: React.FC<{r: number; h: number; cor: string; pos?: V3; rot?: V3; emissivo?: number; sombra?: boolean}> = ({r, h, cor, pos, rot, emissivo = 0, sombra = true}) => (
  <mesh position={pos} rotation={rot} castShadow={sombra} receiveShadow={sombra}>
    <cylinderGeometry args={[r, r, h, 28]} />
    <Fosco cor={cor} emissivo={emissivo} />
  </mesh>
);

/** Inversor: armário com grelha, telinha e o "cérebro" (chip) em cima, que acende na cor dada. */
export const Inversor: React.FC<{tema: Tema; pos: V3; escala: number; cor: string; cerebro?: number; tela?: number; rotY?: number}> = ({tema, pos, escala, cor, cerebro = 0, tela = 0.3, rotY = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.3, 0.12, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[1.1, 1.7, 0.75]} raio={0.08} cor={mistura(tema.objetoClaro, tema.objeto, 0.35)} position={[0, 0.98, 0]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Caixa key={i} args={[0.7, 0.05, 0.02]} raio={0.015} cor={tema.objetoEscuro} sombra={false} position={[0, 0.45 + 0.1 * i, 0.38]} />
      ))}
      <Caixa args={[0.5, 0.3, 0.02]} raio={0.03} cor={mistura(tema.objetoEscuro, cor, tela)} emissivo={0.2 + 0.8 * tela} sombra={false} position={[0, 1.4, 0.38]} />
      <Caixa args={[0.12, 0.08, 0.02]} raio={0.01} cor={cor} emissivo={0.6} sombra={false} position={[0.4, 1.68, 0.38]} />
      {/* o cérebro: o mesmo chip nos dois, muda só a cor do controle */}
      <Caixa args={[0.5, 0.12, 0.5]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.9, 0]} />
      <Caixa args={[0.34, 0.06, 0.34]} raio={0.03} cor={mistura(tema.objeto, cor, cerebro)} emissivo={0.9 * cerebro} sombra={false} position={[0, 1.98, 0]} />
    </group>
  );

/** Torre de linha de transmissão (treliça simplificada) com dois braços. */
export const Torre: React.FC<{tema: Tema; pos: V3; escala: number; alt?: number}> = ({tema, pos, escala, alt = 3.2}) => {
  if (escala < 0.02) return null;
  const cor = mistura(tema.objeto, tema.objetoEscuro, 0.35);
  return (
    <group position={pos} scale={escala}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <Caixa key={i} args={[0.07, alt, 0.07]} raio={0.02} cor={cor} position={[0.22 * a, alt / 2, 0.22 * b]} rotation={[0.06 * b, 0, -0.06 * a]} />
      ))}
      {[0.3, 0.55, 0.8].map((h, i) => (
        <Caixa key={i} args={[0.5 - 0.12 * i, 0.05, 0.5 - 0.12 * i]} raio={0.01} cor={cor} sombra={false} position={[0, alt * h, 0]} />
      ))}
      <Caixa args={[1.6, 0.08, 0.1]} raio={0.02} cor={cor} position={[0, alt * 0.86, 0]} />
      <Caixa args={[1.1, 0.08, 0.1]} raio={0.02} cor={cor} position={[0, alt * 0.98, 0]} />
      {[-0.75, 0.75, -0.5, 0.5].map((x, i) => (
        <Caixa key={i} args={[0.06, 0.18, 0.06]} raio={0.02} cor={tema.objetoClaro} sombra={false} position={[x, alt * (i < 2 ? 0.86 : 0.98) - 0.12, 0]} />
      ))}
    </group>
  );
};

/** Cabo reto entre dois pontos (barra fina), com uma bolinha de luz que corre de a para b quando `u` anda. */
export const Fio: React.FC<{a: V3; b: V3; cor: string; k: number; u?: number; bolinha?: string; esp?: number}> = ({a, b, cor, k, u, bolinha, esp = 0.05}) => {
  if (k < 0.02) return null;
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(d[0], d[1], d[2]) * Math.min(1, k);
  const ang = Math.atan2(d[1], Math.hypot(d[0], d[2]));
  const yaw = Math.atan2(-d[2], d[0]);
  const fr = (x: number) => x - Math.floor(x);
  return (
    <group position={a} rotation={[0, yaw, ang]}>
      <Caixa args={[len, esp, esp]} raio={esp / 3} cor={cor} sombra={false} position={[len / 2, 0, 0]} />
      {u !== undefined && bolinha ? [0, 0.33, 0.66].map((o, i) => <Caixa key={i} args={[0.16, 0.16, 0.16]} raio={0.07} cor={bolinha} emissivo={0.9} sombra={false} position={[len * fr(u + o), 0, 0]} />) : null}
    </group>
  );
};

/** Onda de tensão feita de contas em fila (seno). `fase` faz a onda andar; `amp` é a altura. */
export const Senoide: React.FC<{pos: V3; larg: number; amp: number; fase: number; cor: string; k: number; n?: number; ciclos?: number; rotY?: number}> = ({pos, larg, amp, fase, cor, k, n = 36, ciclos = 2, rotY = 0}) => {
  if (k < 0.02) return null;
  const vis = Math.round(n * Math.min(1, k));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {Array.from({length: vis}).map((_, i) => {
        const x = (i / (n - 1)) * larg - larg / 2;
        const y = amp * Math.sin((i / (n - 1)) * ciclos * 2 * Math.PI - fase);
        return <Caixa key={i} args={[0.12, 0.12, 0.12]} raio={0.05} cor={cor} emissivo={0.55} sombra={false} position={[x, y, 0]} />;
      })}
    </group>
  );
};

/** Gerador síncrono: carcaça cilíndrica deitada com eixo girando e volante. */
export const Gerador: React.FC<{tema: Tema; pos: V3; escala: number; giro: number; cor?: string; rotY?: number}> = ({tema, pos, escala, giro, cor, rotY = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.8, 0.2, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
      <Cilindro r={0.55} h={1.4} cor={cor ?? mistura(tema.objeto, tema.objetoClaro, 0.3)} pos={[0, 0.75, 0]} rot={[0, 0, Math.PI / 2]} />
      <group position={[0.9, 0.75, 0]} rotation={[giro, 0, 0]}>
        <Cilindro r={0.08} h={0.5} cor={tema.objetoEscuro} rot={[0, 0, Math.PI / 2]} />
        <Caixa args={[0.08, 0.9, 0.12]} raio={0.03} cor={tema.objetoEscuro} position={[0.2, 0, 0]} />
      </group>
    </group>
  );

/** Painel solar inclinado num suporte. `apaga` escurece uma parte (energia deixada na mesa). */
export const PainelSolar: React.FC<{tema: Tema; pos: V3; escala: number; apaga?: number; cor: string; rotY?: number}> = ({tema, pos, escala, apaga = 0, cor, rotY = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.08, 0.6, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.3, 0]} />
      <group position={[0, 0.65, 0]} rotation={[0.6, 0, 0]}>
        <Caixa args={[1.5, 0.05, 0.9]} raio={0.03} cor={tema.objetoEscuro} />
        {[0, 1, 2].map((c) =>
          [0, 1].map((l) => {
            const off = c === 2 ? apaga : 0;
            return <Caixa key={`${c}${l}`} args={[0.44, 0.03, 0.38]} raio={0.02} cor={mistura(cor, tema.objetoEscuro, 0.2 + 0.6 * off)} emissivo={0.35 * (1 - off)} sombra={false} position={[-0.48 + 0.48 * c, 0.03, -0.2 + 0.4 * l]} />;
          }),
        )}
      </group>
    </group>
  );

/** Turbina eólica: torre, nacele e três pás girando. */
export const Turbina: React.FC<{tema: Tema; pos: V3; escala: number; giro: number}> = ({tema, pos, escala, giro}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Cilindro r={0.08} h={3} cor={tema.objetoClaro} pos={[0, 1.5, 0]} />
      <Caixa args={[0.2, 0.2, 0.45]} raio={0.06} cor={tema.objetoClaro} position={[0, 3.05, 0.05]} />
      <group position={[0, 3.05, 0.3]} rotation={[0, 0, giro]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * 2 * Math.PI) / 3]}>
            <Caixa args={[0.1, 1.3, 0.03]} raio={0.03} cor={tema.objetoClaro} position={[0, 0.65, 0]} />
          </group>
        ))}
      </group>
    </group>
  );

/** Subestação robusta: pórticos, transformadores e barramentos. */
export const Subestacao: React.FC<{tema: Tema; pos: V3; escala: number; luz?: number}> = ({tema, pos, escala, luz = 0}) => {
  if (escala < 0.02) return null;
  const cor = mistura(tema.objeto, tema.objetoEscuro, 0.3);
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[4.2, 0.08, 2.6]} raio={0.02} cor={mistura(tema.chao, tema.objetoEscuro, 0.5)} position={[0, 0.04, 0]} sombra={false} />
      {[-1.4, 0, 1.4].map((x, i) => (
        <group key={i} position={[x, 0, 0.3]}>
          <Caixa args={[0.8, 0.9, 0.7]} raio={0.06} cor={mistura(tema.objeto, tema.objetoClaro, 0.2)} position={[0, 0.5, 0]} />
          {[-0.25, 0, 0.25].map((z, j) => (
            <Cilindro key={j} r={0.05} h={0.5} cor={tema.objetoClaro} pos={[z, 1.2, 0]} sombra={false} />
          ))}
        </group>
      ))}
      {[-2, 2].map((x, i) => (
        <group key={i} position={[x, 0, -0.8]}>
          <Caixa args={[0.12, 2.2, 0.12]} raio={0.03} cor={cor} position={[0, 1.1, 0]} />
        </group>
      ))}
      <Caixa args={[4.1, 0.1, 0.1]} raio={0.03} cor={cor} position={[0, 2.15, -0.8]} />
      <Caixa args={[4.0, 0.05, 0.05]} raio={0.02} cor={tema.acento} emissivo={0.3 + 0.5 * luz} sombra={false} position={[0, 1.95, -0.8]} />
    </group>
  );
};

/** Barra vertical (coluna de corrente) que cresce até `alt`; tampa opcional de limite em `limite`. */
export const Coluna: React.FC<{pos: V3; alt: number; cor: string; larg?: number; emissivo?: number}> = ({pos, alt, cor, larg = 0.9, emissivo = 0}) =>
  alt < 0.01 ? null : <Caixa args={[larg, alt, larg]} raio={0.06} cor={cor} emissivo={emissivo} position={[pos[0], pos[1] + alt / 2, pos[2]]} />;
