import React from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, Placa, type V3} from '../base/pecas';
import {type Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';

// Peças: Crime hediondo: o livro da lei gigante, estilo pop-up.
// Medidas do livro (lombada no x = 0, folhas para -x e +x, o pé do livro virado para +z).
export const LIVRO = {meia: 9.2, prof: 12.4, capa: 0.12, bloco: 0.42};
// Altura da superfície das folhas. O livro todo fica acima do chão do Palco (regra do chão piscando).
export const YP = 0.06 + LIVRO.capa + LIVRO.bloco;

// Papel envelhecido, em tom médio: papel claro no tema escuro estoura com o bloom
export const papel = (tema: Tema) => mistura(tema.branco, tema.areia, 0.38);

// ---------- O livro aberto ----------
// `fechaDir` 0..1: a metade direita levanta (o livro fecha até a metade, no final).
// `corPag`: a faixa colorida da borda da página atual.
export const LivroPopUp: React.FC<{tema: Tema; corPag: string; fechaDir?: number; children?: React.ReactNode; dir?: React.ReactNode}> = ({tema, corPag, fechaDir = 0, children, dir}) => {
  const {meia, prof, capa, bloco} = LIVRO;
  const capaCor = mistura(tema.acento, tema.objetoEscuro, 0.35);
  const folha = papel(tema);
  const borda = mistura(folha, tema.objetoEscuro, 0.25);
  const metade = (lado: -1 | 1, conteudo?: React.ReactNode) => (
    <group>
      {/* Capa dura */}
      <Caixa args={[meia + 0.25, capa, prof + 0.5]} raio={0.04} cor={capaCor} position={[lado * (meia / 2 + 0.05), 0.06 + capa / 2, 0]} />
      {/* Bloco de folhas (as bordas mostram as páginas) */}
      {/* O topo do bloco fica 0,015 abaixo da folha: colados, os dois brigavam (chuvisco) */}
      <Caixa args={[meia - 0.2, bloco - 0.015, prof]} raio={0.03} cor={borda} position={[lado * (meia / 2 + 0.1), 0.06 + capa + (bloco - 0.015) / 2, 0]} />
      {/* Folha de cima */}
      <mesh position={[lado * (meia / 2 + 0.1), YP - 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[meia - 0.2, prof]} />
        <meshStandardMaterial color={folha} roughness={0.95} />
      </mesh>
      {/* Faixa colorida da página (cor do capítulo) */}
      <mesh position={[lado * (meia - 0.3), YP + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.32, prof - 0.6]} />
        <meshStandardMaterial color={corPag} emissive={corPag} emissiveIntensity={0.25} roughness={0.8} />
      </mesh>
      {conteudo}
    </group>
  );
  return (
    <group>
      {/* Lombada */}
      <mesh position={[0, 0.06 + capa / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, prof + 0.5, 20, 1, false, Math.PI, Math.PI]} />
        <Fosco cor={capaCor} />
      </mesh>
      {metade(-1, children)}
      {/* A metade direita gira em torno da lombada para fechar */}
      <group rotation={[0, 0, (fechaDir * Math.PI * 0.42)]}>{metade(1, dir)}</group>
    </group>
  );
};

// ---------- Folha que vira (da direita para a esquerda) ----------
// `k` 0..1: 0 deitada à direita, 1 deitada à esquerda. A folha curva um pouco no meio do caminho.
export const FolhaVirando: React.FC<{tema: Tema; k: number; cor: string}> = ({tema, k, cor}) => {
  if (k <= 0.001 || k >= 0.999) return null;
  const {meia, prof} = LIVRO;
  const n = 4;
  const L = (meia - 0.2) / n;
  const a = Math.PI * k;
  const curva = 0.35 * Math.sin(Math.PI * k);
  const folha = papel(tema);
  // Segmentos encadeados: cada um gira um pouco mais que o anterior (curva da página)
  const seg = (i: number): React.ReactNode => (
    <group position={[i === 0 ? 0.1 : L, 0, 0]} rotation={[0, 0, i === 0 ? a : -curva / n]}>
      <mesh position={[L / 2, 0, 0]} castShadow>
        <boxGeometry args={[L + 0.01, 0.02, prof]} />
        <meshStandardMaterial color={folha} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {i === n - 1 ? (
        <mesh position={[L - 0.25, 0.012, 0]}>
          <boxGeometry args={[0.3, 0.004, prof - 0.6]} />
          <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.25} />
        </mesh>
      ) : (
        seg(i + 1)
      )}
    </group>
  );
  return <group position={[0, YP + 0.01, 0]}>{seg(0)}</group>;
};

// ---------- Dobradiça do pop-up ----------
// `k` 0..1: 0 deitado no papel (tombado para trás), 1 em pé. Tudo se levanta da folha.
export const PopUp: React.FC<{pos: V3; k: number; rotY?: number; children: React.ReactNode}> = ({pos, k, rotY = 0, children}) => {
  if (k <= 0.01) return null;
  const a = (-Math.PI / 2) * (1 - Math.min(1.15, k));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <group rotation={[a, 0, 0]}>{children}</group>
    </group>
  );
};

