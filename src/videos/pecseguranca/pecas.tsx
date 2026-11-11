import React from 'react';
import {Boneco, Caixa, Placa, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import type {Tema} from '../../base/tema';
import {Quepe} from '../../pecas/oitohoras';

// Peças novas do 018. pec da segurança. Frente de tudo em z+. Chão em y = 0.

// ---------- O alicerce da casa (13 × 0,5 × 5), letreiro "1988" que vira "CONSTITUIÇÃO" ----------
export const ALICERCE = {larg: 13, alt: 0.5, prof: 5};
export const Alicerce: React.FC<{tema: Tema; pos: V3; sobe: number; constituicao: number; brilho?: number}> = ({tema, pos, sobe, constituicao, brilho = 0}) => {
  if (sobe < 0.02) return null;
  const {larg, alt, prof} = ALICERCE;
  const k1 = 1 - constituicao;
  const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, 0.45), tema.acento, 0.35 * brilho);
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      <Caixa args={[larg, alt, prof]} raio={0.06} cor={cor} emissivo={0.15 * brilho} position={[0, alt / 2, 0]} />
      {k1 > 0.02 ? (
        <group position={[0, alt / 2, prof / 2 + 0.01]} scale={[1, k1, 1]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={2.2} alt={0.46} linhas={[{t: '1988', tam: 160, cor: tema.objetoClaro, peso: 900}]} />
        </group>
      ) : null}
      {constituicao > 0.02 ? (
        <group position={[0, alt / 2, prof / 2 + 0.01]} scale={[1, constituicao, 1]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={4.6} alt={0.46} linhas={[{t: 'CONSTITUIÇÃO', tam: 84, cor: tema.acento, peso: 900}]} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- A casa cortada: 3 cômodos (GOVERNADOR, UNIÃO, PREFEITURA), aberta na frente ----------
// Base em y = 0 (o piso fica na altura do alicerce: passe pos com y = 0,5). 12 × 3 × 4.
// `luz` [0..1 ×3] acende o piso e a placa de cada cômodo. `portas` 0..1: o painel do meio das paredes
// internas sobe como persiana (vira passagem). `fecha` 0..1: as paredes internas engrossam um pouco.
export const CASA = {larg: 12, alt: 3, prof: 4, comodos: [-4, 0, 4] as const};
const NOMES = ['GOVERNADOR', 'UNIÃO', 'PREFEITURA'];
export const CasaSeguranca: React.FC<{tema: Tema; pos: V3; sobe: number; luz: [number, number, number]; placas: [number, number, number]; portas: number; fecha?: number}> = ({tema, pos, sobe, luz, placas, portas, fecha = 0}) => {
  if (sobe < 0.02) return null;
  const {larg, alt, prof, comodos} = CASA;
  const parede = tema.objeto;
  const piso = (i: number) => mistura(mistura(tema.objetoClaro, tema.objeto, 0.55), tema.acento, 0.55 * luz[i]);
  const esp = 0.28 + 0.08 * fecha;
  const h = alt * sobe;
  return (
    <group position={pos}>
      {/* pisos */}
      {comodos.map((x, i) => (
        <Caixa key={`p${i}`} args={[3.7, 0.08, prof - 0.1]} raio={0.02} cor={piso(i)} emissivo={0.18 * luz[i]} position={[x, 0.04, 0]} />
      ))}
      <group scale={[1, sobe, 1]}>
        {/* fundo e laterais */}
        <Caixa args={[larg, alt, 0.3]} raio={0.04} cor={parede} position={[0, alt / 2, -prof / 2 + 0.15]} />
        <Caixa args={[0.3, alt, prof]} raio={0.04} cor={parede} position={[-larg / 2 + 0.15, alt / 2, 0]} />
        <Caixa args={[0.3, alt, prof]} raio={0.04} cor={parede} position={[larg / 2 - 0.15, alt / 2, 0]} />
        {/* paredes internas: trás fixa, painel do meio que sobe (persiana), frente fixa */}
        {[-2, 2].map((x) => (
          <group key={x}>
            <Caixa args={[esp, alt, 1.6]} raio={0.04} cor={parede} position={[x, alt / 2, -prof / 2 + 0.8]} />
            <Caixa args={[esp, alt, 0.9]} raio={0.04} cor={parede} position={[x, alt / 2, prof / 2 - 0.45]} />
            {portas < 0.98 ? <Caixa args={[esp * 0.8, 2.3 * (1 - portas), 1.5]} raio={0.03} cor={mistura(parede, tema.objetoEscuro, 0.25)} position={[x, 2.3 - (2.3 * (1 - portas)) / 2 + 0.0, 0.05]} /> : null}
            <Caixa args={[esp, alt - 2.3, 1.5]} raio={0.03} cor={parede} position={[x, 2.3 + (alt - 2.3) / 2, 0.05]} />
          </group>
        ))}
        {/* beiral só atrás (deixa ver dentro de cima) */}
        <Caixa args={[larg + 0.5, 0.18, 0.8]} raio={0.04} cor={tema.objetoEscuro} position={[0, alt + 0.09, -prof / 2 + 0.25]} />
        <Caixa args={[larg + 0.5, 0.06, 0.08]} raio={0.02} cor={tema.acento} emissivo={0.25} position={[0, alt + 0.05, -prof / 2 + 0.67]} />
      </group>
      {/* placas na parede do fundo */}
      {comodos.map((x, i) =>
        placas[i] > 0.02 && h > 2.3 ? (
          <group key={`l${i}`} position={[x, 2.05, -prof / 2 + 0.31]} scale={placas[i]}>
            <Placa tema={tema} pos={[0, 0, 0]} larg={2.6} alt={0.62} linhas={[{t: NOMES[i], tam: 140, cor: luz[i] > 0.4 ? tema.texto : tema.objetoClaro, peso: 900}]} fundo={mistura(tema.objetoEscuro, tema.acento, 0.6 * luz[i])} />
          </group>
        ) : null,
      )}
    </group>
  );
};

// ---------- Armário de dados (0,7 × 1,2 × 0,4) com etiqueta DADOS ----------
export const ArmarioDados: React.FC<{tema: Tema; pos: V3; escala: number; aceso: number}> = ({tema, pos, escala, aceso}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.7, 1.2, 0.4]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} position={[0, 0.6, 0]} />
      {[0.32, 0.66, 1.0].map((y) => (
        <Caixa key={y} args={[0.6, 0.26, 0.04]} raio={0.02} cor={mistura(tema.objeto, tema.acento, aceso)} emissivo={0.3 * aceso} position={[0, y, 0.21]} />
      ))}
      <Placa tema={tema} pos={[0, 1.36, 0.0]} larg={0.66} alt={0.2} linhas={[{t: 'DADOS', tam: 200, cor: tema.objetoClaro, peso: 900, mono: true}]} fundo={tema.objetoEscuro} />
    </group>
  );

// ---------- Guarita da guarda (1,2 × 1,6 × 1,0) ----------
export const Guarita: React.FC<{tema: Tema; pos: V3; escala: number; aceso: number}> = ({tema, pos, escala, aceso}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[1.2, 1.3, 1.0]} raio={0.05} cor={mistura(tema.objeto, tema.objetoClaro, 0.3)} position={[0, 0.65, 0]} />
      <Caixa args={[0.8, 0.45, 0.03]} raio={0.01} cor={tema.ceuLuz} emissivo={0.2} position={[0, 0.85, 0.51]} />
      <Caixa args={[1.4, 0.12, 1.2]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.36, 0]} />
      <Placa tema={tema} pos={[0, 1.55, 0.2]} larg={1.1} alt={0.24} linhas={[{t: 'GUARDA', tam: 200, cor: tema.texto, peso: 900}]} fundo={mistura(tema.objetoEscuro, tema.acento, aceso)} />
    </group>
  );

