import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Caixa, Fosco, geoCaixa, Placa, type Linha, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';

// ═══════════════════════════════════════════════════════════════
// BOMBA DE GASOLINA: posto de esquina genérico, noite, sem marca
// ═══════════════════════════════════════════════════════════════
export const Bomba: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  // visor mostra o valor em BRL (ex: "6,10")
  preco?: string;
  // 0..1 piscando do visor (0 = apagado, 1 = aceso)
  visora?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, preco = '5,80', visora = 1, escala = 1}) => {
  const corCorpo = tema.objetoEscuro;
  const corAcab = tema.branco;
  const corVisor = tema.acento;

  // Textura do visor (canvas com preço)
  const texVisor = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 200;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, 512, 200);
    ctx.font = '700 130px "Helvetica Neue", Arial, monospace';
    ctx.fillStyle = corVisor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`R$ ${preco}`, 256, 100);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preco, corVisor]);

  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Corpo principal */}
      <Caixa args={[0.9, 1.7, 0.55]} raio={0.06} cor={corCorpo} position={[0, 0.85, 0]} />
      {/* Acabamento superior */}
      <Caixa args={[0.95, 0.1, 0.6]} raio={0.04} cor={corAcab} position={[0, 1.75, 0]} />
      {/* Painel frente */}
      <Caixa args={[0.7, 0.9, 0.04]} raio={0.03} cor="#111" position={[0, 1.1, 0.285]} />
      {/* Visor */}
      <mesh position={[0, 1.22, 0.31]}>
        <planeGeometry args={[0.55, 0.2]} />
        <meshStandardMaterial
          map={texVisor}
          emissive={corVisor}
          emissiveIntensity={visora * 0.8}
          roughness={0.3}
        />
      </mesh>
      {/* Friso lateral esq/dir */}
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.04, 1.7, 0.56]} raio={0.02} cor={corAcab} position={[l * 0.47, 0.85, 0]} />
      ))}
      {/* Mangueira: cano fino saindo do lado */}
      <mesh position={[-0.55, 0.72, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.68, 10]} />
        <Fosco cor={corCorpo} />
      </mesh>
      {/* Bico da mangueira */}
      <Caixa args={[0.08, 0.22, 0.08]} raio={0.025} cor={corCorpo} position={[-0.74, 0.46, 0]} />
      {/* Base da bomba */}
      <Caixa args={[1.02, 0.08, 0.65]} raio={0.02} cor={corAcab} position={[0, 0.04, 0]} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// CUBO FATIAS: 5 camadas translúcidas empilhadas verticalmente
// Representa os 5 "donos" de cada litro de gasolina
// ═══════════════════════════════════════════════════════════════
export type FatiaInfo = {
  label: string;    // nome da fatia
  pct: number;      // 0..1 altura proporcional
  cor: string;
  destaque?: boolean;
};

export const FATIAS_GASOLINA: FatiaInfo[] = [
  {label: 'REFINARIA', pct: 0.22, cor: '#3A4350'},
  {label: 'ETANOL', pct: 0.12, cor: '#5A6370'},
  {label: 'DISTRIBUIDORA', pct: 0.18, cor: '#4A5360'},
  {label: 'POSTO', pct: 0.14, cor: '#6A7380'},
  {label: 'GOVERNO', pct: 0.34, cor: '#C23B2A', destaque: true},
];

// Fatias para cena da eleição (inclui impostos federais zeráveis: índice 5)
export const FATIAS_ELEICAO: FatiaInfo[] = [
  {label: 'REFINARIA', pct: 0.19, cor: '#3A4350'},
  {label: 'ETANOL', pct: 0.10, cor: '#5A6370'},
  {label: 'DISTRIBUIDORA', pct: 0.16, cor: '#4A5360'},
  {label: 'POSTO', pct: 0.12, cor: '#6A7380'},
  {label: 'ICMS', pct: 0.21, cor: '#C23B2A', destaque: true},
  {label: 'FEDERAIS', pct: 0.22, cor: '#E05A1A', destaque: true},
];

