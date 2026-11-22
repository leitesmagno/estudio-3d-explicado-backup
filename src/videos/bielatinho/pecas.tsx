import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import type {Tema} from '../../base/tema';

// Peças do vídeo 157 (biela, Tinho Auto Peças): motor monocilíndrico em corte, biela com olhos,
// virabrequim, haltere, moto simples e galão de óleo. Frente de tudo em z+.

const PI = Math.PI;
const AÇO_ASP = 0.42;

// ---------- medidas do motor (1 unidade ≈ 1 m, motor "de maquete") ----------
export const MOTOR = {C: [0, 1.1, 0] as V3, r: 0.32, L: 1.15};

/** Geometria do mecanismo para o ângulo th (rad, 0 = moente em cima, sentido horário de frente). */
export const geoMotor = (th: number) => {
  const {C, r, L} = MOTOR;
  const s = Math.sin(th);
  const c = Math.cos(th);
  const px = C[0] + r * s;
  const py = C[1] + r * c;
  const pinoY = C[1] + r * c + Math.sqrt(L * L - r * r * s * s);
  const giroBiela = Math.asin((r * s) / L); // rotação em z da biela (local +y aponta para o pino)
  return {px, py, pinoY, giroBiela};
};

// ---------- meio cilindro (axis z depois de girar) ----------
const meioCil = (r: number, h: number, cima: boolean) => {
  const g = new THREE.CylinderGeometry(r, r, h, 40, 1, false, cima ? PI / 2 : -PI / 2, PI);
  g.rotateX(PI / 2);
  return g;
};
const G_CABECA_CIMA = meioCil(0.2, 0.16, true);
const G_CABECA_CAPA = meioCil(0.2, 0.16, false);
const G_BRONZ_CIMA = (() => {
  const g = new THREE.CylinderGeometry(0.112, 0.112, 0.17, 32, 1, true, PI / 2, PI);
  g.rotateX(PI / 2);
  return g;
})();
const G_BRONZ_BAIXO = (() => {
  const g = new THREE.CylinderGeometry(0.112, 0.112, 0.17, 32, 1, true, -PI / 2, PI);
  g.rotateX(PI / 2);
  return g;
})();
const G_CONTRAPESO = meioCil(0.42, 0.08, false);
const G_CAMISA = new THREE.CylinderGeometry(0.46, 0.46, 1.3, 48, 1, true, PI / 2, PI);

export type Olhar = 'ok' | 'medo' | 'tchau' | 'feliz';

/** Olhos e boca da biela (no espaço da biela, rosto em z+). */
const Rosto: React.FC<{tema: Tema; y: number; olhar: Olhar; mira?: [number, number]}> = ({tema, y, olhar, mira = [0, 0]}) => {
  const z = 0.075;
  const pupila = olhar === 'medo' ? 0.014 : 0.022;
  const olho = (x: number, fechado: boolean) =>
    fechado ? (
      <mesh position={[x, y, z + 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.07, 0.012, 0.01]} />
        <Fosco cor={tema.tinta} />
      </mesh>
    ) : (
      <group position={[x, y, z]}>
        <mesh>
          <sphereGeometry args={[olhar === 'medo' ? 0.05 : 0.045, 20, 14]} />
          <Fosco cor={tema.branco} aspereza={0.5} />
        </mesh>
        <mesh position={[mira[0] * 0.015, mira[1] * 0.015, 0.04]}>
          <sphereGeometry args={[pupila, 14, 10]} />
          <Fosco cor={tema.tinta} aspereza={0.3} />
        </mesh>
      </group>
    );
  return (
    <group>
      {olho(-0.048, false)}
      {olho(0.048, olhar === 'tchau')}
      {olhar === 'medo' ? (
        <>
          <mesh position={[-0.05, y + 0.075, z + 0.02]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <Fosco cor={tema.tinta} />
          </mesh>
          <mesh position={[0.05, y + 0.075, z + 0.02]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <Fosco cor={tema.tinta} />
          </mesh>
          <mesh position={[0, y - 0.1, z + 0.005]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.025, 14, 10]} />
            <Fosco cor={tema.tinta} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, y - 0.085, z + 0.005]} rotation={[0, 0, PI]}>
          <torusGeometry args={[olhar === 'ok' ? 0.032 : 0.042, 0.009, 8, 20, PI]} />
          <Fosco cor={tema.tinta} />
        </mesh>
      )}
    </group>
  );
};

