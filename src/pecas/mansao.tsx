import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../base/pecas';
import {ESCURO, type Festa, type Tema} from '../base/tema';
import {mistura} from './bets';

// Peças da mansão e da festa: a mansão aberta (casa de bonecas cortada) no palco giratório,
// as bonecas loiras da festa, o cabelo lambido, o globo espelhado, o celular-caixa-preta, a igreja, a cela,
// o prédio de TV, os fios coloridos, a barra da pena e o envelope. Formas simples, foscas, sem logo e sem rosto.
// Texturas só com texto fixo (nunca mudam por quadro).

export const festa = (tema: Tema): Festa => tema.festa ?? ESCURO.festa!;

// ---------- Medidas da casa ----------
export const CASA = {meia: 7, fundo: -5, laje: 0.25};
// Base de cada andar (y do piso) e altura livre
export const ANDAR = {cela: 0, banco: 3.6, escritorio: 7.2, festa: 10.8, teto: 15.2};
export const ALT_ANDAR = {cela: 3.6, banco: 3.6, escritorio: 3.6, festa: 4.4};

// ---------- Palco giratório ----------
export const PalcoGiratorio: React.FC<{tema: Tema; raio: number; aro: number}> = ({tema, raio, aro}) => {
  const F = festa(tema);
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[raio, raio + 0.2, 0.24, 96]} />
        <meshStandardMaterial color={mistura(tema.chao, tema.objetoEscuro, 0.45)} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[raio - 0.35, raio - 0.1, 128]} />
        <meshStandardMaterial color={F.dourado} emissive={F.dourado} emissiveIntensity={0.25 + 0.6 * aro} />
      </mesh>
      {/* Marcas de giro no aro (mostram que o palco roda) */}
      {Array.from({length: 24}).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <Caixa key={i} args={[0.5, 0.03, 0.08]} raio={0.01} cor={mistura(tema.objetoEscuro, F.dourado, 0.5)} sombra={false} position={[Math.sin(a) * (raio - 0.75), 0.02, Math.cos(a) * (raio - 0.75)]} rotation={[0, a, 0]} />;
      })}
    </group>
  );
};

// ---------- A mansão cortada (frente aberta para +z) ----------
// `luz` de cada andar 0..1: o andar em foco fica aceso e os outros mais escuros.
export const CasaCorte: React.FC<{tema: Tema; luz: {cela: number; banco: number; escritorio: number; festa: number}; sobe?: number}> = ({tema, luz, sobe = 1}) => {
  const F = festa(tema);
  const {meia, fundo, laje} = CASA;
  const prof = -fundo;
  const andares: {nome: keyof typeof luz; y: number; h: number; cor: string}[] = [
    {nome: 'cela', y: ANDAR.cela, h: ALT_ANDAR.cela, cor: F.roxoEscuro},
    {nome: 'banco', y: ANDAR.banco, h: ALT_ANDAR.banco, cor: F.verde},
    {nome: 'escritorio', y: ANDAR.escritorio, h: ALT_ANDAR.escritorio, cor: F.azul},
    {nome: 'festa', y: ANDAR.festa, h: ALT_ANDAR.festa, cor: F.rosa},
  ];
  return (
    <group scale={[1, sobe, 1]}>
      {andares.map((a) => {
        const l = luz[a.nome];
        const parede = mistura(mistura(tema.fundo, a.cor, 0.42), a.cor, 0.35 * l);
        return (
          <group key={a.nome}>
            {/* Piso */}
            <Caixa args={[meia * 2, laje, prof]} raio={0.04} cor={mistura(tema.objetoEscuro, a.cor, 0.12)} position={[0, a.y + laje / 2, fundo / 2]} />
            {/* Parede do fundo e laterais na cor do andar */}
            <Caixa args={[meia * 2, a.h, 0.3]} raio={0.03} cor={parede} emissivo={0.06 + 0.22 * l} position={[0, a.y + a.h / 2, fundo + 0.15]} />
            {[-1, 1].map((s) => (
              <Caixa key={s} args={[0.3, a.h, prof]} raio={0.03} cor={mistura(parede, tema.fundo, 0.25)} emissivo={0.04 + 0.12 * l} position={[s * (meia - 0.15), a.y + a.h / 2, fundo / 2]} />
            ))}
            {/* Fita de luz na borda da laje (neon do andar) */}
            <Caixa args={[meia * 2, 0.08, 0.06]} raio={0.02} cor={a.cor} emissivo={0.5 + 1.2 * l} sombra={false} position={[0, a.y + laje + 0.02, 0.02]} />
            {/* Rodapé de luz no teto do andar */}
            <Caixa args={[meia * 2 - 0.8, 0.05, 0.05]} raio={0.02} cor={a.cor} emissivo={0.3 + 0.9 * l} sombra={false} position={[0, a.y + a.h - 0.15, fundo + 0.35]} />
          </group>
        );
      })}
      {/* Laje da cobertura */}
      <Caixa args={[meia * 2 + 0.4, laje + 0.1, prof + 0.4]} raio={0.06} cor={mistura(tema.objetoEscuro, F.azulNoite, 0.4)} position={[0, ANDAR.teto + laje / 2, fundo / 2]} />
      <Caixa args={[meia * 2 + 0.4, 0.08, 0.06]} raio={0.02} cor={F.dourado} emissivo={0.8} sombra={false} position={[0, ANDAR.teto + laje + 0.06, 0.22]} />
      {/* Colunas da frente nos cantos */}
      {[-1, 1].map((s) => (
        <Caixa key={s} args={[0.4, ANDAR.teto, 0.4]} raio={0.06} cor={mistura(tema.branco, tema.objeto, 0.2)} position={[s * (meia + 0.05), ANDAR.teto / 2, -0.1]} />
      ))}
    </group>
  );
};

