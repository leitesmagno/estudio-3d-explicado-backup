import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {ESCURO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 010 (fábrica de fake). Tudo fosco, sem logo e sem rosto; texto fixo por peça.

// Laranja da fake: o acento do tema base do Estúdio (não é cor escrita no vídeo).
export const corFake = (_tema: Tema) => ESCURO.acento;

// ---------- Galpão em corte (casa de bonecas): piso, parede do fundo e meia parede lateral ----------
// Centro do piso em `pos`; `larg` em x, `prof` em z. A parede do fundo fica em z = −prof/2.
export const Galpao: React.FC<{tema: Tema; pos: V3; larg: number; prof: number; altFundo: number; altLado: number; cor: string; corParede: string; faixa?: string; kFaixa?: number}> = ({tema, pos, larg, prof, altFundo, altLado, cor, corParede, faixa, kFaixa = 0}) => (
  <group position={pos}>
    <Caixa args={[larg, 0.1, prof]} raio={0.04} cor={cor} position={[0, 0.05, 0]} />
    <Caixa args={[larg, altFundo, 0.2]} raio={0.06} cor={corParede} position={[0, altFundo / 2, -prof / 2 + 0.1]} />
    <Caixa args={[0.2, altLado, prof * 0.6]} raio={0.06} cor={corParede} position={[-larg / 2 + 0.1, altLado / 2, -prof * 0.2]} />
    {/* Rodapé claro na parede do fundo */}
    <Caixa args={[larg - 0.1, 0.14, 0.04]} raio={0.02} cor={mistura(corParede, tema.objetoClaro, 0.25)} sombra={false} position={[0, 0.17, -prof / 2 + 0.22]} />
    {faixa ? <Caixa args={[larg - 0.3, 0.02, 0.22]} raio={0.01} cor={mistura(cor, faixa, 0.3 + 0.6 * kFaixa)} emissivo={0.25 * kFaixa} sombra={false} position={[0, 0.115, prof / 2 - 0.3]} /> : null}
  </group>
);

// ---------- Pórtico de máquina com número em cima (frente em z+) ----------
export const Portico: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; numero: string; aceso: number; luz: string}> = ({tema, pos, larg, alt, numero, aceso, luz}) => (
  <group position={pos}>
    {[-1, 1].map((l) => (
      <Caixa key={l} args={[0.16, alt, 0.16]} raio={0.04} cor={tema.objetoEscuro} position={[(l * larg) / 2, alt / 2, -0.75]} />
    ))}
    <Caixa args={[larg + 0.3, 0.22, 0.3]} raio={0.05} cor={tema.objetoEscuro} position={[0, alt, -0.75]} />
    <group position={[0, alt + 0.48, -0.75]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.1, 32]} />
        <Fosco cor={mistura(tema.objetoEscuro, luz, 0.85 * aceso)} emissivo={0.45 * aceso} />
      </mesh>
      <Placa tema={tema} pos={[0, 0, 0.056]} larg={0.6} alt={0.6} linhas={[{t: numero, tam: 620, cor: tema.objetoClaro, peso: 900}]} brilho={0.3 + 0.4 * aceso} />
    </group>
  </group>
);

