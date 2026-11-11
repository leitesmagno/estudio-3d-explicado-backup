import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {Carro} from './juros';

// Peças: Carro voador e elétricos: o Roadster que salta, a rampa curva, os jatos de vapor,
// o carro da rua com placa, o carregador, o carro voador elétrico (eVTOL), o heliponto, o pódio, a fábrica e o mapa do Brasil.
// Formas simples, foscas, arredondadas, sem logo e sem rosto. Texturas só com texto fixo (nunca mudam por quadro).

const G_ESFERA = new THREE.SphereGeometry(1, 14, 10);

// ---------- Roadster (esportivo baixo genérico, frente em +x). `emblema`: texto da traseira ----------
// `rot` gira o carro inteiro (o giro no ar é no eixo X: de lado para a câmera). `anda` gira as rodas.
const G_PNEU = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 28);
const G_ARO = new THREE.CylinderGeometry(0.12, 0.12, 0.19, 20);
export const Roadster: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number; cor?: string; farol?: number; anda?: number; amortece?: number; emblema?: string}> = ({
  tema,
  pos,
  rot = [0, 0, 0],
  escala = 1,
  cor,
  farol = 0,
  anda = 0,
  amortece = 0,
  emblema = 'ELÉTRICO',
}) => {
  if (escala < 0.02) return null;
  const c = cor ?? tema.acento;
  const vidro = mistura(tema.fundo, tema.objetoEscuro, 0.3);
  const giro = -anda / 0.2;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {[-0.72, 0.72].map((x) =>
        [-0.46, 0.46].map((z) => (
          <group key={`${x}${z}`} position={[x, 0.2 + 0.06 * amortece, z]} rotation={[Math.PI / 2, 0, 0]}>
            <group rotation={[0, giro, 0]}>
              <mesh geometry={G_PNEU} castShadow>
                <meshStandardMaterial color={tema.fundo} roughness={0.9} />
              </mesh>
              <mesh geometry={G_ARO}>
                <meshStandardMaterial color={tema.objeto} roughness={0.3} metalness={0.5} />
              </mesh>
            </group>
          </group>
        )),
      )}
      <group position={[0, -0.05 * amortece, 0]}>
        {/* Carroceria baixa e comprida, com bico em cunha */}
        <Caixa args={[2.2, 0.26, 0.98]} raio={0.12} cor={c} emissivo={0.12} position={[0, 0.36, 0]} />
        <mesh position={[1.02, 0.33, 0]} rotation={[0, 0, -0.3]} scale={[0.34, 0.14, 0.9]}>
          <boxGeometry args={[1, 1, 1]} />
          <Fosco cor={c} emissivo={0.12} />
        </mesh>
        {/* Bolha da cabine (teto de vidro) */}
        <mesh position={[-0.15, 0.55, 0]} scale={[0.75, 0.2, 0.4]} castShadow>
          <sphereGeometry args={[1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={vidro} roughness={0.12} metalness={0.4} />
        </mesh>
        {/* Aerofólio */}
        <Caixa args={[0.18, 0.04, 0.96]} raio={0.015} cor={tema.objetoEscuro} position={[-1.02, 0.56, 0]} sombra={false} />
        {/* Faróis em fita e lanterna corrida */}
        <Caixa args={[0.05, 0.04, 0.8]} raio={0.015} cor={mistura(tema.objeto, tema.objetoClaro, farol)} emissivo={0.2 + 1.5 * farol} position={[1.2, 0.4, 0]} sombra={false} />
        <Caixa args={[0.04, 0.05, 0.86]} raio={0.015} cor={mistura(tema.objetoClaro, tema.acento, 0.6)} emissivo={0.5 + 0.6 * farol} position={[-1.11, 0.42, 0]} sombra={false} />
        {/* Emblema cromado (só texto, sem logo) */}
        <Placa tema={tema} pos={[-1.115, 0.32, 0]} rot={[0, -Math.PI / 2, 0]} larg={0.42} alt={0.07} linhas={[{t: emblema, tam: 120, cor: tema.objetoEscuro, peso: 900}]} fundo={tema.objeto} />
        {/* Bocais dos jatos (embaixo) */}
        {[-0.6, 0.6].map((x) =>
          [-0.3, 0.3].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.06, 0.08, 0.06, 14]} />
              <meshStandardMaterial color={tema.objetoEscuro} roughness={0.4} metalness={0.6} />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
};

// ---------- Rampa curva (sobe em +x) ----------
// Feita de lâminas que seguem um arco de círculo. `sobe` 0..1 (brota do chão), `aceso` 0..1 (borda em acento).
export const COMP_RAMPA = 3.2;
export const ALT_RAMPA = 1.5;
export const pontoRampa = (u: number): {x: number; y: number; ang: number} => {
  // Arco: começa plano e termina a ~42°.
  const angFim = 0.74;
  const R = COMP_RAMPA / Math.sin(angFim);
  const a = angFim * u;
  return {x: R * Math.sin(a), y: R * (1 - Math.cos(a)), ang: a};
};
export const Rampa: React.FC<{tema: Tema; pos: V3; sobe: number; aceso?: number}> = ({tema, pos, sobe, aceso = 0}) => {
  if (sobe < 0.01) return null;
  const n = 14;
  const borda = mistura(tema.objetoEscuro, tema.acento, aceso);
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      {Array.from({length: n}).map((_, i) => {
        const u = (i + 0.5) / n;
        const p = pontoRampa(u);
        const seg = COMP_RAMPA / n / Math.cos(p.ang) + 0.04;
        return (
          <group key={i} position={[p.x, p.y, 0]} rotation={[0, 0, p.ang]}>
            <Caixa args={[seg, 0.08, 1.5]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.objeto, 0.25)} position={[0, -0.04, 0]} />
            {[-1, 1].map((l) => (
              <Caixa key={l} args={[seg, 0.1, 0.06]} raio={0.02} cor={borda} emissivo={0.4 * aceso} sombra={false} position={[0, 0.03, 0.75 * l]} />
            ))}
          </group>
        );
      })}
      {/* Pilares embaixo */}
      {[0.4, 0.65, 0.88].map((u) => {
        const p = pontoRampa(u);
        return [-0.6, 0.6].map((z) => <Caixa key={`${u}${z}`} args={[0.1, p.y, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[p.x, p.y / 2, z]} />);
      })}
    </group>
  );
};

// ---------- Nuvem de vapor (jatos e poeira do pouso) ----------
// Bolinhas que saem de `origem` na direção `dir`, crescem e somem. Sem clarão (regra de não piscar).
export const Nuvem: React.FC<{tema: Tema; origens: V3[]; dir: V3; t: number; k: number; alcance?: number; tam?: number}> = ({tema, origens, dir, t, k, alcance = 1.2, tam = 0.22}) => {
  if (k < 0.02) return null;
  const cor = mistura(tema.objeto, tema.fundo, 0.25);
  return (
    <>
      {origens.map((o, j) =>
        [0, 1, 2, 3, 4].map((i) => {
          const fase = (t * 1.6 + i / 5 + j * 0.13) % 1;
          const lado = Math.sin(i * 2.1 + j) * 0.25 * fase;
          return (
            <mesh
              key={`${j}${i}`}
              geometry={G_ESFERA}
              position={[o[0] + dir[0] * alcance * fase + lado, o[1] + dir[1] * alcance * fase, o[2] + dir[2] * alcance * fase + lado * 0.6]}
              scale={tam * (0.4 + 1.6 * fase) * k}
            >
              <meshStandardMaterial color={cor} roughness={1} transparent opacity={0.5 * (1 - fase) * k} depthWrite={false} />
            </mesh>
          );
        }),
      )}
    </>
  );
};

// Poeira do pouso: anel de bolinhas que se espalha uma vez.
export const Poeira: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k <= 0 || k >= 1) return null;
  const cor = mistura(tema.objeto, tema.fundo, 0.3);
  return (
    <>
      {Array.from({length: 14}).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 0.6 + 1.6 * k;
        return (
          <mesh key={i} geometry={G_ESFERA} position={[pos[0] + Math.cos(a) * r * 1.3, pos[1] + 0.08 + 0.15 * k, pos[2] + Math.sin(a) * r * 0.8]} scale={0.07 + 0.14 * k}>
            <meshStandardMaterial color={cor} roughness={1} transparent opacity={0.35 * (1 - k)} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

// ---------- Raio (símbolo de elétrico) ----------
const G_RAIO = (() => {
  const s = new THREE.Shape();
  s.moveTo(0.06, 0.5);
  s.lineTo(-0.22, -0.02);
  s.lineTo(-0.02, -0.02);
  s.lineTo(-0.1, -0.5);
  s.lineTo(0.22, 0.08);
  s.lineTo(0.02, 0.08);
  s.lineTo(0.06, 0.5);
  return new THREE.ExtrudeGeometry(s, {depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2});
})();
export const Raio: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; cor?: string; brilho?: number}> = ({tema, pos, rot = [0, 0, 0], escala, cor, brilho = 0.5}) =>
  escala < 0.02 ? null : (
    <mesh geometry={G_RAIO} position={pos} rotation={rot} scale={escala} castShadow>
      <Fosco cor={cor ?? tema.acento} emissivo={brilho} />
    </mesh>
  );

// Gota (combustível) para o ícone de híbrido.
export const Gota: React.FC<{tema: Tema; pos: V3; escala: number; cor?: string}> = ({tema, pos, escala, cor}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, -0.12, 0]} castShadow>
        <sphereGeometry args={[0.24, 24, 18]} />
        <Fosco cor={cor ?? tema.objeto} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <coneGeometry args={[0.2, 0.42, 24]} />
        <Fosco cor={cor ?? tema.objeto} />
      </mesh>
    </group>
  );

