import React from 'react';
import {Boneco, Caixa, Fosco, Placa, mistura, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';

// Peças novas do vídeo 002. dívida pública (plano.md, seção 7).
// Todas com a frente em z+, base no chão (y = 0), cores só do tema.

// ---------- Torre da dívida (1,2 × alt × 1,2) ----------
// Blocos de 0,25 m empilhados; `sobe` 0..1 faz os blocos nascerem de baixo para cima.
// `brilho` 0..1 acende a torre no acento. `acima` 0..1 clareia os blocos acima de `yLinha` (o que passa de 100% do PIB).
export const BLOCO_TORRE = 0.25;
export const TorreDivida: React.FC<{tema: Tema; pos: V3; alt: number; nome: string; sobe: number; brilho?: number; acima?: number; yLinha?: number; cresce?: number}> = ({
  tema,
  pos,
  alt,
  nome,
  sobe,
  brilho = 0,
  acima = 0,
  yLinha = 2,
  cresce = 0,
}) => {
  if (sobe < 0.01) return null;
  const total = alt + cresce * BLOCO_TORRE;
  const n = Math.ceil(total / BLOCO_TORRE - 0.001);
  const base = mistura(tema.objeto, tema.acento, brilho);
  const claro = mistura(tema.objeto, tema.objetoClaro, 0.55);
  return (
    <group position={pos}>
      {/* pedestal com a placa do nome */}
      <Caixa args={[1.5, 0.12, 1.5]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Placa tema={tema} pos={[0, 0.06, 0.756]} larg={1.4} alt={0.11} linhas={[{t: nome, tam: 120, cor: tema.objetoClaro, peso: 850}]} />
      {Array.from({length: n}).map((_, i) => {
        const k = Math.max(0, Math.min(1, sobe * n - i));
        if (k < 0.02) return null;
        const h = Math.min(BLOCO_TORRE, total - i * BLOCO_TORRE);
        const y0 = 0.12 + i * BLOCO_TORRE;
        const passa = y0 + h / 2 > yLinha ? acima : 0;
        return (
          <Caixa
            key={i}
            args={[1.2, h - 0.02, 1.2]}
            raio={0.03}
            cor={mistura(base, claro, passa)}
            emissivo={0.12 * brilho + 0.1 * passa}
            position={[0, y0 + (h - 0.02) / 2 + 0.6 * (1 - k), 0]}
            scale={[k, 1, k]}
          />
        );
      })}
    </group>
  );
};

// ---------- Faixa de 100% do PIB (vidro fino horizontal) ----------
export const FaixaPIB: React.FC<{tema: Tema; x0: number; x1: number; y: number; z?: number; k: number; brilho?: number}> = ({tema, x0, x1, y, z = 0, k, brilho = 0}) => {
  if (k < 0.02) return null;
  const larg = (x1 - x0) * k;
  return (
    <group position={[x0 + larg / 2, y, z]}>
      <mesh>
        <boxGeometry args={[larg, 0.025, 2.2]} />
        <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.22 + 0.1 * brilho} roughness={0.15} depthWrite={false} />
      </mesh>
      <Caixa args={[larg, 0.04, 0.04]} raio={0.015} cor={tema.objetoClaro} emissivo={0.35 + 0.4 * brilho} sombra={false} position={[0, 0, 1.1]} />
    </group>
  );
};

// ---------- Bloco do PIB (1,4 × 2 × 1,4; 2 m = 100%) ----------
// O que vai em cima (produtos) entra como filho, apoiado em y = 2.
export const BlocoPIB: React.FC<{tema: Tema; pos: V3; k: number; brilho?: number; children?: React.ReactNode}> = ({tema, pos, k, brilho = 0, children}) => {
  if (k < 0.02) return null;
  const cor = mistura(mistura(tema.objetoEscuro, tema.objeto, 0.35), tema.objetoClaro, 0.25 * brilho);
  return (
    <group position={pos} scale={[1, k, 1]}>
      <Caixa args={[1.4, 2, 1.4]} raio={0.06} cor={cor} emissivo={0.15 * brilho} position={[0, 1, 0]} />
      {[0.5, 1.0, 1.5].map((y) => (
        <Caixa key={y} args={[1.42, 0.02, 1.42]} raio={0.008} cor={tema.objetoEscuro} sombra={false} position={[0, y, 0]} />
      ))}
      <Placa tema={tema} pos={[0, 1.0, 0.71]} larg={1.1} alt={0.5} linhas={[{t: 'PIB', tam: 360, cor: mistura(tema.objetoClaro, tema.acento, brilho), peso: 900}]} />
      <group position={[0, 2, 0]}>{children}</group>
    </group>
  );
};

// ---------- Curva da Selic (degraus em relevo sobre a linha do tempo) ----------
// `pts`: [x, y] de cada decisão (degrau). `prog`: até que x a curva já foi desenhada. `acesos` [x0, x1]: trecho no acento.
export const CurvaSelic: React.FC<{tema: Tema; pts: [number, number][]; z: number; prog: number; xFim: number; acesos?: [number, number]; brilho?: number}> = ({tema, pts, z, prog, xFim, acesos, brilho = 0}) => {
  if (prog <= pts[0][0] + 0.01) return null;
  const cor = mistura(tema.objetoClaro, tema.objeto, 0.15);
  const seg: React.ReactNode[] = [];
  let cabeca: V3 = [pts[0][0], pts[0][1], z];
  pts.forEach(([x, y], i) => {
    const xNext = i + 1 < pts.length ? pts[i + 1][0] : xFim;
    const fim = Math.min(xNext, prog);
    if (fim <= x) return;
    const aceso = acesos && x >= acesos[0] - 0.001 && x <= acesos[1] + 0.001 ? 1 : 0;
    const c = mistura(cor, tema.acento, aceso * brilho);
    // trecho horizontal (a taxa parada até a próxima decisão)
    seg.push(<Caixa key={`h${i}`} args={[Math.max(0.06, fim - x + 0.06), 0.09, 0.09]} raio={0.03} cor={c} emissivo={0.25 + 0.4 * aceso * brilho} position={[(x + fim) / 2, y, z]} />);
    // cortina leve embaixo do trecho (área do gráfico)
    seg.push(
      <mesh key={`a${i}`} position={[(x + fim) / 2, y / 2, z - 0.02]}>
        <boxGeometry args={[Math.max(0.02, fim - x), y, 0.02]} />
        <meshStandardMaterial color={c} transparent opacity={0.13} roughness={0.9} depthWrite={false} />
      </mesh>,
    );
    // degrau vertical até o próximo valor
    if (i + 1 < pts.length && prog >= xNext) {
      const y2 = pts[i + 1][1];
      seg.push(<Caixa key={`v${i}`} args={[0.09, Math.abs(y2 - y) + 0.09, 0.09]} raio={0.03} cor={c} emissivo={0.25} position={[xNext, (y + y2) / 2, z]} />);
    }
    cabeca = [fim, prog >= xNext && i + 1 < pts.length ? pts[i + 1][1] : y, z];
  });
  return (
    <>
      {seg}
      <mesh position={cabeca}>
        <sphereGeometry args={[0.13, 20, 16]} />
        <Fosco cor={tema.acento} emissivo={0.6} />
      </mesh>
    </>
  );
};

// ---------- Linha do tempo no chão (fita fina) ----------
export const FitaChao: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number; larg?: number; cor?: string}> = ({tema, x0, x1, z, k, larg = 0.08, cor}) => {
  if (k < 0.02) return null;
  const L = (x1 - x0) * k;
  return <Caixa args={[L, 0.03, larg]} raio={0.01} cor={cor ?? tema.objeto} emissivo={0.15} sombra={false} position={[x0 + L / 2, 0.04, z]} />;
};