// ---------- TV velha de tubo com etiqueta de data na frente (frente em z+) ----------
// 1,1 × 0,85 × 0,8; base em pos. `data` 1 = etiqueta legível, 0 = borrão. `verde` 0..1 troca a etiqueta pela versão da checagem.
export const TVVelha: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number; data: number; verde: number; brilhoData?: number}> = ({tema, pos, rot = [0, 0, 0], escala = 1, data, verde, brilhoData = 0}) => {
  if (escala < 0.02) return null;
  const casco = mistura(tema.objetoEscuro, tema.areia, 0.35);
  const dVerde = data * verde;
  const dVelha = data * (1 - verde);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.1, 0.85, 0.8]} raio={0.1} cor={casco} position={[0, 0.48, 0]} />
      <Caixa args={[0.9, 0.06, 0.6]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0]} />
      {/* Tela */}
      <Caixa args={[0.74, 0.5, 0.04]} raio={0.05} cor={tema.objetoEscuro} position={[-0.08, 0.55, 0.4]} />
      <Placa tema={tema} pos={[-0.08, 0.55, 0.425]} larg={0.66} alt={0.42} linhas={[{t: 'TELEJORNAL', tam: 130, cor: tema.ceuLuz, peso: 850, mono: true}]} fundo={mistura(tema.objetoEscuro, tema.ceuLuz, 0.25)} brilho={0.5} />
      {/* Botões */}
      {[0.66, 0.46].map((y) => (
        <mesh key={y} position={[0.42, y, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
      {/* Antena */}
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0.16 * l, 1.1, -0.05]} rotation={[0, 0, -0.45 * l]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 6]} />
          <Fosco cor={tema.objeto} />
        </mesh>
      ))}
      {/* Etiqueta da data, embaixo da tela */}
      <Caixa args={[0.78, 0.16, 0.03]} raio={0.02} cor={mistura(tema.objetoClaro, tema.objeto, 0.3 + 0.5 * (1 - data))} position={[-0.08, 0.2, 0.405]} />
      {dVelha > 0.02 ? <Placa tema={tema} pos={[-0.08, 0.2, 0.424]} rot={[0, 0, 0]} larg={0.72 * dVelha} alt={0.13} linhas={[{t: '31 JUL 2024', tam: 210, cor: tema.objetoEscuro, peso: 900, mono: true}]} brilho={0.2} /> : null}
      {dVerde > 0.02 ? (
        <>
          <Caixa args={[0.8 * dVerde, 0.18, 0.02]} raio={0.02} cor={tema.acento} emissivo={0.3 + 0.4 * brilhoData} sombra={false} position={[-0.08, 0.2, 0.425]} />
          <Placa tema={tema} pos={[-0.08, 0.2, 0.44]} larg={0.72 * dVerde} alt={0.13} linhas={[{t: '31 JUL 2024', tam: 210, cor: tema.fundo, peso: 900, mono: true}]} brilho={0.35} />
        </>
      ) : null}
      {/* Borrão quando a data some */}
      {data < 0.98 ? <Caixa args={[0.7 * (1 - data), 0.1, 0.02]} raio={0.03} cor={tema.objeto} sombra={false} position={[-0.08, 0.2, 0.43]} /> : null}
    </group>
  );
};

// ---------- Cartaz da fake: placa num mastro, com até 4 linhas que nascem uma a uma ----------
// Base do mastro em pos. `linhas` 0..n (fração = a linha nascendo). `cinza` 0..1 apaga o laranja. `sobe` 0..1 levanta.
export const CartazFake: React.FC<{tema: Tema; pos: V3; textos: string[]; linhas: number; sobe: number; cinza?: number; escala?: number; rotulo?: string}> = ({tema, pos, textos, linhas, sobe, cinza = 0, escala = 1, rotulo = 'TEXTO DO POST'}) => {
  if (sobe < 0.02 || escala < 0.02) return null;
  const fundo = mistura(corFake(tema), tema.objeto, cinza);
  const alt = 1.5;
  const larg = 2.4;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.08, 0.5 * sobe + 0.02, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, (0.5 * sobe) / 2, -0.02]} />
      <group position={[0, 0.5 * sobe + alt / 2, 0]} scale={[1, sobe, 1]}>
        <Caixa args={[larg + 0.12, alt + 0.12, 0.08]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0, -0.03]} />
        <Caixa args={[larg, alt, 0.06]} raio={0.03} cor={fundo} emissivo={0.22 * (1 - cinza)} position={[0, 0, 0]} />
        {textos.map((tx, i) => {
          const k = Math.max(0, Math.min(1, linhas - i));
          if (k < 0.02) return null;
          const n = textos.length;
          const passo = (alt - 0.3) / n;
          const y = alt / 2 - 0.22 - passo * (i + 0.5) + 0.06;
          const grande = i === 0 || tx.includes('R$');
          return <Placa key={i} tema={tema} pos={[0, y, 0.035]} larg={(larg - 0.2) * k} alt={passo * 0.92} linhas={[{t: tx, tam: grande ? 170 : 130, cor: tema.fundo, peso: 900}]} brilho={0.25} />;
        })}
        <Caixa args={[1.2, 0.17, 0.03]} raio={0.02} cor={tema.objetoEscuro} position={[0, -alt / 2 + 0.02, 0.05]} />
        <Placa tema={tema} pos={[0, -alt / 2 + 0.02, 0.07]} larg={1.12} alt={0.13} linhas={[{t: rotulo, tam: 120, cor: tema.objetoClaro, peso: 800, mono: true}]} brilho={0.3} />
      </group>
    </group>
  );
};

