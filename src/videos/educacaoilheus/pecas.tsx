import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {coresOI} from '../orcamentoilheus/pecas';

// Peças novas do 029. educação em ilhéus. As da maquete (mesa, escola, prefeitura, TCM, pilhas,
// relatórios e copos) vêm do 014 (src/videos/orcamentoilheus/pecas.tsx).

/** Carimbo de parecer: chapinha inclinada com borda e texto (ex.: "TCM: REJEIÇÃO"). `k` 0 a 1 desce e assenta. */
export const CarimboParecer: React.FC<{tema: Tema; pos: V3; linhas: string[]; tipo: 'rejeita' | 'aprova'; k: number; rotY?: number; escala?: number}> = ({tema, pos, linhas, tipo, k, rotY = 0, escala = 1}) => {
  if (k < 0.02) return null;
  const C = coresOI(tema);
  const cor = tipo === 'rejeita' ? C.alerta : tema.objetoClaro;
  const desce = 0.9 * (1 - Math.min(1, k));
  const s = escala * (0.85 + 0.15 * Math.min(1, k));
  return (
    <group position={[pos[0], pos[1] + desce, pos[2]]} rotation={[0, rotY, -0.12]} scale={s}>
      <Caixa args={[1.2, 0.5, 0.05]} raio={0.04} cor={cor} position={[0, 0, 0]} />
      <Caixa args={[1.08, 0.38, 0.02]} raio={0.03} cor={tema.fundo} position={[0, 0, 0.03]} sombra={false} />
      <Placa tema={tema} pos={[0, 0, 0.045]} larg={1.04} alt={0.36} linhas={linhas.map((t, i) => ({t, tam: linhas.length > 1 ? (i === 0 ? 150 : 120) : 170, cor: tipo === 'rejeita' ? mistura(C.alerta, tema.texto, 0.25) : tema.texto, peso: 900, mono: true}))} brilho={0.35} />
    </group>
  );
};

/** Placa em pé num poste (frente z+), com o nome da fonte (SIOPE, BALANÇO, PLANILHA, RELATÓRIO). */
export const PlacaFonte3D: React.FC<{tema: Tema; pos: V3; texto: string; sub?: string; k: number; aceso?: number; rotY?: number}> = ({tema, pos, texto, sub, k, aceso = 0, rotY = 0}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={Math.min(1.15, k)}>
      <Caixa args={[0.08, 0.9, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.45, 0]} />
      <Caixa args={[1.25, 0.5, 0.06]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.acento, 0.35 * aceso)} position={[0, 1.1, 0]} />
      <Placa tema={tema} pos={[0, 1.1, 0.035]} larg={1.15} alt={0.44} linhas={sub ? [{t: texto, tam: 170, cor: tema.objetoClaro, peso: 900}, {t: sub, tam: 90, cor: tema.textoSuave, peso: 700, mono: true}] : [{t: texto, tam: 190, cor: tema.objetoClaro, peso: 900}]} brilho={0.25 + 0.4 * aceso} />
    </group>
  );
};

/** Pilha de caixas de merenda com etiqueta MERENDA (frente z+). */
export const CaixasMerenda: React.FC<{tema: Tema; pos: V3; k: number; rotY?: number}> = ({tema, pos, k, rotY = 0}) => {
  if (k < 0.02) return null;
  const C = coresOI(tema);
  const papelao = mistura(C.areia, tema.objetoClaro, 0.25);
  const CX: [number, number, number, number][] = [
    [-0.42, 0, 0, 0.05],
    [0.42, 0, 0.05, -0.06],
    [0, 0, -0.55, 0.1],
    [-0.2, 1, 0, -0.08],
    [0.25, 1, -0.2, 0.12],
    [0.02, 2, -0.08, 0.02],
  ];
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={Math.min(1, k)}>
      {CX.map(([x, nivel, z, r], i) => (
        <group key={i} position={[x, 0.24 + nivel * 0.48, z]} rotation={[0, r, 0]}>
          <Caixa args={[0.8, 0.46, 0.55]} raio={0.03} cor={papelao} />
          <Caixa args={[0.82, 0.06, 0.08]} raio={0.02} cor={mistura(papelao, tema.objetoEscuro, 0.35)} position={[0, 0.2, 0]} sombra={false} />
          {nivel === 0 && i < 2 ? <Placa tema={tema} pos={[0, -0.02, 0.285]} larg={0.66} alt={0.2} linhas={[{t: 'MERENDA', tam: 170, cor: tema.tinta, peso: 900}]} /> : null}
        </group>
      ))}
    </group>
  );
};

/** Barra dos meses de 2026 (12 blocos; os de janeiro a `meses` acesos). Frente z+. */
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
export const BarraMeses: React.FC<{tema: Tema; pos: V3; k: number; meses: number; dez?: number; rotY?: number}> = ({tema, pos, k, meses, dez = 0, rotY = 0}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={Math.min(1, k)}>
      {MESES.map((m, i) => {
        const aceso = Math.max(0, Math.min(1, meses - i));
        const ultimo = i === 11 ? dez : 0;
        return (
          <group key={m} position={[-1.65 + i * 0.3, 0, 0]}>
            <Caixa args={[0.27, 0.27, 0.05]} raio={0.02} cor={mistura(mistura(tema.objeto, tema.objetoClaro, aceso), tema.acento, ultimo)} emissivo={0.15 * aceso + 0.3 * ultimo} position={[0, 0, 0]} />
            <Placa tema={tema} pos={[0, 0, 0.03]} larg={0.26} alt={0.16} linhas={[{t: m, tam: 300, cor: tema.tinta, peso: 900}]} />
          </group>
        );
      })}
    </group>
  );
};

/** Livrinho da Constituição em pé, aberto, com a página "EC 119/2022". */
export const LivroEmenda: React.FC<{tema: Tema; pos: V3; k: number; rotY?: number}> = ({tema, pos, k, rotY = 0}) => {
  if (k < 0.02) return null;
  const abre = Math.min(1, k);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={0.9 * abre}>
      {[-1, 1].map((l) => (
        <group key={l} rotation={[0, -l * 0.35 * abre, 0]}>
          <Caixa args={[0.62, 0.84, 0.05]} raio={0.02} cor={tema.objetoEscuro} position={[0.31 * l, 0.42, -0.02]} />
          <Caixa args={[0.56, 0.78, 0.02]} raio={0.008} cor={tema.branco} position={[0.3 * l, 0.42, 0.015]} sombra={false} />
        </group>
      ))}
      <group rotation={[0, 0.35 * abre, 0]}>
        <Placa tema={tema} pos={[-0.3, 0.52, 0.03]} larg={0.5} alt={0.4} linhas={[{t: 'EC', tam: 260, cor: tema.tinta, peso: 900}, {t: '119/2022', tam: 150, cor: tema.tinta, peso: 800, mono: true}]} />
      </group>
      <group rotation={[0, -0.35 * abre, 0]}>
        <Placa tema={tema} pos={[0.3, 0.52, 0.03]} larg={0.5} alt={0.4} linhas={[{t: 'PANDEMIA', tam: 150, cor: tema.tinta, peso: 900}]} />
      </group>
    </group>
  );
};