// ---------- Faixa de governo no chão (as duas iguais, neutras) ----------
export const FaixaGoverno: React.FC<{tema: Tema; x0: number; x1: number; z: number; k: number; texto: string; xPlaca: number}> = ({tema, x0, x1, z, k, texto, xPlaca}) => {
  if (k < 0.02) return null;
  const L = (x1 - x0) * Math.min(1, k);
  const cor = mistura(tema.objetoEscuro, tema.objeto, 0.25);
  return (
    <group>
      <Caixa args={[L, 0.04, 0.5]} raio={0.015} cor={cor} sombra={false} position={[x0 + L / 2, 0.05, z]} />
      <Caixa args={[0.05, 0.05, 0.6]} raio={0.015} cor={tema.objeto} sombra={false} position={[x0, 0.06, z]} />
      {texto ? (
      <group position={[xPlaca, 0.08, z + 0.62]} scale={Math.min(1, k)}>
        <Placa tema={tema} pos={[0, 0, 0]} rot={[-Math.PI / 2, 0, 0]} larg={2.6} alt={0.46} linhas={[{t: texto, tam: 96, cor: tema.objetoClaro, peso: 800, mono: true}]} fundo={cor} />
      </group>
      ) : null}
    </group>
  );
};

// ---------- Mostrador da Selic (poste + disco de frente, 1,8 m de diâmetro na escala 1) ----------
// `valor` 0..1: ponteiro do mínimo ao máximo. `brilho`: o rótulo acende.
export const MostradorSelic: React.FC<{tema: Tema; pos: V3; k: number; valor: number; brilho?: number; rotY?: number}> = ({tema, pos, k, valor, brilho = 0, rotY = 0}) => {
  if (k < 0.02) return null;
  const a0 = Math.PI * 0.75;
  const ang = a0 - valor * Math.PI * 1.5; // de 135° (esquerda) a -135° (direita), sentido horário
  const R = 0.9;
  return (
    <group position={[pos[0], pos[1] - 3 * (1 - k), pos[2]]} rotation={[0, rotY, 0]}>
      <Caixa args={[0.9, 0.12, 0.6]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[0.16, 1.6, 0.16]} raio={0.05} cor={mistura(tema.objetoEscuro, tema.objeto, 0.3)} position={[0, 0.9, -0.05]} />
      <group position={[0, 2.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[R + 0.12, R + 0.12, 0.16, 48]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <mesh position={[0, 0, 0.085]}>
          <circleGeometry args={[R, 48]} />
          <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.fundo, 0.4)} roughness={0.8} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
        </mesh>
        {Array.from({length: 13}).map((_, i) => {
          const a = a0 - (i / 12) * Math.PI * 1.5;
          const forte = i % 3 === 0;
          return <Caixa key={i} args={[forte ? 0.16 : 0.09, 0.03, 0.01]} raio={0.008} cor={tema.objetoClaro} sombra={false} position={[Math.cos(a) * (R - 0.14), Math.sin(a) * (R - 0.14), 0.095]} rotation={[0, 0, a]} />;
        })}
        <group position={[0, 0, 0.11]} rotation={[0, 0, ang]}>
          <Caixa args={[R - 0.18, 0.06, 0.02]} raio={0.01} cor={tema.acento} emissivo={0.5} sombra={false} position={[(R - 0.18) / 2, 0, 0]} />
        </group>
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 20]} />
          <Fosco cor={tema.objetoClaro} />
        </mesh>
        <Placa tema={tema} pos={[0, -0.45, 0.1]} larg={0.9} alt={0.26} linhas={[{t: 'SELIC', tam: 260, cor: mistura(tema.objetoClaro, tema.acento, brilho), peso: 900}]} />
      </group>
    </group>
  );
};

