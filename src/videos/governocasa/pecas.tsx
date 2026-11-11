// Peças novas do vídeo 003. o governo não é a sua casa.
// Todas seguem a base: foscas, cores só do tema, frente em z+, base no chão, sem marca e sem rosto.
import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, geoCaixa, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import {ESCURO, type Tema} from '../../base/tema';

const festa = (tema: Tema) => tema.festa ?? ESCURO.festa!;

// ---------- Moeda gigante "R$", de pé (2 × 2 × 0,36; centro a 1,1 m do chão) ----------
// `gira` em radianos (rodar no eixo vertical). `brilho` 0..1 acende o aro.
const G_DISCO = new THREE.CylinderGeometry(1, 1, 0.26, 56);
export const MoedaReal: React.FC<{tema: Tema; pos: V3; escala: number; gira?: number; brilho?: number}> = ({tema, pos, escala, gira = 0, brilho = 0}) => {
  if (escala < 0.02) return null;
  const ouro = festa(tema).dourado;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[0.9, 0.12, 0.6]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <group position={[0, 1.12, 0]} rotation={[0, gira, 0]}>
        <mesh geometry={G_DISCO} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <Fosco cor={ouro} emissivo={0.08 + 0.3 * brilho} aspereza={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.132]}>
          <ringGeometry args={[0.78, 0.86, 56]} />
          <Fosco cor={mistura(ouro, tema.branco, 0.35)} emissivo={0.2 + 0.4 * brilho} />
        </mesh>
        <Placa tema={tema} pos={[0, 0, 0.136]} larg={1.4} alt={0.9} linhas={[{t: 'R$', tam: 560, cor: mistura(ouro, tema.objetoEscuro, 0.55), peso: 900}]} brilho={0.1} />
        <Placa tema={tema} pos={[0, 0, -0.136]} rot={[0, Math.PI, 0]} larg={1.4} alt={0.9} linhas={[{t: 'R$', tam: 560, cor: mistura(ouro, tema.objetoEscuro, 0.55), peso: 900}]} brilho={0.1} />
      </group>
    </group>
  );
};

// ---------- Título público (cartão em pé, 0,7 × 0,46 × 0,04, base a 0,02 m) ----------
// `vence` 0..1: a faixa de baixo acende no acento (o título que vence). `texto` é a linha de cima.
const G_TITULO = geoCaixa(0.7, 0.46, 0.04, 0.02);
export const TituloPublico: React.FC<{tema: Tema; pos: V3; rot?: V3; escala?: number; vence?: number; texto?: string}> = ({tema, pos, rot = [0, 0, 0], escala = 1, vence = 0, texto = 'TÍTULO'}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.objetoClaro, tema.objeto, 0.35);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <mesh geometry={G_TITULO} position={[0, 0.25, 0]} castShadow>
        <Fosco cor={papel} />
      </mesh>
      <Placa tema={tema} pos={[0, 0.33, 0.024]} larg={0.6} alt={0.16} linhas={[{t: texto, tam: 150, cor: tema.tinta, peso: 850}]} />
      <Caixa args={[0.6, 0.08, 0.01]} raio={0.004} cor={mistura(tema.objetoEscuro, tema.acento, vence)} emissivo={0.5 * vence} sombra={false} position={[0, 0.13, 0.024]} />
    </group>
  );
};

// ---------- Esteira oval dos títulos (6 × 2,4 no chão, centro em `pos`) ----------
// `k` 0..1 nasce. `anda` em metros percorridos. `n` títulos em fila; `falta` (índice) e `vazio` 0..1 abrem um buraco na fila.
// `vence` 0..1 acende o título da frente (índice 0 na posição de saída).
const RX = 3.0;
const RZ = 1.2;
const pontoOval = (u: number): [number, number, number] => {
  // u de 0 a 1 ao longo do contorno (aproximação de elipse por ângulo)
  const a = u * Math.PI * 2;
  return [RX * Math.sin(a), RZ * Math.cos(a), Math.atan2(RX * Math.cos(a), -RZ * Math.sin(a))];
};
export const ovalPonto = pontoOval;
export const PERIM_OVAL = Math.PI * (3 * (RX + RZ) - Math.sqrt((3 * RX + RZ) * (RX + 3 * RZ)));
export const EsteiraTitulos: React.FC<{tema: Tema; pos: V3; k: number; anda: number; n?: number; falta?: number; vazio?: number; vence?: number}> = ({tema, pos, k, anda, n = 10, falta = -1, vazio = 0, vence = 0}) => {
  if (k < 0.02) return null;
  const perim = PERIM_OVAL;
  const segs = 48;
  return (
    <group position={pos}>
      {/* trilho: faixa escura com borda clara */}
      {Array.from({length: segs}).map((_, i) => {
        if (i / segs > k) return null;
        const [x, z, r] = pontoOval(i / segs);
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
            <Caixa args={[0.46, 0.06, 0.62]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} position={[0, 0.04, 0]} />
            <Caixa args={[0.46, 0.03, 0.05]} raio={0.012} cor={tema.objeto} sombra={false} position={[0, 0.085, 0.29]} />
          </group>
        );
      })}
      {Array.from({length: n}).map((_, i) => {
        const u = (((i / n + anda / perim) % 1) + 1) % 1;
        const [x, z, r] = pontoOval(u);
        const esc = (i === falta ? 1 - vazio : 1) * Math.min(1, Math.max(0, k * 1.4 - 0.3));
        return <TituloPublico key={i} tema={tema} pos={[x, 0.08, z]} rot={[0, r + Math.PI / 2, 0]} escala={esc} vence={i === 0 ? vence : 0} />;
      })}
    </group>
  );
};