// ---------- Policial (boneco com quepe) ----------
export const Policial: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cor?: string; quepe?: boolean; pose?: React.ComponentProps<typeof Boneco>['pose']}> = ({tema, pos, rotY = 0, escala, cor, quepe = true, pose}) =>
  escala < 0.02 ? null : (
    <Boneco tema={tema} pos={pos} rotY={rotY} escala={escala} cor={cor ?? tema.pessoa} pose={pose}>
      {quepe ? <Quepe tema={tema} /> : null}
    </Boneco>
  );

// ---------- Trem pequeno: locomotiva + 2 vagões, sobre trilho ao longo de x ----------
export const Trilho: React.FC<{tema: Tema; pos: V3; comp: number; k: number}> = ({tema, pos, comp, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={[k, 1, 1]}>
      {[-0.32, 0.32].map((z) => (
        <Caixa key={z} args={[comp, 0.06, 0.06]} raio={0.02} cor={tema.objeto} position={[0, 0.1, z]} />
      ))}
      {Array.from({length: Math.round(comp / 0.5)}).map((_, i) => (
        <Caixa key={i} args={[0.14, 0.05, 0.95]} raio={0.02} cor={tema.objetoEscuro} position={[-comp / 2 + 0.25 + i * 0.5, 0.04, 0]} />
      ))}
    </group>
  );
export const TremMini: React.FC<{tema: Tema; pos: V3; escala: number; aceso?: number}> = ({tema, pos, escala, aceso = 0}) => {
  if (escala < 0.02) return null;
  const corpo = mistura(tema.objeto, tema.acento, 0.6 * aceso);
  const roda = (x: number, z: number) => (
    <mesh key={`${x}${z}`} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.13, 0.08, 16]} />
      <meshStandardMaterial color={tema.objetoEscuro} roughness={0.7} />
    </mesh>
  );
  const carro = (x: number, loco: boolean) => (
    <group key={x} position={[x, 0, 0]}>
      <Caixa args={[1.15, 0.5, 0.7]} raio={0.05} cor={loco ? corpo : mistura(tema.objetoClaro, tema.objeto, 0.5)} position={[0, 0.55, 0]} />
      {loco ? <Caixa args={[0.45, 0.4, 0.66]} raio={0.04} cor={corpo} position={[-0.32, 0.98, 0]} /> : null}
      {loco ? <Caixa args={[0.3, 0.18, 0.02]} raio={0.01} cor={tema.ceuLuz} emissivo={0.3} position={[-0.32, 1.02, 0.34]} /> : null}
      {loco ? <Caixa args={[0.04, 0.12, 0.3]} raio={0.01} cor={tema.branco} emissivo={0.5} position={[0.58, 0.6, 0]} /> : null}
      {[-0.38, 0.38].map((rx) => [-0.3, 0.3].map((rz) => roda(rx, rz)))}
    </group>
  );
  return (
    <group position={pos} scale={escala}>
      {carro(0, true)}
      {carro(-1.25, false)}
      {carro(-2.5, false)}
    </group>
  );
};