// ---------- Carro da rua (sedã de juros.tsx + placa + raio no capô) ----------
// `eletrico` 0..1: vira acento e ganha o raio. Placa no estilo Mercosul (faixa escura no topo), sem texto.
export const CarroRua: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; eletrico?: number; anda?: number; farol?: number; fumaca?: number; t?: number}> = ({
  tema,
  pos,
  rotY = 0,
  escala = 1,
  eletrico = 0,
  anda = 0,
  farol = 0.3,
  fumaca = 0,
  t = 0,
}) => {
  if (escala < 0.02) return null;
  const cor = mistura(mistura(tema.corpo, tema.objetoEscuro, 0.2), tema.acento, eletrico);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Carro tema={tema} pos={[0, 0, 0]} cor={cor} brilho={0.35 * eletrico} anda={anda} farol={farol} />
      {/* Placas (frente e trás) */}
      {[-1, 1].map((l) => (
        <group key={l} position={[1.065 * l, 0.27, 0]} rotation={[0, (l * Math.PI) / 2, 0]}>
          <Caixa args={[0.34, 0.12, 0.012]} raio={0.01} cor={tema.objetoClaro} sombra={false} />
          <Caixa args={[0.34, 0.03, 0.014]} raio={0.005} cor={tema.objetoEscuro} sombra={false} position={[0, 0.045, 0.001]} />
        </group>
      ))}
      {/* Raio no capô */}
      {eletrico > 0.05 ? <Raio tema={tema} pos={[0.62, 0.58, 0]} rot={[-Math.PI / 2, 0, -Math.PI / 2]} escala={0.32 * eletrico} cor={tema.objetoClaro} brilho={0.6} /> : null}
      {/* Fumaça do escapamento (combustão) */}
      {fumaca > 0.02 ? <Nuvem tema={tema} origens={[[-1.08, 0.2, 0.3]]} dir={[-1, 0.35, 0]} t={t} k={fumaca} alcance={0.9} tam={0.1} /> : null}
    </group>
  );
};