// ---------- Cópia do cartaz voando (sem texto) ----------
export const CartazinhoVoa: React.FC<{tema: Tema; pos: V3; rot: V3; escala: number}> = ({tema, pos, rot, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.6, 0.4, 0.03]} raio={0.02} cor={corFake(tema)} emissivo={0.3} sombra={false} />
      {[0.1, 0, -0.1].map((y) => (
        <Caixa key={y} args={[0.44, 0.04, 0.01]} raio={0.005} cor={tema.fundo} sombra={false} position={[0, y, 0.02]} />
      ))}
    </group>
  );

// ---------- Estante do arquivo com TVs velhas empilhadas (frente em z+) ----------
export const Arquivo: React.FC<{tema: Tema; pos: V3}> = ({tema, pos}) => (
  <group position={pos}>
    {[-0.75, 0.75].map((x) => (
      <Caixa key={x} args={[0.1, 2.0, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[x, 1.0, 0]} />
    ))}
    {[0.1, 0.8, 1.5].map((y) => (
      <Caixa key={y} args={[1.6, 0.06, 0.9]} raio={0.02} cor={tema.objetoEscuro} position={[0, y, 0]} />
    ))}
    {/* TVs guardadas (sem etiqueta) */}
    {[0.13, 0.83].map((y) => (
      <group key={y} position={[0, y, 0]} scale={0.62}>
        <Caixa args={[1.1, 0.85, 0.8]} raio={0.1} cor={mistura(tema.objetoEscuro, tema.areia, 0.25)} position={[-0.0, 0.48, 0]} />
        <Caixa args={[0.74, 0.5, 0.04]} raio={0.05} cor={tema.objetoEscuro} position={[-0.08, 0.55, 0.4]} />
      </group>
    ))}
    <Placa tema={tema} pos={[0, 2.12, 0.05]} larg={1.4} alt={0.22} linhas={[{t: 'ARQUIVO', tam: 220, cor: tema.objetoClaro, peso: 900, mono: true}]} brilho={0.25} />
  </group>
);

// ---------- Garra num trilho alto: desce até `alvoY` com `desce` 0..1; a posição em z é do trilho ----------
export const Garra: React.FC<{tema: Tema; pos: V3; topo: number; desce: number; fecha: number}> = ({tema, pos, topo, desce, fecha}) => {
  const y = topo - desce * (topo - pos[1]);
  const cabo = topo + 0.4 - y;
  return (
    <group position={[pos[0], 0, pos[2]]}>
      <Caixa args={[0.5, 0.3, 0.5]} raio={0.06} cor={tema.objeto} position={[0, topo + 0.55, 0]} />
      <Caixa args={[0.05, cabo, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0, y + cabo / 2 + 0.25, 0]} />
      <Caixa args={[0.7, 0.14, 0.3]} raio={0.04} cor={tema.objetoEscuro} position={[0, y + 0.25, 0]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.08, 0.5, 0.26]} raio={0.03} cor={tema.objeto} position={[l * (0.62 - 0.08 * fecha), y - 0.02, 0]} />
      ))}
    </group>
  );
};