// ---------- Rio: faixa de água fosca ----------
export const Rio: React.FC<{tema: Tema; pos: V3; comp: number; larg: number; k: number}> = ({tema, pos, comp, larg, k}) =>
  k < 0.02 ? null : <Caixa args={[comp * k, 0.04, larg]} raio={0.015} cor={mistura(tema.ceuLuz, tema.objetoEscuro, 0.45)} emissivo={0.08} position={[pos[0], pos[1] + 0.03, pos[2]]} sombra={false} />;

// ---------- Placar de parede: colunas SIM e NÃO (0..1 cada, altura máx 3) ----------
export const PlacarParede: React.FC<{tema: Tema; pos: V3; escala: number; sim: number; nao: number}> = ({tema, pos, escala, sim, nao}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[2.6, 3.6, 0.2]} raio={0.06} cor={tema.objetoEscuro} position={[0, 1.9, -0.25]} />
      <Caixa args={[2.6, 0.2, 0.8]} raio={0.04} cor={tema.objeto} position={[0, 0.1, 0]} />
      {sim > 0.005 ? <Caixa args={[0.8, 3 * sim, 0.5]} raio={0.04} cor={tema.acento} emissivo={0.25} position={[-0.6, 0.2 + (3 * sim) / 2, 0]} /> : null}
      {nao > 0.005 ? <Caixa args={[0.8, 3 * nao, 0.5]} raio={0.04} cor={tema.objetoClaro} position={[0.6, 0.2 + (3 * nao) / 2, 0]} /> : null}
      <Placa tema={tema} pos={[-0.6, 0.1, 0.41]} larg={0.8} alt={0.18} linhas={[{t: 'SIM', tam: 220, cor: tema.texto, peso: 900, mono: true}]} />
      <Placa tema={tema} pos={[0.6, 0.1, 0.41]} larg={0.8} alt={0.18} linhas={[{t: 'NÃO', tam: 220, cor: tema.texto, peso: 900, mono: true}]} />
    </group>
  );
};