// ---------- Bateria (ícone 3D em cima do carro) ----------
export const Bateria: React.FC<{tema: Tema; pos: V3; escala: number; nivel: number; yaw?: number}> = ({tema, pos, escala, nivel, yaw = 0}) => {
  if (escala < 0.02) return null;
  const n = Math.max(0.02, Math.min(1, nivel));
  return (
    <group position={pos} rotation={[0, yaw, 0]} scale={escala}>
      <Caixa args={[0.62, 0.3, 0.08]} raio={0.05} cor={tema.objetoEscuro} sombra={false} />
      <Caixa args={[0.06, 0.12, 0.08]} raio={0.02} cor={tema.objetoEscuro} sombra={false} position={[0.34, 0, 0]} />
      <Caixa args={[0.52 * n, 0.2, 0.09]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, n)} emissivo={0.5} sombra={false} position={[-0.26 + 0.26 * n, 0, 0.005]} />
    </group>
  );
};

// ---------- Carregador (totem com tela e cabo) ----------
// Cabo fixo (geometria feita uma vez): sai da lateral do totem e vai até a tomada do carro estacionado na frente (+z).
const G_CABO = (() => {
  const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0.18, 0.9, 0), new THREE.Vector3(0.25, 0.25, 0.45), new THREE.Vector3(0.15, 0.2, 0.85), new THREE.Vector3(0.05, 0.55, 1.1)]);
  return new THREE.TubeGeometry(c, 24, 0.025, 8, false);
})();
export const Carregador: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; luz: number; cabo?: number}> = ({tema, pos, rotY = 0, escala, luz, cabo = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.5, 0.06, 0.4]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0]} />
      <Caixa args={[0.34, 1.3, 0.26]} raio={0.08} cor={mistura(tema.objeto, tema.objetoEscuro, 0.35)} position={[0, 0.7, 0]} />
      {/* Tela */}
      <Caixa args={[0.24, 0.3, 0.02]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, luz)} emissivo={0.15 + 0.9 * luz} sombra={false} position={[0, 1.05, 0.135]} />
      {/* Faixa de luz no topo */}
      <Caixa args={[0.36, 0.05, 0.28]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, luz)} emissivo={1.2 * luz} sombra={false} position={[0, 1.37, 0]} />
      {/* Raio na frente */}
      <Raio tema={tema} pos={[0, 0.62, 0.14]} escala={0.32} cor={mistura(tema.objetoClaro, tema.acento, luz)} brilho={0.3 + 0.6 * luz} />
      {/* Pistola no gancho + cabo até o carro */}
      <Caixa args={[0.08, 0.16, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0.2, 0.9, 0]} />
      {cabo > 0.02 ? (
        <mesh geometry={G_CABO} scale={[1, 1, cabo]}>
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      ) : null}
    </group>
  );

