import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type Cam, type Linha, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';

// Peças: Bolsa Família: o placar de estádio, a carteira de trabalho, a geladeira,
// a plateia dos cantos (presa à câmera), o contador de vagas e a corrente fantasma.
// Formas simples, foscas, arredondadas, sem marca e sem rosto. Texturas só com texto fixo (nunca mudam por quadro).

// ---------- Painel que vira (frente "?" → verso com o valor) ----------
// `vira` 0..1: gira no eixo X como placa de placar antigo.
const PainelVira: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; vira: number; frente: Linha[]; verso: Linha[]; fundoVerso?: string}> = ({tema, pos, larg, alt, vira, frente, verso, fundoVerso}) => (
  <group position={pos} rotation={[Math.PI * vira, 0, 0]}>
    <Placa tema={tema} pos={[0, 0, 0.012]} larg={larg} alt={alt} linhas={frente} fundo={tema.objetoEscuro} />
    <Placa tema={tema} pos={[0, 0, -0.012]} rot={[Math.PI, 0, 0]} larg={larg} alt={alt} linhas={verso} fundo={fundoVerso ?? tema.objetoEscuro} />
  </group>
);

// ---------- Placar de estádio ----------
// Lado esquerdo SEM CARTEIRA, direito COM CARTEIRA, faixa do meio com a diferença.
// `desce` 0..1 (entra do alto), `esq`/`dir`/`meio` 0..1 (viram), `barras` 0..1, `lampadas` 0..1, `pulsoEsq` 0..1.
export const LARG_PLACAR = 6.4;
export const ALT_PLACAR = 3.0;
export const Placar: React.FC<{tema: Tema; pos: V3; desce: number; esq: number; dir: number; meio: number; barras: number; lampadas: number; pulsoEsq?: number; brilhoMeio?: number}> = ({
  tema,
  pos,
  desce,
  esq,
  dir,
  meio,
  barras,
  lampadas,
  pulsoEsq = 0,
  brilhoMeio = 0,
}) => {
  if (desce < 0.01) return null;
  const W = LARG_PLACAR;
  const H = ALT_PLACAR;
  const y = pos[1] + 6 * (1 - desce);
  const valor = (a: string, b: string, cor: string): Linha[] => [
    {t: a, tam: 64, cor: tema.textoSuave, peso: 700},
    {t: b, tam: 190, cor, peso: 900},
  ];
  const interrog: Linha[] = [{t: '?', tam: 300, cor: tema.textoSuave, peso: 900}];
  // Barras sob os números: 1.282 contra 1.621 (proporção real).
  const hE = 0.55 * barras;
  const hD = 0.55 * (1621 / 1282) * barras;
  return (
    <group position={[pos[0], y, pos[2]]}>
      {/* Postes */}
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.22, pos[1] + 0.6, 0.22]} raio={0.06} cor={tema.objetoEscuro} position={[l * (W / 2 - 0.6), -(pos[1] + 0.6) / 2 - H / 2 + 0.3, -0.2]} />
      ))}
      {/* Moldura e fundo */}
      <Caixa args={[W + 0.3, H + 0.3, 0.3]} raio={0.1} cor={tema.objetoEscuro} position={[0, 0, -0.2]} />
      <Caixa args={[W, H, 0.06]} raio={0.04} cor={mistura(tema.fundo, tema.objetoEscuro, 0.5)} position={[0, 0, -0.03]} />
      {/* Fileira de lâmpadas no alto: acendem em sequência, devagar */}
      {Array.from({length: 14}).map((_, i) => {
        const k = Math.max(0, Math.min(1, lampadas * 16 - i));
        return (
          <mesh key={i} position={[-W / 2 + 0.35 + (i * (W - 0.7)) / 13, H / 2 + 0.28, 0]}>
            <sphereGeometry args={[0.09, 14, 10]} />
            <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objetoClaro, k)} emissive={tema.objetoClaro} emissiveIntensity={0.9 * k} />
          </mesh>
        );
      })}
      <Caixa args={[W + 0.3, 0.08, 0.2]} raio={0.03} cor={tema.objetoEscuro} position={[0, H / 2 + 0.17, -0.1]} />
      {/* Painéis */}
      <PainelVira tema={tema} pos={[-W / 2 + 1.25, 0.25, 0.03]} larg={2.2} alt={1.9} vira={esq} frente={interrog} verso={valor('SEM CARTEIRA', 'R$ 1.282', tema.objetoClaro)} />
      <PainelVira tema={tema} pos={[W / 2 - 1.25, 0.25, 0.03]} larg={2.2} alt={1.9} vira={dir} frente={interrog} verso={valor('COM CARTEIRA', 'R$ 1.621', tema.objetoClaro)} />
      <PainelVira
        tema={tema}
        pos={[0, 0.25, 0.08]}
        larg={1.75}
        alt={2.25}
        vira={meio}
        frente={[{t: '×', tam: 300, cor: tema.textoSuave, peso: 700}]}
        verso={[
          {t: 'DIFERENÇA', tam: 76, cor: tema.objetoClaro, peso: 700},
          {t: '+R$ 339', tam: 230, cor: tema.objetoClaro, peso: 900},
          {t: 'ANTES DOS DESCONTOS', tam: 64, cor: tema.objetoClaro, peso: 700},
        ]}
        fundoVerso={tema.acento}
      />
      {/* Moldura acesa no lado esquerdo (pulso lento) e no meio */}
      {pulsoEsq > 0.02 ? <Caixa args={[2.36, 2.06, 0.02]} raio={0.04} cor={tema.objetoClaro} emissivo={0.6 * pulsoEsq} sombra={false} position={[-W / 2 + 1.25, 0.25, 0.0]} /> : null}
      {brilhoMeio > 0.02 ? <Caixa args={[1.95, 2.45, 0.02]} raio={0.05} cor={tema.acento} emissivo={0.9 * brilhoMeio} sombra={false} position={[0, 0.25, 0.04]} /> : null}
      {/* Barras sob os números */}
      {barras > 0.01 ? (
        <>
          <Caixa args={[1.6, Math.max(0.02, hE), 0.12]} raio={0.03} cor={tema.objeto} emissivo={0.15} position={[-W / 2 + 1.25, -H / 2 + 0.12 + hE / 2, 0.08]} />
          <Caixa args={[1.6, Math.max(0.02, hD), 0.12]} raio={0.03} cor={tema.objeto} emissivo={0.15} position={[W / 2 - 1.25, -H / 2 + 0.12 + hD / 2, 0.08]} />
        </>
      ) : null}
    </group>
  );
};

