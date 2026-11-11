import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {ESCURO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças do 017. orçamento de itabuna. A base veio do 014 (mesma série: maquete redonda, prédios de cada área,
// pilhas de dinheiro de R$ 10 milhões, relatórios, régua do limite e copos dos pisos), com a maquete de Itabuna
// (o rio Cachoeira no lugar do mar) e as peças novas no fim do arquivo.

/** Cores de apoio do vídeo, todas tiradas do tema. */
export const coresOI = (tema: Tema) => {
  const F = tema.festa ?? ESCURO.festa!;
  return {
    ouro: F.dourado,
    alerta: mistura(F.rosa, tema.objetoEscuro, 0.45),
    agua: mistura(F.azulNoite, F.azul, 0.3),
    grama: mistura(F.verde, tema.objetoEscuro, 0.4),
    areia: mistura(tema.areia, tema.objetoEscuro, 0.4),
    madeira: mistura(tema.objetoEscuro, tema.areia, 0.25),
    liquido: mistura(F.azul, tema.ceuLuz, 0.35),
  };
};

// ---------- Mesa redonda da maquete ----------
/** Mesa de 9 m de raio: tampo de madeira, chão de areia, manchas de grama e o rio Cachoeira ao fundo. */
export const MesaMaquete: React.FC<{tema: Tema; rio?: boolean}> = ({tema, rio = true}) => {
  const C = coresOI(tema);
  return (
    <group>
      <mesh position={[0, -0.36, 0]} receiveShadow>
        <cylinderGeometry args={[9.4, 9.2, 0.8, 96]} />
        <Fosco cor={C.madeira} aspereza={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[9.0, 9.0, 0.02, 96]} />
        <Fosco cor={C.areia} aspereza={0.95} />
      </mesh>
      {(
        [
          [-6.2, -4.6, 2.2],
          [6.6, 3.8, 1.6],
          [-6.8, 3.4, 1.4],
          [0.6, -7.2, 1.3],
          [-2.6, 7.4, 1.1],
        ] as [number, number, number][]
      ).map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.075, z]} receiveShadow>
          <cylinderGeometry args={[r, r, 0.02, 40]} />
          <Fosco cor={C.grama} aspereza={0.95} />
        </mesh>
      ))}
      {/* o rio Cachoeira: faixa curva que atravessa o fundo da mesa, de margem a margem */}
      {(rio ? Array.from({length: 26}) : []).map((_, i) => {
        const a = -1 + (2 * i) / 25;
        const x = a * 8.2;
        const z = -6.6 + 0.9 * Math.sin(a * 2.2) - 0.5 * (1 - a * a);
        const dz = 0.9 * 2.2 * Math.cos(a * 2.2) / 8.2 + (a * 1.0) / 8.2;
        const r = Math.hypot(x, z);
        if (r > 8.95) return null;
        return (
          <mesh key={i} position={[x, 0.09, z]} rotation={[0, -Math.atan(dz), 0]} receiveShadow>
            <boxGeometry args={[0.72, 0.02, 1.25]} />
            <Fosco cor={C.agua} aspereza={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Ponte baixa genérica ----------
export const PonteMini: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
    <Caixa args={[4.2, 0.12, 0.6]} raio={0.03} cor={tema.objeto} position={[0, 0.55, 0]} />
    {[-1.5, -0.5, 0.5, 1.5].map((x) => (
      <Caixa key={x} args={[0.16, 0.55, 0.5]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.27, 0]} />
    ))}
    {[-1, 1].map((l) => (
      <Caixa key={l} args={[4.2, 0.12, 0.04]} raio={0.015} cor={tema.objetoClaro} position={[0, 0.7, 0.28 * l]} sombra={false} />
    ))}
  </group>
);

// ---------- Prédios das áreas ----------
const Letreiro: React.FC<{tema: Tema; texto: string; pos: V3; larg: number; aceso: number; tam?: number}> = ({tema, texto, pos, larg, aceso, tam = 200}) => (
  <Placa tema={tema} pos={pos} larg={larg} alt={larg * 0.24} linhas={[{t: texto, tam, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
);

/** Prédio que sobe do chão (sobe 0 a 1). Some abaixo de 0,02. */
const Sobe: React.FC<{pos: V3; sobe: number; alt: number; rotY?: number; escala?: number; children: React.ReactNode}> = ({pos, sobe, alt, rotY = 0, escala = 1, children}) =>
  sobe < 0.02 ? null : (
    <group position={[pos[0], pos[1] - alt * escala * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {children}
    </group>
  );

/** Posto de saúde: prédio claro com faixa e letreiro SAÚDE (sem cruz). 2,8 × 1,6 × 1,8. */
export const PostoSaude: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.0} rotY={rotY} escala={escala}>
    <Caixa args={[2.8, 1.6, 1.8]} raio={0.05} cor={mistura(tema.branco, tema.objeto, 0.35)} position={[0, 0.8, 0]} />
    <Caixa args={[2.9, 0.12, 1.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.66, 0]} />
    <Caixa args={[2.82, 0.14, 0.02]} raio={0.005} cor={mistura(tema.objeto, tema.acento, 0.5 * aceso)} emissivo={0.25 * aceso} position={[0, 0.5, 0.91]} sombra={false} />
    {[-0.95, 0.95].map((x) => (
      <Caixa key={x} args={[0.5, 0.42, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.3)} emissivo={0.15} position={[x, 0.95, 0.91]} sombra={false} />
    ))}
    <Caixa args={[0.6, 0.9, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.45, 0.91]} sombra={false} />
    <Letreiro tema={tema} texto="SAÚDE" pos={[0, 1.3, 0.925]} larg={1.3} aceso={aceso} />
  </Sobe>
);

/** Escola: prédio com telhado, janelas e letreiro EDUCAÇÃO. 3,0 × 1,5 × 1,8. */
export const Escola: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.2} rotY={rotY} escala={escala}>
    <Caixa args={[3.0, 1.5, 1.8]} raio={0.05} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[0, 0.75, 0]} />
    <mesh position={[0, 1.78, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 1.65, 1.0]} castShadow>
      <cylinderGeometry args={[1, 1, 1.95, 3]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    {[-1.15, -0.6, 0.6, 1.15].map((x) => (
      <Caixa key={x} args={[0.36, 0.4, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.3)} emissivo={0.12 + 0.2 * aceso} position={[x, 0.65, 0.91]} sombra={false} />
    ))}
    <Caixa args={[0.55, 0.85, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.43, 0.91]} sombra={false} />
    <Letreiro tema={tema} texto="EDUCAÇÃO" pos={[0, 1.2, 0.925]} larg={1.5} aceso={aceso} tam={150} />
  </Sobe>
);

/** Prefeitura: corpo com colunas e letreiro PREFEITURA. 3,0 × 1,8 × 1,8. */
export const Prefeitura: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.6} rotY={rotY} escala={escala}>
    <Caixa args={[3.2, 0.16, 2.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.08, 0.1]} />
    <Caixa args={[2.9, 1.7, 1.5]} raio={0.05} cor={tema.objeto} position={[0, 1.0, -0.15]} />
    {[-1.2, -0.72, -0.24, 0.24, 0.72, 1.2].map((x) => (
      <mesh key={x} position={[x, 0.95, 0.78]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.6, 16]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    ))}
    <Caixa args={[3.1, 0.16, 1.9]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.83, 0]} />
    <Letreiro tema={tema} texto="PREFEITURA" pos={[0, 1.5, 0.9]} larg={1.7} aceso={aceso} tam={140} />
  </Sobe>
);

/** Estação de saneamento: caixa-d'água, dois tanques redondos e canos. */
export const EstacaoSaneamento: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => {
  const C = coresOI(tema);
  const cano = mistura(tema.objeto, tema.acento, 0.6 * aceso);
  return (
    <Sobe pos={pos} sobe={sobe} alt={3.2} rotY={rotY} escala={escala}>
      {/* caixa-d'água alta */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => <Caixa key={`${x}${z}`} args={[0.1, 2.0, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[-1.1 + 0.32 * x, 1.0, -0.4 + 0.32 * z]} />),
      )}
      <mesh position={[-1.1, 2.35, -0.4]} castShadow>
        <cylinderGeometry args={[0.55, 0.5, 0.75, 28]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
      {/* tanques */}
      {[
        [0.4, 0.4],
        [1.4, -0.4],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />
            <Fosco cor={tema.objeto} />
          </mesh>
          <mesh position={[0, 0.61, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.02, 32]} />
            <Fosco cor={C.agua} emissivo={0.1 + 0.2 * aceso} />
          </mesh>
        </group>
      ))}
      {/* canos */}
      <mesh position={[-0.35, 0.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.4, 14]} />
        <Fosco cor={cano} emissivo={0.25 * aceso} />
      </mesh>
      <mesh position={[0.9, 0.18, 0]} rotation={[0.6, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.2, 14]} />
        <Fosco cor={cano} emissivo={0.25 * aceso} />
      </mesh>
    </Sobe>
  );
};