// ---------- Trilho em z, preso no alto ----------
export const TrilhoAlto: React.FC<{tema: Tema; x: number; y: number; z0: number; z1: number}> = ({tema, x, y, z0, z1}) => (
  <group>
    <Caixa args={[0.18, 0.14, z1 - z0 + 0.4]} raio={0.04} cor={tema.objetoEscuro} position={[x, y, (z0 + z1) / 2]} />
    {[z0 - 0.1, z1 + 0.1].map((z) => (
      <Caixa key={z} args={[0.12, y, 0.12]} raio={0.03} cor={tema.objetoEscuro} position={[x + 0.6, y / 2, z]} />
    ))}
    {[z0 - 0.1, z1 + 0.1].map((z) => (
      <Caixa key={`b${z}`} args={[0.7, 0.1, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[x + 0.3, y, z]} />
    ))}
  </group>
);

// ---------- Borracha gigante num braço que desce (frente em z+) ----------
// `y` é a altura do centro da borracha; `vai` desloca em x (esfrega).
export const Borracha: React.FC<{tema: Tema; pos: V3; y: number; vai: number; luz: string; aceso: number}> = ({tema, pos, y, vai, luz, aceso}) => (
  <group position={pos}>
    <Caixa args={[0.08, 3.4 - y, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[vai, y + (3.4 - y) / 2, 0]} />
    <group position={[vai, y, 0]}>
      <Caixa args={[0.62, 0.3, 0.3]} raio={0.08} cor={mistura(tema.areia, luz, 0.25 + 0.3 * aceso)} emissivo={0.12 * aceso} position={[0, 0.06, 0]} />
      <Caixa args={[0.64, 0.14, 0.32]} raio={0.06} cor={tema.objetoClaro} position={[0, -0.12, 0]} />
    </group>
  </group>
);

// ---------- Prensa: carimbo grande que desce de `topo` até `baixo` (`desce` 0..1) ----------
export const Prensa: React.FC<{tema: Tema; pos: V3; topo: number; baixo: number; desce: number; luz: string; aceso: number}> = ({tema, pos, topo, baixo, desce, luz, aceso}) => {
  const y = topo - (topo - baixo) * desce;
  return (
    <group position={pos}>
      <Caixa args={[0.9, 0.5, 0.9]} raio={0.08} cor={tema.objeto} position={[0, 3.75, -0.2]} />
      <mesh position={[0, (3.6 + y + 0.3) / 2, -0.2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, Math.max(0.05, 3.6 - y - 0.3), 16]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      <group position={[0, y, -0.2]}>
        <Caixa args={[1.0, 0.36, 0.8]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.18, 0]} />
        <Caixa args={[1.04, 0.1, 0.84]} raio={0.03} cor={mistura(tema.objetoEscuro, luz, 0.4 + 0.5 * aceso)} emissivo={0.3 * aceso} position={[0, 0.03, 0]} />
      </group>
    </group>
  );
};

// ---------- Canhão de cópias: base, cano apontado para trás (−z) e para cima ----------
export const Canhao: React.FC<{tema: Tema; pos: V3; recuo: number; luz: string; aceso: number}> = ({tema, pos, recuo, luz, aceso}) => (
  <group position={pos}>
    <Caixa args={[1.2, 0.6, 1.2]} raio={0.1} cor={tema.objetoEscuro} position={[0, 0.3, 0]} />
    {[-1, 1].map((l) => (
      <mesh key={l} position={[0.66 * l, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 28]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    ))}
    <group position={[0, 0.9, 0.1 * recuo]} rotation={[0.75, 0, 0]}>
      <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 1.5, 28]} />
        <Fosco cor={mistura(tema.objeto, luz, 0.35 * aceso)} emissivo={0.12 * aceso} />
      </mesh>
      <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.05, 10, 28]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  </group>
);
// Boca do cano, no espaço do mundo, para um canhão em `pos` (mesma conta do componente).
export const bocaCanhao = (pos: V3): V3 => [pos[0], pos[1] + 0.9 + Math.sin(0.75) * 1.3, pos[2] - Math.cos(0.75) * 1.3];