export const CuboFatias: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  fatias: FatiaInfo[];
  altTotal?: number;
  larg?: number;
  // 0..1: quanto cada fatia já surgiu (para animação de entrada)
  aparece?: number;
  // array individual por fatia (sobrescreve aparece quando fornecido)
  apareceCada?: number[];
  // índice da fatia destacada (pisca)
  destaqueIdx?: number;
  destaqueK?: number;
}> = ({tema, pos, rotY = 0, fatias, altTotal = 3.2, larg = 1.6, aparece = 1, apareceCada, destaqueIdx = -1, destaqueK = 0}) => {
  let yAcum = 0;

  const texsFatia = useMemo(() => {
    return fatias.map((f) => {
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.clearRect(0, 0, 512, 128);
      ctx.font = '700 70px "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.label, 256, 64);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fatias.map(f => f.label).join(',')]);

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {fatias.map((f, i) => {
        const h = f.pct * altTotal;
        const yBase = yAcum;
        yAcum += h;
        const isDestaque = i === destaqueIdx || f.destaque;
        const apareceFatia = apareceCada ? Math.max(0, Math.min(1, apareceCada[i] ?? 1)) : Math.max(0, Math.min(1, (aparece - i * 0.12) / 0.4));
        return (
          <group key={i} position={[0, yBase + h / 2, 0]} scale={[1, apareceFatia, 1]}>
            {/* Caixa translúcida */}
            <mesh castShadow>
              <boxGeometry args={[larg, h * 0.97, larg]} />
              <meshStandardMaterial
                color={f.cor}
                transparent
                opacity={0.82}
                roughness={0.35}
                metalness={0.05}
                emissive={isDestaque && destaqueK > 0 ? f.cor : '#000000'}
                emissiveIntensity={isDestaque ? destaqueK * 0.3 : 0}
              />
            </mesh>
            {/* Borda sutil */}
            <mesh>
              <boxGeometry args={[larg + 0.02, h * 0.97 + 0.02, larg + 0.02]} />
              <meshStandardMaterial color={f.cor} transparent opacity={0.25} side={THREE.BackSide} />
            </mesh>
            {/* Texto */}
            <mesh position={[0, 0, larg / 2 + 0.015]}>
              <planeGeometry args={[larg * 0.88, h * 0.6]} />
              <meshStandardMaterial map={texsFatia[i]} transparent roughness={1} />
            </mesh>
            {/* Texto verso */}
            <mesh position={[0, 0, -(larg / 2 + 0.015)]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[larg * 0.88, h * 0.6]} />
              <meshStandardMaterial map={texsFatia[i]} transparent roughness={1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEDIDOR: mostrador circular com agulha (petróleo caindo e ICMS bloqueado)
// ═══════════════════════════════════════════════════════════════
export const Medidor: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  label: string;       // "PETRÓLEO" ou "ICMS"
  valor: number;       // 0..1 posição da agulha (0=min, 1=max)
  bloqueado?: boolean;
  bloqueioK?: number;  // 0..1 quanto o cadeado apareceu
  acento?: boolean;    // se true, usa acento na agulha
  escala?: number;
}> = ({tema, pos, rotY = 0, label, valor, bloqueado, bloqueioK = 0, acento, escala = 1}) => {
  const corAro = tema.branco;
  const corAgulha = acento || bloqueado ? tema.acento : tema.corpo;
  const angMin = -Math.PI * 0.75;
  const angMax = Math.PI * 0.75;
  const angAgulha = angMin + (angMax - angMin) * valor;

  const texLabel = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 200;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 200);
    ctx.font = '800 90px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = acento || bloqueado ? '#C23B2A' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 100);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, acento, bloqueado]);

  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Aro do medidor */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 64, 1, false, angMin - 0.1, angMax - angMin + 0.2]} />
        <meshStandardMaterial color={corAro} roughness={0.45} />
      </mesh>
      {/* Fundo do disco */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.04, 64]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.7} />
      </mesh>
      {/* Agulha */}
      <group rotation={[0, 0, -angAgulha]} position={[0, 0, 0.07]}>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.44, 0.025, 0.02]} />
          <meshStandardMaterial color={corAgulha} emissive={corAgulha} emissiveIntensity={bloqueado ? 0 : 0.15} roughness={0.3} />
        </mesh>
        {/* Pivô */}
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.04, 20]} />
          <meshStandardMaterial color={tema.tinta} roughness={0.4} />
        </mesh>
      </group>
      {/* Label abaixo */}
      <mesh position={[0, -0.5, 0.07]}>
        <planeGeometry args={[0.9, 0.2]} />
        <meshStandardMaterial map={texLabel} transparent roughness={1} />
      </mesh>
      {/* Cadeado (aparece com bloqueioK) */}
      {bloqueado && bloqueioK > 0 && (
        <group position={[0, 0.15, 0.1]} scale={bloqueioK}>
          {/* Corpo do cadeado */}
          <Caixa args={[0.28, 0.24, 0.1]} raio={0.04} cor={tema.acento} position={[0, -0.1, 0]} />
          {/* Arco */}
          <mesh rotation={[0, 0, 0]} position={[0, 0.08, 0]}>
            <torusGeometry args={[0.1, 0.03, 12, 24, Math.PI]} />
            <Fosco cor={tema.acento} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// TANQUES SUBTERRÂNEOS: dois cilindros enterrados, vendo pelo raio-X
// ═══════════════════════════════════════════════════════════════
export const Tanque: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  label: string;        // "ALTA" ou "QUEDA"
  nivelAtual: number;   // 0..1
  labelAparece?: number;
  etiquetaFlip?: boolean;  // se true, o número vira (o preço mudou)
  etiquetaK?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, label, nivelAtual, labelAparece = 1, etiquetaFlip, etiquetaK = 0, escala = 1}) => {
  const R = 0.55;
  const H = 1.8;
  const nivel = Math.max(0.01, Math.min(0.99, nivelAtual));
  const corCombustivel = label === 'ALTA' ? '#C23B2A' : tema.objeto;

  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Tanque (cilindro deitado) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[R, R, H, 40]} />
        <meshStandardMaterial color={tema.objetoEscuro} roughness={0.55} metalness={0.15} transparent opacity={0.65} />
      </mesh>
      {/* Nível do combustível */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -R * (1 - nivel), 0]}>
        <cylinderGeometry args={[R * nivel * 0.98, R * nivel * 0.98, H - 0.04, 40]} />
        <meshStandardMaterial color={corCombustivel} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      {/* Tampa esq/dir */}
      {[-1, 1].map((l) => (
        <mesh key={l} position={[0, 0, l * (H / 2 + 0.01)]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 40]} />
          <meshStandardMaterial color={tema.objetoEscuro} roughness={0.55} transparent opacity={0.65} />
        </mesh>
      ))}
      {/* Etiqueta de preço (flip quando não muda) */}
      <group position={[0, R + 0.28, 0]} scale={labelAparece}>
        <Caixa args={[0.8, 0.32, 0.06]} raio={0.04}
          cor={etiquetaFlip ? tema.acento : tema.branco}
          position={[0, 0, 0]}
        />
        {/* Texto label */}
        <mesh position={[0, 0.48, 0]}>
          <planeGeometry args={[0.7, 0.2]} />
          <LabelTex label={label} cor={tema.texto} />
        </mesh>
      </group>
    </group>
  );
};

