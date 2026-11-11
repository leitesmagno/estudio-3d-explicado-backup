import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 049 (quem quer o distrital misto). Tudo fosco, sem logo e sem rosto; texto fixo por peça.

// ---------- A estrada da PEC: faixa de asfalto comprida no eixo z, com tracejado no meio ----------
export const Estrada: React.FC<{tema: Tema; de: number; ate: number; larg?: number}> = ({tema, de, ate, larg = 3.6}) => {
  const comp = de - ate;
  const meio = (de + ate) / 2;
  const tracos = Math.floor(comp / 2.4);
  return (
    <group>
      <Caixa args={[larg, 0.04, comp]} raio={0.015} cor={mistura(tema.objetoEscuro, tema.fundo, 0.25)} position={[0, 0.03, meio]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.06, 0.012, comp]} raio={0.005} cor={mistura(tema.objeto, tema.objetoClaro, 0.3)} sombra={false} position={[l * (larg / 2 - 0.12), 0.057, meio]} />
      ))}
      {Array.from({length: tracos}).map((_, i) => (
        <Caixa key={i} args={[0.08, 0.012, 1.1]} raio={0.005} cor={mistura(tema.objeto, tema.objetoClaro, 0.5)} sombra={false} position={[0, 0.057, de - 1.2 - i * 2.4]} />
      ))}
    </group>
  );
};

// ---------- Cancela atravessada na estrada: dois postes, braço listrado que desce e a placa NÃO ----------
// `desce` 0..1 (0 = braço em pé, aberto; 1 = deitado, fechando a estrada). `numero` fica no poste.
export const CancelaNao: React.FC<{tema: Tema; pos: V3; escala: number; desce: number; numero: string; larg?: number; aceso?: number}> = ({tema, pos, escala, desce, numero, larg = 3.8, aceso = 0}) => {
  if (escala < 0.02) return null;
  const ang = (Math.PI / 2) * (1 - desce);
  const n = 9;
  const passo = (larg - 0.2) / n;
  return (
    <group position={pos} scale={escala}>
      {[-1, 1].map((l) => (
        <group key={l} position={[(l * larg) / 2, 0, 0]}>
          <Caixa args={[0.18, 0.12, 0.18]} raio={0.04} cor={tema.objeto} position={[0, 0.06, 0]} />
          <Caixa args={[0.12, 1.2, 0.12]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.66, 0]} />
        </group>
      ))}
      {/* placa do número no poste da esquerda */}
      <group position={[-larg / 2, 1.42, 0.08]}>
        <Caixa args={[0.5, 0.42, 0.05]} raio={0.04} cor={mistura(tema.objetoClaro, tema.acento, aceso)} emissivo={0.25 * aceso} />
        <Placa tema={tema} pos={[0, 0, 0.03]} larg={0.46} alt={0.38} linhas={[{t: numero, tam: 520, cor: tema.objetoEscuro, peso: 900}]} brilho={0.2} />
      </group>
      {/* braço: gira no poste da esquerda */}
      <group position={[-larg / 2, 1.1, 0.12]} rotation={[0, 0, -ang]}>
        {Array.from({length: n}).map((_, i) => (
          <Caixa key={i} args={[passo - 0.01, 0.14, 0.07]} raio={0.03} cor={i % 2 ? tema.objetoClaro : mistura(tema.objetoEscuro, tema.acento, 0.15 + 0.6 * desce)} emissivo={i % 2 ? 0 : 0.2 * desce} position={[0.12 + passo * (i + 0.5), 0, 0]} />
        ))}
        {/* a placa NÃO pendurada no meio do braço (só aparece deitada) */}
        <group position={[larg / 2, -0.32, 0.04]} rotation={[0, 0, ang]} scale={Math.max(0.001, desce)}>
          <Caixa args={[1.25, 0.5, 0.06]} raio={0.06} cor={tema.acento} emissivo={0.3} />
          <Placa tema={tema} pos={[0, 0, 0.035]} larg={1.15} alt={0.42} linhas={[{t: 'NÃO', tam: 360, cor: tema.fundo, peso: 900}]} brilho={0.35} />
        </group>
      </group>
    </group>
  );
};