/** Guarita da guarda municipal com letreiro GUARDA (frente z+). */
export const PostoGuarda: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.4} rotY={rotY} escala={escala}>
    <Caixa args={[1.8, 1.5, 1.4]} raio={0.05} cor={mistura(tema.objeto, tema.festa?.azul ?? tema.objeto, 0.25)} position={[0, 0.75, 0]} />
    <Caixa args={[2.0, 0.14, 1.6]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.57, 0]} />
    <Caixa args={[1.1, 0.5, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.3)} emissivo={0.15} position={[0, 0.85, 0.71]} sombra={false} />
    <Letreiro tema={tema} texto="GUARDA" pos={[0, 1.3, 0.72]} larg={1.2} aceso={aceso} />
  </Sobe>
);

/** Câmara de vereadores: prédio de colunas com letreiro CÂMARA na altura da parede. */
export const CamaraVereadores: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.8} rotY={rotY} escala={escala}>
    <Caixa args={[3.0, 0.2, 2.0]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
    <Caixa args={[2.6, 1.5, 1.3]} raio={0.05} cor={tema.branco} position={[0, 0.95, -0.2]} />
    {[-1.05, -0.63, -0.21, 0.21, 0.63, 1.05].map((x) => (
      <mesh key={x} position={[x, 0.95, 0.72]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 1.5, 16]} />
        <Fosco cor={mistura(tema.branco, tema.objeto, 0.3)} />
      </mesh>
    ))}
    <Caixa args={[3.0, 0.18, 1.9]} raio={0.03} cor={mistura(tema.branco, tema.objeto, 0.3)} position={[0, 1.79, 0]} />
    <mesh position={[0, 2.08, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.22, 1.5, 0.95]} castShadow>
      <cylinderGeometry args={[1, 1, 1.9, 3]} />
      <Fosco cor={mistura(tema.branco, tema.objeto, 0.3)} />
    </mesh>
    <Letreiro tema={tema} texto="CÂMARA" pos={[0, 1.3, 0.46]} larg={1.4} aceso={aceso} />
  </Sobe>
);

