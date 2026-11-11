import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, geoCaixa, useDescartar, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';

// Peças do vídeo da intimação. Tudo parado; quem anima é a cena, pelo tempo da fala.
// Medidas em metros. O tampo da mesa fica na altura MESA_Y.

export const MESA_Y = 0.78;
export const mistura = (a: string, b: string, k: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, k))).getHexString();

// ---------- Mesa com gaveta na frente ----------
export const Mesa: React.FC<{tema: Tema; gaveta: number}> = ({tema, gaveta}) => (
  <group>
    <Caixa args={[3.4, 0.08, 1.8]} raio={0.03} cor={mistura(tema.areia, tema.objetoEscuro, 0.3)} position={[0, MESA_Y - 0.04, 0]} />
    {[-1, 1].map((sx) => [-1, 1].map((sz) => <Caixa key={`${sx}${sz}`} args={[0.08, MESA_Y - 0.08, 0.08]} raio={0.02} cor={tema.areia} position={[sx * 1.58, (MESA_Y - 0.08) / 2, sz * 0.8]} />))}
    {/* Gaveta: abre para a frente (z+) */}
    <group position={[0, MESA_Y - 0.16, 0.42 + gaveta * 0.42]}>
      <Caixa args={[0.9, 0.12, 0.84]} raio={0.015} cor={mistura(tema.areia, tema.objetoEscuro, 0.35)} />
      <Caixa args={[0.96, 0.15, 0.03]} raio={0.012} cor={tema.areia} position={[0, 0, 0.43]} />
      <Caixa args={[0.16, 0.025, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0, 0.46]} />
    </group>
  </group>
);

// ---------- Luminária pendente ----------
// `peca`: desenha a cúpula (some quando a câmera está acima dela, para não tapar a mesa).
export const Luminaria: React.FC<{tema: Tema; peca?: boolean}> = ({tema, peca = true}) => (
  <group position={[0, 0, 0.1]}>
    {peca ? (
      <>
    <mesh position={[0, 3.6, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 2.2, 6]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 2.42, 0]}>
      <cylinderGeometry args={[0.06, 0.3, 0.24, 32, 1, true]} />
      <meshStandardMaterial color={tema.objetoEscuro} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 2.33, 0]}>
      <sphereGeometry args={[0.07, 20, 16]} />
      <Fosco cor={tema.objetoClaro} emissivo={2.2} />
    </mesh>
      </>
    ) : null}
    <spotLight position={[0, 2.3, 0]} angle={0.8} penumbra={1} intensity={2.2} decay={2} color={tema.luzCor} />
  </group>
);

// ---------- Carta (envelope com faixa e selo) ----------
export const Carta: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number; brilho?: number; apagada?: boolean; carimbo?: number}> = ({
  tema,
  pos,
  rot = [0, 0, 0],
  escala = 1,
  brilho = 0,
  apagada,
  carimbo = 0,
}) => {
  if (escala < 0.02) return null;
  const papel = apagada ? tema.corpo : tema.objetoClaro;
  const faixa = apagada ? tema.objetoEscuro : tema.acento;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.34, 0.012, 0.23]} raio={0.004} cor={papel} position={[0, 0.006, 0]} />
      {/* Aba em V, em relevo leve */}
      <mesh position={[0, 0.0125, -0.04]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <circleGeometry args={[0.17, 3, Math.PI / 2 - Math.PI / 3, (2 * Math.PI) / 3]} />
        <Fosco cor={mistura(papel, tema.objetoEscuro, 0.12)} />
      </mesh>
      <Caixa args={[0.34, 0.014, 0.035]} raio={0.004} cor={faixa} emissivo={0.15 + brilho * 0.9} position={[0, 0.007, -0.097]} />
      <mesh position={[0, 0.015, 0.01]}>
        <cylinderGeometry args={[0.022, 0.022, 0.006, 24]} />
        <Fosco cor={faixa} emissivo={0.1 + brilho * 0.6} />
      </mesh>
      {carimbo > 0.02 ? (
        <mesh position={[0.08, 0.0135, 0.05]} rotation={[-Math.PI / 2, 0, 0.12]} scale={carimbo}>
          <planeGeometry args={[0.13, 0.06]} />
          <Fosco cor={tema.acento} emissivo={0.5} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- Objetos do dia a dia ----------
export const Caneca: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.12, 28]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0.058, 0.065, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.025, 0.008, 10, 20]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

export const Chaves: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} castShadow>
        <torusGeometry args={[0.03, 0.005, 8, 24]} />
        <meshStandardMaterial color={tema.tinta} roughness={0.35} metalness={0.6} />
      </mesh>
      {[0.5, -0.4].map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <Caixa args={[0.09, 0.006, 0.022]} raio={0.003} cor={tema.objeto} position={[0.07, 0.006, 0]} />
        </group>
      ))}
    </group>
  );