// ---------- Mesa redonda do acordo (tampo, pé central e cadeiras em volta) ----------
// `lugares` em ângulos (rad, 0 = de frente para z+); devolve as cadeiras viradas para o centro.
export const MesaRedonda: React.FC<{tema: Tema; pos: V3; raio?: number; lugares: number[]; k: number}> = ({tema, pos, raio = 1.7, lugares, k}) => {
  if (k < 0.02) return null;
  const tampo = mistura(tema.areia, tema.objetoEscuro, 0.55);
  const cadeira = mistura(tema.objetoEscuro, tema.fundo, 0.15);
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - k), pos[2]]}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[raio, raio, 0.1, 48]} />
        <meshStandardMaterial color={tampo} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 0.78, 20]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.85} />
      </mesh>
      {lugares.map((a, i) => (
        <group key={i} position={[Math.sin(a) * (raio + 0.45), 0, Math.cos(a) * (raio + 0.45)]} rotation={[0, a, 0]}>
          <Caixa args={[0.5, 0.07, 0.46]} raio={0.03} cor={cadeira} position={[0, 0.46, 0]} />
          <Caixa args={[0.5, 0.56, 0.07]} raio={0.03} cor={cadeira} position={[0, 0.78, 0.22]} />
          <Caixa args={[0.06, 0.44, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.22, 0]} />
        </group>
      ))}
    </group>
  );
};

// ---------- Plaquinha de mesa (prisma com a sigla), virada para fora da mesa ----------
export const PlaquinhaMesa: React.FC<{tema: Tema; pos: V3; rotY?: number; texto: string; k: number; cor?: string}> = ({tema, pos, rotY = 0, texto, k, cor}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <Caixa args={[0.62, 0.22, 0.06]} raio={0.02} cor={cor ?? tema.objetoClaro} position={[0, 0.11, 0]} rotation={[-0.25, 0, 0]} />
      <Placa tema={tema} pos={[0, 0.115, 0.04]} rot={[-0.25, 0, 0]} larg={0.58} alt={0.19} linhas={[{t: texto, tam: texto.length > 6 ? 150 : 210, cor: tema.objetoEscuro, peso: 900}]} brilho={0.2} />
    </group>
  );

// ---------- Distrito cercado (chão próprio, cerquinha, palanque) ----------
export const TerrenoDistrito: React.FC<{tema: Tema; pos: V3; lado?: number; k: number; fecha: number; cor?: string}> = ({tema, pos, lado = 3.4, k, fecha, cor}) => {
  if (k < 0.02) return null;
  const postes = 9;
  const h = lado / 2;
  const pontos: V3[] = [];
  for (let i = 0; i < postes; i++) {
    const u = -h + (lado * i) / (postes - 1);
    pontos.push([u, 0, -h], [u, 0, h], [-h, 0, u], [h, 0, u]);
  }
  return (
    <group position={pos} scale={[k, 1, k]}>
      <Caixa args={[lado, 0.05, lado]} raio={0.02} cor={cor ?? mistura(tema.objetoEscuro, tema.acento, 0.12)} position={[0, 0.09, 0]} />
      {pontos.map((p, i) => {
        const a = Math.max(0, Math.min(1, fecha * 1.6 - (i / pontos.length) * 0.6));
        return a > 0.02 ? <Caixa key={i} args={[0.06, 0.34 * a, 0.06]} raio={0.02} cor={tema.objetoClaro} position={[p[0], 0.12 + 0.17 * a, p[2]]} sombra={false} /> : null;
      })}
      {[-h, h].map((z) => (
        <Caixa key={`z${z}`} args={[lado * fecha, 0.04, 0.04]} raio={0.015} cor={tema.objetoClaro} position={[0, 0.38, z]} sombra={false} />
      ))}
      {[-h, h].map((x) => (
        <Caixa key={`x${x}`} args={[0.04, 0.04, lado * fecha]} raio={0.015} cor={tema.objetoClaro} position={[x, 0.38, 0]} sombra={false} />
      ))}
    </group>
  );
};