/** Tribunal de contas: prédio de colunas largo, letreiro TCM. */
export const PredioTCM: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; escala?: number}> = ({tema, pos, sobe, aceso, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={3.2} escala={escala}>
    <Caixa args={[4.2, 0.24, 2.4]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.12, 0]} />
    <Caixa args={[3.6, 2.0, 1.4]} raio={0.05} cor={tema.objeto} position={[0, 1.2, -0.3]} />
    {[-1.6, -0.96, -0.32, 0.32, 0.96, 1.6].map((x) => (
      <mesh key={x} position={[x, 1.2, 0.75]} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 2.0, 16]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    ))}
    <Caixa args={[4.2, 0.22, 2.2]} raio={0.04} cor={tema.objetoClaro} position={[0, 2.31, 0]} />
    <mesh position={[0, 2.66, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.3, 2.1, 1.1]} castShadow>
      <cylinderGeometry args={[1, 1, 2.0, 3]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
    <Letreiro tema={tema} texto="TCM" pos={[0, 1.75, 0.41]} larg={1.3} aceso={aceso} tam={240} />
  </Sobe>
);

// ---------- Pilhas de dinheiro ----------
export const MOEDAS_POR_PILHA = 10;
export const R_PILHA = 0.17;
const PASSO_MOEDA = 0.06;
const G_MOEDA = new THREE.CylinderGeometry(R_PILHA, R_PILHA, PASSO_MOEDA * 0.86, 28);
const dummy = new THREE.Object3D();
const cor = new THREE.Color();

/** Uma pilha: base no chão em `p`; `n` de 0 a 1 é a fração da pilha cheia (10 moedas). */
export type Pilha = {p: V3; n: number; cor: string};

/**
 * Muitas pilhas numa malha só. `max` é a capacidade em moedas (fixa, para não recriar a malha).
 * `opacidade` < 1 deixa todas transparentes (os "fantasmas" de 2024).
 */