// ---------- Sala de audiência em miniatura ----------
const CadeiraMini: React.FC<{pos: V3; cor: string; brilho?: number}> = ({pos, cor, brilho = 0}) => (
  <group position={pos}>
    <Caixa args={[0.09, 0.014, 0.09]} raio={0.004} cor={cor} emissivo={brilho} position={[0, 0.065, 0]} />
    <Caixa args={[0.09, 0.09, 0.014]} raio={0.004} cor={cor} emissivo={brilho} position={[0, 0.11, -0.04]} />
    <Caixa args={[0.02, 0.06, 0.02]} raio={0.004} cor={cor} position={[0, 0.03, 0]} />
  </group>
);
export const SalaMini: React.FC<{tema: Tema; pos: V3; escala: number; vazia: number; papel: number; carimbo: number}> = ({tema, pos, escala, vazia, papel, carimbo}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {/* Bancada do juiz */}
      <Caixa args={[0.46, 0.14, 0.1]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.07, -0.2]} />
      <Caixa args={[0.5, 0.012, 0.13]} raio={0.004} cor={tema.objeto} position={[0, 0.146, -0.2]} />
      {/* Juiz: boneco pequeno atrás da bancada */}
      <group position={[0, 0, -0.3]} scale={0.11}>
        <mesh position={[0, 1.3, 0]} scale={[1, 1, 0.74]} castShadow>
          <capsuleGeometry args={[0.26, 0.5, 10, 20]} />
          <Fosco cor={tema.pessoa} />
        </mesh>
        <mesh position={[0, 1.95, 0]} castShadow>
          <sphereGeometry args={[0.18, 20, 16]} />
          <Fosco cor={tema.pessoa} />
        </mesh>
      </group>
      {/* As duas cadeiras das partes: a da esquerda ocupada, a da direita vazia */}
      <CadeiraMini pos={[-0.13, 0, 0.05]} cor={tema.corpo} />
      <group position={[-0.13, 0, 0.09]} scale={0.1}>
        <mesh position={[0, 1.05, 0]} scale={[1, 1, 0.74]} castShadow>
          <capsuleGeometry args={[0.26, 0.45, 10, 20]} />
          <Fosco cor={tema.pessoa} />
        </mesh>
        <mesh position={[0, 1.65, 0]} castShadow>
          <sphereGeometry args={[0.18, 20, 16]} />
          <Fosco cor={tema.pessoa} />
        </mesh>
      </group>
      <CadeiraMini pos={[0.13, 0, 0.05]} cor={mistura(tema.corpo, tema.acento, vazia)} brilho={vazia * 0.45} />
      {/* Papel da decisão e o carimbo que desce sobre ele */}
      {papel > 0.02 ? (
        <group position={[0.1, 0.154, -0.19]} scale={papel}>
          <Caixa args={[0.09, 0.003, 0.11]} raio={0.001} cor={tema.objetoClaro} />
          {carimbo >= 1 ? <Caixa args={[0.05, 0.004, 0.03]} raio={0.001} cor={tema.acento} emissivo={0.4} position={[0, 0.002, 0.01]} /> : null}
        </group>
      ) : null}
    </group>
  );