// ---------- Palanque (tablado com escadinha) ----------
export const Palanque: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={[1, k, 1]}>
      <Caixa args={[1.3, 0.6, 1.0]} raio={0.04} cor={tema.objeto} position={[0, 0.3, 0]} />
      <Caixa args={[1.34, 0.06, 1.04]} raio={0.02} cor={tema.objetoClaro} position={[0, 0.62, 0]} />
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[0.5, 0.2 * (i + 1), 0.22]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.1 * (i + 1), 0.6 + (2 - i) * 0.22]} />
      ))}
    </group>
  );

// ---------- Caixa de papelão com etiqueta (a "EMENDA") ----------
export const CaixaEtiqueta: React.FC<{tema: Tema; pos: V3; rotY?: number; texto: string; k: number}> = ({tema, pos, rotY = 0, texto, k}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={k}>
      <Caixa args={[0.56, 0.42, 0.42]} raio={0.03} cor={mistura(tema.areia, tema.objeto, 0.25)} position={[0, 0.21, 0]} />
      <Caixa args={[0.58, 0.05, 0.1]} raio={0.01} cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} sombra={false} position={[0, 0.43, 0]} />
      <Placa tema={tema} pos={[0, 0.22, 0.215]} larg={0.5} alt={0.16} linhas={[{t: texto, tam: 170, cor: tema.objetoEscuro, peso: 900}]} fundo={tema.objetoClaro} brilho={0.2} />
    </group>
  );

// ---------- Lixeira (cilindro aberto com aro) ----------
export const Lixeira: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.34, 0.9, 32, 1, true]} />
        <meshStandardMaterial color={tema.objeto} roughness={0.75} side={2} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.04, 32]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.035, 10, 40]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.6} />
      </mesh>
      <Placa tema={tema} pos={[0, 0.5, 0.39]} rot={[-0.09, 0, 0]} larg={0.5} alt={0.14} linhas={[{t: 'LIXO', tam: 220, cor: tema.objetoClaro, peso: 900}]} brilho={0.2} />
    </group>
  );