export const PilhasDinheiro: React.FC<{pilhas: Pilha[]; max?: number; opacidade?: number; escala?: number; largura?: number}> = ({pilhas, max = 1200, opacidade = 1, escala = 1, largura = 1}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    let i = 0;
    for (let a = 0; a < pilhas.length && i < max; a++) {
      const pl = pilhas[a];
      const moedas = pl.n * MOEDAS_POR_PILHA;
      const total = Math.ceil(moedas - 1e-6);
      for (let k = 0; k < total && i < max; k++) {
        const parcial = Math.min(1, moedas - k);
        dummy.position.set(pl.p[0] + Math.sin(k * 1.7 + a) * 0.008, pl.p[1] + 0.065 + PASSO_MOEDA * 0.43 + k * PASSO_MOEDA, pl.p[2] + Math.cos(k * 2.3 + a) * 0.008);
        dummy.rotation.set(0, k * 0.6, 0);
        dummy.scale.set(Math.max(0.001, parcial) * largura, 1, Math.max(0.001, parcial) * largura);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        cor.set(pl.cor);
        m.setColorAt(i, cor);
        i++;
      }
    }
    m.count = i;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <group scale={escala}>
      <instancedMesh ref={ref} args={[G_MOEDA, undefined, max]} castShadow={opacidade > 0.9} receiveShadow frustumCulled={false}>
        <meshStandardMaterial roughness={0.5} metalness={0.1} transparent={opacidade < 1} opacity={opacidade} depthWrite={opacidade >= 1} />
      </instancedMesh>
    </group>
  );
};

/** Posições em grade (centro em `c`), `cols` colunas, passo 0,4 m, a partir da frente. */
export const grade = (c: V3, n: number, cols: number, passo = 0.4): V3[] => {
  const linhas = Math.ceil(n / cols);
  return Array.from({length: n}).map((_, i) => {
    const col = i % cols;
    const lin = Math.floor(i / cols);
    return [c[0] + (col - (cols - 1) / 2) * passo, c[1], c[2] + ((linhas - 1) / 2 - lin) * passo] as V3;
  });
};

// ---------- Relatório (caderno grosso deitado) ----------
/** Caderno de relatório deitado, capa para cima (y+), com o título. 0,9 × 0,12 × 1,2. `abre` gira a capa. */
export const RelatorioPDF: React.FC<{tema: Tema; pos: V3; rotY?: number; titulo: string; sub: string; escala?: number; aceso?: number; abre?: number}> = ({tema, pos, rotY = 0, titulo, sub, escala = 1, aceso = 0, abre = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.9, 0.1, 1.2]} raio={0.02} cor={tema.branco} position={[0, 0.05, 0]} />
      {/* folhas de dentro: linhas */}
      {abre > 0.02
        ? [0, 1, 2, 3, 4, 5].map((i) => <Caixa key={i} args={[0.6, 0.004, 0.035]} raio={0.0015} cor={tema.objeto} sombra={false} position={[0, 0.104, -0.4 + i * 0.16]} />)
        : null}
      {/* capa, presa na borda da esquerda */}
      <group position={[-0.45, 0.11, 0]} rotation={[0, 0, Math.PI * 0.95 * abre]}>
        <Caixa args={[0.92, 0.02, 1.22]} raio={0.008} cor={mistura(tema.objetoEscuro, tema.acento, 0.35 * aceso)} emissivo={0.15 * aceso} position={[0.46, 0, 0]} />
        <Placa tema={tema} pos={[0.46, 0.012, 0]} rot={[-Math.PI / 2, 0, 0]} larg={0.8} alt={1.0} linhas={[{t: titulo, tam: 190, cor: tema.objetoClaro, peso: 900}, {t: sub, tam: 96, cor: tema.objetoClaro, peso: 700, mono: true}, {t: 'PREFEITURA', tam: 70, cor: tema.textoSuave, peso: 700}, {t: 'DE ITABUNA', tam: 70, cor: tema.textoSuave, peso: 700}]} />
      </group>
    </group>
  );

// ---------- Régua do limite de pessoal ----------
/** Escala da régua: 0% no chão, 60% no topo (5 m). */
export const REGUA_ALT = 5;
export const REGUA_MAX = 60;
export const yRegua = (pct: number) => (pct / REGUA_MAX) * REGUA_ALT;