// Helper mini para texto num plano
const LabelTex: React.FC<{label: string; cor: string}> = ({label, cor}) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 180;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 180);
    ctx.font = '800 100px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = cor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 90);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, cor]);
  return <meshStandardMaterial map={tex} transparent roughness={1} />;
};

// ═══════════════════════════════════════════════════════════════
// GLOBO WIREFRAME: esfera de linhas representando o mercado mundial
// ═══════════════════════════════════════════════════════════════
export const GloboWireframe: React.FC<{
  pos: V3;
  rotY?: number;
  cor?: string;
  escala?: number;
  t?: number; // rotação contínua
}> = ({pos, rotY = 0, cor = '#5F6977', escala = 1, t = 0}) => (
  <group position={pos} rotation={[0, rotY + t * 0.4, 0]} scale={escala}>
    <mesh>
      <sphereGeometry args={[0.7, 20, 12]} />
      <meshStandardMaterial color={cor} wireframe roughness={0.8} />
    </mesh>
    {/* Eixo */}
    <mesh rotation={[0.3, 0, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
      <meshStandardMaterial color={cor} roughness={0.5} />
    </mesh>
  </group>
);

// ═══════════════════════════════════════════════════════════════
// FOGUETE E PENA: cena de assimetria
// ═══════════════════════════════════════════════════════════════
export const Foguete: React.FC<{
  pos: V3;
  subida?: number; // 0..1
  cor?: string;
  escala?: number;
}> = ({pos, subida = 0, cor = '#C9D0D9', escala = 1}) => {
  const y = subida * 1.8;
  return (
    <group position={[pos[0], pos[1] + y, pos[2]]} scale={escala}>
      {/* Corpo */}
      <Caixa args={[0.28, 0.9, 0.28]} raio={0.08} cor={cor} position={[0, 0.45, 0]} />
      {/* Nariz cônico */}
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.14, 0.35, 20]} />
        <Fosco cor={cor} />
      </mesh>
      {/* Aletas */}
      {[-1, 1].map((l) => (
        <group key={l}>
          <mesh position={[l * 0.22, 0.15, 0]} rotation={[0, 0, l * 0.45]}>
            <boxGeometry args={[0.18, 0.28, 0.04]} />
            <Fosco cor={cor} />
          </mesh>
        </group>
      ))}
      {/* Chama */}
      {subida < 0.98 && (
        <mesh position={[0, -0.08, 0]}>
          <coneGeometry args={[0.09, 0.32, 14]} />
          <meshStandardMaterial color="#FF6A1F" emissive="#FF3300" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      )}
    </group>
  );
};