// ---------- Carimbo de mão ----------
export const Carimbo3D: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.16, 0.035, 0.1]} raio={0.01} cor={tema.acento} emissivo={0.2} position={[0, 0.018, 0]} />
      <Caixa args={[0.12, 0.04, 0.07]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.055, 0]} />
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.1, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <mesh position={[0, 0.19, 0]} castShadow>
        <sphereGeometry args={[0.04, 20, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

// ---------- Ampulheta ----------
// `areia`: quanto ainda há em cima (0..1). `virar`: rotação em torno do centro. `fio`: mostra o filete caindo.
export const Ampulheta: React.FC<{tema: Tema; pos: V3; escala?: number; areia: number; virar?: number; fio?: boolean}> = ({tema, pos, escala = 1, areia, virar = 0, fio}) => {
  if (escala < 0.02) return null;
  const a = Math.max(0, Math.min(1, areia));
  const hC = 0.2 * Math.sqrt(a);
  const hB = 0.2 * Math.sqrt(1 - a);
  return (
    <group position={pos} scale={escala}>
      <group position={[0, 0.25, 0]} rotation={[0, 0, virar]}>
        <group position={[0, -0.25, 0]}>
          {[0.015, 0.485].map((y) => (
            <mesh key={y} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.145, 0.145, 0.03, 32]} />
              <Fosco cor={tema.areia} />
            </mesh>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.125, 0.25, Math.sin((i * 2 * Math.PI) / 3) * 0.125]} castShadow>
              <cylinderGeometry args={[0.011, 0.011, 0.46, 10]} />
              <Fosco cor={tema.areia} />
            </mesh>
          ))}
          {/* Vidro */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.014, 0.105, 0.22, 32, 1, true]} />
            <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.22} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.105, 0.014, 0.22, 32, 1, true]} />
            <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.22} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Areia: em cima, um cone que esvazia; embaixo, um monte que cresce */}
          {hC > 0.004 ? (
            <mesh position={[0, 0.255 + hC / 2, 0]}>
              <cylinderGeometry args={[0.014 + 0.09 * (hC / 0.2), 0.012, hC, 28]} />
              <Fosco cor={tema.acento} emissivo={0.25} />
            </mesh>
          ) : null}
          {hB > 0.004 ? (
            <mesh position={[0, 0.03 + hB / 2, 0]}>
              <cylinderGeometry args={[0.012 + 0.03 * (1 - hB / 0.2), 0.012 + 0.09 * (hB / 0.2), hB, 28]} />
              <Fosco cor={tema.acento} emissivo={0.25} />
            </mesh>
          ) : null}
          {fio && a > 0.002 ? (
            <mesh position={[0, 0.03 + hB + (0.25 - 0.03 - hB) / 2, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.25 - 0.03 - hB, 6]} />
              <Fosco cor={tema.acento} emissivo={0.4} />
            </mesh>
          ) : null}
        </group>
      </group>
    </group>
  );
};

