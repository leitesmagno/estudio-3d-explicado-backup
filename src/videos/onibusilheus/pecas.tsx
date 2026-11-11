import React from 'react';
import {Caixa, Fosco, Placa, type V3} from '../../base/pecas';
import {ESCURO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 016. ônibus de ilhéus: a Avenida do Tempo (asfalto, pontos de ônibus com a data),
// as garagens das empresas, o prédio da Sutram, a régua do contrato de 2003, a ampulheta do prazo
// de 1 ano, a caixa do orçamento que esvazia, o documento em pé e o "?" das perguntas.

/** Cores de apoio do vídeo, todas tiradas do tema. */
export const coresON = (tema: Tema) => {
  const F = tema.festa ?? ESCURO.festa!;
  return {
    ouro: F.dourado,
    sutram: mistura(mistura(F.azul, tema.objeto, 0.55), tema.objetoClaro, 0.15),
    alerta: mistura(F.rosa, tema.objetoEscuro, 0.45),
    asfalto: mistura(tema.objetoEscuro, tema.fundo, 0.25),
    calcada: mistura(tema.objeto, tema.objetoEscuro, 0.35),
    faixa: mistura(tema.objetoClaro, tema.objeto, 0.25),
    grama: mistura(mistura(F.verde, tema.objetoEscuro, 0.72), tema.fundo, 0.2),
    vidro: mistura(F.azul, tema.objetoClaro, 0.5),
    areia: mistura(F.dourado, tema.areia, 0.4),
  };
};

/** Altura do chão próprio (asfalto e calçadas): peças baixas somam isto. */
export const CHAO = 0.06;

// ---------- Ajudantes ----------
export const Letreiro: React.FC<{tema: Tema; texto: string; pos: V3; larg: number; aceso: number; tam?: number; rotY?: number}> = ({tema, texto, pos, larg, aceso, tam = 200, rotY = 0}) => (
  <Placa tema={tema} pos={pos} rot={[0, rotY, 0]} larg={larg} alt={larg * 0.24} linhas={[{t: texto, tam, cor: mistura(tema.objetoClaro, tema.acento, aceso), peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * aceso} />
);

/** Prédio que sobe do chão (sobe 0 a 1). Some abaixo de 0,02. */
export const Sobe: React.FC<{pos: V3; sobe: number; alt: number; rotY?: number; escala?: number; children: React.ReactNode}> = ({pos, sobe, alt, rotY = 0, escala = 1, children}) =>
  sobe < 0.02 ? null : (
    <group position={[pos[0], pos[1] - alt * escala * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]} scale={escala}>
      {children}
    </group>
  );

// ---------- A avenida ----------
/** Avenida ao longo de z (de z0 até z1, z0 > z1): asfalto, meio-fio, calçadas, tracejado e canteiros. */
export const Avenida: React.FC<{tema: Tema; z0: number; z1: number}> = ({tema, z0, z1}) => {
  const C = coresON(tema);
  const comp = z0 - z1;
  const meio = (z0 + z1) / 2;
  const tracos = Math.floor(comp / 2);
  return (
    <group>
      <mesh position={[0, 0.02, meio]} receiveShadow>
        <boxGeometry args={[3.2, 0.04, comp]} />
        <Fosco cor={C.asfalto} aspereza={0.95} />
      </mesh>
      {[-1, 1].map((l) => (
        <group key={l}>
          <mesh position={[2.3 * l, 0.03, meio]} receiveShadow>
            <boxGeometry args={[1.4, 0.06, comp]} />
            <Fosco cor={C.calcada} aspereza={0.95} />
          </mesh>
          <mesh position={[1.62 * l, 0.045, meio]} receiveShadow>
            <boxGeometry args={[0.06, 0.09, comp]} />
            <Fosco cor={C.faixa} />
          </mesh>
          <mesh position={[5.6 * l, 0.015, meio]} receiveShadow>
            <boxGeometry args={[5.2, 0.03, comp]} />
            <Fosco cor={C.grama} aspereza={0.95} />
          </mesh>
        </group>
      ))}
      {Array.from({length: tracos}).map((_, i) => (
        <mesh key={i} position={[0, 0.043, z0 - 1 - i * 2]} receiveShadow>
          <boxGeometry args={[0.1, 0.006, 0.9]} />
          <Fosco cor={C.faixa} />
        </mesh>
      ))}
    </group>
  );
};

/** Placa de data de ponto de ônibus: poste e placa com o texto (tamanho da letra pelo comprimento). */
export const PlacaData: React.FC<{tema: Tema; pos: V3; texto: string; sobe: number; destaque?: number; rotY?: number}> = ({tema, pos, texto, sobe, destaque = 0, rotY = 0}) => {
  if (sobe < 0.02) return null;
  const tam = Math.min(300, Math.floor(900 / (Math.max(4, texto.length) * 0.62)));
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={[1, sobe, 1]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 10]} />
        <Fosco cor={tema.objeto} />
      </mesh>
      <Caixa args={[1.62, 0.7, 0.06]} raio={0.03} cor={mistura(tema.objetoEscuro, tema.acento, destaque)} emissivo={0.5 * destaque} position={[0, 1.75, -0.035]} />
      <Placa tema={tema} pos={[0, 1.75, 0]} larg={1.5} alt={0.6} linhas={[{t: texto, tam, cor: tema.tinta, peso: 850}]} fundo={tema.branco} />
    </group>
  );
};

/** Abrigo de ponto de ônibus: teto, fundo de vidro fosco, banco e dois pés. Frente para x−. */
export const PontoOnibus: React.FC<{tema: Tema; pos: V3; sobe: number; aceso?: number}> = ({tema, pos, sobe, aceso = 0}) => {
  const C = coresON(tema);
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.2}>
      <Caixa args={[1.0, 0.08, 2.2]} raio={0.03} cor={mistura(tema.objetoClaro, tema.acento, 0.6 * aceso)} emissivo={0.25 * aceso} position={[0, 2.06, 0]} />
      <Caixa args={[0.05, 1.7, 2.0]} raio={0.02} cor={C.vidro} opacidade={0.55} position={[0.42, 1.12, 0]} sombra={false} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.08, 2.0, 0.08]} raio={0.02} cor={tema.objeto} position={[0.42, 1.06, 1.0 * l]} />
      ))}
      <Caixa args={[0.36, 0.06, 1.6]} raio={0.02} cor={tema.objeto} position={[0.22, 0.5, 0]} />
    </Sobe>
  );
};

