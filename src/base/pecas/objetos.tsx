// Estúdio 3D Explicado · objetos prontos: Celular, Predio, Moeda, Pilhas, Cofre
import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import type {Tema} from '../tema';
import {mistura} from '../cores';
import type {V3} from './tipos';
import {Caixa, Fosco} from './caixa';
import {G, geoCaixa} from './geometria';

// ---------- Celular ----------
const G_CEL = geoCaixa(0.085, 0.17, 0.012, 0.013);
const G_TELA = geoCaixa(0.075, 0.156, 0.002, 0.009);

/**
 * Celular genérico, de pé, tela virada para z+. Pequeno de propósito (0,085 × 0,17): na mão do
 * Boneco use scale cerca de 1.7; sozinho na cena, coloque num <group scale={6 a 10}>.
 * - brilho: 0 a 1,6, luz da tela (padrão 0.6). Sobe e desce suave; nunca pisque.
 */
export const Celular: React.FC<{tema: Tema; pos: V3; rot?: V3; brilho?: number; corTela?: string}> = ({tema, pos, rot = [0, 0, 0], brilho = 0.6, corTela}) => {
  const tela = corTela ?? mistura(tema.ceuLuz, tema.objetoClaro, 0.5);
  return (
    <group position={pos} rotation={rot}>
      <mesh geometry={G_CEL} castShadow receiveShadow>
        <Fosco cor={tema.objetoEscuro} aspereza={0.6} />
      </mesh>
      <mesh geometry={G_TELA} position={[0, 0, 0.0062]}>
        <meshStandardMaterial color={mistura(tema.tinta, tela, 0.35)} emissive={tela} emissiveIntensity={0.15 + 0.55 * brilho} roughness={0.4} />
      </mesh>
      {/* conteúdo abstrato da tela: uma faixa de acento e três linhas */}
      <mesh position={[0, 0.048, 0.0076]} scale={[0.058, 0.026, 1]} geometry={G.plano}>
        <meshBasicMaterial color={tema.acento} transparent opacity={0.25 + 0.5 * Math.min(1, brilho)} toneMapped={false} />
      </mesh>
      {[0.008, -0.012, -0.032].map((y, i) => (
        <mesh key={i} position={[-0.006 * i, y, 0.0076]} scale={[0.05 - 0.008 * i, 0.007, 1]} geometry={G.plano}>
          <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.2 + 0.35 * Math.min(1, brilho)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Prédio ----------
/**
 * Prédio de escritórios genérico, base no chão em `pos`. Na escala 1 tem 3 × 3 de base e 8 de altura
 * (use <group scale={0.35}> para um prédio do tamanho de um Boneco grande).
 * - andares (padrão 7), alt, larg, prof, cor (padrão tema.objeto), aceso: 0 a 1 acende as janelas.
 */
export const Predio: React.FC<{tema: Tema; pos: V3; rotY?: number; alt?: number; larg?: number; prof?: number; andares?: number; cor?: string; aceso?: number}> = ({tema, pos, rotY = 0, alt = 8, larg = 3, prof = 3, andares = 7, cor, aceso = 0}) => {
  const corpo = cor ?? tema.objeto;
  const vidro = mistura(mistura(tema.objetoEscuro, tema.tinta, 0.4), mistura(tema.areia, tema.objetoClaro, 0.3), aceso * 0.75);
  const terreo = 1.1;
  const hAndar = (alt - terreo - 0.5) / andares;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Caixa args={[larg, alt, prof]} raio={0.12} cor={corpo} position={[0, alt / 2, 0]} />
      {/* faixas de janela em volta (um anel por andar) */}
      {Array.from({length: andares}).map((_, i) => {
        const y = terreo + hAndar * (i + 0.5);
        return <Caixa key={i} args={[larg + 0.04, hAndar * 0.48, prof + 0.04]} raio={0.04} cor={vidro} emissivo={0.5 * aceso} sombra={false} position={[0, y, 0]} />;
      })}
      {/* porta e marquise */}
      <Caixa args={[larg * 0.36, 0.8, 0.06]} raio={0.03} cor={tema.objetoEscuro} sombra={false} position={[0, 0.4, prof / 2 + 0.02]} />
      <Caixa args={[larg * 0.56, 0.08, 0.5]} raio={0.03} cor={mistura(corpo, tema.objetoClaro, 0.3)} position={[0, 0.92, prof / 2 + 0.22]} />
      {/* topo: platibanda e caixa d'água */}
      <Caixa args={[larg + 0.1, 0.22, prof + 0.1]} raio={0.06} cor={mistura(corpo, tema.objetoClaro, 0.25)} position={[0, alt + 0.06, 0]} />
      <Caixa args={[larg * 0.34, 0.5, prof * 0.3]} raio={0.06} cor={mistura(corpo, tema.objetoEscuro, 0.2)} position={[larg * 0.18, alt + 0.4, -prof * 0.15]} />
    </group>
  );
};

// ---------- Moeda ----------
const G_MOEDA = new THREE.CylinderGeometry(1, 1, 0.26, 44);
const G_FRISO = new THREE.TorusGeometry(0.72, 0.045, 8, 40);

/**
 * Moeda na cor do acento, deitada (eixo em y). rot=[Math.PI / 2, 0, 0] deixa de pé.
 * Espessura = 0,26 × r (para empilhar, passo vertical de 0,27 × r).
 * - r: raio (padrão 0.2). brilho: 0 a 1. escala: multiplica tudo (some abaixo de 0.02). cor: troca a cor.
 */
export const Moeda: React.FC<{tema: Tema; pos: V3; rot?: V3; r?: number; brilho?: number; escala?: number; cor?: string}> = ({tema, pos, rot = [0, 0, 0], r = 0.2, brilho = 0, escala = 1, cor}) => {
  if (escala < 0.02 || r <= 0.001) return null;
  const c = cor ?? tema.acento;
  return (
    <group position={pos} rotation={rot} scale={r * escala}>
      <mesh geometry={G_MOEDA} castShadow receiveShadow>
        <Fosco cor={c} emissivo={0.08 + 0.4 * brilho} aspereza={0.55} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} geometry={G_FRISO} position={[0, 0.13 * s, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Fosco cor={mistura(c, '#ffffff', 0.18)} emissivo={0.08 + 0.4 * brilho} aspereza={0.5} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Pilhas de moedas (instanciadas) ----------
const dummy = new THREE.Object3D();

/**
 * Fileira de pilhas de moedas lado a lado (uma única malha instanciada, leve para muitas moedas).
 * - alturas: quantas moedas em cada pilha (aceita fração: a moeda de cima nasce aos poucos).
 * - r: raio da moeda (padrão 0.2). espaco: distância entre pilhas (padrão 2.4 × r). cor: padrão tema.acento.
 * - destaque: índice da pilha que fica na cor do acento (as outras ficam tema.objeto). Sem destaque, todas no acento.
 */
export const Pilhas: React.FC<{tema: Tema; pos: V3; alturas: number[]; r?: number; espaco?: number; cor?: string; destaque?: number; rotY?: number}> = ({tema, pos, alturas, r = 0.2, espaco, cor, destaque, rotY = 0}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const passo = espaco ?? r * 2.4;
  const total = alturas.reduce((s, a) => s + Math.ceil(Math.max(0, a)), 0);
  const max = Math.max(1, total);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const c = new THREE.Color();
    let i = 0;
    alturas.forEach((a, p) => {
      const x = (p - (alturas.length - 1) / 2) * passo;
      const n = Math.ceil(Math.max(0, a));
      for (let k = 0; k < n; k++) {
        const parcial = Math.min(1, a - k);
        dummy.position.set(x + Math.sin(k * 1.7 + p) * r * 0.04, r * 0.13 + k * r * 0.27, Math.cos(k * 2.3 + p) * r * 0.04);
        dummy.rotation.set(0, k * 0.6, 0);
        dummy.scale.setScalar(r * Math.max(0.001, parcial));
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        c.set(destaque === undefined || destaque === p ? (cor ?? tema.acento) : tema.objeto);
        m.setColorAt(i, c);
        i++;
      }
    });
    m.count = i;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <instancedMesh key={max} ref={ref} args={[G_MOEDA, undefined, max]} castShadow receiveShadow frustumCulled={false}>
        <meshStandardMaterial roughness={0.55} metalness={0} />
      </instancedMesh>
    </group>
  );
};

// ---------- Cofre ----------
/**
 * Cofre fosco com porta redonda na frente (z+). Base no chão, 1,2 × 1,0 × 1,0.
 * - abre: 0 a 1 gira a porta. brilho: 0 a 1 acende o volante da porta no acento.
 */
export const Cofre: React.FC<{tema: Tema; pos: V3; rotY?: number; abre?: number; brilho?: number}> = ({tema, pos, rotY = 0, abre = 0, brilho = 0}) => {
  const corpo = mistura(tema.objetoEscuro, tema.objeto, 0.35);
  const porta = mistura(tema.objeto, tema.objetoClaro, 0.15);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Caixa args={[1.2, 1.0, 1.0]} raio={0.1} cor={corpo} position={[0, 0.58, 0]} />
      {[-0.45, 0.45].map((x) => [-0.36, 0.36].map((z) => <Caixa key={`${x}${z}`} args={[0.14, 0.08, 0.14]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.04, z]} />))}
      {/* porta: dobradiça à esquerda */}
      <group position={[-0.48, 0.58, 0.5]} rotation={[0, -abre * 1.9, 0]}>
        <Caixa args={[0.96, 0.82, 0.07]} raio={0.06} cor={porta} position={[0.48, 0, 0.035]} />
        <mesh position={[0.48, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} scale={[0.17, 0.04, 0.17]} geometry={G.cilindro} castShadow>
          <Fosco cor={mistura(tema.objetoEscuro, tema.acento, brilho)} emissivo={0.5 * brilho} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <Caixa key={i} args={[0.4, 0.035, 0.035]} raio={0.015} cor={mistura(tema.objetoEscuro, tema.acento, brilho)} emissivo={0.4 * brilho} sombra={false} position={[0.48, 0, 0.13]} rotation={[0, 0, (i * Math.PI) / 3]} />
        ))}
      </group>
    </group>
  );
};