/** A biela: cabeça (com capa) na origem, pé em (0, L, 0). */
export const Biela: React.FC<{
  tema: Tema;
  L?: number;
  olhar?: Olhar;
  mira?: [number, number];
  capa?: number; // quanto a capa desce (m)
  paraf?: number; // 0 a 1: parafusos aparecem subindo
  bronz?: number; // 0 a 1: bronzinas visíveis e acesas
  pino?: boolean; // pino do pistão no pé
  vira?: boolean; // moente do virabrequim na cabeça
  gasta?: number; // 0 a 1: cabeça avermelhada (bronzina gasta)
  maromba?: number; // 0 a 1: corpo estufa
  suor?: number;
}> = ({tema, L = MOTOR.L, olhar = 'ok', mira, capa = 0, paraf = 0, bronz = 0, pino = false, vira = false, gasta = 0, maromba = 0, suor = 0}) => {
  const aco = mistura(tema.objetoClaro, tema.acento, 0.55 * gasta);
  const corpoL = L - 0.26;
  const larg = 0.15 * (1 + 0.35 * maromba);
  return (
    <group>
      {/* corpo em I */}
      <Caixa args={[larg, corpoL, 0.07]} raio={0.02} cor={tema.objetoClaro} position={[0, 0.13 + corpoL / 2, 0]} />
      <Caixa args={[0.035, corpoL, 0.15]} raio={0.012} cor={tema.objetoClaro} position={[-larg / 2, 0.13 + corpoL / 2, 0]} />
      <Caixa args={[0.035, corpoL, 0.15]} raio={0.012} cor={tema.objetoClaro} position={[larg / 2, 0.13 + corpoL / 2, 0]} />
      {/* pé */}
      <mesh position={[0, L, 0]} rotation={[PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 36]} />
        <Fosco cor={tema.objetoClaro} aspereza={AÇO_ASP} />
      </mesh>
      <mesh position={[0, L, 0]} rotation={[PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.152, 28]} />
        <Fosco cor={pino ? tema.objeto : tema.tinta} aspereza={0.5} />
      </mesh>
      {/* cabeça: metade de cima */}
      <mesh geometry={G_CABECA_CIMA} castShadow>
        <Fosco cor={aco} aspereza={AÇO_ASP} emissivo={0.25 * gasta} />
      </mesh>
      <Caixa args={[0.12, 0.08, 0.16]} raio={0.015} cor={aco} position={[-0.23, 0.04, 0]} />
      <Caixa args={[0.12, 0.08, 0.16]} raio={0.015} cor={aco} position={[0.23, 0.04, 0]} />
      {/* capa */}
      <group position={[0, -capa, 0]}>
        <mesh geometry={G_CABECA_CAPA} castShadow>
          <Fosco cor={aco} aspereza={AÇO_ASP} emissivo={0.25 * gasta} />
        </mesh>
        <Caixa args={[0.12, 0.08, 0.16]} raio={0.015} cor={aco} position={[-0.23, -0.04, 0]} />
        <Caixa args={[0.12, 0.08, 0.16]} raio={0.015} cor={aco} position={[0.23, -0.04, 0]} />
        {bronz > 0.02 ? (
          <mesh geometry={G_BRONZ_BAIXO} scale={[1, 1, 1]}>
            <Fosco cor={tema.areia} emissivo={0.35 * bronz} dupla aspereza={0.35} />
          </mesh>
        ) : null}
      </group>
      {bronz > 0.02 ? (
        <mesh geometry={G_BRONZ_CIMA}>
          <Fosco cor={tema.areia} emissivo={0.35 * bronz} dupla aspereza={0.35} />
        </mesh>
      ) : null}
      {/* furo da cabeça (escuro) ou moente */}
      <mesh rotation={[PI / 2, 0, 0]} position={[0, -capa / 2, 0]}>
        <cylinderGeometry args={[vira ? 0.1 : 0.098, vira ? 0.1 : 0.098, vira ? 0.3 : 0.162, 28]} />
        <Fosco cor={vira ? tema.objeto : tema.tinta} aspereza={0.5} />
      </mesh>
      {/* parafusos */}
      {paraf > 0.02
        ? [-0.23, 0.23].map((x) => (
            <group key={x} position={[x, -0.25 * (1 - paraf) - capa, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.24, 14]} />
                <Fosco cor={tema.objetoEscuro} aspereza={0.4} />
              </mesh>
              <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.042, 0.042, 0.04, 6]} />
                <Fosco cor={tema.objetoEscuro} aspereza={0.4} />
              </mesh>
            </group>
          ))
        : null}
      <Rosto tema={tema} y={L * 0.6} olhar={olhar} mira={mira} />
      {suor > 0.02 ? (
        <mesh position={[0.11, L * 0.72, 0.08]} scale={[0.6 * suor, 0.9 * suor, 0.6 * suor]}>
          <sphereGeometry args={[0.05, 14, 10]} />
          <Fosco cor={tema.ceuLuz} emissivo={0.25} aspereza={0.2} />
        </mesh>
      ) : null}
    </group>
  );
};