// ---------- Torre da dívida (blocos de 10% do PIB; 1,3 × 0,27 × 1,3 cada, passo 0,3) ----------
// `blocos` fracionário (o de cima cresce). `cor` dos blocos; `vidro` deixa a torre transparente (a torre "fantasma").
// `nome` vai numa placa na frente da base. `brilho` 0..1 acende.
export const PASSO_BLOCO = 0.3;
const G_BLOCO = geoCaixa(1.3, 0.27, 1.3, 0.04);
export const TorreDivida: React.FC<{tema: Tema; pos: V3; blocos: number; cor: string; nome?: string; base?: number; vidro?: boolean; brilho?: number}> = ({tema, pos, blocos, cor, nome, base = 1, vidro, brilho = 0}) => {
  const cheios = Math.floor(blocos);
  const resto = blocos - cheios;
  return (
    <group position={pos}>
      {base > 0.02 ? (
        <group scale={[1, base, 1]}>
          <Caixa args={[1.7, 0.16, 1.7]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.08, 0]} />
          {nome ? <Placa tema={tema} pos={[0, 0.08, 0.856]} larg={1.6} alt={0.15} linhas={[{t: nome, tam: 120, cor: tema.objetoClaro, peso: 850, mono: true}]} /> : null}
        </group>
      ) : null}
      {Array.from({length: cheios + (resto > 0.02 ? 1 : 0)}).map((_, i) => {
        const s = i < cheios ? 1 : resto;
        return (
          <mesh key={i} geometry={G_BLOCO} position={[0, 0.16 + 0.135 * s + i * PASSO_BLOCO, 0]} scale={[1, s, 1]} castShadow={!vidro} receiveShadow={!vidro}>
            {vidro ? (
              <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.22} roughness={0.2} depthWrite={false} />
            ) : (
              <Fosco cor={mistura(cor, tema.branco, 0.06 * (i % 2))} emissivo={0.12 + 0.35 * brilho} />
            )}
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Linha dos 100% do PIB: faixa de vidro fina sobre a rua ----------
// De x0 a x1, na altura y, profundidade 2,2 em volta de z. `k` 0..1 se estende da direita (x1) para a esquerda.
export const LinhaCem: React.FC<{tema: Tema; x0: number; x1: number; y: number; z: number; k: number}> = ({tema, x0, x1, y, z, k}) => {
  if (k < 0.02) return null;
  const L = (x1 - x0) * k;
  const cx = x1 - L / 2;
  return (
    <group>
      <mesh position={[cx, y, z]}>
        <boxGeometry args={[L, 0.03, 2.2]} />
        <meshStandardMaterial color={tema.ceuLuz} transparent opacity={0.28} roughness={0.15} depthWrite={false} />
      </mesh>
      <mesh position={[cx, y, z + 1.11]}>
        <boxGeometry args={[L, 0.05, 0.03]} />
        <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.35} />
      </mesh>
      {k > 0.95 ? <Placa tema={tema} pos={[x0 - 1.3, y + 0.05, z + 1.1]} larg={2.2} alt={0.36} linhas={[{t: '100% DO PIB', tam: 150, cor: tema.objetoClaro, peso: 800, mono: true}]} fundo={tema.objetoEscuro} /> : null}
    </group>
  );
};

// ---------- Tesoura gigante (1,9 m de comprimento, deitada no plano xz, pontas em +x) ----------
// `abre` 0..1 abre as lâminas.
const G_LAMINA = geoCaixa(1.2, 0.05, 0.16, 0.02);
export const Tesoura: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre: number}> = ({tema, pos, rot = [0, 0, 0], escala, abre}) => {
  if (escala < 0.02) return null;
  const metal = mistura(tema.objetoClaro, tema.objeto, 0.4);
  const ang = 0.08 + 0.42 * abre;
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {[1, -1].map((l) => (
        <group key={l} rotation={[0, l * ang, 0]}>
          <mesh geometry={G_LAMINA} position={[0.6, l * 0.03, 0]} castShadow>
            <Fosco cor={metal} aspereza={0.45} />
          </mesh>
          <mesh position={[-0.42, l * 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.2, 0.06, 12, 28]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );
};

// ---------- Cano vazando (2,4 m em x, a 1,1 m do chão, em dois apoios) ----------
// O furo fica no meio. `t` anima as moedas que pingam; `vaza` 0..1 quanto pinga; `remendo` 0..1 cobre o furo.
export const CanoVazando: React.FC<{tema: Tema; pos: V3; escala: number; t: number; vaza: number; remendo: number}> = ({tema, pos, escala, t, vaza, remendo}) => {
  if (escala < 0.02) return null;
  const metal = mistura(tema.objeto, tema.objetoEscuro, 0.2);
  const ouro = festa(tema).dourado;
  return (
    <group position={pos} scale={escala}>
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.14, 1.1, 0.14]} raio={0.04} cor={tema.objetoEscuro} position={[l * 0.95, 0.55, 0]} />
      ))}
      <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 2.4, 24]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.35} />
      </mesh>
      {/* furo e remendo */}
      <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color={tema.fundo} />
      </mesh>
      {remendo > 0.02 ? <Caixa args={[0.5 * remendo, 0.4, 0.4]} raio={0.05} cor={tema.acento} emissivo={0.25} position={[0, 1.15, 0]} /> : null}
      {vaza > 0.02
        ? [0, 1, 2, 3].map((i) => {
            const c = (t * 1.1 + i / 4) % 1;
            return (
              <mesh key={i} position={[0, 0.95 - 0.9 * c * c, 0]} rotation={[c * 4, 0, 0.6]} scale={vaza * (1 - 0.3 * c)}>
                <cylinderGeometry args={[0.09, 0.09, 0.025, 18]} />
                <Fosco cor={ouro} emissivo={0.1} />
              </mesh>
            );
          })
        : null}
      <Caixa args={[0.8, 0.04, 0.8]} raio={0.02} cor={mistura(ouro, tema.objetoEscuro, 0.6)} sombra={false} position={[0, 0.03, 0]} scale={[vaza, 1, vaza]} />
    </group>
  );
};