// ---------- Prédios ----------
/** Garagem de empresa de ônibus: galpão com telhado curvo, portão de enrolar e letreiro (nome na fonte do perfil). Frente para x+. */
export const Garagem: React.FC<{tema: Tema; pos: V3; nome: string; sobe: number; aceso: number; portao: number}> = ({tema, pos, nome, sobe, aceso, portao}) => {
  const C = coresON(tema);
  const fechado = Math.max(0, Math.min(1, portao));
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.8}>
      <Caixa args={[2.6, 0.12, 3.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[2.4, 1.9, 3.2]} raio={0.05} cor={tema.objeto} position={[0, 1.07, 0]} />
      <mesh position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.25, 1, 0.42]} castShadow>
        <cylinderGeometry args={[1, 1, 3.3, 28, 1, false, 0, Math.PI]} />
        <Fosco cor={mistura(tema.objeto, tema.objetoClaro, 0.3)} />
      </mesh>
      {/* vão do portão e o portão que desce */}
      <Caixa args={[0.02, 1.5, 2.2]} raio={0.01} cor={tema.objetoEscuro} position={[1.205, 0.86, 0]} sombra={false} />
      <Caixa args={[0.03, 1.5 * fechado + 0.02, 2.2]} raio={0.01} cor={C.faixa} position={[1.22, 1.61 - (1.5 * fechado) / 2, 0]} sombra={false} />
      {fechado > 0.05 ? Array.from({length: Math.max(1, Math.floor(fechado * 7))}).map((_, i) => <Caixa key={i} args={[0.035, 0.02, 2.2]} raio={0.005} cor={tema.objeto} position={[1.24, 1.55 - i * 0.2, 0]} sombra={false} />) : null}
      <Letreiro tema={tema} texto={nome} pos={[1.225, 1.82, 0]} larg={2.0} aceso={aceso} tam={nome.length > 8 ? 130 : 160} rotY={Math.PI / 2} />
    </Sobe>
  );
};

/** Prédio da Sutram: prédio baixo com letreiro e um semáforo na frente. Frente para x+. */
export const PredioSutram: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; luz: number}> = ({tema, pos, sobe, aceso, luz}) => {
  const C = coresON(tema);
  return (
    <Sobe pos={pos} sobe={sobe} alt={2.6}>
      <Caixa args={[2.0, 0.12, 2.8]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
      <Caixa args={[1.7, 1.5, 2.5]} raio={0.05} cor={C.sutram} position={[0, 0.87, 0]} />
      <Caixa args={[1.8, 0.14, 2.6]} raio={0.03} cor={tema.objetoClaro} position={[0, 1.69, 0]} />
      {[-0.8, 0, 0.8].map((z) => (
        <Caixa key={z} args={[0.02, 0.5, 0.5]} raio={0.02} cor={tema.objetoEscuro} position={[0.86, 0.95, z]} sombra={false} />
      ))}
      <Letreiro tema={tema} texto="SUTRAM" pos={[0.87, 1.42, 0]} larg={1.4} aceso={aceso} tam={190} rotY={Math.PI / 2} />
      {/* semáforo */}
      <group position={[1.4, 0, 1.0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 10]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
        <Caixa args={[0.18, 0.5, 0.18]} raio={0.04} cor={tema.objetoEscuro} position={[0, 1.7, 0]} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.095, 1.85 - i * 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <Fosco cor={i === 2 ? mistura(tema.objeto, tema.acento, luz) : tema.objeto} emissivo={i === 2 ? 0.6 * luz : 0} />
          </mesh>
        ))}
      </group>
    </Sobe>
  );
};