// ---------- Holofote (poste com cone de luz suave) ----------
export const Holofote: React.FC<{tema: Tema; pos: V3; alvo: V3; luz: number}> = ({tema, pos, alvo, luz}) => {
  const d = new THREE.Vector3(alvo[0] - pos[0], alvo[1] - pos[1], alvo[2] - pos[2]);
  const comp = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.clone().normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  return (
    <group>
      <Caixa args={[0.16, pos[1], 0.16]} raio={0.05} cor={tema.objetoEscuro} position={[pos[0], pos[1] / 2, pos[2]]} />
      <group position={pos} rotation={[e.x, e.y, e.z]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.22, 0.4, 20]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.28, 24]} />
          <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={1.2 * luz} />
        </mesh>
        {luz > 0.02 ? (
          <mesh position={[0, -comp / 2, 0]}>
            <cylinderGeometry args={[0.28, 1.6, comp, 32, 1, true]} />
            <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.07 * luz} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Carteira de trabalho (livreto que abre; carimbo na página) ----------
export const CarteiraTrabalho: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre: number; carimbo: number; treme?: number}> = ({tema, pos, rot = [0, 0, 0], escala, abre, carimbo, treme = 0}) => {
  if (escala < 0.02) return null;
  const capa = mistura(tema.objetoEscuro, tema.ceuLuz, 0.35);
  const a = Math.PI * 0.92 * abre;
  return (
    <group position={pos} rotation={[rot[0], rot[1], rot[2] + 0.06 * treme]} scale={escala}>
      {/* Metade de trás (fica deitada) */}
      <Caixa args={[0.5, 0.025, 0.7]} raio={0.012} cor={capa} position={[0.25, 0, 0]} />
      <Caixa args={[0.46, 0.012, 0.66]} raio={0.004} cor={tema.objetoClaro} sombra={false} position={[0.25, 0.018, 0]} />
      {[0.15, 0.05, -0.05, -0.15].map((z) => (
        <Caixa key={z} args={[0.32, 0.004, 0.018]} raio={0.002} cor={tema.objetoEscuro} sombra={false} position={[0.27, 0.026, z]} />
      ))}
      {/* Carimbo na página: anel + traço em acento */}
      {carimbo > 0.02 ? (
        <group position={[0.27, 0.03 + 0.25 * (1 - Math.min(1, carimbo)), -0.02]} scale={0.6 + 0.4 * Math.min(1, carimbo)}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.09, 0.12, 40]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.5} />
          </mesh>
          <Caixa args={[0.18, 0.004, 0.03]} raio={0.002} cor={tema.acento} emissivo={0.5} sombra={false} position={[0, 0, 0]} />
        </group>
      ) : null}
      {/* Capa da frente: gira no lombo (x = 0) */}
      <group rotation={[0, 0, a]}>
        <Caixa args={[0.5, 0.025, 0.7]} raio={0.012} cor={capa} position={[0.25, 0.03, 0]} />
        <Caixa args={[0.46, 0.012, 0.66]} raio={0.004} cor={tema.objetoClaro} sombra={false} position={[0.25, 0.012, 0]} />
        {/* Brasão genérico na capa (círculo), sem marca */}
        <mesh position={[0.25, 0.044, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.08, 32]} />
          <meshStandardMaterial color={tema.objeto} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Geladeira de porta aberta: `cheia` 0..1 acende as prateleiras e põe comida ----------