/** Virabrequim girando em volta de z (ângulo th, mesmo sentido do geoMotor). */
export const Virabrequim: React.FC<{tema: Tema; th: number}> = ({tema, th}) => {
  const {C, r} = MOTOR;
  return (
    <group position={C}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.62, 32]} />
        <Fosco cor={tema.objeto} aspereza={AÇO_ASP} />
      </mesh>
      <group rotation={[0, 0, -th]}>
        {[-0.165, 0.165].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <Caixa args={[0.3, 0.5, 0.08]} raio={0.06} cor={tema.objeto} position={[0, r / 2, 0]} />
            <mesh geometry={G_CONTRAPESO} castShadow>
              <Fosco cor={tema.objetoEscuro} aspereza={0.5} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, r, 0]} rotation={[PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.34, 28]} />
          <Fosco cor={tema.objeto} aspereza={AÇO_ASP} />
        </mesh>
      </group>
    </group>
  );
};

/** Pistão com anéis, o pino no meio (centro do pino em y = 0). */
export const Pistao: React.FC<{tema: Tema}> = ({tema}) => (
  <group>
    <mesh position={[0, 0.12, 0]} castShadow>
      <cylinderGeometry args={[0.42, 0.42, 0.5, 48]} />
      <Fosco cor={tema.objetoClaro} aspereza={0.45} />
    </mesh>
    {[0.24, 0.29, 0.34].map((y) => (
      <mesh key={y} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}>
        <torusGeometry args={[0.421, 0.011, 8, 48]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    ))}
    <mesh rotation={[PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.6, 20]} />
      <Fosco cor={tema.objeto} aspereza={0.4} />
    </mesh>
  </group>
);