// ---------- Tabuleiro do estado em 4 distritos, com os votos de dois candidatos ----------
// Pontos da professora espalhados pelos 4; os do outro candidato juntos no distrito 0, que acende.
const PONTOS_ESPALHADOS: [number, number][] = [
  [-1.1, -0.9], [-0.4, -1.2], [0.6, -1.0], [1.2, -0.5], [-1.3, 0.2], [-0.6, 0.6], [0.3, 0.3], [1.0, 0.7], [-0.9, 1.2], [0.2, 1.1], [1.3, 1.3], [-0.2, -0.3],
];
const PONTOS_JUNTOS: [number, number][] = [
  [-1.2, -1.1], [-0.9, -1.2], [-1.0, -0.8], [-0.6, -1.0], [-1.3, -0.6], [-0.7, -0.6], [-0.4, -1.3], [-1.1, -0.4], [-0.5, -0.7], [-0.8, -0.3], [-0.3, -0.9], [-1.25, -0.25],
];
export const TabuleiroDistritos: React.FC<{tema: Tema; pos: V3; k: number; espalha: number; junta: number; acendeJunto: number; apagaEspalhado: number; corEspalhado: string; corJunto: string}> = ({tema, pos, k, espalha, junta, acendeJunto, apagaEspalhado, corEspalhado, corJunto}) => {
  if (k < 0.02) return null;
  const quad = (qx: number, qz: number) => mistura(mistura(tema.objetoEscuro, tema.objeto, 0.35 + 0.08 * (qx + qz + 2)), tema.acento, qx < 0 && qz < 0 ? 0.55 * acendeJunto : 0);
  return (
    <group position={pos} scale={k}>
      <Caixa args={[3.2, 0.12, 3.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      {[-1, 1].map((qx) => [-1, 1].map((qz) => <Caixa key={`${qx}${qz}`} args={[1.5, 0.04, 1.5]} raio={0.02} cor={quad(qx, qz)} emissivo={qx < 0 && qz < 0 ? 0.2 * acendeJunto : 0} position={[qx * 0.78, 0.14, qz * 0.78]} />))}
      {PONTOS_ESPALHADOS.map(([x, z], i) => {
        const a = Math.max(0, Math.min(1, espalha * 2 - i / PONTOS_ESPALHADOS.length)) * (1 - 0.7 * apagaEspalhado);
        return a > 0.02 ? (
          <mesh key={`e${i}`} position={[x, 0.2, z]} scale={a}>
            <sphereGeometry args={[0.09, 14, 10]} />
            <meshStandardMaterial color={corEspalhado} emissive={corEspalhado} emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
        ) : null;
      })}
      {PONTOS_JUNTOS.map(([x, z], i) => {
        const a = Math.max(0, Math.min(1, junta * 2 - i / PONTOS_JUNTOS.length));
        return a > 0.02 ? (
          <mesh key={`j${i}`} position={[x, 0.2, z]} scale={a}>
            <sphereGeometry args={[0.08, 12, 8]} />
            <meshStandardMaterial color={corJunto} roughness={0.6} />
          </mesh>
        ) : null;
      })}
    </group>
  );
};

// ---------- Prancheta de desenho dos distritos: 4 cores, um bairro que troca de lado e a linha que corta a cidade ----------
export const PranchetaDistritos: React.FC<{tema: Tema; pos: V3; k: number; tracejado: number; bairro: number; corta: number; cores: string[]}> = ({tema, pos, k, tracejado, bairro, corta, cores}) => {
  if (k < 0.02) return null;
  const fundo = (i: number) => mistura(mistura(tema.objetoEscuro, tema.objeto, 0.4), cores[i], 0.55 * tracejado);
  return (
    <group position={pos} scale={k} rotation={[-0.35, 0, 0]}>
      {/* cavalete */}
      <Caixa args={[0.08, 1.9, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[-1.3, 0.95, -0.2]} rotation={[0.25, 0, 0]} />
      <Caixa args={[0.08, 1.9, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[1.3, 0.95, -0.2]} rotation={[0.25, 0, 0]} />
      <group position={[0, 1.55, 0]}>
        <Caixa args={[3.1, 2.2, 0.08]} raio={0.04} cor={tema.objetoClaro} />
        {[0, 1, 2, 3].map((i) => (
          <Caixa key={i} args={[1.42, 1.0, 0.02]} raio={0.01} cor={fundo(i)} sombra={false} position={[(i % 2 ? 1 : -1) * 0.74, (i < 2 ? 1 : -1) * 0.52, 0.05]} />
        ))}
        {/* o bairro: quadradinho de casas que muda do distrito 0 (esq. de cima) para o 1 (dir. de cima) */}
        <group position={[-0.12 + 0.3 * bairro, 0.55, 0.07]}>
          <Caixa args={[0.34, 0.34, 0.02]} raio={0.01} cor={mistura(cores[0], cores[1], bairro)} emissivo={0.3} sombra={false} />
          {[[-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08], [0.08, -0.08]].map(([x, y], i) => (
            <Caixa key={i} args={[0.1, 0.1, 0.05]} raio={0.01} cor={tema.objetoClaro} sombra={false} position={[x, y, 0.03]} />
          ))}
        </group>
        {/* a cidade: bolinha de casas embaixo, cortada ao meio por uma linha que desce */}
        <group position={[0, -0.55, 0.07]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color={mistura(tema.objeto, tema.objetoClaro, 0.5)} roughness={0.7} />
          </mesh>
          <Caixa args={[0.05, 0.8 * corta, 0.03]} raio={0.01} cor={tema.acento} emissivo={0.5} sombra={false} position={[0, 0.4 - 0.4 * corta, 0.03]} />
        </group>
        {/* linhas dos distritos */}
        <Caixa args={[0.04, 2.08 * tracejado, 0.03]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 0, 0.07]} />
        <Caixa args={[3.0 * tracejado, 0.04, 0.03]} raio={0.01} cor={tema.objetoEscuro} sombra={false} position={[0, 0, 0.07]} />
      </group>
    </group>
  );
};

// ---------- Lápis gigante ----------
export const Lapis: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number}> = ({tema, pos, rot = [0, 0, 0], escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.2, 6]} />
        <meshStandardMaterial color={mistura(tema.areia, tema.acento, 0.15)} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.2, 6]} />
        <meshStandardMaterial color={tema.areia} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.33, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.08, 12]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.6} />
      </mesh>
    </group>
  );