// ---------- Carro voador elétrico (eVTOL genérico, frente em +x). `nome`: texto da faixa lateral ----------
// Cabine, asa alta, duas vigas com 4 rotores cada, hélice de empurrar atrás. `gira`: ângulo das hélices.
export const EVTOL: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number; gira: number; luz?: number; cor?: string; nome?: string}> = ({tema, pos, rot = [0, 0, 0], escala = 1, gira, luz = 0, cor, nome = 'eVTOL'}) => {
  if (escala < 0.02) return null;
  const casco = cor ?? tema.objetoClaro;
  const vidro = mistura(tema.fundo, tema.objetoEscuro, 0.3);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* Fuselagem */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.36, 1.5, 10, 24]} />
        <Fosco cor={casco} />
      </mesh>
      {/* Vidros da cabine */}
      <mesh position={[0.72, 0.1, 0]} scale={[0.35, 0.22, 0.32]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color={vidro} roughness={0.12} metalness={0.4} />
      </mesh>
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.7, 0.18, 0.02]} raio={0.04} cor={vidro} sombra={false} position={[0.05, 0.1, 0.355 * l]} />
      ))}
      {/* Faixa da marca: só o nome, na lateral */}
      {[-1, 1].map((l) => (
        <Placa key={l} tema={tema} pos={[-0.5, 0.05, 0.37 * l]} rot={[0, l === 1 ? 0 : Math.PI, 0]} larg={0.42} alt={0.16} linhas={[{t: nome, tam: 300, cor: tema.objetoEscuro, peso: 900}]} fundo={casco} />
      ))}
      {/* Asa alta */}
      <Caixa args={[0.6, 0.06, 3.6]} raio={0.03} cor={casco} position={[0.05, 0.42, 0]} />
      {/* Vigas e rotores */}
      {[-1, 1].map((l) => (
        <group key={l} position={[0, 0.38, 1.1 * l]}>
          <Caixa args={[2.6, 0.08, 0.1]} raio={0.04} cor={mistura(casco, tema.objeto, 0.5)} />
          {[-1.1, -0.4, 0.5, 1.2].map((x, i) => (
            <group key={x} position={[x, 0.1, 0]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
                <Fosco cor={tema.objetoEscuro} />
              </mesh>
              <group position={[0, 0.07, 0]} rotation={[0, gira * (i % 2 ? 1 : -1) + i, 0]}>
                <Caixa args={[0.62, 0.015, 0.07]} raio={0.007} cor={tema.objetoEscuro} sombra={false} />
                <Caixa args={[0.07, 0.015, 0.62]} raio={0.007} cor={tema.objetoEscuro} sombra={false} />
              </group>
              {/* Disco translúcido da hélice girando */}
              <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.32, 28]} />
                <meshBasicMaterial color={tema.objeto} transparent opacity={0.08} depthWrite={false} side={2} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* Cauda em V e hélice traseira */}
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.36, 0.04, 0.5]} raio={0.02} cor={casco} position={[-1.0, 0.25, 0.2 * l]} rotation={[0.6 * l, 0, 0]} />
      ))}
      <group position={[-1.15, 0, 0]} rotation={[gira * 0.7, 0, 0]}>
        <Caixa args={[0.02, 0.6, 0.06]} raio={0.01} cor={tema.objetoEscuro} sombra={false} />
      </group>
      {/* Luz de navegação */}
      <Caixa args={[0.08, 0.05, 0.08]} raio={0.02} cor={mistura(tema.objeto, tema.acento, luz)} emissivo={0.3 + 1.2 * luz} sombra={false} position={[0.05, 0.47, 0]} />
    </group>
  );
};