// ---------- Cartão de texto que sai do documento (texto fixo; posição e queda vêm de fora) ----------
export const Cartao: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; linhas: string[]; risco: number}> = ({tema, pos, rot = [0, 0, 0], escala, linhas, risco}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={1.9} alt={0.7} linhas={linhas.map((t) => ({t, tam: 92, cor: tema.tinta, peso: 900}))} fundo={tema.objetoClaro} brilho={0.3} />
      {risco > 0.02 ? <Caixa args={[1.95 * risco, 0.07, 0.03]} raio={0.02} cor={tema.objetoEscuro} position={[-0.975 + 0.975 * risco, 0, 0.03]} sombra={false} /> : null}
    </group>
  );

// ---------- Mesa redonda (governadores) ----------
export const MesaRedonda: React.FC<{tema: Tema; pos: V3; raio: number; k: number}> = ({tema, pos, raio, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[raio, raio, 0.1, 48]} />
        <meshStandardMaterial color={mistura(tema.objeto, tema.objetoClaro, 0.3)} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 0.8, 24]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.8} />
      </mesh>
    </group>
  );

// ---------- Presídio de segurança máxima: muro (frente baixa), torre e pirâmide de 3 degraus ----------
// A pirâmide é o "cargo no crime": base com 5 bonecos, meio com 3, topo com 1.
export const PRESIDIO = {larg: 6.4, prof: 5.6};
export const DEGRAUS = [
  {larg: 4.4, alt: 0.4, y: 0, n: 5},
  {larg: 3.0, alt: 0.4, y: 0.4, n: 3},
  {larg: 1.4, alt: 0.4, y: 0.8, n: 1},
];
export const Presidio: React.FC<{tema: Tema; pos: V3; muro: number; piramide: number; acende: number; grades: [number, number, number]}> = ({tema, pos, muro, piramide, acende, grades}) => {
  const {larg, prof} = PRESIDIO;
  const cMuro = mistura(tema.objetoEscuro, tema.objeto, 0.3);
  return (
    <group position={pos}>
      {muro > 0.02 ? (
        <group scale={[1, muro, 1]}>
          <Caixa args={[larg, 2.4, 0.3]} raio={0.04} cor={cMuro} position={[0, 1.2, -prof / 2]} />
          <Caixa args={[0.3, 2.4, prof]} raio={0.04} cor={cMuro} position={[-larg / 2, 1.2, 0]} />
          <Caixa args={[0.3, 2.4, prof]} raio={0.04} cor={cMuro} position={[larg / 2, 1.2, 0]} />
          <Caixa args={[larg, 0.6, 0.3]} raio={0.04} cor={cMuro} position={[0, 0.3, prof / 2]} />
          {/* torre de vigia, sem luz piscando */}
          <mesh position={[larg / 2 - 0.2, 2.2, -prof / 2 + 0.2]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 4.4, 16]} />
            <meshStandardMaterial color={cMuro} roughness={0.85} />
          </mesh>
          <Caixa args={[1.1, 0.6, 1.1]} raio={0.05} cor={tema.objeto} position={[larg / 2 - 0.2, 4.6, -prof / 2 + 0.2]} />
          <Caixa args={[1.3, 0.1, 1.3]} raio={0.03} cor={tema.objetoEscuro} position={[larg / 2 - 0.2, 4.95, -prof / 2 + 0.2]} />
          <Placa tema={tema} pos={[0, 2.0, -prof / 2 + 0.16]} larg={3.6} alt={0.5} linhas={[{t: 'SEGURANÇA MÁXIMA', tam: 100, cor: tema.objetoClaro, peso: 900}]} />
        </group>
      ) : null}
      {piramide > 0.02
        ? DEGRAUS.map((d, i) => {
            const k = Math.max(0, Math.min(1, piramide * 3 - i));
            if (k < 0.02) return null;
            const aceso = Math.max(0, Math.min(1, acende * 3 - i));
            const cor = mistura(tema.objeto, tema.acento, 0.5 * aceso);
            return (
              <group key={i} position={[0, d.y, -0.3]} scale={[1, k, 1]}>
                <Caixa args={[d.larg, d.alt, 1.6 - i * 0.3]} raio={0.04} cor={cor} emissivo={0.15 * aceso} position={[0, d.alt / 2, 0]} />
                {Array.from({length: d.n}).map((_, j) => (
                  <Boneco key={j} tema={tema} pos={[-(d.n - 1) * 0.42 + j * 0.84, d.alt, 0.1]} escala={0.42 * k} cor={tema.objetoEscuro} />
                ))}
                {grades[i] > 0.02 ? <Grades3 tema={tema} pos={[0, d.alt, 0.75 - i * 0.15]} larg={d.larg} alt={1.0} desce={grades[i]} grossa={i} /> : null}
              </group>
            );
          })
        : null}
    </group>
  );
};
// grades com espessura por degrau (mais grossas no topo)
const Grades3: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; desce: number; grossa: number}> = ({tema, pos, larg, alt, desce, grossa}) => {
  const n = Math.max(3, Math.round(larg / 0.32));
  const h = alt * desce;
  const r = 0.025 + 0.012 * grossa;
  return (
    <group position={pos}>
      {Array.from({length: n + 1}).map((_, i) => (
        <mesh key={i} position={[-larg / 2 + (i * larg) / n, alt - h / 2, 0]} castShadow>
          <cylinderGeometry args={[r, r, h, 8]} />
          <meshStandardMaterial color={tema.objeto} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      <Caixa args={[larg + 0.08, 0.07, 0.07]} raio={0.02} cor={tema.objeto} position={[0, alt, 0]} />
    </group>
  );
};

// ---------- Cela pequena (1,6 × 2 × 1,4), frente de grades ----------
export const Cela: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={[1, k, 1]}>
      <Caixa args={[1.8, 0.1, 1.5]} raio={0.03} cor={tema.objeto} position={[0, 0.05, 0]} />
      <Caixa args={[1.8, 2.0, 0.12]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[0, 1.0, -0.7]} />
      <Caixa args={[0.12, 2.0, 1.5]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[-0.9, 1.0, 0]} />
      <Caixa args={[0.12, 2.0, 1.5]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[0.9, 1.0, 0]} />
      <Caixa args={[1.8, 0.12, 1.5]} raio={0.03} cor={tema.objetoEscuro} position={[0, 2.06, 0]} />
      <Grades3 tema={tema} pos={[0, 0.06, 0.72]} larg={1.7} alt={1.94} desce={1} grossa={1} />
    </group>
  );

// ---------- O livro gigante da Constituição, de pé, com uma porta na capa ----------
// `abre` 0..1 gira a porta (dobradiça à esquerda). Atrás dela: a placa "LEI NOVA" com contorno tracejado.
// `itens` 0..2 e `titulo` 0..1 desenham o que está escrito na placa.
export const LivroPorta: React.FC<{tema: Tema; pos: V3; escala: number; abre: number; itens: number; titulo: number}> = ({tema, pos, escala, abre, itens, titulo}) => {
  if (escala < 0.02) return null;
  const capa = mistura(tema.objetoEscuro, tema.tinta, 0.15);
  const PW = 1.1;
  const PH = 1.8;
  return (
    <group position={pos} scale={escala}>
      {/* miolo e capa de trás */}
      <Caixa args={[2.6, 3.4, 0.5]} raio={0.06} cor={tema.objetoClaro} position={[0, 1.7, -0.05]} />
      <Caixa args={[2.7, 3.5, 0.08]} raio={0.04} cor={capa} position={[0, 1.75, -0.32]} />
      {/* capa da frente com o vão da porta */}
      <Caixa args={[2.7, 3.5 - PH - 0.25, 0.08]} raio={0.03} cor={capa} position={[0, 0.25 + PH + (3.5 - PH - 0.25) / 2, 0.23]} />
      <Caixa args={[(2.7 - PW) / 2, PH + 0.25, 0.08]} raio={0.03} cor={capa} position={[-(PW / 2 + (2.7 - PW) / 4), (PH + 0.25) / 2, 0.23]} />
      <Caixa args={[(2.7 - PW) / 2, PH + 0.25, 0.08]} raio={0.03} cor={capa} position={[PW / 2 + (2.7 - PW) / 4, (PH + 0.25) / 2, 0.23]} />
      <Placa tema={tema} pos={[0, 2.85, 0.28]} larg={2.3} alt={0.5} linhas={[{t: 'CONSTITUIÇÃO', tam: 120, cor: tema.acento, peso: 900}]} />
      {/* o que tem atrás da porta: a placa vazia, tracejada */}
      <group position={[0, 0.25 + PH / 2, 0.21]}>
        <Caixa args={[PW - 0.04, PH - 0.04, 0.02]} raio={0.01} cor={mistura(tema.objetoEscuro, tema.fundo, 0.4)} position={[0, 0, 0]} sombra={false} />
        {Array.from({length: 7}).map((_, i) => (
          <React.Fragment key={i}>
            <Caixa args={[0.08, 0.02, 0.01]} raio={0.004} cor={tema.objetoClaro} position={[-0.42 + i * 0.14, PH / 2 - 0.12, 0.02]} sombra={false} />
            <Caixa args={[0.08, 0.02, 0.01]} raio={0.004} cor={tema.objetoClaro} position={[-0.42 + i * 0.14, -PH / 2 + 0.12, 0.02]} sombra={false} />
          </React.Fragment>
        ))}
        {titulo > 0.02 ? (
          <group position={[0, 0.55, 0.02]} scale={titulo}>
            <Placa tema={tema} pos={[0, 0, 0]} larg={0.95} alt={0.3} linhas={[{t: 'LEI NOVA', tam: 170, cor: tema.acento, peso: 900}]} />
          </group>
        ) : null}
        {[0, 1].map((i) =>
          itens > i + 0.02 ? (
            <group key={i} position={[0, 0.05 - i * 0.4, 0.02]} scale={Math.min(1, itens - i)}>
              <Placa tema={tema} pos={[0, 0, 0]} larg={0.9} alt={0.24} linhas={[{t: i === 0 ? 'PENA MAIS DURA' : 'PERDA DE BENS', tam: 110, cor: tema.textoSuave, peso: 800, mono: true}]} />
              {Array.from({length: 5}).map((_, j) => (
                <Caixa key={j} args={[0.1, 0.015, 0.01]} raio={0.004} cor={tema.textoSuave} position={[-0.36 + j * 0.18, -0.16, 0.01]} sombra={false} />
              ))}
            </group>
          ) : null,
        )}
      </group>
      {/* a porta, com dobradiça à esquerda */}
      <group position={[-PW / 2, 0.25 + PH / 2, 0.25]} rotation={[0, -1.9 * abre, 0]}>
        <Caixa args={[PW, PH, 0.07]} raio={0.03} cor={mistura(capa, tema.objeto, 0.25)} position={[PW / 2, 0, 0]} />
        <mesh position={[PW - 0.16, 0, 0.06]}>
          <sphereGeometry args={[0.06, 16, 12]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Andar em obra (em cima da casa): pilares, vigas, tábuas, cones e tijolos, com placa ----------
export const AndarObra: React.FC<{tema: Tema; pos: V3; sobe: number; placa: number; material: number}> = ({tema, pos, sobe, placa, material}) => {
  if (sobe < 0.02) return null;
  const xs = [-5.6, -2, 2, 5.6];
  const zs = [-1.6, 1.4];
  const h = 2.4 * sobe;
  const pilar = mistura(tema.objeto, tema.objetoClaro, 0.2);
  return (
    <group position={pos}>
      {xs.map((x) => zs.map((z) => <Caixa key={`${x}${z}`} args={[0.22, h, 0.22]} raio={0.03} cor={pilar} position={[x, h / 2, z]} />))}
      {sobe > 0.95
        ? zs.map((z) => <Caixa key={`v${z}`} args={[11.6, 0.2, 0.22]} raio={0.03} cor={pilar} position={[0, h, z]} />)
        : null}
      {material > 0.02 ? (
        <group scale={material}>
          {[0, 1, 2].map((i) => (
            <Caixa key={`t${i}`} args={[2.2, 0.08, 0.3]} raio={0.02} cor={tema.areia} position={[-3.6, 0.06 + i * 0.09, 0.4 + (i % 2) * 0.05]} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Caixa key={`b${i}`} args={[0.36, 0.2, 0.18]} raio={0.02} cor={mistura(tema.areia, tema.objetoEscuro, 0.35)} position={[3.2 + (i % 3) * 0.38, 0.1 + Math.floor(i / 3) * 0.21, 0.5]} />
          ))}
          {[-1.2, 0.6].map((x) => (
            <mesh key={`c${x}`} position={[x, 0.3, 1.2]} castShadow>
              <coneGeometry args={[0.18, 0.6, 16]} />
              <meshStandardMaterial color={mistura(tema.areia, tema.acento, 0.15)} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ) : null}
      {placa > 0.02 ? (
        <group position={[0, h + 0.75, 1.4]} scale={placa}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={5.4} alt={1.0} linhas={[{t: 'MINISTÉRIO DA', tam: 120, cor: tema.objetoClaro, peso: 900}, {t: 'SEGURANÇA PÚBLICA', tam: 120, cor: tema.acento, peso: 900}]} fundo={tema.objetoEscuro} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Prédio pequeno com letreiro curto (CNJ, CNMP) ----------
export const PredioSigla: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; sigla: string}> = ({tema, pos, sobe, aceso, sigla}) =>
  sobe < 0.02 ? null : (
    <group position={pos} scale={[1, sobe, 1]}>
      <Caixa args={[1.8, 2.2, 1.4]} raio={0.05} cor={mistura(tema.objeto, tema.objetoClaro, 0.2)} position={[0, 1.1, 0]} />
      {[-0.55, 0, 0.55].map((x) => (
        <Caixa key={x} args={[0.16, 1.5, 0.16]} raio={0.03} cor={tema.objetoClaro} position={[x, 0.85, 0.76]} />
      ))}
      <Caixa args={[2.0, 0.16, 1.6]} raio={0.03} cor={tema.objetoEscuro} position={[0, 2.28, 0]} />
      <Placa tema={tema} pos={[0, 1.85, 0.72]} larg={1.5} alt={0.4} linhas={[{t: sigla, tam: 260, cor: tema.texto, peso: 900}]} fundo={mistura(tema.objetoEscuro, tema.acento, aceso)} />
    </group>
  );

// ---------- Árvore simples (tronco + copa) e tora cortada ----------
export const Arvore: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 0.9, 10]} />
        <meshStandardMaterial color={mistura(tema.areia, tema.objetoEscuro, 0.5)} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.5, 18, 14]} />
        <meshStandardMaterial color={mistura(tema.acento, tema.objetoEscuro, 0.45)} roughness={0.9} />
      </mesh>
    </group>
  );
export const Tora: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.0, 12]} />
        <meshStandardMaterial color={mistura(tema.areia, tema.objetoEscuro, 0.5)} roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.1, 0.1]} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.2, 10]} />
        <meshStandardMaterial color={mistura(tema.areia, tema.objetoEscuro, 0.5)} roughness={0.9} />
      </mesh>
    </group>
  );