// ---------- Heliponto na cobertura ----------
export const HeliCobertura: React.FC<{tema: Tema; pos: V3; luz: number}> = ({tema, pos, luz}) => {
  const F = festa(tema);
  return (
    <group position={pos}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.85, 64]} />
        <meshStandardMaterial color={F.loiro} emissive={F.loiro} emissiveIntensity={0.2 + 0.8 * luz} />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <Caixa key={x} args={[0.18, 0.02, 1.4]} raio={0.01} cor={F.loiro} emissivo={0.2 + 0.6 * luz} sombra={false} position={[x, 0.02, 0]} />
      ))}
      <Caixa args={[0.9, 0.02, 0.18]} raio={0.01} cor={F.loiro} emissivo={0.2 + 0.6 * luz} sombra={false} position={[0, 0.02, 0]} />
    </group>
  );
};

// ---------- Boneca da festa: cabelo longo loiro e vestido ----------
const G_VESTIDO = new THREE.CylinderGeometry(0.11, 0.3, 0.78, 20);
const G_TRONCO = new THREE.CapsuleGeometry(0.15, 0.26, 6, 14);
const G_CABECA = new THREE.SphereGeometry(0.15, 20, 16);
const G_PERNA = new THREE.CapsuleGeometry(0.05, 0.4, 4, 8);
const G_BRACO = new THREE.CapsuleGeometry(0.042, 0.42, 4, 8);
const G_TOPO = new THREE.SphereGeometry(0.168, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62);
const G_MECHA = new THREE.CapsuleGeometry(0.13, 0.42, 6, 14);
export const Boneca: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; vestido: string; danca?: number; t?: number; fase?: number; braco?: number}> = ({
  tema,
  pos,
  rotY = 0,
  escala = 1,
  vestido,
  danca = 0,
  t = 0,
  fase = 0,
  braco = 0,
}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const ginga = danca * Math.sin(t * 3.2 + fase);
  const pele = F.pele;
  const sobeBraco = 0.4 + 1.6 * braco + 0.5 * danca * (0.5 + 0.5 * Math.sin(t * 3.2 + fase + 1));
  return (
    <group position={pos} rotation={[0, rotY + 0.18 * ginga, 0]} scale={escala}>
      {/* Pernas */}
      {[-0.07, 0.07].map((x) => (
        <mesh key={x} geometry={G_PERNA} position={[x, 0.26, 0]}>
          <Fosco cor={pele} />
        </mesh>
      ))}
      <group rotation={[0, 0, 0.07 * ginga]} position={[0, 0.5, 0]}>
        {/* Vestido (saia rodada) e tronco */}
        <mesh geometry={G_VESTIDO} position={[0, 0.2, 0]} castShadow>
          <Fosco cor={vestido} emissivo={0.12} />
        </mesh>
        <mesh geometry={G_TRONCO} position={[0, 0.72, 0]} scale={[1, 1, 0.75]}>
          <Fosco cor={vestido} emissivo={0.12} />
        </mesh>
        {/* Braços (sobem quando dança) */}
        {[-1, 1].map((l) => (
          <group key={l} position={[0.19 * l, 0.86, 0]} rotation={[0, 0, l * sobeBraco * (l > 0 ? 1 : 0.8)]}>
            <mesh geometry={G_BRACO} position={[0, -0.24, 0]}>
              <Fosco cor={pele} />
            </mesh>
          </group>
        ))}
        {/* Cabeça (sem rosto) */}
        <mesh geometry={G_CABECA} position={[0, 1.16, 0]}>
          <Fosco cor={pele} />
        </mesh>
        {/* Cabelo longo loiro: topo da cabeça + mecha que cai pelas costas até o meio */}
        <mesh geometry={G_TOPO} position={[0, 1.17, -0.01]} rotation={[-0.35, 0, 0]}>
          <meshStandardMaterial color={F.loiro} roughness={0.45} emissive={F.loiro} emissiveIntensity={0.12} />
        </mesh>
        <mesh geometry={G_MECHA} position={[0, 0.92, -0.09]} scale={[1.18, 1, 0.62]} rotation={[0.08 + 0.05 * ginga, 0, 0]}>
          <meshStandardMaterial color={F.loiro} roughness={0.45} emissive={F.loiro} emissiveIntensity={0.12} />
        </mesh>
        {[-1, 1].map((l) => (
          <mesh key={l} geometry={G_MECHA} position={[0.12 * l, 0.98, 0.0]} scale={[0.42, 0.78, 0.42]}>
            <meshStandardMaterial color={F.loiro} roughness={0.45} emissive={F.loiro} emissiveIntensity={0.12} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------- Cabelo lambido para trás (vai como filho do Boneco da base: cabeça em y 1,84) ----------
export const CabeloLambido: React.FC<{tema: Tema; brilho?: number}> = ({tema, brilho = 0}) => {
  const cor = mistura(tema.fundo, tema.areia, 0.1);
  return (
    <group position={[0, 1.84, 0]}>
      {/* Casco liso e brilhante, rente à cabeça, puxado para trás */}
      <mesh rotation={[-0.55, 0, 0]} scale={[0.95, 1.08, 1.02]} castShadow>
        <sphereGeometry args={[0.172, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <meshStandardMaterial color={cor} roughness={0.22} metalness={0.15} emissive={cor} emissiveIntensity={0.05 * brilho} />
      </mesh>
      {/* Linhas do pente (da testa até a nuca) */}
      {[-0.07, -0.025, 0.025, 0.07].map((x) => (
        <mesh key={x} position={[x, 0.005, -0.01]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.178, 0.0055, 6, 24, Math.PI * 0.62]} />
          <meshStandardMaterial color={mistura(cor, tema.objetoClaro, 0.35)} roughness={0.2} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Globo espelhado (gira devagar) ----------
const G_GLOBO = new THREE.IcosahedronGeometry(0.55, 2);
export const GloboEspelhado: React.FC<{tema: Tema; pos: V3; gira: number; k: number}> = ({tema, pos, gira, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.0, 6]} />
        <meshStandardMaterial color={tema.objeto} />
      </mesh>
      <mesh geometry={G_GLOBO} rotation={[0.2, gira, 0]}>
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.12} metalness={0.95} flatShading emissive={tema.objeto} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );

// ---------- Torre de taças (pirâmide) ----------
export const TorreTacas: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  const F = festa(tema);
  const tacas: V3[] = [];
  [3, 2, 1].forEach((n, nivel) => {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tacas.push([(i - (n - 1) / 2) * 0.22, nivel * 0.26, (j - (n - 1) / 2) * 0.22]);
  });
  return (
    <group position={pos} scale={k}>
      <Caixa args={[1.0, 0.7, 0.8]} raio={0.06} cor={mistura(tema.objetoEscuro, F.dourado, 0.25)} position={[0, 0.35, 0]} />
      {tacas.map((p, i) => (
        <group key={i} position={[p[0], 0.7 + p[1], p[2]]} scale={0.36}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.42, 6]} />
            <meshStandardMaterial color={tema.objetoClaro} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.15, 0.06, 0.36, 14]} />
            <meshStandardMaterial color={F.dourado} emissive={F.dourado} emissiveIntensity={0.35} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- Balão de festa ----------
export const BalaoFesta: React.FC<{pos: V3; cor: string; k: number}> = ({pos, cor, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh scale={[1, 1.2, 1]}>
        <sphereGeometry args={[0.22, 18, 14]} />
        <meshStandardMaterial color={cor} roughness={0.3} emissive={cor} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />
        <meshBasicMaterial color={cor} />
      </mesh>
    </group>
  );

// ---------- Celular gigante (a caixa-preta) ----------
// `baloes` 0..1 mostra as mensagens borradas (barras sem texto); `tarja` 0..1: a faixa SIGILO cai.
export const CelularGigante: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; tela: number; baloes: number; tarja: number; vaza?: number}> = ({
  tema,
  pos,
  rot = [0, 0, 0],
  escala,
  tela,
  baloes,
  tarja,
  vaza = 0,
}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const telaCor = mistura(tema.fundo, F.azulNoite, 0.3 + 0.7 * tela);
  const msgs = [
    {y: 0.85, w: 0.75, l: -1},
    {y: 0.55, w: 0.55, l: 1},
    {y: 0.25, w: 0.85, l: -1},
    {y: -0.05, w: 0.6, l: 1},
    {y: -0.35, w: 0.7, l: -1},
    {y: -0.65, w: 0.5, l: 1},
  ];
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* Corpo preto */}
      <Caixa args={[1.3, 2.6, 0.14]} raio={0.16} cor={mistura(tema.fundo, tema.objetoEscuro, 0.3)} />
      {/* Moldura colorida (caixa-preta "laranja" das investigações vira o tom de alerta) */}
      <Caixa args={[1.34, 2.64, 0.1]} raio={0.17} cor={mistura(tema.objetoEscuro, F.dourado, 0.5 * tela)} emissivo={0.2 * tela} position={[0, 0, -0.03]} sombra={false} />
      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[1.14, 2.36]} />
        <meshStandardMaterial color={telaCor} emissive={F.azulNoite} emissiveIntensity={0.6 * tela} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
      {/* Mensagens borradas */}
      {msgs.map((m, i) => {
        const k = Math.max(0, Math.min(1, baloes * msgs.length - i));
        if (k < 0.02) return null;
        const cor = m.l > 0 ? mistura(F.verde, tema.objetoClaro, 0.25) : mistura(tema.objeto, tema.objetoEscuro, 0.2);
        const solta = Math.max(0, Math.min(1, vaza * 2 - i * 0.25));
        return (
          <group key={i} position={[m.l * (0.52 - m.w / 2) + solta * 2.2 * m.l, m.y + solta * 0.6, 0.08 + solta * 0.6]} scale={[k, k, k]}>
            <Caixa args={[m.w, 0.2, 0.02]} raio={0.08} cor={cor} emissivo={0.35} sombra={false} />
            {/* "texto" borrado: traços que não se leem */}
            {[0, 1].map((j) => (
              <Caixa key={j} args={[m.w * (0.7 - j * 0.25), 0.03, 0.025]} raio={0.012} cor={mistura(cor, tema.fundo, 0.35)} sombra={false} position={[-m.w * 0.05, 0.035 - j * 0.07, 0.006]} />
            ))}
          </group>
        );
      })}
      {/* Câmera e alto-falante */}
      <Caixa args={[0.3, 0.05, 0.02]} raio={0.02} cor={tema.objetoEscuro} sombra={false} position={[0, 1.18, 0.075]} />
      {/* Tarja SIGILO (cai quando a caixa-preta abre) */}
      {tarja < 0.98 ? (
        <group position={[0, -0.1 - 2.2 * tarja, 0.12 + 0.3 * tarja]} rotation={[0, 0, -0.35 - 0.9 * tarja]}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={1.9} alt={0.36} linhas={[{t: 'SIGILO', tam: 200, cor: tema.texto, peso: 900}]} fundo={tema.acento} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Igreja genérica (sem nome) ----------
export const Igreja: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; aceso: number}> = ({tema, pos, rotY = 0, escala, aceso}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const cor = mistura(tema.branco, tema.objeto, 0.35 + 0.4 * aceso);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.8, 1.4, 2.6]} raio={0.05} cor={cor} position={[0, 0.7, 0]} />
      {/* Telhado em duas águas */}
      <mesh position={[0, 1.72, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.08, 1, 0.6]} castShadow>
        <cylinderGeometry args={[1.0, 1.0, 2.7, 3]} />
        <Fosco cor={mistura(tema.objetoEscuro, F.dourado, 0.2)} />
      </mesh>
      {/* Torre */}
      <Caixa args={[0.8, 2.8, 0.8]} raio={0.05} cor={cor} position={[0, 1.4, 1.55]} />
      <mesh position={[0, 3.1, 1.55]} castShadow>
        <coneGeometry args={[0.6, 0.9, 4]} />
        <Fosco cor={mistura(tema.objetoEscuro, F.dourado, 0.2)} />
      </mesh>
      <Caixa args={[0.06, 0.5, 0.06]} raio={0.01} cor={F.dourado} emissivo={0.3 + 0.6 * aceso} position={[0, 3.75, 1.55]} />
      <Caixa args={[0.3, 0.06, 0.06]} raio={0.01} cor={F.dourado} emissivo={0.3 + 0.6 * aceso} position={[0, 3.85, 1.55]} />
      {/* Porta em arco e rosácea */}
      <mesh position={[0, 0.5, 1.985]}>
        <circleGeometry args={[0.24, 24, 0, Math.PI]} />
        <meshStandardMaterial color={mistura(tema.fundo, F.dourado, 0.6 * aceso)} emissive={F.dourado} emissiveIntensity={0.5 * aceso} />
      </mesh>
      <Caixa args={[0.48, 0.5, 0.02]} raio={0.01} cor={mistura(tema.fundo, F.dourado, 0.6 * aceso)} emissivo={0.4 * aceso} sombra={false} position={[0, 0.25, 1.96]} />
      <mesh position={[0, 2.0, 1.985]}>
        <circleGeometry args={[0.2, 24]} />
        <meshStandardMaterial color={mistura(tema.fundo, F.roxo, 0.5 + 0.5 * aceso)} emissive={F.roxo} emissiveIntensity={0.3 + 0.7 * aceso} />
      </mesh>
    </group>
  );
};

// ---------- Grades da cela (descem do teto do andar de baixo) ----------
export const Grades: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; desce: number}> = ({tema, pos, larg, alt, desce}) => {
  if (desce < 0.02) return null;
  const n = Math.round(larg / 0.4);
  const h = alt * desce;
  return (
    <group position={pos}>
      {Array.from({length: n + 1}).map((_, i) => (
        <mesh key={i} position={[-larg / 2 + (i * larg) / n, alt - h / 2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, h, 10]} />
          <meshStandardMaterial color={tema.objeto} roughness={0.35} metalness={0.6} />
        </mesh>
      ))}
      {[0.15, 0.85].map((f) => (f * alt > alt - h ? <Caixa key={f} args={[larg + 0.1, 0.08, 0.08]} raio={0.02} cor={tema.objeto} position={[0, f * alt, 0]} /> : null))}
    </group>
  );
};

// ---------- Prédio de TV (antena, letreiro escrito) ----------
export const PredioTV: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; aceso: number; letreiro: string}> = ({tema, pos, rotY = 0, escala, aceso, letreiro}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[2.4, 2.6, 1.8]} raio={0.08} cor={mistura(tema.branco, F.azul, 0.25)} position={[0, 1.3, 0]} />
      {Array.from({length: 3}).map((_, j) => (
        <Caixa key={j} args={[2.0, 0.22, 0.03]} raio={0.02} cor={mistura(tema.objetoEscuro, F.turquesa, 0.3 + 0.5 * aceso)} emissivo={0.2 + 0.5 * aceso} sombra={false} position={[0, 0.7 + j * 0.6, 0.91]} />
      ))}
      <Placa tema={tema} pos={[0, 2.85, 0.4]} larg={1.9} alt={0.42} linhas={[{t: letreiro, tam: 220, cor: aceso > 0.5 ? tema.texto : tema.objetoClaro, peso: 900}]} fundo={mistura(tema.objetoEscuro, F.azul, 0.3 + 0.6 * aceso)} />
      {/* Torre da antena */}
      <mesh position={[0.6, 3.6, -0.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.12, 2.0, 8]} />
        <meshStandardMaterial color={tema.objeto} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.6, 4.65, -0.3]}>
        <sphereGeometry args={[0.1, 14, 10]} />
        <meshStandardMaterial color={F.turquesa} emissive={F.turquesa} emissiveIntensity={0.4 + 1.2 * aceso} />
      </mesh>
      <mesh position={[0.6, 4.0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 6, 24]} />
        <meshStandardMaterial color={tema.objeto} />
      </mesh>
    </group>
  );
};