// ---------- Heliponto ----------
export const Heliponto: React.FC<{tema: Tema; pos: V3; k: number; luz: number}> = ({tema, pos, k, luz}) => {
  if (k < 0.02) return null;
  const linha = mistura(tema.objeto, tema.acento, luz);
  return (
    <group position={pos} scale={[k, 1, k]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.1, 0.06, 48]} />
        <Fosco cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} />
      </mesh>
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.72, 64]} />
        <meshStandardMaterial color={linha} emissive={linha} emissiveIntensity={0.6 * luz} />
      </mesh>
      {/* H */}
      <Caixa args={[0.14, 0.02, 1.1]} raio={0.01} cor={linha} emissivo={0.6 * luz} sombra={false} position={[-0.38, 0.07, 0]} />
      <Caixa args={[0.14, 0.02, 1.1]} raio={0.01} cor={linha} emissivo={0.6 * luz} sombra={false} position={[0.38, 0.07, 0]} />
      <Caixa args={[0.76, 0.02, 0.14]} raio={0.01} cor={linha} emissivo={0.6 * luz} sombra={false} position={[0, 0.07, 0]} />
      {/* Luzes da borda */}
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} geometry={G_ESFERA} position={[Math.cos(a) * 1.92, 0.1, Math.sin(a) * 1.92]} scale={0.06}>
            <meshStandardMaterial color={linha} emissive={linha} emissiveIntensity={0.3 + 1.2 * luz} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Pódio (1º e 2º lugar) ----------