/** Coluna de vidro com líquido (nivel em %) e as três faixas da lei (48,6 / 51,3 / 54). `prudencial` acende a faixa de cima. */
export const ReguaLimite: React.FC<{tema: Tema; pos: V3; sobe: number; nivel: number; prudencial: number; maximo: number}> = ({tema, pos, sobe, nivel, prudencial, maximo}) => {
  if (sobe < 0.02) return null;
  const C = coresOI(tema);
  const yN = yRegua(nivel);
  const faixa = (de: number, ate: number, cor: string, op: number, em = 0) => (
    <mesh position={[0, (yRegua(de) + yRegua(ate)) / 2, 0]}>
      <cylinderGeometry args={[0.6, 0.6, yRegua(ate) - yRegua(de), 40, 1, true]} />
      <Fosco cor={cor} opacidade={op} emissivo={em} dupla />
    </mesh>
  );
  return (
    <group position={[pos[0], pos[1] - (REGUA_ALT + 0.6) * (1 - sobe), pos[2]]}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.0, 0.2, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {/* líquido */}
      {yN > 0.01 ? (
        <mesh position={[0, 0.2 + yN / 2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, yN, 40]} />
          <Fosco cor={tema.acento} emissivo={0.25} />
        </mesh>
      ) : null}
      <group position={[0, 0.2, 0]}>
        {/* vidro */}
        <mesh position={[0, REGUA_ALT / 2, 0]}>
          <cylinderGeometry args={[0.58, 0.58, REGUA_ALT, 40, 1, true]} />
          <Fosco cor={tema.ceuLuz} opacidade={0.14} dupla />
        </mesh>
        {faixa(48.6, 51.3, tema.objetoClaro, 0.1)}
        {faixa(51.3, 54, mistura(tema.objetoClaro, C.alerta, prudencial), 0.12 + 0.4 * prudencial, 0.2 * prudencial)}
        {/* riscos */}
        {[48.6, 51.3, 54].map((v) => (
          <group key={v} position={[0, yRegua(v), 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.6, v === 54 ? 0.035 : 0.022, 8, 48]} />
              <Fosco cor={v === 54 ? mistura(tema.objetoClaro, C.alerta, maximo) : tema.objetoClaro} emissivo={0.2} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, REGUA_ALT + 0.05, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.1, 40]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Placa do "proíbe" ----------
/** Placa em pé num poste com o texto; o X (marsala) carimba com `x` de 0 a 1. */
export const PlacaProibido: React.FC<{tema: Tema; pos: V3; texto: string; escala: number; x: number; rotY?: number}> = ({tema, pos, texto, escala, x, rotY = 0}) => {
  if (escala < 0.02) return null;
  const C = coresOI(tema);
  const kx = Math.min(1, x);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.1, 1.2, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.6, 0]} />
      <Caixa args={[1.7, 0.75, 0.08]} raio={0.04} cor={tema.objetoClaro} position={[0, 1.5, 0]} />
      <Placa tema={tema} pos={[0, 1.5, 0.045]} larg={1.6} alt={0.7} linhas={[{t: texto, tam: texto.length > 8 ? 130 : 170, cor: tema.tinta, peso: 900}]} />
      {kx > 0.02
        ? [-1, 1].map((l) => (
            <Caixa key={l} args={[1.75 * kx, 0.12, 0.03]} raio={0.02} cor={C.alerta} emissivo={0.2} sombra={false} position={[0, 1.5, 0.07]} rotation={[0, 0, 0.42 * l]} scale={[1, 1, 1]} />
          ))
        : null}
    </group>
  );
};

// ---------- Copo do piso ----------
/** Escala do copo: 0% no fundo, 30% no topo (2,6 m). */
export const COPO_ALT = 2.6;
export const yCopo = (pct: number) => (pct / 30) * COPO_ALT;

/** Copo de vidro com o risco do piso e o líquido que sobe (nivel em %). `falta` pinta de marsala o espaço até o risco. */
export const CopoPiso: React.FC<{tema: Tema; pos: V3; sobe: number; piso: number; risco: number; nivel: number; falta?: number; acima?: number}> = ({tema, pos, sobe, piso, risco, nivel, falta = 0, acima = 0}) => {
  if (sobe < 0.02) return null;
  const C = coresOI(tema);
  const yN = yCopo(nivel);
  const yP = yCopo(piso);
  return (
    <group position={[pos[0], pos[1] - (COPO_ALT + 0.4) * (1 - sobe), pos[2]]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.16, 40]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <group position={[0, 0.16, 0]}>
        {yN > 0.01 ? (
          <mesh position={[0, yN / 2, 0]}>
            <cylinderGeometry args={[0.52, 0.52, yN, 40]} />
            <Fosco cor={mistura(C.liquido, tema.acento, acima)} emissivo={0.15 + 0.15 * acima} />
          </mesh>
        ) : null}
        {falta > 0.02 && yP > yN ? (
          <mesh position={[0, (yN + yP) / 2, 0]}>
            <cylinderGeometry args={[0.53, 0.53, yP - yN, 40]} />
            <Fosco cor={C.alerta} opacidade={0.55 * falta} emissivo={0.2 * falta} />
          </mesh>
        ) : null}
        <mesh position={[0, COPO_ALT / 2, 0]}>
          <cylinderGeometry args={[0.6, 0.56, COPO_ALT, 40, 1, true]} />
          <Fosco cor={tema.ceuLuz} opacidade={0.16} dupla />
        </mesh>
        <group position={[0, yP, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.6, 0.03, 8, 48]} />
            <Fosco cor={mistura(tema.objeto, tema.objetoClaro, risco)} emissivo={0.3 * risco} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ======================= Peças novas do 017 =======================

/** Rua da cidade: asfalto, calçada, dois postes (luz de 0 a 1), um gari com carrinho e um caminhão de lixo. Comprida em x (4,6 m). */
export const RuaServicos: React.FC<{tema: Tema; pos: V3; sobe: number; luz: number; caminhaoX: number; gariX: number; rotY?: number}> = ({tema, pos, sobe, luz, caminhaoX, gariX, rotY = 0}) => {
  if (sobe < 0.02) return null;
  const C = coresOI(tema);
  const lampada = mistura(tema.objetoClaro, tema.festa?.dourado ?? tema.objetoClaro, luz);
  return (
    <group position={[pos[0], pos[1] - 0.5 * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]}>
      <Caixa args={[4.8, 0.04, 1.0]} raio={0.015} cor={tema.objetoEscuro} position={[0, 0.1, 0]} sombra={false} />
      {[-1.6, -0.6, 0.4, 1.4].map((x) => (
        <Caixa key={x} args={[0.45, 0.01, 0.06]} raio={0.004} cor={tema.objetoClaro} position={[x, 0.125, 0]} sombra={false} />
      ))}
      <Caixa args={[4.8, 0.08, 0.35]} raio={0.02} cor={mistura(tema.objeto, tema.areia, 0.3)} position={[0, 0.12, -0.68]} />
      {/* postes */}
      {[-1.5, 1.2].map((x) => (
        <group key={x} position={[x, 0, -0.72]}>
          <Caixa args={[0.06, 1.5, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.9, 0]} />
          <Caixa args={[0.4, 0.05, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0.17, 1.64, 0]} />
          <Caixa args={[0.18, 0.08, 0.12]} raio={0.03} cor={lampada} emissivo={0.6 * luz} position={[0.34, 1.6, 0]} sombra={false} />
          {luz > 0.05 ? (
            <mesh position={[0.34, 0.85, 0]}>
              <cylinderGeometry args={[0.05, 0.42, 1.5, 20, 1, true]} />
              <Fosco cor={lampada} opacidade={0.1 * luz} emissivo={0.3 * luz} dupla />
            </mesh>
          ) : null}
        </group>
      ))}
      {/* gari com carrinho */}
      <group position={[gariX, 0.16, -0.62]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.3, 4, 12]} />
          <Fosco cor={mistura(mistura(tema.festa?.dourado ?? tema.objeto, tema.festa?.rosa ?? tema.objeto, 0.45), tema.objetoEscuro, 0.2)} />
        </mesh>
        <mesh position={[0, 0.62, 0]} castShadow>
          <sphereGeometry args={[0.08, 14, 10]} />
          <Fosco cor={tema.pessoa} />
        </mesh>
        <Caixa args={[0.3, 0.26, 0.24]} raio={0.03} cor={C.grama} position={[0.32, 0.18, 0]} />
      </group>
      {/* caminhão de lixo pequeno */}
      <group position={[caminhaoX, 0.12, 0.18]}>
        <Caixa args={[0.5, 0.42, 0.5]} raio={0.05} cor={tema.objetoClaro} position={[0.55, 0.3, 0]} />
        <Caixa args={[0.4, 0.2, 0.46]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.35)} emissivo={0.1} position={[0.6, 0.4, 0]} sombra={false} />
        <Caixa args={[0.95, 0.55, 0.52]} raio={0.06} cor={mistura(tema.festa?.verde ?? tema.objeto, tema.objetoEscuro, 0.3)} position={[-0.25, 0.35, 0]} />
        {[-0.5, 0, 0.55].map((x) =>
          [-1, 1].map((l) => (
            <mesh key={`${x}${l}`} position={[x, 0.07, 0.26 * l]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
};

/** Prédio baixo da assistência social, com banco na frente. */
export const PredioAssistencia: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={1.9} rotY={rotY} escala={escala}>
    <Caixa args={[2.6, 1.3, 1.6]} raio={0.05} cor={mistura(tema.objeto, tema.festa?.rosa ?? tema.objeto, 0.18)} position={[0, 0.65, 0]} />
    <Caixa args={[2.8, 0.12, 1.8]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.36, 0]} />
    {[-0.85, 0.85].map((x) => (
      <Caixa key={x} args={[0.5, 0.36, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.3)} emissivo={0.12 + 0.2 * aceso} position={[x, 0.6, 0.81]} sombra={false} />
    ))}
    <Caixa args={[0.5, 0.8, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.4, 0.81]} sombra={false} />
    <Letreiro tema={tema} texto="ASSISTÊNCIA" pos={[0, 1.08, 0.825]} larg={1.9} aceso={aceso} tam={120} />
    <Caixa args={[0.9, 0.06, 0.25]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.areia, 0.3)} position={[0.9, 0.3, 1.25]} />
  </Sobe>
);

/** Teatro pequeno: fachada com arco e letreiro CULTURA. */
export const TeatroMini: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number; texto?: string}> = ({tema, pos, sobe, aceso, rotY, escala, texto = 'CULTURA'}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.4} rotY={rotY} escala={escala}>
    <Caixa args={[2.4, 1.8, 1.6]} raio={0.05} cor={mistura(tema.objeto, tema.festa?.roxo ?? tema.objeto, 0.25)} position={[0, 0.9, 0]} />
    <mesh position={[0, 0.55, 0.79]} castShadow>
      <cylinderGeometry args={[0.42, 0.42, 0.04, 24, 1, false, -Math.PI / 2, Math.PI]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <group position={[0, 0.55, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.03, 24, 1, false, 0, Math.PI]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
    <Caixa args={[0.84, 0.55, 0.03]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.28, 0.8]} sombra={false} />
    <Caixa args={[2.6, 0.16, 1.8]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.88, 0]} />
    <Letreiro tema={tema} texto={texto} pos={[0, 1.45, 0.815]} larg={1.5} aceso={aceso} tam={170} />
  </Sobe>
);

/** Galpão da defesa civil com porta de enrolar e uma viatura genérica (sem marca). */
export const BaseDefesaCivil: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => {
  const laranja = mistura(mistura(tema.festa?.dourado ?? tema.objeto, tema.festa?.rosa ?? tema.objeto, 0.45), tema.objetoEscuro, 0.35);
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.2} rotY={rotY} escala={escala}>
      <Caixa args={[2.6, 1.4, 1.8]} raio={0.05} cor={tema.objeto} position={[0, 0.7, 0]} />
      <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]} castShadow>
        <cylinderGeometry args={[1.3, 1.3, 1.8, 24, 1, false, -Math.PI / 2, Math.PI]} />
        <Fosco cor={mistura(tema.objeto, tema.objetoEscuro, 0.4)} />
      </mesh>
      <Caixa args={[1.3, 0.9, 0.03]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[-0.4, 0.45, 0.91]} sombra={false} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Caixa key={i} args={[1.26, 0.015, 0.01]} raio={0.004} cor={tema.objetoEscuro} position={[-0.4, 0.12 + i * 0.17, 0.93]} sombra={false} />
      ))}
      <Letreiro tema={tema} texto="DEFESA CIVIL" pos={[0.1, 1.15, 0.925]} larg={2.0} aceso={aceso} tam={115} />
      {/* viatura */}
      <group position={[0.85, 0, 1.35]} rotation={[0, -0.3, 0]}>
        <Caixa args={[0.95, 0.32, 0.5]} raio={0.06} cor={laranja} position={[0, 0.26, 0]} />
        <Caixa args={[0.55, 0.24, 0.46]} raio={0.05} cor={mistura(tema.objetoEscuro, tema.ceuLuz, 0.35)} emissivo={0.1} position={[-0.05, 0.52, 0]} />
        {[-0.3, 0.3].map((x) =>
          [-1, 1].map((l) => (
            <mesh key={`${x}${l}`} position={[x, 0.1, 0.25 * l]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.07, 16]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
          )),
        )}
      </group>
    </Sobe>
  );
};