// ---------- Planície de celulares deitados (instanciada); a tela acende na cor `cor` com `luz(i)` ----------
const G_CEL = new THREE.BoxGeometry(0.42, 0.05, 0.8);
const G_TELA = new THREE.PlaneGeometry(0.36, 0.72);
const O = new THREE.Object3D();
const COR = new THREE.Color();
const COR2 = new THREE.Color();
export type CelCampo = {x: number; z: number; r: number; d: number};
export const CAMPO: CelCampo[] = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out: CelCampo[] = [];
  for (let gx = -13; gx <= 13; gx++) {
    for (let gz = -8; gz <= 8; gz++) {
      const x = gx * 1.05 + (rnd() - 0.5) * 0.4;
      const z = gz * 1.05 + (rnd() - 0.5) * 0.4;
      out.push({x, z, r: (rnd() - 0.5) * 0.8, d: Math.hypot(x, z * 1.4)});
    }
  }
  return out;
})();
export const CampoFake: React.FC<{tema: Tema; pos: V3; luz: (c: CelCampo) => number; cor: string}> = ({tema, pos, luz, cor}) => {
  const corpo = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CAMPO.forEach((c, i) => {
      O.position.set(c.x, 0.06, c.z);
      O.rotation.set(0, c.r, 0);
      O.updateMatrix();
      mesh.setMatrixAt(i, O.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  const telas = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    CAMPO.forEach((c, i) => {
      O.position.set(c.x, 0.09, c.z);
      O.rotation.set(-Math.PI / 2, c.r, 0, 'YXZ');
      O.updateMatrix();
      mesh.setMatrixAt(i, O.matrix);
      const l = Math.max(0, Math.min(1, luz(c)));
      COR.set(mistura(tema.fundo, tema.ceuLuz, 0.18)).lerp(COR2.set(cor), l).multiplyScalar(0.35 + 0.65 * l);
      mesh.setColorAt(i, COR);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <group position={pos}>
      <Caixa args={[29, 0.04, 18.5]} raio={0.02} cor={mistura(tema.chao, tema.objetoEscuro, 0.4)} position={[0, 0.02, 0]} />
      <instancedMesh ref={corpo} args={[G_CEL, undefined, CAMPO.length]} frustumCulled={false} castShadow receiveShadow>
        <meshStandardMaterial color={mistura(tema.fundo, tema.objetoEscuro, 0.55)} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={telas} args={[G_TELA, undefined, CAMPO.length]} frustumCulled={false}>
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

// ---------- Bloco de dinheiro (1 bloco = R$ 1 bi): maço com cinta; `h` 0..1 da altura cheia ----------
export const BLOCO = {l: 0.46, a: 0.22, p: 0.66};
export const BlocoBi: React.FC<{tema: Tema; pos: V3; h?: number; brilho?: number; cor?: string}> = ({tema, pos, h = 1, brilho = 0, cor}) => {
  if (h < 0.02) return null;
  const a = BLOCO.a * h;
  return (
    <group position={pos}>
      <Caixa args={[BLOCO.l, a - 0.008, BLOCO.p]} raio={Math.min(0.03, a / 2.2)} cor={cor ?? mistura(tema.objetoClaro, tema.acento, 0.15 + 0.3 * brilho)} emissivo={0.25 * brilho} position={[0, a / 2, 0]} />
      <Caixa args={[BLOCO.l + 0.01, Math.max(0.01, a - 0.004), 0.1]} raio={Math.min(0.01, a / 3)} cor={mistura(tema.acento, tema.objetoEscuro, 0.35)} sombra={false} position={[0, a / 2, 0]} />
    </group>
  );
};

// ---------- Tanque de vidro com nível (`nivel` 0..1), base em pos ----------
export const TanqueVidro: React.FC<{tema: Tema; pos: V3; r: number; alt: number; nivel: number; cor: string; escala?: number}> = ({tema, pos, r, alt, nivel, cor, escala = 1}) => {
  if (escala < 0.02) return null;
  const n = Math.max(0, Math.min(1, nivel));
  return (
    <group position={pos} scale={escala}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[r + 0.12, r + 0.16, 0.2, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {n > 0.01 ? (
        <mesh position={[0, 0.2 + ((alt - 0.1) * n) / 2, 0]}>
          <cylinderGeometry args={[r - 0.05, r - 0.05, (alt - 0.1) * n, 40]} />
          <Fosco cor={cor} emissivo={0.3} />
        </mesh>
      ) : null}
      <mesh position={[0, 0.2 + alt / 2, 0]}>
        <cylinderGeometry args={[r, r, alt, 40, 1, true]} />
        <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.16} roughness={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.22 + alt, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, 0.05, 10, 40]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      {/* Réguas do nível */}
      {[0.25, 0.5, 0.75].map((f) => (
        <Caixa key={f} args={[0.18, 0.03, 0.02]} raio={0.008} cor={tema.objetoClaro} sombra={false} position={[0, 0.2 + alt * f, r + 0.02]} />
      ))}
    </group>
  );
};

// ---------- Caixinha de remédio (sem cruz e sem marca: só a palavra) ----------
export const CaixaRemedio: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.4, 0.24, 0.18]} raio={0.03} cor={tema.objetoClaro} />
      <Caixa args={[0.41, 0.07, 0.19]} raio={0.02} cor={tema.acento} emissivo={0.2} sombra={false} position={[0, 0.05, 0]} />
    </group>
  );

// ---------- Estante dos órgãos e caixa de um órgão ----------
export const COLS = 8;
export const LINHAS = 3;
export const PASSO_X = 1.42;
export const PASSO_Y = 1.05;
export const CX = {l: 1.22, a: 0.82, p: 0.8};
export const EstanteOrgaos: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  const larg = COLS * PASSO_X + 0.3;
  return (
    <group position={pos} scale={[1, k, 1]}>
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[larg, 0.08, 1.0]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04 + i * PASSO_Y, 0]} />
      ))}
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.1, LINHAS * PASSO_Y + 0.1, 1.0]} raio={0.03} cor={tema.objetoEscuro} position={[(l * larg) / 2, (LINHAS * PASSO_Y) / 2, 0]} />
      ))}
      <Caixa args={[larg, LINHAS * PASSO_Y, 0.08]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[0, (LINHAS * PASSO_Y) / 2, -0.48]} />
    </group>
  );
};
// Centro da base da caixa (col, lin) no mundo, para uma estante em `pos`.
export const lugarCaixa = (pos: V3, col: number, lin: number): V3 => [pos[0] + (col - (COLS - 1) / 2) * PASSO_X, pos[1] + 0.08 + lin * PASSO_Y, pos[2] + 0.02];
export const CaixaOrgao: React.FC<{tema: Tema; pos: V3; nome: string; aceso: number; luz: string; escala?: number; meio?: number}> = ({tema, pos, nome, aceso, luz, escala = 1, meio = 0}) => {
  if (escala < 0.02) return null;
  const corpo = mistura(mistura(tema.objeto, tema.objetoEscuro, 0.3), luz, 0.75 * aceso);
  const tam = nome.length > 9 ? 120 : nome.length > 7 ? 145 : 175;
  // `meio` 0..1 abre a caixa em duas metades (a esquerda é a parte destacada)
  const abre = 0.32 * meio;
  return (
    <group position={pos} scale={escala}>
      {meio > 0.01 ? (
        <>
          <Caixa args={[CX.l / 2 - 0.02, CX.a, CX.p]} raio={0.06} cor={corpo} emissivo={0.25 * aceso} position={[-CX.l / 4 - abre, CX.a / 2, 0]} />
          <Caixa args={[CX.l / 2 - 0.02, CX.a, CX.p]} raio={0.06} cor={mistura(tema.objeto, tema.objetoEscuro, 0.3)} position={[CX.l / 4 + abre, CX.a / 2, 0]} />
        </>
      ) : (
        <Caixa args={[CX.l, CX.a, CX.p]} raio={0.06} cor={corpo} emissivo={0.25 * aceso} position={[0, CX.a / 2, 0]} />
      )}
      <Placa tema={tema} pos={[0, CX.a / 2, CX.p / 2 + 0.006]} larg={CX.l - 0.12} alt={0.3} linhas={[{t: nome, tam, cor: aceso > 0.5 ? tema.fundo : tema.objetoClaro, peso: 900, mono: true}]} fundo={aceso > 0.5 ? luz : mistura(tema.objetoEscuro, tema.objeto, 0.2)} brilho={0.25} />
    </group>
  );
};