// ---------- Linha pintada no chão (o jogador marcando o campo) ----------
export const LinhaChao: React.FC<{tema: Tema; de: V3; comp: number; k: number}> = ({tema, de, comp, k}) =>
  k < 0.02 ? null : <Caixa args={[comp * k, 0.012, 0.09]} raio={0.004} cor={tema.branco} sombra={false} position={[de[0] + (comp * k) / 2, 0.065, de[2]]} />;

// ---------- Medidor de pé, de frente para z+: mostrador claro, faixa até a marca, ponteiro e botão de ajuste ----------
// `valor` 0..1 gira o ponteiro da esquerda (0) para a direita (1); `marca` 0..1 é onde fica o "mínimo".
export const MedidorVotos: React.FC<{tema: Tema; pos: V3; escala: number; valor: number; marca: number; botao: number; titulo: string}> = ({tema, pos, escala, valor, marca, botao, titulo}) => {
  if (escala < 0.02) return null;
  const ang = (v: number) => Math.PI * (1 - v); // 0 = esquerda, 1 = direita (semicírculo de cima)
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.16, 1.0, 0.16]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.5, 0]} />
      <Caixa args={[0.6, 0.08, 0.5]} raio={0.03} cor={tema.objeto} position={[0, 0.04, 0]} />
      <group position={[0, 1.55, 0]}>
        <Caixa args={[1.5, 1.3, 0.14]} raio={0.08} cor={tema.objetoEscuro} position={[0, 0, -0.04]} />
        <mesh position={[0, -0.36, 0.04]}>
          <circleGeometry args={[0.62, 48, 0, Math.PI]} />
          <meshStandardMaterial color={tema.objetoClaro} roughness={0.6} />
        </mesh>
        {/* faixa do zero até a marca do mínimo */}
        <mesh position={[0, -0.36, 0.05]}>
          <ringGeometry args={[0.5, 0.6, 48, 1, ang(marca), Math.PI - ang(marca)]} />
          <meshStandardMaterial color={mistura(tema.objeto, tema.acento, 0.5)} roughness={0.6} />
        </mesh>
        {Array.from({length: 11}).map((_, i) => {
          const a = ang(i / 10);
          return <Caixa key={i} args={[0.02, 0.08, 0.01]} raio={0.004} cor={tema.objetoEscuro} sombra={false} position={[Math.cos(a) * 0.45, -0.36 + Math.sin(a) * 0.45, 0.055]} rotation={[0, 0, a - Math.PI / 2]} />;
        })}
        <group position={[0, -0.36, 0.07]} rotation={[0, 0, ang(valor)]}>
          <Caixa args={[0.5, 0.035, 0.015]} raio={0.008} cor={tema.acento} emissivo={0.4} sombra={false} position={[0.25, 0, 0]} />
        </group>
        <mesh position={[0, -0.36, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 20]} />
          <meshStandardMaterial color={tema.objetoEscuro} roughness={0.5} />
        </mesh>
        <Placa tema={tema} pos={[0, 0.47, 0.035]} larg={1.3} alt={0.2} linhas={[{t: titulo, tam: 130, cor: tema.objetoClaro, peso: 900}]} brilho={0.25} />
        {/* botão de ajuste ao lado */}
        <group position={[0.62, -0.5, 0.06]} rotation={[0, 0, -botao * 2.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.07, 20]} />
            <meshStandardMaterial color={tema.acento} roughness={0.5} />
          </mesh>
          <Caixa args={[0.02, 0.08, 0.02]} raio={0.005} cor={tema.objetoClaro} sombra={false} position={[0, 0.05, 0.04]} />
        </group>
      </group>
    </group>
  );
};