/** Prédio do pagamento da dívida: colunas, frontão e letreiro DÍVIDA (sem nome de banco). */
export const BancoDivida: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; rotY?: number; escala?: number}> = ({tema, pos, sobe, aceso, rotY, escala}) => (
  <Sobe pos={pos} sobe={sobe} alt={2.6} rotY={rotY} escala={escala}>
    <Caixa args={[2.6, 0.18, 1.8]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.09, 0]} />
    <Caixa args={[2.2, 1.4, 1.2]} raio={0.05} cor={mistura(tema.objeto, tema.objetoEscuro, 0.25)} position={[0, 0.88, -0.2]} />
    {[-0.9, -0.45, 0, 0.45, 0.9].map((x) => (
      <mesh key={x} position={[x, 0.85, 0.62]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 1.35, 14]} />
        <Fosco cor={tema.objetoClaro} />
      </mesh>
    ))}
    <Caixa args={[2.6, 0.16, 1.6]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.62, 0]} />
    <mesh position={[0, 1.88, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.22, 1.3, 0.8]} castShadow>
      <cylinderGeometry args={[1, 1, 1.6, 3]} />
      <Fosco cor={tema.objetoClaro} />
    </mesh>
    <Letreiro tema={tema} texto="DÍVIDA" pos={[0, 1.25, 0.415]} larg={1.3} aceso={aceso} tam={190} />
  </Sobe>
);