export const PenaQueda: React.FC<{
  pos: V3;
  descida?: number; // 0..1
  cor?: string;
  t?: number;
}> = ({pos, descida = 0, cor = '#C9D0D9', t = 0}) => {
  const y = -descida * 0.9;
  const rotZ = Math.sin(t * 2.2) * 0.12;
  const rotX = Math.sin(t * 1.8 + 1) * 0.08;
  return (
    <group position={[pos[0], pos[1] + y, pos[2]]} rotation={[rotX, 0, rotZ]}>
      {/* Cano central */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.025, 0.9, 10]} />
        <Fosco cor={cor} />
      </mesh>
      {/* Barbas */}
      {Array.from({length: 14}).map((_, i) => {
        const ang = (i / 13 - 0.5) * 0.52;
        const hOffset = (i / 13 - 0.5) * 0.82;
        return (
          <mesh key={i} position={[Math.sin(ang) * 0.18, hOffset, 0]} rotation={[0, 0, ang * 0.6]}>
            <boxGeometry args={[0.28 * Math.cos(ang), 0.018, 0.008]} />
            <Fosco cor={cor} />
          </mesh>
        );
      })}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// URNA GENÉRICA: cubo com fenda, sem logos
// ═══════════════════════════════════════════════════════════════
export const Urna: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, escala = 1}) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
    {/* Corpo */}
    <Caixa args={[1.2, 0.9, 0.8]} raio={0.06} cor={tema.branco} position={[0, 0.45, 0]} />
    {/* Topo */}
    <Caixa args={[1.24, 0.1, 0.84]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.95, 0]} />
    {/* Fenda */}
    <mesh position={[0, 0.95, 0.43]}>
      <boxGeometry args={[0.5, 0.025, 0.02]} />
      <meshStandardMaterial color="#0A0A0A" />
    </mesh>
    {/* Base */}
    <Caixa args={[1.3, 0.06, 0.9]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.03, 0]} />
    {/* Handle da urna */}
    <Caixa args={[0.35, 0.08, 0.08]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.86, 0.46]} />
  </group>
);

// ═══════════════════════════════════════════════════════════════
// ÍCONES CTA: bookmark, seta compartilhar, balão de comentário
// ═══════════════════════════════════════════════════════════════
export const IconeBookmark: React.FC<{pos: V3; cor: string; escala?: number}> = ({pos, cor, escala = 1}) => (
  <group position={pos} scale={escala}>
    {/* Forma do marcador */}
    <Caixa args={[0.4, 0.55, 0.06]} raio={0.04} cor={cor} position={[0, 0.1, 0]} />
    {/* Ponta V */}
    <mesh position={[0, -0.24, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.2, 0.22, 4]} />
      <Fosco cor={cor} />
    </mesh>
  </group>
);

export const IconeSeta: React.FC<{pos: V3; cor: string; escala?: number; t?: number}> = ({pos, cor, escala = 1, t = 0}) => {
  const pulse = 1 + Math.sin(t * 4) * 0.06;
  return (
    <group position={pos} scale={[escala * pulse, escala * pulse, escala]} rotation={[0, 0, 0]}>
      {/* Corpo da seta */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
        <Fosco cor={cor} />
      </mesh>
      {/* Ponta */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.15, 0.28, 14]} />
        <Fosco cor={cor} />
      </mesh>
    </group>
  );
};

export const IconeBalao: React.FC<{pos: V3; cor: string; escala?: number}> = ({pos, cor, escala = 1}) => (
  <group position={pos} scale={escala}>
    {/* Bolha */}
    <mesh scale={[1, 0.9, 0.3]} castShadow>
      <sphereGeometry args={[0.35, 28, 20]} />
      <Fosco cor={cor} />
    </mesh>
    {/* Rabo do balão */}
    <mesh position={[-0.18, -0.32, 0]} rotation={[0, 0, 0.4]}>
      <coneGeometry args={[0.1, 0.26, 10]} />
      <Fosco cor={cor} />
    </mesh>
  </group>
);