export const Geladeira: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cheia: number}> = ({tema, pos, rotY = 0, escala, cheia}) => {
  if (escala < 0.02) return null;
  const itens: [number, number, number, number][] = [
    // x, prateleira, larg, alt
    [-0.18, 0, 0.14, 0.2],
    [0.02, 0, 0.16, 0.14],
    [0.2, 0, 0.12, 0.22],
    [-0.15, 1, 0.2, 0.12],
    [0.12, 1, 0.18, 0.16],
    [-0.12, 2, 0.16, 0.18],
    [0.14, 2, 0.14, 0.12],
    [0.0, 3, 0.3, 0.1],
  ];
  const n = itens.length;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.72, 1.6, 0.06]} raio={0.03} cor={tema.objeto} position={[0, 0.8, -0.27]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.06, 1.6, 0.6]} raio={0.03} cor={tema.objeto} position={[l * 0.33, 0.8, 0]} />
      ))}
      <Caixa args={[0.72, 0.06, 0.6]} raio={0.03} cor={tema.objeto} position={[0, 1.57, 0]} />
      <Caixa args={[0.72, 0.1, 0.6]} raio={0.03} cor={tema.objeto} position={[0, 0.05, 0]} />
      {/* Luz de dentro */}
      <mesh position={[0, 0.85, -0.235]}>
        <planeGeometry args={[0.58, 1.4]} />
        <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objetoClaro, cheia)} emissive={tema.objetoClaro} emissiveIntensity={0.35 * cheia} />
      </mesh>
      {[0.42, 0.78, 1.12, 1.42].map((y) => (
        <Caixa key={y} args={[0.6, 0.02, 0.5]} raio={0.008} cor={tema.objetoClaro} sombra={false} position={[0, y - 0.04, 0]} />
      ))}
      {itens.map(([x, p, w, h], i) => {
        const k = Math.max(0, Math.min(1, cheia * n - i));
        if (k < 0.02) return null;
        const y = [0.42, 0.78, 1.12, 1.42][p];
        return <Caixa key={i} args={[w, h * k, 0.16]} raio={0.03} cor={i % 3 === 0 ? mistura(tema.objeto, tema.acento, 0.55) : i % 3 === 1 ? tema.objetoClaro : tema.corpo} position={[x, y - 0.03 + (h * k) / 2, 0.02]} />;
      })}
      {/* Porta aberta para o lado */}
      <group position={[0.36, 0, 0.3]} rotation={[0, 1.9, 0]}>
        <Caixa args={[0.72, 1.6, 0.07]} raio={0.03} cor={tema.objeto} position={[-0.36, 0.8, 0]} />
        <Caixa args={[0.04, 0.4, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[-0.66, 0.95, -0.05]} />
      </group>
    </group>
  );
};