// ---------- Folha em pé num suporte, com texto, e o carimbo que bate nela ----------
export const FolhaPe: React.FC<{tema: Tema; pos: V3; escala: number; texto: string[]; carimbo: number; textoCarimbo: string; corCarimbo: string}> = ({tema, pos, escala, texto, carimbo, textoCarimbo, corCarimbo}) => {
  if (escala < 0.02) return null;
  const c = Math.max(0, Math.min(1, carimbo));
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.6, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.1]} />
      <group position={[0, 0.85, 0]} rotation={[-0.1, 0, 0]}>
        <Caixa args={[1.0, 1.3, 0.025]} raio={0.01} cor={tema.objetoClaro} />
        <Placa tema={tema} pos={[0, 0.38, 0.016]} larg={0.9} alt={0.36} linhas={texto.map((t) => ({t, tam: 150, cor: tema.objetoEscuro, peso: 900, mono: true}))} brilho={0.2} />
        {[0.0, -0.12, -0.24].map((y) => (
          <Caixa key={y} args={[0.74, 0.035, 0.01]} raio={0.008} cor={tema.objeto} sombra={false} position={[0, y, 0.016]} />
        ))}
        {/* Carimbo: o bloco desce e deixa a marca */}
        {c > 0.02 && c < 0.999 ? (
          <group position={[0.05, -0.1, 0.25 + 0.9 * (1 - Math.min(1, c * 1.6))]}>
            <Caixa args={[0.5, 0.26, 0.16]} raio={0.03} cor={tema.objetoEscuro} />
          </group>
        ) : null}
        {c > 0.6 ? (
          <group position={[0.05, -0.12, 0.02]} rotation={[0, 0, 0.12]} scale={Math.min(1, (c - 0.6) / 0.15)}>
            <Caixa args={[0.86, 0.26, 0.008]} raio={0.02} cor={corCarimbo} emissivo={0.25} sombra={false} />
            <Placa tema={tema} pos={[0, 0, 0.006]} larg={0.8} alt={0.2} linhas={[{t: textoCarimbo, tam: 190, cor: tema.fundo, peso: 900, mono: true}]} brilho={0.3} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Celular grande em pé com a fake em cinza e o carimbo da data ----------
export const CelularFake: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; carimbo: number}> = ({tema, pos, rot = [0, 0, 0], escala, carimbo}) => {
  if (escala < 0.02) return null;
  const c = Math.max(0, Math.min(1, carimbo));
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.0, 2.0, 0.1]} raio={0.12} cor={mistura(tema.fundo, tema.objetoEscuro, 0.8)} />
      <Caixa args={[0.88, 1.8, 0.02]} raio={0.08} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} sombra={false} position={[0, 0, 0.055]} />
      <Placa tema={tema} pos={[0, 0.35, 0.07]} larg={0.8} alt={0.7} linhas={[{t: 'GRAVÍSSIMO!', tam: 150, cor: tema.objetoClaro, peso: 900}, {t: 'QUASE R$ 6 BI', tam: 140, cor: tema.objetoClaro, peso: 900}, {t: 'DA SAÚDE E', tam: 110, cor: tema.objetoClaro, peso: 800}, {t: 'EDUCAÇÃO', tam: 110, cor: tema.objetoClaro, peso: 800}]} brilho={0.25} />
      {[-0.25, -0.4, -0.55].map((y) => (
        <Caixa key={y} args={[0.7, 0.05, 0.01]} raio={0.01} cor={tema.objeto} sombra={false} position={[0, y, 0.07]} />
      ))}
      {c > 0.02 ? (
        <group position={[0, -0.05, 0.08 + 0.4 * (1 - c)]} rotation={[0, 0, 0.14]} scale={0.6 + 0.4 * c}>
          <Caixa args={[0.92, 0.3, 0.012]} raio={0.03} cor={tema.acento} emissivo={0.3} sombra={false} />
          <Placa tema={tema} pos={[0, 0, 0.008]} larg={0.86} alt={0.24} linhas={[{t: 'É DE 2024', tam: 230, cor: tema.fundo, peso: 900}]} brilho={0.35} />
        </group>
      ) : null}
    </group>
  );
};