// 1º à esquerda (mais alto), 2º à direita. `sobe1`/`sobe2` 0..1. Barras de vendas atrás de cada degrau.
export const ALT_D1 = 1.0;
export const ALT_D2 = 0.65;
export const Podio: React.FC<{tema: Tema; pos: V3; sobe1: number; sobe2: number; aceso2: number; barras: number}> = ({tema, pos, sobe1, sobe2, aceso2, barras}) => (
  <group position={pos}>
    {sobe1 > 0.01 ? (
      <group position={[-1.3, 0, 0]} scale={[1, sobe1, 1]}>
        <Caixa args={[2.4, ALT_D1, 1.6]} raio={0.06} cor={tema.branco} position={[0, ALT_D1 / 2, 0]} />
        <Placa tema={tema} pos={[0, ALT_D1 / 2, 0.81]} larg={0.6} alt={0.6} linhas={[{t: '1', tam: 380, cor: tema.objetoClaro, peso: 900}]} fundo={tema.branco} />
      </group>
    ) : null}
    {sobe2 > 0.01 ? (
      <group position={[1.3, 0, 0]} scale={[1, sobe2, 1]}>
        <Caixa args={[2.4, ALT_D2, 1.6]} raio={0.06} cor={mistura(tema.branco, tema.acento, 0.5 * aceso2)} emissivo={0.15 * aceso2} position={[0, ALT_D2 / 2, 0]} />
        <Placa tema={tema} pos={[0, ALT_D2 / 2, 0.81]} larg={0.5} alt={0.5} linhas={[{t: '2', tam: 380, cor: tema.objetoClaro, peso: 900}]} fundo={mistura(tema.branco, tema.acento, 0.5)} />
      </group>
    ) : null}
    {/* Barras de vendas atrás (11.095 × 9.385) */}
    {barras > 0.02 ? (
      <>
        <Caixa args={[0.5, 2.2 * barras, 0.5]} raio={0.06} cor={tema.objeto} position={[-1.3, 1.1 * barras, -1.3]} />
        <Caixa args={[0.5, 2.2 * (9385 / 11095) * barras, 0.5]} raio={0.06} cor={mistura(tema.objeto, tema.acento, aceso2)} emissivo={0.2 * aceso2} position={[1.3, 1.1 * (9385 / 11095) * barras, -1.3]} />
      </>
    ) : null}
  </group>
);

// ---------- Fábrica moderna (telhado em dente de serra e painéis solares) ----------
// `paineis` 0..1 inclina os painéis para o sol. `janelas` 0..1 acende a faixa de vidro. Letreiro só com o nome.
export const LARG_FAB = 6.0;
export const Fabrica: React.FC<{tema: Tema; pos: V3; sobe: number; paineis: number; janelas: number; letreiro: string; acesoLetreiro: number}> = ({tema, pos, sobe, paineis, janelas, letreiro, acesoLetreiro}) => {
  if (sobe < 0.01) return null;
  const parede = mistura(tema.branco, tema.objeto, 0.25);
  const prof = 3.2;
  const alt = 1.8;
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      <Caixa args={[LARG_FAB, alt, prof]} raio={0.08} cor={parede} position={[0, alt / 2, 0]} />
      {/* Faixa de vidro */}
      <Caixa args={[LARG_FAB - 0.6, 0.36, 0.04]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.objetoClaro, janelas)} emissivo={0.6 * janelas} sombra={false} position={[0, 1.25, prof / 2 + 0.01]} />
      {/* Portão de saída (à direita, por onde sai a esteira) */}
      <Caixa args={[1.4, 1.0, 0.05]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[1.8, 0.5, prof / 2 + 0.01]} />
      {/* Telhado em dente de serra */}
      {Array.from({length: 5}).map((_, i) => (
        <group key={i} position={[-LARG_FAB / 2 + 0.6 + i * 1.2, alt, 0]}>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.6, prof - 0.1]} />
            <Fosco cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.6 * janelas)} emissivo={0.3 * janelas} />
          </mesh>
          <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, Math.atan2(0.6, 1.2)]} castShadow>
            <boxGeometry args={[1.34, 0.05, prof - 0.1]} />
            <Fosco cor={parede} />
          </mesh>
        </group>
      ))}
      {/* Painéis solares no pátio ao lado */}
      {Array.from({length: 6}).map((_, i) => (
        <group key={i} position={[-LARG_FAB / 2 - 1.2, 0.5, -1.2 + i * 0.5]} rotation={[0, 0, 0.1 + 0.5 * paineis]}>
          <Caixa args={[1.2, 0.04, 0.42]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} position={[0, 0, 0]} />
          <Caixa args={[1.14, 0.01, 0.36]} raio={0.005} cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.25)} emissivo={0.15 * paineis} sombra={false} position={[0, 0.026, 0]} />
        </group>
      ))}
      {Array.from({length: 6}).map((_, i) => (
        <Caixa key={i} args={[0.06, 0.5, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[-LARG_FAB / 2 - 1.2, 0.25, -1.2 + i * 0.5]} />
      ))}
      {/* Letreiro na fachada (só texto, sem logo) */}
      <Placa tema={tema} pos={[-1.2, alt - 0.35, prof / 2 + 0.03]} larg={1.8} alt={0.5} linhas={[{t: letreiro, tam: 330, cor: mistura(tema.objetoClaro, tema.acento, acesoLetreiro), peso: 900}]} fundo={tema.objetoEscuro} />
    </group>
  );
};