// ---------- Mesa do Copom (mesa redonda com 9 bonecos de pé em volta, sem rosto) ----------
// `k` 0..1: a mesa sobe. `gente` 0..9: quantos bonecos já chegaram. `luz` 0..9: quantos já acenderam (diretores).
export const MesaCopom: React.FC<{tema: Tema; pos: V3; k: number; gente: number; luz?: number}> = ({tema, pos, k, gente, luz = 0}) => {
  if (k < 0.02) return null;
  const tampo = mistura(tema.objetoEscuro, tema.objeto, 0.35);
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - k), pos[2]]}>
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.25, 0.1, 48]} />
        <Fosco cor={tampo} />
      </mesh>
      <mesh position={[0, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.3, 0.78, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      {Array.from({length: 9}).map((_, i) => {
        const c = Math.max(0, Math.min(1, gente - i));
        if (c < 0.02) return null;
        // atrás e dos lados da mesa (a frente fica livre para a câmera)
        const a = Math.PI * (0.05 + (i / 8) * 0.9);
        const r = 1.7;
        const acende = Math.max(0, Math.min(1, luz - i));
        return (
          <Boneco
            key={i}
            tema={tema}
            pos={[Math.cos(a) * r, 0, -Math.sin(a) * r]}
            rotY={Math.atan2(-Math.cos(a), Math.sin(a))}
            escala={0.85 * c}
            cor={mistura(tema.pessoa, tema.objetoClaro, 0.35 * acende)}
          />
        );
      })}
    </group>
  );
};