// ═══════════════════════════════════════════════════════════════
// POSTO: posto de gasolina completo (cobertura, colunas, bombas, placa)
// ═══════════════════════════════════════════════════════════════
export const Posto: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  preco?: string;
  visora?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, preco = '6,10', visora = 1, escala = 1}) => {
  const texVisor = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 200;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, 512, 200);
    ctx.font = '700 120px "Helvetica Neue", Arial, monospace';
    ctx.fillStyle = tema.acento;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`R$ ${preco}`, 256, 100);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [preco, tema.acento]);

  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Piso */}
      <Caixa args={[4.2, 0.08, 2.4]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      {/* Colunas */}
      {[-1.4, 1.4].map((x) => (
        <Caixa key={x} args={[0.18, 2.2, 0.18]} raio={0.05} cor={tema.branco} position={[x, 1.1, 0]} />
      ))}
      {/* Laje da cobertura */}
      <Caixa args={[4.0, 0.18, 2.1]} raio={0.06} cor={tema.branco} position={[0, 2.24, 0]} />
      {/* Faixa acento */}
      <Caixa args={[4.02, 0.22, 0.12]} raio={0.04} cor={tema.acento} position={[0, 2.12, 1.06]} />
      {/* 2 Bombas */}
      {[-0.7, 0.7].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Caixa args={[0.7, 1.4, 0.45]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.7, 0]} />
          <Caixa args={[0.72, 0.08, 0.47]} raio={0.02} cor={tema.branco} position={[0, 1.44, 0]} />
          <mesh position={[0, 0.95, 0.24]}>
            <planeGeometry args={[0.46, 0.18]} />
            <meshStandardMaterial
              map={texVisor}
              emissive={tema.acento}
              emissiveIntensity={visora * 0.9}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      {/* Placa de preço no topo */}
      <Caixa args={[1.1, 0.5, 0.08]} raio={0.05} cor="#111" position={[0, 2.55, 0.9]} />
      <mesh position={[0, 2.55, 0.95]}>
        <planeGeometry args={[0.9, 0.38]} />
        <meshStandardMaterial
          map={texVisor}
          emissive={tema.acento}
          emissiveIntensity={visora * 1.2}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// JORNAL: jornal 3D com manchete em canvas, abre como folha
// ═══════════════════════════════════════════════════════════════
export const Jornal: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  titulo?: string;
  abre?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, titulo = 'PETRÓLEO CAI', abre = 0, escala = 1}) => {
  const texFolha = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 640;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = '#F4F0E8';
    ctx.fillRect(0, 0, 512, 640);
    ctx.fillStyle = '#1C1C1C';
    ctx.fillRect(0, 0, 512, 90);
    ctx.font = '700 52px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DIÁRIO', 256, 45);
    ctx.fillStyle = tema.acento;
    ctx.fillRect(20, 94, 472, 5);
    ctx.font = '800 72px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#111';
    ctx.fillText(titulo, 256, 165);
    ctx.font = '400 32px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#444';
    const linhas = ['Queda no mercado internacional', 'não chega ao consumidor', 'brasileiro no posto.'];
    linhas.forEach((l, i) => ctx.fillText(l, 256, 250 + i * 44));
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [titulo, tema.acento]);

  const angAbre = (1 - abre) * Math.PI / 2;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Folha principal */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.1, 0.015]} />
        <meshStandardMaterial map={texFolha} roughness={0.85} />
      </mesh>
      {/* Segunda folha abrindo */}
      <group position={[0.4, 0, 0]} rotation={[0, -angAbre, 0]}>
        <mesh position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 1.1, 0.012]} />
          <meshStandardMaterial map={texFolha} roughness={0.85} opacity={0.9} transparent />
        </mesh>
      </group>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// CALENDÁRIO: calendário 3D com folhas virando