// ---------- Canteiro de plantação (1,4 × 1,0, com 4 fileiras de plantas) ----------
// `cresce` 0..1: as plantas sobem fileira por fileira.
export const CampoPlantacao: React.FC<{tema: Tema; pos: V3; escala: number; cresce: number}> = ({tema, pos, escala, cresce}) => {
  if (escala < 0.02) return null;
  const terra = mistura(tema.areia, tema.objetoEscuro, 0.55);
  const folha = festa(tema).verde;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[1.4, 0.1, 1.0]} raio={0.03} cor={terra} position={[0, 0.05, 0]} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const s = Math.max(0, Math.min(1, cresce * 4 - r * 0.7));
          if (s < 0.02) return null;
          return (
            <group key={`${r}${c}`} position={[-0.52 + c * 0.26, 0.1, -0.33 + r * 0.22]} scale={s}>
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
                <Fosco cor={mistura(folha, tema.objetoEscuro, 0.4)} />
              </mesh>
              <mesh position={[0, 0.2, 0]} castShadow>
                <sphereGeometry args={[0.07, 12, 10]} />
                <Fosco cor={folha} emissivo={0.08} />
              </mesh>
            </group>
          );
        }),
      )}
    </group>
  );
};

// ---------- Plataforma de petróleo em miniatura (1,2 × 1,6 de altura até a torre) ----------
// Genérica, sem marca: 4 pernas, deck, torre treliçada e uma chama-piloto apagada (sem fogo).
export const PlataformaPetroleo: React.FC<{tema: Tema; pos: V3; escala: number; luz?: number}> = ({tema, pos, escala, luz = 0}) => {
  if (escala < 0.02) return null;
  const aco = mistura(tema.objeto, tema.objetoClaro, 0.25);
  return (
    <group position={pos} scale={escala}>
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => <Caixa key={`${x}${z}`} args={[0.1, 0.7, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[x * 0.45, 0.35, z * 0.35]} />),
      )}
      <Caixa args={[1.2, 0.12, 0.95]} raio={0.03} cor={aco} position={[0, 0.76, 0]} />
      <Caixa args={[0.5, 0.3, 0.4]} raio={0.04} cor={tema.objeto} position={[-0.3, 0.97, 0.15]} />
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[0.36 - i * 0.06, 0.05, 0.36 - i * 0.06]} raio={0.015} cor={aco} position={[0.3, 0.95 + i * 0.22, -0.1]} />
      ))}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`p${x}${z}`} position={[0.3 + x * 0.12, 1.25, -0.1 + z * 0.12]} rotation={[z * 0.12, 0, -x * 0.12]}>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
            <Fosco cor={tema.objetoEscuro} />
          </mesh>
        )),
      )}
      <mesh position={[0.3, 1.66, -0.1]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.6 * luz} />
      </mesh>
    </group>
  );
};