// Base de papelão de cada pop-up (a "aba" colada na folha)
export const Aba: React.FC<{tema: Tema; larg: number; cor?: string}> = ({tema, larg, cor}) => (
  <Caixa args={[larg, 0.05, 0.5]} raio={0.02} cor={cor ?? mistura(papel(tema), tema.objetoEscuro, 0.2)} position={[0, 0.025, 0.1]} />
);

// ---------- Cartaz com texto (citação e frase popular) ----------
// Texto fixo em textura (Placa); o destaque é feito no material da moldura, nunca no texto.
export const Cartaz: React.FC<{tema: Tema; larg: number; alt: number; linhas: {t: string; tam: number; cor: string; peso?: number}[]; moldura: string; fundo: string; brilho?: number}> = ({tema, larg, alt, linhas, moldura, fundo, brilho = 0}) => (
  <group>
    <Aba tema={tema} larg={larg * 0.8} />
    <Caixa args={[larg + 0.22, alt + 0.22, 0.08]} raio={0.05} cor={moldura} emissivo={0.15 + 0.4 * brilho} position={[0, alt / 2 + 0.12, -0.03]} />
    <Placa tema={tema} pos={[0, alt / 2 + 0.12, 0.03]} larg={larg} alt={alt} linhas={linhas} fundo={fundo} />
  </group>
);

// ---------- Arma (fosca, sem disparo; perfil de lado, como um recorte) ----------
export const Arma: React.FC<{tema: Tema; pos?: V3; rot?: V3; escala?: number}> = ({tema, pos = [0, 0, 0], rot = [0, 0, 0], escala = 1}) => {
  const c = mistura(tema.objetoEscuro, tema.fundo, 0.3);
  const c2 = mistura(tema.objetoEscuro, tema.objeto, 0.2);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      {/* Ferrolho */}
      <Caixa args={[1.0, 0.24, 0.16]} raio={0.04} cor={c2} position={[0.12, 0.62, 0]} />
      {/* Cano */}
      <mesh position={[0.66, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
        <Fosco cor={c} />
      </mesh>
      {/* Empunhadura inclinada */}
      <Caixa args={[0.26, 0.62, 0.15]} raio={0.05} cor={c} position={[-0.22, 0.27, 0]} rotation={[0, 0, 0.22]} />
      {/* Guarda-mato e gatilho */}
      <mesh position={[0.06, 0.42, 0]}>
        <torusGeometry args={[0.1, 0.022, 8, 18, Math.PI]} />
        <Fosco cor={c} />
      </mesh>
      <Caixa args={[0.03, 0.1, 0.04]} raio={0.01} cor={c2} position={[0.04, 0.44, 0]} rotation={[0, 0, -0.3]} />
    </group>
  );
};

// ---------- Pacote (droga): tijolo embrulhado com fita e etiqueta ----------
export const Pacote: React.FC<{tema: Tema; pos?: V3; rot?: V3; escala?: number}> = ({tema, pos = [0, 0, 0], rot = [0, 0, 0], escala = 1}) => (
  <group position={pos} rotation={rot} scale={escala}>
    <Caixa args={[0.6, 0.26, 0.38]} raio={0.06} cor={mistura(tema.areia, tema.objetoEscuro, 0.35)} />
    {[-0.16, 0.16].map((x) => (
      <Caixa key={x} args={[0.06, 0.27, 0.39]} raio={0.01} cor={mistura(tema.areia, tema.objetoClaro, 0.3)} sombra={false} position={[x, 0, 0]} />
    ))}
    <Placa tema={tema} pos={[0, 0.02, 0.2]} larg={0.42} alt={0.14} linhas={[{t: 'DROGA', tam: 230, cor: tema.texto, peso: 900}]} fundo={tema.acento} />
  </group>
);

// ---------- Estante dos crimes hediondos: 5 gavetas que acendem ----------
export const CRIMES = ['LATROCÍNIO', 'ESTUPRO', 'SEQUESTRO', 'HOMICÍDIO QUALIF.', 'TRÁFICO'];
export const ALT_ESTANTE = 4.6;
export const Estante: React.FC<{tema: Tema; acesas: number[]; cor: string}> = ({tema, acesas, cor}) => {
  const L = 4.4;
  const h = 0.78;
  const madeira = mistura(tema.objetoEscuro, cor, 0.3);
  return (
    <group>
      <Aba tema={tema} larg={L} />
      <Caixa args={[L + 0.3, ALT_ESTANTE, 0.9]} raio={0.06} cor={madeira} position={[0, ALT_ESTANTE / 2, -0.35]} />
      {CRIMES.map((c, i) => {
        const k = acesas[i] ?? 0;
        const y = ALT_ESTANTE - 0.55 - i * (h + 0.08);
        return (
          <group key={c} position={[0, y, 0.12]}>
            <Caixa args={[L - 0.1, h, 0.12]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.acento, 0.85 * k)} emissivo={0.08 + 0.45 * k} />
            <Placa tema={tema} pos={[0.25, 0, 0.075]} larg={3.3} alt={0.56} linhas={[{t: c, tam: 112, cor: tema.texto, peso: 900}]} fundo={mistura(tema.fundo, tema.objetoEscuro, 0.4)} />
            {/* Puxador */}
            <Caixa args={[0.12, 0.34, 0.1]} raio={0.03} cor={mistura(tema.objeto, tema.acento, k)} emissivo={0.5 * k} position={[-1.85, 0, 0.1]} />
          </group>
        );
      })}
    </group>
  );
};