/** Bloco em corte (frente aberta), cabeçote, cárter e o suporte. */
export const Bloco: React.FC<{tema: Tema; racha?: number}> = ({tema, racha = 0}) => {
  const cor = tema.objeto;
  const escuro = tema.objetoEscuro;
  const aletas = [2.0, 2.2, 2.4, 2.6, 2.8];
  return (
    <group>
      {/* camisa do cilindro (só o fundo) */}
      <mesh geometry={G_CAMISA} position={[0, 2.4, 0]}>
        <Fosco cor={escuro} dupla aspereza={0.6} />
      </mesh>
      <Caixa args={[1.3, 1.4, 0.1]} raio={0.03} cor={cor} position={[0, 2.38, -0.52]} />
      <Caixa args={[0.12, 1.4, 1.0]} raio={0.03} cor={cor} position={[-0.6, 2.38, -0.02]} />
      <Caixa args={[0.12, 1.4, 1.0]} raio={0.03} cor={cor} position={[0.6, 2.38, -0.02]} />
      {aletas.map((y) => (
        <React.Fragment key={y}>
          <Caixa args={[0.26, 0.05, 0.92]} raio={0.02} cor={cor} position={[-0.76, y, -0.02]} />
          <Caixa args={[0.26, 0.05, 0.92]} raio={0.02} cor={cor} position={[0.76, y, -0.02]} />
        </React.Fragment>
      ))}
      {/* cabeçote e vela */}
      <Caixa args={[1.55, 0.3, 1.1]} raio={0.06} cor={mistura(cor, tema.objetoClaro, 0.2)} position={[0, 3.24, -0.02]} />
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 16]} />
        <Fosco cor={tema.branco} />
      </mesh>
      {/* cárter */}
      <Caixa args={[1.9, 1.3, 0.1]} raio={0.04} cor={cor} position={[0, 1.05, -0.62]} />
      <Caixa args={[0.12, 1.3, 1.2]} raio={0.04} cor={cor} position={[-0.92, 1.05, -0.06]} />
      <Caixa args={[0.12, 1.3, 1.2]} raio={0.04} cor={cor} position={[0.92, 1.05, -0.06]} />
      <Caixa args={[1.9, 0.12, 1.2]} raio={0.04} cor={escuro} position={[0, 0.42, -0.06]} />
      {/* suporte */}
      <Caixa args={[2.6, 0.36, 1.6]} raio={0.06} cor={escuro} position={[0, 0.18, 0]} />
      {/* racha na parede direita (a biela saiu por ali) */}
      {racha > 0.02 ? (
        <group position={[0.665, 2.55, 0.2]} scale={racha}>
          {[
            [0, 0, 0.5, 0.36],
            [0.0, -0.17, -0.6, 0.3],
            [0, 0.16, 0.9, 0.26],
            [0, -0.32, 0.3, 0.2],
          ].map(([x, y, a, l], i) => (
            <mesh key={i} position={[x + 0.002, y, 0]} rotation={[a, 0, 0]}>
              <boxGeometry args={[0.01, l, 0.05]} />
              <Fosco cor={tema.tinta} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};

/** Haltere (para o "marombeiro"). */
export const Haltere: React.FC<{tema: Tema; pos: V3; k: number; rot?: number}> = ({tema, pos, k, rot = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k} rotation={[0, 0, rot]}>
      <mesh rotation={[0, 0, PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 14]} />
        <Fosco cor={tema.objeto} aspereza={0.4} />
      </mesh>
      {[-0.3, -0.24, 0.24, 0.3].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.05, 28]} />
          <Fosco cor={tema.acento} aspereza={0.5} />
        </mesh>
      ))}
    </group>
  );

/** Moto simples (sem marca): duas rodas, tanque, banco e guidão. Frente para x+. */
export const Moto: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, 0.32, 0]}>
          <mesh>
            <torusGeometry args={[0.26, 0.07, 12, 32]} />
            <Fosco cor={tema.tinta} aspereza={0.7} />
          </mesh>
          <mesh rotation={[PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 20]} />
            <Fosco cor={tema.objeto} />
          </mesh>
        </group>
      ))}
      <Caixa args={[0.9, 0.12, 0.12]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.5, 0]} rotation={[0, 0, 0.12]} />
      <Caixa args={[0.42, 0.22, 0.3]} raio={0.09} cor={tema.acento} position={[0.12, 0.72, 0]} />
      <Caixa args={[0.42, 0.08, 0.26]} raio={0.04} cor={tema.tinta} position={[-0.3, 0.72, 0]} />
      <Caixa args={[0.3, 0.26, 0.24]} raio={0.05} cor={tema.objeto} position={[0, 0.48, 0]} />
      <Caixa args={[0.06, 0.5, 0.06]} raio={0.02} cor={tema.objeto} position={[0.48, 0.62, 0]} rotation={[0, 0, -0.35]} />
      <Caixa args={[0.06, 0.06, 0.6]} raio={0.02} cor={tema.objetoEscuro} position={[0.56, 0.88, 0]} />
    </group>
  );

/** Galão de óleo genérico (sem marca), bico para x+. */
export const Galao: React.FC<{tema: Tema; pos: V3; k: number; inclina?: number}> = ({tema, pos, k, inclina = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k} rotation={[0, 0, -inclina]}>
      <Caixa args={[0.5, 0.65, 0.22]} raio={0.06} cor={tema.acento} position={[0, 0, 0]} />
      <Caixa args={[0.2, 0.08, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[-0.08, 0.38, 0]} />
      <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.04, 0.05, 0.22, 14]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <Caixa args={[0.36, 0.2, 0.005]} raio={0.002} cor={tema.branco} position={[0, -0.02, 0.113]} />
    </group>
  );