// ---------- Linha do tempo do processo ----------
// `k`: quanto da linha já nasceu (0..1, da esquerda para a direita). `vida`: 1 = viva, 0 = apagada. `acesa`: acento.
export type Marco = {x: number; k: number; aceso?: number};
export const LinhaTempo: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number; vida: number; acesa?: number; marcos: Marco[]; cabeca?: number}> = ({
  tema,
  x0,
  x1,
  z,
  k,
  vida,
  acesa = 0,
  marcos,
  cabeca,
}) => {
  if (k < 0.01) return null;
  const len = (x1 - x0) * k;
  const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, vida), tema.acento, acesa);
  return (
    <group position={[0, MESA_Y, z]}>
      <mesh geometry={geoCaixa(1, 0.01, 0.03, 0.004)} position={[x0 + len / 2, 0.005, 0]} scale={[len, 1, 1]} receiveShadow>
        <Fosco cor={cor} emissivo={0.1 + 0.6 * acesa} />
      </mesh>
      {marcos.map((m, i) =>
        m.k < 0.02 ? null : (
          <mesh key={i} position={[m.x, 0.02, 0]} scale={m.k} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 24]} />
            <Fosco cor={mistura(cor, tema.acento, m.aceso ?? 0)} emissivo={0.1 + 0.7 * (m.aceso ?? 0)} />
          </mesh>
        ),
      )}
      {cabeca !== undefined ? (
        <mesh position={[cabeca, 0.025, 0]}>
          <sphereGeometry args={[0.03, 20, 16]} />
          <Fosco cor={tema.acento} emissivo={0.9} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- Pasta de processo ----------
export const Pasta: React.FC<{tema: Tema; pos: V3; escala?: number}> = ({tema, pos, escala = 1}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[0.24, 0.006, 0.31]} raio={0.002} cor={tema.objetoClaro} position={[0.004 * i, 0.012 + i * 0.007, 0.004 * i]} />
      ))}
      <Caixa args={[0.26, 0.01, 0.33]} raio={0.004} cor={tema.corpo} position={[0, 0.005, 0]} />
      <Caixa args={[0.08, 0.01, 0.03]} raio={0.004} cor={tema.corpo} position={[-0.07, 0.005, -0.175]} />
    </group>
  );

// ---------- Ícones dos acontecimentos (cena 4) ----------
export const Folha: React.FC<{tema: Tema; pos: V3; escala: number; marca?: boolean}> = ({tema, pos, escala, marca}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala} rotation={[-0.5, 0, 0]}>
      <Caixa args={[0.16, 0.21, 0.006]} raio={0.002} cor={tema.objetoClaro} position={[0, 0.105, 0]} />
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[0.11, 0.008, 0.002]} raio={0.001} cor={tema.corpo} position={[0, 0.17 - i * 0.025, 0.004]} />
      ))}
      {marca ? <Caixa args={[0.08, 0.04, 0.003]} raio={0.002} cor={tema.acento} emissivo={0.4} position={[0.02, 0.05, 0.005]} /> : null}
    </group>
  );

export const Calendario: React.FC<{tema: Tema; pos: V3; escala: number; folhas?: number}> = ({tema, pos, escala, folhas = 0}) => {
  if (escala < 0.02) return null;
  const virando = folhas - Math.floor(folhas);
  return (
    <group position={pos} scale={escala}>
      <group rotation={[-0.25, 0, 0]}>
        <Caixa args={[0.22, 0.2, 0.025]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.1, -0.005]} />
        <Caixa args={[0.2, 0.17, 0.006]} raio={0.002} cor={tema.objetoClaro} position={[0, 0.09, 0.012]} />
        <Caixa args={[0.2, 0.035, 0.008]} raio={0.002} cor={tema.acento} emissivo={0.3} position={[0, 0.175, 0.014]} />
        {/* Grade de dias */}
        {Array.from({length: 12}, (_, i) => (
          <Caixa key={i} args={[0.032, 0.022, 0.003]} raio={0.001} cor={(i + Math.floor(folhas)) % 7 === 3 ? tema.acento : tema.corpo} position={[-0.06 + (i % 4) * 0.04, 0.13 - Math.floor(i / 4) * 0.035, 0.017]} />
        ))}
        {virando > 0.02 && virando < 0.98 ? (
          <group position={[0, 0.175, 0.02]} rotation={[-virando * Math.PI * 0.9, 0, 0]}>
            <Caixa args={[0.2, 0.15, 0.004]} raio={0.002} cor={tema.objetoClaro} position={[0, -0.075, 0]} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

export const Documento: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Caixa key={i} args={[0.17, 0.008, 0.22]} raio={0.002} cor={tema.objetoClaro} position={[0.003 * (i % 2), 0.004 + i * 0.009, 0]} />
      ))}
      <Caixa args={[0.04, 0.05, 0.226]} raio={0.004} cor={tema.acento} emissivo={0.35} position={[-0.03, 0.025, 0]} />
    </group>
  );