/** Caixote do precatório do Fundef: tampa que abre (0 a 1), carimbos (0 a 1) e pilhas dentro (desenhadas fora). 2,2 × 0,9 × 1,6. */
export const CaixaFundef: React.FC<{tema: Tema; pos: V3; escala: number; tampa: number; carimbo1: number; carimbo2: number}> = ({tema, pos, escala, tampa, carimbo1, carimbo2}) => {
  if (escala < 0.02) return null;
  const C = coresOI(tema);
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.25);
  const ripa = mistura(tema.areia, tema.objetoEscuro, 0.45);
  return (
    <group position={pos} scale={escala}>
      {/* fundo e quatro paredes (aberta em cima) */}
      <Caixa args={[2.2, 0.08, 1.6]} raio={0.02} cor={ripa} position={[0, 0.04, 0]} />
      <Caixa args={[2.2, 0.8, 0.08]} raio={0.02} cor={madeira} position={[0, 0.44, 0.76]} />
      <Caixa args={[2.2, 0.8, 0.08]} raio={0.02} cor={madeira} position={[0, 0.44, -0.76]} />
      <Caixa args={[0.08, 0.8, 1.6]} raio={0.02} cor={madeira} position={[-1.06, 0.44, 0]} />
      <Caixa args={[0.08, 0.8, 1.6]} raio={0.02} cor={madeira} position={[1.06, 0.44, 0]} />
      {[0.22, 0.62].map((y) => (
        <Caixa key={y} args={[2.24, 0.06, 0.02]} raio={0.008} cor={ripa} position={[0, y, 0.81]} sombra={false} />
      ))}
      {carimbo1 > 0.02 ? (
        <Placa tema={tema} pos={[0, 0.44, 0.805]} larg={1.7} alt={0.5} linhas={[{t: 'FUNDEF', tam: 300, cor: mistura(madeira, C.alerta, Math.min(1, carimbo1)), peso: 900}]} />
      ) : null}
      {/* tampa presa atrás, abre para trás */}
      <group position={[0, 0.86, -0.78]} rotation={[-1.9 * tampa, 0, 0]}>
        <Caixa args={[2.24, 0.08, 1.62]} raio={0.02} cor={madeira} position={[0, 0, 0.8]} />
        {carimbo2 > 0.02 ? (
          <Placa tema={tema} pos={[0, 0.045, 0.8]} rot={[-Math.PI / 2, 0, 0]} larg={2.0} alt={1.0} linhas={[{t: 'SÓ PARA', tam: 210, cor: mistura(madeira, C.alerta, Math.min(1, carimbo2)), peso: 900}, {t: 'O ENSINO', tam: 210, cor: mistura(madeira, C.alerta, Math.min(1, carimbo2)), peso: 900}]} />
        ) : null}
      </group>
    </group>
  );
};

/** Prancheta em pé com a lista e o número. */
export const ListaHabilitados: React.FC<{tema: Tema; pos: V3; escala: number; numero: string; rotY?: number}> = ({tema, pos, escala, numero, rotY = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.08, 0.9, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.45, -0.1]} />
      <Caixa args={[1.0, 1.3, 0.06]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.areia, 0.3)} position={[0, 1.45, 0]} />
      <Caixa args={[0.88, 1.15, 0.02]} raio={0.008} cor={tema.branco} position={[0, 1.42, 0.04]} sombra={false} />
      <Placa tema={tema} pos={[0, 1.42, 0.055]} larg={0.82} alt={1.08} linhas={[{t: 'HABILITADOS', tam: 100, cor: tema.tinta, peso: 900}, {t: '———', tam: 90, cor: tema.textoSuave, peso: 700}, {t: '———', tam: 90, cor: tema.textoSuave, peso: 700}, {t: numero, tam: 230, cor: tema.tinta, peso: 900}]} />
    </group>
  );