/** Documento em pé num suporte (contrato, lei, balanço): folha com título e linhas. Frente para z+ (gire com rotY). */
export const DocumentoPe: React.FC<{tema: Tema; pos: V3; rotY?: number; titulo: string; sub: string; escala: number; aceso?: number; aditivo?: number}> = ({tema, pos, rotY = 0, titulo, sub, escala, aceso = 0, aditivo = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.7, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, 0]} />
      <Caixa args={[0.06, 0.4, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.25, -0.05]} />
      <group position={[0, 0.95, 0]} rotation={[-0.12, 0, 0]}>
        <Caixa args={[1.0, 1.32, 0.04]} raio={0.015} cor={mistura(tema.branco, tema.acento, 0.18 * aceso)} emissivo={0.12 * aceso} />
        <Placa
          tema={tema}
          pos={[0, 0.3, 0.024]}
          larg={0.9}
          alt={0.62}
          linhas={[
            {t: titulo, tam: titulo.length > 12 ? 92 : 120, cor: tema.tinta, peso: 900},
            {t: sub, tam: sub.length > 22 ? 52 : 64, cor: tema.tinta, peso: 700, mono: true},
          ]}
          fundo={tema.branco}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Caixa key={i} args={[0.7 - (i % 2) * 0.16, 0.03, 0.006]} raio={0.002} cor={tema.objeto} sombra={false} position={[-(i % 2) * 0.08, -0.12 - i * 0.1, 0.024]} />
        ))}
        {/* a folha do aditivo, que encaixa na frente */}
        {aditivo > 0.02 ? (
          <group position={[0.12, -0.14 - 0.6 * (1 - aditivo), 0.05]} rotation={[0, 0, -0.08]}>
            <Caixa args={[0.8, 0.9, 0.02]} raio={0.01} cor={tema.objetoClaro} />
            <Placa tema={tema} pos={[0, 0.1, 0.013]} larg={0.74} alt={0.3} linhas={[{t: 'ADITIVO', tam: 170, cor: tema.tinta, peso: 900}]} fundo={tema.objetoClaro} />
            <Placa tema={tema} pos={[0, -0.2, 0.013]} larg={0.6} alt={0.2} linhas={[{t: '29/10/2026', tam: 150, cor: tema.tinta, peso: 800, mono: true}]} fundo={tema.objetoClaro} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Régua do contrato de 2003 (6 blocos de 5 anos) ----------
export const ANOS_REGUA = ['2003', '2008', '2013', '2018', '2023', '2028', '2033'];
/** Régua ao longo de z, de z = 0 a z = −6 (1 m por bloco). `acesos` de 0 a 6. `hoje` mostra o marcador de 2026. */
export const ReguaContrato: React.FC<{tema: Tema; pos: V3; sobe: number; acesos: number; hoje: number}> = ({tema, pos, sobe, acesos, hoje}) => {
  if (sobe < 0.02) return null;
  const C = coresON(tema);
  return (
    <group position={pos} scale={[1, sobe, 1]}>
      {Array.from({length: 6}).map((_, i) => {
        const k = Math.max(0, Math.min(1, acesos - i));
        return <Caixa key={i} args={[0.5, 0.22, 0.9]} raio={0.05} cor={mistura(tema.objeto, i === 0 ? C.ouro : tema.acento, 0.85 * k)} emissivo={0.3 * k} position={[0, 0.11, -0.5 - i]} />;
      })}
      {ANOS_REGUA.map((a, i) => (
        <Placa key={a} tema={tema} pos={[0, 0.5, -i]} rot={[0, -Math.PI / 2, 0]} larg={0.8} alt={0.26} linhas={[{t: a, tam: 260, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} brilho={0.3} />
      ))}
      {hoje > 0.02 ? (
        <group position={[0, 0, -4.6]} scale={[1, hoje, 1]}>
          <Caixa args={[0.06, 1.1, 0.06]} raio={0.02} cor={C.alerta} position={[0, 0.55, 0]} />
          <Placa tema={tema} pos={[0, 1.25, 0]} rot={[0, -Math.PI / 2, 0]} larg={0.7} alt={0.24} linhas={[{t: 'HOJE', tam: 260, cor: tema.objetoClaro, peso: 900}]} fundo={C.alerta} brilho={0.3} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Ampulheta do prazo de 1 ano ----------
/** Ampulheta de vidro: `areia` 1 = tudo em cima (começo do prazo), 0 = tudo embaixo (prazo vencido). */
export const Ampulheta: React.FC<{tema: Tema; pos: V3; sobe: number; areia: number; vencido: number}> = ({tema, pos, sobe, areia, vencido}) => {
  if (sobe < 0.02) return null;
  const C = coresON(tema);
  const cima = Math.max(0.02, areia);
  const baixo = Math.max(0.02, 1 - areia);
  const moldura = mistura(tema.objetoEscuro, C.alerta, vencido);
  return (
    <group position={pos} scale={sobe}>
      {[0.06, 1.74].map((y) => (
        <Caixa key={y} args={[0.9, 0.12, 0.9]} raio={0.04} cor={moldura} emissivo={0.25 * vencido} position={[0, y, 0]} />
      ))}
      {[-1, 1].flatMap((a) => [-1, 1].map((b) => <Caixa key={`${a}${b}`} args={[0.06, 1.6, 0.06]} raio={0.02} cor={moldura} position={[0.38 * a, 0.9, 0.38 * b]} />))}
      {/* os dois bulbos de vidro */}
      {[1, -1].map((l) => (
        <mesh key={l} position={[0, 0.9 + 0.4 * l, 0]} rotation={[l > 0 ? Math.PI : 0, 0, 0]}>
          <coneGeometry args={[0.34, 0.8, 28, 1, true]} />
          <meshStandardMaterial color={C.vidro} transparent opacity={0.28} roughness={0.2} side={2} depthWrite={false} />
        </mesh>
      ))}
      {/* areia de cima (cone invertido que encolhe) e de baixo (monte que cresce) */}
      <mesh position={[0, 0.9 + 0.4 * cima * 0.5 + 0.06, 0]} rotation={[Math.PI, 0, 0]} scale={[cima, cima, cima]}>
        <coneGeometry args={[0.3, 0.7, 24]} />
        <Fosco cor={C.areia} />
      </mesh>
      <mesh position={[0, 0.12 + 0.3 * baixo, 0]} scale={[baixo, baixo, baixo]}>
        <coneGeometry args={[0.3, 0.6, 24]} />
        <Fosco cor={C.areia} />
      </mesh>
    </group>
  );
};

// ---------- Caixa do orçamento ----------
/** Caixa de vidro com um bloco dourado dentro: `nivel` de 0 a 1 (1 = cheia). */
export const CaixaOrcamento: React.FC<{tema: Tema; pos: V3; sobe: number; nivel: number}> = ({tema, pos, sobe, nivel}) => {
  if (sobe < 0.02) return null;
  const C = coresON(tema);
  const h = 1.6 * Math.max(0.02, nivel);
  return (
    <group position={pos} scale={sobe}>
      <Caixa args={[1.3, 0.1, 1.3]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.05, 0]} />
      <Caixa args={[1.1, h, 1.1]} raio={0.04} cor={C.ouro} position={[0, 0.1 + h / 2, 0]} />
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.24, 1.7, 1.24]} />
        <meshStandardMaterial color={C.vidro} transparent opacity={0.2} roughness={0.15} depthWrite={false} />
      </mesh>
      <Caixa args={[1.3, 0.06, 1.3]} raio={0.02} cor={tema.objetoClaro} position={[0, 1.82, 0]} />
    </group>
  );
};

// ---------- O ponto de interrogação ----------
/** "?" grande e fosco, em pé, de frente para z+. `aceso` puxa para a marsala. */
export const Interrogacao: React.FC<{tema: Tema; pos: V3; sobe: number; aceso: number; escala?: number}> = ({tema, pos, sobe, aceso, escala = 1}) => {
  if (sobe < 0.02) return null;
  const C = coresON(tema);
  const cor = mistura(tema.objeto, C.alerta, aceso);
  return (
    <group position={pos} scale={escala * sobe}>
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.42, 0.13, 16, 40, Math.PI * 1.35]} />
        <Fosco cor={cor} emissivo={0.3 * aceso} />
      </mesh>
      <mesh position={[0.02, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.5, 20]} />
        <Fosco cor={cor} emissivo={0.3 * aceso} />
      </mesh>
      <mesh position={[0.02, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.15, 20, 16]} />
        <Fosco cor={cor} emissivo={0.3 * aceso} />
      </mesh>
      <Caixa args={[0.8, 0.12, 0.8]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.06, 0]} />
    </group>
  );
};