// ---------- Fio colorido (arco entre dois pontos, acende do início ao fim) ----------
export const Fio: React.FC<{a: V3; b: V3; k: number; cor: string; altura?: number; n?: number}> = ({a, b, k, cor, altura = 2, n = 26}) => {
  if (k < 0.02) return null;
  return (
    <group>
      {Array.from({length: n}).map((_, i) => {
        const u = (i + 0.5) / n;
        const v = Math.max(0, Math.min(1, (k - u) * 5));
        if (v < 0.02) return null;
        const p: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + altura * Math.sin(Math.PI * u), a[2] + (b[2] - a[2]) * u];
        return (
          <mesh key={i} position={p} scale={0.075 * v}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={1.0} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Barra da pena (encolhe até 1/3 ou some) ----------
export const BarraPena: React.FC<{tema: Tema; pos: V3; rotY?: number; nivel: number; k: number; cor: string}> = ({tema, pos, rotY = 0, nivel, k, cor}) => {
  if (k < 0.02) return null;
  const H = 3.2;
  const h = Math.max(0.001, H * nivel);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <Caixa args={[1.2, 0.12, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      {/* Contorno do tamanho cheio */}
      {[-1, 1].map((s) => (
        <Caixa key={s} args={[0.04, H, 0.04]} raio={0.01} cor={tema.objeto} sombra={false} position={[s * 0.5, 0.12 + H / 2, 0.5]} />
      ))}
      <Caixa args={[1.04, 0.04, 0.04]} raio={0.01} cor={tema.objeto} sombra={false} position={[0, 0.12 + H, 0.5]} />
      {/* Linhas de 1/3 e 2/3 */}
      {[1 / 3, 2 / 3].map((f) => (
        <Caixa key={f} args={[1.04, 0.025, 0.03]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[0, 0.12 + H * f, 0.52]} />
      ))}
      {nivel > 0.005 ? <Caixa args={[0.9, h, 0.9]} raio={0.06} cor={cor} emissivo={0.25} position={[0, 0.12 + h / 2, 0]} /> : null}
    </group>
  );
};

// ---------- Envelope fechado (3ª proposta) ----------
export const Envelope: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; brilho: number}> = ({tema, pos, rot = [0, 0, 0], escala, brilho}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const cor = mistura(tema.objetoClaro, F.dourado, 0.25 + 0.4 * brilho);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.6, 1.0, 0.06]} raio={0.04} cor={cor} emissivo={0.08 + 0.35 * brilho} />
      {/* Aba triangular */}
      <mesh position={[0, 0.2, 0.035]} rotation={[0, 0, Math.PI]} scale={[1.13, 0.5, 1]}>
        <circleGeometry args={[0.7, 3, Math.PI / 2]} />
        <meshStandardMaterial color={mistura(cor, tema.objetoEscuro, 0.15)} side={2} />
      </mesh>
      {/* Lacre */}
      <mesh position={[0, 0.02, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
        <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.3 + 0.5 * brilho} />
      </mesh>
    </group>
  );
};

// ---------- Prediozinho genérico (Três Poderes) ----------
export const Prediozinho: React.FC<{tema: Tema; pos: V3; tipo: 0 | 1 | 2; k: number; cor: string}> = ({tema, pos, tipo, k, cor}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Caixa args={[1.0, 0.1, 0.7]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.05, 0]} />
      {tipo === 0 ? (
        <>
          {/* Congresso: duas torres e duas cúpulas */}
          <Caixa args={[0.12, 0.9, 0.3]} raio={0.02} cor={cor} position={[-0.08, 0.55, -0.1]} />
          <Caixa args={[0.12, 0.9, 0.3]} raio={0.02} cor={cor} position={[0.08, 0.55, -0.1]} />
          <mesh position={[-0.32, 0.12, 0.15]}>
            <sphereGeometry args={[0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Fosco cor={cor} />
          </mesh>
          <mesh position={[0.32, 0.26, 0.15]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[0.17, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Fosco cor={cor} />
          </mesh>
        </>
      ) : tipo === 1 ? (
        <>
          {/* Palácio: caixa baixa com colunas */}
          <Caixa args={[0.9, 0.3, 0.5]} raio={0.02} cor={cor} position={[0, 0.3, 0]} />
          {[-0.36, -0.12, 0.12, 0.36].map((x) => (
            <Caixa key={x} args={[0.05, 0.3, 0.05]} raio={0.01} cor={tema.objetoClaro} position={[x, 0.3, 0.28]} />
          ))}
        </>
      ) : (
        <>
          {/* Tribunal: frontão */}
          <Caixa args={[0.8, 0.4, 0.5]} raio={0.02} cor={cor} position={[0, 0.3, 0]} />
          <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.15, 0.5, 0.5]}>
            <cylinderGeometry args={[1, 1, 1, 3]} />
            <Fosco cor={cor} />
          </mesh>
        </>
      )}
    </group>
  );
};

// ---------- Gaveta (móvel com gaveta que abre) ----------
export const Gaveteiro: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; abre: number; brilho: number}> = ({tema, pos, rotY = 0, escala, abre, brilho}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.35);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.6, 1.5, 1.0]} raio={0.06} cor={madeira} position={[0, 0.75, 0]} />
      {[0.35, 1.05].map((y, i) => {
        const z = i === 1 ? 0.7 * abre : 0;
        return (
          <group key={y} position={[0, y, 0.5 + z]}>
            <Caixa args={[1.44, 0.6, 0.06]} raio={0.03} cor={mistura(madeira, i === 1 ? tema.acento : madeira, i === 1 ? 0.6 * brilho : 0)} emissivo={i === 1 ? 0.3 * brilho : 0} />
            <Caixa args={[0.4, 0.07, 0.07]} raio={0.03} cor={F.dourado} position={[0, 0, 0.06]} />
            {i === 1 && abre > 0.02 ? (
              <group position={[0, -0.05, -0.38]}>
                <Caixa args={[1.36, 0.45, 0.7]} raio={0.02} cor={mistura(madeira, tema.fundo, 0.4)} />
              </group>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};