// ═══════════════════════════════════════════════════════════════
export const Calendario: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  mes?: string;
  ano?: string;
  folhasViradas?: number;
  totalFolhas?: number;
  trava?: boolean;
  travaK?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, mes = 'JAN', ano = '2023', folhasViradas = 0, totalFolhas = 3, trava = false, travaK = 0, escala = 1}) => {
  const texCapa = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 512;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = tema.branco;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = tema.acento;
    ctx.fillRect(0, 0, 512, 160);
    ctx.font = '800 100px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mes, 256, 80);
    if (ano) {
      ctx.font = '600 64px "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = tema.texto;
      ctx.fillText(ano, 256, 360);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [mes, ano, tema.acento, tema.branco, tema.texto]);

  const angFolha = folhasViradas > 0 ? -Math.PI * Math.min(1, folhasViradas) : 0;

  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Bloco base */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 1.2, 0.08]} />
        <meshStandardMaterial map={texCapa} roughness={0.7} />
      </mesh>
      {/* Espiral */}
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.66, 0.06]}>
          <torusGeometry args={[0.07, 0.018, 10, 20]} />
          <meshStandardMaterial color={tema.objetoEscuro} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      {/* Folha virando */}
      {totalFolhas > 0 && folhasViradas > 0 && (
        <group position={[0, 0.66, 0.05]} rotation={[angFolha, 0, 0]}>
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.95, 1.0, 0.01]} />
            <meshStandardMaterial color={tema.branco} roughness={0.9} opacity={0.95} transparent />
          </mesh>
        </group>
      )}
      {/* Cadeado se travado */}
      {trava && travaK > 0 && (
        <group position={[0.55, 0.1, 0.1]} scale={travaK * 0.7}>
          <Caixa args={[0.28, 0.22, 0.1]} raio={0.03} cor={tema.acento} position={[0, -0.09, 0]} />
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.09, 0.025, 10, 20, Math.PI]} />
            <Fosco cor={tema.acento} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// MOEDA PILHA: pilha de moedas que cresce/desaparece
// ═══════════════════════════════════════════════════════════════
export const MoedaPilha: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  altura?: number;
  nMoedas?: number;
  escala?: number;
}> = ({pos, rotY = 0, altura = 1, nMoedas = 6, escala = 1}) => {
  const corMoeda = '#C8A630';
  const moedasVisiveis = Math.ceil(nMoedas * altura);
  const fracaoParcial = (nMoedas * altura) - Math.floor(nMoedas * altura);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {Array.from({length: moedasVisiveis}).map((_, i) => {
        const esc = i === moedasVisiveis - 1 && fracaoParcial > 0 ? fracaoParcial : 1;
        return (
          <group key={i} position={[0, i * 0.12, 0]} scale={[1, esc, 1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.1, 28]} />
              <meshStandardMaterial color={corMoeda} roughness={0.25} metalness={0.7}
                emissive={corMoeda} emissiveIntensity={0.12} />
            </mesh>
            <mesh position={[0, 0.052, 0]}>
              <cylinderGeometry args={[0.27, 0.27, 0.01, 28]} />
              <meshStandardMaterial color="#E8C240" roughness={0.15} metalness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// BARRAS DUPLAS: gráfico comparativo alta vs queda
// ═══════════════════════════════════════════════════════════════
export const BarrasDuplas: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  altaK?: number;
  quedaK?: number;
  escala?: number;
}> = ({tema, pos, rotY = 0, altaK = 1, quedaK = 1, escala = 1}) => {
  const altaH = 2.0 * altaK;
  const quedaH = 1.0 * quedaK;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      {/* Base */}
      <Caixa args={[1.6, 0.08, 0.5]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      {/* Barra ALTA (marsala) */}
      <group position={[-0.42, 0, 0]}>
        <Caixa args={[0.52, Math.max(0.04, altaH), 0.38]} raio={0.04}
          cor={tema.acento} position={[0, 0.08 + Math.max(0.04, altaH) / 2, 0]} />
        {altaK > 0.3 && (
          <mesh position={[0, 0.1 + altaH + 0.18, 0]}>
            <planeGeometry args={[0.44, 0.2]} />
            <LabelTex label="100%" cor={tema.acento} />
          </mesh>
        )}
      </group>
      {/* Barra QUEDA (cinza) */}
      <group position={[0.42, 0, 0]}>
        <Caixa args={[0.52, Math.max(0.04, quedaH), 0.38]} raio={0.04}
          cor={tema.objeto} position={[0, 0.08 + Math.max(0.04, quedaH) / 2, 0]} />
        {quedaK > 0.3 && (
          <mesh position={[0, 0.1 + quedaH + 0.18, 0]}>
            <planeGeometry args={[0.44, 0.2]} />
            <LabelTex label="50%" cor={tema.textoSuave} />
          </mesh>
        )}
      </group>
    </group>
  );
};