// ---------- Relógios ----------
export const RelogioMesa: React.FC<{tema: Tema; pos: V3; escala: number; ang: number}> = ({tema, pos, escala, ang}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <group position={[0, 0.13, 0]} rotation={[Math.PI / 2 - 0.15, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 40]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0, 0.021, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.003, 40]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        <group position={[0, 0.026, 0]} rotation={[0, -ang, 0]}>
          <Caixa args={[0.01, 0.004, 0.085]} raio={0.002} cor={tema.acento} emissivo={0.4} position={[0, 0, -0.04]} />
        </group>
        <group position={[0, 0.026, 0]} rotation={[0, -ang / 12, 0]}>
          <Caixa args={[0.014, 0.004, 0.06]} raio={0.002} cor={tema.objetoEscuro} position={[0, 0, -0.028]} />
        </group>
      </group>
      <Caixa args={[0.16, 0.02, 0.06]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.01, 0]} />
    </group>
  );

export const RelogioPulso: React.FC<{tema: Tema; pos: V3; escala: number; ang: number}> = ({tema, pos, escala, ang}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} castShadow>
        <torusGeometry args={[0.075, 0.012, 10, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.03, 0.075]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 32]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <group position={[0, 0.041, 0.075]} rotation={[0, -ang, 0]}>
        <Caixa args={[0.006, 0.003, 0.032]} raio={0.001} cor={tema.acento} emissivo={0.5} position={[0, 0, -0.015]} />
      </group>
    </group>
  );

// ---------- Mala de viagem ----------
export const Mala: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.34, 0.26, 0.13]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.13, 0]} />
      <Caixa args={[0.3, 0.012, 0.135]} raio={0.004} cor={tema.corpo} position={[0, 0.19, 0]} />
      <mesh position={[0, 0.27, 0]} castShadow>
        <torusGeometry args={[0.04, 0.009, 8, 20, Math.PI]} />
        <Fosco cor={tema.corpo} />
      </mesh>
    </group>
  );

// ---------- Caixa de correio ----------
export const CaixaCorreio: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; bandeira: number}> = ({tema, pos, rotY = 0, escala, bandeira}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.08, 1.0, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.5, 0]} />
      <Caixa args={[0.3, 0.22, 0.44]} raio={0.06} cor={tema.objeto} position={[0, 1.11, 0]} />
      <Caixa args={[0.26, 0.04, 0.012]} raio={0.008} cor={tema.objetoEscuro} position={[0, 1.13, 0.222]} />
      <group position={[0.16, 1.05, -0.05]} rotation={[-bandeira * 1.4, 0, 0]}>
        <Caixa args={[0.015, 0.18, 0.02]} raio={0.005} cor={tema.acento} position={[0, 0.09, 0]} />
        <Caixa args={[0.015, 0.06, 0.09]} raio={0.005} cor={tema.acento} emissivo={0.3} position={[0, 0.16, 0.04]} />
      </group>
    </group>
  );