// ---------- Bandeirinha com nome (no lugar da bandeira colorida: cores só do tema) ----------
export const Bandeira: React.FC<{tema: Tema; pos: V3; escala: number; texto: string; t: number; destaque?: boolean}> = ({tema, pos, escala, texto, t, destaque}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 1.5, 10]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <group position={[0.02, 1.32, 0]} rotation={[0, 0.15 * Math.sin(t * 2.2), 0.04 * Math.sin(t * 3.1)]}>
        <Placa tema={tema} pos={[0.42, 0, 0]} larg={0.8} alt={0.4} linhas={[{t: texto, tam: 210, cor: destaque ? tema.objetoClaro : tema.objetoEscuro, peso: 900}]} fundo={destaque ? tema.acento : tema.objeto} />
      </group>
    </group>
  );

// ---------- Mapa do Brasil no chão, com pontos de recarga ----------
// Contorno aproximado (longitude, latitude). Só a forma: reconhecível, sem precisão de fronteira.
const BR: [number, number][] = [
  [-73.9, -7.3], [-73.2, -4.3], [-70.0, -4.2], [-69.4, -1.1], [-69.8, 1.7], [-67.0, 2.2], [-64.0, 4.0], [-60.7, 5.2], [-57.0, 2.0], [-54.0, 2.2],
  [-51.6, 4.2], [-50.0, 1.8], [-48.5, -1.2], [-44.0, -2.5], [-41.0, -2.9], [-38.5, -3.7], [-35.2, -5.5], [-34.8, -7.2], [-35.3, -9.5], [-37.5, -11.5],
  [-38.9, -13.5], [-39.2, -17.7], [-40.3, -20.3], [-41.0, -22.0], [-43.2, -23.0], [-45.0, -23.8], [-48.5, -26.5], [-48.6, -28.5], [-50.2, -30.5], [-52.5, -33.7],
  [-53.5, -33.2], [-55.5, -31.0], [-57.6, -30.2], [-55.7, -27.4], [-54.6, -25.6], [-54.3, -24.0], [-55.5, -22.5], [-57.8, -22.0], [-58.0, -20.0], [-58.2, -17.5],
  [-60.2, -16.3], [-60.5, -13.8], [-64.5, -12.5], [-65.3, -10.8], [-68.5, -11.0], [-70.5, -9.5], [-72.2, -10.0],
];
const LON0 = -54;
const LAT0 = -15;
const ESC_MAPA = 1 / 40; // 40 graus ≈ 1 unidade (vezes o tamanho)
const dentro = (x: number, y: number) => {
  let d = false;
  for (let i = 0, j = BR.length - 1; i < BR.length; j = i++) {
    const [xi, yi] = BR[i];
    const [xj, yj] = BR[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
};
const G_MAPA = (() => {
  const s = new THREE.Shape();
  BR.forEach(([lo, la], i) => {
    const x = (lo - LON0) * ESC_MAPA;
    const y = (la - LAT0) * ESC_MAPA;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  });
  return new THREE.ExtrudeGeometry(s, {depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 2});
})();
// Pontos: mais densos no Sudeste e no Sul (onde está a maioria dos carregadores).
const PONTOS_MAPA: {x: number; y: number; o: number}[] = (() => {
  let k = 7;
  const rnd = () => {
    k = (k * 16807) % 2147483647;
    return (k % 10000) / 10000;
  };
  const out: {x: number; y: number; o: number}[] = [];
  const centros: [number, number, number, number][] = [
    [-46.6, -23.5, 2.2, 0.38], // SP
    [-43.2, -22.9, 1.4, 0.14], // RJ
    [-44.0, -19.9, 1.6, 0.1], // BH
    [-49.3, -25.4, 1.6, 0.1], // Sul
    [-51.2, -30.0, 1.6, 0.07],
    [-47.9, -15.8, 1.6, 0.06], // Centro-Oeste
    [-38.5, -12.9, 1.6, 0.06], // Nordeste
    [-35.0, -8.0, 1.6, 0.04],
    [-38.5, -3.8, 1.4, 0.03],
    [-60.0, -3.1, 2.0, 0.02], // Norte
  ];
  let tries = 0;
  while (out.length < 170 && tries < 5000) {
    tries++;
    let r = rnd();
    let c = centros[0];
    for (const cc of centros) {
      if (r < cc[3]) {
        c = cc;
        break;
      }
      r -= cc[3];
    }
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * c[2];
    const lo = c[0] + Math.cos(a) * d;
    const la = c[1] + Math.sin(a) * d;
    if (!dentro(lo, la)) continue;
    out.push({x: (lo - LON0) * ESC_MAPA, y: (la - LAT0) * ESC_MAPA, o: rnd()});
  }
  return out;
})();
const G_PONTO = new THREE.SphereGeometry(1, 8, 6);
export const MapaBrasil: React.FC<{tema: Tema; pos: V3; tam: number; k: number; acende: number; cor?: string}> = ({tema, pos, tam, k, acende, cor}) => {
  const m = useMemo(() => new THREE.Object3D(), []);
  if (k < 0.02) return null;
  const preparar = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    PONTOS_MAPA.forEach((p, i) => {
      const a = Math.max(0, Math.min(1, (acende * 1.25 - p.o * 0.25 - (i / PONTOS_MAPA.length) * 0.9) * 4));
      m.position.set(p.x, p.y, 0.06);
      m.scale.setScalar(0.022 * a + 0.0001);
      m.updateMatrix();
      mesh.setMatrixAt(i, m.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return (
    <group position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={tam * k}>
      <mesh geometry={G_MAPA} receiveShadow>
        <Fosco cor={cor ?? mistura(tema.objetoEscuro, tema.objeto, 0.3)} />
      </mesh>
      <instancedMesh ref={preparar} args={[G_PONTO, undefined, PONTOS_MAPA.length]}>
        <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={1.4} />
      </instancedMesh>
    </group>
  );
};

// ---------- Calendário com ano (texto fixo por ano; troca a folha com giro) ----------
export const CalendarioAno: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; ano: string; vira: number; destaque?: number}> = ({tema, pos, rotY = 0, escala, ano, vira, destaque = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.3, 1.5, 0.12]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0, -0.07]} />
      <Caixa args={[1.3, 0.34, 0.14]} raio={0.06} cor={mistura(tema.objeto, tema.acento, destaque)} emissivo={0.3 * destaque} position={[0, 0.6, -0.04]} />
      {[-0.35, 0, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.78, 0.02]}>
          <torusGeometry args={[0.07, 0.02, 10, 20]} />
          <meshStandardMaterial color={tema.objetoClaro} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      <group position={[0, 0.42, 0.01]} rotation={[-Math.PI * 0.5 * Math.sin(Math.PI * Math.min(1, vira)), 0, 0]}>
        <Placa tema={tema} pos={[0, -0.52, 0]} larg={1.16} alt={0.96} linhas={[{t: ano, tam: 300, cor: destaque > 0.5 ? tema.acento : tema.objetoEscuro, peso: 900}]} fundo={tema.objetoClaro} />
      </group>
    </group>
  );