// ---------- Lancheira ----------
export const Lancheira: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.34, 0.24, 0.16]} raio={0.04} cor={mistura(tema.objeto, tema.acento, 0.4)} position={[0, 0, 0]} />
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.07, 0.015, 8, 20, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );

// ---------- Cartão do benefício (genérico, sem logo) ----------
export const CartaoBeneficio: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; brilho: number}> = ({tema, pos, rot = [0, 0, 0], escala, brilho}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.86, 0.54, 0.03]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.25 + 0.55 * brilho)} emissivo={0.12 * brilho} />
      {/* Faixa e chip genérico */}
      <Caixa args={[0.86, 0.1, 0.008]} raio={0.004} cor={mistura(tema.objetoEscuro, tema.acento, brilho)} emissivo={0.4 * brilho} sombra={false} position={[0, 0.13, 0.017]} />
      <Caixa args={[0.13, 0.1, 0.008]} raio={0.015} cor={mistura(tema.objetoEscuro, tema.objetoClaro, 0.6)} sombra={false} position={[-0.28, -0.04, 0.017]} />
      {[-0.06, 0.06, 0.18, 0.3].map((x) => (
        <Caixa key={x} args={[0.09, 0.03, 0.008]} raio={0.008} cor={tema.objetoEscuro} sombra={false} position={[x, -0.18, 0.017]} />
      ))}
    </group>
  );