// ---------- Porta com batente e luz atrás ----------
export const Porta: React.FC<{tema: Tema; pos: V3; rotY?: number; abertura: number; luz?: number}> = ({tema, pos, rotY = 0, abertura, luz = 1}) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Caixa args={[0.09, 2.15, 0.14]} raio={0.02} cor={tema.objetoEscuro} position={[-0.52, 1.075, 0]} />
    <Caixa args={[0.09, 2.15, 0.14]} raio={0.02} cor={tema.objetoEscuro} position={[0.52, 1.075, 0]} />
    <Caixa args={[1.13, 0.09, 0.14]} raio={0.02} cor={tema.objetoEscuro} position={[0, 2.18, 0]} />
    {/* Luz do outro lado: só aparece pela fresta */}
    {abertura > 0.01 ? (
      <mesh position={[0, 1.07, -0.09]}>
        <planeGeometry args={[0.95, 2.1]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={1.4 * luz} />
      </mesh>
    ) : null}
    <group position={[-0.47, 0, 0]} rotation={[0, abertura * 1.6, 0]}>
      <Caixa args={[0.93, 2.08, 0.05]} raio={0.02} cor={tema.corpo} position={[0.465, 1.05, 0]} />
      <mesh position={[0.82, 1.0, 0.04]} castShadow>
        <sphereGeometry args={[0.03, 16, 12]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    </group>
  </group>
);

// ---------- Notebook com tela genérica ----------
export const Notebook: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; abre: number; tela: number}> = ({tema, pos, rotY = 0, escala, abre, tela}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.4, 0.016, 0.27]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.008, 0]} />
      <Caixa args={[0.34, 0.003, 0.14]} raio={0.002} cor={tema.branco} position={[0, 0.017, -0.03]} />
      {/* Tampa presa na borda de trás: fechada fica deitada sobre a base, aberta levanta ~105° */}
      <group position={[0, 0.016, -0.135]} rotation={[-abre * 1.85, 0, 0]}>
        <group>
          <Caixa args={[0.4, 0.012, 0.27]} raio={0.008} cor={tema.objetoEscuro} position={[0, 0.006, 0.135]} />
          {tela > 0.02 ? (
            <Placa
              tema={tema}
              pos={[0, -0.002, 0.135]}
              rot={[Math.PI / 2, 0, 0]}
              larg={0.36}
              alt={0.23}
              fundo={mistura(tema.branco, tema.objetoEscuro, 1 - tela)}
              linhas={[
                {t: 'SISTEMA DO TRIBUNAL', tam: 64, cor: tema.textoSuave, peso: 600},
                {t: 'Nova intimação', tam: 120, cor: tema.texto},
                {t: 'Processo nº 0000000-00', tam: 60, cor: tema.textoSuave, peso: 500},
              ]}
            />
          ) : null}
        </group>
      </group>
    </group>
  );

// ---------- Folha do Diário da Justiça (colunas de texto miúdo) ----------
const useTexDiario = (tema: Tema) =>
  useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512;
    cv.height = 2048;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = tema.objetoClaro;
    ctx.fillRect(0, 0, 512, 2048);
    ctx.fillStyle = tema.corpo;
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) % 1000) / 1000;
    for (let col = 0; col < 3; col++) {
      for (let y = 14; y < 2040; y += 14) {
        const w = 120 + r() * 30;
        if (r() > 0.93) continue;
        ctx.fillRect(14 + col * 166, y, w, 6);
      }
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [tema]);

export const Diario: React.FC<{tema: Tema; pos: V3; rotY?: number; comp: number; rola: number; destaque: number}> = ({tema, pos, rotY = 0, comp, rola, destaque}) => {
  const tex = useTexDiario(tema);
  useDescartar(tex);
  if (comp < 0.01) return null;
  tex.repeat.set(1, comp / 1.1);
  tex.offset.set(0, rola);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.004, comp / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.42, comp]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      {destaque > 0.02 && comp > 0.6 ? (
        <mesh position={[-0.08, 0.006, 0.55]} rotation={[-Math.PI / 2, 0, 0]} scale={[destaque, 1, 1]}>
          <planeGeometry args={[0.13, 0.018]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.9} />
        </mesh>
      ) : null}
    </group>
  );
};

// ---------- Cartão em pé que tomba ----------
export const CartaoPe: React.FC<{tema: Tema; pos: V3; texto: string; escala: number; tomba: number}> = ({tema, pos, texto, escala, tomba}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala} rotation={[-tomba * (Math.PI / 2 - 0.02), 0, 0]}>
      <Placa
        tema={tema}
        pos={[0, 0.13, 0]}
        larg={0.44}
        alt={0.26}
        fundo={tomba > 0.5 ? tema.objetoEscuro : tema.cartao}
        linhas={[{t: texto, tam: 150, cor: tomba > 0.5 ? tema.corpo : tema.texto}]}
      />
    </group>
  );