// ---------- Porta com nome (abre ou fecha) ----------
// `abre` 0..1 gira a folha da porta; `luz` acende o lado de dentro.
export const PortaNome: React.FC<{tema: Tema; nome: string; abre: number; luz: number; cor: string; trancada?: number}> = ({tema, nome, abre, luz, cor, trancada = 0}) => {
  const L = 1.5;
  const A = 2.6;
  const moldura = mistura(tema.objetoEscuro, cor, 0.35);
  return (
    <group>
      <Aba tema={tema} larg={L + 0.6} />
      {/* Batentes e verga */}
      {[-1, 1].map((s) => (
        <Caixa key={s} args={[0.18, A, 0.3]} raio={0.03} cor={moldura} position={[s * (L / 2 + 0.09), A / 2, 0]} />
      ))}
      <Caixa args={[L + 0.36, 0.2, 0.3]} raio={0.03} cor={moldura} position={[0, A + 0.1, 0]} />
      {/* Luz do lado de dentro */}
      <mesh position={[0, A / 2, -0.12]}>
        <planeGeometry args={[L, A]} />
        <meshStandardMaterial color={mistura(tema.fundo, cor, 0.35 + 0.5 * luz)} emissive={cor} emissiveIntensity={0.9 * luz} />
      </mesh>
      {/* Folha da porta, presa à esquerda */}
      <group position={[-L / 2, 0, 0.02]} rotation={[0, -abre * 1.9, 0]}>
        <Caixa args={[L - 0.04, A - 0.06, 0.08]} raio={0.03} cor={mistura(mistura(tema.objeto, cor, 0.25), tema.acento, 0.7 * trancada)} emissivo={0.25 * trancada} position={[L / 2, A / 2, 0]} />
        <mesh position={[L - 0.2, A / 2, 0.07]}>
          <sphereGeometry args={[0.06, 12, 10]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      </group>
      {/* Nome em cima */}
      <Placa tema={tema} pos={[0, A + 0.55, 0.05]} larg={2.0} alt={0.5} linhas={[{t: nome, tam: nome.length > 6 ? 105 : 200, cor: tema.texto, peso: 900}]} fundo={mistura(tema.objetoEscuro, cor, 0.55)} />
    </group>
  );
};

// ---------- Boné (vai como filho do Boneco) ----------
export const Bone: React.FC<{cor: string}> = ({cor}) => (
  <group position={[0, 1.93, 0]}>
    <mesh scale={[1, 0.62, 1]}>
      <sphereGeometry args={[0.17, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Fosco cor={cor} />
    </mesh>
    <mesh position={[0, 0.005, 0.17]} rotation={[0.12, 0, 0]} scale={[1, 1, 0.7]}>
      <cylinderGeometry args={[0.14, 0.14, 0.02, 20, 1, false, -Math.PI / 2, Math.PI]} />
      <Fosco cor={cor} />
    </mesh>
  </group>
);

// ---------- Pilha de anos: blocos que empilham (1 bloco = 1 ano) ----------
// `n` pode ser fracionário: o último bloco cai. `cor` dos blocos; `topo` acende o último.
export const PilhaAnos: React.FC<{tema: Tema; pos: V3; n: number; cor: string; passo?: number; larg?: number; brilho?: number}> = ({tema, pos, n, cor, passo = 0.12, larg = 0.9, brilho = 0}) => {
  if (n <= 0.01) return null;
  const inteiros = Math.floor(n);
  const fr = n - inteiros;
  return (
    <group position={pos}>
      {Array.from({length: inteiros + (fr > 0.02 ? 1 : 0)}).map((_, i) => {
        const cai = i === inteiros ? (1 - fr) * 1.2 : 0;
        const c = i % 5 === 4 ? mistura(cor, tema.objetoClaro, 0.25) : cor;
        return <Caixa key={i} args={[larg, passo * 0.9, larg * 0.7]} raio={0.02} cor={c} emissivo={0.12 + 0.35 * brilho} position={[0, passo * (i + 0.5) + cai, 0]} rotation={[0, (i % 2) * 0.06 - 0.03, 0]} />;
      })}
    </group>
  );
};

// ---------- Escada das idades (18, 17, 16) ----------
export const EscadaIdade: React.FC<{tema: Tema; cor: string}> = ({tema, cor}) => (
  <group>
    <Aba tema={tema} larg={3.4} />
    {[18, 17, 16].map((n, i) => {
      const h = 1.5 - i * 0.45;
      return (
        <group key={n} position={[-1.1 + i * 1.1, 0, 0]}>
          <Caixa args={[1.05, h, 0.9]} raio={0.04} cor={mistura(tema.objetoEscuro, cor, 0.25 + 0.15 * i)} position={[0, h / 2, -0.2]} />
          <Placa tema={tema} pos={[0, h - 0.32, 0.27]} larg={0.8} alt={0.45} linhas={[{t: `${n}`, tam: 300, cor: tema.texto, peso: 900}]} fundo={mistura(tema.fundo, cor, 0.25)} />
        </group>
      );
    })}
  </group>
);

// ---------- Nuvem cinza (desesperança): esferas foscas, chuva fina e lenta ----------
export const Nuvem: React.FC<{tema: Tema; k: number; t: number}> = ({tema, k, t}) => {
  if (k < 0.02) return null;
  const c = mistura(tema.corpo, tema.objetoEscuro, 0.3);
  return (
    <group scale={k}>
      {[
        [0, 0, 0, 0.6],
        [0.6, -0.08, 0.1, 0.45],
        [-0.6, -0.1, 0, 0.48],
        [0.25, 0.28, -0.1, 0.42],
        [-0.3, 0.22, 0.05, 0.4],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 20, 16]} />
          <Fosco cor={c} />
        </mesh>
      ))}
      {Array.from({length: 10}).map((_, i) => {
        const u = (t * 0.6 + i * 0.137) % 1;
        return (
          <mesh key={i} position={[-0.8 + (i % 5) * 0.4, -0.5 - u * 1.4, -0.2 + Math.floor(i / 5) * 0.3]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 6]} />
            <meshStandardMaterial color={mistura(tema.objeto, tema.corpo, 0.4)} transparent opacity={0.6 * (1 - u)} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Casinha simples (bairro do mapa de PE) ----------
export const Casinha: React.FC<{tema: Tema; pos: V3; cor: string; escala?: number}> = ({tema, pos, cor, escala = 1}) => (
  <group position={pos} scale={escala}>
    <Caixa args={[0.6, 0.5, 0.5]} raio={0.03} cor={mistura(tema.objeto, cor, 0.3)} position={[0, 0.25, 0]} />
    <mesh position={[0, 0.62, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.48, 0.3, 4]} />
      <Fosco cor={mistura(cor, tema.objetoEscuro, 0.3)} />
    </mesh>
  </group>
);

// Cores das 7 páginas (plano.md, seção 2)
export const coresPaginas = (tema: Tema) => {
  const F = festa(tema);
  return [F.azulNoite, F.roxo, F.turquesa, F.dourado, F.azul, F.verde, F.rosa];
};