// ---------- Corrente fantasma (elos quase transparentes num retângulo em volta da casa) ----------
export const CorrenteFantasma: React.FC<{tema: Tema; centro: V3; larg: number; prof: number; y: number; k: number; vida: number}> = ({tema, centro, larg, prof, y, k, vida}) => {
  if (k < 0.01 || vida < 0.01) return null;
  const per = 2 * (larg + prof);
  const passo = 0.24;
  const n = Math.floor(per / passo);
  const ate = Math.floor(n * k);
  const ponto = (s: number): [number, number, number] => {
    // percorre o retângulo; devolve x, z e o ângulo do lado
    if (s < larg) return [-larg / 2 + s, prof / 2, 0];
    s -= larg;
    if (s < prof) return [larg / 2, prof / 2 - s, Math.PI / 2];
    s -= prof;
    if (s < larg) return [larg / 2 - s, -prof / 2, 0];
    s -= larg;
    return [-larg / 2, -prof / 2 + s, Math.PI / 2];
  };
  return (
    <group position={centro}>
      {Array.from({length: ate}).map((_, i) => {
        const [x, z, ang] = ponto(i * passo);
        return (
          <mesh key={i} position={[x, y + 0.04 * Math.sin(i * 0.9), z]} rotation={[0, ang, i % 2 ? Math.PI / 2 : 0]}>
            <torusGeometry args={[0.1, 0.025, 8, 18]} />
            <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.3} transparent opacity={0.35 * vida} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Contador de vagas (painel em pé com barra que enche) ----------
export const ContadorVagas: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; enche: number; destaque: number}> = ({tema, pos, rotY = 0, escala, enche, destaque}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.12, 1.4, 0.12]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.7, 0]} />
      <Caixa args={[1.5, 0.5, 0.12]} raio={0.06} cor={tema.objetoEscuro} position={[0, 1.6, 0]} />
      <Caixa args={[1.3, 0.22, 0.02]} raio={0.04} cor={mistura(tema.fundo, tema.objetoEscuro, 0.4)} sombra={false} position={[0, 1.6, 0.065]} />
      {enche > 0.01 ? <Caixa args={[1.26 * enche, 0.18, 0.02]} raio={0.04} cor={mistura(tema.objeto, tema.acento, destaque)} emissivo={0.5 * destaque + 0.1} sombra={false} position={[-0.63 + (1.26 * enche) / 2, 1.6, 0.08]} /> : null}
    </group>
  );

// ---------- Plateia presa à câmera (os dois grupos dos cantos) ----------
// Bonecos simples, de costas para a câmera, sem sombra (estão perto da lente e não podem sombrear a cena).
// Posição: um ponto da tela (px, py em pixels 1080×1920) a `d` unidades da câmera.
const W_TELA = 1080;
const H_TELA = 1920;
export const naTela = (cam: Cam, px: number, py: number, d: number): {p: V3; yaw: number} => {
  const pos = new THREE.Vector3(...cam.pos);
  const fwd = new THREE.Vector3(...cam.alvo).sub(pos).normalize();
  const dir = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
  const cima = new THREE.Vector3().crossVectors(dir, fwd).normalize();
  const th = Math.tan((cam.fov * Math.PI) / 360);
  const nx = (px / W_TELA) * 2 - 1;
  const ny = -(((py + (cam.sobe ?? 0)) / H_TELA) * 2 - 1);
  const raio = fwd
    .clone()
    .add(dir.clone().multiplyScalar(nx * th * (W_TELA / H_TELA)))
    .add(cima.clone().multiplyScalar(ny * th));
  const p = pos.clone().add(raio.multiplyScalar(d / raio.dot(fwd)));
  return {p: [p.x, p.y, p.z], yaw: Math.atan2(fwd.x, fwd.z)};
};

const Silhueta: React.FC<{cor: string; cabeca?: number; balanca?: number; cracha?: string; braco?: number}> = ({cor, cabeca = 0, balanca = 0, cracha, braco = 0}) => (
  <group rotation={[0, 0, 0.04 * balanca]}>
    <mesh position={[0, 0.55, 0]} scale={[1, 1, 0.75]}>
      <capsuleGeometry args={[0.22, 0.55, 8, 18]} />
      <Fosco cor={cor} />
    </mesh>
    <group position={[0, 1.08, 0]} rotation={[-cabeca, 0, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.16, 20, 16]} />
        <Fosco cor={cor} />
      </mesh>
    </group>
    {/* Braço erguido (na ponta da plateia, apontando) */}
    {braco > 0.02 ? (
      <mesh position={[0.24, 0.85 + 0.2 * braco, 0]} rotation={[0, 0, -0.3 - 0.9 * braco]}>
        <capsuleGeometry args={[0.06, 0.4, 6, 10]} />
        <Fosco cor={cor} />
      </mesh>
    ) : null}
    {cracha ? <Caixa args={[0.16, 0.1, 0.01]} raio={0.01} cor={cracha} emissivo={0.25} sombra={false} position={[0.1, 0.72, -0.17]} /> : null}
  </group>
);

export const Plateia: React.FC<{
  tema: Tema;
  cam: Cam;
  px: number;
  py: number;
  d?: number;
  n: number;
  larg: number; // largura do grupo em pixels
  k: number; // entrada 0..1
  cor: string;
  t: number;
  olhaCima?: number;
  cracha?: string;
  braco?: number;
  sombra?: number; // 0..1: escurece (sombra da torre)
}> = ({tema, cam, px, py, d = 2.4, n, larg, k, cor, t, olhaCima = 0, cracha, braco = 0, sombra = 0}) => {
  if (k < 0.02) return null;
  const {p, yaw} = naTela(cam, px, py, d);
  // Tamanho de 1 pixel nessa distância
  const px1 = (2 * d * Math.tan((cam.fov * Math.PI) / 360)) / H_TELA;
  const esc = larg * px1;
  const c = mistura(cor, tema.fundo, 0.55 * sombra);
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={esc * (0.85 + 0.15 * k)}>
      <group position={[0, -0.35 * (1 - k), 0]}>
        {Array.from({length: n}).map((_, i) => {
          const fila = i % 2;
          const x = (i / Math.max(1, n - 1) - 0.5) * 0.92;
          const alt = 0.15 + 0.08 * Math.sin(i * 2.3);
          const bal = Math.sin(t * 1.6 + i * 1.3);
          return (
            <group key={i} position={[x, -0.12 * fila + 0.02 * Math.sin(t * 2 + i), 0.12 * fila]} scale={0.36 + alt * 0.5}>
              <Silhueta cor={c} cabeca={olhaCima * (0.5 + 0.1 * Math.sin(i))} balanca={bal} cracha={cracha} braco={i === n - 1 ? braco : 0} />
            </group>
          );
        })}
      </group>
    </group>
  );
};
